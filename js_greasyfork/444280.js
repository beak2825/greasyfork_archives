// ==UserScript==
// @name    AtCoder Beautiful Code View
// @namespace    http://tampermonkey.net/
// @version    0.3
// @description    AtCoderの提出コードをMonaco Editorを使用した表示にします
// @author     Chippppp
// @license    MIT
// @match    https://atcoder.jp/contests/*/submissions/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/444280/AtCoder%20Beautiful%20Code%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/444280/AtCoder%20Beautiful%20Code%20View.meta.js
// ==/UserScript==

"use strict";

(function() {
    // 対応言語
    const  languages = new Set(["plaintext", "abap", "apex", "azcli", "bat", "bicep", "cameligo", "clojure", "coffeescript", "c", "cpp", "csharp", "csp", "css", "dart", "dockerfile", "ecl", "elixir", "flow9", "fsharp", "freemarker2", "freemarker2.tag-angle.interpolation-dollar", "freemarker2.tag-bracket.interpolation-dollar", "freemarker2.tag-angle.interpolation-bracket", "freemarker2.tag-bracket.interpolation-bracket", "freemarker2.tag-auto.interpolation-dollar", "freemarker2.tag-auto.interpolation-bracket", "go", "graphql", "handlebars", "hcl", "html", "ini", "java", "javascript", "julia", "kotlin", "less", "lexon", "lua", "liquid", "m3", "markdown", "mips", "msdax", "mysql", "objective-c", "pascal", "pascaligo", "perl", "pgsql", "php", "pla", "postiats", "powerquery", "powershell", "proto", "pug", "python", "qsharp", "r", "razor", "redis", "redshift", "restructuredtext", "ruby", "rust", "sb", "scala", "scheme", "scss", "shell", "sol", "aes", "sparql", "sql", "st", "swift", "systemverilog", "verilog", "tcl", "twig", "typescript", "vb", "xml", "yaml", "json"]);

    // 言語名を取得
    let lang = document.getElementsByClassName("text-center")[3].innerText;
    lang = lang.slice(0, lang.indexOf(" ")).toLocaleLowerCase().replace("#", "sharp");
    if (lang.startsWith("pypy")) lang = "python";
    else if (lang == "c++") lang = "cpp";

    // 非対応言語の場合終了
    if (!languages.has(lang)) return;

    // Monaco Editor in cdnjs
    // Copyright (c) 2016 - present Microsoft Corporation
    let script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs/loader.min.js";
    document.head.prepend(script);

    // 元のエディターを非表示
    let header = document.createElement("script");
    header.innerHTML = `
        document.getElementsByClassName("linenums")[0].style.display = "none";
        document.getElementsByClassName("btn-text toggle-btn-text source-code-expand-btn")[0].style.display = "none";
        document.getElementsByClassName("btn-copy btn-pre")[0].style.zIndex = "1";
        document.getElementsByClassName("btn-copy btn-pre")[0].style.borderRadius = "0";
        document.getElementsByClassName("btn-copy btn-pre")[1].style.zIndex = "1";
        document.getElementsByClassName("btn-copy btn-pre")[1].style.borderRadius = "0";
    `
    document.head.prepend(header);

    // 新しいエディターの作成
    let div = document.createElement("div");
    div.style.marginTop = "10px";
    div.style.marginBottom = "30px";
    document.getElementById("submission-code").after(div);

    // コードを取得
    let str = document.getElementById("for_copy0").innerText;

    // 行数を取得
    let cnt;
    let arr = str.match(/\n/g);
    if (arr == null) cnt = 0;
    else cnt = arr.length;
    console.log(cnt);
    div.style.height = Math.min(510, (cnt + 1) * 21 + 6).toString() + "px";

    // Monaco Editorがロードされたらエディターを色付けする
    script.onload = function() {
        require.config({ paths: { "vs": "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs" } });

        require(["vs/editor/editor.main"], function() {
              monaco.editor.create(div, {
                  value: str,
                  language: lang,
                  theme: "vs-dark",
                  readOnly: true,
                  lineHeight: 21,
              });
            document.getElementsByClassName("monaco-editor")[0].style.paddingTop = "20px";
        });
    };
})();