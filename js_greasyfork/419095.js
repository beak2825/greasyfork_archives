// ==UserScript==
// @name         AtCoder Easy Test
// @namespace    http://atcoder.jp/
// @version      1.5.1
// @description  Make testing sample cases easy
// @author       magurofly
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419095/AtCoder%20Easy%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/419095/AtCoder%20Easy%20Test.meta.js
// ==/UserScript==

// This script uses variables from page below:
// * `$`
// * `getSourceCode`
// * `csrfToken`

// This scripts consists of three modules:
// * bottom menu
// * code runner
// * view

(function script() {

const VERSION = "1.5.1";

if (typeof unsafeWindow !== "undefined") {
    console.log(unsafeWindow);
    unsafeWindow.eval(`(${script})();`);
    console.log("Script run in unsafeWindow");
    return;
}
const $ = window.$;
const getSourceCode = window.getSourceCode;
const csrfToken = window.csrfToken;

const $id = document.getElementById.bind(document);
const $select = document.querySelector.bind(document);
const $selectAll = document.querySelectorAll.bind(document);
const $create = (tagName, attrs = {}, children = []) => {
    const e = document.createElement(tagName);
    for (const name in attrs) e.setAttribute(name, attrs[name]);
    for (const child of children) e.appendChild(child);
    return e;
};

// -- code runner --
const codeRunner = (function() {
    'use strict';

    function buildParams(data) {
        return Object.entries(data).map(([key, value]) =>
                                            encodeURIComponent(key) + "=" + encodeURIComponent(value)).join("&");
    }

    function sleep(ms) {
        return new Promise(done => setTimeout(done, ms));
    }

    class CodeRunner {
        constructor(label, site) {
            this.label = `${label} [${site}]`;
        }

        async test(sourceCode, input, supposedOutput, options) {
            const result = await this.run(sourceCode, input);
            if (result.status != "OK" || typeof supposedOutput !== "string") return result;
            let output = result.stdout || "";

            if (options.trim) {
                supposedOutput = supposedOutput.trim();
                output = output.trim();
            }

            let equals = (x, y) => x === y;

            if ("allowableError" in options) {
                const floatPattern = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
                const superEquals = equals;
                equals = (x, y) => {
                    if (floatPattern.test(x) && floatPattern.test(y)) return Math.abs(parseFloat(x) - parseFloat(y)) <= options.allowableError;
                    return superEquals(x, y);
                }
            }

            if (options.split) {
                const superEquals = equals;
                equals = (x, y) => {
                    x = x.split(/\s+/);
                    y = y.split(/\s+/);
                    if (x.length != y.length) return false;
                    const len = x.length;
                    for (let i = 0; i < len; i++) {
                        if (!superEquals(x[i], y[i])) return false;
                    }
                    return true;
                }
            }

            result.status = equals(output, supposedOutput) ? "AC" : "WA";

            return result;
        }
    }

    class CustomRunner extends CodeRunner {
        constructor(label, run) {
            super(label, "Browser");
            this.run = run;
        }
    }

    class WandboxRunner extends CodeRunner {
        constructor(name, label, options = {}) {
            super(label, "Wandbox");
            this.name = name;
            this.options = options;
        }

        run(sourceCode, input) {
            let options = this.options;
            if (typeof options == "function") options = options(sourceCode, input);
            return this.request(Object.assign(JSON.stringify({
                compiler: this.name,
                code: sourceCode,
                stdin: input,
            }), this.options));
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
                    body,
                }).then(r => r.json());
            } catch (error) {
                return {
                    status: "IE",
                    stderr: error,
                };
            }
            const endTime = Date.now();

            const result = {
                status: "OK",
                exitCode: res.status,
                execTime: endTime - startTime,
                stdout: res.program_output,
                stderr: res.program_error,
            };
            if (res.status != 0) {
                if (res.signal) {
                    result.exitCode += " (" + res.signal + ")";
                }
                result.stdout = (res.compiler_output || "") + (result.stdout || "");
                result.stderr = (res.compiler_error || "") + (result.stderr || "");
                if (res.compiler_output || res.compiler_error) {
                    result.status = "CE";
                } else {
                    result.status = "RE";
                }
            }

            return result;
        }
    }

    class PaizaIORunner extends CodeRunner {
        constructor(name, label) {
            super(label, "PaizaIO");
            this.name = name;
        }

        async run(sourceCode, input) {
            let id, status, error;
            try {
                const res = await fetch("https://api.paiza.io/runners/create?" + buildParams({
                    source_code: sourceCode,
                    language: this.name,
                    input,
                    longpoll: true,
                    longpoll_timeout: 10,
                    api_key: "guest",
                }), {
                    method: "POST",
                    mode: "cors",
                }).then(r => r.json());
                id = res.id;
                status = res.status;
                error = res.error;
            } catch (error) {
                return {
                    status: "IE",
                    stderr: error,
                };
            }

            while (status == "running") {
                const res = await (await fetch("https://api.paiza.io/runners/get_status?" + buildParams({
                    id,
                    api_key: "guest",
                }), {
                    mode: "cors",
                })).json();
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
                exitCode: res.exit_code,
                execTime: +res.time * 1e3,
                memory: +res.memory * 1e-3,
            };

            if (res.build_result == "failure") {
                result.status = "CE";
                result.exitCode = res.build_exit_code;
                result.stdout = res.build_stdout;
                result.stderr = res.build_stderr;
            } else {
                result.status = (res.result == "timeout") ? "TLE" : (res.result == "failure") ? "RE" : "OK";
                result.exitCode = res.exit_code;
                result.stdout = res.stdout;
                result.stderr = res.stderr;
            }

            return result;
        }
    }

    const loader = {
        loaded: {},
        async load(url, options = { mode: "cors", }) {
            if (!(url in this.loaded)) {
                this.loaded[url] = await fetch(url, options);
            }
            return this.loaded[url];
        },
    };

    class WandboxCppRunner extends WandboxRunner {
        async run(sourceCode, input) {
            const allFiles = ["convolution", "dsu", "fenwicktree", "internal_bit", "internal_math", "internal_queue", "internal_scc", "internal_type_traits", "lazysegtree", "math", "maxflow", "mincostflow", "modint", "scc", "segtree", "string", "twosat"];
            const files = new Set(["all"].concat(allFiles).filter(file => new RegExp(String.raw`^#\s*include\s*<atcoder/${file}>`, "m").test(sourceCode)));
            let allHeaders = false;
            if (files.has("all")) {
                allHeaders = true;
                files.delete("all");
                for (const file of allFiles) {
                    files.add(file);
                }
            }

            if (files.has("convolution")) {
                files.add("modint");
            }
            if (files.has("convolution") || files.has("lazysegtree") || files.has("segtree")) {
                files.add("internal_bit");
            }
            if (files.has("maxflow")) {
                files.add("internal_queue");
            }
            if (files.has("scc") || files.has("twosat")) {
                files.add("internal_scc");
            }
            if (files.has("math") || files.has("modint")) {
                files.add("internal_math");
            }
            if (files.has("fenwicktree") || files.has("fenwicktree")) {
                files.add("internal_type_traits");
            }

            const ACLBase = "https://cdn.jsdelivr.net/gh/atcoder/ac-library/atcoder/";

            const codePromises = [];
            const codes = [];
            for (const file of files) {
                codePromises.push(fetch(ACLBase + file + ".hpp", {
                    mode: "cors",
                    cache: "force-cache",
                })
                    .then(r => r.text())
                    .then(code => codes.push({ file: "atcoder/" + file, code })));
            }
            if (allHeaders) {
                codePromises.push(fetch(ACLBase + "all", {
                    mode: "cors",
                    cache: "force-cache",
                })
                    .then(r => r.text())
                    .then(code => codes.push({ file: "atcoder/all", code })));
            }

            await Promise.all(codePromises);


            let options = this.options;
            if (typeof options == "function") options = options(sourceCode, input);
            return await this.request(JSON.stringify(Object.assign({
                compiler: this.name,
                code: sourceCode,
                stdin: input,
                codes,
                "compiler-option-raw": "-I.",
            }, options)));
        }
    }

    let waitAtCoderCustomTest = Promise.resolve();
    const AtCoderCustomTestBase = location.href.replace(/\/tasks\/.+$/, "/custom_test");
    const AtCoderCustomTestResultAPI = AtCoderCustomTestBase + "/json?reload=true";
    const AtCoderCustomTestSubmitAPI = AtCoderCustomTestBase + "/submit/json";
    class AtCoderRunner extends CodeRunner {
        constructor(languageId, label) {
            super(label, "AtCoder");
            this.languageId = languageId;
        }

        async run(sourceCode, input) {
            const promise = this.submit(sourceCode, input);
            waitAtCoderCustomTest = promise;
            return await promise;
        }

        async submit(sourceCode, input) {
            try {
                await waitAtCoderCustomTest;
            } catch (error) {
                console.error(error);
            }

            const error = await fetch(AtCoderCustomTestSubmitAPI, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: buildParams({
                    "data.LanguageId": this.languageId,
                    sourceCode,
                    input,
                    csrf_token: csrfToken,
                }),
            }).then(r => r.text());

            if (error) {
                throw new Error(error)
            }

            await sleep(100);

            for (;;) {
                const data = await fetch(AtCoderCustomTestResultAPI, {
                    method: "GET",
                    credentials: "include",
                }).then(r => r.json());

                if (!("Result" in data)) continue;
                const result = data.Result;

                if ("Interval" in data) {
                    await sleep(data.Interval);
                    continue;
                }

                return {
                    status: (result.ExitCode == 0) ? "OK" : (result.TimeConsumption == -1) ? "CE" : "RE",
                    exitCode: result.ExitCode,
                    execTime: result.TimeConsumption,
                    memory: result.MemoryConsumption,
                    stdout: data.Stdout,
                    stderr: data.Stderr,
                };
            }
        }
    }

    const runners = {
        4001: [new WandboxRunner("gcc-9.2.0-c", "C (GCC 9.2.0)")],
        4002: [new PaizaIORunner("c", "C (C17 / Clang 10.0.0)", )],
        4003: [new WandboxCppRunner("gcc-9.2.0", "C++ (GCC 9.2.0)", {options: "warning,boost-1.73.0-gcc-9.2.0,gnu++17"})],
        4004: [new WandboxCppRunner("clang-10.0.0", "C++ (Clang 10.0.0)", {options: "warning,boost-nothing-clang-10.0.0,c++17"})],
        4006: [new PaizaIORunner("python3", "Python (3.8.2)")],
        4007: [new PaizaIORunner("bash", "Bash (5.0.17)")],
        4010: [new WandboxRunner("csharp", "C# (.NET Core 6.0.100-alpha.1.20562.2)")],
        4011: [new WandboxRunner("mono-head", "C# (Mono-mcs 5.19.0.0)")],
        4013: [new PaizaIORunner("clojure", "Clojure (1.10.1-1)")],
        4017: [new PaizaIORunner("d", "D (LDC 1.23.0)")],
        4020: [new PaizaIORunner("erlang", "Erlang (10.6.4)")],
        4021: [new PaizaIORunner("elixir", "Elixir (1.10.4)")],
        4022: [new PaizaIORunner("fsharp", "F# (Interactive 4.0)")],
        4023: [new PaizaIORunner("fsharp", "F# (Interactive 4.0)")],
        4026: [new WandboxRunner("go-1.14.1", "Go (1.14.1)")],
        4027: [new WandboxRunner("ghc-head", "Haskell (GHC 8.7.20181121)")],
        4030: [new PaizaIORunner("javascript", "JavaScript (Node.js 12.18.3)")],
        4032: [new PaizaIORunner("kotlin", "Kotlin (1.4.0)")],
        4033: [new WandboxRunner("lua-5.3.4", "Lua (Lua 5.3.4)")],
        4034: [new WandboxRunner("luajit-head", "Lua (LuaJIT 2.1.0-beta3)")],
        4036: [new WandboxRunner("nim-1.0.6", "Nim (1.0.6)")],
        4037: [new PaizaIORunner("objective-c", "Objective-C (Clang 10.0.0)")],
        4039: [new WandboxRunner("ocaml-head", "OCaml (4.13.0+dev0-2020-10-19)")],
        4041: [new WandboxRunner("fpc-3.0.2", "Pascal (FPC 3.0.2)")],
        4042: [new PaizaIORunner("perl", "Perl (5.30.0)")],
        4044: [
            new PaizaIORunner("php", "PHP (7.4.10)"),
            new WandboxRunner("php-7.3.3", "PHP (7.3.3)"),
        ],
        4046: [new WandboxRunner("pypy-head", "PyPy2 (7.3.4-alpha0)")],
        4047: [new WandboxRunner("pypy-7.2.0-3", "PyPy3 (7.2.0)")],
        4049: [
            new WandboxRunner("ruby-head", "Ruby (HEAD 3.0.0dev)"),
            new PaizaIORunner("ruby", "Ruby (2.7.1)"),
            new WandboxRunner("ruby-2.7.0-preview1", "Ruby (2.7.0-preview1)"),
        ],
        4050: [
            new AtCoderRunner(4050, "Rust (1.42.0)"),
            new WandboxRunner("rust-head", "Rust (1.37.0-dev)"),
            new PaizaIORunner("rust", "Rust (1.43.0)"),
        ],
        4051: [new PaizaIORunner("scala", "Scala (2.13.3)")],
        4053: [new PaizaIORunner("scheme", "Scheme (Gauche 0.9.6)")],
        4055: [new PaizaIORunner("swift", "Swift (5.2.5)")],
        4056: [new CustomRunner("Text",
            async (sourceCode, input) => {
                return {
                    status: "OK",
                    exitCode: 0,
                    stdout: sourceCode,
                };
            }
        )],
        4058: [new PaizaIORunner("vb", "Visual Basic (.NET Core 4.0.1)")],
        4061: [new PaizaIORunner("cobol", "COBOL - Free (OpenCOBOL 2.2.0)")],
        4101: [new WandboxCppRunner("gcc-9.2.0", "C++ (GCC 9.2.0)")],
        4102: [new WandboxCppRunner("clang-10.0.0", "C++ (Clang 10.0.0)")],
    };

    for (const e of $selectAll("#select-lang option[value]")) {
        const languageId = e.value;
        if (!(languageId in runners)) runners[languageId] = [];
        if (runners[languageId].some(runner => runner instanceof AtCoderRunner)) continue;
        runners[languageId].push(new AtCoderRunner(languageId, e.textContent));
    }

    console.info("codeRunner OK");

    return {
        run(languageId, index, sourceCode, input, supposedOutput = null, options = { trim: true, split: true, }) {
            if (!(languageId in runners)) return Promise.reject("language not supported");
            return runners[languageId][index].test(sourceCode, input, supposedOutput, options);
        },

        getEnvironment(languageId) {
            if (!(languageId in runners)) return Promise.reject("language not supported");
            return Promise.resolve(runners[languageId].map(runner => runner.label));
        },
    };
})();


