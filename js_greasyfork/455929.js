// ==UserScript==
// @name            keyup G to highlight the select word
// @description	    1) `getSelection()` 2)`keyup` G  3)enjoy
// @version         2.4.2
// @match		*://*/*
// @grant           GM_setClipboard
// @namespace https://greasyfork.org/users/35765
// @downloadURL https://update.greasyfork.org/scripts/455929/keyup%20G%20to%20highlight%20the%20select%20word.user.js
// @updateURL https://update.greasyfork.org/scripts/455929/keyup%20G%20to%20highlight%20the%20select%20word.meta.js
// ==/UserScript==
'use strict';
document.addEventListener('keyup', DoHighLight, false);
var isDBClickOn = true;
var enableCharCode = 71		//'G';
// var exitHighLight = 27		//esc
var keySets = new Object();
var counter = 0;
var isInDebug = false;
var colorList = ["#FDFF03", "#89c3fa", "#000",'#fff','#2008FE','#4CFF00','#F77F05','#39C061','#7F0AFF','#5097E5'];
function DoHighLight(e) {
    setTimeout(function(){
    var target = e.target;
    var selectedText = getSelectedText(target);		//.replace(/\s+/g,"")
    var s_dblclick = (e.type === 'dblclick')&&isDBClickOn; // 是双击选中
    var s_keyup = (e.type === 'keyup') && (enableCharCode==e.keyCode &&!!selectedText&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.repeat);// 是按下弹起G
    var s_exit = (e.type === 'keyup') && (27==e.keyCode || enableCharCode==e.keyCode&&!selectedText&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&!e.repeat);	// Esc和G 都可退出
    if(s_exit){
        return unHighLightAll_Text();
    }
    if (selectedText ) {//&& getBLen(selectedText) >= 3
        myConsoleLog(selectedText)
        if (s_keyup){
            doHighLightTextS(selectedText);
        }else if (s_dblclick) {
            doHighLightTextS(selectedText);
        }
    }
    })
}
function myConsoleLog(text){
    if(isInDebug){
        console.log(text);
    }
}
function doHighLightTextS(selectedText) {
    unHighLightAll_Text();
    myConsoleLog("双击:" + selectedText);
    GM_setClipboard(selectedText);
    initKeySets(selectedText);
    myConsoleLog(keySets.keywords);
    doHighLightAll_CSS();
    doHighLightAll_Text();
}
function getSelectedText(target) {
    function getTextSelection() {
        var selectedText = '';
		// 🗣报错 注释
        // if (target.getAttribute("type")) {
        //     if (target.getAttribute("type").toLowerCase() === "checkbox") return '';
        // }
        var value = target.value;
        if (value) {
            var startPos = target.selectionStart;
            var endPos = target.selectionEnd;
            if (!isNaN(startPos) && !isNaN(endPos)) selectedText = value.substring(startPos, endPos);
            return selectedText;
        } else return '';
    }
    var selectedText = window.getSelection().toString();
    if (!selectedText) selectedText = getTextSelection();
    myConsoleLog(selectedText);
    return selectedText;
}
function getBLen(str) {
    if (str == null) return 0;
    if (typeof str != "string"){
        str += "";
    }
    return str.replace(/[^\x00-\xff]/g,"01").length;
}

