// ==UserScript==
// @name       jawz Hybrid - Match Businesses
// @version    1.1
// @description  enter something useful
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10851/jawz%20Hybrid%20-%20Match%20Businesses.user.js
// @updateURL https://update.greasyfork.org/scripts/10851/jawz%20Hybrid%20-%20Match%20Businesses.meta.js
// ==/UserScript==

$(document).ready(function() {
	$('div[class="item-response"]').eq(0).hide();
    $('label[class="control-label"]').eq(2).hide();
    var ma = $('p:textEquals("M")');
    ma.text('M(atch)');
    ma = $('p:textEquals("C")');
    ma.text('C(hain)');
    ma = $('p:textEquals("A")');
    ma.text('A(ffiliated)');
    
    var answer = [];

    for (i=0; i<11; i++) {
        answer[i] = $('input[class="radio_buttons required"]').eq(i);
    }
    
    $(document).keyup(function (event) {
        var key = event.keyCode;
	        
        if (key=='77') {
            if (!$('textarea[class="text optional form-control"]').is(":focus")) {
                answer[0].prop( "checked", true );
                $('input[name="commit"]').click();
            }
        }
           
        if (key=='67') {
            if (!$('textarea[class="text optional form-control"]').is(":focus")) {
                answer[1].prop( "checked", true );
                $('input[name="commit"]').click();
            }
        }
           
        if (key=='65') {
            if (!$('textarea[class="text optional form-control"]').is(":focus")) {
                answer[2].prop( "checked", true );
                $('input[name="commit"]').click();
            }
        }
           
        if (key=='87') {
            if (!$('textarea[class="text optional form-control"]').is(":focus")) {
                answer[3].prop( "checked", true );
                $('textarea[class="text optional form-control"]').focus();
            }
        }
           
        if (key=='78') {
            if (!$('textarea[class="text optional form-control"]').is(":focus")) {
                answer[4].prop( "checked", true );
                $('textarea[class="text optional form-control"]').focus();
            }
        }
           
        if (key=='85') {
            if (!$('textarea[class="text optional form-control"]').is(":focus")) {
                answer[5].prop( "checked", true );
                $('textarea[class="text optional form-control"]').focus();
            }
        }
           
    });
});

$.expr[':'].textEquals = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().match("^" + arg + "$");
    };
});