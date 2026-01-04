// ==UserScript==
// @name     Gab: Quick Share
// @version  3
// @grant    none
// @require  https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @match    https://*.gab.com/*
// @match    https://*.gab.ai/*
// @author   monnef
// @description Adds quick share button to each gab post. Clicking results in copying text with a link to that post into clipboard.
// @namespace   monnef.eu
// @downloadURL https://update.greasyfork.org/scripts/382887/Gab%3A%20Quick%20Share.user.js
// @updateURL https://update.greasyfork.org/scripts/382887/Gab%3A%20Quick%20Share.meta.js
// ==/UserScript==

const debug = false;

const tagCl = 'gqs';
const qsCl = tagCl + '-qs';
const lTag = '[GQS]';

const dLog = (...x) => { if (debug) console.debug(lTag, ...x); };
const log = (...x) => { console.log(lTag, ...x); }
const logErr = (...x) => { console.error(lTag, ...x); }

const addStyle = (style) => {
    style = style instanceof Array ? style.join('\n') : style;
    $('head').append($('<style type="text/css">' + style + '</style>'));
}

addStyle(`
/* Gab: Quick Share by monnef */

.${qsCl} {
  float: right;
  margin-right: 1em;
  cursor: pointer;
  transform: scale(1.2);
  color: #666 !important;
}
.${qsCl}:hover {
  text-decoration: none !important;
  color: #fff !important;
}
.detailed-status__wrapper .${qsCl} {
  margin: 0;
  flex-grow: 1;
  text-align: center;
}
`);

const qsText = '🗲';

const qsFlashText = (el, text) => {
  el.text(text);
  setTimeout(() => el.text(qsText), 1000);
};

const extractTextForQS = (el) => {
  const innerEls = el.find('.status__content p');
  const text = innerEls.map((i, x) => {
    const el = $(x);
    dLog('1, i=', i, 'x=', x, 'el=', el);
    return el.contents().map((j, y) => {
      dLog('2, j=', j, 'y=', y);
      if (y.nodeType === Node.TEXT_NODE) return y.nodeValue;
      const el2 = $(y);
      dLog('2. el2=', el2);
      if (y.tagName === 'A') { 
        if (el2.hasClass('hashtag')
            || el2.hasClass('inner-post-mention')
           ) {
          return el2.text();
        };
        return el2.attr('href');
      } else if(y.tagName === 'IMG' && el2.hasClass('emojione')) {
        return el2.attr('alt');
      } else if (y.tagName === 'BR') {
        return '\n';
      }
      return el2.text();
    }).toArray().concat('\n');
  }).toArray().join('');
  return text;
};

const handleQuickShare = (el) => {
  const qsEl = el.find(`.${qsCl}`);
  const postLinkEls = el.find('a.status__relative-time, a.detailed-status__datetime').filter((i, x) => x.href.includes('/posts/'));
  if (postLinkEls.length != 1) {
    logErr('failed to locate a post link', postLinkEls);
    qsFlashText(qsEl, '❎');
  } else {
    const text = extractTextForQS(el);
    const postLinkHref = postLinkEls.attr('href');
    const link = postLinkHref.startsWith('http') ? postLinkHref : `https://gab.com${postLinkHref}`;
    const toCopy = `${text}\n${link}`;
    dLog({link, text, toCopy});
    log('copying to clipboard:\n' + toCopy);
    navigator.clipboard.writeText(toCopy)
      .then(() => {
        log('copy ok');
        qsFlashText(qsEl, '📋✅');
      })
      .catch(e => {
        logErr('copy failed', e);
        // alert(`Copying to clipboard failed: ${e}`);
        qsFlashText(qsEl, '📋❎');
      });
  }
};

const processOneGab = (el) => {
  const qsEl = $('<a/>').text(qsText).addClass(qsCl).attr('title', 'Quick Share\n(user-script by monnef)').click(() => handleQuickShare(el));
  el.find('.status__action-bar .status__action-bar__counter:last, .detailed-status__button:last').after(qsEl);
};

const work = () => {
  $('div.status__wrapper, div.detailed-status__wrapper').each((idx, rEl) => {
    const el = $(rEl);
    if(el.hasClass(tagCl)) return;
    el.addClass(tagCl);
    processOneGab(el);
  });
  setTimeout(work, 500);
}

$(() => {
  const suf = ' background-color: black; font-size: 150%;';
  console.info('%c' + lTag + ' 🐸👌 %cGab: Quick Share %cby 🔸%cmonnef🔸%c [🍍]',
    'color: gray;' + suf,
    'color: lime;'+ suf,
    'color: white;' + suf,
    'color: magenta;' + suf,
    'color: gray;' + suf,
  );
  work();
});
