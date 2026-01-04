// ==UserScript==
// @name         Kenite IA 🚀✨
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Kenite AI: A Cutting-Edge Virtual Assistant 🤖 ✨
// @match        https://*.wikipedia.org/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/498912/Kenite%20IA%20%F0%9F%9A%80%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/498912/Kenite%20IA%20%F0%9F%9A%80%E2%9C%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 🎨 Estilos CSS
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

        @keyframes backgroundColorChange {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        @keyframes entradaSuave {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes loaderDot {
            0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
            40% { transform: translateY(-10px); opacity: 1; }
        }

        @keyframes sparkle {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.8; }
            100% { transform: scale(1); opacity: 1; }
        }

        #ia-assistente {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 420px;
            border-radius: 30px;
            font-family: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            z-index: 9999;
            overflow: hidden;
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
            border: 3px solid rgba(255, 255, 255, 0.8);
            animation: entradaSuave 1s ease-out;
        }

        #ia-assistente.tema-padrao {
            background: linear-gradient(135deg, #4a3080, #7b3d91, #9d50bb, #6e48aa);
            background-size: 300% 300%;
            animation: entradaSuave 1s ease-out, backgroundColorChange 15s ease infinite;
        }

        #ia-assistente.tema-escuro {
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460, #1a1a2e);
            background-size: 300% 300%;
            animation: entradaSuave 1s ease-out, backgroundColorChange 15s ease infinite;
        }

        #ia-assistente.tema-claro {
            background: linear-gradient(135deg, #f0f0f5, #e6e6fa, #d8bfd8, #f0f0f5);
            background-size: 300% 300%;
            animation: entradaSuave 1s ease-out, backgroundColorChange 15s ease infinite;
            color: #333;
        }

        #ia-cabecalho {
            background-color: rgba(0,0,0,0.2);
            color: #ffffff;
            padding: 20px 25px;
            font-size: 26px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid rgba(255,255,255,0.1);
        }

        #ia-toggle {
            cursor: pointer;
            font-size: 30px;
            transition: transform 0.4s ease;
        }

        #ia-toggle.fechado { transform: rotate(180deg); }

        #ia-conteudo {
            padding: 25px;
            max-height: 550px;
            overflow-y: auto;
            color: #ffffff;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        #ia-conteudo::-webkit-scrollbar {
            display: none;
        }

        #ia-input {
            width: 340px;
            padding: 15px;
            margin-bottom: 20px;
            border: none;
            border-radius: 15px;
            background-color: rgba(255,255,255,0.15);
            color: #ffffff;
            font-size: 18px;
            transition: all 0.3s ease;
        }

        #ia-input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255,255,255,0.3);
            background-color: rgba(255,255,255,0.2);
        }

        #ia-input::placeholder {
            color: rgba(255,255,255,0.5);
        }

        #ia-resposta {
            background-color: rgba(255,255,255,0.1);
            padding: 20px;
            border-radius: 20px;
            margin-top: 20px;
            font-size: 17px;
            line-height: 1.7;
            transition: all 0.3s ease;
            text-shadow: 0 1px 2px rgba(0,0,0,0.1);
            font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            letter-spacing: 0.3px;
        }

        #ia-resposta p {
            margin-bottom: 15px;
        }

        #ia-resposta strong {
            font-weight: 600;
            color: #ffd700;
        }

        #ia-resposta em {
            font-style: italic;
            color: #add8e6;
        }

        #ia-resposta ul, #ia-resposta ol {
            margin-left: 20px;
            margin-bottom: 15px;
        }

        #ia-resposta li {
            margin-bottom: 5px;
        }

        #ia-resposta a {
            color: #ff69b4;
            text-decoration: none;
            border-bottom: 1px dotted #ff69b4;
            transition: all 0.3s ease;
        }

        #ia-resposta a:hover {
            color: #ff1493;
            border-bottom: 1px solid #ff1493;
        }

        #ia-loader {
            display: none;
            text-align: center;
            padding: 20px;
            height: 40px;
        }

        #ia-loader span {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.9);
            margin: 0 5px;
            animation: loaderDot 1.4s infinite ease-in-out both;
        }

        #ia-loader span:nth-child(1) { animation-delay: -0.32s; }
        #ia-loader span:nth-child(2) { animation-delay: -0.16s; }

        .titulo-resposta {
            font-size: 26px;
            font-weight: bold;
            color: #ffffff;
            margin-bottom: 20px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: 0.5px;
        }

        .destaque {
            background-color: rgba(255,255,255,0.2);
            padding: 2px 6px;
            border-radius: 6px;
            font-weight: 500;
            color: #fff;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }

        .topicos-relacionados {
            margin-top: 25px;
            padding: 15px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 20px;
            transition: all 0.3s ease;
            box-shadow: inset 0 0 10px rgba(255,255,255,0.1);
        }

        .topico-item {
            display: inline-block;
            margin: 6px;
            padding: 8px 15px;
            background-color: rgba(255,255,255,0.15);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .topico-item:hover {
            background-color: rgba(255,255,255,0.25);
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        #ia-botoes {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
        }

        #ia-idioma-select, #ia-tema-select, .ia-botao {
            margin-top: 10px;
            padding: 7px;
            margin-right: 5px;
            border-radius: 10px;
            background-color: rgba(255,255,255,0.15);
            color: #ffffff;
            border: none;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #ia-idioma-select option, #ia-tema-select option {
            background-color: #4a3080;
            color: #ffffff;
        }

        .ia-botao:hover, #ia-idioma-select:hover, #ia-tema-select:hover {
            background-color: rgba(255,255,255,0.25);
        }

        #ia-historico {
            margin-top: 20px;
            padding: 15px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 20px;
            max-height: 150px;
            overflow-y: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }

        #ia-historico::-webkit-scrollbar {
            display: none;
        }

        .historico-item {
            padding: 8px 12px;
            margin: 8px 0;
            background-color: rgba(255,255,255,0.15);
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        .historico-item:hover {
            background-color: rgba(255,255,255,0.25);
            transform: translateX(5px);
        }

        .emoji-title {
            font-size: 19px;
            margin-bottom: 15px;
            text-align: center;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .emoji-separator {
            font-size: 20px;
            text-align: center;
            margin: 10px 0;
        }

        .fancy-text {
            font-family: 'Georgia', serif;
            line-height: 1.8;
            letter-spacing: 0.5px;
        }

        .highlight-box {
            background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.2));
            border-radius: 15px;
            padding: 15px;
            margin: 15px 0;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .fancy-list {
            list-style-type: none;
            padding-left: 0;
        }

        .fancy-list li {
            margin-bottom: 10px;
            padding-left: 25px;
            position: relative;
        }

        .fancy-list li::before {
            content: '🔹';
            position: absolute;
            left: 0;
            top: 2px;
        }

        .sparkle {
            display: inline-block;
            animation: sparkle 1.5s infinite;
        }

        #ia-assistente.tema-claro #ia-cabecalho,
        #ia-assistente.tema-claro #ia-input,
        #ia-assistente.tema-claro #ia-resposta,
        #ia-assistente.tema-claro #ia-idioma-select,
        #ia-assistente.tema-claro #ia-tema-select,
        #ia-assistente.tema-claro .ia-botao,
        #ia-assistente.tema-claro .historico-item {
            color: #333;
            background-color: rgba(0,0,0,0.1);
        }

        #ia-assistente.tema-claro #ia-input::placeholder {
            color: rgba(0,0,0,0.5);
        }

        #ia-assistente.tema-claro #ia-resposta {
            color: #333;
            text-shadow: none;
        }

        #ia-assistente.tema-claro #ia-resposta strong {
            color: #0066cc;
        }

        #ia-assistente.tema-claro #ia-resposta em {
            color: #006400;
        }

        #ia-assistente.tema-claro #ia-resposta a {
            color: #8b008b;
            border-bottom: 1px dotted #8b008b;
        }

        #ia-assistente.tema-claro #ia-resposta a:hover {
            color: #4b0082;
            border-bottom: 1px solid #4b0082;
        }

        #ia-assistente.tema-claro .titulo-resposta {
            color: #333;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }

        #ia-assistente.tema-claro .destaque {
            background-color: rgba(0,0,0,0.1);
            color: #333;
            text-shadow: none;
        }

        .citacao {
            font-style: italic;
            color: #ffa07a;
            display: block;
            margin: 10px 0;
            padding-left: 15px;
            border-left: 3px solid #ffa07a;
        }

        .nota {
            background-color: rgba(255,255,0,0.2);
            padding: 10px;
            border-radius: 10px;
            margin: 10;
                    }

        .definicao {
            font-weight: bold;
            text-decoration: underline;
        }

        .palavra-chave {
            font-weight: bold;
            color: #ff69b4;
            text-shadow: 0 0 3px rgba(255,105,180,0.5);
        }
    `);

    // 🏗️ Criar e adicionar o assistente ao DOM
    const assistente = document.createElement('div');
    assistente.id = 'ia-assistente';
    assistente.innerHTML = `
        <div id="ia-cabecalho">
            <span id="ia-titulo">🤖 Kenite IA</span>
            <span id="ia-toggle">▼</span>
        </div>
        <div id="ia-conteudo">
            <input type="text" id="ia-input" placeholder="🔍 Faça uma pergunta...">
            <div id="ia-resposta"></div>
            <div id="ia-loader"><span></span><span></span><span></span></div>
            <div id="ia-botoes">
                <select id="ia-idioma-select">
                    <option value="pt">🇧🇷 Português</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="es">🇪🇸 Español</option>
                    <option value="fr">🇫🇷 Français</option>
                </select>
                <select id="ia-tema-select">
                    <option value="padrao">🌈 Tema Padrão</option>
                    <option value="escuro">🌙 Tema Escuro</option>
                    <option value="claro">☀️ Tema Claro</option>
                </select>
                <button id="ia-limpar-historico" class="ia-botao">🗑️ Limpar Histórico</button>
            </div>
            <div id="ia-historico"></div>
        </div>
    `;
    document.body.appendChild(assistente);

    // 🎛️ Elementos do DOM
    const toggle = document.getElementById('ia-toggle');
    const conteudo = document.getElementById('ia-conteudo');
    const input = document.getElementById('ia-input');
    const resposta = document.getElementById('ia-resposta');
    const loader = document.getElementById('ia-loader');
    const titulo = document.getElementById('ia-titulo');
    const idiomaSelect = document.getElementById('ia-idioma-select');
    const temaSelect = document.getElementById('ia-tema-select');
    const limparHistoricoBtn = document.getElementById('ia-limpar-historico');
    const historicoDiv = document.getElementById('ia-historico');

    // 🌐 Variáveis globais
    let idiomaAtual = GM_getValue('idiomaAssistente', 'pt');
    let temaAtual = GM_getValue('temaAssistente', 'padrao');
    let historico = GM_getValue('historicoAssistente', []);
    idiomaSelect.value = idiomaAtual;
    temaSelect.value = temaAtual;

    // 🗣️ Traduções
    const traducoes = {
        pt: {
            assistenteIA: '🤖 Kenite IA',
            placeholder: '🔍 Faça uma pergunta...',
            topicosRelacionados: '🔗 Tópicos Relacionados',
            semInformacoes: '❓ Desculpe, não encontrei informações sobre isso.',
            erro: '❌ Desculpe, ocorreu um erro ao buscar a informação.',
            limparHistorico: '🗑️ Limpar Histórico',
            historico: '📜 Histórico'
        },
        en: {
            assistenteIA: '🤖 Kenite AI',
            placeholder: '🔍 Ask a question...',
            topicosRelacionados: '🔗 Related Topics',
            semInformacoes: '❓ Sorry, I couldn\'t find any information about that.',
            erro: '❌ Sorry, an error occurred while fetching the information.',
            limparHistorico: '🗑️ Clear History',
            historico: '📜 History'
        },
        es: {
            assistenteIA: '🤖 Kenite IA',
            placeholder: '🔍 Haz una pregunta...',
            topicosRelacionados: '🔗 Temas Relacionados',
            semInformacoes: '❓ Lo siento, no encontré información sobre eso.',
            erro: '❌ Lo siento, ocurrió un error al buscar la información.',
            limparHistorico: '🗑️ Borrar Historial',
            historico: '📜 Historial'
        },
        fr: {
            assistenteIA: '🤖 Kenite IA',
            placeholder: '🔍 Posez une question...',
            topicosRelacionados: '🔗 Sujets Connexes',
            semInformacoes: '❓ Désolé, je n\'ai pas trouvé d\'informations à ce sujet.',
            erro: '❌ Désolé, une erreur s\'est produite lors de la recherche d\'informations.',
            limparHistorico: '🗑️ Effacer l\'historique',
            historico: '📜 Historique'
        }
    };

    // 🔄 Função para traduzir
    function traduzir(chave) {
        return traducoes[idiomaAtual][chave] || traducoes['en'][chave];
    }

    // 🔍 Função para pesquisar na Wikipedia
    async function pesquisarWikipedia(query) {
        loader.style.display = 'block';
        resposta.innerHTML = '';

        try {
            const url = `https://${idiomaAtual}.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|links&exintro=1&explaintext=1&titles=${encodeURIComponent(query)}&origin=*`;
            const response = await fetch(url);
            const data = await response.json();

            const page = Object.values(data.query.pages)[0];
            const extract = page.extract;
            const links = page.links || [];

            const respostaProcessada = processarResposta(extract, links);
            exibirRespostaAnimada(respostaProcessada);
            adicionarAoHistorico(query);
        } catch (error) {
            resposta.innerHTML = `<div class="erro-mensagem">${traduzir('erro')} ❌</div>`;
        } finally {
            loader.style.display = 'none';
        }
    }

    // 🧠 Função para processar a resposta
    function processarResposta(texto, links) {
        let respostaProcessada = '';

        if (texto) {
            respostaProcessada += `<div class="titulo-resposta">${traduzir('assistenteIA')}:</div>`;
            respostaProcessada += `<div class="resposta-conteudo">${aprimorarTextoIA(texto)}</div>`;
        } else {
            respostaProcessada += `<div class="sem-info">${traduzir('semInformacoes')}</div>`;
        }

        if (links.length > 0) {
            respostaProcessada += `<div class="topicos-relacionados"><strong>${traduzir('topicosRelacionados')}:</strong><br>`;
            respostaProcessada += links.slice(0, 5).map(link => `<span class="topico-item">🔹 ${link.title}</span>`).join('');
            respostaProcessada += '</div>';
        }

        return respostaProcessada;
    }

    // 🖌️ Função para aprimorar o texto da IA
    function aprimorarTextoIA(texto) {
        const emojis = {
            positivo: ['😊', '👍', '🎉', '✨', '🌟', '💖', '🙌', '🔥'],
            negativo: ['😔', '👎', '💔', '🚫', '⚠️', '😢', '🙅', '❌'],
            ideia: ['💡', '🤔', '🧠', '🔍', '📚', '🎓', '🏆', '🚀'],
            tempo: ['⏰', '🕒', '📅', '⌛', '🗓️', '🌙', '☀️', '🌈'],
            dinheiro: ['💰', '💸', '💲', '🤑', '💳', '💵', '🏦', '💹'],
            tecnologia: ['💻', '📱', '🤖', '🔧', '🖥️', '📡', '🛰️', '⚙️'],
            natureza: ['🌿', '🌳', '🌺', '🌊', '🏔️', '🌎', '🌞', '🍃'],
            comida: ['🍎', '🍕', '🍣', '🍔', '🍰', '🍓', '🥑', '🍜'],
            viagem: ['✈️', '🏖️', '🗺️', '🏞️', '🚆', '🚢', '🏰', '🎒'],
            esporte: ['⚽', '🏀', '🎾', '🏊', '🚴', '🏋️', '🥇', '🏆']
        };

        // Adicionar emojis
        Object.keys(emojis).forEach(categoria => {
            const regex = new RegExp(`\\b(${categoria}|${categoria}s)\\b`, 'gi');
            texto = texto.replace(regex, match => {
                const emojiAleatorio = emojis[categoria][Math.floor(Math.random() * emojis[categoria].length)];
                return `${emojiAleatorio} ${match}`;
            });
        });

        // Adicionar formatação avançada
        texto = texto.replace(/\b(importante|atenção|dica|nota)\b/gi, match => `<strong class="destaque sparkle">💥 ${match.toUpperCase()} 💥</strong>`);
        texto = texto.replace(/(".*?")/g, match => `<span class="citacao">💬 ${match} 💬</span>`);
        texto = texto.replace(/\b([A-Z][a-z]+ é|são|foram|era|eram)\b/g, match => `<span class="definicao">📌 ${match}</span>`);

        // Adicionar títulos e separadores com emojis
        texto = texto.replace(/^(.+)$/m, match => `<div class="emoji-title">🌟 ${match} 🌟</div>`);
        texto = texto.replace(/\n\n/g, '\n<div class="emoji-separator">✨✨✨</div>\n');

        // Criar listas fancy
        texto = texto.replace(/^[-*]\s(.+)$/gm, '<li>$1</li>');
        texto = texto.replace(/<li>(.+\n?)+/g, match => `<ul class="fancy-list">${match}</ul>`);

        // Adicionar caixas de destaque
        texto = texto.replace(/\[(.*?)\]/g, '<div class="highlight-box">$1</div>');

        // Destacar palavras-chave
        const palavrasChave = ['importante', 'crucial', 'essencial', 'fundamental', 'chave', 'principal'];
        const regexPalavrasChave = new RegExp(`\\b(${palavrasChave.join('|')})\\b`, 'gi');
        texto = texto.replace(regexPalavrasChave, match => `<span class="palavra-chave">🔑 ${match}</span>`);

        // Adicionar classe para texto fancy
        texto = `<div class="fancy-text">${texto}</div>`;

        return texto;
    }

    // 🎭 Função para exibir a resposta com animação
    function exibirRespostaAnimada(texto) {
        resposta.innerHTML = texto;
        resposta.style.display = 'block';
        resposta.style.opacity = '0';
        resposta.style.transform = 'translateY(20px)';
        setTimeout(() => {
            resposta.style.opacity = '1';
            resposta.style.transform = 'translateY(0)';
        }, 50);
        resposta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // 📜 Função para adicionar ao histórico
    function adicionarAoHistorico(query) {
        historico = historico.filter(item => item !== query);
        historico.unshift(query);
        if (historico.length > 10) historico.pop();
        GM_setValue('historicoAssistente', historico);
        atualizarHistorico();
    }

    // 🔄 Função para atualizar o histórico na interface
    function atualizarHistorico() {
        historicoDiv.innerHTML = `<div class="emoji-title"> ${traduzir('historico')}</div>`;
        historico.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'historico-item';
            itemElement.innerHTML = `🔍 ${item}`;
            itemElement.onclick = () => {
                input.value = item;
                pesquisarWikipedia(item);
            };
            historicoDiv.appendChild(itemElement);
        });
    }

    // 🎨 Função para mudar o tema
    function mudarTema(tema) {
        const assistente = document.getElementById('ia-assistente');
        assistente.className = ''; // Remove todas as classes
        assistente.classList.add(`tema-${tema}`);
        GM_setValue('temaAssistente', tema);
    }

    // 🎧 Event listeners
    toggle.addEventListener('click', () => {
        conteudo.style.display = conteudo.style.display === 'none' ? 'block' : 'none';
        toggle.textContent = conteudo.style.display === 'none' ? '▼' : '▲';
        toggle.classList.toggle('fechado');
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            pesquisarWikipedia(input.value);
        }
    });

    resposta.addEventListener('click', (e) => {
        if (e.target.classList.contains('topico-item')) {
            input.value = e.target.textContent.replace('🔹 ', '');
            pesquisarWikipedia(input.value);
        }
    });

    idiomaSelect.addEventListener('change', (e) => {
        idiomaAtual = e.target.value;
        GM_setValue('idiomaAssistente', idiomaAtual);
               titulo.textContent = traduzir('assistenteIA');
        input.placeholder = traduzir('placeholder');
        limparHistoricoBtn.textContent = traduzir('limparHistorico');
        atualizarHistorico();
        if (resposta.innerHTML) {
            pesquisarWikipedia(input.value);
        }
    });

    temaSelect.addEventListener('change', (e) => {
        mudarTema(e.target.value);
    });

    limparHistoricoBtn.addEventListener('click', () => {
        historico = [];
        GM_setValue('historicoAssistente', historico);
        atualizarHistorico();
    });

    // 🚀 Inicialização
    mudarTema(temaAtual);
    atualizarHistorico();
    titulo.textContent = traduzir('assistenteIA');
    input.placeholder = traduzir('placeholder');
    limparHistoricoBtn.textContent = traduzir('limparHistorico');
})();