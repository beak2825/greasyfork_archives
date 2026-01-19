// ==UserScript==
// @name          Open2ch NG Word Akuton dev
// @namespace     https://greasyfork.org/ja/users/864059
// @version       1.9.8
// @description   Open2chでNGワード/ネーム/行数/IDもしくはL指定で自動アク禁。権限切れ・他者アク禁検知で、賢く安全に送信を制御（タイトル指定で自動起動）。
// @author        七色の彩り
// @match         https://*.open2ch.net/test/read.cgi/*
// @icon         https://open2ch.net/favicon.ico
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_info
// @exclude       https://open.open2ch.net/test/ad.cgi/*
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/538807/Open2ch%20NG%20Word%20Akuton%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/538807/Open2ch%20NG%20Word%20Akuton%20dev.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = 'BBS_NG_Akuton';
    const SCRIPT_VERSION = (typeof GM_info !== 'undefined' && GM_info.script.version)
    ? GM_info.script.version
    : 'Unknown';
    let scriptInitialized = false; // スクリプトが現在「実行中」かどうか
    let currentObserver = null; // 投稿監視用のメインObserver
    let activeConfigId = null; // 現在起動している設定のID
    let akuAttemptConsecutiveFailures = 0; // アク禁試行の連続失敗回数
    let COMMAND_SEND_DELAY_MS = 0;
    const MAX_AKU_ATTEMPTS_BEFORE_STOP = 3; // スクリプト停止までの最大連続失敗回数
    const AKU_DOM_REFLECT_TIMEOUT = 5000; // 自分の投稿が赤文字になるのを待つ最大時間 (5秒)

    const RAPID_POST_THRESHOLD_COUNT = 2; // 許容する連投回数（この回数を超えるとNG）
    const RAPID_POST_THRESHOLD_TIME_MS = 1000; // 判定する時間枠 (ミリ秒) = 1秒
    const RAPID_POST_HISTORY_CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 投稿履歴のクリーンアップ間隔 (5分)

    // === IDごとの連続アク禁に関する設定 ===
    const RECENTLY_AKUED_ID_THRESHOLD_TIME_MS = 30 * 1000; // 30秒間は同じIDをアク禁しない
    const AKU_ID_CLEANUP_INTERVAL_MS = 30 * 1000; // 30秒ごとにrecentlyAkuedIDsをクリーンアップ

    // 各ユーザーIDの投稿タイムスタンプ履歴を保存するMap
    // 例: Map<string, number[]> (UID, [timestamp1, timestamp2, ...])
    const userPostTimestamps = new Map();

    let cleanupTimer = null; // クリーンアップ用のタイマーID

    // Open2chのデフォルトネームを捉える正規表現 ('名無し', '名無しさん@おーぷん', '名無しさん', '名無し▼副' などに対応)
    // 1. (名無し|名無しさん@おーぷん|名無しさん|名無し▼副) に完全一致
    // 2. あるいは「新年まで＠」「あけおめ＠」で始まる名前に一致
    const DEFAULT_NAMES_REGEX = /^(名無し|名無しさん@おーぷん|名無しさん|名無し▼副|新年まで＠.*|あけおめ＠.*)$/;

    // Open2chのホスト名パターンリスト (正規表現を使用)
    // Open2chのサブドメインを柔軟にマッチさせるため、正規表現を使用
    const OPEN2CH_HOSTNAME_PATTERNS = [
        /^\w+\.open2ch\.net$/,// '*.open2ch.net' の形式 (例: 'uni.open2ch.net', 'hayabusa.open2ch.net' など)
    ];

    // processingQueue: Map<postNumber, { type: string, targetPostNumber: number, timestamp: number, target: string, value: string|number, timerId: number }>
    const processingQueue = new Map(); // aku送信の処理待ちキュー (タイマーIDも保存)

    let globalAkuCommandQueue = []; // アク禁コマンド専用のグローバルキュー
    let isGlobalAkuQueueProcessing = false; // アク禁キューが現在処理中かどうかのフラグ
    const AKU_POST_GLOBAL_INTERVAL = 1000; // !aku コマンド投稿間隔 (ミリ秒) - 必要に応じて調整、実質不要
    // 直近でアク禁したIDを記録するMap<ID, 最終アク禁タイムスタンプ>
    const recentlyAkuedIDs = new Map();
    // recentlyAkuedIDs をクリーンアップするためのタイマー
    let akuIdCleanupTimer = null;

    let config = {}; // configオブジェクトをここで宣言

    let lastProcessedVal = 0; // 最後に処理した投稿番号 (主にログ出力用)
    let processedPostNumbers = new Set(); // 処理済みの投稿番号を追跡するSet (既にakuが送信された、または他者によってakuされた投稿)

    // --- ここからがユーザーが直接編集する可能性のある設定部分 ---

    // ★ユーザー編集ポイント: 共通のNGワードリストをここで定義
    const rawConfig = {
        COMMON_NG_WORDS: [
            'ニャイル大佐◆8oODN/jZ8.', '毎日何度もサーバーエラー','地獄の責め苦に遭え','毎日何度も理不尽に弾かれる','違法な書き込みを何年も放置',
            '管理人が気に入らないスレやレス','❌Open2ch',/(この板は現在、お休み中です).*?\1/,
            /(?=.*さとる)(?=.*(?:ボコボコ|半殺し|カタワ|偽管理人|屠殺されろ|惨殺されろ|虐殺されろ|死ね))/,
            'Puyuyu。', 'ぷゆゆ', 'ハジハジ', 'プユユ', 'はじはじ','大家都是',
            '🤲🥺', 'てんりわう', '┗😎┛', '┏🥺┓', '✋🥺🤚', '将棋・初段ワイ','悪しきを払うて','天理王命','あしきをはらうて', // 不定期コピペ爆撃
            '☯︎(ᗜ‸ᗜ)☯︎', '(o^ω^n)', '(o\'ω\'n)', '(I can\\\'t breathe[\\!\\?\\s]*){2,}',
            'ttoonlfnjj','y_u_i0815','hyedd_5','6zX345jwL9SGkSG','poop_147','persimmon777', 'YJSNPIisGirl',// ガチグロXのID
            'JP88y', 'tea166', 'linlin00er','𝓙𝓟88y', 'ID:ce6n','@374pgdcm','@696vbulv','cq1w','do261','189ka',// 業者スパムID
            /L ?I ?N ?E→/, // LINEの間に半角スペースが入るパターンも考慮
            '気軽にDMしてね','LINEで公開💋','続きはLINEで💋','我慢できないほど濡れる体験','ここには書けない濃厚なオプション','甘く痺れる刺激を求めるならLINEで',
            'LINEで秘密の詳細を教えちゃう','まずはLINEでお話ししませんか',
            /(Telegram.*Gleezy|Gleezy.*Telegram)/, // TelegramとGleezyが同時に含まれる場合
            'douxnavi',//たまに同人ナビスパム
            'いひーーーー','いっひっひーーーー',
            '非国民火垂る見ろ','Te-l-eg.ram','Tel-e.gr.-am','すいげつデリヘル',
            '神宗教を世界中に撒こう！','小野真琴','高津レジデンス403号室','NnVkhTx',
            '蛇が我が災いとなろうとは','獣たちの間で朽ち果てる',
            /俺[\s\S]*俺[\s\S]*真夏[\s\S]*Jamboree[\s\S]*砂浜[\s\S]*Big\s*Wave[\s\S]*Weekend/,
            'hogehogengtest',//テスト用
        ],
            COMMON_NG_IDS: [
            'ID:AB:CD:L123','ID:ABCD','ID:Wb.cw.L2',// 例: ここにすべての共通NG IDを記述
        ],
        // ★ユーザー編集ポイント: 各スレッドのNGワード設定の定義
        NG_SETS: {
            'set1': {
                name: 'うんちワード設定',
                ngwords: [
                    /([うウｳ].{0,1}[んンﾝ].{0,1}(?:[ちチﾁ]|[こコｺ]))/,//「う○ん○こ」のような投稿に対応する正規表現
                    /^(う|ウ|ｳ)$/, // ← 1文字「だけ」の投稿に対応 頭文字
                    '💩', '🍦', //うんこ絵文字が含まれていると問答無用でaku
                ],
                excludeRegexes: [ // ここに除外したいワード・正規表現を追加
                    /う[ー～-]{0,2}ん(?:[、…\s]{1,2}|[、…\s]{0,2}こ(の|れ)|[、…\s]{0,2}こまっ|[、…\s]{0,2}困っ)/, //う～ん、これはといったワード回避
                    'ウィンチ','うんちく','ティンコ','ハロウィンコス','ウィンターコスモス','カウント','マウント',
                    /[ぁ-んァ-ヶ一-龯]{1,3}ちゃん/,//○○○ちゃん
                    // 固有名詞・キャラクター名・愛称
                    'あんこ','アンコ','いんこ','インコ',
                    'うんてる','ウンテル','うんし','ウンシ','うんじ','ウンジ','うんたら','ウンタラ',
                    'えんち','エンチ','けんち','ケンチ','こんち','コンチ','さんち','サンチ',
                    'しんち','シンチ','じんち','ジンチ','せんち','センチ','そんち','ソンチ',
                    'たんち','タンチ','でんち','デンチ','ひんち','ヒンチ','らんち','ランチ',
                    'れんち','レンチ','もんち','モンチ','りんち','リンチ','うんたん','ウンタン',
                    'ミンチ','パンチ','コンチータ','ギンチャク','サンチョ','うんたま','ウンタマ',
                    'うんちゅう','ウンチュウ','うんた','ウンタ',

                    // 一般的な単語・熟語・擬音
                    'うんざり','ウンザリ','うんどう','ウンドウ','うんめい','ウンメイ','うんえい','ウンエイ',
                    'うんこう','ウンコウ','うんぴつ','ウンピツ','うんぱん','ウンパン','うんちん','ウンチン',
                    'うんざん','ウンザン','うんせい','ウンセイ','うんよう','ウンヨウ','うんかい','ウンカイ',
                    'うんごく','ウンゴク','うんしゅう','ウンシュウ','うんがい','ウンガイ','うんかん','ウンカン',
                    'きんちゃく','キンチャク','けんちく','ケンチク','きんこ','キンコ','たんこ','タンコ',
                    'でんこ','デンコ','はんこ','ハンコ','ぱんち','パンチ','まんこい','マンコイ','りんご','リンゴ',
                    'ばんこ','バンコ','しんこ','シンコ','しんちゅう','シンチュウ','せんちゅう','センチュウ','センチ',
                    'がんこ','ガンコ','じんこ','ジンコ','はんち','ハンチ','さんち','サンチ','でんち',
                    'うんうん','ウンウン','だんご','こんご',
                ],
                ngnames: ['たぬきち▽副','💩','本綾','ゆうしゃ,LP','puyuyu',],
                nggyou: Infinity, //Infinityで指定無し
                akuDelayMs: 0 // ディレイ設定ミリ秒単位1000で1秒
            },
            'set2': {
                name: '花騎士スレ設定',
                ngwords: [],
                excludeRegexes: [ // ここに除外したいワード・正規表現を追加
                /うんちく/i,
            ],
                ngnames: ['堕異地', 'たぬきち▽副','本綾','ゆうしゃ,LP','puyuyu',], // 堕異地は花騎士まったり雑談スレ主という荒らし
                nggyou: Infinity,
                akuDelayMs: 0 // ディレイ設定ミリ秒単位
            },
            'set3': {
                name: '汎用設定',
                ngwords: [],
                excludeRegexes: [ // ここに除外したいワード・正規表現を追加
                 // 文字列もOK、compileConfigが正規表現に変換します
            ],
                ngnames: ['たぬきち▽副','本綾','ゆうしゃ,LP','puyuyu','自爆確認',],
                nggyou: Infinity,
                akuDelayMs: 0 // ディレイ設定ミリ秒単位
            },
        }
    };
    // ★ユーザー編集ポイント: スレッドタイトルと設定IDを紐付けるルール
    const AUTO_APPLY_RULES = {
        //'ガールズクリエイション': 'set1',
        'FLOWER KNIGHT GIRL': 'set2',
        //'ティンクルスターナイツ': 'set3',
        //'モンスター娘TD': 'set3',
        'コマンド確認':'set3',
    };

    // --- ここまでが設定部分 ---

    function cleanupUserPostTimestamps() {
        const now = Date.now();
        userPostTimestamps.forEach((timestamps, uid) => {
            // RAPID_POST_THRESHOLD_TIME_MS の2倍程度の期間を残すことで、
            // 判定時間枠外の古いデータも完全に削除されることを保証
            const filteredTimestamps = timestamps.filter(ts => now - ts < RAPID_POST_THRESHOLD_TIME_MS * 2);
            if (filteredTimestamps.length === 0) {
                userPostTimestamps.delete(uid);
            } else {
                userPostTimestamps.set(uid, filteredTimestamps);
            }
        });
        // 次のクリーンアップをスケジュール
        cleanupTimer = setTimeout(cleanupUserPostTimestamps, RAPID_POST_HISTORY_CLEANUP_INTERVAL_MS);
    }
    let compiledConfig = null; // コンパイルされた正規表現と結合された設定
    let currentConfig = null; // 現在適用されている設定

    /**
     * 設定をディープコピーするヘルパー関数
     * Infinityなどを正しくコピーするために手動で再帰的にコピーする
     * @param {*} obj - コピー元のオブジェクト
     * @returns {*} コピーされたオブジェクト
     */
    function deepCopy(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }

        if (obj instanceof RegExp) {
            return new RegExp(obj);
        }

        if (Array.isArray(obj)) {
            return obj.map(item => deepCopy(item));
        }

        const copy = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = deepCopy(obj[key]);
            }
        }
        return copy;
    }

    /**
     * 設定をコンパイルし、正規表現を準備する関数
     * rawConfigのCOMMON_NG_WORDSを各NGセットに結合するロジックも追加
     * @param {Object} rawConfigData - コンパイル前の設定データ
     * @returns {Object} コンパイルされた設定データ
     */
    function compileConfig(rawConfigData) {
        const compiled = {
            common: deepCopy(rawConfigData.common || {}),
            NG_SETS: {}
        };

        for (const setId in rawConfigData.NG_SETS) {
            const ngSet = deepCopy(rawConfigData.NG_SETS[setId]);

            if (rawConfigData.COMMON_NG_WORDS && rawConfigData.COMMON_NG_WORDS.length > 0) {
                ngSet.ngwords = [...new Set([...ngSet.ngwords, ...rawConfigData.COMMON_NG_WORDS])];
            }

            ngSet.compiledNgWords = ngSet.ngwords.map(word => {
                try {
                    return new RegExp(word, 'gis');
                } catch (e) {
                    console.error(`${SCRIPT_NAME}: NGワードの正規表現コンパイルエラー: ${word}`, e);
                    return null;
                }
            }).filter(Boolean);

            ngSet.compiledNgNames = ngSet.ngnames.map(name => {
                try {
                    return new RegExp(name, 'gi');
                } catch (e) {
                    console.error(`${SCRIPT_NAME}: NGネームの正規表現コンパイルエラー: ${name}`, e);
                    return null;
                }
            }).filter(Boolean);
            // 除外正規表現のリストをコンパイル
            ngSet.compiledExcludeRegexes = (ngSet.excludeRegexes || []).map(regex => {
            try {
                // 文字列の場合とRegExpオブジェクトの場合を考慮
                return regex instanceof RegExp ? regex : new RegExp(regex, 'gi');
            } catch (e) {
                console.error(`${SCRIPT_NAME}: 除外正規表現のコンパイルエラー: ${regex}`, e);
                return null;
            }
            }).filter(Boolean);

            console.log(`${SCRIPT_NAME}: セット「${ngSet.name}」のNGワードをコンパイルしました。`);
            compiled.NG_SETS[setId] = ngSet;
        }

        console.log(`${SCRIPT_NAME}: 全てのNG設定の正規表現をコンパイルしました。`);
        return compiled;
    }

    /**
     * 古いユーザー投稿履歴をクリーンアップします。
     * メモリ使用量を抑えるため、一定時間投稿のないユーザーの履歴を削除します。
     */
    function cleanUpOldPostTimestamps() {
        const currentTime = Date.now();
        // 判定時間枠の3倍（RAPID_POST_THRESHOLD_TIME_MS * 3）より古い履歴を削除する目安。これは調整可能。
        const expirationTime = currentTime - (RAPID_POST_THRESHOLD_TIME_MS * 3);

        // Mapをイテレートしながら、古いエントリを削除
        for (const [userId, timestamps] of userPostTimestamps.entries()) {
            // 現在時刻から閾値時間以上経過している投稿履歴がないユーザーは削除
            // あるいはtimestamps配列が空の場合も削除
            if (timestamps.length === 0 || timestamps[timestamps.length - 1] < expirationTime) {
                userPostTimestamps.delete(userId);
                // console.log(`${SCRIPT_NAME}: クリーンアップ: ${userId} の投稿履歴を削除しました。`); // デバッグ用、運用時はコメントアウト推奨
            }
        }
    }

    /**
     * UI要素の表示状態を更新する関数
     */
    function updateControlUI() {
        const statusDisplay = document.getElementById('akutonStatusDisplay');
        const controlPanel = document.getElementById('akutonControlPanel');
        const startButton = document.getElementById('akutonStartButton');
        const stopButton = document.getElementById('akutonStopButton');
        const configDropdown = document.getElementById('akutonConfigDropdown');

        // ステータス表示の更新
        if (scriptInitialized) {
            statusDisplay.innerHTML = `<span style="color: rgba(0, 0, 0, 0.7);">${SCRIPT_NAME}:</span> <span style="color: green; font-weight: bold;">実行中</span> <span style="color: rgba(0, 0, 0, 0.7);">(${currentConfig ? currentConfig.name : '未選択'})</span>`;
            statusDisplay.style.cursor = 'pointer'; // クリック可能であることを示す
        } else {
            statusDisplay.innerHTML = `<span style="color: rgba(0, 0, 0, 0.7);">${SCRIPT_NAME}:</span> <span style="color: red; font-weight: bold;">停止中</span> <span style="color: rgba(0, 0, 0, 0.7);">(${currentConfig ? currentConfig.name : '未選択'})</span>`;
            statusDisplay.style.cursor = 'pointer'; // クリック可能であることを示す
        }

        // コントロールパネルの表示/非表示を初期化
        // 起動時は常に最小表示にする
        if (scriptInitialized) {
            controlPanel.style.display = 'none';
        } else {
            // スクリプト停止時は、起動時はパネル非表示、手動停止時はパネル表示を維持
            // ここでは初期ロード時を想定し、非表示でスタート
            controlPanel.style.display = 'none'; // 通常は非表示
            startButton.style.display = 'inline-block';
            stopButton.style.display = 'none';
            configDropdown.style.display = 'block'; // 停止中はドロップダウンを表示
        }
        //console.log(`${SCRIPT_NAME}: UIの状態を更新しました。`);
    }

    /**
     * UI要素（ボタン、ステータス表示）を追加する関数
     */
    function addStartButtons() {
        let container = document.getElementById('akutonUIContainer');
        if (container) {
            return;
        }

        container = document.createElement('div');
        container.id = 'akutonUIContainer';
        container.style.cssText = `
            position: fixed;
            top: 1px;
            right: 10px;
            z-index: 9999;
            font-size: 12px;
            border: 0.1px solid rgb(204, 204, 204);
            border-radius: 3px;
            opacity: 0.9;
        `;
        document.body.appendChild(container);

        // --- ステータス表示部分（クリックで展開/格納） ---
        const statusDisplay = document.createElement('div');
        statusDisplay.id = 'akutonStatusDisplay';
        statusDisplay.style.cssText = `
            background-color: rgba(255, 255, 255, 1);
            color: black;
            padding: 5px 8px;
            white-space: nowrap;
            cursor: pointer; /* クリック可能であることを示す */
            transition: background-color 0.2s ease;
        `;
        // クリックイベントリスナーを追加
        statusDisplay.onclick = () => {
            const controlPanel = document.getElementById('akutonControlPanel');
            const startButton = document.getElementById('akutonStartButton');
            const stopButton = document.getElementById('akutonStopButton');
            const configDropdown = document.getElementById('akutonConfigDropdown');

            if (controlPanel.style.display === 'none') {
                // パネルを展開
                controlPanel.style.display = 'flex'; // flex-direction: column のため flex にする
                if (scriptInitialized) { // 実行中の場合は停止ボタンを表示
                    startButton.style.display = 'none';
                    stopButton.style.display = 'inline-block';
                    configDropdown.style.display = 'none'; // 実行中は設定変更をさせない（停止してから）
                } else { // 停止中の場合は起動ボタンと設定ドロップダウンを表示
                    startButton.style.display = 'inline-block';
                    stopButton.style.display = 'none';
                    configDropdown.style.display = 'block';
                }
            } else {
                // パネルを格納
                controlPanel.style.display = 'none';
            }
        };
        container.appendChild(statusDisplay);

        // --- コントロールパネル部分（最初は非表示） ---
        const controlPanel = document.createElement('div');
        controlPanel.id = 'akutonControlPanel';
        controlPanel.style.cssText = `
            display: none; /* 初期状態では非表示 */
            background-color: rgba(255, 255, 255, 1);
            padding: 8px;
            border-radius: 0 0 3px 3px;
            margin-top: 0px; /* ステータス表示との間隔 */
            flex-direction: column; /* ボタンを縦に並べる */
            gap: 5px; /* 要素間のスペース */
        `;
        container.appendChild(controlPanel);

        // 停止ボタン (実行中の場合)
        const stopButton = document.createElement('button');
        stopButton.id = 'akutonStopButton';
        stopButton.textContent = '停止';
        stopButton.style.cssText = `
            background-color: #f44336;
            color: white;
            padding: 4px 8px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            width: 100%; /* 親要素に合わせて幅を広げる */
        `;
        stopButton.onclick = () => {
            stopScript();
            // 停止後、パネルを再度更新して起動ボタンとドロップダウンを表示
            statusDisplay.click(); // パネルを再展開する（または自動的に展開した状態にする）
        };
        controlPanel.appendChild(stopButton);

        // 設定ドロップダウン
        const configDropdown = document.createElement('select');
        configDropdown.id = 'akutonConfigDropdown';
        configDropdown.style.cssText = `
            padding: 3px;
            border-radius: 3px;
            font-size: 11px;
            background-color: rgba(255, 255, 255, 0.9);
            color: black;
            border: 1px solid #ccc;
            width: 100%; /* 親要素に合わせて幅を広げる */
        `;
        for (const setId in compiledConfig.NG_SETS) {
            const option = document.createElement('option');
            option.value = setId;
            option.textContent = compiledConfig.NG_SETS[setId].name;
            configDropdown.appendChild(option);
        }
        controlPanel.appendChild(configDropdown);

        // 起動ボタン
        const startButton = document.createElement('button');
        startButton.id = 'akutonStartButton';
        startButton.textContent = '起動';
        startButton.style.cssText = `
            background-color: #4CAF50;
            color: white;
            padding: 4px 8px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            width: 100%; /* 親要素に合わせて幅を広げる */
        `;
        startButton.onclick = () => {
            const selectedConfigId = document.getElementById('akutonConfigDropdown').value;
            const selectedConfig = compiledConfig.NG_SETS[selectedConfigId];
            if (selectedConfig) {
                runScript(selectedConfig, selectedConfigId);
                // 起動したらパネルを閉じる
                controlPanel.style.display = 'none';
            } else {
                alert('設定を選択してください。');
            }
        };
        controlPanel.appendChild(startButton);
        const editConfigButton = document.createElement('button');
        editConfigButton.id = 'akutonEditConfigButton';
        editConfigButton.textContent = '設定編集';
        editConfigButton.style.cssText = `
            background-color: #2196F3; /* 青色 */
            color: white;
            padding: 4px 8px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 11px;
            width: 100%;
            margin-top: 5px; /* 他のボタンとの隙間 */
        `;
        editConfigButton.onclick = () => {
            openSettingsPage(); // 設定ページを開く関数（後述）を呼び出す
        };
        controlPanel.appendChild(editConfigButton);

        // 初期設定の選択
        if (Object.keys(compiledConfig.NG_SETS).length > 0) {
            configDropdown.value = Object.keys(compiledConfig.NG_SETS)[0];
        }

        updateControlUI(); // 初回表示の更新
    }

    /**
     * 設定編集ページを新しいタブで開く関数
     */
