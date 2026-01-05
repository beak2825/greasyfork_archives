// ==UserScript==
// @name         KissCartoon/Anime/Asian++ (Defunct)
// @version      0.94
// @description  "Adds hotkeys, auto fullscreen, continous play and shuffle functionality. Hotkeys: F11 - fullscreen, "R" - random episode, Arrow Keys - previous/next episode. Holding "R" or RMB also reverses direction of arrow keys. Double tapping "R" toggles shuffle.
// @match        http://kisscartoon.me/Cartoon/*/*
// @match        http://kisscartoon.se/Cartoon/*/*
// @match        http://kissanime.to/Anime/*/*
// @match        http://kissanime.ru/Anime/*/*
// @match        http://kissasian.com/Drama/*/*
// @grant       GM_getValue
// @grant       GM_setValue
// @namespace https://greasyfork.org/users/65414
// @downloadURL https://update.greasyfork.org/scripts/23121/KissCartoonAnimeAsian%2B%2B%20%28Defunct%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23121/KissCartoonAnimeAsian%2B%2B%20%28Defunct%29.meta.js
// ==/UserScript==

(function() {

    window.rTaps = 0;

    window.contbtn = [
        '',
        'http://i.imgur.com/PfLjoVg.png',
        'http://i.imgur.com/kgxHHi6.png',
        'http://i.imgur.com/T4lWg5b.png',
        'http://i.imgur.com/PJBsBpA.png',
        'http://i.imgur.com/JI6W5b8.png',
    ];

    function fullscreenHandler(auto) {
        if (auto) {
            document.styleSheets[0].addRule('#btnFullscreen::before','content: "\\e00b"; font-family: VideoJS;font-size: 1.5em;line-height: 2;position: absolute;top: 0;right: 10px;width: 100%;height: 100%;text-align: right;text-shadow: 1px 1px 1px rgba(0,0,0,.5);');
            document.body.style.overflowY = 'hidden';
            document.getElementById("centerDivVideo").style.position = "fixed";
            document.getElementById("centerDivVideo").style.zIndex = "123456789";
            document.getElementById("centerDivVideo").style.top  = "0";
            document.getElementById("centerDivVideo").style.left = "0";
            document.getElementById("centerDivVideo").style.width = "100%";
            document.getElementById("centerDivVideo").style.height = "100%";
            document.getElementById("divContentVideo").style.width = "inherit";
            document.getElementById("divContentVideo").style.height = "inherit";
            document.getElementById("my_video_1").style.width = "inherit";
            document.getElementById("my_video_1").style.height = "inherit";
        } else {
            if (GM_getValue("fullscreenstatus") === false) {
                document.styleSheets[0].addRule('#btnFullscreen::before','content: "\\e00b"; font-family: VideoJS;font-size: 1.5em;line-height: 2;position: absolute;top: 0;right: 10px;width: 100%;height: 100%;text-align: right;text-shadow: 1px 1px 1px rgba(0,0,0,.5);');
                document.body.style.overflowY = 'hidden';
                document.getElementById("centerDivVideo").style.position = "fixed";
                document.getElementById("centerDivVideo").style.zIndex = "123456789";
                document.getElementById("centerDivVideo").style.top  = "0";
                document.getElementById("centerDivVideo").style.left = "0";
                document.getElementById("centerDivVideo").style.width = "100%";
                document.getElementById("centerDivVideo").style.height = "100%";
                document.getElementById("divContentVideo").style.width = "inherit";
                document.getElementById("divContentVideo").style.height = "inherit";
                document.getElementById("my_video_1").style.width = "inherit";
                document.getElementById("my_video_1").style.height = "inherit";
                GM_setValue("fullscreenstatus", true);
            } else {
                document.styleSheets[0].addRule('#btnFullscreen::before','content: "\\e000"; font-family: VideoJS;font-size: 1.5em;line-height: 2;position: absolute;top: 0;right: 10px;width: 100%;height: 100%;text-align: right;text-shadow: 1px 1px 1px rgba(0,0,0,.5);');     
                document.body.style.overflowY = '';
                document.getElementById("centerDivVideo").style.position = "";
                document.getElementById("centerDivVideo").style.width = GM_getValue("origwidth");
                document.getElementById("centerDivVideo").style.height = GM_getValue("origheight");
                GM_setValue("fullscreenstatus", false);
                GM_setValue("buttonedIn", false);
            }
        }
    }

    if (!window.screenTop && !window.screenY) {
        if (GM_getValue("buttonedIn") === true) {
            var el = document.documentElement, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
            window.el = el;
            window.rfs = rfs;
            if(typeof window.rfs!="undefined" && window.rfs){
                window.rfs.call(window.el);
            } else if(typeof window.ActiveXObject!="undefined"){
                // for Internet Explorer
                var wscript = new ActiveXObject("WScript.Shell");
                if (wscript!==null) {
                    wscript.SendKeys("{F11}");
                }
            }
            GM_setValue("fullscreenstatus", true);
            fullscreenHandler("auto");
        } else {
            document.styleSheets[0].addRule('#btnFullscreen::before','content: "\\e000"; font-family: VideoJS;font-size: 1.5em;line-height: 2;position: absolute;top: 0;right: 10px;width: 100%;height: 100%;text-align: right;text-shadow: 1px 1px 1px rgba(0,0,0,.5);');
            GM_setValue("fullscreenstatus", false);
            GM_setValue("origwidth",document.getElementById("centerDivVideo").style.width);
            GM_setValue("origheight",document.getElementById("centerDivVideo").style.height);
        }
    } else {
        GM_setValue("fullscreenstatus", true);
        fullscreenHandler("auto");
    }

    window.addEventListener("keyup", function (event) {
        if (event.keyCode == "122") {
            if ((window.buttonbacked === true) && (GM_getValue("buttonedIn") !== true)) {
                window.buttonbacked = false;
                GM_setValue("buttonedIn", false);
                window.f11entered = false;
            } else {
                if ((window.buttonbacked && GM_getValue("buttonedIn")) === true) {
                    window.buttonbacked = false;
                    GM_setValue("buttonedIn", false);
                    window.f11entered = false;
                    fullscreenHandler();
                } else {
                    window.f11entered = true;
                    fullscreenHandler();
                }
            }
        }
    });

    var btnFullscreen = document.getElementsByClassName("vjs-fullscreen-control vjs-control");
    btnFullscreen[0].style.opacity = "0";
    btnFullscreen[0].style.pointerEvents = "none";
    btnFullscreen[0].id = "vjs-fullscreen-control";
    var newbtnFullscreen = document.createElement("div");
    newbtnFullscreen.style.width = "3.8em";
    newbtnFullscreen.style.height = "3em";
    newbtnFullscreen.style.position = "absolute";
    newbtnFullscreen.style.right = "0";
    newbtnFullscreen.id = "btnFullscreen";
    document.getElementById("vjs-fullscreen-control").parentNode.insertBefore(newbtnFullscreen, document.getElementById("vjs-fullscreen-control"));
    document.getElementById("btnFullscreen").addEventListener("click", function(){
        if (GM_getValue("fullscreenstatus") !== true) {
            var el = document.documentElement, rfs = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullScreen;
            window.el = el;
            window.rfs = rfs;
            GM_setValue("buttonedIn", true);
        } else {
            if (window.f11entered === true) {
                window.buttonbacked = true;
            } else {
                GM_setValue("buttonedIn", false);
            }
            var el = document, rfs = el.cancelFullScreen || el.webkitCancelFullScreen || el.mozCancelFullScreen || el.msCancelFullScreen;
            window.el = el;
            window.rfs = rfs;
        }
        if(typeof window.rfs!="undefined" && window.rfs){
            window.rfs.call(window.el);
        } else if(typeof window.ActiveXObject!="undefined"){
            // for Internet Explorer
            var wscript = new ActiveXObject("WScript.Shell");
            if (wscript!==null) {
                wscript.SendKeys("{F11}");
            }
        }
        fullscreenHandler();
    });

    var episodeCompleted = false;
    window.addEventListener("keyup", function (event) {
        var episodes = document.getElementById("selectEpisode");
        if (event.keyCode == "37") {
            if (window.episodedirectionModifier === true) {
                document.getElementById("btnNext").click();
            } else {
                document.getElementById("btnPrevious").click();
            }
        }
        if (event.keyCode == "39") {
            if (window.episodedirectionModifier === true) {
                document.getElementById("btnPrevious").click();
            } else {
                document.getElementById("btnNext").click();
            }
        }
        if (event.key == "r") {
            setTimeout(function(){
                if (window.rTaps < 2) {
                    if (window.firing !== true) {
                        window.rTaps = 0;
                        window.firing = true;
                        setTimeout(function(){
                            window.firing = false;
                        },400);
                        episodes.options[Math.floor(Math.random() * episodes.length)].selected = true;
                        episodes.dispatchEvent(new Event('change'));
                        window.episodedirectionModifier = true;
                    }
                } else {
                    if (window.firing !== true) {
                        window.rTaps = 0;
                        window.firing = true;
                        setTimeout(function(){
                            window.firing = false;
                        },400);
                        document.getElementById("btnShuffle").click();
                    }
                }
            },400);
            window.rTaps = window.rTaps + 1;
        }
    });

    window.addEventListener("keydown", function (event) {
        if (event.key == "r") {
            window.episodedirectionModifier = true;
        }
    });

    window.addEventListener("mousedown", function (event) {
        if(event.which == 3) {
            window.episodedirectionModifier = true;
        }
    });

    window.addEventListener("mouseup", function (event) {
        if(event.which == 3) {
            window.episodedirectionModifier = false;
        }
    });

    window.addEventListener("DOMSubtreeModified", function (event) {
        if (event.target.parentNode.className == "vjs-current-time vjs-time-controls vjs-control") {
            if (event.target.innerHTML.indexOf("Current Time") > -1) {
                var currentTime = event.target.childNodes[1].nodeValue;
                var completeTime =  document.getElementsByClassName("vjs-duration-display")[0].childNodes[1].nodeValue;
                if ((currentTime.indexOf("0:00") <= -1) && (currentTime == completeTime)){
                    if (episodeCompleted === false) {
                        episodeCompleted = true;
                        if (GM_getValue('contset') > 1) {
                            GM_setValue("continterrupt", false);
                            if (GM_getValue('shufflestatus') !== true) {
                                document.getElementById("btnNext").click();
                            } else {
                                var episodes = document.getElementById("selectEpisode");
                                episodes.options[Math.floor(Math.random() * episodes.length)].selected = true;
                                episodes.dispatchEvent(new Event('change'));
                            }
                        }
                    }
                }
            }
        }
    });
    if (document.getElementById("btnNext")) {
        window.btnRef = document.getElementById("btnNext");
        window.btnNext = true;
    } else {
        window.btnRef = document.getElementById("btnPrevious");
    }
    if (document.getElementById("btnPrevious")) {
        window.btnPrev = true;
    }
    var d = new Date();

    function contwait() {
        if (GM_getValue("continterrupt") !== true) {
            var pausebutton = document.getElementsByClassName("vjs-play-control vjs-control  vjs-playing");
            var playbutton = document.getElementsByClassName("vjs-play-control vjs-control  vjs-paused");
            if (pausebutton) {
                pausebutton[0].click();
                var vjsposter = document.getElementsByClassName("vjs-poster");
                document.getElementById("centerDivVideo").style.overflow = "hidden";
                vjsposter[0].outerHTML = vjsposter[0].outerHTML.replace('<div class="vjs-poster"', '<div id="contwait" style="a;position: absolute;width: 100%;height: 100%;background: black;z-index: 23456789;opacity: .8;text-align: center;padding-top: 30%;FONT-SIZE: 2em;">click to continue playing</div><div class="vjs-poster"');
                var contwait = document.getElementById("contwait");
                contwait.addEventListener("click", function(){
                    playbutton[0].click();
                    contwait.remove();
                });
            } else {
                setTimeout(function(){
                    contwait();
                },500);
            }
            GM_setValue("contcurr", (GM_getValue("contset")));
        }
    }

    if (!GM_getValue("contcurr")) {
        GM_setValue("contcurr", 1);
        GM_setValue("contset", 1);
    } else {
        if (GM_getValue("contset") != 5) {
            if (GM_getValue("contcurr") > 1) {
                if (GM_getValue("continterrupt") !== true) {
                GM_setValue("contcurr", (GM_getValue("contcurr") - 1));
                } else {
                GM_setValue("contcurr", (GM_getValue("contset") + 1));
                }
            } else {
                contwait();
            }
        }
    }
    var ctrlsinsertPoint = document.getElementsByClassName("vjs-chapters-button vjs-menu-button vjs-control")[0];
    ctrlsinsertPoint.outerHTML = ctrlsinsertPoint.outerHTML.replace('Chapters</li></ul></div></div></div>','Chapters</li></ul></div></div></div><div id="custCtrls"><img id="btnNextCtrl" src="http://i.imgur.com/CpSxOGc.png" style="a;float: right;margin-top: .7em;margin-left: .6em;" title="Next Episode"><img id="btnPrevCtrl" src="http://i.imgur.com/gOJ5SvP.png" style="a;float: right;margin-top: .7em;margin-left: 1.1em;" title="Previous Episode"><img id="btnShuffCtrl" src="http://i.imgur.com/cQSnPJI.png" style="a;float: right;margin-top: .7em;margin-left: 1.1em;" title="Disable Shuffle"><img id="btnContCtrl" src="http://i.imgur.com/PfLjoVg.png" style="a;float: right;margin-top: .7em;margin-left: 1em;" title="Continous Play"><div id="fulltitle" style="position: absolute;margin-top: .3em;margin-left: 1em;font-size: 1.2em;left: 10.8em;" title="Current Episode"></div></div>');

    var episodes = document.getElementById("selectEpisode");
    var fullTitle = document.getElementById("navsubbar").children[0].children[0].innerText.replace("Cartoon ", "").replace("eason 0", "eason ").replace(" information", "") + " - " + episodes.options[episodes.selectedIndex].innerText.replace(/(\r\n|\n|\r)/gm,"").replace("pisode 0","pisode ");
    document.getElementById("fulltitle").innerText = fullTitle;

    var btnContCtrl = document.getElementById("btnContCtrl");
    if (GM_getValue("contset") > 1 < 6) {
            GM_setValue("continterrupt", true);
    }
    btnContCtrl.src = window.contbtn[GM_getValue("contset")];
    btnContCtrl.addEventListener("click", function(){
        if (GM_getValue("contset") < 5){
            GM_setValue("contset", (GM_getValue("contset") + 1));
            GM_setValue("contcurr", (GM_getValue("contset") + 1));
            btnContCtrl.src = window.contbtn[GM_getValue("contset")];
        } else {
            GM_setValue("contset", 1);
            btnContCtrl.src = window.contbtn[GM_getValue("contset")];
        }
    });

    var btnShuffCtrl = document.getElementById("btnShuffCtrl");
    if (GM_getValue('shufflestatus') !== true) {
        window.btnRef.parentNode.parentNode.parentNode.style.width = '606px';
        btnShuffCtrl.src = 'http://i.imgur.com/cQSnPJI.png';
        btnShuffCtrl.title = btnShuffCtrl.title.replace('Disable','Enable');
        window.btnRef.parentNode.parentNode.innerHTML =  window.btnRef.parentNode.parentNode.innerHTML + '<img id="btnShuffle" src="http://i.imgur.com/bMw3xKs.png" title="Enable Shuffle" border="0" style="cursor:pointer;margin-left: 6px;">';
    } else {
        window.btnRef.parentNode.parentNode.parentNode.style.width = '606px';
        btnShuffCtrl.src = 'http://i.imgur.com/wU0bBbD.png';
        btnShuffCtrl.title = btnShuffCtrl.title.replace('Enable','Disable');
        window.btnRef.parentNode.parentNode.innerHTML =  window.btnRef.parentNode.parentNode.innerHTML + '<img id="btnShuffle" src="http://i.imgur.com/8sjeEkT.png" title="Disable Shuffle" border="0" style="cursor:pointer;margin-left: 6px;">';
    }

    var btnShuffle = document.getElementById("btnShuffle");
    btnShuffle.addEventListener("click", function(){
        if (GM_getValue('shufflestatus') !== true) {
            GM_setValue('shufflestatus', true);
            btnShuffle.src = 'http://i.imgur.com/8sjeEkT.png';
            btnShuffle.title = btnShuffle.title.replace('Enable','Disable');
            btnShuffCtrl.src = 'http://i.imgur.com/wU0bBbD.png';
            btnShuffCtrl.title = btnShuffCtrl.title.replace('Enable','Disable');
        } else {
            GM_setValue('shufflestatus', false);
            btnShuffle.src = 'http://i.imgur.com/bMw3xKs.png';
            btnShuffle.title = btnShuffle.title.replace('Disable','Enable');
            btnShuffCtrl.src = 'http://i.imgur.com/cQSnPJI.png';
            btnShuffCtrl.title = btnShuffCtrl.title.replace('Disable','Enable');
        }
    }, false);

    btnShuffCtrl.addEventListener("click", function(){
        if (GM_getValue('shufflestatus') !== true) {
            GM_setValue('shufflestatus', true);
            btnShuffCtrl.src = 'http://i.imgur.com/wU0bBbD.png';
            btnShuffCtrl.title = btnShuffCtrl.title.replace('Enable','Disable');
            btnShuffle.src = 'http://i.imgur.com/8sjeEkT.png';
            btnShuffle.title = btnShuffle.title.replace('Enable','Disable');
        } else {
            GM_setValue('shufflestatus', false);
            btnShuffCtrl.src = 'http://i.imgur.com/cQSnPJI.png';
            btnShuffCtrl.title = btnShuffCtrl.title.replace('Disable','Enable');
            btnShuffle.src = 'http://i.imgur.com/bMw3xKs.png';
            btnShuffle.title = btnShuffle.title.replace('Disable','Enable');
        }
    }, false);

    var btnNextCtrl = document.getElementById("btnNextCtrl");
    if (window.btnNext !== true) {
    btnNextCtrl.src = "http://i.imgur.com/Zm7YWwv.png";
    btnNextCtrl.title = "";
    } else {
    btnNextCtrl.src = "http://i.imgur.com/CpSxOGc.png";
    }
    var btnPrevCtrl = document.getElementById("btnPrevCtrl");
    if (window.btnPrev !== true) {
    btnPrevCtrl.src = "http://i.imgur.com/Zm7YWwv.png";
    btnPrevCtrl.style.mozTransform = "scaleX(-1)";
   btnPrevCtrl.style.oTransform = "scaleX(-1)";
   btnPrevCtrl.style.webkitTransform = "scaleX(-1)";
   btnPrevCtrl.style.transform = "scaleX(-1)";
   btnPrevCtrl.style.filter = "FlipH";
   btnPrevCtrl.style.msFilter = "FlipH";
   btnPrevCtrl.title = "";
    } else {
    btnPrevCtrl.src = "http://i.imgur.com/CpSxOGc.png";
    btnPrevCtrl.style.mozTransform = "scaleX(-1)";
   btnPrevCtrl.style.oTransform = "scaleX(-1)";
   btnPrevCtrl.style.webkitTransform = "scaleX(-1)";
   btnPrevCtrl.style.transform = "scaleX(-1)";
   btnPrevCtrl.style.filter = "FlipH";
   btnPrevCtrl.style.msFilter = "FlipH";
    }
    btnPrevCtrl.addEventListener("click", function(){
    if (window.btnPrev === true) {
        document.getElementById("btnPrevious").click();
    }
    }, false);

    btnNextCtrl.addEventListener("click", function(){
    if (window.btnNext === true) {
        document.getElementById("btnNext").click();
    }
    }, false);

})();