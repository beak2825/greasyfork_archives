// ==UserScript==
// @name         AUTO-LOGIN
// @namespace    https://www.greasyfork.org/fr/scripts/373148-auto-login
// @version      1.9
// @description  try to take over the world!
// @author       cdavid@equipages.fr
// @include      https://site2-vcenter.labo.local/websso/*
// @include      https://site1-vcenter.labo.local/websso/*
// @include      https://192.168.4.3:8443/wsg/*
// @include      https://equipages.pro.dns-orange.fr:4043/login*
// @include      https://192.168.102.1:4043/login*
// @include      https://10.77.0.254:4043/login*
// @include      https://fw-sqy.corp.local:4043/login*
// @include      https://192.168.102.201:10443/login*
// @include      https://192.168.102.202:10443/login*
// @include      https://94.143.81.154:4043/login*
// @include      https://94.143.82.53:4043/login*
// @include      https://*.mouratoglou.com:10443/login*
// @include      https://90.85.133.113:10443/login*
// @include      https://92.103.233.122:10443/login*
// @include      https://172.16.5.254:4043/login*
// @include      https://172.16.6.254:4043/login*
// @include      https://10.*.10.1:10443/login*
// @include      https://172.16.69.50:10400/p/login*
// @include      https://10.*.10.11:10443/login*
// @include      https://10.*.10.12:10443/login*
// @include      https://172.17.26.42/login/*
// @include      https://172.16.165.11/login/*
// @include      https://10.*.10.18/admin/*
// @include      https://10.*.10.38/admin/*
// @include      https://10.255.*
// @include      http://10.36.*
// @include      https://10.36.*
// @include      https://10.24.*
// @include      https://10.37.*
// @include      https://10.38.*
// @include      https://10.99.*
// @include      https://support.equipages.fr/*
// @exclude      https://support.equipages.fr/incident_update.php*
// @exclude      https://support.equipages.fr/incidents.php*
// @include      https://support.fortinet.com/product*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373148/AUTO-LOGIN.user.js
// @updateURL https://update.greasyfork.org/scripts/373148/AUTO-LOGIN.meta.js
// ==/UserScript==


//============================= CHECK ENV.

var base_url =  window.location.origin;
var host =      window.location.host;
var pathArray = window.location.pathname.toString();
console.info(new Date(Date.now()),      'AUTO-LOGIN Info: Start from  ', document.location.href);
console.info(new Date(Date.now()),      'AUTO-LOGIN info: base_url    ', base_url );
console.info(new Date(Date.now()),      'AUTO-LOGIN info: host        ', host     );
console.info(new Date(Date.now()),      'AUTO-LOGIN info: pathArray   ', pathArray);

var TYPE ='';
var USER ='';
var PASS ='';

