// ==UserScript==
// @author         たかだか。/TKDK.
// @name           Google掃除機(仮称)
// @name:en        Google Search Cleaner (Tentative Title)
// @namespace      https://twitter.com/djtkdk_086969
// @description    Googleの検索結果に出て欲しくないページを、条件を指定して非表示にします。
// @description:en Blocks websites you don't want to see on Google Search, by customizable rules.
// @require        https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @include        https://www.google.tld/
// @include        https://www.google.tld/?*
// @include        https://www.google.tld/search*
// @include        https://www.google.tld/webhp?*
// @include        https://www.google.tld/imghp?*
// @include        http://www.google.tld/
// @include        http://www.google.tld/?*
// @include        http://www.google.tld/search*
// @include        http://www.google.tld/imghp?*
// @exclude        *tbm=shop*
// @exclude        *tbm=vid*
// @version        1.4.2.359
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @license        GPL v3; http://www.gnu.org/copyleft/gpl.html
// @homepage       https://misskey.io/@tkdk_bemusic
// @supportURL     https://github.com/djtkdk-086969/google-search-cleaner
// @compatible     firefox
// @compatible     chrome
// @downloadURL https://update.greasyfork.org/scripts/19620/Google%E6%8E%83%E9%99%A4%E6%A9%9F%28%E4%BB%AE%E7%A7%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/19620/Google%E6%8E%83%E9%99%A4%E6%A9%9F%28%E4%BB%AE%E7%A7%B0%29.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

/* 翻訳用メッセージカタログ(?) */
var cat = {
    "ja": {
        "langName": {
            "en": "Japanese",
            "ja": "日本語"
        },
        "abbrev": {
            "table": {
                "target": "対象",
                "type": "検索方法",
                "action": "動作",
                "criteria": "条件文字列",
                "contentType": "種類",
                "matchedString": "合致した文字列"
            },
            "target": {
                "url": "URL",
                "description": "説明",
                "title": "題名",
                "suggest": "関連"
            },
            "type": {
                "domain": "ドメイン",
                "str": "文字列",
                "str_head": "頭文字列",
                "word": "ワード",
                "regexp": "正規表現",
            },
            "action": {
                "hide_absolutely": "禁止",
                "hide": "隠す",
                "hide_description_warn": "⚠縮",
                "warn": "⚠",
                "hide_description": "縮小",
                "info": "通知",
                "allow": "許可"
            }
        },
        "full": {
            "target": {
                "url": "URL",
                "description": "説明文",
                "title": "タイトル",
                "suggest": "サジェスト"
            },
            "type": {
                "domain": "ドメイン",
                "str": "文字列",
                "str_head": "文字列(先頭一致)",
                "word": "ワード",
                "regexp": "正規表現",
            },
            "action": {
                "hide_absolutely": "完全に非表示",
                "hide": "非表示",
                "hide_description_warn": "警告+説明文非表示",
                "warn": "警告",
                "hide_description": "通知+説明文非表示",
                "info": "通知",
                "allow": "許可"
            },
            "results": {
                "page": "ページ",
                "missing": "検索語句無視",
                "img": "画像",
                "suggest": "関連語句",
                "suggest_excl": "関連(-除外)",
                "autocomplete": "検索語句予測"
            },
            "msg": {
                "configTabRSEdit": "RS編集",
                "configTabRSMng": "RS管理",
                "configTabLog": "ログ",
                "configTabPrefs": "設定",
                "configTabBackup": "バックアップ・初期化",
                "configTabAbout": "バージョン情報",
                "configTabRSEditH": "ルールセット内のルールを編集します",
                "configTabRSMngH": "ルールセットの追加・削除などを行います",
                "configTabLogH": "活動ログを表示します",
                "configTabPrefsH": "その他の設定を変更します",
                "configTabBackupH": "設定のバックアップ・復元・初期化を行います",
                "configTabAboutH": "このスクリプトについて",
                "addLast": "末尾に挿入",
                "addNextToSelection": "選択されたルールの次に挿入",
                "overwrite": "上書",
                "noChange": "変更しない",
                "rules": "個のルール",
                "rules_selected": "個選択済",
                "enabled": "有効",
                "disabled": "無効",
                "hidAbsolutely": "「完全に非表示」動作のため表示できません",
                "hidAbsolutelyB": "表示不可",
                "defaultRuleset": "既定のルールセット",
                "GscConfigMenu": "Google掃除機 設定",
                "close": "閉じる",
                "ruleset": "ルールセット",
                "selectAll": "全選択",
                "unselectAll": "全解除",
                "toggleSelection": "選択の切替",
                "moveSelected": "選択されたルールを移動",
                "deleteSelected": "選択されたルールを削除",
                "currentRuleEnabled": "このルールを有効にする",
                "target": "対象",
                "type": "検索方法",
                "action": "動作",
                "criteria": "条件文字列",
                "level": "レベル",
                "comment": "コメント",
                "friendlyNameForCurrentRuleset": "現在のルールセットの表示名",
                "friendlyName": "表示名",
                "deleteCurrentRuleset": "現在のルールセットを削除",
                "key": "キー",
                "addRuleset": "新規ルールセット追加",
                "importFromFile": "ファイルからインポート...",
                "importFromFileAndAdd": "ファイルからインポートして現在のルールセットに追加",
                "exportSelected": "選択範囲をエクスポート",
                "urlList": "URLリスト(不完全)",
                "clear": "クリア",
                "pointForDetails": '<span class="gso_log_pointicon"></span> をポイントすると詳細が表示されます。',
                "indicateOverride": '<span class="gso_log_overridden">この表示</span>は他のルールにより動作が上書きされたことを表します。<br>',
                "configPrefsSecApr": "表示設定",
                "configPrefsSecAdd": "付加機能の設定",
                "configPrefsSecDbg": "デバッグ用設定",
                "configLang": "言語",
                "configMessageLocation": "メッセージの場所",
                "configQuickBlock": "検索結果にクイックブロックボタンを表示",
                "configCheckForImage": "画像検索のチェック",
                "configRSNameWithComment": "プレースホルダにコメントを表示する",
                "configRSNameWithCommentB": "「#」で始まるコメントはこの設定を有効にしても表示されません",
                "configFixMissing": "検索語句無視対策機能を有効にする",
                "configHideMoshikashite": "2ページ目以降「もしかして：」を隠す",
                "configForceKWExcl": "サジェストに「マイナス検索」を適用",
                "configAlwaysLog": "合致したルールが存在しなくてもチェックした項目を全て記録する(デバッグ用)",
                "configFloat": "メッセージ・設定画面をスクロールに追従させる",
                "configAnimation": "アニメーション",
                "configMessageLocationPage": "ページ左上",
                "configMessageLocationConfig": "設定画面",
                "backupToFile": "ファイルにバックアップ",
                "restoreAll": "全設定をファイルから復元",
                "init": "全設定を初期化(元に戻せません!)",
                "initButton": "初期化",
                "initConfirm": "この操作は元に戻せません。本当によろしいですか?",
                "initialized": "全ての設定を初期化しました。",
                "aboutAuthor": "作者",
                "aboutLicense": "ライセンス",
                "aboutJQ": 'このスクリプトは<a href="https://jquery.com/" target="_blank">jQuery 3.3.1</a>を利用しています。<br>jQueryはMIT Licenseのもとで提供されています。',
                "aboutDisclaimer": "免責事項: 作者はこのスクリプトが永続的に使用可能であることを保証しません。Google側の仕様変更が原因で、このスクリプトが正常に動作しなくなる場合があります。",
                "saveChange": "変更を保存",
                "discardChange": "変更を破棄",
                "changeNotSaved": "[変更を保存]をクリックするまで設定は保存されません",
                "reloadToTakeEffect": "設定を反映させるには再読み込みを行ってください",
                "lastRulesetCannotBeDeleted": "最後のルールセットは削除できません",
                "untitled": "(無題)",
                "invalidJSON": "有効なJSONではないため、インポートに失敗しました。詳細はコンソールを参照してください。",
                "invalidConfig": "不正な設定ファイルです。詳細はコンソールを参照してください。",
                "ignoredKeywords": "無視されたキーワード",
                "searchAllIncluded": "全部含めて再検索",
                "qbBlock": "ブロック...",
                "qbFullURL": "URL全体",
                "qbDomain": "ドメイン名",
                "domain": "ドメイン",
                "excludedKeyword": "マイナス検索による除外",
                "ctlmsgWndIK": "語句無視",
                "ctlmsgSERP": "検索結果",
                "ctlmsgIMG": "画像",
                "ctlmsgKW": "関連語句",
                "ctlmsgMIS": "%1 個の検索語句が無視されています（「含まれない」）",
                "ctlmsgSuggest": "%1 件の自動補完をブロックしました",
                "ctlmsgVerbatim": "完全一致で再検索",
                "ctlmsgNoSERP": "検索結果が表示されていません",
                "ctlmsgGood": "ルールセットに合致した検索結果はありません",
                "ctlmsgBad": "ルールセットに合致した次の要素を処理しました",
                "ctlmsgBadB": "(クリックで切替)",
                "qbCreateNewRule": "新規ルールを作成します",
                "qbAddTo": "追加先",
                "qbAdd": "追加",
                "qbSendTo": "ルールセット編集画面に送る",
                "qbAdded": "ルールを追加しました。ページを再読み込みすると変更が反映されます。",
                "qbHeadURL": "URL(先頭一致)"
            }
        }
    },
    "en": {
        "langName": {
            "en": "English",
            "ja": "英語"
        },
        "abbrev": {
            "table": {
                "target": "Tgt.",
                "type": "M.Type",
                "action": "Action",
                "criteria": "Criteria",
                "contentType": "Type",
                "matchedString": "Matched String"
            },
            "target": {
                "url": "URL",
                "description": "Desc.",
                "title": "Title",
                "suggest": "Rel."
            },
            "type": {
                "domain": "Domain",
                "str": "String",
                "str_head": "Head",
                "word": "Word",
                "regexp": "RegExp",
            },
            "action": {
                "hide_absolutely": "XX",
                "hide": "X",
                "hide_description_warn": "!!",
                "warn": "!",
                "hide_description": "Shr.",
                "info": "Inf.",
                "allow": "OK"
            }
        },
        "full": {
            "target": {
                "url": "URL",
                "description": "Description",
                "title": "Title",
                "suggest": "Suggestion"
            },
            "type": {
                "domain": "Domain",
                "str": "String",
                "str_head": "String (Head)",
                "word": "Word",
                "regexp": "Regular Expression",
            },
            "action": {
                "hide_absolutely": "Hide Absolutely",
                "hide": "Hide",
                "hide_description_warn": "Warn / Hide Description",
                "warn": "Warn",
                "hide_description": "Info / Hide Description",
                "info": "Info",
                "allow": "Allow (Do nothing)"
            },
            "results": {
                "page": "Page",
                "missing": "Ignored KWs",
                "img": "Image",
                "suggest": "Suggestion",
                "suggest_excl": "Forced -KW",
                "autocomplete": "Autocomplete"
            },
            "msg": {
                "configTabRSEdit": "Edit RS",
                "configTabRSMng": "Manage RS",
                "configTabLog": "Log",
                "configTabPrefs": "Preferences",
                "configTabBackup": "Backup / Reset",
                "configTabAbout": "About",
                "configTabRSEditH": "Edit rules in the rulesets",
                "configTabRSMngH": "Add / remove a ruleset",
                "configTabLogH": "Show the Activity Log",
                "configTabPrefsH": "Miscellaneous Preferences",
                "configTabBackupH": "Backup / Restore / Reset all rulesets and preferences",
                "configTabAboutH": "About this script",
                "addLast": "Insert to the last",
                "addNextToSelection": "Insert next to the selected rule",
                "overwrite": "Overwrite",
                "noChange": "No change",
                "rules": "rule(s)",
                "rules_selected": "selected",
                "enabled": "Enabled",
                "disabled": "Disabled",
                "hidAbsolutely": "&quot;Hide Absolutely&quot; action is preventing results from appearing.",
                "hidAbsolutelyB": "Cannot be displayed",
                "defaultRuleset": "Default Ruleset",
                "GscConfigMenu": "Google Search Cleaner Preferences",
                "close": "Close",
                "ruleset": "Ruleset",
                "selectAll": "Select all",
                "unselectAll": "Unselect all",
                "toggleSelection": "Toggle selection",
                "moveSelected": "Move selected rules",
                "deleteSelected": "Delete selected rules",
                "currentRuleEnabled": "Enable this rule",
                "target": "Target",
                "type": "Match Type",
                "action": "Action",
                "criteria": "Criteria",
                "level": "Level",
                "comment": "Comment",
                "friendlyNameForCurrentRuleset": "Friendly name for current ruleset",
                "friendlyName": "Friendly name",
                "deleteCurrentRuleset": "Delete current ruleset",
                "key": "Key",
                "addRuleset": "Add a new ruleset",
                "importFromFile": "Import rules from file...",
                "importFromFileAndAdd": "Import rules from file and add them to the current ruleset",
                "exportSelected": "Export selection",
                "urlList": "URL List (Incomplete)",
                "clear": "Clear",
                "pointForDetails": 'Point <span class="gso_log_pointicon"></span> to show details.',
                "indicateOverride": '<span class="gso_log_overridden">This style</span> indicates that the action of the rule has been overridden by another rule.<br>',
                "configPrefsSecApr": "Appearance",
                "configPrefsSecAdd": "Additional Features",
                "configPrefsSecDbg": "Debug",
                "configLang": "Language",
                "configMessageLocation": "Message location",
                "configQuickBlock": "Show Quick Block buttons on the SERP",
                "configCheckForImage": "Check for image search",
                "configRSNameWithComment": "Show comments on the placeholder",
                "configRSNameWithCommentB": "The comments starting with '#' will not be shown regardless of this configuration.",
                "configFixMissing": "Enable Missing Keywords Indication",
                "configHideMoshikashite": "Hide 'Did you mean' on the second (or lower) SERP page",
                "configForceKWExcl": "Force keyword exclusion ('Minus Search') on Keyword Suggestion",
                "configAlwaysLog": "Always log checked entries (for debugging)",
                "configFloat": "Floating Message Box",
                "configAnimation": "Animation",
                "configMessageLocationPage": "Top-Left of the page",
                "configMessageLocationConfig": "Configuration Window",
                "backupToFile": "Backup to file",
                "restoreAll": "Restore all configuration from file",
                "init": "Reset all configuration (Cannot be undone!)",
                "initButton": "Reset",
                "initConfirm": "Are you sure?",
                "initialized": "Initialized all configuration.",
                "aboutAuthor": "Author",
                "aboutLicense": "License",
                "aboutJQ": 'This script uses <a href="https://jquery.com/" target="_blank">jQuery 3.3.1</a>.<br>jQuery is provided under MIT License.',
                "aboutDisclaimer": "DISCLAIMER: The author does NOT guarantee that this script will be permanently functional. Google might change the behavior of its service, which might cause this script to stop working properly.",
                "saveChange": "Save changes",
                "discardChange": "Discard changes",
                "changeNotSaved": "Your changes are not saved unless you click [Save changes].",
                "reloadToTakeEffect": "Please reload the page to take effects.",
                "lastRulesetCannotBeDeleted": "You cannot delete the last ruleset.",
                "untitled": "(Untitled)",
                "invalidJSON": "Import failed because the given file is not a valid JSON. See the console for details.",
                "invalidConfig": "Invalid configuration file. See the console for details.",
                "ignoredKeywords": "Ignored Keywords",
                "searchAllIncluded": "Search again with all keywords included",
                "qbBlock": "Block...",
                "qbFullURL": "Full URL",
                "qbDomain": "Domain Name",
                "domain": "Domain",
                "excludedKeyword": "Minus Search Exclusion",
                "ctlmsgWndIK": "Ignored",
                "ctlmsgSERP": "Results",
                "ctlmsgIMG": "Images",
                "ctlmsgKW": "Keywords",
                "ctlmsgMIS": "%1 keyword(s) ignored (\"Missing\").",
                "ctlmsgSuggest": "Blocked %1 autocomplete(s).",
                "ctlmsgVerbatim": "Search Verbatim",
                "ctlmsgNoSERP": "No search results displayed.",
                "ctlmsgGood": "No search results matched with your rulesets.",
                "ctlmsgBad": "Actions have been taken for the following elements matched with your rulesets.",
                "ctlmsgBadB": "(Click to toggle)",
                "qbCreateNewRule": "Creating a New Rule",
                "qbAddTo": "Add to",
                "qbAdd": "Add",
                "qbSendTo": "Send to the Ruleset Editor",
                "qbAdded": "The rule has been added. Reload the page to take effects.",
                "qbHeadURL": "URL (Forward Match)"
            }
        }
    }

};

