// ==UserScript==
// @name               自动登录签到
// @name:en            Auto Login
// @description        网站自动登录，自动签到
// @description:en     Automatically login or sign in on each website.
// @namespace          https://github.com/HaleShaw
// @version            1.3.3
// @author             HaleShaw
// @copyright          2020+, HaleShaw (https://github.com/HaleShaw)
// @license            AGPL-3.0-or-later
// @homepage           https://github.com/HaleShaw/TM-AutoSign
// @supportURL         https://github.com/HaleShaw/TM-AutoSign/issues
// @contributionURL    https://www.jianwudao.com/
// @icon               https://www.itsk.com/favicon.ico
// @require            https://greasyfork.org/scripts/398010-commonutils/code/CommonUtils.js?version=781197
// @match              http*://*/plugin.php?id=*sign*
// @match              https://www.itsk.com/*
// @match              http*://www.52pojie.cn/*
// @match              https://mpyit.com/*
// @match              https://www.mpyit.com/*
// @match              https://pan.baidu.com/disk/home*
// @match              https://pan.xunlei.com/*
// @match              https://account.teambition.com/login*
// @compatible         Chrome
// @grant              unsafeWindow
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/389668/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/389668/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author             HaleShaw
// @collaborator       HaleShaw
// ==/OpenUserJS==

(function () {
  // IT天空
  const urlSk = "www.itsk.com";

  // 52破解
  const url52PoJie = "52pojie.cn";

  // 老殁
  const urlMpy = "mpyit.com";
  const author = "Hale";
  const email = "HaleShaw@163.com";
  let cipher = GM_getValue("cipher");

  // 百度
  const baidu = "https://pan.baidu.com/disk/home";

  // 迅雷
  const thunder = "https://pan.xunlei.com/";

  // Teambition
  const teambition = "https://account.teambition.com/login";

  // 签到内容
  const signText = "剑无道，自动签到！";

  // IT天空
  if (urlSk == location.host) {
    setTimeout(() => {
      let button = document.querySelector("div.user-info > div.user-footer > span:nth-child(1)");
      if (button && button.textContent.trim() == "签到") {
        button.click();
      }
    }, 1000);
    setTimeout(() => {
      let button = document.querySelector(".sign-res > button");
      if (button && button.textContent.trim() == "签到") {
        button.click();
      }
    }, 2000);
    return;
  }

  // 52破解
  else if (isURL(url52PoJie)) {
    document.getElementsByClassName("qq_bind")[0].click();
    return;
  }

  // 老殁
  else if (isURL(urlMpy)) {
    registerMenuCommand();
    removeADDialog();

    // 定位到“快速下载”
    window.location.hash = "#erphpdown";

    if (isValidByClassName("reply-to-read")) {
      const comment = document.querySelector("ol.commentlist>li:first-child>div");
      if (comment && comment.innerText.indexOf("您的评论正在等待审核中") == -1) {
        if (isValidById("author")) {
          document.getElementById("author").value = author;
        }
        if (isValidById("email")) {
          document.getElementById("email").value = email;
        }

        if (isValidById("comment")) {
          document.getElementById("comment").value = "谢谢分享！";

          if (isValidById("submit")) {
            document.getElementById("submit").click();
            setTimeout("window.location.reload()", 3000);
          }
        }
      }
    }

    let verify = document.getElementById("verifycode");
    if (verify) {
      verify.value = cipher;
      document.getElementById("verifybtn").click();
    }
    return;
  }

  // 百度
  else if (isURL(baidu)) {
    window.location.href = "https://pan.baidu.com/disk/main";
  }

  // 迅雷
  else if (isURL(thunder)) {
    const btns = document.querySelectorAll("p.login-btns > a");
    if (btns && btns.length > 0 && btns[0].textContent == "登录") {
      btns[0].click();
    }

    const BLOCKED_MESSAGES = [
      "该分享内容可能因为涉及侵权、色情、反动、低俗等信息，无法访问！",
      "抱歉，该分享已被作者删除",
    ];

    const shouldClosePage = () =>
      BLOCKED_MESSAGES.some(message => document.body.textContent.includes(message));

    setTimeout(() => {
      if (shouldClosePage()) {
        window.close();
      }
    }, 2000);
  }

  // Teambition
  else if (isURL(teambition)) {
    let button = document.querySelector("button");
    if (!button) {
      return;
    }
    if (button.textContent == "登录") {
      button.click();
    }
  }
  // 其他论坛
  else {
    if (isSignPage()) {
      sign();
      return;
    }
    sign2();
    return;
  }

  /**
   * Remove the dialog which reminding to close AD block plugin.
   */
  function removeADDialog() {
    let titles = document.querySelectorAll("h2");
    for (let i = 0; i < titles.length; i++) {
      if (titles[i].textContent.indexOf("广告拦截") != -1) {
        titles[i].parentElement.parentElement.remove();
        break;
      }
    }
  }
  /**
   * check url.
   * @param {String} url
   */
  function isURL(url) {
    return window.location.href.indexOf(url) != -1;
  }

  function sign(url) {
    let kxImg1 = document.getElementById("ch_s");
    let kxImg2 = document.getElementById("6ch_s");
    let todaySayTextArea = document.getElementById("todaysay");
    if (kxImg1 == null && kxImg2 == null) {
      return;
    }
    if (kxImg1 != null) {
      kxImg1.setAttribute("checked", true);
    }
    if (kxImg2 != null) {
      kxImg2.setAttribute("checked", true);
    }
    todaySayTextArea.value = signText;
    const button = document.getElementById("qiandao");
    button.submit();
    if (url != null) {
      window.location.href = url;
    }
    return;
  }

  function sign2() {
    if (document.getElementById("kx")) {
      document.getElementById("kx").click();
    }
    var todaySayTextArea = document.getElementById("todaysay");
    if (todaySayTextArea != null) {
      todaySayTextArea.value = signText;
    }
    try {
      unsafeWindow.showWindow("qwindow", "qiandao", "post", "0");
    } catch (err) {
      console.warn("AutoSign show window error!\n" + err);
    }
    return;
  }

  function isSignPage() {
    return window.find("今天签到了吗") && window.find("写下今天最想说的话");
  }

  function registerMenuCommand() {
    GM_registerMenuCommand("设置", () => {
      let cipherInput = prompt("请输入验证码", "");
      GM_setValue("cipher", cipherInput);
      cipher = cipherInput;
    });
  }
})();
