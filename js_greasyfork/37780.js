// ==UserScript==
// @name        UPM Desk Helper Task features
// @version 2.1
// @description Adds live example button, with styling.
// @include     https://hclupm.service-now.com/com.glideapp.servicecatalog_cat_item_view*
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/165801
// @downloadURL https://update.greasyfork.org/scripts/37780/UPM%20Desk%20Helper%20Task%20features.user.js
// @updateURL https://update.greasyfork.org/scripts/37780/UPM%20Desk%20Helper%20Task%20features.meta.js
// ==/UserScript==

/*--- Create a button in a container div.  It will be styled and
    positioned with CSS.
*/

// var LanguageEl                 = $('#element\\.sys_original\\.IO:83dea21da00075081a622dc9724e5cff').val();
var CallerValueSRQ = {}; // Globally scoped object following User inspect changes
var zNode       = document.createElement ('div');


// Delay in milliseconds for automatic changes so that OneDesk can keep up
var defaultDelay                 = 140; //old 140
var defaultDelay2                = 400;
var valWithDelayQueue           = new Array();
var valWithDelayInProcess       = false;


this.$ = this.jQuery = jQuery.noConflict(true);



$.fn.extend({
    valWithDelay: function( newValue, delay ) {
        if ( valWithDelayQueue.length && this === valWithDelayQueue[0]['target'] ) {
            // Running the first queued entry, remove it from queue
            valWithDelayQueue.splice( 0, 1 );
        }
        var target = this;
        if ( delay === undefined ) {
            delay = defaultDelay;
            if ( target.is( 'textarea' ) ) {
                delay = 0;
            }
        };
        var oldValue = this.val()
        if ( newValue !== oldValue ) {
            // Support queueing
            if ( valWithDelayInProcess ) {
                valWithDelayQueue.push( { target: this, newValue: newValue, delay: delay } );
            } else {
                valWithDelayInProcess = true;
                var wasFocused = $( ':focus' );
                target.focus();
                target.prop( 'disabled',  true ); // Disable user-editability to avoid
//                target.val( '' );
                setTimeout(function(){
                    target.val( newValue );
                    setTimeout(function(){
    //                    target.triggerHandler( 'focus' ); // Trigger OneDesk handlers without switching focus
                        target.css( 'background-color', changedBgColor );
                        target.prop( 'disabled',  false ); // Restore user-editability a bit before blur
                        setTimeout(function(){
                            target.blur();
                            target.prop( 'disabled',  true ); // Disable user-editability
                            wasFocused.focus(); // Restore focus
                            setTimeout(function(){
                                target.change();
                                target.prop( 'disabled',  false ); // Restore user-editability finally
                                valWithDelayInProcess = false;
                                if ( valWithDelayQueue.length ) {
                                    // There is a queue, continue with the next one
                                    setTimeout(function(){
                                        valWithDelayQueue[0]['target'].valWithDelay( valWithDelayQueue[0]['newValue'], valWithDelayQueue[0]['delay'] );
                                    }, delay );
                                }
                            }, delay );
                        }, delay );
                    }, delay );
                }, delay );

            }
        }
    }
});

$.fn.extend({
    valWithDelay2: function( newValue, delay ) {
        if ( valWithDelayQueue.length && this === valWithDelayQueue[0]['target'] ) {
            // Running the first queued entry, remove it from queue
            valWithDelayQueue.splice( 0, 1 );
        }
        if ( delay === undefined ) {
            delay = defaultDelay2;
        }
        var target = this;
        var oldValue = this.val();
        if ( newValue !== oldValue ) {
            // Queue support
            if ( valWithDelayInProcess ) {
                valWithDelayQueue.push( { target: this, newValue: newValue, delay: delay } );
            } else {
                valWithDelayInProcess = true;    
                target.focus();
                setTimeout(function(){
                    target.val( newValue );
                    target.css( 'background-color', changedBgColor );
                    setTimeout(function(){
                        target.blur();
                        setTimeout(function(){
                            target.change();
                            valWithDelayInProcess = false;
                            if ( valWithDelayQueue.length ) {
                                valWithDelayQueue[0]['target'].valWithDelay2( valWithDelayQueue[0]['newValue'], valWithDelayQueue[0]['delay'] );
                            }
                        }, delay );
                    }, delay );
                }, delay );

            }
        }
    }
});




