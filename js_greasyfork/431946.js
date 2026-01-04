// ==UserScript==
// @name         Info Adicional Produtos agileEcommerce
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Mostra mais informações nos produtos no agileEccomerce
// @author       You
// @match        https://www.rofedistribuidora.com.br/*
// @icon         https://www.google.com/s2/favicons?domain=rofedistribuidora.com.br
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431946/Info%20Adicional%20Produtos%20agileEcommerce.user.js
// @updateURL https://update.greasyfork.org/scripts/431946/Info%20Adicional%20Produtos%20agileEcommerce.meta.js
// ==/UserScript==

(function() {
    function updateMarcaProdutos() {

        // Adiciona a MARCA do Produto na frente do nome.
        var buttons_produtos = $(".product-card__addtocart");
        buttons_produtos.each(bt_id => {
            var idproduto = buttons_produtos[bt_id].getAttribute('data-id-produto');
            var marcaproduto = buttons_produtos[bt_id].getAttribute('data-marca');
            var filial = buttons_produtos[bt_id].getAttribute('data-id-filial');
            var precoproduto = parseFloat(buttons_produtos[bt_id].getAttribute('data-preco'), 10);
            var marca_chaves = '[' + marcaproduto + ']';

            var estoque_produto = $('.input-number__input[data-value="quantidade"][data-id-produto="'+idproduto+'"]')[0].getAttribute('max');
            var quantidade_minima = $('.input-number__input[data-value="quantidade"][data-id-produto="'+idproduto+'"]')[0].getAttribute('step');

            var link_produto = $('div.product-card__name>a[href*="'+idproduto+'"]')[0];
            if (link_produto && !link_produto.textContent.endsWith(marca_chaves))
            {
                link_produto.textContent = link_produto.textContent + ' ' + marca_chaves;
            }

            // Marca de Vermelho os produtos que não são da filial 08;

            if (filial != 8)
            {
                $('.products-list__item:has(div[data-id-produto='+idproduto+'])')[0].style.background = "rgb(255, 240, 240)";
            }

            // Adiciona os valores unitários dos produtos e estoque atual.
            if (!isNaN(precoproduto))
            {
                var embalagen_produto = $('div[data-id-produto='+idproduto+']>.product-card__info>.product-card__rating-legend:contains("Embalagem")')[0];
                var texto_embalagem = embalagen_produto.textContent;
                if (embalagen_produto.hasAttribute("calc_emb")) return;

                if (!isNaN(estoque_produto) && embalagen_produto != undefined)
                {
                    embalagen_produto.innerHTML = embalagen_produto.innerHTML + '<br><br>Estoque:<b> '+estoque_produto+'</b>';
                    embalagen_produto.innerHTML = embalagen_produto.innerHTML + '<br>Mínimo: '+quantidade_minima;
                    embalagen_produto.innerHTML = embalagen_produto.innerHTML + '<br>Filial: '+filial;
                }

                var quants = texto_embalagem.replace(/\D+/g, ' ').trim().split(' ');

                embalagen_produto.innerHTML = embalagen_produto.innerHTML + '<br>';
                for (var qtd in quants)
                {
                    var num_qtd = parseInt(quants[qtd], 10);
                    if (isNaN(num_qtd) || num_qtd == 0)
                    {
                        continue;
                    }
                    var preco_unidade = precoproduto / num_qtd;
                    embalagen_produto.innerHTML = embalagen_produto.innerHTML + '<br><b>1 / ' + num_qtd.toString() + ':  R$ ' + preco_unidade.toLocaleString() + '</b>';
                }

                embalagen_produto.setAttribute("calc_emb", true);
            }
        });

        var grids = $('.products-view__list.products-list');
        console.log(grids);
        grids.each( function(grid) {
            console.log(grids[grid]);
            grids[grid].setAttribute('data-layout', 'grid-5-full');
        });
    }

    $(document).ajaxComplete(updateMarcaProdutos);
    updateMarcaProdutos();
    var params_existent = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s, k, v) {
            params_existent[k] = v
        });

    this["buscar"] = function(form) {
        var params_existent2 = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(s, k, v) {
            params_existent2[k] = v
        });
        var order = params_existent2['order'];

        var params = '';
        if (order)
        {params = 'busca?' + $(form).serialize() + '&order=' + order;}
        else
        {params = 'busca?' + $(form).serialize();}

        window.location.href = URL_SITE + params;
    }

    if (params_existent['s'])
    {
        var input_buscas = $('form>input[name="s"]');
        input_buscas.each(inp_id => {
            input_buscas[inp_id].value = decodeURIComponent(params_existent['s']);
        });
    }

    // Ajustar layout barra topo sempre visível.

    var site_header = $('.site-header')[0];
    site_header.style.position = 'fixed';
    site_header.style.width = '100%';
    site_header.style.background = 'white';

    var site_body = $('.site__body')[0]
    site_body.style.marginTop = '150px';

    // Mostrar Marca no Carrinho de Compras
    var produtos_carrinho = $('tbody>.cart-table__row>.cart-table__column--remove>i');
    produtos_carrinho.each(pd_id => {
        var produto = produtos_carrinho[pd_id];
        var nome_produto = produto.getAttribute('data-nome');
        var id_produto = produto.getAttribute('data-id-produto');
        var marca_produto = produto.getAttribute('data-marca');
        var id_filial = produto.getAttribute('data-id-filial');
        var estoque_produto = $('input[name*="|'+id_produto+'|"]')[0].getAttribute('max');

        var column_nome = $('.cart-table__product-name:contains("'+nome_produto+'")')[0];
        var column_small = $('td:has(.cart-table__product-name:contains("'+nome_produto+'"))>small')[0];

        column_nome.textContent = column_nome.textContent + ' [' + marca_produto + ']';
        column_small.innerHTML = column_small.innerHTML + '<br>Estoque: '+ estoque_produto;
        column_small.innerHTML = column_small.innerHTML + '<br>Filial: '+ id_filial;
    });

})();