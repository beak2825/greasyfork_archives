// ==UserScript==
// @name         ReadFucker
// @version      0.1
// @namespace    https://readspeaker.jp
// @description  ReadSpeakerくんを強引に使います
// @author       Anonymous_456
// @match        https://readspeaker.jp/
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/456840/ReadFucker.user.js
// @updateURL https://update.greasyfork.org/scripts/456840/ReadFucker.meta.js
// ==/UserScript==

(function () {
    document.getElementById("readspeaker_button1").remove();
    const fucker = document.createElement("div");
    fucker.id = "fucker";
    const myStyle = 'margin:6px;border-radius:6px;border:inset 2px grey;padding:6px;background-color:white;';
    fucker.innerHTML = `<p>テキストを選択中に読み上げボタンを押すと選択中のテキストが読み上げられます</p><span><button id="fuck" style="${myStyle};font-weight:bold;">読み上げ</button></span><span>声<select id="voice" style="${myStyle}">${["Show", "Akira", "Takeru", "Risa"].map(e => `<option value="${e}">${e}</option>`).join("")}</select></span><span>速さ<input type="number" id="speed" min="50" max="400" value="100" style="${myStyle}"></span><br><textarea id="readarea" rows="32" cols="120" style="${myStyle}">拓也の射精 3000円</textarea>`;
    fucker.style.color = "black";
    fucker.style.backgroundColor = "#bfbfbf";
    fucker.style.padding = "12px";
    document.getElementById("home").prepend(fucker);
    document.getElementById("fuck").onclick = () => {
        const readthis = encodeURIComponent(window.btoa(unescape(encodeURIComponent(document.getSelection().toString().length == 0 ? document.getElementById("readarea").value : document.getSelection().toString()))));
        const str =
            `//app-eas.readspeaker.com/cgi-bin/rsent?customerid=5099&lang=ja_jp&voice=${document.getElementById("voice").value}&speed=${document.getElementById("speed").value}&url=&rsjs_ver=3.7.0_rev2198-wr&selectedhtml_base64=`;
        window.open(str + readthis);
    };
})()