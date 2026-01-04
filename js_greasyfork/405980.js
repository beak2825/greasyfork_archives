// ==UserScript==
// @name           Scroll with Mouse Plus
// @name:en        Scroll with Mouse Plus
// @name:zh-CN     Scroll with Mouse Plus
// @namespace      http://userscripts.org/users/86496
// @description:zh-CN 页面随心滚动，无需点击！
// @description:en Scroll a page by simply moving the cursor, without even a click!
// @include        *
// @exclude		   *pan.baidu.com/*
// @grant		   GM_getValue
// @grant		   GM_setValue
// @grant		   GM_addStyle
// @run-at		   document-end
// @author         hzhbest
// @license        GNU GPLv3
// @version        2.11
// @description Scroll a page by simply moving the cursor up and down, without even a click!
// @downloadURL https://update.greasyfork.org/scripts/405980/Scroll%20with%20Mouse%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/405980/Scroll%20with%20Mouse%20Plus.meta.js
// ==/UserScript==

// Original script by Protector one (http://userscripts.org/scripts/show/63593)
// hzhbest modded; -algorithm changed -compatibility improved -flexabiligy:move into the scrollbar to activate and continue scrolling while in the scroll-sensitive zone
// v20: add horizontal scroll support

(function (){

//###Customization: |可自定义的东西：

  //Show the scrolling indicator box or not, "1" to show. | 1－显示提示条，其他－不显示。
var scrollShowIndicator = 1;

  //Set the width of scroll-sensitive zone, "100" as full width, "10" as one tenth.
  // | “滚动触发区”宽度百分比，区间：[0-100]，V为垂直宽度，H为水平宽度；取值100为屏宽／高，0为禁用，10为十分之一屏宽／高。
var VSzoneWidth = 10;
var HSzoneHeight = 20;

  //Set the background of the indicator bar. | 提示条的背景，可以为“rgba(r,g,b,a)”或“#rrggbb[aa]”格式。
var IndicBarBG = "rgba(29,163,63,0.4)";

  //Set the height of "thickness" of the indicator bar. | 提示条的粗细度，单位为像素。
var IndicBarH = 20;

  //Write here the width of the scrollbar (set in display properties) for highest accuracy.
  // | 在下面填写滚动条的宽度（也就是系统“显示属性”中的数字），这样能实现最高精确度。
var ScrollbarWidth = 30;

  //Set a trigger for activation, 1-none, 2-Ctrl key, 3-middle 100px range.
  // | 在下面设置激活条件，1－无，2－按住 Ctrl 键，3－鼠标在页面中间100像素高度范围内。
var activateCond = 1;

  //Set if active on side(s)
  // | 设置是否在某些边启用。
var actOnLeft = false;
var actOnRight = true;
var actOnBottom = true;


//###Customization ends. 请不要更改下面代码。
var VscrollStartSWTM = -1;
var HscrollStartSWTM = -1;
var factor;
var Vbox;
var Hbox;
var VonL = 0;
var VScrollOn = 0;
var HScrollOn = false;

	document.addEventListener('mousemove', function(event) {
        if (document.body.contentEditable == "true") {
            return;
		}
		// sHeight，sWidth：内容高度、宽度
		var sHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
		var sWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
		// var cHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);
		// var cWidth = Math.max(document.body.clientWidth, document.documentElement.clientWidth);
		// wHeight，wWidth：窗口（内容框）高度、宽度
		var wHeight = window.innerHeight;
		var wWidth = window.innerWidth;
		// scrollboxHeight，Width：减去滚动条的滚动范围高度、宽度
		var scrollboxHeight = wHeight - 2 * ScrollbarWidth;
		var scrollboxWidth = wWidth - 2 * ScrollbarWidth;
		// 滚动量
		var delta;

		//console.log("1:","x:",event.clientX,"y:",event.clientY,"h_on",HScrollOn);
		if (sHeight > wHeight) {	// 仅当内容高度大于窗口高度时响应垂直滚动激活
			var shouldActiveL = actOnLeft && event.clientX < ScrollbarWidth;
			var shouldActiveR = actOnRight && event.clientX > wWidth - ScrollbarWidth;
			if (shouldActiveL) {
				VonL = 1;
			} else if (shouldActiveR) {
				VonL = 2;
			}
			if (shouldActiveL || shouldActiveR){
				switch (activateCond) {
					case 1:
						VScrollOn = VonL;
						break;
					case 2:
						if (event.ctrlKey) VScrollOn = VonL;
						break;
					case 3:
						if (event.clientY>wHeight/2-50 && event.clientY<wHeight/2+50) VScrollOn = VonL;
				}
				if (VScrollOn) HScrollOn = false;
			}
			var shouldExitL = VonL == 1 && event.clientX > VSzoneWidth / 100 * wWidth;
			var shouldExitR = VonL == 2 && event.clientX < (1 - VSzoneWidth / 100) * wWidth;
			if (shouldExitL || shouldExitR) VScrollOn = 0;
			if (document.body.contentEditable == "true") VScrollOn = 0;
		}
		if (actOnBottom && sWidth > wWidth) {	// 仅当内容宽度大于窗口宽度时响应水平滚动激活
			if (event.clientY > wHeight - ScrollbarWidth){
				switch (activateCond) {
					case 1:
						HScrollOn = true;
						break;
					case 2:
						if (event.ctrlKey) HScrollOn = true;
						break;
					case 3:
						if (event.clientX>wWidth/2-50 && event.clientX<wWidth/2+50) HScrollOn = true;
				};
				if (HScrollOn) VScrollOn = 0;
			}
			if (event.clientY < ((1-HSzoneHeight/100) * wHeight)) HScrollOn = false;
			if (document.body.contentEditable == "true") HScrollOn = false;
		}
		if (VScrollOn) {
			if (scrollShowIndicator == 1) make_Vbox();
			if (VscrollStartSWTM != -1) {
				factor = (event.ctrlKey) ? 2: sHeight / scrollboxHeight;
                //console.log("w:",sHeight,scrollboxHeight,factor);
				//factor = ((Math.pow(dheightMax / wHeight,1.5)/110) + dheightMax / wHeight);
				//Vbox.innerHTML = wHeight +"|"+scrollboxHeight +"<br />"+dheightMax +"|"+ factor +"<br />"+document.body.scrollTop;
				if (Vbox) {
					Vbox.style.top = (event.clientY - IndicBarH / 2) + 'px';
					Vbox.style.left = VonL == 1 ? "0px" : "unset";
					Vbox.style.right = VonL == 2 ? "0px" : "unset";
				}
				delta = factor * (event.clientY - VscrollStartSWTM);
				document.body.scrollTop += delta;
				document.documentElement.scrollTop += delta;
				if (event.clientY + 20 > wHeight) {
					document.body.scrollTop += (factor * 10);
					document.documentElement.scrollTop += (factor * 10);
				}
				if (event.clientY > 0 && event.clientY < 20) {
					document.body.scrollTop -= (factor * 10);
					document.documentElement.scrollTop -= (factor * 10);
				}
			}
		VscrollStartSWTM = event.clientY;
		} else {
			VscrollStartSWTM = -1;
			if (Vbox) setTimeout(function(){Vbox.style.top = -200 + 'px';},200);
		}
		if (HScrollOn) {
			if (scrollShowIndicator == 1) make_Hbox();
			if (HscrollStartSWTM != -1) {
				factor = (event.ctrlKey) ? 0.5 : sWidth / scrollboxWidth;
                //console.log("w:",sWidth,scrollboxWidth,factor);
				//factor = ((Math.pow(dheightMax / wHeight,1.5)/110) + dheightMax / wHeight);
				if (Hbox) {Hbox.style.left = (event.clientX - IndicBarH/2) + 'px';}
				delta = factor * (event.clientX - HscrollStartSWTM);
				document.body.scrollLeft += delta;
				document.documentElement.scrollLeft += delta;
				if (event.clientX + 20 > wWidth) {
					document.body.scrollLeft += (factor * 10);
					document.documentElement.scrollLeft += (factor * 10);
				}
				if (event.clientX > 0 && event.clientX < 20) {
					document.body.scrollLeft -= (factor * 10);
					document.documentElement.scrollLeft -= (factor * 10);
				}
			}
		HscrollStartSWTM = event.clientX;
		} else {
			HscrollStartSWTM = -1;
			if (Hbox) setTimeout(function(){Hbox.style.left = -200 + 'px';},200);
		}
	},false);
	document.addEventListener('click', function () {
		VScrollOn = 0;
		HScrollOn = false;
	}, false);


    function make_Vbox() {
        if (!Vbox) {
            Vbox = document.createElement("div");
			Vbox.id = "IndicatorVBox";
			var css = "width:" + VSzoneWidth + "%; background:" + IndicBarBG + "; min-height:" + IndicBarH + "px;";
			css += "text-align:center; position: fixed; top: -40px; overflow: hidden; z-index: 9999999; font-family:Arial !important; cursor:ns-resize;";
			Vbox.style = css;
            document.body.appendChild(Vbox);
			Vbox.addEventListener('click',function(){VScrollOn=0;},false);
            return true;
        }
	}
    function make_Hbox() {
        if (!Hbox) {
            Hbox = document.createElement("div");
            Hbox.id = "IndicatorHBox";
            Hbox.style = "height:" + HSzoneHeight +"%;background:" + IndicBarBG + ";min-width:" +IndicBarH + "px;text-align:center;position: fixed; left: -40px; bottom: 0;overflow: hidden; z-index: 9999999;font-family:Arial !important;cursor:ew-resize;";
            document.body.appendChild(Hbox);
			Hbox.addEventListener('click',function(){HScrollOn=false;},false);
            return true;
        }
	}

})();
