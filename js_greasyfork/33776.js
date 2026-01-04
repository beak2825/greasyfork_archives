// ==UserScript==
// @name         Moodle auto sing in
// @name:he           כניסה אוטומטית למודל 
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @description:he  מאפשר להכנס למודל של הטכניון מהר 
// @author       You
// @include      https://sason-p.technion.ac.il/*
// @match        https://moodle.technion.ac.il/my/
// @match        https://moodle.technion.ac.il/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33776/Moodle%20auto%20sing%20in.user.js
// @updateURL https://update.greasyfork.org/scripts/33776/Moodle%20auto%20sing%20in.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //
    function myFunction(){
        document.forms[0].elements["j_username"].value="CHANGE_USENAME@campus.technion.ac.il";
        document.forms[0].elements["EmaiL"].value="CHANGE_USENAME@campus.technion.ac.il";// HERE ALSO!!!
        //document.forms[0].elements[4].value="campus.technion.ac.il";
        document.forms[0].elements["j_password"].value="CHANGE_PASSWORD";
        document.forms[0].elements["PasswD"].value="CHANGE_PASSWORD";// HERE ALSO!!!
        var classt = document.getElementsByClassName('btn btn-primary');
        document.forms[0].elements["idenT_conT"].click();
    }

    function redirectME() {
        var classt = document.getElementsByClassName('usertext');
        if (classt.length === 0) {
            window.location.href = 'https://moodle.technion.ac.il/auth/shibboleth/index.php';
        }

    }
    function redirectME2() {
        //var classt = document.getElementsByClassName('usertext');
        if (document.referrer.includes('sason')) {
            window.location.href = 'https://moodle.technion.ac.il/my/';
        }

    }

    var tnai=window.location.host;
    if (tnai=="moodle.technion.ac.il") {
        redirectME2();
        redirectME();
    } else if (tnai=="sason-p.technion.ac.il") {
        setTimeout(myFunction, 2000);
    } else {
    }

})();