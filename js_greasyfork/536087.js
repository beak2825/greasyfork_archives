// ==UserScript==
// @name        BZUCO Permanentka Update
// @description Umožňuje aktualizovat počet vstupenek, i když má sada nastavený custom interval.
// @license     MIT; https://opensource.org/licenses/MIT
// @namespace   localhost
// @match       https://*.bzuco.cloud/admin/*/tickets/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @version     0.1
// @downloadURL https://update.greasyfork.org/scripts/536087/BZUCO%20Permanentka%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/536087/BZUCO%20Permanentka%20Update.meta.js
// ==/UserScript==

const $ = this.jQuery = jQuery.noConflict(true); // eslint-disable-line

class AjaxException extends Error {
    status;
    nestedErrors;

    constructor(message, status, nestedErrors = []) {
        super(message);

        this.status = status;
        this.nestedErrors = nestedErrors;
    }
}

class BzucoAjax {
    #timeout = 3000;

    #handleError(message, jqXHR) {
        let response;

        try {
            // odpovědí z Bzuco serveru je pole chybových hlášek
            response = JSON.parse(jqXHR.responseText);
        } catch (e) {
            response = jqXHR.responseText && jqXHR.responseText.length > 0? [jqXHR.responseText]: [];
        }

        if (jqXHR.status >= 299) {
            throw new AjaxException(message, jqXHR.status, response);
        }

        throw new AjaxException('Neočekávaná chyba při AJAX volání', jqXHR.status, response);
    }

    async get(url) {
        try {
            return await $.ajax({
                url: url,
                type: 'GET',
                timeout: this.#timeout,
                cache: false
            });
        } catch (jqXHR) {
            this.#handleError('Chyba při volání Bzuco API (GET)', jqXHR);
        }
    }

    async put(url, data) {
        try {
            return await $.ajax({
                url: url,
                type: 'PUT',
                timeout: this.#timeout,
                cache: false,
                contentType: 'application/json; charset=utf-8',
                data: JSON.stringify(data)
            });
        } catch (jqXHR) {
            this.#handleError('Chyba při volání Bzuco API (PUT)', jqXHR);
        }
    }
}

class ModalExtender {
    /**
     * Called for each modal dialog after the page is loaded.
     * 
     * @return true, if the modal will be watched for openings
     */ 
    modalLoaded(root, modal) {}

    /**
     * Called when a modal dialog is opened (shown).
     */ 
    modalOpened(root, modal) {}

    #watchOpening(root, modal) {
        new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) this.modalOpened(root, modal);
            });
        }, { rootMargin: '0px', threshold: 1.0 }).observe(modal[0]);
    }

    run() {
        const appDiv = $('#app div');

        if (appDiv.length === 0) return;

        const root = $(appDiv[0].shadowRoot);
        const self = this;

        (function waitForPageLoad() {
            new MutationObserver((mutations, observer) => {
                const modals = root.find('.content').find('.modal');

                modals.each(function() { 
                    const modal = $(this);

                    if (self.modalLoaded(root, modal)) {
                        observer.disconnect();

                        self.#watchOpening(root, modal);
                    }
                });
            }).observe(root[0], { childList: true, subtree: true });
        })();
    }
}

class TicketsetModalExtender extends ModalExtender {
    #ajax = new BzucoAjax();

    modalLoaded(root, modal) {
        // zkontrolovat, zda jde o správný dialog
        if (modal.find('.modal-title:contains("Upravit sadu")').length === 0) return false;

        // přidat tlačítko pro custom uložení údajů sady
        const footer = modal.find('.modal-footer');
        footer.append(`<button id="saveCountBtn" type="button" class="btn btn-primary" style="background-color: green">Uložit počet</button>`);
        footer.find('#saveCountBtn').on('click', () => this.saveTicketset(modal));

        return true;
    }

    modalOpened(root, modal) {
        const match = location.pathname.match(/^.*\/(?<tsId>\d+)\/?$/);
        const tsId = Number(match.groups['tsId']);

        modal.data('oldTsData', null);
        
        this.#ajax.get(`/apiv2/ticketsets/${tsId}?lang=cs`).then(data => {
            modal.data('oldTsData', data);

            if (data.entry_pause) {
                const desc = `Permanentka (po ${data.entry_pause} min.)`;

                modal.find('#ticketset-ticket-type option[value="season"]').text(desc);
            }
        });
    }

    closeModal(modal) {
        modal.find('#modal-close').click();
    }

    saveTicketset(modal) {
        const newCount = modal.find('#ticketset-count').val();
        const ts = modal.data('oldTsData');

        if (!ts) {
            this.closeModal(modal);
            alert('Nebyly načteny aktuální údaje sady!');
            return;
        }

        this.#ajax.put(`/apiv2/ticketsets/${ts.id}?lang=cs`, {
            count:         newCount,
            event_id:      ts.event_id,
            type:          ts.type,
            color:         ts.color,
            default_since: ts.default_since,
            default_until: ts.default_until,
            preview:       ts.preview,
            ticket_fields: ts.ticket_fields,
            order:         ts.order,
            entries:       ts.entries,
            entry_pause:   ts.entry_pause,
            validity:      ts.validity,
            texts:         ts.texts
        }).then(data => {
            this.closeModal(modal);

            if (data.id == ts.id && data.count == newCount) {
                alert('Údaje sady byly uloženy.');

                // workaround kvůli aktualizaci zobrazených počtů
                location.reload();
            } else {
                alert('Údaje sady patrně nebyly uloženy.');
            }
        }, () => {
            alert('Při ukládání údajů sady došlo k chybě!');
        });
    }
}

new TicketsetModalExtender().run();