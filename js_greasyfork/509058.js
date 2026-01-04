// ==UserScript==
// @name         Easy Copy URL without Trackers
// @namespace    https://github.com/insign/userscripts
// @version      202409181420
// @description  Removes annoying url trackers parameters and copies the cleaned URL to the clipboard when using Alt+C (or Option+C on Mac).
// @match        *://*/*
// @author       Hélio <open@helio.me>
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/509058/Easy%20Copy%20URL%20without%20Trackers.user.js
// @updateURL https://update.greasyfork.org/scripts/509058/Easy%20Copy%20URL%20without%20Trackers.meta.js
// ==/UserScript==

(function() {
	'use strict'

	// Lista de prefixos de parâmetros a serem removidos da URL.
	const paramsToStrip = ['utm_', 'ref', 'gclid', 'gclsrc', 'gs_', 'ga_', '_ga', '_gaq', '__utm', 'fbclid', 'mc_', '_cid', 'epik', 'context']

	/**
	 * Verifica se um parâmetro (formato 'chave=valor') deve ser mantido na URL.
	 * @param {string} param - O parâmetro a ser verificado.
	 * @returns {boolean} - Retorna true se o parâmetro NÃO começa com nenhum dos prefixos em `paramsToStrip`.
	 */
	function shouldPreserveParam(param) {
		return !paramsToStrip.some(prefix => param.startsWith(prefix))
	}

	/**
	 * Remove os parâmetros de rastreamento de uma URL.
	 * @param {string} url - A URL original.
	 * @returns {string} - A URL limpa, sem os parâmetros de rastreamento.
	 */
	function cleanUrl(url) {
		// Procura pela query string (parte após '?') e a processa.
		return url.replace(/\?([^#]*)/, (match, searchParams) => {
			// Divide os parâmetros, filtra mantendo apenas os que devem ser preservados, e junta novamente.
			const updatedParams = searchParams
					.split('&')
					.filter(shouldPreserveParam)
					.join('&')
			// Retorna a query string limpa ou uma string vazia se não houver parâmetros restantes.
			return updatedParams ? '?' + updatedParams : ''
		})
	}

	/**
	 * Copia o texto fornecido para a área de transferência.
	 * Cria um input temporário, define seu valor, seleciona e executa o comando de cópia.
	 * @param {string} text - O texto a ser copiado.
	 */
	function copyToClipboard(text) {
		// Cria um elemento input temporário
		const tempInput = document.createElement('input')
		tempInput.value = text // Define o valor como a URL limpa
		document.body.appendChild(tempInput) // Adiciona ao corpo do documento
		tempInput.select() // Seleciona o conteúdo do input
		document.execCommand('copy') // Executa o comando de cópia do navegador
		document.body.removeChild(tempInput) // Remove o input temporário
	}

	/**
	 * Exibe uma notificação deslizante no topo da página.
	 * Útil para dar feedback visual ao usuário após a cópia.
	 * @param {string} message - A mensagem a ser exibida na notificação.
	 */
	function showNotification(message) {
		// Cria o elemento da notificação
		const notification = document.createElement('div')
		notification.textContent = message // Define o texto da mensagem

		// Estilização da notificação (posição fixa no topo, aparência, etc.)
		notification.style.position = 'fixed'
		notification.style.top = '0'
		notification.style.right = '10px'
		notification.style.backgroundColor = 'black'
		notification.style.color = 'white'
		notification.style.padding = '10px'
		notification.style.border = '3px solid white'
		notification.style.borderTopWidth = '0'
		notification.style.borderRadius = '0 0 5px 5px'
		notification.style.zIndex = '2147483647' // Garante que fique sobre a maioria dos elementos
		notification.style.transform = 'translateY(-100%)' // Começa escondida acima da tela
		notification.style.transition = 'transform 0.5s ease' // Efeito de transição suave

		// Adiciona a notificação ao corpo do documento
		document.body.appendChild(notification)

		// Animação: deslizar para baixo (tornar visível)
		setTimeout(() => {
			notification.style.transform = 'translateY(0)'
		}, 100) // Pequeno atraso para garantir que a transição funcione

		// Animação: deslizar para cima e remover após um tempo
		setTimeout(() => {
			notification.style.transform = 'translateY(-100%)' // Desliza de volta para cima
			// Remove o elemento do DOM após a animação de subida terminar
			setTimeout(() => {
				if (document.body.contains(notification)) { // Verifica se ainda existe antes de remover
					document.body.removeChild(notification)
				}
			}, 500) // Tempo da transição de subida
		}, 1500) // Tempo que a notificação permanece visível
	}

	// Adiciona um listener para o evento de pressionar tecla.
	window.addEventListener('keydown', function(event) {
		// Verifica se a tecla Alt (ou Option no Mac) e a tecla 'C' foram pressionadas juntas.
		if (event.altKey && event.code === 'KeyC') {
			event.preventDefault() // Impede qualquer ação padrão do navegador para Alt+C

			const currentUrl = location.href // Pega a URL atual
			const cleanedUrl = cleanUrl(currentUrl) // Limpa a URL

			copyToClipboard(cleanedUrl) // Copia a URL limpa

			// Exibe uma notificação diferente dependendo se a URL foi realmente modificada.
			if (currentUrl !== cleanedUrl) {
				showNotification('Copied without trackers!')
			} else {
				showNotification('Copied!')
			}
		}
	})
})()
