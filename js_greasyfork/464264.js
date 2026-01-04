// ==UserScript==
// @name         Reabastecedor de estoque
// @namespace    Vicente Ayuso
// @version      1.2
// @description  Reabastecedor de estoque para footmundo.com
// @author       Vicente Ayuso
// @match        https://www.footmundo.com/locais-controlados/empresa/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464264/Reabastecedor%20de%20estoque.user.js
// @updateURL https://update.greasyfork.org/scripts/464264/Reabastecedor%20de%20estoque.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Verificar se a página contém o texto especificado
    if ($("span:contains('A companhia')").length > 0) {

        // Criar a div com class "bloc"
        const blocDiv = $('<div>', { class: 'bloc' });
        const boxDiv = $('<div>', { class: 'box', id: 'conteudo' , name:'script-restoque'});

        // Criar um header com um h3 texto
        const header = $('<header>');
        const tituloH3 = $('<h3>', { class: 'titulo', text: 'Reabastecedor de estoque' });
        const span1 = $('<span>', {text:'LEMBRE-SE DE MARCAR A OPÇÃO "NADA" PARA LOCAIS QUE NÃO TENHAM DINHEIRO OU O DINHEIRO ESTÁ NEGATIVO'});

        // Adicionar o h3 ao header
        header.append(tituloH3);

        // Adicionar o header e a div boxDiv à div com class "bloc"
        blocDiv.append(header);
        blocDiv.append(boxDiv);
        boxDiv.append(span1);

        // Adicionar duas quebras de linha após o span
        const breakLine1 = $('<br>');
        const breakLine2 = $('<br>');
        boxDiv.append(breakLine1);
        boxDiv.append(breakLine2);

        // Remover o text-shadow dos elementos span
        $('span').css({
            'text-shadow': 'none'
        });

        // Encontrar a div com classe "titulo-pagina" e adicionar a div com classe "center" após ela
        const centerDiv = $('<div>', { class: 'center' });
        $(".titulo-pagina").after(centerDiv);

        // Adicionar a div com classe "bloc" dentro da div com classe "center"
        centerDiv.append(blocDiv);

        // Armazenar o id e o nome do local
        const locais = [];

        // Encontrar a tabela com a class "padrao"
        const tabelaPadrao = $('table.padrao');

        // Iterar sobre as linhas da tabela, ignorando a primeira (cabeçalho)
        tabelaPadrao.find('tr:not(:first)').each(function() {
            // Encontrar a tag <a> dentro da linha
            const aTag = $(this).find('a');

            // Extrair o nome do local e o id do local
            const nomeDoLocal = aTag.text();
            const idDoLocal = aTag.attr('href').split('/').pop();

            // Adicionar o id e o nome do local à array "locais"
            locais.push({ id: idDoLocal, nome: nomeDoLocal });
        });

      console.log(locais);






    // Criar o label e o input number
    const quantidadeLabel = $('<label>', { text: 'Informe a quantidade dos itens a serem reabastecidos: ' });
    const quantidadeInput = $('<input>', { type: 'number', id: 'quantidadeItens', min: '1' });

    // Adicionar o label e o input number ao boxDiv
    boxDiv.append(quantidadeLabel);
    boxDiv.append(quantidadeInput);

    // Adicionar uma quebra de linha após o input number
    const breakLine3 = $('<br>');
    boxDiv.append(breakLine3);

    // Criar o botão com a classe "btn_padrao"
    const iniciarAbastecimentoBtn = $('<button>', { id:"reabastecer", class: 'btn_padrao', text: 'Iniciar abastecimento' });
    // Adicionar o botão ao boxDiv
    boxDiv.append(iniciarAbastecimentoBtn);
    // Criar o botão com a classe "btn_padrao"
    const ReformarLocaisBtn = $('<button>', { id:"reformar", class: 'btn_padrao', text: 'Iniciar Reformas' });
    // Adicionar o botão ao boxDiv
    boxDiv.append(ReformarLocaisBtn);


    // Adicionar uma nova coluna no cabeçalho da tabela
    const thNovaColunaSelect = $('<th>', { text: 'Categoria' });
    tabelaPadrao.find('tr:first').append(thNovaColunaSelect);

    // Lista de opções para o select
    const categorias = [
      {
        nome: 'Nada',
        produtos: []
      },
      {
        nome: 'Artigos pirotécnicos',
        produtos: ['Fogos de artifício']
      },
      {
        nome: 'Bebidas',
        produtos: [
          "Água",
          "Cachaça",
          "Cerveja",
          "Champanhe",
          "Chocolate Quente",
          "Milk-shake",
          "Uísque",
          "Vinho",
          "Vodka"
        ]
      },
      {
        nome: 'Brinquedos',
        produtos: [
          "Arma de Paintball",
          "Bate-bola",
          "Bola de futebol",
          "Máscara de Halloween",
          "Munições para Paintball",
          "Ursinho de pelúcia"
        ]
      },
      {
        nome: 'Calçados',
        produtos: [
          "Chuteiras",
          "Salto Alto",
          "Sapato"
        ]
      },
      {
        nome: 'Cartões comemorativos',
        produtos: [
          "Cartão de Dia dos Namorados"
        ]
      },
      {
        nome: 'Comidas',
        produtos: [
          "Cachorro-Quente",
          "Hambúrguer",
          "Pão de Queijo",
          "Pizza",
          "Sushi"
        ]
      },
      {
        nome: 'Doces',
        produtos: [
          "Alfajor",
          "Algodão Doce",
          "Barra de Chocolate",
          "Bem-casado",
          "Bolo de aniversário",
          "Brigadeiro",
          "Caixa de Bombom",
          "Coelhinho de chocolate",
          "Donut",
          "Flan",
          "Macaron",
          "Ovo de chocolate",
          "Sorvete",
          "Torta"
        ]
      },
      {
        nome: 'Eletrônicos',
        produtos: [
          "Câmera fotográfica",
          "Filme para Câmera fotográfica",
          "Lanterna"
        ]
      },
      {
        nome: 'Equipamentos esportivos',
        produtos: [
          "Capacete",
          "Cilindro de Ar Comprimido",
          "Máscara de Mergulho",
          "Nadadeiras de Mergulho",
          "Roupa de Mergulho"
        ]
      },
      {
        nome: 'Ferramentas',
        produtos: [
          "Alicate",
          "Marreta",
          "Pá"
        ]
      },
      {
        nome: 'Frutas',
        produtos: [
          "Açaí",
          "Abacate",
          "Abacaxi",
          "Abóbora",
          "Abiu",
          "Acerola",
          "Amêndoa",
          "Ameixa",
          "Amora",
          "Anona",
          "Arando",
          "Avelã",
          "Banana",
          "Cacau",
          "Cajá",
          "Caju",
          "Caqui",
          "Carambola",
          "Castanha",
          "Castanha-do-pará",
          "Cereja",
          "Coco",
          "Cranberry",
          "Cupuaçu",
          "Damasco",
          "Dendê",
          "Figo",
          "Framboesa",
          "Fruta-do-conde",
          "Goiaba",
          "Graviola",
          "Groselha",
          "Guaraná",
          "Imbu",
          "Jabuticaba",
          "Jaca",
          "Jambo",
          "Jamelão",
          "Jenipapo",
          "Kiwi",
          "Laranja",
          "Limão",
          "Maçã",
          "Macadâmia",
          "Mamão",
          "Manga",
          "Maracujá",
          "Marmelo",
          "Melancia",
          "Melão",
          "Mirtilo",
          "Morango",
          "Noz",
          "Pêssego",
          "Pequi",
          "Pera",
          "Pinha",
          "Pistache",
          "Pitaia",
          "Pitanga",
          "Romã",
          "Sapucaia",
          "Seriguela",
          "Tamarindo",
          "Tangerina",
          "Tomate",
          "Toranja",
          "Tucumã",
          "Uva"
        ]
      },
      {
        nome: 'Instrumentos musicais',
        produtos: [
          "Violão"
        ]
      },
      {
        nome: 'Joias e Acessórios',
        produtos: [
          "Anel",
          "Anel de noivado",
          "Brinco",
          "Colar",
          "Pulseira"
        ]
      },
      {
        nome: 'Legumes e verduras',
        produtos: [
          "Abobrinha",
          "Acelga",
          "Agrião",
          "Aipo",
          "Alcachofra",
          "Alcaparra",
          "Alecrim",
          "Alface",
          "Alfafa",
          "Alfavaca",
          "Alho",
          "Alho-poró",
          "Almeirão",
          "Amaranto",
          "Amendoim",
          "Andu",
          "Arachachá",
          "Arroz",
          "Aspargo",
          "Aveia",
          "Azedinha",
          "Azeitona",
          "Batata",
          "Batata-baroa",
          "Batata-doce",
          "Berinjela",
          "Beterraba",
          "Brócolis",
          "Cambuquira",
          "Capeba",
          "Caruru",
          "Cebola",
          "Cebolinha",
          "Cenoura",
          "Centeio",
          "Cevada",
          "Chaya",
          "Chia",
          "Chicória",
          "Chichá",
          "Chuchu",
          "Coentro",
          "Couve",
          "Couve-de-bruxelas",
          "Couve-flor",
          "Couve-rábano",
          "Cumaru",
          "Echalota",
          "Embaúba",
          "Endívia",
          "Erva-cidreira",
          "Erva-doce",
          "Erva-mate",
          "Ervilha",
          "Escarola",
          "Espinafre",
          "Fava",
          "Feijão",
          "Feijão-branco",
          "Gengibre",
          "Gergelim",
          "Grão-de-bico",
          "Hibisco",
          "Hortelã",
          "Inhame",
          "Jiló",
          "Lentilha",
          "Linhaça",
          "Louro",
          "Malte",
          "Mandioca",
          "Manjericão",
          "Maxixe",
          "Milho",
          "Mostarda",
          "Nabo",
          "Orégano",
          "Palmito",
          "Pepino",
          "Pimenta",
          "Pimenta-jalapeño",
          "Pimenta-malagueta",
          "Pimentão",
          "Quiabo",
          "Quinoa",
          "Rabanete",
          "Rábano",
          "Rábano-silvestre",
          "Rúcula",
          "Repolho",
          "Salsa",
          "Semente de girassol",
          "Soja",
          "Taioba",
          "Tomate-cereja",
          "Tomilho",
          "Trigo",
          "Urtiga",
          "Vagem"
        ]
      },

      {
        nome: 'Livros',
        produtos: [
          "Aprenda a tocar bateria",
          "Aprenda a tocar violão",
          "Arte do grafite",
          "Básico de Artes & Design",
          "Básico de biologia",
          "Básico de Botânica",
          "Básico de ciências",
          "Básico de dança",
          "Básico de engenharia",
          "Básico de fotografia",
          "Ciência: Estudos Avançados",
          "Como adestrar seu animal",
          "Como criar filhos felizes",
          "Como Ser Um Técnico",
          "Didática básica",
          "Economia: Do básico ao avançado",
          "Engenharia avançada",
          "Farmacologia Avançada",
          "Farmacologia para Iniciantes",
          "Fugir não é covardia",
          "Fundamentos da percussão",
          "Guia de natação",
          "Kamasutra",
          "Manual do mergulhador",
          "Medicina Avançada",
          "Medicina Básica",
          "Minhas primeiras cordas",
          "Pontaria de elite",
          "Religiões",
          "Sendo Um Estrategista",
          "Táticas Diversas",
          "Técnicas de canto",
          "Técnicas de escalada",
          "Torne-se um Líder",
          "Vida Política"
        ]
      },
      {
        nome: 'Materiais para artes',
        produtos: [
          "Lata de spray"
        ]
      },
      {
        nome: 'Objetos comuns',
        produtos: [
          "Caixa vazia",
          "Corda"
        ]
      },
      {
        nome: 'Plantas e árvores',
        produtos: [
          "Rosa"
        ]
      },
      {
        nome: 'Roupas',
        produtos: [
          "Bermuda",
          "Blusa",
          "Boné",
          "Calça",
          "Calcinha",
          "Camisa",
          "Camiseta",
          "Casaco",
          "Colete",
          "Cueca",
          "Fantasia",
          "Fralda",
          "Gravata",
          "Jaqueta",
          "Macacão",
          "Meia",
          "Minissaia",
          "Paletó",
          "Saia",
          "Sobretudo",
          "Sutiã",
          "Vestido",
          "Vestido de noiva"
        ]
      }
    ];



    // Iterar sobre as linhas da tabela, ignorando a primeira (cabeçalho)
    tabelaPadrao.find('tr:not(:first)').each(function(index) {
        // Criar o elemento select e adicionar as opções
        const selectCategoria = $('<select>', { class: 'select-categoria' });

        categorias.forEach(function(categoria) {
            const option = $('<option>', { value: categoria.nome, text: categoria.nome });
            selectCategoria.append(option);
        });


        // Restaurar a opção selecionada do localStorage
        const categoriaSelecionada = localStorage.getItem(`categoriaSelecionada${index}`);
        if (categoriaSelecionada) {
            selectCategoria.val(categoriaSelecionada);
        }

        // Criar uma nova célula (td) e adicionar o elemento select dentro dela
        const tdNovaColunaSelect = $('<td>');
        tdNovaColunaSelect.append(selectCategoria);

        // Adicionar a nova célula à linha atual
        $(this).append(tdNovaColunaSelect);
    });

    // Armazenar a opção selecionada no localStorage quando o usuário alterar o valor do select
    $('.select-categoria').on('change', function() {
        const index = $('.select-categoria').index(this);
        const categoriaSelecionada = $(this).val();
        localStorage.setItem(`categoriaSelecionada${index}`, categoriaSelecionada);
    });


    function filtrarTrsPorProduto(trs, produtos) {
        return trs.filter((_, tr) => {
            const trElement = $(tr);
            const aTag = trElement.find('a');
            const produtoNome = aTag.text().trim();
            return produtos.includes(produtoNome);
        });
    }
    function waitForIframeLoad(iframe, timeout = 3000) {
        return new Promise((resolve) => {
            iframe.on('load', () => {
                setTimeout(() => {
                    resolve();
                }, timeout);
            });
        });
    }

    async function reabastecerProdutos(iframe, quantidade, categoria, waitForIframeLoad) {
        return new Promise(async (resolve) => {
            let trIndex = 0;
            let completed = 0;
            let stopReabastecimento = false;
            const categoriaMapeamento = {
                "Bebidas": "13",  // Você já forneceu este mapeamento
                "Artigos pirotécnicos": "3",
                "Brinquedos": "20",
                "Calçados": "124",
                "Cartões comemorativos": "16",
                "Comidas": "25",
                "Doces": "35",
                "Eletrônicos": "40",
                "Equipamentos esportivos": "140",
                "Ferramentas": "95",
                "Frutas": "45",
                "Instrumentos musicais": "50",
                "Joias e Acessórios": "65",
                "Legumes e verduras": "47",
                "Livros": "80",
                "Materiais para artes": "90",
                "Objetos comuns": "99",
                "Plantas e árvores": "105",
                "Roupas": "120"
            };


            async function processNextTr() {
                if (stopReabastecimento) {
                    return;
                }

                const iframeWindow = iframe[0].contentWindow;
                const iframeDocument = iframeWindow.document;
                // Pegue o nome da categoria do segundo select
                const nomeCategoria = categoria.nome;  // ou como você estiver pegando isso

                // Use o objeto de mapeamento para obter o valor correto
                const valorCategoria = categoriaMapeamento[nomeCategoria];

                // Selecione a categoria correta no primeiro select
                const selectCategoria = $(iframeDocument).find('select[name="itens_categoria"]');
                selectCategoria.val(valorCategoria);

                // 2. Clique no botão "Buscar"
                const btnBuscar = $(iframeDocument).find('input[name="buscar_categoria"]');
                btnBuscar.click();

                // 3. Aguarde a recarga do iframe após clicar no botão Buscar
                await waitForIframeLoad(iframe);
                const iframeWindow2 = iframe[0].contentWindow;
                const iframeDocument2 = iframeWindow2.document;

                const todasTrs = $(iframeDocument2).find('tr.linha, tr:not(.linha)');
                const produtos = categoria.produtos; // Obter os produtos da categoria selecionada
                const trsProdutos = filtrarTrsPorProduto(todasTrs, produtos);

                console.log('Produtos para reabastecer:', produtos);
                console.log('trsProdutos.length:', trsProdutos.length);

                if (completed === trsProdutos.length) {
                    // Todas as TRs foram processadas e o reabastecimento foi finalizado
                    resolve(); // Adicione esta chamada de resolve()
                    return;
                }

                const tr = trsProdutos[trIndex];
                const inputNumber = $(tr).find('input[type="number"]');
                const inputImage = $(tr).find('input[type="image"]');

                inputNumber.val(quantidade);
                inputImage.click();

                trIndex++;
                completed++;

                // Aguardar o carregamento do iframe antes de processar a próxima TR
                await waitForIframeLoad(iframe);
                processNextTr();
            }

            await waitForIframeLoad(iframe);
            processNextTr();
        });
    }




        // Adicionar evento de clique ao botão de id "reabastecer"
        $('#reabastecer').on('click', async function() {
            const quantidade = $('#quantidadeItens').val();

            const locaisSelecionados = [];

            // Iterar sobre as linhas da tabela, ignorando a primeira (cabeçalho)
            tabelaPadrao.find('tr:not(:first)').each(function(index) {
                // Encontrar o elemento select dentro da linha
                const selectCategoria = $(this).find('.select-categoria');

                // Obter a categoria selecionada
                const categoriaSelecionada = selectCategoria.val();

                // Adicionar o id, nome do local, categoria selecionada e link ao array "locaisSelecionados"
                locaisSelecionados.push({
                    id: locais[index].id,
                    nome: locais[index].nome,
                    categoria: categoriaSelecionada,
                    link: `https://www.footmundo.com/estoque-produtos/local/${locais[index].id}`
                });
            });

            // Exibir o array "locaisSelecionados" no console
            console.log(locaisSelecionados);

            // Criar um iframe com o link do primeiro local da lista
            const iframe = $('<iframe>', {
                src: locaisSelecionados[0].link,
                width: '1000px',
                height: '600px',
                style: 'border: 1px solid #000;'
            });

            // Adicionar o iframe ao boxDiv
            boxDiv.append(iframe);
            // Adicione um contador para os locais processados
            let locaisProcessados = 0;

            for (let local of locaisSelecionados) {
                const categoriaSelecionada = categorias.find(c => c.nome === local.categoria);

                // Se a categoria selecionada for "Nada", pule para a próxima iteração do loop
                if (categoriaSelecionada.nome === 'Nada') {
                    locaisProcessados++; // Incrementar o contador de locais processados
                    continue;
                }

                // Se a categoria não for encontrada, pule para a próxima iteração do loop
                if (!categoriaSelecionada) {
                    locaisProcessados++; // Incrementar o contador de locais processados
                    continue;
                }

                const produtosSelecionados = categoriaSelecionada.produtos;
                iframe.attr('src', local.link);

                await reabastecerProdutos(iframe, quantidade, categoriaSelecionada, waitForIframeLoad);

                // Incrementar o contador de locais processados
                locaisProcessados++;

                // Verificar se todos os locais foram processados
                if (locaisProcessados === locaisSelecionados.length) {
                    alert('Reabastecimento de estoque finalizado!');
                }
            }

        });
      // Adicionar evento de clique ao botão de id "reformar"
      $('#reformar').on('click', async function() {
          // Criar a lista de links com os ids dos locais
          const links = locais.map(local => `https://www.footmundo.com/reformar/local/${local.id}`);

          // Função para reformar um local
          // Função para reformar um local
          async function reformarLocal(index, iframe) {
              if (index >= links.length) {
                  alert('Todas as reformas foram finalizadas.'); // Adicionar alerta ao finalizar todos os links
                  location.reload()
                  return; // Finaliza a função se todos os links foram processados
              }

              // Atualizar a src do iframe com o link da lista baseado no índice fornecido
              iframe.attr('src', links[index]);

              iframe.off('load').on('load', async () => {
                  const iframeWindow = iframe[0].contentWindow;
                  const iframeDocument = iframeWindow.document;

                  // Encontrar o input submit com o nome "reformar" e clicar nele
                  const inputSubmit = $(iframeDocument).find('input[type="submit"][name="reformar"]');
                  inputSubmit.click();

                  // Chamar a função reformarLocal novamente com o próximo índice após 3 segundos
                  setTimeout(() => {
                      reformarLocal(index + 1, iframe);
                  }, 1000);
              });
          }

          // Criar um iframe
          const iframe = $('<iframe>', {
              width: '1000px',
              height: '600px',
              style: 'border: 1px solid #000;'
          });

          // Adicionar o iframe ao boxDiv
          boxDiv.append(iframe);

          // Iniciar o processo de reforma
          reformarLocal(0, iframe);
      });


}})();