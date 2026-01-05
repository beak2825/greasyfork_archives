// ==UserScript==
// @name Séparation sujets
// @namespace Forum
// @author Aversiste, MockingJay, Odul
// @date 18/09/2011
// @version 2.2
// @description Separe le RP du HRP dans la section 'Derniers Sujets'.
// @license http://creativecommons.org/licenses/by-nc-nd/4.0/
// @include https://www.dreadcast.eu/Forum
// @include https://www.dreadcast.eu/Forum#
// @include https://www.dreadcast.eu/FAQ
// @include https://www.dreadcast.eu/FAQ#
// @include https://www.dreadcast.eu/Forum/*
// @include https://www.dreadcast.eu/FAQ/*
// @compat Firefox, Chrome
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/25453/S%C3%A9paration%20sujets.user.js
// @updateURL https://update.greasyfork.org/scripts/25453/S%C3%A9paration%20sujets.meta.js
// ==/UserScript==

function isOnOrOff(node, str) {
    if (document.cookie.search('forum_derniers_sujets_'+str+'=on') != -1) {
        node.children[0].children[0].style.display = 'inline';
        node.children[0].children[1].style.display = 'none';
        node.children[1].style.display = 'block';
    } else {
        node.children[0].children[0].style.display = 'none';
        node.children[0].children[1].style.display = 'inline';
        node.children[1].style.display = 'none';
    }
}

function addClickEvent(node, str) {
    if ((navigator.userAgent).indexOf('Firefox') != -1) {
        node.children[0].addEventListener("click", function() {
            unsafeWindow.$(this).next().toggle();
            unsafeWindow.$(this).find('.symbol').toggle();
            unsafeWindow.writeCookie('forum_derniers_sujets_'+str, unsafeWindow.$(this).find('.symbol:first').css('display') == 'none' ? 'off' : 'on');
        }, false);
    } else {
        node.children[0].setAttribute("onclick", "$(this).next().toggle();$(this).find('.symbol').toggle();writeCookie('forum_derniers_sujets_"+str+"',$(this).find('.symbol:first').css('display')=='none'?'off':'on');");
    }
}

function sortSection(node, filter) {
    var lis = node.getElementsByTagName('li');
    for (var i = 0; i < lis.length; ++i) {
        var nodeclass = lis[i].children[0].className;
        var id = parseInt(nodeclass.substring(2, nodeclass.indexOf(' ', 0)), 10);
        if(filter.indexOf(id) < 0){
            node.children[1].removeChild(node.children[1].children[i]);
            --i;
        }
    }
}

function createSectionNode(orig, id, nom, filter, localsavename) {
    var node = orig.cloneNode(true);
    node.id = id;
    node.children[0].children[2].innerHTML = nom;
    sortSection(node, filter);
    isOnOrOff(node, localsavename);
    $("#menu_droite").prepend(node);
    addClickEvent(node, localsavename);
    return node;
}

function hide(node) {
    var lis = node.getElementsByTagName('li'); //Récupère liste
    for (var i = 0; i < lis.length; ++i) {
        var nodeclass = lis[i].children[0].className; //Récupère classe de l'élement
        var id = parseInt(nodeclass.substring(2, nodeclass.indexOf(' ', 0)), 10); //En déduit la catégorie forum
        var off = localStorage.getItem($(lis[i]).find('a').attr("href").substring(31, $(lis[i]).find('a').attr("href").indexOf("-", 33))); //Récupère le texte de l'élément (lien)
        if(off !== null && off == "off") { //Vérifie si à blacklister
            node.children[1].removeChild(node.children[1].children[i]);
            --i;
        }
    }
}

function addClickEventHide(node) {
    node.onclick = function(){
        if(typeof localStorage!='undefined') {
            var currentTopicId = window.location.href.substring(31, window.location.href.indexOf("-", 33));
            if(localStorage.getItem(currentTopicId)){
                localStorage.removeItem(currentTopicId,'off');
                $('#hideTopic').text('Masquer ce sujet');
            } else {
                localStorage.setItem(currentTopicId,'off');
                $('#hideTopic').text('Afficher ce sujet');
            }
        }
    };
}

//****************
//***DEBUT MAIN***
//****************

(function() {

    var origList = document.getElementById('list_derniers_sujets'); // Récupération du div des derniers sujets
    hide(origList); //Masquage de tous les topics qui doivent l'être, avant clonage et tri des catégories

    //Clonage et tri des nouvelles catégories. Dans l'ordre inversé, car utilisation de prepend.
    var hrp = createSectionNode(origList, "list_derniers_sujets_hrp", "Derniers Sujets HRP", [3,4,7,8,9,10], "hrp");
    var rp = createSectionNode(origList, "list_derniers_sujets_rp", "Derniers Sujets RP", [12,13,14,15], "rp");
    var ecoreb = createSectionNode(origList, "list_derniers_sujets_ecoreb", "Matrice Rebelle", [20], "ecoreb");
    var polreb = createSectionNode(origList, "list_derniers_sujets_polreb", "Politique Rebelle", [19], "polreb");
    var ecoimp = createSectionNode(origList, "list_derniers_sujets_ecoimp", "Matrice Impériale", [18], "ecoimp");
    var polimp = createSectionNode(origList, "list_derniers_sujets_polimp", "Politique Impériale", [17], "polimp");
    var annonces = createSectionNode(origList, "list_derniers_sujets_annonces", "Annonces Officielles", [2,5], "annonces");

    origList.parentNode.removeChild(origList); //Enlever la liste originale une fois le tri effectué.


    //Ne pas afficher une catégorie si elle est vide
    $("#menu_droite > div > ul").each(function(){
        if($(this).text().trim() === "") {
            $(this).parent().css("display", "none");
        }
    });


    //Ajout du lien pour activer la fonction 'cacher'
    if($("#header_sujet").length){
        var hideTopic = document.createElement('div'); //Lien cliquable
        hideTopic.id = 'hideTopic';
        hideTopic.className = "link";
        var headerForum = $('.list_tags')[0]; //Header forum auquel attacher le lien
        headerForum.appendChild(hideTopic);
        $('#hideTopic').html("Masquer ce sujet"); //Initialisation du lien
        if(typeof localStorage!='undefined')
            if(localStorage.getItem(window.location.href.substring(31, window.location.href.indexOf("-", 33))))
                $('#hideTopic').text('Afficher ce sujet');
        $('#hideTopic').css('text-align','right');
        addClickEventHide(hideTopic);
    }

})();