// ==UserScript==
// @name        AtCoder Easy Test v2
// @namespace   https://atcoder.jp/
// @version     2.15.1
// @description Make testing sample cases easy
// @author      magurofly
// @license     MIT
// @supportURL  https://github.com/magurofly/atcoder-easy-test/
// @match       https://atcoder.jp/contests/*/tasks/*
// @match       https://atcoder.jp/contests/*/submit*
// @match       https://yukicoder.me/problems/no/*
// @match       https://yukicoder.me/problems/*
// @match       http://codeforces.com/contest/*/problem/*
// @match       http://codeforces.com/gym/*/problem/*
// @match       http://codeforces.com/problemset/problem/*
// @match       http://codeforces.com/group/*/contest/*/problem/*
// @match       http://*.contest.codeforces.com/group/*/contest/*/problem/*
// @match       https://codeforces.com/contest/*/problem/*
// @match       https://codeforces.com/gym/*/problem/*
// @match       https://codeforces.com/problemset/problem/*
// @match       https://codeforces.com/group/*/contest/*/problem/*
// @match       https://*.contest.codeforces.com/group/*/contest/*/problem/*
// @match       https://m1.codeforces.com/contest/*/problem/*
// @match       https://m2.codeforces.com/contest/*/problem/*
// @match       https://m3.codeforces.com/contest/*/problem/*
// @match       https://greasyfork.org/*/scripts/433152-atcoder-easy-test-v2
// @grant       unsafeWindow
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/433152/AtCoder%20Easy%20Test%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/433152/AtCoder%20Easy%20Test%20v2.meta.js
// ==/UserScript==
(function() {

    if (typeof GM_getValue !== "function") {
        if (typeof GM === "object" && typeof GM.getValue === "function") {
            GM_getValue = GM.getValue;
            GM_setValue = GM.setValeu;
        } else {
            const storage = JSON.parse(localStorage.AtCoderEasyTest || "{}");
            GM_getValue = (key, defaultValue = null) => ((key in storage) ? storage[key] : defaultValue);
            GM_setValue = (key, value) => {
                storage[key] = value;
                localStorage.AtCoderEasyTest = JSON.stringify(storage);
            };
        }
    }

    if (typeof unsafeWindow !== "object") unsafeWindow = window;
function buildParams(data) {
    return Object.entries(data).map(([key, value]) => encodeURIComponent(key) + "=" + encodeURIComponent(value)).join("&");
}
function sleep(ms) {
    return new Promise(done => setTimeout(done, ms));
}
function doneOrFail(p) {
    return p.then(() => Promise.resolve(), () => Promise.resolve());
}
function html2element(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
}
function newElement(tagName, attrs = {}, children = []) {
    const e = document.createElement(tagName);
    for (const [key, value] of Object.entries(attrs)) {
        if (key == "style") {
            for (const [propKey, propValue] of Object.entries(value)) {
                e.style[propKey] = propValue;
            }
        }
        else {
            e[key] = value;
        }
    }
    for (const child of children) {
        e.appendChild(child);
    }
    return e;
}
function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".
        replace(/x/g, () => "0123456789abcdef"[Math.random() * 16 | 0]).
        replace(/y/g, () => "89ab"[Math.random() * 4 | 0]);
}
async function loadScript(src, ctx = null, env = {}) {
    const js = await fetch(src).then(res => res.text());
    const keys = [];
    const values = [];
    for (const [key, value] of Object.entries(env)) {
        keys.push(key);
        values.push(value);
    }
    unsafeWindow["Function"](keys.join(), js).apply(ctx, values);
}
const eventListeners = {};
const events = {
    on(name, listener) {
        const listeners = (name in eventListeners ? eventListeners[name] : eventListeners[name] = []);
        listeners.push(listener);
    },
    trig(name) {
        if (name in eventListeners) {
            for (const listener of eventListeners[name])
                listener();
        }
    },
};
class ObservableValue {
    _value;
    _listeners;
    constructor(value) {
        this._value = value;
        this._listeners = new Set();
    }
    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value;
        for (const listener of this._listeners)
            listener(value);
    }
    addListener(listener) {
        this._listeners.add(listener);
        listener(this._value);
    }
    removeListener(listener) {
        this._listeners.delete(listener);
    }
    map(f) {
        const y = new ObservableValue(f(this.value));
        this.addListener(x => {
            y.value = f(x);
        });
        return y;
    }
}

var hPage = "<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset=\"utf-8\">\n    <meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n    <title>AtCoder Easy Test</title>\n    <link href=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css\" rel=\"stylesheet\">\n  </head>\n  <body>\n    <div class=\"container\" id=\"root\">\n    </div>\n    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js\"></script>\n    <script src=\"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js\"></script>\n  </body>\n</html>";

const components = [];
const settings = {
    add(title, generator) {
        components.push({ title, generator });
    },
    open() {
        const win = window.open("about:blank");
        const doc = win.document;
        doc.open();
        doc.write(hPage);
        doc.close();
        const root = doc.getElementById("root");
        for (const { title, generator } of components) {
            const panel = newElement("div", { className: "panel panel-default" }, [
                newElement("div", { className: "panel-heading", textContent: title }),
                newElement("div", { className: "panel-body" }, [generator(win)]),
            ]);
            root.appendChild(panel);
        }
    },
};

const options = [];
let data = {};
function toString() {
    return JSON.stringify(data);
}
function save() {
    GM_setValue("config", toString());
}
function load() {
    data = JSON.parse(GM_getValue("config") || "{}");
}
function reset() {
    data = {};
    save();
}
load();
// 設定ページ
settings.add("config", (win) => {
    const root = newElement("form", { className: "form-horizontal" });
    options.sort((a, b) => {
        const x = a.key.split(".");
        const y = b.key.split(".");
        return x < y ? -1 : x > y ? 1 : 0;
    });
    for (const { type, key, defaultValue, description } of options) {
        const id = uuid();
        const control = newElement("div", { className: "col-sm-3 text-center" });
        const group = newElement("div", { className: "form-group" }, [
            control,
            newElement("label", {
                className: "col-sm-3",
                htmlFor: id,
                textContent: key,
                style: {
                    fontFamily: "monospace",
                },
            }),
            newElement("label", {
                className: "col-sm-6",
                htmlFor: id,
                textContent: description,
            }),
        ]);
        root.appendChild(group);
        switch (type) {
            case "flag": {
                control.appendChild(newElement("input", {
                    id,
                    type: "checkbox",
                    checked: config.get(key, defaultValue),
                    onchange() {
                        config.set(key, this.checked);
                    },
                }));
                break;
            }
            case "count": {
                control.appendChild(newElement("input", {
                    id,
                    type: "number",
                    min: "0",
                    value: config.get(key, defaultValue),
                    onchange() {
                        config.set(key, +this.value);
                    },
                }));
                break;
            }
            case "text": {
                control.appendChild(newElement("input", {
                    id,
                    type: "text",
                    value: config.getString(key, defaultValue),
                    onchange() {
                        config.setString(key, this.value);
                    },
                }));
                break;
            }
            default:
                throw new TypeError(`AtCoderEasyTest.setting: undefined option type ${type} for ${key}`);
        }
    }
    root.appendChild(newElement("button", {
        className: "btn btn-danger",
        textContent: "Reset",
        type: "button",
        onclick() {
            if (win.confirm("Configuration data will be cleared. Are you sure?")) {
                config.reset();
            }
        },
    }));
    return root;
});
const config = {
    getString(key, defaultValue = "") {
        if (!(key in data))
            config.setString(key, defaultValue);
        return data[key];
    },
    setString(key, value) {
        data[key] = value;
        save();
    },
    has(key) {
        return key in data;
    },
    get(key, defaultValue = null) {
        if (!(key in data))
            config.set(key, defaultValue);
        return JSON.parse(data[key]);
    },
    set(key, value) {
        config.setString(key, JSON.stringify(value));
    },
    save,
    load,
    toString,
    reset,
    /** 設定項目を登録 */
    registerFlag(key, defaultValue, description) {
        options.push({
            type: "flag",
            key,
            defaultValue,
            description,
        });
    },
    registerCount(key, defaultValue, description) {
        options.push({
            type: "count",
            key,
            defaultValue,
            description,
        });
    },
    registerText(key, defaultValue, description) {
        options.push({
            type: "text",
            key,
            defaultValue,
            description,
        });
    },
};

config.registerCount("codeSaver.limit", 10, "Max number to save codes");
const codeSaver = {
    get() {
        // `json` は、ソースコード文字列またはJSON文字列
        let json = unsafeWindow.localStorage.AtCoderEasyTest$lastCode;
        let data = [];
        try {
            if (typeof json == "string") {
                data.push(...JSON.parse(json));
            }
            else {
                data = [];
            }
        }
        catch (e) {
            data.push({
                path: unsafeWindow.localStorage.AtCoderEasyTset$lastPage,
                code: json,
            });
        }
        return data;
    },
    set(data) {
        unsafeWindow.localStorage.AtCoderEasyTest$lastCode = JSON.stringify(data);
    },
    save(savePath, code) {
        let data = codeSaver.get();
        const idx = data.findIndex(({ path }) => path == savePath);
        if (idx != -1)
            data.splice(idx, idx + 1);
        data.push({
            path: savePath,
            code,
        });
        while (data.length > config.get("codeSaver.limit", 10))
            data.shift();
        codeSaver.set(data);
    },
    restore(savedPath) {
        const data = codeSaver.get();
        const idx = data.findIndex(({ path }) => path === savedPath);
        if (idx == -1 || !(data[idx] instanceof Object))
            return Promise.reject(`No saved code found for ${location.pathname}`);
        return Promise.resolve(data[idx].code);
    }
};
settings.add(`codeSaver (${location.host})`, (win) => {
    const root = newElement("table", { className: "table" }, [
        newElement("thead", {}, [
            newElement("tr", {}, [
                newElement("th", { textContent: "path" }),
                newElement("th", { textContent: "code" }),
            ]),
        ]),
        newElement("tbody"),
    ]);
    root.tBodies;
    for (const savedCode of codeSaver.get()) {
        root.tBodies[0].appendChild(newElement("tr", {}, [
            newElement("td", { textContent: savedCode.path }),
            newElement("td", {}, [
                newElement("textarea", {
                    rows: 1,
                    cols: 30,
                    textContent: savedCode.code,
                }),
            ]),
        ]));
    }
    return root;
});

function similarLangs(targetLang, candidateLangs) {
    const [targetName, targetDetail] = targetLang.split(" ", 2);
    const selectedLangs = candidateLangs.filter(candidateLang => {
        const [name, _] = candidateLang.split(" ", 2);
        return name == targetName;
    }).map(candidateLang => {
        const [_, detail] = candidateLang.split(" ", 2);
        return [candidateLang, similarity(detail, targetDetail)];
    });
    return selectedLangs.sort((a, b) => a[1] - b[1]).map(([lang, _]) => lang);
}
function similarity(s, t) {
    const n = s.length, m = t.length;
    let dp = new Array(m + 1).fill(0);
    for (let i = 0; i < n; i++) {
        const dp2 = new Array(m + 1).fill(0);
        for (let j = 0; j < m; j++) {
            const cost = (s.charCodeAt(i) - t.charCodeAt(j)) ** 2;
            dp2[j + 1] = Math.min(dp[j] + cost, dp[j + 1] + cost * 0.25, dp2[j] + cost * 0.25);
        }
        dp = dp2;
    }
    return dp[m];
}

class CodeRunner {
    get label() {
        return this._label;
    }
    constructor(label, site) {
        this._label = `${label} [${site}]`;
    }
    async test(sourceCode, input, expectedOutput, options) {
        let result = { status: "IE", input };
        try {
            result = await this.run(sourceCode, input, options);
        }
        catch (e) {
            result.error = e.toString();
            return result;
        }
        if (expectedOutput != null)
            result.expectedOutput = expectedOutput;
        if (result.status != "OK" || typeof expectedOutput != "string")
            return result;
        let output = result.output || "";
        if (options.trim) {
            expectedOutput = expectedOutput.trim();
            output = output.trim();
        }
        let equals = (x, y) => x === y;
        if (options.allowableError) {
            const floatPattern = /^[-+]?[0-9]*\.[0-9]+([eE][-+]?[0-9]+)?$/;
            const superEquals = equals;
            equals = (x, y) => {
                if (floatPattern.test(x) || floatPattern.test(y)) {
                    const a = parseFloat(x);
                    const b = parseFloat(y);
                    return Math.abs(a - b) <= Math.max(options.allowableError, Math.abs(b) * options.allowableError);
                }
                return superEquals(x, y);
            };
        }
        if (options.split) {
            const superEquals = equals;
            equals = (x, y) => {
                const xs = x.split(/\s+/);
                const ys = y.split(/\s+/);
                if (xs.length != ys.length)
                    return false;
                const len = xs.length;
                for (let i = 0; i < len; i++) {
                    if (!superEquals(xs[i], ys[i]))
                        return false;
                }
                return true;
            };
        }
        result.status = equals(output, expectedOutput) ? "AC" : "WA";
        return result;
    }
}

