// ==UserScript==
// @name         SegmentFault Automatic Reviewing | 思否自动审核
// @namespace    https://segmentfault.com/u/forkkillet
// @version      0.1
// @description  再也不用为某些用户每天无意义重复发文而苦恼了。
// @author       ForkKILLET
// @match        https://segmentfault.com/review/article_first
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/421526/SegmentFault%20Automatic%20Reviewing%20%7C%20%E6%80%9D%E5%90%A6%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/421526/SegmentFault%20Automatic%20Reviewing%20%7C%20%E6%80%9D%E5%90%A6%E8%87%AA%E5%8A%A8%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

Array.range = (start, end) => Array.from({ length: end - start + 1 }, (_, i) => i + start)

const debug = true
const log = m => console.log("[SFAR] " + m)
const error = m => console.error("[SFAR] " + m)

const $ = unsafeWindow.$
$(render)

function render() {
    if ($(".audit__content > div").length === 2)
        return debug && log("nothing to review.")

    const $ui = $(`
<style>
.SFAR-ui * {
    outline: none !important;
}
.SFAR-ui .glyphicon {
    margin: 0 !important;
}
.SFAR-highlight {
    background-color: #bce8f1 !important;
}
.SFAR-config {
    display: block;
    width: 100%;
    min-height: 400px;
}
.SFAR-save {
    width: 54px;
}
.SFAR-result {
    display: none;
    margin: 0;
}
</style>
<div class="SFAR-ui panel panel-default">
    <div class="panel-heading">
        <h5 class="mb0 mt0">[SFAR] 自动审核</h5>
    </div>
    <div class="panel-content">
        <textarea class="SFAR-config"/>
    </div>
    <div class="panel-footer">
        <button class="SFAR-save btn btn-default">保存</button>
        <button class="SFAR-execute btn btn-primary">执行</button>
    </div>
    <div class="SFAR-result alert alert-info"></div>
</div>
    `)
    $(".audit-widget__reason").after($ui)
    const
        $config = $(".SFAR-config"),
        $save = $(".SFAR-save"),
        $execute = $(".SFAR-execute"),
        configDft = `
{
    "rules": [
        {
            "title-equal": "人生苦短，开发用云-如何优雅完成程序员的侠客梦",
            "result": "reject",
            "why": "推广广告信息"
        },
        {
            "title-equal": "天源迪科与阿里云发布联合解决方案，基于阿里云原生产品打造卓越的数字化采购平台",
            "result": "reject",
            "why": "推广广告信息"
        },
        {
            "title-equal": "如何优化你的if-else？来试试“责任树模式”",
            "result": "reject",
            "why": "推广广告信息"
        }
    ],
    "auto": {
        "execute": true,
        "confirm": true,
        "next": false
    }
}
        `.trim()
    let configNow = GM_getValue("config")
    configNow || GM_setValue("config", configNow = configDft)
    $config.val(configNow)
    $save.on("click", () => {
        GM_setValue("config", $config.val().trim())
        $save.html(`<span class="glyphicon glyphicon-check text-green mr10"></span>`)
        setTimeout(() => $save.html("保存"), 1000)
        debug && log("saved.")
    })
    $execute.on("click", execute)
    const config = JSON.parse(configNow)
    if (config.auto && config.auto.execute) execute(config)
}

function execute(config) {
    config = config || JSON.parse(GM_getValue("config"))
    if (! config || ! config.rules) return
    const
        $form = $(".panel-content--form"),
        $author = $(".panel-content--inner > .audit__content-author .media-body"),
        article = {
            title: $form.find("input.form-control[name=title]").val(),
            text: $form.find("textarea.form-control[name=text]").val(),
            author: $author.children("a").text()
        },
        results = [ [ "反对", "reject" ], [ "同意", "pass", "accept" ], [ "中立", "ignore", "monkey" ] ],
        whys = [ "帖子式文章", "偏离社区主题", "内容及排版差", "推广广告信息", "违规内容", "不友善内容" ]
    debug && log(`\n# ${ article.title }\n${ article.text.slice(0, 42) }...`)
    let id = 0, r, y, finish = false
    for (let rule of config.rules) {
        [ "include", "match", "equal" ].forEach(how => {
            [ "title", "text" ].forEach(where => {
                const what = rule[where + "-" + how], content = article[where]
                if (! what) return
                if (
                    how === "include" && content.includes(what) ||
                    how === "match" && RegExp(what).test(content) ||
                    how === "equal" && what === content
                ) {
                    r = rule.result
                    if (typeof r === "string") results.forEach((group, index) => {
                        if (group.includes(r)) r = index
                    })
                    if (! Array.range(0, 3).includes(r))
                        return error(`result ${r} isn't in [0, 2].`)
                    debug && log(`result code is ${r}.`)
                    if (r === 0) {
                        y = rule.why
                        if (typeof y === "string") y = whys.indexOf(y)
                        if (! Array.range(0, 6).includes(y))
                        return error(`why ${r} isn't in [0, 6].`)
                        debug && log(`reason code is ${y}.`)
                        finish = true
                    }
                }
            })
        })
        id ++
        if (finish) break
    }

    const
        auto = config.auto || {},
        $alert = $(".SFAR-result").show().html(finish ? `
<p>
根据规则 ${id}#，态度为${ results[r][0] }${ r ? "" : `，原因为${ whys[y] }` }
${ auto.confirm ? `<a class="SFAR-result-ok">好</a> / <a class="SFAR-result-cancel">取消</a>` : "" }
</p>
        ` : `无规则匹配。`)
    if (! finish) return

    const
        $result = $(".js__audit-btn--" + results[r][1]).addClass("SFAR-highlight"),
        $why = $($(".audit__reasons-item:not(.audit__reasons-item--sub)")[y]).addClass("SFAR-highlight")
    function act() {
        $why.click()
        $result.click()
        if (auto.next) $(".audit-widget__vote-btn-next--inner").click()
    }
    setTimeout(() => {
        $(".audit__reasons-item--sub").click()
        if (auto.confirm) {
            $(".SFAR-result-ok").on("click", act)
            $(".SFAR-result-cancel").on("click", () => $alert.hide())
        }
        else act()
    }, 500)
}

