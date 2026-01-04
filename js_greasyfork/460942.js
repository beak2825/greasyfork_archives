// ==UserScript==
// @name         Remember Pause
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Remember Pause time on jw videos
// @author       You
// @include      https://www.jw.org/en/library/videos/*
// @include      https://www.jw.org/fr/biblioth%C3%A8que/videos/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jw.org
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460942/Remember%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/460942/Remember%20Pause.meta.js
// ==/UserScript==

(function() {
    var s_n = 'pausejwstore';
    var store = {};
    var id = (window.location.href).split("/").pop();

    GM.getValue(s_n, "{}").then((res)=>{
        store = JSON.parse(res)

        if(store[id])
            display_paused_time(store[id]);
    });
    waitForElm('video').then((video) => {
        video.addEventListener('pause', function (event) {
            GM.getValue(s_n, "{}").then((res)=>{
                store = JSON.parse(res)
                store[id] = video.currentTime + '';
                GM.setValue(s_n, JSON.stringify(store));
                display_paused_time(video.currentTime);
            });
        }, false);
    });

    function display_paused_time(time){
        time = new Date(time * 1000).toISOString().slice(11, 19);

        if(!document.querySelector('.remeber_pause_celinely')){
            waitForElm('.VideosPage #content nav.breadcrumbs[role="navigation"]').then((div) => {
                div.insertAdjacentHTML('afterbegin', '<div class="remeber_pause_celinely">'+time+'</div>');
            });
        }
        else document.querySelector('.remeber_pause_celinely').innerHTML = time;
    }


    waitForElm('.remeber_pause_celinely').then((paused_time) => {
        paused_time.addEventListener('click', function (event) {
            waitForElm('video').then((video) => {
                video.currentTime = store[id];
                video.play();
            });
        }, false);
    });


    function injectCSS() {
        if(!cssAdded){
        	cssAdded=true;
            var css = `
                .remeber_pause_celinely {
                    position: absolute;
                    right: 10px;
                    top: 48%;
                    transform: translateY(-50%);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                }
                .remeber_pause_celinely:hover {
                    color: var(--ds-link-color, #4a6da7);
                }
                .remeber_pause_celinely:before {
                    font-family: "media-player";
                    speak: none;
                    font-style: normal;
                    font-weight: normal;
                    font-variant: normal;
                    text-transform: none;
                    line-height: 1;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    content: "\\e607";
                    font-size: 22px;
                    padding: 0px 7px;
                }
                .remeber_pause_celinely.play:before {
                    content: "\e607";
                }`;

            var style = document.createElement("style");
            style.type = "text/css";
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            document.documentElement.appendChild(style);
        }
    }
    var cssAdded = false;
    injectCSS();

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }


})();