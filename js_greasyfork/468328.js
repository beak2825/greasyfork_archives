// ==UserScript==
// @name           ReadliBookExtractor
// @namespace      90h.yy.zz
// @version        0.8.2
// @author         Ox90
// @match          https://readli.net/*
// @description    The script adds a button to the site for downloading books to an FB2 file
// @description:ru Скрипт добавляет кнопку для скачивания книги в формате FB2
// @require        https://update.greasyfork.org/scripts/468831/1478439/HTML2FB2Lib.js
// @grant          unsafeWindow
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/468328/ReadliBookExtractor.user.js
// @updateURL https://update.greasyfork.org/scripts/468328/ReadliBookExtractor.meta.js
// ==/UserScript==

(function start() {

let env = {};
let stage = 0;

function init() {
  env.popupShow = window.popupShow || (unsafeWindow && unsafeWindow.popupShow);
  pageHandler();
}

async function pageHandler() {
  let book_doc = null;
  if (document.querySelector("a.book-actions__button[href^=\"/chitat-online/\"]")) {
    book_doc = document;
  } else if (document.querySelector("div.reading-end__content")) {
    const hdr = document.querySelector("h1>a");
    if (hdr && hdr.href) book_doc = await getBookOverview(hdr.href);
  }
  if (book_doc) {
    const book_page = book_doc.querySelector("main.main>section.wrapper.page");
    if (book_page) {
      const dlg_data = makeDownloadDialog();
      const btn_list = document.querySelector("section.download>ul.download__list");
      insertDownloadButton(book_page, dlg_data, btn_list);
    }
  }
}

async function getBookOverview(url) {
  return (new DOMParser()).parseFromString(await FB2Loader.addJob(url), "text/html");
}

function insertDownloadButton(book_page, dlg_data, btn_list) {
  // Создать кнопку
  const btn = document.createElement("li");
  btn.classList.add("download__item");
  const link = document.createElement("a");
  link.classList.add("download__link");
  link.href = "#";
  link.textContent = "fb2-ex";
  btn.appendChild(link);
  // Попытаться вставить новую кнопку сразу после оригинальной fb2
  let item = btn_list.firstElementChild;
  while (item) {
    if (item.textContent === "fb2") break;
    item = item.nextElementSibling;
  }
  if (item) {
    item.after(btn);
  } else {
    btn_list.appendChild(btn);
  }
  // Ссылка на данные книги
  let fb2doc = null;
  // Установить обработчик для новой кнопки
  btn.addEventListener("click", event => {
    event.preventDefault();
    try {
      fb2doc = new ReadliFB2Document();
      fb2doc.lang = "ru";
      fb2doc.idPrefix = "rdlbe_";
      dlg_data.log.clean();
      dlg_data.lat.disabled = false;
      dlg_data.lat.checked = Settings.get("fixlatin");
      dlg_data.sbm.textContent = setStage(0);
      env.popupShow("#rbe-download-dlg");
      getBookInfo(fb2doc, book_page, dlg_data.log);
    } catch (e) {
      dlg_data.log.message(e.message, "red");
      dlg_data.sbm.textContent = setStage(3);
    } finally {
      dlg_data.sbm.disabled = false;
    }
  });
  // Установить обработчик для основной кнопки диалога
  dlg_data.sbm.addEventListener("click", () => makeAction(fb2doc, dlg_data));
  // Установить обработчик для скрытия диалога
  dlg_data.dlg.addEventListener("dlg-hide", () => {
    if (dlg_data.link) {
      URL.revokeObjectURL(dlg_data.link.href);
      dlg_data.link = null;
    }
    fb2doc = null;
  });
}

function makeDownloadDialog() {
  const popups = document.querySelector("div.popups");
  if (!popups) throw new Error("Не найден блок popups");
  const dlg_c = document.createElement("div");
  dlg_c.id = "rbe-download-dlg";
  popups.appendChild(dlg_c);
  dlg_c.innerHTML =
    '<div class="popup" data-src="#rbe-download-dlg">' +
    '<button class="popup__close button-close-2"></button>' +
    '<div class="popup-form" style="display:flex; flex-direction:column; gap:.5em;">' +
    '<h2 style="margin:0; padding:0 0 .5em;">Скачать книгу</h2>' +
    '<div class="rbe-log"></div>' +
    '<label style="display:flex; gap:.5em; cursor:pointer;">' +
      '<input type="checkbox" name="fix_lat" style="appearance:auto;">Исправлять латиницу в тексте</label>' +
    '<button class="button rbe-submit" disabled="true">Продолжить</button>' +
    '</div>' +
    '</div>';
  const dlg = dlg_c.querySelector("div.popup-form");
  const dlg_data = {
    dlg: dlg,
    log: new LogElement(dlg.querySelector(".rbe-log")),
    lat: dlg.querySelector("input[name=fix_lat]"),
    sbm: dlg.querySelector("button.rbe-submit")
  };
  (new MutationObserver(() => {
    if (dlg_c.children.length) {
      dlg.dispatchEvent(new CustomEvent("dlg-hide"));
    }
  })).observe(dlg_c, { childList: true });
  return dlg_data;
}

async function makeAction(fb2doc, dlg_data) {
  try {
    switch (stage) {
      case 0:
        {
          dlg_data.sbm.textContent = setStage(1);
          dlg_data.lat.disabled = true;
          const lat = dlg_data.lat.checked;
          Settings.set("fixlatin", lat);
          Settings.save();
          await getBookContent(fb2doc, dlg_data.log, { fixLat: lat });
          dlg_data.sbm.textContent = setStage(2);
        }
        break;
      case 1:
        FB2Loader.abortAll();
        dlg_data.sbm.textContent = setStage(3);
        break;
      case 2:
        if (!dlg_data.link) {
          dlg_data.link = document.createElement("a");
          dlg_data.link.download = genBookFileName(fb2doc);
          dlg_data.link.href = URL.createObjectURL(new Blob([ fb2doc ], { type: "application/octet-stream" }));
          dlg_data.fb2doc = null;
        }
        dlg_data.link.click();
        break;
      case 3:
        dlg_data.dlg.closest("div.popup[data-src=\"#rbe-download-dlg\"]").querySelector("button.popup__close").click();
        break;
    }
  } catch (err) {
    console.error(err);
    dlg_data.log.message(err.message, "red");
    dlg_data.sbm.textContent = setStage(3);
  }
}

function setStage(new_stage) {
  stage = new_stage;
  return [ "Продолжить", "Прервать", "Сохранить в файл", "Закрыть" ][new_stage] || "Error";
}

function getBookInfo(fb2doc, book_page, log) {
  // Id книги
  fb2doc.id = (() => {
    const el = book_page.querySelector("a.book-actions__button[href^=\"/chitat-online/\"]");
    if (el) {
      const id = (new URL(el)).searchParams.get("b");
      if (id) return id;
    }
    throw new Error("Не найден Id книги!");
  })();
  // Название книги
  const title = (() => {
    const el = book_page.querySelector("div.main-info>h1.main-info__title");
    return el && el.textContent.trim() || "";
  })();
  if (!title) throw new Error("Не найдено название книги");
  let li = log.message("Название:").text(title);
  fb2doc.bookTitle = title;
  // Авторы
  const authors = Array.from(book_page.querySelectorAll("div.main-info>a[href^=\"/avtor/\"]")).reduce((list, el) => {
    const content = el.textContent.trim();
    if (content) {
      const author = new FB2Author(content);
      author.homePage = el.href;
      list.push(author);
    }
    return list;
  }, []);
  log.message("Авторы:").text(authors.length || "нет");
  if (!authors.length) log.warning("Не найдена информация об авторах");
  fb2doc.bookAuthors = authors;
  // Жанры
  const genres = Array.from(book_page.querySelectorAll("div.book-info a[href^=\"/cat/\"]")).reduce((list, el) => {
    const content = el.textContent.trim();
    if (content) list.push(content);
    return list;
  }, []);
  fb2doc.genres = new FB2GenreList(genres);
  log.message("Жанры:").text(fb2doc.genres.length || "нет");
  // Ключевые слова
  fb2doc.keywords = Array.from(book_page.querySelectorAll("div.tags>ul.tags__list>li.tags__item")).reduce((list, el) => {
    const content = el.textContent.trim();
    const r = /^#(.+)$/.exec(content);
    if (r) list.push(r[1]);
    return list;
  }, []);
  log.message("Теги:").text(fb2doc.keywords.length || "нет");
  // Серия
  fb2doc.sequence = (() => {
    let el = book_page.querySelector("div.book-info a[href^=\"/serie/\"]");
    if (el) {
      let r = /^(.+?)(?:\s+#(\d+))?$/.exec(el.textContent.trim());
      if (r && r[1]) {
        const res = { name: r[1] };
        log.message("Серия:").text(r[1]);
        if (r[2]) {
          res.number = r[2];
          log.message("Номер в серии:").text(r[2]);
        }
        return res;
      }
    }
    return null;
  })();
  // Дата
  fb2doc.bookDate = (() => {
    const el = book_page.querySelector("ul.book-chars>li.book-chars__item");
    if (el) {
      const r = /^Размещено.+(\d{2})\.(\d{2})\.(\d{4})$/.exec(el.textContent.trim());
      if (r) {
        log.message("Последнее обновление:").text(`${r[1]}.${r[2]}.${r[3]}`);
        return new Date(`${r[3]}-${r[2]}-${r[1]}`);
      }
    }
    return null;
  })();
  // Ссылка на источник
  fb2doc.sourceURL = document.location.origin + document.location.pathname;
  // Аннотация
  fb2doc.annotation = (() => {
    const el = book_page.querySelector("article.seo__content");
    if (el && el.firstElementChild && el.firstElementChild.tagName === "H2" && el.firstElementChild.textContent === "Аннотация") {
      const c_el = el.cloneNode(true);
      c_el.firstElementChild.remove();
      return c_el;
    }
    log.warning("Аннотация не найдена!");
    return null;
  })();
  // Количество страниц
  fb2doc.pageCount = (() => {
    const li = log.message("Количество страниц:");
    const el = book_page.querySelector(".book-about__pages .button-pages__right");
    if (el) {
      const pages_str = el.textContent;
      let r = /^(\d+)/.exec(pages_str);
      if (r) {
        li.text(r[1]);
        return parseInt(r[1]);
      }
    }
    li.fail();
    return 0;
  })();
  // Обложка книги
  fb2doc.coverpageURL = (() => {
    const el = book_page.querySelector("div.book-image img");
    if (el) return el.src;
    return null;
  })();
}

async function getBookContent(fb2doc, log, params) {
  let li = null;
  try {
    // Обложка книги
    if (fb2doc.coverpageURL) {
      li = log.message("Загрузка обложки...");
      fb2doc.coverpage = new FB2Image(fb2doc.coverpageURL);
      await fb2doc.coverpage.load((loaded, total) => li.text("" + Math.round(loaded / total * 100) + "%"));
      fb2doc.coverpage.id = "cover" + fb2doc.coverpage.suffix();
      fb2doc.binaries.push(fb2doc.coverpage);
      li.ok();
      li = null;
      log.message("Размер обложки:").text(fb2doc.coverpage.size + " байт");
      log.message("Тип файла обложки:").text(fb2doc.coverpage.type);
    } else {
      log.warning("Обложка книги не найдена!");
    }
    // Анализ аннотации
    if (fb2doc.annotation) {
      const li = log.message("Анализ аннотации...");
      fb2doc.bindParser("a", new ReadliFB2AnnotationParser());
      try {
        await fb2doc.parse("a", log, params, fb2doc.annotation);
        li.ok();
        if (!fb2doc.annotation) log.warning("Не найдено содержимое аннотации!");
      } catch (err) {
        li.fail();
        throw err;
      }
    }
    //--
    li = null;
    // Версия программы
    fb2doc.programName = GM_info.script.name + " v" + GM_info.script.version;
    //--
    log.message("---");
    // Страницы
    fb2doc.bindParser("n", new ReadliFB2NotesParser());
    fb2doc.bindParser("p", new ReadliFB2PageParser());
    const page_url = new URL("/chitat-online/", document.location);
    page_url.searchParams.set("b", fb2doc.id);
    for (let pn = 1; pn <= fb2doc.pageCount; ++pn) {
      li = log.message(`Получение страницы ${pn}/${fb2doc.pageCount}...`);
      page_url.searchParams.set("pg", pn);
      const page = getPageElement(await FB2Loader.addJob(page_url));
      if (pn !== 1 || ! await getAuthorNotes(fb2doc, page, log, params)) {
        await fb2doc.parse("p", log, params, page);
      }
      li.ok();
    }
    li = null;
    log.message("---");
    // Информация
    log.message("Всего глав:").text(fb2doc.chapters.length);
    if (fb2doc.unknowns) {
      log.warning(`Найдены неизвестные элементы: ${fb2doc.unknowns}`);
      log.message("Преобразованы в текст без форматирования");
    }
    if (params.fixLat) log.message("Заменено латинских букв:").text(fb2doc.latCount.toLocaleString());
    const icnt = fb2doc.binaries.reduce((cnt, img) => {
      if (!img.value) ++cnt;
      return cnt;
    }, 0);
    if (icnt) {
      log.warning(`Проблемы с загрузкой изображений: ${icnt}`);
      log.message("Проблемные изображения заменены на текст");
    }
    const webpList = fb2doc.binaries.reduce((list, bin) => {
      if (bin instanceof FB2Image && bin.type === "image/webp" && bin.value) list.push(bin);
      return list;
    }, []);
    if (webpList.length) {
      log.message("---");
      log.warning("Найдены изображения формата WebP. Могут быть проблемы с отображением на старых читалках.");
      await new Promise(resolve => setTimeout(resolve, 100)); // Чтобы лог успел обновиться
      if (confirm("Выполнить конвертацию WebP --> JPEG?")) {
        const li = log.message("Конвертация изображений...");
        let ecnt = 0;
        for (const img of webpList) {
          try {
            await img.convert("image/jpeg");
          } catch(err) {
            console.log(`Ошибка конвертации изображения: id=${img.id}; type=${img.type};`);
            ++ecnt;
          }
        }
        if (!ecnt) {
          li.ok();
        } else {
          li.fail();
          log.warning("Часть изображений не удалось сконвертировать!");
        }
      }
    }
    log.message("---");
    log.message("Готово!");
  } catch (err) {
    li && li.fail();
    fb2doc.bindParser();
    throw err;
  }
}

async function getAuthorNotes(fb2doc, page, log, params) {
  const hdr = page.querySelector("section>subtitle");
  if (!hdr || hdr.textContent !== "Примечания автора:" || !hdr.nextSibling) return false;
  if (await fb2doc.parse("n", log, params, hdr.parentNode, hdr.nextSibling)) {
    log.message("Найдены примечания автора");
    return true;
  }
  return false;
}

function getPageElement(html) {
  const doc = (new DOMParser()).parseFromString(html, "text/html");
  const page_el = doc.querySelector("article.reading__content>div.reading__text");
  if (!page_el) throw new Error("Ошибка анализа HTML страницы");
  return page_el;
}

function genBookFileName(fb2doc) {
  function xtrim(s) {
    const r = /^[\s=\-_.,;!]*(.+?)[\s=\-_.,;!]*$/.exec(s);
    return r && r[1] || s;
  }

  const parts = [];
  if (fb2doc.bookAuthors.length) parts.push(fb2doc.bookAuthors[0]);
  if (fb2doc.sequence) {
    let name = xtrim(fb2doc.sequence.name);
    if (fb2doc.sequence.number) {
      const num = fb2doc.sequence.number;
      name += (num.length < 2 ? "0" : "") + num;
    }
    parts.push(name);
  }
  parts.push(xtrim(fb2doc.bookTitle));
  let fname = (parts.join(". ") + " [RL-" + fb2doc.id + "]").replace(/[\0\/\\\"\*\?\<\>\|:]+/g, "");
  if (fname.length > 250) fname = fname.substr(0, 250);
  return fname + ".fb2";
}

//---------- Классы ----------

class ReadliFB2Document extends FB2Document {
  constructor() {
    super();
    this.fixLat = false;
    this.latCount = 0;
    this.unknowns = 0;
  }

  parse(parser_id, log, params, ...args) {
    const bin_start = this.binaries.length;
    this.fixLat = !!params.fixLat;
    const pdata = super.parse(parser_id, ...args);
    pdata.unknownNodes.forEach(el => {
      log.warning(`Найден неизвестный элемент: ${el.nodeName}`);
      ++this.unknowns;
    });
    if (pdata.latCount) this.latCount += pdata.latCount;
    const u_bin = this.binaries.slice(bin_start);
    return (async () => {
      const it = u_bin[Symbol.iterator]();
      const get_list = function() {
        const list = [];
        for (let i = 0; i < 5; ++i) {
          const r = it.next();
          if (r.done) break;
          list.push(r.value);
        }
        return list;
      };
      while (true) {
        const list = get_list();
        if (!list.length) break;
        await Promise.all(list.map(bin => {
          const li = log.message("Загрузка изображения...");
          if (!bin.url) {
            log.warning("Отсутствует ссылка");
            li.skipped();
            return Promise.resolve();
          }
          return bin.load((loaded, total) => li.text("" + Math.round(loaded / total * 100) + "%"))
            .then(() => li.ok())
            .catch((err) => {
              li.fail();
              if (err.name === "AbortError") throw err;
            });
        }));
      }
      return pdata.result;
    })();
  }
}

class ReadliFB2Parser extends FB2Parser {
  constructor() {
    super();
    this._latinMap = new Map([
      [ "A", "А" ], [ "a", "а" ], [ "C", "С" ], [ "c", "с" ], [ "E", "Е" ], [ "e", "е" ],
      [ "M", "М" ], [ "O", "О" ], [ "o", "о" ], [ "P", "Р" ], [ "p", "р" ], [ "X", "Х"], [ "x", "х" ]
    ]);
  }

  run(fb2doc, htmlNode, fromNode) {
    this._doc = fb2doc;
    this._unknown_nodes = [];
    this._lat_cnt = 0;
    // Предварительно вырезать элементы с заведомо бесполезным содержимым, чтобы оно не попадало в textContent во время проверки блоков.
    // Ноды страниц хранятся только в памяти, а нода аннотации клонируется, так что можно безопасно править переданную в параметре ноду.
    htmlNode.querySelectorAll("script").forEach(el => el.remove());
    // Запустить парсинг
    const res = super.parse(htmlNode, fromNode);
    const un = this._unknown_nodes;
    this._unknown_nodes = null;
    return { result: res, unknownNodes: un, latCount: this._lat_cnt };
  }

  startNode(node, depth) {
    switch (node.nodeName) {
      case "DIV":
      case "INS":
        // Пропустить динамически подгружаемые рекламные блоки. Могут быть на 0 и 1 уровне вложения.
        // Поскольку изначально они пустые, то другие проверки можно не делать.
        if (!node.children.length && node.textContent.trim() === "") return null;
        break;
      case "SECTION":
      case "EMPTY-LINE":
        // Кривизна переноса текста книги из FB2-файла на сайт
        {
          const n = node.ownerDocument.createElement("p");
          while (node.firstChild) n.appendChild(node.firstChild);
          return n;
        }
      case "STRIKETHROUGH":
        // Элемент из формата FB2
        {
          const n = node.ownerDocument.createElement("strike");
          while (node.firstChild) n.appendChild(node.firstChild);
          return n;
        }
    }
    return node;
  }

  processElement(fb2el, depth) {
    if (fb2el) {
      if (fb2el instanceof FB2Image) {
        this._doc.binaries.push(fb2el);
      } else if (fb2el instanceof FB2UnknownNode) {
        this._unknown_nodes.push(fb2el.value);
      } else if (this._doc.fixLat && typeof(fb2el.value) === "string") {
        fb2el.value = fb2el.value.replace(/([AaCcEeMOoPpXx]+)([ЁёА-Яа-я]?)/g, (match, p1, p2, offset, str) => {
          if (p1.length <= 3 || p2.length || (offset && /[ЁёА-Яа-я]/.test(str.at(offset - 1)))) {
            const a = [];
            for (const c of p1) a.push(this._latinMap.get(c));
            p1 = a.join("");
            this._lat_cnt += p1.length;
          }
          return `${p1}${p2}`;
        });
      }
    }
    return super.processElement(fb2el, depth);
  }
}

class ReadliFB2AnnotationParser extends ReadliFB2Parser {
  run(fb2doc, htmlNode) {
    this._annotation = new FB2Annotation();
    const pdata = super.run(fb2doc, htmlNode);
    if (this._annotation.children.length) {
      this._annotation.normalize();
    } else {
      this._annotation = null;
    }
    fb2doc.annotation = this._annotation;
    return pdata;
  }

  processElement(fb2el, depth) {
    if (fb2el && !depth) this._annotation.children.push(fb2el);
    return super.processElement(fb2el, depth);
  }
}

class ReadliFB2NotesParser extends ReadliFB2Parser {
  run(fb2doc, htmlNode, fromNode) {
    this._annotation = new FB2Annotation();
    const pdata = super.run(fb2doc, htmlNode, fromNode);
    let n_ann = this._annotation;
    let d_ann = this._doc.annotation;
    if (n_ann.children.length) {
      n_ann.normalize();
      if (d_ann) {
        d_ann.children.push(new FB2EmptyLine());
      } else {
        d_ann = new FB2Annotation();
      }
      d_ann.children.push(new FB2Paragraph("Примечания автора:"));
      n_ann.children.forEach(ne => d_ann.children.push(ne));
    }
    this._doc.annotation = d_ann;
    pdata.result = (n_ann.children.length > 0);
    return pdata;
  }

  startNode(node, depth) {
    if (depth === 0 && node.nodeName === "SUBTITLE") {
      this._stop = true;
      return null;
    }
    return super.startNode(node, depth);
  }

  processElement(fb2el, depth) {
    if (fb2el && !depth) this._annotation.children.push(fb2el);
    return super.processElement(fb2el, depth);
  }
}

class ReadliFB2PageParser extends ReadliFB2Parser {
  constructor() {
    super();
    this._chapter = null;
  }

  run(fb2doc, htmlNode) {
    const pdata = super.run(fb2doc, htmlNode);
    if (this._chapter) this._chapter.normalize();
    return pdata;
  }

  startNode(node, depth) {
    if (depth === 0) {
      switch (node.nodeName) {
        case "H3":
          // Нормализовать предыдущую главу
          if (this._chapter) this._chapter.normalize();
          // Удалить, если без заголовка и пустая.
          // Такое происходит из-за пустых блоков перед заголовком первой главы.
          if (!this._chapter.title && !this._chapter.children.length) this._doc.chapters.pop();
          // Добавить новую главу
          this._chapter = new FB2Chapter(node.textContent.trim());
          this._doc.chapters.push(this._chapter);
          return null;
      }
    }
    return super.startNode(node, depth);
  }

  processElement(fb2el, depth) {
    if (fb2el && !depth) {
      if (!this._chapter) {
        this._chapter = new FB2Chapter();
        this._doc.chapters.push(this._chapter);
      }
      this._chapter.children.push(fb2el);
    }
    return super.processElement(fb2el, depth);
  }
}

class LogElement {
  constructor(element) {
    element.style.padding = ".5em";
    element.style.fontSize = "90%";
    element.style.border = "1px solid lightgray";
    element.style.borderRadius = "6px";
    element.style.textAlign = "left";
    element.style.overflowY = "auto";
    element.style.maxHeight = "50vh";
    this._element = element;
  }

  clean() {
    while (this._element.firstChild) this._element.lastChild.remove();
  }

  message(message, color) {
    const item = document.createElement("div");
    if (message instanceof HTMLElement) {
      item.appendChild(message);
    } else {
      item.textContent = message;
    }
    if (color) item.style.color = color;
    this._element.appendChild(item);
    this._element.scrollTop = this._element.scrollHeight;
    return new LogItemElement(item);
  }

  warning(s) {
    this.message(s, "#a00");
  }
}

class LogItemElement {
  constructor(element) {
    this._element = element;
    this._span = null;
  }

  ok() {
    this._setSpan("ok", "green");
  }

  fail() {
    this._setSpan("ошибка!", "red");
  }

  skipped() {
    this._setSpan("пропущено", "blue");
  }

  text(s) {
    this._setSpan(s, "");
  }

  _setSpan(text, color) {
    if (!this._span) {
      this._span = document.createElement("span");
      this._element.appendChild(this._span);
    }
    this._span.style.color = color;
    this._span.textContent = " " + text;
  }
}

class Settings {
  static get(name, reset) {
    if (reset) Settings._values = null;
    this._ensureValues();
    let val = Settings._values[name];
    switch (name) {
      case "fixlatin":
        if (typeof(val) !== "boolean") val = false;
        break;
    }
    return val;
  }

  static set(name, value) {
    this._ensureValues();
    this._values[name] = value;
  }

  static save() {
    try {
      localStorage.setItem("rbe.settings", JSON.stringify(this._values || {}));
    } catch (err) {
    }
  }

  static _ensureValues() {
    if (this._values) return;
    try {
      this._values = JSON.parse(localStorage.getItem("rbe.settings"));
    } catch (err) {
      this._values = null;
    }
    if (!this._values || typeof(this._values) !== "object") Settings._values = {};
  }
}


//-------------------------

// Запускает скрипт после загрузки страницы сайта
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();

})();
