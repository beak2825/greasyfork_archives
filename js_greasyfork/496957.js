// ==UserScript==
// @name        HelpGCOM_novo
// @namespace   https://sistemas.caesb.df.gov.br/gcom/
// @match       *sistemas.caesb.df.gov.br/gcom/*
// @match       *sistemas.caesb/gcom/*
// @version     3.37
// @grant       none
// @license     MIT
// @description Auxiliar para trabalhos no GCOM!
// @downloadURL https://update.greasyfork.org/scripts/496957/HelpGCOM_novo.user.js
// @updateURL https://update.greasyfork.org/scripts/496957/HelpGCOM_novo.meta.js
// ==/UserScript==

var version = GM_info.script.version;


function getDynamicIdByText(startingPattern, targetText, modif=0, targetIndex=0) {
    const elements = document.querySelectorAll('[id^="' + startingPattern + '"]');
    let matchedIds = [];

    for (const element of elements) {
        const id = element.id;
        const elementText = element.textContent.trim();

        if (id && elementText.includes(targetText)) {
            matchedIds.push({id, elementText});
        }
    }

    // Se targetIndex for -1, considera o último elemento
    if (targetIndex === -1) {
        targetIndex = matchedIds.length - 1;
    }

    if (targetIndex >= 0 && targetIndex < matchedIds.length) {
        const { id } = matchedIds[targetIndex];
        if (modif != 0) {
            // Extrai o número do ID atual (assumindo que o formato é "j_idtNNN")
            let currentNumber = parseInt(id.match(/\d+/)[0]);
            // Incrementa o número para obter o próximo número
            const nextNumber = currentNumber + modif;
            const regex = new RegExp("(\\d+)(?!.*\\d)");
            const idnew = id.replace(regex, nextNumber);
            return idnew;
        }
        return id;
    }

    return null; // Retorna null se nenhum elemento correspondente for encontrado no índice especificado
}

function formatCSSSelector(id) {
    if (id) {
        return '#' + id.replace(/(:|\.|\[|\]|,|=|@)/g, "\\$1");
    }
    return null;
}

// LISTAGEM COM TODOS OS IDT's
// IDTs da tela de baixa
var hidrometro = 'form:numHidrometro';
var leit = 'form:leituraVistoria';
var lacr = 'form:lacreInstaladoVistoria';
var usu = 'form:nomeContatoVistoria';
const naoseaplica = '#form\\:naoSeAplicaVistoria > div:nth-child(2) > span:nth-child(1)';

let nomeANEXO, descricaoANEXO, elementPairs, checkemaildiagID, checkemaildiag, checkemailprovID, checkemailprov, checkemailgerarID, checkemailgerar, respostaID, diagnosticoID, providenciaID, resposta, diagnostico, providencia, vazcorrigidosimID, vazvisivelID, vaznaovisivelID, vazcoletadoID, vaznaocoletadoID, vazcorrigidosim, vazvisivel, vaznaovisivel, vazcoletado, vaznaocoletado, revisacontaID, revisaoconta;

function PegarIdts() {

    respostaID = getDynamicIdByText('form\\:j_idt', 'Sim', 0, -1);
    diagnosticoID = getDynamicIdByText('form\\:j_idt', 'Diagnóstico*:', 1, -1);
    providenciaID = getDynamicIdByText('form\\:j_idt', 'Providência*:', 1, -1);

    resposta = (formatCSSSelector(respostaID) + ' > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)');
    diagnostico = formatCSSSelector(diagnosticoID);
    providencia = formatCSSSelector(providenciaID);

    vazcorrigidosimID = getDynamicIdByText('form\\:j_idt', 'Não se aplica',2,-1);
    vazvisivelID = getDynamicIdByText('form\\:j_idt', 'Não se aplica',5,-1);
    vaznaovisivelID = getDynamicIdByText('form\\:j_idt', 'Não se aplica',5,-1);
    vazcoletadoID = getDynamicIdByText('form\\:j_idt', 'Não se aplica',8,-1);
    vaznaocoletadoID = getDynamicIdByText('form\\:j_idt', 'Não se aplica',8,-1);

    vazcorrigidosim = (formatCSSSelector(vazcorrigidosimID) + ' > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)');
    vazvisivel = (formatCSSSelector(vazvisivelID) + ' > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > label:nth-child(2)');
    vaznaovisivel = (formatCSSSelector(vaznaovisivelID) + ' > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > label:nth-child(2)');
    vazcoletado = (formatCSSSelector(vazcoletadoID) + '> tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > label:nth-child(2)');
    vaznaocoletado = (formatCSSSelector(vaznaocoletadoID) + ' > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > label:nth-child(2)');

    nomeANEXO = getDynamicIdByText('formConfirmaAnexoVistoriaEmail\\:j_idt', 'Arquivo selecionado:');
    descricaoANEXO = getDynamicIdByText('formConfirmaAnexoVistoriaEmail\\:j_idt', 'Descrição do arquivo:*',1);

    elementPairs = [
        [formatCSSSelector(nomeANEXO) + ' > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', formatCSSSelector(descricaoANEXO)]
    ];

    revisaocontaID = getDynamicIdByText('form\\:j_idt', 'Revisão de Conta: *', 1, -1);
    revisaoconta = formatCSSSelector(revisaocontaID) + ' tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > label:nth-child(2)';

};

function getDynamicSelectorsRefaturamento() {
    const selectorsRefaturamento = {
        IrregConst: formatCSSSelector(getDynamicIdByText('form\\:j_idt', 'Irregularidade Constatada*:', 1,-1)),
        Apuracao: formatCSSSelector(getDynamicIdByText('form\\:j_idt', 'Elemento de apuração da irregularidade*:', 1,-1)),
        Criterios: formatCSSSelector(getDynamicIdByText('form\\:j_idt', 'Critérios adotados na revisão dos faturamentos*:', 1,-1)),
        Tarifa: formatCSSSelector(getDynamicIdByText('form\\:j_idt', 'Tarifa utilizada*:', 1,-1)),
        MemoCalculo: formatCSSSelector(getDynamicIdByText('form\\:j_idt', 'Memória descritiva dos cálculos de revisão do valor faturado*:', 1,-1)),
    };

    return selectorsRefaturamento;
}

function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (e) {
        console.error('Seletor inválido:', selector, e);
        return null; // Retorna null se o seletor for inválido
    }
}


// Define as estilizações do widget em um objeto CSS
var widgetStyles = {
    'position': 'fixed',
    'top': '10%',
    'right': '10px',
    'background-color': '#FFFFFF',
    'border': '1px solid #ddd',
    'padding': '10px',
    'box-shadow': '0 2px 5px rgba(0, 0, 0, 0.2)',
    'font-size': '14px',
    'font-family': 'Arial, sans-serif',
    'z-index': '9999',
    'width': '200px',
    'border-radius': '5px'
};

// Define as estilizações dos botões em um objeto CSS
var buttonStyles = {
    'background-color': '#0b61a4',
    'margin-bottom': '5px',
    'display': 'none',
    'width': '100%',
    'color': 'white',
    'border': 'none',
    'padding': '5px 10px',
    'text-align': 'center',
    'text-decoration': 'none',
    'font-size': '12px',
    'font-weight': 'bold',
    'border-radius': '5px'
};

