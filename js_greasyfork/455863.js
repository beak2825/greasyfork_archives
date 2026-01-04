// ==UserScript==
// @name         浙农林学生评价
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  浙农林教务系统学生评价
// @author       G
// @match        https://jwxt.zafu.edu.cn/jwglxt/xspjgl/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455863/%E6%B5%99%E5%86%9C%E6%9E%97%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/455863/%E6%B5%99%E5%86%9C%E6%9E%97%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        let btn = document.createElement('button')
        btn.textContent = '点我评价'
        btn.style.width = '100%'
        btn.style.background = '#000'
        btn.style.color = '#fff'
        btn.onclick = function(){
            let groups = document.querySelectorAll('.form-group')
            if(groups.length > 0){
                for(let i = 0; i < groups.length-3; i++){
                    let inputs = groups[i].querySelectorAll('input')
                    if(i == 0) inputs[1].click()
                    else inputs[0].click()
                }
                groups[groups.length-3].querySelector('textarea').innerText = '无'
                groups[groups.length-2].querySelector('textarea').innerText = '无'
                groups[groups.length-1].querySelector('textarea').innerText = '10'
            }else{
                //alert('该教师已完成评价！')
            }
        }
        document.querySelector('.panel').appendChild(btn)
    }
})();