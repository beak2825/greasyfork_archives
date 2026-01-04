// ==UserScript==
// @name         dd楼回复预处理
// @namespace    http://tampermonkey.net/
// @version      2024-06-20
// @description  班固米dd楼回复预处理
// @author       You
// @match        https://bgm.tv/group/topic/367737
// @match        https://bgm.tv/group/topic/379990
// @match        https://bgm.tv/group/topic/372994
// @match        https://bgm.tv/group/topic/344154
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bgm.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498402/dd%E6%A5%BC%E5%9B%9E%E5%A4%8D%E9%A2%84%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/498402/dd%E6%A5%BC%E5%9B%9E%E5%A4%8D%E9%A2%84%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //回复框
    let textarea = document.querySelector('#content')

    //regx: String.prototype.replace()的第一个参数, 可以是个字符串或 RegExp 对象
    //substitute: String.prototype.replace()的第二个参数, 可以是个字符串或函数
    let parameters = [
        {
            regx: '_哔哩哔哩_bilibili',
            substitute: ''
        },
        {
            regx: /(\/?\?p=\d+)?[&\?]\S+$/,
            substitute: '$1'
        },
        {
            regx: /(\([^\(]*?[字中熟][^\(]*?\))|(（[^（]*?[字中熟][^（]*?）)|(\[[^\[]*?[字中熟][^\[]*?\])|(【[^【]*?[字中熟][^【]*?】)|(「[^「]*?[字中熟][^」]*?」)/,
            substitute: ''
        },
        {
            regx: ' - ',
            substitute: '\n'
        }
    ]

    //事件处理函数 回复框失去焦点时触发
    textarea.addEventListener('blur', () => {
        for(let a of parameters){
            textarea.value = textarea.value.replace(a.regx, a.substitute)
        }
        textarea.value.trim()
    })
})();