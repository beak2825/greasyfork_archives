// ==UserScript==
// @name         Muambator extender
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Facilitar rastreio de encomendas adicionando link na home
// @author       You
// @match        https://www.muambator.com.br/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @resource     REMOTE_CSS https://gist.github.com/gabrielqmatos88/9405944a1a9815c38f6411d474296527/raw/dcd6c6b0cd6fc8b4c0214bbdd6a791057f6f9c5b/muambator-extender.css
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426618/Muambator%20extender.user.js
// @updateURL https://update.greasyfork.org/scripts/426618/Muambator%20extender.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // Load remote CSS
    // @see https://github.com/Tampermonkey/tampermonkey/issues/835
    const myCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(myCss);
    const menu = $('ul.nav.navbar-nav.navbar-right');
    const criarLinkRastreio = (codigo, name) => {
        return `
            <li>
                <a target="_blank" href="/pacotes/${codigo}/detalhes/">${ name || codigo }</a>
            <li/>
        `;
    };
    const addForm = (parentSelector, encomenda, onChange) => {
        const btnTxt = encomenda.show ? `hide` : `show`;
        $(parentSelector).find('strong').remove();
        $(parentSelector).append(`
            <div id="encomenda">
                <input type="text" name="alias" placeholder="Nome encomenda" />
                <button type="button">${btnTxt}</button>
            </div>
        `);
        $(parentSelector).append(`<strong style="text-align: right;color: #6eaf2c;">${ encomenda.id }</strong>`);
        const input = $('#encomenda').find('input[name="alias"]');
        $(input).val(encomenda.name);
        $(input).on('change', (e) => {
            encomenda.name = e.target.value;
            console.log('name changed to', e.target.value);
            onChange(encomenda);
        });
        const btnShow = $('#encomenda').find('button');
        $(btnShow).on('click', () => {
            encomenda.show = !encomenda.show;
            $(btnShow).text(encomenda.show ? `hide` : `show`);
            onChange(encomenda);
        });
    };

    const renderEncomendasList = (parent, encomendas, onUpdate) => {
        const codigos = Object.keys(encomendas);
        if (!codigos.length) {
            return;
        }
        $(parent).find('.lista-encomendas').remove();
        const listEncomendas = $(`
            <div class="lista-encomendas" ></div>
        `);

        let hasList = false;
        codigos.forEach(id => {
            if (encomendas[id].show) {
                if (!hasList) {
                    hasList = true;
                    $(parent).append(listEncomendas);
                }
               $(listEncomendas).append(`
                <div class="item-encomenda" >
                    <a class="encomenda" target="_blank" href="/pacotes/${id}/detalhes/" id="${id}">${ encomendas[id].name || id }</a>
                    <span
                        class="close-icon"
                        close-id="${id}" >X</span>
                </div>
               `);
            }
        });
        $(listEncomendas).find('.close-icon').on('click', (e) => {
            const id = $(e.target).attr('close-id');
            encomendas[id].show = false;
            onUpdate();
        });
        $(listEncomendas).find('.encomenda').on('click', (e) => {
            $('#pesquisaPub').val($(e.target).attr('id'));
        });
    };
    const saveEncomendas = (encomendas) => {
        localStorage.setItem('encomendas', JSON.stringify(encomendas));
    };
    try {
        const encomendas = JSON.parse((localStorage.getItem('encomendas') || '{}'));
        const currenPath = window.location.pathname;
        const encomendaExp = /pacotes\/(.*)\/detalhes/i;
        if (encomendaExp.test(currenPath)) {
            const [, codigo] = encomendaExp.exec(currenPath);
            if (!encomendas[codigo] || !encomendas[codigo].id) {
                encomendas[codigo] = {
                    id: codigo,
                    name: codigo,
                    show: true
                };
            }
            const encomendaAtual = encomendas[codigo];
            addForm('.pacote-header', encomendaAtual, (updated) => {
                encomendas[updated.id] = {...updated};
                saveEncomendas(encomendas);
            })
            saveEncomendas(encomendas);
        } else {
            console.log('encomendas salvas', encomendas);
            const divParent = $('#formPesquisaPublica').parent();
            $(divParent).css({
                'position': 'relative'
            });
            const onUpdate = () => {
                saveEncomendas(encomendas);
                renderEncomendasList(divParent, encomendas, onUpdate);
            };
            renderEncomendasList(divParent, encomendas, onUpdate);
        }

    } catch (err) {
    }
    // Your code here...
})();