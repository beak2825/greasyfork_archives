// ==UserScript==
// @name           AuthorTodayExtractor
// @name:ru        AuthorTodayExtractor
// @namespace      90h.yy.zz
// @version        1.9.1
// @author         Ox90
// @match          https://author.today/*
// @description    The script adds a button to the site for downloading books to an FB2 file
// @description:ru Скрипт добавляет кнопку для скачивания книги в формате FB2
// @require        https://update.greasyfork.org/scripts/468831/1575776/HTML2FB2Lib.js
// @grant          GM.xmlHttpRequest
// @grant          unsafeWindow
// @connect        author.today
// @connect        cm.author.today
// @connect        *
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/441304/AuthorTodayExtractor.user.js
// @updateURL https://update.greasyfork.org/scripts/441304/AuthorTodayExtractor.meta.js
// ==/UserScript==

/**
 * Записи вида `@connect` необходимы пользователям tampermonkey для загрузки обложек и изображений внутри глав.
 * Разрешение  `@connect cm.author.today` - для загрузки обложек и дополнительных материалов.
 * Разрешение  `@connect author.today`    - для загрузки обложек у старых книг.
 * Разрешение  `@connect *` необходимо для того, чтобы получить возможность загружать картинки
 *  внутри глав со сторонних ресурсов, когда авторы ссылаются в своих главах на сторонние хостинги картинок.
 *  Такое хоть и редко, но встречается. Это разрешение прописано, чтобы пользователю отображалась кнопка
 *  "Always allow all domains" при подтверждении запроса.
 *  Детали: https://www.tampermonkey.net/documentation.php#_connect
 */

