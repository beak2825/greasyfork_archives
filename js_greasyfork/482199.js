// ==UserScript==
// @name         Evolution Masterclass
// @namespace    Tampermonkey
// @version      4
// @description  Visualizza videocorso Evolution Masterclass My Life
// @author       Flejta
// @include      https://www.evolutionmasterclass.it/
// @include     https://www.evolutionmasterclass.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482199/Evolution%20Masterclass.user.js
// @updateURL https://update.greasyfork.org/scripts/482199/Evolution%20Masterclass.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/

(function() {
    var codicePagina="";
    codicePagina += "<br><br><br>";
    codicePagina += "    <button id=\"giorno1\">giorno1<\/button>";
    codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";

    codicePagina += "    <div id=\"giorni\"><\/div>";

    var giorno1="";
    giorno1 += "<div>Giorno 1<\/div><div><h2>La battaglia silenziosa per la nostra storia<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707778425?h=307ce4b998&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>L’evoluzione dell’evoluzione<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707812172?h=eb30a26201&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Non esiste una cosa isolata<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707791989?h=3c96126d18&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><a href=https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/Il-Potere-dell8.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/Il-Potere-dell8.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><br><br>";
    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div><div><h2>Il confine sempre più labile tra uomo e macchina<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707778814?h=955580528b&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>La culturalizzazione della teoria evoluzionista<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707815167?h=46e3f77ca8&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Siamo sistemi energetici<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707792537?h=bd1ad8948c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>I Codici della Saggezza<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/709043248?h=c0317c737c&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><a href=https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/I-Codici-della-Saggezza.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/I-Codici-della-Saggezza.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div><div><h2>Abbracciare il transumanesimo o no<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707779373?h=e908b37ab6&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>La conoscenza è potere<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707817976?h=d52083670d&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>La Materia Mutevole<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707793134?h=0649afda6f&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Human Matrix<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/709047001?h=5ece3a34a7&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><a href=https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/Human-Matrix.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/Human-Matrix.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div><div><h2>Non siamo quello che ci è stato detto<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707779866?h=0d516d1117&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Sfatiamo il mito dei geni<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707819785?h=1ce80e86fb&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>I pensieri sono cose che influenzano altre cose<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707793450?h=e384d73b14&badge=0&autopause=0&quality_selector=1&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><a href=\"https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/Il-Campo-Quantico.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/www.evolutionmasterclass.it\/wp-content\/uploads\/2023\/11\/Il-Campo-Quantico.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        giorno2: giorno2,
        giorno3: giorno3,
        giorno4: giorno4,
        //giorno5: giorno5,
        //special1:special1,
        //special2:special2,
        //giorno6: giorno6,
        //giorno7: giorno7,
        //giorno8: giorno8,
        //giorno9: giorno9,
        //giorno10: giorno10,
        //giorno11: giorno11,
        //giorno13: giorno13,
        //giorno14: giorno14,
        //giorno15: giorno15,
        //giorno16: giorno16,
        //giorno17: giorno17,
        //giorno18: giorno18,
        //giorno19: giorno19,
        //giorno20: giorno20,
        //giorno21: giorno21
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
