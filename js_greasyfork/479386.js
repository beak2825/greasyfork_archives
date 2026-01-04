// ==UserScript==
// @name        Download videos do ahnegao.com.br
// @namespace   directlinkahnegao
// @match       https://www.ahnegao.com.br/*
// @grant       none
// @version     1.0
// @author      --
// @description Um Scrapper que facilita o Download de videos do AhNegão.com.br
// @homepageURL https://greasyfork.org/pt-BR/scripts/479386-link-direto-ahnegao-com-br
// @license     Unlicense
// @downloadURL https://update.greasyfork.org/scripts/479386/Download%20videos%20do%20ahnegaocombr.user.js
// @updateURL https://update.greasyfork.org/scripts/479386/Download%20videos%20do%20ahnegaocombr.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Função para criar link de download
    function criarLinkDownload(videoURL, comentarios) {
        var linkDireto = document.createElement('a');
        linkDireto.textContent = 'Download';
        linkDireto.style = 'font-size: 28px; color: red; float: top; margin-left: 10px;';
        linkDireto.href = videoURL;

        // Adicionar o link de download ao elemento comentarios, se existir
        if (comentarios) {
            comentarios.appendChild(linkDireto);
        }
    }

    var posts = document.querySelectorAll('.entry-content');

    // Itera sobre cada elemento usando forEach
    posts.forEach(function(post, index) {
        var URL = post.querySelector('.eosb_video_wrapper');
        if (URL) {
            var Estilo = URL.getAttribute('style')
            var regex = /url\((https:\/\/[^)]+)\)/; // Expressão regular para extrair a URL
            var match = regex.exec(Estilo);
            if (match) {
                var videoURL = match[1];
                console.log('Link da img:', videoURL);
                videoURL = videoURL.replace(/_mp4(.+?)\.jpg/, '.mp4');
                console.log('Link do vídeo:', videoURL);

                // Encontre a .post-tags
                var comentarios = post.querySelector('.post-tags');

                if (comentarios) {
                    console.log('.post-tags encontrada.');

                    // Adicione o link de download abaixo de .post-tags
                    criarLinkDownload(videoURL, comentarios);
                    console.log('Botão adicionado à div .post-tags.');
                } else {
                    console.log('Div .post-tags não encontrada.');
                }
            }
        }
    });
})();
