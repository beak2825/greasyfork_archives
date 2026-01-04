// ==UserScript==
// @name         Pter Internal Uploady
// @namespace    https://pterclub.com/forums.php?action=viewtopic&topicid=3391
// @version      0.1.6
// @description  Auto get movie&TV info from douban&imdb for Pterclub
// @author       BbLaCk
// @match        https://pterclub.com/PTer.php*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @icon         https://pterclub.com/favicon.ico
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/481233/Pter%20Internal%20Uploady.user.js
// @updateURL https://update.greasyfork.org/scripts/481233/Pter%20Internal%20Uploady.meta.js
// ==/UserScript==

function fill_form(response) {
    let data = response.response;
    $('textarea[name="movieinfo"]').val(data['format']);
    var trans_titles='',directors='',casts='';
    if (data['foreign_title'].length == 0){ trans_titles= data['chinese_title']}
    else {
        data.trans_title.forEach(function (trans_title) {
            trans_titles += trans_title + ' '
        });
    }
    data.director.forEach(function (director) {
        directors = /(.+?)\s/.exec(director['name']).pop()
    });
    var actors = data.cast.slice(0,3);
    actors.forEach(function (cast) {
        casts += /(.+?)\s/.exec(cast['name']).pop()+' '
    });
    const subtitle = trans_titles + ' | ' + "导演：" + directors + ' | ' + '主演：' + casts;
    $('#smalldescription').val(subtitle)
}

(function() {
    let small_desc = $('#smalldescription');
    small_desc.parent().parent().before("<tr><td class='rowhead nowrap' valign=top align=right>豆瓣地址</td><td><input style='width: 650px;' id='douban' /></td></tr>");
    $('#douban').after('<a href="javascript:;" id="Auto_Fill" style="color:green">Auto Fill</a>');
    small_desc.after('<a href="javascript:;" id="fill_cs" style="color:green">[国语中字]</a>');
    $('#fill_cs').click(function () {
      const cstext = small_desc.val() + "[国语中字]";
      small_desc.val(cstext);
    });
    $('#Auto_Fill').click(function () {
        GM.xmlHttpRequest({
            method: "GET",                  //We call the Steam API to get info on the game
            url: "https://gen.cattool.eu.org/?url=" + $("#douban").val(),
            responseType: "json",
            onload: fill_form
        });
    })
})();
