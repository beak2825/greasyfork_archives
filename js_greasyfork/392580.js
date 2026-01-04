// ==UserScript==
// @name         Magi-搜索亮色白色-light-white
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Magi搜索亮色，白色 , light theme for magi.com
// @home-url     https://greasyfork.org/zh-CN/scripts/392580-magi-%E6%90%9C%E7%B4%A2%E4%BA%AE%E8%89%B2%E7%99%BD%E8%89%B2-light-white
// @author       Jack.Chan
// @match        *://magi.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392580/Magi-%E6%90%9C%E7%B4%A2%E4%BA%AE%E8%89%B2%E7%99%BD%E8%89%B2-light-white.user.js
// @updateURL https://update.greasyfork.org/scripts/392580/Magi-%E6%90%9C%E7%B4%A2%E4%BA%AE%E8%89%B2%E7%99%BD%E8%89%B2-light-white.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

var cssRules = `

body,
body:before,
#showcase>ul>li>a,
.card[data-type="web"] ul li a{
    background:none;
    background-color:transparent;
}

#header .icon-magi{
    background-color: #4CAF50;
    background-color: #14a2f5;
    padding: 10px;
    background-size: 80%;
    border-radius: 5px;
}

#footer,
.card[data-type="web"]{
    color:#666;
}
body[data-layout="result"]>#curtain{
    background-color:rgba(255,255,255,0.92);
    box-shadow: 0 0 5px 1px #cccbcb;
}
.card[data-type="web"]:hover{
    background-color:#eee;
}
.card[data-type="fact"]{
    color:#666;
    background-color:#f5f5f5;
}
.card[data-type="fact"]>header>div h2{
    color:#333;
}
.card[data-type="fact"]>div>section>header h4{
    color:#666;
}
.card[data-type="fact"]>div>section[data-scope="property"]>div>div{
    color:#666;
    background-color:#eee;
}
.card[data-type="next"],
.card[data-type="fact"]>div>section[data-scope="property"]>div>div>a,
#bibliography ol li a h5{
    color:#666;
}
.card[data-type="suggest"] ul li a,
.card[data-type="next"]{
    background-color:#f5f5f5;
}
#bibliography ol li{
    background: linear-gradient(90deg, #ffffff, rgba(44,44,48,0));
    box-shadow: 0 0 3px 1px #eee;
}
#bibliography ol li:hover{
    background: #fff;
}
.card[data-type="fact"]>header svg{
    background: #fff;
    border-radius: 50%;
}
.gauge>text{
    fill:#000;
}

.card[data-type="web"] h3,
#showcase>ul>li>a h5{
    color: #1a0dab;
    font-size:1.2rem;
}
.card[data-type="web"] h3:hover,
#showcase>ul>li>a:hover h5{
    text-decoration:underline;
}
.card[data-type="web"] cite,
#showcase>ul>li>a cite{
    color: #006621;
}
.card[data-type="web"] a:visited h3,
#showcase>ul>li>a:visited h5{
    color: #609;
}
#showcase>ul>li>div>a{
    color: #1b1b1d;
    background-color:transparent;
}
.fact[data-render=tuple]>dl,
.fact>div{
    background-color:#fff;
}
`;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = cssRules;
    document.head.appendChild(style);

})();