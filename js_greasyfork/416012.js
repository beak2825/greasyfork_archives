// ==UserScript==
// @name         Gelbooru Preview and Download
// @namespace    https://sleazyfork.org/
// @version      2.1.0
// @description  Quick preview images and download in simple click
// @author       Ubhelbr
// @match        https://gelbooru.com/index.php?page=post&s=list*
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/416012/Gelbooru%20Preview%20and%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/416012/Gelbooru%20Preview%20and%20Download.meta.js
// ==/UserScript==

function fetchPage(link) {
	return new Promise((resolve, reject) => {
		if (dataStore[link.id]) {
			resolve(dataStore[link.id])
			return
		}
		fetch(link)
		.then(response => response.text())
		.then(function(html) {
		  let parser = new DOMParser()
		  , doc = parser.parseFromString(html, "text/html")
		  , images = getImage(doc)
		  dataStore[link.id] = {
		  	name: getTags(doc),
		  	image: images.full,
		  	sample: images.sample
		  }
		  resolve(dataStore[link.id])
		})
		.catch(function(err) {  
			reject(err)
		  console.log('Failed to fetch page: ', err) 
		})
	})
}

var dataStore = {}

function getTags(doc, options = {
	categories: ['character', 'artist', 'tag:reverse'],
	limit: 20
}) {
	let tagDiv = doc.querySelector('#tag-list div')
	, list = {}, currentCategory
	;[].find.call(tagDiv.children, el => {
		if (el.tagName == 'DIV') {
			currentCategory = el.innerText.toLowerCase()
			list[currentCategory] = []
		}
		else if (el.tagName == 'H3') {
			return 1
		}
		else if (el.tagName == 'LI'){
			list[currentCategory].push({
				tag: el.querySelector('a[href^="index.php?page=post"]').innerText.replace(/ /g, '_'),
				count: + el.querySelector('span').innerText
			})
		}
		return 0
	})
	let allTags = []
	options.categories.forEach(category => {
		let s = category.split(':')
		, cat = list[s[0]]
		if (!cat) return;
		if (s[1] == 'reverse') {
			cat.sort((a,b) => a.count - b.count)
		}
		cat.map(i => i.tag).forEach(tag => {
			if (!tag.match(/["#%&\*:<>\?\/\\{\|}]/) && tag.length)
				allTags.push(tag)
		})
	})
	return allTags.slice(0, options.limit).join('-')
}

function getImage(doc) {
	let sImg = doc.querySelector('.image-container picture img')
	, sSrc = sImg.src
	, sw = sImg.width
	, scr = [].find.call(doc.querySelectorAll('script:not([src])'), s => s.innerText.match('resizeTransition')).innerText
	, fw = scr.match(/image\.width\('(\d+)/)[1]
	, fSrc = (sw == fw) ? sSrc : scr.match(/image\.attr\('src','(.+)'/)[1]
	return {
		full: fSrc,
		sample: sSrc
	}
}

function init() {
	let downloaded = GM_getValue('GBPAD-downloaded')
	downloaded = (typeof downloaded !== 'string') ? [] : downloaded.split(',')
	;[].forEach.call(document.querySelectorAll('article.thumbnail-preview'), link => {
		let a = link.querySelector('a')
		, thumb = a.querySelector('img')
		, markAsDownloaded = ~downloaded.indexOf(a.id)
		if (markAsDownloaded)
			thumb.style.boxShadow = "rgb(43, 175, 0) 0px 0px 0px 2px"
		a.onclick = ev => {
			ev.preventDefault()
			thumb.style.boxShadow = "rgb(32, 173, 255) 0px 0px 0px 2px"
			fetchPage(a).then(data => {
				GM_download({
					url: data.image, 
					name: `${a.id.split('p')[1]} ${data.name}.${data.image.match(/(:?.+)\.(.+?)$/)[2]}`,
					onload: () => {
						thumb.style.boxShadow = "rgb(43, 175, 0) 0px 0px 0px 2px"
					}
				})
				if (!markAsDownloaded) {
					downloaded.push(a.id)
					GM_setValue('GBPAD-downloaded', downloaded.join(','))
				}
			})
		}
		thumb.addEventListener('mouseenter', () => {
			if (thumb.classList.contains('GBPAD-expanded') || thumb.classList.contains('webm')) return;
			setTimeout(() => {
				fetchPage(a).then(data => {
					thumb.style.width = `${thumb.width + 10}px`
					thumb.style.height = `${thumb.height + 10}px`
					thumb.src = data.sample
					thumb.classList.add('GBPAD-expanded')
				})
			}, 250)
		});
	})

	injector.inject('GBPAD', `
		.thumbnail-preview img {
			transform: scale(1);
			transition: transform .2s, box-shadow .2s;
		}
		.thumbnail-preview img:hover {
			transform: scale(2);
			z-index: 1;
			position: relative;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
		}
	`)
}

// CSS injector
var injector = {
  inject: function(alias, css) {
    var id = `injector:${alias}`
    var existing = document.getElementById(id)
    if(existing) {
      existing.innerHTML = css
      return
    }
    var head = document.head || document.getElementsByTagName('head')[0]
    , style = document.createElement('style');
    style.type = 'text/css'
    style.id = id
    if (style.styleSheet) {
      style.styleSheet.cssText = css
    } else {
      style.appendChild(document.createTextNode(css))
    }
    head.appendChild(style)
  },
  remove: function(alias) {
    var id = `injector:${alias}`
    var style = document.getElementById(id)
    if(style) {
      var head = document.head || document.getElementsByTagName('head')[0]
      if(head)
        head.removeChild(document.getElementById(id))
    }
  }
}

init()