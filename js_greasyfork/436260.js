// ==UserScript==
// @name ZAFU_新版正方教务评教（一键好评）
// @namespace http://tampermonkey.net/
// @version 1.3
// @description 使用方法：打开评教界面，按下Enter
// @author Alkaidcc
// @compatible chrome
// @compatible edge
// @license MIT
// @include *://*.zafu.edu.cn/*
// @run-at document-start
// @require https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436260/ZAFU_%E6%96%B0%E7%89%88%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99%EF%BC%88%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/436260/ZAFU_%E6%96%B0%E7%89%88%E6%AD%A3%E6%96%B9%E6%95%99%E5%8A%A1%E8%AF%84%E6%95%99%EF%BC%88%E4%B8%80%E9%94%AE%E5%A5%BD%E8%AF%84%EF%BC%89.meta.js
// ==/UserScript==

var StudentEvalutionURL = "xspjgl/xspj_cxXspjIndex.html"; // 学生评教页面
//var StudentPersonURL = "xsgrxxwh_cxXsgrxx.html"; // 学生个人信息页面
var StudentLoginURL = "login_slogin.html"; // 学生登入页面
var zhh = '';
var mma = '';
(function () {
    'use strict';
    // 传入index range 返回随机的radio-pjf的index (1*5)+1
    function getRandom(low, high) {
        var line = Math.round(Math.random() * (high - low)) + low;
        return line * 5 + 1
    }

    var windowURL = window.location.href;
    if (windowURL.indexOf(StudentLoginURL) != -1) {
        if (zhh) {
            $(function () {
                $('#yhm').val(zhh);
                $('#mm').val(mma);
            });
        }
    }
    if (windowURL.indexOf(StudentEvalutionURL) != -1) {
        $(document).keydown(function (event) {
            if (event.keyCode == 13) { //13：enter键
                var SelectionOfALl = document.getElementsByClassName("radio-pjf");
                //var num = SelectionOfALl.length;
                var len1 = document.getElementsByClassName('table-xspj')[0].getElementsByTagName('tr').length;
                //console.log(len1);
                var len2 = document.getElementsByClassName('table-xspj')[1].getElementsByTagName('tr').length;
                //console.log(len2);
                //默认五星好评
                for(let i = 0;i< len1*5;i++){
                    if(i % 5 == 0){
                        let select1 = SelectionOfALl[i];
                        select1.checked = true;
                    }
                }
                for (let j = len1 * 5; j < (len1 + len2) * 5; j++)
                {
                    if (j % 5 == 0) {
                        let select2 = SelectionOfALl[j];
                        select2.checked = true;
                    }
                }
                //随机差评
                SelectionOfALl[getRandom(0,len1-1)].checked = true
                SelectionOfALl[getRandom(len1,len1+len2-1)].checked = true;

                var text = document.getElementsByClassName('form-control input-zgpj');
                console.log(text[0].value)
                text[0].value = '无'
                text[1].value = '愿意'
                text[2].value = '80'
                //var button1 = document.getElementById("btn_xspj_bc"); //寻找保存按钮的Id来触发事件
                //button1.click();
            }
        });
    }
})();