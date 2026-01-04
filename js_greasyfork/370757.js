// ==UserScript==
// @name         百度网盘一键重命名当前目录
// @namespace    http://tampermonkey.net/
// @version      0.13
// @author       codeshif
// @match        https://pan.baidu.com/*
// @description  用于百度云一键重命名当前目录
// @match        https://pan.baidu.com/*
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370757/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%80%E9%94%AE%E9%87%8D%E5%91%BD%E5%90%8D%E5%BD%93%E5%89%8D%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/370757/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%80%E9%94%AE%E9%87%8D%E5%91%BD%E5%90%8D%E5%BD%93%E5%89%8D%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
	'use strict';

	var btnToolBoxHTML = '<a class="g-button" href="javascript:;" title="批量重命名" style="display: inline-block;"><span class="g-button-right"><em class="icon icon-search" title="批量重命名"></em><span class="text" style="width: auto;">批量重命名</span></span></a>';

	$(btnToolBoxHTML).appendTo('.tcuLAu').click(function () {

		var origin = prompt('请输入想要替换的字符');
		if(origin == undefined || origin.length <= 0){

            window.yunHeader.tools.ui.tip.show({
                msg: "想要替换的字符不能为空",
                type:'failure'
            });
			return false;
		}
		var persent = prompt('请输入要替换成什么');
		renames(origin,persent);

		return false;
	});



	async function renames(origin,persent) {

		var fileNames = $('.file-name .text a').map(function(){return $(this).text();});

		fileNames = $.grep(fileNames, function (element, i) {
			return element.indexOf(origin) != -1;
		});

		var path = $('.FuIxtL li[node-type] span:last');
		if(path.length <= 0){

            window.yunHeader.tools.ui.tip.show({
                msg: "没有找到路径元素",
                type:'failure'
            });
			return false;
		}

        window.yunHeader.tools.ui.tip.show({
			msg: "正在重命名……"
		});
		path = path.attr('title').replace('全部文件', '') + '/';

		var data = $.map(fileNames, function (element, i) {
			return {
				path : path + element,
				newname : element.replace(origin, persent)
			}
		});


		$.ajax([
				'https://pan.baidu.com/api/filemanager?',
				'opera=rename&async=2&onnest=fail&channel=chunlei&web=1&app_id=250528&bdstoken=',
				window.locals.get('bdstoken'),
				'&logid=',
				getLogID(),
				'=&clienttype=0'
			].join(''), {

			type:'post',
			data:{
				filelist : JSON.stringify(data)
			},
			complete:function () {

                window.yunHeader.tools.ui.tip.show({
                    msg: "重命名已执行完成，正在刷新页面……",
                    type:'success'
                });

                setTimeout(function () {
					location.reload(true);
				}, 4000);

			}
		});
	}

	function rename(oldName, newName) {

		var path = $('.FuIxtL li[node-type] span:last');
		if(path.length <= 0){

			window.yunHeader.tools.ui.tip.show({
                msg: "没有找到路径元素",
                type:'failure'
            });
			return false;
		}

		path = path.attr('title').replace('全部文件', '') + '/' + oldName;

		return new Promise((resolve,reject) => {

			$.ajax([
					'https://pan.baidu.com/api/filemanager?',
					'opera=rename&async=2&onnest=fail&channel=chunlei&web=1&app_id=250528&bdstoken=',
					window.locals.get('bdstoken'),
					'&logid=',
					getLogID(),
					'==&clienttype=0'
				].join(''), {

				type:'post',
				data:{
					filelist : JSON.stringify([{
							path : path,
							newname : newName
						}])
				},
				complete:function () {

					setTimeout(resolve,1500);
				}
			});

		});

	}

	function getLogID() {

		var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/~！@#￥%……&";
		var r = String.fromCharCode;
		var a = function(e) {
			if (e.length < 2) {
				var t = e.charCodeAt(0);
				return 128 > t ? e: 2048 > t ? r(192 | t >>> 6) + r(128 | 63 & t) : r(224 | t >>> 12 & 15) + r(128 | t >>> 6 & 63) + r(128 | 63 & t)
			}
			var t = 65536 + 1024 * (e.charCodeAt(0) - 55296) + (e.charCodeAt(1) - 56320);
			return r(240 | t >>> 18 & 7) + r(128 | t >>> 12 & 63) + r(128 | t >>> 6 & 63) + r(128 | 63 & t)
		};
		var o = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
		var c = function(e) {
			return (e + "" + Math.random()).replace(o, a)
		};
		var i = function(e) {
			var t = [0, 2, 1][e.length % 3],
			r = e.charCodeAt(0) << 16 | (e.length > 1 ? e.charCodeAt(1) : 0) << 8 | (e.length > 2 ? e.charCodeAt(2) : 0),
			a = [n.charAt(r >>> 18), n.charAt(r >>> 12 & 63), t >= 2 ? "=": n.charAt(r >>> 6 & 63), t >= 1 ? "=": n.charAt(63 & r)];
			return a.join("")
		};
		var d = function(e) {
			return e.replace(/[\s\S]{1,3}/g, i)
		};
		var l = function() {
			return d(c((new Date).getTime()))
		};
		var u = function(e, t) {
			return t ? l(String(e)).replace(/[+\/]/g,
			function(e) {
				return "+" == e ? "-": "_"
			}).replace(/=/g, "") : l(String(e))
		};
		var f = function(e) {
			var t, n;
			return document.cookie.length > 0 && (t = document.cookie.indexOf(e + "="), -1 != t) ? (t = t + e.length + 1, n = document.cookie.indexOf(";", t), -1 == n && (n = document.cookie.length), decodeURI(document.cookie.substring(t, n))) : ""
		};
		var h = function(e) {
			var t = new RegExp(e + "=([^#&]*)", "g"),
			n = t.exec(location.hash);
			return n ? decodeURIComponent(n[1]) : ""
		}

		return u(f('BAIDUID'));

	}

//	function _x(STR_XPATH) {
//		var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
//		var xnodes = [];
//		var xres;
//		while (xres = xresult.iterateNext()) {
//			xnodes.push(xres);
//		}
//
//		return xnodes;
//	}

	// Your code here...
})();