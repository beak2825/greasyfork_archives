// ==UserScript==
// @name        MangaDex Shit Filter
// @version     1.5
// @namespace   mangadexshitfilter
// @author      nazatanada
// @description Cleans garbage and embeds tags on latest updates page and other title list pages on Mangadex.org/.cc
// @include     /https?:\/\/mangadex\.org\/?.*/
// @include     /https?:\/\/mangadex\.cc\/?.*/
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/395821/MangaDex%20Shit%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/395821/MangaDex%20Shit%20Filter.meta.js
// ==/UserScript==
const UPDATE = 7 * 24 * 60 * 60 * 1000; // Updates records weekly
const DEXKEY = 'dex1.3';
const LANG = { 1: 'English', 2: 'Japanese', 3: 'Polish', 8: 'German', 10: 'French', 12: 'Vietnamese', 21: 'Chinese', 27: 'Indonesian', 28: 'Korean', 29: 'Spanish (LATAM)', 32: 'Thai', 34: 'Filipino', 35: 'Chinese (Trad)' };
const STAT = { 1: 'Ongoing', 2: 'Completed', 3: 'Cancelled', 4: 'Hiatus' };
const DEMO = { 1: 'Shounen', 2: 'Shoujo', 3: 'Seinen', 4: 'Josei' };
const GENR = { 1: '4-Koma', 4: 'Award Winning', 7: 'Doujinshi', 9: 'Ecchi', 2: 'Action', 3: 'Adventure', 5: 'Comedy', 8: 'Drama', 6: 'Cooking', 10: 'Fantasy', 11: 'Gyaru', 12: 'Harem', 13: 'Historical', 14: 'Horror', 16: 'Martial Arts', 17: 'Mecha', 18: 'Medical', 19: 'Music', 20: 'Mystery', 21: 'Oneshot', 22: 'Psychological', 23: 'Romance', 24: 'School Life', 25: 'Sci-Fi', 28: 'Shoujo Ai', 30: 'Shounen Ai', 31: 'Slice of Life', 32: 'Smut', 33: 'Sports', 34: 'Supernatural', 35: 'Tragedy', 36: 'Long Strip', 37: 'Yaoi', 38: 'Yuri', 40: 'Video Games', 41: 'Isekai', 42: 'Adaptation', 43: 'Anthology', 44: 'Web Comic', 45: 'Full Color', 46: 'User Created', 47: 'Official Colored', 48: 'Fan Colored', 49: 'Gore', 50: 'Sexual Violence', 51: 'Crime', 52: 'Magical Girls', 53: 'Philosophical', 54: 'Superhero', 55: 'Thriller', 56: 'Wuxia', 57: 'Aliens', 58: 'Animals', 59: 'Crossdressing', 60: 'Demons', 61: 'Delinquents', 62: 'Genderswap', 63: 'Ghosts', 64: 'Monster Girls', 65: 'Loli', 66: 'Magic', 67: 'Military', 68: 'Monsters', 69: 'Ninja', 70: 'Office Workers', 71: 'Police', 72: 'Post-Apocalyptic', 73: 'Reincarnation', 74: 'Reverse Harem', 75: 'Samurai', 76: 'Shota', 77: 'Survival', 78: 'Time Travel', 79: 'Vampires', 80: 'Traditional Games', 81: 'Virtual Reality', 82: 'Zombies', 83: 'Incest', 84: 'Mafia' };
let parallel = 0;
let paradise = 5; // Decrease this value if you get a red DESU spam
function keyof(arr, val) {
  let key = 0;
  if (val) {
    Object.entries(arr).some(e => val === e[1] && (key = e[0]));
  }
  return parseInt(key);
}
function make(doc, maid) {
  const gkeys = [];
  doc.find('a[href^="/genre/"]').each((idx, elm) => {
    gkeys.push(keyof(GENR, $(elm).text()));
  });
  const dict = GM_getValue(DEXKEY, {});
  dict[maid] = {
    'm': Date.now(),
    'l': keyof(LANG, doc.find('.card-header .flag').first().attr('title')),
    's': keyof(STAT, doc.find('div.strong:contains("Pub. status:")').first().next().text()),
    'd': keyof(DEMO, doc.find('a[href^="/search?demo_id="]').first().text()),
    'g': gkeys,
  };
  GM_setValue(DEXKEY, dict);
  return dict[maid];
}
function filt(madict, shit) {
  function wrap(bad, ger) {
    return ger ? '<a class="badge badge-' + bad + '">' + ger + '</a> ' : '';
  }
  if (madict['l'] === 2 && shit[1] !== 'm2254328958') {
    let e = '<div style="color: white">';
    e += wrap('primary', STAT[madict['s']]);
    e += wrap('primary', DEMO[madict['d']]);
    madict['g'].forEach(g => {
      const gstr = GENR[g];
      e += wrap(/(^(Y[au]|W|U)|Ai$)/.test(gstr) ? 'warning' : 'secondary', gstr);
    });
    shit[0].append(e + '</div>');
  } else {
    shit[0].remove();
  }
}
function gets(deq, maid, shit) {
  return () => {
    $.get({
      url: '/title/' + maid,
      success: (raw) => {
        if (raw) {
          filt(make($(raw), maid), shit);
        }
      },
      error: () => {
        if (paradise) {
          deq.queue(gets(deq, maid, shit));
        }
      },
      complete: (xhr) => {
        parallel--;
        if (xhr.status === 403 || xhr.status === 503) {
          paradise = 0;
          deq.clearQueue();
          shit[0].parent().prepend($('<div style="color:red"> DESU </div>'));
        } else {
          do {
            deq.dequeue();
          } while ( parallel++ < paradise );
        }
      }
    });
  };
}
function mmh2_32(str, seed) {
  var l = str.length, h = seed ^ l, i = 0, k;
  while (l >= 4) {
    k = ((str.charCodeAt(i) & 0xff)) |
      ((str.charCodeAt(++i) & 0xff) << 8) |
      ((str.charCodeAt(++i) & 0xff) << 16) |
      ((str.charCodeAt(++i) & 0xff) << 24);
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    k ^= k >>> 24;
    k = (((k & 0xffff) * 0x5bd1e995) + ((((k >>> 16) * 0x5bd1e995) & 0xffff) << 16));
    h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16)) ^ k;
    l -= 4; ++i;
  }
  switch (l) {
    case 3: h ^= (str.charCodeAt(i + 2) & 0xff) << 16;
    case 2: h ^= (str.charCodeAt(i + 1) & 0xff) << 8;
    case 1: h ^= (str.charCodeAt(i) & 0xff);
      h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  }
  h ^= h >>> 13;
  h = (((h & 0xffff) * 0x5bd1e995) + ((((h >>> 16) * 0x5bd1e995) & 0xffff) << 16));
  h ^= h >>> 15;
  return h >>> 0;
}
$(document).ready(() => {
  const now = Date.now();
  const deq = $({});
  ['dex', 'dex1.2'].forEach(v => GM_deleteValue(v, null));
  $('.tab-content .manga_title').each((idx, elm) => {
    const maid = $(elm).attr('href').match(/title\/(\d+)/i)[1];
    const shit = [ $(elm).parent().parent(), 'm' + mmh2_32('m' + maid, maid)];
    const dict = GM_getValue(DEXKEY, null);
    if (dict && dict[maid] && now - dict[maid]['m'] < UPDATE) {
      filt(dict[maid], shit);
    } else {
      deq.queue(gets(deq, maid, shit));
    }
  });
});
