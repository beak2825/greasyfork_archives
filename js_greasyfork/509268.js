// ==UserScript==
// @name         Audible Search Hub
// @namespace    https://greasyfork.org/en/users/1370284
// @version      0.2.4
// @license      MIT
// @description  Add various search links to Audible (MyAnonaMouse, AudioBookBay, Mobilism, Goodreads, Anna's Archive, Z-Library & more)
// @match        https://*.audible.*/pd/*
// @match        https://*.audible.*/ac/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/509268/Audible%20Search%20Hub.user.js
// @updateURL https://update.greasyfork.org/scripts/509268/Audible%20Search%20Hub.meta.js
// ==/UserScript==

const sites = {
	mam: {
		label: '🐭 MAM',
		name: 'MyAnonaMouse',
		url: 'https://www.myanonamouse.net',
		searchBy: {
			title: true,
			titleAuthor: true,
			titleAuthorNarrator: true,
		},
		getLink: (search, opts = {}) => {
			const baseUrl = GM_config.get('url_mam')

			const url = new URL(`${baseUrl}/tor/browse.php`)

			url.searchParams.set('tor[text]', search)
			url.searchParams.set('tor[searchType]', 'active')
			url.searchParams.set('tor[main_cat]', 13) // Audiobooks - not working tho...
			url.searchParams.set('tor[srchIn][title]', true)
			url.searchParams.set('tor[srchIn][author]', true)
			if (opts?.narrator) {
				url.searchParams.set('tor[srchIn][narrator]', true)
			}
			return url.href
		},
	},
	abb: {
		label: '🎧 ABB',
		name: 'AudioBookBay',
		url: 'https://audiobookbay.lu',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_abb')
			const url = new URL(baseUrl)
			url.searchParams.set('s', search.toLowerCase())
			return url.href
		},
	},
	mobilism: {
		label: '📱 Mobilism',
		name: 'Mobilism',
		url: 'https://forum.mobilism.org',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_mobilism')
			const url = new URL(`${baseUrl}/search.php`)
			url.searchParams.set('keywords', search)
			url.searchParams.set('sr', 'topics')
			url.searchParams.set('sf', 'titleonly')
			return url.href
		},
	},
	goodreads: {
		label: '🔖 Goodreads',
		name: 'Goodreads',
		url: 'https://www.goodreads.com',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_goodreads')
			const url = new URL(`${baseUrl}/search`)
			url.searchParams.set('q', search)
			return url.href
		},
	},
	anna: {
		label: '📚 Anna',
		name: "Anna's Archive",
		url: 'https://annas-archive.org',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_anna')
			const url = new URL(`${baseUrl}/search`)
			url.searchParams.set('q', search)
			url.searchParams.set('lang', 'en')
			return url.href
		},
	},
	zlib: {
		label: '📕 zLib',
		name: 'Z-Library',
		url: 'https://z-lib.gs',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_zlib')
			const url = new URL(`${baseUrl}/s/${search}`)
			return url.href
		},
	},
	libgen: {
		label: '📗 Libgen',
		name: 'Libgen',
		url: 'https://libgen.rs',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_libgen')
			const url = new URL(`${baseUrl}/search`)
			url.searchParams.set('req', search)
			return url.href
		},
	},
	tgx: {
		label: '🌌 TGX',
		name: 'TorrentGalaxy',
		url: 'https://tgx.rs/torrents.php',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_tgx')
			const url = new URL(baseUrl)
			url.searchParams.set('search', search)
			return url.href
		},
	},
	btdig: {
		label: '⛏️ BTDig',
		name: 'BTDig',
		url: 'https://btdig.com',
		searchBy: { title: false, titleAuthor: true },
		getLink: (search) => {
			const baseUrl = GM_config.get('url_btdig')
			const url = new URL(`${baseUrl}/search`)
			url.searchParams.set('q', search)
			return url.href
		},
	},
	// TODO: add libby, pointing to your library
}

