// ==UserScript==
// @name           Blinkist to PDF
// @description    Export Blinkist to PDF
// @match          https://www.blinkist.com/*/nc/daily*
// @match          https://www.blinkist.com/*/content/daily*
// @match          https://www.blinkist.com/*/app/daily*
// @match          https://www.blinkist.com/*/books/*
// @match          https://www.blinkist.com/books/*
// @run-at         document-end
// @version        1.3.16
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/384533/Blinkist%20to%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/384533/Blinkist%20to%20PDF.meta.js
// ==/UserScript==

/* jshint esversion: 9 */

function main() {
  if (String.prototype.endsWith == null) {
    String.prototype.endsWith = function (s) {
      return s === '' || this.slice(-s.length) === s;
    };
  }

  const DAILY  = window.location.pathname.endsWith('/daily');
  const SPAN   = document.createElement('span');
  const NAME   = "Blinkist to PDF:";
  let USE_LEGACY_READER = false;

  var jspdfLoaded = false;
  var jszipLoaded = false;
  var dialog = false;
  var loader = null;

  //+--------------------------------------------------------
  //|
  //| ADD BTN
  //|
  //+--------------------------------------------------------

  /**
   * Add btn to top right menu
   * To export PDF or audio
   */
  function init() {
    if (document.getElementById('exportPDF')) {
      console.log(NAME, 'export PDF already in DOM');
      return;
    }

    // Create buttons
    var buttons = document.createElement('div');
    buttons.style.paddingLeft = '5px';
    buttons.innerHTML = '<div id="loadingPDF"></div>'
                      + '<button id="exportPDF" style="cursor:pointer">Export PDF</button>'
                      + ' / <button id="exportAudio" style="cursor:pointer">audio</button>';

    // Add buttons to header
    var preAttempt = addBtn_preAttempt(buttons);
    if (preAttempt) {
      addEventListener();
    }

    if(addBtn(buttons)) {
      addEventListener();

    // Retry until the header is loaded
    } else {
      var i = 0;
      var interval = setInterval(function(){
        if(i++ == 20) {
          if(!preAttempt) {
            console.log(NAME, 'could not find header');
          }
          clearInterval(interval);
        }
        if(addBtn(buttons)) {
          clearInterval(interval);
          addEventListener();
        }
      }, 1000);
    }
  }

  /**
   * Attempts to insert the given DOMElement to the header
   * The header might not be initialized yet, or the user might not be logged in
   *
   * @param DOMElement btn
   * @return Boolean
   */
  function addBtn_preAttempt(btn) {

    // Try section data-test-id
    var section = document.querySelector('[data-test-id="header-navigation"]');
    if(section) {
      var tryBtn = section.lastElementChild.querySelector('button');

      if(tryBtn) {
        tryBtn.parentNode.insertBefore(btn, tryBtn);
        return true;
      }
    }
    return false;
  }

  /**
   * Attempts to insert the given DOMElement to the header
   * Returns whether we were successfull or not (header not yet initialised)
   *
   * @param DOMElement btn
   * @return Boolean
   */
  function addBtn(btn) {

    // Try on .header-content
    var header = document.querySelector('.header-content');
    if(!header) {
      header = document.querySelector('header');
    }
    if(header) {
      header.appendChild(btn);
      return true;
    }

    // Try on .headerV2__user-menu
    header = document.querySelector('.headerV2__user-menu');
    if(header) {
      header.firstElementChild.appendChild(btn);
      return true;
    }

    // Try search bar
    var search = document.querySelector('[data-test-id="desktop-search"]');
    if(search) {
      search.parentNode.insertBefore(btn, search);
      return true;
    }
    return false;
  }

  /**
   * Add event listener on buttons
   */
  function addEventListener() {
    loader = document.getElementById('loadingPDF');

    document.getElementById('exportPDF').addEventListener('click', exportPDF);
    document.getElementById('exportAudio').addEventListener('click', exportAudio);
  }

  //+--------------------------------------------------------
  //|
  //| GET BLINK'S DATA
  //|
  //+--------------------------------------------------------

  /**
   * Retrieve metadata on the current page
   * @return dict - {title, author, desc, url}
   */
  function getMeta() {
    var container, element;
    let more = [];

    if(DAILY) {

      // Daily: version 2021
      if(container = document.querySelector('.daily-book__container')) {
        let title     = container.querySelector('.daily-book__headline').innerText.trim(),
            author    = container.querySelector('.daily-book__author').innerText.trim().replace(/^(By|Von) /i, ''),
            desc      = document.querySelector('.book-tabs__content').innerText.trim(),
            url       = container.querySelector('.daily-book__cta').getAttribute('href');

        USE_LEGACY_READER = true;
        return {title, author, desc, more, url};
      }

      // Daily: version 2022
      if(container = document.querySelector('article')) {
        let title  = (element = container.querySelector('h2')).innerText.trim(),
            author = (element = element.nextElementSibling).innerText.trim().replace(/^(By|Von) /i, ''),
            desc   = (element = element.nextElementSibling).innerText.trim(),
            url    = container.querySelector('a').getAttribute('href');

        return {title, author, desc, more, url};
      }
      return;
    }

    if(document.querySelector('.book-preview-info__container')
           || document.querySelector('.book-header__join-blinkist')
    ) {
      alert('You don\'t have access to this content (upgrade to premium)');
      return;

    }

    // v1 (2021)
    if(container = document.querySelector('.book__header-container')) {
      let title     = container.querySelector('.book__header__title').innerText.trim(),
          author    = container.querySelector('.book__header__author').innerText.trim().replace(/^(By|Von) /i, ''),
          desc      = document.querySelector('.book-tabs-v0__content').innerText.trim(),
          btn       = container.querySelector('.js-add-to-library-button'),
          url       = btn ? btn.getAttribute('href') : null;

      USE_LEGACY_READER = true;
      return {title, author, desc, more, url};
    }

    // v2 (2022)
    if(container = document.querySelector('.book-header')) {
      let title     = (element = container.querySelector('h1')).outerText.trim(),
          author    = (element = element.nextElementSibling).innerText.trim().replace(/^(By|Von) /i, ''),
          desc      = (element = element.nextElementSibling).innerText.trim(),
          btn       = container.querySelector('.book-header__controls a'),
          url       = btn ? btn.getAttribute('href') : null;

      return {title, author, desc, more, url};
    }

     // v3 (2023)
    if(container = document.querySelector('.min-h-screen')) {
      let title     = (element = container.querySelector('h1')).outerText.trim(),
          author    = (element = element.nextElementSibling).innerText.trim().replace(/^(By|Von) /i, ''),
          desc      = (element = element.nextElementSibling).innerText.trim(),
          btn       = container.querySelector('[data-test-id="read-button"]'),
          url       = btn ? btn.getAttribute('href') : null;

      // What's it about + about the author
      element = container.querySelector('h4').parentElement;
      element.querySelectorAll('h4, p').forEach((element) => {
        let text = element.innerText.trim();

        // Don't add "Original: Blue Ocean Shift © 2017 Vahlen, München"
        if (text.startsWith('Original: ')) {
            return;
        }
        more.push({
          tag: element.tagName.toUpperCase(),
          text,
        });
      });

      return {title, author, desc, more, url};
    }
  }


  /**
   * Retrieve the blink's content
   * The callback won't be called if the user doesn't have access to the blink's content
   *
   * @param string url        - url of the blink's content
   * @param function callback - handle the export
   * @param function[optional] callbackMeta - retrieve the meta given to callback
   */
  function getArticle(bookId, callback, callbackMeta) {
    fetch(`/api/books/${bookId}/chapters`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        "x-requested-with": "XMLHttpRequest"
      }
    })
    .then((response) => response.json())
    .then((data) => {
      return new Promise((resolve) => {

        // Query each chapter
        let promises = data.chapters.map((chapter) => {
          return fetch(`/api/books/${bookId}/chapters/${chapter.id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              "x-requested-with": "XMLHttpRequest"
            }
          });
        });

        // Parse each response's JSON
        Promise.all(promises).then((responses) => {
          Promise.all(responses.map((response) => response.json())).then((chapters) => {

            // Add chapter data to previous object
            for(let chapter of chapters) {
              let i = chapter.order_no;
              Object.assign(data.chapters[i], chapter);
            }

            // Continue with the filly populated object
            resolve(data);
          });
        });
      });

    })
    .then((data) => {
      callback(data);
    });
  }

  /**
   * Retrieve the blink's content
   * The callback won't be called if the user doesn't have access to the blink's content
   *
   * @param string url        - url of the blink's content
   * @param function callback - handle the export
   * @param function[optional] callbackMeta - retrieve the meta given to callback
   */
  function legacyGetArticle(url, callback, callbackMeta) {
    if(!url) {
      callback(document.createElement('div'));

    } else {
      fetch(url).then(response => {
        if(response.redirected && response.url.split('/').slice(-2).join('/') == 'nc/plans') {
          alert('You don\'t have access to this content (upgrade to premium)');
        } else {
          return response.text();
        }
      })
      .then(html => {
        if(!html) return;

        var parser  = new DOMParser(),
            _dom    = parser.parseFromString(html, 'text/html'),
            article = _dom.querySelector('.reader__container__content');

        if(article) {
          callback(article, callbackMeta? callbackMeta(_dom) : null);
        }
      });
    }
  }

  //+--------------------------------------------------------
  //|
  //| EXPORT PDF
  //|
  //+--------------------------------------------------------

  var jspdfCallback = null;

  /**
   * Load JsPDF
   */
  function loadJspdf() {
    if(jspdfLoaded) {
      return;
    }

    // Action when loaded
    var onScriptLoad = () => {
      if(jspdfLoaded) {
        return;
      }
      jspdfLoaded = true;
      jspdfCallback && jspdfCallback();
    };

    // Load script
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.setAttribute("src", 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js');
    script.onreadystatechange = function() {
      if (this.readyState == 'loaded' || this.readyState == 'complete') onScriptLoad();
    };
    script.onload = onScriptLoad;
    document.body.appendChild(script);
  }

  /**
   * Get the bookId from the URL
   * @param string url - /de/nc/new-reader/halt-finden-in-sich-selbst-de
   *                     /de/nc/reader/der-preis-des-profits-de
   * @return string - halt-finden-in-sich-selbst-de
   */
  function getBookId(url) {
    let parts = url.replace(/\/$/, '').split('/');
    return parts[parts.length-1];
  }

  /**
   * Action when clicking on Export PDF
   */
  function exportPDF() {
    loader.classList.add('visible');

    // Load JsPDF
    loadJspdf();

    // Retrieve data then create PDF
    var meta = getMeta();
    if(!meta) {
      console.error(NAME, "exportPDF got empty meta");
      return;
    }
    const url = meta.url;

    // Using new reader
    if(!USE_LEGACY_READER) {
      let bookId = getBookId(url);
      getArticle(bookId, (article) => {
        if(!jspdfLoaded) {
          jspdfCallback = generatePDF.bind(null, article, meta);
        } else {
          generatePDF(article, meta);
        }
      });

    } else {
      legacyGetArticle(url, (article) => {
        if(!jspdfLoaded) {
          jspdfCallback = legacyGeneratePDF.bind(null, article, meta);
        } else {
          legacyGeneratePDF(article, meta);
        }
      });
    }
  }

  /**
   * Create PDF with the retrieved infos
   * @param DOMElement article
   * @param dict meta - {title, author, desc, url}
   */
  function generatePDF(article, meta) {

    // PDF settings
    var format   = "a4",
        width    = 210,  // width of 4A in mm
        height   = 297;  // height of 4A in mm

    var lMargin  = 15,
        rMargin  = 15,
        tMargin  = 30,
        bMargin  = 30,
        lineHeightFactor = 1.6;

    var h1Size   = 30,
        h2Size   = 20,
        h3Size   = 15,
        textSize = 12;

    /*
    // List of formats: https://github.com/parallax/jsPDF/blob/master/src/jspdf.js#L271
    var format   = "b7",
        width    = 91,  // width of 4A in mm
        height   = 126;  // height of 4A in mm

    var lMargin  = 5,
        rMargin  = 5,
        tMargin  = 10,
        bMargin  = 10,
        lineHeightFactor = 1.6;

    var h1Size   = 20,
        h2Size   = 15,
        h3Size   = 12,
        textSize = 10;
    */

    // Default export is a4 paper, portrait, using millimeters for units
    var pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: format, // or size in pt, such as [595.28, 841.89]
    });

    // Page numbering
    var page = 1,
        top  = tMargin,
        maxWidth = width-lMargin-rMargin;

    // Add front page
    top = tMargin*3;
    pdf.setFontSize(h1Size);
    pdf.setFontType("bold");
    pdf.text(cleanup(meta.title), width/2, top, {maxWidth: maxWidth, align: 'center'});

    top += pdf.getTextDimensions('X').h * pdf.splitTextToSize(meta.title, maxWidth).length;
    pdf.setFontSize(h2Size);
    pdf.setFontType("italic");
    pdf.text(cleanup(meta.author), width/2, top, {maxWidth: maxWidth, align: 'center'});

    top += h2Size;
    pdf.setFontSize(h3Size);
    pdf.setFontType("normal");
    pdf.text(cleanup(meta.desc), lMargin, top, {maxWidth, lineHeightFactor});

    // Add pages
    function addFooter() {
      pdf.text(''+page, width-8, height-8, {align: 'right'});
    }
    function addText(text) {
      pdf.setFontSize(textSize);
      pdf.setFontStyle("normal");

      // We're splitting the lines ourselves
      // To handle the margins between paragraphs
      // And to handle the overflow on another page
      var lineHeight = pdf.getTextDimensions('X').h * 1.6,
          lines      = pdf.splitTextToSize(text, maxWidth);

      for(var l=0;l<lines.length;l++) {
        if(!lines[l]) {
          top += lineHeight / 2;
          continue;
        }
        if(top + bMargin > height) {
          addFooter();
          page++;

          pdf.addPage();
          top = tMargin;
        }

        pdf.text(cleanup(lines[l]), lMargin, top);
        top += lineHeight;
      }
    }
    // small jump to try having the entire "about" on the same page (du-bist-genug-de)
    top += h3Size;
    pdf.setFontSize(10);

    // What's it about?
    if (meta.more.length) {
      for (let i=0; i<meta.more.length; i++) {
        let { tag, text } = meta.more[i];

        if (tag == "H4") {
          if (i) {
            top += 6;
          }
          pdf.setFontSize(h3Size);
          pdf.setFontStyle("bold");
          pdf.text(cleanup(text), lMargin, top, {maxWidth, lineHeightFactor});

          top += pdf.getTextDimensions('X').h * pdf.splitTextToSize(text, maxWidth).length * lineHeightFactor;
          top += 3;
        } else {
          addText(text);
        }
      }
    }
    top = tMargin;

    // Chapters
    for(let i=0; i<article.chapters.length; i++) {
      var chapter = article.chapters[i];
      if(!chapter.text) continue;

      pdf.addPage();
      top = tMargin;

      var h2    = chapter.action_title.trim(),
          text  = HTMLToText(chapter.text.trim());

      // Page title
      if(h2) {
        pdf.setFontSize(h2Size);
        pdf.setFontStyle("bold");
        pdf.text(cleanup(h2), lMargin, top, {maxWidth, lineHeightFactor});

        top += pdf.getTextDimensions('X').h * pdf.splitTextToSize(h2, maxWidth).length * lineHeightFactor;
        top += 3;
      }

      // Content
      if(text) {

        // Quote
        if(false) {
          pdf.setFontSize(h3Size);
          pdf.setFontStyle("normal");

          pdf.text(cleanup(text), width/2, height/3, {maxWidth: maxWidth-50, lineHeightFactor, align: 'center'});

        // Blink
        } else {
          addText(text);
        }
      }

      // Page footer
      addFooter();
      page++;
    }
    loader.classList.remove('visible');

    pdf.save(meta.author + ' - ' + meta.title + '.pdf');
  }

  /**
   * Create PDF with the retrieved infos
   * @param DOMElement article
   * @param dict meta - {title, author, desc, url}
   */
  function legacyGeneratePDF(article, meta) {

    // PDF settings
    var pdf      = new jsPDF(),
        width    = 210,  // width of 4A in mm
        height   = 297;  // height of 4A in mm

    var lMargin  = 15,
        rMargin  = 15,
        tMargin  = 30,
        bMargin  = 30,
        lineHeightFactor = 1.6;

    // Page numbering
    var page = 1,
        top  = tMargin,
        maxWidth = width-lMargin-rMargin;

    // Add front page
    top = 90;
    pdf.setFontSize(30);
    pdf.setFontType("bold");
    pdf.text(cleanup(meta.title), width/2, top, {maxWidth: maxWidth, align: 'center'});

    top += pdf.getTextDimensions('X').h * pdf.splitTextToSize(meta.title, maxWidth).length;
    pdf.setFontSize(20);
    pdf.setFontType("italic");
    pdf.text(cleanup(meta.author), width/2, top, {maxWidth: maxWidth, align: 'center'});

    top += 20;
    pdf.setFontSize(15);
    pdf.setFontType("normal");
    pdf.text(cleanup(meta.desc), lMargin, top, {maxWidth, lineHeightFactor});

    // Add pages
    function addFooter() {
      pdf.text(''+page, width-8, height-8, {align: 'right'});
    }

    top = tMargin;
    pdf.setFontSize(10);

    for(var i=0; i<article.children.length; i++) {
      var child = article.children[i];
      if(!child.classList.contains('chapter')) continue;

      pdf.addPage();
      top = tMargin;

      var h2    = child.children[0].innerText.trim(),
          text  = HTMLToText(child.children[1].innerHTML.trim());

      // Page title
      if(h2) {
        pdf.setFontSize(20);
        pdf.setFontStyle("bold");
        pdf.text(cleanup(h2), lMargin, top, {maxWidth, lineHeightFactor});

        top += pdf.getTextDimensions('X').h * pdf.splitTextToSize(h2, maxWidth).length * lineHeightFactor;
        top += 3;
      }

      // Content
      if(text) {

        // Quote
        if(child.classList.contains('supplement')) {
          pdf.setFontSize(15);
          pdf.setFontStyle("normal");

          pdf.text(cleanup(text), width/2, height/3, {maxWidth: maxWidth-50, lineHeightFactor, align: 'center'});

          // Blink
        } else {
          pdf.setFontSize(12);
          pdf.setFontStyle("normal");

          // We're splitting the lines ourselves
          // To handle the margins between paragraphs
          // And to handle the overflow on another page
          var lineHeight = pdf.getTextDimensions('X').h * 1.6,
              lines      = pdf.splitTextToSize(text, maxWidth);

          for(var l=0;l<lines.length;l++) {
            if(!lines[l]) {
              top += lineHeight / 2;
              continue;
            }
            if(top + bMargin > height) {
              addFooter();
              page++;

              pdf.addPage();
              top = tMargin;
            }

            pdf.text(cleanup(lines[l]), lMargin, top);
            top += lineHeight;
          }
        }
      }

      // Page footer
      addFooter();
      page++;
    }
    loader.classList.remove('visible');

    pdf.save(meta.author + ' - ' + meta.title + '.pdf');
  }

  const CHARS_EQUIVALENT = {
    "₂": "2",
    "’": "'",
    "Ş": "S",
    "ğ": "g",
    "ş": "s",
    "\u2060": '',  //word-joiner,
    "\u202F": ' ', // narrow No-Break Space
    "\u2007": ' ', // figure space
  };

  /**
   * Remove problematic characters
   * @param string txt
   * @return string
   */
  function cleanup(txt) {
    return txt.replace(/[^\x9 \xA \xD \xE000-\xFFFD \x20-\xD7FF]/g, function(match){
      //console.log(match, match in CHARS_EQUIVALENT);

      if(match in CHARS_EQUIVALENT) {
        return CHARS_EQUIVALENT[match];
      }
      return match; // lets bet it's a known special char („ “ – …)
    });
  }

  /**
   * Replace HTML entities/tags with plain text
   * @param string txt
   * @return string
   */
  function HTMLToText(txt) {
    return txt.replace(/\n|\r/g, '')
      .replace(/<\/p><p>/g, "\n\n")
      .replace(/<\/p>/g, "\n")
      .replace(/<\/li>/g, "\n")
      .replace(/<[^>]*>/g, '')
      .replace(/&\w+;/g, function(match) {
        SPAN.innerHTML = match;
        return SPAN.innerText;
      });
  }

  //+--------------------------------------------------------
  //|
  //| EXPORT AUDIO
  //|
  //+--------------------------------------------------------

  var jszipCallback = null;

  /**
   * Load JsPDF
   */
  function loadJszip() {
    if(jszipLoaded) {
      return;
    }

    // Action when loaded
    var onScriptLoad = () => {
      if(jszipLoaded) {
        return;
      }
      jszipLoaded = true;
      jszipCallback && jszipCallback();
    };

    // Load script
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.setAttribute("src", 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip.js');
    script.onreadystatechange = function() {
      if (this.readyState == 'loaded' || this.readyState == 'complete') onScriptLoad();
    };
    script.onload = onScriptLoad;
    document.body.appendChild(script);
  }

  /**
   * Get dialog window
   * @return DOMElement
   */
  function initDialog() {
    if(!dialog) {
      dialog = createDialog();
    }
    dialog.children[0].innerHTML = 'Preparing download';
    dialog.children[1].innerHTML = 'Retrieving file list';
    dialog.classList.add('visible');
  }

  /**
   * Create dialog window
   */
  function createDialog() {

    // Add div
    var dialog = document.createElement('div');
    dialog.setAttribute('id', 'topdfdialog');
    dialog.setAttribute('tabindex', '0');
    dialog.setAttribute('class', 'infodialog');
    dialog.innerHTML = '<div class="infodialog--header"></div><div class="infodialog--about"></div>';
    document.body.appendChild(dialog);

    // Return it
    return document.getElementById('topdfdialog');
  }

  /**
   * Action when clicking on Export audio
   */
  function exportAudio() {

    // Load JsZip
    loadJszip();

    // Retrieve data then create zip
    var meta = getMeta();
    if(!meta) {
      console.error(NAME, "exportAudio got empty meta");
      return;
    }
    const url = meta.url;

    // Using new reader (/de/nc/new-reader/halt-finden-in-sich-selbst-de)
    if(!USE_LEGACY_READER) {
      let bookId = getBookId(url);
      getArticle(bookId, function(article){
        getAudio(article, meta);
      });

    } else {
      legacyGetArticle(url, legacyGetAudio, (_dom) => {
        var bookContainer = _dom.querySelector('div[data-book-id]'),
            bookid        = bookContainer.getAttribute('data-book-id'),
            csrftoken     = _dom.querySelector('meta[name="csrf-token"]').content;

        return {...meta, bookid, csrftoken};
      });
    }
  }

  /**
   * Get the API url for audio
   * @param string bookid
   * @param string chapterid
   * @param string
   */
  function legacyGetAudioApiUrl(bookid, chapterid) {
    return 'https://www.blinkist.com/api/books/' + bookid + '/chapters/' + chapterid + '/audio';
  }

  /**
   * Retrieve the list of chapters and audio track associated to it
   * Then create zip
   */
  function getAudio(article, meta) {

    // Show dialog
    initDialog();

    // Retrieve the audio urls of all chapters
    var chapters = [],
        audios = [];

    for(let i=0; i<article.chapters.length; i++) {
      var chapter = article.chapters[i];

      chapters.push({"h1": chapter.action_title});
      audios.push({"url": chapter.signed_audio_url});
    }

    // Export zip
    if(jszipLoaded) {
      generateAudioZip(chapters, audios, meta);
    } else {
      jszipCallback = generateAudioZip.bind(null, chapters, audios, meta);
    }
  }

  /**
   * Retrieve the list of chapters and audio track associated to it
   * Then create zip
   */
  function legacyGetAudio(article, meta) {

    // Retrieve list of chapters (id + title)
    var chapters = [];

    for(var i=0; i<article.children.length; i++) {
      var child = article.children[i];
      if(!child.classList.contains('chapter')) continue; // .reader_container_buttons
      if(child.classList.contains('supplement')) continue; // quote

      var chapterid = child.dataset.chapterid,
          h1 = child.children[0].innerText.trim();

      chapters.push({chapterid, h1});
    }

    // Show dialog
    initDialog();

    // Retrieve the audio urls of all chapters
    var responses = [];

    for(let i=0; i<chapters.length; i++) {
      var chapter = chapters[i],
          url     = legacyGetAudioApiUrl(meta.bookid, chapter.chapterid);

      responses.push(fetch(url, {
        credentials: "same-origin",
        headers: {
          'Referer': 'https://www.blinkist.com' + meta.url,
          'x-csrf-token': meta.crsftoken,
          'x-requested-with': 'XMLHttpRequest',
        },
      }).then(response => response.json()));
    }

    // Export zip
    Promise.all(responses).then((audios) => {
      if(jszipLoaded) {
        generateAudioZip(chapters, audios, meta);
      } else {
        jszipCallback = generateAudioZip.bind(null, chapters, audios, meta);
      }
    });
  }

  /**
   * Create Zip with the retrieved infos
   * @param list chapters
   * @param list audios
   * @param dict meta - {title, author, desc, url}
   */
  async function generateAudioZip(chapters, audios, meta) {

    // Update dialog
    dialog.children[1].innerHTML = 'Zipping ' + audios.length + ' file(s)';

    // Create zip blob
    var zip   = new JSZip(),
        queue = [];

    // Add files
    let c = 0;
    for(let i=0; i<chapters.length; i++) {
      let chapter = chapters[i],
          audio   = audios[i];

      let url = 'https://cors-anywhere.99901dev.workers.dev/?q=' + encodeURIComponent(audio.url);
      queue.push(fetch(url)
                 .then(response => response.blob())
                 .then(function(blob) {
        c += 1;

        let num   = (i+1).toString().padStart(2, '0'),
            title = cleanupFilename(chapter.h1);

        zip.file(`${num} - ${title}.m4a`, blob, {binary: true});
        dialog.children[1].innerHTML = `${c} file(s) zipped`;
      }));
    }

    // Download zip
    Promise.all(queue).then(() => {
      dialog.children[0].innerHTML = 'Download ready';

      zip.generateAsync({type:"blob"}).then((blob) => {
        var filename = cleanupFilename(meta.author + ' - ' + meta.title) + '.zip';
        download(blob, filename);
      });
    });
  }

  /**
   * Remove forbidden special chars from the filename
   * @param string txt
   * @param string txt
   */
  function cleanupFilename(txt) {
    return txt.replace(/[^a-zA-ZÀ-ÖØ-öø-ÿ0-9,. -]/g, '_').trim().replace(/\.$/, '');
  }

  /**
   * Trigger download of given blob
   * @param Blob blob
   * @param string filename
   */
  function download(blob, filename) {
    if(window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, filename);
      closeAudioZip();

    } else {

      // Create link
      var a = document.createElement('a');
      a.style.display = "none";
      document.body.appendChild(a);

      // Trigger download blob
      var url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        closeAudioZip();
      }, 0);
    }
  }

  function closeAudioZip() {
    dialog.classList.remove('visible');
  }

  setTimeout(function(){
    init();
  }, 1000);
}

// Add CSS
var css = document.createElement('style');
css.textContent = `
.infodialog {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,.2);
  border-radius: 2px;
  transform: translate3d(0,24px,0);
  transition: transform .15s cubic-bezier(0.4,0.0,1,1) ,opacity .15s cubic-bezier(0.4,0.0,1,1) ,visibility 0ms linear .15s;
  bottom: 24px;
  display: block;
  left: auto;
  max-height: 323px;
  min-width: 300px;
  opacity: .01;
  overflow: visible;
  position: fixed;
  right: 24px;
  visibility: hidden;
  z-index: 1001;
}
.infodialog.visible {
  transform: translate3d(0,0,0);
  transition-delay: 0;
  opacity: 1;
  visibility: visible;
}
.infodialog--header {
  border-radius: 3px 3px 0 0;
  background-color: #323232;
  color: #fff;

  display: flex;
  align-items: center;
  font-size: 14px;
  height: 52px;
  padding: 0 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.infodialog--about {
  font-size: 0.8em;
  padding: 10px 0;
  padding-left: 24px;
  color: #222;
  background: #fff;
}
#loadingPDF {
  display: none;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  border: .12rem solid rgb(0, 0, 0);
  border-top-color: white;
  animation: spin 1s infinite linear;
  margin-right: 8px;
}
#loadingPDF.visible {
  display: inline-block;
}
#exportAudio {
  margin-right: 5px;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(css);

// Inject JS directly in page to prevent limitations of access
var script = document.createElement('script');

script.setAttribute("type", "application/javascript");
script.appendChild(document.createTextNode('('+ main +')();'));
document.body.appendChild(script);
