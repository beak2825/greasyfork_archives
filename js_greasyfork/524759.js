// ==UserScript==
// @name        Convidador de casamentos
// @namespace   Violentmonkey Scripts
// @description Convida todo mundo da lista de relacionamentos
// @include     https://*.popmundo.com/World/Popmundo.aspx/Locale/MarriagePartners*
// @grant       none
// @license     MIT
// @version     1.9
// @author      -
// @description Atualizado para aguardar o botão de convite dinamicamente
// @downloadURL https://update.greasyfork.org/scripts/524759/Convidador%20de%20casamentos.user.js
// @updateURL https://update.greasyfork.org/scripts/524759/Convidador%20de%20casamentos.meta.js
// ==/UserScript==

(function () {
    function AwaitIframeLoad(iframe) {
        return new Promise((resolve) => {
            iframe.on('load', function () {
                resolve(iframe.contents());
            });
        });
    }

    async function waitForInviteButton(iframe, id) {
        return new Promise((resolve) => {
            const interval = setInterval(async () => {
                const newContents = iframe.contents();
                const inviteButton = newContents.find(`#ctl00_cphLeftColumn_ctl00_repDetailsFindGuest_ctl01_btnInvite`);

                if (inviteButton.length > 0) {
                    const buttonElement = iframe[0].contentDocument.getElementById(
                        "ctl00_cphLeftColumn_ctl00_repDetailsFindGuest_ctl01_btnInvite"
                    );

                    if (buttonElement) {
                        clearInterval(interval);
                        resolve();
                    }
                }
            }, 1000);
        });
    }

    if (typeof jQuery === 'undefined') {
        return;
    }

    if (window.self !== window.top) {
        return;
    }

    function checkForTargetDiv() {
        const targetDiv = jQuery('.ofauto.bmargin10');

        if (targetDiv.length > 0) {
            addCustomUI(targetDiv);
            return true;
        } else {
            return false;
        }
    }

    function addCustomUI(targetDiv) {
        const newDiv = jQuery(`
            <div>
                <input type="button" class="cnf" value="Convidar da lista de relacionamentos" />
                <p id="status" style="display: none; margin-top: 10px; font-size: 14px; color: green;"></p>
            </div>
        `);
        targetDiv.after(newDiv);

        jQuery('.cnf').on('click', async function () {
            const statusParagraph = jQuery('#status');
            statusParagraph.text('Iniciando os convites...').show();

            const iframe = jQuery('<iframe>', {
                style: 'width: 400px; height: 400px; border: 0; display: none; position: absolute; z-index: 9999;',
            }).appendTo('body');

            iframe.attr('src', '/World/Popmundo.aspx/Character/Relations/');
            const iframeContents = await AwaitIframeLoad(iframe);

            const ids = [];
            iframeContents.find('a').each(function () {
                const href = jQuery(this).attr('href');
                if (href && href.includes('/World/Popmundo.aspx/Character/')) {
                    const idMatch = href.match(/\/Character\/(\d+)/);
                    if (idMatch && idMatch[1]) {
                        ids.push(idMatch[1]);
                    }
                }
            });

            iframe.attr('src', window.location.href);
            await AwaitIframeLoad(iframe);
            let newContents = iframe.contents();
            newContents.find('input[name="ctl00$cphLeftColumn$ctl00$repUpcomingWeddings$ctl01$btnWeddingDetails"]').click();
            await AwaitIframeLoad(iframe);

            for (const id of ids) {
                try {
                    statusParagraph.text(`Convidando o ID ${id}...`);
                    iframe.attr('src', window.location.href);
                    await AwaitIframeLoad(iframe);
                    newContents = iframe.contents();
                    newContents.find('input[name="ctl00$cphLeftColumn$ctl00$repUpcomingWeddings$ctl01$btnWeddingDetails"]').click();
                    await AwaitIframeLoad(iframe);
                    newContents = iframe.contents();
                    newContents.find('input[name="ctl00$cphLeftColumn$ctl00$txtDetailsFindCharacterID"]').val(id);
                    newContents.find('input[name="ctl00$cphLeftColumn$ctl00$btnDetailsFind"]').click();
                    await AwaitIframeLoad(iframe);
                    await waitForInviteButton(iframe, id);

                    iframe[0].contentDocument.getElementById(
                        "ctl00_cphLeftColumn_ctl00_repDetailsFindGuest_ctl01_btnInvite"
                    ).click();
                    await AwaitIframeLoad(iframe);
                } catch (e) {
                    // Erro silencioso
                }
            }

            statusParagraph.text('Todos os convites foram enviados!');
            iframe.remove();
        });
    }

    const interval = setInterval(() => {
        if (checkForTargetDiv()) {
            clearInterval(interval);
        }
    }, 500);
})();
