// ==UserScript==
// @name         Qiita同時スクロール
// @description  Qiitaの投稿画面のエディター(左)・プレビュー(右)の同時スクロールを改善し、各見出しを基準にスクロール位置を合わせるようにする。
// @author       fukuchan
// @match        *://*.qiita.com/drafts/new
// @match        *://*.qiita.com/drafts/*/edit*
// @run-at       document-start
// @version 0.0.1.20201007134028
// @namespace https://greasyfork.org/users/432749
// @downloadURL https://update.greasyfork.org/scripts/397153/Qiita%E5%90%8C%E6%99%82%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/397153/Qiita%E5%90%8C%E6%99%82%E3%82%B9%E3%82%AF%E3%83%AD%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

// あらかじめaddEventListenerを上書きして既存のscrollイベントが設定されるのを阻止する
Document.prototype._addEventListener = Document.prototype.addEventListener;
Document.prototype.addEventListener = function (type, listener, useCapture = false) {
    if (type === "scroll") {
        return;
    }
    this._addEventListener(type, listener, useCapture);
};

// ロード後に実行
window.addEventListener("DOMContentLoaded", () => {
    // エディターを取得
    const editor = document.querySelector("textarea[placeholder='プログラミング知識をMarkdown記法で書いて共有しよう']");

    // エディターのスタイルを取得
    const style = getComputedStyle(editor);
    const lineHeight = style.lineHeight ? parseFloat(style.lineHeight) : 21;
    const padding = style.padding ? parseFloat(style.padding) : 10;

    // 見出し座標計算用のテキストエリアを作る
    const textarea = document.createElement("textarea");
    Array.from(style).forEach(key => textarea.style.setProperty(key, style.getPropertyValue(key), style.getPropertyPriority(key)));
    textarea.style.pointerEvents = "none";
    textarea.style.visibility = "hidden";
    textarea.style.position = "absolute";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "100%";
    textarea.style.height = (padding * 2 + lineHeight) + "px";
    textarea.readOnly = true;
    editor.parentElement.style.position = "relative";
    editor.parentElement.append(textarea);

    // スクロールの下限をなくすように見せかける
    const handleWheel = e => {
        if (editor.scrollTop === editor.scrollHeight - editor.clientHeight) {
            // スクロール末尾でなおスクロールしようとしている場合
            const y = editor.style.paddingBottom ? parseFloat(editor.style.paddingBottom) : padding;
            const deltaY = e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? editor.clientHeight :
                e.deltaMode === WheelEvent.DOM_DELTA_LINE ? e.deltaY * lineHeight :
                    e.deltaY;
            const sum = y + deltaY;
            if (deltaY < 0 || sum < editor.clientHeight) {
                // padding-bottomを増やしてスクロールしているように見せかける
                editor.style.paddingBottom = sum + "px";
                editor.scrollTop = editor.scrollHeight - editor.clientHeight;
            }
        } else if (parseFloat(editor.style.paddingBottom) !== padding) {
            editor.style.paddingBottom = padding + "px";
        }
    };

    // エディタにpadding-bottomを設定しているのをごまかす
    const handleInput = () => {
        if (editor.style.paddingBottom) {
            const paddingBottom = parseFloat(editor.style.paddingBottom);
            // padding-bottomが設定されている場合
            if (paddingBottom > padding) {
                // 入力時にpadding-bottomを調整して、パディングの中に文字列が隠れるのを防止する
                const deltaY = editor.scrollTop - editor.scrollHeight + editor.clientHeight;
                const y = paddingBottom + deltaY > padding ? paddingBottom + deltaY : padding;
                editor.style.paddingBottom = y + "px";
            }
        }
        const viewer = document.querySelector(".it-MdContent").parentElement;
        if (viewer) {
            // 入力のたびにプレビューのスクロール位置が0にされるのを無理やり修正
            const disableScroll = () => {
                // スクロール位置を再計算し、一度再計算したらイベントリスナを削除する
                handleScroll();
                viewer.removeEventListener("scroll", disableScroll);
            };
            viewer.addEventListener("scroll", disableScroll);
        }
    };

    // 見出しに合わせてスクロールする
    const handleScroll = () => {
        const viewer = document.querySelector(".it-MdContent").parentElement;
        if (!viewer) {
            // プレビュー非表示モードなら何もしない
            return;
        }

        // 座標が未設定ならなにもしない
        if (!editor.dataset.coordinates || !viewer.dataset.coordinates) {
            return;
        }

        // datasetから各見出しの座標を取得
        const x = JSON.parse(editor.dataset.coordinates);
        const y = JSON.parse(viewer.dataset.coordinates);

        // 線形補完でプレビューのスクロール位置を計算
        const i = x.reduce((a, b, j) => b <= editor.scrollTop ? j : a, 0);
        viewer.scrollTop = i === x.length - 1 ? y[y.length - 1] : (y[i + 1] - y[i]) / (x[i + 1] - x[i]) * (editor.scrollTop - x[i]) + y[i];
    };

    // プレビューの変更時に見出しの座標を計算する
    const handleMutation = async () => {
        const viewer = document.querySelector(".it-MdContent").parentElement;
        if (!viewer) {
            // プレビュー非表示モードなら何もしない
            return;
        }
        viewer.style.position = "relative";
        const target = viewer.children[0];

        // エディターにおける各見出し位置を求める
        const getXCoordinates = new Promise(resolve => {
            // 見出しで文章を分割
            const re = /(?=^(?:> ?)?#+)/gm;
            const paragraphs = editor.value.split(re);
            const xCoordinates = paragraphs.map((paragraph, i) => {
                // 計算用テキストエリアに入力、テキストエリアの高さから見出し位置を求める
                textarea.value = paragraphs.slice(0, i + 1).join("");
                return textarea.scrollHeight - padding * 2;
            });

            // スクロール先頭の座標を追加
            if (paragraphs[0].match(re)) {
                xCoordinates.unshift(0);
            }
            xCoordinates.unshift(0);

            resolve(xCoordinates);
        });

        // プレビューにおける各見出し位置を求める
        const getYCoordinates = new Promise(resolve => {
            // detailsを全て開き、画像は全て先行読み込みに設定
            target.querySelectorAll("details").forEach(node => (node.open = true));
            target.querySelectorAll("img").forEach(node => (node.loading = "eager"));

            // 画像の読み込みを待機
            const images = Array.from(target.querySelectorAll("img"));
            const intervalID = setInterval(() => {
                // naturalHeightが0より大きくなれば読み込み完了と推測
                if (images.every(image => image.naturalHeight > 0)) {
                    // ループを終了
                    clearInterval(intervalID);

                    // 見出し位置を求める
                    const headers = target.querySelectorAll("h1,h2,h3,h4,h5,h6");
                    const yCoordinates = Array.from(headers).map(header => header.offsetTop);

                    // スクロールの先頭と末尾の座標を追加
                    yCoordinates.unshift(0);
                    yCoordinates.push(viewer.scrollHeight);

                    resolve(yCoordinates);
                }
            }, 10);
        });

        // 座標をdata-coordinatesに設定
        editor.dataset.coordinates = JSON.stringify(await getXCoordinates);
        viewer.dataset.coordinates = JSON.stringify(await getYCoordinates);

        // プレビューの下に空白を追加
        target.style.marginBottom = viewer.clientHeight + "px";

        // スクロール位置を修正
        handleScroll();
    };

    // エディタに各イベントリスナを設定する
    editor.addEventListener("scroll", handleScroll);
    editor.addEventListener("wheel", handleWheel);
    editor.addEventListener("input", handleInput);

    // プレビューの変更・レイアウトの変更・ウィンドウのリサイズを監視
    new MutationObserver(handleMutation).observe(editor.parentElement.parentElement.nextElementSibling, {
        childList: true,
        subtree: true
    });
    window.addEventListener("resize", handleMutation);
});
