// ==UserScript==
// @name         Hentai Heroes Helper (auto collect, button press and more)
// @namespace    https://greasyfork.org/users/807892
// @version      4.1.8
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
// @exclude      https://test.hentaiheroes.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436188/Hentai%20Heroes%20Helper%20%28auto%20collect%2C%20button%20press%20and%20more%29.user.js
// @updateURL https://update.greasyfork.org/scripts/436188/Hentai%20Heroes%20Helper%20%28auto%20collect%2C%20button%20press%20and%20more%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  class Settings {
    static storage_key = "erocollect_options";
    static default_settings = {
      auto_collect_harem: false,
      timeout_collect_after: 3e3,
      not_collect_full_graded: false,
      safe_work: false,
      safe_work_opacity: 0.05,
      pantheon_auto_enter: true,
      auto_press_btns: false,
      girls_data: false,
      girls_data_export: false,
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
      colored_season: true,
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
      battle_count: 0,
      avoid_legendary_first: true
    };
    static theme_colors = {
      green: "#53af00",
      red: "#b14",
      gray: "#6a6a6a",
      shadow_gray: "0 3px 0 rgb(23 33 7 / 60%), inset 0 3px 0 #3c3c3c",
      orange: "#eeaa34",
      shadow_orange: "rgb(33 27 7 / 60%) 0px 3px 0px, rgb(240 117 33) 0px 3px 0px inset"
    };
    static settings = {};
    static save_settings(settings) {
      window.localStorage.setItem(
        Settings.storage_key,
        JSON.stringify(settings)
      );
    }
    static clear_settings() {
      window.localStorage.removeItem(Settings.storage_key);
    }
    static get_settings() {
      let settings = window.localStorage.getItem(Settings.storage_key);
      const default_settings_length = Object.keys(
        Settings.default_settings
      ).length;
      const last_added_settings = Object.keys(Settings.default_settings)[default_settings_length - 1];
      let key;
      if (settings === null) settings = {};
      else settings = JSON.parse(settings);
      if (!settings.hasOwnProperty(last_added_settings) || default_settings_length != Object.keys(settings).length) {
        for (key in Settings.default_settings) {
          if (!settings.hasOwnProperty(key))
            settings[key] = Settings.default_settings[key];
        }
      }
      for (key in settings) {
        if (!Settings.default_settings.hasOwnProperty(key))
          delete settings[key];
      }
      Settings.save_settings(settings);
      Settings.settings = settings;
      return settings;
    }
    static change_settings(key, value) {
      Settings.settings[key] = value;
      Settings.save_settings(Settings.settings);
    }
    static generateSetting(setting, $el) {
      if (typeof setting.type == "undefined") setting.type = "checkbox";
      let $setting;
      if (setting.type == "checkbox")
        $setting = $(
          '<label class="switchSetting">  <input type="' + setting.type + '" setting="' + setting.name + '"' + (Settings.settings[setting.name] === true ? ' checked="checked"' : "") + '/>  <span class="sliderSetting"></span></label>' + setting.text + "<br />"
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
          '<label class="textSetting setting-text">  <input type="' + setting.type + '"' + min + max + step + ' setting="' + setting.name + '" value="' + Settings.settings[setting.name] + '"/></label>' + setting.text + "<br />"
        );
      }
      $setting.appendTo($el).find("input").change(function() {
        var value = false;
        if ($(this).attr("type") == "checkbox")
          value = $(this).is(":checked");
        else value = $(this).val();
        if (typeof setting.onchange != "undefined") {
          setting.onchange(value);
          if (typeof setting.stopafterchange != "undefined" && setting.stopafterchange)
            return;
        }
        Settings.change_settings($(this).attr("setting"), value);
      });
    }
  }
  class Css {
    static addCss(code, append = false) {
      if (code !== "") Css.styleContent += "" + code;
      if (append) Css.appendCss();
    }
    static styleContent = "";
    static appendCss() {
      $("#customStyle").remove();
      if (Css.styleContent !== "")
        $("body").append(
          $('<style id="customStyle">' + Css.styleContent + "</style>")
        );
    }
    static MAIN = `#popups #heal_girl_labyrinth_popup .flex-container, #popups #labyrinth_reward_popup .flex-container, #popups #level_up .flex-container, #popups #rewards_popup .flex-container, #sliding-popups #heal_girl_labyrinth_popup .flex-container, #sliding-popups #labyrinth_reward_popup .flex-container, #sliding-popups #level_up .flex-container, #sliding-popups #rewards_popup .flex-container, #sliding-popups #heal_girl_labyrinth_popup .flex-container, #sliding-popups #labyrinth_reward_popup .flex-container, #sliding-popups #level_up .flex-container, #sliding-popups #rewards_popup .flex-container{height:530px!important}
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
        filter: grayscale(1);
    }
    .link_last_troll{
        color: #fff;
        text-decoration: none;
    }
    #popups #rewards_popup .flex-container .info_container a p{font-size:14px}
    #popups #rewards_popup .flex-container .info_container img{width:60%}
    #popups #rewards_popup .flex-container>h1{font-size:55px}
    #popups #labyrinth_reward_popup .flex-container > h1, #popups #heal_girl_labyrinth_popup .flex-container > h1{font-size:35px}
    #popups #level_up .flex-container button, #sliding-popups #level_up .flex-container button, #popups #rewards_popup .flex-container button, #sliding-popups #rewards_popup .flex-container button, #popups #heal_girl_labyrinth_popup .flex-container button, #sliding-popups #heal_girl_labyrinth_popup .flex-container button, #popups #labyrinth_reward_popup .flex-container button, #sliding-popups #labyrinth_reward_popup .flex-container button{
        margin-top:-2rem
    }`;
    static HOME = `#homepage .waifuStory{
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
    static POP = `#pop .pop_list .pop_list_scrolling_area .pop_thumb_container {
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
    static SHOP = `#player-inventory{width:21rem!important}
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
  }
  class Utils {
    static getHeroData() {
      return window.shared?.Hero || window.Hero;
    }
    static is_numeric(c) {
      return /^\d+$/.test(c.toString());
    }
    static toint_string(str) {
      if (typeof str === "number") return str;
      let new_str = "";
      if (str === "" || str === null || typeof str === "undefined") return 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charAt(i);
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
      return false;
    }
  }
  class StoryHelper {
    static links = {
      troll: "/troll-pre-battle.html?id_opponent=",
      activity: "/activities.html?tab=",
      shop: "/shop.html?type="
    };
    static NOT_FOUND = "NOT_FOUND";
    static unsafe_click = false;
    static girlLink(id, tab = "affection") {
      tab = "?resource=" + tab;
      if (!tab) tab = "";
      return "/girl/" + id + tab;
    }
    static questLink() {
      const HeroData = Utils.getHeroData();
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
      $(".safe-work").off("dblclick.unsafe").on("dblclick.unsafe", function(e) {
        StoryHelper.unsafe_click = true;
        $(this).toggleClass("safe-work").toggleClass("unsafe-work");
        return Utils.stopClick(e);
      });
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
      if (typeof link != "undefined" && link.includes(StoryHelper.links[type]))
        return link.split(StoryHelper.links[type])[1];
      return StoryHelper.NOT_FOUND;
    }
    static changeLastTroll() {
      const result = StoryHelper.getLastLink($(this), "troll");
      if (result == StoryHelper.NOT_FOUND) return;
      Settings.change_settings("last_id_troll", Utils.toint_string(result));
    }
    static trollMenuLink() {
      const $trollMenu = $(".TrollsMenu");
      if (!$trollMenu.length) {
        setTimeout(StoryHelper.trollMenuLink, 200);
        return;
      }
      $trollMenu.find('a[href^="' + StoryHelper.links.troll + '"]').click(StoryHelper.changeLastTroll);
    }
    static changeLastActivityLink() {
      const result = StoryHelper.getLastLink($(this), "activity");
      if (result == StoryHelper.NOT_FOUND) return;
      Settings.change_settings("last_link_activity", result);
    }
    static changeLastShopLink() {
      let result = StoryHelper.getLastLink($(this), "shop");
      if (result == StoryHelper.NOT_FOUND) result = false;
      Settings.change_settings("last_link_shop", result);
    }
    static shopMenuLink() {
      const $shopMenuLinks = $('a[rel="shop"] .market_menu');
      if (!$shopMenuLinks.length) {
        setTimeout(StoryHelper.shopMenuLink, 200);
        return;
      }
      $shopMenuLinks.click(StoryHelper.changeLastShopLink);
    }
    static changeLastChampionLink() {
      Settings.change_settings("last_link_champion", $(this).attr("href"));
    }
    static championMenuLink() {
      const $championMenuLinks = $('a[rel="sex-god-path"] .champions_menu');
      if (!$championMenuLinks.length) {
        setTimeout(StoryHelper.championMenuLink, 200);
        return;
      }
      $championMenuLinks.click(StoryHelper.changeLastChampionLink);
    }
    static goToChampion(id_champion) {
      location.href = "/champions/" + id_champion;
    }
    static journeyChampion(id_champion) {
      if (Settings.settings.journey_champion) {
        StoryHelper.goToChampion(Settings.settings.journey_champion);
        Settings.change_settings("journey_champion", false);
      }
    }
    static waifuSafeWork() {
      $(".waifu-girl-container img").addClass("safe-work");
      $(".diamond-bar .diamond").click(function() {
        setTimeout(StoryHelper.waifuSafeWork, 200);
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
      $waifuStory.attr("href", StoryHelper.girlLink(id)).click(function() {
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
      const settings = Settings.settings;
      const HeroData = Utils.getHeroData();
      let initialValue = options.defaultCount;
      if (settings.battle_count > 0) {
        initialValue = settings.battle_count;
      } else if (options.energyType && HeroData?.energies?.[options.energyType]) {
        const now = new Date();
        const romeStr = now.toLocaleString("en-US", {
          timeZone: "Europe/Rome"
        });
        const romeDate = new Date(romeStr);
        const targetDate = new Date(romeDate);
        targetDate.setHours(13, 30, 0, 0);
        const diffMs = targetDate.getTime() - romeDate.getTime();
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
          initialValue = base_burn + extra_burn;
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
      const startAuto = (count) => {
        if (count > 0) {
          Settings.change_settings("battle_count", count - 1);
          $input.val(count - 1);
          options.onStart(count);
        } else {
          Settings.change_settings("battle_count", 0);
          $input.val(0);
        }
      };
      $startBtn.click(function() {
        const count = parseInt($input.val()) || 0;
        startAuto(count);
      });
      if (settings.battle_count > 0) {
        setTimeout(function() {
          startAuto(settings.battle_count);
        }, 2e3);
      }
    }
  }
  class MiscGlobal {
    static page_interact = false;
    static init(page) {
      const settings = Settings.settings;
      Settings.change_settings("pachinko_press_btn", true);
      $("#contains_all").on("click", (e) => {
        if (this.page_interact || page == "shop" && e.target.parentElement.parentElement.classList.contains("inventory_slots"))
          return;
        this.page_interact = true;
      });
      if (settings.last_side_quest) {
        $('.energy_counter[type="quest"] .energy_counter_bar').on("contextmenu", (e) => {
          location.href = settings.last_side_quest;
          return Utils.stopClick(e);
        });
      }
      if (!settings.safe_work && settings.choosed_bg != "" && settings.cg_background) {
        var $bg = $(
          'body:not([page="map"]):not([page="world"]):not([page="troll-battle"]) #bg_all>.fixed_scaled>img'
        );
        $bg.attr("src", settings.choosed_bg);
        if (settings.invert_bg) $bg.addClass("invert");
      }
      $("#popups").on("DOMNodeInserted", () => {
        var text_popup = $("#popup_message").text(), founds = text_popup.match(
          /(Club room|Clubraum|chat server|sala del club|Club depuis|チャットサーバー)/g
        );
        if (text_popup.match(/(non supported)/g)?.length) {
          $("#popup_message").hide();
          location.reload();
        }
        if (founds === null || !founds.length) return;
        $("#popup_message").remove();
      });
      StoryHelper.fixDiamondImg();
    }
  }
  class RedirectHome {
    static init(page, page_interact) {
      const settings = Settings.settings;
      if (!settings.redirect_to_home) return;
      Settings.change_settings("redirect_to_home", false);
      setTimeout(function() {
        if (page_interact && page != "pachinko" || page == "club_champion")
          return;
        if (page == "pachinko" && ($('.blue_button_L[free="1"]').length || window.pachinkoDef[3].content.games[0].button_type == 1))
          return;
        if (page == "activities" && !settings.auto_start_activities && ($(".blue_button_L:not([disabled]):visible").length || $(".purple_button_L:visible").length))
          return;
        location.href = "/home.html";
      }, 2e3);
    }
  }
  class ExportData {
    static addExportDataLink() {
      function grade_ratio(grade) {
        switch (grade) {
          case 0:
            return 1;
          case 1:
            return 1.3;
          case 2:
            return 1.6;
          case 3:
            return 1.9;
          case 4:
            return 2.2;
          case 5:
            return 2.5;
          default:
            return 0;
        }
      }
      function exportData() {
        alert(
          "Check to view the last girl that you want to export. Scroll down"
        );
        var girls_data = [];
        $(".girls_list>div[id_girl]").each(function(index) {
          var girl_id = $(this).find("div[girl]").attr("girl");
          var girl_data = window.girlsDataList[girl_id];
          var cur_level = parseInt(girl_data.level);
          var cur_grade = parseInt(girl_data.graded);
          var cur_hardcore = parseInt(girl_data.caracs.carac1);
          var cur_charm = parseInt(girl_data.caracs.carac2);
          var cur_know_how = parseInt(girl_data.caracs.carac3);
          var base_hardcore = Math.round(
            cur_hardcore / cur_level / grade_ratio(cur_grade) * 10
          ) / 10;
          var base_charm = Math.round(
            cur_charm / cur_level / grade_ratio(cur_grade) * 10
          ) / 10;
          var base_know_how = Math.round(
            cur_know_how / cur_level / grade_ratio(cur_grade) * 10
          ) / 10;
          girls_data.push({
            name: girl_data.name,
            id: girl_data.id_girl,
            rarity: girl_data.rarity,
            element: girl_data.element_data.flavor,
            grade: cur_grade,
            nb_grades: girl_data.nb_grades,
            level: cur_level,
            level_cap: girl_data.level_cap,
            awakening_costs: girl_data.awakening_costs,
            hardcore: cur_hardcore,
            charm: cur_charm,
            know_how: cur_know_how,
            base_hardcore,
            base_charm,
            base_know_how,
            blessed: girl_data.blessed_attributes != null,
            own: girl_data.own
          });
        });
        return girls_data;
      }
      var $btnExportData = $(
        '<div id="btnExportData" style="cursor:grab; display: flex; position: absolute; font-size:30px; z-index: 30; left:3.5rem">⇲</div>'
      );
      $(".general_girls_console").children(":eq(0)").after($btnExportData);
      $btnExportData.click(function() {
        var girls_data_csv = ExportData.toCsv([
          {
            name: "Name",
            id: "Id",
            rarity: "Rarity",
            element: "Element",
            grade: "Grade",
            nb_grades: "Max grade",
            level: "Level",
            level_cap: "Max level",
            awakening_costs: "Limit raise cost",
            hardcore: "Hardcore",
            charm: "Charm",
            know_how: "Know how",
            base_hardcore: "Base hardcore",
            base_charm: "Base charm",
            base_know_how: "Base know how",
            blessed: "Blessed",
            own: "Owned"
          },
          ...exportData()
        ]);
        var link = document.createElement("a");
        link.setAttribute(
          "href",
          "data:text/plain;charset=utf-8," + encodeURIComponent(girls_data_csv)
        );
        link.setAttribute("download", "girls_data.csv");
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        setTimeout(function() {
          URL.revokeObjectURL(link.href);
          link.parentNode.removeChild(link);
        }, 0);
      });
    }
    static toCsv(objArray, separator = ",", eol = "\r\n") {
      const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
      let str = "";
      for (let i = 0; i < array.length; i++) {
        let line = "";
        for (const index in array[i]) {
          if (line !== "") line += separator;
          line += array[i][index];
        }
        str += line + eol;
      }
      return str;
    }
  }
  class HaremPage {
    static init() {
      const settings = Settings.settings;
      if (settings.girls_data_export) ExportData.addExportDataLink();
      var shards_state_list = ["owned", "inprogress", "notowned"];
      for (var i = 0; i < shards_state_list.length; i++) {
        var shard_name = shards_state_list[i];
        if (settings.shards_state[shard_name])
          $(`.shards-state.${shard_name}`).trigger("click");
      }
      $(".shards-state").click(function() {
        var btn = $(this).attr("class").replace("check-btn shards-state ", "");
        settings.shards_state[btn] = $(this).attr("shardsstate") == "active";
        Settings.change_settings("shards_state", settings.shards_state);
      });
      for (var carac = 1; carac <= 3; carac++) {
        if (settings.carac_state[`c${carac}`])
          $(`.carac-state[carac="${carac}"]`).trigger("click");
      }
      $(".carac-state").click(function() {
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
        if (!girls || i2 >= girls.length || stop_collect || checkPopupError())
          return;
        var $girl = $(girls[i2]), after = 0, skip_girl = false, $stars = $girl.find(".graded g");
        girls_data.push({
          name: $girl.find("h4").text(),
          id: +$girl.attr("girl"),
          grade: $stars.length
        });
        $girl.click(function() {
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
          after = parseInt(settings.timeout_collect_after);
        }
        if (i2 === girls.length - 1) {
          $girl_list.scrollTop($girl_list.prop("scrollHeight") - 300);
          if (!$girl.parent().next().find("div[girl]").hasClass("not_owned"))
            can_collect = true;
          else {
            Settings.change_settings("girls_data_full", true);
            Settings.change_settings("girls_data", girls_data);
            $btnStopCollect.hide();
            if (StoryHelper.retriveSalary())
              $btnRestartCollect.trigger("click");
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
      $btnStopCollect = $('<div id="btnStopCollect" class="stop"></div>');
      $btnStopCollect.click(function() {
        clearInterval(interval_collect);
        stop_collect = !stop_collect;
        var icon = "";
        if (stop_collect) icon = "▶";
        else restart_collect();
        $(this).html(icon).toggleClass("stop");
      });
      $btnStopCollect.appendTo($haremLeft);
      $btnRestartCollect = $('<div id="btnRestartCollect">⟲</div>');
      $btnRestartCollect.click(function() {
        if (!stop_collect) $btnStopCollect.trigger("click");
        $btnStopCollect.trigger("click");
      });
      $btnRestartCollect.appendTo($haremLeft);
      var total_salary = StoryHelper.retriveSalary();
      if (settings.auto_collect_harem && !settings.upgrade_girl_redirect && !settings.start_girl_story && !(total_salary == 0 && settings.girls_data.length > 0)) {
        collect();
        $("select").change(function() {
          $girl_list.scrollTop(0);
          restart_collect();
        });
      } else $btnStopCollect.trigger("click").hide();
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
          var awakening_costs = window.girlsDataList[id_girl].awakening_costs, $gems = $("#gems-amount"), actual_gems = Utils.toint_element($gems);
          $gems.text(`${awakening_costs}/${actual_gems}`);
          if (awakening_costs > actual_gems)
            $gems.css("color", "#c30009");
        }, 100);
      };
      const $haremRightEl = $(harem_right);
      if ($haremRightEl.length) {
        $haremRightEl.append($btnSafeWork);
        const observer = new MutationObserver(handleHaremRightChanges);
        observer.observe($haremRightEl[0], { childList: true, subtree: true });
        handleHaremRightChanges();
      }
      $btnSafeWork.click(function() {
        StoryHelper.toggleSafeWork(harem_right + " .avatar-box");
        $(this).attr("src", retrive_img());
      });
      $girl_list.bind("DOMNodeInserted", function() {
        $("#harem_left div.girls_list.grid_view div[girl]>.right").off("contextmenu.girlPreview").on("contextmenu.girlPreview", function(e) {
          $(this).parent().find(".left img").trigger("contextmenu");
          return Utils.stopClick(e);
        });
      });
      Css.addCss(
        `${harem_right}{position: relative}
            ${harem_right} img.view{
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
            }`
      );
    }
  }
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
      $(".tabs-switcher .switch-tab").click(selectGirlSlot);
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
        $("#temp-background").dblclick(function() {
          $(scene_selector).trigger("dblclick");
        });
        $("#scene .eye").click(function() {
          StoryHelper.toggleSafeWork(scene_selector);
        });
      }
      if (settings.cg_background)
        $("#scene").contextmenu(function(e) {
          Settings.change_settings(
            "choosed_bg",
            $(this).find("#background").attr("src")
          );
          return Utils.stopClick(e);
        });
      $("#breadcrumbs>span:nth-child(7)").css("cursor", "pointer").click(function() {
        location.reload();
      });
      var $girlBack = $("#breadcrumbs > a:nth-child(5)"), linkGirlBack = $girlBack.attr("href");
      if (linkGirlBack && linkGirlBack.startsWith("/harem/"))
        $girlBack.attr("href", linkGirlBack.replace("harem", "girl"));
    }
  }
  class SeasonArenaPage {
    static init(theme_colors) {
      const settings = Settings.settings;
      if (settings.colored_season) {
        var css_hero = "#season-arena .battle_hero", hero_power = Utils.toint_element(
          $(css_hero + " #player_attack_stat #stats-damage")
        ), hero_crown = Utils.toint_element(
          $(css_hero + " #player_ego_stat #stats-ego")
        ), opponent_index = 0;
        $(".opponents_arena .season_arena_opponent_container").each(
          function() {
            var $opponent_power = $(this).find(
              "#player_attack_stat #stats-damage"
            ), opponent_power = Utils.toint_element($opponent_power), $opponent_crown = $(this).find(
              "#player_ego_stat #stats-ego"
            ), opponent_crown = Utils.toint_element($opponent_crown), result_power = hero_power >= opponent_power, result_crown = hero_crown >= opponent_crown;
            $opponent_power.css(
              "color",
              result_power ? theme_colors.green : theme_colors.red
            );
            $opponent_crown.css(
              "color",
              result_crown ? theme_colors.green : theme_colors.red
            );
            var colors = false;
            if (!result_power && !result_crown)
              colors = {
                background: theme_colors.gray,
                "box-shadow": theme_colors.shadow_gray,
                "-webkit-box-shadow": theme_colors.shadow_gray
              };
            else if (!result_power || !result_crown)
              colors = {
                background: theme_colors.orange,
                "box-shadow": theme_colors.shadow_orange,
                "-webkit-box-shadow": theme_colors.shadow_orange
              };
            if (colors)
              $(".opponents_arena .opponent_perform_button_container").eq(opponent_index).find("button").css(colors);
            opponent_index++;
          }
        );
      }
      StoryHelper.questLink();
      if (settings.auto_battle) {
        const HeroData = Utils.getHeroData();
        const kissAmount = HeroData?.energies?.kiss?.amount || 0;
        const $container = $("#opponents_choose_text");
        $container.empty();
        StoryHelper.autoBattle({
          container: $container,
          defaultCount: kissAmount,
          energyType: "kiss",
          onStart: (count) => {
            const $buttons = $(".green_button_L");
            if ($buttons.length) {
              $buttons.first().trigger("click");
            } else {
              Settings.change_settings("battle_count", 0);
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
      $(".market-menu-switch-tab").click(function(e) {
        Settings.change_settings("last_link_shop", $(this).attr("type"));
      });
      $(".right-side-title").dblclick(function() {
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
      Css.addCss(Css.SHOP);
    }
  }
  class ActivitiesPage {
    static init() {
      const settings = Settings.settings;
      const HeroData = Utils.getHeroData();
      const confirm_exceed = function(e, values = {}) {
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
        var tab = $(".tabs-switcher .switch-tab.underline-tab").attr(
          "data-tab"
        );
        Settings.change_settings("last_link_activity", tab);
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
                $('[rel="pop_auto_assign"]').click(function() {
                  if ($('[rel="pop_action"]').is(":disabled"))
                    Settings.change_settings(
                      "auto_assign_pop",
                      false
                    );
                });
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
            Css.addCss(Css.POP, true);
            break;
          case "contests":
            if (settings.safe_work) {
              $(".right_part>img").addClass("safe-work");
              StoryHelper.safeWorkBackground(".contest_header");
            }
            if (settings.confirm_exceed)
              $(
                '.contest .personal_rewards button[rel="claim"]:visible'
              ).mousedown(function(e) {
                var rewards_string = $(e.target).parent().find(".reward_wrap").attr("data-reward-display"), rewards = JSON.parse(rewards_string).rewards;
                if (confirm_exceed(e, find_rewards(rewards)))
                  return;
              });
            break;
          case "daily_goals":
            if (settings.safe_work)
              $(".daily-goals-right-part>img").addClass("safe-work");
            if (settings.confirm_exceed)
              $(".progress-bar-rewards-container").mousedown(
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
            if (settings.auto_press_btns) {
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
                if (HeroData.infos.Xp.left <= settings.min_collect_exp && $mission.find(".mission_reward .slot_xp").length)
                  return;
                $btn.trigger("click");
              });
              if ($(".end_gift:visible").length)
                $(".end_gift button").trigger("click");
            }
            if (settings.confirm_exceed)
              $("button.purple_button_L:visible").mousedown(function(e) {
                var rewards_string = $(e.target).parent().parent().find(".mission_reward .reward_wrap").attr("data-reward-display"), rewards = JSON.parse(rewards_string).rewards;
                if (confirm_exceed(e, find_rewards(rewards)))
                  return;
              });
            if (settings.auto_start_activities) {
              const $startableMissions = $(".mission_object").filter(
                function() {
                  return $(this).find(
                    ".mission_button .blue_button_L:visible"
                  ).length > 0;
                }
              );
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
      $(".tabs-switcher .switch-tab").click(change_tab);
    }
  }
  class PantheonPage {
    static init(page_interact) {
      const settings = Settings.settings;
      if (settings.safe_work)
        $(
          ".team-girl-container, #rewards-girl-container img, .pantheon-container .pantheon_bgr .stage-bgr"
        ).addClass("safe-work");
      if (settings.pantheon_auto_enter) {
        const auto_enter = function() {
          var $btnPantheon = $(".pantheon-pre-battle-btn");
          if ($btnPantheon.length && $(".tabs-switcher #pantheon_tab").hasClass(
            "underline-tab"
          ) && !page_interact && $("#scriptPantheonAttempts").text() != "0")
            location.href = $btnPantheon.attr("href");
        };
        setTimeout(auto_enter, 3e3);
        $(".tabs-switcher .switch-tab").click(auto_enter);
      }
    }
  }
  class EventPage {
    static init() {
      const settings = Settings.settings;
      const HeroData = Utils.getHeroData();
      if (settings.safe_work)
        $(
          ".girl-avatar, .nc-event-reward-preview #carousel, .sm-static-girl"
        ).addClass("safe-work");
      $(".nc-event-list-reward-container").click(function() {
        if (settings.safe_work)
          var interval = setInterval(function() {
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
          if (girlHasAnimation && !HeroData.infos.no_pachinko_anim) {
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
        return Utils.stopClick(e);
      });
      if ($("#boss_bang").length) {
        var bang_selector = ".boss-bang-team-slot", bang_selected = bang_selector + ".selected-boss-bang-team";
        $("#start-bang-button").click(function() {
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
        $(bang_selector).click(function() {
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
      $(".side-quest-button").click(function() {
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
  class HomePage {
    static init() {
      const settings = Settings.settings;
      Utils.getHeroData();
      if (settings.battle_count > 0) {
        Settings.change_settings("battle_count", 0);
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
        $("#collect_all_container").click(function() {
          location.href = "/harem.html";
        });
      if (settings.auto_press_btns) {
        const $collectBtn = $("#collect_all:not(:disabled)");
        if ($collectBtn.length && $collectBtn.is(":visible")) {
          $collectBtn.trigger("click");
        }
      }
      if (settings.retrive_home_timer) {
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
          for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            if (route.notifs && $(route.check).find(
              ".button-notification-icon:not(.button-notification-doubleshards)"
            ).length)
              redirectPage(route);
            if ($(route.selector).text() == "0s") {
              if (!settings.auto_assign_pop && route.link == StoryHelper.links.activity + "pop")
                continue;
              if (route.check != "" && $(route.check).attr("href") == "#")
                continue;
              redirectPage(route);
            }
            if (settings.redirect_to_home) break;
          }
        }, 2500);
      }
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
      const init_change_waifu = function() {
        if (settings.random_waifu && settings.girls_data) {
          var $waifu_container = $(".waifu-container>img"), src = $waifu_container.attr("src");
          const change_waifu = function() {
            var random_waifu = Utils.random(
              settings.girls_data.length - 1
            ), selected_waifu = settings.girls_data[random_waifu], random_grade = Utils.random(selected_waifu.grade), image = StoryHelper.generateImg(
              selected_waifu.id,
              random_grade,
              src
            );
            $waifu_container.attr("src", image).attr(
              "title",
              `${selected_waifu.name} : ${random_grade}`
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
          $waifu_container.click(function() {
            clearTimeout(timeoutWaifu);
            timeoutWaifu = setTimeout(function() {
              if (!StoryHelper.unsafe_click) change_waifu();
              StoryHelper.unsafe_click = false;
            }, 300);
          }).css("cursor", "pointer");
        }
      };
      init_change_waifu();
      $(".waifu-buttons-container .eye").click(init_change_waifu);
      setTimeout(function() {
        if (settings.last_links) {
          if (settings.last_side_quest)
            $(".continue_side_quest_home, .side_quests").attr(
              "href",
              settings.last_side_quest
            );
          var $activitiesLink = $('a[rel="activities"]');
          $activitiesLink.find(`a[href^="${StoryHelper.links.activity}"]`).click(StoryHelper.changeLastActivityLink);
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
      $toggleSettings.appendTo($containerSettings).click(function() {
        $settingsArea.toggleClass("active");
      });
      $settingsArea.appendTo($containerSettings);
      var settings_to_generate = [
        {
          name: "auto_press_btns",
          text: "Auto press buttons",
          onchange: function(value) {
            if (!value) {
              Settings.change_settings("auto_battle", false);
              $('input[setting="auto_battle"]').prop("checked", false).prop("disabled", true);
            } else {
              $('input[setting="auto_battle"]').prop(
                "disabled",
                false
              );
            }
          }
        },
        { name: "auto_battle", text: "Auto battle" },
        { name: "auto_assign_pop", text: "Auto assign in place of power" },
        {
          name: "safe_work",
          text: "Safe for work filter",
          onchange: function(value) {
            StoryHelper.toggleSafeWork(".waifu-container");
          },
          stopafterchange: true
        },
        {
          name: "safe_work_opacity",
          text: "Safe for work opacity<br>default: 0.05",
          type: "number",
          min: 0,
          max: 1,
          step: 0.05
        },
        { name: "random_waifu", text: "Random waifu image" },
        {
          name: "change_waifu_interval",
          text: "Change waifu interval<br>in seconds - default: 30s",
          type: "number",
          min: 5
        },
        { name: "colored_season", text: "Colored season opponent" },
        {
          name: "pantheon_auto_enter",
          text: "Auto enter in pantheon (5s)"
        },
        { name: "journey_champion_active", text: "Champion journey" },
        {
          name: "last_links",
          text: "Override menu link with last visited page"
        },
        { name: "link_last_troll", text: "Go to last troll battle" },
        {
          name: "selected_mythic_item",
          text: "Select mythic item instead of legendary (girl page)"
        },
        {
          name: "retrive_home_timer",
          text: "Retrive automatically home timer (pachinko, pop, market and other)"
        },
        {
          name: "confirm_exceed",
          text: "Ask for confirmation if rewards exceed"
        },
        {
          name: "min_collect_exp",
          text: "Do not collect if xp lower than<br>default: 10.000",
          type: "number",
          min: 1,
          step: 100
        },
        {
          name: "auto_start_activities",
          text: "Auto start the daily activities"
        },
        {
          name: "avoid_legendary_first",
          text: "Avoid collecting legendary missions first"
        },
        {
          name: "auto_collect_harem",
          text: "Auto collect when enter in harem"
        },
        {
          name: "timeout_collect_after",
          text: "Timeout collect girl in harem<br>in millisecond - default: 3s - es. 3 seconds => 3000ms",
          type: "number",
          min: 25,
          step: 100
        },
        {
          name: "not_collect_full_graded",
          text: "Collect only full graded girl (recommended)"
        },
        {
          name: "minimum_money_open_harem",
          text: "Minimum amount to open harem clicking right collect all button<br>default: 0",
          type: "number",
          min: 0,
          step: 1e3
        },
        { name: "back_to_link", text: "Back to previous page when miss" },
        {
          name: "header_link_show",
          text: "Clickable header link after battle"
        },
        {
          name: "cg_background",
          text: 'Change background with selected story/messenger image <span title="Go to Messenger or Story (girl or quest), right-click on an image to set it as background. Important: SFW filter must be disabled." style="cursor:help; border-bottom:1px dotted white">(?)</span>'
        },
        { name: "invert_bg", text: "Flip horizontally background" },
        {
          name: "girls_data_export",
          text: "Export girls data button in the market"
        },
        {
          name: "max_days_club",
          text: "Flag club member as inactive after days<br>default: 60 days",
          type: "number",
          min: 1
        }
      ];
      for (var index = 0; index < settings_to_generate.length; index++) {
        var setting = settings_to_generate[index];
        Settings.generateSetting(setting, $settingsArea);
      }
      if (!settings.auto_press_btns) {
        $('input[setting="auto_battle"]').prop("disabled", true);
      }
      $settingsArea.append(
        $(
          '<p style="text-align:center; margin-bottom:0">All docs at <a href="https://sleazyfork.org/en/scripts/436188-hentai-heroes-helper-auto-collect-button-press-and-more" target="_blank" style="color:white" title="Docs">sleazyfork.org</a></p>'
        )
      );
      $(
        '<div class="setting-text-nav"><div class="setting-text-button setting-text-up">+</div><div class="setting-text-button setting-text-down">-</div></div>'
      ).insertAfter(".setting-text input");
      $(".setting-text").each(function() {
        var spinner = $(this), input = spinner.find('input[type="number"]'), btnUp = spinner.find(".setting-text-up"), btnDown = spinner.find(".setting-text-down"), min = parseFloat(input.attr("min")), max = parseFloat(input.attr("max")), step = input.attr("step");
        if (typeof step != "undefined") step = parseFloat(step);
        else step = 1;
        if (step <= 0) step = 1;
        btnUp.click(function() {
          var oldValue = parseFloat(input.val()), newVal = oldValue;
          if (oldValue + step >= max) {
            newVal = max;
          } else {
            newVal = oldValue + step;
          }
          spinner.find("input").val(newVal);
          spinner.find("input").trigger("change");
        });
        btnDown.click(function() {
          var oldValue = parseFloat(input.val()), newVal = oldValue;
          if (oldValue - step <= min) {
            newVal = min;
          } else {
            newVal = oldValue - step;
          }
          spinner.find("input").val(newVal);
          spinner.find("input").trigger("change");
        });
      });
      Css.addCss(Css.HOME, true);
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
      const settings = Settings.settings;
      Css.addCss(
        `.seasonal-event-panel .seasonal-event-container .tabs-section #home_tab_container .middle-container .girls-reward-container canvas.animated-girl-display{z-index:0!important}
            .mega-slot:has(.slot_lively_scene){background:#ffb827;border-radius:5px}`
      );
      if (settings.safe_work)
        $(".girls-reward-container").addClass("safe-work");
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
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) $("img[girl-ava-src]").addClass("safe-work");
    }
  }
  class WaifuPage {
    static init() {
      const settings = Settings.settings;
      if (settings.safe_work) {
        setTimeout(StoryHelper.waifuSafeWork, 500);
        $(".harem-girl-container").click(StoryHelper.waifuSafeWork);
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
      setInterval(function() {
        if (settings.cg_background)
          $(".girl-album-image>img, .message-image").off("contextmenu.choose_bg").on("contextmenu.choose_bg", function(e) {
            Settings.change_settings(
              "choosed_bg",
              $(this).attr("src").replace("800x", "1600x")
            );
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
        $a.click(function() {
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
        $(".champions-over__champion-tier-link").click(function() {
          setTimeout(function() {
            StoryHelper.safeWorkBackground("#scene_popup");
          }, 100);
        });
      }
      Css.addCss(
        `.champions-bottom__rest{font-size: 15px}
            .champions-over__girl-image{z-index:999}
            .champions-over__champion-wrapper{pointer-events:auto!important}`
      );
      if (page == "champions") {
        var max_champions = 6, champion_id = Utils.toint_string(window.championData.champion.id), $btns_container = $('<div class="btns_container"></div>');
        $btns_container.appendTo($(".champions-bottom__wrapper"));
        var previous_champion_id = champion_id - 1;
        if (previous_champion_id < 1) previous_champion_id = max_champions;
        $(
          `<button class="finished round_blue_button">
                    <img src="https://hh.hh-content.com/design/ic_arrow-left-ffffff.svg">
                </button>`
        ).click(function() {
          StoryHelper.goToChampion(previous_champion_id);
        }).appendTo($btns_container);
        var next_champion_id = champion_id + 1;
        if (next_champion_id > max_champions) next_champion_id = 1;
        $(
          `<button class="finished round_blue_button">
                    <img class="continue" src="https://hh.hh-content.com/design/ic_arrow-right-ffffff.svg">
                </button>`
        ).click(function() {
          StoryHelper.goToChampion(next_champion_id);
        }).appendTo($btns_container);
        Css.addCss(
          `.btns_container{
  display: flex;
  position: absolute;
  top: 5px;
  right: 149px;
}
.btns_container .round_blue_button img{height: 75%}`
        );
        if (settings.journey_champion_active) {
          StoryHelper.journeyChampion();
          $('button[rel="perform"]').click(function() {
            Settings.change_settings(
              "journey_champion",
              next_champion_id
            );
          });
        }
      } else if (page === "champions_map") {
        if (settings.journey_champion_active) StoryHelper.journeyChampion();
        $(".champion-lair").click(StoryHelper.changeLastChampionLink);
      }
    }
  }
  class PreBattlePage {
    static init(page) {
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
        StoryHelper.addBackToLink("/sex-god-path.html");
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
        const fightAmount = HeroData?.energies?.fight?.amount || 0;
        const $container = $(".battle-buttons-row").first();
        StoryHelper.autoBattle({
          container: $container,
          defaultCount: fightAmount,
          energyType: "fight",
          onStart: (count) => {
            const $fightBtn = $(".green_button_L");
            if ($fightBtn.length) {
              window.location.href = $fightBtn.attr("href");
            } else {
              Settings.change_settings("battle_count", 0);
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
          '.popup_buttons .blue_button_L, button[rel="pop_claim"]:not(:disabled), #heal_girl_labyrinth_popup .blue_button_L, #all-battle-skip-btn'
        );
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
        var $btnsFast = $(selectors);
        if ($btnsFast.length && settings.pachinko_press_btn) {
          if (skip_limit > 0) {
            $btnsFast.trigger("click");
            skip_limit--;
          }
        } else skip_limit = SKIP_LIMIT;
      }, 50);
    }
  }
  class SafeWorkGlobal {
    static init() {
      const settings = Settings.settings;
      if (!settings.safe_work) return;
      var to_check = true;
      setInterval(function() {
        var $heroPage = $("#hero_pages");
        if ($heroPage.length && to_check) {
          to_check = false;
          $heroPage.find(".girls, .img_wrapper").addClass("safe-work");
          to_check = true;
        }
        $(
          "#girls_holder #left_girl, #girls_holder #right_girl, .animated-girl-display, .payments-left-girl, .payments-right-girl, #no_energy_worship>img, #no_energy_fight>img, #no_energy_kiss>img, #no_energy_challenge>img, #awakening_popup .awakening-avatar, #no_energy_quest>img, .gradient_mask>img, .member-progression-bg .page-girl>img, .league_girl .girl-preview, .variant-video, .feature-girl .avatar, #pop .pop_left_part .pop_girl_avatar .pop_left_fade_list, .payments .product-background, .product-offer-background-container, .monthly_card .rewards-container, .bundle-offer-container.treasure-bg, .passes #left_girl, .passes #right_girl, .prestige_girl, #pov_pog_passes_popup .avatar, .hero_info .bottom .img_wrapper, .girl-image-container, .girl-display img[girl-ava-src], .raid-content .girl-img, .labyrinth-girl-img"
        ).addClass("safe-work");
        StoryHelper.safeWorkBackground("div.design-template-reward-center");
      }, 10);
      setInterval(StoryHelper.unsafeWork, 1e3);
    }
  }
  class Shortcuts {
    static init() {
      $(document).on("keypress", function(e) {
        if ($(e.target).is(".club-chat-input")) return;
        if (e.which == 13) $(".blue_button_L:visible").first().trigger("click");
      });
    }
  }
  class TrollLinks {
    static init() {
      const settings = Settings.settings;
      const HeroData = Utils.getHeroData();
      $(`a[href^="${StoryHelper.links.troll}"]`).click(
        StoryHelper.changeLastTroll
      );
      $(`button[data-href^="${StoryHelper.links.troll}"]`).click(
        StoryHelper.changeLastTroll
      );
      StoryHelper.trollMenuLink();
      if (settings.link_last_troll)
        $('.energy_counter[type="fight"] .energy_counter_amount').wrap(
          `<a href="${StoryHelper.links.troll}${settings.last_id_troll}" class="link_last_troll"></a>`
        );
      $('.energy_counter[type="fight"] .energy_counter_bar').contextmenu(
        function(e) {
          location.href = StoryHelper.links.troll + (HeroData.infos.questing.id_world - 1);
          return Utils.stopClick(e);
        }
      );
    }
  }
  class GirlPreview {
    static current_girlPreview = 0;
    static discover_previewGirls = false;
    static list_previewGirls = [];
    static list_previewGirls_info = {};
    static selector_previewGirls = `canvas, img:not(.excluded, .icon, .user-avatar, .background_images, [src*="/pictures/design/"], [src*="/pictures/misc/"], [src*="/pictures/hero/"], [src*="/payments/"], [src*="/logo_picture/"], [src*="ic_"] , [src*="/seasonal_event/"])`;
    static current_src;
    static init() {
      setInterval(() => {
        $(this.selector_previewGirls).off("contextmenu.girlPreview").on("contextmenu.girlPreview", (e) => {
          var $this = $(e.currentTarget);
          var search;
          var founds_preview = [];
          var regex;
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
            var $girlId = $("[girl-id]");
            if ($girlId.length) {
              $girlId.each(function() {
                founds_preview.push($(this).attr("girl-id"));
              });
            }
          }
          if (founds_preview === null || !founds_preview.length) return;
          for (var j = 0; j < founds_preview.length; j++) {
            var id_img = Utils.toint_string(founds_preview[j]);
            if (!id_img) continue;
            if (!this.list_previewGirls.includes(id_img)) {
              this.list_previewGirls.push(id_img);
              var type = "girls", types = ["troll", "club_champions", "champions"];
              for (var i = 0; i < types.length; i++) {
                if (search && search.includes(types[i])) {
                  type = types[i];
                  break;
                }
              }
              var owned = $this.parent().hasClass("already-owned") || $this.next().find(".shards>p>span").text() === "100/100";
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
      $panelImg.find(".close_cross").click(() => {
        $panelImg.remove();
        this.list_previewGirls = [];
        this.list_previewGirls_info = {};
        this.current_girlPreview = 0;
      });
      $panelImg.find(".prev").click(() => {
        this.current_girlPreview--;
        if (this.current_girlPreview < 0)
          this.current_girlPreview = this.list_previewGirls.length - 1;
        this.preview_girl(this.list_previewGirls[this.current_girlPreview]);
      });
      $panelImg.find(".next").click(() => {
        this.current_girlPreview++;
        if (this.current_girlPreview >= this.list_previewGirls.length)
          this.current_girlPreview = 0;
        this.preview_girl(this.list_previewGirls[this.current_girlPreview]);
      });
      $panelImg.find(".current .position").click(() => {
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
      for (var grade = 0; grade < 7; grade++)
        $(
          '<img class="excluded" src="' + StoryHelper.generateImg(
            id_img,
            grade,
            this.current_src,
            this.list_previewGirls_info[id_img].type
          ) + '">'
        ).appendTo($panelBody).on("error", function() {
          $(this).remove();
          total_images++;
        }).on("load", function() {
          total_images++;
        });
      var intResizeGirl = setInterval(() => {
        if (total_images == 7) {
          clearInterval(intResizeGirl);
          $panelBody.find("p").remove();
          var $imgs = $panelBody.find("img");
          $imgs.css({
            width: 100 / $imgs.length + "%",
            height: $panelBody.height()
          }).click(function() {
            $(this).toggleClass("zoom");
            $panelBody.scrollTop($(this).position().top);
          });
        }
      }, 500);
    }
  }
  class FinalCss {
    static init() {
      const settings = Settings.settings;
      Css.addCss(
        Css.MAIN.replace("{{SFW_OPACITY}}", settings.safe_work_opacity)
      );
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
      if (page === "unknown" || location.pathname === "/undefined") {
        location.href = "/home.html";
        return;
      }
      Settings.get_settings();
      MiscGlobal.init(page);
      RedirectHome.init(page, MiscGlobal.page_interact);
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
        hero_pages: () => HeroPagesPage.init(),
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
          routes[page]();
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
      FinalCss.init();
    });
  }

})();