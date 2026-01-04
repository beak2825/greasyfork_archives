"use strict";
// ==UserScript==
// @name         ixdzs8.tw
// @namespace    pl816098
// @version      1.2.9.2
// @description  自用
// @author       paul
// @match        https://ixdzs8.com/read/*/*.html
// @match        https://ixdzs8.com/read/*/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixdzs8.tw
// @license      MIT
// @grant        GM_addStyle
// @grant        window.close
// @supportURL   https://github.com/Paul-16098/vs_code/issues/
// @homepageURL  https://github.com/Paul-16098/vs_code/blob/main/js/userjs/README.md
// @downloadURL https://update.greasyfork.org/scripts/484505/ixdzs8tw.user.js
// @updateURL https://update.greasyfork.org/scripts/484505/ixdzs8tw.meta.js
// ==/UserScript==
// @ts-expect-error
var ele = [];
{
    // @ts-expect-error
    var _GM_addStyle;
    {
        if (typeof GM_addStyle !== "undefined") {
            _GM_addStyle = GM_addStyle;
        }
        else if (typeof GM !== "undefined" &&
            typeof GM.addStyle !== "undefined") {
            _GM_addStyle = GM.addStyle;
        }
        else {
            _GM_addStyle = function (CssStr) {
                var styleEle = document.createElement("style");
                styleEle.classList.add("_GM_addStyle");
                styleEle.innerHTML = CssStr;
                document.head.appendChild(styleEle);
                return styleEle;
            };
        }
    }
}
var url = window.location.href;
var next_page_url = document.querySelector("body > div.page-d.page-turn > div > a.chapter-paging.chapter-next").href;
// @ts-expect-error
var pattern = {
    book: {
        pattern: /^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/(?!end)p[0-9]*\.html)$/gm,
        is: function (url) {
            if (pattern.book.pattern.test(url)) {
                return true;
            }
            else {
                return false;
            }
        },
    },
    info: {
        pattern: /^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/)$/gm,
        is: function (url) {
            if (pattern.info.pattern.test(url)) {
                return true;
            }
            else {
                return false;
            }
        },
    },
    end: {
        pattern: /^(https?:\/\/)(ixdzs8\.[a-zA-Z]{1,3}\/read\/[0-9]+\/end\.html)$/gm,
        is: function (url) {
            if (pattern.end.pattern.test(url)) {
                return true;
            }
            else {
                return false;
            }
        },
    },
};
if (pattern.book.is(url)) {
    ele = [
        "#page-id3",
        "#page-toolbar",
        "#page > article > section > p:nth-child(1)",
    ];
    ele.forEach(function (ele) {
        if (document.querySelector(ele)) {
            document.querySelector(ele).remove();
        }
    });
    _GM_addStyle("\n    .page-content{\nmax-width: none;\npadding: 10px 15px;\ntransform: translateX(0px);\nbackground: #ffffff!important;\n}\n");
}
if (pattern.end.is(url) || pattern.end.is(next_page_url)) {
    // console.log("end")
    if (pattern.end.is(next_page_url)) {
        document.addEventListener("keydown", function (e) {
            if (!e.repeat) {
                switch (true) {
                    case e.key === "ArrowRight": {
                        // console.log('(e.key === "ArrowRight") === true');
                        window.close();
                        break;
                    }
                    default: {
                        // console.log("e: ", e);
                        break;
                    }
                }
            }
        });
    }
    if (pattern.end.is(url)) {
        window.close();
    }
}
if (pattern.info.is(url)) {
    document.querySelector("#intro").click();
}
//# sourceMappingURL=ixdzs8tw.user.js.map