// ==UserScript==
// @name         Grepolis City Manager
// @version      1.2.5
// @include      http://*.grepolis.com/game/*
// @include      https://*.grepolis.com/game/*
// @require		 http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @description  A little handy script to help with City Management
// @author       MajorOrbital
// @copyright    2020+
// @grant        unsafeWindow
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/451401
// @downloadURL https://update.greasyfork.org/scripts/397044/Grepolis%20City%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/397044/Grepolis%20City%20Manager.meta.js
// ==/UserScript==

const uw = unsafeWindow;


//#region CSS
/**
 * Adds the custom CSS to the plugin.
 */
GM_addStyle(`
:root {
    --main: #ffe2a2
}

#GRM_button {
    margin-bottom: 3px;
}

#GRM_help_window {
    width: 200px;
    position: absolute;
    top: 20px;
    left: 550px;
    text-align: left;
    display: none;
    float: right;
}

#GRM_window {
    display: none;
    width: 780px;
    z-index: 1100;
    position: absolute;
    top: 100px;
    left: 30vw;
   text-align: center !important;
}

#GRM_toolbar {
    height: 30px;
    border-bottom: 2px black solid;
}

#GRM_toolbar_list {
    list-style-type: none;
    margin: 0;
    padding-top: 3px;
    padding-left: 1px;
    overflow: hidden;
    top: 10px;
}

#GRM_title {
    padding-top: 3px;
    float: left;
    width: 40%;
    text-align: left;
}

#GRM_building {
    max-width: 360px;
    /*position: relative;*/
    left: 10px;
}

#GRM_population_input {
  right: 2px;
  float: right;
  height: 13px;
}

#GRM_buildings {
    margin-left: 5px;
}

#GRM_troops_container {
    margin-left: 5px;
}


#GRM_gods {
    height: 100px;
    width: 100px;
    position: absolute;
    top: 50px;
    left: 390px;
}

#GRM_copyright {
    /*position: relative;*/
    text-align: left;
    font-size: xx-small;
}

#GRM_population_container {
    max-width: 110px;
    /*position: relative;*/
    left: 5px;
    bottom: 480px;
    font-weight: bold;
}

#GRM_pop_icon {
   /* position: relative;*/
    top: 2px;
    left: 5px;
}

#GRM_population_boost_container {
  height: 20px;
  margin-right: 20px;
  width: 70px;
  float: left;
  padding: 2px;
}


#GRM_help_button {
    max-width: 70px;
    margin-left: 5px;
    float: right;
}

#GRM_help_text {
   position: relative;
    bottom: 3px;
    left: 4px;
}

#GRM_plow {
  padding: 2px;
}

#GRM_boosts_container{
 /* position: relative;*/
  bottom: 510px;
  left: 240px;
  max-width: 200px;
  max-height: 35px;
}

#GRM_trade_icon > div{
 /* position: relative;*/
  margin-left: 1px;
  margin-top: 1px;
}

#GRM_trade_manager{
  display: none;
}

.gpwindow_content_override{
  background: url(https://gpnl.innogamescdn.com/images/game/layout/gpwindow_bg.jpg) 0 0 repeat;
  position: absolute;
  left: 0;
  right: 0;
  top: 44px;
  bottom: 17px;
  text-align: center;
  z-index: 15;
}

.GRM_building_image {
    height: 40px;
    width: 40px;
    letter-spacing: -1px;
    margin: 0;
    display: inline-grid;
}

.GRM_building_level {
  position: relative;
  bottom: -25px;
  right: 3px;
  color: white;
  text-align: right;
  max-height: 18px;
  font-weight: bolder;
}

.GRM_selector {
    height: 40px;
    width: 30px;
    top: 10px;
    display: inline;
    position: relative;
}

.GRM_troop_input {
    width: 36px;
}

.GRM_building_input {
    width: 35px;
}

.GRM_troop_container {
    max-width: 50px;
    z-index: 5;
}

.GRM_small {
  width: 50px;
}

.GRM_unselected {
  filter: grayscale(100%);
}

.GRM_special_child {
    width: 40px;
    height: 40px;
    float: left;
    margin: 2px
}

.GRM_label {
    max-width: 450px;
    margin: 5px 0;
    font-weight: bold;
}

.GRM_border {
    border: thin solid #c78e25;
}

input.invalid {
    border: 1px solid red;
    background-color: rgba(128, 0, 0, 0.3)
}

input.valid {
    border: 1px solid green;
    background-color: rgba(0, 128, 0, 0.3)
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
}
`);

//#endregion

/**
 * Utility class. Contains global variables and functions that are used in multiple places.
 */
class Utils {
  //METHODS AND CONSTANTS TO GET IMAGES FOR EASY CHANGING
  //#region IMAGE METHODS AND CONSTANTS

  static all_gods = "https://i.imgur.com/Kvb5gqn.png";
  static artemis = "https://i.imgur.com/yNL9x1M.png";
  static hades = "https://i.imgur.com/Via8HPf.png";
  static poseidon = "https://i.imgur.com/w2LtW83.png";
  static hera = "https://i.imgur.com/eNTFFg1.png";
  static athena = "https://i.imgur.com/u8SRGdE.png";
  static zeus = "https://i.imgur.com/35HpxKg.png";
  static aphrodite = "https://i.imgur.com/YFky5SC.png"
  static no_god = "https://i.imgur.com/dFBR5Jd.png";

  static boar_img = "https://i.imgur.com/8gPrDSv.png";
  static envoy_img = "https://i.imgur.com/nbXIVhL.png";
  static griffin_img = "https://i.imgur.com/EHb10e5.png";
  static centaur_img = "https://i.imgur.com/xjkGFHW.png";
  static pegasus_img = "https://i.imgur.com/cuOpkX3.png";
  static harpy_img = "https://i.imgur.com/PA4uFbi.png";
  static medusas_img = "https://i.imgur.com/LV15g0U.png";
  static cerberus_img = "https://i.imgur.com/PGkEpRy.png";
  static eryn_img = "https://i.imgur.com/1YqBRbv.png";
  static cyclops_img = "https://i.imgur.com/q81Ks1C.png";
  static hydra_img = "https://i.imgur.com/bQTnQv1.png";
  static minotaur_img = "https://i.imgur.com/pdVWfdf.png";
  static manticore_img = "https://i.imgur.com/ttR3Q8x.png";
  static satyr_img = "https://i.imgur.com/xwBaY9B.png";
  static siren_img = "https://i.imgur.com/P8Vwt8r.png"

  static unit_img = "https://i.imgur.com/xLOtNgs.png";
  static chariot_img = "https://i.imgur.com/GpLHnv3.png"
  static lightship_img = "https://i.imgur.com/Y5WorTq.png";
  static slow_transporter_img = "https://i.imgur.com/43NVBNT.png";
  static bireme_img = "https://i.imgur.com/kLQCM99.png";
  static catapult_img = "https://i.imgur.com/oFEOsXo.png";
  static demolitionship_img = "https://i.imgur.com/JNfJ3h0.png";
  static fast_transporter_img = "https://i.imgur.com/WYCQUZo.png";
  static trireme_img = "https://i.imgur.com/0YlGkCP.png";
  static colo_img = "https://i.imgur.com/e0W5k39.png";

  static plow_active = "https://i.imgur.com/NfC00og.png";
  static plow_inactive = "https://i.imgur.com/rmYBLc0.png";
  //#endregion

