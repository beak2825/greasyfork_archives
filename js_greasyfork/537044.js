// ==UserScript==
// @name          Quebra-Paywall BR (12ft.io & Archive.is)
// @namespace     http://tampermonkey.net/
// @version       1.2
// @description   Adiciona botões flutuantes para acessar rapidamente artigos bloqueados por paywall em dezenas de sites de notícias e mídia brasileiros e alguns internacionais, utilizando 12ft.io e Archive.is. Desenvolvido para funcionar de forma robusta em Single Page Applications (SPAs) e com carregamento dinâmico de conteúdo.
// @author        Bruno Fortunato & Colaboradores (Comunidade Gemini/IA)
// @homepage      https://github.com/BrunoFortunato/Quebra-Paywall-BR
// @license       MIT
// @match         *://*.folha.uol.com.br/*
// @match         *://*.estadao.com.br/*
// @match         *://*.oglobo.globo.com/*
// @match         *://*.valor.globo.com.br/*
// @match         *://*.gazetadopovo.com.br/*
// @match         *://*.correiobraziliense.com.br/*
// @match         *://*.uol.com.br/*
// @match         *://*.gauchazh.clicrbs.com.br/*
// @match         *://*.nsctotal.com.br/*
// @match         *://*.diariocatarinense.clicrbs.com.br/*
// @match         *://*.jornaldocomercio.com/*
// @match         *://*.jc.ne10.uol.com.br/*
// @match         *://*.em.com.br/*
// @match         *://*.otempo.com.br/*
// @match         *://*.jota.info/*
// @match         *://*.poder360.com.br/*
// @match         *://*.diariodonordeste.verdesmares.com.br/*
// @match         *://*.opovo.com.br/*
// @match         *://*.correio24horas.com.br/*
// @match         *://*.atarde.uol.com.br/*
// @match         *://*.gazetaonline.com.br/*
// @match         *://*.abril.com.br/*
// @match         *://*.veja.abril.com.br/*
// @match         *://*.exame.com/*
// @match         *://*.istoedinheiro.com.br/*
// @match         *://*.cartacapital.com.br/*
// @match         *://*.diariosp.com.br/*
// @match         *://*.jornaldebrasilia.com.br/*
// @match         *://*.folhadelondrina.com.br/*
// @match         *://*.odiario.com/*
// @match         *://*.nexojornal.com.br/*
// @match         *://*.jornalggn.com.br/*
// @match         *://*.observatoriodaimprensa.com.br/*
// @match         *://*.terra.com.br/*
// @match         *://*.infomoney.com.br/*
// @match         *://*.sunoresearch.com.br/*
// @match         *://*.moneytimes.com.br/*
// @match         *://*.seudinheiro.com/*
// @match         *://*.cnnbrasil.com.br/*
// @match         *://*.band.uol.com.br/*
// @match         *://*.r7.com/*
// @match         *://*.metropoles.com/*
// @match         *://*.gazetabrasil.com.br/*
// @match         *://*.brasil247.com/*
// @match         *://*.theintercept.com.br/*
// @match         *://*.esmaelmorais.com.br/*
// @match         *://*.blogdopim.com.br/*
// @match         *://*.blogdosakamoto.blogosfera.uol.com.br/*
// @match         *://*.revistaforum.com.br/*
// @match         *://*.redebrasilatual.com.br/*
// @match         *://*.conversaafiada.com.br/*
// @match         *://*.operamundi.uol.com.br/*
// @match         *://*.brasildefato.com.br/*
// @match         *://*.ihu.unisinos.br/*
// @match         *://*.catracalivre.com.br/*
// @match         *://*.nsja.com.br/*
// @match         *://*.parana-online.com.br/*
// @match         *://*.paranaportal.uol.com.br/*
// @match         *://*.tribunapr.com.br/*
// @match         *://*.correiodopovo.com.br/*
// @match         *://*.jornalnh.com.br/*
// @match         *://*.diariopopular.com.br/*
// @match         *://*.agora.uol.com.br/*
// @match         *://*.sbtnews.com.br/*
// @match         *://*.jovempan.com.br/*
// @match         *://*.bandnewsfm.com.br/*
// @match         *://*.cbn.globoradio.globo.com/*
// @match         *://*.brpolitico.com.br/*
// @match         *://*.correiopopular.com.br/*
// @match         *://*.crusoe.com.br/*
// @match         *://*.diariodaregiao.com.br/*
// @match         *://*.dgabc.com.br/* // Diário do Grande ABC
// @match         *://*.diarinho.com.br/*
// @match         *://*.diariodecanoas.com.br/*
// @match         *://*.epoca.globo.com/* // Revista Época
// @match         *://*.jornalpioneiro.com.br/*
// @match         *://*.jornalvs.com.br/*
// @match         *://*.revistagalileu.globo.com/* // Revista Galileu
// @match         *://*.epocanegocios.globo.com/* // Adicionado: Revista Época Negócios
// @match         *://*.marieclaire.globo.com/* // Adicionado: Revista Marie Claire
// @match         *://*.globorural.globo.com/* // Adicionado: Revista Globo Rural
// @match         *://*.revistapegn.globo.com/* // Adicionado: Pequenas Empresas Grandes Negócios
// @match         *://*.nytimes.com/* // Adicionado: New York Times (Internacional)
// @match         *://*.elpais.com/* // Adicionado: El País (Internacional)
// @match         *://*.economist.com/* // Adicionado: The Economist (Internacional)
// @match         *://*.opopular.com.br/* // Adicionado: O Popular
// @match         *://*.diariodesantamaria.com.br/* // Adicionado: Diário de Santa Maria
// @match         *://*.glamour.globo.com/* // Adicionado: Revista Glamour
// @match         *://*.atribuna.com.br/* // Adicionado: Jornal A Tribuna (Santos)
// @match         *://*.umdoisesportes.com.br/* // Adicionado: Um Dois Esportes
// @match         *://*.gaz.com.br/* // Adicionado: GAZ
// @match         *://*.semprefamilia.com.br/* // Adicionado: Sempre Família
// @match         *://*.jornaldacidadeonline.com.br/* // Sugestão adicional
// @match         *://*.revistacrescer.globo.com/* // Sugestão adicional
// @match         *://*.revistamonet.globo.com/* // Sugestão adicional
// @match         *://*.casavogue.globo.com/* // Sugestão adicional
// @match         *://*.gq.globo.com/* // Sugestão adicional
// @match         *://*.casaclaudia.abril.com.br/* // Sugestão adicional
// @match         *://*.claudia.abril.com.br/* // Sugestão adicional
// @match         *://*.mdemulher.abril.com.br/* // Sugestão adicional
// @match         *://*.viagemeturismo.abril.com.br/* // Sugestão adicional
// @match         *://*.exame.com/* // Para garantir abrangência de subdomínios Exame
// @grant         GM_addStyle
// @grant         window.location
// @downloadURL https://update.greasyfork.org/scripts/537044/Quebra-Paywall%20BR%20%2812ftio%20%20Archiveis%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537044/Quebra-Paywall%20BR%20%2812ftio%20%20Archiveis%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = window.location.href; // Variável para armazenar a última URL conhecida
    let checkInterval = null; // Para controlar o setInterval

    // Estilos comuns para os botões flutuantes
    GM_addStyle(`
        .open-paywall-button {
            position: fixed;
            bottom: 20px;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            cursor: pointer;
            z-index: 2147483647; /* Tenta garantir que fique no topo */
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            opacity: 0.85;
            transition: opacity 0.3s ease, background-color 0.3s ease;
        }
        .open-paywall-button:hover {
            opacity: 1;
        }

        #open-in-12ft-button {
            left: 20px; /* Movido para a esquerda */
            background-color: #007bff; /* Azul */
        }
        #open-in-12ft-button:hover {
            background-color: #0056b3; /* Azul mais escuro */
        }

        #open-in-archive-button {
            left: 140px; /* Posição à direita do 12ft.io */
            background-color: #6c757d; /* Cinza para Archive.is */
        }
        #open-in-archive-button:hover {
            background-color: #5a6268; /* Cinza mais escuro */
        }
    `);

    // Função para criar um elemento de botão
    function createButtonElement(id, text, urlPrefix, alertMessage) {
        const button = document.createElement('button');
        button.id = id;
        button.className = 'open-paywall-button';
        button.innerHTML = text;

        button.addEventListener('click', function(event) {
            event.stopPropagation();
            const currentUrl = window.location.href;

            if (!currentUrl) {
                alert('Não foi possível obter a URL atual.');
                return;
            }

            // Verifica se a URL já é do serviço alvo para evitar loops
            if (currentUrl.startsWith(urlPrefix)) {
                alert(alertMessage);
                return;
            }

            const newUrl = urlPrefix + currentUrl;
            console.log('Redirecionando para: ' + newUrl);
            window.location.href = newUrl;
        });
        return button;
    }

    // Função para remover os botões existentes
    function removeExistingButtons() {
        const button12ft = document.getElementById('open-in-12ft-button');
        const buttonArchive = document.getElementById('open-in-archive-button');
        if (button12ft) {
            button12ft.remove();
        }
        if (buttonArchive) {
            buttonArchive.remove();
        }
    }

    // Função principal para adicionar todos os botões
    function addAllButtons() {
        // Se os botões já estão presentes e visíveis, não faz nada
        if (document.getElementById('open-in-12ft-button') && document.getElementById('open-in-archive-button')) {
            // Verifica se eles estão no body (pode ser que o DOM tenha sido manipulado e eles fiquem "soltos")
            if (document.body.contains(document.getElementById('open-in-12ft-button')) &&
                document.body.contains(document.getElementById('open-in-archive-button'))) {
                return;
            }
        }

        // Garante que o body esteja pronto
        if (!document.body) {
            console.log('Document body not ready yet, deferring button addition.');
            return;
        }

        console.log('Attempting to add/re-add buttons...');
        removeExistingButtons(); // Remove quaisquer botões antigos para garantir um estado limpo

        // Adiciona o botão para 12ft.io
        const button12ft = createButtonElement(
            'open-in-12ft-button',
            '🔓 12ft.io',
            'https://12ft.io/',
            'Esta página já está aberta com o 12ft.io.'
        );
        document.body.appendChild(button12ft);

        // Adiciona o botão para Archive.is
        const buttonArchive = createButtonElement(
            'open-in-archive-button',
            '🏛️ Archive.is',
            'https://archive.is/',
            'Esta página já está aberta com o Archive.is.'
        );
        document.body.appendChild(buttonArchive);
        console.log('Buttons successfully processed.');
    }

    // --- Estratégia de Injeção e Monitoramento ---

    // Função de verificação periódica que tenta adicionar os botões
    function periodicCheckAndAdd() {
        const currentUrl = window.location.href;

        // Se a URL mudou, consideramos uma "nova" página e forçamos a recriação
        if (currentUrl !== lastUrl) {
            console.log('URL changed. Forcing re-addition of buttons.');
            lastUrl = currentUrl;
            addAllButtons();
        } else {
            // Se a URL não mudou, mas os botões não estão visíveis no DOM, tenta adicioná-los
            if (!document.getElementById('open-in-12ft-button') || !document.getElementById('open-in-archive-button')) {
                console.log('Buttons missing on same URL. Attempting to add.');
                addAllButtons();
            }
        }
    }

    // Iniciar a verificação periódica um pouco depois do carregamento
    // e limpá-la se o body não existir ou se a página for embora
    function initializePeriodicCheck() {
        if (checkInterval) {
            clearInterval(checkInterval); // Limpa qualquer intervalo anterior
        }
        checkInterval = setInterval(periodicCheckAndAdd, 500); // Tenta a cada 500ms
    }

    // 1. No carregamento inicial da página (DOMContentLoaded)
    // Isso é a primeira tentativa para garantir que os botões sejam adicionados rapidamente.
    document.addEventListener('DOMContentLoaded', function() {
        addAllButtons();
        initializePeriodicCheck(); // Inicia a checagem periódica após o DOM estar pronto
    });

    // 2. Para lidar com o botão de voltar/avançar do navegador (popstate)
    // Este evento pode indicar uma "nova" página no histórico, então tentamos adicionar.
    window.addEventListener('popstate', function() {
        console.log('Popstate event. Checking for buttons.');
        periodicCheckAndAdd(); // Usa a função de verificação para revalidar
    });

    // 3. Monitoramento de URL e reinício do setInterval se necessário
    // Esta é uma "rede de segurança" para garantir que o setInterval esteja sempre ativo
    // e que a lastUrl esteja correta em caso de navegações complexas.
    let initialUrl = window.location.href;
    new MutationObserver(function(mutations) {
        if (window.location.href !== initialUrl) {
            initialUrl = window.location.href;
            console.log('URL changed via MutationObserver, re-initializing periodic check.');
            initializePeriodicCheck(); // Reinicia o intervalo para garantir consistência
            addAllButtons(); // Força a adição imediata também
        }
    }).observe(document, { childList: true, subtree: true, attributes: true });


    // Caso o script seja executado antes do DOMContentLoaded (modo "document-start" do Tampermonkey)
    // E o body já esteja presente, tenta adicionar os botões imediatamente.
    if (document.body) {
        addAllButtons();
        initializePeriodicCheck();
    }

})();