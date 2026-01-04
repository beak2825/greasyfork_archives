// ==UserScript==
// @name         Tabnews - Sistema de Busca [fase de testes]
// @namespace    cedroca-scripts
// @license      MIT
// @version      0.5
// @description  -
// @author       Diegiwg (Diego Queiroz)
// @run-at       document-start
// @match        https://www.tabnews.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tabnews.com.br
// @grant        GM.xmlHttpRequest
// @grant        GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/455858/Tabnews%20-%20Sistema%20de%20Busca%20%5Bfase%20de%20testes%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/455858/Tabnews%20-%20Sistema%20de%20Busca%20%5Bfase%20de%20testes%5D.meta.js
// ==/UserScript==

function body(busca) {
    let node = document.querySelector('.kraPei')
    if (node === null) return setTimeout(body, 200)
    node.innerHTML = '';
    busca.items.forEach((i) => {let x = GM_addElement(node, 'a'); x.href = i.link; x.textContent = i.pagemap.metatags[0].title; x.outerContent += '</br>';})
}

function fazer_busca(search_string, page) {
    // var url = (search, start) => `https://cse.google.com/cse/element/v1?rsz=filtered_cse&q=${search}&num=20&${start}=0&hl=pt-BR&source=gcsc&gss=.com&cselibv=f275a300093f201a&cx=15e2d71c7c2ef4cba&safe=off&cse_tok=AB1-RNXCv4OGarnQDbTRHiZo4dX3:1669980052769&sort=&exp=csqr,cc,4861326&gs_l=partner-web.12...0.0.1.28055.0.0.0.0.0.0.0.0..0.0.csems%2Cnrl%3D10...0.....34.partner-web..4.5.525.bCIdqgUPlaI&cseclient=hosted-page-client&callback=google.search.cse.api7382`

    var url = (search, start) => `https://www.googleapis.com/customsearch/v1?key=AIzaSyD5EpqYTANR06ZJVkiorM7aGeqVZE63MpA&cx=15e2d71c7c2ef4cba&start=${start}&q=${search}`

    GM.xmlHttpRequest({
        method: "GET",
        url: url(search_string, page),
        onload: function(response) {
            const json_str = (response.responseText.replace(`/*O_o*/
google.search.cse.api7382(`, '').replace('});', '}'));
            const busca_obj = JSON.parse(json_str)
            console.log({busca: busca_obj})
            body(busca_obj)

        }
    });
}

function adicionar_barra_de_busca() {
    const node = document.querySelector('.kBxZNn');
    if (node === null) return setTimeout(adicionar_barra_de_busca, 100)
    const node_busca = GM_addElement(node, 'input', {
        type:"text",
        id:"sistema-busca", class:"jtBSrE",
        style:'text-align: left !important;'
    })

    node_busca.onkeypress = (e) => {
        if(e.keyCode == 13) {
            fazer_busca(node_busca.value, 0);
        }
    }
}

(function() {
    'use strict';
    adicionar_barra_de_busca();
})();