//============================= DETECT SOURCE TYPE
switch (host) {
    case '10.36.0.36:10303' :    // FORTIGATE LAB
    case '10.36.0.36:10304' :    // FORTIGATE LAB
    case '10.36.10.1' :          // FORTIGATE LAB
    case '10.36.10.2' :          // FORTIGATE LAB
    case '10.36.10.3' :          // FORTIGATE LAB
    case '10.36.10.4' :          // FORTIGATE LAB
    case '10.36.36.36':          // FORTIMANAGER LAB
        TYPE = 'FGT';
        USER = 'admin';
        PASS = 'admin';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        if ( pathArray.indexOf("login") == -1) break; // Bypass autologin
        LOGIN_Fortigate(USER, PASS);
        break;

    case '10.36.0.11' :               // FAC LAB
    case '10.36.0.12' :               // FAC LAB
        TYPE ="FAC";
        USER = 'admin';
        PASS = 'fortinet';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_Fortiauthenticator(USER, PASS);
        break;

    case '194.206.148.177' :       // FORTIGATE SHISEIDO ORMES Cluster
    case '10.37.249.254' :         // FORTIGATE SHISEIDO ORMES Cluster
    case '10.37.249.50' :          // FORTIGATE SHISEIDO ORMES Cluster
    case '10.37.249.51' :          // FORTIGATE SHISEIDO ORMES 1
    case '10.37.249.52' :          // FORTIGATE SHISEIDO ORMES 2
    case '81.252.134.81' :         // FORTIGATE SHISEIDO GIEN  Cluster
    case '10.38.249.254' :         // FORTIGATE SHISEIDO GIEN  Cluster
    case '10.38.249.50' :          // FORTIGATE SHISEIDO GIEN  Cluster
    case '10.38.249.51' :          // FORTIGATE SHISEIDO GIEN  1
    case '10.38.249.52' :          // FORTIGATE SHISEIDO GIEN  2
        TYPE = 'FGT';
        USER = 'equipages';
        PASS = 'Equipages';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        if ( pathArray.indexOf("login") == -1) break; // Bypass autologin
        LOGIN_Fortigate(USER, PASS);
        break;
    case '10.24.162.126'  :         // FORTIGATE  SHISEIDO OXYA
        TYPE = 'FGT';
        USER = 'cyrille.david.ext';
        PASS = 'Shiseido123#';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_Fortigate(USER, PASS);
        break;
    case '10.24.162.103'  :         // FORTIMANAGER  SHISEIDO OXYA
        TYPE = 'FMG/FAZ';
        USER = 'cyrille.david.ext';
        PASS = 'Shiseido123#';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_FortiMananalyzer(USER, PASS);
        break;

    case '192.168.4.3:8443'  :          // RUCKUS vSZ EQUIPAGES
        TYPE = 'VSZ';
        USER = 'admin';
        PASS = '237ef468bd!';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_Ruckus(USER, PASS);
        break;

    case '172.16.69.50'  :                 // FMG/FAZ FortiPoc Thibault Roumezin
        TYPE = 'FMG/FAZ';
        USER = 'admin';
        PASS = 'admin69';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_FortiMananalyzer(USER, PASS);
        break;


    case '10.99.2.1'  :                 // FORTIMANAGER  Voisins
        TYPE = 'FMG/FAZ';
        USER = 'admin';
        PASS = 'HmPLAMwJgYWKQuCGhaOn';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_FortiMananalyzer(USER, PASS);
        break;

    case '10.99.2.2'  :          // FORTIANALYZER Voisins
        TYPE = 'FMG/FAZ';
        USER = 'admin';
        PASS = '0gOsug9lwqzrT8NR8Y8h';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_FortiMananalyzer(USER, PASS);
        break;

    case '10.77.0.254:4043' :            // FORTIGATE VOISINS
    case 'fw-sqy.corp.local:4043' :      // FORTIGATE VOISINS
        TYPE = 'FGT';
        USER = 'cd088fr';
        PASS = 'Squad\'(-';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        if ( pathArray.indexOf("login") == -1) break; // Bypass autologin
        LOGIN_Fortigate(USER, PASS);
        break;

    case 'equipages.pro.dns-orange.fr:4043' :          // FORTIGATE SOPHIA
    case '192.168.102.1:4043' :          // FORTIGATE SOPHIA
        TYPE = 'FGT';
        USER = 'cdavid';
        PASS = 'cd@fgt';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        if ( pathArray.indexOf("login") == -1) break; // Bypass autologin
        LOGIN_Fortigate(USER, PASS);
        break;

    case '94.143.81.154:4043' :         // FORTIGATE BIOMEOSTASIS 1
    case '94.143.82.53:4043' :          // FORTIGATE BIOMEOSTASIS 2
    case '172.16.5.254:4043' :          // FORTIGATE BIOMEOSTASIS internal
    case '172.16.6.254:4043' :          // FORTIGATE BIOMEOSTASIS internal
        TYPE = 'FGT';
        USER = 'equipages';
        PASS = 'Equipages@FGT13';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        if ( pathArray.indexOf("login") == -1) break; // Bypass autologin
        LOGIN_Fortigate(USER, PASS);
        break;

    case 'aca.mouratoglou.com:10443' :  // FORTIGATE MTA
    case 'int.mouratoglou.com:10443' :  // FORTIGATE MTA
    case '90.85.133.113:10443' :        // FORTIGATE HBB
    case '92.103.233.122:10443' :       // FORTIGATE HBB
    case '10.0.10.1:10443'    :         // FORTIGATE MTA
    case '10.0.10.11:10443'   :         // FORTIGATE MTA
    case '10.0.10.12:10443'   :         // FORTIGATE MTA
    case '10.255.10.1:10443'  :         // FORTIGATE MTA
    case '10.255.10.11:10443' :         // FORTIGATE MTA
    case '10.255.10.12:10443' :         // FORTIGATE MTA
    case '10.0.50.1:10443'    :         // FORTIGATE MTA
        TYPE = 'FGT';
        USER = 'cdavid';
        PASS = 'cd@MTA06';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        if ( pathArray.indexOf("login") == -1) break; // Bypass autologin
        LOGIN_Fortigate(USER, PASS);
        break;



    case '10.0.10.18' :                 // UCOPIA MTA
    case '10.0.10.38' :                 // UCOPIA MTA
    case '10.255.10.18' :               // UCOPIA MTA
    case '10.255.10.38' :               // UCOPIA HBB
        TYPE ="ucopia";
        USER = 'admin';
        PASS = 'Mt@Admin06';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_Ucopia(USER, PASS);
        break;
        //*
    case 'site1-vcenter.labo.local' :   // vSphere LABO
    case 'site2-vcenter.labo.local' :   // vSphere LABO
        TYPE ="vSphere LABO";
        USER = 'cyrille@labo.local';
        PASS = 'cyrille';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_vSphere(USER, PASS);
        break;

    case '172.17.26.42' :                // FAC1 OXYA
    case '172.16.165.11' :               // FAC3 OXYA
        TYPE ="FAC";
        USER = 'cdavid';
        PASS = 'cdavidoxya';
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_Fortiauthenticator(USER, PASS);
        break;

    case 'support.equipages.fr' :       // SUPPORT EQUIPAGES
        TYPE ="SUPPORT";
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        LOGIN_SupportEquipages();
        break;

    case 'support.fortinet.com' :       // SUPPORT FORTINET
        TYPE ="Fortinet Registration";
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
        AUTOFILL_SupportFortinet();
        break;

    default :                           // Unknown URL
        TYPE = "UNDEFINED!!!";
        console.info(new Date(Date.now()), 'AUTO-LOGIN info: type is   ', TYPE );
} //======== END switch()



