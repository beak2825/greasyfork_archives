// ==UserScript==
// @name         ERP订单页列表加按钮【捋】
// @namespace    https://www.erp321.com/
// @description  聚水潭ERP（www.erp321.com）订单页列表加按钮【捋】，点击连接到指定地址
// @author       TC 技术部
// @version      1.1.202312261643
// @include      /^https://w{1,3}.erp321.com/app/order/order/list.aspx
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAgMAAAC+UIlYAAAAA3NCSVQICAjb4U/gAAAADFBMVEUAm+////+M5vMnv+xZ0kQzAAAACXBIWXMAAAsSAAALEgHS3X78AAAAFnRFWHRDcmVhdGlvbiBUaW1lADA2LzE4LzIyWeHQqwAAAB90RVh0U29mdHdhcmUATWFjcm9tZWRpYSBGaXJld29ya3MgOLVo0ngAAAH8SURBVFiF7dbLbYNAEADQwRYHDo5PlEAJHJITJfhgPrIciQIshXRAEzThUzoIKYISck8HDhhYdj67G+cQJVLmZvaJndnPYEgdAT8P8tABitgByo0DJCsHaOkD8jsH6KygAIitoAQIrCABWFlBCwA2kPXjJEsMigFEFrAbQGAB1QA8C6gHsLYAuEZjBPsRhEZwHEFsBOUIAiNIRuAZQT2CtRHAFCaQzaAzgHwGoQHsZxB9FxQziH8x+HqZoQE4V9K5F87ddJ+HynWinGeycJ3qjBdx69UrWQoE5GwG2oJOAKTV0r75emnsgMU/+Ad/Fxw+YNtYQNb2d+rOAkp+8RHIhOaDwElooQhM7YveXAVUC+VVj092CrA5RpAoEMigVYD+EZsALNGooUcZxAo8y2Ap9E0GajELT0xyKbQygWlLs3ZjAFMjPYEOaqCv6M9HYALw0I+/AAIJArC9DHP6GqhAiPgWUEog0sBOAqEGjhLoNLCXQKqBXBhf6yATwEoHqQA8BGoOAgQSDnwESg4iBISF6BAQFiJFgNe5wgAfuiE2BLAyfAJYGREBBQUNATRLdcFUS6nlHBdAkogZIEk0DOAklkaztDV09H0BoP3qBJCJM+jfC22OWATL0dZ7ut571SvuDSBvWQbkm/U0TvBuBFeBx+lX73A+N6kN8HCCTxLiHylkIKGXAAAAAElFTkSuQmCC
// @grant        unsafeWindow
// @grant        GM_notification
// @run-at       document-end
// @require      http://code.jquery.com/jquery-1.8.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446640/ERP%E8%AE%A2%E5%8D%95%E9%A1%B5%E5%88%97%E8%A1%A8%E5%8A%A0%E6%8C%89%E9%92%AE%E3%80%90%E6%8D%8B%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/446640/ERP%E8%AE%A2%E5%8D%95%E9%A1%B5%E5%88%97%E8%A1%A8%E5%8A%A0%E6%8C%89%E9%92%AE%E3%80%90%E6%8D%8B%E3%80%91.meta.js
// ==/UserScript==
/*******************更新记录begin*******************
 【2022.8.17】 小更新 解决了无法获取ERP_ID
 【2023.4.20】 小更新 解决了综合查询后"捋"按钮不能正常显示的问题
 ********************更新记录end********************/
(function() {
    'use strict';
    GM_notification({ text:'请等待页面加载完成后，再进行捋单操作！'});
})();


var ERP_ID;
window.onload = function(){
    var dataTxt=document.querySelector('#_jt_data').innerText;
    var json_data=JSON.parse(dataTxt);
    if(json_data.datas.length>0)
    {
        ERP_ID=json_data.datas[0].co_id;
    }
}
//20230420 取消使用
document.getElementById('_jt_body').addEventListener("scroll",function(){
    //commonAddEleLvButton();
});

//创建 元素监听
document.getElementById('_jt_body').addEventListener("DOMNodeInserted",function(){
    var container_temp=document.querySelector("div._jt_cell._jt_ch._jt_cell_o_id> div.o_id");
    if(container_temp!=null)
    {
        commonAddEleLvButton();
    }
});

function commonAddEleLvButton(){
    var nodes=document.querySelector('#_jt_body_list > div.rowsBox > div.rowsSite > div.rowList').childNodes;
    for(var i=0;i<nodes.length;i++){
        //获取内部订单号和线上订单号
        if(nodes[i].querySelector("div:nth-child(3) > div.o_id")!=null)
        {
            var innerOrder=nodes[i].querySelector("div:nth-child(3) > div.o_id").innerText;
            if(nodes[i].querySelector("div:nth-child(6)")!=null)
            {
                var onlineOrder=nodes[i].querySelector("div:nth-child(6)").innerText;
                var node3=nodes[i].querySelector("div:nth-child(3)");
                //为每条订单 添加一个 捋单按钮
                var lvdanButton3=node3.querySelector("[title='捋单']");
                if(lvdanButton3==null){
                    if(ERP_ID==null)
                    {
                        var dataTxt=document.querySelector('#_jt_data').innerText;
                        var json_data=JSON.parse(dataTxt);
                        if(json_data.datas.length>0)
                        {
                            ERP_ID=json_data.datas[0].co_id;
                        }
                    }
                    var url="http://222.222.104.222/erp321/custom_seal.php?erp_id="+ERP_ID+"&o_id="+innerOrder+"&so_id="+onlineOrder;
                    var lvdanButtonHtml3='<style>.h_btn_lvdan {background-color: #ef44ca;}</style>';//加CSS改变颜色
						lvdanButtonHtml3='<a class="h_btn p_bth h_btn_lvdan" title="捋单" style="left:77px;display:none; text-decoration:none;" href='+url+' target="_blank">捋</a>';

                    //添加按钮
                    $(node3).append(lvdanButtonHtml3);
                }
            }
        }
    }
}

