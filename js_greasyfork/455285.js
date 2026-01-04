// ==UserScript==
// @name         【全题型支持】EasyWJX附加-问卷星随机答案填写问卷；速通问卷，可配合EasyWJX使用；问卷星随机填写；问卷星快速填写；
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  EasyWJX附加脚本，随机填写答案，速通问卷
// @author       MelonFish
// @match        https://ks.wjx.top/*/*
// @match        http://ks.wjx.top/*/*
// @match        https://www.wjx.*/*/*
// @match        http://www.wjx.*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @require      https://www.layuicdn.com/layer/layer.js
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/455285/%E3%80%90%E5%85%A8%E9%A2%98%E5%9E%8B%E6%94%AF%E6%8C%81%E3%80%91EasyWJX%E9%99%84%E5%8A%A0-%E9%97%AE%E5%8D%B7%E6%98%9F%E9%9A%8F%E6%9C%BA%E7%AD%94%E6%A1%88%E5%A1%AB%E5%86%99%E9%97%AE%E5%8D%B7%EF%BC%9B%E9%80%9F%E9%80%9A%E9%97%AE%E5%8D%B7%EF%BC%8C%E5%8F%AF%E9%85%8D%E5%90%88EasyWJX%E4%BD%BF%E7%94%A8%EF%BC%9B%E9%97%AE%E5%8D%B7%E6%98%9F%E9%9A%8F%E6%9C%BA%E5%A1%AB%E5%86%99%EF%BC%9B%E9%97%AE%E5%8D%B7%E6%98%9F%E5%BF%AB%E9%80%9F%E5%A1%AB%E5%86%99%EF%BC%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/455285/%E3%80%90%E5%85%A8%E9%A2%98%E5%9E%8B%E6%94%AF%E6%8C%81%E3%80%91EasyWJX%E9%99%84%E5%8A%A0-%E9%97%AE%E5%8D%B7%E6%98%9F%E9%9A%8F%E6%9C%BA%E7%AD%94%E6%A1%88%E5%A1%AB%E5%86%99%E9%97%AE%E5%8D%B7%EF%BC%9B%E9%80%9F%E9%80%9A%E9%97%AE%E5%8D%B7%EF%BC%8C%E5%8F%AF%E9%85%8D%E5%90%88EasyWJX%E4%BD%BF%E7%94%A8%EF%BC%9B%E9%97%AE%E5%8D%B7%E6%98%9F%E9%9A%8F%E6%9C%BA%E5%A1%AB%E5%86%99%EF%BC%9B%E9%97%AE%E5%8D%B7%E6%98%9F%E5%BF%AB%E9%80%9F%E5%A1%AB%E5%86%99%EF%BC%9B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    var randWrite_btn = document.createElement("button"); //创建一个input对象（提示框按钮）
    randWrite_btn.id = "randWrite_btn";
    randWrite_btn.textContent = "随机填写";
    randWrite_btn.style.width = "4rem";
    randWrite_btn.style.height = "2rem";
    randWrite_btn.style.marginLeft = '1rem';
    randWrite_btn.type = 'button';
    randWrite_btn.onclick = function (e){
        writeAnswer()
    }
    $('#toptitle h1').eq(0).append(randWrite_btn)

    function getRandInt(num) {
        return Math.round(Math.random()*num);
    }
    function randomString(length) {
        var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
        return result;
    }

    function writeAnswer() {
        var ans_ls_html = document.querySelectorAll('.field.ui-field-contain');
        // 填写radio
        for (var i=0; i<ans_ls_html.length; i++) {
            var radios = ans_ls_html[i].querySelectorAll('.ui-radio')
            if (radios.length!=0){
                radios[getRandInt(radios.length-1)].click()
            }
        }

        // 填写input
        for (i=0; i<ans_ls_html.length; i++) {
            var input = ans_ls_html[i].querySelector('.ui-input-text input')
            if (input) {
                input.value = randomString(10)
            }
        }

        // 填写checkbox（在上传答案的时候checkbox和radio是一类）
        for (i=0; i<ans_ls_html.length; i++) {
            var checkbox = ans_ls_html[i].querySelectorAll('.ui-checkbox');
            if (checkbox.length!=0){
                for (var j=0; j<checkbox.length; j++) {
                    checkbox[j].click()
                }
            }
        }

        // 填写manyinput
        for (i=0; i<ans_ls_html.length; i++) {
            var original_input_group = ans_ls_html[i].querySelector('.field-label div');
            console.log(original_input_group)
            if (original_input_group) {
                for (var j=0; j<original_input_group.querySelectorAll('.ui-input-text').length; j++) {
                    var randstr = randomString(5)
                    try {
                        original_input_group.querySelectorAll('.ui-input-text')[j].value = randstr
                        original_input_group.querySelectorAll('.textCont')[j].innerText = randstr
                    } catch {}
                }
            }
        }


        // 填写完形填空，虽然这样直接复制上面的代码会很臃肿但是感觉分开可能会好一点，和上面的代码很相似
        for (i=0; i<ans_ls_html.length; i++) {
            var original_input_group = ans_ls_html[i].querySelector('.field-label div');
            if (original_input_group) {
                for (var j=0; j<original_input_group.querySelectorAll('.ui-input-text').length; j++) {
                    var randstr = randomString(1);
                    console.log(randstr)
                    try {
                        original_input_group.querySelectorAll('.ui-input-text')[j].value = randstr;
                        original_input_group.querySelectorAll('.bracket')[j].querySelector('span .selection span span').innerText = randstr;
                    } catch {}
                }
            }
        }
    }
})();