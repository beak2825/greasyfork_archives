// ==UserScript==
// @name         YouTube Restriction Bypass (Advanced Config)
// @namespace    https://greasyfork.org/en/users/305931-emerson-bardusco
// @version      3.0
// @description  Bypass restrições do YouTube com painel de configuração no Tampermonkey
// @author       EmersonxD (modificado)
// @match        *://*.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529235/YouTube%20Restriction%20Bypass%20%28Advanced%20Config%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529235/YouTube%20Restriction%20Bypass%20%28Advanced%20Config%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configurações salvas no Tampermonkey
    var config = {
        proxyHost: GM_getValue('proxyHost', 'https://youtube-proxy.zerody.one'),
        debug: GM_getValue('debug', true),
        validStatuses: ['OK', 'LIVE_STREAM_OFFLINE'],
        unlockableStatuses: ['AGE_VERIFICATION_REQUIRED', 'CONTENT_CHECK_REQUIRED']
    };

    // Função de log
    function log() {
        if (config.debug) {
            var args = Array.prototype.slice.call(arguments);
            console.log('[Bypass] ' + args.join(' '));
        }
    }

    // Menus do Tampermonkey
    GM_registerMenuCommand("Trocar Proxy", () => {
        var novoProxy = prompt("Digite o novo endereço do proxy:", config.proxyHost);
        if (novoProxy) {
            GM_setValue('proxyHost', novoProxy);
            alert("Proxy atualizado para: " + novoProxy + "\nRecarregue o YouTube para aplicar.");
        }
    });

    GM_registerMenuCommand("Ativar/Desativar Logs", () => {
        var novoEstado = !config.debug;
        GM_setValue('debug', novoEstado);
        alert("Logs agora estão " + (novoEstado ? "ATIVADOS" : "DESATIVADOS") + ". Recarregue o YouTube.");
    });

    GM_registerMenuCommand("Resetar Configurações", () => {
        GM_setValue('proxyHost', 'https://youtube-proxy.zerody.one');
        GM_setValue('debug', true);
        alert("Configurações resetadas. Recarregue o YouTube.");
    });

    // Funções principais
    var nativeXHR = XMLHttpRequest.prototype.open;
    var nativeJSON = JSON.parse;

    function isGoogleVideo(url) {
        return url.host.includes('.googlevideo.com');
    }

    function needsProxy(url) {
        return url.search.includes('gcr=');
    }

    function buildProxyUrl(url) {
        return config.proxyHost + '/direct/' + btoa(url.href);
    }

    function modifyRequest(url) {
        if (!isGoogleVideo(url)) return url.href;
        if (!needsProxy(url)) return url.href;
        try {
            return buildProxyUrl(url);
        } catch(e) {
            log('Erro ao modificar requisição:', e.message);
            return url.href;
        }
    }

    function unlockPlayer(data) {
        var status = data.playabilityStatus;
        if (status && config.unlockableStatuses.includes(status.status)) {
            status.status = 'OK';
            status.reason = '';
            log('Player desbloqueado');
        }
        return data;
    }

    function unlockResponse(data) {
        var content = data.contents;
        if (content?.twoColumnWatchNextResults?.secondaryResults) {
            content.twoColumnWatchNextResults.secondaryResults = {
                secondaryResults: { results: [] }
            };
            log('Sidebar limpa');
        }
        return data;
    }

    function processJSON(data) {
        try {
            return unlockResponse(unlockPlayer(data));
        } catch(e) {
            log('Erro ao processar JSON:', e.message);
            return data;
        }
    }

    // Intercepta requisições
    XMLHttpRequest.prototype.open = function(method, url) {
        try {
            var newUrl = modifyRequest(new URL(url));
            var args = [method, newUrl || url].concat(Array.prototype.slice.call(arguments, 2));
            nativeXHR.apply(this, args);
        } catch(e) {
            log('Erro interceptando requisição:', e.message);
            nativeXHR.apply(this, arguments);
        }
    };

    // Intercepta respostas JSON
    JSON.parse = function(text) {
        try {
            return processJSON(nativeJSON.call(this, text));
        } catch(e) {
            log('Erro no parse JSON:', e.message);
            return nativeJSON.call(this, text);
        }
    };

    log('Script inicializado com proxy: ' + config.proxyHost);
})();