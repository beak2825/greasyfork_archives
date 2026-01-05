// ==UserScript==
// @name			6V消耗分数计算器
// @name:en			neu6credit
// @namespace		neu6credit
// @description		计算分数消耗
// @description:en	calculate credit
// @version			1.0.2
// @author			popcorner
// @grant			none
// @include			http://bt.neu6.edu.cn/thread*
// @include			http://bt.neu6.edu.cn/forum.php?mod=viewthread*
// @icon			http://bt.neu6.edu.cn/favicon.ico
// @supportURL		http://bt.neu6.edu.cn/thread-1562754-1-1.html
// @downloadURL https://update.greasyfork.org/scripts/24277/6V%E6%B6%88%E8%80%97%E5%88%86%E6%95%B0%E8%AE%A1%E7%AE%97%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/24277/6V%E6%B6%88%E8%80%97%E5%88%86%E6%95%B0%E8%AE%A1%E7%AE%97%E5%99%A8.meta.js
// ==/UserScript==

if($('postlist').getElementsByClassName('mbw')[0]) {
    menu = document.createElement('div');
    menu.id = 'extcreditmenu_menu';
    menu.style.display = 'none';
    menu.className = 'p_pop';
    menu.innerHTML = '<div class="p_opt"></div>';
    $('append_parent').appendChild(menu);
    ajaxget($('extcreditmenu').href, 'extcreditmenu_menu', 'ajaxwaitid','',function(){});
    var oriarc = $('postlist').getElementsByClassName('pattl')[0].getElementsByTagName('pre')[0].innerHTML;
    var archivesize = parseInt(oriarc.match(/size\.\.: (\d+)/)[1]/1048576);
    var attlpre = $('postlist').getElementsByClassName('pattl')[0].getElementsByTagName('pre')[0];
    var postpra = function(){postpr();};
    attlpre.addEventListener('mouseover',postpra);
}
function postpr(){
    if($('hcredit_4')) {
        var dlo = $('hcredit_4').innerHTML;
        var dlc = parseInt(convertdl(dlo));
        var finalcredit = creditfx(dlc+archivesize)-creditfx(dlc);
        attlpre.setAttribute('tip','\u4e0b\u8f7d\u672c\u8d44\u6e90\u5927\u7ea6\u9700\u8981\u6d88\u8017<b>'+finalcredit+'</b>\u79ef\u5206<br>\u4e0d\u8003\u8651Free\u4e0e0.5\u7684\u60c5\u51b5\u4e0b');
        attlpre.setAttribute('onclick','showTip(this)');
        attlpre.removeEventListener('mouseover',postpra);
    }
}
function convertdl(dlo){
    var parse = dlo.match(/([\d\.]+) ([A-Z]+)/);
    if(parse[2]=='TB') {
        return parse[1]*1048576;
    } else if(parse[2]=='GB') {
        return parse[1]*1024;
    } else {
        return parse[1];
    }
}
function creditfx(cre){
    return parseInt(cre/(34-(Math.log(Math.abs(cre)+1)/Math.log(2) > 33 ? 33 : Math.log(Math.abs(cre)+1)/Math.log(2))));
}