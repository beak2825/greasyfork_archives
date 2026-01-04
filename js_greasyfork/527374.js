// ==UserScript==
// @name         AI Prompt Manager (DeepSeek)
// @namespace    https://github.com/insign/userscripts
// @version      2025.02.18.1758
// @description  Easily manage (save, edit, insert) reusable prompts on DeepSeek Chat. Adds a floating button.
// @author       Hélio <open@helio.me>
// @license      WTFPL
// @match        https://chat.deepseek.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/527374/AI%20Prompt%20Manager%20%28DeepSeek%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527374/AI%20Prompt%20Manager%20%28DeepSeek%29.meta.js
// ==/UserScript==

(function() {
	'use strict'

	// --- Constantes ---
	const MANAGER_ID = 'ds-prompt-manager-v2' // ID para o container principal do gerenciador
	const BUTTON_ID = 'ds-prompt-button-v2'   // ID para o botão flutuante
	const STORAGE_KEY = 'ds_prompts_v2'      // Chave para armazenar os prompts no GM storage
	const CSS_THEME = '#4D6BFE'              // Cor tema para a interface

	// --- Estado ---
	let prompts = [] // Array para guardar os prompts carregados/salvos

	/**
	 * Inicializa o script: carrega prompts, cria a interface e adiciona listeners.
	 */
	async function initialize() {
		try {
			// Carrega os prompts salvos ou inicializa com array vazio
			const storedPrompts = await GM.getValue(STORAGE_KEY, '[]') // Padrão como string JSON
			try {
				prompts = JSON.parse(storedPrompts)
				// Garante que seja um array, mesmo que o storage esteja corrompido
				if (!Array.isArray(prompts)) {
					console.warn('AI Prompt Manager: Invalid data found in storage, resetting.')
					prompts = []
					await GM.setValue(STORAGE_KEY, JSON.stringify([]))
				}
			} catch (parseError) {
				console.error('AI Prompt Manager: Failed to parse stored prompts, resetting.', parseError)
				prompts = []
				await GM.setValue(STORAGE_KEY, JSON.stringify([])) // Reseta se não conseguir parsear
			}

			// Cria os elementos da interface
			createManagerButton()
			createPromptManager()

			// Configura os listeners de eventos
			setupEventListeners()

			// Preenche a lista de prompts na interface
			refreshPromptList()

			console.log('AI Prompt Manager initialized successfully.')

		} catch (error) {
			console.error('AI Prompt Manager: Initialization failed:', error)
		}
	}

	/**
	 * Cria o botão flutuante (📋) para abrir o gerenciador.
	 */
	function createManagerButton() {
		// Evita criar múltiplos botões
		if (document.getElementById(BUTTON_ID)) return

		// Cria o elemento do botão
		const btn = document.createElement('div')
		btn.id = BUTTON_ID
		btn.innerHTML = '📋' // Ícone de prancheta
		btn.title = 'Open Prompt Manager' // Tooltip

		// Aplica estilos ao botão
		Object.assign(btn.style, {
			position: 'fixed',
			bottom: '85px', // Posição vertical ajustada
			right: '20px',
			width: '45px',
			height: '45px',
			background: CSS_THEME,
			color: 'white',
			borderRadius: '50%',
			cursor: 'pointer',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			zIndex: '2147483646', // Z-index alto, mas abaixo do gerenciador
			fontSize: '24px',
			boxShadow: '0 3px 10px rgba(0,0,0,0.25)', // Sombra mais pronunciada
			transition: 'transform 0.2s ease-out, background-color 0.2s ease-out', // Transições suaves
			userSelect: 'none',
		})

		// Efeito hover
		btn.onmouseover = () => { btn.style.transform = 'scale(1.1)'; btn.style.backgroundColor = '#3b5ae0'; }
		btn.onmouseout = () => { btn.style.transform = 'scale(1)'; btn.style.backgroundColor = CSS_THEME; }

		document.body.appendChild(btn)
	}

	/**
	 * Cria o container do gerenciador de prompts (inicialmente oculto).
	 */
	function createPromptManager() {
		// Evita criar múltiplos gerenciadores
		if (document.getElementById(MANAGER_ID)) return

		// Cria o container principal
		const mgr = document.createElement('div')
		mgr.id = MANAGER_ID
		mgr.innerHTML = `
      <div class="ds-pm-header">
        <span>Saved Prompts</span>
        <button class="ds-pm-close-btn" title="Close Manager">×</button>
      </div>
      <div class="ds-pm-prompt-list"></div>
      <button class="ds-pm-add-prompt">+ New Prompt</button>
    `

		// Aplica estilos ao container
		Object.assign(mgr.style, {
			position: 'fixed',
			bottom: '140px', // Acima do botão flutuante
			right: '20px',
			background: 'white',
			borderRadius: '12px',
			boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
			padding: '0', // Padding será interno nos elementos filhos
			width: '320px', // Largura aumentada ligeiramente
			display: 'none', // Começa oculto
			zIndex: '2147483647', // Z-index máximo
			fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
			fontSize: '14px',
			overflow: 'hidden', // Para conter os elementos internos e bordas arredondadas
			border: '1px solid #e0e0e0',
		})

		document.body.appendChild(mgr)

		// Adiciona estilos CSS específicos via GM.addStyle
		addManagerStyles()
	}

	/**
	 * Atualiza a lista de prompts exibida na interface do gerenciador.
	 */
	function refreshPromptList() {
		const list = document.querySelector(`#${MANAGER_ID} .ds-pm-prompt-list`)
		if (!list) return // Sai se a lista não for encontrada

		list.innerHTML = '' // Limpa a lista atual

		if (prompts.length === 0) {
			list.innerHTML = '<div class="ds-pm-no-prompts">No prompts saved yet. Click "+ New Prompt" to add one.</div>'
			return
		}

		// Cria e adiciona um item para cada prompt
		prompts.forEach((prompt, index) => {
			const item = document.createElement('div')
			item.className = 'ds-pm-prompt-item'
			item.title = `Click to insert prompt:\n"${prompt.content.substring(0, 100)}${prompt.content.length > 100 ? '...' : ''}"` // Tooltip com preview
			item.innerHTML = `
              <span class="ds-pm-prompt-title">${prompt.title}</span>
              <div class="ds-pm-prompt-actions">
                  <button class="ds-pm-edit-btn" title="Edit Prompt">✏️</button>
                  <button class="ds-pm-delete-btn" title="Delete Prompt">🗑️</button>
              </div>
            `

			// Listener para deletar
			item.querySelector('.ds-pm-delete-btn').addEventListener('click', (e) => {
				e.stopPropagation() // Impede que o clique no botão acione o clique no item
				deletePrompt(index)
			})

			// Listener para editar
			item.querySelector('.ds-pm-edit-btn').addEventListener('click', (e) => {
				e.stopPropagation()
				editPrompt(index)
			})

			// Listener para inserir o prompt ao clicar no item
			item.addEventListener('click', () => insertPrompt(prompt.content))

			list.appendChild(item)
		})
	}

	/**
	 * Salva o array de prompts atual no armazenamento do GM.
	 */
	async function savePrompts() {
		try {
			await GM.setValue(STORAGE_KEY, JSON.stringify(prompts))
		} catch (error) {
			console.error('AI Prompt Manager: Failed to save prompts:', error)
			alert('Error: Could not save prompts.') // Informa o usuário
		}
	}

	/**
	 * Deleta um prompt do array e atualiza a interface e o armazenamento.
	 * @param {number} index - O índice do prompt a ser deletado.
	 */
	async function deletePrompt(index) {
		// Confirmação antes de deletar
		if (!confirm(`Are you sure you want to delete the prompt "${prompts[index]?.title}"?`)) {
			return
		}
		prompts.splice(index, 1) // Remove o prompt do array
		await savePrompts()      // Salva as alterações
		refreshPromptList()      // Atualiza a lista na interface
	}

	/**
	 * Permite ao usuário editar o título e o conteúdo de um prompt existente.
	 * @param {number} index - O índice do prompt a ser editado.
	 */
	async function editPrompt(index) {
		const promptData = prompts[index]
		if (!promptData) return // Sai se o índice for inválido

		// Pede novo título, mantendo o atual como padrão
		const newTitle = prompt('Edit prompt title:', promptData.title)
		if (newTitle === null) return // Sai se o usuário cancelar

		// Pede novo conteúdo, mantendo o atual como padrão
		const newContent = prompt('Edit prompt content:', promptData.content)
		if (newContent === null) return // Sai se o usuário cancelar

		// Atualiza o prompt no array
		prompts[index] = { title: newTitle.trim() || 'Untitled', content: newContent.trim() }
		await savePrompts()   // Salva as alterações
		refreshPromptList()   // Atualiza a interface
	}

	/**
	 * Insere o conteúdo de um prompt na caixa de texto do chat do DeepSeek.
	 * Tenta manipular o estado do React e o DOM para garantir a inserção correta.
	 * @param {string} content - O conteúdo do prompt a ser inserido.
	 */
	function insertPrompt(content) {
		// Seletores específicos do DeepSeek (podem precisar de atualização se o site mudar)
		const textarea = document.getElementById('chat-input') // O textarea real (pode estar oculto)
		const visibleEditor = document.querySelector('.ds-editor-input-wrapper .ds-md-editor-tiptap') // O editor visível (TipTap/ProseMirror)

		if (!textarea || !visibleEditor) {
			console.error('AI Prompt Manager: Could not find DeepSeek chat input elements.')
			alert('Error: Could not find the chat input field.')
			return
		}

		try {
			// --- Método 1: Simular input no editor visível (mais robusto para editores ricos) ---
			// Foca o editor
			visibleEditor.focus()

			// Cria um evento de input para simular digitação (pode ser necessário para o React detectar)
			// Adiciona o conteúdo + duas quebras de linha no início do valor atual
			const newValue = content + '\n\n' + (textarea.value || '')

			// Tenta usar document.execCommand (pode funcionar em alguns casos)
			// Move o cursor para o início antes de inserir
			const selection = window.getSelection()
			const range = document.createRange()
			range.selectNodeContents(visibleEditor)
			range.collapse(true) // Colapsa para o início
			selection.removeAllRanges()
			selection.addRange(range)
			// Insere o texto (pode não funcionar perfeitamente com React/TipTap)
			// document.execCommand('insertText', false, content + '\n\n') // Comentado - menos confiável

			// --- Método 2: Manipulação direta e disparo de evento (Fallback/Alternativa) ---
			// Define o valor no textarea oculto (React pode ouvir isso)
			textarea.value = newValue

			// Dispara eventos de input e change no textarea para notificar o React
			textarea.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
			textarea.dispatchEvent(new Event('change', { bubbles: true, cancelable: true }))

			// Atualiza o conteúdo do editor visível (força a sincronização visual)
			// Encontra o parágrafo inicial ou cria um se não existir
			let firstParagraph = visibleEditor.querySelector('p')
			if (!firstParagraph) {
				firstParagraph = document.createElement('p')
				visibleEditor.appendChild(firstParagraph)
			}
			// Define o conteúdo do primeiro parágrafo
			// Adiciona quebras de linha <br> para simular o parágrafo
			firstParagraph.innerHTML = content.replace(/\n/g, '<br>') + '<br><br>' + firstParagraph.innerHTML


			// --- Método 3: Interagir com a instância do editor TipTap (Avançado, se possível) ---
			// Se houvesse uma forma de acessar a API do TipTap (ex: window.editorInstance),
			// seria o método ideal:
			// if (window.editorInstance) {
			//    window.editorInstance.chain().focus().insertContentAt(0, content + '\n\n').run()
			// }

			console.log('AI Prompt Manager: Prompt inserted.')
			// Fecha o gerenciador após a inserção
			hideManager()

		} catch (error) {
			console.error('AI Prompt Manager: Failed to insert prompt:', error)
			alert('Error: Could not insert the prompt into the chat input.')
		}
	}

	/**
	 * Esconde o painel do gerenciador.
	 */
	function hideManager() {
		const mgr = document.getElementById(MANAGER_ID)
		if (mgr) mgr.style.display = 'none'
	}

	/**
	 * Configura os listeners de eventos para o botão e o gerenciador.
	 */
	function setupEventListeners() {
		// Listener para o botão flutuante: mostra/esconde o gerenciador
		document.getElementById(BUTTON_ID)?.addEventListener('click', (e) => {
			e.stopPropagation() // Impede que o clique feche o gerenciador imediatamente
			const mgr = document.getElementById(MANAGER_ID)
			if (mgr) {
				mgr.style.display = mgr.style.display === 'none' ? 'block' : 'none'
			}
		})

		// Listener para fechar o gerenciador clicando fora dele ou no botão 'x'
		document.addEventListener('click', (e) => {
			const mgr = document.getElementById(MANAGER_ID)
			const btn = document.getElementById(BUTTON_ID)
			// Fecha se o clique foi fora do gerenciador E fora do botão de abrir
			// Ou se foi no botão de fechar dentro do header
			if (mgr && mgr.style.display === 'block') {
				if (e.target.classList.contains('ds-pm-close-btn')) {
					hideManager()
				} else if (!mgr.contains(e.target) && e.target !== btn && !btn.contains(e.target)) {
					hideManager()
				}
			}
		}, true) // Usa captura para pegar o evento antes que outros listeners o parem

		// Listener para o botão "+ New Prompt"
		document.querySelector(`#${MANAGER_ID} .ds-pm-add-prompt`)?.addEventListener('click', async (e) => {
			e.stopPropagation() // Previne fechar o painel
			const title = prompt('Enter prompt title:')
			if (title === null) return // Cancelado
			const content = prompt('Enter prompt content:')
			if (content === null) return // Cancelado

			// Adiciona o novo prompt ao array
			prompts.push({ title: title.trim() || 'Untitled', content: content.trim() })
			await savePrompts() // Salva
			refreshPromptList() // Atualiza a interface
		})
	}

	/**
	 * Adiciona os estilos CSS para o gerenciador usando GM.addStyle.
	 */
	function addManagerStyles() {
		GM.addStyle(`
          #${MANAGER_ID} * { /* Reseta box-sizing para consistência */
             box-sizing: border-box;
          }
          #${MANAGER_ID} .ds-pm-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: #f7f7f7;
            border-bottom: 1px solid #e0e0e0;
            font-weight: 600;
            color: #333;
            font-size: 15px;
          }
          #${MANAGER_ID} .ds-pm-close-btn {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            color: #888;
            padding: 0 5px;
            line-height: 1;
          }
           #${MANAGER_ID} .ds-pm-close-btn:hover {
            color: #000;
           }
          #${MANAGER_ID} .ds-pm-prompt-list {
            max-height: 40vh; /* Limita altura da lista */
            overflow-y: auto; /* Adiciona scroll se necessário */
            padding: 8px;
          }
          #${MANAGER_ID} .ds-pm-no-prompts {
             text-align: center;
             color: #777;
             padding: 20px;
             font-style: italic;
          }
          #${MANAGER_ID} .ds-pm-prompt-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 12px;
            margin-bottom: 6px;
            border-radius: 6px;
            cursor: pointer;
            transition: background-color 0.15s ease-out;
            border: 1px solid transparent; /* Para manter o layout no hover */
          }
          #${MANAGER_ID} .ds-pm-prompt-item:hover {
            background-color: #f0f4ff; /* Cor de fundo suave no hover */
            border-color: #d0dfff;
          }
          #${MANAGER_ID} .ds-pm-prompt-title {
            flex-grow: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis; /* Adiciona '...' se o título for longo */
            margin-right: 10px;
            color: #222;
          }
          #${MANAGER_ID} .ds-pm-prompt-actions button {
            background: none;
            border: none;
            padding: 2px 4px; /* Padding ajustado */
            cursor: pointer;
            margin-left: 5px; /* Espaço entre botões */
            opacity: 0.6;
            transition: opacity 0.15s ease-out;
            font-size: 14px; /* Tamanho dos ícones (emojis) */
          }
          #${MANAGER_ID} .ds-pm-prompt-actions button:hover {
            opacity: 1;
          }
          #${MANAGER_ID} .ds-pm-add-prompt {
            display: block; /* Ocupa toda a largura */
            width: calc(100% - 20px); /* Largura ajustada para padding */
            margin: 10px; /* Margem em volta */
            padding: 10px;
            background: ${CSS_THEME};
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            text-align: center;
            font-size: 14px;
            transition: background-color 0.15s ease-out;
          }
          #${MANAGER_ID} .ds-pm-add-prompt:hover {
            background-color: #3b5ae0; /* Cor mais escura no hover */
          }

          /* Estilo da barra de scroll */
           #${MANAGER_ID} .ds-pm-prompt-list::-webkit-scrollbar {
              width: 6px;
            }
            #${MANAGER_ID} .ds-pm-prompt-list::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 3px;
            }
            #${MANAGER_ID} .ds-pm-prompt-list::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 3px;
            }
            #${MANAGER_ID} .ds-pm-prompt-list::-webkit-scrollbar-thumb:hover {
              background: #aaa;
            }
        `)
	}


	// --- Inicialização ---
	// Espera um pouco para garantir que o DOM do DeepSeek esteja mais estável
	// antes de tentar adicionar elementos e listeners.
	if (document.readyState === 'complete') {
		setTimeout(initialize, 1000)
	} else {
		window.addEventListener('load', () => setTimeout(initialize, 1000))
	}

})();
