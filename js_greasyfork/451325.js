// ==UserScript==
// @name         StatusInvest Carteira -> Ações/FIIs
// @namespace    http://tampermonkey.net/
// @version      0.37
// @description  Adicionar novas colunas com informações importantes na carteira do portal StatusInvest (ações - fiis - fiagros
// @author       @josias-soares
// @match        https://statusinvest.com.br/carteira/patrimonio
// @match        https://statusinvest.com.br/carteira/patrimonio?a=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=statusinvest.com.br
// @grant        GM_xmlhttpRequest
// @require      https://greasyfork.org/scripts/477724-cachefunctions/code/CacheFunctions.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451325/StatusInvest%20Carteira%20-%3E%20A%C3%A7%C3%B5esFIIs.user.js
// @updateURL https://update.greasyfork.org/scripts/451325/StatusInvest%20Carteira%20-%3E%20A%C3%A7%C3%B5esFIIs.meta.js
// ==/UserScript==

function GM_addStyle(cssStr) {
    var D = document;
    var newNode = D.createElement('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
    targ.appendChild(newNode);
}

function getIndexGroup(nameGroup) {
    //console.log("getIndexGroup: " + nameGroup);
    var groups = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul`).getElementsByClassName("group")

    for (var y = 0; y < groups.length; y++) {
        //let element = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul`).getElementsByClassName("group")
        if (groups[y].textContent.includes(nameGroup)) {
            //console.log("getIndexGroup: " + (y + 1));
            return y + 1

        }
    }
}

function salvarAtivoNoCache(ativo, data, dyMensal, dyAnual, yocAnual, pvp) {
    // Criar o objeto com os parâmetros fornecidos
    const objetoParaSalvar = {
        "create_date": data.toISOString(),
        "dy_mensal": dyMensal,
        "dy_anual": dyAnual,
        "yoc_anual": yocAnual,
        "pvp": pvp
    };

    // Converter o objeto para JSON
    const objetoJSON = JSON.stringify(objetoParaSalvar);

    // Salvar no cache do navegador usando localStorage
    localStorage.setItem(ativo, objetoJSON);
}

function obterAtivoDoCache(ativo) {
    // Obter a string JSON do cache
    const objetoJSON = localStorage.getItem(ativo);

    // Verificar se há algo no cache
    if (objetoJSON) {
        // Converter a string JSON de volta para um objeto JavaScript
        const objetoDoCache = JSON.parse(objetoJSON);

        // Extrair os valores do objeto e armazenar em variáveis
        const createDate = new Date(objetoDoCache.create_date);
        const dyMensal = objetoDoCache.dy_mensal;
        const dyAnual = objetoDoCache.dy_anual;
        const yocAnual = objetoDoCache.yoc_anual;
        const pvp = objetoDoCache.pvp;

        // Retornar as variáveis ou fazer o que for necessário com elas
        return {
            createDate,
            dyMensal,
            dyAnual,
            yocAnual,
            pvp
        };
    } else {
        // Caso não haja nada no cache
        console.log("Nenhum objeto " + ativo + " encontrado no cache.");
        return null;
    }
}

function salvarYOCMedioAtivoNoCache(key, yocMedio) {
    console.log(`salvarYOCMedioAtivoNoCache : ${yocMedio}`)
    // Criar o objeto com os parâmetros fornecidos
    const dateNow = new Date();

    const objetoParaSalvar = {
        "create_date": dateNow.toISOString(),
        "yoc_medio": yocMedio
    };

    // Converter o objeto para JSON
    const objetoJSON = JSON.stringify(objetoParaSalvar);

    // Salvar no cache do navegador usando localStorage
    localStorage.setItem(key, objetoJSON);
}

function obterYOCMedioAtivoDoCache(key) {
    // Obter a string JSON do cache
    const objetoJSON = localStorage.getItem(key);

    // Verificar se há algo no cache
    if (objetoJSON) {
        // Converter a string JSON de volta para um objeto JavaScript
        const objetoDoCache = JSON.parse(objetoJSON);

        // Extrair os valores do objeto e armazenar em variáveis
        const createDate = new Date(objetoDoCache.create_date);
        const yocMedio = parseFloat(objetoDoCache.yoc_medio);

        console.log("obterYOCMedioAtivoDoCache: " + yocMedio);
        // Retornar as variáveis ou fazer o que for necessário com elas
        return {
            createDate,
            yocMedio
        };
    } else {
        // Caso não haja nada no cache
        console.log("Nenhum YOCMedio: " + key + " encontrado no cache.");
        return null;
    }
}

function diferencaEmHoras(dataCache, qtd) {
    // Obter a data atual
    const dataAtual = new Date();
    //console.log("dataAtual: "+dataAtual);
    //console.log("dataCache: "+dataCache);

    // Calcular a diferença em milissegundos
    const diferencaEmMilissegundos = Math.abs(dataAtual - dataCache);

    // Converter a diferença para horas
    const diferencaEmHoras = diferencaEmMilissegundos / (1000 * 60 * 60);

    // Retornar verdadeiro se a diferença for maior que 5 horas, caso contrário, falso
    const diferenca = diferencaEmHoras > qtd
    //console.log("diferencaEmHoras: > "+qtd + " = "+ diferenca);
    return diferenca;
}

