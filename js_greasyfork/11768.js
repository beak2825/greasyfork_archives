// ==UserScript==
// @name        MakabaCode
// @namespace   MakabaCode
// @include     /^https?:\/\/(2ch\.(hk|pm|re|tf|wf|yt)|2-ch\.so).*$/
// @version     1.0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @description A script for adding code markup at 2ch.hk
// @downloadURL https://update.greasyfork.org/scripts/11768/MakabaCode.user.js
// @updateURL https://update.greasyfork.org/scripts/11768/MakabaCode.meta.js
// ==/UserScript==

var mcode = mcode || {};

mcode.tasks = {};
mcode.langs = ["abap", "as", "as3", "ada", "antlr", "antlr-as", "antlr-csharp", "antlr-cpp", "antlr-java",
    "antlr-objc", "antlr-perl", "antlr-python", "antlr-ruby", "apacheconf", "applescript", "aspectj", "aspx-cs",
    "aspx-vb", "asy", "ahk", "autoit", "awk", "basemake", "bash", "console", "bat", "bbcode", "befunge", "blitzmax",
    "boo", "brainfuck", "bro", "bugs", "c", "csharp", "cpp", "c-objdump", "ca65", "cbmbas", "ceylon", "cfengine3",
    "cfs", "cheetah", "clojure", "cmake", "cobol", "cobolfree", "coffee-script", "cfm", "common-lisp", "coq",
    "cpp-objdump", "croc", "css", "css+django", "css+genshitext", "css+lasso", "css+mako", "css+myghty", "css+php",
    "css+erb", "css+smarty", "cuda", "cython", "d", "d-objdump", "dpatch", "dart", "control", "sourceslist", "delphi",
    "dg", "diff", "django", "dtd", "duel", "dylan", "dylan-console", "dylan-lid", "ec", "ecl", "elixir", "iex",
    "ragel-em", "erb", "erlang", "erl", "evoque", "factor", "fancy", "fan", "felix", "fortran", "clipper", "fsharp",
    "gas", "genshi", "genshitext", "pot", "cucumber", "glsl", "gnuplot", "go", "gooddata-cl", "gosu", "gst", "groff",
    "groovy", "haml", "haskell", "hx", "html", "html+cheetah", "html+django", "html+evoque", "html+genshi",
    "html+lasso", "html+mako", "html+myghty", "html+php", "html+smarty", "html+velocity", "http", "haxeml", "hybris",
    "idl", "ini", "io", "ioke", "irc", "jade", "jags", "java", "jsp", "js", "js+cheetah", "js+django", "js+genshitext",
    "js+lasso", "js+mako", "js+myghty", "js+php", "js+erb", "js+smarty", "json", "julia", "jlcon", "kconfig", "koka",
    "kotlin", "lasso", "lighty", "lhs", "live-script", "llvm", "logos", "logtalk", "lua", "make", "mako", "maql",
    "mason", "matlab", "matlabsession", "minid", "modelica", "modula2", "trac-wiki", "monkey", "moocode", "moon",
    "mscgen", "mupad", "mxml", "myghty", "mysql", "nasm", "nemerle", "newlisp", "newspeak", "nginx", "nimrod", "nsis",
    "numpy", "objdump", "objective-c", "objective-c++", "objective-j", "ocaml", "octave", "ooc", "opa", "openedge",
    "perl", "php", "plpgsql", "psql", "postgresql", "postscript", "pov", "powershell", "prolog", "properties",
    "protobuf", "puppet", "pypylog", "python", "python3", "py3tb", "pycon", "pytb", "qml", "racket", "ragel",
    "ragel-c", "ragel-cpp", "ragel-d", "ragel-java", "ragel-objc", "ragel-ruby", "raw", "rconsole", "rd", "rebol",
    "redcode", "registry", "rst", "rhtml", "RobotFramework", "spec", "rb", "rbcon", "rust", "splus", "sass", "scala",
    "ssp", "scaml", "scheme", "scilab", "scss", "shell-session", "smali", "smalltalk", "smarty", "snobol", "sp", "sql",
    "sqlite3", "squidconf", "stan", "sml", "systemverilog", "tcl", "tcsh", "tea", "tex", "text", "treetop", "ts",
    "urbiscript", "vala", "vb.net", "velocity", "verilog", "vgl", "vhdl", "vim", "xml", "xml+cheetah", "xml+django",
    "xml+evoque", "xml+lasso", "xml+mako", "xml+myghty", "xml+php", "xml+erb", "xml+smarty", "xml+velocity", "xquery",
    "xslt", "xtend", "yaml", /*Here follows aliases*/
    "lisp", "c#", "f#", "ruby"];
