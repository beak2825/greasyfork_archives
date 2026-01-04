// ==UserScript==
// @name         Ignore PPEcel
// @namespace    incelerated
// @version      0.5
// @description  Ignores the fakecel known as PPEcel so you won't have to see his monthly threads were he posts an stacy escort he is going to fuck.
// @author       incelerated
// @match        https://incels.is/forums/*
// @match        https://incels.is/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447831/Ignore%20PPEcel.user.js
// @updateURL https://update.greasyfork.org/scripts/447831/Ignore%20PPEcel.meta.js
// ==/UserScript==

var ignored = ['PPEcel', 'user123'];

$("document").ready(function(){

    var a = document.createElement('a');
	a.href = document.location.href;
	var path = a.pathname;
	var fakecelContent = [];

	//if we are in a subforum
	if(path.startsWith('/forums/'))
	{
		$('.structItem').each(function(){
			if( ignored.includes($(this).attr('data-author')) )
			{
				fakecelContent.push($(this));
			}
		});
	}

	//if we are in a thread
	if(path.startsWith('/threads/'))
	{
		$('article.message').each(function(){
			if( ignored.includes($(this).attr('data-author')) )
			{
				fakecelContent.push($(this));
			}
		});
	}

	if(fakecelContent.length)
	{
		for(let content of fakecelContent)
		{
			content.hide();
		}

		$('.showIgnoredLink').removeClass('is-hidden');
		$('.showIgnoredLink').click(function(){
			for(let content of fakecelContent)
			{
				content.show();
			}
		});
	}

});