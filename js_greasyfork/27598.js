// ==UserScript==
// @name        exler
// @namespace   exler.ru
// @include     https://*.exler.ru/*
// @description    Exler page expander
// @version 1

function getWidth(e) {
	var ss = e.style.width;
	if(!ss) ss = e.clientWidth;
	var style = window.getComputedStyle(e, null);
	var css = style ? style["width"] : null;
	if(!ss || ss == '') ss = css;
	if(('' + ss).endsWith('px')) ss = ('' + ss).replace(/px/, '');
	return ss;
}

function goLoad () {
	var tables = document.getElementsByTagName("table");
	var mainTbl = null;
	for(var j = 0; j < tables.length; ++j) {
		var tbl = tables[j];
		var width = getWidth(tbl);
		if(tbl.id == 'MainPage') 
			mainTbl = tbl;
		else if(width == '930' || width == '610' || width == '900')
			tbl.style.width = '100%';

		var cells = tbl.getElementsByTagName('td');
		for(var i = 0; i < cells.length; ++i) {
			width = getWidth(cells[i]);
			if(width == '930' || width == '610')
				cells[i].style.width = '100%';
		}
	}
	if(mainTbl != null) {
		var rightSide = mainTbl.rows[0].cells[1].innerHTML;
		mainTbl.rows[0].cells[1].innerHTML = '';

        var rightDiv = document.createElement('div');
        rightDiv.style.float = "right";
        rightDiv.style.top = 0;
        rightDiv.style.position='absolute';
        rightDiv.innerHTML = rightSide;
        rightDiv.style.width = mainTbl.rows[0].cells[1].width;

        rightDiv.style.webkitTransform = 'scale(1.0, 0.6)'; 
        rightDiv.style.mozTransform    = 'scale(1.0, 0.6)'; 
        rightDiv.style.transform       = 'scale(1.0, 0.6)'; 

        var mainWidth = document.documentElement.clientWidth - getWidth(rightDiv) - 25;
        mainTbl.style.width = mainWidth + 'px';
        mainTbl.width = mainWidth;
        rightDiv.style.left = mainWidth + 25 + 'px';

        mainTbl.rows[0].cells[1].width = 0;
        var top = document.getElementsByTagName('body')[0];
        mainTbl.parentNode.insertBefore(rightDiv, mainTbl);
        
        var article = document.getElementById('aricle');
        var commentDiv = document.createElement('div');
	    commentDiv.style.width = '100%';
	    mainTbl.parentNode.insertBefore(commentDiv, mainTbl.nextSibling);

	    var articleText = article.innerHTML;
	    var matchText = '<div class="CommentTopic">Комментарии</div>';
	    var matchIndex = articleText.indexOf(matchText);
	    var textBefore = articleText.substring(0, matchIndex);
	    var textAfter = articleText.substring(matchIndex);

	    article.innerHTML = textBefore;
	    commentDiv.innerHTML = textAfter;
	}
}

window.addEventListener("load", function(){ goLoad(); }, true);
// @downloadURL https://update.greasyfork.org/scripts/27598/exler.user.js
// @updateURL https://update.greasyfork.org/scripts/27598/exler.meta.js
// ==/UserScript==
