// ==UserScript==
// @name         LeetSession – Code obsession
// @namespace    https://github.com/wallandteen
// @version      1.0.0
// @description  Work-around for LeetCode’s removed “Session Management” feature (see issue #22883). It emulates the legacy behaviour by creating a self-updating favorite list that contains every problem and automatically syncs it.
// @author       Valentin Chizhov
// @license      MIT
// @homepageURL  https://github.com/wallandteen/leetsession#readme
// @supportURL   https://github.com/wallandteen/leetsession/issues
// @icon         https://raw.githubusercontent.com/wallandteen/leetsession/main/assets/icon48.ico
// @match        https://leetcode.com/*
// @run-at       document-end
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543964/LeetSession%20%E2%80%93%20Code%20obsession.user.js
// @updateURL https://update.greasyfork.org/scripts/543964/LeetSession%20%E2%80%93%20Code%20obsession.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const MARK = "[LS]";
  const SESSION_FLAGS = {
    CREATING: "[CREATING]", 
  };
  
  const SESSION_DESCRIPTION = `Customise freely but keep [LS] in the name for auto-sync. Give me a ⭐: https://github.com/wallandteen/leetsession`;

  const CONFIG = Object.freeze({
    BTN_ID: "leet-session-btn",
    CHUNK: 1000, 
    MAX_PAR: 6, 
    LAST_SYNC_KEY: "leetSession_lastSync_v1", 
  });

  const MESSAGES = Object.freeze({
    TOAST: {
      ALREADY_CREATING: "⚠️ You are already creating a session. Please wait for it to complete.",
      CREATING_SESSION: "⏳ Creating new session... Please wait.",
      SESSION_CREATED: "✅ Session created successfully!",
      SESSION_FAILED: (error) => `❌ Failed to create session: ${error}`,
      SYNCED_PROBLEMS: "✅ All problems synchronized.",
      INCOMPLETE_SESSIONS: "⚠️ Found incomplete sessions. Syncing to complete...",
    },
    
    UI: {
      BUTTON_TEXT: "New Session",
      BEFORE_UNLOAD: "Session creation is in progress. Are you sure you want to leave?"
    }
  });

  const log = (...args) => console.log("[LeetSession]", ...args);


  class Toast {
    static _ensureStyle() {
      if (document.getElementById("leet-toast-css")) return;
      const style = document.createElement("style");
      style.id = "leet-toast-css";
      style.textContent = `
      .leet{position:fixed;top:20px;right:20px;z-index:90000;background:#fff;border-radius:8px;
        padding:12px 16px;margin-top:8px;box-shadow:0 4px 12px rgba(0,0,0,.15);max-width:420px;
        font-family:system-ui,'Segoe UI',sans-serif;display:flex;gap:12px;animation:in .3s;color:#000;}
      .leet.i{border-left:4px solid #2196f3}.leet.s{border-left:4px solid #4caf50}
      .leet.w{border-left:4px solid #ff9800}.leet.e{border-left:4px solid #f44336}
      .leet .x{margin-left:auto;background:none;border:none;font:16px monospace;cursor:pointer;color:#777}
      @keyframes in{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:none}}
      @keyframes out{from{opacity:1}to{opacity:0;transform:translateX(100%)}}`;
      document.head.appendChild(style);
    }

    static _show(message, type, duration) {
      this._ensureStyle();
      const toast = document.createElement("div");
      toast.className = `leet ${type}`;
      toast.innerHTML = `<span>${message}</span><button class="x">×</button>`;
      toast.querySelector(".x").onclick = () => toast.remove();
      document.body.appendChild(toast);
      
      if (duration > 0) {
        setTimeout(() => {
          toast.style.animation = "out .3s forwards";
          setTimeout(() => toast.remove(), 300);
        }, duration);
      }
    }

    static info(msg, d = 4e3) {
      this._show(msg, "i", d);
    }
    static success(msg, d = 4e3) {
      this._show(msg, "s", d);
    }
    static warn(msg, d = 4e3) {
      this._show(msg, "w", d);
    }
    static error(msg, d = 6e3) {
      this._show(msg, "e", d);
    }
  }


  class GQL {
    static _csrf() {
      return (
        document.cookie.split("; ").find((c) => c.startsWith("csrftoken="))?.split("=")[1] ||
        ""
      );
    }

    static async request(query, variables = {}, operationName = "") {
      log("🌐", operationName || query.split(/[({]/)[0].trim(), variables);
      const response = await fetch("https://leetcode.com/graphql/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "x-csrftoken": this._csrf(),
        },
        body: JSON.stringify({ query, variables, operationName }),
      });

      if (!response.ok) throw Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (json.errors) throw Error(json.errors.map((e) => e.message).join("; "));
      return json.data;
    }
  }


  const Lists = {
    create: ({ name, description = "", pub = false }) =>
      GQL.request(
        `mutation createEmptyFavorite($name: String!, $description: String, $favoriteType: FavoriteTypeEnum!, $isPublicFavorite: Boolean) {
          createEmptyFavorite(
            name: $name,
            description: $description,
            favoriteType: $favoriteType,
            isPublicFavorite: $isPublicFavorite
          ) {
            ok
            error
            favoriteSlug
          }
        }`,
        {
          name,
          description: `${description}`,
          favoriteType: "NORMAL",
          isPublicFavorite: pub,
        },
        "createEmptyFavorite"
      ),

    add: (favoriteSlug, questionSlugs) =>
      GQL.request(
        `mutation batchAddQuestionsToFavorite($favoriteSlug: String!, $questionSlugs: [String]!) {
          batchAddQuestionsToFavorite(
            favoriteSlug: $favoriteSlug,
            questionSlugs: $questionSlugs
          ) {
            ok
            error
          }
        }`,
        { 
            favoriteSlug, 
            questionSlugs 
        },
        "batchAddQuestionsToFavorite"
      ),

    reset: (favoriteSlug) =>
      GQL.request(
        `mutation resetFavoriteSessionV2($favoriteSlug: String!, $deleteSyncedCode: Boolean) {
          resetFavoriteSessionV2(
            favoriteSlug: $favoriteSlug,
            deleteSyncedCode: $deleteSyncedCode
          ) {
            ok
            error
          }
        }`,
        { 
            favoriteSlug, 
            deleteSyncedCode: true 
        },
        "resetFavoriteSessionV2"
      ),

    mine: () =>
      GQL.request(
        `query myFavoriteList {
          myCreatedFavoriteList {
            favorites {
              name
              slug
            }
          }
        }`,
        {},
        "myFavoriteList"
      ),

    questions: async (favoriteSlug) => {
      const data = await GQL.request(
        `query favoriteQuestionList($favoriteSlug: String!) {
          favoriteQuestionList(favoriteSlug: $favoriteSlug, limit: 10000) {
            questions {
              titleSlug
            }
          }
        }`,
        { 
            favoriteSlug 
        },
        "favoriteQuestionList"
      );
      return data.favoriteQuestionList.questions.map((q) => q.titleSlug);
    },

    updateSessionName: (favoriteSlug, newName) => {
      log(`🔄 Updating session name: ${favoriteSlug} → "${newName}"`);
      return GQL.request(
        `mutation updateFavoriteNameDescriptionV2($favoriteSlug: String!, $name: String!, $description: String) {
          updateFavoriteNameDescriptionV2(
            favoriteSlug: $favoriteSlug,
            name: $name,
            description: $description
          ) {
            ok
            error
          }
        }`,
        {
          favoriteSlug,
          name: newName,
          description: SESSION_DESCRIPTION,
        },
        "updateFavoriteNameDescriptionV2"
      ).then(result => {
        if (result.updateFavoriteNameDescriptionV2.ok) {
          log(`✅ Successfully updated session name to: "${newName}"`);
        } else {
          log(`❌ Failed to update session name: ${result.updateFavoriteNameDescriptionV2.error}`);
        }
        return result;
      });
    },
  };


  class SessionManager {

    static async getMine() {
      return (await Lists.mine()).myCreatedFavoriteList.favorites
        .filter((f) => f.name?.includes(MARK));
    }

    static async getIncompleteSessions() {
      return (await SessionManager.getMine()).filter(f => f.name?.includes(SESSION_FLAGS.CREATING));
    }

    static async hasIncompleteSessions() {
      return (await SessionManager.getIncompleteSessions()).length > 0;
    }
    
    static async fetchAllSlugs() {
      log("📡 Loading problems...");
      const json = await (await fetch("https://leetcode.com/api/problems/all/")).json();
      const slugs = json.stat_status_pairs.map((p) => p.stat.question__title_slug);
      log(`✅ Loaded ${slugs.length} problems`);
      return slugs;
    }

    static async generateUniqueSessionName(baseName, state = SESSION_FLAGS.CREATING) {
      const existingSessions = (await Lists.mine()).myCreatedFavoriteList.favorites
        .filter(f => f.name?.includes(MARK))
        .map(f => f.name);
      
      // Find all sessions that start with baseName (with or without state flags)
      const matchingSessions = existingSessions.filter(name => name.startsWith(baseName));
      
      let sessionNumber = 1;
      let sessionName = `${baseName} ${state}`;
      
      if (matchingSessions.length > 0) {
        const numbers = matchingSessions.map(name => {
          const match = name.match(new RegExp(`^${baseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} #(\\d+).*`));
          return match ? parseInt(match[1]) : 0;
        });
        
        const maxNumber = Math.max(...numbers);
        sessionNumber = maxNumber + 1;
        sessionName = `${baseName} #${sessionNumber} ${state}`;
      }
      
      log(`📝 Generated session name: "${sessionName}" (existing: ${existingSessions.length}, max number: ${sessionNumber - 1})`);
      return sessionName;
    }

    static async addProblemsToSession(favoriteSlug, problemsToAdd, sessionName = "Session") {
      if (!problemsToAdd.length) {
        log(`✅ No problems to add to ${sessionName}`);
        return 0;
      }

      log(`📦 Adding ${problemsToAdd.length} problems to ${sessionName}...`);
      
      let concurrency = CONFIG.MAX_PAR;
      let addedCount = 0;

      for (let i = 0; i < problemsToAdd.length; i += CONFIG.CHUNK * concurrency) {
        const group = [];
        for (let j = 0; j < concurrency && i + j * CONFIG.CHUNK < problemsToAdd.length; j++) {
          group.push(problemsToAdd.slice(i + j * CONFIG.CHUNK, i + (j + 1) * CONFIG.CHUNK));
        }

        try {
          await Promise.all(group.map((a) => Lists.add(favoriteSlug, a)));
          addedCount += Math.min(i + CONFIG.CHUNK * concurrency, problemsToAdd.length) - i;
          const currentProgress = Math.min(i + CONFIG.CHUNK * concurrency, problemsToAdd.length);
          log(`➕ Added ${currentProgress}/${problemsToAdd.length} problems to ${sessionName}`);
        } catch (e) {
          if (e.message.includes("429") && concurrency > 1) {
            concurrency--;
            i -= CONFIG.CHUNK * concurrency; // retry current window with reduced concurrency
            continue;
          }
          throw e;
        }
      }

      log(`✅ Successfully added ${addedCount} problems to ${sessionName}`);
      return addedCount;
    }

    static async create() {
      if (await SessionManager.hasIncompleteSessions()) {
        Toast.warn(MESSAGES.TOAST.ALREADY_CREATING);
        return;
      }
      
      // Show toast immediately when button is clicked
      Toast.info(MESSAGES.TOAST.CREATING_SESSION, 6000);
      
      try {
        const dateLabel = new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric"
        }).replace(",", "");
        const listName = await SessionManager.generateUniqueSessionName(`${dateLabel} ${MARK}`, SESSION_FLAGS.CREATING);

        const {
          createEmptyFavorite: { ok, favoriteSlug },
        } = await Lists.create({ 
          name: listName,
          description: SESSION_DESCRIPTION
        });
        if (!ok) throw Error("createEmptyFavorite failed");
        
        log(`📝 Created session: ${listName} (${favoriteSlug})`);

        // Add all problems to the new session
        const slugs = await SessionManager.fetchAllSlugs();
        await SessionManager.addProblemsToSession(favoriteSlug, slugs, listName);
        log(`✅ Successfully synchronized session "${listName}"`);

        await Lists.reset(favoriteSlug);
        log("✅ Session progress reset successfully");
        
        // Mark session as ready by removing the CREATING flag
        const finalName = listName.replace(SESSION_FLAGS.CREATING, "");
        await Lists.updateSessionName(favoriteSlug, finalName);
        log(`✅ Session marked as ready: "${finalName}"`);
        
        // Remove the "creating" toast and show success
        const creatingToast = document.querySelector(".leet.i");
        if (creatingToast) creatingToast.remove();
        
        Toast.success(MESSAGES.TOAST.SESSION_CREATED, 6000);
        
        // Navigate to the created session
        window.location.href = `https://leetcode.com/problem-list/${favoriteSlug}`;
      } catch (e) {
        console.error(e);
        Toast.error(MESSAGES.TOAST.SESSION_FAILED(e.message));
        
        // Force sync if session creation was interrupted
        if (await SessionManager.hasIncompleteSessions()) {
          log("⚠️ Session creation was interrupted. Forcing sync to complete...");
          await SessionManager.sync();
        }
      } finally {
      }
    }

    static async sync() {
      const todayUTC = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      const lastSyncDay = localStorage.getItem(CONFIG.LAST_SYNC_KEY);
      
      const incompleteSessions = await SessionManager.getIncompleteSessions();
      const forceSync = incompleteSessions.length > 0;
      
      if (lastSyncDay === todayUTC && !forceSync) {
        log("sync skipped: already done today", todayUTC);
        return;
      }

      if (forceSync) {
        log("🔄 Force sync due to incomplete sessions or interrupted creation");
        if (incompleteSessions.length > 0) {
          log(`⚠️ Found ${incompleteSessions.length} incomplete session(s):`);
          incompleteSessions.forEach(session => {
            log(`   - "${session.name}" (${session.slug})`);
          });
        }
      }

      const mine = await SessionManager.getMine();
      
      if (!mine.length) return;

      const slugs = await SessionManager.fetchAllSlugs();
      let addedTotal = 0;

      for (const fav of mine) {
        log(`🔄 Processing session: "${fav.name}" (${fav.slug})`);
        const haveArr = await Lists.questions(fav.slug);
        const have = new Set(haveArr);
        const diff = slugs.filter((x) => !have.has(x));
        
        log(`   - Has ${haveArr.length} problems, ${diff.length} new problems to add`);
        
        // Add missing problems to the session if any
        if (diff.length > 0) {
          const addedCount = await SessionManager.addProblemsToSession(fav.slug, diff, fav.name);
          addedTotal += addedCount;
          log(`🔄 ${fav.name}: +${addedCount} problems`);
        } else {
          log(`   - No new problems to add`);
        }
        
        // If this was an incomplete session, reset progress and mark it as ready
        if (fav.name?.includes(SESSION_FLAGS.CREATING)) {
          log(`🔄 Resetting progress for incomplete session: "${fav.name}"`);
          await Lists.reset(fav.slug);
          
          const finalName = fav.name.replace(SESSION_FLAGS.CREATING, "");
          log(`🔄 Marking session as ready: "${fav.name}" → "${finalName}"`);
          await Lists.updateSessionName(fav.slug, finalName);
          log(`✅ Successfully marked session as ready: ${finalName}`);
        } else {
          log(`   - Session "${fav.name}" is already ready (no CREATING flag)`);
        }
      }

      if (addedTotal) {
        Toast.success(MESSAGES.TOAST.SYNCED_PROBLEMS, 5000);
        log(`✅ Total synced: +${addedTotal} problems`);
      }

      if (forceSync) {
        log("🧹 Cleared interrupted session tracking");
      }

      localStorage.setItem(CONFIG.LAST_SYNC_KEY, todayUTC);
    }
  }

  class UI {
    static _insertButton() {
      const currentPath = window.location.pathname;
      const allowedPaths = ['/problemset', '/problem-list', '/studyplan'];
      const isAllowedPage = allowedPaths.some(path => currentPath.startsWith(path));
      
      if (!isAllowedPage) {
        log(`Skipping button insertion on path: ${currentPath}`);
        return;
      }
      
      if (document.getElementById(CONFIG.BTN_ID)) {
        log("Button already exists, skipping...");
        return; // Don't disconnect observer - keep watching for changes
      }

      const allDivs = document.querySelectorAll("div.flex.flex-col.gap-1 > div");
      const studyPlanButton = [...allDivs].find(
        (d) => d.textContent.trim() === "Study Plan"
      );
      
      if (studyPlanButton) {
        const btn = document.createElement("div");
        btn.id = CONFIG.BTN_ID;
        btn.className = "rounded-sd-sm hover:bg-sd-accent flex h-10 cursor-pointer items-center gap-2 py-2 pl-2 transition-all";
        btn.onclick = SessionManager.create;
        
        const iconContainer = document.createElement("div");
        iconContainer.className = "relative text-[16px] leading-[normal] p-1 before:block before:h-4 before:w-4";
        
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("aria-hidden", "true");
        svg.setAttribute("focusable", "false");
        svg.setAttribute("class", "svg-inline--fa fa-refresh absolute left-1/2 top-1/2 h-[1em] -translate-x-1/2 -translate-y-1/2 align-[-0.125em]");
        svg.setAttribute("role", "img");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("viewBox", "0 0 24 24");
        
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("fill", "currentColor");
        path.setAttribute("d", "M23,12A11,11,0,1,1,12,1a10.9,10.9,0,0,1,5.882,1.7l1.411-1.411A1,1,0,0,1,21,2V6a1,1,0,0,1-1,1H16a1,1,0,0,1-.707-1.707L16.42,4.166A8.9,8.9,0,0,0,12,3a9,9,0,1,0,9,9,1,1,0,0,1,2,0Z");
        
        svg.appendChild(path);
        iconContainer.appendChild(svg);
        
        const textContainer = document.createElement("div");
        textContainer.className = "select-none text-base font-semibold";
        textContainer.textContent = MESSAGES.UI.BUTTON_TEXT;
        
        btn.appendChild(iconContainer);
        btn.appendChild(textContainer);
        studyPlanButton.parentNode.insertBefore(btn, studyPlanButton.nextSibling);
      }
    }
  }

  const observer = new MutationObserver(() => {
    // Only try to insert if button doesn't exist
    if (!document.getElementById(CONFIG.BTN_ID)) {
      UI._insertButton();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  UI._insertButton(); // initial check


  setTimeout(SessionManager.sync, 1000);

  // Check for interrupted session creation on page load
  (async () => {
    if (await SessionManager.hasIncompleteSessions()) {
              log("⚠️ Found incomplete sessions. Syncing to complete...");
      Toast.warn(MESSAGES.TOAST.INCOMPLETE_SESSIONS, 4000);
    }
  })();

})(); 