mcode.lexerSelectHtml = "<select id='makabaCodeLexer'><option value='abap'>ABAP</option>"
    + "<option value='as'>ActionScript</option><option value='as3'>ActionScript 3</option>"
    + "<option value='ada'>Ada</option><option value='antlr'>ANTLR</option>"
    + "<option value='antlr-as'>ANTLR With ActionScript Target</option>"
    + "<option value='antlr-csharp'>ANTLR With C# Target</option>"
    + "<option value='antlr-cpp'>ANTLR With CPP Target</option>"
    + "<option value='antlr-java'>ANTLR With Java Target</option>"
    + "<option value='antlr-objc'>ANTLR With ObjectiveC Target</option>"
    + "<option value='antlr-perl'>ANTLR With Perl Target</option>"
    + "<option value='antlr-python'>ANTLR With Python Target</option>"
    + "<option value='antlr-ruby'>ANTLR With Ruby Target</option><option value='apacheconf'>ApacheConf</option>"
    + "<option value='applescript'>AppleScript</option><option value='aspectj'>AspectJ</option>"
    + "<option value='aspx-cs'>aspx-cs</option><option value='aspx-vb'>aspx-vb</option>"
    + "<option value='asy'>Asymptote</option><option value='ahk'>autohotkey</option>"
    + "<option value='autoit'>AutoIt</option><option value='awk'>Awk</option>"
    + "<option value='basemake'>Base Makefile</option><option value='bash'>Bash</option>"
    + "<option value='console'>Bash Session</option><option value='bat'>Batchfile</option>"
    + "<option value='bbcode'>BBCode</option><option value='befunge'>Befunge</option>"
    + "<option value='blitzmax'>BlitzMax</option><option value='boo'>Boo</option>"
    + "<option value='brainfuck'>Brainfuck</option><option value='bro'>Bro</option><option value='bugs'>BUGS</option>"
    + "<option value='c'>C</option><option value='csharp'>C#</option><option value='cpp'>C++</option>"
    + "<option value='c-objdump'>c-objdump</option><option value='ca65'>ca65</option>"
    + "<option value='cbmbas'>CBM BASIC V2</option><option value='ceylon'>Ceylon</option>"
    + "<option value='cfengine3'>CFEngine3</option><option value='cfs'>cfstatement</option>"
    + "<option value='cheetah'>Cheetah</option><option value='clojure'>Clojure</option>"
    + "<option value='cmake'>CMake</option><option value='cobol'>COBOL</option>"
    + "<option value='cobolfree'>COBOLFree</option><option value='coffee-script'>CoffeeScript</option>"
    + "<option value='cfm'>Coldfusion HTML</option><option value='common-lisp'>Common Lisp</option>"
    + "<option value='coq'>Coq</option><option value='cpp-objdump'>cpp-objdump</option>"
    + "<option value='croc'>Croc</option><option value='css'>CSS</option>"
    + "<option value='css+django'>CSS+Django/Jinja</option><option value='css+genshitext'>CSS+Genshi Text</option>"
    + "<option value='css+lasso'>CSS+Lasso</option><option value='css+mako'>CSS+Mako</option>"
    + "<option value='css+myghty'>CSS+Myghty</option><option value='css+php'>CSS+PHP</option>"
    + "<option value='css+erb'>CSS+Ruby</option><option value='css+smarty'>CSS+Smarty</option>"
    + "<option value='cuda'>CUDA</option><option value='cython'>Cython</option><option value='d'>D</option>"
    + "<option value='d-objdump'>d-objdump</option><option value='dpatch'>Darcs Patch</option>"
    + "<option value='dart'>Dart</option><option value='control'>Debian Control file</option>"
    + "<option value='sourceslist'>Debian Sourcelist</option><option value='delphi'>Delphi</option>"
    + "<option value='dg'>dg</option><option value='diff'>Diff</option><option value='django'>Django/Jinja</option>"
    + "<option value='dtd'>DTD</option><option value='duel'>Duel</option><option value='dylan'>Dylan</option>"
    + "<option value='dylan-console'>Dylan session</option><option value='dylan-lid'>DylanLID</option>"
    + "<option value='ec'>eC</option><option value='ecl'>ECL</option><option value='elixir'>Elixir</option>"
    + "<option value='iex'>Elixir iex session</option><option value='ragel-em'>Embedded Ragel</option>"
    + "<option value='erb'>ERB</option><option value='erlang'>Erlang</option>"
    + "<option value='erl'>Erlang erl session</option><option value='evoque'>Evoque</option>"
    + "<option value='factor'>Factor</option><option value='fancy'>Fancy</option>"
    + "<option value='fan'>Fantom</option><option value='felix'>Felix</option><option value='fortran'>Fortran</option>"
    + "<option value='Clipper'>FoxPro</option><option value='fsharp'>FSharp</option><option value='gas'>GAS</option>"
    + "<option value='genshi'>Genshi</option><option value='genshitext'>Genshi Text</option>"
    + "<option value='pot'>Gettext Catalog</option><option value='Cucumber'>Gherkin</option>"
    + "<option value='glsl'>GLSL</option><option value='gnuplot'>Gnuplot</option><option value='go'>Go</option>"
    + "<option value='gooddata-cl'>GoodData-CL</option><option value='gosu'>Gosu</option>"
    + "<option value='gst'>Gosu Template</option><option value='groff'>Groff</option>"
    + "<option value='groovy'>Groovy</option><option value='haml'>Haml</option>"
    + "<option value='haskell'>Haskell</option><option value='hx'>haXe</option><option value='html'>HTML</option>"
    + "<option value='html+cheetah'>HTML+Cheetah</option><option value='html+django'>HTML+Django/Jinja</option>"
    + "<option value='html+evoque'>HTML+Evoque</option><option value='html+genshi'>HTML+Genshi</option>"
    + "<option value='html+lasso'>HTML+Lasso</option><option value='html+mako'>HTML+Mako</option>"
    + "<option value='html+myghty'>HTML+Myghty</option><option value='html+php'>HTML+PHP</option>"
    + "<option value='html+smarty'>HTML+Smarty</option><option value='html+velocity'>HTML+Velocity</option>"
    + "<option value='http'>HTTP</option><option value='haxeml'>Hxml</option><option value='hybris'>Hybris</option>"
    + "<option value='idl'>IDL</option><option value='ini'>INI</option><option value='io'>Io</option>"
    + "<option value='ioke'>Ioke</option><option value='irc'>IRC logs</option><option value='jade'>Jade</option>"
    + "<option value='jags'>JAGS</option><option value='java'>Java</option>"
    + "<option value='jsp'>Java Server Page</option><option value='js'>JavaScript</option>"
    + "<option value='js+cheetah'>JavaScript+Cheetah</option>"
    + "<option value='js+django'>JavaScript+Django/Jinja</option>"
    + "<option value='js+genshitext'>JavaScript+Genshi Text</option><option value='js+lasso'>JavaScript+Lasso</option>"
    + "<option value='js+mako'>JavaScript+Mako</option><option value='js+myghty'>JavaScript+Myghty</option>"
    + "<option value='js+php'>JavaScript+PHP</option><option value='js+erb'>JavaScript+Ruby</option>"
    + "<option value='js+smarty'>JavaScript+Smarty</option><option value='json'>JSON</option>"
    + "<option value='julia'>Julia</option><option value='jlcon'>Julia console</option>"
    + "<option value='kconfig'>Kconfig</option><option value='koka'>Koka</option>"
    + "<option value='kotlin'>Kotlin</option><option value='lasso'>Lasso</option>"
    + "<option value='lighty'>Lighttpd configuration file</option><option value='lhs'>Literate Haskell</option>"
    + "<option value='live-script'>LiveScript</option><option value='llvm'>LLVM</option>"
    + "<option value='logos'>Logos</option><option value='logtalk'>Logtalk</option><option value='lua'>Lua</option>"
    + "<option value='make'>Makefile</option><option value='mako'>Mako</option><option value='maql'>MAQL</option>"
    + "<option value='mason'>Mason</option><option value='matlab'>Matlab</option>"
    + "<option value='matlabsession'>Matlab session</option><option value='minid'>MiniD</option>"
    + "<option value='modelica'>Modelica</option><option value='modula2'>Modula-2</option>"
    + "<option value='trac-wiki'>MoinMoin/Trac Wiki markup</option><option value='monkey'>Monkey</option>"
    + "<option value='moocode'>MOOCode</option><option value='moon'>MoonScript</option>"
    + "<option value='mscgen'>Mscgen</option><option value='mupad'>MuPAD</option><option value='mxml'>MXML</option>"
    + "<option value='myghty'>Myghty</option><option value='mysql'>MySQL</option><option value='nasm'>NASM</option>"
    + "<option value='nemerle'>Nemerle</option><option value='newlisp'>NewLisp</option>"
    + "<option value='newspeak'>Newspeak</option><option value='nginx'>Nginx configuration file</option>"
    + "<option value='nimrod'>Nimrod</option><option value='nsis'>NSIS</option><option value='numpy'>NumPy</option>"
    + "<option value='objdump'>objdump</option><option value='objective-c'>Objective-C</option>"
    + "<option value='objective-c++'>Objective-C++</option><option value='objective-j'>Objective-J</option>"
    + "<option value='ocaml'>OCaml</option><option value='octave'>Octave</option><option value='ooc'>Ooc</option>"
    + "<option value='opa'>Opa</option><option value='openedge'>OpenEdge ABL</option>"
    + "<option value='perl'>Perl</option><option value='php'>PHP</option><option value='plpgsql'>PL/pgSQL</option>"
    + "<option value='psql'>PostgreSQL console (psql)</option>"
    + "<option value='postgresql'>PostgreSQL SQL dialect</option><option value='postscript'>PostScript</option>"
    + "<option value='pov'>POVRay</option><option value='powershell'>PowerShell</option>"
    + "<option value='prolog'>Prolog</option><option value='properties'>Properties</option>"
    + "<option value='protobuf'>Protocol Buffer</option><option value='puppet'>Puppet</option>"
    + "<option value='pypylog'>PyPy Log</option><option value='python'>Python</option>"
    + "<option value='python3'>Python 3</option><option value='py3tb'>Python 3.0 Traceback</option>"
    + "<option value='pycon'>Python console session</option><option value='pytb'>Python Traceback</option>"
    + "<option value='qml'>QML</option><option value='racket'>Racket</option><option value='ragel'>Ragel</option>"
    + "<option value='ragel-c'>Ragel in C Host</option><option value='ragel-cpp'>Ragel in CPP Host</option>"
    + "<option value='ragel-d'>Ragel in D Host</option><option value='ragel-java'>Ragel in Java Host</option>"
    + "<option value='ragel-objc'>Ragel in Objective C Host</option>"
    + "<option value='ragel-ruby'>Ragel in Ruby Host</option><option value='raw'>Raw token data</option>"
    + "<option value='rconsole'>RConsole</option><option value='rd'>Rd</option><option value='rebol'>REBOL</option>"
    + "<option value='redcode'>Redcode</option><option value='registry'>reg</option>"
    + "<option value='rst'>reStructuredText</option><option value='rhtml'>RHTML</option>"
    + "<option value='RobotFramework'>RobotFramework</option><option value='spec'>RPMSpec</option>"
    + "<option value='rb'>Ruby</option><option value='rbcon'>Ruby irb session</option>"
    + "<option value='rust'>Rust</option>"
    + "<option value='splus'>S</option><option value='sass'>Sass</option><option value='scala'>Scala</option>"
    + "<option value='ssp'>Scalate Server Page</option><option value='scaml'>Scaml</option>"
    + "<option value='scheme'>Scheme</option><option value='scilab'>Scilab</option><option value='scss'>SCSS</option>"
    + "<option value='shell-session'>Shell Session</option><option value='smali'>Smali</option>"
    + "<option value='smalltalk'>Smalltalk</option><option value='smarty'>Smarty</option>"
    + "<option value='snobol'>Snobol</option><option value='sp'>SourcePawn</option><option value='sql'>SQL</option>"
    + "<option value='sqlite3'>sqlite3con</option>"
    + "<option value='squidconf'>SquidConf</option><option value='stan'>Stan</option>"
    + "<option value='sml'>Standard ML</option><option value='systemverilog'>systemverilog</option>"
    + "<option value='tcl'>Tcl</option><option value='tcsh'>Tcsh</option><option value='tea'>Tea</option>"
    + "<option value='tex'>TeX</option><option selected='true' value='text'>Text only</option>"
    + "<option value='treetop'>Treetop</option><option value='ts'>TypeScript</option>"
    + "<option value='urbiscript'>UrbiScript</option><option value='vala'>Vala</option>"
    + "<option value='vb.net'>VB.net</option><option value='velocity'>Velocity</option>"
    + "<option value='verilog'>verilog</option><option value='vgl'>VGL</option><option value='vhdl'>vhdl</option>"
    + "<option value='vim'>VimL</option><option value='xml'>XML</option>"
    + "<option value='xml+cheetah'>XML+Cheetah</option>"
    + "<option value='xml+django'>XML+Django/Jinja</option><option value='xml+evoque'>XML+Evoque</option>"
    + "<option value='xml+lasso'>XML+Lasso</option><option value='xml+mako'>XML+Mako</option>"
    + "<option value='xml+myghty'>XML+Myghty</option><option value='xml+php'>XML+PHP</option>"
    + "<option value='xml+erb'>XML+Ruby</option><option value='xml+smarty'>XML+Smarty</option>"
    + "<option value='xml+velocity'>XML+Velocity</option><option value='xquery'>XQuery</option>"
    + "<option value='xslt'>XSLT</option><option value='xtend'>Xtend</option><option value='yaml'>YAML</option>"
    + "</select>";
