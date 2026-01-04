// ==UserScript==
// @name                WME衛星画像シフター
// @version             1.7.9
// @description         WMEで衛星画像の位置と透明度を調整します（方向キーとボタンで全方位移動対応、ズーム時位置維持）
// @match               https://beta.waze.com/*editor*
// @match               https://www.waze.com/*editor*
// @grant               none
// @author       　　　 碧いうさぎ
// @icon                https://img.icons8.com/?size=48&id=36210&format=png
// @namespace           https://www.waze.com/forum/viewtopic.php?t=53022
// @contributor         berestovskyy, iainhouse, ragacs
// @downloadURL https://update.greasyfork.org/scripts/528950/WME%E8%A1%9B%E6%98%9F%E7%94%BB%E5%83%8F%E3%82%B7%E3%83%95%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/528950/WME%E8%A1%9B%E6%98%9F%E7%94%BB%E5%83%8F%E3%82%B7%E3%83%95%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

function initializeAerialShifter() {
    console.log("WME衛星画像シフター: 初期化中...");

    // サイドバータブを登録
    const { tabLabel, tabPane } = W.userscripts.registerSidebarTab("wme-aerial-shifter");

    tabLabel.innerText = '衛星画像調整';
    tabLabel.title = '衛星画像の位置を調整';

    tabPane.innerHTML = `
        <div style="padding: 10px; text-align: center; font-size: 16px;">
            <div style="margin-bottom: 15px;">
                <label style="font-size: 18px;">水平移動 (m):</label><br>
                <input type="number" id="was_sx" min="-100000" max="100000" step="10" value="0" style="margin: 0 auto; display: block; font-size: 16px; padding: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="font-size: 18px;">垂直移動 (m):</label><br>
                <input type="number" id="was_sy" min="-100000" max="100000" step="10" value="0" style="margin: 0 auto; display: block; font-size: 16px; padding: 5px;">
            </div>
            <div style="margin-bottom: 15px;">
                <label style="font-size: 18px;">透明度 (%):</label><br>
                <input type="number" id="was_opacity" min="0" max="100" step="10" value="100" style="margin: 0 auto; display: block; font-size: 16px; padding: 5px;">
            </div>
            <div style="margin: 15px 0;">
                <button id="was_upleft" style="font-size: 24px; padding: 10px 15px;">↖</button>
                <button id="was_up" style="font-size: 24px; padding: 10px 15px;">↑</button>
                <button id="was_upright" style="font-size: 24px; padding: 10px 15px;">↗</button>
                <br>
                <button id="was_left" style="font-size: 24px; padding: 10px 15px;">←</button>
                <button id="was_right" style="font-size: 24px; padding: 10px 15px;">→</button>
                <br>
                <button id="was_downleft" style="font-size: 24px; padding: 10px 15px;">↙</button>
                <button id="was_down" style="font-size: 24px; padding: 10px 15px;">↓</button>
                <button id="was_downright" style="font-size: 24px; padding: 10px 15px;">↘</button>
            </div>
            <div>
                <button id="was_reset" style="font-size: 18px; padding: 5px 10px;">リセット</button>
            </div>
        </div>
    `;

    W.userscripts.waitForElementConnected(tabPane).then(() => {
        console.log("WME衛星画像シフター: UIが読み込まれました。");

        // 入力フィールドにイベントリスナーを追加
        const inputs = ['was_sx', 'was_sy', 'was_opacity'];
        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', applyChanges);
        });

        // ボタンにイベントリスナーを追加
        document.getElementById("was_up").addEventListener("click", () => moveLayer(0, -10));
        document.getElementById("was_down").addEventListener("click", () => moveLayer(0, 10));
        document.getElementById("was_left").addEventListener("click", () => moveLayer(-10, 0));
        document.getElementById("was_right").addEventListener("click", () => moveLayer(10, 0));
        document.getElementById("was_upleft").addEventListener("click", () => moveLayer(-7.07, -7.07));
        document.getElementById("was_upright").addEventListener("click", () => moveLayer(7.07, -7.07));
        document.getElementById("was_downleft").addEventListener("click", () => moveLayer(-7.07, 7.07));
        document.getElementById("was_downright").addEventListener("click", () => moveLayer(7.07, 7.07));
        document.getElementById("was_reset").addEventListener("click", resetDefaults);

        // ズームイベントを監視
        W.map.events.register("zoomend", null, applyChanges);

        loadSettings();
        applyChanges();
    });
}

function moveLayer(deltaX, deltaY) {
    // ボタンクリックでレイヤーを移動
    let shiftX = (parseInt(document.getElementById("was_sx").value) || 0) + deltaX;
    let shiftY = (parseInt(document.getElementById("was_sy").value) || 0) + deltaY;
    document.getElementById("was_sx").value = Math.round(shiftX);
    document.getElementById("was_sy").value = Math.round(shiftY);
    applyChanges();
}

function applyChanges() {
    // 変更を適用
    let shiftX = parseInt(document.getElementById("was_sx").value, 10) || 0;
    let shiftY = parseInt(document.getElementById("was_sy").value, 10) || 0;
    let opacity = parseInt(document.getElementById("was_opacity").value, 10) || 100;

    // ピクセルあたりのメートルを計算
    let metersPerPixel = W.map.getResolution() * 39.37; // ズームレベルに応じた動的計算

    // 衛星レイヤーを取得
    let satLayer = W.map.getLayersBy("CLASS_NAME", "OpenLayers.Layer.Google")[0];

    if (!satLayer || !satLayer.div) {
        console.error("WME衛星画像シフター: 衛星レイヤーが見つかりません。");
        return;
    }

    // 移動と透明度を適用（メートル単位をピクセルに変換）
    satLayer.div.style.transform = `translate(${Math.round(shiftX / metersPerPixel)}px, ${Math.round(shiftY / metersPerPixel)}px)`;
    satLayer.div.style.opacity = opacity / 100;

    saveSettings(shiftX, shiftY, opacity);
}

function resetDefaults() {
    // デフォルト値にリセット
    document.getElementById("was_sx").value = 0;
    document.getElementById("was_sy").value = 0;
    document.getElementById("was_opacity").value = 100;
    applyChanges();
}

function loadSettings() {
    // 設定を読み込み
    let settings = JSON.parse(localStorage.getItem("wme_aerial_shifter_settings"));
    if (settings) {
        document.getElementById("was_sx").value = settings.shiftX || 0;
        document.getElementById("was_sy").value = settings.shiftY || 0;
        document.getElementById("was_opacity").value = settings.opacity || 100;
    }
}

function saveSettings(shiftX, shiftY, opacity) {
    // 設定を保存
    localStorage.setItem("wme_aerial_shifter_settings", JSON.stringify({
        shiftX,
        shiftY,
        opacity
    }));
}

// WMEが準備できたらスクリプトを実行
if (W?.userscripts?.state.isReady) {
    initializeAerialShifter();
} else {
    document.addEventListener("wme-ready", initializeAerialShifter, { once: true });
}