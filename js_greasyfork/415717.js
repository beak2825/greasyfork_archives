// ==UserScript==
// @name         WhereIsMyForm
// @namespace    https://github.com/ForkFG
// @version      0.5.1
// @description  管理你的表单，不让他们走丢。
// @author       ForkKILLET
// @match        *://*/*
// @noframes
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/415717/WhereIsMyForm.user.js
// @updateURL https://update.greasyfork.org/scripts/415717/WhereIsMyForm.meta.js
// ==/UserScript==

// :: dev

const $ = this.$ // Debug: Hack eslint warnings in TM editor.
const debug = false
function expose(o) {
    if (debug) for (let i in o) unsafeWindow[i] = o[i]
}
function Throw(msg, detail) {
    msg = `[WIMF] ${msg}`
    arguments.length === 2
        ? console.error(msg + "\n%o", detail)
        : console.error(msg)
}

// :: ext

String.prototype.initialCase = function() {
    return this[0].toUpperCase() + this.slice(1)
}

Math.random.token = n => Math.random().toString(36).slice(- n)

location.here = (location.origin + location.pathname).replace("_", "%5F")

function setImmediateInterval(f, t) {
    f()
    return setInterval(f, t)
}

$.fn.extend({
    path() {
        // Note: Too strict. We need a smarter path.
        //       It doesn't work on dynamic pages sometimes.
        return (function _path(e, p = "", f = true) {
            if (! e) return p
            const $e = $(e), t = e.tagName.toLowerCase()
            let pn = t
            if (e.id) pn += `#${ e.id }`
            if (e.name) pn += `[name=${ e.name }]`
            if (! e.id && $e.parent().children(t).length > 1) {
                pn += `:nth-of-type(${ $e.prevAll(t).length + 1 })`
            }
           return _path(e.parentElement, pn + (f ? "" : ">" + p), false)
        })(this[0])
    },
    one(event, func) {
        return this.off(event).on(event, func)
    },
    forWhat(notCheck) {
        if (! notCheck && ! this.is("label")) return null
        let for_ = this.attr("for")
        if (for_) return $(`#${for_}`)
        for (let i of [ "prev", "next", "children" ]) {
            let $i = this[i]("input[type=radio], input[type=checkbox]")
            if ($i.length) return $i
        }
        return null
    },
    melt(type, time, a, b) {
        const v = this.css("display") === "none"
        if (type === "fadeio") type = v ? "fadein" : "fadeout"
        if (b == null) b = type === "fadein" ? "show" : ""
        if (a == null) a = type === "fadein" ? "" : "hide"
        this[b]()
        this.css("animation", `melting-${type} ${time}s`)
        time *= 1000
        setTimeout(() => this[a](), time > 100 ? time - 100 : time * 0.9)
        // Note: A bit shorter than the animation duration for avoid "flash back".
        return v
    },
    ""() {}
})

// :: dat

// Note: `dat.xxx.yyy = zzz` doesn't work. Now have to use `dat._.xxx_yyy = zzz`.
function Dat({ getter, setter, useWrapper, getW, setW, dataW }) {
    const pn = (p, n) => p ? p + "_" + n : n
    function dat(opt, src = dat, p) {
        const R = src === dat, r = new Proxy(src, useWrapper
            ? {
                get: (_t, k) => {
                    if (k === "_" && R) return _
                    return _[pn(p, k)]
                },
                set: (_t, k, v) => {
                    if (k === "_" && R) Throw("[Dat] Set _.")
                    _[pn(p, k)] = v
                }
            }
            : {
                get: (_t, k) => getter(pn(p, k), k),
                set: (_t, k, v) => setter(pn(p, k), k, v)
            }
        )
        for (let n in opt) {
            if (typeof opt[n] === "object" && ! Array.isArray(opt[n])) {
                if (r[n] === undefined) r[n] = {}
                src[n] = dat(opt[n], src[n], pn(p, n))
            }
            else if (r[n] === undefined) r[n] = opt[n]
        }
        return r
    }

    function parse(path, src = dat) {
        const keys = path.split("_"), len = keys.length
        function _parse(idx, now) {
            let k = keys[idx]
            if (len - idx <= 1) return [ now, k ]
            if (now == null) Throw("[Dat]: Saw undefined when _.")
            return _parse(idx + 1, now[k])
        }
        return _parse(0, src)
    }

    const _ = useWrapper ? new Proxy({}, {
        get: (_, p) => {
            const r = parse(p, getW())
            return r[0][r[1]]
        },
        set: (_, p, v) => {
            const d = getW(), r = parse(p, d)
            r[0][r[1]] = v
            setW(dataW ? dataW(d) : d)
        }
    }) : null

    return dat
}

