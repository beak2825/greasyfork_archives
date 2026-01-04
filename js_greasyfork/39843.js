// ==UserScript==
// @name         Spacom.Addons.Fleets.Sort
// @version      0.1.4
// @namespace    http://dimio.org/
// @description  Add a sorting and filters for fleets tabs
// @author       dimio (dimio@dimio.org)
// @license      MIT
// @homepage     https://github.com/dimio/userscripts-spacom.ru-addons
// @supportURL   https://github.com/dimio/userscripts-spacom.ru-addons/issues
// @supportURL   https://spacom.ru/forum/discussion/47/polzovatelskie-skripty
// @encoding     utf-8
// @match        http*://spacom.ru/?act=game/map*
// @include      http*://spacom.ru/?act=game/map*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/39843/SpacomAddonsFleetsSort.user.js
// @updateURL https://update.greasyfork.org/scripts/39843/SpacomAddonsFleetsSort.meta.js
// ==/UserScript==
console.log(GM_info.script.name, 'booted v.', GM_info.script.version);
const homePage = GM_info.scriptMetaStr.split('\n')[6].split(' ')[6];

const ERR_MSG = {
  NO_LIB: `Для работы ${GM_info.script.name} необходимо установить и включить последние версии следующих дополнений:
<ul>
<li>Spacom.Addons</li>
<li>Spacom.Addons.Fleets.Common</li>
</ul>
<a href="${homePage}">${homePage}</a>`,
  NO_FILTER_PARAMS: `Не найдены параметры для фильтрации.
Для сброса фильтров закройте и откройте заново текущую вкладку флотов.`,
  NO_FILTER_SELECTED: `Условия фильтрации не указаны.`,
};

