// ==UserScript==
// @name         Wide Thinkbuddy Screen
// @namespace    http://greasyfork.org/
// @version      2025.07.25.2
// @description  Make Thinkbuddy Chat Wider
// @author       llacoste2000 (https://github.com/llacoste2000)
// @match        https://thinkbuddy.ai/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAABzlBMVEUAAAAvLzotLTc9PUo7O0gqKjRUVGZMTF05OUY0ND8yMjwUFBhKSlpNTVg4OEIoKDEZGR4WFhsaGh95eYk/P0uDg412doNLS1ZDQ1A2NkNQUGIUFBuysriOjphQUFxISFhGRlVERFNAQE5LS1tLS1jn5+c6OkYmJi5cXHAXFxwaGiASEhcTExcZGR2Tk5lkZHRZWWQxMTzLy87Z2do2NkEfHyYeHiUQEBMSEhKdnaqfn6mcnKOPj5h4eH11dXxiYm5fX2VJSVMnJy/BwcVLS1xCQlFOTleVlZg9PUuSkpR2dnlaWl0qKjMiIilAQE4eHiURERMUFBopKTEZGR46Okc0NEBgYHAsLDJEREyioqZuboBubn6BgYdTU2a/v8GOjpRPT18+Pkw9PUk9PUqDg4ZHR0s7O0g3Nzs7O0g1NUApKTEnJzA2NkINDRFDQ1RFRVQqKjQdHSErKzQMDA4tLTdBQU4uLjcfHyZCQk4WFhouLjgwMDo2NkQ9PUstLTowMDcVFRv////m5ujl5ebz8/Tc3N7o6Oqioqrq6uzNzdDy8vOsrLWYmJ2IiJHf3+Ourrimpq+pqa719fbx8fLe3uHT09e7u72pqbKZmaLPz9PiqlP5AAAAgXRSTlMA/v7+/v7+/v7+/uD+/v7+4cUO/v7+/v7+/vsc/v7+/v7+/v39/O/l3tN/cGI4/v7+/vz67uTHtRz+/v7+/v7+/v7+/Pfz8vHx7+zp6OS6qpmMgnBZLCAcD/7+/vj49vb29fPy7ebm5NXQycnCwb28u7etpZ+ckI6MjIR2dWlmZlThsfkFAAACX0lEQVQ4y3WTd1caURTEn4U1CCiooCJBjUYRQQGlqLHFGnuJmt57770Nu4C0AIlG821z3xZOPBzn3/tj7n0zLCtq6/u7F4+6u5dDq24vK9GFL09mrzsGRACnA3OLls2Wo/Ov92xJaOLQguXH/z9/O66NU2JKRe5/rNPmdc+yEp8VxkzVZWXlNRMXRZDOWbQ1K1YAUrbyRI1ez4lyXe2oKBOKx+fxOBAzNVQQ0SwTOl1twx8Ad9b4fOfmCBB3Np3iRHNSFCdlj7N9AO56CHjfuQfY2toVIgo08juIII+BHlryUgAkY2tbeyLWWVHJAb8/IzbpaqtFYGGTMTMHqoytCX5IBQEmfQYQyWOUWxBg/wnUVxlPgohOApyHADL8jt/AopdZ5tNAvL+qQyZiQIHP5bfQnXNu5g727xLRp3gAPLMRfbWf3jIBXFtlLYbB+l8gxGFNxCGr4DSZGifpLZR4iDGPoevyLkok0hY6YpmS6DUM2g9LkChlKgLdjOSxBGfstuHAvrJC+hslJSn1lAqwyLrFvHRbyENRrFHtBRAfM1XeDfsBFAOeGO9F7wMCrzRg25UGcLAP5OXEODEGTL1R5xFXDkBamAKsZ7QtDuDKNxV4emMIyNnnhwGHkYgE7zYKzG6pwGvD1aGca2PJBkiUeoK3nwWSD4v/y7Bh2rXtNQtKc9R+ky9K686zIrEWjjDW06U219rmjAHRBzvsqHrNAm+OPGw8NF/RoOjTozQnSSBlP7ASUXP1ai2S9XnpnDfXdSlBl+7lhZWSoUoEZ6YFoePWJ3aMWtbDZnPIrX13/wBeLPXAm+BVlAAAAABJRU5ErkJggg==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540722/Wide%20Thinkbuddy%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/540722/Wide%20Thinkbuddy%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add custom CSS
    function addCustomCSS() {
        const css = `
            .max-w-784, .max-w-720 {
                max-width: clamp(0px, 80%, 987px);
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    // Apply the CSS after the page finishes loading
    window.addEventListener('load', addCustomCSS);
})();