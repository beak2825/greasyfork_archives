// ==UserScript==
// @name         StatusInvest Portal -> Fiagro
// @namespace    http://tampermonkey.net/
// @version      0.02
// @description  Adicionar informações importantes no portal StatusInvest - FIAGRO
// @author       @josias-soares
// @match        https://statusinvest.com.br/fiagros/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=statusinvest.com.br
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/477724-cachefunctions/code/CacheFunctions.js
// @require      https://greasyfork.org/scripts/477957-statusinvestfunctions/code/statusInvestFunctions.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477960/StatusInvest%20Portal%20-%3E%20Fiagro.user.js
// @updateURL https://update.greasyfork.org/scripts/477960/StatusInvest%20Portal%20-%3E%20Fiagro.meta.js
// ==/UserScript==
var values = document.getElementsByClassName("top-info d-flex flex-wrap justify-between mb-3 mb-md-5")[0]

var elmNewContent = document.createElement('div');

// DIVIDENDOS
var dyYear = document.getElementsByClassName('info w-50 w-lg-20')[2].getElementsByClassName('value')[0].innerText.replace(',', '.')
var dyMensal = Math.sqrt(parseFloat(dyYear) / 12)
var dyMesAtual = document.getElementsByClassName('chart card white-text bg-main-gd w-100 w-md-45 ml-lg-5 mr-lg-5 mt-3 mb-3 mt-md-0 mb-md-0')[0].getElementsByClassName('sub-value fs-4 lh-3')[0].innerText

var precoAtual = document.getElementsByClassName('top-info d-flex flex-wrap justify-between mb-3 mb-md-5')[0].getElementsByClassName('value')[0].innerText.replace(',', '.')

var tipoFiagro = document.querySelector("#fund-section > div > div > div:nth-child(2) > div > div:nth-child(5) > div > div > div > strong").innerText

console.log("Fiagro:" + tipoFiagro)

var vlrProventoMes = (precoAtual * dyMesAtual.replace(',', '.')) / 100
var vlrProvento12Mes = (precoAtual * dyMensal) / 100

// PREÇO JUSTO - MODELO DE GORDON
// Preço = Dividendos por ação / (K – G)
var premio = 3.0;
var IPCA = 5.9; // https://www.tesourodireto.com.br/titulos/precos-e-taxas.htm
var preFixado = 11.5;
var crescEsperado = 1;

var taxa = 0


// Função para fazer buscar IPCA
// Função para fazer a solicitação GET e extrair o valor numérico
async function atualizarIPCA() {
    const IPCA_KEY_VALUE = "IPCA_KEY_VALUE"
    const IPCA_KEY_DATA = "IPCA_KEY_DATA"

    // deletarChaveDoCache(IPCA_KEY_DATA)

    const data_IPCA_cache = buscarDoCache(IPCA_KEY_DATA)
    console.log(`data_IPCA_cache: ${data_IPCA_cache}`);

    const dias = calcularDiasDecorridos(data_IPCA_cache) * -1;
    console.log(`Dias decorridos: atualizar:${dias == 7} - ${dias} dias`);

    const ipca = buscarDoCache(IPCA_KEY_VALUE)
    if (ipca != null && data_IPCA_cache != null && dias < 7) {
        console.log("usar IPCA CACHE:" + ipca);
        IPCA = ipca
    } else {
        const url = `https://investidor10.com.br/indices/`;

        new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        console.log("atualizarIPCA: response.status === 200");

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const elemento = doc.querySelector("#indices-grid > a:nth-child(2) > div.body > p:nth-child(2) > strong")

                        console.log("atualizarIPCA: elemento" + elemento);
                        if (elemento) {
                            const texto = elemento.textContent.trim();
                            console.log("atualizarIPCA: texto" + texto);
                            const valorNumerico = parseFloat(texto.replace(",", ".")); // Remover caracteres não numéricos e converter para número
                            if (!isNaN(valorNumerico)) {
                                salvarNoCache(IPCA_KEY_VALUE, valorNumerico)
                                salvarNoCache(IPCA_KEY_DATA, getDataHojeFormatada())

                                IPCA = valorNumerico
                                console.log("atualizarIPCA:" + valorNumerico);
                                resolve(valorNumerico);
                            } else {
                                salvarNoCache(IPCA_KEY_DATA, getDataHojeFormatada())
                                salvarNoCache(IPCA_KEY_VALUE, 0)
                                IPCA = 0
                                console.log("atualizarIPCA:" + valorNumerico);
                                resolve(0); // Retornar 0 se o valor não for numérico
                            }
                        } else {
                            reject("Seletor não encontrado!");
                        }
                    } else {
                        reject("Erro na solicitação GET: " + response.statusText);
                    }
                }
            });
        });
    }
}


async function calcularFiagro() {
    try {
        await atualizarIPCA()

        if (tipoFiagro == "Títulos e Valores Mobiliários") {
            taxa = preFixado
        } else {
            taxa = IPCA
        }

        var precoJustoMesAtual = (vlrProventoMes * 12) / (((taxa + premio) - crescEsperado) / 100)
        var precoJusto12Meses = (vlrProvento12Mes * 12) / (((taxa + premio) - crescEsperado) / 100)

        elmNewContent.innerHTML = `<div class="top-info has-special d-flex justify-between flex-wrap">

<div class="info special w-100 w-md-33 w-lg-20" style="color: cyan">
<div class="d-md-inline-block">
<div title="Preço Justo (MODELO DE GORDON)">
<h3 class="title m-0">Preço Justo</h3>
<span class="icon">R$</span>
<strong class="value">${(precoJustoMesAtual).toFixed(2)}</strong>
<span class="sub-value">Mês atual</span>
</div>
</div>
</div>

<div class="info special w-100 w-md-33 w-lg-20" style="color: GreenYellow">
<div class="d-md-inline-block">
<div title="Preço Justo (MODELO DE GORDON)">
<h3 class="title m-0">Preço Justo</h3>
<span class="icon">R$</span>
<strong class="value">${(precoJusto12Meses).toFixed(2)+"".replace('.', ',')}</strong>
<span class="sub-value">Últ. 12 meses</span>
</div>
</div>
</div>

<div class="info special w-100 w-md-33 w-lg-20" style="color: Magenta">
<div class="d-md-inline-block">
<div title="Média DY 12 meses">
<h3 class="title m-0">Valor DY dos últ. 12 M</h3>
<span class="icon">R$</span>
<strong class="value">${(vlrProvento12Mes).toFixed(2)+"".replace('.', ',')}</strong>
<span class="icon">/cota</span>
</div>
</div>
</div>

<div class="info special w-100 w-md-33 w-lg-20" style="color: yellow">
<div class="d-md-inline-block">
<div title="DIVIDEND YIELD MONTH">
<h3 class="title m-0">DIVIDEND YIELD</h3>
<strong class="value">${dyMesAtual+"".replace('.', ',')}</strong>
<span class="icon">%</span>
<span class="sub-value">Mês atual</span>
</div>
</div>
</div>
<div class="info special w-100 w-md-33 w-lg-20" style="color: orange">
<div class="d-md-inline-block">
<div title="DIVIDEND YIELD MONTH(12 M) ">
<h3 class="title m-0">DIVIDEND YIELD</h3>
<strong class="value">${(dyMensal).toFixed(2)+"".replace('.', ',')}</strong>
<span class="icon">%</span>
<span class="sub-value">Média últ. 12 meses</span>
</div>
</div>
</div>
</div>`

        values.appendChild(elmNewContent)
    } catch (error) {
        console.error("Tag Along ERROR: " + error);
    }
}
calcularFiagro()