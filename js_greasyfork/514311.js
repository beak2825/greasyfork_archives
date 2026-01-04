// ==UserScript==
// @name         Quick Bar - For Console Scripts -TribalWars
// @version      1.0
// @description  Add a pivot table at the top of the game page and allow you to add shortcuts to run console scripts.
// @author       StonyBaboon
// @match        *://*/game.php?*village=*
// @grant        none
// @license CC BY-NC-ND 4.0
// @namespace https://greasyfork.org/users/1378628
// @downloadURL https://update.greasyfork.org/scripts/514311/Quick%20Bar%20-%20For%20Console%20Scripts%20-TribalWars.user.js
// @updateURL https://update.greasyfork.org/scripts/514311/Quick%20Bar%20-%20For%20Console%20Scripts%20-TribalWars.meta.js
// ==/UserScript==


// Function to insert the table above the specified <br>, if the table does not exist
function inserirTabelaAcima() {
    // Check if the table with the ID "quickbar_inner" already exists
    if (!document.getElementById('quickbar_inner')) {
        // Select the <br> element with the class "newStyleOnly"
        var referenceBr = document.querySelector('br.newStyleOnly');

        // Check if the reference element was found
        if (referenceBr) {
            // Create the new table element
            var novaTabela = document.createElement('table');
            novaTabela.id = 'quickbar_inner';
            novaTabela.style.borderCollapse = 'collapse';
            novaTabela.style.width = '100%';
            novaTabela.style.backgroundImage = 'url(https://dspt.innogamescdn.com/asset/1e5b6b81/graphic/index/main_bg.jpg)';
            novaTabela.innerHTML = `
                <br><tbody>
                    <tr class="topborder">
                        <td class="left"> </td>
                        <td class="main"> </td>
                        <td class="right"> </td>
                    </tr>
                    <tr>
                        <td class="left"> </td>
                        <td id="quickbar_contents" class="main">
                            <!-- The menu content will be inserted dynamically -->
                        </td>
                        <td class="right"> </td>
                    </tr>
                    <tr class="bottomborder">
                        <td class="left"> </td>
                        <td class="main" style="text-align: right;"> <!-- Right alignment -->
                            <!-- "+" button will be inserted here -->
                            <a href="#" id="addButton" class="btn">+</a>
                        </td>
                        <td class="right"> </td>
                    </tr>
                    <tr>
                        <td class="shadow" colspan="3">
                            <div class="leftshadow"> </div>
                            <div class="rightshadow"> </div>
                        </td>
                    </tr>
                </tbody>
            `;

            // Insert the new table above (before) the reference <br>
            referenceBr.parentNode.insertBefore(novaTabela, referenceBr);

            // Initialize the menu after the table is created
            inicializarMenu();
        }
    }
}

// Function to initialize the menu
function inicializarMenu() {
    // Clear the existing menu
    var menuContainer = document.getElementById('quickbar_contents');
    if (!menuContainer) {
        console.error("Element 'quickbar_contents' not found.");
        return;
    }
    menuContainer.innerHTML = '';

    // Retrieve saved items from localStorage
    var itensMenu = JSON.parse(localStorage.getItem('quickbarItens')) || [];

    // Add menu items
    itensMenu.forEach(function (item) {
        if (item.type === 'command') {
            adicionarItemMenu(item.text, item.imageUrl, item.command);
        } else if (item.type === 'break') {
            adicionarQuebraDeLinha();
        }
    });

    // Configure the "+" button to add new items
    configurarBotaoAdicionar();
}

// Function to configure the "+" button
function configurarBotaoAdicionar() {
    var addButton = document.getElementById('addButton');
    if (!addButton) {
        console.error("Add button not found.");
        return;
    }

    // Add click event to the "+" button
    addButton.addEventListener('click', function (e) {
        e.preventDefault();
        mostrarOpcoesAdicionar(e.clientX, e.clientY);
    });
}

