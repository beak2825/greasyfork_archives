// ==UserScript==
// @name         iCopy5
// @namespace    http://tampermonkey.net/
// @version      5.4.2
// @description  一键复制iCafe信息，支持生成gitMsg，支持多选，支持预览
// @author       mzvast@gmail.com
// @match        https://console.cloud.baidu-int.com/devops/icafe/*
// @grant        none
// @license MIT
// @updateAt 2022-01-12
// @downloadURL https://update.greasyfork.org/scripts/411953/iCopy5.user.js
// @updateURL https://update.greasyfork.org/scripts/411953/iCopy5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let panelRootEl = null;
    const initPanel = ()=>{
        panelRootEl = document.createElement('div');
        panelRootEl.innerHTML=`
<div id="icode-master-v5"  style="color:#fff;position:fixed;left:0;bottom:100px;z-index:999;background:black;width:50px;height:300px;"><br/>
<box style="background:white;color:#5069e6;">iCopy5</box>
<span id="word"></span>
<img id="girl" style="width:50px;height:50px;border-radius:50%;" crossorigin="anonymous" alt="girl"/>
<hr/>
模式
<form name="myForm">
  <input type="radio" id="off" name="mode" value="0"
         >
  <label for="off">关闭</label>

  <input type="radio" id="one" name="mode" value="1" checked>
  <label for="one">单选</label>

  <input type="radio" id="multiple" name="mode" value="2">
  <label for="multiple">多选</label>

</form>

<hr/>
<style>#cp-board:hover{width:250px;height:100px;background:#5069e6;}</style>
<button style="color:#5069e6;background:white;outline:none;border:none;" id="clear">清空</button>

<p style="max-height:100px;overflow:auto;" id="cp-board">Empty</p>

</div>`
        document.body.appendChild (panelRootEl);
    }
    initPanel();
    let boardMsg = '';
    let mode= 1
    let boardEle = null;
    let girlEle = document.getElementById('girl');
    let wordEle = document.getElementById('word');
    const girlDict = ["https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTZLZYzIckuEjbJAjMbm2kNEuKsM-fy9HAdHA&usqp=CAU",
                      "https://5b0988e595225.cdn.sohucs.com/images/20190503/ba81c4b53eae4744a7cef75d5c5abf75.jpeg"
                     ]
    const wordDict = ["加油！","真棒！","爱你！","么么哒", "太酷了","666","mua<3"];
    let girlIndex = -1;
    let wordIndex = -1;
    const setRandomGirl = ()=>{
        let newGirlIndex = Math.floor(Math.random()*girlDict.length)
        if(girlIndex===newGirlIndex) {
            return setRandomGirl(); // same index try again
        }
        girlIndex = newGirlIndex;
        girlEle.src=girlDict[girlIndex];
    }
    const setRandomWord = ()=>{
        let newWordIndex = Math.floor(Math.random()*wordDict.length)
        if(wordIndex===newWordIndex) {
            return setRandomWord(); // same index try again
        }
        wordIndex = newWordIndex;
        wordEle.innerHTML=wordDict[wordIndex];
    }
    setRandomGirl();
    setRandomWord();

    // 初始化copy
    //
    const _execCommand = document.execCommand;

    // 旧版本icafe用的execaCommand
    document.execCommand = async function(evtName){
        if(evtName ==='copy'){
            console.log('enter exec')
            // 由于前者使用必须要selection然后exec copy
            // 获取选中部分
            const text = window.getSelection().toString()
            main(text)
        }
    }

    let copyFromNCW = false; // 是否使用的clipboardAPI
    // 新版本icafe用的navigator.clipboard.writeText
    const _writeText = navigator.clipboard.writeText; // save for later use
    // 劫持writeText方法
    navigator.clipboard.writeText = async (text) => {
        copyFromNCW = true;
        main(text);
    };

    const addToBoard = (msg)=>{
        boardMsg = msg;
    }
    const updateBoard = ()=>{
        if(!boardEle) boardEle=document.getElementById('cp-board');
        boardEle.innerHTML= boardMsg;
    }

    const makeCommitMsg = (cardType, issueId, fullTitle) => {
        let type = '✨feat'; // 默认值
        if(/缺陷BUG/i.test(cardType)) type = '🐛fix';
        else if(/视觉BUG/i.test(cardType)) type = '🎨fix';
        else if(/重构/i.test(fullTitle)) type = '♻️chore'
        let scope = '';
        let title = fullTitle.replace(/\s/g,'');
        if (title.indexOf('【') !== -1 && fullTitle.indexOf('】') !== -1) {
            const matchedScope = fullTitle
            .match(/【(.*?)】/g)
            .map(t => t.match(/【(.*)】/)[1]);
            scope = `:(${matchedScope.join(',')})`;
            title = title.match(/【.*】(.*)/)[1];
        }
        return `${type}${scope}:[${issueId}]${title}`;
    };
    const copyText = text => {
        // 新接口
        if(copyFromNCW){
            // this得指向navigator.clipboard实例
            _writeText.call(navigator.clipboard, text)
            return;
        }
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        _execCommand('copy');
        document.body.removeChild(el);
        console.log('copied:', text);
    };
    const onChangeMode = e =>{
        mode = +e.target.value;
    }
    const onClear = e =>{
        addToBoard('');
        updateBoard();
    }

    // 绑定radio
    let rad = document.myForm.mode;
    for (let i = 0; i < rad.length; i++) {
        rad[i].addEventListener('change', onChangeMode);
    }

    let clearBtn = document.getElementById('clear');
    clearBtn.addEventListener('click', onClear);


    const handleSelectOne = (msg)=>{
        const [issueId,type, ...fullTitle] = msg.split(' ');
        const result = makeCommitMsg(type, issueId, fullTitle.join(''));
        addToBoard(result);
        updateBoard();
        copyText(result);
    }

    const handleAppendOne = (msg)=>{
        const [issueId,type,...fullTitle] = msg.split(' ');
        const result = boardMsg.replace(']',`,${issueId}]`).concat(`,${fullTitle.join('')}`);
        addToBoard(result);
        updateBoard();
        copyText(result);
    }

    const main = (msg) =>{
        console.log('main::',msg);
        const [issueId,type, ...fullTitle] = msg.split(' ');
        // 如果不是我们需要的msg，就不处理
        if(!type){
            return copyText(msg);
        }

        if(mode===1){ // 单选
            handleSelectOne(msg);
        }else if(mode===2){ // 多选
            if(boardMsg==='') handleSelectOne(msg);
            else{
                handleAppendOne(msg);
            }
        }

        setRandomGirl(); // change图片
        setRandomWord();// change文本
    }


})();