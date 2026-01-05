// ==UserScript==
// @name       jawz Eric Chan - Compare companies
// @version    1.1
// @description  enter something useful
// @match      https://s3.amazonaws.com/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10849/jawz%20Eric%20Chan%20-%20Compare%20companies.user.js
// @updateURL https://update.greasyfork.org/scripts/10849/jawz%20Eric%20Chan%20-%20Compare%20companies.meta.js
// ==/UserScript==

$(document).ready(function() {
	$('div[class="panel panel-primary"]').hide();
    $(document).keyup(function (event) {
        var key = event.keyCode;
	        
        if (key=='77') {
            if (!$('textarea[name="comments"]').is(":focus")) {
                $("input[name='match'][value='M']").prop( "checked", true );
                $('#submitButton').click();
            }
        }
           
        if (key=='67') {
            if (!$('textarea[name="comments"]').is(":focus")) {
                $("input[name='match'][value='C']").prop( "checked", true );
                $('#submitButton').click();
            }
        }
           
        if (key=='65') {
            if (!$('textarea[name="comments"]').is(":focus")) {
                $("input[name='match'][value='A']").prop( "checked", true );
                $('#submitButton').click();
            }
        }
           
        if (key=='87') {
            if (!$('textarea[name="comments"]').is(":focus")) {
                $("input[name='match'][value='W']").prop( "checked", true );
                $('textarea[name="comments"]').focus();
            }
        }
           
        if (key=='78') {
            if (!$('textarea[name="comments"]').is(":focus")) {
                $("input[name='match'][value='N']").prop( "checked", true );
                $('textarea[name="comments"]').focus();
            }
        }
           
        if (key=='85') {
            if (!$('textarea[name="comments"]').is(":focus")) {
                $("input[name='match'][value='U']").prop( "checked", true );
                $('textarea[name="comments"]').focus();
            }
        }
           
    });
    var text = $('p:contains(names)')
    var first = text.eq(0).text();
    var second = text.eq(1).text();
    var name = first.split('addresses:')[0];
    var address = first.split('addresses:')[1].split('phones:')[0];
    var phone = first.split('phones:')[1].split('websites:')[0];
    var website = first.split('websites:')[1].split('emails:')[0];
    var email = first.split('emails:')[1].split('contacts:')[0];
    var contact = first.split('contacts:')[1]
    text.eq(0).after(name +
                     "<br>addresses: " + address +
                     "<br>phones: " + phone +
                     "<br>websites: " + website +
                     "<br>emails: " + email +
                     "<br>contacts: " + contact + "<br>"
                    );
    text.eq(0).text('');
    
    var name = second.split('addresses:')[0];
    var address = second.split('addresses:')[1].split('phones:')[0];
    var phone = second.split('phones:')[1].split('websites:')[0];
    var website = second.split('websites:')[1].split('emails:')[0];
    var email = second.split('emails:')[1].split('contacts:')[0];
    var contact = second.split('contacts:')[1]
    text.eq(1).after(name +
                     "<br>addresses: " + address +
                     "<br>phones: " + phone +
                     "<br>websites: " + website +
                     "<br>emails: " + email +
                     "<br>contacts: " + contact + "<br>"
                    );
    text.eq(1).text('');
    
    var second = second.replace('addresses:', '||| addresses:').replace('phones:', '||| phones:').replace('websites:', '||| websites:').replace('emails:', '||| emails:').replace(/,/g, '|||');
});