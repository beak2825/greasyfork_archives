// ==UserScript==
// @name         ピクトセンス 画像保存&カラーパレット&ピッカー
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  画像保存ボタンとカラーパレット&ピッカーを追加します。
// @author       あるぱか
// @match        https://pictsense.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pictsense.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512883/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%20%E7%94%BB%E5%83%8F%E4%BF%9D%E5%AD%98%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/512883/%E3%83%94%E3%82%AF%E3%83%88%E3%82%BB%E3%83%B3%E3%82%B9%20%E7%94%BB%E5%83%8F%E4%BF%9D%E5%AD%98%E3%82%AB%E3%83%A9%E3%83%BC%E3%83%91%E3%83%AC%E3%83%83%E3%83%88%E3%83%94%E3%83%83%E3%82%AB%E3%83%BC.meta.js
// ==/UserScript==


(function() {



    // 生成

    document.getElementById('colorPalette').innerHTML =
    '<button type="button" id="cls" class="color" data-color="000000" style="background-color: 000; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="000000" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="808080" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="d3d3d3" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffffff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff0000" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff0055" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff00aa" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff00ff" style="background-color: #FF0; height: 8px;"></button>'+
    '<button type="button" class="color" data-color="d500ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="aa00ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="5500ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="0000ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="002bff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="0055ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00aaff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00d5ff" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00ffd5" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00ff80" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="00ff2b" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="71ff0e" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="aaff00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="d5ff00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffff00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ffdd00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff7f00" style="background-color: #FF0; height: 8px;"></button>'+
	'<button type="button" class="color" data-color="ff2b00" style="background-color: #FF0; height: 8px;"></button>';

    document.getElementById('opacitySliderHolder').firstElementChild.innerHTML =
    '<input type="color" id="color" value="#000000" style="margin-left: 5px;">';



    // 先に定義しとかないといけない変数

    const saveToolButton = document.createElement("button");
    saveToolButton.type = "button";
    saveToolButton.id = "saveSubmitButton";


    // 監視するターゲット要素の設定
    const targetNode = document.body;

    // オプション設定 (子ノードの追加・削除を監視)
    const config = { childList: true, subtree: true };

    // コールバック関数の定義
    const callback = (mutationsList, observer) => {
        const undoButton = document.querySelector("#undoButton");
        if (undoButton) {
            const undo = undoButton.closest("div");
            if (undo && !undo.contains(saveToolButton)) {
                if (document.querySelector("#saveSubmitButton")) {observer.disconnect();}
                undo.appendChild(saveToolButton);
            }
        }
    };

    // 監視開始
    const observer = new MutationObserver(callback);
    observer.observe(targetNode, config);



    // CSS設定

    const CSSs = document.createElement("div");
    document.getElementById("base").appendChild(CSSs);
    CSSs.innerHTML =

    '<style>'+

        // 戻すボタン
        '#pc #undoButton {'+
        'position: relative;'+
        'bottom: -2px;'+
        '}'+

        // 画像保存ボタン
        '#saveSubmitButton {'+
        'background: #fff url(https://iconbox.fun/wp/wp-content/uploads/1069_dl_h.svg) center no-repeat;'+
        'background-size: auto 160%;'+
        'width: 60px;'+
        'height: 26px;'+
        'border: 2px solid #999;'+
        'position: relative;'+
        'bottom: -4px;'+
        'border-radius: 0'+
        '}'+

        '#clearButton, #undoButton, #sizeButtonHolder button {'+
        'height: 26px;'+
        '}'+

    '</style>';





/* カラーパレット ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */



    // カラーパレット適用関数を呼び出し

    const colorPalettes = document.querySelector("#color");
    colorPalettes.addEventListener("input", updateFirst, false);



    // カラーパレットを適用

    function updateFirst(e) {
        const pickcolor = document.querySelector("#cls");
        if (pickcolor) {
            const color = e.target.value;
            pickcolor.style.backgroundColor = color;
            pickcolor.dataset.color = color.slice(1);
            MouseDown();
        }
    }



    // 色反映

    const target = document.querySelector("#colorPalette > button:nth-child(1)");
    function MouseDown() {
        const { left, top } = target.getBoundingClientRect();
        target.dispatchEvent(new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        clientX: left,
        clientY: top,
        }));
    }





/* 画像保存ツール ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- */



    // 画像保存変数

    const canvas = document.getElementById("canvas");
    const link = document.createElement("a");



    // クリックで画像保存

    saveToolButton.addEventListener('click', () => {



        // 現在時刻の取得&ファイル名に追加

        const d = new Date();
        const fileName = window.location.hash.slice(3) +
        "_" +
        (d.getFullYear()) +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        ("0" + d.getDate()).slice(-2) +
        "_" +
        ("0" + d.getHours()).slice(-2) +
        ("0" + d.getMinutes()).slice(-2) +
        ("0" + d.getSeconds()).slice(-2);


        // 画像保存

        link.href = canvas.toDataURL("image/png");
        link.download = fileName + ".png";
        link.click();
    });





})();