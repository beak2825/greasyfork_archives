// ==UserScript==
// @name         yukicoder Easy Test
// @namespace    http://yukicoder.me/
// @version      0.1.1
// @description  Make testing sample cases easy
// @author       magurofly
// @match        https://yukicoder.me/problems/no/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416485/yukicoder%20Easy%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/416485/yukicoder%20Easy%20Test.meta.js
// ==/UserScript==

// This script uses variables from page below:
// * `$`
// * `ace`

// This scripts consists of three modules:
// * bottom menu
// * code runner
// * view

(function script() {

const VERSION = "0.1.0";

if (typeof unsafeWindow !== "undefined") {
    console.log(unsafeWindow);
    unsafeWindow.eval(`(${script})();`);
    console.log("Script run in unsafeWindow");
    return;
}
const $ = window.$;
const getSourceCode = window.getSourceCode;
const csrfToken = window.csrfToken;

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
            this.label = site ? `${label} [${site}]` : label;
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

            if (equals(output, supposedOutput)) {
                result.status = "AC";
            } else {
                result.status = "WA";
            }

            return result;
        }
    }

    class WandboxRunner extends CodeRunner {
        constructor(name, label, options = {}) {
            super(label, "Wandbox");
            this.name = name;
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

    class CustomRunner extends CodeRunner {
        constructor(label, fn) {
            super(label, null);
            this.fn = fn;
        }

        async run(sourceCode, input) {
            return this.fn(sourceCode, input);
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

    const runners = {
        cpp14: [new WandboxRunner("gcc-10.1.0", "C++14 (gcc 10.1.0 + boost 1.73.0)", {options: "warning,boost-1.73.0-gcc-10.1.0,c++14,cpp-no-pedantic"})],
        cpp17: [new WandboxRunner("gcc-10.1.0", "C++17 (gcc 10.1.0 + boost 1.73.0)", {options: "warning,boost-1.73.0-gcc-10.1.0,c++17,cpp-no-pedantic"})],
        "cpp-clang": [
            new WandboxRunner("clang-7.0.0", "C++17 (clang 7.0.0 &#43; boost 1.73.0)", {options: "warning,boost-1.73.0-gcc-10.1.0,c++17,cpp-no-pedantic"}),
            new PaizaIORunner("c", "C (C17 / Clang 10.0.0)"),
        ],
        cpp17: [new WandboxRunner("gcc-4.8.5", "C++11 (gcc 4.8.5)", {options: "warning,boost-nothing-gcc-4.8.5,c++11,cpp-no-pedantic"})],
        c11: [new WandboxRunner("gcc-10.1.0-c", "C (gcc 10.1.0)", {options: "warning,c11,cpp-no-pedantic"})],
        c: [new WandboxRunner("gcc-4.8.5-c", "C99 (gcc 4.8.5)", {options: "warning,c99,cpp-no-pedantic"})],
        java8: [new WandboxRunner("openjdk-jdk-11+28", "Java11 (openjdk 11.0.7)")],
        csharp: [new WandboxRunner("csharp", "C# (.NET Core 6.0.100-alpha.1.20562.2)")],
        csharp_mono: [new WandboxRunner("csharp", "C# (.NET Core 6.0.100-alpha.1.20562.2)")],
        perl: [new WandboxRunner("perl-5.18.4", "Perl (5.18.4)")],
        // perl6: ?,
        php: [new WandboxRunner("php-5.5.6", "PHP (5.5.6)")],
        php7: [new WandboxRunner("php-7.3.3", "PHP7 (7.3.3)")],
        python3: [new WandboxRunner("cpython-3.8.0", "Python3 (3.8.0)")],
        pypy2: [new WandboxRunner("pypy-head", "PyPy2 (7.3.4-alpha0)")],
        pypy3: [new WandboxRunner("pypy-7.2.0-3", "PyPy2 (7.2.0)")],
        ruby: [
            new PaizaIORunner("ruby", "Ruby (2.7.1)"),
            new WandboxRunner("ruby-2.7.0-preview1", "Ruby (2.7.0-preview1)"),
        ],
        d: [new WandboxRunner("dmd-head", "D (dmd 2.0.87.0)")],
        go: [new WandboxRunner("go-1.14-2", "Go (1.14.2)")],
        haskell: [new WandboxRunner("ghc-head", "Haskell (8.7.20181121)")],
        scala: [new WandboxRunner("scala-2.13.x", "Scala (2.13.x)")],
        nim: [new WandboxRunner("nim-1.2.0", "Nim (1.2.0)")],
        rust: [new WandboxRunner("rust-head", "Rust (1.37.0-dev)")],
        // kotlin: ?,
        // scheme: ?,
        crystal: [new WandboxRunner("crystal-0.24.1", "Crystal (0.24.1)")],
        swift: [new WandboxRunner("swift-head", "Swift (5.3-dev)")],
        ocaml: [new WandboxRunner("ocaml-4.05.0", "OCaml (4.05.0)", {options: "ocaml-core"})],
        // clojure: [new WandboxRunner("", "")],
        fsharp: [new WandboxRunner("fsharp-4.1.34", "F# (4.1.34)")],
        elixir: [new WandboxRunner("elixir-head", "Elixir (1.12.0-dev)")],
        lua: [new WandboxRunner("luajit-2.0.5", "Lua (LuaJIT 2.0.5)")],
        // fortran: ?,
        node: [new WandboxRunner("nodejs-14.0.0", "JavaScript (Node.js v14.0.0)")],
        typescript: [new WandboxRunner("typescript-3.9.5", "TypeScript (typescript 3.9.5)")],
        lisp: [new WandboxRunner("sbcl-1.3.18", "Common Lisp (sbcl 1.3.18)")],
        // kuin: ?,
        // kuinexe: ?,
        vim: [new WandboxRunner("vim-head", "Vim script (v8.2.2017)")],
        sh: [new WandboxRunner("bash", "Bash (Bash 4.3.48(1)-release)")],
        // nasm: ?,
        // clay: ?,
        // bf: ?,
        // Whitespace: ?,
        text: [new CustomRunner("Text", (sourceCode, input) => ({
            status: "OK",
            exitCode: 0,
            stdout: sourceCode,
        }))],
    };

    console.info("codeRunner OK");

    return {
        run(languageId, index, sourceCode, input, supposedOutput = null, options = { trim: true, split: true, }) {
            if (!(languageId in runners)) {
                return Promise.reject("language not supported");
            }
            return runners[languageId][index].test(sourceCode, input, supposedOutput, options);
        },

        getEnvironment(languageId) {
            if (!(languageId in runners)) {
                return Promise.reject("language not supported");
            }
            return Promise.resolve(runners[languageId].map(runner => runner.label));
        },
    };
})();


// -- bottom menu --
const bottomMenu = (function () {
    'use strict';

    const tabs = new Set();

    const bottomMenuKey = $(`<button id="bottom-menu-key" type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bottom-menu">`);
    const bottomMenuTabs = $(`<ul id="bottom-menu-tabs" class="nav nav-tabs">`);
    const bottomMenuContents = $(`<div id="bottom-menu-contents" class="tab-content">`);

    $(() => {
        $(`<style>`)
            .text(`

#bottom-menu-wrapper {
    background: transparent;
    border: none;
    pointer-events: none;
    padding: 0;
    font-size: 10pt;
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
    opacity: 0.85;
    color: #FFF;
    cursor: pointer;
    pointer-events: auto;
    text-align: center;
    font-size: 12pt;
}

#bottom-menu-key:before {
    content: "▽";
}

#bottom-menu-key.collapsed:before {
    content: "△";
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
    background: rgba(100, 100, 100, 0.5);
    border: solid 1px #ccc;
    color: #fff;
}

#bottom-menu-tabs>li>a:hover {
    background: rgba(150, 150, 150, 0.5);
    border: solid 1px #ccc;
    color: #333;
}

#bottom-menu-tabs>li.active>a {
    background: #eee;
    border: solid 1px #ccc;
    color: #333;
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

`)
            .appendTo("head");
        const bottomMenu = $(`<div id="bottom-menu" class="collapse navbar-collapse">`).append(bottomMenuTabs, bottomMenuContents);
        $(`<div id="bottom-menu-wrapper" class="navbar navbar-default navbar-fixed-bottom">`)
        .append($(`<div class="container">`)
            .append(
                $(`<div class="navbar-header">`).append(bottomMenuKey),
                bottomMenu))
        .appendTo("#body");

        let resizeStart = null;
        bottomMenuTabs.on({
            mousedown({target, pageY}) {
                if (!$(target).is("#bottom-menu-tabs")) return;
                resizeStart = {y: pageY, height: bottomMenuContents.height()};
            },
            mousemove(e) {
                if (!resizeStart) return;
                e.preventDefault();
                bottomMenuContents.height(resizeStart.height - (e.pageY - resizeStart.y));
            },
        });
        $(document).on({
            mouseup() {
                resizeStart = null;
            },
            mouseleave() {
                resizeStart = null;
            },
        });
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
                }
            };
            tabs.add(tab);
            if (options.closeButton) tab.append($(`<a class="bottom-menu-btn-close btn btn-link glyphicon glyphicon-remove">`).click(() => controller.close()));
            if (options.active || tabs.size == 1) pane.ready(() => tab.tab("show"));
            return controller;
        },

        show() {
            if (bottomMenuKey.hasClass("collapsed")) bottomMenuKey.click();
        },
    };

    console.info("bottomMenu OK");

    return menuController;
})();

