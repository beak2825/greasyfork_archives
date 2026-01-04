// ==UserScript==
// @name         便捷查找日文汉字读音
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  基于 yomikatawa 开发。
// @author       kOda
// @match        *://*/*
// @license MIT
// @connect         yomikatawa.com
// @connect         www.ezlang.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @require       https://code.jquery.com/jquery-3.7.1.min.js
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/478267/%E4%BE%BF%E6%8D%B7%E6%9F%A5%E6%89%BE%E6%97%A5%E6%96%87%E6%B1%89%E5%AD%97%E8%AF%BB%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/478267/%E4%BE%BF%E6%8D%B7%E6%9F%A5%E6%89%BE%E6%97%A5%E6%96%87%E6%B1%89%E5%AD%97%E8%AF%BB%E9%9F%B3.meta.js
// ==/UserScript==

const CONST = {
    popupDelayTime: 1500,
    kanjiTrans: true,
    defaultTitle: "<h1><span>「<strong></strong>」</span>の読み方</h1>",
    errorTitle: `<h1>
                    <span><strong>读法获取失败！</strong></span>
                    <br>原因可能是非支持的汉字，可以在开启汉字转换功能 kanjiTrans 后尝试...
                </h1>`,
    html: `
    <div id="yomikata-wrap">
        <button>
            <img src="data:image/x-icon;base64,AAABAAEAEBAAAAEACABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAAAABMLAAATCwAAAAEAAAAAAADy9/oA5uvtANne4ACVmZoAsbW2AKqurwCmqqsAeXx9AIWIiQCDhocAfoGCAH2AgQDY3d8A1drcANPY2gDS19kAz9TWAMfMzgDGy80A6u/xAOnu8ADk6esAoqaoALO3uQCorK4Ap6utANHV1wDCxsgAYWNkANne4QDY3eAA8fb5APD1+ADv9PcA7vP2AO3y9QDk6ewA4+jrAOLn6gDg5egA3eLlAHZ5ewCJjI4AhomLAJeanACTlpgAkZSWAJCTlQCPkpQAjZCSAIyPkQCLjpAAsLO1AK6xswCrrrAAoqWnAJ+ipACdoKIAnJ+hAL/DxgC+wsUA1NjbAM7S1QDN0dQAys7RAMnN0ADs8PMA4ubpAN7i5QDb3+IAbW9xALq9wACsr7IAfH6AAHl7fQCJi40AhIaIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALgcHBwcHBwcHBwcHBwcHHDU+AgICAgICAgICAgICES41AQEAAEIAAAAAAAAVAgIuNQENOiRGMj4fABQ0Rj4CLjUBRUY9JhdGBD1GMT4kAi41AR85GBobSUZGRkc8QwIuNQEAHkY0ODYzMkgWNygCLjUBACAnJAswTEYxTDsAAi41AQAAACQtMAhGKwM0HwIuNQENRkAnRkESSgwGSyACLjUBRQQUREYJKUYxRiogAi41AQAAHSNESzxFRg8nHwIuNQEfGUYvRkZGRkZGRg4CLjUBARAeACEsPxMKJSIBAi41AgEBAQEBAQEBAQEBAT4uGxsbGxsbGxsbGxsbGxsbBQAAAAoAAGxpAABUeQAAAAAAAEltAAAAAAAAYm8AAGRzAABqYwAAAAEAAAAAAABSYwAAAAAAAAAAAAAAAAAAABQ=">
        </button>

        <article id="yomikata-get" class="content text-center"></article>
    </div>`,
    style: `
        <style>
            #yomikata-wrap {
                position: absolute;
                z-index: 2147483647;
            }

            #yomikata-wrap button {
                position: fixed;
                display: none;
                padding: 0px;
                border: 0px;
                background-color: unset;
            }

            #yomikata-wrap button img {
                width: 20px;
            }

            #yomikata-get {
                position: fixed;
                display: none;
                text-align: center;
                border-radius: 10px 20px;
                background-color: #71777d;
                color: #FFFFFF;
                width: 320px;
                height: auto;
            }

            #yomikata-get h1 {
                font-weight: normal;
                font-size: 2rem;
                margin: 20px 0;
            }

            #yomikata-get h1 span {
                font-weight: bolder;
            }

            #yomikata-get .table {
                margin: auto;
                width: auto;
                min-width: 320px;
            }

            #yomikata-get .table td, .table th {
                padding: 12px 8px;
            }
        </style>`,
}

