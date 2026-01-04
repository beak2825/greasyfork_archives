// ==UserScript==
// @name         CW
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       Ａ ｅ ｓ ｔ ｈ ｅ ｔ ｉ ｃ ｓ
// @icon         http://icons.iconarchive.com/icons/iconsmind/outline/32/Dollar-Sign-icon.png
// @icon64URL    http://icons.iconarchive.com/icons/iconsmind/outline/32/Dollar-Sign-icon.png
// @match        https://workplace.clickworker.com/en/clickworker/jobs/112389/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113865/edit
// @MATCH        https://workplace.clickworker.com/en/clickworker/jobs/126554/edit
// @MATCH        https://workplace.clickworker.com/en/clickworker/jobs/128760/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113870/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119120/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114288/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129173/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113872/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/127200/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114280/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/127901/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113912/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114437/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114292/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114284/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113877/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114436/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113879/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113139/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114286/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/114293/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/113874/edit
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368332/CW.user.js
// @updateURL https://update.greasyfork.org/scripts/368332/CW.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jkeys ={a:65,b:66,c:67,d:68,e:69,f:70,g:71,h:72,i:73,j:74,k:75,l:76,m:77,n:77,o:78,p:80,q:81,r:82,s:83,t:84,u:85,v:86,w:87,x:88,y:89,z:90};
    $("input[name*='google_page']").val("1");
    //Show steps
    jQuery("#task_info_1").show();
    jQuery("#task_wait_1").show();
    jQuery("#worked").show();
    jQuery("#task_one_1").show();
    jQuery("#task_two_1").show();
    jQuery("#task_three_1").show();
    jQuery(".subpages").show();
    jQuery('#task_one_1').show();
    jQuery('#task_two_1').show();
    //Add copy
    var btn = document.createElement("BUTTON");
    var txta = document.createElement("textarea");
    var btnt = document.createTextNode("copy");
    btn.appendChild(btnt);
    document.body.appendChild(btn);
    document.body.appendChild(txta);
    txta.class='copytokey';
    btn.name='customboy';
    //Key click events
    function doc_keyUp(e) {
        if (e.keyCode == jkeys.r) {
            txta.textContent=urlz;
            txta.select();
            try {
                var successful = document.execCommand('copy');
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }
        if (e.keyCode == 90) {showsteps();wins.play();}
    }
    document.addEventListener('keyup', doc_keyUp, false);
    function send(){document.getElementsByName('submit_job')[0].click();}
    //Main functions
    var b = document.getElementsByTagName('font'); // Search term
    var urlz = b[4].textContent; // Target URL
    var searchterm = b[1].textContent; // Search term to variable
    var a = document.getElementsByTagName('u'); // Search type
    var searchtype = a[0].textContent; // Search type to variable
    //Autofill and search windows
    //
    if(searchtype.includes('for this keyword in bing.com')){var searchw = window.open('http://www.bing.com/search?q='+searchterm, "searcher", "width=600, height=800, top=0, left=110");}
    if(searchtype.includes('for this keyword in bing.com')){document.getElementsByTagName("textarea")[0].textContent='http://www.bing.com/search?q='+searchterm.replace(/\s/g, '%20');}
    if(searchtype.includes('for the following keyword on bing.com')){var searchw = window.open('http://www.bing.com/search?q='+searchterm, "searcher", "width=600, height=800, top=0, left=110");}
    if(searchtype.includes('for the following keyword on bing.com')){document.getElementsByTagName("textarea")[0].textContent='http://www.bing.com/search?q='+searchterm.replace(/\s/g, '%20');}
    if(searchtype.includes('for the following keyword on google.com')){var searchw = window.open('https://www.google.com/search?q='+searchterm, "searcher", "width=600, height=800, top=0, left=110");}
    if(searchtype.includes('for the following keyword on google.com')){document.getElementsByTagName("textarea")[0].textContent='https://www.google.com/search?q='+searchterm.replace(/\s/g, '%20');}
    if(searchtype.includes('for this keyword in google.com')){var searchw = window.open('https://www.google.com/search?q='+searchterm, "searcher", "width=600, height=800, top=0, left=110");}
    if(searchtype.includes('for this keyword in google.com')){document.getElementsByTagName("textarea")[0].textContent='https://www.google.com/search?q='+searchterm.replace(/\s/g, '%20');}
    if(searchtype.includes('for this keyword in yahoo.com')){var searchw = window.open('https://search.yahoo.com/search;?p='+searchterm, "searcher", "width=600, height=800, top=0, left=110");}
    if(searchtype.includes('for this keyword in yahoo.com')){document.getElementsByTagName("textarea")[0].textContent='https://search.yahoo.com/search;?p='+searchterm.replace(/\s/g, '%20');}
    if(searchtype.includes('for the following keyword on yahoo.com')){var searchw = window.open('https://search.yahoo.com/search;?p='+searchterm, "searcher", "width=600, height=800, top=0, left=110");}
    if(searchtype.includes('for the following keyword on yahoo.com')){document.getElementsByTagName("textarea")[0].textContent='https://search.yahoo.com/search;?p='+searchterm.replace(/\s/g, '%20');}
    //Auto complete
    var urldz = document.getElementById('research_url_1');
    var abcd = document.getElementById('research_url_1');
    abcd.oninput = function(){document.getElementsByName('submit_job')[0].click();searchw.close();};
    //Show steps
    function showsteps(){
        jQuery("#task_info_1").show();
        jQuery("#task_wait_1").show();
        jQuery("#worked").show();
        jQuery("#task_one_1").show();
        jQuery("#task_two_1").show();
        jQuery("#task_three_1").show();
        jQuery(".subpages").show();
        jQuery('#task_one_1').show();
        jQuery('#task_two_1').show();   
    }
})();