// Cria o widget
var myWidget = $('<div id="my-widget"></div>').css(widgetStyles);

// Define as estilizações do botão de minimizar/maximizar
var toggleButtonStyles = {
    position: 'absolute',
    top: '5px',
    right: '5px',
    background: 'transparent',
    color: '#555',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
};

// Cria o botão de minimizar/maximizar
var toggleButton = $('<button>◱</button>').css(toggleButtonStyles);

// Adiciona o evento de clique para alternar entre as versões maximizada e minimizada
toggleButton.click(function() {
    myWidget.toggleClass('minimized');
    // Ajusta as estilizações conforme necessário para a versão minimizada
    if (myWidget.hasClass('minimized')) {
        myWidget.css({
            width: '15px', // ou outro valor adequado
            height: '15px', // ou outro valor adequado
        });
        // Esconde os SectionTitles quando minimizado
        myWidget.find('div[style*="font-weight: bold"]').hide();
    } else {
        // Ajusta as estilizações para a versão maximizada
        myWidget.css({
            width: '200px', // ou outro valor adequado
            height: 'auto', // ou outro valor adequado
        });
        // Mostra os SectionTitles quando maximizado
        myWidget.find('div[style*="font-weight: bold"]').show();
    }
});

// Adiciona o botão de minimizar/maximizar ao widget
myWidget.append(toggleButton);


// Adiciona o evento de arrastar ao widget
myWidget.mousedown(function(e) {
    var initialX = e.pageX - $(this).offset().left;
    var initialY = e.pageY - $(this).offset().top;
    var widgetPosition = myWidget.position();
    var mouseX = e.pageX - widgetPosition.left;
    var mouseY = e.pageY - widgetPosition.top;

    $('body').mousemove(function(e) {
        myWidget.css({
            'left': e.pageX - mouseX,
            'top': e.pageY - mouseY
        });
    });
});

// Remove o evento de arrastar ao soltar o botão do mouse
$('body').mouseup(function() {
    $('body').off('mousemove');
});

// Função auxiliar para criar botões
var createButton = function(text) {
    return $('<button>' + text + '</button>').css(buttonStyles);
};

// Função auxiliar para criar títulos de seção
var createSectionTitle = function(text) {
    return $('<div></div>').css({
        'font-weight': 'bold',
        'margin-bottom': '10px',
        'color': '#333',
        'cursor': 'pointer'
    }).text(text);
};

var createButtonWithClick = function(text, clickHandler) {
    var button = $('<button>' + text + '</button>').css(buttonStyles);
    button.click(function() {
        PegarIdts();
        clickHandler();
    });
    return button;
};

// Adiciona os elementos ao widget
myWidget.append(
    createSectionTitle('--- REVISAO DE CONTAS ---'),
    createButtonWithClick('Usuario Orientado Vazamento', function(){ UsuarioOrientadoVazamento(); }),
    createButtonWithClick('Sem Vazam. Improcedente', function(){ SemVazamImprocedente(); }),
    //createButtonWithClick('Leitura informada pelo usuario', function(){ LeituraInformada(); }),
    createButtonWithClick('Vazamento Coberto', function(){ VazCoberto(); }),
    createButtonWithClick('Agendamento de leitura', function(){ AgendLeitura(); }),
    createButtonWithClick('Vazamento Visivel/Coletado', function(){ VazVisCol(); }),
    createButtonWithClick('Vaz.Negado mais de 2 LS', function(){ VazNegado(); }),
    createButtonWithClick('Distribuição de Consumo', function(){ DistribuicaoConsumo(); }),
    createButtonWithClick('Vaz.Abaixo LS S/Esg', function(){ VazAbaixoLs(); }),
    createButtonWithClick('Clt ausente Vist realizada', function(){ CltAusenteVistRealizada(); }),
    createButtonWithClick('Multa imp.corte', function(){ MultaImpCorte(); }),
    createButtonWithClick('Multa Agend Fora Prazo', function(){ AgendLeituraForaPrazo(); }),
    createSectionTitle('--- REVISAO COM REFAT ---'),
    createButtonWithClick('Vazamento Interno Ñ Vis/Col', function(){ VazInternNVisCol(); }),
    createButtonWithClick('Erro de leitura', function(){ ErroLeitura(); }),
    createButtonWithClick('Vaz depois cavalete', function(){ VazDepoisCavalete(); }),
    createSectionTitle('--- DADOS CADASTRAIS ---'),
    createButtonWithClick('Alteração de categoria', function(){ AlteracaoCategoria(); }),
    createButtonWithClick('Alteração de Unidades de Consumo', function(){ AlteracaoUnidadesConsumo(); }),
    createButtonWithClick('Troca de HD**', function(){ TrocaHD(); }),
    createButtonWithClick('Descad.Autoleitura', function(){ DescAutoLeitura(); }),
    createSectionTitle('--- TARIFA SOCIAL ---'),
    createButtonWithClick('Usuario Descadastr.', function(){ UsuarioDescadastr(); }),
    createButtonWithClick('Fora da Lista', function(){ ForaDaLista(); }),
    createButtonWithClick('Usuário já tem tar. social', function(){ UsuarioJaTemTarSocial(); }),
    createButtonWithClick('Usuário vinculado', function(){ UsuarioVinculadoTarSocial(); }),
    $('<div></div>').css({
    'font-size': '8px',
    'text-align': 'right',
    'margin-top': '10px',
    'font-weight': 'bold'
    }).text('Ver. ' + version + ' Feito por Willian Verri'),
);

// Torna os botões visíveis ao clicar nos títulos de seção
myWidget.find('div[style*="font-weight: bold"]').click(function() {
    $(this).nextUntil('div').filter('button').slideToggle();
});

// Verifica se a URL corresponde à página de "baixa" do atendimento
if (window.location.href.includes('/app/atendimento/validarClienteCadastroVistoria/edicao')) {
    $('body').append(myWidget);
}

var marcado = false;

