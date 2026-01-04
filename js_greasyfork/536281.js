// ==UserScript==
// @name         generals.io Custom功能增强/聊天记忆
// @version       2024.7.30.2
// @description  generals.io custom chat enhance and history
// @author       vasi 2
// @match        https://generals.io/games/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=generals.io
// @grant        none
// @license    MIT
// @namespace https://greasyfork.org/users/1340112
// @require https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/536281/generalsio%20Custom%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/536281/generalsio%20Custom%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BF%86.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function main() {
    window.onload = function () {
      if (localStorage.getItem("scriptSetting") == null) {
        localStorage.setItem(
          "scriptSetting",
          `{ "visibility": true,"displayTools":false,"lockChat":false }`
        );
      }

      let gameName = window.location.href.split("s/")[1];
      let prevStorage = [];
      $("body").append(`<style id="lockChatCSS"></style>`);

      $("body").append(`<style>
        .history-message::before {
          height: 50px;
          content: "";
          background-color: #555;
          width: 3px;
          height: 18px;
          padding-left: 5px;
          margin-right: 5px;
          margin-top: -9px;
          -webkit-border-radius: 3px;
          -moz-border-radius: 3px;
        }
        .setting {
          left: -36px;
          height: 35.33px;
          width: 36px;
          background-color: #32a3a3;
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          bottom: 0px;
          transition: 0.3s;
          color: white;
          cursor: pointer;
        }
        .setting:hover {
          background-color: #46d5d5;
          transition: 0.3s;
        }
        #setting:hover {
          background-color: #c62828 !important;
        }
        #setting:hover #tooltip-text1 {
          visibility: visible;
          opacity: 1;
        }
        #setting:hover #setting-avator {
          transform: rotate(180deg);
          transition: 0.3s;
        }
        #dump:hover #tooltip-text3 {
          visibility: visible;
          opacity: 1;
        }
        #lockChat:hover #tooltip-text2 {
          visibility: visible;
          opacity: 1;
        }
        #save:hover #tooltip-text4 {
          visibility: visible;
          opacity: 1;
        }
        #visibility:hover #tooltip-text5 {
          visibility: visible;
          opacity: 1;
        }
        #tools:hover #tooltip-text6 {
          visibility: visible;
          opacity: 1;
        }
        .setting-icon {
          height: 24px;
          color: white;
        }
        #buttonUnit {
          right: 400px;
          position: sticky;
        }
        #visibility:hover {
          background-color: var(--vis-hover-color) !important;
        }
        #slash {
          position: absolute;
          width: var(--slash-width);
          height: 4px;
          background-color: white;
          border-radius: 3px;
          transform: rotate(45deg);
          transition: 0.3s;
        }
        .tooltip-text {
          transition: 0.3s;
          pointer-events: none;
          position: fixed;
          margin-bottom: 70px;
          padding: 3px 5px 3px 5px;
          background-color: #3e9293;
          border-radius: 3px;
          opacity: 0;
          visibility: hidden;
        }
        #tools {
          background-color: #ec4848;
        }
        #tools:hover {
          background-color: #e26c6c;
        }
        #functionPanel {
          width: 400px;
          height: 360px;
          position: fixed;
          background-color: #333333;
          right: 50px;
          top: 150px;
          border: rgb(144 179 179) solid 4px;
        }
        #toolsTitle {
          padding-left: 10px;
          font-size: 24px;
          margin-bottom: 10px;
          margin-top: 10px;
        }
        .toolsUnit {
          height: 50px;
          padding-left: 10px;
          display: flex;
        }
        .toolsInput {
          display: inline-block;
          width: 100px;
          height: 30px;
        }
        .toolsButton {
          height: 30px;
          width: 50px;
          background-color: green;
          color: white;
          text-align: center;
          line-height: 30px;
          display: inline-block;
          margin-left: 10px;
          border-radius: 2px;
          cursor: pointer;
        }
        .toolsText {
          padding: 0px 5px 0px 5px;
          color: white;
          padding-top: 3px;
        }
        #autohello {
          width: 80px;
          font-size: 12px;
          background: #c62828;
          margin-left: 5px;
        }
        #autogoodbye {
          width: 80px;
          font-size: 12px;
          background: #c62828;
          margin-left: 5px;
        }
        .names {
          cursor: pointer;
        }
        .names:hover {
          border-bottom: white solid 2px;
        }
        .stickyNode {
          position: fixed;
          width: 0px;
          display: flex;
          justify-content: center;
          margin :0 auto
        }
        .userProfile {
        z-index:999;
        display:none;
          position: absolute;
          margin: 3px 0px -83px 0px;
          background-color: #606060;
          padding: 4px;
          border-radius: 3px;
        }
        .userProfileLine {
          width: 150px;
          height: 20px;
          border-bottom: white solid;
          padding: 5px 0px 3px 0px;
        }
        .userProfileText {
          display: inline-block;
          position: absolute;
          left: 6px;
          background-color: #388e3c;
          padding: 0px 2px 0px 2px;
          border-radius: 3px;
        }
        .star {
          display: inline-block;
          position: absolute;
          left: 42px;
          line-height: 17px;
        }
        .rank {
          display: inline-block;
          position: absolute;
          right: 10px;
        }
        .ffa {
          position: absolute;
          left: 8px;
          padding: 0px 2px 0px 2px;
          background-color: green;
          border-radius: 3px;
        }
        .duel {
          position: absolute;
          left: 8px;
          padding: 0px 2px 0px 2px;
          background-color: #af9800;
          border-radius: 3px;
              display: flex;
    width: 24px;
    justify-content: center;
        }
        .team {
          position: absolute;
          left: 8px;
          padding: 0px 2px 0px 2px;
          background-color: purple;
          border-radius: 3px;
        }
          .blockedMsg{
          display:none
          }

                              </style>

                `);

      $("body").append(`<div id="functionPanel">
                <p id="toolsTitle">工具箱</p>
                <div class="toolsUnit"><span class="toolsText">当</span><input id="helloInput1" class="toolsInput"><span class="toolsText">加入时发送</span></input><input id="helloInput2" class="toolsInput"></input><div id="helloButton" class="toolsButton">启动</div></div>
                <div class="toolsUnit"><input id="autohelloInput"  class="toolsInput" style="width:90px"><div id="autohello" class="toolsButton">自动欢迎/OFF</div>
                <input id="autogoodbyeInput"  class="toolsInput" style="width: 90px;margin-left: 15px;"><div id="autogoodbye" class="toolsButton">自动告别/OFF</div></div>
                <div class="toolsUnit"><span class="toolsText" style="font-size:14px;padding=0px">注：使用*user*指代加入/退出玩家，*room*指代该房间号</span></div>
                <div class="toolsUnit" style="height:40px"><span class="toolsText">屏蔽玩家发言</span><input id="blockUserInput"  class="toolsInput" style="width: 90px;"><div id="addBlockUser" class="toolsButton" style="width: 40px;background-color:#008ab7;border-radius: 3px 0px 0px 3px;">添加</div><div id="delBlockUser" class="toolsButton" style="background-color: #fd4400;width: 40px;margin-left: 0px;border-radius: 0px 3px 3px 0px;">删除</div><div id="blockUser" class="toolsButton" style="    width: 80px; font-size: 15px;background: #c62828;">block/OFF</div></div>
                <div class="toolsUnit"><span class="toolsText" style="font-size:14px;padding=0px" id="blockedUserList"></span></div>
                </div>`);
      $(".toolsButton").val(0);
      let dict = { 0: false, 1: true };
      let dictT = { true: "block", false: "none" };
      let blockedUser = [];
      function toggleButton(
        ele,
        funcOn,
        funcOff,
        textOn,
        textOff,
        colorOn,
        colorOff
      ) {
        ele.val(1 - ele.val());
        if (dict[ele.val()]) {
          funcOn();
          ele.css("background-color", colorOn);
          ele.html(textOn);
        } else {
          funcOff();
          ele.css("background-color", colorOff);
          ele.html(textOff);
        }
      }
      let hello = (data) => {
        if (
          data.split(" joined the custom game")[0] == $("#helloInput1").val()
        ) {
          socket.emit(
            "chat_message",
            "chat_custom_queue_" + gameName,
            $("#helloInput2").val(),
            ""
          );
        }
      };
      function replaceMsg(str, User, Room) {
        return str.split("*user*").join(User).split("*room*").join(Room);
      }
      let autohello = (data) => {
        if (data.indexOf(" joined the custom game") != -1) {
          socket.emit(
            "chat_message",
            "chat_custom_queue_" + gameName,
            replaceMsg(
              $("#autohelloInput").val(),
              data.split(" joined the custom game")[0],
              gameName
            ),
            ""
          );
        }
      };

      let autogoodbye = (data) => {
        if (data.indexOf(" left the custom game") != -1) {
          socket.emit(
            "chat_message",
            "chat_custom_queue_" + gameName,
            replaceMsg(
              $("#autogoodbyeInput").val(),
              data.split(" left the custom game")[0],
              gameName
            ),
            ""
          );
        }
      };
      let blockUser = (a, data) => {
        blockedUser.forEach((user) => {
          if (data.username == user) {
            $(".chat-message").eq(-1).addClass("blockedMsg");
          }
        });
      };
      $("#helloButton").click(() => {
        toggleButton(
          $("#helloButton"),
          () => {
            socket.on("notify", hello);
            $("#helloInput1").attr("disabled", true);
            $("#helloInput2").attr("disabled", true);
          },
          () => {
            socket.off("notify", hello);
            $("#helloInput1").attr("disabled", false);
            $("#helloInput2").attr("disabled", false);
          },
          "终止",
          "启动",
          "#c62828",
          "green"
        );
      });
      $("#autohello").click(() => {
        toggleButton(
          $("#autohello"),
          () => {
            socket.on("notify", autohello);
            $("#autohelloInput").attr("disabled", true);
            $("#autohelloInput").attr("disabled", true);
          },
          () => {
            socket.off("notify", autohello);
            $("#autohelloInput").attr("disabled", false);
            $("#autohelloInput").attr("disabled", false);
          },
          "自动欢迎/ON",
          "自动欢迎/OFF",
          "green",
          "#c62828"
        );
      });

      $("#autogoodbye").click(() => {
        toggleButton(
          $("#autogoodbye"),
          () => {
            socket.on("notify", autogoodbye);
            $("#autogoodbyeInput").attr("disabled", true);
            $("#autogoodbyeInput").attr("disabled", true);
          },
          () => {
            socket.off("notify", autogoodbye);
            $("#autogoodbyeInput").attr("disabled", false);
            $("#autogoodbyeInput").attr("disabled", false);
          },
          "自动告别/ON",
          "自动告别/OFF",
          "green",
          "#c62828"
        );
      });
      $("#blockUser").click(() => {
        toggleButton(
          $("#blockUser"),
          () => {
            socket.on("chat_message", blockUser);
          },
          () => {
            socket.off("chat_message", blockUser);
          },
          "block/ON",
          "block/OFF",
          "green",
          "#c62828"
        );
      });
      $("#addBlockUser").click(() => {
        if (blockedUser.indexOf($("#blockUserInput").val()) == -1) {
          blockedUser.push($("#blockUserInput").val());
        } else {
          alert("该用户名已存在");
        }
        $("#blockedUserList").text(`已屏蔽玩家：${blockedUser.join(",")}.`);
      });
      $("#delBlockUser").click(() => {
        if (blockedUser.indexOf($("#blockUserInput").val()) != -1) {
          blockedUser.splice(
            blockedUser.indexOf($("#blockUserInput").val()),
            1
          );
        } else {
          alert("该用户名不存在");
        }
        if (blockedUser.length == 0) {
          $("#blockedUserList").text(``);
        } else {
          $("#blockedUserList").text(`已屏蔽玩家：${blockedUser.join(",")}.`);
        }
      });
      function downloadHistory() {
        prevStorage = JSON.parse(localStorage.getItem(gameName));
        for (let item in prevStorage) {
          if (prevStorage[item][1] == 0) {
            $(".chat-messages-container")
              .eq(0)
              .append(
                `<p class="chat-message history-message">${prevStorage[item][0]}</p>`
              );
          } else {
            $(".chat-messages-container")
              .eq(0)
              .append(
                `<p class="chat-message history-message-sys">${prevStorage[item][0]}</p>`
              );
          }
        }
        $(".chat-message").eq(prevStorage.length).css({
          display: "block",
          "border-bottom": "white solid 2px",
          "padding-bottom": "4px",
        });
      }
      function getUsername(name) {
        const contentText = encodeURIComponent(
          name.contents().not(name.children()).text()
        );
        return contentText !== "" ? contentText : name.children().eq(0).text();
      }
      function renewLink() {
        let alist = $(".custom-queue-page-container").children();
        for (let i = 2; i < alist.length; i++) {
          for (let j = 1; j < alist.eq(i).children().length; j++) {
            let name = alist.eq(i).children().eq(j).children().eq(-1);
            name.addClass("names");
            let procName = getUsername(name);
            name.attr(
              "onclick",
              `window.open("https://generals.io/profiles/${procName}",'_blank')`
            );
            name.attr("id", procName.replace(/ /g, "-"));
          }
        }
      }
      socket.on("queue_update", () => {
        renewLink();
        setTimeout(() => {
          loadProfile();
        }, 3000);
      });
      function lockChat() {
        if ($(window).width() >= 1000) {
          $("#lockChatCSS").html(`

              .minimized{opacity:1 !important}
              .chat-messages-container.minimized{
          max-height: 240px !important;
          width: 400px !important;

      }
              `);
        } else {
          $("#lockChatCSS").html(`
              .minimized{opacity:1 !important}
              .chat-messages-container.minimized{
          max-height: 240px !important;
          width: 320px !important;

          }`);
        }
      }
      function lockChatOn() {
        lockChat();
        $(window).on("resize", lockChat);
      }
      function lockChatOff() {
        $(window).off("resize", lockChat);
        $("#lockChatCSS").html(``);
      }
      function generateButton() {
        $(".custom-queue-page-container").css("overflow-x", "hidden");
        $(".chat-messages-container")
          .parent()
          .append(
            `<div id="buttonUnit">
                            <div class="setting" id="setting"><span class="tooltip-text" id="tooltip-text1">设置</span><svg xmlns="http://www.w3.org/2000/svg" class="setting-icon" id="setting-avator"viewBox="0 0 512 512"><path fill="#ffffff" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg></div>
                            <div class="setting" id="dump" style= "left:-108px"><span class="tooltip-text" id="tooltip-text3">清空历史</span><svg class="setting-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></div>
                            <div class="setting" id="lockChat" style= "left:-72px"><span class="tooltip-text" id="tooltip-text2">锁定聊天框</span><svg id="lockChatSvg"class="setting-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"></svg></div>
                            <div class="setting" id="save" style= "left:-144px"><span class="tooltip-text" id="tooltip-text4">下载聊天记录</span><svg xmlns="http://www.w3.org/2000/svg" class="setting-icon" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#ffffff" d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 242.7-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7 288 32zM64 352c-35.3 0-64 28.7-64 64l0 32c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-32c0-35.3-28.7-64-64-64l-101.5 0-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352 64 352zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg></div>
                            <div class="setting" id="visibility" style= "left:-184px"><span class="tooltip-text" id="tooltip-text5">显示/隐藏系统消息</span><div id="slash"></div><svg class="setting-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="#ffffff" d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg></div>
                            <div class="setting" id="tools" style= "left:-220px"><span class="tooltip-text" id="tooltip-text6">工具箱</span><svg class="setting-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M184 48l144 0c4.4 0 8 3.6 8 8l0 40L176 96l0-40c0-4.4 3.6-8 8-8zm-56 8l0 40L64 96C28.7 96 0 124.7 0 160l0 96 192 0 128 0 192 0 0-96c0-35.3-28.7-64-64-64l-64 0 0-40c0-30.9-25.1-56-56-56L184 0c-30.9 0-56 25.1-56 56zM512 288l-192 0 0 32c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32-14.3-32-32l0-32L0 288 0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-128z"/></svg></div>
                        </div>
                            `
          );
        $("#dump").click(() => {
          $(".chat-messages-container").html("")
          localStorage.setItem(gameName, "[]");
        })

        $("#lockChat").click(() => {
          toggleButton(
            $("#lockChat"),

            () => {
              lockChatOn();
              let setting = JSON.parse(localStorage.getItem("scriptSetting"));
              setting.lockChat = !setting.lockChat;
              localStorage.setItem("scriptSetting", JSON.stringify(setting));
            },
            () => {
              lockChatOff();
              let setting = JSON.parse(localStorage.getItem("scriptSetting"));
              setting.lockChat = !setting.lockChat;
              localStorage.setItem("scriptSetting", JSON.stringify(setting));
            },
            `<span class="tooltip-text" id="tooltip-text3">锁定聊天框</span><svg id="lockChatSvg"class="setting-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/></svg>`,
            `<span class="tooltip-text" id="tooltip-text3">锁定聊天框</span><svg id="lockChatSvg"class="setting-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#ffffff" d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80l0 48c0 17.7 14.3 32 32 32s32-14.3 32-32l0-48C576 64.5 511.5 0 432 0S288 64.5 288 144l0 48L64 192c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-32 0 0-48z"/></svg>`,
            "",
            ""
          );
        });
        $("#save").click(() => {
          $(".chat-messages-container").html("");
          prevStorage = JSON.parse(localStorage.getItem(gameName));
          let text = prevStorage
            .map((item) => {
              return item[0];
            })
            .join("\n");
          let blob = new Blob([text], { type: "text/plain" });
          let url = URL.createObjectURL(blob);
          let a = document.createElement("a");
          a.href = url;
          a.download = "chatHistory.txt";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          downloadHistory();
        });

        $("#visibility").click(() => {
          $(".chat-messages-container").html("");
          downloadHistory();
          let setting = JSON.parse(localStorage.getItem("scriptSetting"));
          setting.visibility = !setting.visibility;
          changeHistoryVisibility(setting.visibility);
          localStorage.setItem("scriptSetting", JSON.stringify(setting));
        });

        $("#tools").click(() => {
          let setting = JSON.parse(localStorage.getItem("scriptSetting"));
          setting.displayTools = !setting.displayTools;
          $("#functionPanel").css("display", dictT[setting.displayTools]);
          localStorage.setItem("scriptSetting", JSON.stringify(setting));
        });
        changeHistoryVisibility(
          JSON.parse(localStorage.getItem("scriptSetting")).visibility
        );
      }

      socket.on("game_over", () => {
        generateButton();
        downloadHistory();
        $("#functionPanel").css("display", "block");
      });
      $("#functionPanel").css(
        "display",
        dictT[JSON.parse(localStorage.getItem("scriptSetting")).displayTools]
      );
      if (localStorage.getItem(gameName) == null) {
        localStorage.setItem(gameName, "[]");
      }
      socket.on("game_start", () => {
        $("#functionPanel").css("display", "none");
      });

      socket.on("chat_message", (a, data) => {
          console.log(data)
        prevStorage = JSON.parse(localStorage.getItem(gameName));
        if (data.username != undefined) {
          prevStorage.push([`${data.username}: ${data.text}`, 1]);
        } else if(data.text.indexOf("join")==-1){
          prevStorage.push([`${data.text}`, 0]);
        }
        if (
          data.text ==
          `${localStorage.getItem(
            "GIO_CACHED_USERNAME"
          )} joined the custom lobby.`
        ) {
          generateButton();
          downloadHistory();
          if (JSON.parse(localStorage.getItem("scriptSetting")).lockChat) {
            lockChatOn();
            $("#lockChatSvg").html(
              `<path fill="#ffffff" d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z"/>`
            );
          } else {
            lockChatOff();
            $("#lockChatSvg").html(
              `<path fill="#ffffff" d="M352 144c0-44.2 35.8-80 80-80s80 35.8 80 80l0 48c0 17.7 14.3 32 32 32s32-14.3 32-32l0-48C576 64.5 511.5 0 432 0S288 64.5 288 144l0 48L64 192c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l320 0c35.3 0 64-28.7 64-64l0-192c0-35.3-28.7-64-64-64l-32 0 0-48z"/>`
            );
          }
          //setTimeout(loadProfile, 1000)
        }
        localStorage.setItem(gameName, JSON.stringify(prevStorage));
      });
      function changeHistoryVisibility(visibility) {
        if (visibility) {
          $(".history-message").css("display", "block");
          $("#visibility").css("background-color", "green");
          $("#slash").css("--slash-width", "0px");
          $("#visibility").css("--vis-hover-color", "#08a408");
        } else {
          $(".history-message").css("display", "none");
          $("#visibility").css("background-color", "red");
          $("#slash").css("--slash-width", "35px");
          $("#visibility").css("--vis-hover-color", "#fa6363");
        }
      }
      function loadProfile() {
        $(".stickyNode").remove();
        $(".names").each((i) => {
          let ele = $(".names").eq(i);
          const profileID = `${btoa(ele.attr("id") || "")
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")}-profile`;

          fetch(
            `https://generals.io/api/starsAndRanks?u=${getUsername(
              ele
            )}&client=true`
          )
            .then((data) => data.json())
            .then((json) => {
              $(`#${profileID}`).html(``);
              ele.append(
                `<div class="stickyNode"><div class="userProfile" id=${profileID}></div></div>`
              );
              let k = 0;
              if (json.stars.ffa != undefined && json.stars.ffa != null) {
                $(`#${profileID}`).append(`
                    <div class="userProfileLine" style="padding-top:4px"><div class="ffa">FFA</div><div class="star">⭐${Math.round(json.stars.ffa * 10) / 10
                  }</div><div class="rank">#${json.ranks.ffa}</div></div>
                  `);
                k = 1;
              }
              if (json.stars.duel != undefined && json.stars.duel != null) {
                $(`#${profileID}`).append(`
                    <div class="userProfileLine"><div class="duel">1v1</div><div class="star">⭐${Math.round(json.stars.duel * 10) / 10
                  }</div><div class="rank">#${json.ranks.duel}</div></div>
                  `);
                k = 1;
              }
              if (json.stars["2v2"] != undefined && json.stars["2v2"] != null) {
                $(`#${profileID}`).append(`
                    <div class="userProfileLine" style="border-bottom: none;padding-bottom: 0px;"><div class="team">2v2</div><div class="star">⭐${Math.round(json.stars["2v2"] * 10) / 10
                  }</div><div class="rank">#${json.ranks["2v2"]}</div></div>
                  `);
                k = 1;
              }
              if (k == 0) {
                $(`#${profileID}`).append(`
                    <div class="userProfileLine"><p>无天梯信息</p></div>
                  `);
              }
              $(`#${profileID}`).css(
                "margin-left",
                `${$(`#${profileID}`).parent().parent().width() + 20}px`
              );
              ele.on("mouseover", () =>
                $(`#${profileID}`).css("display", "block")
              );
              ele.on("mouseout", () =>
                $(`#${profileID}`).css("display", "none")
              );
            });
        });
      }
    };
  }


  main();

})();
