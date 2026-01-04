// ==UserScript==
// @name         Anubis PoW Form Solver
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Compute Anubis PoW and present a manual submission form (works on both old and new Anubis versions)
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535692/Anubis%20PoW%20Form%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/535692/Anubis%20PoW%20Form%20Solver.meta.js
// ==/UserScript==

(async () => {
    
    if (!document.getElementById("anubis_version")){
        return;
    }

    function toHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    }

    async function computePoW(challenge, difficulty) {
        const encoder = new TextEncoder();
        const prefix = "0".repeat(difficulty);
        let nonce = 0;
        while (true) {
            const input = encoder.encode(challenge + nonce);
            const hashBuffer = await crypto.subtle.digest("SHA-256", input);
            const hashHex = toHex(hashBuffer);
            if (hashHex.startsWith(prefix)) return { hash: hashHex, nonce };
            nonce++;
        }
    }

    async function getChallengeAndPrefix() {
        try {
            // Try newer version: embedded challenge
            const challengeEl = document.getElementById("anubis_challenge");
            const prefixEl = document.getElementById("anubis_base_prefix");
            if (challengeEl && prefixEl) {
                const challengeData = JSON.parse(challengeEl.textContent);
                const basePrefix = JSON.parse(prefixEl.textContent);
                return {
                    challenge: challengeData.challenge,
                    difficulty: challengeData.rules.difficulty,
                    basePrefix
                };
            }

            // Fallback to older version: API fetch
            const versionEl = document.getElementById("anubis_version");
            const versionInfo = versionEl ? JSON.parse(versionEl.textContent) : "fallback";

            const apiUrl = `${window.location.origin}/.within.website/x/cmd/anubis/api/make-challenge`;
            const response = await fetch(apiUrl, {
                method: "POST"
            });
            if (!response.ok) throw new Error("Failed to fetch challenge");
            const data = await response.json();
            return {
                challenge: data.challenge,
                difficulty: data.rules.difficulty,
                basePrefix: ""  // older version hardcodes path
            };
        } catch (err) {
            console.error("PoW script failed to initialize:", err);
            return null;
        }
    }

    const challengeInfo = await getChallengeAndPrefix();
    if (!challengeInfo) return;

    const { challenge, difficulty, basePrefix } = challengeInfo;

    console.log("Solving Anubis challenge:", challenge, "(difficulty:", difficulty, ")");

    let newDiv = document.createElement("div");
    newDiv.id = "status";
    const oldP = document.querySelector("p#status");
    if (oldP) {
        oldP.replaceWith(newDiv);
    } else {
        document.body.prepend(newDiv);
    }

    const msg = document.createElement("h2");
    msg.innerText = "Browser Plugin: Computing proof of work...";
    msg.style.color = "red";
    newDiv.appendChild(msg);

    const t0 = performance.now();
    const { hash, nonce } = await computePoW(challenge, difficulty);
    const elapsedTime = Math.round(performance.now() - t0);

    console.log("✅ PoW solved", { hash, nonce, elapsedTime });

    const form = document.createElement("form");
    form.action = `${basePrefix}/.within.website/x/cmd/anubis/api/pass-challenge`;
    form.method = "GET";

    const addField = (name, value) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = value;
        form.appendChild(input);
    };

    addField("response", hash);
    addField("nonce", nonce.toString());
    addField("redir", window.location.href);
    addField("elapsedTime", elapsedTime.toString());

    const label = document.createElement("p");
    label.textContent = `✅ PoW complete (nonce=${nonce}, hash=${hash.slice(0, 12)}...). Click to submit.`;
    form.appendChild(label);

    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Submit Proof of Work →";
    button.style = "padding: 0.5em 1em; font-size: 1em;";
    form.appendChild(button);

    newDiv.replaceChildren(form);
})();
