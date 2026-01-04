// ==UserScript==
// @name         Momo購物網(需登入)
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  詳細用法請看最下方說明
// @author       You
// @match        https://www.momoshop.com.tw/mypage/MemberCenter.jsp?cid=memb&oid=mcenter&mdiv=1099800000-bt_0_150_01-bt_0_150_01_e13&ctype=B
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415680/Momo%E8%B3%BC%E7%89%A9%E7%B6%B2%28%E9%9C%80%E7%99%BB%E5%85%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415680/Momo%E8%B3%BC%E7%89%A9%E7%B6%B2%28%E9%9C%80%E7%99%BB%E5%85%A5%29.meta.js
// ==/UserScript==
//momo週簽(需配合個別帳號登入)
//promoMech.jsp
//"body": "doAction=reg&m_promo_no=M20210419009&dt_promo_no=D20210419001&gift_code="


//這裡開始設定
//7/16-7/31週簽

mPromoNo="M20210716006";
dtPromoNo="D20210716001";


//下面不用改
fetch("https://www.momoshop.com.tw/ajax/promoMech.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    "body": "doAction=reg&m_promo_no="+mPromoNo+"&dt_promo_no="+dtPromoNo+"&gift_code=",
    "method": "POST",
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成週簽(每週第一抽的獎項才會入帳號)",data);
  });