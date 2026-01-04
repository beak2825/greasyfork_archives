// ==UserScript==
// @name         hj-decode
// @namespace    https://*.haijiao.com/api/topic/*
// @version      0.0.6
// @description  decode hj data
// @author       You
// @match        https://*.haijiao.com/api/topic/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/458714/hj-decode.user.js
// @updateURL https://update.greasyfork.org/scripts/458714/hj-decode.meta.js
// ==/UserScript==

function topicsDecode() {
    const w =
          /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;

    const c = String.fromCharCode;

    const l = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
          u = ((t) => {
              const e = {};
              for (let n = 0, r = t.length; n < r; n++) {
                  e[t.charAt(n)] = n;
              }
              return e;
          })(l);

    const x = (t) => {
        switch (t.length) {
            case 4:
                const e =
                      ((7 & t.charCodeAt(0)) << 18) |
                      ((63 & t.charCodeAt(1)) << 12) |
                      ((63 & t.charCodeAt(2)) << 6) |
                      (63 & t.charCodeAt(3)),
                      n = e - 65536;
                return c(55296 + (n >>> 10)) + c(56320 + (1023 & n));
            case 3:
                return c(
                    ((15 & t.charCodeAt(0)) << 12) |
                    ((63 & t.charCodeAt(1)) << 6) |
                    (63 & t.charCodeAt(2))
                );
            default:
                return c(((31 & t.charCodeAt(0)) << 6) | (63 & t.charCodeAt(1)));
        }
    };
    const C = (t) => {
        const e = t.length,
              n = e % 4,
              r =
              (e > 0 ? u[t.charAt(0)] << 18 : 0) |
              (e > 1 ? u[t.charAt(1)] << 12 : 0) |
              (e > 2 ? u[t.charAt(2)] << 6 : 0) |
              (e > 3 ? u[t.charAt(3)] : 0),
              i = [c(r >>> 16), c((r >>> 8) & 255), c(255 & r)];
        return (i.length -= [0, 0, 2, 1][n]), i.join("");
    };

    const b = (t) => {
        return t.replace(/\S{1,4}/g, C);
    };

    const k = (t) => {
        return b(String(t).replace(/[^A-Za-z0-9\+\/]/g, ""));
    };

    const S =
          k && "function" == typeof k
    ? (t) => {
        return k(t);
    }
    : (t) => {
        return t.replace(/\S{1,4}/g, C);
    };

    const O = (t) => {
        return t.replace(w, x);
    };

    const E = (t) => {
        return O(S(t));
    };

    const j = (t) => {
        return String(t)
            .replace(/[-_]/g, function (t) {
            return "-" == t ? "+" : "/";
        })
            .replace(/[^A-Za-z0-9\+\/]/g, "");
    };

    const decode = (t) => {
        return E(j(t));
    };
    return (e) => {
        const i = e;
        return (
            i.isEncrypted &&
            (i.data.results
             ? (e.data.results = JSON.parse(
                decode(decode(decode(i.data.results)))
            ))
             : decode(decode(decode(i.data))).indexOf("{") >= -1
             ? (e.data = JSON.parse(decode(decode(decode(i.data)))))
             : (e.data = decode(decode(decode(i.data))))),
            e.data
        );
    };
}

function imageDecode() {
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
}

const DOMAIN = "https://www.haijiao.com";

async function getAttachments(attachments) {
    const result = await Promise.all(
        attachments.map(async (r) => {
            if (r.category === 'images') {
                const result = await fetch(r.remoteUrl);
                const data = imageDecode()(await result.text()) ?? null;
                return {
                    ...r,
                    imageBase64: data
                };
            }
            if (r.category === "video") {
                const result = await fetch(`${DOMAIN}/api/topic/att/${r.id}`);
                const data = topicsDecode()(await result.json()) ?? [];

                return {
                    ...r,
                    videoURL: data.length > 0 ? data[0].url : "",
                };
            }
            return r;
        })
    );
    return result;
}

async function getTopicData(topicId) {
    const url = `${DOMAIN}/api/topic/${topicId}`;
    const result = await (await fetch(url)).json();
    let data = topicsDecode()(result);

    const attachments = getAttachments(data.attachments);

    return {
        ...data,
        attachments: attachments,
    };
};

function apiPageRender() {
    const paths = location.pathname.split("/");
    const topicId = paths[paths.length - 1];
    (async () => {
        // const data = await getTopicData(topicId);

        const data = topicsDecode()(JSON.parse(document.querySelector("pre").textContent));

        console.log(data);

        const pre = document.createElement("pre");
        pre.innerHTML=JSON.stringify(data, 4);
        document.body.innerHTML = "";
        document.body.appendChild(pre);

        // const pre = document.querySelector('pre');
        // pre.innerHTML = JSON.stringify(data, 4);

        // const pre = document.createElement("pre");
        // pre.innerHTML = JSON.stringify(data, 4);
        // document.body.innerHTML = "";
        // document.body.appendChild(pre);

        // const div = document.createElement("div");
        // div.id = "jsoneditor";
        // document.body.innerHTML = "";
        // document.body.appendChild(div);
        // const container = document.getElementById("jsoneditor");
        // const options = {};
        // const editor = new JSONEditor(container, options);
        // editor.set(data);

        // document.write(`<pre style="word-wrap: break-word; white-space: pre-wrap;">${JSON.stringify(data, 4)}</pre>`);
        // GM_addElement("script", {
        //   src: "chrome-extension://jbikjaejnjfbloojafllmdiknfndgljo/document.js",
        //   type: "module",
        // });
    })();
}

function topicPageRender() {
    const topicId = new URLSearchParams(location.search).get("pid");
    if (topicId== null){
        return;
    }
    const data = getTopicData(topicId);
    console.log(data);
    // document.querySelector('.dplayer-video')
}

(function () {
    "use strict";
    if (location.pathname.includes("api/topic")) {
        apiPageRender();
        return;
    }
    topicPageRender();
})();
