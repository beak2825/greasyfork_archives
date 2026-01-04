// ==UserScript==
// @name         Brno Stred Apartment Enhancer
// @namespace    https://greasyfork.org/en/users/1499597-bac00123
// @version      2.30
// @description  Enhances Brno Stred apartment listings with additional details, toggleable display options, saved settings
// @author       Bac00123
// @match        https://www.brno-stred.cz/potrebuji-si-vyridit/byty/nabidka-bytu*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.deleteValue
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/544022/Brno%20Stred%20Apartment%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/544022/Brno%20Stred%20Apartment%20Enhancer.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Constants
    const CACHE_KEY = 'apartmentCache';
    const SETTINGS_KEY = 'apartmentEnhancerSettings';
    const STORAGE_WARNING_KEY = 'storageWarningShown';
    const CACHE_EXPIRY_DAYS = 7;
    const MAX_CACHE_SIZE = 1024 * 1024 * 5; // 5MB
    const REQUEST_CONCURRENCY = 3;
    const FORCE_LOCAL_STORAGE = false; // Set to true to force using localStorage

    // Storage management with fallback to localStorage
	const storage = {
		usingLocalStorage: false,
		warningShown: false,
		init: async function() {
			this.usingLocalStorage = FORCE_LOCAL_STORAGE;
			if (this.usingLocalStorage) {
				// LocalStorage implementation
				this.setValue = async function(key, value) {
					localStorage.setItem(key, JSON.stringify(value));
				};
				this.getValue = async function(key, defaultValue) {
					const value = localStorage.getItem(key);
					return value !== null ? JSON.parse(value) : defaultValue;
				};
				this.deleteValue = async function(key) {
					localStorage.removeItem(key);
				};
			} else {
				try {
					// First try Greasemonkey 4+ async API
					if (typeof GM !== 'undefined' && GM.setValue) {
						this.setValue = async (key, value) => await GM.setValue(key, JSON.stringify(value));
						this.getValue = async (key, defaultValue) => {
							const value = await GM.getValue(key);
							return value !== undefined ? JSON.parse(value) : defaultValue;
						};
						this.deleteValue = async (key) => await GM.deleteValue(key);
					}
					// Then try Tampermonkey sync API
					else if (typeof GM_setValue !== 'undefined') {
						this.setValue = (key, value) => GM_setValue(key, JSON.stringify(value));
						this.getValue = (key, defaultValue) => {
							const value = GM_getValue(key);
							return value !== undefined ? JSON.parse(value) : defaultValue;
						};
						this.deleteValue = GM_deleteValue;
					}
					// Fallback to localStorage
					else {
						this.usingLocalStorage = true;
						this.setValue = async function(key, value) {
							localStorage.setItem(key, JSON.stringify(value));
						};
						this.getValue = async function(key, defaultValue) {
							const value = localStorage.getItem(key);
							return value !== null ? JSON.parse(value) : defaultValue;
						};
						this.deleteValue = async function(key) {
							localStorage.removeItem(key);
						};
					}
				} catch (e) {
					console.error('Storage initialization failed, falling back to localStorage', e);
					this.usingLocalStorage = true;
					// Assign localStorage methods
					// LocalStorage implementation
					this.setValue = async function(key, value) {
						localStorage.setItem(key, JSON.stringify(value));
					};
					this.getValue = async function(key, defaultValue) {
						const value = localStorage.getItem(key);
						return value !== null ? JSON.parse(value) : defaultValue;
					};
					this.deleteValue = async function(key) {
						localStorage.removeItem(key);
					};
                }
			}
			this.warningShown = await this.getValue(STORAGE_WARNING_KEY, false);
		},
		showWarningIfNeeded: async function() {
			if (this.usingLocalStorage && !this.warningShown) {
				const warningHtml = `
					<div id="storage-warning" style="position: fixed; bottom: 170px; right: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeeba; border-radius: 4px; max-width: 300px; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
						<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
							<strong style="color: #856404;">Upozornění</strong>
							<button id="close-warning" style="background: none; border: none; font-size: 16px; cursor: pointer;">×</button>
						</div>
						<p style="margin: 0; font-size: 14px;">Používá se localStorage pro ukládání nastavení</p>
						<label style="display: flex; align-items: center; gap: 5px; margin-top: 10px;">
							<input type="checkbox" id="dont-show-again" style="margin: 0;"> Znovu nezobrazovat
						</label>
					</div>
				`;
				$('body').append(warningHtml);
				$('#close-warning').on('click', () => {
					const dontShowAgain = $('#dont-show-again').is(':checked');
					if (dontShowAgain) {
						this.setValue(STORAGE_WARNING_KEY, true);
						this.warningShown = true;
					}
					$('#storage-warning').remove();
				});
			}
		}
	};

    // Initialize storage
    await storage.init();

    // State management
    const state = {
        cachedDetails: {},
        isRendering: false,
        itemsLoaded: 0,
        totalItems: 0,
        requestQueue: [],
        activeRequests: 0,
        memoizationCache: {},
        allItemsProcessed: false,
        cacheInitialized: false
    };

    // DOM Cache
    const domCache = {
        $items: null,
        $settingsPanel: null,
        $loadingIndicator: null,
        $highlightCount: null
    };

    // Initialize DOM cache
    function initDomCache() {
        domCache.$items = $('.big-list.flat-list .item');
        state.totalItems = domCache.$items.length;
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Memoization helper
    function memoize(func) {
        return function() {
            const key = JSON.stringify(arguments);
            if (!state.memoizationCache[key]) {
                state.memoizationCache[key] = func.apply(this, arguments);
            }
            return state.memoizationCache[key];
        };
    }

    // Format numbers with thousands separator (memoized)
    const formatThousands = memoize(function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    });

    // Shorten Podlaží (memoized)
    const shortenPodlazi = memoize(function(podlazi) {
        return podlazi.replace('nadzemní', 'Nad.').replace('podzemní', 'Pod.');
    });

    	// Cache management
	async function loadCache() {
		if (state.cacheInitialized) return;

		const cachedData = await storage.getValue(CACHE_KEY, '{}');
		try {
			const parsed = JSON.parse(cachedData);
			// Filter out expired cache entries
			const now = Date.now();
			state.cachedDetails = Object.fromEntries(
				Object.entries(parsed).filter(([_, entry]) =>
					entry.timestamp > now - (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)
				)
			);
			state.cacheInitialized = true;
		} catch (e) {
			state.cachedDetails = {};
			state.cacheInitialized = true;
		}
	}

	async function saveCache() {
		// Clean up cache before saving
		const now = Date.now();
		Object.keys(state.cachedDetails).forEach(key => {
			if (state.cachedDetails[key].timestamp < now - (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)) {
				delete state.cachedDetails[key];
			}
		});

		// Check cache size
		const cacheStr = JSON.stringify(state.cachedDetails);
		if (cacheStr.length > MAX_CACHE_SIZE) {
			// If cache is too big, clear oldest entries
			const entries = Object.entries(state.cachedDetails)
				.sort((a, b) => a[1].timestamp - b[1].timestamp);

			state.cachedDetails = {};
			let size = 0;
			for (const [key, value] of entries) {
				const entryStr = JSON.stringify({[key]: value});
				if (size + entryStr.length < MAX_CACHE_SIZE) {
					state.cachedDetails[key] = value;
					size += entryStr.length;
				}
			}
		}

		await storage.setValue(CACHE_KEY, JSON.stringify(state.cachedDetails));
	}

	async function clearCache() {
		await storage.deleteValue(CACHE_KEY);
		state.cachedDetails = {};
		state.cacheInitialized = false;
	}

    // Request queue management
    function processQueue() {
        while (state.requestQueue.length > 0 && state.activeRequests < REQUEST_CONCURRENCY) {
            const {url, callback} = state.requestQueue.shift();
            state.activeRequests++;
            fetchApartmentDetails(url, callback);
        }
    }

    function enqueueRequest(url, callback) {
        state.requestQueue.push({url, callback});
        processQueue();
    }

    // Check if all items are processed
    function checkAllItemsProcessed() {
        if (state.itemsLoaded >= state.totalItems && !state.allItemsProcessed) {
            state.allItemsProcessed = true;
            domCache.$loadingIndicator.remove();
        }
    }

    // Settings management
    function getDefaultSettings() {
        return {
            toggles: {
                podlazi: true,
                vytah: true,
                vymera: true,
                najemne: true,
                kategorie: true,
                termin: false,
                odhad: true
            },
            fontSize: '10px',
            lineSpacing: false,
            highlightVymera: '50',
            highlightCategories: ['I.'],
            vnitrniMod: true,
            newLineValues: false,
            requestDelay: 500,
            settingsFontSize: 'default',
            settingsPadding: '15px'
        };
    }

   async function saveSettings() {
        const settings = {
            toggles: {},
            fontSize: $('#font-size').val(),
            lineSpacing: $('#line-spacing-toggle').is(':checked'),
            highlightVymera: $('#highlight-vymera').val(),
            highlightCategories: $('.highlight-kategorie-checkbox:checked').map(function() {
                return $(this).val();
            }).get(),
            vnitrniMod: $('#vnitrni-mod-toggle').is(':checked'),
            newLineValues: $('#new-line-toggle').is(':checked'),
            requestDelay: parseInt($('#request-delay').val()) || 500,
            settingsFontSize: $('#settings-font-size').val()
        };

        $('.toggle-class').each(function() {
            settings.toggles[$(this).attr('id').replace('-toggle', '')] = $(this).is(':checked');
        });

        // Stringify settings before saving
        await storage.setValue(SETTINGS_KEY, JSON.stringify(settings));
    }

    // Modified loadSettings function to ensure proper parsing
	async function loadSettings() {
		// Properly await the settings retrieval
		const savedSettings = await storage.getValue(SETTINGS_KEY);

		let parsedSettings;
		try {
			// Handle case where settings might be a string or already parsed
			parsedSettings = typeof savedSettings === 'string' ?
				JSON.parse(savedSettings) :
				(savedSettings || {});
		} catch (e) {
			console.error('Error parsing settings:', e);
			parsedSettings = {};
		}

		const defaultSettings = getDefaultSettings();
		const settings = {...defaultSettings, ...parsedSettings};

        // Apply settings to UI elements
        if (settings.toggles) {
            Object.keys(settings.toggles).forEach(id => {
                const $element = $(`#${id}-toggle`);
                if ($element.length) {
                    $element.prop('checked', settings.toggles[id]);
                }
            });
        }

        // Apply other settings
        const applyIfExists = (id, value) => {
            const $element = $(`#${id}`);
            if ($element.length && value !== undefined) {
                $element.val(value);
            }
        };

        applyIfExists('font-size', settings.fontSize);
        applyIfExists('line-spacing-toggle', settings.lineSpacing);
        applyIfExists('highlight-vymera', settings.highlightVymera);
        applyIfExists('vnitrni-mod-toggle', settings.vnitrniMod);
        applyIfExists('new-line-toggle', settings.newLineValues);
        applyIfExists('request-delay', settings.requestDelay);
        applyIfExists('settings-font-size', settings.settingsFontSize);

        // Apply highlight categories
        if (settings.highlightCategories) {
            $('.highlight-kategorie-checkbox').prop('checked', false);
            settings.highlightCategories.forEach(cat => {
                $(`.highlight-kategorie-checkbox[value="${cat}"]`).prop('checked', true);
            });
        }

        // Trigger visual updates
        updateDisplayToggles();
        updateFlatItemHighlight();
        updateSettingsAppearance(settings.settingsFontSize);
    }


    // Updated the settings appearance function (around line 420)
    function updateSettingsAppearance(size, padding) {
        const sizes = {
            'smallest': '12px',
            'smaller': '14px',
            'default': '16px',
            'larger': '18px',
            'largest': '20px'
        };

        const isCompact = padding === '10px';
        const fontSize = sizes[size] || sizes['default'];

        $('#apartment-settings').css({
            'font-size': fontSize,
            'padding': padding,
            'margin': isCompact ? '10px' : '20px',
            'gap': isCompact ? '5px' : '15px'
        });

        // Adjust specific elements for compact mode
        if (isCompact) {
            $('#apartment-settings h3').css('margin', '5px 0');
            $('#apartment-settings > div').css('margin-top', '5px');
            $('#apartment-settings label').css('margin', '2px 0');
        } else {
            $('#apartment-settings h3').css('margin', '');
            $('#apartment-settings > div').css('margin-top', '');
            $('#apartment-settings label').css('margin', '');
        }
    }

    // DOM manipulation functions
    function updateDisplayToggles() {
        const toggles = {
            podlazi: $('#podlazi-toggle').is(':checked'),
            vytah: $('#vytah-toggle').is(':checked'),
            vymera: $('#vymera-toggle').is(':checked'),
            najemne: $('#najemne-toggle').is(':checked'),
            kategorie: $('#kategorie-toggle').is(':checked'),
            termin: $('#termin-toggle').is(':checked'),
            odhad: $('#odhad-toggle').is(':checked')
        };

        $('.extra-details p').each(function() {
            const className = $(this).attr('class');
            if (className) {
                const toggleKey = className.split('-')[0];
                $(this).toggle(toggles[toggleKey] !== false);
            }
        });
    }

    function updateFlatItemHighlight() {
        const minVymera = parseFloat($('#highlight-vymera').val()) || 0;
        const selectedCategories = $('.highlight-kategorie-checkbox:checked').map(function() {
            return $(this).val();
        }).get();
        let highlightCount = 0;

        domCache.$items.each(function() {
            const $item = $(this);
            const $itemInner = $item.find('.item-inner');
            const vymeraText = $item.find('.vymera-info').text().match(/Výměra:\s*?(.*)/);
            const kategorieText = $item.find('.kategorie-info').text().trim().replace('Kategorie:', '').trim();

            let meetsVymera = false;
            let meetsKategorie = false;

            // Highlight výměra if above threshold
            if (minVymera > 0 && vymeraText && vymeraText[1]) {
                const vymeraNum = parseFloat(vymeraText[1].replace(',', '.').replace(/[^0-9.]/g, ''));
                meetsVymera = vymeraNum >= minVymera;
                if (meetsVymera) {
                    $item.find('.vymera-info').css('color', 'green');
                } else {
                    $item.find('.vymera-info').css('color', '');
                }
            }

            // Highlight category if selected
            if (kategorieText && selectedCategories.includes(kategorieText)) {
                meetsKategorie = true;
                $item.find('.kategorie-info').css({'font-weight': 'bold', 'color': 'green'});
            } else {
                $item.find('.kategorie-info').css({'font-weight': '', 'color': ''});
            }

            // Highlight whole item if both conditions met
            if (meetsVymera && meetsKategorie) {
                $itemInner.css('border-right', '5px solid green');
                highlightCount++;
            } else {
                $itemInner.css('border-right', 'none');
            }
        });

        domCache.$highlightCount.text(`Celkem zvýrazněných bytů: ${highlightCount}`);
    }

    // Calculate row height based on font size
    function getRowHeight(fontSize) {
        return Math.max(Math.round(fontSize * 1.5), 18);
    }

    // Fetch apartment details with caching
    function fetchApartmentDetails(url, callback) {
        const now = Date.now();

        // Check cache first
        if (state.cachedDetails[url] && state.cachedDetails[url].timestamp > now - (CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000)) {
            callback(state.cachedDetails[url].data);
            state.activeRequests--;
            processQueue();
            state.itemsLoaded++;
            checkAllItemsProcessed();
            return;
        }

        const baseDelay = parseInt($('#request-delay').val()) || 500;
        const randomDelay = Math.random() * 100 + 20;
        const totalDelay = baseDelay + randomDelay;

        setTimeout(() => {
            const requestFunction = typeof GM_xmlhttpRequest !== 'undefined' ? GM_xmlhttpRequest :
                                 (typeof GM !== 'undefined' && GM.xmlHttpRequest) ? GM.xmlHttpRequest : null;

            if (!requestFunction) {
                // Fallback to standard fetch if GM_xmlhttpRequest not available
                fetch(url)
                    .then(response => response.text())
                    .then(text => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(text, 'text/html');
                        processDetails(doc, url, now, callback);
                    })
                    .catch(() => {
                        callback({});
                        state.activeRequests--;
                        processQueue();
                        state.itemsLoaded++;
                        checkAllItemsProcessed();
                    });
                return;
            }

            requestFunction({
                method: 'GET',
                url: url,
                onload: function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    processDetails(doc, url, now, callback);
                },
                onerror: function() {
                    callback({});
                    state.activeRequests--;
                    processQueue();
                    state.itemsLoaded++;
                    checkAllItemsProcessed();
                }
            });
        }, totalDelay);
    }

    function processDetails(doc, url, timestamp, callback) {
        const table = $(doc).find('table').first();
        const details = {};

        table.find('tr').each(function() {
            const key = $(this).find('td').first().text().trim();
            const value = $(this).find('td').last().text().trim();
            if (key.includes('Podlaží')) details.podlazi = shortenPodlazi(value);
            if (key.includes('Výtah')) details.vytah = value;
            if (key.includes('Výměra')) details.vymera = value;
            if (key.includes('Výše a kategorie nájemného')) {
                if (value.includes(', ')) {
                    const [najemne, kategorie] = value.split(', ');
                    details.najemne = najemne;
                    details.kategorie = kategorie.replace('kategorie ', '');
                } else {
                    details.najemne = '?';
                    // Expecting 'pro příjmově vymezené osoby'.
                    details.kategorie = value;
                }
            }
            if (key.includes('Termín žádostí do')) details.termin = value;
        });

        // Calculate Celkem (odhad)
        if (details.vymera && details.najemne) {
            const vymeraNum = parseFloat(details.vymera.replace(',', '.').replace(/[^0-9.]/g, ''));

            const najemneMatch = details.najemne.match(/(\d+)\s*Kč\/m²/)
            if (najemneMatch) {
                const najemNum = parseFloat(najemneMatch[1]);
                const odhad = Math.ceil(vymeraNum) * najemNum;
                details.odhad = `${formatThousands(odhad)} Kč`;
            }
        }

        // Cache the result
        state.cachedDetails[url] = {
            data: details,
            timestamp: timestamp
        };
        saveCache();

        callback(details);
        state.activeRequests--;
        processQueue();
        state.itemsLoaded++;
        checkAllItemsProcessed();
    }

    // Append details to apartment items
    const appendDetailsToItems = debounce(function() {
        if (state.isRendering) return;
        state.isRendering = true;
        state.itemsLoaded = 0;
        state.allItemsProcessed = false;

        // Show loading indicator only if we have items to load
        if (Object.keys(state.cachedDetails).length < state.totalItems) {
            domCache.$loadingIndicator.show();
        } else {
            domCache.$loadingIndicator.hide();
        }

        domCache.$items.each(function(index) {
            const $item = $(this);
            $item.css({ 'display': 'flex', 'flex-direction': 'column', 'height': '100%' });
            const $desc = $item.find('.desc');
            const href = $item.find('a.item-inner').attr('href');

            // Fix for missing first item - ensure href exists
            if (!href && index === 0) {
                state.itemsLoaded++;
                checkAllItemsProcessed();
                return;
            }

            const fullUrl = `https://www.brno-stred.cz${href}`;

            // Remove existing details
            $item.find('.extra-details').remove();

            enqueueRequest(fullUrl, function(details) {
                const vnitrniMod = $('#vnitrni-mod-toggle').is(':checked');
                const newLineValues = $('#new-line-toggle').is(':checked');
                const fontSize = $('#font-size').val();
                const fontSizeNum = parseInt(fontSize);
                const lineSpacing = $('#line-spacing-toggle').is(':checked') ? `${Math.round(fontSizeNum * 0.67)}px` : '0';
                const rowHeight = getRowHeight(fontSizeNum);
                const separator = newLineValues ? '<br>' : ' ';

                // Check if we need to highlight "ne" in Výtah
                let vytahHighlight = '';
                if (details.podlazi && details.vytah) {
                    const podlaziLower = details.podlazi.toLowerCase();
                    const vytahLower = details.vytah.toLowerCase();

                    // Check if it's nadzemní floor and at least 4th floor
                    if (podlaziLower.includes('nad') && !podlaziLower.includes('pod')) {
                        const floorMatch = podlaziLower.match(/(\d+)/);
                        if (floorMatch) {
                            const floorNumber = parseInt(floorMatch[1]);
                            if (floorNumber >= 4 && vytahLower.includes('ne')) {
                                vytahHighlight = 'color: red;';
                            }
                        }
                    }
                }

                let detailsHtml = `
                    <div class="extra-details" style="margin-top: 10px; padding: 10px; background: #fff; border-top: 1px solid #eee; display: flex; flex-direction: column; flex-grow: 1;">
                        ${details.podlazi ? `<p class="podlazi-info" style="font-size: ${fontSize}; margin-bottom: ${lineSpacing}; line-height: ${rowHeight}px;"><strong>Podlaží:</strong>${separator}${details.podlazi}</p>` : ''}
                        ${details.vytah ? `<p class="vytah-info" style="font-size: ${fontSize}; margin-bottom: ${lineSpacing}; line-height: ${rowHeight}px;"><strong>Výtah:</strong>${separator}<span style="${vytahHighlight}">${details.vytah}</span></p>` : ''}
                        ${details.vymera ? `<p class="vymera-info" style="font-size: ${fontSize}; margin-bottom: ${lineSpacing}; line-height: ${rowHeight}px;"><strong>Výměra:</strong>${separator}${details.vymera}</p>` : ''}
                        ${details.najemne ? `<p class="najemne-info" style="font-size: ${fontSize}; margin-bottom: ${lineSpacing}; line-height: ${rowHeight}px;"><strong>Výše nájemného:</strong>${separator}${details.najemne}</p>` : ''}
                        ${details.odhad ? `<p class="odhad-info" style="font-size: ${fontSize}; margin-bottom: ${lineSpacing}; line-height: ${rowHeight}px;"><strong>Celkem (odhad):</strong>${separator}${details.odhad}</p>` : ''}
                        ${details.kategorie ? `<p class="kategorie-info" style="font-size: ${fontSize}; margin-bottom: ${lineSpacing}; line-height: ${rowHeight}px;"><strong>Kategorie:</strong>${separator}${details.kategorie}</p>` : ''}
                        ${details.termin ? `<p class="termin-info" style="font-size: ${fontSize}; margin-bottom: ${lineSpacing}; line-height: ${rowHeight}px;"><strong>Termín žádostí do:</strong><br>${details.termin}</p>` : ''}
                    </div>
                `;

                if (vnitrniMod) {
                    $desc.after(detailsHtml);
                } else {
                    $item.find('.text').after(detailsHtml);
                }

                updateDisplayToggles();
                updateFlatItemHighlight();
            });
        });

        state.isRendering = false;
    }, 300);

    // Create settings panel
    function createSettingsPanel() {
        const fields = [
            { id: 'podlazi', label: 'Podlaží' },
            { id: 'vytah', label: 'Výtah' },
            { id: 'vymera', label: 'Výměra' },
            { id: 'najemne', label: 'Výše nájemného' },
            { id: 'kategorie', label: 'Kategorie' },
            { id: 'termin', label: 'Termín žádostí do' },
            { id: 'odhad', label: 'Celkem (odhad)' }
        ];

        const highlightCategories = ['pro příjmově vymezené osoby', 'I.', 'II.', 'III.', 'IV.'];

		const settingsHtml = `
			<div id="apartment-settings" style="margin: 20px; padding: 15px; background: #f9f9f9; border: 1px solid #ccc; border-radius: 5px;">
				<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 15px; margin-bottom: 15px;">
					<label style="display: flex; align-items: center; gap: 5px; white-space: nowrap;">
						Velikost textu nastavení:
						<select id="settings-font-size">
							<option value="smallest">Nejmenší</option>
							<option value="smaller">Menší</option>
							<option value="default">Standardní</option>
							<option value="larger">Velké</option>
							<option value="largest">Největší</option>
						</select>
					</label>
				</div>

				<h3 style="margin-top: 0;">Nastavení zobrazení</h3>

				<div style="display: flex; flex-wrap: wrap; align-items: center; gap: 15px; margin-left: 0;">
					<label style="display: flex; align-items: center; gap: 5px;">
						<input type="checkbox" id="line-spacing-toggle" style="margin: 0;"> Mezery mezi řádky
					</label>
					<label style="display: flex; align-items: center; gap: 5px;">
						<input type="checkbox" id="vnitrni-mod-toggle" style="margin: 0;"> Vnitřní mód
					</label>
					<label style="display: flex; align-items: center; gap: 5px;">
						<input type="checkbox" id="new-line-toggle" style="margin: 0;"> Hodnoty na dalším řádku
					</label>
					<label style="display: flex; align-items: center; gap: 5px;">
						Velikost písma:
						<select id="font-size">
							<option value="8px">Extra Malá (8px)</option>
							<option value="10px">Velmi Malá (10px)</option>
							<option value="12px">Malá (12px)</option>
							<option value="14px">Střední (14px)</option>
							<option value="16px">Velká (16px)</option>
						</select>
					</label>
				</div>

				<div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px; margin-left: 0;">
					${fields.map(field => `
						<label style="display: flex; align-items: center; gap: 5px;">
							<input type="checkbox" id="${field.id}-toggle" class="toggle-class" style="margin: 0;">
							${field.label}
						</label>
					`).join('')}
				</div>

				<h3 style="margin-top: 20px;">Zvýraznění položek</h3>
				<div style="margin-top: 10px;">
					<label style="display: flex; align-items: center; gap: 5px;">
						Výměra minimálně:
						<input type="number" id="highlight-vymera" min="0" value="50" style="width: 80px;"> m²
					</label>
				</div>
				<div style="display: flex; flex-wrap: wrap; gap: 15px; margin-top: 10px;">
					${highlightCategories.map(cat => `
						<label style="display: flex; align-items: center; gap: 5px;">
							<input type="checkbox" class="highlight-kategorie-checkbox" value="${cat}" style="margin: 0;">
							Kategorie ${cat}
						</label>
					`).join('')}
				</div>
				<div id="highlight-count" style="margin-top: 10px;"></div>
				<div style="margin-top: 15px; display: flex; gap: 10px;">
					<button id="save-refresh-btn">Uložit a obnovit</button>
					<button id="clear-cache-refresh-btn">Obnovit s vymazanou cache</button>
				</div>
			</div>
		`;

        $('.big-list.flat-list').before(settingsHtml);

        // Initialize DOM cache elements
        domCache.$settingsPanel = $('#apartment-settings');
        domCache.$loadingIndicator = $('.loading-indicator');
        domCache.$highlightCount = $('#highlight-count');

        // Load settings before attaching event handlers
        loadSettings();

        // Show storage warning if needed
        storage.showWarningIfNeeded();

        // Debounced event handlers
        const debouncedUpdate = debounce(function() {
            saveSettings();
            updateDisplayToggles();
            appendDetailsToItems();
        }, 300);

        $('.toggle-class, #line-spacing-toggle, #vnitrni-mod-toggle, #new-line-toggle, #request-delay').on('change', function() {
            if (!state.isRendering) {
                debouncedUpdate();
            }
        });

        $('#font-size, #highlight-vymera, .highlight-kategorie-checkbox').on('change', function() {
            if (!state.isRendering) {
                saveSettings();
                if ($(this).attr('id') === 'font-size') {
                    appendDetailsToItems();
                } else {
                    updateFlatItemHighlight();
                }
            }
        });

        $('#settings-font-size, #settings-padding-toggle').on('change', function() {
            saveSettings();
            updateSettingsAppearance(
                $('#settings-font-size').val(),
                $('#settings-padding-toggle').is(':checked') ? '10px' : '15px'
            );
        });

        $('#save-refresh-btn').on('click', function() {
            saveSettings();
            location.reload();
        });

        $('#clear-cache-refresh-btn').on('click', function() {
            clearCache();
            location.reload();
        });
    }

    // Initialize the script
	$(document).ready(async function() {
		await loadCache();
		initDomCache();
		createSettingsPanel();
		appendDetailsToItems();
	});
})();