(function() {
    var checkExist = setInterval(function() {

        if (window.location.href.includes('/app/atendimento/validarClienteCadastroVistoria/edicao')) {

            //Verifica se o elemento #dlgEnviarEmailVistoria_title está presente
            var dlgEnviarEmailElement = document.querySelector('html body div#dlgEnviarEmailVistoria.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-shadow.ui-hidden-container.ui-dialog-absolute.ui-draggable[aria-hidden="false"]');
            if (dlgEnviarEmailElement && marcado == false) {

                checkemaildiagID = getDynamicIdByText('formEnviarEmail\\:j_idt', 'Diagnóstico', 0, 1);
                checkemailprovID = getDynamicIdByText('formEnviarEmail\\:j_idt', 'Providência', 0, 1);
                checkemailgerarID = getDynamicIdByText('formEnviarEmail\\:j_idt', 'Gerar texto do Email', 0, 1);

                console.log('CheckemaildiagID: ' + checkemaildiagID);
                console.log('CheckemailprovID: ' + checkemailprovID);
                console.log('CheckemailgerarID: ' + checkemailgerarID);

                checkemaildiag = (formatCSSSelector(checkemaildiagID) + ' > div:nth-child(2) > span:nth-child(1)');
                checkemailprov = (formatCSSSelector(checkemailprovID) + ' > div:nth-child(2) > span:nth-child(1)');
                checkemailgerar = (formatCSSSelector(checkemailgerarID));

                console.log('Checkemaildiag: ' + checkemaildiag);
                console.log('Checkemailprov: ' + checkemailprov);
                console.log('Checkemailgerar: ' + checkemailgerar);

                // Verifica se os checkboxes estão marcados
                var checkbox1 = document.querySelector(checkemaildiag);
                var checkbox2 = document.querySelector(checkemailprov);

                console.log(checkbox1);
                console.log(checkbox2);

                // Função para marcar um checkbox
                function marcarCheckbox(checkbox) {
                    checkbox.checked = true;
                    // Dispara um evento de mudança, pois alguns scripts podem estar escutando isso
                    var event = new Event('change');
                    checkbox.dispatchEvent(event);
                }
                // Marca os checkboxes se não estiverem marcados
                if (checkbox1 && !checkbox1.checked) {
                    marcarCheckbox(checkbox1);
                }
                if (checkbox2 && !checkbox2.checked) {
                    marcarCheckbox(checkbox2);
                    var botaoGerarTextoEmail = document.querySelector(checkemailgerar);
                    if (botaoGerarTextoEmail) {
                        botaoGerarTextoEmail.click();
                    }
                }
                console.log(checkbox1);
                console.log(checkbox2);
                marcado = true;
            }

            if (elementPairs) {
                for (const [confirmElementSelector, confirmElementValueSelector] of elementPairs) {
                    const confirmElement = document.querySelector(confirmElementSelector);
                    const confirmElementValue = document.querySelector(confirmElementValueSelector);

                    if (confirmElement && confirmElementValue && confirmElementValue.value === '') {
                        const fileName = confirmElement.innerText.trim();
                        const fileNameWithoutExtension = fileName.slice(0, -4);
                        confirmElementValue.value = fileNameWithoutExtension;
                    }
                }
            }


            var iframe = document.querySelector('iframe'); // Use o seletor apropriado para selecionar o iframe específico
            if (iframe) {
                var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                var textoParaRemover = iframeDocument.body.innerHTML.match(/Em \d{2}\/\d{2}\/\d{4} não foi possível realizar vistoria no imóvel por .<br><br>&nbsp;Deste modo, dentro de suas competências e diante da impossibilidade de realizar vistoria, a CAESB , não detectou problemas que justificassem a revisão dos valores cobrados em sua\(s\) conta\(s\), portanto, o faturamento descrito em sua\(s\) conta\(s\) fica\(m\) confirmado\(s\) e todos os valores mantidos\./);
                if (textoParaRemover) {
                    iframeDocument.body.innerHTML = iframeDocument.body.innerHTML.replace(textoParaRemover[0], '');
                }
            }
        }
    }, 200);
})();


async function Revisao(vaz, visivel, coletado, diag, prov) {

    PegarIdts();

    //Revisao(vaz, visivel, coletado, diag, prov)
    var clickresposta = document.querySelector(resposta);

    if (clickresposta !== null) {
        clickresposta.click();
    }

    await waitForElementEnabled(diagnostico);

    const diagn = document.querySelector(diagnostico);
    const provd = document.querySelector(providencia);

    if (diagn !== null && diagn !== false) {
        diagn.value = diag;
    }
    if (provd !== null && provd !== false) {
        provd.value = prov;
    }

    const naoaplica = document.querySelector(naoseaplica);
    console.log(naoaplica);
    if (naoaplica.classList.contains('ui-icon-check')){
        naoaplica.click();
        await waitForClickable(vazcorrigidosim);
    }

    if (vaz == 1) {
        document.querySelector(vazcorrigidosim).click();
        if (visivel == 1){
            document.querySelector(vazvisivel).click();
        }
        else{
            document.querySelector(vaznaovisivel).click();
        }
        if (coletado == 1){
            document.querySelector(vazcoletado).click();
        }
        else{
            document.querySelector(vaznaocoletado).click();
        }
    }
    else{
        document.querySelector(naoseaplica).click();
    }

    return;

}

async function RevisaoComRefaturamento(vaz, visivel, coletado, irregularidade, apuracao, criterios, tarifa, memoriacalculo) {
    PegarIdts();

    var clickresposta = document.querySelector(resposta);

    if (clickresposta !== null) {
        clickresposta.click();
    }

    var clickrevisaoconta = document.querySelector(revisaoconta);

    if (clickrevisaoconta !== null) {
        clickrevisaoconta.click();
    }

    setTimeout(async function(){
        const selectorsRefaturamento = getDynamicSelectorsRefaturamento();
        // await waitForElementEnabled(selectorsRefaturamento.IrregConst);

        console.log(selectorsRefaturamento.IrregConst);
        console.log(selectorsRefaturamento.Apuracao);
        console.log(selectorsRefaturamento.Criterios);
        console.log(selectorsRefaturamento.Tarifa);
        console.log(selectorsRefaturamento.MemoCalculo);

        const irreg = safeQuerySelector(selectorsRefaturamento.IrregConst);
        const apur = safeQuerySelector(selectorsRefaturamento.Apuracao);
        const crit = safeQuerySelector(selectorsRefaturamento.Criterios);
        const tarif = safeQuerySelector(selectorsRefaturamento.Tarifa);
        const memcalc = safeQuerySelector(selectorsRefaturamento.MemoCalculo);

        console.log(irreg);
        console.log(apur);
        console.log(crit);
        console.log(tarif);
        console.log(memcalc);

        if (irreg !== null && irreg !== false) {
            irreg.value = irregularidade;
        }
        if (apur !== null && apur !== false) {
            apur.value = apuracao;
        }
        if (crit !== null && crit !== false) {
            crit.value = criterios;
        }
        if (tarif !== null && tarif !== false) {
            tarif.value = tarifa;
        }
        if (memcalc !== null && memcalc !== false) {
            memcalc.value = memoriacalculo;
        }

        const naoaplica = document.querySelector(naoseaplica);
        console.log(naoaplica);
        if (naoaplica.classList.contains('ui-icon-check')){
            naoaplica.click();
            await waitForClickable(vazcorrigidosim);
        }

        if (vaz == 1) {
            document.querySelector(vazcorrigidosim).click();
            if (visivel == 1){
                document.querySelector(vazvisivel).click();
            }
            else{
                document.querySelector(vaznaovisivel).click();
            }
            if (coletado == 1){
                document.querySelector(vazcoletado).click();
            }
            else{
                document.querySelector(vaznaocoletado).click();
            }
        }
        else{
            document.querySelector(naoseaplica).click();
        }

    }, 2000);

    return;
}

async function waitForElement(selector) {
    const startTime = Date.now();
    const timeout = 2000; // Tempo limite de 2 segundos

    while (!document.querySelector(selector)) {
        if (Date.now() - startTime > timeout) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // Espera 100ms antes de verificar novamente
    }

    return document.querySelector(selector);
}

