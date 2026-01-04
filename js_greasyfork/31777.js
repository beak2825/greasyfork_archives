// ==UserScript==
// @name           Disable Console Log
// @description    Disable standard output to the console
// @description:ru Отключает стандартный вывод в консоль
// @namespace      https://greasyfork.org/ru/users/136230-iron-man
// @include        *
// @version        1.0.1
// @author         Iron man
// @grant          none
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/31777/Disable%20Console%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/31777/Disable%20Console%20Log.meta.js
// ==/UserScript==

window.consoleLogger = new Logger();
window.consoleLogger.disable();
function Logger()
{
	this.clog = console.log;
	this.oldConsoleLog = null;
	this.enable = function(){
		if( this.oldConsoleLog )
			window['console']['log'] = this.oldConsoleLog;
	};
	this.disable = function(){
		this.oldConsoleLog = console.log;
		window['console']['log'] = function(){};
	};
}