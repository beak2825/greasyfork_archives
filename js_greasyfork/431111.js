// ==UserScript==
// @name           turkopticon.net
// @version        2021.08.23.1
// @description    Review requesters on Amazon Mechanical Turk
// @author         Lilly Irani, Six Silberman, Phil, anonymous contributors
// @homepage       https://turkopticon.net
// @include        http://*.mturk.com/*
// @include        https://*.mturk.com/*
// @namespace      https://greasyfork.org/users/431111
// @downloadURL https://update.greasyfork.org/scripts/431111/turkopticonnet.user.js
// @updateURL https://update.greasyfork.org/scripts/431111/turkopticonnet.meta.js
// ==/UserScript==

var TURKOPTICON_BASE = "https://turkopticon.net/";
var API_BASE = "https://turkopticon.net/api/";
var API_MULTI_ATTRS_URL = API_BASE + "multi-attrs.php?ids=";

function getRequesterAnchorsAndIds(a) {
  //a is a list of anchor DOM elements derived in the previous function
  var rai = {};
  var requesterRegex = new RegExp(/requesterId=([0-9A-Z]+)|\/requesters\/([0-9A-Z]+)\/projects/);
  var rf = new RegExp(/contact/);
  var isContactLink = new RegExp(/Contact/);
  var isImgButton = new RegExp(/img/);
  var requestersHere = false;

  for (var i = 0; i < a.length; i++) {
    var href = a[i].getAttribute('href');
    var requesterIdMatch = requesterRegex.exec(href);
    if ((requesterIdMatch) /*&& !rf.test(href)*/ ) {
      var innards = a[i].innerHTML;
      if (!isContactLink.test(innards) && !isImgButton.test(innards)) {
        var id = requesterIdMatch[1] || requesterIdMatch[2];
        if (!rai.hasOwnProperty(id)) {
          rai[id] = [];
        }
        rai[id].push(a[i]);
        requestersHere = true;
      }
    }
  }

  rai = (requestersHere) ? rai : null;
  return rai;
}

function buildXhrUrl(rai) {
  var url = API_MULTI_ATTRS_URL;
  var ri = Object.keys(rai);
  for(var i = 0; i < ri.length; i++) {
    url += ri[i];
    if (i < ri.length - 1) { url += ","; }
  }
  return url;
}

function makeXhrQuery(url) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false);
  xhr.send(null);
  var resp = JSON.parse(xhr.response);
  return resp;
}

function ul(cl, inner) {
  return "<ul class='" + cl + "'>" + inner + "</ul>"; }

function li(cl, inner) {
	return "<li class='" + cl + "'>" + inner + "</li>"; }

function span(cl, inner) {
	return "<span class='" + cl + "'>" + inner + "</span>"; }

function strmul(str, num) {
	return Array(num + 1).join(str); }

function pad(word, space) {
	if (word.length >= space) { return word; }
	else { return word + strmul("&nbsp;", space - word.length); } }

function long_word(word) {
	switch(word) {
		case "comm": return "communicativity"; break;
		case "pay" : return "generosity"; break;
		case "fair": return "fairness"; break;
    case "fast": return "promptness"; break; 
    default: return word; break; } }

function visualize(i, max, size) {
	var color;
	if (i / max <= 2 / 5) { color = 'red'; }
	else if (i / max <= 3 / 5) { color = 'yellow'; }
	else { color = 'green'; }
  var filled = Math.round((i / max) * size);
	var unfilled = size - filled;
	var bar = span("bar", span(color, strmul("&nbsp;", filled)) + span("unf", strmul("&nbsp;", unfilled)));
  return bar; }

function visualize_buckets(i, max, size, bucket) {
	var color;
	if (bucket == "$15+") { color = 'green'; }
	else if (bucket == "$10-$15" || bucket == "$7-$10") { color = 'yellow'; }
	else { color = 'red'; }
  var filled = Math.round((i / max) * size);
	var unfilled = size - filled;
	var bar = span("bar", span(color, strmul("&nbsp;", filled)));// + span("unf", strmul("&nbsp;", unfilled)));
	return bar; }

