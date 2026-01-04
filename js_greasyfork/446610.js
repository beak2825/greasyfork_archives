// ==UserScript==
// @name         HideNotch
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-end
// @version      0.0.2
// @description  QuitarNotch
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/446610/HideNotch.user.js
// @updateURL https://update.greasyfork.org/scripts/446610/HideNotch.meta.js
// ==/UserScript==

(function () {
    let meta, style, css, i;
    let timeOuts = [100, 200, 300, 500];
    let videos = document.getElementsByTagName('video');
    //********************************
    //*****       VIEWPORT       *****
    //********************************
    meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
    style = document.createElement('style');
    style.type = 'text/css';
    css = '.fillVideoCSS{ NavigationUI: hide!important; top: 0!important; left: 0!important; height: 100vh!important; width: 100vw!important; object-fit: fill!important;}';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    document.getElementsByTagName('head')[0].appendChild(style);
    //********************************
    //*****       LANDSCAPE      *****
    //********************************
    document.addEventListener('fullscreenchange', function () {
        if (document.fullscreenElement) {
            timeOuts.forEach(function (timeout) {
                setTimeout(function () {
                    for (i = 0; i < videos.length; i++) { if (videos[i] != null) { videos[i].classList.remove('fillVideoCSS'); } }
                    for (i = 0; i < videos.length; i++) { if (videos[i] !== null) { videos[i].classList.add('fillVideoCSS'); } }
                    if (document.getElementsByTagName('video')[0].videoWidth > document.getElementsByTagName('video')[0].videoHeight) {
                        screen.orientation.lock('landscape');
                    }
                }, timeout);
            });

        } else {
            for (i = 0; i < videos.length; i++) { if (videos[i] != null) { videos[i].classList.remove('fillVideoCSS'); } }
        }
        console.clear();
    });
    //********************************
    //*****         DISENO       *****
    //********************************
    let el;
    if (el = document.getElementById('speedbump')) el.remove();
    if (el = document.getElementById('views')) el.style.top = '0px';
})();