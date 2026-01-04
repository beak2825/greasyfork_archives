// ==UserScript==
// @name         ECHEMI贸易数据Debug插件
// @namespace    https://jacoblu.me/echemi/trade-data
// @version      0.7
// @description  方便查看 ECHEMI 贸易数据请求参数
// @author       Jacob
// @match        *://*/trade-service/trade-data.html*
// @match        *://*/tradeData/company.html*
// @match        *://*/echemi_en/trade-service/trade-data.html*
// @match        *://*/echemi_en/tradeData/company.html*
// @connect      jacoblu.me
// @icon         https://www.echemi.com/static_v3/images/echemi.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445860/ECHEMI%E8%B4%B8%E6%98%93%E6%95%B0%E6%8D%AEDebug%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/445860/ECHEMI%E8%B4%B8%E6%98%93%E6%95%B0%E6%8D%AEDebug%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==
// @connect      jacoblu.me
// @icon         https://www.echemi.com/static_v3/images/echemi.png
// @grant        none
// @license MIT
// ==/UserScript==

(function() {
    'use strict';

    var rootStyle = "position: absolute;top: 90px;right: 10px;border: 1px solid rgb(222, 222, 222);background: rgb(245, 245, 245);padding: 10px;";
    var btnStyle = "background: rgb(182, 60, 60);color: white;padding: 10px 15px;border-radius: 5px;cursor: pointer;margin-top: 10px;";

    var url = location.href

    var div = "<div style='"+rootStyle+"'>";
    if(url.includes("/trade-service/trade-data.html")){
        div+="<div style='"+btnStyle+"' onclick='window.showBtdSearchHistory()'>显示查询参数</div>";
    }
    if(url.includes("/tradeData/company.html")){
        div+="<div style='"+btnStyle+"' onclick='window.showContactParamsNew()'>联系方式(资信)查询参数</div>";
        div+="<div style='"+btnStyle+"' onclick='window.showContactBtdRtnNew()'>联系方式(资信)返回数据</div>";
        div+="<div style='"+btnStyle+"' onclick='window.showContactParams()'>联系方式(旧)查询参数</div>";
        div+="<div style='"+btnStyle+"' onclick='window.showContactBtdRtn()'>联系方式(旧)返回数据</div>";
    }
    div+="</div>"

    $("body").append(div)

    // 更改登录没权益用户默认查询条件按钮
    $("#Uh4frUB8K9vCFvVjA8M2").show();

    window.showContactParamsNew = function() {
        if(window.contactDebugNew){
            var alertmsg = "";
            alertmsg += "资信数据库方式：\n";
            alertmsg += window.contactDebugNew;
            alertByDevice("联系方式(资信)查询参数",buidmsg(alertmsg));
        }else{
            alertByDevice("联系方式(资信)查询参数",buidmsg("无法获取参数"));
        }
    };

    window.showContactBtdRtnNew = function() {
        if(window.contactBtdRtnNew){
            alertByDevice("联系方式(资信)返回数据",buidmsg(window.contactBtdRtnNew));
        }else{
            alertByDevice("联系方式(资信)返回数据",buidmsg("无法获取参数"));
        }
    };

    window.showContactParams = function() {
        if(window.contactDebug){
            var alertmsg = "";
            alertmsg += "旧方式：\n";
            alertmsg += window.contactDebug;
            alertByDevice("联系方式(旧)查询参数",buidmsg(alertmsg));
        }else{
            alertByDevice("联系方式(旧)查询参数",buidmsg("无法获取参数"));
        }
    };

    window.showContactBtdRtn = function() {
        if(window.contactBtdRtn){
            alertByDevice("联系方式(旧)返回数据",buidmsg(window.contactBtdRtn));
        }else{
            alertByDevice("联系方式(旧)返回数据",buidmsg("无法获取参数"));
        }
    };

    window.showBtdSearchHistory = function() {
        var searchHistoryDivStyle ="position: absolute;top: 100px;left: 10%;width: 80%;height: calc(100% - 150px);background: rgb(231, 231, 231);font-size: 10px;z-index:9999;overflow:auto";


        if(window.searchParamsHistory&&window.searchParamsHistory.length>0){
            var historyDiv = `<div style='`+searchHistoryDivStyle+`'><style type="text/css">.tg  {border-collapse:collapse;border-spacing:0;}.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:10px;overflow:hidden;padding:10px 5px;word-break:normal;}.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:10px;font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}.tg .tg-0lax{text-align:left;vertical-align:top;min-width: 61px;}</style>
<div><table class="tg"><thead><tr>
    <th class="tg-0lax">请求时间</th>
    <th class="tg-0lax">类型</th>
    <th class="tg-0lax">页码</th>
    <th class="tg-0lax" colspan="2">请求信息</th>
  </tr></thead><tbody>`
            const reversedHistory = window.searchParamsHistory.reverse();
            for(var i=0;i<reversedHistory.length;i++){
                var row = reversedHistory[i];
                var debugDecode = decodeURIComponent(row.debug)
                historyDiv += `<tr>
    <td class="tg-0lax" rowspan="2">${row.time}</td>
    <td class="tg-0lax" rowspan="2">${row.listType}</td>
    <td class="tg-0lax" rowspan="2">${row.page}</td>
    <td class="tg-0lax">查询参数：</td>
    <td class="tg-0lax">${debugDecode}</td>
  </tr>
  <tr>
    <td class="tg-0lax">返回结果：</td>
    <td class="tg-0lax">${row.rtn}</td>
  </tr>`;
            }
            historyDiv+=`</tbody></table></div><div onclick="$(this).parent().remove()" style="position:absolute;top:0;left:0;background:#d15b5b;border:2px gray solid;color:white;width:63px;cursor:pointer;line-height:30px;text-align:center;z-index:10000;height:36px;">关闭</div></div>`;
            $("body").append(historyDiv)
        }else{
            alertByDevice("查询参数",buidmsg("无查询历史"));
        }
    };

    function buidmsg(msg){
        return `<div style='word-wrap: anywhere;max-height: 368px;overflow: auto;'>${msg}</div>`
    }
})();