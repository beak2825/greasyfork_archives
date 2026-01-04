// ==UserScript==
// @name             Power Tag
// @namespace        https://bunnynabbit.com
// @version          1.6.1
// @description      Adds a dedicated tag voting panel to https://namemc.com/privacy#vote
// @author           BunnyNabbit
// @license          MIT
// @match            *.namemc.com/privacy
// @match            namemc.com/privacy
// @icon             https://bunnynabbit.com/powertag2.png
// @grant            GM.xmlHttpRequest
// @connect          s.namemc.com
// @contributionURL  https://ko-fi.com/bunnynabbit
// @supportURL       https://t.me/BunnyNabbit
// @downloadURL https://update.greasyfork.org/scripts/468957/Power%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/468957/Power%20Tag.meta.js
// ==/UserScript==

(async function () {
	'use strict';
	const mainBody = document.querySelector("body > main")
	if (window.location.hash !== "#vote") {
		const button = createElement("button")
		button.innerText = "Looking for Power Tag? Click here."
		button.onclick = () => {
			window.location.hash = "#vote"
			window.location.reload()
		}
		mainBody.prepend(button)
		return
	}
	const pendingSkins = []
	document.querySelector("head > title").innerText = "Power Tag | NameMC"
	// Template HTML from NameMC
	let selectModeTemplate = '<div name="modes" class="card mb-3"><div class="card-header py-1"><strong uses="">Select mode</strong></div><div class="row no-gutters align-items-center border-top p-1 px-3"></div><button class="btn btn-secondary btn-sm" name="survey">Review pending tags</button><button class="btn btn-secondary btn-sm" name="search">Search and review approved tags</button><button class="btn btn-secondary btn-sm" name="trending">Review tags on trending skins</button><button class="btn btn-secondary btn-sm" name="random">Review random skins</button></div>'
	let cardMarkdownTemplate = '<div class="card-header py-1"><strong uses>1 uses</strong></div><div class="card-body checkered p-1 px-3"><a href="/skin/1cadce38d109c22f" target="_blank"><div class="card-body text-center p-1"><img class="drop-shadow auto-size" loading="lazy" width="320" height="160" src=""></div></a></div><div quik="votes"></div><div class="row no-gutters align-items-center border-top p-1 px-3"></div><button class="btn btn-secondary btn-sm" quik="skip">Skip</button>'
	let voteMarkdownTemplate = '<div class="row no-gutters align-items-center border-top p-1 px-3"><div class="col-auto m-1 text-nowrap"><span quik="status">Status:</span> Is <a style="border-radius: 1rem; max-width: 100%; font-weight: bold" class="text-nowrap text-ellipsis btn btn-sm btn-primary" quik="tag" href="" target="_blank">Blue Eyes</a> a good tag?<a quik="google" href="" target="_blank" rel="nofollow" title="Image Search (Google)"><img class="emoji" draggable="false" alt="🖼️" src="https://s.namemc.com/img/frame-with-picture.png"></a><a quik="bing" href="" target="_blank" rel="nofollow" title="Image Search (Bing)"><img style="filter: hue-rotate(150deg);" class="emoji" draggable="false" alt="🖼️" src="https://s.namemc.com/img/frame-with-picture.png"></a></div><div quik="voteButtons" class="col m-1 text-nowrap text-right"><button class="btn btn-outline-success btn-sm" type="submit" name="vote" value="1"><i class="fas fa-thumbs-up"></i></button><button class="btn btn-outline-danger btn-sm" type="submit" name="vote" value="-1"><i class="fas fa-thumbs-down"></i></button></div></div>'
	const references = [
		["ears mod", "Ears is a mod that adds ears, snouts, tails, horns, wings, and more to the player. These features are embedded in the skin file as unused space, you can 🔽 the skin from NameMC and use it with the Ears mod. NameMC does not render Ears data, so you must go to https://ears.unascribed.com/manipulator/ and check if this skin does contain valid Ears data."],
	]
	function getReference(tag, details) {
		console.log({tag})
		let reference = references.find(entry => tag.toLowerCase() == entry[0])
		if (reference) {
			reference = reference[1]
			reference = reference.replace("🔽", `<a target="_blank" href="https://s.namemc.com/i/${details.hash}.png">download</a>`)
			console.log(reference)
			return reference
		}
		return null
	}
	function clearPage() {
		mainBody.innerHTML = ""
	}
	function selectModePage() {
		mainBody.innerHTML = selectModeTemplate
		const selectMode = mainBody.children.modes
		selectMode.children.survey.onclick = () => {
			clearPage()
			modeSurvey()
		}
		selectMode.children.search.onclick = () => {
			const tag = prompt("Search tag")
			if (tag) {
				clearPage()
				modeSearch(`tag/${tag}`)
			}
		}
		selectMode.children.trending.onclick = () => {
			clearPage()
			modeSearch(`trending`)
		}
		selectMode.children.random.onclick = () => {
			clearPage()
			modeSearch(`random`)
		}
	}
	function createElement(tag, className = "") {
		const element = document.createElement(tag)
		element.className = className
		return element
	}
	function getFrontAndBackImage(skin, model) {
		return `https://s.namemc.com/3d/skin/body.png?id=${skin}&model=${model}&width=320&height=201&front_and_back=true`
	}
	function cleanSkinUrl(url) {
		return url.replace("https://namemc.com/skin/", "").replace(location.origin + /skin/, "")
	}
	function changeTag(el, newTagName, keepAttributes = true) { // https://gist.github.com/Daniel-Hug/d245b53b6195b9596c00659cb17cda6c
		var newEl = document.createElement(newTagName)

		// Copy the children
		while (el.firstChild) {
			newEl.appendChild(el.firstChild) // *Moves* the child
		}

		// Copy the attributes
		if (keepAttributes) {
			for (var i = el.attributes.length - 1; i >= 0; --i) {
				newEl.attributes.setNamedItem(el.attributes[i].cloneNode())
			}
		}

		// Replace it
		el.parentNode.replaceChild(newEl, el)
		return newEl
	}
	function getSkinDetails(skin = "31cfd17dee5fb3b0", datum) { // Collect some valid data of the skin
		function processData(data) {
			const voteElements = data.querySelectorAll("#tag-dialog > div > div > div.modal-body.border-bottom.p-0 > div > table > tbody > tr")
			const tags = []
			for (let index = 0; index < voteElements.length; index++) {
				const element = voteElements[index].children
				tags.push({
					status: element[0].innerText.trim(),
					name: element[1].innerText.trim(),
					disabled: element[1].children[0].disabled,
					votes: parseInt(element[2].innerText.trim().replace("−", "-")),
					upHilight: !element[3].children.vote.className.includes("outline"),
					downHilight: !element[4].children.vote.className.includes("outline")
				})
			}
			return {
				hash: skin,
				randomSkin: cleanSkinUrl(data.querySelector("a[href^=\"/skin/\"] div").parentElement.href),
				usersWearing: parseInt(data.querySelector("strong").innerText.match(/\d/g)?.join('') ?? 0, 10),
				model: data.querySelector("canvas").getAttribute("data-model"),
				hasEars: hasEarsData(skin), // promise
				tags: tags
			}
		}
		function fetchData(resolve) {
			fetch(`${location.origin}/skin/${skin}`)
				.then(response => response.text())
				.then(str => new window.DOMParser().parseFromString(str, "text/html"))
				.then(async data => {
					if (data.body.innerHTML.includes("Error: 429 (Too Many Requests)")) {
						console.log("429 detected, stalling")
						await sleep(2000)
						fetchData(resolve)
					}
					resolve(processData(data))
				})
		}
		if (datum) {
			return processData(datum)
		} else return new Promise(resolve => fetchData(resolve))
	}
	function hasEarsData(hash) {
		return new Promise(resolve => {
			GM.xmlHttpRequest({
				url: `https://s.namemc.com/i/${hash}.png`,
				responseType: "arraybuffer",
				onload: function (response) {
					const loadImage = new Image()
					loadImage.src = URL.createObjectURL(new Blob([this.response]))
					loadImage.onload = ev => {
						const canvas = document.createElement("canvas")
						canvas.width = loadImage.width
						canvas.height = loadImage.height
						const ctx = canvas.getContext("2d")
						ctx.drawImage(loadImage, 0, 0)
						// checks if the skin contains the "magic pixels"
						const pixel = ctx.getImageData(0, 32, 1, 1).data
						resolve(pixel[0] == 63 && pixel[1] == 35 && pixel[2] == 216 || pixel[0] == 234 && pixel[1] == 37 && pixel[2] == 1)
					}
				},
				onerror: function () { resolve(null) }
			})
		})
	}
	function createCard(details, replaceElement, next) {
		let rediv = createElement("div") // to refresh
		if (replaceElement) {
			replaceElement.innerText = ""
			rediv = replaceElement
		}
		const cardElement = createElement("div", "card mb-3")
		cardElement.innerHTML = cardMarkdownTemplate
		cardElement.querySelector("a > div > img").src = getFrontAndBackImage(details.hash, details.model)
		const cardHeader = cardElement.querySelector("strong[uses]")
		cardHeader.innerText = `${details.usersWearing} wearing | Model: ${details.model}`
		details.hasEars.then((itDoes) => {
			if (itDoes) cardHeader.innerHTML += ` | <span title="The skin likely has embedded data for the Ears mod.">Has Ears data</span>`
		})
		cardElement.querySelector("a").href = `${location.origin}/skin/${details.hash}`
		const tagContainer = cardElement.querySelector("div[quik=\"votes\"]")
		details.tags.forEach((tag) => {
			let tagElement = createElement("div")
			tagElement.innerHTML = voteMarkdownTemplate
			// maybe use "name" instead of "quik"? a bunch of the DOM API supports using that and is much cleaner.
			tagContainer.append(tagElement)
			if (tag.disabled) {
				changeTag(tagElement.querySelector("[quik=\"tag\"]"), "button")
				tagElement.querySelector("[quik=\"tag\"]").disabled = tag.disabled
			}
			tagElement.querySelector("[quik=\"status\"]").innerText = `${tag.status} (${tag.votes}) |`
			tagElement.querySelector("[quik=\"tag\"]").innerText = tag.name
			tagElement.querySelector("[quik=\"tag\"]").href = `/minecraft-skins/tag/${tag.name}`
			const voteButtons = tagElement.querySelector("[quik=\"voteButtons\"]").children
			const voteAmounts = [1, -1]
			if (tag.upHilight) {
				voteButtons[0].classList.remove("btn-outline-success")
				voteButtons[0].classList.add("btn-success")
				voteAmounts[0] = 0
			}
			if (tag.downHilight) {
				voteButtons[1].classList.remove("btn-outline-danger")
				voteButtons[1].classList.add("btn-danger")
				voteAmounts[1] = 0
			}
			async function postVote(amount) {
				fetch(`${location.origin}/skin/${details.hash}`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: new URLSearchParams({
						"task": "vote-tag",
						"tag": tag.name,
						"vote": `${amount}`
					})
				})
					.then(response => response.text())
					.then(str => new window.DOMParser().parseFromString(str, "text/html"))
					.then(async (data) => {
						totalVotes++
						let newCardDetails = null
						let remove = true
						try {
							newCardDetails = getSkinDetails(details.hash, data || true)
							for (let index = 0; index < newCardDetails.tags.length; index++) {
								const other = newCardDetails.tags[index]
								if (!other.upHilight && !other.downHilight) remove = false
							}
						} catch (error) {
							alert("Error. Try again later?")
							console.log(error)
							return
							//rediv.remove()
						}
						if (remove) {
							rediv.remove()
							next(details, "allVoted")
						} else createCard(newCardDetails, rediv, next) // refresh card with new voting data
					})
			}
			voteButtons[0].onclick = () => { postVote(voteAmounts[0]) }
			voteButtons[1].onclick = () => { postVote(voteAmounts[1]) }
			tagElement.querySelector("[quik=\"google\"]").href = `https://www.google.com/search?q=${tag.name}&tbm=isch&amp;safe=active`
			tagElement.querySelector("[quik=\"bing\"]").href = `https://www.bing.com/images/search?q=${tag.name}`
			const reference = getReference(tag.name, details)
			console.log(reference)
			if (reference) {
				let referenceElement = createElement("p", "col-auto m-1 px-3")
				referenceElement.innerHTML = reference
				tagElement.append(referenceElement)
			}
		})
		cardElement.querySelector("[quik=\"skip\"]").onclick = async () => {
			rediv.remove()
			next(details, "skip")
		}
		rediv.append(cardElement)
		return rediv
	}
	selectModePage()
	let totalVotes = 0
	function breakHandler() {
		totalVotes = 0
		let breakTime = 0
		let breakTimeInterval = setInterval(() => {
			if (mainBody.innerText === "") {
				breakTime++
				if (breakTime > 3) {
					clearInterval(breakTimeInterval)
					selectModePage()
				}
			} else {
				breakTime = 0
			}
		}, 1000)
	}
	async function modeSurvey() {
		async function next(details, action) {
			let randomSkin = await getSkinDetails(details.randomSkin)
			mainBody.append(createCard(randomSkin, null, next))
		}
		let result = await getSkinDetails()
		for (let i = 0; i < 2; i++) {
			result = await getSkinDetails(result.randomSkin)
			mainBody.append(createCard(result, null, next))
		}
		breakHandler()
	}
	function sleep(ms) {
		return new Promise((resolve) => {
			setTimeout(resolve, ms)
		})
	}
	async function modeSearch(feature) {
		const cache = []
		const scrapeTime = 8000
		const maxVisible = 2
		async function next(details, action) {
			let cachedSkin = cache[0]
			cache.shift()
			if (!cachedSkin) return
			cachedSkin = await getSkinDetails(cachedSkin)
			mainBody.append(createCard(cachedSkin, null, next))
		}
		async function getPage(page) {
			fetch(`https://namemc.com/minecraft-skins/${feature}?page=${page}`)
				.then(response => response.text())
				.then(str => new window.DOMParser().parseFromString(str, "text/html"))
				.then(async (data) => {
					const skinElements = data.querySelectorAll('a[href*="/skin/"]')
					for (let i = 0; i < skinElements.length; i++) {
						const skinElement = skinElements[i]
						cache.push(cleanSkinUrl(skinElement.href))
					}

					if (skinElements.length < 30) return
					await sleep(scrapeTime)
					getPage(page + 1)
				})
		}
		let populateTime = 0
		setInterval(() => {
			const cardCount = mainBody.querySelectorAll("strong[uses]").length
			if (cardCount < maxVisible) {
				populateTime++
			} else populateTime = 0
			if (populateTime > 5) {
				populateTime = 0
				next(null, "populate")
			}
		}, 400)
		getPage(1)
		breakHandler()
	}
})()