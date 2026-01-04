// ==UserScript==
// @name Flat style for imageboards
// @description A flat e621, TBIB, and Rule34 skin
// @namespace imageboard-flatstyle
// @version 2019.07.04
// @match *://tbib.org/*
// @match *://e621.net/*
// @match *://rule34.paheal.net/*
// @grant GM_xmlhttpRequest
// @run-at document-start
// @connect tbib.org
// @connect e621.net
// @connect paheal.net
// @downloadURL https://update.greasyfork.org/scripts/387130/Flat%20style%20for%20imageboards.user.js
// @updateURL https://update.greasyfork.org/scripts/387130/Flat%20style%20for%20imageboards.meta.js
// ==/UserScript==

switch(location.hostname){
	case "tbib.org":
		var website = "tbib"
		break
	case "e621.net":
		var website = "e621"
		break
	case "rule34.paheal.net":
		var website = "r34"
		break
}
if(location.protocol === "http:"){
	var protocol = "http:"
}else{
	var protocol = "https:"
}

var touchEnabled = false
addEventListener("touchstart", event => {
	touchEnabled = true
})
if(website === "tbib"){
	var thumbRegex = /(.*\/)thumbnails(\/\d+\/)thumbnail_([\da-f]{40}\.\w{3}).*/
}else if(website === "e621"){
	var thumbRegex = /(.*\/)preview\/(\w+\/\w+\/)([\da-f]{32}\.\w{3}).*/
}else if(website === "r34"){
	var thumbRegex = /\/_images\/([\da-f]{32}).*(\.\w{3,4})/
	var titleRegex = /\/\/ (\d+)x(\d+) \/\/ ([\d.]+)([KM]?B) \/\//
	var date = new Date()
	date.setYear(date.getFullYear() + 1)
	document.cookie = "ui-tnc-agreed=true; path=/; expires=" + date.toUTCString()
}
var viewportContent = "width=device-width,initial-scale=1"
var viewport = element(
	document.head || document.documentElement,
	["meta#viewport", {
		name: "viewport",
		content: viewportContent
	}]
).viewport
var tagList = {}
if(localStorage.tagList){
	try{
		tagList = JSON.parse(localStorage.tagList)
	}catch(e){}
}
if(!("None" in tagList)){
	tagList.None = ""
}
var tagListLength = Object.keys(tagList).length - ("tagWrap" in tagList ? 1 : 0)
var tagDialog
var imgExpand
var metadataList = {}
var search = new URL(location.href).searchParams
var expandIndex = -1
var dlTagResolve
var loading = false
var expandLoaded
var shiftNum = 0
var shiftFilename
var urlParts = location.pathname.slice(1).split("/")

if(document.readyState === "loading"){
	document.addEventListener("DOMContentLoaded", loaded)
}else{
	loaded()
}

function loaded(){
	var pageContent = document.querySelector(".content div")
	var expandList
	if(website === "tbib"){
		if(search.get("page") === "post" && search.get("s") === "list"){
			getPage(search.get("tags"), search.get("pid"))
			parsePage()
		}
	}else if(website === "e621"){
		if(urlParts[0] === "post" && (!urlParts[1] || urlParts[1] === "index")){
			getPage(search.get("tags") || urlParts[3], urlParts[2] || 1)
			parsePage()
			fixSearch()
		}else if(urlParts[0] === "pool" && urlParts[1] === "show"){
			getPage(urlParts[2], search.get("page") || 1, "pool")
			parsePage()
		}else if(urlParts[0] === "post" && urlParts[1] === "show"){
			fixSearch()
		}
	}else if(website === "r34"){
		if(urlParts[0] === "post"){
			if(urlParts[1] === "list"){
				parsePage()
				fixPaginator()
			}else if(urlParts[1] === "view"){
				fixImagePage()
			}
		}
	}
	var viewports = document.querySelectorAll("meta[name=viewport]")
	for(var i = 0; i < viewports.length; i++){
		if(viewports[i] !== viewport){
			viewports[i].parentNode.removeChild(viewports[i])
		}
	}
	imgExpand = element(
		document.body,
		["div#div", {
			id: "img-expand",
			style: "display:none",
			onclick: event => {
				expandThumb(event, true)
			},
			onmousedown: event => {
				if(event.target.id === "img-expand"){
					event.preventDefault()
				}
			}
		},
			["a#dlLink", {
				class: "dl-link",
				onclick: dlLink
			}, "Download"],
			["div#metadata", {
				id: "metadata",
				style: "display:none"
			}]
		]
	)
	tagDialog = element(
		document.body,
		["div#main", {
			id: "tag-dialog",
			style: "display: none",
			onclick: event => {
				var target = event.target
				if(target.tagName === "BUTTON"){
					var buttonmatch = target.firstChild.nodeValue.match(/^!(\w)_:/)
					if(buttonmatch){
						dlTag("close", buttonmatch[1], event.shiftKey, event.ctrlKey)
					}else{
						dlTag("close", " ", event.shiftKey, event.ctrlKey)
					}
				}else if(target.id !== "tag-window"){
					dlTag("close")
				}
			},
		},
			["div#window", {
				id: "tag-window",
				style: "height:" + (tagListLength * 42 + 22)+"px"
			},
				(() => {
					var output = [0]
					for(var i in tagList){
						if(i === "tagWrap"){
							continue
						}
						if(i === "None"){
							var tag = i
						}else{
							var tag = tagWrap(i)
						}
						if(tagList[i]){
							var description = ": " + tagList[i]
						}else{
							var description = ""
						}
						output.push(["button", tag + description])
					}
					return output
				})()
			]
		]
	)
}

function postvalues(input){
	var output = {}
	if(website === "tbib"){
		var attrs = input.attributes
		for(var i = 0; i < attrs.length; i++){
			output[attrs[i].name] = attrs[i].nodeValue
		}
	}else if(website === "e621"){
		var attrs=input.children
		for(var i = 0; i < attrs.length; i++){
			output[attrs[i].tagName] = attrs[i].innerHTML
		}
	}
	return output
}

