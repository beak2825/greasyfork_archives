// ==UserScript==
// @name         PostPrime - Add Posrt Off
// @namespace    https://github.com/y-muen
// @version      0.1.3
// @description  Add hide post botton in PostPrime timeline
// @author       Yoiduki <y-muen>
// @match        *://postprime.com/*
// @icon         https://www.google.com/s2/favicons?domain=postprime.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443513/PostPrime%20-%20Add%20Posrt%20Off.user.js
// @updateURL https://update.greasyfork.org/scripts/443513/PostPrime%20-%20Add%20Posrt%20Off.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addPostOff_sub = (elem) => {
        if (elem.firstChild.class !="addPostOff" ){
            const res = elem.getElementsByClassName("ThreeDotsMenu_menuWrapper__9sMmL")[0];
            if (res.lastChild.textContent == '投稿を非表示にする'){
                var img = document.createElement("img");
                img.src="/images/icons/post-off.svg";
                img.alt="post-off";
                img.style="margin: auto; padding: 10px;";
                img.class="addPostOff";
                elem.insertBefore(img, elem.firstChild);
                img.onclick = function(){res.lastChild.click()};
            }
        }
    }

    const addPostOff = () => {
        var Post_rightSide__RYfsI = document.getElementsByClassName("Post_rightSide__RYfsI");
        Post_rightSide__RYfsI = Array.from(Post_rightSide__RYfsI);
        Post_rightSide__RYfsI.forEach((elem) => addPostOff_sub(elem));
    };

    addPostOff();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            addPostOff()
        });
    });

    const config = {
        attributes: false,
        childList: true,
        characterData: false,
        subtree:true
    };

    observer.observe(document, config);
})();