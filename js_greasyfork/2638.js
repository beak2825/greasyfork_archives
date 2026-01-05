// ==UserScript==
// @name       RYM: Remove Upcoming Releases
// @version    0.1
// @description  remove releases from your upcoming section on rym
// @match      https://rateyourmusic.com/~*
// @copyright  2014+, Ghostface
// @namespace https://greasyfork.org/users/2625
// @downloadURL https://update.greasyfork.org/scripts/2638/RYM%3A%20Remove%20Upcoming%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/2638/RYM%3A%20Remove%20Upcoming%20Releases.meta.js
// ==/UserScript==

var ignoreComp = false;
var ignoreVideo = false;

rows = $('th:contains("Upcoming")').parent().parent().find('td:eq(0)').find('div:eq(0)');

rowsHtml = rows.html().split('<br>')
rowsHtml = rowsHtml.join('<a class="smallgray" href="javscript:void(0);">x</a></div><div class="up-row">')

rowsHtml = '<div class="up-row">' + rowsHtml + '</div>'
rows.html(rowsHtml)

var rlsIgnore = GM_getValue('rlsIgnore');
if (rlsIgnore == undefined){rlsIgnore = '';}

function addRls(rls){
    rlsIgnore += rls+',';
    GM_setValue('rlsIgnore',rlsIgnore);
    $("a[title='"+rls+"']").parent().hide();
    
}

//rlsIgnoreCur = '';

$.each(rows.find('.credited_list'), function(){
    inhtml = $(this).html();
    while (inhtml.indexOf("up-row") > 0){
        inhtml = inhtml.replace('<div class="up-row">','<br>');
        inhtml = inhtml.replace('</div>','');
        inhtml = inhtml.replace('<a class="smallgray" href="javscript:void(0);">x</a>','');
    }
    $(this).html(inhtml);
});

$.each(rows.find('hr'), function(){
    x = $(this).parent().parent();
    $(this).parent().insertBefore(x);
});

$.each($('.up-row'), function(){
    if ((ignoreComp && $(this).html().indexOf('/comp/') > 0) || (ignoreVideo && $(this).html().indexOf('/video/') > 0)){
        $(this).hide()
    }else{
        albumCode = $(this).find('a:eq(1)').attr('title');
        if (rlsIgnore.indexOf(albumCode) >= 0){
            $(this).hide();
            //rlsIgnoreCur += albumCode+',';
        } else {
            $(this).find('a:last').bind('click', (function(n) {return function (e) {addRls(n)}})(albumCode));
        }
    }
})

//rlsIgnore = rlsIgnoreCur;
//GM_setValue('rlsIgnore',rlsIgnore);


