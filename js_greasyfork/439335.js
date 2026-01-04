// ==UserScript==
// @name         MZ Spoiler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Spoilers for MZ
// @author       Murder
// @match        https://www.managerzone.com/?p=forum&sub=topic*
// @icon         https://www.google.com/s2/favicons?domain=lsue.edu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439335/MZ%20Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/439335/MZ%20Spoiler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var template = `<div class="spoiler" style="border: 1px solid #ddd; padding: 3px;">
	<input type="button" class="btnSpoiler" value="Mostrar/Esconder Spoiler" style="background-color: palegreen">
	<div class="inner" style="display: none; border: 1px solid #eee;padding: 3px; margin: 3px;">
	###text###
	</div>
</div>`;

    replaceSpoilers();
    //addMarkItUpEvent();

    function replaceSpoilers() {
        let posts = document.getElementsByClassName('forum-post-content');
        let parsedMsg = '';
        for(let i = 0; i < posts.length; i++) {
            let text = posts[i].children[0].defaultValue;
            let exit = false;
            while(!exit) {
                if(posts[i].innerHTML.indexOf("[spoiler]") !== -1 && posts[i].innerHTML.indexOf("[/spoiler]") !== -1 &&
                   posts[i].innerHTML.indexOf("[spoiler]") < posts[i].innerHTML.indexOf("[/spoiler]")) {
                    let spoiler = posts[i].innerHTML.substring(posts[i].innerHTML.indexOf("[spoiler]"), posts[i].innerHTML.indexOf("[/spoiler]") + 10);
                    let spoilerText = posts[i].innerHTML.substring(posts[i].innerHTML.indexOf("[spoiler]") + 9, posts[i].innerHTML.indexOf("[/spoiler]"));
                    let readyTemplate = template.replace('###text###', spoilerText)
                    posts[i].innerHTML = posts[i].innerHTML.replace(spoiler, readyTemplate);
                }
                else {
                    exit = true;
                }
            }

            let btn = document.getElementsByClassName('btnSpoiler');
            for(let i = 0; i < btn.length; i++) {
                btn[i].addEventListener('click', showSpoiler, false);
            }
        }
    }

    function addMarkItUpEvent() {
        let markBtn = document.getElementsByClassName('markItUpButton markItUpButton12 preview')[0];
        markBtn.addEventListener('click', replaceMarkItUp, false);
    }

    function replaceMarkItUp(obj) {
        var iframe = document.getElementsByClassName("markItUpPreviewFrame")[0];
        var checkExist = setInterval(function() {
                if (iframe) {
                    let text = iframe.contentWindow.document.getElementsByTagName("div")[0].innerHTML;
                    if(text.indexOf("[spoiler]") !== -1 && text.indexOf("[/spoiler]") !== -1 &&
                       text.indexOf("[spoiler]") < text.indexOf("[/spoiler]")) {
                        let spoiler = text.substring(text.indexOf("[spoiler]"), text.indexOf("[/spoiler]") + 10);
                        let spoilerText = text.substring(text.indexOf("[spoiler]") + 9, text.indexOf("[/spoiler]"));
                        let readyTemplate = template.replace('###text###', spoilerText)
                        iframe.contentWindow.document.getElementsByTagName("div")[0].innerHTML = iframe.contentWindow.document.getElementsByTagName("div")[0].innerHTML.replace(spoiler, readyTemplate);

                        let btn = iframe.contentWindow.document.getElementsByClassName('btnSpoiler');

                        for(let i = 0; i < btn.length; i++) {
                            btn[i].addEventListener('click', showSpoiler, false);
                        }
                    }
                    clearInterval(checkExist);
                }
            }, 1000);
    }

    function showSpoiler(obj) {
        var inner = obj.currentTarget.parentNode.getElementsByTagName("div")[0];
        if (inner.style.display == "none") {
            inner.style.display = "";
        }
        else {
            inner.style.display = "none";
        }
    }

})();