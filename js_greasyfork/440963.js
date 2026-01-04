// ==UserScript==
// @name The-West Deluxe Jobs
// @namespace TWS
// @author Shelimov (updated by Tom Robert)
// @description TWSweets Addon - Gold and silver jobs!
// @include http*://*.the-west.*.*/game.php*
// @version 2.3.8
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/440963/The-West%20Deluxe%20Jobs.user.js
// @updateURL https://update.greasyfork.org/scripts/440963/The-West%20Deluxe%20Jobs.meta.js
// ==/UserScript==
// translation: Shelimov(Russian),Tom Robert(German),pepe100(Spanish),jccwest(Portuguese),Lutte Finale(French),anto81(Italian),0ndra(Polish),JackJeruk(Hungarian),Jamza(Czech&Slovak)
(function (fn) {
  var script = document.createElement('script');
  script.setAttribute('type', 'application/javascript');
  script.textContent = '(' + fn + ')();';
  document.body.appendChild(script);
  document.body.removeChild(script);
}) (function () {
  window.DJ = {
  };
  DJ = {
    version: '2.3.8',
    name: 'Deluxe Jobs',
    author: 'Shelimov (updated by Tom Robert)',
    website: 'https://greasyfork.org/scripts/11380',
    date: '22 September 2017',
    langs: {
      en: {
        dx_input: 'Job or product name',
        jobs_type_all: 'All',
        jobs_type_gold: 'Gold',
        jobs_type_silver: 'Silver',
        dx_update: 'Update data',
        dx_jobs_list: 'List of jobs',
        dx_sort_distance: 'Sort by range',
        distance: 'Distance',
        dx_sort_name: 'Sort by name">Name',
        open_job: 'Open job',
        dx_show_on_map: 'Center job on map',
        work_out: '15s start job',
        dx_expired: 'Maybe the cached data is outdated. Update?',
      },
      ru: {
        dx_input: 'Продукт или работа',
        jobs_type_all: 'Все',
        jobs_type_gold: 'Золотые',
        jobs_type_silver: 'Серебряные',
        dx_update: 'Обновить',
        dx_jobs_list: 'Список работ',
        dx_sort_distance: 'Сортировать по расстоянию',
        distance: 'Расстояние',
        dx_sort_name: 'Сортировать по названию">Название',
        open_job: 'Открыть работу',
        dx_show_on_map: 'Показать на карте',
        work_out: 'Приступить к работе: 15с.',
        dx_expired: 'Возможно, что загруженные данные устарели. Обновить?',
      },
      de: {
        dx_input: 'Arbeit oder Produktname',
        jobs_type_all: 'Alle',
        jobs_type_gold: 'Gold',
        jobs_type_silver: 'Silber',
        dx_update: 'Daten aktualisieren',
        dx_jobs_list: 'Liste der Arbeiten',
        dx_sort_distance: 'Nach Distanz sortieren',
        distance: 'Distanz',
        dx_sort_name: 'Nach Name sortieren">Name',
        open_job: 'Arbeit öffnen',
        dx_show_on_map: 'Arbeit auf der Karte zeigen',
        work_out: '15s Arbeit starten',
        dx_expired: 'Der Cache ist möglicherweise nicht mehr aktuell. Aktualisieren?',
      },
      es: {
        dx_input: 'Nombre trabajo o rendimiento',
        jobs_type_all: 'Todo',
        jobs_type_gold: 'Oro',
        jobs_type_silver: 'Plata',
        dx_update: 'Actualizar datos',
        dx_jobs_list: 'Lista de trabajos',
        dx_sort_distance: 'Ordenar por rango',
        distance: 'Distancia',
        dx_sort_name: 'Ordenar por nombre">Nombre',
        open_job: 'Abrir trabajo',
        dx_show_on_map: 'Centrar mapa en el trabajo',
        work_out: '15s comenzar trabajo',
        dx_expired: 'Tal vez los datos de la caché no estén actualizados. ¿Actualizarlos?',
      },
      pt: {
        dx_input: 'Nome do trabalho ou do item',
        jobs_type_all: 'Todos',
        jobs_type_gold: 'Ouro',
        jobs_type_silver: 'Prata',
        dx_update: 'Atualização dos dados',
        dx_jobs_list: 'Lista dos trabalhos',
        dx_sort_distance: 'Ordenar por Distância',
        distance: 'Distância',
        dx_sort_name: 'Ordenar por nome">Nome',
        open_job: 'Abrir trabalho',
        dx_show_on_map: 'Localizar Trabalho no mapa',
        work_out: '15s começar trabalho',
        dx_expired: 'Os dados podem estar desatualizados. Atualizar?',
      },
      fr: {
        dx_input: 'Titre du travail ou du produit',
        jobs_type_all: 'Tous',
        jobs_type_gold: 'Or',
        jobs_type_silver: 'Argent',
        dx_update: 'Les données mise à jour',
        dx_jobs_list: 'Liste des travaux',
        dx_sort_distance: 'Classer par distance',
        distance: 'Distance',
        dx_sort_name: 'Trier par nom">Nom',
        open_job: 'Ouvrir travail',
        dx_show_on_map: 'Centrer le travail sur la carte',
        work_out: '15s commencer le travail',
        dx_expired: 'Données chargées est trop vieux.<br>Télécharger de nouvelles données?',
      },
      it: {
        dx_input: 'Nome del lavoro o del prodotto',
        jobs_type_all: 'Tutti',
        jobs_type_gold: 'Oro',
        jobs_type_silver: 'Argento',
        dx_update: 'Aggiornare i dati',
        dx_jobs_list: 'Elenco dei lavori',
        dx_sort_distance: 'Ordina per distanza',
        distance: 'Distanza',
        dx_sort_name: 'Ordina per nome">Nome',
        open_job: 'Apri lavoro',
        dx_show_on_map: 'Centra il lavoro sulla mappa',
        work_out: '15s inizia lavoro',
        dx_expired: 'I dati caricati sono vecchi.<br>Scaricare i nuovi dati?',
      },
      pl: {
        dx_input: 'Podaj szukaną frazę',
        jobs_type_all: 'Wszystko',
        jobs_type_gold: 'Złoto',
        jobs_type_silver: 'Srebrny',
        dx_update: 'Aktualizowania danych',
        dx_jobs_list: 'Lista prac',
        dx_sort_distance: 'Sortuj według odległości',
        distance: 'Odległość',
        dx_sort_name: 'Sortuj według nazwy">Nazwa',
        open_job: 'Rozwinąć pracy',
        dx_show_on_map: 'Pokaż pracy na mapie',
        work_out: 'Rozpoczęcia pracy 15s',
        dx_expired: 'Załadowane dane są zbyt stare.<br>Pobrać nowe dane?',
      },
      hu: {
        dx_input: 'Munka vagy Termék megnevezése',
        jobs_type_all: 'Minden',
        jobs_type_gold: 'Arany',
        jobs_type_silver: 'Ezüst',
        dx_update: 'Adatok frissítése',
        dx_jobs_list: 'Munkák listája',
        dx_sort_distance: 'Rendezés Távolság alapján',
        distance: 'Távolság',
        dx_sort_name: 'Rendezés Név alapján">Név',
        open_job: 'Nyílt munkahely',
        dx_show_on_map: 'Center munkát a térképen',
        work_out: '15s kezdeni munkát',
        dx_expired: 'A jelenlegi adatok túl régiek.<br>Frissítsem az adatokat?',
      },
      cs: { 
        dx_input: 'Název práce nebo produktu',
        jobs_type_all: 'Všechny',
        jobs_type_gold: 'Zlaté',
        jobs_type_silver: 'Stříbrné',
        dx_update: 'Aktualizovat data',
        dx_jobs_list: 'Seznam prác',
        dx_sort_distance: 'Seřadit podle vzdálenosti',
        distance: 'Vzdálenost',
        dx_sort_name: 'Seřadit podle názvu">Název',
        open_job: 'Otevřít práci',
        dx_show_on_map: 'Zobrazit práci na mapě',
        work_out: '15s začít práci',
        dx_expired: 'Možná data v medzipaměti jsou zastaralá. Aktualizovat?',
        update: 'Aktualizovat',
        updateAvailable: 'Nová verze scriptu je dostupná',
      },
	  sk: {
        dx_input: 'Názov práce alebo produktu',
        jobs_type_all: 'Všetky',
        jobs_type_gold: 'Zlaté',
        jobs_type_silver: 'Strieborné',
        dx_update: 'Aktualizovať dáta',
        dx_jobs_list: 'Zoznam prác',
        dx_sort_distance: 'Zoradiť podľa vzdialenosti',
        distance: 'Vzdialenosť',
        dx_sort_name: 'Zoradiť podľa názvu">Názov',
        open_job: 'Otvoriť prácu',
        dx_show_on_map: 'Zobraziť prácu na mape',
        work_out: '15s začať prácu',
        dx_expired: 'Možno dáta v medzipamäti sú zastaralé. Aktualizovať?',
        update: 'Aktualizovať',
        updateAvailable: 'Nová verzia scriptu je dostupná',
      },
    },
    updateLang: function () {
      var lg = DJ.langs;
      DJ.lang = lg[localStorage.getItem('scriptsLang')] ? localStorage.getItem('scriptsLang')  : lg[Game.locale.substr(0, 2)] ? Game.locale.substr(0, 2)  : 'en';
      DJlang = lg[DJ.lang];
    },
  };
  DJ.updateLang();
  $.getScript('https://tomrobert.safe-ws.de/tinysort.js', function () {
    west.define('TWS.Components.ExtraTextfield', west.gui.Component, {
      divMain: null,
      groupFrame: null,
      listeners: null,
      items: null,
      fakeSpan: null,
      init: function (id, placeholder, add_on_enter) {
        this.placeholder = placeholder || '';
        this.textField = $('<input type="text" size="45"></input>');
        this.listeners = [
        ];
        this.items = [
        ];
        this.container = $('<div id="container"></div>');
        this.fakeSpan = $('<span style="opacity: 0; position: absolute;"></span>');
        this.container.append(this.textField).append(this.fakeSpan);
        this.groupFrame = new west.gui.Groupframe('tws_extratextfield').setId(id).appendToContentPane(this.container);
        this.divMain = $(this.groupFrame.getMainDiv());
        this._build(add_on_enter);
      },
      _build: function (add_on_enter) {
        var that = this,
        preparetodel = false,
        lastkey,
        tmp = $('<span>' + this.placeholder + '</span>').appendTo('body');
        this.textField.css({
          minWidth: tmp.width(),
          width: tmp.width()
        });
        tmp.remove();
        this.textField.focus(function () {
          if (that.textField.val() == that.placeholder)
          that.textField.val('');
        });
        this.textField.blur(function () {
          if (that.textField.val() == '')
          that.textField.val(that.placeholder);
        });
        this.textField.keydown(function (e) {
          lastkey = e.which;
          if (that.getLength() == 0)
          return;
          if (e.which != 8) {
            preparetodel = false;
            that.getLastChild().className = 'item';
          }
          if (preparetodel && lastkey == 8 && e.which == 8) {
            preparetodel = false;
            that.deleteItem(that.getLastChild().innerHTML.replace(/<a.+a>/i, ''));
            return;
          }
          if (e.which == 8 && that.textField.val() == '' && that.getLength() != 0) {
            preparetodel = true;
            that.getLastChild().className = 'item highlight';
          }
        });
        this.textField.keyup(function (e) {
          if (e.which == 13 && add_on_enter) {
            that.addItem(that.textField.val());
          }
          that.fakeSpan.html(that.textField.val());
          that.textField.css('width', that.fakeSpan.width() > that.container.width() - 30 ? that.container.width : that.fakeSpan.width() + 30);
          that._callListeners(e.which);
        });
      },
      keyCodes: {
        BACKSPACE: 8,
        ALT: 18,
        SHIFT: 16,
        ENTER: 13
      },
      addListener: function (fn, ctx, data) {
        this.listeners.push({
          f: fn,
          c: ctx,
          d: data
        });
      },
      _blink: function (obj, times) {
        var iterate = 0;
        blink();
        function blink() {
          if (iterate == times)
          return;
          obj.className += ' highlight';
          setTimeout(function () {
            obj.className = obj.className.replace(' highlight', '');
            setTimeout(blink, 150);
          }, 150);
          iterate++;
        }
      },
      _each: function (fn) {
        var childrens = this.container.children('.item');
        for (var i = 0, l = childrens.length; i < l; i++)
        fn.call(childrens[i], i);
      },
      _callListeners: function (key) {
        for (var i = 0, l = this.listeners.length; i < l; i++) {
          var li = this.listeners[i];
          li.f.apply(li.c, [
            key,
            this.getValues(),
            li.d
          ]);
        }
      },
      isUnique: function (text) {
        return this.getItem(text) == null;
      },
      addItem: function (text, data) {
        var that = this,
        el;
        if (!this.isUnique(text)) {
          this._blink(this.getItem(text), 2);
          return;
        }
        text = text.replace(/^\s+/, '').replace(/\s+$/, '');
        el = $('<span class="item">' + text + '</span>').attr('data-value', data).append($('<a href="#">×</a>').click(function () {
          that.deleteItem(text);
        }));
        if ($('.item', this.container).length)
        el.insertAfter($('.item:last', this.container));
         else
        this.container.prepend(el);
        if (text == this.textField.val());
        this.textField.val('');
        this._callListeners(null);
      },
      getItem: function (text) {
        var result = null;
        this._each(function () {
          if (this.innerHTML.replace(/<a.+a>/i, '').toLowerCase() == text.toLowerCase())
          result = this;
        });
        return result;
      },
      getValues: function () {
        var vals = [
        ];
        this._each(function (i) {
          vals.push({
            text: this.innerHTML.replace(/<a.+a>/i, ''),
            data: this.getAttribute('data-value'),
            node: this
          });
        });
        return vals;
      },
      getLastChild: function () {
        var childrens = this.container.children('.item');
        if (childrens.length != 0)
        return childrens.last() [0];
      },
      getLength: function () {
        return this.container.children('.item').length;
      },
      getTextfieldVal: function () {
        return this.textField.val();
      },
      blinkItem: function (text, times) {
        var item = this.getItem(text);
        if (item == null)
        return;
        this._blink(item, times);
      },
      deleteItem: function (text) {
        var el = this.getItem(text);
        if (el != null)
        el.parentNode.removeChild(el);
        this._callListeners(null);
      },
      setPlaceholder: function (text) {
        this.backgroundText.html(text);
      },
      clear: function () {
        var a = this.getValues();
        for (var i = 0, l = a.length; i < l; i++)
        a[i].node.parentNode.removeChild(a[i].node);
        this._callListeners(null);
      }
    });
    TWS.GUIControl.Style.append('.tws_extratextfield input { z-index: 1; float: left; height: 20px; position: relative; border: none !important; box-shadow: none !important; -moz-box-shadow: none !important; -webkit-box-shadow: none !important; outline: 0 !important; padding: 0 !important; margin: 4px 3px 0; background-color: transparent !important;}\n' +
    '.tws_extratextfield .placeholder { position: relative; left: 12px; }\n' +
    '.tws_extratextfield .item { -webkit-transition: background .15s linear; background: rgba(211, 186, 3, 0.3); border-radius: 2px; float: left; padding: 3px; border: 1px solid #000; margin-right: 3px; margin-bottom: 2px; }\n' +
    '.tws_extratextfield .item.highlight { background: #FFF; }\n' +
    '.tws_extratextfield a { border-radius: 5px; border: 1px solid #000; line-height: 0px; display: inline-block; padding: 4px 0 4px 0; font-size: 15px; color: rgb(150,0,0); margin-left: 5px; }');
    TWS.DeluxeJobs = TWS.Module({
      name: 'Deluxe Jobs',
      tid: 'dx',
      type: TWS.Module.TAB,
      version: DJ.version,
      onOpen: function (_window) {
        TWS.DeluxeJobs.init();
        TWS.DeluxeJobs.checkPosition();
      }
    }, {
      loaded: null,
      reload: function () {
        this.Cache.clear();
        this.loaded = false;
        this.init();
      },
      parseOpenData: function (data) {
        var fl = this.getGUI().Filter;
        fl.clear();
        for (var i = 0, l = data.length; i < l; i++) {
          fl.addJobs(isNaN( + data[i]) ? data[i] : + data[i]);
        }
        fl.filter.textField.focus();
      },
      init: function (force) {
        var that = this;
        this.loaded = false;
        this.filterData = {
          jobs: {
          },
          yields: {
          }
        };
        this.finderData = {
        };
        if (!force) {
          EventHandler.listen('itemmanager_loaded', function () {
            if (that.loaded)
            return;
            that.init(true);
          });
          return;
        }
        this._getJobsPositions();
        this.QuestHelper.init();
        this.init = function () {
          if (this.loaded)
          return;
          var that = this,
          gui = this.getGUI();
          gui.Loader.show();
          function draw(data) {
            var tmpCoord;
            gui.clear();
            $.each(data, function (coords, jobs_arr) {
              tmpCoord = coords.split('_');
              gui.addJobs(jobs_arr, {
                x: tmpCoord[0],
                y: tmpCoord[1]
              });
            });
            gui.Map.addOneself();
            gui.List.sort();
            gui.showJobs();
            that.loaded = true;
          }
          TWS.DeluxeJobs.getData(function (data, state) {
            if (state == undefined) {
              gui.Loader.hide();
              draw(data);
              return;
            }
            gui.Loader.set(state);
            if (state == 9)
            draw(data);
          });
        };
      },
      checkPosition: function () {
        if (this.loaded)
        this.getGUI().Map.addOneself();
      },
      QuestHelper: {
        init: function () {
          this.rewrite();
        },
        rewrite: function () {
          if (window.MinimapWindow && MinimapWindow.getQuicklink && window.QuestTrackerWindow && QuestTrackerWindow.window && QuestTrackerWindow.window.divMain) {
            var body = MinimapWindow.getQuicklink.toString().replace(/function ?\(name, ?type\) ?{/, '').slice(0, -1).replace('&nbsp;"', '&nbsp;" + TWS.DeluxeJobs.QuestHelper.getIcon(name);');
            MinimapWindow.getQuicklink = new Function('name', 'type', body);
            QuestTrackerWindow.reload();
          } else
          setTimeout(arguments.callee, 100);
        },
        getIcon: function (name) {
          return '<img src="' + to_cdn('images/window/job/jobstar_small_gold.png') + '" onclick="void(TWS.DeluxeJobs.open([\'' + name + '\']))" title="Search job in Deluxe Jobs" style="cursor: pointer; width: 18px; height: 18px;">&nbsp;';
        }
      },
      Cache: {
        data: JSON.parse(localStorage.getItem('tws_dj_cache')),
        hoursToExpire: 8,
        hoursToNextDay: 16,
        setData: function (d) {
          this.data = {
            0: d,
            timestamp: Math.round( + new Date() / 1000)
          };
          localStorage.setItem('tws_dj_cache', JSON.stringify(this.data));
        },
        _hasData: function () {
          return this.data != null;
        },
        _getStamp: function () {
          if (this._hasData())
          return this.data.timestamp;
          return null;
        },
        isNDay: function () {
          if (this._hasData())
          return (Math.round( + new Date() / 1000) - this._getStamp()) >= 3600 * this.hoursToNextDay;
        },
        isExpired: function () {
          if (this._hasData())
          return (Math.round( + new Date() / 1000) - this._getStamp()) >= 3600 * this.hoursToExpire;
           else
          return null;
        },
        getData: function () {
          if (this._hasData())
          return this.data[0];
          return null;
        },
        clear: function () {
          this.data = null;
          localStorage.setItem('tws_dj_cache', JSON.stringify(this.data));
        }
      },
      _getJobsPositions: function () {
        var temp,
        that = this;
        Ajax.get('map', 'get_minimap', {
        }, function (data) {
          $.each(data.job_groups, function (group, coords) {
            that.finderData[group] = [
            ];
            $.each(JobList.getJobsByGroupId(group), function (k, jobObj) {
              that.filterData.jobs[jobObj.id] = jobObj.name;
              $.each(jobObj.yields, function (yieldId, obj) {
                temp = that.filterData.yields[yieldId] = that.filterData.yields[yieldId] || {
                  jobs: [
                  ],
                  name: ItemManager.get(yieldId).name
                };
                temp.jobs.push(jobObj.id);
              });
            });
            $.each(coords, function (index, coord_a) {
              that.finderData[group].push([Math.floor(coord_a[0] / Map.tileSize),
              Math.floor(coord_a[1] / Map.tileSize)]);
            });
          });
        });
      },
      getData: function (callback) {
        var data = this.Cache.getData(),
        that = this;
        if (data !== null && !this.Cache.isExpired())
        return callback(data);
        if (data !== null && this.Cache.isExpired() && !this.Cache.isNDay()) {
          new west.gui.Dialog('TWSweets Deluxe Jobs', '<div>' + DJlang.dx_expired + '</div>', 'warning').addButton('yes', function () {
            that.Cache.clear();
            that._loadData(callback);
          }).addButton('no', function () {
            callback(that.Cache.getData());
          }).setWidth(470).show();
          return;
        }
        this._loadData(callback);
      },
      _loadData: function (callback) {
        var i = 1,
        state = 0,
        toCache = {
        },
        that = this,
        fd = this.finderData,
        l = objectLength(fd);
        function get() {
          if (l - i == 0 || l - i < 4) {
            if (i == l) {
              callback(toCache, ++state);
              that.Cache.setData(toCache);
            } else {
              var to_get = [
              ];
              for (var s = 0; s < l % 4; s++)
              to_get = to_get.concat(fd[i + s]);
              that._getTilesData(to_get, last);
            }
            return;
          }
          that._getTilesData(fd[i].concat(fd[i + 1]).concat(fd[i + 2]).concat(fd[i + 3]), function (data) {
            $.extend(toCache, data);
            state++;
            callback(toCache, state);
            get();
          });
          i += 4;
        }
        get();
        function last(data) {
          $.extend(toCache, data);
          state++;
          callback(toCache, state);
          that.Cache.setData(toCache);
        }
      },
      _getTilesData: function (tiles, cb) {
        var that = this;
        Ajax.get('map', 'get_complete_data', {
          tiles: JSON.stringify(tiles)
        }).done(function (result) {
          cb(that._parseData(result));
        });
      },
      _parseData: function (data) {
        var sub,
        x,
        y,
        i,
        entry,
        job,
        jobs = {
        },
        data = data.dynamic;
        for (sub in data) {
          if (!data.hasOwnProperty(sub))
          continue;
          for (x in data[sub]) {
            if (!data[sub].hasOwnProperty(x))
            continue;
            for (y in data[sub][x]) {
              if (!data[sub][x].hasOwnProperty(y))
              continue;
              dataMatched: for (i in data[sub][x][y]) {
                if (!data[sub][x][y].hasOwnProperty(i))
                continue;
                entry = data[sub][x][y][i];
                job = entry[1];
                if (job.job_id) {
                  jobs[job.x + '_' + job.y] = jobs[job.x + '_' + job.y] || [
                  ];
                  jobs[job.x + '_' + job.y].push({
                    type: job.gold ? 'gold' : 'silver',
                    id: job.job_id
                  });
                }
              }
            }
          }
        }
        return jobs;
      }
    }, {
      loaded: null,
      currentJobs: null,
      currentType: null,
      sort_by: 'range',
      init: function (Module) {
        this.loaded = false;
        this.currentJobs = [
        ];
        this.currentType = 'all';
        this.List.DOM = this.List.init(this);
        this.Map.DOM = this.Map.init(this);
        this.Filter.DOM = this.Filter.init(this);
        this.Control.DOM = this.Control.init(this);
        this.Loader.DOM = this.Loader.init(this);
        this.DOM.append(this.Loader.DOM).append(this.Map.DOM).append(this.Filter.DOM).append(this.Control.DOM).append(this.List.DOM);
        EventHandler.listen('char_position_changed', function () {
          if (!$('._tab_id_dx').length)
          return;
          TWS.DeluxeJobs.checkPosition();
        });
      },
      addJobs: function (jobs, pos) {
        var that = this,
        mark = this.Map.addJobs(jobs, pos);
        $.each(jobs, function (index, job_obj) {
          that.List.addJob(job_obj, pos).hover(function () {
            mark.addClass('focus');
          }, function () {
            mark.removeClass('focus');
          });
        });
      },
      showJobs: function (type, ids) {
        ids = ids || this.currentJobs;
        type = type || this.currentType;
        this.Map.showJobs(type, ids);
        this.List.showJobs(type, ids);
        this.List.sort();
        this.currentJobs = ids;
        this.currentType = type;
      },
      clear: function () {
        this.List.list.clearBody();
        this.Map.clear();
      },
      Loader: {
        progressBar: null,
        init: function () {
          this.progressBar = new west.gui.Progressbar(0, 9);
          return $('<div id="tws_dj_loader"></div>').append('<div id="tws_dj_loader_fade"></div>').append(this.progressBar.getMainDiv()).hide();
        },
        show: function () {
          this.progressBar.setValue(0);
          this.DOM.show();
        },
        set: function (value) {
          this.progressBar.setValue(value);
          if (value == 9)
          this.hide();
        },
        hide: function () {
          this.DOM.hide();
        }
      },
      Filter: {
        jobs_list: null,
        yields_list: null,
        to: null,
        init: function () {
          this.jobs_list = JobList.getSortedJobs('id');
          this.initYields();
          var that = this,
          DOM = $('<div id="tws_dj_filter"></div>'),
          mouseisover = false;
          this.filter = new TWS.Components.ExtraTextfield('tws_dj_filter_input', DJlang.dx_input + '.....');
          this.filter.addListener(this.filterHandler, this);
          this.filter.getMainDiv().hover(function () {
            that.filter.removeClass('minimized');
            that.filter.textField.focus();
            mouseisover = true;
          }, function () {
            mouseisover = false;
            if (that.filter.textField.is(':focus') && that.filter.getTextfieldVal() != '')
            return;
            that.filter.textField.blur();
            that.filter.addClass('minimized');
          });
          this.filter.textField.blur(function () {
            if (mouseisover) return;
            that.filter.addClass('minimized');
          });
          return DOM.append(this.filter.getMainDiv());
        },
        addJobs: function (nameid, isjobid) {
          var name,
          ids;
          if (!nameid)
          return;
          if (typeof nameid == 'number') {
            if (isjobid) {
              name = JobList.getJobById(nameid).name;
              ids = [
                nameid
              ];
            } else {
              name = ItemManager.get(nameid).name;
              ids = this.search(name);
            }
          } else {
            name = nameid;
            ids = this.search(name);
          }
          if (!this.filter.isUnique(name)) {
            this.filter.blinkItem(name, 2);
            return;
          }
          if (ids.length != 0) {
            if (ids.length == 1 && typeof nameid == 'string')
            name = JobList.getJobById(ids[0]).name;
            this.filter.addItem(name, ids);
            this.filter.textField.val('');
          }
        },
        initYields: function () {
          this.yields_list = {
          };
          for (var i = 0, l = this.jobs_list.length; i < l; i++) {
            for (var y_id in this.jobs_list[i].yields) {
              this.yields_list[y_id] = [
              ] || this.yields_list[y_id];
              this.yields_list[y_id].push(this.jobs_list[i].id);
            }
          }
        },
        filterHandler: function (key, values) {
          var that = this,
          gui = TWS.DeluxeJobs.getGUI(),
          ids = [
          ];
          for (var i = 0, l = values.length; i < l; i++) {
            var tmp = values[i].data.split(',');
            for (var j = 0; j < tmp.length; j++)
            tmp[j] = + tmp[j];
            values[i].data = tmp;
          }
          if (this.to)
          window.clearTimeout(this.to);
          if (!that.filter.getLength() && that.filter.getTextfieldVal() == '') {
            gui.showJobs(null, [
            ]);
            return;
          }
          if (key == this.filter.keyCodes.ENTER) {
            this.addJobs(this.filter.getTextfieldVal());
            return;
          } else if (key == null) {
            for (var i = 0, l = values.length; i < l; i++) {
              var tmp = values[i].data;
              for (var j = 0; j < tmp.length; j++)
              tmp[j] = + tmp[j];
              ids = ids.concat(tmp);
            }
            gui.showJobs(null, ids);
            return;
          }
          this.to = setTimeout(function () {
            for (var i = 0, l = values.length; i < l; i++) {
              var tmp = values[i].data;
              ids = ids.concat(tmp);
            }
            var input_txt = that.filter.getTextfieldVal(),
            tmp;
            if (input_txt != '') {
              tmp = that.search(input_txt);
              if (tmp.length == 1) {
                that.filter.addItem(TWS.DeluxeJobs.filterData.jobs[tmp[0]], tmp);
                that.filter.textField.val('');
              }
              ids = ids.concat(tmp);
            }
            gui.showJobs(null, ids);
          }, 400);
        },
        search: function (text) {
          var regexp = new RegExp(text.toLowerCase(), 'i'),
          l = this.jobs_list.length,
          i,
          y_id,
          found = [
          ];
          for (i = 0; i < l; i++)
          if (regexp.test(this.jobs_list[i].name.toLowerCase()))
          found.push(this.jobs_list[i].id);
          for (y_id in this.yields_list)
          if (regexp.test(ItemManager.get(y_id).name.toLowerCase()))
          found = found.concat(this.yields_list[y_id]);
          return found;
        },
        clear: function () {
          this.filter.clear();
        }
      },
      Control: {
        init: function () {
          var that = this,
          radio_all = new west.gui.Checkbox(DJlang.jobs_type_all, 'tws_dj_jobs_type', function () {
            that.radioHandler(0);
          }).setRadiobutton().setSelected(true, true),
          radio_gold = new west.gui.Checkbox(DJlang.jobs_type_gold, 'tws_dj_jobs_type', function () {
            that.radioHandler(1);
          }).setRadiobutton(),
          radio_silver = new west.gui.Checkbox(DJlang.jobs_type_silver, 'tws_dj_jobs_type', function () {
            that.radioHandler(2);
          }).setRadiobutton(),
          update_button = new west.gui.Button(DJlang.dx_update, function () {
            TWS.DeluxeJobs.reload();
          }),
          $radios = $('<div id="tws_dj_radios"></div>'),
          $control = $('<div id="tws_dj_control"></div>');
          $radios.append(radio_all.getMainDiv()).append(radio_gold.getMainDiv()).append(radio_silver.getMainDiv());
          $control.append($radios).append(update_button.getMainDiv());
          return $control;
        },
        radioHandler: function (state) {
          var type;
          switch (state) {
            case 0:
              type = 'all';
              break;
            case 1:
              type = 'gold';
              break;
            case 2:
              type = 'silver';
              break;
          }
          TWS.DeluxeJobs.getGUI().showJobs(type);
        }
      },
      Sets: {
      },
      Map: {
        map2img: 112,
        $: function (selector) {
          return $(selector, this.DOM);
        },
        init: function (Module) {
          var that = this,
          map = $('<div id="tws_dj_map"></div>').click(function (e) {
            var offset = $(this).offset(),
            left = e.pageX - offset.left,
            top = e.pageY - offset.top;
            Map.center(left * that.map2img, top * that.map2img);
          });
          return map;
        },
        addOneself: function () {
          var mark = $('.my_pos', this.DOM),
          pos = {
            x: Math.round(Character.position.x / this.map2img) - 3,
            y: Math.round(Character.position.y / this.map2img) + 7
          },
          mark2;
          if (mark.length)
          mark.remove();
          mark2 = $('<div class="tws_dj_mark my_pos" style="left:' + pos.x + 'px;top:' + pos.y + 'px"></div>');
          this.DOM.append(mark2);
          return mark2;
        },
        addJob: function (job, pos) {
          return this.addJobs([job], pos);
        },
        sumRGB: function () {
          if (arguments.length < 2)
          return arguments[0];
          for (var i = 0, length = arguments.length; i < length; i++) {
            if (arguments[i + 1] == undefined)
            break;
            arguments[i + 1] = sum(arguments[i], arguments[i + 1]);
          }
          function sum(a, b) {
            var tmp = [
            ];
            for (var l = 0; l < 3; l++)
            tmp[l] = a[l] + Math.round((b[l] - a[l]) / 2);
            return tmp;
          }
          return arguments[arguments.length - 1];
        },
        addJobs: function (jobs, pos) {
          var left = Math.round(pos.x / this.map2img) - 3,
          top = Math.round(pos.y / this.map2img) + 7,
          title = '',
          type,
          tmpType = null,
          tmpColor = null,
          data_ids = [
          ],
          that = this;
          if (jobs.length == 1) {
            title = Map.PopupHandler.getJobPopup(JobList.getJobById(jobs[0].id));
            type = jobs[0].type;
            data_ids.push(jobs[0].id);
          } else {
            tmpColor = [
              0,0,0
            ];
            $.each(jobs, function (index, job_obj) {
              if (tmpType && tmpType != job_obj.type)
              type = 'mixed';
              tmpType = job_obj.type;
              tmpColor = that.sumRGB(tmpColor, job_obj.type == 'gold' ? [
                255,215,0
              ] : [
              192,192,192
              ]);
              title += '<strong>' + JobList.getJobById(job_obj.id).name;
              if (index != jobs.length - 1)
              title += '</strong><div class="marker_popup_divider"></div>';
              data_ids.push(job_obj.id);
            });
          }
          var result = $('<div class="tws_dj_mark" title="' + title.escapeHTML() + '" style="left:' + left + 'px;top:' + top + 'px ;" data-id="' + data_ids.join() + '"></div>');
          if (tmpColor)
          result.css('background-color', 'rgb(' + tmpColor.join(', ') + ')');
          result.addClass(type);
          this.DOM.append(result);
          return result;
        },
        _compareIds: function (el, ids) {
          var elAttr = el.getAttribute('data-id'),
          elIds,
          number,
          returnValue = false;
          if (elAttr == null)
          return true;
          elIds = elAttr.split(',');
          $.each(elIds, function (i, value) {
            number = parseInt(value);
            if (ids.indexOf(number) != - 1) {
              returnValue = true;
              return false;
            }
          });
          return returnValue;
        },
        _thatType: function (el, type) {
          var isGold = el.getAttribute('class').match('gold') != null;
          if (type == 'silver')
          return !isGold;
           else if (type == 'gold')
          return isGold;
           else
          return true;
        },
        showJobs: function (type, ids) {
          var that = this;
          if (!ids.length) {
            if (type == 'silver') {
              that.$('.gold').hide();
              that.$('.silver').show();
              that.$('.mixed').show();
            } else if (type == 'gold') {
              that.$('.gold').show();
              that.$('.silver').hide();
              that.$('.mixed').show();
            } else
            that.showAll();
          } else {
            that.DOM.children().each(function () {
              if (that._compareIds(this, ids) && that._thatType(this, type)) {
                this.style.display = '';
                return;
              }
              this.style.display = 'none';
            });
          }
        },
        showAll: function () {
          this.$('.gold').show();
          this.$('.silver').show();
          this.$('.mixed').show();
        },
        clear: function () {
          this.DOM.empty();
          this.addOneself();
        }
      },
      List: {
        $: function (selector) {
          return $(selector, this.DOM);
        },
        list: new west.gui.Table().addColumn('jobs_list').appendToCell('head', 'jobs_list', DJlang.dx_jobs_list).setId('tws_dj_list'),
        init: function () {
          var that = this,
          cont = $('<div id="tws_dj_sort"></div>'),
          range = $('<cite title="' + DJlang.dx_sort_distance + '">' + DJlang.distance + '</cite>').click(function () {
            that.sortBy('range');
          }),
          abc = $('<cite title="' + DJlang.dx_sort_name + '</cite>').click(function () {
            that.sortBy('abc');
          });
          cont.append(range).append(' | ').append(abc);
          $('.row_head', this.list.getMainDiv()).append(cont);
          this.list.tbody.append('<b style=\'position: absolute; top: 25px; margin-left: -64px; left: 50%\'></b>');
          return this.list.getMainDiv();
        },
        sort: function (by) {
          this.sortBy(TWS.DeluxeJobs.getGUI().sort_by);
        },
        sortBy: function (by) {
          if (by == 'range')
          tinysort(this.$('.tw2gui_scrollpane_clipper_contentpane').children(), '.tws_dj_job_range');
           else
          tinysort(this.$('.tw2gui_scrollpane_clipper_contentpane').children(), '.tws_dj_job_name');
          TWS.DeluxeJobs.getGUI().sort_by = by;
        },
        addJob: function (job_obj, pos) {
          var job = JobList.getJobById(job_obj.id),
          range = Map.calcWayTime(Character.position, pos).formatDuration(),
          name = job.name.length > 20 ? job.name.replace(job.name.substr(18, job.name.length), '..')  : job.name;
          var result = $('<div class="tws_dj_job_block ' + job_obj.type + '" data-id="' + job_obj.id + '"></div>').append($('<div class="tws_dj_job_centermap" title="' + DJlang.dx_show_on_map + '"></div>').click(function () {
            Map.center(pos.x, pos.y);
          })).append($('<div class="tws_dj_job_start" title="' + DJlang.work_out + '"></div>').click(function () {
            JobWindow.startJob(job_obj.id, pos.x, pos.y, 15);
          })).append($('<div class="tws_dj_job_ico" title="' + DJlang.open_job + '" style="background: url(' + to_cdn('images/jobs/') + job.shortname + '.png) no-repeat;"></div>').click(function () {
            Map.JobHandler.openJob(job_obj.id, pos);
          }).append('<img style="width: 87px; height: 87px;" src="' + (job_obj.type == 'gold' ? to_cdn('images/jobs/featured/goldjob.png')  : to_cdn('images/jobs/featured/silverjob.png')) + '"></img>')).append('<div class="tws_dj_job_info"><p class="tws_dj_job_range">' + DJlang.distance + ': ' + range + '</p><p class="tws_dj_job_name" title="<b>' + job.name + '</b>">' + name + '</p></div>');
          this.list.appendRow(result);
          return result;
        },
        scrollToTop: function () {
          this.list.$('.tw2gui_scrollbar_pulley').css('top', '0px');
          this.list.$('.tw2gui_scrollpane_clipper_contentpane').css('top', '0px');
        },
        _compareIds: function (el, ids) {
          var elAttr = el.getAttribute('data-id');
          if (ids.indexOf(parseInt(elAttr)) != - 1)
          return true;
          return false;
        },
        _thatType: function (el, type) {
          var isGold = el.getAttribute('class').match('gold') != null;
          if (type == 'silver')
          return !isGold;
           else if (type == 'gold')
          return isGold;
           else
          return true;
        },
        showJobs: function (type, ids) {
          var that = this;
          this.scrollToTop();
          if (!ids.length) {
            if (type == 'silver') {
              that.list.$('.gold').parent().hide();
              that.list.$('.silver').parent().show();
            } else if (type == 'gold') {
              that.list.$('.gold').parent().show();
              that.list.$('.silver').parent().hide();
            } else
            that.showAll();
          } else {
            that.$('.tws_dj_job_block').each(function () {
              if (that._compareIds(this, ids) && that._thatType(this, type)) {
                this.parentNode.style.display = '';
                return;
              }
              this.parentNode.style.display = 'none';
            });
          }
        },
        showAll: function () {
          this.list.$('.gold').parent().show();
          this.list.$('.silver').parent().show();
        },
        clear: function () {
          this.list.clearBody();
        }
      }
    },
    '#tws_dj { padding: 10px;  }\n' +
    '#tws_dj_sort { float: right; font-weight: normal; }\n' +
    '#tws_dj_sort cite { cursor: pointer; font-size: 10px; }\n' +
    '#tws_dj_loader { width: 700px; height: 362px; position: absolute; top: 5px; left: -3px; }\n' +
    '#tws_dj_loader_fade { position: absolute; z-index: 3; background: #fff; height: 362px; width: 100%; opacity: 0.5; border-radius: 5px;}\n' +
    '#tws_dj_loader .tw2gui_progressbar { z-index: 3; top: 50px; width: 70%; margin: 0 auto; }\n' +
    '.tws.premium-buy .tw2gui_inner_window_bg2 { background-repeat: repeat-y; }\n' +
    '#tws_dj_control { width: 56%; border: 1px solid #000; float: left; background: rgba(0,0,0,.1); padding: 7px; margin-top:85px; margin-left: 5px; }\n' +
    '#tws_dj_control .tw2gui_checkbox { float: left; clear: left; margin-bottom: 2px; }\n' +
    '#tws_dj_control .tw2gui_button { width: 50%; margin-top: 14px; margin-left: 50px; }\n' +
    '#tws_dj_list { width: 285px; right: -2px; position: absolute; top: 5px; }\n' +
    '#tws_dj_list .tw2gui_scrollpane { height: 290px; }\n' +
    '#tws_dj_list .row { height: 89px; margin-bottom: -6px; margin-top: -4px; background: transparent; }\n' +
    '.tws_dj_job_block { height: 73px; margin: 5px; float: left; }\n' +
    '.tws_dj_job_ico { width: 67px; height: 67px; float: left; position: relative; cursor: pointer; }\n' +
    '.tws_dj_job_ico img { position: relative; top: -13px; left: -10px; }\n' +
    '.tws_dj_job_centermap { background: url(' + to_cdn('images/map/icons/instantwork.png') + '); width: 20px; height: 20px; cursor: pointer; position: absolute; left: 45px; z-index: 1; }\n' +
    '.tws_dj_job_start { width: 20px; height: 20px; cursor: pointer; position: absolute; left: 45px; top: 46px; position: absolute; z-index: 1; background-image: url(' + to_cdn('images/map/icons/instant-work-1.png') + '); }\n' +
    '.tws_dj_job_start:hover { background-image: url(' + to_cdn('images/map/icons/instant-work-1_hover.png') + '); background-position: -2px -2px; }\n' +
    '.tws_dj_job_info { float: left; background: url(' + to_cdn('images/interface/tasks/time.png') + ') no-repeat; width: 200px; margin-left: -30px; margin-top: 5px; }\n' +
    '.tws_dj_job_info p { margin-left: 30px; margin-top: -4px; }\n' + '.tws_dj_job_name { margin-top: -5px; }\n' + '#tws_dj_filter { float: left; position: absolute; margin-top: 195px; }\n' +
    '#tws_dj_filter_input { z-index: 2; }\n' +
    '#tws_dj_filter_input.minimized #container { width: 387px; height: 26px; }\n' +
    '#tws_dj_filter_input #container { min-width: 387px; min-height: 26px; max-height:142px; overflow: hidden; }\n' +
    '.tws_dj_icon { background: url(https://www.the-west.ru/images/tw2gui/iconset.png); width: 16px; height: 16px; position: absolute; }\n' +
    '#tws_dj_help { background-position: -67px -64px; top: 254px; left: 224px; cursor: help;}\n' +
    '.tws_dj_mark { position: absolute; width: 4px; height: 4px; border-radius: 3px; border: 1px solid #fff; }\n' +
    '.tws_dj_mark.gold { background-color: rgb(255,215,0); }\n' +
    '.tws_dj_mark.silver { background-color: silver; }\n' +
    '.tws_dj_mark.my_pos { background-color: blue; width: 6px; height: 6px; }\n' +
    '.tws_dj_mark.focus { background-color: black; width: 6px; height: 6px; border-radius: 4px; margin-left: -1px; margin-top:-1px; }\n' +
    '#tws_dj_map { background: url(images/map/minimap/worldmap_500.jpg) no-repeat; width: 416px; height: 183px; background-size: contain; cursor: pointer; float:left; margin-top: 9px;}');
  });
});