  //Max levels of all buildings.
  static max_levels = {
    main: 25,
    hide: 10,
    place: 1,
    lumber: 40,
    stoner: 40,
    ironer: 40,
    market: 30,
    docks: 30,
    barracks: 30,
    wall: 25,
    storage: 35,
    farm: 45,
    academy: 36,
    temple: 30,
  };

  //Population you get from your farm levels.
  static farm_pop = [
    14,
    38,
    69,
    105,
    145,
    189,
    237,
    288,
    342,
    399,
    458,
    520,
    584,
    651,
    720,
    790,
    863,
    938,
    1015,
    1094,
    1174,
    1257,
    1341,
    1426,
    1514,
    1602,
    1693,
    1785,
    1878,
    1973,
    2070,
    2168,
    2267,
    2368,
    2470,
    2573,
    2678,
    2784,
    2891,
    3000,
    3109,
    3220,
    3332,
    3446,
    3560,
  ];

  //#region costs of buildings

  static main_cost = [
    0,
    1,
    3,
    6,
    9,
    13,
    17,
    21,
    25,
    30,
    35,
    40,
    46,
    52,
    58,
    64,
    70,
    77,
    84,
    91,
    98,
    106,
    113,
    121,
    129,
    137,
  ];
  static resources_cost = [
    0,
    1,
    2.4,
    3.9,
    5.7,
    5.7,
    9.4,
    11.4,
    13.5,
    15.6,
    17.8,
    20,
    22.3,
    24.7,
    27.1,
    29.5,
    32,
    34.5,
    37.1,
    39.7,
    42.3,
    45,
    47.6,
    50.4,
    53.1,
    55.9,
    58.7,
    61.5,
    64.4,
    67.3,
    70.2,
    73.1,
    76.1,
    79.1,
    82.1,
    85.1,
    88.2,
    91.3,
    94.3,
    97.5,
    100.6,
  ];
  static barracks_cost = [
    0,
    1,
    2.5,
    4.2,
    6.1,
    8.1,
    10.3,
    12.5,
    14.9,
    17.4,
    20,
    22.6,
    25.3,
    28.1,
    30.9,
    33.8,
    36.8,
    39.8,
    42.8,
    46,
    49.1,
    52.3,
    55.6,
    58.9,
    62.3,
    65.7,
    69.1,
    72.6,
    76.1,
    79.6,
    83.2,
  ];
  static docks_cost = [
    0,
    4,
    8,
    12,
    16,
    20,
    24,
    28,
    32,
    36,
    40,
    44,
    48,
    52,
    56,
    60,
    64,
    68,
    72,
    76,
    80,
    84,
    88,
    92,
    96,
    100,
    104,
    108,
    112,
    116,
    120,
  ];
  static hide_cost = [0, 3, 4.2, 5.2, 6, 6.7, 7.3, 7.9, 8.5, 9, 9.5];
  static academy_cost = [
    0,
    3,
    6,
    9,
    12,
    15,
    18,
    21,
    24,
    27,
    30,
    33,
    36,
    39,
    42,
    45,
    48,
    51,
    54,
    57,
    60,
    63,
    66,
    69,
    72,
    75,
    78,
    81,
    84,
    87,
    90,
    93,
    96,
    99,
    102,
    105,
    108,
  ];
  static temple_cost = [
    0,
    5,
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55,
    60,
    65,
    70,
    75,
    80,
    85,
    90,
    95,
    100,
    105,
    110,
    115,
    120,
    125,
    130,
    135,
    140,
    145,
    150,
  ];
  static market_cost = [
    0,
    2,
    4.3,
    6.7,
    9.2,
    11.7,
    14.4,
    17,
    19.7,
    22.4,
    25.2,
    28,
    30.8,
    33.6,
    36.5,
    39.3,
    42.2,
    45.1,
    48.1,
    51,
    54,
    56.9,
    59.9,
    62.9,
    66,
    69,
    72,
    75.1,
    78.1,
    81.2,
    84.3,
  ];
  static wall_cost = [
    0,
    2,
    4.5,
    7.2,
    10,
    12.9,
    16,
    19.1,
    22.3,
    25.6,
    28.9,
    32.3,
    35.7,
    39.2,
    42.7,
    46.3,
    49.9,
    53.5,
    57.2,
    60.9,
    64.6,
    68.4,
    72.2,
    76,
    79.8,
    83.7,
  ];

  //#endregion

  /**
   * Helper method to get the max level of a building according to the name.
   * @param {String} name Name of the building you want the maximum level for.
   */
  static getMaxLevel(name) {
    switch (name) {
      case "main":
        return Utils.max_levels.main;
      case "hide":
        return Utils.max_levels.hide;
      case "place":
        return Utils.max_levels.place;
      case "lumber":
        return Utils.max_levels.lumber;
      case "stoner":
        return Utils.max_levels.stoner;
      case "ironer":
        return Utils.max_levels.ironer;
      case "market":
        return Utils.max_levels.market;
      case "docks":
        return Utils.max_levels.docks;
      case "barracks":
        return Utils.max_levels.barracks;
      case "wall":
        return Utils.max_levels.wall;
      case "storage":
        return Utils.max_levels.storage;
      case "farm":
        return Utils.max_levels.farm;
      case "academy":
        return Utils.max_levels.academy;
      case "temple":
        return Utils.max_levels.temple;
      default:
        return 1;
    }
  }

  /**
   * Helper function. Used in the god selection wheel.
   * @param {Number} x The X coordinate of the position clicked
   * @param {Number} y The Y coordinate of the position clicked
   * @param {Object} coords Contains an x and a y coordinate.
   * @returns {Boolean} If the x and y of the position clicked lie within the coords given.
   */
  static checkMouseClicked(x, y, coords) {
    return (
      coords.x <= x && x <= coords.x + 30 && coords.y <= y && y <= coords.y + 30
    );
  }

  /**
   * Helper method to get the leveled special building out of an array.
   * @param {Array} specialList An array of objects with the levels of the special buildings.
   */
  static getSpecialBuilding(specialList) {
    for (let i in specialList) {
      if (specialList[i][1] === 1) return specialList[i][0];
    }
    return null;
  }

  /**
   * Helper method to get the cost of a building.
   * @param {String} key The name of the building you want to get the cost from.
   * @param {Number} value The level of the building you want to get the cost from.
   */
  static getCostFromBuilding(key, value) {
    switch (key) {
      case "main":
        return Utils.main_cost[value];
      case "hide":
        return Utils.hide_cost[value];
      case "place":
        return 1;
      case "lumber":
        return Utils.resources_cost[value];
      case "stoner":
        return Utils.resources_cost[value];
      case "ironer":
        return Utils.resources_cost[value];
      case "market":
        return Utils.market_cost[value];
      case "docks":
        return Utils.docks_cost[value];
      case "barracks":
        return Utils.barracks_cost[value];
      case "wall":
        return Utils.wall_cost[value];
      case "storage":
        return 0;
      case "farm":
        return 0;
      case "academy":
        return Utils.academy_cost[value];
      case "temple":
        return Utils.temple_cost[value];
      case "theater":
        return value === 1 ? 60 : 0;
      case "thermal":
        return value === 1 ? 60 : 0;
      case "library":
        return value === 1 ? 60 : 0;
      case "lighthouse":
        return value === 1 ? 60 : 0;
      case "tower":
        return value === 1 ? 60 : 0;
      case "statue":
        return value === 1 ? 60 : 0;
      case "oracle":
        return value === 1 ? 60 : 0;
      case "trade_office":
        return value === 1 ? 60 : 0;
      default:
        return 0;
    }
  }

