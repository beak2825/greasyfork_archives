// ==UserScript==
// @name         StumbleBot
// @namespace    StumbleBot
// @version      1.1.2
// @description  Play YouTube videos from the chat box and/or add custom commands to StumbleChat
// @author       Goji
// @match        https://stumblechat.com/room/*
// @downloadURL https://update.greasyfork.org/scripts/526343/StumbleBot.user.js
// @updateURL https://update.greasyfork.org/scripts/526343/StumbleBot.meta.js
// ==/UserScript==

/* =============================================================================
 🤖  OVERVIEW
 -----------------------------------------------------------------------------
 - Global 1s queue for bot messages (`this._send(...)` is queued automatically)
 - Persistent identity: userHandles (handle→username), userNicknames (nick cache)
 - Roles: from join `mod` codes + runtime "role" events; hasMinimumRole helper
 - YT: operator-only .yt/.play/.video/.youtube (<id|url|search>), URL normalize
 - History: `.history [page]` paginated list of added YouTube tracks
 - Utilities: `.self` (show your info), `.whois <user|nick|handle>`
 - `.commands` alias `.help`
============================================================================= */


/* =============================================================================
   🧠 GLOBAL 1000ms MESSAGE QUEUE (affects bot sends only)
============================================================================= */
const SEND_COOLDOWN_MS = 1000;
const _socketState = new WeakMap(); // WebSocket -> { queue, busy, lastSentAt }

function getState(ws) {
  let s = _socketState.get(ws);
  if (!s) {
    s = { queue: [], busy: false, lastSentAt: 0 };
    _socketState.set(ws, s);
  }
  return s;
}

function enqueueSend(ws, payload) {
  const state = getState(ws);
  state.queue.push(payload);
  if (!state.busy) processQueue(ws);
}

function processQueue(ws) {
  const state = getState(ws);
  if (state.busy) return;
  const next = state.queue.shift();
  if (!next) return;

  const now = Date.now();
  const wait = Math.max(0, state.lastSentAt + SEND_COOLDOWN_MS - now);
  state.busy = true;

  setTimeout(() => {
    try {
      const raw = (typeof next === "string") ? next : JSON.stringify(next);
      const native = ws.__nativeSend || WebSocket.prototype.send;
      native.call(ws, raw);
    } catch (e) {
      console.error("Queue send failed:", e, next);
    } finally {
      state.lastSentAt = Date.now();
      state.busy = false;
      if (state.queue.length) processQueue(ws);
    }
  }, wait);
}

// Optional helper for timers/elsewhere
window.stumbleBotSend = function (textOrPayload) {
  const ws = window._ssbSocket;
  if (!ws) return;
  ws._send(textOrPayload);
};


/* =============================================================================
   🌿 HOURLY 4:20 DEMO (optional)
============================================================================= */
let lastSentHour = -1;
let shouldSendMessage = false;
setInterval(() => {
  const now = new Date();
  if (now.getMinutes() === 20 && now.getSeconds() === 0 && lastSentHour !== now.getHours() && !shouldSendMessage) {
    lastSentHour = now.getHours();
    shouldSendMessage = true;
  }
}, 1000);


/* =============================================================================
   🧾 IDENTITY & ROLE TRACKING (persistent)
   - userHandles:   handle -> username
   - userNicknames: username OR handle -> { handle, username, nickname, role, modStatus, hasJoinedBefore? }
   - hasMinimumRole(username, minRole) using simple ladder
   - role from join: numeric mod (0..4) → role string
   - role updates: stumble="role" {handle, type: "owner|moderator|operator|super|revoke"}
============================================================================= */

let userHandles   = JSON.parse(localStorage.getItem("userHandles")   || "{}"); // handle -> username
let userNicknames = JSON.parse(localStorage.getItem("userNicknames") || "{}"); // username/handle -> record

function saveIdentity() {
  localStorage.setItem("userHandles", JSON.stringify(userHandles));
  localStorage.setItem("userNicknames", JSON.stringify(userNicknames));
}

// role mapping and ladder
const ROLE_ORDER = ["none", "guest", "regular", "operator", "moderator", "super", "owner"];
const MOD_NUM_TO_ROLE = (n) =>
  n >= 4 ? "owner" :
  n === 3 ? "super" :
  n === 2 ? "moderator" :
  n === 1 ? "operator" : "none";

function roleRank(role) {
  const idx = ROLE_ORDER.indexOf((role || "none").toLowerCase());
  return idx >= 0 ? idx : 0;
}

