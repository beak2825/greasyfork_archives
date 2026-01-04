// ==UserScript==
// @name         Baselinker+
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Zestaw usprawnień do Baselinker
// @author       Paweł Kaczmarek
// @match        https://panel.baselinker.com/*
// @match        https://panel-a.baselinker.com/*
// @match        https://panel-b.baselinker.com/*
// @match        https://panel-c.baselinker.com/*
// @match        https://panel-d.baselinker.com/*
// @match        https://panel-e.baselinker.com/*
// @match        https://panel-f.baselinker.com/*
// @match        https://panel-g.baselinker.com/*
// @match        https://panel-h.baselinker.com/*
// @match        https://panel-i.baselinker.com/*
// @match        https://panel-j.baselinker.com/*
// @match        https://panel-k.baselinker.com/*
// @match        https://panel-l.baselinker.com/*
// @match        https://panel-m.baselinker.com/*
// @match        https://panel-n.baselinker.com/*
// @match        https://panel-o.baselinker.com/*
// @match        https://panel-p.baselinker.com/*
// @match        https://panel-q.baselinker.com/*
// @match        https://panel-r.baselinker.com/*
// @match        https://panel-s.baselinker.com/*
// @match        https://panel-t.baselinker.com/*
// @match        https://panel-u.baselinker.com/*
// @match        https://panel-v.baselinker.com/*
// @match        https://panel-w.baselinker.com/*
// @match        https://panel-x.baselinker.com/*
// @match        https://panel-y.baselinker.com/*
// @match        https://panel-z.baselinker.com/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/543202/Baselinker%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/543202/Baselinker%2B.meta.js
// ==/UserScript==

