// ==UserScript==
// @name:zh-tw      OMG NAS 自動點開常用資料夾
// @name            OMG NAS Auto open default folder
// @namespace       com.sherryyue.omgnasdefaultfolderchanger
// @version         0.4
// @description:zh-tw   開啟NAS後自動點開對內共用區
// @description         Automatically open the folder "對內共用區" after opening the NAS
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://nas.wpkgg.com:5001/*
// @run-at          document-end
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @require         http://code.jquery.com/jquery-3.4.1.min.js
// @require         https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/507753/OMG%20NAS%20Auto%20open%20default%20folder.user.js
// @updateURL https://update.greasyfork.org/scripts/507753/OMG%20NAS%20Auto%20open%20default%20folder.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const fileStation = '#ext-gen135';
    // @ts-ignore
    waitForKeyElements(fileStation, () => {
        document.querySelector(fileStation).click();
        console.log('已幫您自動點開「File station」');
        const folder0 = '[ext\\:tree-node-id="remote\\/對內共用區"]';
        // @ts-ignore
        waitForKeyElements(folder0, () => {
            document.querySelector(folder0).children[1].click();
            console.log('已幫您自動點開「對內共用區」');
            // const folder1 = '[ext\\:tree-node-id="remote/對內共用區/1018S-招財聚寶"]';
            // waitForKeyElements(folder1, () => {
            //     document.querySelector(folder1).children[1].click();
            //     console.log('已幫您自動點開「1018S」');
            //     const folder2 = '[ext\\:tree-node-id="remote/對內共用區/1018S-招財聚寶/移交給程式檔"]';
            //     waitForKeyElements(folder2, () => {
            //         document.querySelector(folder2).click();
            //         console.log('已幫您自動點開「移交給程式檔」');
            //     });
            // });
        });
    });
})();
