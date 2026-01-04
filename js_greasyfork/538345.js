// ==UserScript==
// @name         Enhanced Search !Bang Redirects v2
// @namespace    http://your.namespace.here
// @version      3.5
// @description  Redirects searches with custom bangs and DuckDuckGo bangs queried on-demand
// @match        *://*.google.com/*
// @match        *://*.bing.com/*
// @match        *://startpage.com/*
// @match        *://*.brave.com/*
// @match        *://*.ecosia.org/*
// @match        *://*.duckduckgo.com/*
// @match        *://*.qwant.com/*
// @match        *://*.mullvad.net/*
// @match        *://*.mojeek.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @grant        GM_xmlhttpRequest
// @connect      duckduckgo.com
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538345/Enhanced%20Search%20%21Bang%20Redirects%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/538345/Enhanced%20Search%20%21Bang%20Redirects%20v2.meta.js
// ==/UserScript==

/*
The MIT License (MIT)

Copyright (c) 2025 ShadowTux

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

(function() {
	'use strict';

	// Cross-browser compatibility layer
	const GM = (typeof window.GM !== 'undefined') ? window.GM : {};
	
	// Unified API functions for Firefox/Chrome compatibility
	function GM_setValue(key, value) {
		if (typeof window.GM_setValue !== 'undefined') {
			return window.GM_setValue(key, value);
		} else if (typeof window.GM.setValue !== 'undefined') {
			return window.GM.setValue(key, value);
		} else {
			console.warn('GM_setValue not available, using localStorage fallback');
			try {
				localStorage.setItem(key, JSON.stringify(value));
				return true;
			} catch (e) {
				console.error('Failed to set value:', e);
				return false;
			}
		}
	}
	
	function GM_getValue(key, defaultValue) {
		if (typeof window.GM_getValue !== 'undefined') {
			return window.GM_getValue(key, defaultValue);
		} else if (typeof window.GM.getValue !== 'undefined') {
			return window.GM.getValue(key, defaultValue);
		} else {
			console.warn('GM_getValue not available, using localStorage fallback');
			try {
				const value = localStorage.getItem(key);
				return value ? JSON.parse(value) : defaultValue;
			} catch (e) {
				console.error('Failed to get value:', e);
				return defaultValue;
			}
		}
	}
	
	function GM_xmlhttpRequest(options) {
		if (typeof window.GM_xmlhttpRequest !== 'undefined') {
			return window.GM_xmlhttpRequest(options);
		} else if (typeof window.GM.xmlHttpRequest !== 'undefined') {
			return window.GM.xmlHttpRequest(options);
		} else {
			console.warn('GM_xmlhttpRequest not available, using fetch fallback');
			// Fallback to fetch API
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), options.timeout || 15000);
			
			fetch(options.url, {
				method: options.method || 'GET',
				headers: options.headers || {},
				signal: controller.signal
			})
			.then(response => {
				clearTimeout(timeoutId);
				// Handle response.text() as a Promise
				return response.text().then(text => {
					if (options.onload) {
						options.onload({
							status: response.status,
							responseText: text,
							statusText: response.statusText
						});
					}
				});
			})
			.catch(error => {
				clearTimeout(timeoutId);
				if (options.onerror) {
					options.onerror(error);
				}
			});
		}
	}

	// Lightweight JSON fetch via GM (avoids CORS issues)
	function fetchJsonViaGM(url) {
		return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: 'GET',
				url,
				headers: {
					'Accept': 'application/json, text/javascript, */*; q=0.01'
				},
				onload: function(response) {
					try {
						const text = response.responseText;
						const data = JSON.parse(text);
						resolve(data);
					} catch (e) {
						reject(e);
					}
				},
				onerror: function(err) { reject(err); },
				ontimeout: function() { reject(new Error('GM request timeout')); },
				timeout: 15000
			});
		});
	}

	// Configuration
	const DDG_BANG_CACHE_KEY = 'ddg_bang_cache_v3';
	const DDG_BANG_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

	// Custom bangs that take priority over DuckDuckGo bangs
	const CUSTOM_BANGS = {
		// AI service bangs
		'!chatgpt': {
			url: 'https://chatgpt.com/?q={query}',
			description: 'ChatGPT AI Assistant',
			category: 'AI'
		},
		'!chat': {
			url: 'https://chatgpt.com/?q={query}',
			description: 'ChatGPT AI Assistant',
			category: 'AI'
		},
		'!claude': {
			url: 'https://claude.ai',
			description: 'Claude AI Assistant',
			category: 'AI'
		},
		'!t3': {
			url: 'https://t3.chat',
			description: 'T3 Chat AI Assistant',
			category: 'AI'
		},
		'!t3chat': {
			url: 'https://t3.chat',
			description: 'T3 Chat AI Assistant',
			category: 'AI'
		},
		'!summary': {
			url: 'https://search.brave.com/search?q={query}&source=llmSuggest&summary=1',
			description: 'Brave Search with AI Summary',
			category: 'AI'
		},
		'!perp': {
			url: 'https://www.perplexity.ai/search?q={query}',
			description: 'Perplexity AI Search',
			category: 'AI'
		},
		'!youai': {
			url: 'https://you.com/search?q={query}&fromSearchBar=true&tbm=youchat&chatMode=default',
			description: 'You.com AI Chat',
			category: 'AI'
		},
		'!phind': {
			url: 'https://www.phind.com/search?q={query}&searchMode=auto&allowMultiSearch=true',
			description: 'Phind AI for Developers',
			category: 'AI'
		},
		'!felo': {
			url: 'https://felo.ai/search?q={query}',
			description: 'Felo AI Search',
			category: 'AI'
		},
		'!ecoai': {
			url: 'https://www.ecosia.org/chat?q={query}',
			description: 'Ecosia AI Chat',
			category: 'AI'
		},
		'!mistral': {
			url: 'https://chat.mistral.ai/chat?q={query}&mode=ai',
			description: 'Mistral AI Chat',
			category: 'AI'
		},
		'!mis': {
			url: 'https://chat.mistral.ai/chat?q={query}&mode=ai',
			description: 'Mistral AI Chat',
			category: 'AI'
		},

		// Search engine bangs
		'!g': {
			url: 'https://www.google.com/search?q={query}',
			description: 'Google Search',
			category: 'Search'
		},
		'!s': {
			url: 'https://www.startpage.com/sp/search?query={query}',
			description: 'Startpage Search',
			category: 'Search'
		},
		'!sp': {
			url: 'https://www.startpage.com/sp/search?query={query}',
			description: 'Startpage Search',
			category: 'Search'
		},
		'!yt': {
			url: 'https://www.youtube.com/results?search_query={query}',
			description: 'YouTube Search',
			category: 'Multimedia'
		},
		'!w': {
			url: 'https://en.wikipedia.org/wiki/Special:Search?search={query}',
			description: 'Wikipedia Search',
			category: 'Research'
		},
		'!nixpkgs': {
			url: 'https://search.nixos.org/packages?query={query}',
			description: 'NixOS Packages',
			category: 'Tech'
		},
		'!ddg': {
			url: 'https://duckduckgo.com/?q={query}',
			description: 'DuckDuckGo Search',
			category: 'Search'
		},
		'!qw': {
			url: 'https://www.qwant.com/?q={query}&t=web',
			description: 'Qwant Search',
			category: 'Search'
		},
		'!qwant': {
			url: 'https://www.qwant.com/?q={query}&t=web',
			description: 'Qwant Search',
			category: 'Search'
		},
		'!leta': {
			url: 'https://leta.mullvad.net/search?q={query}&engine=brave',
			description: 'Mullvad Leta Search',
			category: 'Search'
		},

		// Mojeek bangs
		'!mj': {
			url: 'https://www.mojeek.com/search?q={query}&theme=dark',
			description: 'Mojeek Search',
			category: 'Search'
		},
		'!mojeek': {
			url: 'https://www.mojeek.com/search?q={query}&theme=dark',
			description: 'Mojeek Search',
			category: 'Search'
		},
		'!mjs': {
			url: 'https://www.mojeek.com/search?q={query}&theme=dark&fmt=summary',
			description: 'Mojeek Search with Summary',
			category: 'Search'
		},
		'!sum': {
			url: 'https://www.mojeek.com/search?q={query}&theme=dark&fmt=summary',
			description: 'Mojeek Search with Summary',
			category: 'Search'
		}
	};

	// Global bangs storage
	let allBangs = { ...CUSTOM_BANGS };

	// Function to extract URL parameters
	function getUrlParameter(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\?&]' + name + '=([^&#]*)');
		var results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	// Helper function to perform a direct redirect
	function performRedirect(url, query) {
		const finalUrl = url.replace('{query}', encodeURIComponent(query));

		// For URLs that don't contain {query} placeholder, don't add extra parameters
		let redirectUrl;
		if (url.includes('{query}')) {
			const separator = finalUrl.includes('?') ? '&' : '?';
			redirectUrl = finalUrl + separator + 'bang_redirect=1';
		} else {
			// For simple redirects like Claude.ai, just use the URL as-is
			redirectUrl = finalUrl;
		}

		console.log("Redirecting to:", redirectUrl);
		window.location.replace(redirectUrl);
	}

	// Function to query DuckDuckGo for a specific bang
	async function queryDuckDuckGoBang(bangTrigger) {
		try {
			// Remove the ! from the bang trigger
			const bangName = bangTrigger.substring(1);
			
			// Check cache first
			const cacheKey = `${DDG_BANG_CACHE_KEY}_${bangName}`;
			const cachedBang = GM_getValue(cacheKey, null);
			const cacheTimestamp = GM_getValue(`${cacheKey}_timestamp`, 0);
			const now = Date.now();
			
			if (cachedBang && (now - cacheTimestamp) < DDG_BANG_CACHE_DURATION) {
				console.log(`📦 Using cached DuckDuckGo bang: ${bangTrigger}`);
				return cachedBang;
			}
			
			console.log(`🔍 Querying DuckDuckGo bang.js for bang: ${bangTrigger}`);
			
			// Query DuckDuckGo's bang.js API (via GM to avoid CORS)
			const data = await fetchJsonViaGM('https://duckduckgo.com/bang.js');
			
			if (data && data.length > 0) {
				// Find the exact match by trigger
				const exactMatch = data.find(item => item.t === bangName);
				
				if (exactMatch) {
					console.log(`✅ Found DuckDuckGo bang: ${bangTrigger} -> ${exactMatch.s} (${exactMatch.c})`);
					
					const bangData = {
						url: exactMatch.u,
						description: exactMatch.s,
						domain: exactMatch.d,
						category: exactMatch.c || 'DuckDuckGo',
						subcategory: exactMatch.sc || ''
					};
					
					// Cache the result
					GM_setValue(cacheKey, bangData);
					GM_setValue(`${cacheKey}_timestamp`, now);
					
					return bangData;
				}
			}
			
			console.log(`❌ No DuckDuckGo bang found for: ${bangTrigger}`);
			return null;
			
		} catch (error) {
			console.error(`Error querying DuckDuckGo for bang ${bangTrigger}:`, error);
			return null;
		}
	}

	// Function to test DuckDuckGo bang query
	async function testDuckDuckGoBang(bangTrigger) {
		console.log(`Testing DuckDuckGo bang query for: ${bangTrigger}`);
		const result = await queryDuckDuckGoBang(bangTrigger);
		if (result) {
			console.log(`✅ Bang found:`, result);
		} else {
			console.log(`❌ Bang not found`);
		}
		return result;
	}
	
	// Function to search through all available DuckDuckGo bangs
	async function searchDuckDuckGoBangs(searchTerm) {
		try {
			console.log(`🔍 Searching DuckDuckGo bangs for: "${searchTerm}"`);
			
			const data = await fetchJsonViaGM('https://duckduckgo.com/bang.js');
			
			if (data && data.length > 0) {
				// Search through all bangs for matches
				const matches = data.filter(bang => 
					bang.t.toLowerCase().includes(searchTerm.toLowerCase()) ||
					bang.s.toLowerCase().includes(searchTerm.toLowerCase()) ||
					bang.d.toLowerCase().includes(searchTerm.toLowerCase()) ||
					(bang.c && bang.c.toLowerCase().includes(searchTerm.toLowerCase()))
				);
				
				console.log(`Found ${matches.length} matching bangs for "${searchTerm}"`);
				
				// Show first 10 matches
				const displayMatches = matches.slice(0, 10);
				displayMatches.forEach((bang, index) => {
					console.log(`${index + 1}. !${bang.t} -> ${bang.s} (${bang.d}) - ${bang.c}`);
				});
				
				if (matches.length > 10) {
					console.log(`... and ${matches.length - 10} more matches`);
				}
				
				return matches;
			}
			
			return [];
			
		} catch (error) {
			console.error(`Error searching DuckDuckGo bangs:`, error);
			return [];
		}
	}

	// Function to process bangs
	async function processBang(query) {
		if (!query) return false;

		console.log(`Processing query for bangs: "${query}"`);

		// Check for redirection loops - removed timestamp check
		// Bang redirects are now handled by the bang_redirect parameter

		// Check if query contains bang_redirect parameter (prevents processing already redirected URLs)
		if (query.includes('bang_redirect=1')) {
			console.log("Skipping bang processing - already redirected");
			return false;
		}

		// First check custom bangs (they take priority)
		const customBangsList = Object.keys(CUSTOM_BANGS).sort((a, b) => b.length - a.length);
		
		for (const bang of customBangsList) {
			const bangIndex = query.indexOf(bang);
			if (bangIndex !== -1) {
				const afterBang = query.substring(bangIndex + bang.length);
				
				// Only process if there's a space after the bang or if it's at the end
				if (afterBang === '' || afterBang.startsWith(' ')) {
					const cleanQuery = query.replace(bang, '').trim();

					console.log(`Found custom bang: ${bang} -> ${CUSTOM_BANGS[bang].description}, query: "${cleanQuery}"`);
					console.log(`Bang URL: ${CUSTOM_BANGS[bang].url}`);

					// Perform redirect
					performRedirect(CUSTOM_BANGS[bang].url, cleanQuery);
					return true;
				}
			}
		}

		// If no custom bang found, check for DuckDuckGo bangs
		// Extract potential bang from query (look for !bang pattern)
		const bangMatch = query.match(/!(\w+)/);
		if (bangMatch) {
			const bangTrigger = '!' + bangMatch[1];
			const afterBang = query.substring(bangMatch.index + bangTrigger.length);
			
			// Only process if there's a space after the bang or if it's at the end
			if (afterBang === '' || afterBang.startsWith(' ')) {
				const cleanQuery = query.replace(bangTrigger, '').trim();
				
				console.log(`Querying DuckDuckGo for bang: ${bangTrigger}`);
				
				// Query DuckDuckGo for this specific bang
				const ddgBang = await queryDuckDuckGoBang(bangTrigger);
				
				if (ddgBang) {
					console.log(`Found DuckDuckGo bang: ${bangTrigger} -> ${ddgBang.description}, query: "${cleanQuery}"`);
					
					// Convert DuckDuckGo URL format to our format
					let redirectUrl = ddgBang.url;
					if (redirectUrl.includes('{{{s}}}')) {
						redirectUrl = redirectUrl.replace(/{{{s}}}/g, '{query}');
					}
					
					// Perform redirect
					performRedirect(redirectUrl, cleanQuery);
					return true;
				} else {
					console.log(`No DuckDuckGo bang found for: ${bangTrigger}`);
				}
			}
		}

		console.log("No matching bang found");
		return false;
	}

	// Main execution function
	async function main() {
		// Extract the search query from various search engines
		const query = getUrlParameter('q') ||
					 getUrlParameter('query') ||
					 getUrlParameter('search_query');

		if (!query) return;

		console.log(`Processing query: "${query}"`);

		// Special case for Ecosia shopping search
		const isEcosia = window.location.hostname.includes('ecosia.org');
		const isShoppingSearch = window.location.pathname.includes('/shopping');

		if (isEcosia) {
			console.log(`🌱 Ecosia detected - hostname: ${window.location.hostname}, path: ${window.location.pathname}`);
			console.log(`🌱 Query: "${query}"`);
			
			if (isShoppingSearch && query) {
				console.log("🌱 Redirecting Ecosia shopping search to Startpage");
				window.location.replace('https://www.startpage.com/sp/search?query=' + encodeURIComponent(query) + '&bang_redirect=1');
				return;
			}
			
			// For Ecosia, process bangs immediately to prevent search execution
			console.log("🌱 Processing bang on Ecosia immediately");
			if (await processBang(query)) {
				return; // Bang was processed, don't continue
			}
		}

		// Process the bang
		await processBang(query);
	}

	// Debug function to show loaded bangs
	function showLoadedBangs() {
		const customCount = Object.keys(CUSTOM_BANGS).length;

		console.log(`🔥 Enhanced Search Bang Redirects v3.1 Status:`);
		console.log(`   Custom bangs: ${customCount}`);
		console.log(`   DuckDuckGo bangs: Queried on-demand with caching`);
		console.log(`   Cache duration: ${DDG_BANG_CACHE_DURATION / (24 * 60 * 60 * 1000)} days`);

		// Show some example custom bangs
		const exampleBangs = Object.keys(CUSTOM_BANGS).slice(0, 10);
		console.log(`   Example custom bangs: ${exampleBangs.join(', ')}`);
		console.log(`   Try: testDuckDuckGoBang('!a2') to test DuckDuckGo bang query`);
		console.log(`   Try: searchDuckDuckGoBangs('alternative') to search for bangs`);
	}

	// Make debug function available globally
	window.showBangs = showLoadedBangs;
	
	// Test function to check DuckDuckGo bang query
	window.testDuckDuckGoBang = testDuckDuckGoBang;
	
	// Function to search through all DuckDuckGo bangs
	window.searchDuckDuckGoBangs = searchDuckDuckGoBangs;
	
	// Function to clear DuckDuckGo bang cache
	window.clearDuckDuckGoCache = function() {
		console.log("🗑️ Clearing DuckDuckGo bang cache...");
		
		// Get all GM keys and clear DDG bang cache keys
		const allKeys = [];
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(DDG_BANG_CACHE_KEY)) {
				allKeys.push(key);
			}
		}
		
		// Clear each cache key
		allKeys.forEach(key => {
			GM_setValue(key, null);
			console.log(`Cleared cache key: ${key}`);
		});
		
		console.log("🔄 DuckDuckGo bang cache cleared!");
		console.log("Next bang queries will fetch fresh data from DuckDuckGo");
	};
	
	// Test function to check specific bangs
	window.testBang = function(bangName) {
		console.log(`Testing bang: ${bangName}`);
		
		// Check custom bangs first
		if (CUSTOM_BANGS[bangName]) {
			console.log(`✅ Custom bang found: ${bangName}`);
			console.log(`   URL: ${CUSTOM_BANGS[bangName].url}`);
			console.log(`   Description: ${CUSTOM_BANGS[bangName].description}`);
			console.log(`   Category: ${CUSTOM_BANGS[bangName].category}`);
			return;
		}
		
		// Check if it's a DuckDuckGo bang
		if (bangName.startsWith('!')) {
			console.log(`🔍 Testing DuckDuckGo bang: ${bangName}`);
			console.log(`Use testDuckDuckGoBang('${bangName}') to query DuckDuckGo directly`);
		} else {
			console.log(`❌ Bang not found: ${bangName}`);
			console.log(`Available custom bangs starting with ${bangName.substring(0, 3)}:`);
			const similarBangs = Object.keys(CUSTOM_BANGS).filter(b => b.startsWith(bangName.substring(0, 3)));
			console.log(similarBangs.slice(0, 10));
		}
	};

	// Initialize and run
	(async function init() {
		try {
			console.log("🚀 Initializing Enhanced Search Bang Redirects v3.1...");
			
			// Browser detection
			const userAgent = navigator.userAgent;
			const isFirefox = userAgent.includes('Firefox');
			const isChrome = userAgent.includes('Chrome') && !userAgent.includes('Edg');
			console.log(`🌐 Browser detected: ${isFirefox ? 'Firefox' : isChrome ? 'Chrome' : 'Other'}`);
			
			// Check GM API availability
			console.log(`🔧 GM API Status:`, {
				GM_setValue: typeof GM_setValue !== 'undefined',
				GM_getValue: typeof GM_getValue !== 'undefined',
				GM_xmlhttpRequest: typeof GM_xmlhttpRequest !== 'undefined'
			});

			// Initialize with custom bangs only
			allBangs = CUSTOM_BANGS;

			// Process current page immediately
			await main();

			showLoadedBangs();
			console.log("✅ Bang system ready! Type 'showBangs()' in console for status.");
			console.log("🔍 DuckDuckGo bangs are queried from bang.js API and cached for 7 days");

		} catch (error) {
			console.error("❌ Error initializing bang redirects:", error);
			// Ensure we always have at least custom bangs
			allBangs = CUSTOM_BANGS;
			await main();
		}
	})();

})();