// ==UserScript==
// @name        AliScript
// @description Personel Stuff
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addStyle
// @version     1.0.28
// @include     *://*eksisozluk*
// @include     *://*imdb.com*
// @include     *://*chatgpt.com*
// @include     *://server.qoophost.*
// @include     *://forum.donanimhaber.com*
// @namespace http://www.aligokmen.com/
// @downloadURL https://update.greasyfork.org/scripts/10780/AliScript.user.js
// @updateURL https://update.greasyfork.org/scripts/10780/AliScript.meta.js
// ==/UserScript==

jQuery(document).ready(function ($) {

    //alert(window.location.host);

    function showButtons(){
        $("#extraButtons").remove();
        $("#menuId-profile").append("<div id='extraButtons'>"
                                    +"<li class='nav-profile'><a target='_blank' href='/cp/server/information/'><i class='icon-nav-extNavButton-revisium-antivirus-1' style='background-image: url(&quot;/modules/revisium-antivirus/img/47x47w.png&quot;);'></i> Info</a></li>"
                                    +"<li class='nav-profile'><a target='_blank' href='/cp/license/primary/'><i class='icon-nav-extNavButton-revisium-antivirus-1' style='background-image: url(&quot;/modules/revisium-antivirus/img/47x47w.png&quot;);'></i> License</a></li>"
                                    +"</div>");
    }

    if (window.location.host == 'server.qoophost.com:8443') {
        showButtons();
        $(document).click(showButtons)
    }

    if (window.location.host == 'chatgpt.com') {
        setTimeout(function(){

            var params = new URLSearchParams(window.location.search);
            var qValue = params.get('q');

            console.log(qValue);

            if (qValue !== undefined && qValue !== null){
                $("#prompt-textarea").val(qValue);
            }

            $("#prompt-textarea").focus();

        }, 1000);
    }


    /*if (window.location.host == 'forum.donanimhaber.com') {
        if (parseInt($("#notificationCount_topic").text()) > 0 ){
            $('#donttouch2').trigger("click");
            setTimeout(function(){ $('a[data-href="/api2/GlobalApi/ignorenotifications"]').trigger("click"); }, 1000);
            setTimeout(function(){ $('#donttouch2').trigger("click"); }, 1000);
        }
    }*/

    if (window.location.host == 'www.imdb.com') {
        var pattern = /ev\d{7}\/\d{4}(-\d)?|(ch|co|ev|nm|tt)\d{7}/i;
        var result = window.location.href.match(pattern);
        $("h1").append("<a target='_blank' style='color:white; display:inline-block; margin-left:10px; text-decoration:none; font-size:12px;' href='https://eksisozluk.com/"+$("h1").text()+"'>[Ekşi]</a>");

    }

    if (window.location.host.startsWith('eksisozluk')) {
        $('.sub-title-menu').prepend('<a href="https://eksisozluk.com/biri/' + $('#title').data('title') + '">biri</a>');
        $('.sub-title-menu').prepend('<a target=\'_blank\' href="http://google.com.tr/search?q=' + $('#title').data('title') + '">araştır</a>');
        $('.pager').prepend('<a href=\'' + document.URL.split('?') [0] + '\'>1</a>');
        $('.content').css({"max-height": "99999px"});
        //$('#content-body').css({"width": "94%","margin-left":"85px"});
        //$('#index-section').css({"width": "250px"});
        $(".read-more-link-wrapper").hide();
        if ($("#image-zoom").length > 0) {
            $("img#image").trigger("click");
        }
    }
});