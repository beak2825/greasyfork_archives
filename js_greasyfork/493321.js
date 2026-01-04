// ==UserScript==
// @name         LASTMILEAI BUT CLEANER
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Use CSS to hide specific elements on LastmileAI, including all elements listed in uBlock filters
// @author       Kenny Phan
// @match        https://lastmileai.dev/*
// @grant        GM_addStyle
// @license KennyPhan
// @downloadURL https://update.greasyfork.org/scripts/493321/LASTMILEAI%20BUT%20CLEANER.user.js
// @updateURL https://update.greasyfork.org/scripts/493321/LASTMILEAI%20BUT%20CLEANER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS rules to hide elements, including all elements from uBlock filters
    const cssToHide = `
        .mantine-10t0w3c,
        .mantine-17zj3a3.mantine-Tabs-tabsList,
        .mantine-1dllig4.mantine-Tabs-panel,
        button.mantine-1dgjbjj.mantine-Button-root.mantine-UnstyledButton-root:nth-of-type(2),
        .mantine-1b152b8.mantine-Header-root,
        .mantine-tam6h8.mantine-Navbar-root,
        .mantine-17oit7p,
        #mantine-9xuyx6n15-panel-parameters > div > .mantine-Accordion-content.mantine-731ldn,
        .mantine-17xsarf.mantine-Text-root,
        .mantine-Accordion-content.mantine-731ldn > div > .mantine-caxjnw.mantine-Stack-root > .mantine-k3ov3c.mantine-Group-root > .mantine-q3fg0i.mantine-Stack-root > .mantine-1ejqehl.mantine-Textarea-root.mantine-InputWrapper-root > .mantine-7c7vou.mantine-Textarea-wrapper.mantine-Input-wrapper > .mantine-1uiykof.mantine-Textarea-input.mantine-Input-input,
        .mantine-Accordion-content.mantine-731ldn > div > .mantine-caxjnw.mantine-Stack-root > .mantine-k3ov3c.mantine-Group-root > .mantine-q3fg0i.mantine-Stack-root > .mantine-1ejqehl.mantine-TextInput-root.mantine-InputWrapper-root > .mantine-7c7vou.mantine-TextInput-wrapper.mantine-Input-wrapper > .mantine-xla9f9.mantine-TextInput-input.mantine-Input-input,
        .mantine-Accordion-content.mantine-731ldn > div > .mantine-caxjnw.mantine-Stack-root > .mantine-k3ov3c.mantine-Group-root > .mantine-q3fg0i.mantine-Stack-root,
        .mantine-Accordion-content.mantine-731ldn > div,
        #mantine-qmnx4ejaj-panel-parameters > div > .mantine-Accordion-content.mantine-731ldn,
        #mantine-qmnx4ejaj-control-parameters > .mantine-Accordion-label.mantine-1ghv9ft > .mantine-iq85jv.mantine-Text-root,
        #mantine-qmnx4ejaj-control-parameters > .mantine-Accordion-label.mantine-1ghv9ft,
        #mantine-qmnx4ejaj-control-parameters,
        #mantine-1nhorensf-control-parameters > .mantine-Accordion-chevron.mantine-1rxml5w > svg,
        #mantine-1nhorensf-control-parameters > .mantine-Accordion-label.mantine-1ghv9ft > .mantine-iq85jv.mantine-Text-root,
        .mantine-toieql,
        .mantine-15rwql0,
        .mantine-1fp45n9.mantine-Navbar-root,
        .mantine-p9xwy9 > .mantine-15m4gy7.mantine-Text-root,
        .mantine-p9xwy9 > span,
        .mantine-1bmysm8.mantine-Tabs-root,
        #mantine-3202p22ud-control-parameters,
        button.mantine-1tm2g1c.mantine-Button-root.mantine-UnstyledButton-root:nth-of-type(1),
        .mantine-jnainl.mantine-Button-root.mantine-UnstyledButton-root,
        .mantine-6524a5.mantine-ActionIcon-root.mantine-UnstyledButton-root,
        .mantine-p9xwy9,
        .mantine-1vrw4v5.mantine-Header-root,
        #mantine-gx0u6ekgk-control-parameters,
        #mantine-jppwqhh2q-control-parameters,
        #mantine-rxs4k2sys-control-parameters,
        #mantine-eyq9shdey-control-parameters,
        #mantine-64gzqh8f3-control-parameters > .mantine-Accordion-label.mantine-1ghv9ft > .mantine-17om5oa.mantine-Text-root,
        #mantine-er5s3loy6-control-parameters > .mantine-Accordion-chevron.mantine-1rxml5w,
        #mantine-er5s3loy6-control-parameters > .mantine-Accordion-label.mantine-1ghv9ft > .mantine-17om5oa.mantine-Text-root,
        #mantine-12qbadh96-panel-parameters > div > .mantine-Accordion-content.mantine-731ldn,
        .mantine-Accordion-content.mantine-731ldn > div > .mantine-eq8dvh.mantine-ActionIcon-root.mantine-UnstyledButton-root,
        .mantine-k3ov3c.mantine-Group-root > .mantine-eq8dvh.mantine-ActionIcon-root.mantine-UnstyledButton-root,
        .mantine-q3fg0i.mantine-Stack-root,
        #mantine-fwrqrld6s-panel-parameters > div > .mantine-Accordion-content.mantine-731ldn,
        #mantine-fwrqrld6s-control-parameters {
            display: none !important;
        }
    `;

    // Inject the CSS into the page
    GM_addStyle(cssToHide);
})();