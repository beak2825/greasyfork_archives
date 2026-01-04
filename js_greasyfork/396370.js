// ==UserScript==
// @name         Kater Tools
// @namespace    -
// @version      0.7.0
// @description  切換界面語系，覆寫「@某人」的連結（避免找不到資源的錯誤），用 UID 取得可標註其他使用者的文字、使用者頁面貼文排序、使用者頁面討論排序與搜尋
// @author       LianSheng

// @include      https://kater.me/*
// @include      /^https?:\/\/.+?\/kater-tools\/setting\//
// @exclude      https://kater.me/api/*
// @exclude      https://kater.me/assets/*

// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_info

// @run-at       document-start
// @noframes

// @require      https://greasyfork.org/scripts/402133-toolbox/code/Toolbox.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/pikaday/1.6.0/pikaday.min.js
// @require      https://unpkg.com/vanilla-picker@2

// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/396370/Kater%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/396370/Kater%20Tools.meta.js
// ==/UserScript==

// v0.6.0 識別
let identification = `if (window._KT) { _KT["kater.tools"] = GM_info.script.version;} else { window._KT = {"kater.tools": "${GM_info.script.version}"}}`;
addScript(identification, "head");

const _setting = {
  open02overwrite: GM_getValue("s0.2-overwriteUserMention", true),
  open03mention: GM_getValue("s0.3-mentionUserById", true),
  open05post: GM_getValue("s0.5-postSort", true),
  open05discussion: GM_getValue("s0.5-discussionSort", true),
  open06toolbar: GM_getValue("s0.6-customToolbar", true),
};

let _prop = {
  p06defaultColor: GM_getValue("p0.6-defaultToolbarColor", "#e0b5ff"),
};