mcode.styleSelectHtml = "<select id='makabaCodeStyle'><option value='autumn'>autumn</option>"
    + "<option value='borland'>borland</option><option value='bw'>bw</option>"
    + "<option value='colorful'>colorful</option><option value='default'>default</option>"
    + "<option value='emacs'>emacs</option><option value='friendly'>friendly</option>"
    + "<option value='fruity'>fruity</option><option value='manni'>manni</option>"
    + "<option value='monokai'>monokai</option><option value='murphy'>murphy</option>"
    + "<option value='native'>native</option><option value='pastie'>pastie</option>"
    + "<option value='perldoc'>perldoc</option><option value='rrt'>rrt</option><option value='tango'>tango</option>"
    + "<option value='trac'>trac</option><option value='vim'>vim</option><option value='vs'>vs</option></select>";
mcode.lineNosHtml = "<input id='makabaCodeLineNos' id='linenos' type='checkbox' />";
mcode.makabaTags = ["b", "i", "u", "s", "o", "sup", "sub", "spoiler"];

mcode.inLangs = function(lang) {
    if (!lang)
        return true;
    for (var i = 0; i < mcode.langs.length; ++i) {
        if (lang == mcode.langs[i])
            return true;
    }
    return false;
};

mcode.isEmpty = function(obj) {
    if (!obj)
        return true;
    for (p in obj) {
        if (obj.hasOwnProperty(p))
            return false;
    }
    return true;
};