$(() => {
    // external elements
    const E = {
        lang: $("#lang"),
        editor: ace.edit("rich_source"),
        sourceObject: $("#source"),
        sample: $(".sample"),
    };

    function getSourceCode() {
        if (E.sourceObject.is(":visible")) return E.sourceObject.val();
        return E.editor.getSession().getValue();
    }

    async function runTest(title, input, output = null) {
        const uid = Date.now().toString();
        title = title ? "Result " + title : "Result";
        const content = $(`<div class="container">`)
        .html(`
<div class="row"><div class="form-group">
    <label class="control-label col-sm-2" for="yukicoder-easy-test-${uid}-stdin">Standard Input</label>
    <div class="col-sm-8">
        <textarea id="yukicoder-easy-test-${uid}-stdin" class="form-control" rows="5" readonly></textarea>
    </div>
</div></div>
<div class="row"><div class="col-sm-4 col-sm-offset-4">
        <div class="panel panel-default"><table class="table table-bordered">
            <tr id="yukicoder-easy-test-${uid}-row-exit-code">
                <th class="text-center">Exit Code</th>
                <td id="yukicoder-easy-test-${uid}-exit-code" class="text-right"></td>
            </tr>
            <tr id="yukicoder-easy-test-${uid}-row-exec-time">
                <th class="text-center">Exec Time</th>
                <td id="yukicoder-easy-test-${uid}-exec-time" class="text-right"></td>
            </tr>
            <tr id="yukicoder-easy-test-${uid}-row-memory">
                <th class="text-center">Memory</th>
                <td id="yukicoder-easy-test-${uid}-memory" class="text-right"></td>
            </tr>
        </table></div>
</div></div>
<div class="row"><div class="form-group">
    <label class="control-label col-sm-2" for="yukicoder-easy-test-${uid}-stdout">Standard Output</label>
    <div class="col-sm-8">
        <textarea id="yukicoder-easy-test-${uid}-stdout" class="form-control" rows="5" readonly></textarea>
    </div>
</div></div>
<div class="row"><div class="form-group">
    <label class="control-label col-sm-2" for="yukicoder-easy-test-${uid}-stderr">Standard Error</label>
    <div class="col-sm-8">
        <textarea id="yukicoder-easy-test-${uid}-stderr" class="form-control" rows="5" readonly></textarea>
    </div>
</div></div>
`);
        const tab = bottomMenu.addTab("easy-test-result-" + uid, title, content, { active: true, closeButton: true });
        $(`#yukicoder-easy-test-${uid}-stdin`).val(input);

        const options = { trim: true, split: true, };
        if ($("#yukicoder-easy-test-allowable-error-check").prop("checked")) {
            options.allowableError = parseFloat($("#yukicoder-easy-test-allowable-error").val());
        }

        const lang = E.lang.val();
        const result = await codeRunner.run(lang, +$("#yukicoder-easy-test-language").val(), getSourceCode(), input, output, options);

        $(`#yukicoder-easy-test-${uid}-row-exit-code`).toggleClass("bg-danger", result.exitCode != 0).toggleClass("bg-success", result.exitCode == 0);
        $(`#yukicoder-easy-test-${uid}-exit-code`).text(result.exitCode);
        if ("execTime" in result) $(`#yukicoder-easy-test-${uid}-exec-time`).text(result.execTime + " ms");
        if ("memory" in result) $(`#yukicoder-easy-test-${uid}-memory`).text(result.memory + " KB");
        $(`#yukicoder-easy-test-${uid}-stdout`).val(result.stdout);
        $(`#yukicoder-easy-test-${uid}-stderr`).val(result.stderr);

        result.uid = uid;
        result.tab = tab;
        return result;
    }

    console.log("bottomMenu", bottomMenu);

    bottomMenu.addTab("easy-test", "Easy Test", $(`<form id="yukicoder-easy-test-container" class="form-horizontal">`)
                      .html(`
<small style="position: absolute; bottom: 0; right: 0;">yukicoder Easy Test v${VERSION}</small>
<div class="row">
    <div class="col-12 col-md-10">
        <div class="form-group">
            <label class="control-label col-sm-2">Test Environment</label>
            <div class="col-sm-8">
                <select class="form-control" id="yukicoder-easy-test-language"></select>
                <!--input id="yukicoder-easy-test-language" type="text" class="form-control" readonly-->
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12 col-md-10">
        <div class="form-group">
            <label class="control-label col-sm-2" for="yukicoder-easy-test-allowable-error-check">Allowable Error</label>
            <div class="col-sm-8">
                <div class="input-group">
                    <span class="input-group-addon">
                        <input id="yukicoder-easy-test-allowable-error-check" type="checkbox" checked>
                    </span>
                    <input id="yukicoder-easy-test-allowable-error" type="text" class="form-control" value="1e-6">
                </div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col-12 col-md-10">
        <div class="form-group">
            <label class="control-label col-sm-2" for="yukicoder-easy-test-input">Standard Input</label>
            <div class="col-sm-8">
                <textarea id="yukicoder-easy-test-input" name="input" class="form-control" rows="5"></textarea>
            </div>
        </div>
    </div>
    <div class="col-12 col-md-4">
        <label class="control-label col-sm-2"></label>
        <div class="form-group">
            <div class="col-sm-8">
                 <a id="yukicoder-easy-test-run" class="btn btn-primary">Run</a>
            </div>
        </div>
    </div>
</div>
<style>
#yukicoder-easy-test-language {
    border: none;
    background: transparent;
    font: inherit;
    color: #fff;
}
#yukicoder-easy-test-language option {
    border: none;
    color: #333;
    font: inherit;
}
</style>
`).ready(() => {
    $("#yukicoder-easy-test-run").click(() => runTest("", $("#yukicoder-easy-test-input").val()));
    E.lang.on("change", () => setLanguage());
    $("#yukicoder-easy-test-allowable-error").attr("disabled", this.checked);
    $("#yukicoder-easy-test-allowable-error-check").on("change", function () {
        $("#yukicoder-easy-test-allowable-error").attr("disabled", !this.checked);
    });

    function setLanguage() {
        const languageId = E.lang.val();
        codeRunner.getEnvironment(languageId).then(labels => {
            console.log(`language: ${labels[0]} (${languageId})`);
            $("#yukicoder-easy-test-language").css("color", "#fff").empty().append(labels.map((label, index) => $(`<option>`).val(index).text(label)));
            $("#yukicoder-easy-test-run").removeClass("disabled");
            $("#yukicoder-easy-test-btn-test-all").attr("disabled", false);
        }, error => {
            console.log(`language: ? (${languageId})`);
            $("#yukicoder-easy-test-language").css("color", "#f55").empty().append($(`<option>`).text(error));
            $("#yukicoder-easy-test-run").addClass("disabled");
            $("#yukicoder-easy-test-btn-test-all").attr("disabled", true);
        });
    }

    setLanguage();
}), { active: true });

    const testfuncs = [];

    for (const sample of E.sample) {
        const title = $(sample).find("h5").text();
        const [input, output] = $(sample).find("pre");
        const testfunc = async () => {
            const result = await runTest(title, input.textContent, output.textContent);
            if (result.status == "OK" || result.status == "AC") {
                $(`#yukicoder-easy-test-${result.uid}-stdout`).addClass("bg-success");
            }
            return result;
        };
        testfuncs.push(testfunc);

        const runButton = $(`<a class="btn btn-primary btn-sm" style="margin-left: 0.5em">`)
        .text("Run")
        .click(async () => {
            await testfunc();
            if ($("#bottom-menu-key").hasClass("collapsed")) $("#bottom-menu-key").click();
        });
        $(sample).find(".copy-sample-input").after(runButton);
    }

    const testAllResultRow = $(`<div class="row">`);
    const testAllButton = $(`<a id="yukicoder-easy-test-btn-test-all" class="btn btn-default btn-sm" style="margin-left: 5px">`)
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
    $("#submit_form input[type='submit']").after(testAllButton).closest("form").append(testAllResultRow);

    console.info("view OK");
});

})();