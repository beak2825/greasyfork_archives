// ==UserScript==
// @name         MultiCuneta
// @version      0.1.1
// @description  Acceso fácil a multicunetas para ForoCoches
// @author       Tito Belfiore
// @match        https://www.forocoches.com/*
// @grant        none
// @require 	 http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/15080
// @downloadURL https://update.greasyfork.org/scripts/13854/MultiCuneta.user.js
// @updateURL https://update.greasyfork.org/scripts/13854/MultiCuneta.meta.js
// ==/UserScript==

// BUG: Si no has cerrado la ventanita de "Info para nuevos usuarios" no enviará bien el formulario de login

$(document).ready(function(){

    // TUS CUNETAS
    var cunetas = [
        {
            username: "Cuneta1",
            password: "Contra1"
        },
        {
            username: "Cuneta2",
            password: "Contra2"
        },
        {
            username: "Cuneta3",
            password: "Contra3"          
        }
        // Etc
    ];

    // Get User Index from Get parameter
    var CunetaIndex = getUrlVars().CunetaIndex;

    var UserName = document.getElementsByTagName('strong')[1].firstElementChild.innerText;

    // Check if user is logged in (Another HTML element is the UserName instead)
    if(UserName != "IR ARRIBA  ▲"){ 
        CunetaIndex = getMultiArrayIndex(cunetas, 'username', UserName);

        var MenuNodeList = document.getElementsByClassName('vbmenu_control');

        var LogoutLink = MenuNodeList[6].firstChild.attributes[0].value;

        // Creation of the element to be added to the top menu
        var td  = document.createElement("td");
        td.className = "vbmenu_control";

        var a = document.createElement("a");
        a.id = "listacunetas";
        a.href = "/foro/index.php?nojs=1#listacunetas";
        a.style.cursor = "pointer";
        a.innerText = "Cuentas ";

        td.appendChild(a);

        // Add the element to the top menu  
        MenuNodeList[0].parentNode.appendChild(td);
        // And register it for the click event
        vbmenu_register("listacunetas");

        // Creation of the Accounts selection PopUp
        var PopUpCuentas = '';
        PopUpCuentas += 
            '<div class="vbmenu_popup" id="listacunetas_menu" style="margin-top: 3px; position: absolute; z-index: 50; clip: rect(auto auto auto auto); left: 986.5px; top: 291px; display: none;" align="left">'+
            '<table cellpadding="4" cellspacing="1" border="0"><tbody><tr><td class="thead">Cuentas</td></tr>';
        for (var i in cunetas) {
            if (cunetas[i].username == UserName)
                PopUpCuentas += '<tr><td class="vbmenu_hilite vbmenu_hilite_alink" style="cursor: pointer; background: #5590CC;"><a href="#">';
            else 
                PopUpCuentas += '<tr><td class="vbmenu_option vbmenu_option_alink CunetaTd" style="cursor: default;"><a href="'+LogoutLink+
                    '&CunetaIndex='+i+'">';
            PopUpCuentas += cunetas[i].username + '</a></td></tr>';
        }
        PopUpCuentas += '</tbody></table></div>';

        // Get the PopUp Nodes and insert the new one after them    
        var PopUpNodes = document.getElementsByClassName('vbmenu_popup');
        var LastPopUp = PopUpNodes[3];  
        $(PopUpCuentas).insertAfter(LastPopUp);
        
        // Set style and hover behaviour
        $( "td.CunetaTd a" ).css("width","100%");
        $( "td.CunetaTd a" ).css("display","block");
        $( "td.CunetaTd" ).mouseenter(function() {
            $( this ).css("color", "#FFFFFF");
            $( this ).css("background", "#adadad");
            $( this ).css("cursor", "pointer");
        });
        $( "td.CunetaTd" ).mouseleave(function() {
            $( this ).css("color", "#22229C");
            $( this ).css("background", "#f5f5f5");
            $( this ).css("cursor", "default");
        });
    }
    else if(CunetaIndex && !isNaN(CunetaIndex)){
        // If user is not logged in, log in the new user
        UserName = cunetas[CunetaIndex].username;
        var Password = cunetas[CunetaIndex].password;
        // Get User and password Form Input
        var UsernameInput = document.getElementById('navbar_username');
        var PasswordInput = document.getElementById('navbar_password');
        var RememberInput = document.getElementById('cb_cookieuser_navbar');
        // Set the values
        UsernameInput.value = UserName;
        PasswordInput.value = Password;
        RememberInput.value = 1;    
        // Send the form
        document.forms["log"].submit();
    }
});

//Functions

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getMultiArrayIndex(myArray, property, value){
    for(var i = 0; i < myArray.length; i++) {
        if(myArray[i][property] === value) {
            return i;
        }
    }
}