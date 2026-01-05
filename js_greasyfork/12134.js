// ==UserScript==
// @name       jawz Hybrid - Verify business information
// @version    2.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12134/jawz%20Hybrid%20-%20Verify%20business%20information.user.js
// @updateURL https://update.greasyfork.org/scripts/12134/jawz%20Hybrid%20-%20Verify%20business%20information.meta.js
// ==/UserScript==

var sure = 0;
var sure2 = 0;
var sure3 = 0;

if ($('h1:contains(Verify business information)').length) {
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Hide/Show Instructions';
    btn.type = "button";
    btn.onclick = function() { 
        if ($('div[class="item-response order-1"]').is(":visible"))
            $('div[class="item-response order-1"]').hide();
        else
            $('div[class="item-response order-1"]').show();
    }
    
    $('.button_to').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Correct';
    btn.type = "button";
    btn.onclick = function() { 
        filler4('');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Wrong Business';
    btn.type = "button";
    btn.onclick = function() { 
        filler1('Wrong Business');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Wrong Address';
    btn.type = "button";
    btn.onclick = function() { 
        filler1('Wrong Address');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Site for Sale';
    btn.type = "button";
    btn.onclick = function() { 
        filler1('Site for Sale');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Under Construction';
    btn.type = "button";
    btn.onclick = function() { 
        filler2('Under Construction');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'No Site';
    btn.type = "button";
    btn.onclick = function() { 
        filler3('No Site');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'DC';
    btn.type = "button";
    btn.onclick = function() { 
        filler3('Disconnected');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var btn = document.createElement("BUTTON");
    btn.innerHTML = 'Unsure';
    btn.type = "button";
    btn.onclick = function() { 
        filler2('');
    }
    
    $('div[class="item-response order-3"]').append(btn);
    
    var url = $('div[class="item-response order-2"]').find('a').eq(0).attr('href');
    if (url.indexOf('google') > -1)
        url = url.replace(/&/g, '%26').replace(/'/g, '%27');
    var url2 = 'http://motherfuckingwebsite.com/';
    if ($('div[class="item-response order-5"]').find('a').attr('href'))
        url2 = $('div[class="item-response order-5"]').find('a').attr('href');
        
    var windowLeft = window.screenX;
    var windowTop = window.screenY;
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight + 47;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=no,titlebar=yes";
    
    var popup = window.open(url, 'remote', 'height=' + ((windowHeight / 2) - 50) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + windowTop + specs,false);
    var popup2 = window.open(url2, 'remote1', 'height=' + (windowHeight / 2) + ', width=' + windowWidth + ', left=' + (windowLeft + windowWidth) + ',top=' + (windowTop + windowHeight / 2) + specs,false);
        
    window.onbeforeunload = function (e) { 
        popup.close();
        popup2.close();
    }
    
    $('div[class="item-response order-1"]').hide();
    $('div[class="item-response order-7"]').insertBefore($('div[class="item-response order-4"]'));
    
    //var addy = $('div[class="item-response order-2"]').find('a').eq(1).text();
    //var phone = $('div[class="item-response order-7"]').find('p').eq(7).text();
    //$('div[class="item-response order-7"]').find('p').eq(4).html("<a href='https://www.google.com/search?q=" + phone + 'xxxxxxxxxxxxxxx' + addy + "' title='_blank'>Phone</a>")
    var addy = $('div[class="item-response order-2"]').find('a').eq(1).text();
    var place = $('div[class="item-response order-10"]').find('p').eq(1);
    var place2 = $('div[class="item-response order-4"]').find('p').eq(4);
    place.append('<br><br><b>' + addy + '</b>');
    place2.append('<br><br><b>' + addy + '</b>');
    
    $('a').click( function() { 
        if (this.href.indexOf('gethybrid') < 0) {
            var url = this.href;
            if (url.indexOf('google') > -1)
                url = url.replace(/&/g, '%26').replace(/'/g, '%27');
            var windowLeft = window.screenX;
            var windowTop = window.screenY;
            var windowWidth = window.innerWidth;
            var windowHeight = window.innerHeight + 47;
            var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=no,titlebar=yes";
    
            var popup = window.open(url, 'remote', 'height=' + ((windowHeight / 2) - 50) + ', width=' + (windowWidth) + ', left=' + (windowLeft + windowWidth) + ',top=' + windowTop + specs,false);
            window.onbeforeunload = function (e) { 
                popup.close();
                popup2.close();
            }
            return false;
        }
    });
    $('input[name="item_responses[2][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); // Correct Address?
    $('input[name="item_responses[4][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); // Website Connect?
    $('input[name="item_responses[5][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); // Website Associated?
    $('input[name="item_responses[7][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); // Phone?
    $('input[name="item_responses[8][item_option_responses][item_option_id]"]').eq(3).prop('checked', true); // Email?
    $('input[name="item_responses[10][item_option_responses][item_option_id]"]').eq(2).prop('checked', true); // Contact?
    $('input[name="item_responses[12][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); //
    $('input[name="item_responses[13][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); //
    $('input[name="item_responses[15][item_option_responses][item_option_id]"]').eq(1).prop('checked', true);
    
    setInterval(function(){ listenFor(); }, 250);
    
    //$('input[name="item_responses[5][item_option_responses][item_option_id]"]').eq(2).click(function() {
    //    $('input[name="item_responses[7][item_option_responses][item_option_id]"]').eq(2).prop('checked', true);
    //});
    
    //$('input[name="item_responses[8][item_option_responses][item_option_id]"]').eq(0).click(function() {
    //    sure = 1;
    //});
}



function filler1(text) {
    $('input[name="item_responses[4][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); //DC?
    $('input[name="item_responses[7][item_option_responses][item_option_id]"]').eq(2).prop('checked', true);
    $('input[name="item_responses[5][item_option_responses][item_option_id]"]').eq(1).prop('checked', true);
    $('#item_responses_6_text').val(text);
}

function filler2(text) {
    $('input[name="item_responses[4][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); //DC?
    $('input[name="item_responses[7][item_option_responses][item_option_id]"]').eq(2).prop('checked', true);
    $('input[name="item_responses[5][item_option_responses][item_option_id]"]').eq(2).prop('checked', true);
    $('#item_responses_6_text').val(text);
}

function filler3(text) {
    $('input[name="item_responses[4][item_option_responses][item_option_id]"]').eq(1).prop('checked', true); //DC?
    $('input[name="item_responses[7][item_option_responses][item_option_id]"]').eq(2).prop('checked', true);
    $('input[name="item_responses[5][item_option_responses][item_option_id]"]').eq(2).prop('checked', true);
    $('#item_responses_6_text').val(text);
}

function filler4(text) {
    $('input[name="item_responses[4][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); //DC?
    $('input[name="item_responses[7][item_option_responses][item_option_id]"]').eq(0).prop('checked', true);
    $('input[name="item_responses[5][item_option_responses][item_option_id]"]').eq(0).prop('checked', true);
    $('#item_responses_6_text').val(text);
}

function listenFor() {
    if ($('div[class="item-response order-3"]').find('textarea').val() !== '' && sure3 == 0) {
        $('input[name="item_responses[2][item_option_responses][item_option_id]"]').eq(1).prop('checked', true); // Address?
        sure3 = 1;
    }
    
    if ($('div[class="item-response order-9"]').find('textarea').val() !== '' && sure == 0) {
        $('input[name="item_responses[8][item_option_responses][item_option_id]"]').eq(1).prop('checked', true); // Email?
        $('div[class="item-response order-11"]').find('textarea').focus();
        sure = 1;
    }
    
    if ($('div[class="item-response order-11"]').find('textarea').val() !== '' && sure2 == 0) {
        $('input[name="item_responses[10][item_option_responses][item_option_id]"]').eq(0).prop('checked', true); // Contact?
        sure2 = 1;
        $('input[class="btn btn btn-primary"]').focus();
    }
    
    
    
}