class CustomRunner extends CodeRunner {
    run;
    constructor(label, run) {
        super(label, "Browser");
        this.run = run;
    }
}

let waitAtCoderCustomTest = Promise.resolve();
const AtCoderCustomTestBase = location.href.replace(/\/tasks\/.+$/, "/custom_test");
const AtCoderCustomTestResultAPI = AtCoderCustomTestBase + "/json?reload=true";
const AtCoderCustomTestSubmitAPI = AtCoderCustomTestBase + "/submit/json";
const ce_groups = new Set();
class AtCoderRunner extends CodeRunner {
    languageId;
    constructor(languageId, label) {
        super(label, "AtCoder");
        this.languageId = languageId;
    }
    async run(sourceCode, input, options = {}) {
        const promise = this.submit(sourceCode, input, options);
        waitAtCoderCustomTest = promise;
        return await promise;
    }
    async submit(sourceCode, input, options = {}) {
        try {
            await waitAtCoderCustomTest;
        }
        catch (error) {
            console.error(error);
        }
        // 同じグループで CE なら実行を省略し CE を返す
        if ("runGroupId" in options && ce_groups.has(options.runGroupId)) {
            return {
                status: "CE",
                input,
            };
        }
        const error = await fetch(AtCoderCustomTestSubmitAPI, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: buildParams({
                "data.LanguageId": String(this.languageId),
                sourceCode,
                input,
                csrf_token: unsafeWindow.csrfToken,
            }),
        }).then(r => r.text());
        if (error) {
            throw new Error(error);
        }
        await sleep(100);
        for (;;) {
            const data = await fetch(AtCoderCustomTestResultAPI, {
                method: "GET",
                credentials: "include",
            }).then(r => r.json());
            if (!("Result" in data))
                continue;
            const result = data.Result;
            if ("Interval" in data) {
                await sleep(data.Interval);
                continue;
            }
            const status = (result.ExitCode == 0) ? "OK" : (result.TimeConsumption.toString().startsWith("-")) ? "CE" : "RE";
            if (status == "CE" && "runGroupId" in options) {
                ce_groups.add(options.runGroupId);
            }
            return {
                status,
                exitCode: result.ExitCode,
                execTime: parseInt(result.TimeConsumption),
                memory: parseInt(result.MemoryConsumption),
                input,
                output: data.Stdout,
                error: data.Stderr,
            };
        }
    }
}

class PaizaIORunner extends CodeRunner {
    name;
    constructor(name, label) {
        super(label, "PaizaIO");
        this.name = name;
    }
    async run(sourceCode, input, options = {}) {
        let id, status, error;
        try {
            const res = await fetch("https://api.paiza.io/runners/create?" + buildParams({
                source_code: sourceCode,
                language: this.name,
                input,
                longpoll: "true",
                longpoll_timeout: "10",
                api_key: "guest",
            }), {
                method: "POST",
                mode: "cors",
            }).then(r => r.json());
            id = res.id;
            status = res.status;
            error = res.error;
        }
        catch (error) {
            return {
                status: "IE",
                input,
                error: String(error),
            };
        }
        while (status == "running") {
            const res = await fetch("https://api.paiza.io/runners/get_status?" + buildParams({
                id,
                api_key: "guest",
            }), {
                mode: "cors",
            }).then(res => res.json());
            status = res.status;
            error = res.error;
        }
        const res = await fetch("https://api.paiza.io/runners/get_details?" + buildParams({
            id,
            api_key: "guest",
        }), {
            mode: "cors",
        }).then(r => r.json());
        const result = {
            status: "OK",
            exitCode: String(res.exit_code),
            execTime: +res.time * 1e3,
            memory: +res.memory * 1e-3,
            input,
        };
        if (res.build_result == "failure") {
            result.status = "CE";
            result.exitCode = res.build_exit_code;
            result.output = res.build_stdout;
            result.error = res.build_stderr;
        }
        else {
            result.status = (res.result == "timeout") ? "TLE" : (res.result == "failure") ? "RE" : "OK";
            result.exitCode = res.exit_code;
            result.output = res.stdout;
            result.error = res.stderr;
        }
        return result;
    }
}

async function loadPyodide() {
    const script = await fetch("https://cdn.jsdelivr.net/pyodide/v0.24.0/full/pyodide.js").then((res) => res.text());
    unsafeWindow["Function"](script)();
    const pyodide = await unsafeWindow["loadPyodide"]({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.0/full/",
    });
    await pyodide.runPythonAsync(`
import contextlib, io, platform
class __redirect_stdin(contextlib._RedirectStream):
  _stream = "stdin"
`);
    return pyodide;
}
let _pyodide = Promise.reject("Pyodide is not yet loaded");
let _serial = Promise.resolve();
const pyodideRunner = new CustomRunner("Pyodide", (sourceCode, input, options = {}) => new Promise((resolve, reject) => {
    _serial = _serial.finally(async () => {
        const pyodide = await (_pyodide = _pyodide.catch(loadPyodide));
        const code = `
def __run():
 global __stdout, __stderr, __stdin, __code
 with __redirect_stdin(io.StringIO(__stdin)):
  with contextlib.redirect_stdout(io.StringIO()) as __stdout:
   with contextlib.redirect_stderr(io.StringIO()) as __stderr:
    try:
     pass
` +
            sourceCode
                .split("\n")
                .map((line) => "     " + line)
                .join("\n") +
            `
    except SystemExit as e:
     __code = e.code
`;
        let status = "OK";
        let exitCode = "0";
        let stdout = "";
        let stderr = "";
        let startTime = -Infinity;
        let endTime = Infinity;
        pyodide.globals.set("__stdin", input);
        try {
            pyodide.globals.set("__code", null);
            await pyodide.loadPackagesFromImports(code);
            await pyodide.runPythonAsync(code);
            startTime = Date.now();
            pyodide.runPython("__run()");
            endTime = Date.now();
            stdout = pyodide.globals.get("__stdout").getvalue();
            stderr = pyodide.globals.get("__stderr").getvalue();
            const __code = pyodide.globals.get("__code");
            if (typeof __code == "number") {
                exitCode = String(__code);
                if (__code != 0)
                    status = "RE";
            }
        }
        catch (error) {
            status = "RE";
            exitCode = "-1";
            stderr += error.toString();
        }
        resolve({
            status,
            exitCode,
            execTime: endTime - startTime,
            input,
            output: stdout,
            error: stderr,
        });
    });
}));

