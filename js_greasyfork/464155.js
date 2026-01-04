// ==UserScript==
// @name                BiliBili-EasyCopy
// @name:zh-CN          BiliBili-去文本复制水印
// @namespace           https://github.com/TitanRGB
// @version             1.1
// @description         去掉B站专栏中复制文本时的水印。
// @description:zh-CN   去掉B站专栏中复制文本时的水印。
// @author              https://github.com/Mehver
// @author              https://github.com/ShenHongFei
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IB2cksfwAAAAlwSFlzAAAuIwAALiMBeKU/dgAABNtJREFUeJztlnlMVFcUxhG7UbvFpklTpUu6N8WhjaVNSGMT29Ta1KXVdEkXm2pLzWgpiKFCBBvbEA3GVKUbslkGlFFsLViL2AHBsKYigiKFKTAL21RnYQZlOf3O4z15PN8bBvpvX/JLhnfPPd937zn3PoKC/n80HorNZG4Fj4BwoHMn5N2bdsQSMt2c+np6BhwFbpANZqkJs2gMaAKjgJj+JCPtLrISJo2AivhK3+Ipii8C3YBk7FCK60A6cEnCjGXrz5T2q4XW140KExMrBqhxx3ELxtaA4EmEg8ECcFohzpjk4vOBRb7qobgcqtldTkllbmHC5zXDtKvYRrYvCyVzg0APZmiIzwCvA5uK+BWwRhKfBRrkq3Ym5pPR0DwcWz3Ek/9KqPD2Ve05OeqLzyV5HPC1pRSt0DDwArCoiF8Gm8BMycC7UsLRDVnUnlLE9W75rHbkIwQ9CkILf2qch7GdiHFKsSOIrfvGRIknPb0cpxB/CDSoiPvA+qviooEsTujZZKCy76s4YRsCwoGyR0LAW8DDsQV5zUJZxMSl4AZR/Eaxy5XivJsbuDTKxGUdXx+h1GO9FF0rJNylFJfFBqE8HyN2UJF8FESJ4kuARzHuAG+A665J+ntGfVX8KZ8QiG2npHJ3lKr6+PZyZ8eIR1Iu0gleA+WK90PgC56nlbCKA5PLXFSyt45cCfnbtTpbNud6YFDZZrPYZPJ3fPnc4S+ZCV1OLdt/o+G4bG6wsyDUnwFxXri4OqUJOVyqZX4TGfa3fItrVnm8+oc25mRmHWzbiQRfgVekJlOYUGs2OcXcF34NQGyBQpzLQBmH2mmdePuJTVYBPpB3MX4/Jo5prf7lyXZSMrFHEr+w7ShtMTn9raoAXP0oLS/1mFaduqIWV6fLtz89O6318UAMBI/EZScfy6i3xNQM+ROXyJTmzk03bwb0fuVEEytODByA+DkQHdAuiFvK3f0kiAR8Ex7Wj91eE5KvRWkijD3vIPnzT+RaV2KlNOdHM71UdJHeNPloaYmHQvf+PYLxPBAJngNhYOqfc7HOJkl8ddUwPZDZQUg2HToDKomKiTngPBuILOwXkn1aYqVt1b0BE33CTvent/Hc4ukY4NsvnQ3o8uyCgbPdLvJ6vQHT1OOiFwuEnWtXJr8ZPAvmg9l+TPB9QGEGm2Cgrc8jJPYMeKnD4aHWPje5POOC1otj7y65B4S/L/S66dXCTp5rlycNAUbg1Y99QI6D+1TEOa5UMJA3bmBfYz8tO9xJEblmWvlLF7VARDKQWtNLT+0z06KDnZRc2U2nbS7JgE2eeKmiw/lS+U5+zvVjX7i3gYtj5k0w4KDYP+yUdaafqruc9I+4WuY8zBxodlBSRbdAc4+6gVUqZ9wndv0Pohle+SVpXG5gKj2gVYK5+mu/3X7RMsBNydtsaHJQndVJf+L3wGQGRBOpUzEQpmGg1uKkLaj1Zmz3RpOdjOccWgZ6lAZuF+935T8YWgYG2UCrrOECgRt08SHBgFXtiN0NckCPH/FhcObh7C4jG8hsQONh1YGSi9LocsxsoEzrqLORW8BC8B5YJ/IhWM7Hky8kJLiHVzHNq/gyWKhpINAHSe4Cq8F+MXEKWAuimDvH+AS/twIf4C/jEvDgfxZXGLkJRPgZnwl04Da18X8B6r/U4ODjpiUAAAAASUVORK5CYII=
// @match               http*://bilibili.com
// @match               http*://bilibili.com/*
// @match               http*://www.bilibili.com
// @match               http*://www.bilibili.com/*
// @license             Mozilla Public License 2.0; MPL-2.0
// @charset		        UTF-8
// @homepageURL         https://github.com/SynRGB/BiliBili-EasyCopy
// @contributionURL     https://github.com/SynRGB/BiliBili-EasyCopy
// @downloadURL https://update.greasyfork.org/scripts/464155/BiliBili-EasyCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/464155/BiliBili-EasyCopy.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 此实现参考自 Issue #2 中 @ShenHongFei 的代码
    document.querySelector('body').addEventListener(
        'copy',
        event => {
            event.stopImmediatePropagation();
        },
        true
    );
})();

console.log("Userscript BiliBili-EasyCopy (BiliBili-去文本复制水印) loaded. See more details at https://github.com/SynRGB/BiliBili-EasyCopy");
