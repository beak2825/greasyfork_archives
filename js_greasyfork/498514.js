// ==UserScript==
// @name        perplexa
// @match       https://www.google.com/search*
// @namespace    guebosch
// @version      2024-08-11
// @description  Greasemonkey script to get Perplexity answers within Google search
// @author       guebosch, https://github.com/adtac
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/498514/perplexa.user.js
// @updateURL https://update.greasyfork.org/scripts/498514/perplexa.meta.js
// ==/UserScript==

// Draft: Fix the errors below

async function getID() {
    const resp = await fetch("https://www.perplexity.ai/socket.io/?EIO=4&transport=polling", {
        credentials: "include",
    });
    const text = await resp.text();
    const json = JSON.parse(text.substr(text.indexOf("{")));
    return json.sid;
}

async function postID(sid) {
    const resp = await fetch("https://www.perplexity.ai/socket.io/?EIO=3&transport=polling&sid=" + sid, {
        method: "POST",
        body: '40{"jwt":"anonymous-ask-user"}',
        credentials: "include",
    });
    return resp.status == 200;
};

async function show(query) {
    const root = document.createElement("div");
    root.style.position = "absolute";
    root.style.right = "32px";
    root.style.top = (document.getElementById("appbar").offsetTop + 16) + "px";
    root.style.borderRadius = "4px";
    root.style.background = "white";
    root.style.width = "24rem";
    root.style.border = "1px solid #e0e0e0";
    root.style.padding = "0";
    root.style.margin = "0";
    
    root.style.overflowY = "hidden";
    root.style.minHeight = "6rem";
    root.style.maxHeight = "6rem";
    
    const main = document.createElement("p");
    main.style.fontSize = "13px";
    main.style.position = "relative";
    main.style.padding = "0";
    main.style.margin = "0";
    main.style.padding = "12px 24px";
    root.appendChild(main);
    
    const more = document.createElement("button");
    more.innerText = "Expand";
    more.style.color = "#808080";
    more.style.position = "absolute";
    more.style.top = "2rem";
    more.style.right = "0px";
    more.style.width = "100%";
    more.style.height = "4rem";
    more.style.background = "linear-gradient(180deg, transparent, white 50%)";
    more.style.border = "none";
    more.style.borderRadius = "4px";
    more.style.cursor = "pointer";
    more.style.paddingTop = "2rem";
    more.style.fontSize = "10px";
    root.appendChild(more);
    more.addEventListener("click", () => {
        root.removeChild(more);
        root.style.overflowY = "unset";
        root.style.minHeight = "unset";
        root.style.maxHeight = "unset";
    })
    document.body.appendChild(root);
    
    const sid = await getID();
    await postID(sid);
    const ws = new WebSocket("wss://www.perplexity.ai/socket.io/?EIO=4&transport=websocket&sid=" + sid);
    ws.addEventListener("open", (e) => {
        ws.send("2probe");
        ws.send("5");
        ws.send("421" + JSON.stringify([
            "perplexity_ask",
            query,
            {
                "version": "2.5",
                "search_focus": "internet",
                "mode": "concise",
                "prompt_source": "user",
                "query_source": "home",
            },
        ]));
    });
    
    ws.addEventListener("message", (e) => {
        if (e.data == "2") {
            ws.send("3");
            return;
        }
        
        let s = e.data;
        while (/^\d/.test(s)) {
            s = s.substr(1);
        }
        if (s == "") {
            return;
        }
        try { s = JSON.parse(s); } catch (e) {}
        if (Object.prototype.toString.call(s) != "[object Array]") {
            return;
        }
        
        let t = null;
        if (s[0] == "query_progress") {
            t = "query_progress"
            s = s.slice(1);
        }
        
        const { status } = s[0];
        let data = null;
        switch (status) {
            case "pending":
                data = JSON.parse(s[0].text);
            case "completed":
                data = JSON.parse(s[0].text);
        }
        
        if (data == null) {
            return;
        }
        
        const p = document.createElement("p");
        main.innerHTML = "";
        main.appendChild(p);
        
        let ans = data.answer;
        while (true) {
            const repl = ans.replace(/(\[\d+\])\./, ".$1"); // "[1]." -> ".[1]" for nicer formatting
            if (repl == ans) {
                break;
            }
            ans = repl;
        }
        
        while (ans.length > 0) {
            const m = ans.match(/\[\d+\]/);
            let end = ans.length;
            if (m) {
                end = m.index;
            }
            if (end == 0) {
                const cite = parseInt(ans.substr(1, ans.indexOf("]")));
                const { name, url } = data.web_results[cite-1];
                const a = document.createElement("a");
                a.style.margin = "4px";
                a.style.float = "right";
                a.style.width = "24px";
                a.style.height = "24px";
                a.style.outline = "1px solid #f0f0f0";
                a.style.borderRadius = "4px";
                a.style.background = "center url(https://www.google.com/s2/favicons?sz=128&domain=" + (new URL(url)).hostname + ")";
                a.style.backgroundSize = "cover";
                a.title = name;
                a.href = url;
                p.appendChild(a);
                ans = ans.substr(cite.toString().length + 2)
            } else {
                const span = document.createElement("span");
                span.style.width = "calc(100% - 5rem)";
                span.style.float = "left";
                span.style.borderRight = "1px solid #f0f0f0";
                span.style.padding = "4px 1rem 4px 0px";
                span.style.marginBottom = "1rem";
                span.innerText = ans.substr(0, end).trim();
                p.appendChild(span);
                ans = ans.substr(end);
            }
        }
        
        if (status == "completed") {
            const a = document.createElement("a");
            a.style.margin = "4px";
            a.style.fontSize = "10px";
            a.style.color = "#1d4ed8";
            a.style.width = "24px";
            a.style.height = "24px";
            a.style.border = "1px solid #f0f0f0";
            a.style.borderRadius = "4px";
            a.style.background = "center url(https://www.google.com/s2/favicons?sz=128&domain=perplexity.ai)";
            a.style.backgroundSize = "cover";
            a.href = "https://perplexity.ai/search?q=" + encodeURIComponent(query);
            const el = document.createElement("p");
            el.style.display = "flex";
            el.style.justifyContent = "flex-end";
            el.style.width = "100%";
            el.style.textAlign = "right";
            el.marginTop = "4px";
            el.appendChild(a);
            p.appendChild(el);
            ws.close();
        }
    });
}

function main() {
    const search = document.location.search;
    const params = new URLSearchParams(search);
    show(params.get("q"));
}

main();