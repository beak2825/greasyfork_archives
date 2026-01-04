// ==UserScript==
// @name         Mini search box for docs
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  Press alt + m or click the arrow to get a smaller search box in google docs when doing an advanced search (search and remplace/use regular expressions)
// @author       You
// @match        https://docs.google.com/document/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431326/Mini%20search%20box%20for%20docs.user.js
// @updateURL https://update.greasyfork.org/scripts/431326/Mini%20search%20box%20for%20docs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function on1key() {
        let id = document.getElementsByClassName("modal-dialog docs-dialog docs-findandreplacedialog")[0].getAttribute("aria-labelledby")
        if (isClosed == 0) {
            document.getElementById(id).parentNode.style.display="none";
            document.getElementById(id+".contentEl").children[0].children[0].children[0].style.display="none";
            document.getElementsByClassName("modal-dialog docs-dialog docs-findandreplacedialog")[0].style.backgroundColor="rgba(255,255,255,0)";
            margin = document.getElementsByClassName("docs-findandreplacedialog-buttons")[0].style.marginTop;
            document.getElementsByClassName("docs-findandreplacedialog-buttons")[0].style.marginTop="0px";
            document.getElementById(id+".contentEl").style.backgroundColor="rgba(255, 255, 255, 0)";
            //document.getElementsByClassName("docs-findandreplacedialog-buttons")[0].children[0].appendChild(dropdown);
            //dropdown.innerHTML="<span class=\"modal-dialog-title-text\" id=\"c4ca03:un\" role=\"heading\" style=\"position: absolute;left: 560px;width: auto;min-width: 0px;transform: rotate(180deg);\">⋁</span>";
            width = document.getElementsByClassName("modal-dialog docs-dialog docs-findandreplacedialog")[0].style.width;
            document.getElementsByClassName("modal-dialog docs-dialog docs-findandreplacedialog")[0].style.width = "590px";
            isClosed = 1;
        } else {
            document.getElementById(id).parentNode.style.display="inherit";
            document.getElementById(id+".contentEl").children[0].children[0].children[0].style.display="inherit";
            document.getElementsByClassName("modal-dialog docs-dialog docs-findandreplacedialog")[0].style.backgroundColor="rgba(255,255,255,1)";
            document.getElementsByClassName("docs-findandreplacedialog-buttons")[0].style.marginTop=margin;
            document.getElementById(id+".contentEl").style.backgroundColor="";
            document.getElementsByClassName("modal-dialog docs-dialog docs-findandreplacedialog")[0].style.width = width;
            //document.querySelector("body > div.modal-dialog.docs-dialog.docs-findandreplacedialog > div.modal-dialog-title.modal-dialog-title-draggable").appendChild(dropdown);
            //dropdown.innerHTML="<span class=\"modal-dialog-title-text\" id=\"c4ca03:un\" role=\"heading\" style=\"position: absolute;left: 480px;width: auto;min-width: 0px;\">⋁</span>";
            isClosed = 0;
        }
    }
    function onMutate(){
        if (document.querySelector("body > div.modal-dialog.docs-dialog.docs-findandreplacedialog > div.modal-dialog-title.modal-dialog-title-draggable") !== null){
            //document.querySelector("body > div.modal-dialog.docs-dialog.docs-findandreplacedialog > div.modal-dialog-title.modal-dialog-title-draggable").appendChild(dropdown);
            //dropdown.innerHTML="<span class=\"modal-dialog-title-text\" id=\"c4ca03:un\" role=\"heading\" style=\"position: absolute;left: 480px;width: auto;min-width: 0px;\">⋁</span>";
            //dropdown.addEventListener("click", on1key, false);
            this.disconnect();
        }
    }

    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.altKey == true && evt.keyCode == 77) {
            on1key();
        }
    }
    var dropdown = undefined//document.createElement("span");
    var isClosed = 0;
    var margin = 0;
    var width = 0;
    const options = {
        subtree: true,
        childList: true
    };
    new MutationObserver(onMutate).observe(document.querySelector("body"),options);
    document.addEventListener('keydown', onKeydown, true);
})();