zNode.innerHTML = '<button id="myButton" type="button">'
                + 'Password Reset</button>'
                ;
zNode.setAttribute ('id', 'myContainer');
document.body.appendChild (zNode);

//--- Activate the newly added button.
document.getElementById ("myButton").addEventListener (
    "click", ButtonClickAction, false
);

//ADDED
document.onkeyup=function(e){
  var e = e || window.event; // for IE to cover IEs window event-object
  if(e.altKey && e.which == 85) {

       var CIval = document.getElementById('sys_display.IO:2a5b2e9da0cc35081a622dc9724e5ced');
            CIval.value = "SAP G1 MM - Material Management - Glo";
   
    
 var Summadyval = document.getElementById('IO:c130f611a04075081a622dc9724e5cae');
            Summadyval.value = "SAP UP6 Password reset";
    
var Descriptionval = document.getElementById('IO:0780ba11a04075081a622dc9724e5c5e');
            Descriptionval.value = "The user called and requested a new SAP password/account unlocking for hes SAP account.";
      
      return false;
  }

    //ADDED NEW BUTTON

    // ADDED NEW BUTTON


    
    //ADDED
document.onkeyup=function(e){
  var e = e || window.event; // for IE to cover IEs window event-object
  if(e.altKey && e.which == 76) {

       var CIval = document.getElementById('sys_display.IO:2a5b2e9da0cc35081a622dc9724e5ced');
            CIval.value = "Active Directory Platf";
   
    
 var Summadyval = document.getElementById('IO:c130f611a04075081a622dc9724e5cae');
            Summadyval.value = "Griffin account locked";
    
var Descriptionval = document.getElementById('IO:0780ba11a04075081a622dc9724e5c5e');
            Descriptionval.value = "Griffin account locked - I unlock the user account which resolves the issue.";
      
      return false;
  }
}


    
}


function ButtonClickAction (zEvent) {
    /*--- For our dummy action, we'll just add a line of text to the top
        of the screen.
    */
    var zNode       = document.createElement ('p');
   // var LanguageEl  = ('Finnish');
 //   alert('test0');

  //              var Language = document.getElementById('IO:83dea21da00075081a622dc9724e5cff');
  //          Language.value = "Finnish";
  //  alert('test1');
    
    // variable: sys_display.IO:2a5b2e9da0cc35081a622dc9724e5ced
    
    
    
    
 var CIval = document.getElementById('sys_display.IO:2a5b2e9da0cc35081a622dc9724e5ced');
            CIval.value = "Active Directory Platf";
   
    
 var Summadyval = document.getElementById('IO:c130f611a04075081a622dc9724e5cae');
            Summadyval.value = "New Griffin password";
    
var Descriptionval = document.getElementById('IO:0780ba11a04075081a622dc9724e5c5e');
            Descriptionval.value = "New Griffin password reset was done and a new password was sent to the user.";
    
//    var ContactTypeval = document.getElementById('sys_original.sc_req_item.u_source');
 //           ContactTypeval.value = "Phone";


window.location.href = "mailto:@sms.upm.com?subject=Uusi salasanasi on:"+ user.first_name +"&body=%20";

    LanguageEl.val( 'Finnish' );
alert('test');
    zNode.innerHTML = 'The button was clicked.';
    document.getElementById ("myContainer").appendChild (zNode);
}



//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr ( function () {/*!
    #myContainer {
        position:               absolute;
        top:                    0;
        left:                   0;
        font-size:              20px;
        background:             orange;
        border:                 3px outset black;
        margin:                 5px;
        opacity:                0.9;
        z-index:                1100;
        padding:                5px 20px;
    }
    #myButton {
        cursor:                 pointer;
    }
    #myContainer p {
        color:                  red;
        background:             white;
    }
*/} ) );

function multilineStr (dummyFunc) {
    var str = dummyFunc.toString ();
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            .replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}