// ==UserScript==
// @name         Yougame Free Premium
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://yougame.biz/*
// @match        https://yougame.biz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367889/Yougame%20Free%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/367889/Yougame%20Free%20Premium.meta.js
// ==/UserScript==



(function() {
var vistex = document.getElementsByClassName('visitorText');
if (vistex.length != 0)
{
var vistex2 = vistex[0].childNodes[1];
var vistex3 = vistex2.childNodes[0];
var vistex4 = vistex3.childNodes[0];
vistex4.className = 'style38';
}

var blocks = document.getElementsByClassName('messageUserBlock ');
var bleng = blocks.length;

for (var i = 0; i < bleng; i++)
{
	var chco = blocks[i].childNodes.length;
	for (var x = 0; x < chco; x++)
	{
		var articles = blocks[i].childNodes[x];
		//console.log(articles.innerHTML);
		//console.log(articles.className);
		var lenaa = articles.length;
		//for (var d = 0; d < lenaa; d++)
        //{
			if (articles.className == 'userText')
            {
				var nejj = articles.childNodes[1];
				if (nejj.childNodes[0].innerText == 'Рhysic')
                {
					nejj.childNodes[0].className = 'style38';
					blocks[i].childNodes[x+4].className = 'yougamePremium';
					blocks[i].childNodes[x+4].innerText = 'Премиум';
                }
				//console.log('baba');
            }
        //}

	}
}
})();