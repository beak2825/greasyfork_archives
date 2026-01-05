// ==UserScript==
// @name       jawz DM
// @version    1.4
// @author	   jawz
// @description  xx
// @match      https://s3.amazonaws.com/*
// @match      https://www.youtube.com/*
// @require    http://code.jquery.com/jquery-latest.min.js
// @require    https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/13836/jawz%20DM.user.js
// @updateURL https://update.greasyfork.org/scripts/13836/jawz%20DM.meta.js
// ==/UserScript==

if ($('label:contains("Channel Name")').length) {    
    var url = $('span:contains("youtube.com")').text();    
    var popup = window.open(url);
        
    window.onbeforeunload = function (e) { 
        popup.close();
    }
    
    var firstQ = $('div').find('strong:contains("The Type of Entity That Owns or Operates")').eq(0)
    var firstI = $('input').eq(1)
    
    var secondQ = $('div').find('strong:contains("Estimated Age")').eq(0)
    var secondI = $('input').eq(2)
    
    var thirdQ = $('div').find('strong:contains("Ethnicity")').eq(2)
    var thirdI = $('input').eq(3)
    
    
    function createBtn(ans, val, ele) {
        var btn = document.createElement("BUTTON");
        btn.innerHTML = ans;
        btn.type = "button";
        btn.onclick = function() { eval(val); }
        eval(ele);
    }
    
    var timer = setInterval(function(){ listenFor(); }, 250);
}

