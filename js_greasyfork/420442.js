// ==UserScript==
// @name         alauda-go-to-localhost
// @version      1.0
// @description  easily fetch API in alauda product!
// @include      /^https?:\/\/192\.168\..*$/
// @include      /^https?:\/\/10\.0\..*$/
// @include      /^https?:\/\/.*alauda.*$/
// @exclude      /^https?:\/\/jira.alauda.*$/
// @exclude      /^https?:\/\/confluence.alauda.*$/
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.slim.min.js
// @namespace https://greasyfork.org/users/167832
// @downloadURL https://update.greasyfork.org/scripts/420442/alauda-go-to-localhost.user.js
// @updateURL https://update.greasyfork.org/scripts/420442/alauda-go-to-localhost.meta.js
// ==/UserScript==

(function() {
  "use strict";

  if (!usePlugin()) {
    return;
  }

  const triggerButton = $(
    `<div id='alauda-trigger-button' style='cursor:pointer;z-index:102;display:inline-block;position:fixed;left:0;bottom:0;text-align:center;background-color:lightgray;padding: 6px 8px 2px 8px;'>localhost</div>`
  );

  $("body").append(triggerButton);
  triggerButton.click(trigger);

  function trigger() {
    if (localStorage.getItem("token")) {
      window.location =
        "http://localhost:4200?id_token=" + localStorage.getItem("token");
    } else if (localStorage.getItem("id_token")) {
      window.location =
        "http://localhost:4200?id_token=" + localStorage.getItem("id_token");
    } else {
      //刚登录可能不存在token
      $("#alauda-trigger-button").text("retry");
    }
  }
  function usePlugin() {
    const { pathname, hostname } = location;
    //already jump
    if (hostname === "localhost") return false;
    if (pathname.split("/").indexOf("console-acp") > 0 || pathname.split("/").indexOf("console-platform") > 0) return true;
    return false;
  }
})();
