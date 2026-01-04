// ==UserScript==
// @name        High School Sports Schedules in Plain Text
// @namespace   http://michrev.com/
// @description A tool for grabbing High School sports schedules on all the school sites (VNN) and also maxpreps.com and sports.deseret.com, and converting them into a simple plain text format for easy compilation and printing. By StevenRoy
// @include     *schedule*
// @include     *maxpreps.com/*
// @include     *sports.deseret.com/*
// @version     0.26
// @grant       none
// @run-at      document-start
// @supportURL  https://greasyfork.org/en/users/934871
// @downloadURL https://update.greasyfork.org/scripts/447764/High%20School%20Sports%20Schedules%20in%20Plain%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/447764/High%20School%20Sports%20Schedules%20in%20Plain%20Text.meta.js
// ==/UserScript==

"use strict";

//     _____________  __    __
//    / ___________/ /  \,-' /
//   / /__    ___   / /\,-/ / StevenRoy was here
//   \___ \  / __\ / /   / /
//______/ / / /   / /   / /   02023.10.20
//_______/ /_/   /_/   /_/

	window.addEventListener('beforescriptexecute', killtheadmiral); // ,true (?)
if (top===self /*&& top.document.constructor=== HTMLDocument*/) { // weird things happen when loading images or PDF files?
	document.addEventListener("DOMContentLoaded", function(){
		console.log("We got DOMContentLoaded - readyState:",document.readyState);
//    document.removeEventListener("DOMContentLoaded", arguments.callee, false); // Required? I doubt it!
		performTheMagic(document);
	},false);
} else { console.log('Frame did a weird thing',top,"!==",self); }

function performTheMagic(D){
	if (top.location.href.match(/\/{2}[w.]{0,4}maxpreps\.com\/print\/schedule/i)) { return mpprintmode(D); }
	if (top.location.href.match(/\/{2}[w.]{0,4}maxpreps\.com/i)) { return waitfornextthing('MCS/mpmode',mpmode); }
	if (top.location.href.match(/\/{2}[w.]{0,4}sports\.deseret\.com/i)) { return waitfornextthing('MCS/dnmode',dnmode); }
	var t=D.location.pathname.match(/schedule/i);
	if (!(t && t.length)) return;
//	t=D.getElementsByClassName("gFMfPS");
	t=D.getElementById("event-list-table");
	if (t) { return vnnmode(D,t); }
	console.log('MCS: Found schedule page without schedule');
}

function tcboo(l,f,e) { // there can be only one
	if (l && l.length==1) { return f(l[0]); }
	else if (e) return e(l); // failure function
}

function trims(s) { return s.trim().replace(/ {2,}/g," "); }

var plink;
// TODO: better template format, user-configurable templates
const _rrr={ // the raw row renderer
	thisteam:'', // NOTE: reset() does not clear this one!
	reset() { this.d='TBD'; this.t='TBD'; this.ht=false; this.vt=false; this.ot=false; this.away=false; this.extra=''; },
//	template='date time @o'; // Fri Aug 27 7:00 PM @ Granger
	_template:'dxvt', // date, visitor@home team, time
	render() {
		return trims(this._template.split('').map((i)=>{
			switch(i){
				case 'd':
					return this.d; // "Fri Aug 20"
				case 't':
					return this.t; // "7:00 PM"
				case 'v':
					if (!(this.vt && this.ht)) {
						if (!(this.ot && this.thisteam)) throw ("RRR/v without teams set");
						if (this.away) { this.vt=this.thisteam; this.ht=this.ot; }
						else { this.ht=this.thisteam; this.vt=this.ot; }
					}
					return this.vt+" @ "+this.ht; // visitor @ home teams
				case 'o':
					if (!(this.ot)) {
						if (!(this.vt && this.ht && this.thisteam)) throw ("RRR/o without teams set");
						this.away=this.vt==this.thisteam;
						this.ot=this.away?this.ht:this.vt;
					}
					return (this.away?"":"@ ")+this.ot;
//				o += d+(r.opponentTeam.homeAwayType?" ":" @ ")+r.opponentTeam.name+"\n";

				case 'x':
					return ("extra" in this) ? this.extra : "";

				case ',':
				case ':':
				case '-':
					return i; // a literal character
				default:
					throw("RRR Template broke at character "+i);
			}
		}).join(' ').replace(/ [,:-]/g,",")); // no spaces before punctuation
	}
};

