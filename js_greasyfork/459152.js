// ==UserScript==
// @name        HelpGCOM
// @namespace   https://sistemas.caesb.df.gov.br/gcom/
// @match       *sistemas.caesb.df.gov.br/gcom/*
// @match       *sistemas.caesb/gcom/*
// @version     1.49
// @grant       none
// @license     MIT
// @description Auxiliar para trabalhos no GCOM!
// @downloadURL https://update.greasyfork.org/scripts/459152/HelpGCOM.user.js
// @updateURL https://update.greasyfork.org/scripts/459152/HelpGCOM.meta.js
// ==/UserScript==

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

// Cria os elementos do widget
var sectionTitle = createSectionTitle('--- TITULARIDADE ---');
var button2 = createButton('Alteração para Titular Atual');
var button3 = createButton('Alteração Realizada');
var button4 = createButton('Alteração com Débitos');
var button5 = createButton('Alteração Falta Documentos');
var button7 = createButton('Abrir todos os anexos');
var sectionTitle2 = createSectionTitle('--- REVISAO DE CONTAS ---');
var button8 = createButton('Usuario Orientado Vazamento');
var button9 = createButton('Portão fechado');
var button10 = createButton('Sem Vazam. Improcedente');
var button11 = createButton('Vazamento Interno Ñ Vis/Col');
var button12 = createButton('Leitura informada pelo usuario');
var button13 = createButton('Vazamento Coberto');
var button14 = createButton('Erro de leitura');
var button15 = createButton('Agendamento de leitura');
var button16 = createButton('Vazamento Visivel/Coletado');
var button17 = createButton('NºHid.ñ conf. já atualizado');
var button18 = createButton('Vaz.Negado mais de 2 LS');
var button20 = createButton('Distribuição de Consumo');
var button21 = createButton('Vaz.Abaixo LS S/Esg');
var button26 = createButton('Clt ausente Vist realizada');
var button31 = createButton('Vaz depois cavalete');
var button22 = createButton('Troca de HD**');
var sectionTitle3 = createSectionTitle('--- EXTRAS ---');
var button1 = createButton('Colocar Hora Atual');
var button6 = createButton('Anexar arquivos');
var button19 = createButton('Reforço feita hoje');
var button23 = createButton('Leit 04/2023');
var sectionTitle4 = createSectionTitle('--- TARIFA SOCIAL ---');
var button24 = createButton('Usuario Descadastr.');
var button25 = createButton('Fora da Lista');
var sectionTitle5 = createSectionTitle('--- EXEC.CONS. CORTE ---');
var button27 = createButton('Proprietario');
var button28 = createButton('Inq.Sem.Cons.');
var button29 = createButton('Inq.Cons.Final');
var button30 = createButton('Corte ñ exec.');
var credits = $('<div></div>').css({
  'font-size': '8px',
  'text-align': 'right',
  'margin-top': '10px',
  'font-weight': 'bold'
}).text('Ver. 1.49 - Feito por Willian Verri');

// Adiciona os elementos ao widget
myWidget.append(
    sectionTitle,
    button2,
    button3,
    button4,
    button5,
    button7,
    sectionTitle2,
    button8,
    button9,
    button10,
    button11,
    button12,
    button13,
    button14,
    button15,
    button16,
    button17,
    button18,
    button20,
    button21,
    button26,
    button31,
    button22,
    sectionTitle3,
    button1,
    button6,
    button19,
    button23,
    sectionTitle4,
    button24,
    button25,
    sectionTitle5,
    button27,
    button28,
    button29,
    button30,
    credits
);

// Torna os botões visíveis ao clicar nos títulos de seção
myWidget.find('div[style*="font-weight: bold"]').click(function() {
  $(this).nextUntil('div').filter('button').slideToggle();
});

// Verifica se a URL corresponde à página de "baixa" do atendimento
if (window.location.href.includes('app/atendimento/os/baixa')) {
    $('body').append(myWidget);
}

// LISTAGEM COM TODOS OS IDT's

// Colocar nomes dos anexos automaticamente
const elementPairs = [
    ['#formConfirmaAnexo\\:j_idt865 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexo\\:j_idt869'],  // Anexo na tela Atendimento da Ordem de serviço (Anexos do Atendimento)
    ['#formConfirmaAnexo\\:j_idt1767 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexo\\:j_idt1771'],
    ['#formConfirmaAnexoEmail\\:j_idt1998 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexoEmail\\:j_idt2001'],  // ANEXO DA BAIXA DA OSC.
    ['#formClienteConfirmaAnexo\\:j_idt615 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)', '#formClienteConfirmaAnexo\\:descricaoArquivo'],
    ['#formConfirmaAnexo\\:j_idt746 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexo\\:j_idt749'],
    ['#formCadastroAnexo\\:j_idt707 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)', '#formCadastroAnexo\\:j_idt710'],
];

// Adiciona botões na função de REFATURAR CONTA.
const contaTitleElement = document.querySelector('#j_idt683_title');
// Adiciona botão na função de atualizar vencimento.
const AttVencElement = document.querySelector('#j_idt661_title');
// Text area da tela de atualizar vencimento de conta
const textarea2idt = '#formVencimento\\:j_idt679';
// Text area da tela de refaturamento
const textareaidt = '#formAlteracaoConta\\:j_idt745';
// Leitura da tela de refaturamento
const leitidt = '#formAlteracaoConta\\:j_idt720';
// botão de media no esgoto e leitura criada nao na tela de refaturamento.
const mediaesgoto = '#formAlteracaoConta\\:j_idt736 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)';
const leituracriadanao = '#formAlteracaoConta\\:j_idt740 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)';

// Abrir anexos na tela de atendimento
const tbodyidt = '#abas\\:formAtendimentoAnexo\\:j_idt652_data';
// Tela de abrir anexos na tela de atendimento
const prefix3 = 'abas:formAtendimentoAnexo:j_idt652:';
const menuId3 = 'j_idt658_menu';
const abrir3 = 'j_idt661';
const prefix4 = 'abas:formAtendimentoAnexo:j_idt662:';
const menuId4 = 'j_idt668_menu';
const abrir4 = 'j_idt669';

// Tela de abrir anexos na tela de baixa
// Anexos do atendimento
const prefix1 = 'formOsAnexoBean:abasAtendimento:j_idt1761:';
const menuId1 = 'j_idt1767_menu';
const abrir1 = 'j_idt1768';
// Anexos da Ordem de Serviço
const prefix2 = 'formOsAnexoBean:abasAtendimento:tableAtendimento:';
const menuId2 = 'j_idt1755_menu';
const abrir2 = 'j_idt1758';

// CheckBox do enviar email resposta
const checkemail1 = 'formEnviarEmail:j_idt1807_input';
const checkemail2 = 'formEnviarEmail:j_idt1809_input';
const botaoemail = 'formEnviarEmail:j_idt1813';

// Tela de Baixa - usuário, leitura e titulo de anexar.
const tagusuario = '#form1\\:j_idt514';
const tagleitura = '#form1\\:j_idt516';
const taganexar = '#form1\\:j_idt499_header';

