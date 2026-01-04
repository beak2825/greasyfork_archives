// ==UserScript==
// @name        Poor man’s italic/bold
// @namespace   https://github.com/kugland
// @match       *://*/*
// @grant       none
// @version     1.0.7
// @author      André Kugland
// @description Bold/italic in normal <input>/<textarea> elements
// @license     MIT
// @supportURL  https://github.com/kugland/poor-mans-italic-bold/issues
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/453505/Poor%20man%E2%80%99s%20italicbold.user.js
// @updateURL https://update.greasyfork.org/scripts/453505/Poor%20man%E2%80%99s%20italicbold.meta.js
// ==/UserScript==

const regular = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const bold = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇';
const italic = '𝘈𝘉𝘊𝘋𝘌𝘍𝘎𝘏𝘐𝘑𝘒𝘓𝘔𝘕𝘖𝘗𝘘𝘙𝘚𝘛𝘜𝘝𝘞𝘟𝘠𝘡𝘢𝘣𝘤𝘥𝘦𝘧𝘨𝘩𝘪𝘫𝘬𝘭𝘮𝘯𝘰𝘱𝘲𝘳𝘴𝘵𝘶𝘷𝘸𝘹𝘺𝘻';
const boldItalic = '𝘼𝘽𝘾𝘿𝙀𝙁𝙂𝙃𝙄𝙅𝙆𝙇𝙈𝙉𝙊𝙋𝙌𝙍𝙎𝙏𝙐𝙑𝙒𝙓𝙔𝙕𝙖𝙗𝙘𝙙𝙚𝙛𝙜𝙝𝙞𝙟𝙠𝙡𝙢𝙣𝙤𝙥𝙦𝙧𝙨𝙩𝙪𝙫𝙬𝙭𝙮𝙯';

function translate(str, alpha1, alpha2) {
  const [regex1, regex2] = [alpha1, alpha2].map(a => new RegExp(`[${a}]`, 'gu'));
  const [regex, from, to] = str.match(regex1) ? [regex1, alpha1, [...alpha2]] : [regex2, alpha2, [...alpha1]];
  const map = [...from].reduce((a, b, c) => ({ ...a, [b]: to[c] }), {});
  return str.replaceAll(regex, (c) => map[c]);
}

document.body.addEventListener('keyup', (e) => {
  const target = e.target;

  if (!target.matches('input, textarea'))
    return;

  if (e.ctrlKey && (e.key == 'i' || e.key == 'b')) {
    const start = target.selectionStart;
    const end = target.selectionEnd;

    const before = target.value.substr(0, start);
    let selection = target.value.substr(start, end - start);
    const after = target.value.substr(end);

    selection = selection.normalize('NFD');
    if (e.key == 'i') {
      selection = translate(selection, regular + bold, italic + boldItalic);
    } else if (e.key == 'b') {
      selection = translate(selection, regular + italic, bold + boldItalic);
    }
    selection = selection.normalize('NFC');

    target.value = `${before}${selection}${after}`;
    target.selectionStart = start;
    target.selectionEnd = start + selection.length;

    e.preventDefault();
    e.stopPropagation();
  }
});

document.body.addEventListener('keydown', (e) => {
  const target = e.target;

  if (!target.matches('input, textarea'))
    return;

  if (e.ctrlKey && (e.key == 'i' || e.key == 'b')) {
    e.preventDefault();
    e.stopPropagation();
  }
});