function attr_html_max(n, i, max, size, bucket) {
	return pad(n, 7) + ": " + visualize_buckets(i, max, size, bucket); }

function attr_html(n, i) {
	return pad(long_word(n), 15) + ": " + visualize(i, 5, 25) + "&nbsp;" + i + " / 5"; }

function ro_html(ro, hide_generosity) {
	var rohtml = "";
	if (typeof ro.attrs != 'undefined') {
		var keys = Object.keys(ro.attrs);
		for (var i = 0; i < keys.length; i++) {
      if (!(keys[i] == "pay" && hide_generosity))
        rohtml += li("attr", attr_html(keys[i], ro.attrs[keys[i]])); } }
	return rohtml; }

function what(ro) {
	var str = "";
	if (typeof ro.attrs != 'undefined') {
		str =  li("link", `<a target="_blank"href=${TURKOPTICON_BASE}help#pay_buckets>Where is pay/hr?</a>&nbsp<a target="_blank" href='` + TURKOPTICON_BASE + "help#attr'>What do these scores mean?</a>"); }
	return str; }

function nrs(rid, nrevs) {
	var str = "";
	if (typeof nrevs === 'undefined') {
		str = "<li>No reviews for this requester</li>"; }
	else { str = "<li>Scores based on&nbsp;<a target=\"_blank\" href='" + TURKOPTICON_BASE + rid + "'>" + nrevs + " reviews</a></li>"; }
	return str; }

function tos(tosflags) {
	var str = "<li>Terms of Service violation flags: " + tosflags + "</li>";
	return str; }

function rl(rid, name, hitid, hitname) {
	var rl = "<li><a href='" + TURKOPTICON_BASE + "report?requester[amzn_id]=" + rid;
       	rl    += "&requester[amzn_name]=" + name + "&report[hit_id]=" + hitid + "&report[hit_names]=" + hitname + "'>";
	rl    += "Report your experience with this requester &raquo;</a></li>";
  return rl; }
  
function pay_buckets(buckets) {
  var rohtml = "";
  var maxVal = 0;
  for (var i = 0; i < buckets.length; i++) {
    maxVal = buckets[i][1] > maxVal ? buckets[i][1] : maxVal; }
  if (!maxVal) return li("attr", "&nbspno data");
  for (var i = 0; i < buckets.length; i++) {
    rohtml += li("attr", attr_html_max(buckets[i][0], buckets[i][1], maxVal, 20, buckets[i][0])); }
  return rohtml;
}

function div(cl, content) { return `<div class=${cl}>${content}</div>`; }
function allBucketsZero(buckets) { for(i=0; i<buckets.length; i++) { if (buckets[i][1] != 0) return false; } return true; }

function dropDown(ro, rid, hitid, hitname) {
	var n = ro.name;
  var arrcls = "";
  var has_data = ro.pay_buckets && !allBucketsZero(ro.pay_buckets);
	if (typeof ro.attrs != 'undefined') { arrcls = "toc"; }
	var dd = ul("tob", li(arrcls, "&#9660;") + div("tom", div("to_original_attrs", ro_html(ro, has_data)) + div("to_pay_buckets", has_data ? div("to_pay_label", li("attr", "pay/<br>hr"))+div("to_pay_display", pay_buckets(ro.pay_buckets)) : "") + div("turkopticon_info",what(ro) + nrs(rid, ro.reviews) + tos(ro.tos_flags) + rl(rid, n, hitid, hitname))));
	return dd; }