const sitesKeys = Object.keys(sites)

const searchByFields = {
	title: {
		label: 't',
		description: 'title',
	},
	titleAuthor: {
		label: 't+a',
		description: 'title + author',
	},
	titleAuthorNarrator: {
		label: 't+a+n',
		description: 'title + author + narrator',
	},
}

function addSiteConfig(site) {
	return {
		[`section_${site}`]: {
			label: `-------------- ${sites[site].name} 👇 --------------`,
			type: 'hidden',
		},
		[`enable_${site}`]: {
			label: 'Enable',
			type: 'checkbox',
			default: true,
		},
		[`url_${site}`]: {
			label: 'URL',
			type: 'text',
			default: sites[site].url,
		},
		[`enable_search_title_${site}`]: {
			label: 'Enable Search by Title',
			type: 'checkbox',
			default: sites[site].searchBy?.title || false,
		},
		[`enable_search_titleAuthor_${site}`]: {
			label: 'Enable Search by Title + Author',
			type: 'checkbox',
			default: sites[site].searchBy?.titleAuthor || false,
		},
		[`enable_search_titleAuthorNarrator_${site}`]: {
			label: 'Enable Search by Title + Author + Narrator',
			type: 'checkbox',
			default: sites[site].searchBy?.titleAuthorNarrator || false,
		},
	}
}

const perSiteFields = sitesKeys.reduce((acc, siteKey) => {
	return {
		...acc,
		...addSiteConfig(siteKey, sites[siteKey]),
	}
}, {})

GM_config.init({
	id: 'audible-search-sites',
	title: 'Search Sites',
	fields: {
		open_in_new_tab: {
			label: 'Open Links in New Tab',
			type: 'checkbox',
			default: true,
		},
		...perSiteFields,
	},
})

GM_registerMenuCommand('Open Settings', () => {
	GM_config.open()
})

function createLink(text, href, title) {
	const link = document.createElement('a')
	link.href = href
	link.textContent = text
	link.target = GM_config.get('open_in_new_tab') ? '_blank' : '_self'
	link.classList.add(
		'bc-tag',
		'bc-size-footnote',
		'bc-tag-outline',
		'bc-badge-tag',
		'bc-badge',
		'custom-bc-tag'
	)
	link.title = title || text
	return link
}

function createLinksContainer() {
	const container = document.createElement('div')
	container.style.marginTop = '8px'
	container.style.display = 'flex'
	container.style.alignItems = 'center'
	container.style.flexWrap = 'wrap'
	container.style.gap = '4px'
	container.style.maxWidth = '340px'
	return container
}

const parser = new DOMParser()

function decodeHtmlEntities(str) {
	if (str == null) return ''
	const domParser = parser || new DOMParser()
	const doc = domParser.parseFromString(str, 'text/html')
	return doc.documentElement.textContent
}

function cleanSeriesName(seriesName) {
	if (!seriesName) return ''

	const wordsToRemove = new Set(['series', 'an', 'the', 'novel'])
	return seriesName
		.toLowerCase()
		.split(' ')
		.filter((word) => !wordsToRemove.has(word))
		.join(' ')
		.trim()
}

function cleanQuery(str) {
	const decoded = decodeHtmlEntities(str)
	// Remove dashes only when surrounded by spaces
	const noSurroundingDashes = decoded.replace(/(?<=\s)-(?=\s)/g, '')
	// Remove other unwanted characters
	return noSurroundingDashes.replace(/[?!:+~]/g, '')
}

function removePersonTitles(str) {
	return str
		?.replace(
			/\b(Dr\.?|Mr\.?|Mrs\.?|Ms\.?|Prof\.?|M\.?D\.?|Ph\.?D\.?|D\.?O\.?|D\.?C\.?|D\.?D\.?S\.?|D\.?M\.?D\.?|D\.?Sc\.?|Ed\.?D\.?|LLB|JD|Esq\.?)\b\.?/gi,
			''
		) // Remove common author-related titles
		.replace(/\b\w{1,2}\.\s*/g, '') // Remove any 1 or 2 letter abbreviations followed by a dot
		.replace(/\s+/g, ' ') // Condense multiple spaces into one
		.trim() // Trim any extra spaces at the start or end
}

