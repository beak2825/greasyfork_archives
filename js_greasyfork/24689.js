// ==UserScript==
// @name         silvermafia.net automation script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  automates actions on silvermafia.net, a text based mafia game and crypto-coin faucet.
// @author       damncourier
// @match        http://www.silvermafia.net/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/color-thief/2.0.1/color-thief.min.js
// @downloadURL https://update.greasyfork.org/scripts/24689/silvermafianet%20automation%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/24689/silvermafianet%20automation%20script.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var ourPath = window.location.pathname;
    if ((! window.jQuery)&&(! ourPath.match(/(.css|.js)$/))) {
        window.setTimeout( function() {
            window.location = "http://"+window.location.hostname;
        }, 10000);
    } else {
        var smbRunning = localStorage.smbRunning;
        jQ("<style>").prop("type", "text/css").html(".smbWin { background-color: #333; opacity: 0.8; position: absolute; z-index: 100; padding: 5px; }").appendTo("head");
        var smbHook = '<div id="smb" class="smbWin" style="left: 0px; top: 0px;">'+
            '<form id="smb-form"><ul><li><h5 style="background-color: #AAA; padding: 3px;">Silver Mafia Bot (SMB)</h5></li><li><label><input '+
            'type="checkbox" name="smb-running" value="checked" '+ smbRunning + '> Run Scripts</label> | '+
            '<span id="smb-settings-btn" style="cursor: pointer;">Settings</span></li></ul></form></div>';
        jQ("body").append(smbHook);
        jQ("input[name=smb-running]").change( function(){ if(this.checked){localStorage.smbRunning='checked';}else{localStorage.smbRunning='';} location.reload();} );
/*        jQ("#smb-settings-btn").click(function(){
            if (jQ("#smb-settings").length) {
                jQ("#smb-settings").remove();
            } else {
                jQ.getScript('https://code.jquery.com/ui/1.12.1/jquery-ui.js', function() {
                    var offset = jQ("#smb-settings-btn").offset();
                    offset.top += 20;
                    jQ('head').append('<link rel="stylesheet" type="text/css" href="http://code.jquery.com/ui/1.12.1/themes/dark-hive/jquery-ui.css">');
                    jQ("body").append('<div id="smb-settings" class="smbWin" style="top: '+Math.floor(offset.top)+'px;"></div>');
                    if (! jQ("#smb-actions").length) {
                        var smbActions = jQ("<ul></ul>", {id: "smb-actions"}).html('<li>group1</li><li>group2</li>');
                        smbActions.sortable();
                        smbActions.appendTo("#smb-settings");
                    }
                });
            }
        });*/
        if (! smbRunning) {
            return true;
        }
        /*        jQ("body").append('<div id="smb" style="background-color: #333; opacity: 0.8; position: absolute; left: 0px; top: 0px; z-index: 100; padding: 5px;"></div>');
        var smbMenu = jQ("<ul>", {id: "smb-menu", style: "width: 150px;" })
           .html('<li class="ui-widget-header" style="0.2em;"><div>Silver Mafia Bot (SMB)</div></li><li><div>Pause Scripts</div></li>');
        jQ("#smb").append(smbMenu);
*/
        //        jQ('head').append('<link rel="stylesheet" type="text/css" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">'); https://code.jquery.com/ui/1.12.1/jquery-ui.js
        //        smbMenu.menu({ items: "> :not(.ui-widget-header)" });
        var ourCash = jQ('#stats_cash').text().replace(/\,/g,'').substring(2);
        var ourBank = jQ('#stats_bank').text().replace(/\,/g,'').substring(2);
        if (jQ('img[src$="event_present.png"]').length) {
            jQ('img[src$="event_present.png"]').click();
        } else if (ourPath.match(/^\/event\/click\//)) { // /event/click/5da1f8e9
            window.setTimeout( function() {
                //window.history.back();
                window.location = document.referrer;
            }, 3000);
        } else if (jQ(":submit[name=clickmission]").length) {
            jQ(":submit[name=clickmission]").click();
        } else if (ourPath == '/') {
            setInterval(
                function() {
                    if (jQ('#cdtimer_14 > a').length) { // gym
                        window.location = window.location.href + jQ('#cdtimer_14 > a').attr('href');
                    } else if (jQ('#cdtimer_15 > a').length) { // wheel of fortune
                        window.location = window.location.href + jQ('#cdtimer_15 > a').attr('href');
                    } else if (jQ('#cdtimer_16 > a').length) { // family wheel of fortune
                window.location = window.location.href + jQ('#cdtimer_16 > a').attr('href');
            } else if (jQ('#cdtimer_0 > a').length) { // crimes // cdtimer_17
                window.location = window.location.href + jQ('#cdtimer_0 > a').attr('href');
            }  else if (jQ('#cdtimer_17 > a').length) { // family crimes
                window.location = window.location.href + jQ('#cdtimer_17 > a').attr('href');
            } else if (jQ('#cdtimer_3 > a').length) { // steal cars
                window.location = window.location.href + jQ('#cdtimer_3 > a').attr('href');
            } else if (jQ('#cdtimer_13 > a').length) { // boxing
                window.location = window.location.href + jQ('#cdtimer_13 > a').attr('href');
            } else if (jQ('#cdtimer_6 > a').length) { // dem hoes
                window.location = window.location.href + "red-light-district/search";
            } else if (jQ('#cdtimer_21 > a').length) { //  hi/lo // cdtimer_21 on family
                window.location = window.location.href + jQ('#cdtimer_21 > a').attr('href');
            } else if (jQ('#cdtimer_2 > a').length) { // marksmanship
                window.location = window.location.href + jQ('#cdtimer_2 > a').attr('href');
            } else if (ourCash > 650000) { // safe the cash
                window.location = window.location.href + "safe";
            } else if (ourBank > 1008000) { // buy the weapons
                window.location = window.location.href + "shop/weapons";
            }
                }, 1000);
        } else if (ourPath == '/cars/steal') {
            if (jQ(":radio[value=4]").length) {
                jQ(":radio[value=4]").trigger('click');
                captchaSolve();
            } else if (jQ(".info_bad").length) {
                window.location = "http://"+window.location.hostname;
            } else {
                window.location = "http://"+window.location.hostname+"/cars";
            }
        } else if (ourPath == '/cars') {
            if (jQ("#car0").length) {
                jQ("#carall").click();
                multiform(0,'dealer');
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/cars/dealer') {
            if (jQ(":submit[name=confirm]").length) {
                console.log("confirm text"+jQ(":submit[name=confirm]").text());
                jQ(":submit[name=confirm]").click();
            } else  {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/crimes') {
            if (jQ(":radio[value=8]").length) {
                jQ(":radio[value=8]").trigger('click');
                captchaSolve();
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/family/crimes') {
            if (jQ(":radio[value=4]").length) {
                jQ(":radio[value=4]").trigger('click');
                captchaSolve();
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/prison') {
            window.setTimeout( function() {
                window.location = window.location.href + '/pay/damncourier/';
            }, 5000);
        } else if (ourPath == '/prison/pay/damncourier') {
            window.location = "http://"+window.location.hostname;
        } else if (ourPath == '/wheel-of-fortune') {
            if (jQ('#info > form').length) {
                console.log("form found!");
                jQ('#info > form').submit();
                window.setTimeout(function(){ window.location = "http://"+window.location.hostname; },6000);
            } else {
                console.log("form not found!");
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/family/wheel-of-fortune') {
            if (jQ('#info > form').length) {
                console.log("form found!");
                jQ('#info > form').submit();
                window.setTimeout(function(){ window.location = "http://"+window.location.hostname; },6000);
            } else {
                console.log("form not found!");
                window.location = "http://"+window.location.hostname;
            }
        } else if ((ourPath == '/red-light-district/search')||(ourPath == '/boxing')) {
            if (jQ( "input[name='sess']" ).length) {
                captchaSolve();
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/sports-hall') {
            if (jQ( "input[name='sess']" ).length) {
                jQ("input[value='basketball']").click();
                captchaSolve();
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/higher-lower') {
            if (jQ(":submit[value=Higher]").length) {
                var theNumber = jQ(".tsub:contains('The number')").parents(".content_table").text().match(/\d+/);
                //console.log("number: "+theNumber);
                if (theNumber<50) {
                    jQ(":submit[value=Higher]").click();
                } else {
                    jQ(":submit[value=Lower]").click();
                }
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/safe') {
            if (ourCash > 150000) {
                // console.log(ourCash);
                jQ("input[name='amount']").val(ourCash-150000);
                jQ("input[name='deposit']").click();
            } else {
                window.location = "http://"+window.location.hostname;
            } // name="buy" value="150,0,5600" // shop/weapons
        } else if (ourPath == '/shop/weapons') {
            if (ourBank > 1008000) {
                console.log(ourBank);
                var weaponForm = jQ("input[value='150,0,5600']").parents('form :first');
                weaponForm.find(":text").val("90");
                jQ("input[name='bank']").click();
            } else {
                window.location = "http://"+window.location.hostname+"/shop/protection";
            } // name="buy" value="0,150,5600"
        } else if (ourPath == '/shop/protection') {
            if (ourBank > 504000) {
                console.log(ourBank);
                var protectionForm = jQ("input[value='0,150,5600']").parents('form :first');
                protectionForm.find(":text").val("90");
                jQ("input[name='bank']").click();
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } else if (ourPath == '/shooting') {
            if (typeof startgame == 'function' && bullets > 1) {
                var liveTargets = [];
                jQ('img[id^="target"]').each( function(){ liveTargets.push(this.id); } );
                var totalTargets = 0;

                /*
                var targetCount = 0;
                var creditTargets = 0;
                for (var i=0;i<offsets.length;i++) {
                    //if (offsets[i] < 580) {
                    targetCount = i;
                    if (jQ("#"+liveTargets[i]).attr('src').match(/stats_credits.png$/)) {
                        creditTarget++;
                    }
                    //}
                }
                totalTargets = Math.floor(targetCount / 3);
                console.log("targets: "+targetCount+" credits: "+creditTargets);
                score = totalTargets+creditTargets;
                for (var i=0;i<totalTargets;i++) {
                    score += Math.floor(Math.random()*5);
                }
                //        score = Math.floor(((totalTargets-creditTargets)+(totalTargets-creditTargets)*5)+creditTargets); // Math.floor(score + 3 + Math.random()*4)
                score2 = creditTargets;
                //        score3 = 0;
                score3 = totalTargets+creditTargets;
                console.log("score: "+score+" score2: "+score2+" score3: "+score3);
                new Ajax.Request('shooting', { // http://www.silvermafia.net/images/icons/set_1/stats_credits.png
                    method: 'post',
                    parameters: 'start=1',
                    onSuccess: function(transport) {
                        console.log(JSON.stringify(transport));
                        gameid = transport.responseText;
                        window.setTimeout(function(){
                            new Ajax.Request('shooting', {
                                method: 'post',
                                //parameters: 'game='+gameid+'&score='+score+'&score2='+score2+'&score3='+score3,
                                parameters: 'game='+gameid+'&score='+score+'&score2='+score2+'&score3='+score3,
                                onSuccess: function(transport) {
                                    console.log(JSON.stringify(transport));
                                    window.location = "http://"+window.location.hostname;
                                    //location.reload();
                                }
                            });
                        }, 30000);
                    }
                });

                */
//                var clickedTargets = 0;
                var targetTimer = setInterval(function(){
                    //    console.log("check targets "+targets.length);
                    for(var i=0;i<liveTargets.length;i++) {
                        var targetPos = jQ("#"+liveTargets[i]).position();
                        if (targetPos.left>50&&targetPos.left<450) {
                            //                    console.log("target: "+i);
                            //                    console.log(jQ("#"+liveTargets[i]).attr('src'));
                            //                    console.log("match: "+ jQ("#"+liveTargets[i]).attr('src').match(/stats_credits.png$/) );
//                                                if ((clickedTargets < 4)||(jQ("#"+liveTargets[i]).attr('src').match(/stats_credits.png$/))) {
                            document.getElementById(liveTargets[i]).click();
//                                                    clickedTargets++;
//                                                }
                            liveTargets.splice(i, 1);
                        }
                    }
                                if (score3 > 0) {
                score = ((score3 - score2) * 5) + (score2 * 2);
            }
                    if (liveTargets.length===0) {
                        clearInterval(targetTimer);
                    }
                }, 250);

                window.setTimeout( function() {
                    //        alert("score: "+score+" score2: "+score2+" score3: "+score3);
                    window.location = "http://"+window.location.hostname;
                    //location.reload();
                }, 32000);
                score3++;
                startgame();
            } else {
                window.location = "http://"+window.location.hostname;
            }
        } /* else {
    window.location = "http://"+window.location.hostname;
}*/
    }
    function captchaSolve() {
        console.log("solver!");
        jQ(".good").click();
    }
    /*    function captchaSolve() {
        var colorThief = new ColorThief();
        var captchaForm = jQ( "input[name='sess']" ).parents('form :first');
        //console.log( "submits found: "+ captchaForm.children(":submit").length );

        var submitButtons = [];
        var captchaColors = [];
        var imagesLoaded = 0;
        captchaForm.children(":submit").each( function(index, element) {
            submitButtons[index] = element;
            var bg = jQ(element).css('background-image');
            bg = bg.replace('url(','').replace(')','').replace(/\"/gi, "");
            //    console.log(index + " : " + bg);
            var img = jQ('<img id="captchaImage-'+index+'">');
            img.attr('src', bg);
            img.load(function(){
                var color = colorThief.getColor(this);
                //console.log(this.id.match(/\d+$/)+" : "+JSON.stringify(color));
                jQ(this).hide();
                captchaColors[this.id.match(/\d+$/)] = color;
                imagesLoaded++;
            });
            img.appendTo('body');
        });

        var captchaTimer = setInterval(function(){
            if (imagesLoaded==4) {
                // console.log(captchaColors.length+" : "+JSON.stringify(captchaColors));
                clearInterval(captchaTimer);
                var hiGreen = 0;
                var hiIndex;
                for(var i=0;i<captchaColors.length;i++){
                    var rgb = captchaColors[i];
                    // console.log(JSON.stringify(hiGreen+" : "+rgb));
                    if (rgb[1] > hiGreen) {
                        hiGreen = rgb[1];
                        hiIndex = i;
                    }
                }
                //console.log(hiIndex+" : "+ hiGreen);
                submitButtons[hiIndex].click();
            }
        }, 500);
    }*/
})();