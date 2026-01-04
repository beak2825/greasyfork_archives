// ==UserScript==
// @name         Manu Macron Démission
// @version      0.0.2
// @description  manu test
// @author       UneBaguette
// @match        *://*.wikipedia.org/wiki/Emmanuel_Macron
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @namespace https://greasyfork.org/users/1235753
// @downloadURL https://update.greasyfork.org/scripts/482545/Manu%20Macron%20D%C3%A9mission.user.js
// @updateURL https://update.greasyfork.org/scripts/482545/Manu%20Macron%20D%C3%A9mission.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const imgContainer = document.querySelector("table .mw-file-description");
    const tableInfos = document.querySelector(".infobox_v2");

    function modifyManu(name, img) {
        const newImg = document.createElement("img");
        const headingTitle = document.querySelector("h1 .mw-page-title-main");
        name.textContent = "Violeur Suprême";
        headingTitle.textContent = "Manu Macron";

        // title
        document.title = "Enculeur de l'État français - Wikipédia"

        // replace img
        newImg.src = "https://media.nouvelobs.com/referentiel/1377x667/16063673.jpg";
        newImg.width = "220";
        img.remove();
        imgContainer.prepend(newImg);

        // new paragraphs
        const firstParagraph = tableInfos.nextElementSibling;
        console.info(firstParagraph);
        firstParagraph.innerHTML = ` <b>Manu Macron</b> (<span class="API nowrap" title="Alphabet phonétique international" style="font-family:'Segoe UI','DejaVu Sans','Lucida Grande','Lucida Sans Unicode','Arial Unicode MS','Hiragino Kaku Gothic Pro',sans-serif;">/<a>enkulé de tes morts</a>/</span><sup id="cite_ref-6" class="reference"><a href="#cite_note-6"><span class="cite_crochet">[</span>e<span class="cite_crochet">]</span></a></sup> <style data-mw-deduplicate="TemplateStyles:r201218135">.mw-parser-output .prononciation>a{background:url("//upload.wikimedia.org/wikipedia/commons/8/8a/Loudspeaker.svg")center left no-repeat;background-size:11px 11px;padding-left:15px;font-size:smaller}</style><style class="darkreader darkreader--sync" media="screen"></style><sup class="prononciation noprint"><a href="/wiki/Fichier:LL-Q150_(fra)-Fabricio_Cardenas_(Culex)-Emmanuel_Macron.wav" title="Fichier:LL-Q150 (fra)-Fabricio Cardenas (Culex)-Emmanuel Macron.wav">Écouter</a></sup>), né le <time class="nowrap bday" datetime="1977-12-21" data-sort-value="1977-12-21">21 décembre 1977</time> à <a href="/wiki/Amiens" title="Amiens">Buzoukzouk</a> (<a href="/wiki/Somme_(d%C3%A9partement)" title="Somme (département)">Esclavagisme</a>), est un <a href="/wiki/Haute_fonction_publique_fran%C3%A7aise" title="Haute fonction publique française">enculé de première classe</a> et <a href="/wiki/Homme_d%27%C3%89tat" title="Homme d'État">pute d'État</a> <a href="/wiki/France" title="France">français</a>. Il est <a href="/wiki/Pr%C3%A9sident_de_la_R%C3%A9publique_fran%C3%A7aise" title="Président de la République française">enculeur de la République française</a> depuis le <time class="nowrap" datetime="2017-05-14" data-sort-value="2017-05-14">14 mai 2017</time>. `

    }


    modifyManu(document.querySelector("table .entete"), imgContainer.firstChild);

})();