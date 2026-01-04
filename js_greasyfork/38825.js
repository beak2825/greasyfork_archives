// HEY YOU!
// THIS SCRIPT WORKS ONLY ON mbasic.facebook.com DAMN only
// update - safer: 10 mins before the deadline! x'3
// ==UserScript==
// @name         FB LifEvents
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://mbasic.facebook.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/38825/FB%20LifEvents.user.js
// @updateURL https://update.greasyfork.org/scripts/38825/FB%20LifEvents.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function tparse(x){
		x = x < 0 ? -x : x;
        function z(x){return x < 10 ? "0" + (x>>0) : x>>0;}
        var d = x / 86400;
        var h = x / 3600 % 24;
        var m = x / 60 % 60;
        var s = x % 60;
        return z(d)+":"+z(h)+":"+z(m)+":"+z(s);
    }
	var schedule = [
		{
			date: new Date("2018/1/1 00:00:00"),
			ids: "IDS SEPARATED BY COMMA ONLY! NO GODDAMN SPACE!!111 xD ",
			msg: "TYPE GODDAMN MESSAGE HERE", ended: false,
			name: "U forgot to name me .-."
		}
	], fapi = {
		fbdtsg: "", tmr: 0,
		send: function(i, m, f, r){
			$.get("/messages/compose/?ref=dbl").done(function(d){
				d = d.split("g\" value=\"")[1].split("\"")[0];
				var p = "fb_dtsg="+d+"&body="+encodeURIComponent(m)+"&Send=Login&ids["+i+"]="+i+"&text_ids["+i+"]=Aki";
				$.post("/messages/send/?icm=1&ref=dbl", p).done(function(r){
					if (f instanceof Function)
						f(1 + r.indexOf(m));
				});
				if (r instanceof Function) r();
			});
		}, listen: function(){
			fapi.tmr = setInterval(function(){
				schedule.forEach(function(s, n){
					var nd = new Date(), diff = (nd - s.date)/1e3;
					if (diff >= .5 && diff < 3 && !s.ended)
					{
						s.ended = 1;
						var i = 0, ids = s.ids.split(","), d = new Date();
						(function next(id){
							if (id) fapi.send(id, s.msg, 0, function(){
								next(ids[i++]);
							});
							else console.log("Lasted", new Date() - d, "[s]");
						})(ids[i++]);
					}
					else if (diff < .5)
						console.log("Awaiting #", s.name||n, tparse(diff));
				});
			}, 1000);
		}
	};
	fapi.listen();
})();