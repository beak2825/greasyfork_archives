// ==UserScript==
// @name         Flight Rising Color Schemer Bigger Colors 2.0
// @namespace    https://greasyfork.org/users/547396
// @version      2.2
// @description  Modify color box styling with png generation
// @author       https://greasyfork.org/users/547396
// @match        *://fr.fintastic.net/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/html2canvas@1.1.4/dist/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/429869/Flight%20Rising%20Color%20Schemer%20Bigger%20Colors%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/429869/Flight%20Rising%20Color%20Schemer%20Bigger%20Colors%2020.meta.js
// ==/UserScript==

(function() {

    /* zoom in/out within browser for better shapes && sizing */

    var alignment = 'center', // options: center | flex-start | flex-end
        wrap = 'wrap', // options: wrap | nowrap
        colorWidth = '20px',
        colorHeight = '20px',
        colorRadius = '999em',
        colorSpacing = '.15rem .075rem',
        borderWidth = '2px',
        borderColor = '#111',
        maxWidth = '100%'; // can be numeric ie. 500px

    var baseCss = `
            body { background: #fff; }
            h2.center { display: none; }
            .colorlist { width: 100% !important; display: flex; justify-content: ${alignment}; margin: unset; }
            canvas { border-top: 2px solid #222; padding-top: 1rem; margin: 2rem auto; height: auto!important; }
            #form button { float: right; margin: .5rem 0 2rem; }
            #content { width: 100%; max-width: ${maxWidth}; text-align: center; }
            #palettes { clear: both; margin: 0 auto; display: flex; flex-wrap: ${wrap}; align-items: center; justify-content: center;  }
            .border { margin: ${colorSpacing}; border: ${borderWidth} solid ${borderColor}; width: ${colorWidth}!important; height: ${colorHeight}!important; border-radius: ${colorRadius};}
    `;

    if ( wrap == 'nowrap' ) {
        baseCss += '.colorlist { flex: 0; margin: 0 1rem !important; }';
    }

    var container = document.getElementById('palettes'),
        form = document.getElementById('form'),
        content = document.getElementById('content'),
        style = document.createElement('style'),
        node = document.createTextNode(baseCss),
        generate = document.createElement('button');

    generate.innerHTML = 'Generate Image';
    form.appendChild(generate);
    container.appendChild(style);
    style.appendChild(node);

    generate.addEventListener('click', generateImage);

    function generateImage(){
        let currentCanvas = document.getElementsByTagName('canvas')[0];

        if ( currentCanvas ) {
            content.removeChild(currentCanvas);
        }

        html2canvas(container, { backgroundColor: 'rgba(0, 0, 0, 0)', removeContainer: true }).then(canvas => {
            content.appendChild(canvas)

            var image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            var a = document.createElement('a');
            a.href = image;
            a.download = 'colors.png';
            a.click();
        });
    }
})();