// -- bottom menu --
const bottomMenu = (function () {
    'use strict';

    const tabs = new Set();

    const bottomMenuKey = $(`<button id="bottom-menu-key" type="button" class="navbar-toggle collapsed glyphicon glyphicon-menu-down" data-toggle="collapse" data-target="#bottom-menu">`);
    const bottomMenuTabs = $(`<ul id="bottom-menu-tabs" class="nav nav-tabs">`);
    const bottomMenuContents = $(`<div id="bottom-menu-contents" class="tab-content">`);

    $(() => {
        const style = $create("style");
        style.textContent = `

#bottom-menu-wrapper {
    background: transparent;
    border: none;
    pointer-events: none;
    padding: 0;
}

#bottom-menu-wrapper>.container {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0;
}

#bottom-menu-wrapper>.container>.navbar-header {
    float: none;
}

#bottom-menu-key {
    display: block;
    float: none;
    margin: 0 auto;
    padding: 10px 3em;
    border-radius: 5px 5px 0 0;
    background: #000;
    opacity: 0.5;
    color: #FFF;
    cursor: pointer;
    pointer-events: auto;
    text-align: center;
}

@media screen and (max-width: 767px) {
    #bottom-menu-key {
        opacity: 0.25;
    }
}

#bottom-menu-key.collapsed:before {
    content: "\\e260";
}

#bottom-menu-tabs {
    padding: 3px 0 0 10px;
    cursor: n-resize;
}

#bottom-menu-tabs a {
    pointer-events: auto;
}

#bottom-menu {
    pointer-events: auto;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    max-height: unset;
}

#bottom-menu.collapse:not(.in) {
    display: none !important;
}

#bottom-menu-tabs>li>a {
    background: rgba(150, 150, 150, 0.5);
    color: #000;
    border: solid 1px #ccc;
    filter: brightness(0.75);
}

#bottom-menu-tabs>li>a:hover {
    background: rgba(150, 150, 150, 0.5);
    border: solid 1px #ccc;
    color: #111;
    filter: brightness(0.9);
}

#bottom-menu-tabs>li.active>a {
    background: #eee;
    border: solid 1px #ccc;
    color: #333;
    filter: none;
}

.bottom-menu-btn-close {
    font-size: 8pt;
    vertical-align: baseline;
    padding: 0 0 0 6px;
    margin-right: -6px;
}

#bottom-menu-contents {
    padding: 5px 15px;
    max-height: 50vh;
    overflow-y: auto;
}

#bottom-menu-contents .panel {
    color: #333;
}

`;
        document.head.appendChild(style);
        const bottomMenu = $(`<div id="bottom-menu" class="collapse navbar-collapse">`).append(bottomMenuTabs, bottomMenuContents);
        $(`<div id="bottom-menu-wrapper" class="navbar navbar-default navbar-fixed-bottom">`)
        .append($(`<div class="container">`)
            .append(
                $(`<div class="navbar-header">`).append(bottomMenuKey),
                bottomMenu))
        .appendTo("#main-div");

        let resizeStart = null;
        bottomMenuTabs.on({
            mousedown({target, pageY}) {
                if (target.id != "bottom-menu-tabs") return;
                resizeStart = {y: pageY, height: bottomMenuContents.height()};
            },
            mousemove(e) {
                if (!resizeStart) return;
                e.preventDefault();
                bottomMenuContents.height(resizeStart.height - (e.pageY - resizeStart.y));
            },
        });
        document.addEventListener("mouseup", () => { resizeStart = null; });
        document.addEventListener("mouseleave", () => { resizeStart = null; });
    });

    const menuController = {
        addTab(tabId, tabLabel, paneContent, options = {}) {
            console.log("addTab: %s (%s)", tabLabel, tabId, paneContent);
            const tab = $(`<a id="bottom-menu-tab-${tabId}" href="#" data-target="#bottom-menu-pane-${tabId}" data-toggle="tab">`)
            .click(e => {
                e.preventDefault();
                tab.tab("show");
            })
            .append(tabLabel);
            const tabLi = $(`<li>`).append(tab).appendTo(bottomMenuTabs);
            const pane = $(`<div class="tab-pane" id="bottom-menu-pane-${tabId}">`).append(paneContent).appendTo(bottomMenuContents);
            console.dirxml(bottomMenuContents);
            const controller = {
                close() {
                    tabLi.remove();
                    pane.remove();
                    tabs.delete(tab);
                    if (tabLi.hasClass("active") && tabs.size > 0) {
                        tabs.values().next().value.tab("show");
                    }
                },

                show() {
                    menuController.show();
                    tab.tab("show");
                },

                set color(color) {
                    tab.css("background-color", color);
                },
            };
            tabs.add(tab);
            if (options.closeButton) tab.append($(`<a class="bottom-menu-btn-close btn btn-link glyphicon glyphicon-remove">`).click(() => controller.close()));
            if (options.active || tabs.size == 1) pane.ready(() => tab.tab("show"));
            return controller;
        },

        show() {
            if (bottomMenuKey.hasClass("collapsed")) bottomMenuKey.click();
        },

        toggle() {
            bottomMenuKey.click();
        },
    };

    console.info("bottomMenu OK");

    return menuController;
})();

