// ==UserScript==
// @name         11月momo活動(需手動不用登入)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.momoshop.com.tw/mypage/MemberCenter.jsp?cid=memb&oid=mcenter&mdiv=1099800000-bt_0_150_01-bt_0_150_01_e13&ctype=B
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415674/11%E6%9C%88momo%E6%B4%BB%E5%8B%95%28%E9%9C%80%E6%89%8B%E5%8B%95%E4%B8%8D%E7%94%A8%E7%99%BB%E5%85%A5%29.user.js
// @updateURL https://update.greasyfork.org/scripts/415674/11%E6%9C%88momo%E6%B4%BB%E5%8B%95%28%E9%9C%80%E6%89%8B%E5%8B%95%E4%B8%8D%E7%94%A8%E7%99%BB%E5%85%A5%29.meta.js
// ==/UserScript==

//11/7-11/8 TV紅包 (9:11-21:11) ★每小時11分每次1000名極快

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3201320428233528",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3201090396112889",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3201420458520068",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3202600532286897",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3201021070540886",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3201921050544894",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3202300542293323",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P420201101.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "actFlag=regA&enCustNo=3202100572294325",
    "method": "POST",
});


//11/7-11/8 紅包手速爭霸賽 ★16:30開放

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3201320428233528&point=121",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3201090396112889&point=130",
    "method": "POST",
});
fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3201420458520068&point=143",
    "method": "POST",
});
fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3202600532286897&point=132",
    "method": "POST",
});
fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3201021070540886&point=113",
    "method": "POST",
});
fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3201921050544894&point=125",
    "method": "POST",
});
fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3202300542293323&point=114",
    "method": "POST",
});
fetch("https://event.momoshop.com.tw/ajax/promotionEvent_P120201107.jsp", {
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    },
    "body": "doAction=reg&enCustNo=3202100572294325&point=119",
    "method": "POST",
});

//11/7-11/8 紅包搖搖秀 (13:10, 18:10兩個時段)
fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201320428233528\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201090396112889\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201420458520068\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3202600532286897\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201021070540886\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201921050544894\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3202300542293323\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3202100572294325\",\"pNo\":\"P020201107\"}",
    "method": "POST",
});

//11/7-11/15 TV登入抽1折券 ★每日0點抽

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201320428233528\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201090396112889\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201420458520068\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3202600532286897\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201021070540886\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3201921050544894\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3202300542293323\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});

fetch("https://event.momoshop.com.tw/Lottery.PROMO", {
    "headers": {
        "Content-Type": "application/json;charset=utf-8"
    },
    "body": "{\"actFlag\":\"regA\",\"enCustNo\":\"3202100572294325\",\"pNo\":\"P520201107\"}",
    "method": "POST",
});
