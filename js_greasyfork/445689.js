// ==UserScript==
// @name         Site specific clipboard
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  Read on https://github.com/albertdiones/site-specific-clipboard-userscript
// @author       albertdiones@gmail.com
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @updateUrl https://raw.githubusercontent.com/albertdiones/site-specific-clipboard-userscript/master/site-specific-clipboard.userscript.js
// @downloadUrl https://raw.githubusercontent.com/albertdiones/site-specific-clipboard-userscript/master/site-specific-clipboard.userscript.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445689/Site%20specific%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/445689/Site%20specific%20clipboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const contentKey = 'siteClipboard_content';
    const statusKey = 'siteClipboard_windowIsMinimized'


    let body = document.body;

    let styleSheet = document.createElement('style');

    styleSheet.innerHTML = ".ssc-wrapper {\
        text-align:right; position:fixed; top:0; right:0;background:#eee;height:450px;width:400px;z-index:9999999999999999; opacity:0.5; overflow:hidden; padding:2px;\
    } .ssc-wrapper.minimized { width:160px; height: 18px;\
    } .ssc-wrapper.maximized .ssc-when-minimized { display: none\
    } .ssc-wrapper.minimized .ssc-when-maximized { display: none\
    } .ssc-wrapper .ssc-toggle-button { color:blue\
    } .ssc-wrapper textarea { width:100%;height:95%; background: #ddd;\
    } .ssc-wrapper.ssc-focused { opacity:1\
    } \
    ";


    body.appendChild(styleSheet);

    let textAreaWrapper = document.createElement("div");

    textAreaWrapper.classList.add('ssc-wrapper');

    let previousContent = localStorage.getItem(contentKey);

    let wasMinimized = localStorage.getItem(statusKey);

    textAreaWrapper.classList.add(wasMinimized === true || !previousContent ? 'minimized' : 'maximized');

    // ssc = site specific clipboard
    textAreaWrapper.innerHTML = "<b>Site Clipboard<span class='ssc-when-maximized'>(" + GM_info.script.version + ")</span>\
    <span class='ssc-toggle-button'><span class='ssc-when-maximized'>Hide</span><span class='ssc-when-minimized'>Show</span></b>\
    <textarea class='ssc-when-maximized'></textarea>"
    body.appendChild(textAreaWrapper);
    let textArea = textAreaWrapper.querySelector("textarea");


    // set the content from the previous localStorage contents
    if (previousContent !== null) {
        textArea.innerHTML = previousContent;
    }

    textArea.addEventListener("keyup", function(e) {
        // save the contents of the clipboard
        localStorage.setItem(contentKey, textArea.value);
    }
    );

    // block CTRL S  https://stackoverflow.com/questions/11000826/ctrls-preventdefault-in-chrome
    textArea.addEventListener("keydown", function(e) {
        // todo: change the e.which to e.key https://stackoverflow.com/questions/49278648/alternative-for-events-deprecated-keyboardevent-which-property
        if(e.ctrlKey && (e.which == 83)) {
            e.preventDefault();
            return false;
        }
    }
    );

    // minimize/maximize

    let minimizeButton = textAreaWrapper.querySelector(".ssc-toggle-button");

    minimizeButton.style = "cursor:pointer;"

    minimizeButton.addEventListener('click', function() {
        textAreaWrapper.classList.toggle('minimized');
        textAreaWrapper.classList.toggle('maximized');

        localStorage.setItem(statusKey, textAreaWrapper.classList.contains('minimized'));
    })

    textAreaWrapper.addEventListener("mouseenter",function() {
        textAreaWrapper.classList.add("ssc-focused");
    }
    );


    textAreaWrapper.addEventListener("mouseleave",function() {
        textAreaWrapper.classList.remove("ssc-focused");
    }
    );

})();