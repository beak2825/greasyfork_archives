// GGUTILS MODIFICADO
// ==UserScript==
// @name         GGUtils
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Melhor script para a GGMAX
// @author       Recieri
// @match        https://ggmax.com.br/*
// @icon         https://cdn.ggmax.com.br/d/61d55b/img/logo-footer.04895db.png
// @grant        GM_getResourceText
// @license      Recieri
// @downloadURL https://update.greasyfork.org/scripts/487475/GGUtils.user.js
// @updateURL https://update.greasyfork.org/scripts/487475/GGUtils.meta.js
// ==/UserScript==

(function () {
    'use strict';

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

    let isTableOpen = false; // Variável para rastrear o estado da tabela

    // Cria a tabela de funções novas
const functionTable = document.createElement('div');
functionTable.innerHTML = `
    <div>
        <button id="clearItemsButton" style="display: block; width: 100%; background: linear-gradient(315deg, #0053AC 0%, #007AFD 100%); border: none; padding: 10px; cursor: pointer; color: #fff; font-weight: bold; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.7); text-align: center; font-size: 14px; margin-bottom: 5px; transition: background 0.5s, box-shadow 0.5s;">Limpar Items</button>
    </div>
    <div style="margin-top: 10px;">
        <button id="addStockButtonWithFile" style="display: block; width: 100%; background: linear-gradient(315deg, #0053AC 0%, #007AFD 100%); border: none; padding: 10px; cursor: pointer; color: #fff; font-weight: bold; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.7); text-align: center; font-size: 14px; margin-bottom: 5px; transition: background 0.5s, box-shadow 0.5s;">Add Estoque (Arquivo)</button>
    </div>
    <div style="margin-top: 10px;">
        <button id="addStockButtonWithText" style="display: block; width: 100%; background: linear-gradient(315deg, #0053AC 0%, #007AFD 100%); border: none; padding: 10px; cursor: pointer; color: #fff; font-weight: bold; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.7); text-align: center; font-size: 14px; margin-bottom: 5px; transition: background 0.5s, box-shadow 0.5s;">Add Estoque (Texto)</button>
    </div>
    <div style="margin-top: 10px;">
        <button id="loadSalesButton" style="display: block; width: 100%; background: linear-gradient(315deg, #0053AC 0%, #007AFD 100%); border: none; padding: 10px; cursor: pointer; color: #fff; font-weight: bold; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.7); text-align: center; font-size: 14px; margin-bottom: 5px; transition: background 0.5s, box-shadow 0.5s;">Carregar Vendas</button>
    </div>
    <div style="margin-top: 10px;">
        <button id="loadAutoAvaliacao" style="display: block; width: 100%; background: linear-gradient(315deg, #0053AC 0%, #007AFD 100%); border: none; padding: 10px; cursor: pointer; color: #fff; font-weight: bold; box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.7); text-align: center; font-size: 14px; margin-bottom: 5px; transition: background 0.5s, box-shadow 0.5s;">Ativar AutoAvaliação</button>
    </div>
`;

    // Estiliza a tabela
functionTable.style.cssText = `
    position: fixed;
    bottom: -100%;
    left: 0;
    background: #333;
    color: white;
    padding: 15px;
    border-radius: 10px;
    box-shadow: 0 8px 8px rgba(0, 0, 0, 0.9);
    font-family: sans-serif;
    font-size: 14px;
    line-height: 1.0;
    max-width: 300px;
    z-index: 9998;
    transition: none;
    border: 1px solid #007BFF;
`;


    // Adicione o ID "addStockButtonWithFile" ao botão no HTML da tabela
    // <button id="addStockButtonWithFile">Adicionar Estoque</button>
    // <button id="loadSalesButton">Carregar vendas</button>
    // <button id="automaticavaliation">Avaliação automatica</button>

    // Adiciona a tabela à página
    document.body.appendChild(functionTable);

    // Função para alternar o clique automático
    let isAutoClicking = false; // Variável para rastrear o estado do clique automático
    let autoClickInterval;


    function toggleAutoClick() {
        const loadMoreLink = document.querySelector('.link-view-all a.set-color');
        functionTable.style.bottom = '-100%';
        isTableOpen = false;

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


    // Associar o evento ao botão "Limpar Items"
    const clearItemsButton = document.getElementById('clearItemsButton');
    clearItemsButton.addEventListener('click', async () => {
        functionTable.style.bottom = '-100%';
        isTableOpen = false;

        //aqui


        // Função para remover ícones
        async function removeIcons() {
            let removeIcon;

            while ((removeIcon = document.querySelector('.icon-checkbox-remove-circle'))) {
                // Adicionar evento de clique
                console.log(`Restam: ${document.querySelectorAll('.icon-checkbox-remove-circle').length - 1}`);
                removeIcon.click();
                // Aguardar um curto período para garantir que o ícone seja removido
                await new Promise(resolve => requestAnimationFrame(resolve));
            }

            console.log('Todos os ícones foram removidos.');

            // Limpar todas as caixas de texto identificadas por "textarea.form-control"
            const textAreas = document.querySelectorAll('textarea.form-control');
            for (const textArea of textAreas) {
                textArea.value = '';
                textArea.dispatchEvent(new Event('input', { bubbles: true }));
            }

        }

        // Iniciar o processo de remoção
        await removeIcons();


        //aqui

    });

    // Associar o evento ao botão "Adicionar Estoque Com Arquivo"
    const addStockButtonWithFile = document.getElementById('addStockButtonWithFile');
    addStockButtonWithFile.addEventListener('click', () => {
        functionTable.style.bottom = '-100%';
        isTableOpen = false;
        input.click(); // Abre o seletor de arquivo quando o botão é clicado
    });

    // Associar o evento ao botão "Adicionar Estoque Com Texto"
    const addStockButtonWithText = document.getElementById('addStockButtonWithText');
    addStockButtonWithText.addEventListener('click', () => {
        functionTable.style.bottom = '-100%';
        isTableOpen = false;
        // Criar uma caixa de texto personalizada para inserir o texto
        const popupContainer = document.createElement('div');
        popupContainer.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #4d4d4d; /* Cor cinza utilizada nos outros elementos */
        padding: 40px;
        border: 1px solid #007bff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
        z-index: 9999;
    `;

        const textarea = document.createElement('textarea');
        textarea.placeholder = 'Insira o texto aqui...';
        textarea.style.cssText = `
        width: 400px; /* Aumentei a largura da caixa de texto */
        height: 670px;
        resize: vertical;
        border: 1px solid #ccc;
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 20px;
    `;

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirmar';
    confirmButton.style.cssText = `
        display: block;
        padding: 10px 27px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        position: absolute;
        bottom: 10px;
        left: 35px;
        z-index: 1; /* Adicione um índice Z para garantir que fique acima da caixa de texto */
    `;

    // Adicionar botão "Fechar" no canto inferior direito
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.cssText = `
        display: block;
        padding: 10px 10px;
        background-color: #ff0000; /* Cor vermelha */
        color: #fff;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        position: absolute;
        bottom: 10px;
        right: 35px;
        margin-top: 10px;
        z-index: 1; /* Adicione um índice Z para garantir que fique acima da caixa de texto */
    `;

        // Adicionar o botão "X" ao popupContainer
        popupContainer.appendChild(closeButton);

        // Adicionar os elementos à caixa de texto
        popupContainer.appendChild(textarea);
        popupContainer.appendChild(confirmButton);



        // Adicionar a caixa de texto ao corpo do documento
        document.body.appendChild(popupContainer);

        // Adicionar evento de clique ao botão "X"
        closeButton.addEventListener('click', () => {
            // Remover a caixa de texto do corpo do documento
            document.body.removeChild(popupContainer);
        });

        // Adicionar evento de clique ao botão de confirmar
        confirmButton.addEventListener('click', () => {
            const textoInserido = textarea.value.trim();

            // Verificar se o usuário inseriu algum texto
            if (textoInserido !== '') {
                // Processar e adicionar ao estoque
                processarTextoEAdicionarAoEstoque(textoInserido);
            } else {
                console.log('Nenhum texto inserido.');
            }

            // Remover a caixa de texto do corpo do documento
            document.body.removeChild(popupContainer);
        });
    });

    // Função para processar o texto inserido e adicionar ao estoque
    function processarTextoEAdicionarAoEstoque(texto) {
        const linhas = texto.split('\n').filter(numero => numero.trim() !== '');
        linhas.forEach((linha, indice) => {
            setTimeout(() => {
                adicionarNumero(linha.trim(), indice === linhas.length - 1);
            }, (indice + 1) * 2);
        });
    }


    // Cria o botão "Carregar vendas"
    const loadSalesButton = document.getElementById('loadSalesButton');
    loadSalesButton.addEventListener('click', toggleAutoClick);


    // Cria o botão "Auto Avaliação"
    const loadAutoAvaliacao = document.getElementById('loadAutoAvaliacao');
            loadAutoAvaliacao.addEventListener('click', () => {
                functionTable.style.bottom = '-100%';
                isTableOpen = false;
        });


    popup.style.display = 'none';
    document.body.appendChild(popup);

    window.adicionarNumero = function (numero, isLast) {
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
})();

// Função para verificar se a URL corresponde ao padrão
function urlCorresponde(url) {
    return /https:\/\/ggmax\.com\.br\/.*/.test(url);
}


    // Função para limitar o tamanho da mensagem em caracteres
    function limitarTamanhoMensagem(mensagem, caracteres = 100) {
        if (mensagem.length > caracteres) {
            return mensagem.substring(0, caracteres) + '...';
        }
        return mensagem;
    }


// Função para adicionar respostas rápidas ao chat
function adicionarRespostaRapida(resposta) {
    // Encontre o campo de entrada do chat (ajuste o seletor conforme necessário)
    const chatInput = document.querySelector('textarea[data-v-11b88eb0][placeholder="Digite sua mensagem..."]');

    if (chatInput) {
        // Insira a resposta rápida no campo de entrada
        chatInput.value = resposta;

        // Dispare um evento 'input' para simular a entrada de texto
        const inputEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
        });
        chatInput.dispatchEvent(inputEvent);

        // Espere um curto período de tempo antes de enviar a mensagem (ajuste conforme necessário)
        setTimeout(() => {
            // Encontre o botão de envio (ajuste o seletor conforme necessário)
            const sendButton = document.querySelector('span.input-group-text.send-button');

            if (sendButton) {
                // Clique no botão de envio
                //sendButton.click();
            }
        }, 1000); // Espere 1 segundo antes de enviar a mensagem (ajuste conforme necessário)
    }
}

// Cria o botão "Respostas Rápidas" com posição fixa
const respostaRapidaButton = document.createElement('button');
respostaRapidaButton.textContent = 'RESPOSTAS';
respostaRapidaButton.style.cssText = `
    position: fixed;
    bottom: 10px;
    left: 110px;
    padding: 10px;
    font-size: 14px;
    font-weight: bold;
    background: #007bff;
    color: white;
    box-shadow: 0 7px 7px rgba(0, 0, 0, 0.3);
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 9999;
`;



// Função para criar o quadro de respostas rápidas
function criarQuadroRespostasRapidas() {
    if (!urlCorresponde(window.location.href)) {
        return null; // Retorna null se a URL não corresponder
    }
    // Cria o container do quadro de respostas
    const quadroRespostas = document.createElement('div');
    quadroRespostas.style.cssText = `
        position: fixed;
        bottom: 300px;
        left: 0;
        background-color: #333;
        color: white;
        text-align: center;
        padding: 15px;
        border-radius: 10px;
        box-shadow: 0 8px 8px rgba(0, 0, 0, 0.9);
        font-family: sans-serif;
        font-size: 12px;
        line-height: 1.5; /* Ajuste para evitar esticamento vertical */
        max-width: 350px;
        z-index: 9998;
        display: none;
        border: 1px solid #007BFF;
    `;
    // Cria categorias
    const categorias = ['Intervenções', 'Brindes', 'Suporte','Outros'];

    // Adiciona botões de categorias e mensagens
    categorias.forEach((categoria) => {
        const categoriaButton = document.createElement('button');
        categoriaButton.textContent = categoria;
        categoriaButton.style.cssText = `
            display: block;
            margin: 0 auto;
            width: 80%;
            background: linear-gradient(315deg, #0053AC 0%, #007AFD 100%); /* Gradiente para botões de categorias */
            border: none;
            padding: 10px;
            cursor: pointer;
            color: #fff;
            font-weight: bold; /* Texto em negrito */
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.7); /* Sombra mais suave para botões de categorias */
            text-align: center;
            font-size: 14px;
            margin-bottom: 5px; /* Adiciona espaço entre os botões */
            transition: background 0.5s, box-shadow 0.5s;
        `;

        // Efeito de escurecimento ao passar o mouse
        categoriaButton.addEventListener('mouseenter', () => {
            categoriaButton.style.background = 'linear-gradient(315deg, #004380 0%, #0053AC 100%)'; /* Cor mais escura ao passar o mouse */
        });

        categoriaButton.addEventListener('mouseleave', () => {
            categoriaButton.style.background = 'linear-gradient(315deg, #0053AC 0%, #007AFD 100%)'; /* Restaura a cor original ao sair do mouse */
        });

        // Cria mensagens para cada categoria
        const mensagens = {
            'Intervenções': [`Este produto não é elegível ao reembolso por tratar-se de uma CONTA.\nA descrição do produto é clara com relação ao conteúdo a ser adquirido e condições para que o reembolso seja feito.\nForam acordadas previamente cláusulas para aquisição do produto, sendo este, de uso único, onde o seu envio resulta numa perda de integridade (integridade esta que não poderá ser garantida já que o conteúdo foi exposto a terceiros, no caso, o comprador).`,
                             `⚠️ VERIFICAÇÃO DE SEGURANÇA!\n(Este é um sistema para prevenir fraudes/golpes)\n\nAo relatar um problema, realizamos imediatamente uma verificação no sistema global para assegurar a integridade dos dados da sua conta desde a entrega do produto.\n\nSe não identificarmos nenhuma violação nos dados, garantimos o reembolso ou forneceremos uma nova conta em questão de minutos.\n\nAgora, se houver violações nos dados após a sua compra, as informações do pagante serão solicitadas como medida de segurança contra uma possível fraude. As alterações nos dados da sua conta após a compra, são um sinal de uma possível fraude, e tomaremos as medidas necessárias.\n\nRessaltamos que, se o pagante for menor de idade, a responsabilidade recai sobre os pais.\n\nPedimos que tente acessar a conta novamente com os dados fornecidos. Se conseguir acessá-la sem problemas é só aproveitar o seu produto. Caso contrário, informe-nos pelo chat da compra para iniciarmos a Verificação de Segurança.`,
                             `Após uma análise minuciosa dos dados, notamos uma mudança nas credenciais de acesso a sua conta, juntamente com um acesso registrado a aproximadamente ? horas atrás. É importante ressaltar que tanto a alteração nas credenciais quanto o acesso à conta ocorreram após a conclusão da entrega do produto e as únicas partes com acesso às credenciais são você, nosso estimado cliente, e nós. Diante desses eventos, tudo indica que houve uma intervenção em sua conta com intenções questionáveis.\n\nRessaltamos que nossa equipe jurídica está pronta para lidar com tais situações. Se necessário, solicitaremos judicialmente os dados de pagamento à plataforma GGMAX para identificar o pagante ou seus responsáveis legais. Esse comportamento configura o crime de Estelionato (artigo 171).\n\nArt. 171\nObter, para si ou para outrem, vantagem ilícita, em prejuízo alheio, induzindo ou mantendo alguém em erro, mediante artifício, ardil, ou qualquer outro meio fraudulento.\n\nPena: reclusão, de um a cinco anos, e multa, de quinhentos mil réis a dez contos de réis.\n\nEstamos comprometidos em garantir a segurança e a integridade de nossos serviços, tomando as medidas necessárias para preservar a confiança em nossos produtos. Portanto, caso esteja agindo de má fé, solicito que seja transparente a respeito, para que possamos resolver esta situação da melhor maneira possível.`,
                             `Orientamos aos nossos clientes através da descrição do anúncio a gravarem a sua tela desde o ato da compra até realizar o login na conta adquirida. Isso garante uma maior segurança para o cliente e o vendedor. Infelizmente este cliente não fez isso e se torna inviável aceitar a hipótese de que as credenciais fornecidas não funcionaram, pois nossas contas são verificadas antes de irem ao estoque e as credenciais de acesso são restritas apenas a mim e ao cliente. O fato de ter ocorrido um acesso na conta após a entrega das credenciais indica que foi o cliente que acessou a conta.`,
                             `Recomendamos na descrição que, ao adquirir sua conta, o cliente realize a alteração da senha imediatamente, visando reforçar a segurança. Contudo, caso o cliente opte por não seguir essa orientação e a conta seja roubada/comprometida, lamentamos informar que não podemos prestar assistência nesses casos específicos.`,
                             `Infelizmente você não receberá o reembolso, temos uma equipe jurídica que está de prontidão para lidar com clientes mal intencionados como você que querem burlar os termos de compra pré-acordados, caso você continue com este comportamento iremos iniciar uma ação legal contra o responsável pelo pagamento deste pedido. A identificação do pagante será realizada junto a plataforma da ggmax e através do endereço IP que acessou a conta após a entrega do produto.`,
                             `Solicito uma análise cuidadosa do caso pelos moderadores da GGMAX. O cliente alterou a senha após a entrega do produto e agora afirma não ter acesso à conta, isso prejudica muito os vendedores. Sugiro que medidas seja tomadas a fim de evitar que clientes com esse comportamento possam realizar novas compras dentro da plataforma.`],
            'Suporte': [`Todos os produtos que vendemos são entregues de forma instantânea após a aprovação do pagamento, portanto sempre que realizar uma compra conosco, verifique as mensagens no chat do pedido para localizar as informações do produto adquirido.`,
                       `Recomendamos que copie e cole as credenciais de acesso fornecidas para garantir maior precisão e evitar possíveis erros de digitação. A seguir, estão o nome de usuário e a senha, respectivamente:`,
                       `Não associamos nenhum endereço de e-mail às contas que vendemos aos nossos clientes. Se a conta que você adquiriu apresentar um e-mail vinculado que você não reconhece, lamentamos informar que é possível que sua conta tenha sido comprometida. Infelizmente, não podemos oferecer assistência em tais casos, pois se trata de mau uso das credenciais por parte do cliente.`,
                       `Caso ainda enfrente problemas, por favor, entre em contato conosco. Estamos aqui para ajudar. Até logo!`,
                       `Por gentileza, realize o upload das provas em um serviço de hospedagem de arquivos em nuvem, como IMGUR ou GOOGLE DRIVE, e compartilhe o link conosco. Não se esqueça de ajustar a visibilidade do arquivo para público, permitindo assim que possamos visualizar as provas.`],
            'Brindes': [`Como forma de agradecimento, entregamos de brinde a você uma conta '〔🎲〕 LEVEL 1000+ ALEATÓRIA':`,
                       `Já lhe enviamos um brinde recentemente, portanto no momento não podemos lhe enviar outro.`],
            'Outros': [`Olá tudo bem?`, `Caso tenha ficado satisfeito com o produto, deixe-nos uma avaliação! Isso é muito importante para nós e também para toda a comunidade. Agradecemos pela preferência. 😀`,
                       `É gratificante para nós saber que o produto atendeu plenamente às suas expectativas.`]
        };

        const mensagensDiv = document.createElement('div');
        mensagensDiv.style.cssText = `
            max-height: 0;
            overflow: hidden;
            margin-top: 1px; /* Aproximação de 1px */
            margin-bottom: 10px;
            color: #666666; /* Cor do texto */
            transition: max-height 0.5s;
        `;
        mensagensDiv.classList.add(categoria);

        mensagens[categoria].forEach((mensagem) => {
            const mensagemButton = document.createElement('button');
            mensagemButton.textContent = limitarTamanhoMensagem(mensagem);
            mensagemButton.style.cssText = `
                display: block;
                width: 100%;
                background: linear-gradient(315deg, #ADADAD 0%, #EDEDED 100%); /* Gradiente para botões de mensagens */
                border: none;
                padding: 10px;
                cursor: pointer;
                color: #666666; /* Cor do texto */
                font-weight: bold; /* Texto em negrito */
                text-align: center;
                font-size: 10px;
                margin-bottom: 5px; /* Adiciona espaço entre os botões */
                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.7); /* Mesma sombra suave para botões de mensagens */
                transition: background 0.5s, box-shadow 0.5s;
            `;

            // Efeito de escurecimento ao passar o mouse
            mensagemButton.addEventListener('mouseenter', () => {
                mensagemButton.style.background = 'linear-gradient(315deg, #EDEDED 0%, #CECECE 100%)'; /* Cor mais escura ao passar o mouse */
            });

            mensagemButton.addEventListener('mouseleave', () => {
                mensagemButton.style.background = 'linear-gradient(315deg, #ADADAD 0%, #EDEDED 100%)'; /* Restaura a cor original ao sair do mouse */
            });

            mensagemButton.addEventListener('click', () => {
            // Ao clicar em uma resposta rápida, adiciona a resposta ao chat e envia
            adicionarRespostaRapida(mensagem);
        });

            mensagensDiv.appendChild(mensagemButton);
        });

        // Função para fechar todas as categorias, exceto a que está sendo clicada
function fecharCategoriasExceto(categoriaAtual) {
    categorias.forEach((categoria) => {
        if (categoria !== categoriaAtual) {
            const outrasMensagensDiv = document.querySelector(`.${categoria}`);
            outrasMensagensDiv.style.maxHeight = '0px';
        }
    });
}

    categoriaButton.addEventListener('click', () => {
        // Ao clicar em uma categoria, fecha as outras e mostra ou esconde a categoria atual
        fecharCategoriasExceto(categoria);
        const mensagensDiv = document.querySelector(`.${categoria}`);
        if (mensagensDiv.style.maxHeight === '0px') {
            mensagensDiv.style.maxHeight = `${mensagensDiv.scrollHeight}px`;
        } else {
            mensagensDiv.style.maxHeight = '0px';
        }
    });

        quadroRespostas.appendChild(categoriaButton);
        quadroRespostas.appendChild(mensagensDiv);
    });

    // Adiciona o quadro de respostas ao corpo da página
    document.body.appendChild(quadroRespostas);
    return quadroRespostas;
}
//-----------


// Função para alternar a exibição do quadro de respostas rápidas
let quadroRespostasVisivel = false;
respostaRapidaButton.addEventListener('click', () => {
    // Define a posição inicial do quadro de respostas (acima do botão)
    quadroRespostas.style.left = `${respostaRapidaButton.getBoundingClientRect().left}px`;

    // Recalcula a posição vertical ao exibir o quadro
    const bottomPosition = window.innerHeight - respostaRapidaButton.getBoundingClientRect().top + 25;
    quadroRespostas.style.bottom = `${bottomPosition}px`;

    if (quadroRespostasVisivel) {
        quadroRespostas.style.display = 'none';
    } else {
        quadroRespostas.style.display = 'block';
    }
    quadroRespostasVisivel = !quadroRespostasVisivel;
});

// Adicione o botão "Respostas Rápidas" à página
document.body.appendChild(respostaRapidaButton);

// Cria o quadro de respostas rápidas
const quadroRespostas = criarQuadroRespostasRapidas();

    // ...

// Variáveis para controle de arrasto
let isDragging = false;
let offsetX, offsetY;

// Adiciona eventos de arrasto ao quadro de respostas
quadroRespostas.addEventListener('mousedown', (event) => {
    isDragging = true;

    // Calcula offsetX e offsetY em relação ao canto superior esquerdo do quadro
    offsetX = event.clientX - quadroRespostas.getBoundingClientRect().left;
    offsetY = event.clientY - quadroRespostas.getBoundingClientRect().top;

    // Ajusta offsetY para ser a distância entre a parte inferior do quadro e o cursor do mouse
    offsetY = quadroRespostas.getBoundingClientRect().bottom - event.clientY;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const x = event.clientX - offsetX;
        const y = event.clientY + offsetY;

        // Define a nova posição do quadro de respostas
        quadroRespostas.style.left = `${x}px`;
        quadroRespostas.style.bottom = `${window.innerHeight - y}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});