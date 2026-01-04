// ==UserScript==
// @name         OA脚本
// @version      1.0.4
// @description  提升OA办公效率
// @author       张亮 ，邮箱：azhangliang@vip.qq.com


// @match        https://*.zjlcwg.com/*



// @icon         https://www.google.com/s2/favicons?sz=64&domain=zjlcwg.com

// @grant        GM_log
// @grant        GM_addStyle


// @run-at       document-end

// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js

// @namespace https://greasyfork.org/users/966873
// @downloadURL https://update.greasyfork.org/scripts/452522/OA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/452522/OA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

// 当前URL
let _URL = location.href;
// 【邮件中心】->【写信】
let SENDMAIL_VAL = _URL.indexOf('https://www3.zjlcwg.com/OfficeManagement/RoutinelyManager/Mail/SendMail.aspx')!==-1
// 【流程中心】->【启动流程】->【1.01.02工作联系单】
let WORKCONTACT_VAL = _URL.indexOf("https://www3.zjlcwg.com/BPMSite/Forms/Post.aspx")!==-1




// 工作联系单侧边栏 id：mainWorkSpace
var _id_side = "#mainWorkSpace";
// 工作联系单侧边栏 元素 id：winVP
var _id_item_winVP = '#winVP';
// 问号？图标
var _ico_wenhao = `<div class="hoverTip" flag="true" style="position: absolute; width: 19px; height: 19px; right: 3px; top: 3px; background: url(&quot;../../../dhtmlx/imgs/hoverTip.png&quot;) no-repeat; cursor: pointer;"></div>`;
// 工作联系单侧边栏待插入的的工作区
var _div_toolbar = 
    `
    <div class="divFile" style="margin-top:5px;">
        <div class="divFileTop">工具箱:如有问题请联系张亮</div>
        <div class="divFileList">
            <input id="zl_btn_muban" class="button" type="button" value="工作联系单模板库">
            <input id="zl_btn_zidingyi" class="button" type="button" value="自定义模板库">
        </div>
        
        </div>
    </div>
    `;


(function(){   
    console.log('%c 张亮油猴脚本 %c Version:1.0.0','color:white;;background:#030307;padding:5px;','background:pink;padding:5px;color:black;');
    if(WORKCONTACT_VAL){
        $('#table tr').eq(3).children("td").first().html($('#table tr').eq(3).children("td").first().html()+_ico_wenhao);
        $(_id_item_winVP).before(_div_toolbar);
        $('#zl_btn_muban').click(function(){
            alert('test1');
        })
    }else{
        console.log(_URL)
    }
})();