function getPage(tags, page, type){
	var queryStr = []
	if(website === "tbib"){
		queryStr.push("page=dapi&s=post&q=index&limit=42")
	}
	if(tags){
		queryStr.push((type === "pool" ? "id=" : "tags=") + tags)
	}
	var pagestr = ""
	if(page){
		if(website === "tbib"){
			queryStr.push("pid=" + (page / 42))
		}else if(website === "e621"){
			if(search.get("before_id")){
				queryStr.push("before_id=" + search.get("before_id"))
			}else{
				queryStr.push("page=" + page)
			}
		}
	}
	if(website === "tbib"){
		var url = protocol + "//tbib.org/index.php?" + queryStr.join("&")
	}else if(website === "e621"){
		if(type === "pool"){
			var url = protocol + "//e621.net/pool/show.xml?" + queryStr.join("&")
		}else{
			var url = protocol + "//e621.net/post/index.xml?" + queryStr.join("&")
		}
	}
	loading = true
	new Promise(resolve => {
		GM_xmlhttpRequest({
			method: "get",
			url: url,
			onload: response => {
				if(response.status === 200){
					var parser = new DOMParser()
					var xmlDoc = parser.parseFromString(response.responseText, "text/xml")
					var posts = xmlDoc.firstChild
					var allPosts = []
					if(posts.tagName === "pool"){
						posts = xmlDoc.getElementsByTagName("posts")[0]
					}
					if(posts){
						allPosts = posts.children
					}
					for(var i = 0; i < allPosts.length; i++){
						var post = postvalues(allPosts[i])
						var fullUrl = post.file_url
						if(protocol === "https:" && fullUrl.startsWith("http:")){
							fullUrl = protocol + fullUrl.slice(5)
						}
						var dot = fullUrl.lastIndexOf(".")
						var extension = fullUrl.slice(dot)
						if(website === "tbib"){
							var id = "s" + post.id
						}else if(website === "e621"){
							var id = "p" + post.id
						}
						if(!metadataList[id]){
							metadataList[id] = {
								expandPos: -1
							}
						}
						metadataList[id].fullUrl = fullUrl
						metadataList[id].filename = post.md5 + (extension === ".jpeg" ? ".jpg" : extension)
						if(extension === ".webm"){
							metadataList[id].type = "video"
						}else if(extension === ".swf"){
							metadataList[id].type = "embed"
						}else{
							metadataList[id].type = "image"
						}
						if(website === "tbib"){
							metadataList[id].uploadDate = new Date(post.change * 1000)
						}else if(website === "e621"){
							metadataList[id].uploadDate = new Date(post.created_at)
						}
						if(post.width){
							metadataList[id].width = post.width
							metadataList[id].height = post.height
						}
						if(metadataList[id].expandPos >= 0){
							metadataList[metadataList[id].expandPos] = metadataList[id]
						}
					}
				}
				resolve()
			},
			onerror: resolve
		})
	}).then(() => {
		loading = false
		if(expandLoaded){
			expandThumb(null, false, expandLoaded)
		}
	})
}

function parsePage(){
	expandList = []
	var thumbs = document.getElementsByClassName("thumb")
	for(var i = 0; i < thumbs.length; i++){
		var thumb = thumbs[i]
		var linkElement = thumb.getElementsByTagName("a")[0]
		var imgElement = thumb.getElementsByTagName("img")[0]
		thumb.tabIndex = -1
		var filesize = 0
		var width = 0
		var height = 0
		var type = "image"
		if(website === "r34"){
			var titleMatches = imgElement.title.match(titleRegex)
			if(titleMatches){
				width = titleMatches[1]
				height = titleMatches[2]
				filesize = parseFloat(titleMatches[3])
				if(titleMatches[4] === "KB"){
					filesize *= 1024
				}else if(titleMatches[4] === "MB"){
					filesize *= 1024 * 1024
				}
			}
		}
		imgElement.removeAttribute("title")
		var thumbUrl = imgElement.src
		if(website === "e621"){
			var typeBadge = thumb.getElementsByClassName("type-badge")[0]
			if(typeBadge && typeBadge.innerText === "WEBM"){
				type = "video"
			}else{
				var slash = thumbUrl.lastIndexOf("/")
				if(thumbUrl.slice(slash + 1) === "download-preview.png"){
					type = "embed"
				}
			}
		}
		if(website === "r34"){
			var fullUrl = thumb.getElementsByTagName("a")[1].href
			var urlMatches = fullUrl.match(thumbRegex)
			if(!urlMatches){
				continue
			}
			var filename = urlMatches[1] + urlMatches[2]
			var dot = filename.lastIndexOf(".")
			if(filename.slice(dot) === ".webm"){
				type = "video"
			}
		}else if(type !== "embed"){
			var urlMatches = thumbUrl.match(thumbRegex)
			if(!urlMatches){
				continue
			}
			var filename = urlMatches[3]
			var dot = filename.lastIndexOf(".")
			if(filename.slice(dot) === ".jpeg"){
				filename = filename.slice(0, dot) + ".jpg"
			}
			if(website === "tbib"){
				var fullUrl = urlMatches[1] + "images" + urlMatches[2] + filename
			}else if(website === "e621"){
				if(type === "video"){
					dot = filename.lastIndexOf(".")
					filename = filename.slice(0, dot) + ".webm"
				}
				var fullUrl = urlMatches[1] + urlMatches[2] + filename
			}
		}
		if(website === "r34"){
			var id = imgElement.id
		}else{
			var id = thumb.id
		}
		linkElement.addEventListener("click", event => {
			if(event.which === 1){
				event.preventDefault()
				expandThumb(event)
			}
		})
		if(!metadataList[id]){
			metadataList[id] = {
				fullUrl: fullUrl,
				filename: filename,
				expandPos: expandList.length,
				type: type,
				width: width,
				height: height,
				filesize: filesize
			}
		}
		metadataList[expandList.length] = metadataList[id]
		expandList.push(linkElement)
	}
}

function fixPaginator(){
	if(website === "r34"){
		var parent = document.querySelector("#paginator .blockbody")
		if(parent){
			var symbols = {
				"first": "<<",
				"prev": "<",
				"next": ">",
				"last": ">>"
			}
			for(var i = parent.childNodes.length; i--;){
				var element = parent.childNodes[i]
				if(element.nodeType === 3){
					parent.removeChild(element)
				}else if(element.nodeName === "A" && element.innerText && !(/\d/.test(element.innerText))){
					var text = element.innerText.toLowerCase()
					element.classList.add(text)
					if(text in symbols){
						element.innerText = symbols[text]
					}
				}
			}
		}
	}
}

function fixImagePage(){
	if(website === "r34"){
		document.body.classList.add("image-page")
		var tagsLeft = document.getElementById("Tagsleft")
		var sourceLink = document.querySelector("a[href^='/source_history/']").parentNode.nextElementSibling.firstElementChild.firstElementChild
		var uploadTime = document.querySelector(".image_info time")
		if(sourceLink){
			tagsLeft.appendChild(document.createElement("br"))
			tagsLeft.appendChild(document.createTextNode("Source: "))
			tagsLeft.appendChild(sourceLink)
			if(uploadTime){
				tagsLeft.appendChild(document.createElement("br"))
			}
		}
		if(uploadTime){
			var uploader = uploadTime.parentNode.firstElementChild
			tagsLeft.appendChild(document.createElement("br"))
			tagsLeft.appendChild(document.createTextNode("Posted "))
			tagsLeft.appendChild(uploadTime)
			if(uploader.tagName === "A"){
				tagsLeft.appendChild(document.createTextNode(" by "))
				tagsLeft.appendChild(uploader)
			}
		}
	}
}

function fixSearch(){
	if(website === "e621"){
		var tags = document.getElementById("tags")
		element(
			tags.parentNode,
			["input", {
				type: "submit"
			}]
		)
	}
}

