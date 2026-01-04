// ==UserScript==
// @name         DDG style
// @namespace    https://greasyfork.org/zh-CN/users/292626-eagleqilian
// @version      1.2
// @description  设置duckduckgo主页为mojave主题
// @author       eagle
// @grant        none
// @match    *://duckduckgo.com
// @downloadURL https://update.greasyfork.org/scripts/381937/DDG%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/381937/DDG%20style.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    var logo_a = document.getElementById("logo_homepage_link");
    logo_a.style.cssText='background-image: url("https://duckduckgo.com/assets/logo_homepage.alt.v108.svg");-webkit-filter: opacity(.7);'
    document.body.style.cssText='background:#2b2b2b'
    document.getElementById('search_form_homepage').style.background='#aaa'
    document.getElementById('search_button_homepage').style.color='#e1e1e1'
    //
    //此方法可以区分class相同的不同元素（功能相对齐全，理解起来也相对复杂一些）

function getElementsByClassName( parent,tag,className ){

　　//获取所有父节点下的tag元素
　　var aEls = parent.getElementsByTagName(tag);
　　var arr = [];

　　//循环所有tag元素

　　for (var i = 0; i < aEls.length; i++) {

　　　　//将tag元素所包含的className集合（这里指一个元素可能包含多个class）拆分成数组,赋值给aClassName
　　　　var aClassName = aEls[i].className.split(' ');

　　　　//遍历每个tag元素所包含的每个className

　　　　for (var j = 0; j < aClassName.length; j++) {

　　　　　　//如果符合所选class，添加到arr数组
　　　　　　if(aClassName[j] == className){
　　　　　　　　arr.push(aEls[i]);
　　　　　　　　//如果className里面包含'box' 则跳出循环
　　　　　　　　break;	//防止一个元素出现多次相同的class被添加多次
　　　　　　}
　　　　};
　　};
　　return arr;
}
    var parent = document.getElementById('content_homepage')
    var maxim = getElementsByClassName(parent, 'div', 'tag-home__item')[0]
    var to_remove = getElementsByClassName(maxim, 'span', 'hide--screen-xs')[0]
    maxim.removeChild(to_remove)
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML='.maxim{font-family: Xingkai TC;font-size: 1.2em;transition: .5s;-webkit-writing-mode: vertical-rl;margin: auto;line-height: 3em;letter-spacing: .5em;} .maxim:hover{color: white;filter: drop-shadow(2px 1px 4px #f4e01c);font-weight: bold;}';
    document.getElementsByTagName('HEAD').item(0).appendChild(style);
    maxim.className = 'maxim'
    //maxim.style.cssText='font-family: Xingkai TC;font-size: 1.2em;color: #f4e01c;'
    //maxim.innerHTML='如&nbsp;&nbsp;&nbsp;&nbsp;致&nbsp;&nbsp;&nbsp;&nbsp;万<br>婴&nbsp;&nbsp;&nbsp;&nbsp;中&nbsp;&nbsp;&nbsp;&nbsp;物<br>儿&nbsp;&nbsp;&nbsp;&nbsp;和&nbsp;&nbsp;&nbsp;&nbsp;皆<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;有<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;秩<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;序<br>'
    maxim.innerHTML='万物皆有秩序<br>致中和<br>如婴儿'
    getElementsByClassName(document.body, 'div', 'onboarding-ed')[0].style.display='none'
})();