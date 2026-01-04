// ==UserScript==
// @name         Video Apos Shiatsu
// @namespace    videoapos
// @version      1
// @description  Visualizza video Apos
// @author       Flejta
// @include      https://www.shiatsuapos.com/area-riservata/video/1*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479315/Video%20Apos%20Shiatsu.user.js
// @updateURL https://update.greasyfork.org/scripts/479315/Video%20Apos%20Shiatsu.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/

(function() {
    var codicePagina="<br>";

    codicePagina += "    <button id=\"convegno53\">53 Convegno<\/button>";
    codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";
    codicePagina += "    <div id=\"giorni\"><\/div>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina
    //const element = document.getElementById('h.5fdf919bd8fdeeed_14');
    //element.innerHTML = codicePagina;
    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    var convegno53="";
    convegno53 += "<div><b>53 Convegno<\/b><\/div>    <br><br><div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/753308200?badge=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    convegno53 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/753480173?badge=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    convegno53 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/753544466?badge=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    convegno53 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/753896527?badge=0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

    let testiGiorni = {
        convegno53: convegno53,
        //giorno2: giorno2,
        //giorno3: giorno3,
        //giorno4: giorno4,
        //giorno5: giorno5
        //giorno6: giorno6,
        //giorno7: giorno7,
        //giorno8: giorno8,
        //giorno9: giorno9,
        //giorno11: giorno11,
        //giorno12: giorno12,
        //giorno13: giorno13,
        //giorno14: giorno14,
        //giorno15: giorno15,
        //giorno16: giorno16,
        //giorno18: giorno18,
        //giorno19: giorno19,
        //giorno20: giorno20,
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
