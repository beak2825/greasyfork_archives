// ==UserScript==
// @name         SAEskip
// @namespace    https://github.com/teogabrielofc/saeskip
// @version      2.1
// @description  Um UserScript para o AVA SAE DIGITAL que ativa o modo professor no livro digita(depois de 5 segundos), ativa a opção de selecionar e texto e faz o player ficar 100% auto
// @match        *://livrodigital.sae.digital/*
// @match        *://ava.sae.digital/_n/*
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/530460/SAEskip.user.js
// @updateURL https://update.greasyfork.org/scripts/530460/SAEskip.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // libera o texto nas trilhas
    setTimeout(() => {
    document.onselectstart = null;
    document.querySelectorAll('*').forEach(element => {
        element.onselectstart = null;
        element.style.userSelect = 'auto';
        element.style.webkitUserSelect = 'auto';
    });
}, 5000); //botei timeout pq acho que o código é executado antes do texto ser bloqueado


    // função pra ativar o modo professor
   function ativarModoProfessor() {
  try {
    document.body.classList.add('professorActive');
  } catch(e) {}

  document.querySelectorAll('iframe').forEach(function(frame) {
    try {
      frame.contentWindow.document.body.classList.add('professorActive');
    } catch(e) {}
  });
}


    // detecta se tá no livro
if (location.href.startsWith("https://livrodigital.sae.digital/livros")) {
  setTimeout(ativarModoProfessor, 5000);
}



    // botei um toast pro negocio do player
    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '32px';
        toast.style.right = '32px';
        toast.style.background = 'rgba(32,32,32,0.98)';
        toast.style.color = '#fff';
        toast.style.fontSize = '16px';
        toast.style.fontFamily = 'sans-serif';
        toast.style.padding = '12px 24px';
        toast.style.borderRadius = '8px';
        toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        toast.style.zIndex = '9999';
        toast.style.transition = 'opacity 0.5s';
        toast.style.opacity = '1';
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                toast.remove();
                location.reload();
            }, 600);
        }, 2500);
    }

    if (window.location.hostname === "ava.sae.digital") {
        // XMLHttpRequest interception
        const open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...rest) {
            if (method === "POST" && url.includes("apis.sae.digital/ava/answer/video")) {
                this.addEventListener("readystatechange", function() {
                    if (this.readyState === 4 && this.responseURL.includes("apis.sae.digital/ava/answer/video")) {
                        showToast("Progresso do vídeo marcado como 100% (SAEskip)");
                    }
                });

                const send = this.send;
                this.send = function(body) {
                    try {
                        let data = JSON.parse(body);
                        if (data.video_percentage !== undefined) {
                            data.video_percentage = 100;
                            body = JSON.stringify(data);
                        }
                    } catch (e) {}
                    send.call(this, body);
                };
            }
            open.call(this, method, url, ...rest);
        };

        // fetch interception
        window.fetch = new Proxy(window.fetch, {
            apply: async function(target, thisArg, args) {
                let url = args[0];
                let options = args[1] || {};

                if (url.includes("apis.sae.digital/ava/answer/video") && options.method === "POST") {
                    let clone = options.body;
                    if (clone) {
                        let bodyText = await clone.text();
                        let bodyJson = JSON.parse(bodyText);

                        if (bodyJson.video_percentage !== undefined) {
                            bodyJson.video_percentage = 100;
                            options.body = JSON.stringify(bodyJson);
                            showToast("Progresso do vídeo marcado como 100% (SAEskip)");
                        }
                    }
                }

                return target.apply(thisArg, [url, options]);
            }
        });
    }
})();