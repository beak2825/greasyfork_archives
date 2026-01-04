// ==UserScript==
// @name         思源再提醒
// @namespace    npm/vite-plugin-monkey
// @version      1.0.3
// @author       monkey
// @description  为思源笔记添加再提醒功能
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @homepage     https://github.com/2234839/siyuan-reminder
// @match        *://*
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.prod.js
// @grant        GM.registerMenuCommand
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/513405/%E6%80%9D%E6%BA%90%E5%86%8D%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/513405/%E6%80%9D%E6%BA%90%E5%86%8D%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const t=document.createElement("style");t.textContent=o,document.head.append(t)})(" .c-block[data-v-b5b3660c]{border-bottom:solid #ccc 1px;display:flex}.c[data-v-c3481be8]{position:fixed;top:0;left:50vw;background-color:#faebd7;transform:translate(-50%);padding:0 10px;border-radius:0 0 10px 10px;color:#333}.c-list[data-v-c3481be8]{position:absolute;transform:translate(-50%);background-color:#faebd7;max-height:80vh;min-width:400px;overflow-y:auto;padding:5px 10px;border-radius:10px}.c-list[data-v-89518ebf]{position:absolute;transform:translate(-50%);background-color:#faebd7;max-height:80vh;min-width:400px;overflow-y:auto;padding:5px 10px;border-radius:10px;color:#333;z-index:9999} ");

