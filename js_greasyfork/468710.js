// ==UserScript==
// @name Squabbles.io Enhancement Suite
// @description A userscript (Greasemonkey/Tampermonkey) to provide quality of life improvements for Squabbles.io.
// @version 0.2.1
// @author Waaamb
// @match *://*.squabbles.io/*
// @grant none
// @icon https://www.google.com/s2/favicons?sz=64&domain=squabbles.io
// @namespace https://github.com/waaamb/SquabblesEnhancementSuite
// @downloadURL https://update.greasyfork.org/scripts/468710/Squabblesio%20Enhancement%20Suite.user.js
// @updateURL https://update.greasyfork.org/scripts/468710/Squabblesio%20Enhancement%20Suite.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const main = () => {
        const btnScrollToTop = new ScrollToTopButton();
        btnScrollToTop.create();

        const navbarButtonsSelector = '.navbar .container > div:last-of-type .rounded-circle';
        const navbarButtonsNormalizer = new IconButtonNormalizer(navbarButtonsSelector);
        observeDOM(navbarButtonsNormalizer, navbarButtonsNormalizer.normalize);
    }

    class ScrollToTopButton {

        #app;
        #button;
        size;

        constructor (size = '3rem') {
            this.size = size;

            this.#button = document.createElement('button');
            this.#app = document.querySelector('#app');
        }

        create () {

            // Create the scroll-to-top button...
            this.#button.id = 'btnScrollToTop';
            const btnClasses = ['btn', 'btn-lg', 'rounded-circle', 'btn-secondary',
                            'position-fixed', 'bottom-0', 'end-0', 'm-3'];
            this.#button.classList.add(...btnClasses);

            // ...and add its icon
            let buttonIcon = document.createElement('i');
            const iconClasses = ['fa-solid', 'fa-up'];
            buttonIcon.classList.add(...iconClasses);
            this.#button.appendChild(buttonIcon);

            // Add it to the DOM
            document.body.appendChild(this.#button);

            // Style the button *after* it's been messed with by the DOM
            const btnScrollToTop = document.querySelector("#btnScrollToTop");
            btnScrollToTop.style.display = 'none';
            btnScrollToTop.style.width = this.size;
            btnScrollToTop.style.height = this.size;
            btnScrollToTop.style.padding = '0';
            const btnScrollToTopIcon = btnScrollToTop.querySelector('i');
            btnScrollToTopIcon.style.margin = 'auto';
            btnScrollToTop.addEventListener('click', () => {
                this.#app.scrollTo({top: 0, left: 0, behavior: 'smooth'});
            });

            // Show the button after the page is scrolled down a little
            this.#app.onscroll = () => {
                if (this.#app.scrollTop > 20) {
                    btnScrollToTop.style.display = 'flex';
                }
                else {
                    btnScrollToTop.style.display = 'none';
                }
            };
        }
    }

    class IconButtonNormalizer {

        selector;
        size;
        shape;
        
        static Shapes = {
            round: 'round',
            square: 'square'
        }

        constructor (selector, size = '2.5em', shape = IconButtonNormalizer.Shapes.round) {
            this.selector = selector;
            this.size = size;
            this.shape = shape;
        }

        normalize () {
            if (!(this.shape in IconButtonNormalizer.Shapes)) {
                throw new Error('Button shape not recognized!');
            }

            let buttons = document.querySelectorAll(this.selector);

            for (let button of buttons) {
                button.style.display = 'flex';
                button.style.width = this.size;
                button.style.height = this.size;
                button.style.padding = '0';
                let buttonIcon = button.querySelector('i');
                if (buttonIcon) { buttonIcon.style.margin = 'auto'; }
            }
        }
    }

    // Mostly borrowed from Squabbler smile-eh
    // Watch the DOM for changes, and inform the object of what it should do
    const observeDOM = (self, callback, 
        e = document.documentElement, 
        config = { attributes: 1, childList: 1, subtree: 1 }
    ) => {
        const observer = new MutationObserver(callback.bind(self));
        observer.observe(e, config);
        return () => observer.disconnect();
    };

    main();

})();