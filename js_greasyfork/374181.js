// ==UserScript==
// @name         switch content editable
// @name:zh      页面可编辑切换
// @supportURL   https://github.com/rectcircle/switch-content-editable
// @namespace    https://github.com/rectcircle/switch-content-editable
// @license      MIT
// @version      1.0.1
// @description         open/close content editable （by alt+e）
// @description:zh      打开或者关闭页面可编辑属性 （通过快捷键alt+e）
// @author       Rectcircle <rectcircle96@gmail.com>
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB6ElEQVRYR+2WsWsUQRjF3zvWzG5wdyUpBUEEwaAoNiaKpZUg19gJgqV/gGLrH3CtnSKWFir2KVQigoUhAbER0QM7447Enb2c92Qh5+1pshfZXdLcdLvfx3u/fTN8O0TNK8tsW8JlCSdInZTwC+AaydVWi/dnZg6uFi1Zl7+kOMvsY4CXSjQFoGNMeIvkIO+rBUBK5rKMLwEs7PGDnhoTXiXZrwUgTe0LEhf3aL7dpnu+H9+sDOCcvQLgWdFcworn8Y7n5fu96WcZTkuDuyTOFfpEts5UBkhT+4jEtZGw3hkTnSWZ7/fYSlP7isSFwstOZQDn7AcAx4eiJNrGRGOJDGu9XrI4GPD18FnCmxoAkg2Ah0YAXDAmfL/TeZAUZdmPZASgz3UAfAcYD0WN0TwZf9vtQDpnfwII8rqEbgMA4RzJjd0Bkk2As1OA2hL4v+Hzb3flM1AZYGvLLvX76JBYrCo2Pg31FmjdDoJwuUyXaWpXSCzVaV7QWvf96NQkgC6Jw80AyPp+/GdG7OSRJzAFmCYwTWCawP4m4FzyEeDRJiahpC9BEB8pHcXO2ScA2k0AkHhgTHSjFGD7b/icxHydEBK+AgfOB0HwqRQgLzrnjkm9h3/d2avwLBvjXSdnu5NE9v9CMomw6fpvQxb8GB6gWFwAAAAASUVORK5CYII=
// @include      *
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/374181/switch%20content%20editable.user.js
// @updateURL https://update.greasyfork.org/scripts/374181/switch%20content%20editable.meta.js
// ==/UserScript==

