// ==UserScript==
// @name         超星破解
// @description  破解简答题无法粘贴；破解F12无限Debugger；增加超星双击题目自动隐式复制题目内容。更新于【2022年5月11号下午】
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  
// @match        *://*.chaoxing.com/*
// @license      MIT
// @author       sit computer
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444598/%E8%B6%85%E6%98%9F%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/444598/%E8%B6%85%E6%98%9F%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    //1. 更改超星不可粘贴为可粘贴
    function a(){
        for(let ins in UE.instants){
            UE.instants[ins].removeListener('beforepaste', editorPaste);
        }
        //$.toast({type: 'success', content: '已更改为允许粘贴',time:1500});
    }
    setTimeout(a, 3000)
    //2. 添加双击题目隐式自动复制题目到粘贴板
    function copyText(text) {
        let textarea = document.createElement("input");//创建input元素
        const currentFocus = document.activeElement;//当前获得焦点的元素，保存一下
        document.body.appendChild(textarea);//添加元素
        textarea.value = text;
        textarea.focus();

        textarea.setSelectionRange(0, textarea.value.length);//获取光标起始位置到结束位置
        //textarea.select(); 这个是直接选中所有的，效果和上面一样
        try {
            var flag = document.execCommand("copy");//执行复制
        } catch(eo) {
            var flag = false;
        }
        document.body.removeChild(textarea);//删除元素
        currentFocus.focus(); //恢复焦点
        return flag;
    }
    let problems = $(".mark_name")
    for (let i=0; i<problems.length;i++){
        $node = $(problems[i])
        $node.attr("style","cursor:hand")
        //alert(str)
        $node.click(function (){
            str = $(this).text().replace($(this).children("span").text(), "")
            str = str.substr(str.indexOf(".")+2)
            copyText(str)
        })
    }
})();

// 增加破解无限Debugger
var constructorHook = constructor;
Function.prototype.constructor = function(s) {
    if (s == "debugger") {
        return function() {}
    }
    return constructorHook(s);
}