// ==UserScript==
// @name         Forums Fav
// @namespace    Forums Fav
// @version      0.24.1
// @description  Modification Forum Ajax + Set local Storage
// @author       Test
// @icon         https://images.emojiterra.com/google/noto-emoji/unicode-15/color/128px/1f6e1.png
// @match        *://www.jeuxvideo.com/profil/*?mode=infos
// @match        *://www.jeuxvideo.com/profil/*?mode=favoris
// @match        *://www.jeuxvideo.com/profil/*?mode=page_perso
// @match        *://www.jeuxvideo.com/
// @match        *://www.jeuxvideo.com/sso/infos_pseudo.php?*
// @match        *://risibank.fr/embed*
// @license      none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483900/Forums%20Fav.user.js
// @updateURL https://update.greasyfork.org/scripts/483900/Forums%20Fav.meta.js
// ==/UserScript==



if (location.href.includes('jeuxvideo.com/forums/0-')) {
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        if (typeof body === "string") {
            if (body.includes("id_forum=") && body.includes("id_topic=0")) {
                //Forum 15-18 => 103 et -15 => Genesis
                body = body.replace("id_forum=50", "id_forum=103");
                body = body.replace("id_forum=15", "id_forum=3021265");
            }
        }
        return origSend.call(this, body);
    };
}


const pseudoRisibank = "vulkan";


if (location.hostname.endsWith("jeuxvideo.com") && (location.pathname === "/")) {
    localStorage.setItem("newsletterPopinLastShown", String(Date.now()));
    if (confirm("Set Local Storage ?")) {
        localStorage.setItem('jvchat-mod-show-pseudo', 'false');
        localStorage.setItem('stickersjvc-div', 'fluffy');
        localStorage.setItem('risibank-userscript-selected-username', pseudoRisibank);

        //RISIBANK TEMP
        const iframe = document.createElement("iframe");
        iframe.src = `https://risibank.fr/embed`;
        iframe.style.cssText = "display : none;";
        document.body.appendChild(iframe);

        console.log("Les éléments ont été modifiés !");
        }
}


//==============RISIBANK=IFRAME==================


if (location.href.includes('https://risibank.fr/embed')) {
    (async () => {
        const promptSet = prompt("Entrer un pseudo risibank :", pseudoRisibank);
        if (!promptSet) return;
        const reponse = await fetch(`https://risibank.fr/api/v1/users/by-username/${promptSet}`);
        const fetchUser = await reponse.json();
        localStorage.removeItem("recentMedias");
        localStorage.setItem(
            "auth",
            JSON.stringify({
                tokenRaw: "",
                tokenParsed: {
                    user: {
                        id: fetchUser.id,
                        username_custom: fetchUser.username_custom,
                        is_mod: fetchUser.is_mod,
                        is_admin: fetchUser.is_admin
                    },
                    /* created_at: new Date(Date.now()).toISOString(), */
                    /* expires_at: new Date(Date.now() + 7 * 864e5).toISOString() */
                    created_at: "",
                    expires_at: ""
                },
                user: fetchUser
            })
        );
    })();
}
