// ==UserScript==
// @name        BF - Compartilhamento de Link
// @name:pt-BR  BF - Compartilhamento de Link
// @namespace   https://github.com/BrunoFortunatto
// @version     1.1
// @description Compartilhe links de maneira rápida e estilosa!
// @description:pt-BR Compartilhe links de maneira rápida e estilosa!
// @author      Seu Nome
// @match       *://*/*
// @grant       GM_registerMenuCommand
// @license     MIT // Adição da Licença MIT
// @downloadURL https://update.greasyfork.org/scripts/537629/BF%20-%20Compartilhamento%20de%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/537629/BF%20-%20Compartilhamento%20de%20Link.meta.js
// ==/UserScript==

/*
 * Licença MIT
 *
 * Copyright (c) 2025 Seu Nome
 *
 * É concedida permissão, gratuitamente, a qualquer pessoa que obtenha uma cópia
 * deste software e dos arquivos de documentação associados (o "Software"), para
 * negociar o Software sem restrições, incluindo, sem limitação, os direitos de
 * usar, copiar, modificar, mesclar, publicar, distribuir, sublicenciar e/ou vender
 * cópias do Software, e para permitir que as pessoas a quem o Software é
 * fornecido o façam, sujeito às seguintes condições:
 *
 * O aviso de direitos autorais acima e este aviso de permissão devem ser incluídos
 * em todas as cópias ou partes substanciais do Software.
 *
 * O SOFTWARE É FORNECIDO "COMO ESTÁ", SEM GARANTIA DE QUALQUER TIPO, EXPRESSA OU
 * IMPLÍCITA, INCLUINDO, MAS NÃO SE LIMITANDO ÀS GARANTIAS DE COMERCIALIZAÇÃO,
 * ADEQUAÇÃO A UM FIM ESPECÍFICO E NÃO VIOLAÇÃO. EM NENHUM CASO OS AUTORES OU
 * PROPRIETÁRIOS DOS DIREITOS AUTORAIS SERÃO RESPONSÁVEIS POR QUALQUER RECLAMAÇÃO,
 * DANOS OU OUTRA RESPONSABILIDADE, SEJA EM UMA AÇÃO DE CONTRATO, DANO OU DE OUTRA
 * FORMA, DECORRENTE DE, FORA DE OU EM CONEXÃO COM O SOFTWARE OU O USO OU OUTRAS
 * NEGOCIAÇÕES NO SOFTWARE.
 */

