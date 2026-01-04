// ==UserScript==
// @name         検索結果からGrokの要約を消す
// @namespace    https://armedpatriot.blog.fc2.com/
// @version      2025-01-23
// @description  話題を検索タブで表示される「Grokによる要約」を削除します
// @author       Patriot
// @match        https://x.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/524643/%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%8B%E3%82%89Grok%E3%81%AE%E8%A6%81%E7%B4%84%E3%82%92%E6%B6%88%E3%81%99.user.js
// @updateURL https://update.greasyfork.org/scripts/524643/%E6%A4%9C%E7%B4%A2%E7%B5%90%E6%9E%9C%E3%81%8B%E3%82%89Grok%E3%81%AE%E8%A6%81%E7%B4%84%E3%82%92%E6%B6%88%E3%81%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationList, observer) =>{
        mutationList.forEach((mutation)=>{
            if (mutation.type === 'childList'){
                const descriptionText = "Grokによる要約";
                let descriptionElement;

                Array.from(document.getElementsByTagName("span")).forEach(
                    e => {
                        if(e.textContent === descriptionText){
                            descriptionElement = e;
                        }
                    }
                );

                if(descriptionElement === undefined){
                    return;
                }

                const containerElement = descriptionElement?.parentElement?.parentElement?.parentElement?.parentElement;
                if(containerElement === undefined){
                    console.log(`cannot find containerElement: descriptionElement=${descriptionElement}`);
                    return;
                }

                containerElement.remove();
                console.log("removed Grok summary");
            }
        });
    });

    observer.observe(
        document.body,
        {
            attributes: false,
            childList: true,
            subtree: true
        }
    );
})();