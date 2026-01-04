// ==UserScript==
// @name         skip checkcode
// @namespace    http://tampermonkey.net/
// @version      0.101
// @description  skip the checkcode make me happy
// @author       JunYou
// @include      /ecsa.ntcu.edu.tw*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401704/skip%20checkcode.user.js
// @updateURL https://update.greasyfork.org/scripts/401704/skip%20checkcode.meta.js
// ==/UserScript==

(function() {
    'use strict';


    var style = document.createElement("style");
style.type = "text/css";
var text = document.createTextNode(
`
body{
    background-image: url("https://i.imgur.com/4KIjP1q.jpg") !important;
    background-size: cover;
    font-family: 'Noto Sans TC', sans-serif !important;
}
.panel{
    justify-content: center !important;
}
.panel .block:first-child{
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0px 0px 25px rgba(0,0,0,.5) !important;
}
.panel .title{
    background: rgb(125, 165, 200) !important;
}
#login_btn{
    background: rgb(120, 180, 200) !important;
    border: none !important;
    transition: .3s;
}
#login_btn:hover{
    background: rgb(100, 160, 180) !important;
}
#forget_pwd{
    background: #e9e9e9 !important;
    border: none !important;
    transition: .3s;
}
#forget_pwd:hover{
    background: #e2e2e2 !important;
}

@media screen and (max-width: 768px){
    .container-1200{
        width: 100% !important;
    }
    .container-1200 td{
        width: 80% !important;
    }
    .container-1024{
        width: 100% !important;
    }
    .container-1024 .block{
        width: calc(100% - 15px) !important;
    }
}

`);
style.appendChild(text);
var head = document.getElementsByTagName("head")[0];
head.appendChild(style);


//加入思源黑體
var css = document.createElement("link");
css.setAttribute("rel", "stylesheet");
css.setAttribute("type", "text/css");
css.setAttribute("href", "https://fonts.googleapis.com/css?family=Noto+Sans+TC&display=swap");
css.onload = function(){ }
document.getElementsByTagName("head")[0].appendChild(css);


document.getElementById('StartCheck').value = "N";

    var Btns = document.querySelector("#login_btn");
    Btns.removeAttribute ("onclick");
    Btns.setAttribute ("type",'submit');
    document.querySelector('#txtCheckCode').setAttribute('placeholder','小孩子才輸驗證碼')
    document.querySelector('#txtCheckCode').setAttribute('readOnly','true')
    document.querySelector('#ImgCheckCode').remove();
    document.querySelector('.word').remove();
    document.querySelector('.panel .block:last-child').remove();

//跳過驗證
    document.querySelector("#login_btn").onclick= function(){
       document.getElementById('IsLogin').value = 'Y';
       document.getElementById('StartCheck').value = '';
       document.getElementById('ReBuildTheCheckCode').value = '';
       document.myform.action = 'login.aspx';
       document.myform.target = '_self';
       document.myform.submit();
    }

    // Your code here...
})();