function hasMinimumRole(username, minimumRole) {
  const rec = userNicknames[username];
  const current = rec?.role || "none";
  return roleRank(current) >= roleRank(minimumRole);
}

function setRole(username, newRole) {
  if (!username) return;
  const rec = (userNicknames[username] ||= { username, nickname: username });
  if (roleRank(newRole) >= roleRank(rec.role || "none")) {
    rec.role = newRole;
  }
  saveIdentity();
}

function updateOnJoin(wsmsg) {
  const username = wsmsg.username;
  const handle   = wsmsg.handle;
  let nickname   = wsmsg.nick;
  if (!username || !handle) return;

  if (/^guest-\d+$/i.test(nickname)) nickname = username;

  const rec = {
    handle,
    username,
    nickname: nickname || username,
    modStatus: wsmsg.mod ? "Moderator" : "Regular",
    role: MOD_NUM_TO_ROLE(Number(wsmsg.mod || 0)),
    hasJoinedBefore: (userNicknames[username]?.hasJoinedBefore || false)
  };
  userNicknames[username] = { ...(userNicknames[username] || {}), ...rec };
  userNicknames[handle]   = { ...(userNicknames[handle]   || {}), ...rec };
  userHandles[handle]     = username;

  saveIdentity();
}

function updateNickname(wsmsg) {
  const handle = wsmsg.handle;
  let nick = wsmsg.nick;
  if (!handle || !nick) return;
  const username = userHandles[handle];
  if (!username) return;

  if (/^guest-\d+$/i.test(nick)) nick = username;

  if (userNicknames[username]) userNicknames[username].nickname = nick;
  if (userNicknames[handle])   userNicknames[handle].nickname   = nick;
  saveIdentity();
}

function cleanupOnQuit(wsmsg) {
  const handle = wsmsg.handle;
  if (!handle) return;
  delete userHandles[handle];
  saveIdentity(); // keep nick/roles
}


/* =============================================================================
   🎥 YOUTUBE HELPERS & STORAGE
============================================================================= */

// Keywords
const youtubeKeywords = ['.youtube', '.video', '.play', '.yt'];

// Persisted YT history
let youtubeHistory = JSON.parse(localStorage.getItem("youtubeHistory") || "[]");
function saveYT() { localStorage.setItem("youtubeHistory", JSON.stringify(youtubeHistory)); }

// Normalize many YouTube URL forms to watch?v=
function convertToRegularYouTubeLink(url) {
  const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([\w-]+)/i;
  const match = String(url || "").trim().match(videoIdRegex);
  return (match && match[1]) ? ("https://www.youtube.com/watch?v=" + match[1]) : null;
}

function saveToHistory(requester, trackName) {
  if (!trackName) return;
  youtubeHistory.push({ requester: requester || null, track: trackName });
  saveYT();
}


