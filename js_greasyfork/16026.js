// ==UserScript==
// @name		[Konachan] Count Dibs
// @namespace	Zolxys
// @description	Counts the Dibs lists and shows shows each value if different than listed. Adds buttons at the top of the list to show details or change the viewing mode. Remembers last used settings. *Relies on case by case formatting corrections listed at the top of the script.
// @include		/^https?://konachan\.(com|net)/forum/show/10888(/|\?|$)/
// @exclude		/^[^?#]+\?([^&#]&)*page=(?!1(&|#|$))/
// @version		1.1
// @downloadURL https://update.greasyfork.org/scripts/16026/%5BKonachan%5D%20Count%20Dibs.user.js
// @updateURL https://update.greasyfork.org/scripts/16026/%5BKonachan%5D%20Count%20Dibs.meta.js
// ==/UserScript==
var characterColor = '#0f0';
var postColor = '#00f';
var headerColor = '#f00';
var otherColor = '#f00';
var countedColor = '#0f0';
var characterLimit = 35;
var postLimit = 20;

// Note: Corrections don't change how any text appears.  They only change how the text is treated when parsed by this script.  So only the placement of key words and characters really matters.
// Note: Each correction pair will be made to match in length. Longer corrections will be cropped and shorter corrections will be padded at the end with spaces.
var corrections = [
	[' and a few catgirls',' and a,few,catgirls'], // Cuda/Kumacuda
	['Broad Clain:','Broad Claim:'], // Cade
	['Hyperdimension Neptunia Neptune','Hyperdimension Neptuni: Neptune'], // Anpan
	['All Kantoku original characters including','All Kantoku original characters includin:'], // Wiresetc
	[' and others.',',--- others:'], // Wiresetc
	['. Harusaki Hinako',', Harusaki Hinako'], // Wiresetc
	['Black Cat;','Black Cat:'], // Freenight
	['Creed Diskenth.','Creed Diskenth;'], // Freenight
	['Baccano;','Baccano:'], // Freenight
	['Claire Stanfield.','Claire Stanfield;'], // Freenight
	// Shared
	['Senjougahara Hitagi',':'],
	['Irisviel von Einzbern',':'],
	['Hanekawa Tsubasa',':'],
	['Ayase Yue',':'],
[]];

