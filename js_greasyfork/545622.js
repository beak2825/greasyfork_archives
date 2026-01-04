// ==UserScript==
// @name         りりあんデリーパネル
// @name:zh-CN   莉莉天使每日自动化面板
// @name:en      Lilyan Daily Automation Panel
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  とあるゲームのデリータスク自動完成パネル
// @description:zh-CN  莉莉天使自动完成每日任务面板
// @description:en  Liliange daily task automation panel
// @author       ぷにふく
// @license      CC-0
// @icon         https://lilyange.wikiru.jp/image/pukiwiki.png
// @match        https://lilyange.saikyo.biz/app_data/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545622/%E3%82%8A%E3%82%8A%E3%81%82%E3%82%93%E3%83%87%E3%83%AA%E3%83%BC%E3%83%91%E3%83%8D%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/545622/%E3%82%8A%E3%82%8A%E3%81%82%E3%82%93%E3%83%87%E3%83%AA%E3%83%BC%E3%83%91%E3%83%8D%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isLoggedIn = false;
    let queryParams = {
        opensocial_viewer_id: null,
        session_id: null,
        os: null
    };

    // 元のfetch参照を保存
    const originalFetch = window.fetch;

    // 	fetchメソッドをオーバーライド
    window.fetch = async function(input, init) {
        // console.debug(`[Daily Automation] fetch rewrite. v1.2`)
        // 	URLを取得する完全なロジック
        const url = (typeof input === 'string') ? input : input.url;
        const request = new Request(input, init);

        // 対象ドメインのリクエストのみ処理
        if (url.includes('lilyange.saikyo.biz/login')) {
            try {
                const response = await originalFetch.apply(this, arguments);
                const clone = response.clone();

                // URLパラメータを解析しようと試みる
                try {
                    const urlObj = new URL(url);
                    const params = urlObj.searchParams;

                    // クエリパラメータを更新
                    if (params.has('opensocial_viewer_id')) {
                        queryParams.opensocial_viewer_id = params.get('opensocial_viewer_id');
                    }
                    if (params.has('session_id')) {
                        queryParams.session_id = params.get('session_id');
                    }
                    if (params.has('os')) {
                        queryParams.os = params.get('os');
                    }

                    // ログイン済みかどうかを確認
                    if (queryParams.opensocial_viewer_id && queryParams.session_id) {
                        isLoggedIn = true;
                        console.log('[LilyDailyAuto] fetch: ログインパラメータをキャプチャしました', queryParams);
                    }
                } catch (e) {
                    console.error('[LilyDailyAuto] fetch: URL解析エラー: ', e);
                }

                return response;
            } catch (error) {
                console.error('[LilyDailyAuto] fetch: Fetchリクエスト失敗:', error);
                return originalFetch.apply(this, arguments);
            }
        }

        // 対象外ドメインのリクエストは直接返す
        return originalFetch.apply(this, arguments);
    };

    // ページにスタイルを追加
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #automationPanel {
                position: fixed;
                top: 50%;
                right: 0;
                transform: translateY(-50%);
                background: rgba(40, 44, 52, 0.9);
                border: 1px solid #61afef;
                border-radius: 5px 0 0 5px;
                padding: 10px;
                z-index: 9999;
                box-shadow: -2px 2px 10px rgba(0,0,0,0.5);
                color: #abb2bf;
                font-family: Arial, sans-serif;
                min-width: 180px;
                max-width: 180px;
            }
            #automationPanel h3 {
                margin: 0 0 10px 0;
                padding-bottom: 5px;
                border-bottom: 1px solid #61afef;
                color: #e5c07b;
                text-align: center;
            }
            .automation-btn {
                display: block;
                width: 100%;
                padding: 8px;
                margin: 5px 0;
                background: #282c34;
                color: #98c379;
                border: 1px solid #61afef;
                border-radius: 3px;
                cursor: pointer;
                text-align: center;
                transition: all 0.3s;
            }
            .automation-btn:hover {
                background: #2c313c;
                color: #e06c75;
            }
            .status-log {
                margin-top: 10px;
                max-height: 150px;
                overflow-y: auto;
                font-size: 12px;
                border-top: 1px solid #3b4048;
                padding-top: 5px;
            }
            .log-entry {
                margin-bottom: 3px;
                padding: 2px;
                border-radius: 2px;
            }
            .log-success {
                color: #98c379;
            }
            .log-error {
                color: #e06c75;
            }
            .log-info {
                color: #61afef;
            }
        `;
        document.head.appendChild(style);
    }

    // コントロールパネルを作成
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'automationPanel';
        panel.innerHTML = `
            <button id="runDailyBtn" class="automation-btn">デイリータスク</button>
            <button id="harvestBtn" class="automation-btn">植物園を収穫</button>
            <button id="receiveMissionBtn" class="automation-btn">報酬受け取る</button>
            <div class="status-log" id="statusLog"></div>
        `;
        document.body.appendChild(panel);
        return panel;
    }

    // 初期化完了後に実行
    function init() {
        addStyles();
        const panel = createControlPanel();
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'p') {
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            }
        });
        const statusLog = document.getElementById('statusLog');

        // ログ記録
        function logMessage(message, type = 'info') {
            const logEntry = document.createElement('div');
            logEntry.className = `log-entry log-${type}`;
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            statusLog.appendChild(logEntry);
            statusLog.scrollTop = statusLog.scrollHeight;
        }

        // ゲームリクエスト送信の汎用関数
        async function sendGameRequest(endpoint, method = 'GET', data = null, extraParams = null) {
            if (!isLoggedIn || !queryParams.opensocial_viewer_id || !queryParams.session_id) {
                throw new Error('ユーザーがログインしていないか、必要なパラメータが不足しています');
            }

            // 基本パラメータと追加パラメータを結合
            const allParams = {
                ...extraParams,
                opensocial_viewer_id: queryParams.opensocial_viewer_id,
                session_id: queryParams.session_id,
                os: queryParams.os || '1'
            };

            // URLSearchParamsオブジェクトを作成してクエリパラメータを処理
            const urlParams = new URLSearchParams(allParams);
            const url = `https://lilyange.saikyo.biz${endpoint}?${urlParams.toString()}`;

            console.log(`[LilyDailyAuto] ${method} ${url}`, data);

            const requestOptions = {
                method: method,
                headers: {}
            };

            if (method !== 'GET' && data) {
                const formData = new URLSearchParams();
                for (const key in data) {
                    formData.append(key, data[key]);
                }
                requestOptions.body = formData.toString();
                requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            try {
                const response = await fetch(url, requestOptions);
                const rawText = await response.text();

                let decodedText;
                try {
                    decodedText = decodeURIComponent(rawText);
                } catch (e) {
                    decodedText = rawText;
                    console.warn(`[LilyDailyAuto] URIデコード失敗: ${e.message}`);
                }

                const jsonResponse = JSON.parse(decodedText);

                if (response.ok) {
                    return jsonResponse;
                } else {
                    console.error(`[LilyDailyAuto] リクエスト失敗: ${response.status} - ${decodedText}`)
                    throw new Error(`リクエスト失敗: ${response.status} - ${decodedText}`);
                }
            } catch (error) {
                console.error(`[LilyDailyAuto] ${endpoint} リクエスト失敗: ${error.message}`)
                logMessage(`${endpoint} リクエスト失敗: ${error.message}`, 'error');
                throw error;
            }
        }


        // 全てのミッション報酬を受け取る
        async function receiveAllMissions() {
            try {
                await sendGameRequest('/mission_index', 'POST', {category: 1, stage_id: 0});
                await sendGameRequest('/mission_receive', 'POST', {id: "all"});
            } catch (error) {
                throw error;
            }
        }

        // スキップする
        async function sweepQuest(stageId, times) {
            try {
                return await sendGameRequest('/quest_skip', 'POST', {
                    num: times,
                    select_party_num: 1,
                    stage_id: stageId
                });
            } catch (error) {
                throw error;
            }
        }

        // 植物園を収穫する
        async function harvestPlant() {
            try {
                const plants = await sendGameRequest('/plant_index', 'POST', {});
                const plantNum = plants?.plant_canvas?.plant_harvest_num;
                const plantNumMax = plants?.plant_canvas?.plant_harvest_max_num;
                if (plantNum) {
                    await sendGameRequest('/harvest', 'POST', {harvest_type: 2});
                }
                logMessage(`植物園で${plantNum}/${plantNumMax}回収穫しました`);
                return;
            } catch (error) {
                throw error;
            }
        }

        // 	デイリーギフトを受け取る
        async function receiveDailyGift() {
            return;
            // TODO: ショップに全部たまっている無料をチェックする

            const index = await sendGameRequest('/shop_index', 'GET');

            await sendGameRequest('/shop_buy', 'GET', null, {shopid: 15, num: 1});
        }

        // 	デイリークエストをスキップする
        async function sweepDaily() {
            const QUEST_DAILY_EXP_LV8 = 30011010;
            const QUEST_DAILY_LUNA_LV8_DEFENDER = 30021001
            const QUEST_DAILY_LUNA_LV8_STRIKER = 30022010;
            const QUEST_DAILY_LUNA_LV8_SHOOTER = 30023010;
            const QUEST_DAILY_LUNA_LV8_MAGICIAN = 30024010;
            const QUEST_DAILY_LUNA_LV8_ASSISTER = 30025010;
            const quest_luna_today = [QUEST_DAILY_LUNA_LV8_DEFENDER,
                                 QUEST_DAILY_LUNA_LV8_STRIKER,
                                 QUEST_DAILY_LUNA_LV8_SHOOTER,
                                 QUEST_DAILY_LUNA_LV8_MAGICIAN,
                                 QUEST_DAILY_LUNA_LV8_ASSISTER]
            [+`${new Date().getFullYear()}${new Date().getMonth()+1}${new Date().getDate()}` % 5]
            const QUEST_DAILY_EQUIP_LV8 = 30031010;
            const QUEST_DAILY_STELLA_LV8 = 30041010;
            try {
                const daily_index = await sendGameRequest('/daily_quest_index', 'POST');
                const exp_rest_count = daily_index.daily_quest_canvas?.chapter_list?.["3001"]?.rest_play_count
                const luna_rest_count = daily_index.daily_quest_canvas?.chapter_list?.["3002"]?.rest_play_count
                const equip_rest_count = daily_index.daily_quest_canvas?.chapter_list?.["3003"]?.rest_play_count
                const stella_rest_count = daily_index.daily_quest_canvas?.chapter_list?.["3004"]?.rest_play_count
                if (exp_rest_count) { await sweepQuest(QUEST_DAILY_EXP_LV8, exp_rest_count); }
                if (luna_rest_count) { await sweepQuest(quest_luna_today, luna_rest_count); }
                if (equip_rest_count) { await sweepQuest(QUEST_DAILY_EQUIP_LV8, equip_rest_count); }
                if (stella_rest_count) { await sweepQuest(QUEST_DAILY_STELLA_LV8, stella_rest_count); }
                logMessage(`デイリー完了、${exp_rest_count};${luna_rest_count};${equip_rest_count};${stella_rest_count}回スキップしました`);

            } catch (error) {
                throw error;
            }
        }

        // メインクエストをスキップする
        async function sweepMain(main_quest_id) {
            try {
                const detail_index = await sendGameRequest('/quest_detail', 'GET', null, {"quest_stage_id": main_quest_id});
                const lastStamina = detail_index?.user_data?.stamina || NaN;
                const spendStamina = detail_index?.quest_detail_canvas?.quest_detail?.use_stamina || NaN;
                const sweepTimes = Math.floor(lastStamina / spendStamina) || 0;
                if (sweepTimes) { await sweepQuest(main_quest_id, sweepTimes); }
                logMessage(`メインクエスト完了、${sweepTimes}回スキップしました`);
            } catch (error) {
                throw error;
            }
        }

        // 	アップグレードなど
        async function upgrades(chara_tolvl_id=null, chara_toaff_id=null, equip_id=null, equip_number=null) {
            if (!chara_tolvl_id || !chara_toaff_id || !equip_id || !equip_number) {
                const index = await sendGameRequest("/character_index", "GET");
                if (!chara_tolvl_id || !chara_toaff_id) {
                    for (const chara of index?.character_index_canvas?.user_character_list || []) {
                        if (!chara_tolvl_id && chara.next_level_exp) {
                            chara_tolvl_id = chara.m_character_id;
                            logMessage(`${chara.name}のレベルアップを試みる`, "info");
                        }
                        if (!chara_toaff_id && chara.next_affinity_exp) {
                            chara_toaff_id = chara.m_character_id;
                            logMessage(`${chara.name}の親密度アップを試みる`, "info");
                        }
                        if (chara_tolvl_id && chara_toaff_id) {
                            break;
                        }
                    }
                }
                let equip_blank;
                if (!equip_id || !equip_number) {
                    for (const equip of index?.character_index_canvas?.user_equipment_list || []) {
                        if (equip.current_level < equip.max_level) {
                            equip_blank = equip
                            if (equip.current_level != 1) {
                                equip_id = equip.equipment_id;
                                equip_number = equip.equipment_number;
                                logMessage(`装備${equip.name}のレベルアップを試みる`, "info");
                                break;
                            }
                        }
                    }
                    if (!equip_id || !equip_number) {
                        if (equip_blank) {
                            equip_id = equip_blank.equipment_id;
                            equip_number = equip_blank.equipment_number;
                            logMessage(`アップグレード済み装備が見つかりません。新品装備をアップグレードします${equip_blank.name}(${equip_blank.equipment_number})`, "info");
                        }
                    }
                }
            }

            if (chara_tolvl_id) {
                await sendGameRequest("/character_level_up", "POST", {
                    "1001": 1,
                    "character_id": chara_tolvl_id
                })
            } else {
                logMessage("レベルアップ可能なキャラクターが見つかりません", "error")
            }

            if (chara_toaff_id) {
                await sendGameRequest("/character_affinity_level_up", "POST", {
                    "2001": 1,
                    "character_id": chara_toaff_id
                })
            } else {
                logMessage("親密度アップ可能なキャラクターが見つかりません", "error")
            }

            if (equip_id && equip_number) {
                await sendGameRequest("/equipment_level_up", "POST", {
                    "equipment_id": equip_id,
                    "equipment_number": equip_number,
                    "item3001": 1,
                    "item3002": 0,
                    "item3003": 0
                })
            } else {
                logMessage("レベルアップ可能な装備が見つかりません", "error")
            }
        }

        // 一連のデイリータスクを実行
        async function runDailyTasks() {
            if (!isLoggedIn) {
                logMessage('まずゲームにログインしてください', 'error');
                return;
            }
            const QUEST_MAIN_3_10_HARD = 1032010;

            logMessage('デイリータスクの実行を開始しています......', 'info');

            try {
                await receiveAllMissions(); // 	追加スタミナを受け取る
                await sweepMain(QUEST_MAIN_3_10_HARD); // メインクエストで全てのスタミナを消費
                await sweepDaily(); // デリースキップ
                await harvestPlant(); // 収穫
                // await receiveDailyGift(); // ショップデリー
                await upgrades(); // キャラクターと装備をアップグレード
                await receiveAllMissions(); // デイリーミッション報酬
                await receiveAllMissions(); // デイリー達成数の報酬を受け取る
                logMessage('全てのデイリータスクが完了しました！', 'success');
            } catch (error) {
                logMessage('タスク実行中断: ' + error.message, 'error');
            }
        }

        // ボタンイベントをバインド
        document.getElementById('runDailyBtn').addEventListener('click', runDailyTasks);
        document.getElementById('harvestBtn').addEventListener('click', harvestPlant);
        document.getElementById('receiveMissionBtn').addEventListener('click', receiveAllMissions);

        // 初期ログ
        logMessage('ゲームログインを待機中...', 'info');
        (async () => {
            const checkInterval = setInterval(() => {
                if (isLoggedIn) {
                    logMessage(`ログイン済み、ユーザーID: ${queryParams.opensocial_viewer_id}`, 'success');
                    clearInterval(checkInterval); // ログイン成功後にタイマーをクリア
                }
            }, 1000); // 1秒ごとにチェック
        })();
    }

    // DOMの読み込み完了を待って初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();