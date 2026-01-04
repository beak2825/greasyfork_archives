// ==UserScript==
// @name            dl-protect Direct Link
// @name:fr         dl-protect Direct Link
// @name:en         dl-protect  Direct Link
// @namespace       https://www.protect-lien.com
// @namespace       https://www.liens-telechargement.com
// @version         0.4
// @description     Show direct link on protect-lien.com!
// @description:fr  Affiche directement le lien sur dl-protect
// @description:en  Show direct link on protect-lien.com!
// @author          Thibault
// @icon            https://zone-telechargement.ws/templates/zone/images/favicon.ico
// @include         /http(|s)://(|www\.)protect\-lien\.com/.*/
// @include         /http(|s)://(|www\.)liens\-telechargement\.com/.*/
// @include /http(|s)://(|ww(|w|1|2|3|4|5|6|7|8|9)\.)dl\-protect(||1|2|3|4|5|6|7|8|9).(|ws|com)/.*/
// @include /http(|s)://(|ww(|w|1|2|3|4|5|6|7|8|9)\.)protect\-lien(||1|2|3|4|5|6|7|8|9).(|ws|com)/.*/
// @include /http(|s)://(|ww(|w|1|2|3|4|5|6|7|8|9)\.)liens\-telechargement(||1|2|3|4|5|6|7|8|9).(|ws|com)/.*/
// @require         http://code.jquery.com/jquery-latest.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/33217/dl-protect%20Direct%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/33217/dl-protect%20Direct%20Link.meta.js
// ==/UserScript==


(function() {
    $(document).ready(function() {
        'use strict';
        //checkh237();

        if($("input.continuer").length > 0)
        {
            $(".continuer").click();
        }
        else
        {
            if ($(".magic input")[1])
            {
                $(".bgSlider .Slider").attr("class","Slider ui-draggable ui-draggable-disabled ui-state-disabled");
                $.post( "https://www.dl-protect1.com/php/Qaptcha.jquery.php", { action : "qaptcha", qaptcha_key: $(".QapTcha input").attr("name") } );
                $.post( "https://www.protect-lien.com/php/Qaptcha.jquery.php", { action : "qaptcha", qaptcha_key: $(".QapTcha input").attr("name") } );
                $.post( "https://www.liens-telechargement.com/php/Qaptcha.jquery.php", { action : "qaptcha", qaptcha_key: $(".QapTcha input").attr("name") } );
                //}
                $(".QapTcha input").val("");
                // {
                $(".magic input")[1].click();
                $("#h237").hide();
            }
        }
        if ($(".lienet a").attr("href") !== undefined)
        {
            $("body").html('<div style="width:100%;text-align: center;"><a id="reflink" href='+$(".lienet a").attr("href")+'>'+$(".lienet a").attr("href")+'</a></div>');
            //alert($(".lienet a").attr("href"));
        }
        else if($(".continuer").length > 0)
        {
            $(".continuer").click();
        }
    });
})();

function checkh237 (){
    if($('#h237').is(':visible'))
    { //if the container is visible on the page
        $("#h237").html('');
        $("#h237").css({'display':'none','background-color':'transparent'});
    } else {
        setTimeout(checkh237, 100);
    }
}