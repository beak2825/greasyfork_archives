// ==UserScript==
// @name        Popmundo Better Repertoire UI
// @namespace   Violentmonkey Scripts
// @match       https://*.popmundo.com/World/Popmundo.aspx/Artist/Repertoire/*
// @exclude     /^https:\/\/.*\.popmundo\.com\/World\/Popmundo\.aspx\/Artist\/Repertoire\/[^/]+\/.+$/
// @author      Drinkwater
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @license     M.I.T
// @version     2.1
// @description Permite organizar o repertorio por grupos nomeados. Com funcionalidad de backup daquela banda e restauração de backup.

// @downloadURL https://update.greasyfork.org/scripts/510533/Popmundo%20Better%20Repertoire%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/510533/Popmundo%20Better%20Repertoire%20UI.meta.js
// ==/UserScript==

const currentUrl = window.location.href;
const bandId = currentUrl.split('/').pop();
const urlDomain = window.location.hostname;
let grupos = GM_getValue('grupos', []);
const style = document.createElement('style');
style.innerHTML = `
  .accordion-header {
        background-image: url(Images/bgr-item-header.png);
        background-color: #56686f;
        background-repeat: repeat-x;
        color: #fff;
        font-weight: 500;
        padding: 16px;
        cursor: pointer;
        border-radius: 8px;
        font-size: 12px;
        transition: background-color 0.3s ease, transform 0.2s ease;
    }

    /* Efeito hover */
    .accordion-header:hover {
        background-color: #3c4b51;
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    }
.accordion-content {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    padding: 0 10px;
    border: 1px solid #ccc;
    border-top: none;
    background-color: white;
    transition: max-height 0.4s ease, opacity 0.4s ease;
}

.accordion-content.open {
    max-height: 1000px; /* Defina uma altura máxima grande o suficiente */
    opacity: 1;
}

    .accordion-row {
        /* Define qualquer estilo adicional para as linhas accordion, se necessário */
    }
        .modal-dialog {
        width: 300px;
        height: auto;
    }
    .accordion-row td{
    padding: 5px 0px !important ;

}
.accordion-content tr{
    display: flex;
    justify-content: space-between;
}
.accordion-content tr td{
  max-width:90px;
}



`;

document.head.appendChild(style);

