// ==UserScript==
// @name         AWBW game notes
// @namespace    https://awbw.amarriner.com/
// @version      1.04
// @description  Add a simple note function to matches
// @author       Truniht
// @match        https://awbw.amarriner.com/*?games_id=*
// @match        https://awbw.amarriner.com/*?replays_id=*
// @icon         https://awbw.amarriner.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450136/AWBW%20game%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/450136/AWBW%20game%20notes.meta.js
// ==/UserScript==

(function() {
    var gameID = window.location.href.match(/_id=([0-9]+)/)[1];

    var noteValue = GM_getValue('AWBWNote' + gameID) || '';

    var ele = document.createElement('textarea');
    ele.style.width = '100%';
    ele.style.background = 'rgb(250, 250, 221)';
    ele.style.color = '#000000';
    ele.spellcheck = false;

    function resizeEle() {
        if (ele.clientHeight + 10 < ele.scrollHeight) ele.style.height = ele.scrollHeight + 'px';
    }

    if (noteValue) ele.value = noteValue;

    var saveTimeout = 0;
    function saveText() {
        GM_setValue('AWBWNote' + gameID, ele.value);
    }

    ele.oninput = function(e) {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveText, 500);
        resizeEle();
    }

    GM_addValueChangeListener('AWBWNote' + gameID, function(name, old_value, new_value, remote) {
        if (remote) ele.value = new_value;
    });

    //Stop default keybindings
    function preventK(e) {
        e.stopPropagation();
    }
    ele.addEventListener('keydown', preventK);
    ele.addEventListener('keyup', preventK);
    ele.addEventListener('keypress', preventK);

    function loadNotes() {
        var mainEle = (
            document.querySelector('.game-player-info') ||
            document.querySelector('.awbwenhancements-sidebar-contents') ||
            document.querySelector('.reverse-info-box').parentElement.parentElement.parentElement
        );
        if (!mainEle) return false;
        mainEle.appendChild(ele);
        mainEle.style.height = '';
        resizeEle();

        const observer = new MutationObserver(function() {
            observer.disconnect();
            if (mainEle.lastChild !== ele) mainEle.appendChild(ele);
            mainEle.style.height = '';
            observer.observe(mainEle, { childList: true, attributes: true});
        });
        observer.observe(mainEle, { childList: true, attributes: true});

        //Try to copy the background style
        ele.style.background = getComputedStyle(document.getElementById('outer')).background;

        //Make some adjustements for the moveplanner
        var awbweContainer = document.getElementById('awbwenhancements-sidebar-container');
        if (awbweContainer) {
            awbweContainer.style.width = 'auto';
            ele.style.width = 'calc(100% - 24px)';
            ele.style.margin = '0 12px';
        }
        return true;
    }

    window.addEventListener('load', loadNotes);
})();