function extractBookInfo(data) {
	return {
		title: cleanQuery(data?.name),
		author: removePersonTitles(cleanQuery(data?.author?.at(0)?.name)),
		narrator: removePersonTitles(cleanQuery(data?.readBy?.at(0)?.name)),
	}
}

async function injectSearchLinks(data) {
	const { title, author, narrator } = extractBookInfo(data)
	const titleAuthor = `${title} ${author} `
	const titleAuthorNarrator = `${title} ${author} ${narrator}`

	const authorLabelEl = document.querySelector('.authorLabel')
	const infoParentEl = authorLabelEl?.parentElement

	if (!infoParentEl) {
		console.warn("Can't find the parent element to inject links.")
		return
	}

	const linksContainer = createLinksContainer()
	const fragment = document.createDocumentFragment() // Use a DocumentFragment

	sitesKeys.forEach((siteKey) => {
		if (GM_config.get(`enable_${siteKey}`)) {
			const { label, name, getLink } = sites[siteKey]

			const enabledSearchFields = Object.keys(searchByFields).filter((field) =>
				GM_config.get(`enable_search_${field}_${siteKey}`)
			)
			const isMultipleEnabled = enabledSearchFields.length > 1

			enabledSearchFields.forEach((field) => {
				const { label: searchLabel, description } = searchByFields[field]

				const finalLabel = isMultipleEnabled
					? `${label} (${searchLabel})`
					: label

				let searchValue

				if (field === 'titleAuthorNarrator') {
					searchValue = titleAuthorNarrator
				} else if (field === 'titleAuthor') {
					searchValue = titleAuthor
				} else {
					searchValue = title
				}

				const opts = narrator ? { narrator } : {}

				const link = createLink(
					finalLabel,
					getLink(searchValue, opts),
					`Search ${name} by ${description}`
				)
				fragment.appendChild(link)
			})
		}
	})

	linksContainer.appendChild(fragment)
	infoParentEl.parentElement.appendChild(linksContainer)
}

function injectStyles() {
	const style = document.createElement('style')
	style.textContent = `
    .custom-bc-tag {
      text-decoration: none;
      transition: background-color 0.2s ease;
			white-space: nowrap;
    }
    .custom-bc-tag:hover {
      background-color: #f0f0f0;
      text-decoration: none;
    }
  `
	document.head.appendChild(style)
}

function extractBookData(doc) {
	try {
		const acceptedType = 'Audiobook'
		const ldJsonScripts = doc.querySelectorAll(
			'script[type="application/ld+json"]'
		)

		for (const script of ldJsonScripts) {
			try {
				const jsonLdData = JSON.parse(script.textContent?.trim() || '')
				const items = Array.isArray(jsonLdData) ? jsonLdData : [jsonLdData]

				for (const item of items) {
					if (item['@type'] === acceptedType) {
						return item
					}
				}
			} catch (error) {
				console.error('Error parsing JSON-LD:', error)
			}
		}

		return null
	} catch (error) {
		console.error(`Error parsing data: `, error)
		return null
	}
}

function waitForBookDataScripts() {
	return new Promise((resolve, reject) => {
		const data = extractBookData(document)
		if (data) return resolve(data)

		const observer = new MutationObserver(() => {
			const data = extractBookData(document)
			if (data) {
				observer.disconnect()
				resolve(data)
			}
		})

		observer.observe(document, { childList: true, subtree: true })

		setTimeout(() => {
			observer.disconnect()
			reject(new Error('Timeout: ld+json script not found'))
		}, 2000)
	})
}

injectStyles()

waitForBookDataScripts()
	.then(injectSearchLinks)
	.catch((error) => console.error('Error:', error.message))
