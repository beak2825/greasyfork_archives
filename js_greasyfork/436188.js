// ==UserScript==
// @name         Hentai Heroes Helper (auto collect, button press and more)
// @namespace    https://greasyfork.org/users/807892
// @version      4.9.4
// @author       Morryx
// @description  Extension for Hentai Heroes game.
// @license      MIT
// @homepage     https://github.com/Morry981/hentai-heroes-auto#readme
// @homepageURL  https://github.com/Morry981/hentai-heroes-auto#readme
// @source       https://github.com/Morry981/hentai-heroes-auto.git
// @supportURL   https://github.com/Morry981/hentai-heroes-auto/issues
// @match        https://*.hentaiheroes.com/*
// @match        https://*.haremheroes.com/*
// @match        https://*.gayharem.com/*
// @match        https://*.comixharem.com/*
// @match        https://*.hornyheroes.com/*
// @match        https://*.pornstarharem.com/*
// @match        https://connect.chibipass.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436188/Hentai%20Heroes%20Helper%20%28auto%20collect%2C%20button%20press%20and%20more%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436188/Hentai%20Heroes%20Helper%20%28auto%20collect%2C%20button%20press%20and%20more%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const _Settings = class _Settings {
    static save_settings(settings) {
      window.localStorage.setItem(
        _Settings.storage_key,
        JSON.stringify(settings)
      );
    }
    static clear_settings() {
      window.localStorage.removeItem(_Settings.storage_key);
    }
    static get_settings() {
      let settings = window.localStorage.getItem(_Settings.storage_key);
      const default_settings_length = Object.keys(
        _Settings.default_settings
      ).length;
      const last_added_settings = Object.keys(_Settings.default_settings)[default_settings_length - 1];
      let key;
      if (settings === null) settings = {};
      else settings = JSON.parse(settings);
      if (!settings.hasOwnProperty(last_added_settings) || default_settings_length != Object.keys(settings).length) {
        for (key in _Settings.default_settings) {
          if (!settings.hasOwnProperty(key))
            settings[key] = _Settings.default_settings[key];
        }
      }
      for (key in settings) {
        if (!_Settings.default_settings.hasOwnProperty(key))
          delete settings[key];
      }
      _Settings.save_settings(settings);
      _Settings.settings = settings;
      return settings;
    }
    static change_settings(key, value) {
      _Settings.settings[key] = value;
      _Settings.save_settings(_Settings.settings);
    }
    static resetBattleCounts() {
      const counts = [
        "battle_count_troll",
        "battle_count_season",
        "battle_count_penta",
        "battle_count_league",
        "battle_count_champion",
        "battle_count_pantheon"
      ];
      counts.forEach((key) => {
        _Settings.change_settings(key, 0);
      });
    }
    static generateSetting(setting, $el) {
      if (typeof setting.type == "undefined") setting.type = "checkbox";
      if (setting.type === "time") {
        const indentStyle2 = setting.indent ? "margin-left: 15px;" : "";
        const $container = $(`<div style="clear:both; ${indentStyle2}; margin-bottom: 5px;">${setting.text}</div>`).appendTo($el);
        const $timeWrapper = $('<div style="display: flex; align-items: center; gap: 5px; margin-top: 5px;"></div>').appendTo($container);
        const createSpinner = (name, min, max) => {
          const $wrap = $('<label class="textSetting setting-text" style="flex: 1;"></label>');
          const $input = $(`<input type="number" min="${min}" max="${max}" setting="${name}" value="${_Settings.settings[name]}" style="width: 100% !important; padding-right: 25px !important;">`).appendTo($wrap);
          const $nav = $('<div class="setting-text-nav"><div class="setting-text-button setting-text-up">+</div><div class="setting-text-button setting-text-down">-</div></div>').appendTo($wrap);
          $nav.find(".setting-text-up").on("click", () => {
            let val = parseInt($input.val()) + 1;
            if (val > max) val = min;
            $input.val(val).trigger("change");
          });
          $nav.find(".setting-text-down").on("click", () => {
            let val = parseInt($input.val()) - 1;
            if (val < min) val = max;
            $input.val(val).trigger("change");
          });
          $input.on("change", function() {
            _Settings.change_settings(name, $(this).val());
          });
          return $wrap;
        };
        $timeWrapper.append(createSpinner(setting.nameHour, 0, 23));
        $timeWrapper.append('<span style="font-weight: bold;">:</span>');
        $timeWrapper.append(createSpinner(setting.nameMin, 0, 59));
        return;
      }
      let $setting;
      let hintHtml = "";
      if (setting.hint) {
        hintHtml = ` <span title="${setting.hint}" style="cursor:help; border-bottom:1px dotted white">(?)</span>`;
      }
      const indentStyle = setting.indent ? "margin-left: 15px;" : "";
      if (setting.type == "checkbox")
        $setting = $(
          `<div style="clear:both; ${indentStyle}"><label class="switchSetting">  <input type="` + setting.type + '" setting="' + setting.name + '"' + (_Settings.settings[setting.name] === true ? ' checked="checked"' : "") + '/>  <span class="sliderSetting"></span></label>' + setting.text + hintHtml + "</div>"
        );
      else {
        let min = "", max = "", step = "";
        if (typeof setting.min != "undefined")
          min = ' min="' + setting.min + '"';
        if (typeof setting.max != "undefined")
          max = ' max="' + setting.max + '"';
        if (typeof setting.step != "undefined")
          step = ' step="' + setting.step + '"';
        $setting = $(
          `<div style="clear:both; ${indentStyle}">` + setting.text + hintHtml + '<br /><label class="textSetting setting-text">  <input type="' + setting.type + '"' + min + max + step + ' setting="' + setting.name + '" value="' + _Settings.settings[setting.name] + '"/></label></div>'
        );
        if (setting.type == "number") {
          const $nav = $(
            '<div class="setting-text-nav"><div class="setting-text-button setting-text-up">+</div><div class="setting-text-button setting-text-down">-</div></div>'
          );
          const $input = $setting.find("input");
          const _min = parseFloat(setting.min);
          const _max = parseFloat(setting.max);
          const _step = parseFloat(setting.step) || 1;
          $nav.insertAfter($input);
          $nav.find(".setting-text-up").on("click", () => {
            let newVal = parseFloat($input.val()) + _step;
            if (!isNaN(_max) && newVal > _max) {
              newVal = !isNaN(_min) ? _min : 0;
            }
            $input.val(newVal).trigger("change");
          });
          $nav.find(".setting-text-down").on("click", () => {
            let newVal = parseFloat($input.val()) - _step;
            if (!isNaN(_min) && newVal < _min) {
              newVal = !isNaN(_max) ? _max : 0;
            }
            $input.val(newVal).trigger("change");
          });
        }
      }
      $setting.appendTo($el).find("input").on("change", function() {
        var value = false;
        if ($(this).attr("type") == "checkbox")
          value = $(this).is(":checked");
        else value = $(this).val();
        if (typeof setting.onchange != "undefined") {
          setting.onchange(value);
          if (typeof setting.stopafterchange != "undefined" && setting.stopafterchange)
            return;
        }
        _Settings.change_settings($(this).attr("setting"), value);
      });
    }
  };
  _Settings.storage_key = "erocollect_options";
  _Settings.default_settings = {
    auto_collect_harem: false,
    timeout_collect_after: 3e3,
    not_collect_full_graded: false,
    safe_work: false,
    safe_work_opacity: 0.05,
    safe_work_ads_opacity: 0.1,
    pantheon_auto_enter: true,
    pantheon_auto_enter_wait: 5,
    auto_press_btns: false,
    girls_data: false,
    girls_data_export: true,
    auto_switch_lang_export: false,
    auto_fill_team: false,
    champions_tour_active: false,
    champions_tour_step: 0,
    original_game_lang: false,
    girls_data_full: false,
    random_waifu: false,
    change_waifu_interval: 30,
    last_id_troll: 1,
    last_bang_team_points: 0,
    last_bang_team_points_active: false,
    last_side_quest: false,
    min_collect_exp: 1e4,
    journey_champion_active: true,
    journey_champion: false,
    last_link_activity: false,
    last_link_shop: false,
    last_link_champion: false,
    auto_color_opponents: true,
    safe_work_grayscale: true,
    last_links: true,
    back_to_link: true,
    header_link_show: true,
    confirm_exceed: true,
    auto_start_activities: false,
    max_days_club: 60,
    auto_assign_pop: true,
    exit_after_pop_assign: false,
    start_girl_story: false,
    retrive_home_timer: false,
    redirect_to_home: false,
    selected_mythic_item: true,
    upgrade_girl_redirect: false,
    trigger_shop_arrows: 0,
    choosed_bg: "",
    invert_bg: false,
    cg_background: false,
    shards_state: {},
    carac_state: {},
    minimum_money_open_harem: 0,
    link_last_troll: true,
    pachinko_press_btn: true,
    auto_battle: false,
    battle_count_troll: 0,
    battle_count_season: 0,
    battle_count_penta: 0,
    battle_count_league: 0,
    battle_count_champion: 0,
    battle_count_pantheon: 0,
    auto_battle_start_hour: 6,
    auto_battle_start_minute: 0,
    contest_start_hour: 13,
    contest_start_minute: 30,
    contest_end_hour: 13,
    contest_end_minute: 0,
    not_collect_during_contest_change: false,
    avoid_legendary_first: true,
    last_visited_page: false
  };
  _Settings.theme_colors = {
    green: "#53af00",
    red: "#b14",
    gray: "#6a6a6a",
    shadow_gray: "0 3px 0 rgb(23 33 7 / 60%), inset 0 3px 0 #3c3c3c",
    orange: "#eeaa34",
    shadow_orange: "rgb(33 27 7 / 60%) 0px 3px 0px, rgb(240 117 33) 0px 3px 0px inset"
  };
  _Settings.settings = {};
  let Settings = _Settings;
  class Utils {
    static getHeroData() {
      var _a;
      return ((_a = window.shared) == null ? void 0 : _a.Hero) || window.Hero;
    }
    static is_numeric(c) {
      return /^\d+$/.test(c.toString());
    }
    static toint_string(str) {
      if (typeof str === "number") return str;
      if (str === "" || str === null || typeof str === "undefined") return 0;
      const first_part = str.toString().trim().split(/[\s/]/)[0];
      let new_str = "";
      for (let i = 0; i < first_part.length; i++) {
        const char = first_part.charAt(i);
        if (Utils.is_numeric(char)) new_str += char;
      }
      return +new_str;
    }
    static toint_element($el) {
      return Utils.toint_string($el.text().replace(/^\D+/g, ""));
    }
    static random(max = 1, min = 0) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static stopClick(e) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }
    static isContestChange(settings) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const endMinutes = settings.contest_end_hour * 60 + settings.contest_end_minute;
      const startMinutes = settings.contest_start_hour * 60 + settings.contest_start_minute;
      return currentMinutes >= endMinutes && currentMinutes < startMinutes;
    }
  }
  const _StoryHelper = class _StoryHelper {
    static girlLink(id, tab = "affection") {
      tab = "?resource=" + tab;
      if (!tab) tab = "";
      return "/girl/" + id + tab;
    }
    static questLink() {
      var _a;
      const HeroData = Utils.getHeroData();
      if (!((_a = HeroData == null ? void 0 : HeroData.infos) == null ? void 0 : _a.questing)) return;
      $("#canvas_quest_energy .energy_counter_bar .bar-wrapper .over").wrap(
        '<a href="' + HeroData.infos.questing.current_url + '" style="width:100%;text-decoration:none;z-index:2"></a>'
      );
      $('.energy_counter_amount, span[rel="count_txt"]').css("z-index", "1");
    }
    static addBackToLink(link, to_selector = "#pre-battle") {
      if (Settings.settings.back_to_link)
        $('<a href="' + link + '" class="back-to">&lt;- BACK</a>').appendTo(
          $(to_selector)
        );
    }
    static toggleSafeWork(selector) {
      Settings.change_settings("safe_work", !Settings.settings.safe_work);
      $(selector).toggleClass("safe-work");
    }
    static unsafeWork() {
      if (_StoryHelper.unsafeWorkInitialized) return;
      _StoryHelper.unsafeWorkInitialized = true;
      document.addEventListener(
        "click",
        function(e) {
          const target = e.target;
          const safeEl = target.closest(".safe-work, .unsafe-work");
          if (safeEl && target.closest(".raid-content") && !target.closest(".waifu-container")) {
            Utils.stopClick(e);
          }
        },
        true
      );
      document.addEventListener(
        "dblclick",
        function(e) {
          const target = e.target;
          const safeWorkEl = target.closest(".safe-work, .unsafe-work");
          if (safeWorkEl) {
            _StoryHelper.unsafe_click = true;
            $(safeWorkEl).toggleClass("safe-work").toggleClass("unsafe-work");
            Utils.stopClick(e);
          }
        },
        true
      );
    }
    static safeWorkBackground(selector) {
      $(selector).css({
        "background-color": "#7c7c7c",
        "background-blend-mode": "exclusion"
      });
    }
    static getLastLink($el, type) {
      let link = $el.attr("href");
      if (typeof link == "undefined") link = $el.attr("data-href");
      if (typeof link != "undefined" && link.includes(_StoryHelper.links[type]))
        return link.split(_StoryHelper.links[type])[1];
      return _StoryHelper.NOT_FOUND;
    }
    static changeLastTroll() {
      const result = _StoryHelper.getLastLink($(this), "troll");
      if (result == _StoryHelper.NOT_FOUND) return;
      Settings.change_settings("last_id_troll", Utils.toint_string(result));
    }
    static trollMenuLink() {
      const $trollMenu = $(".TrollsMenu");
      if (!$trollMenu.length) {
        setTimeout(_StoryHelper.trollMenuLink, 200);
        return;
      }
      $trollMenu.find('a[href^="' + _StoryHelper.links.troll + '"]').on("click", _StoryHelper.changeLastTroll);
    }
    static changeLastActivityLink() {
      const result = _StoryHelper.getLastLink($(this), "activity");
      if (result == _StoryHelper.NOT_FOUND) return;
      Settings.change_settings("last_link_activity", result);
    }
    static changeLastShopLink() {
      let result = _StoryHelper.getLastLink($(this), "shop");
      if (result == _StoryHelper.NOT_FOUND) result = false;
      Settings.change_settings("last_link_shop", result);
    }
    static shopMenuLink() {
      const $shopMenuLinks = $('a[rel="shop"] .market_menu');
      if (!$shopMenuLinks.length) {
        setTimeout(_StoryHelper.shopMenuLink, 200);
        return;
      }
      $shopMenuLinks.on("click", _StoryHelper.changeLastShopLink);
    }
    static changeLastChampionLink() {
      Settings.change_settings("last_link_champion", $(this).attr("href"));
    }
    static championMenuLink() {
      const $championMenuLinks = $('a[rel="sex-god-path"] .champions_menu');
      if (!$championMenuLinks.length) {
        setTimeout(_StoryHelper.championMenuLink, 200);
        return;
      }
      $championMenuLinks.on("click", _StoryHelper.changeLastChampionLink);
    }
    static goToChampion(id_champion) {
      location.href = "/champions/" + id_champion;
    }
    static journeyChampion(id_champion) {
      if (Settings.settings.journey_champion) {
        _StoryHelper.goToChampion(Settings.settings.journey_champion);
        Settings.change_settings("journey_champion", false);
      }
    }
    static waifuSafeWork() {
      $(".waifu-girl-container img").addClass("safe-work");
      $(".diamond-bar .diamond").on("click", function() {
        setTimeout(_StoryHelper.waifuSafeWork, 200);
      });
    }
    static generateImg(id, grade, src, type = "girls") {
      let domain;
      if (typeof src != "undefined") domain = src.split("hh-content.com")[0];
      else domain = "https://hh.";
      let filename = "ava" + grade;
      if (type == "trolls" && grade > 1) filename = "ava1_t" + grade;
      return domain + "hh-content.com/pictures/" + type + "/" + id + "/" + filename + ".png";
    }
    static appendStory(selector, id) {
      let $waifuStory = $(selector + " .waifuStory");
      if (!$waifuStory.length) {
        $waifuStory = $(
          '<a class="waifuStory"><img src="https://hh.hh-content.com/design_v2/affstar.png"></a>'
        );
        $waifuStory.appendTo($(selector));
      }
      $waifuStory.attr("href", _StoryHelper.girlLink(id)).on("click", function() {
        Settings.change_settings("start_girl_story", true);
      });
    }
    static retriveSalary() {
      return Utils.toint_element($('#collect_all span[rel="next_salary"]'));
    }
    static fixDiamondImg() {
      setTimeout(function() {
        $(".diamond-bar .diamond:first-child").trigger("mouseenter");
      }, 500);
    }
    static autoBattle(options) {
      var _a;
      const settings = Settings.settings;
      const HeroData = Utils.getHeroData();
      const countKey = `battle_count_${options.battleType}`;
      let initialValue = options.defaultCount;
      if (settings[countKey] > 0) {
        initialValue = settings[countKey];
      } else if (options.energyType && ((_a = HeroData == null ? void 0 : HeroData.energies) == null ? void 0 : _a[options.energyType])) {
        const now = new Date();
        const startTotalMinutes = settings.auto_battle_start_hour * 60 + parseInt(settings.auto_battle_start_minute, 10);
        const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
        if (currentTotalMinutes >= startTotalMinutes) {
          const targetDate = new Date(now);
          targetDate.setHours(settings.contest_start_hour, settings.contest_start_minute, 0, 0);
          const diffMs = targetDate.getTime() - now.getTime();
          if (diffMs > 0) {
            const nowTs = Math.floor(now.getTime() / 1e3);
            const targetTs = nowTs + Math.floor(diffMs / 1e3);
            const energyData = HeroData.energies[options.energyType];
            const current_val = parseInt(energyData.amount, 10);
            const max_val = parseInt(energyData.max_regen_amount, 10);
            const time_for_new = parseInt(energyData.seconds_per_point, 10);
            const new_in = parseInt(energyData.next_refresh_ts, 10);
            const time_to_target = targetTs - nowTs;
            const base_burn = Math.max(0, current_val - max_val);
            const effective_current = current_val - base_burn;
            let time_to_full = 0;
            if (effective_current < max_val) {
              time_to_full = new_in + (max_val - effective_current - 1) * time_for_new;
            }
            const overflow_time = time_to_target - time_to_full;
            let extra_burn = 0;
            if (overflow_time > 0) {
              extra_burn = Math.ceil(overflow_time / time_for_new);
            }
            initialValue = Math.min(base_burn + extra_burn, current_val);
          }
        }
      }
      const $autoDiv = $(
        '<div class="auto-battle-container" style="display: flex; align-items: center; justify-content: center; gap: 10px; position: relative; z-index: 999; font-size: 1rem; margin: 10px 0;"></div>'
      );
      const $input = $(
        '<input type="number" class="auto-battle-count" style="width: 50px; text-align: center; color: black;" min="0" max="' + options.defaultCount + '" value="' + initialValue + '">'
      );
      const $startBtn = $(
        '<button class="blue_button_S auto-battle-btn" style="padding: 5px 10px; cursor: pointer;">Auto Fight</button>'
      );
      $autoDiv.append($input).append($startBtn);
      options.container.append($autoDiv);
      let isAutoFighting = false;
      const updateVal = (delta) => {
        if (isAutoFighting) return;
        let val = parseInt($input.val(), 10) || 0;
        const max = parseInt(options.defaultCount, 10) || 0;
        val += delta;
        if (val > max) {
          val = 1;
        } else if (val < 0) {
          val = max;
        }
        $input.val(val).trigger("input").trigger("change");
      };
      $(document).off("keydown.autoBattle").on("keydown.autoBattle", function(e) {
        if (isAutoFighting || !$input.is(":visible") || $(e.target).is("input, textarea")) {
          if (!$(e.target).is($input)) return;
        }
        if (e.key === "ArrowUp" || e.which === 38) {
          e.preventDefault();
          updateVal(1);
        } else if (e.key === "ArrowDown" || e.which === 40) {
          e.preventDefault();
          updateVal(-1);
        }
      });
      const startAuto = (count) => {
        if (count > 0 && isAutoFighting) {
          $input.val(count);
          Settings.change_settings(countKey, count);
          Settings.settings[countKey] = count;
          options.onStart(count);
        } else {
          stopAuto();
        }
      };
      const stopAuto = () => {
        isAutoFighting = false;
        Settings.change_settings(countKey, 0);
        Settings.settings[countKey] = 0;
        $startBtn.text("Auto Fight").removeClass("red_button_S").addClass("blue_button_S");
        $input.prop("disabled", false);
      };
      $startBtn.on("click", function() {
        if (isAutoFighting) {
          stopAuto();
        } else {
          const count = parseInt($input.val(), 10) || 0;
          if (count > 0) {
            isAutoFighting = true;
            $startBtn.text("Stop Auto").removeClass("blue_button_S").addClass("red_button_S");
            $input.prop("disabled", true);
            startAuto(count);
          }
        }
      });
      if (settings[countKey] > 0) {
        isAutoFighting = true;
        $startBtn.text("Stop Auto").removeClass("blue_button_S").addClass("red_button_S");
        $input.prop("disabled", true);
        startAuto(settings[countKey]);
      }
    }
  };
  _StoryHelper.links = {
    troll: "/troll-pre-battle.html?id_opponent=",
    activity: "/activities.html?tab=",
    shop: "/shop.html?type="
  };
  _StoryHelper.NOT_FOUND = "NOT_FOUND";
  _StoryHelper.unsafe_click = false;
  _StoryHelper.unsafeWorkInitialized = false;
  let StoryHelper = _StoryHelper;
  const _MiscGlobal = class _MiscGlobal {
    static init(page) {
      const settings = Settings.settings;
      Settings.change_settings("pachinko_press_btn", true);
      $("#contains_all").on("click", (e) => {
        if (this.page_interact || e.isTrigger || !e.originalEvent || page == "shop" && e.target.parentElement.parentElement.classList.contains("inventory_slots"))
          return;
        this.page_interact = true;
      });
      if (settings.last_side_quest) {
        $('.energy_counter[type="quest"] .energy_counter_bar').on("contextmenu", (e) => {
          location.href = settings.last_side_quest;
          return Utils.stopClick(e);
        });
      }
      this.applyBackground(page);
      $("#popups").on("DOMNodeInserted", () => {
        var _a;
        var text_popup = $("#popup_message").text(), founds = text_popup.match(
          /(Club room|Clubraum|chat server|sala del club|Club depuis|チャットサーバー)/g
        );
        if ((_a = text_popup.match(/(non supported)/g)) == null ? void 0 : _a.length) {
          $("#popup_message").hide();
          location.reload();
        }
        if (founds === null || !founds.length) return;
        $("#popup_message").remove();
      });
      StoryHelper.fixDiamondImg();
    }
    static applyBackground(page) {
      const settings = Settings.settings;
      const $bg = $(
        'body:not([page="map"]):not([page="world"]):not([page="troll-battle"]) #bg_all>.fixed_scaled:nth-child(1) > img:nth-child(1)'
      );
      if (!$bg.length) return;
      if (this.original_bg === void 0) {
        this.original_bg = $bg.attr("src");
      }
      if (!settings.safe_work && settings.choosed_bg != "" && settings.cg_background) {
        $bg.attr("src", settings.choosed_bg);
        if (settings.invert_bg) $bg.addClass("invert");
        else $bg.removeClass("invert");
      } else {
        $bg.removeClass("invert");
        if (this.original_bg) {
          $bg.attr("src", this.original_bg);
        }
      }
    }
  };
  _MiscGlobal.page_interact = false;
  _MiscGlobal.original_bg = void 0;
  let MiscGlobal = _MiscGlobal;
  class RedirectHome {
    static init(page) {
      if (!Settings.settings.redirect_to_home) return;
      let stableCount = 0;
      const checkAndRedirect = function() {
        var _a, _b, _c, _d, _e;
        const currentSettings = Settings.settings;
        if (MiscGlobal.page_interact && page != "pachinko" || page == "club_champion") {
          Settings.change_settings("redirect_to_home", false);
          return;
        }
        if (page == "pachinko" && ($('.blue_button_L[free="1"]').length || ((_e = (_d = (_c = (_b = (_a = window.pachinkoDef) == null ? void 0 : _a[3]) == null ? void 0 : _b.content) == null ? void 0 : _c.games) == null ? void 0 : _d[0]) == null ? void 0 : _e.button_type) == 1)) {
          Settings.change_settings("redirect_to_home", false);
          return;
        }
        if (page == "activities") {
          const hasButtons = $(".blue_button_L:not([disabled]):visible").length || $(".green_button_L:not([disabled]):visible").length || $(".purple_button_L:not([disabled]):visible").length;
          if ((currentSettings.auto_start_activities || currentSettings.auto_assign_pop) && hasButtons) {
            stableCount = 0;
            setTimeout(checkAndRedirect, 1e3);
            return;
          }
          if (stableCount < 2) {
            stableCount++;
            setTimeout(checkAndRedirect, 1e3);
            return;
          }
        }
        Settings.change_settings("redirect_to_home", false);
        location.href = "/home.html";
      };
      setTimeout(checkAndRedirect, 2e3);
    }
  }
  class HaremPage {
    static init() {
      const settings = Settings.settings;
      var shards_state_list = ["owned", "inprogress", "notowned"];
      for (var i = 0; i < shards_state_list.length; i++) {
        var shard_name = shards_state_list[i];
        if (settings.shards_state[shard_name])
          $(`.shards-state.${shard_name}`).trigger("click");
      }
      $(".shards-state").on("click", function() {
        var btn = $(this).attr("class").replace("check-btn shards-state ", "");
        settings.shards_state[btn] = $(this).attr("shardsstate") == "active";
        Settings.change_settings("shards_state", settings.shards_state);
      });
      for (var carac = 1; carac <= 3; carac++) {
        if (settings.carac_state[`c${carac}`])
          $(`.carac-state[carac="${carac}"]`).trigger("click");
      }
      $(".carac-state").on("click", function() {
        settings.carac_state["c" + $(this).attr("carac")] = $(this).attr("caracstate") == "active";
        Settings.change_settings("carac_state", settings.carac_state);
      });
      var girls = null, interval_collect = false, can_collect = true, $girl_list = $(".girls_list"), start_from = 0, girls_data = [], stop_collect = false, $btnStopCollect, $btnRestartCollect, money_not_collected = 0;
      const checkPopupError = function() {
        var $text_popup = $(
          "#popup_message:not(.popup-not-supported-browser)"
        ), founds = $text_popup.text().match(/(Please try again|Unauthorized Access)/g);
        if (founds === null || !founds.length) return false;
        $btnStopCollect.trigger("click");
        return true;
      };
      $("#popups").bind("DOMNodeInserted", checkPopupError);
      const restart_collect = function() {
        $btnStopCollect.show();
        can_collect = true;
        start_from = 0;
        collect();
      };
      const collect = function() {
        clearInterval(interval_collect);
        interval_collect = setInterval(restart_collect, 12e4);
        $girl_list.bind("DOMNodeInserted", function() {
          if (!can_collect) return;
          can_collect = false;
          collect();
        });
        girls = $("div.girls_list>div[id_girl]>div[girl]:not(.not_owned)");
        collect_girl(start_from);
      };
      const collect_girl = function(i2) {
        if (!girls || i2 >= girls.length || stop_collect || checkPopupError()) {
          if (girls_data.length > 0) {
            Settings.change_settings("girls_data", girls_data);
          }
          return;
        }
        var $girl = $(girls[i2]), after = 0, skip_girl = false, $stars = $girl.find(".graded g");
        girls_data.push({
          name: $girl.find("h4").text(),
          id: +$girl.attr("girl"),
          grade: $stars.length
        });
        $girl.on("click", function() {
          setTimeout(function() {
            $(".diamond-bar .diamond.selected").trigger("mouseenter");
          }, 500);
        });
        if (settings.not_collect_full_graded) {
          var class_attr = $stars.last().attr("class");
          var class_count = 0;
          if (typeof class_attr != "undefined")
            class_count = class_attr.split(/\s+/).length;
          skip_girl = class_count > 0 || $girl.find(".can_upgrade").length > 0;
          money_not_collected += Utils.toint_element(
            $girl.find(".collect_money .s_value")
          );
          if (money_not_collected == StoryHelper.retriveSalary())
            $btnStopCollect.trigger("click");
        }
        if (!$girl.find(".salary.loads").length && !skip_girl) {
          $girl.trigger("click");
          after = settings.timeout_collect_after;
        }
        if (i2 === girls.length - 1) {
          $girl_list.scrollTop($girl_list.prop("scrollHeight") - 300);
          if (!$girl.parent().next().find("div[girl]").hasClass("not_owned"))
            can_collect = true;
          else {
            Settings.change_settings("girls_data_full", true);
            Settings.change_settings("girls_data", girls_data);
            $btnStopCollect == null ? void 0 : $btnStopCollect.hide();
            if (StoryHelper.retriveSalary())
              $btnRestartCollect == null ? void 0 : $btnRestartCollect.trigger("click");
          }
          if (!settings.girls_data_full)
            Settings.change_settings("girls_data", girls_data);
        } else start_from = i2;
        if (!after && i2 % 50 === 0)
          collect_girl(i2 + 1);
        else
          setTimeout(function() {
            collect_girl(i2 + 1);
          }, after);
      };
      const $haremLeft = $("#harem_left");
      var total_salary = StoryHelper.retriveSalary();
      if (settings.auto_collect_harem && !settings.upgrade_girl_redirect && !settings.start_girl_story && !(total_salary == 0 && settings.girls_data.length > 0)) {
        $btnStopCollect = $('<div id="btnStopCollect" class="stop"></div>');
        $btnStopCollect.on("click", function() {
          clearInterval(interval_collect);
          stop_collect = !stop_collect;
          var icon = "";
          if (stop_collect) icon = "▶";
          else restart_collect();
          $(this).html(icon).toggleClass("stop");
        });
        $btnStopCollect.appendTo($haremLeft);
        $btnRestartCollect = $('<div id="btnRestartCollect">⟲</div>');
        $btnRestartCollect.on("click", function() {
          if (!stop_collect) $btnStopCollect.trigger("click");
          $btnStopCollect.trigger("click");
        });
        $btnRestartCollect.appendTo($haremLeft);
        collect();
        $("select").on("change", function() {
          $girl_list.scrollTop(0);
          restart_collect();
        });
      }
      if (settings.upgrade_girl_redirect)
        Settings.change_settings("upgrade_girl_redirect", false);
      const retrive_img = function() {
        return "https://hh.hh-content.com/" + (settings.safe_work ? "design/menu/ic_eyeopen.svg" : "quest/ic_eyeclosed.svg");
      };
      var harem_right = "#harem_right", $btnSafeWork = $('<img class="view" src="' + retrive_img() + '">'), addSafeWork = function() {
        if (settings.safe_work)
          $(harem_right).find(".avatar-box, .missing_girl, .girl-display").addClass("safe-work");
      }, last_dom_id_girl = "0";
      const handleHaremRightChanges = function() {
        addSafeWork();
        var $avatar = $(".avatar"), avatar_src = $avatar.attr("src");
        if (avatar_src)
          $avatar.attr("src", avatar_src.replace("avb", "ava"));
        $(".big_border .g_infos").off("contextmenu.girlPreview").on("contextmenu.girlPreview", function(e) {
          $(this).parent().find("img").trigger("contextmenu");
          return Utils.stopClick(e);
        });
        var id_girl = $("[girl].opened").attr("girl");
        if (!id_girl || last_dom_id_girl == id_girl) return;
        last_dom_id_girl = id_girl;
        setTimeout(function() {
          var _a, _b, _c, _d;
          const girlData = (_a = window.girlsDataList) == null ? void 0 : _a[id_girl];
          if (!girlData) return;
          const awakening_costs = girlData.awakening_costs || 0;
          const $gems = $("#gems-amount");
          if (!$gems.length) return;
          const HeroData = Utils.getHeroData();
          let actual_gems = (_d = (_c = (_b = HeroData == null ? void 0 : HeroData.currencies) == null ? void 0 : _b.hard_currency) == null ? void 0 : _c.amount) != null ? _d : HeroData == null ? void 0 : HeroData.gems;
          if (actual_gems === void 0) {
            const gemsText = $gems.text();
            actual_gems = gemsText.includes("/") ? Utils.toint_string(gemsText.split("/")[1]) : Utils.toint_element($gems);
          }
          $gems.text(`${awakening_costs}/${actual_gems}`);
          if (awakening_costs > actual_gems) {
            $gems.css("color", "#c30009");
          } else {
            $gems.css("color", "");
          }
        }, 100);
      };
      const $haremRightEl = $(harem_right);
      if ($haremRightEl.length) {
        $haremRightEl.append($btnSafeWork);
        const observer = new MutationObserver(handleHaremRightChanges);
        observer.observe($haremRightEl[0], { childList: true, subtree: true });
        handleHaremRightChanges();
      }
      $btnSafeWork.on("click", function() {
        StoryHelper.toggleSafeWork(harem_right + " .avatar-box");
        $(this).attr("src", retrive_img());
      });
      $girl_list.bind("DOMNodeInserted", function() {
        $("#harem_left div.girls_list.grid_view div[girl]>.right").off("contextmenu.girlPreview").on("contextmenu.girlPreview", function(e) {
          $(this).parent().find(".left img").trigger("contextmenu");
          return Utils.stopClick(e);
        });
      });
    }
  }
  const _Css = class _Css {
    static addCss(code, append = false) {
      if (code !== "") _Css.styleContent += "" + code;
      if (append) _Css.appendCss();
    }
    static reset() {
      _Css.styleContent = "";
    }
    static appendCss() {
      $("#customStyle").remove();
      if (_Css.styleContent !== "")
        $("body").append(
          $('<style id="customStyle">' + _Css.styleContent + "</style>")
        );
    }
  };
  _Css.styleContent = "";
  _Css.MAIN = `#popups #heal_girl_labyrinth_popup .flex-container, #popups #labyrinth_reward_popup .flex-container, #popups #level_up .flex-container, #popups #rewards_popup .flex-container, #sliding-popups #heal_girl_labyrinth_popup .flex-container, #sliding-popups #labyrinth_reward_popup .flex-container, #sliding-popups #level_up .flex-container, #sliding-popups #rewards_popup .flex-container, #sliding-popups #heal_girl_labyrinth_popup .flex-container, #sliding-popups #labyrinth_reward_popup .flex-container, #sliding-popups #level_up .flex-container, #sliding-popups #rewards_popup .flex-container{height:530px!important}
    #popups #no_HC .payments-wrapper{transform:translateY(-60px)}
    #pass_reminder_popup,#hero_resources_popup,#no_energy_quest{top:0!important}
    #bg_all>.fixed_scaled>img{object-fit:cover}
    #bg_all>.fixed_scaled>img.invert{transform:scaleX(-1)}
    .nc-panel-preview-girl{
        position: absolute!important;
        z-index: 999999;
        top: 12%;
        left: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .nc-panel-preview-girl .nc-panel{
        width: 1025px;
        height: 520px;
        background: linear-gradient(to top,#572332 0,#572332 1%,#2c1e1c 100%);
        border-radius: 7px;
        padding: 18px;
        display: flex;
        flex-direction: column;
        border: 2px solid #ffa23e;
    }
    .nc-panel-preview-girl .nc-panel-header{
        display: flex;
        justify-content: space-between;
        z-index: 1;
    }
    .nc-panel-preview-girl .nc-panel-header .close_cross{
        margin-top: 4px;
        width: 44px;
        height: 44px;
    }
    .nc-panel-preview-girl .nc-panel-body{
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        flex-wrap: wrap;
        overflow-y: auto;
    }
    .nc-panel-preview-girl .nc-panel-body>img{
        width: 0;
        object-fit: contain;
        cursor: pointer;
    }
    .nc-panel-preview-girl .nc-panel-body>img.zoom{
        width: 100%!important;
        height: auto!important;
        backdrop-filter: brightness(0.8);
        border-radius: 3em;
    }
    .nc-panel-preview-girl .nc-panel-footer{
        display: flex;
        justify-content: space-between;
    }
    .nc-panel-preview-girl .nc-panel-footer p{
        font-size: 1.5em;
        margin: 0;
        line-height: 1em;
        cursor: pointer;
    }
    .nc-panel-preview-girl .current{
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .waifuStory img{
        width: 55px!important;
        height: auto!important;
    }
    .nc-panel-preview-girl .waifuStory img,
    .girl-info-container  .waifuStory img{width:30px!important}
    #popups>#confirm_HC>label, img.classGirl{display: none}
    #leagues_middle .lead_table .nicescroll-rails, #leagues_middle .use-lead-table .nicescroll-rails{top: 0!important}
    .safe-work:not(.unsafe-work){
        opacity: {{SFW_OPACITY}}!important;
        transition: none;
        filter: {{SFW_GRAYSCALE}};
    }
    .link_last_troll{
        color: #fff;
        text-decoration: none;
    }
    .safe-work-ads:not(.unsafe-work){
        opacity: {{SFW_ADS_OPACITY}}!important;
        pointer-events: none!important;
    }
    #popups #rewards_popup .flex-container .info_container a p{font-size:14px}
    #popups #rewards_popup .flex-container .info_container img{width:60%}
    #popups #rewards_popup .flex-container>h1{font-size:55px}
    #popups #labyrinth_reward_popup .flex-container > h1, #popups #heal_girl_labyrinth_popup .flex-container > h1{font-size:35px}
    #popups #level_up .flex-container button, #sliding-popups #level_up .flex-container button, #popups #rewards_popup .flex-container button, #sliding-popups #rewards_popup .flex-container button, #popups #heal_girl_labyrinth_popup .flex-container button, #sliding-popups #heal_girl_labyrinth_popup .flex-container button, #popups #labyrinth_reward_popup .flex-container button, #sliding-popups #labyrinth_reward_popup .flex-container button{
        margin-top:-2rem
    }
    #collect_nothing{
        display: flex!important;
        flex-direction: column!important;
        align-items: center!important;
        text-align: center!important;
        width: 100%!important;
        line-height: 1.7!important;
    }
    #collect_nothing > * {
        display: block!important;
        margin: 2px 0!important;
    }`;
  _Css.CHAMPIONS = `.champions-bottom__rest{font-size: 15px}
    .champions-over__girl-image{z-index:999}
    .champions-over__champion-wrapper{pointer-events:auto!important}
    .btns_container{
        display: flex;
        position: absolute;
        top: 5px;
        right: 149px;
    }
    .btns_container .round_blue_button img{height: 75%}`;
  _Css.HOME = `#homepage .waifuStory{
        position: absolute;
        bottom: 20px;
        left: 49%;
        z-index: 9;
    }
    span.pay-in{display: initial!important}
    #collect_all{cursor: pointer}
    #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .collect-button #collect_all_container #collect_all .collect-infos .cost-text span[cur=hard_currency]::before {
        width: 13px;
        height: 15px;
    }
    #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .season-pov-container .pov-button > a > .button-notification-icon, #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .season-pov-container .season-button > a > .button-notification-icon{margin-top: 0}
    #homepage .main-container .left-side-container .quest-container>a>.button-notification-icon, #homepage .main-container .left-side-container>a>.button-notification-icon{z-index: 999}
    #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .collect-button #collect_all_container #collect_all .collect-infos .cost-text{margin-top: 0}
    #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .season-pov-container .pov-button, #homepage .main-container .middle-container .waifu-and-right-side-container .right-side-container .event-container .season-pov-container .season-button{z-index: 1}
    #homepage .waifu-buttons-container .background-selection, #homepage .waifu-buttons-container .change-bg { display: none !important; }
    #home_pov_bar .text{width: 100%}
    #settingsArea{
        font-size: 12px;
        text-align: left;
        z-index: 99;
        padding: 3px 5px;
        border: 2px solid rgb(144, 83, 18);
        border-radius: 6px;
        background-color: rgba(32, 3, 7, 0.9);
        position: absolute;
        right: 55px;
        top: 47px;
        max-height: 49vh;
        overflow-y: auto;
        display: none;
    }
    #settingsArea.active{display: block}
    #btnSettings{
        z-index: 52;
        height: 35px;
        position: absolute;
        top: 135px;
        right: 15px;
        filter: drop-shadow(#000 0px 0px 5px);
        cursor: pointer;
    }
    .switchSetting {
        position: relative;
        display: inline-block;
        width: 34px;
        height: 17px;
    }
    input:checked + .sliderSetting{background-color: rgb(241, 31, 100)}
    .sliderSetting {
        position: absolute;
        cursor: pointer;
        inset: 0px;
        background-color: rgb(204, 204, 204);
        transition: all 0.4s ease 0s;
        border-radius: 17px;
        margin-right: 4px;
    }
    input:checked + .sliderSetting::before {transform: translateX(13px)}
    .sliderSetting::before {
        position: absolute;
        content: "";
        height: 13px;
        width: 13px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: all 0.4s ease 0s;
        border-radius: 50%;
    }
    .setting-text {
        position: relative
    }
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button{
        -webkit-appearance: none!important;
        margin: 0!important;
    }
    input[type=number]{
        -moz-appearance: textfield!important;
    }
    .setting-text input {
        width: 100px;
        float: left;
        display: block;
        padding: 2px;
        margin: 0;
        border: 1px solid rgb(241, 31, 100);
        border-radius: 4px;
    }
    .setting-text input:focus {
        outline: 0!important;
    }
    .setting-text-nav {
        float: left;
        position: relative;
        height: 20px!important;
    }
    .setting-text-button {
        position: relative;
        cursor: pointer;
        border-left: 1px solid rgb(241, 31, 100);
        width: 15px;
        text-align: center;
        color: #333;
        font-size: 15px;
        line-height: 12px;
        -webkit-transform: translateX(-100%);
        transform: translateX(-100%);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        -o-user-select: none;
        user-select: none;
    }
    .setting-text-button.setting-text-up {
        position: absolute;
        height: 70%;
        top: 0;
        border-bottom: 1px solid rgb(241, 31, 100);
    }
    .setting-text-button.setting-text-down {
        position: absolute;
        bottom: -3px;
        height: 50%;
    }`;
  _Css.POP = `#pop .pop_list .pop_list_scrolling_area .pop_thumb_container {
        margin: 0px 2px 10px;
        width: 100px;
    }
    #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_progress_bar,
    #pop .pop_list .pop_list_scrolling_area .pop_thumb_expanded .pop_thumb_title,
    #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_title{
        width: 95px;
    }
    #pop .pop_list .pop_list_scrolling_area .pop_thumb>button{
        width: 93px;
    }
    #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_progress_bar .pop_thumb_remaining,
    #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_title span{
        font-size:10px
    }
    #pop .pop_list .pop_list_scrolling_area .pop_thumb>.pop_thumb_progress_bar .hh_bar>.backbar{
        width: 90px!important
    }
    .nicescroll-rails{
        display:none!important
    }`;
  _Css.SHOP = `#player-inventory{width:21rem!important}
    #girls_list h3{
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        line-height: 20px;
    }
    #girls_list h3 span{
        width: 100%;
        font-size: 12px;
    }
    #type_item .text{
        font-size: 10px;
    }
    #hideText{
        text-shadow: 0 0 3px #057
    }
    #hideSellButton{
        left: 39px!important
    }
    #arena_filter_box{
        width: 218px!important
    }`;
  _Css.HAREM = `#harem_right{position: relative}
    #harem_right img.view{
        width: 25px;
        position: absolute;
        bottom: 20px;
        left: -10px;
        cursor: pointer;
        z-index: 9;
    }
    .variation_block>.big_border>.variation_girl>.g_infos{z-index: 999}
    #btnStopCollect{
        position: absolute;
        bottom: 0;
        right: 10px;
        font-size: 25px;
        cursor: pointer;
        height: 35px;
        z-index: 100;
    }
    #btnStopCollect.stop{height: 25px;}
    #btnStopCollect.stop::after {
        content: "";
        box-sizing: border-box;
        position: relative;
        display: block;
        width: 20px;
        height: 20px;
        background: currentColor
    }
    #btnRestartCollect{
        position: absolute;
        bottom: 0;
        right: 35px;
        font-size: 25px;
        cursor: pointer;
        height: 35px;
        z-index: 100;
    }`;
  let Css = _Css;
  class GirlPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) {
        $(".girl-avatar, .girl-skills-avatar").addClass("safe-work");
        const applySfw = () => {
          $(".quicknav, a.quicknav-skills").addClass("safe-work");
        };
        applySfw();
        setTimeout(applySfw, 2e3);
      }
      if (settings.start_girl_story) {
        Settings.change_settings("start_girl_story", false);
        var $a = $(".girl_quests").first().find("a");
        if ($a.length) location.href = $a.attr("href");
      }
      var selector_book = ":not(.mythic)";
      if (settings.selected_mythic_item) selector_book = "";
      const selectGirlSlot = function() {
        $(
          `.inventory:visible .inventory-slot:not(.empty-slot) .slot${selector_book}`
        ).last().parent().trigger("click");
      };
      selectGirlSlot();
      setTimeout(selectGirlSlot, 2e3);
      $(".tabs-switcher .switch-tab").on("click", selectGirlSlot);
      Css.addCss(
        `#girl_max_out_popup{margin-top:-5em}
            .btns_container{
                display: flex;
                position: absolute;
                top: 40px;
                right: 5px;
            }
            .btns_container .round_blue_button img{height: 75%}`
      );
    }
  }
  class QuestPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) {
        var scene_selector = "#scene #background, .quest_v2";
        $(scene_selector).addClass("safe-work");
        $("#temp-background").on("dblclick", function() {
          $(scene_selector).trigger("dblclick");
        });
        $("#scene .eye").on("click", function() {
          StoryHelper.toggleSafeWork(scene_selector);
        });
      }
      if (settings.cg_background)
        $("#scene").on("contextmenu", function(e) {
          Settings.change_settings(
            "choosed_bg",
            $(this).find("#background").attr("src")
          );
          return Utils.stopClick(e);
        });
      $("#breadcrumbs>span:nth-child(7)").css("cursor", "pointer").on("click", function() {
        location.reload();
      });
      var $girlBack = $("#breadcrumbs > a:nth-child(5)"), linkGirlBack = $girlBack.attr("href");
      if (linkGirlBack && linkGirlBack.startsWith("/harem/"))
        $girlBack.attr("href", linkGirlBack.replace("harem", "girl"));
    }
  }
  class SeasonArenaPage {
    static init(theme_colors) {
      var _a, _b;
      const settings = Settings.settings;
      const applyStyles = () => {
        if (!settings.auto_color_opponents) {
          $(".opponents_arena .player_team_block.opponent").css({
            outline: "",
            filter: ""
          });
          $(".opponents_arena #player_attack_stat #stats-damage, .opponents_arena #player_ego_stat #stats-ego").css("color", "");
          return;
        }
        const css_hero = "#season-arena .battle_hero";
        const heroPower = Utils.toint_element(
          $(css_hero + " #player_attack_stat #stats-damage")
        );
        const heroCrown = Utils.toint_element(
          $(css_hero + " #player_ego_stat #stats-ego")
        );
        const margin = 1.03;
        let maxXP = -1;
        let minPowerForMaxXP = Infinity;
        let bestIndex = -1;
        const $opponents = $(".opponents_arena .season_arena_opponent_container");
        $opponents.each(function(index) {
          const oppPower = Utils.toint_element($(this).find("#player_attack_stat #stats-damage"));
          const oppCrown = Utils.toint_element($(this).find("#player_ego_stat #stats-ego"));
          const isBeatable = oppPower <= heroPower * margin && oppCrown <= heroCrown * margin;
          if (isBeatable) {
            if (index > maxXP) {
              maxXP = index;
              minPowerForMaxXP = oppPower;
              bestIndex = index;
            } else if (index === maxXP && oppPower < minPowerForMaxXP) {
              minPowerForMaxXP = oppPower;
              bestIndex = index;
            }
          }
        });
        $opponents.each(function(index) {
          const $opponent = $(this);
          const $target = $opponent.find(".player_team_block.opponent");
          const $oppPowerEl = $opponent.find("#player_attack_stat #stats-damage");
          const $oppCrownEl = $opponent.find("#player_ego_stat #stats-ego");
          const oppPower = Utils.toint_element($oppPowerEl);
          const oppCrown = Utils.toint_element($oppCrownEl);
          const $ratingEl = $opponent.find(".matchRating");
          let rating = -1;
          if ($ratingEl.length && $ratingEl.text().includes("%")) {
            rating = parseFloat($ratingEl.text().replace(",", ".").replace("%", ""));
          }
          let isBeatable = oppPower <= heroPower * margin && oppCrown <= heroCrown * margin;
          let color = "";
          let grayscale = "";
          if (rating !== -1) {
            if (rating >= 85) {
              color = theme_colors.green;
              grayscale = "0";
            } else if (rating <= 40) {
              color = theme_colors.red;
              grayscale = "0.6";
            }
          }
          if (color === "") {
            if (!isBeatable) {
              color = theme_colors.red;
              grayscale = "0.6";
            } else {
              if (index === bestIndex) {
                color = theme_colors.green;
                grayscale = "0";
              } else {
                color = theme_colors.orange;
                grayscale = "0.3";
              }
            }
          }
          const textColor = color === theme_colors.green ? theme_colors.green : color === theme_colors.red ? theme_colors.red : "";
          $oppPowerEl.css("color", textColor);
          $oppCrownEl.css("color", textColor);
          $target.css({
            "outline": "3px solid " + color,
            "outline-offset": "-3px",
            "filter": `grayscale(${grayscale})`
          });
        });
      };
      applyStyles();
      if (settings.auto_color_opponents) {
        const observer = new MutationObserver(applyStyles);
        const container = document.querySelector(".opponents_arena");
        if (container) {
          observer.observe(container, { childList: true, subtree: true });
        }
        setTimeout(applyStyles, 1e3);
        setTimeout(applyStyles, 3e3);
      }
      StoryHelper.questLink();
      if (settings.auto_battle) {
        const HeroData = Utils.getHeroData();
        const kissAmount = ((_b = (_a = HeroData == null ? void 0 : HeroData.energies) == null ? void 0 : _a.kiss) == null ? void 0 : _b.amount) || 0;
        const $container = $("#opponents_choose_text");
        $container.empty();
        StoryHelper.autoBattle({
          container: $container,
          defaultCount: kissAmount,
          energyType: "kiss",
          battleType: "season",
          onStart: (count) => {
            const $buttons = $(".green_button_L");
            if ($buttons.length) {
              Settings.change_settings("battle_count_season", count - 1);
              $buttons.first().trigger("click");
            }
          }
        });
      }
    }
  }
  class ShopPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) $(".market-girl").addClass("safe-work");
      $(".market-menu-switch-tab").on("click", function(e) {
        Settings.change_settings("last_link_shop", $(this).attr("type"));
      });
      $(".right-side-title").on("dblclick", function() {
        var items = null, $items_list = $(this).parent().find(".menu-content"), start_from = 0, nb_track = 0, total_slot = 0;
        $items_list.bind("DOMNodeInserted", function() {
          if (nb_track > 5) return;
          nb_track++;
          track();
        });
        const track = function() {
          items = $items_list.find(".slot");
          track_item(start_from);
        };
        const track_item = function(i) {
          if (!items || i >= items.length) return;
          var $item = $(items[i]), nbr_stack = 1, $stack = $item.find(".stack_num");
          if ($stack.length) nbr_stack = Utils.toint_element($stack);
          total_slot += nbr_stack;
          if (i === items.length - 1) {
            $items_list.scrollTop($items_list.prop("scrollHeight"));
            var end = $item.parent().hasClass("empty");
            if (nb_track > 5 || end) {
              if (!end) console.log("more");
              console.log("Total points: " + total_slot * 50);
              return;
            }
          } else {
            start_from = i;
            track_item(i + 1);
          }
        };
        track();
      });
    }
  }
  class ActivitiesPage {
    static init() {
      const settings = Settings.settings;
      const confirm_exceed = function(e, values = {}) {
        const HeroData = Utils.getHeroData();
        if (!HeroData) return;
        var exceed = "";
        if (!values.hasOwnProperty("xp")) values.xp = 0;
        if (!values.hasOwnProperty("troll")) values.troll = 0;
        var new_total_troll_fight = HeroData.energies.fight.amount + values.troll, max_troll_fight = HeroData.energies.fight.max_amount;
        if (values.troll > 0) new_total_troll_fight++;
        if (new_total_troll_fight >= max_troll_fight)
          exceed += `troll fights (in next hour ${new_total_troll_fight}/${max_troll_fight})`;
        if (HeroData.infos.Xp.left <= values.xp) {
          if (exceed != "") exceed += " and ";
          exceed += `experience (${values.xp}/${HeroData.infos.Xp.left} left)`;
        }
        if (exceed != "") {
          if (!confirm("Are you sure? you'll exceed " + exceed))
            return Utils.stopClick(e);
          $(e.target).trigger("click");
        }
      };
      const find_rewards = function(rewards) {
        var results = {};
        for (var i = 0; i < rewards.length; i++) {
          var reward = rewards[i];
          if (reward.type == "xp")
            results.xp = Utils.toint_string(reward.value);
          if (reward.type == "energy_fight")
            results.troll = Utils.toint_string(reward.value);
        }
        return results;
      };
      const change_tab = function() {
        const HeroData = Utils.getHeroData();
        var tab = $(".tabs-switcher .switch-tab.underline-tab").attr(
          "data-tab"
        );
        Settings.change_settings("last_link_activity", tab);
        let blockForContest = false;
        if (settings.not_collect_during_contest_change) {
          blockForContest = Utils.isContestChange(settings);
        }
        switch (tab) {
          case "pop":
            if (settings.auto_press_btns && settings.auto_assign_pop) {
              var $btnExit = $(
                ".pop_right_part .back_button:not([id]):visible"
              );
              if (settings.exit_after_pop_assign && $btnExit.length) {
                Settings.change_settings(
                  "exit_after_pop_assign",
                  false
                );
                setTimeout(function() {
                  $btnExit.trigger("click");
                }, 2e3);
              }
              if ($btnExit.length)
                $('[rel="pop_auto_assign"]').on(
                  "click",
                  function() {
                    if ($('[rel="pop_action"]').is(":disabled"))
                      Settings.change_settings(
                        "auto_assign_pop",
                        false
                      );
                  }
                );
              var $btnPurple = $(".purple_button_L:visible").first();
              $btnPurple.trigger("click");
              if (!$btnPurple.length)
                $(".pop_thumb_container").each(function() {
                  if (!$(this).find(
                    ".pop_thumb_progress_bar:visible"
                  ).length) {
                    Settings.change_settings(
                      "exit_after_pop_assign",
                      true
                    );
                    $(this).find(
                      'button[rel="pop_thumb_info"]:visible'
                    ).trigger("click");
                  }
                });
            }
            if (settings.safe_work)
              $(
                ".pop_thumb_container img, img[girl-ava-src]"
              ).addClass("safe-work");
            break;
          case "contests":
            if (settings.safe_work) {
              $(".right_part>img").addClass("safe-work");
              StoryHelper.safeWorkBackground(".contest_header");
            }
            if (settings.confirm_exceed)
              $(
                '.contest .personal_rewards button[rel="claim"]:visible'
              ).on("mousedown", function(e) {
                var rewards_string = $(e.target).parent().find(".reward_wrap").attr("data-reward-display"), rewards = JSON.parse(rewards_string).rewards;
                if (confirm_exceed(e, find_rewards(rewards)))
                  return;
              });
            break;
          case "daily_goals":
            if (settings.safe_work)
              $(".daily-goals-right-part>img").addClass("safe-work");
            if (settings.confirm_exceed)
              $(".progress-bar-rewards-container").on(
                "mousedown",
                function(e) {
                  var rewards_string = $(e.target).parent().find(".progress-bar-reward-chest").attr("data-rewards"), rewards = JSON.parse(rewards_string).rewards;
                  if (confirm_exceed(e, find_rewards(rewards)))
                    return;
                }
              );
            if (!$(".nicescroll-cursors").length) {
              $(".daily-goals-objectives-container").addClass(
                "can_scroll"
              );
              Css.addCss(
                ".daily-goals-objectives-container.can_scroll{overflow-y:auto!important}",
                true
              );
            }
            break;
          default:
            if (settings.auto_press_btns && !blockForContest) {
              const $collectibleMissions = $(
                ".mission_object"
              ).filter(function() {
                return $(this).find("button.purple_button_L:visible").length > 0;
              });
              const $nonLegendaryCollectible = $collectibleMissions.not(".legendary");
              $collectibleMissions.each(function() {
                const $mission = $(this);
                const $btn = $mission.find(
                  "button.purple_button_L:visible"
                );
                if (settings.avoid_legendary_first && $mission.hasClass("legendary") && $nonLegendaryCollectible.length > 0) {
                  return;
                }
                if (HeroData && HeroData.infos && HeroData.infos.Xp.left <= settings.min_collect_exp && $mission.find(".mission_reward .slot_xp").length)
                  return;
                $btn.trigger("click");
              });
              if ($(".end_gift:visible").length)
                $(".end_gift button").trigger("click");
            }
            if (settings.confirm_exceed)
              $("button.purple_button_L:visible").on(
                "mousedown",
                function(e) {
                  var rewards_string = $(e.target).parent().parent().find(".mission_reward .reward_wrap").attr("data-reward-display"), rewards = JSON.parse(rewards_string).rewards;
                  if (confirm_exceed(e, find_rewards(rewards)))
                    return;
                }
              );
            if (settings.auto_start_activities) {
              const $startableMissions = $(
                ".mission_object"
              ).filter(function() {
                return $(this).find(
                  ".mission_button .blue_button_L:visible"
                ).length > 0;
              });
              const $nonLegendaryStartable = $startableMissions.not(".legendary");
              $startableMissions.each(function() {
                const $mission = $(this);
                const $btn = $mission.find(
                  ".mission_button .blue_button_L:visible"
                );
                if (settings.avoid_legendary_first && $mission.hasClass("legendary") && $nonLegendaryStartable.length > 0) {
                  return;
                }
                $btn.trigger("click");
              });
            }
            break;
        }
      };
      if (settings.safe_work)
        $(".mission_image, .timer-girl-container").addClass("safe-work");
      change_tab();
      $(".tabs-switcher .switch-tab").on("click", change_tab);
    }
  }
  class PantheonPage {
    static init(page_interact) {
      const settings = Settings.settings;
      if (settings.safe_work)
        $(
          ".team-girl-container, #rewards-girl-container img, .pantheon-container .pantheon_bgr .stage-bgr"
        ).addClass("safe-work");
      if (settings.auto_battle) {
        const checkPantheonReady = setInterval(() => {
          var _a, _b, _c;
          const $btnPantheon = $(".pantheon-pre-battle-btn:visible").first();
          if ($btnPantheon.length && $(".bottom-container").length) {
            clearInterval(checkPantheonReady);
            const href = $btnPantheon.attr("href");
            const id_opponent = (_a = href == null ? void 0 : href.match(/[?&]id_opponent=(\d+)/)) == null ? void 0 : _a[1];
            if (id_opponent) {
              const HeroData = Utils.getHeroData();
              const worshipAmount = ((_c = (_b = HeroData == null ? void 0 : HeroData.energies) == null ? void 0 : _b.worship) == null ? void 0 : _c.amount) || 0;
              const $container = $('<div style="width: 100%; display: flex; justify-content: center; margin-bottom: 10px;"></div>');
              $(".bottom-container").css({
                "flex-wrap": "wrap",
                "height": "120px",
                "left": "25%"
              }).prepend($container);
              StoryHelper.autoBattle({
                container: $container,
                defaultCount: worshipAmount,
                energyType: "worship",
                battleType: "pantheon",
                onStart: (count) => {
                  var _a2;
                  const currentHref = $(".pantheon-pre-battle-btn:visible").first().attr("href");
                  const currentId = ((_a2 = currentHref == null ? void 0 : currentHref.match(/[?&]id_opponent=(\d+)/)) == null ? void 0 : _a2[1]) || id_opponent;
                  Settings.change_settings("battle_count_pantheon", count - 1);
                  setTimeout(() => {
                    window.location.assign(`/pantheon-battle.html?number_of_battles=1&id_opponent=${currentId}`);
                  }, 200);
                }
              });
            }
          }
        }, 500);
        setTimeout(() => clearInterval(checkPantheonReady), 15e3);
      }
      if (settings.pantheon_auto_enter) {
        const auto_enter = function() {
          const currentCount = parseInt(Settings.settings.battle_count_pantheon, 10) || 0;
          if (currentCount > 0) return;
          var $btnPantheon = $(".pantheon-pre-battle-btn:visible").first();
          if ($btnPantheon.length && $(".tabs-switcher #pantheon_tab").hasClass(
            "underline-tab"
          ) && !page_interact && $("#scriptPantheonAttempts").text() != "0")
            location.href = $btnPantheon.attr("href");
        };
        setTimeout(auto_enter, settings.pantheon_auto_enter_wait * 1e3);
        $(".tabs-switcher .switch-tab").on("click", auto_enter);
      }
    }
  }
  class EventPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work)
        $(
          ".girl-avatar, .nc-event-reward-preview #carousel, .sm-static-girl"
        ).addClass("safe-work");
      $(".nc-event-list-reward-container").on("click", function() {
        if (settings.safe_work) var interval = setInterval(function() {
          var $girl = $(
            ".animated-girl-display, img[girl-ava-src], .gradient_mask>img"
          );
          if ($girl.length) {
            $girl.addClass("safe-work");
            clearInterval(interval);
          }
        }, 5);
        StoryHelper.fixDiamondImg();
      });
      var tempGirlAnimation = null;
      $("body").on("keydown", function(e) {
        var _a;
        if (e.keyCode !== 37 && e.keyCode !== 39) return;
        var selector = ".nc-event-list-reward-container", $actualGirl = $(selector + ".selected");
        var $girl = e.keyCode === 37 ? $actualGirl.prev(selector) : e.keyCode === 39 ? $actualGirl.next(selector) : false;
        if ($girl && $girl.length) {
          var selectedGirlId = $girl.find(".nc-event-list-reward").data("selectGirlId");
          var girlHasAnimation = false;
          window.eventGirls.forEach(function(eventGirl) {
            if (eventGirl.id_girl == selectedGirlId && eventGirl.hasOwnProperty("animated_grades") && eventGirl.animated_grades.includes("0")) {
              girlHasAnimation = true;
            }
          });
          $(".nc-event-list-reward-container").removeClass("selected");
          $(".nc-event-reward-container").removeClass("selected");
          $(
            `.nc-event-reward-container[data-reward-girl-id=${selectedGirlId}]`
          ).addClass("selected");
          $girl.addClass("selected");
          if (tempGirlAnimation !== null) {
            tempGirlAnimation.removeCurrentAnimation();
            $(".nc-event-reward-container .nc-event-reward-preview").find("canvas").remove();
            $(
              `.nc-event-reward-container[data-reward-girl-id=${selectedGirlId}] .nc-event-reward-preview`
            ).find("canvas").remove();
          }
          if (girlHasAnimation) {
            const HeroData = Utils.getHeroData();
            if (!((_a = HeroData == null ? void 0 : HeroData.infos) == null ? void 0 : _a.no_pachinko_anim)) {
              $(
                `.nc-event-reward-container[data-reward-girl-id=${selectedGirlId}] .nc-event-reward-preview`
              ).find("img").remove();
              $(
                `.nc-event-reward-container[data-reward-girl-id=${selectedGirlId}] .nc-event-reward-preview`
              ).append(
                `<canvas class="animated-girl-display" id="id_${selectedGirlId}_grade_0_animated"></canvas>`
              );
              tempGirlAnimation = new window.GirlAnimation();
              tempGirlAnimation.initAnimation(
                selectedGirlId,
                0,
                "/images/pictures/girls/",
                0.3
              );
            }
          }
        }
        return Utils.stopClick(e);
      });
      if ($("#boss_bang").length) {
        var bang_selector = ".boss-bang-team-slot", bang_selected = bang_selector + ".selected-boss-bang-team";
        $("#start-bang-button").on("click", function() {
          Settings.change_settings("last_bang_team_points_active", true);
        });
        if (settings.last_bang_team_points_active) {
          Settings.change_settings("last_bang_team_points_active", false);
          var $el_bang = $(bang_selected).find(
            ".boss-bang-team-ego span:first-child"
          ), new_point = (Utils.toint_element($el_bang) - settings.last_bang_team_points) / 10, $score = 'green">+ ';
          if (new_point < 0) $score = '#e98100">';
          $el_bang.after(
            ` <span style="color:${$score}${new_point}%</span>`
          );
        }
        $(bang_selector).on("click", function() {
          Settings.change_settings(
            "last_bang_team_points",
            Utils.toint_element(
              $(this).find(".boss-bang-team-ego span:first-child")
            )
          );
        });
        $(bang_selected).trigger("click");
      }
      Css.addCss(
        "#dp-content .left-container .tiers-container .player-progression-container{height:125%}"
      );
    }
  }
  class SideQuestsPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) $(".side-quest-image").addClass("safe-work");
      $(".side-quest-button").on("click", function() {
        Settings.change_settings("last_side_quest", $(this).attr("href"));
      });
    }
  }
  class PachinkoPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) {
        setInterval(function() {
          $(".pachinko_img").addClass("safe-work");
        }, 100);
        $("canvas, .pachinko_img, .game-simple-block>img").addClass(
          "safe-work"
        );
      }
      StoryHelper.questLink();
      setInterval(function() {
        $("#play_again").off("click.autoPress").on("click.autoPress", function() {
          Settings.change_settings("pachinko_press_btn", false);
        });
      }, 500);
    }
  }
  class FinalCss {
    static init(page) {
      const settings = Settings.settings;
      Css.reset();
      Css.addCss(
        Css.MAIN.replace(
          "{{SFW_OPACITY}}",
          settings.safe_work_opacity.toString()
        ).replace(
          "{{SFW_GRAYSCALE}}",
          settings.safe_work_grayscale ? "grayscale(1)" : "none"
        ).replace(
          "{{SFW_ADS_OPACITY}}",
          settings.safe_work_ads_opacity.toString()
        )
      );
      if (page === "penta_drill") {
        Css.addCss(".pd-controls{float:right}");
      }
      if (page === "season") {
        Css.addCss(
          "#ad_season .iframe-container{height:fit-content!important;margin-top:20px}"
        );
      }
      if (page === "home") {
        Css.addCss(Css.HOME);
      }
      if (page === "harem") {
        Css.addCss(Css.HAREM);
      }
      if (page === "champions" || page === "club_champion" || page === "champions_map") {
        Css.addCss(Css.CHAMPIONS);
      }
      if (page === "shop") {
        Css.addCss(Css.SHOP);
      }
      if (page === "activities") {
        Css.addCss(Css.POP);
      }
      if (settings.header_link_show)
        Css.addCss(
          "#common-popups.fixed_scaled, #sliding-popups.fixed_scaled, #black_screen{top: 10%}",
          true
        );
      if (settings.back_to_link)
        Css.addCss(
          `.back-to {
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    color: white;
                    text-decoration: none;
                    text-shadow: 0 0px 2px black;
                }`,
          true
        );
      Css.appendCss();
    }
  }
  const _SafeWorkGlobal = class _SafeWorkGlobal {
    static init() {
      const settings = Settings.settings;
      if (!settings.safe_work) {
        $(".safe-work, .safe-work-ads").removeClass("safe-work safe-work-ads");
        return;
      }
      if (this.initialized) return;
      this.initialized = true;
      const selectors = [
        "#girls_holder #left_girl",
        "#girls_holder #right_girl",
        ".animated-girl-display:not(#carousel .animated-girl-display):not(.girls-reward-container .animated-girl-display)",
        ".payments-left-girl",
        ".payments-right-girl",
        "#no_energy_worship>img",
        "#no_energy_fight>img",
        "#no_energy_kiss>img",
        "#no_energy_challenge>img",
        "#awakening_popup .awakening-avatar",
        "#no_energy_quest>img",
        ".gradient_mask>img",
        ".member-progression-bg .page-girl>img",
        ".league_girl .girl-preview",
        ".feature-girl .avatar",
        "#pop .pop_left_part .pop_girl_avatar .pop_left_fade_list",
        ".payments .product-background",
        ".product-offer-background-container",
        ".monthly_card .rewards-container",
        ".bundle-offer-container.treasure-bg",
        ".passes #left_girl",
        ".passes #right_girl",
        ".prestige_girl",
        "#pov_pog_passes_popup .avatar",
        ".hero_info .bottom .img_wrapper",
        ".girl-image-container",
        ".girl-display img[girl-ava-src]",
        ".girls-reward-container img.girl",
        ".raid-content .girl-img",
        ".labyrinth-girl-img",
        ".shop-labyrinth-girl",
        'body[page="world_boss_event"] .girl.avatar'
      ].join(", ");
      const applySafeWork = () => {
        $(selectors).addClass("safe-work");
        $('[id^="ad_"], [class^="ad_"]').addClass("safe-work-ads");
        const $heroPage = $("#hero_pages");
        if ($heroPage.length) {
          $heroPage.find(".girls, .img_wrapper").addClass("safe-work");
        }
        StoryHelper.safeWorkBackground("div.design-template-reward-center");
      };
      applySafeWork();
      const observer = new MutationObserver(applySafeWork);
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      StoryHelper.unsafeWork();
    }
  };
  _SafeWorkGlobal.initialized = false;
  let SafeWorkGlobal = _SafeWorkGlobal;
  class HomePage {
    static init() {
      var _a, _b;
      const settings = Settings.settings;
      if (settings.journey_champion) {
        Settings.change_settings("journey_champion", false);
      }
      if (settings.champions_tour_active) {
        Settings.change_settings("champions_tour_active", false);
      }
      if (settings.safe_work) {
        $(".news_wrapper").bind("DOMNodeInserted", function() {
          $(".news_thumb_pic, .news_page_pic").addClass("safe-work");
        });
        $(".waifu-container").addClass("safe-work");
      }
      $("#collect_all .collect-infos .sum").after($("<br>"));
      const amountAttr = $("#collect_all .sum").attr("amount");
      if (!$(".free-text:visible").length && amountAttr !== void 0 && Utils.toint_string(amountAttr) >= settings.minimum_money_open_harem)
        $("#collect_all_container").on("click", function() {
          location.href = "/harem.html";
        });
      if (settings.auto_press_btns) {
        const $collectBtn = $("#collect_all:not(:disabled)");
        if ($collectBtn.length && $collectBtn.is(":visible")) {
          $collectBtn.trigger("click");
        }
        if (((_b = (_a = window.shared) == null ? void 0 : _a.general) == null ? void 0 : _b.hh_ajax) && $("#ad_home").length) {
          window.shared.general.hh_ajax(
            { action: "update_advertise_time" },
            () => {
              $("#ad_home").remove();
            }
          );
        }
      }
      var routes = [
        {
          link: "/pachinko.html",
          selector: "#scriptPachinkoTimer",
          check: 'a[rel="pachinko"]',
          notifs: $("body").attr("id") != "hh_star"
        },
        {
          link: StoryHelper.links.shop + "potion",
          selector: 'a[rel="shop"] span[rel="expires"]',
          check: 'a[rel="shop"]',
          notifs: false
        },
        {
          link: StoryHelper.links.activity + "missions",
          selector: "#missionsTimer1:visible",
          check: 'a[rel="activities"]',
          notifs: false
        },
        {
          link: settings.last_link_champion,
          selector: "#scriptChampionsTimer:visible",
          check: 'a[rel="sex-god-path"]',
          notifs: false
        },
        {
          link: "/club-champion.html",
          selector: 'a[rel="clubs"] span[rel="expires"]',
          check: 'a[rel="clubs"]',
          notifs: false
        },
        {
          link: "/season.html",
          selector: "#scriptSeasonTime",
          check: "#kisses_data>a",
          notifs: false
        },
        {
          link: "/path-of-valor.html",
          selector: "#scriptPovTime",
          check: 'a[rel="path-of-valor"]',
          notifs: false
        },
        {
          link: "/path-of-glory.html",
          selector: "#scriptPogTime",
          check: 'a[rel="path-of-glory"]',
          notifs: false
        },
        {
          link: StoryHelper.links.activity + "pop",
          selector: "#scriptPoPTimer span:visible",
          check: "#pop_data>a",
          notifs: false
        }
      ];
      const redirectPage = function(route) {
        Settings.change_settings("redirect_to_home", true);
        location.href = route.link;
      };
      setInterval(function() {
        const currentSettings = Settings.settings;
        if (currentSettings.redirect_to_home) return;
        Utils.isContestChange(currentSettings);
        for (var i = 0; i < routes.length; i++) {
          var route = routes[i];
          const link = String(route.link || "");
          const isActivity = link.includes("activities.html");
          const shouldCheck = currentSettings.retrive_home_timer || isActivity && currentSettings.auto_start_activities;
          if (!shouldCheck) continue;
          if (route.notifs && $(route.check).find(
            ".button-notification-icon:not(.button-notification-doubleshards)"
          ).length)
            redirectPage(route);
          if ($(route.selector).text() == "0s") {
            if (!currentSettings.auto_assign_pop && route.link == StoryHelper.links.activity + "pop")
              continue;
            if (route.check != "" && $(route.check).attr("href") == "#")
              continue;
            redirectPage(route);
          }
          if (Settings.settings.redirect_to_home) break;
        }
      }, 2500);
      setInterval(function() {
        var timersList = [
          "#scriptPogTime",
          "#scriptPovTime",
          "#scriptSeasonTime",
          '[rel="seasonal-event"] [rel="expires"]',
          '[rel="event"] [rel="expires"]',
          '[rel="mythic_event"] [rel="expires"]',
          '[rel="sm_event"] [rel="expires"]',
          '[rel="cumback_contest"] [rel="expires"]',
          '[rel="boss_bang_event"] [rel="expires"]',
          '[rel="path_event"] [rel="expires"]',
          '[rel="dp_event"] [rel="expires"]',
          '[rel="kinky_event"] [rel="expires"]',
          '[rel="legendary_contest"] [rel="expires"]',
          '[rel="double_pachinko_event"] [rel="expires"]',
          '[rel="mega-event"] [rel="expires"]'
        ];
        for (var i = 0; i < timersList.length; i++) {
          var $timer = $(timersList[i]), timers = $timer.text().trim().split(" ");
          if (timers.length && !$timer.parent().attr("data-seconds-until-start")) {
            var timer = timers[0];
            var color = "";
            if (timer == "3g" || timer == "4g" || timer == "5g" || timer == "3d" || timer == "4d" || timer == "5d")
              color = "#fffa71";
            if (timer == "1g" || timer == "2g" || timer == "1d" || timer == "2d")
              color = "#ff8d00";
            if (timer == "0g" || timer == "0d" || timer.slice(-1) != "g" && timer.slice(-1) != "d")
              color = "#d61350";
            $timer.css({
              color,
              "text-shadow": "0 0 1px #fff"
            });
          }
        }
      }, 1e3);
      let waifuInitialized = false;
      const init_change_waifu = function() {
        if (waifuInitialized) return;
        if (settings.random_waifu) {
          if (!settings.girls_data || !settings.girls_data.length) {
            return;
          }
          waifuInitialized = true;
          var $waifu_container = $(".waifu-container>img"), src = $waifu_container.attr("src");
          $waifu_container.on("error", function() {
            setTimeout(change_waifu, 100);
          });
          const change_waifu = function() {
            const girls = settings.girls_data;
            var random_waifu = Utils.random(girls.length - 1), selected_waifu = girls[random_waifu], max_grade = selected_waifu.grade || 5, random_grade = Utils.random(max_grade, 1), image = StoryHelper.generateImg(
              selected_waifu.id,
              random_grade,
              src
            );
            $waifu_container.attr("src", image).attr(
              "title",
              `${selected_waifu.name} (Grade ${random_grade}/${max_grade})`
            );
            StoryHelper.appendStory(
              ".waifu-and-right-side-container",
              selected_waifu.id
            );
          };
          change_waifu();
          setInterval(
            change_waifu,
            settings.change_waifu_interval * 1e3
          );
          var timeoutWaifu = false;
          $waifu_container.on("click", function() {
            clearTimeout(timeoutWaifu);
            timeoutWaifu = setTimeout(function() {
              if (!StoryHelper.unsafe_click) change_waifu();
              StoryHelper.unsafe_click = false;
            }, 300);
          }).css("cursor", "pointer");
        }
      };
      init_change_waifu();
      $(".waifu-buttons-container .eye").on("click", init_change_waifu);
      setTimeout(function() {
        if (settings.last_links) {
          if (settings.last_side_quest)
            $(".continue_side_quest_home, .side_quests").attr(
              "href",
              settings.last_side_quest
            );
          var $activitiesLink = $('a[rel="activities"]');
          $activitiesLink.find(`a[href^="${StoryHelper.links.activity}"]`).on("click", StoryHelper.changeLastActivityLink);
          if (settings.last_link_activity)
            $activitiesLink.attr(
              "href",
              StoryHelper.links.activity + settings.last_link_activity
            );
          StoryHelper.shopMenuLink();
          if (settings.last_link_shop)
            $('a[rel="shop"]').attr(
              "href",
              StoryHelper.links.shop + settings.last_link_shop
            );
          StoryHelper.championMenuLink();
          if (settings.last_link_champion)
            $(".champions_map").attr(
              "href",
              settings.last_link_champion
            );
        }
      }, 200);
      var $containerSettings = $("#contains_all");
      var $toggleSettings = $(
        '<img src="https://hh.hh-content.com/design/menu/panel.svg" id="btnSettings"></img>'
      );
      var $settingsArea = $('<div id="settingsArea"></div>');
      $toggleSettings.appendTo($containerSettings).on("click", function() {
        $settingsArea.toggleClass("active");
      });
      $settingsArea.appendTo($containerSettings);
      const $cg_bg_preview = $('<img id="cg_bg_preview" style="width: 250px; position: fixed; right: 75px; top: 67px; border-radius: 6px; display: none; border: 2px solid #ffa23e; z-index: 10000; box-shadow: 0 0 15px rgba(0,0,0,0.8); cursor: pointer;">');
      $cg_bg_preview.appendTo("body").on("click", function() {
        $(this).fadeOut(200);
        previewPermanent = false;
      });
      let previewPermanent = false;
      var settings_to_generate = [
        {
          name: "auto_press_btns",
          text: "Auto-press buttons",
          hint: "Automatically clicks 'OK', 'Confirm' and skip buttons in battles/popups.",
          onchange: function(value) {
            if (!value) {
              Settings.change_settings("auto_battle", false);
              Settings.change_settings("auto_assign_pop", false);
              Settings.change_settings("auto_fill_team", false);
              $('input[setting="auto_battle"], input[setting="auto_assign_pop"], input[setting="auto_fill_team"]').prop("checked", false).prop("disabled", true);
            } else {
              $('input[setting="auto_battle"], input[setting="auto_assign_pop"], input[setting="auto_fill_team"]').prop(
                "disabled",
                false
              );
            }
          }
        },
        {
          name: "auto_battle",
          text: "Auto-battle",
          indent: true,
          hint: "Enables the automatic battle counter in battle pages."
        },
        {
          type: "time",
          text: "Auto-battle start time",
          nameHour: "auto_battle_start_hour",
          nameMin: "auto_battle_start_minute",
          indent: true,
          hint: "If current time is before this, auto-battle uses all energy. Otherwise, it calculates regeneration until contest start."
        },
        {
          type: "time",
          text: "Contest start time",
          nameHour: "contest_start_hour",
          nameMin: "contest_start_minute",
          indent: true
        },
        {
          type: "time",
          text: "Contest end time",
          nameHour: "contest_end_hour",
          nameMin: "contest_end_minute",
          indent: true
        },
        {
          name: "auto_assign_pop",
          text: "Auto-assign PoP",
          indent: true,
          hint: "Automatically sends girls to the Place of Power when the timer ends."
        },
        {
          name: "auto_fill_team",
          text: "Auto-fill empty teams",
          indent: true,
          hint: "Automatically clicks the auto-fill team button in team edit pages (Labyrinth, Seasons, etc) if a slot is empty."
        },
        {
          name: "safe_work",
          text: "SFW Filter",
          hint: "Blurs images of girls. Double-click an image to reveal it temporarily.",
          onchange: function(value) {
            Settings.change_settings("safe_work", value);
            $(".waifu-container").toggleClass("safe-work", value);
            FinalCss.init("home");
            SafeWorkGlobal.init();
            MiscGlobal.applyBackground("home");
          },
          stopafterchange: true
        },
        {
          name: "safe_work_grayscale",
          text: "SFW Grayscale",
          indent: true,
          hint: "Enables grayscale effect on blurred images when SFW Filter is active.",
          onchange: function(value) {
            Settings.change_settings("safe_work_grayscale", value);
            FinalCss.init("home");
          }
        },
        {
          name: "safe_work_opacity",
          text: "SFW Opacity",
          indent: true,
          type: "number",
          min: 0,
          max: 1,
          step: 0.05,
          onchange: function(value) {
            Settings.change_settings("safe_work_opacity", value);
            FinalCss.init("home");
          }
        },
        {
          name: "safe_work_ads_opacity",
          text: "SFW Ads Opacity",
          indent: true,
          type: "number",
          min: 0,
          max: 1,
          step: 0.05,
          onchange: function(value) {
            Settings.change_settings("safe_work_ads_opacity", value);
            FinalCss.init("home");
          }
        },
        {
          name: "random_waifu",
          text: "Random waifu image",
          hint: "To populate the list of girls, go to Change teams > Edit team (Click here to go directly). This will automatically save all your owned girls."
        },
        {
          name: "change_waifu_interval",
          text: "Waifu rotation interval (s)",
          indent: true,
          type: "number",
          min: 2
        },
        {
          name: "auto_color_opponents",
          text: "Color opponents (Season & Drill)",
          hint: "Colors opponents in Season and Penta Drill based on their difficulty."
        },
        {
          name: "pantheon_auto_enter",
          text: "Auto-enter Pantheon"
        },
        {
          name: "pantheon_auto_enter_wait",
          text: "Wait before enter (s)",
          indent: true,
          type: "number",
          min: 2,
          step: 1
        },
        {
          name: "journey_champion_active",
          text: "Champion Journey",
          hint: "Enables automatic navigation and assistance for the Champions' Path. Tip: Right-click the 'Clubs' menu icon to start a full automated Champions Tour!"
        },
        {
          name: "selected_mythic_item",
          text: "Prioritize Mythic Items",
          hint: "Automatically selects the Mythic equipment tab on girl pages."
        },
        {
          name: "confirm_exceed",
          text: "Reward Overflow Warning",
          hint: "Asks for confirmation before claiming rewards if they exceed your capacity (XP/Troll energy)."
        },
        {
          name: "min_collect_exp",
          text: "Min XP Collection",
          indent: true,
          type: "number",
          min: 1,
          step: 100
        },
        {
          name: "retrive_home_timer",
          text: "Retrive automatically home timer",
          hint: "Goes back to home if a timer expires (Pachinko, PoP, Market) to refresh them."
        },
        {
          name: "auto_start_activities",
          text: "Auto-start Activities",
          hint: "Automatically starts missions and daily goals when you visit the page."
        },
        {
          name: "not_collect_during_contest_change",
          text: "Wait for Contest Change",
          indent: true,
          hint: "Prevents collecting missions between the end of one contest and the start of the next (starting missions is still allowed)."
        },
        {
          name: "avoid_legendary_first",
          text: "Defer Legendary Missions",
          indent: true,
          hint: "Starts/collects normal missions before legendary ones to optimize regeneration."
        },
        {
          name: "auto_collect_harem",
          text: "Harem Auto-Collect",
          hint: "Starts collecting money from girls automatically when you enter the Harem."
        },
        {
          name: "not_collect_full_graded",
          text: "Collect Only Maxed Girls",
          indent: true,
          hint: "Skips money collection for girls that aren't at their maximum grade yet."
        },
        {
          name: "timeout_collect_after",
          text: "Harem Collection Delay (ms)",
          indent: true,
          hint: "Delay between each girl's collection. Increase if you get 'Unauthorized Access' errors.",
          type: "number",
          min: 25,
          step: 100
        },
        {
          name: "minimum_money_open_harem",
          text: "Min money to enter harem",
          indent: true,
          type: "number",
          min: 0,
          step: 1e3
        },
        {
          name: "last_links",
          text: "Smart Menu Links",
          hint: "Updates side menu links (Shop, Activities, Champions) with the last tab you visited."
        },
        {
          name: "link_last_troll",
          text: "Shortcut to Last Troll",
          indent: true,
          hint: "Shows a direct link to your last fought troll on the world map."
        },
        {
          name: "back_to_link",
          text: "Smart 'Back' Link",
          indent: true,
          hint: "Adds a 'Back' button to pre-battle pages to return to the previous screen."
        },
        {
          name: "header_link_show",
          text: "Post-Battle Shortcuts",
          indent: true,
          hint: "Shows helpful navigation links (Harem, Shop, etc.) after a battle."
        },
        {
          name: "cg_background",
          text: "Custom Background",
          hint: "Go to Messenger or Story (girl or quest), right-click on an image to set it as background. Important: SFW filter must be disabled.",
          onchange: function(value) {
            Settings.change_settings("cg_background", value);
            MiscGlobal.applyBackground("home");
          }
        },
        {
          name: "invert_bg",
          text: "Flip Background",
          indent: true,
          onchange: function(value) {
            Settings.change_settings("invert_bg", value);
            MiscGlobal.applyBackground("home");
          }
        },
        {
          name: "girls_data_export",
          text: "Export girls data",
          hint: "To export girl names, level, and max grade status to clipboard, go to Change teams > Edit team (Click here to go directly) and press Ctrl+C."
        },
        {
          name: "auto_switch_lang_export",
          text: "Switch lang when export",
          indent: true,
          hint: "Automatically toggles between English and your original language when you click the export link or press Ctrl+C."
        },
        {
          name: "max_days_club",
          text: "Club Inactivity Limit (days)",
          type: "number",
          min: 1
        }
      ];
      for (var index = 0; index < settings_to_generate.length; index++) {
        var setting = settings_to_generate[index];
        Settings.generateSetting(setting, $settingsArea);
        if (setting.name === "cg_background") {
          const $hint = $settingsArea.find('span[title*="Messenger"]').last();
          const $viewIcon = $('<span style="cursor:pointer; margin-left:5px;" title="View current background">👁️</span>');
          $viewIcon.insertAfter($hint);
          $viewIcon.on("mouseenter", function() {
            if (Settings.settings.choosed_bg && !previewPermanent) {
              $cg_bg_preview.attr("src", Settings.settings.choosed_bg).stop().fadeIn(200);
            }
          }).on("mouseleave", function() {
            if (!previewPermanent) {
              $cg_bg_preview.stop().fadeOut(200);
            }
          }).on("click", function() {
            if (Settings.settings.choosed_bg) {
              previewPermanent = !previewPermanent;
              if (previewPermanent) {
                $cg_bg_preview.attr("src", Settings.settings.choosed_bg).stop().fadeIn(200);
              } else {
                $cg_bg_preview.stop().fadeOut(200);
              }
            }
          });
        }
      }
      $settingsArea.find('span[title*="Edit team"]').each(function() {
        $(this).css({
          cursor: "pointer"
        }).after('<span style="font-size: 10px; margin-left: 2px; cursor: pointer;">↗️</span>');
      });
      $settingsArea.on("click", 'span[title*="Edit team"], span:contains("↗️")', function() {
        location.href = "/edit-team.html?battle_type=seasons&id_team=";
      });
      if (!settings.auto_press_btns) {
        $('input[setting="auto_battle"], input[setting="auto_assign_pop"], input[setting="auto_fill_team"]').prop("disabled", true);
      }
      $settingsArea.append(
        $('<button style="display:block; margin: 10px auto 5px; background: transparent; border: 1px solid #777; color: #777; cursor: pointer; font-size: 10px; border-radius: 3px; padding: 2px 5px;">Reset to defaults</button>').on("click", function() {
          if (confirm("Are you sure you want to reset all settings to default?")) {
            Settings.clear_settings();
            location.reload();
          }
        })
      );
      $settingsArea.append(
        $(
          '<p style="text-align:center; margin-bottom:0">All docs at <a href="https://sleazyfork.org/en/scripts/436188-hentai-heroes-helper-auto-collect-button-press-and-more" target="_blank" style="color:white" title="Docs">sleazyfork.org</a></p>'
        )
      );
    }
  }
  class WorldPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) {
        $("div.girl_world, div.troll_world").addClass("safe-work");
        Css.addCss(
          "#worldmap div.troll_world{pointer-events:auto!important}"
        );
      }
    }
  }
  class SeasonalPage {
    static init() {
      Css.addCss(
        `.seasonal-event-panel .seasonal-event-container .tabs-section #home_tab_container .middle-container .girls-reward-container canvas.animated-girl-display{z-index:0!important}
            .mega-slot:has(.slot_lively_scene){background:#ffb827;border-radius:5px}`
      );
    }
  }
  class SexGodPathPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) {
        $(".feature-categories img").addClass("safe-work");
      }
    }
  }
  class HeroPagesPage {
    static init(page) {
      const settings = Settings.settings;
      if (settings.safe_work) $("img[girl-ava-src]").addClass("safe-work");
      if (settings.auto_switch_lang_export && page === "settings" && location.search.includes("change_lang=1")) {
        const performSwitch = () => {
          var _a, _b, _c;
          const ajax = (_b = (_a = window.shared) == null ? void 0 : _a.general) == null ? void 0 : _b.hh_ajax;
          if (ajax) {
            const HeroData = Utils.getHeroData();
            const currentLang = ((_c = HeroData == null ? void 0 : HeroData.infos) == null ? void 0 : _c.lang) || "en";
            let newLang = "en";
            if (currentLang === "en") {
              if (settings.original_game_lang) {
                newLang = settings.original_game_lang;
                Settings.change_settings("original_game_lang", false);
              } else {
                location.href = "/edit-team.html?battle_type=seasons&id_team=";
                return;
              }
            } else {
              Settings.change_settings("original_game_lang", currentLang);
              newLang = "en";
            }
            ajax(
              {
                class: "Hero",
                action: "save_field",
                field: "lang",
                value: newLang
              },
              () => {
                location.href = "/edit-team.html?battle_type=seasons&id_team=&switched=1";
              }
            );
          } else {
            setTimeout(performSwitch, 500);
          }
        };
        performSwitch();
      }
    }
  }
  class EditTeamPage {
    static init() {
      const settings = Settings.settings;
      const rawData = localStorage.getItem("HHS.HHPNMap");
      if (rawData) {
        const hintLink = settings.auto_switch_lang_export ? 'Press <b>Ctrl+C <a href="/settings.html?change_lang=1" style="color:white; text-decoration:underline;" title="Click to automatically switch to English for standardized export and back to your language when done.">(Switch lang here)</a></b> to export data' : "Press <b>Ctrl+C</b> to export data";
        const $hint = $(
          `<div style="position: absolute; left: 50%; transform: translateX(-50%); top: 15%; color: white; z-index: 9999; text-shadow: 0 0 2px black; font-size: 14px; text-align: center;">${hintLink}</div>`
        );
        $("section > div").first().prepend($hint);
        try {
          const girlsData = JSON.parse(rawData);
          const simplified = girlsData.map((entry) => {
            var _a, _b, _c;
            return {
              name: (_a = entry[1]) == null ? void 0 : _a.n,
              id: (_b = entry[1]) == null ? void 0 : _b.id,
              grade: (_c = entry[1]) == null ? void 0 : _c.gr
            };
          });
          if (simplified.length > 0) {
            Settings.change_settings("girls_data", simplified);
            settings.girls_data = simplified;
          }
          document.addEventListener("keydown", function(e) {
            if (e.key === "c" && e.ctrlKey && settings.girls_data_export) {
              const listaNomi = girlsData.map(
                (entry) => {
                  var _a, _b, _c, _d;
                  return `"${(_a = entry[1]) == null ? void 0 : _a.n}";"${(_b = entry[1]) == null ? void 0 : _b.l}";"${((_c = entry[1]) == null ? void 0 : _c.gr) >= ((_d = entry[1]) == null ? void 0 : _d.nbGr)}"`;
                }
              ).join("\n");
              navigator.clipboard.writeText(listaNomi).then(() => {
                const $success = $('<div id="export-success" style="text-align:center; color: #0f0; font-weight: bold; margin-top: 5px;">Esportati!</div>');
                $("#export-success").remove();
                $hint.append($success);
                if (settings.auto_switch_lang_export && location.search.includes("switched=1")) {
                  setTimeout(() => {
                    location.href = "/settings.html?change_lang=1";
                  }, 1e3);
                } else {
                  setTimeout(() => $success.fadeOut(500, () => $success.remove()), 2e3);
                }
              }).catch(() => {
                const $error = $('<div style="text-align:center; color: #f00; font-weight: bold; margin-top: 5px;">Errore copia</div>');
                $hint.append($error);
                setTimeout(() => $error.fadeOut(500, () => $error.remove()), 2e3);
              });
            }
          });
        } catch (e) {
          console.error(
            "Hentai Heroes Helper: Error parsing girl data",
            e
          );
        }
      }
      if (settings.auto_fill_team) {
        const checkAndFill = () => {
          const $missingWaifu = $(
            '.team-member.base-hexagon img[src^="data:image/gif"]'
          );
          const $autoFillBtn = $("#auto-fill-team:not(:disabled)");
          if ($missingWaifu.length && $autoFillBtn.length && $autoFillBtn.is(":visible")) {
            $autoFillBtn.trigger("click");
          }
        };
        const interval = setInterval(checkAndFill, 2e3);
        $(window).on("unload", () => clearInterval(interval));
      }
    }
  }
  class LabyrinthPage {
    static init(page) {
      const settings = Settings.settings;
      if (!settings.auto_fill_team) return;
      const checkAndFill = () => {
        const $missingWaifu = $('.team-member.base-hexagon img[src^="data:image/gif"]');
        const $autoFillBtn = $("#auto-fill-team:not(:disabled)");
        if ($missingWaifu.length && $autoFillBtn.length && $autoFillBtn.is(":visible")) {
          $autoFillBtn.trigger("click");
        }
      };
      const interval = setInterval(checkAndFill, 2e3);
      $(window).on("unload", () => clearInterval(interval));
    }
  }
  class PentaDrillArenaPage {
    static init() {
      var _a, _b;
      const settings = Settings.settings;
      const theme_colors = Settings.theme_colors;
      const $heroPowerEl = $(".player-info-container .total-power .value span");
      if (!$heroPowerEl.length) return;
      const heroPower = Utils.toint_element($heroPowerEl);
      const margin = 1.03;
      if (!settings.auto_color_opponents) {
        $(".opponent-info-container").css({
          outline: "",
          filter: ""
        });
        $(".opponent-info-container .total-power .value span").css("color", "");
        return;
      }
      let maxXP = -1;
      let minPowerForMaxXP = Infinity;
      let bestIndex = -1;
      let bestOpponentId = null;
      $(".opponent-info-container").each(function(index) {
        const $opponent = $(this);
        const oppPower = Utils.toint_element($opponent.find(".total-power .value span"));
        const xpAmount = Utils.toint_element($opponent.find(".slot_season_xp_girl .amount"));
        if (oppPower <= heroPower * margin) {
          if (xpAmount > maxXP) {
            maxXP = xpAmount;
            minPowerForMaxXP = oppPower;
            bestIndex = index;
          } else if (xpAmount === maxXP && oppPower < minPowerForMaxXP) {
            minPowerForMaxXP = oppPower;
            bestIndex = index;
          }
        }
      });
      $(".opponent-info-container").each(function(index) {
        const $opponent = $(this);
        const $oppPowerEl = $opponent.find(".total-power .value span");
        const oppPower = Utils.toint_element($oppPowerEl);
        Utils.toint_element($opponent.find(".slot_season_xp_girl .amount"));
        const isBeatable = oppPower <= heroPower * margin;
        let color = "";
        let grayscale = "";
        if (!isBeatable) {
          color = theme_colors.red;
          grayscale = "0.6";
          $oppPowerEl.css("color", theme_colors.red);
        } else {
          if (index === bestIndex) {
            color = theme_colors.green;
            grayscale = "0";
            const href = $opponent.find("a#change_team").attr("href");
            if (href) {
              const match = href.match(/id_opponent=(\d+)/);
              if (match) bestOpponentId = match[1];
            }
          } else {
            color = theme_colors.orange;
            grayscale = "0.3";
          }
          $oppPowerEl.css("color", theme_colors.green);
        }
        $opponent.css({
          "outline": "3px solid " + color,
          "outline-offset": "-3px",
          "filter": `grayscale(${grayscale})`
        });
      });
      if (settings.auto_battle) {
        const HeroData = Utils.getHeroData();
        const energyAmount = ((_b = (_a = HeroData == null ? void 0 : HeroData.energies) == null ? void 0 : _a.drill) == null ? void 0 : _b.amount) || 0;
        const $container = $('<div id="penta-drill-autobattle"></div>');
        $(".player-container").find(".change-team-container").after($container);
        StoryHelper.autoBattle({
          container: $container,
          defaultCount: energyAmount,
          energyType: "drill",
          battleType: "penta",
          onStart: (count) => {
            if (bestOpponentId && count > 0) {
              Settings.change_settings("battle_count_penta", count - 1);
              location.href = `/penta-drill-battle.html?id_opponent=${bestOpponentId}&number_of_battles=1`;
            } else {
              Settings.change_settings("battle_count_penta", 0);
              if (!bestOpponentId) alert("No suitable opponent found for auto-battle!");
            }
          }
        });
      }
    }
  }
  class ChampionsPage {
    static init(page) {
      const settings = Settings.settings;
      if (settings.safe_work) {
        $(
          ".new-battle-image, .champions-over__girl-image, .champions-over__champion-image, .pvp-girls"
        ).addClass("safe-work");
        var interval = setInterval(function() {
          var $girl = $(".section__preview-characters>div");
          if ($girl.length) {
            $girl.addClass("safe-work");
            clearInterval(interval);
          }
        }, 5);
        $(".champions-over__champion-tier-link").on("click", function() {
          setTimeout(function() {
            StoryHelper.safeWorkBackground("#scene_popup");
          }, 100);
        });
      }
      if (page == "champions") {
        var max_champions = 6, champion_id = Utils.toint_string(window.championData.champion.id), $btns_container = $('<div class="btns_container"></div>');
        $btns_container.appendTo($(".champions-bottom__wrapper"));
        var previous_champion_id = champion_id - 1;
        if (previous_champion_id < 1) previous_champion_id = max_champions;
        $(
          `<button class="finished round_blue_button">
                    <img src="https://hh.hh-content.com/design/ic_arrow-left-ffffff.svg">
                </button>`
        ).on("click", function() {
          StoryHelper.goToChampion(previous_champion_id);
        }).appendTo($btns_container);
        var next_champion_id = champion_id + 1;
        if (next_champion_id > max_champions) next_champion_id = 1;
        $(
          `<button class="finished round_blue_button">
                    <img class="continue" src="https://hh.hh-content.com/design/ic_arrow-right-ffffff.svg">
                </button>`
        ).on("click", function() {
          StoryHelper.goToChampion(next_champion_id);
        }).appendTo($btns_container);
        if (settings.journey_champion_active) {
          StoryHelper.journeyChampion();
          $('button[rel="perform"]').on("click", function() {
            if (!Settings.settings.champions_tour_active) {
              Settings.change_settings(
                "journey_champion",
                next_champion_id
              );
            }
          });
        }
      } else if (page === "champions_map") {
        if (settings.journey_champion_active) StoryHelper.journeyChampion();
        $(".champion-lair").on("click", StoryHelper.changeLastChampionLink);
      }
      if (settings.champions_tour_active) {
        const handleTourStep = () => {
          const step = settings.champions_tour_step;
          const selectors = [
            ".green_button_L:visible",
            ".red_button_L:visible",
            ".blue_button_L:visible"
          ];
          const $allBtns = $(selectors.join(", "));
          const $btn = $allBtns.filter(function() {
            const text = $(this).text().toLowerCase();
            return $(this).attr("battles-number") !== void 0 || text.includes("perform");
          }).first();
          if ($btn.length && !$btn.prop("disabled")) {
            $btn.trigger("click");
          } else {
            const nextStep = step + 1;
            Settings.change_settings("champions_tour_step", nextStep);
            if (nextStep <= 6) {
              StoryHelper.goToChampion(nextStep);
            } else {
              Settings.change_settings("champions_tour_active", false);
              location.href = "/home.html";
            }
          }
        };
        setTimeout(handleTourStep, 1500);
      }
    }
  }
  class WaifuPage {
    static init() {
      if (Settings.settings.safe_work) {
        $(".harem-girl-container").on("click", StoryHelper.waifuSafeWork);
      }
    }
  }
  class ClubsPage {
    static init() {
      const settings = Settings.settings;
      $("#members .body-row .active_light").each(function() {
        var days = Utils.toint_string($(this).attr("afk-tooltip")) / 60 / 60 / 24;
        if (days >= settings.max_days_club) {
          $(this).parent().find("p").css("color", "#96141a");
        } else $(this).removeClass("offline");
      });
      Css.addCss(
        ".active_light.offline{background-color: #96141a!important}"
      );
    }
  }
  class MessengerPage {
    static init() {
      const settings = Settings.settings;
      let albumSelected = false;
      let lastIdGirl;
      setInterval(function() {
        const $albumTab = $('.messenger-chat-tab[data-tab="album"]');
        const $chatTab = $('.messenger-chat-tab[data-tab="chat"]');
        const currentIdGirl = $(".messenger-girl-container.selected").attr("data-id-girl");
        if ($albumTab.hasClass("selected")) {
          albumSelected = true;
        } else if ($chatTab.hasClass("selected")) {
          albumSelected = false;
        }
        if (currentIdGirl && lastIdGirl !== currentIdGirl) {
          lastIdGirl = currentIdGirl;
          if (albumSelected && !$albumTab.hasClass("selected")) {
            $albumTab.trigger("click");
          }
        }
        if (settings.cg_background)
          $(".girl-album-image>img, .message-image").off("contextmenu.choose_bg").on("contextmenu.choose_bg", function(e) {
            Settings.change_settings(
              "choosed_bg",
              $(this).attr("src").replace("800x", "1600x")
            );
            const $feedback = $('<div style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); background:rgba(0,0,0,0.7); color:#ffa23e; padding:5px 10px; border-radius:5px; pointer-events:none; z-index:1000; font-size:12px; border: 1px solid #ffa23e;">Background Selected</div>');
            $(this).parent().css("position", "relative").append($feedback);
            setTimeout(() => $feedback.fadeOut(() => $feedback.remove()), 1500);
            return Utils.stopClick(e);
          });
        if (settings.safe_work)
          $(".girl-album-image, .message-image").addClass("safe-work");
      }, 300);
    }
  }
  class PathsPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) {
        $(".girl-preview>img").addClass("safe-work");
        Css.addCss(
          `.potions-paths-background-panel .potions-paths-second-row .animation-container{z-index:0!important}
                .potions-paths-background-panel .potions-paths-second-row .potions-paths-central-section{z-index:9}`
        );
      }
      $(".girl-preview").each(function() {
        var $a = $(
          '<a class="waifuStory" href="/girl/' + $(this).attr("girl-id") + '?resource=affection"><img src="https://hh.hh-content.com/design_v2/affstar.png"></a>'
        );
        $a.on("click", function() {
          Settings.change_settings("start_girl_story", true);
        });
        $(this).find(".girl-info-container").append($a);
      });
    }
  }
  class BattlePage {
    static init(page) {
      const settings = Settings.settings;
      if (page === "pantheon-battle" && settings.safe_work) {
        $("#bg_all .fixed_scaled img").addClass("safe-work");
      }
      if (page === "labyrinth-battle") {
        if (settings.safe_work) {
          setInterval(function() {
            $(".pvp-container").addClass("safe-work");
          }, 150);
        }
      } else {
        if (settings.safe_work) {
          setInterval(function() {
            $(".new-battle-image, .pvp-girls").addClass("safe-work");
          }, 150);
        }
        if (settings.auto_press_btns && settings.header_link_show)
          Css.addCss(
            `#popups #rewards_popup .flex-container .rewards{margin:30px 0px!important}
                    #popups #rewards_popup .flex-container .rewards:has(.shards){margin:145px 0px!important}
                    #rewards_popup .popup_buttons{transform:translateY(-40px)}`
          );
      }
    }
  }
  class PreBattlePage {
    static init(page) {
      var _a, _b;
      const settings = Settings.settings;
      if (page === "troll-pre-battle") {
        StoryHelper.questLink();
        StoryHelper.addBackToLink("/world/" + (settings.last_id_troll + 1));
        if ($(".rewards_list>.girls_reward:not(.items_reward) .slot").length > 1) {
          Css.addCss(
            `.girls_reward.girl_ico .animate > div { animation-duration: 2s!important }`
          );
        }
      } else if (page === "pantheon-pre-battle") {
        StoryHelper.questLink();
        StoryHelper.addBackToLink("/pantheon.html");
        if (settings.safe_work) {
          $("#bg_all .fixed_scaled img").addClass("safe-work");
        }
        $("#pre-battle .battle-buttons-row > a").insertAfter(
          $("#pre-battle .battle-buttons-row > button")
        );
      } else if (page === "leagues-pre-battle") {
        if (settings.safe_work) {
          $(".girl-block").addClass("safe-work");
        }
      }
      if (settings.auto_battle && page === "troll-pre-battle") {
        const HeroData = Utils.getHeroData();
        const fightAmount = ((_b = (_a = HeroData == null ? void 0 : HeroData.energies) == null ? void 0 : _a.fight) == null ? void 0 : _b.amount) || 0;
        const $container = $(".battle-buttons-row").first();
        StoryHelper.autoBattle({
          container: $container,
          defaultCount: fightAmount,
          energyType: "fight",
          battleType: "troll",
          onStart: (count) => {
            const $fightBtn = $(".green_button_L");
            if ($fightBtn.length) {
              Settings.change_settings("battle_count_troll", count - 1);
              const href = $fightBtn.attr("href");
              if (href && href !== "#" && !href.startsWith("javascript")) {
                window.location.href = href;
              } else {
                $fightBtn.trigger("click");
              }
            } else {
              Settings.change_settings("battle_count_troll", 0);
            }
          }
        });
      }
    }
  }
  class AutoPress {
    static init(page) {
      const settings = Settings.settings;
      if (!settings.auto_press_btns) return;
      var to_press = true;
      setInterval(function() {
        var $btns = $(
          '.popup_buttons .blue_button_L:not(#redirect-to-harem), button[rel="pop_claim"]:not(:disabled), #heal_girl_labyrinth_popup .blue_button_L, #all-battle-skip-btn, #iframe_wrapper close'
        ).not("#labyrinth_sweeping_preview_popup .blue_button_L");
        if (page === "pachinko") {
          $btns = $btns.not(":disabled");
        }
        if ($btns.length && $btns.is(":visible") && to_press && settings.pachinko_press_btn) {
          to_press = false;
          setTimeout(function() {
            $btns.trigger("click");
            to_press = true;
          }, 1e3);
        }
      }, 300);
      const SKIP_LIMIT = 3;
      var skip_limit = SKIP_LIMIT;
      setInterval(function() {
        let selectors = '.skip-button, .not-supported-browser .blue_button_L, button[rel="pop_auto_assign"]:not(:disabled), button[rel="pop_action"]:not(:disabled), #new-battle-skip-btn';
        if (page === "league-battle" && location.search.includes("number_of_battles=1") && skip_limit === SKIP_LIMIT)
          skip_limit = 1;
        var $btnsFast = $(selectors).not(
          "#labyrinth_sweeping_preview_popup .blue_button_L"
        );
        if ($btnsFast.length && settings.pachinko_press_btn) {
          if (skip_limit > 0) {
            $btnsFast.trigger("click");
            skip_limit--;
          }
        } else skip_limit = SKIP_LIMIT;
      }, 50);
    }
  }
  class Shortcuts {
    static init() {
      $(document).on("keypress", function(e) {
        if ($(e.target).is(".club-chat-input")) return;
        if (e.which == 13) {
          const selectors = [
            ".green_button_L:visible",
            ".red_button_L:visible",
            ".blue_button_L:visible"
          ];
          let $btn = $();
          const $allBtns = $(selectors.join(", "));
          const $autoBattleBtn = $(".auto-battle-btn:visible").first();
          const $autoBattleCount = $(".auto-battle-count:visible").first();
          const autoCount = parseInt($autoBattleCount.val(), 10) || 0;
          const page = $("body").attr("page");
          const isSpecialAutoPage = page === "pantheon" || page === "penta_drill_arena";
          const threshold = isSpecialAutoPage ? 0 : 1;
          if ($autoBattleBtn.length && autoCount > threshold) {
            $btn = $autoBattleBtn;
          } else {
            $btn = $allBtns.filter(function() {
              const text = $(this).text().toLowerCase();
              return $(this).attr("battles-number") !== void 0 || text.includes("perform");
            }).first();
          }
          if (!$btn.length) {
            for (const selector of selectors) {
              $btn = $(selector).first();
              if ($btn.length) break;
            }
          }
          if ($btn.length) {
            const href = $btn.attr("href");
            if (href && href !== "#" && href !== "javascript:void(0)") {
              location.href = href;
            } else {
              $btn.trigger("click");
            }
          }
        }
      });
      $('.left-side-container [rel="clubs"]').on("contextmenu", (e) => {
        e.preventDefault();
        Settings.change_settings("champions_tour_active", true);
        Settings.change_settings("champions_tour_step", 0);
        location.href = "/club-champion.html";
        return false;
      });
    }
  }
  class TrollLinks {
    static init() {
      const settings = Settings.settings;
      $(`a[href^="${StoryHelper.links.troll}"]`).on(
        "click",
        StoryHelper.changeLastTroll
      );
      $(`button[data-href^="${StoryHelper.links.troll}"]`).on(
        "click",
        StoryHelper.changeLastTroll
      );
      StoryHelper.trollMenuLink();
      if (settings.link_last_troll)
        $('.energy_counter[type="fight"] .energy_counter_amount').wrap(
          `<a href="${StoryHelper.links.troll}${settings.last_id_troll}" class="link_last_troll"></a>`
        );
      $('.energy_counter[type="fight"] .energy_counter_bar').on(
        "contextmenu",
        function(e) {
          var _a;
          const HeroData = Utils.getHeroData();
          if (!((_a = HeroData == null ? void 0 : HeroData.infos) == null ? void 0 : _a.questing)) return;
          location.href = StoryHelper.links.troll + (HeroData.infos.questing.id_world - 1);
          return Utils.stopClick(e);
        }
      );
    }
  }
  const _GirlPreview = class _GirlPreview {
    static init() {
      setInterval(() => {
        $(this.selector_previewGirls).off("contextmenu.girlPreview").on("contextmenu.girlPreview", (e) => {
          let $this = $(e.currentTarget);
          let search;
          let founds_preview = [];
          let regex;
          let id_img;
          if ($this.is("canvas")) {
            regex = /id_[0-9]+_grade/g;
            search = $this.attr("id");
          } else {
            regex = /(\/[0-9]+\/(ava|ico))/g;
            search = $this.attr("src");
          }
          if (search) founds_preview = search.match(regex);
          else {
            founds_preview = [];
            let $girlId = $("[girl-id]");
            if ($girlId.length) {
              $girlId.each(function() {
                founds_preview.push($(this).attr("girl-id"));
              });
            }
          }
          if (founds_preview === null || !founds_preview.length) return;
          for (let j = 0; j < founds_preview.length; j++) {
            id_img = Utils.toint_string(founds_preview[j]);
            if (!id_img) continue;
            if (!this.list_previewGirls.includes(id_img)) {
              this.list_previewGirls.push(id_img);
              let type = "girls", types = ["troll", "club_champions", "champions"];
              for (let i = 0; i < types.length; i++) {
                if (search && search.includes(types[i])) {
                  type = types[i];
                  break;
                }
              }
              let owned = $this.parent().hasClass("already-owned") || $this.next().find(".shards>p>span").text() === "100/100";
              this.list_previewGirls_info[id_img] = {
                type,
                owned
              };
            }
          }
          if (this.discover_previewGirls) return;
          id_img = this.list_previewGirls[0];
          this.current_src = search;
          if ($this.is("canvas")) {
            var $img = $(
              `div[data-select-girl-id="${id_img}"]>img[girl-ico-src]`
            );
            var temp_src = $img.attr("src");
            if (temp_src) this.current_src = temp_src;
          }
          this.preview_girl(id_img);
          this.discover_previewGirls = true;
          $(this.selector_previewGirls.replace("canvas, ", "")).trigger(
            "contextmenu"
          );
          setTimeout(() => {
            this.discover_previewGirls = false;
            var $panel = $(".nc-panel-preview-girl");
            $panel.find(".current").css("visibility", "");
            $panel.find(".current .position").html(this.position_preview());
            if (this.list_previewGirls.length <= 1) {
              $panel.find(".prev, .next").hide();
              $panel.find(".nc-panel-footer").css("justify-content", "center");
              $panel.find(".current .position").off("click");
            }
          }, 1500);
          return Utils.stopClick(e);
        });
        $(
          ".notifs:not(#awakening_popup):not(#confirm_BB_team_creation):not(#girl_max_out_popup)"
        ).off("click").on("click", function() {
          if ($(this).closest(
            "#hero_resources_popup, #scroll_exchange_popup"
          ).length)
            return;
          $(this).remove();
        });
      }, 500);
    }
    static position_preview() {
      return this.current_girlPreview + 1 + `/${this.list_previewGirls.length}`;
    }
    static preview_girl(id_img) {
      $(".nc-panel-preview-girl").remove();
      var $panelImg = $(
        '<div class="nc-panel-preview-girl">  <div class="nc-panel">    <div class="nc-panel-header">      <a href="#" class="close_cross potions-paths-panel-button">        <img class="excluded" src="https://hh.hh-content.com/clubs/ic_xCross.png">      </a>    </div>    <div class="nc-panel-body"><p style="text-align:center;font-size:2em;color:#fff">LOADING..</p></div>    <div class="nc-panel-footer">      <p class="prev">&lt;</p>      <div class="current"' + (this.list_previewGirls.length > 1 ? "" : ' style="visibility:hidden"') + ">        <p>" + (this.list_previewGirls_info[id_img].owned ? '<span style="color:#6ed902;font-weight:bold">✔</span> ' : "") + '        <span class="position">' + this.position_preview() + '</span></p>      </div>      <p class="next">&gt;</p>    </div>  </div></div>'
      );
      $("#contains_all").append($panelImg);
      $panelImg.find(".close_cross").on("click", () => {
        $panelImg.remove();
        this.list_previewGirls = [];
        this.list_previewGirls_info = {};
        this.current_girlPreview = 0;
      });
      $panelImg.find(".prev").on("click", () => {
        this.current_girlPreview--;
        if (this.current_girlPreview < 0)
          this.current_girlPreview = this.list_previewGirls.length - 1;
        this.preview_girl(this.list_previewGirls[this.current_girlPreview]);
      });
      $panelImg.find(".next").on("click", () => {
        this.current_girlPreview++;
        if (this.current_girlPreview >= this.list_previewGirls.length)
          this.current_girlPreview = 0;
        this.preview_girl(this.list_previewGirls[this.current_girlPreview]);
      });
      $panelImg.find(".current .position").on("click", () => {
        var input = window.prompt(
          "Type a number [0 to " + (this.list_previewGirls.length - 1) + '] or string "random":',
          "random"
        );
        if (input == "random")
          this.current_girlPreview = Utils.random(this.list_previewGirls.length);
        else this.current_girlPreview = Utils.toint_string(input);
        if (this.current_girlPreview >= this.list_previewGirls.length)
          this.current_girlPreview = 0;
        if (this.current_girlPreview < 0)
          this.current_girlPreview = this.list_previewGirls.length - 1;
        this.preview_girl(this.list_previewGirls[this.current_girlPreview]);
      });
      StoryHelper.appendStory(".nc-panel-preview-girl .current", id_img);
      var $panelBody = $panelImg.find(".nc-panel-body"), total_images = 0;
      const onImageProcessed = function() {
        var _a;
        if (this.tagName === "IMG" && ((_a = arguments[0]) == null ? void 0 : _a.type) === "error") {
          $(this).remove();
        }
        total_images++;
      };
      for (var grade = 0; grade < 7; grade++)
        $(
          '<img class="excluded" src="' + StoryHelper.generateImg(
            id_img,
            grade,
            this.current_src,
            this.list_previewGirls_info[id_img].type
          ) + '">'
        ).appendTo($panelBody).on("error", onImageProcessed).on("load", onImageProcessed);
      var intResizeGirl = setInterval(() => {
        if (total_images == 7) {
          clearInterval(intResizeGirl);
          $panelBody.find("p").remove();
          var $imgs = $panelBody.find("img");
          $imgs.css({
            width: 100 / $imgs.length + "%",
            height: $panelBody.height()
          }).on("click", function() {
            const isZoomed = $(this).hasClass("zoom");
            $(this).toggleClass("zoom");
            if (!isZoomed) {
              const top = $(this).position().top + $panelBody.scrollTop();
              $panelBody.scrollTop(top);
            }
          });
        }
      }, 500);
    }
  };
  _GirlPreview.current_girlPreview = 0;
  _GirlPreview.discover_previewGirls = false;
  _GirlPreview.list_previewGirls = [];
  _GirlPreview.list_previewGirls_info = {};
  _GirlPreview.selector_previewGirls = `canvas, img:not(.excluded, .icon, .user-avatar, .background_images, [src*="/pictures/design/"], [src*="/pictures/misc/"], [src*="/pictures/hero/"], [src*="/payments/"], [src*="/logo_picture/"], [src*="ic_"] , [src*="/seasonal_event/"])`;
  let GirlPreview = _GirlPreview;
  if (location.host.includes("connect.chibipass.com")) {
    document.querySelectorAll(".background_image-style").forEach((el) => {
      const element = el;
      element.style.opacity = "0.05";
      element.style.filter = "grayscale(1)";
    });
  } else if (document.body && document.body.innerText.trim() === "Forbidden") {
    setTimeout(() => location.reload(), 2e3);
  } else {
    $(function() {
      const page = $("body[page]").attr("page");
      if (page === "unknown") {
        $("<style>").prop("type", "text/css").html(`
                #scene .canvas, .variant-video {
                    opacity: 0.05 !important;
                    filter: grayscale(1) !important;
                    pointer-events: none !important;
                }
            `).appendTo("head");
      }
      if (page === "unknown" || location.pathname === "/undefined") {
        location.href = "/home.html";
        return;
      }
      Settings.get_settings();
      const lastPage = Settings.settings.last_visited_page;
      if (page && lastPage && lastPage !== page) {
        const battlePages2 = [
          "battle",
          "labyrinth-battle",
          "league-battle",
          "pantheon-battle",
          "season-battle",
          "troll-battle",
          "boss-bang-battle",
          "penta-drill-battle"
        ];
        const seasonPages = ["season_arena", "season-battle", "season"];
        const pentaPages = ["penta_drill_arena", "penta-drill-battle", "penta-drill"];
        const trollPages = ["troll-battle", "troll-pre-battle", "world"];
        const championPages2 = ["champions", "club_champion", "champions_map"];
        const pantheonPages = ["pantheon", "pantheon-battle", "pantheon-pre-battle"];
        const isSameSection = battlePages2.includes(lastPage) && battlePages2.includes(page) || seasonPages.includes(lastPage) && seasonPages.includes(page) || pentaPages.includes(lastPage) && pentaPages.includes(page) || trollPages.includes(lastPage) && trollPages.includes(page) || championPages2.includes(lastPage) && championPages2.includes(page) || pantheonPages.includes(lastPage) && pantheonPages.includes(page);
        if (!isSameSection && !battlePages2.includes(page)) {
          Settings.resetBattleCounts();
        }
      }
      if (page) Settings.change_settings("last_visited_page", page);
      MiscGlobal.init(page);
      RedirectHome.init(page);
      const routes = {
        harem: () => HaremPage.init(),
        girl: () => GirlPage.init(),
        quest: () => QuestPage.init(),
        season_arena: () => SeasonArenaPage.init(Settings.theme_colors),
        shop: () => ShopPage.init(),
        activities: () => ActivitiesPage.init(),
        pantheon: () => PantheonPage.init(MiscGlobal.page_interact),
        event: () => EventPage.init(),
        "side-quests": () => SideQuestsPage.init(),
        pachinko: () => PachinkoPage.init(),
        home: () => HomePage.init(),
        world: () => WorldPage.init(),
        seasonal: () => SeasonalPage.init(),
        "sex-god-path": () => SexGodPathPage.init(),
        hero_pages: (p) => HeroPagesPage.init(p),
        settings: (p) => HeroPagesPage.init(p),
        "edit-team": () => EditTeamPage.init(),
        "edit-labyrinth-team": (p) => LabyrinthPage.init(p),
        penta_drill_arena: () => PentaDrillArenaPage.init(),
        club_champion: (p) => ChampionsPage.init(p),
        waifu: () => WaifuPage.init(),
        clubs: () => ClubsPage.init(),
        messenger: () => MessengerPage.init(),
        "path-of-valor": () => PathsPage.init(),
        "path-of-glory": () => PathsPage.init()
      };
      const battlePages = [
        "battle",
        "labyrinth-battle",
        "league-battle",
        "pantheon-battle",
        "season-battle",
        "troll-battle",
        "boss-bang-battle",
        "penta-drill-battle"
      ];
      const championPages = ["champions", "club_champion", "champions_map"];
      const preBattlePages = [
        "troll-pre-battle",
        "pantheon-pre-battle",
        "leagues-pre-battle"
      ];
      if (page) {
        if (routes[page]) {
          routes[page](page);
        } else if (battlePages.includes(page)) {
          BattlePage.init(page);
        } else if (championPages.includes(page)) {
          ChampionsPage.init(page);
        } else if (preBattlePages.includes(page)) {
          PreBattlePage.init(page);
        }
      }
      AutoPress.init(page);
      SafeWorkGlobal.init();
      Shortcuts.init();
      TrollLinks.init();
      GirlPreview.init();
      FinalCss.init(page);
    });
  }

})();