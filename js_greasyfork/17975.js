// ==UserScript==
// @name	Smilley BBCode Special Bananas by FreedGames only for Dealabs
// @version	1.0
// @maj       Pas de retour au début de la zone de saisie après insertion d'un smiley
// @description	Liste de nouveaux Smileys
// @include http://*.dealabs.com/*
// @run-at document-end
// @namespace https://greasyfork.org/users/33461
// @downloadURL https://update.greasyfork.org/scripts/17975/Smilley%20BBCode%20Special%20Bananas%20by%20FreedGames%20only%20for%20Dealabs.user.js
// @updateURL https://update.greasyfork.org/scripts/17975/Smilley%20BBCode%20Special%20Bananas%20by%20FreedGames%20only%20for%20Dealabs.meta.js
// ==/UserScript==


var smileyarr = {
    "Banane1" : "http://www.sherv.net/cm/emo/funny/2/banana.gif" ,
"Banane2" : "http://www.sherv.net/cm/emo/funny/2/mexican.gif" ,
"Banane3" : "http://www.sherv.net/cm/emo/funny/2/dance.gif" ,
"Banane4" : "http://www.sherv.net/cm/emo/funny/2/rasta.gif" ,
"Banane5" : "http://www.sherv.net/cm/emo/funny/2/trippy.gif" ,
"Banane6" : "http://www.sherv.net/cm/emo/funny/2/devil.gif" ,
"Banane7" : "http://www.sherv.net/cm/emo/funny/2/banana-santa.gif" ,
"Banane8" : "http://www.sherv.net/cm/emoticons/guns/banana-gun.gif" ,
"Banane9" : "http://www.sherv.net/cm/emo/funny/2/banana-skipping-rope-smiley-emoticon.gif" ,
"Banane10" : "http://www.sherv.net/cm/emo/funny/2/colorful-banana-smiley-emoticon.gif" ,
"Banane11" : "http://www.sherv.net/cm/emo/funny/2/upside-down-banana-smiley-emoticon.gif" ,
"Banane12" : "http://www.sherv.net/cm/emo/funny/2/banana-angel-smiley-emoticon.gif" 
};

function insertSmiley()
{
    textarea = jQuery(this).parents('.formating_text_contener').parent('div').find('textarea');
    if(textarea.length > 0){
        textarea = textarea.get(0);
    }
    else{
        return;
    }

    var scrollTop = textarea.scrollTop;
    var scrollLeft = textarea.scrollLeft;

    var image = this.getElementsByTagName('img')[0].getAttribute("src");
    textarea.focus();
    textarea.value += '[img size="300px"]'+image+"[/img]";
    textarea.scrollTop = scrollTop;
    textarea.scrollLeft = scrollLeft;
}

function dip()
{
    if(typeof jQuery == "undefined")
        return;


    jQuery('.third_part_button').each(function(index, value){
        c=this;

        for(title in smileyarr)
        {
            mm=document.createElement("a");
            mm.href="javascript:;";
            mm.setAttribute("gult",index);
            mm.setAttribute("style",'text-decoration:none');
            mm.innerHTML='<img height="16" src="'+smileyarr[title]+'" alt="'+title+'"/>';
            mm.addEventListener("click", insertSmiley, true);
            c.appendChild(mm);
        }	
    });
}





dip();