// ==UserScript==
// @name         Proxer PicPreview
// @namespace    https://greasyfork.org/de/users/83349-deimos
// @version      0.2
// @description  Zeigt Vorschaubilder in den Anime- und Mangalisten sowie in der Suche an
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
// @history      0.1 Vorschaubilder für Manga- und Animelisten
// @history      0.2 Vorschaubilder für die Suche
// @downloadURL https://update.greasyfork.org/scripts/29553/Proxer%20PicPreview.user.js
// @updateURL https://update.greasyfork.org/scripts/29553/Proxer%20PicPreview.meta.js
// ==/UserScript==
var pictureHeight = 100; 

document.addEventListener('DOMContentLoaded', function(event) {
    function changefunction(change) //Ist das Script aktiviert?
    {
        if(GM_getValue("proxPics",0) == 1 ) //aktiviert -> anzeigen
        {
            if(window.location.pathname.split('/')[3] == "anime" || window.location.search === "?s=anime" || window.location.pathname.split('/')[3] == "manga" || window.location.search === "?s=manga")        
                showPics(1);    
            else if (window.location.pathname == "/search")
                showPics(3);
        }
        else //deaktiviert -> verbergen
        {
            if(window.location.pathname.split('/')[3] == "anime" || window.location.search === "?s=anime" || window.location.pathname.split('/')[3] == "manga" || window.location.search === "?s=manga")
                showPics(2);
            else if (window.location.pathname == "/search")
                showPics(4);
        }
    }
    //addAnkerMember(id, modulname, modus, changefunction, memoryName, memoryDefault, zusatz);
    addAnkerMember("proxPics_Anker","Proxer PicPreview",3,changefunction,"proxPics",1);
});

function showPics(type)
{
    var tables = document.getElementsByTagName("table");
    for(i = 0; i<tables.length;i++)
    {
        if(tables[i].id == 'box-table-a')
        {
            var tr = tables[i].rows;
            if(type == 1 | type == 2) //Anime/Manga Listen
            {
                for(a = 2; a<tr.length;a++)
                {
                    if(type==1) //anzeigen
                    {
                        var number = tr[a].children[1].children[0].href;
                        number = number.substring(number.indexOf("info")+5);
                        number = number.substring(0,number.indexOf("#top"));
                        tr[a].children[0].children[0].height = pictureHeight;
                        tr[a].children[0].children[0].src = "https://cdn.proxer.me/cover/"+number+".jpg";
                    }
                    else //verbergen
                    {
                        tr[a].children[0].children[0].height = 20;
                        tr[a].children[0].children[0].src = "/images/status/abgeschlossen.png";
                    }
                }
            }
            else //Suche
            {
                for(a = 1; a<tr.length;a++)
                {
                    if(type== 3) //anzeigen
                    {
                        var number = tr[a].children[1].children[0].href;
                        number = number.substring(number.indexOf("info")+5);
                        number = number.substring(0,number.indexOf("#top"));
                        tr[a].children[0].children[1].height = pictureHeight;
                        tr[a].children[0].children[1].src = "https://cdn.proxer.me/cover/"+number+".jpg";
                    }
                    else //verbergen
                    {
                        tr[a].children[0].children[1].height = 20;
                        tr[a].children[0].children[1].src = "/images/status/abgeschlossen.png";
                    }
                }
            }
        }
    }
}