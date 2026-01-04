// ==UserScript==
// @name       Hybrid - Categorize races in photos 2
// @version    2.4
// @author	   jawz
// @description  Eric Chizzle
// @match      https://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_setClipboard
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/33824/Hybrid%20-%20Categorize%20races%20in%20photos%202.user.js
// @updateURL https://update.greasyfork.org/scripts/33824/Hybrid%20-%20Categorize%20races%20in%20photos%202.meta.js
// ==/UserScript==

if ($('li:contains("AB")').length) {
    var div = [],
        count = 2,
        divBy,
        color = '#8cffe6',
        color2 = 'RED',
        noColor = '#71e873', //EEEEEE
        noColor2 = '#EEEEEE',
        sc = 200;
    $('p:contains("Person")').find('a').css("background-color", "yellow");
    $('img').width('200px');
    $('img').height('200px');
    for (i=1;i<41;i++)
        div[i] = $('div[class="item-response order-'+i+'"]')[0].style;
    for (var i=1; i*4<41; i++)
        $('div[class="item-response order-'+(i*4)+'"]').hide();
    setTimeout(function(){ 
        div[count].backgroundColor = color; 
        div[count-1].backgroundColor = color2;
        $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = color2;
    }, 500);
    $('p:contains("Person")').find('a').css("fontSize", "20px");
    $('span[class="radio"]').css("float", "left");
    $('span[class="radio"]').css("padding-right", "10px");
    tbl  = document.createElement('table');
    $('div[class="fields-text')[0].appendChild(tbl);
    for(var i = 0; i < 10; i++) {
	    var tr = tbl.insertRow();
        for(var j = 0; j < 2; j++) {
		    var td = tr.insertCell();
		    td.appendChild(document.createTextNode(''));
            if (j==0)
                td.appendChild($('div[class="item-response order-'+(i*4+1)+'')[0]);
            else {
                td.appendChild($('div[class="item-response order-'+(i*4+2)+'')[0]);
                td.appendChild($('div[class="item-response order-'+(i*4+3)+'')[0]);
            }
	    }
    }
    $(window).scrollTop($('div[class="instructions"]').offset().top);
    $(document).keyup(function (event) {
	    var key = event.keyCode;

        if (key=='13') {
	        $( "input[value='Submit']" ).click();
            GM_setClipboard('AHK_TAB');
	    } else if (key == 109 && count > 2) {
            div[count].backgroundColor = noColor;
            divBy = (count-3) % 4 === 0; 
            if(divBy===true)
                count--;
            else {
                div[count-1].backgroundColor = noColor; 
                $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = noColor2;
                count = count - 3;
                $(window).scrollTop($('div[class="item-response order-'+(count-2)+'"]').offset().top-sc);
                div[count-2].backgroundColor = color2; 
                $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = color2;
            }
            if ($('div[class="item-response order-'+count+'"]').length) {
                div[count].backgroundColor = color;
                
            }
        } else if (key == 107 && count < 39) {
            div[count].backgroundColor = noColor;
            divBy = (count-3) % 4 === 0; 
            if(divBy===true) {
                if (count < 39) {
                    div[count-2].backgroundColor = noColor;
                    $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = noColor2;
                    count = count + 3;
                    div[count-1].backgroundColor = color2;
                    $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = color2;
                }
                $(window).scrollTop($('div[class="item-response order-'+(count-1)+'"]').offset().top-sc);
                
            } else
                count++;
            if ($('div[class="item-response order-'+count+'"]').length) {
                div[count].backgroundColor = color;
                
            }
        } else if ([87,96,48].indexOf(key) >= 0)
            answer(0,0);
        else if ([66,97,49].indexOf(key) >= 0)
            answer(0,1);
        else if ([65,98,50].indexOf(key) >= 0)
            answer(1,2);
        else if ([76,99,51].indexOf(key) >= 0)
            answer(2,3);
        else if ([79,100,52].indexOf(key) >= 0)
            answer(3,4);
        else if ([85,101,53].indexOf(key) >= 0)
            answer(4,5);
        else if (key == 102)
            answer(5,5);
        else if (key == 103)
            answer(6,6);
        else if (key == 104) //Numpad 8 = One Black
            comboAnswer(1,1);
        else if (key == 105) //Numpad 8 = One Asian
            comboAnswer(1,2);
        else if (key == 106) //Numpad * = One Latino
            comboAnswer(1,3);
        else if (key == 111) //Numpad / = One Other
            comboAnswer(1,4);
    });
    
}
                   
function answer(a,b) {
    div[count].backgroundColor = noColor;
    divBy = (count-3) % 4 === 0;
    if(divBy===true) {
        $('div[class="item-response order-'+count+'"]').find('input').eq(a).prop('checked',true);
        div[count-2].backgroundColor = noColor;
        $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = noColor2;
        if (count < 38)
            count = count + 4;
        $(window).scrollTop($('div[class="item-response order-'+(count-1)+'"]').offset().top-sc);
        div[count-1].backgroundColor = color2;
        $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = color2;
    } else {
        $('div[class="item-response order-'+count+'"]').find('input').eq(b).prop('checked',true);
        count++;
    }
    if ($('div[class="item-response order-'+count+'"]').length)
        div[count].backgroundColor = color;
}

function comboAnswer(a,b) {
    div[count].backgroundColor = noColor;
    $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = noColor2;
    divBy = (count-3) % 4 === 0;
    if(divBy===true)
        count--;
    $('div[class="item-response order-'+count+'"]').find('input').eq(a).prop('checked',true);
    $('div[class="item-response order-'+(count+1)+'"]').find('input').eq(b).prop('checked',true);
    $(window).scrollTop($('div[class="item-response order-'+(count-1)+'"]').offset().top-sc);
    if (count < 38)
        count = count + 4;
    else if (count === 38)
        count++;
    if ($('div[class="item-response order-'+count+'"]').length) {
        div[count-5].backgroundColor = noColor;
        div[count-1].backgroundColor = color2;
        div[count].backgroundColor = color;
        $('div[class="item-response order-'+count+'"]').closest('tr')[0].style.backgroundColor = color2;
    }
}