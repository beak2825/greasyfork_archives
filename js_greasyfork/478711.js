// ==UserScript==
// @name         zwsafe
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为公司工作做的脚本!
// @author       ShuYRx
// @match        http://zwsafe.col.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478711/zwsafe.user.js
// @updateURL https://update.greasyfork.org/scripts/478711/zwsafe.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var searchpass = "通过" ,searchfushen = "章节质检" ,searchxinshu = "章节内容审核";
    var url = document.URL;
    var string = url.substring(url.lastIndexOf("/")+1);
    //键盘监听,shift+x()组合键可以批量点击章节质检和章节内容审核,还可以在审核界面通过当前章节,下面有详细说明
    document.onkeydown = function(e){
        //shift+x 组合键触发以下条件
        if( e.shiftKey && e.keyCode == 88){
            //判断当前网址最后字符串是否为新书和复审界面
            if(string == "preliminaryReview" || string == "chapterRecheck"){
                //三方作品审核一次点击当前界面的所有上述按钮,建议当前页面有10-30条数据
                let count=1;
                const spanLabels = document.querySelectorAll(".el-button");
                for (let i = 0; i<spanLabels.length; i++) {
                    const label = spanLabels[i];
                    if (label.innerText === searchxinshu || label.innerText === searchfushen) {
                            label.click();
                        //count++;
                        //setTimeout(timeload,200*count,label);
                    }
                }
            }else if(string == ""){
                //
            }else if(!isNaN(parseInt(string))){//判断为审核界面方法
                //复审通过且1000ms关闭当前界面
                if (parseInt(string) == 1) {
                    let passbtn = document.querySelector("#app > div > div.main-container > section > div > div.chaBox > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(1) > div.el-card__body > div > div > button.el-button.el-button--primary.el-button--medium")
                    passbtn.click();
                    setTimeout(waittimeout,1000);
                }else {
                    //通过操作
                    let passbutton = document.querySelector(".el-button:nth-child(3)");
                    passbutton.click();
                }
            }
        }
    }
    function waittimeout(){
        window.close();
    }
    function timeload(label){
        label.onkeydown
        label.click();
    }
})();