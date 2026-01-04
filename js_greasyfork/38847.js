// ==UserScript==
// @name        Show full size image in m.facebook.com for firefox
// @namespace		Show full size image in m.facebook.com for firefox
// @include     /https\:\/\/m\.facebook\.com\//
// @version     3.7
// @author      zero0evolution
// @description  Show full size image in m.facebook.com.
// @downloadURL https://update.greasyfork.org/scripts/38847/Show%20full%20size%20image%20in%20mfacebookcom%20for%20firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/38847/Show%20full%20size%20image%20in%20mfacebookcom%20for%20firefox.meta.js
// ==/UserScript==


// example site:"https://m.facebook.com/photo.php?fbid=...","https://m.facebook.com/.../photos/..."

// 圖片網頁格式
// /^https\:\/\/m\.facebook\.com\/(?:[0-9a-zA-Z\.]+\/photos\/[0-9a-zA-Z\.]+\/\d+|photo\.php\?fbid\=\d+)/


function unicodeToChar(text){
	text = text.replace(
		/\\u[\dA-F]{4}/gi,(match) => {
			// 刪掉\u
			match = match.replace(/\\u/g, '')
			// 16進位轉10進位
			match = parseInt(match, 16)
			// 轉字元
			match = String.fromCharCode(match)
			return(match)
		}
	)
	return(text)
}

async function getHTML(link,encoding="UTF-8",
	requestOptions = {"credentials": "same-origin"}){

	const response = await fetch(
		link,requestOptions
	).then(
		(response)=>{return(response)}
	)

	const arrayBuffer = await response.arrayBuffer().then(
		(arrayBuffer)=>{return(arrayBuffer)}
	)

	const htmlCode = new TextDecoder(encoding).decode(arrayBuffer)

	return(htmlCode)
}

