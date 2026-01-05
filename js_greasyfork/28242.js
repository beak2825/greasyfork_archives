// ==UserScript==
// @name       Hybrid - 123yourNLP
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/28242/Hybrid%20-%20123yourNLP.user.js
// @updateURL https://update.greasyfork.org/scripts/28242/Hybrid%20-%20123yourNLP.meta.js
// ==/UserScript==

if ($('li:contains("Validation Dev")').length) {
    var count = 1, div = [], color = '#8cffe6', noColor = '#EEEEEE';

    for (i=1; i<6; i++) {
        div[i] = $('div[class="item-response order-'+i+'"]');
    }

    for (var i = 1; i < 6; i++) {
        tbl  = document.createElement('table');
        div[i].append(tbl);
        var tr = tbl.insertRow();
        for(var j = 0; j < 3; j++) {
		    var td = tr.insertCell();
            td.appendChild(div[i].find('.radio')[0]);
	    }
    }

    div[count].css("background-color", color);
    $(window).scrollTop(div[count].offset().top-200);

    $(document).keyup(function (event) {
	    var key = event.keyCode;

        if (key=='13') {
	        $( "input[value='Submit']" ).click();
            GM_setClipboard('AHK_TAB');
	    } else if ([109,189].indexOf(key) >= 0 && count > 1) {
            div[count].css("background-color", noColor);
            count--;
            div[count].css("background-color", color);
            $(window).scrollTop(div[count].offset().top-200);
        } else if ([107,187].indexOf(key) >= 0 && count < 5) {
            div[count].css("background-color", noColor);
            count++;
            div[count].css("background-color", color);
            $(window).scrollTop(div[count].offset().top-200);

        } else if ([49,97].indexOf(key) >= 0)
            answer(0);
        else if ([50,98].indexOf(key) >= 0)
            answer(1);
        else if ([51,99].indexOf(key) >= 0)
            answer(2);

    });
}

function answer(a) {
    div[count].find('input').eq(a).prop('checked',true);

    div[count].css("background-color", noColor);
    if (count < 5)
        count++;
    div[count].css("background-color", color);
    $(window).scrollTop(div[count].offset().top-200);
}