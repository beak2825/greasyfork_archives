// ==UserScript==
// @name         MOMO電視館(APP)登入
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  詳細用法請看最下方說明
// @author       You
// @match        https://tv.momoshop.com.tw/main.momo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418782/MOMO%E9%9B%BB%E8%A6%96%E9%A4%A8%28APP%29%E7%99%BB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/418782/MOMO%E9%9B%BB%E8%A6%96%E9%A4%A8%28APP%29%E7%99%BB%E5%85%A5.meta.js
// ==/UserScript==

//momoAPP(需配合個別帳號app行動版登入)
//ajaxTool.jsp
//"body": "doAction=reg&m_promo_no=M20210419009&dt_promo_no=D20210419001&gift_code="

//4/19-5/12 momotv
//這裡開始設定

npn="1vEJNEHL0yDL";

//下面不用動

fetch("https://tv.momoshop.com.tw/ajax/ajaxTool.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    "body": "data=%7B%22flag%22%3A%22getActivity%22%2C%22data%22%3A%7B%22promoNo%22%3A%22-%22%2C%22activitiesType%22%3A%22LUCKYDRAW%22%2C%22npn%22%3A%22"+npn+"%22%2C%22promoGoodsCode%22%3A%22%24%7BpromoGoodsCode%7D%22%2C%22singleGroup%22%3A%5B0%5D%2C%22isTVPoint%22%3A%5B%22NO%22%5D%2C%22promoNoOfPoint%22%3A%5B%22-%22%5D%2C%22isAlternate%22%3A%5B%22NO%22%5D%2C%22isShowNowGift%22%3A%5B%22NO%22%5D%2C%22isNewCust%22%3A%5B%5D%2C%22isFristBuy%22%3A%5B%22NO%22%5D%2C%22isVIPCust%22%3A%5B%22NO%22%5D%2C%22getGiftList%22%3Afalse%2C%22type%22%3A%221%22%7D%7D",
    "method": "POST",
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成TV館抽mo幣",data);
  });
