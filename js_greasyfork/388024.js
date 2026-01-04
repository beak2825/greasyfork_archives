// ==UserScript==
// @name         萌娘一下
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  脚本可以在百度搜索结果页面，“百度一下”按钮的右侧添加一个“萌娘一下”按钮，点击可搜索萌娘百科内容
// @author       You
// @match        *://www.baidu.com/*
// @downloadURL https://update.greasyfork.org/scripts/388024/%E8%90%8C%E5%A8%98%E4%B8%80%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/388024/%E8%90%8C%E5%A8%98%E4%B8%80%E4%B8%8B.meta.js
// ==/UserScript==




(function () {

    window.moebutton = document.createElement('input')
    window.moebutton.setAttribute('style', 'background:#a5e4a5;border-bottom:#228b22;')
    window.moebutton.setAttribute('type', 'button')
    window.moebutton.setAttribute('value', '萌娘一下')
    window.moebutton.setAttribute('class', 'bg s_btn')
    window.moespan = document.createElement('span')
    window.moespan.appendChild(window.moebutton)
    window.moespan.setAttribute('style', 'margin-left:2px;display:none;')
    window.moespan.setAttribute('class', 'bg s_btn_wr')
    document.getElementById('form').appendChild(window.moespan)
    window.moebutton.style.display='none'
    window.moespan.style.display='none'
    window.moebutton.onclick = function () {
        var input = document.getElementById('kw')
        var value = input.value
        window.open('https://zh.moegirl.org/index.php?search=' + value)
    }

    window.seemoegirl = function(){

        if(window.location.href.indexOf("https://www.baidu.com/s?") > -1){
            window.moespan.style.display=''
            window.moebutton.style.display=''
            window.moebutton.value = '萌娘一下'
        }else{
            window.moespan.style.display='none'
            window.moebutton.style.display='none'
        }
        requestAnimationFrame(function(){
            window.seemoegirl()
        })
    }
    window.seemoegirl()



})();