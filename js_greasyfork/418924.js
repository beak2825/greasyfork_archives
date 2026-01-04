// ==UserScript==
// @name         去死吧！评教GCU
// @namespace    https://tampermonkey.net/
// @version      1.01
// @description  自动评教解放双手
// @author       zhengen
// @match        *://jwxt.gcu.edu.cn/*
// @grant        none
// @homepage     https://greasyfork.org/zh-CN/scripts/418924-%E5%8E%BB%E6%AD%BB%E5%90%A7-%E8%AF%84%E6%95%99gcu
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/418924/%E5%8E%BB%E6%AD%BB%E5%90%A7%EF%BC%81%E8%AF%84%E6%95%99GCU.user.js
// @updateURL https://update.greasyfork.org/scripts/418924/%E5%8E%BB%E6%AD%BB%E5%90%A7%EF%BC%81%E8%AF%84%E6%95%99GCU.meta.js
// ==/UserScript==
document.addEventListener ("DOMContentLoaded", jq); // 渲染完成载入jq
window.addEventListener ("load", load_end); // 全部加载完成后执行
window.alert=() => {}; // 去除弹窗

function jq(){
    var importJs=document.createElement('script')
    importJs.setAttribute("type","text/javascript")
    importJs.setAttribute("src", 'https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js')
    document.getElementsByTagName("head")[0].appendChild(importJs)
}

function load_end () {
    if($('#DataGrid1__ctl12_JS1').length > 0){
        $('#DataGrid1__ctl2_JS1').val('4(良好)');
        for (let index = 1; index < 20; index++) {
            let temp_id = 'DataGrid1__ctl' + (index + 2) + '_JS1';
            $("#" + temp_id).val('5(优秀)');
        }
        if($('#Button2').attr('disabled') == undefined){
            $('#Button2').click();
        } else{
            $('#Button1').click();
        }
    }
};