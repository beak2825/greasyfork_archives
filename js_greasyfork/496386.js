// ==UserScript==
// @name     clash.gg battle case picker info
// @version  5.2
// @grant    none
// @match https://clash.gg/
// @match https://clash.gg/*
// @match https://clash.gg/csgo-case-battles
// @license MIT
// @match https://clash.gg/csgo-case-battles/*
// @namespace https://clash.gg/csgo-case-battles
// @description A utility script for when you are creating battles with community cases on clash.gg
// @downloadURL https://update.greasyfork.org/scripts/496386/clashgg%20battle%20case%20picker%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/496386/clashgg%20battle%20case%20picker%20info.meta.js
// ==/UserScript==
function parse(f, a) {
 if (f === 'false') {return false}
 if (f === 'true') {return true}
 if (a) {return false}
 return true
}
var style = `
.css-ihatethis {
	border-width: 1px;
  border-color: transparent;
  letter-spacing: 0.05em;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 100ms;
  border-radius: 0.25rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  --tw-bg-opacity: 1;
  background-color: rgb(255 216 25 / var(--tw-bg-opacity));
  background-image: repeating-linear-gradient(-45deg, transparent, transparent 1rem, rgba(21, 23, 25, 0.1) 0px, rgba(21, 23, 25, 0.1) 2rem);
  font-weight: 700;
  --tw-text-opacity: 1;
  color: rgb(31 34 37 / var(--tw-text-opacity));
  margin-left: 10px;
}
.css-ihatethis:hover {
	opacity: 0.5;
}
.css-1xd8rdf {
	border-width: 1px;
	border-color: transparent;
	letter-spacing: 0.05em;
	transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: 100ms;
	border-radius: 0.25rem;
	padding: 0.625rem 1rem;
	font-size: 0.875rem;
	line-height: 1.25rem;
	--tw-bg-opacity: 1;
	background-color: rgb(255 216 25 / var(--tw-bg-opacity));
	background-image: repeating-linear-gradient(-45deg, transparent, transparent 1rem, rgba(21, 23, 25, 0.1) 0px, rgba(21, 23, 25, 0.1) 2rem);
	font-weight: 700;
	--tw-text-opacity: 1;
	color: rgb(31 34 37 / var(--tw-text-opacity));
	display: flex;
	-moz-box-align: center;
	align-items: center;
	-moz-box-pack: center;
	justify-content: center;
	gap: 0.5rem;
	position: relative;
}
.css-1xd8rdf:hover {
	opacity: 0.5;
}
.css-customadd {
	padding: 3%;
  border: 1px solid gray;
  display: flex;
  max-width: 80%;
  text-align: center;
  gap: 7%;
}
.css-customaddinput {
	border: 1px solid gray;
  background-color: rgb(31 34 37);
  max-width: 50%;
  display: flex;
  text-indent: 5%;
  color: rgb(237 237 237);
  border-radius: 6px;
}
.css-customaddinput:focus {
	outline: none;
}
.css-customaddbtn {
  text-align: center;
  display: flex;
  font-weight: bold;
  padding-left: 3%;
  aspect-ratio: 1/1;
  background-color: #151719;
  border: 1px solid black;
  border-radius: 6px;
}
.css-topstngs {
	border: #666666 1px solid;
  border-radius: 6px;
  display: flex;
  padding-left: 0.5%;
  padding-right: 0.5%;
  max-width: 50%;
  gap: 15%;
}
.css-fundinginput {
	background-color: rgb(31 34 37);
  border: #666666 1px solid;
  border-radius: 6px;
  display: flex;
  width: 35%;
  color: rgb(237 237 237);
  text-indent: 5%;
}
.css-funding {
	display: flex;
  align-items: center;
  gap: 5%;
}

.css-fundinginput:focus {
	outline: none;
}
` //for some reason, the style for the Create Battle button doesnt exist immediately, but is created after a case is added
var func = `
function make(va) {
	var price = va.price / 100
  var readyRoi = 0
  for (var item of va.items) {
  	var chance = (item.ticketsEnd - item.ticketsStart) / 100000
    readyRoi += chance * (item.price / 100)
  }
  readyRoi /= price
  return "\\nROI: "+(readyRoi*100).toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 0})+"%"
}
var saves = {}
function opar(iter, dt) {
	if (iter == undefined) {return}
	for (var a of iter.childNodes) {
  	var o = a.getElementsByClassName("css-1x8hsc6")
  	if (o.length > 0) {
    	var alt = o[0].alt
      for (var i of dt) {
      	if (i['name'] == alt) {
        	//thats the element, now we just add the valid info
          var pr = a.getElementsByClassName("css-l2m0a2")
          if (pr.length > 0) {
          	if (pr[0].getElementsByClassName("css-commsn").length === 0) { //actually no idea why, but for some reason clash sends requests about cases twice (or maybe its my fault)
              var comm = i['commissionRate'] * 100
              var red = comm * 85
              var green = 255 - red
              var d = document.createElement("div")
              pr[0].appendChild(d)
              d.className = "css-lop1as"
              var locDoOpens = document.doOpens;
              var locDoLikes = document.doLikes;
              var locDoGetRoi = document.doGetRoi;
              var locDoCommission = document.doCommission;
              var div = document.createElement('div')
              div.style = "color: rgb(" + red + ", " + green + ", 0)"
              div.innerText = "COMMISSION: " + comm.toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 0}) + "%"
              div.className = "css-commsn"
              var span = document.createElement('span')
              var opens = i['timesOpened']
              if (opens == undefined) { opens = "?" }
              var likes = i['timesLiked']
              if (likes == undefined) { likes = "?" }
              var txt = ""
              if (locDoOpens) {
              	txt = "Opens: " + opens;
              }
              if (locDoLikes) {
              	if (txt !== "") {
                	txt += ", "
                }
                txt += " Likes: " + likes
              }
              span.innerText = txt
              var div2 = document.createElement("span")
              div2.className = "css-1pa0de"
              if (locDoCommission) {
              	d.appendChild(div)
              }
              d.appendChild(div2)
              var addcase = pr[0].parentNode.querySelector(".css-1q9lcag");
           		if (addcase) {
              	var cpy = addcase.cloneNode();
                var pn = addcase.parentNode;
                pn.removeChild(addcase);
                pn.insertBefore(cpy, pn.firstChild);
                cpy.innerText = determinetext(pn.parentNode.firstChild.firstChild.innerText); //if this case is already added, have the text be "Remove" instead
                cpy.setAttribute("jsoninfo", JSON.stringify(i)); //why can't javascript handle those things correctly anyway
                cpy.onclick = () => {onaddcaseclick(i, event.srcElement)};
              }
              var btn = document.createElement("button")
              btn.type = "button"
              btn.innerText = "Get ROI"
              btn.className = "css-ihatethis";
              pr[0].parentNode.lastChild.appendChild(btn)
              if (locDoGetRoi) {
              btn.onclick = function() {
              	var f = this.parentNode.parentNode.parentNode.firstChild.firstChild.alt
                if (saves[f]) {
                	var hm = this.parentNode.parentNode.firstChild.getElementsByClassName("css-1pa0de")
                  if (hm.length > 0) {
                  	fetch("https://clash.gg/api/cases/"+saves[f]['slug']).then(c => {c.json().then(val => {hm[0].innerText = make(val)})})
                  }
                }
              }}
              if (txt !== "") {
              	pr[0].appendChild(span)
              }
             }
          }
        }
      }
    }
  }
}
async function handleF(url, response) {
  if (url.toString().startsWith("/api/cases/community?")) {
    var out = undefined
    out = await response.json()
    for (var ob of out.data) {
    	if (!saves[ob['name']]) {
      	saves[ob['name']] = ob
      }
    }
    if (document.getElementById("headlessui-portal-root") != undefined) {
      var iter = document.getElementById("headlessui-portal-root").getElementsByClassName("css-1dq7p9k")[0]
      if (iter == undefined) {return}
      var mut = new MutationObserver(
      fa => {
      	for (var ab of fa) { if (ab.addedNodes.length > 0) {opar(ab.addedNodes[0], out.data)} }
      }).observe(iter, {childList: true})
    }
	}
}
function numonly(evt) {
	var charCode = (evt.which) ? evt.which : evt.keyCode
  if (charCode > 31 && (charCode < 48 || charCode > 57))
    return false;
  return true;
}
var fundinghooksetup = false;
function recalculatePrice() {
	var players = document.body.querySelector(".eb1o5v20");
  var funding = document.body.querySelector(".css-fundinginput");
  var casecosts = 0;
  var cases = document.body.querySelectorAll(".css-22992e");
  var caselist = undefined;
  for (var a of cases) {
  	if (a.parentNode && a.parentNode.className == "css-1shontc") {
    	caselist = a.parentNode;
    }
  }
  if (!fundinghooksetup) {
  	fundinghooksetup = true;
    players.onchange = recalculatePrice;
  }
  if (!caselist) {return;}
  for (var fo of caselist.childNodes) {
  	if (fo.className == "css-1mtrh68") {
    	var price = fo.querySelector(".css-9u3o9j");
      var times = fo.querySelector(".css-customaddinput");
      if (price && !isNaN(price.innerText.replace(",", "")) && times && !isNaN(times.value)) {
      	casecosts += (Number(price.innerText.replace(",", "")) * 100) * (Number(times.value))
      }
    }
  }
  if (funding && Number(funding.value) > 0) {
  	var actPlrs = players.value.split("v");
    var plrCount = 0;
    for (var i of actPlrs) {
    	plrCount += Number(i);
    }
    if (players.value.includes("players")) {
    	//just recently added, group mode shows "x players" instead of 1v1v1v1....
      plrCount = Number(players.value.substring(0, 1))
    }
    plrCount -= 1;
    var fundPrc = Number(funding.value) / 100;
    var totalCost = fundPrc * casecosts * plrCount;
    totalCost += casecosts;
    for (var t of document.body.querySelectorAll(".css-114dvlx")) {
    	if (t.parentNode.parentNode.className == "css-1up1glj") {
      	t.innerText = (totalCost / 100).toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 2});
        break;
      }
    }
    return;
  }
  for (var t of document.body.querySelectorAll(".css-114dvlx")) {
    	if (t.parentNode.parentNode.className == "css-1up1glj") {
      	t.innerText = (casecosts / 100).toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 2});
        break;
      }
    }
}
function reslug(n) {
	n = rememojis(n);
	n = n.replaceAll("$", "dollar")
  n = n.replaceAll("%", "percent")
  n = n.replaceAll("<", "less")
  n = n.replaceAll("^", "")
  n = n.replaceAll(">", "greater")
  n = n.replaceAll("-", "")
  n = n.replaceAll(" ", "-")
  n = n.replaceAll("&", "and")
  n = n.replaceAll("|", "or")
  n = n.replaceAll("=", "")
  n = n.replaceAll("{", "")
  n = n.replaceAll("}", "")
  n = n.replaceAll("[", "")
  n = n.replaceAll("]", "")
  n = n.replaceAll(";", "")
  n = n.replaceAll(",", "")
  n = n.replaceAll("/", "")
  if (n.charAt(0) == "-") {
  	n = n.substring(1);
  }
  if (n.charAt(n.length - 1) == "-") {
  	n = n.substring(0, n.length - 1)
  }
  return n
}
function redirecttobattle(f) {
	window.location.href = "https://clash.gg/csgo-case-battles/"+f["battle"]["id"] + ((f["battle"]["password"] != undefined && f["battle"]["password"] != "") ? "?password=" + f["battle"]["password"] : "");
}
var hookedCreate = false;
function finishcreatebattle(itself) {
	var body = {cases: []};
  body["isSuperSpin"] = false;
  if (document.getElementById("headlessui-switch-:Rj6batajajaln6:")) {
  	var ch = document.getElementById("headlessui-switch-:Rj6batajajaln6:");
    if (ch.getAttribute("aria-checked") == "true") {
    	body["isSuperSpin"] = true;
    }
  }
  var mode = undefined;
  for (var a of document.body.querySelectorAll(".css-1pyt9pu")) {
  	if (a.innerText == "Normal" || a.innerText == "Terminal" || a.innerText == "Group") {
    	mode = a.innerText.toLowerCase();
    }
  }
  if (document.getElementById("headlessui-switch-:Rj6jatajajaln6:")) {
  	var isCrazy = document.getElementById("headlessui-switch-:Rj6jatajajaln6:").getAttribute("aria-checked");
    if (isCrazy == "true") {
    	if (mode == "normal") {mode = "crazy"}
      if (mode == "group") {alert("Seriously? Crazy group?")}
      if (mode == "terminal") {mode = "crazy-terminal"}
    }
  }
  if (!mode) {
  	return alert("Something went wrong, report to reviews or to discord ok.and.");
  }
  body["isAffiliateOnly"] = false;
  body["mode"] = mode;
  if (document.body.querySelector(".eb1o5v20")) {
  	body["type"] = document.body.querySelector(".eb1o5v20").value;
  }
  if (document.getElementById("headlessui-switch-:Rj6ratajajaln6:")) {
  	body["isPrivate"] = document.getElementById("headlessui-switch-:Rj6ratajajaln6:").getAttribute("aria-checked") == "true";
  }
  if (document.body.querySelector(".css-fundinginput1") && !isNaN(document.body.querySelector(".css-fundinginput1").value)) {
  	if (Number(document.body.querySelector(".css-fundinginput1").value) > 0) {
  		body["discount"] = Number(document.body.querySelector(".css-fundinginput1").value);
    }
  }
  if (document.body.querySelector(".css-fundinginput2") && !isNaN(document.body.querySelector(".css-fundinginput2").value)) {
  	if (Number(document.body.querySelector(".css-fundinginput2").value) > 0) {
    	body["minLevel"] = Number(document.body.querySelector(".css-fundinginput2").value)
    }
  }
  var cases = document.body.querySelectorAll(".css-22992e");
  var caselist = undefined;
  for (var a of cases) {
  	if (a.parentNode && a.parentNode.className == "css-1shontc") {
    	caselist = a.parentNode;
    }
  }
  if (!caselist) {return;}
  for (var fo of caselist.childNodes) {
  	if (fo.className == "css-1mtrh68") {
    	var name = fo.querySelector(".css-1504nod");
      var times = fo.querySelector(".css-customaddinput");
      if (name && times && !isNaN(times.value)) {
      	body["cases"].push({amount: Number(times.value), slug: reslug(name.innerText)})
      }
    }
  }
  var opts = window.defoptions;
  opts.body = JSON.stringify(body);
  opts.method = "POST";
  itself.setAttribute("disabled", "true");
  fetch("https://clash.gg/api/battles", opts).then(c => {
  	if (c.status >= 200 && c.status <= 299) {
    	c.json().then((f) => {
      	redirecttobattle(f)
       	});
      } else { 
      	c.text().then((m) => {alert("Error while creating battle: " + m)});
      }});
}
function onaddcaseclick(info, that) {
	var crtBtn = undefined;
	var btnlist = document.body.querySelector(".css-1lswpz5");
  if (btnlist) {
  	var text = btnlist.querySelector(".css-vww2j2");
    if (text && text.parentNode) {
    	crtBtn = text.parentNode;
    }
  }
  //too lazy
  info = JSON.parse(that.getAttribute("jsoninfo"));
	var f = document.body.querySelector(".css-18icuxn");
  var didRemove = false;
  if (f) {
  	var num = 0
    var priceend = (info["price"] / 100);
  	if (that.innerText === "Add") {
    	num = 1;
      that.innerText = "Remove";
    } else {
    	for (var a of Array.from(document.querySelectorAll(".css-1shontc"), (f) => {return f.parentNode.className == "css-1sbr970 e8pp1d90" ? f : undefined})) {
      	if (a != undefined) {
        	for (var bo of a.childNodes) {
          	if (bo.className == "css-1mtrh68") {
            	if (bo.querySelector(".css-1504nod")) {
              	if (bo.querySelector(".css-1504nod").innerText == info["name"]) {
                	a.removeChild(bo);
                  didRemove = true;
                }
              }
            }
          }
        }
      }
    	num = -1;
      priceend = -priceend;
      that.innerText = "Add";
    }
  	f.innerText = Number(f.innerText) + num;
    if (Number(f.innerText) > 0) {
    	if (crtBtn) {
      	crtBtn.className = "css-1xd8rdf";
      }
    } else {
    	if (crtBtn) {
      	crtBtn.className = "css-rd85uv";
      }
    }
    var use = (Number(crtBtn.firstChild.firstChild.lastChild.lastChild.innerText) + Number(priceend)).toLocaleString("en-us", {minimumFractionDigits: 2, maximumFractionDigits: 2});
    if (crtBtn) {
    	crtBtn.firstChild.firstChild.lastChild.lastChild.innerText = use;
    }
    var totalheadlessu = document.body.querySelectorAll(".css-1m2d7j4");
    for (var totalheadlessui of totalheadlessu) {
      if (totalheadlessui && totalheadlessui.parentNode.parentNode.firstChild.innerText == "Total") { //really dont want to get the wrong thing here and im doing this like i dont know what im doing
        totalheadlessui.innerText = use;
      } 
    }
  }
  if (crtBtn && !hookedCreate) {
  	crtBtn.onclick = () => {finishcreatebattle(event.srcElement)};
    hookedCreate = true;
  }
  if (didRemove) {
  	return;
  }
  var thisimg = that.parentNode.parentNode.parentNode;
  var caselist = document.body.querySelectorAll(".css-22992e");
  var actualcaselist = null
  for (var cl of caselist) {
  	if (cl.parentNode.className === "css-1shontc") { //ive seen so many things named 1shontc already
    	actualcaselist = cl.parentNode;
      break;
    }
  }
  if (!actualcaselist) {
  	alert("report this error to the reviews or to the discord 'ok.and.', about the case list not being found")
    return;
  }
  var clone = thisimg.cloneNode(true);
  var lop = clone.querySelector(".css-lop1as");
  if (lop && lop.parentNode) {
  	lop.parentNode.removeChild(lop);
  }
  var other = clone.querySelector(".css-1gpniow");
  if (other && other.parentNode) {
  	other.parentNode.removeChild(other);
  }
  var cindex = document.querySelectorAll(".css-22992e");
  var lastc = cindex[cindex.length - 1];
  var realcindex = document.querySelectorAll(".css-1mtrh68");
  if (realcindex.length > 0) {
  	actualcaselist.insertBefore(clone, realcindex[realcindex.length - 1].nextSibling);
  } else {
  	actualcaselist.insertBefore(clone, lastc.nextSibling);
  }
  var incrdiv = document.createElement("div");
  incrdiv.className = "css-customadd";
  clone.appendChild(incrdiv);
  var cadd1 = document.createElement("button");
  cadd1.type = "button";
  cadd1.innerText = "-1"
  cadd1.className = "css-customaddbtn";
  incrdiv.appendChild(cadd1);
  var cinput = document.createElement("input");
 	cinput.placeholdertext = "Number";
  cinput.innerText = "1";
  cinput.value = "1";
  cinput.className = "css-customaddinput";
  var cadd2 = document.createElement("button");
  cadd2.type = "button";
  cadd2.innerText = "+1";
  cadd2.onclick = function() {
  	val = cinput.value.replace(/\D/g,'');
    if (!isNaN(val)) {
    	val = Number(val);
      cinput.value = (val + 1).toString();
    }
    recalculatePrice();
  }
  cadd1.onclick = function() {
  	val = cinput.value.replace(/\D/g,'');
    if (!isNaN(val)) {
    	val = Number(val);
      cinput.value = (val - 1).toString();
    } else { return }
    if (val - 1 <= 0) {
    	clone.parentNode.removeChild(clone);
    }
    recalculatePrice();
  }
  cinput.setAttribute("onkeypress", "return numonly(event)");
  cinput.addEventListener("input", recalculatePrice)
  cadd2.className = "css-customaddbtn";
  incrdiv.appendChild(cinput);
  incrdiv.appendChild(cadd2);
  if (clone.querySelector(".css-l2m0a2")) {
  	var t = clone.querySelector(".css-l2m0a2");
    if (t.lastChild) {
    	if (t.lastChild.nodeName == "SPAN") {
      	t.lastChild.parentNode.removeChild(t.lastChild)
      }
      if (t.lastChild && t.lastChild.querySelector(".css-commsn")) {
      	t.lastChild.parentNode.removeChild(t.lastChild);
      }
      if (t.lastChild.nodeName == "SPAN") {
      	t.lastChild.parentNode.removeChild(t.lastChild)
      } //garbage code
    }
  }
  recalculatePrice();
}
function replaceCase(a,bd) {
	a.firstChild.firstChild.src = "/_next/image?url=%2Fassets%2Fcsgo%2Fcases%2F"+bd["image"]+".webp&w=256&q=75"
  a.firstChild.firstChild.srcset = "/_next/image?url=%2Fassets%2Fcsgo%2Fcases%2F"+bd['image']+".webp&w=128&q=75 1x, /_next/image?url=%2Fassets%2Fcsgo%2Fcases%2F"+b['image']+".webp&w=256&q=75 2x"
  a.lastChild.firstChild.firstChild.innerText = bd["name"]
  a.lastChild.firstChild.querySelector(".css-9u3o9j").innerText = (bd["price"] / 100).toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 2});
  a.firstChild.firstChild.alt = bd['slug']
  var d = document.createElement("div");
  var comm = bd['commissionRate'] * 100
  var pr = a.lastChild.firstChild;
  if (pr.querySelector(".css-lop1as")) {
  	pr.removeChild(pr.querySelector(".css-lop1as"))
  }
  pr.appendChild(d)
  var red = comm * 85
             	var green = 255 - red
              var div = document.createElement('span')
              div.style = "color: rgb(" + red + ", " + green + ", 0)"
              div.innerText = "COMMISSION: " + comm.toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 0}) + "%"
              div.className = "css-commsn"
              var span = document.createElement('span')
              var locDoOpens = document.doOpens;
              var locDoLikes = document.doLikes;
              var locDoGetRoi = document.doGetRoi;
              var locDoCommission = document.doCommission;
              var opens = bd['timesOpened']
              if (opens == undefined) { opens = "?" }
              var likes = bd['timesLiked']
              if (likes == undefined) { likes = "?" }
              var txt = ""
              if (locDoOpens) {
              	txt = "Opens: " + opens;
              }
              if (locDoLikes) {
              	if (txt !== "") {
                	txt += ", "
                }
                txt += " Likes: " + likes
              }
              span.innerText = txt
              if (locDoCommission) {
              d.appendChild(div)
              }
              var div2 = document.createElement("span")
              div2.className = "css-1pa0de"
              d.appendChild(div2)
              var btn = document.createElement("button")
              btn.type = "button"
              btn.innerText = "Get ROI"
							btn.className = "css-ihatethis";
              var addcase = pr.parentNode.querySelector(".css-1q9lcag");
           		if (addcase) {
              	var cpy = addcase.cloneNode();
                var pn = addcase.parentNode;
                pn.removeChild(addcase);
                pn.insertBefore(cpy, pn.firstChild);
                cpy.innerText = determinetext(pn.parentNode.firstChild.firstChild.innerText); //text should be correct if case is added
                cpy.setAttribute("jsoninfo", JSON.stringify(bd)); //why can't javascript handle those things correctly anyway
                cpy.onclick = () => {onaddcaseclick(bd, event.srcElement)};
              }
							if (locDoGetRoi) {
              for (var a of pr.parentNode.lastChild.childNodes) {
              	if (a.innerText == "Get ROI") {
                	pr.parentNode.lastChild.removeChild(a);
                }
              }
              pr.parentNode.lastChild.appendChild(btn)
              }
              btn.onclick = function() {
              	var f = this.parentNode.parentNode.parentNode.firstChild.firstChild.alt
                	var hm = this.parentNode.parentNode.firstChild.getElementsByClassName("css-1pa0de")
                  if (hm.length > 0) {
                  	fetch("https://clash.gg/api/cases/"+f, window.defoptions).then(c => {c.json().then(val => {hm[0].innerText = make(val)})})
                  }
              }
}
function onRequestComplete(req, that) {
	var o = null
	if (that.parentNode && that.parentNode.parentNode && that.parentNode.parentNode.parentNode) {
  	o = that.parentNode.parentNode.parentNode
  }
  if (o === null) {console.log("request error"); return}
	if (document.body.querySelector(".css-fw3v5b")) {
  	req.json().then(function(json) {
    var takenCases = 0
    	for (var a of json) {
      	if (a["isActive"]) {
        	if (o.querySelectorAll(".css-1mtrh68").length > takenCases) {
          	var caselist = o.querySelectorAll(".css-1mtrh68");
            var thiscase = caselist[takenCases];
            if (thiscase) {
            	replaceCase(thiscase, a);
            }
            takenCases++;
          }
        }
      }
    for (var i = 0; i < 32 - takenCases; i++) {
      var caselist = o.querySelector(".css-1shontc");
      if (caselist) {
    		caselist.removeChild(caselist.lastChild);
       }
    }
    })
  }
}
function onCloneClick() {
	var active = document.body.querySelector(".css-fw3v5b");
  if (active) {
  	active.className = "css-1nwocw6";
  }
  this.className = "css-fw3v5b";
  var mycases = fetch("https://clash.gg/api/cases/my", {
  method: "GET",
  mode: "cors",
  credentials: "same-origin",
  headers: window.dumbHeaders,
  }); //ugly stuff, but it works and it is SO annoying
  mycases.then((f) => {onRequestComplete(f, this)});
}
function determinetext(t) {
	var caselist = document.body.querySelectorAll(".css-22992e");
  var actualcaselist = null
  for (var cl of caselist) {
  	if (cl.parentNode.className === "css-1shontc") { //ive seen so many things named 1shontc already
    	actualcaselist = cl.parentNode;
      break;
    }
  }
  if (!actualcaselist) {
  	alert("report this error to the reviews, about the case list not being found while opening the selector")
    return;
  }
  for (var i of actualcaselist.childNodes) {
  if (i.lastChild && i.lastChild.firstChild && i.lastChild.firstChild.firstChild) {
      if (i.querySelector(".css-o23cp2").firstChild.firstChild.innerText === t) {
        return "Remove";
      }
    }
  }
  return "Add";
}
function onUIOpen() {
	var iter = document.getElementById("headlessui-portal-root").getElementsByClassName("css-1dq7p9k");
  if (iter[0]) {
  	iter = iter[0];
  }
  if (document.body.querySelector(".css-1nwocw6") != undefined && document.doShowMyCases) {
    //get the inactive one
    var inact = document.body.querySelector(".css-1nwocw6")
    var clone = inact.cloneNode(true);
    clone.innerText = "My cases";
    for (var o of inact.parentNode.childNodes) {
    	//Unfortunately those buttons are dumb so we need to do this
      o.addEventListener("click", function() {
      	for (var abc of this.parentNode.childNodes) {
        	abc.className = "css-1nwocw6";
        }
        this.className = "css-fw3v5b";
      });
    }
    inact.parentNode.insertBefore(clone, inact.parentNode.firstChild);
    clone.addEventListener("click", onCloneClick);
  }
  if (iter == undefined || iter.firstChild == undefined) {return}
  for (var i of iter.firstChild.childNodes) {
  	var o = i.getElementsByClassName("css-1x8hsc6")
    if (o.length > 0) {
    	if (saves[o[0].alt]) {
      	var pr = o[0].parentNode.parentNode.getElementsByClassName("css-l2m0a2")
        if (pr.length > 0) {
        	if (pr[0].getElementsByClassName("css-commsn").length === 0) {
          	var comm = saves[o[0].alt]['commissionRate'] * 100
            var d = document.createElement("div")
            pr[0].appendChild(d)
            d.className = "css-lop1as"
              var red = comm * 85
              var green = 255 - red
              var div = document.createElement('span')
              div.style = "color: rgb(" + red + ", " + green + ", 0)"
              div.innerText = "COMMISSION: " + comm.toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 0}) + "%"
              div.className = "css-commsn"
              var span = document.createElement('span')
              var locDoOpens = document.doOpens;
              var locDoLikes = document.doLikes;
              var locDoGetRoi = document.doGetRoi;
              var locDoCommission = document.doCommission;
              var opens = saves[o[0].alt]['timesOpened']
              if (opens == undefined) { opens = "?" }
              var likes = saves[o[0].alt]['timesLiked']
              if (likes == undefined) { likes = "?" }
              var txt = ""
              if (locDoOpens) {
              	txt = "Opens: " + opens;
              }
              if (locDoLikes) {
              	if (txt !== "") {
                	txt += ", "
                }
                txt += " Likes: " + likes
              }
              span.innerText = txt
              if (locDoCommission) {
              d.appendChild(div)
              }
              var div2 = document.createElement("span")
              div2.className = "css-1pa0de"
              d.appendChild(div2)
              var addcase = pr[0].parentNode.querySelector(".css-1q9lcag");
           		if (addcase) {
              	var cpy = addcase.cloneNode();
                var pn = addcase.parentNode;
                pn.removeChild(addcase);
                pn.insertBefore(cpy, pn.firstChild);
                cpy.innerText = determinetext(pn.parentNode.firstChild.firstChild.innerText); //text should be right if this case is already added
                cpy.setAttribute("jsoninfo", JSON.stringify(saves[o[0].alt])); //why can't javascript handle those things correctly anyway
                cpy.onclick = () => {onaddcaseclick(saves[o[0].alt], event.srcElement)};
              }
              var btn = document.createElement("button")
              btn.type = "button"
              btn.innerText = "Get ROI"
							btn.className = "css-ihatethis";
							if (locDoGetRoi) {
              pr[0].parentNode.lastChild.appendChild(btn)
              }
              btn.onclick = function() {
              	var f = this.parentNode.parentNode.parentNode.firstChild.firstChild.alt
                if (saves[f]) {
                	var hm = this.parentNode.parentNode.firstChild.getElementsByClassName("css-1pa0de")
                  if (hm.length > 0) {
                  	fetch("https://clash.gg/api/cases/"+saves[f]['slug']).then(c => {c.json().then(val => {hm[0].innerText = make(val)})})
                  }
                }
              }
              if (txt !== "") {
              pr[0].appendChild(span)
              }
          }
        }
      }
    }
  }
}

function fumc(d, _) {
  for (var mutat of d) {
    for (var add of mutat.addedNodes) {
      if (add.id === "headlessui-portal-root") {
				onUIOpen()
      }
    }
  }
}
var obs = new MutationObserver(fumc)
obs.observe(document.body, {childList: true})
`
var script = `
var origf = window.fetch
async function ftch(url, options) {
  if (url.toString().startsWith("/api/cases/community?")) {
    var respo = await origf(url, options)
    try {
    	await handleF(url, respo)
    } catch (err) {
    	console.log(err)
    }
    if (options != undefined && typeof options !== 'undefined') {
    	return origf(url, options)
    }
    return origf(url, window.defoptions);
  } else {
  	if (options == undefined) {
    	return origf(url, window.defoptions); //since we wont be setting anything either
     }
     var	h = origf(url, options);
    if (!window.defoptions) {
      window.defoptions = options
    }
    if (options["headers"] && !window.dumbHeaders) {
      if (options["headers"]["Authorization"]) {
        window.dumbHeaders = options["headers"]
      }
    }
	return h;
	}
}
window.fetch = ftch

`
window.addEventListener("load", function() {
  if (typeof unsafeWindow === "undefined") {
    unsafeWindow    = ( function () {
        var dummyElem   = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
  }
  unsafeWindow.document.doOpens = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_opens"));
  unsafeWindow.document.doLikes = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_likes"));
  unsafeWindow.document.doCommission = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_commission"));
  unsafeWindow.document.doGetRoi = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_getroi"));
  unsafeWindow.document.dynamic = parse(unsafeWindow.localStorage.getItem("USRSCRPT_settings_dynamic"), true);
	unsafeWindow.document.doShowMyCases = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_mycases"));
  unsafeWindow.document.doDynamicRefreshMy = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_dodynamic"));
  var f = document.createElement("script")
  f.appendChild(document.createTextNode(func))
  f.async = true
  document.head.appendChild(f)
  var s = document.createElement("style");
  s.appendChild(document.createTextNode(style));
  document.head.appendChild(s);
  var d = document.createElement('script');
  //script = script.replace(/&lt;br&gt;/g," ")
  d.appendChild(document.createTextNode(script))
  d.async = true
  var toph = document.createElement("div");
  toph.className = "css-topstngs";
  var funding = document.createElement("div");
  funding.className = "css-funding";
  var fndtext = document.createElement("span");
  fndtext.className = "css-fundingtxt";
  fndtext.innerText = "Funding: ";
  funding.appendChild(fndtext);
  var inp = document.createElement("input");
  var dummypercent = document.createElement("span");
  dummypercent.innerText = "%";
  dummypercent.style = "margin-left: -15%;"
  inp.className = "css-fundinginput css-fundinginput1";
  inp.placeholder = "0";
  inp.setAttribute("onkeypress", "return numonly(event)");
  inp.setAttribute("oninput", "recalculatePrice();") //because the functions defined are in the other scope, and i dont wanna try to get them from unsafeWindow, ill just have the actual thing handle it
  funding.appendChild(inp);
  funding.appendChild(dummypercent);
  toph.appendChild(funding);
  var level = document.createElement("div");
  level.className = "css-funding";
  var lvltext = document.createElement("span");
  lvltext.className = "css-fundingtxt";
  lvltext.innerText = "Level requirement: ";
  level.appendChild(lvltext);
  var inp2 = document.createElement("input");
  inp2.setAttribute("onkeypress", "return numonly(event)");
  inp2.className = "css-fundinginput css-fundinginput2";
  inp2.placeholder = "0";
  level.appendChild(inp2);
  toph.appendChild(level);
  if (document.body.querySelector(".e1ig10za0")) {
  	var e1ig = document.body.querySelector(".e1ig10za0");
    e1ig.insertBefore(toph, e1ig.lastChild);
  }
  var scr = document.createElement("script")
  scr.appendChild(document.createTextNode("rememojis = function(n) { return n.replaceAll(/(?![*#0-9]+)[\\p{Emoji}\\p{Emoji_Modifier}\\p{Emoji_Component}\\p{Emoji_Modifier_Base}\\p{Emoji_Presentation}]/gu, '') }"))
  document.head.appendChild(scr);
  document.head.appendChild(d)
  unsafeWindow.localStorage.setItem("USRSCRPT_ACTIVE_battleinfo", true)
  if (unsafeWindow.document.dynamic === true) {
   setInterval(() => {
   unsafeWindow.document.doOpens = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_opens"));
  unsafeWindow.document.doLikes = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_likes"));
  unsafeWindow.document.doCommission = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_commission"));
  unsafeWindow.document.doGetRoi = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_getroi"));
     unsafeWindow.document.doShowMyCases = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_mycases"));
     unsafeWindow.document.doDynamicRefreshMy = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_dodynamic"));
   }, 300) 
  }
})