// ==UserScript==
// @name         ERP组合装及商品库存【看】
// @namespace    https://www.erp321.com/
// @description  组合装及商品库存 显示 看 按钮
// @author       TC 技术部
// @version      1.0
// @match        *://*/app/item/CombineSku/combinesku.aspx*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_notification
// @run-at       document-start
// @license MIT
// @require      http://code.jquery.com/jquery-1.8.1.min.js
// @require      https://www.layuicdn.com/layer-v3.5.1/layer.js
// @resource layercss https://www.layuicdn.com/layer/theme/default/layer.css
// @downloadURL https://update.greasyfork.org/scripts/485706/ERP%E7%BB%84%E5%90%88%E8%A3%85%E5%8F%8A%E5%95%86%E5%93%81%E5%BA%93%E5%AD%98%E3%80%90%E7%9C%8B%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/485706/ERP%E7%BB%84%E5%90%88%E8%A3%85%E5%8F%8A%E5%95%86%E5%93%81%E5%BA%93%E5%AD%98%E3%80%90%E7%9C%8B%E3%80%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_notification({ text:'请等待页面加载完成后，再进行捋单操作！',timeout: 3000});
})();

//创建 元素监听
document.addEventListener('DOMNodeInserted', function() {
    var container_temp= document.querySelector("#_jt_row_foot")
    if(container_temp!=null)
    {
        commonAddEleLvButton();
    }
});

function commonAddEleLvButton(){
    var nodes=document.querySelector("#_jt_body_list").childNodes;
    for(var i=0;i<nodes.length;i++){
        var node4= nodes[i].childNodes[4];
        if(node4!=undefined&&node4!=null)
        {
            var myButton=node4.querySelector("[title='看看']");
            if(myButton==null){
                //添加按钮
                var myButtonHtml="<div id='kankan' class='h_btn p_bth simpleTool'  style='display:none; float:left;margin-left:-43px' title='看看'>看<div>";
                $(node4).append(myButtonHtml);
                $(node4).on("click", "#kankan", function() {
                    layer.open({
                        type: 2,
                        title:"商品信息",
                        shade: [0.5],
                        maxmin:true,
                        shadeClose:true,
                        area: ['75%', '500px'] ,
                        content: 'https://jishubu.139sl.cn/erp321/getUrl.php?http://222.222.100.222/sku/chaxun.php?m=skuid&skuid='+this.parentNode.firstChild.nodeValue
                    });
                })
            }
        }
    }

}
GM_addStyle(GM_getResourceText("layercss"));
GM_addStyle(`.layui-layer-ico{ background: url(https://www.layuicdn.com/layer/theme/default/icon.png) no-repeat;}`);
