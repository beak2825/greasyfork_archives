// ==UserScript==
// @name       Mini Grind 
// @version    8.8
// @description  Creates Custom Forum Format For Mturk Grind
// @author     Cristo
// @include    http://www.mturkgrind.com/threads*
// @copyright  2012+, You
// @namespace https://greasyfork.org/users/1973
// @downloadURL https://update.greasyfork.org/scripts/2880/Mini%20Grind.user.js
// @updateURL https://update.greasyfork.org/scripts/2880/Mini%20Grind.meta.js
// ==/UserScript==

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
//Do you want to change the Mods Images.
//Search google for transparent images and replace url.
var change_mod_img = "yes";
var url_of_new_mod_image = "http://lulzdepot.com/wp-content/uploads/2014/06/Snoop.gif";
////////////////////////////////////// Don't alter the code below 

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
        uToff = post[v].getElementsByClassName("userinfo")[0].getElementsByClassName("inlineimg");
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
        uToff = post[v].getElementsByClassName("userinfo")[0].getElementsByClassName("inlineimg");
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
        if(uRank){
            uRank.style.display = "none";
        }
    }
    if (user_Achievements == "yes") {
        if (uAchiv){
            uAchiv.style.display = "none";
        }
        if (uAwards){
            uAwards.style.display = "none";
        }
        if (uToff){
            for(var tr = 0; tr < uToff.length; tr++){
                uToff[tr].style.display = "none";
            }
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

if (thanks_below_posts == "yes") {
    var bigThanks = document.getElementsByClassName("postbitlegacy postbitim");
    for (j = 0; j < bigThanks.length; j++){
        if (bigThanks[j].id.indexOf("thanks")>-1){
            bigThanks[j].style.display = "none";
        }
    }
}
if (change_mod_img == "yes") {
    var allimmy = document.getElementsByTagName("img");
    for (var l = 0; l < allimmy.length; l++) {
        var source = allimmy[l].src;
        var simple = source.replace(/[^a-zA-Z ]/g, "");
        if(simple.match(/httpwwwmturkgrindcomimagesugicons\.*/)){
            allimmy[l].src = url_of_new_mod_image;
        }
    }
    
}