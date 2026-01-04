// ==UserScript==
// @name         TrophyManager - Filtrar por Faixa de Estrelas
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Filtra jogadores com base na faixa de estrelas selecionada, expandindo histórias ocultas automaticamente.
// @author       Kraft.F.C
// @match        https://trophymanager.com/home/*
// @match        https://trophymanager.com/league/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523131/TrophyManager%20-%20Filtrar%20por%20Faixa%20de%20Estrelas.user.js
// @updateURL https://update.greasyfork.org/scripts/523131/TrophyManager%20-%20Filtrar%20por%20Faixa%20de%20Estrelas.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Função para expandir todas as histórias semelhantes
    function expandirTodasAsHistorias(callback) {
        // Seleciona todos os botões "Show similar stories"
        const botoesMostrar = document.querySelectorAll(".similar_stories_show");

        if (botoesMostrar.length === 0) {
            console.log("Nenhuma história para expandir.");
            callback();
            return;
        }

        let botoesRestantes = botoesMostrar.length;

        botoesMostrar.forEach(botao => {
            botao.click(); // Simula o clique no botão
            botoesRestantes--;

            // Quando todos os botões forem clicados, executa o callback
            if (botoesRestantes === 0) {
                console.log("Todas as histórias semelhantes foram expandidas.");
                setTimeout(callback, 1000); // Aguarda o carregamento antes de chamar o callback
            }
        });
    }

    // Função para filtrar jogadores com base nas estrelas
    function filtrarJogadores() {
        // Obtém os valores mínimo e máximo do filtro
        const estrelasMin = parseFloat(document.getElementById("estrelasMin").value);
        const estrelasMax = parseFloat(document.getElementById("estrelasMax").value);

        // Seleciona todos os posts com jogadores
        const posts = document.querySelectorAll("#feed .feed_post");

        posts.forEach(post => {
            // Conta as estrelas no post
            const estrelas = post.querySelectorAll("img[src='/pics/star_green.png']").length;
            const meiaEstrela = post.querySelector("img[src='/pics/half_star_green.png']") ? 0.5 : 0;
            const totalEstrelas = estrelas + meiaEstrela;

            // Exibe ou oculta o post com base no filtro
            if (totalEstrelas >= estrelasMin && totalEstrelas <= estrelasMax) {
                post.style.display = "block"; // Exibe
            } else {
                post.style.display = "none"; // Oculta
            }
        });

        console.log(`Filtro aplicado: ${estrelasMin} a ${estrelasMax} estrelas.`);
    }

    // Função para criar o painel de filtro
    function criarPainelFiltro() {
        const painel = document.createElement("div");
        painel.style.position = "fixed";
        painel.style.bottom = "10px";
        painel.style.right = "10px";
        painel.style.backgroundColor = "#28a745";
        painel.style.border = "1px solid #ccc";
        painel.style.padding = "10px";
        painel.style.borderRadius = "5px";
        painel.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
        painel.innerHTML = `
            <label style="font-weight: bold; display: block; margin-bottom: 5px;">Filtrar por Estrelas</label>
            <label>Estrelas Mínimas:
                <select id="estrelasMin">
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                    <option value="3.5">3.5</option>
                    <option value="4" selected>4</option>
                    <option value="4.5">4.5</option>
                    <option value="5">5</option>
                </select>
            </label>
            <label>Estrelas Máximas:
                <select id="estrelasMax">
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                    <option value="3.5">3.5</option>
                    <option value="4">4</option>
                    <option value="4.5">4.5</option>
                    <option value="5" selected>5</option>
                </select>
            </label>
            <button id="btnFiltrar" style="margin-top: 10px; padding: 5px 10px; border: none; background-color: #28a745; color: white; border-radius: 3px; cursor: pointer;">Filtrar</button>
        `;
        document.body.appendChild(painel);

        // Adiciona o evento de clique ao botão de filtrar
        document.getElementById("btnFiltrar").addEventListener("click", () => {
            expandirTodasAsHistorias(filtrarJogadores);
        });
    }

    // Cria o painel de filtro quando a página carrega
    window.addEventListener("load", criarPainelFiltro);
})();
