// ==UserScript==
// @name         /r/Place Zade CHAD Template
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Draws a template on top of the canvas showing where to click and what colors to use.  Does not do any clicking for you.
// @author       lob, oralekin
// @match        https://hot-potato.reddit.com/embed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442739/rPlace%20Zade%20CHAD%20Template.user.js
// @updateURL https://update.greasyfork.org/scripts/442739/rPlace%20Zade%20CHAD%20Template.meta.js
// ==/UserScript==
if (window.top !== window.self) {
    window.addEventListener('load', () => {

        //If canvas stretches again, the width and height must be changed here.
        const canvasWidth = 2000;
        const canvasHeight = 1000;

        let root = document.getElementsByTagName("mona-lisa-embed")[0].shadowRoot.children[0];
        let canvas = root.getElementsByTagName("mona-lisa-canvas")[0].shadowRoot.children[0];
        let buttonRow = document.createElement("div");

        buttonRow.id = "visibility-toggle-row";
        buttonRow.style = "position: absolute; left: 0; top: 0; margin: 0.75em; margin-left: 7em;";
        root.appendChild(buttonRow);


        const imgs = [
            {
                name: 'Zade CHAD',
                src: 'https://raw.githubusercontent.com/bhdrozgn/r-place/main/place_template.png',
            },
            /*Copy, paste, and add new layers here.
            {
                name: '', //text for the button togglers in top left.
                src: '',  //Link to tracer image. Should be a transparent png with dimensions of 2000,2000 (preferred) or 1000,1000.  Must line up exactly with canvas.  Edit in pixel dithering to make it stand out more.
            },
            */
        ];


        imgs.forEach(img => {
            img.overlay = document.createElement("img");
            img.overlay.src = img.src;
            img.overlay.id = img.id;
            img.overlay.style = "position: absolute;left: 0;top: 0;image-rendering: pixelated;width: "+canvasWidth+"px;height: "+canvasHeight+"px;opacity:0.90;";
            console.log(img.overlay);
            canvas.appendChild(img.overlay);

            img.button = document.createElement("button");
            img.button.innerText = img.name;
            img.button.style.margin = '1em';
            img.button.style.background = 'white';
            img.button.style.borderRadius = '2em';
            img.button.style.height = '30px';

            buttonRow.appendChild(img.button);
        });

        root.addEventListener('click', function (event) {
            if (!event.target.matches('#visibility-toggle-row button')) {
                return;
            }

            let img = imgs.find(img => img.name === event.target.innerText);

            if (!img) {
                return;
            }

            event.preventDefault();

            if (img.overlay.style.visibility != 'hidden') {
                img.overlay.style.visibility = 'hidden';
                img.button.style.background = 'darkgray';
                return;
            } else {
                img.overlay.style.visibility = 'visible';
                img.button.style.background = 'white';
                return;
            }

        });//end event click

    }, false);//end event load

}//end window top