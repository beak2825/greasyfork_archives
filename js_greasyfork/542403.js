// ==UserScript==
// @name         Advanced Search for X (Twitter) 🔍
// @name:ja      Advanced Search for X（Twitter）🔍
// @name:en      Advanced Search for X (Twitter) 🔍
// @name:zh-CN   Advanced Search for X（Twitter）🔍
// @name:zh-TW   Advanced Search for X（Twitter）🔍
// @name:ko      Advanced Search for X (Twitter) 🔍
// @name:fr      Advanced Search for X (Twitter) 🔍
// @name:es      Advanced Search for X (Twitter) 🔍
// @name:de      Advanced Search for X (Twitter) 🔍
// @name:pt-BR   Advanced Search for X (Twitter) 🔍
// @name:ru      Advanced Search for X (Twitter) 🔍
// @version      7.0.1
// @description      No need to memorize search commands anymore. Adds a feature-rich floating window to X.com (Twitter) that combines an easy-to-use advanced search UI, search history, saved searches, local post (tweet) bookmarks with tags, regex-based muting, and folder-based account and list management.
// @description:ja   検索コマンドはもう覚える必要なし。誰にでも使いやすい高度な検索UI、検索履歴、検索条件の保存、投稿（ツイート）をタグで管理できるローカルお気に入り機能、正規表現対応のミュート、フォルダー分け対応のアカウント／リスト管理機能などを統合した超多機能フローティングウィンドウを X.com（Twitter）に追加します。
// @description:en   No need to memorize search commands anymore. Adds a feature-rich floating window to X.com (Twitter) that combines an easy-to-use advanced search UI, search history, saved searches, local post (tweet) bookmarks with tags, regex-based muting, and folder-based account and list management.
// @description:zh-CN 无需再死记硬背搜索命令。为 X.com（Twitter）添加一个超多功能浮动窗口，集成易用的高级搜索界面、搜索历史、已保存的搜索条件、支持为帖子（推文）添加标签的本地收藏、基于正则表达式的屏蔽，以及支持按文件夹管理的账号和列表功能。
// @description:zh-TW 無需再死記硬背搜尋指令。為 X.com（Twitter）增加一個超多功能懸浮視窗，整合易用的高級搜尋介面、搜尋紀錄、已保存的搜尋條件、可用標籤管理貼文（推文）的本地收藏、正則表示式過濾，以及支援以資料夾分類的帳號和列表管理功能。
// @description:ko   더 이상 검색 명령어를 외울 필요 없습니다. X.com(Twitter)에 누구나 쉽게 사용할 수 있는 고급 검색 UI, 검색 기록, 검색 조건 저장, 게시글(트윗)을 태그로 관리할 수 있는 로컬 즐겨찾기 기능, 정규식 음소거, 폴더 분류가 가능한 계정 및 리스트 관리 기능 등을 통합한 다기능 플로팅 창을 추가합니다.
// @description:fr   Plus besoin de mémoriser les commandes de recherche. Ajoute à X.com (Twitter) une fenêtre flottante très complète regroupant une interface de recherche avancée et facile à utiliser, l’historique, les recherches enregistrées, des favoris locaux pour les publications (tweets) avec tags, un masquage par expressions régulières (regex) et une gestion des comptes et listes avec classement par dossiers.
// @description:es   ¡Olvídate de memorizar comandos de búsqueda! Añade a X.com (Twitter) una ventana flotante multifuncional con una interfaz de búsqueda avanzada y fácil de usar, historial, búsquedas guardadas, favoritos locales de publicaciones (tuits) con etiquetas, silenciado mediante expresiones regulares (regex) y gestión de cuentas y listas con organización por carpetas.
// @description:de   Kein Auswendiglernen von Suchbefehlen mehr! Fügt X.com (Twitter) ein multifunktionales schwebendes Fenster hinzu, das eine leicht zu bedienende erweiterte Suchoberfläche, Suchverlauf, gespeicherte Suchanfragen, lokale Lesezeichen für Posts (Tweets) mit Tags, Stummschaltung per regulären Ausdrücken (Regex) und eine ordnerbasierte Konten- und Listenverwaltung vereint.
// @description:pt-BR Não precisa mais decorar comandos de busca! Adiciona ao X.com (Twitter) uma janela flutuante multifuncional com uma interface de busca avançada e fácil de usar, histórico, buscas salvas, favoritos locais de posts (tweets) com tags, silenciamento por expressões regulares (regex) e gestão de contas e listas com organização em pastas.
// @description:ru   Больше не нужно запоминать поисковые команды! Добавляет на X.com (Twitter) многофункциональное плавающее окно с удобным интерфейсом расширенного поиска, историей, сохранёнными запросами, локальными закладками постов (твитов) с тегами, фильтрацией по регулярным выражениям (regex) и управлением аккаунтами и списками с организацией по папкам.
// @namespace    https://github.com/koyasi777/advanced-search-for-x-twitter
// @author       koyasi777
// @match        https://x.com/*
// @match        https://twitter.com/*
// @exclude      https://x.com/i/tweetdeck*
// @exclude      https://twitter.com/i/tweetdeck*
// @icon         https://raw.githubusercontent.com/koyasi777/advanced-search-for-x-twitter/refs/heads/main/extension/icons/icon-128.png
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        unsafeWindow
// @connect      *
// @run-at       document-idle
// @license      MIT
// @homepageURL  https://github.com/koyasi777/advanced-search-for-x-twitter
// @supportURL   https://github.com/koyasi777/advanced-search-for-x-twitter/issues
// @downloadURL https://update.greasyfork.org/scripts/542403/Advanced%20Search%20for%20X%20%28Twitter%29%20%F0%9F%94%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/542403/Advanced%20Search%20for%20X%20%28Twitter%29%20%F0%9F%94%8D.meta.js
// ==/UserScript==

const __X_ADV_SEARCH_MAIN_LOGIC__ = function() {
    'use strict';

    // Trusted Types 対応ヘルパー (UserScript/Extension両対応)
    let ttPolicy = null;

    // UserScript環境では unsafeWindow を使う必要がある
    const targetWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

    if (targetWindow.trustedTypes && targetWindow.trustedTypes.createPolicy) {
        try {
            // ポリシー名の重複エラーを防ぐため、ランダムなサフィックスを付与して一意にする
            const policyName = 'advSearchPolicy_' + Math.floor(Math.random() * 1000000);
            ttPolicy = targetWindow.trustedTypes.createPolicy(policyName, {
                createHTML: (string) => string, // HTML内容を信頼してパススルー
            });
        } catch (e) {
            console.warn('Trusted Types policy creation failed:', e);
        }
    }

    // innerHTMLへ安全に代入する関数
    const setInnerHTML = (element, html) => {
        if (!element) return;
        if (ttPolicy) {
            // 再帰呼び出しではなく、プロパティへの代入を行う
            element.innerHTML = ttPolicy.createHTML(html);
        } else {
            // ここも直接代入
            element.innerHTML = html;
        }
    };

    if (window.__X_ADV_SEARCH_INITED__) return;
    window.__X_ADV_SEARCH_INITED__ = true;

    const i18n = {
        translations: {
            'en': {
                modalTitle: "Advanced Search",
                tooltipClose: "Close",
                labelAllWords: "All of these words",
                placeholderAllWords: "e.g., AI news",
                labelExactPhrase: "This exact phrase",
                placeholderExactPhrase: 'e.g., "ChatGPT 4o"',
                labelAnyWords: "Any of these words (OR)",
                placeholderAnyWords: "e.g., iPhone Android",
                labelNotWords: "None of these words (-)",
                placeholderNotWords: "e.g., -sale -ads",
                labelHashtag: "Hashtags (#)",
                placeholderHashtag: "e.g., #TechEvent",
                labelLang: "Language (lang:)",
                optLangDefault: "Any language",
                optLangJa: "Japanese (ja)",
                optLangEn: "English (en)",
                optLangId: "Indonesian (id)",
                optLangHi: "Hindi (hi)",
                optLangDe: "German (de)",
                optLangTr: "Turkish (tr)",
                optLangEs: "Spanish (es)",
                optLangPt: "Portuguese (pt)",
                optLangAr: "Arabic (ar)",
                optLangFr: "French (fr)",
                optLangKo: "Korean (ko)",
                optLangRu: "Russian (ru)",
                optLangZhHans: "Chinese Simplified (zh-cn)",
                optLangZhHant: "Chinese Traditional (zh-tw)",
                hrSeparator: " ",
                labelFilters: "Filters",
                labelVerified: "Verified accounts",
                labelLinks: "Links",
                labelImages: "Images",
                labelVideos: "Videos",
                labelReposts: "Reposts",
                labelTimelineHashtags: "Hashtags (#)",
                checkInclude: "Include",
                checkExclude: "Exclude",
                labelReplies: "Replies",
                optRepliesDefault: "Default (Show all)",
                optRepliesInclude: "Include replies",
                optRepliesOnly: "Replies only",
                optRepliesExclude: "Exclude replies",
                labelEngagement: "Engagement",
                placeholderMinReplies: "Min replies",
                placeholderMinLikes: "Min likes",
                placeholderMinRetweets: "Min reposts",
                labelDateRange: "Date range",
                labelDateShortcut: "Quick Range",
                optDate1Day: "Past 24h",
                optDate1Week: "Past week",
                optDate1Month: "Past month",
                optDate3Months: "Past 3 months",
                optDate6Months: "Past 6 months",
                optDate1Year: "Past year",
                optDate2Years: "Past 2 years",
                optDate3Years: "Past 3 years",
                optDate5Years: "Past 5 years",
                optDateClear: "Clear dates",
                tooltipSince: "From this date",
                tooltipUntil: "Until this date",
                labelFromUser: "From these accounts (from:)",
                placeholderFromUser: "e.g., @X",
                labelToUser: "To these accounts (to:)",
                placeholderToUser: "e.g., @google",
                labelMentioning: "Mentioning these accounts (@)",
                placeholderMentioning: "e.g., @OpenAI",
                buttonClear: "Clear",
                buttonApply: "Search",
                tooltipTrigger: "Open Advanced Search",
                buttonOpen: "Open",

                tabSearch: "Search",
                tabHistory: "History",
                tabSaved: "Saved",
                buttonSave: "Save",
                buttonSaved: "Saved",
                secretMode: "Secret",
                secretOn: "Secret mode ON (No history)",
                secretOff: "Secret mode OFF",
                toastSaved: "Saved.",
                toastDeleted: "Deleted.",
                toastReordered: "Order updated.",
                emptyHistory: "No history yet.",
                emptySaved: "No saved searches. Add from the Save button at the bottom left of the Search tab.",
                run: "Run",
                delete: "Delete",
                updated: "Updated.",
                tooltipSecret: "Toggle Secret Mode (no history will be recorded)",
                historyClearAll: "Clear All",
                confirmClearHistory: "Clear all history?",

                labelAccountScope: "Accounts",
                optAccountAll: "All accounts",
                optAccountFollowing: "Accounts you follow",
                labelLocationScope: "Location",
                optLocationAll: "All locations",
                optLocationNearby: "Near you",
                chipFollowing: "Following",
                chipNearby: "Nearby",

                labelSearchTarget: "Search target",
                labelHitName: "Exclude matches only in display name",
                labelHitHandle: "Exclude matches only in username (@handle)",
                hintSearchTarget: "Hide posts that only match in name or handle (not in body).",
                hintName: "If a keyword appears only in the display name, hide it.",
                hintHandle: "If a keyword appears only in @username, hide it. Exception: when the query explicitly uses from:/to:/@ with the same word.",

                tabMute: "Mute",
                labelMuteWord: "Add mute word",
                placeholderMuteWord: "e.g., spoiler",
                labelCaseSensitive: "Case sensitive",
                labelWordBoundary: "Whole word",
                labelEnabled: "Enabled",
                labelEnableAll: "Enable all",
                buttonAdd: "Add",
                emptyMuted: "No muted words.",
                mutedListTitle: "Muted words",
                mutedListHeading: "Muted items",
                optMuteHidden: "Hidden",
                optMuteCollapsed: "Collapsed",
                placeholderFilterMute: "Filter muted words...",
                muteLabel: "Muted: ",
                buttonShow: "Show",
                muteHit: "Mute hits in body",
                buttonRemute: "Re-mute",
                buttonImport: "Import",
                buttonExport: "Export",

                /* Accounts tab */
                tabAccounts: "Accounts",
                emptyAccounts: "No accounts yet. Open a profile and click the Add button to save it.",
                buttonAddAccount: "Add account",
                toastAccountAdded: "Account added.",
                toastAccountExists: "Already added.",
                buttonConfirm: "Confirm",

                /* Lists tab */
                tabLists: "Lists",
                emptyLists: "No lists yet. Open a List and click the + button in the top-right to add it.",
                buttonAddList: "Add list",
                toastListAdded: "List added.",
                toastListExists: "Already added.",

                /* History tab */
                placeholderSearchHistory: "Search history (query)",
                labelSortBy: "Sort by:",
                placeholderSearchSaved: "Search saved (query)",
                sortNewest: "Newest first",
                sortOldest: "Oldest first",
                sortNameAsc: "Query (A-Z)",
                sortNameDesc: "Query (Z-A)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "Filter accounts (@, name)",
                placeholderFilterLists: "Filter lists (name, url)",
                buttonAddFolder: "+Folder",
                folderFilterAll: "ALL",
                folderFilterUnassigned: "Unassigned",
                folderRename: "Rename",
                folderRenameTitle: "Rename folder",
                folderDelete: "Delete",
                folderDeleteTitle: "Delete folder",
                promptNewFolder: "New folder name",
                confirmDeleteFolder: "Delete this folder and all items inside it? This cannot be undone.",
                optListsAll: "Lists",
                defaultSavedFolders: "Saved Searches",

                /* Favorites */
                tabFavorites: "Favorites",
                emptyFavorites: "No favorite tweets yet. Click the ★ icon on tweets to save them.",
                optFavoritesAll: "All Favorites",
                toastFavorited: "Added to favorites.",
                toastUnfavorited: "Removed from favorites.",

                /* Settings */
                settingsTitle: "Settings",
                settingsTitleGeneral: "General",
                settingsTitleFeatures: "Tab Visibility",
                settingsTitleData: "Data",
                buttonClose: "Close",
                labelUILang: "Interface language",
                optUILangAuto: "Auto",
                labelInitialTab: "Startup tab",
                optInitialTabLast: "Last opened (Default)",
                labelImportExport: "Import / Export",
                placeholderSettingsJSON: "Paste backup JSON here...",
                tooltipSettings: "Open settings",
                toastImported: "Imported.",
                toastExported: "Exported to file.",
                alertInvalidJSON: "Invalid JSON file.",
                alertInvalidData: "Invalid data format.",
                alertInvalidApp: 'This file is not a valid backup for "Advanced Search for X".',
                buttonReset: "Reset all data",
                confirmResetAll: "Reset all data? This cannot be undone.",
                toastReset: "All data has been reset.",
                buttonImportSuccess: "Imported successfully 👍️",

                /* Favorites Sort */
                sortSavedNewest: "Saved date (Newest)",
                sortSavedOldest: "Saved date (Oldest)",
                sortPostedNewest: "Posted date (Newest)",
                sortPostedOldest: "Posted date (Oldest)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: 'Uncategorized',
                FT_DROPDOWN_TITLE: 'Favorite Tags',
                FT_DROPDOWN_SETTINGS_TITLE: 'Favorite Tag Settings',
                FT_DROPDOWN_NEW_TAG: 'New tag',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: 'Tag name',
                FT_DROPDOWN_NEW_TAG_ADD: 'Add',
                FT_FILTER_ALL: 'All',
                FT_SETTINGS_TITLE: 'Favorite Tag Settings',
                FT_SETTINGS_EMPTY_TAG_LIST:
                  'No tags yet. You can add one from "New tag".',
                FT_SETTINGS_UNCATEGORIZED_NAME: 'Uncategorized',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP:
                  'The name of "Uncategorized" cannot be changed.',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP:
                  '"Uncategorized" cannot be deleted.',
                FT_SETTINGS_CLOSE: 'Close',
                FT_SETTINGS_DELETE_BUTTON: 'Delete',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: 'Display',
                FT_SETTINGS_DISPLAY_MODE_LABEL: 'Tag label format',
                FT_SETTINGS_DISPLAY_MODE_LEAF: 'Tag name only',
                FT_SETTINGS_DISPLAY_MODE_FULL: 'Full path',
                FT_CONFIRM_DELETE_TAG_MSG: 'Delete tag "{tagName}"?\nFavorites with this tag will become "Uncategorized".',
                FT_SETTINGS_BUTTON_TITLE: 'Favorite Tag Settings',

                /* --- Cloud Sync --- */
                settingsTitleSync: "Cloud Sync",
                chipBeta: "Beta",
                labelSyncEndpoint: "Endpoint URL",
                linkSyncSetup: "Setup Guide",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_en.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "Sync ID (UUID)",
                placeholderSyncId: "Paste or Generate UUID",
                buttonGenerate: "Generate",
                labelSyncPassword: "Encryption Password",
                placeholderSyncPassword: "Strong password required",
                tooltipShowHidePassword: "Show/Hide Password",
                noteSyncEncryption: "* Data is encrypted locally before upload. The server never sees this password.",
                labelSyncChangePass: "Change",
                promptNewPassword: "Enter new password:",
                confirmRotation: "Change password and re-encrypt all data?\n\n* Make sure you have the latest data synced.\n* This action cannot be undone.",
                toastPassChanged: "Password changed successfully.",
                toastRotationFailed: "Rotation Failed",
                syncStatusRotating: "Rotating Keys...",
                labelSyncStatus: "Status: ",
                buttonSyncNow: "Sync Now",

                /* Sync Status Messages */
                toastSynced: "Cloud Sync Complete.",
                toastSyncFailed: "Cloud Sync Failed.",
                syncStatusIdle: "Idle",
                syncStatusNotConfigured: "Not Configured",
                syncStatusConnecting: "Connecting...",
                syncStatusPulling: "Pulling...",
                syncStatusPushing: "Pushing...",
                syncStatusMerging: "Merging...",
                syncStatusSynced: "Synced",
                syncStatusError: "Error",
            },
            'ja': {
                modalTitle: "高度な検索",
                tooltipClose: "閉じる",
                labelAllWords: "すべての語句を含む",
                placeholderAllWords: "例: AI ニュース",
                labelExactPhrase: "この語句を完全に含む",
                placeholderExactPhrase: '例: "ChatGPT 4o"',
                labelAnyWords: "いずれかの語句を含む (OR)",
                placeholderAnyWords: "例: iPhone Android",
                labelNotWords: "含まない語句 (-)",
                placeholderNotWords: "例: -セール -広告",
                labelHashtag: "ハッシュタグ (#)",
                placeholderHashtag: "例: #技術書典",
                labelLang: "言語 (lang:)",
                optLangDefault: "指定しない",
                optLangJa: "日本語 (ja)",
                optLangEn: "英語 (en)",
                optLangId: "インドネシア語 (id)",
                optLangHi: "ヒンディー語 (hi)",
                optLangDe: "ドイツ語 (de)",
                optLangTr: "トルコ語 (tr)",
                optLangEs: "スペイン語 (es)",
                optLangPt: "ポルトガル語 (pt)",
                optLangAr: "アラビア語 (ar)",
                optLangFr: "フランス語 (fr)",
                optLangKo: "韓国語 (ko)",
                optLangRu: "ロシア語 (ru)",
                optLangZhHans: "中国語（簡体字）(zh-cn)",
                optLangZhHant: "中国語（繁体字）(zh-tw)",
                hrSeparator: " ",
                labelFilters: "フィルター",
                labelVerified: "認証済みアカウント",
                labelLinks: "リンク",
                labelImages: "画像",
                labelVideos: "動画",
                labelReposts: "リポスト",
                labelTimelineHashtags: "ハッシュタグ (#)",
                checkInclude: "含む",
                checkExclude: "含まない",
                labelReplies: "返信",
                optRepliesDefault: "指定しない",
                optRepliesInclude: "返信を含める",
                optRepliesOnly: "返信のみ",
                optRepliesExclude: "返信を除外",
                labelEngagement: "エンゲージメント",
                placeholderMinReplies: "最小返信数",
                placeholderMinLikes: "最小いいね数",
                placeholderMinRetweets: "最小リポスト数",
                labelDateRange: "期間指定",
                labelDateShortcut: "期間ショートカット",
                optDate1Day: "過去24時間",
                optDate1Week: "過去1週間",
                optDate1Month: "過去1ヶ月",
                optDate3Months: "過去3ヶ月",
                optDate6Months: "過去6ヶ月",
                optDate1Year: "過去1年",
                optDate2Years: "過去2年",
                optDate3Years: "過去3年",
                optDate5Years: "過去5年",
                optDateClear: "日付クリア",
                tooltipSince: "この日以降",
                tooltipUntil: "この日以前",
                labelFromUser: "このアカウントから (from:)",
                placeholderFromUser: "例: @X",
                labelToUser: "このアカウントへ (to:)",
                placeholderToUser: "例: @google",
                labelMentioning: "このアカウントへのメンション (@)",
                placeholderMentioning: "例: @OpenAI",
                buttonClear: "クリア",
                buttonApply: "検索実行",
                tooltipTrigger: "高度な検索を開く",
                buttonOpen: "開く",

                tabSearch: "検索",
                tabHistory: "履歴",
                tabSaved: "保存",
                buttonSave: "保存",
                buttonSaved: "保存済み",
                secretMode: "シークレット",
                secretOn: "シークレットモード ON（履歴は記録しません）",
                secretOff: "シークレットモード OFF",
                toastSaved: "保存しました。",
                toastDeleted: "削除しました。",
                toastReordered: "並び順を更新しました。",
                emptyHistory: "履歴はまだありません。",
                emptySaved: "保存済みの検索はありません。検索タブの左下の保存から追加してください。",
                run: "実行",
                delete: "削除",
                updated: "更新しました。",
                tooltipSecret: "シークレットモードを切り替え（履歴を記録しません）",
                historyClearAll: "すべて削除",
                confirmClearHistory: "履歴をすべて削除しますか？",

                labelAccountScope: "アカウント",
                optAccountAll: "すべてのアカウント",
                optAccountFollowing: "フォローしているアカウント",
                labelLocationScope: "場所",
                optLocationAll: "すべての場所",
                optLocationNearby: "近くの場所",
                chipFollowing: "フォロー中",
                chipNearby: "近く",

                labelSearchTarget: "検索対象",
                labelHitName: "表示名（名前）のみのヒットは除外",
                labelHitHandle: "ユーザー名（@）のみのヒットは除外",
                hintSearchTarget: "本文ではなく、名前/ユーザー名のみに一致した投稿を非表示にします。",
                hintName: "キーワードが表示名のみに含まれる場合は非表示にします。",
                hintHandle: "キーワードが @ユーザー名のみに含まれる場合は非表示にします。例外: 同じ語を from:/to:/@ で明示しているときは表示します。",

                tabMute: "ミュート",
                labelMuteWord: "ミュート語句の追加",
                placeholderMuteWord: "例: ネタバレ",
                labelCaseSensitive: "大文字小文字を区別",
                labelWordBoundary: "完全一致(単語)",
                labelEnabled: "有効",
                labelEnableAll: "すべて有効",
                buttonAdd: "追加",
                emptyMuted: "ミュート語句はまだありません。",
                mutedListTitle: "ミュート語句",
                mutedListHeading: "ミュート一覧",
                optMuteHidden: "非表示",
                optMuteCollapsed: "折りたたみ",
                placeholderFilterMute: "ミュートを検索...",
                muteLabel: "ミュート: ",
                buttonShow: "表示する",
                muteHit: "本文でのヒットをミュート",
                buttonRemute: "再ミュート",
                buttonImport: "インポート",
                buttonExport: "エクスポート",

                /* Accounts tab */
                tabAccounts: "アカウント",
                emptyAccounts: "アカウントはまだありません。アカウントページの追加ボタンから追加してください。",
                buttonAddAccount: "アカウントを追加",
                toastAccountAdded: "アカウントを追加しました。",
                toastAccountExists: "すでに追加済みです。",
                buttonConfirm: "確認",

                /* Lists tab */
                tabLists: "リスト",
                emptyLists: "リストはまだありません。リストを開き右上の+ボタンから追加してください。",
                buttonAddList: "リストを追加",
                toastListAdded: "リストを追加しました。",
                toastListExists: "すでに追加済みです。",

                /* History tab */
                placeholderSearchHistory: "履歴を検索（クエリ）",
                labelSortBy: "並び順:",
                placeholderSearchSaved: "保存済みを検索（クエリ）",
                sortNewest: "新しい順",
                sortOldest: "古い順",
                sortNameAsc: "クエリ (昇順)",
                sortNameDesc: "クエリ (降順)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "アカウントを検索 (@, 名前)",
                placeholderFilterLists: "リストを検索 (名前, URL)",
                buttonAddFolder: "+フォルダー",
                folderFilterAll: "すべて",
                folderFilterUnassigned: "未分類",
                folderRename: "名前変更",
                folderRenameTitle: "フォルダー名を変更",
                folderDelete: "削除",
                folderDeleteTitle: "フォルダーを削除",
                promptNewFolder: "新しいフォルダー名",
                confirmDeleteFolder: "このフォルダーと中のすべてのアイテムを完全に削除しますか？この操作は元に戻せません。",
                optListsAll: "リスト",
                defaultSavedFolders: "保存済み検索",

                /* Favorites */
                tabFavorites: "お気に入り",
                emptyFavorites: "お気に入りはまだありません。ツイートの★ボタンをクリックして保存できます。",
                optFavoritesAll: "すべてのお気に入り",
                toastFavorited: "お気に入りに追加しました。",
                toastUnfavorited: "お気に入りから削除しました。",

                /* Settings */
                settingsTitle: "設定",
                settingsTitleGeneral: "一般設定",
                settingsTitleFeatures: "タブ表示設定",
                settingsTitleData: "データ管理",
                buttonClose: "閉じる",
                labelUILang: "UI 言語",
                optUILangAuto: "自動判定",
                labelInitialTab: "起動時に開くタブ",
                optInitialTabLast: "前回のタブ (デフォルト)",
                labelImportExport: "インポート / エクスポート",
                placeholderSettingsJSON: "ここにバックアップ JSON を貼り付けてください...",
                tooltipSettings: "設定を開く",
                toastImported: "インポートしました。",
                toastExported: "ファイルにエクスポートしました。",
                alertInvalidJSON: "無効なJSONファイルです。",
                alertInvalidData: "無効なデータ形式です。",
                alertInvalidApp: "このファイルは「Advanced Search for X」のバックアップデータではありません。",
                buttonReset: "すべて初期化",
                confirmResetAll: "すべてのデータを初期化しますか？この操作は元に戻せません。",
                toastReset: "すべてのデータを初期化しました。",
                buttonImportSuccess: "インポートに成功しました👍️",

                /* Favorites Sort */
                sortSavedNewest: "追加日 (新しい順)",
                sortSavedOldest: "追加日 (古い順)",
                sortPostedNewest: "投稿日 (新しい順)",
                sortPostedOldest: "投稿日 (古い順)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: '未分類',
                FT_DROPDOWN_TITLE: 'お気に入りタグ',
                FT_DROPDOWN_SETTINGS_TITLE: 'お気に入りタグ設定',
                FT_DROPDOWN_NEW_TAG: '新しいタグ',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: 'タグ名',
                FT_DROPDOWN_NEW_TAG_ADD: '追加',
                FT_FILTER_ALL: 'すべて',
                FT_SETTINGS_TITLE: 'お気に入りタグ設定',
                FT_SETTINGS_EMPTY_TAG_LIST:
                  'タグはまだありません。「新しいタグ」から追加できます。',
                FT_SETTINGS_UNCATEGORIZED_NAME: '未分類',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: '未分類の名前は変更できません',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '未分類は削除できません',
                FT_SETTINGS_CLOSE: '閉じる',
                FT_SETTINGS_DELETE_BUTTON: '削除',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: '表示設定',
                FT_SETTINGS_DISPLAY_MODE_LABEL: 'タグの表示形式',
                FT_SETTINGS_DISPLAY_MODE_LEAF: '末尾のみ (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: 'フルパス (full)',
                FT_CONFIRM_DELETE_TAG_MSG: 'タグ「{tagName}」を削除しますか？\nこのタグが付いていたお気に入りは未分類になります。',
                FT_SETTINGS_BUTTON_TITLE: 'お気に入りタグ設定',

                /* --- Cloud Sync --- */
                settingsTitleSync: "クラウド同期",
                chipBeta: "ベータ",
                labelSyncEndpoint: "エンドポイント URL",
                linkSyncSetup: "セットアップガイド",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "同期 ID (UUID)",
                placeholderSyncId: "UUIDを貼り付け、または生成",
                buttonGenerate: "生成",
                labelSyncPassword: "暗号化パスワード",
                placeholderSyncPassword: "強力なパスワードを入力",
                tooltipShowHidePassword: "パスワードを表示/非表示",
                noteSyncEncryption: "* データはアップロード前にローカルで暗号化されます。サーバーがパスワードを知ることはありません。",
                labelSyncChangePass: "変更",
                promptNewPassword: "新しいパスワードを入力してください:",
                confirmRotation: "パスワードを変更し、データを再暗号化しますか？\n\n* 必ず最新のデータが同期されている状態で実行してください。\n* この操作は元に戻せません。",
                toastPassChanged: "パスワードを変更しました。",
                toastRotationFailed: "変更に失敗しました",
                syncStatusRotating: "キー更新中...",
                labelSyncStatus: "ステータス: ",
                buttonSyncNow: "今すぐ同期",

                /* Sync Status Messages */
                toastSynced: "同期しました。",
                toastSyncFailed: "同期に失敗しました。",
                syncStatusIdle: "待機中",
                syncStatusNotConfigured: "未設定",
                syncStatusConnecting: "接続中...",
                syncStatusPulling: "受信中...",
                syncStatusPushing: "送信中...",
                syncStatusMerging: "マージ中...",
                syncStatusSynced: "同期完了",
                syncStatusError: "エラー",
            },
            'zh-CN': {
                modalTitle: "高级搜索",
                tooltipClose: "关闭",
                labelAllWords: "包含全部词语",
                placeholderAllWords: "例如：AI 新闻",
                labelExactPhrase: "包含确切短语",
                placeholderExactPhrase: '例如："ChatGPT 4o"',
                labelAnyWords: "包含任意词语 (OR)",
                placeholderAnyWords: "例如：iPhone Android",
                labelNotWords: "不包含词语 (-)",
                placeholderNotWords: "例如：-促销 -广告",
                labelHashtag: "话题标签 (#)",
                placeholderHashtag: "例如：#科技大会",
                labelLang: "语言 (lang:)",
                optLangDefault: "所有语言",
                optLangJa: "日语 (ja)",
                optLangEn: "英语 (en)",
                optLangId: "印尼语 (id)",
                optLangHi: "印地语 (hi)",
                optLangDe: "德语 (de)",
                optLangTr: "土耳其语 (tr)",
                optLangEs: "西班牙语 (es)",
                optLangPt: "葡萄牙语 (pt)",
                optLangAr: "阿拉伯语 (ar)",
                optLangFr: "法语 (fr)",
                optLangKo: "韩语 (ko)",
                optLangRu: "俄语 (ru)",
                optLangZhHans: "简体中文 (zh-cn)",
                optLangZhHant: "繁体中文 (zh-tw)",
                hrSeparator: " ",
                labelFilters: "筛选",
                labelVerified: "认证账号",
                labelLinks: "链接",
                labelImages: "图片",
                labelVideos: "视频",
                labelReposts: "转发",
                labelTimelineHashtags: "话题标签 (#)",
                checkInclude: "包含",
                checkExclude: "排除",
                labelReplies: "回复",
                optRepliesDefault: "默认 (显示全部)",
                optRepliesInclude: "包含回复",
                optRepliesOnly: "仅回复",
                optRepliesExclude: "排除回复",
                labelEngagement: "互动量",
                placeholderMinReplies: "最少回复",
                placeholderMinLikes: "最少喜欢",
                placeholderMinRetweets: "最少转发",
                labelDateRange: "日期范围",
                labelDateShortcut: "快速选择",
                optDate1Day: "过去 24 小时",
                optDate1Week: "过去 1 周",
                optDate1Month: "过去 1 个月",
                optDate3Months: "过去 3 个月",
                optDate6Months: "过去 6 个月",
                optDate1Year: "过去 1 年",
                optDate2Years: "过去 2 年",
                optDate3Years: "过去 3 年",
                optDate5Years: "过去 5 年",
                optDateClear: "清除日期",
                tooltipSince: "起始日期",
                tooltipUntil: "结束日期",
                labelFromUser: "来自这些账号 (from:)",
                placeholderFromUser: "例如：@X",
                labelToUser: "发送给这些账号 (to:)",
                placeholderToUser: "例如：@google",
                labelMentioning: "提及这些账号 (@)",
                placeholderMentioning: "例如：@OpenAI",
                buttonClear: "清除",
                buttonApply: "搜索",
                tooltipTrigger: "打开高级搜索",
                buttonOpen: "打开",

                tabSearch: "搜索",
                tabHistory: "历史",
                tabSaved: "已保存",
                buttonSave: "保存",
                buttonSaved: "已保存",
                secretMode: "无痕模式",
                secretOn: "无痕模式已开启 (不记录历史)",
                secretOff: "无痕模式已关闭",
                toastSaved: "已保存。",
                toastDeleted: "已删除。",
                toastReordered: "顺序已更新。",
                emptyHistory: "暂无历史记录。",
                emptySaved: "暂无保存的搜索。请在搜索标签页左下角点击保存按钮添加。",
                run: "运行",
                delete: "删除",
                updated: "已更新。",
                tooltipSecret: "切换无痕模式 (不记录搜索历史)",
                historyClearAll: "全部清除",
                confirmClearHistory: "确定要清除所有历史记录吗？",

                labelAccountScope: "账号范围",
                optAccountAll: "所有账号",
                optAccountFollowing: "关注的账号",
                labelLocationScope: "位置范围",
                optLocationAll: "所有位置",
                optLocationNearby: "附近",
                chipFollowing: "已关注",
                chipNearby: "附近",

                labelSearchTarget: "搜索目标",
                labelHitName: "排除仅在显示名称中的匹配",
                labelHitHandle: "排除仅在用户名 (@handle) 中的匹配",
                hintSearchTarget: "隐藏仅在名称或用户名中匹配（而非正文）的帖子。",
                hintName: "如果关键词仅出现在显示名称中，则隐藏。",
                hintHandle: "如果关键词仅出现在 @用户名 中，则隐藏。例外：当查询中明确使用了 from:/to:/@ 时除外。",

                tabMute: "屏蔽",
                labelMuteWord: "添加屏蔽词",
                placeholderMuteWord: "例如：剧透",
                labelCaseSensitive: "区分大小写",
                labelWordBoundary: "全字匹配",
                labelEnabled: "已启用",
                labelEnableAll: "全部启用",
                buttonAdd: "添加",
                emptyMuted: "暂无屏蔽词。",
                mutedListTitle: "屏蔽词",
                mutedListHeading: "屏蔽列表",
                optMuteHidden: "隐藏",
                optMuteCollapsed: "折叠",
                placeholderFilterMute: "筛选屏蔽词...",
                muteLabel: "已屏蔽: ",
                buttonShow: "显示",
                muteHit: "屏蔽正文匹配项",
                buttonRemute: "重新屏蔽",
                buttonImport: "导入",
                buttonExport: "导出",

                /* Accounts tab */
                tabAccounts: "账号",
                emptyAccounts: "暂无账号。请打开个人资料页并点击添加按钮进行保存。",
                buttonAddAccount: "添加账号",
                toastAccountAdded: "账号已添加。",
                toastAccountExists: "已存在。",
                buttonConfirm: "确认",

                /* Lists tab */
                tabLists: "列表",
                emptyLists: "暂无列表。请打开列表页并点击右上角的 + 按钮添加。",
                buttonAddList: "添加列表",
                toastListAdded: "列表已添加。",
                toastListExists: "已存在。",

                /* History tab */
                placeholderSearchHistory: "搜索历史 (查询词)",
                labelSortBy: "排序:",
                placeholderSearchSaved: "搜索已保存 (查询词)",
                sortNewest: "最新",
                sortOldest: "最旧",
                sortNameAsc: "查询词 (A-Z)",
                sortNameDesc: "查询词 (Z-A)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "筛选账号 (@, 名称)",
                placeholderFilterLists: "筛选列表 (名称, URL)",
                buttonAddFolder: "+文件夹",
                folderFilterAll: "全部",
                folderFilterUnassigned: "未分类",
                folderRename: "重命名",
                folderRenameTitle: "重命名文件夹",
                folderDelete: "删除",
                folderDeleteTitle: "删除文件夹",
                promptNewFolder: "新文件夹名称",
                confirmDeleteFolder: "确定要删除此文件夹及其内部所有项目吗？此操作无法撤销。",
                optListsAll: "列表",
                defaultSavedFolders: "已保存搜索",

                /* Favorites */
                tabFavorites: "收藏",
                emptyFavorites: "暂无收藏的帖子。点击帖子上的 ★ 按钮进行保存。",
                optFavoritesAll: "所有收藏",
                toastFavorited: "已添加到收藏。",
                toastUnfavorited: "已从收藏中移除。",

                /* Settings */
                settingsTitle: "设置",
                settingsTitleGeneral: "通用",
                settingsTitleFeatures: "标签显示",
                settingsTitleData: "数据管理",
                buttonClose: "关闭",
                labelUILang: "界面语言",
                optUILangAuto: "自动",
                labelInitialTab: "启动时打开的标签页",
                optInitialTabLast: "上次打开的标签页 (默认)",
                labelImportExport: "导入 / 导出",
                placeholderSettingsJSON: "请在此粘贴备份 JSON...",
                tooltipSettings: "打开设置",
                toastImported: "已导入。",
                toastExported: "已导出到文件。",
                alertInvalidJSON: "无效的 JSON 文件。",
                alertInvalidData: "无效的数据格式。",
                alertInvalidApp: '此文件不是 "Advanced Search for X" 的备份数据。',
                buttonReset: "重置所有数据",
                confirmResetAll: "确定要重置所有数据吗？此操作无法撤销。",
                toastReset: "所有数据已重置。",
                buttonImportSuccess: "导入成功 👍️",

                /* Favorites Sort */
                sortSavedNewest: "保存日期 (最新)",
                sortSavedOldest: "保存日期 (最旧)",
                sortPostedNewest: "发布日期 (最新)",
                sortPostedOldest: "发布日期 (最旧)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: '未分类',
                FT_DROPDOWN_TITLE: '收藏标签',
                FT_DROPDOWN_SETTINGS_TITLE: '收藏标签设置',
                FT_DROPDOWN_NEW_TAG: '新建标签',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: '标签名称',
                FT_DROPDOWN_NEW_TAG_ADD: '添加',
                FT_FILTER_ALL: '全部',
                FT_SETTINGS_TITLE: '收藏标签设置',
                FT_SETTINGS_EMPTY_TAG_LIST: '暂无标签。您可以从“新建标签”添加。',
                FT_SETTINGS_UNCATEGORIZED_NAME: '未分类',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: '“未分类”的名称无法更改。',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '“未分类”无法被删除。',
                FT_SETTINGS_CLOSE: '关闭',
                FT_SETTINGS_DELETE_BUTTON: '删除',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: '显示设置',
                FT_SETTINGS_DISPLAY_MODE_LABEL: '标签显示格式',
                FT_SETTINGS_DISPLAY_MODE_LEAF: '仅末级 (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: '完整路径 (full)',
                FT_CONFIRM_DELETE_TAG_MSG: '确定要删除标签“{tagName}”吗？\n带有此标签的收藏将变为“未分类”。',
                FT_SETTINGS_BUTTON_TITLE: '收藏标签设置',

                /* --- Cloud Sync --- */
                settingsTitleSync: "云同步",
                chipBeta: "Beta",
                labelSyncEndpoint: "端点 URL",
                linkSyncSetup: "设置指南",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_zh-CN.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "同步 ID (UUID)",
                placeholderSyncId: "粘贴或生成 UUID",
                buttonGenerate: "生成",
                labelSyncPassword: "加密密码",
                placeholderSyncPassword: "请输入强密码",
                tooltipShowHidePassword: "显示/隐藏密码",
                noteSyncEncryption: "* 数据在上传前会在本地加密。服务器无法获知此密码。",
                labelSyncChangePass: "更改",
                promptNewPassword: "请输入新密码：",
                confirmRotation: "更改密码并重新加密所有数据？\n\n* 请确保您已同步最新数据。\n* 此操作无法撤消。",
                toastPassChanged: "密码已更改。",
                toastRotationFailed: "更改失败",
                syncStatusRotating: "更新密钥...",
                labelSyncStatus: "状态: ",
                buttonSyncNow: "立即同步",

                /* Sync Status Messages */
                toastSynced: "同步完成。",
                toastSyncFailed: "同步失败。",
                syncStatusIdle: "空闲",
                syncStatusNotConfigured: "未配置",
                syncStatusConnecting: "连接中...",
                syncStatusPulling: "拉取中...",
                syncStatusPushing: "推送中...",
                syncStatusMerging: "合并中...",
                syncStatusSynced: "已同步",
                syncStatusError: "错误",
            },
            'zh-TW': {
                modalTitle: "進階搜尋",
                tooltipClose: "關閉",
                labelAllWords: "包含所有詞語",
                placeholderAllWords: "例如：AI 新聞",
                labelExactPhrase: "包含精確詞組",
                placeholderExactPhrase: '例如："ChatGPT 4o"',
                labelAnyWords: "包含任一詞語 (OR)",
                placeholderAnyWords: "例如：iPhone Android",
                labelNotWords: "排除詞語 (-)",
                placeholderNotWords: "例如：-促銷 -廣告",
                labelHashtag: "主題標籤 (#)",
                placeholderHashtag: "例如：#科技大會",
                labelLang: "語言 (lang:)",
                optLangDefault: "所有語言",
                optLangJa: "日語 (ja)",
                optLangEn: "英語 (en)",
                optLangId: "印尼語 (id)",
                optLangHi: "印地語 (hi)",
                optLangDe: "德語 (de)",
                optLangTr: "土耳其語 (tr)",
                optLangEs: "西班牙語 (es)",
                optLangPt: "葡萄牙語 (pt)",
                optLangAr: "阿拉伯語 (ar)",
                optLangFr: "法語 (fr)",
                optLangKo: "韓語 (ko)",
                optLangRu: "俄語 (ru)",
                optLangZhHans: "簡體中文 (zh-cn)",
                optLangZhHant: "繁體中文 (zh-tw)",
                hrSeparator: " ",
                labelFilters: "篩選",
                labelVerified: "已認證帳號",
                labelLinks: "連結",
                labelImages: "圖片",
                labelVideos: "影片",
                labelReposts: "轉發",
                labelTimelineHashtags: "主題標籤 (#)",
                checkInclude: "包含",
                checkExclude: "排除",
                labelReplies: "回覆",
                optRepliesDefault: "預設 (顯示全部)",
                optRepliesInclude: "包含回覆",
                optRepliesOnly: "僅限回覆",
                optRepliesExclude: "排除回覆",
                labelEngagement: "互動量",
                placeholderMinReplies: "最少回覆",
                placeholderMinLikes: "最少喜歡",
                placeholderMinRetweets: "最少轉發",
                labelDateRange: "日期範圍",
                labelDateShortcut: "快速範圍",
                optDate1Day: "過去 24 小時",
                optDate1Week: "過去 1 週",
                optDate1Month: "過去 1 個月",
                optDate3Months: "過去 3 個月",
                optDate6Months: "過去 6 個月",
                optDate1Year: "過去 1 年",
                optDate2Years: "過去 2 年",
                optDate3Years: "過去 3 年",
                optDate5Years: "過去 5 年",
                optDateClear: "清除日期",
                tooltipSince: "開始日期",
                tooltipUntil: "結束日期",
                labelFromUser: "來自這些帳號 (from:)",
                placeholderFromUser: "例如：@X",
                labelToUser: "發送給這些帳號 (to:)",
                placeholderToUser: "例如：@google",
                labelMentioning: "提及這些帳號 (@)",
                placeholderMentioning: "例如：@OpenAI",
                buttonClear: "清除",
                buttonApply: "搜尋",
                tooltipTrigger: "打開進階搜尋",
                buttonOpen: "打開",

                tabSearch: "搜尋",
                tabHistory: "紀錄",
                tabSaved: "已儲存",
                buttonSave: "儲存",
                buttonSaved: "已儲存",
                secretMode: "無痕模式",
                secretOn: "無痕模式已開啟 (不記錄歷史)",
                secretOff: "無痕模式已關閉",
                toastSaved: "已儲存。",
                toastDeleted: "已刪除。",
                toastReordered: "順序已更新。",
                emptyHistory: "暫無搜尋紀錄。",
                emptySaved: "暫無儲存的搜尋。請在搜尋分頁左下角點擊儲存按鈕添加。",
                run: "執行",
                delete: "刪除",
                updated: "已更新。",
                tooltipSecret: "切換無痕模式 (不記錄搜尋歷史)",
                historyClearAll: "全部清除",
                confirmClearHistory: "確定要清除所有搜尋紀錄嗎？",

                labelAccountScope: "帳號範圍",
                optAccountAll: "所有帳號",
                optAccountFollowing: "跟隨的帳號",
                labelLocationScope: "位置範圍",
                optLocationAll: "所有位置",
                optLocationNearby: "附近",
                chipFollowing: "正在跟隨",
                chipNearby: "附近",

                labelSearchTarget: "搜尋目標",
                labelHitName: "排除僅在顯示名稱中的相符項目",
                labelHitHandle: "排除僅在使用者名稱 (@handle) 中的相符項目",
                hintSearchTarget: "隱藏僅在名稱或使用者名稱中相符（而非內文）的貼文。",
                hintName: "如果關鍵字僅出現在顯示名稱中，則隱藏。",
                hintHandle: "如果關鍵字僅出現在 @使用者名稱 中，則隱藏。例外：當查詢中明確使用了 from:/to:/@ 時除外。",

                tabMute: "靜音",
                labelMuteWord: "新增靜音詞彙",
                placeholderMuteWord: "例如：劇透",
                labelCaseSensitive: "區分大小寫",
                labelWordBoundary: "全字匹配",
                labelEnabled: "已啟用",
                labelEnableAll: "全部啟用",
                buttonAdd: "新增",
                emptyMuted: "暫無靜音詞彙。",
                mutedListTitle: "靜音詞彙",
                mutedListHeading: "靜音清單",
                optMuteHidden: "隱藏",
                optMuteCollapsed: "收合",
                placeholderFilterMute: "篩選靜音詞彙...",
                muteLabel: "已靜音: ",
                buttonShow: "顯示",
                muteHit: "靜音內文相符項目",
                buttonRemute: "重新靜音",
                buttonImport: "匯入",
                buttonExport: "匯出",

                /* Accounts tab */
                tabAccounts: "帳號",
                emptyAccounts: "暫無帳號。請打開個人檔案頁面並點擊新增按鈕進行儲存。",
                buttonAddAccount: "新增帳號",
                toastAccountAdded: "帳號已新增。",
                toastAccountExists: "已存在。",
                buttonConfirm: "確認",

                /* Lists tab */
                tabLists: "列表",
                emptyLists: "暫無列表。請打開列表頁並點擊右上角的 + 按鈕新增。",
                buttonAddList: "新增列表",
                toastListAdded: "列表已新增。",
                toastListExists: "已存在。",

                /* History tab */
                placeholderSearchHistory: "搜尋紀錄 (關鍵字)",
                labelSortBy: "排序:",
                placeholderSearchSaved: "搜尋已儲存 (關鍵字)",
                sortNewest: "最新",
                sortOldest: "最舊",
                sortNameAsc: "關鍵字 (A-Z)",
                sortNameDesc: "關鍵字 (Z-A)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "篩選帳號 (@, 名稱)",
                placeholderFilterLists: "篩選列表 (名稱, URL)",
                buttonAddFolder: "+資料夾",
                folderFilterAll: "全部",
                folderFilterUnassigned: "未分類",
                folderRename: "重新命名",
                folderRenameTitle: "重新命名資料夾",
                folderDelete: "刪除",
                folderDeleteTitle: "刪除資料夾",
                promptNewFolder: "新資料夾名稱",
                confirmDeleteFolder: "確定要刪除此資料夾及其內部所有項目嗎？此操作無法復原。",
                optListsAll: "列表",
                defaultSavedFolders: "已儲存的搜尋",

                /* Favorites */
                tabFavorites: "收藏",
                emptyFavorites: "暫無收藏的貼文。點擊貼文上的 ★ 按鈕進行儲存。",
                optFavoritesAll: "所有收藏",
                toastFavorited: "已加入收藏。",
                toastUnfavorited: "已從收藏中移除。",

                /* Settings */
                settingsTitle: "設定",
                settingsTitleGeneral: "一般",
                settingsTitleFeatures: "標籤顯示",
                settingsTitleData: "資料管理",
                buttonClose: "關閉",
                labelUILang: "介面語言",
                optUILangAuto: "自動",
                labelInitialTab: "啟動時開啟的分頁",
                optInitialTabLast: "上次開啟的分頁 (預設)",
                labelImportExport: "匯入 / 匯出",
                placeholderSettingsJSON: "請在此貼上備份 JSON...",
                tooltipSettings: "打開設定",
                toastImported: "已匯入。",
                toastExported: "已匯出至檔案。",
                alertInvalidJSON: "無效的 JSON 檔案。",
                alertInvalidData: "無效的資料格式。",
                alertInvalidApp: '此檔案不是 "Advanced Search for X" 的備份資料。',
                buttonReset: "重設所有資料",
                confirmResetAll: "確定要重設所有資料嗎？此操作無法復原。",
                toastReset: "所有資料已重設。",
                buttonImportSuccess: "匯入成功 👍️",

                /* Favorites Sort */
                sortSavedNewest: "儲存日期 (最新)",
                sortSavedOldest: "儲存日期 (最舊)",
                sortPostedNewest: "發布日期 (最新)",
                sortPostedOldest: "發布日期 (最舊)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: '未分類',
                FT_DROPDOWN_TITLE: '收藏標籤',
                FT_DROPDOWN_SETTINGS_TITLE: '收藏標籤設定',
                FT_DROPDOWN_NEW_TAG: '新建標籤',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: '標籤名稱',
                FT_DROPDOWN_NEW_TAG_ADD: '新增',
                FT_FILTER_ALL: '全部',
                FT_SETTINGS_TITLE: '收藏標籤設定',
                FT_SETTINGS_EMPTY_TAG_LIST: '暫無標籤。您可以從「新建標籤」新增。',
                FT_SETTINGS_UNCATEGORIZED_NAME: '未分類',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: '「未分類」的名稱無法更改。',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '「未分類」無法被刪除。',
                FT_SETTINGS_CLOSE: '關閉',
                FT_SETTINGS_DELETE_BUTTON: '刪除',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: '顯示設定',
                FT_SETTINGS_DISPLAY_MODE_LABEL: '標籤顯示格式',
                FT_SETTINGS_DISPLAY_MODE_LEAF: '僅末級 (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: '完整路徑 (full)',
                FT_CONFIRM_DELETE_TAG_MSG: '確定要刪除標籤「{tagName}」嗎？\n帶有此標籤的收藏將變為「未分類」。',
                FT_SETTINGS_BUTTON_TITLE: '收藏標籤設定',

                /* --- Cloud Sync --- */
                settingsTitleSync: "雲端同步",
                chipBeta: "Beta",
                labelSyncEndpoint: "端點 URL",
                linkSyncSetup: "設定指南",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_zh-TW.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "同步 ID (UUID)",
                placeholderSyncId: "貼上或產生 UUID",
                buttonGenerate: "產生",
                labelSyncPassword: "加密密碼",
                placeholderSyncPassword: "請輸入高強度密碼",
                tooltipShowHidePassword: "顯示/隱藏密碼",
                noteSyncEncryption: "* 資料在上傳前會於本地加密。伺服器無法得知此密碼。",
                labelSyncChangePass: "變更",
                promptNewPassword: "請輸入新密碼：",
                confirmRotation: "變更密碼並重新加密所有資料？\n\n* 請確保您已同步最新資料。\n* 此操作無法復原。",
                toastPassChanged: "密碼已變更。",
                toastRotationFailed: "變更失敗",
                syncStatusRotating: "更新金鑰...",
                labelSyncStatus: "狀態: ",
                buttonSyncNow: "立即同步",

                /* Sync Status Messages */
                toastSynced: "同步完成。",
                toastSyncFailed: "同步失敗。",
                syncStatusIdle: "閒置",
                syncStatusNotConfigured: "未設定",
                syncStatusConnecting: "連線中...",
                syncStatusPulling: "下載中...",
                syncStatusPushing: "上傳中...",
                syncStatusMerging: "合併中...",
                syncStatusSynced: "已同步",
                syncStatusError: "錯誤",
            },
            'ko': {
                modalTitle: "고급 검색",
                tooltipClose: "닫기",
                labelAllWords: "다음 단어 모두 포함",
                placeholderAllWords: "예: AI 뉴스",
                labelExactPhrase: "정확하게 일치하는 문구",
                placeholderExactPhrase: '예: "ChatGPT 4o"',
                labelAnyWords: "다음 단어 중 하나라도 포함 (OR)",
                placeholderAnyWords: "예: iPhone Android",
                labelNotWords: "다음 단어 제외 (-)",
                placeholderNotWords: "예: -세일 -광고",
                labelHashtag: "해시태그 (#)",
                placeholderHashtag: "예: #개발자",
                labelLang: "언어 (lang:)",
                optLangDefault: "모든 언어",
                optLangJa: "일본어 (ja)",
                optLangEn: "영어 (en)",
                optLangId: "인도네시아어 (id)",
                optLangHi: "힌디어 (hi)",
                optLangDe: "독일어 (de)",
                optLangTr: "튀르키예어 (tr)",
                optLangEs: "스페인어 (es)",
                optLangPt: "포르투갈어 (pt)",
                optLangAr: "아랍어 (ar)",
                optLangFr: "프랑스어 (fr)",
                optLangKo: "한국어 (ko)",
                optLangRu: "러시아어 (ru)",
                optLangZhHans: "중국어 간체 (zh-cn)",
                optLangZhHant: "중국어 번체 (zh-tw)",
                hrSeparator: " ",
                labelFilters: "필터",
                labelVerified: "인증된 계정",
                labelLinks: "링크",
                labelImages: "이미지",
                labelVideos: "동영상",
                labelReposts: "재게시",
                labelTimelineHashtags: "해시태그 (#)",
                checkInclude: "포함",
                checkExclude: "제외",
                labelReplies: "답글",
                optRepliesDefault: "기본 (모두 표시)",
                optRepliesInclude: "답글 포함",
                optRepliesOnly: "답글만",
                optRepliesExclude: "답글 제외",
                labelEngagement: "참여",
                placeholderMinReplies: "최소 답글 수",
                placeholderMinLikes: "최소 마음에 들어요 수",
                placeholderMinRetweets: "최소 재게시 수",
                labelDateRange: "날짜 범위",
                labelDateShortcut: "빠른 범위 설정",
                optDate1Day: "지난 24시간",
                optDate1Week: "지난 1주",
                optDate1Month: "지난 1개월",
                optDate3Months: "지난 3개월",
                optDate6Months: "지난 6개월",
                optDate1Year: "지난 1년",
                optDate2Years: "지난 2년",
                optDate3Years: "지난 3년",
                optDate5Years: "지난 5년",
                optDateClear: "날짜 초기화",
                tooltipSince: "시작일",
                tooltipUntil: "종료일",
                labelFromUser: "다음 계정에서 (from:)",
                placeholderFromUser: "예: @X",
                labelToUser: "다음 계정으로 (to:)",
                placeholderToUser: "예: @google",
                labelMentioning: "다음 계정 언급 (@)",
                placeholderMentioning: "예: @OpenAI",
                buttonClear: "지우기",
                buttonApply: "검색",
                tooltipTrigger: "고급 검색 열기",
                buttonOpen: "열기",

                tabSearch: "검색",
                tabHistory: "기록",
                tabSaved: "저장됨",
                buttonSave: "저장",
                buttonSaved: "저장됨",
                secretMode: "시크릿 모드",
                secretOn: "시크릿 모드 켜짐 (기록되지 않음)",
                secretOff: "시크릿 모드 꺼짐",
                toastSaved: "저장되었습니다.",
                toastDeleted: "삭제되었습니다.",
                toastReordered: "순서가 업데이트되었습니다.",
                emptyHistory: "기록이 없습니다.",
                emptySaved: "저장된 검색이 없습니다. 검색 탭 왼쪽 하단의 저장 버튼으로 추가하세요.",
                run: "실행",
                delete: "삭제",
                updated: "업데이트됨.",
                tooltipSecret: "시크릿 모드 전환 (검색 기록을 저장하지 않음)",
                historyClearAll: "모두 지우기",
                confirmClearHistory: "모든 기록을 삭제하시겠습니까?",

                labelAccountScope: "계정 범위",
                optAccountAll: "모든 계정",
                optAccountFollowing: "팔로우 중인 계정",
                labelLocationScope: "위치 범위",
                optLocationAll: "모든 위치",
                optLocationNearby: "내 주변",
                chipFollowing: "팔로잉",
                chipNearby: "주변",

                labelSearchTarget: "검색 대상",
                labelHitName: "표시 이름(닉네임)만 일치하는 결과 제외",
                labelHitHandle: "사용자 아이디(@handle)만 일치하는 결과 제외",
                hintSearchTarget: "본문이 아닌 이름/아이디만 일치하는 게시물을 숨깁니다.",
                hintName: "키워드가 표시 이름에만 포함된 경우 숨깁니다.",
                hintHandle: "키워드가 @아이디에만 포함된 경우 숨깁니다. 예외: 검색어에 from:/to:/@ 등으로 명시한 경우는 표시합니다.",

                tabMute: "뮤트",
                labelMuteWord: "뮤트 단어 추가",
                placeholderMuteWord: "예: 스포일러",
                labelCaseSensitive: "대소문자 구분",
                labelWordBoundary: "단어 단위",
                labelEnabled: "활성화",
                labelEnableAll: "모두 활성화",
                buttonAdd: "추가",
                emptyMuted: "뮤트된 단어가 없습니다.",
                mutedListTitle: "뮤트 단어",
                mutedListHeading: "뮤트 목록",
                optMuteHidden: "숨기기",
                optMuteCollapsed: "접기",
                placeholderFilterMute: "뮤트 단어 검색...",
                muteLabel: "뮤트됨: ",
                buttonShow: "표시",
                muteHit: "본문 일치 항목 뮤트",
                buttonRemute: "다시 뮤트",
                buttonImport: "가져오기",
                buttonExport: "내보내기",

                /* Accounts tab */
                tabAccounts: "계정",
                emptyAccounts: "저장된 계정이 없습니다. 프로필 페이지를 열고 추가 버튼을 눌러 저장하세요.",
                buttonAddAccount: "계정 추가",
                toastAccountAdded: "계정이 추가되었습니다.",
                toastAccountExists: "이미 추가되었습니다.",
                buttonConfirm: "확인",

                /* Lists tab */
                tabLists: "리스트",
                emptyLists: "저장된 리스트가 없습니다. 리스트를 열고 우측 상단의 + 버튼을 눌러 추가하세요.",
                buttonAddList: "리스트 추가",
                toastListAdded: "리스트가 추가되었습니다.",
                toastListExists: "이미 추가되었습니다.",

                /* History tab */
                placeholderSearchHistory: "기록 검색 (검색어)",
                labelSortBy: "정렬:",
                placeholderSearchSaved: "저장된 항목 검색 (검색어)",
                sortNewest: "최신순",
                sortOldest: "오래된순",
                sortNameAsc: "이름순 (ㄱ-ㅎ)",
                sortNameDesc: "이름순 (ㅎ-ㄱ)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "계정 필터링 (@, 이름)",
                placeholderFilterLists: "리스트 필터링 (이름, URL)",
                buttonAddFolder: "+폴더",
                folderFilterAll: "전체",
                folderFilterUnassigned: "미분류",
                folderRename: "이름 변경",
                folderRenameTitle: "폴더 이름 변경",
                folderDelete: "삭제",
                folderDeleteTitle: "폴더 삭제",
                promptNewFolder: "새 폴더 이름",
                confirmDeleteFolder: "이 폴더와 내부의 모든 항목을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
                optListsAll: "리스트",
                defaultSavedFolders: "저장된 검색",

                /* Favorites */
                tabFavorites: "즐겨찾기",
                emptyFavorites: "즐겨찾기에 추가한 게시물이 없습니다. 게시물의 ★ 버튼을 눌러 저장하세요.",
                optFavoritesAll: "모든 즐겨찾기",
                toastFavorited: "즐겨찾기에 추가했습니다.",
                toastUnfavorited: "즐겨찾기에서 삭제했습니다.",

                /* Settings */
                settingsTitle: "설정",
                settingsTitleGeneral: "일반",
                settingsTitleFeatures: "탭 표시 설정",
                settingsTitleData: "데이터 관리",
                buttonClose: "닫기",
                labelUILang: "UI 언어",
                optUILangAuto: "자동",
                labelInitialTab: "시작 시 열 탭",
                optInitialTabLast: "마지막에 연 탭 (기본)",
                labelImportExport: "가져오기 / 내보내기",
                placeholderSettingsJSON: "백업 JSON을 여기에 붙여넣으세요...",
                tooltipSettings: "설정 열기",
                toastImported: "가져오기가 완료되었습니다.",
                toastExported: "파일로 내보냈습니다.",
                alertInvalidJSON: "유효하지 않은 JSON 파일입니다.",
                alertInvalidData: "유효하지 않은 데이터 형식입니다.",
                alertInvalidApp: '"Advanced Search for X"의 백업 파일이 아닙니다.',
                buttonReset: "모든 데이터 초기화",
                confirmResetAll: "모든 데이터를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
                toastReset: "모든 데이터가 초기화되었습니다.",
                buttonImportSuccess: "가져오기 성공 👍️",

                /* Favorites Sort */
                sortSavedNewest: "저장일 (최신순)",
                sortSavedOldest: "저장일 (오래된순)",
                sortPostedNewest: "게시일 (최신순)",
                sortPostedOldest: "게시일 (오래된순)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: '미분류',
                FT_DROPDOWN_TITLE: '태그',
                FT_DROPDOWN_SETTINGS_TITLE: '태그 설정',
                FT_DROPDOWN_NEW_TAG: '새 태그',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: '태그 이름',
                FT_DROPDOWN_NEW_TAG_ADD: '추가',
                FT_FILTER_ALL: '전체',
                FT_SETTINGS_TITLE: '태그 설정',
                FT_SETTINGS_EMPTY_TAG_LIST:
                    '태그가 없습니다. "새 태그"에서 추가할 수 있습니다.',
                FT_SETTINGS_UNCATEGORIZED_NAME: '미분류',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP:
                    '"미분류" 이름은 변경할 수 없습니다.',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP:
                    '"미분류"는 삭제할 수 없습니다.',
                FT_SETTINGS_CLOSE: '닫기',
                FT_SETTINGS_DELETE_BUTTON: '삭제',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: '표시',
                FT_SETTINGS_DISPLAY_MODE_LABEL: '태그 표시 형식',
                FT_SETTINGS_DISPLAY_MODE_LEAF: '말단만 (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: '전체 경로 (full)',
                FT_CONFIRM_DELETE_TAG_MSG: '태그 "{tagName}"을(를) 삭제하시겠습니까?\n이 태그가 지정된 항목은 "미분류"가 됩니다.',
                FT_SETTINGS_BUTTON_TITLE: '태그 설정',

                /* --- Cloud Sync --- */
                settingsTitleSync: "클라우드 동기화",
                chipBeta: "베타",
                labelSyncEndpoint: "엔드포인트 URL",
                linkSyncSetup: "설정 가이드",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_ko.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "동기화 ID (UUID)",
                placeholderSyncId: "UUID 붙여넣기 또는 생성",
                buttonGenerate: "생성",
                labelSyncPassword: "암호화 비밀번호",
                placeholderSyncPassword: "강력한 비밀번호 필요",
                tooltipShowHidePassword: "비밀번호 표시/숨기기",
                noteSyncEncryption: "* 데이터는 업로드 전 로컬에서 암호화됩니다. 서버는 비밀번호를 알 수 없습니다.",
                labelSyncChangePass: "변경",
                promptNewPassword: "새 비밀번호를 입력하세요:",
                confirmRotation: "비밀번호를 변경하고 모든 데이터를 다시 암호화하시겠습니까?\n\n* 최신 데이터가 동기화되어 있는지 확인하세요.\n* 이 작업은 취소할 수 없습니다.",
                toastPassChanged: "비밀번호가 변경되었습니다.",
                toastRotationFailed: "변경 실패",
                syncStatusRotating: "키 갱신 중...",
                labelSyncStatus: "상태: ",
                buttonSyncNow: "지금 동기화",

                /* Sync Status Messages */
                toastSynced: "동기화 완료.",
                toastSyncFailed: "동기화 실패.",
                syncStatusIdle: "대기 중",
                syncStatusNotConfigured: "설정되지 않음",
                syncStatusConnecting: "연결 중...",
                syncStatusPulling: "가져오는 중...",
                syncStatusPushing: "보내는 중...",
                syncStatusMerging: "병합 중...",
                syncStatusSynced: "동기화됨",
                syncStatusError: "오류",
            },
            'fr': {
                modalTitle: "Recherche avancée",
                tooltipClose: "Fermer",
                labelAllWords: "Tous ces mots",
                placeholderAllWords: "ex: AI actualités",
                labelExactPhrase: "Cette phrase exacte",
                placeholderExactPhrase: 'ex: "ChatGPT 4o"',
                labelAnyWords: "L'un de ces mots (OR)",
                placeholderAnyWords: "ex: iPhone Android",
                labelNotWords: "Aucun de ces mots (-)",
                placeholderNotWords: "ex: -soldes -pub",
                labelHashtag: "Hashtags (#)",
                placeholderHashtag: "ex: #Paris2024",
                labelLang: "Langue (lang:)",
                optLangDefault: "Toutes les langues",
                optLangJa: "Japonais (ja)",
                optLangEn: "Anglais (en)",
                optLangId: "Indonésien (id)",
                optLangHi: "Hindi (hi)",
                optLangDe: "Allemand (de)",
                optLangTr: "Turc (tr)",
                optLangEs: "Espagnol (es)",
                optLangPt: "Portugais (pt)",
                optLangAr: "Arabe (ar)",
                optLangFr: "Français (fr)",
                optLangKo: "Coréen (ko)",
                optLangRu: "Russe (ru)",
                optLangZhHans: "Chinois simplifié (zh-cn)",
                optLangZhHant: "Chinois traditionnel (zh-tw)",
                hrSeparator: " ",
                labelFilters: "Filtres",
                labelVerified: "Comptes certifiés",
                labelLinks: "Liens",
                labelImages: "Images",
                labelVideos: "Vidéos",
                labelReposts: "Republications",
                labelTimelineHashtags: "Hashtags (#)",
                checkInclude: "Inclure",
                checkExclude: "Exclure",
                labelReplies: "Réponses",
                optRepliesDefault: "Par défaut (Tout)",
                optRepliesInclude: "Inclure les réponses",
                optRepliesOnly: "Réponses uniquement",
                optRepliesExclude: "Exclure les réponses",
                labelEngagement: "Engagement",
                placeholderMinReplies: "Min réponses",
                placeholderMinLikes: "Min J'aime",
                placeholderMinRetweets: "Min republications",
                labelDateRange: "Période",
                labelDateShortcut: "Plage rapide",
                optDate1Day: "Dernières 24h",
                optDate1Week: "Semaine dernière",
                optDate1Month: "Mois dernier",
                optDate3Months: "3 derniers mois",
                optDate6Months: "6 derniers mois",
                optDate1Year: "Année dernière",
                optDate2Years: "2 dernières années",
                optDate3Years: "3 dernières années",
                optDate5Years: "5 dernières années",
                optDateClear: "Effacer les dates",
                tooltipSince: "Depuis cette date",
                tooltipUntil: "Jusqu'à cette date",
                labelFromUser: "De ces comptes (from:)",
                placeholderFromUser: "ex: @X",
                labelToUser: "À ces comptes (to:)",
                placeholderToUser: "ex: @google",
                labelMentioning: "Mentionnant ces comptes (@)",
                placeholderMentioning: "ex: @OpenAI",
                buttonClear: "Effacer",
                buttonApply: "Rechercher",
                tooltipTrigger: "Ouvrir la recherche avancée",
                buttonOpen: "Ouvrir",

                tabSearch: "Recherche",
                tabHistory: "Historique",
                tabSaved: "Enregistré",
                buttonSave: "Enregistrer",
                buttonSaved: "Enregistré",
                secretMode: "Mode privé",
                secretOn: "Mode privé activé (Pas d'historique)",
                secretOff: "Mode privé désactivé",
                toastSaved: "Enregistré.",
                toastDeleted: "Supprimé.",
                toastReordered: "Ordre mis à jour.",
                emptyHistory: "Aucun historique.",
                emptySaved: "Aucune recherche enregistrée. Ajoutez-en via le bouton Enregistrer en bas à gauche de l'onglet Recherche.",
                run: "Lancer",
                delete: "Supprimer",
                updated: "Mis à jour.",
                tooltipSecret: "Basculer le mode privé (aucun historique ne sera enregistré)",
                historyClearAll: "Tout effacer",
                confirmClearHistory: "Effacer tout l'historique ?",

                labelAccountScope: "Comptes",
                optAccountAll: "Tous les comptes",
                optAccountFollowing: "Comptes suivis",
                labelLocationScope: "Lieu",
                optLocationAll: "Tous les lieux",
                optLocationNearby: "Proche de vous",
                chipFollowing: "Abonnements",
                chipNearby: "À proximité",

                labelSearchTarget: "Cible de la recherche",
                labelHitName: "Exclure les résultats dans le nom d'affichage",
                labelHitHandle: "Exclure les résultats dans le nom d'utilisateur (@)",
                hintSearchTarget: "Masquer les posts qui ne correspondent que par le nom ou l'identifiant (pas dans le texte).",
                hintName: "Si un mot-clé n'apparaît que dans le nom d'affichage, le masquer.",
                hintHandle: "Si un mot-clé n'apparaît que dans le @nom_utilisateur, le masquer. Exception : si la requête utilise explicitement from:/to:/@.",

                tabMute: "Masquer",
                labelMuteWord: "Ajouter un mot masqué",
                placeholderMuteWord: "ex: spoiler",
                labelCaseSensitive: "Sensible à la casse",
                labelWordBoundary: "Mot entier",
                labelEnabled: "Activé",
                labelEnableAll: "Tout activer",
                buttonAdd: "Ajouter",
                emptyMuted: "Aucun mot masqué.",
                mutedListTitle: "Mots masqués",
                mutedListHeading: "Liste masquée",
                optMuteHidden: "Masqué",
                optMuteCollapsed: "Réduit",
                placeholderFilterMute: "Filtrer les mots masqués...",
                muteLabel: "Masqué : ",
                buttonShow: "Afficher",
                muteHit: "Masquer les résultats dans le texte",
                buttonRemute: "Masquer à nouveau",
                buttonImport: "Importer",
                buttonExport: "Exporter",

                /* Accounts tab */
                tabAccounts: "Comptes",
                emptyAccounts: "Aucun compte. Ouvrez un profil et cliquez sur le bouton Ajouter pour l'enregistrer.",
                buttonAddAccount: "Ajouter compte",
                toastAccountAdded: "Compte ajouté.",
                toastAccountExists: "Déjà ajouté.",
                buttonConfirm: "Confirmer",

                /* Lists tab */
                tabLists: "Listes",
                emptyLists: "Aucune liste. Ouvrez une liste et cliquez sur le bouton + en haut à droite pour l'ajouter.",
                buttonAddList: "Ajouter liste",
                toastListAdded: "Liste ajoutée.",
                toastListExists: "Déjà ajoutée.",

                /* History tab */
                placeholderSearchHistory: "Historique (requête)",
                labelSortBy: "Trier par :",
                placeholderSearchSaved: "Recherches enregistrées (requête)",
                sortNewest: "Plus récent",
                sortOldest: "Plus ancien",
                sortNameAsc: "Nom (A-Z)",
                sortNameDesc: "Nom (Z-A)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "Filtrer comptes (@, nom)",
                placeholderFilterLists: "Filtrer listes (nom, url)",
                buttonAddFolder: "+Dossier",
                folderFilterAll: "TOUT",
                folderFilterUnassigned: "Non classé",
                folderRename: "Renommer",
                folderRenameTitle: "Renommer le dossier",
                folderDelete: "Supprimer",
                folderDeleteTitle: "Supprimer le dossier",
                promptNewFolder: "Nom du dossier",
                confirmDeleteFolder: "Supprimer ce dossier et tout son contenu ? Cette action est irréversible.",
                optListsAll: "Listes",
                defaultSavedFolders: "Recherches enregistrées",

                /* Favorites */
                tabFavorites: "Favoris",
                emptyFavorites: "Aucun favori. Cliquez sur l'icône ★ d'un tweet pour l'enregistrer.",
                optFavoritesAll: "Tous les favoris",
                toastFavorited: "Ajouté aux favoris.",
                toastUnfavorited: "Retiré des favoris.",

                /* Settings */
                settingsTitle: "Paramètres",
                settingsTitleGeneral: "Général",
                settingsTitleFeatures: "Affichage onglets",
                settingsTitleData: "Données",
                buttonClose: "Fermer",
                labelUILang: "Langue de l'interface",
                optUILangAuto: "Auto",
                labelInitialTab: "Onglet au démarrage",
                optInitialTabLast: "Dernier ouvert (Défaut)",
                labelImportExport: "Importer / Exporter",
                placeholderSettingsJSON: "Collez le JSON de sauvegarde ici...",
                tooltipSettings: "Ouvrir les paramètres",
                toastImported: "Importé.",
                toastExported: "Exporté vers un fichier.",
                alertInvalidJSON: "Fichier JSON invalide.",
                alertInvalidData: "Format de données invalide.",
                alertInvalidApp: 'Ce fichier n\'est pas une sauvegarde valide pour "Advanced Search for X".',
                buttonReset: "Réinitialiser tout",
                confirmResetAll: "Tout réinitialiser ? Cette action est irréversible.",
                toastReset: "Toutes les données ont été réinitialisées.",
                buttonImportSuccess: "Importation réussie 👍️",

                /* Favorites Sort */
                sortSavedNewest: "Date d'ajout (Récent)",
                sortSavedOldest: "Date d'ajout (Ancien)",
                sortPostedNewest: "Date de publication (Récent)",
                sortPostedOldest: "Date de publication (Ancien)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: 'Non classé',
                FT_DROPDOWN_TITLE: 'Tags favoris',
                FT_DROPDOWN_SETTINGS_TITLE: 'Réglages des tags',
                FT_DROPDOWN_NEW_TAG: 'Nouveau tag',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: 'Nom du tag',
                FT_DROPDOWN_NEW_TAG_ADD: 'Ajouter',
                FT_FILTER_ALL: 'Tout',
                FT_SETTINGS_TITLE: 'Réglages des tags favoris',
                FT_SETTINGS_EMPTY_TAG_LIST: 'Aucun tag. Ajoutez-en un depuis "Nouveau tag".',
                FT_SETTINGS_UNCATEGORIZED_NAME: 'Non classé',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: 'Le nom "Non classé" ne peut pas être modifié.',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '"Non classé" ne peut pas être supprimé.',
                FT_SETTINGS_CLOSE: 'Fermer',
                FT_SETTINGS_DELETE_BUTTON: 'Supprimer',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: 'Affichage',
                FT_SETTINGS_DISPLAY_MODE_LABEL: 'Format du tag',
                FT_SETTINGS_DISPLAY_MODE_LEAF: 'Libellé seul (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: 'Chemin complet',
                FT_CONFIRM_DELETE_TAG_MSG: 'Supprimer le tag "{tagName}" ?\nLes favoris associés deviendront "Non classé".',
                FT_SETTINGS_BUTTON_TITLE: 'Réglages des tags',

                /* --- Cloud Sync --- */
                settingsTitleSync: "Synchro Cloud",
                chipBeta: "Bêta",
                labelSyncEndpoint: "URL Endpoint",
                linkSyncSetup: "Guide de configuration",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_fr.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "ID de Synchro (UUID)",
                placeholderSyncId: "Coller ou générer UUID",
                buttonGenerate: "Générer",
                labelSyncPassword: "Mot de passe de chiffrement",
                placeholderSyncPassword: "Mot de passe fort requis",
                tooltipShowHidePassword: "Afficher/Masquer",
                noteSyncEncryption: "* Données chiffrées localement avant envoi. Le serveur ne voit jamais ce mot de passe.",
                labelSyncChangePass: "Modifier",
                promptNewPassword: "Veuillez entrer le nouveau mot de passe :",
                confirmRotation: "Modifier le mot de passe et rechiffrer toutes les données ?\n\n* Assurez-vous d'avoir synchronisé les dernières données.\n* Cette action est irréversible.",
                toastPassChanged: "Mot de passe modifié.",
                toastRotationFailed: "Échec de la modification",
                syncStatusRotating: "Renouvellement des clés...",
                labelSyncStatus: "Statut : ",
                buttonSyncNow: "Synchroniser",

                /* Sync Status Messages */
                toastSynced: "Synchronisation terminée.",
                toastSyncFailed: "Échec de la synchronisation.",
                syncStatusIdle: "Inactif",
                syncStatusNotConfigured: "Non configuré",
                syncStatusConnecting: "Connexion...",
                syncStatusPulling: "Réception...",
                syncStatusPushing: "Envoi...",
                syncStatusMerging: "Fusion...",
                syncStatusSynced: "Synchronisé",
                syncStatusError: "Erreur",
            },
            'es': {
                modalTitle: "Búsqueda avanzada",
                tooltipClose: "Cerrar",
                labelAllWords: "Todas estas palabras",
                placeholderAllWords: "ej. AI noticias",
                labelExactPhrase: "Esta frase exacta",
                placeholderExactPhrase: 'ej. "ChatGPT 4o"',
                labelAnyWords: "Cualquiera de estas palabras (OR)",
                placeholderAnyWords: "ej. iPhone Android",
                labelNotWords: "Ninguna de estas palabras (-)",
                placeholderNotWords: "ej. -oferta -anuncio",
                labelHashtag: "Hashtags (#)",
                placeholderHashtag: "ej. #Tecnología",
                labelLang: "Idioma (lang:)",
                optLangDefault: "Cualquier idioma",
                optLangJa: "Japonés (ja)",
                optLangEn: "Inglés (en)",
                optLangId: "Indonesio (id)",
                optLangHi: "Hindi (hi)",
                optLangDe: "Alemán (de)",
                optLangTr: "Turco (tr)",
                optLangEs: "Español (es)",
                optLangPt: "Portugués (pt)",
                optLangAr: "Árabe (ar)",
                optLangFr: "Francés (fr)",
                optLangKo: "Coreano (ko)",
                optLangRu: "Ruso (ru)",
                optLangZhHans: "Chino simplificado (zh-cn)",
                optLangZhHant: "Chino tradicional (zh-tw)",
                hrSeparator: " ",
                labelFilters: "Filtros",
                labelVerified: "Cuentas verificadas",
                labelLinks: "Enlaces",
                labelImages: "Imágenes",
                labelVideos: "Vídeos",
                labelReposts: "Reposts",
                labelTimelineHashtags: "Hashtags (#)",
                checkInclude: "Incluir",
                checkExclude: "Excluir",
                labelReplies: "Respuestas",
                optRepliesDefault: "Por defecto (Todo)",
                optRepliesInclude: "Incluir respuestas",
                optRepliesOnly: "Solo respuestas",
                optRepliesExclude: "Excluir respuestas",
                labelEngagement: "Interacciones",
                placeholderMinReplies: "Mín. respuestas",
                placeholderMinLikes: "Mín. Me gusta",
                placeholderMinRetweets: "Mín. reposts",
                labelDateRange: "Rango de fechas",
                labelDateShortcut: "Rango rápido",
                optDate1Day: "Últimas 24 horas",
                optDate1Week: "Última semana",
                optDate1Month: "Último mes",
                optDate3Months: "Últimos 3 meses",
                optDate6Months: "Últimos 6 meses",
                optDate1Year: "Último año",
                optDate2Years: "Últimos 2 años",
                optDate3Years: "Últimos 3 años",
                optDate5Years: "Últimos 5 años",
                optDateClear: "Borrar fechas",
                tooltipSince: "Desde esta fecha",
                tooltipUntil: "Hasta esta fecha",
                labelFromUser: "De estas cuentas (from:)",
                placeholderFromUser: "ej. @X",
                labelToUser: "Para estas cuentas (to:)",
                placeholderToUser: "ej. @google",
                labelMentioning: "Mencionando a estas cuentas (@)",
                placeholderMentioning: "ej. @OpenAI",
                buttonClear: "Borrar",
                buttonApply: "Buscar",
                tooltipTrigger: "Abrir búsqueda avanzada",
                buttonOpen: "Abrir",

                tabSearch: "Búsqueda",
                tabHistory: "Historial",
                tabSaved: "Guardado",
                buttonSave: "Guardar",
                buttonSaved: "Guardado",
                secretMode: "Secreto",
                secretOn: "Modo secreto ACTIVADO (sin historial)",
                secretOff: "Modo secreto DESACTIVADO",
                toastSaved: "Guardado.",
                toastDeleted: "Eliminado.",
                toastReordered: "Orden actualizado.",
                emptyHistory: "Aún no hay historial.",
                emptySaved: "No hay búsquedas guardadas. Añade una desde el botón Guardar abajo a la izquierda en la pestaña Búsqueda.",
                run: "Ejecutar",
                delete: "Eliminar",
                updated: "Actualizado.",
                tooltipSecret: "Alternar modo secreto (no se guardará historial)",
                historyClearAll: "Borrar todo",
                confirmClearHistory: "¿Borrar todo el historial?",

                labelAccountScope: "Cuentas",
                optAccountAll: "Todas las cuentas",
                optAccountFollowing: "Cuentas que sigues",
                labelLocationScope: "Ubicación",
                optLocationAll: "Todas las ubicaciones",
                optLocationNearby: "Cerca de ti",
                chipFollowing: "Siguiendo",
                chipNearby: "Cerca",

                labelSearchTarget: "Ámbito de búsqueda",
                labelHitName: "Excluir coincidencias solo en nombre",
                labelHitHandle: "Excluir coincidencias solo en usuario (@)",
                hintSearchTarget: "Ocultar publicaciones que solo coincidan en el nombre o usuario (no en el cuerpo).",
                hintName: "Si la palabra clave aparece solo en el nombre mostrado, ocultarla.",
                hintHandle: "Si la palabra clave aparece solo en el @usuario, ocultarla. Excepción: si la consulta usa explícitamente from:/to:/@.",

                tabMute: "Silenciar",
                labelMuteWord: "Añadir palabra silenciada",
                placeholderMuteWord: "ej. spoiler",
                labelCaseSensitive: "Distinguir mayúsculas",
                labelWordBoundary: "Palabra completa",
                labelEnabled: "Habilitado",
                labelEnableAll: "Habilitar todo",
                buttonAdd: "Añadir",
                emptyMuted: "No hay palabras silenciadas.",
                mutedListTitle: "Palabras silenciadas",
                mutedListHeading: "Lista de silenciados",
                optMuteHidden: "Oculto",
                optMuteCollapsed: "Colapsado",
                placeholderFilterMute: "Filtrar palabras silenciadas...",
                muteLabel: "Silenciado: ",
                buttonShow: "Mostrar",
                muteHit: "Silenciar coincidencias en cuerpo",
                buttonRemute: "Volver a silenciar",
                buttonImport: "Importar",
                buttonExport: "Exportar",

                /* Accounts tab */
                tabAccounts: "Cuentas",
                emptyAccounts: "Aún no hay cuentas. Abre un perfil y haz clic en el botón Añadir para guardarlo.",
                buttonAddAccount: "Añadir cuenta",
                toastAccountAdded: "Cuenta añadida.",
                toastAccountExists: "Ya existe.",
                buttonConfirm: "Confirmar",

                /* Lists tab */
                tabLists: "Listas",
                emptyLists: "Aún no hay listas. Abre una lista y haz clic en el botón + arriba a la derecha para añadirla.",
                buttonAddList: "Añadir lista",
                toastListAdded: "Lista añadida.",
                toastListExists: "Ya existe.",

                /* History tab */
                placeholderSearchHistory: "Historial de búsqueda (consulta)",
                labelSortBy: "Ordenar por:",
                placeholderSearchSaved: "Búsquedas guardadas (consulta)",
                sortNewest: "Más reciente",
                sortOldest: "Más antiguo",
                sortNameAsc: "Nombre (A-Z)",
                sortNameDesc: "Nombre (Z-A)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "Filtrar cuentas (@, nombre)",
                placeholderFilterLists: "Filtrar listas (nombre, url)",
                buttonAddFolder: "+Carpeta",
                folderFilterAll: "TODO",
                folderFilterUnassigned: "Sin asignar",
                folderRename: "Renombrar",
                folderRenameTitle: "Renombrar carpeta",
                folderDelete: "Eliminar",
                folderDeleteTitle: "Eliminar carpeta",
                promptNewFolder: "Nombre de nueva carpeta",
                confirmDeleteFolder: "¿Eliminar esta carpeta y todo su contenido? Esto no se puede deshacer.",
                optListsAll: "Listas",
                defaultSavedFolders: "Búsquedas guardadas",

                /* Favorites */
                tabFavorites: "Favoritos",
                emptyFavorites: "No hay favoritos. Haz clic en el icono ★ de los tweets para guardarlos.",
                optFavoritesAll: "Todos los favoritos",
                toastFavorited: "Añadido a favoritos.",
                toastUnfavorited: "Eliminado de favoritos.",

                /* Settings */
                settingsTitle: "Configuración",
                settingsTitleGeneral: "General",
                settingsTitleFeatures: "Visibilidad de pestañas",
                settingsTitleData: "Datos",
                buttonClose: "Cerrar",
                labelUILang: "Idioma de interfaz",
                optUILangAuto: "Automático",
                labelInitialTab: "Pestaña de inicio",
                optInitialTabLast: "Última abierta (Predeterminado)",
                labelImportExport: "Importar / Exportar",
                placeholderSettingsJSON: "Pega el JSON de respaldo aquí...",
                tooltipSettings: "Abrir configuración",
                toastImported: "Importado.",
                toastExported: "Exportado a archivo.",
                alertInvalidJSON: "Archivo JSON inválido.",
                alertInvalidData: "Formato de datos inválido.",
                alertInvalidApp: 'Este archivo no es un respaldo válido para "Advanced Search for X".',
                buttonReset: "Restablecer todo",
                confirmResetAll: "¿Restablecer todos los datos? Esto no se puede deshacer.",
                toastReset: "Todos los datos han sido restablecidos.",
                buttonImportSuccess: "Importado con éxito 👍️",

                /* Favorites Sort */
                sortSavedNewest: "Fecha de guardado (Reciente)",
                sortSavedOldest: "Fecha de guardado (Antigua)",
                sortPostedNewest: "Fecha de publicación (Reciente)",
                sortPostedOldest: "Fecha de publicación (Antigua)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: 'Sin categoría',
                FT_DROPDOWN_TITLE: 'Etiquetas de favoritos',
                FT_DROPDOWN_SETTINGS_TITLE: 'Configuración de etiquetas',
                FT_DROPDOWN_NEW_TAG: 'Nueva etiqueta',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: 'Nombre de etiqueta',
                FT_DROPDOWN_NEW_TAG_ADD: 'Añadir',
                FT_FILTER_ALL: 'Todo',
                FT_SETTINGS_TITLE: 'Configuración de etiquetas',
                FT_SETTINGS_EMPTY_TAG_LIST: 'No hay etiquetas. Añade una desde "Nueva etiqueta".',
                FT_SETTINGS_UNCATEGORIZED_NAME: 'Sin categoría',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: 'El nombre "Sin categoría" no se puede cambiar.',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '"Sin categoría" no se puede eliminar.',
                FT_SETTINGS_CLOSE: 'Cerrar',
                FT_SETTINGS_DELETE_BUTTON: 'Eliminar',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: 'Visualización',
                FT_SETTINGS_DISPLAY_MODE_LABEL: 'Formato de etiqueta',
                FT_SETTINGS_DISPLAY_MODE_LEAF: 'Solo etiqueta (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: 'Ruta completa (full)',
                FT_CONFIRM_DELETE_TAG_MSG: '¿Eliminar la etiqueta "{tagName}"?\nLos favoritos con esta etiqueta pasarán a "Sin categoría".',
                FT_SETTINGS_BUTTON_TITLE: 'Configuración de etiquetas',

                /* --- Cloud Sync --- */
                settingsTitleSync: "Sincronización en la nube",
                chipBeta: "Beta",
                labelSyncEndpoint: "URL del Endpoint",
                linkSyncSetup: "Guía de configuración",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_es.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "ID de Sincronización (UUID)",
                placeholderSyncId: "Pegar o generar UUID",
                buttonGenerate: "Generar",
                labelSyncPassword: "Contraseña de cifrado",
                placeholderSyncPassword: "Se requiere contraseña segura",
                tooltipShowHidePassword: "Mostrar/Ocultar",
                noteSyncEncryption: "* Los datos se cifran localmente antes de subir. El servidor nunca ve esta contraseña.",
                labelSyncChangePass: "Cambiar",
                promptNewPassword: "Introduce la nueva contraseña:",
                confirmRotation: "¿Cambiar la contraseña y volver a cifrar todos los datos?\n\n* Asegúrate de tener los datos más recientes sincronizados.\n* Esta acción no se puede deshacer.",
                toastPassChanged: "Contraseña cambiada.",
                toastRotationFailed: "Fallo al cambiar",
                syncStatusRotating: "Rotando claves...",
                labelSyncStatus: "Estado: ",
                buttonSyncNow: "Sincronizar ahora",

                /* Sync Status Messages */
                toastSynced: "Sincronización completada.",
                toastSyncFailed: "Fallo de sincronización.",
                syncStatusIdle: "Inactivo",
                syncStatusNotConfigured: "No configurado",
                syncStatusConnecting: "Conectando...",
                syncStatusPulling: "Recibiendo...",
                syncStatusPushing: "Enviando...",
                syncStatusMerging: "Fusionando...",
                syncStatusSynced: "Sincronizado",
                syncStatusError: "Error",
            },
            'de': {
                modalTitle: "Erweiterte Suche",
                tooltipClose: "Schließen",
                labelAllWords: "All diese Wörter",
                placeholderAllWords: "z.B. AI Nachrichten",
                labelExactPhrase: "Genau dieser Ausdruck",
                placeholderExactPhrase: 'z.B. "ChatGPT 4o"',
                labelAnyWords: "Beliebige dieser Wörter (OR)",
                placeholderAnyWords: "z.B. iPhone Android",
                labelNotWords: "Keines dieser Wörter (-)",
                placeholderNotWords: "z.B. -Verkauf -Werbung",
                labelHashtag: "Hashtags (#)",
                placeholderHashtag: "z.B. #TechEvent",
                labelLang: "Sprache (lang:)",
                optLangDefault: "Beliebige Sprache",
                optLangJa: "Japanisch (ja)",
                optLangEn: "Englisch (en)",
                optLangId: "Indonesisch (id)",
                optLangHi: "Hindi (hi)",
                optLangDe: "Deutsch (de)",
                optLangTr: "Türkisch (tr)",
                optLangEs: "Spanisch (es)",
                optLangPt: "Portugiesisch (pt)",
                optLangAr: "Arabisch (ar)",
                optLangFr: "Französisch (fr)",
                optLangKo: "Koreanisch (ko)",
                optLangRu: "Russisch (ru)",
                optLangZhHans: "Chinesisch vereinfacht (zh-cn)",
                optLangZhHant: "Chinesisch traditionell (zh-tw)",
                hrSeparator: " ",
                labelFilters: "Filter",
                labelVerified: "Verifizierte Konten",
                labelLinks: "Links",
                labelImages: "Bilder",
                labelVideos: "Videos",
                labelReposts: "Reposts",
                labelTimelineHashtags: "Hashtags (#)",
                checkInclude: "Einschl.",
                checkExclude: "Ausschl.",
                labelReplies: "Antworten",
                optRepliesDefault: "Standard (Alle)",
                optRepliesInclude: "Antworten einschließen",
                optRepliesOnly: "Nur Antworten",
                optRepliesExclude: "Antworten ausschließen",
                labelEngagement: "Interaktionen",
                placeholderMinReplies: "Min. Antworten",
                placeholderMinLikes: "Min. Gefällt mir",
                placeholderMinRetweets: "Min. Reposts",
                labelDateRange: "Zeitraum",
                labelDateShortcut: "Schnellauswahl",
                optDate1Day: "Letzte 24 Std.",
                optDate1Week: "Letzte Woche",
                optDate1Month: "Letzter Monat",
                optDate3Months: "Letzte 3 Monate",
                optDate6Months: "Letzte 6 Monate",
                optDate1Year: "Letztes Jahr",
                optDate2Years: "Letzte 2 Jahre",
                optDate3Years: "Letzte 3 Jahre",
                optDate5Years: "Letzte 5 Jahre",
                optDateClear: "Datum löschen",
                tooltipSince: "Seit diesem Datum",
                tooltipUntil: "Bis zu diesem Datum",
                labelFromUser: "Von diesen Konten (from:)",
                placeholderFromUser: "z.B. @X",
                labelToUser: "An diese Konten (to:)",
                placeholderToUser: "z.B. @google",
                labelMentioning: "Erwähnung dieser Konten (@)",
                placeholderMentioning: "z.B. @OpenAI",
                buttonClear: "Löschen",
                buttonApply: "Suchen",
                tooltipTrigger: "Erweiterte Suche öffnen",
                buttonOpen: "Öffnen",

                tabSearch: "Suche",
                tabHistory: "Verlauf",
                tabSaved: "Gespeichert",
                buttonSave: "Speichern",
                buttonSaved: "Gespeichert",
                secretMode: "Inkognito",
                secretOn: "Inkognito-Modus AN (Kein Verlauf)",
                secretOff: "Inkognito-Modus AUS",
                toastSaved: "Gespeichert.",
                toastDeleted: "Gelöscht.",
                toastReordered: "Reihenfolge aktualisiert.",
                emptyHistory: "Noch kein Verlauf.",
                emptySaved: "Keine gespeicherten Suchen. Fügen Sie welche über den Speichern-Button unten links im Suche-Tab hinzu.",
                run: "Ausführen",
                delete: "Löschen",
                updated: "Aktualisiert.",
                tooltipSecret: "Inkognito-Modus umschalten (kein Verlauf wird gespeichert)",
                historyClearAll: "Alle löschen",
                confirmClearHistory: "Gesamten Verlauf löschen?",

                labelAccountScope: "Konten",
                optAccountAll: "Alle Konten",
                optAccountFollowing: "Konten, denen du folgst",
                labelLocationScope: "Standort",
                optLocationAll: "Alle Standorte",
                optLocationNearby: "In deiner Nähe",
                chipFollowing: "Folge ich",
                chipNearby: "In der Nähe",

                labelSearchTarget: "Suchziel",
                labelHitName: "Treffer nur im Anzeigenamen ausschließen",
                labelHitHandle: "Treffer nur im Benutzernamen (@) ausschließen",
                hintSearchTarget: "Beiträge ausblenden, die nur im Namen oder Handle übereinstimmen (nicht im Text).",
                hintName: "Wenn ein Stichwort nur im Anzeigenamen vorkommt, ausblenden.",
                hintHandle: "Wenn ein Stichwort nur im @Benutzernamen vorkommt, ausblenden. Ausnahme: wenn die Anfrage explizit from:/to:/@ verwendet.",

                tabMute: "Stummschalten",
                labelMuteWord: "Stummes Wort hinzufügen",
                placeholderMuteWord: "z.B. Spoiler",
                labelCaseSensitive: "Groß-/Kleinschreibung",
                labelWordBoundary: "Ganzes Wort",
                labelEnabled: "Aktiviert",
                labelEnableAll: "Alle aktivieren",
                buttonAdd: "Hinzufügen",
                emptyMuted: "Keine stummgeschalteten Wörter.",
                mutedListTitle: "Stummgeschaltete Wörter",
                mutedListHeading: "Stummgeschaltete Liste",
                optMuteHidden: "Verborgen",
                optMuteCollapsed: "Eingeklappt",
                placeholderFilterMute: "Stummgeschaltete Wörter filtern...",
                muteLabel: "Stummgeschaltet: ",
                buttonShow: "Anzeigen",
                muteHit: "Treffer im Text stummschalten",
                buttonRemute: "Erneut stummschalten",
                buttonImport: "Importieren",
                buttonExport: "Exportieren",

                /* Accounts tab */
                tabAccounts: "Konten",
                emptyAccounts: "Noch keine Konten. Öffnen Sie ein Profil und klicken Sie auf Hinzufügen, um es zu speichern.",
                buttonAddAccount: "Konto hinzufügen",
                toastAccountAdded: "Konto hinzugefügt.",
                toastAccountExists: "Bereits vorhanden.",
                buttonConfirm: "Bestätigen",

                /* Lists tab */
                tabLists: "Listen",
                emptyLists: "Noch keine Listen. Öffnen Sie eine Liste und klicken Sie oben rechts auf +, um sie hinzuzufügen.",
                buttonAddList: "Liste hinzufügen",
                toastListAdded: "Liste hinzugefügt.",
                toastListExists: "Bereits vorhanden.",

                /* History tab */
                placeholderSearchHistory: "Suchverlauf (Query)",
                labelSortBy: "Sortieren nach:",
                placeholderSearchSaved: "Gespeicherte Suchen (Query)",
                sortNewest: "Neueste zuerst",
                sortOldest: "Älteste zuerst",
                sortNameAsc: "Name (A-Z)",
                sortNameDesc: "Name (Z-A)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "Konten filtern (@, Name)",
                placeholderFilterLists: "Listen filtern (Name, URL)",
                buttonAddFolder: "+Ordner",
                folderFilterAll: "ALLE",
                folderFilterUnassigned: "Nicht zugewiesen",
                folderRename: "Umbenennen",
                folderRenameTitle: "Ordner umbenennen",
                folderDelete: "Löschen",
                folderDeleteTitle: "Ordner löschen",
                promptNewFolder: "Neuer Ordnername",
                confirmDeleteFolder: "Diesen Ordner und alle Elemente darin löschen? Dies kann nicht rückgängig gemacht werden.",
                optListsAll: "Listen",
                defaultSavedFolders: "Gespeicherte Suchen",

                /* Favorites */
                tabFavorites: "Favoriten",
                emptyFavorites: "Keine Favoriten. Klicken Sie auf das ★-Symbol bei Tweets, um sie zu speichern.",
                optFavoritesAll: "Alle Favoriten",
                toastFavorited: "Zu Favoriten hinzugefügt.",
                toastUnfavorited: "Aus Favoriten entfernt.",

                /* Settings */
                settingsTitle: "Einstellungen",
                settingsTitleGeneral: "Allgemein",
                settingsTitleFeatures: "Tab-Sichtbarkeit",
                settingsTitleData: "Daten",
                buttonClose: "Schließen",
                labelUILang: "Oberflächensprache",
                optUILangAuto: "Automatisch",
                labelInitialTab: "Start-Tab",
                optInitialTabLast: "Zuletzt geöffnet (Standard)",
                labelImportExport: "Import / Export",
                placeholderSettingsJSON: "Backup-JSON hier einfügen...",
                tooltipSettings: "Einstellungen öffnen",
                toastImported: "Importiert.",
                toastExported: "In Datei exportiert.",
                alertInvalidJSON: "Ungültige JSON-Datei.",
                alertInvalidData: "Ungültiges Datenformat.",
                alertInvalidApp: 'Diese Datei ist kein gültiges Backup für "Advanced Search for X".',
                buttonReset: "Alle Daten zurücksetzen",
                confirmResetAll: "Alle Daten zurücksetzen? Dies kann nicht rückgängig gemacht werden.",
                toastReset: "Alle Daten wurden zurückgesetzt.",
                buttonImportSuccess: "Erfolgreich importiert 👍️",

                /* Favorites Sort */
                sortSavedNewest: "Speicherdatum (Neu)",
                sortSavedOldest: "Speicherdatum (Alt)",
                sortPostedNewest: "Veröffentlichungsdatum (Neu)",
                sortPostedOldest: "Veröffentlichungsdatum (Alt)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: 'Unkategorisiert',
                FT_DROPDOWN_TITLE: 'Favoriten-Tags',
                FT_DROPDOWN_SETTINGS_TITLE: 'Tag-Einstellungen',
                FT_DROPDOWN_NEW_TAG: 'Neuer Tag',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: 'Tag-Name',
                FT_DROPDOWN_NEW_TAG_ADD: 'Hinzufügen',
                FT_FILTER_ALL: 'Alle',
                FT_SETTINGS_TITLE: 'Favoriten-Tag-Einstellungen',
                FT_SETTINGS_EMPTY_TAG_LIST: 'Keine Tags. Fügen Sie einen über "Neuer Tag" hinzu.',
                FT_SETTINGS_UNCATEGORIZED_NAME: 'Unkategorisiert',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: 'Der Name "Unkategorisiert" kann nicht geändert werden.',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '"Unkategorisiert" kann nicht gelöscht werden.',
                FT_SETTINGS_CLOSE: 'Schließen',
                FT_SETTINGS_DELETE_BUTTON: 'Löschen',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: 'Anzeige',
                FT_SETTINGS_DISPLAY_MODE_LABEL: 'Tag-Format',
                FT_SETTINGS_DISPLAY_MODE_LEAF: 'Nur Label (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: 'Voller Pfad (full)',
                FT_CONFIRM_DELETE_TAG_MSG: 'Tag "{tagName}" löschen?\nFavoriten mit diesem Tag werden "Unkategorisiert".',
                FT_SETTINGS_BUTTON_TITLE: 'Tag-Einstellungen',

                /* --- Cloud Sync --- */
                settingsTitleSync: "Cloud-Sync",
                chipBeta: "Beta",
                labelSyncEndpoint: "Endpunkt-URL",
                linkSyncSetup: "Einrichtungsanleitung",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_de.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "Sync-ID (UUID)",
                placeholderSyncId: "UUID einfügen oder generieren",
                buttonGenerate: "Generieren",
                labelSyncPassword: "Verschlüsselungspasswort",
                placeholderSyncPassword: "Starkes Passwort erforderlich",
                tooltipShowHidePassword: "Passwort anzeigen/verbergen",
                noteSyncEncryption: "* Daten werden vor dem Upload lokal verschlüsselt. Der Server sieht dieses Passwort nie.",
                labelSyncChangePass: "Ändern",
                promptNewPassword: "Neues Passwort eingeben:",
                confirmRotation: "Passwort ändern und alle Daten neu verschlüsseln?\n\n* Stellen Sie sicher, dass Sie die neuesten Daten synchronisiert haben.\n* Dies kann nicht rückgängig gemacht werden.",
                toastPassChanged: "Passwort geändert.",
                toastRotationFailed: "Änderung fehlgeschlagen",
                syncStatusRotating: "Schlüssel werden erneuert...",
                labelSyncStatus: "Status: ",
                buttonSyncNow: "Jetzt synchronisieren",

                /* Sync Status Messages */
                toastSynced: "Synchronisierung abgeschlossen.",
                toastSyncFailed: "Synchronisierung fehlgeschlagen.",
                syncStatusIdle: "Leerlauf",
                syncStatusNotConfigured: "Nicht konfiguriert",
                syncStatusConnecting: "Verbinden...",
                syncStatusPulling: "Empfangen...",
                syncStatusPushing: "Senden...",
                syncStatusMerging: "Zusammenführen...",
                syncStatusSynced: "Synchronisiert",
                syncStatusError: "Fehler",
            },
            'pt-BR': {
                modalTitle: "Busca avançada",
                tooltipClose: "Fechar",
                labelAllWords: "Todas estas palavras",
                placeholderAllWords: "ex: AI notícias",
                labelExactPhrase: "Esta frase exata",
                placeholderExactPhrase: 'ex: "ChatGPT 4o"',
                labelAnyWords: "Qualquer destas palavras (OR)",
                placeholderAnyWords: "ex: iPhone Android",
                labelNotWords: "Nenhuma destas palavras (-)",
                placeholderNotWords: "ex: -promoção -ads",
                labelHashtag: "Hashtags (#)",
                placeholderHashtag: "ex: #Tecnologia",
                labelLang: "Idioma (lang:)",
                optLangDefault: "Qualquer idioma",
                optLangJa: "Japonês (ja)",
                optLangEn: "Inglês (en)",
                optLangId: "Indonésio (id)",
                optLangHi: "Hindi (hi)",
                optLangDe: "Alemão (de)",
                optLangTr: "Turco (tr)",
                optLangEs: "Espanhol (es)",
                optLangPt: "Português (pt)",
                optLangAr: "Árabe (ar)",
                optLangFr: "Francês (fr)",
                optLangKo: "Coreano (ko)",
                optLangRu: "Russo (ru)",
                optLangZhHans: "Chinês Simplificado (zh-cn)",
                optLangZhHant: "Chinês Tradicional (zh-tw)",
                hrSeparator: " ",
                labelFilters: "Filtros",
                labelVerified: "Contas verificadas",
                labelLinks: "Links",
                labelImages: "Imagens",
                labelVideos: "Vídeos",
                labelReposts: "Reposts",
                labelTimelineHashtags: "Hashtags (#)",
                checkInclude: "Incluir",
                checkExclude: "Excluir",
                labelReplies: "Respostas",
                optRepliesDefault: "Padrão (Tudo)",
                optRepliesInclude: "Incluir respostas",
                optRepliesOnly: "Apenas respostas",
                optRepliesExclude: "Excluir respostas",
                labelEngagement: "Engajamento",
                placeholderMinReplies: "Mín respostas",
                placeholderMinLikes: "Mín curtidas",
                placeholderMinRetweets: "Mín reposts",
                labelDateRange: "Período",
                labelDateShortcut: "Intervalo rápido",
                optDate1Day: "Últimas 24h",
                optDate1Week: "Última semana",
                optDate1Month: "Último mês",
                optDate3Months: "Últimos 3 meses",
                optDate6Months: "Últimos 6 meses",
                optDate1Year: "Último ano",
                optDate2Years: "Últimos 2 anos",
                optDate3Years: "Últimos 3 anos",
                optDate5Years: "Últimos 5 anos",
                optDateClear: "Limpar datas",
                tooltipSince: "A partir desta data",
                tooltipUntil: "Até esta data",
                labelFromUser: "Destas contas (from:)",
                placeholderFromUser: "ex: @X",
                labelToUser: "Para estas contas (to:)",
                placeholderToUser: "ex: @google",
                labelMentioning: "Mencionando estas contas (@)",
                placeholderMentioning: "ex: @OpenAI",
                buttonClear: "Limpar",
                buttonApply: "Buscar",
                tooltipTrigger: "Abrir busca avançada",
                buttonOpen: "Abrir",

                tabSearch: "Busca",
                tabHistory: "Histórico",
                tabSaved: "Salvos",
                buttonSave: "Salvar",
                buttonSaved: "Salvo",
                secretMode: "Secreto",
                secretOn: "Modo secreto ON (Sem histórico)",
                secretOff: "Modo secreto OFF",
                toastSaved: "Salvo.",
                toastDeleted: "Excluído.",
                toastReordered: "Ordem atualizada.",
                emptyHistory: "Sem histórico ainda.",
                emptySaved: "Nenhuma busca salva. Adicione pelo botão Salvar no canto inferior esquerdo da aba Busca.",
                run: "Executar",
                delete: "Excluir",
                updated: "Atualizado.",
                tooltipSecret: "Alternar Modo Secreto (histórico não será gravado)",
                historyClearAll: "Limpar tudo",
                confirmClearHistory: "Limpar todo o histórico?",

                labelAccountScope: "Contas",
                optAccountAll: "Todas as contas",
                optAccountFollowing: "Contas que você segue",
                labelLocationScope: "Localização",
                optLocationAll: "Todas as localizações",
                optLocationNearby: "Perto de você",
                chipFollowing: "Seguindo",
                chipNearby: "Próximo",

                labelSearchTarget: "Alvo da busca",
                labelHitName: "Excluir resultados apenas no nome",
                labelHitHandle: "Excluir resultados apenas no usuário (@)",
                hintSearchTarget: "Ocultar posts que correspondem apenas ao nome ou usuário (não no corpo).",
                hintName: "Se a palavra-chave aparecer apenas no nome de exibição, ocultar.",
                hintHandle: "Se a palavra-chave aparecer apenas no @usuario, ocultar. Exceção: quando a consulta usar explicitamente from:/to:/@.",

                tabMute: "Silenciar",
                labelMuteWord: "Adicionar palavra silenciada",
                placeholderMuteWord: "ex: spoiler",
                labelCaseSensitive: "Diferenciar maiúsculas",
                labelWordBoundary: "Palavra inteira",
                labelEnabled: "Ativado",
                labelEnableAll: "Ativar tudo",
                buttonAdd: "Adicionar",
                emptyMuted: "Nenhuma palavra silenciada.",
                mutedListTitle: "Palavras silenciadas",
                mutedListHeading: "Lista de silenciados",
                optMuteHidden: "Oculto",
                optMuteCollapsed: "Colapsado",
                placeholderFilterMute: "Filtrar palavras silenciadas...",
                muteLabel: "Silenciado: ",
                buttonShow: "Mostrar",
                muteHit: "Silenciar resultados no corpo",
                buttonRemute: "Silenciar novamente",
                buttonImport: "Importar",
                buttonExport: "Exportar",

                /* Accounts tab */
                tabAccounts: "Contas",
                emptyAccounts: "Nenhuma conta ainda. Abra um perfil e clique no botão Adicionar para salvar.",
                buttonAddAccount: "Adicionar conta",
                toastAccountAdded: "Conta adicionada.",
                toastAccountExists: "Já adicionada.",
                buttonConfirm: "Confirmar",

                /* Lists tab */
                tabLists: "Listas",
                emptyLists: "Nenhuma lista ainda. Abra uma Lista e clique no botão + no canto superior direito para adicionar.",
                buttonAddList: "Adicionar lista",
                toastListAdded: "Lista adicionada.",
                toastListExists: "Já adicionada.",

                /* History tab */
                placeholderSearchHistory: "Histórico de busca (query)",
                labelSortBy: "Ordenar por:",
                placeholderSearchSaved: "Buscas salvas (query)",
                sortNewest: "Mais recente",
                sortOldest: "Mais antigo",
                sortNameAsc: "Nome (A-Z)",
                sortNameDesc: "Nome (Z-A)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "Filtrar contas (@, nome)",
                placeholderFilterLists: "Filtrar listas (nome, url)",
                buttonAddFolder: "+Pasta",
                folderFilterAll: "TUDO",
                folderFilterUnassigned: "Não atribuído",
                folderRename: "Renomear",
                folderRenameTitle: "Renomear pasta",
                folderDelete: "Excluir",
                folderDeleteTitle: "Excluir pasta",
                promptNewFolder: "Nome da nova pasta",
                confirmDeleteFolder: "Excluir esta pasta e todos os itens dentro dela? Isso não pode ser desfeito.",
                optListsAll: "Listas",
                defaultSavedFolders: "Buscas Salvas",

                /* Favorites */
                tabFavorites: "Favoritos",
                emptyFavorites: "Nenhum favorito ainda. Clique no ícone ★ nos tweets para salvar.",
                optFavoritesAll: "Todos os favoritos",
                toastFavorited: "Adicionado aos favoritos.",
                toastUnfavorited: "Removido dos favoritos.",

                /* Settings */
                settingsTitle: "Configurações",
                settingsTitleGeneral: "Geral",
                settingsTitleFeatures: "Visibilidade de abas",
                settingsTitleData: "Dados",
                buttonClose: "Fechar",
                labelUILang: "Idioma da interface",
                optUILangAuto: "Automático",
                labelInitialTab: "Aba inicial",
                optInitialTabLast: "Última aberta (Padrão)",
                labelImportExport: "Importar / Exportar",
                placeholderSettingsJSON: "Cole o JSON de backup aqui...",
                tooltipSettings: "Abrir configurações",
                toastImported: "Importado.",
                toastExported: "Exportado para arquivo.",
                alertInvalidJSON: "Arquivo JSON inválido.",
                alertInvalidData: "Formato de dados inválido.",
                alertInvalidApp: 'Este arquivo não é um backup válido para "Advanced Search for X".',
                buttonReset: "Redefinir tudo",
                confirmResetAll: "Redefinir todos os dados? Isso não pode ser desfeito.",
                toastReset: "Todos os dados foram redefinidos.",
                buttonImportSuccess: "Importado com sucesso 👍️",

                /* Favorites Sort */
                sortSavedNewest: "Data (Mais recente)",
                sortSavedOldest: "Data (Mais antigo)",
                sortPostedNewest: "Postado (Mais recente)",
                sortPostedOldest: "Postado (Mais antigo)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: 'Sem categoria',
                FT_DROPDOWN_TITLE: 'Tags favoritas',
                FT_DROPDOWN_SETTINGS_TITLE: 'Configurações de tags',
                FT_DROPDOWN_NEW_TAG: 'Nova tag',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: 'Nome da tag',
                FT_DROPDOWN_NEW_TAG_ADD: 'Adicionar',
                FT_FILTER_ALL: 'Tudo',
                FT_SETTINGS_TITLE: 'Configurações de tags favoritas',
                FT_SETTINGS_EMPTY_TAG_LIST: 'Sem tags. Adicione em "Nova tag".',
                FT_SETTINGS_UNCATEGORIZED_NAME: 'Sem categoria',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: 'O nome "Sem categoria" não pode ser alterado.',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '"Sem categoria" não pode ser excluída.',
                FT_SETTINGS_CLOSE: 'Fechar',
                FT_SETTINGS_DELETE_BUTTON: 'Excluir',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: 'Exibição',
                FT_SETTINGS_DISPLAY_MODE_LABEL: 'Formato da tag',
                FT_SETTINGS_DISPLAY_MODE_LEAF: 'Apenas etiqueta (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: 'Caminho completo (full)',
                FT_CONFIRM_DELETE_TAG_MSG: 'Excluir tag "{tagName}"?\nFavoritos com esta tag ficarão "Sem categoria".',
                FT_SETTINGS_BUTTON_TITLE: 'Configurações de tags',

                /* --- Cloud Sync --- */
                settingsTitleSync: "Sincronização na nuvem",
                chipBeta: "Beta",
                labelSyncEndpoint: "URL do Endpoint",
                linkSyncSetup: "Guia de configuração",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_pt-BR.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "ID de Sincronização (UUID)",
                placeholderSyncId: "Colar ou gerar UUID",
                buttonGenerate: "Gerar",
                labelSyncPassword: "Senha de criptografia",
                placeholderSyncPassword: "Senha forte necessária",
                tooltipShowHidePassword: "Mostrar/Ocultar senha",
                noteSyncEncryption: "* Os dados são criptografados localmente antes do envio. O servidor nunca vê esta senha.",
                labelSyncChangePass: "Alterar",
                promptNewPassword: "Digite a nova senha:",
                confirmRotation: "Alterar a senha e recriptografar todos os dados?\n\n* Certifique-se de ter os dados mais recentes sincronizados.\n* Esta ação não pode ser desfeita.",
                toastPassChanged: "Senha alterada.",
                toastRotationFailed: "Falha na alteração",
                syncStatusRotating: "Rotacionando chaves...",
                labelSyncStatus: "Status: ",
                buttonSyncNow: "Sincronizar agora",

                /* Sync Status Messages */
                toastSynced: "Sincronização concluída.",
                toastSyncFailed: "Falha na sincronização.",
                syncStatusIdle: "Ocioso",
                syncStatusNotConfigured: "Não configurado",
                syncStatusConnecting: "Conectando...",
                syncStatusPulling: "Baixando...",
                syncStatusPushing: "Enviando...",
                syncStatusMerging: "Mesclando...",
                syncStatusSynced: "Sincronizado",
                syncStatusError: "Erro",
            },
            'ru': {
                modalTitle: "Расширенный поиск",
                tooltipClose: "Закрыть",
                labelAllWords: "Все эти слова",
                placeholderAllWords: "напр., AI новости",
                labelExactPhrase: "Точная фраза",
                placeholderExactPhrase: 'напр., "ChatGPT 4o"',
                labelAnyWords: "Любое из этих слов (OR)",
                placeholderAnyWords: "напр., iPhone Android",
                labelNotWords: "Исключить слова (-)",
                placeholderNotWords: "напр., -распродажа -реклама",
                labelHashtag: "Хэштеги (#)",
                placeholderHashtag: "напр., #TechEvent",
                labelLang: "Язык (lang:)",
                optLangDefault: "Любой язык",
                optLangJa: "Японский (ja)",
                optLangEn: "Английский (en)",
                optLangId: "Индонезийский (id)",
                optLangHi: "Хинди (hi)",
                optLangDe: "Немецкий (de)",
                optLangTr: "Турецкий (tr)",
                optLangEs: "Испанский (es)",
                optLangPt: "Португальский (pt)",
                optLangAr: "Арабский (ar)",
                optLangFr: "Французский (fr)",
                optLangKo: "Корейский (ko)",
                optLangRu: "Русский (ru)",
                optLangZhHans: "Китайский упр. (zh-cn)",
                optLangZhHant: "Китайский трад. (zh-tw)",
                hrSeparator: " ",
                labelFilters: "Фильтры",
                labelVerified: "Подтвержденные аккаунты",
                labelLinks: "Ссылки",
                labelImages: "Изображения",
                labelVideos: "Видео",
                labelReposts: "Репосты",
                labelTimelineHashtags: "Хэштеги (#)",
                checkInclude: "Вкл",
                checkExclude: "Искл",
                labelReplies: "Ответы",
                optRepliesDefault: "По умолчанию (Все)",
                optRepliesInclude: "Включая ответы",
                optRepliesOnly: "Только ответы",
                optRepliesExclude: "Исключить ответы",
                labelEngagement: "Вовлеченность",
                placeholderMinReplies: "Мин. ответов",
                placeholderMinLikes: "Мин. лайков",
                placeholderMinRetweets: "Мин. репостов",
                labelDateRange: "Диапазон дат",
                labelDateShortcut: "Быстрый выбор",
                optDate1Day: "За 24 часа",
                optDate1Week: "За неделю",
                optDate1Month: "За месяц",
                optDate3Months: "За 3 месяца",
                optDate6Months: "За 6 месяцев",
                optDate1Year: "За год",
                optDate2Years: "За 2 года",
                optDate3Years: "За 3 года",
                optDate5Years: "За 5 лет",
                optDateClear: "Очистить даты",
                tooltipSince: "С этой даты",
                tooltipUntil: "По эту дату",
                labelFromUser: "От этих аккаунтов (from:)",
                placeholderFromUser: "напр., @X",
                labelToUser: "Этим аккаунтам (to:)",
                placeholderToUser: "напр., @google",
                labelMentioning: "Упоминание этих аккаунтов (@)",
                placeholderMentioning: "напр., @OpenAI",
                buttonClear: "Очистить",
                buttonApply: "Поиск",
                tooltipTrigger: "Открыть расширенный поиск",
                buttonOpen: "Открыть",

                tabSearch: "Поиск",
                tabHistory: "История",
                tabSaved: "Сохраненное",
                buttonSave: "Сохранить",
                buttonSaved: "Сохранено",
                secretMode: "Секретный",
                secretOn: "Секретный режим ВКЛ (без истории)",
                secretOff: "Секретный режим ВЫКЛ",
                toastSaved: "Сохранено.",
                toastDeleted: "Удалено.",
                toastReordered: "Порядок обновлен.",
                emptyHistory: "Истории пока нет.",
                emptySaved: "Нет сохраненных поисков. Добавьте их кнопкой Сохранить внизу вкладки Поиск.",
                run: "Выполнить",
                delete: "Удалить",
                updated: "Обновлено.",
                tooltipSecret: "Переключить секретный режим (история не будет записана)",
                historyClearAll: "Очистить всё",
                confirmClearHistory: "Очистить всю историю?",

                labelAccountScope: "Аккаунты",
                optAccountAll: "Все аккаунты",
                optAccountFollowing: "Читаемые вами",
                labelLocationScope: "Местоположение",
                optLocationAll: "Везде",
                optLocationNearby: "Рядом с вами",
                chipFollowing: "Читаемые",
                chipNearby: "Рядом",

                labelSearchTarget: "Цель поиска",
                labelHitName: "Исключить совпадения только в имени",
                labelHitHandle: "Исключить совпадения только в юзернейме (@)",
                hintSearchTarget: "Скрыть посты, совпадающие только по имени/юзернейму (но не в тексте).",
                hintName: "Если ключевое слово только в отображаемом имени — скрыть.",
                hintHandle: "Если ключевое слово только в @юзернейме — скрыть. Искл: если запрос явно использует from:/to:/@.",

                tabMute: "Скрыть",
                labelMuteWord: "Добавить скрытое слово",
                placeholderMuteWord: "напр., спойлер",
                labelCaseSensitive: "Учитывать регистр",
                labelWordBoundary: "Слово целиком",
                labelEnabled: "Включено",
                labelEnableAll: "Включить все",
                buttonAdd: "Добавить",
                emptyMuted: "Нет скрытых слов.",
                mutedListTitle: "Скрытые слова",
                mutedListHeading: "Список скрытого",
                optMuteHidden: "Скрыто",
                optMuteCollapsed: "Свернуто",
                placeholderFilterMute: "Фильтр скрытых слов...",
                muteLabel: "Скрыто: ",
                buttonShow: "Показать",
                muteHit: "Скрывать совпадения в тексте",
                buttonRemute: "Скрыть снова",
                buttonImport: "Импорт",
                buttonExport: "Экспорт",

                /* Accounts tab */
                tabAccounts: "Аккаунты",
                emptyAccounts: "Аккаунтов нет. Откройте профиль и нажмите Добавить, чтобы сохранить.",
                buttonAddAccount: "Добавить аккаунт",
                toastAccountAdded: "Аккаунт добавлен.",
                toastAccountExists: "Уже добавлен.",
                buttonConfirm: "Подтвердить",

                /* Lists tab */
                tabLists: "Списки",
                emptyLists: "Списков нет. Откройте список и нажмите + в углу для добавления.",
                buttonAddList: "Добавить список",
                toastListAdded: "Список добавлен.",
                toastListExists: "Уже добавлен.",

                /* History tab */
                placeholderSearchHistory: "История поиска (запрос)",
                labelSortBy: "Сортировка:",
                placeholderSearchSaved: "Сохраненный поиск (запрос)",
                sortNewest: "Сначала новые",
                sortOldest: "Сначала старые",
                sortNameAsc: "Имя (А-Я)",
                sortNameDesc: "Имя (Я-А)",

                /* Folder/List/Account tabs */
                placeholderFilterAccounts: "Фильтр аккаунтов (@, имя)",
                placeholderFilterLists: "Фильтр списков (имя, url)",
                buttonAddFolder: "+Папка",
                folderFilterAll: "ВСЕ",
                folderFilterUnassigned: "Без папки",
                folderRename: "Переименовать",
                folderRenameTitle: "Переименовать папку",
                folderDelete: "Удалить",
                folderDeleteTitle: "Удалить папку",
                promptNewFolder: "Имя новой папки",
                confirmDeleteFolder: "Удалить эту папку и всё содержимое? Это нельзя отменить.",
                optListsAll: "Списки",
                defaultSavedFolders: "Сохраненные поиски",

                /* Favorites */
                tabFavorites: "Избранное",
                emptyFavorites: "В избранном пусто. Нажмите ★ на твите, чтобы сохранить.",
                optFavoritesAll: "Всё избранное",
                toastFavorited: "Добавлено в избранное.",
                toastUnfavorited: "Удалено из избранного.",

                /* Settings */
                settingsTitle: "Настройки",
                settingsTitleGeneral: "Общие",
                settingsTitleFeatures: "Вкладки",
                settingsTitleData: "Данные",
                buttonClose: "Закрыть",
                labelUILang: "Язык интерфейса",
                optUILangAuto: "Авто",
                labelInitialTab: "Вкладка при запуске",
                optInitialTabLast: "Последняя открытая (По умолч.)",
                labelImportExport: "Импорт / Экспорт",
                placeholderSettingsJSON: "Вставьте JSON резервной копии...",
                tooltipSettings: "Открыть настройки",
                toastImported: "Импортировано.",
                toastExported: "Экспортировано в файл.",
                alertInvalidJSON: "Неверный файл JSON.",
                alertInvalidData: "Неверный формат данных.",
                alertInvalidApp: 'Файл не является копией "Advanced Search for X".',
                buttonReset: "Сбросить всё",
                confirmResetAll: "Сбросить все данные? Это нельзя отменить.",
                toastReset: "Все данные сброшены.",
                buttonImportSuccess: "Успешный импорт 👍️",

                /* Favorites Sort */
                sortSavedNewest: "Дата сохр. (Новые)",
                sortSavedOldest: "Дата сохр. (Старые)",
                sortPostedNewest: "Дата публ. (Новые)",
                sortPostedOldest: "Дата публ. (Старые)",

                /* --- Favorite Tags --- */
                FT_UNCATEGORIZED: 'Без категории',
                FT_DROPDOWN_TITLE: 'Теги избранного',
                FT_DROPDOWN_SETTINGS_TITLE: 'Настройка тегов',
                FT_DROPDOWN_NEW_TAG: 'Новый тег',
                FT_DROPDOWN_NEW_TAG_PLACEHOLDER: 'Имя тега',
                FT_DROPDOWN_NEW_TAG_ADD: 'Добавить',
                FT_FILTER_ALL: 'Все',
                FT_SETTINGS_TITLE: 'Настройка тегов избранного',
                FT_SETTINGS_EMPTY_TAG_LIST: 'Тегов нет. Добавьте через "Новый тег".',
                FT_SETTINGS_UNCATEGORIZED_NAME: 'Без категории',
                FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP: 'Имя "Без категории" нельзя изменить.',
                FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP: '"Без категории" нельзя удалить.',
                FT_SETTINGS_CLOSE: 'Закрыть',
                FT_SETTINGS_DELETE_BUTTON: 'Удалить',
                FT_SETTINGS_UP: '▲',
                FT_SETTINGS_DOWN: '▼',
                FT_SETTINGS_DISPLAY_SECTION_TITLE: 'Отображение',
                FT_SETTINGS_DISPLAY_MODE_LABEL: 'Формат тега',
                FT_SETTINGS_DISPLAY_MODE_LEAF: 'Только имя (leaf)',
                FT_SETTINGS_DISPLAY_MODE_FULL: 'Полный путь (full)',
                FT_CONFIRM_DELETE_TAG_MSG: 'Удалить тег "{tagName}"?\nЭлементы с этим тегом станут "Без категории".',
                FT_SETTINGS_BUTTON_TITLE: 'Настройка тегов',

                /* --- Cloud Sync --- */
                settingsTitleSync: "Облачная синхронизация",
                chipBeta: "Бета",
                labelSyncEndpoint: "URL конечной точки",
                linkSyncSetup: "Руководство по настройке",
                urlSyncHelp: "https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README_ru.md",
                placeholderSyncEndpoint: "https://your-worker.workers.dev",
                labelSyncId: "ID синхронизации (UUID)",
                placeholderSyncId: "Вставьте или сгенерируйте UUID",
                buttonGenerate: "Создать",
                labelSyncPassword: "Пароль шифрования",
                placeholderSyncPassword: "Требуется надежный пароль",
                tooltipShowHidePassword: "Показать/Скрыть пароль",
                noteSyncEncryption: "* Данные шифруются локально перед отправкой. Сервер не видит этот пароль.",
                labelSyncChangePass: "Изменить",
                promptNewPassword: "Введите новый пароль:",
                confirmRotation: "Изменить пароль и перешифровать все данные?\n\n* Убедитесь, что у вас синхронизированы последние данные.\n* Это действие нельзя отменить.",
                toastPassChanged: "Пароль изменен.",
                toastRotationFailed: "Ошибка изменения",
                syncStatusRotating: "Обновление ключей...",
                labelSyncStatus: "Статус: ",
                buttonSyncNow: "Синхронизировать",

                /* Sync Status Messages */
                toastSynced: "Синхронизация завершена.",
                toastSyncFailed: "Ошибка синхронизации.",
                syncStatusIdle: "Ожидание",
                syncStatusNotConfigured: "Не настроено",
                syncStatusConnecting: "Подключение...",
                syncStatusPulling: "Получение...",
                syncStatusPushing: "Отправка...",
                syncStatusMerging: "Объединение...",
                syncStatusSynced: "Синхронизировано",
                syncStatusError: "Ошибка",
            }
        },
        lang: 'en',
        init: function() {
            const supportedLangs = Object.keys(this.translations);
            let detectedLang = document.documentElement.lang || navigator.language || 'en';
            if (supportedLangs.includes(detectedLang)) { this.lang = detectedLang; return; }
            const baseLang = detectedLang.split('-')[0];
            if (supportedLangs.includes(baseLang)) { this.lang = baseLang; return; }
            this.lang = 'en';
        },
        t: function(key) { return this.translations[this.lang]?.[key] || this.translations['en'][key] || `[${key}]`; },
        apply: function(container) {
            container.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = this.t(el.dataset.i18n); });
            container.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = this.t(el.dataset.i18nPlaceholder); });
            container.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = this.t(el.dataset.i18nTitle); });
            container.querySelectorAll('[data-i18n-href]').forEach(el => { el.href = this.t(el.dataset.i18nHref); });
        }
    };

    const SEARCH_SVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" fill="none"></circle>
      <line x1="16.65" y1="16.65" x2="22" y2="22"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
    </svg>`;

    const SETTINGS_SVG = `
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
      />
    </svg>
    `;

    const FOLDER_TOGGLE_OPEN_SVG = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
    const FOLDER_TOGGLE_CLOSED_SVG = `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;

    // トグルボタンの小ユーティリティ
    function renderFolderToggleButton(collapsed) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'adv-folder-toggle-btn';
      btn.setAttribute('aria-label', collapsed ? 'Expand' : 'Collapse');
      btn.setAttribute('title', collapsed ? 'Expand' : 'Collapse');
      btn.setAttribute('aria-expanded', (!collapsed).toString());
      btn.style.cssText = `
        appearance:none;border:none;background:transparent;cursor:pointer;
        width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;
        margin-right:8px;color:inherit;flex:0 0 auto;
      `;
      setInnerHTML(btn,collapsed ? FOLDER_TOGGLE_CLOSED_SVG : FOLDER_TOGGLE_OPEN_SVG);
      return btn;
    }
    function updateFolderToggleButton(btn, collapsed) {
      if (!btn) return;
      setInnerHTML(btn,collapsed ? FOLDER_TOGGLE_CLOSED_SVG : FOLDER_TOGGLE_OPEN_SVG);
      btn.setAttribute('aria-label', collapsed ? 'Expand' : 'Collapse');
      btn.setAttribute('title', collapsed ? 'Expand' : 'Collapse');
      btn.setAttribute('aria-expanded', (!collapsed).toString());
    }

    const themeManager = {
        colors: {
            light: {
                '--modal-bg': '#ffffff', '--modal-text-primary': '#0f1419', '--modal-text-secondary': '#536471', '--modal-border': '#d9e1e8',
                '--modal-input-bg': '#eff3f4', '--modal-input-border': '#cfd9de', '--modal-button-hover-bg': 'rgba(15, 20, 25, 0.1)',
                '--modal-scrollbar-thumb': '#aab8c2', '--modal-scrollbar-track': '#eff3f4', '--modal-close-color': '#0f1419',
                '--modal-close-hover-bg': 'rgba(15, 20, 25, 0.1)', '--hr-color': '#eff3f4',
                '--modal-tabs-shadow': '0 1px 12px rgba(0, 0, 0, 0.22)',
                '--danger-text': '#f4212e', '--danger-border': '#f4212e', '--danger-hover-bg': 'rgba(244, 33, 46, 0.1)',
            },
            dim: {
                '--modal-bg': '#15202b', '--modal-text-primary': '#f7f9f9', '--modal-text-secondary': '#8899a6', '--modal-border': '#38444d',
                '--modal-input-bg': '#192734', '--modal-input-border': '#38444d', '--modal-button-hover-bg': 'rgba(247, 249, 249, 0.1)',
                '--modal-scrollbar-thumb': '#536471', '--modal-scrollbar-track': '#192734', '--modal-close-color': '#f7f9f9',
                '--modal-close-hover-bg': 'rgba(247, 249, 249, 0.1)', '--hr-color': '#38444d',
                '--modal-tabs-shadow': '0 5px 12px rgba(0, 0, 0, 0.27)',
                '--danger-text': '#ffb3b3', '--danger-border': '#8b0000', '--danger-hover-bg': 'rgba(244, 33, 46, 0.15)',
            },
            dark: {
                '--modal-bg': '#000000', '--modal-text-primary': '#e7e9ea', '--modal-text-secondary': '#71767b', '--modal-border': '#2f3336',
                '--modal-input-bg': '#16181c', '--modal-input-border': '#54595d', '--modal-button-hover-bg': 'rgba(231, 233, 234, 0.1)',
                '--modal-scrollbar-thumb': '#536471', '--modal-scrollbar-track': '#16181c', '--modal-close-color': '#e7e9ea',
                '--modal-close-hover-bg': 'rgba(231, 233, 234, 0.1)', '--hr-color': '#2f3336',
                '--modal-tabs-shadow': '0 5px 12px rgba(0, 0, 0, 0.27)',
                '--danger-text': '#ffb3b3', '--danger-border': '#8b0000', '--danger-hover-bg': 'rgba(244, 33, 46, 0.15)',
            }
        },
        applyTheme: function(modalElement, triggerEl) {
            if (!modalElement) return;
            const bodyBg = getComputedStyle(document.body).backgroundColor;
            let theme = 'dark';
            if (bodyBg === 'rgb(21, 32, 43)') theme = 'dim';
            else if (bodyBg === 'rgb(255, 255, 255)') theme = 'light';

            // ▼ ブックマークUIのテーマ切替用にクラスを付与
            try {
                document.documentElement.classList.remove('x-theme-light', 'x-theme-dim', 'x-theme-dark');
                if (theme === 'light') {
                    document.documentElement.classList.add('x-theme-light');
                } else if (theme === 'dim') {
                    document.documentElement.classList.add('x-theme-dim');
                } else {
                    document.documentElement.classList.add('x-theme-dark');
                }
            } catch (e) {}

            const themeColors = this.colors[theme] || this.colors.dark;
            const targets = [modalElement, document.documentElement];
            if (triggerEl) targets.push(triggerEl);
            for (const t of targets) {
             for (const [key, value] of Object.entries(themeColors)) {
               t.style.setProperty(key, value);
             }
            }
        },
        observeChanges: function(modalElement, triggerEl) {
            const observer = new MutationObserver(() => this.applyTheme(modalElement, triggerEl));
            observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
            this.applyTheme(modalElement, triggerEl);
        }
    };

    /**
     * Mobile Drag & Drop Shim
     * タッチイベントを検知し、HTML5 Drag & Dropイベント(dragstart, dragover, drop等)を発火させる
     */
    function enableMobileDragSupport() {
        let dragSource = null;
        let lastTarget = null;
        // DataTransferのデータを保持する擬似ストア
        let dataTransferStore = {};

        // 擬似的な DragEvent を作成するヘルパー
        const createEvent = (type, touch, target) => {
            const event = new CustomEvent(type, { bubbles: true, cancelable: true });
            // dataTransfer オブジェクトを擬似的に再現
            event.dataTransfer = {
                effectAllowed: 'move',
                dropEffect: 'move',
                types: Object.keys(dataTransferStore),
                setData: (format, data) => { dataTransferStore[format] = data; },
                getData: (format) => dataTransferStore[format],
                clearData: () => { dataTransferStore = {}; }
            };
            // 座標情報を付与 (getDragAfterElement 等の計算に必要)
            event.clientX = touch.clientX;
            event.clientY = touch.clientY;
            event.pageX = touch.pageX;
            event.pageY = touch.pageY;
            // ターゲット要素を上書き設定 (CustomEventの制約回避)
            Object.defineProperty(event, 'target', { value: target, enumerable: true });
            return event;
        };

        const onTouchStart = (e) => {
            // ハンドル、またはドラッグ可能な要素自体へのタッチか判定
            const handle = e.target.closest('.adv-item-handle, .adv-folder-header, .adv-tab-btn, .ft-modal-tag-drag-handle');
            if (!handle) return;

            const draggable = handle.closest('[draggable="true"]');
            if (!draggable) return;

            dragSource = draggable;
            dataTransferStore = {}; // データ初期化

            const touch = e.changedTouches[0];
            const evt = createEvent('dragstart', touch, dragSource);
            dragSource.dispatchEvent(evt);
        };

        const onTouchMove = (e) => {
            if (!dragSource) return;
            // スクロール防止（CSSのtouch-actionで防げない場合用）
            if (e.cancelable) e.preventDefault();

            const touch = e.changedTouches[0];
            // 指の下にある要素を取得
            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (!element) return;

            // dragover は頻繁に発火させる必要がある
            // ターゲットが変わった場合は dragenter/dragleave も検討すべきだが、
            // このアプリのロジック(並び替え)では dragover がメインのため、そこに集中する

            // 既存ロジックが .closest('.adv-item') 等を使っているため、適切なターゲットに対して発火
            // ここでは elementFromPoint で取れた要素に対して dragover を投げる
            const evt = createEvent('dragover', touch, element);
            element.dispatchEvent(evt);
            lastTarget = element;
        };

        const onTouchEnd = (e) => {
            if (!dragSource) return;
            const touch = e.changedTouches[0];

            // 最後に指があった要素に対して drop を発火
            if (lastTarget) {
                const evtDrop = createEvent('drop', touch, lastTarget);
                lastTarget.dispatchEvent(evtDrop);
            }

            const evtEnd = createEvent('dragend', touch, dragSource);
            dragSource.dispatchEvent(evtEnd);

            // クリーンアップ
            dragSource = null;
            lastTarget = null;
            dataTransferStore = {};
        };

        document.addEventListener('touchstart', onTouchStart, { passive: false });
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    }

    function decodeURIComponentSafe(s) {
      try { return decodeURIComponent(s); } catch { return s; }
    }

    // 正規表現の特殊文字をエスケープする
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // “ ” 『』などのスマート引用を ASCII の " に寄せる
    function normalizeQuotes(s) {
      return String(s).replace(/[\u201C\u201D\u300C\u300D\uFF02]/g, '"');
    }

    // 解析前に軽く正規化（URL から来る %22..., 連続空白など）
    function normalizeForParse(s) {
      if (!s) return '';
      let out = String(s);
      // URL っぽいエンコードだけ軽く剥がす（%22 等）
      if (/%[0-9A-Fa-f]{2}/.test(out)) out = decodeURIComponentSafe(out);
      out = normalizeQuotes(out);
      // 制御文字を潰し、空白を整形
      out = out.replace(/\s+/g, ' ').trim();
      return out;
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ── OR/引用のための簡易トークナイザ
    function tokenizeQuotedWords(s) {
      const out = [];
      let cur = '';
      let inQ = false;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (c === '"') { inQ = !inQ; cur += c; continue; }
        if (!inQ && /\s/.test(c)) { if (cur) { out.push(cur); cur=''; } }
        else { cur += c; }
      }
      if (cur) out.push(cur);
      return out.filter(Boolean);
    }

    // トップレベルの OR で文字列を分割（引用/括弧を考慮）
    function splitTopLevelOR(str) {
      const parts = [];
      let cur = '';
      let inQ = false, depth = 0;
      for (let i = 0; i < str.length; ) {
        const c = str[i];
        if (c === '"') { inQ = !inQ; cur += c; i++; continue; }
        if (!inQ && (c === '(' || c === ')')) { depth += (c === '(' ? 1 : -1); cur += c; i++; continue; }
        if (!inQ && depth === 0) {
          // 単語境界の "or" / "OR"
          if ((str.slice(i, i+2).toLowerCase() === 'or') &&
              (i === 0 || /\s|\(/.test(str[i-1] || '')) &&
              (i+2 >= str.length || /\s|\)/.test(str[i+2] || ''))) {
            parts.push(cur.trim());
            cur = '';
            i += 2;
            continue;
          }
        }
        cur += c; i++;
      }
      if (cur.trim()) parts.push(cur.trim());
      return parts.length > 1 ? parts : null;
    }

    // OR 専用判定（演算子/否定/括弧が無い素の OR 群なら true）
    function isPureORQuery(q) {
      const hasOps = /(?:^|\s)(?:from:|to:|lang:|filter:|is:|min_replies:|min_faves:|min_retweets:|since:|until:)\b/i.test(q);
      const hasNeg = /(^|\s)-\S/.test(q);
      const hasPar = /[()]/.test(q);
      return !hasOps && !hasNeg && !hasPar;
    }

    function waitForElement(selector, timeout = 10000, checkProperty = null) {
        return new Promise((resolve) => {
            const checkInterval = 100;
            let elapsedTime = 0;
            const intervalId = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    if (checkProperty) {
                        if (element[checkProperty]) {
                            clearInterval(intervalId);
                            resolve(element);
                            return;
                        }
                    } else {
                        clearInterval(intervalId);
                        resolve(element);
                        return;
                    }
                }
                elapsedTime += checkInterval;
                if (elapsedTime >= timeout) {
                    clearInterval(intervalId);
                    resolve(null);
                }
            }, checkInterval);
        });
    }

    function hideUIImmediately(modal, trigger) {
        if (modal)  modal.style.display = 'none';
        if (trigger) trigger.style.display = 'none';
    }

    // ▼ ルート適用を軽く検証（URL一致 + プロフィール系DOMが現れたか）
    function waitForRouteApply(path, timeoutMs = 2000) {
      const goal = new URL(path, location.origin).pathname;
      // ルート毎の判定を用意（必要に応じて拡張）
      const perRouteProbes = [
       // 検索ページ：検索結果タイムライン or 検索ボックス or 何かしらのツイート
       { test: p => p.startsWith('/search'),
         sels: [
           '[aria-label*="Search results"], [aria-label*="検索結果"]',
           'div[data-testid="primaryColumn"] input[data-testid="SearchBox_Search_Input"]',
           'div[data-testid="primaryColumn"] article[data-testid="tweet"]'
         ] },
       // プロフィール
       { test: p => /^\/[A-Za-z0-9_]{1,50}\/?$/.test(p),
         sels: [
           '[data-testid="UserName"]',
           'div[data-testid="UserProfileHeader_Items"]',
           'div[data-testid="UserDescription"]'
         ] },
       // デフォルト（保険）：主要カラムに何かレンダされたらOK
       { test: _ => true,
         sels: [
           'div[data-testid="primaryColumn"]',
           'main[role="main"]'
         ] }
      ];
      const probes = (perRouteProbes.find(x => x.test(goal)) || perRouteProbes.at(-1)).sels;
      return new Promise(resolve => {
        const t0 = performance.now();
        (function tick() {
          const elapsed = performance.now() - t0;
          const urlOk = location.pathname === goal;
          const domOk = probes.some(sel => document.querySelector(sel));
          if (urlOk && domOk) return resolve(true);
          if (elapsed >= timeoutMs) return resolve(false);
          // 立ち上がりは速く、以後はやや疎にポーリング
          setTimeout(tick, elapsed < 300 ? 60 : elapsed < 700 ? 120 : 180);
        })();
      });
    }

    // ▼ State生成（React Routerの仕様に準拠したクリーンなState）
    function createCleanState(currentPath) {
        // 6文字のランダムな英数字 (React Router標準のkey生成ロジック模倣)
        const key = Math.random().toString(36).slice(2, 8);
        return {
            key: key,
            state: {
                fromApp: true,
                previousPath: currentPath || location.pathname,
                // ここに focalTweetId や context などの「前の文脈」を含めないことで
                // React Router に「新しいビューとしてレンダリング」させる
            }
        };
    }

    // ▼ SPA 遷移関数（Chrome/Firefox/Safari全対応・Sandbox突破版）
    async function spaNavigate(path, { ctrlMeta = false, timeoutMs = 1200 } = {}) {
        try {
            const to = new URL(path, location.origin);
            if (to.origin !== location.origin) throw new Error('cross-origin');

            // 1. クリーンなStateを作成
            let nextState = createCleanState(location.pathname);

            // 2.【Firefox対策】特権領域(UserScript)のオブジェクトをページ領域へ複製
            // これをしないと Firefox で "Permission denied to access property" エラーになる
            if (typeof cloneInto === 'function') {
                nextState = cloneInto(nextState, document.defaultView || window);
            }

            // 3. 環境に応じたグローバルオブジェクトの取得
            // unsafeWindow が使えるなら、ページ本来の window (実体) を使う
            const targetWindow = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

            // 4. History API 更新
            // ページ実体の history を操作する
            targetWindow.history.pushState(nextState, '', to.pathname + to.search + to.hash);

            // 5. イベント発火 (PopStateEvent)
            // React Router は window.addEventListener('popstate', ...) で待機しているため
            // ページ実体のコンストラクタでイベントを作り、ページ実体の window で発火する
            const PopStateEventClass = targetWindow.PopStateEvent || PopStateEvent;
            const evt = new PopStateEventClass('popstate', { state: nextState });
            targetWindow.dispatchEvent(evt);

            // 6. 適用待ち (DOM変化の監視)
            const ok = await waitForRouteApply(to.pathname, timeoutMs);
            if (ok) return;

        } catch (e) {
            console.error('[spaNavigate] Fallback triggered due to:', e);
            // エラー時はフォールバックへ進む
        }

        // フォールバック（通常遷移: ページリロード発生）
        if (ctrlMeta) window.open(path, '_blank', 'noopener');
        else location.assign(path);
    }

    const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

    let isUpdating = false;
    let manualOverrideOpen = false;
    const lastHistory = { q: null, pf: null, lf: null, ts: 0 };

    // ▼ パース結果をキャッシュ（スクロール時の再パース防止）
    let __cachedSearchTokens = null;
    let __cachedSearchQuery = null; // このクエリ文字列で __cachedSearchTokens が生成された

    // ▼ 入力中ガード（IME合成を含めてカバー）
    let __typingGuardUntil = 0;
    const TYPING_GRACE_MS = 600; // 入力終了からこのmsはスキャン停止
    const markTyping = () => { __typingGuardUntil = Date.now() + TYPING_GRACE_MS; };
    const isTyping = () => Date.now() < __typingGuardUntil;

    const isMediaViewPath = (pathname) => /\/status\/\d+\/(?:photo|video|media|analytics)(?:\/\d+)?\/?$/.test(pathname);
    const isComposePath = (pathname) => /^\/compose\/post(?:\/|$)/.test(pathname);
    const isProfileMediaPath = (pathname) => /^\/[A-Za-z0-9_]{1,50}\/(?:photo|header_photo)\/?$/.test(pathname);
    const isBroadcastPath = (pathname) => /^\/i\/broadcasts\//.test(pathname);
    const isBlockedPath = (pathname) => isMediaViewPath(pathname) || isComposePath(pathname) || isProfileMediaPath(pathname) || isBroadcastPath(pathname);

    // ▼ 自動的に閉じるパスかどうかを判定する関数
    const isAutoClosePath = (pathname) => {
        const targets = ['/messages', '/i/grok', '/settings', '/i/chat', '/i/spaces', '/i/monetization'];
        return targets.some(t => pathname.startsWith(t));
    };

    GM_addStyle(`
        :root { --modal-primary-color:#1d9bf0; --modal-primary-color-hover:#1a8cd8; --modal-primary-text-color:#fff; }
        #layers { z-index: 6000 !important; } /* #layers (Grok/DM) をモーダルより手前に表示する設定 */
        #advanced-search-trigger { position:fixed; top:18px; right:20px; z-index:9999; background-color:var(--modal-primary-color); color:var(--modal-primary-text-color); border:none; border-radius:50%; width:50px; height:50px; font-size:24px; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; transition:transform .2s, background-color .2s; }
        #advanced-search-trigger:hover { transform:scale(1.1); background-color:var(--modal-primary-color-hover); }
        #advanced-search-modal { position:fixed; z-index: 5000; width:450px; display:none; flex-direction:column; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif; background-color:var(--modal-bg, #000); color:var(--modal-text-primary, #e7e9ea); border:1px solid var(--modal-border, #333); border-radius:16px; box-shadow:0 8px 24px rgba(29,155,240,.2); transition:background-color .2s,color .2s,border-color .2s; }
        .adv-modal-header{transform-origin:top left; padding:12px 16px;border-bottom:1px solid var(--modal-border,#333);cursor:move;display:flex;justify-content:space-between;align-items:center}
        .adv-modal-title-left{display:flex;align-items:center;gap:8px;}
        .adv-modal-header h2{margin:0;font-size:18px;font-weight:700}
        .adv-settings-btn{
          margin-left:6px;
          width:26px;height:26px;
          border-radius:9999px;
          border:1px solid var(--modal-input-border,#38444d);
          background:var(--modal-input-bg,#202327);
          display:inline-flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
          padding:0;
        }
        .adv-settings-btn:hover{
          background-color:var(--modal-button-hover-bg,rgba(231,233,234,.1));
        }
        .adv-settings-btn svg{
          width:14px;
          height:14px;
        }
        .adv-modal-close{background:0 0;border:none;color:var(--modal-close-color,#e7e9ea);font-size:24px;cursor:pointer;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background-color .2s}
        .adv-modal-close:hover{background-color:var(--modal-close-hover-bg,rgba(231,233,234,.1))}
        .adv-modal-body{flex:1;overflow-y:auto;padding:0}
        .adv-form-group{margin-bottom:16px}
        .adv-form-group label{display:block;margin-bottom:6px;font-size:14px;font-weight:700;color:var(--modal-text-secondary,#8b98a5)}
        .adv-form-group input[type=text],.adv-form-group input[type=number],.adv-form-group input[type=date],.adv-form-group select{width:100%;background-color:var(--modal-input-bg,#202327);border:1px solid var(--modal-input-border,#38444d);border-radius:4px;padding:8px 12px;color:var(--modal-text-primary,#e7e9ea);font-size:15px;box-sizing:border-box}
        .adv-form-group input:focus,.adv-form-group select:focus{outline:0;border-color:var(--modal-primary-color)}
        .adv-form-group input::placeholder,
        .adv-settings-group input::placeholder,
        #adv-sync-settings-container input::placeholder {
            color: var(--modal-text-secondary,#536471);
            opacity: 0.5;
        }
        .adv-form-group-date-container {display:flex;gap:8px;align-items: center;}
        .adv-form-group-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 6px;
            gap: 12px;
        }
        .adv-form-group-header label {
            margin-bottom: 0;
            white-space: nowrap;
            flex-shrink: 0;
        }
        .adv-select-mini {
            background-color: var(--modal-input-bg, #202327);
            color: var(--modal-text-primary, #e7e9ea);
            border: 1px solid var(--modal-input-border, #38444d);
            border-radius: 18px !important;
            font-size: 13px !important;
            height: 34px;
            line-height: normal;
            padding: 0 8px;
            width: auto;
            min-width: 90px;
            max-width: 200px;
            text-overflow: ellipsis;
            cursor: pointer;
            outline: none;
        }
        .adv-select-mini:hover {
            border-color: var(--modal-text-secondary, #8b98a5);
        }
        .adv-select-mini:focus {
            border-color: var(--modal-primary-color);
        }
        .adv-form-group-date-container input[type=date] {flex:1;min-width: 0;width: auto !important;}
        .adv-date-separator {color:var(--modal-text-secondary, #8b98a5);font-weight:700;user-select:none;flex-shrink:0;padding: 0 2px;}
        .adv-filter-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .adv-checkbox-group{background-color:var(--modal-input-bg,#202327);border:1px solid var(--modal-input-border,#38444d);border-radius:8px;padding:10px;display:flex;flex-direction:column;gap:8px}
        .adv-checkbox-group span{font-weight:700;font-size:14px;color:var(--modal-text-primary,#e7e9ea)}
        .adv-checkbox-item{display:flex;align-items:center}
        .adv-checkbox-item input{margin-right:8px; accent-color:var(--modal-primary-color);}
        .adv-checkbox-item label{color:var(--modal-text-secondary,#8b98a5);margin-bottom:0}
        .adv-checkbox-item input[type="checkbox"]:disabled {opacity:0.5; cursor:not-allowed;}
        .adv-checkbox-item input[type="checkbox"]:disabled + label {opacity:0.5;cursor:not-allowed;text-decoration:line-through;}
        .adv-modal-footer{transform-origin:top left; padding:12px 16px;border-top:1px solid var(--modal-border,#333);display:flex;justify-content:flex-end;gap:12px}
        .adv-modal-button{padding:5px 16px;border-radius:9999px;border:1px solid var(--modal-text-secondary,#536471);background-color:transparent;color:var(--modal-text-primary,#e7e9ea);font-weight:700;cursor:pointer;transition:background-color .2s}
        .adv-modal-button:hover{background-color:var(--modal-button-hover-bg,rgba(231,233,234,.1))}
        .adv-modal-button.primary,
        .adv-chip.primary {
          background-color:var(--modal-primary-color);
          border-color:var(--modal-primary-color);
          color:var(--modal-primary-text-color);
        }
        .adv-modal-button.primary:hover{background-color:var(--modal-primary-color-hover)}
        .adv-modal-button[disabled]{opacity:.5; cursor:not-allowed;}
        #adv-settings-import.adv-modal-button[disabled]{opacity:1;}
        .adv-modal-body::-webkit-scrollbar{width:8px}
        .adv-modal-body::-webkit-scrollbar-track{background:var(--modal-scrollbar-track,#202327)}
        .adv-modal-body::-webkit-scrollbar-thumb{background:var(--modal-scrollbar-thumb,#536471);border-radius:4px}
        body.adv-dragging{user-select:none}
        .adv-account-label-group{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
        .adv-exclude-toggle{display:flex;align-items:center}
        .adv-exclude-toggle input{margin-right:4px}
        .adv-exclude-toggle label{font-size:13px;font-weight:normal;color:var(--modal-text-secondary,#8b98a5);cursor:pointer}
        hr.adv-separator{border:none;height:1px;background-color:var(--hr-color,#333);margin:20px 0;transition:background-color .2s}
        /* ★全タブ共通のズーム対象に拡張（検索タブの既存idにも適用維持） */
        .adv-zoom-root, #adv-zoom-root{ transform-origin: top left; will-change: transform; padding:12px 11.6px 10px 11px; }
        #adv-zoom-root {
          padding-top: 16px; /* 検索タブの上余白だけを 16px に上書き */
          padding-left:16px; padding-right:20px;
        }
        .adv-modal-body{ overflow:auto; }

        .adv-form-row.two-cols { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
        @media (max-width: 480px) { .adv-form-row.two-cols { grid-template-columns:1fr; } }

        .adv-tabs {
            display: flex;
            transform-origin: top left;
            border-bottom: 1px solid var(--modal-border, #333);
            padding: 0 8px 0 6px;
            gap: 4px;
            align-items: stretch;
            flex-wrap: wrap;
            container-type: inline-size;

            /* ▼ 固定表示設定 */
            position: sticky;
            top: 0;
            z-index: 10;
            background-color: var(--modal-bg, #000);
            box-shadow: var(--modal-tabs-shadow);
        }

        .adv-tab-btn {
            appearance: none;
            border: none;
            background: transparent;
            color: var(--modal-text-secondary, #8b98a5);
            padding: 10px 8px;
            cursor: pointer;
            font-weight: 700;
            border-radius: 8px 8px 0 0;
            font-size: 0.78rem;

            /* ボタン内のテキストは折り返さない */
            white-space: nowrap;

            /* 余ったスペースを全員で分け合う（均等配置・最大化） */
            flex: 1 1 auto;
            text-align: center;

            /* なめらかな変化 */
            transition: font-size 0.1s, padding 0.1s, background-color 0.2s;
        }

        .adv-tab-btn.active {
            color: var(--modal-text-primary, #e7e9ea);
            background-color: var(--modal-input-bg, #202327);
            border: 1px solid var(--modal-input-border, #38444d);
            border-bottom: none;
            /* アクティブタブは少し強調 */
            z-index: 1;
        }

        /* ▼▼▼ コンテナクエリ: 幅に応じて最適化 ▼▼▼ */

        /* 幅 480px 以下: フォントを少し小さくし、1行収まりを狙う */
        @container (max-width: 480px) {
            .adv-tab-btn {
                font-size: 12px;
                padding: 8px 4px;
            }
        }

        /* 幅 380px 以下: さらにフォントを詰め、もし2行になっても違和感ないサイズに */
        @container (max-width: 380px) {
            .adv-tab-btn {
                font-size: 11px;
                padding: 6px 2px;
                border-radius: 6px; /* 角丸も少し小さく */
            }
            /* 2行になった際に上下の列がくっつきすぎないようにする */
            .adv-tabs {
                row-gap: 2px;
            }
            /* 2行目のボーダー処理（見た目を整える） */
            .adv-tab-btn.active {
                border-bottom: 1px solid var(--modal-input-bg, #202327);
                margin-bottom: -1px;
            }
        }

        .adv-tab-content { display:none; }
        .adv-tab-content.active { display:block; }

        .adv-secret-wrap { display:flex; align-items:center; gap:8px; }
        .adv-secret-btn { cursor:pointer; border:1px solid var(--modal-input-border,#38444d); background:var(--modal-input-bg,#202327); color:var(--modal-text-primary,#e7e9ea); padding:4px 8px; border-radius:9999px; font-weight:700; user-select:none; display:flex; align-items:center; gap:6px; font-size:12px; }
        .adv-secret-btn .dot { width:7px; height:7px; border-radius:50%; background:#777; box-shadow:0 0 0px #0000; transition:all .2s; }
        .adv-secret-btn.off { opacity:0.9; }
        .adv-secret-btn.on { background-color:var(--modal-primary-color); border-color:var(--modal-primary-color); color:var(--modal-primary-text-color); }
        .adv-secret-btn.on .dot { background:#fff; box-shadow:0 0 8px rgba(255,255,255,.9); }

        /* Header Sync Button */
        .adv-header-sync-btn {
            background: transparent; border: none; cursor: pointer; padding: 0;
            width: 28px; height: 28px; border-radius: 50%; /* 32px -> 28px */
            display: flex; align-items: center; justify-content: center;
            color: var(--modal-text-secondary, #8b98a5);
            transition: background-color .2s, color .2s;
            margin: 0; /* マージンは親のflex gapに任せる */
        }
        .adv-header-sync-btn:hover {
            background-color: var(--modal-button-hover-bg, rgba(231,233,234,.1));
            color: var(--modal-primary-color, #1d9bf0);
        }
        .adv-header-sync-btn svg { width: 16px; height: 16px; fill: currentColor; } /* 18px -> 16px */
        .adv-header-sync-btn.spinning svg { animation: adv-spin 1s linear infinite; }
        @keyframes adv-spin { 100% { transform: rotate(360deg); } }

        /* 同期ステータス用カラー */
        .adv-header-sync-btn.success { color: #17bf63 !important; } /* Twitter Green */
        .adv-header-sync-btn.error { color: #f4212e !important; }   /* Twitter Red */

        .adv-list { display:flex; flex-direction:column; gap:8px; }
        .adv-item { position: relative; border:1px solid var(--modal-input-border,#38444d); background:var(--modal-input-bg,#202327); border-radius:8px; padding:8px; display:flex; gap:8px; align-items:flex-start; }
        .adv-item.dragging { opacity:.6; }
        .adv-item-handle { cursor:grab; user-select:none; padding:4px 6px; border-radius:6px; border:1px dashed var(--modal-border,#333); touch-action: none; }
        .adv-item-avatar { width:36px; height:36px; border-radius:9999px; object-fit:cover; flex:0 0 auto; background:var(--modal-border,#333); }
        a.adv-link { color: inherit; text-decoration: none; }
        a.adv-link:hover { text-decoration: underline; cursor: pointer; }
        .adv-item-avatar-link { display:inline-block; border-radius:9999px; }
        .adv-item-main { flex:1; min-width:0; }

        .adv-item-title { font-size:14px; font-weight:700; color:var(--modal-text-primary,#e7e9ea); word-break:break-word; display: block; line-height: 1.5; }
        .adv-item-sub { font-size:12px; color:var(--modal-text-secondary,#8b98a5); margin-top:2px; display:flex; gap:6px; flex-wrap:wrap; align-items:center; }
        .adv-item-actions { display:flex; gap:6px; align-items:center; align-self:center; }
        .adv-chip { border:1px solid var(--modal-input-border,#38444d); background:transparent; color:var(--modal-text-primary,#e7e9ea); padding:4px 8px; border-radius:9999px; font-size:12px; cursor:pointer; }

        .adv-fav-btn-pos { position: absolute; right: 8px; }
        .adv-fav-btn-top { top: 8px; }
        .adv-fav-btn-bottom { bottom: 8px; }
        .adv-chip.danger {
          border-color: var(--danger-border, #8b0000);
          color: var(--danger-text, #ffb3b3);
        }
        .adv-modal-button.danger {
          border-color: var(--danger-border, #8b0000);
          color: var(--danger-text, #ffb3b3);
        }
        .adv-modal-button.danger:hover,
        .adv-chip.danger:hover {
          background-color: var(--danger-hover-bg, rgba(244, 33, 46, 0.1));
        }
        .adv-chip.scope { padding:2px 6px; font-size:11px; line-height:1.2; opacity:0.95; }

        .adv-toast { position:fixed; z-index:10001; left:50%; transform:translateX(-50%); bottom:24px; background:#111a; color:#fff; backdrop-filter: blur(6px); border:1px solid #fff3; padding:8px 12px; border-radius:8px; font-weight:700; opacity:0; pointer-events:none; transition:opacity .2s, transform .2s; }
        .adv-toast.show { opacity:1; transform:translateX(-50%) translateY(-6px); }

        .adv-modal-footer { justify-content:flex-end; }
        .adv-modal-footer .adv-modal-button#adv-save-button { margin-right:auto; }

        .adv-tab-toolbar {
          display:flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom:12px;
          padding: 0 2px;
        }
        /* ツールバーの左側（検索・ソート） */
        .adv-tab-toolbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1 1 auto;
          min-width: 150px;
        }
        /* ツールバーの右側（すべて削除ボタン） */
        .adv-tab-toolbar-right {
          display: flex;
          flex: 0 0 auto;
        }
        /* ツールバー入力欄の共通スタイル */
        .adv-select, .adv-input {
          background-color:var(--modal-input-bg,#202327);
          border:1px solid var(--modal-input-border,#38444d);
          border-radius:8px;
          padding:6px 10px;
          color:var(--modal-text-primary,#e7e9ea);
        }
        /* 検索ボックスとセレクトボックスのスタイル（.adv-folder-toolbar内と共通化） */
        /* 共通スタイルは .adv-input, .adv-select が担当 */
        .adv-tab-toolbar .adv-input {
          flex: 1;
          min-width: 80px;
        }
        .adv-tab-toolbar .adv-select {
          flex: 0 1 auto;
        }

        [data-testid="cellInnerDiv"][data-adv-hidden],
        article[data-adv-hidden] {
          display:none !important;
          content-visibility: hidden;
          contain: strict;
        }

        #advanced-search-modal { max-height:none; }
        .adv-resizer { position:absolute; z-index:10002; background:transparent; }
        .adv-resizer.e, .adv-resizer.w { top:-3px; bottom:-3px; width:8px; }
        .adv-resizer.e { right:-3px; cursor: ew-resize; }
        .adv-resizer.w { left:-3px;  cursor: ew-resize; }
        .adv-resizer.n, .adv-resizer.s { left:-3px; right:-3px; height:8px; }
        .adv-resizer.n { top:-3px;    cursor: ns-resize; }
        .adv-resizer.s { bottom:-3px; cursor: ns-resize; }
        .adv-resizer.se, .adv-resizer.ne, .adv-resizer.sw, .adv-resizer.nw { width:12px; height:12px; }
        .adv-resizer.se { right:-4px;  bottom:-4px; cursor:nwse-resize; }
        .adv-resizer.ne { right:-4px;  top:-4px;    cursor:nesw-resize; }
        .adv-resizer.sw { left:-4px;   bottom:-4px; cursor:nesw-resize; }
        .adv-resizer.nw { left:-4px;   top:-4px;    cursor:nwse-resize; }

        /* ▶ Mute タブ */
        .adv-mute-add { display:flex; gap:8px; align-items:center; margin-bottom:10px; }
        .adv-mute-add input[type=text]{ flex:1; border-radius:8px; padding: 6px 10px; font-size: 14px; }
        .adv-mute-list { display:flex; flex-direction:column; gap:8px; }

        /* ▼ グローバル無効（マスターOFF）のとき：リスト全体を淡く */
        .adv-mute-list.disabled {
          opacity: .6;
          filter: grayscale(35%);
        }

        /* ▼ 個別無効（enabled=false）の行だけ淡く＋打ち消し等の視覚 */
        .adv-mute-item {
          border:1px solid var(--modal-input-border,#38444d);
          background:var(--modal-input-bg,#202327);
          border-radius:8px;
          padding:8px 10px;
          display:flex;
          gap:10px;
          justify-content: space-between;
          align-items:center;
          transition: opacity .15s ease, filter .15s ease, border-color .15s ease;
        }
        .adv-mute-item.disabled {
          opacity: .55;
          filter: grayscale(25%);
          border-color: color-mix(in oklab, var(--modal-input-border,#38444d), transparent 20%);
        }
        .adv-mute-item.disabled .adv-mute-word {
          color: var(--modal-text-secondary,#8b98a5);
          text-decoration: line-through;
        }

        /* 左側のコンテナ（単語＋オプション） */
        .adv-mute-content-left {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }

        .adv-mute-word {
          font-weight:700;
          color:var(--modal-text-primary,#e7e9ea);
          word-break:break-word;
          font-size: 14px;
        }

        /* 左下のオプション群 */
        .adv-mute-options-row {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        /* 右側のコンテナ（削除ボタンのみ） */
        .adv-mute-actions-right {
          display:flex;
          align-items:center;
          justify-content:center;
          flex: 0 0 auto;
          white-space: nowrap;
          padding-left: 4px;
        }
        @media (max-width: 480px) {
          .adv-mute-actions { margin-top: 4px; }
        }
        .adv-toggle {
          display: inline-flex;
          gap: 6px;
          align-items: center;
          color: var(--modal-text-secondary,#8b98a5);
          line-height: 1;
          margin-bottom:0!important;
        }
        .adv-toggle input[type="checkbox"] {
          width: 14px;
          height: 14px;
          margin: 0;
          flex: 0 0 auto;
          vertical-align: middle;
        }
        .adv-toggle span {
          font-size: 11px;
          line-height: 1;
        }
        /* ▼▼▼ Mute Header Fix ▼▼▼ */
        .adv-mute-header {
            display:flex;
            justify-content:space-between;
            align-items:center;
            margin: 4px 0 12px;
            gap: 10px;
            flex-wrap: nowrap; /* 折り返しを禁止して1行に強制 */
        }
        .adv-mute-header input[type="text"] {
            flex: 1;
            min-width: 0;
            border-radius: 8px;
            padding: 6px 10px;
            font-size: 14px;
            background-color: var(--modal-input-bg,#202327);
            border: 1px solid var(--modal-input-border,#38444d);
            color: var(--modal-text-primary,#e7e9ea);
        }
        .adv-mute-header input[type="text"]:focus {
            outline: 0;
            border-color: var(--modal-primary-color);
        }
        .adv-mute-title {
            font-weight:700;
            color: var(--modal-text-primary,#e7e9ea);
            white-space: nowrap; /* テキスト折り返し禁止 */
            overflow: hidden;
            text-overflow: ellipsis; /* 溢れたら...にする */
            flex-shrink: 1; /* 幅不足時はタイトル側を縮める */
            min-width: 0;
        }
        .adv-mute-header-controls {
            display: flex;
            align-items: center;
            gap: 8px; /* 余白を少し詰める */
            flex-shrink: 0; /* 操作パネルは縮めない */
        }
        #adv-mute-mode {
            padding: 3px 24px 3px 8px; /* 矢印スペース考慮 */
            font-size: 12px;
            height: 28px;
            cursor: pointer;
            width: auto;
        }

        /* マスター切替の一瞬だけ付けるガードクラス */
        .adv-no-anim, .adv-no-anim * {
          transition: none !important;
        }
        #adv-history-empty:not(:empty),
        #adv-saved-empty:not(:empty),
        #adv-favorites-empty:not(:empty),
        #adv-accounts-empty:not(:empty),
        #adv-lists-empty:not(:empty) {
          padding-inline: 7px;
        }
        #adv-mute-empty:not(:empty) {
          padding-top: 6px;
        }

        /* ▼ マスターOFF中は、個別無効の“さらに薄く”を抑制（親の薄さのみ適用） */
        .adv-mute-list.disabled .adv-mute-item.disabled {
          opacity: 1;    /* 子の追加の薄さを無効化（親のopacityのみが効く） */
          filter: none;  /* 子の追加グレースケールも無効化（親側のfilterのみ適用） */
          /* ボーダーだけ通常色に戻す */
          /* border-color: var(--modal-input-border,#38444d); */
        }

        /* === Trigger: モーダルと同質の見た目に合わせる === */
        #advanced-search-trigger.adv-trigger-search {
          width: 49px; height: 49px;
          border-radius: 9999px;
          background-color: var(--modal-bg, #000);
          color: var(--modal-text-primary, #e7e9ea);
          border: 2px solid var(--modal-border, #2f3336);          /* ← モーダルと同じ枠色 */
          box-shadow: 0 8px 24px rgba(29,155,240,.2);              /* ← モーダルと同じshadow */
          display:flex; align-items:center; justify-content:center;
          transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease;
        }

        #advanced-search-trigger.adv-trigger-search:hover {
          /* 背景は変えず、浮かせる表現だけ強化 */
          transform: translateZ(0) scale(1.04);
          box-shadow: 0 12px 36px rgba(29,155,240,.28);
          border-color: var(--modal-border, #2f3336);
        }

        #advanced-search-trigger.adv-trigger-search:active {
          transform: translateZ(0) scale(0.98);
          box-shadow: 0 6px 18px rgba(29,155,240,.22);
        }

        #advanced-search-trigger.adv-trigger-search:focus-visible {
          outline: none;
          box-shadow:
            0 8px 24px rgba(29,155,240,.2),
            0 0 0 3px color-mix(in oklab, var(--modal-primary-color, #1d9bf0) 45%, transparent);
        }

        #advanced-search-trigger.adv-trigger-search svg {
          width: 22px; height: 22px;
          display:block;
          /* 検索アイコンは stroke="currentColor" を使っているので配色は自動追従 */
        }

        /* リストコンテナ自体に十分な高さを確保し、下部にドロップ用の余白を強制的に広げる */
        #adv-accounts-list,
        #adv-lists-list,
        #adv-saved-list {
            min-height: 200px;      /* アイテムが空でもドロップできるようにする */
            padding-bottom: 20px;
            box-sizing: content-box; /* padding分を確実に高さに加える */
        }

        /* 未分類セクションが空の時も、ドラッグ中は少し広げて受け入れやすくする */
        body.adv-dragging .adv-unassigned {
            min-height: 60px;
            background-color: rgba(128, 128, 128, 0.05); /* 視覚的にエリアを暗示 */
            border-radius: 8px;
            transition: min-height 0.2s ease, background-color 0.2s;
        }

        /* === Folders === */
        .adv-folder { border:1px solid var(--modal-input-border,#38444d); border-radius:10px; margin-bottom:10px; }
        .adv-folder-header {
          display:flex; justify-content:space-between; align-items:center;
          padding:8px 10px; background:var(--modal-input-bg,#202327); border-bottom:1px solid var(--modal-input-border,#38444d);
        }
        .adv-folder[data-drop="1"] { outline:2px dashed var(--modal-primary-color); outline-offset:-2px; }
        .adv-folder-title { display:flex; gap:8px; align-items:baseline; }
        .adv-folder-actions { display:flex; gap:6px; }
        .adv-folder-toolbar { display:flex; gap:8px; align-items:center; margin:0 0 12px; padding:0 2px; }
        .adv-folder-toolbar input[type="text"] { flex:1; min-width:80px; }
        .adv-folder-collapsed .adv-list { display:none; }

        /* ▶ Folder headers: show grab cursor except on action buttons */
        .adv-folder-header { cursor: grab; touch-action: none; }
        .adv-folder-header:active { cursor: grabbing; }

        /* ボタン上では通常のポインタ（=ドラッグ開始させない見た目） */
        .adv-folder-header .adv-folder-actions,
        .adv-folder-header .adv-folder-actions * {
          cursor: pointer;
        }

        /* ▼ トグルボタン（左端） */
        .adv-folder-toggle {
          appearance: none;
          border: none;
          background: transparent;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          cursor: pointer;
          margin-right: 6px;
        }

        .adv-folder-toggle:focus-visible {
          outline: none;
          box-shadow: 0 0 0 2px color-mix(in oklab, var(--modal-primary-color, #1d9bf0) 60%, transparent);
        }

        /* ▼ アイコン（chevron） */
        .adv-folder-toggle svg {
          width: 16px; height: 16px;
          transition: transform .15s ease;
        }

        /* ▼ 開閉で向きを変える（右▶ → 下▼） */
        .adv-folder:not(.adv-folder-collapsed) .adv-folder-toggle svg {
          transform: rotate(90deg);
        }

        /* ▼ 開いているヘッダーはわずかに背景強調 */
        .adv-folder:not(.adv-folder-collapsed) .adv-folder-header {
          background: color-mix(in oklab, var(--modal-input-bg,#202327) 92%, var(--modal-primary-color,#1d9bf0));
        }

        /* ▼ ドラッグハンドルは“掴める”見た目を強調 */
        .adv-folder-drag-handle {
          cursor: grab;
          user-select: none;
          padding: 4px 6px;
          border-radius: 6px;
          border: 1px dashed var(--modal-border,#38444d);
        }
        .adv-folder-drag-handle:active { cursor: grabbing; }

        /* ▼ Unassigned セクション（見出しなし・枠なし） */
        .adv-unassigned {
          margin-bottom: 10px;
          min-height: 30px; /* ★ 空の時でもドロップできるように最小高さを確保 */
        }
        .adv-unassigned .adv-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        /* フォルダー並び替え用のドラッグ時の視覚（Unassigned も対象） */
        .adv-unassigned.dragging-folder {
          opacity: .6;
        }

        /* タブ背景およびリストコンテナ背景へのドロップハイライト */
        #adv-tab-accounts.adv-bg-drop-active,
        #adv-tab-lists.adv-bg-drop-active,
        #adv-tab-saved.adv-bg-drop-active,
        #adv-accounts-list.adv-bg-drop-active,
        #adv-lists-list.adv-bg-drop-active,
        #adv-saved-list.adv-bg-drop-active {
          outline: 2px dashed var(--modal-primary-color, #1d9bf0);
          /* リストコンテナ側はパディングが無いためオフセットを小さく */
          outline-offset: -4px;
        }
        /* タブパネル（上部余白）側は既存のオフセットを維持 */
        #adv-tab-accounts.adv-bg-drop-active,
        #adv-tab-lists.adv-bg-drop-active,
        #adv-tab-saved.adv-bg-drop-active {
          outline-offset: -8px;
        }

        /* 背景（Unassigned 宛て）をドロップ中は、フォルダー内の“薄い残像”を消す */
        #adv-tab-accounts.adv-bg-drop-active .adv-list .adv-item.dragging,
        #adv-accounts-list.adv-bg-drop-active .adv-list .adv-item.dragging,
        #adv-tab-lists.adv-bg-drop-active .adv-list .adv-item.dragging,
        #adv-lists-list.adv-bg-drop-active .adv-list .adv-item.dragging,
        #adv-tab-saved.adv-bg-drop-active .adv-list .adv-item.dragging,
        #adv-saved-list.adv-bg-drop-active .adv-list .adv-item.dragging {
          display: none !important;
        }

        /* === Settings modal === */
        #adv-settings-modal.adv-settings-modal{
          position:fixed;
          inset:0;
          z-index:10001;
          display:none;
          align-items:center;
          justify-content:center;
          background:rgba(0,0,0,.5);
        }
        .adv-settings-dialog{
          width:420px;
          max-width:90vw;
          max-height:80vh;
          background-color:var(--modal-bg,#000);
          color:var(--modal-text-primary,#e7e9ea);
          border-radius:16px;
          border:1px solid var(--modal-border,#333);
          box-shadow:0 8px 24px rgba(0,0,0,.3);
          display:flex;
          flex-direction:column;
          overflow:hidden;
          font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
        }
        .adv-settings-header{
          padding:12px 16px;
          border-bottom:1px solid var(--modal-border,#333);
          display:flex;
          align-items:center;
          justify-content:space-between;
        }
        .adv-settings-title{
          margin:0;
          font-size:16px;
          font-weight:700;
        }
        .adv-settings-close{
          border:none;
          background:transparent;
          color:var(--modal-close-color,#e7e9ea);
          font-size:20px;
          width:32px;
          height:32px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          cursor:pointer;
        }
        .adv-settings-close:hover{
          background-color:var(--modal-close-hover-bg,rgba(231,233,234,.1));
        }
        .adv-settings-body{
          padding:12px 16px 23px 16px;
          overflow-y:auto;
          display:flex;
          flex-direction:column;
          gap:16px;
        }
        .adv-settings-group label{
          display:block;
          margin-bottom:4px;
          font-size:14px;
          font-weight:700;
          color:var(--modal-text-secondary,#8b98a5);
        }
        .adv-settings-group select,
        .adv-settings-group textarea{
          width:100%;
          background-color:var(--modal-input-bg,#202327);
          border:1px solid var(--modal-input-border,#38444d);
          border-radius:8px;
          padding:8px 10px;
          color:var(--modal-text-primary,#e7e9ea);
          font-size:14px;
          box-sizing:border-box;
        }
        .adv-settings-group textarea{
          resize:vertical;
          min-height:80px;
        }
        .adv-settings-section-header {
          margin: 12px 0 2px 0;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--modal-border,#333);
          font-size: 13px;
          font-weight: 700;
          color: var(--modal-text-primary,#e7e9ea);
        }
        .adv-settings-toggle-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
        }
        .adv-settings-toggle-row .adv-toggle {
          font-size: 14px;
          color: var(--modal-text-primary,#e7e9ea);
          user-select: none;
          cursor: pointer;
        }
        .adv-settings-toggle-row .adv-toggle span {
          font-size: 14px;
        }
        /* Simple toggle switch CSS */
        .adv-switch {
          position: relative;
          display: inline-block;
          width: 40px;
          height: 22px;
        }
        .adv-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .adv-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--modal-input-border,#38444d);
          transition: .2s;
          border-radius: 22px;
        }
        .adv-slider:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 3px;
          bottom: 3px;
          background-color: var(--modal-bg, #000);
          transition: .2s;
          border-radius: 50%;
        }
        .adv-switch input:checked + .adv-slider {
          background-color: var(--modal-primary-color);
        }
        .adv-switch input:checked + .adv-slider:before {
          transform: translateX(18px);
        }
        .adv-settings-actions-inline{
          display:flex;
          gap:8px;
          margin-top:6px;
          flex-wrap:wrap;
        }
        .adv-settings-footer{
          padding:10px 16px;
          border-top:1px solid var(--modal-border,#333);
          display:flex;
          justify-content:flex-end;
          gap:8px;
        }

        /* === Tab Drag & Drop === */
        .adv-tab-btn {
          user-select: none;
        }
        .adv-tab-btn:active {
          cursor: grabbing;
        }
        .adv-tab-btn.dragging {
          opacity: .5;
        }

        /* --- Favorite Tags CSS --- */

        /* ▼ ブックマークUI専用の配色変数を定義 */
        :root {
          /* デフォルト (Dim / Dark) は静的なダークテーマ */
          --ft-bg: rgb(21, 24, 28);
          --ft-border-light: rgba(239, 243, 244, 0.24);
          --ft-border-dim: rgba(239, 243, 244, 0.15);
          --ft-border-strong: rgba(239, 243, 244, 0.3);
          --ft-border-accent: rgba(239, 243, 244, 0.8);
          --ft-text-primary: rgb(239, 243, 244);
          --ft-text-secondary: rgba(239, 243, 244, 0.7);
          --ft-input-bg: rgba(0,0,0,0.2);
          --ft-input-border: rgba(239,243,244,0.2);
          --ft-hover-bg: rgba(255, 255, 255, 0.06);
          --ft-hover-bg-strong: rgba(255, 255, 255, 0.08);
          --ft-accent-color: #1d9bf0;
        }
        :root.x-theme-light {
          /* Lightテーマの時だけ、X本体の動的変数を参照する */
          --ft-bg: var(--modal-bg);
          --ft-border-light: var(--modal-border);
          --ft-border-dim: var(--modal-border);
          --ft-border-strong: var(--modal-text-secondary);
          --ft-border-accent: var(--modal-text-primary);
          --ft-text-primary: var(--modal-text-primary);
          --ft-text-secondary: var(--modal-text-secondary);
          --ft-input-bg: var(--modal-input-bg);
          --ft-input-border: var(--modal-input-border);
          --ft-hover-bg: var(--modal-button-hover-bg);
          --ft-hover-bg-strong: var(--modal-button-hover-bg);
          --ft-accent-color: var(--modal-primary-color);
        }

        /* Tag chip on tweet header */
        .ft-tag-chip {
          display: inline-flex;
          align-items: center;     /* ボタン内の文字を縦中央に */
          justify-content: center; /* ボタン内の文字を横中央に */
          margin-left: 7px;
          padding: 0 8px;
          height: 20px;
          border-radius: 9999px;
          border: 1px solid currentColor;
          font-size: 11px;
          line-height: 1;
          cursor: pointer;
          user-select: none;
          white-space: nowrap;
          background: rgba(255, 255, 255, 0.03);
          flex: 0 0 auto;
          order: 9999;
          align-self: center;
          vertical-align: middle;
        }
        .ft-tag-chip-label {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          padding-bottom: 0.4px;
        }
        .ft-tag-chip-uncategorized {
          opacity: 0.7;
        }

        /* Dropdown for selecting tag / filter */
        .ft-tag-dropdown {
          position: fixed;
          z-index: 2147482000;
          min-width: 220px;
          max-width: 260px;
          max-height: 60vh;
          overflow-y: auto;
          padding: 8px;
          border-radius: 12px;
          border: 1px solid var(--ft-border-light);
          background: var(--ft-bg);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.7);
          font-size: 13px;
          color: var(--ft-text-primary);
        }
        .ft-tag-dropdown-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
          font-weight: 600;
        }
        .ft-tag-dropdown-close {
          border: none;
          background: transparent;
          color: inherit;
          cursor: pointer;
          padding: 2px 4px;
        }
        .ft-tag-dropdown-tags {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 8px;
        }
        .ft-tag-dropdown-tag-item {
          display: flex;
          align-items: center;
          padding: 4px 6px;
          border-radius: 6px;
          cursor: pointer;
        }
        .ft-tag-dropdown-tag-item:hover {
          background: var(--ft-hover-bg);
        }
        .ft-tag-dropdown-tag-color {
          width: 10px;
          height: 10px;
          border-radius: 9999px;
          margin-right: 6px;
        }
        .ft-tag-dropdown-tag-label {
          flex: 1;
        }
        .ft-tag-dropdown-tag-selected::after {
          content: '✓';
          margin-left: 6px;
          font-size: 11px;
        }

        /* New tag row in dropdown */
        .ft-tag-dropdown-new {
          border-top: 1px solid var(--ft-border-dim);
          padding-top: 6px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .ft-tag-dropdown-new-row {
          display: flex;
          gap: 4px;
        }
        .ft-tag-dropdown-new-input {
          flex: 1;
          min-width: 0;
          box-sizing: border-box;
          background: var(--ft-input-bg);
          border: 1px solid var(--ft-input-border);
          border-radius: 6px;
          padding: 3px 6px;
          color: inherit;
        }
        .ft-tag-dropdown-new-color {
          width: 36px;
          padding: 0;
          box-sizing: border-box;
          border-radius: 6px;
          border: 1px solid var(--ft-input-border);
          background: transparent;
        }
        .ft-tag-dropdown-new-button {
          border-radius: 6px;
          border: 1px solid var(--ft-border-strong);
          background: transparent;
          color: inherit;
          padding: 2px 6px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
        }
        .ft-tag-dropdown-new-button:hover {
          background: var(--ft-hover-bg);
        }

        /* Bookmark header controls (テーマ変数適用) */
        .ft-filter-button {
          border-radius: 8px;
          border: 1px solid var(--modal-border, rgba(239,243,244,0.3));
          background: var(--modal-input-bg, rgba(0,0,0,0.2));
          color: var(--modal-text-primary, rgb(239,243,244));
          font-size: 14px;
          padding: 4px 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .ft-filter-button-label {
          max-width: 140px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .ft-filter-button-caret {
          font-size: 10px;
          opacity: 0.8;
        }
        .ft-filter-button[disabled] {
          opacity: 0.4;
          cursor: default;
        }
        .ft-filter-button:not([disabled]):hover {
          background: var(--modal-button-hover-bg, rgba(255,255,255,0.06));
          border-color: var(--modal-text-secondary, rgba(239,243,244,0.6));
        }
        .ft-settings-button {
          border-radius: 9999px;
          width: 26px;
          height: 26px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--modal-border, rgba(239,243,244,0.3));
          background: var(--modal-input-bg, rgba(0,0,0,0.2));
          color: var(--modal-text-primary, rgb(239,243,244));
          cursor: pointer;
        }
        .ft-settings-button:hover {
          background: var(--modal-button-hover-bg, rgba(255,255,255,0.06));
        }

        /* Settings modal */
        .ft-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          z-index: 2147483000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .ft-modal {
          width: min(380px, 100vw - 32px);
          max-height: 80vh;
          border-radius: 16px;
          background: var(--ft-bg);
          border: 1px solid var(--ft-border-light);
          box-shadow: 0 20px 40px rgba(0,0,0,0.75);
          display: flex;
          flex-direction: column;
          color: var(--ft-text-primary);
        }
        .ft-modal-header {
          padding: 10px 14px;
          border-bottom: 1px solid var(--ft-border-dim);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }
        .ft-modal-title {
          font-size: 14px;
          font-weight: 600;
        }
        .ft-modal-toggle {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
        }
        .ft-modal-toggle input[type="checkbox"] {
          accent-color: var(--ft-accent-color);
        }
        .ft-modal-body {
          padding: 10px 14px 12px;
          overflow-y: auto;
          font-size: 13px;
        }
        .ft-modal-footer {
          padding: 8px 14px 10px;
          border-top: 1px solid var(--ft-border-dim);
          display: flex;
          justify-content: flex-end;
          gap: 8px;
        }
        .ft-modal-button {
          border-radius: 9999px;
          border: 1px solid var(--ft-border-strong);
          background: transparent;
          color: inherit;
          font-size: 12px;
          padding: 4px 10px;
          cursor: pointer;
        }
        .ft-modal-button:hover {
          background: var(--ft-hover-bg);
        }

        /* Display settings section */
        .ft-modal-display-settings {
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--ft-border-dim);
          font-size: 12px;
        }
        .ft-modal-display-settings-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
          margin-top: 4px;
        }
        .ft-modal-display-radio {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        /* Tag list in modal */
       .ft-modal-tag-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding-bottom: 30px; /* 余白を大きく取る */
          min-height: 100px;    /* 空っぽでもドロップできるように */
          position: relative;   /* ルートドロップの枠線表示用 */
          box-sizing: content-box; /* paddingを含めない高さ計算 */
        }

        /* 一番下の余白にドラッグした時に、リスト全体の下に枠線を出すクラス */
        .ft-modal-tag-list.ft-drag-to-root::after {
            content: '';
            position: absolute;
            bottom: 20px; /* 余白の中ほどに線を引く */
            left: 0;
            right: 0;
            height: 2px;
            background-color: var(--modal-primary-color, #1d9bf0);
            box-shadow: 0 0 4px var(--modal-primary-color, #1d9bf0);
        }
        .ft-modal-tag-item {
          position: relative;
          display: grid;
          /* [mainCell] [dragHandle] [orderButtons] [deleteBtn] */
          grid-template-columns: minmax(0, 1fr) auto auto auto;
          align-items: center;
          gap: 6px;
          /* cursor: grab; を削除 (ハンドルが担当) */
        }
        .ft-modal-tag-main {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .ft-modal-tag-item-dragging {
          opacity: 0.6;
        }
        .ft-modal-tag-item-drop-before::before,
        .ft-modal-tag-item-drop-after::after {
            content: '';
            position: absolute;
            left: 0;
            right: 0;
            height: 1px;
            /* 従来の色（白っぽいグレー） */
            background-color: var(--ft-border-accent, rgba(239, 243, 244, 0.8));
            border: none; /* border-top/bottom を background-color に変更して統一 */
            pointer-events: none;
        }
        .ft-modal-tag-item-drop-before::before { top: -3.5px; }
        .ft-modal-tag-item-drop-after::after { bottom: -3.5px; }

        /* ルート階層用（青い線） */
        .ft-modal-tag-item.ft-is-root-ref.ft-modal-tag-item-drop-before::before,
        .ft-modal-tag-item.ft-is-root-ref.ft-modal-tag-item-drop-after::after {
            background-color: var(--modal-primary-color, #1d9bf0);
            box-shadow: 0 0 4px var(--modal-primary-color, #1d9bf0); /* 発光させて強調 */
            height: 2px;
            z-index: 10;
        }
        /* 青い線の位置（太くなった分、あるいは強調のため少し外側に広げる） */
        .ft-modal-tag-item.ft-is-root-ref.ft-modal-tag-item-drop-before::before {
            top: -4.2px;
        }
        .ft-modal-tag-item.ft-is-root-ref.ft-modal-tag-item-drop-after::after {
            bottom: -4.2px;
        }
        .ft-modal-tag-item-drop-child {
          background: var(--ft-hover-bg-strong);
        }
        .ft-modal-tag-name {
          background: var(--ft-input-bg);
          border-radius: 6px;
          border: 1px solid var(--ft-input-border);
          padding: 3px 6px;
          color: inherit;
          font-size: 12px;
        }
        .ft-modal-tag-color {
          width: 40px;
          padding: 0;
          border-radius: 6px;
          border: 1px solid var(--ft-input-border);
          background: transparent;
        }
        .ft-modal-tag-order,
        .ft-modal-tag-delete {
          border-radius: 6px;
          border: 1px solid var(--ft-border-strong);
          background: transparent;
          color: inherit;
          padding: 2px 4px;
          cursor: pointer;
          font-size: 11px;
        }
        .ft-modal-tag-order:hover,
        .ft-modal-tag-delete:hover {
          background: var(--ft-hover-bg-strong);
        }

        /* --- Drag handle for tag settings --- */
        .ft-modal-tag-drag-handle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          cursor: grab;
          color: var(--ft-text-secondary);
          user-select: none;
          touch-action: none;
        }
        .ft-modal-tag-drag-handle:hover {
          background: var(--ft-hover-bg-strong);
          color: var(--ft-text-primary);
        }
        /* Uncategorized: disable drag */
        .ft-modal-tag-item[data-kind="uncat"] .ft-modal-tag-drag-handle {
          cursor: not-allowed;
          opacity: 0.5;
        }

        /* New tag row */
        .ft-modal-new-tag {
          border-top: 1px solid var(--ft-border-dim);
          padding-top: 8px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .ft-modal-new-tag-row {
          display: grid;
          grid-template-columns: auto minmax(0, 1fr) auto;
          gap: 6px;
        }

        /* 未分類は名前変更不可＆削除不可の視覚表現 */
        .ft-modal-tag-name[readonly] {
          cursor: not-allowed;
          opacity: 0.8;
        }
        .ft-modal-tag-delete:disabled {
          cursor: not-allowed;
          opacity: 0.4;
        }

        /* Hidden helper */
        .ft-hidden {
          display: none !important;
          content-visibility: hidden;
          contain: strict;
        }
        /* --- End Favorite Tags CSS --- */

        /* --- Favorites Feature --- */
        .adv-fav-btn {
          display: inline-flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer;
          color: rgb(83, 100, 113); /* Default grey */
          padding: 0; margin: 0;
          width: 34.75px; height: 34.75px; /* X standard icon size touch target */
          border-radius: 50%;
          transition: background-color 0.2s, color 0.2s;
        }
        /* ネイティブのクラスを借用した時は固定サイズを無効化する */
        .adv-fav-btn.adv-native-style {
          width: auto;
          height: auto;
          min-width: 34.75px; /* 最低限の大きさは確保 */
          min-height: 34.75px;
        }
        .adv-fav-btn:hover {
          background-color: rgba(29, 155, 240, 0.1);
          color: rgb(29, 155, 240);
        }
        .adv-fav-btn.active {
          color: rgb(249, 24, 128); /* Pink/Red like Like, or Gold? Let's use Gold for Star */
          color: rgb(255, 215, 0);
        }
        .adv-fav-btn.active:hover {
          background-color: rgba(255, 215, 0, 0.1);
        }
        .adv-fav-btn svg {
          width: 20px; height: 20px;
          fill: currentColor;
        }
        .adv-item-body-text {
          font-size: 13px; color: var(--modal-text-primary); margin-top: 4px;
          white-space: pre-wrap;       /* 改行を維持 */
          word-break: break-word;      /* 長い単語を折り返し */
        }
        /* Favorites Media */
        .adv-item-media-row {
          display: flex;
          gap: 4px;
          margin-top: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
        }
        .adv-item-media-row::-webkit-scrollbar { height: 4px; }
        .adv-item-media-row::-webkit-scrollbar-thumb { background: var(--modal-border); border-radius: 2px; }
        .adv-media-thumb {
          height: 60px;
          min-width: 60px;
          border-radius: 6px;
          border: 1px solid var(--modal-border);
          object-fit: cover;
          cursor: pointer;
        }
        /* Favorites Quote */
        .adv-quote-box {
          margin-top: 8px;
          border: 1px solid var(--modal-border);
          border-radius: 12px;
          padding: 8px 12px;
          background-color: rgba(0, 0, 0, 0.03);
        }
        .adv-quote-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 4px;
          font-size: 12px;
        }
        .adv-quote-avatar {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          object-fit: cover;
        }
        .adv-quote-name {
          font-weight: 700;
          color: var(--modal-text-primary);
        }
        .adv-quote-handle {
          color: var(--modal-text-secondary);
        }
        .adv-quote-text {
          font-size: 13px;
          color: var(--modal-text-primary);
          white-space: pre-wrap;
          word-break: break-word;
        }
        /* Content Link */
        .adv-content-link {
          color: var(--modal-primary-color);
          text-decoration: none;
        }
        .adv-content-link:hover {
          text-decoration: underline;
        }

        /* Media Play Icon */
        .adv-media-wrap {
          position: relative;
          display: inline-flex;
        }
        .adv-media-play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background-color: rgba(0, 0, 0, 0.6);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none; /* クリックを下の画像(リンク)に透過させる */
          backdrop-filter: blur(1px);
          z-index: 1;
        }
        .adv-media-play-icon svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
          display: block;
          margin-left: 2px;
        }

        /* --- Link Card (OGP) --- */
        .adv-card-box {
          margin-top: 8px;
          border: 1px solid var(--modal-border);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          display: flex; /* Flexに変更（Small Card対応） */
          flex-direction: column;
          transition: background-color 0.2s;
        }
        .adv-card-box:hover {
          background-color: rgba(255, 255, 255, 0.03);
        }
        /* 通常の画像 */
        .adv-card-image {
          width: 100%;
          height: auto;
          aspect-ratio: 1.91 / 1;
          object-fit: cover;
          display: block;
          border-bottom: 1px solid var(--modal-border);
        }
        /* Small Card用レイアウト */
        .adv-card-box.small-card {
          flex-direction: row; /* 横並び */
          align-items: center;
          height: 100px; /* 高さを固定 */
        }
        .adv-card-box.small-card .adv-card-image {
          width: 100px;
          height: 100px;
          aspect-ratio: 1 / 1;
          border-bottom: none;
          border-right: 1px solid var(--modal-border);
          flex-shrink: 0;
        }
        /* SVGアイコン用コンテナ */
        .adv-card-icon-container {
          width: 100px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--modal-input-bg);
          border-right: 1px solid var(--modal-border);
          color: var(--modal-text-secondary);
          flex-shrink: 0;
        }
        .adv-card-icon-container svg {
          width: 24px;
          height: 24px;
          fill: currentColor;
        }
        .adv-card-content {
          padding: 8px 12px;
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .adv-card-domain {
          font-size: 13px;
          color: var(--modal-text-secondary);
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .adv-card-title {
          font-size: 14px;
          font-weight: 700;
          color: var(--modal-text-primary);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Favorites Item Tag Container */
        .adv-fav-tag-container {
            display: inline-block;
            margin-left: -2px;
            margin-bottom: 1px;
            vertical-align: middle;
            transform: translateY(-2.5px);
        }

        /* --- Mute Collapse Styles --- */
        /* Hard Mute: data-adv-hidden */
        [data-testid="cellInnerDiv"][data-adv-hidden],
        article[data-adv-hidden] {
          display: none !important;
          content-visibility: hidden;
          contain: strict;
        }

        /* Soft Mute: data-adv-collapsed */
        /* 1. Hide original content */
        [data-testid="cellInnerDiv"][data-adv-collapsed] > div:not(.adv-collapsed-placeholder),
        article[data-adv-collapsed] > div:not(.adv-collapsed-placeholder) {
            display: none !important;
        }

        /* 2. Show placeholder */
        .adv-collapsed-placeholder {
            display: none;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            background-color: var(--modal-input-bg, #202327);
            border-bottom: 1px solid var(--modal-border, #38444d);
            cursor: pointer;
            user-select: none;
        }
        .adv-collapsed-placeholder:hover {
            background-color: color-mix(in srgb, var(--modal-input-bg, #202327) 85%, var(--modal-text-primary, #e7e9ea));
        }
        [data-testid="cellInnerDiv"][data-adv-collapsed] .adv-collapsed-placeholder,
        article[data-adv-collapsed] .adv-collapsed-placeholder {
            display: flex !important;
        }

        .adv-collapsed-label {
            flex: 1;
            font-size: 13px;
            color: var(--modal-text-secondary, #8b98a5);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-right: 12px;
        }
        .adv-btn-show {
            background: transparent;
            border: 1px solid var(--modal-primary-color, #1d9bf0);
            color: var(--modal-primary-color, #1d9bf0);
            border-radius: 9999px;
            padding: 4px 16px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        .adv-btn-show:hover {
            background-color: rgba(29, 155, 240, 0.1);
        }

        /* タグチップのサイズ微調整 */
        .adv-item-sub .ft-tag-chip {
            margin-left: 8px;
            font-size: 10px;
            padding: 0 6px;
            height: 18px;
        }
        /* ▼▼▼ 再ミュートボタンのスタイル ▼▼▼ */
        .adv-btn-remute {
            margin-right: 12px; /* Caret(…)との間隔を確保 */
            padding: 4px 12px;  /* クリックしやすいよう少し拡大 */
            font-size: 12px;
            font-weight: 700;
            border-radius: 9999px;
            border: 1px solid var(--modal-border, #38444d);
            color: var(--modal-text-secondary, #8b98a5);
            background: transparent;
            cursor: pointer;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            height: 28px;       /* ヘッダーのアクションボタンの高さに合わせる */
            line-height: 1;
            transition: all 0.2s;
        }
        .adv-btn-remute:hover {
            background: rgba(244, 33, 46, 0.1); /* Red tint */
            color: rgb(244, 33, 46);
            border-color: rgb(244, 33, 46);
        }

        /* ▼▼▼ 検索入力中のフォーカス制御 (Focus Mode) ▼▼▼ */

        /* 1. モーダルを背景レベルまで下げる */
        #advanced-search-modal.adv-z-lower {
            z-index: 0 !important;
        }

        /* 2. Xのアプリ全体をモーダルの上に持ち上げる（サジェスト救出のため） */
        /* #react-root は body 直下の X アプリケーションのルート要素 */
        #react-root.adv-app-lifted {
            z-index: 1 !important;
            position: relative !important; /* z-indexを効かせるために必須 */
        }

        /* 3. サイドバー全体を「不可視」にする
           これにより、トレンド・おすすめユーザー・フッター・枠線などが全て消え、
           背後にあるモーダルが見えるように。
           (opacityではなくvisibilityを使うことで、枠線も判定も完全に消す)
        */
        #react-root.adv-app-lifted [data-testid="sidebarColumn"] {
            visibility: hidden !important;
        }

        /* 4. 検索フォームとその中身だけを「可視化」して救出する
           （visibilityは親がhiddenでも自分をvisibleにすれば表示される）
        */
        #react-root.adv-app-lifted [data-testid="sidebarColumn"] form[role="search"],
        #react-root.adv-app-lifted [data-testid="sidebarColumn"] form[role="search"] * {
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* 5. サジェスト（入力候補）も同様に救出する */
        #react-root.adv-app-lifted [data-testid="sidebarColumn"] [role="listbox"],
        #react-root.adv-app-lifted [data-testid="sidebarColumn"] [role="listbox"] * {
            visibility: visible !important;
            opacity: 1 !important;
        }

        /* モーダルが左側にあって被る場合のみ、左メニューを隠す */
        #react-root.adv-app-lifted.adv-overlap-left-menu header[role="banner"] {
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* === Native Search Resizer === */
        form[role="search"] {
            position: relative !important; /* リサイザーの基準点 */
            max-width: none !important;    /* 幅制限の解除 */
        }
        .adv-native-search-resizer {
            position: absolute;
            right: -8px;
            top: 0;
            bottom: 0;
            width: 16px;
            cursor: col-resize;
            z-index: 9999;
            background: transparent;
            touch-action: none; /* スマホでのスクロール干渉防止 */
        }
        .adv-native-search-resizer:hover {
            background: rgba(29,155,240,0.15); /* ホバー時に薄く青色を表示 */
        }

        /* ▼SP時 (幅700px以下) はレイヤー調整を無視して強制最前面にする */
        @media screen and (max-width: 700px) {
            /* 設定モーダル等をメインモーダルと同じ最前面レイヤーに持ち上げる */
            /* これによりDOM順序が後の設定モーダルが手前に表示される */
            #adv-settings-modal.adv-settings-modal,
            .ft-modal-backdrop,
            .adv-toast {
                z-index: 2147483647 !important;
            }
            /* モーダル本体: 画面中央に固定し、サイズを強制適用 */
            #advanced-search-modal {
                z-index: 2147483647 !important; /* 最前面 */

                /* 位置の強制固定 (JSによるstyle属性を無視させる) */
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                right: auto !important;
                bottom: auto !important;
                transform: translate(-50%, -50%) !important;

                /* サイズの強制 (画面に合わせる) */
                width: 96vw !important;
                height: 85.5vh !important;
                max-width: none !important;
                max-height: none !important;
                border-radius: 16px !important;
            }

            /* ヘッダー: ドラッグできると思わせないカーソルにする */
            .adv-modal-header {
                cursor: default !important;
            }

            /* リサイザー: 非表示にして操作不能にする */
            .adv-resizer {
                display: none !important;
            }

            /* モーダルが開いている(bodyにクラスがある)時はトリガーを消す */
            body.adv-modal-active #advanced-search-trigger {
                display: none !important;
            }
        }
    `);

    const modalHTML = `
        <div id="advanced-search-modal">
            <div class="adv-modal-header">
                <div class="adv-modal-title-left">
                    <h2 data-i18n="modalTitle"></h2>
                    <button id="adv-settings-button" class="adv-settings-btn" type="button" data-i18n-title="tooltipSettings">
                        ${SETTINGS_SVG}
                    </button>
                    <button id="adv-header-sync-btn" class="adv-header-sync-btn" title="Sync Now" style="display:none;">
                        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8 4.41 0 8 3.59 8 8 0 4.41-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" transform="scale(0)"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>
                    </button>
                    </div>
                <div class="adv-secret-wrap">
                    <button id="adv-secret-btn" class="adv-secret-btn off" data-i18n-title="tooltipSecret" title="">
                        <span class="dot" aria-hidden="true"></span>
                        <span id="adv-secret-label" data-i18n="secretMode"></span>
                        <span id="adv-secret-state" style="font-weight:700;"></span>
                    </button>
                    <button class="adv-modal-close" data-i18n-title="tooltipClose">&times;</button>
                </div>
            </div>

            <div class="adv-modal-body">
                <div class="adv-tabs">
                    <button class="adv-tab-btn active" data-tab="search" data-i18n="tabSearch"></button>
                    <button class="adv-tab-btn" data-tab="history" data-i18n="tabHistory"></button>
                    <button class="adv-tab-btn" data-tab="saved" data-i18n="tabSaved"></button>
                    <button class="adv-tab-btn" data-tab="favorites" data-i18n="tabFavorites"></button>
                    <button class="adv-tab-btn" data-tab="mute" data-i18n="tabMute"></button>
                    <button class="adv-tab-btn" data-tab="lists" data-i18n="tabLists"></button>
                    <button class="adv-tab-btn" data-tab="accounts" data-i18n="tabAccounts"></button>
                </div>

                <div class="adv-tab-content active" id="adv-tab-search">
                    <div id="adv-zoom-root" class="adv-zoom-root">
                    <form id="advanced-search-form">
                        <div class="adv-form-group"><label for="adv-all-words" data-i18n="labelAllWords"></label><input type="text" id="adv-all-words" data-i18n-placeholder="placeholderAllWords"></div>
                        <div class="adv-form-group"><label for="adv-exact-phrase" data-i18n="labelExactPhrase"></label><input type="text" id="adv-exact-phrase" data-i18n-placeholder="placeholderExactPhrase"></div>
                        <div class="adv-form-group"><label for="adv-any-words" data-i18n="labelAnyWords"></label><input type="text" id="adv-any-words" data-i18n-placeholder="placeholderAnyWords"></div>
                        <div class="adv-form-group"><label for="adv-not-words" data-i18n="labelNotWords"></label><input type="text" id="adv-not-words" data-i18n-placeholder="placeholderNotWords"></div>
                        <div class="adv-form-group"><label for="adv-hashtag" data-i18n="labelHashtag"></label><input type="text" id="adv-hashtag" data-i18n-placeholder="placeholderHashtag"></div>
                        <div class="adv-form-group">
                          <label for="adv-lang" data-i18n="labelLang"></label>
                          <select id="adv-lang">
                            <option value="" data-i18n="optLangDefault"></option>
                            <option value="ja" data-i18n="optLangJa"></option>
                            <option value="en" data-i18n="optLangEn"></option>
                            <option value="id" data-i18n="optLangId"></option>     <!-- インドネシア -->
                            <option value="hi" data-i18n="optLangHi"></option>     <!-- ヒンディー（インド） -->
                            <option value="de" data-i18n="optLangDe"></option>     <!-- ドイツ -->
                            <option value="tr" data-i18n="optLangTr"></option>     <!-- トルコ -->
                            <option value="es" data-i18n="optLangEs"></option>     <!-- スペイン語（メキシコ含む） -->
                            <option value="pt" data-i18n="optLangPt"></option>     <!-- ポルトガル語（ブラジル）-->
                            <option value="ar" data-i18n="optLangAr"></option>     <!-- アラビア語（サウジ等） -->
                            <option value="fr" data-i18n="optLangFr"></option>
                            <option value="ko" data-i18n="optLangKo"></option>
                            <option value="ru" data-i18n="optLangRu"></option>
                            <option value="zh-cn" data-i18n="optLangZhHans"></option> <!-- 簡体中文 -->
                            <option value="zh-tw" data-i18n="optLangZhHant"></option> <!-- 繁體中文 -->
                          </select>
                        </div>
                        <hr class="adv-separator">
                        <div class="adv-form-group">
                            <label data-i18n="labelFilters"></label>
                            <div class="adv-filter-grid">
                                <div class="adv-checkbox-group"><span data-i18n="labelVerified"></span><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-verified-include"><label for="adv-filter-verified-include" data-i18n="checkInclude"></label></div><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-verified-exclude"><label for="adv-filter-verified-exclude" data-i18n="checkExclude"></label></div></div>
                                <div class="adv-checkbox-group"><span data-i18n="labelLinks"></span><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-links-include"><label for="adv-filter-links-include" data-i18n="checkInclude"></label></div><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-links-exclude"><label for="adv-filter-links-exclude" data-i18n="checkExclude"></label></div></div>
                                <div class="adv-checkbox-group"><span data-i18n="labelImages"></span><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-images-include"><label for="adv-filter-images-include" data-i18n="checkInclude"></label></div><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-images-exclude"><label for="adv-filter-images-exclude" data-i18n="checkExclude"></label></div></div>
                                <div class="adv-checkbox-group"><span data-i18n="labelVideos"></span><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-videos-include"><label for="adv-filter-videos-include" data-i18n="checkInclude"></label></div><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-videos-exclude"><label for="adv-filter-videos-exclude" data-i18n="checkExclude"></label></div></div>
                                <div class="adv-checkbox-group"><span data-i18n="labelReposts"></span><div class="adv-checkbox-item" style="display: none;"><input type="checkbox" id="adv-filter-reposts-include" disabled><label for="adv-filter-reposts-include" data-i18n="checkInclude"></label></div><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-reposts-exclude"><label for="adv-filter-reposts-exclude" data-i18n="checkExclude"></label></div></div>
                                <div class="adv-checkbox-group"><span data-i18n="labelTimelineHashtags"></span><div class="adv-checkbox-item" style="display: none;"><input type="checkbox" id="adv-filter-hashtags-include" disabled><label for="adv-filter-hashtags-include" data-i18n="checkInclude"></label></div><div class="adv-checkbox-item"><input type="checkbox" id="adv-filter-hashtags-exclude"><label for="adv-filter-hashtags-exclude" data-i18n="checkExclude"></label></div></div>
                            </div>
                        </div>

                        <div class="adv-form-group" title="" data-i18n-title="hintSearchTarget">
                          <label data-i18n="labelSearchTarget"></label>
                          <div class="adv-checkbox-group">
                            <div class="adv-checkbox-item">
                              <input type="checkbox" id="adv-exclude-hit-name" checked>
                              <label for="adv-exclude-hit-name" data-i18n="labelHitName" title="" data-i18n-title="hintName"></label>
                            </div>
                            <div class="adv-checkbox-item">
                              <input type="checkbox" id="adv-exclude-hit-handle" checked>
                              <label for="adv-exclude-hit-handle" data-i18n="labelHitHandle" title="" data-i18n-title="hintHandle"></label>
                            </div>
                          </div>
                        </div>

                        <div class="adv-form-row two-cols">
                            <div class="adv-form-group">
                                <label for="adv-account-scope" data-i18n="labelAccountScope"></label>
                                <select id="adv-account-scope">
                                    <option value="" data-i18n="optAccountAll"></option>
                                    <option value="following" data-i18n="optAccountFollowing"></option>
                                </select>
                            </div>
                            <div class="adv-form-group">
                                <label for="adv-location-scope" data-i18n="labelLocationScope"></label>
                                <select id="adv-location-scope">
                                    <option value="" data-i18n="optLocationAll"></option>
                                    <option value="nearby" data-i18n="optLocationNearby"></option>
                                </select>
                            </div>
                        </div>

                        <div class="adv-form-group"><label data-i18n="labelReplies"></label><select id="adv-replies"><option value="" data-i18n="optRepliesDefault"></option><option value="include" data-i18n="optRepliesInclude"></option><option value="only" data-i18n="optRepliesOnly"></option><option value="exclude" data-i18n="optRepliesExclude"></option></select></div>
                        <hr class="adv-separator">
                        <div class="adv-form-group">
                            <label data-i18n="labelEngagement"></label>
                            <div class="adv-filter-grid">
                                <input type="number" id="adv-min-replies" data-i18n-placeholder="placeholderMinReplies" min="0">
                                <input type="number" id="adv-min-faves" data-i18n-placeholder="placeholderMinLikes" min="0">
                                <input type="number" id="adv-min-retweets" data-i18n-placeholder="placeholderMinRetweets" min="0">
                            </div>
                        </div>
                        <div class="adv-form-group">
                            <div class="adv-form-group-header">
                                <label data-i18n="labelDateRange"></label>
                                <select id="adv-date-shortcut" class="adv-select-mini" data-i18n-title="labelDateShortcut">
                                    <option value="" data-i18n="labelDateShortcut" selected disabled style="display:none">Quick...</option>
                                    <option value="1d" data-i18n="optDate1Day">Past 24h</option>
                                    <option value="1w" data-i18n="optDate1Week">Past week</option>
                                    <option value="1m" data-i18n="optDate1Month">Past month</option>
                                    <option value="3m" data-i18n="optDate3Months">Past 3 months</option>
                                    <option value="6m" data-i18n="optDate6Months">Past 6 months</option>
                                    <option value="1y" data-i18n="optDate1Year">Past year</option>
                                    <option value="2y" data-i18n="optDate2Years">Past 2 years</option>
                                    <option value="3y" data-i18n="optDate3Years">Past 3 years</option>
                                    <option value="5y" data-i18n="optDate5Years">Past 5 years</option>
                                    <option disabled>──────────</option>
                                    <option value="clear" data-i18n="optDateClear">Clear</option>
                                </select>
                            </div>
                            <div class="adv-form-group-date-container">
                                <input type="date" id="adv-since" data-i18n-title="tooltipSince">
                                <span class="adv-date-separator">~</span>
                                <input type="date" id="adv-until" data-i18n-title="tooltipUntil">
                            </div>
                        </div>
                        <hr class="adv-separator">
                        <div class="adv-form-group">
                            <div class="adv-account-label-group">
                                <label for="adv-from-user" data-i18n="labelFromUser"></label>
                                <div class="adv-exclude-toggle"><input type="checkbox" id="adv-from-user-exclude"><label for="adv-from-user-exclude" data-i18n="checkExclude"></label></div>
                            </div>
                            <input type="text" id="adv-from-user" data-i18n-placeholder="placeholderFromUser">
                        </div>
                        <div class="adv-form-group">
                            <div class="adv-account-label-group">
                                <label for="adv-to-user" data-i18n="labelToUser"></label>
                                <div class="adv-exclude-toggle"><input type="checkbox" id="adv-to-user-exclude"><label for="adv-to-user-exclude" data-i18n="checkExclude"></label></div>
                            </div>
                            <input type="text" id="adv-to-user" data-i18n-placeholder="placeholderToUser">
                        </div>
                        <div class="adv-form-group">
                            <div class="adv-account-label-group">
                                <label for="adv-mentioning" data-i18n="labelMentioning"></label>
                                <div class="adv-exclude-toggle"><input type="checkbox" id="adv-mentioning-exclude"><label for="adv-mentioning-exclude" data-i18n="checkExclude"></label></div>
                            </div>
                            <input type="text" id="adv-mentioning" data-i18n-placeholder="placeholderMentioning">
                        </div>
                    </form>
                    </div>
                </div>

                <div class="adv-tab-content" id="adv-tab-history">
                  <div class="adv-zoom-root">
                    <div class="adv-tab-toolbar">
                        <div class="adv-tab-toolbar-left">
                            <input id="adv-history-search" class="adv-input" type="text" data-i18n-placeholder="placeholderSearchHistory">
                            <select id="adv-history-sort" class="adv-select" data-i18n-title="labelSortBy" title="Sort by:">
                                <option value="newest" data-i18n="sortNewest"></option>
                                <option value="oldest" data-i18n="sortOldest"></option>
                                <option value="name_asc" data-i18n="sortNameAsc"></option>
                                <option value="name_desc" data-i18n="sortNameDesc"></option>
                            </select>
                        </div>
                        <div class="adv-tab-toolbar-right">
                            <button id="adv-history-clear-all" class="adv-chip danger"></button>
                        </div>
                    </div>
                    <div id="adv-history-empty" class="adv-item-sub"></div>
                    <div id="adv-history-list" class="adv-list"></div>
                  </div>
                </div>

                <div class="adv-tab-content" id="adv-tab-saved">
                  <div class="adv-zoom-root">
                    <div id="adv-saved-empty" class="adv-item-sub"></div>
                    <div id="adv-saved-list" class="adv-list"></div>
                  </div>
                </div>

                <div class="adv-tab-content" id="adv-tab-favorites">
                  <div class="adv-zoom-root">
                    <div id="adv-favorites-list" class="adv-list"></div>
                    <div id="adv-favorites-empty" class="adv-item-sub"></div>
                  </div>
                </div>

                <div class="adv-tab-content" id="adv-tab-lists">
                  <div class="adv-zoom-root">
                    <div id="adv-lists-empty" class="adv-item-sub"></div>
                    <div id="adv-lists-list" class="adv-list"></div>
                  </div>
                </div>

                <div class="adv-tab-content" id="adv-tab-accounts">
                  <div class="adv-zoom-root">
                    <div id="adv-accounts-empty" class="adv-item-sub"></div>
                    <div id="adv-accounts-list" class="adv-list"></div>
                  </div>
                </div>

                <!-- ▶ Mute タブ -->
                <div class="adv-tab-content" id="adv-tab-mute">
                  <div class="adv-zoom-root">
                    <div class="adv-form-group">
                      <!-- 追加する並び：まず“追加”UI -->
                      <div class="adv-mute-add">
                        <input type="text" id="adv-mute-input" data-i18n-placeholder="placeholderMuteWord">
                        <div style="display:flex; flex-direction:column; gap:2px; margin-left:4px; margin-right:4px;">
                            <label class="adv-toggle" title="">
                              <input type="checkbox" id="adv-mute-wb">
                              <span data-i18n="labelWordBoundary"></span>
                            </label>
                            <label class="adv-toggle" title="">
                              <input type="checkbox" id="adv-mute-cs">
                              <span data-i18n="labelCaseSensitive"></span>
                            </label>
                        </div>
                        <button id="adv-mute-add" class="adv-modal-button" data-i18n="buttonAdd"></button>
                      </div>

                      <hr class="adv-separator" style="margin-top:12px; margin-bottom:12px;">

                      <!-- ▼ 新しい見出しブロック（ミュート一覧 + すべて有効/無効） -->
                      <div class="adv-mute-header">
                        <input type="text" id="adv-mute-filter" data-i18n-placeholder="placeholderFilterMute">

                        <div class="adv-mute-header-controls">
                            <select id="adv-mute-mode" class="adv-select">
                                <option value="hidden" data-i18n="optMuteHidden">Hidden</option>
                                <option value="collapsed" data-i18n="optMuteCollapsed">Collapsed</option>
                            </select>
                            <label class="adv-toggle">
                              <input type="checkbox" id="adv-mute-enable-all" checked>
                              <span data-i18n="labelEnableAll"></span>
                            </label>
                        </div>
                      </div>

                      <div id="adv-mute-empty" class="adv-item-sub"></div>
                      <div id="adv-mute-list" class="adv-mute-list"></div>
                    </div>
                  </div>
                </div>

            </div>
            <div class="adv-modal-footer">
                <button id="adv-save-button" class="adv-modal-button" data-i18n="buttonSave"></button>
                <button id="adv-clear-button" class="adv-modal-button" data-i18n="buttonClear"></button>
                <button id="adv-apply-button" class="adv-modal-button primary" data-i18n="buttonApply"></button>
            </div>
        </div>

        <div id="adv-toast" class="adv-toast" role="status" aria-live="polite"></div>
            <div id="adv-settings-modal" class="adv-settings-modal">
            <div class="adv-settings-dialog">
                <div class="adv-settings-header">
                    <div style="display:flex; align-items:center; gap:15px;">
                        <h3 class="adv-settings-title" data-i18n="settingsTitle"></h3>
                        <button id="adv-settings-reset" type="button" class="adv-chip danger" data-i18n="buttonReset"></button>
                    </div>
                    <button id="adv-settings-close" type="button" class="adv-settings-close" data-i18n-title="tooltipClose">&times;</button>
                </div>
                <div class="adv-settings-body">
                  <div class="adv-settings-section-header" data-i18n="settingsTitleGeneral"></div>
                    <div class="adv-settings-group">
                        <label for="adv-settings-lang" data-i18n="labelUILang"></label>
                        <select id="adv-settings-lang">
                            <option value="" data-i18n="optUILangAuto"></option>
                            <option value="en">English</option>
                            <option value="ja">日本語</option>
                            <option value="fr">Français</option>
                            <option value="es">Español</option>
                            <option value="de">Deutsch</option>
                            <option value="pt-BR">Português (Brasil)</option>
                            <option value="ru">Русский</option>
                            <option value="ko">한국어</option>
                            <option value="zh-CN">简体中文</option>
                            <option value="zh-TW">繁體中文</option>
                        </select>
                    </div>

                      <div class="adv-settings-group">
                          <label for="adv-settings-initial-tab" data-i18n="labelInitialTab"></label>
                          <select id="adv-settings-initial-tab">
                              <option value="last" data-i18n="optInitialTabLast"></option>
                              <option value="search" data-i18n="tabSearch"></option>
                              <option value="history" data-i18n="tabHistory"></option>
                              <option value="saved" data-i18n="tabSaved"></option>
                              <option value="favorites" data-i18n="tabFavorites"></option>
                              <option value="mute" data-i18n="tabMute"></option>
                              <option value="lists" data-i18n="tabLists"></option>
                              <option value="accounts" data-i18n="tabAccounts"></option>
                          </select>
                      </div>

                      <div class="adv-settings-section-header" data-i18n="settingsTitleFeatures"></div>
                      <div class="adv-settings-group">
                        <div class="adv-settings-toggle-row">
                          <label class="adv-toggle" for="adv-settings-tab-toggle-search">
                              <span data-i18n="tabSearch"></span>
                          </label>
                          <label class="adv-switch">
                              <input id="adv-settings-tab-toggle-search" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                        </div>
                        <div class="adv-settings-toggle-row">
                          <label class="adv-toggle" for="adv-settings-tab-toggle-history">
                              <span data-i18n="tabHistory"></span>
                          </label>
                          <label class="adv-switch">
                              <input id="adv-settings-tab-toggle-history" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                        </div>
                        <div class="adv-settings-toggle-row">
                          <label class="adv-toggle" for="adv-settings-tab-toggle-saved">
                              <span data-i18n="tabSaved"></span>
                          </label>
                          <label class="adv-switch">
                              <input id="adv-settings-tab-toggle-saved" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                        </div>
                        <div class="adv-settings-toggle-row">
                          <label class="adv-toggle" for="adv-settings-tab-toggle-favorites">
                              <span data-i18n="tabFavorites"></span>
                          </label>
                          <label class="adv-switch">
                              <input id="adv-settings-tab-toggle-favorites" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                        </div>
                        <div class="adv-settings-toggle-row">
                          <label class="adv-toggle" for="adv-settings-tab-toggle-mute">
                              <span data-i18n="tabMute"></span>
                          </label>
                          <label class="adv-switch">
                              <input id="adv-settings-tab-toggle-mute" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                        </div>
                        <div class="adv-settings-toggle-row">
                          <label class="adv-toggle" for="adv-settings-tab-toggle-lists">
                              <span data-i18n="tabLists"></span>
                          </label>
                          <label class="adv-switch">
                              <input id="adv-settings-tab-toggle-lists" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                        </div>
                        <div class="adv-settings-toggle-row">
                          <label class="adv-toggle" for="adv-settings-tab-toggle-accounts">
                              <span data-i18n="tabAccounts"></span>
                          </label>
                          <label class="adv-switch">
                              <input id="adv-settings-tab-toggle-accounts" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                        </div>
                      </div>
                      <div class="adv-settings-section-header" data-i18n="settingsTitleData"></div>
                      <div class="adv-settings-group">
                          <div class="adv-settings-actions-inline">
                              <button id="adv-settings-export" type="button" class="adv-modal-button" data-i18n="buttonExport"></button>
                              <button id="adv-settings-import" type="button" class="adv-modal-button primary" data-i18n="buttonImport"></button>
                              <input id="adv-settings-file-input" type="file" accept="application/json" style="display:none">
                          </div>
                      </div>

                      <div class="adv-settings-section-header" style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; border-bottom:none; padding-bottom:0;">
                          <div style="display:flex; align-items:center; gap:6px;">
                              <span data-i18n="settingsTitleSync">Cloud Sync</span>
                              <span class="adv-chip primary" style="font-size:10px; padding:2px 6px; height:auto; cursor:default;" data-i18n="chipBeta">Beta</span>
                          </div>
                          <label class="adv-switch" title="" data-i18n-title="settingsTitleSync">
                              <input id="adv-settings-sync-enable" type="checkbox">
                              <span class="adv-slider"></span>
                          </label>
                      </div>

                      <div id="adv-sync-settings-container" style="display:none; margin-top:7px; margin-bottom:4px; padding:16px; background:rgba(128,128,128,0.05); border-radius:12px; border:1px solid var(--modal-border);">

                          <div class="adv-settings-group" style="margin-bottom:16px;">
                              <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:6px;">
                                  <label style="font-size:13px; margin-bottom:0; color:var(--modal-text-primary);" data-i18n="labelSyncEndpoint">Endpoint URL</label>
                                  <a href="https://github.com/koyasi777/advanced-search-for-x-twitter/blob/main/worker/README.md" data-i18n-href="urlSyncHelp" target="_blank" rel="noopener noreferrer"
                                     style="font-size:11px; color:var(--modal-primary-color); text-decoration:none; display:flex; align-items:center; gap:3px; opacity:0.9; transition:opacity 0.2s;"
                                     onmouseover="this.style.opacity='1';this.style.textDecoration='underline'"
                                     onmouseout="this.style.opacity='0.9';this.style.textDecoration='none'">
                                      <svg viewBox="0 0 24 24" aria-hidden="true" style="width:13px; height:13px; fill:currentColor;">
                                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                                      </svg>
                                      <span data-i18n="linkSyncSetup">Setup Guide</span>
                                  </a>
                              </div>
                              <input type="url" id="adv-sync-endpoint" data-i18n-placeholder="placeholderSyncEndpoint" placeholder="https://your-worker.workers.dev"
                                     style="width:100%; box-sizing:border-box; font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:13px; padding:10px 12px; border-radius:6px;">
                          </div>

                          <div class="adv-settings-group" style="margin-bottom:16px;">
                              <label style="font-size:13px; margin-bottom:6px; color:var(--modal-text-primary);" data-i18n="labelSyncId">Sync ID (UUID)</label>
                              <div style="display:flex; gap:8px;">
                                  <input type="text" id="adv-sync-id" data-i18n-placeholder="placeholderSyncId" placeholder="Paste or Generate UUID"
                                      style="flex:1; min-width:0; box-sizing:border-box; font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:13px; padding:10px 12px; border-radius:6px; letter-spacing:0.5px;">
                                  <button id="adv-sync-gen-id-btn" type="button" class="adv-modal-button" data-i18n="buttonGenerate"
                                      style="white-space:nowrap; padding:0 16px; border-radius:6px; font-size:13px;">Generate</button>
                              </div>
                          </div>

                          <div class="adv-settings-group">
                              <label style="font-size:13px; margin-bottom:6px; color:var(--modal-text-primary);" data-i18n="labelSyncPassword">Encryption Password</label>
                              <div style="position:relative; display:flex; align-items:center;">
                                  <input type="password" id="adv-sync-secret" data-i18n-placeholder="placeholderSyncPassword" placeholder="Strong password required"
                                      style="width:100%; box-sizing:border-box; font-family:ui-monospace,SFMono-Regular,Consolas,monospace; font-size:13px; padding:10px 40px 10px 12px; border-radius:6px; letter-spacing:1px;">

                                  <button type="button" id="adv-sync-secret-toggle" class="adv-modal-button"
                                      style="position:absolute; right:6px; top:50%; transform:translateY(-50%); border:none; background:transparent; padding:4px; height:auto; color:var(--modal-text-secondary); cursor:pointer; display:flex; align-items:center; justify-content:center;"
                                      data-i18n-title="tooltipShowHidePassword" title="Show/Hide Password">
                                      <svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:currentColor;">
                                          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path>
                                      </svg>
                                  </button>
                              </div>

                              <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-top:6px;">
                                <div style="font-size:11px; color:var(--modal-text-secondary); line-height:1.4; max-width:70%;" data-i18n="noteSyncEncryption">
                                    * Data is encrypted locally before upload. The server never sees this password.
                                </div>
                                <button id="adv-sync-change-pass-btn" type="button" class="adv-chip" style="font-size:11px; padding:2px 8px;" data-i18n="labelSyncChangePass">Change</button>
                              </div>
                          </div>

                          <div style="margin-top:20px; padding-top:16px; border-top:1px solid var(--modal-border);">
                              <div style="display:flex; justify-content:space-between; align-items:center;">
                                  <div id="adv-sync-status" style="font-size:12px; color:var(--modal-text-secondary); font-weight:700; display:flex; align-items:center; gap:6px;">
                                      <span id="adv-sync-status-dot" style="width:10px; height:10px; background:var(--modal-text-secondary); border-radius:50%; display:inline-block; opacity:0.5; transition: background-color 0.3s;"></span>
                                      <span data-i18n="labelSyncStatus">Status: </span><span id="adv-sync-status-text" data-i18n="syncStatusIdle">Idle</span>
                                      <svg id="adv-sync-spinner" viewBox="0 0 24 24" style="width:14px; height:14px; fill:var(--modal-primary-color); display:none; animation: adv-spin 1s linear infinite;">
                                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-4.41 3.59-8 8-8 4.41 0 8 3.59 8 8 0 4.41-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" style="opacity:0.3"></path>
                                          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"></path>
                                      </svg>
                                  </div>
                                  <button id="adv-sync-now-btn" type="button" class="adv-modal-button primary" style="padding:8px 20px; border-radius:9999px; min-width:100px;" data-i18n="buttonSyncNow">Sync Now</button>
                              </div>
                              <div id="adv-sync-error-log" style="display:none; margin-top:10px; padding:10px; background:rgba(244, 33, 46, 0.1); color:#f4212e; font-size:11px; border-radius:6px; white-space:pre-wrap; word-break:break-all; font-family:monospace;"></div>
                          </div>
                      </div>

                    </div>
                    <div class="adv-settings-footer">
                        <button id="adv-settings-close-footer" type="button" class="adv-modal-button" data-i18n="buttonClose"></button>
                    </div>
            </div>
        </div>
    `;

    const initialize = async () => {
        i18n.init();

        // 排他制御用ロック (Data Loss Prevention)
        let _ioLock = Promise.resolve();
        const withIoLock = async (fn) => {
            const prev = _ioLock;
            let nextResolve;
            _ioLock = new Promise(r => nextResolve = r);
            try {
                await prev;
                return await fn();
            } finally {
                nextResolve();
            }
        };

        let syncManager = null;

        const kv = {
            get(key, def) { try { return GM_getValue(key, def); } catch (_) { return def; } },
            set(key, val) { try { GM_setValue(key, val); } catch (_) {} },
            del(key)      { try { GM_deleteValue(key); } catch (_) {} },
        };

        // ▼▼▼ メモリキャッシュを追加し、即時反映させる ▼▼▼
        const _memCache = {};

        // 削除ログ管理
        const DELETED_LOG_KEY = 'advDeletedLog_v1';
        // 削除済みIDとそのタイムスタンプを管理 { [id]: timestamp }
        const loadDeletedLog = () => loadJSON(DELETED_LOG_KEY, {});
        const markAsDeleted = (id) => {
            if (!id) return;
            const log = loadDeletedLog();
            log[id] = Date.now();
            // 古いログの掃除（例として90日以上前の削除記録は消すなどしても良いが、今回は単純保持）
            saveJSON(DELETED_LOG_KEY, log);
        };

        const unmarkAsDeleted = (id) => {
            if (!id) return;
            const log = loadDeletedLog();
            if (log[id]) {
                delete log[id];
                saveJSON(DELETED_LOG_KEY, log);
            }
        };

        // インポート中かどうかを判定するフラグ
        let __IS_IMPORTING__ = false;

        const loadJSON = (key, def) => {
            // 1. キャッシュにあれば、そのコピーを返す（即時反映）
            if (Object.prototype.hasOwnProperty.call(_memCache, key)) {
                try { return JSON.parse(JSON.stringify(_memCache[key])); } catch(_) {}
            }
            // 2. なければストレージから読む
            try {
                const raw = kv.get(key, undefined);
                if (raw === undefined) return def;
                const val = JSON.parse(raw);
                _memCache[key] = val; // キャッシュにも保存
                return val;
            } catch(_) { return def; }
        };

        // Debounce helper for sync
        let _syncTimeout;
        const triggerAutoSync = () => {
            if (syncManager) {
                clearTimeout(_syncTimeout);
                _syncTimeout = setTimeout(() => syncManager.executeSync(), 3000); // 3秒後に同期
            }
        };

        const saveJSON = (key, value) => {
            // 1. 即座にメモリキャッシュを更新
            _memCache[key] = value;

            // 2. インポート中はストレージ書き込みのみで終了
            if (__IS_IMPORTING__) {
                try { kv.set(key, JSON.stringify(value)); } catch(_) {}
                return;
            }

            withIoLock(async () => {
                try { kv.set(key, JSON.stringify(value)); } catch(_) {}
                try { kv.set(DIRTY_KEY, '1'); } catch(_) {}

                // SyncManagerに変更を通知（これで実行中の同期があっても再スケジュールされる）
                if (syncManager) {
                    syncManager.notifyChange();
                }

                triggerAutoSync();
            });
        };

        const DEFAULT_TABS = ['search', 'history', 'saved', 'favorites', 'mute', 'lists', 'accounts'];
        const DEFAULT_TABS_VISIBILITY = {
            search: true,
            history: true,
            saved: true,
            favorites: true,
            mute: true,
            lists: true,
            accounts: true,
        };
        const loadTabsVisibility = () => {
            const stored = loadJSON(TABS_VISIBILITY_KEY, DEFAULT_TABS_VISIBILITY);
            const normalized = { ...DEFAULT_TABS_VISIBILITY };
            for (const key of DEFAULT_TABS) {
                normalized[key] = stored[key] === false ? false : true; // false のみ明示的に引き継ぐ
            }
            return normalized;
        };
        const saveTabsVisibility = (state) => {
            saveJSON(TABS_VISIBILITY_KEY, state);
        };

        /* --- Favorite Tags: Code Block --- */

        // ------------- 定数 & 状態 ------------- //
        const FT_STATE_KEY = 'ftTagState_v1';
        const FT_FILTER_ALL = 'all';
        const FT_FILTER_UNCATEGORIZED = 'uncategorized';
        const FT_TWEET_ID_REGEX = /\/status\/(\d+)/;

        let ft_state = null;
        let ft_initialized = false;
        let ft_currentFilter = FT_FILTER_ALL;
        let ft_currentDropdown = null;
        let ft_settingsModalBackdrop = null;
        let ft_dragSrcEntry = null;

        // ------------- State 管理 ------------- //

        function ft_createDefaultState() {
            return {
                enabled: true,
                tags: [],
                tweetTags: {},
                uncategorized: { color: '#8899A6', order: 0 },
                display: { mode: 'leaf' },
            };
        }

        function ft_normalizeTagOrdersFor(stateObj) {
            if (!stateObj || !Array.isArray(stateObj.tags)) return;
            const groups = new Map();
            for (const tag of stateObj.tags) {
                if (!tag || typeof tag !== 'object') continue;
                const pid = tag.parentId || null;
                if (!groups.has(pid)) groups.set(pid, []);
                groups.get(pid).push(tag);
            }
            for (const arr of groups.values()) {
                arr.sort((a, b) => (typeof a.order === 'number' ? a.order : 0) - (typeof b.order === 'number' ? b.order : 0));
                arr.forEach((tag, i) => { tag.order = i; });
            }
        }

        function ft_countRootTagsFor(stateObj) {
            if (!stateObj || !Array.isArray(stateObj.tags)) return 0;
            return stateObj.tags.filter((t) => !t.parentId).length;
        }

        function ft_clampUncategorizedOrderFor(stateObj) {
            if (!stateObj) return;
            if (!stateObj.uncategorized || typeof stateObj.uncategorized !== 'object') {
                stateObj.uncategorized = { color: '#8899A6', order: 0 };
            }
            const rootCount = ft_countRootTagsFor(stateObj);
            let pos = typeof stateObj.uncategorized.order === 'number' ? stateObj.uncategorized.order : 0;
            if (pos < 0) pos = 0;
            if (pos > rootCount) pos = rootCount;
            stateObj.uncategorized.order = pos;
        }

        function ft_normalizeTagOrders() { if (ft_state) ft_normalizeTagOrdersFor(ft_state); }
        function ft_clampUncategorizedOrder() { if (ft_state) ft_clampUncategorizedOrderFor(ft_state); }

        function ft_loadState() {
            try {
                const parsed = loadJSON(FT_STATE_KEY, null);
                if (!parsed || typeof parsed !== 'object') return ft_createDefaultState();

                if (!Array.isArray(parsed.tags)) parsed.tags = [];
                if (!parsed.tweetTags || typeof parsed.tweetTags !== 'object') parsed.tweetTags = {};
                parsed.enabled = true;

                if (!parsed.uncategorized || typeof parsed.uncategorized !== 'object') {
                    parsed.uncategorized = { color: '#8899A6', order: 0 };
                } else {
                    if (!parsed.uncategorized.color) parsed.uncategorized.color = '#8899A6';
                    if (typeof parsed.uncategorized.order !== 'number') parsed.uncategorized.order = 0;
                }

                if (!parsed.display || typeof parsed.display !== 'object') {
                    parsed.display = { mode: 'leaf' };
                } else if (parsed.display.mode !== 'leaf' && parsed.display.mode !== 'full') {
                    parsed.display.mode = 'leaf';
                }

                ft_normalizeTagOrdersFor(parsed);
                ft_clampUncategorizedOrderFor(parsed);
                return parsed;
            } catch (e) {
                return ft_createDefaultState();
            }
        }

        function ft_saveState(newState) {
            if (newState) ft_state = newState;
            try {
                if (ft_state) {
                    ft_normalizeTagOrdersFor(ft_state);
                    ft_clampUncategorizedOrderFor(ft_state);
                    saveJSON(FT_STATE_KEY, ft_state);
                }
            } catch (e) {}
            requestAnimationFrame(() => {
                ft_refreshAllTagChips();

                // お気に入りタブが開いていれば再描画してタグ変更/絞り込みを反映
                if (getActiveTabName() === 'favorites') {
                    renderFavorites();
                }
            });
        }

        function ft_generateTagId() {
            return 'tag_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
        }

        function ft_getTagById(tagId) {
            return ft_state.tags.find((t) => t.id === tagId) || null;
        }

        function ft_getAllTags() {
            return ft_state.tags.slice();
        }

        function ft_getTagColor(tagId) {
            const tag = ft_getTagById(tagId);
            return tag ? tag.color || '#1d9bf0' : '#8899A6';
        }

        function ft_getUncategorizedColor() {
            return ft_state?.uncategorized?.color || '#8899A6';
        }

        function ft_createNewTag(name, color, parentId) {
            const pid = parentId || null;
            const siblingsCount = ft_state.tags.filter((t) => (t.parentId || null) === pid).length;
            const tag = {
                id: ft_generateTagId(),
                name,
                color,
                parentId: pid,
                order: siblingsCount,
            };
            ft_state.tags.push(tag);
            return tag;
        }

        function ft_countRootTags() {
            return ft_countRootTagsFor(ft_state);
        }

        function ft_getTagAncestors(tag) {
            const result = [];
            if (!tag) return result;
            const seen = new Set();
            let current = tag;
            while (current) {
                if (seen.has(current.id)) break;
                seen.add(current.id);
                result.unshift(current);
                if (!current.parentId) break;
                current = ft_getTagById(current.parentId);
            }
            return result;
        }

        function ft_getTagFullPath(tag) {
            const ancestors = ft_getTagAncestors(tag);
            if (!ancestors.length) return tag ? tag.name || '' : '';
            return ancestors.map((t) => t.name || '').join(' / ');
        }

        function ft_getTagDisplayLabelFromTag(tag) {
            if (!tag) return '';
            const mode = ft_state?.display?.mode;
            if (mode === 'full') return ft_getTagFullPath(tag);
            return tag.name;
        }

        function ft_getTagListWithUncategorized() {
            const result = [];
            if (!ft_state || !Array.isArray(ft_state.tags)) return result;

            const byParent = new Map();
            for (const tag of ft_state.tags) {
                if (!tag || typeof tag !== 'object') continue;
                const pid = tag.parentId || null;
                if (!byParent.has(pid)) byParent.set(pid, []);
                byParent.get(pid).push(tag);
            }

            for (const arr of byParent.values()) {
                arr.sort((a, b) => (typeof a.order === 'number' ? a.order : 0) - (typeof b.order === 'number' ? b.order : 0));
            }

            function dfs(parentId, depth) {
                const arr = byParent.get(parentId || null);
                if (!arr) return;
                for (const tag of arr) {
                    result.push({ tag, depth });
                    dfs(tag.id, depth + 1);
                }
            }
            dfs(null, 0);

            const entries = [];
            const rootCount = result.filter((e) => e.depth === 0).length;
            let uncatPos = ft_state.uncategorized.order || 0;
            if (uncatPos < 0) uncatPos = 0;
            if (uncatPos > rootCount) uncatPos = rootCount;

            let rootIndex = 0;
            for (const item of result) {
                if (item.depth === 0 && rootIndex === uncatPos) {
                    entries.push({ kind: 'uncat', depth: 0 });
                }
                entries.push({ kind: 'tag', tag: item.tag, depth: item.depth });
                if (item.depth === 0) rootIndex++;
            }
            if (rootCount === 0 || uncatPos === rootCount) {
                entries.push({ kind: 'uncat', depth: 0 });
            }
            return entries;
        }

        function ft_isTagInSubtree(tagId, rootTagId) {
            // ft_state が存在しない場合は即座に false を返す
            if (!ft_state || !tagId || !rootTagId) return false;

            if (tagId === rootTagId) return true;
            let current = ft_getTagById(tagId);
            const visited = new Set();
            while (current && current.parentId) {
                if (visited.has(current.id)) break;
                visited.add(current.id);
                if (current.parentId === rootTagId) return true;
                current = ft_getTagById(current.parentId);
            }
            return false;
        }

        function ft_wouldCreateCycle(newParentId, childId) {
            if (!newParentId || !childId) return false;
            if (newParentId === childId) return true;
            let current = ft_getTagById(newParentId);
            const visited = new Set();
            while (current && current.parentId) {
                if (visited.has(current.id)) break;
                visited.add(current.id);
                if (current.parentId === childId) return true;
                current = ft_getTagById(current.parentId);
            }
            return false;
        }

        // ------------- ルート & ユーティリティ ------------- //

        // ツイートのDOMからIDを抽出
        function ft_extractTweetId(article) {
            if (article.dataset.ftTweetId) return article.dataset.ftTweetId;

            // 引用ツイート（カード部分）の中にあるリンクを除外するための判定関数
            // div[role="link"] は引用カードのコンテナに付与される属性です
            const isInsideQuote = (el) => {
                return !!el.closest('div[role="link"]');
            };

            // 1. 最も確実な方法: <time>タグの親アンカーを探す
            const timeEls = Array.from(article.querySelectorAll('time'));
            for (const timeEl of timeEls) {
                const timeAnchor = timeEl.closest('a');
                if (timeAnchor) {
                    // ★追加: 引用カードの中にある時刻リンクならスキップする
                    if (isInsideQuote(timeAnchor)) continue;

                    const href = timeAnchor.getAttribute('href');
                    const m = href.match(/\/status\/(\d+)/);
                    if (m) return m[1];
                }
            }

            // 2. フォールバック: 従来の検索方法
            try {
                const anchors = Array.from(article.querySelectorAll('a[href*="/status/"]'));
                for (const a of anchors) {
                    if (a.dataset.testid === 'tweet-text-show-more-link') continue;

                    // 引用カードの中にあるリンクならスキップする
                    if (isInsideQuote(a)) continue;

                    const href = a.getAttribute('href') || '';
                    const m = href.match(/\/status\/(\d+)/);
                    if (m) return m[1];
                }
            } catch (e) {}

            return null;
        }

        // タグチップの挿入場所（ヘッダーメタ情報行）を特定する関数
        function ft_findHeaderMetaContainer(article) {
            // 1. 記事内のメインとなる time 要素を探す（引用ツイート内の time は除外）
            const allTimes = Array.from(article.querySelectorAll('time'));
            const mainTime = allTimes.find(t => !t.closest('div[role="link"]'));

            // 2. 記事内の User-Name 要素を探す
            const userName = article.querySelector('[data-testid="User-Name"]');

            // --- パターンA: タイムライン表示 ---
            // 「User-Name」と「Time」が同じ行コンテナに同居している場合、そこがヘッダー行。
            if (userName && mainTime) {
                let p = userName.parentElement;
                while (p && p !== article) {
                    // flex-row (r-18u37iz) であり、かつ mainTime を含んでいるか確認
                    if (p.classList.contains('r-18u37iz') && p.contains(mainTime)) {
                        return p;
                    }
                    p = p.parentElement;
                }
            }

            // --- パターンB: 詳細ページ (単独表示) ---
            // User-Name と Time が離れている場合、詳細ページとみなして「Time」がある行を探す。
            // (ここに「〇〇件の表示」も含まれています)
            if (mainTime) {
                let p = mainTime.parentElement;
                while (p && p !== article) {
                    // r-18u37iz (flex-row) であり、かつ子要素が複数ある（日付 + 中黒 + Views など）
                    if (p.classList.contains('r-18u37iz') && p.childElementCount > 1) {
                        return p;
                    }
                    p = p.parentElement;
                }
            }

            // --- パターンC: フォールバック ---
            // 上記で見つからない場合（Timeがないプロモーションなど）、User-Name の横に @handle がある行を探す
            if (userName) {
                let p = userName.parentElement;
                while (p && p !== article) {
                    const hasHandleSibling = Array.from(p.children).some(sib => {
                        if (sib.contains(userName)) return false;
                        return sib.innerText && sib.innerText.trim().startsWith('@');
                    });
                    if (hasHandleSibling) return p;
                    p = p.parentElement;
                }
            }

            return null;
        }

        // ------------- タグチップ描画（イベント委譲対応） ------------- //

        function ft_buildTagChip(tweetId) {
            const currentTagId = ft_state.tweetTags[tweetId];
            const isUncategorized = !currentTagId;
            const tag = currentTagId ? ft_getTagById(currentTagId) : null;
            const label = isUncategorized
                ? i18n.t('FT_UNCATEGORIZED')
                : ft_getTagDisplayLabelFromTag(tag) || i18n.t('FT_UNCATEGORIZED');
            const color = isUncategorized ? ft_getUncategorizedColor() : ft_getTagColor(currentTagId);

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'ft-tag-chip' + (isUncategorized ? ' ft-tag-chip-uncategorized' : '');
            btn.style.color = color;
            btn.style.borderColor = color;
            btn.dataset.tweetId = tweetId;

            const span = document.createElement('span');
            span.className = 'ft-tag-chip-label';
            span.textContent = label;
            span.style.pointerEvents = 'none'; // クリックをボタンに透過

            btn.appendChild(span);
            return btn;
        }

        function ft_attachTagChipToArticle(article, tweetId) {
            if (!ft_state.enabled) return;
            const headerRow = ft_findHeaderMetaContainer(article);
            if (!headerRow) return;

            // 既存のタグがあれば取得、なければ新規作成
            let existing = headerRow.querySelector('.ft-tag-chip');
            const chip = ft_buildTagChip(tweetId);

            // 念のため CSS order も最大にしておく
            chip.style.order = "9999999";

            if (existing) {
                existing.replaceWith(chip);
            } else {
                headerRow.appendChild(chip);
            }

            article.classList.add('ft-chip-attached');

            // 監視ロジック
            // この行(headerRow)に他の拡張機能が要素を追加してきたら、タグを再び最後尾へ移動させる
            if (!headerRow.dataset.ftObserverAttached) {
                headerRow.dataset.ftObserverAttached = '1';

                const observer = new MutationObserver((mutations) => {
                    // タグチップを取得（クロージャ内の chip 変数だと古い可能性があるためDOMから取る）
                    const currentChip = headerRow.querySelector('.ft-tag-chip');

                    // タグが存在し、かつ「最後の要素」ではなくなっている場合
                    if (currentChip && headerRow.lastElementChild !== currentChip) {
                        // 自分自身(タグ)を再追加することで、DOM順序の一番後ろへ移動する
                        headerRow.appendChild(currentChip);
                    }
                });

                // 子要素の追加・削除を監視する
                observer.observe(headerRow, { childList: true });
            }
        }

        function ft_removeTagChipFromArticle(article) {
            const chip = article.querySelector('.ft-tag-chip');
            if (chip) chip.remove();
            article.classList.remove('ft-chip-attached');
        }

        function ft_refreshAllTagChips() {
            const articles = document.querySelectorAll('article[data-testid="tweet"]');
            for (const article of articles) {
                ft_processTweetArticle(article);
            }
        }

        // ------------- タグ / フィルタ用ドロップダウン ------------- //

        function ft_closeTagDropdown() {
            if (ft_currentDropdown) {
                ft_currentDropdown.remove();
                ft_currentDropdown = null;
            }
        }

        // タグごとの件数を集計するヘルパー
        function ft_countTagUsage() {
            const counts = { uncat: 0, total: 0 };
            // 全タグの初期値を0にする
            if (ft_state && ft_state.tags) {
                ft_state.tags.forEach(t => counts[t.id] = 0);
            }

            // 現在のお気に入りリストをロードして集計
            const favs = loadFavorites();
            counts.total = favs.length;

            favs.forEach(item => {
                const tagId = ft_state.tweetTags[item.id];
                if (tagId && counts[tagId] !== undefined) {
                    counts[tagId]++;
                } else {
                    counts.uncat++;
                }
            });
            return counts;
        }

        function ft_buildTagDropdownContent(tweetId) {
            const wrapper = document.createElement('div');
            wrapper.className = 'ft-tag-dropdown';
            wrapper.dataset.tweetId = tweetId;

            const header = document.createElement('div');
            header.className = 'ft-tag-dropdown-header';
            const headerLeft = document.createElement('div');
            headerLeft.style.display = 'flex'; headerLeft.style.alignItems = 'center'; headerLeft.style.gap = '4px';
            const title = document.createElement('div');
            title.textContent = i18n.t('FT_DROPDOWN_TITLE');
            const settingsBtn = document.createElement('button');
            settingsBtn.type = 'button'; settingsBtn.className = 'ft-settings-button'; settingsBtn.textContent = '⚙';
            settingsBtn.title = i18n.t('FT_SETTINGS_BUTTON_TITLE');
            settingsBtn.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault(); ft_closeTagDropdown(); ft_openSettingsModal(); });
            headerLeft.appendChild(title); headerLeft.appendChild(settingsBtn);
            const closeBtn = document.createElement('button');
            closeBtn.className = 'ft-tag-dropdown-close'; closeBtn.type = 'button'; closeBtn.textContent = '×';
            closeBtn.addEventListener('click', () => ft_closeTagDropdown());
            header.appendChild(headerLeft); header.appendChild(closeBtn);

            const tagList = document.createElement('div');
            tagList.className = 'ft-tag-dropdown-tags';
            const currentTagId = ft_state.tweetTags[tweetId] || null;
            const entries = ft_getTagListWithUncategorized();

            const counts = ft_countTagUsage();

            for (const entry of entries) {
                const item = document.createElement('div');
                const colorDot = document.createElement('div');
                const label = document.createElement('div');
                label.className = 'ft-tag-dropdown-tag-label';

                if (entry.kind === 'uncat') {
                    item.className = 'ft-tag-dropdown-tag-item' + (currentTagId ? '' : ' ft-tag-dropdown-tag-selected');
                    colorDot.className = 'ft-tag-dropdown-tag-color';
                    colorDot.style.backgroundColor = ft_getUncategorizedColor();
                    label.textContent = i18n.t('FT_UNCATEGORIZED') + ` (${counts.uncat})`;
                    item.addEventListener('click', () => { delete ft_state.tweetTags[tweetId]; ft_saveState(); ft_closeTagDropdown(); });
                } else {
                    const tag = entry.tag;
                    item.className = 'ft-tag-dropdown-tag-item' + (tag.id === currentTagId ? ' ft-tag-dropdown-tag-selected' : '');
                    colorDot.className = 'ft-tag-dropdown-tag-color';
                    colorDot.style.backgroundColor = tag.color || '#1d9bf0';
                    if (entry.depth > 0) colorDot.style.marginLeft = `${entry.depth * 12}px`;
                    const c = counts[entry.tag.id] || 0;
                    label.textContent = (entry.tag.name || '') + ` (${c})`;
                    item.addEventListener('click', () => { ft_state.tweetTags[tweetId] = tag.id; ft_saveState(); ft_closeTagDropdown(); });
                }
                item.appendChild(colorDot); item.appendChild(label);
                tagList.appendChild(item);
            }

            const newSection = document.createElement('div');
            newSection.className = 'ft-tag-dropdown-new';
            const newLabel = document.createElement('div');
            newLabel.textContent = i18n.t('FT_DROPDOWN_NEW_TAG');
            const newRow = document.createElement('div');
            newRow.className = 'ft-tag-dropdown-new-row';
            const newInput = document.createElement('input');
            newInput.type = 'text'; newInput.placeholder = i18n.t('FT_DROPDOWN_NEW_TAG_PLACEHOLDER'); newInput.className = 'ft-tag-dropdown-new-input';
            const newColor = document.createElement('input');
            newColor.type = 'color'; newColor.value = '#1d9bf0'; newColor.className = 'ft-tag-dropdown-new-color';
            const addBtn = document.createElement('button');
            addBtn.type = 'button'; addBtn.className = 'ft-tag-dropdown-new-button'; addBtn.textContent = i18n.t('FT_DROPDOWN_NEW_TAG_ADD');

            function doAddTag() {
                const name = newInput.value.trim();
                if (!name) return;
                const tag = ft_createNewTag(name, newColor.value || '#1d9bf0', null);
                ft_state.tweetTags[tweetId] = tag.id;
                ft_saveState();
                ft_closeTagDropdown();
            }
            addBtn.addEventListener('click', doAddTag);
            newInput.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); doAddTag(); } });

            newRow.appendChild(newColor); newRow.appendChild(newInput); newRow.appendChild(addBtn);
            newSection.appendChild(newLabel); newSection.appendChild(newRow);
            wrapper.appendChild(header); wrapper.appendChild(tagList); wrapper.appendChild(newSection);
            return wrapper;
        }

        function ft_openTagDropdown(chipEl, tweetId) {
            ft_closeTagDropdown();
            const dropdown = ft_buildTagDropdownContent(tweetId);
            ft_currentDropdown = dropdown;
            document.body.appendChild(dropdown);
            const rect = chipEl.getBoundingClientRect();
            const margin = 8;
            const width = dropdown.offsetWidth || 240;
            const height = dropdown.offsetHeight || 200;
            let left = rect.left;
            if (left + width + margin > window.innerWidth) left = window.innerWidth - width - margin;
            if (left < margin) left = margin;
            let top = rect.bottom + 4;
            if (top + height + margin > window.innerHeight) top = rect.top - height - 4;
            if (top < margin) top = margin;
            dropdown.style.left = `${left}px`; dropdown.style.top = `${top}px`;
        }

        // ---- ブックマークフィルタ用ドロップダウン ---- //
        function ft_buildFilterDropdownContent(targetValue, onSelectCallback) {
            const currentValue = targetValue;

            const wrapper = document.createElement('div');
            wrapper.className = 'ft-tag-dropdown ft-filter-dropdown';
            const header = document.createElement('div'); header.className = 'ft-tag-dropdown-header';
            const headerLeft = document.createElement('div'); headerLeft.style.display = 'flex'; headerLeft.style.alignItems = 'center'; headerLeft.style.gap = '4px';
            const title = document.createElement('div'); title.textContent = i18n.t('FT_DROPDOWN_TITLE');
            const settingsBtn = document.createElement('button'); settingsBtn.type = 'button'; settingsBtn.className = 'ft-settings-button'; settingsBtn.textContent = '⚙'; settingsBtn.title = i18n.t('FT_SETTINGS_BUTTON_TITLE');
            settingsBtn.addEventListener('click', (ev) => { ev.stopPropagation(); ev.preventDefault(); ft_closeTagDropdown(); ft_openSettingsModal(); });
            headerLeft.appendChild(title); headerLeft.appendChild(settingsBtn);
            const closeBtn = document.createElement('button'); closeBtn.className = 'ft-tag-dropdown-close'; closeBtn.type = 'button'; closeBtn.textContent = '×';
            closeBtn.addEventListener('click', () => ft_closeTagDropdown());
            header.appendChild(headerLeft); header.appendChild(closeBtn);

            const tagList = document.createElement('div'); tagList.className = 'ft-tag-dropdown-tags';
            function addItem(value, label, color, depth) {
                const item = document.createElement('div');
                item.className = 'ft-tag-dropdown-tag-item' + (value === currentValue ? ' ft-tag-dropdown-tag-selected' : '');
                const colorDot = document.createElement('div');
                colorDot.className = 'ft-tag-dropdown-tag-color'; colorDot.style.backgroundColor = color || 'rgba(239,243,244,0.6)';
                if (depth > 0) colorDot.style.marginLeft = `${depth * 12}px`;
                const text = document.createElement('div');
                text.className = 'ft-tag-dropdown-tag-label'; text.textContent = label;
                item.appendChild(colorDot); item.appendChild(text);
                item.addEventListener('click', () => {
                    if (typeof onSelectCallback === 'function') {
                        onSelectCallback(value);
                    }
                    ft_closeTagDropdown();
                });
                tagList.appendChild(item);
            }
            const counts = ft_countTagUsage();
            addItem(FT_FILTER_ALL, i18n.t('FT_FILTER_ALL') + ` (${counts.total})`, 'rgba(239,243,244,0.7)', 0);

            const entries = ft_getTagListWithUncategorized();
            for (const entry of entries) {
                if (entry.kind === 'uncat') {
                    addItem(FT_FILTER_UNCATEGORIZED, i18n.t('FT_UNCATEGORIZED') + ` (${counts.uncat})`, ft_getUncategorizedColor(), 0);
                } else {
                    // フィルタ時は「そのタグ + 子孫タグ」の合計件数を計算して表示する
                    // (絞り込み機能がサブツリー検索であるため、件数も合わせるのが自然)
                    let subTreeCount = 0;
                    if (ft_state && ft_state.tags) {
                        ft_state.tags.forEach(t => {
                            if (ft_isTagInSubtree(t.id, entry.tag.id)) {
                                subTreeCount += (counts[t.id] || 0);
                            }
                        });
                    }
                    // 合計件数を表示
                    addItem(entry.tag.id, (entry.tag.name || '') + ` (${subTreeCount})`, entry.tag.color, entry.depth);
                }
            }
            wrapper.appendChild(header); wrapper.appendChild(tagList);
            return wrapper;
        }

        function ft_openFilterDropdown(buttonEl, targetValue, onSelectCallback) {
            ft_closeTagDropdown();
            const dropdown = ft_buildFilterDropdownContent(targetValue, onSelectCallback);
            ft_currentDropdown = dropdown;
            document.body.appendChild(dropdown);
            const rect = buttonEl.getBoundingClientRect();
            const margin = 8;
            const width = dropdown.offsetWidth || 240;
            const height = dropdown.offsetHeight || 200;
            let left = rect.left;
            if (left + width + margin > window.innerWidth) left = window.innerWidth - width - margin;
            if (left < margin) left = margin;
            let top = rect.bottom + 4;
            if (top + height + margin > window.innerHeight) top = rect.top - height - 4;
            if (top < margin) top = margin;
            dropdown.style.left = `${left}px`; dropdown.style.top = `${top}px`;
        }

        // ------------- 設定モーダル ------------- //

        function ft_closeSettingsModal() {
            if (ft_settingsModalBackdrop) { ft_settingsModalBackdrop.remove(); ft_settingsModalBackdrop = null; }
            ft_dragSrcEntry = null;
        }

        function ft_openSettingsModal() {
            ft_closeSettingsModal();
            const backdrop = document.createElement('div'); backdrop.className = 'ft-modal-backdrop';
            const modal = document.createElement('div'); modal.className = 'ft-modal';
            const header = document.createElement('div'); header.className = 'ft-modal-header';
            const title = document.createElement('div'); title.className = 'ft-modal-title'; title.textContent = i18n.t('FT_SETTINGS_TITLE');
            header.appendChild(title);
            const body = document.createElement('div'); body.className = 'ft-modal-body';
            const displaySection = document.createElement('div'); displaySection.className = 'ft-modal-display-settings';
            const displayTitle = document.createElement('div'); displayTitle.textContent = i18n.t('FT_SETTINGS_DISPLAY_SECTION_TITLE');
            const modeRow = document.createElement('div'); modeRow.className = 'ft-modal-display-settings-row';
            const modeLabel = document.createElement('span'); modeLabel.textContent = i18n.t('FT_SETTINGS_DISPLAY_MODE_LABEL');
            const radioLeafLabel = document.createElement('label'); radioLeafLabel.className = 'ft-modal-display-radio';
            const radioLeaf = document.createElement('input'); radioLeaf.type = 'radio'; radioLeaf.name = 'ft-display-mode'; radioLeaf.value = 'leaf'; radioLeaf.checked = ft_state.display.mode === 'leaf';
            const radioLeafText = document.createElement('span'); radioLeafText.textContent = i18n.t('FT_SETTINGS_DISPLAY_MODE_LEAF');
            radioLeafLabel.appendChild(radioLeaf); radioLeafLabel.appendChild(radioLeafText);
            const radioFullLabel = document.createElement('label'); radioFullLabel.className = 'ft-modal-display-radio';
            const radioFull = document.createElement('input'); radioFull.type = 'radio'; radioFull.name = 'ft-display-mode'; radioFull.value = 'full'; radioFull.checked = ft_state.display.mode === 'full';
            const radioFullText = document.createElement('span'); radioFullText.textContent = i18n.t('FT_SETTINGS_DISPLAY_MODE_FULL');
            radioFullLabel.appendChild(radioFull); radioFullLabel.appendChild(radioFullText);
            modeRow.appendChild(modeLabel); modeRow.appendChild(radioLeafLabel); modeRow.appendChild(radioFullLabel);
            radioLeaf.addEventListener('change', () => { if (radioLeaf.checked) { ft_state.display.mode = 'leaf'; ft_saveState(); } });
            radioFull.addEventListener('change', () => { if (radioFull.checked) { ft_state.display.mode = 'full'; ft_saveState(); } });
            displaySection.appendChild(displayTitle); displaySection.appendChild(modeRow);
            const tagListEl = document.createElement('div'); tagListEl.className = 'ft-modal-tag-list';

            function clearDropClasses() {
                tagListEl.querySelectorAll('.ft-modal-tag-item').forEach(el => el.classList.remove('ft-modal-tag-item-drop-before', 'ft-modal-tag-item-drop-after', 'ft-modal-tag-item-drop-child'));
            }
            function deleteTagAndReparentChildren(tag) {
                ft_state.tags.forEach(child => { if (child.parentId === tag.id) child.parentId = tag.parentId || null; });
                ft_state.tags = ft_state.tags.filter(t => t.id !== tag.id);
                Object.keys(ft_state.tweetTags).forEach(tid => { if (ft_state.tweetTags[tid] === tag.id) delete ft_state.tweetTags[tid]; });
                ft_normalizeTagOrders(); ft_clampUncategorizedOrder(); ft_saveState();
            }
            function moveTagInSiblings(tag, direction) {
                const siblings = ft_state.tags.filter(t => (t.parentId || null) === (tag.parentId || null)).sort((a, b) => a.order - b.order);
                const idx = siblings.findIndex(t => t.id === tag.id);
                if (idx < 0 || idx + direction < 0 || idx + direction >= siblings.length) return;
                const other = siblings[idx + direction];
                [tag.order, other.order] = [other.order, tag.order];
                ft_normalizeTagOrders(); ft_saveState();
            }
            function moveTagAsChild(srcTag, targetTag) {
                if (!srcTag || !targetTag || ft_wouldCreateCycle(targetTag.id, srcTag.id)) return;
                srcTag.parentId = targetTag.id;
                const children = ft_state.tags.filter(t => (t.parentId || null) === targetTag.id);
                srcTag.order = (children.length ? Math.max(...children.map(t => t.order)) : -1) + 1;
                ft_normalizeTagOrders(); ft_saveState();
            }
            function moveTagBefore(srcTag, targetTag) {
                if (!srcTag || !targetTag || ft_wouldCreateCycle(targetTag.parentId, srcTag.id)) return;
                srcTag.parentId = targetTag.parentId; srcTag.order = targetTag.order - 0.5; ft_normalizeTagOrders(); ft_saveState();
            }
            function moveTagAfter(srcTag, targetTag) {
                if (!srcTag || !targetTag || ft_wouldCreateCycle(targetTag.parentId, srcTag.id)) return;
                srcTag.parentId = targetTag.parentId; srcTag.order = targetTag.order + 0.5; ft_normalizeTagOrders(); ft_saveState();
            }
            function moveTagToRootRelativeToUncat(srcTag, mode) {
                if (!srcTag) return;
                srcTag.parentId = null;
                let uncatPos = ft_state.uncategorized.order;
                const insertIndex = mode === 'before' ? uncatPos : uncatPos + 1;
                const rootTags = ft_state.tags.filter(t => !t.parentId && t.id !== srcTag.id).sort((a, b) => a.order - b.order);
                rootTags.splice(insertIndex, 0, srcTag);
                rootTags.forEach((t, i) => t.order = i);
                ft_normalizeTagOrders(); ft_clampUncategorizedOrder(); ft_saveState();
            }
            function getDropTargetInfoFromY(y) {
                const items = Array.from(tagListEl.querySelectorAll('.ft-modal-tag-item'));
                if (!items.length) return { row: null, mode: 'root-end' }; // 空ならルート追加

                const rects = items.map(row => row.getBoundingClientRect());

                // 一番下の要素の「底辺」より下なら、無条件でルート末尾移動とする
                const lastRect = rects[rects.length - 1];
                // 少しでも下(0px以上)にあればルート扱いにする（CSSで余白を作ったためこれでOK）
                if (y > lastRect.bottom) {
                    return { row: null, mode: 'root-end' };
                }

                const boundaries = [rects[0].top];
                for (let i = 1; i < items.length; i++) boundaries.push((rects[i - 1].bottom + rects[i].top) / 2);
                boundaries.push(rects[items.length - 1].bottom);

                let idx = 0; let min = Infinity;
                for (let i = 0; i < boundaries.length; i++) {
                    const d = Math.abs(y - boundaries[i]);
                    if (d < min) { min = d; idx = i; }
                }

                if (idx === 0) return { row: items[0], mode: 'before' };
                if (idx === items.length) return { row: items[items.length - 1], mode: 'after' };
                return { row: items[idx], mode: 'before' };
            }
            function rebuildTagList() {
                setInnerHTML(tagListEl,'');
                const entries = ft_getTagListWithUncategorized();
                if (entries.length === 1 && entries[0].kind === 'uncat') {
                    const empty = document.createElement('div'); empty.style.opacity = '0.7'; empty.style.fontSize = '12px'; empty.textContent = i18n.t('FT_SETTINGS_EMPTY_TAG_LIST'); tagListEl.appendChild(empty);
                }
                const rootCount = ft_countRootTags(); ft_clampUncategorizedOrder();
                entries.forEach(entry => {
                    const row = document.createElement('div'); row.className = 'ft-modal-tag-item'; row.dataset.kind = entry.kind;
                    const mainCell = document.createElement('div'); mainCell.className = 'ft-modal-tag-main'; if (entry.depth > 0) mainCell.style.paddingLeft = `${entry.depth * 16}px`;
                    const nameInput = document.createElement('input'); nameInput.className = 'ft-modal-tag-name'; nameInput.type = 'text';
                    const colorInput = document.createElement('input'); colorInput.className = 'ft-modal-tag-color'; colorInput.type = 'color';
                    const orderDiv = document.createElement('div');
                    const upBtn = document.createElement('button'); upBtn.className = 'ft-modal-tag-order'; upBtn.textContent = i18n.t('FT_SETTINGS_UP'); upBtn.type='button';
                    const downBtn = document.createElement('button'); downBtn.className = 'ft-modal-tag-order'; downBtn.textContent = i18n.t('FT_SETTINGS_DOWN'); downBtn.type='button';
                    orderDiv.appendChild(upBtn); orderDiv.appendChild(downBtn);
                    const delBtn = document.createElement('button'); delBtn.className = 'ft-modal-tag-delete'; delBtn.textContent = i18n.t('FT_SETTINGS_DELETE_BUTTON'); delBtn.type='button';
                    mainCell.appendChild(colorInput); mainCell.appendChild(nameInput);
                    const dragHandle = document.createElement('div'); dragHandle.className = 'ft-modal-tag-drag-handle'; setInnerHTML(dragHandle,'≡');

                    if (entry.kind === 'uncat') {
                        row.draggable = false; dragHandle.draggable = false; dragHandle.title = i18n.t('FT_SETTINGS_UNCATEGORIZED_DELETE_TOOLTIP');
                        nameInput.value = i18n.t('FT_SETTINGS_UNCATEGORIZED_NAME'); nameInput.readOnly = true; nameInput.title = i18n.t('FT_SETTINGS_UNCATEGORIZED_NAME_TOOLTIP');
                        colorInput.value = ft_getUncategorizedColor();
                        colorInput.addEventListener('change', () => { ft_state.uncategorized.color = colorInput.value; ft_saveState(); });
                        delBtn.disabled = true;
                        upBtn.disabled = ft_state.uncategorized.order <= 0;
                        downBtn.disabled = ft_state.uncategorized.order >= rootCount;
                        upBtn.addEventListener('click', () => { ft_state.uncategorized.order--; ft_saveState(); rebuildTagList(); });
                        downBtn.addEventListener('click', () => { ft_state.uncategorized.order++; ft_saveState(); rebuildTagList(); });
                    } else {
                        const tag = entry.tag; row.dataset.tagId = tag.id;
                        dragHandle.draggable = true;
                        nameInput.value = tag.name; colorInput.value = tag.color || '#1d9bf0';
                        nameInput.addEventListener('change', () => { if(nameInput.value.trim()) { tag.name = nameInput.value.trim(); ft_saveState(); rebuildTagList(); } });
                        colorInput.addEventListener('change', () => { tag.color = colorInput.value; ft_saveState(); });
                        delBtn.addEventListener('click', () => { if(confirm(i18n.t('FT_CONFIRM_DELETE_TAG_MSG').replace('{tagName}', tag.name))) { deleteTagAndReparentChildren(tag); rebuildTagList(); } });
                        const siblings = ft_state.tags.filter(t => (t.parentId || null) === (tag.parentId || null)).sort((a, b) => a.order - b.order);
                        const idx = siblings.findIndex(t => t.id === tag.id);
                        upBtn.disabled = idx <= 0; downBtn.disabled = idx >= siblings.length - 1;
                        upBtn.addEventListener('click', () => { moveTagInSiblings(tag, -1); rebuildTagList(); });
                        downBtn.addEventListener('click', () => { moveTagInSiblings(tag, 1); rebuildTagList(); });
                        dragHandle.addEventListener('dragstart', (ev) => { ev.stopPropagation(); ft_dragSrcEntry = { kind: 'tag', tagId: tag.id }; row.classList.add('ft-modal-tag-item-dragging'); ev.dataTransfer.setData('text/plain', tag.id); ev.dataTransfer.effectAllowed='move'; });
                        dragHandle.addEventListener('dragend', (ev) => { ev.stopPropagation(); ft_dragSrcEntry = null; row.classList.remove('ft-modal-tag-item-dragging'); clearDropClasses(); });
                        row.addEventListener('dragover', (ev) => {
                            if (!ft_dragSrcEntry) return;
                            const rect = row.getBoundingClientRect(); const ratio = (ev.clientY - rect.top) / rect.height;
                            clearDropClasses();
                            if (ratio > 0.3 && ratio < 0.7) { ev.preventDefault(); row.classList.add('ft-modal-tag-item-drop-child'); }
                        });
                        row.addEventListener('drop', (ev) => {
                            if (!ft_dragSrcEntry) return;
                            const rect = row.getBoundingClientRect(); const ratio = (ev.clientY - rect.top) / rect.height;
                            if (ratio > 0.3 && ratio < 0.7) { ev.preventDefault(); ev.stopPropagation(); moveTagAsChild(ft_getTagById(ft_dragSrcEntry.tagId), tag); rebuildTagList(); }
                        });
                    }
                    row.appendChild(mainCell); row.appendChild(dragHandle); row.appendChild(orderDiv); row.appendChild(delBtn); tagListEl.appendChild(row);
                });
            }
            tagListEl.ondragover = (ev) => {
                if (!ft_dragSrcEntry) return;
                if (ev.defaultPrevented) return;

                ev.preventDefault();
                clearDropClasses();
                tagListEl.classList.remove('ft-drag-to-root');

                // クラスリセット: すべての行からルート判定クラスを一旦消す
                tagListEl.querySelectorAll('.ft-is-root-ref').forEach(el => el.classList.remove('ft-is-root-ref'));

                const info = getDropTargetInfoFromY(ev.clientY);

                // 1. 一番下の余白へのドロップ（ルート末尾）
                if (info.mode === 'root-end') {
                    tagListEl.classList.add('ft-drag-to-root');
                }
                // 2. 行へのドロップ（隙間 or 親子化）
                else if (info.row) {
                    // 自分自身へのドロップでない場合
                    if (info.row.dataset.tagId !== ft_dragSrcEntry.tagId) {

                        const targetId = info.row.dataset.tagId;
                        const targetKind = info.row.dataset.kind;

                        // ▼▼▼ ルート階層かどうかの判定 ▼▼▼
                        let isRoot = false;
                        if (targetKind === 'uncat') {
                            // 「未分類」は常にルート
                            isRoot = true;
                        } else if (targetId) {
                            // タグの場合、親ID(parentId)が無ければルート
                            const tTag = ft_getTagById(targetId);
                            if (tTag && !tTag.parentId) {
                                isRoot = true;
                            }
                        }

                        // ルート階層なら専用クラスを付与（→ CSSで青線になる）
                        if (isRoot) {
                            info.row.classList.add('ft-is-root-ref');
                        }

                        // 前後(before/after) または 親子(child) のクラスを付与
                        info.row.classList.add(
                            info.mode === 'before' ? 'ft-modal-tag-item-drop-before' : 'ft-modal-tag-item-drop-after'
                        );

                        // 親子化（行の中央ドロップ）の判定がある場合は上書き
                        const rect = info.row.getBoundingClientRect();
                        const ratio = (ev.clientY - rect.top) / rect.height;
                        if (ratio > 0.3 && ratio < 0.7) {
                            // 中央ドロップは「入れ子」なので、線のクラスを消して背景クラスを付ける
                            info.row.classList.remove('ft-modal-tag-item-drop-before', 'ft-modal-tag-item-drop-after');
                            info.row.classList.add('ft-modal-tag-item-drop-child');
                        }
                    }
                }
            };
            tagListEl.ondrop = (ev) => {
                if (!ft_dragSrcEntry) return;
                if (ev.defaultPrevented) return;

                ev.preventDefault();
                clearDropClasses();
                tagListEl.classList.remove('ft-drag-to-root'); // クラス削除

                const info = getDropTargetInfoFromY(ev.clientY);
                const srcTag = ft_getTagById(ft_dragSrcEntry.tagId);
                if (!srcTag) return;

                // root-end なら「親なし」にして「一番下」へ
                if (info.mode === 'root-end') {
                    srcTag.parentId = null; // 親を解除

                    // ルート要素の中での最大order + 1 を設定して末尾へ
                    const rootTags = ft_state.tags.filter(t => !t.parentId);
                    const maxOrder = rootTags.length ? Math.max(...rootTags.map(t => t.order || 0)) : 0;
                    srcTag.order = maxOrder + 1;

                    ft_normalizeTagOrders();
                    ft_clampUncategorizedOrder();
                    ft_saveState();
                    rebuildTagList();
                    return;
                }

                // 既存の処理（行間へのドロップ）
                if (info.row && info.row.dataset.kind === 'tag') {
                    const targetId = info.row.dataset.tagId;
                    // 自分自身へのドロップは無視
                    if (targetId === srcTag.id) return;

                    const tTag = ft_getTagById(targetId);
                    if (info.mode === 'before') moveTagBefore(srcTag, tTag);
                    else moveTagAfter(srcTag, tTag);
                } else {
                    // 未分類(Uncategorized)との位置関係処理
                    moveTagToRootRelativeToUncat(srcTag, info.mode);
                }
                rebuildTagList();
            };
            rebuildTagList();
            const newTagSection = document.createElement('div'); newTagSection.className = 'ft-modal-new-tag';
            const newTagLabel = document.createElement('div'); newTagLabel.textContent = i18n.t('FT_DROPDOWN_NEW_TAG');
            const newTagRow = document.createElement('div'); newTagRow.className = 'ft-modal-new-tag-row';
            const newNameInput = document.createElement('input'); newNameInput.className = 'ft-modal-tag-name'; newNameInput.type = 'text'; newNameInput.placeholder = i18n.t('FT_DROPDOWN_NEW_TAG_PLACEHOLDER');
            const newColorInput = document.createElement('input'); newColorInput.className = 'ft-modal-tag-color'; newColorInput.type = 'color'; newColorInput.value = '#1d9bf0';
            const newAddBtn = document.createElement('button'); newAddBtn.className = 'ft-modal-button'; newAddBtn.textContent = i18n.t('FT_DROPDOWN_NEW_TAG_ADD'); newAddBtn.type='button';
            function doAddNew() {
                const name = newNameInput.value.trim();
                if (!name) return;
                ft_createNewTag(name, newColorInput.value, null); ft_saveState();
                newNameInput.value = ''; rebuildTagList();
            }
            newAddBtn.addEventListener('click', doAddNew);
            newNameInput.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') { ev.preventDefault(); doAddNew(); } });
            newTagRow.appendChild(newColorInput); newTagRow.appendChild(newNameInput); newTagRow.appendChild(newAddBtn);
            newTagSection.appendChild(newTagLabel); newTagSection.appendChild(newTagRow);
            body.appendChild(displaySection); body.appendChild(tagListEl); body.appendChild(newTagSection);
            const footer = document.createElement('div'); footer.className = 'ft-modal-footer';
            const closeBtn = document.createElement('button'); closeBtn.className = 'ft-modal-button'; closeBtn.textContent = i18n.t('FT_SETTINGS_CLOSE'); closeBtn.type='button';
            closeBtn.addEventListener('click', ft_closeSettingsModal);
            footer.appendChild(closeBtn);
            modal.appendChild(header); modal.appendChild(body); modal.appendChild(footer);
            backdrop.appendChild(modal);
            backdrop.addEventListener('mousedown', (ev) => { if (ev.target === backdrop) ft_closeSettingsModal(); });
            ft_settingsModalBackdrop = backdrop;
            document.body.appendChild(backdrop);
        }

        // ------------- イベント委譲 & 堅牢初期化 (Optimized) ------------- //

        function ft_installGlobalListeners() {
            // Document level Delegation
            document.addEventListener('click', (ev) => {
                const target = ev.target;
                if (!(target instanceof Element)) return;

                // 1. Tag Chip Click
                const chipBtn = target.closest('.ft-tag-chip');
                if (chipBtn) {
                    ev.stopPropagation(); ev.preventDefault();
                    const tweetId = chipBtn.dataset.tweetId;
                    if (tweetId && ft_state.enabled) {
                        ft_openTagDropdown(chipBtn, tweetId);
                    }
                    return;
                }

                // 3. Close Dropdown on outside click
                if (ft_currentDropdown && !ft_currentDropdown.contains(target)) {
                    ft_closeTagDropdown();
                }

            }, true); // Use capture for better delegation reliability

            document.addEventListener('keydown', (ev) => {
                if (ev.key === 'Escape') { ft_closeTagDropdown(); ft_closeSettingsModal(); }
            });
        }

        function ft_startRobustPolling() {
            let count = 0;
            const maxChecks = 10;
            const intervalId = setInterval(() => {
                count++;
                processNewTweets(true);
                if (count >= maxChecks) clearInterval(intervalId);
            }, 500);
        }

        // ------------- ツイート処理 (単一要素) ------------- //

        function ft_processTweetArticle(article) {
            const tweetId = article.dataset.ftTweetId || ft_extractTweetId(article);
            if (!tweetId) return;
            article.dataset.ftTweetId = tweetId;

            if (!ft_state.enabled) {
                 ft_removeTagChipFromArticle(article);
                 return;
            }

            // ネイティブブックマークや単なるタグ有無のチェックを削除
            // 「お気に入り済み (isFav)」の場合のみタグチップを表示する
            const isFav = (typeof isFavorited === 'function') && isFavorited(tweetId);

            if (isFav) {
                ft_attachTagChipToArticle(article, tweetId);
            } else {
                ft_removeTagChipFromArticle(article);
            }
        }

        // ------------- 初期化 ------------- //

        function ft_init() {
            if (ft_initialized) return;
            ft_initialized = true;
            ft_state = ft_loadState();
            ft_installGlobalListeners();
            processNewTweets(true);
            ft_startRobustPolling();
        }

        /* --- End Favorite Tags: Code Block --- */

        const LANG_OVERRIDE_KEY = 'advUILang_v1';
        // Settings で指定された UI 言語があれば、検出結果より優先して適用
        try {
            const overrideLang = kv.get(LANG_OVERRIDE_KEY, '');
            if (overrideLang && i18n.translations[overrideLang]) {
                i18n.lang = overrideLang;
            }
        } catch (_) {}

        const trigger = document.createElement('button');
        const HISTORY_SORT_KEY = 'advHistorySort_v1';
        const SYNC_ENABLED_KEY = 'advSyncEnabled_v1';
        const UNASSIGNED_IDX_KEYS = {
            saved: 'advSavedUnassignedIndex_v1',
            accounts: 'advAccountsUnassignedIndex_v1',
            lists: 'advListsUnassignedIndex_v1'
        };
        trigger.id = 'advanced-search-trigger';
        trigger.type = 'button';
        setInnerHTML(trigger,SEARCH_SVG);
        trigger.classList.add('adv-trigger-search');
        trigger.setAttribute('aria-label', i18n.t('tooltipTrigger'));
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-expanded', 'false');
        document.body.appendChild(trigger);

        const modalContainer = document.createElement('div');
        setInnerHTML(modalContainer,modalHTML);
        // bodyへの単純追加をやめ、#layers と同じ階層に挿入
        const mountModal = () => {
            const layers = document.getElementById('layers');
            // #layers が見つかればその親要素に追加（layersの直前＝裏側に挿入）
            if (layers && layers.parentNode) {
                // まだ挿入されていない、または場所が違う場合のみ移動
                if (modalContainer.nextSibling !== layers) {
                    layers.parentNode.insertBefore(modalContainer, layers);
                }
            } else {
                // #layers がまだない場合は body に仮置き
                if (modalContainer.parentNode !== document.body) {
                    document.body.appendChild(modalContainer);
                }
            }
        };

        // 初回配置
        mountModal();

        // X (React) が画面遷移でDOMを書き換えてモーダルが消されるのを防ぐため、定期的に配置を修正
        setInterval(mountModal, 500);
        i18n.apply(modalContainer);

        const modal = document.getElementById('advanced-search-modal');
        const form = document.getElementById('advanced-search-form');
        const closeButton = modal.querySelector('.adv-modal-close');
        const clearButton = document.getElementById('adv-clear-button');
        const applyButton = document.getElementById('adv-apply-button');
        const saveButton = document.getElementById('adv-save-button');
        const footerEl = modal.querySelector('.adv-modal-footer');
        const toastEl = document.getElementById('adv-toast');
        const secretBtn = document.getElementById('adv-secret-btn');
        const secretStateEl = document.getElementById('adv-secret-state');

        const settingsModal = document.getElementById('adv-settings-modal');
        const settingsLangSel = document.getElementById('adv-settings-lang');
        const settingsInitialTabSel = document.getElementById('adv-settings-initial-tab');
        const settingsFileInput = document.getElementById('adv-settings-file-input');
        const settingsOpenBtn = document.getElementById('adv-settings-button');
        const settingsCloseBtn = document.getElementById('adv-settings-close');
        const settingsCloseFooterBtn = document.getElementById('adv-settings-close-footer');
        const settingsExportBtn = document.getElementById('adv-settings-export');
        const settingsImportBtn = document.getElementById('adv-settings-import');
        const settingsResetBtn = document.getElementById('adv-settings-reset');

        const historyClearAllBtn = document.getElementById('adv-history-clear-all');
        historyClearAllBtn.textContent = i18n.t('historyClearAll');

        const accountScopeSel = document.getElementById('adv-account-scope');
        const locationScopeSel = document.getElementById('adv-location-scope');

        ['n','e','s','w','ne','nw','se','sw'].forEach(dir => {
            const h = document.createElement('div');
            h.className = `adv-resizer ${dir}`;
            h.dataset.dir = dir;
            modal.appendChild(h);
        });

        const EXC_NAME_KEY   = 'advExcludeHitName_v1';
        const EXC_HANDLE_KEY = 'advExcludeHitHandle_v1';
        const EXC_REPOSTS_KEY = 'advExcludeReposts_v1';
        const EXC_HASHTAGS_KEY = 'advExcludeTimelineHashtags_v1';
        const excNameEl   = document.getElementById('adv-exclude-hit-name');
        const excHandleEl = document.getElementById('adv-exclude-hit-handle');
        const excRepostsEl = document.getElementById('adv-filter-reposts-exclude');
        const excHashtagsEl = document.getElementById('adv-filter-hashtags-exclude');
        const loadExcludeFlags = () => ({
            name: kv.get(EXC_NAME_KEY, '1') === '1',
            handle: kv.get(EXC_HANDLE_KEY, '1') === '1',
            reposts: kv.get(EXC_REPOSTS_KEY, '0') === '1',
            hashtags: kv.get(EXC_HASHTAGS_KEY, '0') === '1',
        });
        const saveExcludeFlags = (v) => {
            kv.set(EXC_NAME_KEY, v.name ? '1':'0');
            kv.set(EXC_HANDLE_KEY, v.handle ? '1':'0');
            kv.set(EXC_REPOSTS_KEY, v.reposts ? '1':'0');
            kv.set(EXC_HASHTAGS_KEY, v.hashtags ? '1':'0');
        };
{
            const st = loadExcludeFlags();
            if (excNameEl) excNameEl.checked = st.name;
            if (excHandleEl) excHandleEl.checked = st.handle;
            if (excRepostsEl) excRepostsEl.checked = st.reposts;
            if (excHashtagsEl) excHashtagsEl.checked = st.hashtags;
        }
        [excNameEl, excHandleEl, excRepostsEl, excHashtagsEl].forEach(el=>{
            if (!el) return;
            el.addEventListener('change', ()=>{
                saveExcludeFlags({
                    name: excNameEl?.checked ?? false,
                    handle: excHandleEl?.checked ?? false,
                    reposts: excRepostsEl?.checked ?? false,
                    hashtags: excHashtagsEl?.checked ?? false,
                });
                rescanAllTweetsForFilter();
            });
        });

        themeManager.observeChanges(modal, trigger);

        // Accounts/Listsタブの背景をドロップターゲットにするためのヘルパー
        const setupBackgroundDrop = (panel, host, unassignFunction) => {
            const feedbackClass = 'adv-bg-drop-active';
            const SECT_MIME = 'adv/folder'; // フォルダ並び替えD&DのMIME

            // panel 内の .adv-zoom-root もイベントの対象に追加
            const zoomRoot = panel?.querySelector('.adv-zoom-root');
            const eventTargets = [panel, host, zoomRoot].filter(Boolean); // イベントをリッスンする対象

            // 破線を表示する対象は panel のみとする
            const feedbackTargets = [panel].filter(Boolean); // 破線を表示する対象

            const onDragEnter = (ev) => {
                // アイテム（text/plain）であり、セクション（adv/folder）ではない
                if (ev.dataTransfer.types && !ev.dataTransfer.types.includes(SECT_MIME) && ev.dataTransfer.types.includes('text/plain')) {
                    // ターゲットが panel, host, zoomRoot のいずれか
                    if (eventTargets.includes(ev.target)) {
                        // 破線は feedbackTargets に付ける (今回は panel のみ)
                        feedbackTargets.forEach(t => t.classList.add(feedbackClass));
                    }
                }
            };

            const onDragLeave = (ev) => {
                // ターゲット自身から離れた時だけフィードバックを消す
                if (eventTargets.includes(ev.target)) {
                    // 破線は feedbackTargets から消す
                    feedbackTargets.forEach(t => t.classList.remove(feedbackClass));
                }
            };

            const onDragOver = (ev) => {
                // カーソルが .adv-folder (フォルダー) の上にある場合は、問答無用で背景ハイライトを消して終わる
                if (ev.target.closest('.adv-folder')) {
                    feedbackTargets.forEach(t => t.classList.remove(feedbackClass));
                    return;
                }
                // dropイベントを発火させるために、dragoverでpreventDefaultが必要
                // アイテムであり、ターゲットが panel/host/zoomRoot 自身の場合のみ許可
                if (eventTargets.includes(ev.target) && ev.dataTransfer.types && !ev.dataTransfer.types.includes(SECT_MIME) && ev.dataTransfer.types.includes('text/plain')) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    /* ▼▼▼ 背景（隙間）にいるなら、フォルダーのハイライトは強制的に消す ▼▼▼ */
                    document.querySelectorAll('.adv-folder[data-drop="1"]').forEach(el => delete el.dataset.drop);
                    // 破線は feedbackTargets に付け続ける
                    feedbackTargets.forEach(t => t.classList.add(feedbackClass));
                } else {
                    // 子要素（フォルダなど）の上に来たら背景ハイライトは消す
                    feedbackTargets.forEach(t => t.classList.remove(feedbackClass));
                    // 残っているフォルダー見出しの破線を確実に解除
                    document.querySelectorAll('.adv-folder-header[data-drop="1"]').forEach(el => { delete el.dataset.drop; });
                }
            };

            const onDrop = (ev) => {
                feedbackTargets.forEach(t => t.classList.remove(feedbackClass)); // ドロップ時は常にハイライト解除

                // 最終チェック：アイテムであり、パネル/ホスト/zoomRoot 自身へのドロップ
                if (eventTargets.includes(ev.target) && ev.dataTransfer.types && !ev.dataTransfer.types.includes(SECT_MIME) && ev.dataTransfer.types.includes('text/plain')) {
                    ev.preventDefault();
                    ev.stopPropagation();

                    const draggedId = ev.dataTransfer.getData('text/plain');
                    if (draggedId) {
                        unassignFunction(draggedId); // (unassignAccount または unassignList を実行)
                    }
                }
            };

            // イベントは eventTargets に登録する
            eventTargets.forEach(target => {
                if (!target) return; // hostがまだ存在しない場合など
                target.addEventListener('dragenter', onDragEnter);
                target.addEventListener('dragleave', onDragLeave);
                target.addEventListener('dragover', onDragOver);
                target.addEventListener('drop', onDrop);
            });
        };

        // ドラッグ終了時（成功・キャンセル問わず）に、強制的にすべてのドロップハイライトを解除する
        document.addEventListener('dragend', () => {
            // 背景の破線を消す
            document.querySelectorAll('.adv-bg-drop-active').forEach(el => {
                el.classList.remove('adv-bg-drop-active');
            });
            // フォルダーヘッダー等のハイライトも念のため消す
            document.querySelectorAll('[data-drop="1"]').forEach(el => {
                delete el.dataset.drop;
            });
            // ドラッグ中のクラスも念のため消す
            document.querySelectorAll('.adv-item.dragging').forEach(el => {
                el.classList.remove('dragging');
            });
            document.body.classList.remove('adv-dragging');
        });

        // --- generic unassign helper (de-duplicate) ---
        // Remove an item from all folders under FOLDERS_KEY,
        // then move the item to the top of the master list (Unassigned head).
        function unassignItemGeneric({ FOLDERS_KEY, loadItems, saveItems, itemId }) {
            // 1) remove from every folder
            const folders = loadFolders(FOLDERS_KEY, '');
            let changed = false;
            for (const f of folders) {
                const before = f.order.length;
                f.order = f.order.filter(id => id !== itemId);
                if (f.order.length !== before) { f.ts = Date.now(); changed = true; }
            }
            if (changed) saveFolders(FOLDERS_KEY, folders);

            // 2) bump the item to the head of the master list (Unassigned first)
            const all = loadItems();
            const hit = all.find(x => x.id === itemId);
            if (hit) {
                const next = [hit, ...all.filter(x => x.id !== itemId)];
                saveItems(next);
            }
        }

        // --- generic "move item to a folder" helper ---
        function moveItemToFolderGeneric({ FOLDERS_KEY, itemId, folderId }) {
            const fArr = loadFolders(FOLDERS_KEY, '');
            // remove from every folder
            for (const f of fArr) {
                const before = f.order.length;
                f.order = f.order.filter(id => id !== itemId);
                if (f.order.length !== before) f.ts = Date.now();
            }
            // add to head of the target folder
            const target = fArr.find(f => f.id === folderId);
            if (target) {
                target.order = [itemId, ...target.order.filter(id => id !== itemId)];
                target.ts = Date.now();
            }
            saveFolders(FOLDERS_KEY, fArr);
        }

        // === [ADD] 特化 move 関数（トースト＆再描画まで含む） ===
        function moveAccountToFolder(accountId, folderId) {
          moveItemToFolderGeneric({
            FOLDERS_KEY: ACCOUNTS_FOLDERS_KEY,
            itemId: accountId,
            folderId
          });
          showToast(i18n.t('toastReordered'));
          try { renderAccounts(); } catch(_) {}
        }

        function moveSavedToFolder(savedId, folderId) {
          moveItemToFolderGeneric({
            FOLDERS_KEY: SAVED_FOLDERS_KEY,
            itemId: savedId,
            folderId
          });
          showToast(i18n.t('toastReordered'));
          try { renderSaved(); } catch(_) {}
        }

        function moveListToFolder(listId, targetFolderId) {
          moveItemToFolderGeneric({
            FOLDERS_KEY: LISTS_FOLDERS_KEY,
            itemId: listId,
            folderId: targetFolderId
          });
          showToast(i18n.t('toastReordered'));
          try { renderLists(); } catch(_) {}
        }

        // 未分類化ロジックを共通化 (Account用)
        const unassignAccount = (draggedId) => {
            unassignItemGeneric({
                FOLDERS_KEY: ACCOUNTS_FOLDERS_KEY,
                loadItems: loadAccounts,
                saveItems: saveAccounts,
                itemId: draggedId,
            });
            showToast(i18n.t('toastReordered'));
            renderAccounts();
        };

        // 未分類化ロジックを共通化 (List用)
        const unassignList = (draggedId) => {
            unassignItemGeneric({
                FOLDERS_KEY: LISTS_FOLDERS_KEY,
                loadItems: loadLists,
                saveItems: saveLists,
                itemId: draggedId,
            });
            showToast(i18n.t('toastReordered'));
            renderLists();
        };

        // 未分類化ロジックを共通化 (Saved用)
        const unassignSaved = (draggedId) => {
            unassignItemGeneric({
                FOLDERS_KEY: SAVED_FOLDERS_KEY,
                loadItems: () => migrateList(loadJSON(SAVED_KEY, [])),
                saveItems: (arr) => saveJSON(SAVED_KEY, migrateList(arr)),
                itemId: draggedId,
            });
            showToast(i18n.t('toastReordered'));
            renderSaved();
        };

        /* ========= Favorites Logic ========= */
        const FAV_KEY = 'advFavorites_v1';
        const FAV_SORT_KEY = 'advFavoritesSort_v1';

        // 高速化: メモリキャッシュ変数を定義
        let _favCache = null; // 配列データ (レンダリング用)
        let _favSet = null;   // ID検索用 Set (O(1)判定用)

        // データ構造: { id: tweetId, text, user: {name, handle, avatar}, media: [], ts, ... }

        // キャッシュがあればそれを返す。なければロードしてキャッシュ構築。
        const loadFavorites = () => {
            if (_favCache) return _favCache;

            const raw = loadJSON(FAV_KEY, []);
            _favCache = raw;
            _favSet = new Set(raw.map(x => x.id));

            return _favCache;
        };

        // 保存用タイマー変数
        let _favSaveTimer = null;

        // 保存時にキャッシュとSetは即時更新し、ストレージ保存は遅延させる
        const saveFavorites = (arr) => {
            // 1. メモリ上のデータは即時更新 (これでUI判定や検索は一瞬で反映される)
            _favCache = arr;
            _favSet = new Set(arr.map(x => x.id));

            // 2. 既存の保存予約があればキャンセル (連打対策)
            if (_favSaveTimer) clearTimeout(_favSaveTimer);

            // 3. 重たい書き込み処理を非同期で遅延実行
            // ユーザーが操作を終えてから 500ms 後、あるいは UI描画が落ち着いた後に実行
            _favSaveTimer = setTimeout(() => {
                // ここで初めて重い JSON.stringify が走る
                saveJSON(FAV_KEY, arr);
                _favSaveTimer = null;
            }, 500);
        };

        const toggleFavorite = (tweetMeta) => {
            // 1. キャッシュからデータを取得 (ロード済み前提)
            const list = loadFavorites();
            const idx = list.findIndex(x => x.id === tweetMeta.id);
            const isAdding = idx < 0;

            // 2. メモリ上のデータを更新 (saveFavorites内部で遅延保存が予約される)
            if (isAdding) {
                unmarkAsDeleted(tweetMeta.id); // 過去の削除ログを消去
                list.unshift({ ...tweetMeta, ts: Date.now() });
                showToast(i18n.t('toastFavorited'));
            } else {
                markAsDeleted(tweetMeta.id); // 削除ログを記録（クラウド同期用）
                list.splice(idx, 1);
                // 解除時はタグデータも削除
                if (ft_state && ft_state.tweetTags && ft_state.tweetTags[tweetMeta.id]) {
                    delete ft_state.tweetTags[tweetMeta.id];
                    ft_saveState();
                }
                showToast(i18n.t('toastUnfavorited'));
            }

            // 3. 変更をコミット (ここが高速化のキモ：保存は非同期になる)
            saveFavorites(list);

            // 4. UIを即座に更新
            // キャッシュ(_favSet)は更新済みなので、isFavorited() は正しい値を返す
            updateAllFavoriteButtons();
            refreshTagChipsForTweet(tweetMeta.id);

            // お気に入りタブが開かれている場合のみ再描画 (重いので)
            if (document.getElementById('adv-tab-favorites').classList.contains('active')) {
                // ここも少し遅らせてメインスレッドを解放しても良い
                requestAnimationFrame(() => renderFavorites());
            }

            return isAdding;
        };

        // Setを使った超高速判定 (JSON.parseが発生しない)
        const isFavorited = (tweetId) => {
            if (!_favSet) loadFavorites(); // 初回ロードがまだなら実行
            return _favSet.has(tweetId);
        };

        const deleteFavorite = (id) => {
            markAsDeleted(id);

            // 1. メモリ操作 & 遅延保存予約
            const list = loadFavorites().filter(x => x.id !== id);
            saveFavorites(list);

            // 2. タグデータ削除
            if (ft_state && ft_state.tweetTags && ft_state.tweetTags[id]) {
                delete ft_state.tweetTags[id];
                ft_saveState();
            }

            // 3. UI即時更新
            showToast(i18n.t('toastDeleted'));
            updateAllFavoriteButtons();
            refreshTagChipsForTweet(id);

            // 4. リスト再描画 (タブが開いている場合のみ)
            if (document.getElementById('adv-tab-favorites').classList.contains('active')) {
                 requestAnimationFrame(() => renderFavorites());
            }
        };

        // お気に入りリストのイベント委譲ハンドラ
        function setupFavoritesDelegation() {
            const listEl = document.getElementById('adv-favorites-list');
            // まだ要素がない、または既に登録済みならスキップ
            if (!listEl || listEl._delegationAttached) return;
            listEl._delegationAttached = true;

            listEl.addEventListener('click', (e) => {
                const target = e.target;
                if (!target) return;

                // A. 削除ボタン
                const deleteBtn = target.closest('[data-action="delete"]');
                if (deleteBtn) {
                    const row = deleteBtn.closest('.adv-item');
                    if (row && row.dataset.id) {
                        e.stopPropagation();
                        deleteFavorite(row.dataset.id);
                    }
                    return;
                }

                // B. Openボタン
                const openBtn = target.closest('[data-action="open"]');
                if (openBtn) {
                    const row = openBtn.closest('.adv-item');
                    if (row && row.dataset.id) {
                        e.stopPropagation();
                        // IDから最新データを引く（クロージャがないため）
                        const item = loadFavorites().find(x => x.id === row.dataset.id);
                        if (item) {
                            const url = `/${item.user.handle}/status/${item.id}`;
                            spaNavigate(url, { ctrlMeta: e.ctrlKey || e.metaKey });
                            if (window.innerWidth <= 700) closeModal();
                        }
                    }
                    return;
                }

                // C. ユーザーリンク
                const userLink = target.closest('.adv-link-user');
                if (userLink) {
                    e.preventDefault();
                    e.stopPropagation();
                    const href = userLink.getAttribute('href');
                    if (href) {
                        spaNavigate(href, { ctrlMeta: e.ctrlKey || e.metaKey });
                        if (window.innerWidth <= 700) closeModal();
                    }
                    return;
                }

                // D. メディアサムネイル
                const mediaImg = target.closest('.adv-media-thumb');
                if (mediaImg) {
                    e.stopPropagation();
                    const row = mediaImg.closest('.adv-item');
                    if (!row) return;
                    // 最新データの再取得
                    const item = loadFavorites().find(x => x.id === row.dataset.id);
                    if (!item) return;

                    const type = mediaImg.dataset.type;
                    const index = mediaImg.dataset.index;
                    const isQuote = mediaImg.dataset.isQuote === '1';

                    // 引用でIDがない場合(取得不能)は無視
                    if (isQuote && item.quote && !item.quote.id) return;

                    let targetBaseUrl = `/${item.user.handle}/status/${item.id}`;
                    if (isQuote && item.quote && item.quote.id) {
                        targetBaseUrl = `/${item.quote.user.handle}/status/${item.quote.id}`;
                    }

                    let targetPath = targetBaseUrl;
                    if (type === 'image') {
                        targetPath = `${targetBaseUrl}/photo/${index}`;
                    } else if (type === 'video') {
                        // 動画の場合もインデックス付きURLへ遷移させる
                        targetPath = `${targetBaseUrl}/video/${index}`;
                    }

                    spaNavigate(targetPath, { ctrlMeta: e.ctrlKey || e.metaKey });
                    if (window.innerWidth <= 700) closeModal();
                    return;
                }

                // E. 本文中のリンク (.adv-content-link)
                const contentLink = target.closest('.adv-content-link');
                if (contentLink) {
                     e.stopPropagation();
                     // target="_blank" ならブラウザデフォルト動作へ
                     return;
                }
            });
        }

        // 行レンダリング
        function renderFavoriteRow(item) {
            const row = document.createElement('div');
            row.className = 'adv-item';
            row.style.paddingRight = '60px';
            row.dataset.id = item.id;

            const text = item.text || '';
            const bodyHtml = safeLinkify(text);
            const displayTime = item.postedAt ? fmtTime(item.postedAt) : fmtTime(item.ts);

            // メディアHTML生成
            const buildMediaHtml = (mediaList, isQuote = false) => {
                if (!mediaList || mediaList.length === 0) return '';
                let html = '<div class="adv-item-media-row">';
                mediaList.forEach((m, i) => {
                    const mediaType = m.type || 'image';
                    const isVideo = mediaType === 'video';
                    const playIcon = isVideo
                        ? `<div class="adv-media-play-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg></div>`
                        : '';
                    // 引用でIDがない場合、クリックできない視覚表現(cursor:default)をHTML生成時点で適用
                    let styleAttr = '';
                    if (isQuote && item.quote && !item.quote.id) {
                         styleAttr = 'style="cursor:default"';
                    }
                    html += `<div class="adv-media-wrap">
                                <img src="${escapeAttr(m.url)}"
                                     data-type="${mediaType}"
                                     data-index="${i + 1}"
                                     data-is-quote="${isQuote ? '1' : '0'}"
                                     class="adv-media-thumb" loading="lazy" alt="Media" title="Open Media"
                                     ${styleAttr}>
                                ${playIcon}
                             </div>`;
                });
                html += '</div>';
                return html;
            };
            const mainMediaHtml = buildMediaHtml(item.media, false);

            // --- Link Card HTML ---
            let cardHtml = '';
            if (item.card) {
                let domain = item.card.domain || '';
                if (!domain) {
                    try {
                        const u = new URL(item.card.url);
                        domain = u.hostname;
                    } catch(e) { domain = 'link'; }
                }

                // 画像部分のHTML生成
                let mediaPart = '';
                if (item.card.img) {
                    mediaPart = `<img src="${escapeAttr(item.card.img)}" class="adv-card-image" loading="lazy" />`;
                } else if (item.card.svg) {
                    // SVGがある場合（Small Cardで画像がない場合など）
                    mediaPart = `<div class="adv-card-icon-container">${item.card.svg}</div>`;
                }

                // クラスの切り替え
                const boxClass = item.card.style === 'small' ? 'adv-card-box small-card' : 'adv-card-box';

                cardHtml = `
                    <a href="${escapeAttr(item.card.url)}" target="_blank" rel="noopener noreferrer nofollow" class="${boxClass}">
                        ${mediaPart}
                        <div class="adv-card-content">
                            <div class="adv-card-domain">${escapeHTML(domain)}</div>
                            <div class="adv-card-title">${escapeHTML(item.card.title)}</div>
                        </div>
                    </a>
                `;
            }

            // --- 引用HTML ---
            let quoteHtml = '';
            if (item.quote) {
                const q = item.quote;
                const qUserUrl = `/${escapeAttr(q.user.handle)}`;
                const qMediaHtml = buildMediaHtml(q.media, true);

                let qBodyHtml = safeLinkify(q.text);

                if (q.showMore && q.showMore.url) {
                    // class="adv-link" を付けることで、下部の addEventListener ループが適用されSPA遷移になる
                    qBodyHtml += ` <a href="${escapeAttr(q.showMore.url)}" class="adv-link" style="color:var(--modal-primary-color); white-space:nowrap;">${escapeHTML(q.showMore.text)}</a>`;
                }

                quoteHtml = `
                    <div class="adv-quote-box">
                        <div class="adv-quote-header">
                            ${q.user.avatar ? `<a class="adv-link adv-link-user" href="${qUserUrl}"><img src="${escapeAttr(q.user.avatar)}" class="adv-quote-avatar"></a>` : ''}
                            <a class="adv-link adv-link-user" href="${qUserUrl}" title="Quote User">
                                <span class="adv-quote-name">${escapeHTML(q.user.name)}</span>
                                <span class="adv-quote-handle">@${escapeHTML(q.user.handle)}</span>
                            </a>
                        </div>
                        <div class="adv-quote-text">${qBodyHtml}</div>
                        ${qMediaHtml}
                    </div>
                `;
            }

            const userUrl = `/${escapeAttr(item.user.handle)}`;

            setInnerHTML(row,`
                ${item.user.avatar
                    ? `<a class="adv-item-avatar-link adv-link adv-link-user" href="${userUrl}">
                         <img class="adv-item-avatar" src="${escapeAttr(item.user.avatar)}">
                       </a>`
                    : `<a class="adv-item-avatar-link adv-link adv-link-user" href="${userUrl}">
                         <div class="adv-item-avatar"></div>
                       </a>`
                }

                <div class="adv-item-main">
                    <div class="adv-item-title">
                        <a class="adv-link adv-link-user" href="${userUrl}" title="Open Profile">${escapeHTML(item.user.name)} <span style="font-weight:normal;color:var(--modal-text-secondary)">@${escapeHTML(item.user.handle)}</span></a>
                        <span class="adv-fav-tag-container"></span>
                    </div>
                    <div class="adv-item-body-text">${bodyHtml}</div>
                    ${mainMediaHtml}
                    ${cardHtml} ${quoteHtml}
                    <div class="adv-item-sub">
                        <span>${displayTime}</span>
                    </div>
                </div>

                <button class="adv-chip primary adv-fav-btn-pos adv-fav-btn-top" data-action="open">${i18n.t('buttonOpen')}</button>
                <button class="adv-chip danger adv-fav-btn-pos adv-fav-btn-bottom" data-action="delete">${i18n.t('delete')}</button>
            `);

            // 既存コードにあるこの処理が、adv-link クラスを持つ要素にSPA遷移イベントを一括登録
            row.querySelectorAll('a.adv-link').forEach(a => {
                a.addEventListener('click', (ev) => {
                    if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
                    ev.preventDefault();
                    const href = a.getAttribute('href') || `/${item.user.handle}`;
                    spaNavigate(href, { ctrlMeta: false });
                    if (window.innerWidth <= 700) {
                        closeModal();
                    }
                });
            });

            const tagContainer = row.querySelector('.adv-fav-tag-container');
            if (tagContainer && typeof ft_buildTagChip === 'function') {
                const chip = ft_buildTagChip(item.id);
                tagContainer.appendChild(chip);
            }

            return row;
        }

        /* --- ▼▼▼ 汎用ページネーション関数 ▼▼▼ */
        const PAGINATION_STATE = {}; // { [key]: { list, cursor, observer, renderer, container, sentinelClass } }
        const PAGE_SIZE = 50;

        // お気に入りタブ専用の現在の絞り込み状態（メモリ保持）
        let favFilterTagId = 'ALL'; // 'ALL', 'UNCAT', or tagId
        let favSearchQuery = '';

        function renderPagedList(key, container, items, rowRenderer, emptyEl, emptyMsg) {
            if (!container) return;

            // 状態初期化 or 取得
            if (!PAGINATION_STATE[key]) {
                PAGINATION_STATE[key] = { observer: null };
            }
            const state = PAGINATION_STATE[key];

            // 以前のObserverがあれば解除
            if (state.observer) {
                state.observer.disconnect();
                state.observer = null;
            }

            // 状態更新
            state.list = items;
            state.cursor = 0;
            state.renderer = rowRenderer;
            state.container = container;
            state.sentinelClass = `adv-sentinel-${key}`;

            // 表示クリア
            setInnerHTML(container,'');

            // 空の場合
            if (items.length === 0) {
                if (emptyEl) {
                    emptyEl.textContent = emptyMsg || '';
                    emptyEl.style.display = 'block';
                }
                return;
            } else {
                if (emptyEl) emptyEl.style.display = 'none';
            }

            // バッチ処理関数
            const renderBatch = () => {
                const nextBatch = state.list.slice(state.cursor, state.cursor + PAGE_SIZE);
                if (nextBatch.length === 0) return;

                const frag = document.createDocumentFragment();
                nextBatch.forEach(item => {
                    frag.appendChild(state.renderer(item));
                });

                // センチネル管理
                let sentinel = container.querySelector(`.${state.sentinelClass}`);
                if (!sentinel) {
                    sentinel = document.createElement('div');
                    sentinel.className = state.sentinelClass;
                    sentinel.style.height = '40px';
                    sentinel.style.margin = '10px 0';
                    // まだDOMに無いなら、フラグメントの後ろに追加予定（後述）
                }

                // リストへの挿入
                if (container.contains(sentinel)) {
                    container.insertBefore(frag, sentinel);
                } else {
                    container.appendChild(frag);
                    container.appendChild(sentinel);
                }

                state.cursor += nextBatch.length;
                updateSentinel(sentinel);
            };

            // センチネルの状態更新と監視
            const updateSentinel = (sentinel) => {
                const hasMore = state.cursor < state.list.length;
                if (hasMore) {
                    sentinel.style.display = 'block';
                    // Observer設定
                    if (!state.observer) {
                        state.observer = new IntersectionObserver((entries) => {
                            if (entries[0].isIntersecting) {
                                // 連続発火防止のため一旦監視解除
                                state.observer.unobserve(entries[0].target);
                                setTimeout(renderBatch, 50);
                            }
                        }, {
                            root: container.closest('.adv-modal-body'), // スクロール親要素
                            rootMargin: '200px'
                        });
                    }
                    state.observer.observe(sentinel);
                } else {
                    sentinel.style.display = 'none';
                    if (state.observer) state.observer.unobserve(sentinel);
                }
            };

            // 初回バッチ実行
            renderBatch();
        }

        function renderFavorites() {
            const listEl = document.getElementById('adv-favorites-list');
            const emptyEl = document.getElementById('adv-favorites-empty');
            if (!listEl) return;

            // 1. ツールバーの生成（まだ無ければ）
            if (!listEl.previousElementSibling?.classList?.contains('adv-folder-toolbar')) {
                const bar = document.createElement('div');
                bar.className = 'adv-folder-toolbar';
                // タグ絞り込みボタン、ソート選択、検索ボックス
                setInnerHTML(bar,`
                    <div style="display:flex; gap:6px; align-items:center; flex:0 0 auto;">
                        <button id="adv-favorites-tag-filter-btn" class="ft-filter-button" type="button">
                            <span class="ft-filter-button-label"></span>
                            <span class="ft-filter-button-caret">▾</span>
                        </button>
                        <select id="adv-favorites-sort" class="adv-select" style="max-width:140px; font-size:12px;">
                            <option value="saved_newest" data-i18n="sortSavedNewest"></option>
                            <option value="saved_oldest" data-i18n="sortSavedOldest"></option>
                            <option value="posted_newest" data-i18n="sortPostedNewest"></option>
                            <option value="posted_oldest" data-i18n="sortPostedOldest"></option>
                        </select>
                    </div>
                    <input id="adv-favorites-search" class="adv-input" type="text" placeholder="${i18n.t('placeholderSearchSaved')}" style="flex:1; min-width:80px;">
                `);

                // 翻訳適用（動的生成のためここで適用）
                bar.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = i18n.t(el.dataset.i18n); });

                listEl.parentElement.insertBefore(bar, listEl);

                // イベントリスナー登録
                const btn = bar.querySelector('#adv-favorites-tag-filter-btn');
                const sortSel = bar.querySelector('#adv-favorites-sort');
                const inp = bar.querySelector('#adv-favorites-search');

                // A. タグフィルタ
                btn.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    ev.preventDefault();
                    ft_openFilterDropdown(btn, favFilterTagId, (val) => {
                        favFilterTagId = val;
                        renderFavorites();
                    });
                });

                // B. ソート変更
                sortSel.value = kv.get(FAV_SORT_KEY, 'saved_newest');
                sortSel.addEventListener('change', () => {
                    kv.set(FAV_SORT_KEY, sortSel.value);
                    renderFavorites();
                });

                // C. 検索
                inp.addEventListener('input', debounce(() => {
                    favSearchQuery = inp.value;
                    renderFavorites();
                }, 200));
            }

            // 2. ツールバーの状態更新（ラベル設定など）
            const btn = document.getElementById('adv-favorites-tag-filter-btn');
            const labelSpan = btn ? btn.querySelector('.ft-filter-button-label') : null;
            const inp = document.getElementById('adv-favorites-search');
            const sortSel = document.getElementById('adv-favorites-sort');

            if (inp) inp.placeholder = i18n.t('placeholderSearchSaved');
            if (labelSpan) {
                let labelText = i18n.t('FT_FILTER_ALL');
                if (favFilterTagId === FT_FILTER_UNCATEGORIZED) {
                    labelText = i18n.t('FT_UNCATEGORIZED');
                } else if (favFilterTagId !== 'ALL') {
                    const tag = ft_getTagById(favFilterTagId);
                    if (tag) {
                        labelText = ft_getTagDisplayLabelFromTag(tag) || tag.name;
                    } else {
                        favFilterTagId = 'ALL';
                    }
                }
                labelSpan.textContent = labelText;
            }
            if (inp && inp.value !== favSearchQuery) inp.value = favSearchQuery;

            // ソート設定の読み込み（UIと同期）
            const currentSort = kv.get(FAV_SORT_KEY, 'saved_newest');
            if (sortSel && sortSel.value !== currentSort) sortSel.value = currentSort;

            // 3. データのロードとフィルタリング
            const allItems = loadFavorites(); // { id, text, user, postedAt, ts, ... }

            // フィルタ結果をローカル変数に
            let filteredList = allItems.filter(item => {
                // A. テキスト検索
                const q = favSearchQuery.trim().toLowerCase(); // 検索時に初めて正規化する
                if (q) {
                    const targetText = (item.text + ' ' + item.user.name + ' ' + item.user.handle).toLowerCase();
                    if (!targetText.includes(q)) return false;
                }
                // B. タグフィルタ
                if (favFilterTagId === 'ALL') return true;

                // ft_state および ft_state.tweetTags の存在確認を行う
                const itemTagId = (ft_state && ft_state.tweetTags) ? ft_state.tweetTags[item.id] : null;

                if (favFilterTagId === FT_FILTER_UNCATEGORIZED) return !itemTagId;
                return itemTagId ? ft_isTagInSubtree(itemTagId, favFilterTagId) : false;
            });

            // 4. ソート適用
            // ts: 追加日時, postedAt: 投稿日時
            // postedAt が無い古いデータは ts をフォールバックとして使う
            filteredList.sort((a, b) => {
                const tsA = a.ts || 0;
                const tsB = b.ts || 0;
                const postedA = a.postedAt || tsA; // fallback
                const postedB = b.postedAt || tsB; // fallback
                switch (currentSort) {
                    case 'saved_oldest':  return tsA - tsB;
                    case 'posted_newest': return postedB - postedA;
                    case 'posted_oldest': return postedA - postedB;
                    case 'saved_newest':
                    default:              return tsB - tsA;
                }
            });

            // 5. 汎用ページネーション関数で描画
            renderPagedList('favorites', listEl, filteredList, renderFavoriteRow, emptyEl, i18n.t('emptyFavorites'));
        }

        /* タブごと保存に対応 */
        const ZOOM_KEYS = {
          modal_ui: 'advZoom_modal_ui_v1',
          tabs:     'advZoom_tabs_v1',
          search:  'advZoom_tab_search_v1',
          history: 'advZoom_tab_history_v1',
          saved:   'advZoom_tab_saved_v1',
          favorites: 'advZoom_tab_favorites_v1',
          lists:   'advZoom_tab_lists_v1',
          accounts:'advZoom_tab_accounts_v1',
          mute:    'advZoom_tab_mute_v1',
        };
        const ZOOM_MIN = 0.5, ZOOM_MAX = 2.0, ZOOM_STEP = 0.1;

        /* 各タブの現在値（メモリキャッシュ） */
        const zoomByTab = {
          modal_ui: 1.0,
          tabs:    1.0,
          search:  1.0,
          history: 1.0,
          saved:   1.0,
          lists:   1.0,
          accounts:1.0,
          mute:    1.0,
        };

        const getActiveTabName = () => {
          const btn = document.querySelector('.adv-tab-btn.active');
          return btn?.dataset?.tab || 'search';
        };
        const getActiveZoomRoot = () =>
          document.querySelector('.adv-tab-content.active .adv-zoom-root') ||
          document.getElementById('adv-zoom-root');

        const clampZoom = z => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z*100)/100));

        const loadZoomFor = (tab) => {
          try {
            const k = ZOOM_KEYS[tab] || ZOOM_KEYS.search;
            // デフォルト値を '1' から分岐させる
            const defaultZoom = (tab === 'search') ? '0.87' : '1'; // 検索タブのみ 0.87 に
            const v = parseFloat(kv.get(k, defaultZoom)); // '1' だった部分を defaultZoom に変更
            if (!Number.isNaN(v)) zoomByTab[tab] = clampZoom(v);
          } catch {}
        };
        const saveZoomFor = (tab) => {
          try {
            const k = ZOOM_KEYS[tab] || ZOOM_KEYS.search;
            kv.set(k, String(zoomByTab[tab]));
          } catch {}
        };

        /* 初期ロード（全タブ） */
        Object.keys(zoomByTab).forEach(loadZoomFor);

        const applyZoom = () => {
          // 1. コンテンツエリアのズーム適用 (各タブの中身)
          const tab = getActiveTabName();
          const el = getActiveZoomRoot();
          if (el) {
            const z = zoomByTab[tab] ?? 1.0;
            el.style.zoom = ''; el.style.transform = ''; el.style.width = '';
            if ('zoom' in el.style) { el.style.zoom = z; }
            else { el.style.transform = `scale(${z})`; el.style.width = `${(100 / z).toFixed(3)}%`; }
          }

          // 2. タブバー(.adv-tabs)のズーム適用
          const tabsEl = document.querySelector('.adv-tabs');
          if (tabsEl) {
            const zTabs = zoomByTab.tabs ?? 1.0; // キー 'tabs' を使用
            tabsEl.style.zoom = ''; tabsEl.style.transform = ''; tabsEl.style.width = '';

            if ('zoom' in tabsEl.style) {
              tabsEl.style.zoom = zTabs;
            } else {
              tabsEl.style.transform = `scale(${zTabs})`;
              tabsEl.style.width = `${(100 / zTabs).toFixed(3)}%`;
            }
          }

          // 3. モーダルヘッダー & フッター (modal_ui) のズーム適用
          const uiElements = [
            document.querySelector('.adv-modal-header'),
            document.querySelector('.adv-modal-footer')
          ];
          const zUI = zoomByTab.modal_ui ?? 1.0;

          uiElements.forEach(uiEl => {
            if (!uiEl) return;
            uiEl.style.zoom = ''; uiEl.style.transform = ''; uiEl.style.width = '';

            if ('zoom' in uiEl.style) {
              uiEl.style.zoom = zUI;
            } else {
              uiEl.style.transform = `scale(${zUI})`;
              // ヘッダー/フッターは width:100% が基本なので、scale時は幅を補正してレイアウト崩れを防ぐ
              uiEl.style.width = `${(100 / zUI).toFixed(3)}%`;
            }
          });
        };

        const setZoomTarget = (z, targetKey) => {
          const key = targetKey || getActiveTabName();
          zoomByTab[key] = clampZoom(z);
          applyZoom();
          saveZoomFor(key);
        };

        const onWheelZoom = (e) => {
          const isAccel = e.ctrlKey || e.metaKey;
          if (!isAccel) return;

          // カーソル位置の判定
          const isTabs    = e.target.closest('.adv-tabs');
          const isContent = e.target.closest('.adv-zoom-root');
          // ヘッダー(上)またはフッター(下)か判定
          const isModalUI = e.target.closest('.adv-modal-header, .adv-modal-footer');

          // どこにも該当しなければ無視
          if (!isTabs && !isContent && !isModalUI) return;

          e.preventDefault();

          // ターゲットキーの決定
          let targetKey = getActiveTabName(); // デフォルトはコンテンツ
          if (isTabs) {
            targetKey = 'tabs';
          } else if (isModalUI) {
            targetKey = 'modal_ui';
          }

          const cur = zoomByTab[targetKey] ?? 1.0;
          const factor = e.deltaY > 0 ? (1 - ZOOM_STEP) : (1 + ZOOM_STEP);

          setZoomTarget(cur * factor, targetKey);
        };

        const onKeyZoom = (e) => {
          const accel = (e.ctrlKey || e.metaKey) && !e.shiftKey && !e.altKey;
          if (!accel) return;
          if (!e.target.closest('.adv-zoom-root')) return; // タブバー等は除外
          const k = e.key;
          const tab = getActiveTabName();
          const cur = zoomByTab[tab] ?? 1.0;
          if (k === '+' || k === '=') { e.preventDefault(); setZoomActiveTab(cur + ZOOM_STEP); }
          else if (k === '-' || k === '_') { e.preventDefault(); setZoomActiveTab(cur - ZOOM_STEP); }
          else if (k === '0') { e.preventDefault(); setZoomActiveTab(1.0); }
        };

        /* 初回適用＋表示時に再適用 */
        requestAnimationFrame(applyZoom);
        modal.addEventListener('wheel', onWheelZoom, { passive:false });
        modal.addEventListener('keydown', onKeyZoom);
        const modalDisplayObserver = new MutationObserver(() => {
          if (modal.style.display === 'flex') applyZoom();
        });
        modalDisplayObserver.observe(modal, { attributes:true, attributeFilter:['style'] });

        /* タブ切替時にもズーム再適用 */

        const searchInputSelectors = [
            'div[data-testid="primaryColumn"] input[data-testid="SearchBox_Search_Input"]', // 検索ページ
            'div[data-testid="sidebarColumn"] input[data-testid="SearchBox_Search_Input"]', // サイドバー
            'input[aria-label="Search query"]', // 標準（英語）
            'input[aria-label="検索クエリ"]' // 標準（日本語）
        ];

        // ▼ 関数名を getActiveSearchInputs (複数形) に変更
        const getActiveSearchInputs = () => {
            const inputs = new Set(); // 重複排除

            // 1. 標準の検索窓を探す
            for (const selector of searchInputSelectors) {
                const input = document.querySelector(selector);
                if (input && input.offsetParent !== null) {
                    inputs.add(input);
                }
            }
            // フォールバック（data-testid のみ）
            document.querySelectorAll('input[data-testid="SearchBox_Search_Input"]').forEach(input => {
                if (input && input.offsetParent !== null) {
                    inputs.add(input);
                }
            });

            return Array.from(inputs); // Set を配列にして返す
        };

        // React controlled input を確実に同期させる共通関数
        const syncControlledInput = (el, nextVal) => {
          try {
            const proto = Object.getPrototypeOf(el) || HTMLInputElement.prototype;
            const desc = Object.getOwnPropertyDescriptor(proto, 'value');
            if (desc && desc.set) {
              desc.set.call(el, nextVal); // React の setter を叩く
            } else {
              el.value = nextVal;
            }
            el.dispatchEvent(new InputEvent('input', { bubbles: true, cancelable: true }));
          } catch {
            try { el.value = nextVal; el.dispatchEvent(new Event('input', { bubbles: true })); } catch {}
          }
        };

        const MODAL_STATE_KEY   = 'advSearchModalState_v3.2';
        const TRIGGER_STATE_KEY = 'advSearchTriggerState_v1.0';
        const INITIAL_TAB_KEY   = 'advInitialTab_v1';
        const HISTORY_KEY = 'advSearchHistory_v2';
        const SAVED_KEY   = 'advSearchSaved_v2';
        const SECRET_KEY  = 'advSearchSecretMode_v1';
        // データリビジョン管理キー
        const DATA_REVISION_KEY = 'advDataRevision_v1';
        // 未同期の変更フラグ
        const DIRTY_KEY = 'advDataDirty_v1';

        const MUTE_KEY = 'advMutedWords_v1';
        const NATIVE_SEARCH_WIDTH_KEY = 'advNativeSearchWidth_v1';
        const migrateMuted = (list) =>
          Array.isArray(list)
            ? list
                .map(it => ({
                  id: it.id || uid(),
                  word: (it.word||'').trim(),
                  cs: !!it.cs,
                  wb: !!it.wb, // wb (Word Boundary) を維持
                  enabled: it.enabled !== false,
                  ts: it.ts || Date.now()
                }))
                .filter(it => it.word)
            : [];
        const loadMuted = () => migrateMuted(loadJSON(MUTE_KEY, []));
        const saveMuted = (arr) => saveJSON(MUTE_KEY, migrateMuted(arr));

        // 引数に wb を追加
        const addMuted = (word, cs=false, wb=false) => {
          const w = (word||'').trim();
          if (!w) return;
          const list = loadMuted();
          // 重複チェックに wb も含める
          if (list.some(it => it.word === w && !!it.cs === !!cs && !!it.wb === !!wb)) return;
          list.unshift({ id: uid(), word: w, cs: !!cs, wb: !!wb, enabled: true, ts: Date.now() });
          saveMuted(list);
          renderMuted();
          rescanAllTweetsForFilter();
        };

        const deleteMuted = (id) => {
          const list = loadMuted().filter(it => it.id !== id);
          saveMuted(list);
          renderMuted();
          rescanAllTweetsForFilter();
        };

        const toggleMutedCS = (id) => {
          const list = loadMuted().map(it => it.id === id ? { ...it, cs: !it.cs, ts: Date.now() } : it);
          saveMuted(list);
          renderMuted();
          rescanAllTweetsForFilter();
        };

        // 単語単位の一致切り替え
        const toggleMutedWB = (id) => {
          const list = loadMuted().map(it => it.id === id ? { ...it, wb: !it.wb, ts: Date.now() } : it);
          saveMuted(list);
          renderMuted();
          rescanAllTweetsForFilter();
        };

        const toggleMutedEnabled = (id) => {
          const list = loadMuted().map(it => it.id === id ? { ...it, enabled: !it.enabled, ts: Date.now() } : it);
          saveMuted(list);
          renderMuted();
          rescanAllTweetsForFilter();
        };

        // 検索窓リサイザーのセットアップ関数
        const setupNativeSearchResizer = () => {
            // サイドバーおよびメインカラムの検索フォームを対象にする
            const forms = document.querySelectorAll('div[data-testid="sidebarColumn"] form[role="search"], div[data-testid="primaryColumn"] form[role="search"]');

            // Exploreページ (/explore 配下) の場合は機能を除外してネイティブに戻す
            if (location.pathname.startsWith('/explore')) {
                forms.forEach(form => {
                    // 幅指定を削除してX本来のCSSレイアウトに戻す
                    if (form.style.width) {
                        form.style.width = '';
                    }
                    // 既にリサイザーが付与されている場合は削除する (SPA遷移で残っている場合など)
                    const existingResizer = form.querySelector('.adv-native-search-resizer');
                    if (existingResizer) {
                        existingResizer.remove();
                    }
                });
                return; // ここで処理終了
            }

            // 保存された幅を取得
            const savedWidth = kv.get(NATIVE_SEARCH_WIDTH_KEY, null);

            forms.forEach(form => {
                // 既に適用済みならスキップ
                if (form.querySelector('.adv-native-search-resizer')) {
                    // ただし幅が未適用の場合は再適用（DOM書き換え対策）
                    if (savedWidth && form.style.width !== savedWidth) {
                        form.style.width = savedWidth;
                    }
                    return;
                }

                // 幅の初期適用
                if (savedWidth) {
                    form.style.width = savedWidth;
                }

                // リサイズハンドルを作成
                const resizer = document.createElement('div');
                resizer.className = 'adv-native-search-resizer';
                resizer.title = 'Drag to resize search box';
                form.appendChild(resizer);

                // ドラッグ処理
                let isResizing = false;
                let startX = 0;
                let startW = 0;

                const onPointerDown = (e) => {
                    if (e.button !== 0) return; // 左クリックのみ
                    e.preventDefault();
                    e.stopPropagation();

                    isResizing = true;
                    startX = e.clientX;
                    startW = form.getBoundingClientRect().width;

                    document.body.classList.add('adv-dragging');
                    try { resizer.setPointerCapture(e.pointerId); } catch (_) {}
                };

                const onPointerMove = (e) => {
                    if (!isResizing) return;
                    e.preventDefault();

                    // 幅の計算
                    const dx = e.clientX - startX;
                    const newW = Math.max(200, startW + dx); // 最小幅200px

                    form.style.width = `${newW}px`;
                };

                const onPointerUp = (e) => {
                    if (!isResizing) return;
                    isResizing = false;
                    document.body.classList.remove('adv-dragging');
                    try { resizer.releasePointerCapture(e.pointerId); } catch (_) {}

                    // 保存
                    kv.set(NATIVE_SEARCH_WIDTH_KEY, form.style.width);
                };

                resizer.addEventListener('pointerdown', onPointerDown);
                window.addEventListener('pointermove', onPointerMove);
                window.addEventListener('pointerup', onPointerUp);
                window.addEventListener('pointercancel', onPointerUp);
            });
        };

        const SETTINGS_EXPORT_VERSION = 2;
        function buildSettingsExportJSON() {
          // タブごとのズーム
          const zoom = {};
          try {
            for (const [tab, key] of Object.entries(ZOOM_KEYS)) {
              zoom[tab] = kv.get(key, '1');
            }
          } catch (_) {}

          const safeParse = (key, def) => {
            try { return JSON.parse(kv.get(key, JSON.stringify(def))); } catch (_) { return def; }
          };

          const data = {
            // アプリ識別子
            appName: 'AdvancedSearchForX',

            v: SETTINGS_EXPORT_VERSION,

            // クラウド同期設定を含める
            syncConfig: safeParse(SYNC_CFG_KEY, null),

            // 削除ログを含める
            deletedLog: (typeof loadDeletedLog === 'function') ? loadDeletedLog() : {},

            // 言語・除外設定・ミュート
            lang: kv.get(LANG_OVERRIDE_KEY, ''),
            initialTab: kv.get(INITIAL_TAB_KEY, 'last'),
            excludeFlags: loadExcludeFlags(),
            muteMaster: loadMuteMaster(),
            muteMode: loadMuteMode(),
            muted: loadMuted(),

            // 検索履歴・保存済み検索
            history: loadJSON(HISTORY_KEY, []),
            saved: loadJSON(SAVED_KEY, []),
            favorites: loadJSON(FAV_KEY, []),

            // シークレットモード・履歴ソート
            secret: kv.get(SECRET_KEY, '0') === '1',
            historySort: kv.get(HISTORY_SORT_KEY, 'newest'),

            favSort: kv.get(FAV_SORT_KEY, 'saved_newest'),

            // 検索窓の幅
            nativeSearchWidth: kv.get(NATIVE_SEARCH_WIDTH_KEY, null),

            // タブ状態
            tabs: {
              last: kv.get(LAST_TAB_KEY, 'search'),
              order: loadJSON(TABS_ORDER_KEY, []),
              visibility: loadTabsVisibility(),
            },

            // モーダル／トリガー位置・サイズ
            modalState: safeParse(MODAL_STATE_KEY, null),
            triggerState: safeParse(TRIGGER_STATE_KEY, null),

            // ズーム
            zoom,

            // アカウント・リスト・各フォルダ
            accounts: (typeof loadAccounts === 'function') ? loadAccounts() : [],
            lists: (typeof loadLists === 'function') ? loadLists() : [],
            folders: {
              accounts: (typeof loadFolders === 'function' && typeof ACCOUNTS_FOLDERS_KEY !== 'undefined')
                ? loadFolders(ACCOUNTS_FOLDERS_KEY, '')
                : [],
              lists: (typeof loadFolders === 'function' && typeof LISTS_FOLDERS_KEY !== 'undefined')
                ? loadFolders(LISTS_FOLDERS_KEY, '')
                : [],
              saved: (typeof loadFolders === 'function' && typeof SAVED_FOLDERS_KEY !== 'undefined')
                ? loadFolders(SAVED_FOLDERS_KEY, i18n.t('defaultSavedFolders'))
                : [],
            },

            // Unassigned の挿入位置
            unassignedIndex: {
              saved: parseInt(kv.get('advSavedUnassignedIndex_v1', '0'), 10) || 0,
              accounts: parseInt(kv.get('advAccountsUnassignedIndex_v1', '0'), 10) || 0,
              lists: parseInt(kv.get('advListsUnassignedIndex_v1', '0'), 10) || 0,
            },
            /* --- Favorite Tags Data --- */
            favoriteTags: (typeof ft_loadState === 'function') ? ft_loadState() : ft_createDefaultState(),
          };

          return JSON.stringify(data, null, 2);
        }

        // クラウド同期専用のペイロード生成（UI設定を除外し、データのみを含める）
        function buildCloudSyncPayload() {
            // ローカルの全データを取得
            const fullData = JSON.parse(buildSettingsExportJSON());

            // 削除ログを読み込む
            const deletedLog = loadDeletedLog();

            // 同期対象とするキー（コンテンツ・データ）のみを抽出
            const syncData = {
                appName: fullData.appName,
                v: fullData.v,

                // 削除ログを含める
                deletedLog: deletedLog,

                // --- 同期するデータ (Content) ---
                history: fullData.history,           // 検索履歴
                saved: fullData.saved,               // 保存済み検索
                favorites: fullData.favorites,       // お気に入り
                favoriteTags: fullData.favoriteTags, // お気に入りタグ
                accounts: fullData.accounts,         // アカウントリスト
                lists: fullData.lists,               // リスト一覧
                folders: fullData.folders,           // 各フォルダ構成
                unassignedIndex: fullData.unassignedIndex, // 未分類の位置

                // ミュート・除外設定
                muted: fullData.muted,
                muteMaster: fullData.muteMaster,
                muteMode: fullData.muteMode,
                excludeFlags: fullData.excludeFlags
            };

            // 注意: ここには syncTimestamp や revision を含めません。
            // それらは暗号化コンテナの外側（エンベロープ）またはメタデータとして扱います。

            // --- 除外されるキー (Device Specific UI) ---
            // modalState (位置・サイズ)
            // triggerState (ボタン位置)
            // zoom (拡大率)
            // tabs (並び順・表示設定・初期タブ)
            // lang (言語設定)
            // secret (シークレットモード状態)
            // historySort (ソート順)
            // nativeSearchWidth (検索窓幅)

            return JSON.stringify(syncData);
        }

        function applySettingsImportJSON(text) {
            // インポート開始（saveJSONによる更新検知をブロック）
            __IS_IMPORTING__ = true;

            try {
                let data;
                try {
                    data = JSON.parse(text);
                } catch (_) {
                    alert(i18n.t('alertInvalidJSON'));
                    __IS_IMPORTING__ = false; // エラー時解除
                    return false;
                }
                if (!data || typeof data !== 'object') {
                    alert(i18n.t('alertInvalidData'));
                    __IS_IMPORTING__ = false; // エラー時解除
                    return false;
                }

                // バリデーションロジック
                // 1. アプリ識別子 (appName) があるかチェック
                const hasSignature = (data.appName === 'AdvancedSearchForX');

                // 2. 識別子がない場合、このアプリ特有の構造（vプロパティ + 主要な配列のいずれか）を持っているかチェック（後方互換性救済）
                const hasValidStructure = (
                    typeof data.v === 'number' &&
                    (Array.isArray(data.history) || Array.isArray(data.saved) || Array.isArray(data.favorites) || typeof data.tabs === 'object')
                );

                if (!hasSignature && !hasValidStructure) {
                    alert(i18n.t('alertInvalidApp'));
                    return false;
                }
                // バリデーション終了

                // 削除ログの保存
                if (data.deletedLog && typeof data.deletedLog === 'object') {
                    try { saveJSON(DELETED_LOG_KEY, data.deletedLog); } catch (_) {}
                }

                // --- 基本設定（v1/v2 共通） ---
                if (data.lang !== undefined) {
                    try { kv.set(LANG_OVERRIDE_KEY, data.lang || ''); } catch (_) {}
                }

                if (data.initialTab !== undefined) {
                    try { kv.set(INITIAL_TAB_KEY, data.initialTab || 'last'); } catch (_) {}
                }

                if (data.excludeFlags) {
                    saveExcludeFlags({
                        name: !!data.excludeFlags.name,
                        handle: !!data.excludeFlags.handle,
                        reposts: !!data.excludeFlags.reposts,
                        hashtags: !!data.excludeFlags.hashtags,
                    });
                }

                if (Array.isArray(data.muted)) {
                    saveMuted(data.muted);
                }

                if (typeof data.muteMaster === 'boolean') {
                    saveMuteMaster(data.muteMaster);
                }

                // ミュートモードの読み込みと保存
                if (data.muteMode && (data.muteMode === 'hidden' || data.muteMode === 'collapsed')) {
                    saveMuteMode(data.muteMode);
                }

                // --- v2 以降で追加された保存データ ---
                if (Array.isArray(data.history)) {
                    saveJSON(HISTORY_KEY, data.history);
                }
                if (Array.isArray(data.saved)) {
                    saveJSON(SAVED_KEY, data.saved);
                }

                // saveFavorites を経由させてキャッシュ(_favSet)も更新する
                if (Array.isArray(data.favorites)) {
                    saveFavorites(data.favorites);
                }

                if (typeof data.secret === 'boolean') {
                    try { kv.set(SECRET_KEY, data.secret ? '1' : '0'); } catch (_) {}
                }
                if (data.historySort) {
                    try { kv.set(HISTORY_SORT_KEY, data.historySort); } catch (_) {}
                }
                if (data.favSort) {
                    try { kv.set(FAV_SORT_KEY, data.favSort); } catch (_) {}
                }
                // 検索窓の幅復元
                if (data.nativeSearchWidth !== undefined) {
                    try {
                        if (data.nativeSearchWidth) kv.set(NATIVE_SEARCH_WIDTH_KEY, data.nativeSearchWidth);
                        else kv.del(NATIVE_SEARCH_WIDTH_KEY);
                    } catch (_) {}
                }
                if (data.tabs && typeof data.tabs === 'object') {
                    if (data.tabs.last) {
                        try { kv.set(LAST_TAB_KEY, data.tabs.last); } catch (_) {}
                    }
                    if (Array.isArray(data.tabs.order)) {
                        saveJSON(TABS_ORDER_KEY, data.tabs.order);
                    }
                    if (data.tabs.visibility && typeof data.tabs.visibility === 'object') {
                        saveTabsVisibility(data.tabs.visibility);
                    }
                }
                if (data.modalState) {
                    try { kv.set(MODAL_STATE_KEY, JSON.stringify(data.modalState)); } catch (_) {}
                }
                if (data.triggerState) {
                    try { kv.set(TRIGGER_STATE_KEY, JSON.stringify(data.triggerState)); } catch (_) {}
                }
                if (data.zoom && typeof data.zoom === 'object') {
                    try {
                        for (const [tab, key] of Object.entries(ZOOM_KEYS)) {
                            if (data.zoom[tab] != null) {
                                kv.set(key, String(data.zoom[tab]));
                            }
                        }
                    } catch (_) {}
                }

                if (Array.isArray(data.accounts) && typeof saveAccounts === 'function') {
                    try { saveAccounts(data.accounts); } catch (_) {}
                }
                if (Array.isArray(data.lists) && typeof saveLists === 'function') {
                    try { saveLists(data.lists); } catch (_) {}
                }

                if (data.folders && typeof data.folders === 'object') {
                    if (Array.isArray(data.folders.accounts) && typeof ACCOUNTS_FOLDERS_KEY !== 'undefined') {
                        try { saveFolders(ACCOUNTS_FOLDERS_KEY, data.folders.accounts); } catch (_) {}
                    }
                    if (Array.isArray(data.folders.lists) && typeof LISTS_FOLDERS_KEY !== 'undefined') {
                        try { saveFolders(LISTS_FOLDERS_KEY, data.folders.lists); } catch (_) {}
                    }
                    if (Array.isArray(data.folders.saved) && typeof SAVED_FOLDERS_KEY !== 'undefined') {
                        try { saveFolders(SAVED_FOLDERS_KEY, data.folders.saved); } catch (_) {}
                    }
                }

                if (data.unassignedIndex && typeof data.unassignedIndex === 'object') {
                    if ('saved' in data.unassignedIndex) try { kv.set('advSavedUnassignedIndex_v1', String(data.unassignedIndex.saved | 0)); } catch (_) {}
                    if ('accounts' in data.unassignedIndex) try { kv.set('advAccountsUnassignedIndex_v1', String(data.unassignedIndex.accounts | 0)); } catch (_) {}
                    if ('lists' in data.unassignedIndex) try { kv.set('advListsUnassignedIndex_v1', String(data.unassignedIndex.lists | 0)); } catch (_) {}
                }

                // クラウド同期設定の復元
                if (data.syncConfig && typeof data.syncConfig === 'object') {
                    try {
                        // ストレージに保存
                        kv.set(SYNC_CFG_KEY, JSON.stringify(data.syncConfig));

                        // メモリ上のマネージャーにも即座に反映 (UI更新のため)
                        if (typeof syncManager !== 'undefined') {
                            syncManager.loadConfig();
                            // UIの入力欄にも値をセット
                            if (syncEpInput) syncEpInput.value = syncManager.endpoint;
                            if (syncIdInput) syncIdInput.value = syncManager.syncId;
                            if (syncScInput) syncScInput.value = syncManager.secret;

                            // 状態表示を更新
                            if (syncManager.endpoint && syncManager.secret) {
                                syncManager.updateStatus('Config Loaded');
                            }
                        }
                    } catch (_) {}
                }

                /* --- Favorite Tags Data --- */
                if (data.favoriteTags && typeof ft_saveState === 'function') {
                    try {
                        const s = data.favoriteTags;
                        ft_normalizeTagOrdersFor(s);
                        ft_clampUncategorizedOrderFor(s);
                        ft_saveState(s); // ストレージへの保存

                        if (typeof ft_state !== 'undefined') {
                            ft_state = s;
                        }
                    } catch (_) {}
                }

                // 言語を再適用
                try {
                    const override = kv.get(LANG_OVERRIDE_KEY, '');
                    if (override && i18n.translations[override]) {
                        i18n.lang = override;
                    } else if (!override) {
                        i18n.init();
                    }
                } catch (_) {}

                try {
                    i18n.apply(document.getElementById('advanced-search-modal'));
                    i18n.apply(document.getElementById('adv-settings-modal'));
                } catch (_) {}

                try { applySecretBtn(); } catch (_) {}
                try { renderHistory(); } catch (_) {}
                try { renderSaved(); } catch (_) {}
                try { renderLists(); } catch (_) {}
                try { renderAccounts(); } catch (_) {}
                try { renderMuted(); } catch (_) {}

                // お気に入りリストを再描画し、ボタン状態・タグチップを全更新する
                try {
                    renderFavorites();
                    updateAllFavoriteButtons();
                } catch (_) {}

                try { rescanAllTweetsForFilter(); } catch (_) {}

                /* --- Favorite Tags UI Refresh --- */
                try {
                    if (typeof ft_refreshAllTagChips === 'function') ft_refreshAllTagChips();
                } catch (_) {}

                // タブの表示状態を適用
                try { applyTabsVisibility(); } catch (_) {}

                // ▼▼▼ インポートした設定を即座に画面に反映する処理 ▼▼▼

                // 1. ズーム設定の反映 (データに含まれている場合のみ実行)
                if (data.zoom) {
                    try {
                        Object.keys(zoomByTab).forEach(tab => loadZoomFor(tab));
                        applyZoom();
                    } catch (_) {}
                }

                // 2. モーダル位置・サイズの反映 (データに含まれている場合のみ実行)
                // クラウド同期時は modalState がないためスキップされ、位置ズレを防ぐ
                if (data.modalState) {
                    try {
                        loadModalState();
                        requestAnimationFrame(keepModalInViewport);
                    } catch (_) {}
                }

                // 3. トリガーボタン位置の反映 (データに含まれている場合のみ実行)
                if (data.triggerState) {
                    try {
                        applyTriggerStoredPosition();
                        requestAnimationFrame(keepTriggerInViewport);
                    } catch (_) {}
                }

                // 4. 検索窓の幅の反映 (データに含まれている場合のみ実行)
                if (data.nativeSearchWidth !== undefined) {
                    try {
                        setupNativeSearchResizer();
                    } catch (_) {}
                }

                showToast(i18n.t('toastImported'));
                return true;
            } catch (e) {
                console.error(e);
                return false;
            } finally {
                // 成功・失敗・エラーに関わらず、必ずフラグを戻す
                __IS_IMPORTING__ = false;
            }
        }

        // マスターON/OFF（全体の適用を止めるだけ。各エントリの enabled は保持）
        const MUTE_MASTER_KEY = 'advMuteMasterEnabled_v1';
        const MUTE_MODE_KEY = 'advMuteMode_v1';
        const LAST_TAB_KEY = 'advSearchLastTab_v1';
        const TABS_ORDER_KEY = 'advTabsOrder_v1';
        const TABS_VISIBILITY_KEY = 'advTabsVisibility_v1';
        const loadMuteMaster = () => { try { return kv.get(MUTE_MASTER_KEY, '1') === '1'; } catch(_) { return true; } };
        const saveMuteMaster = (on) => { try { kv.set(MUTE_MASTER_KEY, on ? '1' : '0'); } catch(_) {} };
        const loadMuteMode = () => { try { return kv.get(MUTE_MODE_KEY, 'hidden'); } catch(_) { return 'hidden'; } };
        const saveMuteMode = (v) => { try { kv.set(MUTE_MODE_KEY, v); } catch(_) {} };

        const tabButtons = Array.from(document.querySelectorAll('.adv-tab-btn'));

        // Get tab panels for background drop
        const tabAccountsPanel = document.getElementById('adv-tab-accounts');
        const tabListsPanel = document.getElementById('adv-tab-lists');
        const tabSavedPanel    = document.getElementById('adv-tab-saved');

        const activateTab = (name) => {
            let targetName = name;
            const visibility = loadTabsVisibility();

            // ターゲットが非表示に設定されているかチェック
            if (visibility[targetName] === false) {
                // 非表示の場合、フォールバック先を探す
                // 'search' は true が保証されているので、必ず 'search' にフォールバックされる
                const orderedButtons = Array.from(document.querySelectorAll('.adv-tab-btn'));
                const firstVisible = orderedButtons.find(btn => {
                    const tab = btn.dataset.tab;
                    return tab && visibility[tab] !== false;
                });
                targetName = firstVisible ? firstVisible.dataset.tab : 'search';
            }

            // tabButtons は DOM の順序と同期している必要があるため、DOM から再取得
            const currentTabButtons = Array.from(document.querySelectorAll('.adv-tab-btn'));
            currentTabButtons.forEach(b => b.classList.toggle('active', b.dataset.tab === targetName));

            // [tabSearch, tabHistory, tabSaved, tabLists, tabAccounts, tabMute] // 古い配列参照を削除
            document.querySelectorAll('.adv-tab-content').forEach(el => {
              el.classList.toggle('active', el.id === `adv-tab-${targetName}`);
            });


            footerEl.style.display = (targetName === 'search') ? '' : 'none';
            // 最後に開いたタブを保存 (非表示でも要求されたタブを保存する)
            try {
                kv.set(LAST_TAB_KEY, name); // ★ 元の name を保存する
            } catch(e) {
                console.error('Failed to save last tab state:', e);
            }
            if (targetName === 'history') renderHistory();
            if (targetName === 'saved') renderSaved();
            if (targetName === 'lists') renderLists();
            if (targetName === 'accounts') renderAccounts();
            if (targetName === 'mute') renderMuted();
            if (targetName === 'favorites') renderFavorites();
            if (targetName === 'search') updateSaveButtonState();

            /* タブ切替ごとに該当タブのズーム率を反映 */
            applyZoom();
        };

        const applyTabsVisibility = () => {
            const visibility = loadTabsVisibility();
            // tabButtons は DOM の順序を反映している必要があるため、DOM から再取得
            const currentTabButtons = Array.from(document.querySelectorAll('.adv-tab-btn'));
            let firstVisibleTab = 'search'; // フォールバック (searchはtrue固定なので)

            for (const btn of currentTabButtons) {
                const tabName = btn.dataset.tab;
                if (!tabName) continue;

                // visibility[tabName] が false の場合のみ非表示 (true や undefined は表示)
                const isVisible = visibility[tabName] !== false;
                btn.style.display = isVisible ? '' : 'none';

                // フォールバック先タブを決定 (search が最優先)
                if (isVisible && firstVisibleTab === 'search' && tabName !== 'search') {
                    firstVisibleTab = tabName; // search 以外で最初に見つかった表示可能なタブ
                }
            }

            // 'search' が表示可能か確認 (true 固定だが念のため)
            if (visibility['search'] === true) {
                firstVisibleTab = 'search';
            }

            // 最後にアクティブだったタブが非表示になっていないかチェック
            const activeBtn = document.querySelector('.adv-tab-btn.active');
            if (activeBtn && activeBtn.style.display === 'none') {
                // 非表示にされたので、表示可能な最初のタブ (通常は 'search') に切り替える
                activateTab(firstVisibleTab);
            }
        };

        // タブの順序を読み込んで適用
        (function applyTabsOrder() {
          const tabsContainer = document.querySelector('.adv-tabs');
          if (!tabsContainer) return;

          // 現在のボタンを data-tab をキーにした Map として保持
          const currentButtons = new Map();
          const defaultOrder = [];
          tabsContainer.querySelectorAll('.adv-tab-btn[data-tab]').forEach(btn => {
              const tabName = btn.dataset.tab;
              if (tabName) {
                  currentButtons.set(tabName, btn);
                  defaultOrder.push(tabName);
              }
          });

          // 保存された順序を読み込む
          const savedOrder = loadJSON(TABS_ORDER_KEY, defaultOrder);

          // 保存された順序を検証し、不足分を補う
          const finalOrder = [];
          const seen = new Set();
          // 1. 保存された順序のうち、現在も存在するものを追加
          savedOrder.forEach(tabName => {
              if (currentButtons.has(tabName)) {
                  finalOrder.push(tabName);
                  seen.add(tabName);
              }
          });
          // 2. デフォルト順序のうち、まだ追加されていないもの（＝新しいタブ）を末尾に追加
          defaultOrder.forEach(tabName => {
              if (!seen.has(tabName)) {
                  finalOrder.push(tabName);
              }
          });

          // 順序が実際に変更されているか確認
          if (JSON.stringify(savedOrder) !== JSON.stringify(finalOrder)) {
              saveJSON(TABS_ORDER_KEY, finalOrder);
          }

          // DOMを並び替える
          finalOrder.forEach(tabName => {
              const btn = currentButtons.get(tabName);
              if (btn) {
                  tabsContainer.appendChild(btn);
              }
          });
          // tabButtons 配列も再取得（順序が変更されたため）
            tabButtons.splice(0, tabButtons.length, ...Array.from(document.querySelectorAll('.adv-tab-btn')));
        })();

        // タブの表示/非表示をDOMに適用 (activateTab の前に呼ぶ)
        applyTabsVisibility();

        const saveModalRelativeState = () => {
            // ▼ SP時は、PC用のレイアウト設定（開閉状態含む）を絶対に上書きさせない
            // これにより「SPで閉じても、PCに戻ったら開いたまま」を実現する
            if (window.innerWidth <= 700) return;

            if (modal.style.display === 'none') {
                try {
                    const current = (()=>{
                        try { return JSON.parse(kv.get(MODAL_STATE_KEY, '{}')); } catch(_) { return {}; }
                    })();
                    current.visible = false;
                    kv.set(MODAL_STATE_KEY, JSON.stringify(current));
                } catch(_) {}
                return;
            }
            const rect = modal.getBoundingClientRect();
            const winW = window.innerWidth, winH = window.innerHeight;
            const fromRight = winW - rect.right, fromBottom = winH - rect.bottom;
            const h_anchor = rect.left < fromRight ? 'left' : 'right';
            const h_value  = h_anchor === 'left' ? rect.left : fromRight;
            const v_anchor = rect.top  < fromBottom ? 'top'  : 'bottom';
            const v_value  = v_anchor === 'top' ? rect.top : fromBottom;
            const state = { h_anchor, h_value, v_anchor, v_value, visible: true,
                            w: Math.round(rect.width), h: Math.round(rect.height) };
            kv.set(MODAL_STATE_KEY, JSON.stringify(state));
        };
        const applyModalStoredPosition = () => {
            try {
                const s = JSON.parse(kv.get(MODAL_STATE_KEY, '{}'));
                const h_anchor = s.h_anchor || 'right';
                const h_value  = s.h_value ?? 20;
                const v_anchor = s.v_anchor || 'top';
                const v_value  = s.v_value ?? 80;
                modal.style.left = modal.style.right = modal.style.top = modal.style.bottom = 'auto';
                if (h_anchor === 'right') modal.style.right = `${h_value}px`; else modal.style.left = `${h_value}px`;
                if (v_anchor === 'bottom') modal.style.bottom = `${v_value}px`; else modal.style.top = `${v_value}px`;

                const minW = 300, minH = 240;
                if (s.w) modal.style.width  = `${Math.max(minW, Math.min(s.w, window.innerWidth  - 20))}px`;
                else     modal.style.width  = '380px';
                if (s.h) modal.style.height = `${Math.max(minH, Math.min(s.h, window.innerHeight - 20))}px`;
                else     modal.style.height = '730px';
            } catch(e) { console.error('Failed to apply modal position:', e); }
        };
        const keepModalInViewport = () => {
            // ▼ SP時はCSSにレイアウトを任せるため、JSによる補正を行わない
            if (window.innerWidth <= 700) return;

            if (modal.style.display === 'none') return;
            const rect = modal.getBoundingClientRect();
            const winW = window.innerWidth, winH = window.innerHeight, m = 10;

            const minW = 300, minH = 240;
            const maxW = Math.max(minW, winW - 2*m);
            const maxH = Math.max(minH, winH - 2*m);
            const w = Math.min(Math.max(rect.width,  minW), maxW);
            const h = Math.min(Math.max(rect.height, minH), maxH);
            if (Math.round(w) !== Math.round(rect.width))  modal.style.width  = `${w}px`;
            if (Math.round(h) !== Math.round(rect.height)) modal.style.height = `${h}px`;

            let x = rect.left, y = rect.top;
            if (x < m) x = m; if (y < m) y = m;
            if (x + w > winW - m) x = winW - w - m;
            if (y + h > winH - m) y = winH - h - m;
            if (Math.round(x) !== Math.round(rect.left) || Math.round(y) !== Math.round(rect.top)) {
                modal.style.left = `${x}px`; modal.style.top = `${y}px`;
                modal.style.right = 'auto'; modal.style.bottom = 'auto';
            }
        };
        const loadModalState = () => {
            try { applyModalStoredPosition(); } catch(e) {
                console.error('Failed to load modal state:', e);
                kv.del(MODAL_STATE_KEY);
            }
        };

        // レイアウトモードの判定 (SP < 500 <= Tablet < 1000 <= PC)
        const getTriggerLayoutMode = () => {
            const w = window.innerWidth;
            if (w < 500) return 'sp';
            if (w < 1000) return 'tablet';
            return 'pc';
        };

        const saveTriggerRelativeState = () => {
            // SP/Tabletでも保存する。モードごとにキーを分ける。
            const rect = trigger.getBoundingClientRect();
            const winW = window.innerWidth, winH = window.innerHeight;
            const fromRight = winW - rect.right, fromBottom = winH - rect.bottom;
            const h_anchor = rect.left < fromRight ? 'left' : 'right';
            const h_value  = h_anchor === 'left' ? rect.left : fromRight;
            const v_anchor = rect.top  < fromBottom ? 'top'  : 'bottom';
            const v_value  = v_anchor === 'top' ? rect.top : fromBottom;

            // 全体の保存データを読み込み
            let allStates = {};
            try { allStates = JSON.parse(kv.get(TRIGGER_STATE_KEY, '{}')) || {}; } catch(_) {}

            // 現在のモードに対して保存
            const mode = getTriggerLayoutMode();
            allStates[mode] = { h_anchor, h_value, v_anchor, v_value };

            kv.set(TRIGGER_STATE_KEY, JSON.stringify(allStates));
        };
        const applyTriggerStoredPosition = () => {
            try {
                let allStates = {};
                try { allStates = JSON.parse(kv.get(TRIGGER_STATE_KEY, '{}')) || {}; } catch(_) {}

                // 旧バージョンデータ（直下にプロパティがある場合）のマイグレーション
                if (allStates.h_anchor && !allStates.pc) {
                    allStates = { pc: { ...allStates }, tablet: {}, sp: {} };
                }

                const mode = getTriggerLayoutMode();
                const s = allStates[mode] || {};

                // デフォルト値の分岐
                let defHAnchor = 'right', defHValue = 20;
                let defVAnchor = 'top',   defVValue = 18;

                if (mode === 'sp') {
                    // SPのデフォルト: 右下 (投稿ボタンの上あたり)
                    defHAnchor = 'right'; defHValue = 23.5;
                    defVAnchor = 'bottom'; defVValue = 140;
                } else if (mode === 'tablet') {
                    // Tabletのデフォルト設定

                    // 保存された位置がない（初期状態）場合、DOM上の投稿ボタンの位置を探してその下に配置する
                    if (!s.h_anchor && !s.v_anchor) {
                        const postBtn = document.querySelector('[data-testid="SideNav_NewTweet_Button"]');
                        if (postBtn) {
                            const rect = postBtn.getBoundingClientRect();
                            // ボタンが見えていて座標が取れる場合のみ計算
                            if (rect.width > 0 && rect.height > 0) {
                                // トリガーのサイズ(CSSで50px)の半分を引いてセンタリング
                                const triggerSize = 50;
                                const centerX = rect.left + (rect.width / 2) - (triggerSize / 2);
                                const topY = rect.bottom + 20; // ボタンの下 20px の余白

                                trigger.style.left = `${centerX}px`;
                                trigger.style.top = `${topY}px`;
                                trigger.style.right = 'auto';
                                trigger.style.bottom = 'auto';
                                return; // 自動配置できたのでここで処理終了
                            }
                        }
                    }
                    // 見つからない場合や保存済みがある場合のフォールバック（右下）
                    defHAnchor = 'right'; defHValue = 20;
                    defVAnchor = 'bottom'; defVValue = 100;
                }

                const h_anchor = s.h_anchor || defHAnchor;
                const h_value  = s.h_value ?? defHValue;
                const v_anchor = s.v_anchor || defVAnchor;
                const v_value  = s.v_value ?? defVValue;

                trigger.style.left = trigger.style.right = trigger.style.top = trigger.style.bottom = 'auto';
                if (h_anchor === 'right') trigger.style.right = `${h_value}px`; else trigger.style.left = `${h_value}px`;
                if (v_anchor === 'bottom') trigger.style.bottom = `${v_value}px`; else trigger.style.top = `${v_value}px`;
            } catch(e) { console.error('Failed to apply trigger position:', e); }
        };
        const keepTriggerInViewport = () => {
            const rect = trigger.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;

            const winW = window.innerWidth, winH = window.innerHeight, m = 6;
            let x = rect.left, y = rect.top;
            if (x < m) x = m; if (y < m) y = m;
            if (x + rect.width > winW - m) x = winW - rect.width - m;
            if (y + rect.height > winH - m) y = winH - rect.height - m;

            // 補正が必要な場合のみスタイルを上書きする
            if (Math.round(x) !== Math.round(rect.left) || Math.round(y) !== Math.round(rect.top)) {
                trigger.style.left = `${x}px`; trigger.style.top = `${y}px`;
                trigger.style.right = 'auto'; trigger.style.bottom = 'auto';
                saveTriggerRelativeState();
            }
        };
        const setupTriggerDrag = () => {
            const DRAG_THRESHOLD = 4;
            let isPointerDown = false, isDragging = false, start = {x:0,y:0,left:0,top:0}, suppressClick=false;
            const onPointerDown = (e) => {
                if (e.button !== 0) return;
                isPointerDown = true; isDragging = false; suppressClick=false;
                const rect = trigger.getBoundingClientRect();
                start = { x:e.clientX, y:e.clientY, left:rect.left, top:rect.top };
                try{ trigger.setPointerCapture(e.pointerId);}catch(_){}
            };
            const onPointerMove = (e) => {
                if (!isPointerDown) return;
                const dx = e.clientX - start.x, dy = e.clientY - start.y;
                if (!isDragging) {
                    if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
                    isDragging = true;
                    trigger.style.right = 'auto'; trigger.style.bottom = 'auto';
                    trigger.style.left = `${start.left}px`; trigger.style.top = `${start.top}px`;
                    document.body.classList.add('adv-dragging');
                }
                const winW = window.innerWidth, winH = window.innerHeight;
                const w = trigger.offsetWidth, h = trigger.offsetHeight;
                let nx = start.left + dx, ny = start.top + dy;
                nx = Math.max(0, Math.min(nx, winW - w)); ny = Math.max(0, Math.min(ny, winH - h));
                trigger.style.left = `${nx}px`; trigger.style.top = `${ny}px`;
            };
            const onPointerUp = (e) => {
                if (!isPointerDown) return; isPointerDown = false;
                try{ trigger.releasePointerCapture(e.pointerId);}catch(_){}
                if (isDragging) {
                    isDragging = false; document.body.classList.remove('adv-dragging');
                    suppressClick = true; setTimeout(()=>{suppressClick=false;},150);
                    saveTriggerRelativeState();
                }
            };
            trigger.addEventListener('click', (e)=> {
                if (suppressClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    suppressClick = false;
                    return;
                }
            }, true);
            trigger.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        };

        applyTriggerStoredPosition();
        requestAnimationFrame(keepTriggerInViewport);
        setupTriggerDrag();

        const readScopesFromControls = () => ({ pf: accountScopeSel.value === 'following', lf: locationScopeSel.value === 'nearby' });
        const applyScopesToControls = ({pf=false, lf=false}) => {
            accountScopeSel.value = pf ? 'following' : '';
            locationScopeSel.value = lf ? 'nearby' : '';
        };
        const readScopesFromURL = (urlStr) => {
            try {
                const u = new URL(urlStr || location.href, location.origin);
                const pf = (u.searchParams.get('pf') || '') === 'on';
                const lf = (u.searchParams.get('lf') || '') === 'on';
                return { pf, lf };
            } catch { return { pf:false, lf:false }; }
        };

        const STATE_SYNC = {
            parseFromSearchToModal: () => {
                if (isUpdating || modal.style.display === 'none') return;
                // ▼ 複数形に変更し、最初の要素を取得
                const inputs = getActiveSearchInputs();
                const si = inputs[0]; // 複数のうち最初のを代表として読み込む
                parseQueryAndApplyToModal(si ? si.value : '');
                applyScopesToControls(readScopesFromURL());
                updateSaveButtonState();
            }
        };

        const buildQueryStringFromModal = () => {
            const q = [];
            const fields = {
                all: document.getElementById('adv-all-words').value.trim(),
                exact: document.getElementById('adv-exact-phrase').value.trim(),
                any: document.getElementById('adv-any-words').value.trim(),
                not: document.getElementById('adv-not-words').value.trim(),
                hash: document.getElementById('adv-hashtag').value.trim(),
                lang: document.getElementById('adv-lang').value,
                replies: document.getElementById('adv-replies').value,
                min_replies: document.getElementById('adv-min-replies').value,
                min_faves: document.getElementById('adv-min-faves').value,
                min_retweets: document.getElementById('adv-min-retweets').value,
                since: document.getElementById('adv-since').value,
                until: document.getElementById('adv-until').value,
            };
            if (fields.all) q.push(fields.all);
            if (fields.exact) q.push(`"${fields.exact.replace(/"/g,'')}"`);

            // 引用で 1 語として扱い、OR 連結を生成
            if (fields.any) {
              const tokens = tokenizeQuotedWords(fields.any).map(t => {
                // 既に "…": そのまま。未引用で空白を含む → 引用を付ける
                if (/^".*"$/.test(t)) return t;
                if (/\s/.test(t)) return `"${t.replace(/"/g,'')}"`;
                return t;
              });
              if (tokens.length) q.push(`(${tokens.join(' OR ')})`);
            }

            if (fields.not) q.push(...fields.not.split(/\s+/).filter(Boolean).map(w=>`-${w}`));
            if (fields.hash) q.push(...fields.hash.split(/\s+/).filter(Boolean).map(h=>`#${h.replace(/^#/,'')}`));
            if (fields.lang) q.push(`lang:${fields.lang}`);

            const createAccountQuery = (inputId, operator) => {
                const value = document.getElementById(inputId).value.trim();
                if (!value) return null;
                const isExclude = document.getElementById(`${inputId}-exclude`).checked;
                const terms = value.split(/\s+/).filter(Boolean);
                if (isExclude) return terms.map(t=>`-${operator}${t.replace(/^@/,'')}`).join(' ');
                const processed = terms.map(t=>`${operator}${t.replace(/^@/,'')}`);
                return processed.length>1 ? `(${processed.join(' OR ')})` : processed[0];
            };
            const fromQ = createAccountQuery('adv-from-user','from:'); if (fromQ) q.push(fromQ);
            const toQ = createAccountQuery('adv-to-user','to:'); if (toQ) q.push(toQ);
            const mentionQ = createAccountQuery('adv-mentioning','@'); if (mentionQ) q.push(mentionQ);

            if (fields.min_replies) q.push(`min_replies:${fields.min_replies}`);
            if (fields.min_faves) q.push(`min_faves:${fields.min_faves}`);
            if (fields.min_retweets) q.push(`min_retweets:${fields.min_retweets}`);
            if (fields.since) q.push(`since:${fields.since}`);
            if (fields.until) q.push(`until:${fields.until}`);

            const addFilter = (type, mapping) => {
                const include = document.getElementById(`adv-filter-${type}-include`).checked;
                const exclude = document.getElementById(`adv-filter-${type}-exclude`).checked;
                if (include) q.push(mapping);
                if (exclude) q.push(`-${mapping}`);
            };
            addFilter('verified','is:verified');
            addFilter('links','filter:links');
            addFilter('images','filter:images');
            addFilter('videos','filter:videos');

            if (fields.replies) {
                const replyMap = { include:'include:replies', only:'filter:replies', exclude:'-filter:replies' };
                if (replyMap[fields.replies]) q.push(replyMap[fields.replies]);
            }
            return q.join(' ');
        };

        const parseQueryAndApplyToModal = (query) => {
            if (isUpdating) return; isUpdating = true;
            const formEl = document.getElementById('advanced-search-form');
            formEl.reset();
            // フォームリセット時に disabled を解除
            ['verified', 'links', 'images', 'videos'].forEach(groupName => {
                const includeEl = document.getElementById(`adv-filter-${groupName}-include`);
                const excludeEl = document.getElementById(`adv-filter-${groupName}-exclude`);
                if (includeEl) includeEl.disabled = false;
                if (excludeEl) excludeEl.disabled = false;
            });
            try {
              const st = loadExcludeFlags();
              const nameEl   = document.getElementById('adv-exclude-hit-name');
              const handleEl = document.getElementById('adv-exclude-hit-handle');
              const repostsEl = document.getElementById('adv-filter-reposts-exclude');
              const hashtagsEl = document.getElementById('adv-filter-hashtags-exclude');
              if (nameEl)   { nameEl.checked = nameEl.defaultChecked = !!st.name; }
              if (handleEl) { handleEl.checked = handleEl.defaultChecked = !!st.handle; }
              if (repostsEl) { repostsEl.checked = repostsEl.defaultChecked = !!st.reposts; }
              if (hashtagsEl) { hashtagsEl.checked = hashtagsEl.defaultChecked = !!st.hashtags; }
            } catch (_) {}

            // クエリを正規化（スマート引用・%xx・空白）
            const rawNorm = normalizeForParse(query || '');

            // トップレベル OR を先に見る（純粋 OR / ハイブリッド OR の切り分け）
            const orParts = splitTopLevelOR(rawNorm);
            if (orParts && isPureORQuery(rawNorm)) {
              // 引用を 1 語として数えるトークナイザ
              const tokenize = (s) => tokenizeQuotedWords(s).filter(Boolean);
              const tokenized = orParts.map(p => tokenize(p));

              const allAreSingle = tokenized.every(ts => ts.length === 1);
              if (allAreSingle) {
                // ① 純粋 OR：全部 any に入れる（exact/all は空）→ 早期 return
                document.getElementById('adv-any-words').value = orParts.join(' ');
                isUpdating = false;
                return;
              }

              const head = tokenized[0];
              const rest = tokenized.slice(1);
              const restAllSingle = rest.every(ts => ts.length === 1);

              if (head.length >= 2 && restAllSingle) {
                // ② ハイブリッド OR：
                //    - 先頭片の「最後のトークン」→ OR 集合
                //    - 先頭片の「それ以外」      → all（必須語）
                //    - 後続片（単一トークン）   → OR 集合
                const required = head.slice(0, -1);
                const orTokens = [head[head.length - 1], ...rest.map(ts => ts[0])];

                document.getElementById('adv-all-words').value = required.join(' ');
                document.getElementById('adv-any-words').value = orTokens.join(' ');
                // exact は空のまま（引用は any 側へ）
                isUpdating = false;
                return;
              }
              // それ以外（レア）は通常パースにフォールバック
            }

            // ここから通常パース（rawNorm をベース）
            let q = ` ${rawNorm} `;

            // 言語や演算子は先に抜く（引用の前後どちらでもOKだが、先にやると視覚的に期待通り）
            const extract = (regex, cb) => {
              let m;
              while ((m = regex.exec(q)) !== null) {
                cb(m[1].trim());
                q = q.replace(m[0], ' ');
                regex.lastIndex = 0;
              }
            };

            // 言語
            extract(/\blang:([^\s()"]+)/gi, v => { document.getElementById('adv-lang').value = v.toLowerCase(); });

            // ハッシュタグ
            extract(/\s#([^\s)"]+)/g, v => {
              const el = document.getElementById('adv-hashtag');
              el.value = (el.value + ' ' + v).trim();
            });

            // 最小エンゲージメント・期間
            extract(/\bmin_replies:(\d+)\b/gi, v => document.getElementById('adv-min-replies').value = v);
            extract(/\bmin_faves:(\d+)\b/gi,   v => document.getElementById('adv-min-faves').value   = v);
            extract(/\bmin_retweets:(\d+)\b/gi,v => document.getElementById('adv-min-retweets').value= v);
            extract(/\bsince:(\d{4}-\d{2}-\d{2})\b/gi, v => document.getElementById('adv-since').value = v);
            extract(/\buntil:(\d{4}-\d{2}-\d{2})\b/gi, v => document.getElementById('adv-until').value = v);

            // フィルタ
            const filterMap = { 'is:verified':'verified', 'filter:links':'links', 'filter:images':'images', 'filter:videos':'videos' };
            Object.entries(filterMap).forEach(([op,id])=>{
              const r = new RegExp(`\\s(-?)${op.replace(':','\\:')}\\b`, 'gi');
              q = q.replace(r, (m, neg) => {
                document.getElementById(`adv-filter-${id}-${neg ? 'exclude' : 'include'}`).checked = true;
                return ' ';
              });
            });

            // 返信
            if (/\binclude:replies\b/i.test(q)) { document.getElementById('adv-replies').value='include'; q=q.replace(/\binclude:replies\b/ig,' '); }
            else if (/\bfilter:replies\b/i.test(q)) { document.getElementById('adv-replies').value='only'; q=q.replace(/\bfilter:replies\b/ig,' '); }
            else if (/\b-filter:replies\b/i.test(q)) { document.getElementById('adv-replies').value='exclude'; q=q.replace(/\b-filter:replies\b/ig,' '); }

            // アカウント演算子
            const parseAccountField = (inputId, operator) => {
              const exclOp = `-${operator}`;
              const values = [];
              // 除外
              const reEx = new RegExp(`\\s${exclOp.replace(/[-:]/g,'\\$&')}([^\\s()"]+)`, 'gi');
              q = q.replace(reEx, (m, u) => { values.push(u); document.getElementById(`${inputId}-exclude`).checked = true; return ' '; });
              // 包含（括弧 OR グループ）
              const reGroup = new RegExp(`\\((?:${operator.replace(':','\\:')}([^\\s()"]+))(?:\\s+OR\\s+${operator.replace(':','\\:')}([^\\s()"]+))*\\)`, 'gi');
              q = q.replace(reGroup, (m) => {
                m.replace(new RegExp(`${operator.replace(':','\\:')}([^\\s()"]+)`, 'gi'), (_m, u) => { values.push(u); return _m; });
                return ' ';
              });
              // 単体
              const reIn = new RegExp(`\\s(?!-)${operator.replace(':','\\:')}([^\\s()"]+)`, 'gi');
              q = q.replace(reIn, (m, u) => { values.push(u); return ' '; });
              if (values.length) document.getElementById(inputId).value = [...new Set(values)].join(' ');
            };
            parseAccountField('adv-from-user','from:');
            parseAccountField('adv-to-user','to:');
            parseAccountField('adv-mentioning','@');

            // ▼ 括弧内 OR は any へ（**先にやる**。引用は壊さない、グループ丸ごと除去）
            {
              const groups = q.match(/\((?:[^()"]+|"[^"]*")+\)/g); // 引用対応の簡易版
              if (groups) {
                const tokens = groups
                  .map(g => g.slice(1, -1))                      // (...) → 中身
                  .flatMap(s => s.split(/\s+OR\s+/i))
                  .map(s => s.trim())
                  .filter(Boolean);
                if (tokens.length) {
                  const el = document.getElementById('adv-any-words');
                  el.value = (el.value ? el.value + ' ' : '') + tokens.join(' ');
                }
                // グループは丸ごと削る：以後の引用抽出に巻き込ませない
                q = q.replace(/\((?:[^()"]+|"[^"]*")+\)/g, ' ');
              }
            }

            // ▼ 引用フレーズ（括弧の外だけが残っている）。exact は最初の1件のみ
            {
              let exactSet = false;
              q = q.replace(/"([^"]+)"/g, (_m, p1) => {
                if (!exactSet) {
                  document.getElementById('adv-exact-phrase').value = p1.trim();
                  exactSet = true;
                }
                return ' ';
              });
            }

            // 除外語
            const nots = (q.match(/\s-\S+/g) || []).map(w => w.trim().slice(1));
            if (nots.length) document.getElementById('adv-not-words').value = nots.join(' ');
            q = q.replace(/\s-\S+/g,' ');

            document.getElementById('adv-all-words').value =
              q.trim().split(/\s+/).filter(Boolean).join(' ');

            // フィルタ適用後に disabled 状態を再評価
            ['verified', 'links', 'images', 'videos'].forEach(groupName => {
                const includeEl = document.getElementById(`adv-filter-${groupName}-include`);
                const excludeEl = document.getElementById(`adv-filter-${groupName}-exclude`);
                if (!includeEl || !excludeEl) return;
                if (includeEl.checked) excludeEl.disabled = true;
                if (excludeEl.checked) includeEl.disabled = true;
            });

            isUpdating = false;
        };

        const syncFromModalToSearchBox = () => {
            if (isUpdating) return; isUpdating=true;
            const finalQuery = buildQueryStringFromModal();
            // ▼ 複数形に変更し、ループ処理
            const inputs = getActiveSearchInputs();
            if (inputs.length > 0) {
                inputs.forEach(si => {
                    if (si) { syncControlledInput(si, finalQuery); }
                });
            }
            isUpdating=false;
            updateSaveButtonState();
        };
        const syncFromSearchBoxToModal = STATE_SYNC.parseFromSearchToModal;

        const showToast = (msg) => {
            toastEl.textContent = msg;
            toastEl.classList.add('show');
            setTimeout(()=> toastEl.classList.remove('show'), 1500);
        };

        function openSettingsModal() {
          if (!settingsModal) return;
          settingsModal.style.display = 'flex';

          // UI言語の読み込み
          try {
            const override = kv.get(LANG_OVERRIDE_KEY, '');
            if (settingsLangSel) settingsLangSel.value = override || '';
          } catch (_) {}

          try {
            const initTab = kv.get(INITIAL_TAB_KEY, 'last');
            if (settingsInitialTabSel) settingsInitialTabSel.value = initTab;
          } catch (_) {}

          // タブ表示設定の読み込みと設定
          try {
            const visibility = loadTabsVisibility();
            DEFAULT_TABS.forEach(tabName => {
              const toggle = document.getElementById(`adv-settings-tab-toggle-${tabName}`);
              if (!toggle) return;

              // 状態を同期 (search は disabled checked になっているので loadTabsVisibility に追従)
              toggle.checked = visibility[tabName] !== false;

              // 多重登録を防止
              if (toggle.dataset.listenerAttached) return;
              toggle.dataset.listenerAttached = 'true';

              toggle.addEventListener('change', () => {
                const currentState = loadTabsVisibility();
                currentState[tabName] = toggle.checked;
                saveTabsVisibility(currentState);
                // 即座にタブバーに反映
                applyTabsVisibility();
              });
            });
          } catch (e) {
            console.error('[AdvSearch] Failed to setup Tab Toggles:', e);
          }

          try {
            const dialog = settingsModal.querySelector('.adv-settings-dialog');
            themeManager.applyTheme(dialog, trigger);
          } catch (_) {}
        }

        function closeSettingsModal() {
          if (!settingsModal) return;
          settingsModal.style.display = 'none';
        }

        if (settingsOpenBtn) {
          settingsOpenBtn.addEventListener('click', (e)=>{
            e.stopPropagation();
            openSettingsModal();
          });
        }
        if (settingsCloseBtn) {
          settingsCloseBtn.addEventListener('click', (e)=>{
            e.stopPropagation();
            closeSettingsModal();
          });
        }
        if (settingsCloseFooterBtn) {
          settingsCloseFooterBtn.addEventListener('click', (e)=>{
            e.stopPropagation();
            closeSettingsModal();
          });
        }
        if (settingsModal) {
          settingsModal.addEventListener('click', (e)=>{
            if (e.target === settingsModal) {
              closeSettingsModal();
            }
          });
        }

        if (settingsExportBtn) {
          settingsExportBtn.addEventListener('click', () => {
            const json = buildSettingsExportJSON();
            try {
              const blob = new Blob([json], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');

              const now = new Date();
              const pad = (n) => String(n).padStart(2, '0');
              const fname =
                `advanced-search-for-x-twitter-backup-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}` +
                `-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}.json`;

              a.href = url;
              a.download = fname;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            } catch (_) {
              // 失敗しても、とりあえずトーストだけは出す
            }
            showToast(i18n.t('toastExported'));
          });
        }

        if (settingsImportBtn && settingsFileInput) {
          let importResetTimer = null;

          settingsImportBtn.addEventListener('click', () => {
            settingsFileInput.click();
          });

          settingsFileInput.addEventListener('change', () => {
            const file = settingsFileInput.files && settingsFileInput.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
              let ok = false;
              try {
                ok = applySettingsImportJSON(String(reader.result || ''));
              } finally {
                // 同じファイルを続けて選べるようにリセット
                settingsFileInput.value = '';
              }

              if (ok && settingsImportBtn) {
                const successLabel = i18n.t('buttonImportSuccess');
                const normalLabel  = i18n.t('buttonImport');

                settingsImportBtn.textContent = successLabel;
                settingsImportBtn.disabled = true;

                if (importResetTimer) clearTimeout(importResetTimer);
                importResetTimer = setTimeout(() => {
                  settingsImportBtn.disabled = false;
                  settingsImportBtn.textContent = normalLabel;
                }, 2000);
              }
            };
            reader.readAsText(file);
          });
        }

        if (settingsResetBtn) {
          settingsResetBtn.addEventListener('click', () => {
            if (!confirm(i18n.t('confirmResetAll'))) return;

            const KEYS_TO_DELETE = [
              MODAL_STATE_KEY,
              TRIGGER_STATE_KEY,
              HISTORY_KEY,
              INITIAL_TAB_KEY,
              SAVED_KEY,
              SECRET_KEY,
              MUTE_KEY,
              MUTE_MASTER_KEY,
              MUTE_MODE_KEY,
              LAST_TAB_KEY,
              TABS_ORDER_KEY,
              TABS_VISIBILITY_KEY,
              LANG_OVERRIDE_KEY,
              HISTORY_SORT_KEY,
              FAV_SORT_KEY,
              EXC_NAME_KEY,
              EXC_HANDLE_KEY,
              EXC_REPOSTS_KEY,
              EXC_HASHTAGS_KEY,
              NATIVE_SEARCH_WIDTH_KEY,
              FAV_KEY,
              ...Object.values(UNASSIGNED_IDX_KEYS), // 定数を使用
              ...Object.values(ZOOM_KEYS),
              FT_STATE_KEY,
              DELETED_LOG_KEY,
              SYNC_CFG_KEY,
              SYNC_ENABLED_KEY,
              DATA_REVISION_KEY,
              DIRTY_KEY
            ];

            KEYS_TO_DELETE.forEach(k => {
              try { kv.del(k); } catch (_) {}
            });

            // 各種配列系は空配列で上書き
            try { saveMuted([]); } catch (_) {}
            try { saveJSON(HISTORY_KEY, []); } catch (_) {}
            try { saveJSON(SAVED_KEY, []); } catch (_) {}
            try { saveFavorites([]); } catch (_) {}
            try { saveAccounts([]); } catch (_) {}
            try { saveLists([]); } catch (_) {}
            try { saveFolders(ACCOUNTS_FOLDERS_KEY, []); } catch (_) {}
            try { saveFolders(LISTS_FOLDERS_KEY, []); } catch (_) {}
            try { saveFolders(SAVED_FOLDERS_KEY, []); } catch (_) {}

            /* --- Favorite Tags Data --- */
            try {
              if (typeof ft_createDefaultState === 'function' && typeof ft_saveState === 'function') {
                const defaultBmState = ft_createDefaultState();
                // saveState は内部で saveJSON を呼ぶ
                ft_saveState(defaultBmState);
                if (typeof ft_state !== 'undefined' && ft_state !== null) {
                  // グローバル変数もリセット
                  Object.assign(ft_state, defaultBmState);
                }
              }
            } catch (_) {}

            // ズームキャッシュとパースキャッシュもリセット
            try {
              Object.keys(zoomByTab).forEach(tab => {
                zoomByTab[tab] = (tab === 'search') ? 0.87 : 1.0;
              });
            } catch (_) {}
            __cachedSearchTokens = null;
            __cachedSearchQuery = null;

            // 言語設定を再適用（オーバーライドがなければ自動検出）
            try {
              const override = kv.get(LANG_OVERRIDE_KEY, '');
              if (override && i18n.translations[override]) {
                i18n.lang = override;
              } else {
                i18n.init();
              }
            } catch (_) {
              i18n.init();
            }

            try {
              i18n.apply(document.getElementById('advanced-search-modal'));
              i18n.apply(document.getElementById('adv-settings-modal'));
            } catch (_) {}

            // UI 状態を初期化
            try {
              // タブの表示状態をリセット
              applyTabsVisibility();
              // 最後のタブを 'search' にリセット
              activateTab('search');

              parseQueryAndApplyToModal('');
              applyScopesToControls({ pf: false, lf: false });
              applySecretBtn();
              renderHistory();
              renderSaved();
              renderLists();
              renderAccounts();
              renderMuted();
              // ミュートモードの選択状態をUIに反映
              if (muteModeSel) {
                  muteModeSel.value = loadMuteMode();
              }
              updateSaveButtonState();
              rescanAllTweetsForFilter();

              /* --- Favorite Tags UI Refresh --- */
              try {
                if (typeof ft_refreshAllTagChips === 'function') ft_refreshAllTagChips();
              } catch (_) {}

            } catch (_) {}

            // モーダル位置・サイズをデフォルトに近い状態へ戻す
            try {
              modal.style.width = '';
              modal.style.height = '';
              modal.style.left = '';
              modal.style.right = '';
              modal.style.top = '';
              modal.style.bottom = '';
              loadModalState();
              requestAnimationFrame(keepModalInViewport);
            } catch (_) {}

            // トリガーボタンの位置もリセット
            try {
              trigger.style.left = '';
              trigger.style.right = '';
              trigger.style.top = '';
              trigger.style.bottom = '';
              applyTriggerStoredPosition();
              keepTriggerInViewport();
            } catch (_) {}

            // SyncManagerのメモリ状態もリセット
            if (typeof syncManager !== 'undefined') {
                syncManager.endpoint = '';
                syncManager.secret = '';
                syncManager.syncId = '';
                syncManager.encryptionKey = null;
                syncManager.signingKey = null;
                // UIの入力欄もクリア
                if (syncEpInput) syncEpInput.value = '';
                if (syncIdInput) syncIdInput.value = '';
                if (syncScInput) syncScInput.value = '';
                if (typeof syncManager.updateStatus === 'function') syncManager.updateStatus('Reset');
            }

            // ▼▼▼ 設定モーダルのUI表示を強制的に初期値に戻す ▼▼▼

            // 1. 言語設定リセット
            if (settingsLangSel) settingsLangSel.value = '';

            // 2. 初期タブ設定リセット
            if (settingsInitialTabSel) settingsInitialTabSel.value = 'last';

            // 3. タブ表示トグルのリセット（すべてONに戻す）
            if (typeof DEFAULT_TABS !== 'undefined') {
                DEFAULT_TABS.forEach(tabName => {
                    const toggle = document.getElementById(`adv-settings-tab-toggle-${tabName}`);
                    if (toggle) toggle.checked = true;
                });
            }

            // 4. クラウド同期設定のリセット（入力欄クリア & トグルOFF）
            if (syncEnableToggle) {
                syncEnableToggle.checked = false;
                if (syncContainer) syncContainer.style.display = 'none';
            }
            if (typeof syncEpInput !== 'undefined') syncEpInput.value = '';
            if (typeof syncIdInput !== 'undefined') syncIdInput.value = '';
            if (typeof syncScInput !== 'undefined') syncScInput.value = '';

            // 5. ヘッダーの同期アイコンを消す
            if (typeof updateHeaderSyncVisibility === 'function') {
                updateHeaderSyncVisibility();
            }

            showToast(i18n.t('toastReset'));
          });
        }

        if (settingsLangSel) {
          settingsLangSel.addEventListener('change', ()=>{
            const v = settingsLangSel.value;
            try { kv.set(LANG_OVERRIDE_KEY, v || ''); } catch (_) {}
            if (v && i18n.translations[v]) {
              i18n.lang = v;
            } else {
              i18n.init();
              try {
                const override = kv.get(LANG_OVERRIDE_KEY, '');
                if (override && i18n.translations[override]) i18n.lang = override;
              } catch (_) {}
            }

            try {
              i18n.apply(document.getElementById('advanced-search-modal'));
              i18n.apply(document.getElementById('adv-settings-modal'));
            } catch (_) {}

            trigger.setAttribute('aria-label', i18n.t('tooltipTrigger'));
            historyClearAllBtn.textContent = i18n.t('historyClearAll');
            applySecretBtn();

            try { renderHistory(); } catch (_) {}
            try { renderSaved(); } catch (_) {}
            try { renderLists(); } catch (_) {}
            try { renderAccounts(); } catch (_) {}
            try { renderMuted(); } catch (_) {}
            try { renderFavorites(); } catch (_) {}
          });
        }

        if (settingsInitialTabSel) {
            settingsInitialTabSel.addEventListener('change', () => {
                kv.set(INITIAL_TAB_KEY, settingsInitialTabSel.value);
            });
        }

        const loadSecret = () => { try { return kv.get(SECRET_KEY, '0') === '1'; } catch(_) { return false; } };
        const saveSecret = (on) => { try { kv.set(SECRET_KEY, on ? '1' : '0'); } catch(_) {} };
        const applySecretBtn = () => {
            const on = loadSecret();
            secretBtn.classList.toggle('on', on);
            secretBtn.classList.toggle('off', !on);
            secretBtn.title = i18n.t(on ? 'secretOn' : 'secretOff');
            secretStateEl.textContent = on ? 'ON' : 'OFF';
        };
        secretBtn.addEventListener('click', (e)=>{
            e.stopPropagation();
            const on = !loadSecret();
            saveSecret(on);
            applySecretBtn();
            showToast(i18n.t(on ? 'secretOn' : 'secretOff'));
        });
        applySecretBtn();

        const migrateList = (list) => Array.isArray(list) ? list.map(it => ({ id:it.id||uid(), q:it.q||'', ts:it.ts||Date.now(), pf:!!it.pf, lf:!!it.lf })) : [];

        const recordHistory = (q, pf, lf) => {
            if (!q || loadSecret()) return;
            const now = Date.now();
            if (lastHistory.q === q && lastHistory.pf === pf && lastHistory.lf === lf && (now - lastHistory.ts) < 3000) return;
            lastHistory.q = q; lastHistory.pf = pf; lastHistory.lf = lf; lastHistory.ts = now;

            const listRaw = loadJSON(HISTORY_KEY, []);
            const list = migrateList(listRaw);
            const idx = list.findIndex(it => it.q === q && !!it.pf === !!pf && !!it.lf === !!lf);
            if (idx === 0) {
                list[0].ts = now;
            } else if (idx > 0) {
                const [item] = list.splice(idx, 1);
                item.ts = now;
                list.unshift(item);
            } else {
                list.unshift({ id: uid(), q, pf: !!pf, lf: !!lf, ts: now });
                // if (list.length > 50) list.length = 50;
            }
            saveJSON(HISTORY_KEY, list);
            renderHistory();
        };

        const deleteHistory = (id) => {
            markAsDeleted(id);
            const listRaw = loadJSON(HISTORY_KEY, []);
            const list = migrateList(listRaw);
            const next = list.filter(it => it.id !== id);
            saveJSON(HISTORY_KEY, next);
            renderHistory();
            showToast(i18n.t('toastDeleted'));
        };

        const clearAllHistory = () => {
            if (!confirm(i18n.t('confirmClearHistory'))) return;
            saveJSON(HISTORY_KEY, []);
            renderHistory();
            showToast(i18n.t('toastDeleted'));
        };

        const addSaved = (q, pf, lf) => {
            const listRaw = loadJSON(SAVED_KEY, []);
            const list = migrateList(listRaw);
            if (list.some(it => it.q === q && !!it.pf === !!pf && !!it.lf === !!lf)) {
                updateSaveButtonState();
                return;
            }
            const item = { id: uid(), q, pf: !!pf, lf: !!lf, ts: Date.now() };
            list.push(item);
            saveJSON(SAVED_KEY, list);
            renderSaved();
            showToast(i18n.t('toastSaved'));
            updateSaveButtonState();
        };

        const deleteSaved = (id) => {
            markAsDeleted(id);
            const listRaw = loadJSON(SAVED_KEY, []);
            const list = migrateList(listRaw);
            const next = list.filter(it => it.id !== id);
            saveJSON(SAVED_KEY, next);
            renderSaved();
            showToast(i18n.t('toastDeleted'));
            updateSaveButtonState();
        };

        const fmtTime = (ts) => { try { return new Date(ts).toLocaleString(); } catch { return ''; } };

        const updateSaveButtonState = () => {
            const q = buildQueryStringFromModal().trim();
            const {pf, lf} = readScopesFromControls();
            const saved = migrateList(loadJSON(SAVED_KEY, []));
            const exists = !!q && saved.some(it => it.q === q && !!it.pf === !!pf && !!it.lf === !!lf);
            saveButton.disabled = !q || exists;
            saveButton.textContent = i18n.t(exists ? 'buttonSaved' : 'buttonSave');
            saveButton.setAttribute('aria-disabled', saveButton.disabled ? 'true' : 'false');
        };



        // タブのクリックイベントとD&Dイベントリスナーをセットアップ
        (function setupTabDragAndDrop() {
            const tabsContainer = document.querySelector('.adv-tabs');
            if (!tabsContainer) return;

            tabButtons.forEach(btn => {
                // 1. クリックイベント（既存のロジック）
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    activateTab(btn.dataset.tab);
                });

                // 2. D&Dイベント（新規）
                btn.draggable = true;

                btn.addEventListener('dragstart', (ev) => {
                    btn.classList.add('dragging');
                    ev.dataTransfer.setData('text/plain', btn.dataset.tab);
                    ev.dataTransfer.effectAllowed = 'move';
                });

                btn.addEventListener('dragend', () => {
                    btn.classList.remove('dragging');
                });
            });

            tabsContainer.addEventListener('dragover', (ev) => {
                ev.preventDefault();
                const dragging = tabsContainer.querySelector('.adv-tab-btn.dragging');
                if (!dragging) return;

                // 水平方向の挿入位置を計算
                const after = getDragAfterElementHorizontal(tabsContainer, ev.clientX, '.adv-tab-btn');
                if (after == null) {
                    tabsContainer.appendChild(dragging);
                } else {
                    tabsContainer.insertBefore(dragging, after);
                }
            });

            tabsContainer.addEventListener('drop', (ev) => {
                ev.preventDefault();
                const dragging = tabsContainer.querySelector('.adv-tab-btn.dragging');
                if (dragging) {
                    dragging.classList.remove('dragging');
                }

                // 最終的な順序をDOMから読み取って保存
                const newOrder = [...tabsContainer.querySelectorAll('.adv-tab-btn[data-tab]')]
                    .map(btn => btn.dataset.tab)
                    .filter(Boolean);

                saveJSON(TABS_ORDER_KEY, newOrder);
                // tabButtons 配列も更新
                tabButtons.splice(0, tabButtons.length, ...Array.from(document.querySelectorAll('.adv-tab-btn')));
                showToast(i18n.t('toastReordered'));
            });
        })();

        const scopeChipsHTML = (pf, lf) => {
            const chips = [];
            if (pf) chips.push(`<span class="adv-chip scope" role="note">${i18n.t('chipFollowing')}</span>`);
            if (lf) chips.push(`<span class="adv-chip scope" role="note">${i18n.t('chipNearby')}</span>`);
            return chips.join('');
        };

        const historyEmptyEl = document.getElementById('adv-history-empty');
        const historyListEl = document.getElementById('adv-history-list');
        const historySearchEl = document.getElementById('adv-history-search');
        const historySortEl = document.getElementById('adv-history-sort');

        const renderHistory = () => {
            const listAll = migrateList(loadJSON(HISTORY_KEY, []));

            // 1. Get filter/sort values
            const q = (historySearchEl?.value || '').toLowerCase().trim();
            const sort = historySortEl?.value || kv.get(HISTORY_SORT_KEY, 'newest');
            if (historySortEl && historySortEl.value !== sort) {
                historySortEl.value = sort;
            }

            // 2. Filter
            const listFiltered = q
                ? listAll.filter(item => (item.q || '').toLowerCase().includes(q))
                : listAll;

            // 3. Sort
            const listSorted = listFiltered.sort((a, b) => {
                switch (sort) {
                    case 'oldest': return (a.ts || 0) - (b.ts || 0);
                    case 'name_asc': return (a.q || '').localeCompare(b.q || '');
                    case 'name_desc': return (b.q || '').localeCompare(a.q || '');
                    case 'newest':
                    default:
                        return (b.ts || 0) - (a.ts || 0);
                }
            });

            // 4. Render with Pagination
            const renderHistoryRow = (item) => {
                const row = document.createElement('div');
                row.className = 'adv-item';
                row.dataset.id = item.id;

                setInnerHTML(row,`
                  <div class="adv-item-main">
                    <div class="adv-item-title">${escapeHTML(item.q)}</div>
                    <div class="adv-item-sub">
                      <span>${fmtTime(item.ts)}</span>
                      ${scopeChipsHTML(!!item.pf, !!item.lf)}
                    </div>
                  </div>
                  <div class="adv-item-actions">
                    <button class="adv-chip primary" data-action="run">${i18n.t('run')}</button>
                    <button class="adv-chip danger" data-action="delete">${i18n.t('delete')}</button>
                  </div>
                `);

                row.querySelector('[data-action="run"]').addEventListener('click', () => {
                    parseQueryAndApplyToModal(item.q);
                    applyScopesToControls({ pf: !!item.pf, lf: !!item.lf });
                    executeSearch({ pf: item.pf, lf: item.lf });
                });

                row.querySelector('[data-action="delete"]').addEventListener('click', () => {
                    deleteHistory(item.id);
                });
                return row;
            };

            renderPagedList('history', historyListEl, listSorted, renderHistoryRow, historyEmptyEl, i18n.t('emptyHistory'));
        };

        historyClearAllBtn.addEventListener('click', clearAllHistory);

        // 履歴タブの検索とソートのイベントリスナー
        if (historySearchEl) {
          historySearchEl.addEventListener('input', debounce(renderHistory, 150));
        }
        if (historySortEl) {
          historySortEl.value = kv.get(HISTORY_SORT_KEY, 'newest'); // 初期値を設定
          historySortEl.addEventListener('change', () => {
            kv.set(HISTORY_SORT_KEY, historySortEl.value);
            renderHistory();
          });
        }

        const savedEmptyEl = document.getElementById('adv-saved-empty');
        const savedListEl = document.getElementById('adv-saved-list');

        const renderSaved = () => {
          ensureFolderToolbars();

          const itemsLoader = () => migrateList(loadJSON(SAVED_KEY, []));
          const itemsSaver  = (arr) => saveJSON(SAVED_KEY, migrateList(arr));

          renderFolderedCollection({
            hostId: 'adv-saved-list',
            emptyId: 'adv-saved-empty',
            filterSelectId: 'adv-saved-folder-filter',
            searchInputId:  'adv-saved-search',
            newFolderBtnId: 'adv-saved-new-folder',

            foldersKey: SAVED_FOLDERS_KEY,
            defaultFolderName: i18n.t('defaultSavedFolders'),

            loadItems: itemsLoader,
            saveItems: itemsSaver,
            renderRow: (item) => {
              // 以前の renderSavedRow と同じ見た目
              const row = document.createElement('div');
              row.className = 'adv-item';
              row.draggable = true;
              row.dataset.id = item.id;
              setInnerHTML(row,`
                <div class="adv-item-handle" title="Drag">≡</div>
                <div class="adv-item-main">
                  <div class="adv-item-title">${escapeHTML(item.q)}</div>
                  <div class="adv-item-sub">
                    <span>${fmtTime(item.ts)}</span>
                    ${scopeChipsHTML(!!item.pf, !!item.lf)}
                  </div>
                </div>
                <div class="adv-item-actions">
                  <button class="adv-chip primary" data-action="run">${i18n.t('run')}</button>
                  <button class="adv-chip danger"  data-action="delete">${i18n.t('delete')}</button>
                </div>
              `);
              row.querySelector('[data-action="run"]').addEventListener('click', ()=>{
                parseQueryAndApplyToModal(item.q);
                applyScopesToControls({pf:!!item.pf, lf:!!item.lf});
                // activateTab('search');
                executeSearch({pf:item.pf, lf:item.lf});
              });
              row.querySelector('[data-action="delete"]').addEventListener('click', ()=> deleteSaved(item.id));

              row.addEventListener('dragstart', (ev) => {
                row.classList.add('dragging');
                ev.dataTransfer.setData('text/plain', item.id);
                ev.dataTransfer.effectAllowed = 'move';
              });
              row.addEventListener('dragend', () => row.classList.remove('dragging'));
              return row;
            },

            onUnassign: unassignSaved,
            onMoveToFolder: moveSavedToFolder,

            emptyMessage: i18n.t('emptySaved'),
            unassignedIndexKey: 'advSavedUnassignedIndex_v1',
          });

          updateSaveButtonState();
        };

        const getDragAfterElement = (container, y) => {
            const els = [...container.querySelectorAll('.adv-item:not(.dragging)')];
            let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
            for (const el of els) {
                const box = el.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    closest = { offset, element: el };
                }
            }
            return closest.element;
        };

        // === セクション（フォルダ/Unassigned）用：縦方向の挿入位置計算 ===
        function getSectionAfterElement(container, y) {
          const els = [...container.querySelectorAll('.adv-folder:not(.dragging-folder), .adv-unassigned:not(.dragging-folder)')];
          let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
          for (const el of els) {
            const box = el.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
              closest = { offset, element: el };
            }
          }
          return closest.element;
        }

        // === 汎用フォルダ描画レンダラ ===
        // 各タブ（Saved/Accounts/Listsなど）の重複ロジックを1か所に集約します。
        function renderFolderedCollection(cfg) {
          const {
            // 固有ID/キー
            hostId, emptyId,
            filterSelectId, searchInputId, newFolderBtnId,
            foldersKey, defaultFolderName,
            // データI/O
            loadItems, saveItems, loadFoldersFn = loadFolders, saveFoldersFn = saveFolders,
            // Row描画/操作
            renderRow, onUnassign, onMoveToFolder,
            // 文言/保存キー
            emptyMessage,
            unassignedIndexKey, // ex: 'advAccountsUnassignedIndex_v1' / 'advSavedUnassignedIndex_v1'
          } = cfg;

          // ツールバーは呼び出し側で ensureFolderToolbars() してある前提
          const host   = document.getElementById(hostId);
          const empty  = document.getElementById(emptyId);
          const sel    = document.getElementById(filterSelectId);
          const qInput = document.getElementById(searchInputId);
          const addBtn = document.getElementById(newFolderBtnId);
          if (!host) return;

          // 1) データロード
          const items = loadItems();
          let folders = loadFoldersFn(foldersKey, defaultFolderName);
          const idToItem = Object.fromEntries(items.map(x => [x.id, x]));

          // 2) 死票掃除（フォルダの order から存在しないIDを除去）
          let needSave = false;
          for (const f of folders) {
            const before = f.order.length;
            f.order = f.order.filter(id => !!idToItem[id]);
            if (f.order.length !== before) { needSave = true; f.ts = Date.now(); }
          }
          if (needSave) saveFoldersFn(foldersKey, folders);

          // 3) 未所属セット
          const allIds    = new Set(items.map(x => x.id));
          const inFolders = new Set(folders.flatMap(f => f.order));
          const unassignedIds = [...allIds].filter(id => !inFolders.has(id));

          // 4) フィルタUI（セレクト＆検索＆新規フォルダ）
          if (sel) {
            const prev = sel.value;
            setInnerHTML(sel,'');
            const optAll = document.createElement('option'); optAll.value='__ALL__'; optAll.textContent=i18n.t('folderFilterAll'); sel.appendChild(optAll);
            const optUn  = document.createElement('option'); optUn.value='__UNASSIGNED__'; optUn.textContent=i18n.t('folderFilterUnassigned'); sel.appendChild(optUn);
            folders.forEach(f=>{
              const o = document.createElement('option'); o.value = f.id; o.textContent = f.name; sel.appendChild(o);
            });
            sel.value = [...sel.options].some(o=>o.value===prev) ? prev : '__ALL__';
            sel.onchange = () => renderFolderedCollection(cfg);
          }
          if (qInput && !qInput._advBound) {
            qInput._advBound = true;
            // debounce を適用
            qInput.addEventListener('input', debounce(() => renderFolderedCollection(cfg), 150));
          }
          if (addBtn && !addBtn._advBound) {
            addBtn._advBound = true;
            addBtn.addEventListener('click', () => {
              const nm = prompt(i18n.t('promptNewFolder'), '');
              if (!nm || !nm.trim()) return;
              const fs = loadFoldersFn(foldersKey, defaultFolderName);
              fs.push({ id: uid(), name: nm.trim(), order: [], ts: Date.now() });
              saveFoldersFn(foldersKey, fs);
              renderFolderedCollection(cfg);
            });
          }

          const filterFolder = sel?.value || '__ALL__';
          const q = (qInput?.value || '').toLowerCase().trim();

         const matchItem = (it) => {
              // JSON化せず、検索対象になりうるフィールドの値を直接結合して判定する
              // これにより、保存クエリ内の " (ダブルクォート) がエスケープされずに検索可能になる
              const targetText = [
                  it.q,       // Saved / History 用
                  it.name,    // Accounts / Lists / Folders 用
                  it.handle,  // Accounts 用
                  it.url,     // Lists 用
                  it.user?.name,   // (予備)
                  it.user?.handle  // (予備)
              ].map(val => (val || '').toString().toLowerCase()).join(' ');

              return !q || targetText.includes(q);
          };

          setInnerHTML(host,'');
          empty.textContent = items.length ? '' : (emptyMessage || '');

          // 5) Unassigned インデックス保持
          const getUnIdx = () => {
            try { const v = GM_getValue(unassignedIndexKey, 0); return Math.max(0, Math.min(folders.length, +v || 0)); }
            catch { return 0; }
          };
          const setUnIdx = (idx) => { try { GM_setValue(unassignedIndexKey, String(idx)); } catch {} };

          // 6) 表示対象フォルダ
          const foldersToDraw =
            filterFolder === '__ALL__'        ? [...folders] :
            filterFolder === '__UNASSIGNED__' ? [] :
            folders.filter(f => f.id === filterFolder);

          // 7) セクション並び（__ALL__ の場合のみ Unassigned を混在）
          const buildSectionsOrder = () => {
            if (filterFolder !== '__ALL__') return foldersToDraw.map(f => f.id);
            const idx = getUnIdx();
            const arr = foldersToDraw.map(f => f.id);
            arr.splice(Math.max(0, Math.min(arr.length, idx)), 0, '__UNASSIGNED__');
            return arr;
          };

          // 8) DOM → 順序保存
          const persistSectionsFromDOM = () => {
            const order = [...host.querySelectorAll('.adv-folder, .adv-unassigned')].map(sec => sec.dataset.folderId);

            // フォルダ順（Unassigned を除いた順序で保存）
            const newFolderOrderIds = [...new Set(order.filter(id => id !== '__UNASSIGNED__'))];
            let fs = loadFoldersFn(foldersKey, defaultFolderName);
            const map = Object.fromEntries(fs.map(f => [f.id, f]));
            const reordered = newFolderOrderIds.map(id => map[id]).filter(Boolean);
            fs.forEach(f => { if (!reordered.includes(f)) reordered.push(f); });
            saveFoldersFn(foldersKey, reordered);

            // Unassigned の位置を保存
            const unIdx = order.indexOf('__UNASSIGNED__');
            if (unIdx >= 0) setUnIdx(unIdx);

            showToast(i18n.t('toastReordered'));
          };

          // 9) Unassigned セクション
          const renderUnassignedSection = () => {
            const sec = document.createElement('section');
            sec.className = 'adv-unassigned';
            sec.dataset.folderId = '__UNASSIGNED__';
            sec.setAttribute('draggable', 'true');

            const list = document.createElement('div'); list.className = 'adv-list';

            const itemsUn = unassignedIds.map(id => idToItem[id]).filter(Boolean).filter(matchItem);
            itemsUn.forEach(it => list.appendChild(renderRow(it)));

            // セクションD&D（セクション入替）
            const SECT_MIME = 'adv/folder';
            sec.addEventListener('dragstart', (ev) => {
              const item = ev.target.closest('.adv-item');
              if (!item) {
                ev.dataTransfer.setData(SECT_MIME, '__UNASSIGNED__');
                ev.dataTransfer.effectAllowed = 'move';
                sec.classList.add('dragging-folder');
              }
            });
            sec.addEventListener('dragend', () => sec.classList.remove('dragging-folder'));
            sec.addEventListener('dragover', (ev) => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) {
                ev.preventDefault();
                const dragging = host.querySelector('.dragging-folder');
                if (!dragging || dragging === sec) return;
                const after = getSectionAfterElement(host, ev.clientY);
                if (after == null) host.appendChild(dragging);
                else host.insertBefore(dragging, after);
              }
            });

            // アイテムのプレビュー移動（DOM）
            list.addEventListener('dragover', ev => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return; // セクションD&Dは無視
              ev.preventDefault(); ev.stopPropagation();
              /* ▼▼▼ ここでフォルダーや背景のハイライトを強制的に消す ▼▼▼ */
              document.querySelectorAll('.adv-folder[data-drop="1"]').forEach(el => delete el.dataset.drop);
              document.querySelectorAll('.adv-bg-drop-active').forEach(el => el.classList.remove('adv-bg-drop-active'));
              const dragging = document.querySelector('.adv-item.dragging');
              if (!dragging) return;
              const after = getDragAfterElement(list, ev.clientY);
              if (after == null) list.appendChild(dragging);
              else list.insertBefore(dragging, after);
            });

            // ▼「未分類化」ハンドラ（セクション背景用）
            // フォルダからドロップされた場合に "先頭に移動" させる。
            const dropToUnassign = (ev) => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return;
              ev.preventDefault(); ev.stopPropagation();
              const draggedId = ev.dataTransfer.getData('text/plain');
              if (draggedId) onUnassign(draggedId); // onUnassign は "先頭に移動" する
            };

            // ▼「未分類アイテムの並び替え」ハンドラ（リスト本体用）
            // 未分類リスト内での並び替え、またはフォルダから特定位置へのドロップ。
            const dropToReorderUnassigned = (ev) => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return;
              ev.preventDefault(); ev.stopPropagation();
              const draggedId = ev.dataTransfer.getData('text/plain');
              if (!draggedId) return;

              // 1. DOMの視覚的な順序（dragoverで変更済み）をID配列として読み取る
              const newOrderIdsInList = [...list.querySelectorAll('.adv-item')].map(el => el.dataset.id);

              // 2. マスターリスト（全アイテム）とフォルダ内アイテムの情報をロード
              const allItems = loadItems();
              const allItemsMap = new Map(allItems.map(it => [it.id, it]));
              const allFolderItems = new Set(folders.flatMap(f => f.order));

              // 3. 新しいマスターリストを構築
              const nextMasterList = [];
              const seen = new Set();

              // 3a. まず、DOMから読み取った「未分類の新しい順序」でアイテムを追加
              for (const id of newOrderIdsInList) {
                // このリストにあるべきアイテム（＝マスターに存在し、フォルダに属さない）のみ
                if (id && allItemsMap.has(id) && !allFolderItems.has(id)) {
                  nextMasterList.push(allItemsMap.get(id));
                  seen.add(id);
                }
              }

              // 3b. 次に、残りのアイテム（全フォルダ内のアイテム＋何らかの理由で漏れた未分類アイテム）を追加
              // これにより、マスターリストの順序は「未分類の並び替え順」＋「それ以外」となる
              for (const item of allItems) {
                if (!seen.has(item.id)) {
                  nextMasterList.push(item);
                }
              }

              // 4. マスターリストを保存
              saveItems(nextMasterList);

              // 5. もしアイテムがフォルダから移動してきた場合、フォルダから削除（クリーンアップ）
              const fs = loadFoldersFn(foldersKey, defaultFolderName);
              let folderChanged = false;
              for (const f of fs) {
                const before = f.order.length;
                f.order = f.order.filter(id => id !== draggedId);
                if (f.order.length !== before) { f.ts = Date.now(); folderChanged = true; }
              }

              if (folderChanged) {
                saveFoldersFn(foldersKey, fs);
                // フォルダ構成が変わった場合は、リスト全体を再描画
                showToast(i18n.t('toastReordered'));
                renderFolderedCollection(cfg);
              } else {
                // 未分類内での移動だけなら再描画は不要（DOMは更新済み）
                showToast(i18n.t('toastReordered'));
              }
            };

            // ▼ リスト本体には「並び替え」を、セクション背景には「未分類化」を割り当てる
            list.addEventListener('drop', dropToReorderUnassigned);
            sec.addEventListener('dragover', ev => { if (!(ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME))) { ev.preventDefault(); ev.stopPropagation(); }});
            sec.addEventListener('drop', dropToUnassign);

            sec.appendChild(list);
            return sec;
          };

          // 10) フォルダセクション
          const renderFolderSection = (folder) => {
            const section = document.createElement('section');
            section.className = 'adv-folder';
            section.dataset.folderId = folder.id;
            if (folder.collapsed) section.classList.add('adv-folder-collapsed');

            const header = document.createElement('div');
            header.className = 'adv-folder-header';
            header.setAttribute('draggable', 'true');

            const toggleBtn = renderFolderToggleButton(!!folder.collapsed);
            const titleWrap = document.createElement('div'); titleWrap.className = 'adv-folder-title';
            titleWrap.appendChild(toggleBtn);
            const nameEl = document.createElement('strong'); nameEl.textContent = folder.name; titleWrap.appendChild(nameEl);
            const countEl = document.createElement('span'); countEl.className='adv-item-sub'; countEl.textContent = `(${folder.order.length})`;
            titleWrap.appendChild(countEl);

            const actions = document.createElement('div');
            actions.className = 'adv-folder-actions';
            setInnerHTML(actions,`
              <button class="adv-chip"        data-action="rename"  title="${i18n.t('folderRenameTitle')}">${i18n.t('folderRename')}</button>
              <button class="adv-chip danger" data-action="delete"  title="${i18n.t('folderDeleteTitle')}">${i18n.t('folderDelete')}</button>
            `);

            header.appendChild(titleWrap);
            header.appendChild(actions);

            // セクションD&D
            const SECT_MIME = 'adv/folder';
            header.addEventListener('dragstart', (ev) => {
              if (ev.target && (ev.target.closest('.adv-folder-actions') || ev.target.closest('.adv-folder-toggle-btn'))) { ev.preventDefault(); return; }
              ev.dataTransfer.setData(SECT_MIME, folder.id);
              ev.dataTransfer.effectAllowed = 'move';
              section.classList.add('dragging-folder');
            });
            header.addEventListener('dragend', () => section.classList.remove('dragging-folder'));
            section.addEventListener('dragover', (ev) => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) {
                ev.preventDefault();
                ev.stopPropagation();
                const dragging = host.querySelector('.dragging-folder');
                if (!dragging || dragging === section) return;
                const after = getSectionAfterElement(host, ev.clientY);
                if (after == null) host.appendChild(dragging);
                else host.insertBefore(dragging, after);
              } else {
                 ev.preventDefault();
                 ev.stopPropagation(); // これで「枠線」に乗った時に背景が光るのを防ぐ
                 // ここでは section.dataset.drop='1' はしない（中身のリストに入った時に光らせたいので）
                 // もし枠線でも光らせたい場合はここに dataset.drop='1' を書いてもOK
              }
            });

            // 折りたたみ
            const collapseToggle = () => {
              section.classList.toggle('adv-folder-collapsed');
              const all = loadFoldersFn(foldersKey, defaultFolderName);
              const f = all.find(x => x.id === folder.id);
              if (f) { f.collapsed = section.classList.contains('adv-folder-collapsed'); f.ts = Date.now(); saveFoldersFn(foldersKey, all); }
              updateFolderToggleButton(toggleBtn, !!section.classList.contains('adv-folder-collapsed'));
            };
            toggleBtn.addEventListener('click', (e)=>{ e.stopPropagation(); collapseToggle(); });
            toggleBtn.addEventListener('keydown', (e)=>{ if (e.key===' '||e.key==='Enter'){ e.preventDefault(); collapseToggle(); } });

            // Rename / Delete
            actions.querySelector('[data-action="rename"]').addEventListener('click', ()=>{
              const nm = prompt(i18n.t('promptNewFolder'), folder.name);
              if (!nm || !nm.trim()) return;
              const fArr = loadFoldersFn(foldersKey, defaultFolderName);
              const f = fArr.find(x=>x.id===folder.id); if (!f) return;
              f.name = nm.trim(); f.ts = Date.now(); saveFoldersFn(foldersKey, fArr);
              renderFolderedCollection(cfg); showToast(i18n.t('updated'));
            });
            actions.querySelector('[data-action="delete"]').addEventListener('click', ()=>{
              if (!confirm(i18n.t('confirmDeleteFolder'))) return;

                // 1. 削除対象のアイテムIDセットを取得
                const itemsToDelete = new Set(folder.order || []);

                // 2. アイテムのマスターリストから該当アイテムを削除
                if (itemsToDelete.size > 0) {
                    try {
                        const allItems = loadItems(); // 親スコープの loadItems を使用
                        const nextItems = allItems.filter(item => !itemsToDelete.has(item.id));
                        saveItems(nextItems); // 親スコープの saveItems を使用
                    } catch (e) {
                        console.error('Failed to delete items in folder:', e);
                        // アイテム削除に失敗しても、フォルダ削除は続行
                    }
                }

              // 3. フォルダ自体を削除
              let fArr = loadFoldersFn(foldersKey, defaultFolderName);
              const idx = fArr.findIndex(x=>x.id===folder.id); if (idx<0) return;
              fArr.splice(idx,1);
              saveFoldersFn(foldersKey, fArr);

              // 4. 再描画
              renderFolderedCollection(cfg); showToast(i18n.t('toastDeleted'));
            });

            // フォルダ見出しにドロップ → そのフォルダへ移動
            header.addEventListener('dragover', ev => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return;
              ev.preventDefault();
              ev.stopPropagation();
              /* ▼▼▼ 背景の破線を強制的に消す ▼▼▼ */
              document.querySelectorAll('.adv-bg-drop-active').forEach(el => el.classList.remove('adv-bg-drop-active'));
              // 排他制御: 他のフォルダのハイライトを消す
              document.querySelectorAll('.adv-folder[data-drop="1"]').forEach(el => {
                if (el !== section) delete el.dataset.drop;
              });
              section.dataset.drop='1';
            });
            header.addEventListener('dragleave', (ev) => {
              // 子要素への移動でも一旦消すが、dragoverですぐ復活する
              delete section.dataset.drop;
            });
            header.addEventListener('drop', ev => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return;
              ev.preventDefault(); delete section.dataset.drop;
              const draggedId = ev.dataTransfer.getData('text/plain');
              if (!draggedId) return;
              onMoveToFolder(draggedId, folder.id);
            });

            // リスト本体
            const list = document.createElement('div'); list.className = 'adv-list';
            const itemsInFolder = folder.order.map(id => idToItem[id]).filter(Boolean).filter(matchItem);
            itemsInFolder.forEach(it => list.appendChild(renderRow(it)));

            // 並びプレビュー
            list.addEventListener('dragover', ev => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return; // ガード追加
              ev.preventDefault();
              ev.stopPropagation(); // 伝播停止も追加

              /* ▼▼▼ 背景の破線を強制的に消す ▼▼▼ */
              document.querySelectorAll('.adv-bg-drop-active').forEach(el => el.classList.remove('adv-bg-drop-active'));

              // 排他制御: 他のフォルダのハイライトを消す
              document.querySelectorAll('.adv-folder[data-drop="1"]').forEach(el => {
                if (el !== section) delete el.dataset.drop;
              });
              section.dataset.drop='1';

              const dragging = document.querySelector('.adv-item.dragging');
              if (!dragging) return;
              const after = getDragAfterElement(list, ev.clientY);
              if (after == null) list.appendChild(dragging);
              else list.insertBefore(dragging, after);
            });

            list.addEventListener('dragleave', ev => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return;
              ev.stopPropagation();
              // 子要素への移動でも一旦消すが、dragoverですぐ復活する
              delete section.dataset.drop;
            });

            // 並び確定（かつ別フォルダ→このフォルダへの“移動”も吸収）
            list.addEventListener('drop', (ev) => {
              if (ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME)) return; // ガード追加
              ev.preventDefault(); ev.stopPropagation();
              delete section.dataset.drop;
              const draggedId = ev.dataTransfer.getData('text/plain');
              if (!draggedId) return;

              const newOrder = [...list.querySelectorAll('.adv-item')].map(el => el.dataset.id);

              const fArr = loadFoldersFn(foldersKey, defaultFolderName);
              const f = fArr.find(x=>x.id===folder.id);
              if (!f) return;

              const isMove = !f.order.includes(draggedId);
              if (isMove) {
                for (const f_other of fArr) {
                  if (f_other.id === folder.id) continue;
                  const o_before = f_other.order.length;
                  f_other.order = f_other.order.filter(id => id !== draggedId);
                  if (f_other.order.length !== o_before) f_other.ts = Date.now();
                }
              }

              f.order = newOrder;
              f.ts = Date.now();
              saveFoldersFn(foldersKey, fArr);
              showToast(i18n.t('toastReordered'));

              if (isMove) renderFolderedCollection(cfg);
            });

            section.appendChild(header);
            section.appendChild(list);
            return section;
          };

          // 11) 単一表示かALL表示か
          const order = (filterFolder !== '__ALL__')
            ? (filterFolder === '__UNASSIGNED__' ? ['__UNASSIGNED__'] : foldersToDraw.map(f => f.id))
            : buildSectionsOrder();

          order.forEach(id => {
            if (id === '__UNASSIGNED__') host.appendChild(renderUnassignedSection());
            else {
              const f = folders.find(x => x.id === id);
              if (f) host.appendChild(renderFolderSection(f));
            }
          });

          if (!host._advFolderDropAttached) { // 多重登録防止フラグ
              host._advFolderDropAttached = true;

              host.addEventListener('drop', (ev) => {
                  const SECT_MIME = 'adv/folder';
                  if (!(ev.dataTransfer.types && ev.dataTransfer.types.includes(SECT_MIME))) {
                      // アイテムのドロップ (text/plain) は他のリスナーが処理するため無視
                      return;
                  }

                  // セクション並び替え (adv/folder) の drop イベント
                  const sectionEl = ev.target.closest('.adv-folder, .adv-unassigned');

                  // イベントが host (コンテナ) またはその直下の子セクションで発生した場合のみ処理
                  if (ev.target === host || (sectionEl && sectionEl.parentElement === host)) {
                      ev.preventDefault();
                      ev.stopPropagation();

                      // dragover で DOM は既に入れ替わっているはず
                      persistSectionsFromDOM(); // DOMの現在の順序を保存

                      // 保存後に再描画
                      renderFolderedCollection(cfg);
                  }
              });
          }
        }

        // タブ並び替え（水平）用のヘルパー
        const getDragAfterElementHorizontal = (container, x, selector) => {
            const els = [...container.querySelectorAll(`${selector}:not(.dragging)`)];
            let closest = { offset: Number.NEGATIVE_INFINITY, element: null };
            for (const el of els) {
                const box = el.getBoundingClientRect();
                // 水平方向の中心からのオフセットを計算
                const offset = x - box.left - box.width / 2;
                // 挿入すべき「次の要素」（オフセットがマイナスで最も0に近い）を探す
                if (offset < 0 && offset > closest.offset) {
                    closest = { offset, element: el };
                }
            }
            return closest.element;
        };

        function escapeHTML(s) {
            return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        }

        // テキスト内のURL、メンション、ハッシュタグをリンク化する
        function safeLinkify(text) {
            if (!text) return '';
            let escaped = escapeHTML(text);

            // Xの仕様で https:// の直後に不可視な空白や改行が含まれる場合があるため除去
            escaped = escaped.replace(/(https?:\/\/)\s+/gi, '$1');

            // 1. URL (外部リンク: adv-content-link)
            // Group 1: http/https/www で始まるURL
            // Group 2: プロトコルなしのドメイン
            const urlRegex = /((?:https?:\/\/|www\.)[^\s\u0080-\uFFFF]+)|((?<![@\w.:/\-])\b(?:[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}(?:\/[^\s\u0080-\uFFFF]*)?)/gi;

            // URL置換を先に行い、プレースホルダーに置き換える（メンション/ハッシュタグ誤爆防止）
            const placeholders = [];
            escaped = escaped.replace(urlRegex, (match) => {
                let cleanUrl = match;
                let suffix = '';
                const trailingMatch = cleanUrl.match(/[.,;:)\]]+$/);
                if (trailingMatch) {
                    suffix = trailingMatch[0];
                    cleanUrl = cleanUrl.slice(0, -suffix.length);
                }

                let href = cleanUrl;
                if (!href.match(/^(?:https?:|:\/\/)/i)) {
                     href = 'https://' + href;
                }

                placeholders.push(`<a href="${href}" target="_blank" rel="noopener noreferrer nofollow" class="adv-content-link">${cleanUrl}</a>${suffix}`);
                return `__URL_PLACEHOLDER_${placeholders.length - 1}__`;
            });

            // 2. Mentions (@username) -> SPA遷移 (adv-link)
            // 前後に英数字がない @ + 英数字アンダースコア
            escaped = escaped.replace(/(^|[^a-zA-Z0-9_!#$%&*@＠\/])@([a-zA-Z0-9_]{1,50})/g, (match, prefix, handle) => {
                return `${prefix}<a href="/${handle}" class="adv-link" style="color:var(--modal-primary-color)">@${handle}</a>`;
            });

            // 3. Hashtags (#tag) -> SPA遷移 (adv-link)
            escaped = escaped.replace(/(^|[^a-zA-Z0-9_!#$%&*@＠\/])#([^\s!@#$%^&*(),.?":{}|<>]+)/g, (match, prefix, tag) => {
                return `${prefix}<a href="/hashtag/${tag}" class="adv-link" style="color:var(--modal-primary-color)">#${tag}</a>`;
            });

            // URLプレースホルダーを復元
            escaped = escaped.replace(/__URL_PLACEHOLDER_(\d+)__/g, (_, index) => placeholders[index]);

            return escaped;
        }

        function escapeAttr(s) {
          return String(s).replace(/[&<>"']/g, c => (
            {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]
          ));
        }

        function parseSearchTokens(queryOrURL) {
          // 0) クエリ取得（URL→検索ボックス→モーダルの順でフォールバック）
          let qRaw = '';
          try {
            if (queryOrURL) {
              qRaw = String(queryOrURL);
            } else {
              const u = new URL(location.href);
              qRaw = u.searchParams.get('q') || '';
            }
          } catch (_) {}
          if (!qRaw) {
            // ▼ 複数形に変更
            const inputs = typeof getActiveSearchInputs === 'function' ? getActiveSearchInputs() : [];
            const si = inputs[0]; // 代表として最初のものを使う
            if (si?.value) qRaw = si.value;
          }
          if (!qRaw && typeof buildQueryStringFromModal === 'function') {
            qRaw = buildQueryStringFromModal() || '';
          }

          // 取得したクエリ文字列がキャッシュと同一なら、パースせずキャッシュを返す
          if (__cachedSearchQuery === qRaw && __cachedSearchTokens) {
              return __cachedSearchTokens;
          }
          // クエリが異なるため、パースを続行
          __cachedSearchQuery = qRaw; // 新しいクエリをキャッシュ
          __cachedSearchTokens = null; // 古いトークンを破棄（パース失敗に備える）

          // 正規化（%xx/スマート引用/空白整形）
          const rawNorm0 = normalizeForParse(qRaw);
          let q = ` ${rawNorm0} `;

          // 1) 除外語（-xxx）を控えてのちに差し引く
          const NEG = [];
          (q.match(/\s-\S+/g) || []).forEach(w => NEG.push(w.trim().slice(1)));

          // 2) ORグループ（括弧）を先に抜き出し（引用を含む簡易対応）
          const orGroups = [];
          const groupRegex = /\((?:[^()"]+|"[^"]*")+\)/g;
          let groupMatch;
          while ((groupMatch = groupRegex.exec(q)) !== null) {
            const inner = groupMatch[0].slice(1, -1); // (...) 中身
            const parts = inner.split(/\s+OR\s+/i).map(s => s.trim()).filter(Boolean);
            if (parts.length >= 2) {
              const tokens = parts.flatMap(p => tokenizeQuotedWords(p)).filter(Boolean);
              if (tokens.length) orGroups.push(tokens);
            }
          }
          // グループは丸ごと削る（以降の抽出を安定化）
          q = q.replace(groupRegex, ' ');

          // 3) 純粋トップレベルOR（括弧なし）検出（例：`foo OR "bar baz" OR #tag`）
          const pureOr = splitTopLevelOR(rawNorm0);
          let pureOrTokens = [];
          if (pureOr && isPureORQuery(rawNorm0)) {
            pureOrTokens = pureOr.flatMap(p => tokenizeQuotedWords(p)).filter(Boolean);
            if (pureOrTokens.length >= 2) {
              orGroups.push(pureOrTokens);
              // 純粋ORは required には入れない（後で words から除外）
            }
          }

          // 4) 引用フレーズを抽出（exactはAND相当として扱う）
          const phrases = [];
          q = q.replace(/"([^"]+)"/g, (_m, p1) => {
            if (p1 && (p1 = p1.trim())) phrases.push(p1);
            return ' ';
          });

          // 5) ハッシュタグ抽出
          const hashtags = [];
          q = q.replace(/\s#([^\s)"]+)/g, (_m, p1) => {
            const tag = '#' + p1;
            hashtags.push(tag);
            return ' ';
          });

          // 6) from:/to:/@（除外ではないもの）→ 例外判定用 opUsers
          const opUsers = new Set();
          rawNorm0.replace(/(?:^|\s)(?:from:|to:|@)([^\s()]+)/g, (m, user) => {
            // 直前が "-" の否定演算子なら除外（例: "-from:foo"）
            if (!/^\s*-/.test(m)) {
              opUsers.add(String(user || '').toLowerCase());
            }
            return m;
          });

          // 7) 言語/最小値/日付/フィルタ/アカウント演算子などを q から除去
          q = q
            .replace(/\s(?:lang|min_replies|min_faves|min_retweets|since|until):[^\s]+/gi, ' ')
            .replace(/\s(?:is:verified|filter:(?:links|images|videos|replies)|include:replies|-filter:replies)\b/gi, ' ')
            .replace(/\s(?:from:|to:|@)[^\s()]+/gi, ' ')
            .replace(/[()（）]/g, ' ')
            .replace(/\bOR\b/gi, ' ');

          // 8) 残りを単語化（句読点剥がし。#は温存済み）
          const trimPunctKeepHash = (s) => {
            if (!s) return '';
            if (s.startsWith('#')) return s;
            return s.replace(/^[\p{P}\p{S}]+/gu, '').replace(/[\p{P}\p{S}]+$/gu, '');
          };

          let words = q
            .split(/\s+/)
            .map(s => s.trim())
            .filter(Boolean)
            .map(trimPunctKeepHash)
            .filter(Boolean);

          // 9) NEG を差し引く
          const normalize = (s) => String(s || '').toLowerCase();
          const NEGnorm = NEG.map(normalize);

          // 10) 純粋ORで拾ったトークンは AND 候補から先に除外（重複/衝突を避ける）
          if (pureOrTokens.length) {
            const pureSet = new Set(pureOrTokens.map(t => t.toLowerCase()));
            const stripQuote = (s) => s.replace(/^"(.*)"$/, '$1').toLowerCase();
            words = words.filter(w => !pureSet.has(stripQuote(w)));
          }

          // 11) required（AND相当）を構成：フレーズ + ハッシュタグ + 通常語
          const requiredTermsArr = [
            ...phrases,
            ...hashtags,
            ...words.filter(w => !NEGnorm.includes(normalize(w))),
          ];

          // 12) includeTerms（従来互換）：required + OR全トークン平坦化
          const includeTerms = new Set([
            ...requiredTermsArr,
            ...orGroups.flatMap(g => g),
          ]);

          // 13) hashtagSet
          const hashtagSet = new Set(
            hashtags.map(h => h.startsWith('#') ? h : ('#' + h)).map(normalize)
          );

          // 14) 返却（requiredはSet、orGroupsは配列の配列）
          const result = {
            requiredTerms: new Set(requiredTermsArr),
            orGroups,                  // [ ['ente','セール'], ['foo','bar'] , ... ]
            includeTerms,              // AND/ORすべてを平坦化した包含語集合
            opUsers,
            hashtagSet,
          };

          __cachedSearchTokens = result; // パース結果をキャッシュに保存
          return result;
        }

        function pickTweetFields(article) {
            // 1. 本文の取得
            const bodyEl = article.querySelector('[data-testid="tweetText"]');
            const body = bodyEl ? bodyEl.innerText : '';

            let disp = '';
            let handle = '';

            try {
                // 2. ユーザー情報エリア (User-Name) を取得
                // 共有いただいたDOMでは、ここに表示名とハンドル(@xxx)の両方が含まれています
                const userRow = article.querySelector('[data-testid="User-Name"]');

                if (userRow) {
                    // User-Name内のすべての「リンク」または「テキストコンテナ」をチェック
                    // 共有DOMでは aタグの中に span がある構造です
                    const anchors = Array.from(userRow.querySelectorAll('a[href^="/"], div[dir="ltr"] span'));

                    for (const node of anchors) {
                        // テキストを取得（前後の空白を除去）
                        const text = node.innerText.trim();

                        // 空文字、または時間表示の区切り記号「·」などは無視
                        if (!text || text === '·') continue;

                        // ▼ 判定ロジック: テキストが '@' で始まるならハンドル、そうでなければ表示名
                        if (text.startsWith('@')) {
                            // ハンドルが見つかった (@を除去して保存)
                            handle = text.replace(/^@/, '');
                        } else {
                            // まだ表示名がセットされていなければ、これを表示名とする
                            // (検証済みアカウントのアイコンなどがテキストとして混ざるのを防ぐため、ある程度の長さチェックを入れても良いが、基本はこのままでOK)
                            if (!disp) {
                                disp = text;
                            }
                        }
                    }

                    // フォールバック: 上記で見つからなかった場合、User-Name直下の全テキストから解析
                    if (!handle) {
                        const allText = userRow.innerText.split('\n');
                        for (const t of allText) {
                            const trimT = t.trim();
                            if (trimT.startsWith('@')) {
                                handle = trimT.replace(/^@/, '');
                            } else if (!disp && trimT && trimT !== '·') {
                                disp = trimT;
                            }
                        }
                    }
                }
            } catch(e) {
                console.error('[pickTweetFields] Error parsing user info:', e);
            }

            // 3. 返信先ハンドルの取得 ("Replying to @..." の部分)
            // 本文や自分の名前以外で、ヘッダー付近にある @リンク を探す
            const replyHandles = Array.from(
                article.querySelectorAll('div[dir="ltr"] a[href^="/"]')
            )
            .filter(a => {
                const txt = (a.innerText || '').trim();
                // @で始まるリンクであること
                if (!txt.startsWith('@')) return false;

                // 本文内のメンションは除外
                if (bodyEl && bodyEl.contains(a)) return false;

                // 送信者自身のハンドル表記は除外
                const userRow = article.querySelector('[data-testid="User-Name"]');
                if (userRow && userRow.contains(a)) return false;

                return true;
            })
            .map(a => a.innerText.trim())
            .filter(Boolean);

            return { body, disp, handle, replyHandles };
        }

        function getTweetCell(article) {
          return article.closest('[data-testid="cellInnerDiv"]') || article;
        }

        /* ▼ 戻り値を boolean から string|null (ヒットした単語) に変更 */
        function shouldHideTweetByNameHandle(article, flags, tokens) {
          const {
            requiredTerms = new Set(),
            orGroups = [],
            includeTerms = new Set(),
            opUsers,
            hashtagSet
          } = tokens || {};

          if (includeTerms.size === 0) return null; // false -> null

          const { body, disp, handle, replyHandles } = pickTweetFields(article);

          const normSpace = (s) => String(s || '').toLowerCase().replace(/[_.\-]+/g, ' ').replace(/\s+/g, ' ').trim();
          const normId = (s) => String(s || '').replace(/^@/, '').toLowerCase();
          const stripNonAlnum = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\u00c0-\u024f]+/gi, '');

          const textBody = normSpace(body);
          const textName = normSpace(disp);

          // ハンドル群の正規化
          const handlesRaw   = [handle, ...replyHandles].map(normId).filter(Boolean);
          const handlesSpace = handlesRaw.map(normSpace);
          const handlesTok   = handlesSpace.map(h => h.split(' ').filter(Boolean));
          const handlesTight = handlesRaw.map(stripNonAlnum);

          // 本文に現れた語（正規化済み）を控える
          const inBody = new Set();
          for (const term of includeTerms) {
            const t = normSpace(term);
            if (t && textBody.includes(t)) inBody.add(t);
          }

          const inMeta = new Set();
          const markMetaHit = (tSpace, tTight) => {
            if (tSpace && !inBody.has(tSpace)) inMeta.add(tSpace);
            if (tTight) inMeta.add(tTight);
          };

          // --- 表示名ヒットの記録（短語ガードつき） ---
          if (flags.name) {
            for (const term of includeTerms) {
              const t = normSpace(term);
              if (!t) continue;
              // 2文字以下の英字のみは無視（過剰除外防止）
              if (/^[a-z]{1,2}$/.test(t)) continue;
              if (textName.includes(t) && !inBody.has(t)) {
                markMetaHit(t, null);
              }
            }
          }

          if (flags.handle) {
            for (const term of includeTerms) {
              const raw = String(term || '');
              const rawLC = raw.trim().toLowerCase();
              if (rawLC.startsWith('#') || (hashtagSet && hashtagSet.has(rawLC.startsWith('#') ? rawLC : '#' + rawLC))) continue;

              const bare = raw.replace(/^@/, '').toLowerCase();
              if (opUsers && opUsers.has(bare)) continue; // from:/to:/@ 明示は例外

              const tSpace = normSpace(raw);
              const tTight = stripNonAlnum(raw);

              // 短語ガード：英数のみで長さ<3は無視
              if (/^[a-z0-9]+$/.test(tTight) && tTight.length < 3) continue;

              // 1) トークン一致/連続トークン一致
              if (tSpace) {
                const tTokens = tSpace.split(' ').filter(Boolean);
                for (const hTokens of handlesTok) {
                  if (tTokens.length === 1) {
                    if (hTokens.some(tok => tok === tTokens[0]) && !inBody.has(tSpace)) {
                      markMetaHit(tSpace, null);
                      break;
                    }
                  } else {
                    for (let i = 0; i + tTokens.length <= hTokens.length; i++) {
                      let ok = true;
                      for (let j = 0; j < tTokens.length; j++) {
                        if (hTokens[i + j] !== tTokens[j]) { ok = false; break; }
                      }
                      if (ok && !inBody.has(tSpace)) {
                        markMetaHit(tSpace, null);
                        break;
                      }
                    }
                  }
                }
              }

              // 2) 非英数字除去の完全一致（部分一致は不可）
              if (tTight && handlesTight.some(h => h === tTight) && !(tSpace && inBody.has(tSpace))) {
                markMetaHit(tSpace, tTight);
              }
            }
          }

          // === 最終判定: マッチした単語を返す ===
          for (const t of requiredTerms) {
            const s = normSpace(t);
            // 本文になく、メタ情報(名前/ID)でのみヒットした場合、その単語を返す
            if (s && !inBody.has(s) && (inMeta.has(s) || inMeta.has(stripNonAlnum(t)))) {
              return t;
            }
          }

          for (const group of orGroups) {
            let anyBody = false;
            let metaHitWord = null;
            for (const w of group) {
              const s = normSpace(w);
              const tight = stripNonAlnum(w);
              if (s && inBody.has(s)) anyBody = true;
              if ((s && inMeta.has(s)) || (tight && inMeta.has(tight))) {
                  if (!metaHitWord) metaHitWord = w;
              }
            }
            if (!anyBody && metaHitWord) return metaHitWord;
          }

          return null;
        }

        // ▼▼▼ 再ミュートボタンの注入/削除ロジック ▼▼▼
        function injectRemuteButton(article, triggerWord, onRemute) {
            // 既存があれば何もしない
            if (article.querySelector('.adv-btn-remute')) return;

            // 1. まずGrokボタンを探す (言語依存対策で "Grok" を含むラベルを検索)
            const grokBtn = article.querySelector('button[aria-label*="Grok"]');
            // 2. なければCaret(…)ボタンを探す
            const caretBtn = article.querySelector('[data-testid="caret"]');

            // 挿入基準となるボタンを決定（Grok優先、なければCaret）
            const targetBtn = grokBtn || caretBtn;
            if (!targetBtn) return;

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'adv-btn-remute';

            // ラベルの設定
            btn.textContent = i18n.t('buttonRemute');
            btn.title = i18n.t('buttonRemute') + (triggerWord ? ` (${triggerWord})` : '');

            // クリックイベント
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (onRemute) onRemute();
            });

            // ターゲットとなるボタン(Grok または Caret)の直前に挿入する
            if (targetBtn.parentElement) {
                targetBtn.parentElement.insertBefore(btn, targetBtn);
            }
        }

        function removeRemuteButton(article) {
            const btn = article.querySelector('.adv-btn-remute');
            if (btn) btn.remove();
        }

        /* ▼ evaluateTweetForFiltering: triggerWord を特定して表示に使用 (Full Code) */
        function evaluateTweetForFiltering(art, flags, muteSettings, tokens) {
            const cell = getTweetCell(art);
            const reasons = [];
            let tweetBodyText = null;
            let triggerWord = ''; // ★ヒットした単語を保持

            const { hasMute, muteCI, muteCS, muteMode } = muteSettings;

            // 1. 名前/ハンドル除外
            if ((flags.name || flags.handle) && tokens) {
                const hitWord = shouldHideTweetByNameHandle(art, flags, tokens);
                if (hitWord) {
                    reasons.push('name_handle_only');
                    if (!triggerWord) triggerWord = hitWord; // ヒット語句を記録
                }
            }

            // 2. ミュートワード除外
            if (hasMute) {
                tweetBodyText = tweetBodyText ?? (art.querySelector('[data-testid="tweetText"]')?.innerText || '');
                const bodyCI = tweetBodyText.toLowerCase();
                let hideByMute = false;

                // A. 単純一致 (Case Insensitive)
                if (muteSettings.simpleCI && muteSettings.simpleCI.size > 0) {
                    for (const w of muteSettings.simpleCI) {
                        if (bodyCI.includes(w)) {
                            hideByMute = true;
                            if (!triggerWord) triggerWord = w;
                            break;
                        }
                    }
                }
                // B. 単純一致 (Case Sensitive)
                if (!hideByMute && muteSettings.simpleCS && muteSettings.simpleCS.size > 0) {
                    for (const w of muteSettings.simpleCS) {
                        if (tweetBodyText.includes(w)) {
                            hideByMute = true;
                            if (!triggerWord) triggerWord = w;
                            break;
                        }
                    }
                }
                // C. 正規表現/単語単位 (wb=true)
                if (!hideByMute && muteSettings.regexRules && muteSettings.regexRules.length > 0) {
                    for (const rule of muteSettings.regexRules) {
                        // rule.rx は (?:^|[^a-zA-Z0-9_])word(?:$|[^a-zA-Z0-9_]) の形
                        if (rule.rx.test(tweetBodyText)) {
                            hideByMute = true;
                            if (!triggerWord) triggerWord = rule.word;
                            break;
                        }
                    }
                }

                if (hideByMute) reasons.push('muted_word');
            }

            // 3. リポスト除外
            if (flags.reposts) {
                const socialContext = art.querySelector('[data-testid="socialContext"]');
                if (socialContext) {
                    const pinIconPath = 'M7 4.5C7 3.12 8.12 2 9.5 2h5C15.88 2 17 3.12 17 4.5v5.26L20.12 16H13v5l-1 2-1-2v-5H3.88L7 9.76V4.5z';
                    const isPinned = art.querySelector(`svg path[d="${pinIconPath}"]`);
                    if (!isPinned) {
                        reasons.push('repost');
                        if (!triggerWord) triggerWord = 'Repost';
                    }
                }
            }

            // 4. ハッシュタグ除外
            if (flags.hashtags) {
                tweetBodyText = tweetBodyText ?? (art.querySelector('[data-testid="tweetText"]')?.innerText || '');
                if (tweetBodyText.includes('#')) {
                    reasons.push('hashtag');
                    if (!triggerWord) {
                        // 最初のハッシュタグを抽出して表示
                        const m = tweetBodyText.match(/#[^\s\u3000]+/);
                        triggerWord = m ? m[0] : '#Hashtag';
                    }
                }
            }

            // ▼▼▼ 最終判定 & UI制御 ▼▼▼
            if (reasons.length > 0) {
                // Case A: ミュート対象だが、ユーザーが既に「表示する」を押している場合
                if (art.dataset.advMutedShown === '1') {
                    // コンテンツは隠さない
                    cell.removeAttribute('data-adv-hidden');
                    cell.removeAttribute('data-adv-collapsed');

                    // その代わり、ヘッダーに「再ミュート」ボタンを注入
                    injectRemuteButton(art, triggerWord, () => {
                        // 再ミュートクリック時の処理
                        delete art.dataset.advMutedShown; // フラグを消す
                        // 再帰呼び出しして即座に隠す
                        evaluateTweetForFiltering(art, flags, muteSettings, tokens);
                    });

                } else {
                    // Case B: ミュート対象で、まだ隠れている場合
                    removeRemuteButton(art); // ボタンがあれば消す（念のため）

                    // 「ミュートワード(muted_word)」以外の理由が含まれているか判定
                    // 含まれている場合(isHardHide = true)は、設定が「折りたたみ」でも強制的に「非表示」にする
                    const isHardHide = reasons.some(r => r !== 'muted_word');

                    if (!isHardHide && muteMode === 'collapsed') {
                        // [折りたたみモード] (ミュートワードのみヒットした場合)
                        cell.removeAttribute('data-adv-hidden');
                        cell.setAttribute('data-adv-collapsed', reasons.join(' '));

                        let ph = cell.querySelector('.adv-collapsed-placeholder');
                        if (!ph) {
                            ph = document.createElement('div');
                            ph.className = 'adv-collapsed-placeholder';

                            // ここで triggerWord を表示する
                            setInnerHTML(ph,`
                                <div class="adv-collapsed-label">
                                    <span style="opacity:0.8">${i18n.t('muteLabel')} ${escapeHTML(triggerWord)}</span>
                                </div>
                                <button class="adv-btn-show">${i18n.t('buttonShow')}</button>
                            `);

                            const uncollapse = (e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                art.dataset.advMutedShown = '1';
                                evaluateTweetForFiltering(art, flags, muteSettings, tokens);
                            };
                            ph.addEventListener('click', uncollapse);
                            ph.querySelector('button').addEventListener('click', uncollapse);

                            cell.appendChild(ph);
                        } else {
                            const labelEl = ph.querySelector('.adv-collapsed-label span');
                            if (labelEl) setInnerHTML(labelEl,`${i18n.t('muteLabel')} ${escapeHTML(triggerWord)}`);
                        }
                    } else {
                        // [完全非表示モード] (Hard Hide または hidden設定)
                        cell.removeAttribute('data-adv-collapsed');
                        cell.setAttribute('data-adv-hidden', reasons.join(' '));
                    }
                }
            } else {
                // Case C: ミュート対象ではない
                delete art.dataset.advMutedShown; // 不要なフラグは掃除
                cell.removeAttribute('data-adv-hidden');
                cell.removeAttribute('data-adv-collapsed');
                removeRemuteButton(art);
            }
        }

        // ▼ ミュート設定変更時などに、全ツイートを強制再スキャンする
        function rescanAllTweetsForFilter() {
            try {
                const flags = {
                    name:   document.getElementById('adv-exclude-hit-name')?.checked ?? true,
                    handle: document.getElementById('adv-exclude-hit-handle')?.checked ?? true,
                    reposts: document.getElementById('adv-filter-reposts-exclude')?.checked ?? false,
                    hashtags: document.getElementById('adv-filter-hashtags-exclude')?.checked ?? false,
                };

                const masterOn = loadMuteMaster();
                const muteMode = loadMuteMode(); // モード読み込み
                const muted = loadMuted();
                const hasMute = masterOn && muted.length > 0;
                // 正規表現ルールと単純一致ルールを準備
                const regexRules = [];
                const simpleCI = new Set();
                const simpleCS = new Set();

                if (hasMute) {
                    muted.filter(m => m.enabled !== false).forEach(m => {
                        if (m.wb) {
                            // 単語単位(Word Boundary)の場合は正規表現を作成
                            // #ad -> (?:^|[^a-zA-Z0-9_])#ad(?:$|[^a-zA-Z0-9_]) というパターンを生成して
                            // 前後に英数字(とアンダースコア)がないことを確認する
                            const flags = m.cs ? '' : 'i';
                            const esc = escapeRegExp(m.word);
                            // 英数字以外を境界とする
                            const pattern = `(?:^|[^a-zA-Z0-9_])${esc}(?:$|[^a-zA-Z0-9_])`;
                            regexRules.push({ rx: new RegExp(pattern, flags), word: m.word });
                        } else {
                            // 部分一致の場合は高速なSet/Includesを使用
                            if (m.cs) simpleCS.add(m.word);
                            else simpleCI.add(m.word.toLowerCase());
                        }
                    });
                }

                const muteSettings = {
                    hasMute,
                    muteMode,
                    regexRules,
                    simpleCI,
                    simpleCS
                };

                // 全て無効なら属性を一掃して終了
                if (!flags.name && !flags.handle && !hasMute && !flags.reposts && !flags.hashtags) {
                    document.querySelectorAll('[data-adv-hidden], [data-adv-collapsed]').forEach(cell => {
                        cell.removeAttribute('data-adv-hidden');
                        cell.removeAttribute('data-adv-collapsed');
                    });
                    cleanupAdjacentSeparators();
                    return;
                }

                const tokens = (flags.name || flags.handle) ? parseSearchTokens() : null;
                // 全ツイートを対象
                const list = document.querySelectorAll('article[data-testid="tweet"]');

                for (const art of list) {
                    // 共通関数を呼ぶ
                    evaluateTweetForFiltering(art, flags, muteSettings, tokens);
                }

                cleanupAdjacentSeparators();
            } catch (e) {
                console.error('rescanAllTweetsForFilter failed', e);
            }
        }

        function cleanupAdjacentSeparators() {
          // （既存のまま：必要ならここに区切り線セルの非表示処理）
        }

        const executeSearch = async (scopesOverride) => {
          const finalQuery = buildQueryStringFromModal().trim();
          if (!finalQuery) return;

          const scopes = scopesOverride || readScopesFromControls();
          const params = new URLSearchParams({ q: finalQuery, src: 'typed_query' });
          if (scopes.pf) params.set('pf', 'on');
          if (scopes.lf) params.set('lf', 'on');

          const targetPath = `/search?${params.toString()}`;

          // 1) まず検索ボックスが見つかれば React state を更新して見た目と中身を同調
          // ▼ 複数形に変更し、ループ処理
          const inputs = getActiveSearchInputs?.() || [];
          if (inputs.length > 0) {
              inputs.forEach(si => {
                  if (si) { syncControlledInput(si, finalQuery); }
              });
          }

          // 2) ルートに関わらず常に SPA 遷移で検索を確定
          recordHistory(finalQuery, scopes.pf, scopes.lf);
          const before = location.href;
          try {
            await spaNavigate(targetPath);
            if (window.innerWidth <= 700) {
                closeModal();
            }
          } catch {
            // SPA 失敗時のフォールバック
            location.assign(`https://x.com${targetPath}`);
            return;
          }

          // 3) 遷移が成功したら余計な replaceState はしない（URL とルーター state の乖離を避ける）
          //    もしフォーカスが残っていたら外す
          // ▼ ループ処理
          try { inputs.forEach(si => si && si.blur()); } catch {}

        };

        const onScopeChange = async () => {
        // ▼ 複数形に変更
          const inputs = getActiveSearchInputs();
          const si = inputs[0]; // 代表として最初のものを使う
          const q = (() => {
            if (si && si.value && si.value.trim()) return si.value.trim();
            return buildQueryStringFromModal().trim();
          })();

          const { pf, lf } = readScopesFromControls();
          const params = new URLSearchParams({ src: 'typed_query' });
          if (q) params.set('q', q);
          if (pf) params.set('pf', 'on');
          if (lf) params.set('lf', 'on');

          // 入力側を先に最新化
          // ▼ ループ処理
          if (inputs.length > 0) {
              inputs.forEach(input => {
                  if (input) syncControlledInput(input, q);
              });
          }

          recordHistory(q, pf, lf);
          const path = `/search?${params.toString()}`;
          try {
            await spaNavigate(path);
          } catch {
            location.assign(`https://x.com${path}`);
          }
        };
        accountScopeSel.addEventListener('change', onScopeChange);
        locationScopeSel.addEventListener('change', onScopeChange);

        const setupModalDrag = () => {
            const header = modal.querySelector('.adv-modal-header');
            let dragging=false, offset={x:0,y:0};
            header.addEventListener('mousedown', e=>{
                // ▼ SP時はドラッグ開始しない
                if (window.innerWidth <= 700) return;

                if (e.target.matches('button,a') && !e.target.classList.contains('adv-secret-btn')) return;
                dragging=true;
                const rect = modal.getBoundingClientRect();
                modal.style.right=modal.style.bottom='auto';
                modal.style.left=`${rect.left}px`; modal.style.top=`${rect.top}px`;
                offset = { x:e.clientX-rect.left, y:e.clientY-rect.top };
                document.body.classList.add('adv-dragging');
            });
            document.addEventListener('mousemove', e=>{
                if(!dragging) return;
                let nx = e.clientX - offset.x, ny = e.clientY - offset.y;
                nx=Math.max(0,Math.min(nx,window.innerWidth - modal.offsetWidth));
                ny=Math.max(0,Math.min(ny,window.innerHeight - modal.offsetHeight));
                modal.style.left=`${nx}px`; modal.style.top=`${ny}px`;
            });
            document.addEventListener('mouseup', ()=>{
                if(dragging){ dragging=false; document.body.classList.remove('adv-dragging'); saveModalRelativeState(); }
            });
        };

        const setupModalResize = () => {
            const MIN_W = 300, MIN_H = 240;
            const MARGIN = 10;
            let resizing = null;

            const onPointerDown = (e) => {
                // ▼ SP時はリサイズ開始しない
                if (window.innerWidth <= 700) return;

                const h = e.target.closest('.adv-resizer');
                if (!h) return;
                e.preventDefault();
                const dir = h.dataset.dir;
                const r = modal.getBoundingClientRect();

                modal.style.right = 'auto';
                modal.style.bottom= 'auto';
                modal.style.left  = `${r.left}px`;
                modal.style.top   = `${r.top}px`;

                resizing = {
                    dir,
                    startX: e.clientX,
                    startY: e.clientY,
                    startLeft: r.left,
                    startTop:  r.top,
                    startW: r.width,
                    startH: r.height
                };
                try { h.setPointerCapture(e.pointerId); } catch(_) {}
                document.body.classList.add('adv-dragging');
            };

            const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

            const onPointerMove = (e) => {
                if (!resizing) return;

                const dx = e.clientX - resizing.startX;
                const dy = e.clientY - resizing.startY;

                let newLeft = resizing.startLeft;
                let newTop  = resizing.startTop;
                let newW    = resizing.startW;
                let newH    = resizing.startH;

                const dir = resizing.dir;

                if (dir.includes('e')) newW = resizing.startW + dx;
                if (dir.includes('w')) { newW = resizing.startW - dx; newLeft = resizing.startLeft + dx; }

                if (dir.includes('s')) newH = resizing.startH + dy;
                if (dir.includes('n')) { newH = resizing.startH - dy; newTop = resizing.startTop + dy; }

                const maxW = window.innerWidth  - 2*MARGIN;
                const maxH = window.innerHeight - 2*MARGIN;

                newW = clamp(newW, MIN_W, maxW);
                newH = clamp(newH, MIN_H, maxH);
                newLeft = clamp(newLeft, MARGIN, Math.max(MARGIN, window.innerWidth  - newW - MARGIN));
                newTop  = clamp(newTop,  MARGIN, Math.max(MARGIN, window.innerHeight - newH - MARGIN));

                modal.style.left   = `${Math.round(newLeft)}px`;
                modal.style.top    = `${Math.round(newTop)}px`;
                modal.style.width  = `${Math.round(newW)}px`;
                modal.style.height = `${Math.round(newH)}px`;
            };

            const onPointerUp = (e) => {
                if (!resizing) return;
                document.body.classList.remove('adv-dragging');
                try { e.target.releasePointerCapture?.(e.pointerId); } catch(_) {}
                resizing = null;
                saveModalRelativeState();
            };

            modal.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup',   onPointerUp);
            window.addEventListener('pointercancel', onPointerUp);
        };

        /* ========= Accounts storage & UI ========= */
        function renderAccountRow(item) {
          const row = document.createElement('div');
          row.className = 'adv-item';
          row.draggable = true;
          row.dataset.id = item.id;

          const title = escapeHTML(item.name || `@${item.handle}`);
          const sub   = escapeHTML(`@${item.handle}`);

          setInnerHTML(row,`
            <div class="adv-item-handle" title="Drag">≡</div>
            ${
              item.avatar
                ? `<a class="adv-item-avatar-link adv-link" href="/${escapeAttr(item.handle)}" title="@${escapeAttr(item.handle)}">
                     <img class="adv-item-avatar" src="${escapeAttr(item.avatar)}" alt="@${escapeAttr(item.handle)}">
                   </a>`
                : `<a class="adv-item-avatar-link adv-link" href="/${escapeAttr(item.handle)}" title="@${escapeAttr(item.handle)}">
                     <div class="adv-item-avatar" aria-hidden="true"></div>
                   </a>`
            }
            <div class="adv-item-main">
              <div class="adv-item-title">
                <a class="adv-link" href="/${escapeAttr(item.handle)}" title="@${escapeAttr(item.handle)}">${title}</a>
              </div>
              <div class="adv-item-sub">
                <a class="adv-link" href="/${escapeAttr(item.handle)}">@${escapeHTML(item.handle)}</a>
                <span>${fmtTime(item.ts)}</span>
              </div>
            </div>
            <div class="adv-item-actions">
              <button class="adv-chip primary" data-action="confirm">${i18n.t('buttonConfirm')}</button>
              <button class="adv-chip danger" data-action="delete">${i18n.t('delete')}</button>
            </div>
          `);

          row.querySelector('[data-action="confirm"]').addEventListener('click', (e) => {
            spaNavigate(`/${item.handle}`, { ctrlMeta: e.ctrlKey || e.metaKey });
            if (window.innerWidth <= 700) {
                closeModal();
            }
          });
          row.querySelectorAll('a.adv-link').forEach(a => {
            a.addEventListener('click', (ev) => {
              if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
              ev.preventDefault();
              const href = a.getAttribute('href') || `/${item.handle}`;
              spaNavigate(href, { ctrlMeta: false });
              if (window.innerWidth <= 700) {
                  closeModal();
              }
            });
          });
          row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteAccount(item.id));

          row.addEventListener('dragstart', (ev) => {
            row.classList.add('dragging');
            ev.dataTransfer.setData('text/plain', item.id);
            ev.dataTransfer.effectAllowed = 'move';
          });
          row.addEventListener('dragend', () => row.classList.remove('dragging'));

          return row;
        }

        function renderAccounts() {
          ensureFolderToolbars();

          renderFolderedCollection({
            hostId: 'adv-accounts-list',
            emptyId: 'adv-accounts-empty',
            filterSelectId: 'adv-accounts-folder-filter',
            searchInputId:  'adv-accounts-search',
            newFolderBtnId: 'adv-accounts-new-folder',

            foldersKey: ACCOUNTS_FOLDERS_KEY,
            defaultFolderName: i18n.t('optAccountAll'),

            loadItems: loadAccounts,
            saveItems: saveAccounts,
            renderRow: renderAccountRow,

            onUnassign: unassignAccount,
            onMoveToFolder: moveAccountToFolder,

            emptyMessage: i18n.t('emptyAccounts'),
            unassignedIndexKey: 'advAccountsUnassignedIndex_v1',
          });
        }

        function renderListRow(item) {
          const row = document.createElement('div');
          row.className = 'adv-item';
          row.draggable = true;
          row.dataset.id = item.id;

          const title = escapeHTML(item.name);
          const sub   = escapeHTML(item.url);

          setInnerHTML(row,`
            <div class="adv-item-handle" title="Drag">≡</div>
            <div class="adv-item-main">
              <div class="adv-item-title">
                <a class="adv-link" href="${escapeAttr(item.url)}">${title}</a>
              </div>
              <div class="adv-item-sub">
                <a class="adv-link" href="${escapeAttr(item.url)}">${sub}</a>
                <span>${fmtTime(item.ts)}</span>
              </div>
            </div>
            <div class="adv-item-actions">
              <button class="adv-chip primary" data-action="confirm">${i18n.t('buttonConfirm')}</button>
              <button class="adv-chip danger" data-action="delete">${i18n.t('delete')}</button>
            </div>
          `);

          row.querySelector('[data-action="confirm"]').addEventListener('click', (e) => {
            spaNavigate(item.url, { ctrlMeta: e.ctrlKey || e.metaKey });
            if (window.innerWidth <= 700) {
                closeModal();
            }
          });
          row.querySelectorAll('a.adv-link').forEach(a => {
            a.addEventListener('click', (ev) => {
              if (ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button !== 0) return;
              ev.preventDefault();
              const href = a.getAttribute('href') || item.url;
              spaNavigate(href, { ctrlMeta: false });
              if (window.innerWidth <= 700) {
                  closeModal();
              }
            });
          });
          row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteList(item.id));

          row.addEventListener('dragstart', (ev) => {
            row.classList.add('dragging');
            ev.dataTransfer.setData('text/plain', item.id);
            ev.dataTransfer.effectAllowed = 'move';
          });
          row.addEventListener('dragend', () => row.classList.remove('dragging'));

          return row;
        }


        const ACCOUNTS_KEY = 'advAccounts_v1';
        const ACCOUNTS_FOLDERS_KEY = 'advAccountsFolders_v1';
        const LISTS_FOLDERS_KEY    = 'advListsFolders_v1';
        // ▼ セクション（フォルダー + Unassigned）の並び順を永続化するキー
        const SAVED_FOLDERS_KEY    = 'advSavedFolders_v1';

        function loadFolders(key, _defaultName="") {
          const raw = loadJSON(key, null);
          if (raw && Array.isArray(raw.folders)) {
            return raw.folders.map(f => ({
              id: f.id,
              name: f.name,
              order: Array.isArray(f.order) ? f.order : [],
              ts: f.ts || Date.now(),
              collapsed: !!f.collapsed,
            }));
          }
          // 初期は空配列（フォルダー0件の世界）
          return [];
        }

        function saveFolders(key, folders) {
          saveJSON(key, { folders: folders.map(f=>({
            id:f.id, name:f.name, order:[...new Set(f.order)], ts:f.ts||Date.now(), collapsed: !!f.collapsed,
          }))});
        }

        function ensureFolderToolbars() {
          // Accounts tab
          {
            const host = document.getElementById('adv-accounts-list');
            const empty = document.getElementById('adv-accounts-empty');
            const target = empty || host; // emptyがあればその前に挿入（HTML順序が empty->list なので一番上になる）
            if (target && !target.previousElementSibling?.classList?.contains('adv-folder-toolbar')) {
              const bar = document.createElement('div');
              bar.className = 'adv-folder-toolbar';
              setInnerHTML(bar,`
                <select id="adv-accounts-folder-filter" class="adv-select"></select>
                <input id="adv-accounts-search" class="adv-input" type="text" data-i18n-placeholder="placeholderFilterAccounts" placeholder="${i18n.t('placeholderFilterAccounts')}">
                <button id="adv-accounts-new-folder" class="adv-chip" data-i18n="buttonAddFolder">${i18n.t('buttonAddFolder')}</button>
              `);
              target.parentElement.insertBefore(bar, target);
            }
          }
          // Lists tab
          {
            const host = document.getElementById('adv-lists-list');
            const empty = document.getElementById('adv-lists-empty');
            const target = empty || host;
            if (target && !target.previousElementSibling?.classList?.contains('adv-folder-toolbar')) {
              const bar = document.createElement('div');
              bar.className = 'adv-folder-toolbar';
              setInnerHTML(bar,`
                <select id="adv-lists-folder-filter" class="adv-select"></select>
                <input id="adv-lists-search" class="adv-input" type="text" data-i18n-placeholder="placeholderFilterLists" placeholder="${i18n.t('placeholderFilterLists')}">
                <button id="adv-lists-new-folder" class="adv-chip" data-i18n="buttonAddFolder">${i18n.t('buttonAddFolder')}</button>
              `);
              target.parentElement.insertBefore(bar, target);
            }
          }
          // Saved tab
          {
            const host = document.getElementById('adv-saved-list');
            const empty = document.getElementById('adv-saved-empty');
            const target = empty || host;
            if (target && !target.previousElementSibling?.classList?.contains('adv-folder-toolbar')) {
              const bar = document.createElement('div');
              bar.className = 'adv-folder-toolbar';
              setInnerHTML(bar,`
                <select id="adv-saved-folder-filter" class="adv-select"></select>
                <input id="adv-saved-search" class="adv-input" type="text" data-i18n-placeholder="placeholderSearchSaved" placeholder="${i18n.t('placeholderSearchSaved')}">
                <button id="adv-saved-new-folder" class="adv-chip" data-i18n="buttonAddFolder">${i18n.t('buttonAddFolder')}</button>
              `);
              target.parentElement.insertBefore(bar, target);
            }
          }
        }

        const migrateAccounts = (list) =>
          Array.isArray(list)
            ? list
                .map(it => ({
                  id: it.id || uid(),
                  handle: (it.handle || '').replace(/^@/, '').trim(),
                  name: (it.name || '').trim(),
                  avatar: it.avatar || '',
                  ts: it.ts || Date.now(),
                }))
                .filter(it => it.handle)
            : [];
        const loadAccounts = () => migrateAccounts(loadJSON(ACCOUNTS_KEY, []));
        const saveAccounts = (arr) => saveJSON(ACCOUNTS_KEY, migrateAccounts(arr));
        // 追加 or 更新（既存があれば name / avatar 差分のみ更新）
        const addAccount = ({ handle, name='', avatar='' }) => {
          const h = (handle || '').replace(/^@/, '').trim();
          if (!h) return 'empty';
          const list = loadAccounts();
          const ix = list.findIndex(x => x.handle.toLowerCase() === h.toLowerCase());
          if (ix >= 0) {
            let changed = false;
            if (name && name !== list[ix].name) { list[ix].name = name; changed = true; }
            if (avatar && avatar !== list[ix].avatar) { list[ix].avatar = avatar; changed = true; }
            if (changed) {
              list[ix].ts = Date.now();
              saveAccounts(list);
              renderAccounts();
              return 'updated';
            }
            return 'exists';
          }
          const id = uid();
          unmarkAsDeleted(id); // ID重複/再利用時の安全策
          list.unshift({ id, handle: h, name, avatar, ts: Date.now() });
          saveAccounts(list);
          // フォルダーへは入れない（未所属のまま）
          try {
            const folders = loadFolders(ACCOUNTS_FOLDERS_KEY, i18n.t('optAccountAll'));
            // 念のため全フォルダーから重複を除去だけして保存（未所属を保持）
            folders.forEach(f => { f.order = f.order.filter(x => x !== id); });
            saveFolders(ACCOUNTS_FOLDERS_KEY, folders);
          } catch(_) {}
          renderAccounts();
          return 'ok';
        };
        // 既存アカウントがある場合だけ name / avatar を更新（未登録なら何もしない）
        const updateAccountIfExists = ({ handle, name='', avatar='' }) => {
          const h = (handle || '').replace(/^@/, '').trim();
          if (!h) return 'empty';
          const list = loadAccounts();
          const ix = list.findIndex(x => x.handle.toLowerCase() === h.toLowerCase());
          if (ix < 0) return 'not_found';
          let changed = false;
          if (name && name !== list[ix].name)   { list[ix].name   = name;   changed = true; }
          if (avatar && avatar !== list[ix].avatar) { list[ix].avatar = avatar; changed = true; }
          if (changed) {
            list[ix].ts = Date.now();
            saveAccounts(list);
            renderAccounts();
            return 'updated';
          }
          return 'unchanged';
        };
        const deleteAccount = (id) => {
            markAsDeleted(id);
            // ▼ 削除対象のハンドルを保持しておく
            const accounts = loadAccounts();
            const deletedAccount = accounts.find(x => x.id === id);
            const deletedHandle = deletedAccount?.handle.toLowerCase();

            const next = accounts.filter(x => x.id !== id); // accounts変数を使用
            saveAccounts(next);
            renderAccounts();
            showToast(i18n.t('toastDeleted'));

            // ▼ ページ上のボタンを強制再描画
            // 現在のページハンドルを取得
            const currentHandle = getProfileHandleFromURL()?.toLowerCase();
            // もし削除したアカウントのページに今まさに居るなら、ボタンを強制更新
            if (deletedHandle && currentHandle === deletedHandle) {
                ensureProfileAddButton(true);
            }
        };

        const accountsListEl  = document.getElementById('adv-accounts-list');
        const advSavedListEl  = document.getElementById('adv-saved-list');

        function getProfileHandleFromURL(href = location.href) {
          try {
            const u = new URL(href, location.origin);
            const segs = u.pathname.split('/').filter(Boolean);
            if (segs.length === 0) return '';

            // 先頭セグメントを候補にする
            const first = segs[0];

            // 明らかな非プロフィールの予約セグメントを除外
            const RESERVED = new Set([
              'home','explore','notifications','messages','i','settings',
              'compose','search','login','signup','tos','privacy','about'
            ]);
            if (RESERVED.has(first)) return '';

            // ユーザー名パターン: プロフ直下/配下タブ（/with_replies, /media, /likes 等）を許容
            if (/^[A-Za-z0-9_]{1,50}$/.test(first)) {
              return first; // /<handle> や /<handle>/with_replies /media /likes ... をすべてカバー
            }

            return '';
          } catch {
            // DOM フォールバック
            try {
              const a = document.querySelector('[data-testid="User-Name"] a[href^="/"], [data-testid="UserName"] a[href^="/"]');
              if (a) {
                const m = (a.getAttribute('href') || '').match(/^\/([A-Za-z0-9_]{1,50})/);
                if (m) return m[1];
              }
            } catch (_) {}
            return '';
          }
        }

        // 指定ハンドルのプロフィール領域だけをスコープにして name / avatar を取得
        function collectProfileMeta(handle) {
          let name = '';
          let avatar = '';
          try {
            const h = String(handle || '').replace(/^@/, '').trim();

            // 1) プロフィール領域（表示名）
            //    ※ グローバルヘッダの自分の名前を拾わないように、最初に [data-testid="UserName"] を基準に限定
            const profileRoot =
              document.querySelector('[data-testid="UserName"]') ||
              document.querySelector('[data-testid="User-Name"]');

            if (profileRoot) {
              const texts = Array.from(profileRoot.querySelectorAll('span, div[dir="auto"]'))
                .map(el => (el.textContent || '').trim())
                .filter(Boolean);
              // 例: ["みみる@米国株投資", "@mimiru_usstock", ...]
              name = texts.find(t => !t.startsWith('@')) || '';
            }

            // 2) アバター領域をハンドルで限定
            //    DOM例: <div data-testid="UserAvatar-Container-mimiru_usstock"> ... </div>
            let avatarScope = null;
            if (h) {
              avatarScope = document.querySelector(`[data-testid="UserAvatar-Container-${CSS.escape(h)}"]`);
            }
            // フォールバック（ハンドル付き data-testid が無い古い/差分レイアウト）
            if (!avatarScope) {
              // プロフィールのヘッダ右側の塊に限定
              avatarScope = profileRoot?.closest('[data-testid="UserProfileHeader_Items"]')?.parentElement
                         || profileRoot?.parentElement
                         || document;
            }

            // 2-1) まず <img> 優先
            const img = avatarScope.querySelector('img[src*="profile_images"]');
            if (img?.src) {
              avatar = img.src;
            } else {
              // 2-2) 背景画像 style="background-image:url(...)" から抽出
              //     提示DOMの:
              //     <div class="... r-1wyyakw ..." style="background-image:url('...')"></div>
              const bg = avatarScope.querySelector('[style*="background-image"]');
              if (bg) {
                const m = String(bg.getAttribute('style') || '').match(/background-image:\s*url\((["']?)(.*?)\1\)/i);
                if (m && m[2]) avatar = m[2];
              }
            }

            // バナー(header_photo) を誤検出しないように、ヘッダバナー領域を除外
            // （banner は /header_photo へのリンク配下; avatarScope 内に入らない設計だが保険）
            if (avatar && /profile_banners\//.test(avatar)) {
              avatar = '';
            }

          } catch {}
          return { name, avatar };
        }

        let profileButtonObserver = null;
        let profileButtonInstalledFor = '';
        function ensureProfileAddButton(force = false) {
          const handle = getProfileHandleFromURL();
          if (!handle) return;
            // 同ハンドル内タブ遷移時でも、既存ボタンが消えていたら再設置できるようにする
          if (!force && profileButtonInstalledFor === handle && document.getElementById('adv-add-account-btn')) {
            return;
          }

          const moreBtn = document.querySelector('button[data-testid="userActions"]');
          if (!moreBtn) return;

          const parent = moreBtn.parentElement;
          if (!parent) return; // 親コンテナがなければ挿入もできない

          // 状態（追加済みか）を先に判定
          const h_lower = handle.toLowerCase();
          const accounts = loadAccounts();
          const existingAccount = accounts.find(x => x.handle.toLowerCase() === h_lower);
          const isAdded = !!existingAccount;
          const accountId = existingAccount?.id || null;

          // 既存のボタンが残っていれば、ハンドルに関わらず強制的に削除する
          const existingBtn = parent.querySelector('#adv-add-account-btn');
          if (existingBtn) {
              existingBtn.remove();
          }

          const btn = document.createElement('button');
          btn.id = 'adv-add-account-btn';
          btn.type = 'button';
          // 見た目を完全同期（class も style もコピー）
          const syncVisual = (dst, src) => {
            dst.className = src.className;
            const st = src.getAttribute('style');
            if (st !== null) dst.setAttribute('style', st);
            // 念のため currentColor 継承
            dst.style.color ||= 'inherit';
          };
          syncVisual(btn, moreBtn);

          // 将来のテーマ切替／hover などで X が style/class を書き換えたら追従
          // 以前のObserverが残っていれば破棄し、リークを防ぐ
          if (profileButtonObserver) {
              profileButtonObserver.disconnect();
          }
          const visMo = new MutationObserver(() => syncVisual(btn, moreBtn));
          visMo.observe(moreBtn, { attributes: true, attributeFilter: ['class', 'style'] });
          // 新しいObserverを変数に保持
          profileButtonObserver = visMo;
          // 状態に応じてラベルを変更
          const label = i18n.t(isAdded ? 'delete' : 'buttonAddAccount'); // 「削除」キーを流用
          btn.setAttribute('aria-label', label);
          btn.title = label;
          // ▼ 内側の div / svg / span から「class と inline style」を抽出
          const innerDiv   = moreBtn.querySelector('div[dir="ltr"]') || moreBtn.querySelector('div');
          const innerCls   = innerDiv?.getAttribute('class') || innerDiv?.classList?.value || '';
          const innerStyle = innerDiv?.getAttribute('style') || '';
          const svgEl      = innerDiv?.querySelector('svg') || moreBtn.querySelector('svg');
          const svgCls     = svgEl?.getAttribute('class') || svgEl?.classList?.value || '';
          const spanEl     = innerDiv?.querySelector('span') || moreBtn.querySelector('span');
          const spanCls    = spanEl?.getAttribute('class') || spanEl?.classList?.value || '';

          // 状態に応じてSVGパスを切り替え
          const ICON_PATH_ADD = 'M18 5h2v3h3v2h-3v3h-2V10h-3V8h3V5z';
          const ICON_PATH_CHECK = 'M23 8l-5 5-3-3 1.5-1.5L18 10l3.5-3.5L23 8z'; // 右上に配置したチェック
          const iconPath = isAdded ? ICON_PATH_CHECK : ICON_PATH_ADD;

          setInnerHTML(btn,`
            <div dir="ltr" class="${innerCls}" style="${innerStyle}">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                role="img"
                class="${svgCls}"
                fill="currentColor"
              >
                <circle cx="10" cy="7.5" r="3.5"></circle>
                <path d="M3.5 18.5C3.5 15.46 6.79 13 10 13s6.5 2.46 6.5 5.5V20H3.5v-1.5z"></path>
                <path d="${iconPath}" style="fill:var(--modal-primary-color)"></path>
              </svg>
              <span class="${spanCls}"></span>
            </div>
          `);

          btn.addEventListener('click', () => {
            if (isAdded) {
              // 追加済みの場合：削除
              if (accountId) {
                deleteAccount(accountId); // deleteAccount は toast を内蔵している
              }
            } else {
              // 未追加の場合：追加
              const { name, avatar } = collectProfileMeta(handle);
              const ret = addAccount({ handle, name, avatar });
              if (ret === 'ok') showToast(i18n.t('toastAccountAdded'));
              else if (ret === 'updated') showToast(i18n.t('updated'));
              else if (ret === 'exists') showToast(i18n.t('toastAccountExists'));
            }
            // 状態が変わったので、ボタンを即座に再描画（アイコンを切り替え）
            ensureProfileAddButton(true); // force=true で再実行
          });
          // moreBtn.parentElement?.insertBefore(btn, moreBtn);
          parent.insertBefore(btn, moreBtn); // parent変数を使用
          profileButtonInstalledFor = handle;

          // プロフィールに来たタイミングで自動同期
          // 未登録は追加しない。既存時のみ差分更新。
          try {
            const { name, avatar } = collectProfileMeta(handle);
            const status = updateAccountIfExists({ handle, name, avatar });
            if (status === 'updated') showToast(i18n.t('updated'));
            // 'not_found' / 'unchanged' は無通知でOK
          } catch {}

        }

        /* ========= Lists storage & UI ========= */
        const LISTS_KEY = 'advLists_v1';

        const migrateLists = (list) =>
          Array.isArray(list)
            ? list
                .map(it => ({
                  id: it.id || uid(),
                  name: (it.name || '').trim(),
                  url: (it.url || '').trim(),
                  ts: it.ts || Date.now(),
                }))
                .filter(it => it.name && it.url)
            : [];

        const loadLists  = () => migrateLists(loadJSON(LISTS_KEY, []));
        const saveLists  = (arr) => saveJSON(LISTS_KEY, migrateLists(arr));

        const addList = ({ name, url }) => {
          const nm = (name || '').trim();
          let u = (url || '').trim();
          if (!nm || !u) return 'empty';
          try {
            const parsed = new URL(u, location.origin);
            if (parsed.origin === location.origin) u = parsed.pathname + parsed.search + parsed.hash;
          } catch {}
          const list = loadLists();
          if (list.some(x => x.url === u)) return 'exists';
          const id = uid();
          unmarkAsDeleted(id); // ID重複/再利用時の安全策
          list.unshift({ id, name: nm, url: u, ts: Date.now() });
          saveLists(list);
          // フォルダーへは入れない（未所属のまま）
          try {
            const folders = loadFolders(LISTS_FOLDERS_KEY, i18n.t('optLocationAll'));
            folders.forEach(f => { f.order = f.order.filter(x => x !== id); });
            saveFolders(LISTS_FOLDERS_KEY, folders);
          } catch(_) {}
          renderLists();
          return 'ok';
        };

        const deleteList = (id) => {
            markAsDeleted(id);
            // ▼ 削除対象のURLを保持しておく
            const lists = loadLists();
            const deletedList = lists.find(x => x.id === id);
            const deletedUrl = deletedList?.url;

            const next = lists.filter(x => x.id !== id); // lists変数を使用
            saveLists(next);
            renderLists();
            showToast(i18n.t('toastDeleted'));

            // ▼ ページ上のボタンを強制再描画
            // 現在がリストページか、そのURLは何かを取得
            if (isListPath()) {
                const { url: currentUrl } = getListMeta();
                // もし削除したリストのページに今まさに居るなら、ボタンを強制更新
                if (deletedUrl && currentUrl === deletedUrl) {
                    ensureListAddButton(true);
                }
            }
        };

        const advListsListEl  = document.getElementById('adv-lists-list');

        // ===== FOLDER MIGRATION =====
        (function migrateAccountsToFolders(){
          // 既存フォルダーがあっても root 前提の自動作成/自動割当はしない。
          // 古いデータで item.folderId === 'root' の痕跡があれば“未所属”に正規化。
          try {
            let items = loadAccounts();
            let changed = false;
            items = items.map(it => {
              if (it.folderId === 'root') { delete it.folderId; changed = true; }
              return it;
            });
            if (changed) saveAccounts(items);
          } catch(_) {}
        })();

        (function migrateListsToFolders(){
          // root 前提の自動作成/自動割当は行わない。
          try {
            let items = loadLists();
            let changed = false;
            items = items.map(it => {
              if (it.folderId === 'root') { delete it.folderId; changed = true; }
              return it;
            });
            if (changed) saveLists(items);
          } catch(_) {}
        })();

        // UI toolbars
        ensureFolderToolbars();

        function renderLists() {
          ensureFolderToolbars();

          renderFolderedCollection({
            hostId: 'adv-lists-list',
            emptyId: 'adv-lists-empty',
            filterSelectId: 'adv-lists-folder-filter',
            searchInputId:  'adv-lists-search',
            newFolderBtnId: 'adv-lists-new-folder',

            foldersKey: LISTS_FOLDERS_KEY,
            defaultFolderName: i18n.t('optListsAll'),

            loadItems: loadLists,
            saveItems: saveLists,
            renderRow: renderListRow,

            onUnassign: unassignList,
            onMoveToFolder: moveListToFolder,

            emptyMessage: i18n.t('emptyLists'),
            unassignedIndexKey: 'advListsUnassignedIndex_v1',
          });
        }

        const isListPath = (pathname = location.pathname) => /^\/i\/lists\/\d+\/?$/.test(pathname);

        function getListMeta() {
          // 1) <title> から取り出し（最優先）
          let rawTitle = '';
          try { rawTitle = (document.title || '').trim(); } catch (_) {}

          // 末尾の " / X" または " / Twitter" を削る
          let baseTitle = rawTitle.replace(/\s*\/\s*(X|Twitter)\s*$/i, '').trim();

          let name = '';
          let m;

          // パターンA: "@owner/リスト名"
          m = baseTitle.match(/^\s*@([A-Za-z0-9_]{1,50})\/\s*(.+)\s*$/);
          if (m) {
            name = (m[2] || '').trim();
          }

          // パターンB: "リスト名 (@owner)"
          if (!name) {
            m = baseTitle.match(/^\s*(.+?)\s*\(@[A-Za-z0-9_]{1,50}\)\s*$/);
            if (m) {
              name = (m[1] || '').trim();
            }
          }

          // 余分な引用符 “ ” " ' に対応
          if (name) {
            name = name.replace(/^[“"'](.+)[”"']$/, '$1').trim();
          }

          // 2) タイトルで取れない/怪しい時は見出しから拾う（@を含む/長文/ヘルプ文は除外）
          if (!name) {
            try {
              const headingRoot =
                document.querySelector('[data-testid="ScrollSnap-ListHeader"]') ||
                document.querySelector('[data-testid="primaryColumn"]') ||
                document;

              const candidates = Array.from(
                headingRoot.querySelectorAll('h1[role="heading"], h2[role="heading"], h3[role="heading"]')
              )
                .flatMap(h => Array.from(h.querySelectorAll('span, div[dir="ltr"], div[dir="auto"]'))
                  .map(el => (el.textContent || '').trim()))
                .filter(Boolean)
                // 「@…」はオーナー表記なので除外
                .filter(txt => !/^@/.test(txt))
                // 長文やヘルプ文（キーボードショートカット系）を弾く
                .filter(txt => {
                  const t = txt.replace(/\s+/g, ' ');
                  if (t.length > 80) return false;
                  const NG = ['キーボードショートカット', 'keyboard', 'help', 'ショートカット', 'press', '?'];
                  return !NG.some(ng => t.toLowerCase().includes(ng.toLowerCase()));
                });

              if (candidates.length) {
                // 一番短い候補（＝装飾の少ないタイトルの可能性が高い）
                name = candidates.sort((a, b) => a.length - b.length)[0].trim();
              }
            } catch (_) {}
          }

          // 3) 最終フォールバック
          if (!name) name = '';

          // URL は現ページ（SPA対応でクエリ/ハッシュも保持）
          const url = location.pathname + location.search + location.hash;
          return { name, url };
        }

        let listButtonObserver = null;
        let listButtonInstalledAt = '';
        function ensureListAddButton(force = false) {
          if (!isListPath()) return;
          if (!force && listButtonInstalledAt === location.pathname) return;

          // 可視状態にあるシェアボタンを厳密に特定する
          const shareBtns = Array.from(document.querySelectorAll('button[data-testid="share-button"]'));
          // offsetParent が null でない（＝表示されている）ボタンを探す
          // SP時は TopNavBar 内にあることが多いため、それを優先しても良いが、可視チェックが最も汎用的
          const shareBtn = shareBtns.find(btn => btn.offsetParent !== null);
          if (!shareBtn) return;

          const parent = shareBtn.parentElement;
          if (!parent) return;

          // ▼ 状態判定ロジックを追加
          const { name: currentName, url: currentUrl } = getListMeta();
          // リスト名やURLが取得できない（＝リストページではない）場合はボタンを追加しない
          if (!currentName || !currentUrl) return;

          const lists = loadLists();
          const existingList = lists.find(x => x.url === currentUrl);
          const isAdded = !!existingList;
          const listId = existingList?.id || null;

          // 既存のボタンが残っていれば、強制的に削除する
          const existingBtn = parent.querySelector('#adv-add-list-btn');
          if (existingBtn) {
              existingBtn.remove();
          }

          const btn = document.createElement('button');
          btn.id = 'adv-add-list-btn';
          btn.type = 'button';

          const syncVisual = (dst, src) => {
            dst.className = src.className;
            const st = src.getAttribute('style');
            if (st !== null) dst.setAttribute('style', st);
            dst.style.color ||= 'inherit';
          };
          syncVisual(btn, shareBtn);

          // 以前のObserverが残っていれば破棄し、リークを防ぐ
          if (listButtonObserver) {
              listButtonObserver.disconnect();
          }
          const visMo = new MutationObserver(() => syncVisual(btn, shareBtn));
          visMo.observe(shareBtn, { attributes: true, attributeFilter: ['class', 'style'] });
          // 新しいObserverを変数に保持
          listButtonObserver = visMo;

          // ▼ isAdded に応じてラベルを変更（"削除"キーを流用）
          const label = i18n.t(isAdded ? 'delete' : 'buttonAddList');
          btn.setAttribute('aria-label', label);
          btn.title = label;

          const innerDiv   = shareBtn.querySelector('div[dir="ltr"]') || shareBtn.querySelector('div');
          const innerCls   = innerDiv?.getAttribute('class') || innerDiv?.classList?.value || '';
          const innerStyle = innerDiv?.getAttribute('style') || '';
          const svgEl      = innerDiv?.querySelector('svg') || shareBtn.querySelector('svg');
          const svgCls     = svgEl?.getAttribute('class') || svgEl?.classList?.value || '';
          const spanEl     = innerDiv?.querySelector('span') || shareBtn.querySelector('span');
          const spanCls    = spanEl?.getAttribute('class') || spanEl?.classList?.value || '';

          // ▼ アイコンパスを定義
          const ICON_PATH_ADD = 'M12 5c.55 0 1 .45 1 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H6a1 1 0 110-2h5V6c0-.55.45-1 1-1z';
          // アカウントボタンとは異なり、シンプルなチェックマークを使用
          const ICON_PATH_CHECK = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z';
          const iconPath = isAdded ? ICON_PATH_CHECK : ICON_PATH_ADD;

          // ▼ iconPath を使用するように innerHTML を変更
          setInnerHTML(btn,`
              <div dir="ltr" class="${innerCls}" style="${innerStyle}">
                  <svg viewBox="0 0 24 24" aria-hidden="true" class="${svgCls}" fill="currentColor">
                      <g><path d="${iconPath}"></path></g>
                  </svg>
                  <span class="${spanCls}"></span>
              </div>
          `);

          // ▼ クリックイベントのロジックをトグルに変更
          btn.addEventListener('click', () => {
              if (isAdded) {
                  // 既に登録済みの場合：削除
                  if (listId) {
                      deleteList(listId); // deleteList は内部で toastDeleted を呼び出します
                  }
              } else {
                  // 未登録の場合：追加
                  // (関数冒頭で取得した currentName, currentUrl を使用)
                  const ret = addList({ name: currentName, url: currentUrl });
                  if (ret === 'ok') showToast(i18n.t('toastListAdded'));
                  else if (ret === 'exists') showToast(i18n.t('toastListExists'));
              }

              // 状態が変わったため、ボタンを強制的に再描画（アイコンを即時切替）
              ensureListAddButton(true);
          });

          // 左隣に設置
          // shareBtn.parentElement?.insertBefore(btn, shareBtn);
          parent.insertBefore(btn, shareBtn); // parent変数を使用

          listButtonInstalledAt = location.pathname;
        }

        const reconcileUI = () => {
            const stored = (()=>{ try { return JSON.parse(kv.get(MODAL_STATE_KEY,'{}')); } catch{ return {}; } })();

            // ▼SP時は、データ上で「表示(visible:true)」になっていても強制的に false (非表示) 扱いにする
            // PC時はデータの通りにする
            const isSP = window.innerWidth <= 700;
            const desiredVisible = isSP ? false : !!stored.visible;

            const blocked = isBlockedPath(location.pathname);
            const autoClose = isAutoClosePath(location.pathname);

            // SPサイズ かつ パスが /i/grok または /i/chat または /messages から始まる場合
            const isMobileHiddenPath = isSP && (
                location.pathname.startsWith('/i/grok') ||
                location.pathname.startsWith('/i/chat') ||
                location.pathname.startsWith('/messages')
            );

            // blocked（メディアビューア等）または isMobileHiddenPath なら非表示
            if (blocked || isMobileHiddenPath) {
                trigger.style.display = 'none';
            } else {
                trigger.style.display = '';
                applyTriggerStoredPosition();
                // CSSの適用(右下配置)が完了するのを少し待ってから、画面外チェックを行う
                setTimeout(() => requestAnimationFrame(keepTriggerInViewport), 100);
            }

            // SPの場合：desiredVisible は常に false なので、manualOverrideOpen (アイコンクリック) がないと表示されない
            // PCの場合：desiredVisible が true なら、autoClose でなければ表示される
            const shouldShow = (!blocked) && ( (desiredVisible && !autoClose) || manualOverrideOpen );
            const wasShown = (modal.style.display === 'flex');
            modal.style.display = shouldShow ? 'flex' : 'none';

            // 表示状態に合わせてbodyにクラスをトグル
            if (shouldShow) {
                document.body.classList.add('adv-modal-active');
            } else {
                document.body.classList.remove('adv-modal-active');
            }

            if (shouldShow) {
                // 既に表示されている場合(wasShown=true)は、位置の強制適用をスキップする
                if (!wasShown) {
                    applyModalStoredPosition();
                }

                // 画面外にはみ出していないかのチェックだけは毎回行う（位置ズレ補正のため）
                requestAnimationFrame(keepModalInViewport);

                if (!wasShown) {
                    syncFromSearchBoxToModal();
                    applyScopesToControls(readScopesFromURL());
                    updateSaveButtonState();
                }
            }
        };

        trigger.addEventListener('click', () => {
            if (trigger.style.display === 'none') return;
            const isVisibleNow = modal.style.display === 'flex';
            if (isVisibleNow) {
                manualOverrideOpen = false;
                modal.style.display = 'none';
                document.body.classList.remove('adv-modal-active');
                saveModalRelativeState();
            } else {
                manualOverrideOpen = true;
                modal.style.display = 'flex';
                document.body.classList.add('adv-modal-active');
                syncFromSearchBoxToModal();
                applyScopesToControls(readScopesFromURL());
                applyModalStoredPosition();
                requestAnimationFrame(keepModalInViewport);
                applyZoom();
                saveModalRelativeState();
                updateSaveButtonState();
            }
        });

        const closeModal = () => {
            manualOverrideOpen = false;
            modal.style.display = 'none';
            document.body.classList.remove('adv-modal-active');
            saveModalRelativeState();
        };
        closeButton.addEventListener('click', closeModal);

        clearButton.addEventListener('click', () => {
            form.reset();
            // クリア時に disabled を解除
            ['verified', 'links', 'images', 'videos'].forEach(groupName => {
                const includeEl = document.getElementById(`adv-filter-${groupName}-include`);
                const excludeEl = document.getElementById(`adv-filter-${groupName}-exclude`);
                if (includeEl) includeEl.disabled = false;
                if (excludeEl) excludeEl.disabled = false;
            });
            syncFromModalToSearchBox();
        });

        applyButton.addEventListener('click', () => {
            // 検索確定 → ルーティング反映待ち → スキャン
            Promise.resolve(executeSearch())
              .finally(() => setTimeout(() => processNewTweets(true), 800));
        });

        saveButton.addEventListener('click', () => {
            const q = buildQueryStringFromModal().trim();
            if (!q) return;
            const {pf, lf} = readScopesFromControls();
            addSaved(q, pf, lf);
            activateTab('saved');
        });

        form.addEventListener('input', syncFromModalToSearchBox);
        form.addEventListener('keydown', e => {
            if (e.key === 'Enter' && (e.target.matches('input[type="text"], input[type="number"]'))) {
                e.preventDefault();
                // 検索確定 → ルーティング反映待ち → スキャン
                Promise.resolve(executeSearch())
                  .finally(() => setTimeout(() => processNewTweets(true), 800));
            }
        });

        /* --- Date Shortcut Logic --- */
        const dateShortcutSel = document.getElementById('adv-date-shortcut');
        const sinceInput = document.getElementById('adv-since');
        const untilInput = document.getElementById('adv-until');

        if (dateShortcutSel && sinceInput && untilInput) {
            const toYMD = (date) => {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            };

            // ▼ 日付からショートカットを逆算して選択状態を同期する関数
            const updateShortcutFromInputs = () => {
                // ユーザーがショートカットを操作中の場合はループ防止のため処理しない
                if (document.activeElement === dateShortcutSel) return;

                const sVal = sinceInput.value;
                const uVal = untilInput.value;

                // 相対日付ショートカットは「Untilが空」であることが前提
                if (uVal !== '' || sVal === '') {
                    if (dateShortcutSel.value !== '') dateShortcutSel.value = '';
                    return;
                }

                const now = new Date();
                const calcTargetDate = (fn) => {
                    const d = new Date(now);
                    fn(d);
                    return toYMD(d);
                };

                // 定義と日付の対応表
                const targets = {
                    '1d': calcTargetDate(d => d.setDate(d.getDate() - 1)),
                    '1w': calcTargetDate(d => d.setDate(d.getDate() - 7)),
                    '1m': calcTargetDate(d => d.setMonth(d.getMonth() - 1)),
                    '3m': calcTargetDate(d => d.setMonth(d.getMonth() - 3)),
                    '6m': calcTargetDate(d => d.setMonth(d.getMonth() - 6)),
                    '1y': calcTargetDate(d => d.setFullYear(d.getFullYear() - 1)),
                    '2y': calcTargetDate(d => d.setFullYear(d.getFullYear() - 2)),
                    '3y': calcTargetDate(d => d.setFullYear(d.getFullYear() - 3)),
                    '5y': calcTargetDate(d => d.setFullYear(d.getFullYear() - 5)),
                };

                // 一致するショートカットを探す
                const match = Object.entries(targets).find(([key, dateStr]) => dateStr === sVal);
                const nextVal = match ? match[0] : '';

                // 値が変わる場合のみ更新（無駄な描画を抑制）
                if (dateShortcutSel.value !== nextVal) {
                    dateShortcutSel.value = nextVal;
                }
            };

            // ▼ 1. プログラムによる値変更（リロードやURL解析によるセット）を検知する仕掛け
            // input.value = '...' とされた時にも updateShortcutFromInputs を走らせる
            const hookValueProperty = (input) => {
                const descriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
                Object.defineProperty(input, 'value', {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        return descriptor.get.call(this);
                    },
                    set: function(v) {
                        descriptor.set.call(this, v);
                        // 値がセットされた直後に同期チェックを実行
                        updateShortcutFromInputs();
                    }
                });
            };
            hookValueProperty(sinceInput);
            hookValueProperty(untilInput);

            // ▼ 2. ユーザーによる手動入力（カレンダー操作やキー入力）の検知
            ['input', 'change'].forEach(evt => {
                sinceInput.addEventListener(evt, updateShortcutFromInputs);
                untilInput.addEventListener(evt, updateShortcutFromInputs);
            });

            // ▼ 3. ショートカットプルダウン変更時の処理（日付をセット）
            dateShortcutSel.addEventListener('change', () => {
                const val = dateShortcutSel.value;
                // 'clear'以外で値がない場合は無視
                if (!val && val !== 'clear') return;

                const now = new Date();
                let targetDate = new Date();

                if (val === 'clear') {
                    sinceInput.value = '';
                    untilInput.value = '';
                    dateShortcutSel.value = '';
                } else {
                    untilInput.value = ''; // 期間指定はUntil空
                    switch (val) {
                        case '1d': targetDate.setDate(now.getDate() - 1); break;
                        case '1w': targetDate.setDate(now.getDate() - 7); break;
                        case '1m': targetDate.setMonth(now.getMonth() - 1); break;
                        case '3m': targetDate.setMonth(now.getMonth() - 3); break;
                        case '6m': targetDate.setMonth(now.getMonth() - 6); break;
                        case '1y': targetDate.setFullYear(now.getFullYear() - 1); break;
                        case '2y': targetDate.setFullYear(now.getFullYear() - 2); break;
                        case '3y': targetDate.setFullYear(now.getFullYear() - 3); break;
                        case '5y': targetDate.setFullYear(now.getFullYear() - 5); break;
                    }
                    sinceInput.value = toYMD(targetDate);
                }

                // 検索ボックスへの反映
                if (typeof syncFromModalToSearchBox === 'function') {
                    syncFromModalToSearchBox();
                }
            });
        }
        const muteEmptyEl = document.getElementById('adv-mute-empty');
        const muteListEl  = document.getElementById('adv-mute-list');
        const muteInputEl = document.getElementById('adv-mute-input');
        const muteFilterEl = document.getElementById('adv-mute-filter');
        const muteCsEl    = document.getElementById('adv-mute-cs');
        const muteWbEl    = document.getElementById('adv-mute-wb');
        const muteAddBtn  = document.getElementById('adv-mute-add');

        if (muteFilterEl) {
            muteFilterEl.addEventListener('input', () => renderMuted());
        }

        const renderMuted = () => {
            let list = loadMuted();
            // 検索ボックスに値があればフィルタリング
            if (muteFilterEl) {
                const q = muteFilterEl.value.trim().toLowerCase();
                if (q) {
                    list = list.filter(item => item.word.toLowerCase().includes(q));
                }
            }

            const renderMuteRow = (item) => {
                const row = document.createElement('div');
                row.className = 'adv-mute-item';
                if (!item.enabled) row.classList.add('disabled');
                setInnerHTML(row,`
                  <div class="adv-mute-content-left">
                      <div class="adv-mute-word">${escapeHTML(item.word)}</div>
                      <div class="adv-mute-options-row">
                        <label class="adv-toggle">
                          <input type="checkbox" ${item.enabled ? 'checked' : ''} data-action="toggle-enabled">
                          <span data-i18n="labelEnabled">${i18n.t('labelEnabled')}</span>
                        </label>
                        <label class="adv-toggle">
                          <input type="checkbox" ${item.wb ? 'checked' : ''} data-action="toggle-wb">
                          <span data-i18n="labelWordBoundary">${i18n.t('labelWordBoundary')}</span>
                        </label>
                        <label class="adv-toggle">
                          <input type="checkbox" ${item.cs ? 'checked' : ''} data-action="toggle-cs">
                          <span data-i18n="labelCaseSensitive">${i18n.t('labelCaseSensitive')}</span>
                        </label>
                      </div>
                  </div>
                  <div class="adv-mute-actions-right">
                    <button class="adv-chip danger" data-action="delete" style="padding:2px 8px; font-size:11px;">${i18n.t('delete')}</button>
                  </div>
                `);
                row.querySelector('[data-action="toggle-enabled"]').addEventListener('change', () => toggleMutedEnabled(item.id));
                row.querySelector('[data-action="toggle-cs"]').addEventListener('change', () => toggleMutedCS(item.id));
                row.querySelector('[data-action="toggle-wb"]').addEventListener('change', () => toggleMutedWB(item.id));
                row.querySelector('[data-action="delete"]').addEventListener('click', () => deleteMuted(item.id));
                return row;
            };

            renderPagedList('mute', muteListEl, list, renderMuteRow, muteEmptyEl, i18n.t('emptyMuted'));
        };

        function applyMuteVisualState() {
          const listEl = document.getElementById('adv-mute-list');
          if (!listEl) return;
          const masterOn = loadMuteMaster();

          // ▼ 切替の瞬間だけトランジション全停止
          listEl.classList.add('adv-no-anim');
          // 強制リフローでスタイル確定
          void listEl.offsetHeight;
          listEl.classList.toggle('disabled', !masterOn);
          // 次フレームで解除（描画を跨がせるのがポイント）
          requestAnimationFrame(() => {
            listEl.classList.remove('adv-no-anim');
          });
        }

        muteAddBtn.addEventListener('click', () => {
          addMuted(muteInputEl.value, !!muteCsEl.checked, !!(muteWbEl && muteWbEl.checked));
          muteInputEl.value = '';
          muteCsEl.checked = false;
          if(muteWbEl) muteWbEl.checked = false;
        });
        muteInputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); muteAddBtn.click(); }
        });

        const muteEnableAllEl = document.getElementById('adv-mute-enable-all');
        const muteModeSel = document.getElementById('adv-mute-mode');

        if (muteEnableAllEl && !muteEnableAllEl._advBound) {
          muteEnableAllEl._advBound = true;
          try { muteEnableAllEl.checked = loadMuteMaster(); } catch {}
          applyMuteVisualState();

          muteEnableAllEl.addEventListener('change', () => {
            saveMuteMaster(!!muteEnableAllEl.checked);
            applyMuteVisualState();
            rescanAllTweetsForFilter();
          });
        }

        // モード選択の初期化とイベント
        if (muteModeSel && !muteModeSel._advBound) {
            muteModeSel._advBound = true;
            try { muteModeSel.value = loadMuteMode(); } catch {}
            muteModeSel.addEventListener('change', () => {
                saveMuteMode(muteModeSel.value);
                rescanAllTweetsForFilter();
            });
        }

        const installNavigationHooks = (onRouteChange) => {
            let lastHref = location.href;
            const _debounce = (fn, wait=60) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), wait); }; };

            const fireIfChanged = _debounce(() => {
                const now = location.href;
                // ▼ lastHref が null (強制実行フラグ) の場合も通過させる
                if (lastHref === null || now !== lastHref) {
                    lastHref = now;
                    try {
                        const u = new URL(now, location.origin);
                        if (u.pathname.startsWith('/search')) {
                            const q = u.searchParams.get('q') || '';
                            const pf = (u.searchParams.get('pf') || '') === 'on';
                            const lf = (u.searchParams.get('lf') || '') === 'on';
                            if (q) recordHistory(decodeURIComponent(q), pf, lf);
                        } else if (u.pathname.startsWith('/hashtag/')) {
                            const hashtag = u.pathname.substring('/hashtag/'.length).split('/')[0];
                            if (hashtag) {
                                const q = `#${decodeURIComponent(hashtag)}`;
                                // ハッシュタグページは pf/lf スコープを持たない想定
                                recordHistory(q, false, false);
                            }
                        }
                    } catch(_) {}
                    onRouteChange();
                }
            }, 60);

            const wrapHistory = (m) => {
                const orig = history[m];
                history[m] = function(...args){
                    try {
                        const href = args && args[2];
                        if (href) {
                            const u = new URL(href, location.href);
                            if (u.origin === location.origin && isBlockedPath(u.pathname)) {
                                hideUIImmediately(
                                    document.getElementById('advanced-search-modal'),
                                    document.getElementById('advanced-search-trigger')
                                );
                            }
                        }
                    } catch(_) {}
                    const ret = orig.apply(this, args);

                    // ▼ ページ遷移時はキャッシュを破棄して確実に再判定させる
                    lastHref = null;
                    queueMicrotask(fireIfChanged);
                    return ret;
                };
            };
            wrapHistory('pushState'); wrapHistory('replaceState');

            // ▼ ブラウザバック時もキャッシュを破棄して確実に再判定させる
            window.addEventListener('popstate', () => {
                lastHref = null;
                fireIfChanged();
            });

            document.addEventListener('click', (e) => {
                const a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
                if (!a) return;
                try {
                    const u = new URL(a.href, location.href);
                    if (u.origin === location.origin) {
                        const sameTab = !(e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || e.button === 1);
                        if (sameTab && isBlockedPath(u.pathname)) {
                            hideUIImmediately(
                                document.getElementById('advanced-search-modal'),
                                document.getElementById('advanced-search-trigger')
                            );
                        }
                        // クリック遷移の場合も少し遅延させてチェック
                        setTimeout(() => {
                            // 明示的な遷移なので強制チェックしても良いが、
                            // 通常は pushState 側で拾われるためここは補助
                            fireIfChanged();
                        }, 0);
                    }
                } catch(_) {}
            }, true);

            return fireIfChanged;
        };

        // Reactの内部キーをキャッシュする変数 (Global scope within closure)
        let __cachedReactFiberKey = null;

        // React Fiberから内部データを取得してリンク先パスを探すヘルパー
        function ft_getLinkFromReactFiber(dom) {
            if (!dom) return null;

            // UserScript環境(Firefox等)対策
            const target = (typeof dom.wrappedJSObject !== 'undefined') ? dom.wrappedJSObject : dom;

            // キーが未取得の場合のみ探索する (キャッシュ戦略)
            if (!__cachedReactFiberKey) {
                __cachedReactFiberKey = Object.keys(target).find(k => k.startsWith('__reactFiber$'));
            }

            // キーが見つからない、または要素がそのキーを持っていない場合は終了
            if (!__cachedReactFiberKey || !target[__cachedReactFiberKey]) return null;

            let fiber = target[__cachedReactFiberKey];

            // 親を遡って props.link.pathname を探す (最大20階層)
            for (let i = 0; i < 20; i++) {
                if (!fiber) break;

                const props = fiber.memoizedProps;
                if (props && props.link && props.link.pathname) {
                    return props.link.pathname;
                }

                // pendingProps も念のため確認
                const pProps = fiber.pendingProps;
                if (pProps && pProps.link && pProps.link.pathname) {
                    return pProps.link.pathname;
                }

                fiber = fiber.return; // 親へ移動
            }
            return null;
        }

        // ▼▼▼ ツイート本文をきれいに取得するヘルパー ▼▼▼
        function ft_getCleanTweetText(root) {
            if (!root) return '';
            // DOMを破壊しないようにクローンして操作
            const clone = root.cloneNode(true);

            // 1. 画像(絵文字)を alt テキストに置換
            clone.querySelectorAll('img').forEach(img => {
                if (img.alt) img.replaceWith(document.createTextNode(img.alt));
            });

            // 2. リンクの処理
            clone.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');

                // 外部リンク（http/httpsで始まる）の場合
                // DOMの見た目（省略されている可能性がある）ではなく、href（実体）を採用する
                if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
                    // プロトコル(https://)を削除して見た目をスッキリさせる
                    let displayText = href.replace(/^https?:\/\//, '');

                    // 末尾の / は削除する（見た目のノイズ軽減のため）
                    if (displayText.endsWith('/')) {
                        displayText = displayText.slice(0, -1);
                    }

                    // テキストノードとして置換
                    a.replaceWith(document.createTextNode(displayText));
                } else {
                    // メンション(@user)やハッシュタグ(#tag)などの内部リンクは
                    // 見た目のテキストをそのまま採用する
                    const text = a.textContent || '';
                    a.replaceWith(document.createTextNode(text));
                }
            });

            // 3. <br> を改行コードに置換 (textContent は br を無視するため)
            clone.querySelectorAll('br').forEach(br => {
                br.replaceWith(document.createTextNode('\n'));
            });

            // 4. 全体のテキストを取得 (これで分割されたURLも繋がり、改行も保持される)
            return clone.textContent;
        }

        // ツイートのDOMから保存用データを抽出
        function ft_extractTweetMeta(article, tweetId) {
            // メインテキスト抽出
            const textEl = article.querySelector('[data-testid="tweetText"]');
            const text = ft_getCleanTweetText(textEl);
            const userRow = article.querySelector('[data-testid="User-Name"]');
            let name = '', handle = '', avatar = '';

            if (userRow) {
                name = userRow.querySelector('a span')?.innerText || '';
                const userLink = userRow.querySelector('a[href^="/"]');
                if (userLink) {
                    const href = userLink.getAttribute('href');
                    if (href) {
                        const parts = href.split('/');
                        if (parts.length >= 2) handle = parts[1];
                    }
                }
            }
            const img = article.querySelector('[data-testid="Tweet-User-Avatar"] img');
            if (img) avatar = img.src;

            // 投稿日時の取得
            let postedAt = Date.now(); // フォールバックは現在時刻
            const timeEl = article.querySelector('time');
            if (timeEl && timeEl.getAttribute('datetime')) {
                postedAt = new Date(timeEl.getAttribute('datetime')).getTime();
            }

            // メディア抽出ヘルパー
            const extractMedia = (rootElement, excludeElement) => {
                const extracted = [];

                // コンテナ(tweetPhoto)を基準にループすることで、DOM上の表示順序(1,2,3,4)を維持する
                // tweetPhoto だけでなく videoPlayer も対象にする
                const mediaContainers = Array.from(rootElement.querySelectorAll('div[data-testid="tweetPhoto"], div[data-testid="videoPlayer"]'));

                // 同じコンテナや同じ動画を二重に処理しないためのセット
                const processedUrls = new Set();
                const processedElements = new Set();

                mediaContainers.forEach(container => {
                    // 引用枠内の除外判定
                    if (excludeElement && excludeElement.contains(container)) return;

                    // 1. まず video を探す (videoタグがあれば動画扱い)
                    const video = container.querySelector('video');
                    if (video) {
                        const url = video.poster || ''; // ポスター画像をサムネとして使用
                        if (url && !processedUrls.has(url)) {
                            extracted.push({ type: 'video', url: url });
                            processedUrls.add(url);
                            processedElements.add(container);
                        }
                        return; // 動画が見つかったらこのコンテナは処理終了
                    }

                    // 2. なければ img を探す
                    const img = container.querySelector('img');
                    if (img && img.src) {
                        const url = img.src;
                        if (url && !processedUrls.has(url)) {
                            // アイコンや絵文字を拾わないように簡単なフィルタ
                            extracted.push({ type: 'image', url: url });
                            processedUrls.add(url);
                            processedElements.add(container);
                        }
                    }
                });

                return extracted;
            };

            // 引用コンテナ特定
            let quoteContainer = null;
            const quoteCandidates = Array.from(article.querySelectorAll('div[role="link"]'));
            quoteContainer = quoteCandidates.find(el => {
                if (el.getAttribute('tabindex') !== '0') return false;
                const qUser = el.querySelector('[data-testid="User-Name"]');
                if (!qUser) return false;
                const hasText = el.querySelector('[data-testid="tweetText"]');
                const hasMedia = el.querySelector('[data-testid="tweetPhoto"]') || el.querySelector('video');
                return hasText || hasMedia;
            });

            const mainMedia = extractMedia(article, quoteContainer);

            let quote = null;
            if (quoteContainer) {
                // 引用テキスト抽出
                const qTextEl = quoteContainer.querySelector('[data-testid="tweetText"]');
                const qText = ft_getCleanTweetText(qTextEl);

                // ▼▼▼ 引用内の「さらに表示」リンクを抽出 ▼▼▼
                let qShowMore = null;
                const showMoreBtn = quoteContainer.querySelector('[data-testid="tweet-text-show-more-link"]');
                if (showMoreBtn) {
                    qShowMore = {
                        text: showMoreBtn.innerText || 'Show more', // "さらに表示" 等
                        url: showMoreBtn.getAttribute('href') || ''
                    };
                }

                let qName = '', qHandle = '', qAvatar = '';
                const qUserRow = quoteContainer.querySelector('[data-testid="User-Name"]');
                if (qUserRow) {
                    qName = qUserRow.textContent.split('@')[0].trim();
                    const handleMatch = qUserRow.innerText.match(/@([a-zA-Z0-9_]+)/);
                    if (handleMatch) qHandle = handleMatch[1];
                }
                const qImg = quoteContainer.querySelector('img[src*="profile_images"]');
                if (qImg) qAvatar = qImg.src;

                let qTweetId = '';

                // 1. 従来のDOM探索 (高速・一般的)
                // 通常の写真リンクなどを探す
                const photoLink = quoteContainer.querySelector('a[href*="/status/"][href*="/photo/"]');
                if (photoLink) {
                    const m = photoLink.getAttribute('href').match(/\/status\/(\d+)/);
                    if (m) qTweetId = m[1];
                }

                // 「さらに表示」リンクがある場合の補完
                if (!qTweetId && qShowMore && qShowMore.url) {
                     const m = qShowMore.url.match(/\/status\/(\d+)/);
                     if (m) qTweetId = m[1];
                }

                // 2. React Fiberからの取得 (低速・最終手段)
                // DOM探索で見つからなかった場合（動画引用や特殊なカードなど、aタグがない場合）のみ実行
                if (!qTweetId) {
                    const fiberPath = ft_getLinkFromReactFiber(quoteContainer);
                    if (fiberPath) {
                        const m = fiberPath.match(/\/status\/(\d+)/);
                        if (m) qTweetId = m[1];
                    }
                }

                const qMedia = extractMedia(quoteContainer, null);

                quote = {
                    id: qTweetId,
                    text: qText,
                    user: { name: qName, handle: qHandle, avatar: qAvatar },
                    media: qMedia,
                    showMore: qShowMore
                };
            }

            // --- Link Card Extraction ---
            let card = null;
            const cardWrapper = article.querySelector('[data-testid="card.wrapper"]');

            // 引用コンテナの中にあるカードは除外
            if (cardWrapper && (!quoteContainer || !quoteContainer.contains(cardWrapper))) {
                // URL取得 (共通)
                const cardLink = cardWrapper.querySelector('a[role="link"]');
                const cardUrl = cardLink ? cardLink.getAttribute('href') : '';

                if (cardUrl) {
                    let cardTitle = '';
                    let cardDomain = '';
                    let cardImg = '';
                    let cardSvg = ''; // SVG文字列用
                    let isSmall = false;

                    // A. Small Card (横長) の場合: 構造が特殊なので専用にパースする
                    const smallDetail = cardWrapper.querySelector('[data-testid="card.layoutSmall.detail"]');
                    if (smallDetail) {
                        isSmall = true;
                        // テキスト行を取得 (1行目:ドメイン, 2行目:タイトル の順で並んでいることが多い)
                        const lines = Array.from(smallDetail.querySelectorAll('div[dir="auto"]'))
                            .map(el => el.innerText.trim())
                            .filter(Boolean);

                        if (lines.length >= 1) cardDomain = lines[0];
                        if (lines.length >= 2) cardTitle = lines[1];

                        // 画像取得を試みる
                        const imgEl = cardWrapper.querySelector('img');
                        if (imgEl) {
                            cardImg = imgEl.src;
                        } else {
                            // 画像がなければSVGを探す
                            const svgEl = cardWrapper.querySelector('svg');
                            if (svgEl) {
                                // SVGタグ自体を文字列として保存
                                cardSvg = svgEl.outerHTML;
                            }
                        }
                    }
                    // B. Large Card (縦長) またはその他の場合: 従来のロジック
                    else {
                        const imgEl = cardWrapper.querySelector('img');
                        cardImg = imgEl ? imgEl.src : '';

                        // 複数のリンクからテキスト情報を探す
                        const allLinks = Array.from(cardWrapper.querySelectorAll('a[role="link"]'));
                        for (const link of allLinks) {
                            const text = link.innerText || '';
                            const aria = link.getAttribute('aria-label') || '';
                            if (text.trim() || aria.trim()) {
                                cardTitle = aria || text;
                                const rawAria = aria;
                                if (rawAria) {
                                    const firstPart = rawAria.split(/\s+/)[0];
                                    if (firstPart && firstPart.includes('.')) {
                                        cardDomain = firstPart;
                                    }
                                }
                                break;
                            }
                        }
                        // タイトルからドメインを除去 (重複対策)
                        cardTitle = cardTitle.replace(/\n/g, ' ').trim();
                        if (cardDomain && cardTitle.startsWith(cardDomain)) {
                            cardTitle = cardTitle.substring(cardDomain.length).trim();
                        }
                    }

                    // データがあれば保存
                    if (cardUrl && (cardImg || cardSvg || cardTitle)) {
                        card = {
                            url: cardUrl,
                            img: cardImg,
                            svg: cardSvg, // ★追加: SVGデータ
                            title: cardTitle,
                            domain: cardDomain,
                            style: isSmall ? 'small' : 'large' // ★追加: 表示タイプ
                        };
                    }
                }
            }

            return {
                id: tweetId,
                text,
                user: { name, handle, avatar },
                media: mainMedia,
                quote,
                card,
                ts: Date.now(), // 保存操作をした日時（ソート用などで使用する場合のため残す）
                postedAt: postedAt // 実際の投稿日時
            };
        }

        // 特定のTweetIDを持つ記事のタグチップだけを即座に再評価・再描画する
        function refreshTagChipsForTweet(tweetId) {
            // data-ft-tweet-id 属性を持つ記事をピンポイントで取得
            const articles = document.querySelectorAll(`article[data-ft-tweet-id="${tweetId}"]`);
            articles.forEach(article => {
                // 既存のロジックを利用してチップの着脱を再判定
                if (typeof ft_processTweetArticle === 'function') {
                    ft_processTweetArticle(article);
                }
            });
        }

        // 画面上のすべてのお気に入りボタンの状態を更新する
        function updateAllFavoriteButtons() {
            document.querySelectorAll('.adv-fav-btn').forEach(btn => {
                const tid = btn.dataset.tweetId;
                if (tid) {
                    const active = isFavorited(tid);
                    btn.classList.toggle('active', active);
                }
            });
        }

        // ★マークボタンの注入
        function injectFavoriteButton(article, tweetId) {
            const actionBar = article.querySelector('[role="group"]');
            if (!actionBar) return;

            // 1. シェアボタンを探す
            let shareBtn = actionBar.querySelector('[data-testid="share-button"]');
            if (!shareBtn) {
                const buttons = actionBar.querySelectorAll('button');
                for (const b of buttons) {
                    const label = b.getAttribute('aria-label') || '';
                    if (label.includes('共有') || label.includes('Share') || b.innerHTML.includes('M12 2.59l5.7 5.7')) {
                        shareBtn = b;
                        break;
                    }
                }
            }

            // シェアボタンが見つからない場合はフォールバック（末尾追加）
            if (!shareBtn) {
                if (actionBar.querySelector('.adv-fav-btn')) return;
                const fallbackBtn = createFavButtonElement(article, tweetId, null);
                const wrapper = document.createElement('div');
                wrapper.style.cssText = 'display:flex;align-items:center;';
                wrapper.appendChild(fallbackBtn);
                actionBar.appendChild(wrapper);
                return;
            }

            // 2. シェアボタンの親コンテナ（display: inline-grid のやつ）を探す
            let shareContainer = shareBtn.closest('div[style*="display: inline-grid"]') || shareBtn.parentNode?.parentNode;
            if (!shareContainer) shareContainer = shareBtn.parentNode;

            if (shareContainer.querySelector('.adv-fav-btn')) return;

            // 3. ボタン要素を作成
            const btn = createFavButtonElement(article, tweetId, shareBtn);

            // 4. 絶対配置用のスタイルを適用
            shareContainer.style.position = 'relative';
            shareContainer.style.overflow = 'visible';

            // コンテナの左側に、星ボタンが入る分のスペース(約36px)を強制的に空ける
            // これにより、タイムライン上で左隣のブックマークボタンと重ならなくなります
            shareContainer.style.marginLeft = '36px';

            btn.style.position = 'absolute';
            btn.style.right = '100%';
            btn.style.top = '50%';
            btn.style.transform = 'translateY(-50%)';
            btn.style.marginRight = '2px'; // シェアボタンとの隙間

            // 5. 挿入
            shareContainer.appendChild(btn);
        }

        // ▼▼▼ 「さらに表示」を自動展開する非同期ヘルパー ▼▼▼
        async function ft_expandTweetTextIfNeeded(article) {
            // 1. 記事内の全ての「さらに表示」ボタンを取得
            const allButtons = article.querySelectorAll('[data-testid="tweet-text-show-more-link"]');
            let targetBtn = null;

            // 2. メイン投稿のボタンだけを特定する
            for (const btn of allButtons) {
                // ボタンの親を遡り、div[role="link"] (引用ツイートのコンテナ) があるか確認
                // もしあれば、それは引用内のボタンなので無視する
                if (btn.closest('div[role="link"]')) {
                    continue;
                }

                // 引用内ではないボタンが見つかったら、それがメイン投稿のボタン
                targetBtn = btn;
                break;
            }

            // メイン投稿に展開ボタンがなければ何もしない（引用にあっても無視）
            if (!targetBtn) return;

            const textContainer = article.querySelector('[data-testid="tweetText"]');

            // 例外ケース：テキストコンテナが見つからない場合はクリックだけして少し待つ
            if (!textContainer) {
                targetBtn.click();
                return new Promise(r => setTimeout(r, 300));
            }

            // MutationObserverでテキストコンテナの変化（展開）を待機する
            return new Promise(resolve => {
                let resolved = false;
                const cleanup = () => {
                    if (resolved) return;
                    resolved = true;
                    observer.disconnect();
                    clearTimeout(timer);
                    resolve();
                };

                // 万が一変化しなかった場合のタイムアウト（2秒）
                const timer = setTimeout(cleanup, 2000);

                const observer = new MutationObserver(() => {
                    // DOMが変われば展開完了とみなす
                    cleanup();
                });

                // テキストコンテナの中身の変化を監視
                observer.observe(textContainer, { childList: true, subtree: true, characterData: true });

                // 監視を開始してから、特定したボタンをクリック
                targetBtn.click();
            });
        }

        // ボタン生成ロジックを分離（共通化）
        function createFavButtonElement(article, tweetId, sourceBtn) {
            const btn = document.createElement('button');
            // adv-native-style: CSSで固定サイズを解除するためのクラス
            btn.className = (sourceBtn ? sourceBtn.className : '') + ' adv-fav-btn adv-native-style';
            btn.dataset.tweetId = tweetId;
            btn.type = 'button';
            btn.title = i18n.t('tabFavorites');

            // SVG (Star)
            setInnerHTML(btn,`
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>`);

            const updateState = () => {
                const active = isFavorited(tweetId);
                btn.classList.toggle('active', active);
            };
            updateState();

            btn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                // 現在の状態を確認
                const isAlreadyFav = isFavorited(tweetId);

                // まだお気に入りしていない（＝これから保存する）場合のみ、全文展開を行う
                if (!isAlreadyFav) {
                    await ft_expandTweetTextIfNeeded(article);
                }

                const meta = ft_extractTweetMeta(article, tweetId);

                toggleFavorite(meta);
                updateState();
                ft_processTweetArticle(article);
            });

            return btn;
        }

        // ============================================================
        //  High Performance Tweet Processor (O(1))
        // ============================================================

        function processSingleTweet(article) {
            // 重複処理ガード
            if (article.dataset.advProcessed) return;

            // 1. 共通: ツイートIDの確保
            const tweetId = article.dataset.ftTweetId || ft_extractTweetId(article);
            if (!tweetId) return;
            article.dataset.ftTweetId = tweetId;

            // 2. 設定ロード (Advanced Search用) ...
            const flags = {
                name: document.getElementById('adv-exclude-hit-name')?.checked ?? true,
                handle: document.getElementById('adv-exclude-hit-handle')?.checked ?? true,
                reposts: document.getElementById('adv-filter-reposts-exclude')?.checked ?? false,
                hashtags: document.getElementById('adv-filter-hashtags-exclude')?.checked ?? false,
            };

            // 3. Advanced Search Filtering ...
            const masterOn = loadMuteMaster();
            const muteMode = loadMuteMode();
            const muted = loadMuted();
            const hasMute = masterOn && muted.length > 0;

            if (flags.name || flags.handle || hasMute || flags.reposts || flags.hashtags) {
                const regexRules = [];
                const simpleCI = new Set();
                const simpleCS = new Set();

                if (hasMute) {
                    muted.filter(m => m.enabled !== false).forEach(m => {
                        if (m.wb) {
                            // 単語単位: 正規表現を生成
                            const flags = m.cs ? '' : 'i';
                            const esc = escapeRegExp(m.word);
                            const pattern = `(?:^|[^a-zA-Z0-9_])${esc}(?:$|[^a-zA-Z0-9_])`;
                            regexRules.push({ rx: new RegExp(pattern, flags), word: m.word });
                        } else {
                            // 通常一致: Setに振り分け
                            if (m.cs) simpleCS.add(m.word);
                            else simpleCI.add(m.word.toLowerCase());
                        }
                    });
                }

                const muteSettings = {
                    hasMute,
                    muteMode,
                    regexRules,
                    simpleCI,
                    simpleCS
                };
                const tokens = (flags.name || flags.handle) ? parseSearchTokens() : null;
                try {
                    evaluateTweetForFiltering(article, flags, muteSettings, tokens);
                } catch (e) { console.error('[AdvSearch] Filter error', e); }
            }

            // 4. Favorite Tags Processing (タグ表示)
            if (typeof ft_processTweetArticle === 'function') {
                try {
                    ft_processTweetArticle(article);
                } catch (e) { console.error('[FT] Tag error', e); }
            }

            // 5.Inject Favorite Button
            injectFavoriteButton(article, tweetId);

            // 6. 処理済みフラグを立てる
            article.dataset.advProcessed = '1';
        }

        // 手動実行（設定変更時など）やページ遷移時用
        // 普段のスクロール時は Observer が processSingleTweet を呼ぶので、これは走らない
        function processNewTweets(force = false) {
            // 強制フラグがない場合、入力中はスキップ
            if (!force && isTyping()) return;

            // 全ツイートを取得して処理
            const articles = document.querySelectorAll('article[data-testid="tweet"]');
            for (const art of articles) {
                processSingleTweet(art);
            }

            // 区切り線のクリーンアップなどはここで
            cleanupAdjacentSeparators();
        }

        // 統合スキャン関数 ここまで ▼
        const setupObservers = () => {
            // URL変更検知用のプレースホルダ
            let _fireIfChanged = () => {};

            const observer = new MutationObserver((mutations) => {
                let searchBoxChanged = false;

                for (const m of mutations) {
                    // 追加されたノードだけをループする (Differential Update)
                    if (m.addedNodes.length > 0) {
                        for (const node of m.addedNodes) {
                            if (node.nodeType !== Node.ELEMENT_NODE) continue;

                            // A. 検索ボックスの検知
                            if (!searchBoxChanged) {
                                if (node.matches?.('input[data-testid="SearchBox_Search_Input"]') ||
                                    node.querySelector?.('input[data-testid="SearchBox_Search_Input"]')) {
                                    searchBoxChanged = true;
                                }
                            }

                            // 検索フォームが追加されたらリサイザーをセットアップ
                            if (node.matches?.('form[role="search"]') || node.querySelector?.('form[role="search"]')) {
                                // 少し遅延させてDOM安定後に実行
                                setTimeout(setupNativeSearchResizer, 100);
                            }

                            // B. ツイート (article) が直接追加された場合
                            if (node.tagName === 'ARTICLE' && node.getAttribute('data-testid') === 'tweet') {
                                processSingleTweet(node);
                            }
                            // C. コンテナ (div/section等) が追加され、中にツイートが含まれる場合
                            else if (node.firstElementChild) {
                                // cellInnerDiv もここに含まれる
                                const nestedTweets = node.querySelectorAll('article[data-testid="tweet"]');
                                if (nestedTweets.length > 0) {
                                    for (const tweet of nestedTweets) {
                                        processSingleTweet(tweet);
                                    }
                                }
                            }
                        }
                    }
                }

                // 検索ボックスが変わっていたらモーダルと同期
                if (searchBoxChanged) {
                    syncFromSearchBoxToModal();
                }

                // プロフィール/リストのボタン設置（DOM変化時は常にチェックしても軽量）
                try {
                    ensureProfileAddButton(false);
                    ensureListAddButton(false);
                } catch (_) {}

                // URL変更チェック (Debounced)
                _fireIfChanged();
            });

            const appContainer = document.querySelector('div[data-testid="app-container"]');
            const observeTarget = appContainer || document.body;
            observer.observe(observeTarget, { childList: true, subtree: true });

            // installNavigationHooks はそのまま利用
            _fireIfChanged = installNavigationHooks(() => {
                // Navigation Change Logic...
                if (profileButtonObserver) { profileButtonObserver.disconnect(); profileButtonObserver = null; }
                if (listButtonObserver) { listButtonObserver.disconnect(); listButtonObserver = null; }

                manualOverrideOpen = false;
                reconcileUI();
                syncFromSearchBoxToModal();
                applyScopesToControls(readScopesFromURL());
                updateSaveButtonState();

                // ページ遷移時は強制的に全スキャン (Force)
                processNewTweets(true);
                setupNativeSearchResizer();
            });
        };
        // Resizeイベントでモードが変わった際に即座に位置を切り替える
        let lastLayoutMode = getTriggerLayoutMode();
        window.addEventListener('resize', debounce(()=>{
            if (modal.style.display === 'flex') { applyModalStoredPosition(); requestAnimationFrame(keepModalInViewport); }

            // トリガーの位置再適用 (モードが変わっていたら位置を切り替える)
            const currentMode = getTriggerLayoutMode();
            if (trigger.style.display !== 'none') {
                // ウィンドウリサイズで座標がずれるのを補正、またはモード切替による位置変更
                applyTriggerStoredPosition();
                requestAnimationFrame(keepTriggerInViewport);
            }
            lastLayoutMode = currentMode;
        }, 100));
        loadModalState();
        reconcileUI();
        setupModalDrag();
        setupModalResize();
        // 排他チェックボックスのロジック
        const setupExclusiveChecks = () => {
            const groups = [
                'verified', 'links', 'images', 'videos'
            ];
            groups.forEach(groupName => {
                const includeEl = document.getElementById(`adv-filter-${groupName}-include`);
                const excludeEl = document.getElementById(`adv-filter-${groupName}-exclude`);
                if (!includeEl || !excludeEl) return;
                const handleChange = (eventSource, oppositeEl) => {
                    if (eventSource.checked) {
                        oppositeEl.disabled = true;
                    } else {
                        oppositeEl.disabled = false;
                    }
                };
                includeEl.addEventListener('change', () => handleChange(includeEl, excludeEl));
                excludeEl.addEventListener('change', () => handleChange(excludeEl, includeEl));
            });
        };
        setupExclusiveChecks();

        // ヘッダー同期ボタンの制御ロジック
        const headerSyncBtn = document.getElementById('adv-header-sync-btn');
        const updateHeaderSyncVisibility = () => {
            const isEnabled = kv.get(SYNC_ENABLED_KEY, '0') === '1';
            // 同期有効 かつ 設定(URL/Secret)が済んでいる場合のみ表示
            const cfg = (() => { try { return JSON.parse(kv.get(SYNC_CFG_KEY, '{}')); } catch { return {}; } })();
            const isConfigured = !!(cfg.endpoint && cfg.secret);

            if (headerSyncBtn) {
                headerSyncBtn.style.display = (isEnabled && isConfigured) ? 'flex' : 'none';
            }
        };
        // ボタンクリックで手動同期実行
        if (headerSyncBtn) {
            headerSyncBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (typeof syncManager !== 'undefined') {
                    // 設定保存を一応挟んでから実行
                    syncManager.saveConfig(syncManager.endpoint, syncManager.secret, syncManager.syncId).then(() => {
                        syncManager.executeSync();
                    });
                }
            });
        }

       /* ============================================================
         * Secure Sync Manager (D1 Transactional / Gzip Compression)
         * ============================================================ */
        const SYNC_CFG_KEY = 'advSyncConfig_v1';

        // Helper: Gzip Compression using Native Streams
        const gzipCompress = async (str) => {
            const stream = new Blob([str]).stream().pipeThrough(new CompressionStream('gzip'));
            return new Response(stream).arrayBuffer();
        };

        const gzipDecompress = async (arrayBuffer) => {
            const stream = new Response(arrayBuffer).body.pipeThrough(new DecompressionStream('gzip'));
            return new Response(stream).text();
        };

        // Helper: fetch wrapper with strict timeout & header sanitization
        const gmFetch = (url, options = {}) => {
            return new Promise((resolve, reject) => {
                // Strict CORS対策: Originヘッダーを明示
                const headers = { ...(options.headers || {}) };
                if (!headers['Origin']) {
                    headers['Origin'] = (typeof location !== 'undefined' && location.origin) ? location.origin : 'https://x.com';
                }

                GM_xmlhttpRequest({
                    method: options.method || 'GET',
                    url: url,
                    headers: headers,
                    data: options.body,
                    timeout: 30000, // 圧縮処理などを考慮し少し長めに
                    onload: (res) => resolve(res),
                    onerror: (err) => reject(new Error('Network error')),
                    ontimeout: () => reject(new Error('Timeout'))
                });
            });
        };

        class SyncManager {
            constructor() {
                this.endpoint = '';
                this.secret = '';
                this.syncId = '';
                this.authToken = null;      // 認証用トークン
                this.encryptionKey = null;  // 暗号化用
                this.signingKey = null;     // 署名用
                this.currentSalt = null;    // 初回送信用のソルト
                this.isSyncing = false;
                this.nextSyncScheduled = false; // 次回同期の予約フラグ

                // 同期処理中に発生した変更を検知するフラグ
                this.pendingChanges = false;

                this.readyPromise = Promise.resolve();
                this.loadConfig();
            }

            // 外部から変更を通知するメソッド
            notifyChange() {
                this.pendingChanges = true;
                // もし現在同期中なら、終わった直後にもう一度走らせるよう予約を入れる
                if (this.isSyncing) {
                    this.nextSyncScheduled = true;
                }
            }

            loadConfig() {
                try {
                    const cfg = JSON.parse(GM_getValue(SYNC_CFG_KEY, '{}'));
                    this.endpoint = cfg.endpoint || '';
                    this.secret = cfg.secret || '';
                    this.syncId = cfg.syncId || '';

                    // ここでの deriveKeys() 呼び出しを削除。
                    // 理由は、この時点ではサーバーから Salt を取得しておらず、正しい鍵が生成できないため。
                    // 鍵生成は executeSync() の中で Handshake した後に行われる。

                    // 設定ロード時にボタン表示状態を更新
                    updateHeaderSyncVisibility();
                } catch (e) {}
            }

            saveConfig(endpoint, secret, syncId) {
                this.endpoint = endpoint.trim().replace(/\/$/, '');
                this.secret = secret.trim();
                this.syncId = syncId.trim();

                GM_setValue(SYNC_CFG_KEY, JSON.stringify({
                    endpoint: this.endpoint,
                    secret: this.secret,
                    syncId: this.syncId
                }));

                // ここでの deriveKeys 呼び出しは削除。
                // 鍵生成は同期実行時(executeSync)にサーバーからSaltを取得した後に行う。

                return Promise.resolve();
            }

            // Zero-Knowledge Key Derivation
            // saltHex: Data Salt (クライアント間で共有されるソルト) を使用して、認証トークンと暗号化キーの両方を生成する
            async deriveKeys(saltHex) {
                if (!this.secret || !saltHex) return;

                try {
                    const cryptoObj = (typeof unsafeWindow !== 'undefined' && unsafeWindow.crypto) ? unsafeWindow.crypto : (window.crypto || window.msCrypto);
                    const subtle = cryptoObj.subtle;
                    const enc = new TextEncoder();

                    const keyMaterial = await subtle.importKey(
                        "raw", enc.encode(this.secret), { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]
                    );

                    const ITERATIONS = 600000;

                    // A. 認証トークンの生成
                    // 以前の修正ではここに serverSalt を使おうとしましたが、Device A/B間の不整合を防ぐため
                    // 共有されている saltHex (Data Salt) に "|auth" を付与して使用します。
                    const authBits = await subtle.deriveBits(
                        { name: "PBKDF2", salt: enc.encode(saltHex + "|auth"), iterations: ITERATIONS, hash: "SHA-256" },
                        keyMaterial, 256
                    );
                    this.authToken = Array.from(new Uint8Array(authBits)).map(b => b.toString(16).padStart(2, '0')).join('');

                    // B. 暗号化キーの生成
                    this.encryptionKey = await subtle.deriveKey(
                        { name: "PBKDF2", salt: enc.encode(saltHex + "|enc"), iterations: ITERATIONS, hash: "SHA-256" },
                        keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
                    );

                    // C. 署名キーの生成
                    this.signingKey = await subtle.deriveKey(
                        { name: "PBKDF2", salt: enc.encode(saltHex + "|sign"), iterations: ITERATIONS, hash: "SHA-256" },
                        keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]
                    );

                    this.currentSalt = saltHex;

                } catch (e) {
                    console.error("Crypto Error:", e);
                    this.updateStatus("syncStatusError", `Crypto: ${e.name} - ${e.message}`);
                    throw e;
                }
            }

            // Encrypt: JSON -> Gzip -> AES-GCM -> HMAC
            async encryptPayload(plainDataObj, baseRevision) {
                if (!this.encryptionKey || !this.signingKey) throw new Error("No keys");
                const cryptoObj = window.crypto || window.msCrypto;

                // 1. JSON Stringify
                const jsonStr = JSON.stringify(plainDataObj);

                // 2. Gzip Compression
                const compressedBuf = await gzipCompress(jsonStr);

                // 3. Encrypt
                const iv = cryptoObj.getRandomValues(new Uint8Array(12));
                const ciphertextBuf = await cryptoObj.subtle.encrypt(
                    { name: "AES-GCM", iv: iv },
                    this.encryptionKey,
                    compressedBuf
                );

                // 4. Base64 Encoding
                const blob = new Blob([ciphertextBuf]);
                const reader = new FileReader();
                const base64Cipher = await new Promise(r => {
                    reader.onload = () => r(reader.result.split(',')[1]);
                    reader.readAsDataURL(blob);
                });
                const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');

                // 5. Sign (IV + Cipher + Revision + SyncID) -> Replay Attack防止強化
                const signSource = new TextEncoder().encode(`${ivHex}.${base64Cipher}.${baseRevision}.${this.syncId}`);
                const signatureBuf = await cryptoObj.subtle.sign(
                    "HMAC", this.signingKey, signSource
                );
                const signatureHex = Array.from(new Uint8Array(signatureBuf)).map(b => b.toString(16).padStart(2, '0')).join('');

                return {
                    baseRevision: baseRevision,
                    iv: ivHex,
                    ciphertext: base64Cipher,
                    signature: signatureHex
                };
            }

            // Decrypt: Verify -> AES-GCM -> Gunzip -> JSON
            async decryptPayload(serverBody, revision) {
                if (!this.encryptionKey || !this.signingKey) throw new Error("No keys");
                const cryptoObj = window.crypto || window.msCrypto;
                const { iv, ciphertext, signature } = serverBody;

                // 1. Verify HMAC
                if (signature && revision) {
                    const signSource = new TextEncoder().encode(`${iv}.${ciphertext}.${revision}.${this.syncId}`);
                    const signatureBuf = new Uint8Array(signature.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
                    const isValid = await cryptoObj.subtle.verify(
                        "HMAC", this.signingKey, signatureBuf, signSource
                    );
                    if (!isValid) throw new Error("Signature verification failed");
                }

                const ivBuf = new Uint8Array(iv.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

                // Base64 Decode
                const binaryString = atob(ciphertext);
                const len = binaryString.length;
                const ciphertextBuf = new Uint8Array(len);
                for (let i = 0; i < len; i++) ciphertextBuf[i] = binaryString.charCodeAt(i);

                try {
                    // 2. Decrypt
                    const decryptedBuf = await cryptoObj.subtle.decrypt(
                        { name: "AES-GCM", iv: ivBuf },
                        this.encryptionKey,
                        ciphertextBuf
                    );

                    // 3. Gunzip Decompression
                    const jsonStr = await gzipDecompress(decryptedBuf);

                    // 4. Parse
                    return JSON.parse(jsonStr);
                } catch (e) {
                    throw new Error("Decryption/Decompression Failed");
                }
            }

            // 鍵生成ヘルパー (内部利用)
            async _calcKeysFromSecret(secretStr, saltHex) {
                const cryptoObj = (typeof unsafeWindow !== 'undefined' && unsafeWindow.crypto) ? unsafeWindow.crypto : (window.crypto || window.msCrypto);
                const subtle = cryptoObj.subtle;
                const enc = new TextEncoder();
                const keyMaterial = await subtle.importKey("raw", enc.encode(secretStr), { name: "PBKDF2" }, false, ["deriveKey", "deriveBits"]);
                const ITERATIONS = 600000;

                // Auth Token
                const authBits = await subtle.deriveBits(
                    { name: "PBKDF2", salt: enc.encode(saltHex + "|auth"), iterations: ITERATIONS, hash: "SHA-256" },
                    keyMaterial, 256
                );
                const authToken = Array.from(new Uint8Array(authBits)).map(b => b.toString(16).padStart(2, '0')).join('');

                // Enc Key
                const encryptionKey = await subtle.deriveKey(
                    { name: "PBKDF2", salt: enc.encode(saltHex + "|enc"), iterations: ITERATIONS, hash: "SHA-256" },
                    keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
                );

                // Sign Key
                const signingKey = await subtle.deriveKey(
                    { name: "PBKDF2", salt: enc.encode(saltHex + "|sign"), iterations: ITERATIONS, hash: "SHA-256" },
                    keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]
                );

                return { authToken, encryptionKey, signingKey };
            }

            // パスワード変更メソッド
            async changePassword(newPassword) {
                if (this.isSyncing) return;
                if (!this.endpoint || !this.syncId || !this.secret) {
                    // ここは設定不備なので英語アラートのままでも許容、または i18n 追加
                    alert(i18n.t('syncStatusNotConfigured') || "Not Configured");
                    return;
                }

                const confirmed = confirm(i18n.t('confirmRotation'));
                if (!confirmed) return;

                this.isSyncing = true;
                this.updateStatus('syncStatusPushing', i18n.t('syncStatusRotating'));

                let success = false;

                try {
                    // 1. 新しいソルトを生成
                    const cryptoObj = (typeof unsafeWindow !== 'undefined' && unsafeWindow.crypto) ? unsafeWindow.crypto : window.crypto;
                    const arr1 = new Uint8Array(16); cryptoObj.getRandomValues(arr1);
                    const newSalt = Array.from(arr1).map(b => b.toString(16).padStart(2, '0')).join('');

                    // 2. 新しいキーペアを生成
                    const newKeys = await this._calcKeysFromSecret(newPassword, newSalt);

                    // 3. 現在のローカルデータを準備
                    const rawData = JSON.parse(buildCloudSyncPayload());

                    // 4. 新しいキーで暗号化
                    const oldEncKey = this.encryptionKey;
                    const oldSignKey = this.signingKey;

                    this.encryptionKey = newKeys.encryptionKey;
                    this.signingKey = newKeys.signingKey;

                    let encryptedBody;
                    try {
                        const localRev = parseInt(GM_getValue(DATA_REVISION_KEY, '0')) || 0;
                        encryptedBody = await this.encryptPayload(rawData, localRev);
                    } finally {
                        this.encryptionKey = oldEncKey;
                        this.signingKey = oldSignKey;
                    }

                    // 5. PUTリクエスト送信
                    const payloadToSend = {
                        ...encryptedBody,
                        salt: newSalt,
                        newAuthToken: newKeys.authToken
                    };

                    const authHeaders = {
                        'Content-Type': 'application/json',
                        'X-Sync-ID': this.syncId,
                        'Authorization': 'Bearer ' + this.authToken
                    };

                    const res = await gmFetch(this.endpoint, {
                        method: 'PUT', headers: authHeaders, body: JSON.stringify(payloadToSend)
                    });

                    if (res.status === 200) {
                        const resJson = JSON.parse(res.responseText);

                        // 6. 成功したらローカル設定を更新
                        this.secret = newPassword;
                        this.currentSalt = newSalt;
                        this.authToken = newKeys.authToken;
                        this.encryptionKey = newKeys.encryptionKey;
                        this.signingKey = newKeys.signingKey;

                        await this.saveConfig(this.endpoint, newPassword, this.syncId);

                        if (resJson.newRevision) {
                            GM_setValue(DATA_REVISION_KEY, resJson.newRevision.toString());
                            GM_deleteValue(DIRTY_KEY);
                        }

                        // UIの入力欄も更新
                        const uiInput = document.getElementById('adv-sync-secret');
                        if(uiInput) uiInput.value = newPassword;

                        success = true;

                    } else {
                        throw new Error(`Server returned ${res.status}: ${res.responseText}`);
                    }

                } catch(e) {
                    console.error("Change Password Failed:", e);
                    // エラーはトーストで表示（アラートだと操作を阻害するため）
                    showToast(`${i18n.t('toastRotationFailed')}: ${e.message}`);
                    this.updateStatus('syncStatusError', i18n.t('toastRotationFailed'));
                } finally {
                    // 7. 終了処理
                    this.isSyncing = false;

                    if (success) {
                        // 成功時: 緑アイコンにする
                        this.updateStatus('syncStatusSynced');
                        // 成功トースト
                        showToast(i18n.t('toastPassChanged'));
                    } else {
                        // 失敗時: エラー状態を維持 (再描画)
                        const currentTextEl = document.getElementById('adv-sync-status-text');
                        const currentMsg = currentTextEl ? currentTextEl.textContent : 'Error';
                        this.updateStatus(null, currentMsg);
                    }

                    updateHeaderSyncVisibility();
                }
            }

            // Smart Merge
            _mergeData(local, server) {
                const merged = { ...local };

                // Deleted Log Merge
                const localDel = local.deletedLog || {};
                const serverDel = server.deletedLog || {};
                const mergedDel = { ...localDel };

                Object.keys(serverDel).forEach(id => {
                    const sTs = serverDel[id] || 0;
                    const lTs = mergedDel[id] || 0;
                    if (sTs > lTs) mergedDel[id] = sTs;
                });
                merged.deletedLog = mergedDel;

                // List Merge Helper
                const smartMergeList = (locArr, srvArr) => {
                    if (!Array.isArray(srvArr)) srvArr = [];
                    if (!Array.isArray(locArr)) locArr = [];
                    const map = new Map();

                    // 判定用ヘルパー: 削除ログの時刻よりアイテムの更新時刻が新しければ生存させる
                    const isAlive = (item) => {
                        const delTs = mergedDel[item.id];
                        // 削除履歴がない、または 削除時刻よりもアイテム更新時刻(ts)の方が新しい場合は生存
                        if (!delTs) return true;
                        return (item.ts || 0) > delTs;
                    };

                    locArr.forEach(item => {
                        if (!isAlive(item)) return;
                        map.set(item.id, item);
                    });
                    srvArr.forEach(srvItem => {
                        if (!isAlive(srvItem)) return;

                        const locItem = map.get(srvItem.id);
                        if (!locItem) {
                            map.set(srvItem.id, srvItem);
                        } else {
                            const locTs = locItem.ts || 0;
                            const srvTs = srvItem.ts || 0;
                            if (srvTs > locTs) map.set(srvItem.id, srvItem);
                        }
                    });
                    return Array.from(map.values());
                };

                // Muted Merge Helper
                const mergeMuted = (locArr, srvArr) => {
                    if (!Array.isArray(srvArr)) return locArr;
                    const map = new Map();
                    locArr.forEach(i => {
                        if (i.id && mergedDel[i.id]) return;
                        map.set(i.word, i);
                    });
                    srvArr.forEach(i => {
                        if (i.id && mergedDel[i.id]) return;
                        const loc = map.get(i.word);
                        if (!loc || (i.ts || 0) > (loc.ts || 0)) map.set(i.word, i);
                    });
                    return Array.from(map.values());
                };

                merged.history = smartMergeList(local.history, server.history);
                merged.saved = smartMergeList(local.saved, server.saved);
                merged.favorites = smartMergeList(local.favorites, server.favorites);
                merged.accounts = smartMergeList(local.accounts, server.accounts);
                merged.lists = smartMergeList(local.lists, server.lists);
                merged.muted = mergeMuted(local.muted, server.muted);

                // --- フォルダ構造のマージ ---
                merged.folders = {
                    accounts: smartMergeList(local.folders?.accounts, server.folders?.accounts),
                    lists:    smartMergeList(local.folders?.lists,    server.folders?.lists),
                    saved:    smartMergeList(local.folders?.saved,    server.folders?.saved)
                };

                // --- 未分類位置(Unassigned Index)のマージ ---
                merged.unassignedIndex = {
                    ...(local.unassignedIndex || {}),
                    ...(server.unassignedIndex || {})
                };

                if (local.favoriteTags && server.favoriteTags) {
                    merged.favoriteTags = { ...local.favoriteTags };
                    merged.favoriteTags.tags = smartMergeList(local.favoriteTags.tags || [], server.favoriteTags.tags || []);
                    merged.favoriteTags.tweetTags = { ...(local.favoriteTags.tweetTags || {}) };
                    Object.entries(server.favoriteTags.tweetTags || {}).forEach(([tid, tagId]) => {
                        if (!merged.favoriteTags.tweetTags[tid]) merged.favoriteTags.tweetTags[tid] = tagId;
                    });
                }
                return merged;
            }

            updateStatus(msgKey, rawMsg = null) {
                const text = rawMsg ? rawMsg : (msgKey ? i18n.t(msgKey) : '');
                const el = document.getElementById('adv-sync-status-text');
                if (el) el.textContent = text;

                const dot = document.getElementById('adv-sync-status-dot');
                const spinner = document.getElementById('adv-sync-spinner');
                const btn = document.getElementById('adv-sync-now-btn');

                if (dot) {
                    dot.style.opacity = '1';
                    if (msgKey === 'syncStatusSynced' || (msgKey === 'syncStatusIdle' && this.endpoint && this.secret)) {
                        dot.style.backgroundColor = '#17bf63'; // Green (Success/Connected)
                    } else if (msgKey === 'syncStatusError' || msgKey === 'toastSyncFailed') {
                        dot.style.backgroundColor = '#f4212e'; // Red (Error)
                    } else if (msgKey === 'syncStatusNotConfigured' || (!this.endpoint)) {
                        dot.style.backgroundColor = 'var(--modal-text-secondary)'; // Grey
                        dot.style.opacity = '0.5';
                    } else {
                        dot.style.backgroundColor = '#1d9bf0'; // Blue (Working...)
                    }
                }
                if (spinner) spinner.style.display = this.isSyncing ? 'block' : 'none';
                if (btn) {
                    if (this.isSyncing) {
                        btn.disabled = true;
                        btn.textContent = i18n.t('syncStatusConnecting');
                        btn.style.opacity = '0.7';
                    } else {
                        btn.disabled = false;
                        btn.textContent = i18n.t('buttonSyncNow');
                        btn.style.opacity = '1';
                    }
                }
                if (headerSyncBtn) {
                    if (this.isSyncing) headerSyncBtn.classList.add('spinning');
                    else headerSyncBtn.classList.remove('spinning');
                }
            }

            // Execute Sync with Handshake Flow
            async executeSync() {
                // 実行中なら予約フラグを立てて終了
                if (this.isSyncing) {
                    this.nextSyncScheduled = true;
                    return;
                }
                if (GM_getValue(SYNC_ENABLED_KEY, '0') !== '1') return;

                const startTime = Date.now();
                const MIN_DURATION = 1360;

                const errLog = document.getElementById('adv-sync-error-log');
                if (errLog) { errLog.style.display = 'none'; errLog.textContent = ''; }

                if (!this.endpoint || !this.syncId || !this.secret) {
                    this.updateStatus('syncStatusNotConfigured');
                    return;
                }

                this.isSyncing = true;
                // 今回の同期サイクルで処理する変更分として、フラグを一旦下ろす
                this.pendingChanges = false;

                this.updateStatus('syncStatusConnecting');
                if (typeof headerSyncBtn !== 'undefined' && headerSyncBtn) {
                    headerSyncBtn.classList.remove('success', 'error');
                    headerSyncBtn.title = (typeof i18n !== 'undefined' ? i18n.t('syncStatusConnecting') : 'Connecting...');
                }

                let success = false;
                let errorMsg = "";

                try {
                    // Phase 1: Handshake
                    const handshakeHeaders = { 'Content-Type': 'application/json', 'X-Sync-ID': this.syncId };
                    const handshakeRes = await gmFetch(this.endpoint, { method: 'GET', headers: handshakeHeaders });

                    let targetSalt = null;
                    if (handshakeRes.status === 200) {
                        const info = JSON.parse(handshakeRes.responseText);
                        if (info.status === 'exists' && info.salt) {
                            targetSalt = info.salt;
                        } else {
                            const cryptoObj = (typeof unsafeWindow !== 'undefined' && unsafeWindow.crypto) ? unsafeWindow.crypto : window.crypto;
                            const arr1 = new Uint8Array(16); cryptoObj.getRandomValues(arr1);
                            targetSalt = Array.from(arr1).map(b => b.toString(16).padStart(2, '0')).join('');
                        }
                    } else if (handshakeRes.status === 400) {
                        throw new Error("Invalid Sync ID format");
                    } else {
                        throw new Error(`Handshake failed: ${handshakeRes.status}`);
                    }

                    await new Promise(r => setTimeout(r, 50));
                    await this.deriveKeys(targetSalt);

                    // Phase 3: Authenticated Sync
                    const localRev = parseInt(GM_getValue(DATA_REVISION_KEY, '0')) || 0;
                    const isDirty = GM_getValue(DIRTY_KEY, '0') === '1';

                    const authHeaders = {
                        'Content-Type': 'application/json',
                        'X-Sync-ID': this.syncId,
                        'Authorization': 'Bearer ' + this.authToken
                    };

                    // 3-A. GET Data (Revision Check)
                    const cacheBuster = (this.endpoint.includes('?') ? '&' : '?') + 't=' + Date.now();
                    const getRes = await gmFetch(this.endpoint + cacheBuster, { method: 'GET', headers: authHeaders });

                    if (getRes.status === 200) {
                        const serverWrapper = JSON.parse(getRes.responseText);
                        const serverRev = serverWrapper.revision || 0;

                        if (serverRev > localRev) {
                            this.updateStatus('syncStatusPulling');
                            if (serverWrapper.chunks) {
                                const fullCipherStr = serverWrapper.chunks.map(c => c.data).join("");
                                const serverDataObj = JSON.parse(fullCipherStr);
                                const decrypted = await this.decryptPayload(serverDataObj, serverRev - 1);

                                let importSuccess = false;
                                await withIoLock(async () => {
                                    const currentLocal = JSON.parse(buildCloudSyncPayload());
                                    const merged = this._mergeData(currentLocal, decrypted);
                                    importSuccess = applySettingsImportJSON(JSON.stringify(merged));
                                });

                                if (importSuccess) {
                                    GM_setValue(DATA_REVISION_KEY, serverRev.toString());
                                    // Dirty削除は最後にまとめて行うためここではスキップ
                                    success = true;
                                } else {
                                    throw new Error("Import failed");
                                }
                            }
                        } else if (serverRev === localRev && !isDirty) {
                            success = true;
                        }
                    } else if (getRes.status === 403 || getRes.status === 401) {
                        throw new Error("Auth Failed: Wrong Password");
                    }

                    // 3-B. POST Data (Push)
                    if (!success) {
                        this.updateStatus('syncStatusPushing');
                        const rawData = JSON.parse(buildCloudSyncPayload());
                        const encryptedBody = await this.encryptPayload(rawData, localRev);

                        const payloadToSend = {
                            ...encryptedBody,
                            salt: this.currentSalt
                        };

                        const postRes = await gmFetch(this.endpoint, {
                            method: 'POST', headers: authHeaders, body: JSON.stringify(payloadToSend)
                        });

                        if (postRes.status === 200) {
                            const resJson = JSON.parse(postRes.responseText);
                            if (resJson.newRevision) {
                                GM_setValue(DATA_REVISION_KEY, resJson.newRevision.toString());
                            }
                            success = true;
                        } else if (postRes.status === 409) {
                            this.updateStatus('syncStatusMerging');
                            const conflictBody = JSON.parse(postRes.responseText);
                            if (conflictBody.salt && conflictBody.salt !== this.currentSalt) {
                                console.warn("[Sync] Salt mismatch detected. Re-deriving keys...");
                                await this.deriveKeys(conflictBody.salt);
                                authHeaders['Authorization'] = 'Bearer ' + this.authToken;
                            }
                            const sChunks = conflictBody.serverChunks || [];
                            const sCipherStr = sChunks.map(c => c.data).join("");
                            const sEncData = JSON.parse(sCipherStr);
                            const sRev = conflictBody.currentRevision;

                            if (sEncData) {
                                const sData = await this.decryptPayload(sEncData, sRev - 1);
                                let merged = null;
                                await withIoLock(async () => {
                                    const currentLocal = JSON.parse(buildCloudSyncPayload());
                                    merged = this._mergeData(currentLocal, sData);
                                    applySettingsImportJSON(JSON.stringify(merged));
                                });
                                const mergedEncrypted = await this.encryptPayload(merged, sRev);
                                const retryPayload = { ...mergedEncrypted, salt: this.currentSalt };

                                const retryRes = await gmFetch(this.endpoint, {
                                    method: 'POST', headers: authHeaders, body: JSON.stringify(retryPayload)
                                });
                                if (retryRes.status === 200) {
                                    const rJson = JSON.parse(retryRes.responseText);
                                    GM_setValue(DATA_REVISION_KEY, rJson.newRevision.toString());
                                    success = true;
                                } else {
                                    throw new Error(`Merge retry failed: ${retryRes.status}`);
                                }
                            }
                        } else {
                            throw new Error(`Upload failed: ${postRes.status}`);
                        }
                    }

                    // 成功時に「今回の同期中に新たな変更がなかった場合のみ」フラグを消す
                    if (success) {
                        if (!this.pendingChanges) {
                            GM_deleteValue(DIRTY_KEY);
                        }
                    }

                } catch (e) {
                    console.error('[Sync] Error:', e);
                    errorMsg = e.message || 'Error';
                    if (errLog) {
                        errLog.textContent = errorMsg;
                        errLog.style.display = 'block';
                    }
                    success = false;
                } finally {
                    const elapsed = Date.now() - startTime;
                    const remaining = MIN_DURATION - elapsed;
                    if (remaining > 0) await new Promise(r => setTimeout(r, remaining));

                    this.isSyncing = false;

                    // pendingChanges が true なら、Dirtyフラグが残っているので再実行する
                    if (this.nextSyncScheduled || this.pendingChanges) {
                        this.nextSyncScheduled = false;
                        setTimeout(() => this.executeSync(), 100);
                    }

                    if (success) {
                        this.updateStatus('syncStatusSynced');
                        if (typeof headerSyncBtn !== 'undefined' && headerSyncBtn) {
                            headerSyncBtn.classList.add('success');
                            headerSyncBtn.title = (typeof i18n !== 'undefined' ? i18n.t('toastSynced') : 'Synced');
                            showToast(typeof i18n !== 'undefined' ? i18n.t('toastSynced') : 'Synced');
                        }
                    } else {
                        this.updateStatus('syncStatusError');
                        if (typeof headerSyncBtn !== 'undefined' && headerSyncBtn) {
                            headerSyncBtn.classList.add('error');
                            headerSyncBtn.title = (typeof i18n !== 'undefined' ? `${i18n.t('toastSyncFailed')}: ${errorMsg}` : 'Failed');
                            showToast(typeof i18n !== 'undefined' ? i18n.t('toastSyncFailed') : 'Failed');
                        }
                    }
                    if (typeof headerSyncBtn !== 'undefined' && headerSyncBtn) {
                        headerSyncBtn.classList.remove('spinning');
                        setTimeout(() => {
                            headerSyncBtn.classList.remove('success', 'error');
                            headerSyncBtn.title = (typeof i18n !== 'undefined' ? i18n.t('buttonSyncNow') : 'Sync Now');
                        }, 3000);
                    }
                }
            }
        }

        syncManager = new SyncManager();

        // UI Event Listeners for Sync
        const syncEnableToggle = document.getElementById('adv-settings-sync-enable');
        const syncContainer = document.getElementById('adv-sync-settings-container');
        const syncEpInput = document.getElementById('adv-sync-endpoint');
        const syncIdInput = document.getElementById('adv-sync-id');
        const syncScInput = document.getElementById('adv-sync-secret');
        const syncSecretToggle = document.getElementById('adv-sync-secret-toggle');
        const syncGenBtn  = document.getElementById('adv-sync-gen-id-btn');
        const syncBtn     = document.getElementById('adv-sync-now-btn');

        // トグル制御と実行ガードの追加
        if (syncEpInput && syncIdInput && syncScInput && syncBtn && syncEnableToggle && syncContainer) {

            // 1. 初期状態の適用 (ON/OFF)
            const isSyncEnabled = kv.get(SYNC_ENABLED_KEY, '0') === '1';
            syncEnableToggle.checked = isSyncEnabled;
            syncContainer.style.display = isSyncEnabled ? 'block' : 'none';

            // 2. 値のセット
            syncEpInput.value = syncManager.endpoint;
            syncIdInput.value = syncManager.syncId;
            syncScInput.value = syncManager.secret;

            const saveConf = async () => {
                await syncManager.saveConfig(syncEpInput.value, syncScInput.value, syncIdInput.value);
                updateHeaderSyncVisibility();
            };

            // 3. トグルのイベントリスナー
            syncEnableToggle.addEventListener('change', () => {
                const enabled = syncEnableToggle.checked;
                kv.set(SYNC_ENABLED_KEY, enabled ? '1' : '0');
                syncContainer.style.display = enabled ? 'block' : 'none';

                // ヘッダーボタンの表示更新
                updateHeaderSyncVisibility();

                // ONになった瞬間にまだ同期していなければ、自動で走らせても親切かもしれないが
                // ここではユーザーの意図しない通信を防ぐため手動または自動トリガーに任せる
            });

            syncEpInput.addEventListener('change', saveConf);
            syncIdInput.addEventListener('change', saveConf);
            syncScInput.addEventListener('change', saveConf);

            // パスワード表示切り替えロジック
            if (syncScInput && syncSecretToggle) {
                const EYE_OPEN_SVG = `<svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:currentColor;"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"></path></svg>`;
                const EYE_CLOSED_SVG = `<svg viewBox="0 0 24 24" style="width:18px; height:18px; fill:currentColor;"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"></path></svg>`;

                syncSecretToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    const isPassword = syncScInput.type === 'password';
                    syncScInput.type = isPassword ? 'text' : 'password';
                    setInnerHTML(syncSecretToggle,isPassword ? EYE_CLOSED_SVG : EYE_OPEN_SVG);
                    syncSecretToggle.title = isPassword ? 'Hide Password' : 'Show Password';
                });
            }

            if (syncGenBtn) {
                syncGenBtn.addEventListener('click', () => {
                    const uuid = crypto.randomUUID
                        ? crypto.randomUUID()
                        : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                            return v.toString(16);
                          });
                    syncIdInput.value = uuid;
                    saveConf();
                });
            }

            syncBtn.addEventListener('click', async () => {
                await saveConf();
                // 実行時にも念のためONかチェック (UI上は隠れているが、コード呼び出しの整合性として)
                if (syncEnableToggle.checked) {
                    syncManager.executeSync();
                }
            });

            // パスワード変更ボタンのイベントリスナー
            const changePassBtn = document.getElementById('adv-sync-change-pass-btn');
            if (changePassBtn) {
                changePassBtn.addEventListener('click', () => {
                    const newPass = prompt(i18n.t('promptNewPassword'), "");
                    if (newPass && newPass.trim()) {
                        syncManager.changePassword(newPass.trim());
                    }
                });
            }
        }

        // Auto-sync on load if configured AND ENABLED
        // ロード時の自動同期も、トグルがONのときのみ実行する
        if (kv.get(SYNC_ENABLED_KEY, '0') === '1' && syncManager.endpoint && syncManager.secret && syncManager.syncId) {
            setTimeout(() => syncManager.executeSync(), 2000);
        }

        setupObservers();

        // イベント委任のためのルート要素を取得
        const appContainer = document.querySelector('div[data-testid="app-container"]') || document.body;

        // 監視対象セレクタを結合
        const allSearchSelectorsStr = searchInputSelectors.join(', ');

        // 1. 検索ボックスの入力 (イベント委任)
        appContainer.addEventListener('input', (e) => {
            if (!e.target || !e.target.matches(allSearchSelectorsStr)) return;
            const input = e.target;

            if (isUpdating || modal.style.display === 'none') return;

            const activeInputs = getActiveSearchInputs();
            if (activeInputs.includes(input)) {
                parseQueryAndApplyToModal(input.value);
                applyScopesToControls(readScopesFromURL());
                updateSaveButtonState();
            }
        });

        // 2. タイピングガード (イベント委任)
        const typingEvents = ['input', 'keydown', 'keyup', 'compositionstart', 'compositionupdate', 'compositionend'];
        typingEvents.forEach(evName => {
            appContainer.addEventListener(evName, (e) => {
                if (e.target && e.target.matches(allSearchSelectorsStr)) {
                    markTyping();
                }
            }, { passive: true, capture: true }); // capture: true でより確実に補足
        });

        // 検索入力中、アプリ全体を持ち上げてサジェストを表示しつつ、サイドバーのノイズを隠す
        const handleNativeSearchFocus = (e) => {
            const target = e.target;
            if (!target || target.nodeType !== 1) return;

            const isSearchInput = target.matches(allSearchSelectorsStr) ||
                                  target.getAttribute('data-testid') === 'SearchBox_Search_Input';
            if (!isSearchInput) return;

            const modalEl = document.getElementById('advanced-search-modal');
            const reactRoot = document.getElementById('react-root');

            if (!modalEl || !reactRoot) return;

            // モーダルが表示されているかチェック (非表示なら何もしない)
            const isModalVisible = window.getComputedStyle(modalEl).display !== 'none';

            if (e.type === 'focusin') {
                // モーダルが開いている時だけ発動
                if (isModalVisible) {
                    modalEl.classList.add('adv-z-lower');
                    reactRoot.classList.add('adv-app-lifted');

                    // モーダルの位置を確認し、左メニューと被るなら左メニューを隠すフラグを立てる
                    const modalRect = modalEl.getBoundingClientRect();
                    // 左メニューの幅は最大で275px程度(PC版)
                    // モーダルの左端が 300px 未満なら「左メニューの上に重なっている」とみなす
                    if (modalRect.left < 300) {
                        reactRoot.classList.add('adv-overlap-left-menu');
                    } else {
                        reactRoot.classList.remove('adv-overlap-left-menu');
                    }
                }
            } else if (e.type === 'focusout') {
                // クリック猶予を持たせて元に戻す
                setTimeout(() => {
                    modalEl.classList.remove('adv-z-lower');
                    reactRoot.classList.remove('adv-app-lifted');
                    reactRoot.classList.remove('adv-overlap-left-menu'); //フラグ解除
                }, 200);
            }
        };
        appContainer.addEventListener('focusin', handleNativeSearchFocus);
        appContainer.addEventListener('focusout', handleNativeSearchFocus);

        // 3. フォーム送信 (イベント委任)
        appContainer.addEventListener('submit', (e) => {
            if (!e.target || !e.target.closest('form')) return;

            // SearchBox_Search_Input を含むフォームか判定
            const input = e.target.querySelector('input[data-testid="SearchBox_Search_Input"]');
            if (input) {
                const val = (input.value || '').trim();
                const {pf, lf} = readScopesFromControls();
                if (val) recordHistory(val, pf, lf);
            }
        }, true); // キャプチャフェーズで実行

        // ▼ Setup background drop zones ▼
        // （このブロックは、最初の renderAccounts / renderLists / renderSaved を呼ぶ前に置く）
        setupBackgroundDrop(tabAccountsPanel, accountsListEl,  unassignAccount);
        setupBackgroundDrop(tabListsPanel,    advListsListEl,  unassignList);
        setupBackgroundDrop(tabSavedPanel,    advSavedListEl,  unassignSaved);

        // ft_init を最優先で実行し、stateをロードさせる
        if (typeof ft_init === 'function') {
            ft_init();
        }

        // 万が一ロード失敗していた場合に備え、デフォルトStateを注入して null落ちを防ぐ
        if (typeof ft_state === 'undefined' || !ft_state) {
            ft_state = ft_createDefaultState();
        }

        setupFavoritesDelegation();
        // スマホ対応用：タッチ操作をドラッグ操作へ変換するリスナーを登録
        enableMobileDragSupport();
        // 保存された最後のタブを読み込んでアクティブにする
        const initTabSetting = kv.get(INITIAL_TAB_KEY, 'last'); // 設定を取得 (デフォルトは 'last')
        let targetTab = 'search';

        if (initTabSetting === 'last') {
            // 'last' の場合は前回開いていたタブを使う
            targetTab = kv.get(LAST_TAB_KEY, 'search');
        } else {
            // それ以外の場合は指定されたタブを使う
            targetTab = initTabSetting;
        }

        // もし指定されたタブが設定で「非表示」になっている場合、activateTab 内部のロジックで
        // 自動的に 'search' 等の表示可能なタブにフォールバックされるため、ここでは単純に渡すだけでOK
        activateTab(targetTab || 'search');
        (async () => {
            const input = await waitForElement(searchInputSelectors.join(','), 7000);

            // 検索窓が見つかったらリサイザー設置
            setupNativeSearchResizer();

            if (input) {
                syncFromSearchBoxToModal();
                applyScopesToControls(readScopesFromURL());
                updateSaveButtonState();
                processNewTweets(true);

                // force=true で初回描画を強制
                ensureProfileAddButton(true);
                ensureListAddButton(true);

                /* --- Favorite Tags Init Scan --- */
                try {
                   processNewTweets(true);
                } catch(e) { console.error('[FT] Init error', e); }
            }
        })();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
};

// --- 環境判定ブートローダー ---
// 1. UserScript環境: GM_info があり、かつアダプターによる遅延実行待ち(window.__X_ADV_SEARCH_MAIN__)ではない場合
if (typeof GM_info !== 'undefined' && typeof window.__X_ADV_SEARCH_MAIN__ === 'undefined') {
    __X_ADV_SEARCH_MAIN_LOGIC__();
}
// 2. 拡張機能環境: adapter.js から呼ばれるのを待つために window に公開
else {
    window.__X_ADV_SEARCH_MAIN__ = __X_ADV_SEARCH_MAIN_LOGIC__;
}
