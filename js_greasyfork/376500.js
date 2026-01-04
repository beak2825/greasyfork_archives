// ==UserScript==
// @name         HWM гильдия наемников блокнот
// @version      1.0.3
// @description  Поле для оставления памяток о стремных наемах
// @author       incognito
// @grant        GM_setValue
// @grant        GM_getValue
// @include      https://www.heroeswm.ru/mercenary_guild.php
// @require      https://code.jquery.com/jquery-3.1.1.slim.min.js
// @namespace https://greasyfork.org/users/237404
// @downloadURL https://update.greasyfork.org/scripts/376500/HWM%20%D0%B3%D0%B8%D0%BB%D1%8C%D0%B4%D0%B8%D1%8F%20%D0%BD%D0%B0%D0%B5%D0%BC%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BD%D0%BE%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/376500/HWM%20%D0%B3%D0%B8%D0%BB%D1%8C%D0%B4%D0%B8%D1%8F%20%D0%BD%D0%B0%D0%B5%D0%BC%D0%BD%D0%B8%D0%BA%D0%BE%D0%B2%20%D0%B1%D0%BB%D0%BE%D0%BA%D0%BD%D0%BE%D1%82.meta.js
// ==/UserScript==

(function (undefined) {

    if( GM_getValue("mercenary_guild_notepad") ){
        var blknt = GM_getValue("mercenary_guild_notepad");
    }else{
        var blknt = 'внесите записи...';
    }
    var lines = blknt.split("\n").length;

    configHtml = '<div style="width:50vw;margin:0 auto;">';
    configHtml += '<textarea id="blknt" style="width:100%;font-size:11px;" rows="'+lines+'">'+blknt+'</textarea>';
    $('body').append(configHtml);

    $(document).on('change click keyup', '#blknt ', function() {
        GM_setValue('mercenary_guild_notepad', $('#blknt').val() );
        $('#blknt').attr('rows', $('#blknt').val().split("\n").length );
    });

}());
