// ==UserScript==
// @name               Discord Login with Token
// @name:ar            Discord Login with Token
// @name:bg            Discord Login with Token
// @name:ckb           Discord Login with Token
// @name:cs            Discord Login with Token
// @name:da            Discord Login with Token
// @name:de            Discord Login with Token
// @name:el            Discord Login with Token
// @name:en            Discord Login with Token
// @name:eo            Discord Login with Token
// @name:es            Discord Login with Token
// @name:fi            Discord Login with Token
// @name:fr            Discord Login with Token
// @name:fr-CA         Discord Login with Token
// @name:he            Discord Login with Token
// @name:hr            Discord Login with Token
// @name:hu            Discord Login with Token
// @name:id            Discord Login with Token
// @name:it            Discord Login with Token
// @name:ja            Discord Login with Token
// @name:ka            Discord Login with Token
// @name:ko            Discord Login with Token
// @name:nb            Discord Login with Token
// @name:nl            Discord Login with Token
// @name:pl            Discord Login with Token
// @name:pt-BR         Discord Login with Token
// @name:ro            Discord Login with Token
// @name:ru            Discord Login with Token
// @name:sk            Discord Login with Token
// @name:sr            Discord Login with Token
// @name:sv            Discord Login with Token
// @name:th            Discord Login with Token
// @name:tr            Discord Login with Token
// @name:uk            Discord Login with Token
// @name:ug            Discord Login with Token
// @name:vi            Discord Login with Token
// @name:zh-CN         Discord Login with Token
// @name:zh-TW         Discord Login with Token
// @description        Login with your Discord token quickly.
// @description:ar     Login with your Discord token quickly.
// @description:bg     Login with your Discord token quickly.
// @description:ckb    Login with your Discord token quickly.
// @description:cs     Login with your Discord token quickly.
// @description:da     Login with your Discord token quickly.
// @description:de     Login with your Discord token quickly.
// @description:el     Login with your Discord token quickly.
// @description:en     Login with your Discord token quickly.
// @description:eo     Login with your Discord token quickly.
// @description:es     Login with your Discord token quickly.
// @description:fi     Login with your Discord token quickly.
// @description:fr     Login with your Discord token quickly.
// @description:fr-CA  Login with your Discord token quickly.
// @description:he     Login with your Discord token quickly.
// @description:hr     Login with your Discord token quickly.
// @description:hu     Login with your Discord token quickly.
// @description:id     Login with your Discord token quickly.
// @description:it     Login with your Discord token quickly.
// @description:ja     Login with your Discord token quickly.
// @description:ka     Login with your Discord token quickly.
// @description:ko     Login with your Discord token quickly.
// @description:nb     Login with your Discord token quickly.
// @description:nl     Login with your Discord token quickly.
// @description:pl     Login with your Discord token quickly.
// @description:pt-BR  Login with your Discord token quickly.
// @description:ro     Login with your Discord token quickly.
// @description:ru     Login with your Discord token quickly.
// @description:sk     Login with your Discord token quickly.
// @description:sr     Login with your Discord token quickly.
// @description:sv     Login with your Discord token quickly.
// @description:th     Login with your Discord token quickly.
// @description:tr     Login with your Discord token quickly.
// @description:uk     Login with your Discord token quickly.
// @description:ug     Login with your Discord token quickly.
// @description:vi     Login with your Discord token quickly.
// @description:zh-CN  Login with your Discord token quickly.
// @description:zh-TW  Login with your Discord token quickly.
// @author             fir4tozden
// @version            1.5
// @license            MIT
// @namespace          https://greasyfork.org/users/821317
// @match              *://*.discord.com/login
// @match              *://*.discord.com/channels/*
// @icon               https://www.google.com/s2/favicons?domain=discord.com&sz=256
// @downloadURL https://update.greasyfork.org/scripts/483983/Discord%20Login%20with%20Token.user.js
// @updateURL https://update.greasyfork.org/scripts/483983/Discord%20Login%20with%20Token.meta.js
// ==/UserScript==

(async () => {
    let e = e => {
            setInterval(() => {
                let o = document.createElement("iframe");
                document.body.appendChild(o)
                    .contentWindow.localStorage.token = '"' + e + '"'
            }), setTimeout(() => location.href = "/app", 1e3)
        }
        , o = prompt("Login with your Discord token", "");
    o && e(o)
})();