// ==UserScript==
// @name         Warbase Filters (compatibility version)
// @namespace    somenamespace
// @version      0.5.1
// @description  Filter things out of the war base
// @author       tos
// @include        *.torn.com/factions.php?step=your*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/32365/Warbase%20Filters%20%28compatibility%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/32365/Warbase%20Filters%20%28compatibility%20version%29.meta.js
// ==/UserScript==

'use strict';

(function () {

var animation_enabled = true;
var animation_duration = 5; //minutes

var extended_desc_hide = true;

var difficulty_colors = {
  0: '#e0f2f2', //blue
  1: '#e0f2e9',
  2: '#e0f2e0', //green
  3: '#e6f2e0',
  4: '#ebf2e0',
  5: '#f2f2e0', //yellow
  6: '#f2ebe0',
  7: '#f2e6e0',
  8: '#f2e0e0', //red
  9: '#f2d0d0',
  10: '#f2c0c0',
  11: 'rgb(255,0,0)'
};

GM_addStyle('\n  .wb_extended.f-war-list .descriptions {\n    display: none;\n  }\n\n  .wb_extended.f-war-list .act {\n    padding-bottom: 0 !important;\n    border-radius: 5px !important;\n  }\n  \n  #wb_filter_wrap .arrow-wrap {display: block;}\n  #wb_filter_wrap i {margin: 8px 12px 0px 0px;}\n  #wb_filter_wrap .active i {margin: 11px 12px 0px 0px;}\n  \n  #warbase_filters {\n    display: flex;}\n  \n  #warbase_filters .wb_content_left {\n    display: inline-flex;\n    flex-direction: column;\n    padding: 5px;\n    width: 40%;\n    vertical-align: top;}\n    \n  #warbase_filters .wb_content_middle {\n    display: inline-flex;\n    flex-direction: column;\n    justify-content: center;\n    padding: 5px;\n    width: 30%;}\n    \n  #warbase_filters .wb_content_right {\n    display: inline-flex;\n    flex-direction: column;\n    padding: 5px;\n    width: 30%;}\n  #warbase_filters .wb_content_right span{\n    justify-content: flex-end;}\n  #warbase_filters .wb_content_right input{\n    margin-right: 0px !important;\n    margin-left: 3px;}\n  \n  #warbase_filters .wbTotals_col_left{\n    display: inline-flex;\n    flex-direction: column;\n    font-size: 110%;\n    font-weight: bold;\n    width: auto;}\n  #warbase_filters .wbTotals_col_right{\n    display: inline-flex;\n    flex-direction: column;\n    font-size: 110%;\n    text-align: right;\n    font-weight: normal;\n    width: auto;}\n  \n  #warbase_filters .wbTotals_title{\n    padding: 1px 0px 1px 10px;}\n  \n  #warbase_filters .wbTotals {\n    padding: 1px 0px;}\n  \n  #warbase_filters .filter-title {\n    display: inline-flex;\n    background-color: #BABABA;\n    border-radius: 5px 0px 0px 5px;\n    align-items: center;\n    font-size: 150%;\n    padding: 5px;}\n  \n  #warbase_filters .filter-content {\n    display: inline-flex;\n    flex-direction: column;\n    background-color: #DBDBDB;\n    border-radius: 0px 5px 5px 0px;\n    padding: 3px 0px;}\n  \n  #warbase_filters .filter-row {\n    display: flex;\n    flex-wrap: wrap;}\n  \n  #warbase_filters span{\n    display: flex;\n    flex-wrap: wrap;\n    min-height: 3px;\n    padding: 1px 10px;}\n  \n  #warbase_filters input[type="checkbox"] {\n    margin-right: 3px;}\n  \n  #warbase_filters input[type="number"] {\n    background: transparent;\n    border-bottom: 1px solid black;\n    text-align: center;\n    width: 50px;}\n  \n  .f-chain {border-radius: 14px}\n  \n  @keyframes linkFade {\n    0% {color: #969;}\n    95% {color: #769;}\n    100% {color: #069;}}\n  \n  .animation_colorfade {\n    animation-name: linkFade;\n    animation-duration: ' + animation_duration * 60 + 's;}\n  \n  @keyframes chainIconFade {\n    from {background-color: #b2b2b2;}\n    to {background-color: #f2f2f2;}}\n  \n  .animation_colorblind {\n    animation-name: chainIconFade;\n    animation-duration: ' + animation_duration * 60 + 's;}\n  \n  #warbase_results {\n    display: none;}\n  \n  #warbase_results .wbResults_placeholder {\n    font-weight: bold;\n    padding: 10px;}\n  \n  #wars_extended {\n    margin-bottom:10px;}\n  \n  #wars_extended .descriptions-new {\n    display: block;\n    margin: 0;\n    float: left;\n    background-color: transparent;\n    border-radius: 0;\n    box-shadow: none;\n    height: auto;\n    width: 100%;}\n  \n  .wb_difficulty_DIV {\n    float: right;\n    vertical-align: middle;\n  }\n  \n  .wb_difficulty_INPUT {\n    background: white;\n    border-radius: 3px;\n    box-shadow: 0px 0px 2px #f2f2f2;\n    text-align: center;\n    float: right;\n    height: 100%;\n    width: 70%;\n    margin: 12% 5%;\n    padding: 3px 0px;\n  }\n  \n  .wb_hide {\n    overflow: hidden;\n    height: 0;}\n');

var default_options = {
  fed: false,
  traveling: false,
  online: true,
  idle: true,
  offline: true,
  hosp: true,
  hosp_time: 0,
  level: false,
  level_min: 0,
  level_max: 100,
  extended: false,
  territories_inverted: false,
  colorblind: false,
  filters_collapse: false
};

var filters = Object.assign(default_options, JSON.parse(localStorage.getItem('torn_wb_filters'))); //torn_warbase_filters
var storeFilters = function storeFilters() {
  return localStorage.setItem('torn_wb_filters', JSON.stringify(filters));
};

var enemy_difficulty = JSON.parse(localStorage.getItem('torn_enemy_difficulty')) || {}; //torn_enemy_difficulties
var difficulty_max = Object.keys(difficulty_colors).length - 1;

var faction_nodes = {};
var faction_totals = {};

var _to_array = function _to_array(list) {
  return Array.prototype.slice.call(list);
}; //_to_array().forEach()

var count_enemies = function count_enemies(obj) {
  var enemy_totals = { total: 0, ok: 0, hidden: 0 };
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = Object.keys(obj)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var factionID = _step.value;

      enemy_totals.total += faction_totals[factionID].total;
      enemy_totals.ok += faction_totals[factionID].ok;
      enemy_totals.hidden += faction_totals[factionID].hidden;
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return enemy_totals;
};

var run_filters = function run_filters(node) {
  var factionID = node.querySelector('.t-blue').href.split('&')[1].replace('=', '');
  var target_TOTALS = { total: 0, ok: 0, hidden: 0 };
  faction_totals[factionID] = {};
  _to_array(node.querySelector('.member-list').children).forEach(function (enemy_LI) {
    target_TOTALS.total += 1;
    var status = enemy_LI.querySelector('.status').firstElementChild.textContent;
    var online_status_icon = enemy_LI.querySelector('#icon1') || enemy_LI.querySelector('#icon2') || enemy_LI.querySelector('#icon62');
    var online_status = online_status_icon.title.replace('<b>', '').replace('</b>', '');
    //const bountied = enemy_LI.querySelector('#icon13') || false
    //if(bountied) enemy_LI.style.backgroundColor ='#F0D9D2';
    var hosp_time = 0;
    if (enemy_LI.querySelector('#icon15')) {
      var time_string = enemy_LI.querySelector('#icon15').title.split('\'>')[1].split('</')[0];
      hosp_time = parseInt(time_string.split(':')[0]) * 3600 + parseInt(time_string.split(':')[1]) * 60 + parseInt(time_string.split(':')[2]);
    }
    var jail_time = 0;
    if (enemy_LI.querySelector('#icon16')) {
      var _time_string = enemy_LI.querySelector('#icon16').title.split('\'>')[1].split('</')[0];
      jail_time = parseInt(_time_string.split(':')[0]) * 3600 + parseInt(_time_string.split(':')[1]) * 60 + parseInt(_time_string.split(':')[2]);
    }

    var level = parseInt(enemy_LI.querySelector('.lvl .t-hide').nextSibling.textContent);
    var userID = enemy_LI.querySelector('.name').href.split('XID=')[1];
    var li_icon_wrap = enemy_LI.querySelector('.member-icons');

    if (!enemy_LI.querySelector('.wb_difficulty_DIV')) {
      var difficulty_DIV = document.createElement('DIV');
      difficulty_DIV.className = 'wb_difficulty_DIV';
      difficulty_DIV.innerHTML = '<input class="wb_difficulty_INPUT" type="number" min=0 max=' + difficulty_max + ' data-userID="' + userID + '"></input>';
      li_icon_wrap.append(difficulty_DIV);
      var difficulty_INPUT = enemy_LI.querySelector('.wb_difficulty_INPUT');
      difficulty_INPUT.addEventListener('change', function (event) {
        if (difficulty_INPUT.value < 0) difficulty_INPUT.value = 0;
        if (difficulty_INPUT.value > difficulty_max) difficulty_INPUT.value = difficulty_max;
        var difficulty = difficulty_INPUT.value;
        if (difficulty === '') {
          if (enemy_difficulty['ID_' + userID]) delete enemy_difficulty['ID_' + userID];
          _to_array(document.querySelectorAll('.wb_difficulty_INPUT[data-userID="' + userID + '"')).forEach(function (this_user) {
            this_user.parentElement.parentElement.parentElement.style.backgroundColor = 'initial';
            this_user.value = difficulty;
          });
        } else {
          enemy_difficulty['ID_' + userID] = difficulty;
          _to_array(document.querySelectorAll('.wb_difficulty_INPUT[data-userID="' + userID + '"')).forEach(function (this_user) {
            this_user.parentElement.parentElement.parentElement.style.backgroundColor = difficulty_colors[enemy_difficulty['ID_' + userID]];
            this_user.value = difficulty;
          });
        }
        localStorage.setItem('torn_enemy_difficulty', JSON.stringify(enemy_difficulty));
      });
    }
    if (enemy_difficulty['ID_' + userID]) {
      enemy_LI.querySelector('.wb_difficulty_INPUT').value = enemy_difficulty['ID_' + userID];
      enemy_LI.style.backgroundColor = difficulty_colors[enemy_difficulty['ID_' + userID]];
    }

    if (status === 'Okay') target_TOTALS.ok += 1;
    var hide = !filters.fed && status === 'Federal' || !filters.traveling && status === 'Traveling' || !filters.online && online_status === 'Online' || !filters.idle && online_status === 'Idle' || !filters.offline && online_status === 'Offline' || filters.hosp && (filters.hosp_time * 60 < hosp_time || filters.hosp_time * 60 < jail_time) || filters.level && (filters.level_min > level || filters.level_max < level);

    enemy_LI.style.display = hide ? 'none' : 'list-item';

    if (enemy_LI.style.display === 'none') target_TOTALS.hidden += 1;
  });

  faction_totals[factionID].total = target_TOTALS.total;
  faction_totals[factionID].ok = target_TOTALS.ok;
  faction_totals[factionID].hidden = target_TOTALS.total - target_TOTALS.hidden;

  var warbase_totals = count_enemies(faction_totals);
  console.log(warbase_totals);
  _to_array(document.querySelectorAll('.wbTotals')).forEach(function (totals_span) {
    var totals_controls = totals_span.className.split('wb_')[1];
    if (totals_controls === 'counted') totals_span.textContent = Object.keys(faction_totals).length + ' / ' + totals_span.textContent.split('/')[1];else totals_span.textContent = warbase_totals[totals_controls] + ' / ' + warbase_totals.total;
  });
};

var observer = new MutationObserver(function (mutations) {
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = mutations[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var mutation = _step2.value;
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = mutation.addedNodes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var node = _step3.value;

          if (node.className && node.className === 'faction-respect-wars-wp' && !document.querySelector('#wb_filter_wrap')) {
            (function () {
              faction_nodes = {};
              faction_totals = {};
              var faction_main_wrap = document.querySelector('#faction-main');
              var respect_wars_wrap = document.querySelector('#faction-main .faction-respect-wars-wp');
              var wars_UL = respect_wars_wrap.querySelector('.f-war-list');
              var territory_wrap = document.querySelector('#faction-wars-wp');
              var fac_count_total = 0;
              _to_array(respect_wars_wrap.querySelector('.f-war-list').children).forEach(function (faction_tab) {
                if (faction_tab.className !== 'inactive' && faction_tab.className !== 'clear') fac_count_total += 1;
              });
              //Filter DIV-------------------------------------------------------------------------------------------------------------------------------------
              var filter_DIV = document.createElement('DIV');
              filter_DIV.id = 'wb_filter_wrap';
              filter_DIV.innerHTML = '<div class="title-black m-top10 ' + (filters.filters_collapse ? 'border-round' : 'top-round active') + '">\n            <div class="arrow-wrap">\n              <i class="accordion-header-arrow right"></i>\n            </div>\n            War Base Filters\n          </div>\n          <div class="cont-gray map-wrap bottom-round " id="warbase_filters">\n            <div class="wb_content_left">\n              <div class="filter-row">\n                <div class="filter-title">Show</div>\n                <div class="filter-content">\n                  <div class="filter-row">\n                    <span><input type="checkbox" class="wbFilter wb_fed">Federal</span>\n                    <span><input type="checkbox" class="wbFilter wb_traveling">Traveling</span>\n                  </div>\n                  <div class="filter-row">\n                    <span><input type="checkbox" class="wbFilter wb_online">Online</span>\n                    <span><input type="checkbox" class="wbFilter wb_idle">Idle</span>\n                    <span><input type="checkbox" class="wbFilter wb_offline">Offline</span>\n                  </div>\n                  <span></span>\n                  <span class="filter-row"><input type="checkbox" class="wbFilter wb_hosp">Hosp/Jail time &lt;&nbsp;<input type="number" class="wbFilter wb_hosp_time" min="0"> minutes</span>\n                  <span class="filter-row"><input type="checkbox" class="wbFilter wb_level">Level<input type="number" min="0" max="100" class="wbFilter wb_level_min">to<input type="number" min="0" max="100" class="wbFilter wb_level_max"></span>\n                </div>\n              </div>\n            </div>\n            <div class="wb_content_middle">\n              <div class="filter_row">\n                <div class="wbTotals_col_left">\n                  <span class="filter-row wbTotals_title">Factions Loaded:&nbsp;</span>\n                  <span class="filter-row wbTotals_title">Enemies Filtered:&nbsp;</span>\n                  <span class="filter-row wbTotals_title">Enemies Okay:&nbsp;</span>\n                </div>\n                <div class="wbTotals_col_right">\n                  <span class="filter-row wbTotals wb_counted">0 / ' + fac_count_total + '</span>\n                  <span class="filter-row wbTotals wb_hidden">...</span>\n                  <span class="filter-row wbTotals wb_ok">...</span>\n                </div>\n              </div>\n            </div>\n            <div class="wb_content_right">\n              <span class="filter-row">Extended Warbase<input type="checkbox" class="wbFilter wb_extended"></span>\n              <span class="filter-row">Territories on Top<input type="checkbox" class="wbFilter wb_territories_inverted"></span>\n              <span class="filter-row">Color Blind Mode<input type="checkbox" class="wbFilter wb_colorblind"></span>\n            </div>\n          </div>';
              faction_main_wrap.insertBefore(filter_DIV, respect_wars_wrap);

              //Show/Hide button for respect wars------------------------------------------------------------------------------------------------------------------
              var banner = respect_wars_wrap.querySelector('.f-msg');
              wars_UL.style.display = 'block';
              banner.onclick = function () {
                return wars_UL.classList.toggle('wb_hide');
              };

              //War Base Extended DIV------------------------------------------------------------------------------------------------------------------------------
              var warlist_DIV = document.createElement('DIV');
              warlist_DIV.id = 'warbase_results';
              warlist_DIV.innerHTML = '<div class="title-black m-top10 top-round">War Base Extended</div>\n          <div class="cont-gray map-wrap bottom-round">\n            <div class="wbResults_placeholder">Updates on faction tab clicks...</div>\n            <ul id="wars_extended" class="f-war-list war-old">\n              <li class="clear"></li>\n            </ul>\n          </div>';
              faction_main_wrap.insertBefore(warlist_DIV, territory_wrap);

              //Event Listeners for Filter DIV----------------------------------------------------------------------------------------------------------------------
              var wb_filter_title = document.querySelector('#wb_filter_wrap .title-black');
              var wb_filter_content = document.querySelector('#warbase_filters');
              filters.filters_collapse ? wb_filter_content.style.display = 'none' : wb_filter_content.style.display = 'flex';
              wb_filter_title.addEventListener('click', function (event) {
                if (filters.filters_collapse) {
                  wb_filter_title.classList.add('top-round');
                  wb_filter_title.classList.add('active');
                  wb_filter_title.classList.remove('border-round');
                  wb_filter_content.style.display = 'flex';
                  filters.filters_collapse = false;
                } else {
                  wb_filter_title.classList.remove('top-round');
                  wb_filter_title.classList.remove('active');
                  wb_filter_title.classList.add('border-round');
                  wb_filter_content.style.display = 'none';
                  filters.filters_collapse = true;
                }
                storeFilters();
              });

              var filter_inputs = document.querySelectorAll('.wbFilter');
              _to_array(filter_inputs).forEach(function (wbFilter) {
                var filter_controls = wbFilter.className.split('wb_')[1];
                switch (wbFilter.type) {
                  case 'checkbox':
                    wbFilter.checked = filters[filter_controls];
                    wbFilter.addEventListener('change', function (event) {
                      filters[filter_controls] = event.target.checked;
                      storeFilters();
                      switch (filter_controls) {
                        case 'extended':
                          if (event.target.checked) {
                            document.querySelector('#warbase_results').style.display = 'block';
                            wars_UL.classList.add('wb_extended');
                          } else {
                            document.querySelector('#warbase_results').style.display = 'none';
                            wars_UL.classList.remove('wb_extended');
                          }
                          break;
                        case 'territories_inverted':
                          if (event.target.checked) faction_main_wrap.insertBefore(territory_wrap, respect_wars_wrap);else {
                            faction_main_wrap.insertBefore(respect_wars_wrap, territory_wrap);
                            faction_main_wrap.insertBefore(document.querySelector('#warbase_results'), territory_wrap);
                          }
                          break;
                        case 'colorblind':
                          break;
                        default:
                          if (document.querySelector('#faction-main .faction-respect-wars-wp .descriptions')) {
                            run_filters(document.querySelector('#faction-main .faction-respect-wars-wp .descriptions'));
                          }
                          if (Object.keys(faction_nodes).length > 0) {
                            var _iteratorNormalCompletion4 = true;
                            var _didIteratorError4 = false;
                            var _iteratorError4 = undefined;

                            try {
                              for (var _iterator4 = Object.keys(faction_nodes)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var facID = _step4.value;

                                run_filters(faction_nodes[facID]);
                              }
                            } catch (err) {
                              _didIteratorError4 = true;
                              _iteratorError4 = err;
                            } finally {
                              try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                  _iterator4.return();
                                }
                              } finally {
                                if (_didIteratorError4) {
                                  throw _iteratorError4;
                                }
                              }
                            }
                          }
                          break;
                      }
                    });
                    break;
                  case 'number':
                    wbFilter.value = filters[filter_controls];
                    wbFilter.addEventListener('change', function (event) {
                      filters[filter_controls] = event.target.value;
                      storeFilters();
                      switch (filter_controls) {
                        default:
                          if (document.querySelector('#faction-main .faction-respect-wars-wp .descriptions')) {
                            run_filters(document.querySelector('#faction-main .faction-respect-wars-wp .descriptions'));
                          }
                          if (Object.keys(faction_nodes).length > 0) {
                            var _iteratorNormalCompletion5 = true;
                            var _didIteratorError5 = false;
                            var _iteratorError5 = undefined;

                            try {
                              for (var _iterator5 = Object.keys(faction_nodes)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                var facID = _step5.value;

                                run_filters(faction_nodes[facID]);
                              }
                            } catch (err) {
                              _didIteratorError5 = true;
                              _iteratorError5 = err;
                            } finally {
                              try {
                                if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                  _iterator5.return();
                                }
                              } finally {
                                if (_didIteratorError5) {
                                  throw _iteratorError5;
                                }
                              }
                            }
                          }
                          break;
                      }
                    });
                    break;
                  default:
                    break;
                }
              });
              //Set Extended and Territories inverted--------------------------------------------------------------------------------------------------------------------
              if (filters.extended) {
                warlist_DIV.style.display = 'block';
                wars_UL.classList.add('wb_extended');
              }
              if (filters.territories_inverted) faction_main_wrap.insertBefore(territory_wrap, respect_wars_wrap);
            })();
          }
          //Observing for tabs opening--------------------------------------------------------------------------------------------------------------------------------
          if (node.className && node.className === 'descriptions') {
            if (node.querySelector('.member-list')) {
              var factionID = node.querySelector('.t-blue').href.split('&')[1].replace('=', '');

              if (animation_enabled) {
                var faction_link = node.parentElement.querySelector('.act .name .t-blue');
                if (faction_link.className.includes('animation_colorfade')) {
                  faction_link.classList.remove('animation_colorfade');
                  void faction_link.offsetWidth;
                }
                faction_link.classList.add('animation_colorfade');
                faction_link.addEventListener("animationend", function (anim) {
                  return anim.target.classList.remove('animation_colorfade');
                });
                if (filters['colorblind']) {
                  var chain_icon = node.parentElement.querySelector('.act .f-chain');
                  if (chain_icon.className.includes('animation_colorblind')) {
                    chain_icon.classList.remove('animation_colorblind');
                    void chain_icon.offsetWidth;
                  }
                  chain_icon.classList.add('animation_colorblind');
                  chain_icon.addEventListener("animationend", function (anim) {
                    return anim.target.classList.remove('animation_colorblind');
                  });
                }
              }

              //clone node for extended war base
              var wars_extended = document.querySelector('#wars_extended');
              faction_nodes[factionID] = node.cloneNode(true);
              faction_nodes[factionID].id = factionID;
              faction_nodes[factionID].className = 'descriptions-new';
              run_filters(faction_nodes[factionID]);
              if (!document.querySelector('#' + factionID)) {
                wars_extended.parentElement.querySelector('.wbResults_placeholder').style.display = 'none';
                wars_extended.insertBefore(faction_nodes[factionID], wars_extended.lastElementChild);
              } else {
                wars_extended.replaceChild(faction_nodes[factionID], document.querySelector('#' + factionID));
              }
              run_filters(node);
            }
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
});

var wrapper = document.querySelector('#faction-main');
observer.observe(wrapper, { subtree: true, childList: true });
  
})()