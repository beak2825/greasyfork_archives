// ==UserScript==
// @name           SE Preview on hover
// @description    Shows preview of the linked questions/answers on hover
// @version        1.1.14
// @author         wOxxOm
// @namespace      wOxxOm.scripts
// @license        MIT License
//
// please use only matches for the previewable targets and make sure the domain
// is extractable via [-.\w] so that it starts with . like .stackoverflow.com
// @match          *://*.stackoverflow.com/*
// @match          *://*.superuser.com/*
// @match          *://*.serverfault.com/*
// @match          *://*.askubuntu.com/*
// @match          *://*.stackapps.com/*
// @match          *://*.mathoverflow.net/*
// @match          *://*.stackexchange.com/*
// stackexchange.com must be the last main site
//
// @include        /https?:\/\/(www\.)?google(\.com?)?(\.\w\w)?\/(webhp|q|.*?[?#]q=|search).*/
// @match          *://www.google.com/search*
// @match          *://*.bing.com/*
// @match          *://*.yahoo.com/*
// @include        /https?:\/\/(\w+\.)*yahoo.(com|\w\w(\.\w\w)?)\/.*/
//
// @require        https://cdn.jsdelivr.net/gh/openstyles/lz-string-unsafe@22af192175b5e1707f49c57de7ce942d4d4ad480/lz-string-unsafe.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/highlight.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/autohotkey.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/autoit.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/dart.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/delphi.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/haskell.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/moonscript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/nsis.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/powershell.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/r.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/vbnet.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/vbscript-html.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/vbscript.min.js
// @require        https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/languages/x86asm.min.js
// @resource       HL-style https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/styles/default.min.css
// @resource       HL-style-dark https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.2.0/styles/atom-one-dark-reasonable.min.css
//
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_getResourceText
//
// @connect        stackoverflow.com
// @connect        superuser.com
// @connect        serverfault.com
// @connect        askubuntu.com
// @connect        stackapps.com
// @connect        mathoverflow.net
// @connect        stackexchange.com
// @connect        sstatic.net
// @connect        gravatar.com
// @connect        imgur.com
// @connect        self
//
// @noframes
// @run-at         document-idle
// @downloadURL https://update.greasyfork.org/scripts/27332/SE%20Preview%20on%20hover.user.js
// @updateURL https://update.greasyfork.org/scripts/27332/SE%20Preview%20on%20hover.meta.js
// ==/UserScript==

/* global hljs LZStringUnsafe */
'use strict';

Promise.resolve().then(() => {
  Detector.init();
  Security.init();
  Urler.init();
  Cache.init();
});

const PREVIEW_DELAY = 200;
const AUTOHIDE_DELAY = 1000;
const BUSY_CURSOR_DELAY = 300;
// 1 minute for the recently active posts, scales up logarithmically
const CACHE_DURATION = 60e3;

const PADDING = 24;
const PROSE_WIDTH = 660; // .s-prose selector
const PROSE_MARGIN = 16; // .s-prose margin-right
const WIDTH = PROSE_WIDTH + PADDING * 2;
const BORDER = 8;
const TOP_BORDER = 24;
const MIN_HEIGHT = 200;
let colors;
const COLORS_LIGHT = {
  body: {
    back: '#ffffff',
    fore: '#000000',
  },
  question: {
    back: '#5894d8',
    fore: '#265184',
    foreInv: '#fff',
  },
  answer: {
    back: '#70c350',
    fore: '#3f7722',
    foreInv: '#fff',
  },
  deleted: {
    back: '#cd9898',
    fore: '#b56767',
    foreInv: '#fff',
  },
  closed: {
    back: '#ffce5d',
    fore: '#c28800',
    foreInv: '#fff',
  },
};
const COLORS_DARK = {
  body: {
    back: '#222222',
    fore: '#cccccc',
  },
  question: {
    back: '#004696',
    fore: '#6abaff',
    foreInv: '#004696',
  },
  answer: {
    back: '#004c1b',
    fore: '#39c466',
    foreInv: '#004c1b',
  },
  deleted: {
    back: '#4d0a0b',
    fore: '#b56767',
    foreInv: '#fff',
  },
  closed: {
    back: '#4b360a',
    fore: '#c28800',
    foreInv: '#fff',
  },
};
const ID = 'SEpreview';
const EXPANDO = Symbol(ID);
const SEL_CMT_TREE = '[id^=follow-ups-container] [role=list]';
const SEL_COMMENTS = '.js-follow-ups, .comments-list, ' + SEL_CMT_TREE;
const SEL_MORE = [
  '.js-show-more-button',
  '.js-show-link.comments-link',
  '.comments-link ~ .comments-link',
].join(',');

const pv = {
  /** @type {Target} */
  target: null,
  /** @type {Element} */
  _frame: null,
  /** @type {Element} */
  get frame() {
    if (!this._frame)
      Preview.init();
    if (!document.contains(this._frame))
      document.body.appendChild(this._frame);
    return this._frame;
  },
  set frame(element) {
    this._frame = element;
    return element;
  },
  /** @type {Post} */
  post: {},
  hover: {x: 0, y: 0},
  stylesOverride: '',
};

class Detector {

