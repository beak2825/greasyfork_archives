// ==UserScript==
// @name           FicbookExtractor
// @namespace      90h.yy.zz
// @version        0.10.0
// @author         Ox90
// @match          https://ficbook.net/readfic/*
// @description    The script allows you to download books to an FB2 file without any limits
// @description:ru Скрипт позволяет скачивать книги в FB2 файл без ограничений
// @require        https://update.greasyfork.org/scripts/468831/1478439/HTML2FB2Lib.js
// @grant          GM.xmlHttpRequest
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/479617/FicbookExtractor.user.js
// @updateURL https://update.greasyfork.org/scripts/479617/FicbookExtractor.meta.js
// ==/UserScript==

(function start() {

const PROGRAM_NAME = GM_info.script.name;

let stage = 0;

function init() {
  switch (getPageName()) {
    case "download":
      watchPage("section.content-section", updateDownloadPage, true);
      break;
    case "ficview":
      watchPage("section.chapter-info div.hat-actions-container", updateFicviewPage, false);
      break;
  }
}

function getPageName() {
  // Преполагается, это раздел /readfic, потому что это указано в @match
  const path = document.location.pathname;
  if (path.endsWith("/download")) return "download";
  return "ficview";
}

function watchPage(selector, handler, obsrv) {
  const container = document.querySelector(selector);
  if (container) {
    if (!obsrv) {
      handler(container);
      return;
    }
    (new MutationObserver(function(mutations, observer) {
      try {
        if (handler(container)) observer.disconnect();
      } catch (err) {
        console.error(err);
      }
    })).observe(container, { childList: true, subtree: true });
  }
}

function updateDownloadPage(container) {
  if (container.querySelector(".fbe-download-button")) return true;
  const bc = container.querySelector("div.download-buttons-grid");
  if (!bc) throw new Error("Ошибка идентификации блока download-buttons");

  bc.appendChild(makeDownloadButton(1));
  return true;
}

function updateFicviewPage(container) {
  if (container.querySelector(".fbe-download-button")) return true;
  const bc = container.children[0];
  if (!bc || bc.nodeName !== "DIV") throw new Error("Ошибка идентификации блока hat-actions");

  bc.appendChild(makeDownloadButton(2));
  return true;
}

function makeDownloadButton(btype) {
  const btn = document.createElement("button");
  btn.classList.add("fbe-download-button");
  if (btype === 1) {
    btn.classList.add("ds-btn", "ds-btn-regular");
    btn.innerHTML =
      '<svg class="ic_fb2 svg-icon">' +
      '<path d="M14.47 1.37c-.3-.3-.71-.47-1.14-.47h-2.91V.71c0-.39-.32-.71-.71-.71H6.09c-.39 ' +
      '0-.71.32-.71.71V.9H2.47c-.43 0-.84.17-1.14.47-.3.3-.47.71-.47 1.14V9.5h1.42V2.51c0-.05.02-.1.06-' +
      '.14.04-.04.08-.06.14-.06h2.91v1.28H5.2c-.39 0-.71.32-.71.71s.32.71.71.71h5.43c.39 0 ' +
      '.71-.32.71-.71s-.32-.71-.71-.71h-.19V2.31h2.91c.05 0 .1.02.14.06.04.04.06.08.06.14V9.5h1.42v-7c0-' +
      '.43-.17-.83-.47-1.13ZM9 3.6H6.8V1.4H9v2.2ZM11.39 16H16v-1.13h-2.64c.1-.07.27-.2.52-.39.24-.19.48-' +
      '.39.72-.61.38-.36.66-.7.85-1.04.19-.33.28-.69.28-1.06 0-.57-.19-1-.58-1.31-.39-.31-.95-.47-1.68-' +
      '.47-.37 0-.73.04-1.1.12-.36.08-.64.16-.82.25v1.31h.13c.23-.16.48-.28.74-.38.27-.1.52-.15.77-.15.32 ' +
      '0 .57.07.74.22.17.15.26.35.26.62 0 .22-.07.45-.2.68-.13.23-.36.5-.68.81-.21.21-.5.46-.85.74-.35.29-' +
      '.7.56-1.06.81v.97ZM4.21 11.25h-2.7v1.1h2.5v1.14h-2.5V16H0v-5.89h4.21v1.14zM9.94 13.25c-.22-.24-.53-' +
      '.4-.91-.47v-.03c.27-.12.49-.29.64-.51.15-.22.22-.47.22-.76 0-.24-.06-.46-.17-.65-.11-.19-.27-.35-' +
      '.5-.46-.22-.11-.43-.18-.65-.21-.22-.03-.56-.05-1.04-.05H5.25V16h2.56c.43 0 .78-.04 1.05-.11.28-.07.53-' +
      '.2.77-.37.2-.15.36-.33.47-.56.12-.22.17-.48.17-.76 0-.39-.11-.71-.34-.95Zm-3.18-2.06h.83c.17 0 ' +
      '.3.03.41.07.12.05.21.12.26.22.05.1.07.2.07.29 0 .13-.02.24-.06.34-.04.09-.13.17-.27.23-.1.04-.23.07-' +
      '.4.08-.17 0-.37.01-.61.01h-.24v-1.24Zm1.86 3.36c-.06.11-.17.2-.32.26-.16.07-.32.1-.51.1H6.76v-1.47h' +
      '.98c.21 0 .37.02.49.06.17.05.3.13.37.23s.11.24.11.43c0 .14-.03.27-.09.38Z"/>' +
      '</svg> Скачать FB2-ex';
  } else {
    btn.classList.add("btn", "btn-with-description", "btn-primary");
    btn.innerHTML =
      '<span class="main-info">' +
      '<svg class="svg-icon ic_download">' +
      '<path d="M15.542 9.653a1.564 1.564 0 0 0-1.105-.458h-1.839a.644.644 0 1 0 0 1.288h1.839a.276.276 ' +
      '0 0 1 .276.276v3.678a.276.276 0 0 1-.276.276H1.563a.276.276 0 0 1-.276-.276v-3.678a.276.276 0 0 1 ' +
      '.276-.276h1.839a.644.644 0 1 0 0-1.288H1.563A1.562 1.562 0 0 0 0 10.759v3.678A1.562 1.562 0 0 0 ' +
      '1.563 16h12.874A1.562 1.562 0 0 0 16 14.437v-3.678c0-.415-.165-.813-.458-1.106z"/>' +
      '<path d="M7.497 10.241a.644.644 0 0 0 1.006 0l3.678-4.598a.644.644 0 0 0-1.005-.804L8.644 ' +
      '8.004V.644a.644.644 0 0 0-1.288 0v7.36L4.824 4.839a.643.643 0 0 0-1.005.804l3.678 4.598zM12.607 ' +
      '13.241a.644.644 0 1 0 0-1.288h-.009a.644.644 0 1 0 0 1.288h.009z"/>' +
      '</svg> FB2</span>' +
      '<span class="description">Скачать</span>';
  }
  btn.addEventListener("click", event => {
    event.preventDefault();
    displayDownloadDialog();
  });
  return btn;
}

function displayDownloadDialog() {
    let log = null;
    let doc = new DocumentEx();
    doc.idPrefix = "fbe_";
    doc.programName = PROGRAM_NAME + " v" + GM_info.script.version;
    const dlg = new Dialog({
      onsubmit: () => {
        makeAction(doc, dlg, log);
      },
      onhide: () => {
        Loader.abortAll();
        doc = null;
        if (dlg.link) {
          URL.revokeObjectURL(dlg.link.href);
          dlg.link = null;
        }
      }
    });
    dlg.show();
    log = new LogElement(dlg.log);
    dlg.button.textContent = setStage(0);
    makeAction(doc, dlg, log);
}

async function makeAction(doc, dlg, log) {
  try {
    switch (stage) {
      case 0:
        await getBookInfo(doc, log);
        dlg.button.textContent = setStage(1);
        dlg.button.disabled = false;
        break;
      case 1:
        dlg.button.textContent = setStage(2);
        await getBookContent(doc, log);
        dlg.button.textContent = setStage(3);
        break;
      case 2:
        Loader.abortAll();
        dlg.button.textContent = setStage(4);
        break;
      case 3:
        if (!dlg.link) {
          dlg.link = document.createElement("a");
          dlg.link.download = genBookFileName(doc);
          dlg.link.href = URL.createObjectURL(new Blob([ doc ], { type: "application/octet-stream" }));
        }
        dlg.link.click();
        break;
      case 4:
        dlg.hide();
        break;
    }
  } catch (err) {
    console.error(err);
    log.message(err.message, "red");
    dlg.button.textContent = setStage(4);
    dlg.button.disabled = false;
  }
}

function setStage(newStage) {
  stage = newStage;
  return [ "Анализ...", "Продолжить", "Прервать", "Сохранить в файл", "Закрыть" ][newStage] || "Error";
}

function getBookInfoElement(htmlString) {
  const doc = (new DOMParser()).parseFromString(htmlString, "text/html");
  return doc.querySelector("section.chapter-info");
}

async function getBookInfo(doc, log) {
  const logTitle = log.message("Название:");
  const logAuthors = log.message("Авторы:");
  const logTags = log.message("Теги:");
  const logUpdate = log.message("Последнее обновление:");
  const logChapters = log.message("Всего глав:");
  //--
  const idR = /^\/readfic\/([^\/]+)/.exec(document.location.pathname);
  if (!idR) throw new Error("Не найден id произведения");
  const url = new URL(`/readfic/${encodeURIComponent(idR[1])}`, document.location);
  const bookEl = getBookInfoElement(await Loader.addJob(url));
  if (!bookEl) throw new Error("Не найдено описание произведения");
  // ID произведения
  doc.id = idR[1];
  // Название произведения
  doc.bookTitle = (() => {
    const el = bookEl.querySelector("h1[itemprop=name]") || bookEl.querySelector("h1[itemprop=headline]");
    const str = el && el.textContent.trim() || null;
    if (!str) throw new Error("Не найдено название произведения");
    return str;
  })();
  logTitle.text(doc.bookTitle);
  // Авторы
  doc.bookAuthors = (() => {
    return Array.from(
      bookEl.querySelectorAll(".hat-creator-container .creator-info a.creator-username + i")
    ).reduce((list, el) => {
      if ([ "автор", "соавтор", "переводчик", "сопереводчик" ].includes(el.textContent.trim().toLowerCase())) {
        const name = el.previousElementSibling.textContent.trim();
        if (name) {
          const au = new FB2Author(name);
          au.homePage = el.href;
          list.push(au);
        }
      }
      return list;
    }, []);
  })();
  logAuthors.text(doc.bookAuthors.length || "нет");
  if (!doc.bookAuthors.length) log.warning("Не найдена информация об авторах");
  // Жанры
  doc.genres = new FB2GenreList([ "фанфик" ]);
  // Ключевые слова
  doc.keywords = (() => {
    // Селектор :not(.hidden) исключает спойлерные теги
    return Array.from(bookEl.querySelectorAll(".tags a.tag[href^=\"/tags/\"]:not(.hidden)")).reduce((list, el) => {
      const tag = el.textContent.trim();
      if (tag) list.push(tag);
      return list;
    }, []);
  })();
  logTags.text(doc.keywords.length || "нет");
  // Список глав
  const chapters = getChaptersList(bookEl);
  if (!chapters.length) {
    // Возможно это короткий рассказ, так что есть шанс, что единственная глава находится тут же.
    const chData = getChapterData(bookEl);
    if (chData) {
      const titleEl = bookEl.querySelector("article .title-area h2");
      const title = titleEl && titleEl.textContent.trim();
      const pubEl = bookEl.querySelector("article div[itemprop=datePublished] span");
      const published = pubEl && pubEl.title || "";
      chapters.push({
        id: null,
        title: title !== doc.bookTitle ? title : null,
        updated: published,
        data: chData
      });
    }
  }
  // Дата произведения (последнее обновление)
  const months = new Map([
    [ "января", "01" ], [ "февраля", "02" ], [ "марта", "03" ], [ "апреля", "04" ], [ "мая", "05" ], [ "июня", "06" ],
    [ "июля", "07" ], [ "августа", "08" ], [ "сентября", "09" ], [ "октября", "10" ], [ "ноября", "11" ], [ "декабря", "12" ]
  ]);
  doc.bookDate = (() => {
    return chapters.reduce((result, chapter) => {
      const rr = /^(\d+)\s+([^ ]+)\s+(\d+)\s+г\.,\s+(\d+:\d+)$/.exec(chapter.updated);
      if (rr) {
        const m = months.get(rr[2]);
        const d = (rr[1].length === 1 ? "0" : "") + rr[1];
        const ts = new Date(`${rr[3]}-${m}-${d}T${rr[4]}`);
        if (ts instanceof Date && !isNaN(ts.valueOf())) {
          if (!result || result < ts) result = ts;
        }
      }
      return result;
    }, null);
  })();
  logUpdate.text(doc.bookDate && doc.bookDate.toLocaleString() || "n/a");
  // Ссылка на источник
  doc.sourceURL = url.toString();
  //--
  logChapters.text(chapters.length);
  if (!chapters.length) throw new Error("Нет глав для выгрузки!");
  doc.element = bookEl;
  doc.chapters = chapters;
}

function getChaptersList(bookEl) {
  return Array.from(bookEl.querySelectorAll("ul.list-of-fanfic-parts>li.part")).reduce((list, el) => {
    const aEl = el.querySelector("a.part-link");
    const rr = /^\/readfic\/[^\/]+\/(\d+)/.exec(aEl.getAttribute("href"));
    if (rr) {
      const tEl = el.querySelector(".part-title");
      const dEl = el.querySelector(".part-info>span[title]");
      const chapter = {
        id: rr[1],
        title: tEl && tEl.textContent.trim() || "Без названия",
        updated: dEl && dEl.title.trim() || null
      };
      list.push(chapter);
    }
    return list;
  }, []);
}

async function getBookContent(doc, log) {
  const bookEl = doc.element;
  delete doc.element;
  let li = null;
  try {
    // Загрузка обложки
    doc.coverpage = await ( async () => {
      const el = bookEl.querySelector(".fanfic-hat-body fanfic-cover");
      if (el) {
        const url = el.getAttribute("src-desktop") || el.getAttribute("src-original") || el.getAttribute("src-mobile");
        if (url) {
          const img = new FB2Image(url);
          let li = log.message("Загрузка обложки...");
          try {
            await img.load((loaded, total) => li.text("" + Math.round(loaded / total * 100) + "%"));
            img.id = "cover" + img.suffix();
            doc.binaries.push(img);
            log.message("Размер обложки:").text(img.size + " байт");
            log.message("Тип обложки:").text(img.type);
            li.ok();
            return img;
          } catch (err) {
            li.fail();
            return false;
          }
        }
      }
    })();
    if (!doc.coverpage) log.warning(doc.coverpage === undefined ? "Обложка не найдена" : "Не удалось загрузить обложку");
    // Аннотация
    const annData = (() => {
      const result = [];
      // Бейджики
      Array.from(bookEl.querySelectorAll("section div .badge-text")).forEach(te => {
        const parent = te.parentElement;
        if (parent.classList.contains("direction")) {
          result.push({ index: 4, title: "Направленность:", element: te.textContent.trim(), inline: true });
        } else if (Array.from(parent.classList).some(c => c.startsWith("badge-rating"))) {
          result.push({ index: 5, title: "Рейтинг:", element: te.textContent.trim(), inline: true });
        } else if (Array.from(parent.classList).some(c => c.startsWith("badge-status"))) {
          result.push({ index: 6, title: "Статус:", element: te.textContent.trim(), inline: true });
        }
      });
      // Другие атрибуты фанфика
      const descrMap = new Map([
        [ "серия:", { index: 1, selector: "a", inline: true }],
        [ "вселенная:", { index: 2, selector: "a", inline: true }],
        [ "фэндом:", { index: 3, selector: "a", inline: true }],
        [ "автор оригинала:", { index: 7, selector: "a", inline: true } ],
        [ "оригинал:", { index: 8, inline: true } ],
        [ "пэйринг и персонажи:", { index: 9, selector: "a", inline: true } ],
        [ "размер:", { index: 10, inline: true } ],
        [ "метки:", { index: 11, selector: "a:not(.hidden)", inline: true } ],
        [ "описание:", { index: 12, inline: false } ],
        [ "примечания:", { index: 13, inline: false } ]
      ]);
      return Array.from(bookEl.querySelectorAll(".description strong")).reduce((list, strongEl) => {
        const title = strongEl.textContent.trim();
        const md = descrMap.get(title.toLowerCase());
        if (md && strongEl.nextElementSibling) {
          let element = null;
          if (md.selector) {
            element = strongEl.ownerDocument.createElement("span");
            element.textContent = Array.from(
              strongEl.nextElementSibling.querySelectorAll(md.selector)
            ).map(el => el.textContent.trim()).join(", ");
            if (md.index === 1 && element.textContent !== "") doc.sequence = { name: element.textContent };
          } else {
            element = strongEl.nextElementSibling;
          }
          list.push({ index: md.index, title: title, element: element, inline: md.inline });
        }
        return list;
      }, result);
    })();
    if (annData.length) {
      li = log.message("Формирование аннотации...");
      doc.bindParser("ann", new AnnotationParser());
      annData.sort((a, b) => (a.index - b.index));
      annData.forEach(it => {
        if (doc.annotation) {
          if (!it.inline) doc.annotation.children.push(new FB2EmptyLine());
        } else {
          doc.annotation = new FB2Annotation();
        }
        let par = new FB2Paragraph();
        par.children.push(new FB2Element("strong", it.title));
        doc.annotation.children.push(par);
        if (it.inline) {
          par.children.push(new FB2Text(" " +(typeof(it.element) === "string" ? it.element : it.element.textContent).trim()));
        } else {
          doc.parse("ann", log, it.element);
        }
      });
      doc.bindParser("ann", null);
      li.ok();
    } else {
      log.warning("Аннотация не найдена");
    }
    log.message("---");
    // Получение и формирование глав
    doc.bindParser("chp", new ChapterParser());
    const chapters = doc.chapters;
    doc.chapters = [];
    let chIdx = 0;
    let chCnt = chapters.length;
    let errCnt = 0;
    const errMax = 15;
    while (chIdx < chCnt) {
      const chItem = chapters[chIdx];
      li = log.message(`Получение главы ${chIdx + 1}/${chCnt}...`);
      try {
        let chData = chItem.data;
        if (!chData) {
          const url = new URL(`/readfic/${encodeURIComponent(doc.id)}/${encodeURIComponent(chItem.id)}`, document.location);
          await sleep(100);
          chData = getChapterData(await Loader.addJob(url));
        }
        // Преобразование в FB2
        doc.parse("chp", log, genChapterElement(chData), chItem.title, chData.notes);
        li.ok();
        li = null;
        ++chIdx;
        errCnt = 0;
      } catch (err) {
        if (err instanceof HttpError) {
          if (err.code === 429) {
            errCnt = 0;
            li.fail();
            log.warning("Ответ сервера: слишком много запросов");
          } else if (errCnt < errMax && err.code >= 500 && err.code < 600) {
            ++errCnt;
            li.fail();
            log.warning(`Сервер перегружен запросами (${err.code}) ${errCnt}/${errMax}`);
          } else {
            throw err;
          }
          log.message("Ждем 30 секунд");
          await sleep(30000);
        } else {
          throw err;
        }
      }
    }
    doc.bindParser("chp", null);
    //--
    doc.history.push("v1.0 - создание fb2 - (Ox90)");
    if (doc.unknowns) {
      log.message("---");
      log.warning(`Найдены неизвестные элементы: ${doc.unknowns}`);
      log.message("Преобразованы в текст без форматирования");
    }
    log.message("---");
    log.message("Готово!");
  } catch (err) {
    li && li.fail();
    doc.bindParser();
    throw err;
  }
}

function genChapterElement(chData) {
  const chapterEl = document.createElement("div");
  const parts = [];
  [ "topComment", "content", "bottomComment" ].reduce((list, it) => {
    if (chData[it]) list.push(chData[it]);
    return list;
  }, []).forEach((partEl, idx) => {
    if (idx) chapterEl.append("\n\n----------\n\n");
    if (partEl.id !== "content") {
      const titleEl = document.createElement("strong");
      titleEl.textContent = "Примечания:";
      chapterEl.append(titleEl, "\n\n");
    }
    while (partEl.firstChild) chapterEl.append(partEl.firstChild);
  });
  return chapterEl;
}

function getChapterData(html) {
  const result = {};
  const doc = typeof(html) === "string" ? (new DOMParser()).parseFromString(html, "text/html") : html;
  // Извлечение элемента с содержанием
  const chapter = doc.querySelector("article #content[itemprop=articleBody]");
  if (!chapter) throw new Error("Ошибка анализа HTML данных главы");
  result.content = chapter;
  // Поиск данных сносок
  const rr = /\s+textFootnotes\s+=\s+({.*\})/.exec(html);
  if (rr) {
    try {
      result.notes = JSON.parse(rr[1]);
    } catch (err) {
      throw new Error("Ошибка анализа данных заметок");
    }
  }
  // Примечания автора к главе
  [ [ "topComment", ".part-comment-top>strong + div" ], [ "bottomComment", ".part-comment-bottom>strong + div" ] ].forEach(it => {
    const commentEl = chapter.parentElement.querySelector(it[1]);
    if (commentEl) result[it[0]] = commentEl;
  });
  //--
  return result;
}

function genBookFileName(doc) {
  function xtrim(s) {
    const r = /^[\s=\-_.,;!]*(.+?)[\s=\-_.,;!]*$/.exec(s);
    return r && r[1] || s;
  }

  const fn_template = Settings.get("filename", true).trim();
  const ndata = new Map();
  // Автор [\a]
  const author = doc.bookAuthors[0];
  if (author) {
    const author_names = [ author.firstName, author.middleName, author.lastName ].reduce((res, nm) => {
      if (nm) res.push(nm);
      return res;
    }, []);
    if (author_names.length) {
      ndata.set("a", author_names.join(" "));
    } else if (author.nickName) {
      ndata.set("a", author.nickName);
    }
  }
  // Название книги [\t]
  ndata.set("t", xtrim(doc.bookTitle));
  // Количество глав [\c]
  ndata.set("c", `${doc.chapters.length}`);
  // Id книги [\i]
  ndata.set("i", doc.id);
  // Окончательное формирование имени файла плюс дополнительные чистки и проверки.
  function replacer(str) {
    let cnt = 0;
    const new_str = str.replace(/\\([atci])/g, (match, ti) => {
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
    if (pos !== -1) {
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

async function sleep(msecs) {
  return new Promise(resolve => setTimeout(resolve, msecs));
}

function decodeHTMLChars(s) {
  const e = document.createElement("div");
  e.innerHTML = s;
  return e.textContent;
}

//---------- Классы ----------

class DocumentEx extends FB2Document {
  constructor() {
    super();
    this.unknowns = 0;
  }

  parse(parserId, log, ...args) {
    const pdata = super.parse(parserId, ...args);
    pdata.unknownNodes.forEach(el => {
      log.warning(`Найден неизвестный элемент: ${el.nodeName}`);
      ++this.unknowns;
    });
    return pdata.result;
  }
}

class TextParser extends FB2Parser {
  run(doc, htmlNode) {
    this._unknownNodes = [];
    const res = super.run(doc, htmlNode);
    const pdata = { result: res, unknownNodes: this._unknownNodes };
    delete this._unknowNodes;
    return pdata;
  }

  /**
   * Текст глав на сайте оформляется довольно странно. Фактически это plain text
   * с нерегулярными вкраплениями разметки. Тег <p> используется, но в основном как
   * контейнер для выравнивания строк текста и подзаголовков.
   * ---
   * Перед парсингом блоки текста упаковываются в параграфы, разделитель - символ новой строки
   * Все пустые строки заменяются на empyty-line. Также учитывается вложенность других элементов.
   */
  parse(htmlNode) {
    const doc = htmlNode.ownerDocument;
    const newNode = htmlNode.cloneNode(false);
    let nodeChain = [ doc.createElement("p") ];
    newNode.append(nodeChain[0]);

    function insertText(text, newBlock) {
      if (newBlock) {
        if (nodeChain[0].textContent.trim() === "") {
          newNode.lastChild.remove();
          newNode.append(doc.createElement("br"));
        }
        let parent = newNode;
        nodeChain = nodeChain.map(n => {
          const nn = n.cloneNode(false);
          parent = parent.appendChild(nn);
          return nn;
        });
        parent.append(text);
      } else {
        nodeChain[nodeChain.length - 1].append(text);
      }
    }

    function rewriteChildNodes(node) {
      let cn = node.firstChild;
      while (cn) {
        if (cn.nodeName === "#text") {
          const lines = cn.textContent.split("\n");
          for (let i = 0; i < lines.length; ++i) insertText(lines[i], i > 0);
        } else {
          const nn = cn.cloneNode(false);
          nodeChain[nodeChain.length - 1].append(nn);
          nodeChain.push(nn);
          rewriteChildNodes(cn);
          nodeChain.pop();
        }
        cn = cn.nextSibling;
      }
    }

    rewriteChildNodes(htmlNode);
    return super.parse(newNode);
  }

  processElement(fb2el, depth) {
    if (fb2el instanceof FB2UnknownNode) this._unknownNodes.push(fb2el.value);
    return super.processElement(fb2el, depth);
  }
}

class AnnotationParser extends TextParser {
  run(doc, htmlNode) {
    this._annotation = new FB2Annotation();
    const res = super.run(doc, htmlNode);
    this._annotation.normalize();
    if (doc.annotation) {
      this._annotation.children.forEach(el => doc.annotation.children.push(el));
    } else {
      doc.annotation = this._annotation;
    }
    delete this._annotation;
    return res;
  }

  processElement(fb2el, depth) {
    if (fb2el && !depth) this._annotation.children.push(fb2el);
    return super.processElement(fb2el, depth);
  }
}

class ChapterParser extends TextParser {
  run(doc, htmlNode, title, notes) {
    this._chapter = new FB2Chapter(title);
    this._noteValues = notes;
    const res = super.run(doc, htmlNode);
    this._chapter.normalize();
    doc.chapters.push(this._chapter);
    delete this._chapter;
    return res;
  }

  startNode(node, depth, fb2to) {
    if (node.nodeName === "SPAN") {
      if (node.classList.contains("footnote") && node.textContent === "") {
        // Это заметка
        if (this._noteValues) {
          const value = this._noteValues[node.id];
          if (value) {
            const nt = new FB2Note(decodeHTMLChars(value), "");
            this.processElement(nt, depth);
            fb2to && fb2to.children.push(nt);
          }
        }
        return null;
      }
    } else if (node.nodeName === "P") {
      if (node.style.textAlign === "center" && [ "•••", "* * *", "***" ].includes(node.textContent.trim())) {
        // Это подзаголовок
        const sub = new FB2Subtitle("* * *")
        this.processElement(sub, depth);
        fb2to && fb2to.children.push(sub);
        return null;
      }
    }
    return super.startNode(node, depth, fb2to);
  }

  processElement(fb2el, depth) {
    if (fb2el && !depth) this._chapter.children.push(fb2el);
    return super.processElement(fb2el, depth);
  }
}

class Dialog {
  constructor(params) {
    this._onsubmit = params.onsubmit;
    this._onhide = params.onhide;
    this._dlgEl = null;
    this.log = null;
    this.button = null;
  }

  show() {
    this._mainEl = document.createElement("div");
    this._mainEl.tabIndex = -1;
    this._mainEl.classList.add("modal");
    this._mainEl.setAttribute("role", "dialog");
    const backEl = document.createElement("div");
    backEl.classList.add("modal-backdrop", "in");
    backEl.style.zIndex = 0;
    backEl.addEventListener("click", () => this.hide());
    const dlgEl = document.createElement("div");
    dlgEl.classList.add("modal-dialog");
    dlgEl.setAttribute("role", "document");
    const ctnEl = document.createElement("div");
    ctnEl.classList.add("modal-content");
    dlgEl.append(ctnEl);
    const bdyEl = document.createElement("div");
    bdyEl.classList.add("modal-body");
    ctnEl.append(bdyEl);
    const tlEl = document.createElement("div");
    const clBtn = document.createElement("button");
    clBtn.classList.add("close");
    clBtn.innerHTML = "<span aria-hidden=\"true\">×</span>";
    clBtn.addEventListener("click", () => this.hide());
    const hdrEl = document.createElement("h3");
    hdrEl.textContent = "Формирование файла FB2";
    tlEl.append(clBtn, hdrEl);
    const container = document.createElement("form");
    container.classList.add("modal-container");
    bdyEl.append(tlEl, container);
    this.log = document.createElement("div");
    const stBtn = document.createElement("p");
    stBtn.style.cursor = "pointer";
    stBtn.style.textDecoration = "underline";
    stBtn.style.margin = "-.5em 0 0";
    stBtn.style.fontSize = "85%";
    stBtn.style.opacity = ".7";
    stBtn.textContent = "Настройки";
    const stForm = document.createElement("div");
    stForm.style.display = "none";
    stForm.style.padding = ".5em";
    stForm.style.margin = ".75em 0";
    stForm.style.border = "1px solid lightgray";
    stForm.style.borderRadius = "5px";
    stForm.innerHTML = '<div><label>Шаблон имени файла (без расширения)</label>' +
      '<input type="text" style="width:100%; background-color:transparent; border:1px solid gray; border-radius:3px; font-size:90%">' +
      '<ul style="color:gray; font-size:85%; margin:0; padding-left:1em;">' +
      '<li>\\a - Автор книги;</li><li>\\t - Название книги;</li><li>\\i - Идентификатор книги;</li><li>\\c - Количество глав;</li>' +
      '<li>&lt;…&gt; - Если внутри такого блока будут отсутвовать данные для шаблона, то весь блок будет удален;</li>' +
      '</ul><div style="color:gray; font-size:85%;">' +
      '<span style="color:red; font-weight:bold;">!</span> Оставьте это поле пустым, если хотите вернуть шаблон по умолчанию.</div>';
    stBtn.addEventListener("click", event => {
      if (stForm.style.display) {
        stForm.querySelector("input").value = Settings.get("filename");
        stForm.style.removeProperty("display");
      } else {
        stForm.style.display = "none";
        Settings.set("filename", stForm.querySelector("input").value);
        Settings.save();
      }
    });
    const buttons = document.createElement("div");
    buttons.style.display = "flex";
    buttons.style.justifyContent = "center";
    this.button = document.createElement("button");
    this.button.type = "submit";
    this.button.disabled = true;
    this.button.classList.add("btn", "btn-primary");
    this.button.textContent = "Продолжить";
    buttons.append(this.button);
    container.append(this.log, stBtn, stForm, buttons);
    this._mainEl.append(backEl, dlgEl);
    container.addEventListener("submit", event => {
      event.preventDefault();
      if (!stForm.style.display) stBtn.dispatchEvent(new Event("click"));
      stBtn.remove();
      this._onsubmit && this._onsubmit();
    });

    this._mainEl.addEventListener('keydown', event => {
      if (event.code == 'Escape' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        this.hide();
      }
    });

    const dlgList = document.querySelector("div.js-modal-destination");
    if (!dlgList) throw new Error("Не найден контейнер для модальных окон");
    dlgList.append(this._mainEl);
    document.body.classList.add("modal-open");
    this._mainEl.style.display = "block";
    this._mainEl.focus();
  }

  hide() {
    this.log = null;
    this.button = null;
    this._mainEl && this._mainEl.remove();
    document.body.classList.remove("modal-open");
    this._onhide && this._onhide();
  }
}

class LogElement {
  constructor(element) {
    element.style.padding = ".5em";
    element.style.fontSize = "90%";
    element.style.border = "1px solid lightgray";
    element.style.marginBottom = "1em";
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
      case "filename":
        if (typeof(val) !== "string" || val.trim() === "") val = "<\\a. >\\t [FBN-\\i]";
        break;
    }
    return val;
  }

  static set(name, value) {
    this._ensureValues();
    this._values[name] = value;
  }

  static save() {
    localStorage.setItem("fbe.settings", JSON.stringify(this._values || {}));
  }

  static _ensureValues() {
    if (this._values) return;
    try {
      this._values = JSON.parse(localStorage.getItem("fbe.settings"));
    } catch (err) {
      this._values = null;
    }
    if (!this._values || typeof(this._values) !== "object") Settings._values = {};
  }
}

class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "HttpError";
    this.code = code;
  }
}

class Loader extends FB2Loader {
  static async addJob(url, params) {
    if (url.origin === document.location.origin) {
      return super.addJob(url, params).catch(err => {
        const match = /\((\d+)\)$/.exec(err.message);
        if (match) err = new HttpError(err.message, Number(match[1]));
        throw err;
      });
    }

    params ||= {};
    params.url = url;
    params.method ||= "GET";
    params.responseType = params.responseType === "binary" ? "blob" : "text";
    if (!this.ctl_list) this.ctl_list = new Set();

    return new Promise((resolve, reject) => {
      let req = null;
      params.onload = r => {
        if (r.status === 200) {
          resolve(r.response);
        } else {
          reject(new HttpError("Сервер вернул ошибку (" + r.status + ")", r.status));
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

FB2Image.prototype._load = function(...args) {
  if (!(this.url instanceof URL)) this.url = new URL(this.url);
  return Loader.addJob(...args);
};

//-------------------------

// Запускает скрипт после загрузки страницы сайта
if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
  else init();

})();
