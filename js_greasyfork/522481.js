// ==UserScript==
// @name                YT👏Boost chat
// @version             1.4.5
// @description         在其它人拍手時自動跟著一起拍
// @author              琳(jim60105)
// @match               https://www.youtube.com/live_chat*
// @icon                https://www.youtube.com/favicon.ico
// @license             GPL3
// @namespace https://greasyfork.org/users/4839
// @downloadURL https://update.greasyfork.org/scripts/522481/YT%F0%9F%91%8FBoost%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/522481/YT%F0%9F%91%8FBoost%20chat.meta.js
// ==/UserScript==
/*
 * 原腳本作者
https://xn--jgy.tw/Livestream/my-vtuber-dd-life/
https://gist.github.com/jim60105/43b2c53bb59fb588e351982c1a14e273
 * YouTube Boost Chat導致聊天室元素變更，修改後搭配使用
https://greasyfork.org/zh-TW/scripts/520755/discussions/271546#comment-555456
*/
(function () {
    'use strict';

    /**
     * 注意: 這個腳本只能在 Youtube 的直播聊天室使用
     *
     * 若聊天室不是在前景，Youtube 可能會停止更新聊天室，導致功能停止
     *
     * 聊天室由背景來到前景時，或是捲動停住後回到最下方時，有可能因為訊息一口氣噴出來而直接觸發
     * 請調整下方的 throttle 數值，以避免這種情況
     * 訊息過多時預設的1.5秒可能會不夠，但設定太高會影響偵測判定
     * 訊息過多時建議直接F5重整，不要讓它一直跑
     *
     * 要使用或偵測 Youtube 貼圖/會員貼圖，可填入像是這種格式 :_右サイリウム::_おんぷちゃん::_ハート:
     * 若你有使用貼圖的權限，它就能自動轉換成貼圖，請小心使用
     */

    // --- 設定區塊 ---
    /**
     * 要偵測的觸發字串
     * 這是一個文字陣列，這些字串偵測到時就會記數觸發
     * 可以輸入多個不同頻道的會員拍手貼圖做為偵測字串
     */
    const stringToDetect = [
        ':clapping_hands::clapping_hands::clapping_hands:', // 這是三個拍手表符(👏👏👏)
        ':washhands::washhands::washhands:',
    ];
    const stringToReply = '👏👏👏';

    // 範例條件說明:
    // 偵測到「4」次字串才觸發
    // (同一則訊息內重覆比對時只會計算一次)
    // 在「1.5」秒內重覆被偵測到也只計算一次
    // 偵測間隔不得超過「10」秒，超過的話就重新計算
    // 自動發話後至少等待「120」秒後才會再次自動發話
    /**
     * 要偵測的次數
     */
    const triggerCount = 2;
    /**
     * 每次間隔不得超過的秒數
     */
    const triggerBetweenSeconds = 20;
    /**
     * 自動發話後至少等待的秒數
     */
    const minTimeout = 120;
    /**
     * 在這個秒數內重覆偵測到觸發字串，至多只會計算一次
     * (這是用來避免當視窗由背景來到前景時，聊天記錄一口氣噴出來造成誤觸發)
     */
    const throttle = 0.5;
    // --- 設定區塊結束 ---

    let lastDetectTime = new Date(null);
    let currentDetectCount = 0;
    let lastTriggerTime = new Date(null);

    if (window.location.pathname.startsWith('/embed')) return;

    if (
        typeof ytInitialData !== 'undefined' &&
        ytInitialData.continuationContents?.liveChatContinuation?.isReplay
    ) {
        console.debug('Replay mode, exit.');
        return;
    }

    onAppend(
        document
            .getElementsByTagName('yt-live-chat-item-list-renderer')[0]
            ?.querySelector('.bst-message-list'),
        function (added) {
            added.forEach((node) => {
                console.debug('Messages node: ', node);

                const text = GetMessage(node);
                if (!text) return;

console.log('拍手：文字', text)

                if (!DetectMatch(text)) return;

console.log('拍手：文字已匹配', text)

                if (!CheckTriggerCount()) return;

console.log('拍手：觸發數通過', text)

                if (!CheckTimeout()) return;

console.log('拍手：等待時間通過', text)

                SendMessage(stringToReply);

console.log('拍手：已發送', stringToReply)

            });
        }
    );

    function onAppend(elem, f) {
        if (!elem) return;
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (m) {
                if (m.addedNodes.length) {
                    f(m.addedNodes);
                }
            });
        });
        observer.observe(elem, { childList: true });
    }

    function GetMessage(node) {
        const messageNode = node.querySelector('.bst-message-body');
        if (!messageNode) return '';

        let text = messageNode.innerText;

        const emojis = messageNode.getElementsByTagName('img');
        for (const emojiNode of emojis) {
            text += emojiNode.getAttribute('shared-tooltip-text', 1);
        }
        console.debug('Message: ', text);
        return text;
    }

    function DetectMatch(text) {
        let match = false;
        stringToDetect.forEach((p) => {
            match |= text.includes(p);
        });

        if (!match) return false;

        console.debug(`Matched!`);

        if (lastDetectTime.valueOf() + throttle * 1000 >= Date.now()) {
            console.debug('Throttle detected');
            return false;
        }

        if (lastDetectTime.valueOf() + triggerBetweenSeconds * 1000 < Date.now()) {
            currentDetectCount = 1;
            console.debug('Over max trigger seconds. Reset detect count to 1.');
        } else {
            currentDetectCount++;
        }

        lastDetectTime = Date.now();
        console.debug(`Count: ${currentDetectCount}`);
        return true;
    }

    function CheckTriggerCount() {
        const shouldTrigger = currentDetectCount >= triggerCount;
        if (shouldTrigger) console.debug('Triggered!');
        return shouldTrigger;
    }

    function CheckTimeout() {
        const isInTimeout = lastTriggerTime.valueOf() + minTimeout * 1000 > Date.now();
        if (isInTimeout) console.debug('Still waiting for minTimeout');
        return !isInTimeout;
    }

    function SendMessage(message) {
        try {
            const input = document
                .querySelector('yt-live-chat-text-input-field-renderer[class]')
                ?.querySelector('#input');

            if (!input) {
                console.warn('Cannot find input element');
                console.warn('可能是訂閱者專屬模式?');
                return;
            }

            const data = new DataTransfer();
            data.setData('text/plain', message);
            input.dispatchEvent(
                new ClipboardEvent('paste', { bubbles: true, clipboardData: data })
            );
          try {
    document.querySelector('yt-live-chat-text-input-field-renderer[class]').polymerController.onInputChange();
} catch (e) { }
            setTimeout(() => {
                // Youtube is 💩 that they're reusing the same ID
                const buttons = document.querySelectorAll('#send-button');
                // Click any buttons under #send-button
                buttons.forEach((b) => {
                    const _buttons = b.getElementsByTagName('button');
                    // HTMLCollection not array
                    Array.from(_buttons).forEach((_b) => {
                        _b.click();
                    });
                });
                console.log(`[${new Date().toISOString()}]自動發話觸發: ${message}`);
            }, 500);
        } finally {
            lastTriggerTime = Date.now();
            currentDetectCount = 0;
        }
    }
})();