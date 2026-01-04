// ==UserScript==
// @name         Highlight purchased item on DLsite
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  購入済みアイテムの背景色を変更します
// @author       PUMPKIN
// @match        https://www.dlsite.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/476376/Highlight%20purchased%20item%20on%20DLsite.user.js
// @updateURL https://update.greasyfork.org/scripts/476376/Highlight%20purchased%20item%20on%20DLsite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const backgroundColor = "gray";

    var observer = new MutationObserver((mutations, observer) => {
        mutations.forEach(record => {
            if(record.target.className === 'btn_dl') {
                if(record.target.closest('.search_result_img_box_inner')) {
                    //割引中、サークル情報等
                    record.target.closest('.search_result_img_box_inner').style.backgroundColor = backgroundColor;
                } else if(record.target.closest('.n_worklist_item')) {
                    //サークル情報の割引中作品
                    record.target.closest('.n_worklist_item').style.backgroundColor = backgroundColor;
                } else if(record.target.closest('tr')) {
                    //検索結果
                    record.target.closest('tr').style.backgroundColor = backgroundColor;
                };
            };
        });
    });

    observer.observe(document, {
        subtree: true,
        attributes: true,
    });
})();