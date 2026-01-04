// ==UserScript==
// @name         重庆理工大学继续教育学考网
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  这是一个定制化自动脚本，如需定制其他网站以及功能扩展，请联系1908245302@qq.com
// @author       xiguayaodade
// @license      MIT
// @match        *://*.360xkw.com/*
// @icon         https://www.360xkw.com/class/css/favicon.ico
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/477993/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E8%80%83%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/477993/%E9%87%8D%E5%BA%86%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%AD%A6%E8%80%83%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */

    var n = 0;
    var rediosIndex = 1;
    var questionCount = 0;


    // $(()=>{
    //     alert("\u004d\u0072\u002e\u0059\u0061\u006e\u0067\u63d0\u793a\u60a8\uff1a\u70b9\u51fb\u786e\u5b9a\uff0c\u7136\u540e\u9009\u62e9\u8981\u89c2\u770b\u7684\u89c6\u9891\u5373\u53ef\u3002\u0050\u0053\u003a\u63a8\u8350\u4f60\u9009\u62e9\u6bcf\u4e2a\u8bfe\u7a0b\u7b2c\u4e00\u6761\u89c6\u9891\uff0c\u6211\u4f1a\u81ea\u52a8\u4e3a\u60a8\u68c0\u7d22\u672a\u64ad\u653e\u5b8c\u7684\u89c6\u9891\u3002\u8bf7\u60a8\u8010\u5fc3\u7b49\u5f85\uff01");
    // })


    function addLi(){
        var li = document.getElementsByClassName("isVideo");
        for(let i=0;i < li.length;i++){
            li[i].onclick = function(){
                n = i;
                console.log("当前第"+(n+1)+"个学习视频。");
            }
        }
    }


    function addVideo() {
        var elevideo = document.getElementById("live_video");
        elevideo.addEventListener('play',function(){
            console.log("\u0079\u006a\u0063\u003a\u5f00\u59cb\u64ad\u653e");
            let dt = Date.now();
            console.log(new Date(dt)+"||"+dt);
        })
        elevideo.addEventListener('playing',function(){
            console.log("\u0079\u006a\u0063\u003a\u6b63\u5728\u64ad\u653e");
            let dt = Date.now();
            console.log(new Date(dt)+"||"+dt);
        })
        elevideo.addEventListener('pause',function(){
            console.log("\u0079\u006a\u0063\u003a\u6682\u505c\u64ad\u653e");
            let dt = Date.now();
            console.log(new Date(dt)+"||"+dt);
        })
        elevideo.addEventListener('ended',function(){
            console.log("\u0079\u006a\u0063\u003a\u7ed3\u675f\u64ad\u653e");
            let dt = Date.now();
            console.log(new Date(dt)+"||"+dt);
            n++;
            document.getElementsByClassName("isVideo")[n].click();
        })
    }


    //------多选题答题方法start------
    var moreRe = function(quLength){
        setTimeout(function(){
            let positiveSolution = quLength;
            let array = positiveSolution.split(',');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                for(var j=0;j<str2.length;j++){
                    switch(str2[j])
                    {
                        case 'A':
                            document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[0].click();
                            console.log("点击A");
                            break;
                        case 'B':
                            document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[1].click();
                            console.log("点击B");
                            break;
                        case 'C':
                            document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[2].click();
                            console.log("点击C");
                            break;
                        case 'D':
                            document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[3].click();
                            console.log("点击D");
                            break;
                        case 'E':
                            document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[4].click();
                            console.log("点击E");
                            break;
                        case 'F':
                            document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[5].click();
                            console.log("点击F");
                            break;
                        case 'G':
                            document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[6].click();
                            console.log("点击G");
                            break;
                        default:
                            console.log("当前多选题选项过多，系统需更新！");
                    }
                }
            },500);
            setTimeout(function(){
                rediosIndex++;
                answer();
            },1500);
        },500);
    }
    //------多选题答题方法end------

    //------单选题答题方法start------
    var onlyRe = function(quLength){
        setTimeout(function(){
            let positiveSolution = quLength;
            let array = positiveSolution.split(',');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                switch(str2[0])
                {
                    case 'A':
                        document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[0].click();
                        console.log("点击A");
                        break;
                    case 'B':
                        document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[1].click();
                        console.log("点击B");
                        break;
                    case 'C':
                        document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[2].click();
                        console.log("点击C");
                        break;
                    case 'D':
                        document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[3].click();
                        console.log("点击D");
                        break;
                    case 'E':
                        document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[3].click();
                        console.log("点击E");
                        break;
                    case 'F':
                        document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("xx")[0].children[0].children[5].click();
                        console.log("点击F");
                        break;
                }
            },100);
            setTimeout(function(){
                rediosIndex++;
                answer();
            },200);
        },100);
    }
    //------单选题答题方法end------

    //------判断题答题方法start------
    var judgRe = function(){
        setTimeout(function(){
            let positiveSolution = document.querySelectorAll("tbody")[2].children[rediosIndex-1].getElementsByTagName("td")[0].getElementsByTagName("input")[0].value;
            let array = positiveSolution.split(' ');
            let str2 = array.join('');
            console.log("xigua:返回数据{"+str2+"}");
            setTimeout(function(){
                switch(str2[0])
                {
                    case 'Y':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+2].children[0].children[0].click();
                        console.log("点击Y");
                        break;
                    case 'N':
                        document.querySelectorAll("tbody")[2].children[rediosIndex-1+3].children[0].children[0].click();
                        console.log("点击N");
                        break;
                }
            },500);
            setTimeout(function(){
                rediosIndex++;
                answer();
            },1000);
        },500);
    }
    //------判断题答题方法end------

    //------考试start------
    var answer = function(){
        if(rediosIndex <= questionCount){
            let indexEnd = document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("Parsing")[0].children[1].innerText.indexOf('\n',1);
            let quLength = document.getElementsByClassName("tm bg_white")[rediosIndex-1].getElementsByClassName("Parsing")[0].children[1].innerText.substring(11,indexEnd);
            if(quLength.length == 1){
                onlyRe(quLength);
            }
            else if(quLength.length > 1){
                moreRe(quLength);
            }
            else{
                console.log("xigua:未知题型");
            }
        }
        else{
            console.log("xigua:作答完毕,请手动提交");
        }
    }
    //------考试end------


    //------等待网页加载完成start-----
    var wait = setInterval(function (){
        let nowUrl = window.location.href;
        if(nowUrl.substring(0,63) === 'http://cqlg.360xkw.com/gxplatform/gxlearningcenter/questionBank'){
            console.log("知识点测评，开始...");
            questionCount = document.getElementsByClassName("tm bg_white").length;
            answer();
            clearInterval(wait);
        }
        else if(nowUrl.substring(0,62) === 'http://cqlg.360xkw.com/gxplatform/gxlearningcenter/rebackVideo'){
            console.log("学习页");
            addLi();
            addVideo();
            clearInterval(wait);
        }
        else{
            console.log("请进入课程列表");
            alert("\u004d\u0072\u002e\u0059\u0061\u006e\u0067\u63d0\u793a\u60a8\uff1a\u70b9\u51fb\u786e\u5b9a\uff0c\u7136\u540e\u9009\u62e9\u8981\u89c2\u770b\u7684\u89c6\u9891\u5373\u53ef\u3002\u0050\u0053\u003a\u63a8\u8350\u4f60\u9009\u62e9\u6bcf\u4e2a\u8bfe\u7a0b\u7b2c\u4e00\u6761\u89c6\u9891\uff0c\u6211\u4f1a\u81ea\u52a8\u4e3a\u60a8\u68c0\u7d22\u672a\u64ad\u653e\u5b8c\u7684\u89c6\u9891\u3002\u8bf7\u60a8\u8010\u5fc3\u7b49\u5f85\uff01");
            clearInterval(wait);
        }
    }, 500);
    //------等待网页加载完成end-----
})();