$(() => {
    // returns [{input, output, anchor}]
    function getTestCases() {
        const selectors = [
            "#task-statement p+pre.literal-block",
            "#task-statement pre.source-code-for-copy",
            "#task-statement .lang>*:nth-child(1) .div-btn-copy+pre",
            "#task-statement .div-btn-copy+pre",
            "#task-statement>.part pre.linenums",
            "#task-statement>.part>h3+section>pre",
            "#task-statement pre",
        ];

        for (const selector of selectors) {
            const e = $selectAll(selector);
            if (e.length == 0) continue;
            const testcases = [];
            for (let i = 0; i < e.length; i += 2) {
                testcases.push({
                    input: (e[i]||{}).textContent,
                    output: (e[i+1]||{}).textContent,
                    anchor: $(e[i]).closest(".part,.section").find("h3"),
                });
            }
            return testcases;
        }

        return [];
    }

    async function runTest(title, input, output = null) {
        const uid = Date.now().toString();
        title = title ? "Result " + title : "Result";
        const content = $create("div", { class: "container" });
        content.innerHTML = `
<div class="row">
    <div class="col-xs-12 ${(output == null) ? "" : "col-md-6"}"><div class="form-group">
        <label class="control-label col-xs-12" for="atcoder-easy-test-${uid}-stdin">Standard Input</label>
        <div class="col-xs-12">
            <textarea id="atcoder-easy-test-${uid}-stdin" class="form-control" rows="3" readonly></textarea>
        </div>
    </div></div>${(output == null) ? "" : `
    <div class="col-xs-12 col-md-6"><div class="form-group">
        <label class="control-label col-xs-12" for="atcoder-easy-test-${uid}-expected">Expected Output</label>
        <div class="col-xs-12">
            <textarea id="atcoder-easy-test-${uid}-expected" class="form-control" rows="3" readonly></textarea>
        </div>
    </div></div>
`}
</div>
<div class="row"><div class="col-sm-6 col-sm-offset-3">
        <div class="panel panel-default"><table class="table table-condensed">
            <tr>
                <th class="text-center">Exit Code</th>
                <th class="text-center">Exec Time</th>
                <th class="text-center">Memory</th>
            </tr>
            <tr>
                <td id="atcoder-easy-test-${uid}-exit-code" class="text-center"></td>
                <td id="atcoder-easy-test-${uid}-exec-time" class="text-center"></td>
                <td id="atcoder-easy-test-${uid}-memory" class="text-center"></td>
            </tr>
        </table></div>
</div></div>
<div class="row">
    <div class="col-xs-12 col-md-6"><div class="form-group">
        <label class="control-label col-xs-12" for="atcoder-easy-test-${uid}-stdout">Standard Output</label>
        <div class="col-xs-12">
            <textarea id="atcoder-easy-test-${uid}-stdout" class="form-control" rows="5" readonly></textarea>
        </div>
    </div></div>
    <div class="col-xs-12 col-md-6"><div class="form-group">
        <label class="control-label col-xs-12" for="atcoder-easy-test-${uid}-stderr">Standard Error</label>
        <div class="col-xs-12">
            <textarea id="atcoder-easy-test-${uid}-stderr" class="form-control" rows="5" readonly></textarea>
        </div>
    </div></div>
</div>
`;
        const tab = bottomMenu.addTab("easy-test-result-" + uid, title, content, { active: true, closeButton: true });
        $id(`atcoder-easy-test-${uid}-stdin`).value = input;
        if (output != null) $id(`atcoder-easy-test-${uid}-expected`).value = output;

        const options = { trim: true, split: true, };
        if ($id("atcoder-easy-test-allowable-error-check").checked) {
            options.allowableError = parseFloat($id("atcoder-easy-test-allowable-error").value);
        }

        const result = await codeRunner.run($select("#select-lang>select").value, +$id("atcoder-easy-test-language").value, window.getSourceCode(), input, output, options);

        if (result.status == "AC") {
            tab.color = "#dff0d8";
            $id(`atcoder-easy-test-${uid}-stdout`).style.backgroundColor = "#dff0d8";
        } else if (result.status != "OK") {
            tab.color = "#fcf8e3";
            if (result.status == "WA") $id(`atcoder-easy-test-${uid}-stdout`).style.backgroundColor = "#fcf8e3";
        }

        const eExitCode = $id(`atcoder-easy-test-${uid}-exit-code`);
        eExitCode.textContent = result.exitCode;
        eExitCode.classList.toggle("bg-success", result.exitCode == 0);
        eExitCode.classList.toggle("bg-danger", result.exitCode != 0);
        if ("execTime" in result) $id(`atcoder-easy-test-${uid}-exec-time`).textContent = result.execTime + " ms";
        if ("memory" in result) $id(`atcoder-easy-test-${uid}-memory`).textContent = result.memory + " KB";
        $id(`atcoder-easy-test-${uid}-stdout`).value = result.stdout || "";
        $id(`atcoder-easy-test-${uid}-stderr`).value = result.stderr || "";

        result.uid = uid;
        result.tab = tab;
        return result;
    }

    console.log("bottomMenu", bottomMenu);

    bottomMenu.addTab("easy-test", "Easy Test", $(`<form id="atcoder-easy-test-container" class="form-horizontal">`)
                      .html(`
<small style="position: absolute; display: block; bottom: 0; right: 0; padding: 1% 2%; width: 95%; text-align: right;">AtCoder Easy Test v${VERSION}</small>
<div class="row">
    <div class="col-xs-12 col-lg-8">
        <div class="form-group">
            <label class="control-label col-sm-2">Test Environment</label>
            <div class="col-sm-10">
                <select class="form-control" id="atcoder-easy-test-language"></select>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-sm-2" for="atcoder-easy-test-input">Standard Input</label>
            <div class="col-sm-10">
                <textarea id="atcoder-easy-test-input" name="input" class="form-control" rows="3"></textarea>
            </div>
        </div>
    </div>
    <div class="col-xs-12 col-lg-4">
        <div class="form-group">
            <label class="control-label col-sm-2" for="atcoder-easy-test-allowable-error-check">Allowable Error</label>
            <div class="col-sm-10">
                <div class="input-group">
                    <span class="input-group-addon">
                        <input id="atcoder-easy-test-allowable-error-check" type="checkbox" checked>
                    </span>
                    <input id="atcoder-easy-test-allowable-error" type="text" class="form-control" value="1e-6">
                </div>
            </div>
        </div>
        <div class="form-group">
            <label class="control-label col-sm-2" for="atcoder-easy-test-output">Expected Output</label>
            <div class="col-sm-10">
                <textarea id="atcoder-easy-test-output" name="output" class="form-control" rows="3"></textarea>
            </div>
        </div>
    </div>
    <div class="col-xs-12">
        <div class="col-xs-11 col-xs-offset=1">
            <div class="form-group">
                 <a id="atcoder-easy-test-run" class="btn btn-primary">Run</a>
            </div>
        </div>
    </div>
</div>
<style>
#atcoder-easy-test-language {
    border: none;
    background: transparent;
    font: inherit;
    color: #fff;
}
#atcoder-easy-test-language option {
    border: none;
    color: #333;
    font: inherit;
}
</style>
`).ready(() => {
    $id("atcoder-easy-test-run").addEventListener("click", () => {
        const title = "";
        const input = $id("atcoder-easy-test-input").value;
        const output = $id("atcoder-easy-test-output").value;
        runTest(title, input, output || null);
    });
    $("#select-lang>select").change(() => setLanguage()); //NOTE: This event is only for jQuery; do not replce with Vanilla
    $id("atcoder-easy-test-allowable-error").disabled = this.checked;
    $id("atcoder-easy-test-allowable-error-check").addEventListener("change", e => { $id("atcoder-easy-test-allowable-error").disabled = !e.target.checked; });

    async function setLanguage() {
        const languageId = $select("#select-lang>select").value;
        const eTestLanguage = $id("atcoder-easy-test-language");
        while (eTestLanguage.firstChild) eTestLanguage.removeChild(eTestLanguage.firstChild);
        try {
            const labels = await codeRunner.getEnvironment(languageId);
            console.log(`language: ${labels[0]} (${languageId})`);
            labels.forEach((label, index) => {
                const option = $create("option", {value: index});
                option.textContent = label;
                eTestLanguage.appendChild(option);
            });
            $id("atcoder-easy-test-run").classList.remove("disabled");
            $id("atcoder-easy-test-btn-test-all").disabled = false;
        } catch (error) {
            console.log(`language: ? (${languageId})`);
            const option = $create("option", { "class": "fg-danger" });
            option.textContent = error;
            eTestLanguage.appendChild(option);
            $id("atcoder-easy-test-run").classList.add("disabled");
            $id("atcoder-easy-test-btn-test-all").disabled = true;
        }
    }

    setLanguage();
}), { active: true });

    const testfuncs = [];
    const runButtons = [];

    const testcases = getTestCases();
    for (const {input, output, anchor} of testcases) {
        const testfunc = async () => {
            const title = anchor[0].childNodes[0].data;
            const result = await runTest(title, input, output);
            if (result.status == "OK" || result.status == "AC") {
                $id(`atcoder-easy-test-${result.uid}-stdout`).classList.add("bg-success");
            }
            return result;
        };
        testfuncs.push(testfunc);

        const runButton = $(`<a class="btn btn-primary btn-sm" style="vertical-align: top; margin-left: 0.5em">`)
        .text("Run")
        .click(async () => {
            await testfunc();
            if ($id("bottom-menu-key").classList.contains("collapsed")) $id("bottom-menu-key").click();
        });
        anchor.append(runButton);
        runButtons.push(runButton);
    }

    const testAllResultRow = $(`<div class="row">`);
    const testAllButton = $(`<a id="atcoder-easy-test-btn-test-all" class="btn btn-default btn-sm" style="margin-left: 5px" title="Alt+Enter" data-toggle="tooltip">`)
    .text("Test All Samples")
    .click(async () => {
        if (testAllButton.attr("disabled")) throw new Error("Button is disabled");
        const statuses = testfuncs.map(_ => $(`<div class="label label-default" style="margin: 3px">`).text("WJ..."));
        const progress = $(`<div class="progress-bar">`).text(`0 / ${testfuncs.length}`);
        let finished = 0;
        const closeButton = $(`<button type="button" class="close" data-dismiss="alert" aria-label="close">`)
        .append($(`<span aria-hidden="true">`).text("\xd7"));
        const resultAlert = $(`<div class="alert alert-dismissible">`)
        .append(closeButton)
        .append($(`<div class="progress">`).append(progress))
        .append(...statuses)
        .appendTo(testAllResultRow);
        const results = await Promise.all(testfuncs.map(async (testfunc, i) => {
            const result = await testfunc();
            finished++;
            progress.text(`${finished} / ${statuses.length}`).css("width", `${finished/statuses.length*100}%`);
            statuses[i].toggleClass("label-success", result.status == "AC").toggleClass("label-warning", result.status != "AC").text(result.status).click(() => result.tab.show()).css("cursor", "pointer");
            return result;
        }));
        if (results.every(({status}) => status == "AC")) {
            resultAlert.addClass("alert-success");
        } else {
            resultAlert.addClass("alert-warning");
        }
        closeButton.click(() => {
            for (const {tab} of results) {
                tab.close();
            }
        });
    });
    $("#submit").after(testAllButton).closest("form").append(testAllResultRow);
    document.addEventListener("keydown", e => {
        if (e.altKey) {
            switch (e.key) {
                case "Enter":
                    testAllButton.click();
                    break;
                case "Escape":
                    bottomMenu.toggle();
                    break;
            }
        }
    });

    console.info("view OK");
});

})();
