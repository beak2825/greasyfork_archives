// ==UserScript==
// @name         StatusInvest Portal -> Ações/BDRs
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Adicionar informações importantes no portal StatusInvest, como o preço justo das ações
// @author       @josias-soares
// @match        https://statusinvest.com.br/acoes/*
// @match        https://statusinvest.com.br/bdrs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=statusinvest.com.br
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/477724-cachefunctions/code/CacheFunctions.js
// @require      https://greasyfork.org/scripts/477957-statusinvestfunctions/code/statusInvestFunctions.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451327/StatusInvest%20Portal%20-%3E%20A%C3%A7%C3%B5esBDRs.user.js
// @updateURL https://update.greasyfork.org/scripts/451327/StatusInvest%20Portal%20-%3E%20A%C3%A7%C3%B5esBDRs.meta.js
// ==/UserScript==
var typeStock = document.querySelector("#main-header > div:nth-child(2) > div > div:nth-child(1) > div > ol > li:nth-child(2) > a > span").innerText

var SELIC = 10.27 //18-10-2023

// Função para fazer buscar SELIC
// Função para fazer a solicitação GET e extrair o valor numérico
async function atualizarSelic() {
    const SELIC_KEY_VALUE = "SELIC_KEY_VALUE"
    const SELIC_KEY_DATA = "SELIC_KEY_DATA"

    // deletarChaveDoCache(SELIC_KEY_DATA)

    const data_selic_cache = buscarDoCache(SELIC_KEY_DATA)
    console.log(`data_selic_cache: ${data_selic_cache}`);

    const dias = calcularDiasDecorridos(data_selic_cache) * -1;
    console.log(`Dias decorridos: ${dias < 7} - ${dias} dias`);

    const selic = buscarDoCache(SELIC_KEY_VALUE)
    if (selic != null && data_selic_cache != null && dias < 7) {
        console.log("usar Selic CACHE:" + selic);
        SELIC = selic
    } else {
        const url = `https://investidor10.com.br/indices/`;

        new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        console.log("atualizarSelic: response.status === 200");

                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const elemento = doc.querySelector("#indices-grid > a:nth-child(3) > div.body > p > strong")

                        console.log("atualizarSelic: elemento" + elemento);
                        if (elemento) {
                            const texto = elemento.textContent.trim();
                            console.log("atualizarSelic: texto" + texto);
                            const valorNumerico = parseFloat(texto.replace(",", ".")); // Remover caracteres não numéricos e converter para número
                            if (!isNaN(valorNumerico)) {
                                salvarNoCache(SELIC_KEY_VALUE, valorNumerico)
                                salvarNoCache(SELIC_KEY_DATA, getDataHojeFormatada())
                                SELIC = valorNumerico
                                console.log("atualizarSelic:" + valorNumerico);
                                resolve(valorNumerico);
                            } else {
                                salvarNoCache(SELIC_KEY_DATA, getDataHojeFormatada())
                                salvarNoCache(SELIC_KEY_VALUE, 0)
                                SELIC = 0
                                console.log("atualizarSelic:" + valorNumerico);
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

var values = document.getElementsByClassName("top-info has-special d-flex justify-between flex-wrap")[0]
var elmNewContent = document.createElement('div');


var VPA = parseFloat(document.getElementsByClassName('w-50 w-sm-33 w-md-25 w-lg-16_6 mb-2 mt-2 item')[8].getElementsByClassName('value d-block lh-4 fs-4 fw-700')[0].innerText.replace(',', '.'))
var LPA = parseFloat(document.getElementsByClassName('w-50 w-sm-33 w-md-25 w-lg-16_6 mb-2 mt-2 item')[10].getElementsByClassName('value d-block lh-4 fs-4 fw-700')[0].innerText.replace(',', '.'))

var ticket = document.querySelector("#main-2 > div.tab-nav-resume > div > div > ul > li:nth-child(1) > a").innerText
console.log('ticket: ' + ticket)

// DY
var dyYear = document.getElementsByClassName('info w-50 w-lg-20')[2].getElementsByClassName('value')[0].innerText.replace(',', '.');
var dyMensal = 0.0

console.log('dyYear: ' + dyYear)

if (dyYear != "-" && parseFloat(dyYear) > 0) {
    dyMensal = parseFloat(dyYear) / 12;
}


// PVP
var pVpElem = document.getElementsByClassName("indicator-today-container")[0].getElementsByClassName("d-flex flex-wrap align-items-center justify-start")[0].getElementsByClassName("w-50 w-sm-33 w-md-25 w-lg-16_6 mb-2 mt-2 item")[3].getElementsByClassName("value d-block lh-4 fs-4 fw-700")[0].innerText
var pvpValue = parseFloat(pVpElem.replace(",", "."))
var pvpColor = "White"
var pvpStatus = "NORMAL"

if (pvpValue > 2.50) {
    pvpColor = "Red"
    pvpStatus = "FOJE"
} else if (pvpValue > 2.0) {
    pvpColor = "Yellow"
    pvpStatus = "CARO"
} else if (pvpValue > 1.5) {
    pvpColor = "DarkKhaki"
    pvpStatus = "VALORIZADO"
} else if (pvpValue < 1) {
    pvpColor = "Lime"
    pvpStatus = "BARATO"
} else if (pvpValue < 0) {
    pvpColor = "LightCoral"
    pvpStatus = "RISCO"
}

// Type Company
// https://statusinvest.com.br/indices/indice-small-cap
try {
    var valueCompanyElem = document.querySelector("#company-section > div:nth-child(1) > div > div.top-info.info-3.sm.d-flex.justify-between.mb-3 > div:nth-child(7) > div > div > strong").innerText.replaceAll(".", "")
    var valueCompany = parseFloat(valueCompanyElem) / 5.00
    var typeCompany = "Small Cap"

    console.log(valueCompany)
    console.log(valueCompanyElem)

    var millions_300 = 300000000
    var billions_3 = 3000000000
    var billions_10 = 10000000000
    if (valueCompany < millions_300) {
        typeCompany = "Small Cap (-)"
    } else if (valueCompany <= billions_3) {
        typeCompany = "Small Cap"
    } else if (valueCompany <= billions_10) {
        typeCompany = "Mid Cap"
    } else {
        typeCompany = "Large Cap"
    }
} catch (e) {
    typeCompany = "-"
    console.log(e)
}

// Função para extrair tag along e armazenar em cache
function extrairTagAlong() {
    const ativo = ticket.toUpperCase()

    // Seletor a ser observado
    const selector = "#main-2 > div:nth-child(4) > div > div.mb-5 > div > div > div:nth-child(2) > div > div > div > strong";

    // Função para extrair e formatar o valor
    function extrairEFormatarValor() {
        const elemento = document.querySelector(selector);
        if (elemento) {
            const texto = elemento.textContent.trim();
            const valorNumerico = parseFloat(texto.replace(/[^\d.-]/g, "")); // Remover caracteres não numéricos e converter para número
            if (!isNaN(valorNumerico)) {
                salvarNoCache(TAG_ALONG + ativo, valorNumerico)
                console.log("salvarNoCache Tag Along - " + ativo + ":" + valorNumerico);
            } else {
                salvarNoCache(TAG_ALONG + ativo, 0)
                console.log("salvarNoCache Tag Along - " + ativo + ":" + 0);
            }
        }
    }

    // Configurar um MutationObserver para observar mudanças no DOM
    const observer = new MutationObserver(function(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                extrairEFormatarValor();
            }
        }
    });

    // Iniciar a observação do seletor
    const elementoAlvo = document.querySelector(selector);
    if (elementoAlvo) {
        extrairEFormatarValor();
    } else {
        const config = {
            childList: true,
            subtree: true
        };
        observer.observe(document.body, config);
    }
}
extrairTagAlong()

//////////////////////////////// [1] Fórmula Benjamim Graham ////////////////////////////////////////////
function calcGraham_1() {
    var fairPrice = 0.00
    // VI = √ (22,5 x LPA x VPA)
    if (VPA >= 0 || LPA >= 0) {
        fairPrice = Math.sqrt(22.5 * LPA * VPA)
    }

    return fairPrice
}


//////////////////////////////// [2] Fórmula Benjamim Graham ////////////////////////////////////////////

var URL_PAYOUT = 'https://statusinvest.com.br/acao/payoutresult?code=' + ticket;

async function getPayout(url) {
    const response = await fetch(url);
    var data = await response.json();

    var json = JSON.stringify(data)
    //console.log('json ====>:'+ json);

    var payout = JSON.parse(json);

    try {
        await atualizarSelic();
        calcGraham_2(payout)
    } catch (error) {
        console.error("Tag Along ERROR: " + error);
    }
}


function calcGraham_2(payout) {
    console.log("typeStock " + typeStock)
    if (typeStock == "BDRs") {
        addElements(0.0)
        return
    }

    var roe = parseFloat(document.querySelector("#indicators-section > div.indicator-today-container > div > div:nth-child(4) > div > div:nth-child(1) > div > div > strong").innerText.replace(",", "."))

    // P/L Justo de 8,5x
    // Graham assumiu que uma ação sem crescimento deveria ser vendida na bolsa por um P/L Justo de 8,5x.
    // O que reflete um retorno médio de 11,76% ao ano. (NT o inverso de 8,5; ou seja, o L/P de 11,76% ao ano).
    // Como você pode ver Graham introduziu alguns qualificadores nessa equação.
    var PL_fair = 8.5
    var PL = parseFloat(document.querySelector("#indicators-section > div.indicator-today-container > div > div:nth-child(1) > div > div:nth-child(2) > div > div > strong").innerText.replace(',', '.'))

    var growthRate_G = 0

    try {
        growthRate_G = (roe * payout.actual) / 100
    } catch (e) {
        console.log(e)
    }

    console.log("roe:" + roe)
    console.log("payout:" + payout.actual)
    console.log("growthRate_G:" + growthRate_G)

    // EPSProj
    // São os lucros por ação projetados para a companhia no ano seguinte.
    // (pode ser estimado, por exemplo, multiplicando-se o EPS corrente por 1 + G).
    var EPSProj = LPA * (1 + growthRate_G)
    console.log("EPSProj:" + EPSProj)

    var growthRate = 4.4

    // P = EPS Proj* (5,5 + (2*G)) * (4,4/Selic)
    var fairPrice = LPA * (PL_fair + (2 * growthRate_G)) * (growthRate / SELIC)

    addElements(fairPrice)
}

function addElements(fairPriceBenjamin2) {
    var fairPriceBenjamin = calcGraham_1()

    var currentPrice = parseFloat(document.querySelector("#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div.info.special.w-100.w-md-33.w-lg-20 > div > div:nth-child(1) > strong").innerText.replace(',', '.'))

    var colorPrice1 = "White"
    if ((fairPriceBenjamin).toFixed(2) < currentPrice) {
        colorPrice1 = "Red"
    } else if ((fairPriceBenjamin).toFixed(2) > currentPrice) {
        colorPrice1 = "Lime"
    }

    var colorPrice2 = "White"
    if ((fairPriceBenjamin2).toFixed(2) < currentPrice) {
        colorPrice2 = "Red"
    } else if ((fairPriceBenjamin2).toFixed(2) > currentPrice) {
        colorPrice2 = "Lime"
    }

    elmNewContent.innerHTML = `<div class="top-info has-special d-flex justify-between flex-wrap">
<div class="info special w-100 w-md-33 w-lg-20" style="color: cyan">
<div class="d-md-inline-block">
<div title="Preço Justo (Fórmula Benjamim Graham)">
<h3 class="title m-0">Preço Justo (Graham)</h3>
<span class="icon"  style="color: ${colorPrice1}">R$</span>
<strong class="value" style="color: ${colorPrice1}">${(fairPriceBenjamin).toFixed(2)}</strong>
<span class="d-block fs-2 lh-1">VI = √ (22,5 x LPA x VPA)</span>
</div>
</div>
</div>

<div class="info special w-100 w-md-33 w-lg-20" style="color: cyan">
<div class="d-md-inline-block">
<div title="Preço Justo (Fórmula Benjamim Graham)  \nP/L Justo de 8,5x
    \nGraham assumiu que uma ação sem crescimento deveria ser vendida na bolsa por um P/L Justo de 8,5x.
    \nO que reflete um retorno médio de 11,76% ao ano. (NT o inverso de 8,5; ou seja, o L/P de 11,76% ao ano).">
<h3 class="title m-0">Preço Justo (Graham 2)</h3>
<span class="icon"  style="color: ${colorPrice2}">R$</span>
<strong class="value"  style="color: ${colorPrice2}">${(fairPriceBenjamin2).toFixed(2)}</strong>
<span class="d-block fs-2 lh-1">EPSProj*(5,5+(2*G))*(4,4/Selic)</span>
</div>
</div>
</div>

<div class="info special w-100 w-md-33 w-lg-20" style="color: orange">
<div class="d-md-inline-block">
<div title="DIVIDEND YIELD MONTH">
<h3 class="title m-0">DIVIDEND YIELD</h3>
<strong class="value">${(dyMensal).toFixed(3)}</strong>
<span class="icon">%</span>
<span class="d-block fs-2 lh-1">Mensal</span>
</div>
</div>
</div>

<div class="info special w-100 w-md-33 w-lg-20" style="color: ${pvpColor}">
<div class="d-md-inline-block">
<div title="P/VP">
<h3 class="title m-0">P/VP</h3>
<strong class="value">${pvpValue}</strong>
<span class="icon"></span>
<span class="d-block fs-2 lh-1">${pvpStatus}</span>
</div>
</div>
</div>


<div class="info special w-100 w-md-33 w-lg-20" style="color: yellow">
<div class="d-md-inline-block">
<div title="P/VP">
<h3 class="title m-0">Company Size</h3>
<strong class="value">${typeCompany}</strong>
<span class="icon"></span>
<span class="d-block fs-2 lh-1">-</span>
</div>
</div>
</div>

</div>`

    values.appendChild(elmNewContent)
}

getPayout(URL_PAYOUT)

// <table>
//    <tr>
//       <th>
//          <div class="bg-secondary white-text card w-100 w-md-45" style="background-color:green">
//             <div class="d-md-inline-block">
//                <div title="Preço Justo">
//                   <h3 class="title m-0">Fórmula de Benjamin Graham) </h3>
//                   </br>
//                   <h3 class="title m-0">VI = √ (22,5 x LPA x VPA)</h3>
//                   </br>
//                   <h3 class="title m-0">Preço Justo</h3>
//                   <span class="icon">R$</span><strong class="value"> ${(fairPriceBenjamin).toFixed(2)} </strong>
//                </div>
//             </div>
//          </div>
//       </th>
//       <th>
//          <div class="bg-secondary white-text card w-100 w-md-45" style="background-color:green">
//             <div class="d-md-inline-block">
//                <div title="Preço Justo">
//                   <h3 class="title m-0">Modelo de Gordon(Crescimento)</h3>
//                   </br>
//                   <form>
//                      K - Retorno esperado ANUAL das Ações (%)<input id="retorno" type="number" placeholder="0,00" min="0.01" max="1000" /><br />
//                      g - Taxa de crescimento ANUAL dos dividendos (%)<input id="crescimento-div" type="number" placeholder="0,00" min="0.01" max="1000"  /><br />
//                      <input id="buttonCalc" type="button" value="Calcular"/> <br />
//                   </form>
//                   <br>
//                   <h5 class="title m-0">Preço Justo = Dividendo / (K – g)</h5>
//                   </br>
//                   <span class="icon">R$</span><strong id="priceGordon" class="value"> 0,00</strong>
//                </div>
//             </div>
//          </div>
//       </th>
//    </tr>
// </table>


const button = document.getElementById('buttonCalc');
button.addEventListener("click", calcGordonValuation);

var fairPriceGordon = 0

function calcGordonValuation() {
    var crescimento_div = parseFloat(document.getElementById('crescimento-div').value.replace(',', '.'));
    crescimento_div = crescimento_div / 100
    var retorno = parseFloat(document.getElementById('retorno').value.replace(',', '.'));
    retorno = retorno / 100

    var currentDYElement = document.querySelector("#main-2 > div:nth-child(4) > div > div.pb-3.pb-md-5 > div > div:nth-child(4) > div > div.d-flex.justify-between > div > span.sub-value")
    var currentDY = parseFloat(currentDYElement.innerText.replace(',', '.').replace('R$ ', ''))

    const priceGordon = document.getElementById('priceGordon');

    console.log("Calculando.....")
    console.log("crescimento: " + crescimento_div)
    console.log("crescimento: " + retorno)
    console.log("currentDY: " + currentDY)

    var valTmp = retorno - crescimento_div

    if (valTmp <= 0) {
        valTmp = 1
    }

    fairPriceGordon = currentDY / valTmp


    console.log(fairPriceGordon)
    priceGordon.innerText = (fairPriceGordon).toFixed(2);
}

calcGordonValuation()