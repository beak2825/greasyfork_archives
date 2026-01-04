// ==UserScript==
// @name         WormWorld Connect
// @version      1.1
// @description  The best and first in the world
// @author       Luiz ACC
// @match        https://wormate.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @namespace https://greasyfork.org/users/1455033
// @downloadURL https://update.greasyfork.org/scripts/532091/WormWorld%20Connect.user.js
// @updateURL https://update.greasyfork.org/scripts/532091/WormWorld%20Connect.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ✅ Impede que o script execute mais de uma vez
  if (window.__wormworldLoaded) {
    console.log("🐍 Script já carregado.");
    return;
  }
  window.__wormworldLoaded = true;

  // ✅ Redireciona a URL principal para /ios
  if (location.host === "wormate.io" && location.pathname === "/") {
    window.stop(); // Interrompe o carregamento da página original
    location.href = "https://wormate.io/wormworld-connect"; // Redireciona para /ios
    return;
  }

  // ✅ CSS customizado para aplicar na versão modificada da página
  const css = `.ui-widget-overlay{background:#000;opacity:.5}.wormworld-connect-box{display:grid;grid-template-columns:1fr 1fr;gap:5px}.wormworld-connect-count-box{display:grid;grid-template-columns:1fr 1fr 1fr;gap:2px}.wormworld-connect-count-b32{display:grid!important;grid-template-columns:1fr 1fr 1fr;gap:2px}.wormworld-connect-box .titles{line-height:25px;color:#f4a700}#load_page_apoiador .ui-widget-header{border:none;background:0 0;display:flex;flex-wrap:wrap;justify-content:center;align-content:center;flex-direction:row;align-items:center}#load_page_apoiador .ui-widget-content{color:#fff!important}#load_page_apoiador .ui-widget.ui-widget-content{border:none;background-color:transparent}#load_page_apoiador .ui-tabs .ui-tabs-nav .ui-tabs-anchor,#load_page_apoiador .ui-tabs .ui-tabs-panel{padding:0}#load_page_apoiador .ui-state-default,#load_page_apoiador .ui-widget-content .ui-state-default,#load_page_apoiador .ui-widget-header .ui-state-default{background:0 0;border:none;min-width:40px}#load_page_apoiador .ui-tabs-active a{border:1px solid tomato}#wwc_room_item a{display:block;color:#fff;line-height:30px;padding:0 5px}#wwc_room_item a:hover{background-color:#000}#game-wrap #game-cont #stretch-box #main-menu-view .line-bottom #mm-wwc{background-color:#ff2020;color:#fff;overflow:hidden;height:50px;line-height:50px;font-size:20px;padding:0 10px;box-sizing:border-box;border-radius:5px;border:0;outline:0;box-shadow:0 1px 1px 0 rgb(0 0 0 / 20%);text-align:center;text-shadow:0 0 1px #000;cursor:pointer;transition:background-color .5s;min-width:120px;display:inline-block;float:right;margin:0 3px}.title-worm-world-connect{font-size:1.2em!important;color:red;background-color:#fff;padding:5px;border-radius:6px;text-align:center;font-weight:700}.selecionar-sala{padding:1px;margin:1px;display:block;text-transform:uppercase;text-decoration:none;font-weight:700;color:#fff}#contadorKill_1,#contadorKill_2,#myroom{border-radius:10px;padding:0 3px;width:68px;color:#fff;position:absolute;z-index:999;text-align:center;top:110px;left:21px;-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;font-size:.6em;display:none}#contadorKill_2{border-radius:6px;top:135px}#myroom{border-radius:6px;top:3px;left:-21px}#contadorKill_1>*,#contadorKill_2>*{width:40%;text-align:center;line-height:1em;display:inline-block}#idReplaceSkin{position:absolute}.iscustom{background-color:#fff!important;color:#3f51b5!important}.f32 .flag{display:inline-block;height:32px;width:32px;vertical-align:text-top;line-height:32px;background:url('https://wormworld.herokuapp.com/images/flags.png') no-repeat}.f32 .br{background-position:0 0}.f32 .us{background-position:0 -35px}.f32 .ca{background-position:0 -71px}.f32 .mx{background-position:0 -106px}.f32 .de{background-position:0 -141px}.f32 .fr{background-position:0 -177px}.f32 .sg{background-position:0 -212px}.f32 .jp{background-position:0 -247px}.f32 .au{background-position:0 -283px}.f32 .gb{background-position:0 -318px}.f32 .x2{background-position:0 -330px}`;

  // ✅ Intercepta o HTML original da wormate.io e modifica a referência ao game.js
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://wormate.io/", // Carrega o HTML original da página
    onload: function (data) {
      let response = data.responseText;

      // 🔁 Substitui a referência ao script do jogo por um customizado
      response = response.replace(
        /(["'])\/[^"']*game\.js[^"']*\1/g,
        `"https://wormworld.io/extension/game?v=${location.hash}"`
      );

      // ✅ Escreve o HTML modificado no documento atual
      document.open();
      document.write(response);
      document.close();

      // ✅ Aplica o CSS customizado na nova página
      const style = document.createElement("style");
      style.type = "text/css";
      style.appendChild(document.createTextNode(css));
      document.head.appendChild(style);
    },
  });
})();