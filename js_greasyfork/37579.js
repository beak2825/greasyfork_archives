// ==UserScript==
// @name         YlisToolchain
// @namespace    http://ylilauta.org/
// @version      2.0.0
// @description  Some tools for the Finnish Ylilauta imageboard
// @locale       en
// @author       Nyymi
// @match        https://ylilauta.org/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/37579/YlisToolchain.user.js
// @updateURL https://update.greasyfork.org/scripts/37579/YlisToolchain.meta.js
// ==/UserScript==

/*jshint esversion: 6 */

// This userscript has many tools and is intended for the Ylilauta image board
// Some of these hook straight into YBoard JS API so they might break or change how they work at any time
// 
// Features:
// - Tää :D bot (will give all seen messages a Tää :D)
// - thread bump bot
// - activity point farming bot
// - update activity point count with mouse hover
// - see newest post id and update it with mouse hover
// - add post formatting if not available (no gold account :D)
// - add colors to poster ids if haz gold account

(function () {
    'use strict';
    
    // We use payloading inside function to ensure jQuery has loaded when we run the actual script
    var payload = function() {

        // Initialize values in localStorage, these are used by the Tää :D bot and activity point/bumping bots
        if (localStorage.getItem('ytc_taabot') === null) localStorage.setItem('ytc_taabot', 'false');
        if (localStorage.getItem('ytc_lastmessage') === null) localStorage.setItem('ytc_lastmessage', '0');

        // Initialize all these global vars        
        var runMainVar = false, // is a bumper/ap miner bot running
            runTaaVar = false,  // is the Tää :D bot running
            newer = "",         // bump/miner bot var, new message storage
            old = "",           //  ^, old msg storage (for deleting purposes)
            text = "",          //  ^, holds the old msgarea text when bot is running
            msgs = [],          //  ^, has a queue of botted messages
            alertFunc = window.alert,           // holds window.alert closure when it's replaced with no-op
            lastH = document.body.clientHeight, // helps determining if page has new messages
            newH = document.body.clientHeight,  // ^
            maintimer = false,          // used in bump/miner bot
            taatimer = false,           // used in Tää :D bot
            newestidtimer = false,      // used when throttling getting newest post id
            ongoingsubmittimer = false, // used to allow posting when there is a bot running in other tab
            activitypointtimer = false; // used when throttling getting activity point count
        
        // We haz to use object to have setter functions (run code when we change value)
        // The reason for this is that we want to toggle the window.alert() function while using bots so there
        // will be no random alerts while using bots (YBoard JS API does them if message doesn't exist anymore)
        // 
        // These *may* not necessarily mean that a bot is running, timers show that

        // The runMain object is a boolean and shows if a poster bot (bump/ap miner) is allowed to be running
        Object.defineProperty(window, "runMain", {
            get: function () { return runMainVar; },
            set: function (v) {
                runMainVar = v;
                window.alert = (runMainVar || runTaaVar) ? function(){} : alertFunc;
            }
        });
        
        // This determines if the Tää :D bot is running (and also save choice to localStorage so it persists 
        // between new tabs)
        Object.defineProperty(window, "runTaa", {
            get: function () { return runTaaVar; },
            set: function (v) {
                runTaaVar = v;
                window.alert = (runMainVar || runTaaVar) ? function(){} : alertFunc;
                localStorage.setItem('ytc_taabot', JSON.stringify(v));
            }
        });
        
        // Simply return a numeric hash of string
        // Adapted from https://stackoverflow.com/questions/7616461#15710692
        var hash = function (s) {
            return s.split("")
                .reduce(
                    function(a, b) {
                        a = ((a<<5)-a) + b.charCodeAt(0);
                        return a & a;
                    },
                0);
        };
        
        // Return a hex color from given poster id (using the hash() function)
        var color = function (id) {
            return '#' + hash(id).toString(16).substr(-6);
        };
        
        // Add color() for each poster id with no attached styling already, this is run every time page height changes
        // Essentially this colorizes every same poster id with a same color
        var colorize = function () {
          $('#right .threads .thread .postuid:not([style])').each(function () {
              $(this).css({backgroundColor: color($(this).text())});
          });
        };
        
        // Get a nonsense random phrase (like "mjcyntg ljezmza mdy") or if we had something in our msgarea, just return it
        var newPhrase = function () {
            if (text !== "") {
                return text;
            } else {
                return btoa(Math.random()*1000000).slice(0,20).replace(/[0-9]+/g, ' ').toLowerCase().trim();
            }
        };
        
        // Activity point miner bot launch function: this works by adding sage'd messages and deleting them afterwards
        var apMiner = function () {
            // essentially: if post bot is NOT running AND we are clicking the start button, start the bot
            if (!runMain && $(this).find('input')[0].checked) {
                runMain = true;
                text = $('#msg').val();
                
                mainBot(true, 1);

            // if post bot IS running AND we are trying to stop the bot, stop it
            } else if (runMain && !$(this).find('input')[0].checked) {
                clearTimeout(maintimer);
                runMain = false;
                maintimer = false;
                
                $('#msg').val(text);
                text = "";

            // if something shitty is happening, pls stahp and cancel starting/stopping the bot
            } else {
                return false;
            }
        };
        
        // Bump bot launcher: this works a bit like the ap miner bot, but has a queue of few messages to keep thread up
        // when deleting messages. See above for more details of kkontent
        var forcePin = function () {
            if (!runMain && $(this).find('input')[0].checked) {
                runMain = true;
                text = $('#msg').val();
                
                mainBot(false, 3);
            } else if (runMain && !$(this).find('input')[0].checked) {
                clearTimeout(maintimer);
                runMain = false;
                maintimer = false;
                
                $('#msg').val(text);
                text = "";
            } else {
                return false;
            }
        };
        
        // Will give the newest post id (read from Ylilauta main page)
        var newestidr = function (e) {
            $.get('/', function (r) {
                $(e).find('span').text($('#title h2', r)[0].innerText.match(/[0-9]+/g).join(''));
            });
        };
        
        // Will give the current count of activity points (read like in newestidr() function)
        var activitypointr = function (e) {
            $.get('/', function (r) {
                $('#left nav.user .activitypoint').text($('nav.user a[href="/preferences?profile"]', r).text());
            });
        };
        
        // Tää :D bot launcher, a bit different from above ones
        var taaMachine = function () {
            // if Tää :D bot is NOT running AND we are starting it AND we haz over nine thousand activity points, start the bot
            if (!runTaa && $('#left nav.user .taabot input')[0].checked && +($('#left nav.user .activitypoint')[0].innerText.match(/(\d+)/g).join("")) > 9000) {
                // plz note that the msgs var is different from the more global one, which is used in miner and bump bot
                // this msgs is just a placeholder to get all post elements, msgids is a shuffled array of all message ids
                var msgids = [],
                    msgs = document.querySelectorAll("div[data-msgid]");
        
                for (var i = 0; i < msgs.length; i++) {
                    var msgid = msgs[i].dataset.msgid;
                    if (!msgids.includes(msgid)) msgids.push(msgid);
                }
                
                msgids.sort(function(i) {return Math.random()*2-1;});
        
                runTaa = true;
                taaBot(msgids.length-1, msgids);

            // if Tää :D bot IS running AND we are stopping the bot, do the Stuntti Seis maneuvre
            } else if (runTaa && !$(this).find('input')[0].checked) {
                clearTimeout(taatimer);
                runTaa = false;
                taatimer = false;
            // else, wtf :D
            } else {
                return false;
            }
        };
        
        // This bot keeps an eye in our localStorage and sees if we are having a bump/miner bot running in other tab
        // If it is the case, it will precisely delay the post event until we have a timeframe where we may post
        // without YBoard spam filter interrupting it because of our bot posting things
        //
        // Reminder: if we can post off the bat, this function will just submit the post
        var submitBot = function (clicked = false) {
            // canpost is a timestamp when we may post, got from localStorage
            var now = Date.now(),
                canpost = (+localStorage.getItem('ytc_lastmessage')) + 11000;
            
            // if we had started to wait for post event but clicked a second time, it means we changed our mind
            // => no post will occur
            if (clicked && (ongoingsubmittimer !== false)) {
                clearInterval(ongoingsubmittimer);
                ongoingsubmittimer = false;
                
                // flash a cancel'd message
                $('#submit').attr('value', 'Peruttu');
                setTimeout(function () { $('#submit').attr('value', 'Lähetä'); }, 1000);
            
            // if we must wait a while, show how many seconds until posting
            } else if (now < canpost) {
                $('#submit').attr('value', 'Odotetaan ' + Math.floor((canpost-now)/1000) + 's');
                
                if (ongoingsubmittimer === false) {
                    ongoingsubmittimer = setInterval(submitBot, 1000);
                }

            // if we may post, do it!
            } else {
                $('#post').submit();
                $('#submit').attr('value', 'Lähetetty!');
                
                if (ongoingsubmittimer !== false) {
                    clearInterval(ongoingsubmittimer);
                    ongoingsubmittimer = false;
                }
                
                setTimeout(function () { $('#submit').attr('value', 'Lähetä'); }, 1000);
            }
        };
        
        // Activity point miner/bumper bot
        // Control flow (runs only if box is ticked):
        // - get a new nonsense phrase (or the thing written in msgarea, if we had some when starting the bot)
        // - delete oldest message, if we have to
        // - tick the sage option at will
        // - set msgarea text
        // - try to submit (may fail on spam filter)
        // - save submit time to localStorage
        // - schedule the rerun of this function
        var mainBot = function (sage = false, count = 3) {
            if (runMain) {
                newer = newPhrase();
                if (msgs.unshift(newer) > count && $('#right .threads .thread .threadbuttons .delete-messages input')[0].checked) {
                    deleteMessage(
                        $('.own_post .postcontent:contains("' + msgs.pop() + '"):first')
                            .closest('.own_post')
                            .data('msgid'), 
                        true
                    );
                }
                if (sage) {
                    $('#postoptions input[name="sage"]')[0].checked = true;
                }
                $('#msg').val(newer);
                $('#submit').submit();
                localStorage.setItem('ytc_lastmessage', Date.now());
                old = newer;
                
                maintimer = setTimeout(function () {
                    mainBot(sage, count);
                }, 12000);
            }
        };
        
        // Tää :D bot
        // Control flow (runs only if box is ticked):
        // - call YBoard JS API to gibe Tää :D to next post in shuffled message id array
        // - check if we haz over nine thousand activity points
        // - if we have more messages to Tää :D and still enough activity points, schedule next run in a second
        var taaBot = function (i, msgids) {
            if (runTaa) {
                add_this(msgids[i]);
                
                var enoughaps = $('#left nav.user .taabot input')[0].checked && +($('#left nav.user .activitypoint')[0].innerText.match(/(\d+)/g).join("")) > 9000;
                
                if (--i && enoughaps) {
                    taatimer = setTimeout(function () {
                        taaBot(i, msgids);
                    }, 1000);
                } else {
                    taatimer = false;
                }
            }
        };
        
        // Add thread button toggles for miner/bump bot and bot post deletion (located below replies)
        $('.threadbuttons .buttons_right').each(function () {
            $(this).append('<label class="linkbutton ap-bot"><input type="checkbox" style="vertical-align:top"> Aktiivisuuspistelouhija</label>');
            $(this).append('<label class="linkbutton bumpbot"><input type="checkbox" style="vertical-align:top"> Bumppibotti</label>');
            $(this).append('<label class="linkbutton delete-messages"><input type="checkbox" checked style="vertical-align:top"> Poista viestit</label>');
        });

        // Order code to be run on onChange event of those buttons
        $('.threadbuttons .buttons_right .ap-bot').change(apMiner);
        $('.threadbuttons .buttons_right .bumpbot').change(forcePin);

        // Clean up spacing mess caused by whitespace
        $('.threadbuttons .buttons_right').each(function () {
            $(this).contents().each(function () {
                if (this.nodeType === 3 && !(/\S/.test(this.nodeValue))) {
                    this.remove();
                }
            });
        });
        
        // Disable the adblock notification, add some style to poster ids and free the floating post form width
        $("<style type='text/css'>#blocking-notification {display: none !important;} #right .threads .thread .postuid {text-shadow: white 0px 0px 5px;} #right form#post.reply.asyncreply {width: initial;}</style>").appendTo("head");
        
        // Allow mouseover update of the activity point count
        $('#left nav.user a[href="/preferences?profile"]').addClass('activitypoint');
        
        // Show newest post id in side panel (and allow its mouseover update)
        $('#left .user').append('<li style="cursor:pointer;" class="newestid">Newest ID: <span></span></li>');
        newestidr($('.newestid')[0]);
        
        // Add a button to toggle Tää :D bot
        $('#left .user').append('<label class="linkbutton taabot"><input type="checkbox" style="vertical-align:top"> T&auml;&auml; :D</label>');
        $('#left .user .taabot').change(taaMachine);
        
        // Newest post id mouseover update code
        $('.newestid').on('mouseenter', function (e) {
            newestidr($(e.target).closest('.newestid'));
            newestidtimer = setInterval(function () {
               $.get('/', function () {
                   newestidr($(e.target).closest('.newestid'));
               }
            );}, 2000);
        }).on('mouseleave', function () {
            clearInterval(newestidtimer);
            newestidtimer = false;
        });
        
        // Activity point mouseover update code
        $('.activitypoint').on('mouseenter', function (e) {
            activitypointr($(e.target).closest('.activitypoint'));
            activitypointtimer = setInterval(function () {
               $.get('/', function () {
                   activitypointr($(e.target).closest('.activitypoint'));
               }
            );}, 2000);
        }).on('mouseleave', function () {
            clearInterval(activitypointtimer);
            activitypointtimer = false;
        });
        
        // Do not trigger straight submit event on post submit, run it through our submit checker function
        $('#submit').attr('type', 'button');
        $('#submit').click(function(){submitBot(true);});
        
        // Tää :D every message on page load :D
        if (JSON.parse(localStorage.getItem('ytc_taabot'))) {
            $('#left .user .taabot input')[0].checked = true;
            taaMachine();
        }
        
        // Colorize poster ids (if we have some) and do it also when new messages are added to page
        if ($('#right .thread .postuid:first').length !== 0) {
            colorize();
        
            setInterval(function () {
                newH = document.body.clientHeight;
                if (lastH !== newH) {
                    lastH = newH;
                    colorize();
                }
            }, 500);
        }
        
        // If we don't have a post buttons dialog (like if having no gold account), add it :D
        if ($('#post').length === 1 && $('#postbuttons').length === 0) {
            $('#embedtype').after(
                `<div id="postbuttons">
                    <a class="icon-bold" onclick="addBbCode('b')"></a>
                    <a class="icon-italic" onclick="addBbCode('em')"></a>
                    <a class="icon-strikethrough" onclick="addBbCode('s')"></a>
                    <a class="icon-underline" onclick="addBbCode('u')"></a>
                    <a class="icon-eye-crossed" onclick="addBbCode('spoiler')"></a>
                    <a class="icon-plus" onclick="addBbCode('big')"></a>
                    <a class="icon-minus" onclick="addBbCode('small')"></a>
                    <a class="icon-bubble-quote" onclick="addBbCode('quote')"></a>
                    <a class="icon-code" onclick="addBbCode('code')"></a>
                    <a class="icon-superscript" onclick="addBbCode('sup')"></a>
                    <a class="icon-subscript" onclick="addBbCode('sub')"></a>
                    <a class="icon-palette" onclick="$('#colorbuttons').toggle()"></a>
                    <a class="icon-popout right" onclick="$('#post').toggleClass('asyncreply')"></a>
                    <div id="colorbuttons" style="display: none;">
                        <a class="icon-palette black" onclick="addBbCode('black')"></a>
                        <a class="icon-palette gray" onclick="addBbCode('gray')"></a>
                        <a class="icon-palette white" onclick="addBbCode('white')"></a>
                        <a class="icon-palette brown" onclick="addBbCode('brown')"></a>
                        <a class="icon-palette red" onclick="addBbCode('red')"></a>
                        <a class="icon-palette orange" onclick="addBbCode('orange')"></a>
                        <a class="icon-palette yellow" onclick="addBbCode('yellow')"></a>
                        <a class="icon-palette green" onclick="addBbCode('green')"></a>
                        <a class="icon-palette blue" onclick="addBbCode('blue')"></a>
                        <a class="icon-palette purple" onclick="addBbCode('purple')"></a>
                        <a class="icon-palette pink" onclick="addBbCode('pink')"></a>
                    </div>
                </div>`);
        }
    };

    // We require jQuery for the whole thing to work, so let's wait for its deferred load on page load
    var checker = function () {
        if (!window.$) {
            setTimeout(checker, 100);
        } else {
            payload();
        }
    }
    
    checker();
})();