// ==UserScript==
// @name         dAnime Playlist
// @namespace    danimplist
// @version      0.1.1
// @description  dアニメストアにプレイリスト機能を追加するスクリプト
// @author       inonote
// @supportURL   https://greasyfork.org/ja/scripts/419693-danime-playlist/feedback
// @match        https://anime.dmkt-sp.jp/animestore/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.xmlHttpRequest
// @run-at       document-start
// @connect      ms2.anime.dmkt-sp.jp
// @connect      rsm.anime.dmkt-sp.jp
// @connect      wv.anime.dmkt-sp.jp
// @connect      stlog.d.dmkt-sp.jp
// @compatible   chrome
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/419693/dAnime%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/419693/dAnime%20Playlist.meta.js
// ==/UserScript==

// 動画プレイヤーの hash flagment の構造
//   #<appId>_pl_<playerFlag>_<playlistId>
//   appId      ... app id
//   playerFlag ... 動画が読み込まれたときに起こす行動フラグ (未使用)
//   playlistId ... playlist id


(function(win, doc) {
  "use strict";
  
  const config = {
    appName: "dAnime Playlist",
    appId: "danimplist",
    ver: "0.1.1",
    dAnimeAPIEndpoints: {
      host: "anime.dmkt-sp.jp",
      getWorkInfo: "/animestore/rest/WS030101",
      getContentInfo: "/animestore/rest/WS010105"
    }
  }

  function elog(msg) {
    console.log(config.appId + ": "+ msg);
  }

  function createUID() {
    // 全世界で唯一のIDである必要がある
    return String((new Date).getTime().toString(36)) + 
          ("00000000000" + Math.floor(Math.random() * 9007199254740991).toString(36)).slice(-11) +
          ("00000000000" + Math.floor(Math.random() * 9007199254740991).toString(36)).slice(-11);
  }

  function getPlayerPath(partId) {
    if (partId.substr(0, 1) === "C") // 限定
      return "/animestore/sc_d_pc_l";
    return "/animestore/sc_d_pc";
  }

  function isPathPlayer(path) {
    if (path === "/animestore/sc_d_pc") return true;
    if (path === "/animestore/sc_d_pc_l") return true;
    return false;
  }

  // XHR による通信を監視するやつ
  // ※作品情報取得 API のレスポンスを再生中のプレイリストに合ったものに書き換える用。
  const XHRSpyController = (function() {
    let listeners = [];
    const originalXHR = XMLHttpRequest;
    return {
      plant: function() {
        // すり替え用の XHR
        // もとの XHR とは完全に互換ではないので、blob や arraybuffer が要求されたらバグる。
        // 用が済んだら XHRSpyController.retreat() で元に戻すべき。
        let XHRSpy = function() {
          let self = this;
          self.options = {
            data: "",
            headers: [],
            method: "",
            overrideMimeType: "",
            password: "",
            synchronous: false,
            timeout: 3000,
            url: "",
            user: "",
            onabort: undefined,
            onerror: undefined,
            onload: undefined,
            onprogress: undefined,
            onreadystatechange: undefined,
            ontimeout: undefined
          }
          self.responseHeaders = "";
          self.response = null;

          defprop("overrideMimeType");
          defprop("responseType");
          defprop("timeout");
          defprop("withCredentials");
          defprop("onabort");
          defprop("onerror");
          defprop("onload");
          defprop("onprogress");
          defprop("onreadystatechange");
          defprop("ontimeout");
          function defprop(key) {
            Object.defineProperty(self, key, {
              get: function() {
                return self.options[key];
              },
              set: function(v) {
                self.options[key] = v;
              }
            });
          }
        };
        XHRSpy.prototype.open = function(method, url, async, user, password) {
          this.options.method = method;
          this.options.url = url;
          this.options.synchronous = async;
          this.options.user = user;
          this.options.password = password;
        }
        XHRSpy.prototype.send = function(body) {
          let self = this;
          function setResponseData(response) {
            self.readyState = response.readyState;
            self.response = response.response; 
            self.responseText = response.responseText;
            self.responseURL = response.finalUrl;
            self.responseXML = response.responseXML;
            self.status = response.status; 
            self.statusText = response.statusText;
            self.responseHeaders = response.responseHeaders;
          }
          function callListeners() {
            let asysnc = false;
            for(let i = 0; i < listeners.length; i++)
              asysnc = asysnc | listeners[i](self);
            return asysnc;
          }
          this.options.data = body;
          GM.xmlHttpRequest({
            data: this.options.data,
            headers: this.options.headers,
            method: this.options.method,
            responseType: this.responseType,
            overrideMimeType: this.options.overrideMimeType,
            password: this.options.password,
            synchronous: false,
            timeout: this.options.timeout,
            url: this.options.url,
            user: this.options.user,
            onabort: this.options.onabort,
            onerror: this.options.onerror,
            onload: function(response) {
              if (typeof self.options.onload !== "function")
                return;
              setResponseData(response);

              let isAsyncMode = false;
              if (response.readyState === 4)
                isAsyncMode = callListeners();
              if (!isAsyncMode)
                return self.options.onload({});
            },
            onprogress: this.options.onprogress,
            onreadystatechange: function(response) {
              if (typeof self.options.onreadystatechange !== "function")
                return;
              setResponseData(response);

              let isAsyncMode = false;
              if (response.readyState === 4)
                isAsyncMode = callListeners();
              if (!isAsyncMode)
                return self.options.onreadystatechange({});
            },
            ontimeout: this.options.ontimeout
          });
        }
        XHRSpy.prototype.abort = function() {  };
        XHRSpy.prototype.getAllResponseHeaders = function() { this.responseHeaders; };
        XHRSpy.prototype.getResponseHeader = function(a) { return null; };
        XHRSpy.prototype.overrideMimeType = function(a) { this.options.overrideMimeType = a; };
        XHRSpy.prototype.setRequestHeader = function(a, b) {  };
        XHRSpy.prototype.addEventListener = function(a, b, c) {  };
        XHRSpy.prototype.overwriteResponse = function(buf) { this.response = buf; };
        XHRSpy.prototype.getCallback = function(name) {
          if (name === "abort") return this.options.onabort;
          if (name === "error") return this.options.onerror;
          if (name === "load") return this.options.onload;
          if (name === "progress") return this.options.onprogress;
          if (name === "readystatechange") return this.options.onreadystatechange;
          if (name === "timeout") return this.options.ontimeout;
          return undefined;
        };
        win.XMLHttpRequest = XHRSpy;
        elog("xhrspy: planted");
      },

      // 復元
      retreat: function() {
        win.XMLHttpRequest = originalXHR;
        elog("xhrspy: retreated");
      },

      // 観測者を追加
      addListener: function(callback) {
        if (typeof callback === "function")
          listeners.push(callback);
      }
    };
  })();

  // プレイリスト管理
  const playlistManager = (function() {
    let playlists = [];

    // 内部管理プレイリストに変換
    function toInternalPlaylist(plist) {
      if (plist.ver === undefined)
        return null;
      switch (plist.ver) {
        case "0.1":
        case "0.1.1":
          return plist;
      }
      return null;
    }

    function getListIndexById(listId) {
      let index = null;
      for(let i = 0; i < playlists.length; i++) {
        if (playlists[i].id === listId) {
          index = i;
          break;
        }
      }
      return index;
    }

    function loadFromString(string, overwriteIfDuplicated = false) {
      let plists = [];
      try {
        plists = JSON.parse(string);
      }
      catch(e) {
        playlists = [];
        return;
      }
      if (plists === null) {
        playlists = [];
        return;
      }
      plists.forEach(function(v) {
        let plist = toInternalPlaylist(v);
        if (plist) {
          if (overwriteIfDuplicated) { // 同じ ID あったら上書き
            let index = getListIndexById(plist.id);
            if (index !== null)
              playlists[index] = plist;
            else
              playlists.push(plist);
          }
          else
            playlists.push(plist);
        }
      });
    }

    return {
      // プレイリスト全て読み込み
      loadAll: function() {
        let raw = GM_getValue("plist");
        if (raw === null)
          playlists = [];
        else
          loadFromString(raw);
        elog("plman: loaded");
      },

      // プレイリスト全て保存
      saveAll: function() {
        GM_setValue("plist", JSON.stringify(playlists));
        elog("plman: saved");
      },

      // 全てプレイリストをオブジェクトから読み込み
      loadFromObject: function(blob, callback = undefined) {
        let self = this;
        let reader = new FileReader();
        reader.onload = function() {
          loadFromString(reader.result, true);
          elog("plman: loaded from blob");
          self.saveAll();
          if (typeof callback === "function")
            callback(); 
        };
        reader.readAsText(blob);
      },

      // 全てプレイリストをまとめてオブジェクトに変換
      saveToObject: function() {
        return new Blob([ JSON.stringify(playlists) ], { type: "application/x-daniplist" });
      },
      
      // プレイリストを作成
      createList: function(listTitle) {
        let id = createUID();
        playlists.push({
          id: id,
          title: listTitle,
          ver: config.ver,
          items: []
        });
        return id;
      },

      // プレイリストを削除
      deleteList: function(listId) {
        let index = getListIndexById(listId);
        if (index === null)
          return false;
        playlists.splice(index, 1);
        return true;
      },
      
      // プレイリストのタイトルを変更
      updateListTitle: function(listId, newTitle) {
        let index = getListIndexById(listId);
        if (index === null)
          return false;
        playlists[index].title = newTitle;
        return true;
      },

      // プレイリストの一覧を取得
      getLists: function() {
        let list = [];
        playlists.forEach(function(v) {
          list.push({
            id: v.id,
            title: v.title,
          });
        });
        return list;
      },

      // プレイリストの個数を取得
      getListCount: function() {
        return playlists.length;
      },
      
      // プレイリストの情報を取得
      getListInfo: function(listId) {
        let index = getListIndexById(listId);
        if (index === null)
          return {
            id: "",
            title: "",
          };
        return {
          id: playlists[index].id,
          title: playlists[index].title
        };
      },

      // プレイリストを取得
      getListItems: function(listId) {
        let index = getListIndexById(listId);
        if (index === null)
          return [];
        return playlists[index].items;
      },
      
      // プレイリストの情報を取得
      getListInfoByIndex: function(listIndex) {
        if (playlists[listIndex] === undefined)
          return {
            id: "",
            title: "",
          };
        return {
          id: playlists[listIndex].id,
          title: playlists[listIndex].title
        };
      },

      // プレイリストを取得
      getListItemsByIndex: function(listIndex) {
        if (playlists[listIndex] === undefined)
          return [];
        return playlists[listIndex].items;
      },

      // プレイリストに項目を追加
      addListItem: function(listId, beforeIndex, title, subtitle, url) {
        let index = getListIndexById(listId);
        if (index === null)
          return false;
        if (beforeIndex === -1) {
          playlists[index].items.push({
            title: title,
            subtitle: subtitle,
            url: url
          });
        }
        else {
          playlists[index].items.splice(beforeIndex, 0, {
            title: title,
            subtitle: subtitle,
            url: url
          });
        }
        return true;
      },

      // プレイリストの項目を削除
      deleteListItem: function(listId, itemIndex) {
        let index = getListIndexById(listId);
        if (index === null)
          return false;
        playlists[index].items.splice(itemIndex, 1);
        return true;
      }
    };
  })();

  const playlistManagerModal = (function() {
    const htmlPlistManager =  '<div style="display:none" id="'+config.appId+'_plistman_top_controller">'+
                                '<select id="'+config.appId+'_plistman_list_selector" style="width:100%;padding:0 .5em;border:1px solid #efece6;font-size:1.5rem;flex:1;align-self:stretch;min-height:32px"></select>'+
                                '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;align-self:stretch;cursor:pointer" id="'+config.appId+'_plistman_list_new">新規</button>'+
                                '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;align-self:stretch;cursor:pointer" id="'+config.appId+'_plistman_list_edt">編集</button>'+
                              '</div>'+
                              '<div id="'+config.appId+'_plistman_list" style="height:200px;overflow-x:auto;border:1px solid #efece6"></div>'+
                              '<div style="display:none" id="'+config.appId+'_plistman_bottom_controller">'+
                                '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;cursor:pointer" id="'+config.appId+'_plistman_item_add">話追加</button>'+
                                '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;cursor:pointer" id="'+config.appId+'_plistman_item_rmv">削除</button>'+
                                '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;cursor:pointer" id="'+config.appId+'_plistman_item_up">↑</button>'+
                                '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;cursor:pointer" id="'+config.appId+'_plistman_item_dwn">↓</button>'+
                              //'</div>'+
                              //'<div>'+
                                '<label>'+
                                  '<div style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;cursor:pointer;display:inline-block" tabindex="0">インポート</div>'+
                                  '<input type="file" id="danimplist_plistman_import" accept=".daniplist" hidden />'+
                                '</label>'+
                                '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 1em;color:#000;font-size:1.5rem;cursor:pointer" id="'+config.appId+'_plistman_export">エクスポート</button>'+
                              '</div>'+
                              '<div style="display:none;margin-top:.25em" id="'+config.appId+'_plistman_bottom_note">プレイリストの編集は各作品ページで行えます。</div>';//+
                              //'<p style="text-align:right;margin:.25em 0;">'+config.appName+' v'+config.ver+'</p>';
    const htmlEpSelector = '<p style="font-weight:bold" id="'+config.appId+'_plistman_work_name"></p>'+
                            '<select id="'+config.appId+'_plistman_ep_selector" style="width:100%;height:30px;padding:0 .5em;border:1px solid #efece6;margin-bottom:.5em;"></select>'+
                            '<p style="font-size:.9em;">※別作品を追加したい場合は、その作品の詳細ページからプレイリスト管理画面を開いてください。</p>';
    const htmlNewPlistNameInput = '<label style="font-size:.9em">新規プレイリスト名<input type="text" id="'+config.appId+'_plistman_list_name" style="width:100%;height:30px;padding:0 .5em;border:1px solid #efece6;box-sizing:border-box;font-size:1.5rem" placeholder="プレイリスト名" /></label>';
    const htmlEditPlist = '<div style="margin-bottom:1em">'+
                            '<label style="font-size:.9em">'+
                              'プレイリスト名'+
                              '<input type="text" id="'+config.appId+'_plistman_list_name" style="width:100%;height:30px;padding:0 .5em;border:1px solid #efece6;box-sizing:border-box;font-size:1.5rem" placeholder="プレイリスト名" />'+
                            '</label>'+
                          '</div>'+
                          '<div style="margin-bottom:1em">'+
                            '<button style="background:#e5e5e5;border:1px solid #efece6;padding:.25em 2em;color:#000;font-weight:bold;font-size:1.5rem;cursor:pointer" id="'+config.appId+'_plistman_list_del">削除する</button>'+
                          '</div>';
    const htmlModalFooter = '<div style="height:1em;width:100%;clear:left" class="onlySpLayout"></div>'+
                            '<div style="margin-top:.25em;font-size:.9em;position:absolute;bottom:5px;right:10px">'+
                              config.appName+' v'+config.ver+' | '+
                              '<a href="https://greasyfork.org/ja/scripts/419693-danime-playlist/feedback" target="_blank" rel="noopener noreferrer">バグ報告</a> | '+
                              '<a href="https://inonote.jp/" target="_blank" rel="noopener noreferrer">作者HP</a>'+
                            '</div>';
    let episodeList = [];
    let pageInfo = {};
    let playButtonCallback = undefined;
    let isAttachedExitConform = false;

    function getOptionFlag(options, key) {
      if (typeof options !== "object")
        return false;
      return options.includes(key);
    }

    function playButtonCallbackWrapper(listId, itemIndex = -1) {
      if (typeof playButtonCallback !== "function")
        return;
      let items = playlistManager.getListItems(listId);
      let partId = items[Math.max(Math.min(itemIndex, items.length - 1), 0)].url;
      playButtonCallback(listId, partId);
    }

    function onBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = "";
    }

    function attachExitConform() {
      if (isAttachedExitConform)
        return;
      win.addEventListener("beforeunload", onBeforeUnload);
      isAttachedExitConform = true;
      elog("ec: attached");
    }

    function detachExitConform() {
      if (!isAttachedExitConform)
        return;
      win.removeEventListener("beforeunload", onBeforeUnload);
      isAttachedExitConform = false;
      elog("ec: detached");
    }

    // プレイリスト管理画面
    function managePlaylist(mode, defaultListId, defaultListItemIndex, options) {
      let activeListId = defaultListId === undefined ? "" : defaultListId;
      if (activeListId === "") {
        let v = GM_getValue("lastOpened");
        if (typeof v === "string")
          activeListId = v;
      }

      let dialogId = jQuery.showDialog({
        title: "プレイリスト管理",
        text: htmlPlistManager,
        button1Text: "閉じる",
        button1Callback: function() {
          playlistManager.saveAll();
          GM_setValue("lastOpened", activeListId);
          detachExitConform();
        },
        button2Text: (typeof playButtonCallback === "function" && !getOptionFlag(options, "hiddenPlayStart")) ? "再生する" : null,
        button2Callback: function() {
          playlistManager.saveAll();
          GM_setValue("lastOpened", activeListId);
          detachExitConform();
          
          let items = playlistManager.getListItems(activeListId);
          if (items.length === 0) {
            jQuery.showToast("プレイリストの中身が空です");
            return false;
          }

          playButtonCallbackWrapper(activeListId, 0);
          return false;
        },
        closeCallback: function() {
          playlistManager.saveAll();
          GM_setValue("lastOpened", activeListId);
          detachExitConform();
        }
      });

      let waitCount = 0;
      function waitModalBuilt() {
        win.setTimeout(function() {
          waitCount++;
          if (waitCount > 20)
            return;
          if (doc.getElementById(config.appId+"_plistman_list_selector"))
            initModal();
          else
            waitModalBuilt();
        }, 100);
      }
      waitModalBuilt();

      function initModal() {
        doc.getElementById(config.appId+"_plistman_list").addEventListener("keydown", onKeyDownList);
                
        let elm = doc.getElementById(config.appId+"_plistman_list_selector");
        elm.addEventListener("change", function(e) {
          updateList(e.target.value);
        });
        elm.focus();

        updateListSelector();

        if (playlistManager.getListCount() > 0)
          updateList(playlistManager.getListInfo(activeListId).id);
        
        if (defaultListItemIndex !== undefined)
          selectListItem(defaultListItemIndex);

        // 操作ボタン
        if (mode === "edit") {
          doc.getElementById(config.appId+"_plistman_list_new").addEventListener("click", onClickNewPlaylistButton);
          doc.getElementById(config.appId+"_plistman_list_edt").addEventListener("click", onClickEditPlaylistButton);
          doc.getElementById(config.appId+"_plistman_item_add").addEventListener("click", onClickAddEpButton);
          doc.getElementById(config.appId+"_plistman_item_rmv").addEventListener("click", removeSelectedListItem);
          doc.getElementById(config.appId+"_plistman_item_up").addEventListener("click", upSelectedListItem);
          doc.getElementById(config.appId+"_plistman_item_dwn").addEventListener("click", downSelectedListItem);
          doc.getElementById(config.appId+"_plistman_import").addEventListener("change", onClickImport);
          doc.getElementById(config.appId+"_plistman_export").addEventListener("click", onClickExport);
          doc.getElementById(config.appId+"_plistman_top_controller").style.display = "flex";
          doc.getElementById(config.appId+"_plistman_bottom_controller").style.display = "block";
          attachExitConform();
        }
        else if (mode === "list") {
          doc.getElementById(config.appId+"_plistman_list_new").style.display = "none";
          doc.getElementById(config.appId+"_plistman_list_edt").style.display = "none";
          doc.getElementById(config.appId+"_plistman_item_add").style.display = "none"
          doc.getElementById(config.appId+"_plistman_item_rmv").style.display = "none"
          doc.getElementById(config.appId+"_plistman_item_up").style.display = "none"
          doc.getElementById(config.appId+"_plistman_item_dwn").style.display = "none"
          doc.getElementById(config.appId+"_plistman_import").addEventListener("change", onClickImport);
          doc.getElementById(config.appId+"_plistman_export").addEventListener("click", onClickExport);
          doc.getElementById(config.appId+"_plistman_top_controller").style.display = "flex";
          doc.getElementById(config.appId+"_plistman_bottom_controller").style.display = "block";
          doc.getElementById(config.appId+"_plistman_bottom_note").style.display = "block";
        }

        doc.getElementById(dialogId).getElementsByClassName("generalModal")[0].insertAdjacentHTML("beforeend", htmlModalFooter);
      }

      // プレイリスト一覧の更新
      function updateListSelector() {
        let elm = doc.getElementById(config.appId+"_plistman_list_selector");
        if (elm) {
          while(elm.firstChild)
            elm.removeChild(elm.firstChild);
          
          let lists = playlistManager.getLists();
          lists.forEach(function(v, index) {
            let elmItem = doc.createElement("option");
            elmItem.value = v.id;
            elmItem.innerText = v.title;
            if ((activeListId === "" && index === 0) || (activeListId === v.id))
              elmItem.setAttribute("selected", "selected");
            elm.appendChild(elmItem);
          });
        }
      }

      // プレイリストの項目更新
      function updateList(listId) {
        activeListId = listId;

        let listItems = playlistManager.getListItems(listId);
        let elm = doc.getElementById(config.appId+"_plistman_list");
        if (elm) {
          while(elm.firstChild)
            elm.removeChild(elm.firstChild);

          listItems.forEach(function(v, index) {
            let elmItem = doc.createElement("div");
            elmItem.setAttribute("class", config.appId+"-plistman-list-item");
            elmItem.setAttribute("data-index", index);
            elmItem.setAttribute("tabindex", "0");
            elmItem.setAttribute("style", "padding:.5em 1.25em;border-bottom:1px solid #efece6;outline:none!important;display:flex;cursor:pointer");

            let elmLeftDiv = doc.createElement("div");
            elmLeftDiv.setAttribute("style", "flex:1;overflow-x:hidden;pointer-events:none");
            
            let elmItemTitle = doc.createElement("p");
            elmItemTitle.setAttribute("style", "font-size:1.5rem;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;font-weight:bold");
            elmItemTitle.innerText = v.title;

            let elmItemSubtitle = doc.createElement("p");
            elmItemSubtitle.setAttribute("style", "margin:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis");
            elmItemSubtitle.innerText = v.subtitle;

            elmLeftDiv.appendChild(elmItemTitle);
            elmLeftDiv.appendChild(elmItemSubtitle);

            let elmRightDiv = doc.createElement("div");
            elmRightDiv.setAttribute("style", "align-self:center");

            let elmPlayIcon = doc.createElement("i");
            elmPlayIcon.classList.add("iconEC-tv");
            elmPlayIcon.title = "ここから再生";
            
            elmPlayIcon.addEventListener("click", function() {
              playButtonCallbackWrapper(activeListId, index);
            });

            elmRightDiv.appendChild(elmPlayIcon);

            elm.addEventListener("focusin", function(e) {
              selectListItem(e.target.getAttribute("data-index"));
            });

            elmItem.appendChild(elmLeftDiv);
            elmItem.appendChild(elmRightDiv);
            elm.appendChild(elmItem);
          });
        }
      }

      function onKeyDownList(e) {
        switch (e.key) {
          case "Down":
          case "ArrowDown":
            selectListItem(getSelectedListItemIndex() + 1);
            e.preventDefault();
            break;
          case "Up":
          case "ArrowUp":
            selectListItem(getSelectedListItemIndex() - 1);
            e.preventDefault();
            break;
          case "Enter":
            {
              let felm = doc.activeElement;
              if (felm.classList.contains(config.appId+"-plistman-list-item"))
                selectListItem(parseInt(felm.getAttribute("data-index")));
            }
            break;
        }
      }

      // 項目を選択
      function selectListItem(listIndex) {
        let elm = doc.getElementById(config.appId+"_plistman_list").querySelector("div[data-index='"+listIndex+"']");
        if (elm) {
          let oldElm = doc.getElementById(config.appId+"_plistman_list").querySelector("div[data-selected='yes']");
          if (oldElm) {
            oldElm.removeAttribute("data-selected");
            oldElm.style.background = "";
          }

          elm.setAttribute("data-selected", "yes");
          elm.style.background = "#e5e5e5";
          if (elm.scrollIntoViewIfNeeded)
            elm.scrollIntoViewIfNeeded(false);
          elm.focus();
        }
      }

      // 選択している項目の index を取得
      function getSelectedListItemIndex() {
        let elm = doc.getElementById(config.appId+"_plistman_list").querySelector("div[data-selected='yes']");
        if (elm)
          return parseInt(elm.getAttribute("data-index"));
        return -1;
      }

      // 項目を追加
      function addListItem(epIndex) {
        if (activeListId === "") {
          toastPlaylistIsEmpty();
          return;
        }
        
        if (episodeList[epIndex] === undefined)
          return;
        
        let pos = getSelectedListItemIndex() + 1;
        playlistManager.addListItem(
          activeListId,
          pos,
          pageInfo.name,
          episodeList[epIndex].title,
          episodeList[epIndex].url
        );
        updateList(activeListId);
        selectListItem(pos);
      }

      // 項目を削除
      function removeSelectedListItem() {
        if (activeListId === "") {
          toastPlaylistIsEmpty();
          return;
        }
        
        let itemIndex = getSelectedListItemIndex();
        playlistManager.deleteListItem(activeListId, itemIndex);
        updateList(activeListId);
        selectListItem(Math.max(itemIndex - 1, 0));
      }
      
      // 項目を上に移動
      function upSelectedListItem() {
        if (activeListId === "") {
          toastPlaylistIsEmpty();
          return;
        }
        
        let itemIndex = getSelectedListItemIndex();
        if (itemIndex < 1)
          return;
        
        let item = playlistManager.getListItems(activeListId)[itemIndex];
        playlistManager.deleteListItem(activeListId, itemIndex);
        playlistManager.addListItem(
          activeListId,
          itemIndex - 1,
          item.title,
          item.subtitle,
          item.url
        );
        updateList(activeListId);
        selectListItem(itemIndex - 1);
      }

      // 項目を下に移動
      function downSelectedListItem() {
        if (activeListId === "") {
          toastPlaylistIsEmpty();
          return;
        }

        let itemIndex = getSelectedListItemIndex();
        let items = playlistManager.getListItems(activeListId);

        if (itemIndex >= items.length - 1)
          return;
        
        let item = items[itemIndex];
        playlistManager.deleteListItem(activeListId, itemIndex);
        playlistManager.addListItem(
          activeListId,
          itemIndex + 1,
          item.title,
          item.subtitle,
          item.url
        );
        updateList(activeListId);
        selectListItem(itemIndex + 1);
      }

      // 話追加ダイアログ
      function onClickAddEpButton() {
        if (activeListId === "") {
          toastPlaylistIsEmpty();
          return;
        }
        
        jQuery.showDialog({
          title: "話追加",
          text: htmlEpSelector,
          button1Text: "キャンセル",
          button1Callback: function() {
          },
          button2Text: "追加",
          button2Callback: function() {
            addListItem(parseInt(doc.getElementById(config.appId+"_plistman_ep_selector").value));
          },
          closeCallback: function() {}
        });
  
        let waitCount = 0;
        function waitModalBuilt() {
          win.setTimeout(function() {
            waitCount++;
            if (waitCount > 20)
              return;
            if (doc.getElementById(config.appId+"_plistman_ep_selector"))
              initModal();
            else
              waitModalBuilt();
          }, 100);
        }
        waitModalBuilt();
        
        function initModal() {
          let elm = null;
          elm = doc.getElementById(config.appId+"_plistman_work_name");
          elm.innerText = pageInfo.name;

          // 話一覧
          elm = doc.getElementById(config.appId+"_plistman_ep_selector");
          episodeList.forEach(function(v, index) {
            let elmItem = doc.createElement("option");
            elmItem.value = index;
            elmItem.innerText = v.title;
            if (index === 0)
              elmItem.setAttribute("selected", "selected");
            elm.appendChild(elmItem);
          });
        }
      }
      
      // 新規プレイリストダイアログ
      function onClickNewPlaylistButton() {
        jQuery.showDialog({
          title: "新規プレイリスト",
          text: htmlNewPlistNameInput,
          button1Text: "キャンセル",
          button1Callback: function() {},
          button2Text: "追加",
          button2Callback: function() {
            let title = doc.getElementById(config.appId+"_plistman_list_name").value.trim();
            if (title === "") {
              jQuery.showToast("名前が入力されていません");
              return false;
            }
            activeListId = playlistManager.createList(title);
            updateListSelector();
            updateList(activeListId);
            return true;
          },
          closeCallback: function() {}
        });
  
        let waitCount = 0;
        function waitModalBuilt() {
          win.setTimeout(function() {
            waitCount++;
            if (waitCount > 20)
              return;
            if (doc.getElementById(config.appId+"_plistman_list_name"))
              initModal();
            else
              waitModalBuilt();
          }, 100);
        }
        waitModalBuilt();
        
        function initModal() {
          let elm = doc.getElementById(config.appId+"_plistman_list_name");
          elm.value = "プレイリスト #" + (playlistManager.getListCount() + 1);
          elm.focus();
          elm.select();
        }
      }
      
      // プレイリスト編集ダイアログ
      function onClickEditPlaylistButton() {
        let dialogId = jQuery.showDialog({
          title: "プレイリスト編集",
          text: htmlEditPlist,
          button1Text: "キャンセル",
          button1Callback: function() {},
          button2Text: "確定",
          button2Callback: function() {
            let title = doc.getElementById(config.appId+"_plistman_list_name").value.trim();
            if (title === "") {
              jQuery.showToast("名前が入力されていません");
              return false;
            }
            playlistManager.updateListTitle(activeListId, title);
            updateListSelector();
          },
          closeCallback: function() {}
        });
  
        let waitCount = 0;
        function waitModalBuilt() {
          win.setTimeout(function() {
            waitCount++;
            if (waitCount > 20)
              return;
            if (doc.getElementById(config.appId+"_plistman_list_name"))
              initModal();
            else
              waitModalBuilt();
          }, 100);
        }
        waitModalBuilt();
        
        function initModal() {
          let elm = doc.getElementById(config.appId+"_plistman_list_name");
          elm.value = playlistManager.getListInfo(activeListId).title;
          elm.focus();
          elm.select();

          doc.getElementById(config.appId+"_plistman_list_del").addEventListener("click", onClickDeleteListButton);
        }

        // リスト削除ダイアログ
        function onClickDeleteListButton() {
          jQuery.showDialog({
            title: "プレイリストの削除",
            text: "このプレイリストを削除しますか?",
            button1Text: "キャンセル",
            button1Callback: function() {},
            button2Text: "削除する",
            button2Callback: function() {
              // プレイリスト編集ダイアログを閉じる
              let event = doc.createEvent("HTMLEvents");
              event.initEvent("click", true, true );
              doc.getElementById(dialogId).getElementsByClassName("btnLeft")[0].dispatchEvent(event);
              
              // プレイリストを削除
              playlistManager.deleteList(activeListId);
              if (playlistManager.getListCount() > 0)
                activeListId = playlistManager.getListInfoByIndex(0).id;
              else
                activeListId = "";
              updateListSelector();
              updateList(activeListId);
            },
            closeCallback: function() {}
          });
        }
      }

      // インポート
      function onClickImport(e) {
        playlistManager.loadFromObject(e.target.files[0], function() {
          jQuery.showToast("読み込み完了");
          e.target.value = "";
          if (playlistManager.getListCount() > 0)
            activeListId = playlistManager.getListInfoByIndex(0).id;
          else
            activeListId = "";
          updateListSelector();
          updateList(activeListId);
        });
      }

      // エクスポート
      function onClickExport() {
        let url = win.URL.createObjectURL(playlistManager.saveToObject());
        let elm = doc.createElement("a");
        elm.href = url;
        elm.download = "playlist.daniplist";
        elm.click();
        win.setTimeout(function() {
          win.URL.revokeObjectURL(url);
        }, 500);
      }

      function toastPlaylistIsEmpty() {
        jQuery.showToast("まずプレイリストを作成してください");
      }
    }
    
    return {
      init: function() {
        episodeList = [];
        pageInfo = {};
        playButtonCallback = undefined;
      },

      show: function(mode, defaultListId, defaultListItemIndex, options) {
        managePlaylist(mode, defaultListId, defaultListItemIndex, options);
      },

      setPageInfo: function(arr) {
        pageInfo = arr;
      },

      setEpisodeList: function(arr) {
        episodeList = arr;
      },

      setPlayButtonCallback: function(callback) {
        if (typeof callback === "function")
        playButtonCallback = callback;
      }
    };
  })();

  const episodePageManager = (function() {
    const htmlManagePlistLink = '<div style="padding:1em;font-weight:bold;font-size:1.25rem;max-width:870px;margin:0 auto"><a href="javascript:void(0)" id="'+config.appId+'ManagePlist" style="display: inline-block;background:#eb5528;color:#fff;padding:.25em .75em">プレイリスト管理</a></div>';

    // 話一覧を取得
    function getEpisodeList() {
      let episodeList = [];
      let elmItems = doc.querySelectorAll(".episodeContainer .itemModule");
      if (elmItems.length === 0)
        return;
      elmItems.forEach(function(v) {
        let partId = "";
        let mtch = v.getElementsByTagName("a")[0].href.match(/partId=([\d]*)/);
        if (mtch !== null)
          partId = mtch[1];
        if (partId === "")
          return;
        episodeList.push({
          title: v.getElementsByClassName("line1")[0].innerText + " " + v.getElementsByClassName("line2")[0].innerText,
          url: partId
        });
      });
      return episodeList;
    }

    // ページ情報を取得
    function getPageInfo() {
      return JSON.parse(doc.querySelector("script[type='application/ld+json']").innerHTML);
    }

    // プレイリスト管理リンクをクリックした
    function onClickManagePlistLink() {
      playlistManagerModal.show("edit");
    }

    // プレイリストを再生
    function playPlaylist(listId, videoUrl) {
      let url = "https://anime.dmkt-sp.jp" + getPlayerPath(videoUrl) + "?partId=" + videoUrl +
                "#" + config.appId + "_pl_0_" + listId;
      win.open(url, "popupwindow", "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no");
    }

    return {
      init: function() {
        win.addEventListener("DOMContentLoaded", function() {
          let elmEpisodeWrapper = doc.getElementsByClassName("episodeWrapper")[0];
          if (!elmEpisodeWrapper)
            return;
          elmEpisodeWrapper.insertAdjacentHTML("afterbegin", htmlManagePlistLink);
          doc.getElementById(config.appId + "ManagePlist").addEventListener("click", onClickManagePlistLink);
          playlistManagerModal.init();
          playlistManagerModal.setEpisodeList(getEpisodeList());
          playlistManagerModal.setPageInfo(getPageInfo());
          playlistManagerModal.setPlayButtonCallback(playPlaylist);
        });
      }
    };
  })();

  const playerManager = (function() {
    let playlistId = "";
    let playingVideoUrl = "";
    let nextVideoUrl = "";
    let prevVideoUrl = "";
    let playerFlag = 0;

    // プレイリストを再生
    function playPlaylist(listId, videoUrl) {
      let url = "https://anime.dmkt-sp.jp" + getPlayerPath(videoUrl) + "?partId=" + videoUrl +
                "#" + config.appId + "_pl_0_" + listId;
      win.location.href = url;
    }

    // 話の情報を取得
    function apiGetEpisodeInfo(partId, callback) {
      GM.xmlHttpRequest({
        method: "GET",
        url: "https://" + config.dAnimeAPIEndpoints.host + config.dAnimeAPIEndpoints.getWorkInfo + "?partId=" + partId,
        onreadystatechange: function(response) {
          if (response.readyState === 4) {
            if (response.response)
              callback(JSON.parse(String(response.response)));
            else
              callback({});
          }
        }
      });
    }

    function xhrListener(instance) {
      if ((new URL(instance.responseURL)).pathname === config.dAnimeAPIEndpoints.getContentInfo) {
        // API レスポンス内の前話・次話情報をプレイリストの通りに書き換える処理

        let prevVideoInfo = getPrevVideoInfo(playingVideoUrl);
        let nextVideoInfo = getNextVideoInfo(playingVideoUrl);
        let da = JSON.parse(String(instance.response));
        let responseCallbackOnLoad = instance.getCallback("load");
        let responseCallbackOnReadyStateChange = instance.getCallback("readystatechange");

        function setPrevVideoMeta() {
          if (prevVideoInfo === null) {
            da.data.prevTitle = "";
            da.data.prevPartDispNumber = "";
            da.data.prevPartTitle = "";
            da.data.prevPartExp = "";
            da.data.prevContentInfoUri = "";
            win.setTimeout(setNextVideoMeta, 0);
          }
          else {
            // 前話の情報を取得
            apiGetEpisodeInfo(prevVideoInfo.url, function(prevVideoRealInfo) {
              if (prevVideoRealInfo.workTitle !== undefined) {
                da.data.prevTitle = prevVideoRealInfo.workTitle + " " + prevVideoRealInfo.partDispNumber + " " + prevVideoRealInfo.partTitle;
                da.data.prevPartDispNumber = prevVideoRealInfo.partDispNumber;
                da.data.prevPartTitle = prevVideoRealInfo.partTitle;
                da.data.prevPartExp = prevVideoRealInfo.partExp;
                da.data.prevContentInfoUri = "https://" + config.dAnimeAPIEndpoints.host + config.dAnimeAPIEndpoints.getContentInfo +
                                              "?partId=" + prevVideoInfo.url + "&viewType=5&befPlayPartId=" + playingVideoUrl;
                da.data.prevMainScenePath = prevVideoRealInfo.mainScenePath;
                prevVideoUrl = prevVideoInfo.url;
              }
              else {
                da.data.prevTitle = "";
                da.data.prevPartDispNumber = "";
                da.data.prevPartTitle = "";
                da.data.prevPartExp = "";
                da.data.prevContentInfoUri = "";
              }
              win.setTimeout(setNextVideoMeta, 0);
            });
          }
        }

        function setNextVideoMeta() {
          if (nextVideoInfo === null) {
            da.data.nextTitle = "";
            da.data.nextPartDispNumber = "";
            da.data.nextPartTitle = "";
            da.data.nextPartExp = "";
            da.data.nextContentInfoUri = "";
            win.setTimeout(finish, 0);
          }
          else {
            // 次話の情報を取得
            apiGetEpisodeInfo(nextVideoInfo.url, function(nextVideoRealInfo) {
              if (nextVideoRealInfo.workTitle !== undefined) {
                da.data.nextTitle = nextVideoRealInfo.workTitle + " " + nextVideoRealInfo.partDispNumber + " " + nextVideoRealInfo.partTitle;
                da.data.nextPartDispNumber = nextVideoRealInfo.partDispNumber;
                da.data.nextPartTitle = nextVideoRealInfo.partTitle;
                da.data.nextPartExp = nextVideoRealInfo.partExp;
                da.data.nextContentInfoUri = "https://" + config.dAnimeAPIEndpoints.host + config.dAnimeAPIEndpoints.getContentInfo +
                                              "?partId=" + nextVideoInfo.url + "&viewType=5&befPlayPartId=" + playingVideoUrl;
                da.data.nextMainScenePath = nextVideoRealInfo.mainScenePath;
                nextVideoUrl = nextVideoInfo.url;
              }
              else {
                da.data.nextTitle = "";
                da.data.nextPartDispNumber = "";
                da.data.nextPartTitle = "";
                da.data.nextPartExp = "";
                da.data.nextContentInfoUri = "";
              }
              win.setTimeout(finish, 0);
            });
          }
        }

        function finish() {
          instance.overwriteResponse(JSON.stringify(da)); // レスポンスを上書き
          elog("vpman: meta is overwritten");

          // 本来呼び出されるはずだったコールバックを呼び出す
          if (typeof responseCallbackOnLoad === "function")
            win.setTimeout(function() { responseCallbackOnLoad.call(instance, {}); }, 0);
          if (typeof responseCallbackOnReadyStateChange === "function")
            win.setTimeout(function() { responseCallbackOnReadyStateChange.call(instance, {}); }, 0);
        }

        setPrevVideoMeta();
        XHRSpyController.retreat(); // 用が済んだので監視は終わり
        return true; // async
      }
    }

    function getListItemIndex(currentVideoUrl) {
      let items = playlistManager.getListItems(playlistId);
      for(let i = 0; i < items.length; i++) {
        if (items[i].url === currentVideoUrl)
          return i;
      }
      return 0;
    }

    function getPrevVideoInfo(currentVideoUrl) {
      let items = playlistManager.getListItems(playlistId);
      let foundVideoIndex = null;
      for(let i = 0; i < items.length; i++) {
        if (items[i].url === currentVideoUrl)
          break;
        foundVideoIndex = i;
      }
      return foundVideoIndex === null ? null : items[foundVideoIndex];
    }

    function getNextVideoInfo(currentVideoUrl) {
      let items = playlistManager.getListItems(playlistId);
      let found = false;
      let foundVideoIndex = null;
      for(let i = 0; i < items.length; i++) {
        if (found) {
          foundVideoIndex = i;
          break;
        }
        if (items[i].url === currentVideoUrl)
          found = true;
      }
      return foundVideoIndex === null ? null : items[foundVideoIndex];
    }

    return {
      init: function() {
        // プレイリスト再生している場合は、その ID を取得
        let mtch = win.location.hash.match(new RegExp(config.appId + "_pl_([\\d].*)_([0-9a-zA-Z].*)"));
        if (mtch !== null) {
          playerFlag = parseInt(mtch[1]);
          playlistId = mtch[2];
        }
        
        // 動画のIDを取得
        mtch = win.location.href.match(/partId=([\d]*)/);
        if (mtch !== null)
          playingVideoUrl = mtch[1];

        // プレイリスト再生している場合の処理
        if (playlistId !== "") {
          elog("vpman: playlist mode");

          XHRSpyController.addListener(xhrListener);
          XHRSpyController.plant();

          win.addEventListener("DOMContentLoaded", function() {
            // modal を使用したいので、読み込まれていない dAnime 上のリソースを読み込む
            (function(elm) {
              elm.src = "/js/cms/modal-general.js";
              elm.type = "text/javascript";
              doc.body.appendChild(elm);
            })(doc.createElement("script"));
            (function(elm) {
              elm.href = "/css/cms/common.css?3";
              elm.rel = "stylesheet";
              doc.head.appendChild(elm);
            })(doc.createElement("link"));
            (function(elm) {
              elm.href = "/css/cms/modal.css?3";
              elm.rel = "stylesheet";
              doc.head.appendChild(elm);
            })(doc.createElement("link"));
            (function(elm) {
              elm.href = "/css/cms/sprite_ec.css";
              elm.rel = "stylesheet";
              doc.head.appendChild(elm);
            })(doc.createElement("link"));
            (function(elm) {
              elm.innerHTML = "html{overflow:hidden}.generalModal,.generalModal .titleArea .closeBtn{box-sizing:content-box};";
              doc.head.appendChild(elm);
            })(doc.createElement("style"));
            if (win.COMMON === undefined)
              win.COMMON = {};
            win.COMMON.osVer = "";
            win.COMMON.browser = "chrome";
  
            playlistManagerModal.init("");
            playlistManagerModal.setPlayButtonCallback(playPlaylist);

            // 前へ次へボタンが押されたら XHR を監視
            doc.getElementsByClassName("nextButton")[0].addEventListener("click", function(e) {
              playingVideoUrl = nextVideoUrl;
              XHRSpyController.plant();
            }, true);
            doc.getElementsByClassName("prevButton")[0].addEventListener("click", function(e) {
              playingVideoUrl = prevVideoUrl;
              XHRSpyController.plant();
            }, true);

            // 再生する動画が変わったら hash flagment を付け直す
            (function() {
              const observer = new MutationObserver(function() {
                if (!isPathPlayer(win.location.pathname))
                  return;
                history.replaceState(
                  null, null,
                  win.location.pathname + win.location.search +
                  "#" + config.appId + "_pl_" + playerFlag + "_" + playlistId
                );
              });
              observer.observe(doc.getElementById("backThumb"), { attributes: true });
            })();

            // プレイリスト再生ですよってことを書いておく
            (function(elm, elmLink) {
              if (elm) {
                elm.setAttribute("style", "align-self:center");
                elmLink.innerText = "プレイリスト再生";
                elmLink.setAttribute("style", "color:#999;display:inline-block;font-weight:bold;padding:1em;font-size:1.5rem;cursor:pointer");
                elmLink.addEventListener("click", function(e) {
                  playlistManagerModal.show("", playlistId, getListItemIndex(playingVideoUrl), [ "hiddenPlayStart" ]);
                });
                elm.appendChild(elmLink);
              }
            })(doc.getElementsByClassName("space")[0], doc.createElement("div"));

            elog("vpman: preparation is completed");
          });
        }
      }
    };
  })();

  const mypageManager = (function() {
    const htmlManagePlistLink = '<li style="width:25%"><a href="javascript:void(0)" id="'+config.appId+'ManagePlist">プレイリスト</a></li>';
    
    // プレイリスト管理リンクをクリックした
    function onClickManagePlistLink() {
      playlistManagerModal.show("list");
    }

    // プレイリストを再生
    function playPlaylist(listId, videoUrl) {
      let url = "https://anime.dmkt-sp.jp" + getPlayerPath(videoUrl) + "?partId=" + videoUrl +
                "#" + config.appId + "_pl_0_" + listId;
      win.open(url, "popupwindow", "menubar=no,location=no,resizable=yes,scrollbars=yes,status=no");
    }

    return {
      init: function() {
        win.addEventListener("DOMContentLoaded", function() {
          let elmHeaderSubTab = doc.querySelector(".headerSubTab ul");
          if (!elmHeaderSubTab)
            return;
          let elms = doc.querySelectorAll(".headerSubTab li");
          for(let i = 0; i < elms.length; i++)
            elms[i].setAttribute("style", "width:25%");
            elmHeaderSubTab.insertAdjacentHTML("beforeend", htmlManagePlistLink);
            doc.getElementById(config.appId + "ManagePlist").addEventListener("click", onClickManagePlistLink);
          playlistManagerModal.init();
          playlistManagerModal.setPlayButtonCallback(playPlaylist);
        });
      }
    };
  })();

  let pathname = win.location.pathname;
  switch (pathname) {
    case "/animestore/ci_pc": // 作品リスト
      playlistManager.loadAll();
      episodePageManager.init();
      break;
    case "/animestore/sc_d_pc": // 再生プレイヤー
    case "/animestore/sc_d_pc_l":
      playlistManager.loadAll();
      playerManager.init();
      break;
    case "/animestore/mp_viw_pc": // マイページ
    case "/animestore/mpa_fav_pc":
    case "/animestore/mpa_mylists_pc":  
      playlistManager.loadAll();
      mypageManager.init();
      break;
  }

  elog("ready");
})(unsafeWindow, document);