function pairs(list) {
    const pairs = [];
    const len = list.length >> 1;
    for (let i = 0; i < len; i++)
        pairs.push([list[i * 2], list[i * 2 + 1]]);
    return pairs;
}
async function init$5() {
    if (location.host != "atcoder.jp")
        throw "Not AtCoder";
    const doc = unsafeWindow.document;
    // "言語名 その他の説明..." となっている
    // 注意:
    // * 言語名にはスペースが入ってはいけない（スペース以降は説明とみなされる）
    // * Python2 の言語名は「Python」、 Python3 の言語名は「Python3」
    const langMap = {
        4001: "C GCC 9.2.1",
        4002: "C Clang 10.0.0",
        4003: "C++ GCC 9.2.1",
        4004: "C++ Clang 10.0.0",
        4005: "Java OpenJDK 11.0.6",
        4006: "Python3 CPython 3.8.2",
        4007: "Bash 5.0.11",
        4008: "bc 1.07.1",
        4009: "Awk GNU Awk 4.1.4",
        4010: "C# .NET Core 3.1.201",
        4011: "C# Mono-mcs 6.8.0.105",
        4012: "C# Mono-csc 3.5.0",
        4013: "Clojure 1.10.1.536",
        4014: "Crystal 0.33.0",
        4015: "D DMD 2.091.0",
        4016: "D GDC 9.2.1",
        4017: "D LDC 1.20.1",
        4018: "Dart 2.7.2",
        4019: "dc 1.4.1",
        4020: "Erlang 22.3",
        4021: "Elixir 1.10.2",
        4022: "F# .NET Core 3.1.201",
        4023: "F# Mono 10.2.3",
        4024: "Forth gforth 0.7.3",
        4025: "Fortran GNU Fortran 9.2.1",
        4026: "Go 1.14.1",
        4027: "Haskell GHC 8.8.3",
        4028: "Haxe 4.0.3",
        4029: "Haxe 4.0.3",
        4030: "JavaScript Node.js 12.16.1",
        4031: "Julia 1.4.0",
        4032: "Kotlin 1.3.71",
        4033: "Lua Lua 5.3.5",
        4034: "Lua LuaJIT 2.1.0",
        4035: "Dash 0.5.8",
        4036: "Nim 1.0.6",
        4037: "Objective-C Clang 10.0.0",
        4038: "Lisp SBCL 2.0.3",
        4039: "OCaml 4.10.0",
        4040: "Octave 5.2.0",
        4041: "Pascal FPC 3.0.4",
        4042: "Perl 5.26.1",
        4043: "Raku Rakudo 2020.02.1",
        4044: "PHP 7.4.4",
        4045: "Prolog SWI-Prolog 8.0.3",
        4046: "Python PyPy2 7.3.0",
        4047: "Python3 PyPy3 7.3.0",
        4048: "Racket 7.6",
        4049: "Ruby 2.7.1",
        4050: "Rust 1.42.0",
        4051: "Scala 2.13.1",
        4052: "Java OpenJDK 1.8.0",
        4053: "Scheme Gauche 0.9.9",
        4054: "ML MLton 20130715",
        4055: "Swift 5.2.1",
        4056: "Text cat 8.28",
        4057: "TypeScript 3.8",
        4058: "Basic .NET Core 3.1.101",
        4059: "Zsh 5.4.2",
        4060: "COBOL Fixed OpenCOBOL 1.1.0",
        4061: "COBOL Free OpenCOBOL 1.1.0",
        4062: "Brainfuck bf 20041219",
        4063: "Ada Ada2012 GNAT 9.2.1",
        4064: "Unlambda 2.0.0",
        4065: "Cython 0.29.16",
        4066: "Sed 4.4",
        4067: "Vim 8.2.0460",
        // newjudge-2308
        5001: "C++ 20 gcc 12.2",
        5002: "Go 1.20.6",
        5003: "C# 11.0 .NET 7.0.7",
        5004: "Kotlin 1.8.20",
        5005: "Java OpenJDK 17",
        5006: "Nim 1.6.14",
        5007: "V 0.4",
        5008: "Zig 0.10.1",
        5009: "JavaScript Node.js 18.16.1",
        5010: "JavaScript Deno 1.35.1",
        5011: "R GNU R 4.2.1",
        5012: "D DMD 2.104.0",
        5013: "D LDC 1.32.2",
        5014: "Swift 5.8.1",
        5015: "Dart 3.0.5",
        5016: "PHP 8.2.8",
        5017: "C GCC 12.2.0",
        5018: "Ruby 3.2.2",
        5019: "Crystal 1.9.1",
        5020: "Brainfuck bf 20041219",
        5021: "F# 7.0 .NET 7.0.7",
        5022: "Julia 1.9.2",
        5023: "Bash 5.2.2",
        5024: "Text cat 8.32",
        5025: "Haskell GHC 9.4.5",
        5026: "Fortran GNU Fortran 12.2",
        5027: "Lua LuaJIT 2.1.0-beta3",
        5028: "C++ 23 gcc 12.2",
        5029: "CommonLisp SBCL 2.3.6",
        5030: "COBOL Free GnuCOBOL 3.1.2",
        5031: "C++ 23 Clang 16.0.5",
        5032: "Zsh Zsh 5.9",
        5033: "SageMath SageMath 9.5",
        5034: "Sed GNU sed 4.8",
        5035: "bc bc 1.07.1",
        5036: "dc dc 1.07.1",
        5037: "Perl perl  5.34",
        5038: "AWK GNU Awk 5.0.1",
        5039: "なでしこ cnako3 3.4.20",
        5040: "Assembly x64 NASM 2.15.05",
        5041: "Pascal FPC 3.2.2",
        5042: "C# 11.0 AOT .NET 7.0.7",
        5043: "Lua Lua 5.4.6",
        5044: "Prolog SWI-Prolog 9.0.4",
        5045: "PowerShell PowerShell 7.3.1",
        5046: "Scheme Gauche 0.9.12",
        5047: "Scala 3.3.0 Scala Native 0.4.14",
        5048: "Visual Basic 16.9 .NET 7.0.7",
        5049: "Forth gforth 0.7.3",
        5050: "Clojure babashka 1.3.181",
        5051: "Erlang Erlang 26.0.2",
        5052: "TypeScript 5.1 Deno 1.35.1",
        5053: "C++ 17 gcc 12.2",
        5054: "Rust 1.70.0",
        5055: "Python3 CPython 3.11.4",
        5056: "Scala Dotty 3.3.0",
        5057: "Koka koka 2.4.0",
        5058: "TypeScript 5.1 Node.js 18.16.1",
        5059: "OCaml ocamlopt 5.0.0",
        5060: "Raku Rakudo 2023.06",
        5061: "Vim vim 9.0.0242",
        5062: "Emacs Lisp Native Compile GNU Emacs 28.2",
        5063: "Python3 Mambaforge / CPython 3.10.10",
        5064: "Clojure clojure 1.11.1",
        5065: "プロデル mono版プロデル 1.9.1182",
        5066: "ECLiPSe ECLiPSe 7.1_13",
        5067: "Nibbles literate form nibbles 1.01",
        5068: "Ada GNAT 12.2",
        5069: "jq jq 1.6",
        5070: "Cyber Cyber v0.2-Latest",
        5071: "Carp Carp 0.5.5",
        5072: "C++ 17 Clang 16.0.5",
        5073: "C++ 20 Clang 16.0.5",
        5074: "LLVM IR Clang 16.0.5",
        5075: "Emacs Lisp Byte Compile GNU Emacs 28.2",
        5076: "Factor Factor 0.98",
        5077: "D GDC 12.2",
        5078: "Python3 PyPy 3.10-v7.3.12",
        5079: "Whitespace whitespacers 1.0.0",
        5080: "><> fishr 0.1.0",
        5081: "ReasonML reason 3.9.0",
        5082: "Python Cython 0.29.34",
        5083: "Octave GNU Octave 8.2.0",
        5084: "Haxe JVM Haxe 4.3.1",
        5085: "Elixir Elixir 1.15.2",
        5086: "Mercury Mercury 22.01.6",
        5087: "Seed7 Seed7 3.2.1",
        5088: "Emacs Lisp No Compile GNU Emacs 28.2",
        5089: "Unison Unison M5b",
        5090: "COBOL GnuCOBOLFixed 3.1.2",
        // 
        6001: "><> fishr 0.1.0",
        6002: "Ada 2022 GNAT 15.2.0",
        6003: "APL GNU APL 1.9",
        6004: "Assembly MIPS O32 ABI GNU assembler 2.42",
        6005: "Assembly x64 NASM 2.16.03",
        6006: "AWK GNU awk 5.2.1",
        6007: "A interpreter af48a2a",
        6008: "Bash 5.3",
        6009: "Basic FreeBASIC 1.10.1",
        6010: "bc GNU bc 1.08.2",
        6011: "Befunge 93 TBC 1.0",
        6012: "Brainfuck Tritium 1.2.73",
        6013: "C 23 Clang Clang 21.1.0",
        6014: "C 23 GCC 14.2.0",
        6015: "C# 13.0 .NET 9.0.8",
        6016: "C# 13.0 .NET Native AOT 9.0.8",
        6017: "C++ 23 GCC 15.2.0",
        6018: "C3 0.7.5",
        6019: "Carp 0.5.5",
        6020: "cLay 20250308-1 GCC 15.2.0",
        6021: "Clojure babashka 1.12.208",
        6022: "Clojure 1.12.2",
        6023: "Clojure 1.12.2 AOT",
        6025: "Clojure 1.12.2 ClojureScript 1.12.42 Node.js 22.19.0",
        6026: "COBOL Free GnuCOBOL 3.2",
        6027: "CommonLisp SBCL 2.5.8",
        6028: "Crystal 1.17.0",
        6029: "Cyber 0.3",
        6030: "D DMD 2.111.0",
        6031: "D GDC 15.2",
        6032: "D LDC 1.41.0",
        6033: "Dart 3.9.2",
        6034: "dc 1.5.2 GNU bc 1.08.2",
        6035: "ECLiPSe 7.1_13",
        6036: "Eiffel Gobo Eiffel 22.01",
        6037: "Eiffel Liberty Eiffel 07829e3",
        6038: "Elixir 1.18.4 OTP 28.0.2",
        6039: "EmacsLisp (Native Compile) GNU Emacs 29.4",
        6040: "Emojicode 1.0 beta 2 emojicodec 1.0 beta 2",
        6041: "Erlang 28.0.2",
        6042: "F# 9.0 .NET 9.0.8",
        6043: "Factor 0.100",
        6044: "Fish 4.0.2",
        6045: "Forth gforth 0.7.3",
        6046: "Fortran2018 Flang 20.1.7",
        6047: "Fortran2023 GCC 14.2.0",
        6048: "FORTRAN77 GCC 14.2.0",
        6049: "Gleam 1.12.0 OTP 28.0.2",
        6050: "Go 1.18 gccgo 15.2.0",
        6051: "Go 1.25.1",
        6052: "Haskell GHC 9.8.4",
        6053: "Haxe JVM Haxe 4.3.7 hxjava 4.2.0",
        6054: "C++ GCC 14.2.0 IOI-Style(GNU++20)",
        6055: "ISLisp Easy-ISLisp 5.43",
        6056: "Java 24 OpenJDK 24.0.2",
        6057: "JavaScript Bun 1.2.21",
        6058: "JavaScript Deno 2.4.5",
        6059: "JavaScript Node.js 22.19.0",
        6060: "Jule 0.1.6",
        6061: "Koka 3.2.2",
        6062: "Kotlin 2.2.10",
        6063: "Kuin kuincl v.2021.8.17",
        6064: "LazyK irori v1.0.0",
        6065: "Lean 4.22.0",
        6066: "LLVMIR Clang 21.1.0",
        6067: "Lua 5.4.7",
        6068: "Lua LuaJIT 2.1.1703358377",
        6069: "Mercury 22.01.8",
        6071: "Nim Nim 1.6.20",
        6072: "Nim Nim 2.2.4",
        6073: "OCaml ocamlopt 5.3.0",
        6074: "Octave GNU Octave 10.2.0",
        6075: "Pascal FPC 3.2.2",
        6076: "Perl 5.38.2",
        6077: "PHP 8.4.12",
        6078: "Piet your-diary/piet_programming_language 3.0.0 (PPM image)",
        6079: "Pony 0.59.0",
        6080: "PowerShell 7.5.2",
        6081: "Prolog SWI-Prolog 9.2.9",
        6082: "Python3 CPython 3.13.7",
        6083: "Python3 PyPy 3.11-v7.3.20",
        6084: "R GNU R 4.5.0",
        6085: "ReasonML reson 3.16.0",
        6086: "Ruby 3.3 truffleruby 25.0.0",
        6087: "Ruby 3.4.5",
        6088: "Rust 1.89.0",
        6089: "SageMath 10.7",
        6090: "Scala 3.7.2 Dotty",
        6091: "Scala 3.7.2 Scala Native 0.5.8",
        6092: "Scheme ChezScheme 10.2.0",
        6093: "Scheme Gauche 0.9.15",
        6094: "Seed7 Seed7 3.5.0",
        6095: "Swift 6.2",
        6096: "Tcl 9.0.1",
        6097: "Terra 1.2.0",
        6098: "TeX 3.141592653",
        6099: "Text cat 9.4",
        6100: "TypeScript 5.8 Deno 2.4.5",
        6101: "TypeScript 5.9 tsc 5.9.2 Bun 1.2.21",
        6102: "TypeScript 5.9 tsc 5.9.2 Node.js 22.19.0",
        6103: "Uiua 0.16.2",
        6104: "Unison 0.5.47",
        6105: "V 0.4.10",
        6106: "Vala 0.56.18",
        6107: "Verilog 2012 Icarus Verilog 12.0",
        6108: "Veryl 0.16.4",
        6109: "WebAssembly wabt 1.0.34 + iwasm 2.4.1",
        6110: "Whitespace whitespacers 1.3.0",
        6111: "Zig 0.15.1",
        6112: "なでしこ cnako3 3.7.8 Node.js 22.19.0",
        6113: "プロデル mono版プロデル 2.0.1353",
        6114: "Julia 1.11.6",
        6115: "Python Codon 0.19.3",
        6116: "C++ 23 Clang 21.1.0",
        6117: "Fix 1.1.0-alpha.12",
        6118: "SQL DuckDB 1.3.2",
    };
    // filter langMap
    const existingLangs = new Set();
    for (const option of doc.querySelector("#select-lang select.current").options) {
        existingLangs.add(option.value);
    }
    for (const key of Object.keys(langMap)) {
        if (!existingLangs.has(key.toString())) {
            delete langMap[key];
        }
    }
    const languageId = new ObservableValue(unsafeWindow.$("#select-lang select.current").val());
    unsafeWindow.$("#select-lang select").change(() => {
        languageId.value = unsafeWindow.$("#select-lang select.current").val();
    });
    const language = languageId.map(lang => langMap[lang]);
    const isTestCasesHere = /^\/contests\/[^\/]+\/tasks\//.test(location.pathname);
    const taskSelector = doc.querySelector("#select-task");
    function getTaskURI() {
        if (taskSelector)
            return `${location.origin}/contests/${unsafeWindow.contestScreenName}/tasks/${taskSelector.value}`;
        return `${location.origin}${location.pathname}`;
    }
    const testcasesCache = {};
    if (taskSelector) {
        const doFetchTestCases = async () => {
            console.log(`Fetching test cases...: ${getTaskURI()}`);
            const taskURI = getTaskURI();
            const load = !(taskURI in testcasesCache) || testcasesCache[taskURI].state == "error";
            if (!load)
                return;
            try {
                testcasesCache[taskURI] = { state: "loading" };
                const testcases = await fetchTestCases(taskURI);
                testcasesCache[taskURI] = { testcases, state: "loaded" };
            }
            catch (e) {
                testcasesCache[taskURI] = { state: "error" };
            }
        };
        unsafeWindow.$("#select-task").change(doFetchTestCases);
        doFetchTestCases();
    }
    async function fetchTestCases(taskUrl) {
        const html = await fetch(taskUrl).then(res => res.text());
        const taskDoc = new DOMParser().parseFromString(html, "text/html");
        return getTestCases(taskDoc);
    }
    function getTestCases(doc) {
        const selectors = [
            ["#task-statement p+pre.literal-block", ".section"],
            ["#task-statement pre.source-code-for-copy", ".part"],
            ["#task-statement .lang>*:nth-child(1) .div-btn-copy+pre", ".part"],
            ["#task-statement .div-btn-copy+pre", ".part"],
            ["#task-statement>.part pre.linenums", ".part"],
            ["#task-statement>.part section>pre", ".part"],
            ["#task-statement>.part:not(.io-style)>h3+section>pre", ".part"],
            ["#task-statement pre", ".part"],
        ];
        for (const [selector, closestSelector] of selectors) {
            let e = [...doc.querySelectorAll(selector)];
            e = e.filter(e => {
                if (e.closest(".io-style"))
                    return false; // practice2
                if (e.querySelector("var"))
                    return false;
                return true;
            });
            if (e.length == 0)
                continue;
            return pairs(e).map(([input, output], index) => {
                const container = input.closest(closestSelector) || input.parentElement;
                return {
                    selector,
                    title: `Sample ${index + 1}`,
                    input: input.textContent,
                    output: output.textContent,
                    anchor: container.querySelector(".btn-copy") || container.querySelector("h1,h2,h3,h4,h5,h6"),
                };
            });
        }
        { // maximum_cup_2018_d
            let e = [...doc.querySelectorAll("#task-statement .div-btn-copy+pre")];
            e = e.filter(f => !f.childElementCount);
            if (e.length) {
                return pairs(e).map(([input, output], index) => ({
                    selector: "#task-statement .div-btn-copy+pre",
                    title: `Sample ${index + 1}`,
                    input: input.textContent,
                    output: output.textContent,
                    anchor: (input.closest(".part") || input.parentElement).querySelector(".btn-copy"),
                }));
            }
        }
        return [];
    }
    const atcoder = {
        name: "AtCoder",
        language,
        langMap,
        get sourceCode() {
            const $ = unsafeWindow.document.querySelector.bind(unsafeWindow.document);
            if (typeof unsafeWindow["ace"] != "undefined") {
                if (!$(".btn-toggle-editor").classList.contains("active")) {
                    return unsafeWindow["ace"].edit($("#editor")).getValue();
                }
                else {
                    return $("#plain-textarea").value;
                }
            }
            else {
                return unsafeWindow.getSourceCode();
            }
        },
        set sourceCode(sourceCode) {
            const $ = unsafeWindow.document.querySelector.bind(unsafeWindow.document);
            if (typeof unsafeWindow["ace"] != "undefined") {
                unsafeWindow["ace"].edit($("#editor")).setValue(sourceCode);
                $("#plain-textarea").value = sourceCode;
            }
            else {
                doc.querySelector(".plain-textarea").value = sourceCode;
                unsafeWindow.$(".editor").data("editor").doc.setValue(sourceCode);
            }
        },
        submit() {
            doc.querySelector("#submit").click();
        },
        get testButtonContainer() {
            return doc.querySelector("#submit").parentElement;
        },
        get sideButtonContainer() {
            return doc.querySelector(".editor-buttons");
        },
        get bottomMenuContainer() {
            return doc.getElementById("main-div");
        },
        get resultListContainer() {
            return doc.querySelector(".form-code-submit");
        },
        get testCases() {
            const taskURI = getTaskURI();
            if (taskURI in testcasesCache && testcasesCache[taskURI].state == "loaded")
                return testcasesCache[taskURI].testcases;
            if (isTestCasesHere) {
                const testcases = getTestCases(doc);
                testcasesCache[taskURI] = { testcases, state: "loaded" };
                return testcases;
            }
            else {
                console.error("AtCoder Easy Test v2: Test cases are still not loaded");
                return [];
            }
        },
        get jQuery() {
            return unsafeWindow["jQuery"];
        },
        get taskURI() {
            return getTaskURI();
        },
    };
    return atcoder;
}