  /**
   * Helper method to get the cost of a mythological creature and their corresponding god.
   * @param {Number} n The mythological creature slot. Either 1 or 2.
   * @param {String} god The string for the god you want to get the myth costs for.
   */
  static getMythCost(n, god) {
    switch (god) {
      case "artemis":
        return n === 1 ? 20 : 35;
      case "aphrodite":
          return 16;
      case "athena":
        return n === 1 ? 12 : 20;
      case "poseidon":
        return n === 1 ? 40 : 50;
      case "hades":
        return n === 1 ? 30 : 55;
      case "zeus":
        return n === 1 ? 30 : 45;
      case "hera":
        return n === 1 ? 14 : 18;
      default:
        return 0;
    }
  }

  static getMythInBoat(n, god) {
    switch (god) {
      case "artemis":
        return n === 1;
      case "aphrodite":
          return n===1;
      case "athena":
        return n === 1;
      case "poseidon":
        return n === 1;
      case "hades":
        return true;
      case "zeus":
        return n === 1;
      case "hera":
        return n !== 1;
      default:
        return true;
    }
  }

  /**
   * Helper method to keep the code cleaner. Just gets a value from an inputbox.
   * @param {String} selector The HTML selector for the element of troops
   */
  static getWantedTroops(selector) {
    return $(selector).val().length === 0 ? 0 : parseInt($(selector).val());
  }
}
class MainView {
  constructor() {
    this._plannerView = new PlannerView();
    this._tradeView = new TradeView();
    this.addMenuItem();
    this.initializeWindow();
    this._plannerView.addPlannerView();
    this._tradeView.addTradeView();
  }
  addMenuItem() {
    $("#ui_box > div.nui_main_menu > div.middle > div.content > ul").append(
      `<li id="GRM_button">
          <span class="content_wrapper">
              <span class="button_wrapper">
                  <span class="button">
                      <span class="icon" style="background: url(&quot;https://s19.directupload.net/images/200222/6wtpwmkp.png&quot;) no-repeat;"></span>
                  </span>
              </span>
              <span class="name_wrapper">
                  <span class="name">GCM</span>
              </span>
          </span>
      </li>`
    );
  }
  /**
   * Initializes the main window of the plugin.
   */
  initializeWindow() {
    $("body").append(`
    <div id="GRM_window" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable js-window-main-container">
    <div class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix">
        <span class="ui-dialog-title">Grepolis City Manager</span>
        <a href="#" id="GRM_close" class="ui-dialog-titlebar-close ui-corner-all" role="button">
            <span class="ui-icon ui-icon-closethick">close</span></a>
        <div class="menu_wrapper closable" style="left: 75px;">
            <ul class="menu_inner" style="width: 5000px;">
                <li>
                    <a data-menu_name="Resource Planner" class="submenu_link" href="#" id="GRM_res_planner">
                    <span class="left"><span class="right">
                    <span class="middle">Resource Planner</span></span></span></a></li>
                <li>
                    <a data-menu_name="City Planner" class="submenu_link active" href="#" id="GRM_city_planner">
                    <span class="left">
                        <span class="right">
                            <span class="middle">City Planner</span>
                        </span>
                    </span>
                    </a>
                </li>
            </ul>
        </div>
    </div>
    <div class="gpwindow_frame ui-dialog-content ui-widget-content"
         style="display: block; width: auto; min-height: 0; height: 600px;" scrolltop="0" scrollleft="0">
        <div class="gpwindow_left"></div>
        <div class="gpwindow_right"></div>
        <div class="gpwindow_bottom">
            <div class="gpwindow_left corner"></div>
            <div class="gpwindow_right corner"></div>
        </div>
        <div class="gpwindow_top">
            <div class="gpwindow_left corner"></div>
            <div class="gpwindow_right corner"></div>
        </div>
        <div class="gpwindow_content_override">
            <div>
                <div class="game_inner_box">

                    <div class="game_border ">
                        <div class="game_border_top"></div>
                        <div class="game_border_bottom"></div>
                        <div class="game_border_left"></div>
                        <div class="game_border_right"></div>
                        <div class="game_border_corner corner1"></div>
                        <div class="game_border_corner corner2"></div>
                        <div class="game_border_corner corner3"></div>
                        <div class="game_border_corner corner4"></div>


                        <div id="GRM_window_header" class="game_header bold" style="height:18px;">
                            <div style="float:left; padding-right:10px;" id="GRM_header_title">
                                City Planner
                            </div>
                            <div id='GRM_help_button'>
                                <img src='https://gpnl.innogamescdn.com/images/game/support/menu_icon.png' width='15px'
                                     height='15px'><span
                                    id='GRM_help_text'>Help</span>
                            </div>
                        </div>
                        
                        

                    </div>
                </div>
            </div>
        </div>
    </div>


</div>

`);
  }

  switchWindowTo(id) {
    return;
  }

  get plannerView() {
    return this._plannerView;
  }

  get tradeView() {
    return this._tradeView;
  }
}

class MainPresenter {
  constructor(view, town_model) {
    this._view = view;
    this._model = town_model;
    new PlannerPresenter(this._model, this._view.plannerView);
    this.addEventHandlers();
  }

  addEventHandlers() {
    //Open GRM window with the city planner active
    let temp = this;

    $("#GRM_button").on("click", function () {
      if (temp._model.towns.length === 0) {
        temp._model.initTowns();
      }
      temp._model.selected_id = uw.ITowns.getCurrentTown().id;
      const town = temp._model.getTown(temp._model.selected_id);

      temp.openWindow(town);
    });
    //Uses Jquery to make the plugin window draggable.
    $("#GRM_window").draggable();

    //Makes it possible to close the plugin window.
    $("#GRM_close").on("click", function () {
      $("#GRM_window").css("display", "none");
    });
    //QoL , press escape to close GRM_window
    $(document).keydown(function(e) {
      // ESCAPE key pressed
      if (e.keyCode == 27) {
        $("#GRM_window").css("display", "none");
      }
  });

    $("#GRM_res_planner").on("click", function () {
      if (!$(this).hasClass("active")) {
        //deactivate everything
        $("#GRM_city_planner").removeClass("active");
        $("#GRM_city_planner_content").css("display", "none");
        //activate everything
        $(this).addClass("active");
        $("#GRM_header_title").text("Trade Manager");
        $("#GRM_trade_manager").css("display", "block");
      }
    });
    $("#GRM_city_planner").on("click", function () {
      if (!$(this).hasClass("active")) {
        $("#GRM_res_planner").removeClass("active");
        $("#GRM_trade_manager").css("display", "none");
        $(this).addClass("active");
        $("#GRM_header_title").text("City Planner");
        $("#GRM_city_planner_content").css("display", "block");
      }
    });
  }

  openWindow(town) {
    this._view.plannerView.fillGRMWindow(town);
    $("#GRM_window").css("display", "block");
  }
}
/**
 * The PlannerView class. This has everything to do with the way things look in the screen.
 */
class PlannerView {
  constructor() {}

