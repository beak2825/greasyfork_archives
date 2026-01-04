// ==UserScript==
// @name         美团大象公共号隐藏
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  根据公共号名字及类型配置，把部分公共号隐藏，达到清洁大象网页版左侧对话列表的目的
// @author       anyanwen
// @match        https://x.sankuai.com/*
// @match        http://x.sankuai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sankuai.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/486662/%E7%BE%8E%E5%9B%A2%E5%A4%A7%E8%B1%A1%E5%85%AC%E5%85%B1%E5%8F%B7%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/486662/%E7%BE%8E%E5%9B%A2%E5%A4%A7%E8%B1%A1%E5%85%AC%E5%85%B1%E5%8F%B7%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //var pubs = ["Rhino线下环境"];
    //for (var pub in pubs) {
    //    var style = 'li[class="item comp-session link pubchat not-notify unread"][title="' + pubs[pub] + '"] {display:none;}';
    //    GM.addStyle(style);
    //}
    (function () {
    const pubKey = "pubName";
    const pubNames = GM_getValue(pubKey);
    console.log(pubNames);

    const createDialog = () => {
        let dom = document.createElement("div");
        dom.innerHTML = `
   <div class="wrap" id="mutli-dialog" style="z-index:9999">
  <div class="dialog">
  <div class="header">
    <div class="title">美团大象自动隐藏自定义公共号</div>
    <svg id="close-icon" class="close" width="18" height="18" viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.01 8.996l7.922-7.922c.086-.086.085-.21.008-.289l-.73-.73c-.075-.074-.208-.075-.29.007L9 7.984 1.077.062C.995-.02.863-.019.788.055l-.73.73c-.078.078-.079.203.007.29l7.922 7.92-7.922 7.922c-.086.086-.085.212-.007.29l.73.73c.075.074.207.074.29-.008l7.92-7.921 7.922 7.921c.082.082.215.082.29.008l.73-.73c.077-.078.078-.204-.008-.29l-7.921-7.921z">
      </path>
    </svg>
  </div>
  <div class=content>
    <div class="names">
      <div class="label">公共号名称设置（输入公共号完整名称，以逗号分隔）</div>
      <div class="input">
        <textarea id="input-names" placeholder="输入评论区关键词，以逗号分隔" rows="6" cols="40" style="width: 99%; resize:none;"></textarea>
      </div>
    </div>
  </div>
  <div class="footer">
    <div class="confirm" id="confirm-button">保存</div>
  </div>
  </div>
  </div>
  `;

        const style = document.createElement("style");

        const heads = document.getElementsByTagName("head");

        style.setAttribute("type", "text/css");

        style.innerHTML = `
  .wrap {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  padding-top: 100px;
  font-family: "mp-quote", -apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif;
  }

  .dialog {
  width: 600px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  margin-left: auto;
  margin-right: auto;
  background-color: #fff;
  border-radius: 4px;
  padding: 30px;
  }

  .header {
  display: flex;
  align-items: center;
  }

  .title {
  color: #353535;
  font-size: 14px;
  line-height: 1.6;
  }

  .close {
  margin-left: auto;
  cursor: pointer;
  }

  .footer {
  display: flex;
  margin-top: 20px;
  }

  .confirm {
  margin-left: auto;
  cursor: pointer;
  font-weight: 400;
  line-height: 36px;
  height: 36px;
  font-size: 14px;
  letter-spacing: 0;
  border-radius: 4px;
  background-color: #07c160;
  color: #fff;
  min-width: 96px;
  text-align: center;
  }

  .names {
  margin-top: 20px;
  }

  .label {
  color: #353535;
  }

  .input {
  margin-top: 5px;
  }

  .permissions {
  margin-top: 20px;
  }

  .item {
  display: flex;
  padding: 20px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  color: #1a1b1c;
  font-size: 15px;
  align-items: center;
  }

  .permissions-name {}

  .permissions-switch {
  margin-left: auto;
  }

  label {
  display: block;
  vertical-align: middle;
  }

  label,
  input,
  select {
  vertical-align: middle;
  }

  .mui-switch {
  width: 52px;
  height: 31px;
  position: relative;
  border: 1px solid #dfdfdf;
  background-color: #fdfdfd;
  box-shadow: #dfdfdf 0 0 0 0 inset;
  border-radius: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-clip: content-box;
  display: inline-block;
  -webkit-appearance: none;
  user-select: none;
  outline: none;
  }

  .mui-switch:before {
  content: '';
  width: 29px;
  height: 29px;
  position: absolute;
  top: 0px;
  left: 0;
  border-radius: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  }

  .mui-switch:checked {
  border-color: #64bd63;
  box-shadow: #64bd63 0 0 0 16px inset;
  background-color: #64bd63;
  }

  .mui-switch:checked:before {
  left: 21px;
  }

  .mui-switch.mui-switch-animbg {
  transition: background-color ease 0.4s;
  }

  .mui-switch.mui-switch-animbg:before {
  transition: left 0.3s;
  }

  .mui-switch.mui-switch-animbg:checked {
  box-shadow: #dfdfdf 0 0 0 0 inset;
  background-color: #64bd63;
  transition: border-color 0.4s, background-color ease 0.4s;
  }

  .mui-switch.mui-switch-animbg:checked:before {
  transition: left 0.3s;
  }

  .mui-switch.mui-switch-anim {
  transition: border cubic-bezier(0, 0, 0, 1) 0.4s, box-shadow cubic-bezier(0, 0, 0, 1) 0.4s;
  }

  .mui-switch.mui-switch-anim:before {
  transition: left 0.3s;
  }

  .mui-switch.mui-switch-anim:checked {
  box-shadow: #64bd63 0 0 0 16px inset;
  background-color: #64bd63;
  transition: border ease 0.4s, box-shadow ease 0.4s, background-color ease 1.2s;
  }

  .mui-switch.mui-switch-anim:checked:before {
  transition: left 0.3s;
  }
  `;

        heads[0].append(style);
        document.getElementsByTagName("body")[0].append(dom);
    };
    let hasCreatDialog = false;
    const initData = () => {
        const inputNames = document.getElementById("input-names");
        console.log("ylog:409-fada3d-commentPattSetting", pubNames);
        if (pubNames) {
            inputNames.value = pubNames.join(",");
        } else {
            inputNames.value = "Rhino线下环境,Raptor线下P2告警,Raptor线下P1告警,Crane线下P1告警";
        }
    };

    const dialogOps = () => {
        if (!hasCreatDialog) {
            createDialog();
            hasCreatDialog = true;
        } else {
            const muliDialog = document.getElementById("mutli-dialog");
            muliDialog.hidden = false;
            initData();
            return;
        }
        const muliDialog = document.getElementById("mutli-dialog");
        const closeDialog = () => {
            muliDialog.hidden = true;
        };
        const closeButton = document.getElementById("close-icon");
        closeButton.addEventListener("click", closeDialog, false);

        const confirmButton = document.getElementById("confirm-button");

        const confirmDialogClick = async () => {
            const inputNames = document.getElementById("input-names");
            const names = inputNames.value
                .split(/[，,]/g)
                .map((item) => item.trim());
            console.log(names);
            GM_setValue(pubKey, names);
            muliDialog.hidden = true;
            hidePubs();
            location.reload();
        };

        confirmButton.addEventListener("click", confirmDialogClick, false);

        initData();
    };

    const hidePubs = () => {
        var pubNames = GM_getValue(pubKey);
        for (let pub in pubNames) {
            const style = 'li[class="item comp-session link pubchat not-notify unread"][title="' + pubNames[pub] + '"] {display:none;}';
            GM.addStyle(style);
        }
    }

    GM_registerMenuCommand("大象隐藏公共号设置", dialogOps);
    (function () {
        // Your code here...
        hidePubs();
        GM.addStyle('.download-pc-announcement-container {display:none}');
        GM.addStyle('.item.comp-session.link.collectchat.not-notify.unread {display:none}');
    })();
})();
})();