function insertInlineCss() {
  if (document.getElementsByClassName("detail-bar-label")[0] &&
    document.getElementsByClassName("detail-bar-label")[0].innerText.indexOf("Requester") == 0) {
    document.getElementsByClassName("detail-bar-label")[0].parentNode.style.overflow = "visible";
  }

    var head = document.getElementsByTagName("head")[0],
        style = document.createElement('style'),
        css = ".tob, .tom { list-style-type: none; padding-left: 0; }\n";
    css += ".tob { float: left; margin-right: 5px; }\n";
    css += ".tob > .tom { display: none; position: absolute; background-color: #ebe5ff; border: 1px solid #aaa; padding: 5px; z-index: 10;}\n";
    css += ".tob:hover > .tom { display: flex; }\n";
    css += ".tob:hover { padding-right: 30px; }\n";
    css += ".tob > li { border: 1px solid #9db9d1; background-color: #ebe5ff; color: #00c; padding: 3px 3px 1px 3px; }\n";
    css += ".tob > li.toc { color: #f33; }\n";
    css += "@media screen and (-webkit-min-device-pixel-ratio:0) { \n .tob { margin-top: -5px; } \n}\n";
    css += ".attr { font-family: Monaco, Courier, monospace; color: #333; }\n";
    css += ".bar { font-size: 0.6em; display: inline-flex; align-items: center; }\n";
    css += ".unf { background-color: #ddd; }\n";
    css += ".red { background-color: #f00; }\n";
    css += ".yellow { background-color: #f90; }\n";
    css += ".green { background-color: #6c6; }\n";
    css += ".gray_link { margin-bottom: 15px; }\n";
    css += ".gray_link a { color: #666; }\n";
    css += ".tob > .tom > .to_pay_buckets { display: flex; padding-left: 20px; }\n";
    css += ".tob > .tom > .turkopticon_info { padding-left: 20px; }\n";
    css += ".tob > .tom > .to_pay_buckets > .to_pay_label { padding-right: 5px; }\n";
    style.textContent = css;
    head.appendChild(style);
}


function getNames(rai, resp) {
	for(var rid in rai) {
		if (rai.hasOwnProperty(rid)) {
			if (resp[rid] == "") {  // empty response, no data in Turkopticon DB for this ID
				resp[rid] = JSON.parse('{"name": "' + rai[rid][0].innerHTML.split("</span>")[0].split(">")[1] + '"}');
			}
            // overwrite name attribute of response object from page:
      if (rai[rid][0].innerText == "HITs") {
        resp[rid].name = rai[rid][3].innerText;
      } else {
        resp[rid].name = rai[rid][0].innerHTML;
      }
    }
  } // .split("</span>")[0].split(">")[1]; /* deprecated due to MTurk interface change */
	return resp; }

function insertDropDowns(rai, resp) {
	for(var rid in rai) {
		if (rai.hasOwnProperty(rid)) {
			for(var i = 0; i < rai[rid].length; i++) {
        var td = rai[rid][i].parentNode;
				if (td.parentNode.parentNode.childNodes.length > 5) {
          if (td.parentNode.parentNode.childNodes[5].childNodes[0].childNodes[0])
            var check = td.parentNode.parentNode.childNodes[5].childNodes[0].childNodes[0].getAttribute("href");
					if (check != null) {
						var hitid = td.parentNode.parentNode.childNodes[5].childNodes[0].childNodes[0].getAttribute("href").match(/\/([A-Z0-9]+)\//)[1];
					} else { 
						var hitid = "";
					}
				} else {
					var hitid = "";
        }
        if (td.parentNode.parentNode.childNodes[1]) {
          var hitname = td.parentNode.parentNode.childNodes[1].getAttribute("title");
        }
				td.innerHTML = dropDown(resp[rid], rid, hitid, hitname) + " "  + td.innerHTML;
      }
    }
  }
}

insertInlineCss();
var a  = document.getElementsByTagName('a');
var reqAnchors = getRequesterAnchorsAndIds(a);
if (reqAnchors) {
    var url = buildXhrUrl(reqAnchors);
    var resp = makeXhrQuery(url);
    resp = getNames(reqAnchors, resp);
    insertDropDowns(reqAnchors, resp);
}