  static init() {
    const {matches} = GM_info.script;
    const sites = matches
      .slice(0, matches.findIndex(m => m.includes('stackexchange.com')) + 1)
      .map(m => m.match(/[-.\w]+/)[0]);
    const rxsSites = 'https?://(\\w*\\.)*(' +
      matches
        .map(m => m.match(/^.*?\/\/\W*(\w.*?)\//)[1].replace(/\./g, '\\.'))
        .join('|') +
      ')/';
    Detector.rxPreviewableSite = new RegExp(rxsSites);
    Detector.rxPreviewablePost = new RegExp(rxsSites + '(questions|q|a|posts/comments)/\\d+');
    Detector.pageUrls = getBaseUrls(location, Detector.rxPreviewablePost);
    Detector.isStackExchangePage = Detector.rxPreviewableSite.test(location);

    const {
      rxPreviewablePost,
      isStackExchangePage: isSE,
      pageUrls: {base, baseShort},
    } = Detector;

    // array of target elements accumulated in mutation observer
    // cleared in attachHoverListener
    const moQueue = [];

    onMutation([{
      addedNodes: [document.body],
    }]);

    new MutationObserver(onMutation)
      .observe(document.body, {
        childList: true,
        subtree: true,
      });

    Detector.init = true;

    function onMutation(mutations) {
      const alreadyScheduled = moQueue.length > 0;
      for (const {addedNodes} of mutations) {
        for (const n of addedNodes) {
          if (!n.localName)
            continue;
          if (n.localName === 'a') {
            moQueue.push(n);
            continue;
          }
          // not using ..spreading since there could be 100k links for all we know
          // and that might exceed JS engine stack limit which can be pretty low
          const targets = n.getElementsByTagName('a');
          for (let k = 0, len = targets.length; k < len; k++)
            moQueue.push(targets[k]);
          if (!isSE)
            continue;
          if (n.classList.contains('question-summary')) {
            moQueue.push(...n.getElementsByClassName('answered'));
            moQueue.push(...n.getElementsByClassName('answered-accepted'));
            continue;
          }
          for (const el of n.getElementsByClassName('question-summary')) {
            moQueue.push(...el.getElementsByClassName('answered'));
            moQueue.push(...el.getElementsByClassName('answered-accepted'));
          }
        }
      }
      if (!alreadyScheduled && moQueue.length)
        setTimeout(hoverize);
    }

    function hoverize() {
      for (const el of moQueue) {
        if (el[EXPANDO] instanceof Target)
          continue;
        if (el.localName === 'a') {
          if (isSE && el.classList.contains('js-share-link'))
            continue;
          const previewable = isPreviewable(el) || !isSE && isEmbeddedUrlPreviewable(el);
          if (!previewable)
            continue;
          const url = Urler.makeHttps(el.href);
          if (url.startsWith(base) || url.startsWith(baseShort))
            continue;
        }
        Target.createHoverable(el);
      }
      moQueue.length = 0;
    }

    function isPreviewable(a) {
      let href = false;
      const host = '.' + a.hostname;
      const hostLen = host.length;
      for (const stackSite of sites) {
        if (host[hostLen - stackSite.length] === '.' &&
            host.endsWith(stackSite) &&
            rxPreviewablePost.test(href || (href = a.href)))
          return true;
      }
    }

    function isEmbeddedUrlPreviewable(a) {
      const url = a.href;
      let i = url.indexOf('http', 1);
      if (i < 0)
        return false;
      i = (
        url.indexOf('http://', i) + 1 ||
        url.indexOf('https://', i) + 1 ||
        url.indexOf('http%3A%2F%2F', i) + 1 ||
        url.indexOf('https%3A%2F%2F', i) + 1
      ) - 1;
      if (i < 0)
        return false;
      const j = url.indexOf('&', i);
      const embeddedUrl = url.slice(i, j > 0 ? j : undefined);
      return rxPreviewablePost.test(embeddedUrl);
    }

    function getBaseUrls(url, rx) {
      if (!rx.test(url))
        return {};
      const base = Urler.makeHttps(RegExp.lastMatch);
      return {
        base,
        baseShort: base.replace('/questions/', '/q/'),
      };
    }
  }
}

/**
 * @property {Element} element
 * @property {Boolean} isLink
 * @property {String}  url
 * @property {Number}  timer
 * @property {Number}  timerCursor
 * @property {String}  savedCursor
 */
class Target {

  /** @param {Element} el */
  static createHoverable(el) {
    const target = new Target(el);
    Object.defineProperty(el, EXPANDO, {value: target});
    el.removeAttribute('title');
    el.addEventListener('mouseover', Target._onMouseOver);
    return target;
  }

  /** @param {Element} el */
  constructor(el) {
    this.element = el;
    this.isLink = el.localName === 'a';
  }

  release() {
    $.off('mousemove', this.element, Target._onMove);
    $.off('mouseout', this.element, Target._onHoverEnd);
    $.off('mousedown', this.element, Target._onHoverEnd);

    for (const k in this) {
      if (k.startsWith('timer') && this[k] >= 1) {
        clearTimeout(this[k]);
        this[k] = 0;
      }
    }
    BusyCursor.hide(this);
    pv.target = null;
  }

  get url() {
    const el = this.element;
    if (this.isLink)
      return el.href;
    const a = $('a', el.closest('.question-summary'));
    if (a)
      return a.href;
  }

  /** @param {MouseEvent} e */
  static _onMouseOver(e) {
    if (Util.hasKeyModifiers(e))
      return;
    const self = /** @type {Target} */ this[EXPANDO];
    if (self === Preview.target && Preview.shown() ||
        self === pv.target)
      return;

    if (pv.target)
      pv.target.release();
    pv.target = self;

    pv.hover.x = e.pageX;
    pv.hover.y = e.pageY;

    $.on('mousemove', this, Target._onMove);
    $.on('mouseout', this, Target._onHoverEnd);
    $.on('mousedown', this, Target._onHoverEnd);

    Target._restartTimer(self);
  }

  /** @param {MouseEvent} e */
  static _onHoverEnd(e) {
    if (e.type === 'mouseout' && e.target !== this)
      return;
    const self = /** @type {Target} */ this[EXPANDO];
    if (pv.xhr && pv.target === self) {
      pv.xhr.abort();
      pv.xhr = null;
    }
    self.release();
    self.timer = setTimeout(Target._onAbortTimer, AUTOHIDE_DELAY, self);
  }

  /** @param {MouseEvent} e */
  static _onMove(e) {
    const stoppedMoving =
      Math.abs(pv.hover.x - e.pageX) < 2 &&
      Math.abs(pv.hover.y - e.pageY) < 2;
    if (stoppedMoving) {
      pv.hover.x = e.pageX;
      pv.hover.y = e.pageY;
      Target._restartTimer(this[EXPANDO]);
    }
  }

  /** @param {Target} self */
  static _restartTimer(self) {
    if (self.timer)
      clearTimeout(self.timer);
    self.timer = setTimeout(Target._onTimer, PREVIEW_DELAY, self);
  }

  /** @param {Target} self */
  static _onTimer(self) {
    self.timer = 0;
    const el = self.element;
    if (!el.matches(':hover')) {
      self.release();
      return;
    }
    $.off('mousemove', el, Target._onMove);

    if (self.url)
      Preview.start(self);
  }

  /** @param {Target} self */
  static _onAbortTimer(self) {
    if ((self === pv.target || self === Preview.target) &&
        pv.frame && !pv.frame.matches(':hover')) {
      pv.target = null;
      Preview.hide({fade: true});
    }
  }
}


class BusyCursor {

  /** @param {Target} target */
  static schedule(target) {
    target.timerCursor = setTimeout(BusyCursor._onTimer, BUSY_CURSOR_DELAY, target);
  }

  /** @param {Target} target */
  static hide(target) {
    if (target.timerCursor) {
      clearTimeout(target.timerCursor);
      target.timerCursor = 0;
    }
    const style = target.element.style;
    if (style.cursor === 'wait')
      style.cursor = target.savedCursor;
  }

  /** @param {Target} target */
  static _onTimer(target) {
    target.timerCursor = 0;
    target.savedCursor = target.element.style.cursor;
    $.setStyle(target.element, ['cursor', 'wait']);
  }
}


class Preview {

  static init() {
    pv.frame = $.create(`#${ID}`, {parent: document.body});
    pv.shadow = pv.frame.attachShadow({mode: 'open'});
    pv.body = $.create(`body#${ID}-body`, {parent: pv.shadow});

    const WRAP_AROUND = '(or wrap around to the question)';
    const TITLE_PREV = 'Previous answer\n' + WRAP_AROUND;
    const TITLE_NEXT = 'Next answer\n' + WRAP_AROUND;
    const TITLE_ENTER = 'Return to the question\n(Enter was Return initially)';

    pv.answersTitle =
      $.create(`#${ID}-answers-title`, [
        'Answers:',
        $.create('p', [
          'Use ',
          $.create('b', {title: TITLE_PREV}),
          $.create('b', {title: TITLE_NEXT, attributes: {mirrored: ''}}),
          $.create('label', {title: TITLE_ENTER}, 'Enter'),
          ' to switch entries',
        ]),
      ]);

    $.on('keydown', pv.frame, Preview.onKey);
    $.on('keyup', pv.frame, Util.consumeEsc);

    $.on('mouseover', pv.body, ScrollLock.enable);
    $.on('click', pv.body, Preview.onClick);

    Sizer.init();
    Styles.init();
    Preview.init = true;
  }

  /** @param {Target} target */
  static async start(target) {
    Preview.target = target;

    if (!Security.checked)
      Security.check();

    const {url} = target;

    let data = Cache.read(url);
    if (data) {
      const r = await Urler.get(url, {method: 'HEAD'});
      const postTime = Util.getResponseDate(r.responseHeaders);
      if (postTime >= data.time)
        data = null;
    }

    if (!data) {
      BusyCursor.schedule(target);
      const {finalUrl, responseText: html} = await Urler.get(target.url);
      data = {finalUrl, html, unsaved: true};
      BusyCursor.hide(target);
    }

    data.url = url;
    data.showAnswer = !target.isLink;

    if (!Preview.prepare(data))
      Preview.target = null;
    else if (data.unsaved && data.lastActivity >= 1)
      Preview.save(data);
  }

  static save({url, finalUrl, html, lastActivity}) {
    const inactiveDays = Math.max(0, (Date.now() - lastActivity) / (24 * 3600e3));
    const cacheDuration = CACHE_DURATION * Math.pow(Math.log(inactiveDays + 1) + 1, 2);
    setTimeout(Cache.write, 1000, {url, finalUrl, html, cacheDuration});
  }

  // data is mutated: its lastActivity property is assigned!
  static prepare(data) {
    const {finalUrl, html, showAnswer, doc = Util.parseHtml(html)} = data;

    if (!doc || !doc.head)
      return Util.error('no HEAD in the document received for', finalUrl);

    let answerId;
    if (showAnswer) {
      const el = $('[id^="answer-"]', doc);
      answerId = el && el.id.match(/\d+/)[0];
    } else {
      answerId = finalUrl.match(/questions\/\d+\/[^/]+\/(\d+)|$/)[1];
    }
    const selector = answerId ? '#answer-' + answerId : '#question';
    const thing = $(selector, doc);
    const core = $(`.${answerId ? 'answer' : 'post'}cell`, thing);
    if (!core)
      return Util.error('No parsable post found', doc);

    const isQuestion = !answerId;
    const status = isQuestion && $('[role="status"]', core);
    const isClosed = status && $('[href*="closed"]', status);
    const isDeleted = Boolean(core.closest('.deleted-answer'));
    const type = [
      isQuestion && 'question' || 'answer',
      isDeleted && 'deleted',
      isClosed && 'closed',
    ].filter(Boolean).join(' ');
    const answers = $.all('.answer', doc);
    const comments = $(SEL_COMMENTS, thing);
    const lastActivity = Util.tryCatch(Util.extractTime, $('a[href*="?lastactivity"]', core)) ||
                         Date.now();
    const more = $(SEL_MORE, thing);
    Object.assign(pv, {
      finalUrl,
      finalUrlOfQuestion: Urler.makeCacheable(finalUrl),
    });
    /** @typedef Post
     * @property {Document}  doc
     * @property {String}    html
     * @property {String}    selector
     * @property {String}    type
     * @property {String}    id
     * @property {String}    title
     * @property {Boolean}   isQuestion
     * @property {Boolean}   isDeleted
     * @property {Number}    lastActivity
     * @property {Number}    numAnswers
     * @property {Element}   core
     * @property {Element}   comments
     * @property {Element[]} answers
     * @property {Element[]} renderParts
     */
    Object.assign(pv.post, {
      doc,
      html,
      core,
      selector,
      answers,
      comments,
      type,
      isQuestion,
      isDeleted,
      lastActivity,
      id: isQuestion ? Urler.getFirstNumber(finalUrl) : answerId,
      title: $('meta[property="og:title"]', doc).content,
      numAnswers: answers.length,
      renderParts: [
        // including the parent so the right CSS kicks in
        core.cloneNode(true),
        comments,
      ],
    });

    $.remove('script', doc);
    if (comments) {
      Render._comments(comments);
      if (more) {
        comments.appendChild($.create('a', {className: more.className}, more.innerText));
      }
    }
    // Expanding relative URLs manually since <base> may be restricted via CSP
    for (const a of $.all('a[href]:not([href*=":"])', doc))
      a.href = new URL(a.getAttribute('href'), finalUrl);

    Promise.all([
      pv.frame,
      Preview.addStyles(),
      Security.ready(),
    ]).then(Preview.show);

    data.lastActivity = lastActivity;
    return true;
  }

  static show() {
    Render.all();

    const style = getComputedStyle(pv.frame);
    if (style.opacity !== '1' || style.display !== 'block') {
      $.setStyle(pv.frame, ['display', 'block']);
      setTimeout($.setStyle, 0, pv.frame, ['opacity', '1']);
    }

    pv.parts.focus();
  }

  static hide({fade = false} = {}) {
    if (Preview.target) {
      Preview.target.release();
      Preview.target = null;
    }

    pv.body.onmouseover = null;
    pv.body.onclick = null;
    pv.body.onkeydown = null;

    if (fade) {
      Util.fadeOut(pv.frame)
        .then(Preview.eraseBoxIfHidden);
    } else {
      $.setStyle(pv.frame,
        ['opacity', '0'],
        ['display', 'none']);
      Preview.eraseBoxIfHidden();
    }
  }

  static shown() {
    return pv.frame.style.opacity === '1';
  }

  /** @param {KeyboardEvent} e */
  static onKey(e) {
    switch (e.key) {
      case 'Escape':
        Preview.hide({fade: true});
        break;
      case 'ArrowUp':
      case 'PageUp':
        if (pv.parts.scrollTop)
          return;
        break;
      case 'ArrowDown':
      case 'PageDown': {
        const {scrollTop: t, clientHeight: h, scrollHeight} = pv.parts;
        if (t + h < scrollHeight)
          return;
        break;
      }
      case 'ArrowLeft':
      case 'ArrowRight': {
        if (!pv.post.numAnswers)
          return;
        // current is 0 if isQuestion, 1 is the first answer
        const answers = $.all(`#${ID}-answers a`);
        const current = pv.post.numAnswers ?
          answers.indexOf($('.SEpreviewed')) + 1 :
          pv.post.isQuestion ? 0 : 1;
        const num = pv.post.numAnswers + 1;
        const dir = e.key === 'ArrowLeft' ? -1 : 1;
        const toShow = (current + dir + num) % num;
        const a = toShow ? answers[toShow - 1] : $(`#${ID}-title`);
        a.click();
        break;
      }
      case 'Enter':
        if (pv.post.isQuestion)
          return;
        $(`#${ID}-title`).click();
        break;
      default:
        return;
    }
    e.preventDefault();
  }

  /** @param {MouseEvent} e */
  static onClick(e) {
    if (e.target.id === `${ID}-close`) {
      Preview.hide();
      return;
    }

    const link = e.target.closest('a');
    if (!link)
      return;

    if (link.matches(SEL_MORE)) {
      Util.fadeOut(link, 0.5);
      Preview.loadComments();
      e.preventDefault();
      return;
    }

    if (e.button ||
        Util.hasKeyModifiers(e) ||
        !link.matches('.SEpreviewable')) {
      link.target = '_blank';
      return;
    }

    e.preventDefault();

    const {doc} = pv.post;
    if (link.id === `${ID}-title`)
      Preview.prepare({doc, finalUrl: pv.finalUrlOfQuestion});
    else if (link.matches(`#${ID}-answers a`))
      Preview.prepare({doc, finalUrl: pv.finalUrlOfQuestion + '/' + Urler.getFirstNumber(link)});
    else
      Preview.start(new Target(link));
  }

  static eraseBoxIfHidden() {
    if (!Preview.shown())
      pv.body.textContent = '';
  }

  static setHeight(height) {
    const currentHeight = pv.frame.clientHeight;
    const borderHeight = pv.frame.offsetHeight - currentHeight;
    const newHeight = Math.max(MIN_HEIGHT, Math.min(innerHeight - borderHeight, height));
    if (newHeight !== currentHeight)
      $.setStyle(pv.frame, ['height', newHeight + 'px']);
  }

  static async addStyles() {
    const isDark = matchMedia('(prefers-color-scheme: dark)').matches;
    colors = isDark ? COLORS_DARK : COLORS_LIGHT;
    pv.body.className = isDark ? 'theme-dark' : '';
    Styles.init(isDark);

    let last = $.create(`style#${ID}-styles.${Styles.REUSABLE}`, {
      textContent: pv.stylesOverride,
      before: pv.shadow.firstChild,
    });

    if (!pv.styles) {
      pv.styles = new Map();
      pv.stylesScaled = new Set();
    }

    const toDownload = [];
    const sourceElements = $.all('link[rel="stylesheet"], style', pv.post.doc);

    for (const {href, textContent, localName} of sourceElements) {
      const isLink = localName === 'link';
      const id = ID + '-style-' + (isLink ? href : await Util.sha256(textContent));
      const el = pv.styles.get(id);
      if (!el && isLink)
        toDownload.push(Urler.get({url: href, context: id}));
      last = $.create('style', {
        id,
        className: Styles.REUSABLE,
        textContent: isLink ? $.text(el) : textContent,
        after: last,
      });
      pv.styles.set(id, last);
    }

    const downloaded = await Promise.all(toDownload);

    for (const {responseText, context: id} of downloaded)
      Styles.applyRemScale(id, responseText);

    if (!pv.remScale) {
      pv.remScale = parseFloat(getComputedStyle(pv.body).fontSize) /
                    parseFloat(getComputedStyle(document.documentElement).fontSize);
      if (pv.remScale !== 1)
        for (const id of pv.styles.keys())
          Styles.applyRemScale(id);
    }
  }

  static async loadComments() {
    const list = pv.post.comments;
    const url = new URL(pv.finalUrl).origin + '/posts/' + pv.post.id.match(/\d+/)[0] + '/comments';
    const doc = Util.parseHtml((await Urler.get(url)).responseText);
    const oldIds = new Set([...list.children].map(e => e.id));

    Render._comments(doc.body);
    list.textContent = '';
    list.append(...doc.body.children);
    for (const cmt of list.children) {
      if (!oldIds.has(cmt.id))
        cmt.classList.add('new-comment-highlight');
    }

    Render.previewableLinks(list);
    Render.hoverableUsers(list);
  }
}


class Render {

  static all() {
    pv.frame.classList.toggle(`${ID}-hasAnswerShelf`, pv.post.numAnswers > 0);
    pv.frame.setAttribute(`${ID}-type`, pv.post.type);
    pv.body.setAttribute(`${ID}-type`, pv.post.type);

    $.create(`a#${ID}-title.SEpreviewable`, {
      href: pv.finalUrlOfQuestion,
      textContent: pv.post.title,
      parent: pv.body,
    });

    $.create(`#${ID}-close`, {
      title: 'Or press Esc key while the preview is focused (also when just shown)',
      parent: pv.body,
    });

    $.create(`#${ID}-meta`, {
      parent: pv.body,
      onmousedown: Sizer.onMouseDown,
      children: [
        Render._votes(),
        pv.post.isQuestion
          ? Render._questionMeta()
          : Render._answerMeta(),
      ],
    });

    // rendering answers should happen before pv.body is processed
    const shelf = pv.post.numAnswers &&
      pv.post.answers.reduce(Render._answer, [pv.answersTitle]);

    if (Security.noImages)
      Security.embedImages(...pv.post.renderParts);

    pv.parts = $.create(`#${ID}-parts`, {
      className: pv.post.isDeleted ? 'deleted-answer' : '',
      tabIndex: 0,
      scrollTop: 0,
      parent: pv.body,
      children: pv.post.renderParts,
    });
    Render.hoverableUsers(pv.parts);
    Render.previewableLinks(pv.body);

    if (shelf) {
      $.create(`#${ID}-answers`, {parent: pv.body}, shelf);
    } else {
      $.remove(`#${ID}-answers`, pv.body);
    }

    const ACTIONS_SEL = '.js-post-menu > div';
    const elActions = $(ACTIONS_SEL);

    // delinkify/remove non-functional items in post-menu
    $.remove('.js-share-link, .flag-post-link', pv.body);
    for (const el of $.all(`${ACTIONS_SEL} button`)) {
      const elWrapper = el.closest(`${ACTIONS_SEL} > div`);
      if (elWrapper) elWrapper.remove();
    }

    // add a timeline link
    elActions.append(
      $.create('div.' + elActions.firstElementChild.className, [
        $.create('a', {href: `/posts/${pv.post.id}/timeline`}, 'Timeline'),
      ])
    );

    // prettify code blocks
    hljs.configure({
      languages: [
        ...$.all('.post-taglist .post-tag', pv.post.doc).map($.text),
        'javascript',
        'html',
      ],
    });
    $.all('pre > code').forEach(el => {
      el = el.parentElement;
      el.className = el.className.replace(/((?:^|\s)lang-)bsh(?=\s|$)/, '$1powershell');
      hljs.highlightBlock(el);
    });

    const leftovers = $.all('style, link, script');
    for (const el of leftovers) {
      if (el.classList.contains(Styles.REUSABLE))
        el.classList.remove(Styles.REUSABLE);
      else
        el.remove();
    }

    pv.post.html = null;
    pv.post.core = null;
    pv.post.renderParts = null;
    pv.post.answers = null;
  }

  /** @param {Element} container */
  static previewableLinks(container) {
    for (const a of $.all('a:not(.SEpreviewable)', container)) {
      let href = a.getAttribute('href');
      if (!href)
        continue;
      if (!/^[\w-]+:/.test(href)) {
        href = new URL(href, pv.finalUrl).href;
        a.setAttribute('href', href);
      }
      if (Detector.rxPreviewablePost.test(href)) {
        a.removeAttribute('title');
        a.classList.add('SEpreviewable');
      }
    }
  }

  /** @param {Element} container */
  static hoverableUsers(container) {
    for (const a of $.all('a[href*="/users/"]', container)) {
      if (Detector.rxPreviewableSite.test(a.href) &&
          a.pathname.match(/^\/users\/\d+/)) {
        a.onmouseover = UserCard.onUserLinkHovered;
        a.classList.add(`${ID}-userLink`);
      }
    }
  }

  static _answer(res, el) {
    const shortUrl = $('.js-share-link', el).href.replace(/(\d+)\/\d+/, '$1');
    const extraClasses =
      (el.matches(pv.post.selector) ? ' SEpreviewed' : '') +
      (el.matches('.deleted-answer') ? ' deleted-answer' : '') +
      (el.matches('.accepted-answer') ? ` ${ID}-accepted` : '');
    const author = $('.post-signature:last-child, .s-user-card', el);
    const rep = $.text('.reputation-score', author);
    const title =
      $.text('.user-details a, .s-user-card--link', author) +
      (rep ? ' (rep ' + rep + ')' : '') + '\n' +
      $.text('.user-action-time, .s-user-card--time', author);
    let gravatar = $('img, .anonymous-gravatar, .community-wiki', author);
    if (gravatar && Security.noImages)
      Security.embedImages(gravatar);
    if (gravatar && gravatar.src)
      gravatar = $.create('img', {src: gravatar.src});
    const a = $.create('a', {
      href: shortUrl,
      title: title,
      className: 'SEpreviewable' + extraClasses,
      textContent: $.text('.js-vote-count', el).replace(/^0$/, '\xA0') + ' ',
      children: gravatar,
    });
    res.push(a, ' ');
    return res;
  }

  static _comments(list) {
    if (list.matches(SEL_CMT_TREE)) {
      for (const el of list.children) {
        const actions = el.querySelector('[itemprop=text] ~ div');
        el.querySelector('.h100').innerText = parseInt(actions.innerText) || '';
        actions.remove();
        el.className = el.className.replace('column', '');
      }
      return;
    }
    for (let el of $.all('.js-comment-body + div', list)) {
      el.textContent = +$('.js-vote-button', el).textContent.trim() || '\xA0';
      if ((el = el.nextElementSibling)) el.remove();
    }
    $.remove('.edit-comment-form, .comments-link', list);
    for (const el of $.all('.comment-actions', list))
      el.textContent = +el.innerText || '\xA0';
    list.className = '';
  }

  static _votes() {
    const votes = $.text('.js-vote-count', pv.post.core.closest('.post-layout'));
    if (Number(votes))
      return $.create('b', `${votes} vote${Math.abs(votes) >= 2 ? 's' : ''}`);
  }

  static _questionMeta() {
    try {
      return [...$('time', pv.post.doc).closest('.grid').children]
        .map(el => el.textContent.trim())
        .map((s, i) => (i ? s.toLowerCase() : s))
        .join(', ');
    } catch (e) {
      return '';
    }
  }

  static _answerMeta() {
    return $.all('.user-action-time', pv.post.core.closest('.answer'))
      .reverse()
      .map($.text)
      .join(', ');
  }
}


class UserCard {

  _fadeIn() {
    this._retakeId(this);
    $.setStyle(this.element,
      ['opacity', '0'],
      ['display', 'block']);
    this.timer = setTimeout(() => {
      if (this.timer)
        $.setStyle(this.element, ['opacity', '1']);
    });
  }

  _retakeId() {
    if (this.element.id !== 'user-menu') {
      const oldCard = $('#user-menu');
      if (oldCard)
        oldCard.id = oldCard.style.display = '';
      this.element.id = 'user-menu';
    }
  }

  // 'this' is the hoverable link enclosing the user's name/avatar
  static onUserLinkHovered() {
    clearTimeout(this[EXPANDO]);
    this[EXPANDO] = setTimeout(UserCard._show, PREVIEW_DELAY * 2, this);
  }

  /** @param {HTMLAnchorElement} a */
  static async _show(a) {
    if (!a.matches(':hover'))
      return;
    const el = a.nextElementSibling;
    const card = el && el.matches(`.${ID}-userCard`) && el[EXPANDO] ||
                 await UserCard._create(a);
    card._fadeIn();
  }

  /** @param {HTMLAnchorElement} a */
  static async _create(a) {
    const url = a.origin + '/users/user-info/' + Urler.getFirstNumber(a);
    let {html} = Cache.read(url) || {};
    if (!html) {
      html = (await Urler.get(url)).responseText;
      Cache.write({url, html, cacheDuration: CACHE_DURATION * 100});
    }

    const dom = Util.parseHtml(html);
    if (Security.noImages)
      Security.embedImages(dom);

    const b = a.getBoundingClientRect();
    const pb = pv.parts.getBoundingClientRect();
    const left = Math.min(b.left - 20, pb.right - 350) - pb.left + 'px';
    const isClipped = b.bottom + 100 > pb.bottom;

    const el = $.create(`#user-menu-tmp.${ID}-userCard`, {
      attributes: {
        style: `left: ${left} !important;` +
               (isClipped ? 'margin-top: -5rem !important;' : ''),
      },
      onmouseout: UserCard._onMouseOut,
      children: dom.body.children,
      after: a,
    });

    const card = new UserCard(el);
    Object.defineProperty(el, EXPANDO, {value: card});
    card.element = el;
    return card;
  }

  /** @param {MouseEvent} e */
  static _onMouseOut(e) {
    if (this.matches(':hover') ||
        this.style.opacity === '0' /* fading out already */)
      return;

    const self = /** @type {UserCard} */ this[EXPANDO];
    clearTimeout(self.timer);
    self.timer = 0;

    Util.fadeOut(this);
  }
}


class Sizer {

  static init() {
    Preview.setHeight(GM_getValue('height', innerHeight / 3) >> 0);
  }

  /** @param {MouseEvent} e */
  static onMouseDown(e) {
    if (e.button !== 0 || Util.hasKeyModifiers(e))
      return;
    Sizer._heightDelta = innerHeight - e.clientY - pv.frame.clientHeight;
    $.on('mousemove', document, Sizer._onMouseMove);
    $.on('mouseup', document, Sizer._onMouseUp);
  }

  /** @param {MouseEvent} e */
  static _onMouseMove(e) {
    Preview.setHeight(innerHeight - e.clientY - Sizer._heightDelta);
    getSelection().removeAllRanges();
  }

  /** @param {MouseEvent} e */
  static _onMouseUp(e) {
    GM_setValue('height', pv.frame.clientHeight);
    $.off('mouseup', document, Sizer._onMouseUp);
    $.off('mousemove', document, Sizer._onMouseMove);
  }
}


class ScrollLock {

  static enable() {
    if (ScrollLock.active)
      return;
    ScrollLock.active = true;
    ScrollLock.x = scrollX;
    ScrollLock.y = scrollY;
    $.on('mouseover', document.body, ScrollLock._onMouseOver);
    $.on('scroll', document, ScrollLock._onScroll);
  }

  static disable() {
    ScrollLock.active = false;
    $.off('mouseover', document.body, ScrollLock._onMouseOver);
    $.off('scroll', document, ScrollLock._onScroll);
  }

  static _onMouseOver() {
    if (ScrollLock.active)
      ScrollLock.disable();
  }

  static _onScroll() {
    scrollTo(ScrollLock.x, ScrollLock.y);
  }
}


class Security {

  static init() {
    if (Detector.isStackExchangePage) {
      Security.checked = true;
      Security.check = null;
    }
    Security.init = true;
  }

  static async check() {
    Security.noImages = false;
    Security._resolveOnReady = [];
    Security._imageCache = new Map();

    const {headers} = await fetch(location.href, {
      method: 'HEAD',
      cache: 'force-cache',
      mode: 'same-origin',
      credentials: 'same-origin',
    });
    const csp = headers.get('Content-Security-Policy');
    const imgSrc = /(?:^|[\s;])img-src\s+([^;]+)/i.test(csp) && RegExp.$1.trim();
    if (imgSrc)
      Security.noImages = !/(^\s)(\*|https?:)(\s|$)/.test(imgSrc);

    Security._resolveOnReady.forEach(fn => fn());
    Security._resolveOnReady = null;
    Security.checked = true;
    Security.check = null;
  }

  /** @return Promise<void> */
  static ready() {
    return Security.checked ?
      Promise.resolve() :
      new Promise(done => Security._resolveOnReady.push(done));
  }

  static embedImages(...containers) {
    for (const container of containers) {
      if (!container)
        continue;
      if (Util.isIterable(container)) {
        Security.embedImages(...container);
        continue;
      }
      if (container.localName === 'img') {
        Security._embedImage(container);
        continue;
      }
      for (const img of container.getElementsByTagName('img'))
        Security._embedImage(img);
    }
  }

  static _embedImage(img) {
    const src = img.src;
    if (!src || src.startsWith('data:'))
      return;
    const data = Security._imageCache.get(src);
    const alreadyFetching = Array.isArray(data);
    if (alreadyFetching) {
      data.push(img);
    } else if (data) {
      img.src = data;
      return;
    } else {
      Security._imageCache.set(src, [img]);
      Security._fetchImage(src);
    }
    $.setStyle(img, ['visibility', 'hidden']);
    img.dataset.src = src;
    img.removeAttribute('src');
  }

  static async _fetchImage(src) {
    const r = await Urler.get({url: src, responseType: 'blob'});
    const type = Util.getResponseMimeType(r.responseHeaders);
    const blob = r.response;
    const blobType = blob.type;
    let dataUri = await Util.blobToBase64(blob);
    if (blobType !== type)
      dataUri = 'data:' + type + dataUri.slice(dataUri.indexOf(';'));

    const images = Security._imageCache.get(src);
    Security._imageCache.set(src, dataUri);

    let detached = false;
    for (const el of images) {
      el.src = dataUri;
      el.style.removeProperty('visibility');
      if (!detached && el.ownerDocument !== document)
        detached = true;
    }

    if (detached) {
      for (const el of $.all(`img[data-src="${src}"]`)) {
        el.src = dataUri;
        el.style.removeProperty('visibility');
      }
    }
  }
}


// eslint-disable-next-line no-redeclare
class Cache {

  static init() {
    Cache.timers = new Map();
    setTimeout(Cache._cleanup, 10e3);
  }

  static read(url) {
    const keyUrl = Urler.makeCacheable(url);
    const [time, expires, finalUrl = url] = (localStorage[keyUrl] || '').split('\t');
    const keyFinalUrl = Urler.makeCacheable(finalUrl);
    return expires > Date.now() && {
      time,
      finalUrl,
      html: LZStringUnsafe.decompressFromUTF16(localStorage[keyFinalUrl + '\thtml']),
    };
  }

  // standard keyUrl = time,expiry
  //          keyUrl\thtml = html
  // redirected keyUrl = time,expiry,finalUrl
  //            keyFinalUrl = time,expiry
  //            keyFinalUrl\thtml = html
  static write({url, finalUrl, html, cacheDuration = CACHE_DURATION}) {

    cacheDuration = Math.max(CACHE_DURATION, Math.min(0x7FFF0000, cacheDuration >> 0));
    finalUrl = (finalUrl || url).replace(/[?#].*/, '');

    const keyUrl = Urler.makeCacheable(url);
    const keyFinalUrl = Urler.makeCacheable(finalUrl);
    const lz = LZStringUnsafe.compressToUTF16(html);

    if (!Util.tryCatch(Cache._writeRaw, keyFinalUrl + '\thtml', lz)) {
      Cache._cleanup({aggressive: true});
      if (!Util.tryCatch(Cache._writeRaw, keyFinalUrl + '\thtml', lz))
        return Util.error('localStorage write error');
    }

    const time = Date.now();
    const expiry = time + cacheDuration;
    localStorage[keyFinalUrl] = time + '\t' + expiry;
    if (keyUrl !== keyFinalUrl)
      localStorage[keyUrl] = time + '\t' + expiry + '\t' + finalUrl;

    const t = setTimeout(Cache._delete, cacheDuration + 1000,
      keyUrl,
      keyFinalUrl,
      keyFinalUrl + '\thtml');

    for (const url of [keyUrl, keyFinalUrl]) {
      clearTimeout(Cache.timers.get(url));
      Cache.timers.set(url, t);
    }
  }

  static _writeRaw(k, v) {
    localStorage[k] = v;
    return true;
  }

  static _delete(...keys) {
    for (const k of keys) {
      delete localStorage[k];
      Cache.timers.delete(k);
    }
  }

  static _cleanup({aggressive = false} = {}) {
    for (const k in localStorage) {
      if ((k.startsWith('http://') || k.startsWith('https://')) &&
          !k.includes('\t')) {
        const [, expires, url] = (localStorage[k] || '').split('\t');
        if (Number(expires) > Date.now() && !aggressive)
          break;
        if (url) {
          delete localStorage[url];
          Cache.timers.delete(url);
        }
        delete localStorage[(url || k) + '\thtml'];
        delete localStorage[k];
        Cache.timers.delete(k);
      }
    }
  }
}


class Urler {

  static init() {
    Urler.xhr = null;
    Urler.xhrNoSSL = new Set();
    Urler.init = true;
  }

  static getFirstNumber(url) {
    if (typeof url === 'string')
      url = new URL(url);
    return url.pathname.match(/\/(\d+)/)[1];
  }

  static makeHttps(url) {
    if (!url)
      return '';
    if (url.startsWith('http:'))
      return 'https:' + url.slice(5);
    return url;
  }

  // strips queries and hashes and anything after the main part
  // https://site/questions/NNNNNN/title/
  static makeCacheable(url) {
    return url
      .replace(/(\/q(?:uestions)?\/\d+\/[^/]+).*/, '$1')
      .replace(/(\/a(?:nswers)?\/\d+).*/, '$1')
      .replace(/[?#].*$/, '');
  }

  static get(options) {
    if (!options.url)
      options = {url: options, method: 'GET'};
    if (!options.method)
      options = Object.assign({method: 'GET'}, options);

    let url = options.url;
    const hostname = new URL(url).hostname;

    if (Urler.xhrNoSSL.has(hostname)) {
      url = url.replace(/^https/, 'http');
    } else {
      url = Urler.makeHttps(url);
      const _onerror = options.onerror;
      options.onerror = () => {
        options.onerror = _onerror;
        options.url = url.replace(/^https/, 'http');
        Urler.xhrNoSSL.add(hostname);
        return Urler.get(options);
      };
    }

    return new Promise(resolve => {
      let xhr;
      options.onload = r => {
        if (pv.xhr === xhr)
          pv.xhr = null;
        resolve(r);
      };
      options.url = url;
      xhr = pv.xhr = GM_xmlhttpRequest(options);
    });
  }
}


class Util {

  static tryCatch(fn, ...args) {
    try {
      return fn(...args);
    } catch (e) {}
  }

  static isIterable(o) {
    return typeof o === 'object' && Symbol.iterator in o;
  }

  static parseHtml(html) {
    if (!Util.parser)
      Util.parser = new DOMParser();
    return Util.parser.parseFromString(html, 'text/html');
  }

  static extractTime(element) {
    return new Date(element.title).getTime();
  }

  static getResponseMimeType(headers) {
    return headers.match(/^\s*content-type:\s*(.*)|$/mi)[1] ||
           'image/png';
  }

  static getResponseDate(headers) {
    try {
      return new Date(headers.match(/^\s*date:\s*(.*)/mi)[1]);
    } catch (e) {}
  }

  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(blob);
    });
  }

  static async sha256(str) {
    if (!pv.utf8encoder)
      pv.utf8encoder = new TextEncoder('utf-8');
    const buf = await crypto.subtle.digest('SHA-256', pv.utf8encoder.encode(str));
    const blob = new Blob([buf]);
    const url = await Util.blobToBase64(blob);
    return url.slice(url.indexOf(',') + 1);
  }

  /** @param {KeyboardEvent} e */
  static hasKeyModifiers(e) {
    return e.ctrlKey || e.altKey || e.shiftKey || e.metaKey;
  }

  static fadeOut(el, transition) {
    return new Promise(resolve => {
      if (transition) {
        if (typeof transition === 'number')
          transition = `opacity ${transition}s ease-in-out`;
        $.setStyle(el, ['transition', transition]);
        setTimeout(doFadeOut);
      } else {
        doFadeOut();
      }
      function doFadeOut() {
        $.setStyle(el, ['opacity', '0']);
        $.on('transitionend', el, done);
        $.on('visibilitychange', el, done);
      }
      function done() {
        $.off('transitionend', el, done);
        $.off('visibilitychange', el, done);
        if (el.style.opacity === '0')
          $.setStyle(el, ['display', 'none']);
        resolve();
      }
    });
  }

  /** @param {KeyboardEvent} e */
  static consumeEsc(e) {
    if (e.key === 'Escape')
      e.preventDefault();
  }

  static error(...args) {
    console.error(GM_info.script.name, ...args);
  }
}


class Styles {

  static init(isDark) {
    if (Styles.isDark === isDark)
      return;

    Styles.isDark = isDark;
    Styles.REUSABLE = `${ID}-reusable`;

    const KBD_COLOR = '#0008';

    // language=HTML
    const SVG_ARROW = btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
        <path stroke="${KBD_COLOR}" stroke-width="3" fill="none"
              d="M2.5,8.5H15 M9,2L2.5,8.5L9,15"/>
      </svg>`
      .replace(/>\s+</g, '><')
      .replace(/[\r\n]/g, ' ')
      .replace(/\s\s+/g, ' ')
      .trim()
    );

    const IMPORTANT = '!important;';

    // language=CSS
    pv.stylesOverride = [
      `
      :host {
        all: initial;
        border-color: transparent;
        display: none;
        opacity: 0;
        height: 33%;
        transition: opacity .25s cubic-bezier(.88,.02,.92,.66),
                    border-color .25s ease-in-out;
      }
      `,

      `
      :host {
        box-sizing: content-box;
        width: ${WIDTH}px;
        min-height: ${MIN_HEIGHT}px;
        position: fixed;
        right: 0;
        bottom: 0;
        padding: 0;
        margin: 0;
        background: white;
        box-shadow: 0 0 100px rgba(0,0,0,0.5);
        z-index: 999999;
        border-width: ${TOP_BORDER}px ${BORDER}px ${BORDER}px;
        border-style: solid;
      }
      :host(:not([style*="opacity: 1"])) {
        pointer-events: none;
      }
      :host([\\type$="question"].\\hasAnswerShelf) {
        border-image: linear-gradient(
          ${colors.question.back} 66%,
          ${colors.answer.back}) 1 1;
      }
      `.replace(/;/g, IMPORTANT),

      ...Object.entries(colors).map(([type, colors]) => `
        :host([\\type$="${type}"]) {
          border-color: ${colors.back} !important;
        }
      `),

      `
      #\\body {
        min-width: unset!important;
        box-shadow: none!important;
        padding: 0!important;
        margin: 0!important;
        background: ${colors.body.back}!important;
        color: ${colors.body.fore}!important;
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      #\\title {
        all: unset;
        display: block;
        padding: 12px ${PADDING}px;
        font-weight: bold;
        font-size: 18px;
        line-height: 1.2;
        cursor: pointer;
      }
      #\\title:hover {
        text-decoration: underline;
        text-decoration-skip: ink;
      }
      #\\title:hover + #\\meta {
        opacity: 1.0;
      }

      #\\meta {
        position: absolute;
        font: bold 14px/${TOP_BORDER}px sans-serif;
        height: ${TOP_BORDER}px;
        top: -${TOP_BORDER}px;
        left: -${BORDER}px;
        right: ${BORDER * 2}px;
        padding: 0 0 0 ${BORDER + PADDING}px;
        display: flex;
        align-items: center;
        cursor: s-resize;
      }
      #\\meta b {
        height: ${TOP_BORDER}px;
        display: inline-block;
        padding: 0 6px;
        margin-left: -6px;
        margin-right: 3px;
      }

      #\\close {
        position: absolute;
        top: -${TOP_BORDER}px;
        right: -${BORDER}px;
        width: ${BORDER * 3}px;
        flex: none;
        cursor: pointer;
        padding: .5ex 1ex;
        font: normal 15px/1.0 sans-serif;
        color: #fff8;
      }
      #\\close:after {
        content: "x";
      }
      #\\close:active {
        background-color: rgba(0,0,0,.2);
      }
      #\\close:hover {
        background-color: rgba(0,0,0,.1);
      }

      #\\parts {
        position: relative;
        overflow-y: overlay; /* will replace with scrollbar-gutter once it's implemented */
        overflow-x: hidden;
        flex-grow: 2;
        outline: none;
        margin: 0;
        padding: ${PADDING}px ${PADDING - PROSE_MARGIN}px ${PADDING}px ${PADDING}px !important;
      }
      #\\parts > .question-status {
        margin: -${PADDING}px -${PADDING}px ${PADDING}px;
        padding-left: ${PADDING}px;
      }
      #\\parts .question-originals-of-duplicate {
        margin: -${PADDING}px -${PADDING}px ${PADDING}px;
        padding: ${PADDING / 2 >> 0}px ${PADDING}px;
      }
      #\\parts > .question-status h2 {
        font-weight: normal;
      }
      #\\parts a.SEpreviewable {
        text-decoration: underline !important;
        text-decoration-skip: ink;
      }

      #\\parts .js-follow-up .fd-column {
        flex-flow: row-reverse !important;
        justify-content: flex-end;
      }
      #\\parts li.comment > :first-child,
      #\\parts .js-follow-up .fd-column > :last-child {
        font-weight: bold;
        flex: 0 0 2em;
      }
      #\\parts li.comment {
        display: flex;
      }
      #\\parts li.comment:nth-last-child(n + 2) {
        margin-bottom: 1em;
      }
      #\\parts .delete-tag {
        display: none;
      }
      #\\parts .new-comment-highlight .comment-text {
        -webkit-animation: highlight 9s cubic-bezier(0,.8,.37,.88);
        -moz-animation: highlight 9s cubic-bezier(0,.8,.37,.88);
        animation: highlight 9s cubic-bezier(0,.8,.37,.88);
      }
      #\\parts .post-menu > span {
        opacity: .35;
      }

      #\\parts #user-menu {
        position: absolute;
      }
      .\\userCard {
        position: absolute;
        display: none;
        transition: opacity .25s cubic-bezier(.88,.02,.92,.66) .5s;
        margin-top: -3rem;
      }
      #\\parts .wmd-preview a:not(.post-tag),
      #\\parts .postcell a:not(.post-tag),
      #\\parts .comment-copy a:not(.post-tag) {
        border-bottom: none;
      }

      #\\answers-title {
        margin: .5ex 1ex 0 0;
        font-size: 18px;
        line-height: 1.0;
        float: left;
      }
      #\\answers-title p {
        font-size: 11px;
        font-weight: normal;
        max-width: 8em;
        line-height: 1.0;
        margin: 1ex 0 0 0;
        padding: 0;
      }
      #\\answers-title b,
      #\\answers-title label {
        background: linear-gradient(#fff8 30%, #fff);
        width: 10px;
        height: 10px;
        padding: 2px;
        margin-right: 2px;
        box-shadow: 0 1px 3px #0008;
        border-radius: 3px;
        font-weight: normal;
        display: inline-block;
        vertical-align: middle;
      }
      #\\answers-title b::after {
        content: "";
        display: block;
        width: 100%;
        height: 100%;
        background: url('data:image/svg+xml;base64,${SVG_ARROW}') no-repeat center;
      }
      #\\answers-title b[mirrored]::after {
        transform: scaleX(-1);
      }
      #\\answers-title label {
        width: auto;
        color: ${KBD_COLOR};
      }

      #\\answers {
        all: unset;
        display: block;
        padding: 10px 10px 10px ${PADDING}px;
        font-weight: bold;
        line-height: 1.0;
        border-top: 4px solid ${colors.answer.back}5e;
        background-color: ${colors.answer.back}5e;
        color: ${colors.answer.fore};
        word-break: break-word;
      }
      #\\answers a {
        color: ${colors.answer.fore};
        text-decoration: none;
        font-size: 11px;
        font-family: monospace;
        width: 40px !important;
        display: inline-block;
        position: relative;
        vertical-align: top;
        text-align: center;
        margin: 0 1ex 1ex 0;
        padding: 0 0 1.1ex 0;
      }
      [\\type*="deleted"] #\\answers a {
        color: ${colors.deleted.fore};
      }
      #\\answers img {
        width: 32px;
        height: 32px;
      }
      #\\answers a.deleted-answer {
        color: ${colors.deleted.fore};
        background: transparent;
        opacity: 0.25;
      }
      #\\answers a.deleted-answer:hover {
        opacity: 1.0;
      }
      #\\answers a:hover:not(.SEpreviewed) {
        text-decoration: underline;
        text-decoration-skip: ink;
      }
      #\\answers a.SEpreviewed {
        background-color: ${colors.answer.fore};
        color: ${colors.answer.foreInv};
        outline: 4px solid ${colors.answer.fore};
      }
      #\\answers a::after {
        display: block;
        white-space: pre;
        overflow: hidden;
        text-overflow: ellipsis;
        content: attr(title);
        font: normal .75rem/1.0 sans-serif;
        opacity: .7;
      }
      #\\answers a:only-of-type::after {
        overflow: visible;
      }
      #\\answers a:hover::after {
        opacity: 1;
      }
      .\\accepted::before {
        content: "✔";
        position: absolute;
        display: block;
        top: 1.3ex;
        right: -0.7ex;
        font-size: 32px;
        color: #4bff2c;
        text-shadow: 1px 2px 2px rgba(0,0,0,0.5);
      }

      @-webkit-keyframes highlight {
        from {background: #ffcf78}
        to   {background: none}
      }
      `,

      ...Object.keys(colors).map(s => `
        #\\title {
          background-color: ${colors[s].back}5e;
          color: ${colors[s].fore};
        }
        #\\meta {
          color: ${colors[s].fore};
        }
        #\\meta b {
          color: ${colors[s].foreInv};
          background: ${colors[s].fore};
        }
        #\\close {
          color: ${colors[s].fore};
        }
        #\\parts::-webkit-scrollbar {
          background-color: ${colors[s].back}19;
        }
        #\\parts::-webkit-scrollbar-thumb {
          background-color: ${colors[s].back}32;
        }
        #\\parts::-webkit-scrollbar-thumb:hover {
          background-color: ${colors[s].back}4b;
        }
        #\\parts::-webkit-scrollbar-thumb:active {
          background-color: ${colors[s].back}c0;
        }
      `
      // language=JS
        .replace(/#\\/g, `[\\type$="${s}"] $&`)
      ),

      ...['deleted', 'closed'].map(s => /* language=CSS */ `
        #\\answers {
          border-top-color: ${colors[s].back}5e;
          background-color: ${colors[s].back}5e;
          color: ${colors[s].fore};
        }
        #\\answers a.SEpreviewed {
          background-color: ${colors[s].fore};
          color: ${colors[s].foreInv};
        }
        #\\answers a.SEpreviewed:after {
          border-color: ${colors[s].fore};
        }
      `
      // language=JS
        .replace(/#\\/g, `[\\type$="${s}"] $&`)
      ),

      GM_getResourceText(`HL-style${isDark ? '-dark' : ''}`),
    ].join('\n').replace(/\\/g, `${ID}-`);
  }

  static applyRemScale(id, css) {
    const el = pv.styles.get(id);
    if (pv.remScale && pv.remScale !== 1 && !pv.stylesScaled.has(id)) {
      css = (css || el.textContent).replace(/([:\s])((?:\d*\.?)?\d+)(?=rem([;}\s]|\/\*))/gi,
        (_, prev, size) => prev + (pv.remScale * size));
      pv.stylesScaled.add(id);
    }
    el.textContent = css;
  }
}

function $(selector, node = pv.shadow) {
  return node && node.querySelector(selector);
}

Object.assign($, {

  all(selector, node = pv.shadow) {
    return node ? [...node.querySelectorAll(selector)] : [];
  },

  on(eventName, node, fn, options) {
    return node.addEventListener(eventName, fn, options);
  },

  off(eventName, node, fn, options) {
    return node.removeEventListener(eventName, fn, options);
  },

  remove(selector, node = pv.shadow) {
    for (const el of node.querySelectorAll(selector))
      el.remove();
  },

  text(selector, node = pv.shadow) {
    const el = typeof selector === 'string' ?
      node && node.querySelector(selector) :
      selector;
    return el ? el.textContent.trim() : '';
  },

  create(
    selector,
    opts = {},
    children = opts.children ||
               (typeof opts !== 'object' || Util.isIterable(opts)) && opts
  ) {
    const EOL = selector.length;
    const idStart = (selector.indexOf('#') + 1 || EOL + 1) - 1;
    const clsStart = (selector.indexOf('.', idStart < EOL ? idStart : 0) + 1 || EOL + 1) - 1;
    const tagEnd = Math.min(idStart, clsStart);
    const tag = (tagEnd < EOL ? selector.slice(0, tagEnd) : selector) || opts.tag || 'div';
    const id = idStart < EOL && selector.slice(idStart + 1, clsStart) || opts.id || '';
    const cls = clsStart < EOL && selector.slice(clsStart + 1).replace(/\./g, ' ') ||
                opts.className ||
                '';
    const el = id && pv.shadow && pv.shadow.getElementById(id) ||
               document.createElement(tag);
    if (el.id !== id)
      el.id = id;
    if (el.className !== cls)
      el.className = cls;
    const hasOwnProperty = Object.hasOwnProperty;
    for (const key in opts) {
      if (!hasOwnProperty.call(opts, key))
        continue;
      const value = opts[key];
      switch (key) {
        case 'tag':
        case 'id':
        case 'className':
        case 'children':
          break;
        case 'dataset': {
          const dataset = el.dataset;
          for (const k in value) {
            if (hasOwnProperty.call(value, k)) {
              const v = value[k];
              if (dataset[k] !== v)
                dataset[k] = v;
            }
          }
          break;
        }
        case 'attributes': {
          for (const k in value) {
            if (hasOwnProperty.call(value, k)) {
              const v = value[k];
              if (el.getAttribute(k) !== v)
                el.setAttribute(k, v);
            }
          }
          break;
        }
        default:
          if (el[key] !== value)
            el[key] = value;
      }
    }
    if (children) {
      if (!hasOwnProperty.call(opts, 'textContent'))
        el.textContent = '';
      el.append(...Array.isArray(children) ? children.filter(Boolean)
        : Util.isIterable(children) ? children
          : [children]);
    }
    let before, after, parent;
    if ((before = opts.before) && before !== el.nextSibling && before !== el)
      before.insertAdjacentElement('beforebegin', el);
    else if ((after = opts.after) && after !== el.previousSibling && after !== el)
      after.insertAdjacentElement('afterend', el);
    else if ((parent = opts.parent) && parent !== el.parentNode)
      parent.appendChild(el);
    return el;
  },

  setStyle(el, ...props) {
    const style = el.style;
    const s0 = style.cssText;
    let s = s0;

    for (const p of props) {
      if (!p)
        continue;

      const [name, value, important = true] = p;
      const rValue = value + (important && value ? ' !important' : '');
      const rx = new RegExp(`(^|[\\s;])${name}(\\s*:\\s*)([^;]*?)(\\s*(?:;|$))`, 'i');
      const m = rx.exec(s);

      if (!m && value) {
        const rule = name + ': ' + rValue;
        s += !s || s.endsWith(';') ? rule : '; ' + rule;
        continue;
      }

      if (!m && !value)
        continue;

      const [, sep1, sep2, oldValue, sep3] = m;
      if (value !== oldValue) {
        s = s.slice(0, m.index) +
            sep1 + (rValue ? name + sep2 + rValue + sep3 : '') +
            s.slice(m.index + m[0].length);
      }
    }

    if (s !== s0)
      style.cssText = s;
  },
});
