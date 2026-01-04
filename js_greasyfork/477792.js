// ==UserScript==
// @name         Angeli Terreni
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Angeli Terreni My Life
// @author       Flejta
// @include      https://angeliterreni.it/
// @include      https://angeliterreni.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477792/Angeli%20Terreni.user.js
// @updateURL https://update.greasyfork.org/scripts/477792/Angeli%20Terreni.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/
// MANCA GIORNO 1
(function() {
    var codicePagina="";
    codicePagina +="<br><br><br><br>"
    codicePagina += "    <button id=\"giorno1\">giorno1<\/button>";
    codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
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
    giorno1 += "<div>Giorno 1<\/div><div><h2>Introduzione<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707750323?h=82a359dace&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno degli Angeli incarnati<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707751040?h=2fd5c7b9c3&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno degli elementali incarnati<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707751456?h=bb66954ed8&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:145 <a href=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/Regno-angeli-terreni.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/Regno-angeli-terreni.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:169 <div><a href=\"https:\/\/www.mylife.it\/mediafile\/7212\/download\" class=\"elementor-button-link elementor-button elementor-size-md\" role=\"button\">";
    giorno1 += "						<span class=\"elementor-button-content-wrapper\">";
    giorno1 += "						<span class=\"elementor-button-text\">Scarica il libro<\/span>";
    giorno1 += "		<\/span>";
    giorno1 += "					<\/a><\/div>";
    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div><div><h2>Regno della gente delle stelle<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707751727?h=51e6caeaa0&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno dei saggi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707751970?h=de581b22fb&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno degli Angeli mistici<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707752202?h=c5a3dfde37&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "​ <a href=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/angeli-in-te.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/angeli-in-te.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    giorno2 += "​ <div><a href=\"https:\/\/www.mylife.it\/mediafile\/348\/download\" class=\"elementor-button-link elementor-button elementor-size-md\" role=\"button\">";
    giorno2 += "						<span class=\"elementor-button-content-wrapper\">";
    giorno2 += "						<span class=\"elementor-button-text\">Scarica il libro<\/span>";
    giorno2 += "		<\/span>";
    giorno2 += "					<\/a><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div><div><h2>Regno dei cavalieri<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707752368?h=d30a02ae7e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno dei geni di aladino<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707752514?h=05e20e2148&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno degli atlantidi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707752653?h=1b8516efae&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:145 <a href=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/Angeli-e-dee.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/Angeli-e-dee.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    giorno3 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:169 <div><a href=\"https:\/\/www.mylife.it\/mediafile\/348\/download\" class=\"elementor-button-link elementor-button elementor-size-md\" role=\"button\">";
    giorno3 += "						<span class=\"elementor-button-content-wrapper\">";
    giorno3 += "						<span class=\"elementor-button-text\">Scarica il libro<\/span>";
    giorno3 += "		<\/span>";
    giorno3 += "					<\/a><\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div><div><h2>Regno dei cherubini incantati<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707752726?h=2c653f0940&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno delle stelle mistiche, degli angeli cosmici e stelle mistiche angeliche<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707752818?h=da66a60278&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regno degli gnomi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707752899?h=9531613318&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += " <a href=https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/santi-e-angeli.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/santi-e-angeli.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    giorno4 += " <div><a href=\"https:\/\/www.mylife.it\/mediafile\/348\/download\" class=\"elementor-button-link elementor-button elementor-size-md\" role=\"button\">";
    giorno4 += "						<span class=\"elementor-button-content-wrapper\">";
    giorno4 += "						<span class=\"elementor-button-text\">Scarica il libro<\/span>";
    giorno4 += "		<\/span>";
    giorno4 += "					<\/a><\/div>";
    var giorno5="";
    giorno5 += "<div>Giorno 5<\/div><div><h2>Regno delle sirene e dei tritoni<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707753002?h=9906de8eb5&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Sintesi dei regni<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707753056?h=e62744cba1&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Come utilizzare il corso<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/707753484?h=c8a5a0cd76&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:145 <a href=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/Regno-angeli-terreni.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/angeliterreni.it\/wp-content\/uploads\/2022\/12\/Regno-angeli-terreni.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    giorno5 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:169 <div><a href=\"https:\/\/www.mylife.it\/mediafile\/348\/download\" class=\"elementor-button-link elementor-button elementor-size-md\" role=\"button\">";
    giorno5 += "						<span class=\"elementor-button-content-wrapper\">";
    giorno5 += "						<span class=\"elementor-button-text\">Scarica il libro<\/span>";
    giorno5 += "		<\/span>";
    giorno5 += "					<\/a><\/div>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        giorno2: giorno2,
        giorno3: giorno3,
        giorno4: giorno4,
        giorno5: giorno5
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
