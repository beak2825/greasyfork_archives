// ==UserScript==
// @name         crm-colorsubs
// @namespace    https://tech2.crm6.dynamics.com/
// @version      0.9
// @description  color subs
// @author       x
// @match        https://tech2.crm6.dynamics.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383150/crm-colorsubs.user.js
// @updateURL https://update.greasyfork.org/scripts/383150/crm-colorsubs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //chrome extension
    // https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en

    //firefox extension
    // https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/?src=search

    $(document).ready(function(){

        // add click event to main container
        $('#shell-container').click(checksubs);

        setTimeout(()=>{

            //run on load
            checksubs();

            //run on title click
            $('.ms-crm-inlineheader-content').click(checksubs);

            //run on main container click
            $('#rofContainer').click(checksubs);

            $('section[data-id="CUSTOMER_DETAILS_TAB"]').click(checksubs);



        },10000);

    });



    function checksubs(){
        checkcases();

        setbgcolor();

        var allsubs = $('.ms-crm-data-format-string');
        allsubs = $('ul[data-id="subgrid_Entitlement-GridList"] > li');

        var substatus;
        for(var i=0;i< allsubs.length;i++){



            //substatus = $(allsubs[i]).find('label:nth(1)');
            substatus = $(allsubs[i]).find('span:nth(2)');
            //console.log( 'dd', $(allsubs[i]).find('label:nth(1)').text() );

            if( substatus.text() == "Expired" ){
                substatus.parent().parent().css('background', 'indianred'); //red, crimson
            }

            if( substatus.text() == "Active" ){
                substatus.parent().parent().css('background', 'lawngreen'); //green
            }

            if( substatus.text() == "Cancelled" ){
                substatus.parent().parent().css('background', 'lightgrey'); //green
            }

            if( substatus.text() == "Draft" ){
                substatus.parent().parent().css('background', 'khaki'); //yellow
            }

        }

    }



    function checkcases(){

        //console.log('ss');

        var allsubs = $('.ms-crm-data-format-string');

        allsubs = $('ul[data-id="contactcasessgrid-GridList"] > li');


        var substatus;
        for(var i=0;i< allsubs.length;i++){



            //substatus = $(allsubs[i]).find('label:nth(2)');
            substatus = $(allsubs[i]).find('span:nth(3)');
            //console.log( 'dd', $(allsubs[i]).find('label:nth(1)').text() );

            if( substatus.text() == "Expired" ){
                substatus.parent().parent().css('background', 'indianred'); //red, crimson
            }

            if( substatus.text() == "Resolved" ){
                substatus.parent().parent().css('background', 'lightblue'); //red, crimson
            }

            if( substatus.text() == "Active" ){
                substatus.parent().parent().css('background', 'lawngreen'); //green
            }

            if( substatus.text() == "Cancelled" ){
                substatus.parent().parent().css('background', 'lightgrey'); //green
            }
            if( substatus.text() == "Canceled" ){
                substatus.parent().parent().css('background', 'lightgrey'); //green
            }

            if( substatus.text() == "Draft" ){
                substatus.parent().parent().css('background', 'khaki'); //yellow
            }

        }

    }


        function setbgcolor(){

        $('div[data-id="tabpanel-SUMMARY_TAB"]').css( 'background-color','aqua'); //Customer page
        $('div[data-id="tabpanel-general"]').css( 'background-color','aqua'); //new case
        $('#DashboardScrollView').css( 'background-color','aqua'); //dashboard
        $('div[data-id="editFormRoot"]').css( 'background-color','aqua'); //outbound

        $('textarea[data-id="description.fieldControl-text-box-text"]').css('height','500px'); //action, textarea larger

    }




})();