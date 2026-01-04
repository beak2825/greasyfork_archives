// ==UserScript==
// @name         高島屋便利ツール
// @namespace    TakashiamyaTools
// @version      0.13
// @description  便利になります
// @author       Me
// @license			 MIT
// @match        https://ecbo-origin.takashimaya.co.jp/admin/sitemap/CAdAdminHome.jsp
// @icon         https://www.google.com/s2/favicons?sz=64&domain=takashimaya.co.jp
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/446882/%E9%AB%98%E5%B3%B6%E5%B1%8B%E4%BE%BF%E5%88%A9%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/446882/%E9%AB%98%E5%B3%B6%E5%B1%8B%E4%BE%BF%E5%88%A9%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.getElementById("menu").onload = () => {
    const menu_frame = document.getElementById("menu");

    //左メニューにオリジナルリスト生成
    var leftMenuItem = document.createElement("div");
    leftMenuItem.classList.add("menu-cat", "menu-cat-origin");
    leftMenuItem.innerHTML =
      "<style>.u-dp__block{display:block !important;}</style><p class='UnselectedMenuItem'><i class='fa fa-li fa-pencil'></i>便利ツール設定</p><ul class='menugrp fa-ul' style='display:none'><li><a href='#' id='userIdChanger' class='UnselectedMenuItem'><i class='fa fa-sort-desc fa-rotate-270 fa-li'></i>ユーザーID変更</a></li><li><a href='#' id='toggleGaming' class='UnselectedMenuItem'><i class='fa fa-sort-desc fa-rotate-270 fa-li'></i>ゲーミングOnOff</a></li><li><a href='#' id='themeChanger' class='UnselectedMenuItem'><i class='fa fa-sort-desc fa-rotate-270 fa-li'></i>テーマカラー変更</a></li></ul>";
    var leftMenu = menu_frame.contentDocument.getElementById("Scroll");
    console.log(leftMenu);
    leftMenu.appendChild(leftMenuItem);

    menu_frame.contentDocument.getElementsByClassName("menu-cat-origin")[0].addEventListener("click", function () {
      console.log(this.children[1]);
      this.children[2].classList.toggle("u-dp__block");
    });

    //左メニューのユーザーID変更ボタンにイベント追加
    var userIdSetting = menu_frame.contentDocument.getElementById("userIdChanger");
    userIdSetting.addEventListener(
      "click",
      function () {
        var changingUserId = window.prompt("社員番号を入力してください");
        if (changingUserId != null) GM_setValue("userID", changingUserId);
      },
      false
    );

    //左メニューのゲーミングボタンにゲーミングヘッダーのトグルイベントを追加
    var toggleGaming = menu_frame.contentDocument.getElementById("toggleGaming");
    toggleGaming.addEventListener(
      "click",
      function () {
        if (!GM_getValue("gaming")) {
          GM_setValue("gaming", true);
          window.alert("次回読み込み時にヘッダーが元に戻ります");
        } else {
          GM_setValue("gaming", false);
          window.alert("次回読み込み時にヘッダーがキラキラします");
        }
      },
      false
    );

    //テーマカラー変更
    var themeChanger = menu_frame.contentDocument.getElementById("themeChanger");
    themeChanger.addEventListener(
      "click",
      function () {
        menu_frame.contentDocument.getElementById("selectColorPattern").style.display = "block";
      },
      false
    );
  };

  document.getElementById("center").onload = () => {
    const top_frame = document.getElementById("center");

    // ヘッダーがキラキラ光るかどうか
    var gamingCSS = "<style>.text1.HeadTitleFrame.gaming {background: linear-gradient(to right, Magenta, yellow, Cyan, Magenta) 0% center/200%;animation: gaming 2s linear infinite;} @keyframes gaming {100% { background-position-x: 200%; }}</style>";
    var headerTitle = top_frame.contentDocument.getElementsByClassName("HeadTitleFrame")[0];
    headerTitle.insertAdjacentHTML("afterbegin", gamingCSS);
    if (!GM_getValue("gaming")) {
      headerTitle.classList.add("gaming");
    } else {
      headerTitle.classList.remove("gaming");
    }

    // 画像スクリプト登録でURLのところがテキストエリアからインプットボックスに変わるやつ + focus
    const alltds = top_frame.contentDocument.getElementsByTagName("td");
    if (~top_frame.contentDocument.getElementsByClassName("TitleMiddle")[0].innerText.indexOf("画像スクリプト")) {
      for (var i = 0; i < alltds.length; i++) {
        if (alltds[i].firstElementChild) {
          if (alltds[i].firstElementChild.tagName == "TEXTAREA") {
            alltds[i].innerHTML = '<input name="Search_url" style="width: 100%; height: 26px" class="" maxlength="256" id="Search_url" type="text">';
            top_frame.contentDocument.getElementById("Search_url").focus();
            top_frame.contentDocument.getElementById("Search_url").value = "/include/shopping/";
          }
        }
      }
    }

    // リリース管理で自分の社員番号で絞り込んでくれる
    // const userId = 3568431;
    if (top_frame.contentWindow.document.getElementById("searchUpdateUserIdDsp")) {
      if (!GM_getValue("userID")) {
        var userId = window.prompt("社員番号を入れてください");
        GM_setValue("userID", userId);
      }

      top_frame.contentWindow.document.getElementById("searchUpdateUserIdDsp").value = GM_getValue("userID");
      top_frame.contentWindow.document.getElementById("0").checked = true;
      top_frame.contentWindow.document.getElementById("1").checked = true;
      top_frame.contentWindow.document.getElementById("2").checked = true;
      let a = top_frame.contentWindow.document.getElementsByClassName("search--btn");
      a[0].click();
    }

    top_frame.contentDocument.getElementsByName("list")[0].onload = () => {
      const list_frame = top_frame.contentDocument.getElementsByName("list")[0];

      // ページやモジュールが作成中かプレ環境か本番リリースか調べるやつ
      var statusList = list_frame.contentDocument.getElementsByClassName("status");

      // モジュール側のステータスはクラスが付いているが、ページ情報側ではステータスにクラスが付いていないので判断
      if (!statusList[0]) {
        var statusListPage = list_frame.contentDocument.getElementsByClassName("grid-column");
        for (var i = 0; i < statusListPage.length; i++) {
          if (statusListPage[i].textContent == "作成中") {
            statusListPage[i].style.backgroundColor = "#FFCDD2";
          } else if (statusListPage[i].textContent == "プレ環境リリース") {
            statusListPage[i].style.backgroundColor = "#B3E5FC";
          } else if (statusListPage[i].textContent == "本番環境リリース") {
            statusListPage[i].style.backgroundColor = "#C8E6C9";
          }
        }
      } else {
        for (var k = 0; k < statusList.length; k++) {
          if (statusList[k].textContent == "作成中") {
            statusList[k].style.backgroundColor = "#FFCDD2";
          } else if (statusList[k].textContent == "プレ環境リリース") {
            statusList[k].style.backgroundColor = "#B3E5FC";
          } else if (statusList[k].textContent == "本番環境リリース") {
            statusList[k].style.backgroundColor = "#C8E6C9";
          }
        }
      }

      // 表の表示範囲を拡大
      var table_1 = list_frame.contentDocument.getElementsByClassName("grid-body")[0];
      if (list_frame.contentDocument.getElementsByClassName("page_navigation01")[0] != null) {
        var table_2 = list_frame.contentDocument.getElementsByClassName("page_navigation01")[0].children[1];
        var navigation_buttons = list_frame.contentDocument.getElementsByClassName("page_navigation01")[0].children[3];
      }

      if (table_1 != null) table_1.style.maxHeight = "none";
      if (table_2 != null) table_2.style.maxHeight = "none";
      if (navigation_buttons != null) {
        navigation_buttons.style.position = "fixed";
        navigation_buttons.style.bottom = 0;
        navigation_buttons.style.width = "calc(100% - 80px)";
      }

      // 画像スクリプトの上書き・削除ボタンをfixed
    };
  };
})();