  /**
   * Adds the menu item at the left side of the screen.
   */
  addPlannerView() {
    $("#GRM_window_header").after(`<div id="GRM_city_planner_content">
                            <div id="GRM_buildings">
                                <label id="city_name"></label>
                                <table>
                                    <tr>
                                        <th colspan="4" id="GRM_city_name"></th>
                                    </tr>
                                    <tr>
                                        <td id="GRM_population_container" class="GRM_border">
                                            <span id="GRM_used_pop">899</span>/<span id="GRM_total_pop">4116</span>
                                            <img id="GRM_pop_icon" src="https://i.imgur.com/7imuyHr.png">
                                        </td>
                                        <td id="GRM_main" class="building">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/main.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_main_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_main_level_pick">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_main_input"
                                                            name="main_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id='GRM_boosts_container' colspan=2>
                                            <div id='GRM_population_boost_container' class='GRM_border'>
                                                <img src='https://i.imgur.com/Tq4KMdO.png' width='20px' height='20px'/>
                                                <input type="number" min=0 max=400 step=50 name="population_boost"
                                                       id='GRM_population_input'
                                                       class="GRM_troop_input">
                                            </div>

                                            <img id='GRM_plow' src='${Utils.plow_inactive}' width='20px' height='20px'
                                                 class='GRM_border GRM_plow_inactive'/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td id="GRM_lumber">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/lumber.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_lumber_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_lumber_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_lumber_input"
                                                            name="lumber_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_farm">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/farm.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_farm_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_lumber_farm">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_farm_input"
                                                            name="farm_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_stoner">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/stoner.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_stoner_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_stoner_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_stoner_input"
                                                            name="stoner_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_storage">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/storage.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_storage_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_storage_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_storage_input"
                                                            name="storage_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td id="GRM_ironer">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/ironer.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_ironer_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_ironer_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_ironer_input"
                                                            name="ironer_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_barracks">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/barracks.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_barracks_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_barracks_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_barracks_input"
                                                            name="barracks_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_temple">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/temple.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_temple_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_temple_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_temple_input"
                                                            name="temple_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_market">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/market.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_market_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_market_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_market_input"
                                                            name="market_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td id="GRM_docks">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/docks.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_docks_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_docks_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_docks_input"
                                                            name="docks_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_academy">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/academy.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_academy_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_academy_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_academy_input"
                                                            name="academy_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_wall">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/wall.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_wall_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_wall_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_wall_input"
                                                            name="wall_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td id="GRM_hide">
                                            <div class="GRM_container">
                                                <div
                                                        class="GRM_building_image"
                                                        style="background-image: url('https://gpnl.innogamescdn.com/images/game/main/hide.png');"
                                                >
                                                    <span class="GRM_building_level" id="GRM_hide_level"></span>
                                                </div>
                                                <div class="GRM_selector" id="GRM_hide_selector">
                                                    <input
                                                            type="number"
                                                            min="0"
                                                            step="1"
                                                            class="GRM_building_input valid"
                                                            value="1"
                                                            id="GRM_hide_input"
                                                            name="hide_level"
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" id="GRM_special_1" class="GRM_special_container">
                                            <div
                                                    id="GRM_theater"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/theater_passive.png')"
                                            ></div>
                                            <div
                                                    id="GRM_thermal"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/thermal_passive.png')"
                                            ></div>
                                            <div
                                                    id="GRM_library"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/library_passive.png')"
                                            ></div>
                                            <div
                                                    id="GRM_lighthouse"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/lighthouse_passive.png')"
                                            ></div>
                                        </td>
                                        <td colspan="2" id="GRM_special_2" class="GRM_special_container">
                                            <div
                                                    id="GRM_tower"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/tower_passive.png')"
                                            ></div>
                                            <div
                                                    id="GRM_statue"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/statue_passive.png')"
                                            ></div>
                                            <div
                                                    id="GRM_oracle"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/oracle_passive.png')"
                                            ></div>
                                            <div
                                                    id="GRM_trade_office"
                                                    class="GRM_special_child GRM_passive"
                                                    style="background: url('https://gpnl.innogamescdn.com/images/game/main/trade_office_passive.png')"
                                            ></div>
                                        </td>
                                    </tr>
                                </table>
                                <table id='GRM_gods'>
                                    <tr>
                                        <td><img id="GRM_select_artemis" class="GRM_small GRM_unselected" src='${Utils.artemis}'/></td>
                                        <td><img id="GRM_select_athena" class="GRM_small GRM_unselected" src='${Utils.athena}'/></td>
                                    </tr>
                                    <tr>
                                        <td><img id="GRM_select_aphrodite" class="GRM_small GRM_unselected" src='${Utils.aphrodite}'/></td>
                                        <td><img id="GRM_select_hera" class="GRM_small GRM_unselected" src='${Utils.hera}'/></td>
                                    </tr>
                                    <tr>
                                        <td><img id="GRM_select_hades" class="GRM_small GRM_unselected" src='${Utils.hades}'/></td>
                                        <td><img id="GRM_select_poseidon" class="GRM_small GRM_unselected" src='${Utils.poseidon}'/></td>
                                    </tr>
                                    <tr>
                                        <td colspan=2><img id="GRM_select_zeus" class="GRM_small GRM_unselected" src='${Utils.zeus}'/></td>
                                    </tr>
                                </table>
                            </div>
                            <div id="GRM_troops_container">
                                <p class="GRM_label">Enter the amount of troops you want of each type in here.</p>
                                <table id="GRM_troops_want" class="GRM_border">
                                    <tr>
                                        <td id="GRM_ls_want" class="GRM_troop_container">
                                            <img src="${Utils.lightship_img}"/>
                                            <input type="number" min="0" step="1" name="ls_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_bir_want" class="GRM_troop_container">
                                            <img src="${Utils.bireme_img}"/>
                                            <input type="number" min="0" step="1" name="bir_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_trir_want" class="GRM_troop_container">
                                            <img src="${Utils.trireme_img}"/>
                                            <input type="number" min="0" step="1" name="trir_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_demo_want" class="GRM_troop_container">
                                            <img src="${Utils.demolitionship_img}"/>
                                            <input type="number" min="0" step="1" name="demo_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_colo_want" class="GRM_troop_container">
                                            <img src="${Utils.colo_img}"/>
                                            <input type="number" min="0" step="1" name="colo_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_cata_want" class="GRM_troop_container">
                                            <img src="${Utils.catapult_img}"/>
                                            <input type="number" min="0" step="1" name="cata_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_chariot_want" class="GRM_troop_container">
                                            <img src="${Utils.chariot_img}"/>
                                            <input type="number" min="0" step="1" name="chariot_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_envoy_want" class="GRM_troop_container">
                                            <img src="${Utils.envoy_img}"/>
                                            <input type="number" min="0" step="1" name="envoy_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_myth_1_want" class="GRM_troop_container">
                                            <img src="${Utils.minotaur_img}"/>
                                            <input type="number" min="0" step="1" name="myth_1_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                        <td id="GRM_myth_2_want" class="GRM_troop_container">
                                            <img src="${Utils.manticore_img}"/>
                                            <input type="number" min="0" step="1" name="myth_2_want"
                                                   class="GRM_troop_input"/>
                                        </td>
                                    </tr>
                                </table>

                                <p class="GRM_label">The current maximum possible amount of each troop (+ your choices
                                    above)</p>
                                <table id="GRM_troops_possible" class='GRM_border'>
                                    <tr>
                                        <td id="GRM_ls_pos" class="GRM_troop_container">
                                            <img src="${Utils.lightship_img}"/>
                                            <input type="number" name="ls_pos" class="GRM_troop_input" disabled/>
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_bir_pos" class="GRM_troop_container">
                                            <img src="${Utils.bireme_img}"/>
                                            <input
                                                    type="number"
                                                    name="bir_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_trir_pos" class="GRM_troop_container">
                                            <img src="${Utils.trireme_img}"/>
                                            <input
                                                    type="number"
                                                    name="trir_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_demo_pos" class="GRM_troop_container">
                                            <img src="${Utils.demolitionship_img}"/>
                                            <input
                                                    type="number"
                                                    name="demo_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_land_fast_pos" class="GRM_troop_container">
                                            <img src="${Utils.fast_transporter_img}"/>
                                            <input
                                                    id="GRM_land_fast_pos_boat"
                                                    type="number"
                                                    name="land_fast_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <input
                                                    id="GRM_land_fast_pos_troops"
                                                    type="number"
                                                    name="land_fast_pos_troops"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_land_slow_pos" class="GRM_troop_container">
                                            <img src="${Utils.slow_transporter_img}"/>
                                            <input
                                                    id="GRM_land_slow_pos_boat"
                                                    type="number"
                                                    name="land_slow_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <input
                                                    id="GRM_land_slow_pos_troops"
                                                    type="number"
                                                    name="land_slow_pos_troops"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_troops_pos" class="GRM_troop_container">
                                            <img src="${Utils.unit_img}"/>
                                            <input
                                                    type="number"
                                                    name="troops_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_myth_1_pos" class="GRM_troop_container">
                                            <img src="${Utils.minotaur_img}"/>
                                            <input
                                                    type="number"
                                                    name="myth_1_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input">0</span>
                                        </td>
                                        <td id="GRM_myth_2_pos" class="GRM_troop_container">
                                            <img src="${Utils.manticore_img}"/>
                                            <input
                                                    type="number"
                                                    name="myth_2_pos"
                                                    class="GRM_troop_input"
                                                    disabled
                                            />
                                            <span class="GRM_troop_input"></span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <p id='GRM_help_window'>
                                De plugin haalt de huidige levels op van je stad. <br>
                                Je kan deze aanpassen door zelf een level in te geven. <br>
                                Daarna kan je een god selecteren voor je stad (dit is standaard de huidige god van de
                                stad)<br>
                                Hierna kan je gewenste troepen invullen (denk maar aan een def stadje met bir en lt, of
                                een off lt stadje met
                                katapulten.)
                                Daarna zal de plugin de mogelijke resterende troepen berekenen! <br>
                                De nummers onder de laatste rij met hoeveelheden is de overschot van inwoners die je dan
                                normaal hebt!
                                <br><br><span id='GRM_copyright'>Afbeeldingen zijn eigendom van &copy;InnoGames</span>
                            </p>
                        </div>
                        `);
  }