mcode.toCenter = function(element) {
    if (!element)
        return;
    var doc = document.documentElement;
    element.style.left = (doc.clientWidth / 2 - element.offsetWidth / 2) + "px";
    element.style.top = (doc.clientHeight / 2 - element.offsetHeight / 2) + "px";
};

mcode.filled = function(what, count) {
    var s = "";
    for (var i = 0; i < count; ++i)
        s += what;
    return s;
};

mcode.replaceTabs = function(s, tabWidth) {
    var i = 0;
    while (i < s.length) {
        if (s.charAt(i) == "\t") {
            var spcount = tabWidth - (i < tabWidth ? i : i % tabWidth);
            s = s.substr(0, i) + mcode.filled(" ", spcount ? spcount : tabWidth) + s.substr(i + 1);
            i += spcount;
        } else {
            ++i;
        }
    }
    return s;
};

mcode.language = function(source) {
    var lang = source.match(/lang\="?(\w|\+|\-| |#)+"?\]/gi);
    if (!lang)
        return null;
    lang = lang[0].replace("lang=", "").replace("]", "").split("\"").join("").replace(" ", "-");
    lang = lang.replace("++", "pp").toLowerCase();
    if ("lisp" == lang)
        lang = "common-lisp";
    else if ("ruby" == lang)
        lang = "rb";
    else if ("c#" == lang)
        lang = "csharp";
    else if ("f#" == lang)
        lang = "fsharp";
    return lang;
};

