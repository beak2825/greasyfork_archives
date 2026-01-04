// ==UserScript==
// @name         Start eWebinar: Chat GPT per tutti
// @namespace    Tampermonkey
// @version      1
// @description  Visualizza video Vimeo su Start eWebinar
// @author       Flejta
// @include      https://start.ewebinar.com/
// @include      https://start.ewebinar.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482413/Start%20eWebinar%3A%20Chat%20GPT%20per%20tutti.user.js
// @updateURL https://update.greasyfork.org/scripts/482413/Start%20eWebinar%3A%20Chat%20GPT%20per%20tutti.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/

(function() {
    var codicePagina= ""; //"<br><br><br><br><br><br><br><br><br>";

    codicePagina += "    <button id=\"giorno1\">Chat GPT per tutti X5<\/button>";

    //codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    //codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    //codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    //codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
    //codicePagina += "    <button id=\"giorno6\">giorno6<\/button>";
    //codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";
    codicePagina += "    <div id=\"giorni\"><\/div>";

    var giorno1="";
    giorno1 += "<div>";
    giorno1 += "  <h2>Chat GPT per tutti X5 Produttività<\/h2>";
    giorno1 += "<\/div>";
    giorno1 += "<br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> ";
    giorno1 += "  <iframe        ";
    giorno1 += "          src=\"https:\/\/player.vimeo.com\/video\/893089390?h=e16b3b413d&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        ";
    giorno1 += "          frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" ";
    giorno1 += "          allowfullscreen style=\"width:100%;height:100%;\"        ";
    giorno1 += "          title=\"Chat GPT\">";
    giorno1 += "  <\/iframe>";
    giorno1 += "<\/div>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {

        giorno1: giorno1,
        //giorno2: giorno2,
        //giorno3: giorno3,
        //giorno4: giorno4,
        //giorno5: giorno5,
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
