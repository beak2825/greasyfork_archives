// ==UserScript==
// @name         Login Pitt Ohio
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.2
// @author       saibotshamtul (Michael Cimino)
// @description  adds login info to the login screen
// @match        https://works.pittohio.com/mypittohio/user/us_login.asp
// @match        https://works.pittohio.com/mypittohio/Users/Account/AccessDenied?ReturnUrl=%2Fmypittohio%2FLTL%2FSchedule%2FPickup
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18396/Login%20Pitt%20Ohio.user.js
// @updateURL https://update.greasyfork.org/scripts/18396/Login%20Pitt%20Ohio.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

// Your code here...

(function() {
    'use strict';

    var a = document.createElement("div");
    a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;font-size:10pt";
    a.innerHTML = (function(){/*<center>larry@statcowhse.com<br>statco1
    <br/><button id='easybutton' style='color:#aaa;background-color:transparent;border:0px;'>easy</button>
    </center>*/}).toString().slice(14,-3);
    document.body.appendChild(a);
    easybutton.onclick = function(){
        document.querySelector('[name=txtUserName]').value = "larry@statcowhse.com";
        document.querySelector('[name=txtPassword]').value = "statco1";
        Submit.click();
    };
    a.style.left = window.screen.width - a.offsetWidth - 20 + "px";

})();