mcode.code = function(source) {
    var ind = source.indexOf("]");
    var code = source.substring(ind + 1, source.length - 7);
    code = code.split("<em>").join("*").split("</em>").join("*").split("<br>").join("\n");
    code = code.split("&lt;").join("<").split("&gt;").join(">").split("&quot;").join("\"").split("&amp;").join("&");
    code = code.split("#92;").join("\\");
    if (code.length < 1)
       return code;
    mcode.makabaTags.forEach(function(tag) {
        code = code.split("[ " + tag + " ]").join("[" + tag + "]");
    });
    while (code.indexOf("\n") == 0)
        code = code.substr(1);
    while (code.lastIndexOf("\n") == code.length - 1)
        code = code.substr(0, code.length - 1);
    var lines = code.split("\n");
    for (var i = 0; i < lines.length; ++i)
        lines[i] = mcode.replaceTabs(lines[i], 4);
    code = lines.join("\n");
    return code;
};

mcode.appendRow = function(table, labelText, html) {
    if (!table || !labelText || !html)
        return;
    var tr = document.createElement("tr");
    var tdl = document.createElement("td");
    tdl.appendChild(document.createTextNode(labelText));
    tr.appendChild(tdl);
    var td = document.createElement("td");
    td.innerHTML = html;
    tr.appendChild(td);
    table.appendChild(tr);
};