// Função para esperar um elemento ser clicável
async function waitForClickable(selector, timeout = 30000) {
    const startTime = new Date().getTime();
    while (true) {
        const now = new Date().getTime();
        if (now - startTime > timeout) {
            throw new Error("Timeout waiting for element to be clickable");
        }
        const element = document.querySelector(selector);
        if (element && !element.disabled && getComputedStyle(element).display !== 'none') {
            return element;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function waitForElementEnabled(selector, timeout = 30000) {
    const startTime = Date.now();
    while (true) {
        const element = document.querySelector(selector);
        if (element && !element.disabled) {
            return element;
        }
        if (Date.now() - startTime > timeout) {
            throw new Error('Timeout waiting for element to be enabled');
        }
        await new Promise(resolve => setTimeout(resolve, 100)); // espera 100ms antes de tentar novamente
    }
}

async function abrirModalRevisao() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.position = 'fixed';
        modal.style.zIndex = '9999';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.backgroundColor = 'white';
        modal.style.padding = '20px';
        modal.style.border = '1px solid black';
        modal.style.maxHeight = '80vh';
        modal.style.overflowY = 'auto';

        modal.innerHTML = `
            <h2>Informações para Revisão de Contas</h2>
            ${[1, 2, 3, 4].map(i => `
                <div>
                    <h3>Conta ${i}</h3>
                    <input type="text" id="conta${i}" placeholder="Conta (ex: 07/2024)">
                    <input type="number" id="consumo${i}" placeholder="Consumo">
                    <select id="tipoRefat${i}">
                        <option value="">Tipo de Refaturamento</option>
                        <option value="LS">Limite Superior</option>
                        <option value="LSM">Limite Superior e média no esgoto</option>
                        <option value="M">Média no esgoto</option>
                        <option value="MM">Média água e esgoto></option>
                    </select>
                    <input type="number" id="ls${i}" placeholder="LS">
                    <input type="number" id="media${i}" placeholder="Média">
                    <input type="text" id="valorConta${i}" placeholder="Valor Original (R$)" inputmode="decimal">
                    <input type="text" id="novoValor${i}" placeholder="Novo Valor (R$)" inputmode="decimal">
                </div>
            `).join('')}
            <select id="tabelaTarifa">
                <option value="01/06/2025">01/06/2025</option>
                <option value="01/06/2024">01/06/2024</option>
                <option value="01/08/2023">01/08/2023</option>
                <option value="01/01/2023">01/01/2023</option>
                <option value="01/09/2022">01/09/2022</option>
                <option value="01/06/2021">01/06/2021</option>
            </select>
            <button id="submitModal">Enviar</button>
        `;

        document.body.appendChild(modal);

        document.getElementById('submitModal').addEventListener('click', function() {
            const contas = [];
            for (let i = 1; i <= 4; i++) {
                const conta = document.getElementById(`conta${i}`).value;
                if (conta) {
                    contas.push({
                        conta: conta,
                        consumo: document.getElementById(`consumo${i}`).value,
                        tipoRefat: document.getElementById(`tipoRefat${i}`).value,
                        ls: document.getElementById(`ls${i}`).value,
                        media: document.getElementById(`media${i}`).value,
                        valorConta: document.getElementById(`valorConta${i}`).value,
                        novoValor: document.getElementById(`novoValor${i}`).value
                    });
                }
            }
            const tabelaTarifa = document.getElementById('tabelaTarifa').value;

            modal.remove();
            resolve({ contas, tabelaTarifa });
        });
    });
}

//Revisao(vaz, visivel, coletado, diag, prov)

function UsuarioOrientadoVazamento() { //Usuario Orientado Vazamento
    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var usuario = document.getElementById(usu).innerText;
    console.log(leitura);
    console.log(lacre);
    console.log(usuario);

    if ( lacre == "" ) {
        var diag = `Hidrômetro com bom funcionamento, leitura ${leitura} confirmada.\nOrientamos o(a) usuário(a) ${usuario} a verificar as instalações hidráulicas do imóvel, a fim de identificar qualquer vazamento que possa estar influenciando no faturamento.`;
    }
    else {
        var diag = `Hidrômetro com bom funcionamento, leitura ${leitura} confirmada, lacre ${lacre}.\nOrientamos o(a) usuário(a) ${usuario} a verificar as instalações hidráulicas do imóvel, a fim de identificar qualquer vazamento que possa estar influenciando no faturamento.`;
    }
    var prov = `Caso seja identificado um vazamento, é importante efetuar o registro fotográfico do local antes e depois da correção, além de providenciar o reparo imediato.\nApós o reparo, o usuário(a) deve encaminhar as fotos que comprovem a existência/correção do vazamento, juntamente com foto da numeração do hidrômetro e foto da leitura atual, em uma nova solicitação por meio do Autoatendimento no site da CAESB ou pelo Aplicativo.\nEssas medidas garantirão a revisão adequada das contas, conforme estabelecido pela Resolução 14/2011.`;

    Revisao(0,0,0,diag,prov);
};


function SemVazamImprocedente() { //Sem Vazam. Improcedente

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var refs = prompt('Caso tenha atualizado vencimento, informar refs. Ex. 10/2023, 11/2023 e 12/2023 \nCaso contrário deixar em branco.');
    if ( lacre == "" ) {
        var diag = 'Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente e a leitura ' + leitura + ' foi confirmada e não foi encontrado nenhum indício de vazamento no local. Diante disso, concluímos que as contas foram faturadas de acordo com o consumo registrado pelo hidrômetro.'
        }
    else {
        var diag = 'Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente e a leitura ' + leitura + ' foi confirmada. O lacre ' + lacre + ' está intacto e não foi encontrado nenhum indício de vazamento no local. Diante disso, concluímos que as contas foram faturadas de acordo com o consumo registrado pelo hidrômetro.';
    }
    if ( refs == "" ) {
        var prov = 'Informamos que, de acordo com as normas e regulamentos vigentes, não há nenhuma prerrogativa para a concessão de desconto nesta situação relatada.';
    }
    else {
        var prov = 'Informamos que, de acordo com as normas e regulamentos vigentes, não há nenhuma prerrogativa para a concessão de desconto nesta situação relatada.\n Atualizado vencimento da(s) conta(s) referência ' + refs + '.';
    }

    Revisao(0,0,0,diag,prov);
};

