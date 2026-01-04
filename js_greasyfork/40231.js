// ==UserScript==
// @name        Crowdin Helper
// @namespace   iFantz7E.CrowdinHelper
// @version     0.01
// @description In Crowdin, add some features to make translate easier. (Alpha)
// @match      	*://crowdin.com/*
// @icon      	https://crowdin.com/favicon.ico
// @run-at		document-start
// @grant       none
// @license		GPLv3
// @copyright	2018, 7-elephant
// @downloadURL https://update.greasyfork.org/scripts/40231/Crowdin%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/40231/Crowdin%20Helper.meta.js
// ==/UserScript==

// License: GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt

// Since 24 Mar 2018

(function ()
{
	"use strict";
	// jshint multistr:true

function attachOnLoad(callback)
{
	window.addEventListener("load", function (e)
	{
		callback();
	});
}

function attachOnReady(callback)
{
	document.addEventListener("DOMContentLoaded", function (e)
	{
		callback();
	});
}

function addKey(eleListener, eleClick, keyCodes, keyName, keyTitleMode, keyModifierName, checkModifierCallback)
{
	/* 
		eleClick:
			element, query
		keyCodes:
			code, name, array
		keyTitleMode:
			0: do nothing
			1: append value
			2: add title if not exist
			4: override title
			8: append textContent
			16: append textContent of firstElementChild
		keyModifierName:
			Ctrl, Ctrl+Shift, Alt
	*/
	
	keyCodes = keyCodes || [0];
	keyName = keyName || "";
	keyTitleMode = keyTitleMode || 0;
	keyModifierName = keyModifierName || "";
	
	if (typeof checkModifierCallback !== "function")
	{
		checkModifierCallback = function(ev) 
		{
			return ev.ctrlKey && ev.shiftKey && ev.altKey;
		};
	}
	
	if (typeof eleClick === "string")
	{
		keyTitleMode = 0;
	}
	
	if (!Array.isArray(keyCodes))
	{
		keyCodes = [keyCodes];
	}
	
	if (eleListener && eleClick)
	{
		// apply title
		var keyTitle = keyModifierName ? keyModifierName + "+" + keyName : "";
		if (keyTitle !== "" && keyTitleMode !== 0)
		{
			if ((keyTitleMode & 1) === 1)
			{
				// 1: append value
				if (typeof eleClick.value !== "undefined")
				{
					eleClick.value += " (" + keyTitle + ")";
				}
			}
			if ((keyTitleMode & 2) === 2)
			{
				// 2: add title if not exist
				if (!eleClick.title)
				{
					eleClick.title = keyTitle;
				}
			}
			if ((keyTitleMode & 4) === 4)
			{
				// 4: override title
				eleClick.title = keyTitle;
			}
			if ((keyTitleMode & 8) === 8)
			{
				// 8: append textContent
				eleClick.textContent += " (" + keyTitle + ")";
			}
			if ((keyTitleMode & 16) === 16)
			{
				// 16: append textContent of firstElementChild
				if (eleClick.firstElementChild)
				{
					eleClick.firstElementChild.textContent += " (" + keyTitle + ")";
				}
			}
		}
		
		eleListener.addEventListener("keydown", function (ev)
		{
			if (checkModifierCallback(ev))
			{
				var isSameKey = false;
				
				for (var i = 0; i < keyCodes.length; i++)
				{
					var keyCode = keyCodes[i];
					if (typeof keyCode === "number")
					{
						isSameKey = (ev.keyCode === keyCode);
					}
					else
					{
						// Firefox 32+
						isSameKey = (typeof ev.code !== "undefined" && ev.code === keyCode)
					}
					
					if (isSameKey)
					{
						break;
					}
				}
				
				if (isSameKey)
				{
					ev.preventDefault();
					
					var eleClickCur = null;
					
					if (typeof eleClick === "string")
					{
						eleClickCur = document.querySelector(eleClick);
					}
					else
					{
						eleClickCur = eleClick;
					}					
					
					if (eleClickCur)
					{
						eleClickCur.focus();
						eleClickCur.click();
					}
					
					return false;
				}
			}
		}, true);
	}
}

function addKeyCtrl(eleListener, eleClick, keyCode, keyName, keyTitleMode)
{
	addKey(eleListener, eleClick, keyCode, keyName, keyTitleMode, "Ctrl", function(ev)
	{
		return ev.ctrlKey && !ev.shiftKey && !ev.altKey;
	});
}

function addKeyCtrlShift(eleListener, eleClick, keyCode, keyName, keyTitleMode)
{
	addKey(eleListener, eleClick, keyCode, keyName, keyTitleMode, "Ctrl+Shift", function(ev)
	{
		return ev.ctrlKey && ev.shiftKey && !ev.altKey;
	});
}

function addKeyAlt(eleListener, eleClick, keyCode, keyName, keyTitleMode)
{
	addKey(eleListener, eleClick, keyCode, keyName, keyTitleMode, "Alt", function(ev)
	{
		return !ev.ctrlKey && !ev.shiftKey && ev.altKey;
	});
}

function addKeyCtrlEnter(form, input)
{
	addKeyCtrl(form, input, ["Enter", 13], "Enter", 1|2);
}

function addKeyCtrlShiftEnter(form, input)
{
	addKeyCtrlShift(form, input, ["Enter", 13], "Enter", 1|2);
}

function main()
{
	var url = document.documentURI;
	
	if (url.indexOf("/translate/") > -1)
	{
		addKeyCtrl(document, "#prev_translation", "BracketLeft");	// [
		addKeyCtrl(document, "#next_translation", "BracketRight");	// ]
		addKeyCtrl(document, "#action_copy_source", "Backslash");	// \
	}
	
} // End Main
	
attachOnReady(main);

})();

// End
