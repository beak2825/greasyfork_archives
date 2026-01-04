// ==UserScript==
// @name         ageverification.dev — Abbreviation Helper
// @namespace    fabulous.cupcake.jp.net
// @version      2025.07.27.3
// @description  Document is almost unreadable with all its acronyms and abbreviations
// @author       FabulousCupcake
// @match        https://ageverification.dev/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543772/ageverificationdev%20%E2%80%94%20Abbreviation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/543772/ageverificationdev%20%E2%80%94%20Abbreviation%20Helper.meta.js
// ==/UserScript==

const ABBREVS = [
    ["AP", "Attestation Provider"],
    ["ARF", "Architecture and Reference Framework"],
    ["AV app", "Age Verification App"],
    ["AVI", "Age Verification App Instance"],
    ["AVAP", "Age Verification App Provider"],
    ["CA", "Certificate Authority"],
    ["DG CNECT", "Directorate General Network, Content and Technology"],
    ["eIDAS", "Electronic Identification, Authentication and Trust Services"],
    ["EU", "European Union"],
    ["EUDI", "European Digital Identity"],
    ["EUDIW /EUDI Wallet", "European Digital Identity Wallet"],
    ["LoA", "Level of Assurance"],
    ["U", "User"],
    ["RP", "Relying Party"],
    ["T-Scy", "Scytáles & T-Systems Age consortium"],
    ["WB", "Web Browser (or web app)"],
    ["ZKP", "Zero Knowledge Proof"],

    ["ETSI", "European Telecommunications Standards Institute"],
];

const applyAbbreviationHints = (string) => {
    let result = string;
    ABBREVS.forEach(a => {
        const [abbr, title] = a;
        const el = `<abbr title="${title}">${abbr}</abbr>`;
        const pattern = new RegExp(`([ (])${abbr}(s?[ .,;?!)])`, "g");
        result = result.replaceAll(pattern, `$1${el}$2`);
    });

    return result;
}

const processAllParagraphs = () => {
    const paragraphs = document.querySelectorAll(`article p`);
    paragraphs.forEach(p => {
        const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT);
        while (true) {
            const node = walker.nextNode();
            if (!node) break;

            const el = applyAbbreviationHints(node.nodeValue);
            node.parentNode.insertAdjacentHTML("afterbegin", el);
            node.remove();
        }
    });
}

const main = () => {
    processAllParagraphs();
}

main();