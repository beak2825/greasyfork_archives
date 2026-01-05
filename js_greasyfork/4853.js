// ==UserScript==
// @name         Mini Grind (with thanks-hiding fix mod)
// @version      7.0c
// @description  For mturkgrind forum, can hide user titles, ranks, achievements, rep, stats, sig, and thanks.
// @namespace    mturkgrind
// @author       Cristo
// @include      http://www.mturkgrind.com/threads*
// @copyright    2012+, You
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/4853/Mini%20Grind%20%28with%20thanks-hiding%20fix%20mod%29.user.js
// @updateURL https://update.greasyfork.org/scripts/4853/Mini%20Grind%20%28with%20thanks-hiding%20fix%20mod%29.meta.js
// ==/UserScript==

// modified by clickhappier to fix broken thanks-hiding method that had caused title of all posts, and body of some posts, to be hidden

//Do you want to turn off
var user_titles = "yes";
var user_ranks = "yes";
var user_Achievements = "yes";
var user_reputation = "yes";
var user_stats = "yes";
var user_contact = "yes";
var user_online = "yes";
var user_signature = "yes";
var thanks_below_posts = "yes";
//////////////////////////////////////
var uTitle;
var uRank;
var uAchiv;
var uAwards;
var uToff;
var uRep;
var uStats;
var uContact;
var uOnline;
var uSig;

var post = document.getElementsByClassName("postdetails");
for (v = 0; v < post.length; v++) {
    if(post[v].getElementsByClassName("etiket_postbit_alanI_usertitle")[0]) {

        uTitle = post[v].getElementsByClassName("etiket_postbit_alanI_usertitle")[0];
        uRank = post[v].getElementsByClassName("etiket_postbit_alanI_rank")[0];
        uAchiv = post[v].getElementsByClassName("usertitle")[0];
        uAwards = post[v].getElementsByClassName("usertitle")[1];
        uToff = post[v].getElementsByClassName("inlineimg")[0];
        uRep = post[v].getElementsByClassName("etiket_postbit_alanI_postbit_reputation")[0];
        uStats = post[v].getElementsByClassName("etiket_postbit_alanI_userinfo_extra")[0];
        uContact = post[v].getElementsByClassName("etiket_postbit_alanI_imlinks")[0];
        if (post[v].getElementsByClassName("etiket_postbit_alanI_durumu_iceride")[0]) {
            uOnline = post[v].getElementsByClassName("etiket_postbit_alanI_durumu_iceride")[0];
        } else if (post[v].getElementsByClassName("etiket_postbit_alanI_durumu_cevrimdIsI ")[0]) {
            uOnline = post[v].getElementsByClassName("etiket_postbit_alanI_durumu_cevrimdIsI ")[0];
        }
        uSig = post[v].getElementsByClassName("signaturecontainer")[0];
    } else if (post[v].getElementsByClassName("userinfo_extra")[0]) {

        uTitle = post[v].getElementsByClassName("usertitle")[0];
        uRank = post[v].getElementsByClassName("rank")[0];
        uAchiv = post[v].getElementsByClassName("usertitle")[1];
        uAwards = post[v].getElementsByClassName("usertitle")[2];
        uToff = post[v].getElementsByClassName("userinfo")[0].getElementsByClassName("inlineimg")[1];
        uRep = post[v].getElementsByClassName("postbit_reputation")[0];
        uStats = post[v].getElementsByClassName("userinfo_extra")[0];
        uContact = post[v].getElementsByClassName("imlinks")[0];
        uOnline = post[v].getElementsByClassName("inlineimg onlinestatus")[0];
        uSig = post[v].getElementsByClassName("signature restore")[0];
    }
    if (user_titles == "yes") {
        uTitle.style.display = "none";
    }
    if (user_ranks == "yes") {
        uRank.style.display = "none";
    }
    if (user_Achievements == "yes") {
        if (uAchiv){
            uAchiv.style.display = "none";
        }
        if (uAwards){
            uAwards.style.display = "none";
        }
        if (uToff){
            uToff.style.display = "none";
        }
    }
    if (user_reputation == "yes") {
        uRep.style.display = "none";
    }
    if (user_stats == "yes") {
        uStats.style.display = "none";
    }
    if (user_contact == "yes") {
        uContact.style.display = "none";
    }
    if (user_online == "yes") {
        uOnline.style.display = "none";
    }
    if (user_signature == "yes") {
        if(post[v].getElementsByClassName("signature restore")[0]) {
            uSig.style.display = "none";
        }
       
    }
}

// begin mod
if (thanks_below_posts = "yes") {
    var thanksBoxes = $( 'li[id^="post_thanks_box_"]' );
    thanksBoxes.hide();
//    var bigThanks = document.getElementsByClassName("title");
//    for (j = 0; j < bigThanks.length; j++){
//        bigThanks[j].style.display = "none";
//        var handle = bigThanks[j].parentNode.parentNode;
//        handle.style.display = "none";
//    }
}
// end mod