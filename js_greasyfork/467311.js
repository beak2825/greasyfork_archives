// ==UserScript==
// @name         南信大学习通毛概题库爬取
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  对学习通做题记录的地方进行爬取，下载为txt
// @author       NuistFaker
// @license      MIT
// @match        https://mooc1.chaoxing.com/work/record-detail*
// @icon         https://th.bing.com/th/id/OIP.HLyIkA8nk3dmLUme_kV7XgAAAA?pid=ImgDet&rs=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467311/%E5%8D%97%E4%BF%A1%E5%A4%A7%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%AF%9B%E6%A6%82%E9%A2%98%E5%BA%93%E7%88%AC%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/467311/%E5%8D%97%E4%BF%A1%E5%A4%A7%E5%AD%A6%E4%B9%A0%E9%80%9A%E6%AF%9B%E6%A6%82%E9%A2%98%E5%BA%93%E7%88%AC%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /**
 /**
 * 实现思路
 * 1.把题按照，题目 选项 选项 。。。 正确答案的方式一行呈现。
 * # 注意有的时候会有前端错误，比如没有题目之类的，需要加入try catch
 */

    // 获取题目
    let questionList = document.querySelectorAll(".TiMu");
    let strBuffe = "";

    for (let i = 0; i < questionList.length; i++) {
        try{
            let q = questionList[i];
            // 获取题序号
            let index = q.querySelector("i").innerText;
            // 获取题目
            let title = q.querySelector(".Zy_TItle .clearfix").innerText;
            console.log('标题为',title);
            strBuffe += title + "\t";

            // 获取选项
            let choiceList = q.querySelectorAll(".Zy_ulTop .clearfix");
            choiceList.forEach((c) => {
                // 获取选项序号ABCD
                let choiceIndex = c.querySelector("i").innerText;
                // 获取选项内容
                let choiceText = c.querySelector("a").innerText;
                strBuffe += choiceText + "\t";
            });
            // 获取正确答案
            let truth = q.querySelector(".Py_answer span").innerText.match("[a-zA-Z]+")[0];
            strBuffe += truth + "\n";
            console.log(strBuffe);
        }catch(error){
            console.error(error)
        }

    }

    var element = document.createElement("a");
    element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(strBuffe)
    );
    element.setAttribute("download", "result.txt");
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
    console.log(strBuffe);
    // Your code here...
})();