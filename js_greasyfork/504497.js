// ==UserScript==
// @name         To Top
// @namespace    https://github.com/RANSAA
// @version      0.0.1
// @description  一键回到顶部
// @author       sayaDev
// @license      MIT License
// @icon         data:image/png;base64,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

// @match        http://*/*
// @match        *://*/*
// @grant        none


// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera 
// @compatible   safari 

// @noframes
// @downloadURL https://update.greasyfork.org/scripts/504497/To%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/504497/To%20Top.meta.js
// ==/UserScript==
/**
 * 说明:
 * 
 * noframes: 禁止脚本在iframe中运行
 * 
 * compatible：greasyfork.org脚本站点兼容性图标
 * 
 **/ 



//是否开启滚动动画
let toTopAnination = 1;


(function() {
    'use strict';
    addToTopButton();
})();




function addToTopButton(){
	// 首先查询页面上是否存在TKToast元素
    let existingTKToTop = document.querySelector('TKToTop');
    if (existingTKToTop) {
        return;
    }
    //创建style
    addToTopStyle();

    let toTop = createSVGToTop()
    toTop.setAttribute("class","TKToTopStyle");
    //定义的是事件被触发后要做的事情
    toTop.addEventListener("click", function() {
        if (toTopAnination == 1){
            window.scrollTo({left:0,top:0,behavior:'smooth'});
        }else{
            window.scrollTo(0,0);
        }
    });

	// 创建一个包含按钮的DIV元素
	const toToDIV = document.createElement("TKToTop");
	toToDIV.setAttribute("class","TKToTopStyle");
	// 将按钮添加到DIV中
	toToDIV.appendChild(toTop);
	// 添加到body中
	document.body.appendChild(toToDIV);
}

function createSVGToTop()
{
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "44");
    svgElement.setAttribute("height", "44");
    // svgElement.setAttribute("style", "background-color: transparent"); // 设置透明背景色

    // 创建一个<circle>元素
    var circleElement = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circleElement.setAttribute("cx", "22");
    circleElement.setAttribute("cy", "22");
    circleElement.setAttribute("r", "20");
    circleElement.setAttribute("fill", "#1ca7ee");

    // 创建一个<text>元素并设置其属性和样式
    var textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textElement.setAttribute("x", "50%"); // 居中对齐
    textElement.setAttribute("y", "50%");
    textElement.setAttribute("text-anchor", "middle"); // 文本居中对齐
    textElement.setAttribute("dominant-baseline", "middle"); // 文本垂直居中对齐
    textElement.setAttribute("fill", "white");
    textElement.setAttribute("font-size", "14px");
    textElement.setAttribute("font-weight", "700"); // 设置字体粗细
    textElement.style.fontFamily = "Arial"; // 设置字体样式，如果需要的话
    textElement.textContent = "Top";

    // 将<circle>和<text>元素添加到<svg>元素中
    // svgElement.appendChild(circleElement);
    svgElement.appendChild(textElement);

	return svgElement;
}



function addToTopStyle(){
	const style = `
	.TKToTopStyle{
		background: #1ca7ee;
		background-color:  #1ca7ee; 
		color: #ffffff;

		right:  16px;
		bottom: 20px;
		position: fixed;
		z-index: 999999;
	    width:  44px;
	    height: 44px;

	    border: none;
	    cursor: pointer;
	    padding: 0;	

		border: 1px solid;
	    border-color: #1ca7ee;
	    border-radius: 50% ;
		box-shadow: 0px 0px 8px #1ca7ee;	

		margin: 0; /* 确保没有外边距 */
        padding: 0; /* 确保没有内边距 */
        lineHeight: 1; /* 确保行高不影响布局  */
        outline: none; /* 移除可能的外部边框 */
        display: 'block'; /* 设置为块级元素  */  
	}
	.TKToTopStyle:active, 
	.TKToTopStyle:hover{  
		box-shadow: 0px 0px 16px #1ca7ee;	
	}
	`;

	var styleId = "TKToTopStyle";
    // 首先查询页面上是否存在具有给定ID的<style>元素
    var existingStyle = document.getElementById(styleId);
    //如果存在则跳过
    if (existingStyle) {
        return;
    }

	var myStyle = document.createElement("style");
	myStyle.type="text/css";
	myStyle.id = styleId;
	myStyle.innerHTML = style;
	document.head.appendChild(myStyle);
}