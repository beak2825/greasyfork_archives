// ==UserScript==
// @name         bolha.com automation
// @namespace    http://tampermonkey.net/
// @version      0.98
// @description  bolha.com ad renewal automation
// @author       You
// @match        https://www.bolha.com/*
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/400954/bolhacom%20automation.user.js
// @updateURL https://update.greasyfork.org/scripts/400954/bolhacom%20automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // caching path is faster (although the difference is only milliseconds)
    var path = location.href;
    //console.log(location);

    switch (true) {

            //moja-bolha/oglasi/?strStatus=expired
        case path.indexOf('/moja-bolha/oglasi/?strStatus=expired') !== -1:
            inaktivniOglasi();
            break;

            //moja-bolha/oglasi/?strStatus=inactive
       case path.indexOf('/moja-bolha/oglasi/?strStatus=inactive') !== -1:
            inaktivniOglasi();
            break;

                //moja-bolha/oglasi/?strStatus=sold
        case path.indexOf('/moja-bolha/oglasi/?strStatus=sold') !== -1:
            inaktivniOglasi();
            break;

            //obnova-oglasa/*
        case path.indexOf('/obnova-oglasa/') !== -1:
            document.querySelector("#ad-submitButton").click();
            break;

            //index.php?ctl=boost*
        case path.indexOf('/index.php?ctl=boost') !== -1:
            window.location.replace("https://www.bolha.com/moja-bolha/");
            //open(location, '_self').close();
            break;

        case path.indexOf('/index.php?ctl=push_up') !== -1:
            window.location.replace("https://www.bolha.com/moja-bolha/");
            //open(location, '_self').close();
            break;

        case path.indexOf('/moja-bolha/oglasi/?strStatus=active') !== -1:
            odstraniUpsell();
            break;

    }

    function odstraniUpsell(){

        var skokNaVrh = document.getElementsByClassName("mass-action pushup");
        skokNaVrh[0].remove();

        var thead = document.getElementsByClassName("table-entity entity-table entity-table--ActiveAds ")[0].tHead;
        thead.deleteRow(0);

        var trs = document.getElementsByClassName("table-entity entity-table entity-table--ActiveAds ")[0].rows;
        for (var j = 0; j<trs.length-1; j++){
            //console.log(trs[j]);
            trs[j].cells[8].remove();
            trs[j].cells[7].remove();
            trs[j].cells[6].remove();
            //trs[j].cells[3].remove();

            if(j!=0){
                trs[j].querySelectorAll(".pushup_button")[0].remove();
            }


            trs[j].cells[4].style.fontSize = "14px";
            trs[j].cells[5].style.fontSize = "14px";

            console.log(trs[j].cells[4].innerHTML.substring(21,23));
            if(trs[j].cells[4].innerHTML.substring(21,23) < 15){
                trs[j].cells[4].style.color="red";
                trs[j].cells[4].style.fontWeight ="bold";
            }
        }

    }

    function inaktivniOglasi(){
        function obnoviIzbrane(){
            //pridobi vse oglase, ki so neaktivni
            //var seznamOglasov = document.getElementsByClassName("action-link action mat_ad_action renew");
            //console.log(seznamOglasov);

            var checkedBoxes = document.querySelectorAll('input.ad_check[type=checkbox]:checked');
            //console.log(checkedBoxes);

            //pojdi po vseh oglasih
            //na vsakem oglasu pojdi noter in klikni obnovi
            for (var i = 0;i<checkedBoxes.length;i++){

                var idOglasa = checkedBoxes[i].name.substring(9);

                var url = "https://www.bolha.com/obnova-oglasa/?ad_id="+idOglasa;
                //console.log(url);

                GM_openInTab (url);
            }

            setTimeout(function() {
                location.reload();
            }, 2000);

        }

        //dodaj gumb obnovi
        var btn = document.createElement("li");
        btn.className="mass-action-item";

        //mass_action je full pomembna za prikaz yes/no
        btn.innerHTML = '<button type="button" class="button-standard button-standard--gamma mass-action " disabled>Obnovi vse</button>';
        btn.addEventListener ("click", function() {obnoviIzbrane()}, false);
        var gumbi = document.getElementsByClassName("mass-action-items");
        gumbi[0].appendChild(btn);

        var disabledGumbi = document.getElementsByClassName( "mass-action ");
        //console.log(disabledGumbi[0]);

        let observer = new MutationObserver(mutationRecords => {
            //console.log(mutationRecords); // console.log(the changes)

            var y = disabledGumbi.length-1;
            if(disabledGumbi[y].disabled){
                disabledGumbi[y].removeAttribute("disabled", "");
            }
            else{
                disabledGumbi[y].setAttribute("disabled", "");
            }
        });
        observer.observe(disabledGumbi[0], {attributes:true } );

    }
})();
