// ==UserScript==
// @name         PremiumAjbarr
// @namespace    http://alphaoverall.com
// @version      0.1
// @description  Make your account a fake K+ account
// @author       AlphaOverall
// @include      http://www.kongregate.com/accounts/ajbarr
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10056/PremiumAjbarr.user.js
// @updateURL https://update.greasyfork.org/scripts/10056/PremiumAjbarr.meta.js
// ==/UserScript==

function init(){
    //Give yourself that K+ icon
    var name = document.getElementById("profile_hgroup");
    var akicon = document.createElement("span");
    akicon.innerHTML = "<a href=\"#\" onclick=\"lightbox.prototype.initializePremiumMembershipPurchase('username_icon', 'icon_tab'); return false;\">\
                        <span class=\"premium_room_icon spritesite\" id=\"premium_icon\"></span></a>";
    name.insertBefore(akicon, name.childNodes[3]);
    //Change Styles for K+
    GM_addStyle ( "\
        #new_profile #primarywrap { \
            background:#fff url(http://i.imgur.com/2WCQi8V.png);\
            background-repeat: repeat-y;\
            background-attachment: fixed;\
            background-position: 50% 80px;\
            background-size: 50% auto;\
        }\
        #primarylayout .maincontent {\
            padding: 24px 0 30px;\
            width: 970px;\
        }\
        .no_subwrap #subwrap{\
            background: #101010 url(https://cdn1.kongcdn.com/compiled-assets/shared/feature_bottom_separator_black-c153a90d67ebecf2d7780ea332d56af1.gif) repeat-x left top;\
            padding: 2.5em 0 0;\
        }\
        .no_subwrap #footer{\
           border-top: 1px solid #444;\
           color: #AAA;\
        }\
        #subwrap a:link{\
           color: #FFF;\
        }\
        #profile_full_user_bio{\
           background-color: rgba(255, 255, 255, 0.9);\
        }\
    " );
    
    //Stuff I couldn't for some reason change up there^^
    var maincon = document.getElementsByClassName("maincontent")[0];
    maincon.style.backgroundColor = "rgba(255,255,255,0.5)";
    //Uncomment next line if you want a slick border :P Well, it's OK
    //maincon.style.border = "thick double #990000"
}

init();