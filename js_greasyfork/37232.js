// ==UserScript==
// @name         V-Lien-Marchands&Somme
// @name:en      V-Link-Trade&Sum
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @author       azro
// @include     *://*.travian.*/*
// @include     *://*.travian.*/*
// @include     *://*.travian.*.*/*
// @include     *://travian.*/index.php*
// @exclude     *://*.travian*.*/support.php*
// @exclude     *://help.travian*.*
// @grant  GM_addStyle
// @description script pour avoir des liens rapides en marchands ou troupes vers vos villages, somme des ressources + remplissage rapide des ressources dans le marché
// @description:en script to proves quick links for trading/troops + sum ress + quick send trade
// @downloadURL https://update.greasyfork.org/scripts/37232/V-Link-TradeSum.user.js
// @updateURL https://update.greasyfork.org/scripts/37232/V-Link-TradeSum.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 1 pour activer et 0 pour désactiver
    let activerLienMarchands = 1;         // barre de lien rapide sur la droite

    let activerSomme = 1;                 // somme des ress sur la page des champs

    let activerRepartitionMarche = 1;     // répartition rapide dans le marché (en x3)
    let repartitionRessources = [1,1,1,0]; // [b,t,f,c] choix des ressources sur lesquelles répartir : [1,0,1,0] = bois et fer uniquement
    let multiplicateur = 3; // x1 ou x2 ou x3

    // /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
    // -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- -- --NE RIEN MODIFIER SOUS CETTE LIGNE -- -- -- -- -- -- -- -- -- -- -- -- - -- -- -- -- -- --
    // /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\


    let $$ = jQuery.noConflict();
    if(activerLienMarchands === 1){
        lienEnvoiMarchands();
        //    lienEnvoiTroupes();
    }
    if(activerSomme === 1){
        if (window.location.href.indexOf("dorf1.php") > -1) {
          sommeRessoures();
        }
    }
    if(activerRepartitionMarche === 1){
        if ($$("#build").hasClass( "gid17" )) {
            remplirRessourcesMarcheBIS(repartitionRessources[0],repartitionRessources[1],repartitionRessources[2],repartitionRessources[3], multiplicateur);
        }
    }


})();
//------------------------------------------------------------------------------
function sommeRessoures() {
    let $$ = jQuery.noConflict();

    $$("script").each(function () {
        if ($$(this).html().indexOf("resources.production") > -1) {
            eval($$(this).html().match(/resources.production\s=[\s\S]+};/));
        }
    });

    let prodBois = resources.production.l1;
    let prodArgile = resources.production.l2;
    let prodFer = resources.production.l3;
    let prodCereale = resources.production.l4;
    let prodTotal = parseInt(prodBois) + parseInt(prodArgile) + parseInt(prodFer) + parseInt(prodCereale);

    $$('#production').find('tbody').find('tr:last').after("<tr ><td><strong>&sum;</strong></td><td><strong>Somme</strong></td><td class=\"num\"><strong>" + prodTotal + "</strong></td></tr>");

    //--------------

}

function lienEnvoiMarchands() {
    let $$ = jQuery.noConflict();

    let imagesMarchands='<img src="img/x.gif" class="r1" >'+'<img src="img/x.gif" class="r2" >'+'<img src="img/x.gif" class="r3" >'+'<img src="img/x.gif" class="r4" >';
    let imagesTroupes ='<img src="img/x.gif" class="iReport iReport1 " ><img src="img/x.gif" class="iReport iReport7 " >';

    let cadre ='<div id="sideBarmarchands" class="sidebarBox"><div class="sidebarBoxBaseBox"><div class="baseBox baseBoxTop"><div class="baseBox baseBoxBottom"><div class="baseBox baseBoxCenter"></div></div></div></div>';
    let tete = "<div class=' sidebarBoxInnerBox '><div class=\"innerBox header \"><div class=\"expansionSlotInfo\"><div class=\"boxTitle\"></div></div></div><div class='innerBox content'>";

    let listeNom = "<ul id='nomsVivi'></ul>";
    let listePM = "<ul id='lienMarchands'></ul>";
    let listeVivi = "<ul id='lienVillages'></ul>";
    let listePR = "<ul id='lienTroupes'></ul>";
    //     let tableau = "<table id='lienMarchandsTab'><thead><tr><th>Vivi</th><th>March</th><th>Troupes</th></tr></thead></table>";
    let pied = "</div><div class=\"innerBox footer\"></div></div></div>";

    //  $$('#sidebarAfterContent').append(cadre+tete  + listePM +listeVivi+ listePR + pied);
    $$("#sidebarBoxVillagelist").find('.content').append(listePM +listeVivi+ listePR);

    $$('#sidebarBoxVillagelist').find('ul').find('li').each(function () {

        let link = $$(this).find('a').attr('href');
        let activeClass = $$(this).attr('class');


        let nom = $$(this).find('.name').text();
        let x = $$(this).find('.coordinateX').text().replace(/[^−0-9]/g, "").replace(/−/g, "-");
        let y = $$(this).find('.coordinateY').text().replace(/[^−0-9]/g, "").replace(/−/g, "-");
        let idCase = 201 + parseInt(x) + 401 * (200 - parseInt(y));

        let coord = '<span class="coordinates coordinatesWrapper coordinatesAligned coordinatesLTR"><span class="coordinateX">('+x+'</span><span class="coordinatePipe">|</span><span class="coordinateY">'+y+')</span></span>';

        let urlNom = "<li class=\" "+activeClass+" \"><a  class=\"\"><i aria-hidden=\"true\">" + nom.slice(0,5) + " :  </i></a></li>";
        let urlPR  = "<li><a href=/build.php?z=" + idCase + "&gid=17&t=5 class=\"\"><i aria-hidden=\"true\">"  + "  <img class='gebIcon g17Icon' src='img/x.gif'  style='width:16px;height:16px;'/></i></a></li>";
        let urlVillage = "<li class=\" "+activeClass+" \"><a style='width:190px' href=" + link + " class=\"\"><img src='img/x.gif' alt=''><span aria-hidden=\"true\">"  + nom+"  "+coord+"</span></a></li>";
        let urlPM = "<li><a href=/build.php?z=" + idCase + "&id=39&tt=2 class=\"\"><i  aria-hidden=\"true\">"  + "<img class='gebIcon g16Icon' src='img/x.gif' style='width:16px;height:16px'/></i></a></li>";

        // $$("#nomsVivi").append(urlNom);
        $$("#lienTroupes").append(urlPM);
        $$("#lienVillages").append(urlVillage);
        $$("#lienMarchands").append(urlPR);

        $$(this).remove();
    });

    $$("#sideBarmarchands").find("li").css('padding-left','10px');
    $$("#sideBarmarchands").find("li").css('padding-right','10px');
    $$("#nomsVivi").find("li").css('padding-left','1px');

    $$("#sideBarmarchands").css('position','absolute');
    $$("#sideBarmarchands").css('top','170px');
    $$("#sideBarmarchands").css('right','-230px');
    $$("#sideBarmarchands").css('width','230px');

    $$("#nomsVivi").css( "display", "inline-block");
    $$("#lienMarchands").css( "display", "inline-block");
    $$("#lienVillages").css( "display", "inline-block");
    $$("#lienTroupes").css( "display", "inline-block");

    $$("#sidebarBoxVillagelist").find('.content').append(listePM +listeVivi+ listePR);

    $$("#background").css('min-height','0');
}