(function() {
    var checkExist = setInterval(function() {

        if (window.location.href.includes('app/atendimento/os/baixa')) {

            // Verifica se o elemento #dlgEnviarEmail1_title está presente
            var dlgEnviarEmailElement = document.querySelector('html body div#dlgEnviarEmail1.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-shadow.ui-hidden-container.ui-dialog-absolute.ui-draggable[aria-hidden="false"]');
            if (dlgEnviarEmailElement) {
                // Verifica se os checkboxes estão marcados
                var checkbox1 = document.getElementById(checkemail1);
                var checkbox2 = document.getElementById(checkemail2);
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
                    var botaoGerarTextoEmail = document.getElementById(botaoemail);
                    if (botaoGerarTextoEmail) {
                        botaoGerarTextoEmail.click();
                    }
                }
            }
        }


        // Botão de Abrir Anexos na tela de Atendimento
        const tabElement = document.querySelector('li.ui-state-default.ui-corner-top.ui-tabs-selected.ui-state-active[aria-selected="true"]');
        const tbody = document.querySelector(tbodyidt);

        if (tabElement && (!tabElement.nextSibling || tabElement.nextSibling.nodeName !== 'BUTTON') && tbody ) { //
            console.log('Entrou');

            // Cria um botão
            var button = document.createElement('button');
            button.textContent = 'Abrir todos os anexos';
            button.addEventListener('click', function() {
                AbrirAnexosAtendimento();
            });

            // Aplica estilos ao botão
            button.style.cssText = 'background-color: #0b61a4; color: white; border: none; padding: 5px 10px; text-align: center; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 5px; margin-left: 10px;';

            // Insere o botão após o elemento <li>
            tabElement.parentNode.insertBefore(button, tabElement.nextSibling);

        }

        // Adiciona botão de abrir anexos na tela de ANEXOS - BAIXA
        const baixaElement = document.querySelector("#formOsAnexoBean\\:abasAtendimento\\:panelArquivos_header");
        const baixaElement2 = document.querySelector("#formOsAnexoBean\\:abasAtendimento\\:panelAtendimentoArquivos_header");
        if (baixaElement && (countElements(prefix2, menuId2, 20) > 0) && (!baixaElement.nextSibling || baixaElement.nextSibling.nodeName !== 'BUTTON')) {
            console.log('Botão anexos tela baixa');
            // Cria um botão
            var button = document.createElement('button');
            button.textContent = 'Abrir todos os anexos';
            button.addEventListener('click', function() {
                event.preventDefault();
                button7.click();
            });

            // Aplica estilos ao botão
            button.style.cssText = 'background-color: #0b61a4; color: white; border: none; padding: 5px 10px; text-align: center; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 5px; margin-left: 10px;';

            // Insere o botão após o elemento <li>
            baixaElement.parentNode.insertBefore(button, baixaElement.nextSibling);
        }
        if (baixaElement2 && (countElements(prefix1, menuId1, 20) > 0) && (!baixaElement2.nextSibling || baixaElement2.nextSibling.nodeName !== 'BUTTON')) {
            console.log('Botão anexos tela baixa');
            // Cria um botão
            var button = document.createElement('button');
            button.textContent = 'Abrir todos os anexos';
            button.addEventListener('click', function() {
                event.preventDefault();
                button7.click();
            });

            // Aplica estilos ao botão
            button.style.cssText = 'background-color: #0b61a4; color: white; border: none; padding: 5px 10px; text-align: center; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 5px; margin-left: 10px;';

            // Insere o botão após o elemento <li>
            baixaElement2.parentNode.insertBefore(button, baixaElement2.nextSibling);
        }

        const targetElement = document.querySelector('#form1\\:dadosBaixa_header');
        if (targetElement && (!targetElement.nextSibling || targetElement.nextSibling.nodeName !== 'BUTTON')) {
            const button = document.createElement('button');
            button.textContent = 'Data Atual';
            button.style.cssText = 'background-color: #0b61a4; color: white; border: none; padding: 5px 10px; text-align: center; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 5px; margin-left: 10px;';

            button.addEventListener('click', function() {
                event.preventDefault();
                button1.click();
            });

            // Insere o botão após o elemento de destino
            targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
        }

        // Colocar nome do anexo automaticamente
//        const elementPairs = [
//            ['#formConfirmaAnexo\\:j_idt858 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexo\\:j_idt862'],
//            ['#formConfirmaAnexo\\:j_idt1760 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexo\\:j_idt1764'],
//            ['#formConfirmaAnexoEmail\\:j_idt1975 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexoEmail\\:j_idt1978'],
//            ['#formClienteConfirmaAnexo\\:j_idt612 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)', '#formClienteConfirmaAnexo\\:descricaoArquivo'],
//            ['#formConfirmaAnexo\\:j_idt743 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)', '#formConfirmaAnexo\\:j_idt746'],
//            ['#formCadastroAnexo\\:j_idt704 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > span:nth-child(1)', '#formCadastroAnexo\\:j_idt707'],
//        ];

        for (const [confirmElementSelector, confirmElementValueSelector] of elementPairs) {
            const confirmElement = document.querySelector(confirmElementSelector);
            const confirmElementValue = document.querySelector(confirmElementValueSelector);

            if (confirmElement && confirmElementValue && confirmElementValue.value === '') {
                const fileName = confirmElement.innerText.trim();
                const fileNameWithoutExtension = fileName.slice(0, -4);
                confirmElementValue.value = fileNameWithoutExtension;
            }
        }

        // Adiciona botões na função de refaturar conta.
        //const contaTitleElement = document.querySelector('#j_idt674_title');
        if (contaTitleElement && (!contaTitleElement.nextSibling || contaTitleElement.nextSibling.nodeName !== 'BUTTON') && contaTitleElement.innerText.trim() === 'Conta') {
            const createButton = (text, clickHandler) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.addEventListener('click', clickHandler);
                button.style.cssText = 'background-color: #0b61a4; color: white; border: none; padding: 5px 10px; text-align: center; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 5px; margin-left: 5px;';
                return button;
            };

            const refatButton = createButton('Refat p/ Vazamento Interno', refatVazamento);
            const atualizarVencimentoButton = createButton('Atualizar Vencimento', updateVencimento);
            const leituraInformadaButton = createButton('Leitura Informada Usu.', leituraInformada);
            const refatCavaleteButton = createButton('Vaz.Cavalete Depois', refatCavalete);

            contaTitleElement.parentNode.insertBefore(refatCavaleteButton, contaTitleElement.nextSibling);
            contaTitleElement.parentNode.insertBefore(refatButton, contaTitleElement.nextSibling);
            contaTitleElement.parentNode.insertBefore(leituraInformadaButton, contaTitleElement.nextSibling);
            contaTitleElement.parentNode.insertBefore(atualizarVencimentoButton, contaTitleElement.nextSibling);
        }

        // Adiciona botão na função de atualizar vencimento.
        //const AttVencElement = document.querySelector('#j_idt655_title');
        if (AttVencElement && (!AttVencElement.nextSibling || AttVencElement.nextSibling.nodeName !== 'BUTTON') && AttVencElement.innerText.trim() === 'Alterar Data Vencimento') {
            const createButton = (text, clickHandler) => {
                const button = document.createElement('button');
                button.textContent = text;
                button.addEventListener('click', clickHandler);
                button.style.cssText = 'background-color: #0b61a4; color: white; border: none; padding: 5px 10px; text-align: center; text-decoration: none; font-size: 12px; font-weight: bold; border-radius: 5px; margin-left: 5px;';
                return button;
            };

            const AttVencButton = createButton('Revisão improcedente', AttVenc);
            AttVencElement.parentNode.insertBefore(AttVencButton, AttVencElement.nextSibling);
        }

        // Adicionar funções no campo de data/hora na baixa de OS
        if (window.location.href.includes('app/atendimento/os/baixa')) {
            if ($('#ui-datepicker-div').is(':visible')) {
                // Verifique se o campo de texto já foi adicionado
                var sliderHandles = document.querySelectorAll(".ui-slider-handle");
                var textField = sliderHandles[0].nextSibling;
                if (!textField || textField.tagName !== 'INPUT') {
                    // Crie o campo de texto ao lado do elemento de slider
                    textField = document.createElement("input");
                    textField.type = "text";
                    textField.style.marginLeft = "150px";
                    textField.setAttribute("pattern", "[0-9]{2}:[0-9]{2}");
                    textField.setAttribute("maxlength", "5");
                    sliderHandles[0].parentNode.insertBefore(textField, sliderHandles[0].nextSibling);

                    // Adicione os event listeners ao campo de texto
                    textField.addEventListener("input", function() {
                        var valor = this.value.replace(/\D/g, '').substring(0, 4);
                        var hora = valor.substring(0, 2);
                        var minuto = valor.substring(2);
                        this.value = hora + ":" + minuto;
                    });

                    textField.addEventListener("keydown", function(event) {
                        if (event.keyCode === 13) {
                            var valor = this.value.split(":");
                            var hora = valor[0];
                            var minuto = valor[1];
                            sliderHora(hora);
                            sliderMinuto(minuto);
                            this.focus();
                        }
                    });
                }

                // Verifique se o input de data já foi adicionado
                var datePickerInput = $('#ui-datepicker-div .ui-datepicker-calendar').prevAll('input[type="text"]').first();
                if (datePickerInput.length === 0) {
                    // Crie o input de data
                    datePickerInput = document.createElement('input');
                    datePickerInput.type = 'text';
                    datePickerInput.placeholder = 'Digite a data dd/mm/aaaa só num.';

                    datePickerInput.addEventListener('input', () => {
                        let value = datePickerInput.value.replace(/\D/g, '');
                        if (value.length > 8) value = value.slice(0, 8);
                        value = value.replace(/(\d{2})(\d)/, '$1/$2');
                        value = value.replace(/(\d{2})(\d)/, '$1/$2');
                        datePickerInput.value = value;
                    });

                    datePickerInput.addEventListener('change', () => {
                        const [dia, mes, ano] = datePickerInput.value.split('/');
                        const today = new Date();
                        const selectAno = $('#ui-datepicker-div .ui-datepicker-year');
                        selectAno.val(ano ? ano : today.getFullYear().toString());
                        selectAno.trigger('change');

                        const selectMes = $('#ui-datepicker-div .ui-datepicker-month');
                        const maxDia = new Date().getDate();
                        let diaSelecionado = parseInt(dia);
                        if (diaSelecionado > maxDia) {
                            selectMes.val(today.getMonth() - 1);
                            selectMes.trigger('change');
                        } else {
                            selectMes.val(mes ? mes - 1 : today.getMonth());
                            selectMes.trigger('change');
                        }

                        const elementos = $('[data-month="' + selectMes.val() + '"][data-year="' + selectAno.val() + '"] a');
                        for (let i = 0; i < elementos.length; i++) {
                            if (parseInt(elementos[i].textContent) === diaSelecionado) {
                                elementos[i].click();
                                break;
                            }
                        }
                        textField.focus();
                    });

                    datePickerInput.addEventListener('keyup', function(event) {
                        if (event.keyCode === 13) {
                            setTimeout(function() {
                                textField.focus();
                                $('.ui-slider-handle:first-child').nextSibling.focus();
                            }, 300);
                        }
                    });

                    var table = $('#ui-datepicker-div .ui-datepicker-calendar');
                    if (!table.prev().is('input[type="text"]')) {
                        if (table.parent().length === 0) {
                            $('body').prepend(datePickerInput);
                            datePickerInput.focus();
                        } else {
                            table.before(datePickerInput);
                            datePickerInput.focus();
                        }
                    }
                }
            }
        }
    }, 100);
})();