// 初始化点击的文字信息
function initKeySets(selection){
    // 1.split通过特殊字符和字符边界分割串[非[0-9A-Za-z]特殊字符]
    // 2.通过特定字符连接原始串，
    // 3.1移除多次重复的特定串，非常用串移除，避免空串
    // 3.2移除开头或者结尾的特定串，避免分割后出现空白数据，
    // 4.按特定串分割
    keySets.keywords = selection
        .split(/\b |[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF\uFF00-\uFFFF\u3000-\u303F]/g)
        .join('ACsCA')
        .replace(/[^\u4E00-\u9FA5|0-9|a-z|A-Z_]+/g, "")
        .replace(/(ACsCA){2}/g, "ACsCA")
        .replace(/(^ |ACsCA$)/g, "")
        .split("ACsCA");
    keySets.keywords=keySets.keywords.filter(e=>e)
    keySets.length = keySets.keywords.length;
    keySets.textcolor = new Array();
    // keySets.backcolor = new Array();
    keySets.visible = new Array();
    for(var i=0; i < keySets.keywords.length; i++){
        keySets.textcolor[i] = "red";
        //keySets.backcolor[i] = colorList[i % colorList.length];
        keySets.visible[i] = "true";
    }
}
function doHighLightAll_CSS(){ // 顶部的那一堆数组
    if (keySets.visible[0] == "true"){
        var rule = ".acWHSet{display:inline!important; padding: 2px;border: 1px solid;";
        if (keySets.textcolor.length > 0) rule += "color:"+keySets.textcolor[0]+";";
        // if (keySets.backcolor.length > 0) rule += "background-color:"+keySets.backcolor[0]+";";
        rule += "font-weight:inherit;}";
        for(var i = 0; i < keySets.keywords.length; i++){
            rule += ".acWHSet[data='"+keySets.keywords[i]+"']{background-color:"+colorList[i % colorList.length]+";}";
        }
        var setrule = document.querySelector('style[hlset="acWHSet"]');
        if (!setrule){
            var s = document.createElement("style");
            s.type = "text/css";
            s.setAttribute("hlset", "acWHSet");
            s.appendChild(document.createTextNode(rule));
            document.body.appendChild(s);
        } else {
            setrule.innerHTML = rule;
        }
    }
}
function doHighLightAll_Text(){
    if(keySets.keywords.length == 0) return;
    var patExp = "";
    for(var index=0; index<keySets.keywords.length-1; index++) {
        // if(keySets.keywords)
        patExp += keySets.keywords[index]+"|";
    }
    patExp += keySets.keywords[index];
    var pat = new RegExp("("+patExp+")", "gi");
    var span = document.createElement('thdfrag');
    span.setAttribute("thdcontain","true");
    var snapElements = document.evaluate(
        './/text()[normalize-space() != "" ' +
        'and not(ancestor::style) ' +
        'and not(ancestor::script) ' +
        'and not(ancestor::textarea) ' +
        'and not(ancestor::div[@id="thdtopbar"]) ' +
        'and not(ancestor::div[@id="kwhiedit"]) ' +
        'and not(parent::thdfrag[@txhidy15])]',
        document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    if (!snapElements.snapshotItem(0)) { return; }
    for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
        var node = snapElements.snapshotItem(i);
        if (pat.test(node.nodeValue)) {
            var sp = span.cloneNode(true);
            var repNodeHTML = node.nodeValue.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(pat, '<thdfrag class="THmo acWHSet" txhidy15="acWHSet" data="$1">$1</thdfrag>');
            sp.innerHTML = repNodeHTML;
            node.parentNode.replaceChild(sp, node);
            // try to un-nest containers
            if (sp.parentNode.hasAttribute("thdcontain")) sp.outerHTML = sp.innerHTML;
        }
    }
}
function unHighLightAll_Text(){
    var tgts = document.querySelectorAll('thdfrag[txhidy15="acWHSet"]');
    for (var i=0; i<tgts.length; i++){
        var parnode = tgts[i].parentNode, parpar = parnode.parentNode, tgtspan;
        if (parnode.hasAttribute("thdcontain") && parnode.innerHTML == tgts[i].outerHTML){
            parnode.outerHTML = tgts[i].textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tgtspan = parpar;
        } else {
            tgts[i].outerHTML = tgts[i].textContent.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            tgtspan = parnode;
        }
        tgtspan.normalize(); // 不影响显示，但是影响html内部文字排版---》new 不影响html结果了
        if (tgtspan.hasAttribute("thdcontain")){
            parnode = tgtspan.parentNode;
            if (parnode){
                if (parnode.hasAttribute("thdcontain") && parnode.innerHTML == tgtspan.outerHTML && tgtspan.querySelectorAll('thdfrag[txhidy15]').length == 0){
                    parnode.outerHTML = tgtspan.innerHTML;
                } else if (parnode.innerHTML == tgtspan.outerHTML && tgtspan.querySelectorAll('thdfrag[txhidy15]').length == 0) {
                    parnode.innerHTML = tgtspan.innerHTML;
                }
            }
        }
    }
    var oldTgs = document.querySelectorAll("thdfrag[thdcontain='true']");
    counter = 0;
    for(var i=0; i < oldTgs.length; i++){
        var curTg = oldTgs[i];
        markChildandRemove(curTg);
    }
    myConsoleLog("次数是："+counter);
}
function markChildandRemove(node){
    try{
        if(node.tagName.toLowerCase() == "thdfrag"){
            myConsoleLog("this?"+node.innerHTML);
            node.outerHTML = node.innerHTML;
        }
        var childList = node.childNodes;
        for(var i=0; i < childList.length; i++){
            counter++;
            myConsoleLog(node.tagName+'--prein');
            var node = childList[i];
            myConsoleLog(node.tagName+'--in');
            markChildandRemove(node);
            myConsoleLog(node.tagName+'--out');
            if(node.tagName.toLowerCase() == "thdfrag"){
                myConsoleLog("this?"+node.innerHTML);
                node.outerHTML = node.innerHTML;
            }
        }
        }catch (e){}
}