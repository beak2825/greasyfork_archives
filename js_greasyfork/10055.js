// ==UserScript==
// @name         PremiumBlizz
// @namespace    http://alphaoverall.com
// @version      0.3
// @description  Make your account a fake K+ account
// @author       AlphaOverall
// @include      http://www.kongregate.com/accounts/Blizzardy3
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/10055/PremiumBlizz.user.js
// @updateURL https://update.greasyfork.org/scripts/10055/PremiumBlizz.meta.js
// ==/UserScript==

function init(){
    //Give yourself that K+ icon
    var name = document.getElementById("profile_hgroup");
    var akicon = document.createElement("span");
    akicon.innerHTML = "<a href=\"#\" onclick=\"lightbox.prototype.initializePremiumMembershipPurchase('username_icon', 'icon_tab'); return false;\">\
                        <span class=\"premium_room_icon spritesite\" id=\"premium_icon\"></span></a>";
    name.insertBefore(akicon, name.childNodes[3]);
    
    //Styles
    GM_addStyle ( "\
        #new_profile #primarywrap { \
            background:#aaa url(http://fc06.deviantart.net/fs71/i/2014/018/7/4/wooper_is_the_definition_of_swag_by_kol98-d72ryk5.png);\
            background-repeat: repeat-y;\
            background-attachment: fixed;\
            background-position: 20% 80px;\
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
    //MAIN styles
    var maincon = document.getElementsByClassName("maincontent")[0];
    maincon.style.backgroundColor = "rgba(255,255,255,0.7)";
    //Uncomment below if you want a slick border :P Well, it's OK
    //maincon.style.border = "thick double #990000"
}

init();