// ==UserScript==
// @name         examination
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  个人考试脚本！
// @author       You
// @match        http://learning.wuxuejiaoyu.cn/openlearning/separation/exam/index.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuxuejiaoyu.cn
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/457450/examination.user.js
// @updateURL https://update.greasyfork.org/scripts/457450/examination.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    const map1 = new Map();

    //建立按钮功能

    //获取正确答案
    var eleDiv = document.getElementsByClassName('btngroup')[0].cloneNode(false);
    var inputbtn = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    inputbtn.id = "btn";
    inputbtn.textContent = "获取"
    inputbtn.style.margin = "10px";
    inputbtn.onclick = getanswer;
    eleDiv.appendChild(inputbtn);

    //输出正确答案
    var inputbtn2 = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    inputbtn2.id="btn2";
    inputbtn2.textContent="输出";
    inputbtn2.style.margin = "10px";
    inputbtn2.onclick = setanswer;
    eleDiv.appendChild(inputbtn2);

    var A = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    A.id="btnA";
    A.textContent="A";
    A.style.margin = "10px";
    A.onclick = ButtonA;
    eleDiv.appendChild(A);

    var B = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    B.id="btnB";
    B.textContent="B";
    B.style.margin = "10px";
    B.onclick = ButtonB;
    eleDiv.appendChild(B);

    var C = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    C.id="btnC";
    C.textContent="C";
    C.style.margin = "10px";
    C.onclick = ButtonC;
    eleDiv.appendChild(C);

    var D = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    D.id="btnD";
    D.textContent="D";
    D.style.margin = "10px";
    D.onclick = ButtonD;
    eleDiv.appendChild(D);

    var clearConsole = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    clearConsole.id="btnclearConsole";
    clearConsole.textContent="清理控制台";
    clearConsole.style.margin = "10px";
    clearConsole.onclick = ButtonclearConsole;
    eleDiv.appendChild(clearConsole);

    var clearLocal = document.getElementsByClassName('btn submitB')[0].cloneNode(true);
    clearLocal.id="btnclearLocal";
    clearLocal.textContent="清理缓存";
    clearLocal.style.margin = "10px";
    clearLocal.onclick = ButtonclearLocal;
    eleDiv.appendChild(clearLocal);

    document.getElementById('paperRight').appendChild(eleDiv);

    function getanswer(){
        let img = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAQCAYAAAAbBi9cAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAEqADAAQAAAABAAAAEAAAAADgaeE1AAABi0lEQVQ4EaWTPUjDQBTH/5fQKNiuTn6AzuJSrckmgnSomziIm2ARdRAnWwsZUj/o4lYUXRRdKy46FQUbW3VxKNbBRXGtFnGwX+dLMbRpO6T1lrv3Xv6/e3f/C/CfkVadSIWGDQRrm8M5gx6MEWEconNAbBvkLWyD83kwtgZZvW6PkwzMIbHOoQeiJkAwF7bnVEhGiR/QkeKQpRVT19od3QV7UeT3AP8COjxQ1KwJst/RY6QLBX5OkE4ST9VCDJg9kOHQ98cxQYYgiDNQtjJmJ+Zsz7XJYpggC7TvKpTwqSmunRke9hzIv0bhYBGMaM+1xcpaD8ySzSdk8z6UTX9D/S9BR3vro918yJdv6IGNWj68DXnAcUgOXUHqX7bU6gIBbu0FDkmhfA4ox6FveCvfJNUe8OIZrd8huqbh9hfqtJawan9C7QbLX1QulGGJOlmkP2gQTBiDrD1ZVE2CKsgoZnZcyOZidCcTFJXARB8U7bKJriFlBRnltCrh8+eIOkmSQ7sNipYSxrtpcfwC9VhxPYhh6TIAAAAASUVORK5CYII=';
        let index = document.getElementsByClassName('tmList').length;
        let ele,result;

        for(let i = 0;i < index;i++){
            ele = document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByClassName('flagImg')[0];
            if(ele != undefined){
                if(ele.src == img){
                    result = document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByClassName('flagImg')[0].parentNode.getElementsByTagName('input')[0].value;
                    localStorage.setItem(i,result);
                }
            }
        }
        var blob = new Blob([JSON.stringify(localStorage)]);

    }

    function setanswer(){
        var localKey,ele,result;;

        localKey = Object.keys(localStorage);
        //console.log(localStorage)
        for (let i=0;i < localStorage.length;i++) {
            console.log(localKey[i],localStorage.getItem(localKey[i]));
            setTimeout(function () {
                if(localStorage.getItem(localKey[i]) == "A"){
                    document.getElementsByClassName('tmList')[localKey[i]].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[0].click();
                }else if(localStorage.getItem(localKey[i]) == "B"){
                    document.getElementsByClassName('tmList')[localKey[i]].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[1].click();
                }else if(localStorage.getItem(localKey[i]) == "C"){
                    document.getElementsByClassName('tmList')[localKey[i]].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[2].click();
                }else if(localStorage.getItem(localKey[i]) == "D"){
                    document.getElementsByClassName('tmList')[localKey[i]].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[3].click();
                }
            }, 1000 * i);
        }
    }

    function ButtonA(){
        var index = document.getElementsByClassName('tmList').length;
        var ele,result;

        for(let i = 0;i < index;i++){
            setTimeout(function () {
                ele = document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[0];
                if(ele.value == "A"){
                    document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[0].click();
                }
            }, 1000 * i);
        }
    }

    function ButtonB(){
        var index = document.getElementsByClassName('tmList').length;
        var ele,result;

        for(let i = 0;i < index;i++){
            setTimeout(function () {
                ele = document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[1];
                if(ele.value == "B"){
                    document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[1].click();
                }
            }, 1000 * i);
        }
    }

    function ButtonC(){
        var index = document.getElementsByClassName('tmList').length;
        var ele,result;

        for(let i = 0;i < index;i++){
            setTimeout(function () {
                ele = document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[2];
                if(ele.value == "C"){
                    document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[2].click();
                }
            }, 1000 * i);
        }

    }

    function ButtonD(){
        var index = document.getElementsByClassName('tmList').length;
        var ele,result;

        for(let i = 0;i < index;i++){
            setTimeout(function () {
                ele = document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[3];
                if(ele.value == "D"){
                    document.getElementsByClassName('tmList')[i].getElementsByClassName('ansbox radioAnswer')[0].getElementsByTagName('input')[3].click();
                }
            }, 1000 * i);
        }
    }

    function ButtonclearConsole(){
        console.clear();
    }

    function ButtonclearLocal(){
        if(confirm("是否清理缓存？"))
        localStorage.clear();
    }
})();