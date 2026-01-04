// ==UserScript==
// @name 广东东软学院查分小助手
// @namespace score.checking.assistant
// @version 1.3
// @description 广东东软学院查分小助手，安装完脚本打开教务网登录刷新即可，能不能获取到分数看接口有没有被限制 载至7.8号可以正常使用
// @author 落雪无痕
// @match http://172.13.1.32/*
// @require https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @connect 172.13.1.32/
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @icon http://172.13.1.32/styles/images/customize/logo_school.gif
// @grant GM_xmlhttpRequest
// @grant GM_download
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447551/%E5%B9%BF%E4%B8%9C%E4%B8%9C%E8%BD%AF%E5%AD%A6%E9%99%A2%E6%9F%A5%E5%88%86%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447551/%E5%B9%BF%E4%B8%9C%E4%B8%9C%E8%BD%AF%E5%AD%A6%E9%99%A2%E6%9F%A5%E5%88%86%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var styleContent = `style="padding: 5px 10px; font-size: 12px; font-family: Verdana; color: #5b7da3;"`
    var set = new Set();
    var html = `
    <table border="0px" cellspacing="1" style="border-collapse:collapse;border-style: solid;border- 1px;">
      <tr>
      <th ${styleContent}>课程名称</th>
      <th ${styleContent}>总成绩</th>
      <th ${styleContent}>绩点</th>
    </tr>`
    var tableContent = `<tr style="border-top-width: 1px;border-top-style: solid;border-top-color: #a8bfde;">`
    var flag = true
    function addXMLRequestCallback(callback){
        var oldSend, i;
        if( XMLHttpRequest.callbacks ) {
            XMLHttpRequest.callbacks.push( callback );
        } else {
            XMLHttpRequest.callbacks = [callback];
            oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(){
                for( i = 0; i < XMLHttpRequest.callbacks.length; i++ ) {
                    XMLHttpRequest.callbacks[i]( this );
                }
                oldSend.apply(this, arguments);
            }
        }
    }

    addXMLRequestCallback( function( xhr ) {
        xhr.addEventListener("load", function(){
            if ( xhr.readyState == 4 && xhr.status == 200  && flag) {
                if ( xhr.responseURL.includes("notice!getNotice.action") ) {
                    let item = sortByScore(JSON.parse(xhr.response))
                    for (const key in item) {
                        let scoreMsg = JSON.parse(item[key].msg)
                        let kcmc = scoreMsg.kcmc
                        let jd = scoreMsg.jd
                        let zcj = scoreMsg.zcj
                        if (set.has(kcmc)) {
                            continue;
                        } else {
                            set.add(kcmc)
                        }
                        html +=
                            `${tableContent}<td ${styleContent}>${kcmc}</td>
                             <td ${styleContent}>${zcj}</td>
                             <td ${styleContent}>${jd}</div></td>
                             </tr>`
                    }
                    console.log(html)
                    html +=  `</table >`
                    console.log(html)
                    let ele = $("body > table > tbody > tr > td.cs-middle.cs-bg > div.cs-div.cs-mid3")
                    ele.append(`<div class="cs-mid-title">课程成绩</div><div class="lock">${html}</div>`)
                    flag = false;
                }
            }
        });
    });

    function sortByScore(array) {
    return array.sort((a, b) => JSON.parse(b.msg).zcj - JSON.parse(a.msg).zcj)
}

})();