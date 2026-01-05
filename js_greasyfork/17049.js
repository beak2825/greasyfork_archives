// ==UserScript==
// @name           Megafon Traffic Extension without traffic
// @name:ru        Мегафон траффик без траффика
// @namespace      Megafon Traffic
// @author         Madzal
// @version        7
// @homepage       http://m.megafonpro.ru/ml/upload/zoom/825/342._000_.gif
// @match          http://m.megafonpro.ru/ml/upload/zoom/825/342._000_.gif
// @supportURL     http://vk.com/write82066804
// @description    Extension for use megafon traffic on your browser
// @description:ru Расширение для безлимитного использования мегафон-трафика
// @icon           data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpFMTkxRTIzRTE1RTJFMTExOEYyMzg4MzBCNURCNTI0RSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozRTk5REZGNDlDQTkxMUUyQUYyMzhGQUUyMTZCMzNDOCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDozRTk5REZGMzlDQTkxMUUyQUYyMzhGQUUyMTZCMzNDOCIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjIzQUUwMjQxOUY5Q0UyMTE4Q0Q4OUFCOEVGNThEMTBEIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkUxOTFFMjNFMTVFMkUxMTE4RjIzODgzMEI1REI1MjRFIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+httQ1gAAAnFJREFUeNp8k81LFGEcx7/zzOxrO0Yl6xIoKqViqZ085EHLLkGd6mZQBBad7e0/CG/dSiiEThFdoshIQqGiS0Fd1jTTtKjc1dZmZ99mZmf6PrOz4GV74MOP5/c2v5dnFLw/hh1nmNwl7eQJOU9UMkXOkm/kCpmvB6gYb6Vw69yf6BwZHGs/qsUd53C68PsHdYNjyb4b410ntN7YvuZ3ua8McB/UYwQ8B+Qk+USGhB7GKjbghiH1XWTAjQqsUSf0kNQNBb4yBhpcW1YyffnAaIuX0LCCrJ98Sy1T2kna9D+iCKe6CVdRcKn/eFQxnf6p5VfTtKWYwJIJIjm1BIMZt5wyQizMFKzMtVK0JbaFjXy1ABseCooFXWjSFpeBGjw/wbVH6Zd30NSsIURjJIY9Udo9q582sWSZyBkmUGFVdhUwNlkmrstABa876gPdTwZIGzlIutF56BSzACvpp7wvBXwnH8mvWgVuUcoLZBJNbUmEOKgIqwhzissfOCC3gPa+07BYaYVXm60Z606wznsK5nSZwBjpOaNnIjbSXgH+ZooGsLpY4QfeoOPIKBK7Wa+GXiWOFiuCuYXHso0kZ5CXCYrzlQ0dQm6kVGvIovRszi3/ExaTVeHvPY0Y0mW5zrwbtOC7X8TyzC3KLvR0R6Hw8VnyfZRs2jPgELlH3ivA5y/lYBY3ZaAIHtRzMkDewuCXXYWFyFaqKnULKJn+LGFU4PvUfGdkrIpzO38FrMP4O4xsNoFi/iFCsVYIdRLm9l5kMz20rdFnIvgnUFvjCzQ+Ycj1LcLC1YY+nuc1BLMMnIVJUo18BP53PDwju8jtRi7/BBgAs5E3ozX0BWYAAAAASUVORK5CYII=
// @include        http://m.megafonpro.ru/facebook/*
// @include        http://m.megafonpro.ru/mailru/*
// @include        http://m.megafonpro.ru/vkontakte/*
// @include        http://m.megafonpro.ru/odnoklassniki/*
// @include        http://m.megafonpro.ru/twitter/*
// @exclude        file://*
// @run-at         document-start
// @encoding       utf-8
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_info
// @grant          GM_addStyle
// @grant          GM_log
// @grant          unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/17049/Megafon%20Traffic%20Extension%20without%20traffic.user.js
// @updateURL https://update.greasyfork.org/scripts/17049/Megafon%20Traffic%20Extension%20without%20traffic.meta.js
// ==/UserScript==
unsafeWindow.onbeforeunload = function() {
  if (document.activeElement.href && !document.activeElement.href.match(/m.megafonpro.ru/i)) {
  return 'Страница тарифицируемая\n'+decodeURI(document.activeElement.href)+'\nПерейти по ссылке?';
}
};

