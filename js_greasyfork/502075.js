// ==UserScript==
// @name        ADBot addon for Bodega Bot
// @version     3.0
// @description 420 Reminders and Custom Messages
// @author      Bort
// @icon        https://media1.giphy.com/avatars/FeedMe1219/aBrdzB77IQ5c.gif
// @match       https://tinychat.com/room/*
// @match       https://tinychat.com/*
// @exclude     https://tinychat.com/settings/*
// @exclude     https://tinychat.com/subscription/*
// @exclude     https://tinychat.com/promote/*
// @exclude     https://tinychat.com/coins/*
// @exclude     https://tinychat.com/gifts
// @grant       none
// @run-at      document-start
// @require     http://code.jquery.com/jquery-latest.js
// @namespace   https://greasyfork.org/users/1024912
// @downloadURL https://update.greasyfork.org/scripts/502075/ADBot%20addon%20for%20Bodega%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/502075/ADBot%20addon%20for%20Bodega%20Bot.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function () {
  "use strict";

  var Project = {
    Name: "AdBot",
    RequiredVersion: {
      Major: 1,
      Minor: 6,
      Patch: 33
    }
  };
  function Main() {
    window.CTSAddon = {
      ReminderList: [
        ["1:18am", "Get ready! 🍀 Blaze fest in 2 minutes! 🌿"],
        ["1:20am", "Happy 420 🍀 Blaze fest! 🌿"],
        ["2:18am", "Prepare yourself! 🚀 Ready to fly high in 2 minutes! 🌌"],
        ["2:20am", "Happy 420 🚀 Ready to fly high! 🌌"],
        ["3:18am", "Almost time! 🌱 Spark it up in 2 minutes! 💨"],
        ["3:20am", "Happy 420 🌱 Spark it up! 💨"],
        ["4:18am", "Get set! 🍁 Time to celebrate in 2 minutes! 🌟"],
        ["4:20am", "Happy 420 🍁 Enjoy the moment! 🌟"],
        ["5:18am", "Ready? 🌿 Time for a toke in 2 minutes! 🌪"],
        ["5:20am", "Happy 420 🌿 Time for a toke! 🌪"],
        ["6:18am", "Almost there! 🌈 Let's get lifted in 2 minutes! 🎈"],
        ["6:20am", "Happy 420 🌈 Let's get lifted! 🎈"],
        ["7:18am", "Prepare! 💚 Smoke break in 2 minutes! 💨"],
        ["7:20am", "Happy 420 💚 Smoke break! 💨"],
        ["8:18am", "Get ready! 🌿 Blaze it up in 2 minutes! 🔥"],
        ["8:20am", "Happy 420 🌿 Blaze it up! 🔥"],
        ["9:18am", "Almost time! 🌱 Puff, puff, pass in 2 minutes! 🌬"],
        ["9:20am", "Happy 420 🌱 Puff, puff, pass! 🌬"],
        ["10:18am", "Get set! 🍁 Toke time in 2 minutes! 🌟"],
        ["10:20am", "Happy 420 🍁 Toke time! 🌟"],
        ["11:18am", "Ready? 🌿 Light it up in 2 minutes! 💨"],
        ["11:20am", "Happy 420 🌿 Light it up! 💨"],
        ["12:18pm", "Almost there! 🌈 Time to get high in 2 minutes! 🎈"],
        ["12:20pm", "Happy 420 🌈 Time to get high! 🎈"],
        ["1:18pm", "Prepare! 💚 Smoke it up in 2 minutes! 💨"],
        ["1:20pm", "Happy 420 💚 Smoke it up! 💨"],
        ["2:18pm", "Get ready! 🌿 Blaze away in 2 minutes! 🔥"],
        ["2:20pm", "Happy 420 🌿 Blaze away! 🔥"],
        ["3:18pm", "Almost time! 🌱 Let's roll in 2 minutes! 🌬"],
        ["3:20pm", "Happy 420 🌱 Let's roll! 🌬"],
        ["4:18pm", "Get set! 🍁 Time to celebrate in 2 minutes! 🌟"],
        ["4:20pm", "Happy 420 🍁 Enjoy the moment! 🌟"],
        ["5:18pm", "Ready? 🌿 Spark and chill in 2 minutes! ✨"],
        ["5:20pm", "Happy 420 🌿 Spark and chill! ✨"],
        ["6:18pm", "Almost there! 🌈 Toke up in 2 minutes! 🎈"],
        ["6:20pm", "Happy 420 🌈 Toke up! 🎈"],
        ["7:18pm", "Prepare! 💚 Time to light up in 2 minutes! 💨"],
        ["7:20pm", "Happy 420 💚 Time to light up! 💨"],
        ["8:18pm", "Get ready! 🌿 Blaze it in 2 minutes! 🔥"],
        ["8:20pm", "Happy 420 🌿 Blaze it! 🔥"],
        ["9:18pm", "Almost time! 🌱 Puff time in 2 minutes! 🔥"],
        ["9:20pm", "Happy 420 🌱 Puff time! 🔥"],
        ["10:18pm", "Get set! 🍁 Toke break in 2 minutes! 🌟"],
        ["10:20pm", "Happy 420 🍁 Toke break! 🌟"],
        ["11:18pm", "Ready? 🌿 Get lifted in 2 minutes! 💨"],
        ["11:20pm", "Happy 420 🌿 Get lifted! 💨"],
        ["12:18am", "Almost there! 🌈 High time in 2 minutes! 🎈"],
        ["12:20am", "Happy 420 🌈 High time! 🎈"]
      ],
      AKB: []
    };
    console.log("Weed Theme addon loaded successfully");
    console.log(
      "CTSAddon ReminderList length:",
      window.CTSAddon.ReminderList.length
    );
  }
  var e, i;
  var error_code = [
    "Timeout",
    "Bad Code",
    "More Than One Addon Running",
    "Version Mismatch"
  ];
  var CTS = {
    Init: function Init() {
      e++;
      if (CTS.PageLoaded()) {
        try {
          if (window.CTS === undefined) {
            window.CTS = true;
            CTS.Dispose();
            if (CTS.Version()) {
              Main();
            } else {
              CTS.Flag(
                3,
                "ReqVersion:" +
                  Project.RequiredVersion.Major +
                  "." +
                  Project.RequiredVersion.Minor +
                  "." +
                  Project.RequiredVersion.Patch +
                  "\nCTSVersion:" +
                  window.CTSVersion.Major +
                  "." +
                  window.CTSVersion.Minor +
                  "." +
                  window.CTSVersion.Patch
              );
            }
          } else {
            CTS.Flag(2);
          }
        } catch (e) {
          CTS.Flag(1, e);
        }
        if (e >= 20) CTS.Flag(0);
      }
    },
    Load: function Load() {
      var val = localStorage.getItem("CTS_" + arguments[0]);
      if (null === val && "undefined" != typeof arguments[1]) {
        CTS.Save(arguments[0], arguments[1]);
        return arguments[1];
      }
      return val;
    },
    Save: function Save() {
      localStorage.setItem("CTS_" + arguments[0], arguments[1]);
    },
    PageLoaded: function PageLoaded() {
      if (document.querySelector("tinychat-webrtc-app")) {
        if (document.querySelector("tinychat-webrtc-app").shadowRoot)
          return true;
      }
    },
    Dispose: function Dispose() {
      clearInterval(i);
    },
    Version: function Version() {
      return (
        (Project.RequiredVersion.Major <= window.CTSVersion.Major &&
          Project.RequiredVersion.Minor < window.CTSVersion.Minor) ||
        (Project.RequiredVersion.Minor == window.CTSVersion.Minor &&
          Project.RequiredVersion.Patch <= window.CTSVersion.Patch)
      );
    },
    Flag: function Flag(err, caught) {
      clearInterval(i);
      console.log(
        "CTS ADDON ERROR\nCould not load!\nError: " +
          error_code[err] +
          (caught !== undefined ? "\n" + caught : "") +
          "\n\nProject Name:\n" +
          Project.Name
      );
    }
  };
  i = setInterval(CTS.Init, 500);
})();
