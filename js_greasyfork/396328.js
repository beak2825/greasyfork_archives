// ==UserScript==
// @name         Boadica título descritivo
// @namespace    alpe
// @version      0.3
// @description  Adiciona mais detalhes ao título das páginas do boadica.com.br
// @author       alpe
// @match        https://www.boadica.com.br/*
// @match        http://www.boadica.com.br/*
// @grant        GM.setValue
// @grant        GM.getValue
// @downloadURL https://update.greasyfork.org/scripts/396328/Boadica%20t%C3%ADtulo%20descritivo.user.js
// @updateURL https://update.greasyfork.org/scripts/396328/Boadica%20t%C3%ADtulo%20descritivo.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    function getcode (url){
        return url.search.replace(/^\?/, '').split('&').map(function(a){ return a.split('=')[1]; }).join('-');
    }
    function selectItemByValue(elmnt, value){
        for(var i=0; i < elmnt.options.length; i++)
        {
            if(elmnt.options[i].value == value) return elmnt[i];
        }
        return false;
    }
    var element, pagem;
    var titleadd = [];
    if (element = document.querySelector(".title1, .title1-preco .breadcumb")){
        var page = document.querySelector('.paginacao p');
        document.title = 'Boadica ' + element.innerText.replace('Pesquisa de Preços > Pesquisa de Preços', 'Pesquisa de Preços').replace('Pesquisa de Preços >', '\uD83D\uDD0D\uD83D\uDCB0 \u00BB') + (page && (pagem = page.innerText.match(/(\d+) de (\d+)/)) && pagem[2] !== '1' ? ' \u00BB ' + pagem[1] + '/' + pagem[2] : '');
    }
    if (element = document.getElementById("em_box")){
        var c = await GM.getValue(getcode(location), false);
        var m = location.href.match(/modelo=([^&]+)/);
        var r = location.href.match(/regiao=([^&]+)/);
        var t = location.href.match(/em_box=([^&]+)/);
        if (c || m || r || t){
            var observer = new MutationObserver(function() {
                observer.disconnect();
                if (c) titleadd.push(c);
                if (m) titleadd.push(selectItemByValue(document.getElementById("modelo"), m[1]).text);
                if (r) titleadd.push(selectItemByValue(document.getElementById("regiao"), r[1]).text);
                if (t) titleadd.push(selectItemByValue(document.getElementById("em_box"), t[1]).text);
                if (titleadd) document.title += ' [' + titleadd.join(" | ") + ']';
            });
            observer.observe(document.getElementById("modelo"), { childList: true });
        }
    } else if (element = document.querySelectorAll('#centro > div a[href*=pesquisa]')){
        for (var i=0; i<element.length; i++){
            if (element[i].search !== ''){
                await GM.setValue(getcode(element[i]), element[i].textContent);
            }
        }
    }
})();