window.addEventListener("error", function() {
if (!window.firsterror) {
if (document.getElementById("container")) {
if (location.href == GM_getValue("homepage")) {
    if (confirm("Ссылка на домашнюю страницу устарела\nПолучить новую страницу на "+GM_getValue("homepagename")+" ?")) {
window.msilent = true;
gethomepage();
}
}
else{
    if (document.getElementById("container")) {
var refreshbtn = document.createElement("input");
refreshbtn.type = "button";
refreshbtn.value = "обновить";
refreshbtn.title = "Обновление страницы";
refreshbtn.className = "button_link_shorter";
refreshbtn.style = "display:inline;margin:10px";
refreshbtn.setAttribute("onclick","location.reload()");
document.body.appendChild(refreshbtn);
var backbtn = document.createElement("input");
backbtn.type = "button";
backbtn.value = "назад";
backbtn.title = "Вернуться на предыдущюю сраницу";
backbtn.className = "button_link_shorter";
backbtn.style = "display:inline;margin:10px";
backbtn.setAttribute("onclick","history.go(-1)");
document.body.appendChild(backbtn);
if (location.href.match(/proxy/i)) {
var staticbtn = document.createElement("input");
staticbtn.type = "button";
staticbtn.value = "попробовать статически";
staticbtn.title = "Открыть ссылку статически";
staticbtn.className = "button_link_shorter";
staticbtn.style = "display:inline;margin:10px";
staticbtn.setAttribute("onclick","location=location.href.replace('proxy','static')");
}else{
staticbtn.setAttribute("onclick","location=location.href.replace('static','proxy')");
}
document.body.appendChild(staticbtn);
                        }
    window.firsterror = true;
}
}}}, false);

if (location.href == GM_info.script.homepage) {
    if (!!GM_getValue('homepage')) {
        window.location = GM_getValue('homepage');
        throw 'redirected to home page';
    } else {
        if (confirm("Домашняя страница отсутсвтует,получить ссылку на домашнюю страницу ?")) {
            gethomepage();
        }
    }
}
GM_registerMenuCommand('Настройки (settings)', showsettings, 'j');

