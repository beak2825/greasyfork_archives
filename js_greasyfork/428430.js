// ==UserScript==
// @name         工大卷人学分积查询
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  重振卷人荣光，吾辈义不容辞。
// @author       Winter
// @match        *us.nwpu.edu.cn/eams/teach/grade/course/person!*
// @icon         https://www.google.com/s2/favicons?domain=zhangshengrong.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428430/%E5%B7%A5%E5%A4%A7%E5%8D%B7%E4%BA%BA%E5%AD%A6%E5%88%86%E7%A7%AF%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/428430/%E5%B7%A5%E5%A4%A7%E5%8D%B7%E4%BA%BA%E5%AD%A6%E5%88%86%E7%A7%AF%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==


var setting={
    defaultScore:60, //默认P为60分
    checkAll:false //默认选择非素养课，置true则全部选择，也可以自己一个一个打勾
}
var credit_id;
var grade_id;
var type_id;

function makeId()
{
    var div=document.getElementsByClassName("grid");
    var thead=div[0].getElementsByTagName("thead")[0];
    var tr_list=thead.getElementsByTagName("tr")[0];
    tr_list=tr_list.getElementsByTagName("th");
    for(let i=0;i<tr_list.length;i+=1)
    {
        if(tr_list[i].innerText=="学分")
            credit_id=i;
        if(tr_list[i].innerText=="最终")
            grade_id=i;
        if(tr_list[i].innerText=="课程类别")
            type_id=i;
    }
}

function getTr()
{
    var div=document.getElementsByClassName("grid");
    var tbody=div[0].getElementsByTagName("tbody");
    return tbody[0].getElementsByTagName("tr");
}

function makeCheckBox(i,isCheck)
{
    let check=document.createElement("input");
    check.setAttribute("type","checkbox");
    if(isCheck==true)
        check.setAttribute("checked","checked");
    i.appendChild(check);
    return check;
}

function getCredit()
{
    var tr=getTr();
    var sum_mul=0;
    var sum_credit=0;
    for(let i=0;i<tr.length;i+=1)
    {
        let td_list=tr[i].getElementsByTagName("td");
        let num=td_list[grade_id].innerText;
        let credit=td_list[credit_id].innerText;
        let check=tr[i].getElementsByTagName("input")[0];
        if(check&&check.checked)
        {
            if(num=="P")
            {
                num=setting.defaultScore;
            }
            else if(num=="NP")
            {
                num=0;
            }
            else
                num=num.match("[0-9]+");
            sum_mul+=num*credit;
            sum_credit+=credit*1;
        }
    }
    let result=sum_mul/sum_credit;
    alert("学分积为:  "+result);
}

function makeCheck()
{
    var tr=getTr();
    for(let i=0;i<tr.length;i+=1)
    {
        let td_list=tr[i].getElementsByTagName("td");
        let num=td_list[grade_id].innerText;
        let type=td_list[type_id].innerText;
        if(!setting.checkAll&&(num=="P"||num=="NP"))
            continue;
        if(type.match("素养")&&!setting.checkAll)
            var check=makeCheckBox(tr[i],false);
        else
            check=makeCheckBox(tr[i],true);
    }
}
function prependChild(parent,newChild)
{
    if(parent.firstChild){
    parent.insertBefore(newChild,parent.firstChild);
    } else {
    parent.appendChild(newChild);
    }
    return parent;
}

function makebutton()
{
    let button=document.createElement("button");
    button.innerHTML="查询";
    button.onclick=function(){
        getCredit();
    };
    var div=document.getElementsByClassName("grid");
    prependChild(div[0],button);
}

(function() {
    'use strict';
    setTimeout(function (){
        makeId();
        makeCheck();
        makebutton();
    },500);
})();