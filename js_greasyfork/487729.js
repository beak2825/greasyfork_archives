// GGUTILS MODIFICADO
// ==UserScript==
// @name         GGUtils
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Melhor script para vendedores da GGMAX
// @author       MateusFagnds, XFaires
// @match        https://ggmax.com.br/*
// @icon         https://cdn.ggmax.com.br/d/61d55b/img/logo-footer.04895db.png
// @grant        GM_getResourceText
// @license      MateusFagnds
// @downloadURL https://update.greasyfork.org/scripts/487729/GGUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/487729/GGUtils.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // DEFINA AQUI A MENSAGEM QUE SERÁ ENVIADA NO BATE-PAPO
    var mensagemchat = "Olá, você sabia que se você avaliar essa compra positivamente você recebe GGPOINTS e com isso você pode trocar por outros produtos aqui na plataforma? Vai perder essa oportunidade? Deixe logo sua avaliação positiva aqui nessa compra.";
    // DEFINA AQUI A MENSAGEM QUE SERÁ COLOCADA NA AVALIAÇÃO
    var mensagemavaliacao = "O cliente é excepcional, sempre muito cortês e generoso. Agradeço por me escolher e estou certo de que você ficará satisfeito com o produto adquirido. Muito obrigado pela sua confiança em nós.";
    // CASO VOCÊ PERCEBA QUE A PAGINA ESTÁ DEMORANDO PARA ABRIR A LISTA DE PRODUTOS ENTREGUE, AUMENTE ESSE VALOR
    var delayentregues = 1500
    // CASO VOCÊ PERCEBA QUE A PAGINA ESTÁ DEMORANDO PARA ABRIR A LISTA DE AVALIAÇÕES DE PENDENTES, AUMENTE ESSE VALOR
    var delaypendentes = 1500
    // CASO VOCÊ PERCEBA QUE A PAGINA DA VENDA ESTÁ DEMORANDO PARA CARREGAR, AUMENTE ESSE VALOR
    var delaychat = 1500
    // TEMPO PARA VERIFICAR SE HOUVE UMA NOVA VENDA
    var verificadordevenda = 60000

    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #fff;
        color: #333;
        text-align: center;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        font-family: sans-serif;
        font-size: 16px;
        line-height: 1.4;
        max-width: 80%;
    `;

    const popupText = document.createElement('h1');
    popupText.innerHTML = 'Estoque automático';
    popupText.style.cssText = `
        margin-bottom: 0px;
        font-size: 30px;
        color: black;
    `;

    let isTableOpen = false; // Variável para rastrear o estado da tabela

    // Cria a tabela de funções novas
    const functionTable = document.createElement('div');
    functionTable.innerHTML = `
    <div>
        <button id="addStockButton" style="background-color: #007bff; color: white; padding: 10px 20px;">Adicionar Estoque</button>
    </div>
    <div style="margin-top: 10px;"> <!-- Adiciona um espaço de 10 pixels entre os botões -->
        <button id="loadSalesButton" style="background-color: #007bff; color: white; padding: 10px 20px;">Carregar Vendas</button>
    </div>
    <div style="margin-top: 10px;"> <!-- Adiciona um espaço de 10 pixels entre os botões -->
        <button id="loadAutoAvaliacao" style="background-color: #007bff; color: white; padding: 10px 20px;">Ativar AutoAvaliação</button>
    </div>
`;

    // Estiliza a tabela
    functionTable.style.cssText = `
    position: fixed;
    bottom: -100%; /* Inicialmente esconde a tabela fora da tela */
    left: 0;
    background: #343a40; /* Cor de fundo */
    color: #333;
    padding: 10px;
    border-radius: 10px; /* Borda arredondada */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    max-height: 50vh;
    overflow: auto;
    transition: bottom 0.3s; /* Adiciona uma transição suave de animação */
    z-index: 9998;

