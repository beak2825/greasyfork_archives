// ==UserScript==
// @name               Discord Get Your Token
// @name:ar            Discord Get Your Token
// @name:bg            Discord Get Your Token
// @name:ckb           Discord Get Your Token
// @name:cs            Discord Get Your Token
// @name:da            Discord Get Your Token
// @name:de            Discord Get Your Token
// @name:el            Discord Get Your Token
// @name:en            Discord Get Your Token
// @name:eo            Discord Get Your Token
// @name:es            Discord Get Your Token
// @name:fi            Discord Get Your Token
// @name:fr            Discord Get Your Token
// @name:fr-CA         Discord Get Your Token
// @name:he            Discord Get Your Token
// @name:hr            Discord Get Your Token
// @name:hu            Discord Get Your Token
// @name:id            Discord Get Your Token
// @name:it            Discord Get Your Token
// @name:ja            Discord Get Your Token
// @name:ka            Discord Get Your Token
// @name:ko            Discord Get Your Token
// @name:nb            Discord Get Your Token
// @name:nl            Discord Get Your Token
// @name:pl            Discord Get Your Token
// @name:pt-BR         Discord Get Your Token
// @name:ro            Discord Get Your Token
// @name:ru            Discord Get Your Token
// @name:sk            Discord Get Your Token
// @name:sr            Discord Get Your Token
// @name:sv            Discord Get Your Token
// @name:th            Discord Get Your Token
// @name:tr            Discord Get Your Token
// @name:uk            Discord Get Your Token
// @name:ug            Discord Get Your Token
// @name:vi            Discord Get Your Token
// @name:zh-CN         Discord Get Your Token
// @name:zh-TW         Discord Get Your Token
// @description        Get your Discord token quickly.
// @description:ar     Get your Discord token quickly.
// @description:bg     Get your Discord token quickly.
// @description:ckb    Get your Discord token quickly.
// @description:cs     Get your Discord token quickly.
// @description:da     Get your Discord token quickly.
// @description:de     Get your Discord token quickly.
// @description:el     Get your Discord token quickly.
// @description:en     Get your Discord token quickly.
// @description:eo     Get your Discord token quickly.
// @description:es     Get your Discord token quickly.
// @description:fi     Get your Discord token quickly.
// @description:fr     Get your Discord token quickly.
// @description:fr-CA  Get your Discord token quickly.
// @description:he     Get your Discord token quickly.
// @description:hr     Get your Discord token quickly.
// @description:hu     Get your Discord token quickly.
// @description:id     Get your Discord token quickly.
// @description:it     Get your Discord token quickly.
// @description:ja     Get your Discord token quickly.
// @description:ka     Get your Discord token quickly.
// @description:ko     Get your Discord token quickly.
// @description:nb     Get your Discord token quickly.
// @description:nl     Get your Discord token quickly.
// @description:pl     Get your Discord token quickly.
// @description:pt-BR  Get your Discord token quickly.
// @description:ro     Get your Discord token quickly.
// @description:ru     Get your Discord token quickly.
// @description:sk     Get your Discord token quickly.
// @description:sr     Get your Discord token quickly.
// @description:sv     Get your Discord token quickly.
// @description:th     Get your Discord token quickly.
// @description:tr     Get your Discord token quickly.
// @description:uk     Get your Discord token quickly.
// @description:ug     Get your Discord token quickly.
// @description:vi     Get your Discord token quickly.
// @description:zh-CN  Get your Discord token quickly.
// @description:zh-TW  Get your Discord token quickly.
// @author             fir4tozden
// @version            1.6
// @license            MIT
// @namespace          https://greasyfork.org/users/821317
// @match              *://*.discord.com/channels/*
// @icon               https://www.google.com/s2/favicons?domain=discord.com&sz=256
// @downloadURL https://update.greasyfork.org/scripts/437442/Discord%20Get%20Your%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/437442/Discord%20Get%20Your%20Token.meta.js
// ==/UserScript==

(async () => {
    let o = localStorage.getItem("token")
        .split('"')
        .join("")
        , t = confirm("Do you want to get your Discord token? 1/3");
    if (!0 === t) { let e = confirm("Do you want to get your Discord token? 2/3"); if (!0 === e) { let n = confirm("Do you want to get your Discord token? 3/3");!0 === n && prompt("Your Discord token", o) } }
})();