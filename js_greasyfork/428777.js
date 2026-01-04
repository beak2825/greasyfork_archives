// ==UserScript==
// @name         ArgimonPls
// @namespace    https://vacunacovid.catsalut.gencat.cat
// @version      0.3
// @description  Millora la interficie de usuari de la web Vacuna Covid de CatSalut
// @author       Unofficial
// @match        https://vacunacovid.catsalut.gencat.cat/*
// @icon         https://www.google.com/s2/favicons?domain=gencat.cat
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428777/ArgimonPls.user.js
// @updateURL https://update.greasyfork.org/scripts/428777/ArgimonPls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    customElements.whenDefined("appointment-center-selection").then(() => {
        const c = customElements.get("appointment-center-selection");

        c.prototype.improveUI = function() { // add refresh button
            let div = this.shadowRoot.querySelector(".refreshdiv");
            if (!div) div = document.createElement("div");
            div.className = "refreshdiv";
            div.style = "margin-bottom: 16px; --mdc-theme-primary: #8ebcf9; --mdc-theme-on-primary: #000";
            div.innerHTML = `<mwc-button raised="" label="⟳ Refrescar"></mwc-button>`;
            div.querySelector("mwc-button").onclick = () => this.refreshCenters();
            if (!div.parentNode) {
                this.shadowRoot.querySelector("[label=Centre]").insertAdjacentElement('beforebegin', div);
            }
        };

        c.prototype.refreshCenters = async function() {
            let selId = this.centerSelect.value;
            this.centerSelect.value = null;
            this.calendarDays = [];
            this.disabledDays = [];
            await this.getCenters();
            if (this.centers.length === 1 || this.centers.length > 0 && selId === null) {
                selId = this.centers[0].centerId;
            }
            if (selId !== null && this.centers.find(c => c.centerId === selId)) {
                setTimeout(() => {
                    this.centerSelect.value = selId;
                    this.onSelect({ currentTarget: { value: selId } });
                }, 1);
            }
        };


        if (!c.prototype.firstUpdatedOld) {
            c.prototype.firstUpdatedOld = c.prototype.firstUpdated;
        }
        c.prototype.firstUpdated = function() {
            this.improveUI();
            this.firstUpdatedOld.apply(this, arguments);
        };


        const modules = Object.values(__fuse.c).filter(m => m.exports.getSFCenters);
        const requests = Object.values(__fuse.c).find(m => m.exports.doFetch).exports;
        for (const m of modules) {
            if (!m.exports.getSFCentersOld) {
                m.exports.getSFCentersOld = m.exports.getSFCenters;
            }
            m.exports.getSFCenters = async function() {
                let e = await requests.doFetch("/sf/centers");
                if (e.error === "cod6" || window.DEBUG_COD6) {
                    e = [{"city":"N/A","centerId":"9999","centerDescription":"Cap centre disponible","availableDays":[]}];
                }
                if (e.error) {
                    return (this.setCenters(e), Promise.resolve(e));
                }
                const r = e.reduce(((e,t)=>e.concat({
                    ...t,
                    availableDays: t.availableDays.map((e=>{
                        try {
                            return new Date(e.substr(4, 4),e.substr(2, 2) - 1,e.substr(0, 2))
                        } catch (e) {
                            return
                        }
                    })).filter((e=>e))
                })), []);
                return (this.setCenters(r), Promise.resolve(r));
            };
        }


        try {
            let instance = document.querySelector("body > vaccinapp-app").shadowRoot.querySelector("#pages > vaccinapp-shell").shadowRoot.querySelector("#main-shell-content > appointment-shell").shadowRoot.querySelector("#appointment-shell-content > appointment-selection").shadowRoot.querySelector("#selection-shell-content > appointment-center-selection");
            instance.improveUI();
        } catch (err) {}

    });

})();