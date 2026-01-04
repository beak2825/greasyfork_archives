// ==UserScript==
// @name        Unfollow All Github
// @namespace   Violentmonkey Scripts
// @match       https://github.com/*?*tab=following
// @grant       none
// @version     1.0
// @author      Sabbir Hossain
// @license      MIT
// @description 6/8/2022, 12:55:28 AM
// @downloadURL https://update.greasyfork.org/scripts/446154/Unfollow%20All%20Github.user.js
// @updateURL https://update.greasyfork.org/scripts/446154/Unfollow%20All%20Github.meta.js
// ==/UserScript==
var i=1;
while(document.querySelector("#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.Layout-main > div:nth-child(2) > div > div:nth-child("+i+") > div.d-table-cell.col-2.v-align-top.text-right > span > form:nth-child(2) > input.btn.btn-sm")!=null){
if(document.querySelector("#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.Layout-main > div:nth-child(2) > div > div:nth-child("+i+") > div.d-table-cell.col-2.v-align-top.text-right > span > form:nth-child(2) > input.btn.btn-sm").value=='Unfollow'){
    document.querySelector("#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.Layout-main > div:nth-child(2) > div > div:nth-child("+i+") > div.d-table-cell.col-2.v-align-top.text-right > span > form:nth-child(2) > input.btn.btn-sm").click();
}
    i++;
}
setTimeout(()=>{
    document.querySelector("#js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.Layout-main > div:nth-child(2) > div > div.paginate-container > div > a").click();
}, 2000);