// ==UserScript==
// @name         Xxandy Busca de Vídeos Personalizada + Atalhos + Duração (Corrigido)
// @namespace    https://github.com/
// @license      MIT
// @version      1.3
// @description  Agora a busca usa OR para funcionar corretamente no Google!
// @author       ChatGPT
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/543147/Xxandy%20Busca%20de%20V%C3%ADdeos%20Personalizada%20%2B%20Atalhos%20%2B%20Dura%C3%A7%C3%A3o%20%28Corrigido%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543147/Xxandy%20Busca%20de%20V%C3%ADdeos%20Personalizada%20%2B%20Atalhos%20%2B%20Dura%C3%A7%C3%A3o%20%28Corrigido%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para escolher duração do vídeo
    function escolherDuracao() {
        let duracao = prompt("Selecione a duração do vídeo:\n1️⃣ Curto (menos de 4 min)\n2️⃣ Médio (4 a 20 min)\n3️⃣ Longo (mais de 20 min)\n4️⃣ Sem filtro");
        switch (duracao) {
            case "1": return "tbs=dur:s"; // Curto
            case "2": return "tbs=dur:m"; // Médio
            case "3": return "tbs=dur:l"; // Longo
            default: return ""; // Sem filtro
        }
    }

    // 🔹 Busca normal de vídeos
    function searchVideos(query) {
        let filtroDuracao = escolherDuracao();
        let googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}+-youtube+-facebook+-tiktok+-twitter+-kwai+-instagram+-globo+-music.apple&hl=pt-BR&tbm=vid&${filtroDuracao}`;
        GM_openInTab(googleSearchUrl, { active: true });
    }

    // 🔞 Busca de vídeos adultos (com correção)
    function searchAdultVideos(query) {
        let filtroDuracao = escolherDuracao();
        let googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}+porn+adult+sexo+(site:redtube.com OR site:xvideos.com OR site:brazzers.com OR site:xhamster.com OR site:spankbang.com  OR site:pornhub.com  OR site:camwhores.tv OR site:noodlemagazine.com OR site:xnxx.com OR site:vk.com OR site:4shared.com)&hl=pt-BR&tbm=vid&${filtroDuracao}`;
        GM_openInTab(googleSearchUrl, { active: true });
    }

    // 🔍 Opção no menu de contexto para busca normal
    GM_registerMenuCommand("🔍 Buscar Vídeos", function() {
        let query = prompt("Digite o que deseja buscar:");
        if (query) searchVideos(query);
    });

    // 🔞 Opção no menu de contexto para busca adulta
    GM_registerMenuCommand("🔥 Buscar Vídeos Adultos", function() {
        let query = prompt("Digite o que deseja buscar (🔞):");
        if (query) searchAdultVideos(query);
    });

    // 🎮 Atalhos de teclado para ativar as buscas rapidamente
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.key === 'V') { // CTRL + SHIFT + V = Buscar vídeos normais
            let query = prompt("🔍 Buscar Vídeos:");
            if (query) searchVideos(query);
        } else if (event.ctrlKey && event.shiftKey && event.key === 'b') { // CTRL + SHIFT + B = Buscar vídeos adultos
            let query = prompt("🔥 Buscar Vídeos xxx:");
            if (query) searchAdultVideos(query);
        }
    });

})();
