// ==UserScript==
// @name         Precios Claros
// @namespace    http://preciosclaros.gob.ar/
// @version      0.52
// @description  Compara precios en PreciosClaros
// @author       Jonatan Pintos
// @match        *://*.preciosclaros.gob.ar/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463200/Precios%20Claros.user.js
// @updateURL https://update.greasyfork.org/scripts/463200/Precios%20Claros.meta.js
// ==/UserScript==
GM_addStyle(".ocultar {color: #c5c8c9; cursor: pointer; display: INLINE-BLOCK; WIDTH: 50%; TEXT-ALIGN: LEFT;} "+
            ".favoritear {color: #c5c8c9; cursor: pointer; display: INLINE-BLOCK; WIDTH: 50%; TEXT-ALIGN: RIGHT;} "+
            "img.bordernone {border: 0;} "+
            ".expandible>div {background-color: white; display: flex; max-width: 1080px; margin: auto; height: auto; clear: both; margin-bottom: 2em; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: stretch;} " +
            ".expandible>div:not(.desocultado) .ocultado {display: none !important;} " +
            ".expandible>div.desocultado .ocultado .caja-producto-mosaico {border-color: red;} " +
            ".expandible.ocultado>div {display: none !important;} " +
            "div.producto {min-width: 250px;} " +
            "#favoritos a.favoritear{display: none !important;} " +
            ".expandible {text-align: center;    border-width: medium;    border-style: solid;    display: table;    border-color: #e2d0ff;    border-radius: 1em;    margin: auto;} "
           );

