// ==UserScript==
// @name         Important Links MRCD BR
// @namespace    Open important tools for title review
// @version      1.1
// @description  Open important tools for title review
// @author       keumanzo
// @match        https://moderation-central.prime-video.amazon.dev/tasks/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      Amazon Internal Use Only
// @downloadURL https://update.greasyfork.org/scripts/526582/Important%20Links%20MRCD%20BR.user.js
// @updateURL https://update.greasyfork.org/scripts/526582/Important%20Links%20MRCD%20BR.meta.js
// ==/UserScript==
// v1.0 script created.

    document.addEventListener('DOMContentLoaded', function() {
    // Create the container div
    const linkContainer = document.createElement('div');
    linkContainer.innerHTML = `
        <div style="
            position: fixed;
            left: 20px;
            bottom: 11px;
            background-color: white;
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 1000;
            border: 1px solid #ddd;
        ">
            <div style="
                display: flex;
                flex-direction: row;
                gap: 10px;
            ">
                <a href="https://policy.a2z.com/docs/564831/publication#6-4" target="_blank" style="
                    color: #0066c0;
                    text-decoration: none;
                    font-family: Arial, sans-serif;
                ">BR SOP</a>

                <a href="https://w.amazon.com/bin/view/Amazon_Video/MRCDBRAZILdecisiontrees" target="_blank" style="
                    color: #0066c0;
                    text-decoration: none;
                    font-family: Arial, sans-serif;
                ">BR Wiki</a>

                <a href="https://classindportal.mj.gov.br/consulta-filmes" target="_blank" style="
                    color: #0066c0;
                    text-decoration: none;
                    font-family: Arial, sans-serif;
                ">Official Website</a>

                <a href="https://quip-amazon.com/meGZAjf6oFC3/BR-Repository#temp:C:bWV812637253d4248ffa300ba6ea" target="_blank" style="
                    color: #0066c0;
                    text-decoration: none;
                    font-family: Arial, sans-serif;
                ">BR Repository</a>
            </div>
        </div>
    `;

    // Add hover effects
    const links = linkContainer.getElementsByTagName('a');
    for (let link of links) {
        link.addEventListener('mouseenter', function() {
            this.style.textDecoration = 'underline';
        });
        link.addEventListener('mouseleave', function() {
            this.style.textDecoration = 'none';
        });
    }

    // Add the container to the page
    document.body.appendChild(linkContainer);
});