function VazInternNVisCol() { //Vaz. Interno

    // var leitura = document.getElementById(leit).innerText;
    // var lacre = document.getElementById(lacr).innerText;
    var dataidt = getDynamicIdByText('form\\:j_idt', 'Data do cadastro:');
    var dataID = formatCSSSelector(dataidt) + '_content';
    var data = document.querySelector(dataID + ' > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').textContent;
    var vaz = prompt('Digite o local do vazamento: Ex. no ramal do quintal ');
    // var conta = prompt('Digite a(s) conta(s): Ex. 01/2023, 02/2023 e 03/2023');
    // if ( lacre == "" ) {
    //     var diag = 'Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.';
    // }
    // else {
    //     var diag = 'Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + ', lacre ' + lacre + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.';
    // }

    // var prov = 'Conta(s) referência ' + conta + ' revisada(s) conforme Resolução ADASA nº 14/2011.';

    // Revisao(1,0,0,diag,prov);

    //Alteração para o novo sistema de revisão
    abrirModalRevisao().then(({ contas, tabelaTarifa }) => {
        const irregularidade = `Conta(s) referência(s) ${contas.map(c => c.conta).join(' , ')} com consumo acima da média do imóvel.`;
        const apuracao = `Vistoria realizada em ${data} que confirmou vazamento interno no imóvel sanado pelo usuário: ${vaz};`;
        const criterios = contas.map(c => {
            let criterio = `Conta ${c.conta} revisada `;
            if (c.tipoRefat === 'LS') {
                criterio += `pelo limite superior (${c.ls}m³) na tarifa de água.`;
            } else if (c.tipoRefat === 'LSM') {
                criterio += `pelo limite superior (${c.ls}m³) na tarifa de água e média (${c.media}m³) na tarifa de esgoto.`;
            } else if (c.tipoRefat === 'M') {
                criterio += `pela média (${c.media}m³) na tarifa de esgoto.`;
            }
            return criterio;
        }).join(' ');
        const tarifa = `Tabela de tarifa vigente a partir de ${tabelaTarifa};`;
        const memoriacalculo = contas.map(c =>
            `Conta ${c.conta} inicial faturada com ${c.consumo}m³ que resultou numa conta de R$ ${c.valorConta} e nova conta faturada no valor de R$ ${c.novoValor}.`
        ).join(' ');

        RevisaoComRefaturamento(1, 0, 0, irregularidade, apuracao, criterios, tarifa, memoriacalculo);
    });

};

function CltAusenteVistRealizada() { //Cliente Ausente - Vistoria Realizada

    var dataidt = getDynamicIdByText('form\\:j_idt', 'Data do cadastro:');
    var dataID = formatCSSSelector(dataidt) + '_content';
    var leitura = document.getElementById(leit).innerText;

    var data = document.querySelector(dataID + ' > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').textContent;

    var diag = `Comunicamos que em ${data} a CAESB esteve em seu imóvel para realizar vistoria, porém não havia ninguém no local para acompanhar a vistoria.`;
    var prov = 'Acesso ao hidrômetro, com leitura ' +leitura+ ' confirmada.  Caso necessário, realizar novo pedido de vistoria em nosso site (https://www.caesb.df.gov.br/portal-servicos/) ou aplicativo e caso não fique ninguém no imóvel solicitar vistoria com agendamento, onde poderá escolher o dia e o período, matutino ou vespertino, para realização da vistoria, sendo cobrada uma taxa de R$ 37,22 no próximo faturamento.';

    Revisao(0,0,0,diag,prov);
};

function VazDepoisCavalete() {
    // var leitura = document.getElementById(leit).innerText;
    var OSC = prompt('Informe a OSC de conserto de cavalete: ');
    var data = prompt('Informe a data do conserto.');
    // var conta = prompt('Digite a(s) conta(s): Ex. 01/2023. \nDeixe em branco se não houve revisão');
    // var diag = 'Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + '. \nVazamento após o hidrômetro sanado pela CAESB em ' +data+ ' pela OSM ' +OSC+ '.';

    // if ( conta == "" ) {
    //     var prov = 'Contas com consumo dentro da média do imóvel.';
    // }
    // else {
    //     var prov = 'Conta(s) referência ' + conta + ' revisada(s) conforme Resolução ADASA nº 14/2011.';
    // }
    // Revisao(0,0,0,diag,prov);

    //Alteração para o novo sistema de revisão
    abrirModalRevisao().then(({ contas, tabelaTarifa }) => {

        const irregularidade = `Conta(s) referência(s) ${contas.map(c => c.conta).join(' e ')} com consumo acima da média do imóvel devido a vazamento após o hidrômetro.`;
        const apuracao = `Vazamento após o hidrômetro sanado pela CAESB em ${data} pela OSM ${OSC}.`;
        const criterios = contas.map(c => {
            let criterio = `Conta ${c.conta} revisada `;
            criterio += `pela média (${c.media}m³).`;
            return criterio;
        }).join(' ');
        const tarifa = `Tabela de tarifa vigente a partir de ${tabelaTarifa};`;
        const memoriacalculo = contas.map(c =>
                                          `Conta ${c.conta} inicial faturada com ${c.consumo}m³ que resultou numa conta de R$ ${c.valorConta} e nova conta faturada no valor de R$ ${c.novoValor}.`
                                         ).join(' ');

        if (contas.length === 0) {
            const diag = `Vazamento após o hidrômetro sanado pela CAESB em ${data} pela OSM ${OSC}.`;
            const prov = 'Contas com consumo dentro da média do imóvel.';
            Revisao(0,0,0,diag,prov);
        } else {
            RevisaoComRefaturamento(1, 0, 0, irregularidade, apuracao, criterios, tarifa, memoriacalculo);
        }
    });
};

function VazCoberto() { //Vaz Coberto

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;

    if ( lacre == "" ) {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' +leitura + ' foi confirmada. Usuário informa que sanou vazamento, porém local já estava tampado/coberto, não sendo possível verificar o vazamento sanado.');
    }
    else {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' +leitura + ' foi confirmada e lacre ' +lacre+ '. Usuário informa que sanou vazamento, porém local já estava tampado/coberto, não sendo possível verificar o vazamento sanado.');
    }

    var prov = ('A revisão de contas solicitada não pode ser concedida devido à falta de documentação comprobatória do conserto do vazamento imperceptível e/ou da realização da vistoria para verificação do mesmo. \nConforme a Resolução 014/2011 da ADASA, para obter o desconto mencionado, é necessário apresentar o termo de ocorrência de eliminação do vazamento imperceptível e comprovantes do material/serviço utilizado para reparar o vazamento. Alternativamente, é possível solicitar uma vistoria para verificar novamente o vazamento, desde que o mesmo esteja exposto para registro fotográfico. As fotos do conserto, juntamente com os comprovantes, podem ser apresentados em novo pedido de revisão pelo Autoatendimento no site da CAESB ou Aplicativo.')

    Revisao(0,0,0,diag,prov);
};

