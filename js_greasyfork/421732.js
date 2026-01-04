// ==UserScript==
// @name         Ogar
// @namespace    Zagar [Ogar]
// @version      1.0
// @description  Official Zagar Ogar Version
// @author       Esael
// @match        *://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/421732/Ogar.user.js
// @updateURL https://update.greasyfork.org/scripts/421732/Ogar.meta.js
// ==/UserScript==

// © ZAGAR 2021
if (location.host === 'agar.io' && location.pathname === '/') {
    window.stop();
    location.href = 'https://agar.io/ogario' + location.hash;
    return
};
document.documentElement.innerHTML = '<frameset rows="*"> <frame frameborder="0" src="https://zagar.tk" name="dot_tk_frame_content" scrolling="auto" noresize=""> </frameset>';