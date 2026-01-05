// ==UserScript==
// @name       Hybrid - Match business info 2
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/24177/Hybrid%20-%20Match%20business%20info%202.user.js
// @updateURL https://update.greasyfork.org/scripts/24177/Hybrid%20-%20Match%20business%20info%202.meta.js
// ==/UserScript==

if ($('li:contains("Match business info")').length) {
    var div = [], arrA = [], arrB = [],
        color = '#80ff80';
    
    var bizA = $('p:contains("Business A")').eq(0).next().next().next().text();
    var arrA = bizA.split("\n");
    var bizB = $('p:contains("Business B")').next().next().next().text();
    var arrB = bizB.split("\n");
    var colors = ['#ffb3b3', '#c6ffb3', '#ecffb3', '#f2ccff', '#ccffff', '#ffe6cc', '#fca4da'];
    var count = 0;
    var count2 = 1;
    
    buildTbl('1', '2', '2');
    buildTbl('3', '4', '3');
    buildTbl('5', '6', '4');
    buildTbl('7', '8', '5');
    buildTbl('9', '10', '6');
    buildTbl('11', '12', '7');
    buildTbl('13', '14', '8');
    
    $.each(arrA,function(index,elem){
        if (elem !== '' && index !== 1 && index !== 4 && index !== 7){
            // for each line, wrap it with a span and bring back the linebreak
            //$('div[class="item-response order-1"]').append('<span style="background-color: '+colors[count]+'">'+elem+'</span><br/>');
            $('#'+count2+'').prepend('<b><span style="background-color: '+colors[count]+'">'+elem+'</span><br/></b>');
            count++;
            count2 = count2 + 2;
        }
    });
    count2 = 2;
    count = 0;
    $('div[class="item-response order-1"]').append('<br><br>');
    
    $.each(arrB,function(index,elem){
        if (elem !== '' && index !== 1 && index !== 4 && index !== 7){
            // for each line, wrap it with a span and bring back the linebreak
            //$('div[class="item-response order-1"]').append('<span style="background-color: '+colors[count]+'">'+elem+'</span><br/>');
            $('#'+count2+'').prepend('<b><span style="background-color: '+colors[count]+'">'+elem.replace(/contacts: /g,'').replace(/business names: /g,'').replace(/addresses: /g,'').replace(/websites: /g,'').replace(/emails: /g,'').replace(/title \/ salutation \/ dept: /g,'')+'</span><br/></b>');
            count++;
            count2 = count2 + 2;
        }
    });
    
    
    $('div[class="item-response order-2"]')[0].style.backgroundColor = colors[0];
    $('div[class="item-response order-3"]')[0].style.backgroundColor = colors[1];
    $('div[class="item-response order-4"]')[0].style.backgroundColor = colors[2];
    $('div[class="item-response order-5"]')[0].style.backgroundColor = colors[3];
    $('div[class="item-response order-6"]')[0].style.backgroundColor = colors[4];
    $('div[class="item-response order-7"]')[0].style.backgroundColor = colors[5];
    $('div[class="item-response order-8"]')[0].style.backgroundColor = colors[6];
    //$('div[class="item-response order-1"]').find('p').hide();
    //$('div[class="item-response order-1"]').hide();
    if (arrA[0] == 'contacts: ' || arrB[0] == 'contacts: ')
        $('div[class="item-response order-2"]').hide();
    
    if (arrA[2] == 'business names: ' || arrB[2] == 'business names: ')
        $('div[class="item-response order-3"]').hide();
    
    if (arrA[3] == 'addresses: ' || arrB[3] == 'addresses: ')
        $('div[class="item-response order-4"]').hide();
    
    if (arrA[5] == 'websites: ' || arrB[5] == 'websites: ')
        $('div[class="item-response order-5"]').hide();
    
    if (arrA[6] == 'emails: ' || arrB[6] == 'emails: ')
        $('div[class="item-response order-6"]').hide();
    
    $('p:contains("Do the")').hide();
    $('p:contains("P =")').hide();
    $('p:contains("If they visually")').hide();
    $('#11').prepend('<b><span style="background-color: '+colors[5]+'">'+arrA[0]+'<br>'+arrA[1]+'</span><br/></b>');
    $('#12').prepend('<b><span style="background-color: '+colors[5]+'">'+arrB[0].replace(/contacts: /g,'').replace(/business names: /g,'').replace(/addresses: /g,'').replace(/websites: /g,'').replace(/emails: /g,'').replace(/title \/ salutation \/ dept: /g,'')+'<br>'+arrB[1].replace(/contacts: /g,'').replace(/business names: /g,'').replace(/addresses: /g,'').replace(/websites: /g,'').replace(/emails: /g,'').replace(/title \/ gender \/ groups: /g,'')+'</span><br/></b>');
    //$('#13').prepend('<b><span style="background-color: '+colors[6]+'">'+arrA[4]+'<br>'+arrA[5]+'<br>'+arrA[7]+'</span><br/></b>');
    //$('#14').prepend('<b><span style="background-color: '+colors[6]+'">'+arrB[4].replace('phones: ', '')+'<br>'+arrB[5].replace('websites: ', '')+'<br>'+arrB[7].replace('linkedin / fb / twitter: ', '')+'</span><br/></b>');
    
}

function buildTbl(id1, id2, div) {
    tbl  = document.createElement('table');
    $('div[class="item-response order-'+div+'').prepend(tbl);
    for(var i = 0; i < 10; i++) {
        var tr = tbl.insertRow();
        for(var j = 0; j < 2; j++) {
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(''));
            td.style.width = '50%';
            if (j==0)
                td.id = id1;
            else {
                td.id = id2;
            }
        }
    }
}