// ==UserScript==
// @name         Roblox Friends/Followers/Following Bypass (Old/New Layout Support?)
// @namespace    http://tampermonkey.net/
// @version      3.6
// @description  Adds Friends/Followers/Following buttons back to UK users.
// @match        https://www.roblox.com/users/*/profile*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536144/Roblox%20FriendsFollowersFollowing%20Bypass%20%28OldNew%20Layout%20Support%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536144/Roblox%20FriendsFollowersFollowing%20Bypass%20%28OldNew%20Layout%20Support%29.meta.js
// ==/UserScript==

(() => {
    "use strict";

    /* ============================================
       BASIC HELPERS
    ============================================ */

    const $ = s => document.querySelector(s);
    const $$ = s => Array.from(document.querySelectorAll(s));

    // Recursive Shadow DOM selector
    const deepQuerySelector = (root, selector) => {
        let found = root.querySelector(selector);
        if (found) return found;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
        let node;

        while ((node = walker.nextNode())) {
            if (node.shadowRoot) {
                found = deepQuerySelector(node.shadowRoot, selector);
                if (found) return found;
            }
        }
        return null;
    };

    /* ============================================
       MODAL SYSTEM
    ============================================ */

    const modalCSS = `
        .friends-modal {
            position: fixed;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
            width: 400px;
            background: #2d2d2d;
            border-radius: 8px;
            z-index: 999999;
            color: white;
            font-family: 'Gotham SSm', Arial, sans-serif;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }
        .modal-header {
            padding: 16px;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #444;
        }
        .modal-close {
            cursor: pointer;
            font-size: 22px;
        }
        .modal-title {
            font-size: 18px;
            font-weight: 600;
        }
        .friends-list {
            max-height: 60vh;
            overflow-y: auto;
        }
        .friend-item {
            padding: 12px 16px;
            cursor: pointer;
            transition: background 0.15s;
        }
        .friend-item:hover {
            background: #3a3a3a;
        }
        .friend-name {
            font-weight: 500;
        }
        .overlay {
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.55);
            z-index: 999998;
        }
        .loading {
            padding: 20px;
            text-align: center;
            color: #888;
        }
    `;

    const injectModalCSS = () => {
        if ($("#friends-modal-style")) return;
        const style = document.createElement("style");
        style.id = "friends-modal-style";
        style.textContent = modalCSS;
        document.head.appendChild(style);
    };

    const closeModal = () => {
        $(".overlay")?.remove();
        $(".friends-modal")?.remove();
    };

    const createModal = title => {
        injectModalCSS();

        const overlay = document.createElement("div");
        overlay.className = "overlay";
        overlay.onclick = closeModal;

        const modal = document.createElement("div");
        modal.className = "friends-modal";
        modal.innerHTML = `
            <div class="modal-header">
                <div class="modal-title">${title}</div>
                <div class="modal-close">×</div>
            </div>
            <div class="friends-list">
                <div class="loading">Loading...</div>
            </div>
        `;
        modal.querySelector(".modal-close").onclick = closeModal;

        document.body.append(overlay, modal);
        return modal;
    };

    /* ============================================
       API HELPERS
    ============================================ */

    const fetchUsers = async ids => {
        if (!ids.length) return [];
        const r = await fetch("https://users.roblox.com/v1/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userIds: ids, excludeBannedUsers: false })
        });
        const j = await r.json();
        return j.data || [];
    };

    const fetchRelations = async (userId, type) => {
        const out = [];
        let cursor = null;
        for (let i = 0; i < 5; i++) {
            const url = `https://friends.roblox.com/v1/users/${userId}/${type}${cursor ? `?cursor=${cursor}` : ""}`;
            const r = await fetch(url);
            const j = await r.json();
            if (!j.data?.length) break;
            out.push(...j.data);
            cursor = j.nextPageCursor;
            if (!cursor) break;
        }
        return out;
    };

    /* ============================================
       BUTTON CREATION
    ============================================ */

    const createButton = (text, color, hover) => {
        const btn = document.createElement("div");
        btn.textContent = text;
        btn.style.cssText = `
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 6px 14px;
            background: ${color};
            color: white;
            border-radius: 9999px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all .15s ease;
        `;
        btn.onmouseenter = () => {
            btn.style.background = hover;
            btn.style.transform = "translateY(-1px)";
        };
        btn.onmouseleave = () => {
            btn.style.background = color;
            btn.style.transform = "none";
        };
        return btn;
    };

    /* ============================================
       SHOW FRIENDS
    ============================================ */

    const showFriends = async userId => {
        const modal = createModal("Friends");
        const list = modal.querySelector(".friends-list");

        const r = await fetch(`https://friends.roblox.com/v1/users/${userId}/friends`);
        const data = await r.json();

        list.innerHTML = "";

        data.data.forEach(u => {
            const item = document.createElement("div");
            item.className = "friend-item";

            if (u.id === -1 || !u.name) {
                item.innerHTML = `<span class="friend-name" style="opacity:0.6; font-size:14px;">(Hidden User)</span>`;
                list.appendChild(item);
                return;
            }

            item.innerHTML = `<span class="friend-name">${u.displayName || u.name}</span>`;
            item.onclick = () => window.open(`https://www.roblox.com/users/${u.id}/profile`);
            list.appendChild(item);
        });
    };

    /* ============================================
       SHOW FOLLOWERS / FOLLOWING
    ============================================ */

    const showRelationModal = async (userId, type, title) => {
        const modal = createModal(title);
        const list = modal.querySelector(".friends-list");

        const rel = await fetchRelations(userId, type);
        if (!rel.length) {
            list.innerHTML = `<div class="loading">No ${title.toLowerCase()}</div>`;
            return;
        }

        list.innerHTML = "";

        for (let i = 0; i < rel.length; i += 100) {
            const batch = rel.slice(i, i + 100);
            const users = await fetchUsers(batch.map(r => r.id));

            users.forEach(u => {
                const item = document.createElement("div");
                item.className = "friend-item";

                if (u.id === -1 || !u.name) {
                    item.innerHTML = `<span class="friend-name" style="opacity:0.6; font-size:14px;">(Hidden User)</span>`;
                    list.appendChild(item);
                    return;
                }

                item.innerHTML = `<span class="friend-name">${u.displayName || u.name}</span>`;
                item.onclick = () => window.open(`https://www.roblox.com/users/${u.id}/profile`);
                list.appendChild(item);
            });
        }
    };

    /* ============================================
       INJECTION TARGET
    ============================================ */

    const detectLayout = () => {
        const title = deepQuerySelector(document, ".profile-header-title-container");
        const oldStats = deepQuerySelector(document, "ul.profile-header-social-counts");

        return {
            title,
            isOld: !!oldStats
        };
    };

    /* ============================================
       INJECT BUTTONS
    ============================================ */

    const injectButtons = () => {
        const userId = location.pathname.split("/")[2];

        const { title, isOld } = detectLayout();
        if (!title) return;

        if (title.querySelector(".friends-list-button-container")) return;

        const container = document.createElement("div");
        container.className = "friends-list-button-container";
        container.style.cssText = `
            display: inline-flex;
            gap: 6px;
            margin-left: 12px;
            vertical-align: middle;
        `;

        const smallStyle = isOld ? "padding: 4px 11px; font-size: 13px; border-radius: 10px;" : "";

        const b1 = createButton("Friends", "#ff69b4", "#e0529c");
        const b2 = createButton("Followers", "#5865F2", "#4752c4");
        const b3 = createButton("Following", "#57A559", "#458a47");

        if (isOld) [b1, b2, b3].forEach(b => b.style.cssText += smallStyle);

        b1.onclick = () => showFriends(userId);
        b2.onclick = () => showRelationModal(userId, "followers", "Followers");
        b3.onclick = () => showRelationModal(userId, "followings", "Following");

        container.append(b1, b2, b3);
        title.appendChild(container);
    };

    /* ============================================
       OBSERVER
    ============================================ */

    const root = $("#rbx-body-content") || document.body;

    new MutationObserver(() => {
        try { injectButtons(); } catch (e) { console.error(e); }
    }).observe(root, { childList: true, subtree: true });

})();
