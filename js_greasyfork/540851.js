// ==UserScript==
// @name         Etheranel Executor v4.4.5
// @namespace    scratch.mit.edu/
// @version      4.4.5
// @description  Full toolset + working logout nuker with session destruction and DOM bypass (Fixed Bugs!)
// @author       EtherealRealm
// @match        *://scratch.mit.edu/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540851/Etheranel%20Executor%20v445.user.js
// @updateURL https://update.greasyfork.org/scripts/540851/Etheranel%20Executor%20v445.meta.js
// ==/UserScript==

(function () {
    const PANEL_ID = 'ethereal-executor';
    const mainColor = '#a64eff';
    let drawingActive = false, isEraser = false;
    let drawColor = '#ff0000', drawSize = 3;
    let audio = null, canvas = null, ctx = null;
    let destroyerActive = false;
    let emailList = [];

    function fillReactInput(selector, value) {
        const el = document.querySelector(selector);
        if (!el) return;
        const setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(el), 'value')?.set;
        setter ? setter.call(el, value) : el.value = value;
        el.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function createRandomUsername() {
        const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        return "user" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    function generatePassword() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    }

    function getCSRFToken() {
        const match = document.cookie.match(/scratchcsrftoken=([^;]+)/);
        return match ? match[1] : '';
    }

    async function nukeAccount() {
        if (!confirm("\u2620\ufe0f This will delete your account and wipe all data. Proceed?")) return;

        try {
            const logoutBtn = document.querySelector('button[data-control="logout"]');
            if (logoutBtn) logoutBtn.click();

            const headers = {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest",
                "X-CSRFToken": getCSRFToken()
            };

            const deleteReq = fetch("/accounts/delete/", {
                method: "POST",
                headers,
                credentials: "include",
                body: JSON.stringify({ password: "delete" })
            });

            const logoutReq = fetch("/accounts/logout/", {
                method: "POST",
                headers,
                credentials: "include"
            });

            await Promise.all([deleteReq, logoutReq]);

            localStorage.clear();
            sessionStorage.clear();
            indexedDB.databases?.().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name)));
            document.cookie.split(";").forEach(c => {
                document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });

            if (navigator.credentials) {
                try { await navigator.credentials.preventSilentAccess(); } catch {}
            }

            alert("\u2620\ufe0f Nuked. Redirecting to home.");
            location.href = "/";
        } catch (err) {
            alert("\u274c Nuker failed: " + err.message);
        }
    }

    function createPanel() {
        if (document.getElementById(PANEL_ID)) return;
        const panel = document.createElement('div');
        panel.id = PANEL_ID;
        panel.style = `
            position:fixed;top:120px;left:100px;width:340px;
            background:#111;color:#fff;padding:15px;z-index:99999999;
            border:2px solid ${mainColor};border-radius:10px;
            font-family:Arial;box-shadow:0 0 10px ${mainColor};
        `;

        const username = createRandomUsername();

        panel.innerHTML = `
        <div style="font-size:18px;font-weight:bold;margin-bottom:10px;color:${mainColor};">⚡ Etheranel Executor v4.4.5</div>

        <details><summary>🖼️ Image Replacer</summary>
            <input id="img-url" placeholder="Image URL" style="width:100%;margin:5px 0;padding:5px;background:#222;color:#fff;border:none;" />
            <button id="replace-images" style="width:100%;padding:6px;">Replace Images</button>
        </details><hr>

        <details><summary>🎵 Music Player</summary>
            <input id="music-url" placeholder="MP3 URL" style="width:100%;margin:5px 0;padding:5px;background:#222;color:#fff;border:none;" />
            <button id="play-music" style="width:100%;padding:6px;">▶️ Play</button>
            <button id="stop-music" style="width:100%;padding:6px;margin-top:6px;background:#f33;color:#fff;">⏹ Stop</button>
        </details><hr>

        <details><summary>🧠 Text Rewriter</summary>
            <input id="text-find" placeholder="Find" style="width:100%;margin:5px 0;padding:5px;background:#222;color:#fff;border:none;" />
            <input id="text-replace" placeholder="Replace" style="width:100%;margin:5px 0;padding:5px;background:#222;color:#fff;border:none;" />
            <button id="rewrite-text" style="width:100%;padding:6px;">Rewrite</button>
        </details><hr>

        <details><summary>✏️ Draw Mode</summary>
            <input type="color" id="color-picker" value="${drawColor}" style="width:100%;" />
            <input type="range" id="size-picker" min="1" max="20" value="${drawSize}" style="width:100%;" />
            <button id="toggle-draw" style="width:100%;padding:6px;">Toggle Draw</button>
            <button id="eraser-tool" style="width:100%;padding:6px;">Toggle Eraser</button>
            <button id="clear-canvas" style="width:100%;padding:6px;">Clear Canvas</button>
        </details><hr>

        <details><summary>💥 Element Destroyer</summary>
            <button id="toggle-destroyer" style="width:100%;padding:6px;">💥 Toggle Destroyer</button>
        </details><hr>

        <details open><summary>🧬 Auto Account Generator</summary>
            <label>Username:</label>
            <input id="username-input" value="${username}" style="width:100%;margin:5px 0;padding:5px;background:#222;color:#fff;border:none;" />
            <label>Email List (one per line):</label>
            <textarea id="email-list" style="width:100%;height:80px;background:#222;color:#fff;border:none;"></textarea>
            <button id="fill-form" style="margin-top:6px;width:100%;padding:6px;background:#4f4;">⚙️ Fill Account Form</button>
        </details><hr>

        <details><summary>☠️ Account Nuker</summary>
            <button id="nuke-account" style="width:100%;padding:6px;background:#900;color:#fff;">☠️ Nuke This Account</button>
        </details>
        `;

        document.body.appendChild(panel);

        // Restore broken tools
        const $ = sel => panel.querySelector(sel);
        $('#replace-images').onclick = () => {
            const url = $('#img-url').value;
            if (!url) return alert('Enter a valid URL');
            document.querySelectorAll('img').forEach(img => img.src = url);
        };

        $('#play-music').onclick = () => {
            const url = $('#music-url').value;
            if (!url) return;
            if (audio) audio.pause();
            audio = new Audio(url);
            audio.loop = true;
            audio.play();
        };

        $('#stop-music').onclick = () => audio?.pause();

        $('#rewrite-text').onclick = () => {
            const find = $('#text-find').value;
            const rep = $('#text-replace').value;
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
            while (walker.nextNode()) walker.currentNode.nodeValue = walker.currentNode.nodeValue.replaceAll(find, rep);
        };

        $('#color-picker').oninput = e => drawColor = e.target.value;
        $('#size-picker').oninput = e => drawSize = +e.target.value;

        $('#toggle-draw').onclick = () => {
            drawingActive = !drawingActive;
            drawingActive ? enableDrawing() : disableDrawing();
        };

        $('#clear-canvas').onclick = () => ctx?.clearRect(0, 0, canvas.width, canvas.height);

        $('#eraser-tool').onclick = () => {
            isEraser = !isEraser;
            alert(isEraser ? '🧽 Eraser on' : '✏️ Brush on');
        };

        $('#toggle-destroyer').onclick = () => {
            destroyerActive = !destroyerActive;
            alert(destroyerActive ? '💥 Destroyer active' : 'Destroyer off');
        };

        document.addEventListener('click', e => {
            if (destroyerActive && !panel.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                e.target.remove();
            }
        }, true);

        $('#fill-form').onclick = () => {
            emailList = $('#email-list').value.split('\n').map(e => e.trim()).filter(e => e.includes('@'));
            if (!emailList.length) return alert('Provide at least one valid email');

            const uname = $('#username-input').value.trim() || createRandomUsername();
            const pwd = generatePassword();

            fillReactInput('#username', uname);
            fillReactInput('#password', pwd);
            fillReactInput('#passwordConfirm', pwd);

            const obs = new MutationObserver(() => {
                const emailInput = document.querySelector('#email');
                if (emailInput && emailInput.offsetParent !== null) {
                    const email = emailList[Math.floor(Math.random() * emailList.length)];
                    fillReactInput('#email', email);
                    obs.disconnect();
                }
            });
            obs.observe(document.body, { childList: true, subtree: true });

            alert(`✅ Step 1 filled.\nUsername: ${uname}\nPassword: ${pwd}`);
        };

        $('#nuke-account').onclick = nukeAccount;
    }

    function enableDrawing() {
        if (document.getElementById('draw-canvas')) return;
        canvas = document.createElement('canvas');
        canvas.id = 'draw-canvas';
        canvas.style = `position:fixed;top:0;left:0;z-index:99999998;pointer-events:auto;`;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        ctx.lineJoin = 'round';

        let drawing = false;
        canvas.onmousedown = e => {
            drawing = true;
            ctx.beginPath();
            ctx.moveTo(e.clientX, e.clientY);
        };
        canvas.onmousemove = e => {
            if (!drawing) return;
            ctx.lineTo(e.clientX, e.clientY);
            ctx.strokeStyle = isEraser ? '#000' : drawColor;
            ctx.lineWidth = drawSize;
            ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
            ctx.stroke();
        };
        canvas.onmouseup = () => drawing = false;
        canvas.onmouseleave = () => drawing = false;
    }

    function disableDrawing() {
        if (canvas) canvas.remove();
        canvas = null;
        ctx = null;
    }

    setTimeout(() => {
        if (document.readyState === 'complete') createPanel();
        else window.addEventListener('load', createPanel);
    }, 500);
})();