const ts = Dat({
    useWrapper: true,
    getW: () => GM_getValue("app") ?? {},
    setW: v => GM_setValue("app", v)
})({
    window: {
        state: "open",
        top: 0,
        right: 0,
    },
    key: {
        leader: "Alt-w",
        shortcut: {
            toggle: "&q",
            mark: "&m",
            fill: "&f",
            list: "&l",
            conf: "&c",
            info: "&i"
        }
    },
    operation: {}
})._
const ls = Dat({
    useWrapper: true,
    getW: () => JSON.parse(unsafeWindow.localStorage.getItem("WIMF") ?? "{}"),
    setW: v => unsafeWindow.localStorage.setItem("WIMF", v),
    dataW: v => JSON.stringify(v)
})({})._
const op = Dat({
    getter: (_, n) => {
        if (n === "all") return ts.operation
        if (n === "here") n = location.here
        return ts["operation_" + n] ?? []
    },
    setter: (_, n, v) => {
        if (n === "here") n = location.here
        ts["operation_" + n] = v
    }
})({})

// :: fun

function scan({ hl, root } = {
    root: "body"
}) {
    const o = op.here

    const $r = $(root), rule = [
        { type: "text", evt: "change", sel: `input[type=text], input:not([type]), textarea` },
        { type: "radio", evt: "click", sel: `input[type=radio]` },
        { type: "checkbox", evt: "click", sel: `input[type=checkbox]` }
    ], A$ = []

    function work(type) {
        return function (_, { p, l } = {}) {
            const $_ = $(this), path = p || $_.path(),
                  d = { path, label: l, type }
            let f = true

            switch (type) {
                case "text":
                    const val = $_.val()
                    for (let i in o) {
                        if (o[i].type === type && o[i].path === path) {
                            o[i].val = val
                            f = false; break
                        }
                    }
                    break
                case "radio":
                    for (let i in o) {
                        if (o[i].type === type) {
                            if (o[i].path === path){
                                f = false; break
                            }
                            // Note: Replace the old choice.
                            if ($(o[i].path).attr("name") === $_.attr("name")) {
                                o[i].path = path
                                f = false; break
                            }
                        }
                    }
                    break
                case "checkbox":
                    for (let i in o) {
                        if (o[i].type === type && o[i].path === path){
                            f = false; break
                        }
                    }
                    break
            }

            if (f) o.push(d)
            op.here = o
        }
    }

    for (let [ i, r ] of Object.entries(rule))
        (A$[i] = $r.find(r.sel)).one(`${ r.evt }.WIMF work.WIMF`, work(r.type))

    $r.find("label").one("click.WIMF", function() {
        const $_ = $(this), l = $_.path(),
              $o = $_.forWhat(true)
        if (! $o.is("input, textarea")) return
        const p = $o.path()
        $o.trigger("work.WIMF", [ { p, l } ])
    })

    if (typeof hl === "function") A$.forEach($i => hl($i))

    return [ A$, A$.reduce((a, v) => a + v.length, 0) ]
}

