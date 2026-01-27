// ==UserScript==
// @name Blaze - See Double Players
// @namespace http://tampermonkey.net/
// @version 1.0.10
// @description Salvar jogadores do Double.
// @author Sr.Caveira
// @icon https://blaze.bet.br/images/favicon.ico
// @match https://blaze.bet.br/pt/games/double
// @match *://blaze.bet.br/*
// @match https://blaze.bet.br/pt/games/double*
// @match https://blaze.bet.br/*
// @grant GM_setValue
// @grant GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540951/Blaze%20-%20See%20Double%20Players.user.js
// @updateURL https://update.greasyfork.org/scripts/540951/Blaze%20-%20See%20Double%20Players.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *** REMOVIDO: A linha de reset forçado abaixo foi removida para permitir a persistência de dados. ***
    // GM_setValue('blazeDoubleSeenPlayers', '[]');

    // Set para armazenar "username_columnType" para evitar duplicatas na mesma coluna nesta sessão
    const sessionAddedToSpecificColumn = new Set();
    // Set para armazenar apenas o "username" para verificar se já foi visto em *qualquer* coluna nesta sessão
    const sessionUsersOverall = new Set();

    // Key for GM_setValue/GM_getValue to store persistent usernames
    const PERSISTENT_USERS_KEY = 'blazeDoubleSeenPlayers';
    // persistentSeenUsernames agora é um Map<username, lastColor>
    let persistentSeenUsernames = new Map(); // Stores "username" and their last seen color

    // Variáveis para as tabelas, declaradas em escopo acessível
    let userTableBodyRed;
    let userTableBodyWhite;
    let userTableBodyBlack;
    let userTableBodyPersistent; // Table body for persistent users

    // Load persistent usernames on script start
    function loadPersistentUsernames() {
        const storedUsers = GM_getValue(PERSISTENT_USERS_KEY, '[]');
        try {
            const parsedUsersArray = JSON.parse(storedUsers);
            if (Array.isArray(parsedUsersArray)) {
                parsedUsersArray.forEach(([username, lastColor]) => {
                    // Garante que username e lastColor são strings válidas
                    if (typeof username === 'string' && typeof lastColor === 'string') {
                        persistentSeenUsernames.set(username, lastColor);
                    } else {
                        console.warn(`[Blaze - See Double Players] Dados de usuário persistentes inválidos encontrados para:`, username, lastColor);
                    }
                });
            }
        } catch (e) {
            console.error('[Blaze - See Double Players] Falha ao analisar usuários armazenados. Isso pode ser de dados antigos ou corrompidos. Resetando dados persistentes.', e);
            persistentSeenUsernames = new Map(); // Reset if parsing fails
            GM_setValue(PERSISTENT_USERS_KEY, '[]'); // Limpa dados corrompidos para a próxima sessão
        }
        console.log('[Blaze - See Double Players] Usuários persistentes carregados:', persistentSeenUsernames.size);
    }

    // Save persistent usernames
    function savePersistentUsernames() {
        // Convert Map to a JSON stringifiable array of [key, value] pairs
        GM_setValue(PERSISTENT_USERS_KEY, JSON.stringify(Array.from(persistentSeenUsernames.entries())));
        console.log('[Blaze - See Double Players] Usuários persistentes salvos:', persistentSeenUsernames.size);
    }

    // NOVO: Função para limpar todos os usuários persistentes
    function clearPersistentUsers() {
        if (confirm('Tem certeza que deseja limpar TODOS os usuários já vistos? Esta ação é irreversível.')) {
            persistentSeenUsernames.clear(); // Limpa o Map em memória
            savePersistentUsernames();       // Salva o Map vazio no armazenamento
            // Limpa a tabela visualmente
            if (userTableBodyPersistent) {
                userTableBodyPersistent.innerHTML = '';
            }
            console.log('[Blaze - See Double Players] Usuários persistentes limpos.');
        }
    }

    /**
     * Função para criar e estilizar a div flutuante dinamicamente com múltiplas tabelas.
     */
    function createFloatingUserList() {
        // 1. Cria o contêiner principal da div flutuante
        const userListContainer = document.createElement('div');
        userListContainer.id = 'userListContainer';
        Object.assign(userListContainer.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#333',
            color: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            width: 'max-content', // Adjusted width to max-content to better fit content
            maxHeight: 'max-content',
            overflow: 'hidden',
            transition: 'all 0.3s ease-in-out',
            display: 'flex',
            flexDirection: 'column'
        });
        document.body.appendChild(userListContainer);

        // 2. Cria o cabeçalho da div flutuante
        const userListHeader = document.createElement('div');
        userListHeader.id = 'userListHeader';
        Object.assign(userListHeader.style, {
            backgroundColor: '#555',
            padding: '10px',
            cursor: 'pointer',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: '0'
        });
        userListHeader.innerHTML = '<span>Usuários Online e Salvos</span><span id="toggleIcon" style="font-size: 1.2em;">-</span>';
        userListContainer.appendChild(userListHeader);

        // 3. Cria o corpo da div flutuante (onde as tabelas serão adicionadas)
        const userListBody = document.createElement('div');
        userListBody.id = 'userListBody';
        Object.assign(userListBody.style, {
            padding: '10px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '15px',
            maxHeight: `max-content`,
            flexGrow: '1',
            justifyContent: 'space-around',
            overflow: 'hidden'
        });
        userListContainer.appendChild(userListBody);

        // Função auxiliar para criar uma tabela de coluna
        function createColumnTable(parentId, id, title, color, hasSeenColumn = false) {
            const columnDiv = document.createElement('div');
            columnDiv.className = 'column-table';
            Object.assign(columnDiv.style, {
                flex: '1',
                minWidth: id === 'userTablePersistent' ? '280px' : (hasSeenColumn ? '240px' : '220px'),
                maxWidth: id === 'userTablePersistent' ? '28%' : '24%',
                backgroundColor: '#444',
                borderRadius: '5px',
                padding: '8px',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: 'calc(100% - 10px)'
            });

            const titleHeader = document.createElement('h4');
            titleHeader.textContent = title;
            Object.assign(titleHeader.style, {
                color: color,
                marginBottom: '8px',
                fontSize: '0.9em',
                textAlign: 'center',
                flexShrink: '0'
            });
            columnDiv.appendChild(titleHeader);

            // Add search input for the persistent table only
            if (id === 'userTablePersistent') {
                const searchInput = document.createElement('input');
                searchInput.type = 'text';
                searchInput.placeholder = 'Buscar usuário...';
                Object.assign(searchInput.style, {
                    width: 'calc(100% - 16px)',
                    padding: '8px',
                    margin: '5px 0 10px 0',
                    border: '1px solid #666',
                    borderRadius: '4px',
                    backgroundColor: '#555',
                    color: 'white',
                    fontSize: '0.8em',
                    boxSizing: 'border-box'
                });
                columnDiv.appendChild(searchInput);

                // Add event listener for real-time filtering
                searchInput.addEventListener('keyup', (event) => {
                    filterPersistentUsers(userTableBodyPersistent, event.target.value);
                });

                // NOVO: Botão de Limpar Usuários Já Vistos
                const clearButton = document.createElement('button');
                clearButton.textContent = 'Limpar Usuários Já Vistos';
                Object.assign(clearButton.style, {
                    width: 'calc(100% - 16px)',
                    padding: '8px',
                    margin: '5px 0 10px 0',
                    backgroundColor: '#dc3545', // Vermelho para indicar perigo
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.8em'
                });
                clearButton.addEventListener('click', clearPersistentUsers);
                columnDiv.appendChild(clearButton);
            }

            const tableContainer = document.createElement('div'); // Contêiner para a tabela com scroll
            Object.assign(tableContainer.style, {
                overflowY: 'scroll', // Adiciona a barra de rolagem vertical aqui
                maxHeight: '280px', // Define a altura máxima para a área de rolagem da tabela
                flexGrow: '1'
            });
            columnDiv.appendChild(tableContainer);

            const table = document.createElement('table');
            table.id = id;
            Object.assign(table.style, {
                width: '100%',
                borderCollapse: 'collapse'
            });
            tableContainer.appendChild(table);

            const tableHead = document.createElement('thead');
            let headerHtml = '<tr><th style="padding: 5px; text-align: left; border-bottom: 1px solid #666; font-size: 0.8em; position: sticky; top: 0; background-color: #444; z-index: 1;">Usuário</th>';
            if (hasSeenColumn) {
                headerHtml += '<th style="padding: 5px; text-align: center; border-bottom: 1px solid #666; font-size: 0.8em; position: sticky; top: 0; background-color: #444; z-index: 1; width: 60px;">Já Visto</th>';
            }
            // Adiciona o cabeçalho "Apostou em" para a tabela persistente
            if (id === 'userTablePersistent') {
                headerHtml += '<th style="padding: 5px; text-align: center; border-bottom: 1px solid #666; font-size: 0.8em; position: sticky; top: 0; background-color: #444; z-index: 1; width: 80px;">Apostou em</th>';
            }
            headerHtml += '</tr>';
            tableHead.innerHTML = headerHtml;
            table.appendChild(tableHead);

            const tableBody = document.createElement('tbody');
            table.appendChild(tableBody);

            document.getElementById(parentId).appendChild(columnDiv);
            return tableBody; // Retorna o tbody para fácil acesso
        }

        // 4. Cria as três tabelas de sessao COM a coluna "Já Visto"
        userTableBodyRed = createColumnTable('userListBody', 'userTableRed', '2X (Vermelho)', '#FF4136', true);
        userTableBodyWhite = createColumnTable('userListBody', 'userTableWhite', '14X (Branco)', '#F8F8F8', true);
        userTableBodyBlack = createColumnTable('userListBody', 'userTableBlack', '2X (Preto)', '#111111', true);
        // E a tabela de usuários persistentes AGORA COM a coluna "Apostou em" (internamente, hasSeenColumn é false, mas a lógica acima lida com o ID)
        userTableBodyPersistent = createColumnTable('userListBody', 'userTablePersistent', 'Usuários Já Vistos (Total)', '#00BFFF', false);

        // Adiciona o evento de clique para minimizar/maximizar
        const toggleIcon = userListHeader.querySelector('#toggleIcon');
        userListHeader.addEventListener('click', () => {
            userListContainer.classList.toggle('minimized');
            if (userListContainer.classList.contains('minimized')) {
                toggleIcon.textContent = '+';
                userListBody.style.display = 'none';
                Object.assign(userListContainer.style, {
                    width: '180px',
                    height: '40px',
                    maxHeight: '40px'
                });
            } else {
                toggleIcon.textContent = '-';
                userListBody.style.display = 'flex';
                Object.assign(userListContainer.style, {
                    width: 'max-content', // Returns to expanded width
                    maxHeight: 'max-content',
                    height: 'auto'
                });
            }
        });

        // Injeta os estilos CSS para a classe .minimized e a barra de rolagem
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #userListContainer.minimized #userListBody {
                display: none !important;
            }
            #userListContainer.minimized #toggleIcon {
                content: '+' !important;
            }
            /* Estilos para a barra de rolagem (opcional, para customização) */
            .column-table div::-webkit-scrollbar {
                width: 8px;
            }
            .column-table div::-webkit-scrollbar-track {
                background: #555;
                border-radius: 4px;
            }
            .column-table div::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 4px;
            }
            .column-table div::-webkit-scrollbar-thumb:hover {
                background: #aaa;
            }
        `;
        document.head.appendChild(styleElement);
    }

    /**
     * Função para adicionar um username a uma tabela de coluna de cor.
     * @param {HTMLElement} targetTableBody - O tbody da tabela.
     * @param {string} username - O nome de usuário.
     * @param {boolean} alreadySeenInSession - Se o usuário já foi visto nesta sessão.
     */
    function addUsernameToColorTable(targetTableBody, username, alreadySeenInSession) {
        const newRow = targetTableBody.insertRow(0); // Insere no início
        const userCell = newRow.insertCell(0);
        const seenCell = newRow.insertCell(1); // New cell for "já visto"

        userCell.textContent = username;
        seenCell.textContent = alreadySeenInSession ? 'Sim' : 'Não';
        seenCell.style.textAlign = 'center';
        seenCell.style.fontWeight = 'bold';
        seenCell.style.color = alreadySeenInSession ? '#00FF00' : '#FF0000'; // Green for Sim, Red for Não

        Object.assign(userCell.style, {
            padding: '4px 2px',
            borderBottom: '1px dashed #555',
            fontSize: '0.8em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        });
        Object.assign(seenCell.style, {
            padding: '4px 2px',
            borderBottom: '1px dashed #555',
            fontSize: '0.8em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        });
    }

    /**
     * Função para adicionar um username à tabela de usuários persistentes.
     * @param {HTMLElement} targetTableBody - O tbody da tabela persistente.
     * @param {string} username - O nome de usuário.
     * @param {string} lastColor - A última cor em que o usuário apostou (Red, White, Black).
     */
    function addPersistentUserToTable(targetTableBody, username, lastColor) {
        const newRow = targetTableBody.insertRow(0); // Insere no início
        const userCell = newRow.insertCell(0);
        const colorCell = newRow.insertCell(1); // Nova célula para a cor

        // Garante que username é uma string completa
        userCell.textContent = String(username);
        // Garante que lastColor é uma string completa
        colorCell.textContent = String(lastColor);

        colorCell.style.textAlign = 'center'; // Centraliza o texto da cor
        colorCell.style.fontWeight = 'bold'; // Negrito para a cor

        // Define a cor do texto da célula de cor com base na aposta
        let textColor = 'white'; // Cor padrão
        switch (lastColor) {
            case 'Red':
                textColor = '#FF4136';
                break;
            case 'White':
                textColor = '#F8F8F8';
                break;
            case 'Black':
                textColor = '#111111'; // Ajustado para um cinza mais claro para melhor visibilidade
                break;
        }
        colorCell.style.color = textColor;


        Object.assign(userCell.style, {
            padding: '4px 2px',
            borderBottom: '1px dashed #555',
            fontSize: '0.8em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        });
        // Estilos para a nova célula de cor
        Object.assign(colorCell.style, {
            padding: '4px 2px',
            borderBottom: '1px dashed #555',
            fontSize: '0.8em',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis'
        });
    }

    /**
     * Função para filtrar as linhas da tabela de usuários persistentes.
     * @param {HTMLElement} tableBody - O tbody da tabela persistente.
     * @param {string} searchText - O texto a ser pesquisado.
     */
    function filterPersistentUsers(tableBody, searchText) {
        const filter = searchText.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        for (let i = 0; i < rows.length; i++) {
            const userCell = rows[i].getElementsByTagName('td')[0]; // First cell is the username
            if (userCell) {
                const username = userCell.textContent || userCell.innerText;
                if (username.toLowerCase().indexOf(filter) > -1) {
                    rows[i].style.display = ''; // Show the row
                } else {
                    rows[i].style.display = 'none'; // Hide the row
                }
            }
        }
    }


    /**
     * Função para extrair e processar os usernames e adicioná-los à tabela correta.
     * Também adiciona ao conjunto de usuários persistentes.
     * @param {NodeList} entryElements - Uma NodeList contendo os elementos 'div.entry'.
     */
    function processUsernames(entryElements) {
        entryElements.forEach(entry => {
            const userProfileLink = entry.querySelector('div.username > a.user-profile-link');

            let username = '';
            if (userProfileLink) {
                username = userProfileLink.textContent.trim();
            } else {
                const usernameDiv = entry.querySelector('div.username');
                if (usernameDiv && usernameDiv.textContent.includes('Jogadores')) {
                    return; // Ignora "+N Jogadores"
                }
                if (usernameDiv) {
                    username = usernameDiv.textContent.trim();
                }
            }

            if (!username || typeof username !== 'string' || username.trim() === '') {
                return; // Ignora usernames vazios ou inválidos
            }

            // Determina de qual coluna o usuário veio
            let columnType = '';
            const parentColumn = entry.closest('.roulette-column');
            if (parentColumn) {
                if (parentColumn.classList.contains('red')) {
                    columnType = 'Red';
                } else if (parentColumn.classList.contains('white')) {
                    columnType = 'White';
                } else if (parentColumn.classList.contains('black')) {
                    columnType = 'Black';
                }
            }

            if (columnType === '') {
                return; // Não processa se a coluna não for reconhecida
            }

            // Chave única para evitar duplicatas na *mesma* coluna nesta sessão
            const uniqueUserKeyForColumn = `${username}_${columnType}`;

            // Verifica se o username já foi adicionado a esta coluna nesta sessão
            if (sessionAddedToSpecificColumn.has(uniqueUserKeyForColumn)) {
                return; // Já vimos este usuário nesta coluna nesta sessão
            }
            sessionAddedToSpecificColumn.add(uniqueUserKeyForColumn);

            // Verifica se o usuário já foi visto em *qualquer* coluna nesta sessão
            const alreadySeenInSession = sessionUsersOverall.has(username);
            sessionUsersOverall.add(username); // Adiciona o usuário ao set geral da sessão

            let targetTableBody;
            switch (columnType) {
                case 'Red':
                    targetTableBody = userTableBodyRed;
                    break;
                case 'White':
                    targetTableBody = userTableBodyWhite;
                    break;
                case 'Black':
                    targetTableBody = userTableBodyBlack;
                    break;
                default:
                    return;
            }

            // Adiciona o username à tabela de cor correta com o status "já visto"
            if (targetTableBody) {
                addUsernameToColorTable(targetTableBody, username, alreadySeenInSession);
            }

            // Adiciona ou atualiza à lista persistente
            // Usa Map.set para atualizar a última cor vista
            if (persistentSeenUsernames.get(username) !== columnType) { // Only update if the color is different
                persistentSeenUsernames.set(username, columnType);
                savePersistentUsernames(); // Salva após adicionar/atualizar um usuário persistente
                // Remove e adiciona a linha para que a ordem seja por último visto E a cor seja atualizada
                // Primeiro, remove a linha antiga da tabela persistente, se existir
                const rows = userTableBodyPersistent.getElementsByTagName('tr');
                for (let i = 0; i < rows.length; i++) {
                    if (rows[i].getElementsByTagName('td')[0].textContent === username) {
                        userTableBodyPersistent.deleteRow(i);
                        break;
                    }
                }
                // Em seguida, adiciona a nova linha com a cor atualizada no topo
                addPersistentUserToTable(userTableBodyPersistent, username, columnType);
            }
        });
    }

    // Configuração do MutationObserver
    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true
    };

    // Callback para o MutationObserver
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.matches('div.row.columns div.body.show div.entries div.entries-table .Table-module__tableCell___ufCx1.Table-module__alignLeft___P4xda')) {
                        processUsernames([node]);
                    } else if (node.nodeType === 1) {
                        const entries = node.querySelectorAll('div.row.columns div.body.show div.entries div.entries-table .Table-module__tableCell___ufCx1.Table-module__alignLeft___P4xda');
                        if (entries.length > 0) {
                            processUsernames(entries);
                        }
                    }
                });
            }
        }
    };

    // Função principal para iniciar o script após o DOM carregar
    function initUserScript() {
        loadPersistentUsernames(); // Carrega usuários persistentes antes de criar a UI

        let casinoElement = document.querySelector('#casino');
        let attempts = 0;
        const maxAttempts = 20;
        const intervalTime = 500;

        const findCasinoElement = setInterval(() => {
            casinoElement = document.querySelector('#casino');
            if (casinoElement) {
                clearInterval(findCasinoElement);
                console.log('[Blaze - See Double Players] Elemento "#casino" encontrado. Iniciando observação.');

                createFloatingUserList(); // Cria a UI

                // Popula a tabela de usuários persistentes com os dados carregados
                Array.from(persistentSeenUsernames.entries()) // Obtém [username, lastColor] pares
                    .sort((a, b) => a[0].localeCompare(b[0])) // Opcional: mantém a ordenação alfabética
                    .forEach(([username, lastColor]) => {
                    addPersistentUserToTable(userTableBodyPersistent, username, lastColor);
                });

                const observer = new MutationObserver(callback);
                observer.observe(casinoElement, observerConfig);

                // Processa entradas já existentes no momento da inicialização
                const initialEntries = casinoElement.querySelectorAll('div.row.columns div.body.show div.entries div.entries-table .Table-module__tableCell___ufCx1.Table-module__alignLeft___P4xda');
                if (initialEntries.length > 0) {
                    processUsernames(initialEntries);
                }
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(findCasinoElement);
                    console.warn('[Blaze - See Double Players] Elemento "#casino" não encontrado após várias tentativas. O script pode não funcionar como esperado.');
                }
            }
        }, intervalTime);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUserScript);
    } else {
        initUserScript();
    }
})();