// Function to show the add options
function mostrarOpcoesAdicionar(x, y) {
    // Remove previous options, if any
    var opcoesExistentes = document.getElementById('opcoesAdicionar');
    if (opcoesExistentes) {
        document.body.removeChild(opcoesExistentes);
    }

    var opcoesContainer = document.createElement('div');
    opcoesContainer.id = 'opcoesAdicionar';
    opcoesContainer.style.position = 'absolute';
    opcoesContainer.style.left = x + 'px';  // Align horizontally with the button
    opcoesContainer.style.top = (y + 20) + 'px';  // Place below the button
    opcoesContainer.style.background = '#f9f9f9';
    opcoesContainer.style.border = '1px solid #ccc';
    opcoesContainer.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    opcoesContainer.style.zIndex = '1000';

    var opcaoAdicionarComando = document.createElement('div');
    opcaoAdicionarComando.textContent = 'Add Command';
    opcaoAdicionarComando.style.padding = '10px';
    opcaoAdicionarComando.style.cursor = 'pointer';
    opcaoAdicionarComando.addEventListener('click', function () {
        adicionarNovoComando();
        document.body.removeChild(opcoesContainer);
    });

    var opcaoAdicionarQuebra = document.createElement('div');
    opcaoAdicionarQuebra.textContent = 'Add Line Break';
    opcaoAdicionarQuebra.style.padding = '10px';
    opcaoAdicionarQuebra.style.cursor = 'pointer';
    opcaoAdicionarQuebra.addEventListener('click', function () {
        adicionarQuebraDeLinha();
        salvarMenu();
        document.body.removeChild(opcoesContainer);
    });

    var opcaoCarregarArquivo = document.createElement('div');
    opcaoCarregarArquivo.textContent = 'Load Commands from File';
    opcaoCarregarArquivo.style.padding = '10px';
    opcaoCarregarArquivo.style.cursor = 'pointer';
    opcaoCarregarArquivo.addEventListener('click', function () {
        carregarComandosDeArquivo();
        document.body.removeChild(opcoesContainer);
    });

    var opcaoLimparMemoria = document.createElement('div');
    opcaoLimparMemoria.textContent = 'Clear Memory';
    opcaoLimparMemoria.style.padding = '10px';
    opcaoLimparMemoria.style.cursor = 'pointer';
    opcaoLimparMemoria.addEventListener('click', function () {
        if (confirm('Are you sure you want to clear the memory? This action cannot be undone.')) {
            limparMemoria();
            document.body.removeChild(opcoesContainer);
        }
    });

    var opcaoExportarTabela = document.createElement('div');
    opcaoExportarTabela.textContent = 'Export Table';
    opcaoExportarTabela.style.padding = '10px';
    opcaoExportarTabela.style.cursor = 'pointer';
    opcaoExportarTabela.addEventListener('click', function () {
        exportarTabela();
        document.body.removeChild(opcoesContainer);
    });

    opcoesContainer.appendChild(opcaoAdicionarComando);
    opcoesContainer.appendChild(opcaoAdicionarQuebra);
    opcoesContainer.appendChild(opcaoCarregarArquivo);
    opcoesContainer.appendChild(opcaoLimparMemoria); // Add the clear memory option
    opcoesContainer.appendChild(opcaoExportarTabela); // Add the export table option
    document.body.appendChild(opcoesContainer);
}

// Function to add a new command
function adicionarNovoComando() {
    var nome = prompt('Enter the command name:');
    if (!nome) return;

    var imagemUrl = prompt('Enter the image URL (optional):');
    var comando = prompt('Enter the command to be executed:');
    if (!comando) return;

    adicionarItemMenu(nome, imagemUrl, comando);
    salvarMenu();
}