async function init$4() {
    if (location.host != "yukicoder.me")
        throw "Not yukicoder";
    const $ = unsafeWindow.$;
    const doc = unsafeWindow.document;
    const editor = unsafeWindow.ace.edit("rich_source");
    const eSourceObject = $("#source");
    const eLang = $("#lang");
    const eSamples = $(".sample");
    const langMap = {
        "cpp14": "C++ C++14 GCC 11.1.0 + Boost 1.77.0",
        "cpp17": "C++ C++17 GCC 11.1.0 + Boost 1.77.0",
        "cpp-clang": "C++ C++17 Clang 10.0.0 + Boost 1.76.0",
        "cpp23": "C++ C++11 GCC 8.4.1",
        "c11": "C++ C++11 GCC 11.1.0",
        "c": "C C90 GCC 8.4.1",
        "java8": "Java Java16 OpenJDK 16.0.1",
        "csharp": "C# CSC 3.9.0",
        "csharp_mono": "C# Mono 6.12.0.147",
        "csharp_dotnet": "C# .NET 5.0",
        "perl": "Perl 5.26.3",
        "raku": "Raku Rakudo v2021-07-2-g74d7ff771",
        "php": "PHP 7.2.24",
        "php7": "PHP 8.0.8",
        "python3": "Python3 3.9.6 + numpy 1.14.5 + scipy 1.1.0",
        "pypy2": "Python PyPy2 7.3.5",
        "pypy3": "Python3 PyPy3 7.3.5",
        "ruby": "Ruby 3.0.2p107",
        "d": "D DMD 2.097.1",
        "go": "Go 1.16.6",
        "haskell": "Haskell 8.10.5",
        "scala": "Scala 2.13.6",
        "nim": "Nim 1.4.8",
        "rust": "Rust 1.53.0",
        "kotlin": "Kotlin 1.5.21",
        "scheme": "Scheme Gauche 0.9.10",
        "crystal": "Crystal 1.1.1",
        "swift": "Swift 5.4.2",
        "ocaml": "OCaml 4.12.0",
        "clojure": "Clojure 1.10.2.790",
        "fsharp": "F# 5.0",
        "elixir": "Elixir 1.7.4",
        "lua": "Lua LuaJIT 2.0.5",
        "fortran": "Fortran gFortran 8.4.1",
        "node": "JavaScript Node.js 15.5.0",
        "typescript": "TypeScript 4.3.5",
        "lisp": "Lisp Common Lisp sbcl 2.1.6",
        "sml": "ML Standard ML MLton 20180207-6",
        "kuin": "Kuin KuinC++ v.2021.7.17",
        "vim": "Vim v8.2",
        "sh": "Bash 4.4.19",
        "nasm": "Assembler nasm 2.13.03",
        "clay": "cLay 20210917-1",
        "bf": "Brainfuck BFI 1.1",
        "Whitespace": "Whitespace 0.3",
        "text": "Text cat 8.3",
    };
    // place anchor elements
    for (const btnCopyInput of doc.querySelectorAll(".copy-sample-input")) {
        btnCopyInput.parentElement.insertBefore(newElement("span", { className: "atcoder-easy-test-anchor" }), btnCopyInput);
    }
    const language = new ObservableValue(langMap[eLang.val()]);
    eLang.on("change", () => {
        language.value = langMap[eLang.val()];
    });
    return {
        name: "yukicoder",
        language,
        get sourceCode() {
            if (eSourceObject.is(":visible"))
                return eSourceObject.val();
            return editor.getSession().getValue();
        },
        set sourceCode(sourceCode) {
            eSourceObject.val(sourceCode);
            editor.getSession().setValue(sourceCode);
        },
        submit() {
            doc.querySelector(`#submit_form input[type="submit"]`).click();
        },
        get testButtonContainer() {
            return doc.querySelector("#submit_form");
        },
        get sideButtonContainer() {
            return doc.querySelector("#toggle_source_editor").parentElement;
        },
        get bottomMenuContainer() {
            return doc.body;
        },
        get resultListContainer() {
            return doc.querySelector("#content");
        },
        get testCases() {
            const testCases = [];
            let sampleId = 1;
            for (let i = 0; i < eSamples.length; i++) {
                const eSample = eSamples.eq(i);
                const [eInput, eOutput] = eSample.find("pre");
                testCases.push({
                    title: `Sample ${sampleId++}`,
                    input: eInput.textContent,
                    output: eOutput.textContent,
                    anchor: eSample.find(".atcoder-easy-test-anchor")[0],
                });
            }
            return testCases;
        },
        get jQuery() {
            return $;
        },
        get taskURI() {
            return location.href;
        },
    };
}

class Editor {
    _element;
    constructor(lang) {
        this._element = document.createElement("textarea");
        this._element.style.fontFamily = "monospace";
        this._element.style.width = "100%";
        this._element.style.minHeight = "5em";
    }
    get element() {
        return this._element;
    }
    get sourceCode() {
        return this._element.value;
    }
    set sourceCode(sourceCode) {
        this._element.value = sourceCode;
    }
    setLanguage(lang) {
    }
}

var langMap = {
    3: "Delphi 7",
    4: "Pascal Free Pascal 3.0.2",
    6: "PHP 7.2.13",
    7: "Python 2.7.18",
    9: "C# Mono 6.8",
    12: "Haskell GHC 8.10.1",
    13: "Perl 5.20.1",
    19: "OCaml 4.02.1",
    20: "Scala 2.12.8",
    28: "D DMD32 v2.091.0",
    31: "Python3 3.8.10",
    32: "Go 1.15.6",
    34: "JavaScript V8 4.8.0",
    36: "Java 1.8.0_241",
    40: "Python PyPy2 2.7 (7.3.0)",
    41: "Python3 PyPy3 3.7 (7.3.0)",
    43: "C C11 GCC 5.1.0",
    48: "Kotlin 1.5.31",
    49: "Rust 1.49.0",
    50: "C++ C++14 G++ 6.4.0",
    51: "Pascal PascalABC.NET 3.4.1",
    52: "C++ C++17 Clang++",
    54: "C++ C++17 G++ 7.3.0",
    55: "JavaScript Node.js 12.6.3",
    59: "C++ Microsoft Visual C++ 2017",
    60: "Java 11.0.6",
    61: "C++ C++17 9.2.0 (64 bit, msys 2)",
    65: "C# 8, .NET Core 3.1",
    67: "Ruby 3.0.0",
    70: "Python3 PyPy 3.7 (7.3.5, 64bit)",
    72: "Kotlin 1.5.31",
    73: "C++ GNU G++ 11.2.0 (64 bit, winlibs)",
    75: "Rust 1.75.0 (2021)",
    79: "C# 10, .NET SDK 6.0",
    83: "Kotlin 1.7.20",
    87: "Java 21 64bit",
    88: "Kotlin 1.9.21",
    89: "C++ GNU G++20 13.2 (64 bit, winlibs)",
    91: "GNU G++23 14.2 (64 bit, msys2)",
};

config.registerFlag("site.codeforces.showEditor", true, "Show Editor in Codeforces Problem Page");
async function init$3() {
    if (location.host != "codeforces.com")
        throw "not Codeforces";
    //TODO: m1.codeforces.com, m2.codeforces.com, m3.codeforces.com に対応する
    const doc = unsafeWindow.document;
    const eLang = doc.querySelector("select[name='programTypeId']");
    doc.head.appendChild(newElement("link", {
        rel: "stylesheet",
        href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
    }));
    doc.head.appendChild(newElement("style", {
        textContent: `
.atcoder-easy-test-btn-run-case {
  float: right;
  line-height: 1.1rem;
}
    `,
    }));
    const eButtons = newElement("span");
    doc.querySelector(".submitForm").appendChild(eButtons);
    await loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
    const jQuery = unsafeWindow["jQuery"].noConflict();
    unsafeWindow["jQuery"] = unsafeWindow["$"];
    unsafeWindow["jQuery11"] = jQuery;
    await loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js", null, { jQuery, $: jQuery });
    const language = new ObservableValue(langMap[eLang.value]);
    eLang.addEventListener("change", () => {
        language.value = langMap[eLang.value];
    });
    let _sourceCode = "";
    const eFile = doc.querySelector(".submitForm").elements["sourceFile"];
    eFile.addEventListener("change", async () => {
        if (eFile.files[0]) {
            _sourceCode = await eFile.files[0].text();
            if (editor)
                editor.sourceCode = _sourceCode;
        }
    });
    let editor = null;
    let waitCfFastSubmitCount = 0;
    const waitCfFastSubmit = setInterval(() => {
        if (document.getElementById("editor")) {
            // cf-fast-submit
            if (editor && editor.element)
                editor.element.style.display = "none";
            // 言語セレクトを同期させる
            const eLang2 = doc.querySelector(".submit-form select[name='programTypeId']");
            if (eLang2) {
                eLang.addEventListener("change", () => {
                    eLang2.value = eLang.value;
                });
                eLang2.addEventListener("change", () => {
                    eLang.value = eLang2.value;
                    language.value = langMap[eLang.value];
                });
            }
            // TODO: 選択されたファイルをどうかする
            // エディタを使う
            const aceEditor = unsafeWindow["ace"].edit("editor");
            editor = {
                get sourceCode() {
                    return aceEditor.getValue();
                },
                set sourceCode(sourceCode) {
                    aceEditor.setValue(sourceCode);
                },
                setLanguage(lang) { },
            };
            // ボタンを追加する
            const buttonContainer = doc.querySelector(".submit-form .submit").parentElement;
            buttonContainer.appendChild(newElement("button", {
                type: "button",
                className: "btn btn-info",
                textContent: "Test & Submit",
                onclick: () => events.trig("testAndSubmit"),
            }));
            buttonContainer.appendChild(newElement("button", {
                type: "button",
                className: "btn btn-default",
                textContent: "Test All Samples",
                onclick: () => events.trig("testAllSamples"),
            }));
            clearInterval(waitCfFastSubmit);
        }
        else {
            waitCfFastSubmitCount++;
            if (waitCfFastSubmitCount >= 100)
                clearInterval(waitCfFastSubmit);
        }
    }, 100);
    if (config.get("site.codeforces.showEditor", true)) {
        editor = new Editor(langMap[eLang.value].split(" ")[0]);
        doc.getElementById("pageContent").appendChild(editor.element);
        language.addListener(lang => {
            editor.setLanguage(lang);
        });
    }
    return {
        name: "Codeforces",
        language,
        get sourceCode() {
            if (editor)
                return editor.sourceCode;
            return _sourceCode;
        },
        set sourceCode(sourceCode) {
            const container = new DataTransfer();
            container.items.add(new File([sourceCode], "prog.txt", { type: "text/plain" }));
            const eFile = doc.querySelector(".submitForm").elements["sourceFile"];
            eFile.files = container.files;
            _sourceCode = sourceCode;
            if (editor)
                editor.sourceCode = sourceCode;
        },
        submit() {
            if (editor)
                _sourceCode = editor.sourceCode;
            this.sourceCode = _sourceCode;
            doc.querySelector(`.submitForm .submit`).click();
        },
        get testButtonContainer() {
            return eButtons;
        },
        get sideButtonContainer() {
            return eButtons;
        },
        get bottomMenuContainer() {
            return doc.body;
        },
        get resultListContainer() {
            return doc.querySelector("#pageContent");
        },
        get testCases() {
            const testcases = [];
            let num = 1;
            for (const eSampleTest of doc.querySelectorAll(".sample-test")) {
                const inputs = eSampleTest.querySelectorAll(".input pre");
                const outputs = eSampleTest.querySelectorAll(".output pre");
                const anchors = eSampleTest.querySelectorAll(".input .title .input-output-copier");
                const count = Math.min(inputs.length, outputs.length, anchors.length);
                for (let i = 0; i < count; i++) {
                    let inputText = "";
                    for (const node of inputs[i].childNodes) {
                        inputText += node.textContent;
                        if (node.nodeType == node.ELEMENT_NODE && (node.tagName == "DIV" || node.tagName == "BR")) {
                            inputText += "\n";
                        }
                    }
                    testcases.push({
                        title: `Sample ${num++}`,
                        input: inputText,
                        output: outputs[i].textContent,
                        anchor: anchors[i],
                    });
                }
            }
            return testcases;
        },
        get jQuery() {
            return jQuery;
        },
        get taskURI() {
            return location.href;
        },
    };
}

