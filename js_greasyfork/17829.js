// ==UserScript==
// @name        DADM-Assistance
// @namespace   http://userscripts.org/users/540298
// @version     1
// @description Permet de récuperer des informations dans la page DADM
// @author       Gremi
// @match        https://dadm.amue.fr/*
// @exclude        https://dadm.amue.fr/dadm/Fiche?action=popupars
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/17829/DADM-Assistance.user.js
// @updateURL https://update.greasyfork.org/scripts/17829/DADM-Assistance.meta.js
// ==/UserScript==

//--- Style our newly added elements using CSS.
GM_addStyle ( multilineStr (
"    #dataDiv {\
        position:               fixed;\
        top:                    0;\
        left:                   0;\
        width:                  210px;\
        \
        \
        margin:                 5px;\
        \
        z-index:                222;\
        padding:                5px 20px;\
    }\
    #b_UpdateData {\
        cursor:                 pointer;\
    }\
    #dataDiv p {\
        color:                  red;\
        background:             white;\
        margin:                 0;\
    }\
    a.go-to-bot {\
        transform: scaleY(-1);\
        position: fixed;\
        z-index: 999;\
        right: 20px;\
        top: 20px;\
	    text-indent: -9999px;\
        background: aliceblue url('http://media.tumblr.com/tumblr_m1tym9evTD1r3we0y.png') no-repeat center 43%;\
        height: 50px;\
        width: 50px;\
        border-radius: 10px;\
        cursor:pointer;\
    }\
    a.back-to-top {\
        position: fixed;\
        z-index: 999;\
        right: 20px;\
        bottom: 20px;\
	    text-indent: -9999px;\
        background: aliceblue url('http://media.tumblr.com/tumblr_m1tym9evTD1r3we0y.png') no-repeat center 43%;\
        height: 50px;\
        width: 50px;\
        border-radius: 10px;\
        cursor:pointer;\
    }"
) );


// Création du bouton de rafraichissement
var b_UpdateData       = document.createElement ('div');
b_UpdateData.setAttribute ('id', 'dataDiv');
b_UpdateData.setAttribute ('class', 'myContainer');
document.body.appendChild (b_UpdateData);

init();

// Action du bouton backToTop
document.getElementById ("backToTop").addEventListener (
    "click", goTop, false);

document.getElementById ("goToBot").addEventListener (
    "click", goBot, false);



function init () {
    // Ajout de l'information : Numero de la fiche
    var fiche = document.createElement ('p');
    fiche.setAttribute ('id', 'fiche');
    fiche.innerHTML = getFiche ();
    document.getElementById ("dataDiv").appendChild (fiche);
    
    // Ajout de l'information : Nom du site
    var site = document.createElement ('p');
    site.setAttribute ('id', 'site');
    site.innerHTML = getSite ();
    document.getElementById ("dataDiv").appendChild (site);
    
    // Ajout de l'information : Temps Total Prestataire
    var tempsTotalPresta = document.createElement ('p');
    tempsTotalPresta.setAttribute ('id', 'tempsTotalPresta');
    tempsTotalPresta.innerHTML = getTempsTotalPrestaVal ();
    document.getElementById ("dataDiv").appendChild (tempsTotalPresta);
    
    var $ = unsafeWindow.jQuery;
    $('body').prepend('<a id="backToTop" class="back-to-top">Back to Top</a>');
    
    $('body').append('<a id="goToBot" class="go-to-bot">Go to Bot</a>');

}


function getFiche () {
    var $ = unsafeWindow.jQuery;
    var fiche = null;
    try {
        fiche = $('#col3_content h2')[0].textContent;
        if (fiche.substring(8,0) == "Fiche N°") {
            fiche = fiche.substring(8);
        }
        else {
            fiche = "Fiche non trouvée";
        }
    }
    catch(err) {
         fiche = "Champ fiche non trouvée";
    }
    
    return fiche;
}

function getSite () {
    var $ = unsafeWindow.jQuery;
    var site = null;
    try {
        site = $('#td_sites')[0].textContent;
    }
    catch(err) {
         site = "Champ site non trouvé";
    }
    
    return site;
}

function getTempsTotalPrestaVal () {
    var $ = unsafeWindow.jQuery;
    var tempsTotalPrestaVal = null;
    try {
        tempsTotalPrestaVal = $('td:contains("Temps total de traitement Prestataire :")').parent().children()[1].textContent;
        }
    catch(err) {
         tempsTotalPrestaVal = "Champ tempsTotalPresta non trouvé";
    }
    
    return tempsTotalPrestaVal;
}

function multilineStr (string) {
    var str = string;
    str     = str.replace (/^[^\/]+\/\*!?/, '') // Strip function () { /*!
            .replace (/\s*\*\/\s*\}\s*$/, '')   // Strip */ }
            //.replace (/\/\/.+$/gm, '') // Double-slash comments wreck CSS. Strip them.
            ;
    return str;
}

function goTop (string) {
   var $ = unsafeWindow.jQuery;
   $('html, body').animate({
		scrollTop: 0
	}, 500);
	return false;
}

function goBot (string) {
   var $ = unsafeWindow.jQuery;
   $('html, body').animate({
		scrollTop: $(document).height()
	}, 500);
	return false;
}