if (document.URL.indexOf("www.youtube.com") >= 0) {
    $('body').append('<div id="tab" style="width:300px; height: 150px; position:absolute; background-color:grey; left:700px; top:500px; z-index: 1000"></div>')
    $('#tab').draggable();
    dashTbl  = document.createElement('table');
    $('#tab').append(dashTbl);
    dashTbl.style.position = "relative";
    dashTbl.top = '0px';
    dashTbl.width = '100%';
    dashTbl.style.top = '0px';
    dashTbl.style.backgroundColor = "";
    dashTbl.cellSpacing = '1px';
    dashTbl.style.align = "center";
    dashTbl.style.cursor = 'pointer';
    
    for(var i = 0; i < 8; i++) {
        var tr = dashTbl.insertRow();
        if (i == 0)
            dashTbl.rows[i].style.backgroundColor = 'black';
        else
            dashTbl.rows[i].style.backgroundColor = 'lightgrey';
        dashTbl.rows[i].style.color = "black"
        dashTbl.rows[i].style.fontWeight = "bold";
        dashTbl.rows[i].style.height = "22px";
	
        for(var j = 0; j < 3; j++) {
            var td = tr.insertCell();
            td.appendChild(document.createTextNode(''));
            td.style.border = '1px solid black';
            td.align = "center";
        }
    }
    
    dashTbl.rows[0].style.height = '10px';
    
    dashTbl.rows[1].cells[0].innerHTML = "Male";
    dashTbl.rows[2].cells[0].innerHTML = "Female";
    dashTbl.rows[3].cells[0].innerHTML = "Couple";
    dashTbl.rows[4].cells[0].innerHTML = "TV Network";
    dashTbl.rows[5].cells[0].innerHTML = "Large Company";
    
    dashTbl.rows[1].cells[1].innerHTML = "13-21";
    dashTbl.rows[2].cells[1].innerHTML = "22-34";
    dashTbl.rows[3].cells[1].innerHTML = "35-45";
    dashTbl.rows[4].cells[1].innerHTML = "46-65";
    dashTbl.rows[5].cells[1].innerHTML = "65+";
    dashTbl.rows[6].cells[1].innerHTML = "Unknown";
    
    dashTbl.rows[1].cells[2].innerHTML = "Black";
    dashTbl.rows[2].cells[2].innerHTML = "Latino";
    dashTbl.rows[3].cells[2].innerHTML = "Asian";
    dashTbl.rows[4].cells[2].innerHTML = "White";
    dashTbl.rows[5].cells[2].innerHTML = "Other";
    
    dashTbl.rows[6].cells[0].style.backgroundColor = 'black';
    dashTbl.rows[7].cells[0].style.backgroundColor = 'black';
    dashTbl.rows[7].cells[1].style.backgroundColor = 'black';
    dashTbl.rows[6].cells[2].style.backgroundColor = 'black';
    dashTbl.rows[7].cells[2].innerHTML = "Submit";
    dashTbl.rows[7].cells[2].onclick = function(){ 
        var wPos = window.screenX;
        GM_setValue('submit' + wPos, true);
        setTimeout(function(){ GM_deleteValue('submit' + wPos); }, 1000);
    }
    
    for (i = 0; i < 3; i++) { dashTbl.rows[0].cells[i].width = '33%' };
    
    dashTbl.rows[1].cells[0].onclick = function(){ sendMsg(1, 'M'); clickBtn(1, 0, 6); }
    dashTbl.rows[2].cells[0].onclick = function(){ sendMsg(1, 'F'); clickBtn(2, 0, 6); }
    dashTbl.rows[3].cells[0].onclick = function(){ sendMsg(1, 'C'); clickBtn(3, 0, 6); }
    dashTbl.rows[4].cells[0].onclick = function(){ sendMsg(1, 'NW'); clickBtn(4, 0, 6); }
    dashTbl.rows[5].cells[0].onclick = function(){ 
        sendMsg('spec', 'LC'); 
        clickBtn(5, 0, 6);
        clickBtn(6, 1, 7);
        clickBtn(5, 2, 6);
    }
    
    dashTbl.rows[1].cells[1].onclick = function(){ sendMsg(2, '0'); clickBtn(1, 1, 7); }
    dashTbl.rows[2].cells[1].onclick = function(){ sendMsg(2, '1'); clickBtn(2, 1, 7); }
    dashTbl.rows[3].cells[1].onclick = function(){ sendMsg(2, '2'); clickBtn(3, 1, 7); }
    dashTbl.rows[4].cells[1].onclick = function(){ sendMsg(2, '3'); clickBtn(4, 1, 7); }
    dashTbl.rows[5].cells[1].onclick = function(){ sendMsg(2, '4'); clickBtn(5, 1, 7); }
    dashTbl.rows[6].cells[1].onclick = function(){ sendMsg(2, '5'); clickBtn(6, 1, 7); }
    
    dashTbl.rows[1].cells[2].onclick = function(){ sendMsg(3, 'B'); clickBtn(1, 2, 6); }
    dashTbl.rows[2].cells[2].onclick = function(){ sendMsg(3, 'L'); clickBtn(2, 2, 6);}
    dashTbl.rows[3].cells[2].onclick = function(){ sendMsg(3, 'A'); clickBtn(3, 2, 6);}
    dashTbl.rows[4].cells[2].onclick = function(){ sendMsg(3, 'W'); clickBtn(4, 2, 6);}
    dashTbl.rows[5].cells[2].onclick = function(){ sendMsg(3, 'O'); clickBtn(5, 2, 6);}
    
    
    function sendMsg(box, va) {
        var wPos = window.screenX;
        if (box == 'spec')
            GM_setValue('msg' + wPos, ['spec', 'spec'])     
        else
            GM_setValue('msg' + wPos, [box, va])
    }
    
    var timer1 = setInterval(function(){ recordW(); }, 250);
    
    var leftS = GM_getValue('left', 300);
    var topS = GM_getValue('top', 300);
    
    $('#tab').css('top', topS);
    $('#tab').css('left', leftS);
}

function  clickBtn(clk, col, len) {
    for (i=1; i<len; i++) {
        if (i==clk)
            dashTbl.rows[i].cells[col].style.backgroundColor = 'darkgrey';
        else 
            dashTbl.rows[i].cells[col].style.backgroundColor = 'lightgrey';
    }
    
}

function recordW() {
    var tab = $('#tab')
    GM_setValue('left', tab.offset().left)
    GM_setValue('top', tab.offset().top)
}

function listenFor() {
    var wPos = window.screenX;
    
    if (GM_getValue('msg' + wPos)) {
        var temp = GM_getValue('msg' + wPos);
        if (temp[0] == 1)
            firstI.val(temp[1]);
        else if (temp[0] == 2)
            secondI.val(temp[1]);
        else if (temp[0] == 3)
            thirdI.val(temp[1]);
        else if (temp[0] == 'spec') {
            firstI.val('LC');
            secondI.val('6');
            thirdI.val('O');
        }
        
        GM_deleteValue('msg' + wPos);
    }
    if (GM_getValue('submit' + wPos)) {
        if (firstI.val().length && secondI.val().length && thirdI.val().length) 
            $('#submitButton').click();
        
        GM_deleteValue('submit' + wPos);
    }
}
