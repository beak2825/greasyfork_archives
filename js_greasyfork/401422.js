// ==UserScript==
// @name         0. 위메프 동디션 파인더
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://mw.wemakeprice.com/promotion/3693
// @match        https://mw.wemakeprice.com/special/category/*
// @match        https://mw.wemakeprice.com/partnermall/wmpp28325*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401422/0%20%EC%9C%84%EB%A9%94%ED%94%84%20%EB%8F%99%EB%94%94%EC%85%98%20%ED%8C%8C%EC%9D%B8%EB%8D%94.user.js
// @updateURL https://update.greasyfork.org/scripts/401422/0%20%EC%9C%84%EB%A9%94%ED%94%84%20%EB%8F%99%EB%94%94%EC%85%98%20%ED%8C%8C%EC%9D%B8%EB%8D%94.meta.js
// ==/UserScript==

$('.prd_tit:contains("에디션")').parents('a').attr('class','eventitem');
if($('.eventitem').length){
    var href = $('.eventitem').attr('href');
    window.location.href=href;
}else{
    location.reload();
}