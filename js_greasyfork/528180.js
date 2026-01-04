// ==UserScript==
// @name                Show random verification time
// @namespace           https://greasyfork.org/users/821661
// @match               https://*.superau.la/*
// @grant               none
// @version             1.0
// @require             https://update.greasyfork.org/scripts/526417/1540623/USToolkit.js
// @author              hdyzen
// @description         show random verification time
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/528180/Show%20random%20verification%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/528180/Show%20random%20verification%20time.meta.js
// ==/UserScript==

function waitElement(selector) {
    return new Promise((resolve, reject) => {
        const callback = () => {
            const target = document.querySelector(selector);
            if (target) resolve(target);
        };

        const observer = new MutationObserver(callback);

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });
}

async function init() {
    try {
        const dataFutura = new Date(JSON.parse(localStorage.getItem("db-v6")).CurrentSession.AulaEmAndamento.ValidacaoAleatoria.CandidatoConvocacoes[0].HoraConvocacaoAleatoria);
        const restante = await waitElement(".chat__header__title:has(> :nth-child(2))");
        const aleatoria = document.createElement("span");
        aleatoria.style.marginLeft = "6px";
        restante.appendChild(aleatoria);

        const intervalo = setInterval(() => {
            const agora = new Date();
            const tempoRestante = dataFutura - agora;

            if (tempoRestante <= 0) {
                clearInterval(intervalo);
                console.log("A data futura foi alcançada!");
            } else {
                const segundos = Math.floor((tempoRestante / 1000) % 60);
                const minutos = Math.floor((tempoRestante / (1000 * 60)) % 60);
                const horas = Math.floor((tempoRestante / (1000 * 60 * 60)) % 24);

                aleatoria.textContent = `• ${horas}h${minutos}m${segundos}s`;
                // console.log(`${horas}h${minutos}m${segundos}s`);
            }
        }, 1000);
    } catch (error) {
        console.error("Error: ", error);
    }
}
init();