// Função para fazer a solicitação GET e extrair o valor numérico
async function extrairTagAlong(ativo) {
    const tagAlongCache = buscarDoCache(TAG_ALONG + ativo)

    //deletarChaveDoCache(TAG_ALONG+ativo)
    if (tagAlongCache != null) {
        console.log("Tag Along CACHE - " + ativo + ":" + tagAlongCache);
        return tagAlongCache
    } else {
        const url = `https://statusinvest.com.br/acoes/${ativo}`;
        const seletor = "#main-2 > div:nth-child(4) > div > div.mb-5 > div > div > div:nth-child(2) > div > div > div > strong";

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, "text/html");
                        const elemento = doc.querySelector(seletor);

                        if (elemento) {
                            const texto = elemento.textContent.trim();
                            const valorNumerico = parseFloat(texto.replace(/[^\d.-]/g, "")); // Remover caracteres não numéricos e converter para número
                            if (!isNaN(valorNumerico)) {
                                salvarNoCache(TAG_ALONG + ativo, valorNumerico)
                                console.log("Tag Along - " + ativo + ":" + valorNumerico);
                                resolve(valorNumerico);
                            } else {
                                salvarNoCache(TAG_ALONG + ativo, 0)
                                console.log("Tag Along - " + ativo + ":" + valorNumerico);
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

async function extrairPVP_Fiagro(ativo) {
    const url = `https://statusinvest.com.br/fiagros/${ativo}`;
    const seletor = "#main-2 > div.container.pb-7 > div.mb-5.mt-5 > div > div:nth-child(2) > div > div:nth-child(1) > strong";

    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, "text/html");
                    const elemento = doc.querySelector(seletor);

                    if (elemento) {
                        const texto = elemento.textContent.trim();
                        resolve(texto);
                        //const valorNumerico = parseFloat(texto.replace(/[^\d.-]/g, "")); // Remover caracteres não numéricos e converter para número
                        //if (!isNaN(valorNumerico)) {
                        //    resolve(valorNumerico);
                        //} else {
                        //    resolve(0); // Retornar 0 se o valor não for numérico
                        //}
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

function getPVP_Color(pVP) {
    var pvpColor = "white"

    if (pVP > 2.0) {
        pvpColor = "backgroundRed"
    } else if (pVP > 1.5) {
        pvpColor = "backgroundOrange"
    } else if (pVP > 1.1) {
        pvpColor = "backgroundYellow"
    } else if (pVP >= 1) {
        pvpColor = "backgroundWhite"
    } else {
        pvpColor = "backgroundGreen"
    }

    return pvpColor
}

function getTAG_Along_Color(tag) {
    var pvpColor = "backgroundRed"

    if (tag == 0) {
        pvpColor = "backgroundRed"
    } else if (tag <= 80) {
        pvpColor = "backgroundOrange"
    } else if (tag > 80) {
        pvpColor = "backgroundGreen"
    } else {
        pvpColor = "backgroundNeutral"
    }

    return pvpColor
}

function getDY_MonthColor(dyPercent) {
    var color
    if (dyPercent <= 0) {
        color = "textRed"
    } else if (dyPercent < 0.3) {
        color = "textOrange"
    } else if (dyPercent < 0.7) {
        color = "textYellow"
    } else if (dyPercent < 0.99) {
        color = "textBlue"
    } else {
        color = "textGreen"
    }
    return color
}

function getClassNameOfRecommendation(rating) {
    var className = "backgroundWhite"

    if (rating === "buy") className = "buyColor"
    else if (rating === "overweight") className = "overweightColor"
    else if (rating === "hold") className = "holdColor"
    else if (rating === "underweight") className = "underweightColor"
    else if (rating === "sell") className = "sellColor"

    return className
}

// Função para calcular o novo preço médio
function calcularNovoPrecoMedio(qtdAtual, precoMedioAtual, precoAtual, qtdAdicional) {
    return (((qtdAtual * precoMedioAtual) + (qtdAdicional * precoAtual)) / (qtdAtual + qtdAdicional)).toFixed(2);
}

var firstOpen = true
// Função para criar e exibir o diálogo
function abrirCalcNovoPm(qtdAtual, precoMedioAtual, precoAtual) {
    if (firstOpen) return
    console.log("abrirCalcNovoPm" + firstOpen)

    // Cria o container do diálogo
    var dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.padding = '20px';
    dialog.style.backgroundColor = 'white';
    dialog.style.border = '1px solid black';
    dialog.style.zIndex = '10000';

    // Cria o formulário
    var form = document.createElement('form');

    // Campo para quantidade atual
    var labelQtdAtual = document.createElement('label');
    labelQtdAtual.textContent = 'Quantidade Atual:';
    form.appendChild(labelQtdAtual);
    form.appendChild(document.createElement('br'));

    var inputQtdAtual = document.createElement('input');
    inputQtdAtual.type = 'number';
    inputQtdAtual.value = qtdAtual;
    inputQtdAtual.disabled = true;
    form.appendChild(inputQtdAtual);
    form.appendChild(document.createElement('br'));

    // Campo para preço médio atual
    var labelPrecoMedioAtual = document.createElement('label');
    labelPrecoMedioAtual.textContent = 'Preço Médio Atual:';
    form.appendChild(labelPrecoMedioAtual);
    form.appendChild(document.createElement('br'));

    var inputPrecoMedioAtual = document.createElement('input');
    inputPrecoMedioAtual.type = 'number';
    inputPrecoMedioAtual.value = precoMedioAtual.toFixed(2);
    inputPrecoMedioAtual.disabled = true;
    form.appendChild(inputPrecoMedioAtual);
    form.appendChild(document.createElement('br'));

    // Campo para preço atual
    var labelPrecoAtual = document.createElement('label');
    labelPrecoAtual.textContent = 'Preço Atual:';
    form.appendChild(labelPrecoAtual);
    form.appendChild(document.createElement('br'));

    var inputPrecoAtual = document.createElement('input');
    inputPrecoAtual.type = 'number';
    inputPrecoAtual.value = precoAtual;
    inputPrecoAtual.disabled = true;
    form.appendChild(inputPrecoAtual);
    form.appendChild(document.createElement('br'));

    // Campo para quantidade adicional
    var labelQtdAdicional = document.createElement('label');
    labelQtdAdicional.textContent = 'Quantidade Comprada:';
    form.appendChild(labelQtdAdicional);
    form.appendChild(document.createElement('br'));

    var inputQtdAdicional = document.createElement('input');
    inputQtdAdicional.type = 'number';
    inputQtdAdicional.min = '0';
    inputQtdAdicional.required = true;
    form.appendChild(inputQtdAdicional);
    form.appendChild(document.createElement('br'));

    // Botão de submit
    var submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = 'Calcular Novo Preço Médio';
    form.appendChild(submitButton);

    // Campo para exibir o resultado
    var vlrCompra = document.createElement('div');
    vlrCompra.style.marginTop = '20px';
    form.appendChild(vlrCompra);

    var qtdTotal = document.createElement('div');
    qtdTotal.style.marginTop = '20px';
    form.appendChild(qtdTotal);

    var resultado = document.createElement('div');
    resultado.style.marginTop = '2px';
    form.appendChild(resultado);

    // Adiciona o evento de submit no formulário
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var qtdAdicional = parseInt(inputQtdAdicional.value);
        var novoPrecoMedio = calcularNovoPrecoMedio(qtdAtual, precoMedioAtual, precoAtual, qtdAdicional);
        vlrCompra.textContent = `Novo Valor Investido: ${(precoAtual*qtdAdicional).toFixed(2)}`;
        qtdTotal.textContent = `Nova Quantidade: ${qtdAtual+qtdAdicional}`;
        resultado.textContent = `Novo Preço Médio: R$ ${novoPrecoMedio}`;
    });

    // Adiciona o formulário ao diálogo
    dialog.appendChild(form);

    // Adiciona o diálogo ao corpo do documento
    document.body.appendChild(dialog);

    // Função para fechar o diálogo ao clicar fora dele
    function fecharDialogo(event) {
        if (!dialog.contains(event.target)) {
            document.body.removeChild(dialog);
            document.removeEventListener('click', fecharDialogo);
        }
    }

    // Adiciona o evento para fechar o diálogo
    setTimeout(() => {
        document.addEventListener('click', fecharDialogo);
    }, 0);
}

// Função para calcular a quantidade de ativos necessários
function calcularQuantidadeAtivos(qtdAtual, precoMedioAtual, precoAtual) {
    // Calcula a quantidade de ativos necessários para que o preço médio seja menor que o preço atual
    let qtdAdicional = 0;
    let novoPrecoMedio = 0;

    do {
        qtdAdicional++;
        novoPrecoMedio = calcularNovoPrecoMedio(
            qtdAtual,
            precoMedioAtual,
            precoAtual,
            qtdAdicional
        );
    } while (parseFloat(novoPrecoMedio) > (precoAtual));

    // Exibe os resultados
    console.log('Preço atual: R$ ' + precoAtual);
    console.log('Novo preço médio: R$ ' + novoPrecoMedio);
    console.log('Quantidade atual: R$ ' + qtdAtual);
    console.log(
        'Quantidade de ativos necessários para que o preço médio seja igual que o preço atual: ' +
        qtdAdicional
    );
    console.log('Novo preço médio após a compra: R$ ' + novoPrecoMedio);

    return Math.ceil(qtdAdicional); // Arredonda para o próximo número inteiro
}

GM_addStyle(`
    .pvpButton {
      border-radius: 3px;
      padding-right: 3px;
      padding-left: 3px;
      height: 22px;
    }

    .tagButton {
      border-radius: 10px;
      padding-right: 10px;
      padding-left: 10px;
      height: 22px;
    }

    .backgroundGreen {
      background: #00cc66;
    }

    .backgroundNeutral {
      background: #d3d3d3;
    }

    .backgroundRed {
      background: #ff0000;
    }
    .backgroundOrange {
      background: #FFA500;
    }
    .backgroundYellow {
      background: #ffff00;
    }
    .backgroundWhite {
      background: #fff;
    }

    .textGreen {
      color: #00cc66;
    }
    .textBlue {
      color: #1E90FF;
    }
    .textRed {
      color: #ff0000;
    }
    .textOrange {
      color: #FFA500;
    }
    .textYellow {
      color: #ffff00;
    }
    .textWhite {
      color: #fff;
    }
    .textCyan {
      color: #00FFFF;
    }
    .recommendationButton {
      border-radius: 3px;
      padding-right: 3px;
      padding-left: 3px;
      height: 22px;
    }

    .buyColor {
      background: #008e8a;
    }
    .overweightColor {
      background: #00bf75;
    }
    .holdColor {
      background: #fddf57;
    }
    .underweightColor {
      background: #ffa74d;
    }
     .sellColor {
      background: #fe4640;
    }

`);

function createCellCalcPm(cell, row) {

    let elementoPm = row.querySelector("[data-key='unitValue']");
    let precoMedioAtual = parseFloat(elementoPm.title);
    let precoAtual = parseFloat(row.querySelector("[data-key='price']").title);
    let qtdAtual = parseFloat(row.querySelector("[data-key='quantity']").title);

    // String base64 da imagem PNG
    var base64String = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAsQAAALEBxi1JjQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjY
    XBlLm9yZ5vuPBoAAAOYSURBVEiJpZZbbBRVHMZ/Zy57625ne6WXrU2laErBUqxttSZeoFUxxlQMPplIYgw+GBIpMWAENCQ2bWziE6hNNDEmGoo8EBJqIggmtCwlDasrRsSW0lpTGwq0e+3OjA/rZbuzbLf4vZ3/OfP9zpn8vzMj
    SJPP53M6FeUB3ZA86XPZJEvGfCSRCExOTkZS60rqoK6urrXAW3ykobnNqdpUeSWAxXhcv+Q/F9Fc2tbgL0F/RoCmFXz65sE+37H+AyRiCyvxR3V42HWwj963d34GrM0IcDjytB+GTvLqk6d4fGMk3SOjTo248AftbLg/zvBQCw5Hn
    jd1XkodCCGEYcRw2s2cd/7R1xpOu8nlMRXDiCGEEHcE3I1UxeTqlIrLkXlTSnrB7irgwmU3iYTItN6ibZsX+P1PmbiuYncVLA9o79zO4FGD41dncgIAIMDtXUVH53a+PTGYHeBwuXj+5TdyN19GFkBg5Dwf9vYi2fMBKC/20LXvAF07
    XiMm5QFgN0J8cPgTuve/w+TMPAggPk/XnreWB4z4R7jZsBcqHwZAH3yJ62O/8ofWxrXqHQBUXzvMxNgVJqbnCGzoB8A5e4HzQ/50O2sXqYoMejQ5ME0wE0iSjPxPDZD1KJIkg5kAkt0j9CiqKoMQSzwtJ9j8zBaCPd2Ex/sRQEv7Jlb
    X1dO0aoDyK8kTVFZUULt2HR0dm8g/9zom4HI5eerZPYx+/42cFeAtKqKptYVweBEhYH3Demw2O82tDzE1PQuAr7wEVbXR2LiO/NhtwET2ePAWFoNQlKyA4wNfceSijl7aCMDp7vfZ+967fPzlaa6XbgWg6swANWtq+X
    zfbnbOzgHwoyxzMqFjSootKyC0EMYoa0NUtCYLP7mJRcLE3PcSKWkBIBYeJRoOk4eg2UwGUtF1TszeJj2eFoCvqhLPxS8w5kYRGNiJUlhShnZjmGrZAYB2Y5ii0hfSHyUUt9481iQ/10nN6lpCCwsIATVrXsTj9dLT18PM9BQApeVbKPPdYzHLpJyDtn/3LkvQ7gqwkqDlcqkveWmmaZq5Bi28qBA1+BcSAVBsIJZyl5wgFg3dbH20rTx
    46NAdg2YYAm9JBYmijVQ9sY1X/MnbU3a5ebDlaX4OfHcr1XNJV9XfV9+sFRUebXrkMYdb80o6Qhgmkm5KUlxX1LguqaalEf/eXOgWvwXOhuZmJtqDwf8++pbV/+e3ZREujY+PR1PrfwGVb1kcwLnVmwAAAABJRU5ErkJggg==`
    // Decodificar a string base64
    var imgCalc = new Image();
    imgCalc.src = base64String;

    var botao = document.createElement('button');

    botao.appendChild(imgCalc);

    // Chama a função para mostrar o diálogo com os valores iniciais
    if (botao) {
        const mostrar = abrirCalcNovoPm(qtdAtual, precoMedioAtual, precoAtual)
        botao.addEventListener('click',
            function() {
                abrirCalcNovoPm(qtdAtual, precoMedioAtual, precoAtual)
            });
    }
    cell.appendChild(botao); // append DIV to the table cell
}

function createCell(cell, text, symbol, color, tooltip) {
    var textFormated = text

    try {
        textFormated = text.replace(".", ",")
    } catch {}


    var dataKey = ""

    if (symbol == "R$") {
        textFormated = symbol + " " + textFormated
        dataKey = "unit"
    } else if (symbol == "pvp") {
        textFormated = textFormated
        dataKey = "unit"
    } else if (symbol == "tag") {
        textFormated = textFormated
        dataKey = "unit"
    } else if (symbol == "rating") {
        textFormated = textFormated
        dataKey = "unit"
    } else {
        textFormated = textFormated + symbol
        dataKey = "categoryPercent"
    }


    var div = document.createElement('div')

    div.setAttribute('title', tooltip);

    if (symbol == "rating") {
        div.setAttribute('class', `w-100 text-right undefined`);
    } else {
        div.setAttribute('class', `text-right undefined`);
    }


    var clazz = `${color}`
    var style = ""
    if (symbol == "pvp") {
        clazz = `pvpButton ${color}`
        style = ` text-align:center; color: black`
    } else if (symbol == "tag") {
        clazz = `tagButton ${color}`
        style = ` text-align:center; color: black`
    } else if (symbol == "rating") {
        clazz = `recommendationButton ${color}`
        style = `width: 100px; text-align:center; color: black`
        dataKey = ""
    }

    div.innerHTML = `<span class="truncate ${clazz}" style="${style}">${textFormated}</span>`

    div.setAttribute('data-key', dataKey);

    cell.appendChild(div); // append DIV to the table cell
}

var objYieldOnCost
var totalYieldOnCoastAVG_acao = 0
var somaTotalDaAcao = 0

var totalYieldOnCoastAVG_fiis = 0
var somaTotalDaFiis = 0

var totalYieldOnCoastAVG_fiagro = 0
var somaTotalDaFiagro = 0

function getYocByActive(ativo, tipo, totalAmount) {
    var idxTipo
    var yieldOnCost = 0.00

    try {
        for (var z = 0; z < objYieldOnCost.data.length; z++) {
            if (objYieldOnCost.data[z].categoryName.toLowerCase() == tipo.toLowerCase()) {
                idxTipo = z
            }
        }
        var ativoYOC_List = objYieldOnCost.data[idxTipo].assets

        for (var idx = 0; idx < ativoYOC_List.length; idx++) {
            if (ativoYOC_List[idx].code.toLowerCase() == ativo.toLowerCase()) {
                yieldOnCost = ativoYOC_List[idx].yieldOnCost
                //console.log(`getYocByActive - Yield On Cost: ${ativo} = ${yieldOnCost} tipo= ${tipo}`)


                if (yieldOnCost.toFixed(2) > 0) {
                    if (tipo == "Ações") {
                        // console.log(`parseFloat(totalAmount) ${parseFloat(totalAmount)} `)
                        // console.log(`totalAmount.toFixed(2) ${totalAmount} `)
                        // console.log(`(yieldOnCost.toFixed(2)/12).toFixed(2) ${(yieldOnCost.toFixed(2)/12).toFixed(2)} `)

                        totalYieldOnCoastAVG_acao += ((yieldOnCost.toFixed(2) / 12).toFixed(2) * parseFloat(totalAmount).toFixed(2))
                        var ammountAcao = parseFloat(totalAmount)
                        somaTotalDaAcao += ammountAcao
                    } else if (tipo == "FIIS") {
                        totalYieldOnCoastAVG_fiis += ((yieldOnCost.toFixed(2) / 12).toFixed(2) * parseFloat(totalAmount).toFixed(2))
                        var ammountFiis = parseFloat(totalAmount)
                        somaTotalDaFiis += ammountFiis
                    } else if (tipo == "FIAGRO") {
                        totalYieldOnCoastAVG_fiagro += ((yieldOnCost.toFixed(2) / 12).toFixed(2) * parseFloat(totalAmount).toFixed(2))
                        var ammountFiagro = parseFloat(totalAmount)
                        somaTotalDaFiagro += ammountFiagro

                    }
                }


                return yieldOnCost.toFixed(2);
            }
        }
    } catch (e) {
        console.log(`getYocByActive error: ${e} `)
    }

    return yieldOnCost.toFixed(1);
}

function getColorYoc(yieldOnCost, vlrCompare) {
    var yocColor = ""
    if (yieldOnCost == 0) {
        yocColor = ""
    } else if (yieldOnCost < vlrCompare) {
        yocColor = "lime-text"
    } else if (yieldOnCost > vlrCompare) {
        yocColor = "textGreen"
    }
    return yocColor
}

function createHeader(cell, topText, bottomText) {
    var div = document.createElement('th'); // create DIV element

    div.setAttribute('class', ' text-right undefined');
    div.setAttribute('data-key', 'currentValue');
    div.setAttribute('style', "height: 0px;");

    div.innerHTML = `<div class="textCyan">
    <div>${topText}<br><small>${bottomText}</small></div>
    <i data-nosnippet aria-hidden="true" role="img" data-icon="lock_open" class="to-fix material-icons" ></i>
    </div>`

    cell.appendChild(div); // append DIV to the table cell
}

/*  ============  FIIs =============== */

try {
    (function() {
        'use strict';

        var indexFIIS
        var valuationFIIs

        setTimeout(function() {
            indexFIIS = getIndexGroup("FII")

            getValuationFIIs()
        }, 1000);




        function sortDYFII() {
            console.log("sortDYFII");

            deleteColumnsFIIs();

            setTimeout(function() {
                insertLastValueDYFII()
                //getValuationFIIs()
            }, 200);
        }

        function getDYActiveFII(ativo) {
            var tipo
            for (var z = 0; z < objYieldOnCost.data.length; z++) {
                //console.log("getDYActiveFII "+ objYieldOnCost.data[z].categoryName)
                if (objYieldOnCost.data[z].categoryName.toLowerCase() == "fiis") {
                    tipo = z
                }
            }

            var ativoYOC_List = objYieldOnCost.data[tipo].assets

            var dy = 0.00
            for (var idx = 0; idx < ativoYOC_List.length; idx++) {
                if (ativoYOC_List[idx].code.toLowerCase() == ativo.toLowerCase()) {
                    dy = ativoYOC_List[idx].dy
                    return dy.toFixed(1);
                }
            }

            return dy.toFixed(1);
        }

        function getDYValuationFIIs(ativo, tipo) {
            //tipo:  "dy" ou "p_vp"

            //console.log("getDYValuationFIIs" )

            for (var i = 0; i < valuationFIIs.length; i++) {

                if (valuationFIIs[i].name.toLowerCase() == tipo.toLowerCase()) {
                    for (var x = 0; x < valuationFIIs[i].values.length; x++) {
                        if (valuationFIIs[i].values[x].code.toLowerCase() == ativo.toLowerCase()) {
                            return valuationFIIs[i].values[x].valueFormatted
                        }
                    }
                }
            }

            return "0,00";
        }

        async function getValuationFIIs() {
            console.log("getValuationFIIs");
            const url = "https://statusinvest.com.br/admcomparator/assetfilter";

            const formData = new FormData();
            formData.append("category", "2");

            try {
                var tbl = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFIIS}) > div`).getElementsByTagName('table')[1],
                    i;
                for (i = 0; i < tbl.rows.length; i++) {
                    if (i != 0) {
                        var ativo = tbl.rows[i].getElementsByTagName("td")[0].innerText;
                        formData.append("codes[]", ativo.trim());
                    }
                }
            } catch (error) {
                console.error("getValuationFIIs error ++++>" + error);
            }

            formData.append("config[Indicators][0][Key]", "dy");
            formData.append("config[Indicators][0][Show]", "true");
            formData.append("config[Indicators][0][Compare]", "true");
            formData.append("config[Indicators][1][Key]", "dividendos_cagr3");
            formData.append("config[Indicators][1][Show]", "true");
            formData.append("config[Indicators][1][Compare]", "true");
            formData.append("config[Indicators][2][Key]", "p_vp");
            formData.append("config[Indicators][2][Show]", "true");
            formData.append("config[Indicators][2][Compare]", "true");
            formData.append("config[Indicators][3][Key]", "cota_cagr3");
            formData.append("config[Indicators][3][Show]", "true");
            formData.append("config[Indicators][3][Compare]", "true");
            formData.append("config[Indicators][4][Key]", "percentualcaixa");
            formData.append("config[Indicators][4][Show]", "true");
            formData.append("config[Indicators][4][Compare]", "true");
            formData.append("config[Indicators][5][Key]", "liquidezmedia");
            formData.append("config[Indicators][5][Show]", "true");
            formData.append("config[Indicators][5][Compare]", "true");
            formData.append("config[period][rule]", "0");


            try {
                //console.log("getValuationFIIs FORMDATA:"+ [...formData]);
                const response = await fetch(url, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();
                var json = JSON.stringify(data)
                //console.log("++++++++>json "+json);
                var obj = JSON.parse(json);
                //console.log("++++++++>obj "+obj);

                valuationFIIs = obj.data.chart
                //console.log("++++++++>dataChart "+valuationFIIs);

                insertLastValueDYFII()
            } catch (error) {
                console.error(error);
                // Lida com erros
            }
        }


        async function setValueDYFII(ativo, tbl, i, currentPrice, totalAmmounFiis, islastStock, dyMedioElement) {
            const response = await fetch(`https://statusinvest.com.br/fii/companytickerprovents?ticker=${ativo}&chartProventsType=0`);
            var data = await response.json();

            var json = JSON.stringify(data)

            var obj = JSON.parse(json);

            var lastDYvalue = obj.assetEarningsModels[0].v

            var lastDYValueNumber = parseFloat(lastDYvalue);

            var dyPercent = (lastDYValueNumber * 100) / currentPrice

            var lastDYAnnual = getDYActiveFII(ativo)

            var yieldOnCost = getYocByActive(ativo, "FIIS", totalAmmounFiis)

            var dyColor = getDY_MonthColor(dyPercent)
            var yocColor = getColorYoc(yieldOnCost, lastDYAnnual)

            var lastDYAnnual2 = getDYValuationFIIs(ativo, "dy")
            var p_vp = getDYValuationFIIs(ativo, "p_vp")
            var p_vpColor = getPVP_Color(p_vp.replace(",", "."))

            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), dyPercent.toFixed(2), "%", dyColor);
            //createCellFII(tbl.rows[i].insertCell(tbl.rows[i].cells.length), lastDYvalue.toFixed(2), "R$", color);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), lastDYAnnual2, "%", dyColor);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), yieldOnCost, "%", yocColor);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), p_vp, "pvp", p_vpColor);


            if (islastStock) {
                setTimeout(function() {
                    // console.log(`totalYieldOnCoastAVG_fiis AVG : ${totalYieldOnCoastAVG_fiis}`)
                    // console.log(`somaTotalDaFiis AVG : ${somaTotalDaFiis}`)
                    var avgDY = 0

                    try {
                        avgDY = totalYieldOnCoastAVG_fiis / somaTotalDaFiis
                        if (avgDY == "NaN") avgDY = 0
                    } catch (e) {
                        avgDY = 0
                    }

                    console.log(`yieldOnCost FIIs AVG =====>: ${avgDY}%`)

                    dyMedioElement.innerHTML = `<div class="card p-1 pl-3 pr-3 fs-3 lh-3_5 white-text bg-main-gd-h">
                                      <span class="fw-700 itens-count">DY </span>
                                      <span class="">Médio pelo YOC: </span>
                                      <span class="fw-600 itens-limit">${avgDY.toFixed(2)}%</span>
                                   </div>`
                }, 2000);

            }
        }

        // append column to the HTML table
        function insertLastValueDYFII() {
            console.log("insertLastValueDY: indexFIIS " + indexFIIS)

            setTimeout(function() {
                var x
                for (x = 1; x < 12; x++) {
                    // add listener to sort column
                    document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFIIS}) > div > div > div:nth-child(1) > div.overflow-hidden.normal.w-100 > div > table > thead > tr > th:nth-child(${x})`).addEventListener('click', sortDYFII);
                }
            }, 200);

            var tbl = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFIIS}) > div`).getElementsByTagName('table')[1], // table reference
                i;

            var dyMedioElement
            dyMedioElement = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFIIS}) > header > div.mr-sm-2`)

            try {
                dyMedioElement.classList.remove('d-sm-none')
                dyMedioElement.innerHTML = ""
            } catch {
                dyMedioElement.innerHTML = ""
            }

            // open loop for each row and append cell
            for (i = 0; i < tbl.rows.length; i++) {

                if (i == 0) {
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "DY", "Mensal");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "DY", "Anual");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "YOC", "Anual");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "P/VP", "-");
                } else {
                    var ativo = tbl.rows[i].getElementsByTagName("td")[0].innerText;
                    var currentPrice = parseFloat(tbl.rows[i].getElementsByTagName("td")[2].getAttribute("title"));

                    var totalAmountFii = tbl.rows[i].getElementsByTagName("td")[5].getAttribute("title");

                    setValueDYFII(ativo.trim(), tbl, i, currentPrice, totalAmountFii, (i == tbl.rows.length - 1), dyMedioElement)
                }
            }
        }

        // delete table columns with index greater then 0
        function deleteColumnsFIIs() {
            var tbl = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFIIS}) > div`).getElementsByTagName('table')[1], // table reference
                lastCol = tbl.rows[0].cells.length - 1, // set the last column index
                i;

            try {
                if (lastCol > 11) {
                    for (i = 0; i < tbl.rows.length; i++) {
                        tbl.rows[i].deleteCell(lastCol);
                        tbl.rows[i].deleteCell(lastCol - 1);
                        tbl.rows[i].deleteCell(lastCol - 2);
                        tbl.rows[i].deleteCell(lastCol - 3);
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }

    })();
} catch (e) {
    console.log("Não foi possivel melhorar os FIIs")
}
/*  ============  FIIs =============== */


