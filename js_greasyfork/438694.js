// ==UserScript==
// @name GiFPlayer Control CSS
// @namespace https://greasyfork.org/users/3128
// @version 0.0.1.20220117172827
// @description // @require https://greasyfork.org/scripts/438693-gifplayer/code/GifPlayer.js?version=1009492
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/438694/GiFPlayer%20Control%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/438694/GiFPlayer%20Control%20CSS.meta.js
// ==/UserScript==

(function() {
let css = `安装此脚本? 安装为用户样式?
访问作者的支持站点，提问、发表评价，或者 举报此脚本。



ins.play-gif{
    box-sizing:border-box;
    position: absolute;
    top: 50%;
    margin-top: -20px;
    left: 50%;
    margin-left:-20px;
    min-height: 40px;
    min-width: 40px;
    text-align: center;
    background: #222;
    line-height: 34px;
    font-size: 14px;
    text-transform: uppercase;
    color: #fff;
    border-radius: 50%;
    opacity: .9;
    border: 3px solid #fff;
    cursor:pointer;
    text-decoration: none;
}

ins.play-gif:hover{
    opacity:.5;
}

.gifplayer-wrapper{
    position:relative;
}

a.gif-view-full{
    position:absolute;
    right:4px;
    z-index:99;
    font-weight:bold;
}

@media (max-width : 480px) {
    a.gif-view-full{
        display:inline-block !important;
    }
}

.spinner {
    height:25px;
    width:25px;
    margin:0px auto;
    position:absolute;
    top:50%;
    left:50%;
    margin-top:-19px;
    margin-left:-19px;
    -webkit-animation: rotation .6s infinite linear;
    -moz-animation: rotation .6s infinite linear;
    -o-animation: rotation .6s infinite linear;
    animation: rotation .6s infinite linear;
    border-left:6px solid rgba(256,256,256,.15);
    border-right:6px solid rgba(256,256,256,.15);
    border-bottom:6px solid rgba(256,256,256,.15);
    border-top:6px solid rgba(256,256,256,.8);
    border-radius:100%;
}

@-webkit-keyframes rotation {
    from {-webkit-transform: rotate(0deg);}
    to {-webkit-transform: rotate(359deg);}
}

@-moz-keyframes rotation {
    from {-moz-transform: rotate(0deg);}
    to {-moz-transform: rotate(359deg);}
}

@-o-keyframes rotation {
    from {-o-transform: rotate(0deg);}
    to {-o-transform: rotate(359deg);}
}

@keyframes rotation {
    from {transform: rotate(0deg);}
    to {transform: rotate(359deg);}
}

.icon-maximize:before{;
    content: "\\f0b2";
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
