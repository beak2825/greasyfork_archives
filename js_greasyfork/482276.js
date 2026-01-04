// ==UserScript==
// @name         Ace to Monaco for AtCoder
// @namespace    https://yahoo.co.jp
// @version      1.0.0
// @description  AtCoderのエディタをMonacoに差し替えます
// @author       茶色コーダー
// @license      MIT
// @match        https://atcoder.jp/contests/*/custom_test
// @exclude
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482276/Ace%20to%20Monaco%20for%20AtCoder.user.js
// @updateURL https://update.greasyfork.org/scripts/482276/Ace%20to%20Monaco%20for%20AtCoder.meta.js
// ==/UserScript==

// 要素が出現するまで待つ関数（出てこなかったら永遠ループ）
const waitQuerySelector = async function (selector, node = document) {
    let obj = null;

    while (!obj) {
        obj = await new Promise((resolve) =>
            setTimeout(() => resolve(node.querySelector(selector), 100))
        );
    }

    return obj;
};

// 指定秒数待つ関数
const wait = async (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const func1 = async function () {
    // headを取得する
    const head = document.head;
    // headの末尾にMonaco Editor用CSS（+α）を追加する
    head.insertAdjacentHTML(
        "beforeEnd",
        `<link rel="stylesheet" data-name="vs/editor/editor.main" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/editor/editor.main.min.css" />
        <style>#editor {max-height: 600px;}</style>`
    );

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js";
    document.head.prepend(script);

    // ACEエディタの中身はいらないので消す
    const editor = document.getElementById("editor");
    editor.innerHTML = "";

    // loaderを読み込み終わったら処理開始
    script.onload = async function () {
        // 画面読み込み時の初期コードの取得
        const initCode = document.querySelector("#plain-textarea").innerText;

        // プログラミング言語を選択する要素の取得（読み込み対策で0.1秒遅延）
        await wait(100);
        const langSelector = document.querySelector('select[name="data.LanguageId"]');
        const langOptions = Array.from(document.querySelectorAll("option"));

        // 選択した要素のIDがどの言語なのか判別
        const langText = langOptions.find((item) => {
            return item.getAttribute("value") === langSelector.value;
        });
        const langMode = langText ? langText.getAttribute("data-ace-mode") : "text";
        // console.log("最初のテキストは", langMode);

        // Monaco EditorのCDNのパスを設定
        require.config({
            paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs" },
        });

        // Monaco Editor周りの処理
        require(["vs/editor/editor.main"], async function () {
            // Monaco Editorを降臨させる
            const localEditor = monaco.editor.create(editor, {
                value: initCode,
                language: langMode,
                theme: "vs-dark",
                lineHeight: 21,
            });

            // 言語変更時の監視対象のエレメントの取得
            const langElement = await waitQuerySelector(".select2-selection__rendered");

            //MutationObserver（インスタンス）の作成
            var mo = new MutationObserver(function (record, observer) {
                const lang = langOptions.find((item) => {
                    return item.getAttribute("value") === langSelector.value;
                });

                // console.info(
                //     "innerText: ",
                //     langElement.innerText,
                //     "\n ace-mode: ",
                //     lang.getAttribute("data-ace-mode")
                // );

                // Editorに新たな言語を設定
                monaco.editor.setModelLanguage(
                    localEditor.getModel(),
                    lang.getAttribute("data-ace-mode")
                );
            });

            // 監視する「もの」の指定（必ず1つ以上trueにする）
            var config = {
                childList: true, //「子ノード（テキストノードも含む）」の変化
                attributes: false, //「属性」の変化
                characterData: false, //「テキストノード」の変化
            };

            // 監視の開始
            mo.observe(langElement, config);

            // コードテストのform実行時にAce Editorから値を持ってきてしまうので、
            // その上からMonaco Editorの値で書き換える
            const formRef = $(".form-code-submit");
            formRef.on("submit", function () {
                $("#plain-textarea").val(localEditor.getValue());
            });
        });
    };
};

async function execWorkflow() {
    await func1();
}

// メイン処理の実行ﾀｲﾐﾝｸﾞが、windowのロード時となるように登録する
window.addEventListener("load", async function () {
    await execWorkflow();
});