function shortcut() {
    let t_pk
    const pk = []
    pk.last = () => pk[pk.length - 1]

    const $w = $(unsafeWindow), $r = $(".WIMF"),
          sc = ts.key_shortcut, lk = ts.key_leader,
          sc_rm = () => {
              for (let i in sc) sc[i].m = 0
          },
          ct = () => {
              clearTimeout(t_pk)
              pk.splice(0)
              pk.sdk = false
              t_pk = null
              sc_rm()
          },
          st = () => {
              clearTimeout(t_pk)
              t_pk = setTimeout(ct, 800)
          }

    for (let i in sc) sc[i] = sc[i].split("&").map(i => i === "" ? lk : i)
    const c_k = {
        toggle() {
            ts.window_state = $(".WIMF").melt("fadeio", 1.5) ? "open" : "close"
        },
        mark: UI.action.mark,
        fill: UI.action.fill,
        list: UI.action.list,
        conf: UI.action.conf,
        info: UI.action.info
    }

    ct()
    $w.one("keydown.WIMF", e => {
        st(); let ck = "", sdk = false
        for (let dk of [ "alt", "ctrl", "shift", "meta" ]) {
            if (e[dk + "Key"]) {
                ck += dk = dk.initialCase()
                if (e.key === dk || e.key === "Control") {
                    sdk = true; break
                }
                ck += "-"
            }
        }
        if (! sdk) ck += e.key.toLowerCase()

        if (pk.sdk && ck.includes(pk.last())) {
            pk.pop()
        }
        pk.sdk = sdk
        pk.push(ck)

        for (let i in sc) {
            const k = sc[i]
            if (k.m === k.length) continue
            if (k[k.m] === ck) {
                if (++k.m === k.length) {
                    if (i !== "leader") ct()
                    if (c_k[i]) c_k[i]()
                }
            }
            else if (pk.sdk && k[k.m].includes(ck)) ;
            else k.m = 0
        }
    })
}

