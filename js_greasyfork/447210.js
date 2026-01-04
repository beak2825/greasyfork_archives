// ==UserScript==
// @name         审单
// @namespace    jialiang_z
// @version      1.0.4
// @description  建议使用
// @author       jialiang_z
// @match        http://10.253.58.44:8300/cas/sys/login?*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447210/%E5%AE%A1%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447210/%E5%AE%A1%E5%8D%95.meta.js
// ==/UserScript==
function func1(){
    // 获取审单对应的iframe
    var aaa = document.getElementsByTagName('iframe')
    var my_i = -1
    for(var i = 0; i<aaa.length;i++){
        var id1 = $(aaa[i]).attr('id')
        if(id1!=undefined && id1.indexOf('layui-layer-iframe')>=0){
            my_i = i
        }
    }
    if(my_i<0){
        console.log('非目标单号')
        return ;
    }
    var aa = aaa[my_i]

    // 获取对应iframe的document和window
    var aad = aa.contentDocument
    var aaw = aa.contentWindow

    //// 开始审单
    // 筛选出所有的通过选项，并进行单击
    var arr = aad.getElementsByTagName('span')
    for(var j=0;j<arr.length;j++){
        var tt = arr[j].innerText;
        if(tt=='通过'){arr[j].click()}
    }
    // 选中审核人
    $(aad).find('dd[lay-value=liangqianda]').click()
    // 接单（需要改进）
    if($(aad).find('#detailBtnDiv button.larry-btn-color-green').text()=='接单'){
        aaw.submitTask(6,'接单')
        $(aad).find('.layui-layer-btn0')[0].click()
    }

    // 审完单将页面调到最底下

    var c = aad.body.scrollHeight
    aaw.scroll(0,c)
}
(function() {
    'use strict';
    var nodetext = "\
    <div style='position: fixed;top: 250px;right: 20px;z-index: 999999999999;padding-right: 25px;' id='my_button'>\
        <button onclick='func1();' class='layui-btn' style='background-color: darkseagreen;font-size: 18px;font-weight: 600;'>审单</button>\
    </div>"
    $('body').append(nodetext)
    $('#my_button').click(function(){func1()})
})();