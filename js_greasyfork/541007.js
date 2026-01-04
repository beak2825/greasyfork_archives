// ==UserScript==
// @name         Open2ch 強制コテ化スクリプト
// @namespace    https://onjmin.glitch.me/
// @version      1.0.1
// @description  IDをもとにアイコンを自動生成
// @author       おんJ民
// @match        *://*.open2ch.net/*/*
// @icon         https://avatars.githubusercontent.com/u/88383494
// @grant        none
// @license      GNU Affero General Public License v3.0 or later
// @downloadURL https://update.greasyfork.org/scripts/541007/Open2ch%20%E5%BC%B7%E5%88%B6%E3%82%B3%E3%83%86%E5%8C%96%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/541007/Open2ch%20%E5%BC%B7%E5%88%B6%E3%82%B3%E3%83%86%E5%8C%96%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==

(async ()=> {
    'use strict';

    const currentKey = 'robohash';
    // const currentKey = 'dicebear/big-smile';
    const avatarModes = [
        {
            key: "robohash",
            url: (hash) => `https://robohash.org/${hash}.png`,
            flip: true,
        },
        {
            key: "dicebear",
            url: (hash) =>
            `https://api.dicebear.com/8.x/adventurer/svg?seed=${hash}`,
            flip: true,
        },
        {
            key: "gravatar",
            url: (hash) => `https://www.gravatar.com/avatar/${hash}?d=identicon`,
            flip: false,
        },
    ];

    const dicebearList = [
        "adventurer", // 冒険者風キャラ（RPGっぽい）
        "avataaars", // Avataaarsベースのカートゥーン
        "big-ears", // 大きな耳が特徴のスタイル
        "big-smile", // 巨大スマイル系アバター
        "bottts", // ボット風ロボットアバター
        "croodles", // ラフな手描きキャラ
        "identicon", // GitHub風識別子
        "initials", // 名前のイニシャルを表示
        "lorelei", // 魔法使いや精霊風の人物像
        "miniavs", // シンプルなミニアバター
        "notionists", // Notion風人物
        "open-peeps", // カジュアルな人物画（肩まで）
        "personas", // ややリアル寄りの人物
        "pixel-art", // ドット絵スタイル
    ];

    const dicebear = avatarModes.find(({key}) => key === "dicebear");
    for (const v of dicebearList) {
        avatarModes.push({
            ...dicebear,
            key: `dicebear/${v}`,
            url: (hash) => `https://api.dicebear.com/8.x/${v}/svg?seed=${hash}`,
            flip: v.includes('adventurer')
        });
    }

    // ✅ アバター要素生成
    const createAvatar = (url, flip) => {
        const isSVG = url.endsWith(".svg");
        const img = document.createElement("img");
        Object.assign(img, {
            src: url,
            width: 45,
            height: 45,
        });
        Object.assign(img.style, {
            padding: "3px",
            background: isSVG ? "transparent" : "rgb(238, 238, 255)",
            marginRight: "3px",
            borderRadius: "45px",
            display: "block",
            transform: flip ? "scaleX(-1)" : "",
        });
        img.setAttribute("iconimg", "1");
        img.setAttribute("align", "left");
        img.classList.add("pic", "lazy", "imgur");

        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.setAttribute("data-lightbox", "i");
        a.appendChild(img);

        return a;
    };

    const extractID = (dt) => {
        const span = dt.querySelector("span._id");
        if (span?.getAttribute("val")) return span.getAttribute("val");
        const match = [...dt.classList].find((cls) => cls.startsWith("id"));
        return match?.slice(2).trim();
    };

    const sha256 = async text =>
    Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text))))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

    const processPosts = async (nodes) => {
        for (const node of nodes) {
            if (!(node instanceof HTMLElement)) continue;
            const dts = node.querySelectorAll?.("dt[class*='id']") ?? [];
            for (const dt of dts) {
                const id = extractID(dt);
                if (!id) continue;

                const dd = dt.nextElementSibling;
                if (!dd?.matches("dd")) continue;

                // 削除既存アバター
                dd.querySelectorAll('img[iconimg="1"]').forEach((img) => {
                    const a = img.closest("a");
                    a && a.parentElement === dd ? a.remove() : img.remove();
                });

                const mode = avatarModes.find((m) => m.key === currentKey);
                if (!mode) return;

                let hash = '';
                if (/[^0-9a-zA-Z]/.test(id)) {
                    const str = id.replace(/[^0-9a-zA-Z]/g, '');
                    if (str.length) {
                        hash = str;
                    } else {
                        hash = (await sha256(str)).slice(32);
                    }
                } else {
                    hash = id;
                }

                const avatarURL = mode.url(hash);
                const avatar = createAvatar(avatarURL, mode.flip);

                const icon = dd.querySelector("icon");
                icon
                    ? dd.insertBefore(avatar, icon)
                : dd.insertBefore(avatar, dd.firstChild);
            }
        }
    };

    const thread = document.querySelector(".thread");
    if (thread) {
        // 初回に既存要素も処理
        await processPosts(thread.children);

        // 監視設定
        const observer = new MutationObserver((mutations) => {
            const added = mutations.flatMap((m) => [...m.addedNodes]);
            processPosts(added);
        });

        observer.observe(thread, { childList: true, subtree: true });
    }

})();