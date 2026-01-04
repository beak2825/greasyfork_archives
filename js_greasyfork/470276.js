// ==UserScript==
// @name         Corso online Detox Emozionale
// @namespace    corsodetoxemozionale
// @version      0.5
// @description  Corso online Detox Emozionale mMy Life
// @author       Flejta
// @include      https://www.corsodetoxemozionale.it/
// @include      https://www.corsodetoxemozionale.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470276/Corso%20online%20Detox%20Emozionale.user.js
// @updateURL https://update.greasyfork.org/scripts/470276/Corso%20online%20Detox%20Emozionale.meta.js
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
    codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";
    codicePagina += "    <div id=\"giorni\"><\/div>";
    var giorno1="";
    giorno1 += "<div>Giorno 1<\/div><div><h2>Riaccendere la scintilla<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354645?h=eff79f9ef5&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Dramma, trauma e stress<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354763?h=72cda20014&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Perchè sembra sempre che il dramma ti trovi<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354897?h=ff6e190584&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>La reazione post-traumatica da stress<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355013?h=ffff42b2e6&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Dipendenza e intolleranza all'istamina<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355129?h=ad12c271ec&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Ridurre lo stress<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/741873254?h=89471257d0&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Recovering your sparkle<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838315067?h=a80094206a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Drama, trauma, and stress<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838315903?h=49e68025d4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Why drama always seems to find you<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838316585?h=571a6918e9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Post-traumatic stress reaction<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838317154?h=a1e8a8fb90&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Histamine addiction and intolerance<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838317595?h=03b85f88b0&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:142 <a href=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Come-Guarire-un-Cuore-che-Soffre.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Come-Guarire-un-Cuore-che-Soffre.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div><div><h2>I video non sono visibili al momento per un disagio a livello internazionale indipendente dal nostro sito.";
    giorno2 += "Appena torneranno visibili ne sarà prolungata la visione.<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355193?h=92f10b83b2&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Eliminare lo stress dalla tua vita<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355269?h=783dc1e414&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Come modificare la dieta per accendere la scintilla<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355442?h=9697979a56&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Fai brillare l'ambiente in cui vivi<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355603?h=d54d6cbb54&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>I rimedi naturali per lo stress, la depressione e l'ansia<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355779?h=4bbe75aae0&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Lo yoga facile e rigenerante<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697355927?h=e02918b8e4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Ricevere l'assistenza<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697356063?h=37c4e8c63c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Riequilibrare le emozioni<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/741872039?h=b9c3d2ddc9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Yin and yang balance<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838317940?h=22199e89b7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>De-stressing your life<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838318192?h=aaad0d674c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Eating to regain your sparkle<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838318892?h=1dc43d60e0&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Your sparkling environment<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838319456?h=41a594028a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Natural stress, depression, and anxiety relief<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838320096?h=9ca7ed3243&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Gentle and restorative yoga<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838320487?h=712bca6831&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Getting support<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838320929?h=240169dac2&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Vivere-senza-dolore.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Vivere-senza-dolore.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div><div><h2>Relazionarsi con gli altri<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697356201?h=0304369489&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Come vi sentite nei confronti di altre persone<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697356294?h=dfedf7ee49&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Come scegliere gli amici con saggezza<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697356598?h=1ca96a64fe&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Ridurre lo stress<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/741873254?h=89471257d0&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Connecting with others<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838321523?h=3ea1dc4a9a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>How do you feel about other people?<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838321840?h=773f18d9d8&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Choosing your friends wisely<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838322955?h=fb861c50e8&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guarda il video<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354578?h=ffa0122f96&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Angel-Detox.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Angel-Detox.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno X<\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Dove e come incontrare persone sane<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/697356780?h=0566b0596c&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>I segnali d'allarme di un partner sentimentale<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/697356932?h=6812a6db6e&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Relazioni sentimentali scintillanti<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/697357124?h=64727789b8&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Come affrontare i drammi familiari<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/697357399?h=f4c2f5d90d&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Where and how to meet healthful people<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/838323720?h=1c0e0f308b&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Romantic-partner red flags<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/838324264?h=65855156f0&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Sparkling romantic relationships<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/838325035?h=a9c098e389&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>How to deal with family drama<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/838326083?h=ee01f2428b&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>";
    giorno4 += "    <h2>Guarda il video<\/h2>";
    giorno4 += "<\/div><br>";
    giorno4 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno4 += "        src=\"https:\/\/player.vimeo.com\/video\/697354456?h=01e7a8f6f8&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno4 += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    giorno4 += "        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "";
    giorno4 += "​ <a href=\"https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Fai-brillare-lAngelo-che-e%cc%80-in-te.pdf\">Scarica";
    giorno4 += "    il libro<\/a>";
    giorno4 += "<div>";
    giorno4 += "    <embed src=\"https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Fai-brillare-lAngelo-che-e%cc%80-in-te.pdf\"";
    giorno4 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno4 += "<\/div>";
    giorno4 += "";
    giorno4 += "<a href=\"https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf\">Scarica il libro<\/a>";
    giorno4 += "<div>";
    giorno4 += "    <embed src=\"https:\/\/www.corsodetoxemozionale.it\/wp-content\/uploads\/2022\/08\/Detox-Emozionale.pdf\"";
    giorno4 += "        type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/>";
    giorno4 += "<\/div>";
    var giorno5="";
    giorno5 += "<div>Giorno 5<\/div><div><h2>Cinque modi di interagire con persone difficili<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354394?h=63733306e9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Teniche per rilasciare lo stress rapidamente e con facilità<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354456?h=01e7a8f6f8&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Quattro consigli per guarire dolcemente da un trauma<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354518?h=5b0aa4b8f9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Come liberarsi da relazioni tossiche<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/697354578?h=ffa0122f96&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Five ways to deal with difficult relationships<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838328012?h=851184a42a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Gentle ways to heal and deal with trauma<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838328634?h=5983cb3a15&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Toxic relationships<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/838327093?h=c8c2fda6a2&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

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
        giorno4: giorno4,
        giorno5: giorno5
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