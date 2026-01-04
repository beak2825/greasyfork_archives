// ==UserScript==
// @name         osu! rank icons
// @namespace    http://fl0x.xyz
// @version      1.5
// @description  Replace the new rank icons with the old classic ones.
// @author       Flox
// @match        https://osu.ppy.sh/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383613/osu%21%20rank%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/383613/osu%21%20rank%20icons.meta.js
// ==/UserScript==

$(window).on('load', function(){
      $(".score-rank--XH").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/SS+.png")');
      $(".score-rank--SH").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/S+.png")');
      $(".score-rank--X").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/SS.png")');
      $(".score-rank--S").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/S.png")');
      $(".score-rank--A").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/A.png")');
      $(".score-rank--B").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/B.png")');
      $(".score-rank--C").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/C.png")');
      $(".score-rank--D").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/D.png")');
});

if (window.location.href.indexOf("beatmapsets") > -1) {
    var check = setInterval(() => {
        if ($("td:contains('#1')").length > 0) {
            clearInterval(check);
            $(".score-rank--XH").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/SS+.png")');
            $(".score-rank--SH").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/S+.png")');
            $(".score-rank--X").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/SS.png")');
            $(".score-rank--S").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/S.png")');
            $(".score-rank--A").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/A.png")');
            $(".score-rank--B").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/B.png")');
            $(".score-rank--C").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/C.png")');
            $(".score-rank--D").css("background-image", 'url("https://web.archive.org/web/20190109043359im_/https://osu.ppy.sh/images/badges/score-ranks-v2/D.png")');
       }
    }, 100);
}