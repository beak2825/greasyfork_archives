// ==UserScript==
// @name         Wplace Quick Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Easily go to locations in Wplace! No more mindlessly looking!
// @match        https://wplace.live/*
// @grant        GM_xmlhttpRequest
// @connect      nominatim.openstreetmap.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545765/Wplace%20Quick%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/545765/Wplace%20Quick%20Search.meta.js
// ==/UserScript==

(() => {
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
    document.head.appendChild(fa);

    // toast noti I need to clean this up ngl but really idc rn
    const toast = msg => {
        const t = document.createElement("div");
        Object.assign(t.style, {
            position: "fixed",
            top: "60px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(255,0,0,0.50)",
            color: "#fff",
            padding: "8px 14px",
            borderRadius: "12px",
            zIndex: 9999,
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontWeight: "bold"
        });
        t.innerHTML = `<i class="fas fa-triangle-exclamation"></i>${msg}`;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    };

    const bar = document.createElement("div");
    Object.assign(bar.style, {
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: "#edf2fa",
        borderRadius: "25px",
        padding: "6px 12px",
        border: "1px solid #e2e7ee",
        display: "flex",
        alignItems: "center",
        minWidth: "300px"
    });

    const icon = Object.assign(document.createElement("i"), { className: "fas fa-search" });
    Object.assign(icon.style, { fontSize: "16px", marginRight: "8px", color: "#394e6a" });

    const input = Object.assign(document.createElement("input"), { type: "text", placeholder: "Search..." });
    Object.assign(input.style, { border: "none", outline: "none", flex: 1, fontSize: "14px", background: "transparent" });

    bar.append(icon, input);
    document.body.appendChild(bar);

    // using OSM because wplace uses it for it's map so it should be good
    const search = q => {
        GM_xmlhttpRequest({
            method: "GET",
            url: `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`,
            headers: { Accept: "application/json" },
            onload: r => {
                const d = JSON.parse(r.responseText);
                if (d?.length) {
                    const [lat, lng] = [d[0].lat, d[0].lon];
                    window.location.href = `https://wplace.live/?lat=${lat}&lng=${lng}&zoom=16.0869`;
                } else toast("No results!");
            }
        });
    };

    input.addEventListener("keydown", e => e.key == "Enter" && input.value.trim() && search(input.value.trim()));
    icon.addEventListener("click", () => input.value.trim() && search(input.value.trim()));
})();
