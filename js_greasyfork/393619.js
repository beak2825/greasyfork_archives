// ==UserScript==
// @name         Course Enroll
// @namespace    http://tampermonkey.net/
// @version      2.718
// @description  try to take over the world!
// @author       You
// @match        https://sims.sfu.ca/psc/csprd*/EMPLOYEE/SA/c/SA_LEARNER_SERVICES*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/393619/Course%20Enroll.user.js
// @updateURL https://update.greasyfork.org/scripts/393619/Course%20Enroll.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var intv = (29*60 + getRandomInt(45, 55)) * 1000;

    let totalC = GM_getValue ("TotalCount");
    if (!totalC)
        totalC = 1;
    console.log("Total: " + totalC);
    let count = GM_getValue ("COUNT");
    if (!count)
        count = 1;
    let shcount = count + 1;
    console.log(shcount + ' tries in one period...');
    enroll_process();
    GM_setValue("TotalCount", totalC+1);
    if (count === 2) {
        console.log('IN SLEEP MODE...');
        setTimeout(goback_, intv);
        GM_setValue ('COUNT', 1);
    }
    else {
        setTimeout(goback_, 8200);
        GM_setValue ('COUNT', count+1);
    }


    function enroll_process()
    {
        var but1 = document.getElementById('DERIVED_REGFRM1_LINK_ADD_ENRL');
        //var but2 = document.getElementById();
        if (but1) {
            var wc = $('#STDNT_ENRL_SSVW\\$scroll\\$0 img[alt="Wait Listed"]').length;
            if (wc < 2) {
                GM_setValue ("MyURL", window.location.href);
                select_checkbox();
                show_message('Preparing for enrollment...', 1000);
                enroll_submit();
            }
            else {
                console.log('Waiting list fulfilled...');
            }
        }
        else {
            //show_message('Confirming enrollment...', 1000);
            confirm_enroll();

        }
    }

    function select_checkbox()
    {
        var inputs = document.querySelectorAll("input[type='checkbox']");
        for(var i = 0; i < inputs.length; i++) {
            //inputs[i].checked = true;
            inputs[i].click();
        }
    }

    function enroll_submit()
    {
        var enroll_but = document.getElementById('DERIVED_REGFRM1_LINK_ADD_ENRL');
        enroll_but.click();
    }

    function confirm_enroll()
    {
        var confirm_but = document.getElementById('DERIVED_REGFRM1_SSR_PB_SUBMIT');
        var validation_code = $('#win1divSFU_DERIVED_SS5_SFU_CAPTCHA > div > div > font > i').text();
        var validation_input = $('#SFU_DERIVED_SS5_TEXT15');
        validation_input.val(validation_code);
        confirm_but.click();
        setTimeout(icok_enroll, 500);
    }
    function icok_enroll()
    {
        var icok_but = document.getElementById('#ICOK');
        if (icok_but) {
            icok_but.click();
            //setTimeout(goback_, 1000);
        }
    }

    function goback_()
    {
        var MyURL               = GM_getValue ("MyURL");
        window.location.href    = MyURL;
    }

    function show_message(msg, duration)
    {
        let el = document.createElement("div");
        el.setAttribute("style","text-align:center;padding:60px;position:absolute;top:40%;left:45%;background-color:rgba(239,238,238, 0.8);font-size:1.5em;font-family: Georgia, 'Times New Roman', 'Microsoft YaHei', STXihei, '华文细黑', serif;");
        el.innerHTML = msg;
        setTimeout(function(){
            el.parentNode.removeChild(el);
        },duration);
        document.body.appendChild(el);
    }
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
})();