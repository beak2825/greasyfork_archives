// ==UserScript==
// @name         Scopri il tuo autentico potere - Melissa Joy
// @namespace    corso_autentico_potere
// @version      0.4
// @description  Corso Scopri il tuo autentico potere - Melissa Joy
// @author       Flejta
// @include      https://melissajoy.it/
// @include      https://melissajoy.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472411/Scopri%20il%20tuo%20autentico%20potere%20-%20Melissa%20Joy.user.js
// @updateURL https://update.greasyfork.org/scripts/472411/Scopri%20il%20tuo%20autentico%20potere%20-%20Melissa%20Joy.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/

(function() {
    var codicePagina="";
    codicePagina += "    <button id=\"giorno1\">giorno1<\/button>";
    //codicePagina += "    <button id=\"giorno1Sera\">giorno1Sera<\/button>";
    codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    //codicePagina += "    <button id=\"giorno3sera\">giorno3sera<\/button>";
    codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";
    codicePagina += "    <div id=\"giorni\"><\/div>";
    var giorno1="";
    giorno1 += "<div><h1>Giorno 1<\/h1><\/div>";
    giorno1 += "<div>";
    giorno1 += "    <h2>Parte 1<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "        src=\"https:\/\/player.vimeo.com\/video\/829708022?h=2e047ffcf7&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno1 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "    <h2>Part 1<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "        src=\"https:\/\/player.vimeo.com\/video\/829729603?h=14af5d378b&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno1 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<a href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-1-Scopri-il-tuo-Autentico-Potere.pdf\">Scarica il";
    giorno1 += "    libro<\/a>";
    giorno1 += "<div> <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-1-Scopri-il-tuo-Autentico-Potere.pdf\"";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div><a";
    giorno1 += "    href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-1.pdf\">Scarica il";
    giorno1 += "    libro<\/a>";
    giorno1 += "<div> <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-1.pdf\"";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div><a";
    giorno1 += "    href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Il-piccolo-libro-del-grande-potenziale-quantico.pdf\">Scarica il";
    giorno1 += "    libro<\/a>";
    giorno1 += "<div> <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Il-piccolo-libro-del-grande-potenziale-quantico.pdf\"";
    giorno1 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";
    giorno1 += "<div><a href=\"https:\/\/www.mylife.it\/mediafile\/8258\/download\" target=\"_blank\"";
    giorno1 += "        class=\"elementor-button-link elementor-button elementor-size-xl\" role=\"button\">";
    var giorno2="";
    giorno2 += "<\/div><div><h2>Parte 2<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/829708194?h=44f8e563d4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Part 2<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/829729853?h=a43775278c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-2-Scopri-il-tuo-Autentico-Potere.pdf>Scarica il libro<\/a><div>        <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-2-Scopri-il-tuo-Autentico-Potere.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-2.pdf\">Scarica il libro<\/a><div>        <embed src=https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-2.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/arte_vivere_senza_limiti-ebook.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/arte_vivere_senza_limiti-ebook.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div><div><h2>Parte 3<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/829708678?h=f17605aa84&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Part 3<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/829730479?h=025093b6c4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "​ <a href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-3-Scopri-il-tuo-Autentico-Potere.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-3-Scopri-il-tuo-Autentico-Potere.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-3.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-3.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Il-piccolo-libro-del-grande-potenziale-quantico.pdf\">Scarica il libro<\/a><div>        <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Il-piccolo-libro-del-grande-potenziale-quantico.pdf\" type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div>";
    giorno4 += "<div>";
    giorno4 += "   <h2>Parte 4<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "      src=\"https:\/\/player.vimeo.com\/video\/829709264?h=6625ceea39&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "      frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "      title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "   <h2>Part 4<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "      src=\"https:\/\/player.vimeo.com\/video\/829731173?h=f39e74a3b4&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "      frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "      title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:144 <a";
    giorno4 += "   href=https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-4-Scopri-il-tuo-Autentico-Potere.pdf>Scarica il";
    giorno4 += "   libro<\/a>";
    giorno4 += "<div> <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Manuale-4-Scopri-il-tuo-Autentico-Potere.pdf\"";
    giorno4 += "      type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div><a";
    giorno4 += "   href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-4.pdf\"\">Scarica il libro<\/a>";
    giorno4 += "<div> <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/Scopri-il-tuo-Autentico-Potere-Slide-4.pdf\"";
    giorno4 += "      type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div><a";
    giorno4 += "   href=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/arte_vivere_senza_limiti-ebook.pdf\">Scarica il libro<\/a>";
    giorno4 += "<div> <embed src=\"https:\/\/melissajoy.it\/wp-content\/uploads\/2023\/07\/arte_vivere_senza_limiti-ebook.pdf\"";
    giorno4 += "      type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        //giorno1Sera: giorno1sera,
        giorno2: giorno2,
        giorno3: giorno3,
        //giorno3sera:giorno3sera,
        giorno4: giorno4
        //giorno5: giorno5
        //giorno6: giorno6,
        //giorno7: giorno7
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