// ==UserScript==
// @name        cutscenes
// @namespace   CutScenes.net
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @include     http://www.cutscenes.net/videos/*
// @include     http://www.tubepornclassic.com/*
// @version     1.2
// @grant       GM_addStyle
// run-at       document-start
// @description Unblock private videos on cutscenes.net
// @downloadURL https://update.greasyfork.org/scripts/18569/cutscenes.user.js
// @updateURL https://update.greasyfork.org/scripts/18569/cutscenes.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
console.log("Début");
(function(){
    var video_html='<div class="player-wrap" style="width: 100%; height: 0; padding-bottom: 58.843537414966%"> <div id="kt_player" style="visibility: visible; width: 100%; height: 100%; overflow: hidden; position: relative; background: rgb(0, 0, 0) none repeat scroll 0% 0%;"> <object style="visibility: visible;" data="http://www.cutscenes.net/player/kt_player_3.8.1.swfx" name="kt_player_internal" id="kt_player_internal" type="application/x-shockwave-flash" height="100%" width="100%"> <param value="true" name="allowfullscreen"> <param value="always" name="allowscriptaccess"> <param value="transparent\" name=\"wmode\"> <param value=\"000000\" name=\"bgcolor\"> <param value=\"video_id=__VIDEOID__&amp;license_code=91cb862e5babb8726769a0468669001c&amp;video_url=http%3A%2F%2Fwww.cutscenes.net%2Fget_file%2F1%2F01b8fe93907c1b1145be068dde371dfc%2F__VIDEOPATH__%2F__VIDEOID__%2F__VIDEOID__.mp4%2F&amp;postfix=.mp4&amp;preview_url=__PREVIEWURL__&amp;skin=1&amp;bt=3&amp;hide_controlbar=0&amp;adreplay=true&amp;embed=1&amp;internal_id=kt_player_internal\" name=\"flashvars\"> </object> </div> </div> <script type=\"text/javascript\"> var exoOpts = { cat: \'2\', login: \'alexfad\', idzone_300x250: \'609016\', idzone_468x60: \'609016\', idsite: \'217856\', preroll: {}, pause: {}, postroll: {}, show_thumb: \'1\' }; </script> <script type=\"text/javascript\" src=\"https://ads.exoclick.com/invideo.js\"></script> <script type=\"text/javascript\" src=\"http://www.cutscenes.net/player/kt_player.js?v=3.8.1\"></script> <script type=\"text/javascript\"> /* <![CDATA[ */ function getEmbed(width, height) { if (width && height) { return \'<iframe width=\"\' + width + \'\" height=\"\' + height + \'\" src=\"http://www.cutscenes.net/embed/__VIDEOID__\" frameborder=\"0\" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>\'; } return \'<iframe width=\"854\" height=\"503\" src=\"http://www.cutscenes.net/embed/__VIDEOID__\" frameborder=\"0\" allowfullscreen webkitallowfullscreen mozallowfullscreen oallowfullscreen msallowfullscreen></iframe>\'; } var flashvars = { video_id: \'__VIDEOID__\', license_code: \'91cb862e5babb8726769a0468669001c\', video_url: \'http://www.cutscenes.net/get_file/1/01b8fe93907c1b1145be068dde371dfc/__VIDEOPATH__/__VIDEOID__/__VIDEOID__.mp4/\', postfix: \'.mp4\', preview_url: \'__PREVIEW__\', skin: \'1\', bt: \'3\', hide_controlbar: \'0\', adreplay: \'true\', embed: \'1\' }; var params = {allowfullscreen: \'true\', allowscriptaccess: \'always\'}; kt_player(\'kt_player\', \'http://www.cutscenes.net/player/kt_player_3.8.1.swfx\', \'100%\', \'100%\', flashvars, params); /* ]]> */ </script></div>';
    $(".message").hide();
    // Cache les pubs
    // adv = [".adv", ".bottom-adv",".topad"]
    // $('.adv').hide();
    // $('.bottom-adv').hide();
    // $('.topad').hide();
    // $('.sponsor').hide();
    $('.desk').hide();
    GM_addStyle(".block-video { width: 80% !important; margin: auto;}");
    GM_addStyle(".headline { width: 80%; margin: auto; }");
    var playerholder = document.getElementsByClassName("player-holder");
    console.log("player-holder");
    var noplayer= document.getElementsByClassName("no-player");
    preview = $(".no-player img").attr('src');
    video_html = video_html.replace(/__PREVIEW__/g, preview);
    video_html = video_html.replace(/__PREVIEWURL__/g, encodeURIComponent(preview));
    console.log(encodeURIComponent(preview));
    elements = preview.split("/");
    var nb=elements.length;
    var video_id = elements[nb-2];
    var video_path = elements[nb-3]
    console.log("video_id:", video_id);
    console.log("video_path:", video_path);
    video_html = video_html.replace(/__VIDEOID__/g, video_id);
    video_html = video_html.replace(/__VIDEOPATH__/g, video_path);
    if (noplayer) {
        playerholder[0].innerHTML = video_html;
    }
    else {
        // alert("no-player non trouvé");
        console.log("classe no-player non trouvée");
    }
})();
