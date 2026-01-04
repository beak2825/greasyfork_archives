// ==UserScript==
// @name         MyDealz_01_Deep_comment_extractor 🧠
// @namespace    violentmonkey
// @version      9.0
// @description  High-End Intelligence: Extrahiert OP & Metadaten direkt aus dem "Deep State" (Initial State), nutzt GraphQL für Kommentare und bietet 4 professionelle KI-Analyse-Modi.
// @match        https://www.mydealz.de/diskussion/*
// @match        https://www.mydealz.de/deals/*
// @match        https://www.mydealz.de/gutscheine/*
// @icon         https://www.mydealz.de/favicon.svg
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/536079/MyDealz_01_Deep_comment_extractor%20%F0%9F%A7%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/536079/MyDealz_01_Deep_comment_extractor%20%F0%9F%A7%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==========================================
    // 1. CONFIG & PROMPTS (Deine "Perfekten Prompts")
    // ==========================================
    const KI_LINKS = [
        { id: 'chatgptBtn', label: 'ChatGPT', url: 'https://chatgpt.com/' },
        { id: 'claudeBtn', label: 'Claude', url: 'https://claude.ai/' },
        { id: 'geminiBtn', label: 'Gemini', url: 'https://gemini.google.com/' },
        { id: 'perplexityBtn', label: 'Perplexity', url: 'https://www.perplexity.ai/' }
    ];

    const BTN_COLORS = { NORMAL: '#03a5c1', ERROR: '#e53935', SUCCESS: '#4caf50', PROCESSING: '#e67e22' };
    const fmtMeta = (meta) => JSON.stringify(meta, null, 2);

    const PROMPT_LEVELS = {
        // 1. ROHDATEN
        RAW: {
            label: '🧱 Rohdaten',
            id: 'promptRawBtn',
            gen: (meta, comments) => `<context_data>\n${fmtMeta(meta)}\n</context_data>\n\n<discussion_thread>\n${comments}\n</discussion_thread>`
        },

        // 2. KURZ (Dein "Deal Intelligence Analyst" Prompt)
        SHORT: {
            label: '⚡ Kurz',
            id: 'promptShortBtn',
            gen: (meta, comments) => `# Role: Deal Intelligence Analyst & Community Sentiment Evaluator
 
# Context
Du erhältst Metadaten zu einem Produktangebot sowie einen Diskussionsthread einer Deal-Plattform. Die Community ist kritisch und deckt oft Schwächen auf, die im Marketingtext fehlen.
 
# Task
Analysiere die Eingabedaten, um eine fundierte Kaufentscheidung zu simulieren. **WICHTIG:** Die kollektive Erfahrung der Community (Kommentare) wiegt schwerer als der Angebotspreis oder die Händlerbeschreibung.
 
# Input Data
<product_metadata>
${fmtMeta(meta)}
</product_metadata>
 
<community_discussion>
${comments}
</community_discussion>
 
# Processing Instructions
1. **Markt-Check:** Ist der Preis wirklich gut oder nur ein "Schein-Rabatt"? (Achte auf Vergleiche in den Kommentaren).
2. **Nutzenanalyse:** Identifiziere die **Hauptkritik**.
   * *Bei Hardware:* Gibt es bessere/günstigere Modelle?
   * *Bei Services:* Gibt es kostenlose Alternativen (Workarounds)?
   * *Bei Food/Mode:* Stimmt die Qualität?
3. **Lösungsfindung:** Suche nach "Hidden Gems" in den Kommentaren (z.B. Gutscheincodes, technische Kniffe, bessere Konkurrenzprodukte).
4. **Synthese:** Erstelle ein kurzes, scannbares Fazit.
 
# Output Format
Antworte ausschließlich in diesem Markdown-Format:
 
## 🚦 Status: [🟢 KAUFEN / 🟡 BEDINGT / 🔴 FINGER WEG]
*(Ein prägnanter Satz als Begründung, basierend auf dem Konsens der Diskussion)*
 
## ⚡ Deal-Analyse
* **Preis-Check:** [Einschätzung: Bestpreis, Standard oder teuer?]
* **Community-Konsens:** [Was sagt die Mehrheit? Hype oder Enttäuschung?]
* **Der Haken:** [Das stärkste Gegenargument (z.B. "Veraltete Technik", "Abo-Falle", "Schlechter Geschmack")]
* **Beste Alternative/Lösung:** [Der wertvollste Tipp aus den Kommentaren]
 
---
*Analyse basierend auf ${meta.Statistik.Kommentare_Total} Kommentaren.*`
        },

        // 3. STANDARD (Dein "Community Sentiment & Value Analyst" Prompt)
        MEDIUM: {
            label: '💡 Standard',
            id: 'promptMediumBtn',
            gen: (meta, comments) => `# Role: Community Sentiment & Value Analyst
Du bist spezialisiert darauf, aus Foren-Diskussionen den echten Nutzwert zu extrahieren. Du filterst Rauschen, erkennst Sarkasmus anhand von User-Reaktionen und identifizierst technische Lösungen.
 
# Input Data
<context_data>
${fmtMeta(meta)}
</context_data>
 
<discussion_thread>
${comments}
</discussion_thread>
 
# Processing Logic (Social Signal Parsing)
Analysiere den Textfluss und achte auf Reaktions-Marker am Ende von Kommentaren. Interpretiere sie wie folgt:
1. **\`💡\` (Glühbirne) & \`👍\` (Daumen):** Hohe Zahlen = Validierte Lösung oder Expertenwissen. Dieser Inhalt muss priorisiert werden.
2. **\`😂\` (Lachsmilie):** Hohe Zahlen = Indikator für Sarkasmus, Spott oder ein schlechtes Preis-Leistungs-Verhältnis. (Vorsicht: Text nicht wörtlich nehmen!).
3. **Keywords:** Achte auf Begriffe wie "Workaround", "Trick", "Alternative", "Skript", "Einstellung".
 
# Analysis Steps (Chain of Thought)
1. **Klassifizierung:** Um was geht es? (Produkt, Dienstleistung, Preisfehler?). Gibt es eine Grundsatzdiskussion (z.B. Hardware vs. App, Original vs. Klon, Abo vs. Kauf)?
2. **Problem-Identifikation:** Was ist der Hauptkritikpunkt der Community? (z.B. "unnötige Kosten", "schlechte Qualität", "Versandrisiko").
3. **Lösungs-Mining:** Suche nach Kommentaren mit \`💡\`-Reaktionen, die Alternativen oder Fixes beschreiben.
 
# Output Format (Markdown)
 
## 🌡️ Stimmungsbild & Real-Check
*(Einleitender Absatz: Ist die Community begeistert oder kritisch? Dominiert Sarkasmus oder echte Kaufabsicht?)*
 
## ✅ Deal-Bewertung
* **Pro:** [Argumente der Befürworter]
* **Contra:** [Argumente der Kritiker]
* **Der "Elefant im Raum":** [Das eine Thema, über das alle diskutieren - z.B. Sinnhaftigkeit, Preisfehler-Storno, Alternativen]
 
## 🛠️ Validierte Lösungen & Workarounds (High Value)
*(Extrahiere NUR technische Lösungen/Tricks mit positiven Community-Signalen 💡/👍)*
* **Lösung/Trick:** [Beschreibung] (User: [Name])
* **Alternative:** [Welches Produkt/App wird stattdessen empfohlen?]
 
## ⚖️ Fazit & Empfehlung
*(Ein Satz: Kaufen oder Alternative nutzen?)*`
        },

        // 4. AUSFÜHRLICH (Dein "Senior UX Researcher" Prompt)
        DETAILED: {
            label: '🧐 Ausführlich',
            id: 'promptDetailedBtn',
            gen: (meta, comments) => `# Role: Senior UX Researcher & Community Knowledge Miner
Du bist Experte für die Analyse komplexer User-Diskussionen. Dein Ziel ist die Extraktion von "Hidden Knowledge" (technische Lösungen, die nicht im Artikel stehen) und die Analyse der Gruppendynamik.
 
# Input Context
<context_data>
${fmtMeta(meta)}
</context_data>
 
<discussion_thread>
${comments}
</discussion_thread>
 
# Deep Analysis Protocol (Signal Processing)
1. **Reaktions-Metrik-Decoding:**
   - Achte auf Markierungen am Ende der Kommentare (z.B. \`💡 5\`, \`😂 20\`).
   - **\`💡\` (Licht):** Das wichtigste Signal! Markiert validierte Lösungen, Workarounds oder Expertenwissen.
   - **\`😂\` (Lachsmilie):** Markiert Spott, Ironie oder "Preis-Leistungs-Fail". Nimm Texte mit vielen 😂 NIEMALS wörtlich.
   - **\`👍\` (Daumen):** Markiert Zustimmung/Konsens.
2. **Workaround-Mining (Strict Mode):**
   - Identifiziere Schritt-für-Schritt-Anleitungen nur, wenn sie von der Community (durch \`💡\` oder \`👍\`) validiert wurden.
   - Wenn KEINE technischen Workarounds vorhanden sind, schreibe explizit: "Keine Workarounds in der Diskussion gefunden." (Erfinde nichts!).
3. **OP-Dynamik:**
   - Prüfe, ob der Autor [OP] im Thread aktiv ist. Klärt er Fragen oder wird er kritisiert?
 
# Output Format (Detailed Report)
 
## 🌡️ Stimmungs-Seismograph
*(Analysiere die emotionale Temperatur. Ist die Community dankbar, wütend oder amüsiert? Nutze das Verhältnis von \`😂\` (Spott) zu \`👍\` (Dank) als Beweis.)*
 
## 🛠️ The "Hive Mind" Solution (Validierte Workarounds)
*Hier wird das kollektive Wissen aggregiert. Priorität auf Kommentare mit hohen \`💡\`-Werten.*
 
### 🔧 Workaround / Pro-Tipp: [Titel]
* **Problem:** [Welches Limit/Problem wird umgangen?]
* **Lösung:** [Zusammenfassung der Schritte aus den Kommentaren]
* **Credits:** *(Vorgeschlagen von User: [Name])*
 
*(Falls keine Workarounds existieren, diesen Bereich ausblenden oder Hinweis geben)*
 
## ⚔️ Konflikt-Matrix (Argumentations-Cluster)
*Analysiere die polarisierenden Lager.*
* **Lager A (Die Kritiker/Skeptiker):** [Hauptargument? z.B. "Zu teuer", "Datenschutz", "Braucht man nicht"]
* **Lager B (Die Befürworter/Realisten):** [Gegenargument? z.B. "Alternativlos", "Komfort-Gewinn"]
* **Der Gewinner der Debatte:** [Welche Seite hat mehr Zustimmung/Likes erhalten?]
 
## 💡 UX & Usability Insights
* **Pain Points:** [Welche konkreten Probleme (Bugs, Versand, Haptik) werden genannt?]
* **Hidden Gems:** [Details, die im Deal-Text fehlten, aber in den Kommentaren auftauchen]
 
## ⚖️ Executive Summary
*(Ein Absatz: Empfehlung basierend auf der Schwarmintelligenz. Ist das Produkt ein "No-Brainer" für die Masse oder nur für eine Nische interessant?)*
 
---
*Analysis generated via Deep-Dive Mining Protocol | ${new Date().toLocaleDateString()}*`
        }
    };

    // ==========================================
    // 2. STATE & CORE LOGIC
    // ==========================================
    let state = {
        isScraping: false,
        threadId: null,
        xsrfToken: null,
        collectedComments: [],
        opUsername: null,
        metaData: {},
        currentPromptLevel: 'MEDIUM', // Default: Standard
        commentIdCounter: 1 // New: Counter for logical IDs
    };

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    function getThreadId() {
        const el = document.querySelector('[data-thread-id]');
        if (el) return el.dataset.threadId;
        const match = window.location.pathname.match(/-(\d+)(?:\?|$)/);
        return match ? match[1] : null;
    }

    function cleanText(html) {
        if (!html) return "";
        const temp = document.createElement('div');
        temp.innerHTML = html;
        temp.querySelectorAll('br').forEach(br => br.replaceWith(' '));
        temp.querySelectorAll('p').forEach(p => p.insertAdjacentText('afterend', ' '));
        return temp.textContent.replace(/\s\s+/g, ' ').trim();
    }

    function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

    // ==========================================
    // 3. DATA EXTRACTION (Deep State + Fallback)
    // ==========================================

    function getMetadata() {
        let op = "Unbekannt";
        let title = document.title;
        let price = "N/A";
        let merchant = "N/A";
        let temp = "N/A";
        let description = "N/A";

        // 1. Versuch: __INITIAL_STATE__ (Deep State Mining)
        try {
            const store = unsafeWindow.__INITIAL_STATE__;
            if (store) {
                let coreData = null;
                // Array Scanning Logic (MyDealz V2 Structure)
                if (Array.isArray(store)) {
                    const foundItem = store.find(item => item.data && (item.data.thread || item.data.discussion || item.data.voucher));
                    if (foundItem) coreData = foundItem.data.thread || foundItem.data.discussion || foundItem.data.voucher;
                } else {
                    // Object Structure (Legacy)
                    coreData = store.thread || store.discussion || store.voucher;
                    if (!coreData && store.data) coreData = store.data.thread || store.data.discussion;
                }

                if (coreData) {
                    console.log("✅ Deep State Data gefunden:", coreData);
                    op = coreData.user ? coreData.user.username : "Unbekannt";
                    title = coreData.title;
                    price = coreData.price || "N/A";
                    merchant = coreData.merchant ? coreData.merchant.merchantName : "N/A";
                    temp = coreData.temperature || "N/A";
                    // Extract HTML Description and clean it
                    description = cleanText(coreData.description || "");
                    return { Titel: title, URL: window.location.href, DealInfo: { Preis: price, Händler: merchant, Temperatur: temp, Beschreibung: description }, OP: op };
                }
            }
        } catch (e) { console.warn("Deep-State-Extraction failed:", e); }

        // 2. Versuch: DOM-Scraping (Fallback)
        console.warn("⚠️ Fallback auf DOM...");

        let opEl = document.querySelector('.threadItemCard-author .thread-user');
        if (!opEl) opEl = document.querySelector('.short-profile-target .thread-user');
        if (!opEl) opEl = document.querySelector('.thread-user-name');
        if (opEl) op = opEl.textContent.trim();

        let titleEl = document.querySelector('h1.thread-title');
        if (titleEl) title = titleEl.textContent.trim();

        let priceEl = document.querySelector('.thread-price');
        if (priceEl) price = priceEl.textContent.trim();

        let tempEl = document.querySelector('.vote-temp--hot') || document.querySelector('.vote-temp--burn') || document.querySelector('.vote-temp');
        if (tempEl) temp = tempEl.textContent.trim();

        let descEl = document.querySelector('.pepper-description');
        if (descEl) description = cleanText(descEl.innerHTML);

        return {
            Titel: title,
            URL: window.location.href,
            DealInfo: { Preis: price, Händler: merchant, Temperatur: temp },
            OP: op
        };
    }

    async function makeGqlRequest(query, variables) {
        const response = await fetch("https://www.mydealz.de/graphql", {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                'x-pepper-txn': 'threads.show.deal',
                'x-request-type': 'application/vnd.pepper.v1+json',
                'x-requested-with': 'XMLHttpRequest',
                'x-xsrf-token': state.xsrfToken
            },
            body: JSON.stringify({ query, variables })
        });
        const json = await response.json();
        return json.data;
    }

    const USER_FIELDS = `
        user { 
            username 
            bestBadge { level { name } }
        }
    `;

    async function fetchRootComments(page) {
        const query = `query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
          comments(filter: $filter, limit: $limit, page: $page) {
            items {
              commentId
              ${USER_FIELDS}
              preparedHtmlContent
              reactionCounts { type count }
              createdAtTs
              replyCount
            }
            pagination { current last }
          }
        }`;
        const data = await makeGqlRequest(query, {
            filter: { threadId: { eq: state.threadId }, order: { direction: "Ascending" } },
            page, limit: 100
        });
        return data ? data.comments : null;
    }

    async function fetchNestedReplies(mainCommentId) {
        const query = `query comments($filter: CommentFilter!, $limit: Int, $page: Int) {
          comments(filter: $filter, limit: $limit, page: $page) {
            items {
              commentId
              ${USER_FIELDS}
              preparedHtmlContent
              reactionCounts { type count }
              createdAtTs
            }
          }
        }`;
        const data = await makeGqlRequest(query, {
            filter: { mainCommentId, threadId: { eq: state.threadId }, order: { direction: "Ascending" } },
            page: 1, limit: 100
        });
        return data ? data.comments.items : [];
    }

    // ==========================================
    // 4. PROCESSING
    // ==========================================
    function processComment(item, parentUser = null) {
        let like = 0, helpful = 0, funny = 0;
        if (item.reactionCounts) {
            item.reactionCounts.forEach(r => {
                if (r.type === 'LIKE') like = r.count;
                if (r.type === 'HELPFUL') helpful = r.count;
                if (r.type === 'FUNNY') funny = r.count;
            });
        }

        let text = cleanText(item.preparedHtmlContent);
        if (parentUser) {
            text = `[Antwort an ${parentUser}] ${text}`;
        }

        const isOp = item.user.username === state.opUsername;
        let userLabel = item.user.username;

        if (isOp) userLabel += ' [OP]';
        if (item.user.bestBadge?.level?.name) userLabel += ` (${item.user.bestBadge.level.name})`;

        // Filter Logic: Skip meaningless short comments without reactions
        const isShort = text.split(/\s+/).length < 4;
        const hasReactions = like > 0 || helpful > 0 || funny > 0;
        if (isShort && !hasReactions && !isOp) return;

        state.collectedComments.push({
            id: state.commentIdCounter++, // Logical ID
            user: userLabel,
            rawUser: item.user.username,
            text: text,
            date: new Date(item.createdAtTs * 1000).toISOString().split('T')[0],
            reactions: { like, helpful, funny }
        });
    }

    function generateStatistics() {
        const userCounts = {};
        let repliesCount = 0;

        state.collectedComments.forEach(c => {
            userCounts[c.rawUser] = (userCounts[c.rawUser] || 0) + 1;
            if (c.text.startsWith('[Antwort')) repliesCount++;
        });

        const topUsers = Object.entries(userCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([u, c]) => `${u} (${c})`);

        return {
            Kommentare_Total: state.collectedComments.length,
            Antworten: repliesCount,
            Deal_Ersteller: state.opUsername || "Unbekannt",
            Top_Akteure: topUsers
        };
    }

    function updateButton(text, color) {
        const btn = document.getElementById('ai-export-btn');
        if (btn) {
            btn.textContent = text;
            if (color) btn.style.background = color;
        }
    }

    // ==========================================
    // 5. MAIN EXECUTION
    // ==========================================
    async function runExport(btn) {
        if (state.isScraping) return;
        state.isScraping = true;
        state.collectedComments = [];
        state.commentIdCounter = 1; // Reset Counter
        state.threadId = getThreadId();
        state.xsrfToken = decodeURIComponent(getCookie('xsrf_t'));

        if (!state.threadId) { alert("Keine Thread ID!"); state.isScraping = false; return; }

        const origLabel = "🧠 AI Export";
        updateButton("⏳ Start...", BTN_COLORS.PROCESSING);
        btn.disabled = true;

        try {
            // 1. Metadaten
            const meta = getMetadata();
            state.opUsername = meta.OP;
            state.metaData = { ...meta, Datum_Export: new Date().toISOString() };

            // 2. Kommentare
            updateButton("💬 Lade Seite 1...", BTN_COLORS.PROCESSING);
            const firstPage = await fetchRootComments(1);
            if (!firstPage) throw new Error("API Error beim Laden der Kommentare");

            const totalPages = firstPage.pagination.last;
            let processedCount = 0;

            for (const item of firstPage.items) {
                processComment(item);
                processedCount++;
                updateButton(`📥 ${processedCount} Kommentare...`, BTN_COLORS.PROCESSING);

                if (item.replyCount > 0) {
                    const replies = await fetchNestedReplies(item.commentId);
                    replies.forEach(r => processComment(r, item.user.username));
                    processedCount += replies.length;
                    updateButton(`📥 ${processedCount} (inkl. Antworten)...`, BTN_COLORS.PROCESSING);
                }
            }

            // Parallel Fetching (Batch Size: 5)
            const BATCH_SIZE = 5;
            for (let i = 2; i <= totalPages; i += BATCH_SIZE) {
                const batchPromises = [];
                const endPage = Math.min(i + BATCH_SIZE - 1, totalPages);

                updateButton(`📄 Lade Seite ${i}-${endPage}/${totalPages}...`, BTN_COLORS.PROCESSING);

                for (let p = i; p <= endPage; p++) {
                    batchPromises.push(fetchRootComments(p));
                }

                const results = await Promise.all(batchPromises);

                for (const pageData of results) {
                    if (pageData && pageData.items) {
                        for (const item of pageData.items) {
                            processComment(item);
                            processedCount++;

                            // Handle replies sequentially to avoid flooding
                            if (item.replyCount > 0) {
                                const replies = await fetchNestedReplies(item.commentId);
                                replies.forEach(r => processComment(r, item.user.username));
                                processedCount += replies.length;
                            }
                        }
                    }
                }

                updateButton(`📥 ${processedCount} gesammelt...`, BTN_COLORS.PROCESSING);
                await sleep(200); // Breathe between batches
            }

            state.metaData.Statistik = generateStatistics();

            updateButton(`✨ Fertig (${processedCount})`, BTN_COLORS.SUCCESS);

            const cleanJsonl = state.collectedComments.map(c => {
                const { rawUser, ...keep } = c;
                if (keep.reactions.like === 0 && keep.reactions.helpful === 0 && keep.reactions.funny === 0) delete keep.reactions;
                return JSON.stringify(keep);
            }).join('\n');

            openUi(cleanJsonl);

        } catch (e) {
            console.error(e);
            alert("Fehler: " + e.message);
            updateButton("❌ Fehler", BTN_COLORS.ERROR);
        } finally {
            state.isScraping = false;
            setTimeout(() => {
                updateButton(origLabel, BTN_COLORS.NORMAL);
                btn.disabled = false;
            }, 3000);
        }
    }

    // ==========================================
    // 6. UI (Popup Window)
    // ==========================================
    function openUi(jsonlData) {
        const w = window.open('', '_blank', 'width=1000,height=900');
        if (!w) return alert("Popup blockiert!");

        w.document.title = "MyDealz AI Export";
        w.document.head.innerHTML = `
            <style>
                body { font-family: 'Segoe UI', sans-serif; background: #f4f6f8; margin: 0; padding: 20px; color: #2c3e50; }
                .container { max-width: 950px; margin: 0 auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 5px 25px rgba(0,0,0,0.08); }
                h2 { margin-top: 0; color: #2c3e50; border-bottom: 2px solid #ecf0f1; padding-bottom: 15px; display: flex; justify-content: space-between; align-items: center; }
                .badge { background: #3498db; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; vertical-align: middle; }
                .controls { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
                button { padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.2s; }
                .btn-prompt { background: #ecf0f1; color: #7f8c8d; }
                .btn-prompt.active { background: #2c3e50; color: white; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(44, 62, 80, 0.2); }
                .btn-copy { background: #27ae60; color: white; margin-left: auto; }
                .btn-copy:hover { background: #219150; }
                .btn-ai { background: white; border: 1px solid #bdc3c7; color: #7f8c8d; }
                .btn-ai:hover { border-color: #3498db; color: #3498db; }
                textarea { width: 100%; height: 500px; padding: 15px; border: 1px solid #bdc3c7; border-radius: 8px; font-family: 'Consolas', monospace; font-size: 12px; resize: vertical; box-sizing: border-box; line-height: 1.5; background: #fafafa; color: #2c3e50; }
                .meta-info { font-size: 13px; color: #7f8c8d; margin-bottom: 15px; background: #f8f9fa; padding: 10px; border-radius: 6px; border: 1px solid #eee; }
            </style>
        `;

        const render = () => {
            const promptGen = PROMPT_LEVELS[state.currentPromptLevel].gen;
            return promptGen(state.metaData, jsonlData);
        };

        const metaHtml = `
            <strong>Thread:</strong> ${state.metaData.Titel} | 
            <strong>OP:</strong> ${state.metaData.Statistik.Deal_Ersteller} |
            <strong>Temp:</strong> ${state.metaData.DealInfo.Temperatur}° | 
            <strong>Volumen:</strong> ${state.metaData.Statistik.Kommentare_Total} Posts
        `;

        w.document.body.innerHTML = `
            <div class="container">
                <h2>
                    <span>💎 AI Export <span class="badge">v8.1</span></span>
                </h2>
                <div class="meta-info">${metaHtml}</div>
                
                <div class="controls">
                    ${Object.keys(PROMPT_LEVELS).map(k =>
            `<button id="${k}" class="btn-prompt">${PROMPT_LEVELS[k].label}</button>`
        ).join('')}
                    <button id="copy" class="btn-copy">📋 Copy Prompt</button>
                </div>
 
                <textarea id="out" readonly></textarea>
 
                <div class="controls" style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
                    <span style="align-self: center; font-size: 13px; color: #95a5a6; font-weight: 600;">Direkt öffnen:</span>
                    ${KI_LINKS.map(l => `<button id="link_${l.id}" class="btn-ai">${l.label}</button>`).join('')}
                </div>
            </div>
        `;

        const out = w.document.getElementById('out');

        Object.keys(PROMPT_LEVELS).forEach(k => {
            w.document.getElementById(k).onclick = (e) => {
                w.document.querySelectorAll('.btn-prompt').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                state.currentPromptLevel = k;
                out.value = render();
            };
        });

        w.document.getElementById('copy').onclick = () => {
            out.select();
            w.document.execCommand('copy');
            const btn = w.document.getElementById('copy');
            const original = btn.textContent;
            btn.textContent = "✅ Kopiert!";
            setTimeout(() => btn.textContent = original, 1500);
        };

        KI_LINKS.forEach(l => {
            w.document.getElementById(`link_${l.id}`).onclick = () => window.open(l.url, '_blank');
        });

        // Default Active: Standard (Medium)
        w.document.getElementById('MEDIUM').click();
    }

    function init() {
        const btn = document.createElement('button');
        btn.id = "ai-export-btn";
        btn.textContent = "🧠 AI Export";
        Object.assign(btn.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            padding: '12px 20px', background: BTN_COLORS.NORMAL,
            color: '#fff', border: 'none', borderRadius: '50px',
            fontSize: '14px', cursor: 'pointer', zIndex: 99999,
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            fontWeight: 'bold', fontFamily: 'system-ui',
            transition: 'transform 0.2s ease, width 0.2s ease'
        });
        btn.onclick = () => runExport(btn);
        document.body.appendChild(btn);
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);

})();