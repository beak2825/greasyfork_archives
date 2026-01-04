// ==UserScript==
// @name         Preço Total - Mercado Livre
// @namespace    MercadoLivreBest
// @version      13
// @description  Veja o preço final total no mercado livre antes de comprar um produto.Opcional = Automaticamente mostra os resultados no modo lista e organiza pelo menor preço.Mostra se o vendedor é bom (nível verde) e recomendado pelo ML ou não.
// @author       hacker09
// @match        https://*.mercadolivre.com.br/*
// @match        https://produto.mercadolivre.com.br/*
// @icon         https://http2.mlstatic.com/frontend-assets/ui-navigation/5.11.0/mercadolibre/favicon.svg
// @require      https://update.greasyfork.org/scripts/519092/arrivejs%20%28Latest%29.js
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/418312/Pre%C3%A7o%20Total%20-%20Mercado%20Livre.user.js
// @updateURL https://update.greasyfork.org/scripts/418312/Pre%C3%A7o%20Total%20-%20Mercado%20Livre.meta.js
// ==/UserScript==
(function() {
  GM_registerMenuCommand("Desativar/Ativar Modo Lista Automatico", AutoAtivarModoLista); //Adiciona uma opcao no menu
  GM_registerMenuCommand("Desativar/Ativar Listar  Pelo Menor Preço", OrganizarListaPeloMenorPreco); //Adiciona uma opcao no menu
  if (GM_getValue("AutoAtivarModoLista") !== true && GM_getValue("AutoAtivarModoLista") !== false) { //Se o valor nao for existente,defina como true
    GM_setValue("AutoAtivarModoLista", true); //Define a variavel como true
  } //Termina a condicao if
  if (GM_getValue("OrganizarListaPeloMenorPreco") !== true && GM_getValue("OrganizarListaPeloMenorPreco") !== false) { //Se o valor nao for existente,defina como true
    GM_setValue("OrganizarListaPeloMenorPreco", true); //Define a variavel como true
  } //Termina a condicao if

  if (GM_getValue("CEP") === undefined) { //Se o usuario ainda nao tiver salvo o CEP no script
    var UserInput = prompt('Escreva seu CEP se deseja que o script salve-o e automaticamente o adicione ao mercado livre.\n*Escreva apenas numeros, por exemplo 11111111\nClique em OK ou Cancel se nao deseja que o script salve seu CEP.'); //Permitir que o usuario escolha uma opcao
    if (UserInput !== null) //Se o usuario escolheu salvar o CEP no script
    { //Inicia a condicao if
      GM_setValue("CEP", parseInt(UserInput)); //Salva o CEP do usuario
    } //Termina a condicao if
    else //Se o usuario nao quiser salvar o CEP
    { //Inicia a condicao else
      GM_setValue("CEP", ''); //Salva o CEP como "nada"
    } //Termina a condicao else
    document.cookie = 'cp=' + GM_getValue("CEP") + '; secure=true: session=true; path=/'; //Adiciona o CEP ao mercado livre
    location.reload(); //Recarrega a pagina
  } //Termina a condicao if
  else //Se o usuario tiver salvo o CEP no script
  { //Inicia a condicao else
    document.cookie = 'cp=' + GM_getValue("CEP") + '; secure=true: session=true; path=/'; //Adiciona o CEP ao mercado livre

    if (GM_getValue("CEP") !== '' && document.querySelectorAll("span.nav-menu-cp-send")[1] !== undefined && document.querySelectorAll("span.nav-menu-cp-send")[1].innerText === 'Informe seu') //Se o CEP esta salvo no script mas nao foi adicionado ao mercado livre
    { //Inicia a condicao if
      location.reload(); //Recarrega a pagina
    } //Termina a condicao if

  } //Termina a condicao else

  function AutoAtivarModoLista() //Funcao para AutoAtivarModoLista
  { //Inicia a funcao AutoAtivarModoLista
    if (GM_getValue("AutoAtivarModoLista") === true) { //Se a configuracao anterior for true,defina como false
      GM_setValue("AutoAtivarModoLista", false); //Define a variavel como false
    } //Termina a condicao if
    else { //Se a configuracao anterior for false, defina como true
      GM_setValue("AutoAtivarModoLista", true); //Define a variavel como true
      location.reload(); //Recarrega a pagina
    } //Termina a condicao else
  } //Encerra a funcao AutoAtivarModoLista
  function OrganizarListaPeloMenorPreco() //Funcao para OrganizarListaPeloMenorPreco
  { //Inicia a funcao OrganizarListaPeloMenorPreco
    if (GM_getValue("OrganizarListaPeloMenorPreco") === true) { //Se a configuracao anterior for true,defina como false
      GM_setValue("OrganizarListaPeloMenorPreco", false); //Define a variavel como false
    } //Termina a condicao if
    else { //Se a configuracao anterior for false, defina como true
      GM_setValue("OrganizarListaPeloMenorPreco", true); //Define a variavel como true
      location.reload(); //Recarrega a pagina
    } //Termina a condicao else
  } //Encerra a funcao OrganizarListaPeloMenorPreco

  if (document.querySelector("div.ui-search") !== null && GM_getValue("OrganizarListaPeloMenorPreco") === true) //Se o usuario estiver buscando um produto
  { //Inicia a condicao if
    document.querySelector("div.ui-search-sort-filter > div > div > div > ul > li:nth-child(2) > a").click(); //Organiza a lista pelo menor preco
  } //Termina a condicao if
  if (!location.href.match('DisplayType_LF') && document.querySelector("div.ui-search") !== null && GM_getValue("AutoAtivarModoLista") === true) //Se o usuario estiver buscando um produto e o site nao estiver no modo lista
  { //Inicia a condicao if
    document.querySelectorAll("div.ui-search-view-change")[0].children[0].click(); //Mostra os resultados no modo lista
  } //Termina a condicao if
  else //Se o usuario estiver vendo um produto
  { //Inicia a condicao else

    if (document.querySelectorAll("ul.ui-thermometer")[0] !== undefined) { //Se a pagina tiver o elemento mostrando o nivel do vendedor
      var StatusDoVendedor = document.querySelectorAll("ul.ui-thermometer")[0].attributes[2].nodeValue === '5' ? 'Vendedor Recomendado' : 'Vendedor Não Recomendado'; //Variavel para mostrar o status do vendedor
    } //Encerra a condicao if
    else { //Se a pagina nao tiver o elemento mostrando o nivel do vendedor
      StatusDoVendedor = ''; //Define a variavel como nada
    } //Encerra a condicao else
    var PrecoReais, PrecoCentavos, ElementoPreco, ElementoFrete, FreteReais, FreteCentavos, FinalTotalCentavos, FinalTotalReais, Quantidades, FreteGratisVariosItens; //Declara as variaveis como globais

    function Matematica() //Cria uma funcao para fazer os calculos
    { //Inicia a funcao Matematica
      if (document.querySelector("span.ui-pdp-buybox__quantity__selected") !== null && document.querySelector("div.ui-pdp-buybox__quantity__messages") !== null) //Se o produto tiver mais de unidade disponivel para a compra
      { //Inicia a condicao if
        Quantidades = parseInt(document.querySelector("span.ui-pdp-buybox__quantity__selected").innerText.match(/\d+/)[0]); //Adiciona o valor das quantidades na variavel Quantidades
        document.querySelector("div.ui-pdp-buybox__quantity__messages").innerText !== '' ? FreteGratisVariosItens = parseInt(document.querySelector("div.ui-pdp-buybox__quantity__messages").innerText.match(/\d+/)[0].replace(/,/g, "")) : FreteGratisVariosItens = 0; //Se existir uma mensagem informando que o item tem frete gratis na compra de X unidades, salva o valor de X na variavel FreteGratisVariosItens, do contrario faz a variavel FreteGratisVariosItens ter valor 0
      } //Termina a condicao if
      else //Se o produto nao tiver mais de unidade disponivel para a compra
      { //Inicia a condicao else
        Quantidades = 1; //Adiciona o valor 1 na variavel Quantidades
        FreteGratisVariosItens = 0; //Adiciona o valor de 0 na variavel FreteGratisVariosItens
      } //Termina a condicao else

      if (document.querySelector("span.price-tag.ui-pdp-price__part").innerText.search(/[.]/) > -1 && document.querySelector("span.price-tag.ui-pdp-price__part").innerText.search(/[,]/) === -1) //Se o preco estiver na casa dos mil e nao tiver centavos
      { //Inicia a condicao if

        if (document.querySelector("span.price-tag.ui-pdp-price__part").innerText.split('\n').length === 3) //Se o elemento preco tiver valores ocultos
        { //Inicia a condicao if
          ElementoPreco = document.querySelector("span.price-tag.ui-pdp-price__part").innerText.split('\n')[0].split(/[.]/); //Adiciona o elemento preco na variavel
          PrecoReais = ElementoPreco[0].match(/\d+/)[0]; //Salva o preco em reais na variavel PrecoReais
        } //Inicia a condicao if
        else { //Termina a condicao else
          ElementoPreco = document.querySelector("span.price-tag.ui-pdp-price__part").innerText.split(/[.]/); //Adiciona o elemento preco na variavel Elementopreco
          PrecoReais = ElementoPreco[0].match(/\d+/)[0] + ElementoPreco[1].match(/\d+/)[0]; //Salva o preco em reais na variavel PrecoReais
        } //Termina a condicao else

        PrecoCentavos = 0; //Adiciona o valor 0 a variavel PrecoCentavos
      } //Termina a condicao if
      else if (document.querySelector("span.price-tag.ui-pdp-price__part").innerText.search(/[.]/) > -1 && document.querySelector("span.price-tag.ui-pdp-price__part").innerText.search(/[,]/) > -1) //Se o preco estiver na casa dos mil e tiver centavos
      { //Inicia a condicao else if
        ElementoPreco = document.querySelector("span.price-tag.ui-pdp-price__part").innerText.split(/[.,]/); //Adiciona o elemento preco na variavel Elementopreco
        PrecoReais = ElementoPreco[0].match(/\d+/)[0] + ElementoPreco[1].match(/\d+/)[0]; //Salva o preco em reais na variavel PrecoReais
        PrecoCentavos = parseInt(ElementoPreco[2].match(/\d+/)[0]); //Salva o preco com centavos na variavel PrecoCentavos
      } //Termina a condicao else if
      else //Se o produto nao estiver na casa dos mil
      { //Inicia a condicao else
        ElementoPreco = document.querySelector("span.price-tag.ui-pdp-price__part").innerText.split(','); //Adiciona o elemento preco na variavel Elementopreco
        PrecoReais = parseInt(ElementoPreco[0].match(/\d+/)[0]); //Salva o preco em reais na variavel PrecoReais
        ElementoPreco.length === 2 ? PrecoCentavos = parseInt(ElementoPreco[1].match(/\d+/)[0]) : PrecoCentavos = 0; //Se o produto tiver o preco com centavos Salva o preco com centavos na variavel PrecoCentavos,se nao tiver adiciona o valor 0 a variavel PrecoCentavos
      } //Termina a condicao else

      if (document.querySelectorAll("span.price-tag.ui-pdp-price__part").length >= 3 && document.querySelector("div.ui-pdp-container__row.ui-pdp-container__row--shipping-summary,#buybox-form > div").innerText.search(/Chegará grátis|Entrega a combinar/) === -1 && document.querySelectorAll("span.price-tag.ui-pdp-price__part > span.price-tag-amount").length >= 3) //Se o frete nao for gratis
      { //Inicia a condicao if
        ElementoFrete = document.querySelectorAll("span.price-tag.ui-pdp-price__part > span.price-tag-amount")[2].innerText.split(','); //Adiciona o elemento frete na variavel ElementoFrete

        if (document.querySelectorAll("span.price-tag.ui-pdp-price__part > span.price-tag-amount").length > 4) //Se a pagina tiver varias opcoes de preco
        { //Inicia a condicao if
          ElementoFrete = document.querySelectorAll("span.price-tag.ui-pdp-price__part > span.price-tag-amount")[3].innerText.split(','); //Adiciona o elemento frete na variavel ElementoFrete
        } //Termina a condicao if

        FreteReais = parseInt(ElementoFrete[0].match(/\d+/)[0].replace(/,/g, "")); //Salva o frete em reais na variavel FreteReais
        ElementoFrete.length === 2 ? FreteCentavos = parseInt(ElementoFrete[1].match(/\d+/)[0].replace(/,/g, "")) : FreteCentavos = 0; //Se o produto tiver o frete com centavos Salva o frete com centavos na variavel FreteCentavos,se nao tiver adiciona o valor 0 a variavel FreteCentavos
      } //Termina a condicao if
      else if (Quantidades >= FreteGratisVariosItens && FreteGratisVariosItens !== 0) //Se numero de itens que torna o frete gratis for maior ou igual que a quantidade de unidades
      { //Inicia a condicao else
        FreteReais = 0; //Define a variavel FreteReais como 0 para tornar o frete gratis
        FreteCentavos = 0; //Define a variavel FreteCentavos como 0 para tornar o frete gratis
      } //Termina a condicao else
      else //Se elemento do frete nao existir
      { //Inicia a condicao else
        FreteReais = 0; //Define a variavel FreteReais como 0 para tornar o frete gratis
        FreteCentavos = 0; //Define a variavel FreteCentavos como 0 para tornar o frete gratis
      } //Termina a condicao else

      var TotalReais = parseInt(PrecoReais) * Quantidades + FreteReais; //Soma o preco em reais e o preco em reais do frete e os adiciona  a variavel TotalReais e Multiplica o preco total em reais pelo numero de quantidades
      var TotalCentavos = PrecoCentavos * Quantidades + FreteCentavos; //Soma o preco em centavos e o preco em centavos do frete e os adiciona a variavel TotalCentavos e Multiplica o preco total em centavos pelo numero de quantidades

      if (TotalCentavos >= 100) //Se o produto e frete tiver centavos suficientes para virar reais
      { //Inicia a condicao if
        FinalTotalCentavos = TotalCentavos / 100; //Converte os centavos em reais
        FinalTotalReais = TotalReais + parseInt(String(FinalTotalCentavos).split('.')[0].replace(/,/g, "")); //Converte os centavos em apenas reais
        String(FinalTotalCentavos).split('.').length === 2 ? FinalTotalCentavos = parseInt(String(FinalTotalCentavos).split('.')[1].replace(/,/g, "")) : FinalTotalCentavos = "" + 0 + 0; //Se o frete final tiver mais de um valor Converte os centavos em apenas centavos,Se o frete final tiver apenas um valor Adiciona um zero no final da variavel FinalTotalCentavos
      } //Termina a condicao if
      else if (TotalCentavos === 00) //Se o frete total nao tiver nenhum centavo
      { //Inicia a condicao else
        FinalTotalCentavos = 00; //Define a variavel FinalTotalCentavos como 0 centavos
        FinalTotalReais = TotalReais; //Define a variavel FinalTotalReais com o conteudo da variavel TotalReais
      } //Termina a condicao else
      else if (TotalCentavos > 00) //Se o produto e frete tiver centavos
      { //Inicia a condicao else
        FinalTotalCentavos = TotalCentavos; //Define a variavel FinalTotalCentavos com o conteudo da variavel TotalCentavos
        FinalTotalReais = TotalReais; //Define a variavel FinalTotalReais com o conteudo da variavel TotalReais
      } //Termina a condicao else
      if (String(FinalTotalCentavos).length === 1) //Se o frete final tiver apenas um valor
      { //Inicia a condicao if
        FinalTotalCentavos = "" + FinalTotalCentavos + 0; //Adiciona um zero no final da variavel FinalTotalCentavos
      } //Termina a condicao if
    } //Termina a funcao Matematica

    var arrived = increaseby = 1; //Cria duas variaveis com o valor 1
    document.arrive('div.carousel-container.arrow-visible', (async function() { //Cria uma funcao async
      arrived += increaseby; //Soma quantas vezes a funcao foi executada

      if (arrived === 3) { //Quando o ultimo elemento carregar
        Arrive.unbindAllArrive(); //Remove o advent listener arrive para melhor performance
        await Matematica(); //Chama a funcao para fazer os calculos
        var html = '<center style="margin-top: -15px;"><h1 id="PrecoFinal" style="margin-top: 30px; color:red; font-weight: bold;">TOTAL: ' + FinalTotalReais + ',' + FinalTotalCentavos + '<h3 style="color:red; font-weight: bold;"><center>' + StatusDoVendedor + '</center></h3>'; //Cria uma variavel

        document.querySelector("div.ui-pdp-container__row.ui-pdp-container__row--header") !== null ? document.querySelector("div.ui-pdp-container__row.ui-pdp-container__row--header").nextSibling.nextSibling.insertAdjacentHTML('afterend', html) : document.querySelector("div.ui-pdp-container__top-wrapper.mt-40").nextSibling.insertAdjacentHTML('afterend', html); //Mostra o preco Total e o status do vendedor

        function MostrarPonto() { //Cria uma funcao para adiconar o ponto caso o Total esteja na casa dos mil
          document.querySelector("#PrecoFinal").innerText = 'TOTAL: ' + document.querySelector("#PrecoFinal").innerText.split(':')[1].trim().replace(/^(\d{1,3})(?=(?:\d{3})+,\d{2}\b)/, '$1.'); //Adiciona o ponto
        } //Termina a funcao
        MostrarPonto(); //Executa a funcao

        new MutationObserver(async function() { //Se uma quantidade diferente for selecionada
          await Matematica(); //Chama a funcao para fazer os calculos
          document.querySelector("#PrecoFinal").innerText = 'TOTAL: ' + FinalTotalReais + ',' + FinalTotalCentavos; //Mostra o novo valor
          await MostrarPonto(); //Chama a funcao colocar o ponto
        }).observe(document.querySelector("span.ui-pdp-buybox__quantity__selected"), { //Define o elemento e as caracteristicas a serem observadas
          attributes: true,
          attributeOldValue: true,
          characterData: true,
          characterDataOldValue: true,
          childList: true,
          subtree: true
        }); //Termina as definicoes a serem observadas

      } //Encerra a condicao if
    })); //Termina e executa a funcao async

  } //Termina a condicao else
})();