function showsettings() {
    var menudiv = document.createElement("div");
    menudiv.style = "z-index: 10000;text-align:left;position:fixed;display:inline-block;top:10px;left:10px;background:#fff;border:2px solid #000;padding:10px";
    menudiv.id = 'opts';
    menudiv.innerHTML = "Подгружать изображения";
    var checkbox1 = document.createElement("input");
    checkbox1.type = "checkbox";
    checkbox1.style = "float:right";
    checkbox1.id = "opt1";
    if (GM_getValue("opt1", true)) {
        checkbox1.setAttribute("checked", "");
    }
    checkbox1.setAttribute('onclick', 'if(document.getElementById("opt1").checked==true){document.getElementById("mydiv1").style.display="block"}else{document.getElementById("mydiv1").style.display="none"}');
    var mydiv1 = document.createElement("div");
    mydiv1.id = "mydiv1";
    if (GM_getValue("opt1", true)) {
        mydiv1.style.display = "block";
    } else {
        mydiv1.style.display = "none";
    }
    var p2 = document.createElement("p");
    p2.style.margin = "5px";
    var newtextother1 = document.createTextNode("Способ подгрузки");
    var select1 = document.createElement("select");
    select1.type = "checkbox";
    select1.style = "float: right;width: 67px";
    select1.id = "opt9";
    var option1 = document.createElement("option");
    option1.value = 'proxy';
    option1.text = 'обычно';
    if (GM_getValue("opt9") == "proxy") {
        option1.setAttribute("selected", "");
    }
    var option2 = document.createElement("option");
    option2.value = "static";
    option2.text = "статически";
    if (GM_getValue("opt9") == "static") {
        option2.setAttribute("selected", "");
    }
    var newtext0 = document.createTextNode("Подгружать дизайн");
    var checkbox0 = document.createElement("input");
    checkbox0.type = "checkbox";
    checkbox0.style.float = "right";
    checkbox0.id = "opt0";
    if (GM_getValue("opt0", true)) {
        checkbox0.setAttribute("checked", "");
    }
    checkbox0.setAttribute('onclick', 'if(document.getElementById("opt0").checked==true){document.getElementById("mydiv3").style.display="block"}else{document.getElementById("mydiv3").style.display="none"}');
    var mydiv3 = document.createElement("div");
    mydiv3.id = "mydiv3";
    if (GM_getValue("opt0", true)) {
        mydiv3.style.display = "block";
    } else {
        mydiv3.style.display = "none";
    }
    var p4 = document.createElement("p");
    p4.style.margin = "5px";
    var newtextother3 = document.createTextNode("Способ подгрузки");
    var select3 = document.createElement("select");
    select3.type = "checkbox";
    select3.style = "float: right;width: 67px";
    select3.id = "opt11";
    var option6 = document.createElement("option");
    option6.value = 'proxy';
    option6.text = 'обычно';
    if (GM_getValue("opt11") == "proxy") {
        option6.setAttribute("selected", "");
    }
    var option7 = document.createElement("option");
    option7.value = "static";
    option7.text = "статически";
    if (GM_getValue("opt11") == "static") {
        option7.setAttribute("selected", "");
    }
    var newtext = document.createTextNode("Показать редирект-кнопку");
    var checkbox2 = document.createElement("input");
    checkbox2.type = "checkbox";
    checkbox2.style.float = "right";
    checkbox2.id = "opt2";
    if (GM_getValue("opt2", true)) {
        checkbox2.setAttribute("checked", "");
    }
    var newtext2 = document.createTextNode("Показать прямой адрес");
    var checkbox3 = document.createElement("input");
    checkbox3.type = "checkbox";
    checkbox3.style.float = "right";
    checkbox3.id = "opt3";
    if (GM_getValue("opt3", true)) {
        checkbox3.setAttribute("checked", "");
    }
    var newtext3 = document.createTextNode("Скрыть элементы megafon");
    var checkbox4 = document.createElement("input");
    checkbox4.type = "checkbox";
    checkbox4.style.float = "right";
    checkbox4.id = "opt4";
    if (GM_getValue("opt4", true)) {
        checkbox4.setAttribute("checked", "");
    }
    var newtext4 = document.createTextNode("Растягивать страницу");
    var checkbox5 = document.createElement("input");
    checkbox5.type = "checkbox";
    checkbox5.style.float = "right";
    checkbox5.id = "opt5";
    if (GM_getValue("opt5", true)) {
        checkbox5.setAttribute("checked", "");
    }
    checkbox5.setAttribute('onclick', 'if(document.getElementById("opt5").checked==true){document.getElementById("mydiv2").style.display="block"}else{document.getElementById("mydiv2").style.display="none"}');
    var mydiv2 = document.createElement("div");
    mydiv2.id = "mydiv2";
    if (GM_getValue("opt5", true)) {
        mydiv2.style.display = "block";
    } else {
        mydiv2.style.display = "none";
    }
    var p3 = document.createElement("p");
    p3.style.margin = "5px";
    var newtextother2 = document.createTextNode("По какому краю");
    var select2 = document.createElement("select");
    select2.type = "checkbox";
    select2.style = "float: right;width: 67px";
    select2.id = "opt10";
    var option3 = document.createElement("option");
    option3.value = 'center';
    option3.text = 'центр';
    if (GM_getValue("opt10") == "center") {
        option3.setAttribute("selected", "");
    }
    var option4 = document.createElement("option");
    option4.value = "right";
    option4.text = "правый";
    if (GM_getValue("opt10") == "right") {
        option4.setAttribute("selected", "");
    }
    var option5 = document.createElement("option");
    option5.value = "left";
    option5.text = "левый";
    if (GM_getValue("opt10") == "left") {
        option5.setAttribute("selected", "");
    }
    var newtext5 = document.createTextNode("Подгружать всё остальное");
    var checkbox6 = document.createElement("input");
    checkbox6.type = "checkbox";
    checkbox6.style.float = "right";
    checkbox6.id = "opt6";
    if (GM_getValue("opt6", true)) {
        checkbox6.setAttribute("checked", "");
    }
    checkbox6.setAttribute('onclick', 'if(document.getElementById("opt6").checked==true){document.getElementById("mydiv4").style.display="block"}else{document.getElementById("mydiv4").style.display="none"}');
    var mydiv4 = document.createElement("div");
    mydiv4.id = "mydiv4";
    if (GM_getValue("opt6", true)) {
        mydiv4.style.display = "block";
    } else {
        mydiv4.style.display = "none";
    }
    var p5 = document.createElement("p");
    p5.style.margin = "5px";
    var newtextother4 = document.createTextNode("Способ подгрузки");
    var select4 = document.createElement("select");
    select4.type = "checkbox";
    select4.style = "float: right;width: 67px";
    select4.id = "opt12";
    var option8 = document.createElement("option");
    option8.value = 'proxy';
    option8.text = 'обычно';
    if (GM_getValue("opt12") == "proxy") {
        option8.setAttribute("selected", "");
    }
    var option9 = document.createElement("option");
    option9.value = "static";
    option9.text = "статически";
    if (GM_getValue("opt12") == "static") {
        option9.setAttribute("selected", "");
    }
    var newtext6 = document.createTextNode("Редирект с leave на proxy");
    var checkbox7 = document.createElement("input");
    checkbox7.type = "checkbox";
    checkbox7.style.float = "right";
    checkbox7.id = "opt7";
    if (GM_getValue("opt7", true)) {
        checkbox7.setAttribute("checked", "");
    }
    var newtext7 = document.createTextNode("Запускать тег noscript");
    var checkbox8 = document.createElement("input");
    checkbox8.type = "checkbox";
    checkbox8.style.float = "right";
    checkbox8.id = "opt8";
    if (GM_getValue("opt8", true)) {
        checkbox8.setAttribute("checked", "");
    }
    var br = document.createElement("p");
    br.style = "margin: 10px";
    var button1 = document.createElement("input");
    button1.type = "submit";
    button1.id = "gm_save";
    button1.name = "gm_save";
    button1.value = "Сохранить";
    button1.style = "float: left";
    var button2 = document.createElement("input");
    button2.type = "submit";
    button2.id = "gm_reset";
    button2.name = "gm_reset";
    button2.value = "Сбросить";
    button2.style = "float: right";
    menudiv.appendChild(checkbox1);
    menudiv.appendChild(mydiv1);
    mydiv1.appendChild(p2);
    mydiv1.appendChild(newtextother1);
    mydiv1.appendChild(select1);
    select1.appendChild(option1);
    select1.appendChild(option2);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext0);
    menudiv.appendChild(checkbox0);
    menudiv.appendChild(mydiv3);
    mydiv3.appendChild(p4);
    mydiv3.appendChild(newtextother3);
    mydiv3.appendChild(select3);
    select3.appendChild(option6);
    select3.appendChild(option7);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext);
    menudiv.appendChild(checkbox2);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext2);
    menudiv.appendChild(checkbox3);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext3);
    menudiv.appendChild(checkbox4);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext4);
    menudiv.appendChild(checkbox5);
    menudiv.appendChild(mydiv2);
    mydiv2.appendChild(p3);
    mydiv2.appendChild(newtextother2);
    mydiv2.appendChild(select2);
    select2.appendChild(option3);
    select2.appendChild(option4);
    select2.appendChild(option5);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext5);
    menudiv.appendChild(checkbox6);
    menudiv.appendChild(mydiv4);
    mydiv4.appendChild(p5);
    mydiv4.appendChild(newtextother4);
    mydiv4.appendChild(select4);
    select4.appendChild(option8);
    select4.appendChild(option9);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext6);
    menudiv.appendChild(checkbox7);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(newtext7);
    menudiv.appendChild(checkbox8);
    menudiv.appendChild(document.createElement("hr"));
    menudiv.appendChild(br);
    menudiv.appendChild(button1);
    menudiv.appendChild(button2);
    document.body.insertBefore(menudiv, document.body.firstChild);
}
document.addEventListener('click', function(event) {
    if (event.target.getAttribute('name') == 'gm_save') {
        GM_setValue('opt0', document.getElementById('opt0').checked);
        GM_setValue('opt1', document.getElementById('opt1').checked);
        GM_setValue('opt2', document.getElementById('opt2').checked);
        GM_setValue('opt3', document.getElementById('opt3').checked);
        GM_setValue('opt4', document.getElementById('opt4').checked);
        GM_setValue('opt5', document.getElementById('opt5').checked);
        GM_setValue('opt6', document.getElementById('opt6').checked);
        GM_setValue('opt7', document.getElementById('opt7').checked);
        GM_setValue('opt8', document.getElementById('opt8').checked);
        GM_setValue('opt9', document.getElementById('opt9').value);
        GM_setValue('opt10', document.getElementById('opt10').value);
        GM_setValue('opt11', document.getElementById('opt11').value);
        GM_setValue('opt12', document.getElementById('opt12').value);
        document.getElementById('opts').parentNode.removeChild(document.getElementById('opts'));
    }
    if (event.target.getAttribute('name') == 'gm_reset') {
        if (confirm("Все настройки расширения будут сброшены,включая домашнюю страницу,продолжить ?")) {
            GM_deleteValue("opt0");
            GM_deleteValue("opt1");
            GM_deleteValue("opt2");
            GM_deleteValue("opt3");
            GM_deleteValue("opt4");
            GM_deleteValue("opt5");
            GM_deleteValue("opt6");
            GM_deleteValue("opt7");
            GM_deleteValue("opt8");
            GM_deleteValue("opt9");
            GM_deleteValue("opt10");
            GM_deleteValue("opt11");
            GM_deleteValue("opt12");
            GM_deleteValue("homepage");
            GM_deleteValue("homepagename");
            GM_deleteValue("siteswitch");
            document.getElementById('opts').parentNode.removeChild(document.getElementById('opts'));
            showsettings();
        }
    }
}, true);
GM_registerMenuCommand('Получить домашнюю страницу', gethomepage, 'k');

