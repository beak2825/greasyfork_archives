// ==UserScript==
// @name         西工大疫情填报
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  npu疫情填报
// @author       yaorelax
// @match        https://yqtb.nwpu.edu.cn/wx/ry/jrsb_xs.jsp
// @license      GPL-3.0 License
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/450449/%E8%A5%BF%E5%B7%A5%E5%A4%A7%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/450449/%E8%A5%BF%E5%B7%A5%E5%A4%A7%E7%96%AB%E6%83%85%E5%A1%AB%E6%8A%A5.meta.js
// ==/UserScript==

function getFormattedDate(impDate){
    let date;
    if (!impDate) {
        date = new Date();
    }else{
        date = new Date(impDate);
    }
    date.setMinutes(date.getMinutes()-date.getTimezoneOffset());
    return date.toISOString().replace('T',' ').replace('Z','').substring(0,19);
}


function message(data) {
    let base = document.createElement("div");
    var baseInfo = "";
    baseInfo += '<div class="last_time">' + "上次访问时间：" + getFormattedDate(data) + "<\/div>";
    base.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(base)
}



(function() {
    message(GM_getValue('last_date'));

    let styleStr = `
    .last_time {
      width: auto !important;
      position: fixed !important;
      top: 250px !important;
      left: 10px !important;
      z-index: 99999 !important;
      font-size: 200% !important;
      color: #000000 !important;
    }
  `
  let body = document.body;
  let styleDom = document.createElement('style');
  styleDom.id = 'yaorelax-npu-index'
  styleDom.innerHTML = styleStr;
  body.appendChild(styleDom);


    if (document.querySelector(".co4") == null)
    {
        go_sub();
        document.querySelector(".co3").click();
        save();
    }
    else
    {
        setTimeout('location.reload()', 3600000);
    }
    Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
    }
    var myDate = new Date().Format("yyyy-MM-dd hh:mm:ss"); ;
    GM_setValue('last_date', myDate);
})();