(function() {
    'use strict';

    // Adiciona opção ao menu do Tampermonkey
    GM_registerMenuCommand("📤 Compartilhar Link", showOverlay);

    function showOverlay() {
        // Impedir execução em iframes
        if (window.self !== window.top) {
            return;
        }

        // Remover overlays existentes antes de criar um novo
        let existingOverlay = document.getElementById('share-overlay');
        if (existingOverlay) {
            document.body.removeChild(existingOverlay);
        }

        let overlay = document.createElement('div');
        overlay.id = 'share-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0, 0, 0, 0.4)';
        overlay.style.backdropFilter = 'blur(8px)';
        overlay.style.zIndex = '10001';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease-in-out';

        setTimeout(() => { overlay.style.opacity = '1'; }, 50);

        let box = document.createElement('div');
        box.style.background = 'linear-gradient(135deg, #2C2C3C, #1E1E2E)';
        box.style.color = '#FFFFFF';
        box.style.padding = '20px';
        box.style.borderRadius = '15px';
        box.style.boxShadow = '0px 6px 15px rgba(0, 0, 0, 0.5)';
        box.style.textAlign = 'center';
        box.style.width = '90%';
        box.style.maxWidth = '350px';
        box.style.display = 'flex';
        box.style.flexDirection = 'column';
        box.style.alignItems = 'center';

        let title = document.createElement('h2');
        title.innerText = 'Compartilhar Link';
        title.style.color = '#FFD700';
        title.style.fontSize = '20px';
        title.style.marginBottom = '12px';
        box.appendChild(title);

        let currentLink = window.location.href;
        let linkInput = document.createElement('input');
        linkInput.value = currentLink;
        linkInput.style.width = '100%';
        linkInput.style.padding = '10px';
        linkInput.style.marginBottom = '15px';
        linkInput.style.border = 'none';
        linkInput.style.borderRadius = '8px';
        linkInput.style.background = '#FFF';
        linkInput.style.color = '#333';
        linkInput.style.textAlign = 'center';
        linkInput.style.fontSize = '16px';
        linkInput.readOnly = true;
        box.appendChild(linkInput);

        let buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.width = '100%';
        box.appendChild(buttonContainer);

        let copyButton = document.createElement('button');
        copyButton.innerText = '📋 Copiar Link';
        copyButton.style.width = '100%';
        copyButton.style.padding = '12px';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '8px';
        copyButton.style.background = '#FFD700';
        copyButton.style.color = '#000';
        copyButton.style.fontWeight = 'bold';
        copyButton.style.cursor = 'pointer';
        copyButton.onclick = async function() {
            try {
                await navigator.clipboard.writeText(linkInput.value);
                copyButton.innerText = '✅ Copiado!';
            } catch (err) {
                console.error('Falha ao copiar: ', err);
                copyButton.innerText = '❌ Erro ao Copiar!';
            }
            setTimeout(() => copyButton.innerText = '📋 Copiar Link', 2000);
        };
        buttonContainer.appendChild(copyButton);

        let mobileShareButton = document.createElement('button');
        mobileShareButton.innerText = '📲 Compartilhar Via Sistema';
        mobileShareButton.style.width = '100%';
        mobileShareButton.style.marginTop = '12px';
        mobileShareButton.style.padding = '12px';
        mobileShareButton.style.border = 'none';
        mobileShareButton.style.borderRadius = '8px';
        mobileShareButton.style.background = '#3B82F6';
        mobileShareButton.style.color = '#FFF';
        mobileShareButton.style.fontWeight = 'bold';
        mobileShareButton.style.cursor = 'pointer';
        mobileShareButton.onclick = function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Link Compartilhado',
                    text: 'Confira este link:',
                    url: currentLink
                }).catch(error => {
                    console.log('Erro ao compartilhar:', error);
                    alert('Não foi possível compartilhar. Tente copiar o link!');
                });
            } else {
                alert('Compartilhamento nativo não suportado neste navegador. Por favor, use as opções abaixo ou copie o link.');
            }
        };
        buttonContainer.appendChild(mobileShareButton);

        let shareApps = [
            { name: "📧 E-mail", url: `mailto:?subject=Link&body=${encodeURIComponent(currentLink)}`, color: "#FF5722" },
            { name: "🟢 WhatsApp", url: `https://api.whatsapp.com/send?text=${encodeURIComponent(currentLink)}`, color: "#25D366" },
            { name: "🔵 Facebook", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentLink)}`, color: "#1877F2" },
            { name: "📢 Telegram", url: `https://t.me/share/url?url=${encodeURIComponent(currentLink)}`, color: "#0088CC" },
            { name: "🐦 Twitter (X)", url: `https://twitter.com/share?url=${encodeURIComponent(currentLink)}`, color: "#000000" },
            { name: "💼 LinkedIn", url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentLink)}`, color: "#0077B5" }
        ];

        shareApps.forEach(app => {
            let shareButton = document.createElement('button');
            shareButton.innerText = app.name;
            shareButton.style.width = '100%';
            shareButton.style.marginTop = '8px';
            shareButton.style.padding = '12px';
            shareButton.style.border = 'none';
            shareButton.style.borderRadius = '8px';
            shareButton.style.background = app.color;
            shareButton.style.color = '#FFF';
            shareButton.style.fontWeight = 'bold';
            shareButton.style.cursor = 'pointer';
            shareButton.onclick = function() {
                window.open(app.url, '_blank');
            };
            buttonContainer.appendChild(shareButton);
        });

        let closeButton = document.createElement('button');
        closeButton.innerText = '❌ Fechar';
        closeButton.style.width = '100%';
        closeButton.style.marginTop = '15px';
        closeButton.style.padding = '12px';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '8px';
        closeButton.style.background = '#FF4500';
        closeButton.style.color = '#FFF';
        closeButton.style.fontWeight = 'bold';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = function() {
            overlay.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(overlay)) {
                    document.body.removeChild(overlay);
                }
            }, 300);
        };
        box.appendChild(closeButton);

        overlay.appendChild(box);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function(event) {
            if (event.target === overlay) {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (document.body.contains(overlay)) {
                        document.body.removeChild(overlay);
                    }
                }, 300);
            }
        });
    }

})();