function dlLink(event, customTarget, letter){
	var target = customTarget || event.currentTarget
	if(customTarget || event.which === 1 && !target.dataset.skip){
		if(!customTarget){
			event.preventDefault()
			event.stopPropagation()
		}
		if(tagListLength === 1){
			dlLinkletter(target, " ", event.shiftKey, event.ctrlKey)
		}else{
			dlTag("open").then(response => {
				dlLinkletter(target, response.letter, response.shift, response.ctrl)
			})
		}
	}
}

function dlLinkletter(target, letter, shift, ctrl){
	if(letter){
		var filename = target.dataset.filename || metadataList[expandIndex].filename
		if(shift){
			if(ctrl || shiftNum === 0){
				shiftNum = 0
				shiftFilename = filename
			}else{
				filename = shiftFilename
			}
			shiftNum++
			var dot = filename.lastIndexOf(".")
			filename = filename.slice(0, dot) + "_" + shiftNum + filename.slice(dot)
		}else{
			shiftNum = 0
		}
		var imageUrl = target.href || metadataList[expandIndex].fullUrl
		var link = element(
			document.body,
			["a#link", {
				href: imageUrl,
				target: "_blank",
				onclick: event => {
					if((website === "e621" || website === "r34") && !event.target.dataset.replaced){
						event.target.dataset.replaced = "1"
						event.preventDefault()
						GM_xmlhttpRequest({
							method: "get",
							url: imageUrl,
							responseType: "arraybuffer",
							onload: response => {
								event.target.dataset.replaced = "2"
								var dataView = new DataView(response.response)
								var blob = new Blob([dataView], {type: "image/png"})
								var objurl = URL.createObjectURL(blob)
								link.href = objurl
								document.body.appendChild(link)
								link.click()
								link.parentNode.removeChild(link)
							}
						})
					}else if(website === "e621" && event.target.dataset.replaced === "1"){
						event.preventDefault()
					}
				},
				download: (() => {
					for(var i in tagList){
						if(i === letter){
							return tagWrap(letter.toLowerCase()) + filename
						}
					}
					return filename
				})(),
				style: "opacity: 0"
			}, " "]
		).link
		link.click()
		link.parentNode.removeChild(link)
	}
}

function dlTag(action, letter, shift, ctrl){
	if(action === "open"){
		return new Promise(resolve => {
			dlTagResolve = resolve
			tagDialog.main.style.display = ""
		})
	}else if(action === "close"){
		tagDialog.main.style.display = "none"
		dlTagResolve({
			letter: letter,
			shift: shift,
			ctrl: ctrl
		})
	}
}

function tagWrap(input){
	if(tagList.tagWrap){
		return input.replace(input, tagList.tagWrap)
	}else{
		return input
	}
}

