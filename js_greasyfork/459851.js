// ==UserScript==
// @name         rewrite-hj-topic-detail-user-url-link
// @namespace    https://*.com/post/details?pid=*
// @version      0.0.8
// @description  rewrite hj topic detail user url link
// @author       You
// @match        https://*.com/post/details?pid=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.11/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/459851/rewrite-hj-topic-detail-user-url-link.user.js
// @updateURL https://update.greasyfork.org/scripts/459851/rewrite-hj-topic-detail-user-url-link.meta.js
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

async function getUserId(topicId) {
    const result = await fetch(`/api/topic/${topicId}`);
    const data = topicsDecode()(await result.json());
    return data.user.id;
};

function preparingCopyText(text){
    let timer;
    const setup = () => {
        console.log('Preparing to copy text');
        const selector="#toolbar-container > .hj-search > .text";
        const el = document.querySelector(selector);
        console.log(el);
        if (el == null){
            return;
        }

        el.dataset.clipboardText = text;
        new ClipboardJS(selector);
        el.onclick = () => {window.close()}
        document.addEventListener('keyup', (e) => {
            if (e.ctrlKey && e.keyCode === 67){
                el.click();
            }
        })
        console.log('done');
        clearInterval(timer);
    };

    timer = setInterval(() => {
        setup()
    }, 300);
}

async function replaseEL(){
    const topicId = new URLSearchParams(location.search).get("pid");
    const userId = await getUserId(topicId);
    const el = document.querySelector("#details-page > div.header > div.statistics > div.atl-info.text-center > span:nth-child(1) > a");
    const a = document.createElement("a");
    a.className = el.className;
    a.href = `/homepage/last/${userId}`;
    a.title = el.title;
    a.target = "_blank";
    a.textContent = el.textContent;
    el.replaceWith(a);

    preparingCopyText(userId);
}


(async function () {
    "use strict";
    setTimeout(async () => {
        await replaseEL();
    }, 1000);

})();
