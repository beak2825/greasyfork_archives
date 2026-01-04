// ==UserScript==
// @name         Twitch Status Badge at img
// @namespace    https://github.com/uzuky
// @version      8.2
// @description  スレッド内の書き込みにTwitch のリンクがあったら、shields.ioの配信状況バッジを挿入します。 multitwitchのリンクだった場合、チャンネルIDごとに表示します。更新履歴: https://greasyfork.org/ja/scripts/539290-twitch-status-badge-at-img/versions?show_all_versions=1
// @author       uzuky
// @license      MIT
// @match        https://*.2chan.net/*
// @match        http://*.2chan.net/*
// @match        https://tsumanne.net/*
// @match        https://kako.futakuro.com/futa/*
// @match        https://*.ftbucket.info/*/cont/*
// @exclude      https://www.twitch.tv/*
// @match        https://nijiurachan.net/*
// @match        https://mebuki.moe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539290/Twitch%20Status%20Badge%20at%20img.user.js
// @updateURL https://update.greasyfork.org/scripts/539290/Twitch%20Status%20Badge%20at%20img.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 作成したバッジを入れとく配列
    const allBadges = [];

    // shields.ioのバッジの見た目をカスタマイズする設定
    // 詳細は https://shields.io/badges/twitch-status
    const shieldOptions = {
        style: 'flat',          // スタイル (plastic, flat, flat-square, for-the-badge, social)
        logo: 'twitch',         // 表示するロゴ (https://simpleicons.org/ にあるやつ)
        logoColor: 'white',     // ロゴの色
        //logoSize: '',           // ロゴのサイズ
        label: '',              // ラベルの文字
        //labelColor: '',         // ラベルの色
        //color: '',              // ラベルの背景色
        //cacheSeconds: '',       // 配信状況がキャッシュされる秒数 デフォルトの5分より短くしても意味がない
    };

    function createShieldUrl(channelName, customOptions = {}) {
        const finalOptions = { ...shieldOptions, ...customOptions };
        const params = new URLSearchParams(finalOptions);
        return `https://img.shields.io/twitch/status/${channelName}?${params.toString()}`;
    }

    // バッジのimgを作成する
    function createBadgeImage(channelName, customOptions = {}) {
        const img = document.createElement('img');
        img.src = createShieldUrl(channelName, customOptions);
        img.alt = `Twitch Status for ${channelName}`;
        img.title = `${channelName} の配信状況`;
        img.style.verticalAlign = 'middle';
        img.style.height = '1.2em';

        // 作ったバッジを配列に入れとく
        allBadges.push(img);

        return img;
    }

    // バッジのimgをaで囲む
    function createLinkedBadge(channelName, customOptions = {}, styleObject = {}) {
        const badge = createBadgeImage(channelName, customOptions);
        const link = document.createElement('a');
        link.href = `https://www.twitch.tv/${channelName}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        Object.assign(link.style, styleObject);
        link.appendChild(badge);
        return link;
    }


    // バッジ1つだけの処理
    function addSingleTwitchBadge(targetElement, channelName) {
        const linkedBadge = createLinkedBadge(
            channelName,
            {},
            { marginLeft: '4px' }
        );
        targetElement.parentNode.insertBefore(linkedBadge, targetElement.nextSibling);
    }

    // バッジが複数あるときの処理
    function addMultiTwitchBadges(targetElement, channels) {
        const badgeContainer = document.createElement('span');
        badgeContainer.style.display = 'flex';
        badgeContainer.style.flexWrap = 'wrap';
        badgeContainer.style.gap = '4px';
        badgeContainer.style.marginTop = '4px';

        channels.forEach(channelName => {
            const linkedBadge = createLinkedBadge(
                channelName,
                // バッジのラベルにチャンネル名を追加
                { label: channelName },
                {}
            );
            badgeContainer.appendChild(linkedBadge);
        });

        targetElement.parentNode.insertBefore(badgeContainer, targetElement.nextSibling);
    }


    // メインの処理
    function scanPageContent() {
        // aタグになっている部分を処理する
        const links = document.querySelectorAll('a:not([data-badged])');

        links.forEach(aTag => {
            aTag.dataset.badged = 'true';
            const linkText = aTag.textContent;
            if (!linkText) return;

            const multiMatch = linkText.match(/multitwitch\.(?:tv|live)\/([a-zA-Z0-9_\/]+)/);
            if (multiMatch && multiMatch[1]) {
                const path = multiMatch[1].replace(/\/$/, '');
                // IDごとに分割したあと、空の配列があったら削除する
                if (path) addMultiTwitchBadges(aTag, path.split('/').filter(p => p));
                return;
            }

            const singleMatch = linkText.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);
            if (singleMatch && singleMatch[1]) {
                addSingleTwitchBadge(aTag, singleMatch[1]);
            }
        });

        // もしaタグになっていないURLがあっても検出して処理する
        const blockquotes = document.querySelectorAll('blockquote:not([data-badged])');

        blockquotes.forEach(bq => {
            bq.dataset.badged = 'true';
            const walker = document.createTreeWalker(bq, NodeFilter.SHOW_TEXT);
            const textNodesToProcess = [];
            let node;
            while(node = walker.nextNode()) {
                if (node.parentElement.closest('a, script')) continue;
                textNodesToProcess.push(node);
            }

            textNodesToProcess.reverse().forEach(textNode => {
                const text = textNode.nodeValue;

                const multiTwitchRegex = /multitwitch\.(?:tv|live)\/([a-zA-Z0-9_\/]+)/g;
                let multiMatch;
                if (multiMatch = multiTwitchRegex.exec(text)) {
                    const path = multiMatch[1].replace(/\/$/, '');
                    if(path) {
                        const channels = path.split('/').filter(p => p);
                        addMultiTwitchBadges(textNode, channels);
                        return;
                    }
                }

                const singleTwitchRegex = /twitch\.tv\/[a-zA-Z0-9_]+/g;
                let singleMatch;
                if (singleMatch = singleTwitchRegex.exec(text)) {
                    const url = singleMatch[0];
                    const channelName = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/)[1];
                    addSingleTwitchBadge(textNode, channelName);
                    return;
                }
            });
        });
    }

    setTimeout(scanPageContent, 500);

    // ページの動的更新に対応するやつ
    const observer = new MutationObserver(() => {
        clearTimeout(observer.timer);
        observer.timer = setTimeout(scanPageContent, 500);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // バッジを定期的に更新するやつ
    const UPDATE_INTERVAL = 150 * 1000;

    function updateAllBadges() {
        console.log(`[Twitch Badge] Updating ${allBadges.length} badges...`);
        allBadges.forEach(imgElement => {
            // キャッシュバスティングってやつ
            const currentSrc = new URL(imgElement.src);
            currentSrc.searchParams.set('cache_buster', Date.now());
            imgElement.src = currentSrc.toString();
        });
    }

    // 定期更新を開始
    setInterval(updateAllBadges, UPDATE_INTERVAL);

})();