// ==UserScript==
// @name         供应链子平台流程调整高亮显示
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  10秒钟后需调整的流程高亮显示
// @author       肆散的尘埃i
// @match        https://oma.iccec.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iccec.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450936/%E4%BE%9B%E5%BA%94%E9%93%BE%E5%AD%90%E5%B9%B3%E5%8F%B0%E6%B5%81%E7%A8%8B%E8%B0%83%E6%95%B4%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450936/%E4%BE%9B%E5%BA%94%E9%93%BE%E5%AD%90%E5%B9%B3%E5%8F%B0%E6%B5%81%E7%A8%8B%E8%B0%83%E6%95%B4%E9%AB%98%E4%BA%AE%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    //var nameArr = ['物资合同录入审批','物资合同变更审批','运输合同录入审批','运输合同变更审批','设备采购合同录入审批','设备采购合同变更审批','租赁及其他合同录入审批','租赁及其他合同变更审批','结算录入审批','运输结算录入审批','设备采购结算录入审批','租赁及其他结算录入审批','财务正式入库审批','财务入库冲销审批','财务出库审批','财务出库冲销审批','财务移库审批','发票录入审批','付款申请审批']
    var strArr = ['S0101','S0102','S0105','S0106','S0109','S0110','S0121','S0122','S0301','S0303','S0305','S0309','S0402','S0403','S0407','S0408','S0409','S0411','S0501','S0601']

    // 创建一个悬浮的图片DOM
    const divimg = document.createElement('img')
    divimg.style = 'z-index: 9999; position: fixed ! important; left: 10px; bottom: 50px;'
    divimg.id = 'heightTextButton'
    divimg.src = 'data:image/png;base64,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'
    divimg.alt = '高亮显示需编辑的流程'
    divimg.onclick = ()=>{
        var content = document.getElementsByClassName("el-table__row")
        for (var i = 0; i < content.length; i++) {
            var rowStr = content[i].innerHTML
            for (var x = 0; x < strArr.length; x++) {
                var num = strArr[x]
                // 判断当前行，是否是目标行
                if(rowStr.indexOf(num) > 0){
                    document.getElementsByClassName("el-table__row")[i].style.backgroundColor="yellow"
                    break;
                }
            }
        }
        console.log("已高亮显示")
    }
    document.body.appendChild(divimg)

})();