function expandThumb(event, close, target){
	var expandDiv = imgExpand.div
	getSelection().removeAllRanges()
	expandDiv.className = ""
	if(close){
		removeEventListener("keydown", expandKeyDown)
		removeEventListener("keyup", expandKeyUp)
		removeEventListener("blur", expandKeyUp)
		removeEventListener("contextmenu", expandKeyUp)
		expandKeyUp()
		expandDiv.style.display = "none"
		if(touchEnabled){
			document.body.style.overflow = ""
			viewport.content = ""
			requestAnimationFrame(() => {
				viewport.content = viewportContent
			})
		}
		var fromtop = [pageXOffset, pageYOffset]
		if(document.activeElement === expandList[expandIndex]){
			expandList[expandIndex].blur()
		}
		expandList[expandIndex].focus()
		if(!event.shiftKey){
			scroll(fromtop[0], fromtop[1])
		}
		expandIndex = -1
		expandNextFile()
		expandThis = 0
	}else if(loading){
		event.preventDefault()
		event.stopPropagation()
		expandLoaded = event.currentTarget
	}else{
		if(!target){
			event.preventDefault()
			event.stopPropagation()
			target = event.currentTarget
		}
		if(touchEnabled){
			document.body.style.overflow = "hidden"
		}
		expandDiv.style.display = "block"
		expandIndex = expandList.indexOf(target)
		if(metadataList[expandIndex].type === "video"){
			expandDiv.classList.add("video")
		}
		expandNextFile()
		addEventListener("keydown", expandKeyDown)
		addEventListener("keyup", expandKeyUp)
		addEventListener("blur", expandKeyUp)
		addEventListener("contextmenu", expandKeyUp)
	}
}
function expandKeyDown(event){
	var expandDiv = imgExpand.div
	var expandThis = imgExpand.this
	var noDefault = true
	var key = event.key.toLowerCase()
	var embed = metadataList[expandIndex].type === "embed"
	
	switch(event.keyCode){
		case 27: // Esc
			expandThumb(event, true)
			break
		case 33: // Page up
			expandNextFile(-1)
			break
		case 34: // Page down
			expandNextFile(1)
			break
		case 192:
		case 223: // `
			imgExpand.metadata.style.display = imgExpand.metadata.style.display === "none" ? "" : "none"
			getFullMetadata()
			break
		case 35: // End
		case 36: // Home
			break
		default:
			noDefault = false
			break
	}
	if(embed){
		switch(event.keyCode){
			case 32: // Space
			case 37: // Left
			case 38: // Up
			case 39: // Right
			case 40: // Down
				noDefault = true
			break
		}
	}else if(!noDefault){
		noDefault = true
		switch(event.keyCode){
			case 13: // Enter
				expandThumb(event, true)
				break
			case 32: // Space
				if(metadataList[expandIndex].type === "video" && !event.ctrlKey){
					if(imgExpand.this.paused){
						imgExpand.this.play()
					}else{
						imgExpand.this.pause()
					}
				}else{
					expandDiv.classList.add("img-expand-fade")
				}
				break
			case 37: // Left
				if(metadataList[expandIndex].type === "video"){
					var toTime = expandThis.currentTime - 5
					if(toTime < 0){
						toTime = 0
					}
					expandThis.currentTime = toTime
				}else{
					expandNextFile(-1)
				}
				break
			case 38: // Up
				expandNextFile(-1)
				break
			case 39: // Right
				if(metadataList[expandIndex].type === "video"){
					var toTime = expandThis.currentTime + 5
					var maxtime = expandThis.duration
					if(toTime >= maxtime){
						if(expandThis.paused){
							toTime = maxtime
						}else if(expandThis.loop){
							toTime = 0
						}else{
							expandThis.pause()
							toTime = maxtime
						}
					}
					expandThis.currentTime = toTime
				}else{
					expandNextFile(1)
				}
				break
			case 40: // Down
				expandNextFile(1)
				break
			case 77: // M
				if(metadataList[expandIndex].type === "video"){
					expandThis.muted = !expandThis.muted
				}else{
					noDefault = false
				}
				break
			default:
				noDefault = false
				break
		}
	}
	if(!noDefault && (!embed || event.ctrlKey)){
		if(event.keyCode === 78){ // N
			noDefault = true
			dlLinkletter(imgExpand.dlLink, " ", event.shiftKey, !embed && event.ctrlKey)
		}else{
			for(var i in tagList){
				if(i === key){
					noDefault = true
					dlLinkletter(imgExpand.dlLink, key, event.shiftKey, !embed && event.ctrlKey)
					break
				}
			}
		}
	}
	if(noDefault){
		event.preventDefault()
	}
}
function expandKeyUp(event){
	if(!event || event.keyCode === 32 || event.type === "blur" || event.type === "contextmenu"){
		imgExpand.div.classList.remove("img-expand-fade")
	}
}
function expandNextFile(dir){
	var expandDiv = imgExpand.div
	var expandThis = imgExpand.this
	if(expandThis){
		expandDiv.removeChild(expandThis)
		imgExpand.this = null
	}
	if(expandIndex + 1){
		if(dir){
			expandIndex = (expandIndex + dir) % expandList.length
			if(expandIndex < 0){
				expandIndex = expandList.length - 1
			}
		}
		var highlighted = document.getElementsByClassName("highlight")
		for(var i = 0; i < highlighted.length; i++){
			highlighted[i].classList.remove("highlight")
		}
		var post = metadataList[expandIndex]
		expandList[expandIndex].parentNode.classList.add("highlight")
		var url = post.fullUrl
		if(post.type === "video"){
			imgExpand.this = element(
				expandDiv,
				["video#img", {
					src: url,
					controls: true,
					loop: true,
					muted: true,
					autoplay: true
				}]
			).img
		}else if(post.type === "embed"){
			imgExpand.this = element(
				expandDiv,
				["embed#img", {
					src: url,
					type: "application/x-shockwave-flash",
					width: post.width || 800,
					height: post.height || 600,
					allowscriptaccess: "never"
				}]
			).img
		}else{
			imgExpand.this=element(
				expandDiv,
				["img#img", {
					src: url
				}]
			).img
			var imgThis = imgExpand.this
			if(!imgThis.complete){
				var thumb = expandList[expandIndex].getElementsByTagName("img")[0]
				imgThis.style.background = "url(" + thumb.src + ") no-repeat center"
				imgThis.style.backgroundSize = "100% 100%"
				if(post.width){
					var thumbWidth = post.width
					var thumbHeight = post.height
					if(post.width / post.height > innerWidth / innerHeight){
						if(post.width > innerWidth){
							thumbWidth = innerWidth
							thumbHeight = innerWidth / post.width * post.height
						}
					}else{
						if(post.height > innerHeight){
							thumbWidth = innerHeight / post.height * post.width
							thumbHeight = innerHeight
						}
					}
					imgThis.width = thumbWidth
					imgThis.height = thumbHeight
				}
				var bgLoadEvent = () => {
					imgThis.removeEventListener("load", bgLoadEvent)
					imgThis.style.background = ""
					imgThis.removeAttribute("width")
					imgThis.removeAttribute("height")
				}
				imgThis.addEventListener("load", bgLoadEvent)
			}
		}
		var imgThis = imgExpand.this
		if(!imgThis.complete){
			var loadEvent = event => {
				imgThis.removeEventListener("load", loadEvent)
				getFullMetadata()
				setTimeout(getFullMetadata, 100)
			}
			imgThis.addEventListener("load", loadEvent)
		}
		getFullMetadata()
	}
}
function getFullMetadata(){
	var expandThis = imgExpand.this
	var thisMeta = metadataList[expandIndex]
	var output = [0,
		"File Name: " + thisMeta.filename + " [" + (expandIndex + 1) + "/" + expandList.length + "]"
	]
	var filesize = 0
	if(thisMeta.filesize){
		filesize = thisMeta.filesize
	}else{
		var perf = performance.getEntriesByName(expandThis.src)[0]
		if(perf && perf.decodedBodySize){
			filesize = perf.decodedBodySize
			thisMeta.filesize = filesize
		}
	}
	if(filesize){
		var sizeunit = "B"
		while(filesize >= 1024 && sizeunit !== "MB"){
			filesize /= 1024
			sizeunit = sizeunit === "B" ? "KB" : "MB"
		}
		output.push(["br"])
		output.push("Image Size: " + (Math.round(filesize * 10 ) / 10) + sizeunit)
	}
	if(thisMeta.uploadDate){
		var date=thisMeta.uploadDate
		output.push(["br"])
		output.push("Date Modified: " +
			padding(date.getFullYear(), 4) + "/" +
			padding(date.getMonth() + 1, 2) + "/" +
			padding(date.getDate(), 2) + " " +
			padding(date.getHours(),2) + ":" +
			padding(date.getMinutes(), 2) + ":" +
			padding(date.getSeconds(), 2)
		)
	}
	var width = thisMeta.width || expandThis.width || expandThis.videoWidth
	var height = thisMeta.height || expandThis.height || expandThis.videoHeight
	if(width && height){
		thisMeta.width = width
		thisMeta.height = height
		var fileExt = thisMeta.filename.replace(/.*\./, "").toUpperCase()
		if(fileExt === "JPG"){
			fileExt = "Jpeg"
		}
		output.push(["br"])
		output.push("Image Information: " + width + "x" + height + " (" + fileExt + ")")
	}
	imgExpand.metadata.innerHTML = ""
	element(
		imgExpand.metadata,
		output
	)
}

function padding(string, num){
	return ("" + string).padStart(num, 0)
}

function element(){
	var parent
	var lastTag
	var createdTag
	var output = {}
	for(var i = 0; i < arguments.length; i++){
		var current = arguments[i]
		if(current){
			if(current.nodeType){
				parent = lastTag = current
			}else if(Array.isArray(current)){
				for(var j = 0; j < current.length; j++){
					if(current[j]){
						if(!j && typeof current[j] === "string"){
							var tagName = current[0].split("#")
							lastTag = createdTag = document.createElement(tagName[0])
							if(tagName[1]){
								output[tagName[1]] = createdTag
							}
						}else if(current[j].constructor === Object){
							if(lastTag){
								for(var value in current[j]){
									if(value !== "style" && value in lastTag){
										lastTag[value] = current[j][value]
									}else{
										lastTag.setAttribute(value, current[j][value])
									}
								}
							}
						}else{
							var returned = element(lastTag,current[j])
							for(var k in returned){
								output[k] = returned[k]
							}
						}
					}
				}
			}else if(current){
				createdTag = document.createTextNode(current)
			}
			if(parent && createdTag){
				parent.appendChild(createdTag)
			}
			createdTag = 0
		}
	}
	return output
}