  /**
   * This method will fill the plugin window with the data from your current selected city.
   * @param {Town} town The town you currently have selected and want to fill the window with.
   */
  fillGRMWindow(town) {
    $("#GRM_city_name").text(`${town.getName()}`);
    const buildings = town.buildings;
    $("#GRM_main_level").text(`${buildings.main}`);
    $("#GRM_hide_level").text(`${buildings.hide}`);
    $("#GRM_place_level").text(`${buildings.place}`);
    $("#GRM_lumber_level").text(`${buildings.lumber}`);
    $("#GRM_stoner_level").text(`${buildings.stoner}`);
    $("#GRM_ironer_level").text(`${buildings.ironer}`);
    $("#GRM_market_level").text(`${buildings.market}`);
    $("#GRM_docks_level").text(`${buildings.docks}`);
    $("#GRM_barracks_level").text(`${buildings.barracks}`);
    $("#GRM_wall_level").text(`${buildings.wall}`);
    $("#GRM_storage_level").text(`${buildings.storage}`);
    $("#GRM_farm_level").text(`${buildings.farm}`);
    $("#GRM_academy_level").text(`${buildings.academy}`);
    $("#GRM_temple_level").text(`${buildings.temple}`);

    $("#GRM_main_input").val(`${buildings.main}`);
    $("#GRM_hide_input").val(`${buildings.hide}`);
    $("#GRM_place_input").val(`${buildings.place}`);
    $("#GRM_lumber_input").val(`${buildings.lumber}`);
    $("#GRM_stoner_input").val(`${buildings.stoner}`);
    $("#GRM_ironer_input").val(`${buildings.ironer}`);
    $("#GRM_market_input").val(`${buildings.market}`);
    $("#GRM_docks_input").val(`${buildings.docks}`);
    $("#GRM_barracks_input").val(`${buildings.barracks}`);
    $("#GRM_wall_input").val(`${buildings.wall}`);
    $("#GRM_storage_input").val(`${buildings.storage}`);
    $("#GRM_farm_input").val(`${buildings.farm}`);
    $("#GRM_academy_input").val(`${buildings.academy}`);
    $("#GRM_temple_input").val(`${buildings.temple}`);

    var specialList = [];

    var counter = 0;
    //Get the special buildings from the building list.
    for (var i in buildings) {
      if (counter !== 14) {
        counter++;
        continue;
      }
      specialList.push([i, buildings[i]]);
    }

    //Remove all possible active special buildings (visually only). Without this it will sometimes show you have a special building built even though you don't.
    $(".GRM_active").each(function () {
      const name = $(this).attr("id").substr(4);
      $(this)
        .removeClass("GRM_active")
        .addClass("GRM_passive")
        .css(
          "background",
          `url('https://gpnl.innogamescdn.com/images/game/main/${name}_passive.png')`
        );
    });

    //Code underneath will show the current active special buildings in the plugin window.
    var special_1 = Utils.getSpecialBuilding(specialList.slice(0, 4));
    var special_2 = Utils.getSpecialBuilding(specialList.slice(4));
    if (special_1 !== null) {
      $(`#GRM_${special_1}`)
        .removeClass("GRM_passive")
        .addClass("GRM_active")
        .css(
          "background",
          `url('https://gpnl.innogamescdn.com/images/game/main/${special_1}.png')`
        );
    }
    if (special_2 !== null) {
      $(`#GRM_${special_2}`)
        .removeClass("GRM_passive")
        .addClass("GRM_active")
        .css(
          "background",
          `url('https://gpnl.innogamescdn.com/images/game/main/${special_2}.png')`
        );
    }

    let god = town.god;
    this.changeIcon(god, $("#GRM_gods"));

    $("#GRM_used_pop").text(`${town.getBuildingCost()}`);
    $("#GRM_total_pop").text(`${town.getTotalPopulation()}`);
   

    this.fillTroops(town.getTotalPopulation() - town.getBuildingCost(), god);
    $("#GRM_population_input").val(`${town.populationBoost}`);
    if (town.plow) {
      $("#GRM_plow")
        .removeClass("GRM_plow_inactive")
        .addClass("GRM_plow_active")
        .prop("src", Utils.plow_active);
    } else {
      $("GRM_plow")
        .removeClass("GRM_plow_active")
        .addClass("GRM_plow_inactive")
        .prop("src", Utils.plow_inactive);
    }
  }

