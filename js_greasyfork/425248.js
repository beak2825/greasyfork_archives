// ==UserScript==
// @name         Momo購物網(投票活動需登入)-1
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  詳細用法請看最下方說明
// @author       You
// @match        https://www.momoshop.com.tw/mypage/MemberCenter.jsp?cid=memb&oid=mcenter&mdiv=1099800000-bt_0_150_01-bt_0_150_01_e13&ctype=B
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425248/Momo%E8%B3%BC%E7%89%A9%E7%B6%B2%28%E6%8A%95%E7%A5%A8%E6%B4%BB%E5%8B%95%E9%9C%80%E7%99%BB%E5%85%A5%29-1.user.js
// @updateURL https://update.greasyfork.org/scripts/425248/Momo%E8%B3%BC%E7%89%A9%E7%B6%B2%28%E6%8A%95%E7%A5%A8%E6%B4%BB%E5%8B%95%E9%9C%80%E7%99%BB%E5%85%A5%29-1.meta.js
// ==/UserScript==

//(需配合個別帳號登入)
//promoMech.jsp
//"body": "doAction=reg&m_promo_no=M20210419015&dt_promo_no=D20210419002&gift_code=air_0420"

//4/29-5/31 抽品牌無限折抵券501-500

mPromoNo="M20210429015";    //此檔期不用動
dtPromoNo="D20210429001";   //每日+1 ex明天就是D20210419007
giftcode="Gift001"         //每日的日期,投票商品號

fetch("https://www.momoshop.com.tw/ajax/promoMech.jsp", {
  "headers": {
    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  "body": "doAction=reg&m_promo_no="+mPromoNo+"&dt_promo_no="+dtPromoNo+"&gift_code="+giftcode+"",
  "method": "POST",
})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log("已完成投票抽品牌券501-500",data);
  });
