// ==UserScript==
// @name         直播间键盘控制
// @namespace    mscststs
// @version      0.50
// @description  直播间调节音量进度条
// @author       mscststs
// @include        /https?:\/\/live\.bilibili\.com\/\d/
// @require		https://cdn.bootcss.com/gif.js/0.2.0/gif.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36428/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/36428/%E7%9B%B4%E6%92%AD%E9%97%B4%E9%94%AE%E7%9B%98%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
	'use strict';
	$().ready(function(){
		/* Gif Options */
		var GifRecord = {FPS :10,  //Gif录制帧率
						quality:80, //质量，越低质量愈高
						size:2, // 尺寸，作为原始数据的除数，2代表 原始大小的 1/2
						workers:2, // 可能是协同工作线程数
						des:"低画质" //描述
						};

		var FPScount= 0;
		function setConfig(c){
			if(c=="low"){//低画质
				GifRecord = {FPS :10,
						quality:80,
						size:2,
						workers:2,
						des:"低画质"
						};
			}else if(c=="high"){//高画质,辣鸡电脑就算了
				GifRecord = {FPS :20,
						quality:20,
						size:1,
						workers:4,
						des:"高画质"
						};
			}
		}
		function getDomPlayer(){
			/*	获取video对象	*/
			return $(".bilibili-live-player-video-stream")[0];
		}
		function fake_click(obj) {
		/* 该函数用于解决click事件无法下载东西的尴尬 */
			var ev = document.createEvent("MouseEvents");
			ev.initMouseEvent(
				"click", true, false, window, 0, 0, 0, 0, 0
				, false, false, false, false, 0, null
			);
			obj.dispatchEvent(ev);
		}
		function getMiliSeconds(){//取得毫秒数时间戳
			return (new Date()).valueOf();
		}
		function getStyle(element, property){
			/* 用于获取元素当前的属性 */
			var proValue = null;
			if (!document.defaultView) {
				proValue = element.currentStyle[property];
			} else {
				proValue = document.defaultView.getComputedStyle(element)[property];
			}
			return proValue;
		}
		function AddFrame(ctx/* canvas context */){
			var nTime = getMiliSeconds();
			if((nTime-TimeStep) > 1000/GifRecord.FPS){
				gif.addFrame(ctx, {delay:nTime-TimeStep,copy: true});
				TimeStep = nTime;
				FPScount++;
				SetText(GifRecord.des+"录制中 : 第 " +FPScount+" 帧");
				/*
					帧数计算器
				*/

			}else{
				return;
			}

		}
		function RecordWidth(){
			return getDomPlayer().videoWidth/GifRecord.size;
		}
		function RecordHeight(){
			return getDomPlayer().videoHeight/GifRecord.size;
		}
		function CreatCanvas(){
			/*	该函数返回一个Canvas的唯一句柄	*/
			$("#helper_recorder_canvas").remove();
			var canvas = document.createElement('canvas');
			canvas.id = "helper_recorder_canvas";
			canvas.width = RecordWidth();
			canvas.height = RecordHeight();
			canvas.style.zIndex = 10000;
			canvas.style.left = 0;
			canvas.style.top = 0;
			canvas.style.position = "fixed";
			$("#helper_canvas_container").prepend($(canvas));
			var cont2D = canvas.getContext("2d");
			return {cont2D,canvas};
			//返回Canvas句柄
		}
		var TimeStep; // 保存时间戳
		var gif;// 保存gif句柄
		function CreatGifObject(){
			/* 用于创建gif对象 */
			gif = new GIF({
				width:RecordWidth(),
				height:RecordHeight(),
				workers: GifRecord.workers,  // 同时工作的线程数？猜测，越多渲染越快
				quality: GifRecord.quality, // 数值越高质量越差
				dither:false,
				/* 直接base64编码worker.js，不懂这个库为什么要额外引用这样一个文件 */
				workerScript:"data:text/javascript;base64,Ly8gZ2lmLndvcmtlci5qcyAwLjIuMCAtIGh0dHBzOi8vZ2l0aHViLmNvbS9qbm9yZGJlcmcvZ2lmLmpzCihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09ImZ1bmN0aW9uIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcigiQ2Fubm90IGZpbmQgbW9kdWxlICciK28rIiciKTt0aHJvdyBmLmNvZGU9Ik1PRFVMRV9OT1RfRk9VTkQiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09ImZ1bmN0aW9uIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkoezE6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBOZXVRdWFudD1yZXF1aXJlKCIuL1R5cGVkTmV1UXVhbnQuanMiKTt2YXIgTFpXRW5jb2Rlcj1yZXF1aXJlKCIuL0xaV0VuY29kZXIuanMiKTtmdW5jdGlvbiBCeXRlQXJyYXkoKXt0aGlzLnBhZ2U9LTE7dGhpcy5wYWdlcz1bXTt0aGlzLm5ld1BhZ2UoKX1CeXRlQXJyYXkucGFnZVNpemU9NDA5NjtCeXRlQXJyYXkuY2hhck1hcD17fTtmb3IodmFyIGk9MDtpPDI1NjtpKyspQnl0ZUFycmF5LmNoYXJNYXBbaV09U3RyaW5nLmZyb21DaGFyQ29kZShpKTtCeXRlQXJyYXkucHJvdG90eXBlLm5ld1BhZ2U9ZnVuY3Rpb24oKXt0aGlzLnBhZ2VzWysrdGhpcy5wYWdlXT1uZXcgVWludDhBcnJheShCeXRlQXJyYXkucGFnZVNpemUpO3RoaXMuY3Vyc29yPTB9O0J5dGVBcnJheS5wcm90b3R5cGUuZ2V0RGF0YT1mdW5jdGlvbigpe3ZhciBydj0iIjtmb3IodmFyIHA9MDtwPHRoaXMucGFnZXMubGVuZ3RoO3ArKyl7Zm9yKHZhciBpPTA7aTxCeXRlQXJyYXkucGFnZVNpemU7aSsrKXtydis9Qnl0ZUFycmF5LmNoYXJNYXBbdGhpcy5wYWdlc1twXVtpXV19fXJldHVybiBydn07Qnl0ZUFycmF5LnByb3RvdHlwZS53cml0ZUJ5dGU9ZnVuY3Rpb24odmFsKXtpZih0aGlzLmN1cnNvcj49Qnl0ZUFycmF5LnBhZ2VTaXplKXRoaXMubmV3UGFnZSgpO3RoaXMucGFnZXNbdGhpcy5wYWdlXVt0aGlzLmN1cnNvcisrXT12YWx9O0J5dGVBcnJheS5wcm90b3R5cGUud3JpdGVVVEZCeXRlcz1mdW5jdGlvbihzdHJpbmcpe2Zvcih2YXIgbD1zdHJpbmcubGVuZ3RoLGk9MDtpPGw7aSsrKXRoaXMud3JpdGVCeXRlKHN0cmluZy5jaGFyQ29kZUF0KGkpKX07Qnl0ZUFycmF5LnByb3RvdHlwZS53cml0ZUJ5dGVzPWZ1bmN0aW9uKGFycmF5LG9mZnNldCxsZW5ndGgpe2Zvcih2YXIgbD1sZW5ndGh8fGFycmF5Lmxlbmd0aCxpPW9mZnNldHx8MDtpPGw7aSsrKXRoaXMud3JpdGVCeXRlKGFycmF5W2ldKX07ZnVuY3Rpb24gR0lGRW5jb2Rlcih3aWR0aCxoZWlnaHQpe3RoaXMud2lkdGg9fn53aWR0aDt0aGlzLmhlaWdodD1+fmhlaWdodDt0aGlzLnRyYW5zcGFyZW50PW51bGw7dGhpcy50cmFuc0luZGV4PTA7dGhpcy5yZXBlYXQ9LTE7dGhpcy5kZWxheT0wO3RoaXMuaW1hZ2U9bnVsbDt0aGlzLnBpeGVscz1udWxsO3RoaXMuaW5kZXhlZFBpeGVscz1udWxsO3RoaXMuY29sb3JEZXB0aD1udWxsO3RoaXMuY29sb3JUYWI9bnVsbDt0aGlzLm5ldVF1YW50PW51bGw7dGhpcy51c2VkRW50cnk9bmV3IEFycmF5O3RoaXMucGFsU2l6ZT03O3RoaXMuZGlzcG9zZT0tMTt0aGlzLmZpcnN0RnJhbWU9dHJ1ZTt0aGlzLnNhbXBsZT0xMDt0aGlzLmRpdGhlcj1mYWxzZTt0aGlzLmdsb2JhbFBhbGV0dGU9ZmFsc2U7dGhpcy5vdXQ9bmV3IEJ5dGVBcnJheX1HSUZFbmNvZGVyLnByb3RvdHlwZS5zZXREZWxheT1mdW5jdGlvbihtaWxsaXNlY29uZHMpe3RoaXMuZGVsYXk9TWF0aC5yb3VuZChtaWxsaXNlY29uZHMvMTApfTtHSUZFbmNvZGVyLnByb3RvdHlwZS5zZXRGcmFtZVJhdGU9ZnVuY3Rpb24oZnBzKXt0aGlzLmRlbGF5PU1hdGgucm91bmQoMTAwL2Zwcyl9O0dJRkVuY29kZXIucHJvdG90eXBlLnNldERpc3Bvc2U9ZnVuY3Rpb24oZGlzcG9zYWxDb2RlKXtpZihkaXNwb3NhbENvZGU+PTApdGhpcy5kaXNwb3NlPWRpc3Bvc2FsQ29kZX07R0lGRW5jb2Rlci5wcm90b3R5cGUuc2V0UmVwZWF0PWZ1bmN0aW9uKHJlcGVhdCl7dGhpcy5yZXBlYXQ9cmVwZWF0fTtHSUZFbmNvZGVyLnByb3RvdHlwZS5zZXRUcmFuc3BhcmVudD1mdW5jdGlvbihjb2xvcil7dGhpcy50cmFuc3BhcmVudD1jb2xvcn07R0lGRW5jb2Rlci5wcm90b3R5cGUuYWRkRnJhbWU9ZnVuY3Rpb24oaW1hZ2VEYXRhKXt0aGlzLmltYWdlPWltYWdlRGF0YTt0aGlzLmNvbG9yVGFiPXRoaXMuZ2xvYmFsUGFsZXR0ZSYmdGhpcy5nbG9iYWxQYWxldHRlLnNsaWNlP3RoaXMuZ2xvYmFsUGFsZXR0ZTpudWxsO3RoaXMuZ2V0SW1hZ2VQaXhlbHMoKTt0aGlzLmFuYWx5emVQaXhlbHMoKTtpZih0aGlzLmdsb2JhbFBhbGV0dGU9PT10cnVlKXRoaXMuZ2xvYmFsUGFsZXR0ZT10aGlzLmNvbG9yVGFiO2lmKHRoaXMuZmlyc3RGcmFtZSl7dGhpcy53cml0ZUxTRCgpO3RoaXMud3JpdGVQYWxldHRlKCk7aWYodGhpcy5yZXBlYXQ+PTApe3RoaXMud3JpdGVOZXRzY2FwZUV4dCgpfX10aGlzLndyaXRlR3JhcGhpY0N0cmxFeHQoKTt0aGlzLndyaXRlSW1hZ2VEZXNjKCk7aWYoIXRoaXMuZmlyc3RGcmFtZSYmIXRoaXMuZ2xvYmFsUGFsZXR0ZSl0aGlzLndyaXRlUGFsZXR0ZSgpO3RoaXMud3JpdGVQaXhlbHMoKTt0aGlzLmZpcnN0RnJhbWU9ZmFsc2V9O0dJRkVuY29kZXIucHJvdG90eXBlLmZpbmlzaD1mdW5jdGlvbigpe3RoaXMub3V0LndyaXRlQnl0ZSg1OSl9O0dJRkVuY29kZXIucHJvdG90eXBlLnNldFF1YWxpdHk9ZnVuY3Rpb24ocXVhbGl0eSl7aWYocXVhbGl0eTwxKXF1YWxpdHk9MTt0aGlzLnNhbXBsZT1xdWFsaXR5fTtHSUZFbmNvZGVyLnByb3RvdHlwZS5zZXREaXRoZXI9ZnVuY3Rpb24oZGl0aGVyKXtpZihkaXRoZXI9PT10cnVlKWRpdGhlcj0iRmxveWRTdGVpbmJlcmciO3RoaXMuZGl0aGVyPWRpdGhlcn07R0lGRW5jb2Rlci5wcm90b3R5cGUuc2V0R2xvYmFsUGFsZXR0ZT1mdW5jdGlvbihwYWxldHRlKXt0aGlzLmdsb2JhbFBhbGV0dGU9cGFsZXR0ZX07R0lGRW5jb2Rlci5wcm90b3R5cGUuZ2V0R2xvYmFsUGFsZXR0ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdsb2JhbFBhbGV0dGUmJnRoaXMuZ2xvYmFsUGFsZXR0ZS5zbGljZSYmdGhpcy5nbG9iYWxQYWxldHRlLnNsaWNlKDApfHx0aGlzLmdsb2JhbFBhbGV0dGV9O0dJRkVuY29kZXIucHJvdG90eXBlLndyaXRlSGVhZGVyPWZ1bmN0aW9uKCl7dGhpcy5vdXQud3JpdGVVVEZCeXRlcygiR0lGODlhIil9O0dJRkVuY29kZXIucHJvdG90eXBlLmFuYWx5emVQaXhlbHM9ZnVuY3Rpb24oKXtpZighdGhpcy5jb2xvclRhYil7dGhpcy5uZXVRdWFudD1uZXcgTmV1UXVhbnQodGhpcy5waXhlbHMsdGhpcy5zYW1wbGUpO3RoaXMubmV1UXVhbnQuYnVpbGRDb2xvcm1hcCgpO3RoaXMuY29sb3JUYWI9dGhpcy5uZXVRdWFudC5nZXRDb2xvcm1hcCgpfWlmKHRoaXMuZGl0aGVyKXt0aGlzLmRpdGhlclBpeGVscyh0aGlzLmRpdGhlci5yZXBsYWNlKCItc2VycGVudGluZSIsIiIpLHRoaXMuZGl0aGVyLm1hdGNoKC8tc2VycGVudGluZS8pIT09bnVsbCl9ZWxzZXt0aGlzLmluZGV4UGl4ZWxzKCl9dGhpcy5waXhlbHM9bnVsbDt0aGlzLmNvbG9yRGVwdGg9ODt0aGlzLnBhbFNpemU9NztpZih0aGlzLnRyYW5zcGFyZW50IT09bnVsbCl7dGhpcy50cmFuc0luZGV4PXRoaXMuZmluZENsb3Nlc3QodGhpcy50cmFuc3BhcmVudCx0cnVlKX19O0dJRkVuY29kZXIucHJvdG90eXBlLmluZGV4UGl4ZWxzPWZ1bmN0aW9uKGltZ3Epe3ZhciBuUGl4PXRoaXMucGl4ZWxzLmxlbmd0aC8zO3RoaXMuaW5kZXhlZFBpeGVscz1uZXcgVWludDhBcnJheShuUGl4KTt2YXIgaz0wO2Zvcih2YXIgaj0wO2o8blBpeDtqKyspe3ZhciBpbmRleD10aGlzLmZpbmRDbG9zZXN0UkdCKHRoaXMucGl4ZWxzW2srK10mMjU1LHRoaXMucGl4ZWxzW2srK10mMjU1LHRoaXMucGl4ZWxzW2srK10mMjU1KTt0aGlzLnVzZWRFbnRyeVtpbmRleF09dHJ1ZTt0aGlzLmluZGV4ZWRQaXhlbHNbal09aW5kZXh9fTtHSUZFbmNvZGVyLnByb3RvdHlwZS5kaXRoZXJQaXhlbHM9ZnVuY3Rpb24oa2VybmVsLHNlcnBlbnRpbmUpe3ZhciBrZXJuZWxzPXtGYWxzZUZsb3lkU3RlaW5iZXJnOltbMy84LDEsMF0sWzMvOCwwLDFdLFsyLzgsMSwxXV0sRmxveWRTdGVpbmJlcmc6W1s3LzE2LDEsMF0sWzMvMTYsLTEsMV0sWzUvMTYsMCwxXSxbMS8xNiwxLDFdXSxTdHVja2k6W1s4LzQyLDEsMF0sWzQvNDIsMiwwXSxbMi80MiwtMiwxXSxbNC80MiwtMSwxXSxbOC80MiwwLDFdLFs0LzQyLDEsMV0sWzIvNDIsMiwxXSxbMS80MiwtMiwyXSxbMi80MiwtMSwyXSxbNC80MiwwLDJdLFsyLzQyLDEsMl0sWzEvNDIsMiwyXV0sQXRraW5zb246W1sxLzgsMSwwXSxbMS84LDIsMF0sWzEvOCwtMSwxXSxbMS84LDAsMV0sWzEvOCwxLDFdLFsxLzgsMCwyXV19O2lmKCFrZXJuZWx8fCFrZXJuZWxzW2tlcm5lbF0pe3Rocm93IlVua25vd24gZGl0aGVyaW5nIGtlcm5lbDogIitrZXJuZWx9dmFyIGRzPWtlcm5lbHNba2VybmVsXTt2YXIgaW5kZXg9MCxoZWlnaHQ9dGhpcy5oZWlnaHQsd2lkdGg9dGhpcy53aWR0aCxkYXRhPXRoaXMucGl4ZWxzO3ZhciBkaXJlY3Rpb249c2VycGVudGluZT8tMToxO3RoaXMuaW5kZXhlZFBpeGVscz1uZXcgVWludDhBcnJheSh0aGlzLnBpeGVscy5sZW5ndGgvMyk7Zm9yKHZhciB5PTA7eTxoZWlnaHQ7eSsrKXtpZihzZXJwZW50aW5lKWRpcmVjdGlvbj1kaXJlY3Rpb24qLTE7Zm9yKHZhciB4PWRpcmVjdGlvbj09MT8wOndpZHRoLTEseGVuZD1kaXJlY3Rpb249PTE/d2lkdGg6MDt4IT09eGVuZDt4Kz1kaXJlY3Rpb24pe2luZGV4PXkqd2lkdGgreDt2YXIgaWR4PWluZGV4KjM7dmFyIHIxPWRhdGFbaWR4XTt2YXIgZzE9ZGF0YVtpZHgrMV07dmFyIGIxPWRhdGFbaWR4KzJdO2lkeD10aGlzLmZpbmRDbG9zZXN0UkdCKHIxLGcxLGIxKTt0aGlzLnVzZWRFbnRyeVtpZHhdPXRydWU7dGhpcy5pbmRleGVkUGl4ZWxzW2luZGV4XT1pZHg7aWR4Kj0zO3ZhciByMj10aGlzLmNvbG9yVGFiW2lkeF07dmFyIGcyPXRoaXMuY29sb3JUYWJbaWR4KzFdO3ZhciBiMj10aGlzLmNvbG9yVGFiW2lkeCsyXTt2YXIgZXI9cjEtcjI7dmFyIGVnPWcxLWcyO3ZhciBlYj1iMS1iMjtmb3IodmFyIGk9ZGlyZWN0aW9uPT0xPzA6ZHMubGVuZ3RoLTEsZW5kPWRpcmVjdGlvbj09MT9kcy5sZW5ndGg6MDtpIT09ZW5kO2krPWRpcmVjdGlvbil7dmFyIHgxPWRzW2ldWzFdO3ZhciB5MT1kc1tpXVsyXTtpZih4MSt4Pj0wJiZ4MSt4PHdpZHRoJiZ5MSt5Pj0wJiZ5MSt5PGhlaWdodCl7dmFyIGQ9ZHNbaV1bMF07aWR4PWluZGV4K3gxK3kxKndpZHRoO2lkeCo9MztkYXRhW2lkeF09TWF0aC5tYXgoMCxNYXRoLm1pbigyNTUsZGF0YVtpZHhdK2VyKmQpKTtkYXRhW2lkeCsxXT1NYXRoLm1heCgwLE1hdGgubWluKDI1NSxkYXRhW2lkeCsxXStlZypkKSk7ZGF0YVtpZHgrMl09TWF0aC5tYXgoMCxNYXRoLm1pbigyNTUsZGF0YVtpZHgrMl0rZWIqZCkpfX19fX07R0lGRW5jb2Rlci5wcm90b3R5cGUuZmluZENsb3Nlc3Q9ZnVuY3Rpb24oYyx1c2VkKXtyZXR1cm4gdGhpcy5maW5kQ2xvc2VzdFJHQigoYyYxNjcxMTY4MCk+PjE2LChjJjY1MjgwKT4+OCxjJjI1NSx1c2VkKX07R0lGRW5jb2Rlci5wcm90b3R5cGUuZmluZENsb3Nlc3RSR0I9ZnVuY3Rpb24ocixnLGIsdXNlZCl7aWYodGhpcy5jb2xvclRhYj09PW51bGwpcmV0dXJuLTE7aWYodGhpcy5uZXVRdWFudCYmIXVzZWQpe3JldHVybiB0aGlzLm5ldVF1YW50Lmxvb2t1cFJHQihyLGcsYil9dmFyIGM9YnxnPDw4fHI8PDE2O3ZhciBtaW5wb3M9MDt2YXIgZG1pbj0yNTYqMjU2KjI1Njt2YXIgbGVuPXRoaXMuY29sb3JUYWIubGVuZ3RoO2Zvcih2YXIgaT0wLGluZGV4PTA7aTxsZW47aW5kZXgrKyl7dmFyIGRyPXItKHRoaXMuY29sb3JUYWJbaSsrXSYyNTUpO3ZhciBkZz1nLSh0aGlzLmNvbG9yVGFiW2krK10mMjU1KTt2YXIgZGI9Yi0odGhpcy5jb2xvclRhYltpKytdJjI1NSk7dmFyIGQ9ZHIqZHIrZGcqZGcrZGIqZGI7aWYoKCF1c2VkfHx0aGlzLnVzZWRFbnRyeVtpbmRleF0pJiZkPGRtaW4pe2RtaW49ZDttaW5wb3M9aW5kZXh9fXJldHVybiBtaW5wb3N9O0dJRkVuY29kZXIucHJvdG90eXBlLmdldEltYWdlUGl4ZWxzPWZ1bmN0aW9uKCl7dmFyIHc9dGhpcy53aWR0aDt2YXIgaD10aGlzLmhlaWdodDt0aGlzLnBpeGVscz1uZXcgVWludDhBcnJheSh3KmgqMyk7dmFyIGRhdGE9dGhpcy5pbWFnZTt2YXIgc3JjUG9zPTA7dmFyIGNvdW50PTA7Zm9yKHZhciBpPTA7aTxoO2krKyl7Zm9yKHZhciBqPTA7ajx3O2orKyl7dGhpcy5waXhlbHNbY291bnQrK109ZGF0YVtzcmNQb3MrK107dGhpcy5waXhlbHNbY291bnQrK109ZGF0YVtzcmNQb3MrK107dGhpcy5waXhlbHNbY291bnQrK109ZGF0YVtzcmNQb3MrK107c3JjUG9zKyt9fX07R0lGRW5jb2Rlci5wcm90b3R5cGUud3JpdGVHcmFwaGljQ3RybEV4dD1mdW5jdGlvbigpe3RoaXMub3V0LndyaXRlQnl0ZSgzMyk7dGhpcy5vdXQud3JpdGVCeXRlKDI0OSk7dGhpcy5vdXQud3JpdGVCeXRlKDQpO3ZhciB0cmFuc3AsZGlzcDtpZih0aGlzLnRyYW5zcGFyZW50PT09bnVsbCl7dHJhbnNwPTA7ZGlzcD0wfWVsc2V7dHJhbnNwPTE7ZGlzcD0yfWlmKHRoaXMuZGlzcG9zZT49MCl7ZGlzcD1kaXNwb3NlJjd9ZGlzcDw8PTI7dGhpcy5vdXQud3JpdGVCeXRlKDB8ZGlzcHwwfHRyYW5zcCk7dGhpcy53cml0ZVNob3J0KHRoaXMuZGVsYXkpO3RoaXMub3V0LndyaXRlQnl0ZSh0aGlzLnRyYW5zSW5kZXgpO3RoaXMub3V0LndyaXRlQnl0ZSgwKX07R0lGRW5jb2Rlci5wcm90b3R5cGUud3JpdGVJbWFnZURlc2M9ZnVuY3Rpb24oKXt0aGlzLm91dC53cml0ZUJ5dGUoNDQpO3RoaXMud3JpdGVTaG9ydCgwKTt0aGlzLndyaXRlU2hvcnQoMCk7dGhpcy53cml0ZVNob3J0KHRoaXMud2lkdGgpO3RoaXMud3JpdGVTaG9ydCh0aGlzLmhlaWdodCk7aWYodGhpcy5maXJzdEZyYW1lfHx0aGlzLmdsb2JhbFBhbGV0dGUpe3RoaXMub3V0LndyaXRlQnl0ZSgwKX1lbHNle3RoaXMub3V0LndyaXRlQnl0ZSgxMjh8MHwwfDB8dGhpcy5wYWxTaXplKX19O0dJRkVuY29kZXIucHJvdG90eXBlLndyaXRlTFNEPWZ1bmN0aW9uKCl7dGhpcy53cml0ZVNob3J0KHRoaXMud2lkdGgpO3RoaXMud3JpdGVTaG9ydCh0aGlzLmhlaWdodCk7dGhpcy5vdXQud3JpdGVCeXRlKDEyOHwxMTJ8MHx0aGlzLnBhbFNpemUpO3RoaXMub3V0LndyaXRlQnl0ZSgwKTt0aGlzLm91dC53cml0ZUJ5dGUoMCl9O0dJRkVuY29kZXIucHJvdG90eXBlLndyaXRlTmV0c2NhcGVFeHQ9ZnVuY3Rpb24oKXt0aGlzLm91dC53cml0ZUJ5dGUoMzMpO3RoaXMub3V0LndyaXRlQnl0ZSgyNTUpO3RoaXMub3V0LndyaXRlQnl0ZSgxMSk7dGhpcy5vdXQud3JpdGVVVEZCeXRlcygiTkVUU0NBUEUyLjAiKTt0aGlzLm91dC53cml0ZUJ5dGUoMyk7dGhpcy5vdXQud3JpdGVCeXRlKDEpO3RoaXMud3JpdGVTaG9ydCh0aGlzLnJlcGVhdCk7dGhpcy5vdXQud3JpdGVCeXRlKDApfTtHSUZFbmNvZGVyLnByb3RvdHlwZS53cml0ZVBhbGV0dGU9ZnVuY3Rpb24oKXt0aGlzLm91dC53cml0ZUJ5dGVzKHRoaXMuY29sb3JUYWIpO3ZhciBuPTMqMjU2LXRoaXMuY29sb3JUYWIubGVuZ3RoO2Zvcih2YXIgaT0wO2k8bjtpKyspdGhpcy5vdXQud3JpdGVCeXRlKDApfTtHSUZFbmNvZGVyLnByb3RvdHlwZS53cml0ZVNob3J0PWZ1bmN0aW9uKHBWYWx1ZSl7dGhpcy5vdXQud3JpdGVCeXRlKHBWYWx1ZSYyNTUpO3RoaXMub3V0LndyaXRlQnl0ZShwVmFsdWU+PjgmMjU1KX07R0lGRW5jb2Rlci5wcm90b3R5cGUud3JpdGVQaXhlbHM9ZnVuY3Rpb24oKXt2YXIgZW5jPW5ldyBMWldFbmNvZGVyKHRoaXMud2lkdGgsdGhpcy5oZWlnaHQsdGhpcy5pbmRleGVkUGl4ZWxzLHRoaXMuY29sb3JEZXB0aCk7ZW5jLmVuY29kZSh0aGlzLm91dCl9O0dJRkVuY29kZXIucHJvdG90eXBlLnN0cmVhbT1mdW5jdGlvbigpe3JldHVybiB0aGlzLm91dH07bW9kdWxlLmV4cG9ydHM9R0lGRW5jb2Rlcn0seyIuL0xaV0VuY29kZXIuanMiOjIsIi4vVHlwZWROZXVRdWFudC5qcyI6M31dLDI6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBFT0Y9LTE7dmFyIEJJVFM9MTI7dmFyIEhTSVpFPTUwMDM7dmFyIG1hc2tzPVswLDEsMyw3LDE1LDMxLDYzLDEyNywyNTUsNTExLDEwMjMsMjA0Nyw0MDk1LDgxOTEsMTYzODMsMzI3NjcsNjU1MzVdO2Z1bmN0aW9uIExaV0VuY29kZXIod2lkdGgsaGVpZ2h0LHBpeGVscyxjb2xvckRlcHRoKXt2YXIgaW5pdENvZGVTaXplPU1hdGgubWF4KDIsY29sb3JEZXB0aCk7dmFyIGFjY3VtPW5ldyBVaW50OEFycmF5KDI1Nik7dmFyIGh0YWI9bmV3IEludDMyQXJyYXkoSFNJWkUpO3ZhciBjb2RldGFiPW5ldyBJbnQzMkFycmF5KEhTSVpFKTt2YXIgY3VyX2FjY3VtLGN1cl9iaXRzPTA7dmFyIGFfY291bnQ7dmFyIGZyZWVfZW50PTA7dmFyIG1heGNvZGU7dmFyIGNsZWFyX2ZsZz1mYWxzZTt2YXIgZ19pbml0X2JpdHMsQ2xlYXJDb2RlLEVPRkNvZGU7ZnVuY3Rpb24gY2hhcl9vdXQoYyxvdXRzKXthY2N1bVthX2NvdW50KytdPWM7aWYoYV9jb3VudD49MjU0KWZsdXNoX2NoYXIob3V0cyl9ZnVuY3Rpb24gY2xfYmxvY2sob3V0cyl7Y2xfaGFzaChIU0laRSk7ZnJlZV9lbnQ9Q2xlYXJDb2RlKzI7Y2xlYXJfZmxnPXRydWU7b3V0cHV0KENsZWFyQ29kZSxvdXRzKX1mdW5jdGlvbiBjbF9oYXNoKGhzaXplKXtmb3IodmFyIGk9MDtpPGhzaXplOysraSlodGFiW2ldPS0xfWZ1bmN0aW9uIGNvbXByZXNzKGluaXRfYml0cyxvdXRzKXt2YXIgZmNvZGUsYyxpLGVudCxkaXNwLGhzaXplX3JlZyxoc2hpZnQ7Z19pbml0X2JpdHM9aW5pdF9iaXRzO2NsZWFyX2ZsZz1mYWxzZTtuX2JpdHM9Z19pbml0X2JpdHM7bWF4Y29kZT1NQVhDT0RFKG5fYml0cyk7Q2xlYXJDb2RlPTE8PGluaXRfYml0cy0xO0VPRkNvZGU9Q2xlYXJDb2RlKzE7ZnJlZV9lbnQ9Q2xlYXJDb2RlKzI7YV9jb3VudD0wO2VudD1uZXh0UGl4ZWwoKTtoc2hpZnQ9MDtmb3IoZmNvZGU9SFNJWkU7ZmNvZGU8NjU1MzY7ZmNvZGUqPTIpKytoc2hpZnQ7aHNoaWZ0PTgtaHNoaWZ0O2hzaXplX3JlZz1IU0laRTtjbF9oYXNoKGhzaXplX3JlZyk7b3V0cHV0KENsZWFyQ29kZSxvdXRzKTtvdXRlcl9sb29wOndoaWxlKChjPW5leHRQaXhlbCgpKSE9RU9GKXtmY29kZT0oYzw8QklUUykrZW50O2k9Yzw8aHNoaWZ0XmVudDtpZihodGFiW2ldPT09ZmNvZGUpe2VudD1jb2RldGFiW2ldO2NvbnRpbnVlfWVsc2UgaWYoaHRhYltpXT49MCl7ZGlzcD1oc2l6ZV9yZWctaTtpZihpPT09MClkaXNwPTE7ZG97aWYoKGktPWRpc3ApPDApaSs9aHNpemVfcmVnO2lmKGh0YWJbaV09PT1mY29kZSl7ZW50PWNvZGV0YWJbaV07Y29udGludWUgb3V0ZXJfbG9vcH19d2hpbGUoaHRhYltpXT49MCl9b3V0cHV0KGVudCxvdXRzKTtlbnQ9YztpZihmcmVlX2VudDwxPDxCSVRTKXtjb2RldGFiW2ldPWZyZWVfZW50Kys7aHRhYltpXT1mY29kZX1lbHNle2NsX2Jsb2NrKG91dHMpfX1vdXRwdXQoZW50LG91dHMpO291dHB1dChFT0ZDb2RlLG91dHMpfWZ1bmN0aW9uIGVuY29kZShvdXRzKXtvdXRzLndyaXRlQnl0ZShpbml0Q29kZVNpemUpO3JlbWFpbmluZz13aWR0aCpoZWlnaHQ7Y3VyUGl4ZWw9MDtjb21wcmVzcyhpbml0Q29kZVNpemUrMSxvdXRzKTtvdXRzLndyaXRlQnl0ZSgwKX1mdW5jdGlvbiBmbHVzaF9jaGFyKG91dHMpe2lmKGFfY291bnQ+MCl7b3V0cy53cml0ZUJ5dGUoYV9jb3VudCk7b3V0cy53cml0ZUJ5dGVzKGFjY3VtLDAsYV9jb3VudCk7YV9jb3VudD0wfX1mdW5jdGlvbiBNQVhDT0RFKG5fYml0cyl7cmV0dXJuKDE8PG5fYml0cyktMX1mdW5jdGlvbiBuZXh0UGl4ZWwoKXtpZihyZW1haW5pbmc9PT0wKXJldHVybiBFT0Y7LS1yZW1haW5pbmc7dmFyIHBpeD1waXhlbHNbY3VyUGl4ZWwrK107cmV0dXJuIHBpeCYyNTV9ZnVuY3Rpb24gb3V0cHV0KGNvZGUsb3V0cyl7Y3VyX2FjY3VtJj1tYXNrc1tjdXJfYml0c107aWYoY3VyX2JpdHM+MCljdXJfYWNjdW18PWNvZGU8PGN1cl9iaXRzO2Vsc2UgY3VyX2FjY3VtPWNvZGU7Y3VyX2JpdHMrPW5fYml0czt3aGlsZShjdXJfYml0cz49OCl7Y2hhcl9vdXQoY3VyX2FjY3VtJjI1NSxvdXRzKTtjdXJfYWNjdW0+Pj04O2N1cl9iaXRzLT04fWlmKGZyZWVfZW50Pm1heGNvZGV8fGNsZWFyX2ZsZyl7aWYoY2xlYXJfZmxnKXttYXhjb2RlPU1BWENPREUobl9iaXRzPWdfaW5pdF9iaXRzKTtjbGVhcl9mbGc9ZmFsc2V9ZWxzZXsrK25fYml0cztpZihuX2JpdHM9PUJJVFMpbWF4Y29kZT0xPDxCSVRTO2Vsc2UgbWF4Y29kZT1NQVhDT0RFKG5fYml0cyl9fWlmKGNvZGU9PUVPRkNvZGUpe3doaWxlKGN1cl9iaXRzPjApe2NoYXJfb3V0KGN1cl9hY2N1bSYyNTUsb3V0cyk7Y3VyX2FjY3VtPj49ODtjdXJfYml0cy09OH1mbHVzaF9jaGFyKG91dHMpfX10aGlzLmVuY29kZT1lbmNvZGV9bW9kdWxlLmV4cG9ydHM9TFpXRW5jb2Rlcn0se31dLDM6W2Z1bmN0aW9uKHJlcXVpcmUsbW9kdWxlLGV4cG9ydHMpe3ZhciBuY3ljbGVzPTEwMDt2YXIgbmV0c2l6ZT0yNTY7dmFyIG1heG5ldHBvcz1uZXRzaXplLTE7dmFyIG5ldGJpYXNzaGlmdD00O3ZhciBpbnRiaWFzc2hpZnQ9MTY7dmFyIGludGJpYXM9MTw8aW50Ymlhc3NoaWZ0O3ZhciBnYW1tYXNoaWZ0PTEwO3ZhciBnYW1tYT0xPDxnYW1tYXNoaWZ0O3ZhciBiZXRhc2hpZnQ9MTA7dmFyIGJldGE9aW50Ymlhcz4+YmV0YXNoaWZ0O3ZhciBiZXRhZ2FtbWE9aW50Ymlhczw8Z2FtbWFzaGlmdC1iZXRhc2hpZnQ7dmFyIGluaXRyYWQ9bmV0c2l6ZT4+Mzt2YXIgcmFkaXVzYmlhc3NoaWZ0PTY7dmFyIHJhZGl1c2JpYXM9MTw8cmFkaXVzYmlhc3NoaWZ0O3ZhciBpbml0cmFkaXVzPWluaXRyYWQqcmFkaXVzYmlhczt2YXIgcmFkaXVzZGVjPTMwO3ZhciBhbHBoYWJpYXNzaGlmdD0xMDt2YXIgaW5pdGFscGhhPTE8PGFscGhhYmlhc3NoaWZ0O3ZhciBhbHBoYWRlYzt2YXIgcmFkYmlhc3NoaWZ0PTg7dmFyIHJhZGJpYXM9MTw8cmFkYmlhc3NoaWZ0O3ZhciBhbHBoYXJhZGJzaGlmdD1hbHBoYWJpYXNzaGlmdCtyYWRiaWFzc2hpZnQ7dmFyIGFscGhhcmFkYmlhcz0xPDxhbHBoYXJhZGJzaGlmdDt2YXIgcHJpbWUxPTQ5OTt2YXIgcHJpbWUyPTQ5MTt2YXIgcHJpbWUzPTQ4Nzt2YXIgcHJpbWU0PTUwMzt2YXIgbWlucGljdHVyZWJ5dGVzPTMqcHJpbWU0O2Z1bmN0aW9uIE5ldVF1YW50KHBpeGVscyxzYW1wbGVmYWMpe3ZhciBuZXR3b3JrO3ZhciBuZXRpbmRleDt2YXIgYmlhczt2YXIgZnJlcTt2YXIgcmFkcG93ZXI7ZnVuY3Rpb24gaW5pdCgpe25ldHdvcms9W107bmV0aW5kZXg9bmV3IEludDMyQXJyYXkoMjU2KTtiaWFzPW5ldyBJbnQzMkFycmF5KG5ldHNpemUpO2ZyZXE9bmV3IEludDMyQXJyYXkobmV0c2l6ZSk7cmFkcG93ZXI9bmV3IEludDMyQXJyYXkobmV0c2l6ZT4+Myk7dmFyIGksdjtmb3IoaT0wO2k8bmV0c2l6ZTtpKyspe3Y9KGk8PG5ldGJpYXNzaGlmdCs4KS9uZXRzaXplO25ldHdvcmtbaV09bmV3IEZsb2F0NjRBcnJheShbdix2LHYsMF0pO2ZyZXFbaV09aW50Ymlhcy9uZXRzaXplO2JpYXNbaV09MH19ZnVuY3Rpb24gdW5iaWFzbmV0KCl7Zm9yKHZhciBpPTA7aTxuZXRzaXplO2krKyl7bmV0d29ya1tpXVswXT4+PW5ldGJpYXNzaGlmdDtuZXR3b3JrW2ldWzFdPj49bmV0Ymlhc3NoaWZ0O25ldHdvcmtbaV1bMl0+Pj1uZXRiaWFzc2hpZnQ7bmV0d29ya1tpXVszXT1pfX1mdW5jdGlvbiBhbHRlcnNpbmdsZShhbHBoYSxpLGIsZyxyKXtuZXR3b3JrW2ldWzBdLT1hbHBoYSoobmV0d29ya1tpXVswXS1iKS9pbml0YWxwaGE7bmV0d29ya1tpXVsxXS09YWxwaGEqKG5ldHdvcmtbaV1bMV0tZykvaW5pdGFscGhhO25ldHdvcmtbaV1bMl0tPWFscGhhKihuZXR3b3JrW2ldWzJdLXIpL2luaXRhbHBoYX1mdW5jdGlvbiBhbHRlcm5laWdoKHJhZGl1cyxpLGIsZyxyKXt2YXIgbG89TWF0aC5hYnMoaS1yYWRpdXMpO3ZhciBoaT1NYXRoLm1pbihpK3JhZGl1cyxuZXRzaXplKTt2YXIgaj1pKzE7dmFyIGs9aS0xO3ZhciBtPTE7dmFyIHAsYTt3aGlsZShqPGhpfHxrPmxvKXthPXJhZHBvd2VyW20rK107aWYoajxoaSl7cD1uZXR3b3JrW2orK107cFswXS09YSoocFswXS1iKS9hbHBoYXJhZGJpYXM7cFsxXS09YSoocFsxXS1nKS9hbHBoYXJhZGJpYXM7cFsyXS09YSoocFsyXS1yKS9hbHBoYXJhZGJpYXN9aWYoaz5sbyl7cD1uZXR3b3JrW2stLV07cFswXS09YSoocFswXS1iKS9hbHBoYXJhZGJpYXM7cFsxXS09YSoocFsxXS1nKS9hbHBoYXJhZGJpYXM7cFsyXS09YSoocFsyXS1yKS9hbHBoYXJhZGJpYXN9fX1mdW5jdGlvbiBjb250ZXN0KGIsZyxyKXt2YXIgYmVzdGQ9figxPDwzMSk7dmFyIGJlc3RiaWFzZD1iZXN0ZDt2YXIgYmVzdHBvcz0tMTt2YXIgYmVzdGJpYXNwb3M9YmVzdHBvczt2YXIgaSxuLGRpc3QsYmlhc2Rpc3QsYmV0YWZyZXE7Zm9yKGk9MDtpPG5ldHNpemU7aSsrKXtuPW5ldHdvcmtbaV07ZGlzdD1NYXRoLmFicyhuWzBdLWIpK01hdGguYWJzKG5bMV0tZykrTWF0aC5hYnMoblsyXS1yKTtpZihkaXN0PGJlc3RkKXtiZXN0ZD1kaXN0O2Jlc3Rwb3M9aX1iaWFzZGlzdD1kaXN0LShiaWFzW2ldPj5pbnRiaWFzc2hpZnQtbmV0Ymlhc3NoaWZ0KTtpZihiaWFzZGlzdDxiZXN0Ymlhc2Qpe2Jlc3RiaWFzZD1iaWFzZGlzdDtiZXN0Ymlhc3Bvcz1pfWJldGFmcmVxPWZyZXFbaV0+PmJldGFzaGlmdDtmcmVxW2ldLT1iZXRhZnJlcTtiaWFzW2ldKz1iZXRhZnJlcTw8Z2FtbWFzaGlmdH1mcmVxW2Jlc3Rwb3NdKz1iZXRhO2JpYXNbYmVzdHBvc10tPWJldGFnYW1tYTtyZXR1cm4gYmVzdGJpYXNwb3N9ZnVuY3Rpb24gaW54YnVpbGQoKXt2YXIgaSxqLHAscSxzbWFsbHBvcyxzbWFsbHZhbCxwcmV2aW91c2NvbD0wLHN0YXJ0cG9zPTA7Zm9yKGk9MDtpPG5ldHNpemU7aSsrKXtwPW5ldHdvcmtbaV07c21hbGxwb3M9aTtzbWFsbHZhbD1wWzFdO2ZvcihqPWkrMTtqPG5ldHNpemU7aisrKXtxPW5ldHdvcmtbal07aWYocVsxXTxzbWFsbHZhbCl7c21hbGxwb3M9ajtzbWFsbHZhbD1xWzFdfX1xPW5ldHdvcmtbc21hbGxwb3NdO2lmKGkhPXNtYWxscG9zKXtqPXFbMF07cVswXT1wWzBdO3BbMF09ajtqPXFbMV07cVsxXT1wWzFdO3BbMV09ajtqPXFbMl07cVsyXT1wWzJdO3BbMl09ajtqPXFbM107cVszXT1wWzNdO3BbM109an1pZihzbWFsbHZhbCE9cHJldmlvdXNjb2wpe25ldGluZGV4W3ByZXZpb3VzY29sXT1zdGFydHBvcytpPj4xO2ZvcihqPXByZXZpb3VzY29sKzE7ajxzbWFsbHZhbDtqKyspbmV0aW5kZXhbal09aTtwcmV2aW91c2NvbD1zbWFsbHZhbDtzdGFydHBvcz1pfX1uZXRpbmRleFtwcmV2aW91c2NvbF09c3RhcnRwb3MrbWF4bmV0cG9zPj4xO2ZvcihqPXByZXZpb3VzY29sKzE7ajwyNTY7aisrKW5ldGluZGV4W2pdPW1heG5ldHBvc31mdW5jdGlvbiBpbnhzZWFyY2goYixnLHIpe3ZhciBhLHAsZGlzdDt2YXIgYmVzdGQ9MWUzO3ZhciBiZXN0PS0xO3ZhciBpPW5ldGluZGV4W2ddO3ZhciBqPWktMTt3aGlsZShpPG5ldHNpemV8fGo+PTApe2lmKGk8bmV0c2l6ZSl7cD1uZXR3b3JrW2ldO2Rpc3Q9cFsxXS1nO2lmKGRpc3Q+PWJlc3RkKWk9bmV0c2l6ZTtlbHNle2krKztpZihkaXN0PDApZGlzdD0tZGlzdDthPXBbMF0tYjtpZihhPDApYT0tYTtkaXN0Kz1hO2lmKGRpc3Q8YmVzdGQpe2E9cFsyXS1yO2lmKGE8MClhPS1hO2Rpc3QrPWE7aWYoZGlzdDxiZXN0ZCl7YmVzdGQ9ZGlzdDtiZXN0PXBbM119fX19aWYoaj49MCl7cD1uZXR3b3JrW2pdO2Rpc3Q9Zy1wWzFdO2lmKGRpc3Q+PWJlc3RkKWo9LTE7ZWxzZXtqLS07aWYoZGlzdDwwKWRpc3Q9LWRpc3Q7YT1wWzBdLWI7aWYoYTwwKWE9LWE7ZGlzdCs9YTtpZihkaXN0PGJlc3RkKXthPXBbMl0tcjtpZihhPDApYT0tYTtkaXN0Kz1hO2lmKGRpc3Q8YmVzdGQpe2Jlc3RkPWRpc3Q7YmVzdD1wWzNdfX19fX1yZXR1cm4gYmVzdH1mdW5jdGlvbiBsZWFybigpe3ZhciBpO3ZhciBsZW5ndGhjb3VudD1waXhlbHMubGVuZ3RoO3ZhciBhbHBoYWRlYz0zMCsoc2FtcGxlZmFjLTEpLzM7dmFyIHNhbXBsZXBpeGVscz1sZW5ndGhjb3VudC8oMypzYW1wbGVmYWMpO3ZhciBkZWx0YT1+fihzYW1wbGVwaXhlbHMvbmN5Y2xlcyk7dmFyIGFscGhhPWluaXRhbHBoYTt2YXIgcmFkaXVzPWluaXRyYWRpdXM7dmFyIHJhZD1yYWRpdXM+PnJhZGl1c2JpYXNzaGlmdDtpZihyYWQ8PTEpcmFkPTA7Zm9yKGk9MDtpPHJhZDtpKyspcmFkcG93ZXJbaV09YWxwaGEqKChyYWQqcmFkLWkqaSkqcmFkYmlhcy8ocmFkKnJhZCkpO3ZhciBzdGVwO2lmKGxlbmd0aGNvdW50PG1pbnBpY3R1cmVieXRlcyl7c2FtcGxlZmFjPTE7c3RlcD0zfWVsc2UgaWYobGVuZ3RoY291bnQlcHJpbWUxIT09MCl7c3RlcD0zKnByaW1lMX1lbHNlIGlmKGxlbmd0aGNvdW50JXByaW1lMiE9PTApe3N0ZXA9MypwcmltZTJ9ZWxzZSBpZihsZW5ndGhjb3VudCVwcmltZTMhPT0wKXtzdGVwPTMqcHJpbWUzfWVsc2V7c3RlcD0zKnByaW1lNH12YXIgYixnLHIsajt2YXIgcGl4PTA7aT0wO3doaWxlKGk8c2FtcGxlcGl4ZWxzKXtiPShwaXhlbHNbcGl4XSYyNTUpPDxuZXRiaWFzc2hpZnQ7Zz0ocGl4ZWxzW3BpeCsxXSYyNTUpPDxuZXRiaWFzc2hpZnQ7cj0ocGl4ZWxzW3BpeCsyXSYyNTUpPDxuZXRiaWFzc2hpZnQ7aj1jb250ZXN0KGIsZyxyKTthbHRlcnNpbmdsZShhbHBoYSxqLGIsZyxyKTtpZihyYWQhPT0wKWFsdGVybmVpZ2gocmFkLGosYixnLHIpO3BpeCs9c3RlcDtpZihwaXg+PWxlbmd0aGNvdW50KXBpeC09bGVuZ3RoY291bnQ7aSsrO2lmKGRlbHRhPT09MClkZWx0YT0xO2lmKGklZGVsdGE9PT0wKXthbHBoYS09YWxwaGEvYWxwaGFkZWM7cmFkaXVzLT1yYWRpdXMvcmFkaXVzZGVjO3JhZD1yYWRpdXM+PnJhZGl1c2JpYXNzaGlmdDtpZihyYWQ8PTEpcmFkPTA7Zm9yKGo9MDtqPHJhZDtqKyspcmFkcG93ZXJbal09YWxwaGEqKChyYWQqcmFkLWoqaikqcmFkYmlhcy8ocmFkKnJhZCkpfX19ZnVuY3Rpb24gYnVpbGRDb2xvcm1hcCgpe2luaXQoKTtsZWFybigpO3VuYmlhc25ldCgpO2lueGJ1aWxkKCl9dGhpcy5idWlsZENvbG9ybWFwPWJ1aWxkQ29sb3JtYXA7ZnVuY3Rpb24gZ2V0Q29sb3JtYXAoKXt2YXIgbWFwPVtdO3ZhciBpbmRleD1bXTtmb3IodmFyIGk9MDtpPG5ldHNpemU7aSsrKWluZGV4W25ldHdvcmtbaV1bM11dPWk7dmFyIGs9MDtmb3IodmFyIGw9MDtsPG5ldHNpemU7bCsrKXt2YXIgaj1pbmRleFtsXTttYXBbaysrXT1uZXR3b3JrW2pdWzBdO21hcFtrKytdPW5ldHdvcmtbal1bMV07bWFwW2srK109bmV0d29ya1tqXVsyXX1yZXR1cm4gbWFwfXRoaXMuZ2V0Q29sb3JtYXA9Z2V0Q29sb3JtYXA7dGhpcy5sb29rdXBSR0I9aW54c2VhcmNofW1vZHVsZS5leHBvcnRzPU5ldVF1YW50fSx7fV0sNDpbZnVuY3Rpb24ocmVxdWlyZSxtb2R1bGUsZXhwb3J0cyl7dmFyIEdJRkVuY29kZXIscmVuZGVyRnJhbWU7R0lGRW5jb2Rlcj1yZXF1aXJlKCIuL0dJRkVuY29kZXIuanMiKTtyZW5kZXJGcmFtZT1mdW5jdGlvbihmcmFtZSl7dmFyIGVuY29kZXIscGFnZSxzdHJlYW0sdHJhbnNmZXI7ZW5jb2Rlcj1uZXcgR0lGRW5jb2RlcihmcmFtZS53aWR0aCxmcmFtZS5oZWlnaHQpO2lmKGZyYW1lLmluZGV4PT09MCl7ZW5jb2Rlci53cml0ZUhlYWRlcigpfWVsc2V7ZW5jb2Rlci5maXJzdEZyYW1lPWZhbHNlfWVuY29kZXIuc2V0VHJhbnNwYXJlbnQoZnJhbWUudHJhbnNwYXJlbnQpO2VuY29kZXIuc2V0UmVwZWF0KGZyYW1lLnJlcGVhdCk7ZW5jb2Rlci5zZXREZWxheShmcmFtZS5kZWxheSk7ZW5jb2Rlci5zZXRRdWFsaXR5KGZyYW1lLnF1YWxpdHkpO2VuY29kZXIuc2V0RGl0aGVyKGZyYW1lLmRpdGhlcik7ZW5jb2Rlci5zZXRHbG9iYWxQYWxldHRlKGZyYW1lLmdsb2JhbFBhbGV0dGUpO2VuY29kZXIuYWRkRnJhbWUoZnJhbWUuZGF0YSk7aWYoZnJhbWUubGFzdCl7ZW5jb2Rlci5maW5pc2goKX1pZihmcmFtZS5nbG9iYWxQYWxldHRlPT09dHJ1ZSl7ZnJhbWUuZ2xvYmFsUGFsZXR0ZT1lbmNvZGVyLmdldEdsb2JhbFBhbGV0dGUoKX1zdHJlYW09ZW5jb2Rlci5zdHJlYW0oKTtmcmFtZS5kYXRhPXN0cmVhbS5wYWdlcztmcmFtZS5jdXJzb3I9c3RyZWFtLmN1cnNvcjtmcmFtZS5wYWdlU2l6ZT1zdHJlYW0uY29uc3RydWN0b3IucGFnZVNpemU7aWYoZnJhbWUuY2FuVHJhbnNmZXIpe3RyYW5zZmVyPWZ1bmN0aW9uKCl7dmFyIGksbGVuLHJlZixyZXN1bHRzO3JlZj1mcmFtZS5kYXRhO3Jlc3VsdHM9W107Zm9yKGk9MCxsZW49cmVmLmxlbmd0aDtpPGxlbjtpKyspe3BhZ2U9cmVmW2ldO3Jlc3VsdHMucHVzaChwYWdlLmJ1ZmZlcil9cmV0dXJuIHJlc3VsdHN9KCk7cmV0dXJuIHNlbGYucG9zdE1lc3NhZ2UoZnJhbWUsdHJhbnNmZXIpfWVsc2V7cmV0dXJuIHNlbGYucG9zdE1lc3NhZ2UoZnJhbWUpfX07c2VsZi5vbm1lc3NhZ2U9ZnVuY3Rpb24oZXZlbnQpe3JldHVybiByZW5kZXJGcmFtZShldmVudC5kYXRhKX19LHsiLi9HSUZFbmNvZGVyLmpzIjoxfV19LHt9LFs0XSk7Ci8vIyBzb3VyY2VNYXBwaW5nVVJMPWdpZi53b3JrZXIuanMubWFw"
			});

			gif.on('finished', function(blob) {
				blobToDataURL(blob,function(e){
					var pa = SetText("渲染完毕，点此下载");
					pa.addClass("helper_clicked");
					pa.click(function(){
						var dl = $('<a id="helper_Recorder_download" style="display:none">下载</a>');
						$("body").append(dl);
						dl = $("#helper_Recorder_download");
						dl.attr("href",URL.createObjectURL(blob));
						dl.attr("download","");
						fake_click(dl[0]);
						dl.remove();
						SetText("");
					});
					//$("#helper_gif").remove();
					//$("body").append("<img id='helper_gif'>");
					//$("#helper_gif").attr("src",e);
					//将图片二进制流取出为Gif -- 转换成base64并显示将会导致页面卡顿一下


					allowRecordKey = 1; // 渲染完毕，允许继续录制
				});
			});
			//添加渲染完毕事件
		}
		function blobToDataURL(blob, callback) {
			var a = new FileReader();
			a.onload = function (e) { callback(e.target.result); };
			a.readAsDataURL(blob);
		}
		function draw(v, c, c2, w, h) {
			if(v.paused || v.ended) {
				cancelAnimationFrame(stop);
				return false;
			}
			//console.log(w+" "+h);
			c2.drawImage(v, 0, 0,w,h);
			AddFrame(c2);
			//向Gif对象添加当前帧

			var stop = requestAnimationFrame(function() {
				draw(v, c, c2, w, h);
			});
			//console.log("dddd");
		}
		function deleteCanvas(){
			$("#helper_recorder_canvas").remove();
		}
		function Recorder_Draw(video,canvas,ctx,width,height){
			draw(video,canvas,ctx,width,height);
		}
		function StartRecord(){
			var ctx = CreatCanvas();
			var canvas = ctx.canvas;
			ctx = ctx.cont2D;
			//瞎jb传值
			var video = getDomPlayer();
			video.addEventListener("play",Recorder_Draw(video,canvas,ctx,RecordWidth(),RecordHeight(),false));
			video.play();

			/* 开始录制，准备创建gif句柄，重置时间戳 */
			CreatGifObject();
			TimeStep = getMiliSeconds();
			FPScount=0;
		}
		function EndRecorder(){
			gif.render();
			SetText("结束录制，渲染中 . . .");
			/* 结束录制，开始渲染gif */

			getDomPlayer().pause();
			getDomPlayer().removeEventListener("play",Recorder_Draw(getDomPlayer()),false);
			deleteCanvas();
			setConfig("low"); // 恢复为低画质
			setTimeout(function(){getDomPlayer().play();},500);
		}


		var allowRecordKey = 1;//该变量用于控制，防止在按键检测弹起的时候继续按键造成bug
		var inRecord = 0;
		var inDir = 0;
		var presEndFlag = 0;
		function testRecord(){
			if(inRecord==1&&inDir==1){
				console.log("Record key down");
				//按键开始事件，开始录制动画
				StartRecord();
			}else if(inRecord==0&&inDir ==-1 ){
				console.log("Record key up");
				allowRecordKey = 0;
				//setTimeout(function(){allowRecordKey = 1;},1000);
				//按键抬起事件，结束录制动画
				EndRecorder();
			}
			if(inDir == 1){
				presEndFlag =0;
			}
			if(inDir == -1){
				presEndFlag+=1;
				if(presEndFlag==2){
					inRecord = 1;
				}
			}
			//console.log(inRecord);
		}

		function AddKeyListen(){
			$("body").keydown(function(e){
				if(!e.ctrlKey){
					return;
				}
				var keycode = e.keyCode;
				if(keycode == 37){
					/*					ctrl + left					*/
					if(getDomPlayer().currentTime>10){
						getDomPlayer().currentTime-=10;
					}
					return false;
				}
				if(keycode == 32){
					/*					ctrl + space					*/
					if($("button.blpui-btn.icon-btn[data-title='暂停']").length){
                        $("button.blpui-btn.icon-btn[data-title='暂停']").click();
                    }else{
                        $("button.blpui-btn.icon-btn[data-title='播放']").click();
                    }
                    //$("div.bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-start-btn button.blpui-btn.icon-btn").click(); //按暂停图标，不使用标签操作，防止干扰正常逻辑
					return false;
				}
				if(keycode == 38){
					/*					ctrl + up					*/
					
					if(getDomPlayer().volume>0.9){
						getDomPlayer().volume = 1;
					}else{
						getDomPlayer().volume+=0.1;
					}
					return false;
				}
				if(keycode == 83){
					/*					ctrl + s					*/
					getDomPlayer().volume = 0;
					return false;
				}
				if(keycode == 39){
					/*					ctrl + right				*/
					var cached = getDomPlayer().buffered.end(0);
					console.log(cached);
					if(getDomPlayer().currentTime<cached-10){
						getDomPlayer().currentTime+=10;
					}
					return false;
				}
				if(keycode == 40){
					/*					ctrl + down					*/
					if(getDomPlayer().volume<0.1){
						getDomPlayer().volume = 0;
					}else{
						getDomPlayer().volume-=0.1;
					}
					return false;
				}
				if(keycode == 77){
					/*					ctrl + m					*/
                    if($("button.blpui-btn.icon-btn[data-title='隐藏弹幕']").length){
                        $("button.blpui-btn.icon-btn[data-title='隐藏弹幕']").click();
                    }else{
                        $("button.blpui-btn.icon-btn[data-title='显示弹幕']").click();
                    }
					return false;
				}
				if(keycode == 88){
				    //网页全屏
					/*					ctrl + x					*/
					if(e.target.localName == "textarea"||e.target.localName =="input"){
						//排除文本框
						return ;
					}
					if(e.shiftKey){
						/*  ctrl + shift +x  */
                        if($("button.blpui-btn.icon-btn[data-title='网页全屏']").length){
                            $("button.blpui-btn.icon-btn[data-title='网页全屏']").click();
                        }else{
                            $("button.blpui-btn.icon-btn[data-title='退出网页全屏']").click();
                        }
						//$("#player_object > div > div.bilibili-live-player-video-controller.active > div > div > div.bilibili-live-player-video-controller-right.clearfix > div.bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-web-fullscreen-btn > button").click();
					}else{
						/*					ctrl + x					*/
                        if($("button.blpui-btn.icon-btn[data-title='全屏模式']").length){
                            $("button.blpui-btn.icon-btn[data-title='全屏模式']").click();
                        }else{
                            $("button.blpui-btn.icon-btn[data-title='退出全屏']").click();
                        }
						//$("#player_object div.bilibili-live-player-video-controller-btn-item.bilibili-live-player-video-controller-fullscreen-btn  button.blpui-btn.icon-btn").click();
					}
					return false;
				}
				if(keycode == 48|| keycode == 96){
					/*					ctrl+0					*/
					//录制Gif必须保持ctrl+0按下状态,抬手结束录制
					//切换录制状态
					if(allowRecordKey == 0){
						//当前为按键回弹时间，不允许继续该逻辑
					}else{
						if(e.altKey){
							//console.log("altkey down");
							setConfig("high");
						}
						if(inRecord<0) inRecord=0;
						inRecord++;
						inDir = 1;
						setTimeout(function(){
							inRecord--;
							inDir = -1;
							testRecord();
						},1000);
						testRecord();
						/*
							这一段配合testRecord()函数实现了最小1秒的按键计时，当按键时间大于1s的时候也可以迅速反应，我特么写完自己就看不懂了。
						*/
					}
					return false;
				}

				console.log(keycode +" not rejected");
				return;
			});
		}
		function SetText(text){
			if(text==""){
				$("#helper_Recorder_text").remove();
			}else{
				$("#helper_Recorder_text").remove();
				var helper_Recorder_text = $("<div id='helper_Recorder_text'></div>");
				$(".room-info-down-row").append(helper_Recorder_text);
				$("#helper_Recorder_text").text(text);
				return $("#helper_Recorder_text");
			}
		}
		function prepareStyle(){
			/* 添加页面样式初始化 */
			$("body").prepend("<div id='helper_canvas_container'><div></div></div>");
			$("body").append('<style>.helper_clicked{cursor:pointer}#helper_Recorder_text{width:100%;height:24px;position:absolute;z-index:100;background-color:#f47de5;top:0px;color:white;text-align:center;line-height:24px;font-size:16px}#helper_canvas_container{display:none}#helper_recorder_canvas{border:3px solid red;}#helper_recorder_canvas+div:before{content:"Recording . . .";font-size:30px;position:fixed;display:block;left:10px;top:10px;z-index:10000;color:red;font-weight:bold;}</style>');
		}
		function init(){
			AddKeyListen();
			prepareStyle();
		}
		init();

	});
})();