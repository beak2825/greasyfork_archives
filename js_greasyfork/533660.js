// ==UserScript==
// @name           LitmarketExtractor
// @name:ru        LitmarketExtractor
// @namespace      90h.yy.zz
// @version        0.1.1
// @author         Ox90
// @match          https://litmarket.ru/*
// @description    The script adds a button to the site for downloading books to an FB2 file
// @description:ru Скрипт добавляет кнопку для скачивания книги в формате FB2
// @require        https://update.greasyfork.org/scripts/468831/1575776/HTML2FB2Lib.js
// @grant          GM.xmlHttpRequest
// @connect        litmarket.ru
// @run-at         document-start
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/533660/LitmarketExtractor.user.js
// @updateURL https://update.greasyfork.org/scripts/533660/LitmarketExtractor.meta.js
// ==/UserScript==

(function start() {
  'use strict';

const PROGRAM_NAME = GM_info.script.name;

let mainBtn = null;
let stage = null;

/**
 * Начальный запуск скрипта сразу после загрузки страницы сайта
 *
 * @return void
 */
function init() {
  addStyles();
  pageHandler();
}

/**
 * Идентификация страницы и запуск необходимых функций
 */
function pageHandler() {
  const path = document.location.pathname;
  if (path.startsWith('/books/')) {
    handleBookPage();
  }
}

/**
 * Обработчик страницы с книгой
 */
function handleBookPage() {
  setMainButton();
}

/**
 * Находит панель и добавляет туда кнопку, если она отсутствует.
 * Если панели с кнопками нет, то она будет создана.
 *
 * @return void
 */
function setMainButton() {
  if (document.querySelector('.card-info>.card-buttons>.read-button')) { // Исключить аудиокниги
    const container = document.querySelector('.card-info>.card-buttons>.author-buttons-container');
    if (container) {
      let buttons = container.querySelector('.author-buttons');
      if (!buttons) {
        let e = container.appendChild(document.createElement('div'));
        e.classList.add('author-buttons-container-elem');
        e = e.appendChild(document.createElement('div'));
        buttons = e.appendChild(document.createElement('div'));
        buttons.classList.add('author-buttons');
      }
      buttons.classList.add('lme-buttons');
      if (!buttons.querySelector('lme-main-button')) {
        if (!mainBtn) mainBtn = makeMainButton();
        buttons.append(mainBtn);
      }
    }
  }
}

/**
 * Создает и возвращает элемент кнопки, которая размещается на странице книги
 *
 * @return Element HTML-элемент кнопки для добавления на страницу
 */
function makeMainButton() {
  const btn = document.createElement('div');
  btn.classList.add('btn', 'btn-author', 'btn-outline-darkblue');
  const ae = btn.appendChild(document.createElement('a'));
  ae.classList.add('btn-ebook-download');
  ae.href = '';
  ae.title = `Скачать FB2 (${PROGRAM_NAME})`;
  const se = ae.appendChild(document.createElement('span'));
  se.textContent = 'Скачать FB2e';
  btn.addEventListener('click', event => {
    event.preventDefault();
    displayDownloadDialog();
  });
  return btn;
}

/**
 * Обработчик нажатия кнопки "Скачать FB2" на странице книги
 *
 * @return void
 */
async function displayDownloadDialog() {
  if (mainBtn.dataset.disabled === 'true') return;
  try {
    mainBtn.dataset.disabled = 'true';
    let log = null;
    let doc = new FB2Document();
    const bdata = {};
    const dlg = new DownloadDialog({
      title: 'Формирование файла FB2',
      settings: {},
      onclose: () => {
        //Loader.abortAll();
        log = null;
        doc = null;
        if (dlg.link) {
          URL.revokeObjectURL(dlg.link.href);
          dlg.link = null;
        }
      },
      onsubmit: result => {
        dlg.result = result;
        makeAction(doc, bdata, dlg, log);
      }
    });
    dlg.show();
    dlg.button.textContent = setStage(0);
    log = new LogElement(dlg.log);
    log.message(PROGRAM_NAME + ' v' + GM_info.script.version);
    const r = /^\/books\/(.+)$/.exec(document.location.pathname);
    if (r) {
      bdata.urlId = r[1];
      await getBookOverview(doc, bdata, log);
      if (stage === 0) {
        doc.id = bdata.bookId;
        doc.idPrefix = 'lmextr_';
        doc.programName = PROGRAM_NAME + ' v' + GM_info.script.version;
        dlg.button.textContent = setStage(1);
      }
    } else {
      log.warning('Идентификатор книги не распознан!');
      dlg.button.textContent = setStage(4);
    }
  } catch (err) {
    console.error(err);
    //Notification.display(err.message, 'error');
  } finally {
    delete mainBtn.dataset.disabled;
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
  return [ 'Прервать', 'Продолжить', 'Прервать', 'Сохранить в файл', 'Закрыть' ][new_stage] || 'Error';
}

/**
 * Фактический обработчик нажатий на кнопку формы выгрузки
 *
 * @param FB2Document    doc   Формируемый документ
 * @param Object         bdata Служебные даные книги
 * @param DownloadDialog dlg   Экземпляр формы выгрузки
 * @param LogElement     log   Лог для фиксации прогресса
 *
 * @return void
 */
async function makeAction(doc, bdata, dlg, log) {
  try {
    switch (stage) {
      case 1:
        dlg.button.textContent = setStage(2);
        await getBookContent(doc, bdata, log);
        if (stage == 2) dlg.button.textContent = setStage(3);
        break;
      case 0:
      case 2:
        Loader.abortAll();
        dlg.button.textContent = setStage(4);
        log.warning('Операция прервана');
        //Notification.display('Операция прервана', 'warning');
        break;
      case 3:
        if (!dlg.link) {
          dlg.link = document.createElement('a');
          dlg.link.setAttribute('download', genBookFileName(doc));
          // Должно быть text/plain, но в этом случае мобильный Firefox к имени файла добавляет .txt
          dlg.link.href = URL.createObjectURL(new Blob([ doc ], { type: 'application/octet-stream' }));
        }
        dlg.link.click();
        break;
      case 4:
        dlg.hide();
        break;
    }
  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
      log.message(err.message, 'red');
      //Notification.display(err.message, 'error');
    }
    dlg.button.textContent = setStage(4);
  }
}

/**
 * Получение описания книги с сервера
 *
 * @return Object
 */
async function getBookOverview(doc, bdata, log) {
  const res = {};
  let li = log.message('Загрузка описания книги...');
  try {
    const url = new URL('/reader/data/' + encodeURIComponent(bdata.urlId), document.location);
    const r = await Loader.addJob(url, addTokens({
      method: 'GET',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
      },
      responseType: 'text',
      onprogress: (loaded, total) => {
        if (total) li.text('' + Math.round(loaded / total * 100) + '%');
      }
    }));
    let resp = null;
    try {
      resp = JSON.parse(r.response);
    } catch (err) {
      console.error(err);
      throw new Error('Неожиданный ответ сервера');
    }
    if (!resp.book) throw new Error('Не найдено описание книги!');
    if (!resp.book.ebookId) throw new Error('Не найден Id книги!');
    bdata.bookId = resp.book.ebookId;
    // Название
    if (!resp.book.bookName) throw new Error('Не найдено название книги!');
    doc.bookTitle = resp.book.bookName.trim();
    log.message('Название:').text(doc.bookTitle);
    // Авторы
    if (!resp.book.authorNickname) throw new Error('Не найден автор книги!');
    const author = new FB2Author(resp.book.authorNickname);
    if (resp.book.authorSlug) {
      author.homePage = (new URL('/' + encodeURIComponent(resp.book.authorSlug) + '-p' + resp.book.authorId, document.location)).toString();
    }
    doc.bookAuthors = [ author ];
    if (resp.book.coAuthors) {
      // В API сайта попадаются дубликаты соавторов. Проверять!
      const m = new Set();
      resp.book.coAuthors.forEach(ae => {
        if (ae.nickname && ae.id && !m.has(ae.id)) {
          m.add(ae.id);
          const a = new FB2Author(ae.nickname);
          if (ae.slug) {
            a.homePage = (new URL('/' + encodeURIComponent(ae.slug) + '-p' + ae.id, document.location)).toString();
          }
          doc.bookAuthors.push(a);
        }
      });
    }
    let str1 = '';
    if (doc.bookAuthors.length > 1) {
      str1 = ', и ещё ' + (doc.bookAuthors.length - 1);
    }
    log.message('Автор:').text(author.toString() + str1);
    //--
    li.ok();
    li = null;
    // Жанры
    const genres = (resp.book.genres || []).reduce((res, g) => {
      const s = g.label.trim();
      if (s) res.push(s);
      return res;
    }, []);
    doc.genres = new FB2GenreList(genres);
    if (doc.genres.length) {
      console.info('Жанры: ', doc.genres.map(g => g.value).join(', '));
    } else {
      console.warn('Не идентифицирован ни один жанр!');
    }
    log.message('Жанры:').text(doc.genres.length);
    // Ключевые слова
    doc.keywords = (resp.book.tags || []).reduce((res, t) => {
      const s = t.name.trim();
      if (s) res.push(s);
      return res;
    }, []);
    log.message('Ключевые слова:').text(doc.keywords.length || 'нет');
    // Серия
    if (resp.book.cycleName) {
      const seq = { name: resp.book.cycleName.trim() };
      if (resp.book.cycleNumber) seq.number = resp.book.cycleNumber;
      doc.sequence = seq;
      log.message('Серия:').text(seq.name);
      if (seq.number) log.message('Номер в серии:').text(seq.number);
    }
    // Дата публикации (последнее обновление)
    const bookDate = resp.book.lastUpdateDate || resp.book.createdAtBookFormat;
    if (bookDate) {
      const da = bookDate.split('.');
      if (da.length === 3) {
        if (da[2].length === 2) da[2] = '20' + da[2];
        const d = new Date(da.reverse().join('-'));
        if (!isNaN(d.valueOf())) doc.bookDate = d;
      } else if (bookDate.toLowerCase() === 'сегодня') {
        doc.bookDate = new Date();
      }
    }
    log.message('Дата публикации:').text(doc.bookDate ? doc.bookDate.toLocaleDateString() : 'n/a');
    // Ссылка на источник
    doc.sourceURL = document.location.origin + document.location.pathname;
    log.message('Источник:').text(doc.sourceURL);
    // Обложка
    if (resp.book.bookCoverSrc) {
      const img = new FB2Image(resp.book.bookCoverSrc);
      doc.coverpage = img;
      doc.binaries.push(img);
    } else {
      log.warning('Обложка книги не найдена!');
    }
    // Аннотация
    if (resp.book.annotation) {
      bdata.annotation = resp.book.annotation;
    } else {
      log.warning('Аннотация не найдена!');
    }
    // Статус
    li = log.message('Статус:');
    switch (resp.book.ebookStatus) {
      case 'Закончена':
        doc.status = 'finished';
        li.text('завершена');
        break;
      case 'В работе':
        doc.status = 'in-progress';
        li.text('в работе');
        break;
      default:
        doc.status = 'err';
        li.text('???');
        break;
    }
    // Список глав
    if (!resp.tableOfContent) throw new Error('Не найден список глав книги');
    const chapters = JSON.parse(resp.tableOfContent).reduce((res, it) => {
      if (it.type === 'block' && it.chunk && it.chunk.type === 'chapter' && it.chunk.mods) {
        it = it.chunk.mods.find(m => (m.type === 'INLINE' && m.text));
        if (it) res.push({ title: it.text });
      }
      return res;
    }, []);
    bdata.chapters = chapters;
    log.message('Всего глав:').text(chapters.length || 'нет');
    // Количество страниц
    log.message('Всего страниц:').text(resp.book.pagesCount || 'n/a');
    //
    log.message('-------------------------');
    log.message('Анализ завершен');
    log.message('-------------------------');
    //
  } catch (err) {
    if (li) li.fail();
    log.warning(err.message);
  }
  return res;
}

/**
 * Загружает обложку книги, анализирует аннотацию, загружает главы и анализирует их
 *
 * @param FB2DocumentEx doc   Формируемый документ
 * @param Object        bdata Объект с предварительными данными
 * @param LogElement    log   Лог для фиксации процесса формирования книги
 *
 * @return void
 */
async function getBookContent(doc, bdata, log) {
  let li = null;
  try {
    // Загрузка обложки
    if (doc.coverpage) {
      li = log.message('Загрузка обложки...');
      await doc.coverpage.load((loaded, total) => {
        if (total) li.text('' + Math.round(loaded / total * 100) + '%');
      });
      li.ok();
      li = null;
      log.message('Размер обложки:').text(doc.coverpage.size + ' байт');
      log.message('Тип обложки:').text(doc.coverpage.type);
    }
    // Анализ аннотации
    if (bdata.annotation) {
      li = log.message('Формирование аннотации...');
      const ann = new FB2Annotation();
      bdata.annotation.split('\r\n').forEach(line => {
        if (line === '') {
          if (ann.children.length) ann.children.push(new FB2EmptyLine());
        } else {
          ann.children.push(new FB2Paragraph(line));
        }
      });
      ann.normalize();
      doc.annotation = ann;
      li.ok();
    }
    // Загрузка глав
    li = log.message('Загрузка содержимого глав...');
    const url = new URL('/reader/blocks/' + bdata.bookId, document.location);
    const r = await Loader.addJob(url, addTokens({
      method: 'GET',
      responseType: 'text',
      onprogress: (loaded, total) => {
        if (total) li.text('' + Math.round(loaded / total * 100) + '%');
      }
    }));
    let resp = null;
    try {
      resp = JSON.parse(r.response);
    } catch (err) {
      console.error(err);
      throw new Error('Неожиданный ответ сервера');
    }
    li.ok();
    li = null;
    log.message('---');

    // Анализ загруженных глав
    let wCnt = 0;
    let chNum = 0;
    const chCnt = bdata.chapters.length;

    const checkCurrentChapter = function() {
      const ch = doc.chapters.pop();
      if (ch.children.length) {
        doc.chapters.push(ch);
        return true;
      }
      --chNum;
      return false;
    };

    let imgPos = 0;
    const loadImages = async function() {
      for (; imgPos < doc.binaries.length; imgPos++) {
        const img = doc.binaries[imgPos];
        if (img.value) continue;
        // В данных книги хранится только имя файла изобажения. Необходимо сформировать правильный URL
        const src = '/uploads/ebook/' + encodeURIComponent(bdata.bookId) + '/' + encodeURIComponent(img.url);
        img.url = (new URL(src, document.location)).toString();
        const li = log.message('Загрузка изображения...');
        try {
          await img.load((loaded, total) => {
            if (total) li.text('' + Math.round(loaded / total * 100) + '%');
          });
          li.ok();
        } catch (err) {
          li.fail();
          throw err;
        }
      }
    };

    let chType = null;
    let chapter = null;
    const makeNewChapter = function(ctype, ctitle) {
      chType = ctype;
      switch (chType) {
        case 'part':
          li = log.message('Формирование раздела...');
          break;
        case 'auto':
          li = log.message('Формирование контента вне глав...');
          break;
        default:
          ++chNum;
          li = log.message(`Формирование главы ${chNum}/${chCnt}...`);
      }
      chapter = new FB2Chapter(ctitle || '');
      doc.chapters.push(chapter);
    };

    const warning = function(text, idx) {
      log.warning(`${text} [${idx}]`);
      ++wCnt;
    };
//console.debug(resp);
    li = null;
    for (const it of resp) {
      if (it.type === 'block') {
        const chunk = new Chunk(it.chunk);
        switch (chunk.type) {
          case 'part':
          case 'chapter':
            if (chapter) {
              chapter.normalize();
              await loadImages();
              if (li) li.ok();
              if (chType !== 'part') {
                if (!checkCurrentChapter()){
                  li.skipped('пусто');
                }
              } else if (!chapter.children.length) {
                chapter.children.push(new FB2EmptyLine());
              }
              // Проверить заголовок блока новой главы
              const chList = chunk.content(null);
              if (!chunk.isInline()) {
                // Возможно это старый формат сносок
                let par = null;
                if (chList.length >= 3 && chList[0] instanceof FB2Text &&
                    chList[1] instanceof FB2Link && chList[2] instanceof FB2Text)
                {
                  // Похоже это сноски. Добавляем в предыдущую главу
                  chapter.children.push(new FB2EmptyLine());
                  chList.forEach(el => {
                    if (el instanceof FB2Link) {
                      par = new FB2Paragraph()
                      chapter.children.push(par);
                      par.children.push(new FB2Text(el.textContent()));
                    } else if (par) {
                      par.children.push(el);
                    }
                  });
                  break;
                }
              }
            }
            makeNewChapter(chunk.type);
            if (!chunk.isInline()) {
              const sType = chType === 'part' ? 'раздела' : 'главы';
              warning(`В названии ${sType} ожидается inline содержимое`, it.index);
            }
            chapter.title = chunk.content(null).reduce((res, el) => {
              res += el.textContent();
              return res;
            }, '').trim();
            break;
          case 'unstyled':
            if (!chapter) {
              // Найден контент вне глав. Создать отдельную главу
              makeNewChapter('auto', '');
            }
            if (chunk.isEmpty()) {
              if (chType === 'part' || chapter.children.length) chapter.children.push(new FB2EmptyLine());
            } else {
              const el = new FB2Paragraph();
              el.children = chunk.content(doc);
              chapter.children.push(el);
            }
            break;
          case 'ordered-list-item':
          case 'unordered-list-item':
            // Там, где попались такие списки, они имели по одному элементу и отображались как обычные строки без отступов.
            // Официальный алгоритм формирования FB2 файлов использует некорректную разметку и читалка их не видит.
            {
              const el = new FB2UnorderedList();
              el.children = chunk.content(doc);
              chapter.children.push(el);
            }
            break;
          case 'blockquote':
            {
              const c = new FB2Cite();
              const p = new FB2Paragraph();
              c.children.push(p);
              p.children = chunk.content(doc);
              chapter.children.push(c);
            }
            break;
          case 'atomic':
            if (!chapter) {
              // Картинка или особое содержимое перед первой главой
              makeNewChapter('auto', '');
            }
            chunk.content(doc).forEach(c => chapter.children.push(c));
            break;
          default:
            warning(`Неизвестный тип фрагмента: ${chunk.type}`, it.index);
        }
        chunk.warns.forEach(w => warning(w, it.index));
      } else {
        warning('Неизвестный тип блока: ' + it.type, it.index);
      }
    }
    if (chapter) {
      chapter.normalize();
      await loadImages();
      if (chType !== 'part') {
        if (!checkCurrentChapter() && li) {
          li.skipped('пусто');
          li = null;
        }
      } else if (!chapter.children.length) {
        chapter.children.push(new FB2EmptyLine());
      }
    }
    if (li) li.ok();
    li = null;
    doc.history.push('v1.0 - создание fb2 - (Ox90)');
    if (wCnt) {
      log.message('---');
      log.warning('Всего предупреждений: ' + wCnt);
    }
    log.message('---');
    log.message('Готово!');
  } catch (err) {
    console.error(err);
    if (li) li.fail();
    throw err;
  }
}

/**
 * Добавляет CSRF и XSRF токены в параметры запроса
 *
 * @params Object params Парамерты запроса куда необходимо добавить актуальные токены
 *
 * @return Object Возвращает переданный объект с добавленными токенами
 */
function addTokens(params) {
  params ||= {};
  params.headers ||= {};
  const te = document.querySelector('html>head>meta[name="csrf-token"]');
  if (te && te.content) params.headers['X-CSRF-TOKEN'] = te.content;
  const ct = /(?:^| )XSRF-TOKEN=([^;]+)/.exec(document.cookie);
  if (ct) params.headers['X-XSRF-TOKEN'] = decodeURIComponent(ct[1]);
  return params;
}

/**
 * Формирует имя файла для книги
 *
 * @param FB2DocumentEx doc   FB2 документ
 *
 * @return string Имя файла с расширением
 */
function genBookFileName(doc) {
  function xtrim(s) {
    const r = /^[\s=\-_.,;!]*(.+?)[\s=\-_.,;!]*$/.exec(s);
    return r && r[1] || s;
  }

  const fn_template = '\\a.< \\s \\N.> \\t [LM-\\i]';
  const ndata = new Map();
  // Автор [\a]
  const author = doc.bookAuthors[0];
  if (author) {
    const author_names = [ author.firstName, author.middleName, author.lastName ].reduce(function(res, nm) {
      if (nm) res.push(nm);
      return res;
    }, []);
    if (author_names.length) {
      ndata.set('a', author_names.join(' '));
    } else if (author.nickName) {
      ndata.set('a', author.nickName);
    }
  }
  // Серия [\s, \n, \N]
  const seq_names = [];
  if (doc.sequence && doc.sequence.name) {
    const seq_name = xtrim(doc.sequence.name);
    if (seq_name) {
      const seq_num = doc.sequence.number;
      if (seq_num) {
        ndata.set('n', seq_num);
        ndata.set('N', (seq_num.length < 2 ? '0' : '') + seq_num);
        seq_names.push(seq_name + ' ' + seq_num);
      }
      ndata.set('s', seq_name);
      seq_names.push(seq_name);
    }
  }
  // Название книги. Делается попытка вырезать название серии из названия книги [\t]
  // Название серии будет удалено из названия книги лишь в том случае, если оно присутвует в шаблоне.
  let book_name = xtrim(doc.bookTitle);
  if (ndata.has('s') && fn_template.includes('\\s')) {
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
  ndata.set('t', book_name);
  // Статус скачиваемой книжки [\b]
  let status = '';
  if (doc.totalChapters === doc.chapters.length - (doc.hasMaterials ? 1 : 0)) {
    switch (doc.status) {
      case 'finished':
        status = 'F';
        break;
      case 'in-progress':
        status = 'U';
        break;
      case 'fragment':
        status = 'P';
        break;
    }
  } else {
    status = 'P';
  }
  ndata.set('b', status);
  // Id книги [\i]
  ndata.set('i', doc.id);
  // Окончательное формирование имени файла плюс дополнительные чистки и проверки.
  function replacer(str) {
    let cnt = 0;
    const new_str = str.replace(/\\([asnNtbci])/g, (match, ti) => {
      const res = ndata.get(ti);
      if (res === undefined) return '';
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
      str: (!depth || cnt) ? sa.join('') : '',
      count: cnt
    };
  }
  const fname = processParts(fn_template, 0).str.replace(/[\0\/\\\"\*\?\<\>\|:]+/g, '');
  return `${fname.substr(0, 250)}.fb2`;
}

//*****************************
//*                           *
//*           Классы          *
//*                           *
//*****************************

/**
 * Класс для удобства работы с модами блоков разметки
 */
class Mod {
    constructor(data) {
    this.warns = [];
    this._data = data;
    this._children = (data.mods || []).map(m => new Mod(m));
  }

  isEmpty() {
    return this._data.type === 'INLINE' && this._data.text === '' && !this._children.length;
  }

  isInline() {
    if (this._data.type !== 'INLINE') return false;
    return this._children.every(m => m.isInline());
  }

  content(doc) {
    let el = null;
    let se = null;
    let skipChildren = false;
    switch (this._data.type) {
      case 'INLINE':
        (this._data.styles && this._data.styles.length ? this._data.styles : []).forEach(st => {
          switch (st) {
            case 'ITALIC':
              se = new FB2Element('emphasis');
              break;
            case 'BOLD':
              se = new FB2Element('strong');
              break;
            case 'STRIKETHROUGH':
              se = new FB2Element('strikethrough');
              break;
            case 'TITLE': // Увеличение шрифта
            case 'UNDERLINE': // Перечеркнутый текст
              // Этот стиль не поддерживаются форматом FB2
              return;
            default:
              this.warns.push('Неизвестный стиль: ' + st);
              return;
          }
          if (el) {
            el.children.push(se);
          } else {
            el = se;
          }
        });
        if (!se) se = new FB2Text();
        se.value = this._data.text;
        if (!el) el = se;
        if (this._children.length) this.warns.push('У inline есть вложенные элементы');
        break;
      case 'LINK':
        if (this._data.styles && this._data.styles.length) this.warns.push('У элемента link есть стили');
        el = se = new FB2Link(this._data.data && this._data.data.url || '');
        if (el.href !== '') {
          if (/#_ftn\d+$/.test(el.href)) {
            // Это старый формат сносок. Преобразовать в текст
            el = se = new FB2Text(el.textContent());
          }
        } else {
          el = se = new FB2Text(el.textContent());
          this.warns.push('Пустая ссылка преобразована в текст');
        }
        break;
      case 'FOOTNOTE':
        {
          let value = this._data.data && this._data.data.text && this._data.data.text.trim() || '';
          const title = this._data.mods && this._data.mods[0] && this._data.mods[0].text && this._data.mods[0].text.trim() || '';
          if (value.length && title.length && this._children.length === 1) {
            if (value.startsWith(title)) value = value.substring(title.length).trim();
            if (value.length) {
              el = se = new FB2Note(value.replace(/\s+/g, ' '), title); // В сносках попадаются табуляторы
              if (doc) doc.notes.push(el);
            } else {
              this.warns.push('Пустая сноска');
              el = se = new FB2Text(title);
            }
          } else {
            this.warns.push('Неожиданный формат сноски. Преобразована в текст.');
            el = se = new FB2Text(title);
          }
          skipChildren = true;
        }
        break;
      case 'IMAGE':
        {
          let src = this._data.data && this._data.data.src || '';
          if (src === '') {
            this.warns.push('Изображение без ссылки');
            return null;
          }
          el = se = new FB2Image(src);
          if (doc) doc.binaries.push(el);
          skipChildren = true;
        }
        break;
      case 'AUDIO':
      case 'FREE_END':
      case 'PAGE_BREAK':
      case 'TO_BE_CONTINUE':
        return null;
      default:
        this.warns.push('Неизвестный тип мода: ' + this._data.type);
        el = se = new FB2Text(this._data.text || '');
        break;
    }
    if (!skipChildren) {
      this._children.forEach(c => {
        const ctn = c.content(doc);
        if (ctn) se.children.push(ctn);
        if (!this.warns.length) this.warns = c.warns;
      });
    }
    return el;
  }
}

/**
 * Класс для удобства работы с описанием блоков разметки
 */
class Chunk {
  constructor(data) {
    this.warns = [];
    this.type = data.type;
    this._children = (data.mods || []).map(m => new Mod(m));
  }

  isEmpty() {
    if (this._children.length !== 1) return false;
    const m = this._children[0];
    return m.isEmpty();
  }

  isInline() {
    return this._children.every(m => m.isInline());
  }

  content(doc) {
    const res = [];
    this._children.forEach(m => {
      const ctn = m.content(doc);
      if (ctn) res.push(ctn);
      if (m.warns.length) this.warns = this.warns.concat(m.warns);
    });
    return res;
  }
}

/**
 * Класс управления модальным диалоговым окном
 */
class ModalDialog {
  constructor(params) {
    this._modal = null;
    this._overlay = null;
    this._title = params.title || '';
    this._onclose = params.onclose;
  }

  show() {
    this._ensureForm();
    this._ensureContent();
    document.body.appendChild(this._overlay);
    document.body.classList.add('modal-open');
    this._modal.focus();
  }

  hide() {
    this._overlay && this._overlay.remove();
    this._overlay = null;
    this._modal = null;
    document.body.classList.remove('modal-open');
    if (this._onclose) {
      this._onclose();
      this._onclose = null;
    }
  }

  _ensureForm() {
    if (!this._overlay) {
      this._overlay = document.createElement('div');
      this._overlay.classList.add('lme-dlg-overlay');
      this._modal = this._overlay.appendChild(document.createElement('div'));
      this._modal.classList.add('lme-dialog');
      this._modal.tabIndex = -1;
      this._modal.setAttribute('role', 'dialog');
      const header = this._modal.appendChild(document.createElement('div'));
      header.classList.add('lme-title');
      header.appendChild(document.createElement('h4')).textContent = this._title;
      const cb = header.appendChild(document.createElement('button'));
      cb.type = 'button';
      cb.classList.add('lme-close-btn');
      cb.textContent = '×';
      this._modal.appendChild(document.createElement('form'));

      this._overlay.addEventListener('click', event => {
        if (event.target === this._overlay || event.target.closest('.lme-close-btn')) this.hide();
      });
      this._overlay.addEventListener('keydown', event => {
        if (event.code == 'Escape' && !event.shiftKey && !event.ctrlKey && !event.altKey) {
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
    this._sub   = params.onsubmit;
  }

  hide() {
    super.hide();
    this.log = null;
    this.button = null;
  }

  _ensureContent() {
    const form = this._modal.querySelector('form');
    const log = form.appendChild(document.createElement('div'));
    const sbd = form.appendChild(document.createElement('div'));
    sbd.classList.add('lme-buttons');
    const sbt = sbd.appendChild(document.createElement('button'));
    sbt.type = 'submit';
    sbt.textContent = 'Продолжить';

    form.addEventListener('submit', event => {
      event.preventDefault();
      if (this._sub) {
        const res = {};
        this._sub(res);
      }
    });

    //
    this.log = log;
    this.button = sbt;
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
    element.classList.add('lme-log');
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
    const item = document.createElement('div');
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
    this.message(msg, '#a00');
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
    this._setSpan('ok', 'green');
  }

  /**
   * Аналогичен методу ok
   */
  fail() {
    this._setSpan('ошибка!', 'red');
  }

  /**
   * Аналогичен методу ok
   */
  skipped(text) {
    this._setSpan(text || 'пропущено', 'blue');
  }

  /**
   * Отображает указанный текстстандартным цветом сайта
   *
   * @param string s Текст для отображения
   *
   */
  text(s) {
    this._setSpan(s, '');
  }

  _setSpan(text, color) {
    if (!this._span) {
      this._span = document.createElement('span');
      this._element.appendChild(this._span);
    }
    this._span.style.color = color;
    this._span.textContent = ' ' + text;
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
    params.method ||= 'GET';
    params.responseType = params.responseType === 'binary' ? 'blob' : 'text';
    if (!this.ctl_list) this.ctl_list = new Set();

    return new Promise((resolve, reject) => {
      let req = null;
      params.onload = r => {
        if (r.status === 200) {
          const headers = new Headers();
          r.responseHeaders.split('\n').forEach(hs => {
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
 * Переопределение загрузчика картинок для возможности использования своего лоадера
 * а также для того, чтобы избегать загрузки картинок в формате webp.
 */
FB2Image.prototype._load = async function(url, params) {
  // Попытка избавиться от webp через подмену заголовков
  params ||= {};
  params.headers ||= {};
  if (!params.headers.Accept) params.headers.Accept = 'image/jpeg,image/png,*/*;q=0.8';
  // Использовать свой лоадер
  return (await Loader.addJob(url, params)).response;
};

//-------------------------

function addStyle(css) {
  const style = document.getElementById('lme_styles') || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = 'lme_styles';
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}

function addStyles() {
  [
    '.lme-buttons { display:flex; flex-flow:row wrap; }',
    '.lme-dlg-overlay, .lme-title { display:flex; align-items:center; justify-content:center; }',
    '.lme-title { padding:0 5px; color:#fff; font-size:18px; line-height:20px; background-color:#537497; border-bottom:1px solid #e4e4e4; }',
    '.lme-title>h4:first-child { margin:auto; }',
    '.lme-dlg-overlay { position:fixed; top:0; left:0; bottom:0; right:0; overflow:auto; background-color:rgba(0,0,0,.3); white-space:nowrap; z-index:10000; }',
    '.lme-dialog { position:static; max-width:min(100%,35em); min-width:min(100%,30em); height:min(100%,40em); background-color:#fff; border-radius:2px; border:none; box-shadow:0 27px 24px 0 rgba(0,0,0,.2),0 40px 77px 0 rgba(0,0,0,.22); }',
    '.lme-dialog, .lme-dialog form { display:flex; flex-direction:column; }',
    '.lme-dialog form { flex:1; padding:15px; white-space:normal; gap:10px; overflow:hidden; }',
    '.lme-log { flex:1; padding:6px; border:1px solid #bbb; border-radius:6px; overflow:auto; }',
    '.lme-buttons { display:flex; flex-flow:row wrap; justify-content:center; gap:10px; }',
    '.lme-buttons button { min-width:8em; background-color:#fff; color:#000; padding:8px; border:1px solid rgba(125, 125, 125, 0.8); border-radius:1px; outline:0; transition:box-shadow 0.4s; }',
    '.lme-buttons button:hover { transition:box-shadow 0.4s; box-shadow:rgba(83, 116, 151, 0.42) 0px 14px 26px -12px, rgba(0, 0, 0, 0.12) 0px 4px 23px 0px, rgba(83, 116, 151, 0.2) 0px 8px 10px -5px; }',
    '.lme-close-btn { cursor:pointer; border:0; background-color:transparent; font-size:24px; font-weight:400; line-height:1; text-shadow:0 1px 0 #fff; opacity:.4; }',
    '.lme-close-btn:hover { opacity:.9 }',
  ].forEach(s => addStyle(s));
}

// Запускает скрипт после загрузки страницы сайта
if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', init);
  else init();

})();