function hideparalink(){
	if (!plink) return;
	plink.style.display="none";
	plink.innerHTML='';
}

function createparalink(t,cb){ // TODO: Rethink this UI, make a menu or something
	if (!plink) {
		plink = document.createElement('a');
		plink.setAttribute('href', '#');
		plink.setAttribute('style', 'position:fixed; text-align:center; bottom:0px; right:0px; z-index:9099998;'+
		'border:3px solid #789; box-sizing:border-box; font-family: Courier New; font-weight: 700;' +
		'background:#bcd; margin:0; padding:6px; text-decoration:none; color:#456; font-size:15pt; line-height:14pt');

		document.body.appendChild(plink);
	}
	plink.innerHTML=t;
	plink.style.display="block";
	plink.onclick=(e)=>{
		if (!e) e=window.event;
		if (e.preventDefault) e.preventDefault();
		try { cb(); }
		catch (X) { window.alert("Well, that didn't work...\nInstead we got this:\n\n"+X); }
	};
}

function setClipboard(text,forcefallback) { // TODO: Test this in Vivaldi, it might be broken! (a Chromium quirk perhaps?)
	log("MCS: Setting clipboard"+(forcefallback?" (fallback)":""),text);
	if (navigator.clipboard && navigator.clipboard.writeText && !forcefallback) { // Supported anywhere? Might remove.
		try {
			navigator.clipboard.writeText(text).then(function() {
				log('Async: Copying to clipboard was successful!');
				window.alert("The following text has been copied to your clipboard:\n\n"+text);
			}, function(err) {
				console.error('Async: Could not copy text: ', err);
				setClipboard(text,1);
			});
		} catch (err) {
			console.error('Sync: Could not copy text: ', err);
			setClipboard(text,1);
		}
		return;
	}
	var textArea = document.createElement("textarea");
	textArea.value = text;
	textArea.style.position="fixed";// Avoid scrolling to bottom
	textArea.style.top = "0";
	textArea.style.left = "-9000px";
//	textArea.style.display= "none"; // Does this cause it to not work? Weird.
	document.body.appendChild(textArea); // Necessary too? Probably is!
	textArea.focus();
	textArea.select();

	try {
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
		log('Fallback: Copying text command was ' + msg);
		if (successful) { window.alert("The following text has been copied to your clipboard:\n\n"+text); }
	} catch (err) {
		console.error('Fallback: Oops, unable to copy', err);
	}
	document.body.removeChild(textArea);
}



function vnnmode(D,E){ // this covers most high school sites
	var rows=Array.from(E.getElementsByClassName("event")).filter(e=>!e.classList.contains('print-hide'));
	if (!rows.length) return;

// How to determine the current school name?
// Delving into all the "meta" tags could work but could it get messy?
// For example: <meta property="og:description" content="Davis High School"/>
tcboo(Array.from(document.head.getElementsByTagName("meta")).filter(n=>
n.hasAttribute("property")&&n.hasAttribute("content")&&n.getAttribute("property").match(/^og:description$/i)),n=>{
	_rrr.thisteam=n.getAttribute("content").replace(/ +high school.*$/i,'');
},e=>{
	_rrr.thisteam="(TEAM)";
}); // That wasn't so bad...?

	createparalink("Copy schedule<br />("+rows.length+" rows)<br />to clipboard",()=>{
		var o=''; // Output line: Tue, 11/24 7:00 PM Box Elder
		log('MCS: VNN mode. Rows:',rows);
		rows.forEach(e=>{
//			log('MCS: Row',e);
			tcboo(e.getElementsByClassName('date print-hide'),(tds)=>{
				_rrr.reset();
//				tds=tds[0]; o+=trims(tds.textContent).replace(/,/g,'');
// worse: <td class="date print-show" style="display:none;">    Fri, Dec 4      7:00 pm  </td>
// better: <td class="date print-hide pl-3 date-mobile" data-event-date="Mon, Nov 20" data-event-start-time=" 7:00 pm">
				let ta= tds.getAttribute("data-event-date")||"";
				ta=trims(ta).replace(/,/g,'');
				if (ta) _rrr.d=ta;
				ta= tds.getAttribute("data-event-start-time")||"";
				ta=trims(ta).replace(/,/g,'');
				if (ta) _rrr.t=ta;
// TODO: Might it eventually become really useful to parse that into a proper
// Date object so that it can be rendered by RRR with more template options?

				tcboo(e.getElementsByClassName('home-away'),(tds)=>{
					tds=trims(tds.textContent).toUpperCase();
					_rrr.away= (tds!='HOME'); // o += ' @';
				});

				tcboo(e.getElementsByClassName('opponent'),(tds)=>{
					_rrr.ot = trims(tds.textContent.replace(/ high school/i,''));
					tcboo(tds.parentNode.getElementsByClassName('event-name'),(tds)=>{
						tds=trims(tds.textContent); if (tds && (tds !== '-')) { _rrr.extra = ' '+tds; }
					});
				});
				o += _rrr.render()+"\n";
			});
		});
		if (o) { setClipboard(o); }
	});
}

