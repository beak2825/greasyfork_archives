// ==UserScript==
// @name     clash.gg battle case picker info (SETTINGS VERSION)
// @version  2
// @grant    none
// @description case info, battles, unsafeWindow.
// @license MIT
// @match https://clash.gg/
// @match https://clash.gg/*
// @match https://clash.gg/csgo-case-battles
// @match https://clash.gg/csgo-case-battles/*
// @namespace https://clash.gg/csgo-case-battles
// @downloadURL https://update.greasyfork.org/scripts/496673/clashgg%20battle%20case%20picker%20info%20%28SETTINGS%20VERSION%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496673/clashgg%20battle%20case%20picker%20info%20%28SETTINGS%20VERSION%29.meta.js
// ==/UserScript==
/*unsafeWindow.document.doOpens = true;
unsafeWindow.document.doLikes = true;
unsafeWindow.document.doGetRoi = true;
unsafeWindow.document.doCommission = true;
unsafeWindow.document.dynamic = false;*/
function parse(f, a) {
 if (f === 'false') {return false}
 if (f === 'true') {return true}
 if (a) {return false}
 return true
}

var func = `
function make(va) {
	var price = va.price * 100
  var readyRoi = 0
  for (var item of va.items) {
  	var chance = (item.ticketsEnd - item.ticketsStart) / 100000
    readyRoi += chance * (item.price * 100)
  }
  readyRoi /= price
  return "ROI: "+(readyRoi*100).toLocaleString("en-us", {maximumFractionDigits: 2, minimumFractionDigits: 0})+"%"
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
              var btn = document.createElement("button")
              btn.type = "button"
              btn.innerText = "Get ROI"
              btn.style = "border-width: 1px;border-color: transparent;letter-spacing: 0.05em;transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-duration: 100ms;border-radius: 0.25rem;padding: 0.625rem 1rem;font-size: 0.875rem;line-height: 1.25rem;--tw-bg-opacity: 1;background-color: rgb(255 216 25 / var(--tw-bg-opacity));background-image: repeating-linear-gradient(-45deg, transparent, transparent 1rem, rgba(21, 23, 25, 0.1) 0px, rgba(21, 23, 25, 0.1) 2rem);font-weight: 700;--tw-text-opacity: 1;color: rgb(31 34 37 / var(--tw-text-opacity));"
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
function onUIOpen() {
	var iter = document.getElementById("headlessui-portal-root").getElementsByClassName("css-1dq7p9k")[0]
  if (iter == undefined) {return}
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
              var btn = document.createElement("button")
              btn.type = "button"
              btn.innerText = "Get ROI"
              btn.style = "border-width: 1px;border-color: transparent;letter-spacing: 0.05em;transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);transition-duration: 100ms;border-radius: 0.25rem;padding: 0.625rem 1rem;font-size: 0.875rem;line-height: 1.25rem;--tw-bg-opacity: 1;background-color: rgb(255 216 25 / var(--tw-bg-opacity));background-image: repeating-linear-gradient(-45deg, transparent, transparent 1rem, rgba(21, 23, 25, 0.1) 0px, rgba(21, 23, 25, 0.1) 2rem);font-weight: 700;--tw-text-opacity: 1;color: rgb(31 34 37 / var(--tw-text-opacity));"
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
return origf(url, options)
} else {
return origf(url, options)
}
}
window.fetch = ftch

`
const unsafeWindow = undefined
window.addEventListener("load", function() {
 unsafeWindow = ( function () {
        var dummyElem = document.createElement('p');
        dummyElem.setAttribute ('onclick', 'return window;');
        return dummyElem.onclick ();
    } ) ();
  unsafeWindow.document.doOpens = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_opens"));
  unsafeWindow.document.doLikes = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_likes"));
  unsafeWindow.document.doCommission = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_commission"));
  unsafeWindow.document.doGetRoi = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_getroi"));
  unsafeWindow.document.dynamic = parse(unsafeWindow.localStorage.getItem("USRSCRPT_settings_dynamic"), true);

  var f = document.createElement("script")
  f.appendChild(document.createTextNode(func))
  f.async = true
  document.head.appendChild(f)
  var d = document.createElement('script');
  //script = script.replace(/&lt;br&gt;/g," ")
  d.appendChild(document.createTextNode(script))
  d.async = true
  document.head.appendChild(d)
  unsafeWindow.localStorage.setItem("USRSCRPT_ACTIVE_battleinfo", true)
  if (unsafeWindow.document.dynamic === true) {
   setInterval(() => {
   unsafeWindow.document.doOpens = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_opens"));
  unsafeWindow.document.doLikes = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_likes"));
  unsafeWindow.document.doCommission = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_commission"));
  unsafeWindow.document.doGetRoi = parse(unsafeWindow.localStorage.getItem("USRSCRPT_show_getroi"));
   }, 300) 
  }
})