// ==UserScript==
// @name         Science Tokyo Portal Login Part2 公開用
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A login script for ScienceTokyo Portal second factor.
// @author       Amanami_217
// @match        https://isct.ex-tic.com/auth/session/second_factor
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532697/Science%20Tokyo%20Portal%20Login%20Part2%20%E5%85%AC%E9%96%8B%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532697/Science%20Tokyo%20Portal%20Login%20Part2%20%E5%85%AC%E9%96%8B%E7%94%A8.meta.js
// ==/UserScript==
//改変、再配布を認めますが、必ず原著者を明記してください。

//使い方(Part1の続き)
//「関数定義」の「シークレットキーを入力」のところにシークレットキーを入力
//Part1,Part2の両方を有効化
//（推奨）ブラウザ側のユーザー名とパスワードの記憶設定を削除
//ログアウト状態でScienceTokyoPortalにアクセスし、自動でログインが進行、完了することを確認する
//完了

//シークレットキーについて
//シークレットキーは科学大ポータル内の多要素認証でアプリ認証を設定する際に確認できます。認証ページでシークレットキーを記録し、Google Authenticator等外部サービスを用いて一度認証してからシークレットキーをこのスクリプトに入力、有効化してください。
//すでに認証を設定済みの方は一度解除して認証しなおす必要があります。この時元々のワンタイムパスワードは使用できなくなるので注意してください。

//タイムラインについて
//このスクリプトはsetTimeoutにより時間的に制御されています。読み込みを待機するため各functionの実行にはある程度の間隔が設定されていますが、必要な待機時間はパソコンや通信状況により異なる可能性があるため、調整は適切に行ってください。Part1とPart2の累積時間は独立しています。

//TOTP生成プロセスはClaude AIにより生成されています。

(function() {

//Timeline
//setTimeout(関数,累積時間ミリ秒)

setTimeout(onetime1,200);
setTimeout(onetime2,400);
setTimeout(onetime3,600);

})();

//関数定義

//Section 2

function onetime1() {
    document.querySelector("#totp-form-selector").click();
}

function onetime2() {
    document.querySelector("#totp").value = generateTOTP("XXXXXXXXXXXXXXXX");//シークレットキーを入力
}

function onetime3() {
    const elements = document.querySelectorAll(".btn.btn-info.mb-3");
    elements[1].click();
}

//TOTP Generater by Claude AI

function generateTOTP(secret, digits = 6, period = 30, timestamp = Date.now()) {

  const decodedSecret = base32Decode(secret);

  const counter = Math.floor(timestamp / 1000 / period);

  const hash = calculateHMACSHA1(decodedSecret, counterToBytes(counter));

  const offset = hash[hash.length - 1] & 0xf;
  const binary =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  const otp = binary % Math.pow(10, digits);

  return otp.toString().padStart(digits, '0');
}

function counterToBytes(counter) {
  const buffer = new Uint8Array(8);
  for (let i = 7; i >= 0; i--) {
    buffer[i] = counter & 0xff;
    counter = counter >> 8;
  }
  return buffer;
}

function base32Decode(base32) {

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const charsetMap = {};
  for (let i = 0; i < charset.length; i++) {
    charsetMap[charset[i]] = i;
  }

  base32 = base32.replace(/=+$/, '').toUpperCase();

  let bits = 0;
  let value = 0;
  let index = 0;
  const result = new Uint8Array(Math.ceil(base32.length * 5 / 8));

  for (let i = 0; i < base32.length; i++) {
    const char = base32[i];
    if (char === '=') continue;

    if (!(char in charsetMap)) {
      throw new Error('Invalid character in Base32 string: ' + char);
    }

    value = (value << 5) | charsetMap[char];
    bits += 5;

    if (bits >= 8) {
      bits -= 8;
      result[index++] = (value >> bits) & 0xff;
    }
  }

  return result.slice(0, index);
}

function calculateHMACSHA1(key, message) {

  const blockSize = 64;

  if (key.length > blockSize) {
    key = sha1(key);
  }

  if (key.length < blockSize) {
    const tmp = new Uint8Array(blockSize);
    tmp.set(key);
    key = tmp;
  }

  const ipad = new Uint8Array(blockSize);
  const opad = new Uint8Array(blockSize);

  for (let i = 0; i < blockSize; i++) {
    ipad[i] = key[i] ^ 0x36;
    opad[i] = key[i] ^ 0x5c;
  }

  const innerHash = sha1(concatUint8Arrays(ipad, message));
  return sha1(concatUint8Arrays(opad, innerHash));
}

function concatUint8Arrays(a, b) {
  const result = new Uint8Array(a.length + b.length);
  result.set(a);
  result.set(b, a.length);
  return result;
}

function sha1(message) {

  let h0 = 0x67452301;
  let h1 = 0xEFCDAB89;
  let h2 = 0x98BADCFE;
  let h3 = 0x10325476;
  let h4 = 0xC3D2E1F0;

  const bitLength = message.length * 8;

  const padLength = (message.length % 64 < 56) ?
    56 - (message.length % 64) :
    120 - (message.length % 64);

  const paddedMessage = new Uint8Array(message.length + padLength + 8);
  paddedMessage.set(message);
  paddedMessage[message.length] = 0x80;

  const dv = new DataView(paddedMessage.buffer);
  dv.setUint32(paddedMessage.length - 8, Math.floor(bitLength / Math.pow(2, 32)), false);
  dv.setUint32(paddedMessage.length - 4, bitLength & 0xffffffff, false);

  for (let i = 0; i < paddedMessage.length; i += 64) {

    const words = new Array(80);
    for (let j = 0; j < 16; j++) {
      words[j] = (paddedMessage[i + j * 4] << 24) |
                (paddedMessage[i + j * 4 + 1] << 16) |
                (paddedMessage[i + j * 4 + 2] << 8) |
                (paddedMessage[i + j * 4 + 3]);
    }

    for (let j = 16; j < 80; j++) {
      words[j] = rotateLeft(words[j-3] ^ words[j-8] ^ words[j-14] ^ words[j-16], 1);
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;

    for (let j = 0; j < 80; j++) {
      let f, k;

      if (j < 20) {
        f = (b & c) | ((~b) & d);
        k = 0x5A827999;
      } else if (j < 40) {
        f = b ^ c ^ d;
        k = 0x6ED9EBA1;
      } else if (j < 60) {
        f = (b & c) | (b & d) | (c & d);
        k = 0x8F1BBCDC;
      } else {
        f = b ^ c ^ d;
        k = 0xCA62C1D6;
      }

      const temp = (rotateLeft(a, 5) + f + e + k + words[j]) & 0xffffffff;
      e = d;
      d = c;
      c = rotateLeft(b, 30);
      b = a;
      a = temp;
    }

    h0 = (h0 + a) & 0xffffffff;
    h1 = (h1 + b) & 0xffffffff;
    h2 = (h2 + c) & 0xffffffff;
    h3 = (h3 + d) & 0xffffffff;
    h4 = (h4 + e) & 0xffffffff;
  }

  const hashBytes = new Uint8Array(20);
  const dv2 = new DataView(hashBytes.buffer);
  dv2.setUint32(0, h0, false);
  dv2.setUint32(4, h1, false);
  dv2.setUint32(8, h2, false);
  dv2.setUint32(12, h3, false);
  dv2.setUint32(16, h4, false);

  return hashBytes;
}

function rotateLeft(n, bits) {
  return ((n << bits) | (n >>> (32 - bits))) & 0xffffffff;
}