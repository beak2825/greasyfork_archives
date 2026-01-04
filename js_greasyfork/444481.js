// ==UserScript==
// @name        DCInside Memo Tool 
// @namespace   Violentmonkey Scripts
// @match       https://gall.dcinside.com/*
// @grant       none
// @version     1.0
// @author      -
// @description DC 메모 툴 알아서 수정해서 쓰세요
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444481/DCInside%20Memo%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/444481/DCInside%20Memo%20Tool.meta.js
// ==/UserScript==
const baseMemos = `
203.226-SK 통피
203.236-SK 통피
211.234-SK 통피
223.32-SK 통피
223.33-SK 통피
223.38-SK 통피
223.39-SK 통피
223.57-SK 통피
223.62-SK 통피

39.7-KT 통피
110.70-KT 통피
175.223-KT 통피
175.252-KT 통피
175.253-KT 통피
211.246-KT 통피
118.235-KT 통피

61.33-LG 통피
61.43-LG 통피
106.101-LG 통피
106.102-LG 통피
117.111-LG 통피
211.36-LG 통피
211.60-LG 통피
`

const redMemos = `
`


const addText = (targetRef, memoContent, color) => {
    var newSpan = document.createElement('span');
    newSpan.innerHTML = memoContent;
    if (color) {
        newSpan.setAttribute('style', "color:"+color)
    }

    targetRef.innerHTML = targetRef.innerHTML + ' - ';
    targetRef.insertAdjacentElement('beforeend', newSpan)
  
}

const modifyIp = (e, memosRaw, color) => {
    var memos = memosRaw.split('\n');
    memos.forEach(function(memo){
        var memoSplit = memo.split('-');
        var ip = memoSplit[0];
        var memoContent = memoSplit[1];
        if(-1 != ip.indexOf(e.getAttribute('data-ip'))){
            var targetRef = e.getElementsByClassName('ip')[0];
            addText(targetRef, memoContent, color)
        }
    });
};


const modifyUid = (e, memosRaw, color) => {
    var memos = memosRaw.split('\n');
    memos.forEach(function(memo){
        var memoSplit = memo.split('-');
        var ip = memoSplit[0];
        var memoContent = memoSplit[1];
        if(-1 != ip.indexOf(e.getAttribute('data-uid'))){
            var targetRef = e.getElementsByClassName('nickname in')[0];
            addText(targetRef, memoContent, color)
        }
    });
};

(function(){
    Array.from(document.getElementsByClassName('ub-writer')).forEach(function(e){
        if(e.getAttribute('data-ip')){
            modifyIp(e, baseMemos);
            modifyIp(e, redMemos, 'red');
        }
        if(e.getAttribute('data-uid')){
            modifyUid(e, baseMemos);
            modifyUid(e, redMemos, 'red');
        }
    });
})();
