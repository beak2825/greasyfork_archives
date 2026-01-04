// ==UserScript==
// @name         ScombZ-TestReadabler
// @namespace    https://twitter.com/yudai1204
// @version      0.1
// @description  ScombZ内でのテストの異常な使いにくさを、主に画像付きテストにおいてを改善します
// @author       yudai1204
// @match        https://scombz.shibaura-it.ac.jp/lms/course/examination/*
// @icon         https://scombz.shibaura-it.ac.jp/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443665/ScombZ-TestReadabler.user.js
// @updateURL https://update.greasyfork.org/scripts/443665/ScombZ-TestReadabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){

        let button_check = document.getElementById('sidemenuClose');
        let contsize = document.getElementById('pageContents');
        let examimg = document.querySelectorAll('.downloadFile');
        let chead = document.querySelectorAll('.contents-header');
        let img = document.querySelector('.exam-question-img');
        let footer = document.getElementById('page_foot');
        let timer = document.getElementById('examTimer');
        if (button_check) {
                button_check.click();
            }
        if (footer){
                footer.style.visibility = 'hidden';
        }

        for (let i =0;i<chead.length;i++){
            chead[i].style.width = '8%';
            chead[i].style.background = '#f6f6ff';
        }
        if (img){
            for (let i =1;i<examimg.length;i++){
                examimg[i].style.maxHeight = '100vh';
                examimg[i].style.boxShadow= '0 0 1px #000000 ';
            }
            examimg[0].style.maxHeight = '95vh';
            examimg[0].style.maxWidth = '50vw';
            examimg[0].style.position = 'fixed';
            examimg[0].style.right= '1px';
            examimg[0].style.top= '5vh';
            examimg[0].style.boxShadow= '0 0 1px #000000 ';
            if (contsize) {
                contsize.style.width = document.body.clientWidth - examimg[0].clientWidth - 3 + 'px';
            }
            if(timer){
            timer.style.width = document.body.clientWidth - examimg[0].clientWidth + 'px';
            }
        }
    };
})();