var searchButton = `
	border: 0 !important;
	color: transparent;
	background-color: transparent !important;
	background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><g stroke="%23606060" stroke-width=".8"><ellipse fill="none" cx="7.8" cy="4.3" rx="3.8" ry="3.8"/><path d="M.3 11.7 5 7"/></g></svg>') !important;
	background-repeat: no-repeat !important;
	background-position: 50% !important;
	position: absolute;
	top: 0;
	right: 0;
	padding: 0;
	margin: 0 !important;
	width: 32px !important;
	height: 32px;
	box-shadow: none;
	min-width: 0;
`
var searchButtonHover = `
	background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><g stroke="%230078d7" stroke-width=".8"><ellipse fill="none" cx="7.8" cy="4.3" rx="3.8" ry="3.8"/><path d="M.3 11.7 5 7"/></g></svg>') !important;
`
var searchButtonActive = `
	background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"><g stroke="%23fff" stroke-width=".8"><ellipse fill="none" cx="7.8" cy="4.3" rx="3.8" ry="3.8"/><path d="M.3 11.7 5 7"/></g></svg>') !important;
	background-color: #0078d7 !important;
`
if(website === "tbib"){
var css = `
body, div, h1, h2, h3, h4, h5, h6, p, ul, li, dd, dt, input{
	font-family: Segoe UI, sans-serif;
	background: unset;
}
body{
	background: #e6e6e6 !important;
	padding-top: 0 !important;
	overflow: visible;
}
body[style*="#0e0e0e"]{
	background: #0e0e0e !important;
}

ul{
	margin: 0;
}

#image{
	max-width: 100%;
	max-height: 120vh;
	width: auto!important;
	height: auto!important;
	margin: 0!important;
}
#content{
	padding: 0 !important;
	background-color: transparent !important;
}
.content{
	background: none !important;
}
#post-list .content{
	width: 100% !important;
}
#post-list .content>script:first-child+br+div,
#post-list .content>#top:first-child+div{
	display: grid;
	grid: auto/repeat(auto-fill,minmax(180px,1fr));
	justify-items: center;
}
.thumb{
	width: 180px !important;
	height: 180px !important;
	display: flex !important;
	justify-content: center;
	align-items: center;
	position: relative;
	box-sizing: border-box;
	border: 2.5px solid transparent;
	vertical-align: middle;
}
.thumb:hover,
.thumb:focus,
.thumb.highlight{
	border-color: #cfcfcf;
	outline: none;
}
.thumb a::after{
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

/* Main page */
#static-index>a::before{
	content: "The Big ImageBoard";
	font-size: 52px;
	margin-top: 1em;
	font-weight: bold;
}

/* Tags list on the left of image pages */
.sidebar{
	width: 200px !important;
	height: 50px;
	word-break: break-all;
	padding: 0 5px !important;
	margin: 0 !important;
	cursor: default;
}
#post-view .sidebar{
	position: absolute;
	top: 50px;
}
.sidebar>:first-child{
	margin: 0 !important;
}

/* Snaps the image parent to the right on image pages */
#post-view .content{
	margin-left: 210px;
	width: calc(100% - 210px) !important;
	text-align: center;
}

#header,#subnavbar,#subnavbar li{
	margin: 0 !important;
	background: none !important;
	padding: 0 !important;
}
/* Replace link to main page with a similar link to the list page */
#header{
	width: 225px;
}
#subnavbar>:first-child a{
	position: absolute;
	display: block;
	padding-left: 10px;
	font-size: 0;
	color: #000 !important;
	line-height: 50px;
	height: 50px;
}
#subnavbar>:first-child a::after{
	content: "The Big ImageBoard";
	font-size: 16px;
}

/* #tags and #stags respresent the search field on search result pages and image pages respectively */
#tags,
#stags{
	width: 500px !important;
	min-width: 50%;
	max-width: 100%;
	height: 32px;
	box-sizing: border-box;
	background-color: #f0f0f0;
	border: 2.5px solid #7a7a7a;
	outline: none;
	padding: 0 32px 0 10px;
	font-size: 13.3px;
	margin: 0 !important;
}
#stags{
	width: 200px !important;
}
#tags:hover,
#stags:hover,
#static-index form: hover #tags{
	background-color: #f5f5f5;
	border-color: #171717;
}
#tags:focus,
#stags:focus{
	background-color: #fff !important;
	border-color: #0078d7 !important;
}
#tags+ul,
#stags+ul{
	transition-duration: 0s;
}
#post-list form>div{
	position: absolute;
	top: 0;
	left: 225px;
	height: 50px;
	box-sizing: border-box;
	background: #e6e6e6 !important;
	padding: 9px;
}
#post-view form{
	position: relative;
}
#static-index form{
	position: relative;
	width: 500px;
	max-width: 100%;
	margin: auto;
}
#static-index form>input,
#post-list .sidebar form>div>input[type="submit"],
#post-view .sidebar form>input[type="submit"]{
	${searchButton}
}
#static-index form>input:hover,
#post-list .sidebar form>div>input[type="submit"]:hover,
#post-view .sidebar form>input[type="submit"]:hover{
	${searchButtonHover}
}
#static-index form>input:active,
#post-list .sidebar form>div>input[type="submit"]:active,
#post-view .sidebar form>input[type="submit"]:active{
	${searchButtonActive}
}
#post-list .sidebar form>div>input[type="submit"]{
	top: 9px;
	right: 9px;
}
#static-index form>br,
.sidebar form>div>br{
	display: none;
}
#post-view .awesomplete{
	width: 200px;
	height: 32px;
}

/* Pagination on search result pages */
.pagination{
	cursor: default;
}
.pagination a,
.pagination b{
	display: inline-block;
	min-width: 34px;
	height: 34px;
	margin: 0 5px !important;
	text-align: center;
	line-height: 34px;
	padding: 0 !important;
	border: 2.5px solid transparent !important;
	color: #666 !important;
	font-weight: normal;
}
.pagination a:hover,.pagination b:hover{
	background: #ddd !important;
}
.pagination b{
	cursor: default;
	border-color: #cfcfcf !important;
}

#post-view{
	position: absolute;
	width: 100% !important;
}
#post-view+div{
	padding-top: 82px !important;
}
#post-view~div{
	width: 200px !important;
	overflow: hidden;
	padding: 0 5px;
	text-align: left;
	font-size: 12.8px;
}
.tag-count{
	display: inline !important;
	color: #aaa;
}
#tag-sidebar{
	text-align: left;
}
#tag-sidebar li{
	display: block;
	margin: 0;
}
#stats a{
	word-break: break-all;
}

/* "Image has been resized" notice on image pages */
.status-notice{
	width: calc(100% - 210px) !important;
	margin-left: 210px !important;
	box-sizing: border-box;
}
#stats li{
	margin-top: 1em;
}
#tag-sidebar{
	padding-top: 1em;
}
#resized_notice{
	margin: 0;
	padding: 0;
	border: 0;
	width: 0;
	height: 0;
	font-size: 0;
}
a[onclick^="Cookie.create('resize-original"]::after{
	content: "";
	display: block;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 210px;
	cursor: zoom-in;
}
/* Fix positioning of tags on image pages when a notice is present, assumes that the notice is exactly 72 pixels tall */
.status-notice:not([style])+.sidebar{
	margin-top: -72px !important;
}

/* Custom notice when no images were found on search result pages */
.content>:first-child{
	font-size: 0;
	text-align: center;
}
.content>div>h1::after{
	content: "No results";
	display: block;
	font-size: 22px;
	padding-top: 50px;
}

/* Mobile */

@media screen and (max-width: 600px){
	.pagination>:not([alt="next"]):not([alt="back"]),
	#post-list .sidebar form>div>input{
		display: none !important;
	}
	.pagination a[alt="back"],
	.pagination a[alt="next"]{
		font-size: 0 !important;
	}
	.pagination a[alt="back"]::after,
	.pagination a[alt="next"]::after{
		display: inline-block;
		width: 100px;
		font-size: 12.8px;
	}
	.pagination a[alt="back"]::after{
		content: "< Prev";
	}
	.pagination a[alt="next"]::after{
		content: "Next >";
	}
	#post-list form>div{
		left: 0;
		width: 100% !important;
	}
	.awesomplete{
		display: block;
	}
	#tags, #stags{
		width: 100% !important;
	}
}

/*
	Hiding rules
*/
#static-index>div[style], /* Main page counter */
#stats~*, /* hide half-broken "Options" on image pages */
#stats>h5, /* hide the word "Statistics" after tags list on image pages */
#stats>ul>:nth-child(-1n+1),#stats>ul>:nth-child(3),#stats>ul>:nth-last-child(-1n+1), /* hide all statistics info on image pages, with source link being an exception */
#site-title, /* hide link to main page, replaced with a similar link to lists page */
#navbar,#subnavbar>li~*, /* hide top navigation bar, including account and login link */
#blacklisted-sidebar~*, /* hide tags list in search results */
.sidebar h5, /* hide the word "Search" next to search bar */
.tips, /* hide site notice */
#static-index>a>img, /* main page logo */
#static-index>:last-child img, /* main page counter */
/*#post-view .awesomplete~*, *//* search button on image page */
#image~*, /* ad, hide linebreaks after the image on image pages */
form~*, /* ad, hide usage tips next to search bar */
#post-list .content>div:first-of-type>div:nth-child(-1n+2), /* ad, fixes grid layout on search result pages */
#post-list .content>:not(div), /* ad, hide line breaks after picture grid on search result pages */
.pagination~*, /* ad, hide linebreaks after pagination on search result pages */
iframe,object, /* ad */
.sidebarRight, /* ad */
#post-list .sidebar a, /* ad */
#right-col br,
#header>input, #header>label, #paginator+div, #top, #lmid, #lbot3 /* Mobile */
{
	display: none !important;
}
`
}else if(website=="e621"){
var css = `
body, div, ul, li, dd, dt, h1, h2, h3, h4, h5, h6, p, input{
	font-family: Segoe UI, sans-serif;
	background: unset;
	color: #000;
}

body{
	background: #e6e6e6 !important;
}

/*
** Main page
*/

#content2{
	top: 0 !important;
}
#static-index h1{
	font-size: 12.8px !important;
	margin: 1em 0 2em 0;
}
#static-index h1 a{
	font-size: 52px !important;
	font-weight: bold !important;
}
.mascotbox{
	background-image: none !important;
	background-color: transparent !important;
	border-radius: 0;
	box-shadow: none !important;
	text-shadow: none !important;
	max-width: 100%;
}

#static-index form,
form div{
	position: relative;
}
#static-index input[type="submit"],
#tags+input[type="submit"]{
	${searchButton}
}
#static-index input[type="submit"]:hover,
#tags+input[type="submit"]:hover{
	${searchButtonHover}
}
#static-index input[type="submit"]:active,
#tags+input[type="submit"]:active{
	${searchButtonActive}
}

/* Main page link */
#subnav{
	width: 225px;
	height: 50px;
	padding: 0 !important;
	margin: 0 !important;
	background: none !important;
	border-radius: 0 !important;
	box-shadow: none !important;
}
#subnav li{
	background-color: transparent !important;
	padding: 0 !important;
	margin: 0 !important;
	display: block !important;
}
#subnav>.flat-list>li:first-child a{
	display: block;
	background-color: transparent !important;
	padding-left: 10px;
	font-size: 0;
	color: #000 !important;
	line-height: 50px;
	height: 50px;
}
#subnav>.flat-list>li:first-child a::after {
	content: "e621";
	font-size: 16px;
}

/*
** Post list
*/

/* Search */
#post-list .sidebar{
	position: static !important;
	margin-right: 0 !important;
	width: 0 !important;
}
#post-list .sidebar>div,
#header{
	margin-bottom: 0 !important;
}
#post-list .sidebar form{
	position: absolute;
	top: 0;
	left: 225px;
	width: calc(100% - 225px);
	height: 50px;
	box-sizing: border-box;
	background: #e6e6e6 !important;
	padding: 9px;
}
form div,
#tags{
	width: 500px !important;
	max-width: 100%;
	height: 32px;
}
#tags{
	box-sizing: border-box;
	background-color: #f0f0f0;
	border: 2.5px solid #7a7a7a;
	outline: none;
	padding: 0 32px 0 10px;
	margin: 0 !important;
	top: 0 !important;
	border-radius: 0 !important;
	box-shadow: none !important;
}
#tags:hover{
	background-color: #f5f5f5;
	border-color: #171717;
}
#tags:focus{
	background-color: #fff !important;
	border-color: #0078d7 !important;
}

/* Images */

:root #content{
	background: none !important;
	background-image: none !important;
	border-radius: 0 !important;
	box-shadow: none !important;
	margin: 0 !important;
	padding: 0 !important;
	min-width: 0;
}
.content-post{
	width: 100% !important;
}
.content-post>div:nth-child(3),
#pool-show>:last-child,
#wiki-body>:last-child>:last-child>div{
	display: grid;
	grid: auto / repeat(auto-fill, minmax(180px, 1fr));
	justify-items: center;
}

.thumb{
	display: flex !important;
	justify-content: center;
	align-items: center;
	position: relative !important;
	box-sizing: border-box;
	border: 2.5px solid transparent;
	vertical-align: middle;
	height: 180px !important;
}
.thumb:hover,
.thumb:focus,
.thumb.highlight{
	border-color: #cfcfcf;
	outline: none;
}
.thumb a::after{
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

img.preview{
	border-radius: 0 !important;
	pointer-events: none;
}
img.has-children{
	border: 3px solid #aca;
}
img.pending {
	border: none;
}

/* Pagination */

div#paginator, div.pagination{
	padding: 2em 0 1em 0;
}
.pagination{
	display: inline-flex;
	cursor: default;
	font-size: 12.8px;
}
.pagination .disabled,
.pagination .current~.gap,
.pagination .current~.gap~a:not(.next_page){
	display: none;
}
.pagination a,
.pagination .current,
.pagination .gap{
	display: block;
	min-width: 34px;
	height: 34px;
	margin: 0 5px !important;
	text-align: center;
	line-height: 34px;
	padding: 0 !important;
	border: 2.5px solid transparent !important;
	color: #666 !important;
	font-weight: normal !important;
	background: none !important;
	box-shadow: none !important;
	border-radius: 0 !important;
}
.pagination a:hover,
.pagination .current:hover{
	background:#ddd!important;
}
.pagination .current{
	cursor: default;
	border-color: #cfcfcf!important;
}
.pagination .prev_page,
.pagination .next_page,
.pagination .current~.gap+a+a:not(.next_page){
	font-size: 0;
}
.pagination .prev_page::after{
	content: "<";
	font-size: 12.8px;
}
.pagination .next_page::after{
	content: ">";
	font-size: 12.8px;
}
.pagination .current~.gap+a+a:not(.next_page){
	display: block;
	order: 1;
}
.pagination .current~.gap+a+a:not(.next_page)::after{
	content: ">>";
	font-size: 12.8px;
}
#paginator>a{
	font-size: 0;
	display: inline-block
}
#paginator>a:first-child::after{
	content: "< Prev";
	display: inline-block;
	width: 100px;
	font-size: 12.8px;
}
#paginator>a:last-child::after{
	content: "Next >";
	display: inline-block;
	width: 100px;
	font-size: 12.8px;
}

/*
** Image page
*/

#post-view .sidebar{
	width: 200px !important;
	word-break: break-all;
	padding: 0 5px !important;
	margin: 0 !important;
	cursor: default;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
#post-view .content{
	width: calc(100% - 210px) !important;
	margin-top: -50px !important;
	text-align: center;
}
#image,
#webm-container{
	max-width: 100%;
	max-height: 120vh;
	width: auto !important;
	height: auto !important;
	margin: 0 !important;
}
#webm-container{
	max-height: 100vh;
}

#resized_notice{
	background: none !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	border: 0 !important;
	color: transparent;
	font-size: 0;
}
#resized_notice>a:first-child::after{
	content: "";
	display: block;
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 210px;
	cursor: zoom-in;
}

.status-notice{
	background: none !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	border: 0 !important;
	padding: 0 !important;
	position: static;
	order: 1;
}
#post-view h5~div{
	order: 2;
}
a{
	color: #006ffa !important;
	font-weight: normal !important;
}
a:hover{
	color: #33cfff !important;
}
.sourcelink-url{
	display: inline !important;
	height: auto;
	background-color: transparent !important;
	position: static;
	white-space: normal;
	border-radius: 0 !important;
	box-shadow: none !important;
}
#stats span{
	font-weight: normal !important;
	color: inherit !important;
}
#stats li{
	margin-top: 1em;
}

/*
** Other pages
*/

blockquote,
.rounded,
.rounded tr:nth-child(even),
.section{
	background: none !important;
	box-shadow: none;
	border-radius: 0;
	border: 0;
}
blockquote>p{
	background: none !important;
}

/* Mobile */

@media screen and (max-width: 600px){
	.pagination>:not(.next_page):not(.prev_page){
		display: none !important;
	}
	.pagination .prev_page::after{
		content: "< Prev";
		display: inline-block;
		width: 100px;
	}
	.pagination .next_page::after{
		content: "Next >";
		display: inline-block;
		width: 100px;
	}
	#post-list .sidebar form{
		left: 0;
		width: 100%;
	}
}

/*
** Hiding rules
*/

#links a[href="/comment"], #links a[href="/forum"], /* Main page */
#searchbox2, /* Main page */
#searchbox3,
#mascot_artist,
#static-index input[value="Change Mascot"],
#static-index br,
#news, /* Announcements */
#navbar, /* Navigation bar */
#subnav>ul>li:not(:first-child), /* Links below nav bar, except for list */
#post-list .sidebar>div:not(:first-child), /* Sidebar, except search */
.sidebar>div:first-child>h5, /* Search cheatsheet */
.post-score, /* Score below thumbnails */
#post-view .content>:not(:nth-child(2)), /* Image description and comments */
.sidebar h5, /* Sidebar headers */
#stats~div, /* Image page history, related posts */
#tag-sidebar a[style], /* Image page wiki links */
#stats>ul>li:nth-child(1n+3), /* Image page stats */
#ad-leaderboard /* Ad */
{
	display: none !important;
}
#stats .sourcelink+li+li{
	display: block !important;
}
`
}else if(website=="r34"){
var css = `
body, div, ul, li, dd, dt, h1, h2, h3, h4, h5, h6, p, input{
	font-family: Segoe UI, sans-serif !important;
	background: unset;
	color: #000;
}

body{
	background: #e6e6e6 !important;
	padding: 0 !important;
}

/*
** Main page
*/

#front-page h1 a{
	font-size: 52px !important;
	font-weight: bold !important;
}
#links{
	margin-bottom: 0;
}

#front-page form,
#Navigationleft form{
	position: relative;
	width: 500px;
	max-width: 100%;
}
#front-page input[type="submit"],
.image-page [type="submit"],
#submit{
	${searchButton}
}
#front-page input[type="submit"]:hover,
.image-page [type="submit"]:hover,
#submit:hover{
	${searchButtonHover}
}
#front-page input[type="submit"]:active,
.image-page [type="submit"]:active,
#submit:active{
	${searchButtonActive}
}

/*
** Post list
*/

/* Search */
#header{
	position: static !important;
	z-index: 0 !important;
}
table{
	border-spacing: 0;
}
table td{
	padding: 0;
	text-align: left;
}
.headbox{
	width: 100% !important;
}
#mini-logo{
	display: table-cell !important;
	width: 225px;
}
#mini-logo a{
	position: relative;
	display: block;
	width: 215px;
	height: 50px;
	line-height: 50px;
	padding-left: 10px;
}
#mini-logo a::after{
	content: "Rule 34";
	font-size: 16px;
	color: #000;
}
#mini-logo img{
	display: none;
}
a{
	font-weight: normal !important;
	text-decoration: none !important;
}
#mini-logo+td{
	padding: 9px;
}
#mini-logo+td+td{
	display: block;
	width: 0;
}
#submit{
	position: absolute;
	left: 702px;
	top: 9px;
	width: 32px;
	height: 32px !important;
}
input[name="search"],
:root .tagit{
	width: 500px !important;
	max-width: 100%;
	height: 32px;
	box-sizing: border-box;
	background-color: #f0f0f0 !important;
	border: 2.5px solid #7a7a7a !important;
	outline: none;
	padding: 0 32px 0 10px !important;
	margin: 0 !important;
	top: 0 !important;
	border-radius: 0 !important;
	box-shadow: none !important;
	overflow: hidden !important;
}
input[name="search"]:hover,
:root .tagit:hover{
	background-color: #f5f5f5 !important;
	border-color: #171717 !important;
}
input[name="search"]:focus,
:root .tagit:focus{
	background-color: #fff !important;
	border-color: #0078d7 !important;
}
:root .tagit-choice{
	margin: 0 !important;
	border: 0 !important;
	padding: 0 18px 0 0.2em !important;
	border-radius: 0 !important;
	height: 24px;
	background: #ddd !important;
	margin-right: 3px !important;
	cursor: default !important;
	font-weight: normal !important;
}
.tagit li{
	display: inline-block !important;
	float: none !important;
}
.tagit input{
	height: 26px;
	background: none;
}

nav{
	display: none;
}

/* Posts */

.headbox,
article,
.blockbody,
#header,
.thumb img,
.tagit-new{
	border: 0 !important;
	background: none !important;
	margin: 0 !important;
	padding: 0 !important;
}

.shm-image-list{
	display: grid;
	grid: auto / repeat(auto-fill, minmax(180px, 1fr));
	justify-items: center;
}

.thumb{
	display: flex !important;
	justify-content: center;
	align-items: center;
	position: relative !important;
	box-sizing: border-box;
	border: 2.5px solid transparent;
	vertical-align: middle;
	width: 180px !important;
	height: 180px !important;
	margin: 0 !important;
}
.thumb:hover,
.thumb:focus,
.thumb.highlight{
	border-color: #cfcfcf;
	outline: none;
}
.shm-thumb-link::after{
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
.thumb img{
	display: block;
	width: auto;
	height: auto;
	max-width: 156px;
	max-height: 156px;
}

/* Pagination */

#paginator,
#paginator .blockbody{
	padding: 2em 0 1em 0 !important;
}

#paginator .blockbody{
	display: inline-flex;
	cursor: default;
	font-size: 0;
}

#paginator a{
	display: block;
	min-width: 34px;
	height: 34px;
	margin: 0 5px !important;
	text-align: center;
	line-height: 34px;
	padding: 0 !important;
	border: 2.5px solid transparent !important;
	color: #666 !important;
	background: none !important;
	box-shadow: none !important;
	border-radius: 0 !important;
	font-size: 12.8px;
	text-decoration: none !important;
	order: 2;
}
#paginator br~a,
#paginator br~b{
	order: 1;
}
#paginator a:hover{
	background:#ddd !important;
}
#paginator b>a{
	cursor: default;
}
#paginator b>a{
	border-color: #cfcfcf !important;
	pointer-events: none;
}
#paginator .first,
#paginator .prev{
	order: 0;
}
#paginator .random{
	display: none;
}

/*
** Image page
*/

#Imagemain .blockbody{
	overflow: visible !important;
}
#Videomain{
	font-size: 0;
}
#main_image{
	max-width: 100% !important;
	max-height: 120vh !important;
	width: auto !important;
	height: auto !important;
	margin: 0 !important;
}

.image-page nav,
#Navigationleft form,
.tag_list,
.tag_list tbody,
.tag_list tr,
:root .image-page #mini-logo{
	display: block !important;
}
.tag_list td{
	display: inline;
}
.image-page #mini-logo~td,
nav h3,
.tag_list thead,
.tag_list .tag_info_link_cell,
.tag_count::before,
.tag_count::after{
	display: none;
}

.image-page #header,
.image-page #mini-logo{
	width: 210px;
}
.image-page #mini-logo a{
	width: 200px;
}
.image-page nav{
	width: 200px !important;
	word-break: break-all;
	padding: 0 5px !important;
	margin: 0 !important;
	cursor: default;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}
#Navigationleft .blockbody{
	font-size: 0 !important;
}
nav,
nav .tagit,
#Tagsleft .blockbody{
	font-size: 13px;
}
.tag_count{
	color: #aaa;
}
nav,
nav .blockbody{
	text-align: left !important;
}
#Tagsleft .blockbody{
	margin-top: 1em !important;
}
.image-page article{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 210px;
	right: 0;
}

a{
	color: #006ffa !important;
	font-weight: normal !important;
}
a:hover{
	color: #33cfff !important;
}

/* Mobile */

@media screen and (max-width: 600px){
	#mini-logo,
	#paginator>.blockbody>:not(.prev):not(.next){
		display: none !important;
	}
	#paginator .prev,
	#paginator .next{
		font-size: 0;
	}
	#paginator .prev::after{
		content: "< Prev";
		display: inline-block;
		width: 100px;
		font-size: 12.8px;
	}
	#paginator .next::after{
		content: "Next >";
		display: inline-block;
		width: 100px;
		font-size: 12.8px;
	}
	input[name="search"]{
		width: 100% !important;
	}
	:root .headbox .tagit{
		width: auto !important;
	}
	#post-list .sidebar form>div{
		left: 0;
		width: 100%;
	}
	#submit{
		right: 9px;
		left: auto;
	}
}

/*
** Hiding rules
*/

#links [href="/wiki"], #links [href="/comment/list"], /* Broken main page links */
#counter, /* Main page counter */
.headbox>tbody>tr:not(:nth-child(2)), /* Header */
.headcol, #Loginleft, /* Login */
footer, #foot, /* Footer */
#nav-toggle, /* Mobile navigation toggle */
#imagelist h3, #Imagemain h3, #Videomain h3, #Statsmain h3, /* Images text */
.thumb>:not(.shm-thumb-link), /* Post list thumbnail */
#Image_Controlsleft, /* Sidebar */
article>:not(#imagelist):not(#paginator):not(#Imagemain):not(#Videomain):not(#Tagsmain):not(#Extension_Managermain):not(#Documentationmain):not(#Statsmain), /* Ads */
#Friends_of_Pahealleft, /* Ads */
nav p /* Ads */
{
	display: none !important;
}
`
}
css += `
/* Download link */
.dl-link{
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	display: block;
	height: 30px;
	background: #cfcfcf;
	line-height: 30px;
	opacity: 0;
	color: #000 !important;
	text-align: center;
	z-index: 1;
	font-weight: normal;
	text-decoration: none !important;
}
.dl-link:hover{
	color: #000 !important;
}
#img-expand.video .dl-link{
	display: none;
}
.thumb:hover .dl-link,
.thumb:focus .dl-link,
.thumb.highlight .dl-link,
#img-expand .dl-link:hover{
	opacity: 1;
	color: #000 !important;
}
#img-expand,
#tag-dialog{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	cursor: pointer;
	z-index: 6;
}
#img-expand img,
#img-expand video,
#img-expand embed,
#tag-window{
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
}
#img-expand img,
#img-expand video{
	max-width: 100%;
	max-height: 100%;
}
#img-expand img{
	background: url(data:image/gif;base64,R0lGODlhEAAQAPABAOfn5////yH5BAAKAAAALAAAAAAQABAAAAIfhG+hq4jM3IFLJhoswNly/XkcBpIiVaInlLJr9FZWAQA7);
}
#tag-window{
	width: 260px;
	background: #f0f0f0;
	border: 1px solid #0078d7;
	cursor: default;
	padding: 5px 26px;
	box-sizing: border-box;
}
#tag-window button{
	display: block;
	width: 206px;
	height: 30px;
	font-family: Segoe UI;
	margin: 12px 0;
	font-size: 12px;
	text-align: left;
	padding: 0 2px;
}
#metadata{
	position: absolute;
	top: 20px;
	left: 20px;
	color: #fff;
	text-shadow: -1px -1px 2px #000, -1px 1px 2px #000, 1px -1px 2px #000, 1px 1px 2px #000, 0 0 8px #000;
	z-index: 1;
	font-size: 13px;
}
#img-expand.img-expand-fade{
	background: none;
}
.img-expand-fade *{
	opacity: 0.5;
}
.img-expand-fade .dl-link{
	display: none;
}
`
var link = document.createElement("link")
link.rel = "stylesheet"
var blob = new Blob([css], {type: "text/css"})
link.href = URL.createObjectURL(blob)
var parent = document.head || document.documentElement
parent.appendChild(link)
