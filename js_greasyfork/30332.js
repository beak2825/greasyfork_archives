// ==UserScript==
// @name         fly dubai
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://ta.flydubai.com/en/user/makebooking*
// @match        https://ta.flydubai.com/en/user/signin/?ReturnUrl=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30332/fly%20dubai.user.js
// @updateURL https://update.greasyfork.org/scripts/30332/fly%20dubai.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var st ;
    var str;
    var ori ;
    if (window.location.href.includes("https://ta.flydubai.com/en/user/signin/?ReturnUrl=") === true){ 
        //alert('h');
        st = window.location.href;
        str = st.split('track');
        ori = str[1].split("%3b");
        localStorage.setItem("script", "on");
        localStorage.setItem("way", "one");
        localStorage.setItem("ori", ori[0]);
        localStorage.setItem("des", ori[1]);
        localStorage.setItem("adt", ori[2]);
        localStorage.setItem("chd", ori[3]);
        localStorage.setItem("inf", ori[4]);
        localStorage.setItem("dep", ori[5]);
        if (typeof ori[6] !== "undefined"){
            //alert(ori[6]);
            localStorage.setItem("way", "two");
            localStorage.setItem("arr", ori[6]);
        }
        setTimeout(function() {



            //$('#TAPassword').val("A@2016avion");
            $('#pageWrap > div.coreContent.contain > div > div.cmContent > div > form > fieldset > p.primaryButton.floatRight.contain > span > input[type="submit"]').click();
            // window.open('https://ta.flydubai.com/en/user/makebooking/trackMCT;DAC;1;0;0;2017-06-29',self);
        }, 100);


    }
    else{
        if (localStorage.script === "off"){
            st = window.location.href;
            str = st.split('/track');
            ori = str[1].split(";");
            localStorage.setItem("way", "one");
            localStorage.setItem("ori", ori[0]);
            localStorage.setItem("des", ori[1]);
            localStorage.setItem("adt", ori[2]);
            localStorage.setItem("chd", ori[3]);
            localStorage.setItem("inf", ori[4]);
            localStorage.setItem("dep", ori[5]);
            if (typeof ori[6] !== "undefined"){

                localStorage.setItem("way", "two");
                localStorage.setItem("arr", ori[6]);
            }

        }

        $('#flyFrom').click();

        var checkExist = setInterval(function() {
            if ($('#airportSelection').find('a:contains('+localStorage.ori+')').length) {
                $('#airportSelection').find('a:contains('+localStorage.ori+')').click();
                clearInterval(checkExist);
            }
        }, 100);

        var checkExis = setInterval(function() {
            if ($('#airportSelection').find('a:contains('+localStorage.ori+')').length) {
                $('#flyTo').click();
                $('#search').click();
                clearInterval(checkExis);
            }
        }, 100);
        var checkExi = setInterval(function() {
            if ($('#destinationAirportSelection').find('a:contains('+localStorage.des+')').length) {
                $('#destinationAirportSelection').find('a:contains('+localStorage.des+')').click();
                $('#search').click();
                //$('#pageWrap > div.coreContent.contain').click();
                clearInterval(checkExi);
            }
        }, 100);
        $('#adultNumber').find('option:contains('+localStorage.adt+')').prop('selected', true);
        $('#childNumber').find('option:contains('+localStorage.chd+')').prop('selected', true);
        $('#infantNumber').find('option:contains('+localStorage.inf+')').prop('selected', true);
        localStorage.setItem("script", "off");
        var depsplt = localStorage.dep.replace("#","").split("-");

        $('#DepartureDate').val(depsplt[2]+"/"+depsplt[1]+"/"+depsplt[0]);

        if (localStorage.way === "two"){

            var arrsplt = localStorage.arr.replace("#","").split("-");
            $('#dateBack').val(arrsplt[2]+"/"+arrsplt[1]+"/"+arrsplt[0]);
        }
        else{
            // alert('h');
            $('#oneWay').click();
        }



    }
    // Your code here...
})();