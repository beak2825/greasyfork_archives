// ==UserScript==
// @name Y2mate MP3 button clicker
// @namespace DanWL
// @version 1
// @description Makes using Y2mate optomised for quickly downloading mp3 files from YT
// @author https://greasyfork.org/en/users/85040-dan-wl-danwl
// @match https://y2mate.com/youtube/*
// @require https://greasyfork.org/scripts/35370-add-css/code/Add_CSS.js?version=598682
// @require https://greasyfork.org/scripts/39784-easy-dom/code/Easy%20DOM.js?version=265196
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/369482/Y2mate%20MP3%20button%20clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/369482/Y2mate%20MP3%20button%20clicker.meta.js
// ==/UserScript==
elementExists('process_mp3_a', function(){return;}, function(element)
{
	element.click();//start processing
});

var closeDownloadDialogue = function()
{
	if (window._ihordt)//_ihordt is needed - randomly becomes undefined
	{
		document.getElementById('process-result').parentElement.nextElementSibling.firstElementChild.click();
	}
	else
	{
		setTimeout(function(){closeDownloadDialogue();}, 100);
	}
};
var downloadFile = function()
{
	//download the file
	//ui is created on the fly, so wait unit the content is created
	var recallSelf = function()
	{
		setTimeout(function(){downloadFile();}, 100);
	};
	elementExists('process-result', function()
	{
		recallSelf();
	}, function(element)
	{
		var downloadBtn = element.children[1];
		if (downloadBtn)
		{
			downloadBtn = downloadBtn.firstElementChild;
			if (downloadBtn)
			{
				downloadBtn.click();//download the file
				closeDownloadDialogue();//close that UI - easier to search for another video to download
			}
			else
			{
				recallSelf();
			}
		}
		else
		{
			recallSelf();
		}
	});
};
var dwnldMain = function()
{
	//ui is created on the fly, so wait unit the content is created
	var recallSelf = function()
	{
		setTimeout(function(){dwnldMain();}, 100);
	};
	if (window._ihordt)//_ihordt is needed - randomly becomes undefined
	{
		elementExists('mp3', function()
		{
			recallSelf();
		}, function(element)
		{
			document.querySelectorAll('ul.nav.nav-tabs a')[1].click();//navigate to mp3 tab
			element.querySelectorAll('#process_mp3_a')[0].click();//click the download button
			downloadFile();
		});
	}
	else
	{
		recallSelf();
	}
};
dwnldMain();