// ==UserScript==
// @name            AtCoder Better Highlighter
// @name:en         AtCoder Better Highlighter
// @namespace       https://shouth.net/
// @version         0.5.4
// @description     highlight.jsを使用してAtCoderの提出コードの表示を置き換えるUserScriptです．
// @description:en  Better syntax highlighting for AtCoder using highlight.js.
// @author          shouth
// @resource        css https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/styles/default.min.css
// @require         https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/highlight.min.js
// @include         /^https:\/\/atcoder\.jp\/contests\/[^\/]+\/submissions\/[0-9]+
// @grant           GM_addStyle
// @grant           GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/412865/AtCoder%20Better%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/412865/AtCoder%20Better%20Highlighter.meta.js
// ==/UserScript==

(async () => {
    'use strict';
    const getHighlightName = (str) => {
        switch (str) {
            case "Ada2012": return "ada";
            case "Awk": return "awk";
            case "Bash": return "bash";
            case "Brainfuck": return "brainfuck";
            case "C": return "c";
            case "C#": return "csharp";
            case "C++": return "cpp";
            case "C++14": return "cpp";
            case "COBOL - Fixed": return "";
            case "COBOL - Free": return "";
            case "Clojure": return "clojure";
            case "Common Lisp": return "lisp";
            case "Crystal": return "crystal";
            case "Cython": return "python";
            case "D": return "d";
            case "Dart": return "dart";
            case "Dash": return "";
            case "Elixir": return "elixir";
            case "Erlang": return "erlang";
            case "F#": return "fsharp";
            case "Forth": return "";
            case "Fortran": return "fortran";
            case "Go": return "go";
            case "Haskell": return "haskell";
            case "Haxe": return "haxe";
            case "Java": return "java";
            case "JavaScript": return "javascript";
            case "Julia": return "julia";
            case "Kotlin": return "kotlin";
            case "Lua": return "lua";
            case "Nim": return "nimrod";
            case "OCaml": return "ocaml";
            case "Objective-C": return "objectivec";
            case "Octave": return "";
            case "PHP": return "php";
            case "Pascal": return "pascal";
            case "Perl": return "perl";
            case "Prolog": return "prolog";
            case "PyPy2": return "python";
            case "PyPy3": return "python";
            case "Python": return "python";
            case "Racket": return "";
            case "Raku": return "";
            case "Ruby": return "ruby";
            case "Rust": return "rust";
            case "Scala": return "scala";
            case "Scheme": return "scheme";
            case "Sed": return "";
            case "Standard ML": return "sml";
            case "Swift": return "swift";
            case "Text": return "";
            case "TypeScript": return "typescript";
            case "Unlambda": return "";
            case "Vim": return "vim";
            case "Visual Basic": return "vbnet";
            case "Zsh": return "";
            case "bc": return "";
            case "dc": return "";
            default: return "";
        }
    };

    const lang = Array.from(document.querySelectorAll("tr"))
        .find(e => [ "言語", "Languages" ].includes(e.children[0]?.textContent));
    const result = /.+(?= \(.+\))/g.exec(lang?.children[1]?.textContent);
    const name = result ? getHighlightName(result[0]) : "";

    if (!name) return;
    if (!hljs.getLanguage(name)) {
        // const response = await fetch(`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.2/languages/${name}.min.js`);
        // eval(await response.text());
        return;
    }

    GM_addStyle(GM_getResourceText("css"));
    const style = document.createElement("style");
    style.textContent = `
    .submission-code {
        padding: 0 !important;
    }

    .line-number {
        padding: 0 10px;
        width: 50px;
        text-align: right;
    }

    .line-number::before {
        opacity: 0.3;
        content: attr(data-line-number);
    }

    .line {
        padding: 0 10px;
    }

    .lines {
        width: 100%;
    }
    `
    document.head.append(style);

    const original = document.querySelector("#for_copy0").textContent;
    const lines = hljs.highlight(name, original, true).value.split("\n");
    const code = lines.map((e, i) => `
    <tr>
        <td class="line-number" data-line-number=${i + 1}></td>
        <td class="line">${e}</td>
    </tr>
    `)
    .join("\n");

    const pre = document.createElement("pre");
    pre.id = "submission-code";
    pre.className = "submission-code";
    pre.innerHTML = `<table class="hljs lines"><tbody>${code}<tbody></table>`

    const sub = document.querySelector("#submission-code");
    sub.parentNode.replaceChild(pre, sub);
})();