/* =============================================================================
   🤖 MAIN BOT: HOOK SOCKET & HANDLE MESSAGES
============================================================================= */
(function () {
  // Capture native sender, override once
  const nativeSend = WebSocket.prototype.send;
  WebSocket.prototype.send = function (data) {
    if (!this.__ssbHooked) {
      this.__ssbHooked = true;
      this.__nativeSend = nativeSend;

      // Backward-compatible: any existing this._send(...) now goes through queue
      this._send = (payload) => enqueueSend(this, payload);

      // Expose current socket to helpers
      window._ssbSocket = this;

      // Bind handler
      this.addEventListener("message", handleMessage.bind(this), false);
    }
    // Keep site traffic unthrottled
    return this.__nativeSend.call(this, data);
  };

  function handleMessage(evt) {
    const wsmsg = safeJSONParse(evt?.data);
    if (!wsmsg) return;

    /* -- Identity & roles -- */
    if (wsmsg.stumble === "join" && wsmsg.username && wsmsg.handle) {
      const firstJoin = !userNicknames[wsmsg.username]?.hasJoinedBefore;
      updateOnJoin(wsmsg);

      const display = userNicknames[wsmsg.username]?.nickname || wsmsg.username;
      if (firstJoin) {
        userNicknames[wsmsg.username].hasJoinedBefore = true;
        saveIdentity();
        respondWithMessage.call(this, `Welcome, ${display}! 🌟`);
      } else {
        respondWithMessage.call(this, `Welcome back, ${display}! 🎉`);
      }
    }

    if (wsmsg.stumble === "nick") {
      updateNickname(wsmsg);
    }

    if (wsmsg.stumble === "quit") {
      cleanupOnQuit(wsmsg);
    }

    // Role updates from server
    if (wsmsg.stumble === "role" && wsmsg.handle) {
      const username = userHandles[wsmsg.handle];
      if (username) {
        const newRole = (wsmsg.type === "revoke") ? "none" : (wsmsg.type || "none");
        setRole(username, newRole);
        if (userNicknames[wsmsg.handle]) {
          userNicknames[wsmsg.handle].role = newRole;
          saveIdentity();
        }
      }
    }

    // Capture bot self (if server sends a `self` payload)
    if (wsmsg.self && wsmsg.self.username && wsmsg.self.handle) {
      const s = wsmsg.self;
      updateOnJoin({ stumble:"join", username:s.username, handle:s.handle, nick:s.nick, mod:s.mod });
      setRole(s.username, MOD_NUM_TO_ROLE(Number(s.mod || 0)));
    }

    /* -- Hourly 4:20 demo -- */
    if (shouldSendMessage) {
      shouldSendMessage = false;
      setTimeout(() => {
        this._send({ stumble: "msg", text: "🌲 It's 4:20 somewhere! Smoke em if you got em! 💨" });
      }, 1000);
    }

    /* =====================================================================
       🎬 YOUTUBE COMMAND (operator+)
       Accepts: .yt/.play/.video/.youtube <id|url|search terms>
    ===================================================================== */
    if (wsmsg && typeof wsmsg.text === "string") {
      const rawText = wsmsg.text;
      const textLower = rawText.toLowerCase();

      // Match keyword prefix
      let matchedKeyword = null;
      for (const kw of youtubeKeywords) {
        if (textLower.startsWith(kw)) { matchedKeyword = kw; break; }
      }

      if (matchedKeyword) {
        const handle = wsmsg.handle;
        // Resolve username
        let username = null;
        if (handle && userHandles[handle]) username = userHandles[handle];
        else if (handle && userNicknames[handle]?.username) username = userNicknames[handle].username;

        const canUse = username ? hasMinimumRole(username, "operator") : false;
        if (!canUse) {
          respondWithMessage.call(this, "🚫 You need Operator or higher to play YouTube videos.");
        } else {
          const firstSpace = rawText.indexOf(" ");
          const query = (firstSpace >= 0) ? rawText.slice(firstSpace + 1).trim() : "";
          if (query && query.toLowerCase() !== matchedKeyword) {
            const finalLink = convertToRegularYouTubeLink(query) || query;
            this._send({ stumble: "youtube", type: "add", id: finalLink, time: 0 });
          }
        }
      }
    }

    // Log YT adds from system message
    if (wsmsg.stumble === "sysmsg" && typeof wsmsg.text === "string" && wsmsg.text.includes("has added YouTube track:")) {
      const lines = wsmsg.text.split("\n");
      const trackName = (lines[lines.length - 1] || "").trim();
      if (trackName) {
        let requester = null;
        const m = lines[0].match(/^(.*?) \((.*?)\) has added YouTube track:/);
        if (m) requester = m[2];
        saveToHistory(requester, trackName);
      }
    }

    /* =====================================================================
       📜 .history [page] — paginated YT history
    ===================================================================== */
    if (wsmsg.text && typeof wsmsg.text === "string" && wsmsg.text.toLowerCase().startsWith(".history")) {
      const args = wsmsg.text.trim().split(/\s+/);
      const page = parseInt(args[1], 10) || 1;
      const itemsPerPage = 5;

      const reversedHistory = [...youtubeHistory].reverse(); // newest first
      const totalPages = Math.max(1, Math.ceil(reversedHistory.length / itemsPerPage));

      if (reversedHistory.length === 0) {
        respondWithMessage.call(this, "🤖 No recent YouTube tracks played.");
      } else if (page < 1 || page > totalPages) {
        respondWithMessage.call(this, `⚠️ Invalid page. Use \`.history [1-${totalPages}]\`.`);
      } else {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const slice = reversedHistory.slice(start, end);

        let resp = `📺 YouTube History — Page ${page}/${totalPages}\n`;
        slice.forEach((entry, idx) => {
          const nick = entry.requester
            ? (userNicknames[entry.requester]?.nickname || entry.requester)
            : null;
          const n = start + idx + 1;
          resp += entry.requester
            ? `${n}. ${nick} played: ${entry.track}\n`
            : `${n}. ${entry.track}\n`;
        });

        respondWithMessage.call(this, resp.trim());
      }
    }

    /* =====================================================================
       🔎 .self / .whois  (NO ECONOMY)
    ===================================================================== */
    if (wsmsg.text && typeof wsmsg.text === "string") {
      const lower = wsmsg.text.toLowerCase();

      // .self — show your info
      if (lower === ".self") {
        const handle = wsmsg.handle;
        const username = userHandles[handle];
        const user = username ? userNicknames[username] : null;

        if (user) {
          const role = (user.role || "none").toLowerCase();
          const roleLabels = {
            owner: "👑 Owner",
            super: "⭐ Super",
            moderator: "🛡️ Moderator",
            operator: "🔧 Operator",
            none: "👤 Guest",
            guest: "👤 Guest",
            regular: "👤 Guest"
          };
          const roleLabel = roleLabels[role] || "👤 Guest";

          const msg = `🤖 Your Info:\nUsername: ${user.username}\nNickname: ${user.nickname}\nRole: ${roleLabel}\nHandle: ${user.handle}`;
          respondWithMessage.call(this, msg);
        } else {
          respondWithMessage.call(this, "🤖 Sorry, I couldn't find your information.");
        }
      }

      // .whois <name|nick|handle>
      if (lower.startsWith(".whois ")) {
        const args = wsmsg.text.split(/\s+/);
        const inputName = args[1];
        let matchedUsername = null;

        // 1) Exact username key
        if (userNicknames[inputName]?.username) {
          matchedUsername = inputName;
        }

        // 2) Try nickname case-insensitive
        if (!matchedUsername) {
          matchedUsername = Object.keys(userNicknames).find(u =>
            userNicknames[u]?.username && userNicknames[u]?.nickname?.toLowerCase() === inputName.toLowerCase()
          );
        }

        // 3) Try handle numeric exact
        if (!matchedUsername && /^\d+$/.test(inputName)) {
          const possible = Object.keys(userNicknames).find(u =>
            userNicknames[u]?.username && userNicknames[u]?.handle === inputName
          );
          if (possible) matchedUsername = possible;
        }

        if (!matchedUsername) {
          respondWithMessage.call(this, `🤖 User "${inputName}" not found.`);
        } else {
          const user = userNicknames[matchedUsername];
          const role = (user.role || "none").toLowerCase();
          const roleLabels = {
            owner: "👑 Owner",
            super: "⭐ Super",
            moderator: "🛡️ Moderator",
            operator: "🔧 Operator",
            none: "👤 Guest",
            guest: "👤 Guest",
            regular: "👤 Guest"
          };
          const roleLabel = roleLabels[role] || "👤 Guest";

          const msg = `🤖 Info on ${matchedUsername}:\nUsername: ${user.username}\nNickname: ${user.nickname}\nHandle: ${user.handle}\nRole: ${roleLabel}`;
          respondWithMessage.call(this, msg);
        }
      }
    }

    /* =====================================================================
       🧪 SIMPLE COMMAND EXAMPLES
    ===================================================================== */
    const text = wsmsg.text || "";

    // .me [message]
    if (text.startsWith(".me ")) {
      const handle = wsmsg.handle;
      const nickname =
        (handle && userNicknames[handle]?.nickname) ||
        (handle && userHandles[handle] && userNicknames[userHandles[handle]]?.nickname) ||
        "User";
      respondWithMessage.call(this, `${nickname} ${text.slice(4).trim()}`);
    }

    // .commands / .help
    if (text === ".commands" || text === ".help") {
      const lines = [
        "- .yt/.play/.video/.youtube <id|url|search> - Play a YouTube video (Operator+)",
        "- .history [page] - Show recent YouTube tracks",
        "- .self - Show your user info",
        "- .whois <user|nick|handle> - Look up a user",
        "- .me [message] - Send a message as yourself",
        "- .commands/.help - List all commands",
      ];
      lines.forEach((line, i) => setTimeout(() => respondWithMessage.call(this, line), i * 1000));
    }

    // ping -> PONG
    if (text === "ping") {
      setTimeout(() => respondWithMessage.call(this, "PONG"), 1000);
    }
  }

  // legacy-safe message helper: always goes through queued path
  function respondWithMessage(text) {
    this._send({ stumble: "msg", text });
  }

  // safe JSON parse
  function safeJSONParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }
})();
