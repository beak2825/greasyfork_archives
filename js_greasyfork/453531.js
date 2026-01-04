// ==UserScript==
// @name         IC全能王插件
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  增强，为IC全能王中搜索的型号添加其他平台的快捷链接
// @author       Rhythm-2019
// @match        http://beta.ic361.cn/q/xq2.aspx
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://unpkg.com/@popperjs/core@2
// @require      https://unpkg.com/tippy.js@6
// @require      https://cdnjs.cloudflare.com/ajax/libs/dot/1.1.3/doT.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/453531/IC%E5%85%A8%E8%83%BD%E7%8E%8B%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/453531/IC%E5%85%A8%E8%83%BD%E7%8E%8B%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

function GM_addStyle(url) {
    let script = document.createElement('link');
    script.setAttribute('rel', 'stylesheet');
    script.setAttribute('type', 'text/css');
    script.href = url
    document.documentElement.appendChild(script);
}

GM_addStyle('https://unpkg.com/tippy.js@6/themes/light.css');

const SHOW_TIPS_XPATH = "//div[@id='dvInstockQ']/div[1]/div[1]/div[1]/div[2]/div[1]/div/div[2]/div[4]/div[2]"
const DEFAULT_OBSERVER_CONFIG = { attributes: true, childList: true, subtree: true }

const DATASHEET_LINK = "https://www.datasheetcatalog.com/datasheets_pdf/T/L/V/6/{0}.shtml"
const WEBSITE_LINKS = [
    {name: '华强网', urlTempl: 'https://s.hqew.com/{0}.html'},
    {name: 'IC交易网', urlTempl: 'https://www.ic.net.cn/searchNic/{0}.html'},
    {name: '正能量', urlTempl: 'https://www.bom.ai/ic/{0}.html'},
    {name: '云汉', urlTempl: 'https://search.ickey.cn/?keyword={0}'},
    {name: '立创', urlTempl: 'https://so.szlcsc.com/global.html?k={0}'},
    {name: '贸泽', urlTempl: 'https://www.mouser.cn/c/?q={0}'},
    {name: 'Digikey', urlTempl: 'https://www.digikey.com/en/products/result?keywords={0}'},
    {name: '淘宝', urlTempl: 'https://s.taobao.com/search?q={0}'},
]

const TIPS_HTML_TEMPL = `
<div style="font-size: 10px;">
    <div>
        <p>常用</p>
        <span style="cursor: pointer; color: blue; margin: 10px;" class="clipboard" data-clipboard-text={{=it.identify}}>拷贝型号</span>
        <span style="cursor: pointer; color: blue; margin: 10px;" onclick="window.open('{{=it.datasheetUrl}}', '_blank', 'noreferrer');">Datasheet</span>
    </div>
    <div>
    <p>导航</p>
        <ul style="list-style:"> 
            {{~ it.websiteUrls:item:index }}
            <li style="display: inline; none; margin: 10px">
                <span style="cursor: pointer; color: blue;" onclick="window.open('{{= item.websiteUrl}}', '_blank', 'noreferrer');">{{= item.name}}</span>
            </li> 
            {{~ }}
        </ul>
    </div>
</div>
`

var tipsTempFn = doT.template(TIPS_HTML_TEMPL)

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;
}
function execIfDomReady(xpath, callback, locateMode='xpath') {
    var numAttempts = 0;
    var tryNow = function () {
        var elem = getElementByXpath(xpath)
        if (elem) {
            callback(elem);
        } else {
            numAttempts++;
            if (numAttempts >= 34) {
                console.warn('Giving up after 34 attempts. Could not find: ' + xpath);
            } else {
                setTimeout(tryNow, 250 * Math.pow(1.1, numAttempts));
            }
        }
    };
    tryNow();
}

(function () {

    function normalizeIdentify(identify) {
        let invaildCharacters = ['+', '(', ')', '|', '/', '\\']

        let end = identify.length
        for (let c of invaildCharacters) {
            let i = identify.indexOf(c)
            if (i != -1 && i < end) {
                end = i
            }
        }
        return identify.substring(0, end)
    }

    function addTooltips(tdElem, trElem) {
            
        let identify = tdElem.firstChild.firstChild.getAttribute('data-pn')
        GM_log('add tippy to ' + id)

        // 链接处理
        let websiteUrls = WEBSITE_LINKS.map((item) => { 
            const {name, urlTempl} = item
            return {name, websiteUrl: String.format(urlTempl, normalizeIdentify(identify))}
         })
        let datasheetUrl = String.format(DATASHEET_LINK, normalizeIdentify(identify))
        
        tippy(tdElem, {
            theme: 'light',
            content: tipsTempFn({identify, websiteUrls, datasheetUrl}),
            interactive: true,
            allowHTML: true,
        });

        new ClipboardJS('.clipboard');
    }


    function mutationHandleFunc(mutationRecords, observer) {
        for (const mutationRecord of mutationRecords) {

            if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length != 0) {
                let tableElem = mutationRecord.addedNodes[0]
                // 由于添加浮动提示框也会触发这里的突发事件，所以这里进行了判断
                if (tableElem.tagName != 'TABLE') {
                    continue
                }
                for (let trElem of tableElem.firstChild.children) {
                    let trClassName = trElem.getAttribute('class')
                    if (trClassName == null || !trClassName.includes('mini-grid-row')) {
                        continue
                    }

                    for (let tdElem of trElem.children) {
                        if (tdElem.length == 0) {
                            continue
                        }
                        if (tdElem.firstChild != null && tdElem.firstChild.firstChild != null && isElement(tdElem.firstChild.firstChild)
                            && tdElem.firstChild.firstChild.getAttribute('data-pn') != null) {

                            // 添加连接提示
                            addTooltips(tdElem, trElem)
        
                            break
                        }
                    }
                }
            }
        }
    }

    GM_log("Running ic361 script...")

    execIfDomReady(SHOW_TIPS_XPATH, (elem) => {
        GM_log('create obserer to content div')
        const observer = new MutationObserver(mutationHandleFunc);
        observer.observe(elem, DEFAULT_OBSERVER_CONFIG);
    })
})();