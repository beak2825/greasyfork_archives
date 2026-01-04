// ==UserScript==
// @name         全删除2.0
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  可以自由删除当前页面的div元素和图片，以及更改文字
// @author       wangkaixuan
// @match        *://*/*
// @grant        none
// @license      Apache
// @downloadURL https://update.greasyfork.org/scripts/462751/%E5%85%A8%E5%88%A0%E9%99%A420.user.js
// @updateURL https://update.greasyfork.org/scripts/462751/%E5%85%A8%E5%88%A0%E9%99%A420.meta.js
// ==/UserScript==

function stopEvt(e) {
    e.stopPropagation();//阻止点击事件向上冒泡
};
var ass = false;
var a = true;
var but = 0;
document.addEventListener("keydown", function(event) {//按alt修改开关状态
    if(a){//使dom只获取一次，避免多次运行浪费资源
        dom()
        a=false;
    }
    if (event.code === 'AltRight') {//使用右边的alt，防止与其他需求冲突
        event.preventDefault()//阻止按下alt的默认事件
        ass = !ass;
        document.body.appendChild(div);//创建
        div.innerHTML = ass?"开启":"关闭";
                setTimeout(function() {
            document.body.removeChild(div);//删除
        }, 1000);
    }
});
function dom (){//封装起来，单击后执行避免网站加载过慢脚本无法获得dom，同时避免了不需要使用删除时依然加载dom浪费资源
    var divshuzu = document.getElementsByTagName("div");
    for (let i of divshuzu) {

        i.addEventListener('mouseover', (event) => {
            // 添加边框发光的样式
            stopEvt(event);
            i.contentEditable = ass ? true : false;//可修改
            if(ass==true){i.style.boxShadow = '0px 0px 2px 3px rgba(200, 0, 0, 0.4)'};
        });
        i.addEventListener('mouseout', () => {
            // 移除边框发光的样式
            i.style.boxShadow = '';
        });
        i.addEventListener('mousedown', function(event) {
            if (event.ctrlKey && (event.button === but) && ass) {
                stopEvt(event);
                this.style.display = "none";
            }
        });
    }
    var imgshuzu1 = document.getElementsByTagName("img");
    var imgshuzu2 = document.getElementsByTagName("a");
    var imgshuzu3 = document.getElementsByTagName("ins");
    let imgArray = Array.from(imgshuzu1);
    let aArray = Array.from(imgshuzu2);
    let insArray = Array.from(imgshuzu3);
    let elements = imgArray.concat(aArray,insArray);
    for (let j of elements) {

        j.addEventListener('mouseover', (event) => {
            // 添加边框发光的样式
            stopEvt(event);
            if(ass==true){j.style.boxShadow = '0px 0px 2px 3px rgba(0, 0, 200, 0.4)'};
        });
        j.addEventListener('mouseout', () => {
            // 移除边框发光的样式
            j.style.boxShadow = '';
        });
        j.addEventListener('mousedown', function(event) {
            if (event.ctrlKey && (event.button === but) & ass) {//win鼠标左右键是0和1，mac本是1和2
                stopEvt(event);
                this.style.display = "none";
            }
        });
    }
}

var userAgent = window.navigator.userAgent;
var platform = window.navigator.platform;
// 判断当前操作系统
if (userAgent.indexOf('Mac') !== -1 || platform.indexOf('Mac') !== -1) {
 // console.log(' Mac 系统');
    but = 1;
} else {
    but = 0;
}

var div = document.createElement('div');
// 设置 div 的样式属性
div.style.position = 'fixed';
div.style.top = '15px';
div.style.left = '15px';
div.style.width = '80px';
div.style.height = '40px';
div.style.zIndex = '999';
div.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
div.style.color = '#fff';
div.style.textAlign = 'center';
div.style.lineHeight = '40px';
div.style.fontWeight ="bold";//字体加粗
div.style.fontSize = "15px";
div.style.borderRadius = '10px';//圆角
//div.style.animation = 'all 1s ease-out forwards';//动画