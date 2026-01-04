// ==UserScript==
// @name            AC-双击选中或左键拖选高亮，esc取消高亮
// @icon
// @namespace       ntaow.com
// @version         2.6.5
// @include         *
// @copyright       2018, AC
// @description     双击选中高亮 或者 普通选中后按G高亮, esc退出，ctrl切换一次性高亮或者连续高亮
// @note            2025.08.02-V2.6.3 增加按一下ctrl键，可切换一次性高亮或者连续高亮 by zixuan203344
// @note            2025.08.02-V2.6 增加左键拖选高亮,恢复双击高亮,去除选中复制 by 白天
// @note            2020.03.25-V2.5 去除双击,只留快捷键增加esc，优化高亮 by cw2k13
// @note            2018.05.15-V2.4 修复某些分词的问题，现在分词应该足够可以用了
// @note            2018.03.26-V2.3 更新，根据TamperMonkey的函数修复了复制操作的代码
// @note            2018.03.18-V2.2 更新，新增了点击之后复制的效果
// @note            2017.12.06-V2.1 修复一个小bug，导致abc_def高亮出问题，同时优化了以前的移除规则，避免了对原始html的影响-待测试
// @note            2017.11.03-V1.2 修复双击触发的问题以及选中文字的问题
// @note            2017.09.06-V1.1 第一版本
// @grant           GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/544382/AC-%E5%8F%8C%E5%87%BB%E9%80%89%E4%B8%AD%E6%88%96%E5%B7%A6%E9%94%AE%E6%8B%96%E9%80%89%E9%AB%98%E4%BA%AE%EF%BC%8Cesc%E5%8F%96%E6%B6%88%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/544382/AC-%E5%8F%8C%E5%87%BB%E9%80%89%E4%B8%AD%E6%88%96%E5%B7%A6%E9%94%AE%E6%8B%96%E9%80%89%E9%AB%98%E4%BA%AE%EF%BC%8Cesc%E5%8F%96%E6%B6%88%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==
document.addEventListener('dblclick', DoHighLight, false);
//document.addEventListener('click', DoHighLight, false);//单击事件监听器
//document.addEventListener('selectionchange', DoHighLight, false);
document.addEventListener('mouseup', DoHighLight, false);//单击弹起后
document.addEventListener('keyup', DoHighLight, false);
var isDBClickOn = true;
var isClickOn = true;
var isCtrlDown = false;
var enableCharCode = 71;//'G';
var exitHighLight = 27;//esc
var CtrlKey = 17;//Ctrl;
var keySets = new Object();
var counter = 0;
var isInDebug = false;
//显示颜色
//var colorList = ["#FDFF03", "#89c3fa", "#000",'#fff','#2008FE','#4CFF00','#F77F05','#39C061','#7F0AFF','#5097E5'];
//var colorList = ["#FFE082", "#80DEEA", "#B9F6CA", "#FFCCBC", "#E1BEE7", "#F8BBD0", "#81D4FA", "#C8E6C9", "#FFF9C4", "#FFAB91"];
var colorList = ["#FDFF03", "#80DEEA", "#B9F6CA", "#FFCCBC", "#E1BEE7", "#F8BBD0", "#81D4FA", "#C8E6C9", "#FFF9C4", "#FFAB91"];
//文字颜色
var TextcolorList = ["#0000ff", "#ff0000", "#ffff00", "#00ff00", "#0080ff", "#ff0080", "#000000", "#8000ff", "#ff00ff", "#ff8000"];

function DoHighLight(e) {
    setTimeout(function(){
    var target = e.target;
    var selectedText = getSelectedText(target)//.replace(/\s+/g,"");;
    var s_dblclick = (e.type === 'dblclick') && isDBClickOn; // 是双击选中
    var s_Lclick = (e.type === 'mouseup') && isClickOn; // 是单击
    var s_Lclick_Ctrl = (e.type === 'keyup') && (CtrlKey==e.keyCode); // 按下Ctrl键
    var s_keyup = (e.type === 'keyup') && (enableCharCode==e.keyCode);// 是按下特殊按键
    var s_exit = (e.type === 'keyup') && (exitHighLight==e.keyCode);// 是按下esc取消
    if(s_exit){
        return unHighLightAll_Text();
    }
    if(s_Lclick_Ctrl){
        if(isCtrlDown){
            isCtrlDown = false;
        }else{
            isCtrlDown = true;
        }
    }
    if (selectedText ) {//&& getBLen(selectedText) >= 3
        myConsoleLog(selectedText)
        // if (s_Lclick){
        //     doHighLightTextS(selectedText);
        // }else 
        if (s_keyup){
            doHighLightTextS(selectedText);
        }else if (s_dblclick) {
            doHighLightTextS(selectedText);
        }
    }
    })
}
function myConsoleLog(text){
    if(!isInDebug){
        console.log(text);
    }
}
function doHighLightTextS(selectedText) {
    if(!isCtrlDown){
        unHighLightAll_Text();
    }
    myConsoleLog("双击:" + selectedText);
    //下面注释掉，即可去除双击自动复制
    //GM_setClipboard(selectedText);
    initKeySets(selectedText);
    myConsoleLog(keySets.keywords);
    doHighLightAll_CSS();
    doHighLightAll_Text();
}
function getSelectedText(target) {
    function getTextSelection() {
        var selectedText = '';
        if (target.getAttribute("type")) {
            if (target.getAttribute("type").toLowerCase() === "checkbox") return '';
        }
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
        //.split(/\b |[\u0000-\u002F\u003A-\u0040\u005B-\u0060\u007B-\u00FF\uFF00-\uFFFF\u3000-\u303F]/g)
        //去掉下划线
        .split(/\b |[\u0000-\u002F\u003A-\u0040\u005B-\u005E\u0060\u007B-\u00FF\uFF00-\uFFFF\u3000-\u303F]/g)
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
        // keySets.textcolor[i] = "red";
        //keySets.textcolor[i] = "#0000ff";
        keySets.textcolor[i] = TextcolorList[i % TextcolorList.length];
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
    for(var j=0; j < oldTgs.length; j++){
        var curTg = oldTgs[j];
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
            var cNode = childList[i];
            myConsoleLog(cNode.tagName+'--in');
            markChildandRemove(cNode);
            myConsoleLog(cNode.tagName+'--out');
            if(cNode.tagName.toLowerCase() == "thdfrag"){
                myConsoleLog("this?"+cNode.innerHTML);
                cNode.outerHTML = cNode.innerHTML;
            }
        }
        }catch (e){}
}