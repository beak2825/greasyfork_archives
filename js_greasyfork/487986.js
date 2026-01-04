// ==UserScript==
// @name        Download videos do naoleveportras.net
// @namespace   downloadnaoleve
// @match       https://naoleveportras.net/*
// @grant       none
// @version     1.0
// @author      -
// @grant        GM.xmlHttpRequest
// @description Um Scrapper que facilita o Download de videos do naoleveportras.net
// @license Unlicensed
// @downloadURL https://update.greasyfork.org/scripts/487986/Download%20videos%20do%20naoleveportrasnet.user.js
// @updateURL https://update.greasyfork.org/scripts/487986/Download%20videos%20do%20naoleveportrasnet.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Função para criar o link de download e adicioná-lo ao elemento infosRight
    function criarLinkDownload(videoURL, infosRight) {
        var linkDireto = document.createElement('a');
        linkDireto.textContent = 'Download';
        linkDireto.style = 'color: red; float: right; font-size: 16px; margin-right: 10px;';
        linkDireto.href = videoURL;

        // Adicionar o link de download ao elemento infosRight, se existir
        if (infosRight) {
            infosRight.appendChild(linkDireto);
        }
    }

    var posts = document.querySelectorAll('.post');

    posts.forEach(function(post, index) {
        // Verificar se o elemento com a classe 'content' foi encontrado dentro do post
        var content = post.querySelector('.content');

        if (content) {
            // Verificar se há um iframe dentro do conteúdo do post
            var iframe = content.querySelector('iframe');
            if (iframe) {
                var iframeSrc = iframe.getAttribute('src');

                // Realizar uma solicitação com GM.xmlHttpRequest
                GM.xmlHttpRequest({
                    method: "GET",
                    url: iframeSrc,
                    onload: function(response) {
                        var regex = /src="([^"]+)"/g;
                        var matches = [];
                        var match;
                        while (match = regex.exec(response.responseText)) {
                            matches.push(match[1]);
                        }

                        if (matches.length >= 4) {
                            var videoURL = 'https:' + matches[3];
                            // Remover todas as ocorrências de '&amp;'
                            videoURL = videoURL.replace(/&amp;/g, "&");

                            // Filtrar apenas as URLs que apontam para vídeos
                            console.log('No Iframe:', index, 'Uma URL de vídeo foi encontrada:', videoURL);

                            // Procurar pelo elemento infosRight dentro do post
                            var infosRight = post.querySelector('.infos .right');

                            // Criar o link de download e adicioná-lo ao elemento infosRight
                            criarLinkDownload(videoURL, infosRight);
                        } else {
                            console.error('No Iframe:', index, 'Não foi possível encontrar a URL do vídeo');
                        }
                    },
                    onerror: function(error) {
                        console.error('Erro ao buscar conteúdo do iframe:', error);
                    }
                });
            } else {
                console.error('No Iframe:', index, 'Nenhum iframe encontrado dentro do post');
            }
        } else {
            console.log('Não foi encontrado o elemento com a classe "content" no post', index);
        }
    });
})();
