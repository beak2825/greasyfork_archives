// ==UserScript==
// @name         贴吧兽音译者
// @namespace    https://greasyfork.org/zh-CN/scripts/425866
// @version      0.2.1
// @description  适用于贴吧的兽音译者
// @author       rongxiaoxue
// @match        https://tieba.baidu.com/p/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425866/%E8%B4%B4%E5%90%A7%E5%85%BD%E9%9F%B3%E8%AF%91%E8%80%85.user.js
// @updateURL https://update.greasyfork.org/scripts/425866/%E8%B4%B4%E5%90%A7%E5%85%BD%E9%9F%B3%E8%AF%91%E8%80%85.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const beastDictArr = ['嗷', '呜', '啊', '~']

function fromBeast(decoratedBeastStr) {
    let beastStr = decoratedBeastStr.substring(3, decoratedBeastStr.length - 1);
    let unicodeHexStr = ""
    let beastStrArr = beastStr.split("")
    for (let i = 0; i <= (beastStr.length - 2); i += 2) {
        let beastCharStr = ""
        let pos1 = 0
        beastCharStr = beastStrArr[i];
        for (; pos1 <= 3; pos1++) {
            if (beastCharStr == beastDictArr[pos1]) {
                break
            }
        }
        let pos2 = 0
        beastCharStr = beastStrArr[i + 1]
        for (; pos2 <= 3; pos2++) {
            if (beastCharStr == beastDictArr[pos2]) {
                break;
            }
        }
        let k = (pos1 * 4) + pos2;
        let unicodeHexCharValue = k - (parseInt(i / 2) % 0x10);
        if (unicodeHexCharValue < 0) {
            unicodeHexCharValue += 0x10;
        }
        unicodeHexStr += unicodeHexCharValue.toString(16)
    }
    let rawStr = ""
    let start = 0
    let end = 4
    while (end <= unicodeHexStr.length) {
        let charHexStr = unicodeHexStr.substring(start, end);
        let charStr = String.fromCharCode(parseInt("0x" + charHexStr))
        rawStr += charStr
        start += 4
        end += 4
    }
    return rawStr
}
    function tarBeast(s){
        if(s.match(/~呜嗷[~呜嗷啊]*啊/)){
            return s.replace(/~呜嗷[~呜嗷啊]*啊/,fromBeast(s.match(/~呜嗷[~呜嗷啊]*啊/)[0]))
        }else{
            return s
        }
    }
    var node = document.querySelectorAll("div>div>div>div>cc>div.d_post_content.j_d_post_content")
    for(let i=0;i<node.length;i++){
        if(node[i].innerText!=""){
        node[i].innerHTML = tarBeast(node[i].innerHTML)
        }

    }
    // Your code here...
})();