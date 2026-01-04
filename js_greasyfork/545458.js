// ==UserScript==
// @name         ΚΤΕΜΑ ΤΕ ΕΣ ΑΙΕΙ ΘΟΚΥΔΙΔΟ
// @namespace    http://lunacy.wtf/
// @version      3.0
// @description  Finds Ancient Greek text, transliterates it into an archaic majuscule style, and applies a custom font.
// @author       Lunacy
// @match        *://*/*
// @exclude      https://lunacy.wtf/*
// @exclude      https://docs.google.com/*
// @exclude      https://suno.com/*
// @license      Proprietary
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545458/%CE%9A%CE%A4%CE%95%CE%9C%CE%91%20%CE%A4%CE%95%20%CE%95%CE%A3%20%CE%91%CE%99%CE%95%CE%99%20%CE%98%CE%9F%CE%9A%CE%A5%CE%94%CE%99%CE%94%CE%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/545458/%CE%9A%CE%A4%CE%95%CE%9C%CE%91%20%CE%A4%CE%95%20%CE%95%CE%A3%20%CE%91%CE%99%CE%95%CE%99%20%CE%98%CE%9F%CE%9A%CE%A5%CE%94%CE%99%CE%94%CE%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ======================= 1. FONT AND STYLE INJECTION (From Script 2) =======================
    // This part injects the custom font and the CSS class that will be used to apply it.
    // The placeholder for the base64 font data must be replaced with your actual font file.
    GM_addStyle(`
      @font-face {
        font-family: 'ArchaicGreekFont';
        /* IMPORTANT: Replace the placeholder below with your actual base64 font data. */
        /* To convert a font: use a tool like https://www.base64encode.org/ to encode your .woff2 file and paste the result here. */
        src: url(data:font/woff2;base64,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
) format('woff2');

        font-weight: normal;
        font-style: normal;
      }
      .archaic-greek-text {
        font-family: 'ArchaicGreekFont', sans-serif !important;
      }
    `);


  // ====== EDITABLE-FIELD GUARD ======
  const EDITABLE_SELECTOR =
    'input, textarea, select, option, [contenteditable]:not([contenteditable="false"]), [role="textbox"], .ProseMirror, .ql-editor, .public-DraftEditor-content';
  function isEditableRoot(el) {
    if (!el) return false;
    if (el.isContentEditable) return true;
    return !!el.closest(EDITABLE_SELECTOR);
  }

  // ======================= 2) MAPS (MAJUSCULE & MACRONS) =======================
  const archaicMajusculeMap = {
    // --- VOWELS ---
    // Alpha
    'α':'Α','ἀ':'Α','ά':'Α','ὰ':'Α','ἄ':'Α','ἂ':'Α','ᾶ':'Α','ἆ':'Α',
    'Ἀ':'Α','Ἄ':'Α','Ἂ':'Α','Ἆ':'Α',
    'ἁ':'ͰΑ','ᾁ':'ͰΑΙ','ἇ':'ͰΑ','ἅ':'ͰΑ','ἃ':'ͰΑ',
    'ᾷ':'ΑΙ','ᾴ':'ΑΙ','ᾳ':'ΑΙ','ᾀ':'ΑΙ',
    'Ἁ':'ͰA','Ἅ':'ͰA',

    // Epsilon
    'ε':'Ε','ἐ':'Ε','έ':'Ε','ὲ':'Ε','ἔ':'Ε','ἒ':'Ε',
    'Ἐ':'Ε','Ἔ':'Ε','Ἒ':'Ε',
    'ἑ':'ͰΕ','ἓ':'ͰΕ','ἕ':'ͰΕ',
    'Ἑ':'ͰΕ','Ἕ':'ͰΕ',

    // Eta → Epsilon (archaic)
    'η':'Ε','ἠ':'Ε','ή':'Ε','ὴ':'Ε','ῆ':'Ε','ἤ':'Ε','ἢ':'Ε','ἦ':'Ε',
    'Η':'Ε','Ἠ':'Ε','Ἤ':'Ε','Ἢ':'Ε','Ἦ':'Ε',
    'ἡ':'ͰΕ','ᾗ':'ͰΕΙ','ἧ':'ͰΕ','ἥ':'ͰΕ','ἣ':'ͰΕ','ᾑ':'ͰΕΙ',
    'ῄ':'ΕΙ','ᾖ':'ΕΙ','ῇ':'ΕΙ','ῃ':'ΕΙ','ᾐ':'ΕΙ',
    'Ἡ':'ͰΕ',

    // Iota
    'ι':'Ι','ἰ':'Ι','ί':'Ι','ὶ':'Ι','ῖ':'Ι','ἴ':'Ι','ἶ':'Ι','ϊ':'Ι','ΐ':'Ι',
    'Ἰ':'Ι','Ἴ':'Ι','Ἲ':'Ι','Ἶ':'Ι',
    'ἳ':'ͰΙ','ἱ':'ͰΙ','ἵ':'ͰΙ','ἷ':'ͰΙ',
    'Ἱ':'ͰΙ','Ἵ':'ͰΙ',

    // Omicron
    'ο':'Ο','ὀ':'Ο','ό':'Ο','ὸ':'Ο','ὄ':'Ο','ὂ':'Ο',
    'Ὀ':'Ο','Ὄ':'Ο','Ὂ':'Ο',
    'ὁ':'ͰΟ','ὅ':'ͰΟ','ὃ':'ͰΟ',
    'Ὁ':'ͰΟ','Ὅ':'ͰΟ',

    // Omega → Omicron
    'ω':'Ο','ὠ':'Ο','ώ':'Ο','ὼ':'Ο','ῶ':'Ο','ὦ':'Ο','ὢ':'Ο',
    'Ω':'Ο','Ὠ':'Ο','Ὤ':'Ο','Ὢ':'Ο','Ὦ':'Ο',
    'ὡ':'ͰΟ','ὧ':'ͰΟ','ὥ':'ͰΟ',
    'ᾧ':'ͰΟΙ','ῳ':'ΟΙ','ῷ':'ΟΙ','ᾠ':'ΟΙ','ᾤ':'ΟΙ','ῴ':'ΟΙ',
    'Ὡ':'ͰΟ',

    // Upsilon
    'υ':'Υ','ὐ':'Υ','ύ':'Υ','ὺ':'Υ','ὔ':'Υ','ὒ':'Υ','ῦ':'Υ','ὖ':'Υ',
    'ὕ':'ͰΥ','ὑ':'ͰΥ','ὗ':'ͰΥ',
    'Ὑ':'ͰΥ','Ὓ':'ͰΥ','Ὗ':'ͰΥ','Ὕ':'ͰΥ',

    // Consonants
    'β':'Β','γ':'Γ','δ':'Δ','ζ':'Ζ','θ':'Θ','κ':'Κ','λ':'Λ','μ':'Μ','ν':'Ν','π':'Π','ρ':'Ρ','ς':'Σ','σ':'Σ','τ':'Τ','φ':'Φ','χ':'Χ','ͱ':'Ͱ',
    // Rho with rough
    'ῥ':'ͰΡ',

    // Compounds
    'ξ':'ΧΣ','Ξ':'ΧΣ','ψ':'ΦΣ','Ψ':'ΦΣ'
  };

  const archaicMap_MacronsOn = {
    // Alpha (macron)
    'ᾶ':'Ā','ἆ':'Ā','Ἆ':'Ā','ἇ':'ͰĀ','ᾷ':'ĀΙ',
    // Eta → Ē
    'η':'Ē','ἠ':'Ē','ή':'Ē','ὴ':'Ē','ῆ':'Ē','ἤ':'Ē','ἢ':'Ē','ἦ':'Ē',
    'Η':'Ē','Ἠ':'Ē','Ἤ':'Ē','Ἢ':'Ē','Ἦ':'Ē',
    'ἡ':'ͰĒ','ᾗ':'ͰĒΙ','ἧ':'ͰĒ','ἥ':'ͰĒ','ἣ':'ͰĒ','ᾑ':'ͰĒΙ',
    'ῄ':'ĒΙ','ᾖ':'ĒΙ','ῇ':'ĒΙ','ῃ':'ĒΙ','ᾐ':'ĒΙ',
    'Ἡ':'ͰĒ',
    // Iota
    'ῖ':'Ī','ἶ':'Ī','Ἶ':'Ī','ἷ':'ͰĪ',
    // Omega → Ō
    'ω':'Ō','ὠ':'Ō','ώ':'Ō','ὼ':'Ō','ῶ':'Ō','ὦ':'Ō','ὢ':'Ō',
    'Ω':'Ō','Ὠ':'Ō','Ὤ':'Ō','Ὢ':'Ō','Ὦ':'Ō',
    'ὡ':'ͰŌ','ὧ':'ͰŌ','ὥ':'ͰŌ',
    'ᾧ':'ͰŌΙ','ῳ':'ŌΙ','ῷ':'ŌΙ','ᾠ':'ŌΙ','ᾤ':'ŌΙ','ῴ':'ŌΙ',
    'Ὡ':'ͰŌ',
    // Upsilon
    'ῦ':'Ȳ','ὖ':'Ȳ','ὗ':'ͰȲ','Ὗ':'ͰȲ'
  };

  // ====== MACRON TOGGLE ======
  let MACRONS_ON = true;
  function mapChar(ch) {
    if (MACRONS_ON && archaicMap_MacronsOn[ch] != null) return archaicMap_MacronsOn[ch];
    return (archaicMajusculeMap[ch] != null) ? archaicMajusculeMap[ch] : ch;
  }

  // ======================= 3) OU & MORPHOLOGY LOGIC =======================
  // Explicit charsets for ο and υ variants (no ranges)
  const OMICRONS = "οὀὈὄὌὂὊόὸὁὉὅὍὃ";
  const UPSILONS = "υὐὔὒὖῦὕὗὑὙὛὝὟύὺ";
  const OU_ANY_RE     = new RegExp("[" + OMICRONS + "][" + UPSILONS + "]", "g");
  const OU_ANY_RE_ONE = new RegExp("[" + OMICRONS + "][" + UPSILONS + "]");

  // Rough-breathing upsilons (lower + upper)
  const ROUGH_UPSILON = "ὑὕὓὗὙὝὛὟ";

  // Normalize (strip diacritics, keep Greek letters), to lowercase
  function normalizeForLookup(word) {
    return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  // Lexical overrides
  // Keep whole-word OU: οὖν, οὐ, οὖς, βοῦς, τοῦτο
  const KEEP_TRUE_OU_WORDS = new Set(['ουν', 'ου', 'ους', 'βους', 'τουτο']);
  // Collapse ALL OU in lexeme (e.g., βουλή-forms, δοῦναι)
  const COLLAPSE_WHOLE_WORDS = new Set(['βουλη','βουλης','βουλην','δουναι']);

  // OU endings to collapse (ending-only)
  const ENDINGS = [
    { re: /ουσιν$/,  ouLen: 5 },
    { re: /ουσι$/,   ouLen: 4 },
    { re: /ουμεν$/,  ouLen: 5 },
    { re: /ουσα$/,   ouLen: 4 },
    { re: /ουντος$/, ouLen: 6 },
    { re: /ουντες$/, ouLen: 6 },
    { re: /ουντα$/,  ouLen: 5 },
    { re: /ουν$/,    ouLen: 3 }, // guarded by KEEP_TRUE_OU_WORDS for οὖν
    { re: /ους$/,    ouLen: 3 },
    { re: /ου$/,     ouLen: 2 },
    { re: /ουμαι$/,  ouLen: 5 },
    { re: /ουται$/,  ouLen: 5 },
    { re: /ουνται$/, ouLen: 6 },
    { re: /ουμεθα$/, ouLen: 7 },
    { re: /ουσθε$/,  ouLen: 6 },
    { re: /ουσθαι$/, ouLen: 6 },
    { re: /ουμην$/,  ouLen: 5 },
    { re: /ουτο$/,   ouLen: 4 }, // guarded for demonstrative τοῦτο
    { re: /ουντο$/,  ouLen: 5 }
  ];

  // Reposition rough breathing for OU diphthongs:
  // α/ε/ο + (rough upsilon) → ͱ + (lowercase base) + υ
  function repositionRoughOU(s) {
    const chars = Array.from(s);
    const out = [];
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const nextExists = i + 1 < chars.length;
      const n = nextExists ? chars[i + 1] : '';
      const isBase = (c === 'α' || c === 'Α' || c === 'ε' || c === 'Ε' || c === 'ο' || c === 'Ο');
      const isRoughU = nextExists && ROUGH_UPSILON.includes(n);
      if (isBase && isRoughU) {
        out.push('ͱ');      // small heta placeholder (later unified to Ͱ)
        out.push(c.toLowerCase());
        out.push('υ');
        i++;                // consume the rough‑upsilon char
        continue;
      }
      out.push(c);
    }
    return out.join('');
  }

  // Collapse the LAST ending-OU ONLY (indexing via normalized string)
  function collapseEndingOU(coreWord, showMacrons) {
    const norm = normalizeForLookup(coreWord);
    if (KEEP_TRUE_OU_WORDS.has(norm)) return null;        // keep οὖν/οὐ/οὖς/βοῦς/τοῦτο

    for (const { re, ouLen } of ENDINGS) {
      const m = norm.match(re);
      if (!m) continue;
      if (norm === 'τουτο') continue;                     // guard demonstrative

      const start = norm.length - ouLen;                  // position of ending's 'ο'
      const replacement = showMacrons ? 'Ō' : 'Ο';
      // Replace *that* OU (two chars) with O/Ō; any rough placeholder ͱ remains before it
      return coreWord.slice(0, start) + replacement + coreWord.slice(start + 2);
    }
    return null;
  }

  // ἐν assimilation before β / π (standalone; whitespace only gap; no punctuation crossing)
  function applyEnAssimilation(tokens) {
    const isWhitespace  = s => /^[ \n\r\t]+$/.test(s);
    const isPunct       = s => /^[.,?!;:᾽'"]+$/.test(s);
    const startsWithBetaOrPi = s => {
      if (!s) return false;
      const look = s.replace(/^[\(\[\{«"“]+/, '');
      const first = look[0];
      return first === 'β' || first === 'Β' || first === 'π' || first === 'Π';
    };

    const out = tokens.slice();
    for (let i = 0; i < out.length; i++) {
      if (out[i] === 'ἐν') {
        let j = i + 1;
        // Skip whitespace only; if punctuation intervenes, do nothing
        while (j < out.length && isWhitespace(out[j])) j++;
        if (j < out.length && !isPunct(out[j]) && startsWithBetaOrPi(out[j])) {
          out[i] = 'ἐμ';
        }
      }
    }
    return out;
  }

  // Per-word OU processing with lexeme/ending rules
  function processWordForArchaicOU(word, showMacrons) {
    const punctuationRegex = /[.,?!;:᾽'"]+$/;
    const trailing = (word.match(punctuationRegex) || [''])[0];
    let core = word.replace(punctuationRegex, '');
    if (!core) return word;

    // 0) Restore rough‑OU placement
    core = repositionRoughOU(core);

    // If no OU at all (by explicit set), skip
    if (!OU_ANY_RE_ONE.test(core)) {
      return core + trailing;
    }

    const norm = normalizeForLookup(core);

    // 1) Keep whole word’s OU (οὖν, οὐ, οὖς, βοῦς, τοῦτο)
    if (KEEP_TRUE_OU_WORDS.has(norm)) {
      return core + trailing;
    }

    // 2) Collapse ALL OU for lexical spurious items (βουλή*, δοῦναι)
    if (COLLAPSE_WHOLE_WORDS.has(norm)) {
      const replacement = showMacrons ? 'Ō' : 'Ο';
      const replaced = core.replace(OU_ANY_RE, replacement);
      return replaced + trailing;
    }

    // 3) Try spurious ending collapse (only the ending’s OU)
    const collapsed = collapseEndingOU(core, showMacrons);
    if (collapsed !== null) return collapsed + trailing;

    // 4) Default: leave true OU; mapping will uppercase to ΟΥ
    return core + trailing;
  }

  // ======================= 4) CORE CONVERTER =======================
  // Extra diphthong handling carried over from your prior script:
  const diphthongVowelBases = new Set(['α','ε','ο','η','ω','Α','Ε','Ο','Η','Ω']);
  const roughBreathingSecond = new Set([
    'ἱ','ἵ','ἳ','ἷ','Ἱ','Ἵ','Ἳ','Ἷ',  // iota rough
    'ὑ','ὕ','ὓ','ὗ','Ὑ','Ὕ','Ὓ','Ὗ'   // upsilon rough
  ]);

  // Convert a *single Greek word* to archaic majuscule with current macron mode
  function convertToArchaic(word) {
    const normalizedInput = word.normalize('NFC');

    // OU morphology (reposition + keeps + endings + lexeme collapses)
    const prepped = processWordForArchaicOU(normalizedInput, MACRONS_ON);

    // Map char-by-char; handle rough second-vowel diphthongs (ι/υ) for big H placement
    let out = '';
    for (let i = 0; i < prepped.length; i++) {
      const ch = prepped[i];
      const prev = i > 0 ? prepped[i - 1] : null;

      if (prev && diphthongVowelBases.has(prev) && roughBreathingSecond.has(ch)) {
        const prevOut = mapChar(prev);
        // Remove previously appended prevOut (we're going to prepend Ͱ instead)
        out = out.slice(0, -prevOut.length);
        const currNoBreath = mapChar(ch).replace(/[ͱͰ]/g, '');
        out += 'Ͱ' + prevOut + currNoBreath;
        continue;
      }

      out += mapChar(ch);
    }

    // Unify small heta → big; force Ω/ω → Ο; κφ → ΧΦ after uppercasing
    out = out.replace(/ͱ/g, 'Ͱ').replace(/[Ωω]/g, 'Ο');
    out = out.replace(/ΚΦ/g, 'ΧΦ');

    return out;
  }

  // ======================= 5) NODE PROCESSING =======================
  // Use this to *detect* nodes to process (Greek or macron letters present)
  const ALL_GREEK_CHARS_REGEX = /([\u0100\u0112\u012a\u014c\u016a\u0232\u0370-\u03FF\u1F00-\u1FFF]+)/gu;

  function processAndWrap(rootNode) {
    if (![Node.ELEMENT_NODE, Node.DOCUMENT_NODE, Node.DOCUMENT_FRAGMENT_NODE].includes(rootNode.nodeType)) {
      return;
    }

    const walker = document.createTreeWalker(
      rootNode,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const p = node.parentElement;
          if (!p) return NodeFilter.FILTER_REJECT;
          if (isEditableRoot(p)) return NodeFilter.FILTER_REJECT;

          const tag = p.tagName ? p.tagName.toUpperCase() : '';
          if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEXTAREA') return NodeFilter.FILTER_REJECT;
          if (p.closest('.archaic-greek-text')) return NodeFilter.FILTER_REJECT;

          if (ALL_GREEK_CHARS_REGEX.test(node.nodeValue)) {
            ALL_GREEK_CHARS_REGEX.lastIndex = 0;
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_SKIP;
        }
      }
    );

    const nodes = [];
    let n;
    while ((n = walker.nextNode())) nodes.push(n);

    const TOKEN_SPLIT = /([ \n\r\t.,?!;:᾽'"]+)/; // spaces & punctuation as standalone tokens
    const GREEK_RE = /[\u0370-\u03FF\u1F00-\u1FFF]/; // does token contain Greek?

    for (const node of nodes) {
      const text = node.nodeValue;
      const parts = text.split(TOKEN_SPLIT);
      // Apply ἐν→ἐμ assimilation across whitespace (no punctuation crossing)
      const tokens = applyEnAssimilation(parts);

      const frag = document.createDocumentFragment();
      for (const tok of tokens) {
        if (!tok) continue;

        // If whitespace or punctuation, keep as text
        if (/^[ \n\r\t]+$/.test(tok) || /^[.,?!;:᾽'"]+$/.test(tok)) {
          frag.appendChild(document.createTextNode(tok));
          continue;
        }

        // If token contains Greek, convert & wrap; else keep as text
        if (GREEK_RE.test(tok)) {
          const span = document.createElement('span');
          span.className = 'archaic-greek-text';
          span.setAttribute('data-original', tok);
          span.textContent = convertToArchaic(tok);
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(tok));
        }
      }

      if (node.parentNode) node.parentNode.replaceChild(frag, node);
    }
  }

  function reconvertAll(root = document) {
    root.querySelectorAll('.archaic-greek-text').forEach(span => {
      const original = span.getAttribute('data-original');
      if (original != null) {
        span.textContent = convertToArchaic(original);
      }
    });
  }

  // ======================= 6) DYNAMIC CONTENT HANDLING =======================
  // Initial pass
  processAndWrap(document.body);

  // Queue + throttle
  const pending = new Set();
  let flushTimer = null;
  const FLUSH_DELAY = 50;
  const BATCH_SIZE = 20;

  function enqueue(node) {
    let el = null;
    if (node.nodeType === Node.ELEMENT_NODE) el = node;
    else if (node.nodeType === Node.TEXT_NODE) el = node.parentElement;
    if (!el) return;
    if (!document.body.contains(el)) return;
    if (isEditableRoot(el)) return;
    pending.add(el);
  }

  function minimizeRoots(nodes) {
    const set = new Set(nodes);
    return nodes.filter(n => {
      let p = n.parentElement;
      while (p) {
        if (set.has(p)) return false;
        p = p.parentElement;
      }
      return true;
    });
  }

  function scheduleFlush() {
    if (flushTimer) return;
    flushTimer = setTimeout(flush, FLUSH_DELAY);
  }

  function flush() {
    flushTimer = null;
    const unique = Array.from(pending);
    pending.clear();

    const roots = minimizeRoots(unique);
    let index = 0;

    function step() {
      const end = Math.min(index + BATCH_SIZE, roots.length);
      for (; index < end; index++) {
        processAndWrap(roots[index]);
      }
      if (index < roots.length) {
        setTimeout(step, 16);
      }
    }
    step();
  }

  // ======================= 7) MACRON TOGGLE BUTTON =======================
  (function injectMacronToggle() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'macronToggle';
    btn.textContent = 'Macrons: ' + (MACRONS_ON ? 'ON' : 'OFF');
    btn.style.cssText = [
      'position:fixed',
      'right:14px',
      'bottom:14px',
      'z-index:2147483647',
      'padding:8px 12px',
      'border-radius:10px',
      'border:1px solid rgba(255,255,255,.2)',
      'background:#111',
      'color:#eee',
      'font:600 12px system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
      'box-shadow:0 2px 8px rgba(0,0,0,.3)',
      'cursor:pointer',
      'opacity:.85'
    ].join(';');

    btn.addEventListener('mouseenter', () => btn.style.opacity = '1');
    btn.addEventListener('mouseleave', () => btn.style.opacity = '.85');

    btn.addEventListener('click', () => {
      MACRONS_ON = !MACRONS_ON;
      btn.textContent = 'Macrons: ' + (MACRONS_ON ? 'ON' : 'OFF');
      reconvertAll();
    });

    document.documentElement.appendChild(btn);
  })();

  // ======================= 8) MUTATION OBSERVER =======================
  const observer = new MutationObserver((mutations) => {
    const all = mutations.concat(observer.takeRecords());
    for (const m of all) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(enqueue);
        enqueue(m.target);
      } else if (m.type === 'characterData') {
        enqueue(m.target);
        enqueue(m.target.parentElement);
      }
    }
    scheduleFlush();
  });

  observer.observe(document.body, {
    childList: true,
    characterData: true,
    subtree: true
  });

})();