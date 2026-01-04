// ==UserScript==
// @name         Brian Weiss Corso MyLife 2
// @namespace    brianweiss
// @version      0.6
// @description  Visualizza videocorso Brian Weiss su My Life
// @author       Flejta
// @include      https://brianweiss.it/
// @include      https://brianweiss.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470066/Brian%20Weiss%20Corso%20MyLife%202.user.js
// @updateURL https://update.greasyfork.org/scripts/470066/Brian%20Weiss%20Corso%20MyLife%202.meta.js
// ==/UserScript==
// converti stringa Html Javascript: https://accessify.com/tools-and-wizards/developer-tools/html-javascript-convertor/
//        regex:
//        Stringa: https:\/\/player.vimeo.com\/video\/.*?(?=&amp)
//        Sito regex: https://regexr.com/

(function() {
    var codicePagina="";
    codicePagina += "    <button id=\"intro\">Introduzione<\/button>";
    codicePagina += "    <button id=\"giorno1\">giorno1<\/button>";
    codicePagina += "    <button id=\"giorno1Sera\">Giorno 1 Sera<\/button>";
    codicePagina += "    <button id=\"giorno2\">giorno2<\/button>";
    codicePagina += "    <button id=\"giorno3\">giorno3<\/button>";
    codicePagina += "    <button id=\"giorno4\">giorno4<\/button>";
    codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";
    codicePagina += "    <div id=\"giorni\"><\/div>";
    var giorno1="";
    giorno1 += "<div>Giorno 1<\/div><div><h2>Guarda i video esclusivi, selezionati per te, tratti dalle varie edizioni dei corsi con il dr. Brian Weiss<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698103539?h=3034caf9be&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Benvenuti al corso<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698103797?h=0d986adab7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Gli inizi e l'ipnosi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698103856?h=a4685307e9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>I benefici delle regressioni alle vite passate<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698104104?h=b8f0d0d869&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Vivi questa straordinaria meditazione con la guida del dr. Weiss<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698130430?h=3401b022de&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guarda l’entusiasmo di chi ha partecipato";
    giorno1 += "a un corso con il dr. Weiss<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/703300815?h=e8fd5cfa4a&badge=0&autopause=0&player_id=0&app_id=58479\/embed\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:166 <div><a href=\"https:\/\/www.mylife.it\/mediafile\/35\/download\" class=\"elementor-button-link elementor-button elementor-size-xs elementor-animation-grow\" role=\"button\">";
    giorno1 += "<span class=\"elementor-button-content-wrapper\">";
    giorno1 += "<span class=\"elementor-button-text\">Scarica la meditazione<\/span>";
    giorno1 += "<\/span>";
    giorno1 += "<\/a><\/div>";
    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div><div><h2>Guarda i nuovi contenuti di oggi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698104800?h=b7a594db96&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Esercizio di regressione all'infanzia<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698105267?h=1c6b179471&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Lasciare andare la rabbia<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698114698?h=4be51bf55c&badge=0&autopause=0&player_id=0&app_id=58479\/embed\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Condivisioni<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698106871?h=575447f624&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>I Miracoli Accadono<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698107757?h=3583763a7f&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Pratica questa intensa meditazione:<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698130267?h=9a42e0a349&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:142 <a href=https:\/\/brianweiss.it\/wp-content\/uploads\/2021\/10\/codice_vite_passate.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/brianweiss.it\/wp-content\/uploads\/2021\/10\/codice_vite_passate.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div><div><h2>Guarda il video e scegli la meditazione da praticare oggi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698108244?h=8e7fa6ac85&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione déjà vu geografico<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698109073?h=8494aca143&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione di Evoluzione interiore con la regressione<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698130563?h=f9725d0b0f&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guarda l’entusiasmo di chi ha partecipato";
    giorno3 += "a un corso con il dr. Weiss<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/703300815?h=e8fd5cfa4a&badge=0&autopause=0&player_id=0&app_id=58479\/embed\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno1sera="";
    giorno1sera += "<div>Giorno 1 Sera<\/div><div><h2>Tenere la Mente Aperta<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698104548?h=1fb845df8e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione Elimina lo Stress e Ritrova la Pace Interiore<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698131900?h=cf485e72d5&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guarda l’entusiasmo di chi ha partecipato";
    giorno1sera += "a un corso con il dr. Weiss<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/703300815?h=e8fd5cfa4a&badge=0&autopause=0&player_id=0&app_id=58479\/embed\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno1sera += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:166 <div><a href=\"https:\/\/www.mylife.it\/mediafile\/2620\/download\" class=\"elementor-button-link elementor-button elementor-size-xs elementor-animation-grow\" role=\"button\">";
    giorno1sera += "<span class=\"elementor-button-content-wrapper\">";
    giorno1sera += "<span class=\"elementor-button-text\">Scarica Gratis la meditazione<\/span>";
    giorno1sera += "<\/span>";
    giorno1sera += "<\/a><\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div><div><h2>Guarda gli esclusivi contenuti di oggi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698114949?h=230d26968e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Un'esplosione di amore<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698115207?h=cd1cdeae7b&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Regressione alle vite precedenti<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698131987?h=6d2edbc1a1&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno5="";
    giorno5 += "<div>Giorno 5<\/div><div><h2>Guarda i nuovi video della Masterclass<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698118511?h=c05f86f962&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Il Dr. Weiss risponde alle domande<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698118746?h=aec5e33f26&badge=0&autopause=0&player_id=0&app_id=58479\/embed\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Lasciati condurre dal dr. Weiss in queste due straordinarie meditazioni<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698131680?h=d55ecf5b83&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione Elimina lo Stress e Ritrova la Pace Interiore<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698131900?h=cf485e72d5&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guarda i nuovi esclusivi contenuti:<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698119799?h=882c0f5213&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Saluti Finali<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/698120096?h=3825d0668e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Nuove meditazioni esclusive<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/701157615?h=0099ba508c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:168 <div><a href=\"https:\/\/www.mylife.it\/mediafile\/2620\/download\" class=\"elementor-button-link elementor-button elementor-size-xs elementor-animation-grow\" role=\"button\">";
    giorno5 += "<span class=\"elementor-button-content-wrapper\">";
    giorno5 += "<span class=\"elementor-button-text\">Scarica la meditazione<\/span>";
    giorno5 += "<\/span>";
    giorno5 += "<\/a><\/div>";
    var intro="";
    intro += "<div><h1>Benvenuti<\/h1><\/div>";
    intro += "<div>";
    intro += "    <h2>Complimenti per aver scelto di partecipare alla Masterclass Regressione alle Vite Passate con il Dr. Brian";
    intro += "        Weiss.<\/h2>";
    intro += "<\/div><br>";
    intro += "<div>Iniziamo insieme il 10 luglio: sar� un�esperienza straordinaria!";
    intro += "    Il giorno prima, domenica 9 luglio, ti invieremo una email con le istruzioni per vivere al meglio questa";
    intro += "    meravigliosa avventura.";
    intro += "    Non vediamo l�ora di iniziare!<\/div><br>";
    intro += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    intro += "        src=\"https:\/\/player.vimeo.com\/video\/698103476?h=f5b2d3effb&badge=0&autopause=0&player_id=0&app_id=58479\"";
    intro += "        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"";
    intro += "        title=\"titolo\"><\/iframe> <\/div>";
    intro += "";
    intro += "<div><a href=\"https:\/\/www.mylife.it\/mediafile\/2620\/download\" rel=\"nofollow\"";
    intro += "        class=\"elementor-button-link elementor-button elementor-size-md elementor-animation-grow\" role=\"button\">";
    intro += "        <span class=\"elementor-button-content-wrapper\">";
    intro += "            <span class=\"elementor-button-icon elementor-align-icon-right\">";
    intro += "                <i aria-hidden=\"true\" class=\"fas fa-arrow-circle-right\"><\/i> <\/span>";
    intro += "            <span class=\"elementor-button-text\">Scarica Gratis la Meditazione<\/span>";
    intro += "        <\/span>";
    intro += "    <\/a>, <a style=\"text-decoration:underlined\" href=\"https:\/\/www.mylife.it\/mediafile\/36\/download\">Scarica Gratis<\/a>,";
    intro += "    <a href=\"https:\/\/www.mylife.it\/mediafile\/2620\/download\" rel=\"nofollow\"";
    intro += "        class=\"elementor-button-link elementor-button elementor-size-md elementor-animation-grow\" role=\"button\">";
    intro += "        <span class=\"elementor-button-content-wrapper\">";
    intro += "            <span class=\"elementor-button-icon elementor-align-icon-right\">";
    intro += "                <i aria-hidden=\"true\" class=\"fas fa-arrow-circle-right\"><\/i> <\/span>";
    intro += "            <span class=\"elementor-button-text\">Scarica Gratis la Meditazione<\/span>";
    intro += "        <\/span>";
    intro += "    <\/a><\/div>";
    intro += "<div>Introduzione<\/div><div><h2>Scopri l'Ipnosi regressiva con il massimo esperto mondiale<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/704082130?h=c6b8e3414f&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Prenota subito Gratis il tuo posto: la Masterclass inizia lunedì 10 luglio<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/704081534?h=a0261db8ed&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guarda l’entusiasmo ai corsi con il Dr. Weiss<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/703300815?h=e8fd5cfa4a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Partecipa a questo esclusivo evento online<\/h2><\/div><br><div>In questa straordinaria Masterclass online, dal 10 al 14 luglio, il Dr. Brian Weiss, considerato il massimo esperto al mondo di Ipnosi Regressiva e Regressione alle Vite Passate, ti condurrà alla scoperta delle Vite Precedenti.";
    intro += "";
    intro += "Con il suo stile unico, le profonde parole del Dr. Weiss apriranno le porte del tuo inconscio a conoscenze che porteranno gioia, perdono e armonia nella tua vita, donandoti una piacevole sensazione di ritrovato benessere.";
    intro += "";
    intro += "In questo dono, il Dr. Brian Weiss condivide profonde saggezze, intense esperienze e storie rivelatrici che illumineranno la strada per il tuo viaggio più affascinante: il Viaggio Interiore, alla scoperta della tua anima. Lasciati avvolgere dalle frequenze elevate e condividi questa esperienza con i tuoi amici. Dedicati il tempo necessario per vivere emozioni uniche e nuove informazioni che risveglieranno il tuo inconscio.";
    intro += "";
    intro += "In questi 5 giorni potrai meditare in profondità sugli insegnamenti ricevuti, farli risuonare dentro di te e viverli al meglio. Segnati le date: dal 10 luglio preparati a vivere l’esperienza che potrà donare una gioia profonda alla tua vita. I video rimarranno disponibili fino alle ore 10:00 del mattino seguente, così potrai organizzarti in base ai tuoi impegni per vedere le nuove puntate, rivedere le tue parti preferite e per praticare nuovamente le Meditazioni che ti avranno più ispirato.<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/704079691?h=496f6770bd&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\">";



    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        intro: intro,
        giorno1Sera: giorno1sera,
        giorno1: giorno1,
        giorno2: giorno2,
        giorno3: giorno3,
        giorno4: giorno4,
        giorno5: giorno5
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
