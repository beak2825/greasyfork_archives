// ==UserScript==
// @name        Multi-Tag Filter for Itch.io
// @namespace   Doing Itch.io's Job
// @match       https://itch.io/games
// @match       https://itch.io/games/*
// @grant       GM.xmlhttpRequest
// @version     1.0.4
// @require     https://code.jquery.com/jquery-3.6.0.min.js
// @require     https://cdn.jsdelivr.net/npm/filter-itch-bundles@1.0.0/bundle.js
// @author      PlanetBluto
// @license MIT
// @description Filters out multiple tags
// @downloadURL https://update.greasyfork.org/scripts/483345/Multi-Tag%20Filter%20for%20Itchio.user.js
// @updateURL https://update.greasyfork.org/scripts/483345/Multi-Tag%20Filter%20for%20Itchio.meta.js
// ==/UserScript==

const DELETE = true
const BLUR = true
const ENDPOINT = false
const TRUST_ENDPOINT = true
const ALT_ENDPOINT = "https://d5cb6bb3-6dd9-4559-9955-33ce13fb44fe-00-2xi9ruvqi0eq3.riker.replit.dev"

//////////////////////////////////

Array.prototype.asyncForEach = async function(func) {
	var i = 0
	var length = this.length
	var funcs = []
	var reses = []
	return new Promise(async (res, rej) => {
		this.forEach((...args) => {
			funcs.push(func.bind(this, ...args))
		})

		async function loop() {
			var this_res = await funcs[i]()
			reses.push(this_res)
			i++
			if (i == length) {
				res(reses)
			} else {
				loop()
			}
		}
		loop()
	})
}

Array.prototype.awaitForEach = async function (func) {
  var proms = [];

  this.forEach((...args) => {
    proms.push(func(...args));
  });

  return await Promise.all(proms);
}

function XMLfetch(url, options = {method: "GET"}) {
  return new Promise((res, rej) => {
    options["url"] = url
    options["onload"] = res
    GM.xmlhttpRequest(options)
  })

}

//////////////////////////////////

const localStorage = window.localStorage
const cheerio = require("cheerio")
const print = console.log
var grid = document.getElementById("game_grid_0")

if (!localStorage.getItem("excluded_tags")) { localStorage.setItem("excluded_tags", `["tag1", "tag2", "tag3"]`) }

let oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
  if (arguments[1].startsWith("https://itch.io/games") && ENDPOINT) {
    // print("Old:", arguments[1])
    var urlBits = arguments[1].split("/games")[1]
    var urlRemainder = urlBits.split("?")[0]
    var params = urlBits.split("?")[1]
    params = new URLSearchParams(new Map(new URLSearchParams(params))).toString()
    arguments[1] = `${ALT_ENDPOINT}/games` + `${urlRemainder}?${params}` + `&ex=${encodeURIComponent(JSON.stringify(EXCLUDED_TERMS()))}`
    // print("New:", arguments[1])
  }

  var returning = oldXHROpen.apply(this, arguments);
  // print(arguments)

  return returning
}

function EXCLUDED_TERMS() { return JSON.parse(localStorage.getItem("excluded_tags")) }

function start() {
  //// Add Exlude Tag Button
  var button = document.createElement("button")
  var h2 = document.querySelector(".browse_header > h2")
  button.textContent = "Exluded Tags"
  button.style = "border: none; background: var(--itchio_link_color, #da2c49); border-radius: 15px; margin-left: 15px; color: white; font-weight: bold"
  button.onclick = e => {
    var currentExludedTags = EXCLUDED_TERMS().join(", ")
    var new_tags = prompt("Set Excluded Tags", currentExludedTags).split(", ")
    var tags = "[]"
    try {
      tags = JSON.stringify(new_tags)
      localStorage.setItem("excluded_tags", tags)
      location.reload()
    } catch (err) {
      print("C'mon now...")
      alert(`Error Setting Tags!\n\n${err}`)
    }
  }

  h2.appendChild(button)

  Array.from(grid.children).awaitForEach(node => clutchOrKick(node, true ))

  var observer = new MutationObserver(async (mutationRecords) => {
    for (const mutationList of mutationRecords) {
      var nodes = Array.from(mutationList.addedNodes)
      await nodes.awaitForEach(node => clutchOrKick(node, true))
    }
  })

  observer.observe(grid, {
    // subtree: true,
    childList: true,
  })
}

start()

async function clutchOrKick(node, from_endpoint = false) {
  if (!(from_endpoint && (TRUST_ENDPOINT && ENDPOINT)) && BLUR) {node.style.setProperty("filter", "blur(20px)")}

  function cond_print(...args) { if (false) { print(...args) } }

  var nodeIo = cheerio.load(node.innerHTML)

  // try {
  //   print(cheerio.load(nodeIo(`.game_genre`).toArray()[0]).text())
  // } catch(err) {
  //   print(nodeIo(`.game_genre`).toArray())
  // }

  var genre = null
  try { genre = nodeIo(`.game_genre`).toArray()[0].children[0].data.toLowerCase() } catch(err) { genre = null }
  var title = null
  try { title = nodeIo(`.title`).toArray()[0].children[0].data.toLowerCase() } catch(err) { title = null }

  var info = {
    genre: genre,
    tags: [],
    excluded: EXCLUDED_TERMS().includes(genre)
  }

  print(title, info)

  if (EXCLUDED_TERMS().includes(genre)) { node.remove(); cond_print(title, info ); return }

  print(nodeIo(`.game_link`).toArray()[0].attribs.href)
  info.tags = await getTags(nodeIo(`.game_link`).toArray()[0].attribs.href)
  var similars = anySimilars(info.tags, EXCLUDED_TERMS())

  info.excluded = similars

  if (info.excluded) { if (DELETE) {node.remove()}; cond_print(title, info ) } else if (BLUR) { node.style.removeProperty("filter") }
  // print(info)
  // if (info.excluded) { cond_print(title, info ) } else { node.style.removeProperty("filter") }
}

// function getTags(url) {
//   return new Promise((resolve, reject) => {
//     fetch(`${ALT_ENDPOINT}/?url=${encodeURIComponent(url)}`).then(async res => {
//         var dom = await res.text()
//         var domIo = cheerio.load(dom)

//         var tags = domIo(`td:contains("Tags")`).next().children('a').toArray()

//         resolve(tags.map(tag => cheerio.load(tag).text()))
//     })
//   })
// }

async function getTags(url) {
  var okRes = false;
  while (okRes == false) {
    var res = await XMLfetch(url)
    okRes = (res.status == 200);
    // print(okRes)
  }
  var dom = res.responseText
  var domIo = cheerio.load(dom)

  var tag_container = domIo(`td:contains("Tags")`).next()
  var tags = tag_container.children('a').toArray()
  var readable_tags = (tags.map(tag => cheerio.load(tag).text()))

  // print(readable_tags)
  // if (readable_tags.length == 0) {
  //   print(res.status)
  // }

  return readable_tags
}

function anySimilars(arr1, arr2) {
  var ret = false

  arr1.forEach(val => {
    if (arr2.map(v=>v.toLowerCase()).includes(val.toLowerCase())) { ret = true }
  })

  return ret
}