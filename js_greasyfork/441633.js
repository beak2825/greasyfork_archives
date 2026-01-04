// ==UserScript==
// @name         猫粮一键换上传
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  一键换10G上传
// @author       ootruieo
// @license      GNU GPLv3
// @match        https://pterclub.com/mybonus.php
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/441633/%E7%8C%AB%E7%B2%AE%E4%B8%80%E9%94%AE%E6%8D%A2%E4%B8%8A%E4%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/441633/%E7%8C%AB%E7%B2%AE%E4%B8%80%E9%94%AE%E6%8D%A2%E4%B8%8A%E4%BC%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time)).catch((e)=>{console.log(e);});
    }

    const Exchange10GUpload = async function(){
        var msg ="";
        var endCount = parseInt(document.getElementById('txtEndCount').value);
        if(isNaN(endCount)){
            endCount = 1000000;
            msg = "确定要将魔力兑换上传吗？\n注意：兑换到猫粮耗尽为止！";
        }else{
            msg = `确定要将魔力兑换上传吗？\n注意：兑换[${endCount}]次！`;
        }
        if (confirm(msg) == true){
            var btnExchange10GUpload = document.getElementById ("Exchange10GUpload");
            btnExchange10GUpload.setAttribute("disabled","1");
            btnExchange10GUpload.setAttribute("value","兑换中...");
            var sucess = 0;
            var regBonus = /使用<\/a>]:([\s\S]*?)</i
            while(true){
                var response = await new Promise((resolve, reject) => {
                    GM.xmlHttpRequest({
                        method: "POST",
                        url: "https://pterclub.com/mybonus.php?action=exchange",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
                        },
                        data: "option=3&submit=交换",
                        onload: function(response) {
                            resolve(response.responseText);
                        }
                    });
                });
                sucess += 1;
                var m = response.match(regBonus);
                var bonus = parseFloat(m[1].replaceAll(',',''));
                if(isNaN(bonus) || bonus < 3200 || sucess >= endCount){
                    break;
                }
                btnExchange10GUpload.setAttribute("value",`兑换中...${sucess}`);
            }
            alert(`你已成功兑换了${sucess}次10G上传!`);
            btnExchange10GUpload.removeAttribute("disabled");
            btnExchange10GUpload.setAttribute("value","我没猫粮了");
        }
    }

    var x = document.querySelectorAll('table>tbody>tr.bg-striped');
    for (var i = 0; i < x.length; i++) {
        if(x[i].innerText.indexOf('10.0 GB上传量') != -1){
            x[i].childNodes[7].appendChild(document.createElement("br"));
            var btnExchange10GUpload=document.createElement("input");
            btnExchange10GUpload.setAttribute("type","submit");
            btnExchange10GUpload.setAttribute("value","我没猫粮了");
            btnExchange10GUpload.setAttribute("id",'Exchange10GUpload');
            btnExchange10GUpload.onclick = Exchange10GUpload;
            x[i].childNodes[7].appendChild(btnExchange10GUpload);

            var txtEndCount = document.createElement("input");
            txtEndCount.setAttribute("type","text");
            txtEndCount.setAttribute("id", "txtEndCount");
            txtEndCount.setAttribute("style", 'border:0.5px solid #123456;margin-left:2px;width:25px;text-align:center;');
            x[i].childNodes[7].appendChild(txtEndCount);
            break;
        }
    }
})();