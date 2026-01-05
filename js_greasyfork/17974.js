// ==UserScript==
// @name	Smilley BBCode Special Drapeaux 1 by FreedGames only for Dealabs
// @version	1.7.2
// @maj       Pas de retour au début de la zone de saisie aprés insertion d'un smiley
// @description	Liste de nouveaux Smileys
// @include http://*.dealabs.com/*
// @run-at document-end
// @namespace https://greasyfork.org/users/33461
// @downloadURL https://update.greasyfork.org/scripts/17974/Smilley%20BBCode%20Special%20Drapeaux%201%20by%20FreedGames%20only%20for%20Dealabs.user.js
// @updateURL https://update.greasyfork.org/scripts/17974/Smilley%20BBCode%20Special%20Drapeaux%201%20by%20FreedGames%20only%20for%20Dealabs.meta.js
// ==/UserScript==


var smileyarr = {
    "Canada" : "http://www.smiley-lol.com/smiley/drapeaux/canadianflag.gif" ,
    "Allemagne" : "http://www.smiley-lol.com/smiley/drapeaux/drapeaugermany.gif" ,
"Belgique" : "http://www.smiley-lol.com/smiley/drapeaux/belgiq.gif" ,
"Suisse" : "http://www.smiley-lol.com/smiley/drapeaux/drapeausuisse.gif" ,
"France" : "http://www.smiley-lol.com/smiley/drapeaux/drapeaufr.gif" ,
"Italie" : "http://www.smiley-lol.com/smiley/drapeaux/drapeauitalie.gif" ,
"Japon" : "http://www.smileys-gratuits.com/smiley-drapeau/drapeau-21.gif" ,
"Espagne" : "http://www.smiley-lol.com/smiley/drapeaux/drapespagne2.gif" ,
"Japon" : "http://www.smiley-lol.com/smiley/drapeaux/drapeaujapon.gif" ,
"Suede" : "http://www.smiley-lol.com/smiley/drapeaux/drapeausuede.gif" ,
"Russie" : "http://www.smiley-lol.com/smiley/drapeaux/draprussie.gif" ,
"Israel" : "http://www.smiley-lol.com/smiley/drapeaux/drapisrael.gif" ,
"Argentine" : "http://www.smiley-lol.com/smiley/drapeaux/drapargentine.gif" ,
"Monaco" : "http://www.smiley-lol.com/smiley/drapeaux/monaco.gif" ,
"Grande Bretagne" : "http://www.smiley-lol.com/smiley/drapeaux/drapeaugb.gif" ,
"Turquie" : "http://www.smiley-lol.com/smiley/drapeaux/drapeaupayss.gif" ,
"Bresil" : "http://www.smiley-lol.com/smiley/drapeaux/bras.gif" 

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