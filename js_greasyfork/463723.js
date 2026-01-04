// ==UserScript==
// @name        Tamaguchi Footmundo
// @description adiciona um ping pong nos itens do footmundo
// @namespace   Vicente Ayuso
// @author      Vicente Ayuso
// @match       https://www.footmundo.com/jogador/*
// @grant       none
// @run-at      document-idle
// @license     MIT
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/463723/Tamaguchi%20Footmundo.user.js
// @updateURL https://update.greasyfork.org/scripts/463723/Tamaguchi%20Footmundo.meta.js
// ==/UserScript==

$(document).ready(function () {
    const pets = [
        {
            id: 80726,    //ID Do pet encontrado no link da pagina dele
            nome: 'Léia'  // Nome do pet
        },

      // -------------------- PARA ADICIONAR MAIS PETS É SÓ APAGAR O /* NO INICIO DO COLCHETE E */ NO FINAL DO COLCHETE

        /* APAGUE AQUI PARA ADICIONAR MAIS UM PET

         {
            id: 00001,
            nome: 'Laika'
        },
        

        */          //APAGUE AQUI PARA ADICIONAR MAIS UM PET


        /*              //APAGUE AQUI PARA ADICIONAR MAIS OUTRO PET

          {
            id: 00000,
            nome: 'Gertrudes'
        },

        */    //APAGUE AQUI PARA ADICIONAR MAIS OUTRO PET


       /*     //APAGUE AQUI PARA ADICIONAR MAIS OUTRO PET

         {
            id: 00002,
            nome: 'Melanie'
        },


        */      //APAGUE AQUI PARA ADICIONAR MAIS OUTRO PET

    ];

    // Criar div com class 'bloc' e id 'coluna'
    const coluna = $('<div class="bloc" id="coluna"></div>');

    // Criar div com class 'menu', id 'opcoes' e name 'tamaguchi'
    const opcoes = $('<div class="menu" id="opcoes" name="tamaguchi"></div>');

    // Criar header e h3 com id 'titulo'
    const header = $('<header></header>');
    const titulo = $('<h3 id="titulo">Seu Tamaguchi</h3>');
    header.append(titulo);

    // Criar ul com class 'lista-opcoes' e id 'ul-tamaguchi'
    const listaOpcoes = $('<ul class="lista-opcoes" id="ul-tamaguchi"></ul>');

    // Criar li com select e options baseadas no array de pets
    const liSelect = $('<li></li>');
    const petSelect = $('<select></select>');
    pets.forEach(pet => {
        petSelect.append(`<option value="${pet.id}">${pet.nome}</option>`);
    });
    liSelect.append(petSelect);

    // Criar os outros lis com links
    const liAlimentar = $('<li><a class="o1" name="alimentar" style="cursor:pointer">Alimentar</a></li>');
    const liLimpar = $('<li><a class="o1" name="limpar" style="cursor:pointer">Limpar</a></li>');
    const liBrincar = $('<li><a class="o1" name="brincar" style="cursor:pointer">Brincar</a></li>');
    const liRacao = $('<li><a class="o1" name="racao" style="cursor:pointer">Comprar Ração</a></li>');


    // Adicionar lis à ul
    listaOpcoes.append(liSelect, liAlimentar, liLimpar, liBrincar, liRacao);

    // Adicionar header e ul à div de opções
    opcoes.append(header, listaOpcoes);

    // Adicionar div de opções à div da coluna
    coluna.append(opcoes);

    // Inserir div da coluna na div de class 'right'
    $('div.right').append(coluna);

    // Função para alimentar o pet
    function alimentarPet(pet) {
        const iframeAlimentar = $('<iframe id="iframe-alimentar" style="display:none;"></iframe>');
        iframeAlimentar.attr('src', `https://www.footmundo.com/item/${pet.id}`);
        $('body').append(iframeAlimentar);

        iframeAlimentar.on('load', function () {
            const iframeContent = iframeAlimentar.contents();
            const alimentarButton = iframeContent.find('input[type="submit"][value="Alimentar"]');

            if (alimentarButton.length > 0) {
                alimentarButton.click();
                iframeAlimentar.on('load', function () {
                    alert(`Você alimentou ${pet.nome}`);
                    iframeAlimentar.remove();
                    location.reload();
                });
            }
        });
    }
    //Função de limpar
    function limparPet(pet) {
        const iframeLimpar = $('<iframe id="iframe-limpar" style="display:none;"></iframe>');
        iframeLimpar.attr('src', `https://www.footmundo.com/item/${pet.id}`);
        $('body').append(iframeLimpar);

        iframeLimpar.on('load', function () {
            const iframeContent = iframeLimpar.contents();
            const limparButton = iframeContent.find('input[type="submit"][value="Limpar"]');

            if (limparButton.length > 0) {
                limparButton.click();
                iframeLimpar.on('load', function () {
                    alert(`Você limpou ${pet.nome}`);
                    iframeLimpar.remove();
                    location.reload();
                });
            }
        });
    }

    //Função de brincar
    function brincarPet(pet) {
        const iframeBrincar = $('<iframe id="iframe-brincar" style="display:none;"></iframe>');
        iframeBrincar.attr('src', `https://www.footmundo.com/item/${pet.id}`);
        $('body').append(iframeBrincar);

        iframeBrincar.on('load', function () {
            const iframeContent = iframeBrincar.contents();
            const brincarButton = iframeContent.find('input[type="submit"][value="Brincar"]');

            if (brincarButton.length > 0) {
                brincarButton.click();
                iframeBrincar.on('load', function () {
                    alert(`Você brincou com ${pet.nome}`);
                    iframeBrincar.remove();
                    location.reload();
                });
            }
        });
    }





    liAlimentar.on('click', function () {
        const selectedPetId = petSelect.val();
        const selectedPet = pets.find(pet => pet.id === parseInt(selectedPetId));
        alimentarPet(selectedPet);
    });
    liLimpar.on('click', function () {
        const selectedPetId = petSelect.val();
        const selectedPet = pets.find(pet => pet.id === parseInt(selectedPetId));
        limparPet(selectedPet);
    });

    liBrincar.on('click', function () {
        const selectedPetId = petSelect.val();
        const selectedPet = pets.find(pet => pet.id === parseInt(selectedPetId));
        brincarPet(selectedPet);
    });
    liRacao.on('click', function () {
        alert("Ainda não foi implementado");
    });


});
