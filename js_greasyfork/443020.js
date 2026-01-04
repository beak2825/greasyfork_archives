// ==UserScript==
// @name        iWrite写作平台解除粘贴限制
// @description 解除iWrite写作平台不允许粘贴的限制
// @namespace   https://github.com/MagicMonkey-XK/XKScript
// @version     1.0.1
// @author      MagicMonkey
// @require      https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.min.js
// @include     *//iwrite.unipus.cn/student/toSubmitTask*
// @license GPL
// @run-at            document-start
// @description 2022/4/9 09:05:08
// @downloadURL https://update.greasyfork.org/scripts/443020/iWrite%E5%86%99%E4%BD%9C%E5%B9%B3%E5%8F%B0%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/443020/iWrite%E5%86%99%E4%BD%9C%E5%B9%B3%E5%8F%B0%E8%A7%A3%E9%99%A4%E7%B2%98%E8%B4%B4%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==
let style = `
.start_btn{
outline:0;
border:0;
position:fixed;
top:5px;
left:5px;
padding:12px 20px;
border-radius:10px;
cursor:pointer;
background-color:#fff;
color:#d90609;
font-size:18px;
font-weight:bold;
text-align:center;
box-shadow:0 0 9px #666777
}
.start_btn:active{
outline:0;
border:0;
position:fixed;
top:5px;
left:5px;
padding:12px 20px;
border-radius:10px;
cursor:pointer;
background-color:#fff;
font-size:18px;
font-weight:bold;
text-align:center;
box-shadow:0 0 9px #666777
color: white;
opacity: 0.5;    //这里重要，就是通过这个透明度来设置
        }
`;
//解除限制核心代码
function go(){        
function myEditor_paste(o,html){
return true;
}
UE.getEditor('editor').addListener('beforepaste',myEditor_paste);
console.log('finsh')
}
//创建“一键解除限制”按钮
function createStartButton() {
    $("<style/>").html(style).appendTo($("body"));
    $("<div/>").addClass("Button").insertBefore($("body")); 
    let startButton =  document.createElement("button");
    startButton.setAttribute("id", "startButton");
    startButton.innerText = "一键解除限制";
    startButton.className = "start_btn";
    //添加事件监听
    try {// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click", go, false);
      
    } catch (e) {
        try {// IE8.0及其以下版本
            startButton.attachEvent('onclick', go);
        } catch (e) {// 早期浏览器
            console.log("按钮绑定事件失败")
        }
    }
    //插入节点
    $(".Button").append(startButton)
}
$(document).ready(function () {
  createStartButton();
});