/*  ============  Fiagro ============ */
try {
    (function() {
        'use strict';

        var indexFiagro = 0

        setTimeout(function() {
            indexFiagro = getIndexGroup("FIAGRO")
            insertLastValueDYFiagro()
        }, 1000);


        function sortDYFiagro() {
            console.log("sortDYFiagro");

            deleteColumnsFiagro(indexFiagro);

            setTimeout(function() {
                insertLastValueDYFiagro()
            }, 200);
        }

        function getDYActiveFiagro(ativo) {
            var tipo
            for (var z = 0; z < objYieldOnCost.data.length; z++) {
                if (objYieldOnCost.data[z].categoryName.toLowerCase() == "fiagro") {
                    tipo = z
                }
            }
            var ativoYOC_List = objYieldOnCost.data[tipo].assets

            var dy = 0.00
            for (var idx = 0; idx < ativoYOC_List.length; idx++) {
                if (ativoYOC_List[idx].code.toLowerCase() == ativo.toLowerCase()) {
                    //console.log("getDYActiveFiagro: "+ativo+" DY :"+ativoYOC_List[idx].dy)

                    dy = ativoYOC_List[idx].dy
                    return dy.toFixed(2);
                }
            }

            return dy.toFixed(2);
        }

        async function setValueDYFiagro(ativo, tbl, i, currentPrice, totalAmountFiagro, islastStock, dyMedioElement) {
            console.log("setValueDYFiagro")
            const response = await fetch(`https://statusinvest.com.br/fiagro/tickerprovents?ticker=${ativo}`);
            var data = await response.json();

            var json = JSON.stringify(data)

            var obj = JSON.parse(json);

            var lastDYvalue = obj.assetEarningsModels[0].v

            var lastDYValueNumber = parseFloat(lastDYvalue);

            var dyPercent = (lastDYValueNumber * 100) / currentPrice
            var lastDYAnnual = getDYActiveFiagro(ativo)
            var yieldOnCost = getYocByActive(ativo, "FIAGRO", totalAmountFiagro)

            try {
                var pVP = await extrairPVP_Fiagro(ativo);
                //console.log("pvp Fiagro - "+ ativo + ":" + pVP);
            } catch (error) {
                console.error("Tag Along ERROR: " + error);
            }

            var pvpColor = getPVP_Color(pVP.replace(",", "."))
            var dyColor = getDY_MonthColor(dyPercent)
            var yocColor = getColorYoc(yieldOnCost, lastDYAnnual)

            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), dyPercent.toFixed(2), "%", dyColor);
            //createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), lastDYvalue.toFixed(2), "R$", dyColor);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), lastDYAnnual, "%", dyColor);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), yieldOnCost, "%", yocColor);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), pVP, "pvp", pvpColor);

            if (islastStock) {
                setTimeout(function() {
                    // console.log(`totalYieldOnCoastAVG_fiagro AVG : ${totalYieldOnCoastAVG_fiagro}`)
                    // console.log(`somaTotalDaFiagro AVG : ${somaTotalDaFiagro}`)
                    var avgDY = totalYieldOnCoastAVG_fiagro / somaTotalDaFiagro

                    // console.log(`yieldOnCost FIAGRO AVG : ${avgDY.toFixed(2)}%`)

                    dyMedioElement.innerHTML = `<div class="card p-1 pl-3 pr-3 fs-3 lh-3_5 white-text bg-main-gd-h">
                                      <span class="fw-700 itens-count">DY </span>
                                      <span class="">Médio pelo YOC: </span>
                                      <span class="fw-600 itens-limit">${avgDY.toFixed(2)}%</span>
                                   </div>`

                }, 2000);

            }
        }

        // append column to the HTML table
        function insertLastValueDYFiagro() {
            //console.log("insertLastValueDYFiagro: indexFiagro " + indexFiagro)

            setTimeout(function() {
                var x
                for (x = 1; x < 12; x++) {
                    // add listener to sort column
                    document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFiagro}) > div > div > div:nth-child(1) > div.overflow-hidden.normal.w-100 > div > table > thead > tr > th:nth-child(${x})`).addEventListener('click', sortDYFiagro);
                }
            }, 200);


            var tbl = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFiagro}) > div`).getElementsByTagName('table')[1], // table reference
                i;

            var dyMedioElement
            dyMedioElement = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFiagro}) > header > div.mr-sm-2`)

            try {
                dyMedioElement.classList.remove('d-sm-none')
                dyMedioElement.innerHTML = ""
            } catch {}

            // open loop for each row and append cell
            for (i = 0; i < tbl.rows.length; i++) {


                if (i == 0) {
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "DY", "Atual");
                    //createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "DY", "Atual");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "DY", "Anual");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "YOC", "Anual");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "PVP", "-");
                } else {
                    var ativo = tbl.rows[i].getElementsByTagName("td")[0].innerText;

                    //console.log("insertLastValueDYFiagro Ativo :"+ativo)

                    var currentPrice = parseFloat(tbl.rows[i].getElementsByTagName("td")[2].getAttribute("title"));

                    var totalAmountFiagro = tbl.rows[i].getElementsByTagName("td")[5].getAttribute("title");


                    setValueDYFiagro(ativo.trim(), tbl, i, currentPrice, totalAmountFiagro, (i == tbl.rows.length - 1), dyMedioElement)
                }
            }
        }

        // delete table columns with index greater then 0
        function deleteColumnsFiagro(indexFiagro) {
            var tbl = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexFiagro}) > div`).getElementsByTagName('table')[1], // table reference
                lastCol = tbl.rows[0].cells.length - 1, // set the last column index
                i;

            try {
                if (lastCol > 11) {
                    for (i = 0; i < tbl.rows.length; i++) {
                        tbl.rows[i].deleteCell(lastCol);
                        tbl.rows[i].deleteCell(lastCol - 1);
                        tbl.rows[i].deleteCell(lastCol - 2);
                        tbl.rows[i].deleteCell(lastCol - 3);
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    })();
} catch (e) {
    console.log("Não foi possivel melhorar os Fiagros")
}

