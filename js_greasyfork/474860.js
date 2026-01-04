// ==UserScript==
// @name         Angeli della Gioia
// @namespace    Angeli_Della_Gioia
// @version      4
// @description  Angeli Della Gioia My Life
// @author       Flejta
// @include      https://angelidellagioia.it/
// @include      https://angelidellagioia.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474860/Angeli%20della%20Gioia.user.js
// @updateURL https://update.greasyfork.org/scripts/474860/Angeli%20della%20Gioia.meta.js
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
    giorno1 += "<div>Giorno 1<\/div><div><h2>Introduzione<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/837899302?h=97e39c15e7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Introduzione<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/837899302?h=97e39c15e7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Angeli e Amore<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/837899474?h=6b4bdc1326&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione: Angeli e Amore<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/837900049?h=9837756cd6&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Introduction<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842461563?h=10e20a8ef9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Introduction<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842461563?h=10e20a8ef9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Angels and Love<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842461675?h=d1eac0fe46&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditation: Angels and Love<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842462038?h=eeac60a64e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div><div><h2>Salute e guarigione con l'Arcangelo Raffaele<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/839664532?h=7c6f0ff493&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Salute e guarigione con l'Arcangelo Raffaele<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/839664532?h=7c6f0ff493&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione:Salute e guarigione con l'Arcangelo Raffaele<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/839664891?h=5b9b0a2d7b&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Gli Angeli di Joy<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/839703326?h=fb7dc46fdd&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Health and Healing with Archangel Raphael<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842462399?h=a488de77bc&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Health and Healing with Archangel Raphael<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842462399?h=a488de77bc&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditation:Health and Healing with Archangel Raphael<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842469254?h=e23e65ba7c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Joy's Angels<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842469771?h=3635f4cc5b&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/angelidellagioia.it\/wp-content\/uploads\/2023\/08\/Libro-I-miracoli-dellarcangelo-Raffaele.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/angelidellagioia.it\/wp-content\/uploads\/2023\/08\/Libro-I-miracoli-dellarcangelo-Raffaele.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno X<\/div><div><h2>Abbondanza e manifestazione<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/839788105?h=cbb027395e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Abbondanza e manifestazione<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/839788105?h=cbb027395e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione: Abbondanza e manifestazione<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840473367?h=6d1bcde72a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Abundance and Manifestation<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842470034?h=8d6d75935a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Abundance and Manifestation<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842470034?h=8d6d75935a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditation: Abundance and Manifestation<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842470496?h=e91ef19c0f&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "​ <a href=https:\/\/angelidellagioia.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/angelidellagioia.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div><div><h2>Scopo della vita<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842233896?h=86f2e7f2ab&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Scopo della vita<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842233896?h=86f2e7f2ab&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione: Scopo della vita<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842234293?h=04e0e3e17b&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Purpose of life<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842470825?h=36bf87bbf7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Purpose of life<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842470825?h=36bf87bbf7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditation: Purpose of life<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/842471176?h=3c15ae5825&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";


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