const UI = {}
UI.meta = {
    author: GM_info.script.author,
    slogan: GM_info.script.description,

    title: t => `<b class="WIMF-title">${t}</b>`,
    link: u => `<a href="${u}">${u}</a>`,
    badge: t => `<span class="WIMF-badge">${t}</span>`,
    button: (name, emoji) => `<button class="WIMF-button" name="${name}">${emoji}</button>`,
    buttonLittle: (name, emoji) => `<button class="WIMF-button little" name="${name}">${emoji}</button>`,

    html: `
<div class="WIMF">
    <div class="WIMF-main">
        <b class="WIMF-title">WhereIsMyForm</b>
        #{button | mark 标记 | 🔍}
        #{button | fill 填充 | 📃}
        #{button | list 清单 | 📚}
        #{button | conf 设置 | ⚙️}
        #{button | info 关于 | ℹ️}
        #{button | quit 退出 | ❌}
    </div>
    <div class="WIMF-text"></div>
    <div class="WIMF-msg"></div>
</div>
`,
    aboutCompetition: `
华东师大二附中“创意·创新·创造”大赛 <br/>
<i>--【数据删除】</i>
`,
    info: `
#{title | Infomation} <br/>
<p>
    #{slogan} <br/>
    <i>-- #{author}</i>
    <br/> <br/>

    可用的测试页面：
    问卷星：#{link | https://www.wjx.cn/newsurveys.aspx}
</p>
`,
    confInput: (zone, name, hint) => `
${ name.replace(/^[a-z]+_/, "").initialCase() } ${hint}
<input type="text" name="${zone}_${name}"/>
`,
    confApply: (zone) => `<button data-zone="${zone}">OK</button>`,
    conf: `
#{title | Configuration} <br/>
<b>Key 按键</b> <br/>
#{confInput | key | leader          | 引导}
#{confInput | key | shortcut_toggle | 开关浮窗}
#{confInput | key | shortcut_mark   | 标记}
#{confInput | key | shortcut_fill   | 填充}
#{confInput | key | shortcut_list   | 清单}
#{confInput | key | shortcut_conf   | 设置}
#{confInput | key | shortcut_info   | 关于}
#{confApply | key}
`,
    listZone: (name, hint) => `
<b>${ name.initialCase() } ${hint}</b>
<ul data-name="${name}"></ul>
`,
    list: `
#{title | List}
#{button | dela | 🗑️}
#{button | impt | ⬆️}
<input type="file" value="form" accept=".json"/>
<br/>
#{listZone | here   | 本页}
#{listZone | origin | 同源}
#{listZone | else   | 其它}
`,
    styl: `
/* :: animation */

@keyframes melting-sudden {
    0%, 70% { opacity: 1; }
    100% { opacity: 0; }
}
@keyframes melting-fadeout {
    0% { opacity: 1; }
    100% { opacity: 0; }
}
@keyframes melting-fadein {
    0% { opacity: 0; }
    100% { opacity: 1; }
}

/* :: root */

.WIMF {
    position: fixed;
    z-index: 1919810;
    user-select: none;

    opacity: 1;
    transition: top 1s, right 1s;
    transform: scale(.9);

}
.WIMF, .WIMF * { /* Note: Disable styles from host page. */
    box-sizing: content-box;
    border: none;
    outline: none;

    word-wrap: normal;
    font-size: inherit;
    line-height: 1.4;
}

.WIMF-main, .WIMF-text, .WIMF-msg p {
    width: 100px;
    padding: 0 3px 0 4.5px;

    border-radius: 12px;
    font-size: 12px;
    background-color: #fff;
    box-shadow: 0 0 4px #aaa;
}

/* :: main */

.WIMF-main {
    position: absolute;
    top: 0;
    right: 0;
    height: 80px;
}

.WIMF-main::after { /* Note: A cover. */
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;

    content: "";
    border-radius: 12px;
    background-color: black;

    opacity: 0;
    transition: opacity .8s;
}
.WIMF-main.dragging::after {
    opacity: .5;
}

/* :: cell */

.WIMF-mark {
    background-color: #ffff81 !important;
}

.WIMF-title {
    display: block;
    text-align: center;
}

.WIMF-badge {
    margin: 3px 0 2px;
    padding: 0 4px;

    border-radius: 6px;
    background-color: #9f9;
    box-shadow: 0 0 4px #bbb;
}

.WIMF a {
    overflow-wrap: anywhere;
    color: #0aa;
    transition: color .8s;
}
.WIMF a:hover {
    color: #0af;
}

.WIMF-button {
    display: inline-block;
    width: 17px;
    height: 17px;

    padding: 2px 3px 3px 3px;
    margin: 3px;

    outline: none;
    border: none;
    border-radius: 7px;

    font-size: 12px;
    text-align: center;
    box-shadow: 0 0 3px #bbb;

    background-color: #fff;
    transition: background-color .8s;
}
.WIMF-button.little {
    transform: scale(0.9);
    margin: -1px 0;
    padding: 0 5px;
    border-radius: 3px;
}
.WIMF button:hover, .WIMF button.active {
    background-color: #bbb !important;
}
.WIMF-main > .WIMF-button:hover::before { /* Hints. */
    position: absolute;
    right: 114px;
    width: 75px;

    content: attr(name);
    padding: 0 3px;

    font-size: 14px;
    border-radius: 4px;
    background-color: #fff;
    box-shadow: 0 0 4px #aaa;
}

/* :: msg */

.WIMF-msg {
    position: absolute;
    top: 0;
    right: 115px;
}

.WIMF-msg > p {
    margin-bottom: 3px;
}

.WIMF-msg > .succeed {
    background-color: #9f9;
}
.WIMF-msg > .fail {
    background-color: #f55;
}
.WIMF-msg > .confirm {
    background-color: #0cf;
}

.WIMF-msg > .confirm > span:last-child {
    float: right;
}
.WIMF-msg > .confirm > span:last-child > span {
    color: #eee;
}
.WIMF-msg > .confirm > span:last-child > span:hover {
    color: #eee;
    text-decoration: underline;
}

/* :: text */

.WIMF-text {
    position: absolute;
    display: none;
    top: 85px;
    right: 0;
    height: 300px;

    overflow: -moz-scrollbars-none;
    overflow-y: scroll;
    -ms-overflow-style: none;
}
.WIMF-text::-webkit-scrollbar {
    display: none;
}

.WIMF-text > div {
    padding-bottom: 5px;
}
.WIMF-text input:not([type]),
.WIMF-text input[type=text], .WIMF-text input[type=file] {
    width: 95px;

    margin: 3px 0;
    padding: 1px 2px;

    border: none;
    border-radius: 3px;
    outline: none;

    box-shadow: 0 0 3px #aaa;
}

.WIMF-text input[type=file]::file-selector-button {
    display: none;
}
.WIMF-text input[type=file]::-webkit-file-upload-button {
    display: none;
}

.WIMF-text button[data-zone] {
    margin: 3px 0;
    padding: 0 5px;

    border-radius: 3px;
    box-shadow: 0 0 3px #aaa;

    background-color: #fff;
    transition: background-color .8s;
}

[data-name=list] li > div {
    display: none;
}
[data-name=list] li:hover > div {
    display: inline-block;
}
`
}
UI.M = new Proxy(s =>
    s.replace(/#{(.*?)}/g, (_, s) => {
        const [ k, ...a ] = s.split(/ *\| */), m = UI.meta[k]
        if (a.length && typeof m === "function") return m(...a)
        return m
    }), { get: (t, n) => t(UI.meta[n]) }
)