(function () {
  // v0.5.23 新增，選擇結束日期自動加一天
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  // 更改界面語系 (v0.1)
  function changeLang() {
    let nowLang = app.data.locale;
    let selectLang = (nowLang == "en") ? "zh-hant" : "en";
    let yourUID = app.session.user.data.id;
    let dataObj = {
      "data": {
        "type": "users",
        "id": yourUID,
        "attributes": {
          "preferences": {
            "locale": selectLang
          }
        }
      }
    };

    let option = {
      body: JSON.stringify(dataObj),
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'x-csrf-token': app.session.csrfToken,
        'x-http-method-override': 'PATCH'
      },
      method: 'POST'
    }

    fetch(`https://kater.me/api/users/${yourUID}`, option).then(function (response) {
      let status = response.status;
      if (status == 200) {
        location.reload(true);
      } else {
        console.log(`Locale change failed: status code ${status}`);
        alert(`切換語系失敗，請重試。\nStatus code = ${status}`);
      }
    });
  }

  // 覆寫提及使用者連結 (v0.2) (二改於 v0.5.22，判斷 app.store.data.users 是否已存在資料，減少請求送出，感謝大杯鮮奶茶)
  // Ref: https://api.flarum.dev/js/v0.1.0-beta.8/class/src/common/Store.js~Store.html#instance-method-find
  function overwriteUserMention(node) {
    let name = decodeURI(node.href).replace("https://kater.me/u/", "");
    let storeUser = Object.values(app.store.data.users).find(x => x.data.attributes.displayName === name);
    if (storeUser) {
      node.href = `https://kater.me/u/${storeUser.data.id}`;
    } else {
      app.store.find("users", {
        filter: {
          q: name
        },
        page: {
          limit: 1
        }
      }).then(x => {
        node.href = `https://kater.me/u/${x[0].data.id}`;
      });
    }
    node.classList.add("overwrited");
  }

  // 用 UID 提及使用者 (v0.3)
  // v0.5.26 解決貼上問題，刪除 ClipboardJS 的引用，由點擊或是 enter 事件觸發。
  let isOpen = true;
  let lastSearch = -1;

  function mentionUserById(uid) {

    // 從游標位置插入文字
    function insertAtCursor(textarea, value) {
      let startPos = textarea.selectionStart;
      let endPos = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, startPos) +
        value +
        textarea.value.substring(endPos, textarea.value.length);

      textarea.selectionEnd = endPos + value.length;
      textarea.dispatchEvent(new Event("input"));
    }

    // 選擇要標註的使用者
    function userSelected(name) {
      let textarea = document.querySelector("textarea.FormControl.Composer-flexible");
      insertAtCursor(textarea, `@${name} `);

      textarea.focus();
    }

    if (isOpen) {
      isOpen = false;

      let display = document.querySelector("div#us_display");
      let input = document.querySelector("input#us_searchUid")
      let result = document.querySelector("div#us_result");
      let result_avatar = document.querySelector("div#us_resultAvatar");
      let result_name = document.querySelector("div#us_resultName");

      fetch(`https://kater.me/api/users/${uid}`).then(function (response) {
        return response.json();
      }).then(function (json) {
        let avatar = json.data.attributes.avatarUrl;
        let avatar_exist = (typeof avatar != typeof null);
        let name = json.data.attributes.displayName;

        if (avatar_exist) {
          result_avatar.style.background = `url("${avatar}")`;
          result_avatar.style.backgroundSize = "contain";
        } else {
          result_avatar.style.background = "#ccc";
        }

        result_name.innerText = `(${uid}) ${name}`;

        result.onclick = () => {
          userSelected(name);
          input.value = "";
          display.style.display = "none";
        }
        input.onkeydown = e => {
          if (e.keyCode == 13) {
            userSelected(name);
            input.value = "";
            display.style.display = "none";
          }
        }

        isOpen = true;

        if (lastSearch >= 0 && lastSearch != uid) {
          let uid = lastSearch;
          lastSearch = -1;
          mentionUserById(uid);
        }
      });
    } else {
      lastSearch = uid;
    }
  }

  // 個人頁面排序貼文 (v0.5.5) (以原生方式改寫於 v0.5.15，感謝大杯鮮奶茶)
  function postSort(uid, sort, sortField, offset = 0) {
    app.store.find("posts", {
      filter: {
        user: uid,
        type: "comment"
      },
      page: {
        offset: offset,
        limit: 20
      },
      sort: sort
    }).then(function (x) {
      [].push.apply(app.current.posts, x);
      m.redraw(); //剛沒注意到lazyRedraw()會造成畫面卡住...
    });
  }

  // 個人頁面排序貼文 - 選項 (v0.5.5)
  function insertPostOpt() {
    let optionTop = `
      <div id="us_userPageOptionTop" style="margin-bottom: 1rem;">
        <div class="ButtonGroup Dropdown dropdown itemCount6">
          <button class="Dropdown-toggle Button" data-toggle="dropdown" aria-expanded="false">
            <span class="Button-label">最新</span>
            <i class="icon fas fa-caret-down Button-caret"></i>
          </button>
          <ul class="Dropdown-menu dropdown-menu">
            <li class="">
              <button active="true" class="hasIcon" type="button" data-sort="latest">
                <i class="icon fas fa-check Button-icon"></i>
                <span class="Button-label">最新</span>
              </button>
              <button class="hasIcon" type="button" data-sort="oldest">
                <span class="Button-label">最舊</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    `;
    let optionBottom = `
      <div id="us_userPageOptionBottom" style="text-align: center;">
        <button class="Button" type="button">
          <span class="Button-label">載入更多</span>
        </button>
      </div>
    `;

    addHTML(optionTop, "div.sideNavContainer div.PostsUserPage", "afterbegin");
    addHTML(optionBottom, "div.sideNavContainer div.PostsUserPage", "beforeend");

    // 隱藏原生按鈕（載入更多）
    try {
      document.querySelector("div.PostsUserPage-loadMore").style.display = "none";
    } catch (e) {}

    // 上選單點擊事件
    let sortField = {
      latest: {
        link: "-createdAt",
        name: "最新"
      },
      oldest: {
        link: "createdAt",
        name: "最舊"
      }
    };
    let uid = app.current.data.user.data.id;
    let sortList = document.querySelectorAll("div#us_userPageOptionTop ul button");
    let selected = document.querySelector("div#us_userPageOptionTop button.Dropdown-toggle > span");

    sortList.forEach(function (each) {
      each.addEventListener("click", function (e) {
        let sort = each.getAttribute("data-sort");
        let originActive = document.querySelector("div#us_userPageOptionTop ul button[active=true]");
        originActive.removeAttribute("active");
        originActive.querySelector("i").remove();
        each.setAttribute("active", "true");
        each.insertAdjacentHTML("afterbegin", `<i class="icon fas fa-check Button-icon"></i>`);
        selected.innerText = sortField[sort]["name"];

        app.current.posts = []; //加上這個在切換排序方式時清空原本儲存的陣列，不然會出現新的貼文接著舊的貼文...
        postSort(uid, sortField[sort]["link"], sortField);
      })
    });
    // 上選單點擊事件 結束

    // 載入更多按鈕點擊事件
    let moreButton = document.querySelector("div#us_userPageOptionBottom button");
    let list = document.querySelector("ul.PostsUserPage-list");
    list.setAttribute("data-offset", "0");
    moreButton.addEventListener("click", function (e) {
      let sort = document.querySelector("div#us_userPageOptionTop ul button[active=true]").getAttribute("data-sort");
      let offset = parseInt(list.getAttribute("data-offset")) + 20;
      list.setAttribute("data-offset", offset);

      postSort(uid, sortField[sort]["link"], sortField, offset);
    });

  }

  // 個人頁面排序討論 (v0.5.6)
  let sortField = {
    latest: {
      link: "-createdAt",
      name: "最新討論"
    },
    oldest: {
      link: "createdAt",
      name: "最舊討論"
    },
    latestPost: {
      link: "-lastPostedAt",
      name: "近期回覆"
    },
    oldestPost: {
      link: "lastPostedAt",
      name: "考古專用"
    },
    maxCount: {
      link: "-commentCount",
      name: "最多回覆"
    },
    minCount: {
      link: "commentCount",
      name: "乏人問津"
    },
  };

  // 個人頁面排序討論 (v0.5.6)
  function discussionSort(offset = 0) {
    message("正在處理請求...", 1);

    let tags = JSON.parse(document.querySelector("button#us_tagFilter").getAttribute("data-tags"));
    let tagString = "";
    tags.forEach(function (tag) {
      tagString += `tag:${app["store"]["data"]["tags"][tag]["data"]["attributes"]["slug"]} `;
    });

    let dateStart = document.querySelector("div#us_dateStart > input").getAttribute("data-date");
    let dateEnd = document.querySelector("div#us_dateEnd > input").getAttribute("data-date");
    let search = document.querySelector("div#us_userPageOptionTop input[type=search]").value;
    let sortName = document.querySelector("div#us_userPageOptionTop ul button[active=true]").getAttribute("data-sort");
    let sort = sortField[sortName]["link"];
    let uid = app.current.data.user.data.id;
    let name = app.current.data.user.data.attributes.username;

    let url = `https://kater.me/api/discussions?filter[user]=${uid}&filter[q]=${tagString}${search} author:${name} created:${dateStart}..${dateEnd}&sort=${sort}&page[offset]=${offset}`;

    let list = document.querySelector("ul.DiscussionList-discussions");
    list.setAttribute("data-offset", offset);
    list.setAttribute("data-search", search);

    fetch(url).then(function (response) {
      return response.json();
    }).then(function (json) {
      // 資料預處理
      json["users"] = {};
      json["tags"] = {};
      json["posts"] = {};

      // 當返回資料爲空時
      if (json.included === undefined) {
        console.log("[Kater Tools] 請求已完成，沒有符合資料");
        message("請求已完成，沒有符合資料", 0);
        return;
      }

      json.included.forEach(function (each) {
        switch (each.type) {
          case "users":
            try {
              json["users"][each.id] = {};
              json["users"][each.id]["attributes"] = each.attributes;
            } catch (e) {}
            break;
          case "tags":
            try {
              json["tags"][each.id] = {};
              json["tags"][each.id]["attributes"] = each.attributes;
            } catch (e) {}
            break;
          case "posts":
            try {
              json["post"][each.id] = {};
              json["post"][each.id]["attributes"] = each.attributes;
              json["post"][each.id]["relationships"] = each.relationships;
            } catch (e) {}
            break;
        }
      });

      // 資料預處理 結束

      if (offset == 0) {
        list.innerHTML = "";
      }

      json.data.forEach(function (discussion) {
        let tags = "";
        let follow = "";
        let recipient = "";

        discussion.relationships.tags.data.forEach(function (tag) {
          tags += `
            <span class="TagLabel colored" style="color: ${json["tags"][tag.id]["attributes"]["color"]}; background-color: ${json["tags"][tag.id]["attributes"]["color"]};">
              <span class="TagLabel-text">
                <i class="icon ${json["tags"][tag.id]["attributes"]["icon"]} "></i> 
                ${json["tags"][tag.id]["attributes"]["name"]}
              </span>
            </span>
          `;
        });

        if (discussion.relationships.user.data.length > 0) {
          discussion.relationships.user.data.forEach(function (user) {
            recipient += `
              <span class="RecipientLabel">
                <span class="RecipientLabel-text">
                  <span class="username">${json["users"][user.id]["attributes"]["username"]}</span>
                </span>
              </span>
            `;
          });
        }

        if (discussion.attributes.subscription != undefined && discussion.attributes.subscription == "follow") {
          follow = `          
            <ul class="DiscussionListItem-badges badges">
            <li class="item-subscription"><span class="Badge Badge--following " title="" data-original-title="關注"><i
                  class="icon fas fa-star Badge-icon"></i></span></li>
            </ul>
          `;
        }

        list.innerHTML += `
          <li data-id="${discussion.id}">
            <div class="DiscussionListItem">
              <div class="ButtonGroup Dropdown dropdown DiscussionListItem-controls itemCount4">

                <!-- 我就爛 0u0b -->
                <!--<button class="Dropdown-toggle Button Button--icon Button--flat Slidable-underneath Slidable-underneath--right"
                  data-toggle="dropdown"><i class="icon fas fa-ellipsis-v Button-icon"></i><span
                    class="Button-label"></span><i class="icon fas fa-caret-down Button-caret"></i></button>-->
                <!--<ul class="Dropdown-menu dropdown-menu ">
                  <li class="item-subscription"><button class=" hasIcon" type="button" title="取消關注"><i
                        class="icon far fa-star Button-icon"></i><span class="Button-label">取消關注</span></button>
                  </li>
                  <li class="Dropdown-separator"></li>
                  <li class="item-rename"><button class=" hasIcon" type="button" title="重命名"><i
                        class="icon fas fa-pencil-alt Button-icon"></i><span
                        class="Button-label">重命名</span></button></li>
                  <li class="item-tags"><button class=" hasIcon" type="button" title="編輯節點"><i
                        class="icon fas fa-tag Button-icon"></i><span class="Button-label">編輯節點</span></button></li>
                </ul>-->

              </div><a class="Slidable-underneath Slidable-underneath--left Slidable-underneath--elastic disabled"><i
                  class="icon fas fa-check "></i></a>
              <div class="DiscussionListItem-content Slidable-content read"><a href="/u/${discussion.relationships.user.data.id}" class="DiscussionListItem-author"
                  title="${json["users"][discussion.relationships.user.data.id]["attributes"]["username"]} 發佈於 ${datetimeFormat(discussion.attributes.createdAt)}"><img class="Avatar "
                    src="${json["users"][discussion.relationships.user.data.id]["attributes"]["avatarUrl"]}"></a>
                ${follow}                           
                <a href="/d/${discussion.id}" class="DiscussionListItem-main">
                  <h3 class="DiscussionListItem-title">${discussion.attributes.title}</h3>
                  <ul class="DiscussionListItem-info">
                    <li class="item-tags gamification">
                      <span class="TagsLabel">
                        ${tags}
                      </span>
                    </li>
                    <li class="item-recipients">
                      <span class="RecipientsLabel ">${recipient}</span>
                    </li>
                    <li class="item-discussion-votes"><span class="DiscussionListItem-votes" title="點讚"><i
                          class="icon far fa-thumbs-up "></i>${discussion.attributes.votes}</span></li>
                    <li class="item-discussion-views">${discussion.attributes.views}</li>
                  </ul>
                </a><span class="DiscussionListItem-count" title="">${discussion.attributes.commentCount}</span>
              </div>
            </div>
          </li>
        `;
      });

      message("請求已完成", 0);
    }).catch(function (e) {
      message("取得資料時遇到錯誤！", 2);
      console.error(e);
    });
  }

  // 個人頁面排序討論 - 選項 (v0.5.6)
  function insertDiscussionOpt() {

    let tagTable = `<table id="us_tagsTable" style="background-color: #333;">`;
    let tableCount = 1;
    let columns = 6;
    for (let [key, tag] of Object.entries(app.store.data.tags)) {
      if (tableCount == 1) {
        tagTable += "<tr>";
      }
      let color = (tag.data.attributes.color == "") ? "#333" : tag.data.attributes.color;

      tagTable += `
        <td style="width: calc(100% / ${columns}); user-selct: none; cursor: pointer;" data-tag="${key}">
          <span class="TagsLabel" style="display: inline-block; width: 100%;">
            <span class="TagLabel colored" style="color: ${color}; background-color: ${color}; opacity: 0.35; width: calc(100% - 8px); margin: 2px 4px;">
              <span class="TagLabel-text" style="text-overflow: ellipsis; width: 100%; display: block; overflow: hidden; white-space: nowrap; color: #fff !important">
                <i class="icon ${tag.data.attributes.icon}"></i> 
                ${tag.data.attributes.name}
              </span>
            </span>
          </span>
        </td>
      `;
      if (tableCount == columns) {
        tagTable += "</tr>";
        tableCount = 1;
      } else {
        tableCount++;
      }
    }
    tagTable += "</table>";

    let sortButton = `
      <button active="true" class="hasIcon" type="button" data-sort="latest">
        <i class="icon fas fa-check Button-icon"></i>
        <span class="Button-label">最新討論</span>
      </button>
    `;
    for (let [key, button] of Object.entries(sortField)) {
      if (key == "latest") {
        continue;
      } else {
        sortButton += `
          <button class="hasIcon" type="button" data-sort="${key}">
            <span class="Button-label">${button.name}</span>
          </button>
        `;
      }
    }

    let optionTop = `
      <div id="us_userPageOptionTop" style="margin-bottom: 1rem;">
        
        <!-- 篩選節點 -->
        <div class="ButtonGroup Dropdown dropdown itemCount2" style="vertical-align: initial;">
          <button id="us_tagFilter" class="Dropdown-toggle Button" data-tags="[]" data-toggle="dropdown" aria-expanded="false">
            <span class="Button-label">篩選節點</span>
            <i class="icon fas fa-caret-down Button-caret"></i>
          </button>
          <ul class="Dropdown-menu dropdown-menu" style="width: 500px;">
            <li>
              ${tagTable}
            </li>
            <li>
              <button id="us_tagFilterRun" type="button">
                <span class="Button-label" style="color: orange; font-weight: bold; font-size: 1.5rem; padding-left: calc(50% - 1.5rem);">篩選</span>
              </button>
            </li>
          </ul>
        </div>

        <!-- 排序依據 -->
        <div class="ButtonGroup Dropdown dropdown itemCount2" style="vertical-align: initial; padding-left: 1rem;">
          <button id="us_sort" class="Dropdown-toggle Button" data-toggle="dropdown" aria-expanded="false">
            <span class="Button-label">最新討論</span>
            <i class="icon fas fa-caret-down Button-caret"></i>
          </button>
          <ul class="Dropdown-menu dropdown-menu">
            <li>
              ${sortButton}
            </li>
          </ul>
        </div>

        <!-- 搜尋文字 -->
        <div class="Search" style="display: inline-block; padding-left: 1rem;">
          <div class="Search-input">
            <input class="FormControl" type="search" placeholder="搜尋" title="不能搜尋英文數字跟冒號，避免觸發系統搜尋問題" style="width: 8rem;">
          </div>
        </div>

        <!-- 搜尋日期區間 -->
        <div class="Search" style="display: inline-block; padding-left: 1rem;">
          <div id="us_dateStart" class="Search-input">
            <input class="FormControl" placeholder="起始日期" style="width: 9rem;">  
          </div>
        </div>
        <div class="Search" style="display: inline-block; padding-left: 1rem;">
          <div id="us_dateEnd" class="Search-input">
            <input class="FormControl" placeholder="結束日期" style="width: 9rem;">
          </div>
        </div>
      </div>
    `;
    let optionBottom = `
      <div id="us_userPageOptionBottom" style="text-align: center;">
        <button class="Button" type="button">
          <span class="Button-label">載入更多</span>
        </button>
      </div>
    `;

    addHTML(optionTop, "div.sideNavContainer div.DiscussionsUserPage", "afterbegin");
    addHTML(optionBottom, "div.sideNavContainer div.DiscussionsUserPage", "beforeend");

    // Pikaday 日期選擇器
    // 我不太會用 Pikaday 的初始化選項，某些目的只好硬幹
    let dateStart = document.querySelector("div#us_dateStart > input");
    let dateEnd = document.querySelector("div#us_dateEnd > input");
    let dateNowObj = new Date();

    new Pikaday({
      field: dateStart,
      format: 'YYYY-MM-DD',
      setDefaultDate: true,
      defaultDate: new Date("2019-10-17"),
      minDate: new Date("2019-10-17"),
      maxDate: dateNowObj,
      i18n: {
        previousMonth: '上月',
        nextMonth: '下月',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
      },
      onSelect: function () {
        let date = datetimeFormat(Date.parse(this._d), true);
        dateStart.value = date;
        dateStart.setAttribute("data-date", date);
        discussionSort();
      }
    });

    new Pikaday({
      field: dateEnd,
      format: 'YYYY-MM-DD',
      setDefaultDate: true,
      defaultDate: dateNowObj.addDays(1),
      minDate: new Date("2019-10-17"),
      maxDate: dateNowObj,
      i18n: {
        previousMonth: '上月',
        nextMonth: '下月',
        months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
      },
      onSelect: function () {
        let date = new Date(this._d);
        date = datetimeFormat(date.addDays(1), true);
        dateEnd.value = date;
        dateEnd.setAttribute("data-date", date);
        discussionSort();
      }
    });

    dateStart.value = "";
    dateEnd.value = "";
    dateStart.setAttribute("data-date", "2019-10-17");
    dateEnd.setAttribute("data-date", datetimeFormat(Date.parse(dateNowObj.addDays(1)), true));

    // Pikaday 日期選擇器 結束


    // 隱藏原生按鈕（載入更多）
    try {
      document.querySelector("div.DiscussionList-loadMore").style.display = "none";
    } catch (e) {}

    // 上選單：篩選節點點擊事件
    let tagButtons = document.querySelectorAll("table#us_tagsTable td");
    let runButton = document.querySelector("button#us_tagFilterRun");
    let tagSelected = document.querySelector("div#us_userPageOptionTop #us_tagFilter");
    let tagArea = document.querySelector("table#us_tagsTable");

    // 避免點擊導致跳開
    tagArea.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    // 執行篩選
    runButton.addEventListener("click", function (e) {
      discussionSort();
    });

    // 個別 tag 按鈕
    tagButtons.forEach(function (tagTd) {
      tagTd.addEventListener("click", function (e) {
        let button = tagTd.querySelector("span.TagLabel.colored");
        let id = parseInt(tagTd.getAttribute("data-tag"));
        let selected = JSON.parse(tagSelected.getAttribute("data-tags"));

        if (selected.includes(id)) {
          // 若已選
          let index = selected.indexOf(id);
          selected.splice(index, 1);
          button.style.opacity = "0.35";
        } else {
          // 若未選
          selected.push(id);
          button.style.opacity = "1";
        }

        tagSelected.setAttribute("data-tags", JSON.stringify(selected));
      });
    });

    // 上選單：篩選節點點擊事件 結束

    // 上選單：排序點擊事件
    let sortList = document.querySelector("button#us_sort").parentNode.querySelectorAll("ul button");
    let selected = document.querySelector("div#us_userPageOptionTop #us_sort > span");

    sortList.forEach(function (each) {
      each.addEventListener("click", function (e) {
        let sort = each.getAttribute("data-sort");
        let originActive = document.querySelector("div#us_userPageOptionTop ul button[active=true]");
        originActive.removeAttribute("active");
        originActive.querySelector("i").remove();
        each.setAttribute("active", "true");
        each.insertAdjacentHTML("afterbegin", `<i class="icon fas fa-check Button-icon"></i>`);
        selected.innerText = sortField[sort]["name"];

        discussionSort();
      })
    });
    // 上選單：排序點擊事件 結束

    // 搜尋框事件 
    let searchInput = document.querySelector("div#us_userPageOptionTop input[type=search]");
    let list = document.querySelector("ul.DiscussionList-discussions");
    searchInput.addEventListener("keyup", function (e) {
      searchInput.value = searchInput.value.replace(/[a-zA-Z0-9:]/g, "");

      // Enter
      if (e.keyCode === 13) {
        discussionSort();
      }
    });


    // 載入更多按鈕點擊事件
    let moreButton = document.querySelector("div#us_userPageOptionBottom button");
    list.setAttribute("data-offset", "0");
    moreButton.addEventListener("click", function (e) {
      let offset = parseInt(list.getAttribute("data-offset")) + 20;
      discussionSort(offset);
    });
  }

  // 文章編輯器快速選項 - 選項 (v0.6)
  function insertEditorToolbarOpt(customArea) {
    const textarea = document.querySelector("textarea.FormControl.Composer-flexible");

    // 通用：從游標位置插入文字
    function insertAtCursor(value) {
      let startPos = textarea.selectionStart;
      let endPos = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, startPos) +
        value +
        textarea.value.substring(endPos, textarea.value.length);

      textarea.selectionEnd = endPos + value.length;
      textarea.dispatchEvent(new Event("input"));
    }

    // 通用：偏移游標位置
    function setCursorPositionByOffset(offset) {
      let cursorPos = textarea.selectionStart;
      let targetPos = cursorPos + offset;
      textarea.focus();
      textarea.setSelectionRange(targetPos, targetPos);
    }

    // 通用：根據游標位置取得前後偏移範圍文字
    function getRangeTextByOffset(offsetStart, offsetEnd) {
      let cursorPos = textarea.selectionStart;
      return textarea.value.substring(cursorPos + offsetStart, cursorPos + offsetEnd);
    }

    // 通用：根據游標位置取得前後偏移範圍文字並刪除
    function delRangeTextByOffset(offsetStart, offsetEnd) {
      let cursorPos = textarea.selectionStart;
      textarea.value = textarea.value.substring(0, cursorPos + offsetStart) + textarea.value.substring(cursorPos + offsetEnd, textarea.value.length);
      textarea.dispatchEvent(new Event("input"));
    }

    // 通用：取得選取文字
    function getSeletion() {
      let startPos = textarea.selectionStart;
      let endPos = textarea.selectionEnd;
      let seletion = textarea.value.substring(startPos, endPos);

      return seletion;
    }

    // 通用：在選取文字前後分別加上文字並將全體選取
    function insTextBySeletion(startText, endText) {
      let startPos = textarea.selectionStart;
      let endPos = textarea.selectionEnd;
      let seletion = textarea.value.substring(startPos, endPos);
      textarea.value = textarea.value.substring(0, startPos) +
        startText + seletion + endText +
        textarea.value.substring(endPos, textarea.value.length);

      textarea.dispatchEvent(new Event("input"));

      let newStartPos = startPos;
      if (newStartPos < 0) newStartPos = 0;
      let newEndPos = endPos + startText.length + endText.length;
      if (newEndPos > textarea.value.length) newEndPos = textarea.value.length;

      if (textarea.setSelectionRange) {
        textarea.focus();
        textarea.setSelectionRange(newStartPos, newEndPos);
      } else if (textarea.createTextRange) {
        var range = textarea.createTextRange();
        range.collapse(true);
        range.moveEnd('character', newEndPos);
        range.moveStart('character', newStartPos);
        range.select();
      }
    }


    // 功能：刪除線
    function f_stroke() {
      if (getSeletion() != "") {
        let match = getSeletion().match(/~~(.+?)~~/);
        if (match) {
          insertAtCursor(match[1]);
        } else {
          insTextBySeletion("~~", "~~");
        }
      } else {
        if (getRangeTextByOffset(-2, 2) == "~~~~") {
          delRangeTextByOffset(-2, 2);
        } else {
          insertAtCursor("~~~~");
          setCursorPositionByOffset(-2);
        }
      }
    }

    // 功能：用網址插入圖片
    function f_img() {
      if (getSeletion() != "") {
        let match = getSeletion().match(/\[img\ ?.+?\](.+?)\[\/img\]/);
        if (match) {
          insertAtCursor(match[1]);
        } else {
          insTextBySeletion("[img width=]", "[/img]");
        }
      } else {
        if (getRangeTextByOffset(-12, 6) == "[img width=][/img]") {
          delRangeTextByOffset(-12, 6);
        } else {
          insertAtCursor("[img width=][/img]");
          setCursorPositionByOffset(-6);
        }
      }
    }

    // 功能：調色盤
    function f_palette(hex) {
      if (getSeletion() != "") {
        let match = getSeletion().match(/\[color=(.+?)\](.+?)\[\/color\]/);
        if (match) {
          if (hex == match[1]) {
            insertAtCursor(match[2]);
          } else {
            insertAtCursor(`[color=${hex}]${match[2]}[/color]`);
          }
        } else {
          insTextBySeletion(`[color=${hex}]`, "[/color]");
        }
      } else {
        if (getRangeTextByOffset(-17, 8).match(/\[color=#[0-9a-f]{8}\]\[\/color\]/)) {
          delRangeTextByOffset(-17, 8);
        } else {
          insertAtCursor(`[color=${hex}][/color]`);
          setCursorPositionByOffset(-8);
        }
      }
    }

    let customColor = _prop["p06defaultColor"];
    let html = `
      <!-- v0.7.0 刪除線功能已存在於原生介面，故移除 -->
      <button id="us06_img" class="Button Button--icon Button--link" title="用網址插入圖片"><i class="fas fa-image" style="color: ${customColor};"></i></button>
      <button id="us06_palette" class="Button Button--icon Button--link" title="調色盤"><i class="fas fa-palette" style="color: ${customColor};"></i></button>
    `;
    customArea.innerHTML = html;

    customArea.querySelector("#us06_img").onclick = f_img;

    textarea.insertAdjacentHTML("beforebegin", `<li id="us06_placeholder" style="list-style-type: none; bottom: 20px"></li>`);
    let placeholder = document.querySelector("#us06_placeholder");
    let picker = new Picker(placeholder);
    picker.onDone = color => {
      f_palette(color.hex);
    };
    customArea.querySelector("#us06_palette").onclick = () => {
      placeholder.click();
    };


    if (_setting["open03mention"]) {
      let id = setInterval(() => {
        if (document.querySelectorAll("button#us_tagByUid").length > 0) {
          let btn03 = document.querySelector("button#us_tagByUid");
          customArea.appendChild(btn03);
          clearInterval(id);
        }
      }, 100);
    }
  }


  // timestamp -> YYYY-MM-DD[ HH:mm:ss]
  function datetimeFormat(timeString, dateOnly = false) {
    let d = new Date(timeString);
    let yyyy = d.getFullYear();
    let MM = `0${d.getMonth()+1}`.substr(-2);
    let dd = `0${d.getDate()}`.substr(-2);
    let hh = `0${d.getHours()}`.substr(-2);
    let mm = `0${d.getMinutes()}`.substr(-2);
    let ss = `0${d.getSeconds()}`.substr(-2);
    let result = "";

    if (dateOnly) {
      result = `${yyyy}-${MM}-${dd}`;
    } else {
      result = `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
    }

    return result;
  }

  // 訊息框，採用原生樣式 (Alert)，只是放到右上角
  // 0 綠色、1 黃色、2 紅色
  let expireMsg = {};

  function message(msg, type = 0) {
    let typeField = ["success", "warning", "error"];
    let randomID = Math.random().toString(36).substr(2, 6);

    let block = `
      <div id="us_messageBlock" data-id="${randomID}" class="AlertManager">
        <div class="AlertManager-alert">
          <div class="Alert Alert--${typeField[type]}" style="position: fixed; top: 2rem; right: 2rem; width: 16rem;">
            <span class="Alert-body">${msg}</span>
          </div>
        </div>
      </div>
    `;

    addHTML(block, "div#us_messageArea", "beforeend");

    // 不能使用 setTimeout 或 setInterval （會卡死其他部件）
    // 而此類腳本也不便於利用 worker
    // 只好在下方 main function 輪詢物件 expireMsg
    expireMsg[randomID] = Date.now() + 2000;
  }

  //-------- MAIN --------//
  (function () {
    'use strict';

    if (location.host == "kater.me") {
      // v0.1: 切換語言
      GM_registerMenuCommand("切換語言", function () {
        changeLang();
      });

      // v0.2: 覆寫提及使用者連結
      if (_setting["open02overwrite"]) {
        setInterval(function () {
          let match_nodes = document.querySelectorAll("a.UserMention:not(.overwrited)");
          if (match_nodes.length > 0) {
            match_nodes.forEach(function (node) {
              overwriteUserMention(node);
            });
          }
        }, 100);
      }

      // v0.3: 用 UID 提及使用者（與原生選單共存）
      if (_setting["open03mention"]) {
        let max_uid = 0;
        fetch("https://kater.me/api/users?sort=-joinedAt&page[limit]=1").then(function (response) {
          return response.json();
        }).then(function (json) {
          max_uid = json.data[0].id;
        }).then(function () {
          setInterval(function () {
            // 撰寫貼文框的下方功能列
            let nodes = document.querySelectorAll("li.TextEditor-toolbar");
            if (nodes.length > 0) {
              let node = nodes[0];
              let display, button;
              // 自定義搜尋框
              if (document.querySelectorAll("div#us_display").length == 0) {
                let appendDisplay = `<div id="us_display" style="cursor: pointer; user-select: none; display: inline-block; width: 10rem; min-width: 200px;max-width: 200px; border: 2px solid #333; border-radius: 4px; position: relative; bottom: 0; right: 0; z-index: 9999; background: #eee;"><div style="border-bottom: 1px solid #000; text-align: center; user-select: none; background: #e88; font-weight: bold;">用 UID 搜尋要標註的人</div><div><input id="us_searchUid" style="width: 100%; text-align: center; color: #000;"></div><div id="us_result"><table><tr><td><div id="us_resultAvatar" style="height: 2rem; width: 2rem; display: inline-block; margin: 0.5rem; border-radius: 100px; background: #ccc; background-size: contain;"></div></td><td><div id="us_resultName" style="width: calc(100% - 3rem); display: inline-block; color: #000;">Username</div></td></tr></table></div><input id="us_hiddenInput" style="display: none;"></div>`;
                if (document.querySelectorAll("ul.TextEditor-controls.Composer-footer").length != 0) {
                  addHTML(appendDisplay, "ul.TextEditor-controls.Composer-footer", "beforeend");
                  display = document.querySelector("div#us_display");
                  display.style.display = "none";
                }
              }
              // 自定義搜尋按鈕
              if (document.querySelectorAll("button#us_tagByUid").length == 0) {
                let appendButton = `<button id="us_tagByUid" class="Button Button--icon Button--link hasIcon" type="button" title="用 UID 標註他人" data-original-title="用 UID 標註他人"><i class="icon fas fa-user-tag" style="color: #e88;"></i><span class="Button-label">用 UID 標註他人</span></button>`;
                addHTML(appendButton, "li.TextEditor-toolbar", "beforeend");
                button = document.querySelector("button#us_tagByUid");
                button.addEventListener("click", function (e) {
                  let input = document.querySelector("input#us_searchUid")
                  if (display.style.display == "none") {
                    display.style.display = "inline-block";
                    input.focus();
                  } else {
                    display.style.display = "none";
                    document.querySelector("textarea.FormControl.Composer-flexible").focus();
                  }

                  input.addEventListener("input", function (e) {
                    input.value = input.value.replace(/[^0-9]/g, "");
                    let search = parseInt(input.value);

                    if (search !== "") {
                      if (search <= max_uid) {
                        mentionUserById(search);
                      }
                    }
                  });
                });
              }
            }
          }, 200);
        });
      }

      // v0.5: 個人頁面排序
      if (_setting["open05post"] || _setting["open05discussion"]) {
        setInterval(function () {
          // 添加討論日期選取器的 css 於 head
          if (_setting["open05discussion"]) {
            if (document.querySelectorAll("link#us_pikaday").length == 0) {
              console.log("[Kater Tools] Add Pikaday");
              addStyleLink("https://cdn.jsdelivr.net/npm/pikaday/css/pikaday.css", "us_pikaday");
            }
          }

          // 貼文
          if (_setting["open05post"]) {
            if (document.querySelectorAll("div.sideNavContainer div.PostsUserPage").length != 0 &&
              document.querySelectorAll("div.PostsUserPage div#us_userPageOptionTop").length == 0 &&
              location.pathname.match(/mentions$/) == null) {
              insertPostOpt();
            }
          }

          // 討論
          if (_setting["open05discussion"]) {
            if (document.querySelectorAll("div.sideNavContainer div.DiscussionsUserPage").length != 0 &&
              document.querySelectorAll("div.DiscussionsUserPage div#us_userPageOptionTop").length == 0 &&
              location.pathname.match(/discussions$/) != null) {
              insertDiscussionOpt();
            }
          }

          // 訊息框區域
          if (document.querySelectorAll("div#us_messageArea").length == 0) {
            let area = `<div id="us_messageArea"></div>`;
            if (document.querySelectorAll("div#app").length != 0) {
              addHTML(area, "div#app", "beforeend");
            }
          }

          // 訊息框自動刪除（詳見 message()）
          for (let [key, value] of Object.entries(expireMsg)) {
            if (Date.now() > value) {
              document.querySelector(`div#us_messageBlock[data-id="${key}"]`).remove();
              delete expireMsg[key];
            }
          }
        }, 100);
      }

      // v0.6: 文章編輯器快速選項
      if (_setting["open06toolbar"]) {
        setInterval(function () {
          // 撰寫貼文框的下方功能列
          let nodes = document.querySelectorAll("li.TextEditor-toolbar");
          if (nodes.length > 0) {
            let node = nodes[0];

            if (node.querySelectorAll("div#us06_customArea").length == 0) {
              // 不能用 innerHTML 添加，會破壞原生功能
              node.insertAdjacentHTML("beforeend", `<div id="us06_customArea"></div>`);
              let customArea = node.querySelector("div#us06_customArea");

              insertEditorToolbarOpt(customArea);
            }
          }
        }, 200);
      }
    }
  })();
})();