$(document).ready(function() {
    var favoritos=window.localStorage.getItem('favoritos');
    var oportunidades=window.localStorage.getItem('oportunidades');
    var cupones=window.localStorage.getItem('cupones');
    var revisados = window.localStorage.getItem('revisados');
    revisados = revisados.split(",");
    if (favoritos == null){favoritos=''}
    if (oportunidades == null){oportunidades=''}
    if (cupones == null){cupones=''}
    console.log('PLUGIN: Funcionando');
    var bsco=1;
    function buscarof(){
        if (bsco==1){
            $('input#bo').val('Activar Navegación automática');
            bsco=0;
            console.log("PLUGIN: Se desactivó la navegación automática")
        } else {
            $('input#bo').val('Detener Navegación automática');
            bsco=1;
            cambiarpag();
            console.log("PLUGIN: Se activó la navegación automática")
        }
    }
    function limpiarof(){$("#cupones").empty(); $("#oportunidades").empty();}

    $.fn.classChange = function(cb) {
        return $(this).each((_, el) => {
            new MutationObserver(mutations => {
                mutations.forEach(mutation => cb && cb(mutation.target, $(mutation.target).prop(mutation.attributeName)));
            }).observe(el, {
                attributes: true,
                attributeFilter: ['class'] // only listen for class attribute changes
            });
        });
    }
    var temporizador = 500;
    var pag = 1;
    var elements;
    var newelements;
    var cantidad = 0;
    var index = 0;
    var comparar=0;
    var ultimo;
    var producto;
    var ean;
    var buscar=0;
    var loc1='Carrefour';
    var suc1='Catamarca 1965';
    var loc2='Dia';
    var suc2='Cl Alberti 2151';
    var loc3='Toledo';
    var suc3='Av.Constitucion 4386';
    var loc4='Toledo';
    var suc4='La Rioja 1445';
    var loc5='Toledo';
    var suc5='Rivadavia 2248';
    var loc6='Vea';
    var suc6='Avenida Independencia 3705';
    $("header").append('<div id="botones" style="background-color: white; display: -webkit-box; max-width:1080px; margin: auto; height: auto; clear: both; margin-bottom: 2em;"></div>' +
                       '<div class="expandible ocultado"><a href="#" onclick="event.preventDefault(); $(this).parent(\'.expandible\').toggleClass(\'ocultado\')">FAVORITOS</a><div id="favoritos">'+
                       favoritos.toString()+
                       '</div></div><div class="expandible ocultado"><a href="#" onclick="event.preventDefault(); $(this).parent(\'.expandible\').toggleClass(\'ocultado\')">OFERTAS</a><div id="oportunidades" class="ofertas">'+
                       oportunidades.toString()+
                       '</div></div><div class="expandible"><a href="#" onclick="event.preventDefault(); $(this).parent(\'.expandible\').toggleClass(\'ocultado\')">CUPONES</a><div id="cupones" class="ofertas">'+
                       cupones.toString()+
                       '</div></div>');
    // $(".contenedor-spinner").css("position","relative");
    // $(".pagination").css("display","block!important;");
    //  function favoritear(favorito) {
    //     $('[data-sort='+favorito+']').clone().appendTo("#seleccion1");
    //}
    $("body").on('DOMSubtreeModified', ".productos div .producto .caja-producto-mosaico", function() {
        cantidad=0;
    });
    const $contenedor = $(".contenedor-spinner").classChange(function(){if ($(".contenedor-spinner").hasClass("ng-hide") && buscar==1){
        setTimeout(function() {
            console.log('PLUGIN: Finalizó la carga de nuevos datos');
            newelements=$(".productos div .producto .caja-producto-mosaico .precio");
            if (($(".precio").length>0)&&(buscar==1))
            {
                console.log('PLUGIN: Se encontraron productos');
                if (cantidad==0)
                {
                    console.log('PLUGIN: Leyendo nuevos productos...');
                    elements = $(".productos div .producto .caja-producto-mosaico .precio");
                    cantidad = elements.length;
                    index=0;
                    ultimo=index;
                    if (cantidad>0) {ordenar();precios();}
                }
                else if (comparar==1)
                {
                    comparar=0;
                    console.log('PLUGIN: Se van a comparar comercios');
                    var menorprecio=0;
                    var sucursal="";
                    var pre1=0;
                    var msj="";
                    var pre1a=0;
                    var pre1b=0;
                    var pre2=0;
                    var pre3=0;
                    var pre4=0;
                    var pre5=0;
                    var pre6=0;
                    var precio;
                    var tienda="";
                    var msj1="";
                    var msj2="";
                    var num=0;
                    $('table.tabla-comparativa > tbody > tr').not('.ng-hide').each(function(){
                        precio = 0;
                        sucursal="";
                        precio = Number.parseFloat($.trim($(this).children('td.detalle-precio').children('span.precio-lista').text()).replace('$', '').replace(' ', ''),2);
                        sucursal = $.trim($(this).children('td.detalle-mercado').children('div.contenedor-descripcion').children('p.direccion.ng-binding').text());
                        console.log('PLUGIN: Viendo '+ producto +' en '+ sucursal +' con el precio $'+ precio);
                        if((precio>0)&&(sucursal!=""))
                        {
                            if(sucursal==suc1){
                                pre1=precio
                                pre1a=Number.parseFloat($.trim($(this).children('td').children('span.precio-promo-1').children('span').text()).replace('$', '').replace(' ', ''),2);
                                if (pre1a>0)console.log('PLUGIN: El producto '+ producto +' tiene una oferta en $'+ pre1a);
                                pre1b=Number.parseFloat($.trim($(this).children('td').children('span.precio-promo-2').children('span').text()).replace('$', '').replace(' ', ''),2);
                                if (pre1b>0)console.log('PLUGIN: El producto '+ producto +' tiene una oferta en $'+ pre1b);
                                msj1=$(this).children('td').children('span.precio-promo-1').children('span').attr('title');
                                msj2=$(this).children('td').children('span.precio-promo-2').children('span').attr('title');
                            }
                            else if(sucursal==suc2){pre2=precio;if((menorprecio==0)||(precio<menorprecio)){menorprecio=precio; num=1}}
                            else if(sucursal==suc3){pre3=precio;if((menorprecio==0)||(precio<menorprecio)){menorprecio=precio; num=2}}
                            else if(sucursal==suc4){pre4=precio;if((menorprecio==0)||(precio<menorprecio)){menorprecio=precio; num=3}}
                            else if(sucursal==suc5){pre5=precio;if((menorprecio==0)||(precio<menorprecio)){menorprecio=precio; num=4}}
                            else if(sucursal==suc6){pre6=precio;if((menorprecio==0)||(precio<menorprecio)){menorprecio=precio; num=5}}
                        }
                    });
                    tienda=loc2+': '+suc2;
                    if (pre2>0) tienda+=' $'+pre2; else tienda+=' -';
                    if (menorprecio==pre2) tienda+=' *';
                    tienda+='<br>'
                    tienda+=loc3+': '+suc3;
                    if (pre3>0) tienda+=' $'+pre3; else tienda+=' -';
                    if (menorprecio==pre3) tienda+=' *';
                    tienda+='<br>'
                    tienda+=loc4+': '+suc4;
                    if (pre4>0) tienda+=' $'+pre4; else tienda+=' -';
                    if (menorprecio==pre4) tienda+=' *';
                    tienda+='<br>'
                    tienda+=loc5+': '+suc5;
                    if (pre5>0) tienda+=' $'+pre5; else tienda+=' -';
                    if (menorprecio==pre5) tienda+=' *';
                    tienda+='<br>'
                    tienda+=loc6+': '+suc6;
                    if (pre6>0) tienda+=' $'+pre6; else tienda+=' -';
                    if (menorprecio==pre6) tienda+=' *';
                    if ((((menorprecio+500)<=pre1)||((menorprecio*1.15)<=pre1))&& menorprecio>0) {

                        if (!($('#p-'+ean).length > 0)) {
                            $("#cupones").append('<div id="p-'+ean+'" class="col-md-3 col-xs-6 producto ng-scope " data-sort="'+num+('00' + parseInt((1+((pre1-((pre1-menorprecio)*2))/pre1))*10)).slice(-3)+'"></div>');
                        }

                        $('#p-'+ean).html('<div class="caja-producto-mosaico"><a href="#" onclick="event.preventDefault(); $(this).parents(\'div.producto\').toggleClass(\'ocultado\')" class="ocultar"><i class="fa fa-close fa-fw fa-2x margin-bottom"></i></a>'+
                                          '<a href="#" onclick="event.preventDefault(); $(this).parents(\'div.producto\').clone().appendTo(\'#favoritos\');" class="favoritear"><i class="fa fa-star fa-fw fa-2x margin-bottom"></i></a>'+
                                          '<div class="contenedor-imagen"><img onError="this.onerror=null;this.src=\'/img/no-image.png\';" src="'+
                                          $('#detalle-producto-minorista').find( "img.img-rounded" ).attr("src")+
                                          '"></div><div class="contenedorProductoEan ver-detalle-mayorista"><div class="nombre-producto ng-binding">'+
                                          producto+'</div><div class="ean ng-binding" data-ean="'+ean+'">'+ean+'</div></div><div class="precio ng-binding" style="background-color: #cfffd0;">$'+pre1+' -> $'+
                                          (pre1-((pre1-menorprecio)*2)) +' (cupon $'+((pre1-menorprecio)*2) +') *'+
                                          '</div><div class="carrito"><small style="margin:0; width: 100%; text-align: center; padding-bottom: 10px;" class="ng-binding">'+
                                          tienda+
                                          '</small></div></div>');
                    } else {
                        $("#p-"+ean).remove();
                        if (pre1a>0 && pre1b>0) {
                            if (pre1a>pre1b) {
                                pre1=pre1b
                                msj=msj2;
                                console.log('PLUGIN: El producto '+ producto +' tiene una oferta en $'+ pre1+' ('+tienda+')');
                            }else{
                                pre1=pre1a
                                msj=msj1;
                                console.log('PLUGIN: El producto '+ producto +' tiene una oferta en $'+ pre1+' ('+tienda+')');
                            }
                        } else if (pre1a>0){
                            pre1=pre1a
                            msj=msj1;
                            console.log('PLUGIN: El producto '+ producto +' tiene una oferta en $'+ pre1+' ('+tienda+')');
                        }else if (pre1b>0){
                            pre1=pre1b
                            msj=msj2;
                            console.log('PLUGIN: El producto '+ producto +' tiene una oferta en $'+ pre1+' ('+tienda+')');
                        }100
                        50
                        if ((((pre1+500)<=menorprecio)||((pre1*1.15)<=menorprecio))&& pre1>0) {
                            if (!($('#o-'+ean).length > 0)) {
                                $("#oportunidades").append('<div id="o-'+ean+'" class="col-md-3 col-xs-6 producto ng-scope" data-sort="'+parseInt(pre1*100/menorprecio)+'"></div>');
                            }
                            $('#o-'+ean).html('<div class="caja-producto-mosaico"><a href="#" onclick="event.preventDefault(); $(this).parents(\'div.producto\').toggleClass(\'ocultado\')" class="ocultar"><i class="fa fa-close fa-fw fa-2x margin-bottom"></i></a>'+
                                              '<a href="#" onclick="event.preventDefault(); $(this).parents(\'div.producto\').clone().appendTo(\'#favoritos\');" class="favoritear"><i class="fa fa-star fa-fw fa-2x margin-bottom"></i></a>'+
                                               '<div class="contenedor-imagen"><img onError="this.onerror=null;this.src=\'/img/no-image.png\';" src="'+
                                               $('#detalle-producto-minorista').find( "img.img-rounded" ).attr("src")+
                                               '"></div><div class="contenedorProductoEan ver-detalle-mayorista"><div class="nombre-producto ng-binding">'+
                                               producto+'</div><div class="ean ng-binding" data-ean="'+ean+'">'+ean+'</div></div><div class="precio ng-binding" style="background-color: #cfffd0;">$'+pre1+' (-'+(100-parseInt(pre1*100/menorprecio))+'%) *'+
                                               '</div><div class="carrito"><small style="margin:0; width: 100%; text-align: center; padding-bottom: 10px;" class="ng-binding">'+
                                               tienda+'<br>'+msj+
                                               '</small></div></div>');
                        }
                    }
                    revisados.push(String(ean));
                    index++;
                    precios();
                }
                else if (index>cantidad)
                {
                    console.log('PLUGIN: indice '+index+', cantidad '+cantidad);
                    pag = Number.parseFloat($("ul.pagination").children("li.active").children(".ng-binding").text());
                    console.log('PLUGIN: Se terminaron de revisar los productos de la página '+pag+', se puede cambiar de página...');
                    cantidad=0;
                    index=0;
                    cambiarpag();
                }
                else if(index>ultimo)
                {
                    precios();
                }
                else
                {
                    console.log('PLUGIN: problemas?');
                }
            }
            else {
                console.log('PLUGIN: No se encontraron productos')
            }
        }, temporizador);
    }});

    function precios() {
        if (($(".precio").length>0)&&(buscar==1))
        {
            var doNext = null;
            doNext = function() {
                if (cantidad==0)
                {
                    console.log('PLUGIN: Leyendo nuevos productos...');
                    elements = $(".productos div .producto .caja-producto-mosaico .precio");
                    cantidad = elements.length;
                    index=0;
                    ultimo=index;
                    if (cantidad>0) {ordenar(); doNext();}
                }
                else if(index==cantidad)
                {
                    console.log('PLUGIN: indice '+index+', cantidad '+cantidad);
                    pag = Number.parseFloat($("ul.pagination").children("li.active").children(".ng-binding").text());
                    console.log('PLUGIN: Se terminaron de revisar los productos de la página '+pag+', se puede cambiar de página...');
                    cantidad=0;
                    index=0;
                    cambiarpag();
                }
                else
                {
                    var element = elements.eq(index);
                    ean = parseInt(element.parent(".caja-producto-mosaico").children(".contenedorProductoEan").children(".ean").text());
                    console.log('PLUGIN: Revisando producto nro '+ (index+1) + ' de ' + cantidad + ', ean:' + ean);
                    if ( isNaN(ean) || ean=="" || $.inArray( String(ean), revisados )>0 ) {
                        console.log('PLUGIN: El EAN '+ ean + ' está repetido o no existe... ');
                        index++;
                        doNext();
                    }
                    else if (($('#o-'+ean+'.ocultado').length > 0) || ($('#p-'+ean+'.ocultado').length > 0)) {
                        console.log('PLUGIN: El EAN '+ ean + ' está oculto... ');
                        index++;
                        doNext();
                    }
                    else {
                        var numero1 = Number.parseFloat($.trim(element.text().split('a', 1)[0]).replace('$', '').replace(' ', ''),2);
                        var numero2 = Number.parseFloat($.trim(element.text().split('a', 2)[1]).replace('$', '').replace(' ', ''),2);
                        if (((numero1+1000)<=numero2)||((numero1*1.25)<=numero2)){
                            comparar=1;
                            producto=$.trim(element.parent(".caja-producto-mosaico").children(".contenedorProductoEan").children(".nombre-producto").text());
                            setTimeout(function() {
                                element.parent(".caja-producto-mosaico").children(".contenedorProductoEan").children(".nombre-producto")[0].click();
                            }, temporizador);
                        }
                        else {
                            index++;
                            doNext();
                        }
                    }
                }
            }
            doNext();
        }
    }
    function desocultar() {
        $( "#oportunidades" ).toggleClass('desocultado');
        $( "#cupones" ).toggleClass('desocultado');
    };
    function favorito() {
       var resultado = $('.favorito');
        $('#favoritos').html(resultado);
    };
    function ordenar() {
        var resultado = $('#cupones .producto').sort(function (a, b) {
            var contentA =parseInt( $(a).data('sort'));
            var contentB =parseInt( $(b).data('sort'));
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        });
        $('#cupones').html(resultado);
        resultado = $('#oportunidades .producto').sort(function (a, b) {
            var contentA =parseInt( $(a).data('sort'));
            var contentB =parseInt( $(b).data('sort'));
            return (contentA < contentB) ? -1 : (contentA > contentB) ? 1 : 0;
        });
        $('#oportunidades').html(resultado);
        $('#favoritos .ocultado').remove();
        window.localStorage.setItem('cupones', $('#cupones').html());
        window.localStorage.setItem('oportunidades', $('#oportunidades').html());
        window.localStorage.setItem('favoritos', $('#favoritos').html());
        window.localStorage.setItem('revisados', revisados);
    };
    function vaciarcache() {
        window.localStorage.setItem('revisados', 0);
        revisados=[];
    };
    function cambiarpag() {
        if (bsco==1 && index==0){
            console.log('PLUGIN: Se va a cambiar la página automáticamente');
            pag = Number.parseFloat($("ul.pagination").children("li.active").children(".ng-binding").text());
            setTimeout(function() {
                $("ul.pagination").children("li").each(function(){
                    if (Number.parseFloat($(this).children(".ng-binding").text()) == pag+1) {
                        console.log("PLUGIN: Redirigiendo a la PAGINA "+(pag+1));
                        $(this).children(".ng-binding")[0].click();
                    }
                });
            }, temporizador);
        }
    };
    function reiniciarbus() {
        if (buscar==1)
        {
            console.log('PLUGIN: Parando busqueda...');
            buscar=0;
            $('input#breiniciar').val('Reiniciar busqueda');
        }
        else
        {
            console.log('PLUGIN: Reiniciando busqueda...');
            buscar=1;
            $('input#breiniciar').val('Detener busqueda');
            precios();
        }
    }
    function crearbotones() {
        bsco=1;
        var j = $('<input/>').attr({
            type: "button",
            id: "breiniciar",
            value: "Iniciar busqueda"
        });
        $("#botones").append(j);
        $('#breiniciar')[0].addEventListener("click", reiniciarbus);
        var r = $('<input/>').attr({
            type: "button",
            id: "bo",
            value: "Detener Navegación automática"
        });
        $("#botones").append(r);
        $('#bo')[0].addEventListener("click", buscarof);

        var k = $('<input/>').attr({
            type: "button",
            id: "lo",
            value: "Limpiar lista"
        });
        $("#botones").append(k);
        $('#lo')[0].addEventListener("click", limpiarof);
        var cac = $('<input/>').attr({
            type: "button",
            id: "rca",
            value: "Vaciar cache"
        });
        $("#botones").append(cac);
        $('#rca')[0].addEventListener("click", vaciarcache);
        var h = $('<input/>').attr({
            type: "button",
            id: "rd",
            value: "Ordenar/guardar lista"
        });
        $("#botones").append(h);
        $('#rd')[0].addEventListener("click", ordenar);
        var n = $('<input/>').attr({
            type: "button",
            id: "ds",
            value: "Ver ocultos"
        });
        $("#botones").append(n);
        $('#ds')[0].addEventListener("click", desocultar);
    }
    crearbotones();
});