`;

    // Localiza a div com a classe step__footer
    const divToDelete = document.querySelector('div.step__footer[data-v-2182cc71]');

    if (divToDelete) {
        // Remove a div
        divToDelete.parentNode.removeChild(divToDelete);
    }

    // Altera o texto no elemento h5 com a classe header__title
    const headerTitle = document.querySelector('h5.header__title[data-v-2182cc71]');
    if (headerTitle) {
        headerTitle.textContent = 'GGUtils';
    }

    // Altera o conteúdo do elemento p com os dados desejados
    const paragraph = document.querySelector('p[data-v-2182cc71] strong[data-v-2182cc71]');
    if (paragraph) {
        paragraph.textContent = 'ATUALIZAÇÃO:';
        paragraph.nextSibling.textContent = ' Agora o Adicionar Estoque não lê mais linhas em branco do documento de texto';
    }

    // Localize o elemento com base na classe
    const element = document.querySelector('h5.text-success[data-v-2182cc71]');

    if (element) {
        // Atualize o conteúdo do elemento
        element.textContent = 'V1.2.2';
    }


    // Adicione o ID "addStockButton" ao botão no HTML da tabela
    // <button id="addStockButton">Adicionar Estoque</button>
    // <button id="loadSalesButton">Carregar vendas</button>
    // <button id="automaticavaliation">Avaliação automatica</button>

    // Adiciona a tabela à página
    document.body.appendChild(functionTable);

    // Função para alternar o clique automático
    let isAutoClicking = false; // Variável para rastrear o estado do clique automático
    let autoClickInterval;



    let isAutoAvaliacao = false; // Variável para rastrear o estado do clique automático

    // Função para clicar na div "Avaliação"
    function clickAvaliacao() {


        var buttons = document.querySelectorAll('span.button__label');

        for (var i = 0; i < buttons.length; i++) {
            if (buttons[i].textContent === 'Pedido' && buttons[i].style.display === 'none' && isAutoAvaliacao) {
                buttons[i].parentNode.click();
                break; // Para após o primeiro clique encontrado.
            }
        }

        // Após 1 segundo, clique no elemento com a classe "option__label" e o texto "Entregues"
        setTimeout(function () {
            var optionLabels = document.querySelectorAll('span.option__label');

            for (var j = 0; j < optionLabels.length; j++) {
                if (optionLabels[j].textContent === 'Entregues' && isAutoAvaliacao) {
                    optionLabels[j].click();
                    break;
                }
            }

            var buttons = document.querySelectorAll('span.button__label');

            for (var k = 0; k < buttons.length; k++) {
                if (buttons[k].textContent === 'Avaliação' && buttons[k].style.display === 'none' && isAutoAvaliacao) {
                    buttons[k].parentNode.click();
                    break; // Para após o primeiro clique encontrado.
                }
            }

            // Após 1 segundo, clique no elemento com a classe "option__label" e o texto "Pendentes"
            setTimeout(function () {
                var optionLabels = document.querySelectorAll('span.option__label');

                for (var f = 0; f < optionLabels.length; f++) {
                    if (optionLabels[f].textContent === 'Pendentes' && isAutoAvaliacao) {
                        optionLabels[f].click();
                        break;
                    }
                }

                // VER PEDIDO
                // Após mais 1 segundo, clique no elemento com o seletor especificado
                setTimeout(function () {
                    // Localize o elemento usando o seletor CSS
                    var elementToClick = document.querySelector('#__layout > div > div:nth-of-type(3) > div:nth-of-type(3) > div > div > div > div > div > div > div:nth-of-type(2) > div > div > div:nth-of-type(2) > a');

                    // Verifique se o elemento foi encontrado
                    if (isAutoAvaliacao) {
                        if (elementToClick) {
                            // Clique no elemento
                            elementToClick.click();
                        } else {
                            console.log('Elemento não encontrado');

                            for (var i = 0; i < optionLabels.length; i++) {
                                if (optionLabels[i].textContent === 'Todos') {
                                    optionLabels[i].click();
                                    break;
                                }
                            }
                            setTimeout(clickAvaliacao, verificadordevenda); // Volta ao inicio do script
                            return;
                        }
                    } else {
                        console.log('AutoAvaliação desativada.')
                        return;
                    }

                    // Após mais 1 segundo, clique na área de texto
                    setTimeout(function () {
                        var textArea = document.querySelector('textarea[data-v-11b88eb0][placeholder="Digite sua mensagem..."].form-control.type_msg.resize-vertical');

                        if (textArea && isAutoAvaliacao) {
                            // Clique na área de texto
                            textArea.click();

                            // Insira o texto especificado
                            textArea.value = mensagemchat;

                            // Dispare um evento de 'input' para simular a entrada de texto
                            var inputEvent = new Event('input', {
                                bubbles: true,
                                cancelable: true,
                            });
                            textArea.dispatchEvent(inputEvent);
                        } else {
                            console.log('Área de texto não encontrada ou a AutoAvaliação foi desativada');
                        }

                        // Após mais 1 segundo, clique no botão de enviar
                        setTimeout(function () {
                            var sendButton = document.querySelector('span.input-group-text.send-button');

                            if (sendButton && isAutoAvaliacao) {
                                // Clique no botão de enviar
                                sendButton.click();
                            } else {
                                console.log('Botão de enviar não encontrado ou a AutoAvaliação foi desativada');
                            }
                            // Após mais 1 segundo, clique no elemento com o seletor especificado
                            setTimeout(function () {
                                var finalElementToClick = document.querySelector('#__layout > div > div:nth-of-type(3) > div:nth-of-type(5) > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div > div > div > div:nth-of-type(2) > div > a > i');

                                // Verifique se o elemento foi encontrado
                                if (finalElementToClick && isAutoAvaliacao) {
                                    // Clique no elemento
                                    finalElementToClick.click();
                                } else {
                                    console.log('Elemento final não encontrado ou a AutoAvaliação foi desativada');
                                }

                                // Após mais 1 segundo, clique na área de texto
                                setTimeout(function () {
                                    var textArea2 = document.querySelector('textarea[data-v-fb07956e][placeholder="Digite sua opinião aqui."].input-field');

                                    if (textArea2 && isAutoAvaliacao) {
                                        // Clique na área de texto
                                        textArea2.click();

                                        // Insira o texto especificado
                                        textArea2.value = mensagemavaliacao;

                                        // Dispare um evento de 'input' para simular a entrada de texto
                                        var inputEvent2 = new Event('input', {
                                            bubbles: true,
                                            cancelable: true,
                                        });
                                        textArea2.dispatchEvent(inputEvent2);
                                    } else {
                                        console.log('Área de texto não encontrada ou a AutoAvaliação foi desativada');
                                    }

                                    // Após mais 1 segundo, clique no botão de enviar
                                    setTimeout(function () {
                                        var sendButton2 = document.querySelector('a.btn.btn-primary[style="margin-top: 20px; margin-bottom: 30px;"]');

                                        if (sendButton2 && isAutoAvaliacao) {
                                            // Clique no botão de enviar
                                            sendButton2.click();
                                        } else {
                                            console.log('Botão de enviar não encontrado ou a AutoAvaliação foi desativada');
                                        }
                                        // Após clicar no botão "Publicar avaliação", clique no elemento com o texto "Minhas vendas"
                                        setTimeout(function () {
                                            var elements = document.querySelectorAll('span[data-v-fb07956e]');

                                            for (var i = 0; i < elements.length; i++) {
                                                if (elements[i].textContent === 'Minhas vendas') {
                                                    elements[i].click();
                                                    setTimeout(clickAvaliacao, 3000); // Reinicia o script
                                                    break;
                                                }
                                            }
                                        }, 1000); // Espera 1 segundo antes de clicar no elemento "Minhas vendas".
                                    }, 1000); // Espera 1 segundo antes de clicar no botão de avaliar.
                                }, 1000); // Espera 1 segundo antes de clicar na área de texto.
                            }, 1000); // Espera 1 segundo antes de clicar no elemento final.
                        }, 1000); // Espera 1 segundo antes de clicar no botão de enviar.
                    }, 1000); // Espera 1 segundo antes de clicar na área de texto.
                }, delaychat); // Espera 1 segundo antes de clicar no elemento especificado.
            }, delaypendentes); // Espera 1 segundo antes de clicar em "Pendentes".
        }, delayentregues);
    }


    function toggleAutoAvaliacao() {
        const loadMoreLink = document.querySelector('.link-view-all a.set-color');

        if (isAutoAvaliacao) {
            isAutoAvaliacao = false;
            loadAutoAvaliacao.innerHTML = 'Ativar AutoAvaliação';
            return;
        } else {
            isAutoAvaliacao = true;
            loadAutoAvaliacao.innerHTML = 'Desativar AutoAvaliação';
            setTimeout(clickAvaliacao, 1000);
        }
    }




    function toggleAutoClick() {
        const loadMoreLink = document.querySelector('.link-view-all a.set-color');

        if (isAutoClicking) {
            // Pausa o clique automático
            clearInterval(autoClickInterval);
            isAutoClicking = false;
            loadSalesButton.innerHTML = 'Carregar vendas';
        } else {
            // Inicia o clique automático
            autoClickInterval = setInterval(() => {
                loadMoreLink.click();
            }, 1000); // Clique a cada 1 segundo (ajuste conforme necessário)
            isAutoClicking = true;
            loadSalesButton.innerHTML = 'Pausar Carregamento';
        }
    }

    // Cria o botão GGUtils
    const ggUtilsButton = document.createElement('button');
    ggUtilsButton.innerHTML = 'GGUtils';
    ggUtilsButton.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 10px;
    padding: 10px;
    font-size: 16px;
    font-weight: bold;
    background: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 9999;
`;

    // Adiciona um evento de clique ao botão GGUtils
    ggUtilsButton.addEventListener('click', () => {
        // Verifica o estado da tabela e decide se deve abri-la ou fechá-la
        if (isTableOpen) {
            // Fecha a tabela
            functionTable.style.bottom = '-100%';
            isTableOpen = false;
        } else {
            // Abre a tabela
            const desiredPosition = '10%';
            functionTable.style.bottom = desiredPosition;
            isTableOpen = true;
        }
    });

    // Adiciona o botão à página
    document.body.appendChild(ggUtilsButton);

    popup.appendChild(document.createElement('br'));
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';
    input.style.display = 'none';

    input.oninput = () => {
        const file = input.files[0];
        if (!file) {
            return;
        }
    const reader = new FileReader();
    reader.readAsText(file);
reader.onload = () => {
    const numeros = reader.result.split('\n').filter(numero => numero.trim() !== '');
    numeros.forEach((numero, indice) => {
        setTimeout(() => {
            adicionarNumero(numero.trim(), indice === numeros.length - 1);
        }, (indice + 1) * 2);
    });
};
};

    // Associar o evento ao botão "Adicionar Estoque"
    const addStockButton = document.getElementById('addStockButton');
    addStockButton.addEventListener('click', () => {
        input.click(); // Abre o seletor de arquivo quando o botão é clicado
    });

    // Cria o botão "Carregar vendas"
    const loadSalesButton = document.getElementById('loadSalesButton');
    loadSalesButton.addEventListener('click', toggleAutoClick);


    // Cria o botão "Auto Avaliação"
    const loadAutoAvaliacao = document.getElementById('loadAutoAvaliacao');
    loadAutoAvaliacao.addEventListener('click', toggleAutoAvaliacao);


    popup.style.display = 'none';
    document.body.appendChild(popup);

    window.adicionarNumero = function(numero, isLast) {
        const lastInputElement = document.querySelectorAll('textarea.form-control');
        const lastTextArea = lastInputElement[lastInputElement.length - 1];
    
        if (numero.includes('*')) {
            const lines = numero.split('*');
            lines.forEach((line, index) => {
                lastTextArea.value += line.trim();
                if (index < lines.length - 1) {
                    lastTextArea.value += '\n'; // Pula a linha entre as partes
                }
            });
        } else {
            lastTextArea.value = numero;
        }
    
        lastTextArea.dispatchEvent(new Event('input', { bubbles: true }));
    
        if (!isLast) {
            document.querySelector('a.add-button').click();
        }
    };
    
    // ---- Botão para ver token ---- //

    document.querySelector('.resume-profile-module').innerHTML += `<a class="btn btn-primary" style="margin-left: 5px; background-color: rgb(17, 17, 17);border-color: rgb(17, 17, 17);" onclick="prompt('Seu Token:',document.cookie.split('; ').find(cookie => cookie.startsWith('auth._token.local=')).split('=')[1].split('Bearer%20')[1])">🔑</a>`;
    
    })();
