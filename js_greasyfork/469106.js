// ==UserScript==
// @name           RulateBookExtractor
// @namespace      90h.yy.zz
// @version        1.7.0
// @author         Ox90
// @match          https://tl.rulate.ru/book/*
// @description    The script adds a button to the site for downloading books to an FB2 file
// @description:ru Скрипт добавляет кнопку для скачивания книги в формате FB2
// @require        https://update.greasyfork.org/scripts/468831/1478439/HTML2FB2Lib.js
// @grant          GM.xmlHttpRequest
// @connect        tl.rulate.ru
// @connect        *
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/469106/RulateBookExtractor.user.js
// @updateURL https://update.greasyfork.org/scripts/469106/RulateBookExtractor.meta.js
// ==/UserScript==

/**
 * Разрешение `@connect *` Необходимо для пользователей tampermonkey, чтобы получить возможность загружать картинки
 * внутри глав со сторонних ресурсов, когда авторы ссылаются в своих главах на сторонние хостинги картинок.
 * Это разрешение прописано, чтобы пользователю отображалась кнопка "Always allow all domains" при подтверждении запроса.
 * Детали: https://www.tampermonkey.net/documentation.php#_connect
 */

(function start() {

const PROGRAM_NAME = GM_info.script.name;

let stage = 0;

function init() {
  let r = /^\/book\/(\d+)\/?$/.exec(document.location.pathname);
  if (r) {
    updateChaptersTable();
    const cont = document.querySelector("#subscribe>.form-actions");
    if (cont) {
      insertDownloadButton(r[1], cont);
      insertSelectAllButton(cont);
    }
  }
}

function insertDownloadButton(book_id, container) {
  const btn = document.createElement("input");
  btn.type = "submit";
  btn.value = "Скачать fb2-ex";
  btn.classList.add("btn", "btn-info");
  let lb = null;
  let fb = null;
  let ec = container.firstElementChild;
  while (ec) {
    if (ec.tagName == "INPUT") {
      if (ec.name === "download_f") {
        fb = ec;
        break;
      }
      lb = ec;
    }
    ec = ec.nextElementSibling;
  }
  if (fb || lb) {
    (fb || lb).after(" ", btn);
  } else {
    container.appendChild(btn);
  }
  btn.addEventListener("click", event => {
    event.preventDefault();
    let log = null;
    let doc = new FB2DocumentEx();
    doc.id = book_id;
    doc.idPrefix = "rbe_";
    doc.sourseURL = document.location.href;
    doc.programName = PROGRAM_NAME + " v" + GM_info.script.version;
    const dlg = new Dialog({
      onhide: () => {
        Loader.abortAll();
        doc = null;
        if (dlg.link) {
          URL.revokeObjectURL(dlg.link.href);
          dlg.link = null;
        }
      },
      onsubmit: res => makeAction(doc, dlg, log, res)
    });
    dlg.show();
    log = new LogElement(dlg.log);
    try {
      getBookInfo(doc, log);
      dlg.button.textContent = setStage(0);
    } catch (err) {
      console.error(err);
      log.message(err.message, "red");
      dlg.button.textContent = setStage(3);
    } finally {
      dlg.button.disabled = false;
    }
  });
}

function insertSelectAllButton(container) {
  if (Array.from(container.querySelectorAll("a")).find(e => (e.textContent === "выбрать все"))) return;
  let el = document.createElement("a");
  el.href = "#";
  el.title = PROGRAM_NAME;
  el.textContent = "выбрать все";
  el.addEventListener("click", event => {
    event.preventDefault();
    document.querySelectorAll("#Chapters td input.download_chapter").forEach(e => (e.checked = !e.checked));
  });
  container.appendChild(document.createTextNode(" ("));
  container.appendChild(el);
  container.appendChild(document.createTextNode(") "));
}

async function makeAction(doc, dlg, log, params) {
  try {
    switch (stage) {
      case 0:
        dlg.button.textContent = setStage(1);
        await getBookContent(doc, log, params);
        dlg.button.textContent = setStage(2);
        break;
      case 1:
        Loader.abortAll();
        dlg.button.textContent = setStage(3);
        break;
      case 2:
        if (!dlg.link) {
          dlg.link = document.createElement("a");
          dlg.link.download = genBookFileName(doc);
          dlg.link.href = URL.createObjectURL(new Blob([ doc ], { type: "application/octet-stream" }));
        }
        dlg.link.click();
        break;
      case 3:
        dlg.hide();
        break;
    }
  } catch (err) {
    console.error(err);
    log.message(err.message, "red");
    dlg.button.textContent = setStage(3);
  }
}

function setStage(new_stage) {
  stage = new_stage;
  return [ "Продолжить", "Прервать", "Сохранить в файл", "Закрыть" ][new_stage] || "Error";
}

function getBookInfo(doc, log) {
  const info_el = document.querySelector("#Info>div.row");
  if (!info_el) throw new Error("Не найден блок описания книги");
  doc.bookTitle = (() => {
    const el = document.querySelector("h1");
    const str = el && el.textContent.trim() || null;
    if (!str) throw new Error("Не найдено название книги");
    return str;
  })();
  log.message("Название:").text(doc.bookTitle);
  doc.bookAuthors = Array.from(info_el.querySelectorAll("em>a[href^=\"/search\"]")).reduce((list, ae) => {
    const url = new URL(ae.href);
    if (url.searchParams.get("t") === ae.textContent.trim()) {
      list.push(new FB2Author(ae.textContent.trim()));
    }
    return list;
  }, []);
  if (!doc.bookAuthors.length) {
    // Поискать авторов в панели перевода
    const el = Array.from(document.querySelectorAll(".tools>dl.info>dd>a.user[href^=\"/users/\"]")).find(el => {
      return el.previousSibling.textContent.trim().toLowerCase().endsWith("владелец:");
    });
    if (el) doc.bookAuthors.push(new FB2Author(el.textContent));
  }
  log.message("Авторы:").text(doc.bookAuthors.length || "нет");
  if (!doc.bookAuthors.length) log.warning("Не найдена информация об авторах");
  let genres = [];
  info_el.querySelectorAll("em>a[href^=\"/search\"]").forEach(el => {
    const text = el.textContent.trim();
    if (text) {
      const url = new URL(el.href);
      if (url.searchParams.has("tags[0]")) {
        doc.keywords.push(text);
      } else if (url.searchParams.has("genres[0]")) {
        genres.push(text);
      }
    }
  });
  doc.genres = new FB2GenreList(genres);
  log.message("Жанры:").text(doc.genres.length);
  log.message("Теги:").text(doc.keywords.length || "нет");

  //--
  doc.sourceURL = document.location.origin + document.location.pathname;
  const chapters = getChaptersList();
  //--
  doc.bookDate = chapters.reduce((result, chapter) => {
    const rr = /^(\d+) ([^ ]+) (\d+) г\., (\d+:\d+)$/.exec(chapter.updated);
    if (rr) {
      const m = (new Map([
        [ "янв.", "01" ], [ "февр.", "02" ], [ "марта", "03" ], [ "апр.", "04" ], [ "мая", "05" ], [ "июня", "06" ],
        [ "июля", "07" ], [ "авг.", "08" ], [ "сент.", "09" ], [ "окт.", "10" ], [ "нояб.", "11" ], [ "дек.", "12" ]
      ])).get(rr[2]);
      const ts = new Date(`${rr[3]}-${m}-${rr[1]}T${rr[4]}`);
      if (ts instanceof Date && !isNaN(ts.valueOf())) {
        if (!result || result < ts) result = ts;
      }
    }
    return result;
  }, null);
  log.message("Последнее обновление:").text(doc.bookDate && doc.bookDate.toLocaleString() || "n/a");

  const ch_cnt = chapters.length;
  log.message("Выбрано глав:").text(ch_cnt);
  if (!ch_cnt) throw new Error("Не выбрано ни одной главы");
  doc.chapters = chapters;
}

function updateChaptersTable() {
  const table = document.getElementById("Chapters");
  if (!table) return;
  if (table.querySelector("thead tr th a img[src^=\"/i/download\"]")) return;
  let th = document.createElement("th");
  th.innerHTML = "<a title=\"RulateBookExtractor\" href=\"#\"><img src=\"/i/download.jpg\" width=\"16\" height=\"16\"></a>";
  th.children[0].addEventListener("click", event => {
    event.preventDefault();
    table.querySelectorAll("td input.download_chapter").forEach(el => (el.checked = !el.checked));
  });
  table.querySelector("thead tr").appendChild(th);
  table.querySelectorAll("tr>td.t").forEach(te => {
    const tr = te.parentElement;
    const td = document.createElement("td");
    tr.appendChild(td);
    const btn = tr.querySelector("td>a.btn");
    if (btn && btn.textContent.trim() === "читать") {
      const r = /^\/book\/\d+\/(\d+)\/ready(_new)?$/.exec(btn.getAttribute("href"));
      if (r) td.innerHTML = `<input type="checkbox" name="download_chapter[]" value="${r[1]}" class="download_chapter">`;
    }
  });
}

function getChaptersList() {
  const chapters = Array.from(document.querySelectorAll("#Chapters .chapter_row")).reduce((list, row_el) => {
    const checkbox = row_el.querySelector("input[type=checkbox][name=\"download_chapter[]\"]");
    if (checkbox && checkbox.checked) {
      const t_el = row_el.querySelector("td.t a");
      const d_el = row_el.querySelector("td>span[title]");
      const s_el = row_el.querySelector('button[data-action="seen"]');
      const c_el = s_el && s_el.parentElement.querySelector('input[name="csrf_token"]');
      if (t_el) {
        const rd = {
          title: t_el.textContent.trim(),
          id: checkbox.value,
          seen: (!s_el || !s_el.classList.contains("btn-info")),
          token: (c_el && c_el.value || "")
        };
        if (d_el) rd.updated = d_el.title.trim();
        list.push(rd);
      }
    }
    return list;
  }, []);
  if (document.querySelector("input[name=C_sortChapters][value=\"0\"]")) return chapters.reverse();
  return chapters;
}

async function getBookContent(doc, log, params) {
  const info_el = document.querySelector("#Info>div.row");
  let li = null;
  try {
    doc.bindParser("ann", new AnnotationParser());
    doc.bindParser("chp", new ChapterParser());
    doc.coverpage = [];
    const images = info_el.querySelectorAll(".images img");
    const cp_set = new Set();
    for (let i = 0; i < images.length; ) {
      const src = images[i++].src;
      if (cp_set.has(src)) continue;
      cp_set.add(src);
      const img = new FB2Image(src);
      let li = log.message("Загрузка обложки...");
      try {
        await img.load((loaded, total) => li.text("" + Math.round(loaded / total * 100) + "%"));
        img.id = "cover" + (images.length > 1 ? i : "") + img.suffix();
        doc.coverpage.push(img);
        doc.binaries.push(img);
        li.ok();
        if (images.length == 1) {
          log.message("Размер обложки:").text(img.size + " байт");
          log.message("Тип обложки:").text(img.type);
        }
      } catch (err) {
        li.fail();
      }
    }
    li = null;
    if (!doc.coverpage.length) {
      doc.coverpage = null;
      if (images.length) {
        log.warning("Не удалось загрузить обложку!");
      } else {
        log.warning("Обложка книги не найдена!");
      }
    }
    const an_el = (() => {
      let el = Array.from(info_el.parentElement.querySelectorAll("h3")).find(e => e.textContent.trim() === "Рецензии");
      if (el) {
        el = el.previousElementSibling;
        if (el && !el.classList.contains("btn-toolbar")) return el;
      }
    })();
    if (an_el) {
      li = log.message("Анализ аннотации...");
      await doc.parse("ann", log, an_el);
      li.ok();
    } else {
      log.warning("Аннотация не найдена!");
    }
    log.message("---");
    const chapters = doc.chapters;
    doc.chapters = [];
    let ch_num = 0;
    let ch_cnt = chapters.length;
    let ch_skp = 0;
    const ch_url = document.location.origin + `/book/${doc.id}/`;
    for (const ch_item of chapters) {
      ++ch_num;
      li = log.message(`Получение главы ${ch_num}/${ch_cnt}...`);
      const ch_el = getChapterData(await Loader.addJob(ch_url + ch_item.id + "/ready_new"), doc.id, ch_item);
      if (params.keepseen && !ch_item.seen) {
        const seenForm = new FormData();
        seenForm.set("ajax", 1);
        seenForm.set("csrf_token", ch_item.token);
        try {
          // fetch автоматически установит заголовок content-type как multipart/form-data
          await window.fetch(new URL(ch_url + ch_item.id + '/seen'), {
            method: "POST",
            body: seenForm
          }).then(resp => {
            if (!resp.ok) throw new Error(`[${resp.code}]`);
          });
        } catch (err) {
          console.error('Ошибка снятия отметки прочтения главы: ' + err.message);
        }
      }
      if (ch_el) {
        await doc.parse("chp", log, ch_el, ch_item.title);
        li.ok();
      } else {
        li.skipped();
        log.warning("Нет содержимого");
        ++ch_skp;
      }
      li = null;
    }
    if (ch_skp) {
      if (ch_skp === ch_cnt) throw new Error("Нет глав для выгрузки");
      log.message("---");
      log.warning(`Некоторые главы были пропущены (${ch_skp} гл.)`);
    }
    doc.history.push("v1.0 - создание fb2 - (Ox90)");
    // Отобразить количество неизвестных элементов
    if (doc.unknowns) {
      log.message("---");
      log.warning(`Найдены неизвестные элементы: ${doc.unknowns}`);
      log.message("Преобразованы в текст без форматирования");
    }
    // Отобразить количество незагруженных изображений
    const icnt = doc.binaries.reduce((cnt, img) => {
      if (!img.value) ++cnt;
      return cnt;
    }, 0);
    if (icnt) {
      log.message("---");
      log.warning(`Проблемы с загрузкой изображений: ${icnt}`);
      log.message("Проблемные изображения заменены на текст");
    }
    // Проверить на наличие webp изображений
    const webpList = [];
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
        log.warning(`Найдены изображения формата WebP (${webpList.length} шт). Могут быть проблемы с отображением на старых читалках!`);
        await new Promise(resolve => setTimeout(resolve, 500)); // Чтобы перед confirm успел обновиться лог
        if (confirm("Выполнить конвертацию WebP --> JPEG?")) {
          const li = log.message("Конвертация изображений...");
          let ecnt = 0;
          for (const bin of webpList) {
            try {
              await bin.convert("image/jpeg");
            } catch (err) {
              ++ecnt;
            }
          }
          if (!ecnt) {
            li.ok();
          } else {
            li.fail();
            log.warning(`Несколько изображений не удалось преобразовать (${ecnt} шт)!`);
          }
        }
      }
    }
    //--
    log.message("---");
    log.message("Готово!");
  } catch (err) {
    li && li.fail();
    throw err;
  } finally {
    doc.bindParser();
  }
}

