// ==UserScript==
// @name         全局快捷键
// @namespace    mscststs
// @version      0.1
// @description  一个全局快捷键脚本，可以轻松定义自己的全局快捷键
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404459/%E5%85%A8%E5%B1%80%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/404459/%E5%85%A8%E5%B1%80%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 快捷键定义
    // 定义示例: ctrl+p
    // 如果需要阻止浏览器默认事件，可以在前面加上 !
    // value 部分依次为需要调用的函数和所有的参数，用 | 分割
    // 函数可以直接定义在 functionMap 中，否则将会尝试 eval 执行
    // 也就是说, 写成 "alert|123" 和 alert('123') 是一样的
    // 目前支持 ctrl / shift / alt / [一个按键]，必须与定义时的模式一致才会触发，比如定义了 ctrl+p ，则按下 ctrl+shift+p 不会触发
    // 按键的定义参考标准文档 https://www.w3.org/TR/DOM-Level-3-Events-code/#key-alphanumeric-writing-system，或者自己捕获后查看
    const keyMap = {
        // "t":"alert(123)",
        "!ctrl+p":"window.open|https://www.google.com|_blank", // 定义一个打开新标签页的方法，使用了打印快捷键
        "ctrl+alt+p":"window.print", // 用新的按键取代原来的打印快捷键
    }
    const functionMap = {
        "1window.open":(url,strWindowName)=>{
            window.open(url,strWindowName)
        }
    }
    // 字符串不区分大小写比较函数
    function strCompare(a,b){
        return a.toLowerCase() == b.toLowerCase()
    }
    // 该函数用于将定义的快捷键转换成pattern
    function parseKey(key){
        let pattern = {
            ctrlKey:false,
            shiftKey:false,
            altKey:false,
            key:"",
        }
        let prevent = key.indexOf("!")===1
        key = key.replace(/^!/,"").split("+");
        key.forEach(word=>{
            if(strCompare(word,"ctrl")){
                pattern.ctrlKey = true
            }
            else if(strCompare(word,"shift")){
                pattern.shiftKey = true
            }
            else if(strCompare(word,"alt")){
                pattern.altKey = true
            }
            else{
                pattern.key = word
            }
        })
        return {
            pattern,
            prevent
        }
    }
    // 判断 事件是否符合 pattern
    function verify(pattern,e){
        for(let key in pattern){
            if(typeof pattern[key] === "boolean" && pattern[key] !== e[key]){
                return false
            }
            if(typeof pattern[key] === "string" && !strCompare(pattern[key],e[key])){
                return false
            }
        }
        return true
    }
    // 根据key定义去执行函数
    function call(keyDef){
        let [func,...params] = keyMap[keyDef].split("|")
        if(functionMap[func]){
            functionMap[func](...params)
        }else{
            try{
                let f = eval(func);
                if(typeof f === "function"){
                    f(...params)
                }
            }catch(e){
                console.error(e)
            }
        }

    }

    window.addEventListener("keydown",(e)=>{
        //console.log(e)
        for(let keyDef in keyMap){
            let {pattern,prevent} = parseKey(keyDef);
            //console.log(keyDef,pattern,prevent,"test")
            if(verify(pattern,e)){
                if(prevent){
                    e.preventDefault()
                }
                call(keyDef)
                break;
            }
        }
    },true)
})();