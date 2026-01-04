// ==UserScript==
// @name           KG_HideAllGamesInGamelist
// @namespace      klavogonki
// @include        https://klavogonki.ru/gamelist/*
// @include        http://klavogonki.ru/gamelist/*
// @author         NoNe
// @description    Hide all the created races on the gamelist page
// @version        0.1
// @downloadURL https://update.greasyfork.org/scripts/404424/KG_HideAllGamesInGamelist.user.js
// @updateURL https://update.greasyfork.org/scripts/404424/KG_HideAllGamesInGamelist.meta.js
// ==/UserScript==

if (!document.getElementById('KTS_HAGIGL')) {
    if (localStorage['KTS_HAGIGL'] && localStorage['KTS_HAGIGL'] != 'NULL') {
        var s = document.createElement('style');
        s.id = 'KTS_HAGIGL_STYLE';
        s.innerHTML = localStorage['KTS_HAGIGL'];
        document.body.appendChild(s);
    }

    var createElem = document.createElement('span');
    createElem.innerHTML = ' <input title="Скрыть заезды" type="button" value="Скрыть Заезды" />';
    document.getElementById('delete').parentNode.insertBefore(createElem, document.getElementById('delete').nextSibling);
    createElem.onclick = function() {
        var e = document.getElementById('KTS_HAGIGL_STYLE');
        if (e) {
            if (e.innerHTML == '#gamelist-active{display:none;}') {
                localStorage['KTS_HAGIGL'] = e.innerHTML = '#gamelist{display:none;}';
            } else {
                document.body.removeChild(document.getElementById('KTS_HAGIGL_STYLE'));
                localStorage['KTS_HAGIGL'] = 'NULL';
            }
        } else {
            var s = document.createElement('style');
            s.id = 'KTS_HAGIGL_STYLE';
            localStorage['KTS_HAGIGL'] = s.innerHTML = '#gamelist-active{display:none;}';
            document.body.appendChild(s);
        }
    };

    var tmp_elem = document.createElement('div');
    tmp_elem.id = 'KTS_HAGIGL';
    tmp_elem.style.display = 'none';
    document.body.appendChild(tmp_elem);
}