function ErroLeitura() { //Erro de leitura

    // var leitura = document.getElementById(leit).innerText;
    // var lacre = document.getElementById(lacr).innerText;
    // var conta = prompt('Digite a(s) conta(s): Ex. 01/2023, 02/2023 e 03/2023');

    // if ( lacre == "" ) {
    //     var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada. Houve erro de leitura.');
    // }
    // else {
    //     var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada, lacre ' +lacre+'. Houve erro de leitura.');
    // }

    // var prov = ('Conta referência ' +conta+ ' refaturada conforme consumo do imóvel');

    // Revisao(0,0,0,diag,prov);


    // Novo modelo de revisão

    var conta = prompt('Digite a(s) conta(s): Ex. 01/2023, 02/2023 e 03/2023');
    const consumoAnterior = prompt('Digite o consumo da conta faturada errada (em m³):');
    var valorOriginal = prompt('Digite o valor original da conta:');
    var leitura = document.getElementById(leit).innerText;
    var valorCorrigido = prompt('Digite o valor corrigido da conta:');
    const consumoCorreto = prompt('Digite o consumo correto (em m³):');
    var dataidt = getDynamicIdByText('form\\:j_idt', 'Data do cadastro:');
    var dataID = formatCSSSelector(dataidt) + '_content';
    var data = document.querySelector(dataID + ' > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(5) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)').textContent;
    const irregularidade = `Erro na leitura coletada na referência ${conta};`;
    const apuracao = `Vistoria realizada em ${data} que confirmou o erro de leitura;`;
    const criterios = `Leitura correta coletada (${leitura}) subtraída da leitura anterior.;`;
    const tarifa = `Tabela de tarifa vigente a partir de 01/06/2024;`;
    const memoriacalculo = `Conta ${conta} inicial faturada com ${consumoAnterior}m³ que resultou numa conta de R$ ${valorOriginal} e nova conta faturada com ${consumoCorreto}m³ que resultou numa conta de R$ ${valorCorrigido}.`;

    RevisaoComRefaturamento(0,0,0 , irregularidade, apuracao, criterios, tarifa, memoriacalculo);

};

function AgendLeitura() { //Agendamento de leitura

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var conta = prompt('Digite a conta: Ex. 01/2023');

    if ( lacre == "" ) {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada. Vistoria de agendamento de leitura realizada para retirada de multa por impedimento de leitura.');
    }
    else {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada, lacre ' +lacre+' . Vistoria de agendamento de leitura realizada para retirada de multa por impedimento de leitura.');
    }

    var prov = ('Conta referência ' +conta+ ' refaturada conforme consumo do imóvel e retirada multa de impedimento de leitura.');

    Revisao(0,0,0,diag,prov);
};

function AgendLeituraForaPrazo() { //Agendamento de leitura aberta fora do prazo

    var conta = prompt('Digite a conta: Ex. 01/2023');

    var diag = ('Informamos que em caso de ocorrência impeditiva de leitura, a conta de água é faturada pela média de consumo do imóvel dos últimos doze meses e quando ocorre dois ou mais impedimentos consecutivos passa a' +
                ' ser cobrada multa por impedimento de leitura.\n A multa de impedimento de leitura pode ser retirada mediante AGENDAMENTO de leitura no MESMO MÊS em que é lançada a multa, onde o usuário ao solicitar o ' +
                'agendamento informa a data e o período, matutino ou vespertino, para o qual gostaria que fosse realizada a vistoria, onde será coletada a leitura atual e feita a revisão de contas. ');

    var prov = ('Conta referência ' +conta+ ' mantida, pedido de revisão indeferido, pois foi solicitado o agendamento APÓS o faturamento da conta seguinte ao impedimento gerador da multa. \n' +
               'Salientamos ainda que o usuário tem a opção de solicitar o remanejamento do hidrômetro para fora do imóvel, dando acesso à leitura, ou se cadastrar na Auto Leitura pelo site da CAESB, sendo necessário informar a leitura mensalmente pelo site.');

    Revisao(0,0,0,diag,prov);
};

function VazVisCol() { //Vazamento visível e coletado

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var vaz = prompt('Digite o local do vazamento: Ex. na caixa de descarga ');

    if ( lacre == "" ) {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada. Vazamento interno sanado, visível e coletado para o esgoto ' + vaz + '.');
    }

    else {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada, lacre ' +lacre+' . Vazamento interno sanado, visível e coletado para o esgoto ' + vaz + '.');
    }

    var prov = ('Após analisarmos o seu pedido de revisão tarifária referente ao vazamento visível nas instalações hidráulicas da sua unidade usuária, verificamos que, de acordo com a Resolução ADASA nº 14/2011, Art. 118, o desconto sobre o consumo excedente só é aplicável quando há comprovação e subsequente eliminação de vazamento imperceptível nas instalações hidráulicas. Além disso, conforme o § 4º da mesma resolução, caso seja comprovado que o excesso de água não foi direcionado para a rede pública de esgotos sanitários, a tarifa de esgoto será calculada com base na média de consumo da unidade usuária. \nPortanto, devido ao fato de o vazamento ser visível e a água ter escoado para a rede de esgoto, não é possível conceder desconto tanto na tarifa de água quanto na de esgoto.');

    Revisao(1,1,1,diag,prov);
};

function VazNegado() { //Vaz.Negado Mais de 2 LS.

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var vaz = prompt('Digite o local do vazamento: Ex. no ramal do quintal ');
    var conta = prompt('Digite a(s) conta(s) que já receberam LS: Ex. 01/2023, 02/2023 e 03/2023');

    if ( lacre == "" ) {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.');
    }
    else {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + ', lacre ' + lacre + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.');
    }

    var prov = ('Conforme o ART. 118, §5º da Resolução 014/2011 da ADASA, o desconto será aplicado em, no máximo, duas faturas mensais subsequentes que comprovadamente foram influenciadas pelo vazamento confirmado pelo prestador de serviços. Esse desconto está limitado a uma ocorrência de vazamento em um período de 12 (doze) meses. \nInformamos que a solicitação de revisão não procede, uma vez que já foi concedido desconto por vazamento na(s) conta(s) ' +conta+ '. \nAtualizado vencimento da conta xx/2023.');

    Revisao(0,0,0,diag,prov);
};

function DescAutoLeitura() { // Descadastrado da auto leitura mes

    const modal = document.createElement('div');
    var opcao;
    modal.className = 'modal';
    modal.style.position = 'fixed';
    modal.style.zIndex = '9999';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.height = 'auto';
    modal.innerHTML = `
        <div class="modal-content" style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 10vh;">
            <h3>Escolha uma opção</h3>
            <button id="opcao1">Duas ocorrências de autoleitura não informada</button>
            <button id="opcao2">Leitura não realizada em ABRIL</button>
            <button id="opcao3">Leitura não realizada em OUTUBRO</button>
        </div>
    `;

    modal.querySelector('#opcao1').addEventListener('click', function() {
        opcao = 'duasnaolidas';
        modal.remove();
        var diag = 'Conforme informado no termo de autoleitura, em caso de não informação de autoleitura por dois meses seguidos, usuário é automaticamente descadastrado do sistema de autoleitura.';
        var prov = 'Usuário somente poderá se cadastrar novamente após 06 meses, como constante no Termo de Adesão da autoleitura.';
        Revisao(0,0,0,diag,prov);
    });

    modal.querySelector('#opcao2').addEventListener('click', function() {
        opcao = 'abril';
        modal.remove();
        var diag = 'Conforme informado no termo de autoleitura, nos meses de ABRIL e OUTUBRO a CAESB deverá necessariamente ter acesso ao hidrômetro para vistoria e leitura.\n' +
            'Como não houve acesso à leitura no mês de ' + opcao + ', usuário foi descadastrado da autoleitura automaticamente.';
        var prov = 'Usuário somente poderá se cadastrar novamente após 06 meses, como constante no Termo de Adesão da autoleitura.';
        Revisao(0,0,0,diag,prov);
    });

    modal.querySelector('#opcao3').addEventListener('click', function() {
        opcao = 'outubro';
        modal.remove();
        var diag = 'Conforme informado no termo de autoleitura, nos meses de ABRIL e OUTUBRO a CAESB deverá necessariamente ter acesso ao hidrômetro para vistoria e leitura.\n' +
            'Como não houve acesso à leitura no mês de ' + opcao + ', usuário foi descadastrado da autoleitura automaticamente.';
        var prov = 'Usuário somente poderá se cadastrar novamente após 06 meses, como constante no Termo de Adesão da autoleitura.';
        Revisao(0,0,0,diag,prov);
    });

    document.body.appendChild(modal);
};

