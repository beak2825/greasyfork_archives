// ==UserScript==
// @name         Switch user
// @version      1.2.1
// @description  Active le switch user
// @author       LucCB
// @include      https://*.scorimmo.com/*/modifier-equipe/*
// @include      https://*.scorimmo.com/admin/operateurs/*
// @require      http://code.jquery.com/jquery-latest.js
// @namespace    https://greasyfork.org/fr/users/10913
// @downloadURL https://update.greasyfork.org/scripts/19321/Switch%20user.user.js
// @updateURL https://update.greasyfork.org/scripts/19321/Switch%20user.meta.js
// ==/UserScript==

if($(".infos-sellers")[0]){

    $( ".infos-sellers" ).each(function() {
        var href = 'href="/?_switch_user='+ $('.email',this).html();
        $(".email",this).parent().append('<a '+ href +'"class="icon-loop" style="color:#000; margin-left:5px"></a>');
    });

}
if($(".actions")[0]){


    $( "tr" ).each(function() {
        var sonata = 'href="/admin/scorimmo/crm/user-user/'+ $('td:nth-child(2)',this).html() + '/edit'
        var href = 'href="/?_switch_user='+ $('td:nth-child(3)',this).html();
        $("td.actions",this).append('<a '+ href +'"class="icon-loop" style="color:#black; margin-left:5px"</a>');
        $("td.actions",this).append('<a '+ sonata +'"class="icon-key" style="color:#black; margin-left:5px"</a>');

    });

}
