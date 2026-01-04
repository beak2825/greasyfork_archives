// ==UserScript==
// @name         Plex CurrentTime
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Always display current time
// @author       RakSrinaNa
// @match        https://plex.ds920.rakambda.fr/*
// @match        https://app.plex.tv/*
// @icon         https://e1.pngegg.com/pngimages/253/744/png-clipart-clay-os-6-a-macos-icon-plex-yellow-arrow.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425886/Plex%20CurrentTime.user.js
// @updateURL https://update.greasyfork.org/scripts/425886/Plex%20CurrentTime.meta.js
// ==/UserScript==

function title_getter() {
    var vid, title = "", on = false;
    function refresh_title () {
        try {
            let divs = document.querySelectorAll("[data-qa-id=metadataTitleLink]");
            title = Array.from(divs).map((x)=>x.textContent).join(" - ");
        } catch(e) {
            title = "";
        }
    }
    function refresh_enabled () {
        vid = document.querySelector("video");
        if(vid === null && on) {
            on = false;
            return;
        }
        if(vid !== null && !on) {
            on = true;
        }
    }
    function time() {
        try {
            let cur = +vid.currentTime;
            let dur = +vid.duration;
            let rem = dur - cur;
            return { cur: cur, dur: dur, rem: rem };
        } catch(e) {
            return { cur: 0, dur: 0, rem: 0 };
        }
    }
    function buffer() {
        try {
            let start = +vid.buffered.start(0);
            let end = +vid.buffered.end(0);
            let length = end - start;
            return { start: start, end: end, length: length };
        } catch(e) {
            return { start: 0, end: 0, length: 0 };
        }
    }
    return { title: function () { return title; }, time, buffer, refresh_title, refresh_enabled, enabled: function () { return on; } };
}

function reappend (n) {
    var w = document.querySelector(".sizing-wrapper");
    if(w !== null){
        if(w.contains(n)) {
            return;
        }
        w.appendChild(n);
    }
}
 function node(cls, c) {
     var parent = document.createElement("div");
     var text = document.createTextNode("");
     parent.appendChild(text);
     if(c != null) {
         for(var n of c) {
             parent.appendChild(n);
         }
     }
     var current;
     var hidden = false;
     parent.className = cls;
     return {
         n: parent,
         set: function (value) {
             if(value == null) {
                 return;
             }
             value = value.toString();
             if(current != value) {
                 text.textContent = value;
                 current = value;
             }
         },
         hide: function () { if(hidden) return; hidden = true; parent.className = cls + " hidden"; },
         show: function () { if(!hidden) return; hidden = false; parent.className = cls; }
     };
 }

function p(number) {
   return (number < 10 ? '0' : '') + number;
}

var CreateStyle = function () {
	function DynamicCss () {
		var s = document.createElement("style");
		s.setAttribute("type", "text/css");
		s.setAttribute("rel", 'stylesheet');
		s.setAttribute("media", 'screen');
		document.head.appendChild(s);
		this.e_container = s;
		this.rules = {};
	}

    var state = 0;
	DynamicCss.prototype = {
		addRule: function (name, selector) {
            if(arguments.length == 1) {
                selector = name;
                name = ++state;
            }
			if(this.rules[name]) {
				return this.rules[name];
            }
			var r = this.rules[name] = new DynamicRule(selector);
			this.e_container.appendChild(r.e_container);
            console.log("RULE", this);
			return r;
		},
		getRule: function (name) {
			return this.rules[name];
		},
		removeRule: function (name) {
			if(this.rules[name]) {
				var r = this.rules[name];
				delete this.rules[name];
				this.e_container.removeChild(r.e_container);
			}
		}
	};

	function DynamicRule (selector) {
		var rule = this.e_container = document.createDocumentFragment();
		rule.appendChild(document.createTextNode(selector + "{"));
		var innerRule = this.e_rules = document.createTextNode("");
		rule.appendChild(innerRule);
		rule.appendChild(document.createTextNode("}\n"));
		this.rules = {};
	}
	DynamicRule.prototype = {
        setDeclarations: function (declarations) {
            for(var key in declarations) {
                this.rules[key] = declarations[key];
            }
			this.redraw();
		},
		setDeclaration: function (key, value) {
			this.rules[key] = value;
			this.redraw();
		},
		removeDeclaration: function (key) {
			delete this.rules[key];
			this.redraw();
		},
		redraw: function () {
			var rule = "", a = this.rules, isFirst = true;
			for(var key in a){
				rule += (!isFirst?";":(isFirst=false||"")) + key + ":" + a[key];
			}
			this.e_rules.nodeValue = rule;
		}
	};

    return function () { return new DynamicCss(); }
}();

(function() {
    'use strict';

     var data = title_getter();
     function fmt_time(s) {
        s = s | 0;
        var h = (s / 3600)|0;
        s = s - h * 3600;
        var m = (s / 60)|0;
        s = s - m * 60;
        if(h === 0 && m === 0){
            return `::${p(s)}`;
        }
        if(h === 0){
            return `:${p(m)}:${p(s)}`;
        }
        return `${p(h)}:${p(m)}:${p(s)}`;
    }
    var title = node("title");
    var time = node("time");
    var progressT = node("progressT");
    var progressB = node("progressB");
    var wholeTitleNode = node("myTitleNode", [title.n, time.n, progressT.n, progressB.n]);
    // css
    var style = CreateStyle();
    style.addRule(".myTitleNode.hidden").setDeclaration("display", "none");
    style.addRule(".myTitleNode").setDeclarations({
        bottom: "10px",
        position: "fixed",
        left: "0px",
        color: "white",
        right: "0px",
        "z-index": "1101",
        "font-size": "2em",
        "font-family": "fantasy",
        "-webkit-text-stroke": "1.5px black",
        "pointer-events": "none",
    });
    style.addRule(".myTitleNode .title").setDeclarations({
        "float": "right",
        "display": "none",
        "padding-right": "10px",
    });
    style.addRule(".myTitleNode .time").setDeclarations({
        "float": "left",
        "padding-left": "10px",
    });
    style.addRule(".myTitleNode .progressT").setDeclarations({
        "background-color": "orange",
        "height": "5px",
        "border-radius": "10px",
        "position": "fixed",
        "bottom": "0",
        "z-index": "1102",
    });
    style.addRule(".myTitleNode .progressB").setDeclarations({
        "background-color": "#b95a00",
        "height": "5px",
        "border-radius": "10px",
        "position": "fixed",
        "bottom": "0",
    });

    document.body.appendChild(wholeTitleNode.n);
    setInterval(data.refresh_title, 5000);
    var shown = true;
    document.body.addEventListener('keypress', function (e) {
        if(e.key == 't') {
            shown = shown ? false : true;
            refresh();
        }
    });

    function refresh () {
        data.refresh_enabled();
        reappend(wholeTitleNode.n);
        if(data.enabled() && shown) {
            wholeTitleNode.show();
        } else {
            wholeTitleNode.hide();
            return;
        }
        var my_tit = data.title();
        title.set(my_tit);

        let t = data.time();
        let b = data.buffer();
        //time.set(`${fmt_time(t.cur)} / ${fmt_time(t.dur)} | -${fmt_time(t.rem)}`);
        time.set(`${fmt_time(t.cur)}`);

        let percentT = 100 * t.cur / t.dur;
        let percentB = 100 * b.end / t.dur;
        progressT.n.style.width = `${percentT}%`
        progressB.n.style.width = `${percentB}%`
    }
    setInterval(refresh, 500);
})();