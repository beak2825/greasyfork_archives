// ==UserScript==
// @name                 Sarasa-Gothic-Font-Substitution-Tool
// @name:en-US           Sarasa Gothic Font Substitution Tool
// @name:zh-CN           更纱黑体字体替换工具
// @name:zh-TW           更紗黑體字型替換工具
// @name:zh-HK           更紗黑體字型替換工具
// @name:ja-JP           更紗ゴシックフォント置換ツール
// @name:ko-KR           사라사고딕 폰트 대체 도구
// @namespace            https://gist.github.com/zozovo/8a76915acf197a873304dd23f2cfd49c
// @version              8.9
// @author               zozovo
// @description          Replace the font with Sarasa Gothic (CJK) and the corresponding monospaced one.
// @description:en-US    Replace the font with Sarasa Gothic (CJK) and the corresponding monospaced one.
// @description:zh-CN    将字体替换为更纱黑体（中日韩）和对应的等宽字体。
// @description:zh-TW    將字體替換為更紗黑體（中日韓）和對應的等寬字體。
// @description:zh-HK    將字體替換為更紗黑體（中日韓）和對應的等寬字體。
// @description:ja-JP    フォントを更紗ゴシック（中日韓）および対応する等幅フォントに置き換えます。
// @description:ko-KR    글꼴을사라사고딕 (중일한) 및해당등폭글꼴로대체합니다.
// @match                *://*/*
// @run-at               document-start
// @grant                GM_addStyle
// @license              MIT
// @supportURL           https://gist.github.com/zozovo/8a76915acf197a873304dd23f2cfd49c
// @downloadURL https://update.greasyfork.org/scripts/462999/Sarasa-Gothic-Font-Substitution-Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/462999/Sarasa-Gothic-Font-Substitution-Tool.meta.js
// ==/UserScript==

const LANG_CODE_OBJ = {
  "zh-CN": "SC",
  "zh-SG": "SC",
  "zh-TW": "TC",
  "zh-HK": "HC",
  "ja": "J",
  "ko": "K",
  "ko-KR": "K",
  "ko-KP": "K",
};

const lang_code = LANG_CODE_OBJ[navigator.language] || "SC"; // Default to SC if not found

const FONT_FAMILY_TYPE = {
  generic: "var(--icon-font-family), var(--generic-font-family), system-ui;",
  code: "var(--icon-font-family), var(--code-font-family), monospace;",
};

const EMOJIS_UNICODE_RANGE = // Unicode CLDR: check https://unicode.org/emoji/charts/emoji-style.txt
  // "U+00A9, U+00AE" + // BMP: Latin-1 Supplement: copyright and registered
  "U+200C, U+200D, U+203C, U+2049, " + // BMP: General Punctuation: ZWNJ and ZWJ, double exclamation mark, exclamation question mark
  "U+20E3, " + // BMP: Combining Diacritical Marks for Symbols: combining enclosing keycap
  // "U+2122, " + // BMP: Letterlike Symbols: trade mark
  "U+2139, " + // BMP: Letterlike Symbols: information
  "U+2190-21FF, " + // BMP: Arrows
  "U+23??, " + // BMP: Miscellaneous Technical
  "U+24C2, " + // BMP: Enclosed Alphanumerics: circled M
  "U+25A0-27BF, " + // BMP: Geometric Shapes, Miscellaneous Symbols, Dingbats
  "U+2B??, " + // BMP: Miscellaneous Symbols and Arrows
  "U+2934, U+2935, " + // BMP: Supplemental Arrows-B: right arrow curving up, right arrow curving down
  "U+3030, U+303D, " + // BMP: CJK Symbols and Punctuation: wavy dash, part alternation mark
  "U+3297, U+3299, " + // BMP: Enclosed CJK Letters and Months: Japanese “congratulations” button, Japanese “secret” button
  "U+FE0E, U+FE0F, " + // BMP: Variation Selectors: VS15, VS16
  "U+1F???"; // SMP

GM_addStyle(`
@font-face {
  font-family: "Color Emoji";
  src: local("Apple Color Emoji"), local("Noto Color Emoji"),
    local("Segoe UI Emoji");
  unicode-range: ${EMOJIS_UNICODE_RANGE};
}

@font-face {
  font-family: "Monochrome Emoji";
  src: local("Apple Monochrome Emoji"), local("Noto Emoji"),
    local("Segoe Fluent Icons"), local("Segoe MDL2 Assets");
  unicode-range: ${EMOJIS_UNICODE_RANGE};
}

@font-face {
  font-family: "Consolas";
  src: local("Sarasa Fixed ${lang_code}");
}

@font-face {
  font-family: "Courier New";
  src: local("Sarasa Fixed ${lang_code}");
}

:root {
  --icon-font-family: "Color Emoji", "Monochrome Emoji";
  --generic-font-family: "Sarasa UI ${lang_code}";
  --code-font-family: "Sarasa Fixed ${lang_code}";
}

:is([lang$="TW"], [lang$="Hant"]) {
  --generic-font-family: "Sarasa UI TC";
  --code-font-family: "Sarasa Fixed TC";
}

:is([lang$="HK"], [lang$="MO"]) {
  --generic-font-family: "Sarasa UI HC";
  --code-font-family: "Sarasa Fixed HC";
}

:lang(ja) {
  --generic-font-family: "Sarasa UI J";
  --code-font-family: "Sarasa Fixed J";
}

:lang(ko) {
  --generic-font-family: "Sarasa UI K";
  --code-font-family: "Sarasa Fixed K";
}

:not(#_#_) {
  /** google-symbols https://fonts.google.com/icons,
    * font-awesome https://fontawesome.com/iconsother,
    * other icons
    */
  :not([class*="-symbols"], [class*="fa-"], [class*="icon"]) {
    /* generic fonts, except mathjax, <i> <s> for icons, <a> <span> for inherited */
    &:not(a, i, s, span, textarea, button *):not(
        math,
        math *,
        mjx-container,
        mjx-container *,
        [aria-hidden="true"],
        [role="presentation"],
        [role="none"],
        [aria-hidden="true"] *,
        [role="presentation"] *,
        [role="none"] *
      ) {
      font-family: ${FONT_FAMILY_TYPE.generic}

      /** mono fonts and code editors:
        * Ace https://ace.c9.io/,
        * CodeMirror https://codemirror.net/ https://codemirror.net/5/,
        * Monaco https://microsoft.github.io/monaco-editor/,
        * TailwindCSS https://tailwindcss.com/docs/font-family 
        */
      &:where(code, kbd, pre, samp, var),
      &:where([class*="ace_editor"], [class*="cm-"], [class*="monaco-editor"], [class*="font-mono"]) {
        font-family: ${FONT_FAMILY_TYPE.code}

        /* <i> for icon, <a> <span> for inherited */
        & :not(a, i, span) {
          font-family: ${FONT_FAMILY_TYPE.code}
        }
      }

      /* for github readme*/
      &:where([class*="code"]:not(#readme, .readme)) {
        font-family: ${FONT_FAMILY_TYPE.code}
      }
    }
  }

  /* discuz */
  :is(a[class*="xst"]) {
    font-family: ${FONT_FAMILY_TYPE.generic}
  }
}
`);