function createDeleteGroupModal() {
    const overlay = jQuery('<div>', { class: 'modal-overlay' }).css({
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999
    }).appendTo('body');

    const modal = jQuery('<div>', { class: 'modal-dialog' }).css({
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        width: '320px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
    }).appendTo('body');

    // Título do modal
    const modalTitle = jQuery('<h3>').text('Deletar Grupo').css({
        marginBottom: '15px',
        fontSize: '18px',
        color: '#333',
        fontWeight: 'bold'
    }).appendTo(modal);

    // Select para escolher o grupo
    const selectGroup = jQuery('<select>').css({
        marginBottom: '15px',
        padding: '5px',
        width: '100%',
        fontSize: '14px',
        borderRadius: '6px',
        border: '1px solid #ccc'
    }).appendTo(modal);

    // Exibir grupos que começam com o bandId, exceto o grupo "default", e mostrar sem o prefixo
    grupos.forEach(grupo => {
        if (grupo.startsWith(`${bandId}_`)) {
            selectGroup.append(jQuery('<option>', { value: grupo, text: grupo.replace(`${bandId}_`, '') }));
        }
    });

    // Botões de confirmação e cancelamento
    const confirmButton = jQuery('<button>').text('Confirmar').css({
        marginRight: '10px',
        padding: '8px 12px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
    }).appendTo(modal);

    const cancelButton = jQuery('<button>').text('Cancelar').css({
        padding: '8px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px'
    }).appendTo(modal);

    // Função para fechar o modal
    function closeModal() {
        modal.remove();
        overlay.remove();
    }

    // Evento de clique no botão de cancelamento
    cancelButton.on('click', function () {
        closeModal();
    });

    // Evento de clique no botão de confirmação
    confirmButton.on('click', function () {
        const selectedGroup = selectGroup.val();
        if (selectedGroup) {

            const tbody = jQuery('#tablesongs tbody');
            tbody.find('tr').each(function (index, row) {
                // Obter o grupo salvo para a música
                const currentGroup = GM_getValue(`${bandId}_song_${index}_group`);
                // Verifica se o grupo atual da música é o que está sendo deletado
                if (currentGroup === selectedGroup) {
                    GM_deleteValue(`${bandId}_song_${index}_group`);
                }
            });

            // Remove o grupo do GM_store
            grupos = grupos.filter(grupo => grupo !== selectedGroup);
            GM_setValue('grupos', grupos);

            alert(`Grupo "${selectedGroup.replace(`${bandId}_`, '')}" foi deletado`);
            closeModal();
            location.reload(); // Recarrega a página para atualizar os selects
        }
    });
}
jQuery(document).ready(function () {
    // Create a div for color pickers
    const colorPickerDiv = jQuery('<div>', { class: 'box', css: { marginBottom: '10px', padding: '10px', border: '1px solid #ccc' } });
    const heading = jQuery('<h2>').text('Configuração das Cores').appendTo(colorPickerDiv);

    // Create color pickers
    const propriaColorPickerLabel = jQuery('<label>', { css: { marginRight: '20px' } }).text('Musica própria: ').appendTo(colorPickerDiv);
    const propriaColorPicker = jQuery('<input>', { type: 'color', value: GM_getValue('propriaColor', '#000000') }).appendTo(propriaColorPickerLabel);

    const naoPropriaColorPickerLabel = jQuery('<label>').text('Comprada/Cover: ').appendTo(colorPickerDiv);
    const naoPropriaColorPicker = jQuery('<input>', { type: 'color', value: GM_getValue('naoPropriaColor', '#008000') }).appendTo(naoPropriaColorPickerLabel);
    const hr = jQuery('<hr>').appendTo(colorPickerDiv);

    // Create the submit button
    const submitButton = jQuery('<input>', { type: 'submit', value: 'Salvar Cores', class: 'cnf', css: { marginRight: '10px' } }).appendTo(colorPickerDiv);
    const createGroup = jQuery('<input>', { type: 'button', value: 'Criar novo grupo', class: 'cnf', css: { marginRight: '10px' } }).appendTo(colorPickerDiv);
    const deleteGroupButton = jQuery('<input>', { type: 'button', value: 'Deletar Grupos', class: 'cnf', css: { marginRight: '10px' } }).appendTo(colorPickerDiv);

    const createBackupButton = jQuery('<input>', { type: 'button', value: 'Criar Backup', class: 'cnf', css: { marginRight: '10px' } }).appendTo(colorPickerDiv);
    const restoreBackupButton = jQuery('<input>', { type: 'button', value: 'Restaurar Backup', class: 'cnf', css: { marginRight: '10px' } }).appendTo(colorPickerDiv);


    // Save the selected colors in GM storage when changed
    propriaColorPicker.on('change', function () {
        GM_setValue('propriaColor', propriaColorPicker.val());
    });

    naoPropriaColorPicker.on('change', function () {
        GM_setValue('naoPropriaColor', naoPropriaColorPicker.val());
    });

    // Handle the submit button click
    submitButton.on('click', function () {
        alert('Cores atualizadas com sucesso!');
        location.reload(); // Refresh the page
    });
    deleteGroupButton.on('click', function () {
        createDeleteGroupModal();
    });

    createGroup.on('click', function () {
        let groupName = prompt("Nome do grupo que deseja criar:");
        if (groupName) {
            const uniqueGroupName = `${bandId}_${groupName}`; // Prefixa o nome do grupo com o bandId
            grupos.push(uniqueGroupName); // Adiciona o novo grupo com o bandId
            GM_setValue('grupos', grupos); // Salva a lista de grupos atualizada
            alert(`Grupo "${uniqueGroupName}" criado com sucesso!`);
            location.reload(); // Recarrega a página para atualizar os selects
        }
    });

    // Insert the color picker div above the table
    jQuery('#tablesongs').before(colorPickerDiv);

    // Cria um iframe único que será reutilizado para cada link e o oculta
    const iframe = jQuery('<iframe>', {
        id: 'songIframe',
        width: '0px',
        height: '0px',
        css: { display: 'none' } // Deixa o iframe oculto inicialmente
    }).appendTo('#ppm-wrapper');

    // Seleciona todos os links da tabela
    const links = jQuery('#tablesongs tbody tr td a');
    let currentIndex = 0;

    // Função para processar um link
    function processLink() {
        if (currentIndex >= links.length) {
            console.log('Processamento concluído para todos os links.');
            iframe.remove(); // Remove o iframe após concluir o processamento de todos os links
            return;
        }

        const currentLink = jQuery(links[currentIndex]);

        // Verifica se o link contém uma imagem <img>, se contiver, pula para o próximo
        if (currentLink.find('img').length > 0) {
            currentIndex++;
            processLink();
            return;
        }

        const songName = currentLink.text(); // Get song name to display later
        const currentLinkHref = currentLink.attr('href');
        const songId = currentLinkHref.split('/').pop(); // Extract song ID from the URL

        const songData = GM_getValue(`${bandId}_${songId}`, null); // Use song ID as the key

        if (songData) {
            // If song data is already stored, display it directly
            displaySongData(songData, currentLink);
            currentIndex++;
            processLink();
        } else {
            const linkFormatted = "https://" + urlDomain + currentLinkHref;
            iframe.attr('src', linkFormatted);

            iframe.off('load').on('load', function () {
                const iframeContent = iframe.contents();
                let div1stBox = iframeContent.find('div.box').first();
                const bandHref = div1stBox.find('a[href^="/World/Popmundo.aspx/Artist/"]').attr('href');
                let bandaPropria = false;
                if (bandHref) {
                    const bandIdFromHref = bandHref.split('/').pop();
                    if (bandIdFromHref === bandId) {
                        bandaPropria = true;
                    }
                }

                let div2ndBox = iframeContent.find('div.box').eq(1);
                const melodiaTitle = div2ndBox.find('p a').eq(0).attr('title');
                const letraTitle = div2ndBox.find('p a').eq(1).attr('title');

                if (melodiaTitle && letraTitle) {
                    const notaMelodia = melodiaTitle.split('/')[0];
                    const notaLetra = letraTitle.split('/')[0];

                    const songData = {
                        songName,
                        notaMelodia,
                        notaLetra,
                        bandaPropria
                    };

                    // Save song data using the song ID as the key
                    GM_setValue(`${bandId}_${songId}`, songData);

                    displaySongData(songData, currentLink);
                } else {
                    console.error('Não foi possível encontrar os títulos para as notas da melodia e da letra.');
                }

                currentIndex++;
                processLink();
            });
        }
    }

    // Função para exibir os dados da música
    // Função para exibir os dados da música
    function displaySongData(songData, linkElement) {
        // Verifica se o ID do link é o da coluna de músicas, onde o ID contém 'lnkArtistSong'
        if (linkElement.attr('id') && linkElement.attr('id').includes('lnkArtistSong')) {
            let newText = `${songData.songName} (${songData.notaMelodia}/${songData.notaLetra})`;
            linkElement.text(newText);

            const propriaColor = GM_getValue('propriaColor', '#000000'); // Default green
            const naoPropriaColor = GM_getValue('naoPropriaColor', '#008000'); // Default yellow

            if (songData.bandaPropria) {
                linkElement.css({ 'color': propriaColor });
            } else {
                linkElement.css({ 'color': naoPropriaColor });
            }
        }
    }


    // Inicia o processamento do primeiro link
    processLink();



    // Função para criar o backup
    function exportBackup() {
        const backupData = {
            bandId: bandId,
            // Filtra os grupos que começam com o bandId atual
            grupos: grupos.filter(grupo => grupo.startsWith(`${bandId}_`)),
            musicas: {}
        };

        // Itera sobre os grupos filtrados para associar as músicas corretas
        backupData.grupos.forEach(grupo => {
            backupData.musicas[grupo] = [];
            const tbody = document.getElementById('tablesongs').querySelector('tbody');
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const songLink = row.querySelector('a');
                if (!songLink) return;

                const songUrl = songLink.getAttribute('href');
                const songId = songUrl.substring(songUrl.lastIndexOf('/') + 1);

                const savedGroup = GM_getValue(`${bandId}_song_${songId}_group`, '');
                if (savedGroup === grupo) {
                    backupData.musicas[grupo].push({
                        songId: songId,
                        songName: songLink.textContent.trim()
                    });
                }
            });
        });

        const backupBlob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
        const backupUrl = URL.createObjectURL(backupBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = backupUrl;
        downloadLink.download = `backup_band_${bandId}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        console.log("Backup criado com sucesso!");
    }

// Criar o elemento de entrada de arquivo persistente
const fileInput = jQuery('<input>', { type: 'file', accept: 'application/json', id: 'importBackupInput', style: 'display: none;' });
fileInput.appendTo(document.body);

// Associar o evento de mudança ao input de arquivo
fileInput.on('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const backupData = JSON.parse(e.target.result);

            if (backupData.bandId !== bandId) {
                alert("O backup não corresponde ao Band ID atual!");
                return;
            }

            // Restaurar os grupos e músicas no GM Store
            grupos = backupData.grupos;
            GM_setValue('grupos', grupos);

            Object.entries(backupData.musicas).forEach(([grupo, musicas]) => {
                musicas.forEach(musica => {
                    GM_setValue(`${bandId}_song_${musica.songId}_group`, grupo);
                });
            });

            alert("Backup restaurado com sucesso!");
            location.reload(); // Recarregar a página para refletir as mudanças
        } catch (error) {
            console.error("Erro ao restaurar o backup:", error);
            alert("Erro ao restaurar o backup. Verifique o arquivo selecionado.");
        }
    };
    reader.readAsText(file);
});

    // Adicionando eventos aos botões
    createBackupButton.on('click', exportBackup);

    restoreBackupButton.on('click', () => {
        // Disparar o clique no input de arquivo
        document.getElementById('importBackupInput').click();
    });


    // Função para adicionar selectboxes em cada linha e salvar a seleção
    function addSelectBoxesToRows(tbody, accordionMap) {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row) => {
            // Verifica se a linha não é um accordion (verificamos se a linha contém um link de música)
            const songLink = row.querySelector('a');
            if (!songLink || songLink.textContent.includes('Grupo')) {
                return; // Pula esta linha, pois é um accordion
            }
            if (row.classList.contains('accordion-row')) {
                return; // Se for um accordion, pula essa linha
            }

            // Extração do ID da música a partir do link
            const songUrl = songLink.getAttribute('href');
            const songId = songUrl.substring(songUrl.lastIndexOf('/') + 1);

            const songName = songLink.textContent.trim();
            const newCell = document.createElement('td');
            const select = createSelectBox(songId, accordionMap, row, songName);
            newCell.appendChild(select);
            row.appendChild(newCell);

            const savedGroup = GM_getValue(`${bandId}_song_${songId}_group`, ''); // Usando string vazia como padrão
            if (savedGroup && accordionMap[savedGroup]) {
                // Mover apenas músicas com grupos definidos (exceto default)
                accordionMap[savedGroup].appendChild(row);

                // Aplicar largura de 15% apenas nas colunas com `progressBar`
                row.querySelectorAll('td').forEach(td => {
                    if (td.querySelector('.progressBar')) {
                        td.style.width = '100%';
                    }
                });
            }
        });
    }

    // Função para adicionar o cabeçalho "Grupo" no thead
    function addTableHeader(thead) {
        const headerRow = thead.querySelector('tr');
        const newHeader = document.createElement('th');
        newHeader.textContent = 'Grupo';
        headerRow.appendChild(newHeader);
    }

    // Função para criar os accordions apenas para os grupos que começam com o bandId
    // Função para criar os accordions apenas para os grupos que começam com o bandId
    function createAccordions(tbody) {
        let accordionMap = {};

        // Filtra os grupos que começam com o bandId respectivo
        const filteredGroups = grupos.filter(grupo => grupo.startsWith(`${bandId}_`));

        // Referência para a primeira linha existente no tbody
        const firstRow = tbody.querySelector('tr');

        filteredGroups.forEach(grupo => {
            const accordionRow = document.createElement('tr');
            accordionRow.classList.add('accordion-row'); // Adiciona uma classe para identificar que é um accordion

            const accordionCell = document.createElement('td');
            accordionCell.setAttribute('colspan', tbody.closest('table').querySelectorAll('th').length);

            const accordionHeader = createAccordionHeader(grupo);
            const accordionContent = createAccordionContent();

            accordionHeader.addEventListener('click', () => {
                toggleAccordionContent(accordionContent);
            });

            accordionCell.appendChild(accordionHeader);
            accordionCell.appendChild(accordionContent);
            accordionRow.appendChild(accordionCell);

            // Insere o accordion no topo, antes da primeira linha
            tbody.insertBefore(accordionRow, firstRow);

            accordionMap[grupo] = accordionContent;
        });

        return accordionMap;
    }


    // Função para criar o cabeçalho clicável do accordion
    function createAccordionHeader(grupo) {
        const accordionHeader = document.createElement('div');
        accordionHeader.classList.add('accordion-header'); // Usa uma classe CSS para o cabeçalho do accordion

        // Exibe o grupo sem o prefixo bandId_ para visualização
        accordionHeader.textContent = `Grupo: ${grupo.replace(`${bandId}_`, '')}`;

        return accordionHeader;
    }

    // Função para criar o conteúdo do accordion
    function createAccordionContent() {
        const accordionContent = document.createElement('div');
        accordionContent.classList.add('accordion-content'); // Usa uma classe CSS para o conteúdo do accordion
        return accordionContent;
    }

    // Função para alternar a exibição do conteúdo do accordion
    function toggleAccordionContent(content) {
        if (content.classList.contains('open')) {
            content.classList.remove('open');
        } else {
            content.classList.add('open');
        }
    }

    function createSelectBox(songId, accordionMap, row, songName) {
        const select = document.createElement('select')
        select.style.maxWidth = '85px'; // Define o tamanho máximo


        // Adiciona a opção "Nenhum" para permitir que a música não pertença a nenhum grupo
        const noneOption = document.createElement('option');
        noneOption.value = ''; // Valor vazio para indicar "Nenhum"
        noneOption.textContent = 'Nenhum';
        select.appendChild(noneOption);

        // Filtra os grupos que começam com o bandId respectivo
        const filteredGroups = grupos.filter(grupo => grupo.startsWith(`${bandId}_`));

        // Cria as opções de select, exibindo o nome do grupo sem o prefixo bandId_
        filteredGroups.forEach(grupo => {
            const option = document.createElement('option');
            option.value = grupo; // Mantém o valor completo para salvar
            option.textContent = grupo.replace(`${bandId}_`, ''); // Remove o prefixo apenas para exibição
            select.appendChild(option);
        });

        // Define o grupo salvo ou a opção "Nenhum" como selecionada
        const savedGroup = GM_getValue(`${bandId}_song_${songId}_group`, ''); // Padrão é vazio ("Nenhum")
        select.value = savedGroup;

        select.addEventListener('change', () => {
            const selectedGroup = select.value;

            if (selectedGroup) {
                // Salva o grupo selecionado
                GM_setValue(`${bandId}_song_${songId}_group`, selectedGroup);
                console.log(`Salvando grupo: ${songName}, Grupo: ${selectedGroup}`);

                // Move a música para o grupo selecionado
                if (accordionMap[selectedGroup]) {
                    accordionMap[selectedGroup].appendChild(row);
                }
            } else {
                // Remove do grupo e retorna à tabela original
                GM_setValue(`${bandId}_song_${songId}_group`, '');
                console.log(`Removendo grupo da música: ${songName}`);

                // Move a linha de volta para o tbody original da tabela
                const originalTableBody = document.getElementById('tablesongs').querySelector('tbody');
                originalTableBody.appendChild(row);
            }
        });

        return select;
    }


    // Função principal que inicializa a tabela e seus componentes
    function initializeTable() {
        const table = document.getElementById('tablesongs');
        if (table) {
            const tbody = table.querySelector('tbody');
            const thead = table.querySelector('thead');
            if (thead) {
                addTableHeader(thead);
            }
            const accordionMap = createAccordions(tbody);
            addSelectBoxesToRows(tbody, accordionMap);
        }
    }

    // Função para remover as linhas que não foram atribuídas a nenhum accordion


    // Função principal que chama todas as outras
    function main() {
        initializeTable();
    }

    // Chamada da função principal
    main();
});
