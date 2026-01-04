// ==UserScript==
// @name         bjtu核酸系统一键刷新
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  打通最后一公里（让辅导员把时间用于立德树人而不是机械式点击更新）
// @author       余健
// @match        https://covidtest.bjtu.edu.cn/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454465/bjtu%E6%A0%B8%E9%85%B8%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/454465/bjtu%E6%A0%B8%E9%85%B8%E7%B3%BB%E7%BB%9F%E4%B8%80%E9%94%AE%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //请先进入核酸核查界面并刷新

    //创建一个盒子，与“导出数据”按钮并列
    var addDiv = document.createElement('div');
    var addDiv2 = document.createElement('div');
    var addDiv3 = document.createElement('div');
    addDiv.class = "btn btn-default";
    addDiv.style = "display: inline-block; margin-right: 20px;";
    addDiv2.class = "btn btn-default";
    addDiv2.style = "display: inline-block; margin-right: 20px;";
    addDiv3.class = "btn btn-default";
    addDiv3.style = "display: inline-block; margin-right: 20px;";
    //往盒子里面放一个按钮
    addDiv.innerHTML = '<button type="button" class="ant-btn ant-btn-primary"><span>一键刷新</span></button>';
    addDiv2.innerHTML = '<button type="button" class="ant-btn ant-btn-primary"><span>跨页刷新</span></button>';
    addDiv3.innerHTML = '<button type="button" class="ant-btn ant-btn-primary"><span>一键查看核酸第2天</span></button>';
    //找到“导出数据”按钮所在盒子的位置，并把创建的盒子放旁边
    var currentDiv = document.querySelector("#routerView > div > div > div > div > div.importBtnDiv");
    currentDiv.appendChild(addDiv);
    currentDiv.appendChild(addDiv2);
    currentDiv.appendChild(addDiv3);

    //找到所有更新按钮，并点击
    addDiv.onclick = function clickAll(){
        var allBtn = document.getElementsByClassName("ant-btn ant-btn-success");
        for(var i=0; i< allBtn.length; i++){
            allBtn[i].click();
        }
    }
    addDiv2.onclick = function scrollPage(){
        //确定页面数量
        var pageValue = document.evaluate("//ul[@class='ant-pagination']/li[last()-1]", document).iterateNext().innerText;
        //console.log(pageValue);
        //如果页面数为1，则直接点击本页所有按钮
        if (pageValue == 1){
            var allBtn1 = document.getElementsByClassName("ant-btn ant-btn-success");
            for(var p=0; p< allBtn1.length; p++){
                allBtn1[p].click();
            }
        }
        //如果页面数量大于1，则翻页点击
        else{
            //回到第一页
            var firstPage = document.evaluate("//ul[@class='ant-pagination']/li[2]", document).iterateNext();
            //console.log(firstPage);

            firstPage.click();
            //寻找翻页按钮
            var nextPage = document.evaluate("//ul[@class='ant-pagination']/li[last()]", document).iterateNext();
            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

            async function repeatGreetingsLoop() {
                for(var n=1; n<pageValue; n++){
                    var allBtn2 = document.getElementsByClassName("ant-btn ant-btn-success");
                    for(var b=0; b< allBtn2.length; b++){
                        allBtn2[b].click();
                    }
                    //进行翻页
                    await sleep(13000);
                    nextPage.click();
                    await sleep(2500);
                    if (n==pageValue-1){
                        console.log(n);
                        var allBtn3 = document.getElementsByClassName("ant-btn ant-btn-success");
                        for(var c=0; c< allBtn3.length; c++){
                            allBtn3[c].click();
                        }
                        await sleep(1000);
                        for(var d=0; d< allBtn3.length; d++){
                            allBtn3[d].click();
                        }
                    }
                }
                //回到第一页,重新浏览各页面
                //var reFirstPage = document.evaluate("//ul[@class='ant-pagination']/li[2]", document).iterateNext();
                //console.log(firstPage);

                firstPage.click();
                for(var r=1; r<pageValue; r++){
                    //进行翻页
                    await sleep(1500);
                    nextPage.click();
                    await sleep(1500);
                }
            }
            repeatGreetingsLoop()
        }
    }
    addDiv3.onclick = function searchBtn(){
        async function search() {
            const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
            var input = document.evaluate('//*[@id="routerView"]//div[@class="searchList"]/input[4]',document).iterateNext();
            let event = document.createEvent('HTMLEvents');
            event.initEvent('input', true, true);
            input.value='1';
            input.dispatchEvent(event)
            await sleep(1200);
            var sb = document.evaluate('//*[@id="routerView"]//div[@class="searchList"]/button',document).iterateNext();
            sb.click();

        }
        search();
    }





})();