/*
If they're going to keep changing the class names, we can't use them!
BUT the printable pages don't use the random names; should we try to load those instead?
https:// www.maxpreps.com/print/schedule.aspx?schoolid= # &ssid= # &print=1
How to extract schoolid/"teamId" and ssid/"sportSeasonId" from current page?

JSON.stringify(__NEXT_DATA__.props.pageProps.schedule[1])
And from all that, we need something that looks like: Fri 12/4 7:00 PM Pleasant Grove
__NEXT_DATA__.props.pageProps.schedule[0].isDeleted == true  *** WATCH OUT FOR "DELETED" ROWS!
*/

function mpmode(r){ // the maxpreps site
//	var r=window.__NEXT_DATA__;
//	if (!r) return log("__NEXT_DATA__ not found?");
//	r=r.props;
//	if (r) r=r.pageProps;
	if (r) r=r.schedule || r.contests; // A recent change?
	if (!(r && r.length)) { hideparalink(); return log("Schedule not found"); }
	r=r.filter(x=>!(x.isDeleted || x.opponentTeam.isTeamTBA || x.isDateTba)); // Gotta watch out for this!

	createparalink("Copy schedule<br />("+r.length+" rows)<br />to clipboard",()=>{
enterlogsection('MCS/mpmode',()=>{

		var o='';
		r.forEach((r)=>{
			_rrr.reset();
			var d=r.isDateTba||r.isTimeTba;
			if (d) { d="TBD"; } else {
				d=new Date(r.date); // "2022-08-12T19:00:00" -> 8/12 7:00pm
				_rrr.d=d.toDateString().replace(/ +[0-9]{4}$/,''); // "Fri Dec 04 2020"
				_rrr.t=d.toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'}); // "7:00 PM"
			}
			if (r.currentTeam && !_rrr.thisteam) { _rrr.thisteam=r.currentTeam.name; }
			if (!r.opponentTeam) { return log('No opponent team?',r); } // Skip this if no team info
//			if (r.opponentTeam.isTeamTBA) {
//				o += d+(r.opponentTeam.homeAwayType?" ":" @ ")+"TBA\n";
//			} else {
				_rrr.away=!r.opponentTeam.homeAwayType;
//				if (!r.opponentTeam.name) { return log('Opponent team has no name?',r); }
				_rrr.ot=r.opponentTeam.name || "(No name?)";
//				o += d+(r.opponentTeam.homeAwayType?" ":" @ ")+r.opponentTeam.name+"\n";
			if (r.location) { _rrr.extra=r.location; } // Extra game info, not always location?
				o += _rrr.render()+"\n";
//			}
		});

/* THE OLD WAY and guess how often this breaks and why...
		t=E.getElementsByClassName('kefwvP');
		if (t && t.length) { Array.from(t).forEach(r=>{ // The "featured" game(s?)
			console.log("MCS/mpmode: processing featured:",r);
			to='';
			tt=r.getElementsByClassName('foHRy');
			if (!(tt && tt.length==1)) { return; } // skip this row if we don't find date
			to=trims(tt[0].textContent).replace(/,/g,'');
			tt=r.getElementsByClassName('dfAURx');
			if (!(tt && tt.length==1)) { return; } // skip this row if we don't find time
			to+=" "+trims(tt[0].textContent);
			tt=r.getElementsByClassName('homeAway');
			if (!(tt && tt.length==1)) { return; } // skip this row if we don't find home/away
			tt=trims(tt[0].textContent);
			if (tt.match(/^away/i)) to += ' @';
			tt=r.getElementsByClassName('hdmKYN');
			if (!(tt && tt.length==2)) { return; } // didn't find opponent team name
			o+=to+' '+trims(tt[1].textContent)+"\n"; // opponent team name ...and then we done!
		}); } else console.log("MCS/mpmode: no featured?",t);

		t=E.getElementsByClassName('guknjX');
		if (t && t.length) { Array.from(t).forEach(r=>{ // The other games
			console.log("MCS/mpmode: processing row:",r);
			to=trims(r.textContent).replace(/,/g,'');
			t=r.nextSibling;
			if (!t) { console.log("MCS/mpmode: Borked row, date but no time?",r,to); return; }
			to += ' '+trims(t.textContent);
			r=r.parentNode.parentNode; // this should point to the tr now
			tt=r.getElementsByClassName('cKEqht');
			if (!(tt && tt.length==1)) { console.log("MCS/mpmode: no home/away"); return; } // didn't find home/away
			tt=trims(tt[0].textContent);
			if (tt.match(/^away/i)) to += ' @';
			tt=r.getElementsByClassName('align-x'); // They don't even use their random class names consistently!?
			if (!(tt && tt.length==1)) { console.log("MCS/mpmode: no align-x"); return; }
			tt=tt[0].children; // But at least we can (apparently) get to it this way...
			if (!(tt && tt.length>=1)) { console.log("MCS/mpmode: no name element"); return; }
			o+=to+' '+trims(tt[0].textContent.replace(/ high school/i,''))+"\n"; // Replace probably unnecessary here?
		}); } else console.log("MCS/mpmode: no rows?",t);
*/
		if (o) { setClipboard(o); }
});
	});
}