UI.$btn = (n, p) => (p ? p.children : $).call(p, `.WIMF-button[name^=${n}]`)
UI.action = {
    mark() {
        const $b = UI.$btn("mark")
        if ($b.is(".active")) {
            $(".WIMF-mark").removeClass("WIMF-mark")
            UI.msg([ "表单高亮已取消。", "Form highlight is canceled." ])
        }
        else {
            scan({
                root: "body",
                hl: $i => $i.addClass("WIMF-mark")
            })
            UI.msg([ "表单已高亮。", "Forms are highlighted." ])
        }
        $b.toggleClass("active")
    },
    fill() {
        let c = 0, c_e = 0; for (let o of op.here) {
            const $i = $(o.path)
            if (! $i.length) {
                c_e++
                continue
            }
            switch (o.type) {
                case "text":
                    $i.val(o.val)
                    break
                case "radio":
                case "checkbox":
                    // Hack: HTMLElement:.click is stabler than $.click sometimes.
                    //       If user clicks <label> instead of <input>, we also do that.
                    if (o.label) $(o.label)[0].click()
                    else $i[0].click()
                    break
                default:
                    UI.msg([ `未知表单项类型 "${o.type}"。`, `Unknown form field type "${o.type}".` ],
                           { type: "fail" })
            }
            c++
        }
        if (c_e) UI.msg([ `有 ${c_e} 个表单项无法定位。`, `${c_e} form field(s) is unable to be located.` ],
                        { type: "fail" })
        UI.msg([ `已填充 ${c} 个表单项。`, `${c} form field(s) is filled.` ])
    },
    list() {
        UI.text.show("list")

        const o = op.all, z$ = {}, $t = UI.$text()
        for (let i of [ "here", "origin", "else" ])
            z$[i] = $t.children(`ul[data-name="${i}"]`).html("")
        function checkEmpty() {
            for (let $i of Object.values(z$)) if (! $i.children().length) $i.html("-")
        }

        let $i; for (let i in o) {
            const u = new URL(i), info = {
                URL: u, op: o[i], time: + new Date()
            }
            if (u.origin === location.origin)
                if (u.pathname === location.pathname) $i = z$.here;
                else $i = z$.origin
            else $i = z$.else
            const $_ = $(UI.M(`
<li>
    #{link | ${u}} <br/> #{badge | ${o[u].length}}
    <div>
        #{buttonLittle | dele | 🗑️}
        <a href="${
            URL.createObjectURL(new Blob([ JSON.stringify(info) + "\n" ], { type: "application/json" }))
        }" download="WIMF-form-${ Math.random.token(8).toUpperCase() }.json">
            #{buttonLittle | expt | ⬇️}
        </a>
    </div>
</li>
`)).appendTo($i)
            const $b = $_.children("div")

            UI.$btn("dele", $b).on("click", () => {
                delete o[$_.children("a").attr("href")]
                ts.operation = o
                scan() // Note: Update `o` in `work` closure.
                $_.remove()
                checkEmpty()
                UI.msg([ "已删除一个表单。", "The form is deleted." ])
            })
        }
        checkEmpty()

        const $f = $t.children("input[type=file]")
        UI.$btn("impt", $t).one("click", async() => {
            const file = $f[0].files[0]
            if (! file) {
                UI.msg([ "请先选择需导入的文件。", "Please choose a file to import first." ],
                       { type: "fail" })
                return
            }
            if (! file.name.endsWith(".json")) {
                UI.msg([ "文件格式应为 JSON。", "The file format should be JSON." ],
                       { type: "fail" })
                return
            }
            const info = JSON.parse(await file.text())
            op[info.URL] = info.op
            UI.action.list() // Todo: Optmize this. Too expensive.
            UI.msg([ "所上传的表单数据已导入。", "The form data you uploaded is imported." ])
        })
        UI.$btn("dela", $t).one("click", () => {
            UI.msg([ "确定要删除所有表单吗？", "Are you sure to delete all forms?" ],
                   { type: "confirm" })(y => {
                if (! y) return
                ts.operation = {}
                UI.action.list()
                UI.msg([ "表单数据已全部删除。", "All form data is deleted." ])
            })
        })
    },
    conf() {
        UI.text.show("conf")

        const $A = $(".WIMF-text button")
        for (let i = 0; i < $A.length; i++) {
            const $b = $($A[i]),
                  zone = $b.data("zone"),
                  $t = $b.prevAll(`input[type=text][name^=${zone}_]`),
                  c_b = {
                      key: shortcut
                  }

            function map(it) {
                for (let j = $t.length - 1; j >= 0; j--) {
                    const $e = $($t[j]), sp = $e.attr("name")
                    it($e, sp)
                }
            }
            map(($_, sp) => $_.val(ts[sp]))
            $b.one("click", () => {
                map(($_, sp) => { ts[sp] = $_.val() })
                if (c_b[zone]) c_b[zone]()
                UI.msg([ `设置块 ${zone} 已应用。`, `Configuration zone ${zone} is applied.` ])
            })
        }
    },
    info() {
        UI.text.show("info")
    },
    quit() {
        $(".WIMF").melt("fadeout", 1.5)
        ts.window_state = "close"
    },
    back() {
        $(".WIMF-text").hide()
        UI.$btn("back").attr("name", "quit 退出")
        UI.text.hide()
    }
}
UI.$text = (n = UI.text.active) => $(`.WIMF-text > [data-name=${n}]`)
UI.text = {
    hide: () => {
        UI.$btn(UI.text.active).removeClass("active")
        $(".WIMF-text").hide().children(`[data-name=${UI.text.active}]`).hide()
    },
    show: n => {
        UI.text.hide()
        UI.$btn(UI.text.active = n).addClass("active")
        const $t = $(".WIMF-text").show(), $p = $t.children(`[data-name=${n}]`)
        if ($p.length) $p.show()
        else $t.append(`<div data-name="${n}">${UI.M[n]}</div>`)
        UI.$btn("quit").attr("name", "back 返回")
    }
}
UI.msg = (m, { type, alive } = { type: "succeed" }) => {
    // Todo: English, `m[1]`.
    const $m = $(`<p class="${type}">${ m[0] }</p>`).prependTo($(".WIMF-msg"))
    if (type === "confirm") {
        const $c = $(`<span><span>Yes</span> | <span>No</span></span>`).appendTo($m)
        return f => $c.children().on("click", function() {
            f($(this).html() === "Yes")
            $m.melt("fadeout", 1, "remove")
        })
        // Note: Since it returns here, we needn't set `alive`.
    }
    if (! alive) $m.melt("sudden", 3, "remove")
}
UI.move = (t, r) => {
    if (t != null) ts.window_top = Math.max(t, 0)
    if (r != null) ts.window_right = Math.max(r, 0)
    $(".WIMF").css("top", ts.window_top + "px").css("right", ts.window_right + "px")
}
UI.init = () => {
    GM_addStyle(UI.M.styl)
    $("body").after(UI.M.html)

    const $r = $(".WIMF"), $m = $(".WIMF-main"), $w = $(unsafeWindow)
    if (ts.window_state === "close") $r.hide()
    UI.move()

    $(".WIMF-button").on("click", function() {
         UI.action[$(this).attr("name").split(" ")[0]]()
    })

    $m.on("mousedown", e => {
        const { clientX: x0, clientY: y0 } = e

        $w.on("mouseup", finish)

        let c = false
        const t_f = setTimeout(finish, 1800),
              t_c = setTimeout(() => {
            c = true
            $m.addClass("dragging")
        }, 200) // Note: Differentiate from clickings.

        function finish(f) {
            clearTimeout(t_f); clearTimeout(t_c)
            if (c && f) {
                const { clientX: x1, clientY: y1 } = f,
                      dx = x1 - x0, dy = y1 - y0
                UI.move(ts.window_top + dy, ts.window_right - dx)
            }
            if (c) $m.removeClass("dragging").off("mousemove")
            $w.off("mouseup")
        }
    })
}

$(function init() {
    UI.init()

    shortcut()

    let a; const t_s = setImmediateInterval(() => {
        let [ ,b ] = scan()
        if (b > 0 && b === a) clearInterval(t_s)
        a = b
    }, 1000)
    setTimeout(() => clearInterval(t_s), 10 * 1000)
    // Note: Some pages' `onload` goes before really loading (by frames).
})

expose({ ts, op, UI })

