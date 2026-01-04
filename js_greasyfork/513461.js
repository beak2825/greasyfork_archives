// ==UserScript==
// @name         Wide ChatGPT Screen (Full Width)
// @namespace    http://greasyfork.org/
// @version      2024-10-21
// @description  Make ChatGPT answers full width
// @author       nopa12 (https://github.com/nopa12)
// @match        https://chatgpt.com/*
// @license      MIT
// @icon         data:image/webp;base64,UklGRnICAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSI8AAAABd6A2kg06/T5EcqGIzkREILWfPrI5RTitte1pXprvniGwKHzbgMMgjMAkHAaB9HhUevJ9U+T/6T6i/wzctm0kde/27hVA1LJgHQAoiCX2Hvw3S62UnAc0rkOEtyHir7C+QPMbSg48lz0vKU1fl0ZUNyHRH8Pf4Tt0/Wb4Ow5/53QI3XzKKRVk8v/IxeB/BgBWUDggvAEAABALAJ0BKiAAIAA+aSqQRaQioZv6rABABoS0gAnAHJxnoP3rMm/kBkKFPL/yvok/1/878zXyp/g/cC/jv9A/x35fdjN7Hf7ANdIJ5yn1lcylRWD9msH+g4lCVG3DwlB27AAA/v/b7x/k//Og4rBakFx39Od09+fJ1x4C+DLOrn57IHc1Tex5U/5cB8l2f3fZBiD+5/7/IowL/9h145ee+E8Tn9Mx//ya2jMrsF0MWumdxn7zRJ7f7BEicBZVfKYEwPy/e9nUZPOkR9QyW1vCwpKLT4HeJVe7ayZ4dcQRfzMR0TeGbvw8U5I+jHciOCqPs43iwvLybOhARP2A/54Jx8B2XKJ3NgHNzVi3W2HkTpisnFaSV2NcPAhURRCHCp9wAwR12+PxPlPateeyuKpswYl1DEzNt/SkXzDPkSq/LyuOSsHuqlcmY8ch6wMlzG7JlrkvSIL3kuB6BS6sByZZXCNqJoa/4vqVhG8NdvpsjyX6hpz5DqxYMDrvqnl1//oedvi9KU2f/8I6YzFjiLYx5bH31D5eTMZBT8kqCpoNVnHwfQz5KqJRnU9pk4JVJRwRO0gt0GsehqDyZAAAAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513461/Wide%20ChatGPT%20Screen%20%28Full%20Width%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513461/Wide%20ChatGPT%20Screen%20%28Full%20Width%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add custom CSS
    function addCustomCSS() {
        const css = `
            @media (min-width: 1280px) {
                .xl\\:max-w-\\[48rem\\] {
                    max-width: 100%;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // Apply the CSS after the page finishes loading
    window.addEventListener('load', addCustomCSS);
})();