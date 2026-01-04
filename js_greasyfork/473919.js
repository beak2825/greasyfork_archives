// ==UserScript==
// @name    AtCoder Ace Editor Editorial
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description    AtCoderの解説をAce Editorに変換します
// @author    Chippppp
// @license    MIT
// @match    https://atcoder.jp/contests/*/editorial*
// @downloadURL https://update.greasyfork.org/scripts/473919/AtCoder%20Ace%20Editor%20Editorial.user.js
// @updateURL https://update.greasyfork.org/scripts/473919/AtCoder%20Ace%20Editor%20Editorial.meta.js
// ==/UserScript==

(() => {
    "use strict";

    window.addEventListener("load", () => {
        let aceEditor = document.createElement("script");
        aceEditor.src = "https://cdnjs.cloudflare.com/ajax/libs/ace/1.24.1/ace.min.js";
        document.head.prepend(aceEditor);
        aceEditor.addEventListener("load", () => {
            let observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => mutation.addedNodes.forEach(e => main(e)));
            });
            const config = {
                childList: true,
                subtree: true
            };
            observer.observe(document, config);
            main(document);

            function main(subject) {
                let codes = Array.from(subject.getElementsByClassName("prettyprint linenums prettyprinted"));
                for (let code of codes) {
                    let txt = code.innerText;
                    code.className = "";
                    code.innerHTML = "";
                    let commonOptions = {
                        tabSize: 2,
                        useWorker: false,
                        newLineMode: "unix",
                        printMargin: false,
                        copyWithEmptySelection: true,
                        fixedWidthGutter: true,
                    };
                    let options = getLS("ace-options");
                    let editor = ace.edit(code, commonOptions);
                    if (options) {
                        delete options.readOnly;
                        delete options.maxLines;
                        delete options.newLineMode;
                        delete options.mode;
                        editor.setOptions(options);
                    }
                    editor.setOptions({
                        readOnly: true,
                        maxLines: Infinity,
                        mode: "ace/mode/c_cpp"
                    });
                    editor.commands.addCommand({
                        Name : "prevent ctrl+s",
                        bindKey: { win : "Ctrl-S", mac : "Command-S"},
                        exec: () => {}
                    });
                    editor.setValue(txt, -1);

                    let selectMode = document.createElement("select");
                    selectMode.innerHTML = '<option value="ace/mode/abap">ABAP</option><option value="ace/mode/abc">ABC</option><option value="ace/mode/actionscript">ActionScript</option><option value="ace/mode/ada">ADA</option><option value="ace/mode/alda">Alda</option><option value="ace/mode/apache_conf">Apache Conf</option><option value="ace/mode/apex">Apex</option><option value="ace/mode/aql">AQL</option><option value="ace/mode/asciidoc">AsciiDoc</option><option value="ace/mode/asl">ASL</option><option value="ace/mode/assembly_x86">Assembly x86</option><option value="ace/mode/autohotkey">AutoHotkey / AutoIt</option><option value="ace/mode/batchfile">BatchFile</option><option value="ace/mode/c_cpp" selected>C and C++</option><option value="ace/mode/c9search">C9Search</option><option value="ace/mode/cirru">Cirru</option><option value="ace/mode/clojure">Clojure</option><option value="ace/mode/cobol">Cobol</option><option value="ace/mode/coffee">CoffeeScript</option><option value="ace/mode/coldfusion">ColdFusion</option><option value="ace/mode/crystal">Crystal</option><option value="ace/mode/csharp">C#</option><option value="ace/mode/csound_document">Csound Document</option><option value="ace/mode/csound_orchestra">Csound</option><option value="ace/mode/csound_score">Csound Score</option><option value="ace/mode/css">CSS</option><option value="ace/mode/curly">Curly</option><option value="ace/mode/d">D</option><option value="ace/mode/dart">Dart</option><option value="ace/mode/diff">Diff</option><option value="ace/mode/dockerfile">Dockerfile</option><option value="ace/mode/dot">Dot</option><option value="ace/mode/drools">Drools</option><option value="ace/mode/edifact">Edifact</option><option value="ace/mode/eiffel">Eiffel</option><option value="ace/mode/ejs">EJS</option><option value="ace/mode/elixir">Elixir</option><option value="ace/mode/elm">Elm</option><option value="ace/mode/erlang">Erlang</option><option value="ace/mode/forth">Forth</option><option value="ace/mode/fortran">Fortran</option><option value="ace/mode/fsharp">FSharp</option><option value="ace/mode/fsl">FSL</option><option value="ace/mode/ftl">FreeMarker</option><option value="ace/mode/gcode">Gcode</option><option value="ace/mode/gherkin">Gherkin</option><option value="ace/mode/gitignore">Gitignore</option><option value="ace/mode/glsl">Glsl</option><option value="ace/mode/gobstones">Gobstones</option><option value="ace/mode/golang">Go</option><option value="ace/mode/graphqlschema">GraphQLSchema</option><option value="ace/mode/groovy">Groovy</option><option value="ace/mode/haml">HAML</option><option value="ace/mode/handlebars">Handlebars</option><option value="ace/mode/haskell">Haskell</option><option value="ace/mode/haskell_cabal">Haskell Cabal</option><option value="ace/mode/haxe">haXe</option><option value="ace/mode/hjson">Hjson</option><option value="ace/mode/html">HTML</option><option value="ace/mode/html_elixir">HTML (Elixir)</option><option value="ace/mode/html_ruby">HTML (Ruby)</option><option value="ace/mode/ini">INI</option><option value="ace/mode/io">Io</option><option value="ace/mode/ion">Ion</option><option value="ace/mode/jack">Jack</option><option value="ace/mode/jade">Jade</option><option value="ace/mode/java">Java</option><option value="ace/mode/javascript">JavaScript</option><option value="ace/mode/json">JSON</option><option value="ace/mode/json5">JSON5</option><option value="ace/mode/jsoniq">JSONiq</option><option value="ace/mode/jsp">JSP</option><option value="ace/mode/jssm">JSSM</option><option value="ace/mode/jsx">JSX</option><option value="ace/mode/julia">Julia</option><option value="ace/mode/kotlin">Kotlin</option><option value="ace/mode/latex">LaTeX</option><option value="ace/mode/latte">Latte</option><option value="ace/mode/less">LESS</option><option value="ace/mode/liquid">Liquid</option><option value="ace/mode/lisp">Lisp</option><option value="ace/mode/livescript">LiveScript</option><option value="ace/mode/logiql">LogiQL</option><option value="ace/mode/lsl">LSL</option><option value="ace/mode/lua">Lua</option><option value="ace/mode/luapage">LuaPage</option><option value="ace/mode/lucene">Lucene</option><option value="ace/mode/makefile">Makefile</option><option value="ace/mode/markdown">Markdown</option><option value="ace/mode/mask">Mask</option><option value="ace/mode/matlab">MATLAB</option><option value="ace/mode/maze">Maze</option><option value="ace/mode/mediawiki">MediaWiki</option><option value="ace/mode/mel">MEL</option><option value="ace/mode/mips">MIPS</option><option value="ace/mode/mixal">MIXAL</option><option value="ace/mode/mushcode">MUSHCode</option><option value="ace/mode/mysql">MySQL</option><option value="ace/mode/nginx">Nginx</option><option value="ace/mode/nim">Nim</option><option value="ace/mode/nix">Nix</option><option value="ace/mode/nsis">NSIS</option><option value="ace/mode/nunjucks">Nunjucks</option><option value="ace/mode/objectivec">Objective-C</option><option value="ace/mode/ocaml">OCaml</option><option value="ace/mode/partiql">PartiQL</option><option value="ace/mode/pascal">Pascal</option><option value="ace/mode/perl">Perl</option><option value="ace/mode/pgsql">pgSQL</option><option value="ace/mode/php_laravel_blade">PHP (Blade Template)</option><option value="ace/mode/php">PHP</option><option value="ace/mode/pig">Pig</option><option value="ace/mode/powershell">Powershell</option><option value="ace/mode/praat">Praat</option><option value="ace/mode/prisma">Prisma</option><option value="ace/mode/prolog">Prolog</option><option value="ace/mode/properties">Properties</option><option value="ace/mode/protobuf">Protobuf</option><option value="ace/mode/puppet">Puppet</option><option value="ace/mode/python">Python</option><option value="ace/mode/qml">QML</option><option value="ace/mode/r">R</option><option value="ace/mode/raku">Raku</option><option value="ace/mode/razor">Razor</option><option value="ace/mode/rdoc">RDoc</option><option value="ace/mode/red">Red</option><option value="ace/mode/rhtml">RHTML</option><option value="ace/mode/rst">RST</option><option value="ace/mode/ruby">Ruby</option><option value="ace/mode/rust">Rust</option><option value="ace/mode/sac">SaC</option><option value="ace/mode/sass">SASS</option><option value="ace/mode/scad">SCAD</option><option value="ace/mode/scala">Scala</option><option value="ace/mode/scheme">Scheme</option><option value="ace/mode/scrypt">Scrypt</option><option value="ace/mode/scss">SCSS</option><option value="ace/mode/sh">SH</option><option value="ace/mode/sjs">SJS</option><option value="ace/mode/slim">Slim</option><option value="ace/mode/smarty">Smarty</option><option value="ace/mode/smithy">Smithy</option><option value="ace/mode/snippets">snippets</option><option value="ace/mode/soy_template">Soy Template</option><option value="ace/mode/space">Space</option><option value="ace/mode/sql">SQL</option><option value="ace/mode/sqlserver">SQLServer</option><option value="ace/mode/stylus">Stylus</option><option value="ace/mode/svg">SVG</option><option value="ace/mode/swift">Swift</option><option value="ace/mode/tcl">Tcl</option><option value="ace/mode/terraform">Terraform</option><option value="ace/mode/tex">Tex</option><option value="ace/mode/text">Text</option><option value="ace/mode/textile">Textile</option><option value="ace/mode/toml">Toml</option><option value="ace/mode/tsx">TSX</option><option value="ace/mode/twig">Twig</option><option value="ace/mode/typescript">Typescript</option><option value="ace/mode/vala">Vala</option><option value="ace/mode/vbscript">VBScript</option><option value="ace/mode/velocity">Velocity</option><option value="ace/mode/verilog">Verilog</option><option value="ace/mode/vhdl">VHDL</option><option value="ace/mode/visualforce">Visualforce</option><option value="ace/mode/wollok">Wollok</option><option value="ace/mode/xml">XML</option><option value="ace/mode/xquery">XQuery</option><option value="ace/mode/yaml">YAML</option><option value="ace/mode/zeek">Zeek</option><option value="ace/mode/django">Django</option></select>'
                    selectMode.style.marginBottom = "30px";
                    code.after(selectMode);
                    selectMode.onchange = () => {
                        console.log(selectMode.value);
                        editor.session.setMode(selectMode.value);
                    };
                }
            }
        });
    });
})();