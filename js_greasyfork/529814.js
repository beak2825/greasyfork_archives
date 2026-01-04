// ==UserScript==
// @name         Szinhazas Script
// @version      1.25
// @license      MIT
// @namespace    http://tampermonkey.net/
// @description  Szinhaz script
// @author       Hamid

// @match        https://www.tasz.ro/eloadasok/*
// @match        https://www.csikijatekszin.ro/hu/program*
// @match        https://nemzetiszinhaz.ro/program-tm/*
// @match        https://szinhaz.ro/havi-program/*
// @match        https://www.huntheater.ro/musor/program/*
// @match        https://figura.ro/event/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://szinhaz.ro&size=64
// @match        https://www.huntheater.ro/eloadas/666/tango/

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/529814/Szinhazas%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/529814/Szinhazas%20Script.meta.js
// ==/UserScript==

var script_link = "https://greasyfork.org/fr/scripts/529814-szinhazas-script";

const sawListCsikSztGy = [
    // Szentgyörgyiek (TASZ)
    "https://www.tasz.ro/eloadasok/mikor-lesz-nyar/",
    "https://www.tasz.ro/eloadasok/a-vihar/",
    "https://www.tasz.ro/eloadasok/a-per/",
    // Csíkiak (Csíkijátékszín)
    "https://www.csikijatekszin.ro/hu/eloadasok/a-muzsika-hangja",
    "https://www.csikijatekszin.ro/hu/eloadasok/irani-konferencia",
    "https://www.csikijatekszin.ro/hu/eloadasok/asokapa",
    "https://www.csikijatekszin.ro/hu/eloadasok/kovacs-janos-meghal",
    "https://www.csikijatekszin.ro/hu/eloadasok/az-apa",
    "https://www.csikijatekszin.ro/hu/eloadasok/maro",
    "https://www.csikijatekszin.ro/hu/eloadasok/hegedus-a-hazteton-1",
    "https://www.csikijatekszin.ro/hu/eloadasok/tortfeher",
    "https://www.csikijatekszin.ro/hu/eloadasok/banyavirag",
    // Gyergyóiak (Figura)
    "https://figura.ro/play/hu/269",
    "https://figura.ro/play/hu/280",
    "https://figura.ro/play/hu/282",
    "https://figura.ro/play/hu/284",
    "https://figura.ro/play/hu/288",
    "https://figura.ro/play/hu/289"
    ];
const todoListCsikSztGy = [
    // Szentgyörgyiek (TASZ)
    "https://www.tasz.ro/eloadasok/angyal-szallt-le-babilonban/",
    // Csíkiak (Csíkijátékszín)
    "https://www.csikijatekszin.ro/hu/eloadasok/buborekok",
    "https://www.csikijatekszin.ro/hu/eloadasok/agamemnon",
    // Gyergyóiak (Figura)
    "https://figura.ro/play/hu/281",
    "https://figura.ro/play/hu/287",
    "https://figura.ro/play/hu/293",
    "https://figura.ro/play/hu/281"
     ];

const sawListMvCj = [
    // Marosvásárhelyiek (Tompa Miklós)
    "https://nemzetiszinhaz.ro/play/haz-a-blokkok-kozott/?comp=TM",
    "https://nemzetiszinhaz.ro/play/az-igazsag-gyertyai/?comp=TM",
    "https://nemzetiszinhaz.ro/play/csonak/?comp=TM",
    "https://nemzetiszinhaz.ro/play/illatszertar-2/?comp=TM",
    "https://nemzetiszinhaz.ro/play/liselotte-es-a-majus/?comp=TM",
    "https://nemzetiszinhaz.ro/play/karamazovok/?comp=TM",
    "https://nemzetiszinhaz.ro/play/alaszka-yorick-studio/?comp=TM",
    "https://nemzetiszinhaz.ro/play/az-anya/?comp=TM",
    // Kolozsváriak
    "https://www.huntheater.ro/eloadas/534/romeo-es-julia/",
    "https://www.huntheater.ro/eloadas/606/rokonok/",
    "https://www.huntheater.ro/eloadas/502/hegedus-a-hazteton/",
    "https://www.huntheater.ro/eloadas/661/janovics/",
    "https://www.huntheater.ro/eloadas/608/ifju-barbarok/",
    "https://www.huntheater.ro/eloadas/684/tom-sawyer/"
    ];