function mpprintmode(D) { // schedule print page - VERY different!
	var r=D.getElementById("schedule");
	if (r) r=r.getElementsByClassName('dual-contest');
	if (!(r && r.length)) return log("Schedule not found",r);

	createparalink("Copy schedule<br />("+r.length+" rows)<br />to clipboard",()=>{
enterlogsection('MPPrint',()=>{

		var o='';
		if (utag_data && utag_data.schoolName) {
			_rrr.thisteam=utag_data.schoolName.toUpperCase().replace(/ \(.*\)$/,"")
				.replace(/([A-Z])([A-Z]+)/g,(m,a,b)=>{return a+b.toLowerCase(); }); // Mixed case (because page does toLowerCase() to it)
		}
		Array.from(r).forEach((r)=>{
			_rrr.reset();
/*			var d=r.isDateTba||r.isTimeTba;
			if (d) { d="TBD"; } else { */
			var t,d=r.getElementsByClassName('event-time');
			if (d && d[0] && d[0].textContent.toUpperCase()!='TBD') {
				t=new Date(d[0].getAttribute("title")+".000Z"); // "2022-08-13T02:00:00" -> 8/12 7:00pm ???
				_rrr.d=t.toDateString().replace(/ +[0-9]{4}$/,''); // "Fri Dec 04 2020"
//				_rrr.t=t.toLocaleTimeString('en',{timeStyle:'short',hour:'numeric',minute:'2-digit'}); // "7:00 PM"
// information here seems to be in the wrong TZ? (we get 8 PM instead of 7) So instead we just...
				_rrr.t=d[0].innerText; // "7:00p", assume correct time zone in the plain text
// (And it's worse if we don't add the ".000Z" above. Never had to do that before.)
// TODO: Parsing event-date seems potentially easier. Getting those numbers into a Date object less so though.
			}

//			if (!(r.home && r.home.team)) { return log('No home team?',r); } // Skip this if no team info
//			if (!(r.visitor && r.visitor.team)) { return log('No home team?',r); } // Skip this if no team info
//			_rrr.ht=r.home.team.name;
//			_rrr.vt=r.visitor.team.name;
			t=r.getElementsByClassName('contest-name');
			if (t && t[0]) {
				t=t[0].innerText.replace(/ \(.*\)$/,"");
				if (t.match(/^@ /)) {
					_rrr.away=true;
					t=t.substr(2);
				}
				_rrr.ot=t; // opposing team
			}
			t=r.getElementsByClassName('contest-location');
			if (t && t[0]) {
				t=t[0].textContent.match(/^Game Details: (.+)$/);
				if (t && t[1]) _rrr.extra=t[1];
			}
			o += _rrr.render()+"\n";
		});

		if (o) { setClipboard(o); }
});
	});

}

/*
Very surprisingly, Deseret News also uses __NEXT_DATA__ ...Though in a different way so we need a different parser.
*/