var action_priority = {
    "hide_absolutely": 6,
    "hide": 5,
    "hide_description_warn": 4,
    "warn": 2,
    "hide_description": 3,
    "info": 1,
    "allow": 0,
    "undef": -1
};

/* 現在の設定 */
var config = null;

/* デフォルトの設定 */
var config_default = {
    "rulesets": {
        "default": {
            "name": "既定のルールセット",
            "enabled": true,
            "rules": [
            ]},
    },
    'config': {
        'gso_lang': 'ja',
        'message_location': 'page',
        'quick_block': false,
        'check_for_image': true,
        'ruleset_name_with_comment': false,
        'fix_missing': true,
        'hide_moshikashite': true,
        'force_keyword_exclusion_on_suggestion': false,
        'always_log_checked_entries': false,
        'float': true,
        'animation': true,
        'verbose': false,
        'version': GM_info.script.version
    }
};

var gso_control_status = {
    "show_serp": false,
    "show_img": false,
    "show_kw": false
};

/* Utility functions */

function escapeRegexp(string) {
    /*
    //Emacs(24)でシンタックスハイライトがこの行以降正常に機能しないため構文を変更
    return string.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
    */
    var escaped_char = new RegExp("([.*+?^=!:${}()|[\\]\\/\\\\])","g");
    return string.replace(escaped_char, "\\$1");
}
function chk_str(target, ref, method) {
    /*
      条件に合致した場合、合致した文字列を含む配列を返す。
      そうでない場合は null を返す。
      target: 対象の文字列
      ref:    検索文字列
      method: 検索方法
    */
    var r = null;
    if(method == "domain") {
        if(/^(https?|ftp):\/\/\S/.test(target)) { //正しいURLである
            var target_subdomain = target
                .split("/")[2]
                .split(":")[0]
                .split(".")
                .reverse()
                .filter(function(element) {return (element !== "");});
            var ref_subdomain = ref.split(".").reverse()
                .filter(function(element) {return (element !== "");});
            if (ref_subdomain.every(
                function(element, index, array) {
                    return array[index] == target_subdomain[index];
                })) {
                return [ref];
            } else {
                return null;
            }
        } else {
            return null;
        }
    } else if(method == "regexp") {
        r = new RegExp(ref, "i");
        return r.exec(target);
    } else if(method == "str") {
        r = new RegExp(escapeRegexp(ref), "i");
        return r.exec(target);
    } else if(method == "str_head") {
        r = new RegExp("^" + escapeRegexp(ref), "i");
        return r.exec(target);
    } else if(method == "word") {
        var words = ref.split(/\s+/);

        if (words.every(function(element, index, array) {
            if(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9fff]/.test(element)) {
                /* キーワードに日本語(ひらがなカタカナ漢字)が含まれている
                   →単純に部分一致検索する */
                r = new RegExp(escapeRegexp(element), "i");
                return r.test(target);

            } else {
                /* キーワードに日本語を含まない
                   →単語単位で検索(\bSTR\b) */
                r = new RegExp('(\\b|^)' + escapeRegexp(element) + '(\\b|$)', "i");
                return r.test(target);
            }
        })) {
            return words;
        } else {
            return null;
        }
    } else {
        return null;
    }
}

function decodeURI_s(url) {
    /* decodeURI() にデコードできないURIを食わせると
       URIError: malformed URI sequence
       となるので例外処理する */
    var url_decoded;
    try {
        url_decoded = decodeURI(url);
    }
    catch (e) {
        if (e instanceof URIError) {
            url_decoded = url;
        }
    }
    return url_decoded;
}

function check_rule(rule) {
    /* ルールが正常かどうかチェック */
    var target_allow = ["url", "description", "title", "suggest"];
    var type_allow = ["domain", "str", "str_head", "word", "regexp"];
    var action_allow = ["hide_absolutely", "hide", "hide_description_warn", "warn", "hide_description", "info", "allow"];

    return (typeof rule == "object" &&
            typeof rule.criteria == "string" &&
            typeof rule.target == "string" &&
            typeof rule.type == "string" &&
            typeof rule.action == "string" &&
            typeof rule.level == "number" &&
            !isNaN(rule.level) &&
            typeof rule.comment == "string" &&
            typeof rule.enabled == "boolean" &&
            target_allow.some(function(e) {
                return e === rule.target;
            }) &&
            type_allow.some(function(e) {
                return e === rule.type;
            }) &&
            action_allow.some(function(e) {
                return e === rule.action;
            })
           );
}

function check_config(config_json) {
    /* オブジェクト config_json を設定が格納されたオブジェクトとして
       正常なデータかどうかチェックする。
       同時に実装済だがconfig_jsonには定義されていない設定値については
       デフォルト値を設定する。
       (config_jsonの内容は変化する) */
    var valid = true;
    valid = (typeof config_json.config == "object" &&
             typeof config_json.rulesets == "object");
    if(valid) {
        Object.keys(config_default.config).forEach(function (k) {
            if (config_json.config[k] === null || config_json.config[k] === undefined) {
                console.warn('GSC: config_json.' + k + ' defaults to ' + config_default.config[k]);
                config_json.config[k] = config_default.config[k];
            }
        });
        jQuery.each(config_json.rulesets, function(id) {
            if(valid &&
               typeof this.name == "string" &&
               typeof this.enabled == "boolean" &&
               typeof this.rules == "object" &&
               jQuery.isArray(this.rules)){
                if(valid) {
                    jQuery.each(this.rules, function() {
                        if(!check_rule(this)) {
                            valid = false;
                            return false;
                        }
                    });
                }
            }
        });
    }
    return valid;
}

/* UI用関数群 */
function gso_rseditor_update_selection() {
    /* ボタンの有効・無効、各入力フィールドの更新を行う
       (ルールセット内のルールの選択状態を変更したら呼び出すこと) */
    var rule = {};
    var selection_size = $("#gso_ruleset_table table tbody tr.gso_rule_selected").length;
    if(selection_size === 0) {
        $("#gso_rule_add").text(cat[config.config.gso_lang].full.msg.addLast);
        $("#gso_rule_overwrite").prop("disabled", true);
        $("#gso_rule_remove").prop("disabled", true);
        $("#gso_rule_moveup").prop("disabled", true);
        $("#gso_rule_movedown").prop("disabled", true);
        $("#gso_rule_criteria").attr("placeholder", "");
        $("#gso_rule_comment").attr("placeholder", "");
        /* 入力フィールドはそのままにする */
    } else if (selection_size == 1) {
        rule = config.rulesets[$("#gso_ruleset_select").val()]
            .rules[Number($("#gso_ruleset_table table tbody tr.gso_rule_selected:first").attr('data-idx'))];
        $("#gso_rule_add").text(cat[config.config.gso_lang].full.msg.addNextToSelection);
        $("#gso_rule_overwrite").prop("disabled", false);
        $("#gso_rule_remove").prop("disabled", false);
        $("#gso_rule_moveup").prop("disabled", false);
        $("#gso_rule_movedown").prop("disabled", false);

        $("#gso_rule_criteria").attr("placeholder", "");
        $("#gso_rule_comment").attr("placeholder", "");
        $("#gso_rule_target").val(rule.target);
        $("#gso_rule_type").val(rule.type);
        $("#gso_rule_action").val(rule.action);
        $("#gso_rule_level").val(rule.level);
        $("#gso_rule_criteria").val(rule.criteria);
        $("#gso_rule_comment").val(rule.comment);
        $("#gso_rule_enabled").prop("checked", rule.enabled);
    } else {
        $("#gso_rule_add").text(cat[config.config.gso_lang].full.msg.addLast);
        $("#gso_rule_overwrite").prop("disabled", false);
        $("#gso_rule_remove").prop("disabled", false);
        $("#gso_rule_moveup").prop("disabled", true);
        $("#gso_rule_movedown").prop("disabled", true);
        $("#gso_rule_criteria").attr("placeholder", "(" + cat[config.config.gso_lang].full.msg.noChange + ")");
        $("#gso_rule_comment").attr("placeholder", "(" + cat[config.config.gso_lang].full.msg.noChange + ")");


        var data = {};

        $("#gso_ruleset_table table tbody tr.gso_rule_selected").each(function() {
            rule = config.rulesets[$("#gso_ruleset_select").val()].rules[Number($(this).attr('data-idx'))];
            Object.keys(rule).forEach(function (k) {
                if (data[k] === undefined) {
                    data[k] = rule[k];
                } else if (data[k] != rule[k]) {
                    data[k] = "";
                }
            });
        });

        $("#gso_rule_target").val(data.target);
        $("#gso_rule_type").val(data.type);
        $("#gso_rule_action").val(data.action);
        $("#gso_rule_level").val(data.level);
        $("#gso_rule_criteria").val(data.criteria);
        $("#gso_rule_comment").val(data.comment);

    }
    if(selection_size === 0) {
        $("#gso_rule_count").text($("#gso_ruleset_table table tbody tr").length +
                                  " " + cat[config.config.gso_lang].full.msg.rules);
    } else {
        $("#gso_rule_count").text($("#gso_ruleset_table table tbody tr").length +
                                  " " + cat[config.config.gso_lang].full.msg.rules +
                                  " (" + selection_size + " " +
                                  cat[config.config.gso_lang].full.msg.rules_selected + ")");
    }
}

function gso_rseditor_update_rslist() {
    /* ルールセットのリストを更新 */
    var id = $("#gso_ruleset_select").val();
    var ruleset = config.rulesets[id];
    $("#gso_ruleset_select option[value='"+ id +"']")
        .text(gso_rseditor_rslist_str(id, ruleset.name, ruleset.enabled));
}

function gso_rseditor_rslist_str(key, name, enabled) {
    return name + ' [' + key + ']' + (enabled ? '' : '[' + cat[config.config.gso_lang].full.msg.disabled + ']');
}

function gso_log_append(type, target, matched, title, url, ruleset, action, action_effective, override) {
    /* ログに表示 */
    var table = $("#gso_log_table table tbody");
    var row_style = 0;

    if(table.find("tr").length >= 1) {
        if(table.find("tr:last").attr("data-last-rule") === undefined) {
            if(table.find("tr:last").hasClass("gso_log_a")){
                row_style = 0;
            } else {
                row_style = 1;
            }
        } else {
            if(table.find("tr:last").hasClass("gso_log_a")){
                row_style = 1;
            } else {
                row_style = 0;
            }
        }
    } else {
        row_style = 0;
    }
    table.append(
        "<tr><td>" + cat[config.config.gso_lang].full.results[type] +
            "</td><td>" +
            "</td><td>" +
            "</td><td>" +
            "</td><td>" +
            "</td><td>" +
            "</td><td>" +
            "</td></tr>");
    if(row_style === 0) {
        table.find("tr:last").addClass("gso_log_a");
    } else {
        table.find("tr:last").addClass("gso_log_b");
    }

    if(override) {
        table.find("tr:last").addClass("gso_log_overridden");
    }
    if(action_effective == "hide_absolutely") {
        if(ruleset !== null) {
            let elemMatched = table.find("tr:last td:eq(2)")
                .append("<div style='width: 100%; color: silver;'></div>");
            elemMatched.attr("title", cat[config.config.gso_lang].full.msg.hidAbsolutely);
            elemMatched.text(cat[config.config.gso_lang].full.msg.hidAbsolutelyB);
        }
        if(ruleset !== null) {
            let elemRuleset = table.find("tr:last td:eq(5)")
                .append("<div class='gso_log_pointicon'></div>");
            elemRuleset.attr("title", "[" + ruleset + "]" + config.rulesets[ruleset].name);
        }
        if(action !== null) {
            table.find("tr:last td:eq(6)")
                .text(">> " + cat[config.config.gso_lang].full.action[action]);
        }
        table.find("tr:last td:eq(4)").remove();
        table.find("tr:last td:eq(3)").remove();
        table.find("tr:last td:eq(2)").attr("colspan", "3");

    } else {
        if(matched !== null) {
            table.find("tr:last td:eq(2)").text(matched);
        }
        if(title !== null && String(title).length > 0) {
            let elemTitle = table.find("tr:last td:eq(3)")
                .append("<div class='gso_log_pointicon'></div>");
            elemTitle.attr("title", title);
        }
        if(url !== null) {
            let elemUrl = table.find("tr:last td:eq(4)")
                .append("<div class='gso_log_pointicon'></div>");
            elemUrl.attr("title", url);
        }
        if(ruleset !== null) {
            let elemRuleset = table.find("tr:last td:eq(5)")
                .append("<div class='gso_log_pointicon'></div>");
            elemRuleset.attr("title", "[" + ruleset + "]" + config.rulesets[ruleset].name);
        }
        if(action !== null) {
            table.find("tr:last td:eq(6)")
                .text(">> " + cat[config.config.gso_lang].full.action[action]);
        }
    }

    if(target === null) {
        table.find("tr:last td:eq(1)").remove();
        table.find("tr:last td:first").attr("colspan", "2");
    } else {
        table.find("tr:last td:eq(1)").text(cat[config.config.gso_lang].abbrev.target[target]);
    }
}

function gso_log_setBoundary() {
    /*
      ログにおける検索結果の境界を設定
      複数のルールに合致した際などにどのルールがどの検索結果に合致したか
      わかりやすくする
    */
    $("#gso_log_table table tbody").find("tr:last").attr("data-last-rule", "last-rule");
}

function gso_rseditor_toggle() {
    $("#gso_config").toggle();
}

function gso_quick_block_b(node) {
    /* クイックブロック 詳細設定用要素作成
       node: 元クイックブロックボタン用要素 (div.quick_block) のjQueryオブジェクト */

    var qb_b = $("<div class='gso_quick_block_wnd gso_quick_block_b' style='display: none;'>" +
                 "<button class='gso_qb_close' type='button' style='position: absolute;top: 0px;right: 0px;'>×</button>" +
                 "<em>" + cat[config.config.gso_lang].full.msg.qbCreateNewRule + "</em>" +
                 "<form><ul>" +
                 "<li><label for='criteria'>URL:</label><input type='text' name='criteria'></li>" +
                 "<li><label for='comment'>" +
                 cat[config.config.gso_lang].full.msg.comment +
                 ":</label><input type='text' name='comment'></li>" +
                 "<li><label for='ruleset'>" +
                 cat[config.config.gso_lang].full.msg.qbAddTo +
                 ":</label><select name='ruleset'></select></li></ul>" +
                 "<input type='hidden' name='type' value='domain'>" +
                 "<button class='gso_qb_directAdd' type='button'>" +
                 cat[config.config.gso_lang].full.msg.qbAdd +
                 "</button><button class='gso_qb_sendToRE'  type='button'>" +
                 cat[config.config.gso_lang].full.msg.qbSendTo + "</button>" +
                 "<span class='gso_qb_msg'></span></form></div>")
        .insertAfter(node);

    if(node.attr('data-type') == 'domain') {
        qb_b.find("label:eq(0)").text(cat[config.config.gso_lang].full.msg.domain + ":");
    } else {
        qb_b.find("label:eq(0)").text(cat[config.config.gso_lang].full.msg.qbHeadURL + ":");
    }
    qb_b.find("input:eq(0)").val(node.attr('data-criteria'));
    qb_b.find("input:eq(2)").val(node.attr('data-type'));
    qb_b.find("button.gso_qb_sendToRE").click(function() {
        $("#gso_rule_target").val("url");
        $("#gso_rule_type").val(qb_b.find("input:eq(2)").val());
        $("#gso_rule_action").val("hide");
        $("#gso_rule_criteria").val(qb_b.find("input:eq(0)").val());
        $("#gso_rule_comment").val(qb_b.find("input:eq(1)").val());
        $("#gso_rule_enabled").prop("checked", true);
        $("#gso_rule_level").val(0);
        $("#gso_ruleset_select").val(qb_b.find("select:eq(0)").val());
        $("#gso_ruleset_select").change();
        $("#gso_config_header ul.gso_config_tab > li:eq(0)").click();
        $("#gso_config").show();
        qb_b.remove();
    });
    qb_b.find("button.gso_qb_close").click(function() {
        qb_b.remove();
    });
    jQuery.each(config.rulesets, function(id) {
        qb_b.find("select:eq(0)").append(
            '<option value="' + id + '">' +
                gso_rseditor_rslist_str(id, this.name, this.enabled) +
                '</option>');
    });
    qb_b.find("button.gso_qb_directAdd").click(function() {
        var new_rule = {
            "target": "url",
            "type": qb_b.find("input:eq(2)").val(),
            "action": "hide",
            "level": 0,
            "criteria": qb_b.find("input:eq(0)").val(),
            "comment": qb_b.find("input:eq(1)").val(),
            "enabled": true
        };
        if(!check_rule(new_rule)) return;
        config.rulesets[qb_b.find("select:eq(0)").val()].rules.push(new_rule);
        $("#gso_ruleset_select").change();
        gso_save();
        alert(cat[config.config.gso_lang].full.msg.qbAdded);
        qb_b.remove();
    });
    qb_b.show();
}

