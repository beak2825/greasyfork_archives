// ==UserScript==
// @name         Unlock DeepSqueak model
// @namespace    https://github.com/irsat000/cai-unlock-deepsynth
// @version      2025-07-28
// @description  Define o modelo "Deep Synth" como padrão em chats do Character.AI+ (CAI+)
// @author       İrşat Akdeniz (modificado por Wallace)
// @match        https://character.ai/chat/*
// @icon         https://character.ai/favicon.ico
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/543919/Unlock%20DeepSqueak%20model.user.js
// @updateURL https://update.greasyfork.org/scripts/543919/Unlock%20DeepSqueak%20model.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAccessToken() {
        const meta = document.querySelector('meta[cai_token]');
        return meta?.getAttribute('cai_token') || null;
    }

    GM_registerMenuCommand('Definir Deep Synth como padrão', setDeepSynthAsDefault);

    function setDeepSynthAsDefault() {
        const token = getAccessToken();
        if (!token) {
            alert("❌ Token de acesso não encontrado.\nCertifique-se de que a extensão CAI Tools está ativa.");
            return;
        }

        fetch("https://plus.character.ai/chat/user/update_settings/", {
            method: "POST",
            headers: {
                "accept": "application/json, text/plain, */*",
                "authorization": token,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                modelPreferenceSettings: {
                    defaultModelType: "MODEL_TYPE_DEEP_SYNTH"
                }
            }),
        })
        .then(res => {
            if (res.ok) {
                alert("✅ SUCESSO!\nO modelo Deep Synth foi definido como padrão.\nRecarregue a página para aplicar.");
            } else {
                throw new Error("Erro HTTP: " + res.status);
            }
        })
        .catch(err => {
            alert("❌ Falha ao definir Deep Synth como padrão:\n" + err.message);
        });
    }
})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-07-28
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();