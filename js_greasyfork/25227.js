// ==UserScript==
// @name         Downvote Drumph
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  /r/The_Donald = garbage
// @author       fuck_donald_trump
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25227/Downvote%20Drumph.user.js
// @updateURL https://update.greasyfork.org/scripts/25227/Downvote%20Drumph.meta.js
// ==/UserScript==
(()=>{
    'use strict';
    var m=()=>{
        var u = $("[name=uh]").val(), w = 0,
		done = JSON.parse(localStorage.getItem("downvoted_d")||"[]"),
		current = (/\/r\/([^\/]*)\//.exec(window.location)||['',''])[1],
		timeouts = [],
        d = (l, r, e)=>{
			if(l.length){
				w=0;
				console.log((e?"Up":"Down")+"voting "+(e?"":"& removing ")+l.length+" posts from /r/"+r+".");
				l.each((i, v)=>{ k(v, e); });
			}
        },
		k=(m, e)=>{
            var name = $(m).attr("data-fullname"), b=true;
            for(var i=0; i<done.length; i++) if(done[i].n === name){ b=false; break; }
            if(b&&m){
                w += Math.random() * 2000 + 1000;
                timeouts.push(setTimeout((m, done, e)=>{
                    done.push({n: name, d: new Date().getTime()});
                    localStorage.setItem("downvoted_d", JSON.stringify(done));
                    $.post("/api/vote?dir="+(e?"1":"-1")+"&id="+name,{ uh: u });
                    if(e) $(m).find(".arrow").removeClass("up").addClass("upmod");
                }, w, m, done, e));
            }
			if(!e) $(m).hide();
            return b;
        },
		g=()=>{
			for(var i=0; i<down.length; i++) d($("[data-subreddit="+down[i]+"]"), down[i]);
			for(var j=0; j<up.length; j++) d($("[data-subreddit="+up[j]+"]"), up[j], true);
		},
		restart=()=>{
			for(var i=0; i<timeouts.length; i++) clearTimeout(timeouts[i]);
			timeouts = [];
			g();
		};
		
		document.body.addEventListener("DOMNodeInserted", (e)=>{
            if(e.target.tagName==="DIV" && ($(e.target).attr("id")||"").indexOf("siteTable")>-1){
                for(var i=0; i<down.length; i++) d($(e.target).find("[data-subreddit="+down[i]+"]"), down[i]);
				for(var j=0; j<up.length; j++) d($(e.target).find("[data-subreddit="+up[j]+"]"), up[j], true);
			}
        }, true);

        setInterval(()=>{
            var d = new Date().getTime() - (60000*48);
            for(var i=0; i<done.length; i++){
                if(done[i].d < d)
                    done.splice(i, 1);
            }
            localStorage.setItem("downvoted_d", JSON.stringify(done));
        }, 30000);
		
		var down = JSON.parse(localStorage.getItem("down_d")||"[\"The_Donald\"]"),
		up = JSON.parse(localStorage.getItem("up_d")||"[]");
		
        if(down.indexOf(current)>-1) setInterval(()=>{ window.location.reload(); }, 60000+Math.random() * 10000);
		g();
    };

    $("body")
		.append($("<script>").attr("type", "text/javascript").html("("+m.toString()+")();"));
})();