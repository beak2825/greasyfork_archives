// ==UserScript==
// @name         Taichi Zidong
// @namespace    Tampermonkey
// @version      5
// @description  Visualizza Taichi Zidong
// @author       Flejta
// @include      https://taichizidong.com/tamper
// @include      https://taichizidong.com/tamper/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483061/Taichi%20Zidong.user.js
// @updateURL https://update.greasyfork.org/scripts/483061/Taichi%20Zidong.meta.js
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
    giorno1 += "<div><b>56mins Daily Routine - Full Body Practice<\/b><\/div>    <br><br><div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/789658396?h=68d2ae022b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno1 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/791804709?h=0a38387c46&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

    var giorno2="";
    giorno2 += "<div><b>Giorno 2<\/b><\/div>    <br><br><div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795803279?h=b9e89a5b5d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795803600?h=ff12894c09&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795803912?h=4437e739e6&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795805718?h=d7786f53b8&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795807806?h=fb589e23dd&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795808643?h=7f51e1b044&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795809454?h=5c89dc8bdc&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno2 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795810002?h=1209cef9de&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

    var giorno3="";
    giorno3 += "<div><b>Giorno 3<\/b><\/div>    <br><br><div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795810222?h=f530630ecd&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795811371?h=1fb9aaeb53&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795826157?h=f28de992e9&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795826384?h=63071c2f87&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795826996?h=525a5347ec&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796525941?h=8460317822&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795827607?h=09973ec611&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795827789?h=a050812dfd&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno3 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795827985?h=7cc798e28c&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

    var giorno4="";
    giorno4 += "<div><b>Giorno 4<\/b><\/div>    <br><br><div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795828093?h=7c8d9a0136&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795828282?h=a70357347d&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795828435?h=cc30f63d74&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795828652?h=b9cce0c9e8&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795830524?h=522f813fbc&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795830740?h=f874255d79&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/795832404?h=1906e403ad&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796575601?h=9578b58fb5&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796575966?h=00c84cd708&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno4 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796576221?h=c40bfca21b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

    var giorno5="";
    giorno5 += "<div><b>Giorno 5<\/b><\/div>    <br><br><div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796576444?h=131e06ff0b&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796576574?h=f11ec8fa88&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796576942?h=6d9398122f&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796579561?h=516ca02c9e&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796579835?h=d9d3666710&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796580019?h=f5ba4bf32f&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796580246?h=f189ddd0c4&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796580550?h=0655663aa8&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796580771?h=d862dfc8e2&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";
    giorno5 += "<div>titolo<\/div><br><div style=\"width: 100%; height: 500px;\"> <iframe        src=\"https:\/\/player.vimeo.com\/video\/796581058?h=4f644d1487&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479\"        frameborder=\"0\" allow=\"autoplay; fullscreen; picture-in-picture\" allowfullscreen style=\"width:100%;height:100%;\"        title=\"titolo\"><\/iframe> <\/div>";

    const body = document.getElementsByTagName('body')[0]; // selezioniamo l'elemento body
    body.innerHTML = codicePagina; // sostituiamo il contenuto del body con il codice della pagina

    const buttons = document.querySelectorAll('button');
    const divGiorni = document.querySelector('#giorni');
    let testiGiorni = {
        giorno1: giorno1,
        giorno2: giorno2,
        giorno3: giorno3,
        giorno4: giorno4,
        giorno5: giorno5,
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