(function (window) {
  'use strict';

  window.unsafeWindow = window.unsafeWindow || window;
  const w = unsafeWindow;
  const Addons = w.Addons;

  if (w.self !== w.top) {
    return;
  }
  if (!Addons) {
    // if (!Addons || !Addons.Fleets.Common) {
    w.showSmallMessage(ERR_MSG.NO_LIB);
    return;
  }

  function Filter(by, isExclude = false) {
    this.by = by;
    this.isExclude = isExclude;
  }

  Addons.Fleets.Sort = {
    /**
     * contains current fleets by fleet tab
     * note: use Proxy or Object.observe for watch to map.fleets changes
     * and cache filtered fleets for each tab?
     */
    fleets: [],

    filters: {},
    sort: {},
    garrisonIco: (Addons.Fleets.Common) ? Addons.Fleets.Common.garrisonIco : "5.png",

    toggleSubMenu(owner, fleetType, redraw) {
      const subMenu = `fleets_${owner}_${fleetType}`;
      // Current Fleets tab was closed, purge filters & drop filtered fleets for current tab
      if (w.sub_menu === subMenu && !redraw) {
        this.clearFilters(subMenu);
        return false;
      }
      return subMenu;
    },
    createDefaultFilters(owner, fleetType) {
      if (!Addons.Common.isVariableDefined(this.filters[w.sub_menu])) {
        this.filters[w.sub_menu] = [
          new Filter({'type': [fleetType], 'owner': [owner]}),
          new Filter({'weight': ["0"]}, true)
        ];
      }
      if (!Addons.Common.isVariableDefined(this.sort[w.sub_menu])) {
        this.sort[w.sub_menu] = {};
      }
    },
    clearFilters(subMenu) {
      delete this.filters[subMenu];
      delete this.sort[subMenu];
    },
    showFleets(opt) {
      const owner = opt.owner;
      const fleetType = opt.fleetType || 'fleet';
      const sortBy = opt.sortBy || 'weight';
      let redraw = opt.redraw || false; //true for sort & filter buttons

      w.map.clearInfo();

      if ((w.sub_menu = this.toggleSubMenu(owner, fleetType, redraw)) === false) {
        return false;
      }

      this.createDefaultFilters(owner, fleetType);
      this.fleets = w.map.fleets.slice();
      this.fleets.forEach(fleet => {
        fleet['type'] = this.getFleetType(fleet);
        // hack for sorting by ship type (== ship icon) for garrisons
        fleet.ico = this.setDummyGarrisonIco(fleet);
      });

      // apply filters for current fleets tab
      this.filters[w.sub_menu].forEach(filter => {
        this.fleets = this.filterBy(this.fleets, filter);
      });

      // apply sorting for current fleets tab
      this.sortFleets(owner, sortBy, redraw);
      // show fleets for current fleets tab
      this.drawFleetsTab(this.fleets);
      // add sorting & filtering buttons to current fleets tab
      this.addButtons(owner, fleetType);
      // add mark/unmark buttons
      if (Addons.Fleets.MarkOnMap) {
        Addons.Fleets.MarkOnMap.init();
      }
      // add summary button
      if (Addons.Fleets.Summary) {
        Addons.Fleets.Summary.init();
      }

      return true;
    },
    showFilteredFleets(owner, fleetType, filterBy) {
      const filterParams = this.getFilterParams(filterBy);
      if (Addons.Common.isObjNotEmpty(filterParams)) {
        this.getFilter(filterParams, filterBy)
        .then(
          filter => {
            this.filters[w.sub_menu].push(filter);
            this.showFleets({
              'owner': owner,
              'fleetType': fleetType,
              'redraw': true,
            })
          },
          error => w.showSmallMessage(ERR_MSG.NO_FILTER_SELECTED)
        );
      }
      else {
        w.showSmallMessage(ERR_MSG.NO_FILTER_PARAMS);
      }
    },
    getFilterParams(filterBy) {
      let filterParams = {};
      this.fleets.forEach(fleet => {
        filterParams[this.getFilterParam(filterBy, fleet)] = fleet[filterBy];
      });
      filterParams = Object.fromEntries(
        Object.entries(filterParams).sort((a, b) => {
          return Addons.Sort.alphabetically(a[0], b[0])
        })
      );
      return filterParams;
    },
    getFilterParam(filterBy, fleet) {
      if (filterBy === 'star_id') {
        const star = w.map.stars[fleet[filterBy]];
        return star.name + '&nbsp;' + star.x + ':' + star.y;
      }
      return fleet[filterBy];
    },
    getFilter(params, filterBy) {
      const isExcludeId = 'filtering-list-exclude';
      const filter = new Filter({[filterBy]: []});

      let message = `Отфильтровать по:</br>
        <select id='fl_filter' size='
        ${Object.keys(params).length < 8 ? Object.keys(params).length + 1 : 8}'
        multiple='multiple'>`;
      for (const i in params) {
        if (params.hasOwnProperty(i)) {
          message += `<option value="${params[i]}">${i}</option>`;
        }
      }
      message += '</select></br>';
      message += `<input type="checkbox" id="${isExcludeId}"/>`;
      message += `<label for="${isExcludeId}">Исключить выбранное</label>`;

      w.showSmallMessage(message);

      $(`#${isExcludeId}`).change(function () {
        filter.isExclude = $(this).is(':checked');
      });
      $('#fl_filter').change(function () {
        filter.by[filterBy] = $(this).val();
      });

      return new Promise(function (resolve, reject) {
        $('#data_modal > button').removeAttr("onclick")
        .click(function () {
          $('#fl_filter').change();
          $.modal.close();
          Addons.Common.isVariableDefined(filter.by[filterBy])
            ? resolve(filter) : reject();
        });
      });
    },
    sortFleets(owner, sortBy, redraw) {
      if (Addons.Common.isVariableDefined(this.sort[w.sub_menu]["last"])
        && (!redraw || sortBy === 'weight')) {
        this.sortBy(this.fleets, this.sort[w.sub_menu]["last"], owner);
      }
      else {
        this.sortBy(this.fleets, sortBy, owner);
        if (sortBy === this.sort[w.sub_menu]["last"]) {
          this.sort[w.sub_menu]["isReverse"] = !this.sort[w.sub_menu]["isReverse"];
        }
        this.sort[w.sub_menu]["last"] = (sortBy === 'weight') ? undefined : sortBy;
      }
      if (this.sort[w.sub_menu]["isReverse"]) {
        this.fleets.reverse();
      }
    },
    getFleetType(fleet) {
      /** non-own garrisons have a `fleet.garrison: "0"`
       * own garrisons have a `fleet.garrison: "1"`
       * all garrisons name is `fleet.fleet_name: "Гарнизон"`
       * and ico is `fleet.ico: null`
       */
      return (+fleet.garrison === 0) ? 'fleet' : 'garrison';
    },
    setDummyGarrisonIco(fleet) {
      // hack for sorting by ship type (== ship icon)
      return (fleet.ico !== null) ? fleet.ico : this.garrisonIco;
    },
    filterBy(fleets, filter) {
      if (Addons.Common.isObjNotEmpty(fleets)) {
        const keys = Object.keys(filter.by);
        const values = Object.values(filter.by);

        return fleets.filter(fleet => {
          // it's a dark magic :)
          return keys.every((key, index) => {
            return filter.isExclude ?
              values[index].every((value) => {
                return fleet[key] !== value
              })
              :
              values[index].some((value) => {
                return fleet[key] === value
              })
          })
          // && +fleet.weight !== 0;
        });
      }
      return [];
    },
    sortBy(fleets, sortBy, owner) {
      switch (sortBy) {
        case 'weight':
          fleets.sort(w.fleetOrder);
          break;
        case 'fleet_speed':
          fleets.sort(this.sorter.speed);
          fleets.map((fleet) => {
            fleet.fleet_speed = parseFloat(fleet.fleet_speed).toFixed(2);
            return fleet;
          });
          break;
        case 'turn': // by fleet state
          if (owner !== 'own') {
            fleets.sort(this.sorter.state.other);
          }
          else {
            fleets.sort(this.sorter.own).reverse();
          }
          break;
        case 'ico': // by fleet type
          fleets.sort(this.sorter.type);
          break;
        case 'fleet_name': // by owner & fleet names
          if (owner === 'own') {
            fleets.sort(this.sorter.fleetName);
            break;
          }
          fleets.sort(this.sorter.fleetName);
          fleets.sort(this.sorter.playerName);
          break;
        case 'stat':
          fleets.sort(this.sorter.combatPower.hp);
          // fleets.sort(this.sorter.combatPower.health);
          fleets.reverse();
          break;
        case 'player_id':
          if (owner !== 'other') {
            break;
          }
          fleets.sort(this.sorter.playerId);
          break;
        default:
          fleets.sort(w.fleetOrder);
          break;
      }
      // sort in-place
      // return fleets;
    },
    drawFleetsTab(fleets) {
      if (fleets && Addons.Common.isObjNotEmpty(fleets)) {
        $('#items_list').append(w.tmpl('fleets_title', fleets));
        for (const fleet of fleets) {
          if (Addons.Common.isVariableDefined(fleet)) {
            w.map.showBlockFleet(fleet, fleet.owner);
          }
        }
        $('#items_list>>>[title],#items_list>>>>[title]').qtip({
          position: {
            my: 'bottom center', // at the bottom right of...
            at: 'top center', // Position my top left...
          },
          style: {
            classes: 'qtip-dark tips',
          },
        });
      }
      else {
        $('#items_list').html(
          '<div class="player_fleet_title">Нет подходящих флотов</div>');
      }
    },
    getNaviDivs() {
      const divs = {};
      divs.fleet_speed = $('#items_list .fleet_speed')[0];
      divs.fleet_name = $('#items_list .fleet_name')[0];
      divs.turn = $('#items_list .fleet_state')[0];
      divs.ico = $('#items_list .fleet_ico_list')[0];
      divs.stat = $('#items_list .fleet_stat')[0];
      return divs;
    },
    addButtons(owner, fleetType) {
      const timerID = setInterval(() => {
        const divs = this.getNaviDivs();
        if (Addons.Common.isObjNotEmpty(divs)) {
          clearInterval(timerID);
          this.addSortButtons(divs, owner, fleetType);
          this.addFilterButtons(divs, owner, fleetType);
        }
      }, 0);
    },
    addSortButtons(divs, owner, fleetType) {
      // div match a sortBy
      for (let div in divs) {
        if (divs.hasOwnProperty(div) && Addons.Common.isVariableDefined(divs[div])) {
          if (fleetType === "garrison") {
            if (div !== "ico" && div !== "stat") {
              continue;
            }
          }
          Addons.DOM.makeClickable({
            elem: divs[div],
            icon: 'fa-sort',
            css_name: `sort-by-${div}`,
            title: 'Отсортировать',
            cb: `Addons.Fleets.Sort.showFleets({owner:'${owner}',fleetType:'${fleetType}',sortBy:'${div}',redraw:true})`
          });
        }
      }
    },
    addFilterButtons(divs, owner, fleetType) {
      // div match a filterBy
      for (let div in divs) {
        if (divs.hasOwnProperty(div) && Addons.Common.isVariableDefined(divs[div])) {
          if (div === 'fleet_speed' || div === 'stat') {
            continue;
          }
          if (fleetType === 'garrison' &&
            (div === 'turn' || div === 'fleet_name')) {
            continue;
          }
          if ((owner === 'other' || owner === 'peace') &&
            div === 'fleet_name') {
            // add the additional button before current
            Addons.DOM.appendClickableIcon({
              elem: divs[div],
              icon: 'fa-id-badge',
              css_name: `filter-by-${div}`,
              title: 'Отфильтровать по владельцу',
              cb: `Addons.Fleets.Sort.showFilteredFleets('${owner}','${fleetType}','player_name')`
            });
          }
          if (div === 'turn') {
            // add the additional button before current
            Addons.DOM.appendClickableIcon({
              elem: divs[div],
              icon: 'fa-crosshairs',
              css_name: `filter-by-star_id`,
              title: 'Отфильтровать по системе',
              cb: `Addons.Fleets.Sort.showFilteredFleets('${owner}','${fleetType}','star_id')`
            });
          }

          Addons.DOM.appendClickableIcon({
            elem: divs[div],
            icon: 'fa-filter',
            css_name: `filter-by-${div}`,
            title: 'Отфильтровать',
            cb: `Addons.Fleets.Sort.showFilteredFleets('${owner}','${fleetType}','${div}')`
          });
        }
      }
    },
    init() {
      $('#navi > div:nth-child(2)').attr('onclick',
        'Addons.Fleets.Sort.showFleets({owner:\'own\'});return false;');
      $('#navi > div:nth-child(3)').attr('onclick',
        'Addons.Fleets.Sort.showFleets({owner:\'other\'});return false;');
      Addons.DOM.createNaviBarButton('Гарнизон', 1,
        'Addons.Fleets.Sort.showFleets({owner:\'own\',fleetType: \'garrison\'});return false;');
      Addons.DOM.createNaviBarButton('Союзные', 3,
        'Addons.Fleets.Sort.showFleets({owner:\'peace\'});return false;');
      Addons.DOM.createNaviBarButton('Пираты', 5,
        'Addons.Fleets.Sort.showFleets({owner:\'pirate\'});return false;');
    },
    sorter: {
      state: {
        own(a, b) {
          if (a.allow_explore > b.allow_explore) {
            return 1;
          }
          else if (a.allow_explore < b.allow_explore) {
            return -1;
          }
          if (a.allow_fly > b.allow_fly) {
            return 1;
          }
          else if (a.allow_fly < b.allow_fly) {
            return -1;
          }
          if (a.allow_transfer > b.allow_transfer) {
            return 1;
          }
          else if (a.allow_transfer < b.allow_transfer) {
            return -1;
          }
          if (a.allow_garrison > b.allow_garrison) {
            return 1;
          }
          else if (a.allow_garrison < b.allow_garrison) {
            return -1;
          }
          if (a.allow_station > b.allow_station) {
            return -1; // изучает аномалию - опускаем ниже
          }
          else if (a.allow_station < b.allow_station) {
            return 1; // готов изучить или не станция - поднять
          }
          if (a.start_turn > b.start_turn) {
            return -1; // будет дольше в полёте - опустить
          }
          else if (a.start_turn < b.start_turn) {
            return 1;
          }
          return 0;
        },
        other(a, b) {
          return Addons.Sort.numerically(a.turn, b.turn);
        },
      },
      combatPower: {
        health(a, b) {
          return Addons.Sort.numerically(a.health, b.health);
        },
        hp(a, b) {
          return Addons.Sort.numerically(
            a.hp + a.laser_hp,
            b.hp + b.laser_hp
          );
        },
      },
      speed(a, b) {
        // order desc
        return -Addons.Sort.numerically(a.fleet_speed, b.fleet_speed);
      },
      type(a, b) {
        return Addons.Sort.alphabetically(a.ico, b.ico);
      },
      fleetName(a, b) {
        return Addons.Sort.alphabetically(a.fleet_name, b.fleet_name);
      },
      playerName(a, b) {
        return Addons.Sort.alphabetically(a.player_name, b.player_name);
      },
      playerId(a, b) {
        // order asc
        return Addons.Sort.numerically(a.player_id, b.player_id);
      },
    },
  };

  Addons.Fleets.Sort.init(this);

})(window);
