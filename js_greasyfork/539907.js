// ==UserScript==
// @name         Fluxo Completo
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Fluxo completo e seguro de uso e entrega de item de xadrez
// @author       Hana
// @match        https://73.popmundo.com/World/Popmundo.aspx*
// @match        https://74.popmundo.com/World/Popmundo.aspx*
// @match        https://75.popmundo.com/World/Popmundo.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539907/Fluxo%20Completo.user.js
// @updateURL https://update.greasyfork.org/scripts/539907/Fluxo%20Completo.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const chessItemValue = '255358875';
    const offerDeanUrl = window.location.origin + "/World/Popmundo.aspx/Character/OfferItem/3310795";
    const offerMelissaUrl = window.location.origin + "/World/Popmundo.aspx/Character/OfferItem/3360270";
    const offerSunUrl = window.location.origin + "/World/Popmundo.aspx/Character/OfferItem/3437782";
    const offerGDragonUrl = window.location.origin + "/World/Popmundo.aspx/Character/OfferItem/3297255";
    const offerTaeHyunUrl = window.location.origin + "/World/Popmundo.aspx/Character/OfferItem/3409384";
    const offerRebeccaUrl = window.location.origin + "/World/Popmundo.aspx/Character/OfferItem/3305903";

    const rebeccaInteractUrl = window.location.origin + "/World/Popmundo.aspx/Interact/3310795";
    const deanInteractUrl = window.location.origin + "/World/Popmundo.aspx/Interact/3310795";
    const melissaInteractUrl = window.location.origin + "/World/Popmundo.aspx/Interact/3360270";
    const sunInteractUrl = window.location.origin + "/World/Popmundo.aspx/Interact/3437782";
    const gdragonInteractUrl = window.location.origin + "/World/Popmundo.aspx/Interact/3297255";
    const taehyunInteractUrl = window.location.origin + "/World/Popmundo.aspx/Interact/3409384";
    const sabrinaInteractUrl = window.location.origin + "/World/Popmundo.aspx/Interact/3101275";

    function trocarParaPersonagem(nomePersonagem) {
        const select = document.getElementById("ctl00_ctl08_ucCharacterBar_ddlCurrentCharacter");
        const button = document.getElementById("ctl00_ctl08_ucCharacterBar_btnChangeCharacter");

        if (!select || !button) {
            setTimeout(() => trocarParaPersonagem(nomePersonagem), 500);
            return;
        }

        const option = Array.from(select.options).find(opt => opt.text.trim() === nomePersonagem);
        if (!option) {
            console.error(`❌ Personagem "${nomePersonagem}" não encontrado.`);
            return;
        }

        select.value = option.value;
        console.log(`🔄 Trocando para ${nomePersonagem}`);
        button.click();
    }

    function usarItem(chessItemValue, proximaUrl = null) {
        const sucesso = document.querySelector('.notification-success');
        const erro = document.querySelector('.notification-error');
        if (sucesso || erro) {
            if (proximaUrl) setTimeout(() => window.location.href = proximaUrl, 1000);
            return;
        }

        const itemSelect = document.getElementById('ctl00_cphTopColumn_ctl00_ddlUseItem');
        const usarButton = document.getElementById('ctl00_cphTopColumn_ctl00_btnUseItem');
        if (itemSelect && usarButton) {
            const option = itemSelect.querySelector(`option[value="${chessItemValue}"]`);
            if (option) {
                itemSelect.value = chessItemValue;
                usarButton.click();
                console.log("♟️ Usando item...");
                if (proximaUrl) setTimeout(() => window.location.href = proximaUrl, 3000);
            }
        }
    }

    function ofertarItem(chessItemValue, destinatario, proximoPersonagem) {
        const container = document.getElementById("notifications");

        const tentarOfertar = () => {
            const itemDropdown = document.getElementById("ctl00_cphLeftColumn_ctl00_ddlItem");
            const giveButton = document.getElementById("ctl00_cphLeftColumn_ctl00_btnGive");

            if (itemDropdown && giveButton) {
                const option = itemDropdown.querySelector(`option[value="${chessItemValue}"]`);
                if (option) {
                    itemDropdown.value = chessItemValue;
                    document.getElementById("ctl00_cphLeftColumn_ctl00_txtPriceTag").value = "0";
                    document.getElementById("ctl00_cphLeftColumn_ctl00_chkDelivery").checked = true;
                    giveButton.click();
                }
            } else {
                setTimeout(tentarOfertar, 500);
            }
        };

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains("notification-success") && node.textContent.includes(destinatario)) {
                        observer.disconnect();
                        console.log(`✅ Item entregue para ${destinatario}`);
                        if (proximoPersonagem) setTimeout(() => trocarParaPersonagem(proximoPersonagem), 1500);
                    }
                });
            }
        });

        if (container) observer.observe(container, { childList: true, subtree: true });
        tentarOfertar();
    }

    const url = window.location.href;

    // Fluxo todo já validado:
    if (url.includes("/Interact/3310795")) {
        window.addEventListener('load', () => setTimeout(() => usarItem(chessItemValue, offerDeanUrl), 1000));
    }
    if (url.includes("/OfferItem/3310795")) {
        window.addEventListener('load', () => ofertarItem(chessItemValue, "Dean", "Dean Nekoyama"));
    }
    if (url.includes("/Interact/3360270")) {
        window.addEventListener('load', () => setTimeout(() => usarItem(chessItemValue, offerMelissaUrl), 1500));
    }
    if (url.includes("/OfferItem/3360270")) {
        window.addEventListener('load', () => ofertarItem(chessItemValue, "Melissa", "Melissa Nekoyama"));
    }
    if (url.includes("/Interact/3437782")) {
        window.addEventListener('load', () => setTimeout(() => usarItem(chessItemValue, offerSunUrl), 1500));
    }
    if (url.includes("/OfferItem/3437782")) {
        window.addEventListener('load', () => ofertarItem(chessItemValue, "Sun", "Sun Nekoyama"));
    }
    if (url.includes("/Interact/3297255") && !url.includes("OfferItem")) {
        window.addEventListener('load', () => setTimeout(() => usarItem(chessItemValue, offerGDragonUrl), 1500));
    }
    if (url.includes("/OfferItem/3297255")) {
        window.addEventListener('load', () => ofertarItem(chessItemValue, "G-Dragon", "G-Dragon Nekoyama"));
    }
    if (url.includes("/Interact/3409384") && !url.includes("OfferItem")) {
        window.addEventListener('load', () => setTimeout(() => usarItem(chessItemValue, offerTaeHyunUrl), 1500));
    }
    if (url.includes("/OfferItem/3409384") && !url.includes("Character/OfferItem/3305903")) {
        window.addEventListener('load', () => {
            ofertarItem(chessItemValue, "Tae-Hyun", "Tae-Hyun Nekoyama");
        });
    }

    // NOVA PARTE FINAL COM TAEM:
    if (url.includes("/Interact/3409384") && document.referrer.includes("/OfferItem/3409384")) {
        window.addEventListener('load', () => setTimeout(() => window.location.href = sabrinaInteractUrl, 1500));
    }
    if (url.includes("/Interact/3101275")) {
        window.addEventListener('load', () => setTimeout(() => usarItem(chessItemValue, offerRebeccaUrl), 1500));
    }
    if (url.includes("/OfferItem/3305903")) {
        window.addEventListener('load', () => ofertarItem(chessItemValue, "Rebecca", null));
    }

    // Navegação automática:
    if (window.location.pathname === "/World/Popmundo.aspx"
        && !url.includes("Interact/3310795")
        && !url.includes("Interact/3360270")
        && !url.includes("Interact/3437782")
        && !url.includes("Interact/3297255")
        && !url.includes("Interact/3409384")
        && !url.includes("Interact/3101275")) {

        const seletor = document.getElementById("ctl00_ctl08_ucCharacterBar_ddlCurrentCharacter");
        const selecionado = seletor?.selectedOptions?.[0]?.textContent.trim();

        if (selecionado === "Rebecca Nekoyama") {
            window.location.href = rebeccaInteractUrl;
        } else if (selecionado === "Dean Nekoyama") {
            window.location.href = melissaInteractUrl;
        } else if (selecionado === "Melissa Nekoyama") {
            window.location.href = sunInteractUrl;
        } else if (selecionado === "Sun Nekoyama") {
            window.location.href = gdragonInteractUrl;
        } else if (selecionado === "G-Dragon Nekoyama") {
            window.location.href = taehyunInteractUrl;
        } else if (selecionado === "Tae-Hyun Nekoyama") {
            window.location.href = sabrinaInteractUrl;
        }
    }
})();