mcode.showSettings = function() {
    var div = document.createElement("div");
    div.style.position = "fixed";
    div.style.zIndex = "9000";
    div.style.height = "120px";
    div.style.width = "300px";
    div.style.backgroundColor = "#DDDDDD";
    var table = document.createElement("table");
    mcode.appendRow(table, "Стиль:", mcode.styleSelectHtml);
    mcode.appendRow(table, "Номера строк:", mcode.lineNosHtml);
    div.appendChild(table);
    var font = document.createElement("font");
    font.color = "red";
    font.appendChild(document.createTextNode("Не забудьте обновить страницу!"));
    div.appendChild(font);
    var buttonBox = document.createElement("div");
    buttonBox.style.position = "absolute";
    buttonBox.style.bottom = "5px";
    buttonBox.style.right = "10px";
    var button = document.createElement("button");
    button.appendChild(document.createTextNode("Сохранить"));
    button.onclick = function() {
        GM_setValue("makabaCodeStyle", sel.options[sel.selectedIndex].value);
        GM_setValue("makabaCodeLineNos", !!lineNos.checked);
        document.body.removeChild(div);
    };
    buttonBox.appendChild(button);
    var cButton = document.createElement("button");
    cButton.appendChild(document.createTextNode("Отмена"));
    cButton.onclick = function() {
        document.body.removeChild(div);
    };
    buttonBox.appendChild(cButton);
    div.appendChild(buttonBox);
    document.body.appendChild(div);
    var sel = document.getElementById("makabaCodeStyle");
    var lineNos = document.getElementById("makabaCodeLineNos");
    var style = GM_getValue("makabaCodeStyle", "friendly");
    for (var i = 0; i < sel.options.length; ++i) {
        if (style == sel.options[i].value) {
            sel.options[i].selected = true;
            break;
        }
    }
    if (!!GM_getValue("makabaCodeLineNos", false))
        lineNos.checked = true;
    mcode.toCenter(div);
};

mcode.subtaskReceived = function(element, source, target) {
    var task = {
        "source": source,
        "target": target
    };
    mcode.tasks[element.id]["subtasks"].push(task);
    if (mcode.tasks[element.id]["subtasks"].length == mcode.tasks[element.id]["subtaskCount"]) {
        mcode.doTask(element, mcode.tasks[element.id]["subtasks"]);
        delete mcode.tasks[element.id];
    }
};

mcode.doTask = function(element, subtasks) {
    if (!element || !subtasks || 0 === subtasks.length)
        return;
    var html = element.innerHTML;
    subtasks.forEach(function(task) {
        var source = task["source"];
        var target = task["target"];
        html = html.replace(source, target);
    });
    element.innerHTML = html;
};

mcode.request = function(element, source, lang) {
    if (!element || typeof source != "string")
        return;
    if (!lang) {
        lang = mcode.language(source);
        if (!mcode.inLangs(lang)) {
            delete mcode.tasks[element.id];
            return;
        }
    }
    var params = "code=" + encodeURIComponent(mcode.code(source));
    params += "&lexer=" + (!!lang ? encodeURIComponent(lang) : "text");
    params += "&style=" + GM_getValue("makabaCodeStyle", "friendly");
    if (!!GM_getValue("makabaCodeLineNos", false))
        params += "&linenos=true";
    GM_xmlhttpRequest({
        method: "POST",
        url: "http://hilite.me/api",
        data: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        onload: function(res) {
            if (4 === res.readyState) {
                if (200 == res.status) {
                    var html = res.responseText;
                    html = html.replace("overflow:auto;", "overflow-y:hidden;");
                    html = html.replace("<pre style=\"margin: 0;", "<pre style=\"overflow-y: hidden; margin: 0;");
                    if (!!GM_getValue("makabaCodeLineNos", false))
                        html = html.replace("<pre style=\"margin: 0;", "<pre style=\"overflow-y: hidden; margin: 0;");
                    //Yep, twice, because there are two <pre> tags if (line numbers are enabled)
                    mcode.subtaskReceived(element, source, html);
                } else {
                    delete mcode.tasks[element.id];
                    alert(res.statusText);
                }
            }
        }
    });
};