function gethomepage() {
    var no = true;
    if (!window.msilent) {
    var web = prompt('Введите сайт на который хотите получить ссылку',GM_getValue("homepagename"));
    }
    else{
    var web = GM_getValue("homepagename");
    }
    if (!!!web) eval("alert('Ошибка ввода адресса'); no = false;");
    if (no) {
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://web.archive.org/web/20140306220001/http://m.megafonpro.ru/home?from_404=1",
        onload: function(m) {
            if (m.finalUrl != 'http://web.archive.org/web/20140306220001/http://m.megafonpro.ru/home?from_404=1') {
                alert('У вас закончился трафик,получить ссылку невозможно');
                return false;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: m.responseText.match(/(\http:\/\/m\.megafonpro\.ru\/mailru\/proxy\/[0-9a-f]{32})/g)[0],
                onload: function(e) {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: 'http://m.megafonpro.ru/' + e.responseText.match(/(\mailru\/proxy\/[0-9a-f]{32})/g)[2],
                        onload: function(f) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: 'http://m.megafonpro.ru/' + f.responseText.match(/(\mailru\/leave\/[0-9a-f]{32})/g)[0].replace("leave", "proxy") + "?q=" + web,
                                onload: function(s) {
                                    GM_registerMenuCommand('Перейти на домашнюю страницу', gotohomepage, 'n');
                                    GM_setValue('homepage', 'http://m.megafonpro.ru/' + s.responseText.match(/(\mailru\/leave\/[0-9a-f]{32})/g)[5].replace("leave", "proxy"));
                                    GM_setValue('homepagename', web);
                                    if (!window.msilent) {
                                    if (confirm('Успешно получили ссылку на ' + web + "\n" + "m.megafonpro.ru/" + s.responseText.match(/(\mailru\/leave\/[0-9a-f]{32})/g)[5].replace("leave", "proxy") + "\nЗатрачено от трафика : " + (unescape(encodeURI(m.responseText)).length / 1024).toFixed(2) + " kb\nПерейти по ссылке ?")) {
                                        if (!!GM_getValue('homepage')) {
                                            location = GM_getValue('homepage');
                                        }
                                    }
                                }
                                    else {
                                            if (!!GM_getValue('homepage')) {
                                            location = GM_getValue('homepage');
                                            }  
                            }}});
                        }
                    });
                }
            });
        }
    });
}
}

