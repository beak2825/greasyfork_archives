// ==UserScript==
// @name         NoPageRefreshWhenHosped
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents page refresh when hospitalized on Torn.
// @author       amelia
// @match        https://www.torn.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485585/NoPageRefreshWhenHosped.user.js
// @updateURL https://update.greasyfork.org/scripts/485585/NoPageRefreshWhenHosped.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
  const originalGetter = dataProperty.get;

  dataProperty.get = hookedGetter;
  Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

  function hookedGetter() {
    const socket = this.currentTarget;

    if (!(socket instanceof WebSocket) || socket.url.indexOf("ws-centrifugo.torn.com") === -1) {
      return originalGetter.call(this); // Invalid or wrong WebSocket
    }

    const message = originalGetter.call(this);
    Object.defineProperty(this, "data", { value: message }); // Anti-loop

    return handleMessage(message);
  }

  function handleMessage(message) {
    console.log("NoPageRefreshWhenHosped: " + message);
    let resultMessage = message;

    if (resultMessage.includes(`"onHospital":[],`)) {
      resultMessage = resultMessage.replace(`"onHospital":[],`, "");
      console.log("NoPageRefreshWhenHosped Modified: " + resultMessage);
    }

    return resultMessage;
  }
})();
