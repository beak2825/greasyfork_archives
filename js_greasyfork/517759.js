// ==UserScript==
// @name                Brainly Unleashed
// @name:pt-BR          Brainly Unleashed
// @icon                https://styleguide.brainly.com/images/favicons/brainly/favicon-8bc2eedef6.ico
// @version             1.1
// @namespace           sasd
// @author              R4wwd0G
// @description         Debloats some annoying windows.
// @description:pt-br   Remove popups irritantes, blur e outras coisas.
// @license             MIT
// @include             *://brainly*
// @downloadURL https://update.greasyfork.org/scripts/517759/Brainly%20Unleashed.user.js
// @updateURL https://update.greasyfork.org/scripts/517759/Brainly%20Unleashed.meta.js
// ==/UserScript==



window.addEventListener('load', () => {
    const a = () => {
        document.querySelectorAll(
            '.didomi-popup-backdrop.didomi-notice-popup.didomi-popup__backdrop, ' +
            '.js-dialog.sg-dialog__overlay.sg-dialog__overlay--size-l.sg-dialog__overlay--open--light.sg-dialog__overlay--motion-default.sg-dialog__overlay--scroll.sg-dialog__overlay--open, ' +
            '.js-dialog.sg-dialog__overlay.sg-dialog__overlay--size-m.sg-dialog__overlay--open--light.sg-dialog__overlay--motion-default.sg-dialog__overlay--scroll.sg-dialog__overlay--open'
        ).forEach(b => b.remove());
    };

    const c = new MutationObserver((d) => {
        d.forEach((e) => {
            if (e.type === 'childList') {
                a();
            }
        });
    });

    c.observe(document.body, {
        childList: true,
        subtree: true
    });

    a();

    setInterval(() => {
        a();
    }, 5000);

    const f = () => {
        const g = document.createElement('style');
        g.innerHTML = `
            html, body {
                overflow: auto !important;
                height: auto !important;
                position: static !important;
            }
        `;
        document.head.appendChild(g);

        ['scroll', 'wheel', 'keydown', 'touchmove'].forEach(h => {
            window.addEventListener(h, (i) => i.stopPropagation(), { capture: true, passive: false });
        });
    };

    f();

    localStorage.clear();
});