//============================= Function LOGIN_vSphere()

function LOGIN_vSphere(USER,PASS) {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementById("username")                     ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id username : ' ,elements );
        elements.value =    USER;
        elements.focus();
    }

    elements           =    document.getElementById("password")                     ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id password : ' ,elements );
        elements.value =    PASS;
        elements.focus();
    }

    elements           =    document.getElementsByClassName("button blue")          ;
    if (elements)    {
        console.info('Found ',elements.length ,' Class button blue : ' ,elements );
        elements[0].disabled = false;
        window.setTimeout(function(){     elements[0].click();        }, 2000)      ;               //---------> 2 SECOND DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()



//============================= Function LOGIN_Fortigate()

function LOGIN_Fortigate(USER,PASS) {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementById("username")                     ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id username : ' ,elements );
        elements.value =    USER;
    }

    elements           =    document.getElementById("secretkey")                    ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id secretkey : ' ,elements );
        elements.value =    PASS;
    }

    elements           =    document.getElementsByClassName("primary")              ;
    if (elements)    {
        console.info('Found ',elements.length ,' Class login_button : ' ,elements );
        window.setTimeout(function(){     elements[0].click();        }, 2000)      ;               //---------> 2 SECOND DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()



//============================= Function LOGIN_FortiMananalyzer()

function LOGIN_FortiMananalyzer(USER,PASS) {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementById("username")                     ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id username : ' ,elements );
        elements.value =    USER;
    }

    elements           =    document.getElementById("password")                    ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id password : ' ,elements );
        elements.value =    PASS;
    }

    elements           =    document.getElementsByClassName("btn-block")            ;
    if (elements)    {
        console.info('Found ',elements.length ,' Class login_button : ' ,elements );
        window.setTimeout(function(){     elements[0].click();        }, 2000)      ;               //---------> 2 SECOND DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()



//============================= Function LOGIN_Fortiauthenticator()

function LOGIN_Fortiauthenticator(USER,PASS) {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementById("id_username")                  ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id id_username : ' ,elements );
        elements.value =    USER;
    }

    elements           =    document.getElementById("id_password")                  ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id id_password : ' ,elements );
        elements.value =    PASS;
    }

    elements           =    document.getElementsByClassName("submit")               ;
    if (elements)    {
        console.info('Found ',elements.length ,' Class submit: ' ,elements );
        window.setTimeout(function(){     elements[0].click();        }, 2000)      ;               //---------> 2 SECOND DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()


//============================= Function LOGIN_Ucopia()

function LOGIN_Ucopia(USER,PASS) {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementsByName("monlogin")[0]               ;
    if (elements)    {
        console.info('Found ',elements.length ,' Name monlogin : ' ,elements );
        elements.value =    USER;
    }

    elements           =    document.getElementsByName("monpass")[0]                ;
    if (elements)    {
        console.info('Found ',elements.length ,' Name monpass : ' ,elements );
        elements.value =    PASS;
    }

    elements           =    document.getElementsByName("auth")[0]                   ;
    if (elements)    {
        console.info('Found ',elements.length ,' Name auth : ' ,elements );
        window.setTimeout(function(){     elements[2].click();        }, 2000)      ;               //---------> 2 SECOND DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()



//============================= Function LOGIN_SupportEquipages()

function LOGIN_SupportEquipages() {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementsByTagName("input")                  ;
    if (elements)    {
        console.info('Found ',elements.length ,' TagName auth : ' ,elements );
        window.setTimeout(function(){     elements[3].click();        }, 2000)      ;               //---------> 2 SECOND DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()



//============================= Function AUTOFILL_SupportFortinet()

function AUTOFILL_SupportFortinet() {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementById("ctl00_Content_UC_RegWizardControl_RegCodeStep_rbNonGovUser")                  ; // PAGE 1
    if (elements)    {
        console.info('Found ',elements.length ,' ID button  rbNonGovUser       : ' ,elements );
        elements.checked =    true;
    }

    elements           =    document.getElementById("ctl00_Content_UC_RegWizardControl_RegProductStep_UC_OEM_cb_complete")         ; // PAGE 2 & 3
    if (elements)    {
        console.info('Found ',elements.length ,' ID button  UC_OEM_cb_complete : ' ,elements );
        elements.checked =    true;
    }

    elements           =    document.getElementById("ctl00_Content_UC_RegWizardControl_AggrementStep_chkAgreement")                ; // PAGE 4...
    if (elements)    {
        console.info('Found ',elements.length ,' ID button  chkAgreement       : ' ,elements );
        elements.checked =    true;
    }

    elements           =    document.getElementById("ctl00_Content_UC_RegWizardControl_VerificationStep_UC_ContractTerm_cb_complete")  ; // PAGE 5
    if (elements)    {
        console.info('Found ',elements.length ,' ID button  UC_ContractTerm_cb_complete : ' ,elements );
        elements.checked =    true;
    }

    elements           =    document.getElementById("ctl00_Content_UC_RegWizardControl_BTN_Next")                                  ; // PAGE 4 or 5 AutoSubmit
    if (elements)    {
        console.info('Found ',elements.length ,' ID button  NEXT               : ' ,elements );
        window.setTimeout(function(){     elements.click();        }, 500)      ;               //---------> 500m DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()

//============================= Function LOGIN_Ruckus()

function LOGIN_Ruckus(USER,PASS) {
    console.info(new Date(Date.now()),     'AUTO-LOGIN function START  ',arguments.callee.name);
    'use strict';
    var elements = '';

    elements           =    document.getElementById("userName")                     ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id userName : ' ,elements );
        elements.value =    USER;
    }

    elements           =    document.getElementById("password")                    ;
    if (elements)    {
        console.info('Found ',elements.length ,' Id password : ' ,elements );
        elements.value =    PASS;
    }

    elements           =    document.getElementsByClassName("loginBtn")            ;
    if (elements)    {
        console.info('Found ',elements.length ,' Class login_button : ' ,elements );
        window.setTimeout(function(){     elements[0].click();        }, 2000)      ;               //---------> 2 SECOND DELAY
    }

    console.info(new Date(Date.now()),     'AUTO-LOGIN function STOP   ',arguments.callee.name);
} //======== END function()



//------------------------------------------------------------------------------
// window.setTimeout(AUTOFILL_SupportFortinet(), 500);
//------------------------------------------------------------------------------

