// ==UserScript==
// @name         PTHOME 辅助脚本
// @namespace    http://tampermonkey.net/
// @version      1.00
// @description  辅助脚本 辅助使用pthome
// @author       eveloki
// @supportURL   https://pthome.net/contactstaff.php
// @compatible   chrome
// @compatible   firefox
// @compatible   edge
// @license      MIT
// @include      *://pthome.net/torrents.php*
// @include      *://*.pthome.net/torrents.php*
// @include      *://pthome.net/complains.php*
// @include      *://*.pthome.net/complains.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@2.6.2/base64.js
// @run-at       ddocument-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431336/PTHOME%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/431336/PTHOME%20%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Your code here...
    var jq3v= jQuery.noConflict();
    console.info(jQuery.fn.jquery);
    var TTMtick = "PTH_" + new Date().getTime();
    var tdhtml = "<tr> "
        //+ "<td class=\"rowhead nowrap\" valign=\"top\" align=\"right\">额外功能（BETA）</td> "
        + "<td class=\"rowfollow\" valign=\"top\" align=\"left\" id=\"" + TTMtick + "_td\"  > <b>快速回复</b></br> "
        //+ '<font class="medium">此功能区由 PTHOME 辅助脚本 自动生成</font></br>'
        //+ "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_copy\" class=\"btn PTH_copy\" value=\"通过剪切板导入\"> "
        //+ "<font class=\"medium\">此功能将从您的剪切板读取内容</font></br>"
        //+ "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_txt\" class=\"btn PTH_txt\" value=\"通过文本导入\"> "
        //+ "<font class=\"medium\">&emsp;此功能将会弹出一个文本框 您需要将软件生成的内容复制进去</font></br>"
        //+ "<input type=\"button\" name=\"" + TTMtick + "\" id=\"" + TTMtick + "_api\" class=\"btn PTH_api\" value=\"一键导入\"> "
        //+ "<font class=\"medium\">&emsp;&emsp;&emsp;此功能将尝试与本机软件进行通讯 获取信息</font></br>"
        + "</td> "
        + "</tr> ";
    jq3v.getScript('https://cdn.staticfile.org/layer/3.1.1/layer.js', function () {

        var helpdata=[
            "不好意思，您的情况我理解，但是按照规则的确无法解封，您可以尝试重新获取邀请，或者捐赠解封https://pthome.net/donate.php",
            "因为之前保种良好，破例解封一次，帐户魔力清空，下不为例",
            "您的情况需要核实，如需申述请加群752205078",
            "您好，请附上流水号，负责人一般在24小时内处理"
        ];
        if(jq3v("#reply").length>0)
        {
            jq3v("#reply").parent().parent().after(tdhtml);
             jq3v.each(helpdata,function(index,item){
                 var cachehtml=
                     "<input type=\"button\" name=\"" + TTMtick + "\" class=\"btn PTH_txt\" value=\""+(index+1)+"____\" text=\""+item+"\" > "
                     + "<font class=\"medium\" title=\""+item+"\">&emsp;"+LimitNumber(item,20)+"</font></br>";
                 jq3v("#"+TTMtick + "_td").append(cachehtml);
             });
        }
        //jq3v("#reply table tr").eq(0).after(tdhtml);
        layer.msg("脚本加载成功", { icon: 6, skin: 'layui-layer-lan' });
        //填充文字
        jq3v("#"+TTMtick + "_td").find("[name='"+TTMtick+"']").unbind().click(function () {
            var text=jq3v(this).attr("text");
            jq3v("#reply textarea[name='body']").eq(0).append(text+"\n");
        })
        /*用js限制字数，超出部分以省略号...显示*/
        function LimitNumber(txt,length) {
            var str = txt;
            if(str.length>length)
            {
                str = str.substr(0,length) + '...' ;
                return str;
            }
            return str;
        }
    });
})();