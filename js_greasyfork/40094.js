// ==UserScript==
// @name         阻止百度统计和嵌入窗口
// @namespace    http://www.infosec-wiki.com/
// @version      1.3
// @description  使用Hook技术阻止百度统计和嵌入窗口
// @author       infosec-wiki
// @match        *
// @run-at       document-start
// @grant        unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/40094/%E9%98%BB%E6%AD%A2%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E5%92%8C%E5%B5%8C%E5%85%A5%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/40094/%E9%98%BB%E6%AD%A2%E7%99%BE%E5%BA%A6%E7%BB%9F%E8%AE%A1%E5%92%8C%E5%B5%8C%E5%85%A5%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

(function() {
	'use strict';

	/**
	 Code by pnig0s[Knownsec&FreeBuf]
	 Date 20130214
	 一個通用的js任意函數鉤子
	 A simple hooks to Javascript functions

	 [bool]hook:params{
	realFunc[String|must]:用於保存原始的目標函數名,用於unHook;
	hookFunc[Function|must]:替換的hook函數;
	context[Object|opt]:目標函數實例的對象,用於hook非window對象下的函數，如String.protype.slice,carInstance1
	methodName[String|opt]:用於hook匿名函數eg:this.Begin = function(){....};
}
	 [bool]unhook:params{
	realFunc[String|must]:用於保存原始的目標函數名,用於unHook;
	funcName[String|must]:被Hook的函數名稱
	context[Object|opt]:目標函數實例的對象,用於hook非window對象下的函數，如String.protype.slice,carInstance1
}

	 **/

	function Hooks() {
		return {
			initEnv:function () {
				Function.prototype.hook = function (realFunc,hookFunc, run, context,funcName) {
					var _context = null; //函數上下文
					var _funcName = null; //函數名

					_context = context || window;
					//_context = context || unsafeWindow;

					_funcName = funcName || getFuncName(this);
					_context[realFunc] = this;

					if(_context[_funcName].prototype && _context[_funcName].prototype.isHooked)
					{
						console.log("Already has been hooked,unhook first");
						return false;
					}

					function getFuncName (fn) {
						// 獲取函數名稱
						var strFunc = fn.toString();
						var _regex = /function\s+(\w+)\s*\(/;
						var patten = strFunc.match(_regex);
						if (patten) {
							return patten[1];
						};
						return '';
					}

					try {
						if (run) {
							eval('_context[_funcName] = function ' + _funcName + '(){\n' +
								'var args = Array.prototype.slice.call(arguments,0);\n' +
								'var obj = this;\n' +
								'hookFunc.apply(obj,args)\n' +
								'return _context[realFunc].apply(obj,args);\n' +
								'};');
						}else {
							eval('_context[_funcName] = function ' + _funcName + '(){\n' +
								'var args = Array.prototype.slice.call(arguments,0);\n' +
								'var obj = this;\n' +
								'hookFunc.apply(obj,args)\n' +
								'};');
						}
						_context[_funcName].prototype.isHooked = true;
						return true;
					}catch (e)
					{
						console.log("Hook failed,check the params.");
						return false;
					}
				};
				Function.prototype.unhook = function (realFunc,funcName,context) {
					var _context = null;
					var _funcName = null;
					_context = context || window;
					_funcName = funcName;
					if (!_context[_funcName].prototype.isHooked)
					{
						console.log("No function is hooked on");
						return false;
					}
					_context[_funcName] = _context[realFunc];
					delete _context[realFunc];
					return true;
				};
			},
			cleanEnv:function () {
				if(Function.prototype.hasOwnProperty("hook"))
				{
					delete Function.prototype.hook;
				}
				if(Function.prototype.hasOwnProperty("unhook"))
				{
					delete Function.prototype.unhook;
				}
				return true;
			}
		};
	}
	var myHook = new Hooks();
	myHook.initEnv();

	var _createElement = null;
	function createElement_hook(tag_name){
		console.log("createElement: " + tag_name);
		if(tag_name.toLowerCase() == "script") {
			console.log("注意.....");
		}
	}
	Document.prototype.createElement.hook("_createElement", createElement_hook, true, Document.prototype);

	var _insertBefore = null;
	function insertBefore_hook(son, par){
		var tagName = son.tagName;
		if(tagName.toLowerCase() == "script"){
			var src = son.src;
			console.log("insertBefore: " + src);
			if(src.indexOf("hm.baidu.com") > -1){
			    console.log("阻止百度统计.... ");
                return false;
			}
		}
        HTMLElement.prototype["_insertBefore"].call(this, son, par);
	}
	HTMLElement.prototype.insertBefore.hook("_insertBefore", insertBefore_hook, false, HTMLElement.prototype);


	var _writeln = null;
	function writeln_hook(s){
		console.log("writeln: " + s);
		if(s.toLowerCase().indexOf("frameset") > -1 || s.toLowerCase().indexOf("iframe") > -1){
			console.log("阻止创建Frame窗口.....");
		}
		else{
			Document.prototype["_writeln"].call(document, s);
			//console.log(Document.prototype);
		}
	}
	Document.prototype.writeln.hook("_writeln", writeln_hook, false, Document.prototype);

	var _write = null;
	function write_hook(s){
		console.log("write: " + s);
		if(s.toLowerCase().indexOf("cnzz.com") > -1){
			console.log("阻止创建cnzz.com统计.....");
		}
		else{
			Document.prototype["_write"].call(document, s);
			//console.log(Document.prototype);
		}
	}
	Document.prototype.write.hook("_write", write_hook, false, Document.prototype);


	//myHook.cleanEnv(); //clear hooks

})();