const todoListMvCj = [
    // Marosvásárhelyiek (Tompa Miklós)
    "https://nemzetiszinhaz.ro/play/canin/?comp=LR",
    "https://nemzetiszinhaz.ro/play/ierbar/?comp=LR",
    // Kolozsváriak
    "https://www.huntheater.ro/eloadas/602/hamlet/",//2h 45' egy szünettel (I. rész: 1h 50', II. rész: 40')
    "https://www.huntheater.ro/eloadas/666/tango/"
    ];
const uhSawList = [
    // Udvarhelyiek (Tompa László)
    "A per",
    "Leenane szépe",
    "10",
    "EMIGRÁNSOK",
    "Élet-ritmusra",
    "Black comedy"
    ];
const uhTodoList = [
    // Udvarhelyiek (Tompa László)
    "Barokk ballada"
    ];

(function() {
    'use strict';
    const linkCollection = document.getElementsByTagName("a");
    for (var i=0; i < linkCollection.length; i++){
        setSaw(sawListCsikSztGy, linkCollection[i].href, linkCollection[i].parentNode);
        setSaw(sawListMvCj, linkCollection[i].href, linkCollection[i].parentNode.parentNode.parentNode);
        setSaw(uhSawList, linkCollection[i].title, linkCollection[i].parentNode.parentNode.parentNode);

        setToSee(todoListCsikSztGy, linkCollection[i].href, linkCollection[i].parentNode);
        setToSee(todoListMvCj, linkCollection[i].href, linkCollection[i].parentNode.parentNode.parentNode);
        setToSee(uhTodoList, linkCollection[i].title, linkCollection[i].parentNode.parentNode.parentNode);
    }
})();

function setSaw(myColl, myCompareStr, greenElement){
    if(myColl.includes(myCompareStr)) greenElement.style.backgroundColor = 'green';
}
function setToSee(myColl, myCompareStr, pinkElement){
    if(myColl.includes(myCompareStr)){
        pinkElement.style.backgroundColor = 'pink';
        // pinkElement.scrollIntoView();
    }
}

function checkTickets(){
    if(document.location.href == "https://www.huntheater.ro/eloadas/666/tango/"){
      var divCollection = document.getElementsByClassName("pcalholder elprg-piros");
      for (var i=0; i < divCollection.length; i++){
          if(divCollection[i].parentElement.tagName == "A") alert("Van jegy!!!");
          else divCollection[i].style.background = "red";
      }
      divCollection = document.getElementsByClassName("pcalholder elprg-sarga");
      for (i=0; i < divCollection.length; i++){
          if(divCollection[i].parentElement.tagName == "A") alert("Van jegy!!!");
            else divCollection[i].style.background = "red";
      }
    }
}
function updateCheck(forced)
{
    if ((forced) || (parseInt(GM_getValue('SUC_last_update', '0')) + 86400000 <= (new Date().getTime()))) // Checks once a day (24 h * 60 m * 60 s * 1000 ms)
    {
        try
        {
            GM_xmlhttpRequest(
                {
                    method: 'GET',
                    url: script_link,
                    headers: {'Cache-Control': 'no-cache'},
                    onload: function(resp)
                    {
                        var local_version, remote_version, rt, script_name;

                        rt=resp.responseText;
                        GM_setValue('SUC_last_update', new Date().getTime()+'');
                        var re = /@version\s*(.*?)\s/m;
                        remote_version=parseFloat(re.exec(rt)[1]);
                        local_version=parseFloat(GM_getValue('SUC_current_version', '-1'));
                        if(local_version!=-1)
                        {
                            script_name = (/@name\s*(.*?)\s*$/m.exec(rt))[1];
                            GM_setValue('SUC_target_script_name', script_name);
                            if (remote_version > local_version)
                            {
                                if(confirm('There is an update available for the Greasemonkey script "'+script_name+'."\nWould you like to go to the install page now?'))
                                {
                                    GM_openInTab(script_link);
                                    GM_setValue('SUC_current_version', remote_version);
                                }
                            }
                        }
                        else {GM_setValue('SUC_current_version', remote_version+'');}
                    }
                });
        }
        catch (err)
        {
            if (true){
                alert('An error occurred while checking for updates:\n'+err);
            }
        }
    }
}
updateCheck();
//checkTickets();