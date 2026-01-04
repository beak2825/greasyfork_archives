// ==UserScript==
// @name         梱包チェック
// @namespace    http://tampermonkey.net/
// @version      1.50
// @description  虫眼鏡押下時、梱包可能かどうか自動チェック。OKなら実行可能に。実行後も処理を自動化(日付設定 + 納品書管理 + 確認内容警告)
// @match        https://main.next-engine.com/Userjyuchu/jyuchuInp*
// @grant        GM_xmlhttpRequest
// @connect      tk2-217-18298.vs.sakura.ne.jp
// @downloadURL https://update.greasyfork.org/scripts/537796/%E6%A2%B1%E5%8C%85%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/537796/%E6%A2%B1%E5%8C%85%E3%83%81%E3%82%A7%E3%83%83%E3%82%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const headerTrId = "doukon_tablene_header";
    const customColClass = "chk-doukon-col";
    const targetShrinkColIndex = 7;
    const denpyoStatusMap = {};
    let childSystemMessages = {};
    let blackListNames = [];
    let blackListFetchFailed = false;
    let blackListFetchErrorMsg = "";
    const bannerQueue = [];
    let bannerVisible = false;

//     const testAutoActionsBtn = document.createElement('button');
//     testAutoActionsBtn.textContent = 'T';
//     testAutoActionsBtn.style.position = 'fixed';
//     testAutoActionsBtn.style.right = '32px';
//     testAutoActionsBtn.style.bottom = '32px';
//     testAutoActionsBtn.style.zIndex = '2147483647';
//     testAutoActionsBtn.style.padding = '16px 36px';
//     testAutoActionsBtn.style.fontSize = '1.08em';
//     testAutoActionsBtn.style.background = '#3B82F6';
//     testAutoActionsBtn.style.color = '#fff';
//     testAutoActionsBtn.style.border = 'none';
//     testAutoActionsBtn.style.borderRadius = '10px';
//     testAutoActionsBtn.style.boxShadow = '0 2px 8px rgba(60, 80, 100, 0.14)';
//     testAutoActionsBtn.style.cursor = 'pointer';

//     testAutoActionsBtn.addEventListener('click', function() {
//         checkAndUpdateDate(headerTrId, jyuchuBiChildMap);
//         restoreNouhinsyoText(prevText);
//         checkAndShowBanner();
//         alert('3つの処理を手動実行');
//     });