function AlteracaoCategoria() { // Alteração de categoria

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var categoriaAtual = prompt('Digite a categoria anterior: ');
    var categoriaNova = prompt('Digite a nova categoria: ');

    var diag;
    if (lacre == "") {
        diag = 'Hidrômetro com leitura ' + leitura + ' e em bom funcionamento, abastece imóvel de categoria ' + categoriaNova + '.';
    } else {
        diag = 'Hidrômetro com leitura ' + leitura + ' e lacre ' + lacre + ' e em bom funcionamento, abastece imóvel de categoria ' + categoriaNova + '.';
    }

    var prov = 'Estivemos em seu endereço e constatamos alterações nos dados cadastrais deste imóvel. Diante do exposto e em atenção ao Artigo 70 da Resolução ADASA nº 14/2011, realizaremos a atualização em nosso sistema, conforme abaixo.\n' +
               'Alterado da categoria ' + categoriaAtual + ' para ' + categoriaNova + 'com efeito à partir do próximo faturamento.\n' +
               'Caso não concorde com esta alteração poderá solicitar uma revisão de dados cadastrais no site da CAESB, www.caesb.df.gov.br, após cadastro prévio.\n' +
               'Solicitações, serviços e informações podem ser obtidos por meio do aplicativo da CAESB, autoatendimento no site da CAESB, Central 115 ou unidades de atendimento presencial.';

    Revisao(0,0,0,diag,prov);
}

function AlteracaoUnidadesConsumo() { // Alteração de Unidades de Consumo

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var usuario = prompt('Digite o nome do usuario: ');
    var unidadesConsumoAtual = prompt('Digite o nº de Unidades de Consumo anterior: ');
    var unidadesConsumoNova = prompt('Digite o novo nº de Unidades de Consumo: ');

    var diag;
    if (lacre == "") {
        diag = 'Hidrômetro com leitura ' + leitura + ' e em bom funcionamento, abastece imóvel com ' + unidadesConsumoNova + ' unidades de consumo.';
    } else {
        diag = 'Hidrômetro com leitura ' + leitura + ' e lacre ' + lacre + ' e em bom funcionamento, abastece imóvel com ' + unidadesConsumoNova + ' unidades de consumo.';
    }

    var prov = 'Estivemos em seu endereço e constatamos alterações nos dados cadastrais deste imóvel. Diante do exposto e em atenção ao Artigo 70 da Resolução ADASA nº 14/2011, realizaremos a atualização em nosso sistema, conforme abaixo.\n' +
               'Alterado de ' + unidadesConsumoAtual + ' unidades de consumo para ' + unidadesConsumoNova + ' unidades de consumo com efeito à partir do próximo faturamento.\n' +
               'Caso não concorde com esta alteração poderá solicitar uma revisão de dados cadastrais no site da CAESB, www.caesb.df.gov.br, após cadastro prévio.\n' +
               'Solicitações, serviços e informações podem ser obtidos por meio do aplicativo da CAESB, autoatendimento no site da CAESB, Central 115 ou unidades de atendimento presencial.';

    Revisao(0,0,0,diag,prov);
}


function DistribuicaoConsumo() { // Distribuição de Consumo

    const input = prompt('Copie e cole da FICHA a distribuição');
    // Regex para extrair as informações relevantes do input
    const refsRegex = /(\d{2}\/\d{4})(?:,|$)/g;
    const refsMatches = Array.from(input.matchAll(refsRegex), match => match[1]);
    const totalVolumeRegex = /volume total de (\d+m³)/;
    const totalVolumeMatch = input.match(totalVolumeRegex);
    const monthsRegex = /resultando em (\d+) meses/;
    const monthsMatch = input.match(monthsRegex);
    const firstMonthRegex = /sendo o primeiro de (\d+m³)/;
    const firstMonthMatch = input.match(firstMonthRegex);


    // Variáveis com as informações extraídas
    const refs = refsMatches.slice(-2); // Pega as duas últimas referências
    const totalVolume = totalVolumeMatch[1];
    const months = parseInt(monthsMatch[1]);
    const firstMonth = firstMonthMatch[1];

    // Frase 1
    const lastRef = refs[1];
    const previousMonths = refsMatches.length - 1;
    const frase1 = `Houve acúmulo de consumo na conta referência ${lastRef} por ocorrência impeditiva no(s) ${previousMonths} mes(es) anterior(es).`;

    // Frase 2
    const firstRef = refsMatches[0];
    const frase2 = `Conta referência ${lastRef} refaturada pela distribuição do consumo dos meses ${firstRef} a ${lastRef}, com consumo total de ${totalVolume} em ${months} meses.`;

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;

    if ( lacre == "" ) {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' + leitura + ' foi confirmada. Não foi encontrado nenhum indício de vazamento no local. \n' + frase1);
    }
    else {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' + leitura + ' foi confirmada e o lacre ' + lacre + ' está intacto. Não foi encontrado nenhum indício de vazamento no local. \n' + frase1);
    }

    var prov = frase2;

    Revisao(0,0,0,diag,prov);
};

function VazAbaixoLs() { // Vaz.Abaixo LS S/Esg

    var leitura = document.getElementById(leit).innerText;
    var lacre = document.getElementById(lacr).innerText;
    var vaz = prompt('Digite o local do vazamento: Ex. no ramal do quintal ');
    var conta = prompt('Digite a(s) conta(s) que estão abaixo do LS: Ex. 01/2023, 02/2023 e 03/2023');

    if ( lacre == "" ) {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + '. \nVazamento interno sanado, não visível ' + vaz + '.');
    }
    else {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + ', lacre ' + lacre + '. \nVazamento interno sanado, não visível ' + vaz + '.');
    }


    var prov = ('Conforme ART. 118, §3º da resolução 014/2011 da ADASA o desconto na tarifa de água será no volume que ultrapassar o Limite Superior, sendo este 80% do consumo médio dos últimos 12 meses do imóvel. Conta(s) referência ' + conta + ' com consumo abaixo do Limite Superior.');

    Revisao(1,0,0,diag,prov);
};