// Função de atualizar vencimento

function AttVenc() {
    const datarefat = document.getElementById('formVencimento:dataVencimento_input');
    if (datarefat) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 15);
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        const newDate = `${day}/${month}/${year}`;
        datarefat.value = newDate;
    }
    var OSC = prompt('Digite o número da OSC de revisão improcedente: ');
    const textarea2 = document.querySelector(textarea2idt);
    if (textarea2) {
        textarea2.value = `Revisão improcedente conforme OSC ${OSC}. Atualizado vencimento.`;
    }
}

// Função para atualizar o vencimento da tela de Refaturamento
function updateVencimento() {
    const datarefat = document.getElementById('formAlteracaoConta:dataVencimento_input');
    if (datarefat) {
        const currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + 15);
        const day = currentDate.getDate().toString().padStart(2, '0');
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const year = currentDate.getFullYear().toString();
        const newDate = `${day}/${month}/${year}`;
        datarefat.value = newDate;
    }
}

function EsgMda() {
    const esgMDA = document.querySelector(mediaesgoto);
    if (esgMDA) {
        esgMDA.click();
    }
}

function LeituraCriadaN() {
    const leitcriada = document.querySelector(leituracriadanao);
    if (leitcriada) {
        leitcriada.click();
    }
}

function refatVazamento() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Refat p/ Vazamento</h3>
            <label>
                <input type="checkbox" name="refatLS" value="refatLS" /> Refat p/ LS
            </label>
            <div class="radio-group">
                <label>
                    <input type="radio" name="qualLS" value="1º" /> 1º
                </label>
                <label>
                    <input type="radio" name="qualLS" value="2º" /> 2º
                </label>
            </div>
            <label>
                <input type="checkbox" name="refatEsgoto" value="refatEsgoto" /> Refat p/ Média no esgoto
            </label>
            <div class="input-group">
                <p>
                <label>Informe o nº da OSC:</label>
                <input type="text" id="oscNumeroInput" />
            </div>
            <div class="button-group">
                <button id="confirmButton">Confirmar</button>
            </div>
        </div>
    `;

    modal.querySelector('#confirmButton').addEventListener('click', () => {
        const refatLS = modal.querySelector('input[name="refatLS"]').checked;
        const qualLS = modal.querySelector('input[name="qualLS"]:checked') ? modal.querySelector('input[name="qualLS"]:checked').value : '';
        const refatEsgoto = modal.querySelector('input[name="refatEsgoto"]').checked;
        const oscNumero = modal.querySelector('#oscNumeroInput').value;

        if (refatLS && qualLS) {
            document.querySelector('li[data-label="Ocorrência Resolvida (91)"]').click();
            document.querySelector('li[data-label="Limite Superior"]').click();
        }
        if (refatEsgoto) {
            EsgMda();
        }

        const textarea = document.querySelector(textareaidt);
        console.log(textarea);
        if (textarea) {
            if (refatLS && qualLS && refatEsgoto) {
                textarea.value = `Vazamento interno não visível e não coletado para o esgoto conforme OSC ${oscNumero}. Refat p/ ${qualLS} Limite Superior na água e Média no esgoto.`;
            } else if (!refatEsgoto) {
                textarea.value = `Vazamento interno não visível conforme OSC ${oscNumero}. Refat p/ ${qualLS} Limite Superior na água.`;
            } else if (!refatLS && refatEsgoto) {
                textarea.value = `Vazamento interno não visível e não coletado para o esgoto conforme OSC ${oscNumero}. Refat p/ Média no esgoto.`;
            }
        }

        modal.remove();
        LeituraCriadaN();
        updateVencimento();
    });

    document.body.appendChild(modal);
}

function refatCavalete() {
    updateVencimento();
    var OSC = prompt('Digite o número da OSC de vazamento no cavalete sanado pela CAESB: ');
    var data = prompt('Digite a data do vazamento sanado no formato dd/mm/aaaa:');
    document.querySelector('li[data-label="Vazamento Após o Hidrômetro (71)"]').click();
    document.querySelector('li[data-label="Média"]').click();
    EsgMda();
    LeituraCriadaN();
    const textarea = document.querySelector(textareaidt);
    if (textarea) {
        textarea.value = `Vazamento após o hidrômetro sanado pela CAESB em ${data} pela OSM ${OSC}. Refat p/ média de consumo.`;
    }
}


function leituraInformada() {
    var leitura = prompt('Digite a leitura informada pelo usuário: ');
    var data = prompt('Digite a data da leitura informada no formato dd/mm/aaaa:');
    var OSC = prompt('Digite o número da OSC: ');
    document.querySelector('li[data-label="Leitura Informada Pelo Usuário (84)"]').click();
    document.querySelector('li[data-label="Medido"]').click();
    const leit = document.querySelector(leitidt);
    leit.value = leitura;
    const dataleitura = document.getElementById('formAlteracaoConta:dataLeitura_input');
    if (dataleitura) { dataleitura.value = data; }
    const textarea = document.querySelector(textareaidt);
    if (textarea) { textarea.value = `Leitura informada pelo usuário de ${leitura} em ${data} conforme OSC ${OSC}.`; }
    LeituraCriadaN();
    updateVencimento();
}

// Função que será chamada ao dar enter no campo de texto
function sliderHora(hora) {
    console.log("Entrou na função hora: " + hora + "h.");

    const table = document.querySelector('.ui-datepicker-calendar');
    const activeDay = table.querySelector('.ui-state-active');
    const month = activeDay.parentElement.dataset.month;
    const year = activeDay.parentElement.dataset.year;
    const day = activeDay.textContent;

    const selectedDate = new Date(year, month, day);
    const currentDate = new Date();

    const horaAtual = currentDate.getHours();
    let horaPosicao;

    if (selectedDate.toDateString() === currentDate.toDateString()) {
        horaPosicao = (123 * hora) / horaAtual;
    } else {
        horaPosicao = (123 * hora) / 23;
    }

    const sliderHandleHora = document.querySelector(".ui_tpicker_hour_slider");
    moverSlider(sliderHandleHora, horaPosicao);
}

function sliderMinuto(minuto) {
    const minutoPosicao = (123 * minuto) / 59;
    const sliderHandleMinuto = document.querySelector(".ui_tpicker_minute_slider");
    moverSlider(sliderHandleMinuto, minutoPosicao);
}

function moverSlider(sliderHandle, posicao) {
    const eventOptions = {
        bubbles: true,
        cancelable: true,
        clientX: sliderHandle.getBoundingClientRect().left + (sliderHandle.offsetWidth / 2),
        clientY: sliderHandle.getBoundingClientRect().top + (sliderHandle.offsetHeight / 2)
    };

    const eventStart = new MouseEvent("mousedown", eventOptions);
    const eventMove = new MouseEvent("mousemove", {
        ...eventOptions,
        clientX: sliderHandle.getBoundingClientRect().left + posicao,
    });
    const eventEnd = new MouseEvent("mouseup", {
        ...eventOptions,
        clientX: sliderHandle.getBoundingClientRect().left + (sliderHandle.offsetWidth / 2) + (sliderHandle.parentElement.offsetWidth * 0.5),
    });

    sliderHandle.dispatchEvent(eventStart);
    sliderHandle.dispatchEvent(eventMove);
    sliderHandle.dispatchEvent(eventEnd);
}


button1.click(function() { //Colocar Hora Atual
    var data = new Date();
    var hora = data.getHours();
    var minuto = data.getMinutes();

    //clica data inicio
    document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[1]/td/table/tbody/tr/td/span/button/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

    // Hora Inicio
    var sliderHandleHora = document.querySelector(".ui_tpicker_hour_slider");
    var hinicio = minuto < 10 ? (123 * (hora - 1)) / hora : 123;
    moverSlider(sliderHandleHora, hinicio);

    // Minuto Inicio
    var sliderHandleMinuto = document.querySelector(".ui_tpicker_minute_slider");
    var minicio = minuto < 10 ? 112 : (123 * (minuto - 10)) / minuto;
    moverSlider(sliderHandleMinuto, minicio);

    //clica data Fim
    document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[2]/td/table/tbody/tr/td/span/button/span[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();

    // Hora Fim
    sliderHandleHora = document.querySelector(".ui_tpicker_hour_slider");
    moverSlider(sliderHandleHora, 123);

    // Minuto Fim
    sliderHandleMinuto = document.querySelector(".ui_tpicker_minute_slider");
    moverSlider(sliderHandleMinuto, 123);
});

function Titularidade(diag, prov) {
    button1.click();

    var element1 = document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[4]/td/table/tbody/tr/td/table/tbody/tr/td[2]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var element2 = document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[6]/td/table/tbody/tr/td/table/tbody/tr/td[1]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var element3 = document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[7]/td/table/tbody/tr/td/table/tbody/tr/td[1]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (element1 !== null) {
        element1.click();
    }
    if (element2 !== null) {
        element2.click();
    }
    if (element3 !== null) {
        element3.click();
    }

    var diagn = document.getElementById("form1:diagnosticoBaixa");
    var provd = document.getElementById("form1:providenciaBaixa");

    if (diagn !== null) {
        diagn.value = diag;
    }
    if (provd !== null) {
        provd.value = prov;
    }
}

async function Revisao(vaz, conc, exec, resp, diag, prov, usuario, leitura, lacre, improc) {

    //Revisao(vazamento, concluido, executado, resposta, diag, prov, usu, lei, lacre, improcende)
    var element1 = document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[4]/td/table/tbody/tr/td/table/tbody/tr/td[" + vaz + "]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var element2 = document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[6]/td/table/tbody/tr/td/table/tbody/tr/td[" + conc + "]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var element3 = document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[7]/td/table/tbody/tr/td/table/tbody/tr/td[" + exec + "]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var element4 = document.evaluate("/html/body/div[8]/div/form[3]/span/div[2]/div[2]/table/tbody/tr/td/table/tbody/tr[8]/td/table/tbody/tr/td/table/tbody/tr/td[" + resp + "]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (element1 !== null) {
        element1.click();
    }
    if (element2 !== null) {
        element2.click();
    }
    if (element3 !== null) {
        element3.click();
    }
    if (element4 !== null) {
        element4.click();
    }

    const diagn = document.getElementById("form1:diagnosticoBaixa");
    const provd = document.getElementById("form1:providenciaBaixa");
    const anexar = await waitForElement(taganexar);

    if (diagn !== null && diagn !== false) {
        diagn.value = diag;
    }
    if (provd !== null && provd !== false) {
        provd.value = prov;
    }

    if (vaz == 1) {
        const tipoVazamento = await waitForElement('#form1\\:tipoVazamento');
        if (tipoVazamento) {
            document.getElementById("form1:tipoVazamento_4").click();
        }
    }

    if (improc) {
      var improcedente = document.evaluate("/html/body/div[8]/div/form[3]/span/div[3]/div[2]/table/tbody/tr[3]/td/table/tbody/tr/td/table/tbody/tr/td[2]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (improcedente !== null) {
          improcedente.click();
          const naoexec = await waitForElement('#form1\\:motivoNaoExecucao');
          if (naoexec) {
              document.getElementById("form1:motivoNaoExecucao_8").click();
          }
      }
    }
    else {
        var procedente = document.evaluate("/html/body/div[8]/div/form[3]/span/div[3]/div[2]/table/tbody/tr[3]/td/table/tbody/tr/td/table/tbody/tr/td[1]/div/div[2]/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (procedente !== null) {
            procedente.click();
        }
    }


    if (usuario && leitura) {
        const usu = await waitForElement(tagusuario);
        if (usu !== null) {
            usu.value = usuario;
        }
        const leit = await waitForElement(tagleitura);
        if (leit !== null) {
            leit.value = leitura;
        }
    }
    return;

}

async function waitForElement(selector) {
  const startTime = Date.now();
  const timeout = 2000; // Tempo limite de 5 segundos

  while (!document.querySelector(selector)) {
    if (Date.now() - startTime > timeout) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 100)); // Espera 100ms antes de verificar novamente
  }

  return document.querySelector(selector);
}

button2.click(function() { // Alteração para Titular Atual
    var titular = document.evaluate("/html/body/div[8]/div/form[3]/span/div[1]/div[2]/table[1]/tbody/tr[3]/td[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var inscricao = document.evaluate("/html/body/div[8]/div/form[3]/span/div[1]/div[2]/table[1]/tbody/tr[1]/td[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var diag = 'Usuário(a) ' + titular + ' já consta como atual responsável financeiro(a) do imóvel de inscrição ' + inscricao + '. \nCaso queira solicitar a alteração para outra pessoa, a solicitação deve ser feita no cadastro desta, sendo vedada a alteração por solicitação de terceiros.';
    var prov = 'Para solicitação de alteração de titularidade de conta, é necessário que o requerente apresente documento que comprove vínculo com o imóvel, seja de propriedade como IPTU, escritura ou cessão de direitos, seja de locação com contrato de locação tendo firma reconhecida em cartório de locador e locatário ou assinatura digital válida. O documento e a solicitação devem estar em nome daquele que ficará como titular financeiro pelo imóvel e este não pode ter débitos em aberto junto à CAESB. Vale ressaltar que não é permitida a solicitação de alteração por terceiros ou por aqueles que já são os atuais titulares da conta.';
    Titularidade(diag, prov);
});

button3.click(function() { //Alteração Realizada
    var titular = document.evaluate("/html/body/div[8]/div/form[3]/span/div[1]/div[2]/table[1]/tbody/tr[3]/td[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var inscricao = document.evaluate("/html/body/div[8]/div/form[3]/span/div[1]/div[2]/table[1]/tbody/tr[1]/td[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var diag = 'SOLICITAÇÃO DE ALTERAÇÃO DE TITULARIDADE.';
    var prov = 'Prezado(a) ' + titular + ', informamos que sua solicitação de vinculação como responsável financeiro do imóvel de inscrição ' + inscricao + ' foi aceita, considerando a documentação apresentada. \nDesta forma, você passa a ser o responsável pelos pagamentos referentes a este imóvel. \nCaso o fornecimento de água esteja suspenso, é importante ressaltar que será necessária a abertura de uma solicitação de religação.';
    Titularidade(diag, prov);
});

button4.click(function() { //Alteração com Débitos
    var titular = document.evaluate("/html/body/div[8]/div/form[3]/span/div[1]/div[2]/table[1]/tbody/tr[3]/td[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var insc = prompt('Digite as inscrições que possuem débitos (ex.: 123456, 654321 e 112233): ');
    var diag = 'Alteração não efetuada, cliente com débito junto a CAESB em outra(s) inscrição(ões): ' + insc + '.';
    var prov = 'Nova vinculação poderá ser feita mediante quitação do débito ou parcelamento.';
    Titularidade(diag, prov);
});

button5.click(function() { //Alteração Falta Documentos
    var titular = document.evaluate("/html/body/div[8]/div/form[3]/span/div[1]/div[2]/table[1]/tbody/tr[3]/td[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var inscricao = document.evaluate("/html/body/div[8]/div/form[3]/span/div[1]/div[2]/table[1]/tbody/tr[1]/td[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.textContent;
    var diag = 'Usuário(a) ' + titular + ' solicita vinculação como responsável financeiro(a) do imóvel de inscrição ' + inscricao + ', porém +++COMPLETAR+++';
    var prov = 'Para solicitação de alteração de titularidade de conta, é necessário que o requerente apresente documento que comprove vínculo com o imóvel, seja de propriedade como IPTU, escritura ou cessão de direitos, seja de locação com contrato de locação tendo firma reconhecida em cartório de locador e locatário ou assinatura digital válida. O documento e a solicitação devem estar em nome daquele que ficará como titular financeiro pelo imóvel e este não pode ter débitos em aberto junto à CAESB. Vale ressaltar que não é permitida a solicitação de alteração por terceiros ou por aqueles que já são os atuais titulares da conta.';
    Titularidade(diag, prov);
});

//Revisao(vazamento, concluido, executado, resposta, diag, prov, usu, lei, lacre, improcende)

button8.click(function() { //Usuario Orientado Vazamento
    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');
    if ( lacre == "" ) {
        var diag = `Hidrômetro com bom funcionamento, leitura ${leitura} confirmada.\nOrientamos o(a) usuário(a) ${usuario} a verificar as instalações hidráulicas do imóvel, a fim de identificar qualquer vazamento que possa estar influenciando no faturamento.`;
    }
    else {
        var diag = `Hidrômetro com bom funcionamento, leitura ${leitura} confirmada, lacre ${lacre}.\nOrientamos o(a) usuário(a) ${usuario} a verificar as instalações hidráulicas do imóvel, a fim de identificar qualquer vazamento que possa estar influenciando no faturamento.`;
    }
    var prov = `Caso seja identificado um vazamento, é importante efetuar o registro fotográfico do local antes e depois da correção, além de providenciar o reparo imediato.\nApós o reparo, o usuário(a) deve encaminhar as fotos que comprovem a existência/correção do vazamento, juntamente com foto da numeração do hidrômetro e foto da leitura atual, em uma nova solicitação por meio do Autoatendimento no site da CAESB ou pelo Aplicativo.\nEssas medidas garantirão a revisão adequada das contas, conforme estabelecido pela Resolução 14/2011.`;

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);
});

button9.click(function() { //Portão fechado.
    var data = document.getElementById('form1:dataFimExecucao_input').value;
    //var diag = `Comunicamos que em ${data.split(' ')[0]} às ${data.split(' ')[1]} a CAESB esteve em seu imóvel para realizar vistoria. Informamos que não foi possível, pois o imóvel estava fechado e não havia ninguém no local.`;
    var diag = `Comunicamos que em ${data.split(' ')[0]} a CAESB esteve em seu imóvel para realizar vistoria. Informamos que não foi possível, pois o imóvel estava fechado e não havia ninguém no local.`;
    var prov = `Deixado aviso de comparecimento.`;

    Revisao(2, 2, 2, 1, diag, prov, false, false, false, true);
});

button10.click(function() { //Sem Vazam. Improcedente

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');
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

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);
});

button11.click(function() { //Vaz. Interno

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');
    var vaz = prompt('Digite o local do vazamento: Ex. no ramal do quintal ');
    var vistoriante = prompt('Digite a matrícula do vistoriante: ');
    var conta = prompt('Digite a(s) conta(s): Ex. 01/2023, 02/2023 e 03/2023');
    if ( lacre == "" ) {
        var diag = 'Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante;
    }
    else {
        var diag = 'Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + ', lacre ' + lacre + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante;
    }

    var prov = 'Conta(s) referência ' + conta + ' revisada(s) conforme Resolução ADASA nº 14/2011.';

    Revisao(1, 1, 1, 1, diag, prov, usuario, leitura, lacre, false);
});

button12.click(function() { //Leitura informada

    button1.click();
    var leitura = prompt('Digite a leitura: ');
    var conta = prompt('Digite a conta: Ex. 01/2023');

    var diag = ('Usuário informa leitura ' + leitura + ' para conta referência ' + conta + ' faturada pela média devido a ocorrência impeditiva de leitura.');
    var prov = ('Conta referência ' + conta + ' refaturada conforme leitura informada pelo usuário.');

    Revisao(2, 1, 1, 1, diag, prov, '.', leitura, false, false);
});

button13.click(function() { //Vaz Coberto

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');

    if ( lacre == "" ) {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' +leitura + ' foi confirmada. Usuário informa que sanou vazamento, porém local já estava tampado/coberto, não sendo possível verificar o vazamento sanado.');
    }
    else {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' +leitura + ' foi confirmada e lacre ' +lacre+ '. Usuário informa que sanou vazamento, porém local já estava tampado/coberto, não sendo possível verificar o vazamento sanado.');
    }

    var prov = ('A revisão de contas solicitada não pode ser concedida devido à falta de documentação comprobatória do conserto do vazamento imperceptível e/ou da realização da vistoria para verificação do mesmo. \nConforme a Resolução 014/2011 da ADASA, para obter o desconto mencionado, é necessário apresentar o termo de ocorrência de eliminação do vazamento imperceptível e comprovantes do material/serviço utilizado para reparar o vazamento. Alternativamente, é possível solicitar uma vistoria para verificar novamente o vazamento, desde que o mesmo esteja exposto para registro fotográfico. As fotos do conserto, juntamente com os comprovantes, podem ser apresentados em novo pedido de revisão pelo Autoatendimento no site da CAESB ou Aplicativo.')

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);
});

button14.click(function() { //Erro de leitura

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');
    var conta = prompt('Digite a(s) conta(s): Ex. 01/2023, 02/2023 e 03/2023');

    if ( lacre == "" ) {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada. Houve erro de leitura.');
    }
    else {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada, lacre ' +lacre+'. Houve erro de leitura.');
    }

    var prov = ('Conta referência ' +conta+ ' refaturada conforme consumo do imóvel');

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, false);
});

button15.click(function() { //Agendamento de leitura

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');
    var conta = prompt('Digite a conta: Ex. 01/2023');

    if ( lacre == "" ) {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada. Vistoria de agendamento de leitura realizada para retirada de multa por impedimento de leitura.');
    }
    else {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada, lacre ' +lacre+' . Vistoria de agendamento de leitura realizada para retirada de multa por impedimento de leitura.');
    }

    var prov = ('Conta referência ' +conta+ ' refaturada conforme consumo do imóvel e retirada multa de impedimento de leitura.');

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, false);
});

button16.click(function() { //Vazamento visível e coletado

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var vaz = prompt('Digite o local do vazamento: Ex. na caixa de descarga ');
    var vistoriante = prompt('Digite a matrícula do vistoriante: ');
    var usuario = prompt('Digite o nome do usuario: ');

    if ( lacre == "" ) {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada. Vazamento interno sanado, visível e coletado para o esgoto ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante);
    }

    else {
        var diag = ('Hidrômetro com bom funcionamento, leitura ' +leitura+ ' confirmada, lacre ' +lacre+' . Vazamento interno sanado, visível e coletado para o esgoto ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante);
    }

    var prov = ('Após analisarmos o seu pedido de revisão tarifária referente ao vazamento visível nas instalações hidráulicas da sua unidade usuária, verificamos que, de acordo com a Resolução ADASA nº 14/2011, Art. 118, o desconto sobre o consumo excedente só é aplicável quando há comprovação e subsequente eliminação de vazamento imperceptível nas instalações hidráulicas. Além disso, conforme o § 4º da mesma resolução, caso seja comprovado que o excesso de água não foi direcionado para a rede pública de esgotos sanitários, a tarifa de esgoto será calculada com base na média de consumo da unidade usuária. \nPortanto, devido ao fato de o vazamento ser visível e a água ter escoado para a rede de esgoto, não é possível conceder desconto tanto na tarifa de água quanto na de esgoto.');

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);
});

button17.click(function() { // Nº Hid não confere - já atualizado
    button1.click()
    var hid = document.querySelector("#form1\\:tbHidro_data > tr:nth-child(1) > td:nth-child(1)").innerText;
    console.log(hid);
    var data = document.querySelector("#form1\\:tbHidro_data > tr:nth-child(1) > td:nth-child(2)").innerText;
    console.log(data);
    var diag = ('Hidrômetro '+hid+' foi substituído pela CAESB e cadastro já está atualizado.');
    var prov = ('Hidrômetro instalado em ' + data);

    Revisao(2, 2, 1, 2, diag, prov, '.', '0', false, true);
});

button18.click(function() { //Vaz.Negado Mais de 2 LS.

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');
    var vaz = prompt('Digite o local do vazamento: Ex. no ramal do quintal ');
    var vistoriante = prompt('Digite a matrícula do vistoriante: ');
    var conta = prompt('Digite a(s) conta(s) que já receberam LS: Ex. 01/2023, 02/2023 e 03/2023');

    if ( lacre == "" ) {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante);
    }
    else {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + ', lacre ' + lacre + '. \nVazamento interno sanado, não visível e não coletado para o esgoto ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante);
    }

    var prov = ('Conforme o ART. 118, §5º da Resolução 014/2011 da ADASA, o desconto será aplicado em, no máximo, duas faturas mensais subsequentes que comprovadamente foram influenciadas pelo vazamento confirmado pelo prestador de serviços. Esse desconto está limitado a uma ocorrência de vazamento em um período de 12 (doze) meses. \nInformamos que a solicitação de revisão não procede, uma vez que já foi concedido desconto por vazamento na(s) conta(s) ' +conta+ '. \nAtualizado vencimento da conta xx/2023.');

    Revisao(1, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);
});

button19.click(function() { // Reforço feito hoje
    button1.click()
    var data = document.getElementById('form1:dataInicioExecucao_input').value;
    var diag = `OS principal baixada em ${data.split(' ')[0]} .`;
    var prov = (' ');

    Revisao(2, 2, 2, 2, diag, prov, false, false, false, true).then(async v => {
        const motivo = await waitForElement('#form1\\:motivoNaoExecucao_label');
        if (motivo) {
            document.getElementById("form1:motivoNaoExecucao_22").click();
        }
    });
});

button20.click(function() { // Distribuição de Consumo

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

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');

    if ( lacre == "" ) {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' + leitura + ' foi confirmada. Não foi encontrado nenhum indício de vazamento no local. \n' + frase1);
    }
    else {
        var diag = ('Após vistoria no local, constatamos que o hidrômetro está funcionando corretamente, leitura ' + leitura + ' foi confirmada e o lacre ' + lacre + ' está intacto. Não foi encontrado nenhum indício de vazamento no local. \n' + frase1);
    }

    var prov = frase2;

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, false);
});

button21.click(function() { // Vaz.Abaixo LS S/Esg

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre. Caso não tenha/violado, deixe em branco.');
    var usuario = prompt('Digite o nome do usuario: ');
    var vaz = prompt('Digite o local do vazamento: Ex. no ramal do quintal ');
    var vistoriante = prompt('Digite a matrícula do vistoriante: ');
    var conta = prompt('Digite a(s) conta(s) que estão abaixo do LS: Ex. 01/2023, 02/2023 e 03/2023');

    if ( lacre == "" ) {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + '. \nVazamento interno sanado, não visível ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante);
    }
    else {
        var diag = ('Em vistoria o hidrômetro apresentou bom funcionamento, com leitura confirmada de ' + leitura + ', lacre ' + lacre + '. \nVazamento interno sanado, não visível ' + vaz + '.\nMatrícula vistoriante responsável pela avaliação: ' + vistoriante);
    }


    var prov = ('Conforme ART. 118, §3º da resolução 014/2011 da ADASA o desconto na tarifa de água será no volume que ultrapassar o Limite Superior, sendo este 80% do consumo médio dos últimos 12 meses do imóvel. Conta(s) referência ' + conta + ' com consumo abaixo do Limite Superior.');

    Revisao(1, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);
});

button22.click(async function() { // Troca de HD

    var leitura = prompt('Digite a leitura: ');
    var lacre = prompt('Digite o nº do lacre atual: ');
    var usuario = prompt('Digite o nome do usuario: ');
    var motivo = prompt('Digite o motivo da troca: (parado, danificado, etc)');
    var hdnovo = prompt('Digite o novo HIDRÔMETRO: (Y20S123456) ');
    var lacrenovo = prompt('Digite o novo LACRE: ');
    var hd = document.querySelector("#form1\\:tbHidro_data > tr:nth-child(1) > td:nth-child(1)").innerText;

    var diag = ('Em vistoria verificamos que o hidrômetro ' + hd + ' está ' + motivo + ' com leitura ' + leitura + ' e lacre ' + lacre + '.');
    var prov = ('Hidrômetro substituído pelo ' + hdnovo + ', lacre ' + lacrenovo + ' e leitura 0.');

    Revisao(2, 1, 1, 1, diag, prov, usuario, leitura, lacre, true);

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
});

button23.click(function() { // Vaz.Abaixo LS S/Esg
    button1.click();
    var diag = ('Conta faturada pela média por ocorrência 98 - Sem Retorno de Faturamento. Já normalizado e conta paga.')

    Revisao(2, 2, 2, 2, diag, '', false, false, false, true);
});

button24.click(function() { // Tarifa Social - Usuario Descadastr.
    button1.click();
    var data = prompt('Informe a data que usuário foi descadastrado (ficha): ');
    var diag = ('Para concessão da tarifa social, é necessário que o CPF do beneficiário conste do relatório de integrantes do CadÚnico encaminhado pela SEDES e que a renda média familiar seja igual ou inferior a R$210,00 (duzentos e dez reais), caracterizando-se como família pobre ou extremamente pobre. \nCliente revogado por não estar mais nos critérios estabelecidos de acordo com informações recebidas da SEDES/GDF em ' + data + '.');
    var prov = ('Informamos que o cadastro na tarifa social depende exclusivamente das informações encaminhadas pela SEDES/GDF e CPF do(a) usuário(a) não consta no último relatório recebido pela CAESB - Caso necessário procurar o CRAS ou SEDES para atualização cadastral. \nA alteração para tarifa social é realizada de forma automática caso usuário esteja vinculado a apenas um imóvel.');
    Revisao(2, 1, 1, 1, diag, prov, false, false, false, true);
});

button25.click(function() { // Tarifa Social - Fora da lista
    button1.click();
    var diag = ('Para concessão da tarifa social, é necessário que o CPF do beneficiário conste do relatório de integrantes do CadÚnico encaminhado pela SEDES e que a renda média familiar seja igual ou inferior a R$210,00 (duzentos e dez reais), caracterizando-se como família pobre ou extremamente pobre.');
    var prov = ('Informamos que o cadastro na tarifa social depende exclusivamente das informações encaminhadas pela SEDES/GDF e CPF do(a) usuário(a) não consta no último relatório recebido pela CAESB - Caso necessário procurar o CRAS ou SEDES para atualização cadastral. \nA alteração para tarifa social é realizada de forma automática caso usuário esteja vinculado a apenas um imóvel.');
    Revisao(2, 1, 1, 1, diag, prov, false, false, false, true);
});

button26.click(function() { //Cliente Ausente - Vistoria Realizada

    var leitura = prompt('Digite a leitura: ');
    var data = document.getElementById('form1:dataFimExecucao_input').value;

    var diag = `Comunicamos que em ${data.split(' ')[0]} a CAESB esteve em seu imóvel para realizar vistoria, porém não havia ninguém no local para acompanhar a vistoria.`;
    var prov = 'Acesso ao hidrômetro, com leitura ' +leitura+ ' confirmada.  Caso necessário, realizar novo pedido de vistoria em nosso site (https://www.caesb.df.gov.br/portal-servicos/) ou aplicativo e caso não fique ninguém no imóvel solicitar vistoria com agendamento, onde poderá escolher o dia e o período, matutino ou vespertino, para realização da vistoria, sendo cobrada uma taxa de R$ 35,21 no próximo faturamento.';

    Revisao(2, 1, 1, 1, diag, prov, 'ausente', leitura, false, true);
});

button27.click(function() { // Exec.Cons.Final - Proprietario
    button1.click();
    var data = prompt('Informe a data que houve o corte: ');
    var leit = prompt('Informe a leitura final: ');
    var diag = ('Corte realizado em ' + data + ', com leitura final de ' + leit + '.');
    var prov = ('Atual titular é proprietário e solicitou apenas a desativação, não sendo registrada a saída.');
    Revisao(2, 1, 2, null, diag, prov, false, false, false, false);
});

button28.click(function() { // Exec.Cons.Final - Inquilino sem Consumo Final
    button1.click();
    var data = prompt('Informe a data que houve o corte: ');
    var leit = prompt('Informe a leitura final: ');
    var diag = ('Corte realizado em ' + data + ', com leitura final de ' + leit + '.');
    var prov = ('Registrada saída do(a) usuário(a) e sem conta de consumo final.');
    Revisao(2, 1, 1, null, diag, prov, false, false, false, true);
});

button29.click(function() { // Exec.Cons.Final - Inquilino com Consumo Final
    button1.click();
    var data = prompt('Informe a data que houve o corte: ');
    var leit = prompt('Informe a leitura final: ');
    var diag = ('Corte realizado em ' + data + ', com leitura final de ' + leit + '.');
    var prov = ('Registrada saída do(a) usuário(a) e gerada conta com consumo final do imóvel.');
    Revisao(2, 1, 1, null, diag, prov, false, false, false, true);
});

button30.click(function() { // Exec.Cons.Final - Corte não realizado
    button1.click();
    var data = prompt('Informe a data que houve a tentativa de corte: ');
    var diag = ('Tentativa de corte pela equipe da CAESB em ' + data + ', porém sem acesso ao hidrômetro para execução do serviço.');
    var prov = ('Conforme informado no Termo de Solicitação assinado pelo usuário a rescisão contratual e consequente suspensão do faturamento somente será efetivada após a suspensão definitiva dos serviços de abastecimento de água, onde deve ser viabilizada mediante a concessão de acesso ao padrão de ligação.');
    Revisao(2, 1, 1, null, diag, prov, false, false, false, true);
});

button31.click(function() { //Vaz depois cavalete

    button1.click();
    var OSC = prompt('Informe a OSC de conserto de cavalete: ');
    var data = prompt('Informe a data do conserto.');
    var conta = prompt('Digite a(s) conta(s): Ex. 01/2023. \nDeixe em branco se não houve revisão');
    var diag = 'Vazamento após o hidrômetro sanado pela CAESB em ' +data+ ' pela OSM ' +OSC+ '.';

    if ( conta == "" ) {
        var prov = 'Contas com consumo dentro da média do imóvel.';
    }
    else {
        var prov = 'Conta(s) referência ' + conta + ' revisada(s) conforme Resolução ADASA nº 14/2011.';
    }


    Revisao(1, 1, 2, 2, diag, prov, '.', '0', null, false).then(async v => {
        const vaz = await waitForElement('#form1\\:tipoVazamento');
        if (vaz) {
            document.getElementById("form1:tipoVazamento_2").click();
        }
    });
});


button7.click(function() { //Abrir todos os anexos.
    var form2 = 'formOsAnexoBean';
    //const count1 = countElements("formOsAnexoBean:abasAtendimento:j_idt1741:", "j_idt1747_menu", 20);
    //const count2 = countElements("formOsAnexoBean:abasAtendimento:tableAtendimento:", "j_idt1737_menu", 20);
    //openAttachments("formOsAnexoBean:abasAtendimento:j_idt1741:", "j_idt1748", count1, form2);
    //openAttachments("formOsAnexoBean:abasAtendimento:tableAtendimento:", "j_idt1740", count2, form2);
    const count1 = countElements(prefix1, menuId1, 20);
    const count2 = countElements(prefix2, menuId2, 20);
    openAttachments(prefix1, abrir1, count1, form2);
    openAttachments(prefix2, abrir2, count2, form2);
});

function AbrirAnexosAtendimento() {
    var form2 = 'abas:formAtendimentoAnexo';
    //const count1 = countElements("abas:formAtendimentoAnexo:j_idt649:", "j_idt655_menu", 20);
    //const count2 = countElements("abas:formAtendimentoAnexo:j_idt659:", "j_idt665_menu", 20);
    //openAttachments("abas:formAtendimentoAnexo:j_idt649:", "j_idt658", count1, form2);
    //openAttachments("abas:formAtendimentoAnexo:j_idt659:", "j_idt666", count2, form2);
    const count3 = countElements(prefix3, menuId3, 20);
    const count4 = countElements(prefix4, menuId4, 20);
    openAttachments(prefix3, abrir3, count3, form2);
    openAttachments(prefix4, abrir4, count4, form2);
}

function countElements(baseId, buttonId, maxIndex) {
    let count = 0;
    for (let i = 0; i <= maxIndex; i++) {
        const id = `${baseId}${i}:${buttonId}`;
        const element = document.getElementById(id);
        if (element) {
            count++;
        }
    }
    return count;
}

function openAttachments(baseId, buttonId, count, form2) {
    for (let i = 0; i < count; i++) {
        setTimeout(function(i) {
            const id = `${baseId}${i}:${buttonId}`;
            const form = document.getElementById(form2);
            form.target = "_blank";
            PrimeFaces.addSubmitParam(form2, { [id]: id }).submit(form2);
            console.log("i1: ", i);
        }, 500 * i, i);
    }
}

// Estilos CSS para o modal
const modalStyles = `
    .modal {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        z-index: 9999;
    }

    .modal-content {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .modal-content h3 {
        margin-bottom: 10px;
    }

    .radio-group {
        display: flex;
        margin-bottom: 10px;
    }

    .radio-group label {
        margin-right: 10px;
    }

    .input-group {
        margin-bottom: 10px;
    }

    .input-group label {
        display: block;
        margin-bottom: 5px;
    }

    .button-group {
        display: flex;
    }

    .button-group button {
        background-color: #0b61a4;
        color: white;
        border: none;
        padding: 5px 10px;
        text-align: center;
        text-decoration: none;
        font-size: 12px;
        font-weight: bold;
        border-radius: 5px;
        margin-right: 10px;
    }
`;

// Cria um estilo CSS para o modal
const styleElement = document.createElement('style');
styleElement.innerHTML = modalStyles;
document.head.appendChild(styleElement);




// FUNÇÃO DE CALCULAR CONSUMO

const tabela = [
    { Categoria: "Residencial", Tarifação: "06/2021", Faixa: 7, Valor: 2.98 },
    { Categoria: "Residencial", Tarifação: "06/2021", Faixa: 13, Valor: 3.57 },
    { Categoria: "Residencial", Tarifação: "06/2021", Faixa: 20, Valor: 7.07 },
    { Categoria: "Residencial", Tarifação: "06/2021", Faixa: 30, Valor: 10.25 },
    { Categoria: "Residencial", Tarifação: "06/2021", Faixa: 45, Valor: 15.37 },
    { Categoria: "Residencial", Tarifação: "06/2021", Faixa: 10000, Valor: 19.99 },
    { Categoria: "Social", Tarifação: "06/2021", Faixa: 7, Valor: 1.49 },
    { Categoria: "Social", Tarifação: "06/2021", Faixa: 13, Valor: 1.78 },
    { Categoria: "Social", Tarifação: "06/2021", Faixa: 20, Valor: 3.53 },
    { Categoria: "Social", Tarifação: "06/2021", Faixa: 30, Valor: 5.12 },
    { Categoria: "Social", Tarifação: "06/2021", Faixa: 45, Valor: 15.37 },
    { Categoria: "Social", Tarifação: "06/2021", Faixa: 10000, Valor: 19.99 },
    { Categoria: "Comercial", Tarifação: "06/2021", Faixa: 4, Valor: 6.26 },
    { Categoria: "Comercial", Tarifação: "06/2021", Faixa: 7, Valor: 7.82 },
    { Categoria: "Comercial", Tarifação: "06/2021", Faixa: 10, Valor: 10.09 },
    { Categoria: "Comercial", Tarifação: "06/2021", Faixa: 40, Valor: 12.51 },
    { Categoria: "Comercial", Tarifação: "06/2021", Faixa: 10000, Valor: 14.77 },
    { Categoria: "Residencial", Tarifação: "09/2022", Faixa: 7, Valor: 2.97 },
    { Categoria: "Residencial", Tarifação: "09/2022", Faixa: 13, Valor: 3.56 },
    { Categoria: "Residencial", Tarifação: "09/2022", Faixa: 20, Valor: 7.05 },
    { Categoria: "Residencial", Tarifação: "09/2022", Faixa: 30, Valor: 10.23 },
    { Categoria: "Residencial", Tarifação: "09/2022", Faixa: 45, Valor: 15.34 },
    { Categoria: "Residencial", Tarifação: "09/2022", Faixa: 10000, Valor: 19.94 },
    { Categoria: "Social", Tarifação: "09/2022", Faixa: 7, Valor: 1.48 },
    { Categoria: "Social", Tarifação: "09/2022", Faixa: 13, Valor: 1.78 },
    { Categoria: "Social", Tarifação: "09/2022", Faixa: 20, Valor: 3.53 },
    { Categoria: "Social", Tarifação: "09/2022", Faixa: 30, Valor: 5.11 },
    { Categoria: "Social", Tarifação: "09/2022", Faixa: 45, Valor: 15.34 },
    { Categoria: "Social", Tarifação: "09/2022", Faixa: 10000, Valor: 19.94 },
    { Categoria: "Comercial", Tarifação: "09/2022", Faixa: 4, Valor: 6.24 },
    { Categoria: "Comercial", Tarifação: "09/2022", Faixa: 7, Valor: 7.81 },
    { Categoria: "Comercial", Tarifação: "09/2022", Faixa: 10, Valor: 10.07 },
    { Categoria: "Comercial", Tarifação: "09/2022", Faixa: 40, Valor: 12.49 },
    { Categoria: "Comercial", Tarifação: "09/2022", Faixa: 10000, Valor: 14.73 },
    { Categoria: "Residencial", Tarifação: "01/2023", Faixa: 7, Valor: 3.26 },
    { Categoria: "Residencial", Tarifação: "01/2023", Faixa: 13, Valor: 3.91 },
    { Categoria: "Residencial", Tarifação: "01/2023", Faixa: 20, Valor: 7.75 },
    { Categoria: "Residencial", Tarifação: "01/2023", Faixa: 30, Valor: 11.24 },
    { Categoria: "Residencial", Tarifação: "01/2023", Faixa: 45, Valor: 16.86 },
    { Categoria: "Residencial", Tarifação: "01/2023", Faixa: 10000, Valor: 21.91 },
    { Categoria: "Social", Tarifação: "01/2023", Faixa: 7, Valor: 1.63 },
    { Categoria: "Social", Tarifação: "01/2023", Faixa: 13, Valor: 1.96 },
    { Categoria: "Social", Tarifação: "01/2023", Faixa: 20, Valor: 3.88 },
    { Categoria: "Social", Tarifação: "01/2023", Faixa: 30, Valor: 5.62 },
    { Categoria: "Social", Tarifação: "01/2023", Faixa: 45, Valor: 16.86 },
    { Categoria: "Social", Tarifação: "01/2023", Faixa: 10000, Valor: 21.91 },
    { Categoria: "Comercial", Tarifação: "01/2023", Faixa: 4, Valor: 6.72 },
    { Categoria: "Comercial", Tarifação: "01/2023", Faixa: 7, Valor: 8.41 },
    { Categoria: "Comercial", Tarifação: "01/2023", Faixa: 10, Valor: 10.84 },
    { Categoria: "Comercial", Tarifação: "01/2023", Faixa: 40, Valor: 13.45 },
    { Categoria: "Comercial", Tarifação: "01/2023", Faixa: 10000, Valor: 15.86 },
    { Categoria: "Residencial", Tarifação: "08/2023", Faixa: 7, Valor: 3.42 },
    { Categoria: "Residencial", Tarifação: "08/2023", Faixa: 13, Valor: 4.11 },
    { Categoria: "Residencial", Tarifação: "08/2023", Faixa: 20, Valor: 8.14 },
    { Categoria: "Residencial", Tarifação: "08/2023", Faixa: 30, Valor: 11.8 },
    { Categoria: "Residencial", Tarifação: "08/2023", Faixa: 45, Valor: 17.7 },
    { Categoria: "Residencial", Tarifação: "08/2023", Faixa: 10000, Valor: 23.01 },
    { Categoria: "Social", Tarifação: "08/2023", Faixa: 7, Valor: 1.71 },
    { Categoria: "Social", Tarifação: "08/2023", Faixa: 13, Valor: 2.06 },
    { Categoria: "Social", Tarifação: "08/2023", Faixa: 20, Valor: 4.07 },
    { Categoria: "Social", Tarifação: "08/2023", Faixa: 30, Valor: 5.9 },
    { Categoria: "Social", Tarifação: "08/2023", Faixa: 45, Valor: 17.7 },
    { Categoria: "Social", Tarifação: "08/2023", Faixa: 10000, Valor: 23.01 },
    { Categoria: "Comercial", Tarifação: "08/2023", Faixa: 4, Valor: 7.07 },
    { Categoria: "Comercial", Tarifação: "08/2023", Faixa: 7, Valor: 8.83 },
    { Categoria: "Comercial", Tarifação: "08/2023", Faixa: 10, Valor: 11.39 },
    { Categoria: "Comercial", Tarifação: "08/2023", Faixa: 40, Valor: 14.12 },
    { Categoria: "Comercial", Tarifação: "08/2023", Faixa: 10000, Valor: 16.66 },
];

function calcValorConta(consumo, tipo, data, unidadeConsumo, tabela) {
  let consumoAnterior = 0;
  if (tipo === "Comercial") unidadeConsumo = 1;
  for (const item of tabela) {
    if (item.Categoria === tipo && item.Tarifação === data) {
      if (consumo <= item.Faixa * unidadeConsumo) {
        return (consumo - consumoAnterior) * item.Valor;
      } else {
        consumoAnterior = item.Faixa * unidadeConsumo;
        consumo -= consumoAnterior;
      }
    }
  }
  return 0;
}

function criarInput(label, id) {
  const container = document.createElement("div");
  container.className = "input-container";
  const inputLabel = document.createElement("label");
  inputLabel.textContent = label;
  const input = document.createElement("input");
  input.type = "text";
  input.id = id;
  container.appendChild(inputLabel);
  container.appendChild(input);
  return container;
}

function mostrarJanela() {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <h3>Calcular Valor da Conta</h3>
    ${criarInput("Consumo:", "consumoInput").outerHTML}
    ${criarInput("Tipo (Residencial, Social, Comercial):", "tipoInput").outerHTML}
    ${criarInput("Data (mm/aaaa):", "dataInput").outerHTML}
    ${criarInput("Unidade de Consumo:", "unidadeConsumoInput").outerHTML}
    <button id="calcularButton">Calcular</button>
    <div id="valorContaContainer"></div>
  `;

  const calcularButton = modal.querySelector("#calcularButton");
  calcularButton.addEventListener("click", () => {
    const consumo = parseFloat(document.getElementById("consumoInput").value);
    const tipo = document.getElementById("tipoInput").value;
    const data = document.getElementById("dataInput").value;
    const unidadeConsumo = parseFloat(
      document.getElementById("unidadeConsumoInput").value
    );

    const valorConta = calcValorConta(consumo, tipo, data, unidadeConsumo, tabela);
    const valorContaContainer = modal.querySelector("#valorContaContainer");
    valorContaContainer.textContent = `Valor da conta: R$ ${valorConta.toFixed(2)}`;
  });

  document.body.appendChild(modal);
}

//mostrarJanela();