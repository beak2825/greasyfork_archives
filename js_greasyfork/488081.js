// ==UserScript==
// @name        Download videos do naointendo.com.br
// @namespace   downloaddiretonaointendo
// @match       https://www.naointendo.com.br/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @description Um Scrapper que facilita o Download de videos do nãointendo.com.br
// @license     Unlicense
// @description 23/02/2024, 01:52:53
// @downloadURL https://update.greasyfork.org/scripts/488081/Download%20videos%20do%20naointendocombr.user.js
// @updateURL https://update.greasyfork.org/scripts/488081/Download%20videos%20do%20naointendocombr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function criarLinkDownload(videoLink, articleDOM) {
        var linkDireto = document.createElement('a');
        linkDireto.textContent = 'Download';
        linkDireto.style = 'color: red; float: right; font-size: 16px; margin-right: 10px;';
        linkDireto.href = videoLink;
        if (articleDOM) {
            articleDOM.appendChild(linkDireto);
        }
    }

    // Função para extrair link de vídeo de um post
    function extractVideoLink(post) {
        // Verificar se o tipo de mídia é HTML e se há conteúdo
        if (post.type === 'html' && post.media.content) {
            // Fazer regex para encontrar o link do vídeo
            var regex = /src="(https:\/\/streamable\.com\/[^"]+)"/g;
            var match = regex.exec(post.media.content);
            if (match && match.length > 1) {
                return match[1];
            }
        }
        return null;
    }

    // Função principal para buscar posts e extrair links de vídeo
    function extractVideoLinksFromPosts(posts, index, videoLink) {
        console.log('Iniciando extração de links de vídeo...');
        // Iterar sobre cada post
        posts.forEach(function(post, index) {
            var videoLink = extractVideoLink(post);
            if (videoLink) {
                console.log('No post', post.title, 'um Link do vídeo foi encontrado:', videoLink);
                var articleDOM = document.querySelectorAll('article')[index];

                GM_xmlhttpRequest({
                    method: "GET",
                    url: videoLink,
                    onload: function(response) {
                        var regex = /src="([^"]+)"/g;
                        var matches = [];
                        var match;
                        while (match = regex.exec(response.responseText)) {
                            matches.push(match[1]);
                        }

                        if (matches.length >= 4) {
                            var videoLink = 'https:' + matches[3];
                            // Remover todas as ocorrências de '&amp;'
                            var videoLink = videoLink.replace(/&amp;/g, "&");
                            // Filtrar apenas as URLs que apontam para vídeos
                            console.log('O link direto foi encontrado', videoLink);
                            criarLinkDownload(videoLink, articleDOM);
                        } else {
                            console.error('Não foi possível encontrar a URL do vídeo');
                        }
                    }
                });
            } else {
                console.log('Nenhum link de vídeo encontrado para o post:', post.title);
            }
        });
        console.log('Extração de links de vídeo concluída.');
    }

    // URL da API
    var apiUrl;
    if (window.location.href === 'https://www.naointendo.com.br/') {
        console.log('Página inicial detectada. Usando URL direta da API.');
        apiUrl = 'https://www.naointendo.com.br/api/posts?page=1';
    } else {
        var originalUrl = window.location.href;
        console.log('Página específica detectada. Tentando modificar a URL da API...');
        apiUrl = originalUrl.replace(/(\?|&)(page=\d+)/, function(match, p1, p2) {
            return p1 === '?' ? 'api/posts?' + p2 : '&api/posts?' + p2;
        });
    }

    console.log('Nova URL da API:', apiUrl);
    // Obtendo o cookie atual
    var currentCookie = document.cookie;

    // Fazer requisição para a API
    console.log('Fazendo requisição para a API...');
    GM_xmlhttpRequest({
        method: 'GET',
        url: apiUrl,
        headers: {
            'Cookie': currentCookie,
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache',
            'Accept': 'application/json, text/plain, */*',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': window.location.href,
            'Accept-Language': 'pt-BR,pt;q=0.7',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Dest': 'empty',
            'dnt': '1'
        },
        responseType: 'json',
        onload: function(response) {
            console.log('Resposta da API:', response);
            if (response.status === 200) {
                var data = response.response;
                console.log('Dados da resposta:', data);
                if (data) {
                    extractVideoLinksFromPosts(data.posts);
                } else {
                    console.log('Erro: nenhum post encontrado na resposta da API');
                }
            } else {
                console.log('Erro ao acessar a API:', response.statusText);
            }
        },
        onerror: function(error) {
            console.error('Erro ao acessar a API:', error);
        }
    });

    // Criar o link direto após o carregamento inicial da página
    window.addEventListener('load', function() {
        var articleDOM = document.querySelectorAll('article');
        if (articleDOM.length > 0) {
            articleDOM.forEach(function(item, index) {
                var videoLink = extractVideoLink({ type: 'html', media: { content: item.innerHTML } });
                if (videoLink) {
                    criarLinkDownload(extractVideoLinksFromPosts(videoLink), item);
                }
            });
        }
    });
})();