function getChapterData(html, doc_id, ch_item) {
  const doc = (new DOMParser()).parseFromString(html, "text/html");
  const chapter = doc.querySelector("#text-container .content-text");
  if (chapter) {
    // Вырезать ссылку в конце главы
    const last_el = chapter.lastElementChild;
    if (last_el && last_el.tagName === "P") {
      if (last_el.textContent.includes(`${document.location.host}/book/${doc_id}/${ch_item.id}`)) last_el.remove();
    }
    //--
    return chapter;
  } else {
    if (Array.from(doc.querySelectorAll(".container .row p")).some(el => {
      return el.textContent.includes("В этой главе нет ни одного переведённого фрагмента");
    })) return null;
  }
  throw new Error("Ошибка анализа HTML данных главы");
}

function genBookFileName(doc) {
  function xtrim(s) {
    const r = /^[\s=\-_.,;!]*(.+?)[\s=\-_.,;!]*$/.exec(s);
    return r && r[1] || s;
  }

  const parts = [];
  if (doc.bookAuthors.length) parts.push(doc.bookAuthors[0]);
  parts.push(xtrim(doc.bookTitle));
  let fname = (parts.join(". ") + " [RLT-" + doc.id + "]").replace(/[\0\/\\\"\*\?\<\>\|:]+/g, "");
  if (fname.length > 250) fname = fname.substr(0, 250);
  return fname + ".fb2";
}

//---------- Классы ----------

class FB2DocumentEx extends FB2Document {
  constructor() {
    super();
    this.unknowns = 0;
  }

  parse(parser_id, log, ...args) {
    const bin_start = this.binaries.length;
    super.parse(parser_id, ...args).forEach(el => {
      ++this.unknowns;
      log.warning(`Найден неизвестный элемент: ${el.nodeName}`)
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
        if (!list.length) break;
        await Promise.all(list.map(bin => {
          const li = log.message("Загрузка изображения...");
          return bin.load((loaded, total) => li.text("" + Math.round(loaded / total * 100) + "%"))
            .then(() => li.ok())
            .catch((err) => {
              li.fail();
              if (err.name === "AbortError") throw err;
              console.error(err.message);
            });
        }));
      }
    })();
  }
}

FB2Parser.prototype.startNode = function (node, depth) {
  if (node.nodeName === "DIV" && node.classList.contains("thumbnail")) {
    // Реклама другой книги ввиде блока с описанием. Вырезать.
    return null;
  }
  switch (node.nodeName) {
    case "TABLE":
      {
        // Порой встречаются куски разметки с осколками таблиц
        const cells = node.querySelectorAll("td, th");
        if (cells.length == 1) {
          // Это таблица с единственной ячейкой, скорее всего служит для расцветки текста.
          // Обернуть содержимое ячейки в параграф и переложить остальную работу на ф-цию нормализации.
          const par = node.ownerDocument.createElement("p");
          cells[0].childNodes.forEach(ch => par.appendChild(ch.cloneNode(true)));
          return par;
        }
        // Это более сложная таблица, пока выгружать в виде текста без форматирования.
        if (depth > 0) return node.ownerDocument.createTextNode(node.textContent);
        const par = node.ownerDocument.createElement("p");
        par.textContent = node.textContent;
        return par;
      }
    case "H1":
    case "H2":
    case "H3":
      {
        // Встречаются названия глав внутри глав
        const st = node.ownerDocument.createElement("strong");
        st.append(node.textContent);
        if (depth > 0) return st;
        const par = node.ownerDocument.createElement("p");
        par.append(st);
        return par;
      }
  }
  return node;
};

FB2Parser.prototype.processElement = function(fb2el, depth) {
  if (fb2el instanceof FB2UnknownNode) this._unknown_nodes.push(fb2el.value);
  return fb2el;
};

class AnnotationParser extends FB2AnnotationParser {
  run(fb2doc, element) {
    this._unknown_nodes = [];
    super.run(fb2doc, element);
    const un = this._unknown_nodes;
    this._unknown_nodes = null;
    return un;
  }
}

class ChapterParser extends FB2ChapterParser {
  run(fb2doc, element, title) {
    this._unknown_nodes = [];
    super.run(fb2doc, element, title);
    const un = this._unknown_nodes;
    this._unknown_nodes = null;
    return un;
  }

  startNode(node, depth) {
    node = super.startNode(node, depth);
    if (!node) return null;
    switch (node.nodeName) {
      case "DIV":
      case "CENTER":
        {
          // DIV в главе может быть как на нулевом уровне вложенности, так и на первом.
          // Возможно и глубже также есть. Используется для центрирования текста,
          // причем для тех же самых целей рядом может использоваться SPAN.
          // В некоторых текстах встречается CENTER, может быть пустым.
          const par = node.ownerDocument.createElement("p");
          for (const ch of node.childNodes) par.appendChild(ch);
          return par;
        }
    }
    return super.startNode(node, depth);
  }
}

class Dialog {
  constructor(params) {
    this._overlay = null;
    this._dialog = null;
    this._onhide = params.onhide || null;
    this._onsubmit = params.onsubmit || null;
  }

  show() {
    this._ensureElement();
    document.body.appendChild(this._overlay);
    this._dialog.focus();
  }

  hide() {
    this._overlay.remove();
    this._overlay = null;
    this._dialog = null;
    if (this._onhide) this._onhide();
  }

  _ensureElement() {
    if (this._overlay) return;
    this._overlay = document.createElement("div");
    this._overlay.style.display = "flex";
    this._overlay.style.position = "fixed";
    this._overlay.style.top = 0;
    this._overlay.style.left = 0;
    this._overlay.style.width = "100%";
    this._overlay.style.height = "100%";
    this._overlay.style.overflow = "auto";
    this._overlay.style.backgroundColor = "rgba(0,0,0,.3)";
    this._overlay.style.alignItems = "center";
    this._overlay.style.justifyContent = "center";
    this._overlay.style.whiteSpace = "nowrap";
    this._overlay.style.zIndex = 999;
    this._dialog = document.createElement("div");
    this._dialog.style.display = "inline-block";
    this._dialog.tabIndex = -1;
    this._dialog.innerHTML =
      "<div style=\"display:flex; flex-direction:column; border:solid 1px #929292; border-bottom-right-radius:10px; border-bottom-left-radius:10px; text-align:left; font-size:125%; white-space:normal; background-color:#fff;\">" +
      "<div style=\"display:flex; align-items:center; align-content:center;min-height:2em; background-color:#e4f4f4; white-space:nowrap;\">" +
      "<div style=\"display:flex; margin:auto; padding-left:.7em;\">Выгрузка книги в FB2</div>" +
      "<button type=\"button\" class=\"rbe-close\" style=\"display:flex; margin:0 .25em; color:#222; font-size:120%; font-weight:700; opacity:.5; cursor:pointer; border:0; background-color:transparent;\">x</button>" +
      "</div><form style=\"margin:18px; width:unset; min-width:350px; max-width:max(500px,35vw);\">" +
      "<div class=\"rbe-log\"></div>" +
      "<p class=\"rbe-st-button\" style=\"margin:0 0 .7em; cursor:pointer; text-decoration:underline; font-size:85%; opacity:.7;\">Настройки</p>" +
      "<div class=\"rbe-st-form\" style=\"display:none; padding:.5em; margin-bottom:1em; border:1px solid lightgray; border-radius:5px;\"><label style=\"display:flex; gap:.5em;\"><input class=\"rbe-st-seen\" type=\"checkbox\"> Сохранять статус прочтения глав</label></div>" +
      "<div style=\"display:flex; justify-content:center;\"><button type=\"submit\" class=\"btn btn-info\" disabled=\"true\">Продолжить</button></div>" +
      "</form></div>";
    this._overlay.appendChild(this._dialog);
    this._overlay.addEventListener("click", event => {
      if (event.target === this._overlay || event.target.closest(".rbe-close")) {
        event.preventDefault();
        this.hide();
      } else if (event.target.classList.contains("rbe-st-button")) {
        const stForm = this._dialog.querySelector(".rbe-st-form");
        const stSeen = stForm.querySelector(".rbe-st-seen");
        if (stForm.style.display) {
          stForm.style.removeProperty("display");
          stSeen.checked = Settings.get("keepseen");
        } else {
          stForm.style.display = "none";
          Settings.set("keepseen", stSeen.checked);
          Settings.save();
        }
      }
    });
    this._overlay.addEventListener("keydown", event => {
      if (event.code === "Escape" && !event.shiftKey && !event.ctrlKey && !event.altKey) {
        this.hide();
        event.preventDefault();
      }
    });
    this._dialog.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      const stBtn = this._dialog.querySelector(".rbe-st-button");
      const stForm = this._dialog.querySelector(".rbe-st-form");
      if (!stForm.style.display) stBtn.dispatchEvent(new Event("click", { bubbles: true}));
      stBtn.style.display = "none";
      if (this._onsubmit) this._onsubmit({ keepseen: Settings.get("keepseen") });
    });
    this.log = this._dialog.querySelector(".rbe-log");
    this.button = this._dialog.querySelector("button[type=submit]");
  }
}

