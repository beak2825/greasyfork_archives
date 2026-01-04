// ==UserScript==
// @name         ECKHART TOLLE Risveglia la tua luce interiore
// @namespace    Risveglia_La_Tua_Pace_Interiore
// @version      4
// @description  ECKHART TOLLE Risveglia la tua luce interiore MyLife
// @author       Flejta
// @include      https://eckharttollecorso.it/
// @include      https://eckharttollecorso.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476363/ECKHART%20TOLLE%20Risveglia%20la%20tua%20luce%20interiore.user.js
// @updateURL https://update.greasyfork.org/scripts/476363/ECKHART%20TOLLE%20Risveglia%20la%20tua%20luce%20interiore.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/
// MANCA GIORNO 1
(function() {
    var codicePagina="";
    codicePagina += "    <button id=\"giorno1\">giorno1<\/button>";
    codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    //codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
    //codicePagina += "    <button id=\"giorno6\">giorno6<\/button>";
    //codicePagina += "    <button id=\"giorno7\">giorno7<\/button>";
    //codicePagina += "    <button id=\"giorno8\">giorno8<\/button>";
    //codicePagina += "    <button id=\"giorno9\">giorno9<\/button>";
    //codicePagina += "    <button id=\"giorno10\">giorno10<\/button>";
    //codicePagina += "    <button id=\"giorno11\">giorno11<\/button>";
    //codicePagina += "    <button id=\"giorno12\">giorno12<\/button>";
    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";
    codicePagina += "    <div id=\"giorni\"><\/div>";

    var giorno1="";
    giorno1 += "<div>Giorno 1<\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video in italiano<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe src=\"https:\/\/player.vimeo.com\/video\/797645393?h=6561782674&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" ";
    giorno1 += "                allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\"";
    giorno1 += "                 title=\"titolo\">";
    giorno1 += "        <\/iframe>";
    giorno1 += "<\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video in inglese con sottotitoli in italiano<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe src=\"https:\/\/player.vimeo.com\/video\/788620087?h=ed32ffc7ab&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\">";
    giorno1 += "        <\/iframe>";
    giorno1 += "<\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Ritiro a Findhorn - La quiete nel mondo - Parte 1<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe src=\"https:\/\/player.vimeo.com\/video\/710336012?h=4843a90651&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe>";
    giorno1 += "<\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Meditazione Globale della Pace<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe src=\"https:\/\/player.vimeo.com\/video\/728783659?h=78410ab62f&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe>";
    giorno1 += "<\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Global Peace Meditation<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe src=\"https:\/\/player.vimeo.com\/video\/810077403?h=0fbbe47a73&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe>";
    giorno1 += "<\/div>";
    giorno1 += "";
    giorno1 += "<a href=\"https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Insegnamenti-su-Risveglia-la-tua-luce-interiore.pdf\">Scarica";
    giorno1 += "        il libro<\/a>";
    giorno1 += "<div> <embed src=\"https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Insegnamenti-su-Risveglia-la-tua-luce-interiore.pdf\"";
    giorno1 += "                type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";
    giorno1 += "<div><a class=\"elementor-button elementor-button-link elementor-size-md\"";
    giorno1 += "                href=\"https:\/\/www.mylife.it\/mediafile\/7610\/download\">";
    giorno1 += "                <span class=\"elementor-button-content-wrapper\">";
    giorno1 += "                        <span class=\"elementor-button-icon elementor-align-icon-left\">";
    giorno1 += "                                <i aria-hidden=\"true\" class=\"far fa-arrow-alt-circle-down\"><\/i> <\/span>";
    giorno1 += "                        <span class=\"elementor-button-text\">Scarica l'Audio<\/span>";
    giorno1 += "                <\/span>";
    giorno1 += "        <\/a><\/div>";
    giorno1 += "<h2>&nbsp;<\/h2>";
    giorno1 += "<p style=\"text-align:center\">";
    giorno1 += "        <strong><a ";
    giorno1 += "                href=\"https:\/\/www.mylife.it\/mediafile\/7610\/download\">";
    giorno1 += "                    Scarica l&#39;Audio";
    giorno1 += "        <\/a><\/strong><\/p>";
    giorno1 += "<h2><br\/>";
    giorno1 += "<\/h2>";
    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video in italiano<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/797645822?h=aa96cd4be2&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video in inglese con sottotitoli in italiano<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/789764886?h=5a759aff53&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Ritiro a Findhorn - La quiete nel mondo - Parte 2<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/710336269?h=455ad5982b&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<a href=\"https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Richiamare-la-luce-della-Coscienza.pdf\">Scarica il";
    giorno2 += "        libro<\/a>";
    giorno2 += "<div> <embed src=\"https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Richiamare-la-luce-della-Coscienza.pdf\"";
    giorno2 += "                type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";
    giorno2 += "";
    giorno2 += "<div><a class=\"elementor-button elementor-button-link elementor-size-md\"";
    giorno2 += "                href=\"https:\/\/www.mylife.it\/mediafile\/7611\/download\">";
    giorno2 += "                <span class=\"elementor-button-content-wrapper\">";
    giorno2 += "                        <span class=\"elementor-button-icon elementor-align-icon-left\">";
    giorno2 += "                                <i aria-hidden=\"true\" class=\"far fa-arrow-alt-circle-down\"><\/i> <\/span>";
    giorno2 += "                        <span class=\"elementor-button-text\">Scarica l'Audio<\/span>";
    giorno2 += "                <\/span>";
    giorno2 += "        <\/a><\/div>";
    giorno2 += "<h2><br \/>";
    giorno2 += "        <a href=\"https:\/\/www.mylife.it\/mediafile\/7611\/download\">Scarica l&#39;Audio<\/a>";
    giorno2 += "<\/h2>";
    giorno2 += "<p style=\"text-align:center\">&nbsp;<\/p>";
    giorno2 += "<h2>&nbsp;<\/h2>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div>";
    giorno3 += "<div>";
    giorno3 += "    <h2>Video in italiano<\/h2>";
    giorno3 += "<\/div><br>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno3 += "        src=\"https:\/\/player.vimeo.com\/video\/797646237?h=12e2dfae08&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno3 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno3 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>";
    giorno3 += "    <h2>Video in inglese con sottotitoli in italiano<\/h2>";
    giorno3 += "<\/div><br>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno3 += "        src=\"https:\/\/player.vimeo.com\/video\/790481577?h=ce8f6ce1ad&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno3 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno3 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>";
    giorno3 += "    <h2>Ritiro a Findhorn - La quiete nel mondo - Parte 3<\/h2>";
    giorno3 += "<\/div><br>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno3 += "        src=\"https:\/\/player.vimeo.com\/video\/710336425?h=b0a2667ac4&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno3 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno3 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<a";
    giorno3 += "    href=\"https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Le-sfide-come-percorso-verso-levoluzione-consapevole.pdf\">Scarica";
    giorno3 += "    il libro<\/a>";
    giorno3 += "<div> <embed";
    giorno3 += "        src=\"https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Le-sfide-come-percorso-verso-levoluzione-consapevole.pdf\"";
    giorno3 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";
    giorno3 += "<div><a class=\"elementor-button elementor-button-link elementor-size-md\"";
    giorno3 += "        href=\"https:\/\/www.mylife.it\/mediafile\/7612\/download\">";
    giorno3 += "        <span class=\"elementor-button-content-wrapper\">";
    giorno3 += "            <span class=\"elementor-button-icon elementor-align-icon-left\">";
    giorno3 += "                <i aria-hidden=\"true\" class=\"far fa-arrow-alt-circle-down\"><\/i> <\/span>";
    giorno3 += "            <span class=\"elementor-button-text\">Scarica l'Audio<\/span>";
    giorno3 += "        <\/span>";
    giorno3 += "    <\/a><\/div>";
    giorno3 += "    <a href=\"https:\/\/www.mylife.it\/mediafile\/7612\/downloadps:\/\/www.mylife.it\/mediafile\/7612\/download\">";
    giorno3 += "        Scarica l'Audio<\/a>";
    giorno3 += "";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Video in italiano<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/797646603?h=41fdf05894&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Video in inglese con sottotitoli in italiano<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/792577811?h=b931429d44&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Ritiro a Findhorn - La quiete nel mondo - Parte 4<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/710336715?h=bb316a1c33&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<a";
    giorno4 += "    href=https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Diventare-un-attore-consapevole-nel-processo-creativo-dellUniverso.pdf>Scarica";
    giorno4 += "    il libro<\/a>";
    giorno4 += "<div> <embed";
    giorno4 += "        src=https:\/\/eckharttollecorso.it\/wp-content\/uploads\/2023\/03\/Diventare-un-attore-consapevole-nel-processo-creativo-dellUniverso.pdf";
    giorno4 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";
    giorno4 += "";
    giorno4 += "<div><a class=\"elementor-button elementor-button-link elementor-size-md\"";
    giorno4 += "        href=\"https:\/\/www.mylife.it\/mediafile\/7613\/download\">";
    giorno4 += "        <span class=\"elementor-button-content-wrapper\">";
    giorno4 += "            <span class=\"elementor-button-icon elementor-align-icon-left\">";
    giorno4 += "                <i aria-hidden=\"true\" class=\"far fa-arrow-alt-circle-down\"><\/i> <\/span>";
    giorno4 += "            <span class=\"elementor-button-text\">Scarica l'Audio<\/span>";
    giorno4 += "        <\/span>";
    giorno4 += "    <\/a><\/div>";
    giorno4 += "<a href=\"https:\/\/www.mylife.it\/mediafile\/7613\/download\">";
    giorno4 += "    Scarica l'Audio<\/a>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        giorno2: giorno2,
        giorno3: giorno3,
        giorno4: giorno4
        //giorno5: giorno5,
        //giorno6: giorno6,
        //giorno7: giorno7,
        //giorno8: giorno8,
        //giorno9: giorno9,
        //giorno10: giorno10,
        //giorno11: giorno11,
        //giorno12: giorno12

        // Aggiungi qui i testi per gli altri giorni
    };
    let giornoCorrente = '';
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            if (button.id === 'giorno1Sera') {
                giornoCorrente = testiGiorni.giorno1Sera;
            } else {
                giornoCorrente = testiGiorni[button.id];
            }
            divGiorni.innerHTML = giornoCorrente;

        });
    });
})();