async function TrocaHD() { // Troca de HD

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre atual: ');
    var usuario = prompt('Digite o nome do usuario: ');
    var motivo = prompt('Digite o motivo da troca: (parado, danificado, etc)');
    var hdnovo = prompt('Digite o novo HIDRÔMETRO: (Y20S123456) ');
    var lacrenovo = prompt('Digite o novo LACRE: ');
    var hd = document.querySelector("#form1\\:tbHidro_data > tr:nth-child(1) > td:nth-child(1)").innerText;

    if (lacre == "") {
        diag = ('Em vistoria verificamos que o hidrômetro ' + hd + ' está ' + motivo + ' com leitura ' + leitura + '.');
    } else {
        diag = ('Em vistoria verificamos que o hidrômetro ' + hd + ' está ' + motivo + ' com leitura ' + leitura + ' e lacre ' + lacre + '.');
    }
    var prov = ('Hidrômetro substituído pelo ' + hdnovo + ', lacre ' + lacrenovo + ' e leitura 0.');

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);
    /*
    PrimeFaces.ab({s:'form1:tbHidro:0:j_idt638',p:'form1:tbHidro:0:j_idt638',u:'formSubstituicaoHidrometro',onco:function(xhr,status,args){PF('dlgSubstituicaoHidrometro').show();}});

    const sub = await waitForElement('#formSubstituicaoHidrometro\\:pnlHidAntigo_header > span:nth-child(1)');
    var nleit = document.getElementById("#formSubstituicaoHidrometro\\:j_idt1144");
    var situ = document.getElementById("formSubstituicaoHidrometro:novaSitu_8");
    var pesqhd = document.evaluate("/html/body/div[22]/div[2]/form[2]/div/div[2]/table/tbody/tr/td[9]/button/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (nleit !== null) {
        nleit.value = leitura;
    }
    if (situ) {
        situ.click();
    }
    if (pesqhd) {
        pesqhd.click();
        const nhd = await waitForElement('#formPesquisarHidrometro\\:j_idt1335');
        nhd.value = hdnovo;
        const pesq = document.evaluate("/html/body/div[22]/div[2]/form[1]/span/table/tbody/tr/td[2]/table/tbody/tr/td/button/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();
        const check = await waitForElement('/html/body/div[22]/div[2]/form[2]/div/div[2]/table/tbody/tr/td[9]/button/span[1]');
        check.click();
    }
    var leitn = document.getElementByID('#formSubstituicaoHidrometro\\:j_idt1159').value = 0;
    */
};

function UsuarioDescadastr() { // Tarifa Social - Usuario Descadastr.
    var data = prompt('Informe a data que usuário foi descadastrado (ficha): ');
    var diag = ('Para concessão da tarifa social, é necessário que o CPF do beneficiário conste do relatório de integrantes do CadÚnico encaminhado pela SEDES e que a renda média familiar seja igual ou inferior a R$210,00 (duzentos e dez reais), caracterizando-se como família pobre ou extremamente pobre. \nCliente revogado por não estar mais nos critérios estabelecidos de acordo com informações recebidas da SEDES/GDF em ' + data + '.');
    var prov = ('Informamos que o cadastro na tarifa social depende exclusivamente das informaçes encaminhadas pela SEDES/GDF e CPF do(a) usuário(a) não consta no ltimo relatório recebido pela CAESB - Caso necessário procurar o CRAS ou SEDES para atualização cadastral. \nA alteração para tarifa social é realizada de forma automática caso usuário esteja vinculado a apenas um imóvel.');
    Revisao(0,0,0,diag,prov);
};

function MultaImpCorte() { //Multa de impedimento de corte - negado
    var diag = `Comunicamos que, de acordo com as normas estabelecidas na Resolução ADASA nº 03/2012 (atualizada pela Resolução nº 21/2023) e na Resolução ADASA nº 11/2014, bem como na Cláusula Oitava deste, qualquer impedimento ao acesso ao  padrão de ligação de água, incluindo o cavalete e o hidrômetro para a realização da leitura, vistoria preventiva ou para a suspensão do fornecimento de água constitui uma infração passível de penalidade.
                \nNesse sentido, destacamos que o prestador de serviços está autorizado a aplicar a penalidade de multa sem a necessidade de iniciar procedimentos adicionais quando ocorrer impedimento ao acesso ao hidrômetro para a suspensão do fornecimento de água, conforme estipulado no artigo 31 da Resolução ADASA nº 03/2012. A multa a ser aplicada será calculada com base nos critérios estabelecidos no artigo 5º-C da mesma resolução.`;
    var prov = `Alertamos que o não pagamento das contas constitui descumprimento contratual, sujeitando o usuário à suspensão do serviço de abastecimento de água, conforme previsto no artigo 82, §3º, e no artigo 121, inciso I, da Resolução ADASA nº 11/2014, onde o usuário é notificado mensalmente nas contas de consumo mensal sobre as contas em aberto no imóvel e a possibilidade de corte em caso de permanência no inadimplemento.
                \nPedido de revisão indeferido, conta mantida.`;

    Revisao(0,0,0,diag,prov);
};

function ForaDaLista() { // Tarifa Social - Fora da lista
    var diag = ('Para concessão da tarifa social, é necessário que o CPF do beneficiário conste do relatório de integrantes do CadÚnico encaminhado pela SEDES e que a renda média familiar seja igual ou inferior a R$210,00 (duzentos e dez reais), caracterizando-se como família pobre ou extremamente pobre.');
    var prov = ('Informamos que o cadastro na tarifa social depende exclusivamente das informações encaminhadas pela SEDES/GDF e CPF do(a) usuário(a) não consta no último relatório recebido pela CAESB - Caso necessário procurar o CRAS ou SEDES para atualização cadastral. \nA alteração para tarifa social é realizada de forma automática caso usuário esteja vinculado a apenas um imóvel.');
    Revisao(0,0,0,diag,prov);
};

function UsuarioJaTemTarSocial() { // Tarifa Social - Usuário já tem tar. social
    var inscricao = document.evaluate("/html/body/div[8]/div/form[1]/div[1]/div/table/tbody/tr/td[1]/table[2]/tbody/tr/td[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var diag = ('Informamos que o imóvel de inscrição ' + inscricao + ' já possui o benefício de tarifa social.');
    var prov = ('Salientamos que para concessão da tarifa social, é necessário que o CPF do beneficiário conste do relatório de integrantes do CadÚnico encaminhado pela SEDES e que a renda média familiar seja igual ou inferior a R$210,00 (duzentos e dez reais), caracterizando-se como família pobre ou extremamente pobre. O cadastro na tarifa social depende exclusivamente das informaçes encaminhadas pela SEDES/GDF e a alteração para tarifa social é realizada de forma automática caso usuário esteja vinculado a apenas um imóvel.');
    Revisao(0,0,0,diag,prov);
};

function UsuarioVinculadoTarSocial() { // Tarifa Social - Usuário vinculado
    var inscricao = document.evaluate("/html/body/div[8]/div/form[1]/div[1]/div/table/tbody/tr/td[1]/table[2]/tbody/tr/td[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var diag = ('Usuário é beneficiário de tarifa social e solicita vinculação do imóvel de inscrição ' + inscricao + ' para o benefício.');
    var prov = ('Imóvel selecionado para concessão de tarifa social, alteração terá efeito à partir do próximo faturamento.');
    Revisao(0,0,0,diag,prov);
};