config.registerFlag("site.codeforcesMobile.showEditor", true, "Show Editor in Mobile Codeforces (m[1-3].codeforces.com) Problem Page");
async function init$2() {
    if (!/^m[1-3]\.codeforces\.com$/.test(location.host))
        throw "not Codeforces Mobile";
    const url = /\/contest\/(\d+)\/problem\/([^/]+)/.exec(location.pathname);
    const contestId = url[1];
    const problemId = url[2];
    const doc = unsafeWindow.document;
    const main = doc.querySelector("main");
    doc.head.appendChild(newElement("link", {
        rel: "stylesheet",
        href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css",
    }));
    await loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js");
    const language = new ObservableValue("");
    let submit = () => { };
    let getSourceCode = () => "";
    let setSourceCode = (_) => { };
    // make Editor
    if (config.get("site.codeforcesMobile.showEditor", true)) {
        const frame = newElement("iframe", {
            src: `/contest/${contestId}/submit`,
            style: {
                display: "none",
            },
        });
        doc.body.appendChild(frame);
        await new Promise(done => frame.onload = done);
        const fdoc = frame.contentDocument;
        const form = fdoc.querySelector("._SubmitPage_submitForm");
        form.elements["problemIndex"].value = problemId;
        form.elements["problemIndex"].readonly = true;
        form.elements["programTypeId"].addEventListener("change", function () {
            language.value = langMap[this.value];
        });
        for (const row of form.children) {
            if (row.tagName != "DIV")
                continue;
            row.classList.add("form-group");
            const control = row.querySelector("*[name]");
            if (control)
                control.classList.add("form-control");
        }
        form.parentElement.removeChild(form);
        main.appendChild(form);
        submit = () => form.submit();
        getSourceCode = () => form.elements["source"].value;
        setSourceCode = sourceCode => {
            form.elements["source"].value = sourceCode;
        };
    }
    return {
        name: "Codeforces",
        language,
        get sourceCode() {
            return getSourceCode();
        },
        set sourceCode(sourceCode) {
            setSourceCode(sourceCode);
        },
        submit,
        get testButtonContainer() {
            return main;
        },
        get sideButtonContainer() {
            return main;
        },
        get bottomMenuContainer() {
            return doc.body;
        },
        get resultListContainer() {
            return main;
        },
        get testCases() {
            const testcases = [];
            let index = 1;
            for (const container of doc.querySelectorAll(".sample-test")) {
                const input = container.querySelector(".input pre.content").textContent;
                const output = container.querySelector(".output pre.content").textContent;
                const anchor = container.querySelector(".input .title");
                testcases.push({
                    input, output, anchor,
                    title: `Sample ${index++}`,
                });
            }
            return testcases;
        },
        get jQuery() {
            return unsafeWindow["jQuery"];
        },
        get taskURI() {
            return location.href;
        },
    };
}

async function init$1() {
    if (location.host != "greasyfork.org" && !location.href.match(/433152-atcoder-easy-test-v2/))
        throw "Not about page";
    const doc = unsafeWindow.document;
    await loadScript("https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js");
    const jQuery = unsafeWindow["jQuery"];
    await loadScript("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js", null, { jQuery, $: jQuery });
    const e = newElement("div");
    doc.getElementById("install-area").appendChild(newElement("button", {
        type: "button",
        textContent: "Open config",
        onclick: () => settings.open(),
    }));
    return {
        name: "About Page",
        language: new ObservableValue(""),
        get sourceCode() { return ""; },
        set sourceCode(sourceCode) { },
        submit() { },
        get testButtonContainer() { return e; },
        get sideButtonContainer() { return e; },
        get bottomMenuContainer() { return e; },
        get resultListContainer() { return e; },
        get testCases() { return []; },
        get jQuery() { return jQuery; },
        get taskURI() { return ""; },
    };
}

// 設定ページが開けなくなるのを避ける
const inits = [init$1()];
config.registerFlag("site.atcoder", true, "Use AtCoder Easy Test in AtCoder");
if (config.get("site.atcoder", true))
    inits.push(init$5());
config.registerFlag("site.yukicoder", true, "Use AtCoder Easy Test in yukicoder");
if (config.get("site.yukicoder", true))
    inits.push(init$4());
config.registerFlag("site.codeforces", true, "Use AtCoder Easy Test in Codeforces");
if (config.get("site.codeforces", true))
    inits.push(init$3());
config.registerFlag("site.codeforcesMobile", true, "Use AtCoder Easy Test in Codeforces Mobile (m[1-3].codeforces.com)");
if (config.get("site.codeforcesMobile", true))
    inits.push(init$2());
const site = Promise.any(inits);
site.catch(() => {
    for (const promise of inits) {
        promise.catch(console.error);
    }
});

class WandboxRunner extends CodeRunner {
    name;
    options;
    constructor(name, label, options = {}) {
        super(label, "Wandbox");
        this.name = name;
        this.options = options;
    }
    getOptions(sourceCode, input) {
        if (typeof this.options == "function")
            return this.options(sourceCode, input);
        return this.options;
    }
    run(sourceCode, input, options = {}) {
        return this.request(Object.assign({
            compiler: this.name,
            code: sourceCode,
            stdin: input,
        }, Object.assign(options, this.getOptions(sourceCode, input))));
    }
    async request(body) {
        const startTime = Date.now();
        let res;
        try {
            res = await fetch("https://wandbox.org/api/compile.json", {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            }).then(r => r.json());
        }
        catch (error) {
            console.error(error);
            return {
                status: "IE",
                input: body.stdin,
                error: String(error),
            };
        }
        const endTime = Date.now();
        const result = {
            status: "OK",
            exitCode: String(res.status),
            execTime: endTime - startTime,
            input: body.stdin,
            output: String(res.program_output || ""),
            error: String(res.program_error || ""),
        };
        // 正常終了以外の場合
        if (res.status != 0) {
            if (res.signal) {
                result.exitCode += ` (${res.signal})`;
            }
            result.output = String(res.compiler_output || "") + String(result.output || "");
            result.error = String(res.compiler_error || "") + String(result.error || "");
            if (res.compiler_output || res.compiler_error) {
                result.status = "CE";
            }
            else {
                result.status = "RE";
            }
        }
        return result;
    }
}

class WandboxCppRunner extends WandboxRunner {
    async run(sourceCode, input, options = {}) {
        // ACL を結合する
        const ACLBase = "https://cdn.jsdelivr.net/gh/atcoder/ac-library/";
        const files = new Map();
        const includeHeader = async (source) => {
            const pattern = /^#\s*include\s*[<"]atcoder\/([^>"]+)[>"]/gm;
            const loaded = [];
            let match;
            while (match = pattern.exec(source)) {
                const file = "atcoder/" + match[1];
                if (files.has(file))
                    continue;
                files.set(file, null);
                loaded.push([file, fetch(ACLBase + file, { mode: "cors", cache: "force-cache", }).then(r => r.text())]);
            }
            const included = await Promise.all(loaded.map(async ([file, r]) => {
                const source = await r;
                files.set(file, source);
                return source;
            }));
            for (const source of included) {
                await includeHeader(source);
            }
        };
        await includeHeader(sourceCode);
        const codes = [];
        for (const [file, code] of files) {
            codes.push({ file, code, });
        }
        return await this.request(Object.assign({
            compiler: this.name,
            code: sourceCode,
            stdin: input,
            codes,
        }, Object.assign(options, this.getOptions(sourceCode, input))));
    }
}

// 設定項目を定義
config.registerCount("wandboxAPI.cacheLifetime", 24 * 60 * 60 * 1000, "lifetime [ms] of Wandbox compiler list cache");
async function fetchWandboxCompilers() {
    // キャッシュが有効な場合はキャッシュを使う
    const cached = config.get("wandboxAPI.cachedCompilerList", { value: null, lastModified: -Infinity });
    if (Date.now() - cached.lastModified <= config.get("wandboxAPI.cacheLifetime", 24 * 60 * 60 * 1000)) {
        return cached.value;
    }
    // キャッシュが無効な場合は fetch
    const response = await fetch("https://wandbox.org/api/list.json");
    const compilers = await response.json();
    config.set("wandboxAPI.cachedCompilerList", { value: compilers, lastModified: Date.now() });
    config.save();
    return compilers;
}
function getOptimizationOption(compiler) {
    // Optimizationという名前のSwitchから、最適化のオプションを取得する
    return compiler.switches.find((sw) => sw["display-name"] === "Optimization")
        ?.name;
}
function toRunner(compiler) {
    const optimizationOption = getOptimizationOption(compiler);
    if (compiler.language == "C++") {
        return new WandboxCppRunner(compiler.name, compiler.language + " " + compiler.name + " + ACL", {
            "compiler-option-raw": "-I.",
            options: optimizationOption,
        });
    }
    else {
        return new WandboxRunner(compiler.name, compiler.language + " " + compiler.name, {
            options: optimizationOption,
        });
    }
}

const pattern = /^https?:\/\//;
let runners$1 = {};
const currentLocalRunners = [];
class LocalRunner extends CodeRunner {
    compilerName;
    static setRunners(_runners) {
        runners$1 = _runners;
    }
    static async update() {
        const apiURL = config.getString("codeRunner.localRunnerURL", "");
        for (const key of currentLocalRunners) {
            delete runners$1[key];
        }
        currentLocalRunners.length = 0;
        if (!apiURL) {
            // 未設定の場合は登録済みrunnerを削除し即return（例外を投げない）
            return;
        }
        if (!pattern.test(apiURL)) {
            throw "LocalRunner: invalid localRunnerURL";
        }
        try {
            const res = await fetch(apiURL, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: "list",
                }),
            }).then(r => r.json());
            for (const { language, compilerName, label } of res) {
                const key = `${language} ${compilerName} ${label}`;
                runners$1[key] = new LocalRunner(compilerName, label);
                currentLocalRunners.push(key);
            }
        }
        catch (e) {
            // fetch失敗したらreturn（例外を投げない）
            console.error("LocalRunner:", e);
            return;
        }
    }
    constructor(compilerName, label) {
        super(label, "Local");
        this.compilerName = compilerName;
    }
    async run(sourceCode, input, options = {}) {
        const apiURL = config.getString("codeRunner.localRunnerURL", "");
        if (!pattern.test(apiURL)) {
            throw "LocalRunner: invalid localRunnerURL";
        }
        let res;
        try {
            res = await fetch(apiURL, {
                method: "POST",
                mode: "cors",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: "run",
                    compilerName: this.compilerName,
                    sourceCode,
                    stdin: input,
                }),
            }).then(r => r.json());
        }
        catch (error) {
            return {
                status: "IE",
                input,
                error: String(error),
            };
        }
        const result = {
            status: "OK",
            exitCode: String(res.exitCode),
            execTime: +res.time,
            memory: +res.memory,
            input,
            output: res.stdout ?? "",
            error: res.stderr ?? "",
        };
        switch (res.status) {
            case "success": {
                if (res.exitCode == 0) {
                    result.status = "OK";
                }
                else {
                    result.status = "RE";
                }
                break;
            }
            case "compileError": {
                result.status = "CE";
                break;
            }
            case "internalError":
            default: {
                result.status = "IE";
            }
        }
        return result;
    }
}