mcode.processExpand = function(expand) {
    if (!expand)
        return;
    var a = document.createElement("a");
    a.appendChild(document.createTextNode("Показать текст полностью"));
    var id = expand.parentNode.id.replace("m", "");
    a.id = "expandLink" + id;
    (function(id, a) {
        document.body.addEventListener("click", function(e) {
            if (a.id != e.target.id)
                return;
            var parent = document.getElementById("m" + id);
            parent.removeChild(document.getElementById("shrinked-post" + id));
            parent.removeChild(document.getElementById("expandLink" + id));
            parent.innerHTML = document.getElementById("original-post" + id).innerHTML;
        }, false);
    })(id, a);
    expand.parentNode.replaceChild(a, expand);
};

mcode.processBlockquote = function(element) {
    if (!element || !element.childNodes)
        return;
    element["makaba-code"] = "true";
    var html = element.innerHTML;
    var rx = /\[code(\s+lang\="?(\w|\+|\-| |#)+"?)?\].+?\[\/code\]/gi;
    var matches = html.match(rx);
    if (!matches)
        return;
    var expand = element.querySelector("span.expand-large-comment");
    if (expand)
        mcode.processExpand(expand);
    mcode.tasks[element.id] = {
        "subtasks": [],
        "subtaskCount": matches.length,
    };
    matches.forEach(function(source) {
        mcode.request(element, source);
    });
};

mcode.processLink = function(link, host, href, after) {
    if (!link || !host || !href)
        return;
    link["makaba-code"] = "true";
    (function(link) {
        var rx = new RegExp(host + "\/(\\w+)");
        var m = link.href.match(rx);
        if (!m || m.length < 2)
            return;
        var id = m[1];
        var div = document.createElement("div");
        div.style.overflow = "hidden";
        div.style.width = "1000px";
        var iframe = document.createElement("iframe");
        iframe.style.margin = 0;
        iframe.style.width = "1000px";
        iframe.style.border = "none";
        iframe.style.overflow = "hidden";
        iframe.style.scrolling = "no";
        iframe.src = href.replace("%id%", id);
        div.appendChild(iframe);
        if (typeof after != "function") {
            var height = (typeof after == "number") ? after : 500;
            div.style.height = height + "px";
            iframe.style.height = height + "px";
            return;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: href.replace("%id%", id),
            onload: function(res) {
                if (4 === res.readyState) {
                    if (200 == res.status) {
                        var html = res.responseText;
                        var height = after(html);
                        div.style.height = height + "px";
                        iframe.style.height = height + "px";
                        if (html.indexOf("<div") < 0)
                            return;
                        link.parentNode.replaceChild(div, link);
                    } else {
                        alert(res.statusText);
                    }
                }
            }
        });
    })(link);
};

mcode.processLinks = function(host, href, after) {
    var links = document.body.querySelectorAll("a[href^='http://" + host + "/']:not([makaba-code='true']), "
        + "a[href^='https://" + host + "/']:not([makaba-code='true'])");
    if (!links)
        return;
    for (var i = 0; i < links.length; ++i)
        mcode.processLink(links[i], host, href, after);
};

