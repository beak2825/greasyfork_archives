// ==UserScript==
// @name       jawz OCMP7
// @version    1.1
// @description  enter something useful
// @match      
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant      GM_setValue
// @grant      GM_getValue
// @grant      GM_deleteValue
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/11988/jawz%20OCMP7.user.js
// @updateURL https://update.greasyfork.org/scripts/11988/jawz%20OCMP7.meta.js
// ==/UserScript==

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

document.onkeypress=function(e){
    console.log(e.keyCode);
    if (e.keyCode == 49) //1
        GM_setValue('one', getSelectionText());
    else if (e.keyCode == 50) 
        GM_setValue('two', getSelectionText());
    else if (e.keyCode == 51) 
        GM_setValue('three', getSelectionText());
    else if (e.keyCode == 52) 
        GM_setValue('four', getSelectionText());
    else if (e.keyCode == 53) 
        GM_setValue('five', getSelectionText());
    else if (e.keyCode == 54) 
        GM_setValue('six', getSelectionText());
    else if (e.keyCode == 55) 
        GM_setValue('seven', getSelectionText());
    else if (e.keyCode == 56) 
        GM_setValue('eight', getSelectionText());
    else if (e.keyCode == 57) //9
        GM_setValue('nine', getSelectionText());
    else if (e.keyCode == 48) //0
        GM_setValue('ten', getSelectionText());
};

if ($('h2:contains("Verify and Populate Company Data_Infor_URL")').length) {
    var url = $('a')[4].href
        
    var wleft = window.screenX;
    var halfScreen = window.outerWidth;
    var windowHeight = window.outerHeight;
    var specs = ",resizable=yes,scrollbars=yes,toolbar=yes,status=yes,menubar=0,titlebar=yes";
        
    popupX = window.open(url, 'remote1', 'height=' + windowHeight + ',width=' + halfScreen + ', left=' + (wleft + halfScreen) + ',top=0' + specs,false);
    
    window.onbeforeunload = function (e) { popupX.close(); }
    
    $( "input[class='cc-input urlmatchstatus required check_one  answerInput '][value='yes']" ).click();
    $("b:contains('Provide company name')").html('1:: Company Name (required)');
    $("b:contains('Provide address1 field')").html('2:: Address One (required)');
    $("b:contains('Provide address2 field')").html('3:: Address Two');
    $("b:contains('Provide address3 field')").html('<strike>Address Three</strike>');
    $("b:contains('Provide the city')").html('4:: City');
    $("b:contains('Provide the state')").html('5:: State');
    $("b:contains('Provide the zip code')").html('6:: Zip Code');
    $("b:contains('Provide the country')").html('7:: Country');
    $("b:contains('Provide the telephone number')").html('8:: Phone');
    $("b:contains('Provide the fax number')").html('9:: Fax');
    $("b:contains('Provide the company webiste url')").html('0:: Website');
    var timer = setInterval(function(){ listenFor(); }, 250);
}

function listenFor() {
    if (GM_getValue('one')) {
        console.log(GM_getValue('one'));
        //document.getElementById('employees_company').value = GM_getValue('one')
        $( "input[class='cc-input text     companyname required answerInput ']" ).val(GM_getValue('one'))
        GM_deleteValue('one');
    }
    if (GM_getValue('two')) {
        //document.getElementById('employees_company').value = GM_getValue('two')
        $( "input[class='cc-input text     address required answerInput ']" ).val(GM_getValue('two'))
        GM_deleteValue('two');
    }
    if (GM_getValue('three')) {
        //document.getElementById('employees_company').value = GM_getValue('three')
        $( "input[class='cc-input text     phone optional answerInput ']" ).val(GM_getValue('three'))
        GM_deleteValue('three');
    }
    if (GM_getValue('four')) {
        //document.getElementById('employees_company').value = GM_getValue('four')
        $( "input[class='cc-input text     city required answerInput ']" ).val(GM_getValue('four'))
        GM_deleteValue('four');
    }
    if (GM_getValue('five')) {
        //document.getElementById('employees_company').value = GM_getValue('five')
        $( "input[class='cc-input text     state required answerInput ']" ).val(GM_getValue('five'))
        GM_deleteValue('five');
    }
    if (GM_getValue('six')) {
        //document.getElementById('employees_company').value = GM_getValue('six')
        $( "input[class='cc-input text     zipcode optional answerInput ']" ).val(GM_getValue('six'))
        GM_deleteValue('six');
    }
    if (GM_getValue('seven')) {
        //document.getElementById('employees_company').value = GM_getValue('seven')
        $( "input[class='cc-input text     country optional answerInput ']" ).val(GM_getValue('seven'))
        GM_deleteValue('seven');
    }
    if (GM_getValue('eight')) {
        //document.getElementById('employees_company').value = GM_getValue('eight')
        $( "input[class='cc-input text     telephone optional answerInput ']" ).val(GM_getValue('eight'))
        GM_deleteValue('eight');
    }
    if (GM_getValue('nine')) {
        //document.getElementById('employees_company').value = GM_getValue('nine')
        $( "input[class='cc-input text     fax optional answerInput ']" ).val(GM_getValue('nine'))
        GM_deleteValue('nine');
    }
    if (GM_getValue('ten')) {
        //document.getElementById('employees_company').value = GM_getValue('ten')
        $( "input[class='cc-input text     website optional answerInput ']" ).val(GM_getValue('ten'))
        GM_deleteValue('ten');
    }
}