// runners[key] = runner; key = language + " " + environmentInfo
const runners = {
    "C C17 Clang paiza.io": new PaizaIORunner("c", "C (C17 / Clang)"),
    "Python3 CPython paiza.io": new PaizaIORunner("python3", "Python3"),
    "Python3 Pyodide": pyodideRunner,
    "Bash paiza.io": new PaizaIORunner("bash", "Bash"),
    "Clojure paiza.io": new PaizaIORunner("clojure", "Clojure"),
    "D LDC paiza.io": new PaizaIORunner("d", "D (LDC)"),
    "Erlang paiza.io": new PaizaIORunner("erlang", "Erlang"),
    "Elixir paiza.io": new PaizaIORunner("elixir", "Elixir"),
    "F# Interactive paiza.io": new PaizaIORunner("fsharp", "F# (Interactive)"),
    "Haskell paiza.io": new PaizaIORunner("haskell", "Haskell"),
    "JavaScript paiza.io": new PaizaIORunner("javascript", "JavaScript"),
    "Kotlin paiza.io": new PaizaIORunner("kotlin", "Kotlin"),
    "Objective-C paiza.io": new PaizaIORunner("objective-c", "Objective-C"),
    "Perl paiza.io": new PaizaIORunner("perl", "Perl"),
    "PHP paiza.io": new PaizaIORunner("php", "PHP"),
    "Ruby paiza.io": new PaizaIORunner("ruby", "Ruby"),
    "Rust 1.42.0 AtCoder": new AtCoderRunner("4050", "Rust (1.42.0)"),
    "Rust paiza.io": new PaizaIORunner("rust", "Rust"),
    "Scala paiza": new PaizaIORunner("scala", "Scala"),
    "Scheme paiza.io": new PaizaIORunner("scheme", "Scheme"),
    "Swift paiza.io": new PaizaIORunner("swift", "Swift"),
    "Text local": new CustomRunner("Text", async (sourceCode, input) => {
        return {
            status: "OK",
            exitCode: "0",
            input,
            output: sourceCode,
        };
    }),
    "Basic Visual Basic paiza.io": new PaizaIORunner("vb", "Visual Basic"),
    "COBOL Free paiza.io": new PaizaIORunner("cobol", "COBOL - Free"),
    "COBOL Fixed OpenCOBOL 1.1.0 AtCoder": new AtCoderRunner("4060", "COBOL - Fixed (OpenCOBOL 1.1.0)"),
    "COBOL Free OpenCOBOL 1.1.0 AtCoder": new AtCoderRunner("4061", "COBOL - Free (OpenCOBOL 1.1.0)"),
};
// wandboxの環境を追加
const wandboxPromise = fetchWandboxCompilers().then((compilers) => {
    for (const compiler of compilers) {
        let language = compiler.language;
        if (compiler.language === "Python" && /python-3\./.test(compiler.version)) {
            language = "Python3";
        }
        const key = language + " " + compiler.name;
        runners[key] = toRunner(compiler);
        console.log("wandbox", key, runners[key]);
    }
});
site.then(site => {
    if (site.name == "AtCoder") {
        // AtCoderRunner がない場合は、追加する
        for (const [languageId, descriptor] of Object.entries(site.langMap)) {
            const m = descriptor.match(/([^ ]+)(.*)/);
            if (m) {
                const name = `${m[1]} ${m[2].slice(1)} AtCoder`;
                runners[name] = new AtCoderRunner(languageId, descriptor);
            }
        }
    }
});
// LocalRunner 関連
config.registerText("codeRunner.localRunnerURL", "", "URL of Local Runner API (cf. https://github.com/magurofly/atcoder-easy-test/blob/main/v2/docs/LocalRunner.md)"); //TODO: add cf.
LocalRunner.setRunners(runners);
const localRunnerPromise = LocalRunner.update();
console.info("AtCoder Easy Test: codeRunner OK");
config.registerCount("codeRunner.maxRetry", 3, "Max count of retry when IE (Internal Error)");
var codeRunner = {
    // 指定した環境でコードを実行する
    async run(runnerId, sourceCode, input, expectedOutput, options = { trim: true, split: true }) {
        // CodeRunner が存在しない言語ID
        if (!(runnerId in runners))
            return Promise.reject("Language not supported");
        // 最後に実行したコードを保存
        if (sourceCode.length > 0)
            site.then(site => codeSaver.save(site.taskURI, sourceCode));
        // 実行
        const maxRetry = config.get("codeRunner.maxRetry", 3);
        for (let retry = 0; retry < maxRetry; retry++) {
            try {
                const result = await runners[runnerId].test(sourceCode, input, expectedOutput, options);
                const lang = runnerId.split(" ")[0];
                if (result.status == "IE") {
                    console.error(result);
                    const runnerIds = Object.keys(runners).filter(runnerId => runnerId.split(" ")[0] == lang);
                    const index = runnerIds.indexOf(runnerId);
                    runnerId = runnerIds[(index + 1) % runnerIds.length];
                    continue;
                }
                return result;
            }
            catch (e) {
                console.error(e);
            }
        }
    },
    // 環境の名前の一覧を取得する
    // @return runnerIdとラベルのペアの配列
    async getEnvironment(languageId) {
        await wandboxPromise; // wandboxAPI がコンパイラ情報を取ってくるのを待つ
        await localRunnerPromise; // LocalRunner がコンパイラ情報を取ってくるのを待つ
        const langs = similarLangs(languageId, Object.keys(runners));
        if (langs.length == 0)
            throw `Undefined language: ${languageId}`;
        return langs.map(runnerId => [runnerId, runners[runnerId].label]);
    },
};

var hBottomMenu = "<div id=\"bottom-menu-wrapper\" class=\"navbar navbar-default navbar-fixed-bottom\">\n  <div class=\"container\">\n    <div class=\"navbar-header\">\n      <button id=\"bottom-menu-key\" type=\"button\" class=\"navbar-toggle collapsed glyphicon glyphicon-menu-down\" data-toggle=\"collapse\" data-target=\"#bottom-menu\"></button>\n    </div>\n    <div id=\"bottom-menu\" class=\"collapse navbar-collapse\">\n      <ul id=\"bottom-menu-tabs\" class=\"nav nav-tabs\"></ul>\n      <div id=\"bottom-menu-contents\" class=\"tab-content\"></div>\n    </div>\n  </div>\n</div>";

var hStyle$1 = "<style>\n#bottom-menu-wrapper {\n  background: transparent !important;\n  border: none !important;\n  pointer-events: none;\n  padding: 0;\n}\n\n#bottom-menu-wrapper>.container {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  padding: 0;\n}\n\n#bottom-menu-wrapper>.container>.navbar-header {\n  float: none;\n}\n\n#bottom-menu-key {\n  display: block;\n  float: none;\n  margin: 0 auto;\n  padding: 10px 3em;\n  border-radius: 5px 5px 0 0;\n  background: #000;\n  opacity: 0.5;\n  color: #FFF;\n  cursor: pointer;\n  pointer-events: auto;\n  text-align: center;\n}\n\n@media screen and (max-width: 767px) {\n  #bottom-menu-key {\n    opacity: 0.25;\n  }\n}\n\n#bottom-menu-key.collapsed:before {\n  content: \"\\e260\";\n}\n\n#bottom-menu-tabs {\n  padding: 3px 0 0 10px;\n  cursor: n-resize;\n}\n\n#bottom-menu-tabs a {\n  pointer-events: auto;\n}\n\n#bottom-menu {\n  pointer-events: auto;\n  background: rgba(0, 0, 0, 0.8);\n  color: #fff;\n  max-height: unset;\n}\n\n#bottom-menu.collapse:not(.in) {\n  display: none !important;\n}\n\n#bottom-menu-tabs>li>a {\n  background: rgba(150, 150, 150, 0.5);\n  color: #000;\n  border: solid 1px #ccc;\n  filter: brightness(0.75);\n}\n\n#bottom-menu-tabs>li>a:hover {\n  background: rgba(150, 150, 150, 0.5);\n  border: solid 1px #ccc;\n  color: #111;\n  filter: brightness(0.9);\n}\n\n#bottom-menu-tabs>li.active>a {\n  background: #eee;\n  border: solid 1px #ccc;\n  color: #333;\n  filter: none;\n}\n\n.bottom-menu-btn-close {\n  font-size: 8pt;\n  vertical-align: baseline;\n  padding: 0 0 0 6px;\n  margin-right: -6px;\n}\n\n#bottom-menu-contents {\n  padding: 5px 15px;\n  max-height: 50vh;\n  overflow-y: auto;\n}\n\n#bottom-menu-contents .panel {\n  color: #333;\n}\n</style>";

async function init() {
    const site$1 = await site;
    const style = html2element(hStyle$1);
    const bottomMenu = html2element(hBottomMenu);
    unsafeWindow.document.head.appendChild(style);
    site$1.bottomMenuContainer.appendChild(bottomMenu);
    const bottomMenuKey = bottomMenu.querySelector("#bottom-menu-key");
    const bottomMenuTabs = bottomMenu.querySelector("#bottom-menu-tabs");
    const bottomMenuContents = bottomMenu.querySelector("#bottom-menu-contents");
    // メニューのリサイズ
    {
        let resizeStart = null;
        const onStart = (event) => {
            const target = event.target;
            const pageY = event.pageY;
            if (target.id != "bottom-menu-tabs")
                return;
            resizeStart = { y: pageY, height: bottomMenuContents.getBoundingClientRect().height };
        };
        const onMove = (event) => {
            if (!resizeStart)
                return;
            event.preventDefault();
            bottomMenuContents.style.height = `${resizeStart.height - (event.pageY - resizeStart.y)}px`;
        };
        const onEnd = () => {
            resizeStart = null;
        };
        bottomMenuTabs.addEventListener("mousedown", onStart);
        bottomMenuTabs.addEventListener("mousemove", onMove);
        bottomMenuTabs.addEventListener("mouseup", onEnd);
        bottomMenuTabs.addEventListener("mouseleave", onEnd);
    }
    let tabs = new Set();
    let selectedTab = null;
    /** 下メニューの操作
     * 下メニューはいくつかのタブからなる。タブはそれぞれ tabId, ラベル, 中身を持っている。
     */
    const menuController = {
        /** タブを選択 */
        selectTab(tabId) {
            const tab = site$1.jQuery(`#bottom-menu-tab-${tabId}`);
            if (tab && tab[0]) {
                tab.tab("show"); // Bootstrap 3
                selectedTab = tabId;
            }
        },
        /** 下メニューにタブを追加する */
        addTab(tabId, tabLabel, paneContent, options = {}) {
            console.log(`AtCoder Easy Test: addTab: ${tabLabel} (${tabId})`, paneContent);
            // タブを追加
            const tab = document.createElement("a");
            tab.textContent = tabLabel;
            tab.id = `bottom-menu-tab-${tabId}`;
            tab.href = "#";
            tab.dataset.id = tabId;
            tab.dataset.target = `#bottom-menu-pane-${tabId}`;
            tab.dataset.toggle = "tab";
            tab.addEventListener("click", event => {
                event.preventDefault();
                menuController.selectTab(tabId);
            });
            tabs.add(tab);
            const tabLi = document.createElement("li");
            tabLi.appendChild(tab);
            bottomMenuTabs.appendChild(tabLi);
            // 内容を追加
            const pane = document.createElement("div");
            pane.className = "tab-pane";
            pane.id = `bottom-menu-pane-${tabId}`;
            pane.appendChild(paneContent);
            bottomMenuContents.appendChild(pane);
            const controller = {
                get id() {
                    return tabId;
                },
                close() {
                    bottomMenuTabs.removeChild(tabLi);
                    bottomMenuContents.removeChild(pane);
                    tabs.delete(tab);
                    if (selectedTab == tabId) {
                        selectedTab = null;
                        if (tabs.size > 0) {
                            menuController.selectTab(tabs.values().next().value.dataset.id);
                        }
                    }
                },
                show() {
                    menuController.show();
                    menuController.selectTab(tabId);
                },
                set color(color) {
                    tab.style.backgroundColor = color;
                },
            };
            // 閉じるボタン
            if (options.closeButton) {
                const btn = document.createElement("a");
                btn.className = "bottom-menu-btn-close btn btn-link glyphicon glyphicon-remove";
                btn.addEventListener("click", () => {
                    controller.close();
                });
                tab.appendChild(btn);
            }
            // 選択されているタブがなければ選択
            if (!selectedTab)
                menuController.selectTab(tabId);
            return controller;
        },
        /** 下メニューを表示する */
        show() {
            if (bottomMenuKey.classList.contains("collapsed"))
                bottomMenuKey.click();
        },
        /** 下メニューの表示/非表示を切り替える */
        toggle() {
            bottomMenuKey.click();
        },
    };
    console.info("AtCoder Easy Test: bottomMenu OK");
    return menuController;
}

