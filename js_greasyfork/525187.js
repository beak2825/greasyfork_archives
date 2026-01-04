// ==UserScript==
// @name            Google Search Anti-AI Content Filter
// @name:es         Filtro Anti contenido generado por IA en Google
// @namespace       xxxxxxxxxxxxxx
// @version         1.51
// @description     Automatically appends Anti-AI tags to Google search queries.
// @description:es  Añade automaticamente las etiquetas para evitar contenido generado por IA en Google.
// @author          fLTC
// @match           https://www.google.*/search*
// @include         http*://images.google.*/images*
// @include         http*://www.google.*/images*
// @icon            https://no-ai-icon.com/wp-content/uploads/2023/02/no-ai-icon-01.svg
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/525187/Google%20Search%20Anti-AI%20Content%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/525187/Google%20Search%20Anti-AI%20Content%20Filter.meta.js
// ==/UserScript==
 
 (function () {
    "use strict";

    const url = new URL(window.location.href);  // Get the current URL
    const queryParams = url.searchParams;       // Get the search query parameters
    let query = queryParams.get('q');           // Get the current search query (q parameter)
    const termsToExclude = [
        "AI*",
        "stable diffusion",
        "ai",
        "midjourney",
        "generative art",
        "text-to-image",
        "prompt",
        "ai-generated"
    ];

    // Check if terms have already been added to avoid duplicates
    if (query && typeof query === 'string') {
        let appendTerms = "";

        // Exclude terms using advanced operators
        termsToExclude.forEach(term => {
            if (!query.includes(`-${term}`)) {
                appendTerms += ` -${term}`;
            }
        });

        // If there are terms to add, update the query and parameters
        if (appendTerms) {
            query += appendTerms;
            queryParams.set('q', query);

            // Redirect with the updated parameters
            window.location.replace(url.toString());
        }
    }
})();