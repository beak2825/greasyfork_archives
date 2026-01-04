// ==UserScript==
// @name         Weibo Following Exporter (微博关注导出)
// @namespace    weibo-following-exporter
// @author       Roy
// @version      1.2.4
// @description  Harvest following cards, export HTML with optional embedded avatar base64 or no avatar, live search
// @match        https://weibo.com/u/page/follow/*
// @match        https://www.weibo.com/u/page/follow/*
// @icon         https://weibo.com/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      sinaimg.cn
// @connect      *.sinaimg.cn
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546705/Weibo%20Following%20Exporter%20%28%E5%BE%AE%E5%8D%9A%E5%85%B3%E6%B3%A8%E5%AF%BC%E5%87%BA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546705/Weibo%20Following%20Exporter%20%28%E5%BE%AE%E5%8D%9A%E5%85%B3%E6%B3%A8%E5%AF%BC%E5%87%BA%29.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// ========= CONFIG =========
	const TARGET_SELECTOR = "a.ALink_none_1w6rm.UserFeedCard_left_2XXOA";
	const SCROLL_STEP_RATIO = 0.9;
	const TICK_MS = 400;
	const STALL_TICKS_TO_STOP = 6;
	const MAX_TICKS = 600;
	const MAX_CONCURRENCY = 6;

	// ========= UTILS =========
	const esc = (s = "") =>
		s.replace(
			/[&<>"]/g,
			(c) =>
				({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
		);
	const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
	const fmtDate = () => new Date().toISOString().slice(0, 10);
	const guessMimeFromUrl = (url) => {
		const u = (url || "").split("?")[0].toLowerCase();
		if (u.endsWith(".jpg") || u.endsWith(".jpeg")) return "image/jpeg";
		if (u.endsWith(".png")) return "image/png";
		if (u.endsWith(".webp")) return "image/webp";
		if (u.endsWith(".gif")) return "image/gif";
		return "application/octet-stream";
	};
	const arrayBufferToBase64 = (buffer) => {
		let binary = "";
		const bytes = new Uint8Array(buffer);
		for (let i = 0; i < bytes.byteLength; i++)
			binary += String.fromCharCode(bytes[i]);
		return btoa(binary);
	};

	function fetchAsBase64(url) {
		if (!url) return Promise.resolve({ dataUrl: "", mime: "", ok: false });
		return new Promise((resolve) => {
			GM_xmlhttpRequest({
				method: "GET",
				url,
				headers: {
					Referer: "https://weibo.com/",
					"User-Agent": "Mozilla/5.0",
				},
				responseType: "arraybuffer",
				onload: (res) => {
					try {
						const buf = res.response;
						const ctHeader = (res.responseHeaders || "")
							.split(/\r?\n/)
							.find((h) => /^content-type:/i.test(h));
						const mime = ctHeader
							? ctHeader.split(":")[1].trim()
							: guessMimeFromUrl(url);
						const b64 = arrayBufferToBase64(buf);
						resolve({
							dataUrl: `data:${mime};base64,${b64}`,
							mime,
							ok: true,
						});
					} catch {
						resolve({ dataUrl: "", mime: "", ok: false });
					}
				},
				onerror: () => resolve({ dataUrl: "", mime: "", ok: false }),
				ontimeout: () => resolve({ dataUrl: "", mime: "", ok: false }),
			});
		});
	}

	function concurrencyPool(tasks, limit) {
		const results = new Array(tasks.length);
		let i = 0,
			active = 0;
		return new Promise((resolve) => {
			function next() {
				if (i >= tasks.length && active === 0) return resolve(results);
				while (active < limit && i < tasks.length) {
					const cur = i++;
					active++;
					tasks[cur]()
						.then((r) => {
							results[cur] = r;
						})
						.catch(() => {
							results[cur] = null;
						})
						.finally(() => {
							active--;
							next();
						});
				}
			}
			next();
		});
	}

	// ========= HUD =========
	GM_addStyle(`
    .wfe-hud {
      position: fixed; right: 10px; bottom: 10px; z-index: 999999;
      background: rgba(0,0,0,.74); color: #fff; font: 12px/1.4 ui-sans-serif, system-ui;
      padding: 6px 8px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,.4);
      display: flex; gap: 8px; align-items: center;
    }
    .wfe-btn {
    cursor: pointer; background: #3b82f6; border: none; color: #fff;
    padding: 0 10px; border-radius: 6px; font-weight: 700;
    font-size: 12px; line-height: 1;
    min-width: 0;
    height: 26px;
    }
    .wfe-btn.alt { background: #10b981; }
    .wfe-btn[disabled] { opacity: .6; cursor: not-allowed; }
    .wfe-btn:hover:not([disabled]) { filter: brightness(.95); }
    .wfe-status { flex: 1 1 auto; min-width: 0; opacity: .9; white-space: normal; word-break: break-word; }
    .wfe-input {
    width: 96px; height: 26px; border-radius: 6px; border: 1px solid #9ca3af;
    padding: 0 8px; font-size: 12px; background: #111827; color: #fff;
    }
    .wfe-label { font-size: 12px; opacity: .9; }
  `);
	const hud = document.createElement("div");
	hud.className = "wfe-hud";
	const statusSpan = document.createElement("span");
	statusSpan.className = "wfe-status";
	const label = document.createElement("span");
	label.className = "wfe-label";
	label.textContent = "Limit:";
	const limitInput = document.createElement("input");
	limitInput.className = "wfe-input";
	limitInput.type = "number";
	limitInput.min = "1";
	limitInput.placeholder = "unlimited";
	const btnWithout = document.createElement("button"); // left
	btnWithout.className = "wfe-btn";
	btnWithout.textContent = "Export (no avatars)";
	const btnWith = document.createElement("button"); // right
	btnWith.className = "wfe-btn alt";
	btnWith.textContent = "Export (with avatars)";
	hud.append(statusSpan, label, limitInput, btnWithout, btnWith);
	document.body.appendChild(hud);
	const setHUD = (msg) => {
		statusSpan.textContent = msg;
	};

	let running = false;
	function setProcessing(isProcessing, mode) {
		running = isProcessing;
		btnWithout.disabled = isProcessing;
		btnWith.disabled = isProcessing;

		if (isProcessing) {
			if (mode === "with") {
				btnWith.textContent = "Processing…";
				btnWithout.textContent = "Export (no avatars)";
			} else {
				btnWithout.textContent = "Processing…";
				btnWith.textContent = "Export (with avatars)";
			}
		} else {
			btnWithout.textContent = "Export (no avatars)";
			btnWith.textContent = "Export (with avatars)";
		}
	}

	// ========= HARVEST =========
	const seen = new Map(); // key = userLink

	function harvestOnce(limit) {
		let reached = false;
		const nodes = document.querySelectorAll(TARGET_SELECTOR);
		for (const el of nodes) {
			if (limit && seen.size >= limit) {
				reached = true;
				break;
			}

			const href = el.getAttribute("href") || "";
			const userId = href.startsWith("/u/")
				? href.slice(3)
				: href.replace(/^\//, "");
			const userLink =
				"https://weibo.com/" +
				(href.startsWith("/u/") ? "u/" + userId : userId);

			if (seen.has(userLink)) continue;

			const displayName =
				el.querySelector("span[usercard]")?.innerText.trim() || "";
			const avatar =
				el.querySelector("img.woo-avatar-img")?.getAttribute("src") ||
				"";
			const descs = [...el.querySelectorAll(".UserFeedCard_clb_3cXsW")]
				.map((d) => d.innerText.trim())
				.filter(Boolean);

			seen.set(userLink, {
				userLink,
				displayName,
				avatarUrl: avatar,
				avatarDataUrl: "", // used in "with avatars" mode
				des1: descs[0] || "",
				des2: descs[1] || "",
			});

			if (limit && seen.size >= limit) {
				reached = true;
				break;
			}
		}
		return reached;
	}

	async function autoScrollAndHarvest(limit) {
		let ticks = 0,
			stall = 0,
			lastCount = 0;
		setHUD(`Scanning…${limit ? ` (limit ${limit})` : ""}`);
		while (ticks < MAX_TICKS) {
			ticks++;
			const hitLimit = harvestOnce(limit);

			const count = seen.size;
			if (count > lastCount) {
				stall = 0;
				lastCount = count;
			} else {
				stall++;
			}

			setHUD(
				`Collected: ${count}${
					limit ? `/` + limit : ""
				} | tick: ${ticks} | no increase: ${stall}/${STALL_TICKS_TO_STOP}`
			);

			if (hitLimit) break;

			const scroller =
				document.scrollingElement ||
				document.documentElement ||
				document.body;
			const atBottom =
				Math.ceil(scroller.scrollTop + window.innerHeight + 2) >=
				scroller.scrollHeight;
			if (stall >= STALL_TICKS_TO_STOP && atBottom) break;

			scroller.scrollTop = Math.min(
				scroller.scrollTop +
					Math.floor(window.innerHeight * SCROLL_STEP_RATIO),
				scroller.scrollHeight
			);
			await sleep(TICK_MS);
		}
		setHUD(
			`Scan done. Total: ${seen.size}${limit ? ` (limit ${limit})` : ""}.`
		);
	}

	async function processAvatarsBase64(items) {
		setHUD("Fetching avatars (base64)...");
		const tasks = items.map((it, idx) => async () => {
			setHUD(`Fetching avatar ${idx + 1}/${items.length}`);
			if (!it.avatarUrl) return it;
			const res = await fetchAsBase64(it.avatarUrl);
			if (res.ok) it.avatarDataUrl = res.dataUrl;
			return it;
		});
		await concurrencyPool(tasks, MAX_CONCURRENCY);
	}

	// ========= EXPORT RENDER =========
	function renderHTML(items, withAvatars) {
		const now = fmtDate();

		const cardsHTML = items
			.map((it) => {
				const searchable = [
					it.displayName,
					it.des1,
					it.des2,
					it.userLink,
				]
					.filter(Boolean)
					.join(" ")
					.toLowerCase();

				const avatarBlock =
					withAvatars && it.avatarDataUrl
						? `
          <a href="${esc(
				it.avatarUrl
			)}" target="_blank" rel="noopener noreferrer" title="Open avatar">
            <img class="avatar" src="${esc(it.avatarDataUrl)}" alt="${esc(
								it.displayName
						  )}" loading="lazy">
          </a>
        `
						: `<!-- no avatar image -->`;

				const avatarUrlLine = withAvatars
					? ""
					: `<div class="link">Avatar: <a href="${esc(
							it.avatarUrl
					  )}" target="_blank" rel="noopener noreferrer">${esc(
							it.avatarUrl
					  )}</a></div>`;

				return `
      <div class="card" data-text="${esc(searchable)}">
        <div class="row">
          ${avatarBlock}
          <div class="meta">
            <a class="name" href="${
				it.userLink
			}" target="_blank" rel="noopener noreferrer"><strong>${esc(
					it.displayName
				)}</strong></a>
            <div class="link">${esc(it.userLink)}</div>
            ${avatarUrlLine}
          </div>
        </div>
        ${it.des1 ? `<p class="desc">${esc(it.des1)}</p>` : ""}
        ${it.des2 ? `<p class="desc">${esc(it.des2)}</p>` : ""}
      </div>`;
			})
			.join("\n");

		const inlineScript = `
      <script>
        (function(){
          const input = document.getElementById('wfe-search');
          const countEl = document.getElementById('wfe-count');
          const cards = Array.from(document.querySelectorAll('.card'));
          function update(){
            const q = (input.value || '').toLowerCase();
            let visible = 0;
            for (const el of cards){
              const txt = el.getAttribute('data-text') || '';
              const ok = !q || txt.includes(q);
              el.style.display = ok ? '' : 'none';
              if (ok) visible++;
            }
            countEl.textContent = visible.toString();
          }
          input.addEventListener('input', update);
          update();

          const THEME_KEY = 'wfe-theme';
          const btn = document.getElementById('wfe-theme-toggle');
          const root = document.documentElement;
          function applyTheme(t){ root.setAttribute('data-theme', t); btn.textContent = (t==='dark' ? 'Light mode' : 'Dark mode'); }
          const saved = localStorage.getItem(THEME_KEY) || 'light';
          applyTheme(saved);
          btn.addEventListener('click', function(){
            const cur = root.getAttribute('data-theme') || 'light';
            const next = cur === 'dark' ? 'light' : 'dark';
            localStorage.setItem(THEME_KEY, next);
            applyTheme(next);
          });
        })();
      </script>
    `;

		return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Weibo Following Exporter (${items.length})</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root {
    --radius: 14px; --border:#e5e7eb; --text:#111827; --ntext:#134f5c; --muted:#6b7280; --bg:#fafafa;
    --card-bg:#fff; --shadow: 0 1px 2px rgba(0,0,0,.04); --maxw: 900px; --headerH: 68px;
  }
  [data-theme="dark"] {
    --border:#374151; --text:#e5e7eb; --ntext:#26a69a; --muted:#9ca3af; --bg:#0f172a;
    --card-bg:#111827; --shadow: 0 1px 2px rgba(0,0,0,.4);
  }
  * { box-sizing: border-box; }
  body { font-family: ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans","Apple Color Emoji","Segoe UI Emoji"; margin: 0; color: var(--text); background: var(--bg); }
  .header {
    position: fixed; top: 0; left: 0; right: 0; height: var(--headerH);
    background: color-mix(in srgb, var(--bg) 85%, transparent); backdrop-filter: blur(6px);
    border-bottom: 1px solid var(--border); z-index: 10;
  }
  .header-inner {
    max-width: var(--maxw); height: 100%; margin: 0 auto; display: flex; align-items: center; gap: 12px; padding: 10px 16px;
  }
  .title { font-size: 16px; font-weight: 800; }
  .search { margin-left: auto; display: flex; align-items: center; gap: 8px; }
  .search label { color: var(--muted); font-size: 12px; }
  .search input {
    height: 36px; width: min(360px, 60vw); border: 1px solid var(--border); border-radius: 10px; padding: 0 10px; background: var(--card-bg); color: var(--text); font-size: 14px;
  }

  .container { max-width: var(--maxw); margin: 0 auto; padding: calc(var(--headerH) + 16px) 14px 24px; }
  .card { background: var(--card-bg); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; box-shadow: var(--shadow); margin-bottom: 14px; }
  .row { display: flex; gap: 12px; align-items: center; margin-bottom: 8px; }
  .avatar { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 1px solid var(--border); flex: 0 0 auto; }
  .meta { min-width: 0; }
  .name { color: var(--ntext); text-decoration: none; font-size: 16px; }
  .name:hover { text-decoration: underline; }
  .link { color: var(--muted); font-size: 12px; word-break: break-all; }
  .desc { margin: 6px 0 0; line-height: 1.5; color: var(--text); }
  .footer { margin-top: 18px; color: var(--muted); font-size: 12px; text-align: right; }

  .theme-toggle {
    position: fixed; right: 14px; bottom: 14px; z-index: 20;
    background: var(--card-bg); color: var(--text); border: 1px solid var(--border); border-radius: 10px;
    padding: 8px 10px; cursor: pointer; box-shadow: var(--shadow);
  }
</style>
</head>
<body>
  <div class="header">
    <div class="header-inner">
      <div class="title">Weibo Following Exporter (<span id="wfe-count">${
			items.length
		}</span>)</div>
      <div class="search">
        <label for="wfe-search">Search</label>
        <input id="wfe-search" type="search" placeholder="Type to filter…">
      </div>
    </div>
  </div>

  <div class="container">
    ${cardsHTML || "<p>No entries collected.</p>"}
    <div class="footer">Generated on ${now} — Mode: ${
			withAvatars
				? "with avatars (base64 embedded)"
				: "no avatars (URL only)"
		}</div>
  </div>

  <button id="wfe-theme-toggle" class="theme-toggle" type="button">Dark mode</button>
  ${inlineScript}
</body>
</html>`;
	}

	function downloadHtml(html, count, withAvatars, limitedFrom) {
		const now = fmtDate();
		const suffix = withAvatars ? "with_avatars" : "no_avatars";
		const note = limitedFrom ? `_limit${limitedFrom}` : "_all";
		const blob = new Blob([html], { type: "text/html;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = Object.assign(document.createElement("a"), {
			href: url,
			download: `weibo_following_list_${suffix}${note}_${count}_${now}.html`,
		});
		document.body.appendChild(a);
		a.click();
		a.remove();
		URL.revokeObjectURL(url);
	}

	async function runExport(withAvatars) {
		if (running) return;
		try {
			setProcessing(true, withAvatars ? "with" : "without");
			seen.clear();

			const raw = (limitInput.value || "").trim();
			const limit = raw ? Math.max(1, parseInt(raw, 10)) : null;

			await autoScrollAndHarvest(limit);
			const items = [...seen.values()]; // already limited by harvest

			if (withAvatars) {
				await processAvatarsBase64(items);
			} else {
				setHUD("No-avatar mode (avatar URLs only)...");
			}

			setHUD("Building HTML…");
			const html = renderHTML(items, withAvatars);
			downloadHtml(html, items.length, withAvatars, limit || 0);
			setHUD(
				`Done. Exported ${items.length}${
					limit ? ` (limit ${limit})` : ""
				}.`
			);
		} catch (e) {
			console.error(e);
			setHUD("Error occurred. Check console.");
		} finally {
			setProcessing(false);
		}
	}

	// Buttons
	btnWith.onclick = () => runExport(true);
	btnWithout.onclick = () => runExport(false);
	setHUD(
		"Ready. Scroll a bit, set Limit if needed, then choose an export mode."
	);
})();