var hRowTemplate = "<div class=\"atcoder-easy-test-cases-row alert alert-dismissible\">\n  <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">\n    <span aria-hidden=\"true\">×</span>\n  </button>\n  <div class=\"progress\">\n    <div class=\"progress-bar\" style=\"width: 0%;\">0 / 0</div>\n  </div>\n  <div class=\"atcoder-easy-test-cases-row-date\" style=\"font-family: monospace; text-align: right; position: absolute; right: 1em;\"></div>\n</div>";

class ResultRow {
    _tabs;
    _element;
    _promise;
    constructor(pairs) {
        this._tabs = pairs.map(([_, tab]) => tab);
        this._element = html2element(hRowTemplate);
        this._element.querySelector(".close").addEventListener("click", () => this.remove());
        {
            const date = new Date();
            const h = date.getHours().toString().padStart(2, "0");
            const m = date.getMinutes().toString().padStart(2, "0");
            const s = date.getSeconds().toString().padStart(2, "0");
            this._element.querySelector(".atcoder-easy-test-cases-row-date").textContent = `${h}:${m}:${s}`;
        }
        const numCases = pairs.length;
        let numFinished = 0;
        let numAccepted = 0;
        const progressBar = this._element.querySelector(".progress-bar");
        progressBar.textContent = `${numFinished} / ${numCases}`;
        this._promise = Promise.all(pairs.map(([pResult, tab]) => {
            const button = html2element(`<div class="label label-default" style="margin: 3px; cursor: pointer;">WJ</div>`);
            button.addEventListener("click", async () => {
                (await tab).show();
            });
            this._element.appendChild(button);
            return pResult.then(result => {
                button.textContent = result.status;
                if (result.status == "AC") {
                    button.classList.add("label-success");
                }
                else if (result.status != "OK") {
                    button.classList.add("label-warning");
                }
                numFinished++;
                if (result.status == "AC")
                    numAccepted++;
                progressBar.textContent = `${numFinished} / ${numCases}`;
                progressBar.style.width = `${100 * numFinished / numCases}%`;
                if (numFinished == numCases) {
                    if (numAccepted == numCases)
                        this._element.classList.add("alert-success");
                    else
                        this._element.classList.add("alert-warning");
                }
            }).catch(reason => {
                button.textContent = "IE";
                button.classList.add("label-danger");
                console.error(reason);
            });
        }));
    }
    get element() {
        return this._element;
    }
    onFinish(listener) {
        this._promise.then(listener);
    }
    remove() {
        for (const pTab of this._tabs)
            pTab.then(tab => tab.close());
        const parent = this._element.parentElement;
        if (parent)
            parent.removeChild(this._element);
    }
}

var hResultList = "<div class=\"row\"></div>";

const eResultList = html2element(hResultList);
site.then(site => site.resultListContainer.appendChild(eResultList));
const resultList = {
    addResult(pairs) {
        const result = new ResultRow(pairs);
        eResultList.insertBefore(result.element, eResultList.firstChild);
        return result;
    },
};

const version = {
    currentProperty: new ObservableValue("2.15.1"),
    get current() {
        return this.currentProperty.value;
    },
    latestProperty: new ObservableValue(config.get("version.latest", "2.15.1")),
    get latest() {
        return this.latestProperty.value;
    },
    lastCheckProperty: new ObservableValue(config.get("version.lastCheck", 0)),
    get lastCheck() {
        return this.lastCheckProperty.value;
    },
    get hasUpdate() {
        return this.compare(this.current, this.latest) < 0;
    },
    compare(a, b) {
        const x = a.split(".").map((s) => parseInt(s, 10));
        const y = b.split(".").map((s) => parseInt(s, 10));
        for (let i = 0; i < 3; i++) {
            if (x[i] < y[i]) {
                return -1;
            }
            else if (x[i] > y[i]) {
                return 1;
            }
        }
        return 0;
    },
    async checkUpdate(force = false) {
        const now = Date.now();
        if (!force && now - version.lastCheck < config.get("version.checkInterval", aDay)) {
            return this.current;
        }
        const packageJson = await fetch("https://raw.githubusercontent.com/magurofly/atcoder-easy-test/main/v2/package.json").then(r => r.json());
        console.log(packageJson);
        const latest = packageJson["version"];
        this.latestProperty.value = latest;
        config.set("version.latest", latest);
        this.lastCheckProperty.value = now;
        config.set("version.lastCheck", now);
        return latest;
    },
};
// 更新チェック
const aDay = 24 * 60 * 60 * 1e3;
config.registerCount("version.checkInterval", aDay, "Interval [ms] of checking for new version");
config.get("version.checkInterval", aDay);
setInterval(() => {
    version.checkUpdate(false);
}, 60e3);
settings.add("version", (win) => {
    const root = newElement("div");
    const text = win.document.createTextNode.bind(win.document);
    const textAuto = (property) => {
        const t = text(property.value);
        property.addListener(value => {
            t.textContent = value;
        });
        return t;
    };
    const tCurrent = textAuto(version.currentProperty);
    const tLatest = textAuto(version.latestProperty);
    const tLastCheck = textAuto(version.lastCheckProperty.map(time => new Date(time).toLocaleString()));
    root.appendChild(newElement("p", {}, [
        text("AtCoder Easy Test v"),
        tCurrent,
    ]));
    const updateButton = newElement("a", {
        className: "btn btn-info",
        textContent: "Install",
        href: "https://github.com/magurofly/atcoder-easy-test/raw/main/v2/atcoder-easy-test.user.js",
        target: "_blank",
    });
    const showButton = () => {
        if (version.hasUpdate)
            updateButton.style.display = "inline";
        else
            updateButton.style.display = "none";
    };
    showButton();
    version.lastCheckProperty.addListener(showButton);
    root.appendChild(newElement("p", {}, [
        text("Latest: v"),
        tLatest,
        text(" (Last Check: "),
        tLastCheck,
        text(") "),
        updateButton,
    ]));
    root.appendChild(newElement("p", {}, [
        newElement("a", {
            className: "btn btn-primary",
            textContent: "Check Update",
            onclick() {
                version.checkUpdate(true);
            },
        }),
    ]));
    return root;
});

var hTabTemplate = "<div class=\"atcoder-easy-test-result container\">\n  <div class=\"row\">\n    <div class=\"atcoder-easy-test-result-col-input col-xs-12\" data-if-expected-output=\"col-sm-6 col-sm-push-6\">\n      <div class=\"form-group\">\n        <label class=\"control-label col-xs-12\">\n          Standard Input\n          <div class=\"col-xs-12\">\n            <textarea class=\"atcoder-easy-test-result-input form-control\" rows=\"3\" readonly=\"readonly\"></textarea>\n          </div>\n        </label>\n      </div>\n    </div>\n    <div class=\"atcoder-easy-test-result-col-expected-output col-xs-12 col-sm-6 hidden\" data-if-expected-output=\"!hidden col-sm-pull-6\">\n      <div class=\"form-group\">\n        <label class=\"control-label col-xs-12\">\n          Expected Output\n          <div class=\"col-xs-12\">\n            <textarea class=\"atcoder-easy-test-result-expected-output form-control\" rows=\"3\" readonly=\"readonly\"></textarea>\n          </div>\n        </label>\n      </div>\n    </div>\n  </div>\n  <div class=\"row\"><div class=\"col-sm-6 col-sm-offset-3\">\n    <div class=\"panel panel-default\">\n      <table class=\"table table-condensed\">\n        <tbody>\n          <tr>\n            <th class=\"text-center\">Exit Code</th>\n            <th class=\"text-center\">Exec Time</th>\n            <th class=\"text-center\">Memory</th>\n          </tr>\n          <tr>\n            <td class=\"atcoder-easy-test-result-exit-code text-center\"></td>\n            <td class=\"atcoder-easy-test-result-exec-time text-center\"></td>\n            <td class=\"atcoder-easy-test-result-memory text-center\"></td>\n          </tr>\n        </tbody>\n      </table>\n    </div>\n  </div></div>\n  <div class=\"row\">\n    <div class=\"atcoder-easy-test-result-col-output col-xs-12\" data-if-error=\"col-md-6\">\n      <div class=\"form-group\">\n        <label class=\"control-label col-xs-12\">\n          Standard Output\n          <div class=\"col-xs-12\">\n            <textarea class=\"atcoder-easy-test-result-output form-control\" rows=\"5\" readonly=\"readonly\"></textarea>\n          </div>\n        </label>\n      </div>\n    </div>\n    <div class=\"atcoder-easy-test-result-col-error col-xs-12 col-md-6 hidden\" data-if-error=\"!hidden\">\n      <div class=\"form-group\">\n        <label class=\"control-label col-xs-12\">\n          Standard Error\n          <div class=\"col-xs-12\">\n            <textarea class=\"atcoder-easy-test-result-error form-control\" rows=\"5\" readonly=\"readonly\"></textarea>\n          </div>\n        </label>\n      </div>\n    </div>\n  </div>\n</div>";

function setClassFromData(element, name) {
    const classes = element.dataset[name].split(/\s+/);
    for (let className of classes) {
        let flag = true;
        if (className[0] == "!") {
            className = className.slice(1);
            flag = false;
        }
        element.classList.toggle(className, flag);
    }
}
class ResultTabContent {
    _title;
    _uid;
    _element;
    _result;
    constructor() {
        this._uid = Date.now().toString(16) + Math.floor(Math.random() * 256).toString(16);
        this._result = null;
        this._element = html2element(hTabTemplate);
        this._element.id = `atcoder-easy-test-result-${this._uid}`;
    }
    set result(result) {
        this._result = result;
        if (result.status == "AC") {
            this.outputStyle.backgroundColor = "#dff0d8";
        }
        else if (result.status != "OK") {
            this.outputStyle.backgroundColor = "#fcf8e3";
        }
        this.input = result.input;
        if ("expectedOutput" in result)
            this.expectedOutput = result.expectedOutput;
        this.exitCode = result.exitCode;
        if ("execTime" in result)
            this.execTime = `${result.execTime} ms`;
        if ("memory" in result)
            this.memory = `${result.memory} KB`;
        if ("output" in result)
            this.output = result.output;
        if (result.error)
            this.error = result.error;
    }
    get result() {
        return this._result;
    }
    get uid() {
        return this._uid;
    }
    get element() {
        return this._element;
    }
    set title(title) {
        this._title = title;
    }
    get title() {
        return this._title;
    }
    set input(input) {
        this._get("input").value = input;
    }
    get inputStyle() {
        return this._get("input").style;
    }
    set expectedOutput(output) {
        this._get("expected-output").value = output;
        setClassFromData(this._get("col-input"), "ifExpectedOutput");
        setClassFromData(this._get("col-expected-output"), "ifExpectedOutput");
    }
    get expectedOutputStyle() {
        return this._get("expected-output").style;
    }
    set output(output) {
        this._get("output").value = output;
    }
    get outputStyle() {
        return this._get("output").style;
    }
    set error(error) {
        this._get("error").value = error;
        setClassFromData(this._get("col-output"), "ifError");
        setClassFromData(this._get("col-error"), "ifError");
    }
    set exitCode(code) {
        const element = this._get("exit-code");
        element.textContent = code;
        const isSuccess = code == "0";
        element.classList.toggle("bg-success", isSuccess);
        element.classList.toggle("bg-danger", !isSuccess);
    }
    set execTime(time) {
        this._get("exec-time").textContent = time;
    }
    set memory(memory) {
        this._get("memory").textContent = memory;
    }
    _get(name) {
        return this._element.querySelector(`.atcoder-easy-test-result-${name}`);
    }
}

