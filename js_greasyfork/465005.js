// ==UserScript==
// @name         hj-decode-image
// @namespace    https://*.com/hjstore/images/*.jpg.txt
// @version      0.0.1
// @description  decode hj data
// @author       You
// @match        https://*.com/hjstore/images/*.jpg.txt
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/465005/hj-decode-image.user.js
// @updateURL https://update.greasyfork.org/scripts/465005/hj-decode-image.meta.js
// ==/UserScript==

const imageDecode = function () {
  const e = "ABCD*EFGHIJKLMNOPQRSTUVWX#YZabcdefghijklmnopqrstuvwxyz1234567890";

  const n = function (e) {
    let t,
      n = "",
      i = 0,
      o = 0,
      a = 0;
    while (i < e.length)
      (o = e.charCodeAt(i)),
        o < 128
          ? ((n += String.fromCharCode(o)), i++)
          : o > 191 && o < 224
          ? ((a = e.charCodeAt(i + 1)),
            (n += String.fromCharCode(((31 & o) << 6) | (63 & a))),
            (i += 2))
          : ((a = e.charCodeAt(i + 1)),
            (t = e.charCodeAt(i + 2)),
            (n += String.fromCharCode(
              ((15 & o) << 12) | ((63 & a) << 6) | (63 & t)
            )),
            (i += 3));
    return n;
  };

  return (t) => {
    let i,
      o,
      a,
      s,
      r,
      c,
      l,
      u = "",
      d = 0;
    // eslint-disable-next-line no-useless-escape
    t = t.replace(/[^A-Za-z0-9\*\#]/g, "");
    while (d < t.length)
      (s = e.indexOf(t.charAt(d++))),
        (r = e.indexOf(t.charAt(d++))),
        (c = e.indexOf(t.charAt(d++))),
        (l = e.indexOf(t.charAt(d++))),
        (i = (s << 2) | (r >> 4)),
        (o = ((15 & r) << 4) | (c >> 2)),
        (a = ((3 & c) << 6) | l),
        (u += String.fromCharCode(i)),
        64 != c && (u += String.fromCharCode(o)),
        64 != l && (u += String.fromCharCode(a));
    return (u = n(u)), u;
  };
};


(function () {
    "use strict";
    const data = imageDecode()(document.querySelector("pre").textContent);

    console.log(data);

    const image = document.createElement("img");
    image.src=data;
    document.body.innerHTML = "";
    document.body.appendChild(image);
})();
