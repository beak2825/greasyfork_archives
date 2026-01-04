// ==UserScript==
// @name         教务系统绩点计算
// @namespace    http://jsu.edu.cn
// @version      0.2
// @description  吉首大学教务系统绩点计算
// @author       WenjiaChen
// @license      GPL 3.0
// @match        https://jwxt.jsu.edu.cn/jsxsd/kscj/cjcx_list
// @match        https://webvpn.jsu.edu.cn/https/77726476706e69737468656265737421fae05988693a7b45300d8db9d6562d/jsxsd/kscj/cjcx_list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530238/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/530238/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%BB%A9%E7%82%B9%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==


function decodePoint(grade){
    if(grade === "优")
        return 4.5;
    if(grade === "良")
        return 3.5;
    if(grade === "中")
        return 2.5;
    return Number.parseFloat(grade);
}

function decodeScore(grade){
    if(grade === "优")
        return 95;
    if(grade === "良")
        return 85;
    if(grade === "中")
        return 75;
    return Number.parseFloat(grade);
}
function gets(){

    let grade1 = document.querySelectorAll("#dataList > tbody > tr > td:nth-child(5)") // 成绩

    var score = document.querySelectorAll("#dataList > tbody > tr > td:nth-child(6)") //学分

    var point = document.querySelectorAll("#dataList > tbody > tr > td:nth-child(8)")// 绩点

    var types = document.querySelectorAll("#dataList > tbody > tr > td:nth-child(11)")// 类别

    var lengths = grade1.length

    let lst = []

    for(let i = 0 ; i < lengths;i++){
        if(types[i].innerText !="通识选修课"){
            lst.push(
                [
                    decodePoint(point[i].innerText),Number.parseFloat(score[i].innerText)
                ]
            )
        }
    }
    console.log(lst)
    let cnt = 0
    let res = 0
    let zz = 0
    for(let i = 0 ; i < lst.length;i++){
        console.log(lst[i])
        zz += 1
        cnt += lst[i][1] * lst[i][0]
        res += lst[i][1]
    }

    return cnt / res
}

(function() {
    'use strict';

    // Your code here...
    // 在 #btn_back 后面添加一个按钮，class位button，内容为“点我”
    // 点击后，弹出“你点了我一下”
    let btn_back = document.getElementById("btn_back")

    let title = document.createElement("h1")
    // 将title颜色改为红色，大小改为30px
    title.style.color = "red"
    title.style.fontSize = "30px"
    btn_back.after(title)
    let btn = document.createElement("button")
    btn.className = "button"
    btn.innerText = "计算"
    btn.onclick = function(){
        title.innerText = "绩点：" + gets().toFixed(4) + " ; 如果和电子凭证差异较大，请去教务办核实"
    }
    btn_back.after(btn)

})();