function gso_control_prepare() {
    /* 結果表示画面の作成 */
    var node_added = false;
    if(config.config.message_location == "page") {
        if($("#gso_control").length === 0) {
            //console.log("GSC: Results window (page) created.");
            var msg_elem = $('<div id="gso_resultWnd" class="gso_ui_root"></div>');
            msg_elem.append('<em>GSC</em> <span id="gso_resultWnd_icon" class="gso_emoji">-</span><span id="gso_resultWnd_count">-</span><span id="gso_resultWnd_IKcount" class="gso_resultWnd_IKcount" style="display: none;">Missing</span>');
            msg_elem.append('<div id="gso_results_msg_eff"></div>');
            msg_elem.append('<div class="gso_dummy"></div>'); /* dummy */
            msg_elem.addClass("gso_semitr"); /* ホバーされていない時は常時半透明表示 */
            if($("#hdtb").length > 0) {
                if(config.config.float) {
                    msg_elem.addClass("gso_float");
                } else {
                    msg_elem.addClass("gso_control_embedded_hdtb");
                }
                msg_elem.prependTo("#hdtb");
            } else {
                if(config.config.float) {
                    msg_elem.addClass("gso_float");
                } else {
                    msg_elem.addClass("gso_control_embedded_body");
                }
                msg_elem.prependTo("body");
            }
            var ctl_elem = $('<div id="gso_control" class="gso_ui_root gso_control_msg" style="position: absolute; display: none;" lang="' +
                             config.config.gso_lang + '"></div>');
            ctl_elem.append('<div id="gso_results_msg_top">' + cat[config.config.gso_lang].full.msg.ctlmsgNoSERP + '</div>');
            ctl_elem.append('<ul style="list-style-type: none;"></ul>');
            ctl_elem.find("ul").append('<li style="display:none"><button type="button" id="gso_killed_count_s" class="gso_control_buttons">R</button></li>');
            ctl_elem.find("ul").append('<li style="display:none"><button type="button" id="gso_killed_count_si" class="gso_control_buttons">I</button></li>');
            ctl_elem.find("ul").append('<li style="display:none"><button type="button" id="gso_killed_count_k" class="gso_control_buttons">S</button></li>');
            ctl_elem.append('<div id="gso_results_msg_ik"><hr><span id="gso_count_ik">' + cat[config.config.gso_lang].full.msg.ctlmsgMIS + '</span></div>');
            ctl_elem.append('<div id="gso_results_msg_suggest"><hr><span id="gso_count_suggest">' + cat[config.config.gso_lang].full.msg.ctlmsgSuggest + '</span></div>');
            ctl_elem.prependTo("#gso_resultWnd div.gso_dummy");
            node_added = true;
            $("#gso_resultWnd").hover(
                function () {
                    /* IN */
                    $("#gso_control").show();
                },
                function () {
                    /* OUT(do nothing) */
                    $("#gso_control").hide();

                }
            );
        }
    } else {
        if($("#gso_config #gso_results_msg_top").length === 0) {
            //console.log("GSC: Results window (config) created.");
            $("#gso_config fieldset:first").before('<div id="gso_results_msg_top">' + cat[config.config.gso_lang].full.msg.ctlmsgNoSERP + '</div>');
            $("#gso_results_msg_top").after('<ul style="list-style-type: none; display: inline-flex;"></ul>');
            $("#gso_results_msg_top + ul")
                .append('<li style="display:none"><button type="button" id="gso_killed_count_s" class="gso_control_buttons">R</button></li>')
                .append('<li style="display:none"><button type="button" id="gso_killed_count_si" class="gso_control_buttons">I</button></li>')
                .append('<li style="display:none"><button type="button" id="gso_killed_count_k" class="gso_control_buttons">S</button></li>');
            $("#gso_results_msg_top + ul")
                .after('<div id="gso_results_msg_ik"><hr><span id="gso_count_ik">' + cat[config.config.gso_lang].full.msg.ctlmsgMIS + '</span></div>')
                .after('<div id="gso_results_msg_suggest"><hr><span id="gso_count_suggest">' + cat[config.config.gso_lang].full.msg.ctlmsgSuggest + '</span></div>');
            node_added = true;
        }
    }
    if (node_added) {
        /* イベントハンドラ */
        $("#gso_killed_count_s").click(function () {
            if(gso_control_status.show_serp) {
                gso_control_status.show_serp = false;
            } else {
                gso_control_status.show_serp = true;
            }
            update_serp();
        });
        $("#gso_killed_count_si").click(function () {
            if(gso_control_status.show_img) {
                gso_control_status.show_img = false;
            } else {
                gso_control_status.show_img = true;
            }
            update_img();
        });
        $("#gso_killed_count_k").click(function () {
            if(gso_control_status.show_kw) {
                gso_control_status.show_kw = false;
            } else {
                gso_control_status.show_kw = true;
            }
            update_kw();
        });
        $(window).scroll(function () {
            /* 表示を追従させる */

            var ctl = $("#gso_resultWnd");
            var minimum_top_ctl = 60;
            var isIschMode = false;
            isIschMode = (location.href.search("&tbm=isch&") >= 0 || location.href.search("&udm=2&") >= 0);

            if(config.config.float) {
                ctl.removeClass("gso_control_embedded_body");
                ctl.removeClass("gso_control_embedded_hdtb");
                ctl.addClass("gso_float");
                /*
                if(ctl.parents("#hdtb").length) {
                    if($(window).scrollTop() > $("#hdtb").offset().top && ctl.hasClass("gso_control_embedded_hdtb")) {
                        ctl.removeClass("gso_control_embedded_hdtb");
                        ctl.addClass("gso_float");
                    } else if($(window).scrollTop() <= $("#hdtb").offset().top && ctl.hasClass("gso_float")) {
                        ctl.removeClass("gso_float");
                        ctl.addClass("gso_control_embedded_hdtb");
                    }
                } else {
                    if($(window).scrollTop() > minimum_top_ctl && ctl.hasClass("gso_control_embedded_body")) {
                        ctl.removeClass("gso_control_embedded_body");
                        ctl.addClass("gso_float");
                    } else if($(window).scrollTop() <= minimum_top_ctl && ctl.hasClass("gso_float")) {
                        ctl.removeClass("gso_float");
                        ctl.addClass("gso_control_embedded_body");
                    }
                }
                */
            } else {
                if(ctl.hasClass("gso_float")) {
                    ctl.removeClass("gso_float");
                }
                if(ctl.parents("#hdtb").length) {
                    ctl.addClass("gso_control_embedded_hdtb");
                } else {
                    ctl.addClass("gso_control_embedded_body");
                }
            }
        });

        /* 結果表示画面を更新 */
        update_gso_control_msg();

        /* #sbtc (Search Box) も #search (SERP) も存在しない場合は結果表示画面を消す */
        if($("#sbtc").length > 0 || $("#search").length > 0 || ("#sf").length > 0) {
            $("#gso_resultWnd").show();
        } else {
            $("#gso_resultWnd").hide();
        }
    }

}

function update_gso_control_msg() {
    //console.log("GSC: update_gso_control_msg()");
    /* 結果表示 */

    var count_totalSERP = $("*.gso_killed_serp").length;
    var count_totalSERPdesc = $("*.gso_titleonly_serp").length;
    var count_totalSERPimg = $("*.gso_killed_serpimg").length;
    var count_totalKW = $("*.gso_killed_kw").length;
    var count_totalIK = $("span.gso_ignored_kw:visible").length;

    $("#gso_resultWnd_count").html(count_totalSERP + count_totalSERPdesc + count_totalSERPimg + count_totalKW);
    $("#gso_killed_count_s").html(cat[config.config.gso_lang].full.msg.ctlmsgSERP + ": " + (count_totalSERP + count_totalSERPdesc));
    $("#gso_killed_count_si").html(cat[config.config.gso_lang].full.msg.ctlmsgIMG + ": " + count_totalSERPimg);
    $("#gso_killed_count_k").html(cat[config.config.gso_lang].full.msg.ctlmsgKW + ": " + count_totalKW);

    if(count_totalSERP > 0 || count_totalSERPdesc > 0) {
        $("#gso_killed_count_s").parent().show();
    } else {
        $("#gso_killed_count_s").parent().hide();
    }
    if(count_totalSERPimg > 0) {
        $("#gso_killed_count_si").parent().show();
    } else {
        $("#gso_killed_count_si").parent().hide();
    }
    if(count_totalKW > 0) {
        $("#gso_killed_count_k").parent().show();
    } else {
        $("#gso_killed_count_k").parent().hide();
    }

    if(config.config.message_location == "page") {
        if(count_totalIK > 0) {
            $("#gso_resultWnd_IKcount").show();
            $("#gso_resultWnd_IKcount").html(cat[config.config.gso_lang].full.msg.ctlmsgWndIK + " " + count_totalIK);
            $("#gso_count_ik").html(cat[config.config.gso_lang].full.msg.ctlmsgMIS.replace("%1", count_totalIK) + "<br>" +
                                    "<a href='" + location.href + "&tbs=li:1'>" +
                                    cat[config.config.gso_lang].full.msg.ctlmsgVerbatim + "</a>");
            $("#gso_results_msg_ik").show();
        } else {
            $("#gso_resultWnd_IKcount").hide();
            $("#gso_results_msg_ik").hide();
        }
        if(count_totalKWSuggest > 0) {
            $("#gso_count_suggest").html(cat[config.config.gso_lang].full.msg.ctlmsgSuggest.replace("%1", count_totalKWSuggest));
            $("#gso_results_msg_suggest").show();
        } else {
            $("#gso_results_msg_suggest").hide();
        }
        if(count_totalSERP > 0 ||
           count_totalSERPdesc > 0 ||
           count_totalSERPimg > 0 ||
           count_totalKW > 0) {
                $("#gso_resultWnd_icon").html("&#xfe0f;&#x26D4;");
                $("#gso_resultWnd_count").show();
                $("#gso_results_msg_top").html(cat[config.config.gso_lang].full.msg.ctlmsgBad);
        } else {
            $("#gso_resultWnd_icon").html("&#xfe0f;&#x2714;");
            $("#gso_resultWnd_count").hide();
            $("#gso_results_msg_top").html(cat[config.config.gso_lang].full.msg.ctlmsgGood);
        }
    } else {
        if(count_totalIK > 0) {
            $("#gso_count_ik").html(cat[config.config.gso_lang].full.msg.ctlmsgMIS.replace("%1", count_totalIK) +
                                        "<a href='" + location.href + "&tbs=li:1'>" +
                                        cat[config.config.gso_lang].full.msg.ctlmsgVerbatim + "</a>");
            $("#gso_count_ik").show();
        } else {
            $("#gso_resultWnd_IKcount").hide();
            $("#gso_count_ik").hide();
        }
        if(count_totalKWSuggest > 0) {
            $("#gso_count_suggest").html(cat[config.config.gso_lang].full.msg.ctlmsgSuggest.replace("%1", count_totalKWSuggest));
            $("#gso_results_msg_suggest").show();
        } else {
            $("#gso_results_msg_suggest").hide();
        }
        if(count_totalSERP > 0 ||
           count_totalSERPdesc > 0 ||
           count_totalSERPimg > 0 ||
           count_totalKW > 0) {
            $("#gso_results_msg_top").html(cat[config.config.gso_lang].full.msg.ctlmsgBad + cat[config.config.gso_lang].full.msg.ctlmsgBadB);
        } else {
            $("#gso_results_msg_top").html(cat[config.config.gso_lang].full.msg.ctlmsgGood);
        }
    }
}

function update_serp() {
    if(gso_control_status.show_serp) {
        $("*.gso_serp_description_a:not(*.gso_ani,*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").hide();
        $("*.gso_serp_description_b:not(*.gso_ani,*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").show();
        $("*.gso_serp_description_a.gso_ani:not(*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").slideUp("fast");
        $("*.gso_serp_description_b.gso_ani:not(*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").slideDown("fast");
    } else {
        $("*.gso_serp_description_a:not(*.gso_ani,*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").show();
        $("*.gso_serp_description_b:not(*.gso_ani,*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").hide();
        $("*.gso_serp_description_a.gso_ani:not(*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").slideDown("fast");
        $("*.gso_serp_description_b.gso_ani:not(*.gso_killed_kw_bad,*.gso_killed_kw_placeholder,*.gso_killed_serpimg_warn)").slideUp("fast");
    }
}
function update_img() {
    if(gso_control_status.show_img) {
        $("*.gso_killed_serpimg_warn.gso_serp_description_b").show();
        $("*.gso_killed_serpimg_warn.gso_serp_description_a").hide();
    } else {
        $("*.gso_killed_serpimg_warn.gso_serp_description_a").show();
        $("*.gso_killed_serpimg_warn.gso_serp_description_b").hide();
    }
    /* slideToggle ではなんかバグる */
}
function update_kw() {
    if(gso_control_status.show_kw) {
        $("span.gso_killed_kw span.gso_serp_description_a").hide();
        $("span.gso_killed_kw span.gso_serp_description_b").show();
    } else {
        $("span.gso_killed_kw span.gso_serp_description_a").show();
        $("span.gso_killed_kw span.gso_serp_description_b").hide();
    }
}


/* GM_setValue / GM_getValue */
function gso_save() {
    /* GM_setValue で現在の設定値(config)を保存する */
    Object.keys(config_default.config).forEach(function (k) {
        GM_setValue(k, config.config[k]);
    });
    GM_setValue("version", GM_info.script.version);

    GM_setValue("rulesets", JSON.stringify(config.rulesets));
    console.log("GSC: The configuration has been saved.");
    console.log(JSON.parse(GM_getValue("rulesets")));
}

function gso_load() {
    /* GM_getValue で設定を読み込む
       値が設定されていなかったらデフォルト値を読み込む */
    console.log("GSC: Loading configuration");
    config = {};
    config.config = {};
    config.rulesets = {};

    Object.keys(config_default.config).forEach(function (k) {
        config.config[k] = GM_getValue(k, config_default.config[k]);
    });

    config.rulesets = JSON.parse(GM_getValue("rulesets", '{"default":{"name":"既定のルールセット","enabled":true,"rules":[{"action":"hide","comment":"","criteria":"example.com","enabled":false,"level":0,"target":"url","type":"domain"}]}}'));
    console.log("GSC: loaded configuration");
    console.log(config);

    jQuery.fx.off = !config.config.animation;
}

/* インポート・エクスポート */
function gso_import_ruleset(rules, key) {
    if(typeof rules == "object" &&
       jQuery.isArray(rules)){
        var imported_count = 0;
        var malformed_entry = null;
        jQuery.each(rules, function() {
            if(check_rule(this)) {
                imported_count++;
                config.rulesets[key].rules.push(jQuery.extend(true, {}, this));
            } else {
                malformed_entry = this;
            }
        });
        if (imported_count == rules.length) {
            console.log("GSC: imported rules:", imported_count);
        } else if(imported_count == rules.length - 1) {
            console.log("GSC: imported rules:", imported_count);
            console.log("GSC: malformed rules:", JSON.stringify(malformed_entry));
        } else {
            console.log("GSC: imported rules:", imported_count);
            console.log("GSC: malformed rules:", JSON.stringify(malformed_entry));
        }
    } else {
        console.warn("GSC: import failed (invalid format)");
    }
}


