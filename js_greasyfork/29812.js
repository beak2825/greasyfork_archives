// ==UserScript==
// @name         Proxer Freedome
// @namespace    https://greasyfork.org/de/users/83349-deimos
// @version      0.1
// @description  Entfernt die Vorschaubilder für 18+ Bilder in der Proxer Gallery
// @author       Deimos
// @run-at       document-start
// @include      http://proxer.me/*
// @include      https://proxer.me/*
// @include      http://www.proxer.me/*
// @include      https://www.proxer.me/*    
// @require      https://greasyfork.org/scripts/12981-proxer-userscript-anker/code/Proxer-Userscript-Anker.js?version=108560
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/29812/Proxer%20Freedome.user.js
// @updateURL https://update.greasyfork.org/scripts/29812/Proxer%20Freedome.meta.js
// ==/UserScript==

//############################# Einbinden des Userscript Anker #############################
function changeFree(change) //Ist das Script aktiviert?
{
    if(GM_getValue("proxFree",0) == 1 ) //aktiviert
    {
        if(window.location.href.indexOf("gallery?s=category&id=")!==-1 ) //Gallery
        {      
            var category = document.getElementsByClassName("inner")[0].getElementsByTagName("h3")[0].innerHTML;
            category = category.substring(20).replace('&amp; ','_').replace(' ','_').toLowerCase();
            if(category.localeCompare("ecchi")===0)
                category = "pantsu";
            if(category.length>30) //Bug in Kategorie 22 Page 1 zeigt keinen Kategorie Namen an
                category = "pantsu";
            var id = window.location.search.substring(15,17);
            var url = '//cdn.proxer.me/gallery/details/anime_und_manga_52/'+category+"_"+id+'/';
            var divs = document.getElementsByClassName("outer")[0].getElementsByTagName("div");           

            for(i = 0; i<divs.length;i++)
            {
                if(divs[i].style.backgroundImage.localeCompare('url("/images/misc/gallery_explicit.png")') === 0 )
                {
                    var number = divs[i].id.substr(5);
                    divs[i].style.backgroundImage= "url("+url+number+")";
                }                 
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', function(event) {
    //addAnkerMember(id, modulname, modus, changefunction, memoryName, memoryDefault, zusatz);
    addAnkerMember("Freedome_Anker","Proxer Freedome",3,changeFree,"proxFree");
});