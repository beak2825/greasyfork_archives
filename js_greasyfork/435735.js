// ==UserScript==
// @name         Ajustes E-commerce Isthmus Condor Atacadista
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove algins elementos que poluiam o site. E permite ver todas as paginas do resultado da busca em uma só aba.
// @author       Jamison Freitas.
// @match        https://www.condoratacadista.com.br/condor/Busca/Resultado*
// @match        https://www.condoratacadista.com.br/condor/busca/resultado*
// @icon         https://www.google.com/s2/favicons?domain=condoratacadista.com.br
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435735/Ajustes%20E-commerce%20Isthmus%20Condor%20Atacadista.user.js
// @updateURL https://update.greasyfork.org/scripts/435735/Ajustes%20E-commerce%20Isthmus%20Condor%20Atacadista.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var buscaAvancada = $('.container>#buscaAvancada');
    buscaAvancada.hide();

    var hideMegaMenu = function()
    {
        var megaMenus = $('.sectionMegaMenu>.container');
        megaMenus.each( function(menu) {
            console.log(megaMenus[menu]);
            megaMenus[menu].hidden = true;
        });

    }


    var regexPag = $('ul.pagination:first>li:last-child>span>a').attr("href").match(/(.*pagina=)([0-9]*)/);
    var urlBase = regexPag[1];
    var totalPaginas = parseInt(regexPag[2]);
    var ultimaPaginaCarregada = 1;
    var carregandoPagina = false;
    var lastGridPagina = null;

    $('#divConteudoNavegacao').append('<div id="loadingDiv" class="lds-ring"><div></div><div></div><div></div><div></div></div>');

    var loadingDiv = $('#loadingDiv');
    loadingDiv.hide();

    var CarregaPagina = function(pagina){
        ultimaPaginaCarregada = pagina;
        if (pagina > totalPaginas) return;

        console.log("Carregando Página " + pagina);
        carregandoPagina = true;
        loadingDiv.show();
        var gridPagina = $('#gridPagina' + pagina);
        var urlPagina = urlBase + pagina;

        gridPagina.load(urlPagina + " .grid-produtos", function ()
            {
                ObterInformacoesAdicionaisProdutosB2B();
                //CarregaPagina(pagina + 1);
                $("li:has(span>a[href='" + urlPagina + "'])").addClass("active");
            lastGridPagina = gridPagina;
            carregandoPagina = false;
            loadingDiv.hide();
            }
            );
    }

    var CarregarTodasPaginas = function() {
        var divPaiGrid = $('#divConteudoNavegacao>div.space-top');

        for (var i = 2; i <= totalPaginas; i++)
        {
            var gridPagina = divPaiGrid.append('<div id="gridPagina' + i + '" class="grid-produtos col-sm-12"></div>');
        }

        $('head').append(`<style type="text/css">.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fdd;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fdd transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}</style>`);


        //CarregaPagina(2);
    }

    $(window).scroll(function() {
        if (carregandoPagina) return;
        var obj = $('#divConteudoNavegacao>div.space-top');
        if (lastGridPagina != null) obj = lastGridPagina;
        if($(window).scrollTop() > obj.offset().top + obj.height()/2 - $(window).height()) {
            if (ultimaPaginaCarregada > totalPaginas) return;

            CarregaPagina(ultimaPaginaCarregada + 1);
            // ajax call get data from server and append to the div
    }
});

    hideMegaMenu();
    CarregarTodasPaginas();
    //setInterval(hideMegaMenu, 1000);

    // Your code here...
})();