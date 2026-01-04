// ==UserScript==
// @name           hwm_trans_nick
// @namespace      Demin
// @description    Передача золота и ресурсов игроку со страницы перса игрока-получателя. События игрока. Перекач/недокач
// @version        3.6
// @include      /https:\/\/(www.heroeswm.ru|www.lordswm.com|my.lordswm.com)\/(pl_info.php|transfer.php|el_transfer.php).*/
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445883/hwm_trans_nick.user.js
// @updateURL https://update.greasyfork.org/scripts/445883/hwm_trans_nick.meta.js
// ==/UserScript==

// (c) 2011-2013, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )
// 2022 Zeleax
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
    this.GM_getValue=function (key,def) {
        return localStorage[key] || def;
    };
    this.GM_setValue=function (key,value) {
        return localStorage[key]=value;
    };
    this.GM_deleteValue=function (key) {
        return delete localStorage[key];
    };
}

var script_num = 95550;
var script_name = "HWM mod - Set link & nick for transfer (by Demin)";
var url_cur = location.href;
var url = 'https://'+location.hostname+'/';

var string, string2, string3, string4, res, el;

if ( url_cur.match('pl_info.php') )
{

    if ( url.match('www.lordswm') ) {
        string = '->Resources';
        string2 = '->Elements';
        string3 = 'Events';
        string4 = 'Overpwr?';
    } else {
        string = '->Ресурсы';
        string2 = '->Элементы';
        string3 = 'События';
        string4 = 'Перекач?';
    }

    if(res=/pl_info.php\?id=(\d+)/.exec(location.href)){
        var plID = res[1];
        var t = getE( "//a[contains(@href, 'sms-create.php')]" );

        if((t) && (res= /mailto_id=(\d+)/.exec(t.getAttribute("href"))) && (res[1])) {
            el=getE('//img[contains(@src,"male.")]');
            el= el.parentNode.parentNode.parentNode.parentNode.parentNode.previousSibling;
            el=getE('./b[contains(text(),"[")]', el);
            var txt=el?.innerText;
            var plName=/(\S+.+\S)\s+\[\d+\]/.exec(txt)[1];

            var span = document.createElement('span');
            span.innerHTML = '<br>&nbsp;&nbsp;<a href=transfer.php?nick=' + plName + ' title="Передать ресурсы" style="text-decoration: none;">' + string + '</a>/'+
                '<a href=el_transfer.php?nick=' + plName + ' title="Передать элементы" style="text-decoration: none;">' + string2 + '</a>/'+
                '<a href="https://daily.heroeswm.ru/event.php?lvl=0&f=-1&id='+plID+'&clan=0" title="События игрока" target="_blank" style="text-decoration: none;">'+string3+'</a>/'+
                '<a href="https://daily.heroeswm.ru/progress/'+plID+'" title="Перекач/недокач" target="_blank" style="text-decoration: none;">'+string4+'</a>';

            t.parentNode.insertBefore( span, t.nextSibling );
        }
    }
}

if ( url_cur.match('transfer.php') )
{
    var item_name = /nick=([^&]+)/.exec( url_cur );
    if ( item_name ) {
        plName=item_name[1].replace(/\s/g, " ");

        var gold_trans = /gold=(\d+)/.exec( url_cur );
        var desc_trans = /desc=([^&]+)/.exec( url_cur );
        var els = document.getElementsByTagName('input');
        for( var i = 0; i < els.length; i++ ) {
            el = els[i];
            if( el.name == 'nick' && el.type == 'text' ) {
                el.value = urlDecode( plName );
            }
            else if( el.name == 'gold' && el.type == 'text' ) {
                if ( gold_trans ) el.value = gold_trans[1];
            }
            else if( el.name == 'desc' && el.type == 'text' ) {
                if ( desc_trans ) el.value = urlDecode( desc_trans[1] );
            }
        }

        var all_a = document.querySelector("a[href='el_transfer.php']");
        if ( all_a ) {
            all_a.href += '?nick=' + plName;
        }
    }
}


function urlDecode(string) {
    var codes = '%E0%E1%E2%E3%E4%E5%B8%E6%E7%E8%E9%EA%EB%EC%ED%EE%EF%F0%F1%F2%F3%F4%F5%F6%F7%F8%F9%FA%FB%FC%FD%FE%FF'+
        '%C0%C1%C2%C3%C4%C5%A8%C6%C7%C8%C9%CA%CB%CC%CD%CE%CF%D0%D1%D2%D3%D4%D5%D6%D7%D8%D9%DA%DB%DC%DD%DE%DF%20%A0';
    codes = codes.split('%');
    var chars = 'абвгдеёжзийклмнопрстуфхцчшщъыьэюя'+
        'АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ  ';
    for (var i=0; i<codes.length; i++) string = string.split('%'+codes[i+1]).join(chars[i]);
    return string;
}

function $(id) { return document.querySelector("#"+id); }

function addEvent(elem, evType, fn) {
    if (elem.addEventListener) {
        elem.addEventListener(evType, fn, false);
    }
    else if (elem.attachEvent) {
        elem.attachEvent("on" + evType, fn);
    }
    else {
        elem["on" + evType] = fn;
    }
}

function getE(xpath,el,docObj){return (docObj?docObj:document).evaluate(xpath,(el?el:(docObj?docObj.body:document.body)),null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;}