function openSettingsPage() {
        const settingsTab = window.open('about:blank', '_blank');
        if (!settingsTab) return;
        // 保存されている設定、またはデフォルト設定を取得
        // (まだGM_getValueを実装していない場合は一旦 rawConfig を使用)
        const currentData = rawConfig;
        // --- A. 共通設定セクションの作成 ---
        const commonHtml = `
            <section class="config-section">
                <h2>🌍 共通設定</h2>
                <div class="set-grid">
                    <div class="set-card common" onclick="alert('共通NGワード編集を開きます')">
                        <h3>共通NGワード</h3>
                        <p>${currentData.COMMON_NG_WORDS.length} 件</p>
                    </div>
                    <div class="set-card common" onclick="alert('共通NG ID編集を開きます')">
                        <h3>共通NG ID</h3>
                        <p>${currentData.COMMON_NG_IDS.length} 件</p>
                    </div>
                </div>
            </section>
        `;

        // NGセットのリストをHTML文字列として生成
        let setsHtml = '';
        for (const setId in currentData.NG_SETS) {
            const set = currentData.NG_SETS[setId];
            setsHtml += `
                <div class="set-card" onclick="alert('${set.name} の編集を開きます')">
                    <h3>${set.name} <span class="set-id">(${setId})</span></h3>
                    <p>NGワード: ${set.ngwords.length} 件 / 除外: ${set.excludeRegexes.length} 件</p>
                </div>
            `;
        }

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${SCRIPT_NAME} 設定</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; background-color: #f4f7f9; color: #333; line-height: 1.6; }
                    .container { max-width: 900px; margin: 0 auto; }
                    header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2196F3; margin-bottom: 30px; }
                    h2 { font-size: 1.2em; border-left: 4px solid #2196F3; padding-left: 10px; margin-top: 30px; }
                    .set-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; margin-top: 10px; }
                    .set-card { background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); cursor: pointer; border: 1px solid #ddd; }
                    .set-card:hover { border-color: #2196F3; background-color: #f0f8ff; }
                    .set-card.common { border-top: 4px solid #2196F3; }
                    .set-id { font-size: 0.8em; color: #888; font-weight: normal; }
                    h3 { margin: 0 0 10px 0; color: #333; }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <h1>⚙️ Akuton 設定管理</h1>
                        <div>ver ${SCRIPT_VERSION}</div>
                    </header>

                    ${commonHtml} <section class="config-section">

                    <h2>設定セット一覧</h2>
                        <h2>📋 各スレッド別設定</h2>
                        <div class="set-grid">
                            ${setsHtml}
                        </section>
                    </div>
                </div>
            </body>
            </html>
        `;

        settingsTab.document.open();
        settingsTab.document.write(html);
        settingsTab.document.close();
    }

    /**
     * スクリプトを停止する関数
     */
    function stopScript() {
        if (!scriptInitialized) {
            console.log(`${SCRIPT_NAME}: スクリプトは既に停止しています。`);
            return;
        }

        scriptInitialized = false;
        if (currentObserver) {
            currentObserver.disconnect();
            currentObserver = null;
            console.log(`${SCRIPT_NAME}: MutationObserverを停止しました。`);
        }
        if (cleanupTimer) { // Rapid Post History Cleanup Timer
            clearInterval(cleanupTimer);
            cleanupTimer = null;
            console.log(`${SCRIPT_NAME}: 高速連続投稿履歴のクリーンアップタイマーを停止しました。`);
        }

        // 処理待ちキュー内の全てのタイマーをクリア
        processingQueue.forEach(akuInfo => {
            if (akuInfo.timerId) {
                clearTimeout(akuInfo.timerId);
                console.log(`${SCRIPT_NAME}: タイマーID ${akuInfo.timerId} をクリアしました (Post No.${akuInfo.targetPostNumber})。`);
            }
        });
        processingQueue.clear();
        processedPostNumbers.clear();
        userPostTimestamps.clear(); // 投稿履歴もクリア

        akuAttemptConsecutiveFailures = 0;
        // currentConfigは停止しても直前の設定を記憶しておくことで、
        // 停止後にユーザーがどの設定で止まったのか視覚的にわかるようにする。
        // currentConfig = null; // 必要であればnullにする
        activeConfigId = null; // activeConfigIdはクリア
        updateControlUI();
        console.log(`${SCRIPT_NAME}: スクリプトが停止しました。`);
    }

    /**
     * 特定の投稿番号に対するアク禁報告メッセージがDOMを調べて確認する関数
     * @param {number} postNumber - 確認する投稿番号
     * @returns {boolean} アク禁報告メッセージが見つかった場合はtrue、そうでない場合はfalse
     */
    function isPostAlreadyAkuedOnDOM(postNumber) {
        // アク禁報告メッセージ（例: No.113）を探すロジックに特化
        const allDlElements = document.querySelectorAll('dl[val]');
        // 新しい投稿ほどアク禁メッセージの可能性が高いので、逆順で走査
        for (let i = allDlElements.length - 1; i >= 0; i--) {
            const dlElement = allDlElements[i];
            const currentPostNumber = parseInt(dlElement.getAttribute('val'), 10);
            if (isNaN(currentPostNumber)) continue;

            // ターゲット投稿番号より新しい投稿のみチェック
            // ただし、極端に新しい（例えば+100とか）投稿は通常のアク禁ではないと判断し、
            // 直近の投稿番号 (+50以内など) のみを対象とするなど、調整の余地あり。
            if (currentPostNumber > postNumber && currentPostNumber <= postNumber + 50) { // 例: 対象投稿番号から+50件以内をチェック
                const dd = dlElement.querySelector('dd.mesg.body');
                if (dd) {
                    const postText = dd.textContent.trim();
                    const akuSuccessMatch = postText.match(/★アク禁(?: \(副\))?：>>(\d+)/);
                    if (akuSuccessMatch && parseInt(akuSuccessMatch[1], 10) === postNumber) {
                        console.log(`${SCRIPT_NAME}: DOMチェック: No.${postNumber} に対する !aku メッセージ (No.${currentPostNumber}) が見つかりました。`);
                        return true;
                    }
                }
            } else if (currentPostNumber <= postNumber) {
                // 投稿番号が対象投稿番号以下になったら、それより古い投稿にはアク禁メッセージはないのでループを終了
                break;
            }
        }
        return false; // アク禁報告メッセージが見つからなかった
    }
    //recentlyAkuedIDs から古いIDを削除する関数
    function cleanUpRecentlyAkuedIDs() {
        const currentTime = Date.now();
        const idsToDelete = [];
        // console.log(`${SCRIPT_NAME}: DEBUG: recentlyAkuedIDs クリーンアップ実行前: ${recentlyAkuedIDs.size}個`);

        for (const [id, timestamp] of recentlyAkuedIDs.entries()) {
            if (currentTime - timestamp > RECENTLY_AKUED_ID_THRESHOLD_TIME_MS) {
                recentlyAkuedIDs.delete(id);
                // 期限切れでIDが削除された時はログを出しておくとデバッグ時に役立つ
                console.log(`${SCRIPT_NAME}: DEBUG: ID「${id}」の直近アク禁記録が期限切れのためクリーンアップで削除しました。`);
            }
        }
        // console.log(`${SCRIPT_NAME}: DEBUG: recentlyAkuedIDs クリーンアップ実行後: ${recentlyAkuedIDs.size}個`);
    }

    /**
     * アク禁を送信する関数 (async/await と fetch に変更)
     * @param {number} postNumber - アク禁対象の投稿番号 (originalTargetPostNumber に相当)
     * @param {string} akuType - アク禁の種類
     * @param {string} akuTarget - アク禁対象
     * @param {string|number} akuValue - アク禁の具体的な値
     * @returns {Promise<boolean>} 成功した場合は true、失敗した場合は false を返す
     */
    async function sendAku(postNumber, akuType, akuTarget, akuValue) {
        // アク禁送信直前の最終チェック (この部分は現状維持でOK)
        if (processedPostNumbers.has(postNumber)) {
            console.log(`${SCRIPT_NAME}: sendAku: 投稿番号 ${postNumber} は既に処理済みとして認識されています。 aku送信はスキップします。`);
            processingQueue.delete(postNumber); // キューから削除
            return true; // 処理済みなので成功とみなす
        }
        if (isPostAlreadyAkuedOnDOM(postNumber)) { // この関数も後でDOM変化の誤解が解消されれば不要になるかも
            console.log(`${SCRIPT_NAME}: sendAku: 投稿番号 ${postNumber} はDOM上で既にアク禁されています。 aku送信はスキップします。`);
            processedPostNumbers.add(postNumber); // 念のため処理済みに追加
            processingQueue.delete(postNumber); // キューから削除
            return true; // DOMで確認できたので成功とみなす
        }
        // sendAkuに渡された時点でprocessingQueueに存在するか確認
        // sendAkuが呼び出される直前で processingQueue.get(postNumber) が行われるので、ここでの追加チェックは冗長かもしれないが、念のため
        const akuInfo = processingQueue.get(postNumber);
        if (!akuInfo) {
            console.log(`${SCRIPT_NAME}: sendAku: 投稿番号 ${postNumber} のアク禁情報がキューに見つかりませんでした。他者によって処理済みと判断しスキップします。(最終チェック)`);
            return true; // キューにないなら、他者アク禁などで処理済みとみなし、送信しない
        }

        console.log(`${SCRIPT_NAME}: !aku送信実行: No.${postNumber} (${akuType}検知: ${akuTarget}=${akuValue})`);

        const currentOrigin = window.location.origin;
        const bbsCgiUrl = `${currentOrigin}/test/bbs.cgi`;

        const currentBBS = window.location.pathname.split('/')[3];
        const currentKey = window.location.pathname.split('/')[4].replace(/\/?l\d*$/, '');

        const akuMessage = `!aku${postNumber}`; // アク禁コマンドメッセージ

        let cmdValue = '';
        let modeValue = 'ajax'; // 通常投稿の mode は 'ajax' または 'regist' のまま
        let submitValue = '書';
        let lValue = '';

        const postData = new URLSearchParams({ // URLSearchParams を使用してデータをエンコード
            FROM: currentConfig.akutonName || '', // 名前は設定から
            mail: currentConfig.akutonMail || 'sage', // メールは設定から、またはsage
            sage: 1, // sageはそのまま
            ninja: 0, rating: 0, no_nusi: 1, // その他はそのまま
            MESSAGE: akuMessage, // ここに !aku コマンドを設定する
            bbs: currentBBS,
            key: currentKey,
            submit: submitValue,
            mode: modeValue,
            zitumeiMode: 0,
            timelineMode: 0, parent_pid: '', twfunc: 0, twid: 0, twsync: 0,
            oekakiMode: 0, oekakiData: ''
        });
        if (akuTarget === 'id') {
            postData.set('id', akuValue);
        } else if (akuTarget === 'name') {
            postData.set('FROM', akuValue); // 名前の場合はFROMを上書き
        }
        try {
            const response = await fetch(bbsCgiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': window.location.href // 現在のURLをRefererに設定
                },
                body: postData.toString(),
                credentials: 'include' // withCredentials: true に相当するが、fetch では 'include'/'same-origin'/'omit'
                // Open2chへの投稿は 'omit' にすると別人扱いとなるので人間性チェックに引っかかる
            });

            const responseText = await response.text();
            console.log(`${SCRIPT_NAME}: !aku送信リクエスト完了 (No.${postNumber}) - レスポンス受信。`);
            console.log(`${SCRIPT_NAME}: サーバーレスポンス:`, responseText); // responseオブジェクトではなくresponseTextをログに出す

            const akuSuccessResponseMatch = responseText.match(/success:(\d+)/);
            if (akuSuccessResponseMatch) {
                const ownPostNumber = parseInt(akuSuccessResponseMatch[1], 10);
                console.log(`${SCRIPT_NAME}: サーバーから自分の投稿番号を検知: ${ownPostNumber}`);

                // processingQueue 内の該当エントリを更新
                const akuInfo = processingQueue.get(postNumber); // キーはアク禁対象のpostNumber
                if (akuInfo) {
                    akuInfo.ownPostNumber = ownPostNumber; // 自分の投稿番号を保存
                    console.log(`${SCRIPT_NAME}: processingQueue (No.${postNumber}) の ownPostNumber を ${ownPostNumber} に更新しました。`);
                } else {
                    console.warn(`${SCRIPT_NAME}: エラー: No.${postNumber} のアク禁情報がキューに見つかりませんでした。`);
                }

                return true; // 成功
            } else {
                console.error(`${SCRIPT_NAME}: !aku送信に失敗しました (No.${postNumber})。サーバー応答が期待と異なります。`);
                akuAttemptConsecutiveFailures++;
                return false; // 失敗
            }
        } catch (error) {
            console.error(`${SCRIPT_NAME}: !aku送信中にエラーが発生しました (No.${postNumber}):`, error);
            akuAttemptConsecutiveFailures++;
            return false; // 失敗
        }
    }
    /**
     * アク禁コマンドをグローバルキューに追加し、送信処理を開始する
     * @param {number} postNumber - アク禁対象の投稿番号
     * @param {string} akuType - アク禁の種類
     * @param {string} akuTarget - アク禁対象
     * @param {string|number} akuValue - アク禁の具体的な値
     */
    function enqueueAkuCommandGlobally(postNumber, akuType, akuTarget, akuValue) {
        // ... enqueueAkuCommandGlobally のコード ...
        if (!scriptInitialized) {
            console.warn(`${SCRIPT_NAME}: グローバルアク禁キュー追加スキップ: スクリプトが停止中です (No.${postNumber})。`);
            return;
        }

        if (processedPostNumbers.has(postNumber)) {
            console.log(`${SCRIPT_NAME}: グローバルアク禁キュー追加スキップ: No.${postNumber} は既に処理済みです。`);
            return;
        }
        if (processingQueue.has(postNumber)) {
            console.log(`${SCRIPT_NAME}: グローバルアク禁キュー追加スキップ: No.${postNumber} は既に処理待ちキューに存在します。`);
            return;
        }

        // ここで処理中キューにも追加しておくことで、重複処理を避ける
        // ただし、タイマーIDはまだセットしない（グローバルキューが処理する）
        processingQueue.set(postNumber, {
            type: akuType,
            targetPostNumber: postNumber,
            originalTargetPostNumber: postNumber,
            timestamp: Date.now(),
            target: akuTarget,
            value: akuValue,
            ownPostNumber: null, // 自分の投稿番号。最初は不明なのでnull
            timerId: null // グローバルキューで処理されるため、ここではタイマーIDは不要
        });

        globalAkuCommandQueue.push({ postNumber, akuType, akuTarget, akuValue });
        console.log(`${SCRIPT_NAME}: グローバルアク禁キューに追加しました (No.${postNumber})。現在のキューサイズ: ${globalAkuCommandQueue.length}`);

        // キュー処理が開始されていない場合は開始する
        if (!isGlobalAkuQueueProcessing) {
            processGlobalAkuCommandQueue();
        }
    }


     //グローバルアク禁コマンドキューを処理する関数
    async function processGlobalAkuCommandQueue() {
        // ... processGlobalAkuCommandQueue のコード ...
        if (isGlobalAkuQueueProcessing) {
            // console.log(`${SCRIPT_NAME}: グローバルAKUキューは既に処理中です。`);
            return;
        }

        if (globalAkuCommandQueue.length === 0) {
            // console.log(`${SCRIPT_NAME}: グローバルAKUキューは空です。`);
            isGlobalAkuQueueProcessing = false;
            return;
        }

        isGlobalAkuQueueProcessing = true;
        console.log(`${SCRIPT_NAME}: グローバルAKUキュー処理中... 残り: ${globalAkuCommandQueue.length}`);

        const akuCommand = globalAkuCommandQueue.shift();
        const { postNumber, akuType, akuTarget, akuValue } = akuCommand;

        // COMMAND_SEND_DELAY_MS は runScript 関数で currentConfig.akuDelayMs から設定される想定
        if (COMMAND_SEND_DELAY_MS > 0) {
            console.log(`${SCRIPT_NAME}: !aku送信前に ${COMMAND_SEND_DELAY_MS}ms のディレイを適用中... (対象No.${postNumber})`);
        await new Promise(resolve => setTimeout(resolve, COMMAND_SEND_DELAY_MS));
        } else {
            console.log(`${SCRIPT_NAME}: !aku送信前にディレイなし (対象No.${postNumber})`);
        }
        if (isPostAlreadyAkuedOnDOM(postNumber)) {
            console.log(`${SCRIPT_NAME}: processGlobalAkuCommandQueue: No.${postNumber} はDOM上で既にアク禁されています。スキップします。`);
            processedPostNumbers.add(postNumber); // 念のため処理済みに追加
            processingQueue.delete(postNumber); // キューから削除 (他者アク禁によるものなので)
            isGlobalAkuQueueProcessing = false;
            processGlobalAkuCommandQueue();
            return;
        }

        // processingQueueに要素がまだ残っているか確認
        // (enqueueAkuCommandGloballyで追加されたものがここにあることを期待)
        const akuInfoInQueue = processingQueue.get(postNumber);
        if (!akuInfoInQueue) {
            console.log(`${SCRIPT_NAME}: processGlobalAkuCommandQueue: No.${postNumber} のアク禁コマンドは、既に他者によって処理済みであるためスキップします。`);
            isGlobalAkuQueueProcessing = false;
            processGlobalAkuCommandQueue();
            return;
        }

        try {
            // sendAku は async 関数になったので await を使う
            const success = await sendAku(postNumber, akuType, akuTarget, akuValue);
            // sendAku が成功したら、DOMでの確認は MutationObserver に任せるため、ここでは特に何もしない
            // sendAku 内で akuAttemptConsecutiveFailures が適切に処理されます。

        } catch (error) {
            console.error(`${SCRIPT_NAME}: sendAku呼び出し中にエラーが発生しました (No.${postNumber}):`, error);
            // エラーの場合もキューを停止させないようにする（連続失敗判定はsendAku内で行われる）
        } finally {
            // 成功/失敗に関わらず、次の処理まで待機し、キューの処理を再開
            setTimeout(() => {
                isGlobalAkuQueueProcessing = false;
                processGlobalAkuCommandQueue();
            }, AKU_POST_GLOBAL_INTERVAL);
        }
    }

     // 新しい投稿を処理し、NG判定を行う関数
    function handleNewPost(ddElement, postNumber) {
        if (!scriptInitialized) {
            console.log(`${SCRIPT_NAME}: handleNewPost: スクリプトが停止中のため、NG判定を行いません。`);
            return false;
        }

        if (processedPostNumbers.has(postNumber)) {
            return false;
        }
        if (isPostAlreadyAkuedOnDOM(postNumber)) {
            processedPostNumbers.add(postNumber);
            return false;
        }

        // --- 1. 投稿情報の取得 ---
        const dtElement = ddElement.previousElementSibling;
        let name = dtElement.querySelector('font.name')?.textContent.trim() || '';
        name = name.replace(/^↓/g, '').trim();
        const id = dtElement.querySelector('span._id')?.textContent.trim() || '';

        // 本文テキストのクリーンアップ
        let tempElement = ddElement.cloneNode(true);
        tempElement.querySelectorAll('url').forEach(urlTag => {
            const link = urlTag.querySelector('a');
            if (link && link.href) {
                urlTag.textContent = ' ' + link.href + ' ';
            } else {
                urlTag.textContent = '';
            }
        });
        tempElement.querySelectorAll('.lp-content').forEach(el => el.remove());
        const postText = tempElement.textContent.trim();
        const lines = postText.split('\n').filter(line => line.trim() !== '');

        // 投稿時刻取得
        let postTimestamp = null;
        let postTimeText = null;
        try {
            const dtText = dtElement.textContent;
            const timeRegex = /\d{2}:\d{2}:\d{2}/;
            const timeMatch = dtText.match(timeRegex);
            if (timeMatch) {
                postTimeText = timeMatch[0];
                const [hours, minutes, seconds] = postTimeText.split(':').map(Number);
                const now = new Date();
                postTimestamp = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds, 0);
                if (postTimestamp > now) postTimestamp.setDate(postTimestamp.getDate() - 1);
            }
        } catch (e) {
            console.error(`${SCRIPT_NAME}: 時刻のパースに失敗しました。`, e);
        }

        console.log(`${SCRIPT_NAME}: 新しい投稿を検知 (No.${postNumber}, 名前: ${name}, 投稿時刻: ${postTimeText}, ${id})`);
        console.log(`${SCRIPT_NAME}: DEBUG: No.${postNumber} - postText: "${postText}"`);

        // --- 2. 抽出・判定・実行ロジックの定義 ---
        const detectedUrls = new Set();

        const collectUrls = () => {
            detectedUrls.clear();

            ddElement.querySelectorAll('a, img, iframe').forEach(el => {
                let url = el.href || el.src || el.getAttribute('data-src');
                if (!url) return;

                // --- 1. 精密除外リスト ---
                // システム画像
                if (url.includes('image.open2ch.net')) return;
                // 空リンクやJS
                if (url === '#' || url.startsWith('javascript:')) return;
                // アンカーリンク(>>1)
                if (el.classList.contains('_ank') || el.classList.contains('ank')) return;

                // 【ここを修正】内部リンクの除外条件を細分化
                if (url.includes('open2ch.net')) {
                    // 以下の「機能系」は除外するが、make_thread.cgi（次スレ）などは除外しない
                    if (url.includes('/l10#') || url.includes('/anko/')) return;
                    // test/ の中でも、read.cgi や make_thread.cgi 以外（システム操作系など）を除外したい場合はここで絞る
                    // 今回は「make_thread.cgi」が含まれていれば許可する
                    if (url.includes('/test/') && !url.includes('make_thread.cgi') && !url.includes('read.cgi')) return;
                }

                if (url.startsWith('//')) url = 'https:' + url;

                if (url.startsWith('http')) {
                    // --- 2. YouTubeの正規化 ---
                    if (url.includes('youtube.com') || url.includes('youtu.be') || url.includes('youtube-nocookie.com')) {
                        let videoId = '';
                        if (url.includes('v=')) {
                            // 標準URL
                            const params = new URLSearchParams(url.split('?')[1]);
                            videoId = params.get('v');
                        } else {
                            // embed や youtu.be 形式
                            const parts = url.split(/[/?#]/);
                            // 末尾、もしくはパラメータ直前のセグメントを取得
                            videoId = parts.find(p => p.length === 11); // YouTubeのIDは常に11文字
                        }
                        if (videoId) {
                            detectedUrls.add(`https://www.youtube.com/watch?v=${videoId}`);
                            return;
                        }
                    }

                    // --- ニコニコ正規化 ---
                    if (url.includes('nicovideo.jp/watch/') || url.includes('embed.nicovideo.jp/watch/')) {
                        // 1. ID部分（sm123, so123, lv123 等）を正規表現で確実に抽出
                        // watch/ の直後の英数字のみを取得し、? 以降のパラメータを完全に無視する
                        const nicoMatch = url.match(/watch\/([a-z0-9]+)/);

                        if (nicoMatch && nicoMatch[1]) {
                            const nicoId = nicoMatch[1];
                            // 2. 常に「標準的な視聴URL」として Set に追加
                            detectedUrls.add(`https://www.nicovideo.jp/watch/${nicoId}`);

                            // 3. embed 形式も、パラメータを削った「綺麗な状態」で追加
                            detectedUrls.add(`https://embed.nicovideo.jp/watch/${nicoId}`);

                            return; // ニコニコとして処理完了
                        }
                    }

                    // --- 4. その他のURL ---
                    // 次スレURLなどのパラメータが重要なものはそのまま、それ以外は削る
                    if (url.includes('make_thread.cgi') || url.includes('youtube.com/watch')) {
                        detectedUrls.add(url);
                    } else {
                        detectedUrls.add(url.split('?')[0].split('#')[0]);
                    }
                }
            });

            // 2. 正規表現によるテキスト抽出（カード内除外は維持）
            const tempForTextSearch = ddElement.cloneNode(true);
            tempForTextSearch.querySelectorAll('.lp-content, .lp-meta').forEach(el => el.remove());
            const decodedHtml = new DOMParser().parseFromString(tempForTextSearch.innerHTML, 'text/html').documentElement.textContent;

            const urlRegex = /https?:\/\/[\w/:%#\$&\?\(\)~\.=\+\-]+/g;
            const matches = decodedHtml.match(urlRegex);
            if (matches) {
                matches.forEach(url => {
                    // テキスト抽出時も同じ除外ルールを適用
                    if (url.includes('image.open2ch.net') || url.includes('/l10#') || url.includes('/anko/')) return;
                    if (url.includes('/test/') && !url.includes('make_thread.cgi') && !url.includes('read.cgi')) return;

                    // YouTube正規化（テキスト版）
                    if (url.includes('youtube.com') || url.includes('youtu.be')) {
                        const ytMatch = url.match(/(?:v=|youtu\.be\/|embed\/)([^?&#\s]+)/);
                        if (ytMatch && ytMatch[1]) {
                            detectedUrls.add(`https://www.youtube.com/watch?v=${ytMatch[1]}`);
                            return;
                        }
                    }

                    // パラメータ除去
                    if (url.includes('make_thread.cgi')) {
                        detectedUrls.add(url);
                    } else {
                        detectedUrls.add(url.split('?')[0].split('#')[0]);
                    }
                });
            }
        };

        const checkAndExecute = () => {
            if (processedPostNumbers.has(postNumber)) return false;

            const currentTime = Date.now();
            const akuTargetId = id === '???' ? `noIdAku:${postNumber}` : id;

            if (akuTargetId && recentlyAkuedIDs.has(akuTargetId)) {
                const lastAkuTime = recentlyAkuedIDs.get(akuTargetId);
                if (currentTime - lastAkuTime <= RECENTLY_AKUED_ID_THRESHOLD_TIME_MS) {
                    console.log(`${SCRIPT_NAME}: DEBUG: No.${postNumber} - ID「${akuTargetId}」は直近処理済のためスキップ。`);
                    processedPostNumbers.add(postNumber);
                    return false;
                } else {
                    recentlyAkuedIDs.delete(akuTargetId);
                }
            }

            // 他者によるアク禁成功検知
            const akuCommandPattern = /!aku(\d+)/;
            const akuStatusPattern = /★アク禁(?:\s*\(副\))?：>>(\d+)/;
            const akuStatusPatternAlt = /★アク禁(?:\s*\(副\))?：.*?(?:href="[^"]*\/(\d+))?"/;
            const akuCommandMatch = postText.match(akuCommandPattern);
            const akuStatusMatch = postText.match(akuStatusPattern) || postText.match(akuStatusPatternAlt);

            if (akuCommandMatch && akuStatusMatch && akuCommandMatch[1] === akuStatusMatch[1]) {
                const targetPostNumber = parseInt(akuCommandMatch[1], 10);
                const isMyCommandResult = Array.from(processingQueue.values()).some(item => item.ownPostNumber === postNumber);
                if (!isMyCommandResult) {
                    if (targetPostNumber && !isNaN(targetPostNumber)) {
                        processedPostNumbers.add(targetPostNumber);
                        if (processingQueue.has(targetPostNumber)) processingQueue.delete(targetPostNumber);
                    }
                    processedPostNumbers.add(postNumber);
                    return false;
                }
            }

            let akuDetected = false;
            let ngAkuReason = '';

            const ngWordResult = checkNgWords(postText, currentConfig);
            const isNgName = checkNgNames(name, currentConfig);
            const isNgId = checkNgIds(id, currentConfig);
            const isNgLines = lines.length >= currentConfig.nggyou;
            let isRapidPost = false;

            if (id) {
                const isBacklogPost = postTimestamp && (currentTime - postTimestamp > 5000);
                if (!userPostTimestamps.has(id)) userPostTimestamps.set(id, []);
                const timestamps = userPostTimestamps.get(id);
                if (!isBacklogPost) timestamps.push(currentTime);
                const recentTimestamps = timestamps.filter(ts => currentTime - ts <= RAPID_POST_THRESHOLD_TIME_MS);
                userPostTimestamps.set(id, recentTimestamps);
                if (recentTimestamps.length > RAPID_POST_THRESHOLD_COUNT) isRapidPost = true;
            }

            if (isRapidPost) {
                akuDetected = true;
                ngAkuReason = `高速連続投稿 (UID: ${akuTargetId})`;
            } else if (ngWordResult.isNg) {
                akuDetected = true;
                ngAkuReason = `NGワード: "${ngWordResult.word}"`;
            } else if (isNgName) {
                akuDetected = true;
                ngAkuReason = `NGネーム: "${name}"`;
            } else if (isNgId) {
                akuDetected = true;
                ngAkuReason = `NG ID: "${id}"`;
            } else if (isNgLines) {
                akuDetected = true;
                ngAkuReason = `行数超過: ${lines.length}行`;
            }

            if (!akuDetected && detectedUrls.size > 0) {
                for (const url of detectedUrls) {
                    const urlNgResult = checkNgWords(url, currentConfig);
                    if (urlNgResult.isNg) {
                        akuDetected = true;
                        ngAkuReason = `NG URL: "${urlNgResult.word}"`;
                        break;
                    }
                }
            }

            if (akuDetected) {
                console.log(`%c${SCRIPT_NAME}: NGを検知しました (No.${postNumber}): ${ngAkuReason}`, "color: red; background-color: yellow;");
                let detectedAkuValue = id ? id : postNumber;
                const isAlreadyInQueue = globalAkuCommandQueue.some(cmd => cmd.targetAkuValue === detectedAkuValue);

                if (!isAlreadyInQueue) {
                    if (id && id !== '???') recentlyAkuedIDs.set(id, currentTime);
                    enqueueAkuCommandGlobally(postNumber, 'AKU_TRIGGER', 'any', detectedAkuValue);
                    processedPostNumbers.add(postNumber);
                }
                return true;
            }
            return false;
        };

        // --- 3. 実行フロー ---
        collectUrls(); // 1回目：即時抽出

        // A. 完了チェック用の関数
        const getUnfinishedTags = () => Array.from(ddElement.querySelectorAll('url')).filter(tag => {
            const a = tag.querySelector('a');
            return !a || !a.href || a.href.includes('javascript:') || a.getAttribute('href') === '#';
        });

        // B. 状態判定フラグ
        const unfinishedTags = getUnfinishedTags();
        const hasUrlTag = ddElement.querySelector('url') !== null;

        // [nico:...] や [youtube:...] などの展開待ち独自タグがあるかチェック
        const hasSpecialTag = /\[(nico|youtube|twitter|x|sky|twid):[^\]]+\]/.test(ddElement.innerHTML);

        // 1回目抽出時点での判定（テキスト、ID、既にDOMにある画像URLなど）
        const alreadyAkued = checkAndExecute();
        if (alreadyAkued) return true;

        // --- C. 判定と終了のロジック ---

        // 1. URLタグも独自タグも無い場合（通常投稿、またはDOM確定済みの画像のみ）
        if (!hasUrlTag && !hasSpecialTag) {
            if (detectedUrls.size > 0) {
                console.log(`${SCRIPT_NAME}: DEBUG: No.${postNumber} - 即時系のみのため判定完了: ${Array.from(detectedUrls).join(', ')}`);
            }
            processedPostNumbers.add(postNumber);
            return false;
        }

        // 2. URLタグはあるが、既に中身（href）が全部埋まっており、独自タグもない場合
        if (hasUrlTag && unfinishedTags.length === 0 && !hasSpecialTag) {
            processedPostNumbers.add(postNumber);
            return false;
        }

        // --- D. DOM変化監視ルート (カード化や独自タグの展開を待つ) ---
        //console.log(`${SCRIPT_NAME}: DEBUG: No.${postNumber} - 展開待ち要素(URLタグ:${hasUrlTag}, 独自タグ:${hasSpecialTag})を監視します...`);
        let timeoutId = null;
        const observer = new MutationObserver((mutations, obs) => {
            // URLタグが全て埋まり、かつ独自タグが消滅（iframe等に置換）したかチェック
            const currentUnfinished = getUnfinishedTags();
            const stillHasSpecialTag = /\[(nico|youtube|twitter|x|sky|twid):[^\]]+\]/.test(ddElement.innerHTML);

            if (currentUnfinished.length === 0 && !stillHasSpecialTag) {
                clearTimeout(timeoutId);
                obs.disconnect();

                setTimeout(() => {
                    collectUrls();
                    console.log(`${SCRIPT_NAME}: DEBUG: No.${postNumber} - 展開検知後の最終捕捉URL: ${Array.from(detectedUrls).join(', ')}`);
                    checkAndExecute();
                    processedPostNumbers.add(postNumber);
                }, 50);
            }
        });

        observer.observe(ddElement, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['href', 'src']
        });

        timeoutId = setTimeout(() => {
            observer.disconnect();
            if (processedPostNumbers.has(postNumber)) return;
            collectUrls();
            console.log(`${SCRIPT_NAME}: DEBUG: No.${postNumber} - 監視タイムアウト。捕捉URL: ${Array.from(detectedUrls).join(', ')}`);
            checkAndExecute();
            processedPostNumbers.add(postNumber);
        }, 2000);

        return false;
    }
    // 投稿内容にNGワードが含まれるかチェックする関数
    function checkNgWords(postText, configSet) {
        // 1. 除外正規表現を先にチェックする
        if (configSet.compiledExcludeRegexes && configSet.compiledExcludeRegexes.length > 0) {
            for (const excludeRegex of configSet.compiledExcludeRegexes) {
                if (excludeRegex.test(postText)) {
                    console.log(`${SCRIPT_NAME}: DEBUG: 投稿が除外正規表現「${excludeRegex.source}」にマッチしたため、NGワードチェックをスキップします。`);
                    return { isNg: false }; // 除外対象なので、即座にNGではないと判断して終了
                }
            }
        }

        // 2. 除外されなかった場合のみ、NGワードをチェックする
        for (const ngRegex of configSet.compiledNgWords) {
            if (ngRegex.test(postText)) {
                console.log(`${SCRIPT_NAME}: NGワード「${ngRegex.source}」を検知しました。`);
                return { isNg: true, word: ngRegex.source }; // NGワードにマッチしたのでNGと確定
            }
        }

        // 3. どちらにもマッチしなかった場合
        return { isNg: false };
    }
    /**
     * 投稿者の名前をNGネームリストと照合する関数
     * @param {string} name - 投稿者の名前
     * @param {object} config - 現在の設定オブジェクト
     * @returns {boolean} NGネームに合致した場合はtrue
     */
    function checkNgNames(name, config) {
        if (!name) {
            return false;
        }

        // 💡 修正箇所: 正規表現を使ってデフォルトネームをチェック
        if (DEFAULT_NAMES_REGEX.test(name)) {
            return false; // デフォルトネームの場合はNGネームチェックをスキップ
        }

        if (config.compiledNgNames && config.compiledNgNames.length > 0) {
            return config.compiledNgNames.some(regex => regex.test(name));
        }
        return false;
    }

    /**
     * 投稿者のIDをNGIDリストと照合する関数
     * @param {string} id - 投稿者のID
     * @param {object} config - 現在の設定オブジェクト
     * @returns {boolean} NG IDに合致した場合はtrue
     */
    function checkNgIds(id) {
        if (!id) {
            return false;
        }
        return rawConfig.COMMON_NG_IDS.includes(id);
    }
    /**
     * MutationObserverが自分のアク禁コマンド投稿のDOM反映（赤文字化）を
     * 一定時間内に確認できなかった場合のタイムアウト処理
     * @param {number} originalTargetPostNumber - アク禁対象だった元の投稿番号 (processingQueueのキー)
     */
    function checkAkuCommandStatusTimeout(originalTargetPostNumber) {
        const akuInfo = processingQueue.get(originalTargetPostNumber);
        if (akuInfo) {
            console.warn(`${SCRIPT_NAME}: タイムアウト: 自分のアク禁コマンド (対象No.${originalTargetPostNumber}) のDOM反映が確認できませんでした。`);
            akuAttemptConsecutiveFailures++; // タイムアウトしたので失敗とみなす
            console.warn(`${SCRIPT_NAME}: !aku連続失敗回数 (DOM未反映タイムアウト): ${akuAttemptConsecutiveFailures}`);

            if (akuAttemptConsecutiveFailures >= MAX_AKU_ATTEMPTS_BEFORE_STOP) {
                console.error(`${SCRIPT_NAME}: !aku連続失敗回数 (DOM未反映タイムアウト) が上限に達しました。スクリプトを停止します。`);
                alert(`${SCRIPT_NAME}: !aku連続失敗回数 (DOM未反映タイムアウト) が上限に達しました。スクリプトを停止します。\nOpen2chが!akuコマンドを処理しているようですが、DOMに反映されません。`);
                // ここに stopScript() があるはず
                // stopScript(); // 必要に応じて呼び出す
            }

            processedPostNumbers.add(originalTargetPostNumber);
            processingQueue.delete(originalTargetPostNumber);
        } else {
            console.log(`${SCRIPT_NAME}: DEBUG: タイムアウト発生時、処理待ちキューにNo.${originalTargetPostNumber}が見つかりませんでした。既に処理済みか削除済みです。`);
        }
    }
    /**
     * メインのMutationObserverを設定する関数
     */
    function setupMainObserver() {
        if (currentObserver) {
            currentObserver.disconnect();
            currentObserver = null;
        }

        const allInitialDlElements = document.querySelectorAll('dl[val]');
        let maxPostNumber = 0;
        if (allInitialDlElements.length > 0) {
            allInitialDlElements.forEach(dlElement => {
                const postNumberStr = dlElement.getAttribute('val');
                const postNumber = parseInt(postNumberStr, 10);
                if (!isNaN(postNumber)) {
                    // 最初にページを読み込んだ時点で既にアク禁されている投稿も考慮
                    const ddElement = dlElement.querySelector('dd.mesg.body');
                    if (ddElement && ddElement.style.color === 'red') { // 赤文字アク禁
                        processedPostNumbers.add(postNumber);
                        console.log(`${SCRIPT_NAME}: 初期読み込みで赤文字アク禁を検知し、No.${postNumber} を処理済みに追加しました。`);
                    } else {
                        // 通常の投稿もlastProcessedValの計算のために追加
                        processedPostNumbers.add(postNumber); // 初期読み込み時の投稿は全てprocessedとする
                    }

                    if (postNumber > maxPostNumber) {
                        maxPostNumber = postNumber;
                    }
                }
            });
            lastProcessedVal = maxPostNumber;
            console.log(`${SCRIPT_NAME}: 初期投稿の投稿番号を収集しました。最大投稿番号: ${lastProcessedVal}。処理済み数: ${processedPostNumbers.size}`);
        } else {
            console.log(`${SCRIPT_NAME}: スレッドに初期投稿がありません。`);
            lastProcessedVal = 0;
        }


        currentObserver = new MutationObserver((mutationsList) => {
            let newPostsDetectedInThisBatch = false;
            let latestPostNumberInBatch = lastProcessedVal;

            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches && node.matches('dl[val]')) {
                            const dlElement = node;
                            const postNumberStr = dlElement.getAttribute('val');
                            const postNumber = parseInt(postNumberStr, 10);

                            const ddElement = dlElement.querySelector('dd.mesg.body');
                            if (ddElement) {
                                // 投稿時刻をdt要素から取得
                                const dtElement = dlElement.querySelector('dt');
                                let postTimeText = 'unknown'; // 時刻が取得できなかった場合のデフォルト値
                                if (dtElement) {
                                const timeMatch = dtElement.textContent.match(/\d{2}:\d{2}:\d{2}/);
                                    if (timeMatch) {
                                        postTimeText = timeMatch[0];
                                    }
                                }
                                const postText = ddElement.textContent.trim();
                                // 1. アク禁成功メッセージのテキストパターンを検出 (既存)
                                // 「★アク禁」または「★アク禁(副)」のどちらにも対応
                                const akuSuccessMatch = postText.match(/★アク禁(?: \(副\))?：>>(\d+)/);

                                // 2. 赤文字のアク禁メッセージを検出
                                // <font color="red">タグが存在し、そのテキスト内容に「★アク禁」が含まれるかをチェック
                                const hasRedAkuFontTag = ddElement.querySelector('font[color="red"]') &&
                                      ddElement.querySelector('font[color="red"]').textContent.includes('★アク禁');

                                // 自分のアク禁コマンドが成功したかの検知ロジック
                                const ownAkuCommandInfo = Array.from(processingQueue.values()).find(item => item.ownPostNumber === postNumber); // ownPostNumberは新しいプロパティ

                                if (ownAkuCommandInfo) { // 自分の送信したアク禁コマンド投稿の場合
                                    if (hasRedAkuFontTag) { // 自分の投稿が赤文字になっている場合（アク禁成功）
                                        console.log(`${SCRIPT_NAME}: 自分の送信したアク禁コマンド (No.${ownAkuCommandInfo.originalTargetPostNumber}) が成功しました！`);
                                        processedPostNumbers.add(ownAkuCommandInfo.originalTargetPostNumber); // 実際にアク禁されたのは元の荒らし投稿

                                        // タイマーが設定されている場合はクリア
                                        if (ownAkuCommandInfo.timerId) {
                                            clearTimeout(ownAkuCommandInfo.timerId);
                                            ownAkuCommandInfo.timerId = null; // クリアしたらnullに戻しておく
                                        }
                                        processingQueue.delete(ownAkuCommandInfo.originalTargetPostNumber); // キューから削除
                                        akuAttemptConsecutiveFailures = 0; // 成功したのでリセット
                                        continue; // この投稿は処理済みなので次へ
                                    } else { // 自分の投稿だがまだ赤文字になっていない場合
                                        // タイムアウトタイマーを設定するロジック
                                        // タイマーがまだ設定されていない場合のみ設定する（重複設定防止）
                                        if (ownAkuCommandInfo.timerId === null) {
                                            ownAkuCommandInfo.timerId = setTimeout(() => {
                                                checkAkuCommandStatusTimeout(ownAkuCommandInfo.originalTargetPostNumber);
                                            }, AKU_DOM_REFLECT_TIMEOUT);
                                            console.log(`${SCRIPT_NAME}: 自分のアク禁コマンド (対象No.${ownAkuCommandInfo.originalTargetPostNumber}) の赤文字化監視タイマーを設定しました (${AKU_DOM_REFLECT_TIMEOUT}ms)。`);
                                        }
                                        // 赤文字化を待っているので、この投稿に対する他の処理は不要
                                        continue; // 次の投稿の処理へ
                                    }
                                }

                                // 他のユーザーによるアク禁成功メッセージの検知
                                if (akuSuccessMatch) { // 必ず >>XXX の形式でなければ、他ユーザーのアク禁としない
                                    const targetedAkuPostNumber = parseInt(akuSuccessMatch[1], 10);
                                    console.log(`${SCRIPT_NAME}: 他のユーザーによるアク禁成功メッセージを検知しました: "${akuSuccessMatch[0]}" (対象投稿: No.${targetedAkuPostNumber})`);
                                    processedPostNumbers.add(targetedAkuPostNumber);

                                    const akuInfoInQueue = processingQueue.get(targetedAkuPostNumber);
                                    if (akuInfoInQueue) {
                                        console.log(`${SCRIPT_NAME}: 自分の処理待ちキューに存在するNo.${targetedAkuPostNumber}に対する他者アク禁を検知。自分のaku送信をキャンセルします。`);
                                        // タイマーをクリア
                                        if (akuInfoInQueue.timerId) { // タイマーが設定されていればクリア
                                            clearTimeout(akuInfoInQueue.timerId);
                                            akuInfoInQueue.timerId = null; // クリアしたらnullに戻しておく
                                        }
                                        processingQueue.delete(targetedAkuPostNumber);
                                        akuAttemptConsecutiveFailures = 0; // 他者アク禁により目的が達せられたためリセット
                                    } else {
                                        console.log(`${SCRIPT_NAME}: 自分のスクリプトの関与しない他者アク禁 (No.${targetedAkuPostNumber}) を検知しました。`);
                                    }
                                    continue; // この投稿はアク禁メッセージなので、NG判定は不要
                                }

                                // 新しい投稿のNG判定（handleNewPost の呼び出しなど）
                                if (!isNaN(postNumber) && postNumber > lastProcessedVal &&
                                    !processedPostNumbers.has(postNumber) && !processingQueue.has(postNumber)) {
                                    handleNewPost(ddElement, postNumber);

                                    newPostsDetectedInThisBatch = true;
                                    if (postNumber > latestPostNumberInBatch) {
                                        latestPostNumberInBatch = postNumber;
                                    }
                                }
                            } else {
                                console.warn(`${SCRIPT_NAME}: 新しいDL要素 (No.${postNumber}) に対応するdd.mesg.bodyが見つかりませんでした。`);
                            }
                        }
                    }
                }
            }

            if (newPostsDetectedInThisBatch) {
                //console.log(`${SCRIPT_NAME}: MutationObserver: 新しい投稿を処理しました。`);
                if (latestPostNumberInBatch > lastProcessedVal) {
                    lastProcessedVal = latestPostNumberInBatch;
                    //console.log(`${SCRIPT_NAME}: MutationObserver: lastProcessedValを ${lastProcessedVal} に更新しました。`);
                }
            }
        });

        const observerConfig = { childList: true, subtree: true };
        currentObserver.observe(document.body, observerConfig);
        //console.log(`${SCRIPT_NAME}: MutationObserverで新しい投稿の出現監視を開始しました (対象: document.body, subtree: true)。`);
    }

    /**
     * スクリプトを起動する関数
     * @param {Object} selectedConfig - 適用するNG設定オブジェクト
     * @param {string} selectedConfigId - 適用するNG設定のID
     */
    function runScript(selectedConfig, selectedConfigId) {
        if (scriptInitialized) {
            console.log(`${SCRIPT_NAME}: スクリプトは既に実行中です。設定を更新して再起動します。`);
            // ★重要★ スクリプトが既に実行中の場合でも、設定変更のために再起動する可能性を考慮
            // ここに既存のObserverとCleanupTimerの停止処理を追加
            if (currentObserver) {
                currentObserver.disconnect();
                currentObserver = null;
                console.log(`${SCRIPT_NAME}: 既存のMutationObserverを停止しました。(再起動前)`);
            }
            if (cleanupTimer) {
                clearInterval(cleanupTimer);
                cleanupTimer = null;
                console.log(`${SCRIPT_NAME}: 高速連続投稿履歴のクリーンアップタイマーを停止しました。(再起動前)`);
            }
            // 処理を続行して新しい設定で再起動できるようにする
        }

        currentConfig = selectedConfig;
        activeConfigId = selectedConfigId;
        COMMAND_SEND_DELAY_MS = currentConfig.akuDelayMs !== undefined ? currentConfig.akuDelayMs : 1000; // デフォルト値は1000msが妥当かと思います
        console.log(`${SCRIPT_NAME}: COMMAND_SEND_DELAY_MS を ${COMMAND_SEND_DELAY_MS}ms に設定しました。`);
        scriptInitialized = true;
        akuAttemptConsecutiveFailures = 0;
        processedPostNumbers.clear(); // 起動時にクリア
        processingQueue.clear(); // 起動時にクリア

        userPostTimestamps.clear(); // 起動時に過去の投稿履歴をクリア
        // クリーンアップタイマーを開始
        cleanupTimer = setInterval(cleanUpOldPostTimestamps, RAPID_POST_HISTORY_CLEANUP_INTERVAL_MS);
        //console.log(`${SCRIPT_NAME}: 高速連続投稿履歴のクリーンアップタイマーを開始しました。`);

        akuIdCleanupTimer = setInterval(cleanUpRecentlyAkuedIDs, AKU_ID_CLEANUP_INTERVAL_MS);
        //console.log(`${SCRIPT_NAME}: 直近アク禁ID履歴のクリーンアップタイマーを開始しました。`);

        setupMainObserver(); // MutationObserverの設定

        updateControlUI(); // UIの更新
        console.log(`${SCRIPT_NAME}: スクリプトが設定「${currentConfig.name}」で起動しました。`);
    }

    /**
     * スクリプトの初期化
     */
    function init() {
        console.log(`${SCRIPT_NAME}: 初期化中... (Version: ${SCRIPT_VERSION})`);

        // 投稿履歴クリーンアップタイマーを起動
        // これにより、userPostTimestamps Mapが定期的に整理されるようになる
        cleanupUserPostTimestamps();
        //console.log(`${SCRIPT_NAME}: 高速連続投稿履歴クリーンアップタイマーを開始しました。`);

        compiledConfig = compileConfig(rawConfig);

        try {
            addStartButtons();
        } catch (error) {
            console.error(`${SCRIPT_NAME}: UIの生成中にエラーが発生しました。`, error);
            alert(`${SCRIPT_NAME}: UIの生成中にエラーが発生しました。コンソールを確認してください。\nエラー: ${error.message}`);
            return;
        }

        updateControlUI(); // 初回UIの更新
        //console.log(`${SCRIPT_NAME}: Tampermonkeyスクリプトが開始されました。`);
        //console.log(`${SCRIPT_NAME}: 現在のdocument.title: "${document.title}"`);

        let matchedConfigId = null;
        for (const rule in AUTO_APPLY_RULES) {
            if (document.title.includes(rule)) {
                matchedConfigId = AUTO_APPLY_RULES[rule];
                //console.log(`${SCRIPT_NAME}: キーワード「${rule}」がタイトルに一致しました。`);
                break;
            }
        }

        if (matchedConfigId) {
            const selectedConfig = compiledConfig.NG_SETS[matchedConfigId];
            if (selectedConfig) {
                //console.log(`${SCRIPT_NAME}: スレッドタイトル「${document.title}」にキーワードが一致しました。設定「${selectedConfig.name}」を自動適用します。`);
                runScript(selectedConfig, matchedConfigId);
            } else {
                console.warn(`${SCRIPT_NAME}: AUTO_APPLY_RULESで指定された設定ID「${matchedConfigId}」が見つかりません。`);
                updateControlUI();
            }
        } else {
            console.log(`${SCRIPT_NAME}: スレッドタイトルに一致する自動適用ルールが見つかりませんでした。手動で起動してください。`);
            updateControlUI();
        }
        // スクリプトが自動適用された場合でも、手動起動を待つ場合でも、
        // 投稿監視が開始される前にキュー処理を開始しておく
        processGlobalAkuCommandQueue();
    }

    $(document).ready(function() {
        init();
    });

})();