(function start() {
  "use strict";

const PROGRAM_NAME = "ATExtractor";
const PROGRAM_VERSION = GM_info.script.version;

let app = null;
let stage = 0;
let mobile = false;
let mainBtn = null;

/**
 * Начальный запуск скрипта сразу после загрузки страницы сайта
 *
 * @return void
 */
function init() {
  addStyles();
  pageHandler();
  // Следить за ajax контейнером
  const ajax_el = document.getElementById("pjax-container");
  if (ajax_el) (new MutationObserver(() => pageHandler())).observe(ajax_el, { childList: true });
}

/**
 * Начальная идентификация страницы и запуск необходимых функций
 *
 * @return void
 */
function pageHandler() {
  const path = document.location.pathname;
  if (path.startsWith("/account/") || (path.startsWith("/u/") && path.endsWith("/edit")) || path.startsWith("/report/")) {
    // Это страница настроек (личный кабинет пользователя)
    ensureSettingsMenuItems();
    if (path === "/account/settings" && (new URL(document.location)).searchParams.get("script") === "atex") {
      // Это страница настроек скрипта
      handleSettingsPage();
    }
    return;
  }
  if (/work\/\d+$/.test(path)) {
    // Страница книги
    handleWorkPage();
    return;
  }
}

/**
 * Обработчик страницы с книгой. Добавляет кнопку и инициирует необходимые структуры
 *
 * @return void
 */
function handleWorkPage() {
  // Найти и сохранить объект App.
  // App нужен для получения userId, который используется как часть ключа при расшифровке.
  app = window.app || (unsafeWindow && unsafeWindow.app) || {};
  // Добавить кнопку на панель
  setMainButton();
}

/**
 * Находит панель и добавляет туда кнопку, если она отсутствует.
 * Вызывается не только при инициализации скрипта но и при изменениях ajax контейнере сайта
 *
 * @return void
 */
function setMainButton() {
  // Проверить, что это текст, а не, например, аудиокнига, и найти панель для вставки кнопки
  let a_panel = null;
  if (document.querySelector("div.book-action-panel a[href^='/reader/']")) {
    a_panel = document.querySelector("div.book-panel div.book-action-panel");
    mobile = false;
  } else if (document.querySelector("div.work-details div.row a[href^='/reader/']")) {
    a_panel = document.querySelector("div.work-details div.row div.btn-library-work");
    a_panel = a_panel && a_panel.parentElement;
    mobile = true;
  }
  if (!a_panel) return;

  if (!mainBtn) {
    // Похоже кнопки нет. Создать кнопку и привязать действие.
    mainBtn = createButton(mobile);
    const ael = mobile && mainBtn || mainBtn.children[0];
    ael.addEventListener("click", event => {
      event.preventDefault();
      displayDownloadDialog();
    });
  }

  if (!a_panel.contains(mainBtn)) {
    // Выбрать позицию для кнопки: или после оригинальной, или перед группой кнопок внизу.
    // Если не удалось найти нужную позицию, тогда добавить кнопку как последнюю в панели.
    let sbl = null;
    if (!mobile) {
      sbl = a_panel.querySelector("div.mt-lg>a.btn>i.icon-download");
      sbl && (sbl = sbl.parentElement.parentElement.nextElementSibling);
    } else {
      sbl = a_panel.querySelector("#btn-download");
      if (sbl) sbl = sbl.nextElementSibling;
    }
    if (!sbl) {
      if (!mobile) {
        sbl = document.querySelector("div.mt-lg.text-center");
      } else {
        sbl = a_panel.querySelector("a.btn-work-more");
      }
    }
    // Добавить кнопку на страницу книги
    if (sbl) {
      a_panel.insertBefore(mainBtn, sbl);
    } else {
      a_panel.appendChild(mainBtn);
    }
  }
}

/**
 * Создает и возвращает элемент кнопки, которая размещается на странице книги
 *
 * @return Element HTML-элемент кнопки для добавления на страницу
 */
function createButton() {
  let btn = null;
  if (!mobile) {
    btn = document.createElement("div");
    btn.classList.add("mt-lg");
    btn.innerHTML = "<button style=\"border-color:green;\" class=\"btn btn-default btn-block\"><i class=\"icon-download\"></i> </button>";
  } else {
    btn = document.createElement("a");
    btn.classList.add("btn", "btn-default", "btn-download-work");
    btn.innerHTML = "<i class=\"icon-download\"></i> ";
  }
  btn.setText = function(text) {
    const el = this.nodeName === "A" ? this : this.querySelector("button");
    el.childNodes[1].textContent = " " + (text || "Скачать FB2");
  };
  btn.setText();
  return btn;
}

/**
 * Обработчик нажатия кнопки "Скачать FB2" на странице книги
 *
 * @return void
 */
async function displayDownloadDialog() {
  if (mainBtn.disabled) return;
  try {
    mainBtn.disabled = true;
    mainBtn.setText("Анализ...");
    const params = getBookOverview();
    let log = null;
    let doc = new FB2DocumentEx();
    doc.bookTitle = params.title;
    doc.id = params.workId;
    doc.idPrefix = "atextr_";
    doc.status = params.status;
    doc.programName = PROGRAM_NAME + " v" + PROGRAM_VERSION;
    const chapters = await getChaptersList(params);
    doc.totalChapters = chapters.length;
    const dlg = new DownloadDialog({
      title: "Формирование файла FB2 (v" + PROGRAM_VERSION + ")",
      annotation: !!params.authorNotes,
      cover: !!params.cover,
      materials: !!params.materials,
      settings: {
        addnotes: Settings.get("addnotes"),
        addcover: Settings.get("addcover"),
        addimages: Settings.get("addimages"),
        materials: Settings.get("materials")
      },
      chapters: chapters,
      onclose: () => {
        Loader.abortAll();
        log = null;
        doc = null;
        if (dlg.link) {
          URL.revokeObjectURL(dlg.link.href);
          dlg.link = null;
        }
      },
      onsubmit: result => {
        result.cover = params.cover;
        result.bookPanel = params.bookPanel;
        result.annotation = params.annotation;
        if (result.authorNotes) result.authorNotes = params.authorNotes;
        if (result.materials) result.materials = params.materials;
        dlg.result = result;
        makeAction(doc, dlg, log);
      }
    });
    dlg.show();
    log = new LogElement(dlg.log);
    if (chapters.length) {
      setStage(0);
    } else {
      dlg.button.textContent = setStage(3);
      dlg.nextPage();
      log.warning("Нет доступных глав для выгрузки!");
    }
  } catch (err) {
    console.error(err);
    Notification.display(err.message, "error");
  } finally {
    mainBtn.disabled = false;
    mainBtn.setText();
  }
}

/**
 * Фактический обработчик нажатий на кнопку формы выгрузки
 *
 * @param FB2Document    doc Формируемый документ
 * @param DownloadDialog dlg Экземпляр формы выгрузки
 * @param LogElement     log Лог для фиксации прогресса
 *
 * @return void
 */
async function makeAction(doc, dlg, log) {
  try {
    switch (stage) {
      case 0:
        dlg.button.textContent = setStage(1);
        dlg.nextPage();
        await getBookContent(doc, dlg.result, log);
        if (stage == 1) dlg.button.textContent = setStage(2);
        break;
      case 1:
        Loader.abortAll();
        dlg.button.textContent = setStage(3);
        log.warning("Операция прервана");
        Notification.display("Операция прервана", "warning");
        break;
      case 2:
        if (!dlg.link) {
          dlg.link = document.createElement("a");
          dlg.link.setAttribute("download", genBookFileName(doc, { chaptersRange: dlg.result.chaptersRange }));
          // Должно быть text/plain, но в этом случае мобильный Firefox к имени файла добавляет .txt
          dlg.link.href = URL.createObjectURL(new Blob([ doc ], { type: "application/octet-stream" }));
        }
        dlg.link.click();
        break;
      case 3:
        dlg.hide();
        break;
    }
  } catch (err) {
    if (err.name !== "AbortError") {
      console.error(err);
      log.message(err.message, "red");
      Notification.display(err.message, "error");
    }
    dlg.button.textContent = setStage(3);
  }
}

/**
 * Выбор стадии работы скрипта
 *
 * @param int new_stage Числовое значение новой стадии
 *
 * @return string Текст для кнопки диалога
 */
function setStage(new_stage) {
  stage = new_stage;
  return [ "Продолжить", "Прервать", "Сохранить в файл", "Закрыть" ][new_stage] || "Error";
}

/**
 * Возвращает объект с предварительными результатами анализа книги
 *
 * @return Object
 */
function getBookOverview() {
  const res = {};

  res.bookPanel = document.querySelector("div.book-panel div.book-meta-panel") ||
    document.querySelector("div.work-details div.work-header-content");

  res.title = res.bookPanel && (res.bookPanel.querySelector(".book-title") || res.bookPanel.querySelector(".card-title"));
  res.title = res.title ? res.title.textContent.trim() : null;

  const wid = /^\/work\/(\d+)$/.exec(document.location.pathname);
  res.workId = wid && wid[1] || null;

  const status_el = res.bookPanel && res.bookPanel.querySelector(".book-status-icon");
  if (status_el) {
    if (status_el.classList.contains("icon-check")) {
      res.status = "finished";
    } else if (status_el.classList.contains("icon-pencil")) {
      res.status = "in-progress";
    }
  } else {
    res.status = "fragment";
  }

  const empty = el => {
    if (!el) return false;
    // Считается что аннотация есть только в том случае,
    // если имеются непустые текстовые ноды или элементы <p> непосредственно в блоке аннотации
    return !Array.from(el.childNodes).some(node => {
      return (node.nodeName === "#text" || node.nodeName === "P") && node.textContent.trim() !== "";
    });
  };

  let annotation = mobile ?
    document.querySelector("div.card-content-inner>div.card-description") :
    (res.bookPanel && res.bookPanel.querySelector("#tab-annotation>div.annotation"));
  if (annotation.children.length > 0) {
    const notes = annotation.querySelector(":scope>div.rich-content>p.text-primary.mb0");
    if (notes && !empty(notes.parentElement)) res.authorNotes = notes.parentElement;
    annotation = annotation.querySelector(":scope>div.rich-content");
    if (!empty(annotation) && annotation !== notes) res.annotation = annotation;
  }

  const cover = mobile ?
    document.querySelector("div.work-cover>.work-cover-content>img.cover-image") :
    document.querySelector("div.book-cover>.book-cover-content>img.cover-image");
  if (cover) {
    res.cover = cover;
  }

  const materials = mobile ?
    document.querySelector("#accordion-item-materials>div.accordion-item-content div.picture") :
    res.bookPanel && res.bookPanel.querySelector("div.book-materials div.picture");
  if (materials) {
    res.materials = materials;
  }

  return res;
}

/**
 * Возвращает список глав из DOM-дерева сайта в формате
 * { title: string, locked: bool, workId: string, chapterId: string }.
 *
 * @return array Массив объектов с данными о главах
 */
async function getChaptersList(params) {
  const el_list = document.querySelectorAll(
    mobile &&
    "div.work-table-of-content>ul.list-unstyled>li" ||
    "div.book-tab-content>div#tab-chapters>ul.table-of-content>li"
  );

  if (!el_list.length) {
    // Не найдено ни одной главы, возможно это рассказ
    // Запрашивает первую главу чтобы получить объект в исходном HTML коде ответа сервера
    let chapters = null;
    try {
      const r = await Loader.addJob(new URL(`/reader/${params.workId}`, document.location), {
        method: "GET",
        responseType: "text"
      });
      const meta = /app\.init\("readerIndex",\s*(\{[\s\S]+?\})\s*\)/.exec(r.response); // Ищет строку инициализации с данными главы
      if (!meta) throw new Error("Не найдены метаданные книги в ответе сервера");
      let w_id = /\bworkId\s*:\s*(\d+)/.exec(r.response);
      w_id = w_id && w_id[1] || params.workId;
      let c_ls = /\bchapters\s*:\s*(\[.+\])\s*,?[\n\r]+/.exec(r.response);
      c_ls = c_ls && c_ls[1] || "[]";
      chapters = (JSON.parse(c_ls) || []).map(ch => {
        return { title: ch.title, workId: w_id, chapterId: "" + ch.id };
      });
      const w_fm = /\bworkForm\s*:\s*"(.+)"/.exec(r.response);
      if (w_fm && w_fm[1].toLowerCase() === "story" && chapters.length === 1) chapters[0].title = "";
      chapters[0].locked = false;
    } catch (err) {
      console.error(err);
      throw new Error("Ошибка загрузки метаданных главы");
    }
    return chapters;
  }
  // Анализирует найденные HTML элементы с главами
  const res = [];
  for (let i = 0; i < el_list.length; ++i) {
    const el = el_list[i].children[0];
    if (el) {
      let ids = null;
      const title = el.textContent;
      let locked = false;
      if (el.tagName === "A" && el.hasAttribute("href")) {
        ids = /^\/reader\/(\d+)\/(\d+)$/.exec((new URL(el.href)).pathname);
      } else if (el.tagName === "SPAN") {
        if (el.parentElement.querySelector("i.icon-lock")) locked = true;
      }
      if (title && (ids || locked)) {
        const ch = { title: title, locked: locked };
        if (ids) {
          ch.workId = ids[1];
          ch.chapterId = ids[2];
        }
        res.push(ch);
      }
    }
  }
  return res;
}

/**
 * Производит формирование описания книги, загрузку и анализ глав и доп.материалов
 *
 * @param FB2DocumentEx doc   Формируемый документ
 * @param Object        bdata Объект с предварительными данными
 * @param LogElement    log   Лог для фиксации процесса формирования книги
 *
 * @return void
 */
async function getBookContent(doc, bdata, log) {
  await extractDescriptionData(doc, bdata, log);
  if (stage !== 1) return;

  log.message("---");
  await extractChapters(
    doc,
    bdata.chapters,
    { noImages: !bdata.addimages, footnotes: Settings.get("footnotes") },
    log
  );
  if (stage !== 1) return;

  if (bdata.materials) {
    log.message("---");
    log.message("Дополнительные материалы:");
    await extractMaterials(doc, bdata.materials, log);
    ++doc.extraChapters;
    if (stage !== 1) return;
  }
  if (doc.wishes.likes || doc.wishes.comments) {
    log.message("---");
    log.message("Обращение к читателю:");
    addWishesChapter(doc, log);
    ++doc.extraChapters;
  }
  if (bdata.addimages) {
    const icnt = doc.binaries.reduce((cnt, img) => {
      if (!img.value) ++cnt;
      return cnt;
    }, 0);
    if (icnt) {
      log.message("---");
      log.warning(`Проблемы с загрузкой изображений: ${icnt}`);
      await new Promise(resolve => setTimeout(resolve, 100)); // Для обновления лога
      if (confirm("Имеются незагруженные изображения. Использовать заглушку?")) {
        const li = log.message("Применение заглушки...");
        try {
          const img = getDummyImage();
          replaceBadImages(doc, img);
          doc.binaries.push(img);
          li.ok();
        } catch (err) {
          li.fail();
          throw err;
        }
      } else {
        log.message("Проблемные изображения заменены на текст");
      }
    }
  }
  let webpList = [];
  const imgTypes = doc.binaries.reduce((map, bin) => {
    if (bin instanceof FB2Image && bin.value) {
      const type = bin.type;
      map.set(type, (map.get(type) || 0) + 1);
      if (type === "image/webp") webpList.push(bin);
    }
    return map;
  }, new Map());
  if (imgTypes.size) {
    log.message("---");
    log.message("Изображения:");
    imgTypes.forEach((cnt, type) => log.message(`- ${type}: ${cnt}`));
    if (webpList.length) {
      log.warning("Найдены изображения формата WebP. Могут быть проблемы с отображением на старых читалках.");
      await new Promise(resolve => setTimeout(resolve, 100)); // Для обновления лога
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
  }
  if (doc.footnotesCount > 0) {
    log.message("---");
    log.message(`Найдены сноски внутри глав: ${doc.footnotesCount}`);
    if (!Settings.get("footnotes")) log.message("Формирование сносок отключено в настройках");
  }
  if (doc.unknowns) {
    log.message("---");
    log.warning(`Найдены неизвестные элементы: ${doc.unknowns}`);
    log.message("Преобразованы в текст без форматирования");
  }
  doc.history.push("v1.0 - создание fb2 - (Ox90)");
  log.message("---");
  log.message("Готово!");
  if (Settings.get("sethint", true)) {
    log.message("---");
    const hint = document.createElement("span");
    hint.innerHTML =
      "<i>Для формирования имени файла будет использован следующий шаблон: <b>" + Settings.get("filename") +
      "</b>. Вы можете настроить скрипт и отключить это сообщение в " +
      " <a href=\"/account/settings?script=atex\" target=\"_blank\">в личном кабинете</a>.</i>";
    log.message(hint);
  }
}

/**
 * Извлекает доступные данные описания книги из DOM элементов сайта
 *
 * @param FB2DocumentEx doc   Формируемый документ
 * @param Object        bdata Объект с предварительными данными
 * @param LogElement    log   Лог для фиксации процесса формирования книги
 *
 * @return void
 */
async function extractDescriptionData(doc, bdata, log) {
  if (!bdata.bookPanel) throw new Error("Не найдена панель с информацией о книге!");
  if (!doc.bookTitle) throw new Error("Не найден заголовок книги");
  const book_panel = bdata.bookPanel;

  // Версия скрипта
  log.message(PROGRAM_NAME + ' v' + PROGRAM_VERSION);
  // Название книги
  log.message("Заголовок:").text(doc.bookTitle);
  // Авторы
  const authors = mobile ?
    book_panel.querySelectorAll("div.card-author>a") :
    book_panel.querySelectorAll("div.book-authors>span[itemprop=author]>a");
  doc.bookAuthors = Array.from(authors).reduce((list, el) => {
    const au = el.textContent.trim();
    if (au) {
      const a = new FB2Author(au);
      const hp = /^\/u\/([^\/]+)\/works(?:\?|$)/.exec((new URL(el.href)).pathname);
      if (hp) a.homePage = (new URL(`/u/${hp[1]}`, document.location)).toString();
      list.push(a);
    }
    return list;
  }, []);
  if (!doc.bookAuthors.length) throw new Error("Не найдена информация об авторах");
  log.message("Авторы:").text(doc.bookAuthors.length);
  // Жанры
  let genres = mobile ?
    book_panel.querySelectorAll("div.work-stats a[href^=\"/work/genre/\"]") :
    book_panel.querySelectorAll("div.book-genres a[href^=\"/work/genre/\"]");
  genres = Array.from(genres).reduce((list, el) => {
    const s = el.textContent.trim();
    if (s) list.push(s);
    return list;
  }, []);
  doc.genres = new FB2GenreList(genres);
  if (doc.genres.length) {
    console.info("Жанры: " + doc.genres.map(g => g.value).join(", "));
  } else {
    console.warn("Не идентифицирован ни один жанр!");
  }
  log.message("Жанры:").text(doc.genres.length);
  // Ключевые слова
  const tags = mobile ?
    document.querySelectorAll("div.work-details ul.work-tags a[href^=\"/work/tag/\"]") :
    book_panel.querySelectorAll("span.tags a[href^=\"/work/tag/\"]");
  doc.keywords = Array.from(tags).reduce((list, el) => {
    const tag = el.textContent.trim();
    if (tag) list.push(tag);
    return list;
  }, []);
  log.message("Ключевые слова:").text(doc.keywords.length || "нет");
  // Серия
  let seq_el = Array.from(book_panel.querySelectorAll("div>a")).find(el => {
    return el.href && /^\/work\/series\/\d+$/.test((new URL(el.href)).pathname);
  });
  if (seq_el) {
    const name = seq_el.textContent.trim();
    if (name) {
      const seq = { name: name };
      seq_el = seq_el.nextElementSibling;
      if (seq_el && seq_el.tagName === "SPAN") {
        const num = /^#(\d+)$/.exec(seq_el.textContent.trim());
        if (num) seq.number = num[1];
      }
      doc.sequence = seq;
      log.message("Серия:").text(name);
      if (seq.number) log.message("Номер в серии:").text(seq.number);
    }
  }
  // Дата публикации книги (последнее обновление)
  const dt = book_panel.querySelector("span[data-format=calendar-short][data-time]");
  if (dt) {
    const d = new Date(dt.getAttribute("data-time"));
    if (!isNaN(d.valueOf())) doc.bookDate = d;
  }
  log.message("Последнее обновление:").text(doc.bookDate ? FB2Utils.dateToAtom(doc.bookDate) : "n/a");
  // Ссылка на источник
  doc.sourceURL = document.location.origin + document.location.pathname;
  log.message("Источник:").text(doc.sourceURL);
  // Обложка книги
  if (bdata.cover) {
    const src = bdata.cover.src;
    if (src) {
      const li = log.message("Загрузка обложки...");
      if (!bdata.skipCover) {
        const img = new FB2Image(src);
        try {
          await img.load((loaded, total) => li.text("" + Math.round(loaded / total * 100) + "%"));
          img.id = "cover" + img.suffix();
          doc.coverpage = img;
          doc.binaries.push(img);
          li.ok();
          log.message("Размер обложки:").text(img.size + " байт");
          log.message("Тип обложки:").text(img.type);
        } catch (err) {
          li.fail();
          throw err;
        }
      } else {
        li.skipped();
      }
    }
  }
  if (!bdata.cover || (!doc.coverpage && !bdata.skipCover)) log.warning("Обложка книги не найдена!");
  // Аннотация
  if (bdata.annotation || bdata.authorNotes) {
    const li = log.message("Анализ аннотации...");
    try {
      doc.bindParser("a", new AnnotationParser());
      if (bdata.annotation) {
        await doc.parse("a", log, {}, bdata.annotation);
      }
      if (bdata.authorNotes) {
        if (doc.annotation && doc.annotation.children.length) {
          // Пустая строка между аннотацией и примечаниями автора
          doc.annotation.children.push(new FB2EmptyLine());
        }
        await doc.parse("a", log, {}, bdata.authorNotes);
      }
      li.ok();
    } catch (err) {
      li.fail();
      throw err;
    } finally {
      doc.bindParser();
    }
  } else {
    log.warning("Нет аннотации!");
  }
}

/**
 * Запрашивает выбранные ранее части книги с сервера по переданному в аргументе списку.
 * Главы запрашиваются последовательно, чтобы не удивлять сервер запросами всех глав одновременно.
 *
 * @param FB2DocumentEx doc     Формируемый документ
 * @param Array         desired Массив с описанием глав для выгрузки (id и название)
 * @param object        params  Параметры формирования глав
 * @param LogElement    log     Лог для фиксации процесса формирования книги
 *
 * @return void
 */
async function extractChapters(doc, desired, params, log) {
  let li = null;
  try {
    const total = desired.length;
    let position = 0;
    let processFootnotes = params.footnotes;
    let footnotesCount = 0;
    doc.bindParser("c", new ChapterParser());
    for (const ch of desired) {
      if (stage !== 1) break;
      li = log.message(`Получение главы ${++position}/${total}...`);
      const html = await getChapterContent(ch.workId, ch.chapterId);
      await doc.parse("c", log, params, html.body, ch.title);
      const noteCount = makeFootnotes(doc, doc.chapters[doc.chapters.length - 1], !processFootnotes);
      li.ok();
      if (noteCount) {
        log.message(`Найдены сноски: ${noteCount}${processFootnotes ? "" : " [игнор]"}`);
        footnotesCount += noteCount;
      }
    }
    doc.footnotesCount = footnotesCount;
  } catch (err) {
    if (li) li.fail();
    throw err;
  } finally {
    doc.bindParser();
  }
}

/**
 * Запрашивает содержимое указанной главы с сервера
 *
 * @param string workId    Id книги
 * @param string chapterId Id главы
 *
 * @return HTMLDocument главы книги
 */
async function getChapterContent(workId, chapterId) {
  // workId числовой, отфильтрован регуляркой, кодировать для запроса не нужно
  const url = new URL(`/reader/${workId}/chapter`, document.location);
  url.searchParams.set("id", chapterId);
  url.searchParams.set("_", Date.now());
  const result = await Loader.addJob(url, {
    method: "GET",
    headers: { "Accept": "application/json, text/javascript, */*; q=0.01" },
    responseType: "text"
  });
  let response = null;
  try {
    response = JSON.parse(result.response);
  } catch (err) {
    console.error(err);
    throw new Error("Неожиданный ответ сервера");
  }
  if (!response.isSuccessful) {
    if (Array.isArray(response.messages) && response.messages.length) {
      if (response.messages[0].toLowerCase() === "unadulted") {
        throw new Error("Контент для взрослых. Зайдите в любую главу книги, подтвердите свой возраст и попробуйте снова");
      }
    }
    throw new Error("Сервер ответил: Unsuccessful");
  }
  const readerSecret = result.headers.get("reader-secret");
  if (!readerSecret) throw new Error("Не найден ключ для расшифровки текста");
  // Декодировать ответ от сервера
  const chapterString = decryptText(response, readerSecret);
  // Преобразовать в HTML элемент.
  // Присваивание innerHTML не ипользуется по причине его небезопасности.
  // Лучше перестраховаться на случай возможного внедрения скриптов в тело книги.
  return new DOMParser().parseFromString(chapterString, "text/html");
}

/**
 * Ищет сноски внутри главы и при возможности формирует их
 *
 * @param FB2DocumentEx doc     Формируемый документ
 * @param FB2Chapter    chapter Глава для поиска сносок
 * @param boolean       dry     Если true, то добавление сносок лишь имитируется, без реального добавления
 *
 * @return number Количество созданных сносок
 */
function makeFootnotes(doc, chapter, dry) {
  if (chapter.children.length < 2) return 0;
  const fnIds = new Map();
  let startId = doc.notes.length + 1;
  // Найти сноски с текстом начиная с конца главы
  let fnIndex = chapter.children.length - 1;
  for ( ; fnIndex > 0; --fnIndex) {
    const el = chapter.children[fnIndex];
    // Элемент должен быть параграфом
    if (!(el instanceof FB2Paragraph)) break;
    // Содержимое элемента должно иметь формат: [123] текст
    const r = /^\s*\[(\d+)\]\s+(.+)$/.exec(el.textContent());
    if (!r) break;
    // Идентификаторы сносок должны быть уникальны в пределах одной главы
    if (fnIds.has(r[1])) {
      if (!dry) console.warn("Дублирование идентификатора сноски!");
      return 0;
    }
    fnIds.set(r[1], new FB2Note(r[2], ""));
  }
  if (!fnIds.size) return 0;
  // Найти в тексте все ссылки на сноски и сохранить их
  const fnElements = [];
  const fnLinks = new Set();
  function findNoteLinks(ch, par) {
    if (ch.children.length) {
      return ch.children.every(c => findNoteLinks(c, ch));
    }
    if ((ch instanceof FB2Text || ch instanceof FB2InlineMarkup) && ch.value) {
      const m = ch.value.match(/\[\d+\]/g);
      if (m) {
        for (const s of m) {
          const ss = s.slice(1, -1);
          if (fnLinks.has(ss)) {
            if (!dry) console.warn("Дублирование идентификатора сноски в тексте!");
            return false;
          }
          if (fnIds.has(ss)) {
            fnLinks.add(ss);
            fnElements.push([ par, ch, ss ]);
          }
        }
      }
    }
    return true;
  }
  for (let i = 0; i <= fnIndex; ++i) {
    findNoteLinks(chapter.children[i], chapter);
  }
  // Количество ссылок на сноски должно совпадать с количеством сносок
  if (fnElements.length !== fnIds.size) {
    if (!dry) console.warn("Количество сносок не сопадает с количеством ссылок на сноски!");
    return 0;
  }
  if (!dry) {
    // Заменить ссылки в тексте и добавить сноски в документ
    fnElements.forEach(it => {
      const el = it[1];
      const fn = fnIds.get(it[2]);
      const sep = `[${it[2]}]`;
      it[0].children = it[0].children.reduce((res, ch) => {
        if (ch === el) {
          const ss = ch.value.split(sep);
          if (ch instanceof FB2Text) {
            res.push(new FB2Text(ss[0]), fn, new FB2Text(ss[1]));
          } else {
            res.push(new FB2InlineMarkup(ch.name, ss[0]), fn, new FB2InlineMarkup(ch.name, ss[1]));
          }
          fn.title = "" + startId++;
          doc.notes.push(fn);
        } else {
          res.push(ch);
        }
        return res;
      }, []);
    });
    // Удалить сноски в конце главы
    for (let i = fnIds.size; i; --i) chapter.children.pop();
  }
  return fnIds.size;
}

/**
 * Расшифровывает полученную от сервера строку с текстом
 *
 * @param chapter string Зашифованная глава книги, полученная от сервера
 * @param secret  string Часть ключа для расшифровки
 *
 * @return string Расшифрованный текст
 */
function decryptText(chapter, secret) {
  let ss = secret.split("").reverse().join("") + "@_@" + (app.userId || "");
  let slen = ss.length;
  let clen = chapter.data.text.length;
  let result = [];
  for (let pos = 0; pos < clen; ++pos) {
    result.push(String.fromCharCode(chapter.data.text.charCodeAt(pos) ^ ss.charCodeAt(Math.floor(pos % slen))));
  }
  return result.join("");
}

/**
 * Просматривает элементы с картинками в дополнительных материалах,
 * затем загружает их по ссылкам и сохраняет в виде массива с описанием, если оно есть.
 *
 * @param FB2DocumentEx doc       Формируемый документ
 * @param Element       materials HTML-элемент с дополнительными материалами
 * @param LogElement    log       Лог для фиксации процесса формирования книги
 *
 * @return void
 */
async function extractMaterials(doc, materials, log) {
  const list = Array.from(materials.querySelectorAll("figure")).reduce((res, el) => {
    const link = el.querySelector("a");
    if (link && link.href) {
      const ch = new FB2Chapter();
      const cp = el.querySelector("figcaption");
      const ds = (cp && cp.textContent.trim() !== "") ? cp.textContent.trim() : "Без описания";
      const im = new FB2Image(link.href);
      ch.children.push(new FB2Paragraph(ds));
      ch.children.push(im);
      res.push(ch);
      doc.binaries.push(im);
    }
    return res;
  }, []);

  let cnt = list.length;
  if (cnt) {
    let pos = 0;
    while (true) {
      const l = [];
      // Грузить не более 5 картинок за раз
       while (pos < cnt && l.length < 5) {
        const li = log.message("Загрузка изображения...");
        l.push(list[pos++].children[1].load((loaded, total) => li.text(`${Math.round(loaded / total * 100)}%`))
            .then(() => li.ok())
            .catch(err => {
              li.fail();
              if (err.name === "AbortError") throw err;
            })
        );
      }
      if (!l.length || stage !== 1) break;
      await Promise.all(l);
    }
    const ch = new FB2Chapter("Дополнительные материалы");
    ch.children = list;
    doc.chapters.push(ch);
  } else {
    log.warning("Изображения не найдены");
  }
}

/**
 * Добавляет главу с обращением к читателю по результатам сканирования хештегов
 *
 * @param FB2DocumentEx doc Формируемый документ
 * @param LogElement    log Лог для фиксации процесса формирования книги
 *
 * @return void
 */
function addWishesChapter(doc, log) {
  const li = log.message("Формирование раздела...");
  let wl = [];
  try {
    if (doc.wishes.likes) wl.push("наградите автора лайком");
    if (doc.wishes.comments) wl.push("оставьте отзыв");

    const ch = new FB2Chapter("Обращение к читателю");
    const p = new FB2Paragraph();
    p.children.push(new FB2Text("Если вам понравилась книга, " + wl.join(" или ") + ": "));
    const l = new FB2Link(doc.sourceURL);
    l.value = doc.sourceURL;
    p.children.push(l);
    ch.children.push(p);
    doc.chapters.push(ch);
    li.ok();
  } catch (err) {
    li.fail();
    throw err;
  }
}

/**
 * Создает картинку-заглушку в фомате png
 *
 * @return FB2Image
 */
function getDummyImage() {
  const WIDTH = 300;
  const HEIGHT = 150;
  let canvas = document.createElement("canvas");
  canvas.setAttribute("width", WIDTH);
  canvas.setAttribute("height", HEIGHT);
  if (!canvas.getContext) throw new Error("Ошибка работы с элементом canvas");
  let ctx = canvas.getContext("2d");
  // Фон
  ctx.fillStyle = "White";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  // Обводка
  ctx.lineWidth = 4;
  ctx.strokeStyle = "Gray";
  ctx.strokeRect(0, 0, WIDTH, HEIGHT);
  // Тень
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 2;
  ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
  // Крест
  let margin = 25;
  let size = 40;
  ctx.lineWidth = 10;
  ctx.strokeStyle = "Red";
  ctx.moveTo(WIDTH / 2 - size / 2, margin);
  ctx.lineTo(WIDTH / 2 + size / 2, margin + size);
  ctx.stroke();
  ctx.moveTo(WIDTH / 2 + size / 2, margin);
  ctx.lineTo(WIDTH / 2 - size / 2, margin + size);
  ctx.stroke();
  // Текст
  ctx.font = "42px Times New Roman";
  ctx.fillStyle = "Black";
  ctx.textAlign = "center";
  ctx.fillText("No image", WIDTH / 2, HEIGHT - 30, WIDTH);
  // Формирование итогового FB2 элемента
  const img = new FB2Image();
  img.id = "dummy.png";
  img.type = "image/png";
  let data_str = canvas.toDataURL(img.type);
  img.value = data_str.substr(data_str.indexOf(",") + 1);
  return img;
}

/**
 * Замена всех незагруженных изображений другим изображением
 *
 * @param FB2DocumentEx doc Формируемый документ
 * @param FB2Image      img Изображение для замены
 *
 * @return void
 */
function replaceBadImages(doc, img) {
  const replaceChildren = function(fr, img) {
    for (let i = 0; i < fr.children.length; ++i) {
      const ch = fr.children[i];
      if (ch instanceof FB2Image) {
        if (!ch.value) fr.children[i] = img;
      } else {
        replaceChildren(ch, img);
      }
    }
  };
  if (doc.annotation) replaceChildren(doc.annotation, img);
  doc.chapters.forEach(ch => replaceChildren(ch, img));
  if (doc.materials) replaceChildren(doc.materials, img);
}

/**
 * Формирует имя файла для книги
 *
 * @param FB2DocumentEx doc   FB2 документ
 * @param Object        extra Дополнительные данные
 *
 * @return string Имя файла с расширением
 */
function genBookFileName(doc, extra) {
  function xtrim(s) {
    const r = /^[\s=\-_.,;!]*(.+?)[\s=\-_.,;!]*$/.exec(s);
    return r && r[1] || s;
  }

  const fn_template = Settings.get("filename", true).trim();
  const ndata = new Map();
  // Автор [\a]
  const author = doc.bookAuthors[0];
  if (author) {
    const author_names = [ author.firstName, author.middleName, author.lastName ].reduce(function(res, nm) {
      if (nm) res.push(nm);
      return res;
    }, []);
    if (author_names.length) {
      ndata.set("a", author_names.join(" "));
    } else if (author.nickName) {
      ndata.set("a", author.nickName);
    }
  }
  // Серия [\s, \n, \N]
  const seq_names = [];
  if (doc.sequence && doc.sequence.name) {
    const seq_name = xtrim(doc.sequence.name);
    if (seq_name) {
      const seq_num = doc.sequence.number;
      if (seq_num) {
        ndata.set("n", seq_num);
        ndata.set("N", (seq_num.length < 2 ? "0" : "") + seq_num);
        seq_names.push(seq_name + " " + seq_num);
      }
      ndata.set("s", seq_name);
      seq_names.push(seq_name);
    }
  }
  // Название книги. Делается попытка вырезать название серии из названия книги [\t]
  // Название серии будет удалено из названия книги лишь в том случае, если оно присутвует в шаблоне.
  let book_name = xtrim(doc.bookTitle);
  if (ndata.has("s") && fn_template.includes("\\s")) {
    const book_lname = book_name.toLowerCase();
    const book_len = book_lname.length;
    for (let i = 0; i < seq_names.length; ++i) {
      const seq_lname = seq_names[i].toLowerCase();
      const seq_len = seq_lname.length;
      if (book_len - seq_len >= 5) {
        let str = null;
        if (book_lname.startsWith(seq_lname)) str = xtrim(book_name.substr(seq_len));
          else if (book_lname.endsWith(seq_lname)) str = xtrim(book_name.substr(-seq_len));
        if (str) {
          if (str.length >= 5) book_name = str;
          break;
        }
      }
    }
  }
  ndata.set("t", book_name);
  // Статус скачиваемой книжки [\b]
  let status = "";
  if (doc.totalChapters === doc.chapters.length - doc.extraChapters) {
    switch (doc.status) {
      case "finished":
        status = "F";
        break;
      case "in-progress":
        status = "U";
        break;
      case "fragment":
        status = "P";
        break;
    }
  } else {
    status = "P";
  }
  ndata.set("b", status);
  // Выбранные главы [\c]
  // Если цикл завершен и выбраны все главы (статус "F"), то возвращается пустое значение.
  if (status != "F") {
    const cr = extra.chaptersRange;
    ndata.set("c", cr[0] === cr[1] ? `${cr[0]}` : `${cr[0]}-${cr[1]}`);
  }
  // Id книги [\i]
  ndata.set("i", doc.id);
  // Окончательное формирование имени файла плюс дополнительные чистки и проверки.
  function replacer(str) {
    let cnt = 0;
    const new_str = str.replace(/\\([asnNtbci])/g, (match, ti) => {
      const res = ndata.get(ti);
      if (res === undefined) return "";
      ++cnt;
      return res;
    });
    return { str: new_str, count: cnt };
  }
  function processParts(str, depth) {
    const parts = [];
    const pos = str.indexOf('<');
    if (pos !== 0) {
      parts.push(replacer(pos == -1 ? str : str.slice(0, pos)));
    }
    if (pos != -1) {
      let i = pos + 1;
      let n = 1;
      for ( ; i < str.length; ++i) {
        const c = str[i];
        if (c == '<') {
          ++n;
        } else if (c == '>') {
          --n;
          if (!n) {
            parts.push(processParts(str.slice(pos + 1, i), depth + 1));
            break;
          }
        }
      }
      if (++i < str.length) parts.push(processParts(str.slice(i), depth));
    }
    const sa = [];
    let cnt = 0
    for (const it of parts) {
      sa.push(it.str);
      cnt += it.count;
    }
    return {
      str: (!depth || cnt) ? sa.join("") : "",
      count: cnt
    };
  }
  const fname = processParts(fn_template, 0).str.replace(/[\0\/\\\"\*\?\<\>\|:]+/g, "");
  return `${fname.substr(0, 250)}.fb2`;
}

/**
 * Создает пункт меню настроек скрипта если не существует
 *
 * @return void
 */
function ensureSettingsMenuItems() {
  const menu = document.querySelector("aside nav ul.nav");
  if (!menu || menu.querySelector("li.atex-settings")) return;
  let item = document.createElement("li");
  if (!menu.querySelector("li.Ox90-settings-menu")) {
    item.classList.add("nav-heading", "Ox90-settings-menu");
    menu.appendChild(item);
    item.innerHTML = '<span><i class="icon-cogs icon-fw"></i> Внешние скрипты</span>';
    item = document.createElement("li");
  }
  item.classList.add("atex-settings");
  menu.appendChild(item);
  item.innerHTML = '<a class="nav-link" href="/account/settings?script=atex">AutorTodayExtractor</a>';
}

/**
 * Генерирует страницу настроек скрипта
 *
 * @return void
 */
function handleSettingsPage() {
  // Изменить активный пункт меню
  const menu = document.querySelector("aside nav ul.nav");
  if (menu) {
    const active = menu.querySelector("li.active");
    active && active.classList.remove("active");
    menu.querySelector("li.atex-settings").classList.add("active");
  }
  // Найти секцию с контентом
  const section = document.querySelector("#pjax-container section.content");
  if (!section) return;
  // Очистить секцию
  while (section.firstChild) section.lastChild.remove();
  // Создать свою панель и добавить в секцию
  const panel = document.createElement("div");
  panel.classList.add("panel", "panel-default");
  section.appendChild(panel);
  panel.innerHTML = '<div class="panel-heading">Параметры скрипта AuthorTodayExtractor</div>';
  const body = document.createElement("div");
  body.classList.add("panel-body");
  panel.appendChild(body);
  const form = document.createElement("form");
  form.method = "post";
  form.style.display = "flex";
  form.style.rowGap = "1em";
  form.style.flexDirection = "column";
  body.appendChild(form);
  let fndiv = document.createElement("div");
  fndiv.innerHTML = '<label>Шаблон имени файла (без расширения)</label>';
  form.appendChild(fndiv);
  const filename = document.createElement("input");
  filename.type = "text";
  filename.style.maxWidth = "25em";
  filename.classList.add("form-control");
  filename.value = Settings.get("filename");
  fndiv.appendChild(filename);
  const descr = document.createElement("ul");
  descr.style.color = "gray";
  descr.style.fontSize = "90%";
  descr.style.margin = "0";
  descr.style.paddingLeft = "2em";
  descr.innerHTML =
    "<li>\\a - Автор книги;</li>" +
    "<li>\\s - Серия книги;</li>" +
    "<li>\\n - Порядковый номер в серии;</li>" +
    "<li>\\N - Порядковый номер в серии с ведущим нулем;</li>" +
    "<li>\\t - Название книги;</li>" +
    "<li>\\i - Идентификатор книги (workId на сайте);</li>" +
    "<li>\\b - Статус книги (F - завершена, U - не завершена, P - выгружена частично);</li>" +
    "<li>\\c - Диапазон глав в случае, если книга не завершена или выбраны не все главы;</li>" +
    "<li>&lt;&hellip;&gt; - Если внутри такого блока будут отсутвовать данные для шаблона, то весь блок будет удален;</li>";
  fndiv.appendChild(descr);
  let addnotes  = HTML.createCheckbox("Добавить примечания автора в аннотацию", Settings.get("addnotes"));
  let addcover  = HTML.createCheckbox("Грузить обложку книги", Settings.get("addcover"));
  let addimages = HTML.createCheckbox("Грузить картинки внутри глав", Settings.get("addimages"));
  let materials = HTML.createCheckbox("Грузить дополнительные материалы", Settings.get("materials"));
  let footnotes = HTML.createCheckbox("Формировать сноски, если есть", Settings.get("footnotes"));
  let sethint = HTML.createCheckbox("Отображать подсказку о настройках в логе выгрузки", Settings.get("sethint"));
  form.append(addnotes, addcover, addimages, materials, footnotes, sethint);
  addnotes = addnotes.querySelector("input");
  addcover = addcover.querySelector("input");
  addimages = addimages.querySelector("input");
  materials = materials.querySelector("input");
  footnotes = footnotes.querySelector("input");
  sethint = sethint.querySelector("input");

  const buttons = document.createElement("div");
  buttons.innerHTML = '<button type="submit" class="btn btn-primary">Сохранить</button>';
  form.appendChild(buttons);

  form.addEventListener("submit", event => {
    event.preventDefault();
    try {
      Settings.set("filename", filename.value);
      Settings.set("addnotes", addnotes.checked);
      Settings.set("addcover", addcover.checked);
      Settings.set("addimages", addimages.checked);
      Settings.set("materials", materials.checked);
      Settings.set("footnotes", footnotes.checked);
      Settings.set("sethint", sethint.checked);
      Settings.save();
      Notification.display("Настройки сохранены", "success");
    } catch (err) {
      console.error(err);
      Notification.display("Ошибка сохранения настроек");
    }
  });
}

//---------- Классы ----------

/**
 * Расширение класса библиотеки в целях обеспечения загрузки изображений,
 * информирования о наличии неизвестных HTML элементов и отображения прогресса в логе.
 */
class FB2DocumentEx extends FB2Document {
  constructor() {
    super();
    this.wishes = {};
    this.unknowns = 0;
    this.extraChapters = 0;
  }

  parse(parser_id, log, params, ...args) {
    const bin_start = this.binaries.length;
    super.parse(parser_id, ...args).forEach(el => {
      log.warning(`Найден неизвестный элемент: ${el.nodeName}`);
      ++this.unknowns;
    });
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
        if (!list.length || stage !== 1) break;
        await Promise.all(list.map(bin => {
          const li = log.message("Загрузка изображения...");
          if (params.noImages) return Promise.resolve().then(() => li.skipped());
          return bin.load((loaded, total) => li.text("" + Math.round(loaded / total * 100) + "%"))
            .then(() => li.ok())
            .catch((err) => {
              li.fail();
              if (err.name === "AbortError") throw err;
            });
        }));
      }
    })();
  }
}

/**
 * Расширение класса библиотеки в целях передачи элементов с изображениями
 * и неизвестных элементов в документ, для возможности раздельной обработки
 * аннотации и примечаний автора, а также для поиска и удаления хештегов #want*
 * внутри аннотации и примечаний автора.
 */
class AnnotationParser extends FB2AnnotationParser {
  run(fb2doc, element) {
    this._wishes = new Set();
    this._binaries = [];
    this._unknown_nodes = [];
    this.parse(element);
    this._wishes.forEach(ht => fb2doc.wishes[ht] = true);
    if (this._annotation && this._annotation.children.length) {
      this._annotation.normalize();
      if (!fb2doc.annotation) {
        fb2doc.annotation = this._annotation;
      } else {
        this._annotation.children.forEach(ch => fb2doc.annotation.children.push(ch));
      }
      this._binaries.forEach(bin => fb2doc.binaries.push(bin));
    }
    const un = this._unknown_nodes;
    this._wishes = null;
    this._binaries = null;
    this._annotation = null;
    this._unknown_nodes = null;
    return un;
  }

  processElement(fb2el, depth) {
    if (fb2el instanceof FB2UnknownNode) this._unknown_nodes.push(fb2el.value);
    if (typeof(fb2el.value) === "string" && fb2el.value.length) {
      [ "likes", "comments" ].forEach(ht => {
        fb2el.value = fb2el.value.replace(new RegExp("#want" + ht + "(\\s+|$)", "gi"), () => {
          this._wishes.add(ht);
          return "";
        });
      });
    }
    return super.processElement(fb2el, depth);
  }
}

/**
 * Расширение класса библиотеки в целях передачи списка неизвестных элементов в документ
 */
class ChapterParser extends FB2ChapterParser {
  run(fb2doc, element, title) {
    this._unknown_nodes = [];
    super.run(fb2doc, element, title);
    const un = this._unknown_nodes;
    this._unknown_nodes = null;
    return un;
  }

  startNode(node, depth) {
    if (node.nodeName === "DIV") {
      const nnode = document.createElement("p");
      node.childNodes.forEach(ch => nnode.appendChild(ch.cloneNode(true)));
      node = nnode;
    }
    return super.startNode(node, depth);
  }

  processElement(fb2el, depth) {
    if (fb2el instanceof FB2UnknownNode) this._unknown_nodes.push(fb2el.value);
    return super.processElement(fb2el, depth);
  }
}

/**
 * Класс управления модальным диалоговым окном
 */
class ModalDialog {
  constructor(params) {
    this._modal = null;
    this._overlay = null;
    this._title = params.title || "";
    this._onclose = params.onclose;
  }

  show() {
    this._ensureForm();
    this._ensureContent();
    document.body.appendChild(this._overlay);
    document.body.classList.add("modal-open");
    this._modal.focus();
  }

  hide() {
    this._overlay && this._overlay.remove();
    this._overlay = null;
    this._modal = null;
    document.body.classList.remove("modal-open");
    if (this._onclose) {
      this._onclose();
      this._onclose = null;
    }
  }

  _ensureForm() {
    if (!this._overlay) {
      this._overlay = document.createElement("div");
      this._overlay.classList.add("ate-dlg-overlay");
      this._modal = this._overlay.appendChild(document.createElement("div"));
      this._modal.classList.add("ate-dialog");
      this._modal.tabIndex = -1;
      this._modal.setAttribute("role", "dialog");
      const header = this._modal.appendChild(document.createElement("div"));
      header.classList.add("ate-title");
      header.appendChild(document.createElement("div")).textContent = this._title;
      const cb = header.appendChild(document.createElement("button"));
      cb.type = "button";
      cb.classList.add("ate-close-btn");
      cb.textContent = "×";
      this._modal.appendChild(document.createElement("form"));

      this._overlay.addEventListener("click", event => {
        if (event.target === this._overlay || event.target.closest(".ate-close-btn")) this.hide();
      });
      this._overlay.addEventListener("keydown", event => {
        if (event.code == "Escape" && !event.shiftKey && !event.ctrlKey && !event.altKey) {
          event.preventDefault();
          this.hide();
        }
      });
    }
  }

  _ensureContent() {
  }
}

class DownloadDialog extends ModalDialog {
  constructor(params) {
    super(params);
    this.log    = null;
    this.button = null;
    this._ann = params.annotation;
    this._cvr = params.cover;
    this._mat = params.materials;
    this._set = params.settings;
    this._chs = params.chapters;
    this._sub = params.onsubmit;
    this._pg1 = null;
    this._pg2 = null;
  }

  hide() {
    super.hide();
    this.log = null;
    this.button = null;
  }

  nextPage() {
    this._pg1.style.display = "none";
    this._pg2.style.display = "";
  }

  _ensureContent() {
    const form = this._modal.querySelector("form");
    form.replaceChildren();
    this._pg1 = form.appendChild(document.createElement("div"));
    this._pg2 = form.appendChild(document.createElement("div"));
    this._pg1.classList.add("ate-page");
    this._pg2.classList.add("ate-page");
    this._pg2.style.display = "none";

    const fst = this._pg1.appendChild(document.createElement("fieldset"));
    const leg = fst.appendChild(document.createElement("legend"));
    leg.textContent = "Главы для выгрузки";

    const chs = fst.appendChild(document.createElement("div"));
    chs.classList.add("ate-chapter-list");

    const ntp = chs.appendChild(document.createElement("div"));
    ntp.classList.add("ate-note");
    ntp.textContent = "Выберите главы для выгрузки. Обратите внимание: выгружены могут быть только доступные вам главы.";

    const tbd = fst.appendChild(document.createElement("div"));
    tbd.classList.add("ate-toolbar");

    const its = tbd.appendChild(document.createElement("span"));
    const selected = document.createElement("strong");
    selected.textContent = 0;
    const total = document.createElement("strong");
    its.append("Выбрано глав: ", selected, " из ", total);

    const tb1 = tbd.appendChild(document.createElement("button"));
    tb1.type = "button";
    tb1.title = "Выделить все/ничего";
    tb1.classList.add("ate-group-select");
    const tb1i = document.createElement("i");
    tb1i.classList.add("icon-check");
    tb1.append(tb1i, " ?");

    const nte = HTML.createCheckbox("Добавить примечания автора в аннотацию", this._ann && this._set.addnotes);
    if (!this._ann) nte.querySelector("input").disabled = true;
    this._pg1.appendChild(nte);

    const cve = HTML.createCheckbox("Грузить обложку книги", this._cvr && this._set.addcover);
    if (!this._cvr) cve.querySelector("input").disabled = true;
    this._pg1.appendChild(cve);

    const img = HTML.createCheckbox("Грузить картинки внутри глав", this._set.addimages);
    this._pg1.appendChild(img);

    const nmt = HTML.createCheckbox("Грузить дополнительные материалы", this._mat && this._set.materials);
    if (!this._mat) nmt.querySelector("input").disabled = true;
    this._pg1.appendChild(nmt);

    const log = this._pg2.appendChild(document.createElement("div"));

    const sbd = form.appendChild(document.createElement("div"));
    sbd.classList.add("ate-buttons");
    const sbt = sbd.appendChild(document.createElement("button"));
    sbt.type = "submit";
    sbt.classList.add("button", "btn", "btn-success");
    sbt.textContent = "Продолжить";
    const cbt = sbd.appendChild(document.createElement("button"));
    cbt.type = "button";
    cbt.classList.add("button", "btn", "btn-default");
    cbt.textContent = "Закрыть";

    let ch_cnt = 0;
    this._chs.forEach(ch => {
      const el = HTML.createChapterCheckbox(ch);
      ch.element = el.querySelector("input");
      chs.append(el);
      ++ch_cnt;
    });
    total.textContent = ch_cnt;

    chs.addEventListener("change", event => {
      const cnt = this._chs.reduce((cnt, ch) => {
        if (!ch.locked && ch.element.checked) ++cnt;
        return cnt;
      }, 0);
      selected.textContent = cnt;
      sbt.disabled = !cnt;
    });

    tb1.addEventListener("click", event => {
      const chf = this._chs.some(ch => !ch.locked && !ch.element.checked);
      this._chs.forEach(ch => {
        ch.element.checked = (chf && !ch.locked);
      });
      chs.dispatchEvent(new Event("change"));
    });

    cbt.addEventListener("click", event => this.hide());

    form.addEventListener("submit", event => {
      event.preventDefault();
      if (this._sub) {
        const res = {};
        res.authorNotes = nte.querySelector("input").checked;
        res.skipCover = !cve.querySelector("input").checked;
        res.addimages = img.querySelector("input").checked;
        res.materials = nmt.querySelector("input").checked;
        let ch_min = 0;
        let ch_max = 0;
        res.chapters = this._chs.reduce((res, ch, idx) => {
          if (!ch.locked && ch.element.checked) {
            res.push({ title: ch.title, workId: ch.workId, chapterId: ch.chapterId });
            ch_max = idx + 1;
            if (!ch_min) ch_min = ch_max;
          }
          return res;
        }, []);
        res.chaptersRange = [ ch_min, ch_max ];
        this._sub(res);
      }
    });

    chs.dispatchEvent(new Event("change"));
    this.log = log;
    this.button = sbt;
  }
}

/**
 * Класс общего назначения для создания однотипных HTML элементов
 */
class HTML {

  /**
   * Создает единичный элемент типа checkbox в стиле сайта
   *
   * @param title   string Подпись для checkbox
   * @param checked bool   Начальное состояние checkbox
   *
   * @return Element HTML-элемент для последующего добавления на форму
   */
  static createCheckbox(title, checked) {
    const root = document.createElement("div");
    root.classList.add("ate-checkbox");
    const label = root.appendChild(document.createElement("label"));
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = checked;
    const span = document.createElement("span");
    span.classList.add("icon-check-bold");
    label.append(input, span, title);
    return root;
  }

  /**
   * Создает checkbox для диалога выбора глав
   *
   * @param chapter object Данные главы
   *
   * @return Element HTML-элемент для последующего добавления на форму
   */
  static createChapterCheckbox(chapter) {
    const root = this.createCheckbox(chapter.title || "Без названия", !chapter.locked);
    if (chapter.locked) {
      root.querySelector("input").disabled = true;
      const lock = document.createElement("i");
      lock.classList.add("icon-lock", "text-muted", "ml-sm");
      root.children[0].appendChild(lock);
    }
    if (!chapter.title) root.style.fontStyle = "italic";
    return root;
  }
}

/**
 * Класс для отображения сообщений в виде лога
 */
class LogElement {

  /**
   * Конструктор
   *
   * @param Element element HTML-элемент, в который будут добавляться записи
   */
  constructor(element) {
    element.classList.add("ate-log");
    this._element = element;
  }

  /**
   * Добавляет сообщение с указанным текстом и цветом
   *
   * @param mixed  msg   Сообщение для отображения. Может быть HTML-элементом
   * @param string color Цвет в формате CSS (не обязательный параметр)
   *
   * @return LogItemElement Элемент лога, в котором может быть отображен результат или другой текст
   */
  message(msg, color) {
    const item = document.createElement("div");
    if (msg instanceof HTMLElement) {
      item.appendChild(msg);
    } else {
      item.textContent = msg;
    }
    if (color) item.style.color = color;
    this._element.appendChild(item);
    this._element.scrollTop = this._element.scrollHeight;
    return new LogItemElement(item);
  }

  /**
   * Сообщение с темно-красным цветом
   *
   * @param mixed msg См. метод message
   *
   * @return LogItemElement См. метод message
   */
  warning(msg) {
    this.message(msg, "#a00");
  }
}

/**
 * Класс реализации элемента записи в логе,
 * используется классом LogElement.
 */
class LogItemElement {
  constructor(element) {
    this._element = element;
    this._span = null;
  }

  /**
   * Отображает сообщение "ok" в конце записи лога зеленым цветом
   *
   * @return void
   */
  ok() {
    this._setSpan("ok", "green");
  }

  /**
   * Аналогичен методу ok
   */
  fail() {
    this._setSpan("ошибка!", "red");
  }

  /**
   * Аналогичен методу ok
   */
  skipped() {
    this._setSpan("пропущено", "blue");
  }

  /**
   * Отображает указанный текст стандартным цветом сайта
   *
   * @param string s Текст для отображения
   *
   */
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


/**
 * Класс реализует доступ к хранилищу с настройками скрипта
 * Здесь используется localStorage
 */
class Settings {

  /**
   * Возвращает значение опции по ее имени
   *
   * @param name  string Имя опции
   * @param reset bool   Сбрасывает кэш перед получением опции
   *
   * @return mixed
   */
  static get(name, reset) {
    if (reset) Settings._values = null;
    this._ensureValues();
    let val = Settings._values[name];
    switch (name) {
      case "filename":
        if (typeof(val) !== "string" || val.trim() === "") val = "\\a.< \\s \\N.> \\t [AT-\\i-\\b]";
        break;
      case "sethint":
      case "addcover":
      case "addnotes":
      case "addimages":
      case "materials":
        if (typeof(val) !== "boolean") val = true;
        break;
      case "footnotes":
        if (typeof(val) !== "boolean") val = false;
        break;
    }
    return val;
  }

  /**
   * Обновляет значение опции
   *
   * @param name  string Имя опции
   * @param value mixed  Значение опции
   *
   * @return void
   */
  static set(name, value) {
    this._ensureValues();
    this._values[name] = value;
  }

  /**
   * Сохраняет (перезаписывает) настройки скрипта в хранилище
   *
   * @return void
   */
  static save() {
    localStorage.setItem("atex.settings", JSON.stringify(this._values || {}));
  }

  /**
   * Читает настройки из локального хранилища, если они не были считаны ранее
   */
  static _ensureValues() {
    if (this._values) return;
    try {
      this._values = JSON.parse(localStorage.getItem("atex.settings"));
    } catch (err) {
      this._values = null;
    }
    if (!this._values || typeof(this._values) !== "object") Settings._values = {};
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
      const msg = document.createElement("div");
      msg.classList.add("toast-message");
      msg.textContent = "ATEX: " + this._data.text;
      this._element.appendChild(msg);
      this._element.addEventListener("click", () => this._element.remove());
      setTimeout(() => {
        this._element.style.transition = "opacity 2s ease-in-out";
        this._element.style.opacity = "0";
        setTimeout(() => {
          const ctn = this._element.parentElement;
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

/**
 * Класс загрузчика данных с сайта.
 * Реализован через GM.xmlHttpRequest чтобы обойти ограничения CORS
 * Если протокол, домен и порт совпадают, то используется стандартная загрузка.
 */
class Loader extends FB2Loader {

  /**
   * Старт загрузки ресурса с указанного URL
   *
   * @param url    Object Экземпляр класса URL (обязательный)
   * @param params Object Объект с параметрами запроса (необязательный)
   *
   * @return mixed
   */
  static async addJob(url, params) {
    params ||= {};
    if (url.origin === document.location.origin) {
      params.extended = true;
      return super.addJob(url, params);
    }

    params.url = url;
    params.method ||= "GET";
    params.responseType = params.responseType === "binary" ? "blob" : "text";
    if (!this.ctl_list) this.ctl_list = new Set();

    return new Promise((resolve, reject) => {
      let req = null;
      params.onload = r => {
        if (r.status === 200) {
          const headers = new Headers();
          r.responseHeaders.split("\n").forEach(hs => {
            const h = /^([A-Za-z][A-Za-z0-9-]*):\s*(.+)$/.exec(hs);
            if (h) headers.append(h[1], h[2].trim());
          });
          resolve({ headers: headers, response: r.response });
        } else {
          reject(new Error(`Сервер вернул ошибку (${r.status})`));
        }
      };
      params.onerror = err => reject(err);
      params.ontimeout = err => reject(err);
      params.onloadend = () => {
        if (req) this.ctl_list.delete(req);
      };
      if (params.onprogress) {
        const progress = params.onprogress;
        params.onprogress = pe => {
          if (pe.lengthComputable) {
            progress(pe.loaded, pe.total);
          }
        };
      }
      try {
        req = GM.xmlHttpRequest(params);
        if (req) this.ctl_list.add(req);
      } catch (err) {
        reject(err);
      }
    });
  }

  static abortAll() {
    super.abortAll();
    if (this.ctl_list) {
      this.ctl_list.forEach(ctl => ctl.abort());
      this.ctl_list.clear();
    }
  }
}

/**
 * Переопределение загрузчика для возможности использования своего лоадера
 * а также для того, чтобы избегать загрузки картинок в формате webp.
 */
FB2Image.prototype._load = async function(url, params) {
  // Попытка избавиться от webp через подмену параметров запроса
  const u = new URL(url);
  if (u.pathname.endsWith(".webp")) {
    // Изначально была загружена картинка webp. Попытаться принудить сайт отдать картинку другого формата.
    u.searchParams.set("format", "jpeg");
  } else if (u.searchParams.get("format") === "webp") {
    // Изначально картинка не webp, но параметр присутсвует. Вырезать.
    // Возможно позже придется указывать его явно, когда сайт сделает webp форматом по умолчанию.
    u.searchParams.delete("format");
  }
  // Еще одна попытка избавиться от webp через подмену заголовков
  params ||= {};
  params.headers ||= {};
  if (!params.headers.Accept) params.headers.Accept = "image/jpeg,image/png,*/*;q=0.8";
  // Использовать свой лоадер
  return (await Loader.addJob(u, params)).response;
};

//-------------------------

function addStyle(css) {
  const style = document.getElementById("ate_styles") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "ate_styles";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function addStyles() {
  [
    ".ate-dlg-overlay, .ate-title { display:flex; align-items:center; justify-content:center; }",
    ".ate-dialog, .ate-dialog form, .ate-page, .ate-dialog fieldset, .ate-chapter-list { display:flex; flex-direction:column; }",
    ".ate-page, .ate-dialog form, .ate-dialog fieldset { flex:1; overflow:hidden; }",
    ".ate-dlg-overlay { position:fixed; top:0; left:0; bottom:0; right:0; overflow:auto; background-color:rgba(0,0,0,.3); white-space:nowrap; z-index:10000; }",
    ".ate-dialog { position:fixed; top:0; left:0; bottom:0; right:0; background-color:#fff; overflow-y:auto; }",
    ".ate-title { flex:0 0 auto; padding:10px; color:#66757f; background-color:#edf1f2; border-bottom:1px solid #e5e5e5; }",
    ".ate-title>div:first-child { margin:auto; }",
    ".ate-close-btn { cursor:pointer; border:0; background-color:transparent; font-size:21px; font-weight:bold; line-height:1; text-shadow:0 1px 0 #fff; opacity:.4; }",
    ".ate-close-btn:hover { opacity:.9 }",
    ".ate-dialog form { padding:10px 15px 15px; white-space:normal; gap:10px; min-height:30em; }",
    ".ate-page { gap:10px; }",
    ".ate-dialog fieldset { border:1px solid #bbb; border-radius:6px; padding:10px; margin:0; gap:10px; }",
    ".ate-dialog legend { display:inline; width:unset; font-size:100%; margin:0; padding:0 5px; border:none; }",
    ".ate-chapter-list { flex:1; gap:10px; overflow-y:auto; }",
    ".ate-toolbar { display:flex; align-items:center; padding-top:10px; border-top:1px solid #bbb; }",
    ".ate-group-select { margin-left:auto; }",
    ".ate-log { flex:1; padding:6px; border:1px solid #bbb; border-radius:6px; overflow:auto; }",
    ".ate-buttons { display:flex; flex-direction:column; gap:10px; }",
    ".ate-buttons button { min-width:8em; }",
    ".ate-checkbox label { cursor:pointer; margin:0; }",
    ".ate-checkbox input { position:static; visibility:hidden; width:0; float:right; }", // position:absolute провоцирует прокрутку overlay-я в мобильной версии сайта
    ".ate-checkbox span { position:relative; display:inline-block; width:17px; height:17px; margin-top:2px; margin-right:10px; text-align:center; vertical-align:top; border-radius:2px; border:1px solid #ccc; }",
    ".ate-checkbox span:before { position:absolute; top:0; left:-1px; right:0; bottom:0; margin-left:1px; opacity:0; text-align:center; font-size:10px; line-height:16px; vertical-align:middle; }",
    ".ate-checkbox:hover span { border-color:#5d9ced; }",
    ".ate-checkbox input:checked + span { border-color:#5d9cec; background-color:#5d9ced; }",
    ".ate-checkbox input:disabled + span { border-color:#ddd; background-color:#ddd; }",
    ".ate-checkbox input:checked + span:before { color:#fff; opacity:1; transition:color .3s ease-out; }",
    //".ate-chapter-list .ate-note { margin-bottom: 5px; }",
    //".ate-chapter-list .ate-checkbox label { padding:5px; width:99%; }",
    //".ate-chapter-list .ate-checkbox label:hover { color:#34749e; background-color:#f5f7fa; }",
    "@media (min-width:520px) and (min-height:600px) {" +
      ".ate-dialog { position:static; max-width:35em; min-width:30em; height:80vh; border-radius:6px; border:1px solid rgba(0,0,0,.2); box-shadow:0 3px 9px rgba(0,0,0,.5); }" +
      ".ate-title { border-top-left-radius:6px; border-top-right-radius:6px; }" +
      ".ate-buttons { flex-flow:row wrap; justify-content:center; }" +
      ".ate-buttons .btn-default { display:none; }" +
    "}"
  ].forEach(s => addStyle(s));
}

// Запускает скрипт после загрузки страницы сайта
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();

})();
