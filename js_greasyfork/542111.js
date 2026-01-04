// ==UserScript==
// @name         Cbox darkener
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  自動で輝度いじる
// @author       eringo216
// @match        https://www3.cbox.ws/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542111/Cbox%20darkener.user.js
// @updateURL https://update.greasyfork.org/scripts/542111/Cbox%20darkener.meta.js
// ==/UserScript==

(function() {
  // HEXをRGBに変換
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16)
    ];
  }

  // RGBをHSLに変換
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // 無彩色
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return [h * 360, s * 100, l * 100];
  }

  // HSLをRGBに変換
  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  // カラーコードの明度を反転
  function invertLightness(color) {
    let r, g, b, a = 1;
    // HEX (#RRGGBB or #RGB)
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color)) {
      [r, g, b] = hexToRgb(color);
    }
    // RGB or RGBA
    else if (/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.test(color)) {
      const match = color.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/);
      r = parseInt(match[1]);
      g = parseInt(match[2]);
      b = parseInt(match[3]);
      if (match[4]) a = parseFloat(match[4]);
    } else {
      return color; // 非対応はそのまま
    }

    // RGBをHSLに変換
    const [h, s, l] = rgbToHsl(r, g, b);
    let newL

    if (l > 60 || l < 30) { //明るめのを暗めにするのと、極端に暗いところ（文字など）を明るくする
      // 明度を反転
      newL = 100 - l;
    } else {//中間ぐらいの色を暗くする
      newL = 70 - l;
    }
    // HSLをRGBに変換
    const [newR, newG, newB] = hslToRgb(h, s, newL);
    return a < 1 ? `rgba(${newR}, ${newG}, ${newB}, ${a})` : `rgb(${newR}, ${newG}, ${newB})`;
  }

  // CSSルールを処理
  function processCSSRule(rule) {
    if (rule.style) {
      for (const prop of ['color', 'background-color', 'border-color']) {
        const value = rule.style.getPropertyValue(prop);
        if (value && value.match(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})|rgba?\(/)) {
          const newValue = value.replace(
            /(#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})|rgba?\([^)]+\))/g,
            invertLightness
          );
          rule.style.setProperty(prop, newValue);
        }
      }
    }
    if (rule.cssRules) {
      Array.from(rule.cssRules).forEach(processCSSRule);
    }
  }

  // スタイルシートを処理
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      if (sheet.cssRules) Array.from(sheet.cssRules).forEach(processCSSRule);
    } catch (e) {}
  });

  // インラインスタイルを処理
  document.querySelectorAll('[style]').forEach(el => {
    const style = el.getAttribute('style');
    if (style && style.match(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})|rgba?\(/)) {
      const newStyle = style.replace(
        /(#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})|rgba?\([^)]+\))/g,
        invertLightness
      );
      el.setAttribute('style', newStyle);
    }
  });
})();