// ==UserScript==
// @name                Passeidireto
// @name:pt-BR          Passeidireto
// @icon                https://upload.wikimedia.org/wikipedia/commons/e/e9/Pd_avatar_linkedin.png
// @version             3.4
// @namespace           sasd
// @author              R4wwd0G
// @description         Disables the Blur Effect and removes the paywall.
// @description:pt-br   Desabilita o Efeito Blur e remove o paywall.
// @license             MIT
// @include             /^https:\/\/www\.passeidireto\.com\/(arquivo|pergunta)\/.*/
// @downloadURL https://update.greasyfork.org/scripts/517235/Passeidireto.user.js
// @updateURL https://update.greasyfork.org/scripts/517235/Passeidireto.meta.js
// ==/UserScript==

                 


window.addEventListener('load', () => {
    const a = (b) => {
        if (b.style && b.style.filter && b.style.filter.includes('blur')) {
            const c = b.cloneNode(true);
            c.style.filter = 'none';
            b.replaceWith(c);
        }
    };

    const d = (e) => {
        if (e.classList && [...e.classList].some(f => f.startsWith('TrialOrUploadBanner_container__'))) {
            e.remove();
        }
        if (e.classList && e.classList.contains('BannerSelector_banner-container__lwUxw')) {
            e.remove();
        }
        if (e.classList && e.classList.contains('NewStickyBanner_container__jwxmP') && e.classList.contains('NewStickyBanner_visible__gYrxw')) {
            e.remove();
        }
        if (e.classList && e.classList.contains('QnAPaywallFreeTrial_paywallFreeTrial__lK8sD') && e.classList.contains('AnswerCard_card-paywall-free-trial__ENVTg')) {
            e.remove();
        }
    };

    const f = (g) => {
        if (g.style && g.style.transform && /scale\(1\.8[0-9]*\)/.test(g.style.transform)) {
            const h = g.cloneNode(true);
            h.style.transform = g.style.transform.replace(/scale\(1\.8[0-9]*\)/, 'scale(1.700)');
            g.replaceWith(h);
        }
    };

    const s = document.querySelector('style');
    if (s) {
        s.innerHTML = '*,p,div{user-select:text!important;-moz-user-select:text!important;-webkit-user-select:text!important;}';
    }

    const g = new MutationObserver((h) => {
        h.forEach((i) => {
            if (i.type === 'childList') {
                i.addedNodes.forEach((j) => {
                    if (j.nodeType === 1) {
                        a(j);
                        d(j);
                        f(j);
                    }
                });
            } else if (i.type === 'attributes' && i.attributeName === 'style') {
                a(i.target);
                f(i.target);
            }
        });
    });

    g.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style'],
    });

    setInterval(() => {
        document.querySelectorAll('*').forEach((k) => {
            a(k);
            d(k);
            f(k);
        });
    }, 2000);

    document.querySelectorAll("*").forEach((l) => {
        a(l);
        d(l);
        f(l);
    });
});