if (GM_getValue('homepage') !== undefined) {
    GM_registerMenuCommand('Перейти на домашнюю страницу', gotohomepage, 'n');
}

function gotohomepage() {
    location = GM_getValue('homepage', 'http://m.megafonpro.ru/facebook/proxy/103a42ebb015bc54b1536d92a2589426');
}
if (GM_getValue('opt7', true)) {
    if (location.href.match(/leave/i)) location = location.href.replace("leave", "proxy");
}
GM_addStyle("input.button_link_shorter{display: inline-block;cursor: pointer !important;background:#40c781;color:#FFF;font-weight:700;font-size: 10px;padding:.3em 1em;text-decoration:none}input.button_link_shorter:active{background:#21935a}input.button_link_shorter:hover{background:#35a76e}input.text_link_shorter {max-width: 90vw;display: inline-block;color: #777674;font-weight: bold;font-size: 11px;text-decoration: none;text-shadow: rgba(255,255,255,.5) 1px 1px, rgba(100,100,100,.3) 3px 7px 3px;user-select: none;padding: 0.3em 0.3em;outline: none;border-radius: 2px / 100%;background-image:linear-gradient(45deg, rgba(255,255,255,.0) 20%, rgba(255,255,255,.8), rgba(255,255,255,.0) 60%),linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0) 10%, rgba(255,255,255,0) 80%, rgba(255,255,255,.3)),linear-gradient(to right, rgba(125,125,125,1), rgba(255,255,255,.9) 45%, rgba(125,125,125,.5)),linear-gradient(to right, rgba(125,125,125,1), rgba(255,255,255,.9) 45%, rgba(125,125,125,.5)),linear-gradient(to right, rgba(223,190,170,1), rgba(255,255,255,.9) 45%, rgba(223,190,170,.5)),linear-gradient(to right, rgba(223,190,170,1), rgba(255,255,255,.9) 45%, rgba(223,190,170,.5));background-repeat: no-repeat;background-size: 200% 100%, auto, 100% 2px, 100% 2px, 100% 1px, 100% 1px;background-position: 200% 0, 0 0, 0 0, 0 100%, 0 4px, 0 calc(100% - 4px);box-shadow: rgba(0,0,0,.5) 3px 10px 10px -10px;}");
GM_addStyle('.tooltip {position: relative;text-indent: 0px;cursor: auto;}.tooltip > font {z-index: 10000; position: absolute; bottom: 100%; left: -20em; right: -20em; width: -moz-max-content;  width: -webkit-max-content;  max-width: 80vw; max-height: 80vh; overflow: auto; visibility: hidden;  margin: 0 auto .4em; padding: .3em;  border: solid rgb(200,200,200);  font-size: 11px;  background: #fff;  line-height: normal;  cursor: auto;}.tooltip.left > font { left: 0;  right: -20em;  margin: 0 0 .4em;}.tooltip.right > font { left: -20em;  right: 0;  margin: 0 0 .4em auto;}.tooltip:after { content: "";  position: absolute;  top: -.4em;  left: 50%;  visibility: hidden;  margin: 0 0 0 -.4em;  border: .4em solid;  border-color: rgb(200,200,200) transparent transparent transparent;  cursor: auto;}.tooltip.left:after {  left: 1em;}.tooltip.right:after {  left: auto;  right: .6em; }.tooltip:before { content: "";  position: absolute;  top: -.4em;  left: 0;  right: 0;  height: .4em;  visibility: hidden;}.tooltip:hover > font,.tooltip:hover:before,.tooltip:hover:after,.tooltip:focus > font,.tooltip:focus:before,.tooltip:focus:after {  visibility: visible;  transition: 0s .4s;}.tooltip:focus { outline: none;}.tooltip.anim > font,.tooltip.anim:after { opacity: 0;  transform: translateY(1.5em) scale(.3);  transform-origin: center bottom;}.tooltip.anim:after {  transform: translateY(.7em) scale(.3);}.tooltip.anim:hover > font,.tooltip.anim:hover:after,.tooltip.anim:focus > font,.tooltip.anim:focus:after { opacity: 1; transition: .6s .4s; transform: translateY(0);}@media (max-width: 20em) {.tooltip > font { max-width: 100vw; box-sizing: border-box; }}');
GM_addStyle('a { text-decoration:underline; color:#395999;}a:hover { text-decoration:none;}a img { border: none; }');
document.onkeydown = function(z) {
    if (z.keyCode == "120") {
        var h = document.getElementsByTagName('a');
        document.clicked = !document.clicked >>> 0;
        if (document.clicked) {
            for (var i = h.length - 1; i >= 0; i--) {
                h[i].href = h[i].href.replace("proxy", "static");
                h[i].download = document.title + '( ' + h[i].href + ' )';
                h[i].setAttribute("onclick","return false");
                h[i].addEventListener("click", function s(){
                if (this.first) return true;
                else{
                var thishref = this; 
                GM_xmlhttpRequest({
                        method: "HEAD",
                        url: thishref.href,
                    onload: function(ur) {
                            if (ur.finalUrl.match(/m.megafonpro.ru/)) {
                            thishref.removeAttribute("onclick");
                            thishref.first = true;
                            if (this.status==200) thishref.click(); else if(confirm("Неудача,ошибка : "+this.statusText+"\nКод ошибки : "+this.status+"\nПопробовать скачать по траффику ?")) thishref.href = thishref.href.replace("static","activate");thishref.click();     
                            }
                            else {
function formatSize(length){
	var i = 0, type = ['б','Кб','Мб','Гб','Тб','Пб'];
	while((length / 1000 | 0) && i < type.length - 1) {
		length /= 1024;
		i++;
	}
	return length.toFixed(2) + ' ' + type[i];
}

if (ur.responseHeaders.match(/Content-Length/)) {
  var text = "Размер : " + formatSize(ur.responseHeaders.match(/Content-Length:\s*(\d+)/)[1]);
}                                
if (confirm("Файл невозможно скачать\nСкачать его по трафику ?\n"+text+"\nСсылка : " + ur.finalUrl)) {
    thishref.href2 = thishref.href;
    thishref.removeAttribute("onclick");
    thishref.first = true;
    if (ur.finalUrl == "http://info.megafonvolga.ru/Stranytsa-uskorenyja-new2") {
    alert("У вас закончился траффик,скачивание невозможно\nРедирект идёт на "+ur.finalUrl);
    }else{
    thishref.href = ur.finalUrl;
    thishref.click();
    }
}
                            }
                        }});}
            }, false);
        }
        }
        else {
            for (var i = h.length - 1; i >= 0; i--) { 
                h[i].removeAttribute("onclick");
                h[i].removeAttribute("download");
                if (h[i].href2) {
                h[i].href = h[i].href2.replace("static", "proxy");
                }
                else{
                h[i].href = h[i].href.replace("static", "proxy");
                }
            }
        }
    }
};
window.addEventListener("DOMContentLoaded", function() {
    var h = document.getElementsByTagName('base');
    for (var i = h.length - 1; i >= 0; i--) h[i].href = "http://m.megafonpro.ru";
        if (GM_getValue('opt4', true)) {
        var node = document.getElementById("user_bar");
        if (node == null) var node = document.getElementById("authorization");
        if (node !== undefined) node.parentNode.removeChild(node);
        var node = document.getElementsByClassName("tmenu")[0];
        if (node !== undefined) node.parentNode.removeChild(node);
        var node = document.getElementsByClassName("banner")[1];
        if (node !== undefined) node.parentNode.removeChild(node);
        var node = document.getElementsByClassName("banner")[0];
        if (node !== undefined) node.parentNode.removeChild(node);
        var node = document.getElementsByClassName("contentWidgets")[0];
        if (node !== undefined) node.parentNode.removeChild(node);
        var node = document.getElementsByClassName("yandex-search")[0];
        if (node !== undefined) node.parentNode.removeChild(node);
    }
    if (GM_getValue('opt13', true)) {
    document.head.removeChild(document.getElementsByTagName('link')[1]);
    document.head.removeChild(document.getElementsByTagName('link')[0]);
}
        if (GM_getValue('opt8', true)) {
        var h = document.getElementsByTagName('noscript');
        for (var i = h.length - 1; i >= 0; i--) {
            if (h[i].textContent.match(/<meta http-equiv/gi)) {
            GM_log('Удалён небезопасный тег noscript :\n' + h[i].textContent);
        }
            else{
                h[i].insertAdjacentHTML("beforeBegin", h[i].textContent);
            }
           h[i].parentNode.removeChild(h[i]);
    }
    }
    var h = document.getElementsByTagName('a');
    for (var i = h.length - 1; i >= 0; i--) h[i].href = h[i].href.replace("leave", "proxy");
        if (GM_getValue('opt1', true)) {
        var h = document.getElementsByTagName('img');
        for (var i = 0; i < h.length; i++) {
        h[i].src = h[i].src.replace("leave", GM_getValue('opt9', 'proxy'));
        h[i].addEventListener("error", function(fixerror) {
          if (!this.first) {
            if (this.src.match(/proxy/)) {
                this.src = this.src.replace('proxy','static');
            }
            else {
                this.src = this.src.replace('static','proxy');
        }
        this.first = true;
          }
          }, false);
        }
        }
    var h = document.getElementsByTagName("iframe");
    for (var i = 0; i < h.length; i++) {
        window.frames[i].stop();
        h[i].src = "about:blank";
        h[i].parentNode.removeChild(h[i]);
    }
    var h = document.getElementsByTagName('form');
    for (var i = h.length - 1; i >= 0; i--) h[i].action = h[i].action.replace("leave", "proxy");

if (GM_getValue('opt0', true)) {
        var h = document.querySelectorAll('link:not([href="http://m.megafonpro.ru/stylesheets/mpro_lite.css"]):not([href="http://m.megafonpro.ru/stylesheets/yandex-search-lite.css"])');
    for (var i = h.length - 1; i >= 0; i--) {
            if (h[i].getAttribute("rel")=="stylesheet") {
            GM_xmlhttpRequest({
            method: "GET",
            url: h[i].href.replace('leave','proxy'),
            onload: function(zz) {
            var newelem = document.createElement("style");
            newelem.type = "text/css";
            newelem.innerHTML = zz.responseText.replace(/leave/g , GM_getValue("opt11", "static"));
            document.head.appendChild(newelem,document.head.firstChild);
        }
        });
                h[i].parentNode.removeChild(h[i]);
        }
        else h[i].href = h[i].href.replace("leave", GM_getValue("opt11", "static"));
    }
        var h = document.querySelectorAll('[style]');
        for (var i = h.length - 1; i >= 0; i--) {
        h[i].style.cssText = h[i].style.cssText.replace('leave', 'proxy');
        }
        var h = document.getElementsByTagName('style');
        for (var i = h.length - 1; i >= 0; i--) {
        if (h[i].innerHTML.match(/\leave\/[0-9a-f]{32}/)) h[i].innerHTML = h[i].innerHTML.replace(/leave/g,GM_getValue("opt11", "static"));
        if (h[i].innerHTML.match(/#proxiedContent/)) h[i].parentNode.removeChild(h[i]);
    }
        }
   if (GM_getValue('opt2', true)) {
        document.body.appendChild(document.createElement("p"));
        var rbutton = document.createElement("input");
        rbutton.id = "redirectbutton";
        rbutton.type = "button";
        rbutton.value = "открыть по трафику";
        rbutton.title = document.title;
        rbutton.className = "button_link_shorter";
        rbutton.setAttribute("onclick", "if (confirm('Перейти по тарифицируемой ссылке ?')) window.open(location.href.replace('proxy','activate'),'_blank')");
        document.body.appendChild(rbutton);
    }
    if (GM_getValue('opt5', true)) {
        document.body.style = "padding: 0px;margin: 0px;font-family: Tahoma, Geneva, sans-serif";
        document.body.style.textAlign = GM_getValue('opt10', 'center');
        if (!document.getElementById("proxy_container")) {
            document.getElementById("container").style = "text-align:" + GM_getValue('opt10', 'center') + ";min-width: none; max-width: none";
        } else document.getElementById("proxy_container").style = "text-align:" + GM_getValue('opt10', 'center') + ";min-width: none; max-width: none";
    }    
}, false);

window.addEventListener("load", function() {
    if(GM_getValue('opt6', true)) {
    if (document.documentElement.innerHTML.match(/(\leave\/[0-9a-f]{32})/i)) {
    document.documentElement.innerHTML = document.documentElement.innerHTML.replace(/leave/g, GM_getValue('opt12', 'static'));
}
}
        if (GM_getValue('opt3', true)) {
        GM_xmlhttpRequest({
            method: "GET",
            url: location.href.replace("proxy", "leave"),
            onload: function(x) {
                var mynewurl = x.responseText.match(/s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g)[33];
                if (GM_getValue('opt2', true)) {
                    document.body.appendChild(document.createElement("p"));
                }
                var tshorter = document.createElement("input");
                tshorter.type = "url";
                tshorter.className = "text_link_shorter";
                tshorter.placeholder = "например http://google.com";
                if (mynewurl.match(/m.megafonpro.ru/i)) {
                tshorter.value = "Ссылка не определена";
                }
                else {
                tshorter.innerHTML = decodeURI(mynewurl) + decodeURI(location.search) + decodeURI(location.hash);
                tshorter.value = decodeURI(tshorter.textContent);
                tshorter.innerHTML = '';
                }
                tshorter.style="opacity:0;height: 0px;width: 0px;margin: 5px; padding: 10px; transition: 1s linear;";
                tshorter.size=19;
                document.body.insertBefore(tshorter,document.body.firstChild);
                 setTimeout(function (){
                 tshorter.style.opacity = "1";
                 tshorter.style.height = "10px";
                 tshorter.style.width = ((tshorter.value.length) * 6) + 'px';
                 tshorter.style.fontFamily = "Arial";
                 tshorter.style.zIndex = "1000";
                 tshorter.style.position = "relative";    
                 }, 0);
                tshorter.addEventListener("keypress", function(k) {
            function geturl() {
            GM_xmlhttpRequest({
        method: "GET",
        url: "http://web.archive.org/web/20140306220001/http://m.megafonpro.ru/home?from_404=1",
        onload: function(m) {
            if (m.finalUrl != 'http://web.archive.org/web/20140306220001/http://m.megafonpro.ru/home?from_404=1') {
                alert('У вас закончился трафик,перейти по ссылке невозможно');
                return false;
            }
            GM_xmlhttpRequest({
                method: "GET",
                url: m.responseText.match(/(\http:\/\/m\.megafonpro\.ru\/mailru\/proxy\/[0-9a-f]{32})/g)[0],
                onload: function(e) { 
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: 'http://m.megafonpro.ru/' + e.responseText.match(/\mailru\/proxy\/[0-9a-f]{32}/g)[2],
                        onload: function(f) {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: 'http://m.megafonpro.ru/' + f.responseText.match(/\mailru\/leave\/[0-9a-f]{32}/g)[0].replace("leave", "proxy") + "?q=useit.com",
                                onload: function(s) {
                                GM_xmlhttpRequest({
                                method: "GET",
                                url: 'http://m.megafonpro.ru/' + s.responseText.match(/\mailru\/leave\/[0-9a-f]{32}/g)[5].replace("leave", "proxy"),
                                onload: function(z) {
                                GM_setValue('siteswitch', 'http://m.megafonpro.ru/' + z.responseText.match(/\mailru\/leave\/[0-9a-f]{32}/g)[13].replace("leave", "proxy"));
                                GM_xmlhttpRequest({
                                method: "POST",
                                url: 'http://m.megafonpro.ru/' + z.responseText.match(/\mailru\/leave\/[0-9a-f]{32}/g)[13].replace("leave", "proxy"),
                                data: "url=" + tvalue,
                   headers: {
                       "Content-Type": "application/x-www-form-urlencoded"
                   },
                                onload: function(a) {   
                                location = 'http://m.megafonpro.ru/' + a.responseText.match(/\mailru\/leave\/[0-9a-f]{32}/g)[0].replace("leave", "proxy");
                            }});}});}});  
                   }
                    }
                                     );}
            });
        }});
                   }
                   if (k.keyCode == "13") {
                   if (GM_getValue("siteswitch")) {
                   GM_xmlhttpRequest({
                   method: "POST",
                   url: GM_getValue("siteswitch"),
                   data: "url=" + this.value,
                   headers: {
                       "Content-Type": "application/x-www-form-urlencoded"
                   },
                   onload: function(s) {
                   if (s.finalUrl != "http://m.megafonpro.ru/") {
                   location = 'http://m.megafonpro.ru/' + s.responseText.match(/\mailru\/leave\/[0-9a-f]{32}/g)[0].replace("leave", "proxy");             
                   }
                       else{
                           geturl();
                       }
                   }});}
                   else{

                   }}}, false);
                }
              });
        }
