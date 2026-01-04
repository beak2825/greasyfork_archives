// ==UserScript==
// @name         netflix progress indicator
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  adds div with the current title and time use 't' to add "hidden" style to the div along with some default style
// @author       RakSrinaNa
// @match        https://www.netflix.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432571/netflix%20progress%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/432571/netflix%20progress%20indicator.meta.js
// ==/UserScript==

function title_getter() {
    var on = false;
    var sessionId = null;
    function getVideoPlayerApi(){
        return netflix.appContext.state.playerApp.getAPI().videoPlayer;
    }
    function getSessionIds(){
        return getVideoPlayerApi().getAllPlayerSessionIds();
    }
    function getCurrentSessionId(){
        for(const id of getSessionIds()) {
            let playbackState = getVideoPlayerApi().getPlaybackStateBySessionId(id);
            if(playbackState.playbackType === "STANDARD"){
                return id;
            }
        }
        return null;
    }
    function refresh_enabled () {
        sessionId = getCurrentSessionId();
    }
    function time() {
        try {
            if(sessionId){
                let playbackState = getVideoPlayerApi().getPlaybackStateBySessionId(sessionId);
                let cur = +playbackState.currentTime;
                let dur = +playbackState.duration;
                let rem = dur - cur;
                return { cur: cur, dur: dur, rem: rem };
            }
        } catch(e) {}
        return { cur: 0, dur: 0, rem: 0 };
    }
    return { time, refresh_enabled, enabled: function () { return sessionId !== null; } };
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
   var data = title_getter();
   function fmt_time(mil) {
        mil = mil | 0;
        var s = parseInt(mil / 1000);
        var h = (s / 3600)|0;
        s = s - h * 3600;
        var m = (s / 60)|0;
        s = s - m * 60;
        return `${p(h)}:${p(m)}:${p(s)}`;
    }
    var time = node("time");
    var wholeTitleNode = node("myTitleNode", [time.n]);
    // css
    var style = CreateStyle();
    style.addRule(".myTitleNode.hidden").setDeclaration("display", "none");
    style.addRule(".myTitleNode").setDeclarations({
        bottom: "10px",
        position: "fixed",
        left: "10px",
        color: "white",
        right: "10px",
        "z-index": "100",
        "font-size": "2em"
    });
    style.addRule(".myTitleNode .title").setDeclaration("float", "right");
    style.addRule(".myTitleNode .time").setDeclarations({
        float: "left",
        "font-size": "1.2em",
        "-webkit-text-stroke": "1px black",
        "paint-order": "stroke fill"
    });

    document.body.appendChild(wholeTitleNode.n);
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
        let t = data.time();
        time.set(`${fmt_time(t.cur)} / ${fmt_time(t.dur)} | -${fmt_time(t.rem)}`);
    }
    setInterval(refresh, 250);
})();