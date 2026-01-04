// ==UserScript==
// @name         HHU Notice File Download Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Help you download notice file from hhu oa system not need plugins.
// @author       JiaFeiMiao-k-Cat
// @match        http://202.119.113.213/seeyon/bulData.do?*
// @match        http://newoa.hhu.edu.cn/seeyon/bulData.do?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.hhu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463738/HHU%20Notice%20File%20Download%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/463738/HHU%20Notice%20File%20Download%20Helper.meta.js
// ==/UserScript==
function getFileName(){
    var s = document.querySelector("#viewOriginalContentA").getAttribute('onclick');
    var re = /popupContentWin\('.*','(.+?)','.*','.*','.*','(.+?)'\)/;
    var arr = re.exec(s);
    return arr[2] + '.' + arr[1].toLowerCase();
}
function getDownloadLink(){
    var s = document.querySelector("#mainbodyDiv > iframe").getAttribute('src');
    var re = /\/seeyon\/officeTrans\.do\?fileCreateDate=(.+?)\&fileCreateDate1=(.+?)\&fileId=(.+?)\&v=(.+?)\&needDownload=false\&filename=(.+?)$/;
    var arr = re.exec(s);
    return `/seeyon/fileDownload.do?method=doDownload&filename=` + getFileName() + `&v=` + arr[4] + `&viewMode=download&fileId=` + arr[3] + `&createDate=` + arr[2];
}
(function() {
    'use strict';
    var new_span = document.createElement("span");
    $("#noprint > span").append(
`<span class="head_title_collect hand">
    <span class="syIcon sy-call_template set_color_gold"></span>
    <span><a href="` + getDownloadLink() + `">点击下载</a></span>
</span>`);
})();