//     document.body.appendChild(testAutoActionsBtn);

    function resizeColumn() {
        const headTr = document.getElementById(headerTrId);
        if (!headTr) return;
        const ths = headTr.querySelectorAll("td");
        if (ths.length > targetShrinkColIndex) {
            ths[targetShrinkColIndex].style.width = "120px";
        }
        const table = headTr.closest("table");
        if (!table) return;
        const bodyRows = table.querySelectorAll("tbody tr");
        bodyRows.forEach(row => {
            const tds = row.querySelectorAll("td");
            if (tds.length > targetShrinkColIndex) {
                tds[targetShrinkColIndex].style.width = "120px";
            }
        });
    }

    function isStatusEqual(a, b) {
        if (!a || !b) return false;
        return (
            a.nyukinOK === b.nyukinOK &&
            a.siharaiOK === b.siharaiOK &&
            a.meisaiOK === b.meisaiOK &&
            a.meisaiNG === b.meisaiNG
        );
    }

    const holidays2025 = [
        '2025-01-01', // 元日
        '2025-01-13', // 成人の日
        '2025-02-11', // 建国記念の日
        '2025-02-23', // 天皇誕生日
        '2025-02-24', // 振替休日
        '2025-03-20', // 春分の日
        '2025-04-29', // 昭和の日
        '2025-05-03', // 憲法記念日
        '2025-05-04', // みどりの日
        '2025-05-05', // こどもの日
        '2025-05-06', // 振替休日
        '2025-07-21', // 海の日
        '2025-08-11', // 山の日
        '2025-09-15', // 敬老の日
        '2025-09-23', // 秋分の日
        '2025-10-13', // スポーツの日
        '2025-11-03', // 文化の日
        '2025-11-23', // 勤労感謝の日
        '2025-11-24', // 振替休日
    ];

    function getNextWorkingDay(fromDate) {
        let date = new Date(fromDate.getTime());
        while (true) {
            date.setDate(date.getDate() + 1);
            const yyyy = date.getFullYear();
            const mm = ('0' + (date.getMonth() + 1)).slice(-2);
            const dd = ('0' + date.getDate()).slice(-2);
            const dateStr = `${yyyy}-${mm}-${dd}`;
            if (date.getDay() === 0 || date.getDay() === 6) continue;
            if (holidays2025.includes(dateStr)) continue;
            return `${yyyy}/${mm}/${dd}`;
        }
    }

    function showBanner(msg) {
        if (bannerVisible) {
            bannerQueue.push(msg);
            return;
        }
        bannerVisible = true;

        let oldBanner = document.getElementById('custom-warning-banner');
        if (oldBanner) oldBanner.remove();

        let banner = document.createElement('div');
        banner.id = 'custom-warning-banner';
        banner.style.position = 'fixed';
        banner.style.bottom = '18px';
        banner.style.left = '50%';
        banner.style.transform = 'translateX(-50%)';
        banner.style.background = 'rgba(40, 48, 60, 0.93)';
        banner.style.color = '#fff';
        banner.style.padding = '24px 32px 20px 30px';
        banner.style.zIndex = '2147483647';
        banner.style.borderRadius = '15px';
        banner.style.fontSize = '1.5em';
        banner.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)';
        banner.style.display = 'block';
        banner.style.minWidth = '330px';
        banner.style.wordBreak = 'break-word';
        banner.style.border = '1.1px solid #fff2';
        banner.style.backdropFilter = 'blur(1.2px)';
        banner.style.fontFamily = "'Segoe UI', 'Meiryo', sans-serif";
        banner.style.animation = 'customBannerFadein 0.33s cubic-bezier(.33,1.5,.4,1)';
        banner.style.boxSizing = 'border-box';
        banner.style.overflow = 'visible';
        banner.style.pointerEvents = 'auto';
        banner.style.lineHeight = '1.5';
        banner.style.textAlign = 'center';
        banner.style.whiteSpace = "nowrap";

        let row = document.createElement('div');
        row.style.display = 'flex';
        row.style.alignItems = 'center';
        row.style.gap = '9px';
        row.style.paddingRight = '22px';

        let icon = document.createElement('span');
        icon.innerHTML = '⚠️';
        icon.style.fontSize = '1.8em';
        icon.style.flexShrink = '0';
        icon.style.marginTop = '0';

        let textArea = document.createElement('div');
        textArea.style.flex = '1 1 0%';
        textArea.style.display = 'flex';
        textArea.style.flexDirection = 'column';

        textArea.innerHTML = msg;
        textArea.style.whiteSpace = "nowrap";

        row.appendChild(icon);
        row.appendChild(textArea);

        let closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.setAttribute('aria-label', '閉じる');
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '5px';
        closeBtn.style.right = '7px';
        closeBtn.style.background = 'rgba(255,255,255,0.13)';
        closeBtn.style.border = 'none';
        closeBtn.style.color = '#fff';
        closeBtn.style.fontSize = '1.7em';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.width = '36px';
        closeBtn.style.height = '36px';
        closeBtn.style.padding = '0';
        closeBtn.style.display = 'flex';
        closeBtn.style.justifyContent = 'center';
        closeBtn.style.alignItems = 'center';
        closeBtn.style.borderRadius = '7px';
        closeBtn.style.lineHeight = '1';
        closeBtn.onmouseover = () => { closeBtn.style.background = 'rgba(255,255,255,0.20)'; };
        closeBtn.onmouseout = () => { closeBtn.style.background = 'rgba(255,255,255,0.13)'; };

        closeBtn.addEventListener('click', () => {
            banner.remove();
            childSystemMessages = {};
            bannerVisible = false;
            if (bannerQueue.length > 0) showBanner(bannerQueue.shift());
        });

        banner.appendChild(row);
        banner.appendChild(closeBtn);
        document.body.appendChild(banner);

        if (!document.getElementById('custom-banner-fadein-style')) {
            let style = document.createElement('style');
            style.id = 'custom-banner-fadein-style';
            style.innerHTML = `
    @keyframes customBannerFadein {
        from { opacity: 0; transform: translateX(-50%) translateY(40px);}
        to   { opacity: 1; transform: translateX(-50%) translateY(0);}
    }
    `;
            document.head.appendChild(style);
        }
    }

    let prevText = "";

    function setExecButtonListener(execBtn) {
        if (execBtn.dataset.doukonRestoredExec) return;
        execBtn.dataset.doukonRestoredExec = "1";
        execBtn.addEventListener('click', function() {
            setTimeout(() => {
                checkAndUpdateDate();
                restoreNouhinsyoTextRepeatedly();
                checkAndShowBanner();
            }, 300);
        });
    }

    function restoreNouhinsyoText() {
        const nouhinsyo = document.getElementById('nouhinsyo_text');
        if (nouhinsyo && nouhinsyo.value !== prevText) {
            nouhinsyo.value = prevText;
            nouhinsyo.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('実行ボタンで納品書内容を初期状態に復元');
            showBanner(
                `<strong style="font-size:1.10em;">納品書特記事項を復元しました。</strong><br>
            <span style="font-size:1.04em;">伝票更新を行い保存してください。</span>`
            );
        }
    }

    function restoreNouhinsyoTextRepeatedly() {
        const maxTries = 20;
        let tries = 0;

        const interval = setInterval(() => {
            tries++;
            restoreNouhinsyoText(prevText);
            if (tries >= maxTries) {
                clearInterval(interval);
            }
        }, 300);
    }

    function checkAndShowBanner() {
        const okMsgs = [
            "同梱可能受注が存在します。\nこの伝票は受注メールが送信されません。",
            "同梱可能受注が存在します。"
        ];
        const normalize = str => (str || "").replace(/[\s\u3000]+/g, "");

        const sysMsgElem = document.getElementById('system_message_kbn');
        const msg = sysMsgElem ? sysMsgElem.value.trim() : "";
        const msgNorm = normalize(msg);
        const isParentOK = okMsgs.some(ok => normalize(ok) === msgNorm);

        const ngChilds = [];
        for (const [denpyoNo, systemMessage] of Object.entries(childSystemMessages)) {
            if (systemMessage && systemMessage.includes("備考欄を見て下さい。")) {
                ngChilds.push({
                    denpyoNo,
                    message: systemMessage
                });
            }
        }

        let html = "";

        if (ngChilds.length > 0) {
            const ngList = ngChilds.map(item =>
                                        `・伝票番号：${item.denpyoNo}<br><span style="font-size:0.85em;color:#aaa;">${item.message.replace(/\n/g, "<br>")}</span>`
        ).join("<br>");
            html += `<strong style='font-size:1.08em;'>候補先に「備考欄を見て下さい。」と指示があります。</strong>
    <strong style='font-size:1.08em;'>内容を確認してください。</strong>
    <div style='margin-top:12px; font-size:0.92em; color:#eee; text-align:left;'>
        ${ngList}
    </div>`;
        }

        if (!isParentOK && msgNorm) {
            if (html) html += `<div style="margin-top:20px;"></div>`;
            html += `<strong style='font-size:1.08em;'>同梱先の確認内容欄に注意事項が含まれています。</strong>
    <strong style='font-size:1.08em;'>内容を確認してください。</strong>`;
        }

        if (html) {
            showBanner(html);
        }
    }

    function showStatus(msg, level = "info") {
        if (level === "error") {
            console.error(msg);
        } else if (level === "warn") {
            console.warn(msg);
        } else {
            console.log(msg);
        }
    }

    function isParentNameBlacklisted() {
        const nameIds = ['jyuchu_name', 'hasou_name'];
        for (const id of nameIds) {
            const elem = document.getElementById(id);
            const name = (elem?.value || elem?.textContent || '').trim();
            if (blackListNames.includes(name)) return true;
        }
        return false;
    }

    fetchBlackList('http://tk2-217-18298.vs.sakura.ne.jp/issues/404220');

    function fetchBlackList(url) {
        blackListFetchFailed = false;
        blackListFetchErrorMsg = "";

        showStatus("ブラックリスト取得中...", "info");

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            timeout: 10000,
            onload: function(response) {
                try {
                    const finalUrl = response.finalUrl || response.responseURL || url;
                    if (finalUrl.includes('/login')) {
                        blackListFetchFailed = true;
                        blackListFetchErrorMsg = "Redmine未ログインのためブラックリスト取得不可です。ログインしてください。";
                        blackListNames = [];
                        showStatus("[認証エラー] " + blackListFetchErrorMsg, "warn");
                        return;
                    }
                    if (response.status !== 200) {
                        blackListFetchFailed = true;
                        blackListFetchErrorMsg = `ステータス: ${response.status} で取得失敗`;
                        blackListNames = [];
                        showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                        return;
                    }
                    if (!response.responseText) {
                        blackListFetchFailed = true;
                        blackListFetchErrorMsg = "ページ内容が空です。";
                        blackListNames = [];
                        showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                        return;
                    }
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    if (!doc) {
                        blackListFetchFailed = true;
                        blackListFetchErrorMsg = "DOMパース失敗。";
                        blackListNames = [];
                        showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                        return;
                    }
                    const wikiDiv = doc.querySelector('.wiki p');
                    if (!wikiDiv) {
                        blackListFetchFailed = true;
                        blackListFetchErrorMsg = "class='wiki' 内の <p> 要素が見つかりません。";
                        blackListNames = [];
                        showStatus("[エラー] " + blackListFetchErrorMsg, "error");
                        return;
                    }
                    blackListNames = wikiDiv.innerHTML
                        .split('<br>')
                        .map(name => name.trim())
                        .filter(name => name.length > 0);
                    if (blackListNames.length === 0) {
                        blackListFetchFailed = true;
                        blackListFetchErrorMsg = "ブラックリストが空です。";
                        showStatus("[注意] " + blackListFetchErrorMsg, "warn");
                    } else {
                        blackListFetchFailed = false;
                        blackListFetchErrorMsg = "";
                        showStatus("ブラックリスト取得成功！", "info");
                        console.log('ブラックリスト:', blackListNames);
                    }
                } catch (e) {
                    blackListFetchFailed = true;
                    blackListFetchErrorMsg = "例外エラー: " + e;
                    blackListNames = [];
                    showStatus("[例外エラー] " + blackListFetchErrorMsg, "error");
                }
            },
            onerror: function() {
                blackListFetchFailed = true;
                blackListFetchErrorMsg = "通信エラーでブラックリストを取得できません。";
                blackListNames = [];
                showStatus("[通信エラー] " + blackListFetchErrorMsg, "error");
            },
            ontimeout: function() {
                blackListFetchFailed = true;
                blackListFetchErrorMsg = "タイムアウトでブラックリストを取得できません。";
                blackListNames = [];
                showStatus("[タイムアウト] " + blackListFetchErrorMsg, "error");
            }
        });
    }


    function getJSTDateObj() {
        const now = new Date();
        return new Date(now.getTime() + (9 * 60 + now.getTimezoneOffset()) * 60 * 1000);
    }

    function checkAndUpdateDate() {
        const jyuchuBiParent = document.getElementById('jyuchu_bi')?.value ?? null;
        console.log('[checkAndUpdateDate] jyuchuBiParent:', jyuchuBiParent);
        const table = document.getElementById(headerTrId)?.closest("table");
        if (!jyuchuBiParent) {
            console.log('[checkAndUpdateDate] 親伝票日付が未取得');
            return;
        }
        if (!table) {
            console.log('[checkAndUpdateDate] テーブルが未取得');
            return;
        }
        const rows = table.querySelectorAll("tbody tr");
        let shouldUpdateDate = false;
        for (const row of rows) {
            const tds = row.querySelectorAll("td");
            if (tds.length < 2) {
                console.log('[checkAndUpdateDate] tdsが2未満でスキップ:', row);
                continue;
            }
            const num = tds[1].textContent.trim().match(/\d+/)?.[0] || null;
            const checkbox = tds[0].querySelector('input[type="checkbox"]');
            console.log(`[checkAndUpdateDate] num: ${num}, checkbox.checked: ${checkbox?.checked}`);
            if (num && checkbox && checkbox.checked) {
                const childDateStr = jyuchuBiChildMap[num];
                console.log(`[checkAndUpdateDate] childDateStr for ${num}:`, childDateStr);
                if (!childDateStr) {
                    console.log(`[checkAndUpdateDate] childDateStr未取得、スキップ: ${num}`);
                    continue;
                }
                const parentDate = new Date(jyuchuBiParent.replace(/-/g, '/').replace(/\./g, '/'));
                const childDate = new Date(childDateStr.replace(/-/g, '/').replace(/\./g, '/'));
                console.log(`[checkAndUpdateDate] parentDate: ${parentDate}, childDate: ${childDate}`);
                if (parentDate > childDate) {
                    shouldUpdateDate = true;
                    break;
                }
            }
        }

        if (shouldUpdateDate) {
            let baseDate = getJSTDateObj();
            if (
                baseDate.getHours() < 6 ||
                (baseDate.getHours() === 6 && baseDate.getMinutes() < 30)
            ) {
                baseDate.setDate(baseDate.getDate() - 1);
            }
            const nextWorkday = getNextWorkingDay(baseDate);
            showBanner(
                `<strong style="font-size:1.10em; display:block; margin-bottom:0; line-height:1.15;">
        同梱先の日付が新しいです。
    </strong>
    <strong style="font-size:1.10em; display:block; margin-top:0; line-height:1.15;">
        納品印刷指示日を最短出荷日に設定してください。
    </strong>
    <span style="display:block; font-size:1.04em; margin-top:0.65em;">
        （推奨日付: <span style="color:#fff8a1;font-weight:bold;">${nextWorkday}</span>）
    </span>`
            );
        } else {
            console.log('[checkAndUpdateDate] 日付記入不要');
        }
    }

    let lastVisibility = null;
    let lastDenpyoNo = null;

    setInterval(() => {
        const btn = document.getElementById('ne_dlg_btn1_doukonDlg');
        if (!btn) {
            lastVisibility = null;
            return;
        }

        const visibility = btn.style.visibility || window.getComputedStyle(btn).visibility;

        if (lastVisibility !== 'visible' && visibility === 'visible') {
            const denpyoInput = document.getElementById('doukonsaki_jyuchu_denpyo_no');
            const nowDenpyoNo = denpyoInput ? (denpyoInput.value || denpyoInput.textContent || '').trim() : '';

            if (nowDenpyoNo && nowDenpyoNo !== lastDenpyoNo) {
                childSystemMessages = {};
                lastDenpyoNo = nowDenpyoNo;
                console.log('[伝票切り替え] childSystemMessagesをリセット:', nowDenpyoNo);
            }

            const nouhinsyo = document.getElementById('nouhinsyo_text');
            if (nouhinsyo) {
                prevText = nouhinsyo.value;
                console.log('実行ボタン可視化時に納品書内容を記録:', prevText);
            }
            setExecButtonListener(btn);
        }

        lastVisibility = visibility;
    }, 1000);

    let jyuchuBiChildMap = {};
    let mallHoldMap = {};

    window.addEventListener("message", function(event) {
        if (!event.data) return;
        if (event.data.type === "JyuchuBiChildValue") {
            const {denpyoNo, JyuchuBiChild} = event.data;
            jyuchuBiChildMap[denpyoNo] = JyuchuBiChild;
            console.log("候補先伝票", denpyoNo, "候補先受注日", JyuchuBiChild);
        }

        if (event.data.type === "NyukinKbnValueCheck") {
            const {denpyoNo, value, isNyukinOK} = event.data;
            const btn = document.querySelector(`button.chk-doukon-btn[data-denpyo-no="${denpyoNo}"]`);
            if (btn) {
                btn._nyukinOK = isNyukinOK;
                const prevStatus = denpyoStatusMap[denpyoNo];
                const newStatus = {
                    nyukinOK: btn._nyukinOK,
                    siharaiOK: btn._siharaiOK,
                    meisaiOK: btn._meisaiOK,
                    meisaiNG: btn._meisaiNG,
                };
                if (isStatusEqual(prevStatus, newStatus)) return;
                denpyoStatusMap[denpyoNo] = newStatus;
            }
        }

        if (event.data.type === "SiharaikbnValueCheck") {
            const {value: childValue, denpyoNo} = event.data;
            const ownElem = document.getElementById("siharai_kbn");
            const ownValue = ownElem ? ownElem.value || ownElem.textContent : "";
            const isOK = ownValue === childValue || ownValue === "85" || childValue === "85";
            const btn = document.querySelector(`button.chk-doukon-btn[data-denpyo-no="${denpyoNo}"]`);
            if (btn) {
                btn._siharaiOK = isOK;
                const prevStatus = denpyoStatusMap[denpyoNo];
                const newStatus = {
                    nyukinOK: btn._nyukinOK,
                    siharaiOK: btn._siharaiOK,
                    meisaiOK: btn._meisaiOK,
                    meisaiNG: btn._meisaiNG,
                };
                if (isStatusEqual(prevStatus, newStatus)) return;
                denpyoStatusMap[denpyoNo] = newStatus;
            }
        }

        if (event.data.type === "meisaiJudge") {
            const num = event.data.denpyoNo;
            const btn = document.querySelector(`button.chk-doukon-btn[data-denpyo-no="${num}"]`);
            if (btn) {
                btn._meisaiOK = !!event.data.isAllMatch;
                btn._meisaiNG = !!event.data.hasSetItem;
                const prevStatus = denpyoStatusMap[num];
                const newStatus = {
                    nyukinOK: btn._nyukinOK,
                    siharaiOK: btn._siharaiOK,
                    meisaiOK: btn._meisaiOK,
                    meisaiNG: btn._meisaiNG,
                };
                if (isStatusEqual(prevStatus, newStatus)) return;
                denpyoStatusMap[num] = newStatus;
            }
        }

        if (event.data.type === "GetSystemMessage") {
            const {denpyoNo} = event.data;
            const sysMsgElem = document.getElementById("system_message_kbn");
            const systemMessage = sysMsgElem ? sysMsgElem.value : "";
            window.opener.postMessage(
                {
                    type: "SystemMessageValue",
                    denpyoNo,
                    systemMessage
                },
                "*"
            );
        }
        if (event.data.type === "SystemMessageValue") {
            const {denpyoNo, systemMessage} = event.data;
            childSystemMessages[denpyoNo] = systemMessage;
        }

        if (event.data.type === "MallHoldTagResult") {
            const { denpyoNo, hasMallHold } = event.data;
            mallHoldMap[denpyoNo] = hasMallHold;
            updateRows();
        }
    });

    function updateRows() {
        const headTr = document.getElementById(headerTrId);
        if (!headTr) return;
        const table = headTr.closest("table");
        if (!table) return;
        const rows = table.querySelectorAll("tbody tr");

        let magnifierRows = [];

        rows.forEach(row => {
            const tds = row.querySelectorAll("td");
            if (tds.length < 2) return;
            const num = tds[1].textContent.trim().match(/\d+/)?.[0] || null;
            const checkbox = tds[0].querySelector('input[type="checkbox"]');

            let lastTd = row.querySelector("td." + customColClass);
            if (!lastTd) {
                lastTd = document.createElement("td");
                lastTd.classList.add(customColClass);
                lastTd.style.textAlign = "center";
                lastTd.style.verticalAlign = "middle";
                lastTd.style.width = "22px";
                row.appendChild(lastTd);
            }

            lastTd.querySelectorAll("div.doukon-magnifier-btn-holder").forEach(d => d.remove());

            if (!(num && checkbox && checkbox.checked)) return;

            let div = document.createElement("div");
            div.className = "doukon-magnifier-btn-holder";
            div.style.display = "flex";
            div.style.justifyContent = "center";
            div.style.alignItems = "center";
            div.style.height = "100%";

            magnifierRows.push(num);

            const btn = document.createElement("button");
            btn.className = "chk-doukon-btn";
            btn.tabIndex = 0;

            const status = denpyoStatusMap[num] || {};
            btn._nyukinOK = status.nyukinOK;
            btn._siharaiOK = status.siharaiOK;
            btn._meisaiOK = status.meisaiOK;
            btn._meisaiNG = status.meisaiNG;

            let bg = "#fff", border = "#b3b3b3", svgColor = "#666";
            let issues = [];
            let warning = []; // [要確認]用

            // --- 1. 赤条件が1つでもあれば赤！最優先 ---
            const parentBlacklisted = isParentNameBlacklisted();
            if (
                mallHoldMap[num] ||
                btn._meisaiNG === true ||
                btn._nyukinOK === false ||
                btn._siharaiOK === false ||
                btn._meisaiOK === false ||
                parentBlacklisted
            ) {
                bg = "#ffd6d6";
                border = "#ff8a8a";
                svgColor = "#d50000";
                if (btn._nyukinOK === false) issues.push("■候補先が入金済みではない");
                if (btn._siharaiOK === false) issues.push("■支払方法の不一致");
                if (btn._meisaiOK === false) issues.push("■候補先が引きあたっていない");
                if (btn._meisaiNG === true) issues.push("■候補先がセット商品");
                if (mallHoldMap[num]) issues.push("■候補先のタグにモール保留");
                if (parentBlacklisted) issues.push("■同梱禁止ブラックリストに該当");
            }
            // --- 2. 全OK＆ブラックリスト取得失敗なら黄色背景＆緑枠・SVG ---
            else if (
                btn._nyukinOK === true &&
                btn._siharaiOK === true &&
                btn._meisaiOK === true &&
                blackListFetchFailed
            ) {
                bg = "#fff9d1"; // 薄い黄色
                border = "#66d966"; // 緑枠
                svgColor = "#e5ae00"; // 黄色SVG
                warning.push("■ブラックリスト取得失敗");
                warning.push("　┗ " + (blackListFetchErrorMsg || "原因不明のエラー"));
            }
            // --- 3. ブラックリスト取得失敗のみ（それ以外の状態） ---
            else if (blackListFetchFailed) {
                bg = "#fff9d1";
                border = "#ffda6c";
                svgColor = "#e5ae00";
                warning.push("■ブラックリスト取得失敗");
                warning.push("　┗ " + (blackListFetchErrorMsg || "原因不明のエラー"));
            }
            // --- 4. 全てOKなら緑 ---
            else if (
                btn._nyukinOK === true &&
                btn._siharaiOK === true &&
                btn._meisaiOK === true
            ) {
                bg = "#d4f7d4";
                border = "#66d966";
                svgColor = "#19732a";
            }

            // ツールチップ生成
            let tooltipMsg = "同梱条件チェック";
            if (issues.length) {
                tooltipMsg += "\n[NG]\n" + issues.join("\n");
            } else if (
                btn._nyukinOK === true &&
                btn._siharaiOK === true &&
                btn._meisaiOK === true
            ) {
                tooltipMsg += "\n[OK] 全ての条件をクリアしています";
                if (warning.length) {
                    tooltipMsg += "\n[要確認]\n" + warning.join("\n");
                }
            } else if (warning.length) {
                tooltipMsg += "\n[要確認]\n" + warning.join("\n");
            } else {
                tooltipMsg += "\n[未チェック]";
            }

            btn.style.width = "18px";
            btn.style.height = "18px";
            btn.style.padding = "0";
            btn.style.background = bg;
            btn.style.border = "2px solid " + border;
            btn.style.borderRadius = "6px";
            btn.style.boxShadow = "none";
            btn.style.cursor = "pointer";
            btn.style.display = "flex";
            btn.style.alignItems = "center";
            btn.style.justifyContent = "center";
            btn.style.transition = "background 0.2s, border-color 0.2s, box-shadow 0.2s";

            btn.innerHTML = `
<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${svgColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="7"/>
    <line x1="16.65" y1="16.65" x2="21" y2="21"/>
</svg>
`.trim();

            btn.title = tooltipMsg;

            btn.onmouseenter = () => {
                btn.style.boxShadow = "0 3px 10px rgba(80,140,250,0.19)";
                btn.style.borderColor = "#3b82f6";
                if (bg === "#fff") btn.style.background = "#f0f9ff";
            };
            btn.onmouseleave = () => {
                btn.style.boxShadow = "0 1px 4px rgba(0,0,0,0.11)";
                btn.style.borderColor = border;
                btn.style.background = bg;
            };
            btn.onfocus = () => { btn.style.outline = "2px solid #3b82f6"; };
            btn.onblur = () => { btn.style.outline = ""; };

            btn.setAttribute("data-denpyo-no", num);

            btn.onclick = function(e) {
                e.stopPropagation();

                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                } else if (document.selection) {
                    document.selection.empty();
                }

                btn._nyukinOK = undefined;
                btn._siharaiOK = false;
                btn._meisaiOK = false;
                btn._meisaiNG = false;

                denpyoStatusMap[num] = {
                    nyukinOK: btn._nyukinOK,
                    siharaiOK: btn._siharaiOK,
                    meisaiOK: btn._meisaiOK,
                    meisaiNG: btn._meisaiNG,
                };
                console.log(`[クリック後 denpyoStatusMap] ${num}`, denpyoStatusMap[num]);

                const ownElem = document.getElementById("siharai_kbn");
                const ownValue = ownElem ? ownElem.value || ownElem.textContent : "";
                const url = `https://main.next-engine.com/Userjyuchu/jyuchuInp?kensaku_denpyo_no=${num}&jyuchu_meisai_order=jyuchu_meisai_gyo`;

                const win = window.open(
                    url,
                    "denpyoJoukenCheckWindow",
                    "width=1100,height=700,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes"
                );

                const postMessageToChild = () => {
                    if (!win) return;
                    win.postMessage(
                        {
                            type: "SiharaikbnParentValue",
                            value: ownValue,
                            denpyoNo: num
                        },
                        "*"
                    );
                    win.postMessage(
                        {
                            type: "CheckNyukinKbn",
                            denpyoNo: num
                        },
                        "*"
                    );
                    win.postMessage(
                        {
                            type: "StartMeisaiCheck",
                            denpyoNo: num
                        },
                        "*"
                    );
                    win.postMessage(
                        {
                            type: "GetJyuchuBiChild",
                            denpyoNo: num
                        },
                        "*"
                    );
                    win.postMessage(
                        {
                            type: "GetSystemMessage",
                            denpyoNo: num
                        },
                        "*"
                    );
                    win.postMessage(
                        {
                            type: "GetMallHoldTag",
                            denpyoNo: num
                        },
                        "*"
                    );
                };

                let sendCount = 0;
                const sendInterval = setInterval(() => {
                    if (win && !win.closed) {
                        postMessageToChild();
                        sendCount++;
                        if (sendCount >= 10) clearInterval(sendInterval);
                    } else {
                        clearInterval(sendInterval);
                    }
                }, 1000);
            };

            div.appendChild(btn);
            lastTd.appendChild(div);

        });

        const execBtn = document.getElementById("ne_dlg_btn1_doukonDlg");
        if (execBtn) setupForceExecBtn(execBtn);

        if (execBtn && magnifierRows.length > 0) {
            let allOK = magnifierRows.every(num => {
                const st = denpyoStatusMap[num];
                return (
                    st &&
                    st.nyukinOK === true &&
                    st.siharaiOK === true &&
                    st.meisaiOK === true &&
                    st.meisaiNG !== true &&
                    mallHoldMap[num] !== true &&
                    !isParentNameBlacklisted()
                );
            });

            execBtn.disabled = !allOK;
            execBtn.value = allOK ? "　　実　行　　" : "条件未クリア";
            execBtn.style.opacity = allOK ? 1 : 0.6;
            execBtn.style.cursor = allOK ? "pointer" : "not-allowed";
            console.log(`[実行ボタン制御] magnifierRows=`, magnifierRows, "allOK=", allOK);
        } else {
            if (execBtn) {
                execBtn.disabled = true;
                execBtn.value = "条件未クリア";
                execBtn.style.opacity = 0.6;
                execBtn.style.cursor = "not-allowed";
            }
        }
    }

    let forceBtn = null;

    function setupForceExecBtn(execBtn) {
        if (forceBtn) return;
        forceBtn = document.createElement('button');
        forceBtn.id = 'force-exec-btn';
        forceBtn.textContent = '強制実行';
        forceBtn.style.marginLeft = '10px';
        forceBtn.style.padding = execBtn.style.padding || '0 12px';
        forceBtn.style.height = execBtn.offsetHeight + 'px';
        forceBtn.style.fontSize = execBtn.style.fontSize || '1em';
        forceBtn.style.border = '2px solid #3B82F6';
        forceBtn.style.background = 'transparent';
        forceBtn.style.color = '#3B82F6';
        forceBtn.style.cursor = 'pointer';
        forceBtn.style.display = 'none';
        forceBtn.title = "Ctrlを押している時だけ出現／条件未クリアでも強制的に実行します（注意）";
        forceBtn.addEventListener('mouseover', () => {
            forceBtn.style.background = '#3B82F6';
            forceBtn.style.color = '#fff';
        });
        forceBtn.addEventListener('mouseout', () => {
            forceBtn.style.background = 'transparent';
            forceBtn.style.color = '#3B82F6';
        });
        forceBtn.addEventListener('click', () => {
            execBtn.disabled = false;
            execBtn.click();
        });
        execBtn.parentNode.insertBefore(forceBtn, execBtn.nextSibling);

        window.addEventListener('keydown', e => {
            if (e.ctrlKey) forceBtn.style.display = '';
        });
        window.addEventListener('keyup', e => {
            if (!e.ctrlKey) forceBtn.style.display = 'none';
        });
    }

    function childWindowWatcher() {
        let lastDenpyoNo = null;

        window.addEventListener("message", function(event) {
            if (!event.data) return;

            if (event.data.type === "GetJyuchuBiChild") {
                const {denpyoNo} = event.data;
                const JyuchuBiChildElem = document.getElementById("jyuchu_bi");
                const JyuchuBiChildValue = JyuchuBiChildElem ? JyuchuBiChildElem.value || JyuchuBiChildElem.textContent : "";
                window.opener.postMessage(
                    {
                        type: "JyuchuBiChildValue",
                        denpyoNo,
                        JyuchuBiChild: JyuchuBiChildValue
                    },
                    "*"
                );
            }

            if (event.data.type === "CheckNyukinKbn") {
                const {denpyoNo} = event.data;
                const nyukinElem = document.getElementById("nyukin_kbn");
                const nyukinValue = nyukinElem ? (nyukinElem.value || nyukinElem.textContent) : "";
                const isNyukinOK = (nyukinValue === "2");

                window.opener.postMessage(
                    {
                        type: "NyukinKbnValueCheck",
                        denpyoNo,
                        value: nyukinValue,
                        isNyukinOK: isNyukinOK
                    },
                    "*"
                );
                console.log(`[子ウィンドウ] NyukinKbnValueCheck 送信: ${nyukinValue}(${isNyukinOK}) for 伝票${denpyoNo}`);
            }

            if (event.data.type === "GetMallHoldTag") {
                const { denpyoNo } = event.data;
                const tagElem = document.getElementById("jyuchu_tag");
                const tagHtml = tagElem ? tagElem.innerText || tagElem.textContent : "";
                const hasMallHold = tagHtml.includes("モール保留");
                window.opener.postMessage(
                    {
                        type: "MallHoldTagResult",
                        denpyoNo,
                        hasMallHold
                    },
                    "*"
                );
            }

            if (event.data.type === "SiharaikbnParentValue") {
                const {value: parentValue, denpyoNo} = event.data;
                lastDenpyoNo = denpyoNo;

                const ownElem = document.getElementById("siharai_kbn");
                if (!ownElem) return;

                let ownValue = ownElem.value || ownElem.textContent;
                window.opener.postMessage(
                    {
                        type: "SiharaikbnValueCheck",
                        from: "child",
                        value: ownValue,
                        denpyoNo: lastDenpyoNo
                    },
                    "*"
                );
                console.log(`[子ウィンドウ] SiharaikbnValueCheck 送信: ${ownValue} for 伝票${lastDenpyoNo}`);
            }

            if (event.data.type === "StartMeisaiCheck") {
                const {denpyoNo} = event.data;
                let closed = false;

                function closeWindowOnce() {
                    if (!closed) {
                        closed = true;
                        setTimeout(() => window.close(), 50);
                    }
                }

                function checkMeisaiTable() {
                    const table = document.getElementById("jyuchuMeisai_tablene_table");
                    if (!table) return;
                    const rows = table.querySelectorAll("tbody tr");

                    let isAllMatch = true;
                    let hasSetItem = false;
                    for (let i = 1; i < rows.length; i++) {
                        const tds = rows[i].querySelectorAll("td");
                        if (tds.length < 13) continue;
                        const cb = tds[2].querySelector('input[type="checkbox"]');
                        if (cb && cb.checked) continue;

                        const orderQty = tds[6].textContent.trim();
                        const hikiateQty = tds[7].textContent.trim();

                        if (orderQty !== hikiateQty) {
                            isAllMatch = false;
                        }

                        const price = tds[10].textContent.trim();
                        const subtotal = tds[12].textContent.trim();
                        if (orderQty !== "1" && price === subtotal) {
                            hasSetItem = true;
                        }
                    }

                    window.opener.postMessage(
                        {
                            type: "meisaiJudge",
                            denpyoNo,
                            isAllMatch,
                            hasSetItem
                        },
                        "*"
                    );
                    closeWindowOnce();
                }

                setInterval(checkMeisaiTable, 1000);
            }
        });
    }

    if (window.opener && window.name === "denpyoJoukenCheckWindow") {
        childWindowWatcher();
    }

    function setupHelpIcon() {
        const headTr = document.getElementById(headerTrId);
        if (!headTr) return;
        const ths = headTr.querySelectorAll('td,th');
        let lastTh = ths[ths.length - 1];

        if (lastTh.querySelector('.help-icon-btn')) return;

        const helpBtn = document.createElement('button');
        helpBtn.className = 'help-icon-btn';
        helpBtn.innerText = '？';

        helpBtn.style.background = 'none';
        helpBtn.style.border = 'none';
        helpBtn.style.color = '#2b2b2b';
        helpBtn.style.fontWeight = 'bold';
        helpBtn.style.cursor = 'pointer';
        helpBtn.style.padding = '0 6px 0 4px';
        helpBtn.style.verticalAlign = 'middle';
        helpBtn.title = 'この列の説明を見る';
        helpBtn.style.width = "auto";
        helpBtn.style.minWidth = "unset";
        helpBtn.style.maxWidth = "unset";
        helpBtn.style.setProperty("width", "auto", "important");
        helpBtn.style.setProperty("min-width", "unset", "important");
        helpBtn.style.setProperty("max-width", "unset", "important");

        helpBtn.onclick = function(e) {
            e.stopPropagation();
            showBanner(
                `<strong>同梱候補判定の操作説明</strong><br>
        ・この列のボタンで各伝票の同梱条件チェックを実行します<br>
        ・ボタンの色は状態を示します（赤:NG、緑:OK、黄色:要確認）<br>
        ・すべてOKだと実行ボタンの使用が可能になります<br>
        ・Ctrlを押しながら「強制実行」を使うと条件未クリアでも実行可能です（慎重にご利用ください）<br>
        <span style="color:#aaa;">
            ※詳しい使い方は
            <a href="https://example.com/manual" target="_blank" style="color:#aaf;text-decoration:underline;">こちら</a>
            を参照してください
        </span>`
    );
        };

        lastTh.appendChild(helpBtn);
    }

    setInterval(() => {
        resizeColumn();
        updateRows();
        setupHelpIcon();
    }, 1000);

})();