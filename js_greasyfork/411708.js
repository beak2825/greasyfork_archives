// ==UserScript==
// @name         test
// @namespace    test
// @description  审核过程的错误提示, Error tips during the review process
// @homepageURL  https://greasyfork.org/scripts/test
// @version      1.9.2
// @exclude      https://global-oss.zmqdez.com/front_end/index.html#/country
// @include      https://global-oss*
// @grant        GM.xmlHttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_log
// @connect      oapi.dingtalk.com
// @connect      jinshuju.net
// @run-at       document-idle
// @author       zhousanfu
// @copyright    2020 zhousanfu@hellofun.cn
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/411708/test.user.js
// @updateURL https://update.greasyfork.org/scripts/411708/test.meta.js
// ==/UserScript==

var url = window.location.href;
var cou = 0;
var sta_time = 0;
var end_time = 0;
var grand_time = 0;
var flag = true;

if (url.indexOf("tags/audit/video") >= 0) {
    calculate;
    setInterval(function() {
    //console.log("cou:" + cou + "--" + "grand_time:" + grand_time + "/" + (cou==0?0:grand_time/cou));
        if(cou > 2){
            alert("平均每单用时<=5秒，请注意时效")
        };
        if(cou > 1 && (grand_time/cou) <= 5 * 1000){
            alert("平均每单用时<=5秒，请注意时效")
        }
        cou = 0;
    grand_time = 0;
    sta_time = new Date().valueOf();
    }, 1000 * 10);
}

var calculate = setInterval(function() {
  var btn_list = $("div.tags-operation-group > div.tags-btn-group > button");
    var ok_btn = $("div.ant-modal-footer > div > button.ant-btn.ant-btn-primary");
    var btn = document.querySelector("div.tags-audit-search-wrapper.tags-audit-search.ant-card.ant-card-bordered > div > div > div.right > button");
    if (null != btn && btn.innerText == "退出审核"){

    if(flag){
      flag=!flag;
      sta_time = new Date().valueOf();
    }

    if(undefined != btn_list[0] && 0 != $(btn_list).length){
            $(btn_list[0]).off("click");
            $(btn_list[0]).on("click",function(){
                cou += 1
                end_time = new Date().valueOf();
                grand_time += end_time - sta_time;
                sta_time = end_time;
            });
    }

        if(null != ok_btn){
            ok_btn.off("click");
            ok_btn.on("click",function(){
                cou += 1
                end_time = new Date().valueOf();
                grand_time += end_time - sta_time;
                sta_time = end_time;
            });
    }

    }
}, 100);