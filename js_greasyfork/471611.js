// ==UserScript==
// @name         Mindfulness con Jon Kabat-Zinn
// @namespace    Corso_Mindufllness_Jon_Kabat_Zinn
// @version      0.3
// @description  Visualizza videocorso Eckhart Tolle
// @author       Flejta
// @include      https://jonkabat-zinn.it/
// @include      https://jonkabat-zinn.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471611/Mindfulness%20con%20Jon%20Kabat-Zinn.user.js
// @updateURL https://update.greasyfork.org/scripts/471611/Mindfulness%20con%20Jon%20Kabat-Zinn.meta.js
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
    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";

    codicePagina += "    <div id=\"giorni\"><\/div>";

    var giorno1="";
    giorno1 += "<div>Giorno 1<\/div>";
    giorno1 += "<div>";
    giorno1 += "    <h2>Q&A Apertura<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "        src=\"https:\/\/player.vimeo.com\/video\/696042841?h=c1580081cf&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno1 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>In inglese con sottotitoli<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "        src=\"https:\/\/player.vimeo.com\/video\/696042974?h=60992295ac&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno1 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno1 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "";
    giorno1 += "<a href=http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Domande-e-Risposte-iniziali.pdf>Scarica il libro<\/a>";
    giorno1 += "<div> <embed src=http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Domande-e-Risposte-iniziali.pdf";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div><a";
    giorno1 += "    href=http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Articolo_Joga_journal_Aprile2021-1.pdf>Scarica il libro<\/a>";
    giorno1 += "<div> <embed src=http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Articolo_Joga_journal_Aprile2021-1.pdf";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno2="";
    giorno2 += "<div><h1>Giorno 2<\/h1><\/div>";
    giorno2 += "";
    giorno2 += "<div>Come risolvere momenti difficili<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696029892?h=db956ab929&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>In inglese con sottotitoli<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696029976?h=25b23c1892&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<h2>AUDIOCORSO<br>";
    giorno2 += "   Mindfulness per la riduzione del dolore<\/h2>";
    giorno2 += "<div>Introduzione<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696030575?h=52772506e4&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Imparare a convivere con il dolore<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696030715?h=acd903e746&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>La riduzione dello stress basata sulla Mindfulness<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696030822?h=c297e014ff&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Sette principi per lavorare con il dolore<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696030944?h=4bd543d6c8&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Coltivare la Mindfulness<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696031141?h=27f07efb2d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Il potere della pratica con disciplina<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696031268?h=15aa42e782&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>La Mindfulness nel respiro<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696031377?h=fdf0d86270&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Come reagire al dolore<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696031540?h=2551d0a692&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Lavorare con le emozioni e i pensieri legati al dolore<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696031764?h=394a480fd1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Dimorare nella consapevolezza. Una pausa consapevole di tre minuti<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696031944?h=5d1d1739fd&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>Breve esercizio di body scan<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696032048?h=a8b2aac3d1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>La Mindfulness nella vita di tutti i giorni<\/div>";
    giorno2 += "<br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/696032287?h=9ff3c1205f&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<a href=http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Come-risolvere-momenti-difficili.pdf>Scarica il libro<\/a>";
    giorno2 += "<div>";
    giorno2 += "   <embed src=http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Come-risolvere-momenti-difficili.pdf";
    giorno2 += "      type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno2 += "<\/div>";
    var giorno3="";
    giorno3 += "<div><b>Giorno 3<\/b><\/div> <br><br>";
    giorno3 += "<div>Meditazione sulla gentilezza amorevole<\/div><br>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno3 += "                src=\"https:\/\/player.vimeo.com\/video\/696033968?h=3869d32dfd&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno3 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno3 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>Perchè la Mindfulness è importante e potrebbe essere importante per te<\/div><br>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno3 += "                src=\"https:\/\/player.vimeo.com\/video\/696049307?h=d49b41fceb&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno3 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno3 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>In inglese con sottotitoli<\/div><br>";
    giorno3 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno3 += "                src=\"https:\/\/player.vimeo.com\/video\/696050660?h=346a62e867&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"";
    giorno3 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno3 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<a href=\"http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Meditazione-Gentilezza-Amorevole.pdf\">Scarica il libro<\/a>";
    giorno3 += "<div>";
    giorno3 += "        <embed src=\"http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Meditazione-Gentilezza-Amorevole.pdf\"";
    giorno3 += "                type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno3 += "<\/div>";
    giorno3 += "<a href=\"http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Manuale-Mindfulness.pdf\">Scarica il libro<\/a>";
    giorno3 += "<div>";
    giorno3 += "        <embed src=\"http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Manuale-Mindfulness.pdf\"";
    giorno3 += "                type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno3 += "<\/div>";
    giorno3 += "<a href=\"http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Articolo_Joga_journal_Aprile2021-1.pdf\">Scarica il libro<\/a>";
    giorno3 += "<div>";
    giorno3 += "        <embed src=\"http:\/\/jonkabat-zinn.it\/wp-content\/uploads\/2022\/02\/Articolo_Joga_journal_Aprile2021-1.pdf\"";
    giorno3 += "                type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        //giorno1Sera: giorno1sera,
        giorno2: giorno2,
        giorno3: giorno3
        //giorno4: giorno4,
        //giorno5: giorno5,
        //giorno1sera2: giorno1sera2
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
