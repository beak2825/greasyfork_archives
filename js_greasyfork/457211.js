/* globals jQuery, $, waitForKeyElements */
// ==UserScript==
// @name         西邮自动评教
// @namespace    L
// @license      MIT
// @version      1.3
// @description  西安邮电大学自动评价脚本
// @author       XUPT LinLiWei
// @match        *://*.zfjw.xupt.edu.cn/jwglxt/xspjgl/xspj_cxXspjIndex.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xupt.edu.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/457211/%E8%A5%BF%E9%82%AE%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/457211/%E8%A5%BF%E9%82%AE%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

var panel=$('<div style="width: 330px; position: fixed; top: 30px; right: 30px; z-index: 99999; background-color: white; overflow-x: auto;box-shadow: 0 0 5px #4E4E4E; padding:10px;border-radius: 7px;display: flex;flex-direction: column;align-items: center;">\n' +
        '    <div style="width: 100%;margin-bottom: 20px;display: flex;flex-direction: row;">\n' +
        '        <span style="width: 50%;display: flex;color: black">西邮教务自动评教</span>\n' +
        '        <span style="font-size: 3px;color: rgba(0,0,0,0.7);width: 50%;display: flex;justify-content: right;align-items: center;">By LinLiWei</span>\n' +
        '    </div>\n' +
        '\n' +
        '    <button style="background-color: rgba(49,131,254,0.9);\n' +
        '      color: #ffffff;\n' +
        '      width: 100px;\n' +
        '      height: 30px;\n' +
        '      border: 0;\n' +
        '      font-size: 16px;\n' +
        '      box-sizing: content-box;\n' +
        '      border-radius: 5px;" onmouseover="this.style.cssText=\'background-color: rgba(90,152,250,0.9);\'+\n' +
        '\'      color: #ffffff;\'+\n' +
        '\'      width: 100px;\'+\n' +
        '\'      height: 30px;\'+\n' +
        '\'      border: 0;\'+\n' +
        '\'      font-size: 16px;\'+\n' +
        '\'      box-sizing: content-box;\'+\n' +
        '\'      border-radius: 5px;\'" onmouseout="this.style.cssText=\'background-color: rgba(49,131,254,0.9);\'+\n' +
        '\'      color: #ffffff;\'+\n' +
        '\'      width: 100px;\'+\n' +
        '\'      height: 30px;\'+\n' +
        '\'      border: 0;\'+\n' +
        '\'      font-size: 16px;\'+\n' +
        '\'      box-sizing: content-box;\'+\n' +
        '\'      border-radius: 5px;\'" id="autoButton">开始评教\n' +
        '    </button>\n' +
        '</div>').appendTo('body');
var state=false;
var xyb;


function btnClick(){
    state=!state;
    if(state){
        document.getElementById("autoButton").innerHTML="取消";
        let table=document.getElementById("tempGrid");
        let tr=table.getElementsByClassName("ui-widget-content");
        let i=0;
        if(tr[0].tabIndex!=0){
            tr[0].click();
        }
        xyb=setInterval(()=>{
            if(i>=tr.length || !document.getElementById("btn_xspj_tj")){
                clearInterval(xyb);
                document.getElementById("autoButton").innerHTML="开始评教";
                state=false;
                alert("评教已完成!");
            }else{
                let groups=document.getElementsByClassName("form-group");
                for(let j=0;j<groups.length;++j){
                    let idx=j==0?1:0;//因为不能所有选项都一样，默认第一个选良好，剩下选优秀，可自定义，格式：(不要改 ? 设置第一个选项，必须数字 : 设置其余选项，必须数字)
                    $(groups[j].getElementsByClassName("radio-pjf")[idx]).prop("checked",true);
                }
                let llw=document.getElementById(i==tr.length-1?"btn_xspj_tj":"btn_xspj_bc");
                llw.dataset.enter = 1;
                llw.click();
                while(true){
                    if(!!document.getElementById('successModal')){
                        document.getElementById('btn_ok').click();
                        break;
                    }
                }
                tr[++i].click();
            }
        }, 3000);
    }else{
        clearInterval(xyb);
        document.getElementById("autoButton").innerHTML="开始评教";
    }
}

(function() {
    'use strict';
	$("#autoButton").click(function(){
        btnClick();
    });
})();