function dnmode(r){
//	var r=window.__NEXT_DATA__;
//	if (!r) return log("__NEXT_DATA__ not found?");
//	r=r.props;
//	if (r) r=r.pageProps;
	if (r) {
		if (r.team && r.team.name) { _rrr.thisteam= r.team.name; } // TODO: Implement this in the other modes?
		r=r.previousMatchupGames;
	}
	if (!(r && r.length)) return log("Schedule not found",r);
//	r=r.filter(x=>!(x.isDeleted || x.opponentTeam.isTeamTBA || x.isDateTba)); // Gotta watch out for this?

	createparalink("Copy schedule<br />("+r.length+" rows)<br />to clipboard",()=>{
enterlogsection('MCS/dnmode',()=>{

		var o='';
		r.forEach((r)=>{
			_rrr.reset();
/*			var d=r.isDateTba||r.isTimeTba;
			if (d) { d="TBD"; } else { */
				var d=new Date(r.date);
				_rrr.d=d.toDateString().replace(/ +[0-9]{4}$/,''); // "Fri Dec 04 2020"
				_rrr.t=d.toLocaleTimeString('en',{hour:'numeric',minute:'2-digit'}); // "7:00 PM"
//			}

			if (!(r.home && r.home.team)) { return log('No home team?',r); } // Skip this if no team info
			if (!(r.visitor && r.visitor.team)) { return log('No home team?',r); } // Skip this if no team info

			_rrr.ht=r.home.team.name;
			_rrr.vt=r.visitor.team.name;
			if (r.tournament) _rrr.extra=r.tournament;

			o += _rrr.render()+"\n";
		});

		if (o) { setClipboard(o); }
});
	});
}

var logsection='';
function enterlogsection(n,c,p){
	var ols=logsection;
	log('ENTERING SECTION:',n);
	if (ols==='') { logsection=n; } else { logsection+="/"+n; }
	try { if (p) { c(p); } else { c(); } }
	catch (X) { console.error(logsection+" EXCEPTION: ",X); }
	logsection=ols;
	log('LEFT SECTION:',n);
}
function log() {
	console.log(logsection,...arguments);
}
function retry(count,condfunc,delay,scb,fcb,param) {
	if (count<1) return fcb&&fcb(param); // failed
	if (condfunc(param)) return scb&&scb(param); // condition returns true to indicate success
	return window.setTimeout(()=>{ retry(count-1,condfunc,delay,scb,fcb,param); },delay);
}
function waitfornextthing(lsname,func){
	retry(20,(p)=>{ // conditional
		var e;
		p.c++;
		if (e=window.__NEXT_DATA__) {
			if (e.props && e.props.pageProps) { p.e=e.props.pageProps; return true; } // success
			p.cn++;
		}
		return false;
	},500,(p)=>{
		log("After "+p.c+" pageProps searches and "+p.cn+" invalid results...");
		enterlogsection(lsname,func,p.e);
		var lasturl=top.location.href;
		next.router.events.on('routeChangeStart',(u)=>{ // OH THANK GOODNESS this exists and is usable...
			if (u!=lasturl) {
//				window.alert("Going to:\n"+u);
				lasturl=u; hideparalink();
// When a different page is navigated to, new __NEXT_DATA__ is read by the site JS but not stored in an
// accessible variable, so we need to force a full page load every time. SO ANNOYING!
				if (u.match(/schedule\./i)) { top.location.replace(u); return; } // A cheap workaround but it works!
			}
		});
	},(p)=>{
		log("FAILED After "+p.c+" pageProps searches and "+p.cn+" invalid results.");
	},{c:0,cn:0});
}

function killtheadmiral(e) {
	if (e.target.src!="") return;
	var et=e.target.innerText;
	function yeskillit() { e.preventDefault(); e.stopPropagation(); console.log('*zzzap!*'); }

//	console.log("Checking:",et);

// This is a thing on MaxPreps site that makes it obnoxious.
// (Checking for it on all sites is probably overkill - but that's better than underkill.)
	if (et.match(/cbsoptanon/)) {
		console.log('Killed an Admiral script');
		return yeskillit(); // *zzzap!*
	}
	if (et.replace(/[ \t\n\r]+/g,'')=="window.print();") { // Maxpreps print page doesn't need this!
		console.log('Killed automatic-printing script');
//		window.print=function(){ throw(new ReferenceError("Intercepted")); };
		return yeskillit(); // *zzzap!*
	}
}

