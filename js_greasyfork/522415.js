// ==UserScript==
// @name         Exibir Tabela de Arquivos no Brupload
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Brupload folder grid
// @author       klaboratories
// @match        https://www.brupload.net/users/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522415/Exibir%20Tabela%20de%20Arquivos%20no%20Brupload.user.js
// @updateURL https://update.greasyfork.org/scripts/522415/Exibir%20Tabela%20de%20Arquivos%20no%20Brupload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para criar a estrutura da tabela
    function createTable() {
        const table = document.createElement('table');
        table.classList.add('tbl1');
        table.style.width = '100%';
        const tbody = document.createElement('tbody');
        const headerRow = document.createElement('tr');

        // Cabeçalhos da tabela
        const headers = ['', '#', 'Link', 'File', 'Date', 'Size', 'User'];
        headers.forEach((headerText, index) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);

            // Se for o primeiro #, adicionar um checkbox para marcar todos os links
            if (index === 0) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = 'selectAllLinks';
                checkbox.addEventListener('change', function() {
                    const checkboxes = document.querySelectorAll('.file-checkbox');
                    checkboxes.forEach(cb => {
                        cb.checked = checkbox.checked;
                    });
                });
                th.appendChild(checkbox);
            }
        });

        tbody.appendChild(headerRow);
        table.appendChild(tbody);

        return { table, tbody };
    }

    // Função para preencher a tabela com os dados
    function populateTable(tbody) {
        const user = window.location.pathname.split('/')[2];  // Pega o nome de usuário na URL
        const rows = document.querySelectorAll('#files_list tr');
        let counter = 1;  // Contador para as linhas

        rows.forEach(row => {
            const tdData = row.querySelectorAll('td');
            tdData.forEach(td => {
                const tr = document.createElement('tr');
                const checkboxTd = document.createElement('td');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.classList.add('file-checkbox');
                checkboxTd.appendChild(checkbox);
                tr.appendChild(checkboxTd);

                const counterTd = document.createElement('td');
                counterTd.textContent = counter++;
                tr.appendChild(counterTd);

                const linkTd = document.createElement('td');
                const link = td.querySelector('.link a');
                if (link) {
                    linkTd.innerHTML = `<a href="${link.href}" target="_blank">${link.href}</a>`;
                    //linkTd.innerHTML = `<a href="${link.href}" target="_blank">${link.textContent}</a>`;
                } else {
                    linkTd.textContent = "N/A";  // Caso o link não exista
                }
                tr.appendChild(linkTd);

                const fileTd = document.createElement('td');
                fileTd.textContent = link ? link.textContent || 'N/A' : 'N/A';
                tr.appendChild(fileTd);

                const sizeTd = document.createElement('td');
                const size = td.textContent.trim().split('\n')[2];  // Pega o tamanho do arquivo
                sizeTd.textContent = size || 'N/A';
                tr.appendChild(sizeTd);

                const dateTd = document.createElement('td');
                const date = td.textContent.trim().split('\n')[1];  // Pega a data de envio
                dateTd.textContent = date || 'N/A';
                tr.appendChild(dateTd);

                const userTd = document.createElement('td');
                userTd.textContent = user || 'N/A';  // Usando o nome do usuário extraído da URL
                tr.appendChild(userTd);

                tbody.appendChild(tr);
            });
        });
    }

    // Função para exibir a tabela na página
    function displayTable() {
        const filesList = document.querySelector('#files_list');
        if (filesList) {
            const { table, tbody } = createTable();
            populateTable(tbody);

            // Substitui o conteúdo atual pela tabela
            filesList.innerHTML = '';  // Limpa o conteúdo atual da página
            filesList.appendChild(table);

            // Adiciona os botões abaixo da tabela
            addCopyButtons(filesList);
        } else {
            console.error('Elemento #files_list não encontrado');
        }
    }

    // Função para adicionar os botões "COPIAR LINKS NORMAIS" e "COPIAR LINKS DIRETOS"
    function addCopyButtons(container) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.marginTop = '20px';

        const copyNormalBtn = document.createElement('button');
        copyNormalBtn.textContent = 'COPIAR LINKS NORMAIS';
        copyNormalBtn.classList.add('copyButton');
        copyNormalBtn.addEventListener('click', copyLinks);

        const copyDirectBtn = document.createElement('button');
        copyDirectBtn.textContent = 'COPIAR LINKS DIRETOS';
        copyDirectBtn.classList.add('copyButton');
        copyDirectBtn.addEventListener('click', copyLinks);

        const copyGetBtn = document.createElement('button');
        copyGetBtn.textContent = 'GERAR LINKS';
        copyGetBtn.classList.add('copyButton');
        copyGetBtn.addEventListener('click', generateLinks);

        buttonContainer.appendChild(copyNormalBtn);
        //buttonContainer.appendChild(copyDirectBtn);
        buttonContainer.appendChild(copyGetBtn);

        // Criar o container do textarea dentro da div dos botões
        const textareaContainer = document.createElement('div');
        textareaContainer.id = 'textareaContainer';
        buttonContainer.appendChild(textareaContainer);

        container.appendChild(buttonContainer);
    }

    // Função para copiar os links selecionados
    function copyLinks() {
        const selectedLinks = [];
        const checkboxes = document.querySelectorAll('.file-checkbox:checked');

        checkboxes.forEach(checkbox => {
            const linkTd = checkbox.closest('tr').querySelector('td:nth-child(3) a');
            if (linkTd) {
                selectedLinks.push(linkTd.href);
            }
        });

        if (selectedLinks.length > 0) {
            // Copiar os links para a área de transferência
            const textToCopy = selectedLinks.join('\n');
            const textarea = document.createElement('textarea');
            textarea.value = textToCopy;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Links copiados com sucesso!');
        } else {
            alert('Nenhum link selecionado.');
        }
    }

    // Função para gerar os links e exibi-los em um textarea dentro da div de botões
    function generateLinks() {
        const selectedLinks = [];
        const checkboxes = document.querySelectorAll('.file-checkbox:checked');

        checkboxes.forEach(checkbox => {
            const linkTd = checkbox.closest('tr').querySelector('td:nth-child(3) a');
            if (linkTd) {
                selectedLinks.push(linkTd.href);
            }
        });

        // Criar e exibir o textarea com os links gerados dentro do container de botões
        const textareaContainer = document.querySelector('#textareaContainer');

        if (textareaContainer) {
            let textarea = textareaContainer.querySelector('#generatedLinks');
            if (!textarea) {
                textarea = document.createElement('textarea');
                textarea.id = 'generatedLinks';
                textarea.style.width = '100%';
                textarea.style.height = '200px';
                textareaContainer.appendChild(textarea);
            }

            if (selectedLinks.length > 0) {
                const textToShow = selectedLinks.join('\n');
                textarea.value = textToShow;
            } else {
                alert('Nenhum link selecionado.');
            }
        }
    }

    // Função para verificar e aplicar a conversão da grade para lista periodicamente
    function checkAndConvert() {
        const filesList = document.querySelector('#files_list');
        if (filesList && !filesList.querySelector('table')) {
            displayTable();  // Converte para a tabela lista
        }
    }

    // Configura o loop que verifica a cada 100 milissegundos se a grade foi carregada
    setInterval(checkAndConvert, 100);

})();
