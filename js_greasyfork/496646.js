// ==UserScript==
// @name        ChatGPT Code Highlight
// @name:en     ChatGPT Code Highlight
// @name:zh-CN  ChatGPT 代码高亮
// @name:es     Resaltado de Código de ChatGPT
// @name:hi     चैटजीपीटी कोड हाइलाइट
// @name:fr     Surlignage de Code ChatGPT
// @name:ar     تمييز الكود في ChatGPT
// @name:bn     চ্যাটজিপিটি কোড হাইলাইট
// @name:ru     Подсветка кода ChatGPT
// @name:pt     Realce de Código do ChatGPT
// @name:ur     چیٹ جی پی ٹی کوڈ ہائی لائٹ
// @namespace   Dreace
// @match       *://chatgpt.com/*
// @grant       none
// @version     1.2
// @author      Dreace
// @license     GPL-3.0
// @description Add syntax highlighting for all languages in ChatGPT (using highlight.js)
// @description:en Add syntax highlighting for all languages in ChatGPT (using highlight.js)
// @description:zh-CN 为 ChatGPT 添加所有语言代码高亮（使用 highlight.js）
// @description:es Agrega resaltado de sintaxis para todos los lenguajes en ChatGPT (usando highlight.js)
// @description:hi चैटजीपीटी में सभी भाषाओं के लिए सिंटैक्स हाइलाइटिंग जोड़ें (highlight.js का उपयोग करके)
// @description:fr Ajouter la coloration syntaxique pour toutes les langues dans ChatGPT (en utilisant highlight.js)
// @description:ar إضافة تمييز بناء الجملة لجميع اللغات في ChatGPT (باستخدام highlight.js)
// @description:bn ChatGPT-এ সমস্ত ভাষার জন্য সিনট্যাক্স হাইলাইট যোগ করুন (highlight.js ব্যবহার করে)
// @description:ru Добавить подсветку синтаксиса для всех языков в ChatGPT (с использованием highlight.js)
// @description:pt Adicionar realce de sintaxe para todas as linguagens no ChatGPT (usando highlight.js)
// @description:ur چیٹ جی پی ٹی میں تمام زبانوں کے لیے نحو کو اجاگر کریں (highlight.js کا استعمال کرتے ہوئے)
// @run-at      document-idle
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/1c.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/abnf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/accesslog.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/actionscript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ada.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/angelscript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/apache.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/applescript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/arcade.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/arduino.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/armasm.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/asciidoc.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/aspectj.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/autohotkey.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/autoit.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/avrasm.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/awk.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/axapta.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bash.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/basic.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/bnf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/brainfuck.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/c.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cal.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/capnproto.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ceylon.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/clean.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/clojure.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/clojure-repl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cmake.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/coffeescript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/coq.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cos.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/cpp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/crmsh.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/crystal.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/csharp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/csp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/css.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/d.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dart.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/delphi.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/diff.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/django.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dns.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dockerfile.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dos.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dsconfig.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dts.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/dust.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ebnf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/elixir.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/elm.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/erb.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/erlang.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/erlang-repl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/excel.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/fix.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/flix.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/fortran.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/fsharp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/gams.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/gauss.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/gcode.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/gherkin.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/glsl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/gml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/go.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/golo.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/gradle.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/graphql.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/groovy.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/haml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/handlebars.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/haskell.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/haxe.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/hsp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/http.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/hy.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/inform7.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ini.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/irpf90.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/isbl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/java.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/jboss-cli.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/json.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/julia.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/julia-repl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/kotlin.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/lasso.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/latex.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ldif.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/leaf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/less.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/lisp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/livecodeserver.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/livescript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/llvm.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/lsl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/lua.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/makefile.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/markdown.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/mathematica.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/matlab.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/maxima.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/mel.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/mercury.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/mipsasm.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/mizar.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/mojolicious.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/monkey.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/moonscript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/n1ql.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/nestedtext.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/nginx.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/nim.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/nix.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/node-repl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/nsis.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/objectivec.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ocaml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/openscad.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/oxygene.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/parser3.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/perl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/pf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/pgsql.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/php.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/php-template.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/plaintext.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/pony.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/powershell.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/processing.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/profile.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/prolog.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/properties.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/protobuf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/puppet.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/purebasic.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/python-repl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/q.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/qml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/r.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/reasonml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/rib.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/roboconf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/routeros.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/rsl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ruby.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/ruleslanguage.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/rust.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sas.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/scala.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/scheme.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/scilab.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/scss.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/shell.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/smali.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/smalltalk.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sqf.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/sql.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/stan.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/stata.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/step21.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/stylus.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/subunit.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/swift.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/taggerscript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/tap.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/tcl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/thrift.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/tp.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/twig.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/typescript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/vala.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/vbnet.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/vbscript.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/vbscript-html.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/verilog.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/vhdl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/vim.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/wasm.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/wren.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/x86asm.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/xl.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/xml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/xquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/yaml.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/zephir.min.js
// @downloadURL https://update.greasyfork.org/scripts/496646/ChatGPT%20Code%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/496646/ChatGPT%20Code%20Highlight.meta.js
// ==/UserScript==

function highlightBlock(block) {
    if (block.dataset.highlighted) {
        return;
    }
    const languageName = block.className.match(/language-(\w+)/);
    if (languageName) {
        if (block.children[0].children.length === 0) {
            hljs.highlightElement(block.children[0]);
            block.dataset.highlighted = true;
        }
    }
}
setInterval(() => {
    document.querySelectorAll(".markdown").forEach((markdownBlock) => {
        if (markdownBlock.dataset.highlighted) {
            return;
        } else if (markdownBlock.className.includes("streaming-animation")) {
            const preBlocks = markdownBlock.querySelectorAll("pre");
            preBlocks.forEach((preBlock) => {
                if (preBlock.nextElementSibling) {
                    preBlock.querySelectorAll("code").forEach((codeBlock) => {
                        highlightBlock(codeBlock);
                    });
                }
            });
        } else {
            const codeBlocks = markdownBlock.querySelectorAll("code");
            codeBlocks.forEach((codeBlock) => {
                highlightBlock(codeBlock);
            });
            markdownBlock.dataset.highlighted = true;
        }
    }
    )
}, 1000);