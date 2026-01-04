// ==UserScript==
// @name         IL POTERE DELL’OTTO
// @namespace    http://tampermonkey.net/
// @version      4
// @description  IL POTERE DELL’OTTO My Life
// @author       Flejta
// @include      https://www.lynnemctaggart.it/
// @include      https://www.lynnemctaggart.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477216/IL%20POTERE%20DELL%E2%80%99OTTO.user.js
// @updateURL https://update.greasyfork.org/scripts/477216/IL%20POTERE%20DELL%E2%80%99OTTO.meta.js
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
    giorno1 += "<div>Giorno 1<\/div><div><h2>Sperimenta il campo quantico<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/841788251?h=f81bf3ba80&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Il Potere dell'8 e la Nuova Scienza<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/841795188?h=9ca850e916&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Experience the quantum field<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842441801?h=acac91a8e4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>The Power of 8 and the New Science<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842452888?h=bfcdd03f3a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/potere_dell_otto_ebook.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/potere_dell_otto_ebook.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div><div><h2>Il Potere delle Intenzioni<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/841788559?h=9474334507&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Il Potere dell'intenzione e la non località<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/841795672?h=b76937ffcd&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>The power of Intentions<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842442163?h=f055e668a5&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>The Power of Intention and non-locality<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842453400?h=8f9f4a5c70&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/Campo_quantico-ebook.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/Campo_quantico-ebook.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div>";
    giorno3 += "<div>";
    giorno3 += "<h2>L'Energia Quantica<\/h2>";
    giorno3 += "<\/div>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"><iframe style=\"width: 100%; height: 100%;\" title=\"titolo\" src=\"https:\/\/player.vimeo.com\/video\/841788800?h=c5f562d9e0&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"><\/iframe><\/div>";
    giorno3 += "<div>";
    giorno3 += "<h2>Quantum Energy<\/h2>";
    giorno3 += "<\/div>";
    giorno3 += "<p>&nbsp;<\/p>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"><iframe style=\"width: 100%; height: 100%;\" title=\"titolo\" src=\"https:\/\/player.vimeo.com\/video\/842442462?h=67db6f0ca2&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"><\/iframe><\/div>";
    giorno3 += "<div>";
    giorno3 += "<h2>Guarda il video<\/h2>";
    giorno3 += "<\/div>";
    giorno3 += "<p>&nbsp;<\/p>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"><iframe style=\"width: 100%; height: 100%;\" title=\"titolo\" src=\"https:\/\/player.vimeo.com\/video\/863225132?h=6808dbcc03&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\" frameborder=\"0\" allowfullscreen=\"allowfullscreen\"><\/iframe><\/div>";
    giorno3 += "<a href=\"https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/Intention-experiment_150x230-ebook.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/Intention-experiment_150x230-ebook.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div><div><h2>I sette Elementi<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/841789029?h=17491105f6&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>The seven Elements<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842442725?h=960a4d48c3&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guarda il video<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/863225132?h=6808dbcc03&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "​ <a href=https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/potere_dell_otto_ebook.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.lynnemctaggart.it\/wp-content\/uploads\/2022\/03\/potere_dell_otto_ebook.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";

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