var _global = {
    yomikata: null
    ,head: null
    ,body: null
    ,yomikataBtn: null
    ,yomikataTitle: null
    ,transRes: null
    ,selectText: null
    ,popupDelay: null
    ,newText: false
}

var document = unsafeWindow.document;

$(unsafeWindow.document).ready(function _main() {
    initScript();

    _global.yomikataBtn.on("click", function(e) {
        if (_global.newText) {
            calcPosition(e.clientX, e.clientY);

            if (CONST.kanjiTrans) kanjiTrans(() => fillYomikata(_global.transRes))
            else fillYomikata(_global.selectText);
        }
        _global.newText = false;
    })
    
    $(document).on("selectionchange", function(e) {
        var selection = document.getSelection();
        var changeTarget = document.getSelection().baseNode;
        _global.selectText = selection.toString().trim();
        
        if (!_global.selectText) {
            _global.yomikataBtn.css("display", "none");
        }
    }) 

    $(document).on("click", function(e) {
        if (!$(e.target).parents("#yomikata-wrap").length) {
            _global.yomikata.css("display", "none");
            if (_global.selectText){
                _global.newText = true;
                _global.yomikataBtn.css({top: `${e.clientY + 5}px`, left: `${e.clientX}px`, display: "block"});
            }
        }
    })
})

function initScript() {
    _global.head = $(document).find("head");
    _global.body = $(document).find("body");

    $("head").append(CONST.style);
    $("body").append(CONST.html);

    _global.yomikata = $(document).find("#yomikata-get");
    _global.yomikataBtn = $(document).find("#yomikata-wrap button")
    _global.yomikataTitle = $(document).find("#yomikata-get strong");
}

function fillYomikata(kanji) {
    GM_xmlhttpRequest({
        method: "get",
        url: `https://yomikatawa.com/kanji/${kanji}`,
        onload: (resp) => {
            if (resp.status == 200) {
                var dom = new DOMParser().parseFromString(resp.response, "text/html");
                var article = $(dom).find("body > main > article");

                _global.yomikata.empty();
                _global.yomikata.append(article.find("h1")).append(article.find("#yomikata"));
            } else {
                _global.yomikata.empty();
                _global.yomikata.append(CONST.errorTitle);
            }

            _global.yomikata.css("display", "block");
            _global.yomikataBtn.css("display", "none");
        }
    })
}

function kanjiTrans(callback) {
    // 本来是想做的，思路也有着，但就是有点担心被站主真实。
    // 虽说用yomikatawa也有被真实的风险，但好在该站站主远在异国，与国内的网站相比，还是用国外的安心些....
    // 找到符合要求的api后会加上这功能的，有推荐的可以告诉我。

    // 10/26/4:48
    // 还是加上了，被真实就真实吧，想用得爽点...

    GM_xmlhttpRequest({
        method: "post",
        url: `https://www.ezlang.net/ajax/tool_data.php`,
        data: `txt=${encodeURI(_global.selectText)}&lang=cn&sn=kanji`,
        // 这三项属于必填的
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "X-Requested-With": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
        },
        onload: (resp) => {
            if (resp.status == 200) {
                // replace(/[\x00-\x7F]/g, "");
                _global.transRes = JSON.parse(resp.response)[1].replace(/[\x00-\x7F]/g, "")

                console.log(_global.transRes);
                callback();
            } else {
                console.log("汉字转换失败！")
            }

        }
    })
}

function calcPosition(paramX, paramY) {
    var x = paramX;
    var y = paramY;

    if ($(document).height() - y > 150) {
        _global.yomikata.css({top: `${y+5}px`, bottom: `unset`});
    } else {
        _global.yomikata.css({top: `unset`, bottom: `${$(document).height() - y + 5}px`})
    }

    if ($(document).width() - x > 315) {
        _global.yomikata.css({left: `${x+5}px`, right: "unset"});
    } else {
        _global.yomikata.css({left: `unset`, right: `5px`})
    }
}