function remplirRessourcesMarche(b,t,f,c,x){
    let $$ = jQuery.noConflict();
    let stock = $$(".middle .value").map(function () {
        return $$(this).text().replace(".", "");
    }).get();

    let stockBois = parseInt(stock[0].replace(" ",""));
    let stockArgile = parseInt(stock[1].replace(" ",""));
    let stockFer = parseInt(stock[2].replace(" ",""));
    let stockCereale = parseInt(stock[3].replace(" ",""));
    let stockConso = parseInt(stock[4].replace(" ",""));


    let element = '<button id="remplirRess" class="green prepare"><div class="button-container addHoverClick"><div class="button-background"><div class="buttonStart"><div class="buttonEnd"><div class="buttonMiddle"></div></div></div></div><div class="button-content">Répartir</div></div></button>';
    $$("#button").append(element);
    // $$("#remplirRess").css('margin-right','20px');


    $$("#remplirRess").click(function(){
        let capa = parseInt($$("#merchantCapacityValue").text());
        let reparti = capa/(b + t + f + c);
        if(b===1)
            $$("#r1").val(Math.min(reparti,stockBois));
        if(t===1)
            $$("#r2").val(Math.min(reparti,stockArgile));
        if(f===1)
            $$("#r3").val(Math.min(reparti,stockFer));
        if(c===1)
            $$("#r4").val(Math.min(reparti,stockCereale));
        $$("#x2").val(3);
    });
}

function remplirRessourcesMarcheBIS(b,t,f,c,x){
    let $$ = jQuery.noConflict();
    let stock = $$(".middle .value").map(function () {
        return $$(this).text().replace(".", "");
    }).get();

    let stockBois = parseInt(stock[0].replace(" ",""));
    let stockArgile = parseInt(stock[1].replace(" ",""));
    let stockFer = parseInt(stock[2].replace(" ",""));
    let stockCereale = parseInt(stock[3].replace(" ",""));
    let stockConso = parseInt(stock[4].replace(" ",""));


    let element = '<button id="remplirRess" class="green prepare"><div class="button-container addHoverClick"><div class="button-background"><div class="buttonStart"><div class="buttonEnd"><div class="buttonMiddle"></div></div></div></div><div class="button-content">Répartir</div></div></button>';
    $$("#button").append(element);
    $$("#remplirRess").css('margin-top','5px');
    $$("#remplirRess").css('width','87px');


    $$("#remplirRess").click(function(){
        let capa = parseInt($$("#merchantCapacityValue").text());
        let envoi = parseInt($$("#sumResources").text());
        let protection = 30;
        while((envoi<capa) && (protection-- > 0)){

            if(b===1)
                marketPlace.addRessources(1);
            if(t===1)
                marketPlace.addRessources(2);
            if(f===1)
                marketPlace.addRessources(3);
            if(c===1)
                marketPlace.addRessources(4);

            capa = parseInt($$("#merchantCapacityValue").text());
            envoi = parseInt($$("#sumResources").text());
        }


   $$("#x2").val(x);
    });
}

