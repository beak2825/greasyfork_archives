// ==UserScript==
// @name         百度翻译-个人版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @connect      api.fanyi.baidu.com
// @connect      translate.google.cn
// @description  个人版本的百度翻译，没有那么多的杂七杂八的东西
// @author       https://www.wanyan.site/
// @match        http*://**/**
// @match        http*://**/**
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcss.com/blueimp-md5/2.11.0/js/md5.min.js
// @downloadURL https://update.greasyfork.org/scripts/391772/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91-%E4%B8%AA%E4%BA%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/391772/%E7%99%BE%E5%BA%A6%E7%BF%BB%E8%AF%91-%E4%B8%AA%E4%BA%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let urlBase = "http://api.fanyi.baidu.com/api/trans/vip/translate";
    let params = {
        from:"en",
        to:"zh",
        appid:"20190725000321230",
        salt:"123456",
    };

    let arr = [];
    arr.push(params.appid);
    arr.push(params.q);
    arr.push(params.salt);
    arr.push(params.secret);
    function sign(q){
        let arr = [];
        arr.push(params.appid);
        arr.push(q);
        arr.push(params.salt);
        arr.push("xnLi_buk_USN1GROsxP1");//secret的md5字符串
        let str = arr.join("");
        let sign = md5(str);
        let p = Object.assign({q:q,sign:sign},params);
        return p;
    }

    let _savedonmouseup = document.body.onmouseup;
    let _savedonmousedown = document.body.onmousedown;
    let _storedTag;
    let _storedBtn;
    document.body.onmouseup = function(...args){
        let event = args[0];

        _savedonmouseup && _savedonmouseup(...args);
        var txt = window.getSelection?window.getSelection().toString():document.selection.createRange().text;
        if(event.target===_storedBtn)return
        createTranslateButton(txt,event.pageX,event.pageY);
    };

    document.body.onmousedown = function (...args){
        let event = args[0];
        if(event.target==_storedTag)return;
        _savedonmousedown && _savedonmousedown();
        destoryTag();
    }

    function showWordGoogle(word,left,top){
       const url = `http://translate.google.cn/translate_a/single?client=gtx&dt=t&dj=1&ie=UTF-8&sl=auto&tl=zh_CN&q=${word}`
       GM_xmlhttpRequest({
            method:"GET",
            url:url,
            responseType:'json',
            onload:(result)=>{
                console.log(result.response.sentences.map(_=>_.trans).join(","));
                createDom(left,top,result.response.sentences.map(_=>_.trans).join(","))
            }
        })

    }

    function showWord(word,left,top){
        if(!word||word.length===0)return;
        let requestUrl=urlBase+`?${toQueryParams(sign(word))}`;
        GM_xmlhttpRequest({
            method:"GET",
            url:requestUrl,
            responseType:'json',
            onload:(result)=>{
                console.log(result.response.trans_result);
                createDom(left,top,result.response.trans_result.map(item=>item.dst).join(","))
            }
        })
    }

    function toQueryParams(p){
        let str = "";
        for(let key in p){
            str+=`&${key}=${p[key]}`
        }
        return str.substr(1);
    }



    function destoryTag(){
        if(_storedTag){
            document.body.removeChild(_storedTag);
            _storedTag=undefined;
        }
    }
    function destroyTslBtn(){
        if(_storedBtn){
            document.body.removeChild(_storedBtn);
            _storedBtn=undefined;
        }
    }
    function createTranslateButton(word,left,top){
        destroyTslBtn();
        word=(word||"").trim();
        if(!word || word.length===0)return;
        if(/[\u4e00-\u9fa5]/.test(word)){
            return;
        }
        let btn = document.createElement("button");
        btn.innerText='译';
        btn.style.position='absolute';
        btn.style.background="lightgrey";
        btn.style.minHeight='30px';
        btn.style.minWidth="40px"
        btn.style.left=`${left+20}px`;
        btn.style.top=`${top+10}px`;
        btn.display='inline-block';
        btn.style.zIndex=200000;
        btn.onclick=(event)=>{
            console.log("~~~");
            showWord(word,left,top)
        };
        document.body.appendChild(btn);
        _storedBtn=btn;
    }

    function sendData(obj){
        //let url = "http://0.0.0.0:8120/node-book/save/word";
        let url = "https://www.wanyan.site/nodejs/node-book/save/word";
        console.log(obj);
        GM_xmlhttpRequest({
            method:"post",
            url:url,
            headers:{"Content-Type":"application/json; charset=UTF-8"},
            data:JSON.stringify(obj),
            responseType:'json',
            timeout:3000,
            onload:(result)=>{console.log(result && result.response);},
            onerror:(error)=>{console.log(error && error.response);}
        });
    }

    function createDom(left,top,word){
        destoryTag();
        destroyTslBtn();
        if(!word || word.length===0)return;
        let tag = document.createElement("div");
        tag.style.position='absolute';
        tag.style.left=`${left+20}px`;
        tag.style.top=`${top+10}px`;
        tag.display='inline-block';
        tag.style.width='130px';
        tag.style.background='lightgrey';
        tag.style.zIndex=200000;
        tag.style["text-align"]='center';
        document.body.appendChild(tag);
        tag.innerText=word;
        _storedTag=tag;
    }



})();