//创建一个闭包，避免污染外部名字空间
;(function(){
	// 全局变量：记录`s`键是否松开状态
	var s_up = true;
	
	// 常量
	const lockIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAACBElEQVRYR+2WPWsUURSG33fMztxrsrMoCn6gjRD8KtQgtraiVbRTbLSw1EYsLfwBFoLYpIqVaCPWFrFQ0EjQThQFjZXFzBJn7uLuK1PE3Wzi3F12Ail2yjnnPPeZMzPnXmLIy7nmRUnnJBwmdVziHwAfSS4FAefCcGppGCQHTZa0w7nmMwBnS2oE6EEUxTdJdgZhDyQgNXc7p1cApgeBAngRRfVZki1fvldAEp1L3wE86YP1xknMRVF8zVfjFXAuuSxxfi1In6XgujFTi8CKda49I+EhyYO9eUGwbSYMJxfLJLwCeZ4+B3BhFSLhhzH1YySTXrCU7MxzfiCxr3uf942p3xpJIMvSnyT2rEJIXYmixuONoM41ZyU97crqrbWN0yMJ5HnaBhB0IZo2pvFpI6i0ste59nJPt75bGx8YVaD4nf69qiiqT5L8/T9onqfFl18r4hKWrY33Vy2wnWRWIuAAhGOByjrgGySjxr1zYNQFfPXrBPI8OQ/gHsATvuIh4pLwZmICt2u1eGHNyO6HZFnyrX+kDrGQJ1XvjWmcKhVYP3gqXF74ZW28ayww7sC4A+MObPkOFIcNU9386yXpizGNQ569IH1N4szmCOCRMfGNUgHnmpckPdkEgUyqHbXWfi0VKIKtVnK10+EdAEcqECm24gWAd62tv+znbb0DSQVPPBTiL1ANFTDg1xUqAAAAAElFTkSuQmCC";
	const unlockIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB6ElEQVRYR+2WsWsUQRjF3zvWzG5wdyUpBUEEwaAoNiaKpZUg19gJgqV/gGLrH3CtnSKWFir2KVQigoUhAbER0QM7447Enb2c92Qh5+1pshfZXdLcdLvfx3u/fTN8O0TNK8tsW8JlCSdInZTwC+AaydVWi/dnZg6uFi1Zl7+kOMvsY4CXSjQFoGNMeIvkIO+rBUBK5rKMLwEs7PGDnhoTXiXZrwUgTe0LEhf3aL7dpnu+H9+sDOCcvQLgWdFcworn8Y7n5fu96WcZTkuDuyTOFfpEts5UBkhT+4jEtZGw3hkTnSWZ7/fYSlP7isSFwstOZQDn7AcAx4eiJNrGRGOJDGu9XrI4GPD18FnCmxoAkg2Ah0YAXDAmfL/TeZAUZdmPZASgz3UAfAcYD0WN0TwZf9vtQDpnfwII8rqEbgMA4RzJjd0Bkk2As1OA2hL4v+Hzb3flM1AZYGvLLvX76JBYrCo2Pg31FmjdDoJwuUyXaWpXSCzVaV7QWvf96NQkgC6Jw80AyPp+/GdG7OSRJzAFmCYwTWCawP4m4FzyEeDRJiahpC9BEB8pHcXO2ScA2k0AkHhgTHSjFGD7b/icxHydEBK+AgfOB0HwqRQgLzrnjkm9h3/d2avwLBvjXSdnu5NE9v9CMomw6fpvQxb8GB6gWFwAAAAASUVORK5CYII=";

	const lockText = "页面编辑已锁定";
	const unlockText = "页面编辑已解锁";

	//提示窗口
	var tipDiv = document.createElement('div');
	tipDiv.style = 'z-index:200000000;background-color: #272822; color: #F8F8F2; position: fixed; right:40px; top:40px; padding: 10px 20px; font-size: 18px; border-radius: 6px; display: none;'; ;
	var tipInnerDiv = document.createElement('div');
	tipInnerDiv.style = 'height:40px; line-height:40px; text-align:center';
	var iconImg = document.createElement('img');
	iconImg.style = 'vertical-align:middle;'
	iconImg.src = unlockIcon;
	var tipText = document.createElement('span');
	tipText.style = 'vertical-align:middle;margin-left:10px;'
	tipText.textContent = unlockText

	tipDiv.appendChild(tipInnerDiv);
	tipInnerDiv.appendChild(iconImg);
	tipInnerDiv.appendChild(tipText);

	document.body.appendChild(tipDiv);

	//定时器
	var timer=0;

	//显示提示
	function showTips(nowStatus){
		if(nowStatus){
			iconImg.src = unlockIcon;
			tipText.textContent = unlockText;
		} else {
			iconImg.src = lockIcon;
			tipText.textContent = lockText;
		}
		clearTimeout(timer);
		timer = setTimeout(function () {
			tipDiv.style['display'] = 'none';
		}, 3000);
		tipDiv.style['display'] = 'block';

	}

	//切换页面可编辑状态
	function changeContentEditable(){
		var newStatus = document.body.contentEditable=="true"?false:true;
		document.body.contentEditable = newStatus;
		if (newStatus){
			document.body.focus();
		}
		tipDiv.contentEditable = "false";
		showTips(newStatus);
	}

	document.addEventListener('keydown', function (e) {
		if(s_up==true && e.keyCode == 69 && e.altKey){
			changeContentEditable()
			s_up = false;
		}
	});
	document.addEventListener('keyup', function (e) {
		if (s_up == false && e.keyCode == 69) {
			s_up = true;
		}
	});
})()