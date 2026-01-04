// ==UserScript==
// @name         北京理工大学评教脚本
// @namespace    ymyx-lexiaoyao
// @version      2.0
// @description  北理工一键评教
// @author       亦梦亦醒乐逍遥
// @match        https://greasyfork.org/zh-CN/script_versions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446772/%E5%8C%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/446772/%E5%8C%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


document.addEventListener('keydown',(e)=>{
  if(e.shiftKey&&e.keyCode===80){
    var groups=document.getElementsByClassName("control-group");
    //逐个问题修改
    for(var i=0;i<groups.length-1;i++)
    {
      var first_input=groups[i].getElementsByClassName("controls")[0].getElementsByTagName("input")[0];
      first_input.checked="checked";
    }
    //最后一个填空
    var text=groups[i].getElementsByClassName("controls")[0].getElementsByTagName("textarea")[0];
    text.value="好";
    //提交
    document.getElementsByClassName("row-fluid wizard-actions")[0].getElementsByTagName("a")[0].click();
  }
})
