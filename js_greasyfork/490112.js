// ==UserScript==
// @name Северные духи
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description Модельки духов-покровителей Северного клана
// @author Nordgeist
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://catwar.su/cw3/*
// @downloadURL https://update.greasyfork.org/scripts/490112/%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D0%B5%20%D0%B4%D1%83%D1%85%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/490112/%D0%A1%D0%B5%D0%B2%D0%B5%D1%80%D0%BD%D1%8B%D0%B5%20%D0%B4%D1%83%D1%85%D0%B8.meta.js
// ==/UserScript==

(function() {
let css = `
    /* АРХАР */
    #tr_field [style*='/cw3/composited/1adf747745fc4bd6.png'] {
    background-image: url('https://i.ibb.co/xJBhks3/IMG-3830.png') !important;}

    /* БАРС */
    #tr_field [style*='/cw3/composited/d59cac08b6d9e432.png'] {
    background-image: url('https://i.ibb.co/WgjLFhZ/image.png') !important;}

    /* БАРСУК */
    #tr_field [style*='/cw3/composited/4731e0c56fec2bd9.png'] {
    background-image: url('https://i.ibb.co/51dN6FZ/IMG-3831.png') !important;}

    /* БЕЛКА */
    #tr_field [style*='/cw3/composited/af4658e0dbb14f5c.png'] {
    background-image: url('https://i.ibb.co/SNpPxnG/Bez-nazvania167-20240305200253.png') !important;}

    /* БИЗОН */
    #tr_field [style*='/cw3/composited/65c988d2f5744fff.png'] {
    background-image: url('https://i.ibb.co/3N4kq3m/bizon2.png') !important;}

    /* ВЕПРЬ */
    #tr_field [style*='/cw3/composited/da02199d151b7446.png'] {
    background-image: url('https://i.ibb.co/sqg1rZ5/kaban.png') !important;}

    /* ВОЛК */
    #tr_field [style*='/cw3/composited/df073c6dedd85c7b.png'] {
    background-image: url('https://i.ibb.co/w0hDqCh/8-1.png') !important;}

    /* ВОРОН */
    #tr_field [style*='/cw3/composited/8dbaf50a583db240.png'] {
    background-image: url('https://i.ibb.co/2Yf8gfq/Voron.png') !important;}

    /* ДИКОБРАЗ */
    #tr_field [style*='/cw3/composited/9296387875623b97.png'] {
    background-image: url('https://i.ibb.co/HFPGCww/Dikobrazdukh.png') !important;}

    /* ЕНОТ */
    #tr_field [style*='/cw3/composited/f450f64e8011cc8d.png'] {
    background-image: url('https://i.ibb.co/tB8wG3D/Bez-nazvania62-20240312215747.png') !important;}

    /* ЖУРАВЛЬ */
    #tr_field [style*='/cw3/composited/b931c0d3e89ced2b.png'] {
    background-image: url('https://i.ibb.co/wdQ97bK/zhuravushka-1.png') !important;}

    /* ЗАЯЦ */
    #tr_field [style*='/cw3/composited/46cad17d67397671.png '] {
    background-image: url('https://i.ibb.co/nbqcVPp/Bez-nazvania61-20240313172155.png') !important;}

    /* ЗМЕЯ */
    #tr_field [style*='/cw3/composited/b6dc92fb5961d46f.png'] {
    background-image: url('https://i.ibb.co/0KKGg2z/zmeyka2.png') !important;}

    /* КАРИБУ */
    #tr_field [style*='/cw3/composited/9540553ac9c512ee.png'] {
    background-image: url('https://i.ibb.co/db45H8X/olen2.png') !important;}

    /* КОЙОТ */
    #tr_field [style*='/cw3/composited/8ebf9036877f84c5.png'] {
    background-image: url('https://i.ibb.co/gv4h9nV/Bez-nazvania3691-20240221161455.png') !important;}

    /* КОНЬ */
    #tr_field [style*='/cw3/composited/fba7869747aab374.png'] {
    background-image: url('https://i.ibb.co/x6C2W2x/Bez-nazvania3765-20240312225410.png') !important;}

    /* КУГУАР */
    #tr_field [style*='/cw3/composited/0044c080ad59d015.png'] {
    background-image: url('https://i.ibb.co/kSpBYqp/Bez-nazvania3681-20240225225705-1.png') !important;}

    /* ЛАНЬ */
    #tr_field [style*='/cw3/composited/db8caa8085396849.png'] {
    background-image: url('https://i.ibb.co/CJwGySf/Bez-nazvania3730-20240309121058.png') !important;}

    /* ЛИСА */
    #tr_field [style*='/cw3/composited/e8617b2139ee4df4.png'] {
    background-image: url('https://i.ibb.co/0fhybM3/7-2.png') !important;}

    /* ЛОСЬ */
    #tr_field [style*='/cw3/composited/768c52096633ed0a.png'] {
    background-image: url('https://i.ibb.co/7pJQbgP/los2.png') !important;}

    /* МЕДВЕДЬ */
    #tr_field [style*='/cw3/composited/142f9657847dd4af.png'] {
    background-image: url('https://i.ibb.co/0cTpMRj/Bez-nazvania166-20240305113628.png') !important;}

    /* ОРЁЛ */
    #tr_field [style*='/cw3/composited/34c8f68008808c29.png'] {
    background-image: url('https://i.ibb.co/qy3y0HF/yv2.png') !important;}

    /* ПЕСЕЦ */
    #tr_field [style*='/cw3/composited/f964c2f2d58ca793.png'] {
    background-image: url('https://i.ibb.co/gVfRKJ5/Bez-nazvania3717-20240304182743.png') !important;}

    /* РОСОМАХА */
    #tr_field [style*='/cw3/composited/eda01425609b31a9.png'] {
    background-image: url('https://i.ibb.co/nbMPsXG/IMG-5772.png') !important;}

    /* РЫСЬ */
    #tr_field [style*='/cw3/composited/9d8d60563a2c62de.png'] {
    background-image: url('https://i.ibb.co/4mZ2Ny0/Rys.png') !important;}

    /* СОВА */
    #tr_field [style*='/cw3/composited/4ef92c1182255c1c.png'] {
    background-image: url('https://i.ibb.co/JjVYMTz/yv1.png') !important;}

    /* СОКОЛ */
    #tr_field [style*='/cw3/composited/64e4a21e0b27d7f6.png'] {
    background-image: url('https://i.ibb.co/qdSJmmk/yv.png') !important;}

    /* ЗАВИРУХА */
    #tr_field [style*='/cw3/composited/d7aeef59c74edcbb.png'] {
    background-image: url('http://d.zaix.ru/oQS9.png') !important;}

    /* БУРЕНЬКИЙ */
    #tr_field [style*='/cw3/composited/7162acf1525dfa24.png'] {
    background-image: url('https://i.ibb.co/89f0mXc/image.png') !important;}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
