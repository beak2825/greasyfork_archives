// ==UserScript==
// @name         LE MEDITAZIONI DEGLI ANGELI
// @namespace    meditazioni_angeli
// @version      12
// @description  guarda video LE MEDITAZIONI DEGLI ANGELI
// @author       Flejta
// @include      https://meditazioniangeli.it/
// @include      https://meditazioniangeli.it
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472897/LE%20MEDITAZIONI%20DEGLI%20ANGELI.user.js
// @updateURL https://update.greasyfork.org/scripts/472897/LE%20MEDITAZIONI%20DEGLI%20ANGELI.meta.js
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
    codicePagina += "    <button id=\"giorno5\">giorno5<\/button>";
    codicePagina += "    <button id=\"giorno6\">giorno6<\/button>";
    codicePagina += "    <button id=\"giorno7\">giorno7<\/button>";
    codicePagina += "    <button id=\"giorno8\">giorno8<\/button>";
    codicePagina += "    <button id=\"giorno9\">giorno9<\/button>";
    codicePagina += "    <button id=\"giorno10\">giorno10<\/button>";
    codicePagina += "    <button id=\"giorno11\">giorno11<\/button>";
    codicePagina += "    <button id=\"giorno12\">giorno12<\/button>";

    codicePagina += "    <!-- Aggiungi qui gli altri 18 pulsanti con id \"giorno4\", \"giorno5\", ecc. -->";

    codicePagina += "    <div id=\"giorni\"><\/div>";

    var giorno2="";
    giorno2 += "<div>Giorno 2<\/div><div><h2>Arcangelo Jophiel<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744636542?h=3d0fb7c702&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Archangel Jophiel<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840488011?h=a572eb333f&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<section class=\"elementor-section elementor-top-section elementor-element elementor-element-dbdbe78 elementor-section-boxed elementor-section-height-default elementor-section-height-default\" data-id=\"dbdbe78\" data-element_type=\"section\" data-settings=\"{&quot;background_background&quot;:&quot;classic&quot;}\">";
    giorno2 += "<div class=\"elementor-container elementor-column-gap-default\">";
    giorno2 += "<div class=\"elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-915afe5\" data-id=\"915afe5\" data-element_type=\"column\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-7bc9465 elementor-widget elementor-widget-heading\" data-id=\"7bc9465\" data-element_type=\"widget\" data-widget_type=\"heading.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">";
    giorno2 += "<h2 class=\"elementor-heading-title elementor-size-default\">Ritrova la tua connessione<br \/>con Le Meditazioni degli Angeli<\/h2>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<section class=\"elementor-section elementor-inner-section elementor-element elementor-element-95ba734 elementor-section-boxed elementor-section-height-default elementor-section-height-default\" data-id=\"95ba734\" data-element_type=\"section\">";
    giorno2 += "<div class=\"elementor-container elementor-column-gap-default\">";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-d2531c1\" data-id=\"d2531c1\" data-element_type=\"column\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-e3727b9 elementor-widget elementor-widget-text-editor\" data-id=\"e3727b9\" data-element_type=\"widget\" data-widget_type=\"text-editor.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">";
    giorno2 += "<p class=\"p1\">Meditare &egrave; una pratica antica e affascinante che ti permette, in maniera diretta ed efficace, di innalzare il tuo livello vibrazionale e&nbsp;<strong>migliorare molti aspetti della vita<\/strong>.&nbsp;<\/p>";
    giorno2 += "<p class=\"p1\">Con la meditazione&nbsp;<strong>entri in uno spazio di grande pace e concentrazione<\/strong>&nbsp;che ti guida a riprendere il contatto con il tuo Io pi&ugrave; profondo per sbloccare le emozioni e prenderti cura del tuo corpo e della tua anima.<\/p>";
    giorno2 += "<p class=\"p1\">Meditare &egrave; anche il&nbsp;<strong>modo migliore per comunicare con gli angeli&nbsp;<\/strong>e accogliere con chiarezza i loro messaggi.<\/p>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-08f7e85\" data-id=\"08f7e85\" data-element_type=\"column\" data-settings=\"{&quot;background_background&quot;:&quot;classic&quot;}\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-386e8aa elementor-widget elementor-widget-image\" data-id=\"386e8aa\" data-element_type=\"widget\" data-widget_type=\"image.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">&nbsp;<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/section>";
    giorno2 += "<section class=\"elementor-section elementor-inner-section elementor-element elementor-element-7ef2fcf elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default\" data-id=\"7ef2fcf\" data-element_type=\"section\">";
    giorno2 += "<div class=\"elementor-container elementor-column-gap-default\">";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-f3ce0ec\" data-id=\"f3ce0ec\" data-element_type=\"column\" data-settings=\"{&quot;background_background&quot;:&quot;classic&quot;}\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-f132d07 elementor-widget elementor-widget-image\" data-id=\"f132d07\" data-element_type=\"widget\" data-widget_type=\"image.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">&nbsp;<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-5b7ff23\" data-id=\"5b7ff23\" data-element_type=\"column\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-26520a4 elementor-widget elementor-widget-text-editor\" data-id=\"26520a4\" data-element_type=\"widget\" data-widget_type=\"text-editor.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">";
    giorno2 += "<p class=\"p1\"><strong>Le Meditazioni degli Angeli<\/strong>, il nuovo splendido programma di 12 potenti meditazioni<strong>&nbsp;creato da Roy e Joy Martina<\/strong>,<strong>&nbsp;<\/strong>&egrave; una grande opportunit&agrave; di crescita interiore e autoguarigione per&nbsp;<strong>potenziare il tuo benessere psicofisico<\/strong>. Stabilendo&nbsp;<strong>una connessione profonda con il mondo angelico<\/strong>, espandi l&rsquo;intuito oltre i confini del sensibile, fai il pieno di energie e accogli pi&ugrave; gioia, vivacit&agrave; ed entusiasmo nella tua vita.<\/p>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/section>";
    giorno2 += "<section class=\"elementor-section elementor-inner-section elementor-element elementor-element-b07b825 elementor-section-boxed elementor-section-height-default elementor-section-height-default\" data-id=\"b07b825\" data-element_type=\"section\">";
    giorno2 += "<div class=\"elementor-container elementor-column-gap-default\">";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-62d0164\" data-id=\"62d0164\" data-element_type=\"column\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-c34203b elementor-widget elementor-widget-text-editor\" data-id=\"c34203b\" data-element_type=\"widget\" data-widget_type=\"text-editor.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">";
    giorno2 += "<p class=\"p1\">Guidato da una voce amorevole e cullato da un&nbsp;<strong>piacevole sottofondo che evoca i suoni della natura<\/strong>, regolarizzi il respiro e accedi a un livello alto di concentrazione.<\/p>";
    giorno2 += "<p class=\"p1\">Lasciati trasportare dalle immagini e con la mente,&nbsp;<strong>esplora i mondi superiori<\/strong>&nbsp;abitati dagli angeli. Le creature celesti ti aiuteranno a elevare le tue vibrazioni, ad affinare il tuo intuito e a potenziare le tue abilit&agrave; naturali per&nbsp;<strong>accogliere dentro di te l&rsquo;energia del benessere e del rinnovamento<\/strong>.<\/p>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-4634ce7\" data-id=\"4634ce7\" data-element_type=\"column\" data-settings=\"{&quot;background_background&quot;:&quot;classic&quot;}\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-184d7c5 elementor-widget elementor-widget-image\" data-id=\"184d7c5\" data-element_type=\"widget\" data-widget_type=\"image.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">&nbsp;<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/section>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/section>";
    giorno2 += "<section class=\"elementor-section elementor-top-section elementor-element elementor-element-1bf5128 elementor-section-boxed elementor-section-height-default elementor-section-height-default\" data-id=\"1bf5128\" data-element_type=\"section\">";
    giorno2 += "<div class=\"elementor-container elementor-column-gap-default\">";
    giorno2 += "<div class=\"elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-2104a6b\" data-id=\"2104a6b\" data-element_type=\"column\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-3cf2570 elementor-widget elementor-widget-heading\" data-id=\"3cf2570\" data-element_type=\"widget\" data-widget_type=\"heading.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">";
    giorno2 += "<h2 class=\"elementor-heading-title elementor-size-default\">Fai la Programmazione nel Sonno<br \/>insieme ai tuoi Angeli<\/h2>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<section class=\"elementor-section elementor-inner-section elementor-element elementor-element-38fc30c elementor-section-boxed elementor-section-height-default elementor-section-height-default\" data-id=\"38fc30c\" data-element_type=\"section\">";
    giorno2 += "<div class=\"elementor-container elementor-column-gap-default\">";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-6495f2c\" data-id=\"6495f2c\" data-element_type=\"column\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-cd04855 elementor-widget elementor-widget-text-editor\" data-id=\"cd04855\" data-element_type=\"widget\" data-widget_type=\"text-editor.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">";
    giorno2 += "<p class=\"p1\">Lo&nbsp;<strong>Sleep Programming<\/strong>&nbsp;o Programmazione nel Sonno &egrave; un Brain Training notturno, una tecnica messa a punto dal&nbsp;<strong>Dr. Roy Martina<\/strong>&nbsp;quando era molto giovane per superare le difficolt&agrave; di concentrazione.<\/p>";
    giorno2 += "<p class=\"p1\">Consiste nell&rsquo;ascoltare durante il sonno e a un volume bassissimo ci&ograve; che, da sveglia, la nostra mente fatica a elaborare. A un livello pi&ugrave; alto permette di&nbsp;<strong>riprogrammare la mente inconscia<\/strong>&nbsp;per sbarazzarsi delle convinzioni limitanti, traumi e stress e accogliere una nuova vita ricca di benessere e serenit&agrave;.<\/p>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-c0a01a0\" data-id=\"c0a01a0\" data-element_type=\"column\" data-settings=\"{&quot;background_background&quot;:&quot;classic&quot;}\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-c823c51 elementor-widget elementor-widget-image\" data-id=\"c823c51\" data-element_type=\"widget\" data-widget_type=\"image.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">&nbsp;<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/section>";
    giorno2 += "<section class=\"elementor-section elementor-inner-section elementor-element elementor-element-04d248a elementor-reverse-mobile elementor-section-boxed elementor-section-height-default elementor-section-height-default\" data-id=\"04d248a\" data-element_type=\"section\">";
    giorno2 += "<div class=\"elementor-container elementor-column-gap-default\">";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-c2c852a\" data-id=\"c2c852a\" data-element_type=\"column\" data-settings=\"{&quot;background_background&quot;:&quot;classic&quot;}\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-54ce8cf elementor-widget elementor-widget-image\" data-id=\"54ce8cf\" data-element_type=\"widget\" data-widget_type=\"image.default\">";
    giorno2 += "<div class=\"elementor-widget-container\"><img title=\"fondo-vuoto.png\" src=\"https:\/\/meditazioniangeli.it\/wp-content\/uploads\/elementor\/thumbs\/fondo-vuoto-qa9xoy6p3kpgwxmmz2mcr4pg6esnilaruelhjyew7c.png\" alt=\"fondo-vuoto.png\" \/><\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<div class=\"elementor-column elementor-col-50 elementor-inner-column elementor-element elementor-element-e3d3e1a\" data-id=\"e3d3e1a\" data-element_type=\"column\">";
    giorno2 += "<div class=\"elementor-widget-wrap elementor-element-populated\">";
    giorno2 += "<div class=\"elementor-element elementor-element-07135b4 elementor-widget elementor-widget-text-editor\" data-id=\"07135b4\" data-element_type=\"widget\" data-widget_type=\"text-editor.default\">";
    giorno2 += "<div class=\"elementor-widget-container\">";
    giorno2 += "<p class=\"p1\">Puoi sperimentare tutti i benefici dello Sleep Programming seguendo il programma&nbsp;<strong>Le Meditazioni degli Angeli<\/strong>. Le&nbsp;<strong>meditazioni angeliche<\/strong>&nbsp;che Roy Martina e la dottoressa<strong>&nbsp;<\/strong>Joy<strong>&nbsp;<\/strong>hanno amorevolmente creato per te, sono una modalit&agrave; fantastica&nbsp;<strong>per iniziare a praticare il Brain Training notturno<\/strong>.<\/p>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/section>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/div>";
    giorno2 += "<\/section>";
    var giorno3="";
    giorno3 += "<div>Giorno 3<\/div><div><h2>Arcangelo Chamuel<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744649605?h=0c2dfd39ed&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Archangel Chamuel<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840488486?h=5978231ee7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno4="";
    giorno4 += "<div>Giorno 4<\/div><div><h2>Angelo Ooniemme<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744659019?h=2af6f1ecc8&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Angel Ooniemme<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840489198?h=ff1557c1e9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Angeli-attorno-a-noi.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Angeli-attorno-a-noi.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno5="";
    giorno5 += "<div>Giorno 5<\/div><div><h2>Arcangelo Raffaele<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744739922?h=92574968f0&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Archangel Raphael<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840498271?h=b5ce5437df&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno6="";
    giorno6 += "<div>Giorno 6<\/div><div><h2>Arcangelo Uriel<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744890470?h=da102a072f&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Archangel Uriel<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840498707?h=a2db2d6280&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno6 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno7="";
    giorno7 += "<div>Giorno 7<\/div><div><h2>Arcangelo Metatron<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744893817?h=7cedb12062&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Archangel Metatron<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840499159?h=ab49876816&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno8="";
    giorno8 += "<div>Giorno X<\/div><div><h2>Angeli Custodi<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744910116?h=b999c05d16&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Guardian Angels<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840499741?h=93465cc0ea&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno9="";
    giorno9 += "<div>Giorno 9<\/div><div><h2>Angelo Ramaela<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744913759?h=fc04fdefbf&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Angel Ramaela<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840501842?h=287154eab9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno9 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Angeli-attorno-a-noi.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Angeli-attorno-a-noi.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno10="";
    giorno10 += "<div>Giorno 10<\/div><div><h2>Angelo Paschar<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744930135?h=176027fea7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Angel Paschar<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840502197?h=de117cdc4a&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    var giorno11="";
    giorno11 += "<div>Giorno 11<\/div><div><h2>Angelo Anael<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744933173?h=0a26685779&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Angel Anael<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840502586?h=14661995a1&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno11 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno1="";
    giorno1 += "<div>Giorno 1<\/div><div><h2>Arcangelo Michele<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744621778?h=24077f902f&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Archangel Michael<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840487445?h=e387fece87&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=201ef458-ffb9-4a19-a687-a192311c1deb:144 <a href=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/meditazioniangeli.it\/wp-content\/uploads\/2023\/08\/Libro-Connessione-con-gli-angeli.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno12="";
    giorno12 += "<div>Giorno 12<\/div><div><h2>Angelo Mihr<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/744936177?h=5aa2a8664e&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Angel Mihr<\/h2><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/840503000?h=c5933af957&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        //giorno1Sera: giorno1sera,
        giorno2: giorno2,
        giorno3: giorno3,
        giorno4: giorno4,
        giorno5: giorno5,
        giorno6: giorno6,
        giorno7: giorno7,
        giorno8: giorno8,
        giorno9: giorno9,
        giorno10: giorno10,
        giorno11: giorno11,
        giorno12: giorno12

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
