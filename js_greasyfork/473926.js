// ==UserScript==
// @name          Yahoo!知恵袋 返信スレッド展開
// @namespace     http://www.example.com/gmscripts
// @description   回答者一覧の方にある「さらに返信を表示」を自動的に展開します。(といっても未完成な書き掛けなスクリプトですが。)
// @include       https://detail.chiebukuro.yahoo.co.jp/qa/question_detail/*
// @exclude       http://www.example.org/foo
// @require
// @resource      resourceName1 resource1.png
// @resource      resourceName2 http://www.example.com/resource2.png
// @version       1.0
// @icon          http://www.example.net/icon.png
// @downloadURL https://update.greasyfork.org/scripts/473926/Yahoo%21%E7%9F%A5%E6%81%B5%E8%A2%8B%20%E8%BF%94%E4%BF%A1%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E5%B1%95%E9%96%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473926/Yahoo%21%E7%9F%A5%E6%81%B5%E8%A2%8B%20%E8%BF%94%E4%BF%A1%E3%82%B9%E3%83%AC%E3%83%83%E3%83%89%E5%B1%95%E9%96%8B.meta.js
// ==/UserScript==

// @description   Yahoo!知恵袋の回答者表示省略「その他の回答をもっと見る」を自動的に展開します。

const targetNode = document.querySelector('[class*="ClapLv3ReplyList_Chie-ReplyList__List--WillContinueReply"]');
const config = {childList: true};
const callback = function (mutationsList, observer) {
  // TODO: ループ2回目以降setTimeoutなどで短時間要求緩和
  document.querySelector('[class*="Chie-ReplyList__Button"] > button[class*="ClapLv1Button_Chie-Button"]').click();
  // observer.disconnect();
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
callback();
