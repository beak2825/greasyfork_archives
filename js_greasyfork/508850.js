// ==UserScript==
// @name         Remove URL trackers
// @namespace    https://github.com/insign/userscripts
// @version      202409181423
// @description  Removes annoying url trackers parameters like utm_*, ref, etc, directly from the address bar.
// @match        *://*/*
// @author       Hélio <open@helio.me>
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/508850/Remove%20URL%20trackers.user.js
// @updateURL https://update.greasyfork.org/scripts/508850/Remove%20URL%20trackers.meta.js
// ==/UserScript==

(function() {
	'use strict'
	// Parâmetros (que começam com esses prefixos) a serem removidos da URL.
	const paramsToStrip = ['utm_', 'ref', 'gclid', 'gclsrc', 'gs_', 'ga_', '_ga', '_gaq', '__utm', 'fbclid', 'mc_', '_cid', 'epik', 'context']

	/**
	 * Verifica se um parâmetro deve ser removido da URL.
	 * @param {string} param - O nome do parâmetro (formato chave=valor).
	 * @returns {boolean} - True se o parâmetro deve ser preservado, false caso contrário.
	 */
	function shouldPreserveParam(param) {
		// Retorna true se NENHUM prefixo da lista paramsToStrip for encontrado no início do parâmetro.
		return !paramsToStrip.some(prefix => param.startsWith(prefix))
	}

	/**
	 * Limpa a URL removendo os parâmetros especificados.
	 * @param {string} url - A URL original.
	 * @returns {string} - A URL limpa com os parâmetros indesejados removidos.
	 */
	function cleanUrl(url) {
		// Usa replace com regex para encontrar a parte da query string (?...)
		// A função de callback processa os parâmetros encontrados.
		return url.replace(/\?([^#]*)/, (match, searchParams) => {
			// Divide os parâmetros (&), filtra mantendo apenas os que devem ser preservados,
			// e junta novamente com &.
			const updatedParams = searchParams
					.split('&')
					.filter(shouldPreserveParam) // Mantém apenas os parâmetros não correspondentes.
					.join('&')

			// Retorna a query string atualizada (se houver parâmetros restantes) ou uma string vazia
			// para remover completamente a interrogação se todos os parâmetros foram removidos.
			return updatedParams ? '?' + updatedParams : ''
		})
	}

	/**
	 * Atualiza a URL do navegador substituindo o estado do histórico, se necessário.
	 * Isso evita que a URL original com rastreadores permaneça no histórico de navegação.
	 */
	function updateUrl() {
		const currentUrl = location.href // URL atual
		const cleanedUrl = cleanUrl(currentUrl) // URL após limpeza

		// Se a URL foi modificada e a API history.replaceState está disponível,
		// substitui a entrada atual no histórico pela URL limpa.
		if (currentUrl !== cleanedUrl && window.history.replaceState) {
			window.history.replaceState({}, '', cleanedUrl)
			console.log('URL Trackers Removed:', currentUrl, '->', cleanedUrl)
		}
	}

	// Executa a limpeza apenas se a URL contiver parâmetros de busca (presença de ? ou &).
	// Isso evita processamento desnecessário em URLs sem parâmetros.
	if (location.search && /[\?&]/.test(location.search)) {
		updateUrl()
	}
})()
