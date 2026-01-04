// ==UserScript==
// @name         Tab News - Modo Escuro (UI)
// @namespace    cedroca-scripts
// @version      4.5
// @description  Sistema de troca de temas, dai, fiz temas focados em azul, verde e rosa, para testar.
// @author       Diegiwg (Diego Queiroz)
// @run-at       document-start
// @match        https://www.tabnews.com.br/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tabnews.com.br
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/455569/Tab%20News%20-%20Modo%20Escuro%20%28UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/455569/Tab%20News%20-%20Modo%20Escuro%20%28UI%29.meta.js
// ==/UserScript==

let node_tema = null;
let node_botao_seletor = null;
const temas = {};

function ativar_tema(nome_tema) {
    let css_tema = temas[nome_tema]
    node_tema = GM_addStyle(css_tema);
}

function atualizar_tema() {
    const tema = window.localStorage.getItem('tema')
    if(node_tema) node_tema.remove();
    ativar_tema(tema);
}

function proximo_tema() {
    const tema = window.localStorage.getItem('tema')
    const lista_temas = Object.keys(temas);

    const proximo = () => {
        let novo = lista_temas.indexOf(tema) + 1;
        if (novo == lista_temas.length) novo = 0
        return lista_temas[novo]
    }

    window.localStorage.setItem('tema', proximo());
    atualizar_tema();
}