var passFields = document.getElementsByTagName('a');
    for (var i = 0; i < passFields.length; i++) {
        if (passFields[i].href.match(/\proxy\/[0-9a-f]{32}/)) {
            passFields[i].className = passFields[i].className + " tooltip anim";
            passFields[i].addEventListener("mouseover", function() {
                if (!this.nload) {
                    this.nload = "start";
                    var myurl = this;
                    var req = GM_xmlhttpRequest({
                        method: "GET",
                        url: myurl.href.replace("proxy", "leave").replace("static", "leave"),  
                        onload: function(ms) {
                            if (!ms.responseText.match(/s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g)[33].match(/m.megafonpro.ru/)) {
                            var s = document.createElement("a");
                            s.href = ms.responseText.match(/s?https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+/g)[33];
                            s.innerHTML = s.href;
                            s.innerHTML = decodeURI(s.textContent);
                            myurl.firstElementChild.innerHTML = "";
                            myurl.firstElementChild.appendChild(s,myurl.firstChild);
                            var t = myurl.firstElementChild,
                            em = '-20',
                            tR = t.getBoundingClientRect(),
                            tS = getComputedStyle(t, '').fontSize.slice(0, -2),
                            d = document.documentElement.getBoundingClientRect().right - tR.right;
                            if(tR.left < 0) t.style.left = parseInt(tS * em - tR.left * 2) + 'px';
                            if(d < 0) t.style.right = parseInt(tS * em - d * 2) + 'px';
                            }
                            else {
                            myurl.firstElementChild.innerHTML = "ссылка не определена";
                            }
                            myurl.nload = "end";
                        }
                    });
                }
}, false);
            var mynewspan = document.createElement("font");
var mynewhref = document.createTextNode("Ссылка подгружается ...");
mynewspan.appendChild(mynewhref);
passFields[i].insertBefore(mynewspan,passFields[i].firstChild);
        }
        
    }
},false);