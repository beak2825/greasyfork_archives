// ==UserScript==
// @name         Marcar Vermelho Anuncios Rejeitados
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Marcar anuncios que não quero ver mais e marcar o texto de vermelho
// @author       Fabio Cunha
// @match        https://lista.mercadolivre.com.br/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464437/Marcar%20Vermelho%20Anuncios%20Rejeitados.user.js
// @updateURL https://update.greasyfork.org/scripts/464437/Marcar%20Vermelho%20Anuncios%20Rejeitados.meta.js
// ==/UserScript==


(function() {
    'use strict';
    //$( ".nav-bounds" ).hide(); // esconde barra de navegação // ative apenas para esconder o menu do topo e ter certeza que o código funciona

//    localStorage.clear();

    const links = document.querySelectorAll('a');
    var listaArmazenada = verListaLinksAnuncios();
    console.log("listaArmazenada");
    console.log(listaArmazenada);

    listaArmazenada.forEach((linkArmazenado) => {
        console.log("linkArmazenado: " + linkArmazenado);
        buscaLink(linkArmazenado, links);
    })

    var rightMouseClicked = false;

    function handleMouseDown(e) {
        //e.button describes the mouse button that was clicked
        // 0 is left, 1 is middle, 2 is right
        if (e.button === 2) {
            rightMouseClicked = true;
        } else if (e.button === 0) {
            //Do something if left button was clicked and right button is still pressed
            if (rightMouseClicked) {
                console.log('hello');
                //code
            }
        }
        console.log(rightMouseClicked);
        console.log("target1: "+e.target);
        console.log("target3: "+e.target.innerText[0]);
        console.log("target4: "+e.target.querySelector('a'));

        console.log("target: "+e.target);

        // convert object to JSON string using JSON.stringify()
        //const jsonTarget = JSON.stringify(e.target);

        // save to localStorage
//        localStorage.setItem("myHTMLDivElement", jsonTarget);
//        var myHTMLDivElement = localStorage.getItem("myHTMLDivElement", jsonTarget);

//        console.log('retrievedObject myHTMLDivElement: ', JSON.parse(myHTMLDivElement));

        console.log("target childNodes: "+e.target.childNodes);

        var links = Array.prototype.slice.call(e.target.querySelectorAll("a"));
        var links_array_href = links.map(function(elem){ return elem.getAttribute("href"); });
        var links_array_title = links.map(function(elem){ return elem.getAttribute("title"); });
        console.log("href: " + links_array_href[0]);

        // parte o link a partir do caracter # e captura a primeira parte do link para remover trackings inuteis
        var anuncioLink = links_array_href[0].split('#')[0];
//        localStorage.myLink = links_array_href[0].split('#')[0];
//        console.log( "myLink: " + localStorage.myLink ); // 2

        adicionaItemNaLista(anuncioLink);

//        console.log("title: " + links_array_title[1]);

        var links_h2 = Array.prototype.slice.call(e.target.querySelectorAll("h2"));
        console.log("links_h2: " + links_h2[0]);
        links_h2[0].parentNode.parentNode.parentNode.style.backgroundColor = "red";
        links_h2[0].parentNode.parentNode.parentNode.parentNode.style.backgroundColor = "red";

    }

    function handleMouseUp(e) {
        if (e.button === 2) {
            rightMouseClicked = false;
        }
        console.log(rightMouseClicked);
    }

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', function(e) {
//        e.preventDefault();
    });


    $(document).keydown(function(e){
        if(e.keyCode==17)
        {
//            alert("control was pressed")

            console.log("control was pressed");
            /*
            $(".shops__layout").hover(function(eventObj) {
                console.log("x1: "+eventObj.target.id);
                console.log("x2: "+eventObj.id);
            });
            */
        };


    });

    function dump(v) {
        switch (typeof v) {
            case "object":
                for (var i in v) {
                    console.log(i+":"+v[i]);
                }
                break;
            default: //number, string, boolean, null, undefined
                console.log(typeof v+":"+v);
                break;
        }
    }

    function verListaLinksAnuncios(item) {
        // Verifica se a chave "minhaLista" já existe no localStorage
        var minhaListaJSON = localStorage.getItem("minhaLista");
        var minhaLista = minhaListaJSON !== null ? JSON.parse(minhaListaJSON) : [];

        // Converte o array em uma string JSON
        var listaJSON = JSON.stringify(minhaLista);

        // Armazena a string JSON no localStorage com a chave "minhaLista"
        localStorage.setItem("minhaLista", listaJSON);

        // Recupera a string JSON do localStorage
        var listaArmazenadaJSON = localStorage.getItem("minhaLista");

        // Converte a string JSON de volta para um array
        var listaArmazenada = JSON.parse(listaArmazenadaJSON);

        return listaArmazenada
    }

    function adicionaItemNaLista(item) {
        // Verifica se a chave "minhaLista" já existe no localStorage

        var minhaListaJSON = localStorage.getItem("minhaLista");
        var minhaLista = minhaListaJSON ? new Set(JSON.parse(minhaListaJSON)) : new Set();

        // Adiciona novas strings ao array
        minhaLista.add(item);

        // Converte o array em uma string JSON
        var listaJSON = JSON.stringify(Array.from(minhaLista));

        // Armazena a string JSON no localStorage com a chave "minhaLista"
        localStorage.setItem("minhaLista", listaJSON);

        // Recupera a string JSON do localStorage
        var listaArmazenadaJSON = localStorage.getItem("minhaLista");

        // Converte a string JSON de volta para um array
        var listaArmazenada = JSON.parse(listaArmazenadaJSON);

        // Exibe o array no console
        console.log("listaArmazenada");
        console.log(listaArmazenada);
    }

    function buscaLink(url, links) {
        // Seleciona todos os elementos 'a' na página
        //const links = document.querySelectorAll('a');

        // Itera sobre cada elemento 'a' encontrado
        for (let i = 0; i < links.length; i++) {
            const href = links[i].getAttribute('href');

            // Verifica se o atributo 'href' contém o texto desejado
            if (href && href.indexOf(url) > -1 ) {
                console.log('Encontrado v1: ', links[i]);
                console.log('Encontrado v2: ' + links[i]);
                //links[i].parentElement.parentElement.style.backgroundColor = "purple";
                links[i].parentElement.parentElement.style.display = "none";
            } else {
                console.log('não Encontrado: ');
            }

        }
    }


})();

