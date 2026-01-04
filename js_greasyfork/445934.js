// ==UserScript==
// @name         WHU一键评教脚本
// @version      0.3
// @description  学生评教，一键搞定
// @author       Isaac
// @match        https://ugsqs.whu.edu.cn/new/student/rank/evaluate2.jsp?*
// @icon         https://www.whu.edu.cn/favicon.ico
// @grant        none
// @namespace https://greasyfork.org/users/739980
// @downloadURL https://update.greasyfork.org/scripts/445934/WHU%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/445934/WHU%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setInterval(addButton,100);

})();

function addButton(){
    if(document.querySelector("#evaluateDlg > div.modal-header > h3:nth-child(3)")!=null){
        if(document.querySelector("#one_click_5")==undefined){
            let a = document.createElement("button");
            a.innerText = "一键好评";
            a.id = "one_click_5";
            a.addEventListener("click",function(){beginEvaluation(5);});
            document.querySelector("#evaluateDlg > div.modal-header > h3:nth-child(3)").appendChild(a);
        }
        if(document.querySelector("#one_click_4")==undefined){
            let a = document.createElement("button");
            a.innerText = "一键四星";
            a.id = "one_click_4";
            a.addEventListener("click",function(){beginEvaluation(4);});
            document.querySelector("#evaluateDlg > div.modal-header > h3:nth-child(3)").appendChild(a);
        }
        if(document.querySelector("#one_click_3")==undefined){
            let a = document.createElement("button");
            a.innerText = "一键三星";
            a.id = "one_click_3";
            a.addEventListener("click",function(){beginEvaluation(3);});
            document.querySelector("#evaluateDlg > div.modal-header > h3:nth-child(3)").appendChild(a);
        }
        if(document.querySelector("#one_click_2")==undefined){
            let a = document.createElement("button");
            a.innerText = "一键两星";
            a.id = "one_click_2";
            a.addEventListener("click",function(){beginEvaluation(2);});
            document.querySelector("#evaluateDlg > div.modal-header > h3:nth-child(3)").appendChild(a);
        }
        if(document.querySelector("#one_click_1")==undefined){
            let a = document.createElement("button");
            a.innerText = "一键一星";
            a.id = "one_click_1";
            a.addEventListener("click",function(){beginEvaluation(1);});
            document.querySelector("#evaluateDlg > div.modal-header > h3:nth-child(3)").appendChild(a);
        }
    }
}

function beginEvaluation(mark){
    document.querySelectorAll(".dxt").forEach(function(node,index,arr){
        let a=node.querySelectorAll("label.radio");
        if(a.length==0)return;
        a = a[5-mark];
        if(a!=null)if(index==arr.length-1&&mark==5)a.nextElementSibling.click();else a.click();

    })
    document.querySelectorAll("textArea").forEach(function(node){
        if(node.disabled==true)return;
        else switch(mark){
            case 5:
                node.value="好";
                break;
            case 4:
                node.value="还行";
                break;
            case 3:
                node.value="一般";
                break;
            case 2:
                node.value="不行";
                break;
            case 1:
                node.value="就这？";
                break;
            default:
                node.value="...";
                break;
        }
    })
}