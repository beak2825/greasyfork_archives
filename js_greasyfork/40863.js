// ==UserScript==
// @name         HOOK
// @namespace    http://www.infosec-wiki.com/
// @version      1.3
// @description  HOOK API
// @author       http://www.infosec-wiki.com/
// @match        *
// @run-at       document-start

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