(function() {
    'use strict';

    // GM_addStyle("@import url('http://127.0.0.1:5500/tabnews.css');")
    const elementos = ".cfHMLL,.coRAqY,.ixUrcw,.jbChEF,.jtBSrE,.kBxZNn .jtBSrE{box-shadow:none}body{background-color:var(--cor-de-fundo-primaria);color:var(--cor-de-texto-primaria);box-shadow:none!important;filter:brightness(.9)!important}input[type=checkbox]{accent-color:var(--cor-secundaria)}.bxSaIh,.cIuQfO,.ipvwXw,.knNQNm{color:inherit!important}.dWxAqQ{background-color:var(--cor-primaria);color:var(--cor-de-texto)!important}.bCxrbX,.cfHMLL,.ixUrcw{background-color:var(--cor-secundaria)!important}.cPXPdm,.coRAqY,.ehGjaB,.hiyjYW,.igLpVF,.jbChEF,.jtBSrE{background-color:var(--cor-primaria)!important}.bCxrbX,.bytemd-toolbar-tab-active,.cfHMLL,.ixUrcw,.jKkIsR,.kBxZNn .jtBSrE{color:var(--cor-de-texto-claro)}.kBxZNn .jtBSrE{background-color:var(--cor-de-fundo-primaria)!important}.jtBSrE:hover{filter:opacity(var(--opacidade-leve))}.bxSaIh:hover,.ipvwXw:hover,.markdown-body img{background-color:inherit!important}.bCxrbX{border:1px solid var(--cor-de-fundo-secundaria)!important}.fvjKYN,.hBCHbx{color:var(--cor-de-texto)}.bPBLTS,.cIuQfO,.czRdDB,.epgido,.fHcGEk,.iQNyfP,.iomKxT,.llfTuQ,.markdown-body blockquote,.markdown-body details,.markdown-body dl,.markdown-body ol,.markdown-body p,.markdown-body pre,.markdown-body table,.markdown-body ul{color:var(--cor-de-texto-claro)!important}.bnKvGs{color:var(--cor-de-texto-escuro)!important}.coRAqY,.jbChEF{color:var(--cor-de-texto)}.coRAqY:hover,.jbChEF:hover,.jtBSrE:hover{filter:opacity(var(--opacidade-pesada))}.coRAqY{margin-right:5px}.jtBSrE{color:var(--cor-de-texto-escuro)}.dJOScE{color:var(--cor-de-texto);background-color:var(--cor-primaria)}.fvjKYN,.markdown-body .highlight pre,.markdown-body pre,.markdown-body table *{background-color:var(--cor-de-fundo-secundaria)}.gRfwpC,.jmiTbg{color:var(--cor-de-texto-principal-tom-1)}.dVxwER{color:var(--cor-de-texto-principal-tom-2)}.bjfzaq{border-color:var(--cor-de-texto-principal-tom-3);border-style:groove;margin-top:5px}.ehGjaB,.hHgTHO,.hiyjYW,.igLpVF{color:inherit;box-shadow:none}.bytemd,.bytemd>span,.hljs,.markdown-body{color:var(--cor-de-texto)!important}.markdown-body{background-color:var(--cor-de-fundo-primaria)}.bytemd{background-color:var(--cor-secundaria);border:1px solid var(--cor-de-fundo-secundaria)}.bytemd-toolbar{border-bottom:1px solid #e1e4e8;background-color:var(--cor-de-fundo-secundaria)}.bytemd-toolbar-icon,.bytemd-toolbar-tab{background-color:inherit!important;color:var(--cor-de-texto)!important}.bytemd-toolbar-icon:hover{opacity:var(--opacidade-pesada)}.CodeMirror{background-color:inherit!important;color:inherit}.markdown-body a{color:var(--cor-de-texto-link)}[class^=cm]{color:var(--cor-de-texto-link)!important}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:#ff7d89}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#ba94ff}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#7aa4d6}.hljs-subst{color:#88d6d0}.hljs-params{color:#e5e03f}.hljs-property{color:#ff73f5}.hljs-code,.hljs-comment,.hljs-formula{color:#21c050}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#61abff}.hljs-built_in,.hljs-symbol{color:#ff8734}";

    temas.verde = "*{--cor-de-fundo-primaria:#09160b;--cor-de-fundo-secundaria:#061609;--cor-primaria:#244028;--cor-secundaria:#230c28;--cor-de-texto-claro:#efefef;--cor-de-texto:#e1e1e1;--cor-de-texto-escuro:#cfcfcf;--cor-de-texto-primaria:#fff;--cor-de-texto-secundaria:#000;--cor-de-texto-link:#ffb586;--opacidade-leve:.8;--opacidade-pesada:.6;color-scheme:dark!important;text-rendering:optimizeLegibility!important}" + elementos;
    temas.rosa = "*{--cor-de-fundo-primaria:#1c0a17;--cor-de-fundo-secundaria:#140511;--cor-primaria:#3e1224;--cor-secundaria:#230c28;--cor-de-texto-claro:#efefef;--cor-de-texto:#e1e1e1;--cor-de-texto-escuro:#cfcfcf;--cor-de-texto-primaria:#fff;--cor-de-texto-secundaria:#000;--cor-de-texto-link:#c7819d;--opacidade-leve:.8;--opacidade-pesada:.6;color-scheme:dark!important;text-rendering:optimizeLegibility!important}" + elementos;
    temas.cinza = "*{--cor-de-fundo-primaria:#0b0b0b;--cor-de-fundo-secundaria:#1c1c1c;--cor-primaria:#282828;--cor-secundaria:#171717;--cor-de-texto-claro:#efefef;--cor-de-texto:#e1e1e1;--cor-de-texto-escuro:#cfcfcf;--cor-de-texto-primaria:#ffffff;--cor-de-texto-secundaria:#000000;--cor-de-texto-link:#8cbaf5;--opacidade-leve:0.8;--opacidade-pesada:0.6;color-scheme:dark!important;text-rendering:optimizeLegibility!important}:focus-within{box-shadow:inherit!important}" + elementos;
    temas.azul_escuro = "*{--cor-de-fundo-primaria:#0a101c;--cor-de-fundo-secundaria:#050a14;--cor-primaria:#12273e;--cor-secundaria:#0c1928;--cor-de-texto-claro:#efefef;--cor-de-texto:#e1e1e1;--cor-de-texto-escuro:#cfcfcf;--cor-de-texto-primaria:#fff;--cor-de-texto-secundaria:#000;--cor-de-texto-link:#81a5c7;--opacidade-leve:.8;--opacidade-pesada:.6;color-scheme:dark!important;text-rendering:optimizeLegibility!important}:focus-within{box-shadow:inherit!important}" + elementos;
    temas.classico = "body{background:#0c0c0c;color:#f5f5f5}.markdown-body{color:#f5f5f5;background-color:#24292f}.markdown-body hr{background-color:#474747}.markdown-body .highlight pre,.markdown-body pre,.markdown-body table tr{background-color:#2f353b}.markdown-body img{background-color:transparent;filter:brightness(.8)}.markdown-body a{color:#9ac8ff}.markdown-body h6{color:#8a99aa}.markdown-body blockquote{color:#e0e0e0;border-left:.25em solid #7a828a}.markdown-body table tr{border-top:1px solid #2f353b}.markdown-body table tr:nth-child(2n){background-color:#14171b}.bxDQnN,.hljs{color:#fff}.hljs-attr,.hljs-attribute,.hljs-literal,.hljs-meta,.hljs-number,.hljs-operator,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-variable{color:#4da0ff}.hljs-meta .hljs-string,.hljs-regexp,.hljs-string{color:#98c8ff}.hljs-title,.hljs-title.class_,.hljs-title.class_.inherited__,.hljs-title.function_{color:#b48aff}.hljs-built_in,.hljs-symbol{color:#f79049}.hljs-name,.hljs-quote,.hljs-selector-pseudo,.hljs-selector-tag{color:#00e838}.hljs-doctag,.hljs-keyword,.hljs-meta .hljs-keyword,.hljs-template-tag,.hljs-template-variable,.hljs-type,.hljs-variable.language_{color:rgb(32 237 55)}.hljs-section{color:#3185e5}.cm-s-default .cm-tag{color:#88dd7a}.cm-s-default .cm-attribute{color:#a4a4ff}.cm-s-default .cm-header{color:#8484c2}.cm-s-default .cm-comment{color:#ffac5a}.hljs-subst{color:#00e5cc}.cm-s-default .cm-quote{color:#71d671}.cm-s-default .cm-link{color:#7694d6}.cm-s-default .cm-string{color:#e5863b}.bytemd span[role=presentation]{color:#dadada}.dVxwER,.gegHsX,.llfTuQ,.mpvg{color:#f5f5f5}.dJOScE,.jbChEF,.jtBSrE{color:#f5f5f5;background-color:rgb(36 41 47)!important}.jbChEF,.jtBSrE{border:1px solid rgb(0 0 0)!important;box-shadow:none!important}.jbChEF:hover,.jtBSrE:hover{background-color:#212121!important}.coRAqY:hover{background-color:rgb(36 41 47)!important}.jVDKa{color:rgb(233 233 233);background:#24292f}.fHcGEk{color:rgb(173 173 173)}.eOokvn>a,.eOokvn>a:link{color:rgb(205 205 205)}.eOokvn>a:visited{color:rgb(166 166 166)}.bnKvGs,.bnKvGs *{font-size:12px;color:rgb(136 136 136)}.fvjKYN,.ixUrcw{background-color:rgb(50 55 60)}.hiyjYW{background-color:rgb(22 25 28);box-shadow:none}.hiyjYW:hover{background-color:#121518}.bytemd:focus-within,.hGoCtd:focus-within{border-color:#f5f5f5!important;box-shadow:none!important}.bytemd,.bytemd-editor .CodeMirror,.hGoCtd{background:#24292f}.bxSaIh,.bytemd-toolbar,.bytemd-toolbar-tab,.bytemd-toolbar-tab-active,.cIuQfO,.eiPrdx,.fvjKYN,.hGoCtd,.hHgTHO,.hiyjYW,.hwTILH,.iQNyfP,.igLpVF,.ipvwXw{color:rgb(255 255 255)}.bytemd-toolbar-icon:hover{background-color:#484850}.ehGjaB{background-color:rgb(43 110 62)}.bnQotb:hover,.bxSaIh:hover,.igLpVF:hover,.ipvwXw:hover{color:#fff!important;background-color:#1e2226!important}.gRfwpC{color:rgb(165 165 165)}.bytemd-toolbar{background-color:#171a1e}.CodeMirror-vscrollbar{display:none!important}";
    temas.desativado = ""

    const tema = window.localStorage.getItem('tema')
    if (tema == null) window.localStorage.setItem('tema', 'cinza');
    atualizar_tema();
})();

