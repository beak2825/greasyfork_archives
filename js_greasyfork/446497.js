// ==UserScript==
// @name         聚水潭ERP订单页列表加按钮【捋】old
// @namespace    https://www.erp321.com/
// @version      1.0.2022061619
// @description  聚水潭ERP（www.erp321.com）订单页列表加按钮【捋】
// @author       TC 技术部 Kind
// @include      /^https://w{2,3}.erp321.com/app/order/order/list.aspx
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAA3NCSVQICAjb4U/gAAAAYFBMVEX/////AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/////8PD/4OD/zMz/wMD/sLD/oKD/kJD/gID/cHD/YGD/UFD/QED/MzP/ICD/EBD/AAClqYFLAAAAIHRSTlMAESIzRFVmd4iZqrvM3e7//////////////////////2FF4MAAAAAJcEhZcwAAJRwAACUcAdsFGykAAAAfdEVYdFNvZnR3YXJlAE1hY3JvbWVkaWEgRmlyZXdvcmtzIDi1aNJ4AAAC3UlEQVRYhbWX2barIAyGW3et7g5b6gAoRd7/LQ+TEiZrl+vkorWVfJKfGMLp9L/sXNa/96eQ9rz/1uX5O++ifojAHnWx2/0aeVvGdZ/7M+2uo/mMuGSevs7isu1fb7srqzfciw+Pt5PIqvnzt8dfiL+fjHo7/SUhqeV1r7uyBMHNnxJC8q5zJorCzb+RlnFmuEWWECoJ9E8C3hPpW3WnsbN7+P5w/eWg1j2TTQR3rwYYN7e8fLgIH9Cp77GJresG8rbjLukAhEAWMAPHV4cJY35UIAh/BTsLEL1y7All3MnIwUC3ls80gM+RlqTp6Mp4ZlJoBTibx3G917hJXFMKBAC+xGJAjQe3KhTL795XnImZvrTjIH9p7Sd5MYJnmWyqwKN9wKQ/5TTkN7WPQFCYyo8gAqgVHdSd1uSWimCA0eoYzuvP9ww14GbuSP1Fpees1sCGspqq9qUIDIgIY5jEjKL1KaEECYBKa6z/w5PJ7dEfq0S4bQGkar27M084GHuTgPsWYMQwZsZYkJx3CYgqoQHwuCoxqwiwPwmIxikAHxJFJQEQGQBSefBmganFpPqKbwG4qVzN0CYKijWSB0zmhUADDxMzCwAiTgMyA1ol9tAFpqbU6isKRXTLaItgnG95Ee9+Isnii8icKChZwM1PZdrgOSgo0+CuE4DKf5m4TjsIoNAnASi919kaBLxhBUgAzomS6IfQmkqQATz8kpYCUPAKx4DKL6opgColywsdA4rPZV0t7RJDBFg2t82NBTcvnAOse1tmazMxTOtlCFi3ttzmGloIAI2Sp0KbA4w+APYoa4MhOxI1LAKoxgsjH+A1vUuLY3sZGgKWbgW5v4KW1waBzbC4MbCFwm0LQZO1tHlMFzMe+esNGvUugKjNWxpN2QrF3opMGNwhUu3y0Vb3eLN9vN0/fuA4HT7ynI4fuk6Hj30acezgqayo4qNvtf/oq+1cVu7wXX17+P7C/gFLv0ORo3TdQAAAAABJRU5ErkJggg==
// @grant        unsafeWindow
// @grant        GM_notification
// @run-at       document-end
// @require      http://code.jquery.com/jquery-1.8.1.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446497/%E8%81%9A%E6%B0%B4%E6%BD%ADERP%E8%AE%A2%E5%8D%95%E9%A1%B5%E5%88%97%E8%A1%A8%E5%8A%A0%E6%8C%89%E9%92%AE%E3%80%90%E6%8D%8B%E3%80%91old.user.js
// @updateURL https://update.greasyfork.org/scripts/446497/%E8%81%9A%E6%B0%B4%E6%BD%ADERP%E8%AE%A2%E5%8D%95%E9%A1%B5%E5%88%97%E8%A1%A8%E5%8A%A0%E6%8C%89%E9%92%AE%E3%80%90%E6%8D%8B%E3%80%91old.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_notification({ text:'请等待页面加载完成后，再进行捋单操作！'});
})();


var ERP_ID;
window.onload = function(){
    var dataTxt=document.querySelector('#_jt_data').innerText;
    var sub1Txt=dataTxt.substring(dataTxt.indexOf('co_id'));
    ERP_ID=sub1Txt.substring(sub1Txt.indexOf(':')+1,sub1Txt.indexOf(',')).trim();
    var nodes=document.querySelector('#_jt_body_list > div.rowsBox > div.rowsSite > div.rowList').childNodes;
     for(var i=0;i<nodes.length;i++){
            //获取内部订单号和线上订单号
		    var innerOrder=nodes[i].querySelector("div:nth-child(3) > div.o_id").innerText;
		    var onlineOrder=nodes[i].querySelector("div:nth-child(6)").innerText;
            var node3=nodes[i].querySelector("div:nth-child(3)");
            //为每条订单 添加一个 捋单按钮
		    var lvdanButton3=node3.querySelector("[title='捋单']");
            if(lvdanButton3==null){
               var url="http://222.222.104.222/erp321/custom_seal.php?erp_id="+ERP_ID+"&o_id="+innerOrder+"&so_id="+onlineOrder;
			   var lvdanButtonHtml3='<a class="h_btn p_bth h_btn_lvdan" title="捋单" style="left:77px;display:none; text-decoration:none;" href='+url+' target="_blank">捋</a>';
			   //添加按钮
     		   $(node3).append(lvdanButtonHtml3);
            }
        }
}

document.getElementById('_jt_body').addEventListener("scroll",function(){
     var nodes=document.querySelector('#_jt_body_list > div.rowsBox > div.rowsSite > div.rowList').childNodes;
     for(var i=0;i<nodes.length;i++){
            //获取内部订单号和线上订单号
		    var innerOrder=nodes[i].querySelector("div:nth-child(3) > div.o_id").innerText;
		    var onlineOrder=nodes[i].querySelector("div:nth-child(6)").innerText;
            var node3=nodes[i].querySelector("div:nth-child(3)");
            //为每条订单 添加一个 捋单按钮
		    var lvdanButton3=node3.querySelector("[title='捋单']");
            if(lvdanButton3==null){
               var url="http://222.222.104.222/erp321/custom_seal.php?erp_id="+ERP_ID+"&o_id="+innerOrder+"&so_id="+onlineOrder;
			   var lvdanButtonHtml3='<a class="h_btn p_bth h_btn_lvdan" title="捋单" style="left:77px;display:none; text-decoration:none;" href='+url+' target="_blank">捋</a>';
			   //添加按钮
     		   $(node3).append(lvdanButtonHtml3);
            }
      }
});
