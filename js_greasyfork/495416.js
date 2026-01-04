// ==UserScript==
// @name         brackets on both sides
// @namespace    http://tampermonkey.net/
// @version      2024-05-19
// @description  add brackets at both sides of highlighted text when select some text and typing brackets. just like some texteditor
// @author       linche0502
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495416/brackets%20on%20both%20sides.user.js
// @updateURL https://update.greasyfork.org/scripts/495416/brackets%20on%20both%20sides.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 選取文字後, 輸入括號改為在選取範圍左右新增括號
    function autoBrackets(targets){
        // targets是query selector text的話就直接搜尋, 尋找元素
        if(typeof(targets) == "string"){
            targets= document.querySelectorAll(targets);
            // 如果targets是單一元素的話, 就加到一個新的array裡, 以便使用forEach(我就懶)
        }else if(Node.prototype.isPrototypeOf(targets)){
            targets=[targets];
        }
        targets.forEach(target => {
            target.addEventListener("keydown", (event) => {
                const BRACKETS= {
                    "Digit9": {true:"()"},
                    "BracketLeft": {true:"{}", false:"[]"},
                    "Quote": {true:'""', false:"''"},
                    "Comma": {true:"<>"}
                };
                // 確認新輸入的內容是括號
                // if(!Object.keys(BRACKETS).includes(event.data)) // input event無法取消預設行為
                if(!(BRACKETS[event.code] && BRACKETS[event.code][event.shiftKey])){
                    return
                }
                // 判斷反白區域是在(input/textarea)或是(contentEditable="false")的元素
                let focusElement= document.activeElement;
                let offset;
                // 反白區域是在(input/textarea)時
                if(["INPUT","TEXTAREA"].includes(focusElement.tagName)){
                    offset= [focusElement.selectionStart, focusElement.selectionEnd];
                    // 先尋找是否有反白的區域
                    if(offset[0] == offset[1]){
                        return;
                    }
                    focusElement.value= focusElement.value.slice(0,offset[0])+
                        BRACKETS[event.code][event.shiftKey][0]+
                        focusElement.value.slice(offset[0],offset[1])+
                        BRACKETS[event.code][event.shiftKey][1]+
                        focusElement.value.slice(offset[1]);
                    // 在更改文字內容後, 反白範圍會自動取消選取, 重新選取
                    offset[0]++; offset[1]++;
                    focusElement.setSelectionRange(offset[0], offset[1]);
                }
                // 反白區域是在(contentEditable="false")的元素時
                else{
                    const selection = window.getSelection()
                    let selectNodes= [selection.anchorNode, selection.focusNode];
                    offset= [selection.anchorOffset, selection.focusOffset];
                    // 先尋找是否有反白的區域
                    if(selectNodes[0]===selectNodes[1] && offset[0]===offset[1]){
                        return;
                    }
                    // 確認開始和結束的點沒有超出target的範圍
                    if (!target.contains(selectNodes[0]) || !target.contains(selectNodes[1])) {
                        return
                    }
                    // 確認anchorNode和focusNode在document中的順序, 以避免從後向前反白時會出錯
                    if((selectNodes[0]===selectNodes[1] && offset[1]<offset[0]) || (selectNodes[0].compareDocumentPosition(selectNodes[1]) & Node.DOCUMENT_POSITION_PRECEDING)){
                        selectNodes= selectNodes.reverse()
                        offset= offset.reverse()
                    }
                    // 尋找兩者所在的共同父元素
                    let checkNode= selectNodes[0];
                    while(true){
                        // 如果現在的checkNode不包含(或不等於)focusNode, 則再向上尋找, 最後checkNode即為anchorNode與focus的共同父元素
                        if(!checkNode.contains(selectNodes[1])){
                            checkNode= checkNode.parentNode;
                            continue;
                        }
                        break;
                    }
                    // 如果共同父元素並不是一個可供編輯或輸入的元素, 或者不在一個可供編輯或輸入的元素之內, 則不進行動作
                    while(true){
                        if(checkNode.contentEditable == "true"){
                            // 將focusElement改為共同父元素, 在之後要處理中文bug的時候會比較快, (即使target設定為整個html, 檢查內容是否有跑掉時, 也只要檢查共同父元素的textContent就好, 不需要檢查整個html)
                            focusElement= checkNode;
                            break
                        }
                        // 多加這一次判斷, 避免在contentEditable=="true"的元素裡面又有contentEditable=="false"的元素時會誤觸
                        if(checkNode.contentEditable == "false"){
                            return
                        }
                        // 向上尋找是否為可供編輯或輸入的元素時, 找到target為止, 不再向上尋找
                        if(target.contains(checkNode) && !target.isEqualNode(checkNode)){
                            checkNode= checkNode.parentNode;
                            continue;
                        }
                        return;
                    }
                    // 在前後插入相對應的括號, 前括號和後括號分兩次個別加入, 以避免分別處在不同元素中時會發生錯誤
                    selectNodes[0].textContent= selectNodes[0].textContent.slice(0,offset[0])+ BRACKETS[event.code][event.shiftKey][0]+ selectNodes[0].textContent.slice(offset[0])
                    offset[0]+= 1;
                    // 在前括號加上去後, 如果後括號的位置也在同一元素之中, 則也會向後偏移
                    offset[1]+= (selectNodes[0].isEqualNode(selectNodes[1]))? 1: 0;
                    selectNodes[1].textContent= selectNodes[1].textContent.slice(0,offset[1])+ BRACKETS[event.code][event.shiftKey][1]+ selectNodes[1].textContent.slice(offset[1])
                    // 在更改文字內容後, 反白範圍會亂掉, 重新選取
                    selection.collapse(selectNodes[0], offset[0]);
                    selection.extend(selectNodes[1], offset[1]);
                }
                event.preventDefault();

                // 中文輸入法時會出錯, ex: a|bc|d +[(] -> a(|bc|)d -> a(()d, 反白的區域也會變成前括號
                if(event.key == "Process"){
                    if(["INPUT","TEXTAREA"].includes(focusElement.tagName)){
                        let newContent= focusElement.value;
                        setTimeout(() => {
                            if(focusElement.value != newContent){
                                document.execCommand('undo');
                                focusElement.setSelectionRange(offset[0], offset[1]);
                            }
                        }, 10)
                    }else{
                        const selection = window.getSelection()
                        let selectNodes = [selection.anchorNode, selection.focusNode];
                        // 這邊的focusElement是反白內容前後錨點的共同父元素, 而不是單純的focusNode了
                        let newContent= focusElement.textContent;
                        setTimeout(() => {
                            if(focusElement.textContent != newContent){
                                document.execCommand('undo');
                                selection.collapse(selectNodes[0], offset[0]);
                                selection.extend(selectNodes[1], offset[1]);
                            }
                        }, 10)
                    }
                }

            })
        })
    }
    autoBrackets("html");
})();