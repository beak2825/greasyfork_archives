// ==UserScript==
// @name         Audible HQ Cover
// @namespace    https://greasyfork.org/en/users/1370205
// @version      0.2.3
// @description  Full-res cover images on Audible, with 'open' and 'download' actions.
// @license      MIT
// @match        https://*.audible.*/pd/*
// @match        https://*.audible.*/ac/*
// @downloadURL https://update.greasyfork.org/scripts/511910/Audible%20HQ%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/511910/Audible%20HQ%20Cover.meta.js
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
	jp: { tld: 'co.jp', flag: '🇯🇵', name: 'Japan' },
	br: { tld: 'com.br', flag: '🇧🇷', name: 'Brazil' },
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

function getTld(region) {
	return MARKETPLACE[region].tld || 'com'
}

function getAudibleApiUrl(region) {
	const tld = getTld(region)
	return new URL(`https://api.audible.${tld}/1.0`).href
}

const fetchProductData = async (region, asin, query) => {
	const baseUrl = getAudibleApiUrl(region)
	const url = new URL(`${baseUrl}/catalog/products/${asin}`)

	url.searchParams.append('num_results', '1')
	Object.entries(query).forEach(([key, value]) => {
		url.searchParams.append(key, value)
	})

	const response = await fetch(url.href, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})

	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`)
	}

	return await response.json()
}

async function fetchAudibleProductImages(region, asin) {
	const data = await fetchProductData(region, asin, {
		response_groups: 'media',
		image_sizes: 2400,
		num_results: '1',
	})
	return data.product.product_images
}

function extractParams() {
	const url = window.location
	const region = extractRegionFromUrl(url)
	const asin = extractAsinFromUrl(url)
	return { region, asin }
}

function downloadImage(imageUrl, fileName) {
	fetch(imageUrl)
		.then((response) => response.blob())
		.then((blob) => {
			const url = window.URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = url
			link.download = fileName
			link.style.display = 'none'
			document.body.appendChild(link)
			link.click()
			window.URL.revokeObjectURL(url)
			document.body.removeChild(link)
		})
		.catch((error) => console.error('Error downloading image:', error))
}

function createActionButton(iconUrl, title, onClick) {
	const button = document.createElement('button')
	button.title = title
	button.setAttribute('data-hidden', 'true')

	const icon = document.createElement('img')
	icon.src = iconUrl
	icon.alt = title

	button.appendChild(icon)
	button.addEventListener('click', (e) => {
		e.stopPropagation()
		e.preventDefault()
		onClick()
	})

	return button
}

function wrapCoverWithLink(imageElement, coverUrl) {
	const linkElement = document.createElement('a')
	linkElement.href = coverUrl
	linkElement.className = 'cover-link'
	linkElement.title = 'Open cover'
	linkElement.target = '_blank'
	imageElement.parentNode.insertBefore(linkElement, imageElement)
	linkElement.appendChild(imageElement)
}

function enhanceCoverImage(coverUrl, asin) {
	const imageElement = document.querySelector(
		'img.bc-pub-block.bc-image-inset-border.js-only-element'
	)

	if (imageElement) {
		const containerElement = document.createElement('div')
		containerElement.className = 'container'

		imageElement.parentNode.insertBefore(containerElement, imageElement)
		containerElement.appendChild(imageElement)

		wrapCoverWithLink(imageElement, coverUrl)

		const coverActionsContainer = document.createElement('div')
		coverActionsContainer.className = 'cover-actions-container'

		const hqButton = createActionButton(
			'https://api.iconify.design/solar:high-quality-bold.svg',
			'Load HQ cover',
			() => {
				imageElement.src = coverUrl
				hqButton.classList.add('action-btn-disabled')
				hqButton.title = 'HQ cover loaded'
			}
		)

		const downloadButton = createActionButton(
			'https://api.iconify.design/solar:download-square-bold.svg',
			'Download cover',
			() => downloadImage(coverUrl, `${asin}.jpg`)
		)

		coverActionsContainer.appendChild(hqButton)
		coverActionsContainer.appendChild(downloadButton)

		containerElement.appendChild(coverActionsContainer)

		containerElement.addEventListener('mouseenter', () => {
			downloadButton.setAttribute('data-hidden', false)
			hqButton.setAttribute('data-hidden', false)
		})
		containerElement.addEventListener('mouseleave', () => {
			downloadButton.setAttribute('data-hidden', true)
			hqButton.setAttribute('data-hidden', true)
		})
	} else {
		console.warn('Cover image element not found.')
	}
}

const COVER_SIZE = 2400

const main = async () => {
	try {
		const { region, asin } = extractParams()

		if (!region || !asin) {
			throw new Error('Unable to extract region or ASIN from URL')
		}

		const images = await fetchAudibleProductImages(region, asin)

		if (!images || !images[COVER_SIZE]) {
			throw new Error('No images found')
		}

		const cover = images[COVER_SIZE]

		enhanceCoverImage(cover, asin)
		addStyles()
	} catch (error) {
		console.error('Error in main function:', error.message)
	}
}

main()

function addStyles() {
	const style = document.createElement('style')
	style.textContent = `
		.cover-actions-container {
			position: absolute;
			bottom: 10px;
			right: 10px;
			display: flex;
			gap: 6px;
		}
		.cover-actions-container button {
			background-color: rgba(0, 0, 0, 0.85);
			border: none;
			border-radius: 12px;
			padding: 6px;	
			cursor: pointer;
			transition: opacity 200ms ease-in-out;
		}
		.cover-actions-container button img {
			width: 20px;
			height: 20px;
			filter: invert(1);
			display: block;
		}
		.cover-actions-container .action-btn-disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
		.container {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		[data-hidden="true"] {
			opacity: 0;
			visibility: hidden;
		}
		[data-hidden="false"] {
			opacity: 1;
			visibility: visible;
		}
	`
	document.head.appendChild(style)
}
