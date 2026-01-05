// ==UserScript==
// @name         Pr0γκραμ TV
// @namespace    GamateKID
// @version      3.4
// @description  Για να γουστάρουμε..
// @author       GamateKID
// @match        http*://pr0gramm.com/*
// @icon         https://s12.postimg.org/qnz4gpyzh/pr0gramm_favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25327/Pr0%CE%B3%CE%BA%CF%81%CE%B1%CE%BC%20TV.user.js
// @updateURL https://update.greasyfork.org/scripts/25327/Pr0%CE%B3%CE%BA%CF%81%CE%B1%CE%BC%20TV.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let img;
    let vid;

    let timerTimeout;
    let nextTimeout;
    let timer = null;

    let browsing = false;
    let paused = false;
    let replay = false;

    const imgDelay = 3000;

    console.log('Pr0γκραμ is running\n');

    customize();

    var favicon = document.querySelector("link[rel*='icon']") || document.createElement('favicon');
    favicon.type = 'image/x-icon';
    favicon.rel = 'shortcut icon';
    favicon.href = 'https://s12.postimg.org/qnz4gpyzh/pr0gramm_favicon.png';
    document.getElementsByTagName('head')[0].appendChild(favicon);

    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.display = 'none';
    const overlayLoading = document.createElement('div');
    overlayLoading.className = 'loading';
    overlayLoading.innerHTML = 'φορτώνει...';
    overlay.appendChild(overlayLoading);

    const menu = document.getElementById("head-menu");
    var toggle = document.createElement("a");
    toggle.setAttribute("id", "tab-tv");
    toggle.className = 'head-tab link';
    toggle.innerHTML = 'TV';
    toggle.addEventListener('click', toggleRunning);
    insertAfter(document.getElementById('tab-top'), toggle);

    const style = document.createElement('style');
    document.querySelector('head').appendChild(style);
    const body = document.querySelector('body');
    body.insertBefore(overlay, body.firstChild);

    if($('#filter-link-name').html()==='nsfw'){

        const troll_left = document.createElement('img');
        troll_left.setAttribute("src", "http://i63.tinypic.com/2r389li.png");
        troll_left.setAttribute("id", "troll-left");
        troll_left.setAttribute("style", "width:300px;height:310px;position:absolute;left:50px;top:180px;filter:alpha(opacity=10);");
        body.insertBefore(troll_left, document.getElementById('page'));

        const troll_right = document.createElement('img');
        troll_right.setAttribute("src", "http://i64.tinypic.com/2hq427c.png");
        troll_right.setAttribute("id", "troll-right");
        troll_right.setAttribute("style", "width:300px;height:310px;position:absolute;right:50px;top:180px;filter: alpha(opacity=10);");
        body.insertBefore(troll_right, document.getElementById('page'));

        troll_left.addEventListener('click', function(){window.location.replace("http://2girls1cup.ca/wp-content/uploads/2015/03/2girls1cupvideo.mp4?_=1");});
        troll_right.addEventListener('click', function(){window.location.replace("http://www.1man1jar.org/1man1jar.mp4");});

        $(window).bind("load resize scroll",function(e) {
            var y = $(window).scrollTop();

            $("#troll-left").css("margin-top", y+"px");
            $("#troll-right").css("margin-top", y+"px");
        });

        const trololo1 = document.createElement('img');
        trololo1.setAttribute("src", "http://i65.tinypic.com/s6t2s4.png");
        trololo1.setAttribute("style", "width:20px;height:30px;position:absolute;margin-left:5px;margin-top:-4px;");
        trololo1.addEventListener('click', toggleRunning);
        document.getElementById('head-menu').insertBefore(trololo1, document.getElementById('tab-tv'));

    }

    initStyles();
    window.onresize = initStyles;

    window.onload = disableAds;

    document.addEventListener("keydown", (event) => {
        if (event.keyCode === 80 /*P*/ ) {
            toggleRunning();
        }
        if (browsing) {
            if (event.keyCode === 32 /*Space*/ ) {
                if (timer) {
                    toggleTimer();
                } else {
                    togglePauseVideo();
                }
                event.preventDefault();
            }
            if (event.keyCode === 82 /*R*/ ) {
                replay = !replay;
            }
            if (event.keyCode === 27 && browsing /*Esc*/ ) {
                event.preventDefault();
                event.stopPropagation();
                stop();
            }
            if (event.keyCode === 37 /*left*/ || event.keyCode === 39 /*right*/ ||
                event.keyCode === 65 /*left*/ || event.keyCode === 68 /*right*/ ) {
                if (vid) {
                    clearTimeout(nextTimeout);
                    browse();
                } else {
                    clearTimeout(timerTimeout);
                    timer = null;
                    browse();
                }

            }
            if (event.keyCode === 100 /*NUM4*/ ) {
                if (vid) {
                    event.preventDefault();
                    vid.currentTime -= 5;
                }
            }
            if (event.keyCode === 102 /*NUM6*/ ) {
                if (vid) {
                    event.preventDefault();
                    vid.currentTime += 5;
                }
            }

            if (event.keyCode === 104 /*NUM8*/ ) {
                if (vid) {
                    if (vid.muted) {
                        vid.muted = false;
                    }
                    if (vid.volume < 0.9) {
                        event.preventDefault();
                        vid.volume += 0.1;
                    }
                    moveVolumeSlider(vid.volume);
                }
            }
            if (event.keyCode === 98 /*NUM2*/ ) {
                if (vid) {
                    if (vid.volume > 0.1) {
                        event.preventDefault();
                        vid.volume -= 0.1;
                    } else {
                        vid.muted = true;
                        vid.volume = 0;
                    }
                    moveVolumeSlider(vid.volume);
                }
            }
            if (event.keyCode == 87 /*w*/) {
                $("#key-indicator").appendTo(overlay);
            }
        }
    }, false);

    function toggleRunning() {
        if (/^\/(top|new)\//.test(window.location.pathname)) {
            if (!browsing) {
                $('#troll-left').hide();
                $('#troll-right').hide();
                toggleFullScreen(document.documentElement);
                browse();
                overlay.style.display = '';
                body.style.overflowY = 'hidden';
            } else {
                $('#troll-left').show();
                $('#troll-right').show();
                toggleFullScreen(document.documentElement);
                body.style.overflowY = '';
                stop();
            }
            browsing = !browsing;
        }else{
            overlay.style.display = 'none';
        }
        console.log(browsing? 'Pr0γκραμ browser started' : 'Pr0γκραμ browser stopped');
    }

    function stop() {
        if(vid!==null && vid !== undefined){
            vid.setAttributeNode(document.createAttribute('loop'));
        }
        clearTimeout(nextTimeout);
        clearTimeout(timerTimeout);
        var item = document.querySelector('.item-container-content');
        if (vid) {
            item.insertBefore(vid.parentElement, item.firstChild);
            vid.play();
        } else {
            if (img) {
                item.insertBefore(img.parentElement, item.firstChild);
            }
        }
        // vid.pause();
        overlay.style.display = 'none';
        body.style.overflowY = '';
    }

    //continuesly browsing the elements
    function browse() {
        timer = null;
        vid=null;
        img= null;
        clearTimeout(nextTimeout);

        var lastchild = overlay.lastChild;
        if ((overlay.children.length > 1) && browsing) overlay.removeChild(lastchild);

        vid = document.querySelector('video');
        img = document.querySelector('img.item-image');

        if (vid!==null) {
            var volumeBar = document.getElementsByClassName('audio-volume-controls')[0];
            if(volumeBar!==null && volumeBar !== undefined){
                var stl = document.createAttribute('style');
                stl.value = 'opacity: 1;';
                volumeBar.setAttributeNode(stl);
            }
            overlay.appendChild(vid.parentElement);
            vid.removeAttribute('loop');
            vid.removeAttribute('style');
            vid.parentElement.querySelector('.video-controls').style.width = '';
            vid.addEventListener('ended', (event) => {
                if (replay) vid.play();
                else nextTimeout = setTimeout(clickNext, 50);
            }, false);
            vid.play();
        } else if(img!==null){
            overlay.appendChild(img.parentElement);
            timer = new Timer(function() {
                nextTimeout = setTimeout(clickNext, 50);
            }, imgDelay);
        }else{
            overlay.appendChild(lastchild);
        }
    }

    //Secondary functions

    //Update Volume Control Bar
    function moveVolumeSlider(value){
        var volumeBarSlider = document.getElementsByClassName('audio-volume-slider')[0];
        // var currLeft = volumeBarSlider.style.left;
        // var currLeftValue = parseInt(currLeft.substring(0, currLeft.indexOf('%')));
        // volumeBarSlider.style.left = currLeftValue+value+'%';
        // volumeBarIcon.className  = 'audio-state audio-volume-33';
        volumeBarSlider.style.left = value*100+'%';

        var volumeBarIcon = document.getElementsByClassName('audio-state')[0];

        if(value === 0){
            $(".audio-state").attr('class', 'audio-state audio-volume-0');
        }else if(value*100<=33){
            $(".audio-state").attr('class', 'audio-state audio-volume-33');
        }else if(value*100<=66){
            $(".audio-state").attr('class', 'audio-state audio-volume-66');
        }else{
            $(".audio-state").attr('class', 'audio-state audio-volume-99');
        }
    }

    function togglePauseVideo() {
        if (vid) {
            if (vid.paused) {
                vid.play();
            } else {
                vid.pause();
            }
        }
    }

    //Delay a function call
    //@callback: callback function
    //@delay: time delay in ms
    function Timer(callback, delay) {
        var start, remaining = delay;

        this.pause = function() {
            window.clearTimeout(timerTimeout);
            //remaining -= new Date() - start;
            remaining = 0;
        };

        this.resume = function() {
            start = new Date();
            window.clearTimeout(timerTimeout);
            timerTimeout = window.setTimeout(callback, remaining);
        };

        this.resume();
    }

    function toggleTimer() {
        if (paused) {
            timer.resume();
            paused = false;
            console.log('resumed!');
        } else {
            timer.pause();
            paused = true;
            console.log('paused!');
        }
    }

    function eventFire(elem, etype) {
        if (elem.fireEvent) {
            elem.fireEvent('on' + etype);
        } else {
            const evObj = document.createEvent('Events');
            evObj.initEvent(etype, true, false);
            elem.dispatchEvent(evObj);
        }
    }

    function clickNext() {
        if (browsing) {
            eventFire(document.querySelector('.stream-next'), 'click');
            browse();
        }
    }

    function getViewportSize() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;
        return {
            x,
            y
        };
    }

    function toggleFullScreen(elem){
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
            (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) ||
            (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
            (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen))
        {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }

    function insertAfter(referenceNode, newNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    function disableAds(){
        var ads = document.getElementById("ads");
        if(ads !== null && ads !== undefined){
            ads.style.display = "none";
        }
        var ads2 = document.getElementById("adunit");
        if(ads2 !== null && ads2 !== undefined){
            ads2.style.display = "none";
        }
        var moreAds = document.getElementsByTagName('iframe')[0];
        if(moreAds!==null && moreAds!==undefined){
            var i;
            for(i=0;i<moreAds.length;i++){
                if(moreAds[i] !== null && moreAds[i] !== undefined){
                    moreAds[i].style.display = "none";
                }
            }
        }
    }
    function customize(){
        try {
            document.getElementById("tab-new").innerHTML = 'πρόσφατα';
            document.getElementById("tab-new").addEventListener('click', function(){
                document.getElementsByName("q")[0].placeholder = "Αναζήτηση στα πρόσφατα..";
            });

            document.getElementById("tab-top").innerHTML = 'δημοφιλή';
            document.getElementById("tab-top").addEventListener('click', function(){
                document.getElementsByName("q")[0].placeholder = "Αναζήτηση στα δημοφιλη..";
            });

            document.getElementById("tab-stalk").style.display = 'none';

            document.getElementById("secret-santa-badge").style.display = 'none';

            document.getElementsByClassName("filter-desc")[0].innerHTML = "Safe For Work (απλά)";
            document.getElementsByClassName("filter-desc")[1].innerHTML = "Not Safe For Work (πορνό)";
            document.getElementsByClassName("filter-desc")[2].innerHTML = "Not Safe For Life (αηδίες)";

            document.getElementById("filter-save").innerHTML = "εφαρμογή φίλτρου";

            if (/^\/(top)/.test(window.location.pathname)) {
                document.getElementsByName("q")[0].placeholder = "Αναζήτηση στα δημοφιλη..";
            }else{
                document.getElementsByName("q")[0].placeholder = "Αναζήτηση στα πρόσφατα..";
            }
            var msg = document.getElementsByClassName("main-message")[0];
            if(msg!==null && msg!== undefined){
                msg.innerHTML = "Ξαναεπέλεξε μια κατηγορία.";
            }
        }catch(err){console.log(err.message);}
    }

    //CSS styles override
    function initStyles() {
        const viewportSize = getViewportSize();
        style.innerHTML = `
body {
position: relative;
}

.overlay {
position: fixed;
background-color: rgba(0,0,0,0.9);

width: ${viewportSize.x}px;
height: ${viewportSize.y}px;
z-index: 99999990;
display: flex;
align-items: center;
justify-content: center;
top: 0;
left: 0;
overflow: auto;
}

.overlay video {
width: ${viewportSize.x}px;
height: ${viewportSize.y-3}px; /*so we can still see the progress bar*/
pointer-events: none;
}

.overlay .video-controls {
width: 100%;
}

.overlay h1 {
font-size: 120px;
}

.overlay div.video-controls {
cursor: pointer;
}

.overlay div.video-controls:hover div.video-position-bar-background {
height: 8px;
opacity: 0.8;
transition: height 0.2s ease;
}

.overlay div.video-controls:hover div.audio-controls,
.tv-overlay div.video-controls:hover div.audio-volume-controls {
opacity: 1;
transition: opacity 0.2s ease;
}

.overlay .loading {
position: absolute;
left: 50%;
right: 50%;
top: 50%;
bottom: 50%;
font-size: 22px;
color: #008FFF;
white-space: nowrap;
}

.control {
position: fixed;
z-index: 99999991;
top: 5px;
left: 5px;
border: 3px solid #008FFF;
color: #008FFF;
border-radius: 5px;
width: 80px;
height: 80px;
background: rgba(0,0,0,0.3);
padding: 3px 5px;
cursor: pointer;
display: flex;
justify-content: center;
align-items: center;
}

#head-menu a:hover,
#filter-link-name:hover,
#user-profile-name:hover,
.comment-reply-link,
.tags-expand,
.add-tags-link,
.vote-up:hover,
.vote-fav:hover,
#search-submit-inline:hover,
.tab-bar a:hover,
.tab-bar a:active,
.pict .vote-fav.faved,
.head-link.empty:hover,
.head-link:hover,
.tag a[title="Removing tag"],
.filter-setting.active,
.active .filter-name,
a.active,
.faved,
.voted-up .vote-up,
.warn,
#settings-logout-link,
.action.expand-thread,
a[href='/inbox/unread'] .pict,
a[href='/inbox/unread'] #inbox-count,
#key-indicator{
color: #008fff !important;
}

.confirm-button:hover{
color: #000 !important;
}

a:hover,
.tags-expand:hover,
#settings-logout-link:hover,
.action.expand-thread:hover{
color: #FFF !important;
}

.confirm,
.confirm-button,
#loader div{
background: #008fff;
}

input[value=Abschicken],
.search-submit,
input[value='Nachricht senden'],
.user-follow, input[value='Einstellungen speichern'],
input[value='E-Mail Adresse ändern'],
input[value='Passwort ändern'],
input[value='Einladung verschicken'],
input[value='Tags speichern'],
.user-comment-op, input[value='Anmelden'],
.confirm-button.product-select,
input[value='Bild Hochladen']{
background: #008fff !important;
opacity:1;
}

input.q{
width: 200px;
}

#filter-save:hover,
.user-follow:hover,
.confirm-button.product-select:hover,
input[value='Einladung verschicken']:hover,
input[value='E-Mail Adresse ändern']:hover,
input[value='Passwort ändern']:hover,
input[value='Einstellungen speichern']:hover,
input[value='Anmelden']:hover,
input[value='Tags speichern']:hover,
input[value=Abschicken]:hover,
input[value='Nachricht senden']:hover,
input[value='Einladung verschicken']:hover,
input[value='Bild Hochladen']:hover{
background: #fff !important;
}

input[value='Bild Hochladen']:disabled{
background: #5e5e5e !important;
}

#filter-save{
background: #008fff !important;
}

.stream-prev .stream-prev-icon,
.stream-next .stream-next-icon{
background: #008fff !important;
}

.filter-setting.active
.filter-check{
background: #008fff !important;
border-color:#008fff !important;
}

#upload-droparea{
border: 1px #008fff solid !important;
}

#pr0gramm-logo-background{
fill: #008fff !important;
}

#gpt-divider-rectangle{
display:none !important;
}
#gpt-skyscraper-left{
display:none !important;
}
#gpt-skyscraper-right{
display:none !important;
}
`;}
})();