  /**
   * This method will change the current god selected and the mythological creatures that belong to this god.
   * @param {String} god The string of the god you want to change to.
   * @param {HTMLElement} element The element where the image of the god is displayed.
   */
  changeIcon(god) {
    $('.GRM_selected').addClass('GRM_unselected').removeClass('GRM_selected');
    switch (god) {
      case "artemis":
        $("#GRM_select_artemis").addClass("GRM_selected").removeClass('GRM_unselected')
        $("#GRM_myth_1_pos > img").prop("src", Utils.boar_img);
        $("#GRM_myth_2_pos > img").prop("src", Utils.griffin_img);
        $("#GRM_myth_1_want > img").prop("src", Utils.boar_img);
        $("#GRM_myth_2_want > img").prop("src", Utils.griffin_img);
        break;
      case "athena":
        $("#GRM_select_athena").addClass("GRM_selected").removeClass('GRM_unselected')
        $("#GRM_myth_1_pos > img").prop("src", Utils.centaur_img);
        $("#GRM_myth_2_pos > img").prop("src", Utils.pegasus_img);
        $("#GRM_myth_1_want > img").prop("src", Utils.centaur_img);
        $("#GRM_myth_2_want > img").prop("src", Utils.pegasus_img);
        break;
      case "aphrodite":

        $("#GRM_select_aphrodite").addClass("GRM_selected").removeClass('GRM_unselected')
        $("#GRM_myth_1_pos > img").prop("src", Utils.satyr_img);
        $("#GRM_myth_2_pos > img").prop("src", Utils.siren_img);
        $("#GRM_myth_1_want > img").prop("src", Utils.satyr_img);
        $("#GRM_myth_2_want > img").prop("src", Utils.siren_img);
        break;
      case "poseidon":
        $("#GRM_select_poseidon").addClass("GRM_selected").removeClass('GRM_unselected')
        $("#GRM_myth_1_pos > img").prop("src", Utils.cyclops_img);
        $("#GRM_myth_2_pos > img").prop("src", Utils.hydra_img);
        $("#GRM_myth_1_want > img").prop("src", Utils.cyclops_img);
        $("#GRM_myth_2_want > img").prop("src", Utils.hydra_img);
        break;
      case "hades":
        $("#GRM_select_hades").addClass("GRM_selected").removeClass('GRM_unselected')
        $("#GRM_myth_1_pos > img").prop("src", Utils.cerberus_img);
        $("#GRM_myth_2_pos > img").prop("src", Utils.eryn_img);
        $("#GRM_myth_1_want > img").prop("src", Utils.cerberus_img);
        $("#GRM_myth_2_want > img").prop("src", Utils.eryn_img);
        break;
      case "zeus":
        $("#GRM_select_zeus").addClass("GRM_selected").removeClass('GRM_unselected')
        $("#GRM_myth_1_pos > img").prop("src", Utils.minotaur_img);
        $("#GRM_myth_2_pos > img").prop("src", Utils.manticore_img);
        $("#GRM_myth_1_want > img").prop("src", Utils.minotaur_img);
        $("#GRM_myth_2_want > img").prop("src", Utils.manticore_img);
        break;
      case "hera":
        $("#GRM_select_hera").addClass("GRM_selected").removeClass('GRM_unselected')
        $("#GRM_myth_1_pos > img").prop("src", Utils.harpy_img);
        $("#GRM_myth_2_pos > img").prop("src", Utils.medusas_img);
        $("#GRM_myth_1_want > img").prop("src", Utils.harpy_img);
        $("#GRM_myth_2_want > img").prop("src", Utils.medusas_img);
        break;
    }
  }

  /**
   * This method will fill the possible troops in the plugin window.
   * @param {Number} population The total free population (TotalPopulation-BuildingCost)
   * @param {String} god The god of the selected city.
   */
  fillTroops(population, god) {
    const lightship_cost = 10;
    const bireme_cost = 8;
    const trireme_cost = 16;
    const demolitionship_cost = 8;
    const fast_transporter_cost = 21;
    const slow_transporter_cost = 39;
    const myth_1_cost = Utils.getMythCost(1, god);
    const myth_2_cost = Utils.getMythCost(2, god);
    const catapult_cost = 15;
    const colo_cost = 170;
    const envoy_cost = 3;
    const chariot_cost = 4;


    let ls_want = Utils.getWantedTroops("#GRM_ls_want > input");
    let bir_want = Utils.getWantedTroops("#GRM_bir_want > input");
    let trir_want = Utils.getWantedTroops("#GRM_trir_want > input");
    let demo_want = Utils.getWantedTroops("#GRM_demo_want > input");
    let colo_want = Utils.getWantedTroops("#GRM_colo_want > input");
    let cata_want = Utils.getWantedTroops("#GRM_cata_want > input");
    let envoy_want = Utils.getWantedTroops("#GRM_envoy_want > input");
    let chariot_want = Utils.getWantedTroops("#GRM_chariot_want > input");
    let myth_1_want = Utils.getWantedTroops("#GRM_myth_1_want > input");
    let myth_2_want = Utils.getWantedTroops("#GRM_myth_2_want > input");

    var cost = 0;
    cost += ls_want * lightship_cost;
    cost += bir_want * bireme_cost;
    cost += trir_want * trireme_cost;
    cost += demo_want * demolitionship_cost;
    cost += colo_want * colo_cost;
    cost += cata_want * catapult_cost;
    cost += envoy_want * envoy_cost;
    cost += chariot_want * chariot_cost;
    cost += myth_1_want * myth_1_cost;
    cost += myth_2_want * myth_2_cost;

    var pop_after_cost = population - cost;

    let ls_pos = parseInt(pop_after_cost / lightship_cost);
    let bir_pos = parseInt(pop_after_cost / bireme_cost);
    let trir_pos = parseInt(pop_after_cost / trireme_cost);
    let demo_pos = parseInt(pop_after_cost / demolitionship_cost);

    let myth_1_boat = Utils.getMythInBoat(1, god);
    let myth_2_boat = Utils.getMythInBoat(2, god);

    let all_in_boat = cata_want * catapult_cost + envoy_want * envoy_cost + chariot_want * chariot_cost;
    if (myth_1_boat) {
      all_in_boat += myth_1_cost * myth_1_want;
    }
    if (myth_2_boat) {
      all_in_boat += myth_2_cost * myth_2_want;
    }

    let fast_pos = parseInt(
      (all_in_boat + pop_after_cost) / fast_transporter_cost
    );
    let slow_pos = parseInt(
      (all_in_boat + pop_after_cost) / slow_transporter_cost
    );
    let unit_pos = parseInt(pop_after_cost);
    let myth_1_pos = parseInt(pop_after_cost / myth_1_cost);
    let myth_2_pos = parseInt(pop_after_cost / myth_2_cost);

    let ls_extra = parseInt(pop_after_cost % lightship_cost);
    let bir_extra = parseInt(pop_after_cost % bireme_cost);
    let trir_extra = parseInt(pop_after_cost % trireme_cost);
    let demo_extra = parseInt(pop_after_cost % demolitionship_cost);
    let fast_extra = parseInt(all_in_boat % fast_transporter_cost);
    let slow_extra = parseInt(all_in_boat % slow_transporter_cost);
    let unit_extra = 0;
    let myth_1_extra = parseInt(pop_after_cost % myth_1_cost);
    let myth_2_extra = parseInt(pop_after_cost % myth_2_cost);

    $("#GRM_ls_pos > input").val(ls_pos);
    $("#GRM_bir_pos > input").val(bir_pos);
    $("#GRM_trir_pos > input").val(trir_pos);
    $("#GRM_demo_pos > input").val(demo_pos);
    $("#GRM_land_fast_pos_boat").val(fast_pos);
    $("#GRM_land_slow_pos_boat").val(slow_pos);
    $("#GRM_land_fast_pos_troops").val(fast_pos * 16 - all_in_boat);
    $("#GRM_land_slow_pos_troops").val(slow_pos * 32 - all_in_boat);
    $("#GRM_troops_pos > input").val(unit_pos);
    $("#GRM_myth_1_pos > input").val(myth_1_pos);
    $("#GRM_myth_2_pos > input").val(myth_2_pos);

    $("#GRM_ls_pos > span").text(ls_extra);
    $("#GRM_bir_pos > span").text(bir_extra);
    $("#GRM_trir_pos > span").text(trir_extra);
    $("#GRM_demo_pos > span").text(demo_extra);
    $("#GRM_land_fast_pos > span").text(fast_extra);
    $("#GRM_land_slow_pos > span").text(slow_extra);
    $("#GRM_troops_pos > span").val(unit_extra);
    $("#GRM_myth_1_pos > span").text(myth_1_extra);
    $("#GRM_myth_2_pos > span").text(myth_2_extra);
  }
}

