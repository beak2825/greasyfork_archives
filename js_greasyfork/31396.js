// ==UserScript==
// @name        remove俺
// @namespace   お前ら
// @description 【SS宝庫】みんなの暇つぶしで"俺とお前らの愛の歴史"カテゴリーを消します
// @include     http://minnanohimatubushi.2chblog.jp/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31396/remove%E4%BF%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/31396/remove%E4%BF%BA.meta.js
// ==/UserScript==
function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

targets = ["俺とお前らの愛の歴史"]
for(let cate of targets) {
  for (num = 0; num < 10; num++) {
    var xpath = `//*[contains(text(),'${cate}')]/ancestor::div[@class='article-outer hentry']`;
    var ele = getElementByXpath(xpath);
    if (ele == null) {
      break;
    } else {
    ele.remove();
    }
  }
}