class LogElement {
  constructor(element) {
    element.style.padding = ".5em";
    element.style.fontSize = "90%";
    element.style.border = "1px solid lightgray";
    element.style.marginBottom = ".7em";
    element.style.borderRadius = "5px";
    element.style.textAlign = "left";
    element.style.overflowY = "auto";
    element.style.maxHeight = "50vh";
    this._element = element;
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
      case "keepseen":
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
    localStorage.setItem("rbe.settings", JSON.stringify(this._values || {}));
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

class Loader {
  static async addJob(url, params) {
    if (!this.ctl_list) this.ctl_list = new Set();
    params ||= {};
    params.url = url;
    params.method ||= "GET";
    params.responseType = params.responseType === "binary" ? "blob" : "text";
    return new Promise((resolve, reject) => {
      let req = null;
      params.onload = r => {
        if (r.status === 200) {
          const resp = r.response;
          if (resp.type === "application/octet-stream") {
            // Возможно это изображение без указания типа
            let reader = new FileReader();
            reader.onloadend = () => {
              let header = "";
              const arr = new Uint8Array(reader.result);
              for (let i = 0; i < 4; ++i) {
                header += arr[i].toString(16);
              }
              let type = null;
              switch (header) {
                case "89504e47":
                  type = "image/png";
                  break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                  type = "image/jpeg";
                  break;
                case "47494638":
                  type = "image/gif";
                  break;
                case "52494646":
                  type = "image/webp";
                  break;
              }
              resolve(type ? new Blob([ resp ], { type: type }) : resp);
            };
            reader.readAsArrayBuffer(resp.slice(0, 4));
          } else {
            resolve(resp);
          }
        } else {
          reject(new Error("Сервер вернул ошибку (" + r.status + ")"));
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
    if (this.ctl_list) {
      this.ctl_list.forEach(ctl => ctl.abort());
      this.ctl_list.clear();
    }
  }
}

FB2Image.prototype._load = function(...args) {
  return Loader.addJob(...args);
};

//-------------------------

// Запускает скрипт после загрузки страницы сайта
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();

})();