function showNoteModal(e, t) {
    if (document.getElementById("blplus-note-modal")) return;
    const n = document.createElement("div");
    (n.id = "blplus-note-modal"),
        (n.style.position = "fixed"),
        (n.style.top = "50%"),
        (n.style.left = "50%"),
        (n.style.transform = "translate(-50%, -50%)"),
        (n.style.background = "#fff"),
        (n.style.border = "1px solid #ddd"),
        (n.style.borderRadius = "10px"),
        (n.style.boxShadow = "0 2px 16px rgba(0,0,0,0.18)"),
        (n.style.padding = "24px 28px 18px 28px"),
        (n.style.zIndex = "100000"),
        (n.style.minWidth = "320px"),
        (n.style.fontSize = "16px"),
        (n.style.display = "flex"),
        (n.style.flexDirection = "column"),
        (n.style.gap = "12px");
    const o = document.createElement("div");
    (o.textContent = "Notatka do oferty " + e),
        (o.style.fontWeight = "bold"),
        (o.style.fontSize = "18px"),
        (o.style.marginBottom = "10px"),
        (o.style.color = "#000"),
        n.appendChild(o);
    const l = document.createElement("textarea");
    (l.style.width = "100%"),
        (l.style.height = "120px"),
        (l.style.fontSize = "15px"),
        (l.style.borderRadius = "6px"),
        (l.style.border = "1px solid #ccc"),
        (l.style.padding = "8px"),
        (l.style.color = "#000"),
        (l.value = localStorage.getItem("blplus_note_" + e) || ""),
        n.appendChild(l);
    const s = document.createElement("button");
    (s.textContent = "Zapisz"),
        (s.style.background = "#ff5a00"),
        (s.style.color = "#fff"),
        (s.style.border = "none"),
        (s.style.borderRadius = "6px"),
        (s.style.padding = "7px 18px"),
        (s.style.fontSize = "15px"),
        (s.style.cursor = "pointer"),
        (s.onclick = function () {
            localStorage.setItem("blplus_note_" + e, l.value.trim()),
                l.value.trim() ? (t.style.background = "#ff5a00") : (t.style.background = "#fff"),
                n.remove();
        }),
        n.appendChild(s);
    const r = document.createElement("button");
    (r.textContent = "Zamknij"),
        (r.style.background = "#fff"),
        (r.style.color = "#000"),
        (r.style.border = "1px solid #ccc"),
        (r.style.borderRadius = "6px"),
        (r.style.padding = "7px 18px"),
        (r.style.fontSize = "15px"),
        (r.style.cursor = "pointer"),
        (r.style.marginLeft = "10px"),
        (r.onclick = function () {
            n.remove();
        }),
        n.appendChild(r);
    const i = document.createElement("div");
    (i.style.display = "flex"),
        (i.style.gap = "10px"),
        i.appendChild(s),
        i.appendChild(r),
        n.appendChild(i),
        document.body.appendChild(n);
}
!(function () {
    "use strict";
    function e(e) {
        return window.location.pathname.includes(e);
    }
    function t() {
        const e = document.querySelector("#table_auctions_allegro > table");
        if (!e) return void console.warn("Allegro auctions table not found");
        const t = e.querySelectorAll("tr");
        console.log(`Found ${t.length} rows`),
            t.forEach((e) => {
                const t = e.querySelector("td:nth-child(4) a"),
                    n = e.querySelector("td:nth-child(4) span.cell-second-line");
                if (!t || !n) return void console.warn("Auction link or ID element not found in this row");
                const o = n.textContent.match(/\((\d+)\)/);
                if (o) {
                    const t = o[1],
                        n = e.querySelectorAll(".tm-action-buttons");
                    n && n.forEach((e) => e.remove());
                    const l = document.createElement("div");
                    l.className = "tm-action-buttons";
                    const s = document.createElement("a");
                    (s.href = `https://salescenter.allegro.com/offer/${t}`),
                        (s.textContent = "Edytuj"),
                        (s.target = "_blank");
                    const r = document.createElement("a");
                    (r.href = `https://salescenter.allegro.com/offer/${t}/similar`),
                        (r.textContent = "Wystaw podobną"),
                        (r.target = "_blank");
                    const i = e.querySelector("span.prod_id");
                    let a = i ? i.textContent.trim() : "";
                    const d = document.createElement("a"),
                        c = window.location.host;
                    (d.href = a ? `https://${c}/inventory_products#id=${a}` : "#"),
                        (d.textContent = "Magazyn"),
                        (d.target = "_blank");
                    const p = e.querySelector("span.cell-second-line");
                    let y = "";
                    if (p) {
                        const e = p.textContent.match(/\((\d+)\)/);
                        e && (y = e[1]);
                    }
                    const u = document.createElement("button");
                    (u.textContent = "N"),
                        (u.style.marginLeft = "4px"),
                        (u.style.background = localStorage.getItem("blplus_note_" + y) ? "#ff5a00" : "#fff"),
                        (u.style.color = "#000"),
                        (u.style.border = "1px solid #ccc"),
                        (u.style.borderRadius = "4px"),
                        (u.style.padding = "2px 8px"),
                        (u.style.fontWeight = "bold"),
                        (u.style.cursor = "pointer"),
                        (u.onclick = function (e) {
                            e.preventDefault(), showNoteModal(y, u);
                        }),
                        l.appendChild(s),
                        l.appendChild(r),
                        l.appendChild(d),
                        l.appendChild(u);
                    const m = e.querySelector("td:nth-child(4)");
                    m
                        ? (m.appendChild(l), console.log("Buttons successfully added to the row"))
                        : console.warn("td:nth-child(4) not found in this row");
                } else console.warn("Auction ID not found in the span:", n.textContent);
            });
    }
    function n() {
        const e = () => {
            // Szukaj kontenerów z różnymi sufiksami kanałów
            const imagesContainer = document.getElementById("edit-images-inner");
            const mediaContainer = document.getElementById("edit-media-inner");
            
            // Szukaj kontenerów z sufiksami kanałów (np. edit-images-inner-db|0)
            const containersWithSuffix = document.querySelectorAll('[id^="edit-images-inner-"], [id^="edit-media-inner-"]');
            
            // Wybierz pierwszy dostępny kontener
            const targetContainer = imagesContainer || mediaContainer || containersWithSuffix[0];
            
            if (targetContainer) {
                (function () {
                    const e = targetContainer;
                    if (!e) return;
                    if (document.getElementById("tm-download-images-btn")) return;
                    const t = document.createElement("button");
                    (t.id = "tm-download-images-btn"),
                        (t.textContent = "Pobierz zdjęcia"),
                        (t.style.position = "relative"),
                        (t.style.zIndex = "9999"),
                        (t.style.margin = "20px auto 0 auto"),
                        (t.style.display = "block"),
                        (t.style.padding = "10px 20px"),
                        (t.style.backgroundColor = "#ff5a00"),
                        (t.style.color = "#fff"),
                        (t.style.border = "none"),
                        (t.style.cursor = "pointer"),
                        (t.style.fontSize = "16px"),
                        (t.style.borderRadius = "5px"),
                        (t.onclick = o),
                        e.appendChild(t);
                })();
            } else {
                setTimeout(e, 100);
            }
        };
        e();
    }
    function o() {
        let e = "";
        const t = document.querySelector(".breadcrumb-product-name");
        e = t ? t.textContent.trim().replace(/\s+/g, " ") : "zdjecie";
        
        // Szukaj zdjęć w różnych kontenerach (z sufiksami i bez)
        const imageSelectors = [
            "#edit-images-inner .image img",
            "#edit-media-inner .image img",
            "[id^='edit-images-inner-'] .image img",
            "[id^='edit-media-inner-'] .image img"
        ].join(", ");
        
        const n = Array.from(document.querySelectorAll(imageSelectors))
            .map((e) => e.src)
            .filter((e) => e && e.trim() && "" !== e && null != e);
        
        if (!n.length) return void alert("Brak zdjęć do pobrania");
        let o = document.getElementById("tm-download-modal");
        o && o.remove(),
            (o = document.createElement("div")),
            (o.id = "tm-download-modal"),
            (o.style.position = "fixed"),
            (o.style.top = "50%"),
            (o.style.left = "50%"),
            (o.style.transform = "translate(-50%, -50%)"),
            (o.style.backgroundColor = "#fff"),
            (o.style.padding = "35px"),
            (o.style.zIndex = "10000"),
            (o.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)"),
            (o.style.maxHeight = "80%"),
            (o.style.maxWidth = "80%"),
            (o.style.overflowY = "auto"),
            (o.style.display = "grid"),
            (o.style.gridTemplateColumns = "repeat(auto-fill, minmax(150px, 1fr))"),
            (o.style.gridGap = "10px"),
            (o.style.paddingBottom = "60px"),
            (o.style.borderRadius = "12px");
        let l = document.createElement("button");
        (l.innerText = "x"),
            (l.style.position = "absolute"),
            (l.style.top = "5px"),
            (l.style.right = "5px"),
            (l.style.backgroundColor = "#ff5a00"),
            (l.style.color = "#fff"),
            (l.style.border = "none"),
            (l.style.cursor = "pointer"),
            (l.style.fontSize = "16px"),
            (l.style.borderRadius = "50%"),
            (l.style.width = "30px"),
            (l.style.height = "30px"),
            (l.style.zIndex = "9999"),
            (l.onclick = function () {
                document.body.removeChild(o);
            }),
            o.appendChild(l),
            n.forEach((t, n) => {
                if (!t || "" === t.trim() || t === window.location.origin + "/inventory_products") return;
                let l = document.createElement("div");
                (l.style.position = "relative"),
                    (l.style.overflow = "hidden"),
                    (l.style.border = "1px solid #ddd"),
                    (l.style.borderRadius = "5px"),
                    (l.style.padding = "5px"),
                    (l.style.backgroundColor = "#f9f9f9");
                let s = document.createElement("img");
                (s.src = t),
                    (s.style.width = "150px"),
                    (s.style.height = "230px"),
                    (s.style.objectFit = "cover"),
                    l.appendChild(s);
                let r = document.createElement("button");
                (r.innerText = "Pobierz"),
                    (r.style.position = "absolute"),
                    (r.style.bottom = "10px"),
                    (r.style.left = "50%"),
                    (r.style.transform = "translateX(-50%)"),
                    (r.style.padding = "5px 10px"),
                    (r.style.backgroundColor = "#ff5a00"),
                    (r.style.color = "#fff"),
                    (r.style.border = "none"),
                    (r.style.cursor = "pointer"),
                    (r.style.borderRadius = "3px"),
                    (r.onclick = function () {
                        if ("function" == typeof GM_download) {
                            let o = t.split(".").pop().split("?")[0];
                            GM_download({ url: t, name: e + "-" + (n + 1) + "." + o });
                        } else alert("Pobieranie nie jest możliwe w tej przeglądarce. Użyj Tampermonkey.");
                    }),
                    l.appendChild(r),
                    o.appendChild(l);
            });
        let s = document.createElement("div");
        (s.style.width = "100%"),
            (s.style.display = "flex"),
            (s.style.justifyContent = "center"),
            (s.style.position = "absolute"),
            (s.style.bottom = "10px"),
            (s.style.left = "0");
        let r = document.createElement("button");
        (r.innerText = "Pobierz wszystkie"),
            (r.style.padding = "10px 20px"),
            (r.style.backgroundColor = "rgb(255, 90, 0)"),
            (r.style.color = "rgb(255, 255, 255)"),
            (r.style.border = "none"),
            (r.style.cursor = "pointer"),
            (r.style.fontSize = "16px"),
            (r.style.borderRadius = "5px"),
            (r.onclick = function () {
                "function" == typeof GM_download
                    ? n.forEach((t, n) => {
                          if (!t || "" === t.trim() || t === window.location.origin + "/inventory_products") return;
                          let o = t.split(".").pop().split("?")[0];
                          GM_download({ url: t, name: e + "-" + (n + 1) + "." + o });
                      })
                    : alert("Pobieranie nie jest możliwe w tej przeglądarce. Użyj Tampermonkey.");
            }),
            s.appendChild(r),
            o.appendChild(s),
            document.body.appendChild(o);
    }
    new MutationObserver(() => {
        const e = document.getElementById("change_theme");
        if (!e) return;
        if (document.getElementById("modal-theme-search-1")) return;
        const t = document.createElement("div");
        (t.className = "tm-search-container"),
            (t.style.display = "flex"),
            (t.style.gap = "10px"),
            (t.style.marginBottom = "10px");
        const n = document.createElement("input");
        (n.id = "modal-theme-search-1"), (n.className = "tm-search-box"), (n.placeholder = "Wyszukaj...");
        const o = document.createElement("input");
        function l() {
            const t = n.value.toLowerCase(),
                l = o.value.toLowerCase();
            e.querySelectorAll("option").forEach((e) => {
                const n = e.textContent.toLowerCase(),
                    o = !t || n.includes(t),
                    s = !l || n.includes(l);
                o && s
                    ? ((e.style.display = ""),
                      (e.innerHTML = e.textContent.replace(
                          new RegExp(`(${t}|${l})`, "gi"),
                          (e) => `<span class="tm-highlight">${e}</span>`
                      )))
                    : ((e.style.display = "none"), (e.innerHTML = e.textContent));
            });
        }
        (o.id = "modal-theme-search-2"),
            (o.className = "tm-search-box"),
            (o.placeholder = "Oraz..."),
            t.appendChild(n),
            t.appendChild(o),
            e.parentElement.insertBefore(t, e),
            n.addEventListener("input", l),
            o.addEventListener("input", l);
    }).observe(document.body, { childList: !0, subtree: !0 }),
        (function () {
            if (
                ((function () {
                    const e = document.createElement("style");
                    (e.id = "tampermonkey-styles"),
                        (e.textContent =
                            "\n            .tm-search-container {\n                display: flex;\n                gap: 10px;\n                margin-bottom: 10px;\n            }\n            .tm-search-box {\n                flex: 1;\n                border: 1px solid #ccc;\n                padding: 5px;\n                color: #FF5C0A;\n                font-weight: bold;\n            }\n            .tm-search-box::placeholder {\n                color: #FF5C0A;\n            }\n            .tm-highlight {\n                color: #FF5C0A;\n                font-weight: bold;\n            }\n            .tm-action-buttons {\n                margin-left: 10px;\n                display: inline-flex;\n                gap: 5px;\n            }\n            .tm-action-buttons a {\n                background-color: #434343;\n                color: #fff;\n                padding: 3px 6px;\n                border-radius: 3px;\n                text-decoration: none;\n                font-size: 12px;\n            }\n            .tm-action-buttons a:hover {\n                background-color: #e04b07;\n            }\n        "),
                        document.head.appendChild(e);
                })(),
                e("allegro_themes.php") &&
                    ((function () {
                        const e = document.querySelector(".btn_form_save");
                        e
                            ? (e.style.setProperty("z-index", "9999", "important"),
                              e.style.setProperty("position", "fixed", "important"),
                              e.style.setProperty("left", "300px", "important"),
                              e.style.setProperty("bottom", "20px", "important"),
                              e.style.setProperty("background-color", "#FF5C0A", "important"),
                              e.style.setProperty("border-color", "#FF5C0A", "important"))
                            : console.warn("Save button not found on this page");
                    })(),
                    (function () {
                        const e = document.querySelector("#table_allegro_themes");
                        if (!e) return void console.warn("Allegro themes table not found");
                        if (document.querySelector("#themes-table-search")) return;
                        const t = document.createElement("input");
                        (t.id = "themes-table-search"),
                            (t.className = "tm-search-box"),
                            (t.placeholder = "Wyszukaj w szablonach..."),
                            e.parentElement.insertBefore(t, e),
                            t.addEventListener("input", function () {
                                const n = t.value.toLowerCase();
                                e.querySelectorAll("tr").forEach((e) => {
                                    const t = e.querySelector("td:nth-child(2) b");
                                    t &&
                                        (t.textContent.toLowerCase().includes(n)
                                            ? ((e.style.display = ""),
                                              (t.innerHTML = t.textContent.replace(
                                                  new RegExp(`(${n})`, "gi"),
                                                  (e) => `<span class="tm-highlight">${e}</span>`
                                              )))
                                            : ((e.style.display = "none"), (t.innerHTML = t.textContent)));
                                });
                            });
                    })()),
                e("allegro_auctions.php"))
            ) {
                function n(e, t) {
                    let n;
                    return function (...o) {
                        clearTimeout(n), (n = setTimeout(() => e.apply(this, o), t));
                    };
                }
                const o = n(t, 3e3),
                    l = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function () {
                    this.addEventListener("load", function () {
                        this.responseURL.includes("ajax_table_common.php") &&
                            (console.log("Zapytanie AJAX zakończone", this.responseURL), o());
                    }),
                        l.apply(this, arguments);
                };
                new MutationObserver((e) => {
                    e.forEach((e) => {
                        const t = document.querySelector("#auction_details_modal > div > div");
                        t &&
                            "none" !== t.style.display &&
                            (function () {
                                const e = document.querySelector("#theme");
                                if (!e) return void console.warn("Theme selector not found");
                                if (document.querySelector("#theme-search-1")) return;
                                const t = document.createElement("div");
                                t.className = "tm-search-container";
                                const n = document.createElement("input");
                                (n.id = "theme-search-1"),
                                    (n.className = "tm-search-box"),
                                    (n.placeholder = "Wyszukaj...");
                                const o = document.createElement("input");
                                function l() {
                                    const t = n.value.toLowerCase(),
                                        l = o.value.toLowerCase();
                                    e.querySelectorAll("option").forEach((e) => {
                                        const n = e.textContent.toLowerCase(),
                                            o = !t || n.includes(t),
                                            s = !l || n.includes(l);
                                        o && s
                                            ? ((e.style.display = ""),
                                              (e.innerHTML = e.textContent.replace(
                                                  new RegExp(`(${t}|${l})`, "gi"),
                                                  (e) => `<span class="tm-highlight">${e}</span>`
                                              )))
                                            : ((e.style.display = "none"), (e.innerHTML = e.textContent));
                                    });
                                }
                                (o.id = "theme-search-2"),
                                    (o.className = "tm-search-box"),
                                    (o.placeholder = "Oraz..."),
                                    t.appendChild(n),
                                    t.appendChild(o),
                                    e.parentElement.insertBefore(t, e),
                                    n.addEventListener("input", l),
                                    o.addEventListener("input", l);
                            })();
                    });
                }).observe(document.body, { childList: !0, subtree: !0 });
                const s = new MutationObserver(() => {
                        console.log("Table content updated, adding buttons"), o();
                    }),
                    r = document.querySelector("#table_auctions_allegro > table");
                r && s.observe(r, { childList: !0, subtree: !0 }), o();
                const i = new MutationObserver(() => {
                        console.log("Pagination or table change detected"), o();
                    }),
                    a = document.querySelector(".pagination");
                a && i.observe(a, { childList: !0 });
            }
        })(),
        new MutationObserver(() => {
            const e = document.getElementById("edit_object_modal");
            e &&
                "none" !== e.style.display &&
                new MutationObserver(() => {
                    const e = document.querySelector(
                            'a[href="#edit-images"][role="tab"], a[href="#edit-media"][role="tab"]'
                        ),
                        t = document.getElementById("edit-images") || document.getElementById("edit-media");
                    e &&
                        t &&
                        (e.addEventListener("click", function () {
                            setTimeout(() => {
                                n();
                            }, 200);
                        }),
                        t.classList.contains("active") && n());
                }).observe(e, { childList: !0, subtree: !0 });
        }).observe(document.body, { childList: !0, subtree: !0 });
})(),
    (function () {
        if (/\/inventory_products$/.test(window.location.pathname)) {
            const e = window.location.hash;
            let t = null;
            if (e) {
                const n = e.match(/#id(?:=|%3D)(\d+)/);
                n && (t = n[1]);
            }
            if (t) {
                const e = document.getElementById("id");
                e &&
                    ((e.value = t),
                    e.dispatchEvent(new Event("input", { bubbles: !0 })),
                    e.dispatchEvent(new Event("change", { bubbles: !0 })),
                    setTimeout(() => {
                        const e = document.querySelector("a.btn_save_filters");
                        e && e.click();
                    }, 200));
            }
        }
    })(),
    (function () {
        const e = "blplus_settings",
            t = { downloadImages: !0, searchTemplates: !0, btnEdit: !0, btnSimilar: !0, btnMagazyn: !0 };
        function n() {
            try {
                return Object.assign({}, t, JSON.parse(localStorage.getItem(e) || "{}"));
            } catch (e) {
                return { ...t };
            }
        }
        function o() {
            if (document.getElementById("blplus-settings-modal")) return;
            const t = n(),
                o = document.createElement("div");
            (o.id = "blplus-settings-modal"),
                (o.style.position = "fixed"),
                (o.style.right = "24px"),
                (o.style.bottom = "70px"),
                (o.style.background = "#fff"),
                (o.style.border = "1.5px solid #ff5a00"),
                (o.style.borderRadius = "12px"),
                (o.style.boxShadow = "0 4px 24px rgba(0,0,0,0.18)"),
                (o.style.padding = "28px 32px 20px 32px"),
                (o.style.zIndex = "100000"),
                (o.style.minWidth = "300px"),
                (o.style.fontSize = "16px"),
                (o.style.display = "flex"),
                (o.style.flexDirection = "column"),
                (o.style.gap = "14px"),
                (o.style.fontFamily = "inherit");
            const s = document.createElement("div");
            (s.textContent = "Baselinker+"),
                (s.style.fontWeight = "bold"),
                (s.style.fontSize = "20px"),
                (s.style.marginBottom = "16px"),
                (s.style.color = "#ff5a00"),
                (s.style.letterSpacing = "1px"),
                (s.style.textAlign = "center"),
                o.appendChild(s);
            [
                { key: "downloadImages", label: "Pobieranie zdjęć" },
                { key: "searchTemplates", label: "Wyszukiwarka szablonów" },
                { key: "btnEdit", label: "Przycisk Edytuj" },
                { key: "btnSimilar", label: "Przycisk Wystaw podobną" },
                { key: "btnMagazyn", label: "Przycisk Magazyn" },
                { key: "btnNote", label: "Przycisk Notatnik" },
            ].forEach((n) => {
                const s = document.createElement("label");
                (s.style.display = "flex"),
                    (s.style.alignItems = "center"),
                    (s.style.gap = "10px"),
                    (s.style.color = "#23272e"),
                    (s.style.fontSize = "16px"),
                    (s.style.padding = "4px 0");
                const r = document.createElement("input");
                (r.type = "checkbox"),
                    (r.checked = !!t[n.key]),
                    (r.style.width = "20px"),
                    (r.style.height = "20px"),
                    (r.style.accentColor = "#ff5a00"),
                    (r.onchange = function () {
                        (t[n.key] = r.checked),
                            (function (t) {
                                localStorage.setItem(e, JSON.stringify(t));
                            })(t),
                            l();
                    }),
                    s.appendChild(r),
                    s.appendChild(document.createTextNode(n.label)),
                    o.appendChild(s);
            });
            const r = document.createElement("button");
            (r.textContent = "Zamknij"),
                (r.style.marginTop = "22px"),
                (r.style.alignSelf = "center"),
                (r.style.background = "rgb(255, 90, 0)"),
                (r.style.color = "#fff"),
                (r.style.border = "none"),
                (r.style.borderRadius = "8px"),
                (r.style.padding = "10px 28px"),
                (r.style.fontSize = "16px"),
                (r.style.cursor = "pointer"),
                (r.style.fontWeight = "bold"),
                (r.style.boxShadow = "0 2px 8px rgba(0,0,0,0.10)"),
                (r.onclick = () => o.remove()),
                o.appendChild(r),
                document.body.appendChild(o);
        }
        function l() {
            const e = n(),
                t = document.getElementById("tm-download-images-btn");
            t && (t.style.display = e.downloadImages ? "" : "none");
            document
                .querySelectorAll(".tm-search-container")
                .forEach((t) => (t.style.display = e.searchTemplates ? "" : "none")),
                document.querySelectorAll(".tm-action-buttons").forEach((t) => {
                    Array.from(t.children).forEach((t) => {
                        "Edytuj" === t.textContent && (t.style.display = e.btnEdit ? "" : "none"),
                            "Wystaw podobną" === t.textContent && (t.style.display = e.btnSimilar ? "" : "none"),
                            "Magazyn" === t.textContent && (t.style.display = e.btnMagazyn ? "" : "none"),
                            "N" === t.textContent && (t.style.display = e.btnNote ? "" : "none");
                    });
                });
        }
        !(function () {
            if (document.getElementById("blplus-settings-btn")) return;
            const e = document.createElement("button");
            (e.id = "blplus-settings-btn"),
                (e.textContent = "BL+"),
                (e.style.position = "fixed"),
                (e.style.left = "0px"),
                (e.style.right = ""),
                (e.style.bottom = "20px"),
                (e.style.borderRadius = "0 16px 16px 0"),
                (e.style.zIndex = "99999"),
                (e.style.background = "rgb(255, 90, 0)"),
                (e.style.color = "#fff"),
                (e.style.border = "none"),
                (e.style.padding = "10px 18px 10px 10px"),
                (e.style.fontSize = "15px"),
                (e.style.boxShadow = "2px 0 8px rgba(0,0,0,0.15)"),
                (e.style.cursor = "pointer"),
                (e.style.transition = "width 0.2s, min-width 0.2s, padding 0.2s, background 0.2s, color 0.2s"),
                (e.style.overflow = "hidden"),
                (e.style.whiteSpace = "nowrap"),
                (e.style.width = "54px"),
                (e.style.minWidth = "54px"),
                (e.style.textAlign = "left"),
                (e.onmouseenter = function () {
                    (e.textContent = "Baselinker+"),
                        (e.style.width = "148px"),
                        (e.style.minWidth = "148px"),
                        (e.style.padding = "10px 18px 10px 18px");
                }),
                (e.onmouseleave = function () {
                    (e.textContent = "BL+"),
                        (e.style.width = "54px"),
                        (e.style.minWidth = "54px"),
                        (e.style.padding = "10px 18px 10px 10px");
                }),
                (e.onclick = o),
                document.body.appendChild(e);
        })(),
            l();
        new MutationObserver(l).observe(document.body, { childList: !0, subtree: !0 });
        
        // MutationObserver dla modala edycji produktu - wyświetlanie przycisku pobierania zdjęć
        new MutationObserver(() => {
            const modal = document.getElementById("edit_object_modal");
            if (modal && modal.style.display !== "none") {
                new MutationObserver(() => {
                    const mediaTab = document.querySelector('a[href="#edit-media"][role="tab"]');
                    const imagesTab = document.querySelector('a[href="#edit-images"][role="tab"]');
                    const mediaContent = document.getElementById("edit-media");
                    const imagesContent = document.getElementById("edit-images");
                    
                    // Obsługa zakładki Media z funkcją openProductTab
                    if (mediaTab) {
                        mediaTab.addEventListener("click", function() {
                            setTimeout(() => { n(); }, 500); // Zwiększone opóźnienie dla openProductTab
                        });
                        // Sprawdź czy zakładka jest aktywna
                        if (mediaTab.classList.contains("active") || mediaContent?.classList.contains("active")) {
                            setTimeout(() => { n(); }, 300);
                        }
                    }
                    
                    // Obsługa zakładki Images (dla kompatybilności wstecznej)
                    if (imagesTab && imagesContent) {
                        imagesTab.addEventListener("click", function() {
                            setTimeout(() => { n(); }, 200);
                        });
                        if (imagesContent.classList.contains("active")) {
                            n();
                        }
                    }
                }).observe(modal, { childList: !0, subtree: !0 });
            }
        }).observe(document.body, { childList: !0, subtree: !0 });
        
        // Dodatkowy MutationObserver dla kontenerów z sufiksami
        new MutationObserver(() => {
            // Szukaj wszystkich możliwych kontenerów
            const containers = document.querySelectorAll('[id^="edit-images-inner"], [id^="edit-media-inner"], #edit-images-inner, #edit-media-inner');
            
            if (containers.length > 0 && !document.getElementById("tm-download-images-btn")) {
                const container = containers[0]; // Weź pierwszy znaleziony
                
                // Sprawdź czy kontener jest widoczny
                const rect = container.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    setTimeout(() => { n(); }, 100);
                }
            }
        }).observe(document.body, { childList: !0, subtree: !0 });
        
        // Przechwytywanie funkcji openProductTab
        if (typeof window.openProductTab === 'function') {
            const originalOpenProductTab = window.openProductTab;
            window.openProductTab = function(tabName) {
                const result = originalOpenProductTab.apply(this, arguments);
                if (tabName === 'media') {
                    setTimeout(() => { n(); }, 500);
                }
                return result;
            };
        } else {
            // Fallback - jeśli openProductTab nie istnieje
        }
        
        // Alternatywny sposób - nasłuchiwanie na zmiany w URL hash
        window.addEventListener('hashchange', function() {
            if (window.location.hash === '#edit-media') {
                setTimeout(() => { n(); }, 300);
            }
        });
    })();
