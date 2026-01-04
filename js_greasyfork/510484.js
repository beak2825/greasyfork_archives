// ==UserScript==
// @name         [WORKING] Unlock any Medium Article
// @namespace    https://github.com/insign/userscripts
// @version      202409271723
// @description  Unlock any paid article from Medium by using Freedium, works with custom domains too
// @author       Hélio <open@helio.me>
// @match        *://*/*
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/510484/%5BWORKING%5D%20Unlock%20any%20Medium%20Article.user.js
// @updateURL https://update.greasyfork.org/scripts/510484/%5BWORKING%5D%20Unlock%20any%20Medium%20Article.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Função para verificar a presença da metatag específica
	function isMediumArticle() {
		return document.querySelector('meta[data-rh="true"][property="al:ios:app_name"][content="Medium"]') !== null;
	}

	// Função para realizar o redirecionamento
	function redirectToFreedium() {
		// Obtém a URL atual
		var currentURL = window.location.href;

		// Verifica se já não está na URL do Freedium para evitar loop
		if (!currentURL.startsWith('https://freedium.cfd/')) {
			// Cria a nova URL redirecionada
			var freediumURL = 'https://freedium.cfd/' + currentURL;

			// Redireciona para a nova URL
			window.location.replace(freediumURL);
		}
	}

	// Função principal que controla o fluxo
	function main() {
		// Verifica se a página é um artigo do Medium
		if (isMediumArticle()) {
			// Obtém o referenciador (a página anterior que o usuário veio)
			var referrer = document.referrer;

			var shouldRedirect = true;

			if (referrer) {
				try {
					// Analisa a URL do referenciador para obter o hostname
					var referrerHost = (new URL(referrer)).hostname;

					// Verifica se o referenciador é freedium.cfd
					if (referrerHost === 'freedium.cfd') {
						shouldRedirect = false; // Não redireciona se veio do Freedium
					}
				} catch (e) {
					// Se não for possível analisar o referenciador, continua com o redirecionamento
					console.error('Erro ao analisar o referenciador:', e);
				}
			}

			if (shouldRedirect) {
				redirectToFreedium();
			}
		}
	}

	// Executa a função principal quando o conteúdo do documento estiver carregado
	if (document.readyState === 'complete' || document.readyState === 'interactive') {
		setTimeout(main, 1);
	} else {
		document.addEventListener('DOMContentLoaded', main);
	}
})();
