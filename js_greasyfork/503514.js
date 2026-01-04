// ==UserScript==
// @name         油猴3-IMMS美化登录界面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  IMMS美化登录界面
// @author       You
// @match        http://192.168.100.113/pcis/a/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/503514/%E6%B2%B9%E7%8C%B43-IMMS%E7%BE%8E%E5%8C%96%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/503514/%E6%B2%B9%E7%8C%B43-IMMS%E7%BE%8E%E5%8C%96%E7%99%BB%E5%BD%95%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function 按钮() {
    'use strict';
    console.log('加载脚本中');

    // 删除背景图片css
    const linkTags = document.getElementsByTagName('link');
    for (let i = 0; i < linkTags.length; i++) {
        let linkTag = linkTags[i];
        if (linkTags[i].getAttribute('href').includes('/pcis/static/common/common.css')) {
            linkTag.parentNode.removeChild(linkTags[i]);
        }
    }

    /*删除不用元素*/
    const aa = document.querySelector("#loginForm > h4");
    aa.textContent = " login";
    aa.classList.add('login');
    const bb = document.querySelector("body > div > div > div.login-logo")
    bb.style.display = 'none'
    const cc = document.querySelector("body > div > div > div.login-copyright")
    cc.style.display = 'none'

    /*使隐藏属性显示（此条网站已删除）*/
    //const dd=document.querySelector("body > div > div > div.login-box-body > div")
    //dd.className=''

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
    /*动画*/
    @keyframes am1 {
            0% {transform: translateY(0);}
            100% {transform: translateY(-30px);}
        }

    /*修改输入框框架*/
    .login-page .login-box-body {
        margin: 5% auto -197px auto !important;
        height: 500px !important;
        background: rgb(252 140 200 / 50%) !important;
        box-shadow: inset 1px 1px 6px rgba(255,255,255,0.3),2px 2px 10px rgb(255 5 107 / 50%) !important;
        border-radius: 20px !important;
    }
    /*修改输入框，加入important使不受加载影响，绝对执行此样式*/
    .login-page .has-feedback .form-control {
            background: transparent !important;
            border: none !important;
            border-bottom: 2px solid #fff !important;
            width: 80% !important;
            color: #851010 !important;
            font-size: 18px !important;
            margin-left: 34px !important;
            margin-top: 25px !important;
            box-shadow: none !important; /* 鼠标点击不会出现边框 */
    }
    /*修改输入框内placeholder默认文本颜色*/
    .login-page .has-feedback .form-control::placeholder{
            color: #eee;
    }

    /*修改输入框后边小图标*/
    .form-control-feedback {
             top: 3px !important;
    }
:after, :before {
    color: blueviolet !important;
}
    /*修改登录按钮*/
    .login-page .btn {
            border: none !important;
            width: 70px !important;
            height: 70px !important;
            border-radius: 50% !important;
            background: rgba(255,255,255,0.1) !important;
            font-size: 36px !important;
            margin-left: 115px !important;
            margin-top: 82px !important;
            box-shadow: 1px 1px 10px #ab6f82 !important;
            font-family: inherit !important;
            padding: 0px 0px 7px !important;
     }

     /*3个圆形样式*/
     .span1 {
            background: rgb(56 214 239 / 50%) !important;
            border-radius: 50%;
            position: absolute;
            width: 120px;
            height: 120px;
            box-shadow: 1px 1px 24px rgb(15 123 147 / 40%);
            top: 69px;
            left: 510px;
            backdrop-filter: blur(4px);/*模糊下方元素*/
            animation: am1 ease-in-out 3s infinite alternate;
            }
     .span2 {
            background:rgb(239 232 56 / 50%) !important;
            border-radius: 50%;
            position: absolute;
            width: 200px;
            height: 200px;
            box-shadow: 1px 1px 24px rgb(216 224 23 / 52%);
            top: 480px;
            left: 820px;
            backdrop-filter: blur(4px);/*模糊下方元素*/
            animation: am1 ease-in-out 4s infinite alternate;
            }
     .span3 {
            background:rgb(129 253 142 / 70%) !important;
            border-radius: 50%;
            position: absolute;
            width: 60px;
            height: 60px;
            box-shadow: 1px 1px 24px rgb(53 236 22 / 40%);
            top: 150px;
            left: 820px;
            backdrop-filter: blur(4px);/*模糊下方元素*/
            animation: am1 ease-in-out 2.5s 0.5s infinite;
            }
     .span4 {
            background:rgb(62 249 240 / 70%) !important;
            position: absolute;
            width: 800px;
            height: 300px;
            top: 300px;
            left: 100px;
            filter: blur(150px);/*模糊元素*/
            z-index: -1
            }
     .span5 {
            background:rgb(234 108 64 / 70%) !important;
            position: absolute;
            width: 1300px;
            height: 200px;
            top: 100px;
            left: 370px;
            filter: blur(150px);/*模糊元素*/
            z-index: -1
            }
     .login {
            color:#f45fa7 !important;
            font-size: 37px !important;
            margin-left: -136px;
            margin-top: 45px;
            }

      .myimg {
      opacity: 0.5;/*图片透明度*/
      background-image: url(https://www.toopic.cn/public/uploads/image/20200404/20200404182849_78999.jpg);/*http的网址不能用*/
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      position: fixed;
      top: 0px;
      left: 0;
      width: 103%;
      height: 100%;
      z-index: -1
}
     `;

    /*修改按钮文字*/
    const denglu = document.querySelector("#btnSubmit");
    denglu.textContent = "→";

    // 插入3个图形做漂浮物
    const parentElement = document.querySelector('.login-box-body');

    const span1 = document.createElement('span');
    parentElement.insertBefore(span1, parentElement.firstChild);
    const span2 = document.createElement('span');
    parentElement.insertBefore(span2, parentElement.firstChild);
    const span3 = document.createElement('span');
    parentElement.insertBefore(span3, parentElement.firstChild);
     //插入2个图形做模糊背景
    const span4 = document.createElement('span');
    parentElement.appendChild(span4);
    const span5 = document.createElement('span');
    parentElement.appendChild(span5);

    span1.classList.add('span1');
    span2.classList.add('span2');
    span3.classList.add('span3');
    span4.classList.add('span4');
    span5.classList.add('span5');

// 创建一个新的图片元素做背景
// var img = document.createElement('img');
// 获取要添加图片的网页元素
// var targetElement = document.querySelector('body > div > div');
// 将图片元素添加到目标网页元素中
// targetElement.appendChild(img);
// img.classList.add('myimg');

    document.head.appendChild(style);
})();