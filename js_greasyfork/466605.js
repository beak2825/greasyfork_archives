// ==UserScript==
// @name         Richard Bartlett
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Vedi il master di Richard Bartlett
// @author       Flejta
// @include      *richardbartlett.it/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466605/Richard%20Bartlett.user.js
// @updateURL https://update.greasyfork.org/scripts/466605/Richard%20Bartlett.meta.js
// ==/UserScript==

// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/


(function() {
    var codicePagina="";
    codicePagina += "    <button id=\"giorno1\">giorno1<\/button>";
    codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    codicePagina += "    <button id=\"giorno1Sera\">giorno1Sera<\/button>";
    codicePagina += "    <div id=\"giorni\"><\/div>";

    var giorno1="";
    giorno1 += "    <!--Giorno 1-->";
    giorno1 += "    <div><b>Giorno 1<\/b><\/div>";
    giorno1 += "    <br><br>";
    giorno1 += "    <div>Parte 1<\/div><br>";
    giorno1 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe";
    giorno1 += "            src=\"https:\/\/player.vimeo.com\/video\/828060658?h=4db96820ff&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno1 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno1 += "    <\/div>";
    giorno1 += "    <div>Parte 1 Inglese<\/div><br>";
    giorno1 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe";
    giorno1 += "            src=\"https:\/\/player.vimeo.com\/video\/813207520?h=89e1834a7d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno1 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno1 += "    <\/div>";
    giorno1 += "        <!--Giorno 1 Libro-->";
    giorno1 += "        <a href=\"https:\/\/richardbartlett.it\/wp-content\/uploads\/2023\/05\/manuale-basic-med-holostes-IMP-OK-OK-OK.pdf\">Manuale<\/a>";
    giorno1 += "";
    giorno1 += "        <embed src=\"https:\/\/richardbartlett.it\/wp-content\/uploads\/2023\/05\/manuale-basic-med-holostes-IMP-OK-OK-OK.pdf\"";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    var giorno2="";
    giorno2 += "    <!--Giorno 2-->";
    giorno2 += "    <div><b>Giorno 2<\/b><\/div>";
    giorno2 += "    <br><br>";
    giorno2 += "    <div>Parte 2<\/div><br>";
    giorno2 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno2 += "        <iframe";
    giorno2 += "            src=\"https:\/\/player.vimeo.com\/video\/828061537?h=5be75ede30&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno2 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno2 += "    <\/div>";
    giorno2 += "    <div>Parte 2 Inglese<\/div><br>";
    giorno2 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno2 += "        <iframe";
    giorno2 += "            src=\"https:\/\/player.vimeo.com\/video\/828127057?h=4bb8f1db32&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno2 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno2 += "    <\/div>";
    giorno2 += "    <!--Giorno 2 Libro-->";
    giorno2 += "    <a";
    giorno2 += "        href=\"https:\/\/richardbartlett.it\/wp-content\/uploads\/2023\/05\/manuale-basic-med-holostes-IMP-OK-OK-OK.pdf\">Manuale<\/a>";
    giorno2 += "";
    giorno2 += "    <embed src=\"https:\/\/richardbartlett.it\/wp-content\/uploads\/2023\/05\/manuale-basic-med-holostes-IMP-OK-OK-OK.pdf\"";
    giorno2 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    var giorno3="";
    giorno3 += "    <!--Giorno 3-->";
    giorno3 += "    <div><b>Giorno 3<\/b><\/div>";
    giorno3 += "    <br><br>";
    giorno3 += "    <div>Parte 3<\/div><br>";
    giorno3 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno3 += "        <iframe";
    giorno3 += "            src=\"https:\/\/player.vimeo.com\/video\/828128794?h=d53da39d24&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno3 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno3 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno3 += "    <\/div>";
    giorno3 += "    <div>Parte 3 Inglese<\/div><br>";
    giorno3 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno3 += "        <iframe";
    giorno3 += "            src=\"https:\/\/player.vimeo.com\/video\/828127870?h=7f4727fab3&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno3 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno3 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno3 += "    <\/div>";
    giorno3 += "    <!--Giorno 3 Libro-->";
    giorno3 += "    <a";
    giorno3 += "        href=\"https:\/\/richardbartlett.it\/wp-content\/uploads\/2023\/05\/manuale-basic-med-holostes-IMP-OK-OK-OK.pdf\">Manuale<\/a>";
    giorno3 += "";
    giorno3 += "    <embed src=\"https:\/\/richardbartlett.it\/wp-content\/uploads\/2023\/05\/manuale-basic-med-holostes-IMP-OK-OK-OK.pdf\"";
    giorno3 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    var giorno4="";
    giorno4 += "    <!--Giorno 4-->";
    giorno4 += "    <div><b>Giorno 4<\/b><\/div>";
    giorno4 += "    <br><br>";
    giorno4 += "    <div>Parte 4<\/div><br>";
    giorno4 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno4 += "        <iframe";
    giorno4 += "            src=\"https:\/\/player.vimeo.com\/video\/828138079?h=e73cfdfec0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno4 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno4 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno4 += "    <\/div>";
    giorno4 += "    <div>Parte 4 Inglese<\/div><br>";
    giorno4 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno4 += "        <iframe";
    giorno4 += "            src=\"https:\/\/player.vimeo.com\/video\/828129533?h=17d2e859e4&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno4 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno4 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno4 += "    <\/div>";
    giorno4 += "    <embed src=\"https:\/\/richardbartlett.it\/wp-content\/uploads\/2023\/05\/manuale-basic-med-holostes-IMP-OK-OK-OK.pdf\"";
    giorno4 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";


    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        //giorno1Sera: giorno1sera,
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
        //giorno12: giorno12,
        //giorno13: giorno13,
        //giorno14: giorno14,
        //giorno15: giorno15,
        //giorno16: giorno16,
        //giorno17: giorno17,
        //giorno18: giorno18,
        //giorno19: giorno19

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