async function getOriginLink(link){
	const htmlCode = await getHTML(link)
	const matchImgLinkObj = htmlCode.match(/document\.location\.href\=\"(.*?)\"/)
	if(matchImgLinkObj){
		const originLink = matchImgLinkObj[1].replace(/\\\//img,"/")
		console.log("得到新的圖片連結:",originLink)
		return(originLink)
	}
}

function loadImg(link){
	return(
		new Promise(
			(resolve,reject)=>{
				let tempImg
				if(typeof(link) === "string"){
					tempImg = document.createElement("img")
					tempImg.src = link
				}
				else if(link instanceof Element && link.matches("img")){
					tempImg = link
				}
				else{
					reject("no img link or img elem")
				}
				tempImg.onload = async(event)=>{
					resolve(tempImg)
				}
			}
		)
	)
}

async function imgViewFullSize(targetImg,link){
	targetImg.style.maxWidth = "100%"
	// targetImg.style.maxHeight = "100vh"
	targetImg.style.height = "auto"
	targetImg.style.width = "auto"

	targetImg.removeAttribute("width")
	targetImg.removeAttribute("height")

	let elem = targetImg.parentElement

	while(elem.style.width || elem.style.height){

		elem.style.removeProperty("width")
		elem.style.removeProperty("height")

		const elemStyle = getComputedStyle(elem)
		if(elemStyle.position.match(/^(absolute|fixed)$/)){
			elem.style.position = "static"
		}
		elem = elem.parentElement
	}

	// check if link is not png,jpg, need redirect
	if(!link.match(/.*\/(.*?\.(?:png|jpg))(?:\?.*)?$/)){
		link = await getOriginLink(link)
	}

	if(targetImg.matches("img")){

		await loadImg(link)

		targetImg.src = link
		return(targetImg)
	}
	else if(targetImg.matches("i.img")){
		const parent = targetImg.parentElement

		targetImg.remove()
		const tempElem = document.createElement("div")
		tempElem.innerHTML = `<img src=${link} style="max-width:100%">`
		const newTargetImg = tempElem.firstElementChild
		parent.appendChild(newTargetImg)
		await loadImg(newTargetImg)
		
		return(newTargetImg)
	}

	
}

function replaceLinkElem(linkElem){
	const newElem = document.createElement("span")
	newElem.dataset.link = linkElem.href
	newElem.textContent = linkElem.textContent
	linkElem.parentElement.insertBefore(newElem,linkElem)
	linkElem.remove()
	return(newElem)
}

function moveElemFunc(moveElem,targetElem){
	if(targetElem.parentElement instanceof Element){
		targetElem.parentElement.insertBefore(moveElem,targetElem.nextSibling)
		return(moveElem)
	}
}

function moveElemsFunc(moveElems,targetElem){
	for(let i=moveElems.length-1;i>=0;i--){
		moveElemFunc(moveElems[i],targetElem)
	}
}


async function showFullFunc(linkElem){

	const originHref = linkElem.getAttribute("href")

	if(!originHref){
		// console.warn(linkElem)
		return(null)
	}

	const viewFullSizeTextPattern = /^(?:全尺寸檢視|view full size)$/i

	if(
		linkElem.textContent.match(viewFullSizeTextPattern) && 
		linkElem.matches("#viewport #rootcontainer a[href]")
	){
		

		let targetElem = document.querySelector("#viewport #rootcontainer i.img[role='img'][data-store][style^='background-image: url']")
		if(targetElem instanceof Element){
			// const parent = targetElem.parentElement

			// const tempElem = document.createElement("div")
			// tempElem.innerHTML = `<img src=${linkElem.href} style="max-width:100%">`
			// parent.appendChild(tempElem.firstElementChild)
			// targetElem.remove()

			targetElem = await imgViewFullSize(targetElem,linkElem.getAttribute("href"))
		}
	}

	const photoLinkPattern = /^\/?(?:photo\.php\?fbid\=|[0-9a-z\.\-\_]+\/photos\/)/i
	const photoLinkPattern2 = /^\/[0-9a-zA-Z\.]+\/photos\/[0-9a-zA-Z\.]+\/[0-9]+/i

	const photoLinkPattern3 = /^\/photos\/viewer\/\?/
	

	if(
		originHref.match(photoLinkPattern) || 
		originHref.match(photoLinkPattern2) ||
		originHref.match(photoLinkPattern3)
	){

		
		let targetImg = linkElem.querySelector(
			"i.img[role='img'][style*='background-image:']")
		if(targetImg instanceof Element){

			// console.log(linkElem.href)

			linkElem.parentElement.align = "center"
			linkElem.parentElement.style.width = "100%"
			linkElem.parentElement.style.removeProperty("height")
			linkElem.parentElement.style.display = "inline-block"
			linkElem.style.removeProperty("left")
			linkElem.style.removeProperty("top")
			linkElem.style.removeProperty("width")
			linkElem.style.removeProperty("height")
			linkElem.style.maxWidth = "100%"
			linkElem.style.height = "auto"
			linkElem.style.position = "relative"

			let nextLinkElem = linkElem.nextElementSibling

			const htmlCode = await getHTML(linkElem.href)
			const matches = htmlCode.match(/\<a\s.*?\<\/a\>/img)
			// console.log(matches)
			for(const match of matches){
				const tempElem = document.createElement("div")
				tempElem.innerHTML = match
				const fullSizeLinkElem = tempElem.firstElementChild
				if(fullSizeLinkElem.textContent.match(viewFullSizeTextPattern)){

					let fullImgLink = fullSizeLinkElem.getAttribute("href")
					if(!fullImgLink.match(/.*\/(.*?\.(?:png|jpg))(?:\?.*)?$/)){
						fullImgLink = await getOriginLink(fullImgLink)
					}
					linkElem.innerHTML = `<img src="${fullImgLink}" style="max-width:100%;height:auto;">`
					// console.log(linkElem.innerHTML)
					// targetImg = await imgViewFullSize(targetImg,fullSizeLinkElem.href)

					linkElem.parentElement.insertBefore(document.createElement("br"),linkElem.nextElementSibling)
					break
				}
			}

			

			if(
				(!(nextLinkElem instanceof Element)) || 
				(!(nextLinkElem.matches("a[href]")))
			){
				// console.log("最後一個linkElem:",linkElem)
				// 找下一張連結
				for(const match of matches){
					const tempElem = document.createElement("div")
					tempElem.innerHTML = match
					nextLinkElem = tempElem.firstElementChild
					if(!nextLinkElem.matches("a.touchable[href]")){
						continue
					}
					if(!nextLinkElem.textContent.match(/^(Next|繼續)$/i)){
						continue
					}
					const nextLink = nextLinkElem.getAttribute("href")
					// 建立按鈕且功能為加入下一張圖片
					const button = document.createElement("button")
					button.textContent = "Next"
					linkElem.parentElement.insertBefore(button,linkElem.nextElementSibling.nextElementSibling)

					button.dataset.link = nextLink

					button.addEventListener("click",function(event){
						const button = event.currentTarget
						const link = button.dataset.link
						
						const tempElem = document.createElement("div")
						tempElem.innerHTML = `
							<a href="${link}">
								<i class="img" role="img" style="background-image:none;"></i>
							</a>
						`
						const nextLinkElem = tempElem.firstElementChild

						button.parentElement.insertBefore(
							nextLinkElem,button.nextElementSibling)

						button.remove()
					})
				}
			}
		}
	}

	
	// 新增影片
	const videoLinkPattern = /^\/?video\_redirect\/\?src\=/i
	if(originHref.match(videoLinkPattern)){
		const videoLink = decodeURIComponent(originHref.replace(videoLinkPattern,""))
		const videoElem = document.createElement("video")
		videoElem.src = videoLink
		videoElem.controls = true
		// videoElem.style.maxWidth = "100%"
		videoElem.style.width = "100%"
		videoElem.style.minHeight = "60vh"
		videoElem.style.maxHeight = "100vh"

		linkElem.parentElement.insertBefore(videoElem,linkElem.nextSibling)
		linkElem.remove()
		// videoElem.parentElement.align = "center"
	}
	
}


// 挑出所有的連結
// const selectorText = "a[href]"
async function filterFunc(topElem){
	if(topElem.matches("a[href]")){
		await showFullFunc(topElem).catch((err)=>{console.warn(err)})
	}
	for(const linkElem of topElem.querySelectorAll("a[href]")){
		await showFullFunc(linkElem).catch((err)=>{console.warn(err)})
	}
}

filterFunc(document.documentElement)

const observerObj = new MutationObserver(
	function (mutationObjs){
		for(const eachMutationObj of mutationObjs){
			for(const eachAddNode of eachMutationObj.addedNodes){
				if(eachAddNode.nodeType === 1){
					filterFunc(eachAddNode)
				}
			}
		}
	}
)

observerObj.observe(
	document.documentElement,{
		childList:true,
		subtree:true,
	}
)


// 顯示更多
// 查看更多動態
// video