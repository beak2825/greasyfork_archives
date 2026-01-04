// ==UserScript==
// @name         YouTube remove stamp only chat
// @name:ja      YouTubeでスタンプのみのチャットを削除
// @namespace    https://greasyfork.org/ja/users/856234-pushback
// @version      0.2.1
// @description     At YouTube, remove stamp only chat. Replace image to string for reduce CPU road.
// @description:ja  YouTubeでスタンプのみのチャットを削除する。画像を文字にしてCPU負荷を軽減する。
// @author       pushback
// @match        https://www.youtube.com/live_chat?continuation=*
// @match        https://www.youtube.com/live_chat_replay?continuation=*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437406/YouTube%20remove%20stamp%20only%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/437406/YouTube%20remove%20stamp%20only%20chat.meta.js
// ==/UserScript==

/*jshint esversion: 6 */
(function() {
    'use strict';
    // ========================================
    // 設定ここから Config start
    // ========================================
    // スタンプのみのチャットをどうするか？ What do you do with the stamp only chat?
    // "replace_to_string"(文字列化), "remove"(削除), "none"(何もしない)
    const STAMP_ONLY_CHAT_MODE = "replace_to_string";
    // 画像をどうするか？ What do you do with the image?
    // "replace_to_string"(文字列化), "remove"(削除), "none"(何もしない)
    const IMAGE_TO_STRING_MODE = "replace_to_string";
    // アイコンのみをどうするか？ What do you do with the icon?
    // "remove"(削除), "none"(何もしない)
    const ICON_REMOVE_MODE = "remove";
    // ========================================
    // 設定ここまで Config end
    // ========================================

    window.addEventListener('load', () => {
        const items = document.querySelector("#contents");
        const config = { attributes: false, childList: true, subtree: true };
        const observer = new MutationObserver(function(mutationsList, observer) {
            // 消去するHTMLにマッチする正規表現ルール
            const rules = [
                // 空白を無視して画像のみの場合
                /^(\s*<img[^>]+>\s*)+$/,
            ];
            for(const mutation of mutationsList) {
                for(const node of mutation.addedNodes) {
                    // メンバーシップマイルストン, チャット, スーパーチャットの更新のみ処理
                    const tagName = node.tagName?.toLowerCase();
                    if (
                        tagName !== "yt-live-chat-membership-item-renderer" &&
                        tagName !== "yt-live-chat-text-message-renderer" &&
                        tagName !== "yt-live-chat-paid-message-renderer"
                    ) {
                        continue;
                    }
                    // メッセージが絵文字やスタンプのみの場合は削除。ただし1文字スタンプのみの場合はメッセージ扱いで除外
                    const imgs = node.querySelectorAll("img");
                    const msg = node.querySelector("#message")?.innerHTML;
                    if (
                        STAMP_ONLY_CHAT_MODE !== "none" &&
                        rules.some(r => r.test(msg)) &&
                        Array.from(imgs).some(img => !img.alt?.match(/^(.)\1+$/))
                    ) {
                        if (STAMP_ONLY_CHAT_MODE === "remove") {
                            // モードが"remove_all"ならチャットを完全に消す
                            node.outerHTML = '';
                        }
                        else {
                            // モードが"replace_to_string"ならどの程度チャットが消えているかわかるように灰色のハイフンにする
                            node.outerHTML = '<span style="color:#999; padding-left: 20px;">-</span>';
                        }
                        continue;
                    }
                    // それ以外は画像を文字列化して表示
                    if (IMAGE_TO_STRING_MODE === "none"){
                        // モードが"none"なら何もしない
                        continue;
                    }
                    if (IMAGE_TO_STRING_MODE === "remove") {
                        if (ICON_REMOVE_MODE == "remove"){
                            // 画像とアイコンのモードが"remove"ならすべての画像を完全に消す
                            for (const img of imgs) {
                                img.outerHTML = "";
                            }
                        }
                        else {
                            // 画像のモードが"remove"でアイコンのモードが"none"ならアイコン以外（altがある画像）を完全に消す
                            for (const img of imgs) {
                                if (0 < img.alt?.length) {
                                    img.outerHTML = "";
                                }
                            }
                        }
                        continue;
                    }
                    // モードが"replace_to_string"なら文字列に置き換え
                    for (const img of imgs) {
                        let alt = img.alt;
                        if (img.src.match(/\/emoji\//)) {
                            // 絵文字はaltをそのまま表示
                            img.outerHTML = alt;
                        }
                        else if (alt.match(/^(新規)メンバー|メンバー（(.+)）|(New) member|Member \((.+)\)$/)) {
                            // 日本語のみ対応：メンバーシップバッチは期間のみ緑色でaltを表示
                            alt = alt.replace(/^(新規)メンバー|メンバー（(.+)）|(New) member|Member \((.+)\)$/,"[$1$2$3$4]");
                            img.outerHTML = '<span style="color:#9f9; position:relative; top:-5px; font-size:10px;">' + alt + '</span>';
                        }
                        else if (alt.match(/^(.)\1+$/)) {
                            // 1文字スタンプ（スタンプが同じ文字の連続、例えば:_AAA:）は赤字の1文字としてaltを表示
                            alt = alt.replace(/^(.)\1+$/,"$1");
                            img.outerHTML = '<span style="color:#f99">' + alt + '</span>';
                        }
                        else if (0 < alt?.length){
                            // その他スタンプは青色かつ[]で囲んでaltを表示
                            alt = alt.replace(/^.+$/, "[$&]");
                            img.outerHTML = '<span style="color:#99f">' + alt + '</span>';
                        }
                        else if (ICON_REMOVE_MODE == "remove") {
                            // アイコンのモードが"remove"ならアイコンの画像（altがない）は消去する
                            img.outerHTML = "";
                        }
                        else{
                            // アイコンのモードが"none"ならアイコンの画像（altがない）はそのままにする
                        }
                    }
                }
            }
        });
        observer.observe(items, config);
    });
})();