class TradeView {
  addTradeView() {
    $("#GRM_window_header").after(`
      <div id="GRM_trade_manager">
        <p>This function is still in development. Please stay tuned!</p>
      </div>`);
  }
}

/**
 * The main model class. This class contains all towns and is the entry point for the plannerpresenter.
 *
 */
class Model {
  constructor() {
    this._selected_id = 0;
    this._towns = [];
  }

  /**
   * Gets town from the game and stores it in memory.
   */
  initTowns() {
    uw.ITowns.towns_collection.getTowns().forEach((town) => {
      let temp = new Town(
        town.attributes.id,
        town.attributes.name,
        town.attributes.god
      );
      const t = uw.ITowns.getTown(town.id);
      temp.buildings = t.getBuildings().getBuildings();
      temp.plow = t.getResearches().attributes.plow;
      temp.populationBoost = t.getPopulationExtra();
      temp.getTotalPopulation();
      temp.getBuildingCost();
      this.towns.push(temp);
    });
  }

  /**
   * Gets a town from the plugin's Town list according to the Grepolis ID.
   * @param {Number} id Grepolis ID of the town
   */
  getTown(id) {
    for (let i = 0; i < this._towns.length; i++) {
      const town = this._towns[i];
      if (town.id === id) {
        return town;
      }
    }
  }

  /**
   * Gets the current selected town
   * @see getTown(id)
   */
  getCurrentTown() {
    return this.getTown(this._selected_id);
  }

  /**
   * Get data grom the updated element and apply it to the stored town.
   * @param {HTMLElement} e Element that is updated.
   */
  update(e) {
    const building_name = $(e).attr("name");
    const building_level = $(e).val();
    this.getCurrentTown().update(building_name, building_level);
  }

  /**
   * Special update method for special buildings.
   * @param {String} special_name The name of the special building that has been updated
   * @param {Number} level The level of the updated special building
   * @see Town.update
   */
  updateSpecial(special_name, level) {
    this.getCurrentTown().update(special_name, level);
  }

  /**
   * Getters and setters
   */
  get towns() {
    return this._towns;
  }

  get selected_id() {
    return this._selected_id;
  }

  set selected_id(id) {
    this._selected_id = id;
  }
}

/**
 * Town class. This class contains all the necessary town information.
 */
class Town {
  /**
   * The constructor of a town. Basic stuff.
   * @param {Number} id The Grepolis ID of the town
   * @param {String} name The name of the town
   * @param {String} god The selected god in the town
   */
  constructor(id, name, god) {
    this._id = id;
    this._name = name;
    this._buildings = {
      main: 1,
      hide: 0,
      place: 1,
      lumber: 0,
      stoner: 0,
      ironer: 0,
      market: 0,
      docks: 0,
      barracks: 0,
      wall: 0,
      storage: 0,
      farm: 1,
      academy: 0,
      temple: 0,
      theater: 0,
      thermal: 0,
      library: 0,
      lighthouse: 0,
      tower: 0,
      statue: 0,
      oracle: 0,
      trade_office: 0,
    };
    this._population_boost = 0;
    this._has_plow = false;
    this._god = god;
  
    //TODO find a way to fix the error so you can open the window even when this doesnt work, rip.
    /*let extra_data = uw.MapTiles.mapData.getTown(id);
    console.log("extra_data :>> ", extra_data);
    this._ix = extra_data.x;
    this._iy = extra_data.y;
    this._ox = extra_data._ox;
    this._oy = extra_data.oy;*/
  }

  /**
   * Calculates the total possible population of the selected town.
   * @returns {Number} The total possible population.
   */
  getTotalPopulation() {
    let farm = Utils.farm_pop[this._buildings.farm - 1];
    let has_termal = this._buildings.thermal === 1;
    let total = has_termal
      ? farm * 1.1 + this._population_boost
      : farm + this._population_boost;
    total = this._has_plow ? total + 200 : total;
    total = this._god === "aphrodite" ? total + (this._buildings.farm)*5 : total
    return parseInt(total);
  }

  /**
   * Calculates the total cost of all buildings that are built in the town.
   * @returns {Number} The total cost of all buildings built.
   */
  getBuildingCost() {
    var totalCost = 0;
    for (const key in this.buildings) {
      if (this.buildings.hasOwnProperty(key)) {
        const value = this.buildings[key];
        totalCost += Utils.getCostFromBuilding(key, value);
      }
    }
    return parseInt(totalCost);
  }

  /**
   * Updates the building object stored in this class.
   * @param {String} building_name The name of the building that is getting updated
   * @param {Number} building_level The (new) level of the building that is getting updated
   */
  update(building_name, building_level) {
    const name = building_name.endsWith("_level")
      ? building_name.slice(0, building_name.length - 6)
      : building_name;
    for (const key in this.buildings) {
      if (this.buildings.hasOwnProperty(key) && key === name) {
        this.buildings[key] = building_level;
      }
    }
  }

  distanceFromTown(other) {
    let a = this.x - other.x;
    let b = this.y - other.y;
    let dist_squared = a * a + b * b;
    return Math.sqrt(dist_squared);
  }

  onSameIsland(other) {
    return this.ix == other.ix && this.iy == other.iy;
  }

  isFarFrom(other) {
    let a = this.ix - other.ix;
    let b = this.iy - other.iy;
    dist = Math.sqrt(Math.pow(a, 2) - Math.pow(b, 2));
  }

  /**Getters and setters */
  get id() {
    return this._id;
  }

  get buildings() {
    return this._buildings;
  }

  set buildings(b) {
    this._buildings = b;
  }

  get plow() {
    return this._has_plow;
  }

  /**
   * @param {Boolean} bool
   */
  set plow(bool) {
    this._has_plow = bool;
  }

  get populationBoost() {
    return this._population_boost;
  }

  /**
   * @param {Number} boost
   */
  set populationBoost(boost) {
    this._population_boost = boost;
  }

  get god() {
    return this._god;
  }

  /**
   * @param {String} god
   */
  set god(god) {
    this._god = god;
  }

  /*
  TODO get these out too
  get ix() {
    return this._ix;
  }
  get iy() {
    return this._iy;
  }
  get ox() {
    return this._ox;
  }
  get oy() {
    return this._oy;
  }
  get x() {
    return this.ix * 128 + this.ox;
  }
  get y() {
    return this.iy * 128 + this.oy;
  }*/

  getName() {
    return this._name;
  }
}

/**
 * The plannerpresenter class. This is the communication between the Model and the PlannerView.
 */
class PlannerPresenter {
  /**
   *
   * @param {Model} Model The Model. Duh.
   * @param {PlannerView} plannerview The plannerview. Duh.
   */
  constructor(model, plannerview) {
    this._model = model;
    this._view = plannerview;
    this.addEventHandlers();
  }