(function (vue) {
  'use strict';

  var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const gm_ref = (store_key2, value) => {
    const _value = _GM_getValue(store_key2, value);
    const _ref = vue.ref(_value);
    vue.watchEffect(() => {
      _GM_setValue(store_key2, _ref.value);
    });
    return _ref;
  };
  const store_key = "gm_reminder";
  const server = gm_ref(store_key + "server", "http://127.0.0.1:6806");
  const token$1 = gm_ref(store_key + "token", "");
  const protocol = gm_ref(store_key + "protocol", "siyuan");
  const queryWebContent = gm_ref(store_key + "protoqueryWebContentcol", false);
  const config = vue.reactive({
    server,
    token: token$1,
    protocol,
    /** 是否解析正文内容 */
    queryWebContent
  });
  async function sql(stmt) {
    return new Promise((resolve, reject) => {
      _GM.xmlHttpRequest({
        method: "POST",
        url: `${config.server}/api/query/sql`,
        data: JSON.stringify({ stmt }),
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Token ${config.token}`
        },
        onload(event) {
          resolve(JSON.parse(event.responseText));
        },
        onerror(event) {
          reject(event);
        }
      });
    });
  }
  const pageUrl = new URL(location.href);
  const anchorLinks = vue.reactive(/* @__PURE__ */ new Set());
  async function 链接再提醒() {
    setInterval(() => {
      document.querySelectorAll("a").forEach((anchor) => {
        anchorLinks.add(anchor.href);
      });
    }, 1e3);
  }
  链接再提醒();
  vue.watch(
    anchorLinks,
    (value, oldValue) => {
      console.log("[value]", value);
    },
    { deep: true }
  );
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
  function getAugmentedNamespace(n) {
    if (Object.prototype.hasOwnProperty.call(n, "__esModule")) return n;
    var f = n.default;
    if (typeof f == "function") {
      var a = function a2() {
        if (this instanceof a2) {
          return Reflect.construct(f, arguments, this.constructor);
        }
        return f.apply(this, arguments);
      };
      a.prototype = f.prototype;
    } else a = {};
    Object.defineProperty(a, "__esModule", { value: true });
    Object.keys(n).forEach(function(k) {
      var d = Object.getOwnPropertyDescriptor(n, k);
      Object.defineProperty(a, k, d.get ? d : {
        enumerable: true,
        get: function() {
          return n[k];
        }
      });
    });
    return a;
  }
  var utils = {};
  const Aacute = "Á";
  const aacute = "á";
  const Abreve = "Ă";
  const abreve = "ă";
  const ac = "∾";
  const acd = "∿";
  const acE = "∾̳";
  const Acirc = "Â";
  const acirc = "â";
  const acute = "´";
  const Acy = "А";
  const acy = "а";
  const AElig = "Æ";
  const aelig = "æ";
  const af = "⁡";
  const Afr = "𝔄";
  const afr = "𝔞";
  const Agrave = "À";
  const agrave = "à";
  const alefsym = "ℵ";
  const aleph = "ℵ";
  const Alpha = "Α";
  const alpha = "α";
  const Amacr = "Ā";
  const amacr = "ā";
  const amalg = "⨿";
  const amp = "&";
  const AMP = "&";
  const andand = "⩕";
  const And = "⩓";
  const and = "∧";
  const andd = "⩜";
  const andslope = "⩘";
  const andv = "⩚";
  const ang = "∠";
  const ange = "⦤";
  const angle = "∠";
  const angmsdaa = "⦨";
  const angmsdab = "⦩";
  const angmsdac = "⦪";
  const angmsdad = "⦫";
  const angmsdae = "⦬";
  const angmsdaf = "⦭";
  const angmsdag = "⦮";
  const angmsdah = "⦯";
  const angmsd = "∡";
  const angrt = "∟";
  const angrtvb = "⊾";
  const angrtvbd = "⦝";
  const angsph = "∢";
  const angst = "Å";
  const angzarr = "⍼";
  const Aogon = "Ą";
  const aogon = "ą";
  const Aopf = "𝔸";
  const aopf = "𝕒";
  const apacir = "⩯";
  const ap = "≈";
  const apE = "⩰";
  const ape = "≊";
  const apid = "≋";
  const apos = "'";
  const ApplyFunction = "⁡";
  const approx = "≈";
  const approxeq = "≊";
  const Aring = "Å";
  const aring = "å";
  const Ascr = "𝒜";
  const ascr = "𝒶";
  const Assign = "≔";
  const ast = "*";
  const asymp = "≈";
  const asympeq = "≍";
  const Atilde = "Ã";
  const atilde = "ã";
  const Auml = "Ä";
  const auml = "ä";
  const awconint = "∳";
  const awint = "⨑";
  const backcong = "≌";
  const backepsilon = "϶";
  const backprime = "‵";
  const backsim = "∽";
  const backsimeq = "⋍";
  const Backslash = "∖";
  const Barv = "⫧";
  const barvee = "⊽";
  const barwed = "⌅";
  const Barwed = "⌆";
  const barwedge = "⌅";
  const bbrk = "⎵";
  const bbrktbrk = "⎶";
  const bcong = "≌";
  const Bcy = "Б";
  const bcy = "б";
  const bdquo = "„";
  const becaus = "∵";
  const because = "∵";
  const Because = "∵";
  const bemptyv = "⦰";
  const bepsi = "϶";
  const bernou = "ℬ";
  const Bernoullis = "ℬ";
  const Beta = "Β";
  const beta = "β";
  const beth = "ℶ";
  const between = "≬";
  const Bfr = "𝔅";
  const bfr = "𝔟";
  const bigcap = "⋂";
  const bigcirc = "◯";
  const bigcup = "⋃";
  const bigodot = "⨀";
  const bigoplus = "⨁";
  const bigotimes = "⨂";
  const bigsqcup = "⨆";
  const bigstar = "★";
  const bigtriangledown = "▽";
  const bigtriangleup = "△";
  const biguplus = "⨄";
  const bigvee = "⋁";
  const bigwedge = "⋀";
  const bkarow = "⤍";
  const blacklozenge = "⧫";
  const blacksquare = "▪";
  const blacktriangle = "▴";
  const blacktriangledown = "▾";
  const blacktriangleleft = "◂";
  const blacktriangleright = "▸";
  const blank = "␣";
  const blk12 = "▒";
  const blk14 = "░";
  const blk34 = "▓";
  const block$1 = "█";
  const bne = "=⃥";
  const bnequiv = "≡⃥";
  const bNot = "⫭";
  const bnot = "⌐";
  const Bopf = "𝔹";
  const bopf = "𝕓";
  const bot = "⊥";
  const bottom = "⊥";
  const bowtie = "⋈";
  const boxbox = "⧉";
  const boxdl = "┐";
  const boxdL = "╕";
  const boxDl = "╖";
  const boxDL = "╗";
  const boxdr = "┌";
  const boxdR = "╒";
  const boxDr = "╓";
  const boxDR = "╔";
  const boxh = "─";
  const boxH = "═";
  const boxhd = "┬";
  const boxHd = "╤";
  const boxhD = "╥";
  const boxHD = "╦";
  const boxhu = "┴";
  const boxHu = "╧";
  const boxhU = "╨";
  const boxHU = "╩";
  const boxminus = "⊟";
  const boxplus = "⊞";
  const boxtimes = "⊠";
  const boxul = "┘";
  const boxuL = "╛";
  const boxUl = "╜";
  const boxUL = "╝";
  const boxur = "└";
  const boxuR = "╘";
  const boxUr = "╙";
  const boxUR = "╚";
  const boxv = "│";
  const boxV = "║";
  const boxvh = "┼";
  const boxvH = "╪";
  const boxVh = "╫";
  const boxVH = "╬";
  const boxvl = "┤";
  const boxvL = "╡";
  const boxVl = "╢";
  const boxVL = "╣";
  const boxvr = "├";
  const boxvR = "╞";
  const boxVr = "╟";
  const boxVR = "╠";
  const bprime = "‵";
  const breve = "˘";
  const Breve = "˘";
  const brvbar = "¦";
  const bscr = "𝒷";
  const Bscr = "ℬ";
  const bsemi = "⁏";
  const bsim = "∽";
  const bsime = "⋍";
  const bsolb = "⧅";
  const bsol = "\\";
  const bsolhsub = "⟈";
  const bull = "•";
  const bullet = "•";
  const bump = "≎";
  const bumpE = "⪮";
  const bumpe = "≏";
  const Bumpeq = "≎";
  const bumpeq = "≏";
  const Cacute = "Ć";
  const cacute = "ć";
  const capand = "⩄";
  const capbrcup = "⩉";
  const capcap = "⩋";
  const cap = "∩";
  const Cap = "⋒";
  const capcup = "⩇";
  const capdot = "⩀";
  const CapitalDifferentialD = "ⅅ";
  const caps = "∩︀";
  const caret = "⁁";
  const caron = "ˇ";
  const Cayleys = "ℭ";
  const ccaps = "⩍";
  const Ccaron = "Č";
  const ccaron = "č";
  const Ccedil = "Ç";
  const ccedil = "ç";
  const Ccirc = "Ĉ";
  const ccirc = "ĉ";
  const Cconint = "∰";
  const ccups = "⩌";
  const ccupssm = "⩐";
  const Cdot = "Ċ";
  const cdot = "ċ";
  const cedil = "¸";
  const Cedilla = "¸";
  const cemptyv = "⦲";
  const cent = "¢";
  const centerdot = "·";
  const CenterDot = "·";
  const cfr = "𝔠";
  const Cfr = "ℭ";
  const CHcy = "Ч";
  const chcy = "ч";
  const check = "✓";
  const checkmark = "✓";
  const Chi = "Χ";
  const chi = "χ";
  const circ = "ˆ";
  const circeq = "≗";
  const circlearrowleft = "↺";
  const circlearrowright = "↻";
  const circledast = "⊛";
  const circledcirc = "⊚";
  const circleddash = "⊝";
  const CircleDot = "⊙";
  const circledR = "®";
  const circledS = "Ⓢ";
  const CircleMinus = "⊖";
  const CirclePlus = "⊕";
  const CircleTimes = "⊗";
  const cir = "○";
  const cirE = "⧃";
  const cire = "≗";
  const cirfnint = "⨐";
  const cirmid = "⫯";
  const cirscir = "⧂";
  const ClockwiseContourIntegral = "∲";
  const CloseCurlyDoubleQuote = "”";
  const CloseCurlyQuote = "’";
  const clubs = "♣";
  const clubsuit = "♣";
  const colon = ":";
  const Colon = "∷";
  const Colone = "⩴";
  const colone = "≔";
  const coloneq = "≔";
  const comma = ",";
  const commat = "@";
  const comp = "∁";
  const compfn = "∘";
  const complement = "∁";
  const complexes = "ℂ";
  const cong = "≅";
  const congdot = "⩭";
  const Congruent = "≡";
  const conint = "∮";
  const Conint = "∯";
  const ContourIntegral = "∮";
  const copf = "𝕔";
  const Copf = "ℂ";
  const coprod = "∐";
  const Coproduct = "∐";
  const copy = "©";
  const COPY = "©";
  const copysr = "℗";
  const CounterClockwiseContourIntegral = "∳";
  const crarr = "↵";
  const cross = "✗";
  const Cross = "⨯";
  const Cscr = "𝒞";
  const cscr = "𝒸";
  const csub = "⫏";
  const csube = "⫑";
  const csup = "⫐";
  const csupe = "⫒";
  const ctdot = "⋯";
  const cudarrl = "⤸";
  const cudarrr = "⤵";
  const cuepr = "⋞";
  const cuesc = "⋟";
  const cularr = "↶";
  const cularrp = "⤽";
  const cupbrcap = "⩈";
  const cupcap = "⩆";
  const CupCap = "≍";
  const cup = "∪";
  const Cup = "⋓";
  const cupcup = "⩊";
  const cupdot = "⊍";
  const cupor = "⩅";
  const cups = "∪︀";
  const curarr = "↷";
  const curarrm = "⤼";
  const curlyeqprec = "⋞";
  const curlyeqsucc = "⋟";
  const curlyvee = "⋎";
  const curlywedge = "⋏";
  const curren = "¤";
  const curvearrowleft = "↶";
  const curvearrowright = "↷";
  const cuvee = "⋎";
  const cuwed = "⋏";
  const cwconint = "∲";
  const cwint = "∱";
  const cylcty = "⌭";
  const dagger = "†";
  const Dagger = "‡";
  const daleth = "ℸ";
  const darr = "↓";
  const Darr = "↡";
  const dArr = "⇓";
  const dash = "‐";
  const Dashv = "⫤";
  const dashv = "⊣";
  const dbkarow = "⤏";
  const dblac = "˝";
  const Dcaron = "Ď";
  const dcaron = "ď";
  const Dcy = "Д";
  const dcy = "д";
  const ddagger = "‡";
  const ddarr = "⇊";
  const DD = "ⅅ";
  const dd = "ⅆ";
  const DDotrahd = "⤑";
  const ddotseq = "⩷";
  const deg = "°";
  const Del = "∇";
  const Delta = "Δ";
  const delta = "δ";
  const demptyv = "⦱";
  const dfisht = "⥿";
  const Dfr = "𝔇";
  const dfr = "𝔡";
  const dHar = "⥥";
  const dharl = "⇃";
  const dharr = "⇂";
  const DiacriticalAcute = "´";
  const DiacriticalDot = "˙";
  const DiacriticalDoubleAcute = "˝";
  const DiacriticalGrave = "`";
  const DiacriticalTilde = "˜";
  const diam = "⋄";
  const diamond = "⋄";
  const Diamond = "⋄";
  const diamondsuit = "♦";
  const diams = "♦";
  const die = "¨";
  const DifferentialD = "ⅆ";
  const digamma = "ϝ";
  const disin = "⋲";
  const div = "÷";
  const divide = "÷";
  const divideontimes = "⋇";
  const divonx = "⋇";
  const DJcy = "Ђ";
  const djcy = "ђ";
  const dlcorn = "⌞";
  const dlcrop = "⌍";
  const dollar = "$";
  const Dopf = "𝔻";
  const dopf = "𝕕";
  const Dot = "¨";
  const dot = "˙";
  const DotDot = "⃜";
  const doteq = "≐";
  const doteqdot = "≑";
  const DotEqual = "≐";
  const dotminus = "∸";
  const dotplus = "∔";
  const dotsquare = "⊡";
  const doublebarwedge = "⌆";
  const DoubleContourIntegral = "∯";
  const DoubleDot = "¨";
  const DoubleDownArrow = "⇓";
  const DoubleLeftArrow = "⇐";
  const DoubleLeftRightArrow = "⇔";
  const DoubleLeftTee = "⫤";
  const DoubleLongLeftArrow = "⟸";
  const DoubleLongLeftRightArrow = "⟺";
  const DoubleLongRightArrow = "⟹";
  const DoubleRightArrow = "⇒";
  const DoubleRightTee = "⊨";
  const DoubleUpArrow = "⇑";
  const DoubleUpDownArrow = "⇕";
  const DoubleVerticalBar = "∥";
  const DownArrowBar = "⤓";
  const downarrow = "↓";
  const DownArrow = "↓";
  const Downarrow = "⇓";
  const DownArrowUpArrow = "⇵";
  const DownBreve = "̑";
  const downdownarrows = "⇊";
  const downharpoonleft = "⇃";
  const downharpoonright = "⇂";
  const DownLeftRightVector = "⥐";
  const DownLeftTeeVector = "⥞";
  const DownLeftVectorBar = "⥖";
  const DownLeftVector = "↽";
  const DownRightTeeVector = "⥟";
  const DownRightVectorBar = "⥗";
  const DownRightVector = "⇁";
  const DownTeeArrow = "↧";
  const DownTee = "⊤";
  const drbkarow = "⤐";
  const drcorn = "⌟";
  const drcrop = "⌌";
  const Dscr = "𝒟";
  const dscr = "𝒹";
  const DScy = "Ѕ";
  const dscy = "ѕ";
  const dsol = "⧶";
  const Dstrok = "Đ";
  const dstrok = "đ";
  const dtdot = "⋱";
  const dtri = "▿";
  const dtrif = "▾";
  const duarr = "⇵";
  const duhar = "⥯";
  const dwangle = "⦦";
  const DZcy = "Џ";
  const dzcy = "џ";
  const dzigrarr = "⟿";
  const Eacute = "É";
  const eacute = "é";
  const easter = "⩮";
  const Ecaron = "Ě";
  const ecaron = "ě";
  const Ecirc = "Ê";
  const ecirc = "ê";
  const ecir = "≖";
  const ecolon = "≕";
  const Ecy = "Э";
  const ecy = "э";
  const eDDot = "⩷";
  const Edot = "Ė";
  const edot = "ė";
  const eDot = "≑";
  const ee = "ⅇ";
  const efDot = "≒";
  const Efr = "𝔈";
  const efr = "𝔢";
  const eg = "⪚";
  const Egrave = "È";
  const egrave = "è";
  const egs = "⪖";
  const egsdot = "⪘";
  const el = "⪙";
  const Element = "∈";
  const elinters = "⏧";
  const ell = "ℓ";
  const els = "⪕";
  const elsdot = "⪗";
  const Emacr = "Ē";
  const emacr = "ē";
  const empty = "∅";
  const emptyset = "∅";
  const EmptySmallSquare = "◻";
  const emptyv = "∅";
  const EmptyVerySmallSquare = "▫";
  const emsp13 = " ";
  const emsp14 = " ";
  const emsp = " ";
  const ENG = "Ŋ";
  const eng = "ŋ";
  const ensp = " ";
  const Eogon = "Ę";
  const eogon = "ę";
  const Eopf = "𝔼";
  const eopf = "𝕖";
  const epar = "⋕";
  const eparsl = "⧣";
  const eplus = "⩱";
  const epsi = "ε";
  const Epsilon = "Ε";
  const epsilon = "ε";
  const epsiv = "ϵ";
  const eqcirc = "≖";
  const eqcolon = "≕";
  const eqsim = "≂";
  const eqslantgtr = "⪖";
  const eqslantless = "⪕";
  const Equal = "⩵";
  const equals = "=";
  const EqualTilde = "≂";
  const equest = "≟";
  const Equilibrium = "⇌";
  const equiv = "≡";
  const equivDD = "⩸";
  const eqvparsl = "⧥";
  const erarr = "⥱";
  const erDot = "≓";
  const escr = "ℯ";
  const Escr = "ℰ";
  const esdot = "≐";
  const Esim = "⩳";
  const esim = "≂";
  const Eta = "Η";
  const eta = "η";
  const ETH = "Ð";
  const eth = "ð";
  const Euml = "Ë";
  const euml = "ë";
  const euro = "€";
  const excl = "!";
  const exist = "∃";
  const Exists = "∃";
  const expectation = "ℰ";
  const exponentiale = "ⅇ";
  const ExponentialE = "ⅇ";
  const fallingdotseq = "≒";
  const Fcy = "Ф";
  const fcy = "ф";
  const female = "♀";
  const ffilig = "ﬃ";
  const fflig = "ﬀ";
  const ffllig = "ﬄ";
  const Ffr = "𝔉";
  const ffr = "𝔣";
  const filig = "ﬁ";
  const FilledSmallSquare = "◼";
  const FilledVerySmallSquare = "▪";
  const fjlig = "fj";
  const flat = "♭";
  const fllig = "ﬂ";
  const fltns = "▱";
  const fnof = "ƒ";
  const Fopf = "𝔽";
  const fopf = "𝕗";
  const forall = "∀";
  const ForAll = "∀";
  const fork = "⋔";
  const forkv = "⫙";
  const Fouriertrf = "ℱ";
  const fpartint = "⨍";
  const frac12 = "½";
  const frac13 = "⅓";
  const frac14 = "¼";
  const frac15 = "⅕";
  const frac16 = "⅙";
  const frac18 = "⅛";
  const frac23 = "⅔";
  const frac25 = "⅖";
  const frac34 = "¾";
  const frac35 = "⅗";
  const frac38 = "⅜";
  const frac45 = "⅘";
  const frac56 = "⅚";
  const frac58 = "⅝";
  const frac78 = "⅞";
  const frasl = "⁄";
  const frown = "⌢";
  const fscr = "𝒻";
  const Fscr = "ℱ";
  const gacute = "ǵ";
  const Gamma = "Γ";
  const gamma = "γ";
  const Gammad = "Ϝ";
  const gammad = "ϝ";
  const gap = "⪆";
  const Gbreve = "Ğ";
  const gbreve = "ğ";
  const Gcedil = "Ģ";
  const Gcirc = "Ĝ";
  const gcirc = "ĝ";
  const Gcy = "Г";
  const gcy = "г";
  const Gdot = "Ġ";
  const gdot = "ġ";
  const ge = "≥";
  const gE = "≧";
  const gEl = "⪌";
  const gel = "⋛";
  const geq = "≥";
  const geqq = "≧";
  const geqslant = "⩾";
  const gescc = "⪩";
  const ges = "⩾";
  const gesdot = "⪀";
  const gesdoto = "⪂";
  const gesdotol = "⪄";
  const gesl = "⋛︀";
  const gesles = "⪔";
  const Gfr = "𝔊";
  const gfr = "𝔤";
  const gg = "≫";
  const Gg = "⋙";
  const ggg = "⋙";
  const gimel = "ℷ";
  const GJcy = "Ѓ";
  const gjcy = "ѓ";
  const gla = "⪥";
  const gl = "≷";
  const glE = "⪒";
  const glj = "⪤";
  const gnap = "⪊";
  const gnapprox = "⪊";
  const gne = "⪈";
  const gnE = "≩";
  const gneq = "⪈";
  const gneqq = "≩";
  const gnsim = "⋧";
  const Gopf = "𝔾";
  const gopf = "𝕘";
  const grave = "`";
  const GreaterEqual = "≥";
  const GreaterEqualLess = "⋛";
  const GreaterFullEqual = "≧";
  const GreaterGreater = "⪢";
  const GreaterLess = "≷";
  const GreaterSlantEqual = "⩾";
  const GreaterTilde = "≳";
  const Gscr = "𝒢";
  const gscr = "ℊ";
  const gsim = "≳";
  const gsime = "⪎";
  const gsiml = "⪐";
  const gtcc = "⪧";
  const gtcir = "⩺";
  const gt = ">";
  const GT = ">";
  const Gt = "≫";
  const gtdot = "⋗";
  const gtlPar = "⦕";
  const gtquest = "⩼";
  const gtrapprox = "⪆";
  const gtrarr = "⥸";
  const gtrdot = "⋗";
  const gtreqless = "⋛";
  const gtreqqless = "⪌";
  const gtrless = "≷";
  const gtrsim = "≳";
  const gvertneqq = "≩︀";
  const gvnE = "≩︀";
  const Hacek = "ˇ";
  const hairsp = " ";
  const half = "½";
  const hamilt = "ℋ";
  const HARDcy = "Ъ";
  const hardcy = "ъ";
  const harrcir = "⥈";
  const harr = "↔";
  const hArr = "⇔";
  const harrw = "↭";
  const Hat = "^";
  const hbar = "ℏ";
  const Hcirc = "Ĥ";
  const hcirc = "ĥ";
  const hearts = "♥";
  const heartsuit = "♥";
  const hellip = "…";
  const hercon = "⊹";
  const hfr = "𝔥";
  const Hfr = "ℌ";
  const HilbertSpace = "ℋ";
  const hksearow = "⤥";
  const hkswarow = "⤦";
  const hoarr = "⇿";
  const homtht = "∻";
  const hookleftarrow = "↩";
  const hookrightarrow = "↪";
  const hopf = "𝕙";
  const Hopf = "ℍ";
  const horbar = "―";
  const HorizontalLine = "─";
  const hscr = "𝒽";
  const Hscr = "ℋ";
  const hslash = "ℏ";
  const Hstrok = "Ħ";
  const hstrok = "ħ";
  const HumpDownHump = "≎";
  const HumpEqual = "≏";
  const hybull = "⁃";
  const hyphen = "‐";
  const Iacute = "Í";
  const iacute = "í";
  const ic = "⁣";
  const Icirc = "Î";
  const icirc = "î";
  const Icy = "И";
  const icy = "и";
  const Idot = "İ";
  const IEcy = "Е";
  const iecy = "е";
  const iexcl = "¡";
  const iff = "⇔";
  const ifr = "𝔦";
  const Ifr = "ℑ";
  const Igrave = "Ì";
  const igrave = "ì";
  const ii = "ⅈ";
  const iiiint = "⨌";
  const iiint = "∭";
  const iinfin = "⧜";
  const iiota = "℩";
  const IJlig = "Ĳ";
  const ijlig = "ĳ";
  const Imacr = "Ī";
  const imacr = "ī";
  const image$1 = "ℑ";
  const ImaginaryI = "ⅈ";
  const imagline = "ℐ";
  const imagpart = "ℑ";
  const imath = "ı";
  const Im = "ℑ";
  const imof = "⊷";
  const imped = "Ƶ";
  const Implies = "⇒";
  const incare = "℅";
  const infin = "∞";
  const infintie = "⧝";
  const inodot = "ı";
  const intcal = "⊺";
  const int = "∫";
  const Int = "∬";
  const integers = "ℤ";
  const Integral = "∫";
  const intercal = "⊺";
  const Intersection = "⋂";
  const intlarhk = "⨗";
  const intprod = "⨼";
  const InvisibleComma = "⁣";
  const InvisibleTimes = "⁢";
  const IOcy = "Ё";
  const iocy = "ё";
  const Iogon = "Į";
  const iogon = "į";
  const Iopf = "𝕀";
  const iopf = "𝕚";
  const Iota = "Ι";
  const iota = "ι";
  const iprod = "⨼";
  const iquest = "¿";
  const iscr = "𝒾";
  const Iscr = "ℐ";
  const isin = "∈";
  const isindot = "⋵";
  const isinE = "⋹";
  const isins = "⋴";
  const isinsv = "⋳";
  const isinv = "∈";
  const it = "⁢";
  const Itilde = "Ĩ";
  const itilde = "ĩ";
  const Iukcy = "І";
  const iukcy = "і";
  const Iuml = "Ï";
  const iuml = "ï";
  const Jcirc = "Ĵ";
  const jcirc = "ĵ";
  const Jcy = "Й";
  const jcy = "й";
  const Jfr = "𝔍";
  const jfr = "𝔧";
  const jmath = "ȷ";
  const Jopf = "𝕁";
  const jopf = "𝕛";
  const Jscr = "𝒥";
  const jscr = "𝒿";
  const Jsercy = "Ј";
  const jsercy = "ј";
  const Jukcy = "Є";
  const jukcy = "є";
  const Kappa = "Κ";
  const kappa = "κ";
  const kappav = "ϰ";
  const Kcedil = "Ķ";
  const kcedil = "ķ";
  const Kcy = "К";
  const kcy = "к";
  const Kfr = "𝔎";
  const kfr = "𝔨";
  const kgreen = "ĸ";
  const KHcy = "Х";
  const khcy = "х";
  const KJcy = "Ќ";
  const kjcy = "ќ";
  const Kopf = "𝕂";
  const kopf = "𝕜";
  const Kscr = "𝒦";
  const kscr = "𝓀";
  const lAarr = "⇚";
  const Lacute = "Ĺ";
  const lacute = "ĺ";
  const laemptyv = "⦴";
  const lagran = "ℒ";
  const Lambda = "Λ";
  const lambda = "λ";
  const lang = "⟨";
  const Lang = "⟪";
  const langd = "⦑";
  const langle = "⟨";
  const lap = "⪅";
  const Laplacetrf = "ℒ";
  const laquo = "«";
  const larrb = "⇤";
  const larrbfs = "⤟";
  const larr = "←";
  const Larr = "↞";
  const lArr = "⇐";
  const larrfs = "⤝";
  const larrhk = "↩";
  const larrlp = "↫";
  const larrpl = "⤹";
  const larrsim = "⥳";
  const larrtl = "↢";
  const latail = "⤙";
  const lAtail = "⤛";
  const lat = "⪫";
  const late = "⪭";
  const lates = "⪭︀";
  const lbarr = "⤌";
  const lBarr = "⤎";
  const lbbrk = "❲";
  const lbrace = "{";
  const lbrack = "[";
  const lbrke = "⦋";
  const lbrksld = "⦏";
  const lbrkslu = "⦍";
  const Lcaron = "Ľ";
  const lcaron = "ľ";
  const Lcedil = "Ļ";
  const lcedil = "ļ";
  const lceil = "⌈";
  const lcub = "{";
  const Lcy = "Л";
  const lcy = "л";
  const ldca = "⤶";
  const ldquo = "“";
  const ldquor = "„";
  const ldrdhar = "⥧";
  const ldrushar = "⥋";
  const ldsh = "↲";
  const le = "≤";
  const lE = "≦";
  const LeftAngleBracket = "⟨";
  const LeftArrowBar = "⇤";
  const leftarrow = "←";
  const LeftArrow = "←";
  const Leftarrow = "⇐";
  const LeftArrowRightArrow = "⇆";
  const leftarrowtail = "↢";
  const LeftCeiling = "⌈";
  const LeftDoubleBracket = "⟦";
  const LeftDownTeeVector = "⥡";
  const LeftDownVectorBar = "⥙";
  const LeftDownVector = "⇃";
  const LeftFloor = "⌊";
  const leftharpoondown = "↽";
  const leftharpoonup = "↼";
  const leftleftarrows = "⇇";
  const leftrightarrow = "↔";
  const LeftRightArrow = "↔";
  const Leftrightarrow = "⇔";
  const leftrightarrows = "⇆";
  const leftrightharpoons = "⇋";
  const leftrightsquigarrow = "↭";
  const LeftRightVector = "⥎";
  const LeftTeeArrow = "↤";
  const LeftTee = "⊣";
  const LeftTeeVector = "⥚";
  const leftthreetimes = "⋋";
  const LeftTriangleBar = "⧏";
  const LeftTriangle = "⊲";
  const LeftTriangleEqual = "⊴";
  const LeftUpDownVector = "⥑";
  const LeftUpTeeVector = "⥠";
  const LeftUpVectorBar = "⥘";
  const LeftUpVector = "↿";
  const LeftVectorBar = "⥒";
  const LeftVector = "↼";
  const lEg = "⪋";
  const leg = "⋚";
  const leq = "≤";
  const leqq = "≦";
  const leqslant = "⩽";
  const lescc = "⪨";
  const les = "⩽";
  const lesdot = "⩿";
  const lesdoto = "⪁";
  const lesdotor = "⪃";
  const lesg = "⋚︀";
  const lesges = "⪓";
  const lessapprox = "⪅";
  const lessdot = "⋖";
  const lesseqgtr = "⋚";
  const lesseqqgtr = "⪋";
  const LessEqualGreater = "⋚";
  const LessFullEqual = "≦";
  const LessGreater = "≶";
  const lessgtr = "≶";
  const LessLess = "⪡";
  const lesssim = "≲";
  const LessSlantEqual = "⩽";
  const LessTilde = "≲";
  const lfisht = "⥼";
  const lfloor = "⌊";
  const Lfr = "𝔏";
  const lfr = "𝔩";
  const lg = "≶";
  const lgE = "⪑";
  const lHar = "⥢";
  const lhard = "↽";
  const lharu = "↼";
  const lharul = "⥪";
  const lhblk = "▄";
  const LJcy = "Љ";
  const ljcy = "љ";
  const llarr = "⇇";
  const ll = "≪";
  const Ll = "⋘";
  const llcorner = "⌞";
  const Lleftarrow = "⇚";
  const llhard = "⥫";
  const lltri = "◺";
  const Lmidot = "Ŀ";
  const lmidot = "ŀ";
  const lmoustache = "⎰";
  const lmoust = "⎰";
  const lnap = "⪉";
  const lnapprox = "⪉";
  const lne = "⪇";
  const lnE = "≨";
  const lneq = "⪇";
  const lneqq = "≨";
  const lnsim = "⋦";
  const loang = "⟬";
  const loarr = "⇽";
  const lobrk = "⟦";
  const longleftarrow = "⟵";
  const LongLeftArrow = "⟵";
  const Longleftarrow = "⟸";
  const longleftrightarrow = "⟷";
  const LongLeftRightArrow = "⟷";
  const Longleftrightarrow = "⟺";
  const longmapsto = "⟼";
  const longrightarrow = "⟶";
  const LongRightArrow = "⟶";
  const Longrightarrow = "⟹";
  const looparrowleft = "↫";
  const looparrowright = "↬";
  const lopar = "⦅";
  const Lopf = "𝕃";
  const lopf = "𝕝";
  const loplus = "⨭";
  const lotimes = "⨴";
  const lowast = "∗";
  const lowbar = "_";
  const LowerLeftArrow = "↙";
  const LowerRightArrow = "↘";
  const loz = "◊";
  const lozenge = "◊";
  const lozf = "⧫";
  const lpar = "(";
  const lparlt = "⦓";
  const lrarr = "⇆";
  const lrcorner = "⌟";
  const lrhar = "⇋";
  const lrhard = "⥭";
  const lrm = "‎";
  const lrtri = "⊿";
  const lsaquo = "‹";
  const lscr = "𝓁";
  const Lscr = "ℒ";
  const lsh = "↰";
  const Lsh = "↰";
  const lsim = "≲";
  const lsime = "⪍";
  const lsimg = "⪏";
  const lsqb = "[";
  const lsquo = "‘";
  const lsquor = "‚";
  const Lstrok = "Ł";
  const lstrok = "ł";
  const ltcc = "⪦";
  const ltcir = "⩹";
  const lt = "<";
  const LT = "<";
  const Lt = "≪";
  const ltdot = "⋖";
  const lthree = "⋋";
  const ltimes = "⋉";
  const ltlarr = "⥶";
  const ltquest = "⩻";
  const ltri = "◃";
  const ltrie = "⊴";
  const ltrif = "◂";
  const ltrPar = "⦖";
  const lurdshar = "⥊";
  const luruhar = "⥦";
  const lvertneqq = "≨︀";
  const lvnE = "≨︀";
  const macr = "¯";
  const male = "♂";
  const malt = "✠";
  const maltese = "✠";
  const map = "↦";
  const mapsto = "↦";
  const mapstodown = "↧";
  const mapstoleft = "↤";
  const mapstoup = "↥";
  const marker = "▮";
  const mcomma = "⨩";
  const Mcy = "М";
  const mcy = "м";
  const mdash = "—";
  const mDDot = "∺";
  const measuredangle = "∡";
  const MediumSpace = " ";
  const Mellintrf = "ℳ";
  const Mfr = "𝔐";
  const mfr = "𝔪";
  const mho = "℧";
  const micro = "µ";
  const midast = "*";
  const midcir = "⫰";
  const mid = "∣";
  const middot = "·";
  const minusb = "⊟";
  const minus = "−";
  const minusd = "∸";
  const minusdu = "⨪";
  const MinusPlus = "∓";
  const mlcp = "⫛";
  const mldr = "…";
  const mnplus = "∓";
  const models = "⊧";
  const Mopf = "𝕄";
  const mopf = "𝕞";
  const mp = "∓";
  const mscr = "𝓂";
  const Mscr = "ℳ";
  const mstpos = "∾";
  const Mu = "Μ";
  const mu = "μ";
  const multimap = "⊸";
  const mumap = "⊸";
  const nabla = "∇";
  const Nacute = "Ń";
  const nacute = "ń";
  const nang = "∠⃒";
  const nap = "≉";
  const napE = "⩰̸";
  const napid = "≋̸";
  const napos = "ŉ";
  const napprox = "≉";
  const natural = "♮";
  const naturals = "ℕ";
  const natur = "♮";
  const nbsp = " ";
  const nbump = "≎̸";
  const nbumpe = "≏̸";
  const ncap = "⩃";
  const Ncaron = "Ň";
  const ncaron = "ň";
  const Ncedil = "Ņ";
  const ncedil = "ņ";
  const ncong = "≇";
  const ncongdot = "⩭̸";
  const ncup = "⩂";
  const Ncy = "Н";
  const ncy = "н";
  const ndash = "–";
  const nearhk = "⤤";
  const nearr = "↗";
  const neArr = "⇗";
  const nearrow = "↗";
  const ne = "≠";
  const nedot = "≐̸";
  const NegativeMediumSpace = "​";
  const NegativeThickSpace = "​";
  const NegativeThinSpace = "​";
  const NegativeVeryThinSpace = "​";
  const nequiv = "≢";
  const nesear = "⤨";
  const nesim = "≂̸";
  const NestedGreaterGreater = "≫";
  const NestedLessLess = "≪";
  const NewLine = "\n";
  const nexist = "∄";
  const nexists = "∄";
  const Nfr = "𝔑";
  const nfr = "𝔫";
  const ngE = "≧̸";
  const nge = "≱";
  const ngeq = "≱";
  const ngeqq = "≧̸";
  const ngeqslant = "⩾̸";
  const nges = "⩾̸";
  const nGg = "⋙̸";
  const ngsim = "≵";
  const nGt = "≫⃒";
  const ngt = "≯";
  const ngtr = "≯";
  const nGtv = "≫̸";
  const nharr = "↮";
  const nhArr = "⇎";
  const nhpar = "⫲";
  const ni = "∋";
  const nis = "⋼";
  const nisd = "⋺";
  const niv = "∋";
  const NJcy = "Њ";
  const njcy = "њ";
  const nlarr = "↚";
  const nlArr = "⇍";
  const nldr = "‥";
  const nlE = "≦̸";
  const nle = "≰";
  const nleftarrow = "↚";
  const nLeftarrow = "⇍";
  const nleftrightarrow = "↮";
  const nLeftrightarrow = "⇎";
  const nleq = "≰";
  const nleqq = "≦̸";
  const nleqslant = "⩽̸";
  const nles = "⩽̸";
  const nless = "≮";
  const nLl = "⋘̸";
  const nlsim = "≴";
  const nLt = "≪⃒";
  const nlt = "≮";
  const nltri = "⋪";
  const nltrie = "⋬";
  const nLtv = "≪̸";
  const nmid = "∤";
  const NoBreak = "⁠";
  const NonBreakingSpace = " ";
  const nopf = "𝕟";
  const Nopf = "ℕ";
  const Not = "⫬";
  const not = "¬";
  const NotCongruent = "≢";
  const NotCupCap = "≭";
  const NotDoubleVerticalBar = "∦";
  const NotElement = "∉";
  const NotEqual = "≠";
  const NotEqualTilde = "≂̸";
  const NotExists = "∄";
  const NotGreater = "≯";
  const NotGreaterEqual = "≱";
  const NotGreaterFullEqual = "≧̸";
  const NotGreaterGreater = "≫̸";
  const NotGreaterLess = "≹";
  const NotGreaterSlantEqual = "⩾̸";
  const NotGreaterTilde = "≵";
  const NotHumpDownHump = "≎̸";
  const NotHumpEqual = "≏̸";
  const notin = "∉";
  const notindot = "⋵̸";
  const notinE = "⋹̸";
  const notinva = "∉";
  const notinvb = "⋷";
  const notinvc = "⋶";
  const NotLeftTriangleBar = "⧏̸";
  const NotLeftTriangle = "⋪";
  const NotLeftTriangleEqual = "⋬";
  const NotLess = "≮";
  const NotLessEqual = "≰";
  const NotLessGreater = "≸";
  const NotLessLess = "≪̸";
  const NotLessSlantEqual = "⩽̸";
  const NotLessTilde = "≴";
  const NotNestedGreaterGreater = "⪢̸";
  const NotNestedLessLess = "⪡̸";
  const notni = "∌";
  const notniva = "∌";
  const notnivb = "⋾";
  const notnivc = "⋽";
  const NotPrecedes = "⊀";
  const NotPrecedesEqual = "⪯̸";
  const NotPrecedesSlantEqual = "⋠";
  const NotReverseElement = "∌";
  const NotRightTriangleBar = "⧐̸";
  const NotRightTriangle = "⋫";
  const NotRightTriangleEqual = "⋭";
  const NotSquareSubset = "⊏̸";
  const NotSquareSubsetEqual = "⋢";
  const NotSquareSuperset = "⊐̸";
  const NotSquareSupersetEqual = "⋣";
  const NotSubset = "⊂⃒";
  const NotSubsetEqual = "⊈";
  const NotSucceeds = "⊁";
  const NotSucceedsEqual = "⪰̸";
  const NotSucceedsSlantEqual = "⋡";
  const NotSucceedsTilde = "≿̸";
  const NotSuperset = "⊃⃒";
  const NotSupersetEqual = "⊉";
  const NotTilde = "≁";
  const NotTildeEqual = "≄";
  const NotTildeFullEqual = "≇";
  const NotTildeTilde = "≉";
  const NotVerticalBar = "∤";
  const nparallel = "∦";
  const npar = "∦";
  const nparsl = "⫽⃥";
  const npart = "∂̸";
  const npolint = "⨔";
  const npr = "⊀";
  const nprcue = "⋠";
  const nprec = "⊀";
  const npreceq = "⪯̸";
  const npre = "⪯̸";
  const nrarrc = "⤳̸";
  const nrarr = "↛";
  const nrArr = "⇏";
  const nrarrw = "↝̸";
  const nrightarrow = "↛";
  const nRightarrow = "⇏";
  const nrtri = "⋫";
  const nrtrie = "⋭";
  const nsc = "⊁";
  const nsccue = "⋡";
  const nsce = "⪰̸";
  const Nscr = "𝒩";
  const nscr = "𝓃";
  const nshortmid = "∤";
  const nshortparallel = "∦";
  const nsim = "≁";
  const nsime = "≄";
  const nsimeq = "≄";
  const nsmid = "∤";
  const nspar = "∦";
  const nsqsube = "⋢";
  const nsqsupe = "⋣";
  const nsub = "⊄";
  const nsubE = "⫅̸";
  const nsube = "⊈";
  const nsubset = "⊂⃒";
  const nsubseteq = "⊈";
  const nsubseteqq = "⫅̸";
  const nsucc = "⊁";
  const nsucceq = "⪰̸";
  const nsup = "⊅";
  const nsupE = "⫆̸";
  const nsupe = "⊉";
  const nsupset = "⊃⃒";
  const nsupseteq = "⊉";
  const nsupseteqq = "⫆̸";
  const ntgl = "≹";
  const Ntilde = "Ñ";
  const ntilde = "ñ";
  const ntlg = "≸";
  const ntriangleleft = "⋪";
  const ntrianglelefteq = "⋬";
  const ntriangleright = "⋫";
  const ntrianglerighteq = "⋭";
  const Nu = "Ν";
  const nu = "ν";
  const num = "#";
  const numero = "№";
  const numsp = " ";
  const nvap = "≍⃒";
  const nvdash = "⊬";
  const nvDash = "⊭";
  const nVdash = "⊮";
  const nVDash = "⊯";
  const nvge = "≥⃒";
  const nvgt = ">⃒";
  const nvHarr = "⤄";
  const nvinfin = "⧞";
  const nvlArr = "⤂";
  const nvle = "≤⃒";
  const nvlt = "<⃒";
  const nvltrie = "⊴⃒";
  const nvrArr = "⤃";
  const nvrtrie = "⊵⃒";
  const nvsim = "∼⃒";
  const nwarhk = "⤣";
  const nwarr = "↖";
  const nwArr = "⇖";
  const nwarrow = "↖";
  const nwnear = "⤧";
  const Oacute = "Ó";
  const oacute = "ó";
  const oast = "⊛";
  const Ocirc = "Ô";
  const ocirc = "ô";
  const ocir = "⊚";
  const Ocy = "О";
  const ocy = "о";
  const odash = "⊝";
  const Odblac = "Ő";
  const odblac = "ő";
  const odiv = "⨸";
  const odot = "⊙";
  const odsold = "⦼";
  const OElig = "Œ";
  const oelig = "œ";
  const ofcir = "⦿";
  const Ofr = "𝔒";
  const ofr = "𝔬";
  const ogon = "˛";
  const Ograve = "Ò";
  const ograve = "ò";
  const ogt = "⧁";
  const ohbar = "⦵";
  const ohm = "Ω";
  const oint = "∮";
  const olarr = "↺";
  const olcir = "⦾";
  const olcross = "⦻";
  const oline = "‾";
  const olt = "⧀";
  const Omacr = "Ō";
  const omacr = "ō";
  const Omega = "Ω";
  const omega = "ω";
  const Omicron = "Ο";
  const omicron = "ο";
  const omid = "⦶";
  const ominus = "⊖";
  const Oopf = "𝕆";
  const oopf = "𝕠";
  const opar = "⦷";
  const OpenCurlyDoubleQuote = "“";
  const OpenCurlyQuote = "‘";
  const operp = "⦹";
  const oplus = "⊕";
  const orarr = "↻";
  const Or = "⩔";
  const or = "∨";
  const ord = "⩝";
  const order = "ℴ";
  const orderof = "ℴ";
  const ordf = "ª";
  const ordm = "º";
  const origof = "⊶";
  const oror = "⩖";
  const orslope = "⩗";
  const orv = "⩛";
  const oS = "Ⓢ";
  const Oscr = "𝒪";
  const oscr = "ℴ";
  const Oslash = "Ø";
  const oslash = "ø";
  const osol = "⊘";
  const Otilde = "Õ";
  const otilde = "õ";
  const otimesas = "⨶";
  const Otimes = "⨷";
  const otimes = "⊗";
  const Ouml = "Ö";
  const ouml = "ö";
  const ovbar = "⌽";
  const OverBar = "‾";
  const OverBrace = "⏞";
  const OverBracket = "⎴";
  const OverParenthesis = "⏜";
  const para = "¶";
  const parallel = "∥";
  const par = "∥";
  const parsim = "⫳";
  const parsl = "⫽";
  const part = "∂";
  const PartialD = "∂";
  const Pcy = "П";
  const pcy = "п";
  const percnt = "%";
  const period = ".";
  const permil = "‰";
  const perp = "⊥";
  const pertenk = "‱";
  const Pfr = "𝔓";
  const pfr = "𝔭";
  const Phi = "Φ";
  const phi = "φ";
  const phiv = "ϕ";
  const phmmat = "ℳ";
  const phone = "☎";
  const Pi = "Π";
  const pi = "π";
  const pitchfork = "⋔";
  const piv = "ϖ";
  const planck = "ℏ";
  const planckh = "ℎ";
  const plankv = "ℏ";
  const plusacir = "⨣";
  const plusb = "⊞";
  const pluscir = "⨢";
  const plus = "+";
  const plusdo = "∔";
  const plusdu = "⨥";
  const pluse = "⩲";
  const PlusMinus = "±";
  const plusmn = "±";
  const plussim = "⨦";
  const plustwo = "⨧";
  const pm = "±";
  const Poincareplane = "ℌ";
  const pointint = "⨕";
  const popf = "𝕡";
  const Popf = "ℙ";
  const pound = "£";
  const prap = "⪷";
  const Pr = "⪻";
  const pr = "≺";
  const prcue = "≼";
  const precapprox = "⪷";
  const prec = "≺";
  const preccurlyeq = "≼";
  const Precedes = "≺";
  const PrecedesEqual = "⪯";
  const PrecedesSlantEqual = "≼";
  const PrecedesTilde = "≾";
  const preceq = "⪯";
  const precnapprox = "⪹";
  const precneqq = "⪵";
  const precnsim = "⋨";
  const pre = "⪯";
  const prE = "⪳";
  const precsim = "≾";
  const prime = "′";
  const Prime = "″";
  const primes = "ℙ";
  const prnap = "⪹";
  const prnE = "⪵";
  const prnsim = "⋨";
  const prod = "∏";
  const Product = "∏";
  const profalar = "⌮";
  const profline = "⌒";
  const profsurf = "⌓";
  const prop = "∝";
  const Proportional = "∝";
  const Proportion = "∷";
  const propto = "∝";
  const prsim = "≾";
  const prurel = "⊰";
  const Pscr = "𝒫";
  const pscr = "𝓅";
  const Psi = "Ψ";
  const psi = "ψ";
  const puncsp = " ";
  const Qfr = "𝔔";
  const qfr = "𝔮";
  const qint = "⨌";
  const qopf = "𝕢";
  const Qopf = "ℚ";
  const qprime = "⁗";
  const Qscr = "𝒬";
  const qscr = "𝓆";
  const quaternions = "ℍ";
  const quatint = "⨖";
  const quest = "?";
  const questeq = "≟";
  const quot = '"';
  const QUOT = '"';
  const rAarr = "⇛";
  const race = "∽̱";
  const Racute = "Ŕ";
  const racute = "ŕ";
  const radic = "√";
  const raemptyv = "⦳";
  const rang = "⟩";
  const Rang = "⟫";
  const rangd = "⦒";
  const range = "⦥";
  const rangle = "⟩";
  const raquo = "»";
  const rarrap = "⥵";
  const rarrb = "⇥";
  const rarrbfs = "⤠";
  const rarrc = "⤳";
  const rarr = "→";
  const Rarr = "↠";
  const rArr = "⇒";
  const rarrfs = "⤞";
  const rarrhk = "↪";
  const rarrlp = "↬";
  const rarrpl = "⥅";
  const rarrsim = "⥴";
  const Rarrtl = "⤖";
  const rarrtl = "↣";
  const rarrw = "↝";
  const ratail = "⤚";
  const rAtail = "⤜";
  const ratio = "∶";
  const rationals = "ℚ";
  const rbarr = "⤍";
  const rBarr = "⤏";
  const RBarr = "⤐";
  const rbbrk = "❳";
  const rbrace = "}";
  const rbrack = "]";
  const rbrke = "⦌";
  const rbrksld = "⦎";
  const rbrkslu = "⦐";
  const Rcaron = "Ř";
  const rcaron = "ř";
  const Rcedil = "Ŗ";
  const rcedil = "ŗ";
  const rceil = "⌉";
  const rcub = "}";
  const Rcy = "Р";
  const rcy = "р";
  const rdca = "⤷";
  const rdldhar = "⥩";
  const rdquo = "”";
  const rdquor = "”";
  const rdsh = "↳";
  const real = "ℜ";
  const realine = "ℛ";
  const realpart = "ℜ";
  const reals = "ℝ";
  const Re = "ℜ";
  const rect = "▭";
  const reg = "®";
  const REG = "®";
  const ReverseElement = "∋";
  const ReverseEquilibrium = "⇋";
  const ReverseUpEquilibrium = "⥯";
  const rfisht = "⥽";
  const rfloor = "⌋";
  const rfr = "𝔯";
  const Rfr = "ℜ";
  const rHar = "⥤";
  const rhard = "⇁";
  const rharu = "⇀";
  const rharul = "⥬";
  const Rho = "Ρ";
  const rho = "ρ";
  const rhov = "ϱ";
  const RightAngleBracket = "⟩";
  const RightArrowBar = "⇥";
  const rightarrow = "→";
  const RightArrow = "→";
  const Rightarrow = "⇒";
  const RightArrowLeftArrow = "⇄";
  const rightarrowtail = "↣";
  const RightCeiling = "⌉";
  const RightDoubleBracket = "⟧";
  const RightDownTeeVector = "⥝";
  const RightDownVectorBar = "⥕";
  const RightDownVector = "⇂";
  const RightFloor = "⌋";
  const rightharpoondown = "⇁";
  const rightharpoonup = "⇀";
  const rightleftarrows = "⇄";
  const rightleftharpoons = "⇌";
  const rightrightarrows = "⇉";
  const rightsquigarrow = "↝";
  const RightTeeArrow = "↦";
  const RightTee = "⊢";
  const RightTeeVector = "⥛";
  const rightthreetimes = "⋌";
  const RightTriangleBar = "⧐";
  const RightTriangle = "⊳";
  const RightTriangleEqual = "⊵";
  const RightUpDownVector = "⥏";
  const RightUpTeeVector = "⥜";
  const RightUpVectorBar = "⥔";
  const RightUpVector = "↾";
  const RightVectorBar = "⥓";
  const RightVector = "⇀";
  const ring = "˚";
  const risingdotseq = "≓";
  const rlarr = "⇄";
  const rlhar = "⇌";
  const rlm = "‏";
  const rmoustache = "⎱";
  const rmoust = "⎱";
  const rnmid = "⫮";
  const roang = "⟭";
  const roarr = "⇾";
  const robrk = "⟧";
  const ropar = "⦆";
  const ropf = "𝕣";
  const Ropf = "ℝ";
  const roplus = "⨮";
  const rotimes = "⨵";
  const RoundImplies = "⥰";
  const rpar = ")";
  const rpargt = "⦔";
  const rppolint = "⨒";
  const rrarr = "⇉";
  const Rrightarrow = "⇛";
  const rsaquo = "›";
  const rscr = "𝓇";
  const Rscr = "ℛ";
  const rsh = "↱";
  const Rsh = "↱";
  const rsqb = "]";
  const rsquo = "’";
  const rsquor = "’";
  const rthree = "⋌";
  const rtimes = "⋊";
  const rtri = "▹";
  const rtrie = "⊵";
  const rtrif = "▸";
  const rtriltri = "⧎";
  const RuleDelayed = "⧴";
  const ruluhar = "⥨";
  const rx = "℞";
  const Sacute = "Ś";
  const sacute = "ś";
  const sbquo = "‚";
  const scap = "⪸";
  const Scaron = "Š";
  const scaron = "š";
  const Sc = "⪼";
  const sc = "≻";
  const sccue = "≽";
  const sce = "⪰";
  const scE = "⪴";
  const Scedil = "Ş";
  const scedil = "ş";
  const Scirc = "Ŝ";
  const scirc = "ŝ";
  const scnap = "⪺";
  const scnE = "⪶";
  const scnsim = "⋩";
  const scpolint = "⨓";
  const scsim = "≿";
  const Scy = "С";
  const scy = "с";
  const sdotb = "⊡";
  const sdot = "⋅";
  const sdote = "⩦";
  const searhk = "⤥";
  const searr = "↘";
  const seArr = "⇘";
  const searrow = "↘";
  const sect = "§";
  const semi = ";";
  const seswar = "⤩";
  const setminus = "∖";
  const setmn = "∖";
  const sext = "✶";
  const Sfr = "𝔖";
  const sfr = "𝔰";
  const sfrown = "⌢";
  const sharp = "♯";
  const SHCHcy = "Щ";
  const shchcy = "щ";
  const SHcy = "Ш";
  const shcy = "ш";
  const ShortDownArrow = "↓";
  const ShortLeftArrow = "←";
  const shortmid = "∣";
  const shortparallel = "∥";
  const ShortRightArrow = "→";
  const ShortUpArrow = "↑";
  const shy = "­";
  const Sigma = "Σ";
  const sigma = "σ";
  const sigmaf = "ς";
  const sigmav = "ς";
  const sim = "∼";
  const simdot = "⩪";
  const sime = "≃";
  const simeq = "≃";
  const simg = "⪞";
  const simgE = "⪠";
  const siml = "⪝";
  const simlE = "⪟";
  const simne = "≆";
  const simplus = "⨤";
  const simrarr = "⥲";
  const slarr = "←";
  const SmallCircle = "∘";
  const smallsetminus = "∖";
  const smashp = "⨳";
  const smeparsl = "⧤";
  const smid = "∣";
  const smile = "⌣";
  const smt = "⪪";
  const smte = "⪬";
  const smtes = "⪬︀";
  const SOFTcy = "Ь";
  const softcy = "ь";
  const solbar = "⌿";
  const solb = "⧄";
  const sol = "/";
  const Sopf = "𝕊";
  const sopf = "𝕤";
  const spades = "♠";
  const spadesuit = "♠";
  const spar = "∥";
  const sqcap = "⊓";
  const sqcaps = "⊓︀";
  const sqcup = "⊔";
  const sqcups = "⊔︀";
  const Sqrt = "√";
  const sqsub = "⊏";
  const sqsube = "⊑";
  const sqsubset = "⊏";
  const sqsubseteq = "⊑";
  const sqsup = "⊐";
  const sqsupe = "⊒";
  const sqsupset = "⊐";
  const sqsupseteq = "⊒";
  const square = "□";
  const Square = "□";
  const SquareIntersection = "⊓";
  const SquareSubset = "⊏";
  const SquareSubsetEqual = "⊑";
  const SquareSuperset = "⊐";
  const SquareSupersetEqual = "⊒";
  const SquareUnion = "⊔";
  const squarf = "▪";
  const squ = "□";
  const squf = "▪";
  const srarr = "→";
  const Sscr = "𝒮";
  const sscr = "𝓈";
  const ssetmn = "∖";
  const ssmile = "⌣";
  const sstarf = "⋆";
  const Star = "⋆";
  const star = "☆";
  const starf = "★";
  const straightepsilon = "ϵ";
  const straightphi = "ϕ";
  const strns = "¯";
  const sub = "⊂";
  const Sub = "⋐";
  const subdot = "⪽";
  const subE = "⫅";
  const sube = "⊆";
  const subedot = "⫃";
  const submult = "⫁";
  const subnE = "⫋";
  const subne = "⊊";
  const subplus = "⪿";
  const subrarr = "⥹";
  const subset = "⊂";
  const Subset = "⋐";
  const subseteq = "⊆";
  const subseteqq = "⫅";
  const SubsetEqual = "⊆";
  const subsetneq = "⊊";
  const subsetneqq = "⫋";
  const subsim = "⫇";
  const subsub = "⫕";
  const subsup = "⫓";
  const succapprox = "⪸";
  const succ = "≻";
  const succcurlyeq = "≽";
  const Succeeds = "≻";
  const SucceedsEqual = "⪰";
  const SucceedsSlantEqual = "≽";
  const SucceedsTilde = "≿";
  const succeq = "⪰";
  const succnapprox = "⪺";
  const succneqq = "⪶";
  const succnsim = "⋩";
  const succsim = "≿";
  const SuchThat = "∋";
  const sum = "∑";
  const Sum = "∑";
  const sung = "♪";
  const sup1 = "¹";
  const sup2 = "²";
  const sup3 = "³";
  const sup = "⊃";
  const Sup = "⋑";
  const supdot = "⪾";
  const supdsub = "⫘";
  const supE = "⫆";
  const supe = "⊇";
  const supedot = "⫄";
  const Superset = "⊃";
  const SupersetEqual = "⊇";
  const suphsol = "⟉";
  const suphsub = "⫗";
  const suplarr = "⥻";
  const supmult = "⫂";
  const supnE = "⫌";
  const supne = "⊋";
  const supplus = "⫀";
  const supset = "⊃";
  const Supset = "⋑";
  const supseteq = "⊇";
  const supseteqq = "⫆";
  const supsetneq = "⊋";
  const supsetneqq = "⫌";
  const supsim = "⫈";
  const supsub = "⫔";
  const supsup = "⫖";
  const swarhk = "⤦";
  const swarr = "↙";
  const swArr = "⇙";
  const swarrow = "↙";
  const swnwar = "⤪";
  const szlig = "ß";
  const Tab = "	";
  const target = "⌖";
  const Tau = "Τ";
  const tau = "τ";
  const tbrk = "⎴";
  const Tcaron = "Ť";
  const tcaron = "ť";
  const Tcedil = "Ţ";
  const tcedil = "ţ";
  const Tcy = "Т";
  const tcy = "т";
  const tdot = "⃛";
  const telrec = "⌕";
  const Tfr = "𝔗";
  const tfr = "𝔱";
  const there4 = "∴";
  const therefore = "∴";
  const Therefore = "∴";
  const Theta = "Θ";
  const theta = "θ";
  const thetasym = "ϑ";
  const thetav = "ϑ";
  const thickapprox = "≈";
  const thicksim = "∼";
  const ThickSpace = "  ";
  const ThinSpace = " ";
  const thinsp = " ";
  const thkap = "≈";
  const thksim = "∼";
  const THORN = "Þ";
  const thorn = "þ";
  const tilde = "˜";
  const Tilde = "∼";
  const TildeEqual = "≃";
  const TildeFullEqual = "≅";
  const TildeTilde = "≈";
  const timesbar = "⨱";
  const timesb = "⊠";
  const times = "×";
  const timesd = "⨰";
  const tint = "∭";
  const toea = "⤨";
  const topbot = "⌶";
  const topcir = "⫱";
  const top = "⊤";
  const Topf = "𝕋";
  const topf = "𝕥";
  const topfork = "⫚";
  const tosa = "⤩";
  const tprime = "‴";
  const trade = "™";
  const TRADE = "™";
  const triangle = "▵";
  const triangledown = "▿";
  const triangleleft = "◃";
  const trianglelefteq = "⊴";
  const triangleq = "≜";
  const triangleright = "▹";
  const trianglerighteq = "⊵";
  const tridot = "◬";
  const trie = "≜";
  const triminus = "⨺";
  const TripleDot = "⃛";
  const triplus = "⨹";
  const trisb = "⧍";
  const tritime = "⨻";
  const trpezium = "⏢";
  const Tscr = "𝒯";
  const tscr = "𝓉";
  const TScy = "Ц";
  const tscy = "ц";
  const TSHcy = "Ћ";
  const tshcy = "ћ";
  const Tstrok = "Ŧ";
  const tstrok = "ŧ";
  const twixt = "≬";
  const twoheadleftarrow = "↞";
  const twoheadrightarrow = "↠";
  const Uacute = "Ú";
  const uacute = "ú";
  const uarr = "↑";
  const Uarr = "↟";
  const uArr = "⇑";
  const Uarrocir = "⥉";
  const Ubrcy = "Ў";
  const ubrcy = "ў";
  const Ubreve = "Ŭ";
  const ubreve = "ŭ";
  const Ucirc = "Û";
  const ucirc = "û";
  const Ucy = "У";
  const ucy = "у";
  const udarr = "⇅";
  const Udblac = "Ű";
  const udblac = "ű";
  const udhar = "⥮";
  const ufisht = "⥾";
  const Ufr = "𝔘";
  const ufr = "𝔲";
  const Ugrave = "Ù";
  const ugrave = "ù";
  const uHar = "⥣";
  const uharl = "↿";
  const uharr = "↾";
  const uhblk = "▀";
  const ulcorn = "⌜";
  const ulcorner = "⌜";
  const ulcrop = "⌏";
  const ultri = "◸";
  const Umacr = "Ū";
  const umacr = "ū";
  const uml = "¨";
  const UnderBar = "_";
  const UnderBrace = "⏟";
  const UnderBracket = "⎵";
  const UnderParenthesis = "⏝";
  const Union = "⋃";
  const UnionPlus = "⊎";
  const Uogon = "Ų";
  const uogon = "ų";
  const Uopf = "𝕌";
  const uopf = "𝕦";
  const UpArrowBar = "⤒";
  const uparrow = "↑";
  const UpArrow = "↑";
  const Uparrow = "⇑";
  const UpArrowDownArrow = "⇅";
  const updownarrow = "↕";
  const UpDownArrow = "↕";
  const Updownarrow = "⇕";
  const UpEquilibrium = "⥮";
  const upharpoonleft = "↿";
  const upharpoonright = "↾";
  const uplus = "⊎";
  const UpperLeftArrow = "↖";
  const UpperRightArrow = "↗";
  const upsi = "υ";
  const Upsi = "ϒ";
  const upsih = "ϒ";
  const Upsilon = "Υ";
  const upsilon = "υ";
  const UpTeeArrow = "↥";
  const UpTee = "⊥";
  const upuparrows = "⇈";
  const urcorn = "⌝";
  const urcorner = "⌝";
  const urcrop = "⌎";
  const Uring = "Ů";
  const uring = "ů";
  const urtri = "◹";
  const Uscr = "𝒰";
  const uscr = "𝓊";
  const utdot = "⋰";
  const Utilde = "Ũ";
  const utilde = "ũ";
  const utri = "▵";
  const utrif = "▴";
  const uuarr = "⇈";
  const Uuml = "Ü";
  const uuml = "ü";
  const uwangle = "⦧";
  const vangrt = "⦜";
  const varepsilon = "ϵ";
  const varkappa = "ϰ";
  const varnothing = "∅";
  const varphi = "ϕ";
  const varpi = "ϖ";
  const varpropto = "∝";
  const varr = "↕";
  const vArr = "⇕";
  const varrho = "ϱ";
  const varsigma = "ς";
  const varsubsetneq = "⊊︀";
  const varsubsetneqq = "⫋︀";
  const varsupsetneq = "⊋︀";
  const varsupsetneqq = "⫌︀";
  const vartheta = "ϑ";
  const vartriangleleft = "⊲";
  const vartriangleright = "⊳";
  const vBar = "⫨";
  const Vbar = "⫫";
  const vBarv = "⫩";
  const Vcy = "В";
  const vcy = "в";
  const vdash = "⊢";
  const vDash = "⊨";
  const Vdash = "⊩";
  const VDash = "⊫";
  const Vdashl = "⫦";
  const veebar = "⊻";
  const vee = "∨";
  const Vee = "⋁";
  const veeeq = "≚";
  const vellip = "⋮";
  const verbar = "|";
  const Verbar = "‖";
  const vert = "|";
  const Vert = "‖";
  const VerticalBar = "∣";
  const VerticalLine = "|";
  const VerticalSeparator = "❘";
  const VerticalTilde = "≀";
  const VeryThinSpace = " ";
  const Vfr = "𝔙";
  const vfr = "𝔳";
  const vltri = "⊲";
  const vnsub = "⊂⃒";
  const vnsup = "⊃⃒";
  const Vopf = "𝕍";
  const vopf = "𝕧";
  const vprop = "∝";
  const vrtri = "⊳";
  const Vscr = "𝒱";
  const vscr = "𝓋";
  const vsubnE = "⫋︀";
  const vsubne = "⊊︀";
  const vsupnE = "⫌︀";
  const vsupne = "⊋︀";
  const Vvdash = "⊪";
  const vzigzag = "⦚";
  const Wcirc = "Ŵ";
  const wcirc = "ŵ";
  const wedbar = "⩟";
  const wedge = "∧";
  const Wedge = "⋀";
  const wedgeq = "≙";
  const weierp = "℘";
  const Wfr = "𝔚";
  const wfr = "𝔴";
  const Wopf = "𝕎";
  const wopf = "𝕨";
  const wp = "℘";
  const wr = "≀";
  const wreath = "≀";
  const Wscr = "𝒲";
  const wscr = "𝓌";
  const xcap = "⋂";
  const xcirc = "◯";
  const xcup = "⋃";
  const xdtri = "▽";
  const Xfr = "𝔛";
  const xfr = "𝔵";
  const xharr = "⟷";
  const xhArr = "⟺";
  const Xi = "Ξ";
  const xi = "ξ";
  const xlarr = "⟵";
  const xlArr = "⟸";
  const xmap = "⟼";
  const xnis = "⋻";
  const xodot = "⨀";
  const Xopf = "𝕏";
  const xopf = "𝕩";
  const xoplus = "⨁";
  const xotime = "⨂";
  const xrarr = "⟶";
  const xrArr = "⟹";
  const Xscr = "𝒳";
  const xscr = "𝓍";
  const xsqcup = "⨆";
  const xuplus = "⨄";
  const xutri = "△";
  const xvee = "⋁";
  const xwedge = "⋀";
  const Yacute = "Ý";
  const yacute = "ý";
  const YAcy = "Я";
  const yacy = "я";
  const Ycirc = "Ŷ";
  const ycirc = "ŷ";
  const Ycy = "Ы";
  const ycy = "ы";
  const yen = "¥";
  const Yfr = "𝔜";
  const yfr = "𝔶";
  const YIcy = "Ї";
  const yicy = "ї";
  const Yopf = "𝕐";
  const yopf = "𝕪";
  const Yscr = "𝒴";
  const yscr = "𝓎";
  const YUcy = "Ю";
  const yucy = "ю";
  const yuml = "ÿ";
  const Yuml = "Ÿ";
  const Zacute = "Ź";
  const zacute = "ź";
  const Zcaron = "Ž";
  const zcaron = "ž";
  const Zcy = "З";
  const zcy = "з";
  const Zdot = "Ż";
  const zdot = "ż";
  const zeetrf = "ℨ";
  const ZeroWidthSpace = "​";
  const Zeta = "Ζ";
  const zeta = "ζ";
  const zfr = "𝔷";
  const Zfr = "ℨ";
  const ZHcy = "Ж";
  const zhcy = "ж";
  const zigrarr = "⇝";
  const zopf = "𝕫";
  const Zopf = "ℤ";
  const Zscr = "𝒵";
  const zscr = "𝓏";
  const zwj = "‍";
  const zwnj = "‌";
  const require$$0 = {
    Aacute,
    aacute,
    Abreve,
    abreve,
    ac,
    acd,
    acE,
    Acirc,
    acirc,
    acute,
    Acy,
    acy,
    AElig,
    aelig,
    af,
    Afr,
    afr,
    Agrave,
    agrave,
    alefsym,
    aleph,
    Alpha,
    alpha,
    Amacr,
    amacr,
    amalg,
    amp,
    AMP,
    andand,
    And,
    and,
    andd,
    andslope,
    andv,
    ang,
    ange,
    angle,
    angmsdaa,
    angmsdab,
    angmsdac,
    angmsdad,
    angmsdae,
    angmsdaf,
    angmsdag,
    angmsdah,
    angmsd,
    angrt,
    angrtvb,
    angrtvbd,
    angsph,
    angst,
    angzarr,
    Aogon,
    aogon,
    Aopf,
    aopf,
    apacir,
    ap,
    apE,
    ape,
    apid,
    apos,
    ApplyFunction,
    approx,
    approxeq,
    Aring,
    aring,
    Ascr,
    ascr,
    Assign,
    ast,
    asymp,
    asympeq,
    Atilde,
    atilde,
    Auml,
    auml,
    awconint,
    awint,
    backcong,
    backepsilon,
    backprime,
    backsim,
    backsimeq,
    Backslash,
    Barv,
    barvee,
    barwed,
    Barwed,
    barwedge,
    bbrk,
    bbrktbrk,
    bcong,
    Bcy,
    bcy,
    bdquo,
    becaus,
    because,
    Because,
    bemptyv,
    bepsi,
    bernou,
    Bernoullis,
    Beta,
    beta,
    beth,
    between,
    Bfr,
    bfr,
    bigcap,
    bigcirc,
    bigcup,
    bigodot,
    bigoplus,
    bigotimes,
    bigsqcup,
    bigstar,
    bigtriangledown,
    bigtriangleup,
    biguplus,
    bigvee,
    bigwedge,
    bkarow,
    blacklozenge,
    blacksquare,
    blacktriangle,
    blacktriangledown,
    blacktriangleleft,
    blacktriangleright,
    blank,
    blk12,
    blk14,
    blk34,
    block: block$1,
    bne,
    bnequiv,
    bNot,
    bnot,
    Bopf,
    bopf,
    bot,
    bottom,
    bowtie,
    boxbox,
    boxdl,
    boxdL,
    boxDl,
    boxDL,
    boxdr,
    boxdR,
    boxDr,
    boxDR,
    boxh,
    boxH,
    boxhd,
    boxHd,
    boxhD,
    boxHD,
    boxhu,
    boxHu,
    boxhU,
    boxHU,
    boxminus,
    boxplus,
    boxtimes,
    boxul,
    boxuL,
    boxUl,
    boxUL,
    boxur,
    boxuR,
    boxUr,
    boxUR,
    boxv,
    boxV,
    boxvh,
    boxvH,
    boxVh,
    boxVH,
    boxvl,
    boxvL,
    boxVl,
    boxVL,
    boxvr,
    boxvR,
    boxVr,
    boxVR,
    bprime,
    breve,
    Breve,
    brvbar,
    bscr,
    Bscr,
    bsemi,
    bsim,
    bsime,
    bsolb,
    bsol,
    bsolhsub,
    bull,
    bullet,
    bump,
    bumpE,
    bumpe,
    Bumpeq,
    bumpeq,
    Cacute,
    cacute,
    capand,
    capbrcup,
    capcap,
    cap,
    Cap,
    capcup,
    capdot,
    CapitalDifferentialD,
    caps,
    caret,
    caron,
    Cayleys,
    ccaps,
    Ccaron,
    ccaron,
    Ccedil,
    ccedil,
    Ccirc,
    ccirc,
    Cconint,
    ccups,
    ccupssm,
    Cdot,
    cdot,
    cedil,
    Cedilla,
    cemptyv,
    cent,
    centerdot,
    CenterDot,
    cfr,
    Cfr,
    CHcy,
    chcy,
    check,
    checkmark,
    Chi,
    chi,
    circ,
    circeq,
    circlearrowleft,
    circlearrowright,
    circledast,
    circledcirc,
    circleddash,
    CircleDot,
    circledR,
    circledS,
    CircleMinus,
    CirclePlus,
    CircleTimes,
    cir,
    cirE,
    cire,
    cirfnint,
    cirmid,
    cirscir,
    ClockwiseContourIntegral,
    CloseCurlyDoubleQuote,
    CloseCurlyQuote,
    clubs,
    clubsuit,
    colon,
    Colon,
    Colone,
    colone,
    coloneq,
    comma,
    commat,
    comp,
    compfn,
    complement,
    complexes,
    cong,
    congdot,
    Congruent,
    conint,
    Conint,
    ContourIntegral,
    copf,
    Copf,
    coprod,
    Coproduct,
    copy,
    COPY,
    copysr,
    CounterClockwiseContourIntegral,
    crarr,
    cross,
    Cross,
    Cscr,
    cscr,
    csub,
    csube,
    csup,
    csupe,
    ctdot,
    cudarrl,
    cudarrr,
    cuepr,
    cuesc,
    cularr,
    cularrp,
    cupbrcap,
    cupcap,
    CupCap,
    cup,
    Cup,
    cupcup,
    cupdot,
    cupor,
    cups,
    curarr,
    curarrm,
    curlyeqprec,
    curlyeqsucc,
    curlyvee,
    curlywedge,
    curren,
    curvearrowleft,
    curvearrowright,
    cuvee,
    cuwed,
    cwconint,
    cwint,
    cylcty,
    dagger,
    Dagger,
    daleth,
    darr,
    Darr,
    dArr,
    dash,
    Dashv,
    dashv,
    dbkarow,
    dblac,
    Dcaron,
    dcaron,
    Dcy,
    dcy,
    ddagger,
    ddarr,
    DD,
    dd,
    DDotrahd,
    ddotseq,
    deg,
    Del,
    Delta,
    delta,
    demptyv,
    dfisht,
    Dfr,
    dfr,
    dHar,
    dharl,
    dharr,
    DiacriticalAcute,
    DiacriticalDot,
    DiacriticalDoubleAcute,
    DiacriticalGrave,
    DiacriticalTilde,
    diam,
    diamond,
    Diamond,
    diamondsuit,
    diams,
    die,
    DifferentialD,
    digamma,
    disin,
    div,
    divide,
    divideontimes,
    divonx,
    DJcy,
    djcy,
    dlcorn,
    dlcrop,
    dollar,
    Dopf,
    dopf,
    Dot,
    dot,
    DotDot,
    doteq,
    doteqdot,
    DotEqual,
    dotminus,
    dotplus,
    dotsquare,
    doublebarwedge,
    DoubleContourIntegral,
    DoubleDot,
    DoubleDownArrow,
    DoubleLeftArrow,
    DoubleLeftRightArrow,
    DoubleLeftTee,
    DoubleLongLeftArrow,
    DoubleLongLeftRightArrow,
    DoubleLongRightArrow,
    DoubleRightArrow,
    DoubleRightTee,
    DoubleUpArrow,
    DoubleUpDownArrow,
    DoubleVerticalBar,
    DownArrowBar,
    downarrow,
    DownArrow,
    Downarrow,
    DownArrowUpArrow,
    DownBreve,
    downdownarrows,
    downharpoonleft,
    downharpoonright,
    DownLeftRightVector,
    DownLeftTeeVector,
    DownLeftVectorBar,
    DownLeftVector,
    DownRightTeeVector,
    DownRightVectorBar,
    DownRightVector,
    DownTeeArrow,
    DownTee,
    drbkarow,
    drcorn,
    drcrop,
    Dscr,
    dscr,
    DScy,
    dscy,
    dsol,
    Dstrok,
    dstrok,
    dtdot,
    dtri,
    dtrif,
    duarr,
    duhar,
    dwangle,
    DZcy,
    dzcy,
    dzigrarr,
    Eacute,
    eacute,
    easter,
    Ecaron,
    ecaron,
    Ecirc,
    ecirc,
    ecir,
    ecolon,
    Ecy,
    ecy,
    eDDot,
    Edot,
    edot,
    eDot,
    ee,
    efDot,
    Efr,
    efr,
    eg,
    Egrave,
    egrave,
    egs,
    egsdot,
    el,
    Element,
    elinters,
    ell,
    els,
    elsdot,
    Emacr,
    emacr,
    empty,
    emptyset,
    EmptySmallSquare,
    emptyv,
    EmptyVerySmallSquare,
    emsp13,
    emsp14,
    emsp,
    ENG,
    eng,
    ensp,
    Eogon,
    eogon,
    Eopf,
    eopf,
    epar,
    eparsl,
    eplus,
    epsi,
    Epsilon,
    epsilon,
    epsiv,
    eqcirc,
    eqcolon,
    eqsim,
    eqslantgtr,
    eqslantless,
    Equal,
    equals,
    EqualTilde,
    equest,
    Equilibrium,
    equiv,
    equivDD,
    eqvparsl,
    erarr,
    erDot,
    escr,
    Escr,
    esdot,
    Esim,
    esim,
    Eta,
    eta,
    ETH,
    eth,
    Euml,
    euml,
    euro,
    excl,
    exist,
    Exists,
    expectation,
    exponentiale,
    ExponentialE,
    fallingdotseq,
    Fcy,
    fcy,
    female,
    ffilig,
    fflig,
    ffllig,
    Ffr,
    ffr,
    filig,
    FilledSmallSquare,
    FilledVerySmallSquare,
    fjlig,
    flat,
    fllig,
    fltns,
    fnof,
    Fopf,
    fopf,
    forall,
    ForAll,
    fork,
    forkv,
    Fouriertrf,
    fpartint,
    frac12,
    frac13,
    frac14,
    frac15,
    frac16,
    frac18,
    frac23,
    frac25,
    frac34,
    frac35,
    frac38,
    frac45,
    frac56,
    frac58,
    frac78,
    frasl,
    frown,
    fscr,
    Fscr,
    gacute,
    Gamma,
    gamma,
    Gammad,
    gammad,
    gap,
    Gbreve,
    gbreve,
    Gcedil,
    Gcirc,
    gcirc,
    Gcy,
    gcy,
    Gdot,
    gdot,
    ge,
    gE,
    gEl,
    gel,
    geq,
    geqq,
    geqslant,
    gescc,
    ges,
    gesdot,
    gesdoto,
    gesdotol,
    gesl,
    gesles,
    Gfr,
    gfr,
    gg,
    Gg,
    ggg,
    gimel,
    GJcy,
    gjcy,
    gla,
    gl,
    glE,
    glj,
    gnap,
    gnapprox,
    gne,
    gnE,
    gneq,
    gneqq,
    gnsim,
    Gopf,
    gopf,
    grave,
    GreaterEqual,
    GreaterEqualLess,
    GreaterFullEqual,
    GreaterGreater,
    GreaterLess,
    GreaterSlantEqual,
    GreaterTilde,
    Gscr,
    gscr,
    gsim,
    gsime,
    gsiml,
    gtcc,
    gtcir,
    gt,
    GT,
    Gt,
    gtdot,
    gtlPar,
    gtquest,
    gtrapprox,
    gtrarr,
    gtrdot,
    gtreqless,
    gtreqqless,
    gtrless,
    gtrsim,
    gvertneqq,
    gvnE,
    Hacek,
    hairsp,
    half,
    hamilt,
    HARDcy,
    hardcy,
    harrcir,
    harr,
    hArr,
    harrw,
    Hat,
    hbar,
    Hcirc,
    hcirc,
    hearts,
    heartsuit,
    hellip,
    hercon,
    hfr,
    Hfr,
    HilbertSpace,
    hksearow,
    hkswarow,
    hoarr,
    homtht,
    hookleftarrow,
    hookrightarrow,
    hopf,
    Hopf,
    horbar,
    HorizontalLine,
    hscr,
    Hscr,
    hslash,
    Hstrok,
    hstrok,
    HumpDownHump,
    HumpEqual,
    hybull,
    hyphen,
    Iacute,
    iacute,
    ic,
    Icirc,
    icirc,
    Icy,
    icy,
    Idot,
    IEcy,
    iecy,
    iexcl,
    iff,
    ifr,
    Ifr,
    Igrave,
    igrave,
    ii,
    iiiint,
    iiint,
    iinfin,
    iiota,
    IJlig,
    ijlig,
    Imacr,
    imacr,
    image: image$1,
    ImaginaryI,
    imagline,
    imagpart,
    imath,
    Im,
    imof,
    imped,
    Implies,
    incare,
    "in": "∈",
    infin,
    infintie,
    inodot,
    intcal,
    int,
    Int,
    integers,
    Integral,
    intercal,
    Intersection,
    intlarhk,
    intprod,
    InvisibleComma,
    InvisibleTimes,
    IOcy,
    iocy,
    Iogon,
    iogon,
    Iopf,
    iopf,
    Iota,
    iota,
    iprod,
    iquest,
    iscr,
    Iscr,
    isin,
    isindot,
    isinE,
    isins,
    isinsv,
    isinv,
    it,
    Itilde,
    itilde,
    Iukcy,
    iukcy,
    Iuml,
    iuml,
    Jcirc,
    jcirc,
    Jcy,
    jcy,
    Jfr,
    jfr,
    jmath,
    Jopf,
    jopf,
    Jscr,
    jscr,
    Jsercy,
    jsercy,
    Jukcy,
    jukcy,
    Kappa,
    kappa,
    kappav,
    Kcedil,
    kcedil,
    Kcy,
    kcy,
    Kfr,
    kfr,
    kgreen,
    KHcy,
    khcy,
    KJcy,
    kjcy,
    Kopf,
    kopf,
    Kscr,
    kscr,
    lAarr,
    Lacute,
    lacute,
    laemptyv,
    lagran,
    Lambda,
    lambda,
    lang,
    Lang,
    langd,
    langle,
    lap,
    Laplacetrf,
    laquo,
    larrb,
    larrbfs,
    larr,
    Larr,
    lArr,
    larrfs,
    larrhk,
    larrlp,
    larrpl,
    larrsim,
    larrtl,
    latail,
    lAtail,
    lat,
    late,
    lates,
    lbarr,
    lBarr,
    lbbrk,
    lbrace,
    lbrack,
    lbrke,
    lbrksld,
    lbrkslu,
    Lcaron,
    lcaron,
    Lcedil,
    lcedil,
    lceil,
    lcub,
    Lcy,
    lcy,
    ldca,
    ldquo,
    ldquor,
    ldrdhar,
    ldrushar,
    ldsh,
    le,
    lE,
    LeftAngleBracket,
    LeftArrowBar,
    leftarrow,
    LeftArrow,
    Leftarrow,
    LeftArrowRightArrow,
    leftarrowtail,
    LeftCeiling,
    LeftDoubleBracket,
    LeftDownTeeVector,
    LeftDownVectorBar,
    LeftDownVector,
    LeftFloor,
    leftharpoondown,
    leftharpoonup,
    leftleftarrows,
    leftrightarrow,
    LeftRightArrow,
    Leftrightarrow,
    leftrightarrows,
    leftrightharpoons,
    leftrightsquigarrow,
    LeftRightVector,
    LeftTeeArrow,
    LeftTee,
    LeftTeeVector,
    leftthreetimes,
    LeftTriangleBar,
    LeftTriangle,
    LeftTriangleEqual,
    LeftUpDownVector,
    LeftUpTeeVector,
    LeftUpVectorBar,
    LeftUpVector,
    LeftVectorBar,
    LeftVector,
    lEg,
    leg,
    leq,
    leqq,
    leqslant,
    lescc,
    les,
    lesdot,
    lesdoto,
    lesdotor,
    lesg,
    lesges,
    lessapprox,
    lessdot,
    lesseqgtr,
    lesseqqgtr,
    LessEqualGreater,
    LessFullEqual,
    LessGreater,
    lessgtr,
    LessLess,
    lesssim,
    LessSlantEqual,
    LessTilde,
    lfisht,
    lfloor,
    Lfr,
    lfr,
    lg,
    lgE,
    lHar,
    lhard,
    lharu,
    lharul,
    lhblk,
    LJcy,
    ljcy,
    llarr,
    ll,
    Ll,
    llcorner,
    Lleftarrow,
    llhard,
    lltri,
    Lmidot,
    lmidot,
    lmoustache,
    lmoust,
    lnap,
    lnapprox,
    lne,
    lnE,
    lneq,
    lneqq,
    lnsim,
    loang,
    loarr,
    lobrk,
    longleftarrow,
    LongLeftArrow,
    Longleftarrow,
    longleftrightarrow,
    LongLeftRightArrow,
    Longleftrightarrow,
    longmapsto,
    longrightarrow,
    LongRightArrow,
    Longrightarrow,
    looparrowleft,
    looparrowright,
    lopar,
    Lopf,
    lopf,
    loplus,
    lotimes,
    lowast,
    lowbar,
    LowerLeftArrow,
    LowerRightArrow,
    loz,
    lozenge,
    lozf,
    lpar,
    lparlt,
    lrarr,
    lrcorner,
    lrhar,
    lrhard,
    lrm,
    lrtri,
    lsaquo,
    lscr,
    Lscr,
    lsh,
    Lsh,
    lsim,
    lsime,
    lsimg,
    lsqb,
    lsquo,
    lsquor,
    Lstrok,
    lstrok,
    ltcc,
    ltcir,
    lt,
    LT,
    Lt,
    ltdot,
    lthree,
    ltimes,
    ltlarr,
    ltquest,
    ltri,
    ltrie,
    ltrif,
    ltrPar,
    lurdshar,
    luruhar,
    lvertneqq,
    lvnE,
    macr,
    male,
    malt,
    maltese,
    "Map": "⤅",
    map,
    mapsto,
    mapstodown,
    mapstoleft,
    mapstoup,
    marker,
    mcomma,
    Mcy,
    mcy,
    mdash,
    mDDot,
    measuredangle,
    MediumSpace,
    Mellintrf,
    Mfr,
    mfr,
    mho,
    micro,
    midast,
    midcir,
    mid,
    middot,
    minusb,
    minus,
    minusd,
    minusdu,
    MinusPlus,
    mlcp,
    mldr,
    mnplus,
    models,
    Mopf,
    mopf,
    mp,
    mscr,
    Mscr,
    mstpos,
    Mu,
    mu,
    multimap,
    mumap,
    nabla,
    Nacute,
    nacute,
    nang,
    nap,
    napE,
    napid,
    napos,
    napprox,
    natural,
    naturals,
    natur,
    nbsp,
    nbump,
    nbumpe,
    ncap,
    Ncaron,
    ncaron,
    Ncedil,
    ncedil,
    ncong,
    ncongdot,
    ncup,
    Ncy,
    ncy,
    ndash,
    nearhk,
    nearr,
    neArr,
    nearrow,
    ne,
    nedot,
    NegativeMediumSpace,
    NegativeThickSpace,
    NegativeThinSpace,
    NegativeVeryThinSpace,
    nequiv,
    nesear,
    nesim,
    NestedGreaterGreater,
    NestedLessLess,
    NewLine,
    nexist,
    nexists,
    Nfr,
    nfr,
    ngE,
    nge,
    ngeq,
    ngeqq,
    ngeqslant,
    nges,
    nGg,
    ngsim,
    nGt,
    ngt,
    ngtr,
    nGtv,
    nharr,
    nhArr,
    nhpar,
    ni,
    nis,
    nisd,
    niv,
    NJcy,
    njcy,
    nlarr,
    nlArr,
    nldr,
    nlE,
    nle,
    nleftarrow,
    nLeftarrow,
    nleftrightarrow,
    nLeftrightarrow,
    nleq,
    nleqq,
    nleqslant,
    nles,
    nless,
    nLl,
    nlsim,
    nLt,
    nlt,
    nltri,
    nltrie,
    nLtv,
    nmid,
    NoBreak,
    NonBreakingSpace,
    nopf,
    Nopf,
    Not,
    not,
    NotCongruent,
    NotCupCap,
    NotDoubleVerticalBar,
    NotElement,
    NotEqual,
    NotEqualTilde,
    NotExists,
    NotGreater,
    NotGreaterEqual,
    NotGreaterFullEqual,
    NotGreaterGreater,
    NotGreaterLess,
    NotGreaterSlantEqual,
    NotGreaterTilde,
    NotHumpDownHump,
    NotHumpEqual,
    notin,
    notindot,
    notinE,
    notinva,
    notinvb,
    notinvc,
    NotLeftTriangleBar,
    NotLeftTriangle,
    NotLeftTriangleEqual,
    NotLess,
    NotLessEqual,
    NotLessGreater,
    NotLessLess,
    NotLessSlantEqual,
    NotLessTilde,
    NotNestedGreaterGreater,
    NotNestedLessLess,
    notni,
    notniva,
    notnivb,
    notnivc,
    NotPrecedes,
    NotPrecedesEqual,
    NotPrecedesSlantEqual,
    NotReverseElement,
    NotRightTriangleBar,
    NotRightTriangle,
    NotRightTriangleEqual,
    NotSquareSubset,
    NotSquareSubsetEqual,
    NotSquareSuperset,
    NotSquareSupersetEqual,
    NotSubset,
    NotSubsetEqual,
    NotSucceeds,
    NotSucceedsEqual,
    NotSucceedsSlantEqual,
    NotSucceedsTilde,
    NotSuperset,
    NotSupersetEqual,
    NotTilde,
    NotTildeEqual,
    NotTildeFullEqual,
    NotTildeTilde,
    NotVerticalBar,
    nparallel,
    npar,
    nparsl,
    npart,
    npolint,
    npr,
    nprcue,
    nprec,
    npreceq,
    npre,
    nrarrc,
    nrarr,
    nrArr,
    nrarrw,
    nrightarrow,
    nRightarrow,
    nrtri,
    nrtrie,
    nsc,
    nsccue,
    nsce,
    Nscr,
    nscr,
    nshortmid,
    nshortparallel,
    nsim,
    nsime,
    nsimeq,
    nsmid,
    nspar,
    nsqsube,
    nsqsupe,
    nsub,
    nsubE,
    nsube,
    nsubset,
    nsubseteq,
    nsubseteqq,
    nsucc,
    nsucceq,
    nsup,
    nsupE,
    nsupe,
    nsupset,
    nsupseteq,
    nsupseteqq,
    ntgl,
    Ntilde,
    ntilde,
    ntlg,
    ntriangleleft,
    ntrianglelefteq,
    ntriangleright,
    ntrianglerighteq,
    Nu,
    nu,
    num,
    numero,
    numsp,
    nvap,
    nvdash,
    nvDash,
    nVdash,
    nVDash,
    nvge,
    nvgt,
    nvHarr,
    nvinfin,
    nvlArr,
    nvle,
    nvlt,
    nvltrie,
    nvrArr,
    nvrtrie,
    nvsim,
    nwarhk,
    nwarr,
    nwArr,
    nwarrow,
    nwnear,
    Oacute,
    oacute,
    oast,
    Ocirc,
    ocirc,
    ocir,
    Ocy,
    ocy,
    odash,
    Odblac,
    odblac,
    odiv,
    odot,
    odsold,
    OElig,
    oelig,
    ofcir,
    Ofr,
    ofr,
    ogon,
    Ograve,
    ograve,
    ogt,
    ohbar,
    ohm,
    oint,
    olarr,
    olcir,
    olcross,
    oline,
    olt,
    Omacr,
    omacr,
    Omega,
    omega,
    Omicron,
    omicron,
    omid,
    ominus,
    Oopf,
    oopf,
    opar,
    OpenCurlyDoubleQuote,
    OpenCurlyQuote,
    operp,
    oplus,
    orarr,
    Or,
    or,
    ord,
    order,
    orderof,
    ordf,
    ordm,
    origof,
    oror,
    orslope,
    orv,
    oS,
    Oscr,
    oscr,
    Oslash,
    oslash,
    osol,
    Otilde,
    otilde,
    otimesas,
    Otimes,
    otimes,
    Ouml,
    ouml,
    ovbar,
    OverBar,
    OverBrace,
    OverBracket,
    OverParenthesis,
    para,
    parallel,
    par,
    parsim,
    parsl,
    part,
    PartialD,
    Pcy,
    pcy,
    percnt,
    period,
    permil,
    perp,
    pertenk,
    Pfr,
    pfr,
    Phi,
    phi,
    phiv,
    phmmat,
    phone,
    Pi,
    pi,
    pitchfork,
    piv,
    planck,
    planckh,
    plankv,
    plusacir,
    plusb,
    pluscir,
    plus,
    plusdo,
    plusdu,
    pluse,
    PlusMinus,
    plusmn,
    plussim,
    plustwo,
    pm,
    Poincareplane,
    pointint,
    popf,
    Popf,
    pound,
    prap,
    Pr,
    pr,
    prcue,
    precapprox,
    prec,
    preccurlyeq,
    Precedes,
    PrecedesEqual,
    PrecedesSlantEqual,
    PrecedesTilde,
    preceq,
    precnapprox,
    precneqq,
    precnsim,
    pre,
    prE,
    precsim,
    prime,
    Prime,
    primes,
    prnap,
    prnE,
    prnsim,
    prod,
    Product,
    profalar,
    profline,
    profsurf,
    prop,
    Proportional,
    Proportion,
    propto,
    prsim,
    prurel,
    Pscr,
    pscr,
    Psi,
    psi,
    puncsp,
    Qfr,
    qfr,
    qint,
    qopf,
    Qopf,
    qprime,
    Qscr,
    qscr,
    quaternions,
    quatint,
    quest,
    questeq,
    quot,
    QUOT,
    rAarr,
    race,
    Racute,
    racute,
    radic,
    raemptyv,
    rang,
    Rang,
    rangd,
    range,
    rangle,
    raquo,
    rarrap,
    rarrb,
    rarrbfs,
    rarrc,
    rarr,
    Rarr,
    rArr,
    rarrfs,
    rarrhk,
    rarrlp,
    rarrpl,
    rarrsim,
    Rarrtl,
    rarrtl,
    rarrw,
    ratail,
    rAtail,
    ratio,
    rationals,
    rbarr,
    rBarr,
    RBarr,
    rbbrk,
    rbrace,
    rbrack,
    rbrke,
    rbrksld,
    rbrkslu,
    Rcaron,
    rcaron,
    Rcedil,
    rcedil,
    rceil,
    rcub,
    Rcy,
    rcy,
    rdca,
    rdldhar,
    rdquo,
    rdquor,
    rdsh,
    real,
    realine,
    realpart,
    reals,
    Re,
    rect,
    reg,
    REG,
    ReverseElement,
    ReverseEquilibrium,
    ReverseUpEquilibrium,
    rfisht,
    rfloor,
    rfr,
    Rfr,
    rHar,
    rhard,
    rharu,
    rharul,
    Rho,
    rho,
    rhov,
    RightAngleBracket,
    RightArrowBar,
    rightarrow,
    RightArrow,
    Rightarrow,
    RightArrowLeftArrow,
    rightarrowtail,
    RightCeiling,
    RightDoubleBracket,
    RightDownTeeVector,
    RightDownVectorBar,
    RightDownVector,
    RightFloor,
    rightharpoondown,
    rightharpoonup,
    rightleftarrows,
    rightleftharpoons,
    rightrightarrows,
    rightsquigarrow,
    RightTeeArrow,
    RightTee,
    RightTeeVector,
    rightthreetimes,
    RightTriangleBar,
    RightTriangle,
    RightTriangleEqual,
    RightUpDownVector,
    RightUpTeeVector,
    RightUpVectorBar,
    RightUpVector,
    RightVectorBar,
    RightVector,
    ring,
    risingdotseq,
    rlarr,
    rlhar,
    rlm,
    rmoustache,
    rmoust,
    rnmid,
    roang,
    roarr,
    robrk,
    ropar,
    ropf,
    Ropf,
    roplus,
    rotimes,
    RoundImplies,
    rpar,
    rpargt,
    rppolint,
    rrarr,
    Rrightarrow,
    rsaquo,
    rscr,
    Rscr,
    rsh,
    Rsh,
    rsqb,
    rsquo,
    rsquor,
    rthree,
    rtimes,
    rtri,
    rtrie,
    rtrif,
    rtriltri,
    RuleDelayed,
    ruluhar,
    rx,
    Sacute,
    sacute,
    sbquo,
    scap,
    Scaron,
    scaron,
    Sc,
    sc,
    sccue,
    sce,
    scE,
    Scedil,
    scedil,
    Scirc,
    scirc,
    scnap,
    scnE,
    scnsim,
    scpolint,
    scsim,
    Scy,
    scy,
    sdotb,
    sdot,
    sdote,
    searhk,
    searr,
    seArr,
    searrow,
    sect,
    semi,
    seswar,
    setminus,
    setmn,
    sext,
    Sfr,
    sfr,
    sfrown,
    sharp,
    SHCHcy,
    shchcy,
    SHcy,
    shcy,
    ShortDownArrow,
    ShortLeftArrow,
    shortmid,
    shortparallel,
    ShortRightArrow,
    ShortUpArrow,
    shy,
    Sigma,
    sigma,
    sigmaf,
    sigmav,
    sim,
    simdot,
    sime,
    simeq,
    simg,
    simgE,
    siml,
    simlE,
    simne,
    simplus,
    simrarr,
    slarr,
    SmallCircle,
    smallsetminus,
    smashp,
    smeparsl,
    smid,
    smile,
    smt,
    smte,
    smtes,
    SOFTcy,
    softcy,
    solbar,
    solb,
    sol,
    Sopf,
    sopf,
    spades,
    spadesuit,
    spar,
    sqcap,
    sqcaps,
    sqcup,
    sqcups,
    Sqrt,
    sqsub,
    sqsube,
    sqsubset,
    sqsubseteq,
    sqsup,
    sqsupe,
    sqsupset,
    sqsupseteq,
    square,
    Square,
    SquareIntersection,
    SquareSubset,
    SquareSubsetEqual,
    SquareSuperset,
    SquareSupersetEqual,
    SquareUnion,
    squarf,
    squ,
    squf,
    srarr,
    Sscr,
    sscr,
    ssetmn,
    ssmile,
    sstarf,
    Star,
    star,
    starf,
    straightepsilon,
    straightphi,
    strns,
    sub,
    Sub,
    subdot,
    subE,
    sube,
    subedot,
    submult,
    subnE,
    subne,
    subplus,
    subrarr,
    subset,
    Subset,
    subseteq,
    subseteqq,
    SubsetEqual,
    subsetneq,
    subsetneqq,
    subsim,
    subsub,
    subsup,
    succapprox,
    succ,
    succcurlyeq,
    Succeeds,
    SucceedsEqual,
    SucceedsSlantEqual,
    SucceedsTilde,
    succeq,
    succnapprox,
    succneqq,
    succnsim,
    succsim,
    SuchThat,
    sum,
    Sum,
    sung,
    sup1,
    sup2,
    sup3,
    sup,
    Sup,
    supdot,
    supdsub,
    supE,
    supe,
    supedot,
    Superset,
    SupersetEqual,
    suphsol,
    suphsub,
    suplarr,
    supmult,
    supnE,
    supne,
    supplus,
    supset,
    Supset,
    supseteq,
    supseteqq,
    supsetneq,
    supsetneqq,
    supsim,
    supsub,
    supsup,
    swarhk,
    swarr,
    swArr,
    swarrow,
    swnwar,
    szlig,
    Tab,
    target,
    Tau,
    tau,
    tbrk,
    Tcaron,
    tcaron,
    Tcedil,
    tcedil,
    Tcy,
    tcy,
    tdot,
    telrec,
    Tfr,
    tfr,
    there4,
    therefore,
    Therefore,
    Theta,
    theta,
    thetasym,
    thetav,
    thickapprox,
    thicksim,
    ThickSpace,
    ThinSpace,
    thinsp,
    thkap,
    thksim,
    THORN,
    thorn,
    tilde,
    Tilde,
    TildeEqual,
    TildeFullEqual,
    TildeTilde,
    timesbar,
    timesb,
    times,
    timesd,
    tint,
    toea,
    topbot,
    topcir,
    top,
    Topf,
    topf,
    topfork,
    tosa,
    tprime,
    trade,
    TRADE,
    triangle,
    triangledown,
    triangleleft,
    trianglelefteq,
    triangleq,
    triangleright,
    trianglerighteq,
    tridot,
    trie,
    triminus,
    TripleDot,
    triplus,
    trisb,
    tritime,
    trpezium,
    Tscr,
    tscr,
    TScy,
    tscy,
    TSHcy,
    tshcy,
    Tstrok,
    tstrok,
    twixt,
    twoheadleftarrow,
    twoheadrightarrow,
    Uacute,
    uacute,
    uarr,
    Uarr,
    uArr,
    Uarrocir,
    Ubrcy,
    ubrcy,
    Ubreve,
    ubreve,
    Ucirc,
    ucirc,
    Ucy,
    ucy,
    udarr,
    Udblac,
    udblac,
    udhar,
    ufisht,
    Ufr,
    ufr,
    Ugrave,
    ugrave,
    uHar,
    uharl,
    uharr,
    uhblk,
    ulcorn,
    ulcorner,
    ulcrop,
    ultri,
    Umacr,
    umacr,
    uml,
    UnderBar,
    UnderBrace,
    UnderBracket,
    UnderParenthesis,
    Union,
    UnionPlus,
    Uogon,
    uogon,
    Uopf,
    uopf,
    UpArrowBar,
    uparrow,
    UpArrow,
    Uparrow,
    UpArrowDownArrow,
    updownarrow,
    UpDownArrow,
    Updownarrow,
    UpEquilibrium,
    upharpoonleft,
    upharpoonright,
    uplus,
    UpperLeftArrow,
    UpperRightArrow,
    upsi,
    Upsi,
    upsih,
    Upsilon,
    upsilon,
    UpTeeArrow,
    UpTee,
    upuparrows,
    urcorn,
    urcorner,
    urcrop,
    Uring,
    uring,
    urtri,
    Uscr,
    uscr,
    utdot,
    Utilde,
    utilde,
    utri,
    utrif,
    uuarr,
    Uuml,
    uuml,
    uwangle,
    vangrt,
    varepsilon,
    varkappa,
    varnothing,
    varphi,
    varpi,
    varpropto,
    varr,
    vArr,
    varrho,
    varsigma,
    varsubsetneq,
    varsubsetneqq,
    varsupsetneq,
    varsupsetneqq,
    vartheta,
    vartriangleleft,
    vartriangleright,
    vBar,
    Vbar,
    vBarv,
    Vcy,
    vcy,
    vdash,
    vDash,
    Vdash,
    VDash,
    Vdashl,
    veebar,
    vee,
    Vee,
    veeeq,
    vellip,
    verbar,
    Verbar,
    vert,
    Vert,
    VerticalBar,
    VerticalLine,
    VerticalSeparator,
    VerticalTilde,
    VeryThinSpace,
    Vfr,
    vfr,
    vltri,
    vnsub,
    vnsup,
    Vopf,
    vopf,
    vprop,
    vrtri,
    Vscr,
    vscr,
    vsubnE,
    vsubne,
    vsupnE,
    vsupne,
    Vvdash,
    vzigzag,
    Wcirc,
    wcirc,
    wedbar,
    wedge,
    Wedge,
    wedgeq,
    weierp,
    Wfr,
    wfr,
    Wopf,
    wopf,
    wp,
    wr,
    wreath,
    Wscr,
    wscr,
    xcap,
    xcirc,
    xcup,
    xdtri,
    Xfr,
    xfr,
    xharr,
    xhArr,
    Xi,
    xi,
    xlarr,
    xlArr,
    xmap,
    xnis,
    xodot,
    Xopf,
    xopf,
    xoplus,
    xotime,
    xrarr,
    xrArr,
    Xscr,
    xscr,
    xsqcup,
    xuplus,
    xutri,
    xvee,
    xwedge,
    Yacute,
    yacute,
    YAcy,
    yacy,
    Ycirc,
    ycirc,
    Ycy,
    ycy,
    yen,
    Yfr,
    yfr,
    YIcy,
    yicy,
    Yopf,
    yopf,
    Yscr,
    yscr,
    YUcy,
    yucy,
    yuml,
    Yuml,
    Zacute,
    zacute,
    Zcaron,
    zcaron,
    Zcy,
    zcy,
    Zdot,
    zdot,
    zeetrf,
    ZeroWidthSpace,
    Zeta,
    zeta,
    zfr,
    Zfr,
    ZHcy,
    zhcy,
    zigrarr,
    zopf,
    Zopf,
    Zscr,
    zscr,
    zwj,
    zwnj
  };
  var entities;
  var hasRequiredEntities;
  function requireEntities() {
    if (hasRequiredEntities) return entities;
    hasRequiredEntities = 1;
    entities = require$$0;
    return entities;
  }
  var regex$4;
  var hasRequiredRegex$4;
  function requireRegex$4() {
    if (hasRequiredRegex$4) return regex$4;
    hasRequiredRegex$4 = 1;
    regex$4 = /[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4E\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDF55-\uDF59]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD806[\uDC3B\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDE97-\uDE9A]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/;
    return regex$4;
  }
  var mdurl = {};
  var encode_1;
  var hasRequiredEncode;
  function requireEncode() {
    if (hasRequiredEncode) return encode_1;
    hasRequiredEncode = 1;
    var encodeCache = {};
    function getEncodeCache(exclude) {
      var i, ch, cache = encodeCache[exclude];
      if (cache) {
        return cache;
      }
      cache = encodeCache[exclude] = [];
      for (i = 0; i < 128; i++) {
        ch = String.fromCharCode(i);
        if (/^[0-9a-z]$/i.test(ch)) {
          cache.push(ch);
        } else {
          cache.push("%" + ("0" + i.toString(16).toUpperCase()).slice(-2));
        }
      }
      for (i = 0; i < exclude.length; i++) {
        cache[exclude.charCodeAt(i)] = exclude[i];
      }
      return cache;
    }
    function encode(string, exclude, keepEscaped) {
      var i, l, code2, nextCode, cache, result = "";
      if (typeof exclude !== "string") {
        keepEscaped = exclude;
        exclude = encode.defaultChars;
      }
      if (typeof keepEscaped === "undefined") {
        keepEscaped = true;
      }
      cache = getEncodeCache(exclude);
      for (i = 0, l = string.length; i < l; i++) {
        code2 = string.charCodeAt(i);
        if (keepEscaped && code2 === 37 && i + 2 < l) {
          if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
            result += string.slice(i, i + 3);
            i += 2;
            continue;
          }
        }
        if (code2 < 128) {
          result += cache[code2];
          continue;
        }
        if (code2 >= 55296 && code2 <= 57343) {
          if (code2 >= 55296 && code2 <= 56319 && i + 1 < l) {
            nextCode = string.charCodeAt(i + 1);
            if (nextCode >= 56320 && nextCode <= 57343) {
              result += encodeURIComponent(string[i] + string[i + 1]);
              i++;
              continue;
            }
          }
          result += "%EF%BF%BD";
          continue;
        }
        result += encodeURIComponent(string[i]);
      }
      return result;
    }
    encode.defaultChars = ";/?:@&=+$,-_.!~*'()#";
    encode.componentChars = "-_.!~*'()";
    encode_1 = encode;
    return encode_1;
  }
  var decode_1;
  var hasRequiredDecode;
  function requireDecode() {
    if (hasRequiredDecode) return decode_1;
    hasRequiredDecode = 1;
    var decodeCache = {};
    function getDecodeCache(exclude) {
      var i, ch, cache = decodeCache[exclude];
      if (cache) {
        return cache;
      }
      cache = decodeCache[exclude] = [];
      for (i = 0; i < 128; i++) {
        ch = String.fromCharCode(i);
        cache.push(ch);
      }
      for (i = 0; i < exclude.length; i++) {
        ch = exclude.charCodeAt(i);
        cache[ch] = "%" + ("0" + ch.toString(16).toUpperCase()).slice(-2);
      }
      return cache;
    }
    function decode(string, exclude) {
      var cache;
      if (typeof exclude !== "string") {
        exclude = decode.defaultChars;
      }
      cache = getDecodeCache(exclude);
      return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
        var i, l, b1, b2, b3, b4, chr, result = "";
        for (i = 0, l = seq.length; i < l; i += 3) {
          b1 = parseInt(seq.slice(i + 1, i + 3), 16);
          if (b1 < 128) {
            result += cache[b1];
            continue;
          }
          if ((b1 & 224) === 192 && i + 3 < l) {
            b2 = parseInt(seq.slice(i + 4, i + 6), 16);
            if ((b2 & 192) === 128) {
              chr = b1 << 6 & 1984 | b2 & 63;
              if (chr < 128) {
                result += "��";
              } else {
                result += String.fromCharCode(chr);
              }
              i += 3;
              continue;
            }
          }
          if ((b1 & 240) === 224 && i + 6 < l) {
            b2 = parseInt(seq.slice(i + 4, i + 6), 16);
            b3 = parseInt(seq.slice(i + 7, i + 9), 16);
            if ((b2 & 192) === 128 && (b3 & 192) === 128) {
              chr = b1 << 12 & 61440 | b2 << 6 & 4032 | b3 & 63;
              if (chr < 2048 || chr >= 55296 && chr <= 57343) {
                result += "���";
              } else {
                result += String.fromCharCode(chr);
              }
              i += 6;
              continue;
            }
          }
          if ((b1 & 248) === 240 && i + 9 < l) {
            b2 = parseInt(seq.slice(i + 4, i + 6), 16);
            b3 = parseInt(seq.slice(i + 7, i + 9), 16);
            b4 = parseInt(seq.slice(i + 10, i + 12), 16);
            if ((b2 & 192) === 128 && (b3 & 192) === 128 && (b4 & 192) === 128) {
              chr = b1 << 18 & 1835008 | b2 << 12 & 258048 | b3 << 6 & 4032 | b4 & 63;
              if (chr < 65536 || chr > 1114111) {
                result += "����";
              } else {
                chr -= 65536;
                result += String.fromCharCode(55296 + (chr >> 10), 56320 + (chr & 1023));
              }
              i += 9;
              continue;
            }
          }
          result += "�";
        }
        return result;
      });
    }
    decode.defaultChars = ";/?:@&=+$,#";
    decode.componentChars = "";
    decode_1 = decode;
    return decode_1;
  }
  var format;
  var hasRequiredFormat;
  function requireFormat() {
    if (hasRequiredFormat) return format;
    hasRequiredFormat = 1;
    format = function format2(url) {
      var result = "";
      result += url.protocol || "";
      result += url.slashes ? "//" : "";
      result += url.auth ? url.auth + "@" : "";
      if (url.hostname && url.hostname.indexOf(":") !== -1) {
        result += "[" + url.hostname + "]";
      } else {
        result += url.hostname || "";
      }
      result += url.port ? ":" + url.port : "";
      result += url.pathname || "";
      result += url.search || "";
      result += url.hash || "";
      return result;
    };
    return format;
  }
  var parse;
  var hasRequiredParse;
  function requireParse() {
    if (hasRequiredParse) return parse;
    hasRequiredParse = 1;
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.pathname = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i, portPattern = /:[0-9]*$/, simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/, delims = ["<", ">", '"', "`", " ", "\r", "\n", "	"], unwise = ["{", "}", "|", "\\", "^", "`"].concat(delims), autoEscape = ["'"].concat(unwise), nonHostChars = ["%", "/", "?", ";", "#"].concat(autoEscape), hostEndingChars = ["/", "?", "#"], hostnameMaxLen = 255, hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/, hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/, hostlessProtocol = {
      "javascript": true,
      "javascript:": true
    }, slashedProtocol = {
      "http": true,
      "https": true,
      "ftp": true,
      "gopher": true,
      "file": true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    function urlParse(url, slashesDenoteHost) {
      if (url && url instanceof Url) {
        return url;
      }
      var u = new Url();
      u.parse(url, slashesDenoteHost);
      return u;
    }
    Url.prototype.parse = function(url, slashesDenoteHost) {
      var i, l, lowerProto, hec, slashes, rest = url;
      rest = rest.trim();
      if (!slashesDenoteHost && url.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        lowerProto = proto.toLowerCase();
        this.protocol = proto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
        slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (i = 0; i < hostEndingChars.length; i++) {
          hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = auth;
        }
        hostEnd = -1;
        for (i = 0; i < nonHostChars.length; i++) {
          hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        if (hostEnd === -1) {
          hostEnd = rest.length;
        }
        if (rest[hostEnd - 1] === ":") {
          hostEnd--;
        }
        var host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost(host);
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (i = 0, l = hostparts.length; i < l; i++) {
            var part2 = hostparts[i];
            if (!part2) {
              continue;
            }
            if (!part2.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part2.length; j < k; j++) {
                if (part2.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part2[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part2.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        }
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        rest = rest.slice(0, qm);
      }
      if (rest) {
        this.pathname = rest;
      }
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "";
      }
      return this;
    };
    Url.prototype.parseHost = function(host) {
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) {
        this.hostname = host;
      }
    };
    parse = urlParse;
    return parse;
  }
  var hasRequiredMdurl;
  function requireMdurl() {
    if (hasRequiredMdurl) return mdurl;
    hasRequiredMdurl = 1;
    mdurl.encode = requireEncode();
    mdurl.decode = requireDecode();
    mdurl.format = requireFormat();
    mdurl.parse = requireParse();
    return mdurl;
  }
  var uc_micro = {};
  var regex$3;
  var hasRequiredRegex$3;
  function requireRegex$3() {
    if (hasRequiredRegex$3) return regex$3;
    hasRequiredRegex$3 = 1;
    regex$3 = /[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    return regex$3;
  }
  var regex$2;
  var hasRequiredRegex$2;
  function requireRegex$2() {
    if (hasRequiredRegex$2) return regex$2;
    hasRequiredRegex$2 = 1;
    regex$2 = /[\0-\x1F\x7F-\x9F]/;
    return regex$2;
  }
  var regex$1;
  var hasRequiredRegex$1;
  function requireRegex$1() {
    if (hasRequiredRegex$1) return regex$1;
    hasRequiredRegex$1 = 1;
    regex$1 = /[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/;
    return regex$1;
  }
  var regex;
  var hasRequiredRegex;
  function requireRegex() {
    if (hasRequiredRegex) return regex;
    hasRequiredRegex = 1;
    regex = /[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/;
    return regex;
  }
  var hasRequiredUc_micro;
  function requireUc_micro() {
    if (hasRequiredUc_micro) return uc_micro;
    hasRequiredUc_micro = 1;
    uc_micro.Any = requireRegex$3();
    uc_micro.Cc = requireRegex$2();
    uc_micro.Cf = requireRegex$1();
    uc_micro.P = requireRegex$4();
    uc_micro.Z = requireRegex();
    return uc_micro;
  }
  var hasRequiredUtils;
  function requireUtils() {
    if (hasRequiredUtils) return utils;
    hasRequiredUtils = 1;
    (function(exports) {
      function _class(obj) {
        return Object.prototype.toString.call(obj);
      }
      function isString(obj) {
        return _class(obj) === "[object String]";
      }
      var _hasOwnProperty = Object.prototype.hasOwnProperty;
      function has(object, key) {
        return _hasOwnProperty.call(object, key);
      }
      function assign(obj) {
        var sources = Array.prototype.slice.call(arguments, 1);
        sources.forEach(function(source) {
          if (!source) {
            return;
          }
          if (typeof source !== "object") {
            throw new TypeError(source + "must be object");
          }
          Object.keys(source).forEach(function(key) {
            obj[key] = source[key];
          });
        });
        return obj;
      }
      function arrayReplaceAt(src, pos, newElements) {
        return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
      }
      function isValidEntityCode(c) {
        if (c >= 55296 && c <= 57343) {
          return false;
        }
        if (c >= 64976 && c <= 65007) {
          return false;
        }
        if ((c & 65535) === 65535 || (c & 65535) === 65534) {
          return false;
        }
        if (c >= 0 && c <= 8) {
          return false;
        }
        if (c === 11) {
          return false;
        }
        if (c >= 14 && c <= 31) {
          return false;
        }
        if (c >= 127 && c <= 159) {
          return false;
        }
        if (c > 1114111) {
          return false;
        }
        return true;
      }
      function fromCodePoint(c) {
        if (c > 65535) {
          c -= 65536;
          var surrogate1 = 55296 + (c >> 10), surrogate2 = 56320 + (c & 1023);
          return String.fromCharCode(surrogate1, surrogate2);
        }
        return String.fromCharCode(c);
      }
      var UNESCAPE_MD_RE = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
      var ENTITY_RE = /&([a-z#][a-z0-9]{1,31});/gi;
      var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + "|" + ENTITY_RE.source, "gi");
      var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;
      var entities2 = requireEntities();
      function replaceEntityPattern(match, name) {
        var code2;
        if (has(entities2, name)) {
          return entities2[name];
        }
        if (name.charCodeAt(0) === 35 && DIGITAL_ENTITY_TEST_RE.test(name)) {
          code2 = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);
          if (isValidEntityCode(code2)) {
            return fromCodePoint(code2);
          }
        }
        return match;
      }
      function unescapeMd(str) {
        if (str.indexOf("\\") < 0) {
          return str;
        }
        return str.replace(UNESCAPE_MD_RE, "$1");
      }
      function unescapeAll(str) {
        if (str.indexOf("\\") < 0 && str.indexOf("&") < 0) {
          return str;
        }
        return str.replace(UNESCAPE_ALL_RE, function(match, escaped, entity2) {
          if (escaped) {
            return escaped;
          }
          return replaceEntityPattern(match, entity2);
        });
      }
      var HTML_ESCAPE_TEST_RE = /[&<>"]/;
      var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
      var HTML_REPLACEMENTS = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      };
      function replaceUnsafeChar(ch) {
        return HTML_REPLACEMENTS[ch];
      }
      function escapeHtml(str) {
        if (HTML_ESCAPE_TEST_RE.test(str)) {
          return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
        }
        return str;
      }
      var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;
      function escapeRE(str) {
        return str.replace(REGEXP_ESCAPE_RE, "\\$&");
      }
      function isSpace(code2) {
        switch (code2) {
          case 9:
          case 32:
            return true;
        }
        return false;
      }
      function isWhiteSpace(code2) {
        if (code2 >= 8192 && code2 <= 8202) {
          return true;
        }
        switch (code2) {
          case 9:
          // \t
          case 10:
          // \n
          case 11:
          // \v
          case 12:
          // \f
          case 13:
          // \r
          case 32:
          case 160:
          case 5760:
          case 8239:
          case 8287:
          case 12288:
            return true;
        }
        return false;
      }
      var UNICODE_PUNCT_RE = requireRegex$4();
      function isPunctChar(ch) {
        return UNICODE_PUNCT_RE.test(ch);
      }
      function isMdAsciiPunct(ch) {
        switch (ch) {
          case 33:
          case 34:
          case 35:
          case 36:
          case 37:
          case 38:
          case 39:
          case 40:
          case 41:
          case 42:
          case 43:
          case 44:
          case 45:
          case 46:
          case 47:
          case 58:
          case 59:
          case 60:
          case 61:
          case 62:
          case 63:
          case 64:
          case 91:
          case 92:
          case 93:
          case 94:
          case 95:
          case 96:
          case 123:
          case 124:
          case 125:
          case 126:
            return true;
          default:
            return false;
        }
      }
      function normalizeReference(str) {
        str = str.trim().replace(/\s+/g, " ");
        if ("ẞ".toLowerCase() === "Ṿ") {
          str = str.replace(/ẞ/g, "ß");
        }
        return str.toLowerCase().toUpperCase();
      }
      exports.lib = {};
      exports.lib.mdurl = requireMdurl();
      exports.lib.ucmicro = requireUc_micro();
      exports.assign = assign;
      exports.isString = isString;
      exports.has = has;
      exports.unescapeMd = unescapeMd;
      exports.unescapeAll = unescapeAll;
      exports.isValidEntityCode = isValidEntityCode;
      exports.fromCodePoint = fromCodePoint;
      exports.escapeHtml = escapeHtml;
      exports.arrayReplaceAt = arrayReplaceAt;
      exports.isSpace = isSpace;
      exports.isWhiteSpace = isWhiteSpace;
      exports.isMdAsciiPunct = isMdAsciiPunct;
      exports.isPunctChar = isPunctChar;
      exports.escapeRE = escapeRE;
      exports.normalizeReference = normalizeReference;
    })(utils);
    return utils;
  }
  var helpers = {};
  var parse_link_label;
  var hasRequiredParse_link_label;
  function requireParse_link_label() {
    if (hasRequiredParse_link_label) return parse_link_label;
    hasRequiredParse_link_label = 1;
    parse_link_label = function parseLinkLabel(state, start, disableNested) {
      var level, found, marker2, prevPos, labelEnd = -1, max = state.posMax, oldPos = state.pos;
      state.pos = start + 1;
      level = 1;
      while (state.pos < max) {
        marker2 = state.src.charCodeAt(state.pos);
        if (marker2 === 93) {
          level--;
          if (level === 0) {
            found = true;
            break;
          }
        }
        prevPos = state.pos;
        state.md.inline.skipToken(state);
        if (marker2 === 91) {
          if (prevPos === state.pos - 1) {
            level++;
          } else if (disableNested) {
            state.pos = oldPos;
            return -1;
          }
        }
      }
      if (found) {
        labelEnd = state.pos;
      }
      state.pos = oldPos;
      return labelEnd;
    };
    return parse_link_label;
  }
  var parse_link_destination;
  var hasRequiredParse_link_destination;
  function requireParse_link_destination() {
    if (hasRequiredParse_link_destination) return parse_link_destination;
    hasRequiredParse_link_destination = 1;
    var unescapeAll = requireUtils().unescapeAll;
    parse_link_destination = function parseLinkDestination(str, start, max) {
      var code2, level, pos = start, result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ""
      };
      if (str.charCodeAt(pos) === 60) {
        pos++;
        while (pos < max) {
          code2 = str.charCodeAt(pos);
          if (code2 === 10) {
            return result;
          }
          if (code2 === 60) {
            return result;
          }
          if (code2 === 62) {
            result.pos = pos + 1;
            result.str = unescapeAll(str.slice(start + 1, pos));
            result.ok = true;
            return result;
          }
          if (code2 === 92 && pos + 1 < max) {
            pos += 2;
            continue;
          }
          pos++;
        }
        return result;
      }
      level = 0;
      while (pos < max) {
        code2 = str.charCodeAt(pos);
        if (code2 === 32) {
          break;
        }
        if (code2 < 32 || code2 === 127) {
          break;
        }
        if (code2 === 92 && pos + 1 < max) {
          if (str.charCodeAt(pos + 1) === 32) {
            break;
          }
          pos += 2;
          continue;
        }
        if (code2 === 40) {
          level++;
          if (level > 32) {
            return result;
          }
        }
        if (code2 === 41) {
          if (level === 0) {
            break;
          }
          level--;
        }
        pos++;
      }
      if (start === pos) {
        return result;
      }
      if (level !== 0) {
        return result;
      }
      result.str = unescapeAll(str.slice(start, pos));
      result.pos = pos;
      result.ok = true;
      return result;
    };
    return parse_link_destination;
  }
  var parse_link_title;
  var hasRequiredParse_link_title;
  function requireParse_link_title() {
    if (hasRequiredParse_link_title) return parse_link_title;
    hasRequiredParse_link_title = 1;
    var unescapeAll = requireUtils().unescapeAll;
    parse_link_title = function parseLinkTitle(str, start, max) {
      var code2, marker2, lines = 0, pos = start, result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ""
      };
      if (pos >= max) {
        return result;
      }
      marker2 = str.charCodeAt(pos);
      if (marker2 !== 34 && marker2 !== 39 && marker2 !== 40) {
        return result;
      }
      pos++;
      if (marker2 === 40) {
        marker2 = 41;
      }
      while (pos < max) {
        code2 = str.charCodeAt(pos);
        if (code2 === marker2) {
          result.pos = pos + 1;
          result.lines = lines;
          result.str = unescapeAll(str.slice(start + 1, pos));
          result.ok = true;
          return result;
        } else if (code2 === 40 && marker2 === 41) {
          return result;
        } else if (code2 === 10) {
          lines++;
        } else if (code2 === 92 && pos + 1 < max) {
          pos++;
          if (str.charCodeAt(pos) === 10) {
            lines++;
          }
        }
        pos++;
      }
      return result;
    };
    return parse_link_title;
  }
  var hasRequiredHelpers;
  function requireHelpers() {
    if (hasRequiredHelpers) return helpers;
    hasRequiredHelpers = 1;
    helpers.parseLinkLabel = requireParse_link_label();
    helpers.parseLinkDestination = requireParse_link_destination();
    helpers.parseLinkTitle = requireParse_link_title();
    return helpers;
  }
  var renderer;
  var hasRequiredRenderer;
  function requireRenderer() {
    if (hasRequiredRenderer) return renderer;
    hasRequiredRenderer = 1;
    var assign = requireUtils().assign;
    var unescapeAll = requireUtils().unescapeAll;
    var escapeHtml = requireUtils().escapeHtml;
    var default_rules = {};
    default_rules.code_inline = function(tokens, idx, options, env, slf) {
      var token2 = tokens[idx];
      return "<code" + slf.renderAttrs(token2) + ">" + escapeHtml(token2.content) + "</code>";
    };
    default_rules.code_block = function(tokens, idx, options, env, slf) {
      var token2 = tokens[idx];
      return "<pre" + slf.renderAttrs(token2) + "><code>" + escapeHtml(tokens[idx].content) + "</code></pre>\n";
    };
    default_rules.fence = function(tokens, idx, options, env, slf) {
      var token2 = tokens[idx], info = token2.info ? unescapeAll(token2.info).trim() : "", langName = "", langAttrs = "", highlighted, i, arr, tmpAttrs, tmpToken;
      if (info) {
        arr = info.split(/(\s+)/g);
        langName = arr[0];
        langAttrs = arr.slice(2).join("");
      }
      if (options.highlight) {
        highlighted = options.highlight(token2.content, langName, langAttrs) || escapeHtml(token2.content);
      } else {
        highlighted = escapeHtml(token2.content);
      }
      if (highlighted.indexOf("<pre") === 0) {
        return highlighted + "\n";
      }
      if (info) {
        i = token2.attrIndex("class");
        tmpAttrs = token2.attrs ? token2.attrs.slice() : [];
        if (i < 0) {
          tmpAttrs.push(["class", options.langPrefix + langName]);
        } else {
          tmpAttrs[i] = tmpAttrs[i].slice();
          tmpAttrs[i][1] += " " + options.langPrefix + langName;
        }
        tmpToken = {
          attrs: tmpAttrs
        };
        return "<pre><code" + slf.renderAttrs(tmpToken) + ">" + highlighted + "</code></pre>\n";
      }
      return "<pre><code" + slf.renderAttrs(token2) + ">" + highlighted + "</code></pre>\n";
    };
    default_rules.image = function(tokens, idx, options, env, slf) {
      var token2 = tokens[idx];
      token2.attrs[token2.attrIndex("alt")][1] = slf.renderInlineAsText(token2.children, options, env);
      return slf.renderToken(tokens, idx, options);
    };
    default_rules.hardbreak = function(tokens, idx, options) {
      return options.xhtmlOut ? "<br />\n" : "<br>\n";
    };
    default_rules.softbreak = function(tokens, idx, options) {
      return options.breaks ? options.xhtmlOut ? "<br />\n" : "<br>\n" : "\n";
    };
    default_rules.text = function(tokens, idx) {
      return escapeHtml(tokens[idx].content);
    };
    default_rules.html_block = function(tokens, idx) {
      return tokens[idx].content;
    };
    default_rules.html_inline = function(tokens, idx) {
      return tokens[idx].content;
    };
    function Renderer() {
      this.rules = assign({}, default_rules);
    }
    Renderer.prototype.renderAttrs = function renderAttrs(token2) {
      var i, l, result;
      if (!token2.attrs) {
        return "";
      }
      result = "";
      for (i = 0, l = token2.attrs.length; i < l; i++) {
        result += " " + escapeHtml(token2.attrs[i][0]) + '="' + escapeHtml(token2.attrs[i][1]) + '"';
      }
      return result;
    };
    Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
      var nextToken, result = "", needLf = false, token2 = tokens[idx];
      if (token2.hidden) {
        return "";
      }
      if (token2.block && token2.nesting !== -1 && idx && tokens[idx - 1].hidden) {
        result += "\n";
      }
      result += (token2.nesting === -1 ? "</" : "<") + token2.tag;
      result += this.renderAttrs(token2);
      if (token2.nesting === 0 && options.xhtmlOut) {
        result += " /";
      }
      if (token2.block) {
        needLf = true;
        if (token2.nesting === 1) {
          if (idx + 1 < tokens.length) {
            nextToken = tokens[idx + 1];
            if (nextToken.type === "inline" || nextToken.hidden) {
              needLf = false;
            } else if (nextToken.nesting === -1 && nextToken.tag === token2.tag) {
              needLf = false;
            }
          }
        }
      }
      result += needLf ? ">\n" : ">";
      return result;
    };
    Renderer.prototype.renderInline = function(tokens, options, env) {
      var type, result = "", rules = this.rules;
      for (var i = 0, len = tokens.length; i < len; i++) {
        type = tokens[i].type;
        if (typeof rules[type] !== "undefined") {
          result += rules[type](tokens, i, options, env, this);
        } else {
          result += this.renderToken(tokens, i, options);
        }
      }
      return result;
    };
    Renderer.prototype.renderInlineAsText = function(tokens, options, env) {
      var result = "";
      for (var i = 0, len = tokens.length; i < len; i++) {
        if (tokens[i].type === "text") {
          result += tokens[i].content;
        } else if (tokens[i].type === "image") {
          result += this.renderInlineAsText(tokens[i].children, options, env);
        } else if (tokens[i].type === "softbreak") {
          result += "\n";
        }
      }
      return result;
    };
    Renderer.prototype.render = function(tokens, options, env) {
      var i, len, type, result = "", rules = this.rules;
      for (i = 0, len = tokens.length; i < len; i++) {
        type = tokens[i].type;
        if (type === "inline") {
          result += this.renderInline(tokens[i].children, options, env);
        } else if (typeof rules[type] !== "undefined") {
          result += rules[type](tokens, i, options, env, this);
        } else {
          result += this.renderToken(tokens, i, options, env);
        }
      }
      return result;
    };
    renderer = Renderer;
    return renderer;
  }
  var ruler;
  var hasRequiredRuler;
  function requireRuler() {
    if (hasRequiredRuler) return ruler;
    hasRequiredRuler = 1;
    function Ruler() {
      this.__rules__ = [];
      this.__cache__ = null;
    }
    Ruler.prototype.__find__ = function(name) {
      for (var i = 0; i < this.__rules__.length; i++) {
        if (this.__rules__[i].name === name) {
          return i;
        }
      }
      return -1;
    };
    Ruler.prototype.__compile__ = function() {
      var self = this;
      var chains = [""];
      self.__rules__.forEach(function(rule) {
        if (!rule.enabled) {
          return;
        }
        rule.alt.forEach(function(altName) {
          if (chains.indexOf(altName) < 0) {
            chains.push(altName);
          }
        });
      });
      self.__cache__ = {};
      chains.forEach(function(chain) {
        self.__cache__[chain] = [];
        self.__rules__.forEach(function(rule) {
          if (!rule.enabled) {
            return;
          }
          if (chain && rule.alt.indexOf(chain) < 0) {
            return;
          }
          self.__cache__[chain].push(rule.fn);
        });
      });
    };
    Ruler.prototype.at = function(name, fn, options) {
      var index = this.__find__(name);
      var opt = options || {};
      if (index === -1) {
        throw new Error("Parser rule not found: " + name);
      }
      this.__rules__[index].fn = fn;
      this.__rules__[index].alt = opt.alt || [];
      this.__cache__ = null;
    };
    Ruler.prototype.before = function(beforeName, ruleName, fn, options) {
      var index = this.__find__(beforeName);
      var opt = options || {};
      if (index === -1) {
        throw new Error("Parser rule not found: " + beforeName);
      }
      this.__rules__.splice(index, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.after = function(afterName, ruleName, fn, options) {
      var index = this.__find__(afterName);
      var opt = options || {};
      if (index === -1) {
        throw new Error("Parser rule not found: " + afterName);
      }
      this.__rules__.splice(index + 1, 0, {
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.push = function(ruleName, fn, options) {
      var opt = options || {};
      this.__rules__.push({
        name: ruleName,
        enabled: true,
        fn,
        alt: opt.alt || []
      });
      this.__cache__ = null;
    };
    Ruler.prototype.enable = function(list2, ignoreInvalid) {
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      var result = [];
      list2.forEach(function(name) {
        var idx = this.__find__(name);
        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }
          throw new Error("Rules manager: invalid rule name " + name);
        }
        this.__rules__[idx].enabled = true;
        result.push(name);
      }, this);
      this.__cache__ = null;
      return result;
    };
    Ruler.prototype.enableOnly = function(list2, ignoreInvalid) {
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      this.__rules__.forEach(function(rule) {
        rule.enabled = false;
      });
      this.enable(list2, ignoreInvalid);
    };
    Ruler.prototype.disable = function(list2, ignoreInvalid) {
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      var result = [];
      list2.forEach(function(name) {
        var idx = this.__find__(name);
        if (idx < 0) {
          if (ignoreInvalid) {
            return;
          }
          throw new Error("Rules manager: invalid rule name " + name);
        }
        this.__rules__[idx].enabled = false;
        result.push(name);
      }, this);
      this.__cache__ = null;
      return result;
    };
    Ruler.prototype.getRules = function(chainName) {
      if (this.__cache__ === null) {
        this.__compile__();
      }
      return this.__cache__[chainName] || [];
    };
    ruler = Ruler;
    return ruler;
  }
  var normalize;
  var hasRequiredNormalize;
  function requireNormalize() {
    if (hasRequiredNormalize) return normalize;
    hasRequiredNormalize = 1;
    var NEWLINES_RE = /\r\n?|\n/g;
    var NULL_RE = /\0/g;
    normalize = function normalize2(state) {
      var str;
      str = state.src.replace(NEWLINES_RE, "\n");
      str = str.replace(NULL_RE, "�");
      state.src = str;
    };
    return normalize;
  }
  var block;
  var hasRequiredBlock;
  function requireBlock() {
    if (hasRequiredBlock) return block;
    hasRequiredBlock = 1;
    block = function block2(state) {
      var token2;
      if (state.inlineMode) {
        token2 = new state.Token("inline", "", 0);
        token2.content = state.src;
        token2.map = [0, 1];
        token2.children = [];
        state.tokens.push(token2);
      } else {
        state.md.block.parse(state.src, state.md, state.env, state.tokens);
      }
    };
    return block;
  }
  var inline;
  var hasRequiredInline;
  function requireInline() {
    if (hasRequiredInline) return inline;
    hasRequiredInline = 1;
    inline = function inline2(state) {
      var tokens = state.tokens, tok, i, l;
      for (i = 0, l = tokens.length; i < l; i++) {
        tok = tokens[i];
        if (tok.type === "inline") {
          state.md.inline.parse(tok.content, state.md, state.env, tok.children);
        }
      }
    };
    return inline;
  }
  var linkify$1;
  var hasRequiredLinkify$1;
  function requireLinkify$1() {
    if (hasRequiredLinkify$1) return linkify$1;
    hasRequiredLinkify$1 = 1;
    var arrayReplaceAt = requireUtils().arrayReplaceAt;
    function isLinkOpen(str) {
      return /^<a[>\s]/i.test(str);
    }
    function isLinkClose(str) {
      return /^<\/a\s*>/i.test(str);
    }
    linkify$1 = function linkify2(state) {
      var i, j, l, tokens, token2, currentToken, nodes, ln, text2, pos, lastPos, level, htmlLinkLevel, url, fullUrl, urlText, blockTokens = state.tokens, links;
      if (!state.md.options.linkify) {
        return;
      }
      for (j = 0, l = blockTokens.length; j < l; j++) {
        if (blockTokens[j].type !== "inline" || !state.md.linkify.pretest(blockTokens[j].content)) {
          continue;
        }
        tokens = blockTokens[j].children;
        htmlLinkLevel = 0;
        for (i = tokens.length - 1; i >= 0; i--) {
          currentToken = tokens[i];
          if (currentToken.type === "link_close") {
            i--;
            while (tokens[i].level !== currentToken.level && tokens[i].type !== "link_open") {
              i--;
            }
            continue;
          }
          if (currentToken.type === "html_inline") {
            if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
              htmlLinkLevel--;
            }
            if (isLinkClose(currentToken.content)) {
              htmlLinkLevel++;
            }
          }
          if (htmlLinkLevel > 0) {
            continue;
          }
          if (currentToken.type === "text" && state.md.linkify.test(currentToken.content)) {
            text2 = currentToken.content;
            links = state.md.linkify.match(text2);
            nodes = [];
            level = currentToken.level;
            lastPos = 0;
            if (links.length > 0 && links[0].index === 0 && i > 0 && tokens[i - 1].type === "text_special") {
              links = links.slice(1);
            }
            for (ln = 0; ln < links.length; ln++) {
              url = links[ln].url;
              fullUrl = state.md.normalizeLink(url);
              if (!state.md.validateLink(fullUrl)) {
                continue;
              }
              urlText = links[ln].text;
              if (!links[ln].schema) {
                urlText = state.md.normalizeLinkText("http://" + urlText).replace(/^http:\/\//, "");
              } else if (links[ln].schema === "mailto:" && !/^mailto:/i.test(urlText)) {
                urlText = state.md.normalizeLinkText("mailto:" + urlText).replace(/^mailto:/, "");
              } else {
                urlText = state.md.normalizeLinkText(urlText);
              }
              pos = links[ln].index;
              if (pos > lastPos) {
                token2 = new state.Token("text", "", 0);
                token2.content = text2.slice(lastPos, pos);
                token2.level = level;
                nodes.push(token2);
              }
              token2 = new state.Token("link_open", "a", 1);
              token2.attrs = [["href", fullUrl]];
              token2.level = level++;
              token2.markup = "linkify";
              token2.info = "auto";
              nodes.push(token2);
              token2 = new state.Token("text", "", 0);
              token2.content = urlText;
              token2.level = level;
              nodes.push(token2);
              token2 = new state.Token("link_close", "a", -1);
              token2.level = --level;
              token2.markup = "linkify";
              token2.info = "auto";
              nodes.push(token2);
              lastPos = links[ln].lastIndex;
            }
            if (lastPos < text2.length) {
              token2 = new state.Token("text", "", 0);
              token2.content = text2.slice(lastPos);
              token2.level = level;
              nodes.push(token2);
            }
            blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
          }
        }
      }
    };
    return linkify$1;
  }
  var replacements;
  var hasRequiredReplacements;
  function requireReplacements() {
    if (hasRequiredReplacements) return replacements;
    hasRequiredReplacements = 1;
    var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;
    var SCOPED_ABBR_TEST_RE = /\((c|tm|r)\)/i;
    var SCOPED_ABBR_RE = /\((c|tm|r)\)/ig;
    var SCOPED_ABBR = {
      c: "©",
      r: "®",
      tm: "™"
    };
    function replaceFn(match, name) {
      return SCOPED_ABBR[name.toLowerCase()];
    }
    function replace_scoped(inlineTokens) {
      var i, token2, inside_autolink = 0;
      for (i = inlineTokens.length - 1; i >= 0; i--) {
        token2 = inlineTokens[i];
        if (token2.type === "text" && !inside_autolink) {
          token2.content = token2.content.replace(SCOPED_ABBR_RE, replaceFn);
        }
        if (token2.type === "link_open" && token2.info === "auto") {
          inside_autolink--;
        }
        if (token2.type === "link_close" && token2.info === "auto") {
          inside_autolink++;
        }
      }
    }
    function replace_rare(inlineTokens) {
      var i, token2, inside_autolink = 0;
      for (i = inlineTokens.length - 1; i >= 0; i--) {
        token2 = inlineTokens[i];
        if (token2.type === "text" && !inside_autolink) {
          if (RARE_RE.test(token2.content)) {
            token2.content = token2.content.replace(/\+-/g, "±").replace(/\.{2,}/g, "…").replace(/([?!])…/g, "$1..").replace(/([?!]){4,}/g, "$1$1$1").replace(/,{2,}/g, ",").replace(/(^|[^-])---(?=[^-]|$)/mg, "$1—").replace(/(^|\s)--(?=\s|$)/mg, "$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/mg, "$1–");
          }
        }
        if (token2.type === "link_open" && token2.info === "auto") {
          inside_autolink--;
        }
        if (token2.type === "link_close" && token2.info === "auto") {
          inside_autolink++;
        }
      }
    }
    replacements = function replace(state) {
      var blkIdx;
      if (!state.md.options.typographer) {
        return;
      }
      for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
        if (state.tokens[blkIdx].type !== "inline") {
          continue;
        }
        if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
          replace_scoped(state.tokens[blkIdx].children);
        }
        if (RARE_RE.test(state.tokens[blkIdx].content)) {
          replace_rare(state.tokens[blkIdx].children);
        }
      }
    };
    return replacements;
  }
  var smartquotes;
  var hasRequiredSmartquotes;
  function requireSmartquotes() {
    if (hasRequiredSmartquotes) return smartquotes;
    hasRequiredSmartquotes = 1;
    var isWhiteSpace = requireUtils().isWhiteSpace;
    var isPunctChar = requireUtils().isPunctChar;
    var isMdAsciiPunct = requireUtils().isMdAsciiPunct;
    var QUOTE_TEST_RE = /['"]/;
    var QUOTE_RE = /['"]/g;
    var APOSTROPHE = "’";
    function replaceAt(str, index, ch) {
      return str.slice(0, index) + ch + str.slice(index + 1);
    }
    function process_inlines(tokens, state) {
      var i, token2, text2, t, pos, max, thisLevel, item, lastChar, nextChar, isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace, canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;
      stack = [];
      for (i = 0; i < tokens.length; i++) {
        token2 = tokens[i];
        thisLevel = tokens[i].level;
        for (j = stack.length - 1; j >= 0; j--) {
          if (stack[j].level <= thisLevel) {
            break;
          }
        }
        stack.length = j + 1;
        if (token2.type !== "text") {
          continue;
        }
        text2 = token2.content;
        pos = 0;
        max = text2.length;
        OUTER:
          while (pos < max) {
            QUOTE_RE.lastIndex = pos;
            t = QUOTE_RE.exec(text2);
            if (!t) {
              break;
            }
            canOpen = canClose = true;
            pos = t.index + 1;
            isSingle = t[0] === "'";
            lastChar = 32;
            if (t.index - 1 >= 0) {
              lastChar = text2.charCodeAt(t.index - 1);
            } else {
              for (j = i - 1; j >= 0; j--) {
                if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
                if (!tokens[j].content) continue;
                lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
                break;
              }
            }
            nextChar = 32;
            if (pos < max) {
              nextChar = text2.charCodeAt(pos);
            } else {
              for (j = i + 1; j < tokens.length; j++) {
                if (tokens[j].type === "softbreak" || tokens[j].type === "hardbreak") break;
                if (!tokens[j].content) continue;
                nextChar = tokens[j].content.charCodeAt(0);
                break;
              }
            }
            isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
            isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
            isLastWhiteSpace = isWhiteSpace(lastChar);
            isNextWhiteSpace = isWhiteSpace(nextChar);
            if (isNextWhiteSpace) {
              canOpen = false;
            } else if (isNextPunctChar) {
              if (!(isLastWhiteSpace || isLastPunctChar)) {
                canOpen = false;
              }
            }
            if (isLastWhiteSpace) {
              canClose = false;
            } else if (isLastPunctChar) {
              if (!(isNextWhiteSpace || isNextPunctChar)) {
                canClose = false;
              }
            }
            if (nextChar === 34 && t[0] === '"') {
              if (lastChar >= 48 && lastChar <= 57) {
                canClose = canOpen = false;
              }
            }
            if (canOpen && canClose) {
              canOpen = isLastPunctChar;
              canClose = isNextPunctChar;
            }
            if (!canOpen && !canClose) {
              if (isSingle) {
                token2.content = replaceAt(token2.content, t.index, APOSTROPHE);
              }
              continue;
            }
            if (canClose) {
              for (j = stack.length - 1; j >= 0; j--) {
                item = stack[j];
                if (stack[j].level < thisLevel) {
                  break;
                }
                if (item.single === isSingle && stack[j].level === thisLevel) {
                  item = stack[j];
                  if (isSingle) {
                    openQuote = state.md.options.quotes[2];
                    closeQuote = state.md.options.quotes[3];
                  } else {
                    openQuote = state.md.options.quotes[0];
                    closeQuote = state.md.options.quotes[1];
                  }
                  token2.content = replaceAt(token2.content, t.index, closeQuote);
                  tokens[item.token].content = replaceAt(
                    tokens[item.token].content,
                    item.pos,
                    openQuote
                  );
                  pos += closeQuote.length - 1;
                  if (item.token === i) {
                    pos += openQuote.length - 1;
                  }
                  text2 = token2.content;
                  max = text2.length;
                  stack.length = j;
                  continue OUTER;
                }
              }
            }
            if (canOpen) {
              stack.push({
                token: i,
                pos: t.index,
                single: isSingle,
                level: thisLevel
              });
            } else if (canClose && isSingle) {
              token2.content = replaceAt(token2.content, t.index, APOSTROPHE);
            }
          }
      }
    }
    smartquotes = function smartquotes2(state) {
      var blkIdx;
      if (!state.md.options.typographer) {
        return;
      }
      for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {
        if (state.tokens[blkIdx].type !== "inline" || !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
          continue;
        }
        process_inlines(state.tokens[blkIdx].children, state);
      }
    };
    return smartquotes;
  }
  var text_join;
  var hasRequiredText_join;
  function requireText_join() {
    if (hasRequiredText_join) return text_join;
    hasRequiredText_join = 1;
    text_join = function text_join2(state) {
      var j, l, tokens, curr, max, last, blockTokens = state.tokens;
      for (j = 0, l = blockTokens.length; j < l; j++) {
        if (blockTokens[j].type !== "inline") continue;
        tokens = blockTokens[j].children;
        max = tokens.length;
        for (curr = 0; curr < max; curr++) {
          if (tokens[curr].type === "text_special") {
            tokens[curr].type = "text";
          }
        }
        for (curr = last = 0; curr < max; curr++) {
          if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
            tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
          } else {
            if (curr !== last) {
              tokens[last] = tokens[curr];
            }
            last++;
          }
        }
        if (curr !== last) {
          tokens.length = last;
        }
      }
    };
    return text_join;
  }
  var token;
  var hasRequiredToken;
  function requireToken() {
    if (hasRequiredToken) return token;
    hasRequiredToken = 1;
    function Token(type, tag, nesting) {
      this.type = type;
      this.tag = tag;
      this.attrs = null;
      this.map = null;
      this.nesting = nesting;
      this.level = 0;
      this.children = null;
      this.content = "";
      this.markup = "";
      this.info = "";
      this.meta = null;
      this.block = false;
      this.hidden = false;
    }
    Token.prototype.attrIndex = function attrIndex(name) {
      var attrs, i, len;
      if (!this.attrs) {
        return -1;
      }
      attrs = this.attrs;
      for (i = 0, len = attrs.length; i < len; i++) {
        if (attrs[i][0] === name) {
          return i;
        }
      }
      return -1;
    };
    Token.prototype.attrPush = function attrPush(attrData) {
      if (this.attrs) {
        this.attrs.push(attrData);
      } else {
        this.attrs = [attrData];
      }
    };
    Token.prototype.attrSet = function attrSet(name, value) {
      var idx = this.attrIndex(name), attrData = [name, value];
      if (idx < 0) {
        this.attrPush(attrData);
      } else {
        this.attrs[idx] = attrData;
      }
    };
    Token.prototype.attrGet = function attrGet(name) {
      var idx = this.attrIndex(name), value = null;
      if (idx >= 0) {
        value = this.attrs[idx][1];
      }
      return value;
    };
    Token.prototype.attrJoin = function attrJoin(name, value) {
      var idx = this.attrIndex(name);
      if (idx < 0) {
        this.attrPush([name, value]);
      } else {
        this.attrs[idx][1] = this.attrs[idx][1] + " " + value;
      }
    };
    token = Token;
    return token;
  }
  var state_core;
  var hasRequiredState_core;
  function requireState_core() {
    if (hasRequiredState_core) return state_core;
    hasRequiredState_core = 1;
    var Token = requireToken();
    function StateCore(src, md, env) {
      this.src = src;
      this.env = env;
      this.tokens = [];
      this.inlineMode = false;
      this.md = md;
    }
    StateCore.prototype.Token = Token;
    state_core = StateCore;
    return state_core;
  }
  var parser_core;
  var hasRequiredParser_core;
  function requireParser_core() {
    if (hasRequiredParser_core) return parser_core;
    hasRequiredParser_core = 1;
    var Ruler = requireRuler();
    var _rules = [
      ["normalize", requireNormalize()],
      ["block", requireBlock()],
      ["inline", requireInline()],
      ["linkify", requireLinkify$1()],
      ["replacements", requireReplacements()],
      ["smartquotes", requireSmartquotes()],
      // `text_join` finds `text_special` tokens (for escape sequences)
      // and joins them with the rest of the text
      ["text_join", requireText_join()]
    ];
    function Core() {
      this.ruler = new Ruler();
      for (var i = 0; i < _rules.length; i++) {
        this.ruler.push(_rules[i][0], _rules[i][1]);
      }
    }
    Core.prototype.process = function(state) {
      var i, l, rules;
      rules = this.ruler.getRules("");
      for (i = 0, l = rules.length; i < l; i++) {
        rules[i](state);
      }
    };
    Core.prototype.State = requireState_core();
    parser_core = Core;
    return parser_core;
  }
  var table;
  var hasRequiredTable;
  function requireTable() {
    if (hasRequiredTable) return table;
    hasRequiredTable = 1;
    var isSpace = requireUtils().isSpace;
    function getLine(state, line) {
      var pos = state.bMarks[line] + state.tShift[line], max = state.eMarks[line];
      return state.src.slice(pos, max);
    }
    function escapedSplit(str) {
      var result = [], pos = 0, max = str.length, ch, isEscaped = false, lastPos = 0, current = "";
      ch = str.charCodeAt(pos);
      while (pos < max) {
        if (ch === 124) {
          if (!isEscaped) {
            result.push(current + str.substring(lastPos, pos));
            current = "";
            lastPos = pos + 1;
          } else {
            current += str.substring(lastPos, pos - 1);
            lastPos = pos;
          }
        }
        isEscaped = ch === 92;
        pos++;
        ch = str.charCodeAt(pos);
      }
      result.push(current + str.substring(lastPos));
      return result;
    }
    table = function table2(state, startLine, endLine, silent) {
      var ch, lineText, pos, i, l, nextLine, columns, columnCount, token2, aligns, t, tableLines, tbodyLines, oldParentType, terminate, terminatorRules, firstCh, secondCh;
      if (startLine + 2 > endLine) {
        return false;
      }
      nextLine = startLine + 1;
      if (state.sCount[nextLine] < state.blkIndent) {
        return false;
      }
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        return false;
      }
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      if (pos >= state.eMarks[nextLine]) {
        return false;
      }
      firstCh = state.src.charCodeAt(pos++);
      if (firstCh !== 124 && firstCh !== 45 && firstCh !== 58) {
        return false;
      }
      if (pos >= state.eMarks[nextLine]) {
        return false;
      }
      secondCh = state.src.charCodeAt(pos++);
      if (secondCh !== 124 && secondCh !== 45 && secondCh !== 58 && !isSpace(secondCh)) {
        return false;
      }
      if (firstCh === 45 && isSpace(secondCh)) {
        return false;
      }
      while (pos < state.eMarks[nextLine]) {
        ch = state.src.charCodeAt(pos);
        if (ch !== 124 && ch !== 45 && ch !== 58 && !isSpace(ch)) {
          return false;
        }
        pos++;
      }
      lineText = getLine(state, startLine + 1);
      columns = lineText.split("|");
      aligns = [];
      for (i = 0; i < columns.length; i++) {
        t = columns[i].trim();
        if (!t) {
          if (i === 0 || i === columns.length - 1) {
            continue;
          } else {
            return false;
          }
        }
        if (!/^:?-+:?$/.test(t)) {
          return false;
        }
        if (t.charCodeAt(t.length - 1) === 58) {
          aligns.push(t.charCodeAt(0) === 58 ? "center" : "right");
        } else if (t.charCodeAt(0) === 58) {
          aligns.push("left");
        } else {
          aligns.push("");
        }
      }
      lineText = getLine(state, startLine).trim();
      if (lineText.indexOf("|") === -1) {
        return false;
      }
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      columns = escapedSplit(lineText);
      if (columns.length && columns[0] === "") columns.shift();
      if (columns.length && columns[columns.length - 1] === "") columns.pop();
      columnCount = columns.length;
      if (columnCount === 0 || columnCount !== aligns.length) {
        return false;
      }
      if (silent) {
        return true;
      }
      oldParentType = state.parentType;
      state.parentType = "table";
      terminatorRules = state.md.block.ruler.getRules("blockquote");
      token2 = state.push("table_open", "table", 1);
      token2.map = tableLines = [startLine, 0];
      token2 = state.push("thead_open", "thead", 1);
      token2.map = [startLine, startLine + 1];
      token2 = state.push("tr_open", "tr", 1);
      token2.map = [startLine, startLine + 1];
      for (i = 0; i < columns.length; i++) {
        token2 = state.push("th_open", "th", 1);
        if (aligns[i]) {
          token2.attrs = [["style", "text-align:" + aligns[i]]];
        }
        token2 = state.push("inline", "", 0);
        token2.content = columns[i].trim();
        token2.children = [];
        token2 = state.push("th_close", "th", -1);
      }
      token2 = state.push("tr_close", "tr", -1);
      token2 = state.push("thead_close", "thead", -1);
      for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
        if (state.sCount[nextLine] < state.blkIndent) {
          break;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
        lineText = getLine(state, nextLine).trim();
        if (!lineText) {
          break;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          break;
        }
        columns = escapedSplit(lineText);
        if (columns.length && columns[0] === "") columns.shift();
        if (columns.length && columns[columns.length - 1] === "") columns.pop();
        if (nextLine === startLine + 2) {
          token2 = state.push("tbody_open", "tbody", 1);
          token2.map = tbodyLines = [startLine + 2, 0];
        }
        token2 = state.push("tr_open", "tr", 1);
        token2.map = [nextLine, nextLine + 1];
        for (i = 0; i < columnCount; i++) {
          token2 = state.push("td_open", "td", 1);
          if (aligns[i]) {
            token2.attrs = [["style", "text-align:" + aligns[i]]];
          }
          token2 = state.push("inline", "", 0);
          token2.content = columns[i] ? columns[i].trim() : "";
          token2.children = [];
          token2 = state.push("td_close", "td", -1);
        }
        token2 = state.push("tr_close", "tr", -1);
      }
      if (tbodyLines) {
        token2 = state.push("tbody_close", "tbody", -1);
        tbodyLines[1] = nextLine;
      }
      token2 = state.push("table_close", "table", -1);
      tableLines[1] = nextLine;
      state.parentType = oldParentType;
      state.line = nextLine;
      return true;
    };
    return table;
  }
  var code;
  var hasRequiredCode;
  function requireCode() {
    if (hasRequiredCode) return code;
    hasRequiredCode = 1;
    code = function code2(state, startLine, endLine) {
      var nextLine, last, token2;
      if (state.sCount[startLine] - state.blkIndent < 4) {
        return false;
      }
      last = nextLine = startLine + 1;
      while (nextLine < endLine) {
        if (state.isEmpty(nextLine)) {
          nextLine++;
          continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          nextLine++;
          last = nextLine;
          continue;
        }
        break;
      }
      state.line = last;
      token2 = state.push("code_block", "code", 0);
      token2.content = state.getLines(startLine, last, 4 + state.blkIndent, false) + "\n";
      token2.map = [startLine, state.line];
      return true;
    };
    return code;
  }
  var fence;
  var hasRequiredFence;
  function requireFence() {
    if (hasRequiredFence) return fence;
    hasRequiredFence = 1;
    fence = function fence2(state, startLine, endLine, silent) {
      var marker2, len, params, nextLine, mem, token2, markup, haveEndMarker = false, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (pos + 3 > max) {
        return false;
      }
      marker2 = state.src.charCodeAt(pos);
      if (marker2 !== 126 && marker2 !== 96) {
        return false;
      }
      mem = pos;
      pos = state.skipChars(pos, marker2);
      len = pos - mem;
      if (len < 3) {
        return false;
      }
      markup = state.src.slice(mem, pos);
      params = state.src.slice(pos, max);
      if (marker2 === 96) {
        if (params.indexOf(String.fromCharCode(marker2)) >= 0) {
          return false;
        }
      }
      if (silent) {
        return true;
      }
      nextLine = startLine;
      for (; ; ) {
        nextLine++;
        if (nextLine >= endLine) {
          break;
        }
        pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos < max && state.sCount[nextLine] < state.blkIndent) {
          break;
        }
        if (state.src.charCodeAt(pos) !== marker2) {
          continue;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          continue;
        }
        pos = state.skipChars(pos, marker2);
        if (pos - mem < len) {
          continue;
        }
        pos = state.skipSpaces(pos);
        if (pos < max) {
          continue;
        }
        haveEndMarker = true;
        break;
      }
      len = state.sCount[startLine];
      state.line = nextLine + (haveEndMarker ? 1 : 0);
      token2 = state.push("fence", "code", 0);
      token2.info = params;
      token2.content = state.getLines(startLine + 1, nextLine, len, true);
      token2.markup = markup;
      token2.map = [startLine, state.line];
      return true;
    };
    return fence;
  }
  var blockquote;
  var hasRequiredBlockquote;
  function requireBlockquote() {
    if (hasRequiredBlockquote) return blockquote;
    hasRequiredBlockquote = 1;
    var isSpace = requireUtils().isSpace;
    blockquote = function blockquote2(state, startLine, endLine, silent) {
      var adjustTab, ch, i, initial, l, lastLineEmpty, lines, nextLine, offset, oldBMarks, oldBSCount, oldIndent, oldParentType, oldSCount, oldTShift, spaceAfterMarker, terminate, terminatorRules, token2, isOutdented, oldLineMax = state.lineMax, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== 62) {
        return false;
      }
      if (silent) {
        return true;
      }
      oldBMarks = [];
      oldBSCount = [];
      oldSCount = [];
      oldTShift = [];
      terminatorRules = state.md.block.ruler.getRules("blockquote");
      oldParentType = state.parentType;
      state.parentType = "blockquote";
      for (nextLine = startLine; nextLine < endLine; nextLine++) {
        isOutdented = state.sCount[nextLine] < state.blkIndent;
        pos = state.bMarks[nextLine] + state.tShift[nextLine];
        max = state.eMarks[nextLine];
        if (pos >= max) {
          break;
        }
        if (state.src.charCodeAt(pos++) === 62 && !isOutdented) {
          initial = state.sCount[nextLine] + 1;
          if (state.src.charCodeAt(pos) === 32) {
            pos++;
            initial++;
            adjustTab = false;
            spaceAfterMarker = true;
          } else if (state.src.charCodeAt(pos) === 9) {
            spaceAfterMarker = true;
            if ((state.bsCount[nextLine] + initial) % 4 === 3) {
              pos++;
              initial++;
              adjustTab = false;
            } else {
              adjustTab = true;
            }
          } else {
            spaceAfterMarker = false;
          }
          offset = initial;
          oldBMarks.push(state.bMarks[nextLine]);
          state.bMarks[nextLine] = pos;
          while (pos < max) {
            ch = state.src.charCodeAt(pos);
            if (isSpace(ch)) {
              if (ch === 9) {
                offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
              } else {
                offset++;
              }
            } else {
              break;
            }
            pos++;
          }
          lastLineEmpty = pos >= max;
          oldBSCount.push(state.bsCount[nextLine]);
          state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);
          oldSCount.push(state.sCount[nextLine]);
          state.sCount[nextLine] = offset - initial;
          oldTShift.push(state.tShift[nextLine]);
          state.tShift[nextLine] = pos - state.bMarks[nextLine];
          continue;
        }
        if (lastLineEmpty) {
          break;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          state.lineMax = nextLine;
          if (state.blkIndent !== 0) {
            oldBMarks.push(state.bMarks[nextLine]);
            oldBSCount.push(state.bsCount[nextLine]);
            oldTShift.push(state.tShift[nextLine]);
            oldSCount.push(state.sCount[nextLine]);
            state.sCount[nextLine] -= state.blkIndent;
          }
          break;
        }
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] = -1;
      }
      oldIndent = state.blkIndent;
      state.blkIndent = 0;
      token2 = state.push("blockquote_open", "blockquote", 1);
      token2.markup = ">";
      token2.map = lines = [startLine, 0];
      state.md.block.tokenize(state, startLine, nextLine);
      token2 = state.push("blockquote_close", "blockquote", -1);
      token2.markup = ">";
      state.lineMax = oldLineMax;
      state.parentType = oldParentType;
      lines[1] = state.line;
      for (i = 0; i < oldTShift.length; i++) {
        state.bMarks[i + startLine] = oldBMarks[i];
        state.tShift[i + startLine] = oldTShift[i];
        state.sCount[i + startLine] = oldSCount[i];
        state.bsCount[i + startLine] = oldBSCount[i];
      }
      state.blkIndent = oldIndent;
      return true;
    };
    return blockquote;
  }
  var hr;
  var hasRequiredHr;
  function requireHr() {
    if (hasRequiredHr) return hr;
    hasRequiredHr = 1;
    var isSpace = requireUtils().isSpace;
    hr = function hr2(state, startLine, endLine, silent) {
      var marker2, cnt, ch, token2, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      marker2 = state.src.charCodeAt(pos++);
      if (marker2 !== 42 && marker2 !== 45 && marker2 !== 95) {
        return false;
      }
      cnt = 1;
      while (pos < max) {
        ch = state.src.charCodeAt(pos++);
        if (ch !== marker2 && !isSpace(ch)) {
          return false;
        }
        if (ch === marker2) {
          cnt++;
        }
      }
      if (cnt < 3) {
        return false;
      }
      if (silent) {
        return true;
      }
      state.line = startLine + 1;
      token2 = state.push("hr", "hr", 0);
      token2.map = [startLine, state.line];
      token2.markup = Array(cnt + 1).join(String.fromCharCode(marker2));
      return true;
    };
    return hr;
  }
  var list;
  var hasRequiredList;
  function requireList() {
    if (hasRequiredList) return list;
    hasRequiredList = 1;
    var isSpace = requireUtils().isSpace;
    function skipBulletListMarker(state, startLine) {
      var marker2, pos, max, ch;
      pos = state.bMarks[startLine] + state.tShift[startLine];
      max = state.eMarks[startLine];
      marker2 = state.src.charCodeAt(pos++);
      if (marker2 !== 42 && marker2 !== 45 && marker2 !== 43) {
        return -1;
      }
      if (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!isSpace(ch)) {
          return -1;
        }
      }
      return pos;
    }
    function skipOrderedListMarker(state, startLine) {
      var ch, start = state.bMarks[startLine] + state.tShift[startLine], pos = start, max = state.eMarks[startLine];
      if (pos + 1 >= max) {
        return -1;
      }
      ch = state.src.charCodeAt(pos++);
      if (ch < 48 || ch > 57) {
        return -1;
      }
      for (; ; ) {
        if (pos >= max) {
          return -1;
        }
        ch = state.src.charCodeAt(pos++);
        if (ch >= 48 && ch <= 57) {
          if (pos - start >= 10) {
            return -1;
          }
          continue;
        }
        if (ch === 41 || ch === 46) {
          break;
        }
        return -1;
      }
      if (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!isSpace(ch)) {
          return -1;
        }
      }
      return pos;
    }
    function markTightParagraphs(state, idx) {
      var i, l, level = state.level + 2;
      for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
        if (state.tokens[i].level === level && state.tokens[i].type === "paragraph_open") {
          state.tokens[i + 2].hidden = true;
          state.tokens[i].hidden = true;
          i += 2;
        }
      }
    }
    list = function list2(state, startLine, endLine, silent) {
      var ch, contentStart, i, indent, indentAfterMarker, initial, isOrdered, itemLines, l, listLines, listTokIdx, markerCharCode, markerValue, max, offset, oldListIndent, oldParentType, oldSCount, oldTShift, oldTight, pos, posAfterMarker, prevEmptyEnd, start, terminate, terminatorRules, token2, nextLine = startLine, isTerminatingParagraph = false, tight = true;
      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        return false;
      }
      if (state.listIndent >= 0 && state.sCount[nextLine] - state.listIndent >= 4 && state.sCount[nextLine] < state.blkIndent) {
        return false;
      }
      if (silent && state.parentType === "paragraph") {
        if (state.sCount[nextLine] >= state.blkIndent) {
          isTerminatingParagraph = true;
        }
      }
      if ((posAfterMarker = skipOrderedListMarker(state, nextLine)) >= 0) {
        isOrdered = true;
        start = state.bMarks[nextLine] + state.tShift[nextLine];
        markerValue = Number(state.src.slice(start, posAfterMarker - 1));
        if (isTerminatingParagraph && markerValue !== 1) return false;
      } else if ((posAfterMarker = skipBulletListMarker(state, nextLine)) >= 0) {
        isOrdered = false;
      } else {
        return false;
      }
      if (isTerminatingParagraph) {
        if (state.skipSpaces(posAfterMarker) >= state.eMarks[nextLine]) return false;
      }
      if (silent) {
        return true;
      }
      markerCharCode = state.src.charCodeAt(posAfterMarker - 1);
      listTokIdx = state.tokens.length;
      if (isOrdered) {
        token2 = state.push("ordered_list_open", "ol", 1);
        if (markerValue !== 1) {
          token2.attrs = [["start", markerValue]];
        }
      } else {
        token2 = state.push("bullet_list_open", "ul", 1);
      }
      token2.map = listLines = [nextLine, 0];
      token2.markup = String.fromCharCode(markerCharCode);
      prevEmptyEnd = false;
      terminatorRules = state.md.block.ruler.getRules("list");
      oldParentType = state.parentType;
      state.parentType = "list";
      while (nextLine < endLine) {
        pos = posAfterMarker;
        max = state.eMarks[nextLine];
        initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[nextLine] + state.tShift[nextLine]);
        while (pos < max) {
          ch = state.src.charCodeAt(pos);
          if (ch === 9) {
            offset += 4 - (offset + state.bsCount[nextLine]) % 4;
          } else if (ch === 32) {
            offset++;
          } else {
            break;
          }
          pos++;
        }
        contentStart = pos;
        if (contentStart >= max) {
          indentAfterMarker = 1;
        } else {
          indentAfterMarker = offset - initial;
        }
        if (indentAfterMarker > 4) {
          indentAfterMarker = 1;
        }
        indent = initial + indentAfterMarker;
        token2 = state.push("list_item_open", "li", 1);
        token2.markup = String.fromCharCode(markerCharCode);
        token2.map = itemLines = [nextLine, 0];
        if (isOrdered) {
          token2.info = state.src.slice(start, posAfterMarker - 1);
        }
        oldTight = state.tight;
        oldTShift = state.tShift[nextLine];
        oldSCount = state.sCount[nextLine];
        oldListIndent = state.listIndent;
        state.listIndent = state.blkIndent;
        state.blkIndent = indent;
        state.tight = true;
        state.tShift[nextLine] = contentStart - state.bMarks[nextLine];
        state.sCount[nextLine] = offset;
        if (contentStart >= max && state.isEmpty(nextLine + 1)) {
          state.line = Math.min(state.line + 2, endLine);
        } else {
          state.md.block.tokenize(state, nextLine, endLine, true);
        }
        if (!state.tight || prevEmptyEnd) {
          tight = false;
        }
        prevEmptyEnd = state.line - nextLine > 1 && state.isEmpty(state.line - 1);
        state.blkIndent = state.listIndent;
        state.listIndent = oldListIndent;
        state.tShift[nextLine] = oldTShift;
        state.sCount[nextLine] = oldSCount;
        state.tight = oldTight;
        token2 = state.push("list_item_close", "li", -1);
        token2.markup = String.fromCharCode(markerCharCode);
        nextLine = state.line;
        itemLines[1] = nextLine;
        if (nextLine >= endLine) {
          break;
        }
        if (state.sCount[nextLine] < state.blkIndent) {
          break;
        }
        if (state.sCount[nextLine] - state.blkIndent >= 4) {
          break;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
        if (isOrdered) {
          posAfterMarker = skipOrderedListMarker(state, nextLine);
          if (posAfterMarker < 0) {
            break;
          }
          start = state.bMarks[nextLine] + state.tShift[nextLine];
        } else {
          posAfterMarker = skipBulletListMarker(state, nextLine);
          if (posAfterMarker < 0) {
            break;
          }
        }
        if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) {
          break;
        }
      }
      if (isOrdered) {
        token2 = state.push("ordered_list_close", "ol", -1);
      } else {
        token2 = state.push("bullet_list_close", "ul", -1);
      }
      token2.markup = String.fromCharCode(markerCharCode);
      listLines[1] = nextLine;
      state.line = nextLine;
      state.parentType = oldParentType;
      if (tight) {
        markTightParagraphs(state, listTokIdx);
      }
      return true;
    };
    return list;
  }
  var reference;
  var hasRequiredReference;
  function requireReference() {
    if (hasRequiredReference) return reference;
    hasRequiredReference = 1;
    var normalizeReference = requireUtils().normalizeReference;
    var isSpace = requireUtils().isSpace;
    reference = function reference2(state, startLine, _endLine, silent) {
      var ch, destEndPos, destEndLineNo, endLine, href, i, l, label, labelEnd, oldParentType, res, start, str, terminate, terminatorRules, title, lines = 0, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine], nextLine = startLine + 1;
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== 91) {
        return false;
      }
      while (++pos < max) {
        if (state.src.charCodeAt(pos) === 93 && state.src.charCodeAt(pos - 1) !== 92) {
          if (pos + 1 === max) {
            return false;
          }
          if (state.src.charCodeAt(pos + 1) !== 58) {
            return false;
          }
          break;
        }
      }
      endLine = state.lineMax;
      terminatorRules = state.md.block.ruler.getRules("reference");
      oldParentType = state.parentType;
      state.parentType = "reference";
      for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        if (state.sCount[nextLine] - state.blkIndent > 3) {
          continue;
        }
        if (state.sCount[nextLine] < 0) {
          continue;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
      }
      str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
      max = str.length;
      for (pos = 1; pos < max; pos++) {
        ch = str.charCodeAt(pos);
        if (ch === 91) {
          return false;
        } else if (ch === 93) {
          labelEnd = pos;
          break;
        } else if (ch === 10) {
          lines++;
        } else if (ch === 92) {
          pos++;
          if (pos < max && str.charCodeAt(pos) === 10) {
            lines++;
          }
        }
      }
      if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 58) {
        return false;
      }
      for (pos = labelEnd + 2; pos < max; pos++) {
        ch = str.charCodeAt(pos);
        if (ch === 10) {
          lines++;
        } else if (isSpace(ch)) ;
        else {
          break;
        }
      }
      res = state.md.helpers.parseLinkDestination(str, pos, max);
      if (!res.ok) {
        return false;
      }
      href = state.md.normalizeLink(res.str);
      if (!state.md.validateLink(href)) {
        return false;
      }
      pos = res.pos;
      lines += res.lines;
      destEndPos = pos;
      destEndLineNo = lines;
      start = pos;
      for (; pos < max; pos++) {
        ch = str.charCodeAt(pos);
        if (ch === 10) {
          lines++;
        } else if (isSpace(ch)) ;
        else {
          break;
        }
      }
      res = state.md.helpers.parseLinkTitle(str, pos, max);
      if (pos < max && start !== pos && res.ok) {
        title = res.str;
        pos = res.pos;
        lines += res.lines;
      } else {
        title = "";
        pos = destEndPos;
        lines = destEndLineNo;
      }
      while (pos < max) {
        ch = str.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
        pos++;
      }
      if (pos < max && str.charCodeAt(pos) !== 10) {
        if (title) {
          title = "";
          pos = destEndPos;
          lines = destEndLineNo;
          while (pos < max) {
            ch = str.charCodeAt(pos);
            if (!isSpace(ch)) {
              break;
            }
            pos++;
          }
        }
      }
      if (pos < max && str.charCodeAt(pos) !== 10) {
        return false;
      }
      label = normalizeReference(str.slice(1, labelEnd));
      if (!label) {
        return false;
      }
      if (silent) {
        return true;
      }
      if (typeof state.env.references === "undefined") {
        state.env.references = {};
      }
      if (typeof state.env.references[label] === "undefined") {
        state.env.references[label] = { title, href };
      }
      state.parentType = oldParentType;
      state.line = startLine + lines + 1;
      return true;
    };
    return reference;
  }
  var html_blocks;
  var hasRequiredHtml_blocks;
  function requireHtml_blocks() {
    if (hasRequiredHtml_blocks) return html_blocks;
    hasRequiredHtml_blocks = 1;
    html_blocks = [
      "address",
      "article",
      "aside",
      "base",
      "basefont",
      "blockquote",
      "body",
      "caption",
      "center",
      "col",
      "colgroup",
      "dd",
      "details",
      "dialog",
      "dir",
      "div",
      "dl",
      "dt",
      "fieldset",
      "figcaption",
      "figure",
      "footer",
      "form",
      "frame",
      "frameset",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "head",
      "header",
      "hr",
      "html",
      "iframe",
      "legend",
      "li",
      "link",
      "main",
      "menu",
      "menuitem",
      "nav",
      "noframes",
      "ol",
      "optgroup",
      "option",
      "p",
      "param",
      "section",
      "source",
      "summary",
      "table",
      "tbody",
      "td",
      "tfoot",
      "th",
      "thead",
      "title",
      "tr",
      "track",
      "ul"
    ];
    return html_blocks;
  }
  var html_re = {};
  var hasRequiredHtml_re;
  function requireHtml_re() {
    if (hasRequiredHtml_re) return html_re;
    hasRequiredHtml_re = 1;
    var attr_name = "[a-zA-Z_:][a-zA-Z0-9:._-]*";
    var unquoted = "[^\"'=<>`\\x00-\\x20]+";
    var single_quoted = "'[^']*'";
    var double_quoted = '"[^"]*"';
    var attr_value = "(?:" + unquoted + "|" + single_quoted + "|" + double_quoted + ")";
    var attribute = "(?:\\s+" + attr_name + "(?:\\s*=\\s*" + attr_value + ")?)";
    var open_tag = "<[A-Za-z][A-Za-z0-9\\-]*" + attribute + "*\\s*\\/?>";
    var close_tag = "<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>";
    var comment = "<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->";
    var processing = "<[?][\\s\\S]*?[?]>";
    var declaration = "<![A-Z]+\\s+[^>]*>";
    var cdata = "<!\\[CDATA\\[[\\s\\S]*?\\]\\]>";
    var HTML_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + "|" + comment + "|" + processing + "|" + declaration + "|" + cdata + ")");
    var HTML_OPEN_CLOSE_TAG_RE = new RegExp("^(?:" + open_tag + "|" + close_tag + ")");
    html_re.HTML_TAG_RE = HTML_TAG_RE;
    html_re.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;
    return html_re;
  }
  var html_block;
  var hasRequiredHtml_block;
  function requireHtml_block() {
    if (hasRequiredHtml_block) return html_block;
    hasRequiredHtml_block = 1;
    var block_names = requireHtml_blocks();
    var HTML_OPEN_CLOSE_TAG_RE = requireHtml_re().HTML_OPEN_CLOSE_TAG_RE;
    var HTML_SEQUENCES = [
      [/^<(script|pre|style|textarea)(?=(\s|>|$))/i, /<\/(script|pre|style|textarea)>/i, true],
      [/^<!--/, /-->/, true],
      [/^<\?/, /\?>/, true],
      [/^<![A-Z]/, />/, true],
      [/^<!\[CDATA\[/, /\]\]>/, true],
      [new RegExp("^</?(" + block_names.join("|") + ")(?=(\\s|/?>|$))", "i"), /^$/, true],
      [new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + "\\s*$"), /^$/, false]
    ];
    html_block = function html_block2(state, startLine, endLine, silent) {
      var i, nextLine, token2, lineText, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      if (!state.md.options.html) {
        return false;
      }
      if (state.src.charCodeAt(pos) !== 60) {
        return false;
      }
      lineText = state.src.slice(pos, max);
      for (i = 0; i < HTML_SEQUENCES.length; i++) {
        if (HTML_SEQUENCES[i][0].test(lineText)) {
          break;
        }
      }
      if (i === HTML_SEQUENCES.length) {
        return false;
      }
      if (silent) {
        return HTML_SEQUENCES[i][2];
      }
      nextLine = startLine + 1;
      if (!HTML_SEQUENCES[i][1].test(lineText)) {
        for (; nextLine < endLine; nextLine++) {
          if (state.sCount[nextLine] < state.blkIndent) {
            break;
          }
          pos = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          lineText = state.src.slice(pos, max);
          if (HTML_SEQUENCES[i][1].test(lineText)) {
            if (lineText.length !== 0) {
              nextLine++;
            }
            break;
          }
        }
      }
      state.line = nextLine;
      token2 = state.push("html_block", "", 0);
      token2.map = [startLine, nextLine];
      token2.content = state.getLines(startLine, nextLine, state.blkIndent, true);
      return true;
    };
    return html_block;
  }
  var heading;
  var hasRequiredHeading;
  function requireHeading() {
    if (hasRequiredHeading) return heading;
    hasRequiredHeading = 1;
    var isSpace = requireUtils().isSpace;
    heading = function heading2(state, startLine, endLine, silent) {
      var ch, level, tmp, token2, pos = state.bMarks[startLine] + state.tShift[startLine], max = state.eMarks[startLine];
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      ch = state.src.charCodeAt(pos);
      if (ch !== 35 || pos >= max) {
        return false;
      }
      level = 1;
      ch = state.src.charCodeAt(++pos);
      while (ch === 35 && pos < max && level <= 6) {
        level++;
        ch = state.src.charCodeAt(++pos);
      }
      if (level > 6 || pos < max && !isSpace(ch)) {
        return false;
      }
      if (silent) {
        return true;
      }
      max = state.skipSpacesBack(max, pos);
      tmp = state.skipCharsBack(max, 35, pos);
      if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
        max = tmp;
      }
      state.line = startLine + 1;
      token2 = state.push("heading_open", "h" + String(level), 1);
      token2.markup = "########".slice(0, level);
      token2.map = [startLine, state.line];
      token2 = state.push("inline", "", 0);
      token2.content = state.src.slice(pos, max).trim();
      token2.map = [startLine, state.line];
      token2.children = [];
      token2 = state.push("heading_close", "h" + String(level), -1);
      token2.markup = "########".slice(0, level);
      return true;
    };
    return heading;
  }
  var lheading;
  var hasRequiredLheading;
  function requireLheading() {
    if (hasRequiredLheading) return lheading;
    hasRequiredLheading = 1;
    lheading = function lheading2(state, startLine, endLine) {
      var content, terminate, i, l, token2, pos, max, level, marker2, nextLine = startLine + 1, oldParentType, terminatorRules = state.md.block.ruler.getRules("paragraph");
      if (state.sCount[startLine] - state.blkIndent >= 4) {
        return false;
      }
      oldParentType = state.parentType;
      state.parentType = "paragraph";
      for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        if (state.sCount[nextLine] - state.blkIndent > 3) {
          continue;
        }
        if (state.sCount[nextLine] >= state.blkIndent) {
          pos = state.bMarks[nextLine] + state.tShift[nextLine];
          max = state.eMarks[nextLine];
          if (pos < max) {
            marker2 = state.src.charCodeAt(pos);
            if (marker2 === 45 || marker2 === 61) {
              pos = state.skipChars(pos, marker2);
              pos = state.skipSpaces(pos);
              if (pos >= max) {
                level = marker2 === 61 ? 1 : 2;
                break;
              }
            }
          }
        }
        if (state.sCount[nextLine] < 0) {
          continue;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
      }
      if (!level) {
        return false;
      }
      content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
      state.line = nextLine + 1;
      token2 = state.push("heading_open", "h" + String(level), 1);
      token2.markup = String.fromCharCode(marker2);
      token2.map = [startLine, state.line];
      token2 = state.push("inline", "", 0);
      token2.content = content;
      token2.map = [startLine, state.line - 1];
      token2.children = [];
      token2 = state.push("heading_close", "h" + String(level), -1);
      token2.markup = String.fromCharCode(marker2);
      state.parentType = oldParentType;
      return true;
    };
    return lheading;
  }
  var paragraph;
  var hasRequiredParagraph;
  function requireParagraph() {
    if (hasRequiredParagraph) return paragraph;
    hasRequiredParagraph = 1;
    paragraph = function paragraph2(state, startLine, endLine) {
      var content, terminate, i, l, token2, oldParentType, nextLine = startLine + 1, terminatorRules = state.md.block.ruler.getRules("paragraph");
      oldParentType = state.parentType;
      state.parentType = "paragraph";
      for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
        if (state.sCount[nextLine] - state.blkIndent > 3) {
          continue;
        }
        if (state.sCount[nextLine] < 0) {
          continue;
        }
        terminate = false;
        for (i = 0, l = terminatorRules.length; i < l; i++) {
          if (terminatorRules[i](state, nextLine, endLine, true)) {
            terminate = true;
            break;
          }
        }
        if (terminate) {
          break;
        }
      }
      content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
      state.line = nextLine;
      token2 = state.push("paragraph_open", "p", 1);
      token2.map = [startLine, state.line];
      token2 = state.push("inline", "", 0);
      token2.content = content;
      token2.map = [startLine, state.line];
      token2.children = [];
      token2 = state.push("paragraph_close", "p", -1);
      state.parentType = oldParentType;
      return true;
    };
    return paragraph;
  }
  var state_block;
  var hasRequiredState_block;
  function requireState_block() {
    if (hasRequiredState_block) return state_block;
    hasRequiredState_block = 1;
    var Token = requireToken();
    var isSpace = requireUtils().isSpace;
    function StateBlock(src, md, env, tokens) {
      var ch, s, start, pos, len, indent, offset, indent_found;
      this.src = src;
      this.md = md;
      this.env = env;
      this.tokens = tokens;
      this.bMarks = [];
      this.eMarks = [];
      this.tShift = [];
      this.sCount = [];
      this.bsCount = [];
      this.blkIndent = 0;
      this.line = 0;
      this.lineMax = 0;
      this.tight = false;
      this.ddIndent = -1;
      this.listIndent = -1;
      this.parentType = "root";
      this.level = 0;
      this.result = "";
      s = this.src;
      indent_found = false;
      for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
        ch = s.charCodeAt(pos);
        if (!indent_found) {
          if (isSpace(ch)) {
            indent++;
            if (ch === 9) {
              offset += 4 - offset % 4;
            } else {
              offset++;
            }
            continue;
          } else {
            indent_found = true;
          }
        }
        if (ch === 10 || pos === len - 1) {
          if (ch !== 10) {
            pos++;
          }
          this.bMarks.push(start);
          this.eMarks.push(pos);
          this.tShift.push(indent);
          this.sCount.push(offset);
          this.bsCount.push(0);
          indent_found = false;
          indent = 0;
          offset = 0;
          start = pos + 1;
        }
      }
      this.bMarks.push(s.length);
      this.eMarks.push(s.length);
      this.tShift.push(0);
      this.sCount.push(0);
      this.bsCount.push(0);
      this.lineMax = this.bMarks.length - 1;
    }
    StateBlock.prototype.push = function(type, tag, nesting) {
      var token2 = new Token(type, tag, nesting);
      token2.block = true;
      if (nesting < 0) this.level--;
      token2.level = this.level;
      if (nesting > 0) this.level++;
      this.tokens.push(token2);
      return token2;
    };
    StateBlock.prototype.isEmpty = function isEmpty(line) {
      return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
    };
    StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
      for (var max = this.lineMax; from < max; from++) {
        if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
          break;
        }
      }
      return from;
    };
    StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
      var ch;
      for (var max = this.src.length; pos < max; pos++) {
        ch = this.src.charCodeAt(pos);
        if (!isSpace(ch)) {
          break;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
      if (pos <= min) {
        return pos;
      }
      while (pos > min) {
        if (!isSpace(this.src.charCodeAt(--pos))) {
          return pos + 1;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipChars = function skipChars(pos, code2) {
      for (var max = this.src.length; pos < max; pos++) {
        if (this.src.charCodeAt(pos) !== code2) {
          break;
        }
      }
      return pos;
    };
    StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code2, min) {
      if (pos <= min) {
        return pos;
      }
      while (pos > min) {
        if (code2 !== this.src.charCodeAt(--pos)) {
          return pos + 1;
        }
      }
      return pos;
    };
    StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
      var i, lineIndent, ch, first, last, queue, lineStart, line = begin;
      if (begin >= end) {
        return "";
      }
      queue = new Array(end - begin);
      for (i = 0; line < end; line++, i++) {
        lineIndent = 0;
        lineStart = first = this.bMarks[line];
        if (line + 1 < end || keepLastLF) {
          last = this.eMarks[line] + 1;
        } else {
          last = this.eMarks[line];
        }
        while (first < last && lineIndent < indent) {
          ch = this.src.charCodeAt(first);
          if (isSpace(ch)) {
            if (ch === 9) {
              lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
            } else {
              lineIndent++;
            }
          } else if (first - lineStart < this.tShift[line]) {
            lineIndent++;
          } else {
            break;
          }
          first++;
        }
        if (lineIndent > indent) {
          queue[i] = new Array(lineIndent - indent + 1).join(" ") + this.src.slice(first, last);
        } else {
          queue[i] = this.src.slice(first, last);
        }
      }
      return queue.join("");
    };
    StateBlock.prototype.Token = Token;
    state_block = StateBlock;
    return state_block;
  }
  var parser_block;
  var hasRequiredParser_block;
  function requireParser_block() {
    if (hasRequiredParser_block) return parser_block;
    hasRequiredParser_block = 1;
    var Ruler = requireRuler();
    var _rules = [
      // First 2 params - rule name & source. Secondary array - list of rules,
      // which can be terminated by this one.
      ["table", requireTable(), ["paragraph", "reference"]],
      ["code", requireCode()],
      ["fence", requireFence(), ["paragraph", "reference", "blockquote", "list"]],
      ["blockquote", requireBlockquote(), ["paragraph", "reference", "blockquote", "list"]],
      ["hr", requireHr(), ["paragraph", "reference", "blockquote", "list"]],
      ["list", requireList(), ["paragraph", "reference", "blockquote"]],
      ["reference", requireReference()],
      ["html_block", requireHtml_block(), ["paragraph", "reference", "blockquote"]],
      ["heading", requireHeading(), ["paragraph", "reference", "blockquote"]],
      ["lheading", requireLheading()],
      ["paragraph", requireParagraph()]
    ];
    function ParserBlock() {
      this.ruler = new Ruler();
      for (var i = 0; i < _rules.length; i++) {
        this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
      }
    }
    ParserBlock.prototype.tokenize = function(state, startLine, endLine) {
      var ok, i, prevLine, rules = this.ruler.getRules(""), len = rules.length, line = startLine, hasEmptyLines = false, maxNesting = state.md.options.maxNesting;
      while (line < endLine) {
        state.line = line = state.skipEmptyLines(line);
        if (line >= endLine) {
          break;
        }
        if (state.sCount[line] < state.blkIndent) {
          break;
        }
        if (state.level >= maxNesting) {
          state.line = endLine;
          break;
        }
        prevLine = state.line;
        for (i = 0; i < len; i++) {
          ok = rules[i](state, line, endLine, false);
          if (ok) {
            if (prevLine >= state.line) {
              throw new Error("block rule didn't increment state.line");
            }
            break;
          }
        }
        if (!ok) throw new Error("none of the block rules matched");
        state.tight = !hasEmptyLines;
        if (state.isEmpty(state.line - 1)) {
          hasEmptyLines = true;
        }
        line = state.line;
        if (line < endLine && state.isEmpty(line)) {
          hasEmptyLines = true;
          line++;
          state.line = line;
        }
      }
    };
    ParserBlock.prototype.parse = function(src, md, env, outTokens) {
      var state;
      if (!src) {
        return;
      }
      state = new this.State(src, md, env, outTokens);
      this.tokenize(state, state.line, state.lineMax);
    };
    ParserBlock.prototype.State = requireState_block();
    parser_block = ParserBlock;
    return parser_block;
  }
  var text;
  var hasRequiredText;
  function requireText() {
    if (hasRequiredText) return text;
    hasRequiredText = 1;
    function isTerminatorChar(ch) {
      switch (ch) {
        case 10:
        case 33:
        case 35:
        case 36:
        case 37:
        case 38:
        case 42:
        case 43:
        case 45:
        case 58:
        case 60:
        case 61:
        case 62:
        case 64:
        case 91:
        case 92:
        case 93:
        case 94:
        case 95:
        case 96:
        case 123:
        case 125:
        case 126:
          return true;
        default:
          return false;
      }
    }
    text = function text2(state, silent) {
      var pos = state.pos;
      while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
        pos++;
      }
      if (pos === state.pos) {
        return false;
      }
      if (!silent) {
        state.pending += state.src.slice(state.pos, pos);
      }
      state.pos = pos;
      return true;
    };
    return text;
  }
  var linkify;
  var hasRequiredLinkify;
  function requireLinkify() {
    if (hasRequiredLinkify) return linkify;
    hasRequiredLinkify = 1;
    var SCHEME_RE = /(?:^|[^a-z0-9.+-])([a-z][a-z0-9.+-]*)$/i;
    linkify = function linkify2(state, silent) {
      var pos, max, match, proto, link2, url, fullUrl, token2;
      if (!state.md.options.linkify) return false;
      if (state.linkLevel > 0) return false;
      pos = state.pos;
      max = state.posMax;
      if (pos + 3 > max) return false;
      if (state.src.charCodeAt(pos) !== 58) return false;
      if (state.src.charCodeAt(pos + 1) !== 47) return false;
      if (state.src.charCodeAt(pos + 2) !== 47) return false;
      match = state.pending.match(SCHEME_RE);
      if (!match) return false;
      proto = match[1];
      link2 = state.md.linkify.matchAtStart(state.src.slice(pos - proto.length));
      if (!link2) return false;
      url = link2.url;
      if (url.length <= proto.length) return false;
      url = url.replace(/\*+$/, "");
      fullUrl = state.md.normalizeLink(url);
      if (!state.md.validateLink(fullUrl)) return false;
      if (!silent) {
        state.pending = state.pending.slice(0, -proto.length);
        token2 = state.push("link_open", "a", 1);
        token2.attrs = [["href", fullUrl]];
        token2.markup = "linkify";
        token2.info = "auto";
        token2 = state.push("text", "", 0);
        token2.content = state.md.normalizeLinkText(url);
        token2 = state.push("link_close", "a", -1);
        token2.markup = "linkify";
        token2.info = "auto";
      }
      state.pos += url.length - proto.length;
      return true;
    };
    return linkify;
  }
  var newline;
  var hasRequiredNewline;
  function requireNewline() {
    if (hasRequiredNewline) return newline;
    hasRequiredNewline = 1;
    var isSpace = requireUtils().isSpace;
    newline = function newline2(state, silent) {
      var pmax, max, ws, pos = state.pos;
      if (state.src.charCodeAt(pos) !== 10) {
        return false;
      }
      pmax = state.pending.length - 1;
      max = state.posMax;
      if (!silent) {
        if (pmax >= 0 && state.pending.charCodeAt(pmax) === 32) {
          if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 32) {
            ws = pmax - 1;
            while (ws >= 1 && state.pending.charCodeAt(ws - 1) === 32) ws--;
            state.pending = state.pending.slice(0, ws);
            state.push("hardbreak", "br", 0);
          } else {
            state.pending = state.pending.slice(0, -1);
            state.push("softbreak", "br", 0);
          }
        } else {
          state.push("softbreak", "br", 0);
        }
      }
      pos++;
      while (pos < max && isSpace(state.src.charCodeAt(pos))) {
        pos++;
      }
      state.pos = pos;
      return true;
    };
    return newline;
  }
  var _escape;
  var hasRequired_escape;
  function require_escape() {
    if (hasRequired_escape) return _escape;
    hasRequired_escape = 1;
    var isSpace = requireUtils().isSpace;
    var ESCAPED = [];
    for (var i = 0; i < 256; i++) {
      ESCAPED.push(0);
    }
    "\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(ch) {
      ESCAPED[ch.charCodeAt(0)] = 1;
    });
    _escape = function escape(state, silent) {
      var ch1, ch2, origStr, escapedStr, token2, pos = state.pos, max = state.posMax;
      if (state.src.charCodeAt(pos) !== 92) return false;
      pos++;
      if (pos >= max) return false;
      ch1 = state.src.charCodeAt(pos);
      if (ch1 === 10) {
        if (!silent) {
          state.push("hardbreak", "br", 0);
        }
        pos++;
        while (pos < max) {
          ch1 = state.src.charCodeAt(pos);
          if (!isSpace(ch1)) break;
          pos++;
        }
        state.pos = pos;
        return true;
      }
      escapedStr = state.src[pos];
      if (ch1 >= 55296 && ch1 <= 56319 && pos + 1 < max) {
        ch2 = state.src.charCodeAt(pos + 1);
        if (ch2 >= 56320 && ch2 <= 57343) {
          escapedStr += state.src[pos + 1];
          pos++;
        }
      }
      origStr = "\\" + escapedStr;
      if (!silent) {
        token2 = state.push("text_special", "", 0);
        if (ch1 < 256 && ESCAPED[ch1] !== 0) {
          token2.content = escapedStr;
        } else {
          token2.content = origStr;
        }
        token2.markup = origStr;
        token2.info = "escape";
      }
      state.pos = pos + 1;
      return true;
    };
    return _escape;
  }
  var backticks;
  var hasRequiredBackticks;
  function requireBackticks() {
    if (hasRequiredBackticks) return backticks;
    hasRequiredBackticks = 1;
    backticks = function backtick(state, silent) {
      var start, max, marker2, token2, matchStart, matchEnd, openerLength, closerLength, pos = state.pos, ch = state.src.charCodeAt(pos);
      if (ch !== 96) {
        return false;
      }
      start = pos;
      pos++;
      max = state.posMax;
      while (pos < max && state.src.charCodeAt(pos) === 96) {
        pos++;
      }
      marker2 = state.src.slice(start, pos);
      openerLength = marker2.length;
      if (state.backticksScanned && (state.backticks[openerLength] || 0) <= start) {
        if (!silent) state.pending += marker2;
        state.pos += openerLength;
        return true;
      }
      matchEnd = pos;
      while ((matchStart = state.src.indexOf("`", matchEnd)) !== -1) {
        matchEnd = matchStart + 1;
        while (matchEnd < max && state.src.charCodeAt(matchEnd) === 96) {
          matchEnd++;
        }
        closerLength = matchEnd - matchStart;
        if (closerLength === openerLength) {
          if (!silent) {
            token2 = state.push("code_inline", "code", 0);
            token2.markup = marker2;
            token2.content = state.src.slice(pos, matchStart).replace(/\n/g, " ").replace(/^ (.+) $/, "$1");
          }
          state.pos = matchEnd;
          return true;
        }
        state.backticks[closerLength] = matchStart;
      }
      state.backticksScanned = true;
      if (!silent) state.pending += marker2;
      state.pos += openerLength;
      return true;
    };
    return backticks;
  }
  var strikethrough = {};
  var hasRequiredStrikethrough;
  function requireStrikethrough() {
    if (hasRequiredStrikethrough) return strikethrough;
    hasRequiredStrikethrough = 1;
    strikethrough.tokenize = function strikethrough2(state, silent) {
      var i, scanned, token2, len, ch, start = state.pos, marker2 = state.src.charCodeAt(start);
      if (silent) {
        return false;
      }
      if (marker2 !== 126) {
        return false;
      }
      scanned = state.scanDelims(state.pos, true);
      len = scanned.length;
      ch = String.fromCharCode(marker2);
      if (len < 2) {
        return false;
      }
      if (len % 2) {
        token2 = state.push("text", "", 0);
        token2.content = ch;
        len--;
      }
      for (i = 0; i < len; i += 2) {
        token2 = state.push("text", "", 0);
        token2.content = ch + ch;
        state.delimiters.push({
          marker: marker2,
          length: 0,
          // disable "rule of 3" length checks meant for emphasis
          token: state.tokens.length - 1,
          end: -1,
          open: scanned.can_open,
          close: scanned.can_close
        });
      }
      state.pos += scanned.length;
      return true;
    };
    function postProcess(state, delimiters) {
      var i, j, startDelim, endDelim, token2, loneMarkers = [], max = delimiters.length;
      for (i = 0; i < max; i++) {
        startDelim = delimiters[i];
        if (startDelim.marker !== 126) {
          continue;
        }
        if (startDelim.end === -1) {
          continue;
        }
        endDelim = delimiters[startDelim.end];
        token2 = state.tokens[startDelim.token];
        token2.type = "s_open";
        token2.tag = "s";
        token2.nesting = 1;
        token2.markup = "~~";
        token2.content = "";
        token2 = state.tokens[endDelim.token];
        token2.type = "s_close";
        token2.tag = "s";
        token2.nesting = -1;
        token2.markup = "~~";
        token2.content = "";
        if (state.tokens[endDelim.token - 1].type === "text" && state.tokens[endDelim.token - 1].content === "~") {
          loneMarkers.push(endDelim.token - 1);
        }
      }
      while (loneMarkers.length) {
        i = loneMarkers.pop();
        j = i + 1;
        while (j < state.tokens.length && state.tokens[j].type === "s_close") {
          j++;
        }
        j--;
        if (i !== j) {
          token2 = state.tokens[j];
          state.tokens[j] = state.tokens[i];
          state.tokens[i] = token2;
        }
      }
    }
    strikethrough.postProcess = function strikethrough2(state) {
      var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
      postProcess(state, state.delimiters);
      for (curr = 0; curr < max; curr++) {
        if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
          postProcess(state, tokens_meta[curr].delimiters);
        }
      }
    };
    return strikethrough;
  }
  var emphasis = {};
  var hasRequiredEmphasis;
  function requireEmphasis() {
    if (hasRequiredEmphasis) return emphasis;
    hasRequiredEmphasis = 1;
    emphasis.tokenize = function emphasis2(state, silent) {
      var i, scanned, token2, start = state.pos, marker2 = state.src.charCodeAt(start);
      if (silent) {
        return false;
      }
      if (marker2 !== 95 && marker2 !== 42) {
        return false;
      }
      scanned = state.scanDelims(state.pos, marker2 === 42);
      for (i = 0; i < scanned.length; i++) {
        token2 = state.push("text", "", 0);
        token2.content = String.fromCharCode(marker2);
        state.delimiters.push({
          // Char code of the starting marker (number).
          //
          marker: marker2,
          // Total length of these series of delimiters.
          //
          length: scanned.length,
          // A position of the token this delimiter corresponds to.
          //
          token: state.tokens.length - 1,
          // If this delimiter is matched as a valid opener, `end` will be
          // equal to its position, otherwise it's `-1`.
          //
          end: -1,
          // Boolean flags that determine if this delimiter could open or close
          // an emphasis.
          //
          open: scanned.can_open,
          close: scanned.can_close
        });
      }
      state.pos += scanned.length;
      return true;
    };
    function postProcess(state, delimiters) {
      var i, startDelim, endDelim, token2, ch, isStrong, max = delimiters.length;
      for (i = max - 1; i >= 0; i--) {
        startDelim = delimiters[i];
        if (startDelim.marker !== 95 && startDelim.marker !== 42) {
          continue;
        }
        if (startDelim.end === -1) {
          continue;
        }
        endDelim = delimiters[startDelim.end];
        isStrong = i > 0 && delimiters[i - 1].end === startDelim.end + 1 && // check that first two markers match and adjacent
        delimiters[i - 1].marker === startDelim.marker && delimiters[i - 1].token === startDelim.token - 1 && // check that last two markers are adjacent (we can safely assume they match)
        delimiters[startDelim.end + 1].token === endDelim.token + 1;
        ch = String.fromCharCode(startDelim.marker);
        token2 = state.tokens[startDelim.token];
        token2.type = isStrong ? "strong_open" : "em_open";
        token2.tag = isStrong ? "strong" : "em";
        token2.nesting = 1;
        token2.markup = isStrong ? ch + ch : ch;
        token2.content = "";
        token2 = state.tokens[endDelim.token];
        token2.type = isStrong ? "strong_close" : "em_close";
        token2.tag = isStrong ? "strong" : "em";
        token2.nesting = -1;
        token2.markup = isStrong ? ch + ch : ch;
        token2.content = "";
        if (isStrong) {
          state.tokens[delimiters[i - 1].token].content = "";
          state.tokens[delimiters[startDelim.end + 1].token].content = "";
          i--;
        }
      }
    }
    emphasis.postProcess = function emphasis2(state) {
      var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
      postProcess(state, state.delimiters);
      for (curr = 0; curr < max; curr++) {
        if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
          postProcess(state, tokens_meta[curr].delimiters);
        }
      }
    };
    return emphasis;
  }
  var link;
  var hasRequiredLink;
  function requireLink() {
    if (hasRequiredLink) return link;
    hasRequiredLink = 1;
    var normalizeReference = requireUtils().normalizeReference;
    var isSpace = requireUtils().isSpace;
    link = function link2(state, silent) {
      var attrs, code2, label, labelEnd, labelStart, pos, res, ref2, token2, href = "", title = "", oldPos = state.pos, max = state.posMax, start = state.pos, parseReference = true;
      if (state.src.charCodeAt(state.pos) !== 91) {
        return false;
      }
      labelStart = state.pos + 1;
      labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);
      if (labelEnd < 0) {
        return false;
      }
      pos = labelEnd + 1;
      if (pos < max && state.src.charCodeAt(pos) === 40) {
        parseReference = false;
        pos++;
        for (; pos < max; pos++) {
          code2 = state.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) {
            break;
          }
        }
        if (pos >= max) {
          return false;
        }
        start = pos;
        res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
        if (res.ok) {
          href = state.md.normalizeLink(res.str);
          if (state.md.validateLink(href)) {
            pos = res.pos;
          } else {
            href = "";
          }
          start = pos;
          for (; pos < max; pos++) {
            code2 = state.src.charCodeAt(pos);
            if (!isSpace(code2) && code2 !== 10) {
              break;
            }
          }
          res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
          if (pos < max && start !== pos && res.ok) {
            title = res.str;
            pos = res.pos;
            for (; pos < max; pos++) {
              code2 = state.src.charCodeAt(pos);
              if (!isSpace(code2) && code2 !== 10) {
                break;
              }
            }
          }
        }
        if (pos >= max || state.src.charCodeAt(pos) !== 41) {
          parseReference = true;
        }
        pos++;
      }
      if (parseReference) {
        if (typeof state.env.references === "undefined") {
          return false;
        }
        if (pos < max && state.src.charCodeAt(pos) === 91) {
          start = pos + 1;
          pos = state.md.helpers.parseLinkLabel(state, pos);
          if (pos >= 0) {
            label = state.src.slice(start, pos++);
          } else {
            pos = labelEnd + 1;
          }
        } else {
          pos = labelEnd + 1;
        }
        if (!label) {
          label = state.src.slice(labelStart, labelEnd);
        }
        ref2 = state.env.references[normalizeReference(label)];
        if (!ref2) {
          state.pos = oldPos;
          return false;
        }
        href = ref2.href;
        title = ref2.title;
      }
      if (!silent) {
        state.pos = labelStart;
        state.posMax = labelEnd;
        token2 = state.push("link_open", "a", 1);
        token2.attrs = attrs = [["href", href]];
        if (title) {
          attrs.push(["title", title]);
        }
        state.linkLevel++;
        state.md.inline.tokenize(state);
        state.linkLevel--;
        token2 = state.push("link_close", "a", -1);
      }
      state.pos = pos;
      state.posMax = max;
      return true;
    };
    return link;
  }
  var image;
  var hasRequiredImage;
  function requireImage() {
    if (hasRequiredImage) return image;
    hasRequiredImage = 1;
    var normalizeReference = requireUtils().normalizeReference;
    var isSpace = requireUtils().isSpace;
    image = function image2(state, silent) {
      var attrs, code2, content, label, labelEnd, labelStart, pos, ref2, res, title, token2, tokens, start, href = "", oldPos = state.pos, max = state.posMax;
      if (state.src.charCodeAt(state.pos) !== 33) {
        return false;
      }
      if (state.src.charCodeAt(state.pos + 1) !== 91) {
        return false;
      }
      labelStart = state.pos + 2;
      labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);
      if (labelEnd < 0) {
        return false;
      }
      pos = labelEnd + 1;
      if (pos < max && state.src.charCodeAt(pos) === 40) {
        pos++;
        for (; pos < max; pos++) {
          code2 = state.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) {
            break;
          }
        }
        if (pos >= max) {
          return false;
        }
        start = pos;
        res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
        if (res.ok) {
          href = state.md.normalizeLink(res.str);
          if (state.md.validateLink(href)) {
            pos = res.pos;
          } else {
            href = "";
          }
        }
        start = pos;
        for (; pos < max; pos++) {
          code2 = state.src.charCodeAt(pos);
          if (!isSpace(code2) && code2 !== 10) {
            break;
          }
        }
        res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
        if (pos < max && start !== pos && res.ok) {
          title = res.str;
          pos = res.pos;
          for (; pos < max; pos++) {
            code2 = state.src.charCodeAt(pos);
            if (!isSpace(code2) && code2 !== 10) {
              break;
            }
          }
        } else {
          title = "";
        }
        if (pos >= max || state.src.charCodeAt(pos) !== 41) {
          state.pos = oldPos;
          return false;
        }
        pos++;
      } else {
        if (typeof state.env.references === "undefined") {
          return false;
        }
        if (pos < max && state.src.charCodeAt(pos) === 91) {
          start = pos + 1;
          pos = state.md.helpers.parseLinkLabel(state, pos);
          if (pos >= 0) {
            label = state.src.slice(start, pos++);
          } else {
            pos = labelEnd + 1;
          }
        } else {
          pos = labelEnd + 1;
        }
        if (!label) {
          label = state.src.slice(labelStart, labelEnd);
        }
        ref2 = state.env.references[normalizeReference(label)];
        if (!ref2) {
          state.pos = oldPos;
          return false;
        }
        href = ref2.href;
        title = ref2.title;
      }
      if (!silent) {
        content = state.src.slice(labelStart, labelEnd);
        state.md.inline.parse(
          content,
          state.md,
          state.env,
          tokens = []
        );
        token2 = state.push("image", "img", 0);
        token2.attrs = attrs = [["src", href], ["alt", ""]];
        token2.children = tokens;
        token2.content = content;
        if (title) {
          attrs.push(["title", title]);
        }
      }
      state.pos = pos;
      state.posMax = max;
      return true;
    };
    return image;
  }
  var autolink;
  var hasRequiredAutolink;
  function requireAutolink() {
    if (hasRequiredAutolink) return autolink;
    hasRequiredAutolink = 1;
    var EMAIL_RE = /^([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/;
    var AUTOLINK_RE = /^([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)$/;
    autolink = function autolink2(state, silent) {
      var url, fullUrl, token2, ch, start, max, pos = state.pos;
      if (state.src.charCodeAt(pos) !== 60) {
        return false;
      }
      start = state.pos;
      max = state.posMax;
      for (; ; ) {
        if (++pos >= max) return false;
        ch = state.src.charCodeAt(pos);
        if (ch === 60) return false;
        if (ch === 62) break;
      }
      url = state.src.slice(start + 1, pos);
      if (AUTOLINK_RE.test(url)) {
        fullUrl = state.md.normalizeLink(url);
        if (!state.md.validateLink(fullUrl)) {
          return false;
        }
        if (!silent) {
          token2 = state.push("link_open", "a", 1);
          token2.attrs = [["href", fullUrl]];
          token2.markup = "autolink";
          token2.info = "auto";
          token2 = state.push("text", "", 0);
          token2.content = state.md.normalizeLinkText(url);
          token2 = state.push("link_close", "a", -1);
          token2.markup = "autolink";
          token2.info = "auto";
        }
        state.pos += url.length + 2;
        return true;
      }
      if (EMAIL_RE.test(url)) {
        fullUrl = state.md.normalizeLink("mailto:" + url);
        if (!state.md.validateLink(fullUrl)) {
          return false;
        }
        if (!silent) {
          token2 = state.push("link_open", "a", 1);
          token2.attrs = [["href", fullUrl]];
          token2.markup = "autolink";
          token2.info = "auto";
          token2 = state.push("text", "", 0);
          token2.content = state.md.normalizeLinkText(url);
          token2 = state.push("link_close", "a", -1);
          token2.markup = "autolink";
          token2.info = "auto";
        }
        state.pos += url.length + 2;
        return true;
      }
      return false;
    };
    return autolink;
  }
  var html_inline;
  var hasRequiredHtml_inline;
  function requireHtml_inline() {
    if (hasRequiredHtml_inline) return html_inline;
    hasRequiredHtml_inline = 1;
    var HTML_TAG_RE = requireHtml_re().HTML_TAG_RE;
    function isLinkOpen(str) {
      return /^<a[>\s]/i.test(str);
    }
    function isLinkClose(str) {
      return /^<\/a\s*>/i.test(str);
    }
    function isLetter(ch) {
      var lc = ch | 32;
      return lc >= 97 && lc <= 122;
    }
    html_inline = function html_inline2(state, silent) {
      var ch, match, max, token2, pos = state.pos;
      if (!state.md.options.html) {
        return false;
      }
      max = state.posMax;
      if (state.src.charCodeAt(pos) !== 60 || pos + 2 >= max) {
        return false;
      }
      ch = state.src.charCodeAt(pos + 1);
      if (ch !== 33 && ch !== 63 && ch !== 47 && !isLetter(ch)) {
        return false;
      }
      match = state.src.slice(pos).match(HTML_TAG_RE);
      if (!match) {
        return false;
      }
      if (!silent) {
        token2 = state.push("html_inline", "", 0);
        token2.content = match[0];
        if (isLinkOpen(token2.content)) state.linkLevel++;
        if (isLinkClose(token2.content)) state.linkLevel--;
      }
      state.pos += match[0].length;
      return true;
    };
    return html_inline;
  }
  var entity;
  var hasRequiredEntity;
  function requireEntity() {
    if (hasRequiredEntity) return entity;
    hasRequiredEntity = 1;
    var entities2 = requireEntities();
    var has = requireUtils().has;
    var isValidEntityCode = requireUtils().isValidEntityCode;
    var fromCodePoint = requireUtils().fromCodePoint;
    var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i;
    var NAMED_RE = /^&([a-z][a-z0-9]{1,31});/i;
    entity = function entity2(state, silent) {
      var ch, code2, match, token2, pos = state.pos, max = state.posMax;
      if (state.src.charCodeAt(pos) !== 38) return false;
      if (pos + 1 >= max) return false;
      ch = state.src.charCodeAt(pos + 1);
      if (ch === 35) {
        match = state.src.slice(pos).match(DIGITAL_RE);
        if (match) {
          if (!silent) {
            code2 = match[1][0].toLowerCase() === "x" ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
            token2 = state.push("text_special", "", 0);
            token2.content = isValidEntityCode(code2) ? fromCodePoint(code2) : fromCodePoint(65533);
            token2.markup = match[0];
            token2.info = "entity";
          }
          state.pos += match[0].length;
          return true;
        }
      } else {
        match = state.src.slice(pos).match(NAMED_RE);
        if (match) {
          if (has(entities2, match[1])) {
            if (!silent) {
              token2 = state.push("text_special", "", 0);
              token2.content = entities2[match[1]];
              token2.markup = match[0];
              token2.info = "entity";
            }
            state.pos += match[0].length;
            return true;
          }
        }
      }
      return false;
    };
    return entity;
  }
  var balance_pairs;
  var hasRequiredBalance_pairs;
  function requireBalance_pairs() {
    if (hasRequiredBalance_pairs) return balance_pairs;
    hasRequiredBalance_pairs = 1;
    function processDelimiters(delimiters) {
      var closerIdx, openerIdx, closer, opener, minOpenerIdx, newMinOpenerIdx, isOddMatch, lastJump, openersBottom = {}, max = delimiters.length;
      if (!max) return;
      var headerIdx = 0;
      var lastTokenIdx = -2;
      var jumps = [];
      for (closerIdx = 0; closerIdx < max; closerIdx++) {
        closer = delimiters[closerIdx];
        jumps.push(0);
        if (delimiters[headerIdx].marker !== closer.marker || lastTokenIdx !== closer.token - 1) {
          headerIdx = closerIdx;
        }
        lastTokenIdx = closer.token;
        closer.length = closer.length || 0;
        if (!closer.close) continue;
        if (!openersBottom.hasOwnProperty(closer.marker)) {
          openersBottom[closer.marker] = [-1, -1, -1, -1, -1, -1];
        }
        minOpenerIdx = openersBottom[closer.marker][(closer.open ? 3 : 0) + closer.length % 3];
        openerIdx = headerIdx - jumps[headerIdx] - 1;
        newMinOpenerIdx = openerIdx;
        for (; openerIdx > minOpenerIdx; openerIdx -= jumps[openerIdx] + 1) {
          opener = delimiters[openerIdx];
          if (opener.marker !== closer.marker) continue;
          if (opener.open && opener.end < 0) {
            isOddMatch = false;
            if (opener.close || closer.open) {
              if ((opener.length + closer.length) % 3 === 0) {
                if (opener.length % 3 !== 0 || closer.length % 3 !== 0) {
                  isOddMatch = true;
                }
              }
            }
            if (!isOddMatch) {
              lastJump = openerIdx > 0 && !delimiters[openerIdx - 1].open ? jumps[openerIdx - 1] + 1 : 0;
              jumps[closerIdx] = closerIdx - openerIdx + lastJump;
              jumps[openerIdx] = lastJump;
              closer.open = false;
              opener.end = closerIdx;
              opener.close = false;
              newMinOpenerIdx = -1;
              lastTokenIdx = -2;
              break;
            }
          }
        }
        if (newMinOpenerIdx !== -1) {
          openersBottom[closer.marker][(closer.open ? 3 : 0) + (closer.length || 0) % 3] = newMinOpenerIdx;
        }
      }
    }
    balance_pairs = function link_pairs(state) {
      var curr, tokens_meta = state.tokens_meta, max = state.tokens_meta.length;
      processDelimiters(state.delimiters);
      for (curr = 0; curr < max; curr++) {
        if (tokens_meta[curr] && tokens_meta[curr].delimiters) {
          processDelimiters(tokens_meta[curr].delimiters);
        }
      }
    };
    return balance_pairs;
  }
  var fragments_join;
  var hasRequiredFragments_join;
  function requireFragments_join() {
    if (hasRequiredFragments_join) return fragments_join;
    hasRequiredFragments_join = 1;
    fragments_join = function fragments_join2(state) {
      var curr, last, level = 0, tokens = state.tokens, max = state.tokens.length;
      for (curr = last = 0; curr < max; curr++) {
        if (tokens[curr].nesting < 0) level--;
        tokens[curr].level = level;
        if (tokens[curr].nesting > 0) level++;
        if (tokens[curr].type === "text" && curr + 1 < max && tokens[curr + 1].type === "text") {
          tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
        } else {
          if (curr !== last) {
            tokens[last] = tokens[curr];
          }
          last++;
        }
      }
      if (curr !== last) {
        tokens.length = last;
      }
    };
    return fragments_join;
  }
  var state_inline;
  var hasRequiredState_inline;
  function requireState_inline() {
    if (hasRequiredState_inline) return state_inline;
    hasRequiredState_inline = 1;
    var Token = requireToken();
    var isWhiteSpace = requireUtils().isWhiteSpace;
    var isPunctChar = requireUtils().isPunctChar;
    var isMdAsciiPunct = requireUtils().isMdAsciiPunct;
    function StateInline(src, md, env, outTokens) {
      this.src = src;
      this.env = env;
      this.md = md;
      this.tokens = outTokens;
      this.tokens_meta = Array(outTokens.length);
      this.pos = 0;
      this.posMax = this.src.length;
      this.level = 0;
      this.pending = "";
      this.pendingLevel = 0;
      this.cache = {};
      this.delimiters = [];
      this._prev_delimiters = [];
      this.backticks = {};
      this.backticksScanned = false;
      this.linkLevel = 0;
    }
    StateInline.prototype.pushPending = function() {
      var token2 = new Token("text", "", 0);
      token2.content = this.pending;
      token2.level = this.pendingLevel;
      this.tokens.push(token2);
      this.pending = "";
      return token2;
    };
    StateInline.prototype.push = function(type, tag, nesting) {
      if (this.pending) {
        this.pushPending();
      }
      var token2 = new Token(type, tag, nesting);
      var token_meta = null;
      if (nesting < 0) {
        this.level--;
        this.delimiters = this._prev_delimiters.pop();
      }
      token2.level = this.level;
      if (nesting > 0) {
        this.level++;
        this._prev_delimiters.push(this.delimiters);
        this.delimiters = [];
        token_meta = { delimiters: this.delimiters };
      }
      this.pendingLevel = this.level;
      this.tokens.push(token2);
      this.tokens_meta.push(token_meta);
      return token2;
    };
    StateInline.prototype.scanDelims = function(start, canSplitWord) {
      var pos = start, lastChar, nextChar, count, can_open, can_close, isLastWhiteSpace, isLastPunctChar, isNextWhiteSpace, isNextPunctChar, left_flanking = true, right_flanking = true, max = this.posMax, marker2 = this.src.charCodeAt(start);
      lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 32;
      while (pos < max && this.src.charCodeAt(pos) === marker2) {
        pos++;
      }
      count = pos - start;
      nextChar = pos < max ? this.src.charCodeAt(pos) : 32;
      isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
      isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));
      isLastWhiteSpace = isWhiteSpace(lastChar);
      isNextWhiteSpace = isWhiteSpace(nextChar);
      if (isNextWhiteSpace) {
        left_flanking = false;
      } else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) {
          left_flanking = false;
        }
      }
      if (isLastWhiteSpace) {
        right_flanking = false;
      } else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) {
          right_flanking = false;
        }
      }
      if (!canSplitWord) {
        can_open = left_flanking && (!right_flanking || isLastPunctChar);
        can_close = right_flanking && (!left_flanking || isNextPunctChar);
      } else {
        can_open = left_flanking;
        can_close = right_flanking;
      }
      return {
        can_open,
        can_close,
        length: count
      };
    };
    StateInline.prototype.Token = Token;
    state_inline = StateInline;
    return state_inline;
  }
  var parser_inline;
  var hasRequiredParser_inline;
  function requireParser_inline() {
    if (hasRequiredParser_inline) return parser_inline;
    hasRequiredParser_inline = 1;
    var Ruler = requireRuler();
    var _rules = [
      ["text", requireText()],
      ["linkify", requireLinkify()],
      ["newline", requireNewline()],
      ["escape", require_escape()],
      ["backticks", requireBackticks()],
      ["strikethrough", requireStrikethrough().tokenize],
      ["emphasis", requireEmphasis().tokenize],
      ["link", requireLink()],
      ["image", requireImage()],
      ["autolink", requireAutolink()],
      ["html_inline", requireHtml_inline()],
      ["entity", requireEntity()]
    ];
    var _rules2 = [
      ["balance_pairs", requireBalance_pairs()],
      ["strikethrough", requireStrikethrough().postProcess],
      ["emphasis", requireEmphasis().postProcess],
      // rules for pairs separate '**' into its own text tokens, which may be left unused,
      // rule below merges unused segments back with the rest of the text
      ["fragments_join", requireFragments_join()]
    ];
    function ParserInline() {
      var i;
      this.ruler = new Ruler();
      for (i = 0; i < _rules.length; i++) {
        this.ruler.push(_rules[i][0], _rules[i][1]);
      }
      this.ruler2 = new Ruler();
      for (i = 0; i < _rules2.length; i++) {
        this.ruler2.push(_rules2[i][0], _rules2[i][1]);
      }
    }
    ParserInline.prototype.skipToken = function(state) {
      var ok, i, pos = state.pos, rules = this.ruler.getRules(""), len = rules.length, maxNesting = state.md.options.maxNesting, cache = state.cache;
      if (typeof cache[pos] !== "undefined") {
        state.pos = cache[pos];
        return;
      }
      if (state.level < maxNesting) {
        for (i = 0; i < len; i++) {
          state.level++;
          ok = rules[i](state, true);
          state.level--;
          if (ok) {
            if (pos >= state.pos) {
              throw new Error("inline rule didn't increment state.pos");
            }
            break;
          }
        }
      } else {
        state.pos = state.posMax;
      }
      if (!ok) {
        state.pos++;
      }
      cache[pos] = state.pos;
    };
    ParserInline.prototype.tokenize = function(state) {
      var ok, i, prevPos, rules = this.ruler.getRules(""), len = rules.length, end = state.posMax, maxNesting = state.md.options.maxNesting;
      while (state.pos < end) {
        prevPos = state.pos;
        if (state.level < maxNesting) {
          for (i = 0; i < len; i++) {
            ok = rules[i](state, false);
            if (ok) {
              if (prevPos >= state.pos) {
                throw new Error("inline rule didn't increment state.pos");
              }
              break;
            }
          }
        }
        if (ok) {
          if (state.pos >= end) {
            break;
          }
          continue;
        }
        state.pending += state.src[state.pos++];
      }
      if (state.pending) {
        state.pushPending();
      }
    };
    ParserInline.prototype.parse = function(str, md, env, outTokens) {
      var i, rules, len;
      var state = new this.State(str, md, env, outTokens);
      this.tokenize(state);
      rules = this.ruler2.getRules("");
      len = rules.length;
      for (i = 0; i < len; i++) {
        rules[i](state);
      }
    };
    ParserInline.prototype.State = requireState_inline();
    parser_inline = ParserInline;
    return parser_inline;
  }
  var re;
  var hasRequiredRe;
  function requireRe() {
    if (hasRequiredRe) return re;
    hasRequiredRe = 1;
    re = function(opts) {
      var re2 = {};
      opts = opts || {};
      re2.src_Any = requireRegex$3().source;
      re2.src_Cc = requireRegex$2().source;
      re2.src_Z = requireRegex().source;
      re2.src_P = requireRegex$4().source;
      re2.src_ZPCc = [re2.src_Z, re2.src_P, re2.src_Cc].join("|");
      re2.src_ZCc = [re2.src_Z, re2.src_Cc].join("|");
      var text_separators = "[><｜]";
      re2.src_pseudo_letter = "(?:(?!" + text_separators + "|" + re2.src_ZPCc + ")" + re2.src_Any + ")";
      re2.src_ip4 = "(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)";
      re2.src_auth = "(?:(?:(?!" + re2.src_ZCc + "|[@/\\[\\]()]).)+@)?";
      re2.src_port = "(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?";
      re2.src_host_terminator = "(?=$|" + text_separators + "|" + re2.src_ZPCc + ")(?!" + (opts["---"] ? "-(?!--)|" : "-|") + "_|:\\d|\\.-|\\.(?!$|" + re2.src_ZPCc + "))";
      re2.src_path = "(?:[/?#](?:(?!" + re2.src_ZCc + "|" + text_separators + `|[()[\\]{}.,"'?!\\-;]).|\\[(?:(?!` + re2.src_ZCc + "|\\]).)*\\]|\\((?:(?!" + re2.src_ZCc + "|[)]).)*\\)|\\{(?:(?!" + re2.src_ZCc + '|[}]).)*\\}|\\"(?:(?!' + re2.src_ZCc + `|["]).)+\\"|\\'(?:(?!` + re2.src_ZCc + "|[']).)+\\'|\\'(?=" + re2.src_pseudo_letter + "|[-])|\\.{2,}[a-zA-Z0-9%/&]|\\.(?!" + re2.src_ZCc + "|[.]|$)|" + (opts["---"] ? "\\-(?!--(?:[^-]|$))(?:-*)|" : "\\-+|") + ",(?!" + re2.src_ZCc + "|$)|;(?!" + re2.src_ZCc + "|$)|\\!+(?!" + re2.src_ZCc + "|[!]|$)|\\?(?!" + re2.src_ZCc + "|[?]|$))+|\\/)?";
      re2.src_email_name = '[\\-;:&=\\+\\$,\\.a-zA-Z0-9_][\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]*';
      re2.src_xn = "xn--[a-z0-9\\-]{1,59}";
      re2.src_domain_root = // Allow letters & digits (http://test1)
      "(?:" + re2.src_xn + "|" + re2.src_pseudo_letter + "{1,63})";
      re2.src_domain = "(?:" + re2.src_xn + "|(?:" + re2.src_pseudo_letter + ")|(?:" + re2.src_pseudo_letter + "(?:-|" + re2.src_pseudo_letter + "){0,61}" + re2.src_pseudo_letter + "))";
      re2.src_host = "(?:(?:(?:(?:" + re2.src_domain + ")\\.)*" + re2.src_domain + "))";
      re2.tpl_host_fuzzy = "(?:" + re2.src_ip4 + "|(?:(?:(?:" + re2.src_domain + ")\\.)+(?:%TLDS%)))";
      re2.tpl_host_no_ip_fuzzy = "(?:(?:(?:" + re2.src_domain + ")\\.)+(?:%TLDS%))";
      re2.src_host_strict = re2.src_host + re2.src_host_terminator;
      re2.tpl_host_fuzzy_strict = re2.tpl_host_fuzzy + re2.src_host_terminator;
      re2.src_host_port_strict = re2.src_host + re2.src_port + re2.src_host_terminator;
      re2.tpl_host_port_fuzzy_strict = re2.tpl_host_fuzzy + re2.src_port + re2.src_host_terminator;
      re2.tpl_host_port_no_ip_fuzzy_strict = re2.tpl_host_no_ip_fuzzy + re2.src_port + re2.src_host_terminator;
      re2.tpl_host_fuzzy_test = "localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:" + re2.src_ZPCc + "|>|$))";
      re2.tpl_email_fuzzy = "(^|" + text_separators + '|"|\\(|' + re2.src_ZCc + ")(" + re2.src_email_name + "@" + re2.tpl_host_fuzzy_strict + ")";
      re2.tpl_link_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re2.src_ZPCc + "))((?![$+<=>^`|｜])" + re2.tpl_host_port_fuzzy_strict + re2.src_path + ")";
      re2.tpl_link_no_ip_fuzzy = // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      "(^|(?![.:/\\-_@])(?:[$+<=>^`|｜]|" + re2.src_ZPCc + "))((?![$+<=>^`|｜])" + re2.tpl_host_port_no_ip_fuzzy_strict + re2.src_path + ")";
      return re2;
    };
    return re;
  }
  var linkifyIt;
  var hasRequiredLinkifyIt;
  function requireLinkifyIt() {
    if (hasRequiredLinkifyIt) return linkifyIt;
    hasRequiredLinkifyIt = 1;
    function assign(obj) {
      var sources = Array.prototype.slice.call(arguments, 1);
      sources.forEach(function(source) {
        if (!source) {
          return;
        }
        Object.keys(source).forEach(function(key) {
          obj[key] = source[key];
        });
      });
      return obj;
    }
    function _class(obj) {
      return Object.prototype.toString.call(obj);
    }
    function isString(obj) {
      return _class(obj) === "[object String]";
    }
    function isObject(obj) {
      return _class(obj) === "[object Object]";
    }
    function isRegExp(obj) {
      return _class(obj) === "[object RegExp]";
    }
    function isFunction(obj) {
      return _class(obj) === "[object Function]";
    }
    function escapeRE(str) {
      return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
    }
    var defaultOptions = {
      fuzzyLink: true,
      fuzzyEmail: true,
      fuzzyIP: false
    };
    function isOptionsObj(obj) {
      return Object.keys(obj || {}).reduce(function(acc, k) {
        return acc || defaultOptions.hasOwnProperty(k);
      }, false);
    }
    var defaultSchemas = {
      "http:": {
        validate: function(text2, pos, self) {
          var tail = text2.slice(pos);
          if (!self.re.http) {
            self.re.http = new RegExp(
              "^\\/\\/" + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path,
              "i"
            );
          }
          if (self.re.http.test(tail)) {
            return tail.match(self.re.http)[0].length;
          }
          return 0;
        }
      },
      "https:": "http:",
      "ftp:": "http:",
      "//": {
        validate: function(text2, pos, self) {
          var tail = text2.slice(pos);
          if (!self.re.no_http) {
            self.re.no_http = new RegExp(
              "^" + self.re.src_auth + // Don't allow single-level domains, because of false positives like '//test'
              // with code comments
              "(?:localhost|(?:(?:" + self.re.src_domain + ")\\.)+" + self.re.src_domain_root + ")" + self.re.src_port + self.re.src_host_terminator + self.re.src_path,
              "i"
            );
          }
          if (self.re.no_http.test(tail)) {
            if (pos >= 3 && text2[pos - 3] === ":") {
              return 0;
            }
            if (pos >= 3 && text2[pos - 3] === "/") {
              return 0;
            }
            return tail.match(self.re.no_http)[0].length;
          }
          return 0;
        }
      },
      "mailto:": {
        validate: function(text2, pos, self) {
          var tail = text2.slice(pos);
          if (!self.re.mailto) {
            self.re.mailto = new RegExp(
              "^" + self.re.src_email_name + "@" + self.re.src_host_strict,
              "i"
            );
          }
          if (self.re.mailto.test(tail)) {
            return tail.match(self.re.mailto)[0].length;
          }
          return 0;
        }
      }
    };
    var tlds_2ch_src_re = "a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]";
    var tlds_default = "biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф".split("|");
    function resetScanCache(self) {
      self.__index__ = -1;
      self.__text_cache__ = "";
    }
    function createValidator(re2) {
      return function(text2, pos) {
        var tail = text2.slice(pos);
        if (re2.test(tail)) {
          return tail.match(re2)[0].length;
        }
        return 0;
      };
    }
    function createNormalizer() {
      return function(match, self) {
        self.normalize(match);
      };
    }
    function compile(self) {
      var re2 = self.re = requireRe()(self.__opts__);
      var tlds = self.__tlds__.slice();
      self.onCompile();
      if (!self.__tlds_replaced__) {
        tlds.push(tlds_2ch_src_re);
      }
      tlds.push(re2.src_xn);
      re2.src_tlds = tlds.join("|");
      function untpl(tpl) {
        return tpl.replace("%TLDS%", re2.src_tlds);
      }
      re2.email_fuzzy = RegExp(untpl(re2.tpl_email_fuzzy), "i");
      re2.link_fuzzy = RegExp(untpl(re2.tpl_link_fuzzy), "i");
      re2.link_no_ip_fuzzy = RegExp(untpl(re2.tpl_link_no_ip_fuzzy), "i");
      re2.host_fuzzy_test = RegExp(untpl(re2.tpl_host_fuzzy_test), "i");
      var aliases = [];
      self.__compiled__ = {};
      function schemaError(name, val) {
        throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
      }
      Object.keys(self.__schemas__).forEach(function(name) {
        var val = self.__schemas__[name];
        if (val === null) {
          return;
        }
        var compiled = { validate: null, link: null };
        self.__compiled__[name] = compiled;
        if (isObject(val)) {
          if (isRegExp(val.validate)) {
            compiled.validate = createValidator(val.validate);
          } else if (isFunction(val.validate)) {
            compiled.validate = val.validate;
          } else {
            schemaError(name, val);
          }
          if (isFunction(val.normalize)) {
            compiled.normalize = val.normalize;
          } else if (!val.normalize) {
            compiled.normalize = createNormalizer();
          } else {
            schemaError(name, val);
          }
          return;
        }
        if (isString(val)) {
          aliases.push(name);
          return;
        }
        schemaError(name, val);
      });
      aliases.forEach(function(alias) {
        if (!self.__compiled__[self.__schemas__[alias]]) {
          return;
        }
        self.__compiled__[alias].validate = self.__compiled__[self.__schemas__[alias]].validate;
        self.__compiled__[alias].normalize = self.__compiled__[self.__schemas__[alias]].normalize;
      });
      self.__compiled__[""] = { validate: null, normalize: createNormalizer() };
      var slist = Object.keys(self.__compiled__).filter(function(name) {
        return name.length > 0 && self.__compiled__[name];
      }).map(escapeRE).join("|");
      self.re.schema_test = RegExp("(^|(?!_)(?:[><｜]|" + re2.src_ZPCc + "))(" + slist + ")", "i");
      self.re.schema_search = RegExp("(^|(?!_)(?:[><｜]|" + re2.src_ZPCc + "))(" + slist + ")", "ig");
      self.re.schema_at_start = RegExp("^" + self.re.schema_search.source, "i");
      self.re.pretest = RegExp(
        "(" + self.re.schema_test.source + ")|(" + self.re.host_fuzzy_test.source + ")|@",
        "i"
      );
      resetScanCache(self);
    }
    function Match(self, shift) {
      var start = self.__index__, end = self.__last_index__, text2 = self.__text_cache__.slice(start, end);
      this.schema = self.__schema__.toLowerCase();
      this.index = start + shift;
      this.lastIndex = end + shift;
      this.raw = text2;
      this.text = text2;
      this.url = text2;
    }
    function createMatch(self, shift) {
      var match = new Match(self, shift);
      self.__compiled__[match.schema].normalize(match, self);
      return match;
    }
    function LinkifyIt(schemas, options) {
      if (!(this instanceof LinkifyIt)) {
        return new LinkifyIt(schemas, options);
      }
      if (!options) {
        if (isOptionsObj(schemas)) {
          options = schemas;
          schemas = {};
        }
      }
      this.__opts__ = assign({}, defaultOptions, options);
      this.__index__ = -1;
      this.__last_index__ = -1;
      this.__schema__ = "";
      this.__text_cache__ = "";
      this.__schemas__ = assign({}, defaultSchemas, schemas);
      this.__compiled__ = {};
      this.__tlds__ = tlds_default;
      this.__tlds_replaced__ = false;
      this.re = {};
      compile(this);
    }
    LinkifyIt.prototype.add = function add(schema, definition) {
      this.__schemas__[schema] = definition;
      compile(this);
      return this;
    };
    LinkifyIt.prototype.set = function set(options) {
      this.__opts__ = assign(this.__opts__, options);
      return this;
    };
    LinkifyIt.prototype.test = function test(text2) {
      this.__text_cache__ = text2;
      this.__index__ = -1;
      if (!text2.length) {
        return false;
      }
      var m, ml, me, len, shift, next, re2, tld_pos, at_pos;
      if (this.re.schema_test.test(text2)) {
        re2 = this.re.schema_search;
        re2.lastIndex = 0;
        while ((m = re2.exec(text2)) !== null) {
          len = this.testSchemaAt(text2, m[2], re2.lastIndex);
          if (len) {
            this.__schema__ = m[2];
            this.__index__ = m.index + m[1].length;
            this.__last_index__ = m.index + m[0].length + len;
            break;
          }
        }
      }
      if (this.__opts__.fuzzyLink && this.__compiled__["http:"]) {
        tld_pos = text2.search(this.re.host_fuzzy_test);
        if (tld_pos >= 0) {
          if (this.__index__ < 0 || tld_pos < this.__index__) {
            if ((ml = text2.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {
              shift = ml.index + ml[1].length;
              if (this.__index__ < 0 || shift < this.__index__) {
                this.__schema__ = "";
                this.__index__ = shift;
                this.__last_index__ = ml.index + ml[0].length;
              }
            }
          }
        }
      }
      if (this.__opts__.fuzzyEmail && this.__compiled__["mailto:"]) {
        at_pos = text2.indexOf("@");
        if (at_pos >= 0) {
          if ((me = text2.match(this.re.email_fuzzy)) !== null) {
            shift = me.index + me[1].length;
            next = me.index + me[0].length;
            if (this.__index__ < 0 || shift < this.__index__ || shift === this.__index__ && next > this.__last_index__) {
              this.__schema__ = "mailto:";
              this.__index__ = shift;
              this.__last_index__ = next;
            }
          }
        }
      }
      return this.__index__ >= 0;
    };
    LinkifyIt.prototype.pretest = function pretest(text2) {
      return this.re.pretest.test(text2);
    };
    LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text2, schema, pos) {
      if (!this.__compiled__[schema.toLowerCase()]) {
        return 0;
      }
      return this.__compiled__[schema.toLowerCase()].validate(text2, pos, this);
    };
    LinkifyIt.prototype.match = function match(text2) {
      var shift = 0, result = [];
      if (this.__index__ >= 0 && this.__text_cache__ === text2) {
        result.push(createMatch(this, shift));
        shift = this.__last_index__;
      }
      var tail = shift ? text2.slice(shift) : text2;
      while (this.test(tail)) {
        result.push(createMatch(this, shift));
        tail = tail.slice(this.__last_index__);
        shift += this.__last_index__;
      }
      if (result.length) {
        return result;
      }
      return null;
    };
    LinkifyIt.prototype.matchAtStart = function matchAtStart(text2) {
      this.__text_cache__ = text2;
      this.__index__ = -1;
      if (!text2.length) return null;
      var m = this.re.schema_at_start.exec(text2);
      if (!m) return null;
      var len = this.testSchemaAt(text2, m[2], m[0].length);
      if (!len) return null;
      this.__schema__ = m[2];
      this.__index__ = m.index + m[1].length;
      this.__last_index__ = m.index + m[0].length + len;
      return createMatch(this, 0);
    };
    LinkifyIt.prototype.tlds = function tlds(list2, keepOld) {
      list2 = Array.isArray(list2) ? list2 : [list2];
      if (!keepOld) {
        this.__tlds__ = list2.slice();
        this.__tlds_replaced__ = true;
        compile(this);
        return this;
      }
      this.__tlds__ = this.__tlds__.concat(list2).sort().filter(function(el2, idx, arr) {
        return el2 !== arr[idx - 1];
      }).reverse();
      compile(this);
      return this;
    };
    LinkifyIt.prototype.normalize = function normalize2(match) {
      if (!match.schema) {
        match.url = "http://" + match.url;
      }
      if (match.schema === "mailto:" && !/^mailto:/i.test(match.url)) {
        match.url = "mailto:" + match.url;
      }
    };
    LinkifyIt.prototype.onCompile = function onCompile() {
    };
    linkifyIt = LinkifyIt;
    return linkifyIt;
  }
  const __viteBrowserExternal = {};
  const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    default: __viteBrowserExternal
  }, Symbol.toStringTag, { value: "Module" }));
  const require$$8 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
  var _default;
  var hasRequired_default;
  function require_default() {
    if (hasRequired_default) return _default;
    hasRequired_default = 1;
    _default = {
      options: {
        html: false,
        // Enable HTML tags in source
        xhtmlOut: false,
        // Use '/' to close single tags (<br />)
        breaks: false,
        // Convert '\n' in paragraphs into <br>
        langPrefix: "language-",
        // CSS language prefix for fenced blocks
        linkify: false,
        // autoconvert URL-like texts to links
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "“”‘’",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 100
        // Internal protection, recursion limit
      },
      components: {
        core: {},
        block: {},
        inline: {}
      }
    };
    return _default;
  }
  var zero;
  var hasRequiredZero;
  function requireZero() {
    if (hasRequiredZero) return zero;
    hasRequiredZero = 1;
    zero = {
      options: {
        html: false,
        // Enable HTML tags in source
        xhtmlOut: false,
        // Use '/' to close single tags (<br />)
        breaks: false,
        // Convert '\n' in paragraphs into <br>
        langPrefix: "language-",
        // CSS language prefix for fenced blocks
        linkify: false,
        // autoconvert URL-like texts to links
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "“”‘’",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 20
        // Internal protection, recursion limit
      },
      components: {
        core: {
          rules: [
            "normalize",
            "block",
            "inline",
            "text_join"
          ]
        },
        block: {
          rules: [
            "paragraph"
          ]
        },
        inline: {
          rules: [
            "text"
          ],
          rules2: [
            "balance_pairs",
            "fragments_join"
          ]
        }
      }
    };
    return zero;
  }
  var commonmark;
  var hasRequiredCommonmark;
  function requireCommonmark() {
    if (hasRequiredCommonmark) return commonmark;
    hasRequiredCommonmark = 1;
    commonmark = {
      options: {
        html: true,
        // Enable HTML tags in source
        xhtmlOut: true,
        // Use '/' to close single tags (<br />)
        breaks: false,
        // Convert '\n' in paragraphs into <br>
        langPrefix: "language-",
        // CSS language prefix for fenced blocks
        linkify: false,
        // autoconvert URL-like texts to links
        // Enable some language-neutral replacements + quotes beautification
        typographer: false,
        // Double + single quotes replacement pairs, when typographer enabled,
        // and smartquotes on. Could be either a String or an Array.
        //
        // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
        // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
        quotes: "“”‘’",
        /* “”‘’ */
        // Highlighter function. Should return escaped HTML,
        // or '' if the source string is not changed and should be escaped externaly.
        // If result starts with <pre... internal wrapper is skipped.
        //
        // function (/*str, lang*/) { return ''; }
        //
        highlight: null,
        maxNesting: 20
        // Internal protection, recursion limit
      },
      components: {
        core: {
          rules: [
            "normalize",
            "block",
            "inline",
            "text_join"
          ]
        },
        block: {
          rules: [
            "blockquote",
            "code",
            "fence",
            "heading",
            "hr",
            "html_block",
            "lheading",
            "list",
            "reference",
            "paragraph"
          ]
        },
        inline: {
          rules: [
            "autolink",
            "backticks",
            "emphasis",
            "entity",
            "escape",
            "html_inline",
            "image",
            "link",
            "newline",
            "text"
          ],
          rules2: [
            "balance_pairs",
            "emphasis",
            "fragments_join"
          ]
        }
      }
    };
    return commonmark;
  }
  var lib;
  var hasRequiredLib;
  function requireLib() {
    if (hasRequiredLib) return lib;
    hasRequiredLib = 1;
    var utils2 = requireUtils();
    var helpers2 = requireHelpers();
    var Renderer = requireRenderer();
    var ParserCore = requireParser_core();
    var ParserBlock = requireParser_block();
    var ParserInline = requireParser_inline();
    var LinkifyIt = requireLinkifyIt();
    var mdurl2 = requireMdurl();
    var punycode = require$$8;
    var config2 = {
      default: require_default(),
      zero: requireZero(),
      commonmark: requireCommonmark()
    };
    var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
    var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;
    function validateLink(url) {
      var str = url.trim().toLowerCase();
      return BAD_PROTO_RE.test(str) ? GOOD_DATA_RE.test(str) ? true : false : true;
    }
    var RECODE_HOSTNAME_FOR = ["http:", "https:", "mailto:"];
    function normalizeLink(url) {
      var parsed = mdurl2.parse(url, true);
      if (parsed.hostname) {
        if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
          try {
            parsed.hostname = punycode.toASCII(parsed.hostname);
          } catch (er) {
          }
        }
      }
      return mdurl2.encode(mdurl2.format(parsed));
    }
    function normalizeLinkText(url) {
      var parsed = mdurl2.parse(url, true);
      if (parsed.hostname) {
        if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
          try {
            parsed.hostname = punycode.toUnicode(parsed.hostname);
          } catch (er) {
          }
        }
      }
      return mdurl2.decode(mdurl2.format(parsed), mdurl2.decode.defaultChars + "%");
    }
    function MarkdownIt2(presetName, options) {
      if (!(this instanceof MarkdownIt2)) {
        return new MarkdownIt2(presetName, options);
      }
      if (!options) {
        if (!utils2.isString(presetName)) {
          options = presetName || {};
          presetName = "default";
        }
      }
      this.inline = new ParserInline();
      this.block = new ParserBlock();
      this.core = new ParserCore();
      this.renderer = new Renderer();
      this.linkify = new LinkifyIt();
      this.validateLink = validateLink;
      this.normalizeLink = normalizeLink;
      this.normalizeLinkText = normalizeLinkText;
      this.utils = utils2;
      this.helpers = utils2.assign({}, helpers2);
      this.options = {};
      this.configure(presetName);
      if (options) {
        this.set(options);
      }
    }
    MarkdownIt2.prototype.set = function(options) {
      utils2.assign(this.options, options);
      return this;
    };
    MarkdownIt2.prototype.configure = function(presets) {
      var self = this, presetName;
      if (utils2.isString(presets)) {
        presetName = presets;
        presets = config2[presetName];
        if (!presets) {
          throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name');
        }
      }
      if (!presets) {
        throw new Error("Wrong `markdown-it` preset, can't be empty");
      }
      if (presets.options) {
        self.set(presets.options);
      }
      if (presets.components) {
        Object.keys(presets.components).forEach(function(name) {
          if (presets.components[name].rules) {
            self[name].ruler.enableOnly(presets.components[name].rules);
          }
          if (presets.components[name].rules2) {
            self[name].ruler2.enableOnly(presets.components[name].rules2);
          }
        });
      }
      return this;
    };
    MarkdownIt2.prototype.enable = function(list2, ignoreInvalid) {
      var result = [];
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      ["core", "block", "inline"].forEach(function(chain) {
        result = result.concat(this[chain].ruler.enable(list2, true));
      }, this);
      result = result.concat(this.inline.ruler2.enable(list2, true));
      var missed = list2.filter(function(name) {
        return result.indexOf(name) < 0;
      });
      if (missed.length && !ignoreInvalid) {
        throw new Error("MarkdownIt. Failed to enable unknown rule(s): " + missed);
      }
      return this;
    };
    MarkdownIt2.prototype.disable = function(list2, ignoreInvalid) {
      var result = [];
      if (!Array.isArray(list2)) {
        list2 = [list2];
      }
      ["core", "block", "inline"].forEach(function(chain) {
        result = result.concat(this[chain].ruler.disable(list2, true));
      }, this);
      result = result.concat(this.inline.ruler2.disable(list2, true));
      var missed = list2.filter(function(name) {
        return result.indexOf(name) < 0;
      });
      if (missed.length && !ignoreInvalid) {
        throw new Error("MarkdownIt. Failed to disable unknown rule(s): " + missed);
      }
      return this;
    };
    MarkdownIt2.prototype.use = function(plugin) {
      var args = [this].concat(Array.prototype.slice.call(arguments, 1));
      plugin.apply(plugin, args);
      return this;
    };
    MarkdownIt2.prototype.parse = function(src, env) {
      if (typeof src !== "string") {
        throw new Error("Input data should be a String");
      }
      var state = new this.core.State(src, this, env);
      this.core.process(state);
      return state.tokens;
    };
    MarkdownIt2.prototype.render = function(src, env) {
      env = env || {};
      return this.renderer.render(this.parse(src, env), this.options, env);
    };
    MarkdownIt2.prototype.parseInline = function(src, env) {
      var state = new this.core.State(src, this, env);
      state.inlineMode = true;
      this.core.process(state);
      return state.tokens;
    };
    MarkdownIt2.prototype.renderInline = function(src, env) {
      env = env || {};
      return this.renderer.render(this.parseInline(src, env), this.options, env);
    };
    lib = MarkdownIt2;
    return lib;
  }
  var markdownIt;
  var hasRequiredMarkdownIt;
  function requireMarkdownIt() {
    if (hasRequiredMarkdownIt) return markdownIt;
    hasRequiredMarkdownIt = 1;
    markdownIt = requireLib();
    return markdownIt;
  }
  var markdownItExports = requireMarkdownIt();
  const MarkdownIt = /* @__PURE__ */ getDefaultExportFromCjs(markdownItExports);
  const VueMarkdown = vue.defineComponent({
    name: "VueMarkdown",
    props: {
      source: {
        type: String,
        required: true
      },
      options: {
        type: Object,
        required: false
      },
      plugins: {
        type: Array,
        required: false
      }
    },
    setup(props) {
      const md = vue.ref(new MarkdownIt(props.options ?? {}));
      for (const plugin of props.plugins ?? []) {
        md.value.use(plugin);
      }
      const content = vue.computed(() => md.value.render(props.source));
      return () => vue.h("div", { innerHTML: content.value });
    }
  });
  const _hoisted_1$3 = { class: "c-block" };
  const _hoisted_2 = ["href"];
  const _hoisted_3 = ["href"];
  const _sfc_main$4 = /* @__PURE__ */ vue.defineComponent({
    __name: "SyBLock",
    props: {
      block: {
        type: Object,
        required: true
      }
    },
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createVNode(vue.unref(VueMarkdown), {
            source: __props.block.markdown || __props.block.content
          }, null, 8, ["source"]),
          vue.unref(config).protocol === "siyuan" ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 0,
            href: `siyuan://blocks/${__props.block.id}`
          }, "📝", 8, _hoisted_2)) : vue.unref(config).protocol === "http" ? (vue.openBlock(), vue.createElementBlock("a", {
            key: 1,
            href: `${vue.unref(config).server}/?id=${__props.block.id}&focus=true`
          }, "📝", 8, _hoisted_3)) : vue.createCommentVNode("", true)
        ]);
      };
    }
  });
  const _export_sfc = (sfc, props) => {
    const target2 = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target2[key] = val;
    }
    return target2;
  };
  const SyBLock = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-b5b3660c"]]);
  const _hoisted_1$2 = {
    key: 0,
    class: "c-list"
  };
  const _sfc_main$3 = /* @__PURE__ */ vue.defineComponent({
    __name: "PageInfo",
    setup(__props) {
      const blockListShow = vue.ref(false);
      const refBlocks = vue.ref([]);
      sql(`select * from blocks
  where
    content like '%${pageUrl.origin + pageUrl.pathname}%'
    and
    type = 'p'
  ORDER BY created DESC
  LIMIT 1000000`).then((r) => {
        console.log("[r]", r);
        refBlocks.value = r.data || [];
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          class: "c",
          onMouseenter: _cache[0] || (_cache[0] = ($event) => blockListShow.value = true),
          onMouseleave: _cache[1] || (_cache[1] = ($event) => blockListShow.value = false)
        }, [
          vue.createElementVNode("span", null, "引用 " + vue.toDisplayString(refBlocks.value.length) + " 次", 1),
          blockListShow.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(refBlocks.value, (block2) => {
              return vue.openBlock(), vue.createBlock(SyBLock, { block: block2 }, null, 8, ["block"]);
            }), 256))
          ])) : vue.createCommentVNode("", true)
        ], 32);
      };
    }
  });
  const PageInfo = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-c3481be8"]]);
  const _sfc_main$2 = /* @__PURE__ */ vue.defineComponent({
    __name: "config",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          _cache[5] || (_cache[5] = vue.createElementVNode("h4", null, "思源再提醒插件", -1)),
          _cache[6] || (_cache[6] = vue.createTextVNode(" 链接打开协议类型: ")),
          vue.withDirectives(vue.createElementVNode("select", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => vue.unref(config).protocol = $event)
          }, _cache[4] || (_cache[4] = [
            vue.createElementVNode("option", { value: "siyuan" }, "siyuan协议", -1),
            vue.createElementVNode("option", { value: "http" }, "http协议", -1)
          ]), 512), [
            [vue.vModelSelect, vue.unref(config).protocol]
          ]),
          _cache[7] || (_cache[7] = vue.createElementVNode("br", null, null, -1)),
          _cache[8] || (_cache[8] = vue.createTextVNode(" server:")),
          vue.withDirectives(vue.createElementVNode("input", {
            "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => vue.unref(config).server = $event)
          }, null, 512), [
            [vue.vModelText, vue.unref(config).server]
          ]),
          _cache[9] || (_cache[9] = vue.createElementVNode("br", null, null, -1)),
          _cache[10] || (_cache[10] = vue.createTextVNode(" token:")),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "password",
            "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => vue.unref(config).token = $event)
          }, null, 512), [
            [vue.vModelText, vue.unref(config).token]
          ]),
          _cache[11] || (_cache[11] = vue.createElementVNode("br", null, null, -1)),
          _cache[12] || (_cache[12] = vue.createTextVNode(" 是否查询网页正文中的关键词: ")),
          vue.withDirectives(vue.createElementVNode("input", {
            type: "checkbox",
            "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => vue.unref(config).queryWebContent = $event)
          }, null, 512), [
            [vue.vModelCheckbox, vue.unref(config).queryWebContent]
          ])
        ], 64);
      };
    }
  });
  const _hoisted_1$1 = { style: { "background": "#fff" } };
  const _sfc_main$1 = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      const configShow = vue.ref(false);
      _GM.registerMenuCommand("切换配置面板", () => {
        configShow.value = !configShow.value;
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          configShow.value ? (vue.openBlock(), vue.createBlock(_sfc_main$2, { key: 0 })) : vue.createCommentVNode("", true),
          vue.createVNode(PageInfo)
        ]);
      };
    }
  });
  const _hoisted_1 = {
    key: 0,
    class: "c-list"
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "ElementInfo",
    props: {
      rows: {
        type: Array,
        required: true
      }
    },
    setup(__props) {
      const blockListShow = vue.ref(false);
      const props = __props;
      const refBlocks = vue.ref([]);
      vue.watchEffect(() => {
        if (blockListShow.value && refBlocks.value.length === 0) {
          sql(`select * from blocks
  where
    id IN (${props.rows.map((row) => `'${row.id}'`).join(",")})
  ORDER BY created DESC
  LIMIT 1000000`).then((r) => {
            refBlocks.value = r.data || [];
            console.log("[r]", r, refBlocks.value);
          });
        }
      });
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", {
          style: { "display": "inline-block" },
          onMouseenter: _cache[0] || (_cache[0] = ($event) => blockListShow.value = true),
          onMouseleave: _cache[1] || (_cache[1] = ($event) => blockListShow.value = false)
        }, [
          vue.createTextVNode(" [" + vue.toDisplayString(__props.rows.length) + "] ", 1),
          blockListShow.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(refBlocks.value, (block2) => {
              return vue.openBlock(), vue.createBlock(SyBLock, { block: block2 }, null, 8, ["block"]);
            }), 256))
          ])) : vue.createCommentVNode("", true)
        ], 32);
      };
    }
  });
  const ElementInfo = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-89518ebf"]]);
  vue.createApp(_sfc_main$1).mount(
    (() => {
      const app = document.createElement("div");
      app.style.cssText = `
  position: fixed;
  right: 0;
  top:0;
  z-index:99999999999999;
  `;
      console.log("[app]", app);
      document.body.append(app);
      return app;
    })()
  );
  setTimeout(async () => {
    if (!config.queryWebContent) return;
    const sy = await sql(`
    SELECT id, content AS segmenter FROM blocks WHERE content != '' AND (TYPE = 'd' OR TYPE = 'h')
    UNION ALL
    SELECT id, name AS segmenter FROM blocks WHERE name != ''
    UNION ALL
    SELECT id, ALIAS AS segmenter FROM blocks WHERE ALIAS != ''
  LIMIT 100000
    `);
    const rows = sy.data;
    const doms = getParentsOfTextNodes(document.body);
    [...doms].filter((el2) => {
      const text2 = el2.textContent;
      const includeRows = rows.filter((row) => text2 == null ? void 0 : text2.includes(row.segmenter));
      const El = el2 instanceof HTMLElement ? el2 : el2.parentElement;
      if (includeRows.find((t) => t.segmenter === text2) && El) {
        El.style.cssText = `
        border-bottom: dashed 2px;
        `;
        const container = El;
        vue.createApp(ElementInfo, {
          rows: includeRows
        }).mount(
          (() => {
            const el22 = document.createElement("sup");
            el22.style.cssText = `
            margin-left: 5px;
        `;
            container == null ? void 0 : container.append(el22);
            return el22;
          })()
        );
      }
    });
  }, 3e3);
  function getParentsOfTextNodes(element) {
    const parentElements = /* @__PURE__ */ new Set();
    (function traverse(node) {
      if (node instanceof Text) {
        parentElements.add(node);
      }
      Array.from(node.childNodes).forEach(traverse);
    })(element);
    return Array.from(parentElements);
  }

})(Vue);