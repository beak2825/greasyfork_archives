// ==UserScript==
// @name         DCAP - AutoTrader
// @namespace    https://greasyfork.org/en/users/1493936-sambrears
// @version      6.01
// @description  Highlight DCAP
// @author       sambrears
// @match        https://www.autotrader.com/*
// @homepage	 https://greasyfork.org/en/scripts/542721-dcap-autotrader
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542721/DCAP%20-%20AutoTrader.user.js
// @updateURL https://update.greasyfork.org/scripts/542721/DCAP%20-%20AutoTrader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        HIGHLIGHT_COLOR: '#e6ffe6',
        BORDER_COLOR: '#00cc00',
        INDICATOR_BG: {
            name: '#00cc00',
            phone: '#0077cc'
        },
        DEBOUNCE_DELAY: 100,
        INITIAL_DELAY: 500,
        RESCAN_DELAY: 15000, // Reduced from 60s for faster updates
        BATCH_SIZE: 5, // Increased for faster processing
        SELECTORS: {
            LISTINGS: '.inventory-listing, .inventory-card, .vehicle-card-main, [data-qaid="cntnr-lstng-card"], [data-testid="vehicle-card"], .listing-card, .item-card-body, .listing-footer',
            CONTAINER: '#searchResults, .results-container, .srp-results, [data-qaid="cntnr-srp-results"], [data-testid="srp-results"], .search-results, .listings-container, main',
            DEALER: '[data-cmp="dealerName"], .dealer-name, [data-qaid="dlr-name"], [data-testid="dealer-name"], .seller-name, .dealer-info, .card-dealer, .text-subdued, .text-subdued-lightest span.text-subdued.text-bold, [data-analytics-name="dealerName"]',
            PHONE: '.dealer-phone, a[href^="tel:"], [data-analytics-name="dealerPhone"], .sds-link[href^="tel:"], .dealer-contact a',
        },
        MATCHING: {
            MIN_MATCH_RATIO: 0.6, // Increased from 0.6 for stricter matching
            MIN_MATCH_CHARS: 3,
            MIN_UNIQUE_WORDS: 2 // Require at least 2 unique non-generic words
        },
        DEBUG: {
            LOG_MATCHES: true,
            LOG_FAILURES: true
        }
    };

    // Updated dcapDealers array from version 5.5 (21/06/25), with phone numbers from 4.5 where available
// Updated dcapDealers array as of 21/06/25
// Removed Tesla Inc. per request
// New dealers added at bottom of list