  /**
   * Adds all the eventhandlers to the HTML objects.
   * @var {PlannerPresenter} temp is a temp variable to get access to the model and plannerview inside the anomynous functions.
   */
  addEventHandlers() {
    var temp = this;
    //This button is to open the window. It first initializes all the towns, if this has been done, then it opens.

    //Helper function to switch between towns.
    function switchTown() {
      if ($("#GRM_window").css("display") !== "block") return;
      setTimeout(() => {
        temp._model.selected_id = ITowns.getCurrentTown().id;
        temp._view.fillGRMWindow(temp._model.getCurrentTown());
      }, 100);
    }

    //Switch town with button right
    $("#ui_box > div.town_name_area > div.btn_next_town.button_arrow.right").on(
      "click",
      switchTown
    );
    //Switch town with button left
    $("#ui_box > div.town_name_area > div.btn_prev_town.button_arrow.left").on(
      "click",
      switchTown
    );

    $("#GRM_help_button").hover(
      function () {
        $("#GRM_help_window").css("display", "block");
      },
      function () {
        $("#GRM_help_window").css("display", "none");
      }
    );

    //Data validation for each building field & also calls to update the model and plannerview on each input in the input fields.
    $(".GRM_building_input").each(function () {
      $(this).on("input", function () {
        var input = $(this);
        var value = input.val();
        var attr_name = input.attr("name");
        var name = attr_name.substring(0, attr_name.length - 6);
        var max = Utils.getMaxLevel(name);
        let int = parseInt(value);
        if (isNaN(parseInt(int)) || int < 0 || int > max) {
          input.removeClass("valid").addClass("invalid");
        } else {
          input.removeClass("invalid").addClass("valid");
        }
        temp._model.update(this);
        temp._view.fillGRMWindow(temp._model.getCurrentTown());
      });
    });

    //This event handler is for the special buildings. It allows for toggleable images for each special building in their respectable group.
    //It also calls for updates to the model and the plannerview.
    $(".GRM_special_child").each(function () {
      $(this).on("click", function () {
        const el = $(this).first();
        const name = el.attr("id").substr(4);
        const parent = el.parent();
        if (el.hasClass("GRM_active")) {
          el.removeClass("GRM_active").addClass("GRM_passive");
          el.css(
            "background",
            `url('https://gpnl.innogamescdn.com/images/game/main/${name}_passive.png')`
          );
          temp._model.updateSpecial(name, 0);
          temp._view.fillGRMWindow(temp._model.getCurrentTown());
        } else if (el.hasClass("GRM_passive")) {
          const active_el = parent.children(".GRM_active").first();
          if (active_el.length !== 0) {
            const active_name = active_el.attr("id").substr(4);
            active_el.removeClass("GRM_active").addClass("GRM_passive");
            active_el.css(
              "background",
              `url('https://gpnl.innogamescdn.com/images/game/main/${active_name}_passive.png')`
            );
            temp._model.updateSpecial(active_name, 0);
            temp._view.fillGRMWindow(temp._model.getCurrentTown());
          }
          el.removeClass("GRM_passive").addClass("GRM_active");
          el.css(
            "background",
            `url('https://gpnl.innogamescdn.com/images/game/main/${name}.png')`
          );
          temp._model.updateSpecial(name, 1);
          temp._view.fillGRMWindow(temp._model.getCurrentTown());
        }
      });
    });

    //My own magic. Creates an easy way to change gods in a kind of neat display.
    //Oh yeah. Ofcourse it calls to update the model and the plannerview.
    $("#GRM_gods > tbody > tr > td > img")
      .click(function (e) {
        const el = $(this).first();
        const god = el.attr('id').substring(11,)
        let active = el.hasClass("GRM_selected");
        if (active){
          return;
        }
        temp._model.getCurrentTown().god = god;
        temp._view.changeIcon(god)
        temp._view.fillGRMWindow(temp._model.getCurrentTown());
      })

    //Same as buildings, just with the troops. Except no validation (yet)
    $(".GRM_troop_input").each(function () {
      $(this).on("input", function () {
        temp._view.fillTroops(
          temp._model.getCurrentTown().getTotalPopulation() -
            temp._model.getCurrentTown().getBuildingCost(),
          temp._model.getCurrentTown().god
        );
      });
    });

    //The population boost inputbox handler
    $("#GRM_population_input").on("input", function () {
      temp._model.getCurrentTown().populationBoost = parseInt($(this).val());
      temp._view.fillGRMWindow(temp._model.getCurrentTown());
    });

    //The plow image handler
    $("#GRM_plow").on("click", function () {
      var active = $(this).hasClass("GRM_plow_active");
      if (active) {
        $(this)
          .removeClass("GRM_plow_active")
          .addClass("GRM_plow_inactive")
          .prop("src", Utils.plow_inactive);
        temp._model.getCurrentTown().plow = false;
        temp._view.fillGRMWindow(temp._model.getCurrentTown());
      } else {
        $(this)
          .removeClass("GRM_plow_inactive")
          .addClass("GRM_plow_active")
          .prop("src", Utils.plow_active);
        temp._model.getCurrentTown().plow = true;
        temp._view.fillGRMWindow(temp._model.getCurrentTown());
      }
    });
  }

  //Opens the windows and calls to fill it.
}

class TradePresenter {}

/**
 * Startup function. The entry function. You see what it does. No need to explain it.
 */
startup();

function startup() {
  "use strict";
  
  let mainView = new MainView();
  let model = new Model();
  new MainPresenter(mainView, model);
}

//NO UI FUNCTION

function turnUiOff() {
  $(".nui_toolbar").css("display", "none");
  $(".nui_left_box").css("display", "none");
  $(".nui_main_menu").css("display", "none");
  $(".nui_grepo_score").css("display", "none");
  $(".topleft_navigation_area").css("display", "none");
  $(".questlog_icon").css("display", "none");
  $(".toolbar_buttons").css("display", "none");
  $(".ui_quickbar").css("display", "none");
  $(".toolbar_activities").css("display", "none");
  $(".town_name_area").css("display", "none");
  $(".ui_resources_bar").css("display", "none");
  $(".premium_area").css("display", "none");
  $(".gods_area").css("display", "none");
  $(".gods_spells_menu").css("display", "none");
  $(".nui_right_box").css("display", "none");
  $(".nui_units_box").css("display", "none");
  $(".leaves").css("display", "none");
  $(".special_offer").css("display", "none");
  $(".notification_area").css("display", "none");
  $(".timer_box").css("display", "none");
  $(".notification").css("display", "none");
  $("#minimized_windows_area").css("display", "none");
  $("#dio_BTN_HK").css("display", "none");
}

function turnUiOnn() {
  $(".nui_toolbar").css("display", "block");
  $(".nui_left_box").css("display", "block");
  $(".nui_main_menu").css("display", "block");
  $(".nui_grepo_score").css("display", "block");
  $(".topleft_navigation_area").css("display", "block");
  $(".questlog_icon").css("display", "block");
  $(".toolbar_buttons").css("display", "block");
  $(".ui_quickbar").css("display", "block");
  $(".toolbar_activities").css("display", "block");
  $(".town_name_area").css("display", "block");
  $(".ui_resources_bar").css("display", "block");
  $(".premium_area").css("display", "block");
  $(".gods_area").css("display", "block");
  $(".gods_spells_menu").css("display", "block");
  $(".nui_right_box").css("display", "block");
  $(".nui_units_box").css("display", "block");
  $(".leaves").css("display", "block");
  $(".special_offer").css("display", "block");
  $(".notification_area").css("display", "block");
  $(".timer_box").css("display", "block");
  $(".notification").css("display", "block");
  $("#minimized_windows_area").css("display", "block");
  $("#dio_BTN_HK").css("display", "block");
}