corrections.length = corrections.length-1;
for (var i = 0; i < corrections.length; ++i) {
	corrections[i][1] = (corrections[i][1] + ' '.repeat(corrections[i][0].length)).substr(0, corrections[i][0].length);
	corrections[i][0] = new RegExp(corrections[i][0].replace(/([.*+?^${()|[\\])/g, '\\$1'), 'gi');
}
if (!localStorage.Zolxys_CountDibsDetails)
	localStorage.Zolxys_CountDibsDetails = '';
if (!localStorage.Zolxys_CountDibsExpanded)
	localStorage.Zolxys_CountDibsExpanded = '';
var o = document.getElementById('forum').getElementsByClassName('body')[1]
var st = document.createElement('style');
document.head.appendChild(st);
var ex = document.createElement('input');
ex.type = 'button';
ex.className = 'zolDibsDetails';
ex.addEventListener('click', function (e) {
	if (this.value == 'Expand') {
		st.textContent = '.zolDibsOpenBr:before { content:"\\A"; white-space: pre; }';
		this.value = 'Collapse';
		localStorage.Zolxys_CountDibsExpanded = 'Set';
	}
	else {
		st.textContent = '';
		this.value = 'Expand';
		localStorage.Zolxys_CountDibsExpanded = '';
	}
});
o.insertBefore(ex, o.firstChild);
ex.value = ((localStorage.Zolxys_CountDibsExpanded)? 'Expand' : 'Collapse');
ex.click();
var ne = document.createElement('input');
ne.type = 'button';
ne.addEventListener('click', function (e) {
	if (this.value == 'Show Details') {
		ex.value = (ex.value == 'Expand')? 'Collapse' : 'Expand';
		ex.click();
		this.value = 'Hide Details';
		localStorage.Zolxys_CountDibsDetails = 'Set';
	}
	else {
		st.textContent = '.zolDibsDetails { display:none; }';
		this.value = 'Show Details';
		localStorage.Zolxys_CountDibsDetails = '';
	}
});
o.insertBefore(ne, o.firstChild);
ne.value = ((localStorage.Zolxys_CountDibsDetails)? 'Show Details' : 'Hide Details');
ne.click();
var c = o.childNodes;
function getTextNodeAt(o,n) {
	var p = o;
	var c = 0;
	var a = o.childNodes;
	for (var i = 0; i < a.length; ++i) {
		var l = a[i].textContent.length;
		if (c + l < n)
			c += l;
		else if (a[i].nodeType == 1)
			return getTextNodeAt(a[i],n-c);
		else if (a[i].nodeType == 3)
			return [a[i], n-c];
	}
	alert('Error finding text position in object');
	return [o.nextSibling, 0];
}
function colorObjectRange (d,p,l,c) { // d[node ref, type, start, end], p(start), length, color
	var s = null, e = null;
	for (var i = d.length-1; i >= 0; --i)
	 if (d[i][2] <= p) {
		s = i;
		break;
	}
	if (s == null) {
		alert('Error finding range start.');
		return;
	}
	var pe = p+l;
	for (var i = s; i < d.length; ++i)
	 if (pe <= d[i][3]) {
		e = i;
		break;
	}
	if (e == null) {
		alert('Error finding range end.');
		return;
	}
	var br = document.createElement('span');
	br.style.color = c;
	br.textContent = '['
	br.className = 'zolDibsOpenBr zolDibsDetails';
	var off = p-d[s][2];
	var rn = d[s][0];
	if (off && d[s][1] == 'o') {
		var tn = getTextNodeAt(rn, off);
		rn = tn[0];
		off = tn[1];
		--d[s][2];
	}
	if (off) {
		var ne = document.createTextNode(rn.textContent.substr(0,off));
		rn.parentNode.insertBefore(ne, rn);
		rn.textContent = rn.textContent.substr(off);
		if (d[s][1] == 't')
			d[s][2] += off;
	}
	rn.parentNode.insertBefore(br, rn);
	br = document.createElement('span');
	br.style.color = c;
	br.textContent = ']'
	br.className = 'zolDibsDetails';
	rn = d[e][0];
	if (pe == d[e][3])
		rn = rn.nextSibling;
	else {
		off = pe-d[e][2];
		if (d[e][1] == 'o') {
			var tn = getTextNodeAt(rn, off);
			rn = tn[0];
			off = tn[1];
			--d[e][2];
		}
		var ne = document.createTextNode(rn.textContent.substr(0,off));
		rn.parentNode.insertBefore(ne, rn);
		rn.textContent = rn.textContent.substr(off);
		if (d[e][1] == 't')
			d[e][2] += off;
	}
	rn.parentNode.insertBefore(br, rn);
}
for (var p = 0; p < c.length; ++p) {
	if (c[p].nodeType != 1)
		continue;
	var l = c[p].getElementsByTagName('a');
	if (l.length && /^https?:\/\/konachan\.(com|net)\/user\/show\/\d+(\/|$)/.test(l[0].href)) {
		if (!/Characters \(.+\/\d+\) ~ Posts \(.+\/\d+\)/i.test(c[++p].textContent))
			o.insertBefore(document.createElement('h6'), c[p]).appendChild(document.createTextNode('Characters (?/'+ characterLimit +') ~ Posts (?/'+ postLimit +')'));
		var br = 0;
		var d = [];
		var to = c[p++];
		var s = '';
		var tc = 0, tp = 0;
		for (; p < c.length; ++p) {
			if (c[p].nodeType == 1) {
				if (c[p].tagName == 'BR') {
					if (++br == 2)
						break;
					d.push([c[p],'o',s.length,s.length+1]);
					s += '\n';
					continue;
				}
				br = 0;
				d.push([c[p],'o',s.length]);
			}
			else {
				br = 0;
				if (c[p].nodeType == 3)
					d.push([c[p],'t',s.length]);
				else
					continue;
			}
			s += c[p].textContent;
			d[d.length-1][3] = s.length;
		}
		var silent = true;
		for (var i = 0; i < corrections.length; ++i)
			s = s.replace(corrections[i][0], corrections[i][1]);
		var r, ss, rs = s, n = 0;
		while (true) {
			if (r = /^\s+/.exec(rs)) {
				rs = rs.substr(r[0].length);
				n += r[0].length;
			}
			if (rs == '')
				break;
			if (r = /^(Broad Claim|Artist|User)s?:/i.exec(rs)) {
				rs = rs.substr(r[0].length);
				var sum = r[0].length;
				if (r = /^(?:.*?(?:\((?:.*?(?:\((?:.*?(?:\(.*?\))?)*?\))?)*?\))?)*?(;|\n|$)/.exec(rs)) { // Tests for first occurence of (;|\n|$) excluding any ; that appears between ().  Supports nested () depth of 3.
					rs = rs.substr(r[0].length);
					sum += r[0].length;
				}
				else {
					alert('Error in RegExp');
					return;
				}
				colorObjectRange(d, n, sum - ((r)? r[1].length : 0), otherColor);
				n += sum;
			}
			else if ((r = /^\w+;\w+(:)/.exec(rs)) || (r = /^(?:.*?(?:\((?:.*?(?:\((?:.*?(?:\(.*?\))?)*?\))?)*?\))?)*?([,;:&\n]| and |$)/.exec(rs))) { // As above. Tests for ([,;:&\n]| and |$) excluding ([,;:&]| and ) between ().
				// The first test above is to accomodate a ; in a header without spaces (ie. Steins;Gate:, Robotics;Notes:, Chäos;HEAd:)
				if (r[1] == ':')
					colorObjectRange(d, n, r[0].length, headerColor);
				else {
					ss = rs.substr(0, r[0].length - r[1].length);
					if (/^post #\d+\.?\s*$/.test(ss)) {
						++tp;
						colorObjectRange(d, n, ss.trim().length, postColor);
					}
					else if (/\(user\)\s*$/i.test(ss))
						colorObjectRange(d, n, ss.trim().length, otherColor);
					else if (ss.trim().length) {
						++tc;
						colorObjectRange(d, n, ss.trim().length, characterColor);
					}
				}
				rs = rs.substr(r[0].length);
				n += r[0].length;
			}
			else {
				alert('Error in RegExp');
				return;
			}
		}
		var rx = /^(([^]*?Characters \(\s*(.+?))\s*\/\d+\) ~ Posts \(\s*(.+?))\s*\/\d+\)/i;
		if (r = rx.exec(to.textContent)) {
			var ne, tn, rn, off;
			if (r[4] != ''+tp) {
				tn = getTextNodeAt(to, r[1].length);
				rn = tn[0];
				off = tn[1];
				if (off) {
					ne = document.createTextNode(rn.textContent.substr(0,off));
					rn.parentNode.insertBefore(ne, rn);
					rn.textContent = rn.textContent.substr(off);
				}
				ne = document.createElement('span');
				ne.style.color = countedColor;
				ne.textContent = '('+ tp +')';
				rn.parentNode.insertBefore(ne, rn);
			}
			if (r[3] != ''+tc) {
				tn = getTextNodeAt(to, r[2].length);
				rn = tn[0];
				off = tn[1];
				if (off) {
					ne = document.createTextNode(rn.textContent.substr(0,off));
					rn.parentNode.insertBefore(ne, rn);
					rn.textContent = rn.textContent.substr(off);
				}
				ne = document.createElement('span');
				ne.style.color = countedColor;
				ne.textContent = '('+ tc +')';
				rn.parentNode.insertBefore(ne, rn);
			}
		}
	}
}