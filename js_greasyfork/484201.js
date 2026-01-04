// ==UserScript==
// @name        虎码快记
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @description  虎码快记，自动下一个
// @author       winter60
// @match        https://tiger-code.com/freePractise.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiger-code.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484201/%E8%99%8E%E7%A0%81%E5%BF%AB%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484201/%E8%99%8E%E7%A0%81%E5%BF%AB%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.autoNext = function(){
        charEle.innerHTML = "拆分";
        codeEle.innerHTML = "编码";
        let inputEle = document.querySelector("#input");
        let currCount = document.querySelectorAll(".show_text>span").length;
        if(currCount === 0 && wordEle.innerHTML === "…"){
            nextWord = showText[0];
            wordEle.innerHTML = nextWord;
            checkChar();
            checkCode();
            return;
        }


        if(currCount + 1 >= showText.length){
            initKjBox();
        }else if(currCount + 1 > showText.length){
            return;
        }

        inputEle.value = showText.substr(0,currCount + 1);
        let event = new Event('input', { bubbles: true });
        let tracker = inputEle._valueTracker;
        if (tracker) {
            tracker.setValue('');
        }
        inputEle.dispatchEvent(event);
    }
    //缓存
    window.cacheData = JSON.parse(localStorage.getItem("cacheData")) || {};
    window.checkChar = async function(){
        if(!nextWord){
            return;
        }
        wordEle.innerHTML = nextWord;
        if(cacheData[nextWord]){
            //console.log("调缓存")
            nowOrdata = cacheData[nextWord];
        } else{
            let res = await axios.get(host + '/dic/'+nextWord);
            nowOrdata = res.data.data;
            if(nowOrdata.org === nextWord){
                cacheData[nextWord] = nowOrdata;
                localStorage.setItem("cacheData", JSON.stringify(cacheData));
            }
        }

        if(nowOrdata.org == nextWord){
            let charText = getChar(nowOrdata);
            $('.box4').html(charText)
            charEle.innerHTML = charText;
            $('.box4').addClass('text-sm')
        }else{
            console.log(nextWord +"  和" + nowOrdata.org + "不匹配")
        }

    }

    function initKjBox(){
        wordEle.innerHTML = "…";
        charEle.innerHTML = "拆分";
        codeEle.innerHTML = "编码";
    }
    function getChar(data){
        nowOrdata = data;
        /*
        let templist = nowOrdata.code.split(' ')
        let codeList = templist;
        let ecode,fcode;
        if(templist[1]) {
            ecode = templist[1]
        }
        if(templist[0]) {
            fcode = templist[0]
        }
        if(templist.length == 1) {
            fcode = templist[0]
        }else if (templist.length == 2) {
            ecode = templist[0]
            fcode = templist[1]
        }*/
        let tstring = nowOrdata.diff.split('〔')[1]
        tstring = tstring.replace(/\s*/g,"");
        return nowOrdata.diff.split('〔')[0] + '<br>' + tstring.substr(0, tstring.length-1)
    }

    function getCode(data){
        nowOrdata = data;
        let codeText = nowOrdata.code;
        let tempArr = codeText.split(" ").sort((next,pre)=>{return next.length - pre.length});
        tempArr[0] = "<span style='color:black;font-size:40px;font-weight:600'>" + tempArr[0] + "</span>"
        codeText = tempArr.join(" ")
        return codeText;
    }


    window.checkCode = async function(){
        if(!nextWord){
            return;
        }

        if(cacheData[nextWord]){
            //console.log("调缓存")
            nowOrdata = cacheData[nextWord];
        } else{
            let res = await axios.get(host + '/dic/'+nextWord);
            nowOrdata = res.data.data;
            if(nowOrdata.org === nextWord){
                cacheData[nextWord] = nowOrdata;
                localStorage.setItem("cacheData", JSON.stringify(cacheData));
            }
        }


        if(nowOrdata.org == nextWord){
            let codeText = getCode(nowOrdata);
            $('.box3').html(codeText);
            codeEle.innerHTML = codeText;
            $('.box3').addClass('text-sm2')
        }else{
            console.log(nextWord +"  和" + nowOrdata.org + "不匹配")
        }

    }


    let wordEle = document.createElement('div');
    let charEle = document.createElement('div');
    let codeEle = document.createElement('div');

    wordEle.id = "nextWord";
    wordEle.innerHTML = "…";
    wordEle.style = "color:#ffffff;font-size:90px;background:#5bc0de;text-align:center;"
    //document.querySelector(".speed_area").insertAdjacentElement("afterend",wordEle);
    wordEle.onclick = window.autoNext;
    //window.tmpFun = document.querySelector("#input").oninput;
    let inputEle = document.querySelector("#input");
    inputEle.addEventListener("input", function(){
        let currCount = document.querySelectorAll(".show_text>span").length;
        if(currCount === 0){
            initKjBox();
            autoNext();
            return;
        }

        if(nextWord){
            wordEle.innerHTML = nextWord;
            nowOrdata = cacheData[nextWord];
            if(nowOrdata){
                charEle.innerHTML = getChar(nowOrdata);
                codeEle.innerHTML = getCode(nowOrdata);
            }
        } else{
            initKjBox();
        }
    })

    //---------------

    charEle.id = "char-ele";
    //charEle.class = "box4 text-sm"
    charEle.innerHTML = "拆分";
    charEle.setAttribute("class", "text-sm");
    //document.querySelector(".speed_area").insertAdjacentElement("afterend",wordEle);



    codeEle.id = "code-ele";
    //codeEle.class = "box3 text-sm2"
    codeEle.innerHTML = "编码";
    codeEle.setAttribute("class","text-sm2")

    document.querySelector(".speed_area").insertAdjacentHTML("afterend","<div class='color-box' id='kj_box'></div>");
    let kjBoxEle = document.querySelector("#kj_box");
    kjBoxEle.insertAdjacentElement("afterbegin", wordEle);
    kjBoxEle.insertAdjacentElement("afterbegin", codeEle);
    kjBoxEle.insertAdjacentElement("afterbegin", charEle);

    let sheet = document.createElement('style')
    //sheet.setAttribute('media', 'screen')
    sheet.innerHTML = `
        #code-ele{
            background-image: linear-gradient(to bottom right, #62a3bd, #35f3c7);
            color: #fff;
        }
        #char-ele{
            background-image: linear-gradient(to bottom right, #fb686a, #fda5a6);
            color: #fff;
        }

        #kj_box>div{
            border-radius: 19px;
            height: 100px;
            width:40%;
            margin-top: 20px;
            box-shadow: 1px 3px 7px #dddddd;
        }
    `
    document.head.appendChild(sheet)

    $(".login-color-box").hide()
    //xxx
    autoNext()

})();