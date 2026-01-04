// ==UserScript==
// @name        Flashback oändlig bläddring
// @author Leif-Bengt Viktor & Anteus. Minimodifierad av Splitface
// @description Laddar nästa sida nedanför aktuell trådsida så länge det är möjlig
// @include     https://www.flashback.org/*
// @version     0.5.3.3
// @grant      none
// @noframes
// @namespace https://greasyfork.org/users/24198
// @downloadURL https://update.greasyfork.org/scripts/31990/Flashback%20o%C3%A4ndlig%20bl%C3%A4ddring.user.js
// @updateURL https://update.greasyfork.org/scripts/31990/Flashback%20o%C3%A4ndlig%20bl%C3%A4ddring.meta.js
// ==/UserScript==


function initiateFlasher(arg) {
    if (arg) {
        $ = arg;
    }
    var ajaxQueue = [],
        processAjaxQueue = function () {
            if (ajaxQueue.length > 0) {
                for (ajax in ajaxQueue) {
                    var obj = ajaxQueue[ajax];

                    try {
                        GM_xmlhttpRequest(obj);
                    } catch (e) {}
                }
                ajaxQueue = [];
            }
        },
        Flasher = {};

    setInterval(function () {
        processAjaxQueue();
    }, 0); //100

    function gmAjax(obj) {
        ajaxQueue.push(obj);
    }

    Flasher.defaultSettings = {
        autoLoadPage: {
            value: true,
            label: 'Laddar nästa sida när nuvarande sidans sista inlägg nås',
            html: '<input type="checkbox"/>'
        },
        fixLeaveLinks: {
            value: true,
            label: 'Tar bort Flashback.org/leave.php från länkar',
            html: '<input type="checkbox"/>'
        },
        fixPrenumerationAll: {
            value: true,
            label: 'Ändrar prenumerationslänk till visning-av-alla-prenumarationer-länk',
            html: '<input type="checkbox"/>'
        },
        unvis: {
            value: true,
            label: 'Lägg till unvis.it framför vissa mediewebbsidor',
            html: '<input type="checkbox"/>'
        },
        quickNavbar: {
            value: true,
            label: 'Lägger till genvägar på aktuella ämnen',
            html: '<input type="checkbox"/> <input id="quicknavcolor" type="color value="#4169e1" '
        },
        navBarColors: {
            value: false,
            label: 'Sätter lite färg på forumnavigeringsmenyn',
            html: '<input type="checkbox"/>'
        },
		navBarStay: {
            value: false,
            label: 'Hindrar forummenyn att ligga kvar vid scrollning',
            html:  '<input type="checkbox"/>'
        }
    };
    Flasher.currentSettings = {};
    Flasher.init = function (refresh) {


        if (!refresh) {
            Flasher.setupSettings();
            Flasher.setupStatus();
        }
      
        Flasher.setupCacheCollections();
        Flasher.fixPrenumerationAll();
        Flasher.navBarColors();

        if (Flasher.status.isTopic || Flasher.status.isPM || Flasher.status.isSinglePost) {
            Flasher.setupUnvis();
            Flasher.fixLeaveLinks();

            if (!refresh && !Flasher.status.isPM && !Flasher.status.isPMReply) {
                $('a[title*="Nästa sida"]:first').attr('title', 'Nästa sida');
                Flasher.setupAutoLoadPage();
            }
        } else if (Flasher.status.isAktuella){
            Flasher.quickNavbar();            
        }
    };

    Flasher.setupSettings = function () {
        $.each(Flasher.defaultSettings, function (key, value) {
            Flasher.currentSettings[key] = {
                label: Flasher.defaultSettings[key].label,
                html: Flasher.defaultSettings[key].html
            };
            var userChoice = localStorage.getItem(key),
                choice;

            if (userChoice !== null) {
                choice = userChoice;
            } else {
                choice = Flasher.defaultSettings[key].value;
            }

            if (typeof choice === 'string') {
                if (choice.match(/true/i)) {
                    Flasher.currentSettings[key].value = true;
                } else if (choice.match(/false/i)) {
                    Flasher.currentSettings[key].value = false;
                } else if (choice.match(/^[0-9]+$/i)) {
                    Flasher.currentSettings[key].value = parseInt(choice, 10);
                } else {
                    Flasher.currentSettings[key].value = choice;
                }
            } else {
                Flasher.currentSettings[key].value = choice;
            }
        });
    };

    Flasher.setupAutoLoadPage = function () {
        if(Flasher.currentSettings.autoLoadPage.value){
            $(window).scroll(function () {
                if ($(window).scrollTop() > $(document).height() - $(window).height() - 500 && !Flasher.isFetchingNewPage) {
                    Flasher.isFetchingNewPage = true;
                    var $next = $('a[title*="Nästa sida"]:last');

                    if ($next.length && $next.attr('href').length > 1) {
                        var nextUrl = window.location.protocol + '//' + window.location.hostname + $next.attr('href');

                        
                        $.ajax({
                            url: nextUrl,
                            success: function (html) {
                                var $newDom = $(html);
                                jQuery('.row.row-forum-toolbar:last').html($newDom.find('.row.row-forum-toolbar:last').html());
                                var nextsidenavbar = $newDom.find('.row.row-forum-toolbar').html();
                                jQuery('div').filter('#posts:last').after('<div id="posts">' + '<br>' + nextsidenavbar + '<br><br><br></div>');
                                jQuery('a[title*="Nästa sida"]:eq(-0)').attr('title', '');
                                jQuery('div').filter('#posts:last').after($newDom.find('#posts'));
                                window.history.pushState('', document.title, nextUrl);
                                Flasher.isFetchingNewPage = false;
								
								$('[data-toggle="hidden"]').off('click');
                                $('[data-toggle="hidden"]').click(function () {
                                    var e = $(this).data("target") || $(this).next();
                                    $(e).toggleClass("hidden")
                                });
								
								$('[rel="remote-modal"]').off('click');
                                function setup_modal() {
                                    $('[rel="remote-modal"]').click(function (e) {
                                        e.preventDefault();
                                        var t = $("#remote-modal"),
                                            n = $(this),
                                            o = n.data("title") || n.attr("title"),
                                            i = n.attr("href") || n.data("href");
                                        return t.removeData("bs.modal"),
                                            t.find(".modal-title").text(o),
                                            t.find(".modal-body").load(i, function () {
                                                t.modal("show")
                                            }),
                                            !1
                                    })
                                };
                                setup_modal();
								
                                Flasher.init(true);
                            },
                            error: function () {
                                if (callback) {
                                    callback('error');
                                }
                            }
                        });
                    }
                }
            });
        }
    };

    Flasher.setupStatus = function () {
        Flasher.status = {
            isTopic: $('div#posts').eq(0).length,
            isAktuella: window.location.href.indexOf("/aktuella-amnen") > -1,
            isPM: window.location.href.indexOf("showpm") > -1,
            isSinglePost: window.location.href.indexOf("/sp") > -1,
            isPostReply: window.location.href.indexOf("/newreply.php") > -1,
            isPMReply: window.location.href.indexOf("do=newpm") > -1
        };
    };

    Flasher.setupCacheCollections = function () {
        Flasher.collection = {
            a: $('.post, .post-body, .post_message, .panel, #collapseobj_threadreview ').find('a[href*="http"], a[href*="leave.php"]')
        };
        if (Flasher.status.isAktuella){
            Flasher.collection = {
                b: $('td > div').find('a[class*="thread-title"]')
            };
        }
    };
    Flasher.fixPrenumerationAll = function () {
        if(Flasher.currentSettings.fixPrenumerationAll.value){
            $prenuLink = $('ul.nav.navbar-nav.navbar-left.hidden-xs li a[href*=subscription]')
            try {
                var newHref = $prenuLink.attr('href').replace(/.*subscription\.php/, 'subscription.php?do=viewsubscription&daysprune=-1&folderid=all');
                $prenuLink.attr('href', newHref);
            } catch (e) {};
        }
    };
    Flasher.fixLeaveLinks = function () {
        if(Flasher.currentSettings.fixLeaveLinks.value){
            Flasher.collection.a.filter('a[href*="leave.php"]').each(function (index) {
                try {
                    var newHref = $(this).attr('href').replace(/.*leave.php?\?u=/, '').replace(/%26amp%3B/g, '&');
                    $(this).attr('href', decodeURIComponent(newHref.replace(/\+/g, " ")));
                } catch (e) {}
            });
        }
    };

    Flasher.setupUnvis = function () {
        if(Flasher.currentSettings.unvis.value){
            var sites = ["aftonbladet.se", "expressen.se", "dn.se", "svt.se", "svd.se", "sverigesradio.se","sydsvenskan.se"];
            for(var i=0; i < sites.length; i++){
                Flasher.collection.a.filter('a[href*="' + sites[i] + '"]').each(function (index) {
                    if($(this).attr('href').indexOf('unvis') == -1){
                        try{
                            if($(this).attr('href').indexOf('sverigesradio') > -1){
                                var newHref = $(this).attr('href').replace('sverigesradio', 'unvis.it/sverigesradio');
                                $(this).attr('href', decodeURIComponent(newHref));
                            }

                            var newHref = $(this).attr('href').replace('www.', 'unvis.it/www.');
                            $(this).attr('href', decodeURIComponent(newHref));
                        } catch (e) {}
                    }
                });
            }
        }
    };

    Flasher.quickNavbar = function () {
        if(Flasher.currentSettings.quickNavbar.value){            
            var ul = document.querySelector('.list-inline');
            var quickNavbar = document.createElement('li');            
            quickNavbar.innerHTML = '<a href="#nyheter">Nyheter</a> <a href="#ovriga">Övriga ämnen</a> <a href="#manad">Äldre än en vecka</a> <a href="#ar">Äldre än ett år</a> ';            
            quickNavbar.style.listStyleType = "none";            
            var start = Flasher.currentSettings.quickNavbar.html.indexOf('#');
            var chosencolor = Flasher.currentSettings.quickNavbar.html.substring(start,Flasher.currentSettings.quickNavbar.html.length-2);
            var c = quickNavbar.children;
            var i;
            for (i = 0; i < c.length; i++) {
                c[i].style.color = chosencolor;
            }

            function watchColorPicker(event) {
                chosencolor = event.target.value;
                var c = quickNavbar.children;
                var i;
                for (i = 0; i < c.length; i++) {
                    c[i].style.color = chosencolor;
                }
            };
            
            ul.parentNode.appendChild(quickNavbar);
        }
    };

    Flasher.navBarColors = function () {
        if(Flasher.currentSettings.navBarColors.value){
            $("a[href='/f4']").css({"background-color" : "#7b98af" , "color": "#fff" });
            $("a[href='/f4']").hover(function() {
                var csstxt = $(this).css('cssText') + ';color: #fff !important; background-color: #7b98af !important;';
                $(this).css("cssText" , csstxt );
            });
        }
    };
	
	Flasher.navBarStay = function () {
        if(Flasher.currentSettings.navBarStay.value){
            var csstxt = $('#navbar-top, #navbar-forumnav').css('cssText') + ';position: relative; top: 0; margin-top: 0;';
            $('#navbar-top, #navbar-forumnav').css("cssText",csstxt);
        }
    };

    Flasher.init();

}

function addScript(callback) {
    var script = document.createElement('script');
    script.text = '(' + callback.toString() + ')();';
    document.body.appendChild(script);

}
if (typeof unsafeWindow !== 'undefined' && unsafeWindow.jQuery) {
    initiateFlasher(window.jQuery);

} else {
    addScript(initiateFlasher);
}