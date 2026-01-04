// ==UserScript==
// @name         Mildom layout deformer
// @namespace    Mildom layout deformer
// @version      0.5
// @description  It change Mildom's layout.(ミルダムのレイアウトを変えます)
// @author       meguru
// @match        https://www.mildom.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396238/Mildom%20layout%20deformer.user.js
// @updateURL https://update.greasyfork.org/scripts/396238/Mildom%20layout%20deformer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getEle(x) {
        const res1 = document.evaluate(x, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
        if (res1.snapshotLength < 1) {
            return null;
        }
        return res1.snapshotItem(0);
    }

    setTimeout(function() {
        console.log('-------- start tamper ------------');

        const chat = getEle('//*[@id="root"]/div/div/div[2]/div[2]/div[2]');
        if (!chat) {
            console.log('not found chat');
            return;
        }
        chat.style.position = 'absolute';
        chat.style.top = '55%';
        chat.style.height = '45%';

        const chatHeader = getEle('//*[@id="root"]/div/div/div[2]/div[2]/div[2]/div[2]/div[1]');
        if (!chatHeader) {
            console.log('not found chat header');
            return;
        }
        chatHeader.style.display = 'none';

        const premiumComment = getEle('//*[@id="root"]/div/div/div[2]/div[2]/div[2]/div[2]/div[2]');
        if (!premiumComment) {
            console.log('not found premium comment');
            return;
        }
        premiumComment.style.display = 'none';

        const chatBody = getEle('//*[@id="root"]/div/div/div[2]/div[2]/div[2]/div[2]');
        if (!chatBody) {
            console.log('not found chatBody');
            return;
        }
        chatBody.style.paddingTop = '0px';

        const stamp = getEle('//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div/div[2]/div[2]');
        if (!stamp) {
            console.log('not found stamp');
            return;
        }
        const streamerHeader = getEle('//*[@id="root"]/div/div/div[2]/div[2]/div[1]/div/div[1]');
        if (!streamerHeader) {
            console.log('not found streamerHeader');
            return;
        }
        stamp.parentNode.insertBefore(streamerHeader, stamp);

        console.log('--------- end tamper -------------');
    }, 3000);

})();