// ==UserScript==
// @name nvbetter
// @namespace rinsuki.net
// @version 1.0.7
// @description ニコニコ動画の新HTML5プレーヤーを旧HTML5プレーヤーっぽい配置にしたりします
// @author rinsuki
// @grant GM_addStyle
// @run-at document-start
// @match https://www.nicovideo.jp/watch/*
// @downloadURL https://update.greasyfork.org/scripts/519176/nvbetter.user.js
// @updateURL https://update.greasyfork.org/scripts/519176/nvbetter.meta.js
// ==/UserScript==

(function() {
let css = `
    /* ヘッダー追従を切る */
    #root > div > header.h_webHeader\\.height {
        position: relative !important;
        
        &:hover > div:has(a[href*="/feedback/video_watch"]) {
            & > a {
                /* こんな状態で本家にフィードバック送られても困る */
                display: none;
            }
            &:after {
                content: "nvbetterにより視聴ページのスタイルが変更されているため、nvbetterによってフィードバックボタンは無効化されています。";
            }
        }
    }
    
    /* 動画再生部分の border-radius を無効化 */
    .grid-area_\\[player\\] > div > div.bdr_m {
        border-radius: unset !important;
    }
    
    .grid-template-areas_\\[_\\"player_sidebar\\"_\\"meta_sidebar\\"_\\"bottom_sidebar\\"_\\"\\._sidebar\\"_\\] {
        /* 動画情報を上に持ってくる */
        grid-template-areas:
            "meta   meta"
            "player sidebar"
            "bottom sidebar"
            ".      sidebar" !important;
        
        /* 旧プレーヤーのようにリサイズ時にガタガタさせる */
        --watch-player-max-width: 640px !important;

        /* 854pxの動画が入るなら 854px まで大きくする */
        @media screen and (min-width: calc(854px + 440px + calc(24px * 3) + 15px)) {
            & {
                --watch-player-max-width: 854px !important;
            }
        }
        /* 960pxの動画が入るなら 960px まで大きくする */
        @media screen and (min-width: calc(960px + 440px + calc(24px * 3) + 15px)) {
            & {
                --watch-player-max-width: 960px !important;
            }
        }
        /* 1280pxの動画が入るなら 1280px まで大きくする */
        @media screen and (min-width: calc(1280px + 440px + calc(24px * 3) + 15px)) {
            & {
                --watch-player-max-width: 1280px !important;
            }
        }
        /* 1920pxの動画が入るなら 1920px まで大きくする */
        @media screen and (min-width: calc(1920px + 440px + calc(24px * 3) + 15px)) {
            & {
                --watch-player-max-width: 1920px !important;
            }
        }
    }

    section > .grid-area_\\[meta\\] {
        /* タグ編集行 */
        & > div:has(> button[data-element-name="tag_edit"]) {
            /* を最後に持ってくる */
            order: 1;

            /* タグ編集ボタンを最初に持ってくる */
            & > button[data-element-name="tag_edit"] {
                order: -1;
            }
        }
    }
    /* 動画詳細を開いた状態 */
    section > .grid-area_\\[meta\\]:has(> section > header + div) {
        & > div:first-child {
            /* 動画タイトルの下の再生数とかを隠す */
            & > div:first-child > h1 + div {
                display: none;
            }
            /* 動画タイトルの右のユーザー情報を隠す */
            & > div:first-child:has(h1) + div {
                display: none;
            }
        }
        & > section {
            /* 開いたら畳ませない */
            & > header {
                display: none;
            }
            & > div {
                /* 動画詳細をインライン展開っぽく見せる */
                background: none;
                border-top: none;
                padding: 0;

                /* 突然のgrid投入 */
                display: grid;
                grid-template:
                    "desc desc" auto
                    "user info" auto
                    "user genre" auto
                    / 400px 1fr;

                /* 説明欄grid追従 */
                & > .cursor_default {
                    grid-area: desc;
                }

                /* ユーザー欄grid追従*/
                & > .pb_x2 {
                    grid-area: user;
                }

                /* grid で並び換えた影響でhrの意味がなくなったので消す */
                & > hr {
                    display: none;
                }

                /* 背景消したせいでボーダーが見えなくなるので再導入 */
                & > dl > div {
                    border-color: var(--colors-border-high-em);
                }

                /* ジャンル・シリーズ情報は横に並べる */
                & > dl + div {
                    flex-direction: row;
                }
            }
        }
    } 


    /* 下のほうにあるやつを白背景にしない */
    section > .grid-area_\\[bottom\\] > section {
        background: none;
        padding-left: 0;
        padding-right: 0;
        padding-top: var(--spacing-x2);
    }

    /* コメントリストが開かれている時に発動する */
    section:has(> .grid-area_\\[sidebar\\] > div > div:first-child > section > header + div) {
        & > .grid-area_\\[sidebar\\] > div > .h_var\\(--watch-player-height\\) {
            /* コメントリストをプレーヤーの高さと合わせる */
            height: calc(var(--watch-player-height) + var(--watch-controller-height));
            /* 上でコメント入力欄を右まで伸ばした分の受け入れスペースを作る */
            margin-bottom: calc(40px + var(--watch-player-actionbar-gap-height) - var(--spacing-x0_5));
        }
        
        /* 動画プレーヤー下のコメント入力欄のセレクタ */
        & > .grid-area_\\[player\\] > div:not(.w_\\[100dvw\\]) > div:last-child {
            /* 動画プレーヤー下のコメント入力欄とかを右まで伸ばす */
            margin-right: calc(-1 * calc(var(--spacing-x3) + var(--watch-sidebar-width)));

            /* コメント入力欄の横幅をプレーヤーと合わせる */
            & > div.w_100\\% {
                width: var(--watch-player-width) !important;
                flex-grow: 0 !important;
            }

            /* コメント入力欄の右にあるボタン郡を伸ばす */
            & > div:last-child {
                flex: 1;
                & > div {
                    /* コメント入力欄の右にあるボタン郡を伸ばす */
                    max-width: unset !important;
                    
                    & > button {
                        /* コメント入力欄の右にあるボタン郡をテキトーに伸ばす (説明消すとそれはそれで幅が余るので) */
                        flex-grow: 1;

                        & > svg+span {
                            /* コメント入力欄の右にあるボタン郡で、アイコンがあるボタンの説明は消す */
                            display: none;
                        }
                    }
                }
            }
        }
    }
    
    /* フルスクリーン時にコメント入力欄の透過をする */
    section > .grid-area_\\[player\\] > div.w_\\[100dvw\\] > div:only-child > div:only-child > div:last-child > div:last-child {
        background: none;
        & > div > div > button {
            background: var(--colors-layer-background);
        }
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
