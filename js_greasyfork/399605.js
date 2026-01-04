// ==UserScript==
// @name         symfony profiler toolbar enhancement
// @namespace    micoli.symfony.profiler
// @version      0.2
// @description  symfony debug bar enhancement
// @match        http*://*/*
// @author       micoli
// @match        https://stackoverflow.com/questions/52040308/css-selector-anchor-text-of-href-contains
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399605/symfony%20profiler%20toolbar%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/399605/symfony%20profiler%20toolbar%20enhancement.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const openPhpStormLink = function (link) {
        const linkWindow = window.open(link,'ee');
        setTimeout(function(){
            linkWindow.close();
        },2);
    };

    if(document.querySelector('.exception-summary')){
        document.querySelectorAll('.trace-file-path>a').forEach(function (link) {
            const matches = link.href.match(/\_profiler\/open\?file=(.*)/);
            const sublink=matches[1];;
            link.href = `http://localhost:63342/api/file?file=${sublink}`;
            link.addEventListener('click',function (event) {
                openPhpStormLink(event.currentTarget.href);
                event.preventDefault();
            });
        });
    }

    if (document.location.href.match(/_profiler/)) {
        document.getElementById('header').style.display='none';
        return;
    }

    if(!document.querySelector('.sf-toolbar')){
        return;
    }

    let windowSrc = `
    <style>
        #sfProfilerWindow-title {
            font-size: 20px;
            left: 26px;
            top: 9px;
            position: fixed;
            font-weight: bold;
            color: white;
        }
        #sfProfilerWindow-title-container {
            top: 5px;
            height: 25px;
            left: 10px;
            right: 10px;
            border: 1px solid #A3A3A3;
            position: fixed;
            overflow: hidden;
            z-index: 99;
            background-color: #4F805D;
            display: none;
        }
        #sfProfilerWindow {
            top: 30px;
            bottom: 45px;
            left: 10px;
            right: 10px;
            border: 0px solid #A3A3A3;
            position: fixed;
            overflow: hidden;
            z-index: 99;
            display: none;
        }
        #sfProfilerWindow-close{
            width: 20px;
            cursor: pointer;
            float: right;
            font-size: 20px;
            margin-right: 7px;
            font-weight: bold;
            color: white;
        }
        #sfProfilerWindow-iframe {
            width: 100%;
            height: 100vh;
            border-width: thin;
        }
    </style>
    <div id="sfProfilerWindow-title-container">
        <span id="sfProfilerWindow-title">title</span>
        <span id="sfProfilerWindow-close">[X]</span>
    </div>
    <div id="sfProfilerWindow">
        <iframe
            id="sfProfilerWindow-iframe"
            src="http://dinghy:22080/_profiler/052e26?panel=request"
            scrolling="yes"
        ></iframe>
        </div>
    </div>
    `;

    const isWindowOpened = function () {
        return document.getElementById('sfProfilerWindow').style.display === 'block';
    };

    const showWindow = function () {
        document.getElementById('sfProfilerWindow-title-container').style.display = 'block';
        document.getElementById('sfProfilerWindow').style.display = 'block';
    };

    const hideWindow = function () {
        document.getElementById('sfProfilerWindow-title-container').style.display = 'none';
        document.getElementById('sfProfilerWindow').style.display = 'none';
    };
    const capitalize = function (s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    };
    const openSymfonyWindow = function (event, button) {
        event.preventDefault();
        let link = button.querySelector('a');
        if (isWindowOpened() && link.href === document.getElementById('sfProfilerWindow-iframe').src) {
            hideWindow();
            return false;
        }
        showWindow();
        document.getElementById('sfProfilerWindow-iframe').src = link.href;
        const linkMatches = link.href.match(/panel=(.*)/);
        document.getElementById('sfProfilerWindow-title').innerHTML = capitalize(linkMatches[1]);
        return false;
    };

    const setLinks = function () {
        //a[href*="/_profiler/"]:not(.rgx-add-profiler)
        document.querySelectorAll(
            '.sf-toolbarreset>.sf-toolbar-block:not(.rgx-add-profiler'
        ).forEach(function (button) {
            button.className = button.className + ' rgx-add-profiler';
            button.target = '_blank';
            button.onclick = function (event) {
                openSymfonyWindow(event, button);
            }
        });
    };

    setLinks();
    setInterval(setLinks, 500);

    document.body.insertAdjacentHTML('beforeEnd', windowSrc);
    document.getElementById('sfProfilerWindow-close').onclick = hideWindow;
    hideWindow();
})();


