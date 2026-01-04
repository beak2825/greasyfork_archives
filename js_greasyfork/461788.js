// ==UserScript==
// @name           AuthorTodayBlackList
// @name:ru        AuthorTodayBlackList
// @namespace      90h.yy.zz
// @version        0.14.0
// @author         Ox90
// @match          https://author.today/*
// @description    The script implements the black list of authors on the author.today website.
// @description:ru Скрипт реализует черный список авторов на сайте author.today.
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/461788/AuthorTodayBlackList.user.js
// @updateURL https://update.greasyfork.org/scripts/461788/AuthorTodayBlackList.meta.js
// ==/UserScript==

/**
 * TODO list
 * - Поменять иконку черного списка в профиле автора на что-нибудь более подходящее и заметное
 * - Добавить возможность скрытия книг автора в виджетах, если скрытие возможно
 * - Адаптация к мобильной версии сайта
 */

(function start() {
  "use strict";

/**
 * Старт скрипта сразу после загрузки DOM-дерева.
 *
 * Тут настраиваются стили, инициируется объект для текущей страницы,
 * устанавливается отслеживание измерений страницы скриптами сайта
 * и настраивается перехват кликов по плашкам.
 *
 * @return void
 */
function start() {
  addStyle("body.atbl-debug .atbl-handled { border:1px solid red !important; }"); // Для целей отладки
  addStyle(".atbl-badge { position:absolute; display:flex; align-items:center; justify-content:center; bottom:10px; right:10px; width:58px; height:58px; text-align:center; border:4px solid #333; border-radius:50%; background:#aaa; box-shadow:0 0 8px white; z-index:3; }");
  addStyle(".atbl-badge span { display:inline-block; color:#400; font:24px Roboto,tahoma,sans-serif; font-weight:bold; }");
  addStyle(".atbl-profile-notes { color:#fff; font-size:15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-shadow:1px 1px 3px rgba(0,0,0,.8); }");
  addStyle(".atbl-profile-notes i { margin-right:.5em; }");
  addStyle(".atbl-book-banner { position:absolute; bottom:0; left:0; right:0; height:30%; color:#fff; font-weight:bold; background-color:rgba(40,40,40,.95); border:2px ridge #666; z-index:100; }");
  addStyle(".atbl-fence-block { position:absolute; top:0; left:0; width:100%; height:100%; overflow:hidden; z-index:99; cursor:pointer; transition:all 500ms cubic-bezier(.7,0,0.08,1); }");
  addStyle(".atbl-fence-block .atbl-note { display:flex; min-height:30%; padding:.5em; color:#fff; font-weight:bold; font-size:150%; align-items:center; justify-content:center; background-color:#282828; border:2px ridge #666; opacity:.92 }");
  addStyle(".atbl-book-banner, .atbl-fence-block, .atbl-button-container, .atbl-titled-element { display:flex; align-items:center; justify-content:center; }");
  addStyle(".book-row>.atbl-fence-block.atbl-open, tr>.atbl-fence-block.atbl-open, .profile-card>.atbl-fence-block.atbl-open { left:95%; }");
  addStyle(".bookcard>.atbl-fence-block.atbl-open { top:-85%; }");
  addStyle(".bookcard.atbl-marked { overflow-y:hidden; }");
  addStyle(".profile-card.atbl-marked, .collection-work-list, aside-widget>.panel { overflow-x:clip; }");
  addStyle("tr.atbl-marked { position:relative; }");
  addStyle(".book-row>.atbl-fence-block .atbl-note { min-width:30%; }");
  addStyle(".atbl-marked .ribbon, .atbl-marked .bookcard-discount { display:none; }");
  addStyle(".slick-list>.slick-track { display:flex; }");
  addStyle(".slick-list>.slick-track .bookcard, book { height:auto; }");
  addStyle(".book-shelf.book-row { align-items:normal; }");
  addStyle(".atbl-tab-content { display:none; margin-top:15px; }");
  addStyle(".atbl-tab-content.active { display:block; }");
  addStyle(".atbl-table { display:table; empty-cells:show; margin:15px 0; width:100%; border:1px solid #ddd; border-radius:4px; }");
  addStyle(".atbl-table-header { display:table-header-group; font-weight:bold; background-color:#eee; }");
  addStyle(".atbl-table-body { display:table-row-group; }");
  addStyle(".atbl-table-row { display:table-row; }");
  addStyle(".atbl-table-body .atbl-table-row { cursor:pointer; }");
  addStyle(".atbl-table-body .atbl-table-row:hover { background-color:#eef; }");
  addStyle(".atbl-table-cell { display:table-cell; padding:.3em .5em; }");
  addStyle(".atbl-table-cell:not(:last-child) { border-right:1px solid #ddd; }");
  addStyle(".atbl-table-body .atbl-table-cell { border-top:1px solid #ddd; }");
  addStyle(".atbl-tab-content p { margin:0; }");
  addStyle(".atbl-tab-content legend { font-size:130%; }");
  addStyle(".atbl-tab-content fieldset form { display:flex; flex-direction:column; row-gap:1em; align-items:start; }");
  addStyle(".atbl-button-container { column-gap:16px; margin-top:24px; }");
  addStyle(".atbl-button-container button { min-width:8em; }");
  addStyle("#search-results .book-row.atbl-marked .atbl-fence-block { top:-10px; }");
  addStyle(".collection-work-list .book-row .atbl-fence-block { top:-14px; height:unset; bottom:6px; }");
  addStyle(".work-widget-list .book-row .atbl-fence-block { top:-6px; }");
  addStyle(".atbl-titled-element { column-gap:1em; }");
  addStyle(".atbl-settings-row { display:flex; column-gap:2em; flex-wrap:wrap; }");

  let page = null;

  function getPageName() {
    const path = document.location.pathname;
    if (path === "/" || path === "/what-to-listen-to") return "main";
    if (path === "/search") return "search";
    if (path.startsWith("/account/") || (path.startsWith("/u/") && path.endsWith("/edit"))) return "account";
    if (path.startsWith("/u/")) {
      if ([
        "/library", "/library/reading", "/library/saved", "/library/finished", "/library/", "/library/all",
        "/library/", "/library/marks", "/library/purchased", "/library/disliked"
      ].some(ps => path.endsWith(ps))) return "library";
      return "profile";
    }
    if (path.startsWith("/work/genre/") || path.startsWith("/work/recommended/") || path.startsWith("/work/discounts/")) return "categories";
    if (path.startsWith("/top/writers") || path.startsWith("/top/users")) return "users";
    if (path.startsWith("/collection/")) return "collection";
    if ([ "/contests", "/work/", "/review/", "/post/" ].some(ps => path.startsWith(ps))) return "general";
    return "unknown";
  }

  function updatePageInstance() {
    const pname = getPageName();
    if (!page || page.name !== pname) page = Page.byName(pname);
    page && page.update();
  }

  function tuneAjaxContainer() {
    // Отслеживание изменения главного контейнера страницы сайта
    // на случай обновления страницы через AJAX запрос.
    // Все потомки не отслеживаются, только изменение списка детей.
    let ajax_box = document.getElementById("pjax-container");
    if (ajax_box) {
      (new MutationObserver(function() {
        updatePageInstance();
      })).observe(ajax_box, { childList: true });
      // Скрытие плашки по клику
      ajax_box.addEventListener("click", function(event) {
        let fence = event.target.closest(".atbl-fence-block");
        fence && fence.classList.toggle("atbl-open");
      });
    }
  }

  function updateFenceColors(color1, color2, opacity1, opacity2) {
    // Удалить старую запись стилей
    const element_id = "atbl-fence_styles";
    const css_el = document.getElementById(element_id);
    css_el && css_el.remove();
    // Создать новые стили для плашки
    let c1 = hexToRgb(color1);
    let c2 = hexToRgb(color2);
    let o1 = parseFloat(opacity1) || 0;
    let o2 = parseFloat(opacity2) || 0;
    let selector = ".atbl-fence-block";
    addStyle(
      `${selector} { background-image:repeating-linear-gradient(-45deg,rgba(${c1},${o1}) 0 10px,rgba(${c2},${o2}) 10px 20px); }`,
      element_id
    );
  }

  // Установка наблюдателя за изменением настроек оформления
  (new BroadcastChannel("colors-changed")).addEventListener("message", (message) => {
    updateFenceColors(message.data[0], message.data[1], message.data[2], message.data[3]);
  });

  // Запрос основных настроек скрипта
  (async () => {
    // Обрамление обработанных блоков на странице
    if (await DB.getSetting("debug.handled", false)) {
      document.body.classList.add("atbl-debug");
    }
    // Цвета плашки
    const color1 = await DB.getSetting("book.fence.color1", "#000000");
    const color2 = await DB.getSetting("book.fence.color2", "#000000");
    const opacity1 = await DB.getSetting("book.fence.opacity1", .3);
    const opacity2 = await DB.getSetting("book.fence.opacity2", .2);
    updateFenceColors(color1, color2, opacity1, opacity2);
    // Идентификация и обновление страницы
    updatePageInstance();
    tuneAjaxContainer();
  })();
}

//----------------------------
//---------- Классы ----------
//----------------------------

/**
 * Класс общего назначения, для создания общих HTML-элементов
 */
class HTML {

  /**
   * Создает единичный элемент типа checkbox со стилями сайта
   *
   * @param title   string Подпись для checkbox
   * @param name    string Значение атрибута name у checkbox
   * @param checked bool   Начальное состояние checkbox
   *
   * @return Element HTML-элемент для последующего добавления на форму
   */
  static createCheckbox(title, name, checked) {
    let root = document.createElement("div");
    root.classList.add("checkbox", "c-checkbox", "no-fastclick");
    let label = document.createElement("label");
    root.appendChild(label);
    let input = HTML.createInputElement("checkbox", name);
    checked && (input.checked = true);
    label.appendChild(input);
    let span = document.createElement("span");
    span.classList.add("icon-check-bold");
    label.appendChild(span);
    label.appendChild(document.createTextNode(title));
    return root;
  }

  /**
   * Создает единичный элемент select с опциями для выбора со стилями сайта
   *
   * @param name    string Имя элемента для его идентификации в DOM-дереве
   * @param options array  Массив объектов с параметрами value и text
   * @param value   string Начальное значение выбранной опции
   *
   * @return Element HTML-элемент для последующего добавления на форму
   */
  static createSelectbox(name, options, value) {
    let el = document.createElement("select");
    el.classList.add("form-control");
    el.name = name;
    options.forEach(function(it) {
      let oel = document.createElement("option");
      oel.value = it.value;
      oel.textContent = it.text;
      el.appendChild(oel);
    });
    el.value = value;
    return el;
  }

  /**
   * Создает кнопку submit с заданными свойствами со стилями сайта
   *
   * @param name string Имя кнопки
   * @param text string Текст кнопки
   * @param type string Тип кнопки
   *
   * @return Element HTML-элемент кнопки
   */
  static createSubmitButton(name, text, type) {
    if (!type) type = "default";
    let btn = document.createElement("button");
    btn.type = "submit";
    btn.name = name;
    btn.classList.add("btn", "btn-" + type);
    btn.textContent = text;
    return btn;
  }

  /**
   * Создает элемент для выбора цвета
   *
   * @param title string Надпись рядом с элементом
   * @param name  string Имя элемента
   * @param value string Предустановленный цвет в формате #xxyyzz
   *
   * @return Element HTML-элемент
   */
  static createColorPicker(title, name, value) {
    return HTML.createTitledElement(HTML.createInputElement("color", name, value), title);
  }

  /**
   * Создает элемент выбора значения из диапазона
   *
   * @param title string Надпись рядом с элементом
   * @param name  string Имя элемента
   * @param value nubmer Текущее значение
   * @param min   number Минимальное допустимое значение
   * @param max   number Максимальное допустимое значение
   *
   * @return Element HTML-элемент
   */
  static createRangeElement(title, name, value, min, max) {
    const input = HTML.createInputElement("range", name, value);
    input.min = min;
    input.max = max;
    return HTML.createTitledElement(input, title);
  }

  /**
   * Создает стандартный элемент input с указанными параметрами
   *
   * @param type  string Тип элемента
   * @param name  string Имя элемента
   * @param value mixed  Текущее значение элемента (не обязательно)
   *
   * @return Element HTML-элемент
   */
  static createInputElement(type, name, value) {
    const input = document.createElement("input");
    input.id = name;
    input.type = type;
    input.name = name;
    if (value !== undefined) input.value = value;
    return input;
  }

  /**
   * Добавляет переданному элементу текстовую надпись и возвращает новый элемент
   *
   * @param element Element HTML-элемент
   * @param title   string  Надпись для элемента
   *
   * @return Element HTML-элемент
   */
  static createTitledElement(element, title) {
    const div = document.createElement("div");
    div.classList.add("atbl-titled-element");
    div.appendChild(element);
    const label = document.createElement("label");
    label.setAttribute("for", element.id);
    label.textContent = title;
    div.appendChild(label);
    return div;
  }
}

/**
 * Экземпляр класса для работы с базой данных браузера (IndexedDB)
 * Все методы класса работают в асинхронном режиме
 */
let DB = new class {
  constructor() {
    this._dbh = null;
  }

  /**
   * Получение общего количества записей о пользователях
   *
   * @return Promise Промис с количеством записей
   */
  usersCount() {
    return new Promise(function(resolve, reject) {
      this._ensureOpen().then(function(dbh) {
        let req = dbh.transaction("users", "readonly").objectStore("users").count();

        req.onsuccess = function() {
          resolve(req.result);
        }

        req.onerror = function() {
          reject(req.error);
        }
      }).catch(function(err) {
        reject(err);
      });
    }.bind(this));
  }

  /**
   * Получение данных о пользователе по его nick, если он сохранен в базе данных
   *
   * @param user User Экземпляр класса пользователя, по которому необходимо сделать запрос
   *
   * @return Promise Промис с данными пользователя или undefined в случае отсутствия его в базе
   */
  fetchUser(user) {
    return new Promise(function(resolve, reject) {
      this._ensureOpen().then(function(dbh) {
        let req = dbh.transaction("users", "readonly").objectStore("users").get(user.nick);

        req.onsuccess = function() {
          resolve(req.result);
        }

        req.onerror = function() {
          reject(req.error);
        }
      }).catch(function(err) {
        reject(err);
      });
    }.bind(this));
  }

  /**
   * Сохранение данных пользователя в базе данных. Если запись не существует, она будет добавлена.
   * Ключом является nick пользователя
   *
   * @param user User Экземпляр класса пользователя, данные которого нужно сохранить
   *
   * @return Promise Промис, который не возвращает никаких данных, но гарантирующий, что данные сохранены
   */
  updateUser(user) {
    return new Promise(function(resolve, reject) {
      this._ensureOpen().then(function(dbh) {
        let ct = new Date();
        let req = dbh.transaction("users", "readwrite").objectStore("users").put({
          nick: user.nick,
          fio: user.fio,
          notes: user.notes,
          b_action: user.b_action,
          lastUpdate: ct
        });

        req.onsuccess = function() {
          user.lastUpdate = ct;
          resolve();
        };

        req.onerror = function() {
          reject(req.error);
        };
      }).catch(function(err) {
        reject(err);
      });
    }.bind(this));
  }

  /**
   * Удаляет запись пользователя из базы данных. Ключом является nick пользователя
   *
   * @param user User Экземпляр класса пользователя, которого нужно удалить
   *
   * @return Promise Промис, который не возвращает никаких данных, но гарантирующий, что запись удалена
   */
  deleteUser(user) {
    return new Promise(function(resolve, reject) {
      this._ensureOpen().then(function(dbh) {
        let req = dbh.transaction("users", "readwrite").objectStore("users").delete(user.nick);

        req.onsuccess = function() {
          resolve();
        };

        req.onerror = function() {
          reject.req(req.error);
        };
      }).catch(function(err) {
        reject(err);
      });
    }.bind(this));
  }

  /**
   * Возвращает список пользователей из базы данных
   *
   * @param count  number Максимальное количество записей. По умолчанию: 20. Отрицательное - без ограничений
   * @param offset number Сколько записей нужно пропустить перед началом выборки. По умолчанию: 0
   *
   * @return Promise Промис результатом
   */
  usersList(count, offset) {
    return new Promise(function(resolve, reject) {
      this._ensureOpen().then(function(dbh) {
        let res = [];
        let offs = 0;
        let cursor = null;
        if (!count) count = 20;

        let req = dbh.transaction("users", "readonly").objectStore("users").openCursor();

        req.addEventListener("success", event => {
          let cursor = event.target.result;
          if (!cursor) {
            resolve(res);
            return;
          }
          if (offset) {
            offs = offset;
            offset = 0;
          } else {
            res.push(cursor.value);
            if (!(--count)) {
              resolve(res);
              return;
            }
          }
          if (offs) cursor.advance(offs);
          else cursor.continue();
          offs = 0;
        });

        req.addEventListener("error", err => {
          reject(err);
        });
      }).catch(function(err) {
        reject(err);
      });
    }.bind(this));
  }

  /**
   * Читает значение настроек из базы данных
   *
   * @param key    string Имя настройки
   * @param defval mixed  Будет возвращено, если запись отсутствует
   *
   * @return Promise Промис со значением
   */
  getSetting(key, defval) {
    return new Promise((resolve, reject) => {
      this._ensureOpen().then(dbh => {
        let req = dbh.transaction("settings", "readonly").objectStore("settings").get(key);


        req.addEventListener("success", event => {
          let res = event.target.result;
          resolve(res !== undefined ? res : defval);
        });

        req.addEventListener("error", err => reject(err));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Сохраняет настройку в базе данных
   *
   * @param key   string Имя настройки
   * @param value mixed  Значение настройки
   *
   * @return Promise Промис что все сохранено
   */
  updateSetting(key, value) {
    return new Promise((resolve, reject) => {
      this._ensureOpen().then(dbh => {
        let req = dbh.transaction("settings", "readwrite").objectStore("settings").put(value, key);

        req.addEventListener("success", event => resolve());
        req.addEventListener("error", err => resolve(err));
      }).catch(err => {
        reject(err);
      });
    });
  }

  /**
   * Гарантирует соединение с базой данных
   *
   * @return Promise Промис, который возвращает объект для работы с базой данных
   */
  _ensureOpen() {
    return new Promise(function(resolve, reject) {
      if (this._dbh) {
        resolve(this._dbh);
        return;
      }

      let req = indexedDB.open("atbl_main_db", 2);

      req.onsuccess = function() {
        this._dbh = req.result;
        resolve(this._dbh);
      }.bind(this);

      req.onerror = function() {
        reject(req.error);
      };

      req.onupgradeneeded = function(event) {
        let db = req.result;
        if (!db.objectStoreNames.contains("users")) {
          db.createObjectStore("users", { keyPath: "nick" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings");
        }
      };

      req.onblocked = function() {
        Notification.display("Обновление базы данных скрипта блокируется другой вкладкой", "warning");
      };
    }.bind(this));
  }
}();

/**
 * Класс для работы с данными автора или пользователя.
 */
class User {

  /**
   * Конструктор класса
   *
   * @param nick string Ник пользователя для идентификации
   * @param fio  string Фамилия, имя пользователя. Или что там записано. Не обязательно.
   *
   * @return void
   */
  constructor(nick, fio) {
    this.nick = nick;
    this.fio = fio || "";
    this.empty = true;
    this._requests = [];
    this._init();
  }

  /**
   * Обновляет данные пользователя из базы данных
   *
   * @return Promise Промис, гарантирует обновление полей пользователя
   */
  fetch() {
    if (!this._requests.length) {
      return DB.fetchUser(this).then(function(res) {
        if (res) {
          this._fillData(res);
        } else {
          this._init();
        }
        this._requests.forEach(req => req.resolve());
        this._requests = [];
      }.bind(this)).catch(function(err) {
        this._requests.forEach(req =>req.reject(err));
        this._requests = [];
        throw err;
      }.bind(this));
    }

    return new Promise(function(resolve, reject) {
      this._requests.push({ resolve: resolve, reject: reject });
    }.bind(this));
  }

  /**
   * Сохраняет текущие данные пользователя в базу данных
   *
   * @return Promise Промис, гарантирует обновление данных
   */
  async save() {
    await DB.updateUser(this);
    this.empty = false;
  }

  /**
   * Удаляет пользователя из базы данных
   *
   * @return Promise Промис, гарантирующий удаление данных пользователя
   */
  async delete() {
    await DB.deleteUser(this);
    this._init();
  }

  /**
   * Возвращает первую строчку заметки с вырезанными пробельными символами слева и справа
   *
   * @param note string Оригинальная строка заметки
   *
   * @return string
   */
  shortNote() {
    if (!this.notes || !this.notes.text) return;
    let ntxt = this.notes.text;
    let eoli = ntxt.indexOf("\n");
    if (eoli !== -1) ntxt = ntxt.substring(0, eoli).trim();
    return ntxt;
  }

  /**
   * Создает экземпляр класса User по переданным данным
   *
   * @param data object Данные пользователя
   *
   * @return User
   */
  static fromObject(data) {
    let usr = new User(data.nick);
    usr._fillData(data);
    return usr;
  }

  /**
   * Инициализация свойств начальными значениями
   *
   * @return void
   */
  _init() {
    this.notes = null;
    this.b_action = null;
    this.lastUpdate = null;
    this.empty = true;
  }

  /**
   * Заполняет экземпляр с переданных данных
   *
   * @param data object Объект с данными, обычно из БД
   *
   * @return void
   */
  _fillData(data) {
    this.notes = data.notes || {};
    this.lastUpdate = data.lastUpdate;
    this.b_action = data.b_action;
    if (!this.fio) this.fio = data.fio;
    this.empty = false;
  }
}

/**
 * Класс реализует список пользователей
 */
class UserList extends Array {

  /**
   * Получает список пользователей из базы данных и возвращает экземпляр списка
   *
   * @param count  number Максимальное количество записей. Необязательное значение. По умолчанию: 20.
   * @param offset number Смещение начала выборки записей. Необязательное значение. По умолчанию: 0.
   *
   * @return Promise Промис с экземпляром списка пользователей
   */
  static async fetch(count, offset) {
    let res = new UserList();
    await DB.usersList(count, offset).then(list => {
      list.forEach(d => res.push(User.fromObject(d)));
    });
    return res;
  }
}

/**
 * Класс для работы со списком пользователей в режиме кэша.
 * Предназначен для того, чтобы избежать дублирование запросов к базе данных.
 * Расширяет стандартный класс Map.
 */
class UserCache extends Map {

  /**
   * Асинхронный метод для получения гарантии наличия пользователей в кэше, которые, при необходимости, загружаются из БД
   *
   * @param ids array Массив идентификаторов пользователей (nick) для которых необходимы данные
   *
   * @return Promise Промис, гарантирующий, что все данные о переданных пользователях находятся в кэше
   */
  async ensure(ids) {
    let p_list = ids.reduce(function(res, id) {
      if (!this.has(id)) {
        let user = new User(id);
        this.set(id, user);
        res.push(user.fetch());
      }
      return res;
    }.bind(this), []);
    if (p_list.length) {
      await Promise.all(p_list);
    }
  }
}

/**
 * Базовый класс манипуляций с виджетами страниц сайта
 */
class Page {
  constructor() {
    this.name = null;
    this.users = new UserCache();
    this._widgets = [];
    this._channel = new BroadcastChannel("user-updated");
    this._channel.onmessage = event => {
      this._widgets.forEach(w => w.userUpdated(event.data));
      this._userUpdated(event.data);
    };
  }

  /**
   * Метод для запуска обновлений всех виджетов на странице
   *
   * @return void
   */
  update() {
    this._widgets.forEach(w => w.update());
  }

  /**
   * Этот метод будет вызван в случае изменения данных какого-нибудь автора в другой вкладке
   * Применяется в контексте страницы
   *
   * @param nick string Ник обновленного пользователя
   *
   * @return void
   */
  _userUpdated(nick) {
  }

  /**
   * Метод-фабрика для получения экземпляра страницы по ее имени
   *
   * @param name string Имя страницы
   *
   * @return Page
   */
  static byName(name) {
    switch (name) {
      case "main":
        return new MainPage();
      case "account":
        return new AccountPage();
      case "profile":
        return new ProfilePage();
      case "categories":
        return new CategoriesPage();
      case "users":
        return new UsersPage();
      case "search":
        return new SearchPage();
      case "collection":
        return new CollectionPage();
      case "general":
        return new GeneralPage();
      case "library":
        return new LibraryPage();
    }
  }
}

/**
 * Базовый класс для различных информационных блоков сайта типа книжной полки и списка авторов
 * На одной странице может присутствовать несколько виджетов
 */
class Widget {
  constructor(element) {
    this.element = element;
  }

  /**
   * Базовая реализация для обновления виджета
   *
   * @return void
   */
  update() {
  }

  /**
   * Этот метод будет вызван в случае изменения данных какого-нибудь автора в другой вкладке
   * Применяется в контексте виджета
   *
   * @param nick string Ник обновленного пользователя
   *
   * @return void
   */
  userUpdated(nick) {
  }
}

/**
 * Базовая реализация класса виджета, контейнер которого может быть обновлен отдельно,
 * через отдельный AJAX запрос. Обычно такое происходит при смене параметров фильтра.
 */
class AjaxWidget extends Widget {

  /**
   * Конструктор класса
   *
   * @param element Element HTML-элемент контейнера виджета
   * @param watch   bool    Нужно ли оставлять наблюдатель после первой загрузки данных
   * @param deep    bool    Нужно ли отслеживать потомков
   *
   * return void
   */
  constructor(element, watch, deep) {
    super(element);
    this._watch = watch;
    this._deep = deep;
    this._observed = false;
  }

  /**
   * Во время обновления виджета при необходимости на основной элемент вешается наблюдатель
   * Будет ли он висеть постоянно или будет отключен после заполнения виджета,
   * зависит от флага watch, переданного в конструктор
   *
   * @return void
   */
  update() {
    const ready = this._isReady();
    if (ready) {
      // Сканировать и обновить панель
      this._updatePanel();
      super.update();
    }
    if (!this._observed && (!ready || this._watch)) {
      // Установить наблюдатель
      this._observed = true;
      (new MutationObserver(function(mutations, observer) {
        if (this._isReady()) {
          if (!this._watch) observer.disconnect();
          this._updatePanel();
        }
      }.bind(this))).observe(this.element, { childList: true, subtree: this._deep });
    }
  }

  /**
   * Проверяет готов ли виджет для обновления
   *
   * @return bool
   */
  _isReady() {
    return !this.element.querySelector(".overlay");
  }

  /**
   * Код для фактическогое обновления виджета в результате вызова метода update
   * или срабатывания наблюдателя в момент завершения заполнения виджета данными
   *
   * @return void
   */
  _updatePanel() {
  }
}

/**
 * Реализация AJAX виджета-контейнера, который сам содержит виджеты
 */
class AjaxContainer extends AjaxWidget {

  /**
   * Конструктор класса
   *
   * @param element Element HTML-элемент контейнера виджета
   * @param wparams Array   Массив пар виджет-селектор, которые будут отображаться в контейнере
   *
   * @return void
   */
  constructor(element, wparams) {
    super(element, true, false);
    this._widgets = [];
    this._selectors = [];
    wparams.forEach(it => {
      this._widgets.push(it[0]);
      this._selectors.push(it[1]);
    });
  }

  userUpdated(nick) {
    this._widgets.forEach(w => w.userUpdated(nick));
  }

  _isReady() {
    return true;
  }

  _updatePanel() {
    this._widgets.forEach((w, i) => {
      w.element = this.element.querySelector(this._selectors[i]);
      w.element && w.update();
    });
  }
}

/**
 * Отображение обычной книжной полки с учетом раскладки
 */
class BookShelfWidget extends AjaxWidget {

  /**
   * Конструктор класса
   *
   * @param element Element HTML-элемент виджета
   * @param params  object  Параметры для управления виджетом
   */
  constructor(element, params) {
    super(element, params.watch || false, false);
    this._users = params.users || new UserCache();
    this._layout = params.layout || {};
  }

  /**
   * Извлекает из панели список авторов, проверяет их настройки и обновляет блок с книгами
   *
   * @return void
   */
  _updatePanel() {
    this._layout.name = this._getLayout();
    if (!this._layout.name) return;

    const query = this._layout[this._layout.name];
    if (!query) return;

    const authors = BookElement.getAuthorList(this.element);
    if (!authors.length) return;

    this._users.ensure(authors).then(() => {
      try {
        // Получить элементы книг и обработать их
        let books = this.element.querySelectorAll(query + ":not(.atbl-handled)");
        if (books.length) {
          books.forEach(be => {
            let book = this._getBook(be);
            switch (this.getBookAction(book)) {
              case "mark":
                book.mark();
                break;
            }
            book.element.classList.add("atbl-handled");
          });
        }
      } catch(err) {
        Notification.display(err.message, "error");
      }
    });
  }

  /**
   * Этот метод вызывается в случае изменения данных какого-нибудь автора в другой вкладке
   *
   * @param nick string Ник обновленного пользователя
   *
   * @return void
   */
  userUpdated(nick) {
    let user = this._users.get(nick);
    if (!user) return;

    if (!this._layout.name) return;

    const query = this._layout[this._layout.name];
    if (!query) return;

    user.fetch().then(() => {
      this.element.querySelectorAll(query + ".atbl-handled").forEach(be => {
        let book = this._getBook(be);
        if (!book.hasAuthor(nick)) return;
        switch(this.getBookAction(book)) {
          case "mark":
            book.mark();
            break;
          case "unmark":
            book.unmark();
            break;
        }
      });
    });
  }

  /**
   * Возвращает наименование раскладки книжной полки
   *
   * @return string Одно из следующих значений: 'list', 'grid', 'table' или undefined
   */
  _getLayout() {
    if (this._layout.selector) {
      const ico = (this.element || document).querySelector(this._layout.selector);
      if (ico) {
        switch (ico.getAttribute("class")) {
          case "icon-list":
            return "list";
          case "icon-grid":
            return "grid";
          case "icon-bars":
            return "table";
        }
      }
    }
    if (this._layout.default) return this._layout.default;
  }

  /**
   * Возвращает экземляр класса BookElement с учетом текущей раскладки книжной полки
   *
   * @param el Element HTML-элемент книги
   *
   * @return BookElement
   */
  _getBook(el) {
    switch (this._layout.name) {
      case "list":
        return new BookRowElement(el);
      case "grid":
        return new BookCardElement(el);
      case "table":
        return new BookTableElement(el);
    }
    return new BookElement(el);
  }

  /**
   * Возвращает строку с идентификатором действия для указанной книги
   *
   * @param book BookElement Экземпляр класса книги
   *
   * @return string Возможные значения: 'mark', 'unmark', 'none'
   */
  getBookAction(book) {
    if (book.authors.length) {
      if (book.authors.every(nick => this._users.get(nick).b_action === "mark")) {
        return "mark";
      }
      return "unmark";
    }
    return "none";
  }
}

/**
 * Книжная полка со спиннером загрузки.
 * Используется на заглавной странице сайта и в боковых виджетах.
 */
class SpinnerBookShelfWidget extends BookShelfWidget {
  _isReady() {
    return !this.element.querySelector(".widget-spinner");
  }
}

/**
 * Книжная полка в боковом виджете (рекомендации, скидки и т.п.)
 */
class AsideBookShelfWidget extends SpinnerBookShelfWidget {
  constructor(element, params) {
    super(element, params);
    this._deep = true;
  }

  _isReady() {
    return this.element.children.length && super._isReady() || false;
  }
}

/**
 * Виджет для отображение значка на аватаре пользователя, если это необходимо
 */
class ProfileAvatarWidget extends Widget {
  constructor(element, user) {
    super(element);
    this.user = user;
    this._badge = null;
  }

  update() {
    if (!this.user.b_action || this.user.b_action === "none") {
      if (this._badge) {
        this._badge.remove();
      }
      return;
    }

    if (!this._badge) this._createBadgeElement();
    if (!this.element.contains(this._badge)) {
      this.element.appendChild(this._badge);
    }
  }

  _createBadgeElement() {
    this._badge = document.createElement("div");
    this._badge.classList.add("atbl-badge");
    let span = document.createElement("span");
    span.appendChild(document.createTextNode("ЧС"));
    this._badge.appendChild(span);
  }
}

/**
 * Виджет для отображение заметок в профиле пользователя, если необходимо
 */
class ProfileNotesWidget extends Widget {
  constructor(element, user) {
    super(element);
    this.user = user;
    this._notes = null;
  }

  update() {
    if (this.user.notes && this.user.notes.profile && this.user.notes.text) {
      let ntxt = this.user.shortNote();
      if (!this._notes) {
        this._notes = document.createElement("div");
        this._notes.classList.add("atbl-profile-notes");
        let icon = document.createElement("i");
        icon.classList.add("icon-info-circle");
        this._notes.appendChild(icon);
        let span = document.createElement("span");
        span.appendChild(document.createTextNode(ntxt));
        this._notes.appendChild(span);
      } else {
        this._notes.querySelector("span").textContent = ntxt;
      }
      if (!this.element.contains(this._notes)) {
        this.element.appendChild(this._notes);
      }
    } else if (this._notes) {
      this._notes.remove();
    }
  }
}

/**
 * Виджет для добавления пункта меню в профиль пользователя
 */
class ProfileMenuWidget extends Widget {
  constructor(element) {
    super(element);
    this.menuItem = this._createMenuItem();
  }

  update() {
    this.element = document.querySelector("div.cover-buttons>ul.dropdown-menu");
    if (this.element && this.element.children.length) {
      if (this.menuItem && !this.element.contains(this.menuItem)) {
        this.element.appendChild(this.menuItem);
      }
    }
  }

  /**
   * Создает элемент меню, копируя стиль с первого элемента
   *
   * @return Element|null
   */
  _createMenuItem() {
    let item = this.element.children[0].cloneNode(true);
    let iitem = item.querySelector("i");
    let aitem = item.querySelector("a");
    let ccnt = iitem && aitem && aitem.childNodes.length || 0;
    if (ccnt < 2) return null;
    iitem.setAttribute("class", "icon-pencil mr");
    iitem.setAttribute("style", "margin-right:17px !important;");
    aitem.removeAttribute("onclick");
    aitem.childNodes[ccnt - 1].textContent = "AuthorTodayBlackList (ATBL)";
    return item;
  }
}

/**
 * Виджет с карточкой автора (как на странице с книгой)
 */
class UserCardWidget extends Widget {

  /**
   * Конструктор
   *
   * @param element Element HTML-элемент карточки
   * @param params  Object  Параметры виджета
   *
   * @return void
   */
  constructor(element, params) {
    super(element);
    this._users = params.users || new UserCache();
    this._card = new UserAsideElement(element);
  }

  update() {
    let nick = this._card.nick;
    if (!nick) return;
    this._users.ensure([ nick ]).then(() => {
      try {
        if (!this.element.classList.contains("atbl-handled")) {
          if (this._users.get(nick).b_action === "mark") {
            this._card.mark();
          }
          this.element.classList.add("atbl-handled");
        }
      } catch (err) {
        Notification.display(err.message, "error");
      }
    });
  }

  userUpdated(nick) {
    if (nick !== this._card.nick || !this.element.classList.contains("atbl-handled")) return;
    const user = this._users.get(nick);
    if (!user) return;
    user.fetch().then(() => {
      const card = new UserAsideElement(this.element);
      if (user.b_action === "mark") card.mark();
        else card.unmark();
    });
  }
}

/**
 * Виджет отображения списка пользователей в виде карточек
 */
class UsersWidget extends AjaxWidget {
  constructor(element, params) {
    super(element, params.watch, false);
    this._users = params.users || new UserCache();
  }

  userUpdated(nick) {
    let user = this._users.get(nick);
    if (!user) return;
    user.fetch().then(() => {
      let cards = this.element.querySelectorAll("div.profile-card.atbl-handled");
      for (let i = 0; i < cards.length; ++i) {
        let card = new UserElement(cards[i]);
        if (card.nick === nick) {
          if (user.b_action === "mark") card.mark();
            else card.unmark();
          break;
        }
      }
    });
  }

  _updatePanel() {
    // Получить список пользователей
    const authors = BookElement.getAuthorList(this.element);
    if (!authors.length) return;

    // Загрузить пользователей
    this._users.ensure(authors).then(() => {
      try {
        // Получить карточки пользователей и обработать их
        this.element.querySelectorAll("div.profile-card:not(.atbl-handled)").forEach(ce => {
          let card = new UserElement(ce);
          let nick = card.nick;
          if (nick && this._users.get(nick).b_action === "mark") {
            card.mark();
          }
          ce.classList.add("atbl-handled");
        });
      } catch(err) {
        Notification.display(err.message, "error");
      }
    });
  }
}

/**
 * Виджет для отображения параметров скрипта в настройках акканута
 */
class SettingsWidget extends Widget {
  constructor(element, channel) {
    super(element);
    this._channel = channel;
  }

  update() {
    if (this.element.classList.contains("atbl-handled")) return;
    // Создать основную панель
    let panel = document.createElement("div");
    panel.classList.add("panel", "panel-default");
    this.element.appendChild(panel);
    let header = document.createElement("div");
    header.classList.add("panel-heading");
    header.textContent = "Параметры скрипта AuthorTodayBlackList";
    panel.appendChild(header);
    let body = document.createElement("div");
    body.classList.add("panel-body");
    panel.appendChild(body);
    // Создать вкладки
    this._makeTabs(body);
    // Создать раздел настроек
    this._makeSettings(body);
    // Создать раздел со списком пользователей
    this._makeAuthorList(body);
    // Создать раздел импорта/экспорта данных
    this._makeImportExport(body);
    // Обработано
    this.element.classList.add("atbl-handled");
    // Активировать первую вкладку
    body.querySelector("ul.nav>li").dispatchEvent(new Event("click", { bubbles: true }));
  }

  userUpdated(nick) {
    let table = this.element.querySelector("div[data-name=authors] .atbl-table");
    table && table.dispatchEvent(new CustomEvent("user-updated", { detail: nick }));
  }

  /**
   * Создает элемент для отображения разделов параметров скрипта, со стилями оригинального сайта
   *
   * @param body_el Element HTML-элемент который станет родительским
   *
   * @return void
   */
  _makeTabs(body_el) {
    let div1 = document.createElement("div");
    div1.classList.add("panel-heading", "panel-nav");
    body_el.appendChild(div1);
    let div2 = document.createElement("div");
    div2.classList.add("nav-pills-v2");
    div1.appendChild(div2);
    let ul = document.createElement("ul");
    ul.classList.add("nav", "nav-pills", "pill-left", "ml-lg");
    div2.appendChild(ul);
    [
      [ "Настройки", "settings" ],
      [ "Список авторов", "authors" ],
      [ "Импорт/Экспорт", "imp-exp" ]
    ].forEach(it => {
      let li = document.createElement("li");
      li.dataset.target = it[1];
      ul.appendChild(li);
      let ae = document.createElement("a");
      ae.classList.add("nav-link");
      ae.setAttribute("href", "");
      ae.textContent = it[0];
      li.appendChild(ae);
    });
    ul.addEventListener("click", event => {
      let li = event.target.closest("li[data-target]");
      if (li) {
        event.preventDefault();
        ul.querySelectorAll("li[data-target]").forEach(ie => {
          let act = null;
          if (li === ie) {
            if (!ie.classList.contains("active")) act = "add";
          } else if (ie.classList.contains("active")) {
            act = "remove";
          }
          if (act) {
            ie.classList[act]("active");
            let tc = body_el.querySelector(".atbl-tab-content[data-name=" + ie.dataset.target + "]");
            tc && tc.classList[act]("active");
          }
        });
      }
    });
  }

  /**
   * Раздел с настройками скрипта
   *
   * @param body_el Element HTML-элемент виджета, где будет отображен раздел
   *
   * @return void
   */
  _makeSettings(body_el) {
    let div1 = document.createElement("div");
    div1.classList.add("atbl-tab-content");
    div1.dataset.name = "settings";
    body_el.appendChild(div1);
    this._makeDecorSettings(div1);
    this._makeDialogSettings(div1);
    this._makeDebugSettings(div1);
  }

  /**
   * Подраздел с настройками оформления
   *
   * @param parent Element Родительский элемент
   *
   * @return void
   */
  _makeDecorSettings(parent) {
    let fset = document.createElement("fieldset");
    parent.appendChild(fset);
    let lg = document.createElement("legend");
    lg.textContent = "Внешний вид";
    fset.appendChild(lg);
    let form = document.createElement("form");
    form.method = "post";
    fset.appendChild(form);
    let subtitle = document.createElement("b");
    subtitle.textContent = "Закрывающая плашка";
    form.appendChild(subtitle);
    let content = document.createElement("div");
    content.style.position = "relative";
    content.style.display = "flex";
    content.style.flexDirection = "column";
    content.style.alignItems = "center";
    content.style.justifyContent = "center";
    content.style.minWidth = "10em";
    content.style.minHeight = "6em";
    content.innerHTML =
      '<div style="color:#444;">Название книги</div><div style="color:#4582af;">Ссылка</div><div style="color:#9a938d">Авторы</div>';
    form.appendChild(content);
    let fence = document.createElement("div");
    fence.style.position = "absolute";
    fence.style.top = 0;
    fence.style.left = 0;
    fence.style.right = 0;
    fence.style.bottom = 0;
    content.appendChild(fence);
    subtitle = document.createElement("b");
    subtitle.textContent = "Настройки основного цвета закрывающей плашки";
    form.appendChild(subtitle);
    let row = document.createElement("div");
    row.classList.add("atbl-settings-row");
    form.appendChild(row);
    let color1 = HTML.createColorPicker("Значение", "atbl-fence-color1", "#000000");
    row.appendChild(color1);
    color1 = color1.querySelector("input");
    let transp1 = HTML.createRangeElement("Прозрачность", "atbl-fence-transp1", 70, 0, 100);
    row.appendChild(transp1);
    transp1 = transp1.querySelector("input");
    subtitle = document.createElement("b");
    subtitle.textContent = "Настройки дополнительного цвета закрывающей плашки";
    form.appendChild(subtitle);
    row = row.cloneNode(false);
    form.appendChild(row);
    let color2 = HTML.createColorPicker("Значение", "atbl-fence-color2", "#000000");
    row.appendChild(color2);
    color2 = color2.querySelector("input");
    let transp2 = HTML.createRangeElement("Прозрачность", "atbl-fence-transp2", 80, 0, 100);
    row.appendChild(transp2);
    transp2 = transp2.querySelector("input");
    let sbtn = HTML.createSubmitButton("save", "Сохранить", "primary");
    form.appendChild(sbtn);

    function updateFence() {
      const c1 = hexToRgb(color1.value);
      const o1 = (100 - parseInt(transp1.value)) / 100;
      const c2 = hexToRgb(color2.value);
      const o2 = (100 - parseInt(transp2.value)) / 100;
      fence.style.backgroundImage = `repeating-linear-gradient(-45deg,rgba(${c1},${o1}) 0 10px,rgba(${c2},${o2}) 10px 20px)`;
    }

    const watched_controls = [ color1, color2, transp1, transp2 ];
    form.addEventListener("change", event => {
      if (!watched_controls.includes(event.target)) return;
      updateFence();
    });

    form.addEventListener("submit", event => {
      event.preventDefault();
      fset.disabled = true;
      (async () => {
        try {
          const c1 = color1.value;
          const c2 = color2.value;
          const o1 = (100 - parseInt(transp1.value)) / 100;
          const o2 = (100 - parseInt(transp2.value)) / 100;
          await DB.updateSetting("book.fence.color1", c1);
          await DB.updateSetting("book.fence.color2", c2);
          await DB.updateSetting("book.fence.opacity1", o1);
          await DB.updateSetting("book.fence.opacity2", o2);
          (new BroadcastChannel("colors-changed")).postMessage([ c1, c2, o1, o2 ]);
          Notification.display("Настройки оформления успешно сохранены", "success");
        } catch (err) {
          Notification.display("Ошибка сохранения настроек оформления", "error");
          console.error(err);
        } finally {
          fset.disabled = false;
        }
      })();
    });

    fset.disabled = true;

    (async () => {
      try {
        color1.value = await DB.getSetting("book.fence.color1", "#000000");
        color2.value = await DB.getSetting("book.fence.color2", "#000000");
        transp1.value = Math.round((1 - await DB.getSetting("book.fence.opacity1", .2)) * 100);
        transp2.value = Math.round((1 - await DB.getSetting("book.fence.opacity2", .3)) * 100);
        updateFence();
        fset.disabled = false;
      } catch(err) {
        Notification.display(err.message, "error");
      }
    })();
  }

  /**
   * Подраздел с настройками формы для добавления автора
   *
   * @param parent Element Родительский элемент
   *
   * @return void
   */
  _makeDialogSettings(parent) {
    let dlg_fset = document.createElement("fieldset");
    parent.appendChild(dlg_fset);
    let lg = document.createElement("legend");
    lg.textContent = "Добавление автора";
    dlg_fset.appendChild(lg);
    let dlg_form = document.createElement("form");
    dlg_form.method = "post";
    dlg_fset.appendChild(dlg_form);
    let note = document.createElement("p");
    note.textContent =
      "Изначальные значения элементов формы в диалоге добавления нового автора." +
      " Может быть удобно для быстрого наполнения списка авторов.";
    dlg_form.appendChild(note);
    let div2 = document.createElement("div");
    div2.style.maxWidth = "20em";
    dlg_form.appendChild(div2);
    let lb = document.createElement("label");
    lb.textContent = "Книги автора в виджетах";
    div2.appendChild(lb);
    let b_ac = HTML.createSelectbox("b_action", [
      { value: "none", text: "Не трогать" },
      { value: "mark", text: "Помечать" }
    ], "none" || "none");
    div2.appendChild(b_ac);
    let n_pr = HTML.createCheckbox("Отображать короткую заметку в профиле", "notes_profile", false);
    dlg_form.appendChild(n_pr);
    let d_ht = HTML.createCheckbox("Отображать подсказку в окне диалога", "dialog_hint", true);
    dlg_form.appendChild(d_ht);

    let btn1 = HTML.createSubmitButton("save", "Сохранить", "primary");
    dlg_form.appendChild(btn1);

    dlg_form.addEventListener("submit", event => {
      event.preventDefault();
      dlg_fset.disabled = true;
      (async () => {
        try {
          await DB.updateSetting("authors.dialog.b_action", b_ac.value);
          await DB.updateSetting("authors.dialog.notes_profile", n_pr.querySelector("input").checked);
          await DB.updateSetting("authors.dialog.hint", d_ht.querySelector("input").checked);
          Notification.display("Настройки успешно сохранены", "success");
        } catch(err) {
          Notification.display("Ошибка сохранения настроек", "error");
          console.error(err);
        } finally {
          dlg_fset.disabled = false;
        }
      })();
    });

    dlg_fset.disabled = true;

    (async () => {
      try {
        b_ac.value = await DB.getSetting("authors.dialog.b_action", "none");
        n_pr.querySelector("input").checked = await DB.getSetting("authors.dialog.notes_profile", false);
        d_ht.querySelector("input").checked = await DB.getSetting("authors.dialog.hint", true);
        dlg_fset.disabled = false;
      } catch(err) {
        Notification.display(err.message, "error");
      }
    })();
  }

  /**
   * Раздел для управления отладкой
   *
   * @param Element Родительский элемент
   *
   * @return void
   */
  _makeDebugSettings(parent) {
    let dlg_fset = document.createElement("fieldset");
    parent.appendChild(dlg_fset);
    let lg = document.createElement("legend");
    lg.textContent = "Режим отладки";
    dlg_fset.appendChild(lg);
    let form = document.createElement("form");
    form.method = "post";
    dlg_fset.appendChild(form);
    let note = document.createElement("p");
    note.textContent =
      "Опции, необходимые для разработки и отладки скрипта." +
      " Если вы обычный пользователь, то скорее всего, они вам не нужны.";
    form.appendChild(note);
    let dhd = HTML.createCheckbox("Обрамлять обработанные блоки", "debug-handled", false);
    form.appendChild(dhd);
    let sbtn = HTML.createSubmitButton("save", "Сохранить", "primary");
    form.appendChild(sbtn);

    form.addEventListener("submit", event => {
      event.preventDefault();
      dlg_fset.disabled = true;
      (async () => {
        try {
          await DB.updateSetting("debug.handled", dhd.querySelector("input").checked);
          Notification.display("Опции отладки успешно изменены", "success");
        } catch (err) {
          Notification.display("Ошибка изменения отладочных опций", "error");
          console.error(err);
        } finally {
          dlg_fset.disabled = false;
        }
      })();
    });

    dlg_fset.disabled = true;
    (async () => {
      try {
        dhd.querySelector("input").checked = await DB.getSetting("debug.handled", false);
        dlg_fset.disabled = false;
      } catch (err) {
        Notification.display(err.message, "error");
      }
    })();
  }

  /**
   * Раздел со списком авторов
   *
   * @param body_el Element HTML-элемент виджета, где будет отображен раздел
   *
   * @return void
   */
  _makeAuthorList(body_el) {
    let div1 = document.createElement("div");
    div1.classList.add("atbl-tab-content");
    div1.dataset.name = "authors";
    body_el.appendChild(div1);

    let info_el = document.createElement("div");
    info_el.appendChild(document.createTextNode("Записи: "));
    let from_el = document.createElement("b");
    info_el.appendChild(from_el);
    info_el.appendChild(document.createTextNode(" - "));
    let to_el = document.createElement("b");
    info_el.appendChild(to_el);
    info_el.appendChild(document.createTextNode(" из "));
    let cnt_el = document.createElement("b");
    info_el.appendChild(cnt_el);
    div1.appendChild(info_el);

    let table = this._usersTableElement();
    div1.appendChild(table);
    let tbody = table.querySelector("div.atbl-table-body");

    let form = document.createElement("form");
    form.style.display = "flex";
    form.style.justifyContent = "space-between";
    div1.appendChild(form);

    let btn1 = HTML.createSubmitButton("prev", "Назад");
    form.appendChild(btn1);
    let btn2 = HTML.createSubmitButton("next", "Далее");
    form.appendChild(btn2);

    const pageSize = 20;
    let records = 0;
    let recFrom = 0;
    let recTo = 0;

    async function updateCount() {
      records = await DB.usersCount();
      cnt_el.textContent = records;
    }

    function updateRange() {
      from_el.textContent = recFrom;
      to_el.textContent = recTo;
    }

    function insertUserRow(user) {
      let row = document.createElement("div");
      row.classList.add("atbl-table-row");
      row.appendChild(makeTableCell(user.nick));
      row.appendChild(makeTableCell(user.fio));
      row.appendChild(makeTableCell(user.shortNote()));
      row.dataset.id = user.nick;
      tbody.appendChild(row);
    }

    function makeTableCell(value) {
      let el = document.createElement("div");
      el.classList.add("atbl-table-cell");
      if (value) el.textContent = value;
      return el;
    }

    function enableButtons(enable) {
      btn1.disabled = !enable || recFrom === 1;
      btn2.disabled = !enable || recTo >= records;
    }

    function loadData() {
      if (!recFrom) recFrom = 1;
      if (recFrom > records) recFrom = Math.max(records - pageSize + 1, 1);
      UserList.fetch(pageSize, recFrom - 1).then(list => {
        while (tbody.firstChild) tbody.lastChild.remove();
        list.forEach(usr => insertUserRow(usr));
        recTo = recFrom + list.length - 1;
        if (recFrom > recTo) recFrom = recTo;
        updateRange();
        updateCount().then(() => enableButtons(true));
      }).catch(err => Notification.display(err.message, "error"));
    }

    form.addEventListener("submit", event => {
      event.preventDefault();
      enableButtons(false);
      if (event.submitter.name === "next") {
        recFrom = recTo + 1;
      } else {
        recFrom = Math.max(recFrom - pageSize, 1);
      }
      loadData();
    });

    tbody.addEventListener("click", event => {
      let row = event.target.closest(".atbl-table-row");
      if (row && row.dataset.id) {
        let user = new User(row.dataset.id);
        user.fetch().then(() => {
          let dlg = new UserModalDialog(user, {
            mobile: false,
            title: "AuthorTodayBlockList - Автор"
          });
          dlg.show();
          dlg.element.addEventListener("submitted", () => {
            this._channel.postMessage(user.nick);
            dlg.hide();
            updateCount().then(() => {
              updateRange();
              loadData();
              enableButtons(true);
            });
          });
        });
      }
    });

    table.addEventListener("user-updated", event => {
      updateCount().then(() => loadData());
    });

    enableButtons(false);
    updateCount().then(() => {
      updateRange();
      loadData();
    });
  }

  /**
   * Раздел для управления импортом и экспортом
   *
   * @param body_el Element HTML-элемент виджета, где будет отображен раздел
   *
   * @return void
   */
  _makeImportExport(body_el) {
    let div1 = document.createElement("div");
    div1.classList.add("atbl-tab-content");
    div1.dataset.name = "imp-exp";
    body_el.appendChild(div1);

    let exp_fset = document.createElement("fieldset");
    div1.appendChild(exp_fset);
    let lg = document.createElement("legend");
    lg.textContent = "Экспорт данных";
    exp_fset.appendChild(lg);
    let exp_form = document.createElement("form");
    exp_form.method = "post";
    exp_fset.appendChild(exp_form);
    let note = document.createElement("p");
    note.textContent =
      "Экспорт данных скрипта из внутреннего хранилища браузера для переноса в другой браузер или в целях" +
      " создания страховой копии. Обратите внимание: никакие ваши персональные данные, в том числе данные" +
      " вашего аккаунта, в указанный файл не выгружаются.";
    exp_form.appendChild(note);
    let exp_btn = HTML.createSubmitButton("export", "Экспорт", "primary");
    exp_form.appendChild(exp_btn);

    let imp_fset = document.createElement("fieldset");
    div1.appendChild(imp_fset);
    lg = document.createElement("legend");
    lg.textContent = "Импорт данных";
    imp_fset.appendChild(lg);
    let imp_form = document.createElement("form");
    imp_form.method = "post";
    imp_form.enctype = "multipart/form-data";
    imp_fset.appendChild(imp_form);
    note = document.createElement("p");
    note.textContent =
      "Импорт данных скрипта из указанного файла. Во время импорта авторы не удаляются, а только" +
      " добавляются и обновляются." +
      " Внимание: Если автор уже существует, то его данные будут переписаны данными из файла.";
    imp_form.appendChild(note);
    let imp_file = document.createElement("input");
    imp_file.type = "file";
    imp_file.required = true;
    imp_form.appendChild(imp_file);
    let imp_btn = HTML.createSubmitButton("import", "Импорт", "danger");
    imp_btn.disabled = true;
    imp_form.appendChild(imp_btn);

    function enableForms(enable) {
      exp_fset.disabled = !enable;
      imp_fset.disabled = !enable;
    }

    exp_form.addEventListener("submit", event => {
      event.preventDefault();
      enableForms(false);
      this._exportData().catch(err => {
        Notification.display(err.message, "error");
      }).finally(() => {
        enableForms(true)
      });
    });

    imp_file.addEventListener("change", () => (imp_btn.disabled = !imp_file.files.length));

    imp_form.addEventListener("submit", event => {
      event.preventDefault();
      enableForms(false);
      this._importData(imp_file.files[0]).then(() => {
        Notification.display("Данные успешно загружены");
        imp_form.reset();
        imp_btn.disabled = true;
        (new BroadcastChannel("user-updated")).postMessage("*");
      }).catch(err => {
        Notification.display(err.message, "error");
      }).finally(() => {
        enableForms(true)
      });
    });
  }

  /**
   * Создает пустую таблицу для отображения пользователей
   *
   * @return Element HTML элемент таблицы
   */
  _usersTableElement() {
    let table = document.createElement("div");
    table.classList.add("atbl-table");
    let hdr = document.createElement("div");
    hdr.classList.add("atbl-table-header");
    table.appendChild(hdr);
    let row = document.createElement("div");
    row.classList.add("atbl-table-row");
    hdr.appendChild(row);
    [ "Ник", "Имя", "Комментарий" ].forEach(title => {
      let tc = document.createElement("div");
      tc.classList.add("atbl-table-cell");
      tc.textContent = title;
      row.appendChild(tc);
    });
    let body = document.createElement("div");
    body.classList.add("atbl-table-body");
    table.appendChild(body);
    return table;
  }

  /**
   * Экспортирует данные и базы данных в файл json
   *
   * @return Promise с количеством записей
   */
  async _exportData() {
    try {
      let list = await DB.usersList(-1);
      let data = JSON.stringify({
        type: "atbl-data",
        version: 1,
        users: list
      }, undefined, 1);
      let link = document.createElement("a");
      link.download = "AuthorTodayBlackList-Export-" + Math.floor(Date.now() / 1000) + ".json";
      link.href = URL.createObjectURL(new Blob([ data ], { type: "application/json" }));
      link.click();
      URL.revokeObjectURL(link.href);
      return list.length;
    } catch(err) {
      Notification.display(err.message, "error");
    }
  }

  /**
   * Импортирует данные в базу данных из файла json
   *
   * @param file File Файл из HTML формы
   *
   * @return Promise с количеством записей
   */
  _importData(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsText(file);
      reader.addEventListener("load", () => {
        try {
          let data = null;
          try {
            data = JSON.parse(reader.result, (key, value) => {
              if (key === "lastUpdate") return new Date(value);
              return value;
            });
          } catch(err) {
            throw new Error("Некорректный JSON файл");
          }
          if (data.type !== "atbl-data" || data.version !== 1) throw new Error("Некорректный формат");
          let pa = (data.users || []).map(ud => User.fromObject(ud).save());
          if (pa) {
            Promise.all(pa).then(() => resolve()).catch(err => reject(err));
          }
        } catch(err) {
          reject(err);
        }
      });
      reader.addEventListener("error", err => reject(err));
    });
  }
}

/**
 * Базовая страница сайта с боковыми виджетами
 */
class GeneralPage extends Page {
  constructor() {
    super();
    this.name = "general";
    this._aside = [];
  }

  update() {
    super.update();
    this._aside = [];
    document.querySelectorAll("aside-widget").forEach(el => {
      let w = new AsideBookShelfWidget(el, {
        users: this.users,
        layout: { list: ".work-widget-list .book-row", default: "list" }
      });
      this._aside.push(w);
      w.update();
    });
    document.querySelectorAll(".aside-profile.profile-card").forEach(el => {
      let w = new UserCardWidget(el, {
        users: this.users
      });
      this._aside.push(w);
      w.update();
    });
  }

  _userUpdated(nick) {
    this._aside.forEach(w => w.userUpdated(nick));
  }
}

/**
 * Класс для обновления страниц профиля пользователя/автора
 */
class ProfilePage extends GeneralPage {
  constructor() {
    super();
    this.name = "profile";
    this.user = null;
  }

  update() {
    try {
      this._widgets = [];
      let el = document.querySelector(".profile-top-wrapper");
      if (!el) return;
      let ae = document.querySelector(".profile-info .profile-name h1>a[href^=\"/u/\"]");
      if (!ae) return;
      let res = /\/u\/([^\/]+)/.exec(ae.getAttribute("href"));
      if (!res) return;
      let fio = ae.textContent.trim();
      if (fio === "") return;
      this.user = new User(res[1], fio);

      // Аватар профиля
      el = document.querySelector("div.profile-avatar>div");
      el && this._widgets.push(new ProfileAvatarWidget(el, this.user));
      // Заметки профиля
      el = document.querySelector("div.profile-info");
      el && this._widgets.push(new ProfileNotesWidget(el, this.user));
      // Меню профиля
      el = document.querySelector("div.cover-buttons>ul.dropdown-menu");
      if (el) {
        let w = new ProfileMenuWidget(el);
        w.menuItem && this._bindMenuItem(w.menuItem);
        this._widgets.push(w);
      }
      // Получить данные пользователя и обновить виджеты
      this.user.fetch().then(() => super.update());
    } catch(err) {
      Notification.display(err.message, "error");
    }
  }

  /**
   * Если пользователь профиля был обновлен в другой вкладке
   *
   * @param nick string Ник обновленного пользователя
   *
   * @return void
   */
  _userUpdated(nick) {
    if (this.user && this.user.nick === nick) {
      this.user.fetch().then(() => this._widgets.forEach(w => w.update()));
    };
    super._userUpdated(nick);
  }

  /**
   * Привязывает пункт меню к действию по созданию и отображению диалогового окна
   *
   * @param menu_item Element HTML-элемент пункта меню для привязки
   *
   * @return void
   */
  _bindMenuItem(menu_item) {
    menu_item.addEventListener("click", event => {
      (async () => {
        try {
          let defaults = {};
          if (this.user.empty) {
            defaults.b_action = await DB.getSetting("authors.dialog.b_action");
            defaults.notes_profile = await DB.getSetting("authors.dialog.notes_profile");
          }
          defaults.hint = await DB.getSetting("authors.dialog.hint", true);
          let dlg = new UserModalDialog(this.user, {
            mobile: false,
            title: "AuthorTodayBlockList - Автор",
            defaults: defaults
          });
          dlg.show();
          dlg.element.addEventListener("submitted", () => {
            this._widgets.forEach(w => w.update());
            this._channel.postMessage(this.user.nick);
            dlg.hide();
          });
        } catch(err) {
          Notification.display(err.message, "error");
        }
      })();
    });
  }
}

/**
 * Класс для отслеживания и обновления заглавной страницы сайта (8 виджетов с книгами)
 */
class MainPage extends GeneralPage {
  constructor() {
    super();
    this.name = "main";
  }

  update() {
    [
      "mostPopularWorks", "hotWorks", "recentUpdWorks", "bestsellerWorks",
      "recentlyViewed", "recentPubWorks", "addedToLibraryWorks", "recentLikedWorks"
    ].forEach(id => {
      let el = document.getElementById(id);
      if (el) {
        this._widgets.push(new SpinnerBookShelfWidget(el, {
          users: this.users,
          watch: false,
          layout: { grid: ".slick-list>.slick-track>.bookcard.slick-slide:not(.slick-cloned)", default: "grid" }
        }));
      }
    });
    super.update();
  }
}

/**
 * Класс для обновления страницы группировки книг по жанрам, популярности, etc
 */
class CategoriesPage extends GeneralPage {
  constructor() {
    super();
    this.name = "categories";
  }

  update() {
    this._widgets = [];
    let el = document.getElementById("search-results");
    if (el) {
      this._widgets.push(new BookShelfWidget(el, {
        users: this.users,
        watch: true,
        layout: {
          list: ".book-row",
          grid: ".book-shelf .bookcard",
          table: ".books-table tbody tr",
          selector: ".panel-actions.pull-right button.active i"
        }
      }));
      el.style.overflowX = "hidden";
      super.update();
    }
  }
}

/**
 * Класс для обновления страницы результатов поиска по тексту
 */
class SearchPage extends Page {
  constructor() {
    super();
    this.name = "search";
  }

  update() {
    this._widgets = [];
    let layout = {
      grid: ".book-shelf .bookcard",
      default: "grid"
    };
    switch ((new URL(document.location)).searchParams.get("category")) {
      case null:
      case "all":
        {
          let el = document.getElementById("search-results");
          if (el) {
            let w = new AjaxContainer(el, [
              [ new UsersWidget(null, { users: this.users }), ".flex-list" ],
              [ new BookShelfWidget(null, { users: this.users, layout: layout }), ".book-shelf" ]
            ]);
            this._widgets.push(w);
          }
        }
        break;
      case "authors":
        {
          let u_el = document.getElementById("search-results");
          u_el && this._widgets.push(new UsersWidget(u_el, { users: this.users, watch: true }));
        }
        break;
      case "works":
        {
          let b_el = document.getElementById("search-results");
          if (b_el) {
            b_el.style.overflowX = "hidden";
            layout.list = ".panel-body .book-row";
            layout.table = ".books-table tbody tr";
            layout.selector = ".panel-actions a.active i";
            this._widgets.push(new BookShelfWidget(b_el, { users: this.users, watch: true, layout: layout }));
          }
        }
        break;
    }
    super.update();
  }
}

/**
 * Класс для обновления страниц в библиотеках пользователей
 */
class LibraryPage extends GeneralPage {
  constructor() {
    super();
    this.name = "library";
  }

  update() {
    this._widgets = [];
    const layout = {
      grid: ".book-shelf .bookcard",
      default: "grid"
    };
    const c_el = document.getElementById("search-results");
    if (c_el) {
      this._widgets.push(new BookShelfWidget(c_el, { users: this.users, watch: false, layout: layout }));
    }
    super.update();
  }
}

/**
 * Класс для обновления страниц коллекций
 */
class CollectionPage extends GeneralPage {
  constructor() {
    super();
    this.name = "collection";
  }

  update() {
    this._widgets = [];
    let el = document.querySelector(".collection-page .collection-work-list");
    if (el) {
      this._widgets.push(new BookShelfWidget(el, { layout: { users: this.users, list: ".book-row", default: "list" } }));
    }
    super.update();
  }
}

/**
 * Класс для обновления страницы списка пользователей/авторов
 */
class UsersPage extends GeneralPage {
  constructor() {
    super();
    this.name = "users";
  }

  update() {
    let el = document.querySelector(".panel .panel-body .flex-list");
    if (!el) return;

    this._widgets = [ new UsersWidget(el, { users: this.users }) ];
    super.update();
  }
}

/**
 * Класс для управления страницей личного кабинета
 */
class AccountPage extends Page {
  constructor() {
    super();
    this.name = "account";
  }

  update() {
    this._widgets = [];
    try {
      const scr_page = (new URL(document.location)).searchParams.get("script") === "atbl";
      // Обновить меню, добавив пункт для скрипта
      let menu = document.querySelector("aside nav ul.nav:not(.atbl-handled)");
      if (menu) {
        this._createMenuItems(menu);
        menu.classList.add("atbl-handled");
        if (scr_page) {
          let active = menu.querySelector("li.active");
          if (active) {
            active.classList.remove("active");
            menu.querySelector("li.atbl-settings").classList.add("active");
          }
        }
      }

      if (scr_page && document.location.pathname === "/account/settings") {
        let sec = document.querySelector("#pjax-container section.content");
        if (!sec) return;
        // Активна страница настроек скрипта. Очистить ее.
        while (sec.firstChild) sec.lastChild.remove();
        // Добавить собственный виджет
        this._widgets.push(new SettingsWidget(sec, this._channel));
        // Обновить
        super.update();
      }
    } catch(err) {
      Notification.display(err.message, "error");
    }
  }

  /**
   * Создает элементы меню для отображения в основном меню личного кабинета пользователя
   *
   * @param menu Element HTML-элемент меню страницы настроек
   *
   * @return void
   */
  _createMenuItems(menu) {
    let item = document.createElement("li");
    if (!menu.querySelector("li.Ox90-settings-menu")) {
      item.classList.add("nav-heading", "Ox90-settings-menu");
      menu.appendChild(item);
      let span = document.createElement("span");
      item.appendChild(span);
      let img = document.createElement("i");
      img.classList.add("icon-cogs", "icon-fw");
      span.appendChild(img);
      span.appendChild(document.createTextNode(" Внешние скрипты"));
      item = document.createElement("li");
    }
    item.classList.add("atbl-settings");
    menu.appendChild(item);
    let ae = document.createElement("a");
    ae.classList.add("nav-link");
    ae.setAttribute("href", "/account/settings?script=atbl");
    ae.textContent = "AutorTodayBlackList";
    item.appendChild(ae);
  }
}

/**
 * Класс для манипуляции элементами карточки пользователя
 */
class UserElement {

  /**
   * Конструктор
   *
   * @param element Element HTML-элемент пользователя
   *
   * @return void
   */
  constructor(element) {
    this.element = element;
    this.nick = this._getNick();
    this._fence = element.querySelector(".atbl-fence-block");
  }

  /**
   * Возвращает ники пользователей, найденные в переданном элементе без проверки на уникальность
   *
   * @param element  Element HTML-элемент для сканирования
   * @param selector string  Уточняющий CSS селекор (необязательный параметр)
   *
   * @return array
   */
  static userNick(element, selector) {
    let list = [];
    let sel = 'a[href^="/u/"]';
    if (selector) sel = selector + " " + sel;
    element.querySelectorAll(sel).forEach(function (ael) {
      let r = /^\/u\/([^\/]+)/.exec(ael.getAttribute("href"));
      if (r) list.push(r[1].trim());
    });
    return list;
  }

  /**
   * Маркирует карточку пользователя
   *
   * @return void
   */
  mark() {
    if (this.element.classList.contains("atbl-marked")) return;
    this._fence = document.createElement("div");
    this._fence.classList.add("atbl-fence-block");
    this.element.appendChild(this._fence);
    this.element.classList.add("atbl-marked");
  }

  /**
   * Снимает пометку с карточки пользователя
   *
   * @return void
   */
  unmark() {
    if (this._fence) {
      this._fence.remove();
      this._fence = null;
    }
    this.element.classList.remove("atbl-marked");
  }

  /**
   * Извлекает ник пользователя
   *
   * @return string
   */
  _getNick() {
    return UserElement.userNick(this.element, ".card-content .user-info")[0];
  }
}

/**
 * Класс для манипуляции с боковым элементом пользователя (на страницах книг и блогов)
 */
class UserAsideElement extends UserElement {
  _getNick() {
    return UserElement.userNick(this.element)[0];
  }
}

/**
 * Базовый класс для манипуляции элементами книги разных видов
 */
class BookElement {

  /**
   * Конструктор
   *
   * @param element Element HTML-элемент книги
   *
   * @return void
   */
  constructor(element) {
    this.element = element;
    this.authors = [];
    this._fence = element.querySelector(".atbl-fence-block");
  }

  /**
   * Проверяет, входил ли автор в список авторов книги
   *
   * @param nick string Ник автора для проверки
   *
   * @return bool
   */
  hasAuthor(nick) {
    return this.authors.includes(nick);
  }

  /**
   * Маркирует книгу
   *
   * @return void
   */
  mark() {
    if (this.element.classList.contains("atbl-marked")) return;
    this._fence = document.createElement("div");
    this._fence.classList.add("atbl-fence-block", "noselect");
    let note = document.createElement("div");
    note.classList.add("atbl-note");
    note.textContent = "Автор в ЧС";
    this._fence.appendChild(note);
    this.element.appendChild(this._fence);
    this.element.classList.add("atbl-marked");
  }

  /**
   * Снимает пометку с книги
   *
   * @return void
   */
  unmark() {
    if (this._fence) {
      this._fence.remove();
      this._fence = null;
    }
    this.element.classList.remove("atbl-marked");
  }

  /**
   * Возвращает список авторов в переданном элементе, исключая повторения
   *
   * @param element  Element HTML-элемент для поиска ссылок с авторами
   * @param selector string  Уточняющий CSS селектор (не обязательный параметр)
   *
   * @return Array
   */
  static getAuthorList(element, selector) {
    return Array.from(new Set(UserElement.userNick(element, selector)));
  }
}

/**
 * Класс для элемента книги в виде прямоугольно блока с обложкой и подробной информацией о книге
 */
class BookRowElement extends BookElement {
  constructor(element) {
    super(element);
    this.authors = BookElement.getAuthorList(this.element, ".book-row-content .book-author");
  }
}

/**
 * Класс для элемента книги в виде карточки с обложкой и краткой информацией внизу
 */
class BookCardElement extends BookElement {
  constructor(element) {
    super(element);
    this.authors = BookElement.getAuthorList(this.element, ".bookcard-footer .bookcard-authors");
  }
}

/**
 * Класс для элемента книги в виде строки таблицы, без обложки
 */
class BookTableElement extends BookElement {
  constructor(element) {
    super(element);
    this.authors = BookElement.getAuthorList(this.element, "td:nth-child(2)");
  }
}

/**
 * Класс для отображения модального диалогового окна в стиле сайта
 */
class ModalDialog {

  /**
   * Конструктор
   *
   * @param params Object Объект с полями mobile (bool), title (string), body (Element)
   *
   * @return void
   */
  constructor(params) {
    this.element = null;
    this._params = params;
    this._backdrop = null;
  }

  /**
   * Отображает модальное окно
   *
   * @return void
   */
  show() {
    if (this._params.mobile) {
      this._show_m();
      return;
    }

    this.element = document.createElement("div");
    this.element.classList.add("modal", "fade", "in");
    this.element.tabIndex = -1;
    this.element.setAttribute("role", "dialog");
    this.element.style.display = "block";
    this.element.style.paddingRight = "12px";
    let dlg = document.createElement("div");
    dlg.classList.add("modal-dialog");
    dlg.setAttribute("role", "document");
    this.element.appendChild(dlg);
    let ctn = document.createElement("div");
    ctn.classList.add("modal-content");
    dlg.appendChild(ctn);
    let hdr = document.createElement("div");
    hdr.classList.add("modal-header");
    ctn.appendChild(hdr);
    let hbt = document.createElement("button");
    hbt.type = "button";
    hbt.classList.add("close", "atbl-btn-close");
    hdr.appendChild(hbt);
    let sbt = document.createElement("span");
    sbt.textContent = "x";
    hbt.appendChild(sbt);
    let htl = document.createElement("h4");
    htl.classList.add("modal-title");
    htl.textContent = this._params.title || "";
    hdr.appendChild(htl);
    let bdy = document.createElement("div");
    bdy.classList.add("modal-body");
    bdy.style.color = "#656565";
    bdy.style.minWidth = "250px";
    bdy.style.maxWidth = "max(500px,35vw)";
    bdy.appendChild(this._params.body);
    ctn.appendChild(bdy);

    this._backdrop = document.createElement("div");
    this._backdrop.classList.add("modal-backdrop", "fade", "in");

    document.body.appendChild(this.element);
    document.body.appendChild(this._backdrop);
    document.body.classList.add("modal-open");

    this.element.addEventListener("click", function(event) {
      if (event.target === this.element || event.target.closest("button.atbl-btn-close")) {
        this.hide();
      }
    }.bind(this));
    this.element.addEventListener("keydown", function(event) {
      if (event.code === "Escape" && !event.shiftKey && !event.ctrlKey && !event.altKey) {
        this.hide();
        event.preventDefault();
      }
    }.bind(this));

    this.element.focus();
  }

  /**
   * Скрывает модальное окно и удаляет его элементы из DOM-дерева
   *
   * @return void
   */
  hide() {
    if (this._params.mobile) {
      this._hide_m();
      return;
    }

    if (this.element && this._backdrop) {
      this._backdrop.remove();
      this._backdrop = null;
      this.element.remove();
      this.element = null;
      document.body.classList.remove("modal-open");
    }
  }

  /**
   * Вариант метода show для мобильной версии сайта
   *
   * @return void
   */
  _show_m() {
    this.element = document.createElement("div");
    this.element.classList.add("popup", "popup-screen-content");
    this.element.style.overflow = "hidden";
    let ctn = document.createElement("div");
    ctn.classList.add("content-block");
    this.element.appendChild(ctn);
    let htl = document.createElement("h2");
    htl.classList.add("text-center");
    htl.textContent = this._params.title || "";
    ctn.appendChild(htl);
    let bdy = document.createElement("div");
    bdy.classList.add("modal-body");
    bdy.style.color = "#656565";
    bdy.appendChild(this._params.body);
    ctn.appendChild(bdy);
    let cbt = document.createElement("button");
    cbt.classList.add("mt", "button", "btn", "btn-default");
    cbt.textContent = "Закрыть";
    ctn.appendChild(cbt);

    cbt.addEventListener("click", function(event) {
      this._hide_m();
    }.bind(this));

    document.body.appendChild(this.element);
    this.element.style.display = "block";
    this.element.classList.add("modal-in");
    this._turnOverlay_m(true);

    this.element.focus();
  }

  /**
   * Вариант метода hide для мобильной версии сайта
   *
   * @return void
   */
  _hide_m() {
    if (this.element) {
      this.element.remove();
      this.element = null;
      this._turnOverlay_m(false);
    }
  }

  /**
   * Метод для управления положкой в мобильной версии сайта
   *
   * @param on bool Режим отображения подложки
   *
   * @return void
   */
  _turnOverlay_m(on) {
    let overlay = document.querySelector("div.popup-overlay");
    if (!overlay && on) {
      overlay = document.createElement("div");
      overlay.classList.add("popup-overlay");
      document.body.appendChild(overlay);
    }
    if (on) {
      overlay.classList.add("modal-overlay-visible");
    } else if (overlay) {
      overlay.classList.remove("modal-overlay-visible");
    }
  }
}

/**
 * Класс для отображения диалога с настройками автора
 */
class UserModalDialog extends ModalDialog {

  /**
   * Конструктор класса
   *
   * @param user   User   Автор
   * @param params Object Данные с полями mobile и title
   *
   * @return void
   */
  constructor(user, params) {
    super(params);
    this._user = user;
    this._params.defaults = this._params.defaults || {};
  }

  show() {
    this._params.body = this._createDialogContent();
    super.show();

    this.element.addEventListener("submit", event => {
      event.preventDefault();
      switch (event.submitter.name) {
        case "save":
          this._user.b_action = this.element.querySelector("select[name=b_action]").value;
          this._user.notes = {
            text: this.element.querySelector("textarea[name=notes_text]").value.trim(),
            profile: this.element.querySelector("input[name=notes_profile]").checked
          };
          this._user.save().then(() => {
            Notification.display("Данные успешно обновлены", "success");
            this.element.dispatchEvent(new Event("submitted"));
          }).catch(err => {
            Notification.display("Ошибка обновления данных", "error");
            console.warn("Ошибка обновления данных: " + err.message);
          });
          break;
        case "delete":
          if (confirm("Удалить автора из базы ATBL?")) {
            this._user.delete().then(() => {
              Notification.display("Запись успешно удалена", "success");
              this.element.dispatchEvent(new Event("submitted"));
            }).catch((err) => {
              Notification.display("Ошибка удаления записи", "error");
              console.warn("Ошибка удаления записи: " + err.message);
            });
          }
          break;
      }
    });
  }

  /**
   * Создает HTML-элемент form с полями ввода и кнопками для редактирования параметров автора
   *
   * @return Element
   */
  _createDialogContent() {
    let form = document.createElement("form");
    let idiv = document.createElement("div");
    idiv.style.display = "flex";
    idiv.style.flexDirection = "column";
    idiv.style.gap = "1em";
    form.appendChild(idiv);
    let tdiv = document.createElement("div");
    tdiv.style.fontSize = "110%";
    tdiv.style.borderBottom = "1px solid #e5e5e5";
    tdiv.style.paddingBottom = "5px";
    tdiv.appendChild(document.createTextNode("Параметры ATBL для пользователя "));
    idiv.appendChild(tdiv);
    let ustr = document.createElement("strong");
    ustr.textContent = this._user.fio;
    tdiv.appendChild(ustr);
    let bsec = document.createElement("div");
    idiv.appendChild(bsec);
    let bttl = document.createElement("label");
    bttl.textContent = "Книги автора в виджетах";
    bsec.appendChild(bttl);
    bsec.appendChild(
      HTML.createSelectbox("b_action", [
        { value: "none", text: "Не трогать" },
        { value: "mark", text: "Помечать" }
      ], (this._user.empty ? this._params.defaults.b_action : this._user.b_action) || "none")
    );
    let nsec = document.createElement("div");
    idiv.appendChild(nsec);
    let nsp = document.createElement("label");
    nsp.textContent = "Заметки";
    nsec.appendChild(nsp);
    let nta = document.createElement("textarea");
    nta.name = "notes_text";
    nta.style.width = "100%";
    nta.spellcheck = true;
    nta.maxlength = 1024;
    nta.style.minHeight = "8em";
    nta.placeholder = "Заметки об авторе";
    nta.value = this._user.notes && this._user.notes.text || "";
    nsec.appendChild(nta);
    idiv.appendChild(HTML.createCheckbox(
      "Отображать короткую заметку в профиле (только 1-я строчка)",
      "notes_profile",
      (this._user.empty ? this._params.defaults.notes_profile : this._user.notes.profile) || false
    ));
    let usec = document.createElement("div");
    idiv.appendChild(usec);
    let uttl = document.createElement("label");
    uttl.textContent = "Последнее обновление";
    usec.appendChild(uttl);
    let uval = document.createElement("input");
    uval.readonly = true;
    uval.disabled = true;
    uval.classList.add("form-control");
    uval.value = this._user.lastUpdate && this._user.lastUpdate.toLocaleString() || "нет";
    usec.appendChild(uval);
    if (this._params.defaults.hint) {
      let hnt = document.createElement("div");
      hnt.textContent = "Вы всегда можете отменить это действие в личном кабинете, в настройках скрипта.";
      idiv.appendChild(hnt);
      hnt = document.createElement("div");
      hnt.textContent = "Обратите внимание: все настройки хранятся только в вашем браузере." +
        " Если вы захотите пренести настройки в другой браузер, воспользуйтесь экспортом настроек в личном кабинете.";
      idiv.appendChild(hnt);
    }
    let bdiv = document.createElement("div");
    bdiv.classList.add("atbl-button-container");
    form.appendChild(bdiv);
    bdiv.appendChild(HTML.createSubmitButton("save", this._user.empty && "Добавить" || "Обновить", "success"));
    let btn2 = HTML.createSubmitButton("delete", "Удалить", "danger");
    btn2.disabled = this._user.empty;
    bdiv.appendChild(btn2);
    let btn3 = document.createElement("button");
    btn3.classList.add("btn", "btn-default", "atbl-btn-close");
    btn3.textContent = "Отмена";
    bdiv.appendChild(btn3);
    return form;
  }
}

/**
 * Класс для работы с всплывающими уведомлениями. Для аутентичности используются стили сайта.
 */
class Notification {

  /**
   * Конструктор. Вызвается из static метода display
   *
   * @param data Object Объект с полями text (string) и type (string)
   *
   * @return void
   */
  constructor(data) {
    this._data = data;
    this._element = null;
  }

  /**
   * Возвращает HTML-элемент блока с текстом уведомления
   *
   * @return Element HTML-элемент для добавление в контейнер уведомлений
   */
  element() {
    if (!this._element) {
      this._element = document.createElement("div");
      this._element.classList.add("toast", "toast-" + (this._data.type || "success"));
      let msg = document.createElement("div");
      msg.classList.add("toast-message");
      msg.textContent = "ATBL: " + this._data.text;
      this._element.appendChild(msg);
      this._element.addEventListener("click", () => this._element.remove());
      setTimeout(() => {
        this._element.style.transition = "opacity 2s ease-in-out";
        this._element.style.opacity = "0";
        setTimeout(() => {
          let ctn = this._element.parentElement;
          this._element.remove();
          if (!ctn.childElementCount) ctn.remove();
        }, 2000); // Продолжительность плавного растворения уведомления - 2 секунды
      }, 10000); // Длительность отображения уведомления - 10 секунд
    }
    return this._element;
  }

  /**
   * Метод для отображения уведомлений на сайте. К тексту сообщения будет автоматически добавлена метка скрипта
   *
   * @param text string Текст уведомления
   * @param type string Тип уведомления. Допустимые типы: `success`, `warning`, `error`
   *
   * @return void
   */
  static display(text, type) {
    let ctn = document.getElementById("toast-container");
    if (!ctn) {
      ctn = document.createElement("div");
      ctn.id = "toast-container";
      ctn.classList.add("toast-top-right");
      ctn.setAttribute("role", "alert");
      ctn.setAttribute("aria-live", "polite");
      document.body.appendChild(ctn);
    }
    ctn.appendChild((new Notification({ text: text, type: type })).element());
  }
}

//----------

/**
 * Добавляет стилевые блоки на страницу
 *
 * @param string css Текстовая строка CSS-блока вида ".selector1 {...} .selector2 {...}"
 * @param string id  Id элемента стилей (не обязательно)
 *
 * @return void
 */
function addStyle(css, id) {
  const style = document.getElementById("atbl_styles") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = id || "atbl_styles";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

/**
 * Преобразует hex цвет в rgb представление ("#ff0000" -> "255,0,0")
 *
 * @param hex string HEX представление цвета для преобразования
 *
 * @return string
 */
function hexToRgb(hex) {
  const res = /^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i.exec(hex);
  if (res) {
    return "" + parseInt(res[1], 16) + "," + parseInt(res[2], 16) + "," + parseInt(res[3], 16);
  }
  return "0,0,0";
}

// Проверяем доступность базы данных
if (!indexedDB) return; // База недоступна. Возможно используется приватный режим просмотра.

// Старт скрипта по готовности DOM-дерева
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", start);
else start();

})();