// Function to load commands from a text file
function carregarComandosDeArquivo() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt';

    input.onchange = function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var linhas = e.target.result.split('\n');
                linhas.forEach(function (linha) {
                    var partes = linha.split(',');
                    if (partes.length === 3) {
                        var nome = partes[0].trim();
                        var comando = partes[1].trim();
                        var imagemUrl = partes[2].trim();
                        if (imagemUrl === '') imagemUrl = null; // If no image URL is provided
                        adicionarItemMenu(nome, imagemUrl, comando);
                    } else if (partes.length === 1 && partes[0].trim() === '') {
                        adicionarQuebraDeLinha(); // Blank line adds a break
                    }
                });
                salvarMenu();
            };
            reader.readAsText(file);
        }
    };
    input.click(); // Opens the file selector
}

// Function to add an item to the menu
function adicionarItemMenu(nome, imagemUrl, comando) {
    var menuContainer = document.getElementById('quickbar_contents');

    var novoItem = document.createElement('li');
    novoItem.className = 'quickbar_item';

    var link = document.createElement('a');
    link.className = 'quickbar_link';
    link.textContent = nome;
    link.setAttribute('data-comando', comando);
    link.onclick = function () {
        // Use eval to execute the JavaScript command directly
        try {
            eval(comando);
        } catch (error) {
            console.error(`Error executing the command: ${error}`);
        }
    };

    if (imagemUrl) {
        var imagem = document.createElement('img');
        imagem.src = imagemUrl;
        imagem.alt = nome;
        imagem.style.width = '15px'; // Set the image width
        imagem.style.height = '15px'; // Set the image height
        link.prepend(imagem); // Add the image before the name
    }

    novoItem.appendChild(link);
    menuContainer.appendChild(novoItem);
}

// Function to add a line break to the menu
function adicionarQuebraDeLinha() {
    var menuContainer = document.getElementById('quickbar_contents');
    var quebra = document.createElement('hr');
    menuContainer.appendChild(quebra);
}

// Function to execute a command
function executarComando(comando) {
    console.log(`Executing command: ${comando}`);
    // Here you can add the logic to execute the command
}

// Function to clear the menu memory
function limparMemoria() {
    localStorage.removeItem('quickbarItens');
    inicializarMenu(); // Reinitialize the menu after clearing memory
}

// Function to export the current table to a TXT file
function exportarTabela() {
    var itensMenu = [];
    var menuContainer = document.getElementById('quickbar_contents');

    menuContainer.childNodes.forEach(function (node) {
        if (node.tagName === 'LI') {
            var link = node.querySelector('.quickbar_link');
            var nome = link.textContent.trim();
            var comando = link.getAttribute('data-comando');
            var imagemUrl = link.querySelector('img') ? link.querySelector('img').src : '';

            // Add in the format: command name, command, image URL
            itensMenu.push(`${nome}, ${comando}, ${imagemUrl}`);
        } else if (node.tagName === 'HR') {
            itensMenu.push(''); // Add a blank line for breaks
        }
    });

    var textoParaSalvar = itensMenu.join('\n');

    // Create the text file
    var blob = new Blob([textoParaSalvar], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);

    // Create the download link
    var a = document.createElement('a');
    a.href = url;
    a.download = 'tabela_comandos.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Release the blob URL
}

// Function to save the menu in localStorage
function salvarMenu() {
    var itensMenu = [];
    var menuContainer = document.getElementById('quickbar_contents');

    menuContainer.childNodes.forEach(function (node) {
        if (node.tagName === 'LI') {
            var link = node.querySelector('.quickbar_link');
            var nome = link.textContent.trim();
            var imagemUrl = link.querySelector('img') ? link.querySelector('img').src : '';
            var comando = link.getAttribute('data-comando');

            itensMenu.push({ type: 'command', text: nome, imageUrl: imagemUrl, command: comando });
        } else if (node.tagName === 'HR') {
            itensMenu.push({ type: 'break' });
        }
    });

    localStorage.setItem('quickbarItens', JSON.stringify(itensMenu));
}

// Call the function to insert the table and initialize the menu
inserirTabelaAcima();