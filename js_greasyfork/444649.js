// ==UserScript==
// @name         YouTube live light-weight emoji picker
// @name:ja      YouTube live light-weight emoji picker
// @namespace    http://zwpp.me/
// @version      0.3
// @description  Remove generic emoji from emoji picker and remove notificatioin for Subscribers-only chat
// @description:ja  YouTubeLive チャット欄の絵文字ピッカーをカスタム絵文字のみにすることで軽量化できます。また、ついでにチャンネル登録者限定チャット時に表示されるメッセージを表示しないようにします。
// @author       zwpp
// @match        https://www.youtube.com/live_chat*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444649/YouTube%20live%20light-weight%20emoji%20picker.user.js
// @updateURL https://update.greasyfork.org/scripts/444649/YouTube%20live%20light-weight%20emoji%20picker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let actionPanel =
    [
        window.ytInitialData.continuationContents?.liveChatContinuation.actionPanel,
        window.ytInitialData.contents?.liveChatRenderer.actionPanel
    ].find(ap => ap)

    if(!actionPanel) {
        return;
    }

    // remove notification for Subscribers-only chat
    delete actionPanel.liveChatMessageInputRenderer?.onInitialFocusCommand;

    //  remove Unicode emoji from emojiPicker
    let emojiPickerRenderer = actionPanel.liveChatMessageInputRenderer.pickers.find(obj=> obj.emojiPickerRenderer)?.emojiPickerRenderer;
    if(!emojiPickerRenderer) {
        return;
    }

    emojiPickerRenderer.categories =
        emojiPickerRenderer.categories.filter(
        function (obj){
            let categoryRenderer = obj.emojiPickerCategoryRenderer;
            if (!categoryRenderer) return true;
            return categoryRenderer.categoryId.startsWith("UC");
        });
    document.getElementById("search-panel").remove();
    document.getElementById("category-buttons").remove();
})();