/* 初期化用関数 */

function gso_config_rseditor_init() {
    $("#gso_ruleset_select option").remove();
    jQuery.each(config.rulesets, function(id) {
        $("#gso_ruleset_select").append(
            '<option value="' + id + '">' +
                gso_rseditor_rslist_str(id, this.name, this.enabled) +
                '</option>');
    });

    $("#gso_ruleset_select").change();

    $("#gso_ruleset_remove").prop("disabled", $("#gso_ruleset_select option").length <= 1);
    $("#gso_rule_enabled").prop("checked", true);
}

function gso_config_init() {
    gso_config_rseditor_init();
    $("#gso_config_misc input").each(function() {
        $(this).prop("checked", config.config[$(this).val()]);
    });
    $("#gso_config_misc select").each(function() {
        $(this).val(config.config[this.name]);
    });
}

/* グローバル変数 */
var count_totalKWSuggest = 0;

(function() {
    console.info("Google Search Cleaner " + GM_info.script.version + " started.");
    gso_load(); /* 設定を読み込む */

    GM_registerMenuCommand(cat[config.config.gso_lang].full.msg.GscConfigMenu, gso_rseditor_toggle);
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_ui_root { background-color: #404040; color: silver; border: 1px solid silver; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_ui_root { background-color: white; color: #404040; border: 1px solid black; }}");

    GM_addStyle("span.gso_killed_serp_msg {margin: 0 0; }");
    GM_addStyle("@media(prefers-color-scheme: dark) { span.gso_killed_serp_msg  { color: silver; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { span.gso_killed_serp_msg  { color: #404040; }}");

    GM_addStyle("*.gso_killed_serpimg_warn { display: block; position: absolute; width: 100%; height: 100%; z-index: 100; font-size: small; top: 0px; left: 0px;}");
	
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_killed_img_mask_serp { background-color: #000000; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_killed_img_mask_serp { background-color: #ffffff; }}");

    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_killed_img_mask_isch { background-color: #000000; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_killed_img_mask_isch { background-color: #f1f1f1; }}");

    GM_addStyle("span.gso_killed_kw_bad {text-decoration: line-through; white-space: nowrap;}");
    GM_addStyle("span.gso_killed_kw_placeholder {white-space: nowrap; border-radius: 3px/3px; padding: 1px;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { span.gso_killed_kw_placeholder { color: #404040; background-color: silver; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { span.gso_killed_kw_placeholder { color: silver; background-color: #404040; }}");

    GM_addStyle("li.gso_killed_kw_autocomplete { display: none !important;}");
    GM_addStyle("span.gso_killed_url { font-size: 0.60em; text-decoration:line-through;}");
    GM_addStyle("#gso_control { left: -3px; z-index: 9999; width: 128px; padding: 3px; }");
    GM_addStyle("#gso_resultWnd.gso_float #gso_control { bottom: 20px; }");
    GM_addStyle("#gso_resultWnd { left: 0px; padding: 2px; z-index: 9999; }");
    GM_addStyle("#gso_results_msg_eff { position: absolute; left: 0px; top: 0px; width: 100%; height: 100%; background-color: pink; display: none; }");
    GM_addStyle("*.gso_resultWnd_IKcount { background-color: darkred; color: white; border-radius: 2px/2px; padding: 2px; margin: 0px 0px 0px 5px; }");
    GM_addStyle("#gso_config { right: 0px; z-index: 9999; width: 480px; display: none; -moz-user-select: none; -webkit-user-select: none; font-size: x-small;}");
    GM_addStyle("#gso_config ul {padding: 0px;}");
    GM_addStyle("*.gso_config_header, *.gso_config_footer { background-color: whitesmoke;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_config_header, *.gso_config_footer { background-color: #606060; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_config_header, *.gso_config_footer { background-color: whitesmoke; }}");

    GM_addStyle("ul.gso_config_tab {list-style-type: none;}");
    GM_addStyle("ul.gso_config_tab li {display: inline-block; border: none; margin-left: 4px; border-radius: 4px 4px 0px 0px / 4px 4px 0px 0px; padding: 4px 4px 2px 4px;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { ul.gso_config_tab li { background-color: #404040; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { ul.gso_config_tab li { background-color: lightgray; }}");
	
    GM_addStyle("@media(prefers-color-scheme: dark) { ul.gso_config_tab li.gso_config_selected { background-color: darkred; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { ul.gso_config_tab li.gso_config_selected { background-color: pink; }}");

    GM_addStyle("ul.gso_config_tabpage {list-style-type: none;} ul.gso_config_tabpage fieldset {border: none;}");
    GM_addStyle("#gso_about_header {text-align: center;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { #gso_config thead tr { background-color: #606060; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { #gso_config thead tr { background-color: lightgray; }}");

    GM_addStyle("*.gso_control_msg {font-size: 0.80em;}");
    GM_addStyle("*.gso_control_buttons {font-size: inherit;}");

    GM_addStyle("*.gso_quick_block_wnd {position: absolute; border-radius: 3px/3px; padding: 3px; z-index: 9999;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_quick_block_wnd { background-color: #404040; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_quick_block_wnd { background-color: lightgray; }}");

    GM_addStyle("*.gso_quick_block_b ul {list-style: none;} *.gso_quick_block_b ul li label {float: left; width: 100px;}");
    GM_addStyle("*.gso_quick_block_b ul li input {width: 400px;} *.gso_quick_block_b ul li select {max-width: 400px;}");
    GM_addStyle("span.gso_ignored_kw { font-weight: bold; }");
    GM_addStyle("#gso_resultWnd.gso_float { position: fixed; bottom: 0px;}");
    GM_addStyle("#gso_config.gso_float { position: fixed; top: 0px;}");
    GM_addStyle("*.gso_semitr { opacity: 0.5;} *.gso_semitr:hover {opacity: 1;}");
    GM_addStyle("*.gso_control_embedded_body { position: absolute; top: 60px; }");
    GM_addStyle("*.gso_control_embedded_hdtb { position: absolute; top: 0px; }");
    GM_addStyle("*.gso_config_embedded { position: absolute; top: 0px; }");
    GM_addStyle("*.gso_serp_description_info { display: block; }");
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_serp_description_info { background: #404040; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_serp_description_info { background: lightgray; }}");
	
    GM_addStyle("*.gso_serp_description_warning { display: block;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_serp_description_warning { color: pink !important; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_serp_description_warning { color: darkred !important; }}");

    GM_addStyle("@media(prefers-color-scheme: dark) { tr.gso_rule_selected { background-color: darkred; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { tr.gso_rule_selected { background-color: pink; }}");

    GM_addStyle("tr.gso_rule_disabled {text-decoration: line-through;}");
    GM_addStyle("tr.gso_log_a {background-color: inherit;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { tr.gso_log_b { background-color: #484848; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { tr.gso_log_b { background-color: whitesmoke; }}");

    GM_addStyle("*.gso_log_overridden {text-decoration: line-through;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_log_overridden { color: #606060; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_log_overridden { color: silver; }}");

    GM_addStyle("td *.gso_log_pointicon {width: 100%; text-align: center;}");
    GM_addStyle("@media(prefers-color-scheme: dark) { *.gso_log_pointicon { color: silver; background-color: #606060; }}");
    GM_addStyle("@media(prefers-color-scheme: light) { *.gso_log_pointicon { color: #404040; background-color: silver; }}");
	
    GM_addStyle("*.gso_log_pointicon::before {content: '…';}");
    GM_addStyle("div.gso_dummy {position: relative;}");
    GM_addStyle("*.gso_emoji {font-family: 'Twitter Color Emoji','EmojiOne Color','Apple カラー絵文字','Apple Color Emoji','Gecko Emoji','Noto Emoji','Noto Color Emoji','Segoe UI Emoji',OpenSansEmoji,EmojiSymbols,DFPEmoji,'Segoe UI Symbol 8','Segoe UI Symbol','Noto Sans Symbols',Symbola,Quivira,'和田研中丸ゴシック2004絵文字',WadaLabChuMaruGo2004Emoji,'和田研細丸ゴシック2004絵文字',WadaLabMaruGo2004Emoji,'DejaVu Sans','VL Pゴシック',YOzFont,'Nishiki-teki','Android Emoji','Sun-ExtA',symbols,places,people,objects,nature,fantasy; }");

    /* 「すべて」の結果内に現れる検索結果のセレクタ */
    var selector_SERP =
        'div.tF2Cxc,' +
        'div.fy7gGf,' +
        'div.e2BEnf,' +
        'div[jscontroller="SC7lYd"],' +
        'div[jscontroller="Um3BXb"],' +
        'div.sHEJob,' + /* 2025/05 検索結果に現れる動画 */
        'div[jscontroller="rTuANe"],' + /* 同上 */
        "div.gT5me," +
        "div.qLyARd.e3SnQ > div," + /* 2023/02 recipe */
        "div.g:has(div.yuRUbf > a)," + /* 2021/01 G側の仕様変更 */
        "div.rc:has(div.yuRUbf > a)," + /* 2020/10 G側の仕様変更 */
        "div.rc:has(h3.r > a)," + /* サイト内検索 */
        "div.rc:has(div.r > a)," + /* 2018/09 G側の仕様変更 */
        "li.g:has(a._Dk)," + /* ニューストピック */
        "div.g:has(a._Dk)," + /* ニューストピック */
        "div.g:has(h3.LC20lb)," +
        "div._lnc div._cnc," +
        "div._lnc div._hnc," +
        "div._lnc div._Xmc," +
        "div.sld:has(h3.r > a.l)," +
        "div.sld:has(div.r > a.l)," + /* 2018/09 G側の仕様変更 */
        "div._knc:has(h3.r > a.l)," +
        "div._knc:has(div.r > a.l)," + /* 2018/09 G側の仕様変更 */
        "a._rQb, " +
        "div._lnc > a.top, " +
        "div.dbsr, " + /* 2016/11 G側の仕様変更 */
        "ul._vio > li._sio, " + /* 同上 */
        "div._Pcr, " + /* 2017/09 G側の仕様変更 */
        "div.P94G9b, " + /* 2018/06 G側の仕様変更 (SERPに挿入される動画検索結果) */
        "div.So9e7d" + /* 2018/07 G側の仕様変更 (トップニュース) */
        ""; /* dummy */
    /*
      トップニュース(2016/11): (div._NId div._Bfp) div.dbsr
      > a (URL)
      > div._qlp cite._NCp (From)
      トップニュース(2016/11横並び): (div._NId) ul._vio > li._sio
      a (URL)
      p._NRj._ORj.f._xRj > cite (from)
      トップニュース(2017/09横並び): (div._NId) g-scrolling-carousel div._Pcr
      a (URL)
      p._NRj._ORj.f._xRj > cite (from)
    */

    /* 「すべて」の結果内に現れる画像のセレクタ */
    var selector_IMG =
        "div.img-brk li.rg_el, " + /* 画像検索結果(旧) */
        "div.img-brk div.rg_el, " + /* 画像検索結果 */
        "#iur div.ivg-i" +
		""; /* dummy */

    /* 「画像」の検索結果に現れる画像のセレクタ */
    var selector_IMGLIST =
        "div#isr_mc div.rg_el, "+
        "div#islrg div.isv-r, " + /* 2020/01 G側の仕様変更 */
		"#rso div.ivg-i" + /* 2024/04 G側の仕様変更 */
		""; /* dummy */

    /* 関連する検索キーワード*/
    var selector_KW =
        "div#trev a, " +
        "div#brs p._e4b > a," +
        "div.brs_col p.nVcaUb > a," + /* 2018/08 G側の仕様変更 */
        "#bres a.k8XOCe," + /* 2021/02 G側の仕様変更 */
        "#bres div.b2Rnsc" + /* 2025/01 G側の仕様変更 */
        ""; /* dummy */


    function check(url, description, title, keyword, temp_rulesets) {
        /* ルールセットに合致するかどうかチェック
           優先度ごとに最初に合致したルールと内包するルールセットを
           表すオブジェクトの配列を返す。
           そうでなければ 空の配列 を返す。*/
        var query = null;
        var rulesets = null;

        var matched_rules = [];
        var last_level = -1;

        if(temp_rulesets === null) {
            rulesets = config.rulesets;
        } else {
            rulesets = temp_rulesets;
        }

        jQuery.each(rulesets, function(id) {
            /* for each ruleset in rulesets */
            if(this.enabled) { /* this ruleset is enabled */
                jQuery.each(this.rules, function() {
                    /* for each rule in ruleset */
                    if(this.enabled && this.level - last_level <= 1) {
                        if(this.target == "suggest") {
                            query = keyword;
                        } else if(this.target == "url") {
                            query = decodeURI_s(url);
                        } else if(this.target == "title") {
                            query = title;
                        } else if(this.target == "description") {
                            query = description;
                        }
                        if(query !== null) {
                            var matched = chk_str(query, this.criteria, this.type);
                            if (matched !== null) {
                                if(this.level <= last_level) {
                                    matched_rules.push(matched_rules[matched_rules.length-1].filter(function(e) {
                                        return e.rule.level < this.level;
                                    }));
                                }
                                if(last_level < 0) {
                                    matched_rules.push([]);
                                }
                                matched_rules[matched_rules.length-1].push({
                                    "ruleset_id": id,
                                    "rule": this,
                                    "matched": matched.join(" ")
                                });

                                last_level = this.level;
                            }
                        }
                    }
                });
            }
        });
        return matched_rules;
    }

    function get_most_significant_rule(matched_rules) {
        /* 複数のルール(のツリー)に合致した場合、最も厳しい処理を適用する */
        var context = null;
        var action = action_priority.undef;
        matched_rules.forEach(function(element) {
            if(action < action_priority[element[element.length - 1].rule.action]) {
                if(context !== null) {
                    delete context.effective;
                }
                context = element[element.length - 1];
                action = action_priority[element[element.length - 1].rule.action];
                context.effective = true;
            }
        });
        return context;
    }

    if($("#gso_config").length === 0) {
        /* 設定画面 */
        var cfg_elem = $('<form id="gso_config" class="gso_config_embedded gso_ui_root" lang="'+
                         config.config.gso_lang + '"></form>');
        cfg_elem.append('<div id="gso_config_header" class="gso_config_header" style="width: 100%;"></div>');
        cfg_elem.find("#gso_config_header")
            .append('<span style="display: block; text-align: right"><button type="button" id="gso_config_close" class="gso_control_buttons" title="' + cat[config.config.gso_lang].full.msg.close + '">×</button></span>')
            .append('<ul class="gso_config_tab"></ul>');
        cfg_elem.find('ul.gso_config_tab')
            .append('<li class="gso_config_selected" title="' + cat[config.config.gso_lang].full.msg.configTabRSEditH + '">' + cat[config.config.gso_lang].full.msg.configTabRSEdit + '</li>')
            .append('<li title="' + cat[config.config.gso_lang].full.msg.configTabRSMngH + '">' + cat[config.config.gso_lang].full.msg.configTabRSMng + '</li>')
            .append('<li title="' + cat[config.config.gso_lang].full.msg.configTabLogH + '">' + cat[config.config.gso_lang].full.msg.configTabLog + '</li>')
            .append('<li title="' + cat[config.config.gso_lang].full.msg.configTabPrefsH + '">' + cat[config.config.gso_lang].full.msg.configTabPrefs + '</li>')
            .append('<li title="' + cat[config.config.gso_lang].full.msg.configTabBackupH + '">' + cat[config.config.gso_lang].full.msg.configTabBackup + '</li>')
            .append('<li title="' + cat[config.config.gso_lang].full.msg.configTabAboutH + '">' + cat[config.config.gso_lang].full.msg.configTabAbout + '</li>');
        cfg_elem.append('<ul class="gso_config_tabpage"></ul>');
        cfg_elem.find('ul.gso_config_tabpage')
            .append('<li></li>')
            .append('<li style="display: none;"></li>')
            .append('<li style="display: none;"></li>')
            .append('<li style="display: none;"></li>')
            .append('<li style="display: none;"></li>')
            .append('<li style="display: none;"></li>');
        var fieldset = $('<fieldset></fieldset>');
        fieldset.append('<div id="gso_ruleset_editor"></div>');
        fieldset.find('#gso_ruleset_editor')
            .append('<label for="gso_ruleset_select">'+ cat[config.config.gso_lang].full.msg.ruleset +':</label>')
            .append('<select id="gso_ruleset_select" name="gso_ruleset_select"></select>')
            .append('<input id="gso_ruleset_enabled" type="checkbox" value="gso_ruleset_enabled">' + cat[config.config.gso_lang].full.msg.enabled + '<hr>')
            .append('<div></div>');
        fieldset.find('#gso_ruleset_editor > div:last')
            .append('<table style="width:440px; border-spacing: 0px 2px;"></table>')
            .append('<div id="gso_ruleset_table" style="height: 100px; width: 100%; overflow-y: scroll; overflow-x: hidden;"></div>')
            .append('<button type="button" id="gso_ruleset_selectAll" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.selectAll + '</button>')
            .append('<button type="button" id="gso_ruleset_unselectAll" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.unselectAll + '</button>')
            .append('<button type="button" id="gso_ruleset_selectToggle" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.toggleSelection + '</button>')
            .append('<span id="gso_rule_count"></span><br>')
            .append(cat[config.config.gso_lang].full.msg.moveSelected)
            .append('<button type="button" id="gso_rule_moveup" class="gso_control_buttons">▲</button>')
            .append('<button type="button" id="gso_rule_movedown" class="gso_control_buttons">▼</button> ')
            .append('<button type="button" id="gso_rule_remove" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.deleteSelected + '</button><br>')
            .append(cat[config.config.gso_lang].full.msg.exportSelected + '<button type="button" id="gso_ruleset_exportJSON" class="gso_control_buttons">JSON</button>')
            .append('<button type="button" id="gso_ruleset_exportURL" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.urlList + '</button>')
            .append('<a id="gso_ruleset_export_dllink" style="display: none;">.</a> ')
            .append('<button type="button" id="gso_ruleset_import_menuToggle" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.importFromFile + '</button>')
            .append('<div id="gso_ruleset_import_menu" style="display: none;"></div>')
            .append('<hr>')
            .append('<div style="width:100%;"></div>')
            .append('<button type="button" id="gso_rule_add" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.addLast + '</button>')
            .append('<button type="button" id="gso_rule_overwrite" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.overwrite + '</button>');
        fieldset.find("#gso_ruleset_import_menu")
            .append(cat[config.config.gso_lang].full.msg.importFromFileAndAdd)
            .append('<input type="file" id="gso_ruleset_importJSON" name="rulesetJSON[]"><br>');
        fieldset.find('#gso_ruleset_editor > div:last > table:first')
            .append('<colgroup>' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 4.5em; min-width: 4.5em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 2em; min-width: 2em;">' +
                    '<col style="width: 248px;">' +
                    '<col style="width: 1em; min-width: 1em;">' +
                    '</colgroup>')
            .append('<thead><tr style="font-weight: bold;">' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.target + '</td>' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.type + '</td>' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.action + '</td>' +
                    '<td>Lv</td>' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.criteria + '</td>' +
                    '<td>C</td>' +
                    '</tr></thead>');
        fieldset.find('#gso_ruleset_table')
            .append('<table style="width:440px; border-spacing: 0px 2px;">' +
                    '<colgroup>' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 4.5em; min-width: 4.5em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 2em; min-width: 2em;">' +
                    '<col style="width: 248px;">' +
                    '<col style="width: 1em; min-width: 1em;">' +
                    '</colgroup>' +
                    '<tbody></tbody>' +
                    '</table>');
        fieldset.find('#gso_ruleset_editor > div:last > div:last')
            .append('<div>' +
                    '<input id="gso_rule_enabled" type="checkbox" value="gso_rule_enabled">' +
                    cat[config.config.gso_lang].full.msg.currentRuleEnabled +
                    '</div>')
            .append('<div style="display: inline-block;">' +
                    cat[config.config.gso_lang].full.msg.target + ':<br>' +
                    '<select id="gso_rule_target" name="gso_rule_target">' +
                    '<option value="url">' + cat[config.config.gso_lang].full.target.url + '</option>' +
                    '<option value="description">' + cat[config.config.gso_lang].full.target.description + '</option>' +
                    '<option value="title">' + cat[config.config.gso_lang].full.target.title + '</option>' +
                    '<option value="suggest">' + cat[config.config.gso_lang].full.target.suggest + '</option>' +
                    '</select>' +
                    '</div>')
            .append('<div style="display: inline-block;">' +
                    cat[config.config.gso_lang].full.msg.type + ':<br>' +
                    '<select id="gso_rule_type" name="gso_rule_type">' +
                    '<option value="domain">' + cat[config.config.gso_lang].full.type.domain + '</option>' +
                    '<option value="str">' + cat[config.config.gso_lang].full.type.str + '</option>' +
                    '<option value="str_head">' + cat[config.config.gso_lang].full.type.str_head + '</option>' +
                    '<option value="word">' + cat[config.config.gso_lang].full.type.word + '</option>' +
                    '<option value="regexp">' + cat[config.config.gso_lang].full.type.regexp + '</option>' +
                    '</select>' +
                    '</div>')
            .append('<div style="display: inline-block;">' +
                    cat[config.config.gso_lang].full.msg.action + ':<br>' +
                    '<select id="gso_rule_action" name="gso_rule_action">' +
                    '<option value="hide_absolutely">' + cat[config.config.gso_lang].full.action.hide_absolutely + '</option>' +
                    '<option value="hide">' + cat[config.config.gso_lang].full.action.hide + '</option>' +
                    '<option value="hide_description_warn">' + cat[config.config.gso_lang].full.action.hide_description_warn + '</option> ' +
                    '<option value="hide_description">' + cat[config.config.gso_lang].full.action.hide_description + '</option>' +
                    '<option value="warn">' + cat[config.config.gso_lang].full.action.warn + '</option>' +
                    '<option value="info">' + cat[config.config.gso_lang].full.action.info + '</option>' +
                    '<option value="allow">' + cat[config.config.gso_lang].full.action.allow + '</option>' +
                    '</select>' +
                    '</div>')
            .append('<div style="display: inline-block;">' +
                    cat[config.config.gso_lang].full.msg.level + ':<br>' +
                    '<input type="text" id="gso_rule_level" name="gso_rule_level" placeholder="0" style="width: 2em;">' +
                    '</div>')
            .append('<div style="display: inline-block;">' +
                    cat[config.config.gso_lang].full.msg.criteria + ':<br>' +
                    '<textarea type="text" id="gso_rule_criteria" name="gso_rule_criteria" placeholder="" style="width: 210px; font-size: inherit;"></textarea>' +
                    '</div>')
            .append('<div style="display: inline-block;">' +
                    cat[config.config.gso_lang].full.msg.comment + ':<br>' +
                    '<textarea type="text" id="gso_rule_comment" name="gso_rule_comment" placeholder="" style="width: 210px; font-size: inherit;"></textarea>' +
                    '</div>');
        cfg_elem.find('ul.gso_config_tabpage > li').eq(0).append(fieldset);

        fieldset = $('<fieldset></fieldset>');
        fieldset.append('<div id="gso_ruleset_manager"></div>');
        fieldset.find('#gso_ruleset_manager')
            .append(cat[config.config.gso_lang].full.msg.friendlyNameForCurrentRuleset + ':<input type="text" id="gso_ruleset_name" name="gso_ruleset_name" placeholder="' + cat[config.config.gso_lang].full.msg.friendlyName + '" style="width: auto;"><br>')
            .append('<button type="button" id="gso_ruleset_remove" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.deleteCurrentRuleset + '</button><br>')
            .append('<input type="text" id="gso_new_ruleset_key" name="gso_new_ruleset_key" placeholder="' + cat[config.config.gso_lang].full.msg.key + '" style="width: 6em;">')
            .append('<button type="button" id="gso_ruleset_add" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.addRuleset + '</button><hr>');
        cfg_elem.find('ul.gso_config_tabpage > li').eq(1).append(fieldset);

        fieldset = $('<fieldset></fieldset>');
        fieldset.append('<div id="gso_log"></div>');
        fieldset.find('#gso_log')
            .append('<div></div>')
            .append('<button type="button" id="gso_log_clear" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.clear + '</button><br>')
            .append(cat[config.config.gso_lang].full.msg.pointForDetails + '<br>')
            .append(cat[config.config.gso_lang].full.msg.indicateOverride + '<br>');
        fieldset.find('#gso_log > div:first')
            .append('<table style="width:440px; border-spacing: 0px 2px;"></table>')
            .append('<div id="gso_log_table" style="height: 100px; width: 100%; overflow-y: scroll; overflow-x: hidden;"></div>');
        fieldset.find('#gso_log > div:first > table')
            .append('<colgroup>' +
                    '<col style="width: 4em; min-width: 4em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 175px;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 11em; min-width: 11em;">' +
                    '</colgroup>')
            .append('<thead><tr style="font-weight: bold;">' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.contentType + '</td>' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.target + '</td>' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.matchedString + '</td>' +
                    '<td>T/KW</td>' +
                    '<td>URL</td>' +
                    '<td>RS</td>' +
                    '<td>' + cat[config.config.gso_lang].abbrev.table.action + '</td>' +
                    '</tr></thead>');
        fieldset.find('#gso_log_table')
            .append('<table style="width:440px; border-spacing: 0px 0px;">' +
                    '<colgroup>' +
                    '<col style="width: 4em; min-width: 4em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 175px;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 3em; min-width: 3em;">' +
                    '<col style="width: 11em; min-width: 11em;">' +
                    '</colgroup>' +
                    '<tbody>' +
                    '</tbody>');
        cfg_elem.find('ul.gso_config_tabpage > li').eq(2).append(fieldset);

        fieldset = $('<fieldset></fieldset>');
        fieldset.append('<div id="gso_config_misc"></div>');
        fieldset.find('#gso_config_misc')
            .append('<span style="font-size: large;">' + cat[config.config.gso_lang].full.msg.configPrefsSecApr + '</span><br>')
            .append(cat[config.config.gso_lang].full.msg.configLang +
                    (config.config.gso_lang == 'en' ? '' : ' / Language ') +
                    '<span class="gso_emoji">&#xfe0f;&#x1f30f;</span>: <select id="gso_lang" name="gso_lang"></select><br>')
            .append(cat[config.config.gso_lang].full.msg.configMessageLocation + ': <select id="message_location" name="message_location"></select><br>')
            .append('<input type="checkbox" value="float">' + cat[config.config.gso_lang].full.msg.configFloat + '<br>')
            .append('<input type="checkbox" value="animation">' + cat[config.config.gso_lang].full.msg.configAnimation + '<br>')
            .append('<span style="font-size: large;">' + cat[config.config.gso_lang].full.msg.configPrefsSecAdd + '</span><br>')
            .append('<input type="checkbox" value="quick_block">' + cat[config.config.gso_lang].full.msg.configQuickBlock + '<br>')
            .append('<input type="checkbox" value="check_for_image">' + cat[config.config.gso_lang].full.msg.configCheckForImage + '<br>')
            .append('<input type="checkbox" value="ruleset_name_with_comment">' + cat[config.config.gso_lang].full.msg.configRSNameWithComment + '<br>')
            .append('(' + cat[config.config.gso_lang].full.msg.configRSNameWithCommentB + ')<br>')
            .append('<input type="checkbox" value="fix_missing">' + cat[config.config.gso_lang].full.msg.configFixMissing + '<br>')
            .append('<input type="checkbox" value="hide_moshikashite">' + cat[config.config.gso_lang].full.msg.configHideMoshikashite + '<br>')
            .append('<input type="checkbox" value="force_keyword_exclusion_on_suggestion">' + cat[config.config.gso_lang].full.msg.configForceKWExcl + '<br>')
            .append('<span style="font-size: large;">' + cat[config.config.gso_lang].full.msg.configPrefsSecDbg + '</span><br>')
            .append('<input type="checkbox" value="always_log_checked_entries">' + cat[config.config.gso_lang].full.msg.configAlwaysLog + '<br>');
        Object.keys(cat).forEach(function (k) {
            fieldset.find('#gso_lang').append(
                '<option value="' + k + '">' +
                    cat[k].langName[k] +
                    (config.config.gso_lang == k ? '' : ' [' + cat[k].langName[config.config.gso_lang] + ']') +
                    '</option>');
        });

        fieldset.find('#message_location')
            .append('<option value="page">' + cat[config.config.gso_lang].full.msg.configMessageLocationPage + '</option>')
            .append('<option value="config">' + cat[config.config.gso_lang].full.msg.configMessageLocationConfig + '</option>');
        cfg_elem.find('ul.gso_config_tabpage > li').eq(3).append(fieldset);

        fieldset = $('<fieldset></fieldset>');
        fieldset.append('<div id="gso_backup"></div>');
        fieldset.find('#gso_backup')
            .append('<button type="button" id="gso_exportAllJSON" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.backupToFile + '</button><hr>')
            .append(cat[config.config.gso_lang].full.msg.restoreAll + '<br>')
            .append('<input type="file" id="gso_importAllJSON" name="rulesetJSON[]"><br><br>')
            .append('<div style="text-align: right;"></div>');
        fieldset.find('#gso_backup > div:first')
            .append(cat[config.config.gso_lang].full.msg.init +
                    '<button type="button" id="gso_resetAll" class="gso_control_buttons" data-phase="0">' +
                    cat[config.config.gso_lang].full.msg.initButton + '</button>');
        cfg_elem.find('ul.gso_config_tabpage > li').eq(4).append(fieldset);

        fieldset = $('<fieldset></fieldset>');
        fieldset.append('<div id="gso_about"><div id="gso_about_header"></div></div>');
        fieldset.find("#gso_about_header")
            .append('<span style="font-size: x-large">Google掃除機(仮称)<br>(Google Search Cleaner)</span><br>Version ' + GM_info.script.version + '<br>');
        fieldset.find("#gso_about")
            .append(cat[config.config.gso_lang].full.msg.aboutAuthor +
                    ': たかだか。(TKDK.) ' +
                    '<ul>' +
                    '<li><a href="https://misskey.io/@tkdk_bemusic" target="_blank">Misskey.io (Recommended)</a></li>' +
                    '<li><a href="https://bsky.app/profile/tkdk-bemusic.bsky.social" target="_blank">Bluesky</a></li>' +
                    '<li><a href="https://mstdn.jp/@djtkdk_086969" target="_blank">mstdn.jp</a></li>' +
                    '<li><a href="https://twitter.com/djtkdk_086969" target="_blank">X (former Twitter)</a></li>' +
                    '<li><a href="https://greasyfork.org/users/29445" target="_blank">Greasy Fork</a></li>' +
                    '<li><a href="https://github.com/djtkdk-086969" target="_blank">GitHub</a></li>' +
                    '</ul>'
                   )
            .append(cat[config.config.gso_lang].full.msg.aboutLicense + ': GPL v3<br>')
            .append(cat[config.config.gso_lang].full.msg.aboutJQ + '<br>')
            .append(cat[config.config.gso_lang].full.msg.aboutDisclaimer + '<br>');
        cfg_elem.find('ul.gso_config_tabpage > li').eq(5).append(fieldset);

        cfg_elem.append('<div id="gso_config_footer" class="gso_config_footer" style="width: 100%;"></div>');
        cfg_elem.find("#gso_config_footer")
            .append('<button type="button" id="gso_save" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.saveChange + '</button>')
            .append('<button type="button" id="gso_revert" class="gso_control_buttons">' + cat[config.config.gso_lang].full.msg.discardChange + '</button><br>')
            .append('<span id="gso_status">' + cat[config.config.gso_lang].full.msg.changeNotSaved + '</span>');

        cfg_elem.prependTo("body");

        /* Event handlers */
        $("ul.gso_config_tab > li").click(function () {
            var idx = $("ul.gso_config_tab > li").index(this);
            $("ul.gso_config_tab > li").removeClass("gso_config_selected");
            $("ul.gso_config_tab > li").eq(idx).addClass("gso_config_selected");
            $("ul.gso_config_tabpage > li").hide();
            $("ul.gso_config_tabpage > li").eq(idx).show();
        });
        $("#gso_config_close").click(function () {
            $("#gso_config").toggle();
        });

        $("#gso_new_ruleset_key").change(function () {
            var key = $(this).val();
            var already_exists = false;
            if(key === null || key === "") {
                $("#gso_ruleset_add").prop("disabled", true);
            } else {
                already_exists = Object.keys(config.rulesets).some(function(e) {
                    return e === key;
                });
                $("#gso_ruleset_add").prop("disabled", already_exists);
            }
        });

        $("#gso_ruleset_remove").click(function () {
            if(Object.keys(config.rulesets).length > 1) {
                delete config.rulesets[$("#gso_ruleset_select").val()];
                gso_config_rseditor_init();
            } else {
                $("#gso_status").text(cat[config.config.gso_lang].full.msg.lastRulesetCannotBeDeleted);
            }
        });

        $("#gso_ruleset_add").click(function () {
            var key = $("#gso_new_ruleset_key").val();
            var already_exists = false;
            if(key === null || key === "") {
                /* no key or name is given */
                return;
            }
            already_exists = Object.keys(config.rulesets).some(function(e) {
                return e === key;
            });
            if(!already_exists) {
                /* add new ruleset */
                config.rulesets[key] = {
                    "name": "(無題)",
                    "enabled": true,
                    "rules": [
                    ]};
                gso_config_rseditor_init();
            }
        });


        $("#gso_ruleset_select").change(function () {
            $("#gso_config button").removeAttr("disabled");
            $("#gso_ruleset_table table tbody tr").remove();
            var ruleset = config.rulesets[$("#gso_ruleset_select").val()];
            jQuery.each(ruleset.rules, function(i) {
                var table = $("#gso_ruleset_table table tbody").append(
                    "<tr data-idx='" + i +"'>" +
                        "<td>" + cat[config.config.gso_lang].abbrev.target[this.target] +
                        "</td><td>" + cat[config.config.gso_lang].abbrev.type[this.type] +
                        "</td><td><div title='" + cat[config.config.gso_lang].full.action[this.action] +
                        "' style='width: 100%;'>" + cat[config.config.gso_lang].abbrev.action[this.action] +
                        "</div></td><td>" + this.level +
                        "</td><td style='overflow: hidden; white-space: nowrap; width: 248px; max-width: 248px; text-overflow: ellipsis;'>" + this.criteria +
                        "</td><td>" +
                        "</td></tr>");
                if(this.comment !== "") {
                    table.find("tr:last td:eq(5)")
                        .append("<div title='" + this.comment + "' class='gso_emoji' style='width: 100%;'>&#xfe0f;&#x1f4ac;</div>");
                }
                if(!this.enabled) {
                    table.find("tr:last").addClass("gso_rule_disabled");
                }
            });
            $("#gso_ruleset_enabled").prop("checked", ruleset.enabled);
            $("#gso_ruleset_name").val(ruleset.name);

            $("#gso_ruleset_table table tbody tr").click(function () {
                $(this).toggleClass("gso_rule_selected");
                gso_rseditor_update_selection();
            });
            gso_rseditor_update_selection();
        });

        $("#gso_ruleset_name").change(function () {
            var ruleset = config.rulesets[$("#gso_ruleset_select").val()];
            ruleset.name = $(this).val();
            gso_rseditor_update_rslist();
        });
        $("#gso_ruleset_enabled").change(function () {
            var ruleset = config.rulesets[$("#gso_ruleset_select").val()];
            ruleset.enabled = $(this).prop("checked");
            gso_rseditor_update_rslist();
        });

        $("#gso_ruleset_exportJSON").click(function () {
            var rules = [];
            $("#gso_ruleset_table table tbody tr.gso_rule_selected").each(function() {
                rules.push(config.rulesets[$("#gso_ruleset_select").val()].rules[Number($(this).attr('data-idx'))]);
            });
            var export_json = JSON.stringify(rules);
            var blob = new Blob([export_json], {'type': 'application/json'});
            var dl_link = document.getElementById('gso_ruleset_export_dllink');
            dl_link.target = '_blank';
            dl_link.download = "rules.json";
            dl_link.href = (window.URL || window.webkitURL).createObjectURL(blob);
            dl_link.click();
            dl_link.href = "#";
        });
        $("#gso_ruleset_exportURL").click(function () {
            var text = [];
            var rule;
            $("#gso_ruleset_table table tbody tr.gso_rule_selected").each(function() {
                rule = config.rulesets[$("#gso_ruleset_select").val()].rules[Number($(this).attr('data-idx'))];
                if(rule.type == "str" || rule.type == "domain" || rule.type == "word") {
                    text.push(rule.criteria);
                } else if(rule.type == "str_head") {
                    text.push("/^" + rule.criteria + "/i");
                } else if(rule.type == "regexp") {
                    text.push("/" + rule.criteria + "/i");
                }
            });
            var export_text = text.join("\n");
            var blob = new Blob([export_text], {'type': 'text/plain'});
            var dl_link = document.getElementById('gso_ruleset_export_dllink');
            dl_link.target = '_blank';
            dl_link.download = "rules.txt";
            dl_link.href = (window.URL || window.webkitURL).createObjectURL(blob);
            dl_link.click();
            dl_link.href = "#";
        });
        $("#gso_ruleset_import_menuToggle").click(function () {
            $("#gso_ruleset_import_menu").slideToggle();
        });
        $("#gso_ruleset_importJSON").change(function (event) {
            var rules_json;
            var key = $("#gso_ruleset_select").val();
            if (key === "") {
                return false;
            } else {
                var file = event.target.files[0];
                /* MacではOKだが、Windowsだとfile.typeは空になる
                   if(file.type != 'application/json' && file.type != 'text/plain') {
                   return true; // continue
                   }
                */
                var reader = new FileReader();
                reader.onload = (function(file) {
                    return function(evt) {
                        try {
                            rules_json = JSON.parse(evt.target.result);
                        }
                        catch (e) {
                            if (e instanceof SyntaxError) {
                                /* JSONの構文が正しくない 単純リスト形式でのインポートを試みる */
                                console.info("GSC: Invalid JSON syntax. Attempting to read as a simple list.");
                                var text = evt.target.result.split(/\r\n|\r|\n/);
                                rules_json = [];
                                text.forEach(function(element) {
                                    if(/^([a-zA-Z0-9][a-zA-Z0-9\-]*\.)+[a-zA-Z]+$/.test(element)) {
                                        /* ドメイン名 */
                                        rules_json.push({
                                            "target": "url",
                                            "type": "domain",
                                            "action": "hide",
                                            "level": 0,
                                            "criteria": element,
                                            "comment": "",
                                            "enabled": true
                                        });
                                    } else {
                                        /* そうでない場合は対象「URL」、文字列単純検索を仮定する */
                                        rules_json.push({
                                            "target": "url",
                                            "type": "str",
                                            "action": "hide",
                                            "level": 0,
                                            "criteria": element,
                                            "comment": "",
                                            "enabled": true
                                        });
                                    }
                                });
                            }
                        }
                        gso_import_ruleset(rules_json, key);
                        gso_config_rseditor_init();
                    };
                })(file);
                reader.readAsText(file);
            }
        });
        $("#gso_exportAllJSON").click(function () {
            var export_json = JSON.stringify(config);
            var blob = new Blob([export_json], {'type': 'application/json'});
            var dl_link = document.getElementById('gso_ruleset_export_dllink');
            dl_link.target = '_blank';
            dl_link.download = "config.json";
            dl_link.href = (window.URL || window.webkitURL).createObjectURL(blob);
            dl_link.click();
            dl_link.href = "#";
        });
        $("#gso_importAllJSON").change(function (event) {
            var file = event.target.files[0];
            /* MacではOKだが、Windowsだとfile.typeは空になる
               if(file.type != 'application/json' && file.type != 'text/plain') {
               return true; // continue
               }
            */
            var reader = new FileReader();
            reader.onload = (function(file) {
                return function(evt) {
                    var config_json;
                    try {
                        config_json = JSON.parse(evt.target.result);
                    }
                    catch (e) {
                        console.log(e.message);
                        if (e instanceof SyntaxError) {
                            $("#gso_status").text(cat[config.config.gso_lang].full.msg.invalidJSON);
                            return;
                        }
                    }
                    if(check_config(config_json)) {
                        config = config_json;
                        gso_config_rseditor_init();
                    } else {
                        console.log(config_json);
                        $("#gso_status").text(cat[config.config.gso_lang].full.msg.invalidConfig);
                    }
                };
            })(file);
            reader.readAsText(file);
        });
        $("#gso_resetAll").click(function () {
            var phase = Number($(this).attr('data-phase'));
            if (phase === 0) {
                $(this).text(cat[config.config.gso_lang].full.msg.initConfirm);
                $(this).attr('data-phase', "1");
            } else if(phase >= 1) {
                GM_deleteValue("quick_block");
                GM_deleteValue("check_for_image");
                GM_deleteValue("ruleset_name_with_comment");
                GM_deleteValue("fix_missing");
                GM_deleteValue("hide_moshikashite");
                GM_deleteValue("force_keyword_exclusion_on_suggestion");
                GM_deleteValue("always_log_checked_entries");
                GM_deleteValue("float");
                GM_deleteValue("animation");
                GM_deleteValue("verbose");

                GM_deleteValue("rulesets");

                gso_load();
                gso_config_init();
                $("#gso_status").text(cat[config.config.gso_lang].full.msg.initialized);
                $(this).text(cat[config.config.gso_lang].full.msg.initButton);
                $(this).attr('data-phase', "0");
            }
        });

        $("#gso_ruleset_selectAll").click(function () {
            $("#gso_ruleset_table table tbody tr").addClass("gso_rule_selected");
            gso_rseditor_update_selection();
        });
        $("#gso_ruleset_unselectAll").click(function () {
            $("#gso_ruleset_table table tbody tr").removeClass("gso_rule_selected");
            gso_rseditor_update_selection();
        });
        $("#gso_ruleset_selectToggle").click(function () {
            $("#gso_ruleset_table table tbody tr").toggleClass("gso_rule_selected");
            gso_rseditor_update_selection();
        });
        $("#gso_rule_moveup").click(function () {
            var idx;
            if($("#gso_ruleset_table table tbody tr.gso_rule_selected").length == 1) {
                idx = Number($("#gso_ruleset_table table tbody tr.gso_rule_selected").attr('data-idx'));
                if(idx - 1 >= 0) {
                    config.rulesets[$("#gso_ruleset_select").val()].rules.splice(
                        idx - 1, 2,
                        config.rulesets[$("#gso_ruleset_select").val()].rules[idx],
                        config.rulesets[$("#gso_ruleset_select").val()].rules[idx - 1]);
                    $("#gso_ruleset_select").change();
                    $("#gso_ruleset_table table tbody tr:eq(" + (idx-1) + ")").click();
                }
            }
        });
        $("#gso_rule_movedown").click(function () {
            var idx;
            if($("#gso_ruleset_table table tbody tr.gso_rule_selected").length == 1) {
                idx = Number($("#gso_ruleset_table table tbody tr.gso_rule_selected").attr('data-idx'));
                if(idx + 1 <= config.rulesets[$("#gso_ruleset_select").val()].rules.length - 1) {
                    config.rulesets[$("#gso_ruleset_select").val()].rules.splice(
                        idx, 2,
                        config.rulesets[$("#gso_ruleset_select").val()].rules[idx + 1],
                        config.rulesets[$("#gso_ruleset_select").val()].rules[idx]);
                    $("#gso_ruleset_select").change();
                    $("#gso_ruleset_table table tbody tr:eq(" + (idx+1) + ")").click();
                }
            }
        });

        $("#gso_rule_add").click(function () {
            var new_rule = {
                "target": $("#gso_rule_target").val(),
                "type": $("#gso_rule_type").val(),
                "action": $("#gso_rule_action").val(),
                "level": Number($("#gso_rule_level").val()),
                "criteria": $("#gso_rule_criteria").val(),
                "comment": $("#gso_rule_comment").val(),
                "enabled": $("#gso_rule_enabled").prop("checked")
            };
            if(!check_rule(new_rule)) return;
            if($("#gso_ruleset_table table tbody tr.gso_rule_selected").length == 1) {
                config.rulesets[$("#gso_ruleset_select").val()].rules.splice(
                    Number($("#gso_ruleset_table table tbody tr.gso_rule_selected:last").attr('data-idx')) + 1,
                    0,
                    new_rule);
            } else {
                config.rulesets[$("#gso_ruleset_select").val()].rules.push(new_rule);
            }
            $("#gso_ruleset_select").change();
        });
        $("#gso_rule_overwrite").click(function () {
            /* 入力チェックが必要 */
            var new_rule = null;
            if($("#gso_ruleset_table table tbody tr.gso_rule_selected").length == 1) {
                new_rule = {
                    "target": $("#gso_rule_target").val(),
                    "type": $("#gso_rule_type").val(),
                    "action": $("#gso_rule_action").val(),
                    "level": Number($("#gso_rule_level").val()),
                    "criteria": $("#gso_rule_criteria").val(),
                    "comment": $("#gso_rule_comment").val(),
                    "enabled": $("#gso_rule_enabled").prop("checked")
                };
                if(!check_rule(new_rule)) return;
                var index = Number($("#gso_ruleset_table table tbody tr.gso_rule_selected:first")
                    .attr('data-idx'));
                config.rulesets[$("#gso_ruleset_select").val()].rules[index] = new_rule;
                $("#gso_ruleset_select").change();
            } else if($("#gso_ruleset_table table tbody tr.gso_rule_selected").length > 1) {
                /* 複数選択 */
                $("#gso_ruleset_table table tbody tr.gso_rule_selected").each(function() {
                    new_rule = {
                        "target": $("#gso_rule_target").val(),
                        "type": $("#gso_rule_type").val(),
                        "action": $("#gso_rule_action").val(),
                        "level": Number($("#gso_rule_level").val()),
                        "criteria": $("#gso_rule_criteria").val(),
                        "comment": $("#gso_rule_comment").val(),
                        "enabled": $("#gso_rule_enabled").prop("checked")
                    };
                    var rule = config.rulesets[$("#gso_ruleset_select").val()].rules[Number($(this).attr('data-idx'))];
                    Object.keys(new_rule).forEach(function (k) {
                        if (new_rule[k] === "" || new_rule[k] === null) {
                            new_rule[k] = rule[k];
                        }
                    });
                    if(check_rule(new_rule)) {
                        config.rulesets[$("#gso_ruleset_select").val()].rules[Number($(this).attr('data-idx'))] = new_rule;
                    }
                });
                $("#gso_ruleset_select").change();
            }
        });
        $("#gso_rule_remove").click(function () {
            $("#gso_ruleset_table table tbody tr.gso_rule_selected").each(function() {
                var index = Number($(this).attr('data-idx'));
                delete config.rulesets[$("#gso_ruleset_select").val()].rules[index];
            });
            config.rulesets[$("#gso_ruleset_select").val()].rules =
                config.rulesets[$("#gso_ruleset_select").val()].rules.filter(function(e) {
                    return e !== undefined;
                });
            $("#gso_ruleset_select").change();
        });

        $("#gso_config_misc input").change(function() {
            config.config[$(this).val()] = $(this).prop("checked");
        });
        $("#gso_config_misc select").change(function() {
            config.config[this.name] = $(this).val();
        });
        $("#gso_save").click(function () {
            gso_save();
            $("#gso_status").text(cat[config.config.gso_lang].full.msg.reloadToTakeEffect);
        });

        $("#gso_revert").click(function () {
            gso_load();
            gso_config_init();
        });
        $("#gso_log_clear").click(function () {
			$("#gso_log_table tr").remove();
		});
        $(window).scroll(function () {
            /* 表示を追従させる */
            var cfg = $("#gso_config");
            var minimum_top_cfg = 0;

            if(config.config.float) {
                if($(window).scrollTop() > minimum_top_cfg && cfg.hasClass("gso_config_embedded")) {
                    cfg.removeClass("gso_config_embedded");
                    cfg.addClass("gso_float");
                } else if($(window).scrollTop() <= minimum_top_cfg && cfg.hasClass("gso_float")) {
                    cfg.removeClass("gso_float");
                    cfg.addClass("gso_config_embedded");
                }
            } else {
                if(cfg.hasClass("gso_float")) {
                    cfg.removeClass("gso_float");
                    cfg.addClass("gso_config_embedded");
                }
            }
        });
        /* End of event handlers section */
    } /* End of #gso_config UI */
    gso_control_prepare(); /* #gso_control UI */
    /* Initialize Configuration */
    gso_config_init();
    $("#gso_ruleset_select").change();

    var mo_autocomplete =
        new MutationObserver(function(mutationEventList){
            mutationEventList.forEach(function(mutationEvent) {
                var target = mutationEvent.target;
                //console.log("mo_autocomplete MutationEvent", target);
                if(target.getElementsByClassName("sbct").length > 0) {
                    //console.log(mutationEvent);
                    check_autocomplete();
                }
            });
        });

    /* mo_serp: 検索結果を探す */
    var mo_serp = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            /* ノードが追加されたか？ */
            if (mutation.addedNodes && (mutation.addedNodes.length > 0)) {
                //console.log(mutation.target);
                /* その中に 'div#search'があるか？ */
                var node_search = mutation.target.querySelector("div.islrc"); //画像検索結果 2020/02 G側の仕様変更
                if (!node_search) {
                    node_search = mutation.target.querySelector("div#rhs"); /* 右側「他の人はこちらを検索」とか */
                }
                if (!node_search) {
                    node_search = mutation.target.querySelector("#botstuff");/* 2ページ目以降(手動および自動, 2022 G側の仕様変更) */
                }
                if (!node_search) {
                    node_search = mutation.target;
                }
                if (node_search) {
                    /* 'div#search' が挿入された */
                    mo_serp.disconnect();

                    /* すでに存在する要素について直ちにチェック */
                    $(node_search).find(selector_KW).not("*.gso_checked").each( function() {
                        check_elem_kw(this);
                    });
                    if(location.href.search("&tbm=isch&") == -1 && location.href.search("&udm=2&") == -1){
                        $(node_search).find(selector_SERP).not("*.gso_checked").each( function() {
                            check_elem_serp(this);
                        });
                        $(node_search).find(selector_IMG).not("*.gso_checked").each( function() {
                            check_elem_img(this);
                        });
                    }
                    if(config.config.check_for_image && (location.href.search("&tbm=isch&") >= 0 || location.href.search("&udm=2&") >= 0)){
                        /*
                            2024/04 G側の仕様変更
                            location.href.search("&tbm=isch&") >= 0
                            で「画像検索」を検知できなくなった、かつこれに相当する
                            パラメータが不明であるため、当面の間この条件分岐は無効とする
                            2025/09 udm=2 が画像検索に相当する
                        */
                        $(selector_IMGLIST).not("*.gso_checked").each(function() {
                            check_elem_imglist(this);
                        });
                    }
                    mo_link.observe(node_search, {childList: true, subtree: true});
                    mo_serp.observe(document.body, {childList: true, subtree: true});
                }

                /* その中に 'div#topstuff'があるか？ */
                var node_topstuff = mutation.target.querySelector("div#topstuff");
                if (node_topstuff) {
                    /* 'div#topstuff' が挿入された */
                    mo_serp.disconnect();

                    /* すでに存在する要素について直ちにチェック */
                    $(node_topstuff).find(selector_KW).not("*.gso_checked").each( function() {
                        check_elem_kw(this);
                    });
                    hide_moshikashite();
                    mo_link.observe(node_topstuff, {childList: true, subtree: true});
                    mo_serp.observe(document.body, {childList: true, subtree: true});
                }

                /* その中に 'div#taw'があるか？ */
                var node_taw = mutation.target.querySelector("div#taw");
                if (node_taw) {
                    /* 'div#taw' が挿入された */
                    mo_serp.disconnect();

                    /* すでに存在する要素について直ちにチェック */
                    $(node_taw).find(selector_KW).not("*.gso_checked").each( function() {
                        check_elem_kw(this);
                    });
                    hide_moshikashite();
                    mo_link.observe(node_taw, {childList: true, subtree: true});
                    mo_serp.observe(document.body, {childList: true, subtree: true});
                }
                /* その中に 'div#extrares'があるか？ */
                var node_extrares = mutation.target.querySelector("div#extrares");
                if (node_extrares) {
                    /* 'div#extrares' が挿入された */
                    mo_serp.disconnect();

                    /* すでに存在する要素について直ちにチェック */
                    $(node_extrares).find(selector_KW).not("*.gso_checked").each( function() {
                        check_elem_kw(this);
                    });
                    mo_link.observe(node_extrares, {childList: true, subtree: true});
                    mo_serp.observe(document.body, {childList: true, subtree: true});
                }
                var target_node_gsoctl = mutation.target.querySelector("#hdtb");
                if (target_node_gsoctl) {
                    gso_control_prepare(); /* #gso_control UI */
                }
            }
        });
    });

    /* mo_link: ある要素の中に別の要素が挿入されたか監視 */
    var mo_link = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                [].slice.call(mutation.addedNodes).forEach(function(node) {
                    /* 最初に目に入る「関連キーワード」を最初に処理 */
                    $(node).find(selector_KW).not("*.gso_checked").each(function() {
                        check_elem_kw(this);
                    });
                    /* SERPを探して処理 */
                    if(location.href.search("&tbm=isch&") == -1 && location.href.search("&udm=2&") == -1){
                        $(node).find(selector_SERP).not("*.gso_checked").each(function() {
                            check_elem_serp(this);
                        });
                        $(node).find(selector_IMG).not("*.gso_checked").each(function() {
                            check_elem_img(this);
                        });
                    }
                    if((location.href.search("&tbm=isch&") >= 0 || location.href.search("&udm=2&") >= 0) && config.config.check_for_image){
                        $(selector_IMGLIST).not("*.gso_checked").each(function() {
                            check_elem_imglist(this);
                        });
                    }

                });
            }
        });
        hide_moshikashite();
    });

    $(document).ready(check_elem_first());

    /* div#searchの挿入を監視 */
    console.log("GSC: mo_serp.observe");
    mo_serp.observe(document.body, {childList: true, subtree: true});

    /* オートコンプリートの監視 */
    console.log("GSC: mo_autocomplete.observe");
    if (!["searchform", "sf"].some( (id) => {
        try {
            mo_autocomplete.observe(document.getElementById(id),
                {attributes: false, childList: true, characterData: false, subtree: true});
            return true;
        }
        catch (e) {
            if (e instanceof TypeError) {
                return false;
            }
        }
    })) {
        console.warn("GSC: Unable to observe mo_autocomplete. Autocomplete not checked.");
    }

    function check_elem_serp(node) {
        /* ---------- 検索結果 ---------- */
        if(!$(node).is(".gso_checked")) {
            /* ここでは検索して状況を記録するのみ
               書式の変更はまだ行わない */
            /* 各SERP(node)の状況を格納するオブジェクト */
            const SELECTOR_DESCRIPTION =
				"span.st, " +
				"div.st, " +
				"div.IsZvec, " +
				"div[data-content-feature='1'], " +
				"div.VwiC3b"; /* 2023/09 G側の仕様変更 */
            var context =
                {"element": $(node),
                 "title": null,
                 "target": null,
                 "description": null,
                 "matched_rules": null
                };
            var link = $(node).find("a:not(._T6c, .top, .ab_button, .fl)");
            if(link.length === 0){
                link = $(node);
            }
            if(!link.is("a")) {
                /* リンクを示す要素だが<a>ではない場合はまだチェックしない */
                return;
            }
            /* 状況記録部分 */
            /* ページのタイトル
               (実際のものからGoogleにより改竄される場合あり) */
            try {
                /* 2019 G側の仕様変更への対応 */
                context.title = link.find("h3.LC20lb").text();
            }
            catch (e) {
                if (e instanceof TypeError) {
                    context.title = link.text();
                }
            }
            /* ページのURL */
            context.target = link.attr("href");

            /* ページの抜粋または説明文(meta description) */
            try {
                context.description = $(node).find(SELECTOR_DESCRIPTION).text();
            }
            catch (e) {
                if (e instanceof TypeError) {
                    context.description = null;
                }
            }
            /* ルールに合致しているかチェック */
            context.matched_rules = check(context.target, context.description, context.title, null, null);
            if(context.matched_rules.length > 0) {
                var applied_rule = get_most_significant_rule(context.matched_rules);
                var ruleset_name = config.rulesets[applied_rule.ruleset_id].name;
                var original_desc = $(node).find(SELECTOR_DESCRIPTION);
                var new_desc = original_desc.clone();
                var msg = "";

                context.matched_rules.forEach(function(element, index, array) {
                    element.forEach(function (e) {
                        gso_log_append("page",
                                       e.rule.target,
                                       e.matched,
                                       context.title,
                                       context.target,
                                       e.ruleset_id,
                                       e.rule.action,
                                       applied_rule.rule.action,
                                       !(e.effective !== undefined && e.effective));
                    });
                });
                if(applied_rule.rule.action == "hide") {
                    $(node).hide();
                    $(node).find("div._S6c").insertAfter($(node)); /* 「詳細を見る」を外に出す */
                    if(applied_rule.rule.comment !== "" &&
                       !applied_rule.rule.comment.startsWith("#") &&
                       config.config.ruleset_name_with_comment) {
                        msg = ruleset_name + " [" + applied_rule.rule.comment + "]";
                    } else {
                        msg = ruleset_name;
                    }

                    if($(node).is("a")) {
                        $(node).replaceWith('<span class="gso_killed_serp_msg gso_killed_serp gso_serp_description_b gso_ani">'+
                                            msg +': ' +
                                            '<span class="gso_killed_url">' +
                                            applied_rule.matched + '</span>' +
                                            '</span>');
                    } else {
                        $(node).html('<span class="gso_killed_serp_msg">'+ msg +': ' +
                                     '<span class="gso_killed_url">' +
                                     applied_rule.matched + '</span>' +
                                     '</span>');
                        $(node).addClass("gso_killed_serp gso_serp_description_b gso_ani");
                    }

                } else if(applied_rule.rule.action == "hide_absolutely") {
                    $(node).hide();
                    $(node).find("div._S6c").insertAfter($(node)); /* 「詳細を見る」を外に出す */
                    if(applied_rule.rule.comment !== "" &&
                       !applied_rule.rule.comment.startsWith("#") &&
                       config.config.ruleset_name_with_comment) {
                        msg = ruleset_name + " [" + applied_rule.rule.comment + "]";
                    } else {
                        msg = ruleset_name;
                    }

                    if($(node).is("a")) {
                        $(node).replaceWith('<span class="gso_killed_serp_msg">'+ msg +
                                            '</span>');
                    } else {
                        $(node).html('<span class="gso_killed_serp_msg">'+ msg +
                                     '</span>');
                    }
                    $(node).addClass("gso_killed_serp gso_serp_description_b gso_ani");

                } else if(applied_rule.rule.action == "hide_description") {
                    new_desc.addClass("gso_serp_description_info gso_serp_description_a");
                    if(applied_rule.rule.comment !== "" &&
                       !applied_rule.rule.comment.startsWith("#") &&
                       config.config.ruleset_name_with_comment) {
                        new_desc.text(ruleset_name + " [" + applied_rule.rule.comment + "]");
                    } else {
                        new_desc.text(ruleset_name);
                    }
                    new_desc.insertAfter(original_desc);
                    original_desc.addClass("gso_serp_description_b gso_ani");
                    original_desc.hide();
                    $(node).addClass("gso_titleonly_serp");
                } else if(applied_rule.rule.action == "hide_description_warn") {
                    new_desc.addClass("gso_serp_description_warning gso_serp_description_a");
                    if(applied_rule.rule.comment !== "" &&
                       !applied_rule.rule.comment.startsWith("#") &&
                       config.config.ruleset_name_with_comment) {
                        new_desc.html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + ruleset_name + " [" + applied_rule.rule.comment + "]");
                    } else {
                        new_desc.html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + ruleset_name);
                    }
                    new_desc.insertBefore(original_desc);
                    original_desc.addClass("gso_serp_description_b gso_ani");
                    original_desc.hide();
                    $(node).addClass("gso_titleonly_serp");
                } else if(applied_rule.rule.action == "warn") {
                    new_desc.addClass("gso_serp_description_warning");
                    if(applied_rule.rule.comment !== "" &&
                       !applied_rule.rule.comment.startsWith("#") &&
                       config.config.ruleset_name_with_comment) {
                        new_desc.html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + ruleset_name + " [" + applied_rule.rule.comment + "]");
                    } else {
                        new_desc.html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + ruleset_name);
                    }
                    new_desc.insertBefore(original_desc);
                    $(node).addClass("gso_titleonly_serp");
                } else if(applied_rule.rule.action == "info") {
                    new_desc.addClass("gso_serp_description_info");
                    if(applied_rule.rule.comment !== "" &&
                       !applied_rule.rule.comment.startsWith("#") &&
                       config.config.ruleset_name_with_comment) {
                        new_desc.text(ruleset_name + " [" + applied_rule.rule.comment + "]");
                    } else {
                        new_desc.text(ruleset_name);
                    }
                    new_desc.insertBefore(original_desc);
                }
            } else if(config.config.always_log_checked_entries) {
                gso_log_append("page",
                               null,
                               null,
                               context.title,
                               context.target,
                               null,
                               "allow",
                               "allow",
                               true);
            }
            /* ---------- 「未指定：○○○」を処理 ---------- */
            if(config.config.fix_missing) {
                $(node).find("div.TXwUJf:has(s)").each(function() {
                    var missing_kw_list = $(this);
                    var missing_kw_list_ar = [];
                    var new_url_all = decodeURI_s(location.href.replace(/&start=\d+/, ""));
                    [].slice.call(this.getElementsByTagName("s")).forEach((e) => {
                        let kw = e.innerText;
                        let re = new RegExp(escapeRegexp(kw), "gi");
                        let newUrl = decodeURI_s(location.href)
                            .replace(/&start=\d+/, "")
                            .replace(re, '"' + kw + '"');
                        new_url_all = new_url_all.replace(re, '"' + kw + '"');
                        e.outerHTML = `<span class="gso_ignored_kw"><a href="${encodeURI(newUrl)}">${kw}</a></span>`;
                        missing_kw_list_ar.push(kw);
                    });
                    /* "含まれない:" 置換 */
                    missing_kw_list.find("> span:first-child").text(cat[config.config.gso_lang].full.msg.ignoredKeywords + ':');
                    gso_log_append("missing",
                                   null,
                                   missing_kw_list_ar.join(" "),
                                   context.title,
                                   context.target,
                                   null,
                                   null,
                                   null,
                                   false);
                    /* 検索語句を全て含ませるリンクの追加
                     元々「含めて検索:」がある場合はそれを尊重する(ただし文言は書き換える)*/
                    if(this.querySelectorAll("span.gso_ignored_kw").length > 1) {
                        missing_kw_list.append(' <a href="' + encodeURI(new_url_all) + '">' +
                                               cat[config.config.gso_lang].full.msg.searchAllIncluded + '</a>');
                    }
                    else if(this.querySelectorAll("span.gso_ignored_kw").length == 1) {
                        /*
                            無視された語句が1個のみの場合、後続の「必須にする」または「含めて検索」
                            およびその後の検索語句リストを削除（重複回避のため）
                        */
                        this.childNodes.forEach((e) => {
                            if(e.nodeName == "#text" && (e.textContent.search("必須にする:") >= 0 || e.textContent.search("含めて検索:") >= 0 || e.textContent.search("Must include:") >= 0)) {
                                e.remove();
                            }
                        });
                        this.querySelectorAll("span.gso_ignored_kw ~ a").forEach((e) => {
                            e.remove();
                        });
                    }
                });
            }
            if(config.config.quick_block && !$(node).is("a")) {
                /* 現在のノードの上にマウスポインタを持ってきたときに
                 クイックブロックボタンを表示 */
                var qb_w =
                    $("<div class='gso_quick_block_wnd gso_quick_block' style='display: none;'>" +
                      cat[config.config.gso_lang].full.msg.qbBlock +
                      "<button type='button' class='gso_control_buttons'>" + cat[config.config.gso_lang].full.msg.qbFullURL +"</button>" +
                      "<button type='button' class='gso_control_buttons'>" + cat[config.config.gso_lang].full.msg.qbDomain + "</button></div>")
                    .appendTo(node);

                var qb = qb_w.find("button:eq(0)");
                var qb2 = qb_w.find("button:eq(1)");
                var domain = "";
                qb.click(function () {
                    qb_w.attr('data-criteria', context.target);
                    qb_w.attr('data-type', 'str_head');
                    qb_w.hide();
                    gso_quick_block_b(qb_w);
                });
                try {
                    domain = context.target.split("/")[2].split(":")[0];
                }
                catch (e) {
                    domain = "";
                }
                qb2.click(function () {
                    qb_w.attr('data-criteria', domain);
                    qb_w.attr('data-type', 'domain');
                    qb_w.hide();
                    gso_quick_block_b(qb_w);
                });

                $(node).hover(
                    function () {
                        /* IN */
                        $(this).find("*.gso_quick_block").show();
                    },
                    function () {
                        /* OUT */
                        $(this).find("*.gso_quick_block").hide();
                    }
                );
            }
        }
        $(node).addClass("gso_checked");

        gso_log_setBoundary();
        update_gso_control_msg();
        update_serp();

    }
    function check_elem_img(node) {
        /* ---------- 検索結果に現れる画像 ---------- */
        if(!$(node).is(".gso_checked")) {
            var context =
                {"element": $(node),
                 "target": null,
                 "description": null,
                 "from": null,
                 "matched_rules": null
                };
            var link;
            if ($(node).is("a")) {
                link = $(node);
            } else {
                link = $(node).find("a:first");
            }
            if(link.length > 0) {
                /* 状況記録部分 */
                if(link.hasClass("uh_rl") || node.classList.contains("ivg-i")) {
                    /* ***の画像検索結果 */
                    // ページのURL
                    context.target = link.find("img:first").attr("title");
                    // 代替テキスト
                    context.description = link.find("img:first").attr("alt");
                }
            } else {
                // <a> が存在しない (現在の仕様)
                context.target = node.attributes["data-lpage"].textContent;
                // description にあたるものは存在しない
            }
            context.matched_rules = check(context.target, context.description, null, null, null);
            if(context.matched_rules.length > 0) {
                var applied_rule = get_most_significant_rule(context.matched_rules);
                var ruleset_name = config.rulesets[applied_rule.ruleset_id].name;

                var msg = "";

                context.matched_rules.forEach(function(element, index, array) {
                    element.forEach(function (e) {
                        gso_log_append("img",
                                       e.rule.target,
                                       e.matched,
                                       null,
                                       context.target,
                                       e.ruleset_id,
                                       e.rule.action,
                                       applied_rule.rule.action,
                                       !(e.effective !== undefined && e.effective));
                    });
                });


                if(applied_rule.rule.comment !== "" &&
                   !applied_rule.rule.comment.startsWith("#") &&
                   config.config.ruleset_name_with_comment) {
                    msg = ruleset_name + " [" + applied_rule.rule.comment + "]";
                } else {
                    msg = ruleset_name;
                }

                if(applied_rule.rule.action != "allow" &&
                   applied_rule.rule.action != "hide_description" &&
                   applied_rule.rule.action != "info") {
                    $(node).addClass("gso_killed_serpimg");
                    $(node).append('<div class="gso_killed_serpimg_warn gso_killed_img_mask_serp"></div>');
                    if(applied_rule.rule.action == "hide") {
                        $(node).find("*.gso_killed_serpimg_warn").css("opacity", "0.8");
                        $(node).find("*.gso_killed_serpimg_warn").html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + msg);
                        $(node).append('<div class="gso_killed_serpimg_warn gso_killed_img_mask_serp gso_serp_description_a"></div>');
                    }
                    if(applied_rule.rule.action == "hide_description_warn" ||
                       applied_rule.rule.action == "warn") {
                        $(node).find("*.gso_killed_serpimg_warn").addClass("gso_serp_description_a");
                        $(node).find("*.gso_killed_serpimg_warn").css("opacity", "0.8");
                        $(node).find("*.gso_killed_serpimg_warn").html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + msg);
                    }
                    if(applied_rule.rule.action == "hide_absolutely") {
                        $(node).find("*.gso_killed_serpimg_warn").css("opacity", "1");
                    }
                }
            } else if(config.config.always_log_checked_entries) {
                gso_log_append("img",
                               null,
                               null,
                               null,
                               context.target,
                               null,
                               "allow",
                               "allow",
                               true);
            }
            $(node).addClass("gso_checked");
            gso_log_setBoundary();
            update_gso_control_msg();
        }
        update_img();
    }
    function check_elem_imglist(node) {
        /* ---------- 画像検索 ---------- */
        if(!$(node).is(".gso_checked")) {
            var context =
                {"element": $(node),
                 "title": null,
                 "target": null,
                 "imgsrc": null,
                 "description": null,
                 "from": null,
                 "matched_rules_target": null,
                 "matched_rules_imgsrc": null
                };
            /* 状況記録部分 */
            var link = $(node).find('a.rg_l, a.kGQAp, a[href^="http"]');
            /* console.log($(node).find("a.rg_l")[0].href)
               では、なぜか undefined が返される */
            var metadata = null;
            /* $(SELECTOR_IMGLIST) 直下の div.rg_meta (非表示)に
               画像のメタデータがJSON形式で格納されていた */
            let rg_meta = $(node).find("div.rg_meta");
            if (rg_meta.length === 0) {
                /* rg_meta が存在しない。リンク先をhrefから取得する */
                context.target = link.attr("href");
                try {
                    context.title = link.find("div.WGvvNb").text();
                }
                catch (e) {
                    context.title = link.text();
                }
            }
            else {
                try {
                    metadata = JSON.parse($(node).find("div.rg_meta").text());
                    context.title = metadata.pt;
                    context.description = metadata.s;
                    context.from = metadata.isu;
                    context.target = metadata.ru;
                    context.imgsrc = metadata.ou;
                }
                catch (e) {
                    /* bad metadata */
                    context.title = null;
                    context.description = null;
                    context.from = null;
                }
            }
            if(link.length > 0) {
                context.matched_rules_target = check(context.target, context.description, context.title, null, null);
                context.matched_rules_imgsrc = check(context.imgsrc, null, null, null, null);
                var matched_rules = context.matched_rules_target.concat(context.matched_rules_imgsrc);

                if(matched_rules.length > 0) {
                    var applied_rule = get_most_significant_rule(matched_rules);
                    var ruleset_name = config.rulesets[applied_rule.ruleset_id].name;

                    var msg = "";
                    matched_rules.forEach(function(element, index, array) {
                        element.forEach(function (e) {
                            gso_log_append("img",
                                           e.rule.target,
                                           e.matched,
                                           context.title,
                                           context.target,
                                           e.ruleset_id,
                                           e.rule.action,
                                           applied_rule.rule.action,
                                           !(e.effective !== undefined && e.effective));
                        });

                    });

                    if(applied_rule.rule.comment !== "" &&
                       !applied_rule.rule.comment.startsWith("#") &&
                       config.config.ruleset_name_with_comment) {
                        msg = ruleset_name + " [" + applied_rule.rule.comment + "]";
                    } else {
                        msg = ruleset_name;
                    }

                    if(applied_rule.rule.action == "hide" ||
                       applied_rule.rule.action == "hide_description_warn" ||
                       applied_rule.rule.action == "warn" ||
                       applied_rule.rule.action == "hide_absolutely"
                      ) {
                        $(node).addClass("gso_killed_serpimg");
                        $(node).append('<div class="gso_killed_serpimg_warn gso_killed_img_mask_isch"></div>');

                        if(applied_rule.rule.action == "hide") {
                            $(node).find("*.gso_killed_serpimg_warn").css("opacity", "0.8");
                            $(node).find("*.gso_killed_serpimg_warn").html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + msg);
                            $(node).append('<div class="gso_killed_serpimg_warn gso_killed_img_mask_isch gso_serp_description_a"></div>');
                        }
                        if(applied_rule.rule.action == "hide_description_warn" ||
                           applied_rule.rule.action == "warn") {
                            $(node).find("*.gso_killed_serpimg_warn").css("opacity", "0.8");
                            $(node).find("*.gso_killed_serpimg_warn").html("<span class='gso_emoji'>&#xfe0f;&#x26A0;</span> " + msg);
                            $(node).find("*.gso_killed_serpimg_warn").addClass("gso_serp_description_a");
                        }
                        if(applied_rule.rule.action == "hide_absolutely") {
                            $(node).find("*.gso_killed_serpimg_warn").css("opacity", "1");
                        }
                    }
                } else if(config.config.always_log_checked_entries) {
                    gso_log_append("img",
                                   null,
                                   null,
                                   context.title,
                                   context.target,
                                   null,
                                   "allow",
                                   "allow",
                                   true);
                }
            }
            $(node).addClass("gso_checked");
            gso_log_setBoundary();
        }
        update_gso_control_msg();
    }
    function check_elem_kw(node) {
        /* ---------- 関連語句 ----------  */
        if(!$(node).is(".gso_checked")) {
            $(node).addClass("gso_checked");
            var context =
                {
                    "related_kw": $(node).text(),
                    "matched_rules": null
                };
            context.matched_rules = check(null, null, null, context.related_kw, null);

            if(context.matched_rules.length > 0) {
                var applied_rule = get_most_significant_rule(context.matched_rules);
                context.matched_rules.forEach(function(element, index, array) {
                    element.forEach(function (e) {
                        gso_log_append("suggest",
                                       null,
                                       e.matched,
                                       context.related_kw,
                                       null,
                                       e.ruleset_id,
                                       e.rule.action,
                                       applied_rule.rule.action,
                                       !(e.effective !== undefined && e.effective));
                    });
                });
                if(applied_rule.rule.action == "hide") {
                    $(node).replaceWith('<span class="gso_killed_kw">' +
                                        '<span class="gso_killed_kw_placeholder gso_serp_description_b">' +
                                        config.rulesets[applied_rule.ruleset_id].name + ': ' +
                                        '<span class="gso_killed_kw_bad">' + applied_rule.rule.criteria + '</span>' +
                                        '</span>' +
                                        '</span>' +
                                        '</span>');
                } else if(applied_rule.rule.action == "warn") {
                    $(node).after(' <span style="background-color: silver; color: dimgray;" title="' +
                                        config.rulesets[applied_rule.ruleset_id].name + '">&#xfe0f;&#x26A0;</span>');
                } else if(applied_rule.rule.action == "hide_absolutely") {
                    $(node).replaceWith('<span class="gso_killed_kw">' +
                                        '<span class="gso_killed_kw_placeholder gso_serp_description_b">' +
                                        config.rulesets[applied_rule.ruleset_id].name +
                                        '</span>' +
                                        '</span>');
                }
                gso_log_setBoundary();
                update_kw();
                update_gso_control_msg();
                return (applied_rule.rule.action != "allow");
            } else if(config.config.always_log_checked_entries) {
                gso_log_append("suggest",
                               null,
                               null,
                               context.related_kw,
                               null,
                               null,
                               "allow",
                               "allow",
                               true);
            }
            if(config.config.force_keyword_exclusion_on_suggestion) {
                var keywords = [];
                var params_raw = "";
                var params = {};
                var temp_rulesets = {
                    "MINUS": {
                        "name": cat[config.config.gso_lang].full.msg.excludedKeyword,
                        "enabled": true,
                        "rules": []
                    }
                };

                if(location.href.search("#") >= 0) {
                    params_raw = location.href.split("#")[1];
                    params_raw.split("&").forEach(function(element, index, array) {
                        params[element.split("=")[0]] = element.split("=")[1];
                    });
                } else {
                    params_raw = location.href.split("?")[1];
                    params_raw.split("&").forEach(function(element, index, array) {
                        params[element.split("=")[0]] = element.split("=")[1];
                    });
                }
                if(params.q !== undefined) {
                    keywords = params.q.split("+").filter(function(element) {
                        return element.startsWith("-");
                    });
                }
                keywords.forEach(function(element) {
                    temp_rulesets.MINUS.rules.push({
                        "target": "suggest",
                        "type": "word",
                        "action": "hide",
                        "level": 0,
                        "criteria": decodeURI_s(element.substr(1)),
                        "comment": "",
                        "enabled": true
                    });
                });
                var matched_rules_exclusion = check(null, null, null, context.related_kw, temp_rulesets);
                matched_rules_exclusion.forEach(function(element, index, array) {
                    element.forEach(function (e) {
                        gso_log_append("suggest_excl",
                                       null,
                                       e.matched,
                                       context.related_kw,
                                       null,
                                       null,
                                       e.rule.action,
                                       e.rule.action,
                                       false);
                    });
                });
                if(matched_rules_exclusion.length > 0) {
                    gso_log_setBoundary();
                    $(node).hide();
                }
            }
        } else {
            return false;
        }
    }

    function check_autocomplete() {
        /* 検索語句入力欄のオートコンプリートをチェック
           (関連語句のみ) */
        console.log("GSC: check_autocomplete()");
        mo_autocomplete.disconnect();
        $("*.erkvQe li.sbct").each(function() {
            var context =
                {
                    "autocomplete" : this.querySelectorAll('*[role="option"]')[0].textContent, // this selector name might be changed
                    "matched_rules": null
                };
            context.matched_rules = check(null, null, null, context.autocomplete, null);

            if(context.matched_rules.length > 0) {
                var applied_rule = get_most_significant_rule(context.matched_rules);
                context.matched_rules.forEach(function(element, index, array) {
                    element.forEach(function (e) {
                        gso_log_append("autocomplete",
                                       null,
                                       e.matched,
                                       context.autocomplete,
                                       null,
                                       e.ruleset_id,
                                       e.rule.action,
                                       applied_rule.rule.action,
                                       !(e.effective !== undefined && e.effective));
                    });
                });
                if(applied_rule.rule.action != "allow") {
                    count_totalKWSuggest++;
                    update_gso_control_msg();
                    $(this).addClass("gso_killed_kw_autocomplete");
                    $("#gso_results_msg_eff").show().fadeOut("slow");
                } else {
                    $(this).removeClass("gso_killed_kw_autocomplete");
                }
            } else {
                $(this).removeClass("gso_killed_kw_autocomplete");
            }
        });
        gso_log_setBoundary();

        mo_autocomplete.observe(document.getElementById("searchform"),
                                {attributes: false, childList: true, characterData: false, subtree: true});

    }

    function hide_moshikashite() {
        if(config.config.hide_moshikashite && $("p.ssp").length > 0 && location.href.match("start=") !== null) {
            $("p.ssp").hide();
        }
    }
    function check_elem_first() {
        check_elem_all();
    }

    function check_elem_all() {
        if(location.href.search("&tbm=isch&") == -1 && location.href.search("&udm=2&") == -1){
            $(selector_SERP).not("*.gso_checked").each(function () {
                check_elem_serp(this);
            });

            /* ---------- 画像検索結果(リンク外す) ---------- */
            /* 隠す対象となりうる要素 */
            var entries = $(selector_IMG).not("*.gso_checked");
            entries.each(function() {
                check_elem_img(this);
            });
        }
        /* ---------- 関連キーワード ---------- */

        /* top: div#trev > div > a.nobr
           bottom: div.brs_col > p._e4b > a */

        $(selector_KW).not("*.gso_checked").each(function() {
            check_elem_kw(this);
        });

        /* ---------- [画像]モードの検索結果 ---------- */
        if(config.config.check_for_image && (location.href.search("&tbm=isch&") >= 0 || location.href.search("&udm=2&") >= 0)){
            $(selector_IMGLIST).not("*.gso_checked").each(function() {
                check_elem_imglist(this);
            });
        }
        hide_moshikashite();
    }
})();