var hRoot = "<form id=\"atcoder-easy-test-container\" class=\"form-horizontal\">\n  <div class=\"row\">\n      <div class=\"col-xs-12 col-lg-8\">\n          <div class=\"form-group\">\n              <label class=\"control-label col-sm-2\">Test Environment</label>\n              <div class=\"col-sm-10\">\n                  <select class=\"form-control\" id=\"atcoder-easy-test-language\" style=\"width: 100% !important\"></select>\n              </div>\n          </div>\n          <div class=\"form-group\">\n              <label class=\"control-label col-sm-2\" for=\"atcoder-easy-test-input\">Standard Input</label>\n              <div class=\"col-sm-10\">\n                  <textarea id=\"atcoder-easy-test-input\" name=\"input\" class=\"form-control\" rows=\"3\"></textarea>\n              </div>\n          </div>\n      </div>\n      <div class=\"col-xs-12 col-lg-4\">\n          <details close>\n              <summary>Expected Output</summary>\n              <div class=\"form-group\">\n                  <label class=\"control-label col-sm-2\" for=\"atcoder-easy-test-allowable-error-check\">Allowable Error</label>\n                  <div class=\"col-sm-10\">\n                      <div class=\"input-group\">\n                          <span class=\"input-group-addon\">\n                              <input id=\"atcoder-easy-test-allowable-error-check\" type=\"checkbox\" checked=\"checked\">\n                          </span>\n                          <input id=\"atcoder-easy-test-allowable-error\" type=\"text\" class=\"form-control\" value=\"1e-6\">\n                      </div>\n                  </div>\n              </div>\n              <div class=\"form-group\">\n                  <label class=\"control-label col-sm-2\" for=\"atcoder-easy-test-output\">Expected Output</label>\n                  <div class=\"col-sm-10\">\n                      <textarea id=\"atcoder-easy-test-output\" name=\"output\" class=\"form-control\" rows=\"3\"></textarea>\n                  </div>\n              </div>\n          </details>\n      </div>\n      <div class=\"col-xs-12 col-md-6\">\n          <div class=\"col-xs-11 col-xs-offset=1\">\n              <div class=\"form-group\">\n                  <a id=\"atcoder-easy-test-run\" class=\"btn btn-primary\">Run</a>\n              </div>\n          </div>\n      </div>\n      <div class=\"col-xs-12 col-md-6\">\n          <div class=\"col-xs-11 col-xs-offset=1\">\n              <div class=\"form-group text-right\">\n                  <small>AtCoder Easy Test v<span id=\"atcoder-easy-test-version\"></span></small>\n                  <a id=\"atcoder-easy-test-setting\" class=\"btn btn-xs btn-default\">Setting</a>\n              </div>\n          </div>\n      </div>\n  </div>\n  <style>\n  #atcoder-easy-test-language {\n      border: none;\n      background: transparent;\n      font: inherit;\n      color: #fff;\n  }\n  #atcoder-easy-test-language option {\n      border: none;\n      color: #333;\n      font: inherit;\n  }\n  </style>\n</form>";

var hStyle = "<style>\n.atcoder-easy-test-result textarea {\n  font-family: monospace;\n  font-weight: normal;\n}\n</style>";

var hRunButton = "<button type=\"button\" class=\"btn btn-primary btn-sm atcoder-easy-test-btn-run-case\" style=\"vertical-align: top; margin-left: 0.5em\">Run</button>";

var hTestAndSubmit = "<button type=\"button\" id=\"atcoder-easy-test-btn-test-and-submit\" class=\"btn btn-info btn\" style=\"margin-left: 1rem\" title=\"Ctrl+Enter\" data-toggle=\"tooltip\">Test &amp; Submit</button>";

var hTestAllSamples = "<button type=\"button\" id=\"atcoder-easy-test-btn-test-all\" class=\"btn btn-default btn-sm\" style=\"margin-left: 1rem\" title=\"Alt+Enter\" data-toggle=\"tooltip\">Test All Samples</button>";

(async () => {
    const site$1 = await site;
    const doc = unsafeWindow.document;
    // init bottomMenu
    const pBottomMenu = init();
    pBottomMenu.then(bottomMenu => {
        unsafeWindow.bottomMenu = bottomMenu;
    });
    await doneOrFail(pBottomMenu);
    // external interfaces
    unsafeWindow.codeRunner = codeRunner;
    doc.head.appendChild(html2element(hStyle));
    // interface
    const atCoderEasyTest = {
        version,
        site: site$1,
        config,
        codeSaver,
        enableButtons() {
            events.trig("enable");
        },
        disableButtons() {
            events.trig("disable");
        },
        runCount: 0,
        runTest(title, language, sourceCode, input, output = null, options = { trim: true, split: true, }) {
            this.disableButtons();
            const content = new ResultTabContent();
            const pTab = pBottomMenu.then(bottomMenu => bottomMenu.addTab("easy-test-result-" + content.uid, `#${++this.runCount} ${title}`, content.element, { active: true, closeButton: true }));
            const pResult = codeRunner.run(language, sourceCode, input, output, options);
            pResult.then(result => {
                content.result = result;
                if (result.status == "AC") {
                    pTab.then(tab => tab.color = "#dff0d8");
                }
                else if (result.status != "OK") {
                    pTab.then(tab => tab.color = "#fcf8e3");
                }
            }).finally(() => {
                this.enableButtons();
            });
            return [pResult, pTab];
        }
    };
    unsafeWindow.atCoderEasyTest = atCoderEasyTest;
    // place "Easy Test" tab
    {
        // declare const hRoot: string;
        const root = html2element(hRoot);
        const E = (id) => root.querySelector(`#atcoder-easy-test-${id}`);
        const eLanguage = E("language");
        const eInput = E("input");
        const eAllowableErrorCheck = E("allowable-error-check");
        const eAllowableError = E("allowable-error");
        const eOutput = E("output");
        const eRun = E("run");
        const eSetting = E("setting");
        const eVersion = E("version");
        eVersion.textContent = atCoderEasyTest.version.current;
        events.on("enable", () => {
            eRun.classList.remove("disabled");
        });
        events.on("disable", () => {
            eRun.classList.add("disabled");
        });
        eSetting.addEventListener("click", () => {
            settings.open();
        });
        // バージョン確認
        {
            let button = null;
            const showButton = () => {
                if (!version.hasUpdate)
                    return;
                if (button) {
                    button.textContent = `Update to v${version.latest}`;
                    return;
                }
                console.info(`AtCoder Easy Test: New version available: v${version}`);
                button = newElement("a", {
                    href: "https://github.com/magurofly/atcoder-easy-test/raw/main/v2/atcoder-easy-test.user.js",
                    target: "_blank",
                    className: "btn btn-xs btn-info",
                    textContent: `Update to v${version.latest}`,
                });
                eVersion.insertAdjacentElement("afterend", button);
            };
            version.latestProperty.addListener(showButton);
            showButton();
        }
        // 言語選択関係
        {
            async function onEnvChange() {
                const langSelection = config.get("langSelection", {});
                langSelection[site$1.language.value] = eLanguage.value;
                config.set("langSelection", langSelection);
                config.save();
            }
            if (unsafeWindow["jQuery"] && unsafeWindow["jQuery"].fn.select2) {
                unsafeWindow["jQuery"](eLanguage).on("change", onEnvChange);
            }
            else {
                eLanguage.addEventListener("change", onEnvChange);
            }
            async function setLanguage() {
                const languageId = site$1.language.value;
                while (eLanguage.firstChild)
                    eLanguage.removeChild(eLanguage.firstChild);
                try {
                    if (!languageId)
                        throw new Error("AtCoder Easy Test: language not set");
                    const langs = await codeRunner.getEnvironment(languageId);
                    console.log(`AtCoder Easy Test: language = ${langs[1]} (${langs[0]})`);
                    // add <option>
                    for (const [languageId, label] of langs) {
                        const option = document.createElement("option");
                        option.value = languageId;
                        option.textContent = label;
                        eLanguage.appendChild(option);
                    }
                    // load
                    const langSelection = config.get("langSelection", {});
                    if (languageId in langSelection) {
                        const prev = langSelection[languageId];
                        if (langs.some(([lang, _]) => lang == prev)) {
                            eLanguage.value = prev;
                        }
                    }
                    events.trig("enable");
                }
                catch (error) {
                    console.log(`AtCoder Easy Test: language = ? (${languageId})`);
                    console.error(error);
                    const option = document.createElement("option");
                    option.className = "fg-danger";
                    option.textContent = error;
                    eLanguage.appendChild(option);
                    events.trig("disable");
                }
            }
            site$1.language.addListener(() => setLanguage());
            eAllowableError.disabled = !eAllowableErrorCheck.checked;
            eAllowableErrorCheck.addEventListener("change", event => {
                eAllowableError.disabled = !eAllowableErrorCheck.checked;
            });
        }
        // テスト実行
        function runTest(title, input, output = null, options = {}) {
            const opts = Object.assign({ trim: true, split: true, }, options);
            if (eAllowableErrorCheck.checked) {
                opts.allowableError = parseFloat(eAllowableError.value);
            }
            return atCoderEasyTest.runTest(title, eLanguage.value, site$1.sourceCode, input, output, opts);
        }
        function runAllCases(testcases) {
            const runGroupId = uuid();
            const pairs = testcases.map(testcase => runTest(testcase.title, testcase.input, testcase.output, { runGroupId }));
            resultList.addResult(pairs);
            return Promise.all(pairs.map(([pResult, _]) => pResult.then(result => {
                if (result.status == "AC")
                    return Promise.resolve(result);
                else
                    return Promise.reject(result);
            })));
        }
        eRun.addEventListener("click", _ => {
            const title = "Run";
            const input = eInput.value;
            const output = eOutput.value;
            runTest(title, input, output || null);
        });
        await doneOrFail(pBottomMenu.then(bottomMenu => bottomMenu.addTab("easy-test", "Easy Test", root)));
        // place "Run" button on each sample
        for (const testCase of site$1.testCases) {
            const eRunButton = html2element(hRunButton);
            eRunButton.addEventListener("click", async () => {
                const [pResult, pTab] = runTest(testCase.title, testCase.input, testCase.output);
                await pResult;
                (await pTab).show();
            });
            testCase.anchor.insertAdjacentElement("afterend", eRunButton);
            events.on("disable", () => {
                eRunButton.classList.add("disabled");
            });
            events.on("enable", () => {
                eRunButton.classList.remove("disabled");
            });
        }
        // place "Test & Submit" button
        {
            const button = html2element(hTestAndSubmit);
            site$1.testButtonContainer.appendChild(button);
            const testAndSubmit = async () => {
                await runAllCases(site$1.testCases);
                site$1.submit();
            };
            button.addEventListener("click", testAndSubmit);
            events.on("testAndSubmit", testAndSubmit);
            events.on("disable", () => button.classList.add("disabled"));
            events.on("enable", () => button.classList.remove("disabled"));
        }
        // place "Test All Samples" button
        {
            const button = html2element(hTestAllSamples);
            site$1.testButtonContainer.appendChild(button);
            const testAllSamples = () => runAllCases(site$1.testCases);
            button.addEventListener("click", testAllSamples);
            events.on("testAllSamples", testAllSamples);
            events.on("disable", () => button.classList.add("disabled"));
            events.on("enable", () => button.classList.remove("disabled"));
        }
    }
    // place "Restore Last Play" button
    try {
        const restoreButton = doc.createElement("a");
        restoreButton.className = "btn btn-danger btn-sm";
        restoreButton.textContent = "Restore Last Play";
        restoreButton.addEventListener("click", async () => {
            try {
                const lastCode = await codeSaver.restore(site$1.taskURI);
                if (site$1.sourceCode.length == 0 || confirm("Your current code will be replaced. Are you sure?")) {
                    site$1.sourceCode = lastCode;
                }
            }
            catch (reason) {
                alert(reason);
            }
        });
        site$1.sideButtonContainer.appendChild(restoreButton);
    }
    catch (e) {
        console.error(e);
    }
    // キーボードショートカット
    config.registerFlag("ui.useKeyboardShortcut", true, "Use Keyboard Shortcuts");
    unsafeWindow.addEventListener("keydown", (event) => {
        if (config.get("ui.useKeyboardShortcut", true)) {
            if (event.key == "Enter" && event.ctrlKey) {
                events.trig("testAndSubmit");
            }
            else if (event.key == "Enter" && event.altKey) {
                events.trig("testAllSamples");
            }
            else if (event.key == "Escape" && event.altKey) {
                pBottomMenu.then(bottomMenu => bottomMenu.toggle());
            }
        }
    });
})();
})();