const dcapDealers = [
    { name: "Bravo CDJR Of Alhambra", city: "Alhambra" },
    { name: "Antioch Chrysler Jeep Dodge", city: "Antioch" },
    { name: "Antioch Nissan", city: "Antioch" },
    { name: "Antioch Toyota", city: "Antioch" },
    { name: "Dealers Choice", city: "Atascadero" },
    { name: "Dupratt Ford Auburn", city: "Auburn" },
    { name: "Three Way Chevrolet Co", city: "Bakersfield" },
    { name: "Nissan Of Bakersfield", city: "Bakersfield" },
    { name: "Autobahn Motors Mercedes Benz", city: "Belmont" },
    { name: "Emotion Autos", city: "Benicia" },
    { name: "Rio Vista Chevrolet", city: "Buellton" },
    { name: "Community Chevrolet", city: "Burbank" },
    { name: "Putnam Chrsyler Dodge Jeep Ram", city: "Burlingame" },
    { name: "Wii Auto Sales", city: "Canoga Park" },
    { name: "Premier Chevrolet Of Carlsbad", city: "Carlsbad" },
    { name: "AutoNation Mazda Carlsbad", city: "Carlsbad" },
    { name: "Premier Cadillac Buick GMC of Carlsbad", city: "Carlsbad" },
    { name: "Kia Of Carson", city: "Carson" },
    { name: "Rose Motorcars", city: "Castro Valley" },
    { name: "Jessup Auto Plaza", city: "Cathedral City" },
    { name: "McKenna Cerritos VW", city: "Cerritos" },
    { name: "Chico Hyundai", city: "Chico" },
    { name: "Chico Nissan", city: "Chico" },
    { name: "Chino Hills Ford", city: "Chino" },
    { name: "Puente Hills Hyundai", city: "City of Industry" },
    { name: "Puente Hills Toyota", city: "City of Industry" },
    { name: "Puente Hills Ford", city: "City of Industry" },
    { name: "Puente Hills Chrysler Dodge Jeep Ram", city: "City of Industry" },
    { name: "Claremont Toyota", city: "Claremont" },
    { name: "Mazda Claremont", city: "Claremont" },
    { name: "Volkswagen Clovis", city: "Clovis" },
    { name: "Toyota Clovis", city: "Clovis" },
    { name: "Serramonte Ford", city: "Colma" },
    { name: "Stewart Chrysler Dodge Jeep Ram", city: "Colma" },
    { name: "Golden State Nissan", city: "Colma" },
    { name: "Concord Nissan", city: "Concord" },
    { name: "Sigma Auto Group Inc.", city: "Concord" },
    { name: "Lexus Of Concord", city: "Concord" },
    { name: "Auto Import Sales", city: "Contra Costa" },
    { name: "Cardinale Way Volkswagen", city: "Corona" },
    { name: "Newport Fisker", city: "Costa Mesa" },
    { name: "Connell Chevrolet", city: "Costa Mesa" },
    { name: "Carbecco", city: "Costa Mesa" },
    { name: "California Beemers Teslers", city: "Costa Mesa" },
    { name: "Green Light Auto Wholesale", city: "Daly City" },
    { name: "EZ Auto Sales", city: "Daly City" },
    { name: "Hanlees Chrysler Dodge Jeep Ram Kia", city: "Davis" },
    { name: "Hanlees Davis Toyota", city: "Davis" },
    { name: "Hanlees Davis Chevrolet", city: "Davis" },
    { name: "Hanlees Davis Nissan", city: "Davis" },
    { name: "Downey Nissan", city: "Downey" },
    { name: "Dublin Kia", city: "Dublin" },
    { name: "Auto City Sales", city: "El Cajon" },
    { name: "Edition Motors LLC", city: "El Monte" },
    { name: "Longo Toyota", city: "El Monte" },
    { name: "Apollo Auto Inc", city: "El Monte" },
    { name: "Focus Auto Service", city: "El Monte" },
    { name: "Lucy Auto Sales", city: "El Monte" },
    { name: "Nissan Elk Grove", city: "Elk Grove" },
    { name: "Mazda Elk Grove", city: "Elk Grove" },
    { name: "Elk Grove Volkswagen", city: "Elk Grove" },
    { name: "Elk Grove Audi", city: "Elk Grove" },
    { name: "Herman Cook Volkswagen", city: "Encinitas" },
    { name: "Mitsubishi Escondido", city: "Escondido" },
    { name: "Mossy Volkswagen", city: "Escondido" },
    { name: "Hyundai Escondido", city: "Escondido" },
    { name: "Quality Chevrolet", city: "Escondido" },
    { name: "Northwood Auto Plaza", city: "Eureka" },
    { name: "Monarch Ford", city: "Exeter" },
    { name: "Volkswagen Of Fairfield", city: "Fairfield" },
    { name: "Fairfield Chevrolet", city: "Fairfield" },
    { name: "Hanlees Toyota", city: "Fairfield" },
    { name: "Folsom Chevrolet", city: "Folsom" },
    { name: "Folsom Lake Ford", city: "Folsom" },
    { name: "Folsom Lake Kia", city: "Folsom" },
    { name: "Sierra Auto Center", city: "Fowler" },
    { name: "Premier Nissan of Fremont", city: "Fremont" },
    { name: "Premier Subaru of Fremont", city: "Fremont" },
    { name: "Lithia Ford Of Fresno", city: "Fresno" },
    { name: "Sierra Auto Center", city: "Fresno" },
    { name: "Sams Auto Sales", city: "Fresno" },
    { name: "Blackstone Chevrolet", city: "Fresno" },
    { name: "Blackstone Cadillac", city: "Fresno" },
    { name: "BMW Fresno", city: "Fresno" },
    { name: "Ocean Subaru Of Fullerton", city: "Fullerton" },
    { name: "VW Of Garden Grove", city: "Garden Grove" },
    { name: "Simpson Chevrolet Of Garden Grove", city: "Garden Grove" },
    { name: "Hyundai Of Gilroy", city: "Gilroy" },
    { name: "Sedona Motors", city: "Glendora" },
    { name: "Cardinale Way Hyundai Of Glendora", city: "Glendora" },
    { name: "Hanford Hyundai", city: "Hanford" },
    { name: "Freeway Toyota Of Hanford", city: "Hanford" },
    { name: "1st Choice Auto Sales", city: "Hayward" },
    { name: "Hayward Kia", city: "Hayward" },
    { name: "Hayward Mitsubishi", city: "Hayward" },
    { name: "Hayward Nissan", city: "Hayward" },
    { name: "One Subaru of Hayward", city: "Hayward" },
    { name: "Tim Moran Hyundai Hemet", city: "Hemet" },
    { name: "Tim Moran Chevrolet", city: "Hemet" },
    { name: "Tim Moran Ford", city: "Hemet" },
    { name: "Delillo Chevrolet", city: "Huntington Beach" },
    { name: "Toyota of Huntington Beach", city: "Huntington Beach" },
    { name: "Hollywood Rides inc", city: "Hollywood" },
    { name: "Simpson Chevrolet of Irvine", city: "Irvine" },
    { name: "Kia Of Irvine", city: "Irvine" },
    { name: "Tuttle click Ford Lincoln", city: "Irvine" },
    { name: "Mesa Luxury Imports", city: "Irvine" },
    { name: "A Buyers Choice", city: "Jurupa Valley" },
    { name: "Paz Auto Group", city: "Laguna Hills" },
    { name: "Hyundai of La Quinta", city: "La Quinta" },
    { name: "Toyota Of Lancaster", city: "Lancaster" },
    { name: "Hawthorne Motors Pre Owned", city: "Lawndale" },
    { name: "Mercedes Benz Los Angeles", city: "Los Angeles" },
    { name: "KIA Downtown Los Angeles", city: "Los Angeles" },
    { name: "Space Auto Group", city: "Los Angeles" },
    { name: "Finesseacar", city: "Los Angeles" },
    { name: "Madera Car Connection Inc", city: "Madera" },
    { name: "Marin County Ford", city: "Marin" },
    { name: "Modesto Subaru", city: "Modesto" },
    { name: "American Chevrolet", city: "Modesto" },
    { name: "Roberts Auto Sales", city: "Modesto" },
    { name: "Jimmy Vasser Chevrolet", city: "Napa" },
    { name: "Jimmy Vasser Toyota", city: "Napa" },
    { name: "Napa Nissan", city: "Napa" },
    { name: "Novato Toyota", city: "Navato" },
    { name: "Face Auto Sales", city: "Newark" },
    { name: "Fremont Ford", city: "Newark" },
    { name: "Millennium Auto Sales", city: "North Highlands" },
    { name: "Novato Chevrolet", city: "Novato" },
    { name: "Kia Of Marin", city: "Novato" },
    { name: "Citrus Motors Ontario Inc", city: "Ontario" },
    { name: "Empire Nissan", city: "Ontario" },
    { name: "Southern California Preowned", city: "Orange" },
    { name: "Orange Garage Auto, LLC.", city: "Orange" },
    { name: "Dong Car Inc", city: "Orange" },
    { name: "Palm Springs Nissan", city: "Palm Springs" },
    { name: "Thompson Chevrolet Buick GMC", city: "Patterson" },
    { name: "All Star Ford", city: "Pittsburg" },
    { name: "All Star Hyundai", city: "Pittsburg" },
    { name: "Thompson's Toyota", city: "Placerville" },
    { name: "Dublin Buick GMC", city: "Pleasanton" },
    { name: "Eco Drive LLC", city: "Rancho Cordova" },
    { name: "Jmf Wholesale Autos Llc", city: "Rancho Cucamonga" },
    { name: "Redwood City Nissan", city: "Redwood City" },
    { name: "Hilltop Ford Kia", city: "Richmond" },
    { name: "Hilltop Chrysler Jeep Dodge Ram", city: "Richmond" },
    { name: "Virtuous Automotive Group", city: "Riverside" },
    { name: "Xpert Auto Consulting", city: "Riverside" },
    { name: "East West Trust Inc", city: "Rosemead" },
    { name: "Nextcar Motor Llc", city: "Rosemead" },
    { name: "FJ Motors", city: "Rosemead" },
    { name: "Roseville Hyundai", city: "Roseville" },
    { name: "Future Ford of Roseville", city: "Roseville" },
    { name: "Roseville Chevrolet", city: "Roseville" },
    { name: "Nissan Of Sacramento", city: "Sacramento" },
    { name: "Niello BMW", city: "Sacramento" },
    { name: "Niello Volvo", city: "Sacramento" },
    { name: "Niello Volkswagen", city: "Sacramento" },
    { name: "Carsight Inc", city: "Sacramento" },
    { name: "Niello Audi", city: "Sacramento" },
    { name: "Maita Chevrolet", city: "Sacramento / EG" },
    { name: "Ford Of Upland", city: "San Bernardino" },
    { name: "Hyundai Genesis San Bruno", city: "San Bruno" },
    { name: "Autolink", city: "San Diego" },
    { name: "Mossy Toyota", city: "San Diego" },
    { name: "Mossy Ford", city: "San Diego" },
    { name: "Galpin Honda", city: "San Fernando" },
    { name: "San Francisco Toyota", city: "San Francisco" },
    { name: "Trax Auto Wholesale", city: "San Mateo" },
    { name: "Dino Motors", city: "San Jose" },
    { name: "Capitol Kia", city: "San Jose" },
    { name: "Capital GMC", city: "San Jose" },
    { name: "Capitol Volkswagen", city: "San Jose" },
    { name: "Bay Area Auto Sales Inc", city: "San Jose" },
    { name: "Stevens Creek Toyota", city: "San Jose" },
    { name: "San Leandro Hyundai", city: "San Leandro" },
    { name: "San Leandro Nissan", city: "San Leandro" },
    { name: "FH Dailey Chevrolet", city: "San Leandro" },
    { name: "Hyundai of San Luis Obispo", city: "San Luis Obispo" },
    { name: "Sunset Honda", city: "San Luis Obispo" },
    { name: "Chevrolet San Luis Obispo", city: "San Luis Obispo" },
    { name: "Mercedes San Luis Obispo", city: "San Luis Obispo" },
    { name: "Marin Mazda", city: "San Rafael" },
    { name: "Carpapapa Auto Group", city: "Santa Ana" },
    { name: "Santa Barbara Chrysler Dodge Jeep Ram Fiat", city: "Santa Barbara" },
    { name: "Santa Cruz Chrysler Dodge Jeep Ram", city: "Santa Cruz" },
    { name: "Santa Cruz Volkswagen", city: "Santa Cruz" },
    { name: "Sunnyvale Volkswagen", city: "Santa Clara" },
    { name: "Starfire Auto Inc", city: "Santa Clara" },
    { name: "Kia Santa Maria", city: "Santa Maria" },
    { name: "Honda Santa Monica", city: "Santa Monica" },
    { name: "Manly Hyundai", city: "Santa Rosa" },
    { name: "Platinum Chevrolet", city: "Santa Rosa" },
    { name: "Seaside Chrysler Dodge Jeep Ram", city: "Seaside" },
    { name: "Richland Chevrolet Co", city: "Shafter" },
    { name: "Shingle Springs Subaru", city: "Shingle Springs" },
    { name: "Fairfield Subaru", city: "Solano" },
    { name: "Audi Napa Valley", city: "Solano" },
    { name: "Sager Ford", city: "St. Helena" },
    { name: "Stockton Nissan", city: "Stockton" },
    { name: "Toyota Town Of Stockton", city: "Stockton" },
    { name: "Electric Auto Group", city: "Stockton" },
    { name: "Mega Motors Inc.", city: "Stockton" },
    { name: "209 Motors", city: "Stockton" },
    { name: "Beas Auto Sales Corporation", city: "Stockton" },
    { name: "Stockton Honda", city: "Stockton" },
    { name: "Stockton Hyundai", city: "Stockton" },
    { name: "Toyota of Sunnyvale", city: "Sunnyvale" },
    { name: "Hollywood Rides Inc", city: "Studio City" },
    { name: "Allen Motors", city: "Thousand Oaks" },
    { name: "Nissan of Torrence", city: "Torrance" },
    { name: "DCH Toyota Of Torrance", city: "Torrance" },
    { name: "Tracy Ford", city: "Tracy" },
    { name: "Harvey Auto Group", city:  "Tracy" },
    { name: "Tracy Honda", city: "Tracy" },
    { name: "Auto Natix", city: "Tulare" },
    { name: "Smith Chevrolet Co. Inc.", city: "Turlock" },
    { name: "Tustin Toyota", city: "Tustin" },
    { name: "Hyundai Of Vacaville", city: "Vacaville" },
    { name: "Nissan of Valencia", city: "Valencia" },
    { name: "Vallejo Hyundai", city: "Vallejo" },
    { name: "Vallejo Dodge Jeep Ram", city: "Vallejo" },
    { name: "Honda of Vallejo", city: "Vallejo" },
    { name: "Vallejo Nissan", city: "Vallejo" },
    { name: "Universal Mitsubishi", city: "Van Nuys" },
    { name: "Kirby KIA Of Ventura", city: "Ventura" },
    { name: "Bunnin Chevrolet Of Fillmore", city: "Ventura" },
    { name: "Ocean Honda Ventura", city: "Ventura" },
    { name: "Victorville Mitsubishi", city: "Victorville" },
    { name: "Lampe Chrysler Dodge Jeep Ram", city: "Visalia" },
    { name: "Dealers Choice", city: "Visalia" },
    { name: "Visalia Hyundai", city: "Visalia" },
    { name: "Walnut Creek Ford", city: "Walnut Creek" },
    { name: "Toyota Walnut Creek", city: "Walnut Creek" },
    { name: "Chevrolet of Watsonville", city: "Watsonville" },
    { name: "Watsonville Cadillac GMC", city: "Watsonville" },
    { name: "Watsonville CDJR", city: "Watsonville" },
    { name: "Watsonville Ford", city: "Watsonville" },
    { name: "Watsonville Chevrolet", city: "Watsonville" },
    { name: "Plug-In Auto", city: "West Covina" },
    { name: "Trusted Auto", city: "West Sacramento" },
    { name: "Beach Cities Toyota Westminster", city: "Westminster" },
    { name: "Joshua Tree Chrysler Dodge Jeep Ram", city: "Yucca Valley" }
];
    let scanInProgress = false;
    const processedListings = new Set();

    const phoneLookup = new Map(dcapDealers.map(dealer => [dealer.phone, dealer]).filter(([phone]) => phone));

    // Generic brand/type words that shouldn't be used for unique matching
    const GENERIC_WORDS = new Set([
        'auto', 'automotive', 'motors', 'motor', 'sales', 'group', 'inc', 'llc', 'corp',
        'company', 'co', 'dealer', 'dealership', 'used', 'cars', 'car', 'truck', 'trucks',
        // Brand names that are too common
        'toyota', 'honda', 'ford', 'chevrolet', 'chevy', 'nissan', 'hyundai', 'kia',
        'mazda', 'subaru', 'volkswagen', 'vw', 'bmw', 'mercedes', 'benz', 'audi',
        'lexus', 'acura', 'infiniti', 'cadillac', 'buick', 'gmc', 'jeep', 'dodge',
        'ram', 'chrysler', 'mitsubishi', 'volvo', 'jaguar', 'land', 'rover',
        'porsche', 'ferrari', 'lamborghini', 'maserati', 'bentley', 'tesla',
        // Location words
        'north', 'south', 'east', 'west', 'central', 'downtown', 'city', 'county',
        'valley', 'hills', 'beach', 'coast', 'bay', 'lake', 'river', 'mountain',
        // Generic descriptors
        'new', 'pre', 'owned', 'certified', 'premium', 'luxury', 'import', 'domestic',
        'family', 'friendly', 'quality', 'best', 'top', 'premier', 'elite', 'select'
    ]);

    function debug(...args) {
        if (CONFIG.DEBUG.LOG_MATCHES || CONFIG.DEBUG.LOG_FAILURES) console.log('[DCAP Highlighter 5.74]', ...args);
    }

    function normalize(str) {
        return str.toLowerCase().replace(/[^a-z0-9]/gi, ' ').replace(/\s+/g, ' ').trim();
    }

    function normalizePhone(phone) {
        return phone.replace(/[^\d]/g, '').replace(/^1/, '');
    }

    function generateAliases(name) {
        const norm = normalize(name);
        const aliases = [norm];

        // Add specific aliases for known dealers
        if (name.includes('KIA Downtown Los Angeles')) {
            aliases.push('kia downtown la', 'kia downtown');
        }
        if (name.includes('Paz Auto Group')) {
            aliases.push('paz auto');
        }

        return aliases;
    }

    function getUniqueWords(text) {
        return normalize(text).split(' ')
            .filter(word => word.length >= CONFIG.MATCHING.MIN_MATCH_CHARS)
            .filter(word => !GENERIC_WORDS.has(word));
    }

    const normalizedDealers = dcapDealers.map(dealer => ({
        ...dealer,
        normName: normalize(dealer.name),
        uniqueWords: getUniqueWords(dealer.name),
        aliases: generateAliases(dealer.name)
    }));

    function isDealerMatch(text, dealer) {
        if (!text) return false;
        const normText = normalize(text);
        debug('Checking match for:', normText, 'against dealer:', dealer.normName);

        // Filter known false positives more aggressively
        if (normText.includes('stg') && normText.includes('auto') && normText.includes('group')) return false;
        if (normText.includes('oc chief')) return false;
        if (normText.includes('premium autos')) return false;
        if (normText.includes('westcoast auto sales')) return false;

        // Exact match or alias match (most reliable)
        for (const alias of dealer.aliases) {
            if (normText === alias || normText.includes(alias)) {
                if (CONFIG.DEBUG.LOG_MATCHES) debug('Exact or alias match:', alias);
                return true;
            }
        }

        // For word-based matching, require more unique identifiers
        if (dealer.uniqueWords.length === 0) {
            if (CONFIG.DEBUG.LOG_FAILURES) debug('No unique words for dealer:', dealer.name);
            return false;
        }

        // Must have at least minimum unique words to consider matching
        if (dealer.uniqueWords.length < CONFIG.MATCHING.MIN_UNIQUE_WORDS) {
            if (CONFIG.DEBUG.LOG_FAILURES) debug('Dealer has too few unique words:', dealer.name, dealer.uniqueWords);
            return false;
        }

        const textUniqueWords = new Set(getUniqueWords(text));
        const matchedUniqueWords = dealer.uniqueWords.filter(word => textUniqueWords.has(word));

        if (matchedUniqueWords.length === 0) {
            if (CONFIG.DEBUG.LOG_FAILURES) debug('No unique word matches for:', normText);
            return false;
        }

        const uniqueRatio = matchedUniqueWords.length / dealer.uniqueWords.length;

        // Require higher ratio for unique words and ensure we have multiple matches
        if (uniqueRatio >= CONFIG.MATCHING.MIN_MATCH_RATIO && matchedUniqueWords.length >= CONFIG.MATCHING.MIN_UNIQUE_WORDS) {
            if (CONFIG.DEBUG.LOG_MATCHES) debug('Unique word match ratio:', uniqueRatio, 'unique words:', matchedUniqueWords);
            return true;
        }

        if (CONFIG.DEBUG.LOG_FAILURES) debug('No sufficient match for:', normText, 'ratio:', uniqueRatio, 'matches:', matchedUniqueWords);
        return false;
    }

    function getListingId(listingEl) {
        if (!listingEl) return null;
        if (!listingEl.dataset.dcapId) {
            const position = Array.from(document.querySelectorAll(CONFIG.SELECTORS.LISTINGS)).indexOf(listingEl);
            const textContent = (listingEl.textContent || '').substring(0, 40).replace(/\s+/g, '');
            listingEl.dataset.dcapId = `listing-${position}-${textContent.length}-${Date.now()}`;
        }
        return listingEl.dataset.dcapId;
    }

    function highlightDealerElement(el, dealer, matchType, matchValue) {
        if (!el) {
            debug('Error: Attempted to highlight null element');
            return false;
        }
        if (el.querySelector('.dcap-badge') || el.dataset.dcapProcessed === 'true') {
            debug('Skipping already processed listing:', getListingId(el));
            return false;
        }

        debug('Highlighting element for dealer:', dealer.name, 'listing ID:', getListingId(el));
        el.style.backgroundColor = CONFIG.HIGHLIGHT_COLOR;
        el.style.border = `2px solid ${CONFIG.BORDER_COLOR}`;
        el.style.position = 'relative';

        const badge = document.createElement('div');
        badge.className = 'dcap-badge';
        badge.textContent = matchType === 'phone' ? 'DCAP (Phone)' : 'DCAP (Name)';
        badge.title = `${matchType === 'phone' ? 'Matched phone: ' : 'Matched name: '}${matchValue}`;
        Object.assign(badge.style, {
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: CONFIG.INDICATOR_BG[matchType],
            color: '#fff',
            padding: '2px 6px',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '4px',
            zIndex: '1000',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        });
        el.appendChild(badge);

        const id = getListingId(el);
        el.dataset.dcapProcessed = 'true';
        el.dataset.dcapDealer = dealer.name;
        processedListings.add(id);
        debug('Successfully highlighted listing:', id);
        return true;
    }

    async function processBatch(listings, startIndex) {
        const endIndex = Math.min(startIndex + CONFIG.BATCH_SIZE, listings.length);
        debug(`Processing batch ${startIndex} to ${endIndex-1} of ${listings.length}`);

        for (let i = startIndex; i < endIndex; i++) {
            const listing = listings[i];
            const listingId = getListingId(listing);
            if (listing.dataset.dcapProcessed === 'true' || listing.querySelector('.dcap-badge')) {
                debug('Skipping processed listing:', listingId);
                continue;
            }

            debug('Processing listing:', listingId);
            const dealerEls = listing.querySelectorAll(CONFIG.SELECTORS.DEALER);
            const phoneEl = listing.querySelector(CONFIG.SELECTORS.PHONE);
            let phoneText = phoneEl?.textContent || phoneEl?.href || '';
            if (phoneText.includes('tel:')) {
                phoneText = phoneText.split('tel:')[1];
            }
            const normalizedPhone = normalizePhone(phoneText);

            let matched = false;

            // Check dealer name elements with improved matching
            for (const dealerEl of dealerEls) {
                const text = dealerEl.textContent.trim();
                debug('Checking dealer text:', text);
                const dealer = normalizedDealers.find(d => isDealerMatch(text, d));
                if (dealer) {
                    debug('Direct name match found for dealer:', dealer.name);
                    highlightDealerElement(listing, dealer, 'name', dealer.name);
                    matched = true;
                    break;
                }
            }

            // Fallback to phone number if no name match
            if (!matched && normalizedPhone && phoneLookup.has(normalizedPhone)) {
                const dealer = phoneLookup.get(normalizedPhone);
                debug('Phone match found for dealer:', dealer.name);
                highlightDealerElement(listing, dealer, 'phone', normalizedPhone);
                matched = true;
            }

            // Mark as processed even if no match to avoid rescanning
            if (!matched) {
                listing.dataset.dcapProcessed = 'true';
                processedListings.add(listingId);
            }

            await new Promise(resolve => setTimeout(resolve, CONFIG.DEBOUNCE_DELAY));
        }

        if (endIndex < listings.length) {
            setTimeout(() => processBatch(listings, endIndex), CONFIG.DEBOUNCE_DELAY);
        } else {
            debug('Finished processing all batches');
            scanInProgress = false;
        }
    }

    function scanListings() {
        if (scanInProgress) {
            debug('Scan already in progress, skipping');
            return;
        }

        debug('Starting scan of listings');
        scanInProgress = true;
        const listings = Array.from(document.querySelectorAll(CONFIG.SELECTORS.LISTINGS))
            .filter(l => !l.dataset.dcapProcessed && !l.querySelector('.dcap-badge'));
        debug('Found', listings.length, 'unprocessed listings');

        if (listings.length === 0) {
            scanInProgress = false;
            return;
        }

        processBatch(listings, 0);
    }

    function init() {
        debug('Initializing DCAP Dealer Highlighter v5.74');
        const style = document.createElement('style');
        style.textContent = `
            .dcap-badge {
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                transition: all 0.2s ease;
            }
            .dcap-badge:hover {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            debug('Running initial scan');
            scanListings();
            setInterval(scanListings, CONFIG.RESCAN_DELAY);

            const resultsContainer = document.querySelector(CONFIG.SELECTORS.CONTAINER);
            if (resultsContainer) {
                debug('Setting up mutation observer');
                const observer = new MutationObserver(() => {
                    debug('New listings detected, scheduling scan');
                    setTimeout(scanListings, CONFIG.DEBOUNCE_DELAY);
                });
                observer.observe(resultsContainer, { childList: true, subtree: true });
            } else {
                debug('Warning: Results container not found!');
            }
        }, CONFIG.INITIAL_DELAY);

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                debug('DOM content loaded, re-running init');
                init();
            });
        }
    }

    init();
})();
