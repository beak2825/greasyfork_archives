// ==UserScript==
// @name         假猫粮供应商
// @name:en      Phony cat food vendor
// @namespace    https://msvip.example.com
// @license      GPL-3.0
// @version      0.1.1
// @author       Tooomm
// @match        https://mahjongsoul.game.yo-star.com/*
// @match        https://majsoul.union-game.com/*
// @match        https://game.mahjongsoul.com/*
// @match        https://game.maj-soul.com/1/*

// @description     体验角色与装扮
// @description:en  Unlock characters and outfits
// @downloadURL https://update.greasyfork.org/scripts/502494/%E5%81%87%E7%8C%AB%E7%B2%AE%E4%BE%9B%E5%BA%94%E5%95%86.user.js
// @updateURL https://update.greasyfork.org/scripts/502494/%E5%81%87%E7%8C%AB%E7%B2%AE%E4%BE%9B%E5%BA%94%E5%95%86.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
(function () {
  "use strict";

  function newStore(name) {
    function getKey(id) {
      return id !== undefined ? `${name}.${id}` : name;
    }

    return {
      set(value, id) {
        const key = getKey(id);
        if (value === null || typeof value !== "object") {
          localStorage.setItem(key, value);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
        }
      },
      get(id) {
        const item = localStorage.getItem(getKey(id));
        try {
          return JSON.parse(item);
        } catch {
          const number = parseInt(item);
          return isNaN(number) ? item : number;
        }
      }
    };
  }

  const store = {
    skin: newStore("vip.skin"),
    title: newStore("vip.title"),
    loading: newStore("vip.loading"),
    account: newStore("vip.account"),
    mainCharacter: newStore("vip.char.main"),
    characterSort: newStore("vip.char.sort"),
    hiddenCharacters: newStore("vip.char.hidden"),
    use: newStore("vip.views.use"),
    views: newStore("vip.views")
  };

  const resource = {
    items() {
      return cfg.item_definition.item.rows_
        .filter(i => i.category === 5 || i.category === 8)
        .map(i => ({ stack: 1, item_id: i.id }));
    },
    use() {
      return store.use.get() || 0;
    },
    values() {
      return store.views.get(this.use())?.values || [];
    },
    views() {
      return this.values().map(view => ({
        type: 0,
        slot: view.slot,
        item_id_list: [],
        item_id: view.type
          ? view.item_id_list[Math.floor(Math.random() * view.item_id_list.length)]
          : view.item_id
      }));
    },
    titles() {
      return Object.keys(cfg.item_definition.title.map_);
    },
    initSkin(charid) {
      return cfg.item_definition.character.map_[charid].init_skin;
    },
    avatarId() {
      const charid = this.mainCharId();
      return store.skin.get(charid) || this.initSkin(charid);
    },
    avatarFrame() {
      for (const view of this.values())
        if (view.slot === 5) {
          return view.item_id;
        }
      return 0;
    },
    extraEmoji(charid) {
      return cfg.character.emoji.groups_[charid].map(g => g.sub_id);
    },
    character(charid) {
      return {
        rewarded_level: [1, 2, 3, 4, 5],
        is_upgraded: true,
        extra_emoji: this.extraEmoji(charid),
        charid: charid,
        level: 5,
        views: [],
        skin: store.skin.get(charid) || this.initSkin(charid),
        exp: 1
      };
    },
    mainCharId() {
      return store.mainCharacter.get() || 200007;
    },
    mainCharacter() {
      return this.character(this.mainCharId());
    },
    commonViews() {
      return {
        use: this.use(),
        views: [...Array(10).keys()].map(i => store.views.get(i) || {})
      };
    },
    characterInfo() {
      return {
        send_gift_count: 0,
        send_gift_limit: 2,
        skins: Object.keys(cfg.item_definition.skin.map_),
        finished_endings: Object.keys(cfg.spot.rewards.map_),
        rewarded_endings: Object.keys(cfg.spot.rewards.map_),
        main_character_id: this.mainCharId(),
        character_sort: store.characterSort.get() || [],
        hidden_characters: store.hiddenCharacters.get() || [],
        characters: Object.keys(cfg.item_definition.character.map_).map(id => this.character(id))
      };
    }
  };

  function override(players) {
    for (const player of players || []) {
      if (player.account_id === store.account.get()) {
        const updates = {
          views: () => resource.views(),
          avatar_id: () => resource.avatarId(),
          character: () => resource.mainCharacter(),
          avatar_frame: () => resource.avatarFrame(),
          title: () => store.title.get() || 0,
          loading_image: () => store.loading.get() || []
        };

        for (const [key, update] of Object.entries(updates)) {
          if (key in player) {
            player[key] = update();
          }
        }
      } else {
        if (player.character)
          Object.assign(player.character, { level: 5, exp: 1, is_upgraded: true });
      }
    }
  }

  function hookReq2Lobby(fn) {
    return function (service, name, req, callback) {
      // console.log(service, name, req);

      switch (name) {
        // RESPONSE
        case "login":
        case "emailLogin":
        case "oauth2Login":
          return fn.call(this, service, name, req, (_null, res) => {
            store.account.set(res.account_id);
            override([res.account]);
            callback(_null, res);
          });
        case "fetchInfo":
          return fn.call(this, service, name, req, (_null, res) => {
            res.character_info = resource.characterInfo();
            res.all_common_views = resource.commonViews();
            res.title_list.title_list = resource.titles();
            res.bag_info.bag.items.unshift(...resource.items());
            callback(_null, res);
          });
        case "joinRoom":
        case "fetchRoom":
        case "createRoom":
          return fn.call(this, service, name, req, (_null, res) => {
            override(res.room?.persons);
            callback(_null, res);
          });
        case "fetchGameRecord":
          return fn.call(this, service, name, req, (_null, res) => {
            override(res.head?.accounts);
            callback(_null, res);
          });
        case "fetchAccountInfo":
          return fn.call(this, service, name, req, (_null, res) => {
            override([res.account]);
            callback(_null, res);
          });

        // REQUEST
        case "useTitle":
          store.title.set(req.title);
          return callback(null, {});
        case "setLoadingImage":
          store.loading.set(req.images);
          return callback(null, {});
        case "changeMainCharacter":
          store.mainCharacter.set(req.character_id);
          return callback(null, {});
        case "changeCharacterSkin":
          store.skin.set(req.skin, req.character_id);
          return callback(null, {});
        case "updateCharacterSort":
          store.characterSort.set(req.sort);
          return callback(null, {});
        case "setHiddenCharacter":
          store.hiddenCharacters.set(req.chara_list);
          return callback(null, { hidden_characters: req.chara_list });
        case "useCommonView":
          store.use.set(req.index);
          return callback(null, {});
        case "saveCommonViews":
          store.views.set({ values: req.views, index: req.save_index }, req.save_index);
          return callback(null, {});
        case "addFinishedEnding":
          return callback(null, {});

        default:
          return fn.call(this, service, name, req, callback);
      }
    };
  }

  function hookReq2MJ(fn) {
    return function (service, name, req, callback) {
      // console.log(service, name, req);

      switch (name) {
        // RESPONSE
        case "authGame":
          return fn.call(this, service, name, req, (_null, res) => {
            override(res?.players);
            callback(_null, res);
          });

        // REQUEST
        case "broadcastInGame":
          return JSON.parse(req.content).emo > 9
            ? callback(null, {})
            : fn.call(this, service, name, req, callback);

        default:
          return fn.call(this, service, name, req, callback);
      }
    };
  }

  function hookAddL(fn) {
    return function (name, handler) {
      // console.log(name);

      const { method: callback } = handler;
      switch (name) {
        case "NotifyAccountUpdate":
          return fn.call(
            this,
            name,
            Object.assign(handler, {
              method(data) {
                delete data.update?.character;
                delete data.update?.main_character;
                callback(data);
              }
            })
          );
        case "NotifyRoomPlayerUpdate":
          return fn.call(
            this,
            name,
            Object.assign(handler, {
              method(data) {
                override(data?.player_list);
                callback(data);
              }
            })
          );
        case "NotifyGameFinishRewardV2":
          return fn.call(
            this,
            name,
            Object.assign(handler, {
              method(data) {
                Object.assign(data.main_character, {
                  exp: 1,
                  add: 0,
                  level: 5
                });
                callback(data);
              }
            })
          );

        default:
          return fn.call(this, name, handler);
      }
    };
  }

  function inGame() {
    try {
      return app != null && app.NetAgent != null;
    } catch {
      return false;
    }
  }

  (function main() {
    console.log("Loading...");
    if (!inGame()) {
      return setTimeout(main, 1500);
    }

    console.log("Game loaded !");

    const { sendReq2Lobby, sendReq2MJ } = app.NetAgent;
    app.NetAgent.sendReq2MJ = hookReq2MJ(sendReq2MJ);
    app.NetAgent.sendReq2Lobby = hookReq2Lobby(sendReq2Lobby);

    const { AddListener2Lobby, AddListener2MJ } = app.NetAgent;
    app.NetAgent.AddListener2Lobby = hookAddL(AddListener2Lobby);

    console.log("Hook loaded !");
  })();
})();
