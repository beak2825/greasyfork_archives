// ==UserScript==
// @name            Roblox Font Reverter
// @namespace       Revert Font
// @license         MIT 
// @version         1
// @description     Reverts the horrible font roblox pushed in April.
// @author          zyqunix
// @match           https://www.roblox.com/*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/500511/Roblox%20Font%20Reverter.user.js
// @updateURL https://update.greasyfork.org/scripts/500511/Roblox%20Font%20Reverter.meta.js
// ==/UserScript==

(function() {
    'use strict';



    var link = document.createElement("link"); //font is missing on some systems, so we have to make sure it exists
    link.href = "https://fonts.googleapis.com/css?family=Source+Sans+Pro:100,200,300,400,500,600,700,800,900";
    link.rel = "stylesheet";
    document.getElementsByTagName("head")[0].appendChild(link);

    // below from: https://stackoverflow.com/questions/39346747/tampermonkey-script-run-before-page-load

    new MutationObserver(function(mutations) { //create mutation observer that will observe page changes as the page loads
        if (document.getElementsByClassName('gotham-font')[0]) { //check if any element with "gotham-font" class has been inserted
            var gothamFontElements = document.getElementsByClassName("builder-font"); //get all elements with the "gotham-font" class
            var gothamFontArray = Array.from(gothamFontElements); //create an array from that so we can run .forEach
            gothamFontArray.forEach(function(a){ //run the function for each element with the "gotham-font" class
            });
        }
    }).observe(document, {childList: true, subtree: true}); //observe page changes as the page loads. this stops the ugly ass font from appearing for a split second and stops it from appearing altogether


    // in Sept 2019 HCo Gotham SSm was added as the primary font-family in body and headers. this reverts that change
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p,
    a,
    abbr,
    address,
    area,
    article,
    aside,
    audio,
    b,
    bdi,
    bdo,
    blockquote,
    body,
    br,
    button,
    canvas,
    caption,
    cite,
    code,
    col,
    colgroup,
    data,
    datalist,
    dd,
    del,
    details,
    dfn,
    dialog,
    div,
    dl,
    dt,
    em,
    embed,
    fieldset,
    figcaption,
    figure,
    footer,
    form,
    hgroup,
    header,
    hr,
    i,
    iframe,
    img,
    input,
    ins,
    kbd,
    label,
    legend,
    li,
    main,
    map,
    mark,
    menu,
    menuitem,
    meter,
    nav,
    noscript,
    object,
    ol,
    optgroup,
    option,
    output,
    param,
    picture,
    pre,
    progress,
    q,
    rp,
    rt,
    ruby,
    s,
    samp,
    script,
    section,
    select,
    small,
    source,
    span,
    strong,
    style,
    sub,
    summary,
    sup,
    table,
    tbody,
    td,
    textarea,
    tfoot,
    th,
    thead,
    time,
    title,
    tr,
    track,
    u,
    ul,
    var,
    video,
    wbr {
    font-family: HCo Gotham SSm !important;
}
`;
    document.head.appendChild(styleSheet);


})();