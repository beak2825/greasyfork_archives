// ==UserScript==
// @name         Libera la tua anima - Michael Singer
// @namespace    http://tampermonkey.net/
// @version      3
// @description  Visualizza i video di Michael Siger
// @author       Flejta
// @match        https://liberalatuaanima.it
// @match https://michaelsinger.it/
// @match https://michaelsinger.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467115/Libera%20la%20tua%20anima%20-%20Michael%20Singer.user.js
// @updateURL https://update.greasyfork.org/scripts/467115/Libera%20la%20tua%20anima%20-%20Michael%20Singer.meta.js
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
  
    codicePagina += "    <div id=\"giorni\"><\/div>";
    var giorno1="";
    giorno1 += "    <div><b>Giorno 1<\/b><\/div>";
    giorno1 += "    <br><br>";
    giorno1 += "    <div>La mente può essere il peggior nemico o il miglior alleato<\/div><br>";
    giorno1 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe";
    giorno1 += "            src=\"https:\/\/player.vimeo.com\/video\/703317649?h=0c7347bfee&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno1 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno1 += "    <\/div>";
    giorno1 += "    <div>Tony Robbins & Michael Singer<\/div><br>";
    giorno1 += "    <div style=\"width: 100%; height: 500px;\">";
    giorno1 += "        <iframe";
    giorno1 += "            src=\"https:\/\/player.vimeo.com\/video\/703279406?h=170c549f4b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno1 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "            style=\"width:100%;height:100%;\" title=\"louise_hay_evening_meditation_720hd.mp4_HD.mp4\"><\/iframe>";
    giorno1 += "    <\/div>";
    giorno1 += "    <!--Giorno 1 Trascrizione dialogo-->";
    giorno1 += "    <a";
    giorno1 += "        href=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Trascrizione-Libera-la-Tua-Anima-Masterclass-1-ok.pdf\">Leggi";
    giorno1 += "        la trascrizione del video<\/a>";
    giorno1 += "    <embed";
    giorno1 += "        src=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Trascrizione-Libera-la-Tua-Anima-Masterclass-1-ok.pdf\"";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno1 += "    <!--Giorno 1 Libro-->";
    giorno1 += "    <a";
    giorno1 += "        href=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Journal-Libera-la-Tua-Anima-Masterclass-1.pdf\">Libera la tua anima Libro Masterclass 1<\/a>";
    giorno1 += "    <embed";
    giorno1 += "        src=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Journal-Libera-la-Tua-Anima-Masterclass-1.pdf\"";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno1 += "";
    var giorno2="";
    giorno2 += "    <!--Giorno 2-->";
    giorno2 += "    <div><b>Giorno 2<\/b><\/div> <br><br>";
    giorno2 += "    <div>La tua bellissima mente<\/div><br>";
    giorno2 += "    <div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "            src=\"https:\/\/player.vimeo.com\/video\/703318105?h=7acd46fc18&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno2 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "            style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "    <!--Giorno 2 Trascrizione dialogo-->";
    giorno2 += "    <a href=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Trascrizione-Libera-la-Tua-Anima-Masterclass-2.pdf\">Leggi";
    giorno2 += "        la trascrizione del video<\/a>";
    giorno2 += "    <embed";
    giorno2 += "        src=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Trascrizione-Libera-la-Tua-Anima-Masterclass-2.pdf\"";
    giorno2 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno2 += "    <!--Giorno 2 Libro-->";
    giorno2 += "    <a href=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Journal-Libera-la-Tua-Anima-Masterclass-2.pdf\">Libera";
    giorno2 += "        la tua anima Masterclass 2<\/a>";
    giorno2 += "    <embed src=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Journal-Libera-la-Tua-Anima-Masterclass-2.pdf\"";
    giorno2 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    var giorno3="";
    giorno3 += "    <!--Giorno 3-->";
    giorno3 += "    <div><b>Giorno 3<\/b><\/div> <br><br>";
    giorno3 += "    <div>Impara a lasciare andare<\/div><br>";
    giorno3 += "    <div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno3 += "            src=\"https:\/\/player.vimeo.com\/video\/703318603?h=7445f7d755&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno3 += "            frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno3 += "            style=\"width:100%;height:100%;\" title=\"Impara a lasciare andare\"><\/iframe> <\/div>";
    giorno3 += "    <!--Giorno 3 Trascrizione dialogo-->";
    giorno3 += "    <a href=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Trascrizione-Libera-la-Tua-Anima-Masterclass-3.pdf\">Leggi";
    giorno3 += "        la trascrizione del video<\/a>";
    giorno3 += "    <embed";
    giorno3 += "        src=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Trascrizione-Libera-la-Tua-Anima-Masterclass-3.pdf\"";
    giorno3 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno3 += "    <a href=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Journal-Libera-la-Tua-Anima-Masterclass-3.pdf\">Libera";
    giorno3 += "        la tua anima Masterclass 3<\/a>";
    giorno3 += "    <embed src=\"https:\/\/liberalatuaanima.it\/wp-content\/uploads\/2022\/05\/Journal-Libera-la-Tua-Anima-Masterclass-3.pdf\"";
    giorno3 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";


    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        //giorno1Sera: giorno1sera,
        giorno2: giorno2,
        giorno3: giorno3
        //giorno4: giorno4
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