mcode.execute = function() {
    var elements = document.body.querySelectorAll("blockquote.post-message:not([makaba-code='true'])");
    if (elements) {
        for (var i = 0; i < elements.length; ++i)
            mcode.processBlockquote(elements[i]);
    }
    mcode.processLinks("pastebin.com", "https://pastebin.com/embed_iframe.php?i=%id%", function(html) {
        return 21 * (html.match(/<li/gi) || []).length + 22 + 1;
    });
    mcode.processLinks("ideone.com", "https://ideone.com/embed/%id%", function(html) {
        return 20 * (html.match(/<li class\="li1/gi) || []).length + 35 + 16;
    });
    mcode.processLinks("jsfiddle.net", "https://jsfiddle.net/%id%/embedded");
};

mcode.caretPos = function(ctrl) {
    var caretPos = 0;   // IE Support
    if (document.selection) {
        ctrl.focus ();
        var sel = document.selection.createRange ();
        sel.moveStart ('character', -ctrl.value.length);
        caretPos = Sel.text.length;
    } else if (ctrl.selectionStart || ctrl.selectionStart == '0') { // Firefox support
        caretPos = ctrl.selectionStart;
    }
    return (caretPos);
};

mcode.setCaretPos = function(ctrl, pos) {
    if(ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos,pos);
    } else if (ctrl.createTextRange) {
        var range = ctrl.createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
    }
};

mcode.insertCodeTag = function(lang) {
    var field = document.getElementById("shampoo");
    var value = "[code lang=\"" + lang + "\"]\n\n[/code]";
    var m = 0;
    if (document.selection) {
        field.focus();
        var sel = document.selection.createRange();
        sel.text = value;
    } else if (field.selectionStart || field.selectionStart == "0") {
        var startPos = field.selectionStart;
        var endPos = field.selectionEnd;
        m = field.value.length - endPos;
        field.value = field.value.substring(0, startPos) + value + field.value.substring(endPos);
    } else {
        field.value += value;
    }
    mcode.setCaretPos(field, mcode.caretPos(field) - 8 - m);
    field.focus();
};

mcode.processBeforeSubmit = function() {
    var shampoo = document.getElementById("shampoo");
    var text = shampoo.value;
    var rx = /\[code(\s+lang\="?(\w|\+|\-| |#)+"?)?\](.|\n)+?\[\/code\]/gi;
    var matches = text.match(rx);
    if (!matches)
        return;
    for (var i = 0; i < matches.length; ++i) {
        var m = matches[i];
        var pm = m;
        mcode.makabaTags.forEach(function(tag) {
            m = m.split("[" + tag + "]").join("[ " + tag + " ]");
        });
        text = text.replace(pm, m);
    }
    shampoo.value = text;
};

mcode.initSubmitHook = function() {
    var sumbit = document.getElementById("submit");
    var wrapper = document.createElement("div");
    wrapper.style.display = "inline-block";
    wrapper.style.width = "88px";
    wrapper.style.backgroundColor = "#EAEAEA";
    wrapper.style.borderColor = "#CACACA";
    wrapper.style.borderWidth = "1px";
    wrapper.style.borderStyle = "solid";
    wrapper.style.paddingLeft = "6px";
    wrapper.style.paddingRight = "6px";
    wrapper.style.paddingTop = "2px";
    wrapper.style.paddingBottom = "2px";
    wrapper.style.marginLeft = "2px";
    var nsubmit = document.createElement("a");
    nsubmit.style.color = "#323232";
    nsubmit.onclick = function() {
        mcode.processBeforeSubmit();
        submit.click();
    };
    nsubmit.className = submit.className;
    nsubmit.appendChild(document.createTextNode(submit.value));
    wrapper.appendChild(nsubmit);
    sumbit.parentNode.insertBefore(wrapper, submit);
    submit.style.display = "none";
};

mcode.initControls = function() {
    var toolbar = document.getElementById("CommentToolbar");
    var span = document.createElement("span");
    span.innerHTML = mcode.lexerSelectHtml;
    var button = document.createElement("button");
    button.appendChild(document.createTextNode("Вставить тег [code]"));
    button.onclick = function() {
        var sel = document.getElementById("makabaCodeLexer");
        var lang = sel.options[sel.selectedIndex].value;
        mcode.insertCodeTag(lang);
        return false;
    };
    span.appendChild(button);
    var sButton = document.createElement("button");
    var img = document.createElement("img");
    img.src = "https://ololoepepe.me/files/configure.png";
    sButton.appendChild(img);
    sButton.title = "Настройки";
    sButton.onclick = function() {
        mcode.showSettings();
        return false;
    };
    span.insertBefore(sButton, span.firstChild);
    toolbar.appendChild(span);
};

mcode.executeFirstTime = function() {
    mcode.execute();
    document.addEventListener ("DOMNodeInserted", function(e) {
        var el = e.target;
        if (!el || !el.className)
            return;
        if ("post-wrapper" != el.className)
            return;
        mcode.execute();
    }, false);
    mcode.initSubmitHook();
    mcode.initControls();
};

mcode.addOnloadListener = function() {
    if (!document.addEventListener)
        return;
    document.addEventListener("DOMContentLoaded", mcode.executeFirstTime, false);
};

mcode.addOnloadListener();
