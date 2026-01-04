// ==UserScript==
// @name         Better LMArena (lmsys) Chat
// @namespace    https://github.com/insign/userscripts
// @version      202412281434
// @description  Improves LMSYS/LMArena chat interface: cleaner look, removes clutter & startup alerts.
// @match        https://lmarena.ai/*
// @match        https://chat.lmsys.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lmarena.ai
// @author       Hélio <open@helio.me>
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/489922/Better%20LMArena%20%28lmsys%29%20Chat.user.js
// @updateURL https://update.greasyfork.org/scripts/489922/Better%20LMArena%20%28lmsys%29%20Chat.meta.js
// ==/UserScript==

(function() {
	'use strict'

	// --- Bloqueador de Alertas ---
	// Sobrescreve a função window.alert para impedir que alertas pop-up
	// interrompam o usuário, especialmente os que aparecem ao carregar a página.
	const originalAlert = window.alert // Guarda referência ao alert original (opcional)
	window.alert = function(...args) {
		console.log('Blocked alert:', args)
		// Pode-se adicionar lógica aqui, se necessário, ou apenas bloquear.
		// originalAlert.apply(window, args); // Descomente para reativar os alerts originais
	}
	console.log('Better LMArena: Alert blocker active.')

	// --- Utilitários DOM ---
	// Seletores de conveniência
	const $  = document.querySelector.bind(document)
	const $$ = document.querySelectorAll.bind(document)
	// Funções de manipulação de elementos
	const hide   = el => { if (el) el.style.display = 'none' } // Esconde o elemento
	const remove = el => { if (el) el.remove() } // Remove o elemento do DOM
	const click  = el => { if (el) el.click() } // Simula um clique no elemento
	const rename = (el, text) => { if (el) el.textContent = text } // Renomeia o texto do elemento

	/**
	 * Aplica uma função a elementos selecionados repetidamente em intervalos,
	 * mas apenas se uma condição de verificação for atendida. Útil para modificar
	 * elementos que são carregados dinamicamente ou podem mudar de estado.
	 * Otimizado para pausar quando a aba não está visível.
	 *
	 * @param {string|Element|NodeList|Array<string|Element|NodeList>} selector - Seletor(es) CSS, elemento(s) ou NodeList(s).
	 * @param {function(Element): boolean} check - Função que retorna true se a ação deve ser aplicada ao elemento.
	 * @param {function(Element): void} fn - A função a ser executada no elemento se check retornar true.
	 * @param {number} [interval=1000] - Intervalo de verificação em milissegundos.
	 */
	const perma = (selector, check, fn, interval = 1000) => {
		let intervalId = null // Armazena o ID do intervalo para poder pará-lo

		// Função que verifica e executa a ação nos elementos encontrados
		const checkAndExecute = () => {
			let elements = [] // Array para armazenar os elementos encontrados

			// Normaliza o(s) seletor(es) para um array de elementos
			const selectors = Array.isArray(selector) ? selector : [selector]
			selectors.forEach(item => {
				if (typeof item === 'string') {
					elements = elements.concat(Array.from($$(item))) // Seleciona por string CSS
				} else if (item instanceof Element) {
					elements.push(item) // Adiciona elemento diretamente
				} else if (item instanceof NodeList) {
					elements = elements.concat(Array.from(item)) // Adiciona elementos de NodeList
				}
			})

			// Itera sobre os elementos encontrados e aplica a lógica
			elements.forEach(element => {
				try {
					// Verifica a condição e executa a função se for verdadeira
					if (element && check(element)) {
						fn(element)
					}
				} catch (error) {
					console.warn(`Better LMArena: Error in perma check/fn for selector "${selector}":`, error, element)
					stopInterval() // Para o intervalo em caso de erro para evitar spam no console
				}
			})
		}

		// Inicia o intervalo de verificação
		const startInterval = () => {
			if (!intervalId) { // Evita múltiplos intervalos rodando
				checkAndExecute() // Executa imediatamente uma vez
				intervalId = setInterval(checkAndExecute, interval)
				// console.log(`Better LMArena: Perma interval started for selector "${selector}"`)
			}
		}

		// Para o intervalo de verificação
		const stopInterval = () => {
			if (intervalId) {
				clearInterval(intervalId)
				intervalId = null
				// console.log(`Better LMArena: Perma interval stopped for selector "${selector}"`)
			}
		}

		// Ouve mudanças na visibilidade da aba para pausar/retomar o intervalo
		document.addEventListener('visibilitychange', () => {
			if (document.hidden) {
				stopInterval() // Pausa quando a aba fica oculta
			} else {
				startInterval() // Retoma quando a aba fica visível
			}
		})

		// Inicia o intervalo assim que a função é chamada
		startInterval()
	}

	/**
	 * Espera que um ou mais elementos existam no DOM e então executa um callback.
	 * Usa MutationObserver para eficiência, evitando polling constante.
	 *
	 * @param {string|Element|NodeList|Array<string|Element|NodeList|function(): Element|null>} selectors - Seletor(es) CSS, elemento(s), NodeList(s) ou função(ões) que retornam um elemento.
	 * @param {function(Element): void} [callback=null] - Função a ser executada quando o primeiro elemento for encontrado.
	 * @param {number} [slow=0] - Atraso opcional (ms) antes de executar o callback.
	 * @returns {Promise<void>} - Promessa que resolve quando o elemento é encontrado e o callback executado.
	 */
	const when = (selectors = ['html'], callback = null, slow = 0) => {
		// Garante que selectors seja um array
		const selectorArray = Array.isArray(selectors) ? selectors : [selectors]

		return new Promise((resolve) => {
			// Função para executar o callback (com ou sem atraso)
			const executeCallback = (element) => {
				const execute = () => {
					if (callback) {
						try {
							callback(element)
						} catch (error) {
							console.error(`Better LMArena: Error in 'when' callback for selector "${selectors}":`, error, element)
						}
					}
					resolve() // Resolve a promessa
				}

				if (slow > 0) {
					setTimeout(execute, slow)
				} else {
					execute()
				}
			}

			// Verifica se algum dos seletores já corresponde a um elemento no DOM
			const checkSelectors = () => {
				for (const selector of selectorArray) {
					let element = null
					if (typeof selector === 'string') {
						element = $(selector) // Busca por seletor CSS
					} else if (selector instanceof Element || selector instanceof NodeList && selector.length > 0) {
						element = (selector instanceof NodeList) ? selector[0] : selector // Usa elemento ou primeiro de NodeList
					} else if (typeof selector === 'function') {
						try {
							element = selector() // Executa função para obter elemento
						} catch (error) {
							console.warn(`Better LMArena: Error executing selector function in 'when':`, error)
							continue // Pula para o próximo seletor em caso de erro na função
						}
					}

					// Se encontrou um elemento, executa o callback e retorna true
					if (element) {
						executeCallback(element)
						return true
					}
				}
				return false // Nenhum elemento encontrado ainda
			}

			// Se o elemento já existe, executa o callback e retorna
			if (checkSelectors()) {
				return
			}

			// Se não encontrou, configura um MutationObserver para observar adições ao DOM
			const observer = new MutationObserver((mutations) => {
				// Otimização: Verifica apenas se nós foram adicionados
				const nodesAdded = mutations.some(mutation => mutation.addedNodes.length > 0)
				if (nodesAdded) {
					// Se algum nó foi adicionado, verifica novamente os seletores
					if (checkSelectors()) {
						observer.disconnect() // Para de observar assim que encontrar
					}
				}
			})

			// Começa a observar o body e seus descendentes
			observer.observe(document.body || document.documentElement, { childList: true, subtree: true })
			// console.log(`Better LMArena: Waiting for selector(s):`, selectors)
		})
	}


	// --- Modificações Específicas LMArena ---

	// Renomeia os botões das abas principais para nomes mais curtos ou descritivos
	// Usa 'perma' porque os elementos podem ser recriados ou ter o texto alterado pela aplicação.
	// A função 'check' garante que a renomeação ocorra apenas uma vez por estado.
	perma('#component-18-button', el => el.textContent !== 'Battle', el => rename(el, 'Battle'), 500)
	perma('#component-63-button', el => el.textContent !== 'Side-by-Side', el => rename(el, 'Side-by-Side'), 500)
	perma('#component-107-button', el => el.textContent !== 'Chat', el => rename(el, 'Chat'), 500)
	perma('#component-108-button', el => el.textContent !== 'Vision Chat', el => rename(el, 'Vision Chat'), 500) // Pode não existir mais
	perma('#component-140-button', el => el.textContent !== 'Ranking', el => rename(el, 'Ranking'), 500)
	perma('#component-231-button', el => el.textContent !== 'About', el => rename(el, 'About'), 500)

	// Remove blocos de texto/aviso e termos de serviço que ocupam espaço inicial
	// Usa 'when' porque esses elementos geralmente aparecem uma vez ao carregar a aba.
	when([
		// Bloco de aviso no topo (o seletor pode mudar com atualizações do Gradio/LMSYS)
		() => $('gradio-app > .main > .wrap > .tabs > .tabitem > .gap > #notice_markdown'),
		// Blocos de Termos de Serviço (ToS) em diferentes abas
		() => $('#component-26 > .gap > .hide-container.block'), // ToS - Battle
		() => $('#component-139 > .gap > .hide-container.block'),// ToS - Chat? (Verificar ID)
		() => $('#component-95 > .gap > .hide-container.block'), // ToS - Side-by-Side? (Verificar ID)
		// Bloco de markdown no topo do Leaderboard
		() => $('#leaderboard_markdown > .svelte-1ed2p3z > .svelte-gq7qsu.prose'),
	], remove, 50) // Pequeno delay para garantir que o elemento exista

	// Remove outros elementos de texto/botões menos úteis (IDs podem mudar)
	// Tenta remover o botão "About" e alguns outros componentes (potencialmente spacers ou text blocks).
	when([
		'#component-151-button', // Botão "About"? Verificar se é o mesmo que #component-231
		// IDs abaixo podem corresponder a blocos de texto/markdown ou spacers. Verificar no inspetor.
		'#component-54',
		'#component-87',
		'#component-114',
		'#component-11',
	], remove, 100).then(() => {
		console.log('Better LMArena: Cleaned up initial text blocks and buttons.')

		// Ajusta o padding dos botões das abas após a remoção de outros elementos
		perma('.tab-nav button', el => el.style.padding !== 'var(--size-1) var(--size-3)', el => {
			el.style.padding = 'var(--size-1) var(--size-3)'
		}, 500)

		// Remove padding e borda dos containers das abas
		perma('.tabitem', el => el.style.padding !== '0px' || el.style.borderWidth !== '0px', el => {
			el.style.padding = '0'
			el.style.border  = '0'
		}, 500)
	})

	// Ajusta o layout principal da aplicação para ocupar mais espaço horizontal
	when('.app', el => {
		el.style.margin   = '0 auto' // Mantém centralizado
		el.style.maxWidth = '100%' // Largura total
		el.style.padding  = '0'    // Remove padding externo
	}, 50)

	// Centraliza a barra de navegação das abas
	when('.tab-nav', el => {
		el.style.display   = 'flex' // Usar flex para centralizar
		el.style.justifyContent = 'center' // Centraliza os botões horizontalmente
		el.style.gap = 'var(--spacing-lg)' // Adiciona um espaço entre os botões
	}, 50)

	// Ajusta a altura do chatbot para ocupar mais espaço vertical
	perma('#chatbot', el => el.style.height !== 'calc(80vh - 50px)', el => { // Ajuste dinâmico da altura
		el.style.height = 'calc(80vh - 50px)' // Ex: 80% da altura da viewport menos espaço para input/header
	}, 1000)

	// Reduz o espaçamento geral entre elementos (gap)
	perma('.gap', el => el.style.gap !== 'var(--spacing-sm)', el => { // Usa um espaçamento menor
		el.style.gap = 'var(--spacing-sm)' // Ex: 6px ou var(--spacing-sm)
	}, 1000)

	// Remove o arredondamento das bordas (estilo mais quadrado)
	perma(['button', 'textarea', '.gradio-textbox', '.block'], el => el.style.borderRadius !== '0px', el => {
		el.style.borderRadius = '0px'
	}, 1000)

	// Ajusta a caixa de input (remove bordas, padding, arredondamento)
	perma('#input_box', el => {
		let changed = false
		if (el.style.borderWidth !== '0px') { el.style.borderWidth = '0px'; changed = true }
		if (el.style.padding !== '0px') { el.style.padding = '0px'; changed = true }
		// Aplica ao pai também se necessário (alguns estilos podem estar no container)
		if (el.parentNode && el.parentNode.style.borderWidth !== '0px') { el.parentNode.style.borderWidth = '0px'; el.parentNode.style.borderRadius = '0px'; changed = true }
		// Aplica ao textarea filho
		const textarea = el.querySelector('textarea')
		if (textarea && textarea.style.borderRadius !== '0px') { textarea.style.borderRadius = '0px'; changed = true }
		return changed // Retorna true apenas se algo mudou
	}, el => el, 1000) // Condição de check simplificada, a lógica está na função fn

	// Renomeia e estiliza os botões de envio/regenerate/stop
	perma('.submit-button', el => el.textContent !== '⤴️', el => {
		el.style.minWidth = '40px' // Largura mínima
		el.textContent    = '⤴️'  // Ícone de envio
		el.style.padding  = 'var(--size-1) var(--size-1)' // Padding menor
	}, 500)
	// Outros botões podem ter classes diferentes (ex: .generate-button, .stop-button)
	// Adicionar 'perma' para eles se necessário.

	// Remove borda e arredondamento da área de compartilhamento
	perma('#share-region-named', el => el.style.borderWidth !== '0px', el => {
		el.style.border       = '0'
		el.style.borderRadius = '0'
	}, 1000)

	// Ajusta espaçamento em containers específicos do Svelte (se aplicável)
	perma('.svelte-15lo0d8', el => el.style.gap !== 'var(--spacing-md)', el => {
		el.style.gap = 'var(--spacing-md)'
	}, 1000)

	// Remove o link "Built with Gradio" no rodapé
	when('.built-with', remove, 1000) // Atraso maior pois pode carregar por último

	// Lógica específica: Clica automaticamente em "Direct Chat" se o pop-up "Model B" aparecer
	// O seletor '.svelte-nab2ao' pode ser específico de um componente modal que aparece.
	// É necessário verificar se esse seletor ainda é válido.
	when('.svelte-nab2ao', () => {
		console.log('Better LMArena: Detected Model B selection prompt.')
		// Espera um pouco para garantir que o botão esteja pronto e clica nele
		setTimeout(() => {
			const directChatButton = $('#component-123-button') // ID pode ter mudado
			if (directChatButton) {
				console.log('Better LMArena: Clicking "Direct Chat" button.')
				click(directChatButton)
			} else {
				console.warn('Better LMArena: "Direct Chat" button (#component-123-button) not found.')
			}
		}, 500) // Atraso para garantir que o botão esteja interativo
	}, 500)

	console.log('Better LMArena script loaded and running.')
})()
