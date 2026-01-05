// ==UserScript==
// @name         Agario EO Slim
// @namespace    
// @version      1.1
// @description  +Zoom, Show Another Cells Mass
// @author       NEL99 & raneo
// @match        http://agar.io/
// @include     *://agar.io/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18115/Agario%20EO%20Slim.user.js
// @updateURL https://update.greasyfork.org/scripts/18115/Agario%20EO%20Slim.meta.js
// ==/UserScript==





var allRules = [
    { hostname: ["agar.io"],
      scriptUriRe: /^http:\/\/agar\.io\/main_out\.js/,
      replace: function (m) {
          m.removeNewlines()

          m.replace("var:allCells",
                    /(=null;)(\w+)(.hasOwnProperty\(\w+\)?)/,
                    "$1" + "$v=$2;" + "$2$3",
                    "$v = {}")

          m.replace("var:myCells",
                    /(case 32:)(\w+)(\.push)/,
                    "$1" + "$v=$2;" + "$2$3",
                    "$v = []")

          m.replace("var:top",
                    /case 49:[^:]+?(\w+)=\[];/,
                    "$&" + "$v=$1;",
                    "$v = []")

          m.replace("var:topTeams",
                    /case 50:(\w+)=\[];/,
                    "$&" + "$v=$1;",
                    "$v = []")

          var dr = "(\\w+)=\\w+\\.getFloat64\\(\\w+,!0\\);\\w+\\+=8;\\n?"
          var dd = 7071.067811865476
          m.replace("var:dimensions hook:dimensionsUpdated",
                    RegExp("case 64:"+dr+dr+dr+dr),
                    "$&" + "$v = [$1,$2,$3,$4],$H($1,$2,$3,$4),",
                    "$v = " + JSON.stringify([-dd,-dd,dd,dd]))

          var vr = "(\\w+)=\\w+\\.getFloat32\\(\\w+,!0\\);\\w+\\+=4;"
          m.save() &&
              m.replace("var:rawViewport:x,y var:disableRendering:1",
                        /else \w+=\(5\*\w+\+(\w+)\)\/6,\w+=\(5\*\w+\+(\w+)\)\/6,.*?;/,
                        "$&" + "$v0.x=$1; $v0.y=$2; if($v1)return;") &&
              m.replace("var:disableRendering:2 hook:skipCellDraw",
                        /(\w+:function\(\w+\){)(if\(this\.\w+\(\)\){\+\+this\.[\w$]+;)/,
                        "$1" + "if($v || $H(this))return;" + "$2") &&
              m.replace("var:rawViewport:scale",
                        /Math\.pow\(Math\.min\(64\/\w+,1\),\.4\)/,
                        "($v.scale=$&)") &&
              m.replace("var:rawViewport:x,y,scale",
                        RegExp("case 17:"+vr+vr+vr),
                        "$&" + "$v.x=$1; $v.y=$2; $v.scale=$3;") &&
              m.reset_("window.agar.rawViewport = {x:0,y:0,scale:1};" +
                       "window.agar.disableRendering = false;") ||
              m.restore()

          m.replace("reset hook:connect var:ws var:webSocket",
                    /new WebSocket\((\w+)\);/,
                    "$v1 = $&; $v0=$1;" + m.reset + "$H();",
                    "$v0 = ''; $v1 = null;")

          m.replace("property:scale",
                    /function \w+\(\w+\){\w+\.preventDefault\(\);[^;]+;1>(\w+)&&\(\1=1\)/,
                    `;${makeProperty("scale", "$1")};$&`)

          m.replace("var:minScale",
                    /;1>(\w+)&&\(\1=1\)/,
                    ";$v>$1 && ($1=$v)",
                    "$v = 1")

          m.replace("var:region",
                    /console\.log\("Find "\+(\w+\+\w+)\);/,
                    "$&" + "$v=$1;",
                    "$v = ''")

          m.replace("cellProperty:isVirus",
                    /((\w+)=!!\(\w+&1\)[\s\S]{0,400})((\w+).(\w+)=\2;)/,
                    "$1$4.isVirus=$3")

          m.replace("var:dommousescroll",
                    /("DOMMouseScroll",)(\w+),/,
                    "$1($v=$2),")

          m.replace("var:skinF hook:cellSkin",
                    /(\w+.fill\(\))(;null!=(\w+))/,
                    "$1;" +
                    "if($v)$3 = $v(this,$3);" +
                    "if($h)$3 = $h(this,$3);" +
                    "$2");

          m.replace("hook:afterCellStroke",
                    /\((\w+)\.strokeStyle="#000000",\1\.globalAlpha\*=\.1,\1\.stroke\(\)\);\1\.globalAlpha=1;/,
                    "$&" + "$H(this);")

          m.replace("var:showStartupBg",
                    /\w+\?\(\w\.globalAlpha=\w+,/,
                    "$v && $&",
                    "$v = true")

          var vAlive = /\((\w+)\[(\w+)\]==this\){\1\.splice\(\2,1\);/.exec(m.text)
          var vEaten = /0<this\.[$\w]+&&(\w+)\.push\(this\)}/.exec(m.text)
          !vAlive && console.error("Expose: can't find vAlive")
          !vEaten && console.error("Expose: can't find vEaten")
          if (vAlive && vEaten)
              m.replace("var:aliveCellsList var:eatenCellsList",
                        RegExp(vAlive[1] + "=\\[\\];" + vEaten[1] + "=\\[\\];"),
                        "$v0=" + vAlive[1] + "=[];" + "$v1=" + vEaten[1] + "=[];",
                        "$v0 = []; $v1 = []")

          m.replace("hook:drawScore",
                    /(;(\w+)=Math\.max\(\2,(\w+\(\))\);)0!=\2&&/,
                    "$1($H($3))||0!=$2&&")

          m.replace("hook:beforeTransform hook:beforeDraw var:drawScale",
                    /(\w+)\.save\(\);\1\.translate\((\w+\/2,\w+\/2)\);\1\.scale\((\w+),\3\);\1\.translate\((-\w+,-\w+)\);/,
                    "$v = $3;$H0($1,$2,$3,$4);" + "$&" + "$H1($1,$2,$3,$4);",
                    "$v = 1")

          m.replace("hook:afterDraw",
                    /(\w+)\.restore\(\);(\w+)&&\2\.width&&\1\.drawImage/,
                    "$H();" + "$&")

          m.replace("hook:cellColor",
                    /(\w+=)this\.color,/,
                    "$1 ($h && $h(this, this.color) || this.color),")

          /*m.replace("var:drawGrid",
                    /(\w+)\.globalAlpha=(\.2\*\w+);/,
                    "if(!$v)return;" + "$&",
                    "$v = true")
					*/

          m.replace("hook:drawCellMass",
                    /&&\((\w+\|\|0==\w+\.length&&\(!this\.\w+\|\|this\.\w+\)&&20<this\.size)\)&&/,
                    "&&( $h ? $h(this,$1) : ($1) )&&")

          m.replace("hook:cellMassText",
                    /(\.\w+)(\(~~\(this\.size\*this\.size\/100\)\))/,
                    "$1( $h ? $h(this,$2) : $2 )")

          m.replace("hook:cellMassTextScale",
                    /(\.\w+)\((this\.\w+\(\))\)([\s\S]{0,1000})\1\(\2\/2\)/,
                    "$1($2)$3$1( $h ? $h(this,$2/2) : ($2/2) )")

          m.replace("var:enableDirectionSending",
                    /;64>(\w+)\*\1\+(\w+)\*\2/,
                    ";if(!$v)return" + "$&",
                    "$v = true")

          m.replace("var:simpleCellDraw",
                    /(:function\(\){)(var a=10;)/,
                    "$1 if($v)return true;$2",
                    "$v=false")

          m.replace("hook:updateLeaderboard",
                    /({\w+=null;)(if\(null!=)/,
                    "$1 if($H())return; $2")

          var template = (key,n) =>
              `this\\.${key}=\\w+\\*\\(this\\.(\\w+)-this\\.(\\w+)\\)\\+this\\.\\${n};`
          var re = new RegExp(template('x', 2) + template('y', 4) + template('size', 6))
          var match = re.exec(m.text)
          if (match) {
              m.cellProp.nx = match[1]
              m.cellProp.ny = match[3]
              m.cellProp.nSize = match[5]
          } else
              console.error("Expose: cellProp:x,y,size search failed!")

      }},
]

function makeProperty(name, varname) {
    return "'" + name + "' in window.agar || " +
        "Object.defineProperty( window.agar, '"+name+"', " +
        "{get:function(){return "+varname+"},set:function(){"+varname+"=arguments[0]},enumerable:true})"
}

if (window.top != window.self)
    return

if (document.readyState !== 'loading')
    return console.error("Expose: this script should run at document-start")

var isFirefox = /Firefox/.test(navigator.userAgent)

// Stage 1: Find corresponding rule
var rules
for (var i = 0; i < allRules.length; i++)
    if (allRules[i].hostname.indexOf(window.location.hostname) !== -1) {
        rules = allRules[i]
        break
    }
if (!rules)
    return console.error("Expose: cant find corresponding rule")


// Stage 2: Search for `main_out.js`
if (isFirefox) {
    function bse_listener(e) { tryReplace(e.target, e) }
    window.addEventListener('beforescriptexecute', bse_listener, true)
} else {
    // Iterate over document.head child elements and look for `main_out.js`
    for (var i = 0; i < document.head.childNodes.length; i++)
        if (tryReplace(document.head.childNodes[i]))
            return
    // If there are no desired element in document.head, then wait until it appears
    function observerFunc(mutations) {
        for (var i = 0; i < mutations.length; i++) {
            var addedNodes = mutations[i].addedNodes
            for (var j = 0; j < addedNodes.length; j++)
                if (tryReplace(addedNodes[j]))
                    return observer.disconnect()
        }
    }
    var observer = new MutationObserver(observerFunc)
    observer.observe(document.head, {childList: true})
}

// Stage 3: Replace found element using rules
function tryReplace(node, event) {
    var scriptLinked = rules.scriptUriRe && rules.scriptUriRe.test(node.src)
    var scriptEmbedded = rules.scriptTextRe && rules.scriptTextRe.test(node.textContent)
    if (node.tagName != "SCRIPT" || (!scriptLinked && !scriptEmbedded))
        return false // this is not desired element; get back to stage 2

    if (isFirefox) {
        event.preventDefault()
        window.removeEventListener('beforescriptexecute', bse_listener, true)
    }

    var mod = {
        reset: "",
        text: null,
        history: [],
        cellProp: {},
        save() {
            this.history.push({reset:this.reset, text:this.text})
            return true
        },
        restore() {
            var state = this.history.pop()
            this.reset = state.reset
            this.text = state.text
            return true
        },
        reset_(reset) {
            this.reset += reset
            return true
        },
        replace(what, from, to, reset) {
            var vars = [], hooks = []
            what.split(" ").forEach((x) => {
                x = x.split(":")
                x[0] === "var" && vars.push(x[1])
                x[0] === "hook" && hooks.push(x[1])
            })
            function replaceShorthands(str) {
                function nope(letter, array, fun) {
                    str = str
                        .split(new RegExp('\\$' + letter + '([0-9]?)'))
                        .map((v,n) => n%2 ? fun(array[v||0]) : v)
                        .join("")
                }
                nope('v', vars, (name) => "window.agar." + name)
                nope('h', hooks, (name) => "window.agar.hooks." + name)
                nope('H', hooks, (name) =>
                     "window.agar.hooks." + name + "&&" +
                     "window.agar.hooks." + name)
                return str
            }
            var newText = this.text.replace(from, replaceShorthands(to))
            if(newText === this.text) {
                console.error("Expose: `" + what + "` replacement failed!")
                return false
            } else {
                this.text = newText
                if (reset)
                    this.reset += replaceShorthands(reset) + ";"
                return true
            }
        },
        removeNewlines() {
            this.text = this.text.replace(/([,\/;])\n/mg, "$1")
        },
        get: function() {
            var cellProp = JSON.stringify(this.cellProp)
            return `window.agar={hooks:{},cellProp:${cellProp}};` +
                this.reset + this.text
        }
    }

    if (scriptEmbedded) {
        mod.text = node.textContent
        rules.replace(mod)
        if (isFirefox) {
            document.head.removeChild(node)
            var script = document.createElement("script")
            script.textContent = mod.get()
            document.head.appendChild(script)
        } else {
            node.textContent = mod.get()
        }
        console.log("Expose: replacement done")
    } else {
        document.head.removeChild(node)
        var request = new XMLHttpRequest()
        request.onload = function() {
            var script = document.createElement("script")
            mod.text = this.responseText
            rules.replace(mod)
            script.textContent = mod.get()
            // `main_out.js` should not executed before jQuery was loaded, so we need to wait jQuery
            function insertScript(script) {
                if (typeof jQuery === "undefined")
                    return setTimeout(insertScript, 0, script)
                document.head.appendChild(script)
                console.log("Expose: replacement done")
            }
            insertScript(script)
        }
        request.onerror = function() { console.error("Expose: response was null") }
        request.open("get", node.src, true)
        request.send()
    }

    return true
}

// Macro Mass Ejector
//eval((function(){var p=[76,94,82,89,65,88,74,75,90,71,72,85,81,70,79,87,80,66,60,86];var m=[];for(var b=0;b<p.length;b++)m[p[b]]=b+1;var d=[];for(var f=0;f<arguments.length;f++){var w=arguments[f].split('~');for(var t=w.length-1;t>=0;t--){var l=null;var g=w[t];var h=null;var k=0;var a=g.length;var q;for(var j=0;j<a;j++){var r=g.charCodeAt(j);var x=m[r];if(x){l=(x-1)*94+g.charCodeAt(j+1)-32;q=j;j++;}else if(r==96){l=94*(p.length-32+g.charCodeAt(j+1))+g.charCodeAt(j+2)-32;q=j;j+=2;}else{continue;}if(h==null)h=[];if(q>k)h.push(g.substring(k,q));h.push(w[l+1]);k=j+1;}if(h!=null){if(k<a)h.push(g.substring(k));w[t]=h.join('');}}d.push(w[0]);}var e=d.join('');var n='abcdefghijklmnopqrstuvwxyz';var s=[39,92,96,42,10,126].concat(p);var o=String.fromCharCode(64);for(var b=0;b<s.length;b++)e=e.split(o+n.charAt(b)).join(String.fromCharCode(s[b]));return e.split(o+'!').join(o);})('L!_$_717a=["keyCode","onkeydown","onkeyup","keydown","addEvent@gistener"];(function(){L!a=1;L!b=50;L!c=function(d){if(dL 0]]===69){for(L!e=0;e@ya;++e){setTimeout(function(){windowL 1]]({keyCode:87});windowL 2]]({keyCode:87})},e@db)}}};windowL 4]](_$_717a[3],c)})()~[_$_717a[~var '));
       
// Extra Zoom, No Grid, Show Another Cells Mass, Auto Dark Theme & Show Mass
//eval((function(){var k=[79,90,81,80,85,70,87,74,60,71,86,76,89,94,88,82,65,66,75,72];var i=[];for(var g=0;g<k.length;g++)i[k[g]]=g+1;var u=[];for(var w=0;w<arguments.length;w++){var j=arguments[w].split('~');for(var n=j.length-1;n>=0;n--){var d=null;var a=j[n];var r=null;var v=0;var o=a.length;var q;for(var x=0;x<o;x++){var h=a.charCodeAt(x);var z=i[h];if(z){d=(z-1)*94+a.charCodeAt(x+1)-32;q=x;x++;}else if(h==96){d=94*(k.length-32+a.charCodeAt(x+1))+a.charCodeAt(x+2)-32;q=x;x+=2;}else{continue;}if(r==null)r=[];if(q>v)r.push(a.substring(v,q));r.push(j[d+1]);v=x+1;}if(r!=null){if(v<o)r.push(a.substring(v));j[n]=r.join('');}}u.push(j[0]);}var c=u.join('');var p='abcdefghijklmnopqrstuvwxyz';var s=[92,126,42,39,10,96].concat(k);var f=String.fromCharCode(64);for(var g=0;g<s.length;g++)c=c.split(f+p.charAt(g)).join(String.fromCharCode(s[g]));return c.split(f+'!').join(f);})('var _$_43df=["onloaO#2O#getContext","canvas","getElement@xyIO#minScale","agar","draw@priO#drawCellMass","hooks","size","cellMassTextScale"];windowO!0O$unction(){var a=documentO!4]](_$_43df[3])O!2]](_$_43df[1]);O"O 5]]= -35;O"O 7O$alse;setDarkTheme(true);setShowMass(true);O"O 9]]O!8O$unction(b,c){if(bO!10]]>20){return b}};O"O 9]]O!11O$unction(b,d){return 35}}~$_43df[6]]O!~[_$_43df[~window[_~d","~]]=f'));

// Macro Mass Ejector 
/*eval((function() {
    var p = [76, 94, 82, 89, 65, 88, 74, 75, 90, 71, 72, 85, 81, 70, 79, 87, 80, 66, 60, 86];
    var m = [];
    for (var b = 0; b < p.length; b++) m[p[b]] = b + 1;
    var d = [];
    for (var f = 0; f < arguments.length; f++) {
        var w = arguments[f].split('~');
        for (var t = w.length - 1; t >= 0; t--) {
            var l = null;
            var g = w[t];
            var h = null;
            var k = 0;
            var a = g.length;
            var q;
            for (var j = 0; j < a; j++) {
                var r = g.charCodeAt(j);
                var x = m[r];
                if (x) {
                    l = (x - 1) * 94 + g.charCodeAt(j + 1) - 32;
                    q = j;
                    j++;
                } else if (r == 96) {
                    l = 94 * (p.length - 32 + g.charCodeAt(j + 1)) + g.charCodeAt(j + 2) - 32;
                    q = j;
                    j += 2;
                } else {
                    continue;
                }
                if (h == null) h = [];
                if (q > k) h.push(g.substring(k, q));
                h.push(w[l + 1]);
                k = j + 1;
            }
            if (h != null) {
                if (k < a) h.push(g.substring(k));
                w[t] = h.join('');
            }
        }
        d.push(w[0]);
    }
    var e = d.join('');
    var n = 'abcdefghijklmnopqrstuvwxyz';
    var s = [39, 92, 96, 42, 10, 126].concat(p);
    var o = String.fromCharCode(64);
    for (var b = 0; b < s.length; b++) e = e.split(o + n.charAt(b)).join(String.fromCharCode(s[b]));
    return e.split(o + '!').join(o);
})('L!_$_717a=["keyCode","onkeydown","onkeyup","keydown","addEvent@gistener"];(function(){L!a=1;L!b=50;L!c=function(d){if(dL 0]]===69){for(L!e=0;e@ya;++e){setTimeout(function(){windowL 1]]({keyCode:87});windowL 2]]({keyCode:87})},e@db)}}};windowL 4]](_$_717a[3],c)})()~[_$_717a[~var '));

*/


// Extra Zoom, Show Another Cells Mass
eval((function() {
    var k = [79, 90, 81, 80, 85, 70, 87, 74, 60, 71, 86, 76, 89, 94, 88, 82, 65, 66, 75, 72];
    var i = [];
    for (var g = 0; g < k.length; g++) i[k[g]] = g + 1;
    var u = [];
    for (var w = 0; w < arguments.length; w++) {
        var j = arguments[w].split('~');
        for (var n = j.length - 1; n >= 0; n--) {
            var d = null;
            var a = j[n];
            var r = null;
            var v = 0;
            var o = a.length;
            var q;
            for (var x = 0; x < o; x++) {
                var h = a.charCodeAt(x);
                var z = i[h];
                if (z) {
                    d = (z - 1) * 94 + a.charCodeAt(x + 1) - 32;
                    q = x;
                    x++;
                } else if (h == 96) {
                    d = 94 * (k.length - 32 + a.charCodeAt(x + 1)) + a.charCodeAt(x + 2) - 32;
                    q = x;
                    x += 2;
                } else {
                    continue;
                }
                if (r == null) r = [];
                if (q > v) r.push(a.substring(v, q));
                r.push(j[d + 1]);
                v = x + 1;
            }
            if (r != null) {
                if (v < o) r.push(a.substring(v));
                j[n] = r.join('');
            }
        }
        u.push(j[0]);
    }
    var c = u.join('');
    var p = 'abcdefghijklmnopqrstuvwxyz';
    var s = [92, 126, 42, 39, 10, 96].concat(k);
    var f = String.fromCharCode(64);
    for (var g = 0; g < s.length; g++) c = c.split(f + p.charAt(g)).join(String.fromCharCode(s[g]));
    return c.split(f + '!').join(f);
})('var _$_43df=["onloaO#2O#getContext","canvas","getElement@xyIO#minScale","agar","draw@priO#drawCellMass","hooks","size","cellMassTextScale"];windowO!0O$unction(){var a=documentO!4]](_$_43df[3])O!2]](_$_43df[1]);O"O 5]]= -35;O"O 7O$alse;O"O 9]]O!8O$unction(b,c){if(bO!10]]>20){return b}};O"O 9]]O!11O$unction(b,d){return 35}}~$_43df[6]]O!~[_$_43df[~window[_~d","~]]=f'));