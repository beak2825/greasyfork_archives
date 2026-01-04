// ==UserScript==
// @name         Standard Notes 日本語化 & IME修正
// @version      1.9.8
// @description  Standard Notesを完全に日本語化し、FirefoxでのIME入力バグを修正します。
// @namespace    https://github.com/koyasi777/standardnotes-ja-localizer
// @author       koyasi777
// @match        https://app.standardnotes.com/*
// @grant        none
// @license      MIT
// @homepageURL  https://github.com/koyasi777/standardnotes-ja-localizer
// @supportURL   https://github.com/koyasi777/standardnotes-ja-localizer/issues
// @icon         https://app.standardnotes.com/favicon/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/534574/Standard%20Notes%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%8C%96%20%20IME%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/534574/Standard%20Notes%20%E6%97%A5%E6%9C%AC%E8%AA%9E%E5%8C%96%20%20IME%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');

  // --- 翻訳・書式設定ヘルパー関数 ---

  const enToJaUnits = {
    'words': '単語', 'word': '単語', 'characters': '文字', 'character': '文字',
    'paragraphs': '段落', 'paragraph': '段落',
  };
  const enToJaWeek = { 'Sun': '日', 'Mon': '月', 'Tue': '火', 'Wed': '水', 'Thu': '木', 'Fri': '金', 'Sat': '土' };
  const enToNumMonth = {
    'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4', 'May': '5', 'Jun': '6',
    'Jul': '7', 'Aug': '8', 'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12',
  };
  const jaWeekShort = { '日': '日', '月': '月', '火': '火', '水': '水', '木': '木', '金': '金', '土': '土' };

  /**
   * 時間単位を日本語に翻訳します。（例: "5 minutes" -> "5分"）
   * @param {string} text - 翻訳するテキスト。
   * @returns {string} 翻訳後のテキスト。
   */
  function translateTimeUnit(text) {
    if (!text || typeof text !== 'string') return text;
    const unitMap = { second: '秒', minute: '分', hour: '時間', day: '日', week: '週間' };
    let newText = text.replace(/<\s*(\d+)\s*(seconds?|minutes?|hours?|days?|weeks?)/g, (m, num, unit) =>
      `< ${num}${unitMap[unit.replace(/s$/, '')] || unit}`);
    newText = newText.replace(/(\d+)\s*(seconds?|minutes?|hours?|days?|weeks?)/g, (m, num, unit) =>
      `${num}${unitMap[unit.replace(/s$/, '')] || unit}`);
    return newText.replace(/less than a minute/i, "1分未満");
  }

  /**
   * 英語の日付書式を日本語の「YYYY/MM/DD (曜)」形式に変換します。
   * 元の文字列にラベル等が含まれていても、日付部分のみを置換します。
   * @param {string} str - 変換する日付文字列。
   * @returns {string} 変換後の日付文字列。
   */
  function convertDateFormat(str) {
    if (!str || typeof str !== 'string') return str;

    // 複数の日付形式に対応 ("Mon, Apr 29, 2024", "Thu Jun 26 2025")
    const dateRegex = /\b(?<wday>Sun|Mon|Tue|Wed|Thu|Fri|Sat|日|月|火|水|木|金|土)\s*,?\s+(?<month>Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|[0-9]{1,2}月)\s+(?<day>\d{1,2}),?\s+(?<year>\d{4})/;
    const match = str.match(dateRegex);

    if (match && match.groups) {
      const { wday, month, day, year } = match.groups;
      const jaWday = enToJaWeek[wday] || jaWeekShort[wday] || wday;
      const numMonth = enToNumMonth[month] || month.replace('月', '');
      let jaDate = `${year}/${String(numMonth).padStart(2, '0')}/${String(day).padStart(2, '0')} (${jaWday})`;

      // 時間部分をマッチング
      const timeMatch = str.match(/\b\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM)?\b/);
      let originalFullMatch = match[0];

      if (timeMatch) {
        // 日付のマッチの終わりから時間のマッチの終わりまでを置換対象とする
        const endIndex = timeMatch.index + timeMatch[0].length;
        originalFullMatch = str.substring(match.index, endIndex);
        jaDate += ' ' + timeMatch[0].trim();
      }

      return str.replace(originalFullMatch, jaDate);
    }
    return str;
  }

  /**
   * 指定されたDOM要素内を再帰的に探索し、テキストノードを翻訳マップに基づいて日本語化します。
   * @param {Node} node - 探索を開始するDOMノード。
   * @param {Object} map - 翻訳辞書オブジェクト。
   */
  const walkAndTranslate = (node, map) => {
    if (!node) return;

    if (node.nodeType === Node.TEXT_NODE) {
      const trimmedText = node.nodeValue.trim();
      if (map[trimmedText]) {
        node.nodeValue = node.nodeValue.replace(trimmedText, map[trimmedText]);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.closest('[data-ignore-translation="true"]')) {
        return;
      }
      Array.from(node.childNodes).forEach(child => walkAndTranslate(child, map));
    }
  };

  /**
   * 指定されたDOM要素内のテキストノードを再帰的に探索し、日付と時刻の書式を日本語化します。
   * @param {Node} node - 探索を開始するDOMノード。
   */
  const walkAndFormatDate = (node) => {
    if (!node) return;
    if (node.nodeType === Node.TEXT_NODE) {
      let newText = convertDateFormat(translateTimeUnit(node.nodeValue));
      if (node.nodeValue !== newText) {
        node.nodeValue = newText;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
        Array.from(node.childNodes).forEach(child => walkAndFormatDate(child));
      }
    }
  };


  // --- IME修正 & スタイル適用 ---

  const applyEditorStyle = () => {
    const editor = document.getElementById('note-text-editor');
    if (editor) {
      editor.style.fontFamily = `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`;
    }
  };

  const setupTitleField = () => {
    const titleInput = document.getElementById('note-title-editor');
    if (!titleInput || titleInput.dataset.enterHandled) return;
    titleInput.dataset.enterHandled = 'true';

    let isComposing = false;

    if (isFirefox) {
      let preventNextBlur = false;
      let savedStart = 0;
      let savedEnd = 0;

      titleInput.addEventListener('compositionstart', () => {
        isComposing = true;
      });

      titleInput.addEventListener('compositionend', () => {
        isComposing = false;
        preventNextBlur = true;
        setTimeout(() => {
          savedStart = titleInput.selectionStart;
          savedEnd = titleInput.selectionEnd;
        }, 0);
      });

      titleInput.addEventListener('blur', () => {
        if (preventNextBlur) {
          preventNextBlur = false;
          setTimeout(() => {
            titleInput.focus();
            titleInput.setSelectionRange(savedStart, savedEnd);
          }, 0);
        }
      });
    } else {
      titleInput.addEventListener('compositionstart', () => { isComposing = true; });
      titleInput.addEventListener('compositionend', () => { isComposing = false; });
    }

    titleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (isComposing) {
          return;
        }
        const customEvent = new CustomEvent('sn:title:enter', {
          bubbles: true,
          cancelable: true
        });
        titleInput.dispatchEvent(customEvent);
      }
    }, true);
  };


  // --- 各UI要素の日本語化関数 ---

  const localizeDisplayOptions = () => {
    const map = {
      "Display options": "表示オプション", "Done": "完了", "Preferences for": "次の設定対象",
      "Sort by": "並び替え順", "Date modified": "変更日", "Creation date": "作成日",
      "Title": "タイトル", "View": "表示形式", "Show note preview": "ノートプレビューを表示",
      "Show date": "日付を表示", "Show tags": "タグを表示", "Show icon": "アイコンを表示",
      "Other": "その他", "Show pinned": "ピン留めを表示",
      "Show protected": "保護されたノートを表示", "Show archived": "アーカイブ済みノートを表示",
      "Show trashed": "ゴミ箱内ノートを表示", "New note defaults": "新規ノートのデフォルト設定",
      "Note Type": "ノートタイプ", "Title Format": "タイトル形式", "Current date and time": "現在の日時",
      "Current note count": "ノート数", "Custom format": "カスタム形式", "Empty": "空欄",
      "Global": "グローバル",
    };

    const translate = () => {
      const menu = document.querySelector('menu[aria-label="Notes list options menu"]');
      if (!menu) return;

      const popoverContainer = menu.closest('[data-popover]');
      if (!popoverContainer || popoverContainer.dataset.localized === 'display-options') return;

      walkAndTranslate(popoverContainer, map);
      popoverContainer.dataset.localized = 'display-options';
    };

    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeSidebarViews = () => {
    const map = {
      "Views": "ビュー", "Notes": "ノート一覧", "Files": "ファイル", "Starred": "お気に入り",
      "Archived": "アーカイブ", "Trash": "ゴミ箱", "Untagged": "タグなし",
      "Create a new smart view": "スマートビューを作成"
    };

    const translate = () => {
      document.querySelectorAll('.section-title-bar .title, #react-tag-all-notes, #react-tag-files, #react-tag-starred-notes, #react-tag-archived-notes, #react-tag-trashed-notes, #react-tag-untagged-notes')
        .forEach(el => walkAndTranslate(el, map));

      const btn = document.querySelector('button[title="Create a new smart view"]');
      if (btn && btn.title !== map["Create a new smart view"]) {
        btn.title = map["Create a new smart view"];
        btn.setAttribute('aria-label', map["Create a new smart view"]);
      }
    };

    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeTagsSection = () => {
    const map = {
      "Tags": "タグ", "Folders": "フォルダ", "Create a new tag (Ctrl+Alt+N)": "タグを作成（Ctrl+Alt+N）"
    };

    const translate = () => {
      document.querySelectorAll('.section-title-bar .title').forEach(el => walkAndTranslate(el, map));
      const btn = document.querySelector('button[title="Create a new tag (Ctrl+Alt+N)"]');
      if (btn && btn.title !== map["Create a new tag (Ctrl+Alt+N)"]) {
        btn.title = map["Create a new tag (Ctrl+Alt+N)"];
        btn.setAttribute('aria-label', map["Create a new tag (Ctrl+Alt+N)"]);
      }
    };

    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeSearchBoxes = () => {
    const map = { "Search...": "検索...", "Search tags...": "タグを検索..." };
    const translate = () => {
      document.querySelectorAll('input[placeholder]').forEach(input => {
        const p = input.placeholder.trim();
        if (map[p]) input.placeholder = map[p];
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeSearchMessages = () => {
    const map = {
      "No smart views found. Try a different search.": "スマートビューが見つかりません。他の検索条件をお試しください。",
      "No tags found. Try a different search.": "タグが見つかりません。他の検索条件をお試しください。",
    };
    const translate = () => {
      document.querySelectorAll('#navigation-content section div').forEach(el => {
        const raw = el.textContent.trim();
        if (map[raw]) el.textContent = map[raw];
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeFilterButtons = () => {
    const map = { "Protected Contents": "保護されたノート", "Archived": "アーカイブ済み", "Trashed": "ゴミ箱" };
    const translate = () => {
      document.querySelectorAll('button[role="checkbox"]').forEach(btn => {
        if (map[btn.textContent.trim()]) {
          btn.textContent = map[btn.textContent.trim()];
        }
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeNoteOptionsMenu = () => {
    const map = {
      "Note history": "ノート履歴", "Editor width": "エディタ幅", "Prevent editing": "編集禁止",
      "Show preview": "プレビューを表示", "Password protect": "パスワード保護", "Change note type": "ノートタイプ変更",
      "Add tag": "タグを追加", "Star": "スターを付ける", "Pin to top": "トップに固定",
      "Export": "エクスポート", "Duplicate": "複製", "Archive": "アーカイブ",
      "Move to trash": "ゴミ箱に移動", "Listed actions": "アクション一覧", "Spellcheck": "スペルチェック",
      "Restore": "元に戻す", "Delete permanently": "完全に削除", "Empty Trash": "ゴミ箱を空にする",
      "Unstar": "お気に入りから外す", "Unarchive": "アーカイブを解除",
    };

    const translate = () => {
      document.querySelectorAll('menu [role="menuitem"], [role="menuitemcheckbox"], span.text-danger, div.text-danger')
        .forEach(button => {
          walkAndTranslate(button, map);
        });

      document.querySelectorAll('.text-xs').forEach(span => {
        const match = span.textContent.trim().match(/^(\d+)\s+notes in Trash$/);
        if (match) {
          span.textContent = `${match[1]} 件のノートがゴミ箱内にあります`;
        }
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeNoteFooterInfo = () => {
    const map = {
      "Read time:": "読了時間：", "Last modified:": "最終更新：", "Created:": "作成日：",
      "Note ID:": "ノートID：", "Size:": "サイズ："
    };
    const translate = () => {
      document.querySelectorAll('.select-text span.font-semibold').forEach(span => {
        walkAndTranslate(span, map);
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeChallengeModal = () => {
    const map = {
      "Authentication is required to approve this note for Listed": "このノートをListedに公開するには認証が必要です",
      "Account Password": "アカウントのパスワード", "Show/hide password": "パスワードを表示/非表示",
      "Allow protected access for": "保護されたアクセスの許可期間",
      "1 Minute": "1分", "5 Minutes": "5分", "1 Hour": "1時間", "1 Week": "1週間", "Submit": "送信"
    };
    const translate = () => {
      document.querySelectorAll('[role="dialog"], [data-dialog]').forEach(dialog => {
        if (dialog.querySelector('input[type="password"]')) {
          walkAndTranslate(dialog, map);
          dialog.querySelectorAll('input[placeholder], button[aria-label]').forEach(el => {
            const attr = el.hasAttribute('placeholder') ? 'placeholder' : 'aria-label';
            const val = el.getAttribute(attr);
            if (map[val]) el.setAttribute(attr, map[val]);
          });
        }
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeAccountMenu = () => {
    const map = {
      "Account": "アカウント", "You're signed in as:": "サインイン中:", "Last synced:": "最終同期:",
      "Switch workspace": "ワークスペースを切り替え", "Account settings": "アカウント設定", "Import": "インポート",
      "Help & feedback": "ヘルプとフィードバック", "Keyboard shortcuts": "キーボードショートカット",
      "Sign out workspace": "ワークスペースからサインアウト"
    };
    const translate = () => {
      const menu = document.querySelector('#account-menu');
      if (menu) {
        walkAndTranslate(menu, map);
      }
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizeQuickSettingsMenu = () => {
    const map = {
      "Appearance": "外観", "Default": "デフォルト", "Dark": "ダーク", "Autobiography": "オートバイオグラフィー",
      "Carbon": "カーボン", "Futura": "フューチュラ", "Midnight": "ミッドナイト", "Solarized Dark": "ソラライズドダーク",
      "Titanium": "チタニウム", "Dynamic Panels": "ダイナミックパネル", "Focus Mode": "フォーカスモード",
      "Show Tags Panel": "タグパネルを表示", "Show Notes Panel": "ノートパネルを表示"
    };
    const translate = () => {
      const menu = document.querySelector('[aria-label="Quick settings menu"]');
      if (menu) {
        walkAndTranslate(menu, map);
      }
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  const localizePreferencesDialog = () => {
    const map = {
      // --- Menu ---
      "What's New": "新着情報", "Account": "アカウント", "General": "一般", "Security": "セキュリティ",
      "Backups": "バックアップ", "Appearance": "外観", "Listed": "Listed（公開）", "Plugins": "プラグイン",
      "Help & feedback": "ヘルプとフィードバック", "Preferences Menu": "設定メニュー", "Labs": "ラボ",

      // --- Dialog Title & Close Button ---
      "Your preferences for Standard Notes": "Standard Notesの設定", "Close preferences": "設定を閉じる",

      // --- General Panel ---
      "When opening the app, show...": "アプリ起動時に表示する内容", "The first note in the list": "ノート一覧の最初のノート",
      "The last viewed note": "最後に表示していたノート", "Defaults": "デフォルト設定", "Spellcheck": "スペルチェック",
      "The default spellcheck value for new notes. Spellcheck can be configured per note from the note context menu. Spellcheck may degrade overall typing performance with long notes.": "新規ノートのデフォルトのスペルチェック設定です。スペルチェックは各ノートのメニューで個別に設定できます。長いノートでは入力パフォーマンスに影響する可能性があります。",
      "Add all parent tags when adding a nested tag to a note": "ネストタグ追加時に親タグも追加する",
      "When enabled, adding a nested tag to a note will automatically add all associated parent tags.": "有効にすると、ネストされたタグをノートに追加した際に、親タグも自動的に追加されます。",
      "Use always-visible toolbar in Super notes": "Superノートでツールバーを常時表示",
      "When enabled, the Super toolbar will always be shown at the top of the note. It can be temporarily toggled using Cmd/Ctrl+Shift+K. When disabled, the Super toolbar will only be shown as a floating toolbar when text is selected.": "有効時は、Superツールバーが常にノートの上部に表示されます（Cmd/Ctrl+Shift+Kで一時的に切り替え可能）。無効時は、テキスト選択時のみフローティング表示されます。",
      "Default image alignment in Super notes": "Superノートでの画像のデフォルト配置", "Left align": "左揃え", "Center align": "中央揃え", "Right align": "右揃え",
      "New Note Defaults": "新規ノートのデフォルト設定", "Note Type": "ノートタイプ", "Plain Text": "プレーンテキスト",
      "Authenticator": "認証システム", "Spreadsheet": "スプレッドシート", "Super": "Superノート", "Title Format": "タイトル形式",
      "Empty": "空欄", "Current date and time": "現在の日時", "Current note count": "ノート数", "Custom format": "カスタム形式",
      "Tools": "ツール", "Show note saving status while editing": "編集中の保存ステータスを表示",
      "Control whether the animated saving status is shown while editing. Error statuses are always shown regardless of preference.": "編集中にアニメーション付きの保存ステータスを表示するかを制御します。エラーは常に表示されます。",
      "Smart Views": "スマートビュー", "Upgrade for smart views": "スマートビュー機能のアップグレード",
      "Create smart views to organize your notes according to conditions you define.": "条件を定義して、ノートを整理するためのスマートビューを作成できます。",
      "Upgrade Features": "機能をアップグレード", "Moments": "モーメンツ", "Professional": "プロフェッショナル", "Your personal photo journal": "あなたの写真日記",
      "Moments lets you capture photos of yourself throughout the day, creating a visual record of your life, one photo at a time. Using your webcam or mobile selfie-cam, Moments takes a photo of you every half hour. All photos are end-to-end encrypted and stored in your files. Enable Moments on a per-device basis to get started.": "Momentsは1日に複数回、自動的にあなたの写真を撮影し、ライフログとして視覚的に記録します。Webカメラやスマホの自撮りカメラを使用し、30分ごとに写真を撮影します。すべての写真はエンドツーエンド暗号化され、ファイルに保存されます。各デバイスで有効化できます。",
      "Capture Present Moment": "今の瞬間を撮影", "No experimental features available.": "利用可能な実験的機能はありません。",

      // --- Account Panel ---
      "Credentials": "認証情報", "Email": "メールアドレス", "Password": "パスワード", "You're signed in as": "サインイン中：",
      "Change email": "メールアドレスを変更", "Current password was set on": "現在のパスワードの設定日：", "Change password": "パスワードを変更",
      "Sync": "同期", "Last synced": "最終同期", "Sync now": "今すぐ同期", "Subscription": "サブスクリプション",
      "You don't have a Standard Notes subscription yet.": "まだStandard Notesのサブスクリプションに加入していません。",
      "Learn More": "詳細を見る", "Subscribe": "購読する", "Subscription sharing": "サブスクリプション共有",
      "plan. Please upgrade in order to share your subscription.": "プランでのみ利用可能です。共有するにはアップグレードしてください。",
      "Upgrade": "アップグレード", "Mute sign-in notification emails": "サインイン通知メールをミュート",
      "Sign-in notification emails are available only on a": "サインイン通知メールは",
      "plan. Please upgrade in order to enable sign-in notifications.": "プランでのみ利用可能です。有効にするにはアップグレードが必要です。",
      "Mute marketing notification emails": "マーケティング通知メールをミュート",
      "Disables email notifications with special deals and promotions.": "特別オファーやプロモーションに関する通知メールを無効にします。",
      "Sign out": "サインアウト", "Other devices": "他のデバイス",
      "Want to sign out on all devices except this one?": "このデバイス以外からすべてサインアウトしますか？",
      "Sign out other sessions": "他のセッションをサインアウト", "Manage sessions": "セッションを管理",
      "This workspace": "このワークスペース", "Remove all data related to the current workspace from the application.": "現在のワークスペースに関連するすべてのデータをアプリケーションから削除します。",
      "Sign out workspace": "ワークスペースからサインアウト", "Delete account": "アカウント削除",
      "This action is irreversible. After deletion completes, you will be signed out on all devices.": "この操作は取り消せません。削除後、すべてのデバイスでサインアウトされます。",
      "Delete my account": "アカウントを削除",

      // --- Security Panel ---
      "Encryption": "暗号化", "Protections": "保護機能", "Two-factor authentication": "二要素認証",
      "Passcode lock": "パスコードロック", "Privacy": "プライバシー",
      "End-to-end encryption is enabled. Your data is encrypted on your device first, then synced to your private cloud.": "エンドツーエンド暗号化が有効になっています。データはまずデバイス上で暗号化され、その後プライベートクラウドに同期されます。",
      "Protections are enabled.": "保護機能は有効です。",
      "Actions like viewing or searching protected notes, exporting decrypted backups, or revoking an active session require additional authentication such as entering your account password or application passcode.": "保護されたノートの閲覧や検索、復号化されたバックアップのエクスポート、有効なセッションの取り消しなどの操作には、アカウントのパスワードまたはアプリのパスコードによる追加認証が必要です。",
      "An extra layer of security when logging in to your account.": "アカウントへのログイン時に追加のセキュリティを提供します。",
      "Add a passcode to lock the application and encrypt on-device key storage.": "パスコードを設定してアプリケーションをロックし、デバイス上のキー保管を暗号化します。",
      "Session user agent logging": "セッションのユーザーエージェント記録",
      "User agent logging allows you to identify the devices or browsers signed into your account. For increased privacy, you can disable this feature, which will remove all saved user agent values from our server, and disable future logging of this value.": "ユーザーエージェントの記録により、アカウントにサインインしているデバイスやブラウザを識別できます。プライバシーを強化するためにこの機能を無効にすると、保存された記録がサーバーから削除され、今後の記録も停止されます。",
      "Add passcode": "パスコードを追加",

      // --- Backups Panel ---
      "Data backups": "データバックアップ", "Download a backup of all your text-based data": "すべてのテキストデータのバックアップをダウンロード",
      "Encrypted": "暗号化済み", "Decrypted": "復号化済み", "Download backup": "バックアップをダウンロード",
      "Import a previously saved backup file": "保存済みバックアップファイルのインポート", "Import backup": "バックアップをインポート",
      "Automatic text backups": "自動テキストバックアップ",
      "Automatically save encrypted and decrypted backups of your note and tag data.": "ノートおよびタグの暗号化・復号化バックアップを自動的に保存します。",
      "To enable text backups, use the Standard Notes desktop application.": "テキストバックアップを有効にするには、Standard Notesのデスクトップアプリをご使用ください。",
      "Automatic plaintext backups": "自動プレーンテキストバックアップ",
      "Automatically save backups of all your notes into plaintext, non-encrypted folders.": "すべてのノートをプレーンテキスト（暗号化なし）でフォルダにバックアップします。",
      "To enable plaintext backups, use the Standard Notes desktop application.": "プレーンテキストバックアップを有効にするには、Standard Notesデスクトップアプリをご利用ください。",
      "Automatic file backups": "自動ファイルバックアップ", "Automatically save encrypted backups of your files.": "ファイルの暗号化バックアップを自動保存します。",
      "To enable file backups, use the Standard Notes desktop application.": "ファイルバックアップを有効にするには、Standard Notesのデスクトップアプリをご使用ください。",
      "To decrypt a backup file, drag and drop the file's respective <i>metadata.sn.json</i> file here or select it below.": "バックアップファイルを復号化するには、対応する <i>metadata.sn.json</i> をここにドラッグ＆ドロップするか、下から選択してください。",
      "Select file": "ファイルを選択", "Email backups": "メールバックアップ",
      "Receive daily encrypted email backups of all your notes directly in your email inbox.": "すべてのノートの暗号化メールバックアップを、毎日あなたの受信箱に直接送信します。",
      "Frequency": "頻度", "How often to receive backups.": "バックアップの受信頻度を選択してください。",
      "No email backups": "メールバックアップなし", "Daily": "毎日", "Weekly": "毎週",

      // --- Appearance Panel ---
      "Themes": "テーマ", "Disable translucent UI": "半透明UIを無効化",
      "Use opaque style for UI elements instead of translucency": "UI要素を半透明ではなく不透明で表示します",
      "Use system color scheme": "システムのカラースキームを使用",
      "Automatically change active theme based on your system settings.": "システム設定に基づいてテーマを自動的に変更します",
      "Automatic Light Theme": "ライトモードの自動テーマ", "Theme to be used for system light mode:": "システムのライトモードで使用するテーマ:",
      "Automatic Dark Theme": "ダークモードの自動テーマ", "Theme to be used for system dark mode:": "システムのダークモードで使用するテーマ:",
      "Default": "デフォルト", "Dark": "ダーク", "Autobiography": "オートバイオグラフィー", "Carbon": "カーボン",
      "Futura": "フューチュラ", "Midnight": "ミッドナイト", "Solarized Dark": "ソラライズドダーク", "Titanium": "チタニウム",
      "Editor": "エディタ", "Monospace Font": "等幅フォント",
      "Toggles the font style in plaintext and Super notes": "プレーンテキストおよびSuperノートのフォントを等幅に切り替えます",
      "Font size": "フォントサイズ", "Sets the font size in plaintext and Super notes": "プレーンテキストおよびSuperノートのフォントサイズを設定します",
      "Line height": "行間", "Sets the line height (leading) in plaintext and Super notes": "プレーンテキストおよびSuperノートの行間（行送り）を設定します",
      "Editor width": "エディタの幅", "Sets the max editor width for all notes": "すべてのノートに対する最大エディタ幅を設定します",
      "ExtraSmall": "極小", "Small": "小", "Normal": "標準", "Medium": "中", "Large": "大",
      "None": "なし", "Tight": "狭い", "Snug": "やや狭い", "Relaxed": "やや広い", "Loose": "広い", "Full width": "全幅",

      // --- Listed Panel ---
      "About Listed": "Listedについて", "What is Listed?": "Listedとは？", "Get Started": "始め方",
      "Listed is a free blogging platform that allows you to create a public journal published directly from your notes.": "Listedは、ノートから直接公開日記を作成できる無料のブログプラットフォームです。",
      "Create a free Listed author account to get started.": "無料のListed作成者アカウントを作成して始めましょう。",
      "Create new author": "新しい作成者アカウントを作成",

      // --- Help & Feedback Panel ---
      "Frequently asked questions": "よくある質問", "Community forum": "コミュニティフォーラム",
      "Community groups": "コミュニティグループ", "Account related issue?": "アカウントに関する問題？",
      "Who can read my private notes?": "自分のプライベートノートを読めるのは誰ですか？",
      "Can I collaborate with others on a note?": "他人とノートを共同編集できますか？",
      "Can I use Standard Notes totally offline?": "Standard Notesを完全にオフラインで使えますか？",
      "Can’t find your question here?": "ここにない質問がありますか？",
      "Quite simply: no one but you. Not us, not your ISP, not a hacker, and not a government agency. As long as you keep your password safe, and your password is reasonably strong, then you are the only person in the world with the ability to decrypt your notes. For more on how we handle your privacy and security, check out our easy to read": "簡単に言えば、あなた以外の誰も読むことはできません。私たちも、あなたのISPも、ハッカーも、政府機関も含みません。パスワードを安全に保ち、十分に強固なものであれば、ノートを復号できるのは世界であなただけです。プライバシーとセキュリティに関する詳細は、読みやすいこちらをご覧ください：",
      "Privacy Manifesto.": "プライバシーマニフェスト。",
      "Because of our encrypted architecture, Standard Notes does not currently provide a real-time collaboration solution. Multiple users can share the same account however, but editing at the same time may result in sync conflicts, which may result in the duplication of notes.": "当サービスの暗号化アーキテクチャにより、現在リアルタイムでの共同編集には対応していません。ただし、同じアカウントを複数人で共有することは可能ですが、同時編集すると同期競合が発生し、ノートが重複する可能性があります。",
      "Standard Notes can be used totally offline without an account, and without an internet connection. You can find": "Standard Notesはアカウントなし・インターネット接続なしでも完全にオフラインで使用できます。詳しくは",
      "more details here.": "こちらをご覧ください。",
      "If you have an issue, found a bug or want to suggest a feature, you can browse or post to the forum. It’s recommended for non-account related issues.": "問題の報告やバグの発見、機能の提案などがある場合は、フォーラムを閲覧または投稿してください。アカウントに関連しない内容に推奨されます。",
      "Want to meet other passionate note-takers and privacy enthusiasts? Want to share your feedback with us? Join the Standard Notes Discord for discussions on security, themes, editors and more.": "他の熱心なノート愛用者やプライバシーに関心のある人と交流したいですか？フィードバックを共有したいですか？セキュリティ、テーマ、エディタなどについて議論するためにDiscordコミュニティに参加しましょう。",
      "Send an email to help@standardnotes.com and we’ll sort it out.": "help@standardnotes.com にメールを送ってください。私たちが対応いたします。",
      "Open FAQ": "FAQを開く", "Go to the forum": "フォーラムへ移動",
      "Join our Discord": "Discordに参加する", "Email us": "メールを送る"
    };
    const translate = () => {
      const prefHeader = document.querySelector('div[data-preferences-header="true"]');
      if (!prefHeader) return;
      const dialog = prefHeader.closest('div[role="dialog"][data-enter]');
      if (!dialog) return;
      walkAndTranslate(dialog, map);
      const closeButton = dialog.querySelector('button[aria-label="設定を閉じる"], button[aria-label="Close preferences"]');
      if (closeButton && closeButton.getAttribute('aria-label') === 'Close preferences') {
        closeButton.setAttribute('aria-label', map['Close preferences']);
      }
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  /**
   * [新規] ノート一覧カラムのUI要素（aria-label、更新日時など）を日本語化します。
   */
  function localizeItemsColumn() {
    const map = {
      "Display options menu": "表示オプションメニュー",
      "Create a new note in the selected tag (Alt+Shift+N)": "選択中のタグに新規ノートを作成 (Alt+Shift+N)",
      "Open navigation menu": "ナビゲーションメニューを開く",
      "Notes & Files": "ノートとファイル"
    };
    const modifiedPrefix = "Modified";
    const translatedPrefix = "更新日時:";

    const translate = () => {
      const itemsColumn = document.getElementById('items-column');
      if (!itemsColumn) return;

      // カラム自体と内部のボタンのaria-labelを翻訳
      const mainLabel = itemsColumn.getAttribute('aria-label');
      if (map[mainLabel] && mainLabel !== map[mainLabel]) {
        itemsColumn.setAttribute('aria-label', map[mainLabel]);
      }
      itemsColumn.querySelectorAll('[aria-label]').forEach(el => {
        const label = el.getAttribute('aria-label');
        if (map[label] && el.getAttribute('aria-label') !== map[label]) {
          el.setAttribute('aria-label', map[label]);
        }
      });

      // ノートリスト内の更新日時を翻訳
      itemsColumn.querySelectorAll('.content-list-item .leading-1\\.4 > span').forEach(span => {
        const originalText = span.textContent.trim();
        if (originalText.startsWith(modifiedPrefix)) {
          const datePart = originalText.substring(modifiedPrefix.length).trim();
          const match = datePart.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日(.)曜日\s+(\d{1,2}:\d{2})$/);
          if (match) {
            const [, year, month, day, dayOfWeek, time] = match;
            const newText = `${translatedPrefix} ${year}/${month}/${day} (${dayOfWeek}) ${time}`;
            if (span.textContent !== newText) {
              span.textContent = newText;
            }
          }
        }
      });
    };

    const observer = new MutationObserver(translate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    translate();
  }

  const localizeTagContextMenu = () => {
    const map = {
      "Name": "名前", "Save tag name": "タグ名を保存", "Icon": "アイコン", "Emoji": "絵文字",
      "Reset": "リセット", "Favorite": "お気に入り", "Unfavorite": "お気に入りから外す",
      "Add subtag": "サブタグを追加", "Delete": "削除", "Last modified:": "最終更新：",
      "Created:": "作成日：", "Tag ID:": "タグID：",
      "Use your keyboard to enter or paste in an emoji character.": "キーボードで絵文字を入力または貼り付けてください。",
      "On Windows: Windows key + . to bring up emoji picker.": "Windowsでは、Windowsキー + . で絵文字ピッカーを表示できます。"
    };

    const translate = () => {
      document.querySelectorAll('[data-popover]').forEach(popover => {
        if (popover.querySelector('menu[aria-label="Tag context menu"]')) {
          walkAndTranslate(popover, map);
          walkAndFormatDate(popover);
          popover.querySelectorAll('[aria-label]').forEach(el => {
            const label = el.getAttribute('aria-label');
            if (map[label] && el.getAttribute('aria-label') !== map[label]) {
              el.setAttribute('aria-label', map[label]);
            }
          });
        }
      });
    };

    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  };

  function localizeStatsLine() {
    const translate = () => {
      document.querySelectorAll('.select-text .mb-1, .select-text > div').forEach(div => {
        if (!div.textContent.match(/\b(words?|characters?|paragraphs?)\b/i)) return;
        let buffer = '';
        div.childNodes.forEach(node => {
          buffer += node.nodeType === Node.TEXT_NODE ? node.nodeValue : node.textContent;
        });
        let jaLine = buffer.split(/[\u00b7·,・]/).map(part => {
          const m = part.trim().match(/^(\d+)\s*(words?|characters?|paragraphs?)$/i);
          if (m) {
            const num = m[1], unit = m[2].toLowerCase().replace(/s$/, '');
            return `${num} ${enToJaUnits[unit] || unit}`;
          }
          return part.trim();
        }).filter(p => p).join('・');
        if (div.textContent.trim() !== jaLine) div.innerHTML = jaLine;
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  function localizeNoteFooterInfoExtra() {
    const translate = () => {
      document.querySelectorAll('.select-text .mb-1, .select-text > div').forEach(div => {
        if (div.textContent.match(/\b(words?|characters?|paragraphs?)\b/i)) return;
        walkAndFormatDate(div);
      });
    }
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  function localizeLinkPopover() {
    const map = {
      "Search items to link...": "リンクする項目を検索...", "Linked Files": "リンク済みファイル",
      "Linked Tags": "リンク済みタグ", "Upload and link file(s)": "ファイルをアップロードしてリンク",
      "Unlinked": "未リンク", "Linked": "リンク済み", "Create & add tag": "タグを作成して追加",
    };
    const translate = () => {
      document.querySelectorAll('[data-popover]').forEach(popover => {
        if (popover.querySelector('input[placeholder="Search items to link..."]')) {
          walkAndTranslate(popover, map);
          popover.querySelectorAll('[aria-label]').forEach(el => {
            const label = el.getAttribute('aria-label');
            if (map[label]) el.setAttribute('aria-label', map[label]);
          });
        }
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  /**
   * [更新] エディタ上部のタイトルバーと競合ボタンを日本語化します。
   */
  function localizeEditorTitleBar() {
    const map = {
      "Link tags, notes, files...": "タグ・ノート・ファイルをリンク...",
      "Link tags, notes or files": "タグ・ノート・ファイルをリンク",
      "Create & add tag": "タグを作成して追加",
      "Focus input to add a link (Ctrl+Alt+T)": "リンクを追加 (Ctrl+Alt+T)",
      "Go to items list": "ノート一覧へ移動",
      "Linked items panel": "リンク済みアイテムパネル",
      "Change note type (Ctrl+Shift+/)": "ノートタイプを変更 (Ctrl+Shift+/)",
      "Pin note (Ctrl+Shift+P)": "ノートをピン留め (Ctrl+Shift+P)",
      "Pin selected notes": "選択したノートをピン留め",
      "Note options menu": "ノートオプションメニュー",
    };
    const translate = () => {
      const titleBar = document.querySelector('#editor-title-bar');
      if (titleBar) {
        walkAndTranslate(titleBar, map);
        titleBar.querySelectorAll('input[placeholder]').forEach(input => {
          if (map[input.placeholder]) input.placeholder = map[input.placeholder];
        });
        titleBar.querySelectorAll('[aria-label], [title]').forEach(el => {
          const attr = el.hasAttribute('aria-label') ? 'aria-label' : 'title';
          const val = el.getAttribute(attr);
          if (map[val]) el.setAttribute(attr, map[val]);
        });

        // Handle conflict button
        const conflictButton = titleBar.querySelector('#conflict-resolution-button');
        if (conflictButton) {
          const textNode = Array.from(conflictButton.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
          if (textNode) {
            const originalText = textNode.nodeValue.trim();
            const match = originalText.match(/(\d+)\s+conflict(s?)/);
            if (match) {
              textNode.nodeValue = ` ${match[1]}件の競合`;
            }
          }
        }
      }
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  /**
   * [更新済み] ゴミ箱への移動確認モーダルを日本語化します。
   * シンプルな確認メッセージと、ノートタイトルを含む動的なメッセージの両方に対応します。
   */
  function localizeMoveToTrashModal() {
    const map = {
      "Move to Trash": "ゴミ箱に移動",
      "to the trash?": "をゴミ箱に移動してもよろしいですか？",
      "Are you sure you want to move this note to the trash?": "このノートをゴミ箱に移動してもよろしいですか？",
      "Cancel": "キャンセル",
      "Confirm": "確認",
    };
    const translate = () => {
      document.querySelectorAll('.sk-modal-content').forEach(modal => {
        const titleEl = modal.querySelector('.font-bold.text-lg');
        // モーダルのタイトルが英語または日本語の「ゴミ箱に移動」であるかを確認
        if (!titleEl || (titleEl.textContent.trim() !== "Move to Trash" && titleEl.textContent.trim() !== "ゴミ箱に移動")) {
          return;
        }

        // walkAndTranslateで静的なテキスト（タイトル、ボタン、シンプルな確認文）を翻訳
        walkAndTranslate(modal, map);

        // ノートタイトルや件数を含む動的なテキストを処理
        modal.querySelectorAll('p.sk-p').forEach(p => {
          const rawText = p.textContent.trim();

          // 既に翻訳済みの場合はスキップ
          if (rawText.includes(map["to the trash?"]) || rawText === map["Are you sure you want to move this note to the trash?"]) {
            return;
          }

          // ノート名が1つ含まれる場合のパターン
          const singleNoteMatch = rawText.match(/^Are you sure you want to move ['‘’](.+)['‘’] to the trash\?$/);
          if (singleNoteMatch) {
            p.textContent = `「${singleNoteMatch[1]}」${map["to the trash?"]}`;
            return;
          }

          // 複数のノートが含まれる場合のパターン
          const multipleNotesMatch = rawText.match(/^Are you sure you want to move (\d+) notes to the trash\?$/);
          if (multipleNotesMatch) {
            p.textContent = `${multipleNotesMatch[1]}個のノート${map["to the trash?"]}`;
          }
        });
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  function localizeItemsListTitle() {
    const map = {
      "Starred": "お気に入り", "Archived": "アーカイブ", "Trash": "ゴミ箱",
      "Untagged": "タグなし", "Files": "ファイル", "Notes": "ノート一覧"
    };
    const translate = () => {
      document.querySelectorAll(
        '.section-title-bar-header .text-2xl.font-semibold.text-text, .section-title-bar-header .md\\:text-lg.font-semibold.text-text'
      ).forEach(el => walkAndTranslate(el, map));
    };
    const observer = new MutationObserver(() => setTimeout(translate, 0));
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    translate();
  }

  function localizeEmptyTagsMessage() {
    const map = { "No tags or folders. Create one using the add button above.": "タグやフォルダはありません。上の追加ボタンで作成してください。" };
    const translate = () => {
      document.querySelectorAll('.section-title-bar + div').forEach(div => {
        if (div.previousElementSibling?.textContent.includes('Tags') || div.previousElementSibling?.textContent.includes('タグ')) {
          walkAndTranslate(div, map);
        }
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  function localizeDataNotBackedUpWarning() {
    const map = {
      "Data not backed up": "データがバックアップされていません",
      "Sign in or register to sync your notes to your other devices with end-to-end encryption.": "サインインまたは登録すると、エンドツーエンド暗号化で他のデバイスとノートを同期できます。",
      "Open Account menu": "アカウントメニューを開く"
    };
    const translate = () => {
      document.querySelectorAll('h1').forEach(h1 => {
        if (h1.textContent.trim() === "Data not backed up") {
          const container = h1.closest('div');
          if (container) walkAndTranslate(container, map);
        }
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  /**
   * [更新] 競合解決モーダルと関連ポップオーバーを日本語化します。
   */
  function localizeConflictResolutionModal() {
    const map = {
      "Resolve conflicts": "競合を解決",
      "Cancel": "キャンセル",
      "List": "リスト",
      "Preview": "プレビュー",
      "Current version": "現在のバージョン",
      "Preview Mode": "プレビューモード",
      "Diff Mode": "差分モード",
      // Main button might have line breaks. Use a key that matches its normalized textContent.
      "Keep selected, trash others": "選択バージョンを保持し、他を破棄",
      // Popover menu items
      "Move others to trash": "他をゴミ箱に移動",
      "Only the selected version will be kept; others will be moved to trash.": "選択したバージョンのみが保持され、他はゴミ箱に移動します。",
      "Delete others permanently": "他を完全に削除",
      "Only the selected version will be kept; others will be deleted permanently.": "選択したバージョンのみが保持され、他は完全に削除されます。",
    };

    const translate = () => {
      // --- 1. Translate the main conflict resolution dialog ---
      const dialogs = Array.from(document.querySelectorAll('div[data-dialog][role="dialog"]'))
        .filter(d => {
          const header = d.querySelector('div[data-mobile-modal-header] span, .md\\:text-lg span');
          return header && header.textContent.trim() === "Resolve conflicts";
        });

      for (const dialog of dialogs) {
        if (dialog.dataset.localizedFull === 'conflict-resolution') continue;

        walkAndTranslate(dialog, map);

        // --- 2. Translate version list details ---
        dialog.querySelectorAll('button.flex.w-full.select-none').forEach(button => {
          const versionTitle = button.querySelector('.font-semibold');
          if (versionTitle) {
            if (versionTitle.textContent.trim() !== "Current version" && !versionTitle.textContent.includes("バージョン")) {
              versionTitle.textContent = versionTitle.textContent.replace(/Version (\d+)/, 'バージョン $1');
            }
          }
          const detailsContainer = button.querySelector('.w-full.text-sm.text-neutral');
          if (detailsContainer) {
            walkAndFormatDate(detailsContainer);
          }
        });

        // --- 3. Specifically translate the main action button ---
        const mainButton = dialog.querySelector('div[role="toolbar"] button:first-child');
        if (mainButton) {
          // Normalize whitespace and line breaks to a single space for robust matching.
          const buttonText = mainButton.textContent.replace(/\s+/g, ' ').trim();
          // The text might include a comma depending on the exact UI state.
          if (buttonText === "Keep selected, trash others") {
            mainButton.textContent = map["Keep selected, trash others"];
          }
        }

        dialog.dataset.localizedFull = 'conflict-resolution';
      }

      // --- 4. Translate the action popover (which is in a portal) ---
      document.querySelectorAll('div[id^="portal"] div[role="listbox"]').forEach(listbox => {
        const firstOptionText = listbox.querySelector('div[role="option"] div.font-bold');
        if (firstOptionText && firstOptionText.textContent.includes("Move others to trash")) {
          if (listbox.dataset.localized === 'conflict-action-popover') return;
          walkAndTranslate(listbox, map);
          listbox.dataset.localized = 'conflict-action-popover';
        }
      });
    };

    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true });
    translate();
  }

  /**
   * [新規] 競合解決の最終確認モーダルを日本語化します。
   */
  function localizeConflictConfirmationModal() {
    const map = {
      "Keep only selected versions?": "選択したバージョンのみを保持しますか？",
      "This will keep only the selected versions and move the other versions to the trash. Are you sure?": "これにより、選択したバージョンのみが保持され、他のバージョンはゴミ箱に移動します。よろしいですか？",
      "This will keep only the selected versions and delete the other versions permanently. Are you sure?": "これにより、選択したバージョンのみが保持され、他のバージョンは完全に削除されます。よろしいですか？",
      "Cancel": "キャンセル",
      "Confirm": "確認",
    };

    const translate = () => {
      document.querySelectorAll('.sk-modal-content .sn-component .sk-panel').forEach(panel => {
        const titleEl = panel.querySelector('.font-bold.text-lg');
        if (titleEl?.textContent.trim() === "Keep only selected versions?") {
          if(panel.dataset.localized === 'conflict-confirm') return;

          walkAndTranslate(panel, map);

          const p = panel.querySelector('p.sk-p');
          if (p) {
            const originalText = p.textContent.trim();
            if (map[originalText]) {
              p.textContent = map[originalText];
            }
          }
          panel.dataset.localized = 'conflict-confirm';
        }
      });
    };
    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }

  /**
   * [新規] エディタ幅設定モーダルを日本語化します。
   */
  function localizeEditorWidthModal() {
      const map = {
            "Set globally": "グローバルに設定",
            "Narrow": "狭く",
            "Wide": "広く",
            "Dynamic": "ダイナミック",
            "Full width": "全幅",
            "Cancel": "キャンセル",
            "Apply": "適用",
      };

      const translate = () => {
            document.querySelectorAll('div[data-dialog][role="dialog"]').forEach(dialog => {
                // このダイアログを特定するユニークな要素を探す
                const fullWidthRadio = dialog.querySelector('input[value="FullWidth"]');
                if (!fullWidthRadio) return;

                if(dialog.dataset.localized === 'editor-width') return;

                walkAndTranslate(dialog, map);

                dialog.dataset.localized = 'editor-width';
            });
      };
      new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
      translate();
  }

  /**
   * [新規] キーボードショートカットのヘルプモーダルを日本語化します。
   */
  function localizeKeyboardShortcutsModal() {
    const map = {
      "Keyboard shortcuts": "キーボードショートカット",
      "Cancel": "キャンセル",
      "Current note": "現在のノート",
      "Pin current note": "現在のノートをピン留め",
      "Star current note": "現在のノートにスターを付ける",
      "Open note history": "ノートの履歴を開く",
      "Change editor width": "エディタの幅を変更",
      "Change note type": "ノートタイプを変更",
      "Link tags, notes, files": "タグ、ノート、ファイルをリンク",
      "Notes list": "ノート一覧",
      "Go to next item": "次の項目へ移動",
      "Go to previous item": "前の項目へ移動",
      "General": "一般",
      "Toggle focus mode": "フォーカスモードの切替",
      "Toggle notes panel": "ノートパネルの切替",
      "Toggle tags panel": "タグパネルの切替",
      "Create new tag": "新規タグを作成",
      "Open preferences": "設定を開く",
      "Toggle keyboard shortcuts help": "ショートカットヘルプの表示切替",
      "Toggle dark mode": "ダークモードの切替",
      "Create new note": "新規ノートを作成",
      "Toggle global search": "グローバル検索の切替",
      "Select all items": "すべての項目を選択",
    };

    const translate = () => {
      document.querySelectorAll('div[data-dialog][role="dialog"]').forEach(dialog => {
        // このダイアログを特定するために、特徴的なヘッダーテキストを探す
        const header = dialog.querySelector('[data-mobile-modal-header="true"] span, .md\\:text-lg span');
        // ヘッダーテキストが "Keyboard shortcuts" または既に翻訳済みの "キーボードショートカット" であることを確認
        const headerText = header?.textContent.trim();
        if (headerText !== "Keyboard shortcuts" && headerText !== "キーボードショートカット") {
            return;
        }

        if (dialog.dataset.localized === 'keyboard-shortcuts') return;

        walkAndTranslate(dialog, map);

        dialog.dataset.localized = 'keyboard-shortcuts';
      });
    };

    new MutationObserver(translate).observe(document.body, { childList: true, subtree: true });
    translate();
  }


  // --- スクリプトのメイン実行部 ---

  // IME修正とスタイル適用を監視
  new MutationObserver(() => {
    applyEditorStyle();
    setupTitleField();
  }).observe(document.body, { childList: true, subtree: true });

  // すべての日本語化関数を呼び出し
  localizeDisplayOptions();
  localizeSidebarViews();
  localizeTagsSection();
  localizeSearchBoxes();
  localizeSearchMessages();
  localizeFilterButtons();
  localizeNoteOptionsMenu();
  localizeNoteFooterInfo();
  localizeChallengeModal();
  localizeAccountMenu();
  localizeQuickSettingsMenu();
  localizePreferencesDialog();
  localizeItemsColumn();
  localizeTagContextMenu();
  localizeStatsLine();
  localizeNoteFooterInfoExtra();
  localizeLinkPopover();
  localizeEditorTitleBar();
  localizeMoveToTrashModal();
  localizeItemsListTitle();
  localizeEmptyTagsMessage();
  localizeDataNotBackedUpWarning();
  // localizeConflictResolutionModal(); // エラーになるのでコメントアウトする
  localizeConflictConfirmationModal();
  localizeEditorWidthModal();
  localizeKeyboardShortcutsModal();
})();
