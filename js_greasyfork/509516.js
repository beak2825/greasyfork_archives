// ==UserScript==
// @name         Audible Search Marketplaces
// @namespace    https://greasyfork.org/en/users/1370284
// @version      0.0.1
// @license      MIT
// @description  Add links to all Amazon marketplaces, highlighting free ones
// @match        https://*.audible.*/pd/*
// @match        https://*.audible.*/ac/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/509516/Audible%20Search%20Marketplaces.user.js
// @updateURL https://update.greasyfork.org/scripts/509516/Audible%20Search%20Marketplaces.meta.js
// ==/UserScript==

const MARKETPLACE = {
	us: { tld: 'com', flag: '🇺🇸', name: 'US' },
	uk: { tld: 'co.uk', flag: '🇬🇧', name: 'UK' },
	ca: { tld: 'ca', flag: '🇨🇦', name: 'Canada' },
	au: { tld: 'com.au', flag: '🇦🇺', name: 'Australia' },
	de: { tld: 'de', flag: '🇩🇪', name: 'Germany' },
	fr: { tld: 'fr', flag: '🇫🇷', name: 'France' },
	es: { tld: 'es', flag: '🇪🇸', name: 'Spain' },
	it: { tld: 'it', flag: '🇮🇹', name: 'Italy' },
	in: { tld: 'in', flag: '🇮🇳', name: 'India' },
	// TODO
	// br: { tld: 'com.br', flag: '🇧🇷', name: 'Brazil' },
	// jp: { tld: 'co.jp', flag: '🇯🇵', name: 'Japan' },
}

function addMarketplaceConfig(marketplaceKey) {
	const { name, flag, tld } = MARKETPLACE[marketplaceKey]
	return {
		[`enable_${marketplaceKey}`]: {
			label: `Enable .${tld} ${flag} (${name})`,
			type: 'checkbox',
			default: true,
		},
	}
}

const marketplaceConfigFields = Object.keys(MARKETPLACE).reduce(
	(acc, region) => ({ ...acc, ...addMarketplaceConfig(region) }),
	{}
)

GM_config.init({
	id: 'audible-marketplaces',
	title: 'Marketplace Settings',
	fields: {
		open_in_new_tab: {
			label: 'Open Links in New Tab',
			type: 'checkbox',
			default: true,
		},
		...marketplaceConfigFields,
	},
})

GM_registerMenuCommand('Open Settings', () => {
	GM_config.open()
})

const parser = new DOMParser()
function decodeHtmlEntities(str) {
	if (str == null) return ''
	const domParser = parser || new DOMParser()
	const doc = domParser.parseFromString(str, 'text/html')
	return doc.documentElement.textContent
}

function audible(region) {
	const tld = MARKETPLACE[region].tld
	return {
		api: `https://api.audible.${tld}/1.0`,
		client: `https://www.audible.${tld}`,
		productPage: (asin) => `https://www.audible.${tld}/pd/${asin}`,
	}
}

function constructAudibleProductUrl(region, asin) {
	return audible(region).productPage(asin)
}

function extractRegionFromUrl(url) {
	try {
		const { hostname } = new URL(url)
		for (const [key, marketplace] of Object.entries(MARKETPLACE)) {
			if (hostname.endsWith(marketplace.tld)) {
				return key
			}
		}
		return null
	} catch (e) {
		console.error('Invalid URL:', e)
		return null
	}
}

function extractAsinFromUrl(url) {
	const asinMatch = url.pathname.match(/\/([A-Z0-9]{10})/)
	return asinMatch ? asinMatch[1] : null
}

function createLink(text, href, title, isFree) {
	const link = document.createElement('a')
	link.href = href
	link.textContent = text
	link.target = GM_config.get('open_in_new_tab') ? '_blank' : '_self'
	link.title = title || text
	link.classList.add(
		'bc-tag',
		'bc-size-footnote',
		'bc-tag-outline',
		'bc-badge-tag',
		'bc-badge',
		'bc-tag-custom-marketplace'
	)
	isFree && link.classList.add('free-item')

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
	container.classList.add('marketplace-links-container')
	return container
}

