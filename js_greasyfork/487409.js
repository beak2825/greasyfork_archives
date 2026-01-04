// ==UserScript==
// @name         Go-Proxy-BingAI
// @namespace    https://github.com/Harry-zklcdc/go-proxy-bingai
// @description  Go-Proxy-BingAI 登录脚本
// @author       Harry-zklcdc
// @match        *://*.bing.com/*
// @icon         https://raw.githubusercontent.com/Harry-zklcdc/go-proxy-bingai/master/frontend/public/img/logo.svg
// @homepage     https://greasyfork.org/zh-CN/scripts/487409-go-proxy-bingai
// @version      1.0.0
// @grant        none
// @license      AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/487409/Go-Proxy-BingAI.user.js
// @updateURL https://update.greasyfork.org/scripts/487409/Go-Proxy-BingAI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('message', async function (e) {
      const d = e.data;
      const IG = d.IG, T = d.T;
      if ((IG != "" && IG != null && IG != undefined) && (T != "" && T != null && T != undefined)) {
          const S = base58Decode(_GU.ST);
          let tmpA = [];
          for (let i = 0; i < _GU.SP.length; i++) {
            tmpA.push(S[_GU.SP[i]]);
          }
          const e = base58Decode(tmpA.join(''));
          const token = await aesDecrypt(T, IG);
          if (e == token) {
              if (window.parent != undefined && window.parent != null) {
                  window.parent.postMessage({'cookies': document.cookie}, '*')
              }
          }
      }
    })
})();

function base58Encode(buffer) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const BASE = BigInt(58)

  const encoder = new TextEncoder();
  const bytes = typeof buffer === 'string' ? new Uint8Array(encoder.encode(buffer)) : buffer
  if (bytes.length === 0) return ''

  let i, j
  let digits = [BigInt(0)]
  for (i = 0; i < bytes.length; i++) {
    for (j = 0; j < digits.length; j++) digits[j] *= BigInt(256)
    digits[0] += BigInt(bytes[i])

    let carry = BigInt(0)
    for (j = 0; j < digits.length; ++j) {
      digits[j] += carry

      carry = digits[j] / BASE
      digits[j] %= BASE
    }

    while (carry > 0) {
      digits.push(carry % BASE)

      carry /= BASE
    }
  }

  for (i = 0; bytes[i] === 0 && i < bytes.length - 1; i++) digits.push(BigInt(0))

  return digits.reverse().map(d => ALPHABET[Number(d)]).join('')
}

function base58Decode(s) {
  const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
  const ALPHABET_MAP = {}
  for (let i = 0; i < ALPHABET.length; i++) {
    ALPHABET_MAP[ALPHABET.charAt(i)] = BigInt(i)
  }
  const BASE = BigInt(58)

  if (s.length === 0) return ''

  let i, j
  let bytes = [BigInt(0)]
  for (i = 0; i < s.length; i++) {
    const c = s[i]
    if (!(c in ALPHABET_MAP)) throw new Error('Non-base58 character')

    for (j = 0; j < bytes.length; j++) bytes[j] *= BASE
    bytes[0] += ALPHABET_MAP[c]

    let carry = BigInt(0)
    for (j = 0; j < bytes.length; ++j) {
      bytes[j] += carry

      carry = bytes[j] >> BigInt(8)
      bytes[j] &= BigInt(0xff)
    }

    while (carry > 0) {
      bytes.push(carry & BigInt(0xff))

      carry >>= BigInt(8)
    }
  }

  for (i = 0; s[i] === '1' && i < s.length - 1; i++) bytes.push(BigInt(0))

  return bytes.reverse().map(b => String.fromCharCode(Number(b))).join('')
}

async function aesEncrypt(e, t) {
  const c = new TextEncoder();
  const mb = c.encode(e), kb = c.encode(t);
  const iv = window.crypto.getRandomValues(new Uint8Array(16));

  const ck = await window.crypto.subtle.importKey(
    "raw",
    kb,
    { name: "AES-CBC", length: 256 },
    false,
    ["encrypt"]
  );
  const ed = await window.crypto.subtle.encrypt(
    { name: "AES-CBC", iv: iv },
    ck,
    mb
  )

  const r = new Uint8Array(iv.byteLength + ed.byteLength);
  r.set(new Uint8Array(iv), 0);
  r.set(new Uint8Array(ed), iv.byteLength);
  return btoa(String.fromCharCode.apply(null, r));
}

async function aesDecrypt(e, t) {
  const c = new TextEncoder();
  const kb = Uint8Array.from(c.encode(t));
  const cb = Uint8Array.from(atob(e), c => c.charCodeAt(0));

  const iv = cb.slice(0, 16);
  const ct = cb.slice(16);

  const key = await window.crypto.subtle.importKey(
    "raw",
    kb,
    { name: "AES-CBC", length: 256 },
    false,
    ["decrypt"]
  );

  const dd = await window.crypto.subtle.decrypt(
    { name: "AES-CBC", iv: iv },
    key,
    ct
  );

  const d = new TextDecoder();
  return d.decode(dd);
}

const _GU = {
  TP: 'L2yDt6NHpVg74zXbiBVawp2LXBqjJe69YXaqikLo6FSPRXTBSUtR6ThZ41EAwzei6dMFnTLBw6ngU32nwwgiSsRc1yemqufobYSrv96ii7qArPE9nssRwizpWUHDtJr8vSzmbjS',
  TC: 'EQWVgx176AeS3PtMCwMpt8iG89A6uTZfqKzBsQKhA9PjXcoJBEEX9pgNmgx1stfRCh6Q4gdGgNX23KfMJ2ZBLtUbnCQXWMPAHVCNkNCxehuyHwD2uk1PWHzkFCqqYVowZQxxjxfEUFwXwucCz47doC51LdpGDQrh28xq1MZy1qXb1XeNuvJ2U1duHGi1Bqg3GJ8oXqZpqKvrWYm7dDPbjgkEeywZJw59CwMAQFmdy7GBFDP9KkqChGM2sKTW2p3RVdauSZe6tvU2evCDC56idpu4JRwaFstSjnuxaoTcxXJDcBv1AXPSZSH3zEUSbeJbTB59mnDx1jd4nsEcM4smZPnMt6x4dG7atwfFuHvjwCTCeEg5jsMJSL5bP1K2tE1pVFC7XBTo4KNpJy5dUkHrHLk8GRdixUPSQczHh9Ex7sHKN7LZK72ZN8MDg2j1iooeqAGSNEQL3QYJj6gsoPTXzVaCo1yehRjD3v9JP98U7Dye77YhhdiDSYDAMrCdpfpmFugMnpbc8FuWVvDuJsSrpGdYZe6Sdg8vwTezayJ9SBdBXdgSuksSGfgU',
  ST: '5n9nA7VpTUm7sxT4EN6jpH9WitUG3hCGM6su8X3riDwbXrPcRP6VR4mh4WumPerkSPpakrQYdRdXHwfBrpTZa',
  SP: [ 59, 5, 51, 2, 24, 23, 5, 35, 14, 40, 26, 33, 58, 26, 9, 15, 61, 31, 53, 55, 47, 26, 40, 12, 22, 13, 10, 44, 17, 59, 31, 45, 34, 1, 26, 9, 43, 44 ]
}