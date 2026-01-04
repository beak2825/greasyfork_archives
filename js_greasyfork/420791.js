// ==UserScript==
// @name         momo不用登入(補阿明沒車的活動)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  詳細用法請見最下方說明
// @author       You
// @match        https://www.momoshop.com.tw/main/Main.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420791/momo%E4%B8%8D%E7%94%A8%E7%99%BB%E5%85%A5%28%E8%A3%9C%E9%98%BF%E6%98%8E%E6%B2%92%E8%BB%8A%E7%9A%84%E6%B4%BB%E5%8B%95%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420791/momo%E4%B8%8D%E7%94%A8%E7%99%BB%E5%85%A5%28%E8%A3%9C%E9%98%BF%E6%98%8E%E6%B2%92%E8%BB%8A%E7%9A%84%E6%B4%BB%E5%8B%95%29.meta.js
// ==/UserScript==


enCustNo1=3201021070540886;
enCustNo2=3201921050544894;
enCustNo3=3202300542293323;
enCustNo4=3202100572294325;
enCustNo5=3201320428233528;
enCustNo6=3201090396112889;
enCustNo7=3201420458520068;
enCustNo8=3202600532286897;
enCustNo9=3202501272130145;
enCustNo10=3202410202953066;

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo1+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo1+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo2+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo2+"已集章",data);
  });


fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo3+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo3+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo4+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo4+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo5+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo5+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo6+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo6+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo7+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo7+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo8+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo8+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo9+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo9+"已集章",data);
  });

fetch("https://event.momoshop.com.tw/promoMechReg.PROMO", {
  "headers": {
    "content-type": "application/json;charset=UTF-8",
  },

  "body": "{\"enCustNo\":"+enCustNo10+",\"m_promo_no\":\"M20210419012\",\"dt_promo_no\":\"D20210419001\",\"gift_code\":\"point\"}",
  "method": "POST",

})
.then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(enCustNo10+"已集章",data);
  });