function extractBookInfo(data) {
	return {
		title: decodeHtmlEntities(data?.name),
		author: decodeHtmlEntities(data?.author?.at(0)?.name),
		narrator: decodeHtmlEntities(data?.readBy?.map((a) => a.name).join(', ')),
		language: data?.inLanguage ?? 'english',
	}
}

function mapResults(results, title) {
	return results
		.filter((r) => r.status === 'fulfilled')
		.map((r) => {
			const { region, products } = r.value
			return {
				region,
				products: products
					.filter((p) => {
						const matchesTitle =
							p.title.toLocaleLowerCase() === title.toLocaleLowerCase()
						const isCurrentBookInCurrentRegion =
							region === REGION && p.asin === ASIN
						return matchesTitle && !isCurrentBookInCurrentRegion
					})
					.map((p) => mapProductFromCatalogSearch(p, region)),
			}
		})
}

function createMarketplaceLink(region, product) {
	const { flag, name } = MARKETPLACE[region]
	const label = `${flag} ${region}`
	return createLink(label, product.url, `View in ${name}`, product.isFree)
}

function appendLinksToPage(mappedResults) {
	const authorLabelEl = document.querySelector('.authorLabel')
	const infoParentEl = authorLabelEl?.parentElement

	if (!infoParentEl) {
		console.warn("Can't find the parent element to inject links.")
		return
	}

	const linksContainer = createLinksContainer()

	const fragment = document.createDocumentFragment()
	mappedResults.forEach(({ region, products }) => {
		products.forEach((product) => {
			const link = createMarketplaceLink(region, product)
			fragment.appendChild(link)
		})
	})

	linksContainer.appendChild(fragment)

	if (infoParentEl) {
		infoParentEl.parentElement.appendChild(linksContainer)
	}
}

const REGION = extractRegionFromUrl(window.location)
const ASIN = extractAsinFromUrl(window.location)

async function processAndInjectLinks(data) {
	const regionsToSearch = [
		REGION,
		...Object.keys(MARKETPLACE).filter((m) => m !== REGION),
	].filter((m) => GM_config.get(`enable_${m}`))

	const bookInfo = extractBookInfo(data)
	const searchParams = {
		title: bookInfo.title,
		author: bookInfo.author,
		narrator: bookInfo.narrator,
		language: bookInfo.language,
	}

	const results = await Promise.allSettled(
		regionsToSearch.map(async (region) => {
			const products = await searchCatalogProducts(region, searchParams)
			return { region, products }
		})
	)

	const mappedResults = mapResults(results, bookInfo.title)

	appendLinksToPage(mappedResults)
}

function mapProductFromCatalogSearch(p, region) {
	return {
		asin: p.asin,
		title: p.title,
		author: p.authors.map((a) => a.name).join(', '),
		narrator: p.narrators?.map((a) => a.name).join(', '),
		publisher: p.publisher_name,
		language: p.language,
		url: constructAudibleProductUrl(region, p.asin),
		isFree: checkIfFree(p.plans),
	}
}

function checkIfFree(plans) {
	return plans.some((plan) => plan.plan_name.includes('AYCL'))
}

async function searchCatalogProducts(region, query) {
	const url = audible(region ?? 'us').api
	const searchParams = new URLSearchParams({
		response_groups: [
			'contributors',
			'product_extended_attrs',
			'product_desc',
			'product_plan_details',
			'product_plans',
		].join(','),
		num_results: '5',
		products_sort_by: 'Relevance',
		...query,
	})

	const res = await fetch(`${url}/catalog/products?${searchParams}`)
	const data = await res.json()
	return data.products
}

function injectStyles() {
	const style = document.createElement('style')
	style.textContent = `
    .bc-tag-custom-marketplace {
      white-space: nowrap;
      text-decoration: none !important;
      transition: background-color 0.2s ease;
    }

    .bc-tag-custom-marketplace:hover {
      background-color: #f0f0f0 !important;
    }

    .free-item {
      color: #14532d !important;
      border-color: #16a34a !important;
      background-color: #dcfce7 !important;
    }

    .free-item:hover {
      background-color: #cbeecf !important;
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
	.then(processAndInjectLinks)
	.catch((error) => console.error('Error:', error.message))