GM_registerMenuCommand('Próximo Tema', proximo_tema);

const svg = `
<svg aria-hidden="true" focusable="false" role="img" class="octicon octicon-person-fill" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" style="display: inline-block; user-select: none; vertical-align: text-bottom; overflow: visible;">
    <path d="M 3.007 6.432 C 3.007 2.961 6.83 0.79 9.889 2.526 C 12.83 4.195 12.973 8.316 10.153 10.176 C 12.902 11.185 2.29 11.184 5.039 10.175 C 3.769 9.339 3.007 7.935 3.007 6.432 Z" style=""></path>
</svg>
`

const btn = `
    <button
        aria-label="Abrir opções de Tema"
        id="react-aria-2"
        aria-haspopup="true"
        tabindex="0"
        class="types__StyledButton-sc-ws60qy-0 jtBSrE">
        <span class="Box-sc-1gh2r6s-0 kqWLFK">

        ${svg}

        </span>
    </button>`

function botao_temas() {
    const node = document.querySelector('.kBxZNn');
    if (node === null) return setTimeout(botao_temas, 200)

    node.style = `
        flex-direction: row-reverse;
        gap: 10px;
    `

    node_botao_seletor = GM_addElement(node, 'div', {
        id: 'botao_seletor',
        class: "Header__HeaderItem-sc-11fu6rh-1 kBxZNn",
    })

    node_botao_seletor.innerHTML = btn;
    node_botao_seletor.onclick = proximo_tema;
}

botao_temas()

setInterval(() => {
    if (document.querySelector('#botao_seletor') === null) botao_temas()
}, 500)