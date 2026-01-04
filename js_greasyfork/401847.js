// ==UserScript==
// @name         crm-createtemplate
// @namespace    https://tech2.crm6.dynamics.com/
// @version      0.7
// @description  create template
// @author       You
// @match        https://tech2.crm6.dynamics.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401847/crm-createtemplate.user.js
// @updateURL https://update.greasyfork.org/scripts/401847/crm-createtemplate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...


    $(document).ready(function(){



        // add click event to main container
        $('#shell-container').click(createtemplatex);

        setTimeout(()=>{

            $('textarea[data-id="ttg_customerfacingnote.fieldControl-text-box-text"]').click(createtemplatex);

        },10000);

    });




    function createtemplatex(){

        $('textarea[data-id="ttg_customerfacingnote.fieldControl-text-box-text"]').val(

            ''
            //+'Subscription:'+$('div[data-id="entitlementid.fieldControl-LookupResultsDropdown_entitlementid_selected_tag_text"]').text()
            +'Case:'+$('input[data-id="ticketnumber.fieldControl-text-box-text"]').val()
            +'\n'+$('input[data-id="title.fieldControl-text-box-text"]').val()
            //+'\n#Device 1'
            +'\n'
            +'\n'+ $('input[data-id="customerpane_qfc.fullname_compositionLinkControl_firstname.fieldControl-text-box-text"]').val() +' '+ $('input[data-id="customerpane_qfc.fullname_compositionLinkControl_lastname.fieldControl-text-box-text"]').val()
            +'\n'+ $('input[data-id="customerpane_qfc.emailaddress1.fieldControl-mail-text-input"]').val()
            +'\n'+ $('input[data-id="customerpane_qfc.mobilephone.fieldControl-phone-text-input"]').val()
            +'\n'
            //+'\nIssue:'
            //+'\n'
            //+'\nAction:'
            +'\n-lmi'
            +'\n'
            +'\n'
            +'\n'
            +'\n'
            //+'\nOutcome'
            //+'\n-issue resolved'
        )

    }

})();