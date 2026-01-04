// ==UserScript==
// @name 全局页面样式美化
// @namespace https://greasyfork.org/users/749632
// @version 1.5
// @description 指向文字加粗, 滚动条, 指向图片发光, 输入框美化, 去除下划线。
// @grant GM_addStyle
// @run-at document-start
// @match *://*.*/*
// @downloadURL https://update.greasyfork.org/scripts/423663/%E5%85%A8%E5%B1%80%E9%A1%B5%E9%9D%A2%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/423663/%E5%85%A8%E5%B1%80%E9%A1%B5%E9%9D%A2%E6%A0%B7%E5%BC%8F%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
let css = `
    /*滚动条*/
    ::-webkit-scrollbar{width: 6px;height: 6px;}
    ::-webkit-scrollbar-track-piece{background-color: #CCCCCC;-webkit-border-radius: 6px;}
    ::-webkit-scrollbar-thumb:vertical{height: 5px;background-color: #999999;-webkit-border-radius: 6px;}
    ::-webkit-scrollbar-thumb:horizontal{width: 5px;background-color: #CCCCCC;-webkit-border-radius: 6px;}
    ::-webkit-scrollbar {width: 9px;height: 9px;}
    ::-webkit-scrollbar-track-piece {background-color: transparent;}
    ::-webkit-scrollbar-track-piece:no-button {}
    ::-webkit-scrollbar-thumb {background-color: #3994EF;border-radius: 3px;}
    ::-webkit-scrollbar-thumb:hover {background-color: #1E90FF;}/*A4EEF0*/
    ::-webkit-scrollbar-thumb:active {background-color: #3994EF;}
    ::-webkit-scrollbar-button:vertical { width: 9px; }
    ::-webkit-scrollbar-button:horizontal { width: 9px; }
    ::-webkit-scrollbar-button:vertical:start:decrement { background-color: white; }
    ::-webkit-scrollbar-button:vertical:end:increment { background-color: white; }
    ::-webkit-scrollbar-button:horizontal:start:decrement { background-color: white; }
    ::-webkit-scrollbar-button:horizontal:end:increment { background-color: white; }
    body::-webkit-scrollbar-track-piece {background-color: white;}
    
    /*指向图片绿光*/
    img:hover{box-shadow: 0px 0px 4px 4px rgba(130,190,10,0.6) !important;-webkit-transition-property: box-shadow;-webkit-transition-duration: .31s;}
    img{-webkit-transition-property: box-shadow;-webkit-transition-duration: .31s;}
    
    /*输入框美化*/
    input[type="text"]:focus, input[type="password"]:focus, textarea:focus { 
    outline: 2px solid #4C7CD0 !important; 
    -webkit-box-shadow:0px 0px 0px #4C7CD0 !important;} 
    input[type="checkbox"]:focus,input[type="submit"]:focus,input[type="reset"]:focus, input[type="radio"]:focus { 
    outline: 1px solid #4C7CD0 !important;}
    
    /*去除下划线*/
    a{text-decoration:none!important}
    a:hover{text-decoration:none!important}
    
    
    a{
    /*color: #014A8F;*/
    -webkit-transition-property:color;
    -webkit-transition-duration: 0.0s;
    }
    
    /*指向文字加粗*/
    a:hover{
    /*color: #0000FF;*/
    -webkit-transition-property:color;
    -webkit-transition-duration: 0.0s;
    text-shadow:0em 0em 0.1em !important;/*font-weight:bold解决跳动*/
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
