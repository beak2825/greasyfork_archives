// ==UserScript==
// @name         Codereview
// @namespace    https://greasyfork.org/vi/users/20451-anh-nguyen/
// @version      1.0.0.4
// @description  Auto fill password login
// @author       Paul Nguyen
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @include      /^.*codereview.*$/

// @downloadURL https://update.greasyfork.org/scripts/15504/Codereview.user.js
// @updateURL https://update.greasyfork.org/scripts/15504/Codereview.meta.js
// ==/UserScript==

UPDATEPANELFUNCTION(); 

var prm = Sys.WebForms.PageRequestManager.getInstance();
prm.add_endRequest(EndRequestHandler);
function EndRequestHandler(sender, args) {
    UPDATEPANELFUNCTION();                  
}

function UPDATEPANELFUNCTION() {
   // alert(1);
    jQuery(document).ready(function ($) { 
        if( $('#loginFormSubmit').length  && $('#loginFormUserName').length && $('#loginFormPassword').length)
        {
            $("#loginForm").append( '<input type="button" id="autoLoginSubmitButton" class="loginFormSubmit" value="Login" />');        
            $('#loginFormSubmit').css("display","none");
            $( "#autoLoginSubmitButton" ).click(function() {            
                $('#loginFormUserName').val("paul.nguyen");
                $('#loginFormPassword').val("1234567@");   
                $('#loginFormSubmit').click();
            });
            
        }  
        $("body").prepend('<style> html body div.gwt-PopupPanel.GFJ3TKXBJI div.popupContent div div.GFJ3TKXBA2 div div.GFJ3TKXBL2 div.GFJ3TKXBJ2 div.GFJ3TKXBK2 div.GFJ3TKXBF2.GFJ3TKXBH2 {   width: 300px; }  html body div.gwt-PopupPanel.GFJ3TKXBJI div.popupContent div div.GFJ3TKXBA2 div div.GFJ3TKXBL2 div.GFJ3TKXBJ2 div.GFJ3TKXBK2 div.GFJ3TKXBF2.GFJ3TKXBH2 div.GFJ3TKXBD2.GFJ3TKXBH2 div a.gwt-Anchor {float: right; margin-right: 20px; margin-top: 30px; background-color: #7ac142;     border: 0 solid grey;     border-radius: 5px;     color: white;     cursor: pointer;     display: inline-block;     float: right;     font-family: Arial,Helvetica,sans-serif;     font-size: 10pt;     font-weight: bold;     margin-left: 3px;        padding: 5px;     text-align: center;     text-decoration: none;     text-transform: uppercase;     width: auto;} <style>');
          
        
     });
}