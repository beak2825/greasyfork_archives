// ==UserScript==
// @name         Improved (autodo)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119192/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119196/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129253/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119192/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/122618/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/127587/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/127903/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119843/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/128664/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129143/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129262/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/128665/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129139/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/128769/edit
// @match        https://workplace.clickworker.com/en/c lickworker/jobs/128769/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/128667/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129158/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129274/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129151/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129257/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129133/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129268/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129135/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119827/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/125758/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/122321/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/122624/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/129251/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/127589/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/122626/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/123261/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/123259/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119186/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/122315/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/125759/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119835/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/122620/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/123312/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119824/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119833/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/122291/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/125752/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119849/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/119837/edit
// @match        https://workplace.clickworker.com/en/clickworker/jobs/126047/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368330/Improved%20%28autodo%29.user.js
// @updateURL https://update.greasyfork.org/scripts/368330/Improved%20%28autodo%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("input[name*='google_page']").val("1");
    $("input[name*='subpage']").val("1");
    document.getElementsByClassName('sevencols selectable')[0].scrollIntoView();

    var autodo = false;
    if (window.location.href === 'https://workplace.clickworker.com/en/clickworker/jobs/119192/edit'||'https://workplace.clickworker.com/en/clickworker/jobs/119196/edit') {
        autodo = true;
    }
    //Notification
    Notification.requestPermission();
    var e = new Notification("Hit Found", {
        body : "Homepage 0.07",
        icon : "http://i.imgur.com/n7qqeJu.jpg",
        tag : "007H"
    });

    //Keys object
    var jkeys = {
        a: 65,
        b: 66,
        c: 67,
        d: 68,
        e: 69,
        f: 70,
        g: 71,
        h: 72,
        i: 73,
        j: 74,
        k: 75,
        l: 76,
        m: 77,
        n: 77,
        o: 78,
        p: 80,
        q: 81,
        r: 82,
        s: 83,
        t: 84,
        u: 85,
        v: 86,
        w: 87,
        x: 88,
        y: 89,
        z: 90
    };
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
    txta.class = 'copytokey';
    btn.name = 'customboy';
    //Key click events
    function doc_keyUp(e) {
        if (e.keyCode == jkeys.r) {
            txta.textContent = urlz;
            txta.select();
            try {
                var successful = document.execCommand('copy');
            } catch (err) {
                console.log('Oops, unable to copy');
            }
        }
        if (e.keyCode == 90) {
            showsteps();
        }
    }
    document.addEventListener('keyup', doc_keyUp, false);

    //Main functions
    var b = document.getElementsByTagName('font'); // Search term
    var urlz = b[4].textContent; // Target URL
    var searchterm = b[1].textContent; // Search term to variable
    var a = document.getElementsByTagName('u'); // Search type
    var searchtype = a[0].textContent; // Search type to variable
    $("#research_url_1").val(urlz);
    $('#google_url_b_1').val(urlz);
    //Autofill and search windows
    if (searchtype.includes('for this keyword in bing.com')) {
        document.getElementsByTagName("textarea")[0].textContent = 'http://www.bing.com/search?q=' + searchterm.replace(/\s/g, '+');
    }
    if (searchtype.includes('for this keyword in google.com')||searchtype.includes('for the following keyword on google.com')||searchtype.includes('for this keyword on google.com')) {
        document.getElementsByTagName("textarea")[0].textContent = 'https://www.google.com/search?q=' + searchterm.replace(/\s/g, '+');
    }
    if (searchtype.includes('for this keyword in yahoo.com')) {
        document.getElementsByTagName("textarea")[0].textContent = 'https://search.yahoo.com/search;?p=' + searchterm.replace(/\s/g, '+');
    }
    //Auto complete
    var urldz = document.getElementById('research_url_1');
    var abcd = document.getElementById('research_url_1');
    abcd.oninput = function () {
        document.getElementsByName('submit_job')[0].click();
        e.close();
    };
    if (autodo) {
        setTimeout(function () {
            document.getElementsByName('submit_job')[0].click();
            e.close();
        }, 1000);
    }
    //Show steps
    function showsteps() {
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