/*  ============  Fiagro ============ */


/*  ============  AÇÕES ============= */
try {
    (function() {
        'use strict';

        async function setYieldOnCost() {
            const response = await fetch(`https://statusinvest.com.br/AdmWallet/AssetEarningResult`);
            var data = await response.json();

            var json = JSON.stringify(data)

            objYieldOnCost = JSON.parse(json);
            //console.log("objYieldOnCost: JSON = "+json)
        }

        async function getConsensusAnalystRating(ativo) {
            console.log("getConsensusAnalystRating");
            const url = "https://statusinvest.com.br/futuredata/consensusanalystrating";

            const formData = new FormData();
            formData.append("categoryId", "1");
            formData.append("code", ativo.trim());


            try {
                //console.log("getValuationFIIs FORMDATA:"+ [...formData]);
                const response = await fetch(url, {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();
                var json = JSON.stringify(data)
                //console.log("++++++++>json "+json);
                var obj = JSON.parse(json);
                //console.log("++++++++>obj "+obj);

                var dataObj = obj.data
                //console.log("++++++++>dataChart "+valuationFIIs);

                return dataObj
            } catch (error) {
                console.error(error);
                // Lida com erros
            }
        }

        setYieldOnCost()

        var indexAcoes = 0


        setTimeout(function() {
            indexAcoes = getIndexGroup("Ações")
            insertValuation()
        }, 1200);


        function lastTwoToUpper(string) {
            string = string.toLowerCase();

            const myArray = string.split("");

            myArray[myArray.length - 1] = myArray[myArray.length - 1].toUpperCase()
            myArray[myArray.length - 2] = myArray[myArray.length - 2].toUpperCase()

            var newString = myArray.join("")

            return newString;
        }

        function ordenarColunasAcoes() {
            //console.log("ordenarColunasAcoes");

            deleteColumns();

            setTimeout(function() {
                insertValuation()
            }, 200);
        }

        function getNameOfRecommendation(rating) {
            var name = "Sem avaliação"

            if (rating === "buy") name = "Compra forte"
            else if (rating === "overweight") name = "Compra"
            else if (rating === "hold") name = "Aguardar"
            else if (rating === "underweight") name = "Venda"
            else if (rating === "sell") name = "Venda forte"

            return name
        }

        async function addCellWithValuation(ativo, tbl, i, totalAmountStock, islastStock, dyMedioElement) {
            //         var dataRating = await getConsensusAnalystRating(ativo)
            //         console.log('getConsensusAnalystRating ====>: '+ dataRating.recommendationRatingTypeShortName);

            //         var className = getClassNameOfRecommendation(dataRating.recommendationRatingTypeShortName)
            //         var recommendationValue = getNameOfRecommendation(dataRating.recommendationRatingTypeShortName)
            //         var recommendationValueDateRef = dataRating.referenceDate_F

            const valoresDoCache = obterAtivoDoCache(ativo);
            var cacheIsOld = true

            var passivoAtivo = 0
            var dyMonth = 0
            var dyAnnual = 0
            var yieldOnCost = 0
            var pVP = 0

            if (valoresDoCache) {
                console.log("create_date:", valoresDoCache.createDate);
                //console.log("dy_mensal:", valoresDoCache.dyMensal);
                //console.log("dy_anual:", valoresDoCache.dyAnual);
                //console.log("yoc_anual:", valoresDoCache.yocAnual);
                //console.log("pvp:", valoresDoCache.pvp);

                dyMonth = valoresDoCache.dyMensal
                dyAnnual = valoresDoCache.dyAnual
                yieldOnCost = valoresDoCache.yocAnual
                pVP = valoresDoCache.pvp

                cacheIsOld = diferencaEmHoras(new Date(valoresDoCache.createDate), 1);
            }

            // console.log("cacheIsOld: " + cacheIsOld)

            if (cacheIsOld) {
                const response = await fetch(`https://statusinvest.com.br/acao/indicatorhistoricallist?codes=${ativo}&time=5`);
                var data = await response.json();

                var json = JSON.stringify(data)
                //console.log('json ====>:'+ json);

                var obj = JSON.parse(json);
                //console.log("Ativo: " + ativo)

                var field
                var valuations

                try {
                    field = lastTwoToUpper(ativo)
                    valuations = obj.data[field]
                } catch (err) {
                    //console.log("ERRO Ativo: " + ativo)
                    field = ativo.toLowerCase()
                    valuations = obj.data[field]
                }

                valuations.forEach(v => {
                    // console.log("key: " + v.key)

                    if (v.key == "passivo_ativo") {
                        passivoAtivo = v.actual
                        //console.log("passivoAtivo: " + passivoAtivo)
                    }

                    if (v.key == "dy") {
                        dyAnnual = v.actual
                        //console.log("dy: " + dyAnnual)
                    }

                    if (v.key == "p_vp") {
                        pVP = v.actual
                        //console.log("dy: " + dyAnnual)
                    }

                });

                dyMonth = (dyAnnual / 12).toFixed(2)

                // Yield On Cost
                yieldOnCost = getYocByActive(ativo, "Ações", totalAmountStock)

                const dateNow = new Date();
                salvarAtivoNoCache(ativo, dateNow, dyMonth, dyAnnual, yieldOnCost, pVP)

                console.log("Ativo: " + ativo + " cache OFF")
            } else {
                console.log("Ativo: " + ativo + " cache ON")
            }

            var color
            var tagAlong = "-"
            try {
                tagAlong = await extrairTagAlong(ativo);
            } catch (error) {
                console.error("Tag Along ERROR: " + error);
            }

            if (dyAnnual > 0) {
                //console.log("dyMonth: " + dyAnnual)

                if (dyMonth < 0.3) {
                    color = "textOrange"
                } else if (dyMonth < 0.7) {
                    color = "textYellow"
                } else if (dyMonth < 0.99) {
                    color = "textBlue"
                } else {
                    color = "textGreen"
                }
            } else {
                color = "textRed"
            }

            var yocColor = getColorYoc(yieldOnCost, dyAnnual)
            var pvpColor = getPVP_Color(pVP)
            var tagAlongColor = getTAG_Along_Color(tagAlong)

            if (tagAlong != "-") tagAlong = tagAlong + " %";

            createCellCalcPm(tbl.rows[i].insertCell(tbl.rows[i].cells.length), tbl.rows[i]);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), tagAlong, "tag", tagAlongColor);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), dyMonth, "%", color);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), dyAnnual.toFixed(2), "%", color);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), yieldOnCost, "%", yocColor);
            createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), pVP.toFixed(2), "pvp", pvpColor);

            // createCell(tbl.rows[i].insertCell(tbl.rows[i].cells.length), recommendationValue, "rating", className, recommendationValueDateRef);

            const KEY_YOC_MEDIO = "ACOES_YOC_MEDIO"

            if (islastStock) {
                var avgDY = 0
                var yocMedioCacheIsOld = true

                const yocMedioObj = obterYOCMedioAtivoDoCache(KEY_YOC_MEDIO)

                if (yocMedioObj) {
                    console.log("yocMedioObj create_date:", yocMedioObj.createDate);
                    //console.log("yoc_medio:", yocMedioObj.yocMedio);

                    yocMedioCacheIsOld = diferencaEmHoras(new Date(yocMedioObj.createDate), 1);
                    avgDY = yocMedioObj.yocMedio
                }

                if (yocMedioCacheIsOld) {
                    setTimeout(function() {
                        console.log("Acoes: yocMedio cache OFF")
                        // console.log(`totalYieldOnCoastAVG_acao AVG : ${totalYieldOnCoastAVG_acao}`)
                        // console.log(`somaTotalDaAcao AVG : ${somaTotalDaAcao}`)

                        try {
                            avgDY = totalYieldOnCoastAVG_acao / somaTotalDaAcao

                            if (somaTotalDaAcao == 0) avgDY = 0.00
                        } catch (e) {
                            avgDY = 0.00
                        }

                        console.log("salvarYOCMedioAtivoNoCache:", avgDY.toFixed(2));

                        salvarYOCMedioAtivoNoCache(KEY_YOC_MEDIO, avgDY.toFixed(2))

                        dyMedioElement.innerHTML = `<div class="card p-1 pl-3 pr-3 fs-3 lh-3_5 white-text bg-main-gd-h">
                                      <span class="fw-700 itens-count">DY </span>
                                      <span class="">Médio pelo</span>
                                      <span class="fw-600"> YOC: </span>
                                      <span class="fw-600 itens-limit">${avgDY.toFixed(2)}%</span>
                                   </div>`
                    }, 2000);
                } else {
                    console.log("Acoes: yocMedio cache ON")
                    dyMedioElement.innerHTML = `<div class="card p-1 pl-3 pr-3 fs-3 lh-3_5 white-text bg-main-gd-h">
                                      <span class="fw-700 itens-count">DY </span>
                                      <span class="">Médio pelo</span>
                                      <span class="fw-600"> YOC: </span>
                                      <span class="fw-600 itens-limit">${avgDY}%</span>
                                   </div>`
                }
            }
        }


        // append column to the HTML table
        function insertValuation() {
            firstOpen = true
            console.log("insertValuation")

            setTimeout(function() {
                var x
                for (x = 1; x < 12; x++) {
                    // add listener to sort column
                    document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexAcoes}) > div > div > div:nth-child(1) > div.overflow-hidden.normal.w-100 > div > table > thead > tr > th:nth-child(${x})`).addEventListener('click', ordenarColunasAcoes);
                }
            }, 200);

            var tbl = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexAcoes}) > div`).getElementsByTagName('table')[1], // table reference
                i;

            var dyMedioElement
            dyMedioElement = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexAcoes}) > header > div.mr-sm-2`)

            try {
                dyMedioElement.classList.remove('d-sm-none')
                dyMedioElement.innerHTML = ""
            } catch {}

            // open loop for each row and append cell
            for (i = 0; i < tbl.rows.length; i++) {

                //var qtdNecessaria = calcularQuantidadeAtivos(
                //    qtdAtual,
                //    precoMedioAtual,
                //    precoAtual
                //);
                // elementoPm.setAttribute("title", `Você precisa de ${qtdNecessaria} ações \npara igualar seu preço médio com o preço atual`)
                //

                if (i == 0) {
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "Calc", "Preço Médio");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "TAG", "Along");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "DY", "Mensal");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "DY", "Anual");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "YOC", "Anual");
                    createHeader(tbl.rows[i].insertCell(tbl.rows[i].cells.length), "P/VP", "-");
                    // createTHeaderRating(tbl.rows[i].insertCell(tbl.rows[i].cells.length));
                } else {
                    var ativo = tbl.rows[i].getElementsByTagName("td")[0].getAttribute("title");
                    var totalAmountStock = tbl.rows[i].getElementsByTagName("td")[5].getAttribute("title");

                    addCellWithValuation(ativo.trim(), tbl, i, totalAmountStock, (i == tbl.rows.length - 1), dyMedioElement)
                }
            }

            setTimeout(function() {
                firstOpen = false
            }, 500);
        }

        // delete table columns with index greater then 0
        function deleteColumns() {
            var tbl = document.querySelector(`#assets-result > div.card.p-0.groups-container > ul > li:nth-child(${indexAcoes}) > div`).getElementsByTagName('table')[1], // table reference
                lastCol = tbl.rows[0].cells.length - 1, // set the last column index
                i;

            try {
                if (lastCol > 12) {
                    for (i = 0; i < tbl.rows.length; i++) {
                        tbl.rows[i].deleteCell(lastCol);
                        tbl.rows[i].deleteCell(lastCol - 1);
                        tbl.rows[i].deleteCell(lastCol - 2);
                        tbl.rows[i].deleteCell(lastCol - 3);
                        tbl.rows[i].deleteCell(lastCol - 4);
                        tbl.rows[i].deleteCell(lastCol - 5);
                    }
                }
            } catch (e) {
                console.log(e)
            }
        }
    })();
} catch (e) {
    console.log("Não foi possivel melhorar os Fiagros")
}
/*  ============  AÇÕES ============= */

//