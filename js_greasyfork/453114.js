// ==UserScript==
// @name         tg批量图片下载
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  主要用于tg链接打开的图包进行批量下载
// @author       You
// @match        https://telegra.ph/*
// @icon         https://telegra.ph/favicon.ico
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/453114/tg%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/453114/tg%E6%89%B9%E9%87%8F%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
//<script>
(function () {
    //浏览器渲染后执行
    window.onload = function(){
        console.log('脚本加载')
    var htitle = document.getElementsByClassName("tl_article_header")//获取头部位置
    var h1title = document.getElementsByTagName('h1');
    var btnEle = document.createElement("button");
    var resetBtn = document.createElement('button');
    btnEle.innerText = "下载"
    resetBtn.innerText = '重置'
    htitle[0].appendChild(resetBtn);
    htitle[0].appendChild(btnEle)


    var imgList = document.getElementsByTagName("img");
    var hrefList = [];

    //获取所有的下载链接
    for(let i =0;i <imgList.length;i++)
    {
        hrefList[i] = imgList[i].src
    }
    //自增编号
    function setNumber(num) {
            var len = 3 //显示的长度，如果以0001则长度为4
            num = parseInt(num, 10) + 1//转数据类型，以十进制自增
            num = num.toString()//转为字符串
            while (num.length < len) {//当字符串长度小于设定长度时，在前面加0
                num = "0" + num
            }
            //如果字符串长度超过设定长度只做自增处理。
            return num
    }

    function pause(msec) {
    return new Promise(
        (resolve, reject) => {
            setTimeout(resolve, msec || 1000);
        }
    );
    }
    //批量图片下载
    var j = 0;
    async function downFileAll(){
        console.log('开始下载');
        for(let i =j;i < hrefList.length;i++){
            var number = setNumber(i);
            var a = document.createElement('a');
            a.setAttribute('href',hrefList[i]);
            a.setAttribute('download',h1title[0].innerHTML+number);
            a.setAttribute('class',"pictureitem");
            htitle[0].appendChild(a)
            /*if(i != 0&&i % 10 ==0){
                await pause(1000)//谷歌批量下载一次十个任务
            }
            a.click();*/
        }
        var alist = document.getElementsByClassName("pictureitem")
        for(let i = j;i <alist.length;i++)
        {
            j = i;
            console.log("sds")
            console.log()
            if(i != 0&&i % 10 ==0){
                await pause(1000)//谷歌批量下载一次十个任务
            }
            alist[i].click()
        }
        if(++j == hrefList.length)
        {
            alert('总共'+j+'张下载完成');
        }


    }

    //重置
    function resetFun(){
        j = 0;

    }
    btnEle.onclick = downFileAll;
    resetBtn.onclick = resetFun;
    }
})();







