// ==UserScript==
// @name         UPC数字石大教务系统[计算学分绩]
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  计算学分绩
// @author       欢迎使用中石大在线学分绩计算器 by BigZhi    "
// @match        http://jwxt.upc.edu.cn/*
// @include      http://jwxt.upc.edu.cn/*
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437928/UPC%E6%95%B0%E5%AD%97%E7%9F%B3%E5%A4%A7%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%5B%E8%AE%A1%E7%AE%97%E5%AD%A6%E5%88%86%E7%BB%A9%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/437928/UPC%E6%95%B0%E5%AD%97%E7%9F%B3%E5%A4%A7%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%5B%E8%AE%A1%E7%AE%97%E5%AD%A6%E5%88%86%E7%BB%A9%5D.meta.js
// ==/UserScript==

(function() {
    var cjb=document.getElementById("dataList")
    console.log(cjb)
    var rows=cjb.getElementsByTagName("tr").length;
    if(rows<40)
        window.location.href = "http://jwxt.upc.edu.cn/jsxsd/kscj/cjcx_list"
    var l=rows-1;
    var cj=new Array(l);
    var xf=new Array(l);
    var bx=new Array(l);
    var n,item,i=2
    var cj_t=document.querySelector("#dataList > tbody > tr:nth-child("+i.toPrecision()+" )> td:nth-child(5) > a")
    var xf_t=document.querySelector("#dataList > tbody > tr:nth-child("+i.toPrecision()+" )> td:nth-child(6) ")
    var bx_t=document.querySelector("#dataList > tbody > tr:nth-child("+i.toPrecision()+" )> td:nth-child(10) ")

    for(i=1;i<rows;++i)
    {
        n=i+1
        item=cjb.getElementsByTagName("tr")[i];
        cj[i]=Number(document.querySelector("#dataList > tbody > tr:nth-child("+n.toPrecision()+" )> td:nth-child(5) > a").innerHTML)
        xf[i]=Number(document.querySelector("#dataList > tbody > tr:nth-child("+n.toPrecision()+" )> td:nth-child(6) ").innerHTML)
        bx[i]=document.querySelector("#dataList > tbody > tr:nth-child("+n.toPrecision()+" )> td:nth-child(10) ").innerHTML
        console.log(cj[i],xf[i],bx[i])
    }
    var bx_sum_cj=0,bx_sum_xf=0,xx_sum_cj=0,xx_sum_xf=0
    for(i=1;i<rows;++i)
    {
        if(bx[i]!="任选")
        {
            bx_sum_cj=cj[i]*xf[i]+bx_sum_cj
            bx_sum_xf=bx_sum_xf+xf[i]
        }
        else{
            xx_sum_cj=cj[i]*xf[i]+xx_sum_cj
            xx_sum_xf=xx_sum_xf+xf[i]
        }
    }
    console.log(Number(bx_sum_cj)/bx_sum_xf)
    console.log(rows-1)

    var bx_xfj=bx_sum_cj/bx_sum_xf
    var bx_xf=bx_sum_xf.toPrecision()
    bx_xfj=bx_xfj.toFixed(3)
    var xx_xfj=((xx_sum_cj/xx_sum_xf))
    xx_xfj=xx_xfj.toFixed(3)
    var xx_xf=(xx_sum_xf).toPrecision()
    console.log(xx_xfj)
    console.log(bx_xfj)
    var mydiv = document.createElement("div")
    mydiv.id = "gpadiv"
    mydiv.style.zIndex = "100"
    mydiv.style.position = "absolute"
    mydiv.style.left = "940px"
    mydiv.style.top = "120px"
    mydiv.style.width = "360px"
    mydiv.style.height = "100px"
    mydiv.style.border = "5px solid"
    mydiv.style.overflow = "auto"
    mydiv.style.backgroundColor = "#F7F4EC"
    mydiv.style.color="#000000"
    mydiv.style.fontSize="16px"
    mydiv.style.lineHeight="24px"
    document.body.appendChild(mydiv)
    var writestr=""
    writestr+="<div style=\"clear:both; text-align:center\">"
    writestr+="欢迎使用中石大在线学分绩计算器 by 麻瓜一号    "
    writestr+="<\/div>"
    writestr+="<div style=\"clear:both;\">";
    writestr+="<div id = 'content'>"
    writestr+="<div style=\"clear:both; text-align:left;  font-size:14px\">"
    writestr+="<\/div>"
    writestr+="<div style=\"clear:both;\">";
    writestr+="<div style=\"float:left; width:80px; text-align:center\">必修学分绩： "+bx_xfj+"<\/div>";
    writestr+="<div style=\"float:left; width:80px; text-align:center\">必修学分："+bx_xf+"<\/div>";
    writestr+="<div style=\"float:left; width:80px; text-align:center\">选修学分绩： "+xx_xfj+"<\/div>";
    writestr+="<div style=\"float:left; width:80px; text-align:center\">选修学分：    "+xx_xf+"<\/div>";

//     writestr+="<div style=\"float:left; width:50px; text-align:center\">"+"<input id=\"cb"+n+"\" type=\"checkbox\" checked />"+"<\/div>";
    writestr+="<\/div>";
    mydiv.innerHTML=writestr;


})();