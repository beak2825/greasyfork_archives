// ==UserScript==
// @name         百川任务平台抢题
// @namespace    http://www.baichuanweb.com/produce/index
// @version      1.1
// @description  用于百度百川任务平台的抢题，由于各计算机性能不同，运行时间不准确。请自行运行测试。如有需要，修改代码中的setTimeout函数的时间参数，单位为ms。
// @description     Copyright (C) 2020 xx572959496. All rights reserved.
// @author       xx572959496
// @match        *.baichuanweb.com/produce/index*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/402996/%E7%99%BE%E5%B7%9D%E4%BB%BB%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%8A%A2%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/402996/%E7%99%BE%E5%B7%9D%E4%BB%BB%E5%8A%A1%E5%B9%B3%E5%8F%B0%E6%8A%A2%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*****
优先级：
x == 8   图书补答案
y == 9   图书补答案审核
z == 4   图书拆分
w == 6   图书拆分改错
******/
    window.onload = function(){
        setTimeout(function (){
            var i;
            try{
                var x = document.getElementsByClassName("text-msg")[8].textContent.substring(7,8);
                var y = document.getElementsByClassName("text-msg")[9].textContent.substring(7,8);
                var z = document.getElementsByClassName("text-msg")[4].textContent.substring(7,8);
                var w = document.getElementsByClassName("text-msg")[6].textContent.substring(7,8);
            }
            catch(e){
                location.reload();
            }
            function getTest(x , y , z){
                var d = new Date();
                var m = d.getMinutes();
                if( m >= 55 || m <= 4 ) {
                    //console.log("现在只抢一个题");
                    if(x == 0){
                        i = 0;
                        return i;
                    }else{
                        i = 8;
                        return i;
                    }
                }else{
                    //console.log("现在抢三个题");
                    if(x == 0){
                        if(y == 0){
                            if(z == 0){
                                if(w == 0){
                                    //console.debug("一个题也没有");
                                    i = 0;
                                    return i;
                                }else{
                                    i = 6;
                                    return i;
                                }
                            }else{
                                i = 4;
                                return i;
                            }
                        }else{
                            i = 9;
                            return i;
                        }
                    }else{
                        i = 8;
                        return i;
                    }
                }
            }
            getTest(x , y , z);
            if(i !== 0){
                document.getElementsByClassName("btn")[i].click();
                console.debug("点击了" + i);
                setTimeout(function (){
                    location.reload();
                },50);
            }else{
                location.reload();
            }
        },400);
    }
    // Your code here...
})();