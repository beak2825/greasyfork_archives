// ==UserScript==
// @name         Omega Healing
// @namespace    corso_omega_healing
// @version      0.4
// @description  Corso Omega Healing My Life
// @author       Flejta
// @include      https://www.omegahealing.com
// @include      https://www.omegahealing.com/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471777/Omega%20Healing.user.js
// @updateURL https://update.greasyfork.org/scripts/471777/Omega%20Healing.meta.js
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
    giorno1 += "        <h2>Video 1<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708568978?h=d96d222e6e&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 2<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708569290?h=3fa0be9580&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 3<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708569545?h=b9ac60802e&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 4<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708569901?h=d21196be62&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 5<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708570203?h=cfac824d34&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 6<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708570517?h=5a6e9abc03&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 7<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708570745?h=493c9e77f3&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 8<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708571011?h=f1cc6afbb7&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Meditazione: Connessione cerebrale<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/746798098?h=06cf67e3df&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 1<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708607396?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 2<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708607655?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 3<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708607895?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 4<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708608123?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 5<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708608355?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 6<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708608557?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 7<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708608774?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>";
    giorno1 += "        <h2>Video 8<\/h2>";
    giorno1 += "<\/div><br>";
    giorno1 += "<div><\/div><br>";
    giorno1 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno1 += "                src=\"https:\/\/player.vimeo.com\/video\/708608949?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno1 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno1 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:144 <a";
    giorno1 += "        href=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf>Scarica il libro<\/a>";
    giorno1 += "<div> <embed src=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf type=\"application\/pdf\"";
    giorno1 += "                width=\"100%\" height=\"600px\" \/><\/div><a";
    giorno1 += "        href=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/Omega-Healing-Libro.pdf>Scarica il libro<\/a>";
    giorno1 += "<div> <embed src=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/Omega-Healing-Libro.pdf type=\"application\/pdf\"";
    giorno1 += "                width=\"100%\" height=\"600px\" \/><\/div>";
    giorno1 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:168";
    giorno1 += "<div><a href=\"https:\/\/www.mylife.it\/mediafile\/19\/download\"";
    giorno1 += "                class=\"elementor-button-link elementor-button elementor-size-md elementor-animation-grow\" role=\"button\">";
    giorno1 += "                <span class=\"elementor-button-content-wrapper\"> <span class=\"elementor-button-text\">Scarica il libro";
    giorno1 += "                                PDF<\/span> <\/span> <\/a><\/div>";
    var giorno2="";
    giorno2 += "<div>";
    giorno2 += "        <h1>Giorno 2<\/h1>";
    giorno2 += "<\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 9<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708571360?h=466ae10187&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 10<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708596665?h=aacd952425&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 11<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708596934?h=dc5f489c74&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 12<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708597243?h=7a939c950e&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 13<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708597516?h=3332d25865&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 14<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708597856?h=cd18c85ebd&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 15<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708598099?h=81bc1eb1c6&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Meditazione: Rilassa mente e corpo<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/746802527?h=4ea302d9a0&badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 9<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708609149?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 10<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708609293?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 11<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708613790?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 12<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708614025?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 13<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708614257?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 14<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708614465?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>";
    giorno2 += "        <h2>Video 15<\/h2>";
    giorno2 += "<\/div><br>";
    giorno2 += "<div><\/div><br>";
    giorno2 += "<div style=\"width: 100%; height: 500px;\"> <iframe";
    giorno2 += "                src=\"https:\/\/player.vimeo.com\/video\/708614646?badge=0&autopause=0&player_id=0&app_id=58479\"";
    giorno2 += "                frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen";
    giorno2 += "                style=\"width:100%;height:100%;\" title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:144 <a";
    giorno2 += "        href=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf>Scarica il libro<\/a>";
    giorno2 += "<div> <embed src=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf type=\"application\/pdf\"";
    giorno2 += "                width=\"100%\" height=\"600px\" \/><\/div><a";
    giorno2 += "        href=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/Il-Linguaggio-Segreto-del-Corpo.pdf>Scarica il";
    giorno2 += "        libro<\/a>";
    giorno2 += "<div> <embed src=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/Il-Linguaggio-Segreto-del-Corpo.pdf";
    giorno2 += "                type=\"application\/pdf\" width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno3="";
    giorno3 += "<div>Giorno X<\/div><div><h2>Video 16<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708598334?h=c0b0012c54&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 17<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708598655?h=ab3e691994&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 18<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708598937?h=c6384ebef8&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 19<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708599197?h=4aec0fd088&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 20<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708599529?h=0af14ea8f7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 21<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708601559?h=848cad19c9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 22<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708601953?h=18189ddfd5&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 23<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708602362?h=760218116c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 24<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708602655?h=93f85a41e9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione: Tagliare i lacci karmici<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/746813403?h=30c055becb&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione: Connessione al futuro<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/746813324?h=db7613d10c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 16<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708614816?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 17<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708615142?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 18<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708615324?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 19<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708615469?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 20<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708615797?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 21<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708630785?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 22<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708631101?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 23<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708631367?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 24<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708631547?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione: All You Need is Love<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/746813237?h=2b4e2b5c2b&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:144 <a href=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    var giorno4="";
    giorno4 += "<div><h1>Giorno 4<\/div><div><\/h1><h2>Video 25<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708603111?h=e4206bf1c5&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 26<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708603495?h=7eb9d9c5d9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 27<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708603764?h=2e3821786d&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 28<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708604014?h=0e0172fc0c&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 29<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708604242?h=91adfddfa4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 30<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708604451?h=91dea606ab&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Meditazione: Evoluzione di se stessi<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/746824000?h=02a79a41d9&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 25<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708631864?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 26<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708632124?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 27<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708632320?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 28<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708632510?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 29<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708632658?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Video 30<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/708632792?badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Omega Healing® è un Training online di grande valore<\/h2><\/div><br><div> <\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/749094171?h=3c535d254b&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Cosa dicono di Omega Healing®<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/752427853?h=c4869fecb4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Un corso emozionante<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/752427853?h=c4869fecb4&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div><div><h2>Diventa la migliore versione di te stesso<\/h2><\/div><br><div><\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/752427821?h=9af91c2eb7&badge=0&autopause=0&player_id=0&app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:144 <a href=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/manuale-modulo1-ita.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div><a href=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/Il-nuovo-equilibrio-emozionale.pdf>Scarica il libro<\/a><div>        <embed src=https:\/\/www.omegahealing.com\/wp-content\/uploads\/2021\/03\/Il-nuovo-equilibrio-emozionale.pdf type=\"application\/pdf\"                width=\"100%\" height=\"600px\" \/><\/div>";
    giorno4 += "userscript.html?name=Cerca-video-e-pdf-vimeo-sui-siti-di-Mylife-2.user.js&id=59a2fa78-5374-4ec1-b77b-5aa8cac3fa55:168 <div><a href=\"https:\/\/www.mylife.it\/mediafile\/18\/download\" class=\"elementor-button-link elementor-button elementor-size-md elementor-animation-grow\" role=\"button\"> <span class=\"elementor-button-content-wrapper\"> <span class=\"elementor-button-text\">Scarica il libro PDF<\/span> <\/span> <\/a><\/div>";

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