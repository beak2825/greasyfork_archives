// ==UserScript==
// @name         cC~
// @homepageURL  https://github.com/happyf-weallareeuropean/cC
// @namespace    https://github.com/happyf-weallareeuropean
// @version      2025.08.26
// @author       felixy happyfceleste & Johannes Thyroff(https://github.com/JThyroff/WideGPT)
// @description  tts streaming respose for chatgpt. Hide UI bloat on chatgpt, gemini, claude, mistral.
// @match     *://chatgpt.com/*
// @match     *://gemini.google.com/*
// @match     *://claude.ai/*
// @match     *://mistral.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @connect      localhost
// @grant        GM_xmlhttpRequest
// @run-at       document-body
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/547214/cC~.user.js
// @updateURL https://update.greasyfork.org/scripts/547214/cC~.meta.js
// ==/UserScript==

(() => {
 'use strict';
  /* Use page context for hooks
  const uW = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
  // Lower-level stream hook: intercept fetch streaming tokens directly
  const origFetch = uW.fetch;
  uW.fetch = async (...args) => {
    console.log("[fetch-hook] invoked, url:", args[0]);
    const response = await origFetch(...args);
    const contentType = response.headers.get("Content-Type");
    console.log("[fetch-hook] content-type:", contentType);

    if (args[0].includes("/backend-api/conversation") && contentType?.includes("text/event-stream")) {
      console.log("[fetch-hook] matched conversation endpoint and stream confirmed");

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      let buffer = '';
      (async () => {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          console.log("[fetch-hook] stream chunk (first 100 bytes):", value && value.slice ? value.slice(0, 100) : value);
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop();

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const json = line.slice(6);
              try {
                const msg = JSON.parse(json);
                const delta = msg.choices?.[0]?.delta;
                if (delta?.content) {
                  GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://localhost:65535/speak",
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({ text: delta.content })
                  });
                }
              } catch (err) {
                console.warn("Streaming parse failed", err);
              }
            }
          }
        }
      })();
    } else {
      console.log("[fetch-hook] no match conversation endpoint:", args[0], contentType);
    }

    return response;
  };*/
  /* Monkey-patch EventSource to intercept raw ChatGPT token stream
  const _OrigEventSource = uW.EventSource;
  uW.EventSource = function(url, ...args) {
    console.log("[SSE-hook] EventSource intercepted, url:", url);
    const es = new _OrigEventSource(url, ...args);
    if (typeof url === 'string' && url.includes("/backend-api/conversation")) {
      es.addEventListener('message', e => {
        if (!e.data || e.data === '[DONE]') return;
        // split lines in case multiple data: entries
        e.data.split('\n').forEach(line => {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6);
            try {
              const msg = JSON.parse(jsonStr);
              const delta = msg.choices?.[0]?.delta;
              if (delta?.content) {
                // send each raw token to TTS server
                GM_xmlhttpRequest({
                  method: "POST",
                  url: "http://localhost: 65535/speak",
                  headers: { "Content-Type": "application/json" },
                  data: JSON.stringify({ text: delta.content })
                });
              }
            } catch (err) {
              console.error('SSE parse error', err);
            }
          }
        });
      });
    }
    return es;
  };
  uW.EventSource.prototype = _OrigEventSource.prototype;*/
  // -------------------------------------------------------------------
  /* ==== CSS TRIMS ==== */
  const host = location.host;
  function insCss(cssText) {
    console.log("inscss: entered func");
    const head = document.head || document.documentElement;
    let styleNode = document.getElementById("vwide-css-top");
    console.log("inscss: it readyed");
    if (!styleNode) {
      styleNode = document.createElement("style");
      styleNode.id = "vwide-css-top";
      //styleNode.type = "text/css";
      head.append(styleNode);
      console.log("inscss: created");
    }
    styleNode.textContent = cssText;
    console.log("inscss: done");
  }

  // dom way
  if (host === "chatgpt.com") {
    let euok = false;
    const port = 65535; //8080
    const sel_resp = 'div[class~="markdown"][class~="prose"]';
    const sel_realroman = '[data-message-author-role="assistant"]' + ':not([data-message-id*="placeholder-request" i])' + ":not(:has(.result-thinking, .placeholder-request))";
    const sel_chatlist = ["main .flex.flex-col.text-sm"];
    const sel_scrolbut = "button.cursor-pointer.absolute.z-10.rounded-full.bg-clip-padding.border.text-token-text-secondary.border-token-border-default";

    const USER_PREFIX = "";
    const USER_SUFFIX = "";
    const SYSTEM_PROMPT = ``;
      let pinof = false;

    function ttsend({ text, flushQueue = false, onSuccess = null }) {
      const payload = flushQueue ? { flushQueue: true, text: text } : { text: text };
      GM_xmlhttpRequest({
        method: "POST",
        url: `http://localhost:${port}/speak`,
        headers: { "Content-Type": "application/json; charset=utf-8" },
        data: JSON.stringify(payload),
        onload(response) {
          if (response.status === 200) {
            if (onSuccess) onSuccess();
          } else {
            console.error("❌ ttsend failed:", response.status, response.statusText, response.responseText);
          }
        },
        onerror(err) {
          console.error("❌ ttsend network error", err);
        },
      });
    }
    
    //skip deeper spans
    function getCleanText(node) {
      let txt = "";
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          // direct text
          txt += child.textContent;
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.tagName === "SPAN") {
            // include only immediate text children of this span
            child.childNodes.forEach((inner) => {
              if (inner.nodeType === Node.TEXT_NODE) {
                txt += inner.textContent;
              }
            });
          } else {
            // for other elements, recurse to capture structured content
            txt += getCleanText(child);
          }
        }
      });
      return txt;
    }
    function romangonorth() {
      const STEP = 20; // px up
      const isScrollEl = (el) => {
        const s = getComputedStyle(el);
        return (s.overflowY === "auto" || s.overflowY === "scroll") && el.scrollHeight > el.clientHeight + 1;
      };
      const scroller =
        [...document.querySelectorAll("*")].filter(isScrollEl).sort((a, b) => b.scrollHeight - b.clientHeight - (a.scrollHeight - a.clientHeight))[0] ||
        document.scrollingElement;
      scroller.scrollBy(0, -STEP);
    }
    function romanempireview() {
      romangonorth();
      setTimeout(() => {
        const scb = document.querySelector(sel_scrolbut);
        if (scb) {
          const { x, y, width, height, top, left } = scb.getBoundingClientRect();
          const gapFromBottom = window.innerHeight - (y + height);
          const q1 = window.innerHeight * 0.25;
          console.log(
            `⤵ scroll-scb pos → x=${x.toFixed(1)}, y=${y.toFixed(1)}, ` +
              `w=${width.toFixed(1)}, h=${height.toFixed(1)}, ` +
              `top=${top.toFixed(1)}, left=${left.toFixed(1)}`
          );
          scb.click();
        }
        console.log("nahanah");
      }, 100);
    }

    function sendEU(cmd) {
      // Map command to payload -----------------------------
      let payload;
      switch (cmd) {
        case "play":
          payload = { playEU: true };
          break;
        case "stop":
          payload = { stopEU: true };
          euok = true;
          break;
        case "lp":
          if (euok) return;
          payload = { lpEU: true };
          break;
        case "ds":
          payload = { dsEU: true };
          break;
        default:
          console.warn("sendEU: unknown cmd ▶", cmd);
          return;
      }

      const body = JSON.stringify(payload);
      console.log("sendEU ▶", cmd, "body =", body);

      // POST to local TTS server ----------------------------
      GM_xmlhttpRequest({
        method: "POST",
        url: `http://localhost:${port}/speak`,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "text/plain",
        },
        data: body,
        onload(res) {
          if (res.status === 200) {
            console.log(`✅ sendEU(${cmd}) → 200 OK`);
          } else {
            console.error(`❌ sendEU(${cmd}) → ${res.status}`, res.statusText, res.responseText.trim());
          }
        },
        onerror(err) {
          console.error("❌ sendEU network error", err);
        },
      });
    }

    /*
    function watchBtnY(duration = 5000, every = 1000) {
      const scb = document.querySelector(sel_scrolbut);
      if (!scb) {
        console.warn("⚪ watchBtnPosition: button not found");
        return;
      }

      let last = scb.getBoundingClientRect();
      console.log(`📌 start   y=${last.y.toFixed(1)}, gap=${(window.innerHeight - (last.y + last.height)).toFixed(1)}`);

      const id = setInterval(() => {
        const cur = scb.getBoundingClientRect();
        const gap = window.innerHeight - (cur.y + cur.height);

        if (cur.y !== last.y || cur.height !== last.height) {
          console.log(`📍 change  y=${cur.y.toFixed(1)}, gap=${gap.toFixed(1)}`);
          last = cur;
        }
      }, every);

      setTimeout(() => {
        clearInterval(id);
        console.log("⏹️ watchBtnPosition done");
      }, duration);
    }
    */
    // -------------------------------------------------------------------

    let lastKnownFullText = "";
    // let wordBuf = ""; // (disabled) rolling buffer removed

    // ---- Global key event blocker ----
    /*let blockKeys = false;
    function keyBlocker(ev) {
      // Allow the “f” keyup that turns the block off to pass through.
      if (blockKeys && !(ev.key === "f" && ev.type === "keyup")) {
        ev.stopImmediatePropagation();
        ev.preventDefault();
      }
    }
    // Capture‑phase listeners ensure we cancel events before anyone else.
    document.addEventListener("keydown", keyBlocker, true);
    document.addEventListener("keyup", keyBlocker, true);
    */
    let detailObserver = null;
    let currentTargetNode = null;
    let listObserver = null;
    let lastromanid = null;
    let uareromanbefore = false;
    // 1) Patch the history methods so we can detect in-app route changes
    //    (pushState, replaceState) and the popstate event
    function onRouteChange() {
      console.log("🔁 Route changed → re-initializing observers...");
      // Disconnect old observer if any
      if (listObserver) {
        listObserver.disconnect();
        listObserver = null;
      }
      waitc(() => {
        h();
        s();
        startListObserver();
      });
    }

    const originalPushState = history.pushState; //when u go from chatgpt.com to chatgpt.com/c
    history.pushState = function (...args) {
      const ret = originalPushState.apply(history, args);
      onRouteChange();
      return ret;
    };

    const originalReplaceState = history.replaceState; // cmd shift o back to main page n posible more. so ps we need both
    history.replaceState = function (...args) {
      const ret = originalReplaceState.apply(history, args);
      onRouteChange();
      return ret;
    };

    window.addEventListener("popstate", onRouteChange, {passive: true});

    // 3) Observers for new messages + partial tokens
    function processLatestMessage() {
      const bublist = document.querySelectorAll(sel_realroman);
      const lastbub = bublist[bublist.length - 1];

      const targetNode = lastbub?.querySelector(sel_resp) ?? null;
      if (!targetNode) return;
    // if (!targetNode) { setTimeout(processLatestMessage, 300); console.log("no lastbub. retry"); return; }
      const initialCleanText = getCleanText(targetNode);
      const romanid = lastbub.getAttribute("data-message-id") ?? null;
      /*console.log("🔎 Initial latestnode:", lastbub);
      console.log("🔎 Initial token tree:", targetNode);
      console.log("🔎 Initial romanid:", romanid);
      */
      if (targetNode !== currentTargetNode || romanid !== lastromanid) {
        console.log("✅ New assistant message content node detected. Attaching detail observer. c:");
        lastKnownFullText = "";
        currentTargetNode = targetNode;
        detailObserver?.disconnect();

        if (!uareromanbefore) lastromanid = romanid;

        const initialText = initialCleanText;
        if ((initialText && typeof GM_xmlhttpRequest === "function") || (uareromanbefore && initialText)) {
          console.log("flushing queue");
          if (uareromanbefore) {console.warn("are u roman")};
          uareromanbefore = false;
          ttsend({
            text: getCleanText(targetNode),
            flushQueue: true,
            onSuccess: () => {
              console.log("✅ flushQueue + initialText sent successfully");
              /*
              if (wordBuf.trim()) {
                ttsend({ text: wordBuf });
                // wordBuf = "";
              }
              */
              //sendEU("stop");
            },
          });
          sendEU("play");
          lastKnownFullText = initialCleanText;
        } else {
          uareromanbefore = true;
          console.log("nextime roman");
        }
        // (partial tokens logic below)
        detailObserver = new MutationObserver(() => {
          const currentCleanText = getCleanText(currentTargetNode);

          // Case 1 — text grew
          if (currentCleanText.length > lastKnownFullText.length) {
            const newPortion = currentCleanText.slice(lastKnownFullText.length);
            console.log("🟢 Partial tokens:", newPortion);
           
             if (uareromanbefore) {ttsend({ flushQueue: true})};

            if (newPortion) {
              // direct send without buffering
              ttsend({ text: newPortion });
            }

            lastKnownFullText = currentCleanText;
            /*
            if (currentCleanText.endsWith(".") || currentCleanText.endsWith("!") || currentCleanText.endsWith("?")) {
              if (wordBuf.trim()) {
                ttsend({ text: wordBuf });
                // wordBuf = "";
              }
            }
            */
          }
          // Case 2 — editor rewrote text (rare but happens while streaming)
          else if (currentCleanText.length < lastKnownFullText.length && lastKnownFullText !== "") {
            console.log("🔄 Text reset or changed significantly.");
            lastKnownFullText = currentCleanText;
          }
        });

        detailObserver.observe(currentTargetNode, {
          childList: true,
          subtree: true,
          //characterData: true,
          //attributes: true, //not add, it would break
        });

        lastKnownFullText = initialCleanText;
        if (lastKnownFullText) {
          console.log("🟢 Initial content:", lastKnownFullText);
        }
      }
    }

    function handleMutation(mutation) {
      if (mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches(sel_chatlist)) {
            return true; // found a new assistant message
          }
        }
      }
      return false;
    }

    function findElement(selectors) {
      for (const selector of selectors) {
        const element = document.querySelector(selector);
        if (element) {
          const firstTurn = element.closest("article")?.parentElement || element.closest('[data-testid^="conversation-turn-"]')?.parentElement || element;
          console.log(`Using container found by selector: "${selector}", actual element:`, firstTurn);
          return firstTurn;
        }
      }
      console.warn("Could not find chat list container using selectors:", sel_chatlist);
      return null;
    }

    function startListObserver() {
      
      const chatListContainer = findElement(sel_chatlist);
      if (chatListContainer && chatListContainer instanceof Node) {
        listObserver = new MutationObserver((mutations) => {
                //sendEU("play");
            console.log("chatlist obs");
            setTimeout(processLatestMessage, 150);
          });

        listObserver.observe(chatListContainer, {
          childList: true,
          //attributes: true,
          subtree: true,
          //attributeFilter: ["data-start"],
        });
        console.log("✅ Chat list observer started on:", chatListContainer);
        setTimeout(processLatestMessage, 100);
      } else {
        waitc(() => {
          h();
          console.warn("⏳ Waiting for chat list container... Retrying in 1s");
          setTimeout(startListObserver, 1000);
        });
      }
    }
    
    

    function reloadObservers() {
      if (detailObserver) {
        detailObserver.disconnect();
        detailObserver = null;
      }
      currentTargetNode = null;
      //lastKnownFullText = "";
      //lastromanid = null;
      processLatestMessage();
    }

    function waitc(callback) {
      if (location.pathname.includes("/c/")) {
        console.log("✅ Detected /c/ route, starting logic.");
        callback();
      } else {
        console.log("⏳ Waiting for /c/ route...");
       
      }
    }

    /*
    sendEU("lp");
    const ds_interval = setInterval(() => {
      if (euok) {
        clearInterval(ds_interval);
        return;
      }
      sendEU("ds");
    }, 1000);*/ 
    
    
    let ts = {};
    const l = 40;
    const L = 650;
    let rDownTime = null;
    let pressTimerS = null;
    let uistate = false;
    let sstate = false;
    let stt = "a";

    function s() {
      if (sstate) return;
      sstate = true;
      let pressTimer = null;
      let shown = false;
      const mods = (e) => !e.metaKey && !e.altKey && !e.shiftKey && !e.ctrlKey && !e.fnKey && !e.capsLockKey;
      const dt = (duration) => duration <= 70;

      document.addEventListener("keydown", (e) => {
        if (e.key === "f" && pressTimer === null && !uistate) {
          pressTimer = performance.now();
        } else if (uistate && mods(e)) {
          ["a", "b", "c", "d"].forEach((id) => g(id, "display", "none", "important"));
          uistate = false;
        }
        /*if (e.key === "r" && rDownTime === null) {
          rDownTime = performance.now();
          //console.log(`r‑tap detected ( ${rDownTime.toFixed(0)} ms )`);
        }*/
        /*  if (e.fnKey) {
          console.log("asf");
           const label = stt === "a" ? "Dictate button" : "Submit dictation";
           const btn = document.querySelector(`button[aria-label="${label}"]`);
           if (btn) btn.click();
           stt = stt === "a" ? "b" : "a";
        }*/
        // Reload on CapsLock + R (no Fn dependency)
        if (e.key.toLowerCase() === "r" && e.getModifierState("CapsLock")) {
          reloadObservers();
        }
        if (e.key === "s" && e.getModifierState("CapsLock")) {
          const label = stt === "a" ? "Dictate button" : "Submit dictation";
          const btn = document.querySelector(`button[aria-label="${label}"]`);
          if (btn) btn.click();
          stt = stt === "a" ? "b" : "a";
        }
        if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && !e.fnKey && !e.capsLockKey) {
          window.addEventListener("blur", () => {return;}, {once: true});
           const n = document.querySelector(".z-50.max-w-xs.rounded-2xl");
           const m = document.querySelector(".popover.border-token-border-default.bg-token-main-surface-primary.rounded-2xl.border.p-2.shadow-lg");

           if (!n && !m) {
            const btn = document.getElementById("composer-submit-button");
            if (!pinof) {
            const textarea = document.getElementById(TARGET_ID);
            const content = textarea.textContent || "";
            if (!hasInjected(content)) {
              textarea.textContent = wrapMessage(content);
              pinof = true;
            }
            }
             //const sel = document.getElementById("prompt-textarea");
             //const t = sel.innerText;       
                if (btn) { e.stopImmediatePropagation(); e.preventDefault(); requestAnimationFrame(() => { btn.click(); setTimeout(romanempireview, 100); }); } else {
                 romanempireview(); 
                }

             /*if (t) {
            //await new Promise(resolve => setTimeout(resolve, 500));
            const p = window.location.href + "/?model=o4-mini";
            window.open(p, "_blank");
            //GM_openInTab(p, { active: true });
            sel.value = t; // paste text back
            sel.dispatchEvent(new Event("input", { bubbles: true }));
            btn.click();
          }*/
          }
        }
        /*  if (e.key === "v" && e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
         document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, shiftKey: false, altKey: false, metaKey: false }));
         document.dispatchEvent(new KeyboardEvent('keyup', { key: 's', ctrlKey: true, shiftKey: false, altKey: false, metaKey: false }));
         document.dispatchEvent(new KeyboardEvent('keydown', { key: 'v', metaKey: true, shiftKey: false, altKey: false, ctrlKey: false }));
         document.dispatchEvent(new KeyboardEvent('keyup', { key: 'v', metaKey: true, shiftKey: false, altKey: false, ctrlKey: false }));

        }*/
       if (e.key === "b") {
        
       }

      }, true);

      document.addEventListener("keyup", (e) => {
        if (e.key === "f") {
          const duration = performance.now() - (pressTimer ?? 0);
          if (dt(duration)) {
            ["a", "b", "c", "d"].forEach((id) => g(id, "display", "flex", "important"));
            uistate = true;
          }
          pressTimer = null;
        }
        /*if (e.key === "r") {
          const duration = performance.now() - (rDownTime ?? 0);
          if (dt(duration)) {
            reloadObservers();
          }
          rDownTime = null;
        }*/
        /*
        if (e.key === "s") {
          const duration = performance.now() - (pressTimerS ?? 0);
          if (dt(duration)) {
            console.log(`s‑tap detected ( ${duration.toFixed(0)} ms )`);
            const label = stt === "a" ? "Dictate button" : "Submit dictation";
            const btn = document.querySelector(`button[aria-label="${label}"]`);
            if (btn) btn.click();
            stt = stt === "a" ? "b" : "a";
          }
          pressTimerS = null;
        }*/
      });

      /*document.addEventListener("mousemove", (e) => {
        if (!shown) {
          const y = e.clientY;
          //more sug to use f hotkey to show, delete didnot none so juterfy like this for now
          g("a", "display", y < l ? "none" : "none", "important");
          g("b", "display", y < l ? "none" : "none", "important");
          /*const Ł = y > L;
        g("b", "display", Ł ? "flex" : "none", "important");
        g("c", "display", Ł ? "flex" : "none", "important");
        }
      });*/
    }
    
    function g(target, prop, val, important) {
      // When a key string is passed, dereference inside ts first.
      const nodeOrList = typeof target === "string" ? ts[target] : target;

      if (!nodeOrList) return;

      // Apply style to one or many elements transparently.
      if (nodeOrList instanceof NodeList || Array.isArray(nodeOrList)) {
        nodeOrList.forEach((el) => el?.style?.setProperty(prop, val, important));
      } else {
        nodeOrList.style.setProperty(prop, val, important);
      }
    }

    function h() {
      ts = T();
      g("all", "display", "none", "important");
    }

    function T() {
      const selectors = `
      #page-header,
      form[data-type="unified-composer"] .flex-auto.flex-col>div[style*="height:48px"],
      .bg-primary-surface-primary,
      #stage-slideover-sidebar,
      #thread-bottom-container .text-token-text-secondary
    `;
      const [a, b, c, d, e] = document.querySelectorAll(selectors);
      return { a, b, c, d, e, all: document.querySelectorAll(selectors) };
    }

    const TARGET_ID = "prompt-textarea";
    function hasInjected(content) {
      return content.includes("<|system|>") || content.includes("<|userinput|>");
    }
    function wrapMessage(text) {
       const clean = text.trim();
       return USER_PREFIX + clean + USER_SUFFIX + SYSTEM_PROMPT;
     }


    waitc(() => {
      ts = T();
      startListObserver();
      s();
      h();
    });

    //vh wide css
    insCss(`/* force that div taller */
    div.grow.overflow-y-auto {
    min-height: 680px !important;
//  margin: auto !important;
}
/* force a thinner cut */
body,
[data-message-author-role="assistant"],
[data-message-author-role="user"] {
  /* try the light/thin PostScript name first */
  font-weight: 300 !important;    /* very light */
}

/* very important to remove the botom padding. Remove bottom margin from the composer's wrapper */
main div.isolate.w-full.basis-auto.mb-4 {
    margin-bottom: 0 !important;
}
main div.sticky.top-0.max-md\:hidden.h-header-height {
  /* Hide the elements completely */
  display: none !important;
}
div.isolate.w-full.basis-auto.flex.flex-col {
  padding: 0 !important;
}
div.text-base.mx-auto {
  padding-left: 0 !important;
  padding-right: 0 !important;
  --thread-content-margin: 0px !important;
}
div[class*="@thread-xl"] {
  margin-top: 0 !important;
  padding-bottom: 0 !important;
}

/* 1. Target the container setting the overall width and margin */
/* Overrides pl-2 (padding-left) */
div[style*="max-width: 100%"] {
  padding: 0 !important;
  /* Optionally remove the horizontal padding variable if needed, though mx-auto centers it */
  /* padding-right: 0 !important; */
}

/* 2. Target the inner container holding the input grid and buttons */


/* 3. Target the container specifically around the input field */
/* Overrides ps-2 pt-0.5 (padding-start, padding-top) */
form[data-type="unified-composer"] div[class*="ps-2 pt-0.5"] {
  padding: 0 !important;
}

/* 4. Target the main container div holding the ProseMirror editor */
/* Overrides pe-3 (padding-end) */
._prosemirror-parent_1e8bb_2 {
  padding: 0 !important;
  /* Optional: Override min-height if it causes unwanted space */
  /* min-height: auto !important; */
}

/* 5. Target the hidden textarea */
/* Overrides py-2 (padding-top/bottom) */
._prosemirror-parent_1e8bb_2 textarea {
  padding: 0 !important;
  /* Ensure height doesn't add space if it becomes visible */
  height: auto !important;
  min-height: 0 !important;
}

/* 6. Target the actual contenteditable input area (ProseMirror div) */
/* Remove any default or library-added padding/margin */
#prompt-textarea {
  padding: 0 !important;
  margin: 0 !important;
  /* Ensure it can shrink vertically if needed */
   min-height: 0 !important;
}

/* 7. Target the paragraph element often used inside the input area */
/* Remove default browser margins for paragraphs */
#prompt-textarea p {
  margin: 0 !important;
  padding: 0 !important;
}

/* 8. Target the grid container holding the input area */
/* Overrides ms-1.5 (margin-start) */
form[data-type="unified-composer"] div[class*="ms-1.5 grid"] {
  margin: 0 !important; /* Use margin: 0 to reset all margins */
}

/* 9. Target the container for potential elements after the input grid */
/* Overrides ms-2 (margin-start) */
form[data-type="unified-composer"] div[class*="ms-2 flex"] {
  margin: 0 !important; /* Use margin: 0 to reset all margins */
}

/* 10. Optional: Adjust absolute positioned buttons container */
/* If removing padding makes buttons overlap or look wrong, adjust their position. */
/* Example: Resetting left offset */
/*
.bg-primary-surface-primary.absolute.right-0.bottom-\[9px\].left-\[17px\] {
    left: 0 !important;
    bottom: 0 !important; /* Maybe adjust bottom too */
/* } */
/* Target any element whose class contains "prosemirror-parent_" */
div[class*="prosemirror-parent_"] {
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box !important;
  padding-inline-end: 0 !important; /* removes right-side padding from pe-3 */
  padding-right: 0 !important;       /* extra safety */
}

/* Target the actual contenteditable input area (ProseMirror div) */
/* Remove any default or library-added padding/margin */
#prompt-textarea {
  padding: 0 !important;
  margin: 0 !important;
}

/* Target the paragraph element often used inside the input area */
/* Remove default browser margins for paragraphs */
#prompt-textarea p {
  margin: 0 !important;
  padding: 0 !important; /* Less likely needed, but safe */
}
div[class^="prosemirror-parent"] .ProseMirror,
div[class^="prosemirror-parent"] .ProseMirror * {
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}
/* 1. Target the direct container holding the input area and buttons */
/* This div has px-3 py-3 which creates the main internal padding */
form[data-type="unified-composer"] > div > div.relative.flex.w-full.items-end {
  padding: 0!important;
}


/* 2. Target the container specifically around the input field */
/* This div has ps-2 pt-0.5 (padding-start, padding-top) */
form[data-type="unified-composer"] div.relative.flex-auto.bg-transparent {
  padding: 0 !important;
}

/*very improtant*/
#prompt-textarea {
  padding: 9.1px !important;
}

/* 4. Target the hidden textarea (might still influence layout slightly) */
/* It has py-2 (padding-top/bottom) */
form[data-type="unified-composer"] textarea[placeholder="Ask anything"] {
  padding: 0 !important;
}

/* 5. Target the grid container holding the input area */
/* It has ms-1.5 (margin-start) */
form[data-type="unified-composer"] div[class*="ms-1.5 grid"] {
  margin: 0 !important;
}

/* 6. Target the container for potential elements after the input grid */
/* It has ms-2 (margin-start) */
form[data-type="unified-composer"] div[class*="ms-2 flex"] {
  margin: 0 !important;
}

/* 7. Optional: Adjust the absolute positioned buttons container if needed */
/* Removing padding might make these overlap; this resets its position slightly */
/*
form[data-type="unified-composer"] .absolute.right-3.bottom-0 {
    right: 0 !important;
    bottom: 0 !important;
}
*/
/* Target the container around the typing area */
.prosemirror-parent, /* If there's a class for that container */
.prose { /* Or a more general prose container */
  padding: 0 !important;
  margin: 0 !important;
  border: none !important;
}

    /*Target the actual surrounding bar*/
.bg-token-main-surface-primary{
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
}
.bg-clip-padding{
     padding: 0 !important;
    margin: 0 !important;
    border: none !important;
}
.px-3 {
    padding-left: 0 !important;
    padding-right: 0 !important;
}
.py-3{
    padding-top: 4px !important;
    padding-bottom: 6px !important;
}
/*this owuld impect to something not needed*/
/*Extra precaution and get to the children*/

.absolute > * {
    padding: 0 !important;
    margin: 0 !important;
    border: none !important;
}
/* Optional: Kill vertical gaps from container tokens */
div[class*="text-primary"] > div {
  margin: 0 !important;
  padding: 0 !important;
}


div.text-base.my-auto.mx-auto.py-5 {
  padding-left: 1px !important;
  padding-right: 0 !important;
}
/* Main content container */
main.relative.h-full.w-full.flex-1 {
  padding: 0 !important;
  width: 100% !important;
  max-width: none !important;
  box-sizing: border-box !important;
}

/* Conversation turn block */
div[class*="conversation-turn"].relative.flex.w-full.min-w-0.flex-col {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

/* Inside message: user + assistant full zero padding */
[data-message-author-role="user"] *,
[data-message-author-role="assistant"] * {
//  padding: 0 !important;
}

/* Remove padding from markdown wrapper */
article div.text-base.mx-auto.px-6 {
  padding-left: 0px !important;
  padding-right: 0px !important;
}

/* Max width unlock for bubble containers */
[data-message-author-role="user"] div[class*="max-w-"],
[data-message-author-role="user"] .relative.max-w-\[var\(--user-chat-width\,70\%\)\],
[data-message-author-role="user"] .whitespace-pre-wrap {
  width: 100% !important; /* currently not working but in arc but would work with 'boost' */
  max-width: none !important;
  text-align: right !important;
  box-sizing: border-box !important;
}

/* currently doesn't work but in arc would work with 'boost'
[data-message-author-role="user"] .relative.max-w-\[var\(--user-chat-width\,70\%\)\] {
  border: 0.01px solid rgb(151, 148, 148) !important; 
  border-radius: 15px !important;
}
[data-message-author-role="user"] .relative {
  display: inline-block !important;
  max-width: 90% !important;       
  padding: 5px 5px !important;   
  margin: 6px 0 !important;
  background-color: #000 !important; 

}
body {
  line-height: 1.275 !important;
font-stretch: condensed !important;  
margin-block-start: 0 !important; Remove space before blocks 
    }*/
//---credit to 'wide gpt' start---
@media (min-width: 1280px) {
            .xl\\:max-w-\\[48rem\\],
            .xl\\:px-5 {
                max-width: 100% !important;
                padding-left: 1.25rem;
                padding-right: 1.25rem;
            }
        }

        @media (min-width: 768px) {
            .md\\:max-w-3xl {
                max-width: 100% !important;
            }
        }

        @container (width >= 64rem) {
            .\\@\\[64rem\\]\\:\\[--thread-content-max-width\\:48rem\\] {
                --thread-content-max-width: 100% !important;
            }
        }

        @container (width >= 34rem) {
            .\\@\\[34rem\\]\\:\\[--thread-content-max-width\\:40rem\\] {
                --thread-content-max-width: 100% !important;
            }
        }

        /* Extra: override fallback static styles if exist */
        [style*="max-width"] {
            max-width: 100% !important;
        } 
//---credit to 'wide gpt' end---
`);
  } else if (host === "gemini.google.com") {
    insCss(`/* === General Layout Widening === */

/* Make the main application container take full width */
chat-app,
body,
html {
  width: 100% !important;
  max-width: none !important;
}

/* Target the container holding sidebar AND content */
mat-sidenav-container.mat-drawer-container {
  width: 100% !important;
}

/* Target the main content area NEXT TO the sidebar */
mat-sidenav-content.mat-drawer-content {
  width: 100% !important; /* Allow content area to take available width */
  margin-left: 0 !important; /* Override default margin when sidebar is closed */
  margin-right: 0 !important;
  padding-inline: 0px !important; /* Add some padding back for breathing room */
  box-sizing: border-box; /* Include padding in width calculation */
}

/* Ensure the chat window itself fills the content area */
chat-window[_nghost-ng-c1777261061] {
  width: 100% !important;
}

/* Adjust the chat history container padding */
chat-window-content .chat-history {
  padding-inline: 0px !important; /* Keep this 0 if you want edge-to-edge content */
  /* or use 16px for some spacing: padding-inline: 16px !important; */
}


/* === Central Content Widening (Keep previous rules) === */

/* Target the main chat conversation area */
.conversation-container {
  max-width: 1400px !important; /* Increased further, adjust as needed */
}

/* Target the input area container at the bottom */
input-container {
   max-width: 1400px !important; /* Match the conversation width */
   padding-inline: 0px !important; /* Keep this 0 if you want edge-to-edge input */
   /* or use 16px: padding-inline: 16px !important; */
}

/* Target the initial "zero state" screen container */
.zero-state-container {
   max-width: 1400px !important; /* Match the conversation width */
 }

/* Ensure the container *within* input-container fills it */
.input-area-container {
   max-width: 100% !important;
}


/* === User Prompt Widening === */

/* Target the specific container for the user prompt bubble's background/layout */
user-query .user-query-bubble-with-background {
  max-width: none !important; /* Remove the max-width restriction */
  width: 100% !important;     /* Allow it to take full available width */
  box-sizing: border-box; /* Include padding/border in the width */
}

/* Ensure the parent container allows full width */
user-query .query-content {
  width: 100% !important;
}

/* === Optional: Adjust Immersive Mode === */
.immersives-mode[_nghost-ng-c1777261061]:not(.mobile-device) {
    max-width: 100% !important; /* Adjust as needed, e.g., 1800px, none */
    margin: 0 auto !important; /* Center it if not 100% width */
}

/* === Your Line Height Rule (Keep it) === */
.markdown p, .markdown li {
  line-height: 1.5 !important;
}

/* === Sidebar Adjustments (Optional - might break things) === */
/* Hide the collapsed sidebar visually and remove its width influence */
/* Use with caution, might hide the toggle button */
/*
bard-sidenav-container mat-sidenav.mat-drawer-closed {
  width: 0 !important;
  min-width: 0 !important;
  visibility: hidden !important;
  border: none !important;
}
*/
`);
  } else if (host === "mistral.ai" || host === "claude.ai") {
    insCss(`
    .max-w-3xl {
        max-width: 200ch;
    }
    .max-w-\[75ch\] {
        max-width: 200ch;
    }
`);
  }
})();