// ==UserScript==
// @name         Egetinnz-Expedia-Lister
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Automate listing from Expedia TAAP to Egetinnz
// @author       JAbinSin
// @license      MIT
// @match        https://www.expediataap.com/*
// @match        https://www.egetinnz.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @connect      www.expediataap.com
// @connect      api.ipify.org
// @connect      nominatim.openstreetmap.org
// @connect      api.together.xyz
// @downloadURL https://update.greasyfork.org/scripts/537417/Egetinnz-Expedia-Lister.user.js
// @updateURL https://update.greasyfork.org/scripts/537417/Egetinnz-Expedia-Lister.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Egetinnz Expedia Lister script loaded! v2.2");

    // Helper function to generate a UUID v4
    function generateUUIDv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // Helper function to extract check-in and check-out dates from URL parameters
    function extractDatesFromUrl(url) {
        try {
            const urlObj = new URL(url);
            const params = urlObj.searchParams;

            const chkinParam = params.get('chkin');
            const chkoutParam = params.get('chkout');

            if (!chkinParam || !chkoutParam) {
                console.warn("No chkin or chkout parameters found in URL:", url);
                return null;
            }

            // Parse dates in format YYYY-MM-DD
            const chkinDate = new Date(chkinParam);
            const chkoutDate = new Date(chkoutParam);

            if (isNaN(chkinDate.getTime()) || isNaN(chkoutDate.getTime())) {
                console.warn("Invalid date format in URL parameters. Expected format: YYYY-MM-DD");
                return null;
            }

            const checkInDateObj = {
                day: chkinDate.getDate(),
                month: chkinDate.getMonth() + 1, // JavaScript months are 0-based
                year: chkinDate.getFullYear()
            };

            const checkOutDateObj = {
                day: chkoutDate.getDate(),
                month: chkoutDate.getMonth() + 1, // JavaScript months are 0-based
                year: chkoutDate.getFullYear()
            };

            console.log(`Extracted dates from URL - Check-in: ${checkInDateObj.year}-${String(checkInDateObj.month).padStart(2, '0')}-${String(checkInDateObj.day).padStart(2, '0')}, Check-out: ${checkOutDateObj.year}-${String(checkOutDateObj.month).padStart(2, '0')}-${String(checkOutDateObj.day).padStart(2, '0')}`);

            return {
                checkIn: checkInDateObj,
                checkOut: checkOutDateObj
            };
        } catch (error) {
            console.error("Error extracting dates from URL:", error);
            return null;
        }
    }

    function fetchExpediaData(expediaHotelUrl) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: expediaHotelUrl,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        resolve(response.responseText);
                    } else {
                        reject(new Error(`Failed to fetch Expedia page: ${response.status} ${response.statusText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Error during GM_xmlhttpRequest: ${error.statusText || 'Unknown error'}`));
                }
            });
        });
    }    function parseHotelNameFromExpedia(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");

        // Try primary selector first
        let hotelNameElement = doc.querySelector('h1');

        // If primary selector fails, try fallback selector with data-stid attribute
        if (!hotelNameElement) {
            hotelNameElement = doc.querySelector('[data-stid="content-hotel-title"]');
        }

        return hotelNameElement ? hotelNameElement.textContent.trim() : null;
    }

    function getRawHotelAddressFromExpedia(html) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const addressElement = doc.querySelector('div[data-stid="content-hotel-address"]');
        if (addressElement) {
            return addressElement.textContent.trim();
        }
        console.warn("Could not find address with selector 'div[data-stid=\"content-hotel-address\"]'. You may need to update the selector.");
        return null;
    }

    // NEW FUNCTION to fetch room data using GraphQL
    async function fetchExpediaRoomDataGraphQL(propertyId, checkInDateObj, checkOutDateObj, adultsCount) {
        const graphqlUrl = "https://www.expediataap.com/graphql";
        const dynamicSearchId = generateUUIDv4();
        const dynamicDuaid = generateUUIDv4();

        // Try to get region info from Manila as example, but should be dynamic in future
        const regionName = "Manila, National Capital Region, Philippines";
        const regionId = "2375";
        const coordinates = { latitude: 14.594503, longitude: 120.973702 };

        // These values should be dynamic, but for now use Manila as default
        const productOffersId = generateUUIDv4();
        const offerTimestamp = String(Date.now());

        // Build the payload with both operations
        const payload = [
            {
                operationName: "AncillaryPropertyOffersQuery",
                variables: {
                    propertyId: propertyId,
                    searchCriteria: {
                        primary: {
                            dateRange: {
                                checkInDate: { day: checkInDateObj.day, month: checkInDateObj.month, year: checkInDateObj.year },
                                checkOutDate: { day: checkOutDateObj.day, month: checkOutDateObj.month, year: checkOutDateObj.year }
                            },
                            destination: {
                                regionName,
                                regionId,
                                coordinates,
                                pinnedPropertyId: null,
                                propertyIds: null,
                                mapBounds: null
                            },
                            rooms: [{ adults: adultsCount, children: [] }]
                        },
                        secondary: {
                            counts: [],
                            booleans: [],
                            selections: [
                                { id: "privacyTrackingState", value: "CAN_TRACK" },
                                { id: "productOffersId", value: productOffersId },
                                { id: "searchId", value: dynamicSearchId },
                                { id: "sort", value: "RECOMMENDED" },
                                { id: "useRewards", value: "SHOP_WITHOUT_POINTS" }
                            ],
                            ranges: []
                        }
                    },
                    shoppingContext: { multiItem: null, queryTriggeredBy: "OTHER" },
                    travelAdTrackingInfo: null,
                    searchOffer: {
                        offerPrice: {
                            offerTimestamp,
                            price: { amount: 135, currency: "USD" },
                            pointsApplied: false
                        },
                        roomTypeId: "",
                        ratePlanId: "",
                        offerDetails: []
                    },
                    referrer: "HSR",
                    selectedSavedQuoteInput: null,
                    context: {
                        siteId: 1070901,
                        locale: "en_US",
                        eapid: 70901,
                        tpid: 5090,
                        currency: "USD",
                        device: { type: "DESKTOP" },
                        identity: { duaid: dynamicDuaid, authState: "AUTHENTICATED" },
                        privacyTrackingState: "CAN_TRACK"
                    }
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: "579e4085c58a7731dc495b163798c20b5ce7ea898b9d1ca9f03705840d3e6214"
                    }
                }
            },
            {
                operationName: "RoomsAndRatesPropertyOffersQuery",
                variables: {
                    propertyId: propertyId,
                    searchCriteria: {
                        primary: {
                            dateRange: {
                                checkInDate: { day: checkInDateObj.day, month: checkInDateObj.month, year: checkInDateObj.year },
                                checkOutDate: { day: checkOutDateObj.day, month: checkOutDateObj.month, year: checkOutDateObj.year }
                            },
                            destination: {
                                regionName,
                                regionId,
                                coordinates,
                                pinnedPropertyId: null,
                                propertyIds: null,
                                mapBounds: null
                            },
                            rooms: [{ adults: adultsCount, children: [] }]
                        },
                        secondary: {
                            counts: [],
                            booleans: [],
                            selections: [
                                { id: "privacyTrackingState", value: "CAN_TRACK" },
                                { id: "productOffersId", value: productOffersId },
                                { id: "searchId", value: dynamicSearchId },
                                { id: "sort", value: "RECOMMENDED" },
                                { id: "useRewards", value: "SHOP_WITHOUT_POINTS" }
                            ],
                            ranges: []
                        }
                    },
                    shoppingContext: { multiItem: null, queryTriggeredBy: "OTHER" },
                    travelAdTrackingInfo: null,
                    searchOffer: {
                        offerPrice: {
                            offerTimestamp,
                            price: { amount: 135, currency: "USD" },
                            pointsApplied: false
                        },
                        roomTypeId: "",
                        ratePlanId: "",
                        offerDetails: []
                    },
                    referrer: "HSR",
                    selectedSavedQuoteInput: null,
                    context: {
                        siteId: 1070901,
                        locale: "en_US",
                        eapid: 70901,
                        tpid: 5090,
                        currency: "USD",
                        device: { type: "DESKTOP" },
                        identity: { duaid: dynamicDuaid, authState: "AUTHENTICATED" },
                        privacyTrackingState: "CAN_TRACK"
                    }
                },
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: "0c29b592f89c56e3ca69b787f406b01163a6fcb19c014cd71d7559fd72139704"
                    }
                }
            }
        ];

        console.log("Generated dynamicSearchId:", dynamicSearchId);
        console.log("Generated dynamicDuaid:", dynamicDuaid);
        // console.log("Sending GraphQL payload:", JSON.stringify(payload, null, 2));

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: graphqlUrl,
                headers: {
                    "Content-Type": "application/json",
                    "x-hcom-origin-id": "page.Hotels.Infosite.Information,H,30",
                    "x-page-id": "page.Hotels.Infosite.Information,H,30",
                    "x-parent-brand-id": "taap",
                    "x-product-line": "lodging",
                    "x-shopping-product-line": "lodging",
                    "client-info": `{"clientName":"EgetinnzListerUserScript","clientVersion":"0.9"}`
                },
                data: JSON.stringify(payload),
                responseType: "json",
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300 && response.response) {
                        console.log("GraphQL raw response:", response.response);
                        resolve(response.response);
                    } else {
                        reject(new Error(`GraphQL request failed: ${response.status} ${response.statusText}. Response: ${JSON.stringify(response.response)}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Error during GraphQL GM_xmlhttpRequest: ${error.statusText || 'Unknown error'}`));
                }
            });
        }); }

    // Function to extract amenities from description text
    function extractAmenitiesFromDescription(descriptionText) {
        if (!descriptionText || typeof descriptionText !== 'string') {
            return { bathroom: [], source: 'description_text' };
        }

        const bathroomAmenities = [];
        const text = descriptionText.toLowerCase();        // Enhanced bathroom amenity mappings
        const bathroomTerms = {
            'private bathroom': 'Private bathroom',
            'private bath': 'Private bathroom',
            'en-suite bathroom': 'En-suite bathroom',
            'ensuite bathroom': 'En-suite bathroom',
            'en-suite': 'En-suite bathroom',
            'ensuite': 'En-suite bathroom',
            'shared bathroom': 'Shared bathroom',
            'shared bath': 'Shared bathroom',
            'bathrobes': 'Bathrobes',
            'bathrobe': 'Bathrobes',
            'rainfall showerhead': 'Rainfall showerhead',
            'rain shower': 'Rainfall showerhead',
            'rainfall shower': 'Rainfall showerhead',            'bathtub or shower': 'Bathtub/Shower',
            'bath or shower': 'Bathtub/Shower',
            'shower/tub combination': 'Bathtub/Shower',
            'shower tub combination': 'Bathtub/Shower',
            'shower/tub combo': 'Bathtub/Shower',
            'shower tub combo': 'Bathtub/Shower',
            'tub/shower combination': 'Bathtub/Shower',
            'tub shower combination': 'Bathtub/Shower',
            'bathtub': 'Bathtub',
            'bath tub': 'Bathtub',
            'shower': 'Shower',
            'hair dryer': 'Hair dryer',
            'hairdryer': 'Hair dryer',
            'towels': 'Towels provided',
            'free toiletries': 'Free toiletries',
            'toiletries': 'Free toiletries',
            'designer toiletries': 'Designer toiletries',
            'toilet': 'Toilet',
            'bidet': 'Bidet',
            'spa tub': 'Spa tub',
            'jacuzzi': 'Jacuzzi',
            'hot tub': 'Hot tub',
            'heated floors': 'Heated bathroom floors',
            'heated bathroom': 'Heated bathroom floors',
            'vanity': 'Vanity',
            'double vanity': 'Double vanity',
            'marble bathroom': 'Marble bathroom',
            'slippers': 'Slippers'
        };// Parse HTML content if present
        let cleanText = text;

        // Handle paragraph format: <p><b>Bathroom</b> - content</p>
        const htmlBathroomMatch = text.match(/<p><b>bathroom<\/b>\s*-\s*([^<]+)<\/p>/i);
        if (htmlBathroomMatch) {
            cleanText = htmlBathroomMatch[1].toLowerCase();
        }

        // Handle list format: <ul><li>item</li><li>item</li></ul>
        const listMatches = text.match(/<li>([^<]+)<\/li>/gi);
        if (listMatches) {
            const listItems = listMatches.map(match => match.replace(/<\/?li>/gi, '').toLowerCase());
            cleanText += ' ' + listItems.join(' ');
        }

        // Check for bathroom terms
        for (const [term, amenity] of Object.entries(bathroomTerms)) {
            if (cleanText.includes(term) && !bathroomAmenities.includes(amenity)) {
                bathroomAmenities.push(amenity);
            }
        }

        return {
            bathroom: bathroomAmenities,
            source: 'description_text'
        };
    }

    // Function to extract amenities from property info structure
    function extractAmenitiesFromPropertyInfo(jsonResponse) {
        const bathroomAmenities = [];

        if (!jsonResponse) {
            return { bathroom: [], source: 'property_info' };
        }

        // Recursive function to search for bathroom amenities in nested objects
        function searchForBathroomAmenities(obj, path = '') {
            if (!obj || typeof obj !== 'object') return;

            // Check if this object has amenity-related properties
            if (obj.amenities && Array.isArray(obj.amenities)) {
                obj.amenities.forEach(amenity => {
                    if (amenity && typeof amenity === 'object') {
                        const name = amenity.name || amenity.description || amenity.text || '';
                        if (name && typeof name === 'string') {
                            const lowerName = name.toLowerCase();
                            if (lowerName.includes('bathroom') || lowerName.includes('bath') ||
                                lowerName.includes('shower') || lowerName.includes('toiletries')) {
                                bathroomAmenities.push(name);
                            }
                        }
                    }
                });
            }

            // Check for bathroom-related descriptions
            if (obj.description && typeof obj.description === 'string') {
                const desc = obj.description.toLowerCase();
                if (desc.includes('bathroom') || desc.includes('bath') || desc.includes('shower')) {
                    // Extract bathroom amenities from description
                    const extracted = extractAmenitiesFromDescription(obj.description);
                    bathroomAmenities.push(...extracted.bathroom);
                }
            }

            // Recursively search nested objects and arrays
            for (const key in obj) {
                if (obj.hasOwnProperty(key) && obj[key] && typeof obj[key] === 'object') {
                    searchForBathroomAmenities(obj[key], path ? `${path}.${key}` : key);
                }
            }
        }

        try {
            searchForBathroomAmenities(jsonResponse);
        } catch (error) {
            console.warn('Error searching for bathroom amenities in property info:', error);
        }

        // Remove duplicates
        const uniqueBathroomAmenities = [...new Set(bathroomAmenities)];

        return {
            bathroom: uniqueBathroomAmenities,
            source: 'property_info'
        };    }

    // Function to extract amenities from the new roomAmenities.bodySubSections structure
    function extractAmenitiesFromRoomAmenitiesStructure(roomAmenitiesData) {
        const extractedAmenities = {
            bathroom: [],
            bedroom: [],
            general: [],
            source: 'roomAmenities_structure'
        };

        if (!roomAmenitiesData || !roomAmenitiesData.bodySubSections) {
            return extractedAmenities;
        }

        try {
            roomAmenitiesData.bodySubSections.forEach(subSection => {
                if (subSection.elementsV2 && Array.isArray(subSection.elementsV2)) {
                    subSection.elementsV2.forEach(elementV2 => {
                        if (elementV2.elements && Array.isArray(elementV2.elements)) {
                            elementV2.elements.forEach(element => {
                                // Get the category from the header (Bathroom, Bedroom, etc.)
                                const category = element.header?.text?.toLowerCase() || 'general';

                                // Process items in this category
                                if (element.items && Array.isArray(element.items)) {
                                    element.items.forEach(item => {
                                        if (item.content && item.content.text) {
                                            // Parse HTML list content like "<ul><li>Bidet</li><li>Designer toiletries</li>...</ul>"
                                            const htmlContent = item.content.text;
                                            const listMatches = htmlContent.match(/<li>([^<]+)<\/li>/gi);

                                            if (listMatches) {
                                                listMatches.forEach(match => {
                                                    const amenity = match.replace(/<\/?li>/gi, '').trim();

                                                    // Categorize amenities
                                                    if (category.includes('bathroom')) {
                                                        extractedAmenities.bathroom.push(amenity);
                                                    } else if (category.includes('bedroom')) {
                                                        extractedAmenities.bedroom.push(amenity);
                                                    } else {
                                                        extractedAmenities.general.push(amenity);
                                                    }
                                                });
                                            } else {
                                                // Handle non-HTML content
                                                const amenity = htmlContent.trim();
                                                if (amenity) {
                                                    if (category.includes('bathroom')) {
                                                        extractedAmenities.bathroom.push(amenity);
                                                    } else if (category.includes('bedroom')) {
                                                        extractedAmenities.bedroom.push(amenity);
                                                    } else {
                                                        extractedAmenities.general.push(amenity);
                                                    }
                                                }
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

            // Remove duplicates
            extractedAmenities.bathroom = [...new Set(extractedAmenities.bathroom)];
            extractedAmenities.bedroom = [...new Set(extractedAmenities.bedroom)];
            extractedAmenities.general = [...new Set(extractedAmenities.general)];

            console.log('✓ Extracted amenities from roomAmenities structure:', extractedAmenities);

        } catch (error) {
            console.warn('Error extracting amenities from roomAmenities structure:', error);
        }

        return extractedAmenities;
    }

    // Function to parse room details from the new GraphQL JSON response structure
    function parseRoomDetailsFromGraphQLResponse(jsonResponse) {
        const rooms = [];
        const seenOriginalUnitIds = new Set(); // Track seen originalUnitId values to prevent duplicates
        const newParserVersion = "v0.9"; // Define version for consistency
        // console.log(`Attempting to parse new GraphQL response structure (${newParserVersion}):`, JSON.stringify(jsonResponse, null, 2));

        try {
            // Robust extraction for both array and object root types
            let propertyOffersData = null;
            if (Array.isArray(jsonResponse)) {
                // The new response has two parts, the second one has the room details.
                // Try the second element first, then fall back to the first one.
                propertyOffersData = jsonResponse[1]?.data?.propertyOffers || jsonResponse[0]?.data?.propertyOffers;
            } else if (jsonResponse?.data?.propertyOffers) {
                propertyOffersData = jsonResponse.data.propertyOffers;
            } else if (jsonResponse?.data?.propertyOffers) {
                propertyOffersData = jsonResponse.data.propertyOffers;
            }
            if (!propertyOffersData) {
                console.warn(`Property offers data not found in the expected path for parser ${newParserVersion}:`, jsonResponse);
                return rooms;
            }
            // Always extract categorizedListings
            let categorizedListings = propertyOffersData.categorizedListings || propertyOffersData.listings || [];
            if (!Array.isArray(categorizedListings)) {
                console.warn('categorizedListings is not an array:', categorizedListings);
                categorizedListings = [];
            }
            if (categorizedListings.length === 0) {
                console.warn('No rooms found in categorizedListings:', categorizedListings);
            } else {
                console.log('Parsing categorizedListings:', categorizedListings);
            }
            if (categorizedListings && Array.isArray(categorizedListings)) {
                categorizedListings.forEach((category, categoryIndex) => {
                    // Accept rooms even if unitId is missing, but mark as incomplete
                    const unitIdForCategory = category.unitId || `NO_UNITID_${categoryIndex}`;
                    const baseRoomName = category.header?.text || `Room Type ${unitIdForCategory}`;

                    // Extract occupancy, area, and bed information from features array
                    let occupancyValue = NaN;
                    let occupancyText = 'N/A';
                    let areaText = 'N/A';
                    let bedText = 'N/A';

                    if (Array.isArray(category.features)) {
                        for (const feature of category.features) {
                            if (feature.text) {
                                if (/sleeps\s*\d+/i.test(feature.text)) {
                                    occupancyText = feature.text;
                                    const match = feature.text.match(/sleeps\s*(\d+)/i);
                                    if (match) occupancyValue = parseInt(match[1], 10);
                                }
                                if (/\d+\s*(sq\s*ft|sqft|square\s*feet?|m²|sqm|square\s*meters?)/i.test(feature.text)) {
                                    areaText = feature.text;
                                }
                            }
                            if (feature.graphic?.id === 'bed' && feature.text) {
                                bedText = feature.text;
                            }
                        }
                    }

                    // Extract room amenities from new structure
                    let roomAmenities = null;
                    let propertyUnit = null;
                    if (Array.isArray(category.primarySelections) && category.primarySelections.length > 0) {
                        propertyUnit = category.primarySelections[0]?.propertyUnit;
                    }
                    if (propertyUnit && propertyUnit.roomAmenities && propertyUnit.roomAmenities.bodySubSections) {
                        roomAmenities = extractAmenitiesFromRoomAmenitiesStructure(propertyUnit.roomAmenities);
                    }
                    if (!roomAmenities && propertyUnit && propertyUnit.roomAmenities && !propertyUnit.roomAmenities.bodySubSections) {
                        roomAmenities = propertyUnit.roomAmenities;
                    }
                    if (!roomAmenities && category.description?.text) {
                        roomAmenities = extractAmenitiesFromDescription(category.description.text);
                    }
                    if (!roomAmenities) {
                        roomAmenities = extractAmenitiesFromPropertyInfo(jsonResponse);
                    }

                    // Extract price from stickyBar or price fields
                    let price = null;
                    if (propertyOffersData.stickyBar?.price?.formattedDisplayPrice) {
                        price = propertyOffersData.stickyBar.price.formattedDisplayPrice.replace(/[^\d.]/g, '');
                    } else if (propertyUnit?.ratePlans?.[0]?.price?.amount) {
                        price = propertyUnit.ratePlans[0].price.amount;
                    }

                    // Extract currency
                    let currency = propertyOffersData.stickyBar?.price?.currency || propertyUnit?.ratePlans?.[0]?.price?.currency || 'USD';

                    // If there are ratePlans, extract each as a separate room offer
                    const ratePlans = propertyUnit?.ratePlans;
                    if (ratePlans && Array.isArray(ratePlans) && ratePlans.length > 0) {
                        ratePlans.forEach((ratePlan, planIndex) => {
                            const offerId = ratePlan.id || `OFFER_ID_${unitIdForCategory}_${planIndex}`;
                            let offerNameDetail = ratePlan.badge?.text || ratePlan.headerMessage?.text || '';

                            let detailedRoomName = baseRoomName;
                            if (offerNameDetail) {
                                detailedRoomName += ` (${offerNameDetail.trim()})`;
                            }

                            let priceValue = NaN;
                            let finalRawPriceText = "N/A";
                            let currencyCode = currency;

                            // Extract price from the checkout action's totalPrice
                            const checkoutAction = ratePlan.priceDetails?.[0]?.lodgingPrepareCheckout?.action;
                            if (checkoutAction && checkoutAction.totalPrice) {
                                priceValue = Math.round(checkoutAction.totalPrice.amount);
                                currencyCode = checkoutAction.totalPrice.currencyInfo?.code || currency;
                            }

                            // Extract formatted price from display messages for rawPriceText
                            const priceDetails = ratePlan.priceDetails?.[0];
                            if (priceDetails && priceDetails.price && priceDetails.price.displayMessages) {
                                for (const displayMessage of priceDetails.price.displayMessages) {
                                    if (displayMessage.lineItems) {
                                        for (const lineItem of displayMessage.lineItems) {
                                            if (lineItem.value && lineItem.value.includes('total')) {
                                                finalRawPriceText = lineItem.value; // e.g., "$491 total"
                                                break;
                                            }
                                        }
                                    }
                                    if (finalRawPriceText !== "N/A") break;
                                }
                            }

                            rooms.push({
                                unitId: unitIdForCategory,
                                name: detailedRoomName,
                                occupancy: occupancyValue,
                                occupancyText,
                                area: areaText,
                                bed: bedText,
                                amenities: roomAmenities,
                                price: priceValue || price,
                                priceText: finalRawPriceText,
                                currency: currencyCode,
                                offerId,
                                raw: { category, ratePlan }
                            });
                        });
                    } else {
                        // No ratePlans, just push the room itself
                        rooms.push({
                            unitId: unitIdForCategory,
                            name: baseRoomName,
                            occupancy: occupancyValue,
                            occupancyText,
                            area: areaText,
                            bed: bedText,
                            amenities: roomAmenities,
                            price,
                            currency,
                            offerId: null,
                            raw: { category }
                        });
                    }
                });
            }
        } catch (error) {
            console.error(`Error parsing GraphQL response (${newParserVersion}):`, error, jsonResponse);
        }

        // Store amenities data for bathroom automation
        storeDetectedAmenities(rooms);

        // Store detected amenities for bathroom automation
        function storeDetectedAmenities(rooms) {
            try {
                // Aggregate all bathroom amenities from all rooms
                const allAmenities = new Set();

                rooms.forEach(room => {
                    if (room.roomAmenities && room.roomAmenities.bathroom) {
                        room.roomAmenities.bathroom.forEach(amenity => {
                            allAmenities.add(amenity);
                        });
                    }
                });

                // Convert to array and store in the format expected by bathroom automation
                const amenitiesData = {
                    amenities: Array.from(allAmenities),
                    source: "GraphQL Enhanced Parsing",
                    timestamp: new Date().toISOString(),
                    rooms: rooms.length
                };

                GM_setValue("step2DetectedAmenities", JSON.stringify(amenitiesData));
                console.log(`✓ Stored ${amenitiesData.amenities.length} unique bathroom amenities for automation:`, amenitiesData.amenities);

            } catch (error) {
                console.warn('Error storing detected amenities:', error);
            }
        }

        console.log(`Parsed rooms (${newParserVersion} structure):`, JSON.stringify(rooms, null, 2));
        return rooms;
    }


    async function fetchGeocodingData(queryString) {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(queryString)}`;
        console.log(`Fetching geocoding data from: ${url}`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                responseType: "json",
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        if (response.response && response.response.length > 0) {
                            console.log("Nominatim response received:", response.response[0]);
                            resolve(response.response[0]);
                        } else {
                            console.warn("Nominatim: No results found for query.");
                            resolve(null);
                        }
                    } else {
                        reject(new Error(`Failed to fetch geocoding data: ${response.status} ${response.statusText} from ${url}. Response: ${response.responseText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Error during GM_xmlhttpRequest for geocoding: ${error.statusText || 'Unknown error'} from ${url}`));
                }
            });
        });
    }

    async function parseAddressComponents(addressString, hotelNameForContext = '') {
        const components = {
            houseNumber: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            stateProvince: '',
            postalCode: '',
            country: ''
        };
        if (!addressString || addressString.trim() === '') {
            console.warn("Address string is empty, cannot parse components.");
            return components;
        }
        console.log("Original address string for parsing:", addressString);
        let remainingAddress = addressString;

        const countryPatterns = [
            /(,\s*(USA|U\.S\.A\.|United States of America|United States))$/i,
            /(,\s*(UK|U\.K\.|United Kingdom))$/i,
            /(,\s*(Canada))$/i,
            /(,\s*(Australia))$/i,
            /(,\s*(Singapore))$/i,
            /(,\s*([A-Za-z\s]+))$/
        ];
        for (const pattern of countryPatterns) {
            const countryMatch = remainingAddress.match(pattern);
            if (countryMatch && countryMatch[2]) {
                components.country = countryMatch[2].trim();
                remainingAddress = remainingAddress.substring(0, countryMatch.index).trim();
                break;
            }
        }
        if (components.country === '' && remainingAddress.includes(',')) {
             const parts = remainingAddress.split(',');
             const potentialCountry = parts.pop().trim();
             if (potentialCountry && !/^\d+$/.test(potentialCountry) && potentialCountry.length > 2 && potentialCountry.toUpperCase() !== potentialCountry) {
                 components.country = potentialCountry;
                 remainingAddress = parts.join(',').trim();
             } else {
                 parts.push(potentialCountry);
                 remainingAddress = parts.join(',').trim();
             }
        }

        const postalCodeRegex = /(\b\d{5}(?:-\d{4})?\b|[A-Z]\d[A-Z]\s?\d[A-Z]\d|\b\d{6}\b|[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2})\s*$/i;
        const postalCodeMatch = remainingAddress.match(postalCodeRegex);
        if (postalCodeMatch) {
            components.postalCode = postalCodeMatch[1].trim();
            remainingAddress = remainingAddress.substring(0, postalCodeMatch.index).trim();
            if (remainingAddress.endsWith(',')) remainingAddress = remainingAddress.slice(0, -1).trim();
        }

        const cityStateParts = remainingAddress.split(',').map(p => p.trim()).filter(p => p !== '');
        if (cityStateParts.length > 0) {
            if (cityStateParts.length > 1) {
                const part1 = cityStateParts[cityStateParts.length - 1];
                const part2 = cityStateParts[cityStateParts.length - 2];
                if (part1.length === 2 && part1 === part1.toUpperCase() && /^[A-Z]+$/.test(part1)) {
                    components.stateProvince = part1;
                    components.city = part2;
                    cityStateParts.pop();
                    cityStateParts.pop();
                } else {
                    components.city = part1;
                    cityStateParts.pop();
                    if (cityStateParts.length > 0) {
                        const potentialState = cityStateParts[cityStateParts.length -1];
                        if ((potentialState.length <= 4 && potentialState === potentialState.toUpperCase()) || potentialState.toLowerCase().includes('province') || potentialState.toLowerCase().includes('state')) {
                           components.stateProvince = potentialState;
                           cityStateParts.pop();
                        }
                    }
                }
            } else if (cityStateParts.length === 1 && cityStateParts[0] !== '') {
                components.city = cityStateParts.pop();
            }
        }
        remainingAddress = cityStateParts.join(', ').trim();
        components.addressLine1 = remainingAddress;

        let addressLineParts = components.addressLine1.split(',').map(p => p.trim()).filter(p => p.length > 0);
        const unitInfoPattern = /^\s*#\s*(\d+)(?:[-/]?(\d+))?\s*$/;

        if (addressLineParts.length > 0) {
            const potentialUnitInfoPart = addressLineParts[addressLineParts.length - 1];
            const unitMatch = potentialUnitInfoPart.match(unitInfoPattern);

            if (unitMatch) {
                if (unitMatch[1] && components.houseNumber.trim() === '') {
                    components.houseNumber = unitMatch[1];
                }
                if (unitMatch[2]) {
                    if (components.postalCode.trim() === '' || unitMatch[2].trim() === '900') {
                        components.postalCode = unitMatch[2].trim();
                    }
                }
                addressLineParts.pop();
            }
        }

        if (components.addressLine2.trim() === '') {
            if (addressLineParts.length === 1) {
                components.addressLine1 = addressLineParts[0];
            } else if (addressLineParts.length === 2) {
                components.addressLine1 = addressLineParts[0];
                components.addressLine2 = addressLineParts[1];
            } else if (addressLineParts.length > 2) {
                components.addressLine1 = addressLineParts[0];
                components.addressLine2 = addressLineParts[1];
                console.warn("Address has multiple parts after unit processing. Assigned first to AddressLine1, second to AddressLine2. Remainder: ", addressLineParts.slice(2).join(', '));
            } else if (addressLineParts.length === 0 && components.addressLine1.includes('#')) {
                 components.addressLine1 = '';
            } else {
                 components.addressLine1 = addressLineParts.join(', ');
            }
        } else {
            components.addressLine1 = addressLineParts.join(', ');
        }

        if (components.houseNumber.trim() === '' && components.addressLine1 && components.addressLine1.trim() !== '') {
            const houseNumberMatch = components.addressLine1.match(/^(\d+[A-Za-z]?(\s?-\s?[\d\/A-Za-z]+)?)\s+(.*)/);
            if (houseNumberMatch) {
                components.houseNumber = houseNumberMatch[1].trim();
                components.addressLine1 = houseNumberMatch[3].trim();
            }
        }

        if (components.addressLine2.trim() === '' && components.addressLine1 && components.addressLine1.trim() !== '') {
            const aptSuitePattern = /\s+(Apt|Apartment|Suite|Unit|#|No\.?)\s+[\w\d-]+$/i;
            const aptMatch = components.addressLine1.match(aptSuitePattern);
            if (aptMatch) {
                components.addressLine2 = aptMatch[0].trim();
                components.addressLine1 = components.addressLine1.substring(0, aptMatch.index).trim();
            }
        }

        console.log("Initial Parsed Address Components (before geocoding):", JSON.parse(JSON.stringify(components)));

        let geocodingAttempted = false;
        if (components.country.trim() === '' || components.stateProvince.trim() === '' || (components.city.trim() === '' && components.postalCode.trim() === '')) {
            let queryParts = [];

            if (components.addressLine1) queryParts.push(components.addressLine1);
            else if (components.addressLine2) queryParts.push(components.addressLine2);

            if (components.city) queryParts.push(components.city);
            if (components.postalCode && components.postalCode.length > 2) queryParts.push(components.postalCode);

            if (components.country && components.country.trim() !== '') {
                queryParts.push(components.country);
            } else if (components.stateProvince && components.stateProvince.trim() !== '') {
                if (components.country.trim() === '') queryParts.push(components.stateProvince);
            }

            if (queryParts.length < 2 && hotelNameForContext) {
                if (!queryParts.some(p => p.includes(hotelNameForContext))) {
                     queryParts.unshift(hotelNameForContext);
                }
            }

            let queryString = queryParts.join(', ');
            if (queryParts.length < 2 && addressString) {
                queryString = addressString;
            }

            if (queryString.trim() !== '') {
                console.log(`Attempting geocoding for missing address parts with query: \"${queryString}\"`);
                geocodingAttempted = true;
                try {
                    const geoData = await fetchGeocodingData(queryString);
                    // geocodingAttempted = true; // Already set

                    if (geoData && geoData.address) {
                        const geo = geoData.address;
                        console.log("Geocoding Data for double check (geo.address):", geo);
                        const initialComponents = JSON.parse(JSON.stringify(components));

                        if (geo.country && geo.country.trim() !== '') {
                            const nominatimCountry = geo.country.trim();
                            if (components.country.trim() === '' || components.country.toLowerCase() !== nominatimCountry.toLowerCase()) {
                                console.log(`Updating Country from '${components.country}' to '${nominatimCountry}' based on geocoding.`);
                                components.country = nominatimCountry;
                            } else {
                                console.log(`Retaining initial Country '${components.country}'. Nominatim offered '${nominatimCountry}'.`);
                            }
                        }

                        let nominatimState = geo.state ? geo.state.trim() : '';
                        if (!nominatimState && geo['ISO3166-2-lvl4']) {
                            nominatimState = geo['ISO3166-2-lvl4'].trim();
                            console.log(`Using ISO3166-2-lvl4 ('${nominatimState}') as State/Province as geo.state is missing.`);
                        }

                        if (nominatimState && nominatimState.trim() !== '') {
                            if (components.stateProvince.trim() === '' || components.stateProvince.toLowerCase() !== nominatimState.toLowerCase()) {
                                console.log(`Updating State/Province from '${components.stateProvince}' to '${nominatimState}' based on geocoding.`);
                                components.stateProvince = nominatimState;
                            } else {
                                console.log(`Retaining initial State/Province '${components.stateProvince}'. Nominatim offered '${nominatimState}'.`);
                            }
                        }

                        const nominatimCitySource = geo.city || geo.town || geo.village || geo.county || geo.city_district;
                        if (nominatimCitySource && nominatimCitySource.trim() !== '') {
                            const nominatimCity = nominatimCitySource.trim();
                            if (components.city.trim() === '' || components.city.toLowerCase() !== nominatimCity.toLowerCase()) {
                                console.log(`Updating City from '${components.city}' to '${nominatimCity}' based on geocoding.`);
                                components.city = nominatimCity;
                            } else {
                                console.log(`Retaining initial City '${components.city}'. Nominatim offered '${nominatimCity}'.`);
                            }
                        }

                        if (initialComponents.postalCode && initialComponents.postalCode.trim() !== '') {
                            console.log(`Retaining initially parsed Postal Code '${initialComponents.postalCode}'. Nominatim offered '${geo.postcode || ''}'.`);
                            components.postalCode = initialComponents.postalCode;
                        } else if (geo.postcode && geo.postcode.trim() !== '') {
                            const nominatimPostalCode = geo.postcode.trim();
                            console.log(`Updating Postal Code from empty to '${nominatimPostalCode}' based on geocoding (initial was empty).`);
                            components.postalCode = nominatimPostalCode;
                        }

                        let houseNumberIsName = false;
                        if (hotelNameForContext) {
                            const nominatimName = geo.name ? geo.name.trim() : '';
                            const nominatimBuildingName = geo.building ? geo.building.trim() : '';
                            const hotelNameLower = hotelNameForContext.toLowerCase();
                            let hotelMatch = false;

                            if (nominatimName && (hotelNameLower.includes(nominatimName.toLowerCase()) || nominatimName.toLowerCase().includes(hotelNameLower))) {
                                hotelMatch = true;
                            } else if (nominatimBuildingName && (hotelNameLower.includes(nominatimBuildingName.toLowerCase()) || nominatimBuildingName.toLowerCase().includes(hotelNameLower))) {
                                hotelMatch = true;
                            }

                            if (hotelMatch) {
                                if (components.houseNumber.toLowerCase() !== hotelNameLower) {
                                    console.log(`Setting House Number to hotel name ('${hotelNameForContext}') due to match with Nominatim name/building.`);
                                    components.houseNumber = hotelNameForContext;
                                    houseNumberIsName = true;
                                }
                            }
                        }

                        if (!houseNumberIsName && geo.building && geo.building.trim() !== '') {
                            const nominatimBuilding = geo.building.trim();
                            if (components.houseNumber.trim() === '' || components.houseNumber.toLowerCase() !== nominatimBuilding.toLowerCase()) {
                                console.log(`Setting House Number to Nominatim's building name ('${nominatimBuilding}').`);
                                components.houseNumber = nominatimBuilding;
                                houseNumberIsName = true;
                            }
                        }

                        if (!houseNumberIsName && geo.house_number && geo.house_number.trim() !== '') {
                            const nominatimHouseNumber = geo.house_number.trim();
                            if (components.houseNumber.trim() === '' || components.houseNumber.toLowerCase() !== nominatimHouseNumber.toLowerCase()) {
                                console.log(`Updating House Number from '${components.houseNumber}' to Nominatim's house_number ('${nominatimHouseNumber}').`);
                                components.houseNumber = nominatimHouseNumber;
                            }
                        }

                        if (initialComponents.addressLine1 && initialComponents.addressLine1.trim() !== '') {
                            console.log(`Retaining initially parsed AddressLine1 '${initialComponents.addressLine1}'.`);
                            components.addressLine1 = initialComponents.addressLine1;
                        } else {
                            let tempAddressLine1Parts = [];
                            const nominatimRoad = geo.road ? geo.road.trim() : '';
                            if (nominatimRoad) tempAddressLine1Parts.push(nominatimRoad);

                            const nominatimNeighbourhood = geo.neighbourhood ? geo.neighbourhood.trim() : '';
                            if (nominatimNeighbourhood && (!nominatimRoad || !nominatimRoad.toLowerCase().includes(nominatimNeighbourhood.toLowerCase()))) {
                                tempAddressLine1Parts.push(nominatimNeighbourhood);
                            }

                            const nominatimQuarter = geo.quarter ? geo.quarter.trim() : '';
                            if (nominatimQuarter &&
                                (!nominatimRoad || !nominatimRoad.toLowerCase().includes(nominatimQuarter.toLowerCase())) &&
                                (!nominatimNeighbourhood || !nominatimNeighbourhood.toLowerCase().includes(nominatimQuarter.toLowerCase()) || nominatimNeighbourhood === '')) {
                                tempAddressLine1Parts.push(nominatimQuarter);
                            }
                            let constructedAddressLine1 = tempAddressLine1Parts.filter(p => p).join(', ');

                            if (!houseNumberIsName && components.houseNumber && components.houseNumber.trim() !== '' && constructedAddressLine1) {
                                if (!constructedAddressLine1.toLowerCase().startsWith(components.houseNumber.trim().toLowerCase())) {
                                    console.log(`Prepending numeric House Number '${components.houseNumber.trim()}' to constructed AddressLine1.`);
                                    constructedAddressLine1 = `${components.houseNumber.trim()} ${constructedAddressLine1}`;
                                }
                            }

                            if (constructedAddressLine1 && components.addressLine1.trim() === '') {
                                console.log(`Constructing AddressLine1 as '${constructedAddressLine1}' from geocoding (initial was empty).`);
                                components.addressLine1 = constructedAddressLine1;
                            }
                        }
                        if (components.addressLine2.trim() !== '') {
                            console.log(`Clearing AddressLine2 from '${components.addressLine2}' to meet 'Leave it Blank' requirement.`);
                        }
                        components.addressLine2 = '';

                    } else {
                        console.warn("Geocoding request successful but no usable address data found in response or no results returned (geoData or geoData.address is null/undefined).");
                    }
                } catch (error) {
                    console.error("Error fetching or processing geocoding data:", error.message);
                }
            } else {
                console.warn("Not enough information to attempt geocoding for missing address parts.");
            }
        }

        let finalAlertMessage = "Address parsing completed. Please carefully VERIFY and ADJUST the auto-filled address fields.";
        if (geocodingAttempted) {
            finalAlertMessage = "Address parsing included a geocoding attempt for potentially missing parts. Please carefully VERIFY and ADJUST all fields.";
        } else if (components.country.trim() === '' || components.stateProvince.trim() === '' || components.city.trim() === '') {
            finalAlertMessage = "Address parsing is EXPERIMENTAL. Some fields (like Country, State/Province, or City) might be missing or incorrect. Please VERIFY and fill them. You may need to refine the 'parseAddressComponents' function in the script for better accuracy.";        }
        await showAlertModal("Address Parsing Notice", finalAlertMessage);
        console.log("Final Parsed Address Components (after potential geocoding):", components);
        return components;
    }

    function fillHotelNameOnEgetinnz(hotelName) {
        const hotelNameInput = document.querySelector('#hotelNameInput');
        if (hotelNameInput) {
            hotelNameInput.value = hotelName;
            console.log(`Filled hotel name: ${hotelName}`);
        } else {
            console.error("Could not find hotel name input field on Egetinnz (assumed #hotelNameInput).");
        }
    }

    function fillHouseNumberOnEgetinnz(houseNumber) {
        const input = document.querySelector('#HouseNumber');
        if (input) { input.value = houseNumber; console.log(`Filled House Number: ${houseNumber}`); }
        else { console.warn("Could not find HouseNumber input field (#HouseNumber)."); }
    }

    function fillAddressLine1OnEgetinnz(addressLine1) {
        const input = document.querySelector('#AddressLine1');
        if (input) { input.value = addressLine1; console.log(`Filled Address Line 1: ${addressLine1}`); }
        else { console.error("Could not find AddressLine1 input field (#AddressLine1)."); }
    }

    function fillAddressLine2OnEgetinnz(addressLine2) {
        const input = document.querySelector('#AddressLine2');
        if (input) { input.value = addressLine2; console.log(`Filled Address Line 2: ${addressLine2}`); }
        else { console.warn("Could not find AddressLine2 input field (#AddressLine2) or it's not applicable/empty."); }
    }

    function fillCityOnEgetinnz(city) {
        const input = document.querySelector('#City');
        if (input) { input.value = city; console.log(`Filled City: ${city}`); }
        else { console.error("Could not find City input field (#City)."); }
    }

    function fillStateProvinceOnEgetinnz(stateProvince) {
        const input = document.querySelector('#StateProvince');
        if (input) { input.value = stateProvince; console.log(`Filled State/Province: ${stateProvince}`); }
        else { console.error("Could not find StateProvince input field (#StateProvince)."); }
    }

    function fillPostalCodeOnEgetinnz(postalCode) {
        const input = document.querySelector('#PostalCode');
        if (input) { input.value = postalCode; console.log(`Filled Postal Code: ${postalCode}`); }
        else { console.error("Could not find PostalCode input field (#PostalCode)."); }
    }
    
    async function fillCountryOnEgetinnz(countryName) {
        const selectElement = document.querySelector('#CountryID');        if (!selectElement) {
            console.error("Could not find CountryID select element.");
            await showAlertModal("Country Selection Error", "Could not find CountryID select element on Egetinnz page.");
            return;
        }
        if (!countryName || countryName.trim() === "") {
            console.warn("Parsed country name is empty, cannot select country.");
            return;
        }

        let foundOptionValue = null;
        const normalizedCountryName = countryName.trim().toLowerCase();        // Comprehensive country mapping with actual Egetinnz dropdown values
        const countryValueMap = {
            // Primary country names and their actual Egetinnz values from Step1 form
            "afghanistan": "215",
            "åland": "225",
            "albania": "218",
            "algeria": "86",
            "american samoa": "222",
            "andorra": "219",
            "angola": "216",
            "anguilla": "217",
            "antarctica": "223",
            "antigua and barbuda": "224",
            "argentina": "7",
            "armenia": "221",
            "aruba": "214",
            "australia": "8",
            "austria": "9",
            "azerbaijan": "10",
            "bahamas": "60",
            "bahrain": "59",
            "bangladesh": "57",
            "barbados": "66",
            "belarus": "62",
            "belgium": "11",
            "belize": "63",
            "benin": "55",
            "bermuda": "64",
            "bhutan": "68",
            "bolivia": "65",
            "bosnia and herzegovina": "61",
            "botswana": "70",
            "bouvet island": "69",
            "brazil": "12",
            "british indian ocean territory": "114",
            "brunei darussalam": "67",
            "bulgaria": "58",
            "burkina faso": "56",
            "burundi": "54",
            "cambodia": "121",
            "cameroon": "74",
            "canada": "13",
            "cape verde": "78",
            "cayman islands": "82",
            "central african republic": "71",
            "chad": "186",
            "chile": "14",
            "china": "15",
            "christmas island": "81",
            "cocos (keeling) islands": "72",
            "colombia": "76",
            "comoros": "77",
            "congo (brazzaville)": "226",
            "congo (kinshasa)": "227",
            "cook islands": "75",
            "costa rica": "79",
            "côte d'ivoire": "73",
            "croatia": "111",
            "cuba": "80",
            "cyprus": "16",
            "czech republic": "17",
            "denmark": "18",
            "djibouti": "83",
            "dominica": "84",
            "dominican republic": "85",
            "ecuador": "87",
            "egypt": "19",
            "el salvador": "176",
            "equatorial guinea": "102",
            "eritrea": "88",
            "estonia": "90",
            "ethiopia": "91",
            "falkland islands": "228",
            "faroe islands": "93",
            "fiji": "92",
            "finland": "20",
            "france": "3",
            "french guiana": "105",
            "french polynesia": "167",
            "french southern lands": "229",
            "gabon": "94",
            "gambia": "100",
            "georgia": "95",
            "germany": "21",
            "ghana": "96",
            "gibraltar": "97",
            "greece": "22",
            "greenland": "104",
            "grenada": "103",
            "guadeloupe": "99",
            "guam": "106",
            "guatemala": "23",
            "guinea": "98",
            "guinea-bissau": "101",
            "guyana": "107",
            "haiti": "112",
            "heard and mcdonald islands": "109",
            "honduras": "110",
            "hungary": "24",
            "iceland": "116",
            "india": "25",
            "indonesia": "113",
            "iran": "204",
            "iraq": "115",
            "ireland": "5",
            "israel": "26",
            "italy": "27",
            "jamaica": "117",
            "japan": "28",
            "jordan": "118",
            "kazakhstan": "205",
            "kenya": "119",
            "kiribati": "122",
            "kuwait": "124",
            "kyrgyzstan": "120",
            "laos": "206",
            "latvia": "132",
            "lebanon": "125",
            "lesotho": "130",
            "liberia": "126",
            "libya": "207",
            "liechtenstein": "128",
            "lithuania": "131",
            "luxembourg": "29",
            "macedonia": "231",
            "madagascar": "135",
            "malawi": "148",
            "malaysia": "30",
            "maldives": "136",
            "mali": "138",
            "malta": "139",
            "marshall islands": "137",
            "martinique": "146",
            "mauritania": "144",
            "mauritius": "147",
            "mayotte": "149",
            "mexico": "31",
            "micronesia": "232",
            "moldova": "208",
            "monaco": "134",
            "mongolia": "141",
            "montenegro": "241",
            "montserrat": "145",
            "morocco": "32",
            "mozambique": "143",
            "myanmar": "140",
            "namibia": "150",
            "nauru": "158",
            "nepal": "157",
            "netherlands": "33",
            "new caledonia": "151",
            "new zealand": "159",
            "nicaragua": "155",
            "niger": "152",
            "nigeria": "154",
            "niue": "156",
            "norfolk island": "153",
            "north korea": "46",
            "northern mariana islands": "142",
            "norway": "34",
            "oman": "160",
            "pakistan": "161",
            "palau": "163",
            "palestine": "233",
            "panama": "35",
            "papua new guinea": "164",
            "paraguay": "166",
            "peru": "36",
            "philippines": "37",
            "pitcairn islands": "162",
            "poland": "38",
            "portugal": "39",
            "puerto rico": "165",
            "qatar": "168",
            "reunion": "169",
            "romania": "40",
            "russian federation": "41",
            "rwanda": "170",
            "saint helena": "173",
            "saint kitts and nevis": "123",
            "saint lucia": "127",
            "saint pierre and miquelon": "179",
            "saint vincent and the grenadines": "234",
            "samoa": "200",
            "san marino": "177",
            "sao tome and principe": "180",
            "saudi arabia": "42",
            "senegal": "172",
            "serbia": "209",
            "seychelles": "184",
            "sierra leone": "175",
            "singapore": "43",
            "slovakia": "44",
            "slovenia": "182",
            "solomon islands": "174",
            "somalia": "178",
            "south africa": "45",
            "south georgia and south sandwich islands": "235",
            "south korea": "230",
            "spain": "4",
            "sri lanka": "129",
            "sudan": "171",
            "suriname": "181",
            "svalbard and jan mayen islands": "236",
            "swaziland": "183",
            "sweden": "47",
            "switzerland": "48",
            "syria": "210",
            "taiwan": "246",
            "tajikistan": "188",
            "tanzania": "212",
            "thailand": "243",
            "timor-leste": "237",
            "togo": "187",
            "tokelau": "189",
            "tonga": "191",
            "trinidad and tobago": "192",
            "tunisia": "49",
            "turkey": "50",
            "turkmenistan": "190",
            "turks and caicos islands": "185",
            "tuvalu": "193",
            "uganda": "194",
            "ukraine": "51",
            "united arab emirates": "52",
            "united kingdom": "2",
            "uruguay": "195",
            "us minor outlying islands": "238",
            "usa": "6",
            "uzbekistan": "196",
            "vanuatu": "198",
            "vatican city": "213",
            "venezuela": "197",
            "vietnam": "53",
            "virgin islands (british)": "239",
            "virgin islands (u.s.)": "240",
            "wallis and futuna islands": "199",
            "western sahara": "89",
            "yemen": "201",
            "zambia": "202",
            "zimbabwe": "203"
        };        // Common name variations and aliases
        const countryAliases = {
            "usa": "usa",
            "u.s.a.": "usa",
            "u.s.": "usa",
            "america": "usa",
            "united states": "usa",
            "united states of america": "usa",
            "us": "usa",
            "uk": "united kingdom",
            "u.k.": "united kingdom",
            "britain": "united kingdom",
            "great britain": "united kingdom",
            "england": "united kingdom",
            "scotland": "united kingdom",
            "wales": "united kingdom",
            "northern ireland": "united kingdom",
            "uae": "united arab emirates",
            "emirates": "united arab emirates",
            "south korea": "south korea",
            "korea": "south korea",
            "republic of korea": "south korea",
            "dprk": "north korea",
            "north korea": "north korea",
            "russia": "russian federation",
            "russian federation": "russian federation",
            "czech republic": "czech republic",
            "czechia": "czech republic",
            "hong kong": "china", // Note: Hong Kong appears to be part of China in this dropdown
            "hong kong sar": "china",
            "hk": "china",
            "prc": "china",
            "people's republic of china": "china",
            "mainland china": "china",
            "brunei": "brunei darussalam",
            "iran": "iran",
            "laos": "laos",
            "macedonia": "macedonia",
            "micronesia": "micronesia",
            "moldova": "moldova",
            "palestine": "palestine",
            "serbia": "serbia",
            "taiwan": "taiwan",
            "vietnam": "vietnam"
        };

        // First try direct mapping with aliases
        let targetCountry = countryAliases[normalizedCountryName] || normalizedCountryName;
        foundOptionValue = countryValueMap[targetCountry];

        if (foundOptionValue) {
            console.log(`Direct mapping found for '${countryName}' -> '${targetCountry}' (value: ${foundOptionValue})`);
        } else {
            // Try partial text matching in dropdown options
            for (let i = 0; i < selectElement.options.length; i++) {
                const optionText = selectElement.options[i].text.trim().toLowerCase();

                // Exact match
                if (optionText === normalizedCountryName || optionText === targetCountry) {
                    foundOptionValue = selectElement.options[i].value;
                    console.log(`Exact text match found: '${optionText}' (value: ${foundOptionValue})`);
                    break;
                }

                // Partial match for longer country names
                if (normalizedCountryName.length > 3 && optionText.includes(normalizedCountryName)) {
                    foundOptionValue = selectElement.options[i].value;
                    console.log(`Partial match found: '${normalizedCountryName}' in '${optionText}' (value: ${foundOptionValue})`);
                    break;
                }
            }
        }

        if (foundOptionValue) {
            selectElement.value = foundOptionValue;
            const selectedOption = selectElement.options[selectElement.selectedIndex];
            console.log(`Selected country: ${countryName} -> ${selectedOption.text} (Value: ${foundOptionValue})`);

            // Trigger change event
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);        } else {
            console.error(`Could not automatically select country for: '${countryName}'. No matching option found in dropdown.`);
            await showAlertModal("Country Selection Required", `Could not automatically select country for: '${countryName}'. Please select manually from the dropdown.`);
        }
    }    async function automateListing() {        const expediaHotelUrl = await showPromptModal("Expedia TAAP URL Required", "Please enter the Expedia TAAP hotel URL - SEARCHES MUST BE LIMITED TO EXPEDIATAAP SITE ONLY (e.g., https://www.expediataap.com/Tokyo-Hotels-Kimpton-Shinjuku-Tokyo.h42600519.Hotel-Information):");
        if (!expediaHotelUrl) {
            console.log("No Expedia URL provided.");
            return;
        }        // Validate that the URL is from expediataap.com only
        if (!expediaHotelUrl.includes('expediataap.com')) {
            await showAlertModal("Invalid URL Domain", "ERROR: URL must be from expediataap.com domain only! Please ensure you are searching and using URLs from the correct Expedia TAAP site.");
            console.error("Invalid URL domain. Expected expediataap.com, got:", expediaHotelUrl);
            return;
        }

        // Store the URL for Step 2
        GM_setValue("expediaHotelUrl", expediaHotelUrl);        const propertyIdMatch = expediaHotelUrl.match(/h(\d+)\.Hotel-Information/i);
        if (!propertyIdMatch || !propertyIdMatch[1]) {
            await showAlertModal("Property ID Extraction Error", "Could not extract property ID from the URL. Expected format: ...hPROPERTYID.Hotel-Information");
            console.error("Could not extract property ID from URL:", expediaHotelUrl);
            GM_deleteValue("expediaHotelUrl"); // Clear if invalid
            return;
        }
        const propertyId = propertyIdMatch[1];
        GM_setValue("propertyId", propertyId);
        console.log(`Extracted Property ID: ${propertyId}`);

        // REMOVED: Prompts for dates and adults - this will move to automateStep2Forms
        // REMOVED: Calls to fetchExpediaRoomDataGraphQL and parseRoomDetailsFromGraphQLResponse
        // REMOVED: Room selection logic

        try {
            // 1. Fetch initial HTML for Hotel Name and Address
            const html = await fetchExpediaData(expediaHotelUrl);
            console.log("Successfully fetched initial Expedia page content for name/address.");
            const hotelName = parseHotelNameFromExpedia(html);
            const rawHotelAddress = getRawHotelAddressFromExpedia(html);

            if (hotelName) {
                GM_setValue("hotelName", hotelName); // Store for Step 2 context if needed & for Step 1 filling
            } else {
                GM_deleteValue("hotelName");
            }

            // 2. Fill Egetinnz Step 1 (Name and Address)
            if (hotelName) {
                console.log(`Parsed hotel name: ${hotelName}`);
                fillHotelNameOnEgetinnz(hotelName);            } else {
                console.error("Could not parse hotel name from Expedia page.");
                await showAlertModal("Hotel Name Parsing Error", "Could not parse hotel name from Expedia page. Check console for details and update selectors if HTML method is still desired for this.");
            }if (rawHotelAddress) {
                console.log(`Raw hotel address from Expedia: ${rawHotelAddress}`);
                // Pass hotelName for context in address parsing, even if it's just for geocoding query enhancement
                const addressComps = await parseAddressComponents(rawHotelAddress, hotelName || '');

                // Store address components for use in Step 3
                GM_setValue("addressComponents", JSON.stringify(addressComps));
                console.log("Address components stored for Step 3 use:", addressComps);                
                if (!addressComps.country || addressComps.country.trim() === "") {
                    await showAlertModal("Country Detection Warning", "CRITICAL WARNING: The script could not automatically determine the COUNTRY from the address. You MUST manually select the correct country on the Egetinnz form before submitting Step 1. Failure to do so will likely result in an error.");
                }if (addressComps.houseNumber && addressComps.houseNumber.trim() !== "") {
                    fillHouseNumberOnEgetinnz(addressComps.houseNumber);
                } else if (hotelName && hotelName.trim() !== "") {
                    // Use hotel name as house number when address parsing doesn't provide one
                    console.log("Using hotel name as House Number since address parsing didn't provide one.");
                    fillHouseNumberOnEgetinnz(hotelName);                } else {
                    let houseNumberAlertMessage = "The House/Unit Number could not be automatically determined from the address. This field will be left blank. Please fill it manually on the Egetinnz form.";
                    console.warn("House number not parsed from address. Egetinnz HouseNumber field will be left blank for manual input.");
                    await showAlertModal("House Number Missing", houseNumberAlertMessage);
                    fillHouseNumberOnEgetinnz(''); // Fill with empty string
                }
                fillAddressLine1OnEgetinnz(addressComps.addressLine1);
                fillAddressLine2OnEgetinnz(addressComps.addressLine2);
                fillCityOnEgetinnz(addressComps.city);
                fillStateProvinceOnEgetinnz(addressComps.stateProvince);
                fillPostalCodeOnEgetinnz(addressComps.postalCode);
                await fillCountryOnEgetinnz(addressComps.country);
            } else {
                console.error("Could not parse/get raw hotel address from Expedia page.");
                await showAlertModal("Address Parsing Error", "Could not parse/get raw hotel address from Expedia page. Check console for details and update selectors for 'getRawHotelAddressFromExpedia'.");            }
            console.log("Egetinnz Step 1 (Name/Address) automation completed. Please review all fields and submit the form.");
            await showAlertModal("Step 1 Automation Complete", "Egetinnz Step 1 (Name/Address) automation completed. Please review all fields and submit the form.");        } catch (error) {
            console.error("Error during Step 1 listing automation:", error);
            await showAlertModal("Step 1 Automation Error", "An error occurred during the Step 1 automation process. Please check the console for details.");
            // Clear stored values on error to prevent issues in subsequent steps            GM_deleteValue("expediaHotelUrl");
            GM_deleteValue("addressComponents"); // Clear address components
        }
    }

    // Helper function for paginated room selection
    async function selectRoomWithPagination(parsedRooms) {
        const totalRooms = parsedRooms.length;
        const totalPages = Math.ceil(totalRooms / 10);
        let currentPage = 1;

        console.log(`Room selection with button-based pagination: ${totalRooms} rooms, ${totalPages} pages`);

        while (true) {
            const result = await showRoomSelectionModal(parsedRooms, currentPage);
            
            if (result.type === 'room') {
                const selectedRoom = parsedRooms[result.roomIndex];
                console.log("User selected room for Step 2:", selectedRoom);
                GM_setValue("selectedRoomDetails", JSON.stringify(selectedRoom));

                // Construct occupancy display string
                let occupancyDisplayString = 'N/A';
                if (selectedRoom.rawOccupancyText && selectedRoom.rawOccupancyText !== 'N/A') {
                    occupancyDisplayString = selectedRoom.rawOccupancyText;
                    if (typeof selectedRoom.occupancy === 'number') {
                        occupancyDisplayString += ` (${selectedRoom.occupancy} total)`;
                    }
                } else if (typeof selectedRoom.occupancy === 'number') {
                    occupancyDisplayString = `Sleeps ${selectedRoom.occupancy} (${selectedRoom.occupancy} total)`;
                }

                await showAlertModal("Room Selection Confirmed", `✅ You selected: ${selectedRoom.name}\n\n💰 Price: ${selectedRoom.price} ${selectedRoom.currency}\n👥 Occupancy: ${occupancyDisplayString}\n\nThese details will be used to fill Step 2.`);
                return selectedRoom;
            } 
            else if (result.type === 'nav') {
                if (result.action === 'prev' && currentPage > 1) {
                    currentPage--;
                } else if (result.action === 'next' && currentPage < totalPages) {
                    currentPage++;
                } else if (result.action === 'page' && result.page >= 1 && result.page <= totalPages) {
                    currentPage = result.page;
                }
                // Continue the loop to show the new page
                continue;
            } 
            else if (result.type === 'skip') {
                console.log("User chose to skip room-specific details for Step 2.");
                GM_deleteValue("selectedRoomDetails");
                await showAlertModal("Skipping Room Details", "Skipping room-specific details for Step 2. Default values or manual input will be needed.");
                return null;
            }            else if (result.type === 'cancel') {
                console.log("Room selection cancelled by user for Step 2.");
                await showAlertModal("Room Selection Cancelled", "Room selection cancelled. Default values or manual input will be needed for Step 2.");
                GM_deleteValue("selectedRoomDetails");
                return null;
            }
        }
    }

    // Function for Step 2 automation
    async function automateStep2Forms() { // Changed to async to allow await for prompts and GraphQL
        console.log("Attempting to automate Egetinnz Step 2 forms...");

        const expediaHotelUrl = GM_getValue("expediaHotelUrl", null);
        const propertyId = GM_getValue("propertyId", null);
        const hotelName = GM_getValue("hotelName", null); // Retrieve for context if needed
        
        if (!expediaHotelUrl || !propertyId) {
            await showAlertModal("Missing Data", "Expedia hotel URL or Property ID not found. Please run Step 1 automation first (Fetch Hotel Details from Expedia) on the Egetinnz Step 1 page.");
            console.error("Missing expediaHotelUrl or propertyId for Step 2 automation.");
            return;        }
        // Try to extract dates from the stored Expedia URL
        const extractedDates = extractDatesFromUrl(expediaHotelUrl);
        let checkInDateObj, checkOutDateObj, adults;
        
        if (extractedDates) {
            checkInDateObj = extractedDates.checkIn;
            checkOutDateObj = extractedDates.checkOut;
            console.log(`Successfully extracted dates from URL - Check-in: ${checkInDateObj.year}-${String(checkInDateObj.month).padStart(2, '0')}-${String(checkInDateObj.day).padStart(2, '0')}, Check-out: ${checkOutDateObj.year}-${String(checkOutDateObj.month).padStart(2, '0')}-${String(checkOutDateObj.day).padStart(2, '0')}`);

            // Still prompt for adults count since it's not in URL
            const defaultAdults = 2;
            adults = parseInt(await showPromptModal("Enter Number of Adults", `Enter Number of Adults (e.g., ${defaultAdults}):`, defaultAdults), 10);
            if (isNaN(adults)) {
                await showAlertModal("Invalid Input", "Invalid adult count provided for Step 2.");
                return;
            }
        } else {
            // Fallback to prompting for all dates if URL doesn't contain them
            console.warn("Could not extract dates from URL, prompting user for dates...");
            const defaultCheckInDay = 10;
            const defaultCheckInMonth = 6;
            const defaultCheckInYear = 2025;
            const defaultCheckOutDay = 11;
            const defaultCheckOutMonth = 6;
            const defaultCheckOutYear = 2025;
            const defaultAdults = 2;            const checkInDay = parseInt(await showPromptModal("Enter Check-in Day", `Enter Check-in Day (e.g., ${defaultCheckInDay}):`, defaultCheckInDay), 10);
            const checkInMonth = parseInt(await showPromptModal("Enter Check-in Month", `Enter Check-in Month (e.g., ${defaultCheckInMonth}):`, defaultCheckInMonth), 10);
            const checkInYear = parseInt(await showPromptModal("Enter Check-in Year", `Enter Check-in Year (e.g., ${defaultCheckInYear}):`, defaultCheckInYear), 10);
            const checkOutDay = parseInt(await showPromptModal("Enter Check-out Day", `Enter Check-out Day (e.g., ${defaultCheckOutDay}):`, defaultCheckOutDay), 10);
            const checkOutMonth = parseInt(await showPromptModal("Enter Check-out Month", `Enter Check-out Month (e.g., ${defaultCheckOutMonth}):`, defaultCheckOutMonth), 10);            const checkOutYear = parseInt(await showPromptModal("Enter Check-out Year", `Enter Check-out Year (e.g., ${defaultCheckOutYear}):`, defaultCheckOutYear), 10);
            adults = parseInt(await showPromptModal("Enter Number of Adults", `Enter Number of Adults (e.g., ${defaultAdults}):`, defaultAdults), 10);if (isNaN(checkInDay) || isNaN(checkInMonth) || isNaN(checkInYear) ||
                isNaN(checkOutDay) || isNaN(checkOutMonth) || isNaN(checkOutYear) || isNaN(adults)) {
                await showAlertModal("Invalid Input", "Invalid date or adult count provided for Step 2.");
                return;
            }

            checkInDateObj = { day: checkInDay, month: checkInMonth, year: checkInYear };
            checkOutDateObj = { day: checkOutDay, month: checkOutMonth, year: checkOutYear };
        }

        console.log(`Step 2: Fetching room data for Property ID: ${propertyId}, Check-in: ${checkInDateObj.year}-${String(checkInDateObj.month).padStart(2, '0')}-${String(checkInDateObj.day).padStart(2, '0')}, Check-out: ${checkOutDateObj.year}-${String(checkOutDateObj.month).padStart(2, '0')}-${String(checkOutDateObj.day).padStart(2, '0')}, Adults: ${adults}`);        try {
            // Fetch Room Data using GraphQL
            console.log("Fetching room data via GraphQL for Step 2...");
            const graphQLResponse = await fetchExpediaRoomDataGraphQL(propertyId, checkInDateObj, checkOutDateObj, adults);

            // Store the raw GraphQL response for Step 2 bed information extraction
            GM_setValue("rawResponse", JSON.stringify(graphQLResponse));
            console.log("✓ Stored raw GraphQL response for Step 2 bed information extraction");

            // Parse Room Details from GraphQL Response
            const parsedRooms = parseRoomDetailsFromGraphQLResponse(graphQLResponse);
            let selectedRoomDetails = null;            if (parsedRooms && parsedRooms.length > 0) {
                // Use paginated room selection for better UX with many rooms
                selectedRoomDetails = await selectRoomWithPagination(parsedRooms);} else {
                console.warn("No rooms parsed from GraphQL for Step 2, cannot select a room.");
                await showAlertModal("No Rooms Available", "No rooms could be parsed from Expedia for the given dates/occupancy. Step 2 details will need manual input.");
                GM_deleteValue("selectedRoomDetails");
            }

            // Retrieve the potentially newly set selectedRoomDetails
            const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
            const selectedRoom = selectedRoomJSON ? JSON.parse(selectedRoomJSON) : null;

            if (!selectedRoom) {
                console.warn("No selected room details available to fill Step 2 forms. User may need to fill manually.");
            } else {
                 console.log("Retrieved selectedRoomDetails for Step 2 filling:", selectedRoom);

                // 1. PropertyType (id="PropertyType") - Leave blank as per request
                const propertyTypeInput = document.querySelector('#PropertyType');
                if (propertyTypeInput) {
                    // propertyTypeInput.value = ''; // Explicitly set to blank if needed, or just do nothing
                    console.log("Field 'PropertyType' (id=\"PropertyType\") will be left blank as per instruction.");
                } else {
                    console.warn("Could not find 'PropertyType' input field (id=\"PropertyType\") to ensure it's blank.");
                }

                // Former RoomTypeID logic - ensure it's not interfering with PropertyType
                // const roomTypeSelect = document.querySelector('#RoomTypeID');
                // if (roomTypeSelect && selectedRoom.originalUnitId) {
                // console.log(`Attempted to set Room Type based on originalUnitId: ${selectedRoom.originalUnitId}. Manual selection likely needed.`);
                // } else if (roomTypeSelect) {
                // console.warn("Could not set Room Type: No roomTypeSelect or selectedRoom.originalUnitId missing.");
                // }                // 2. Accommodates (id="Accommodates") - Based on Sleeps (selectedRoom.occupancy)
                const accommodatesSelect = document.querySelector('#Accommodates');
                if (accommodatesSelect && selectedRoom.occupancy) {
                    const occupancyValue = parseInt(selectedRoom.occupancy, 10);
                    if (!isNaN(occupancyValue)) {
                        let matchedAccommodates = false;
                        for (let i = 0; i < accommodatesSelect.options.length; i++) {
                            if (parseInt(accommodatesSelect.options[i].value, 10) === occupancyValue) {
                                accommodatesSelect.value = accommodatesSelect.options[i].value;
                                console.log(`Set Accommodates to ${occupancyValue} based on selected room.`);
                                matchedAccommodates = true;
                                break;
                            }
                        }
                        if (!matchedAccommodates) {
                            console.warn(`Could not find an exact match for occupancy ${occupancyValue} in Accommodates dropdown.`);
                            // Attempt to set a default or alert user
                            if (accommodatesSelect.querySelector('option[value="2"]')) {
                                accommodatesSelect.value = '2';
                                console.log("Set Accommodates to default 2 (selected room occupancy not directly mappable or not found).");
                            } else if (accommodatesSelect.options.length > 0) {
                                accommodatesSelect.value = accommodatesSelect.options[0].value; // Fallback to first option
                                console.log(`Fell back to first option for Accommodates: ${accommodatesSelect.options[0].text}`);
                            }
                            await showAlertModal("Accommodates Setting Failed", `Could not automatically set 'Accommodates' to ${occupancyValue}. Please verify/set manually.`);
                        }
                    } else {
                        console.warn("Could not parse selectedRoom.occupancy as a number:", selectedRoom.occupancy);
                        await showAlertModal("Accommodates Setting Failed", "Could not automatically set 'Accommodates'. Please verify/set manually.");
                    }
                } else if (accommodatesSelect) {
                    console.warn("Could not set Accommodates: selectedRoom.occupancy is missing.");
                } else {
                    console.warn("Accommodates select field (id=\"Accommodates\") not found.");
                }                // 3. Currency (id="Currency") - Based on selectedRoom.currency
                const currencySelect = document.querySelector('#Currency');
                if (currencySelect && selectedRoom.currency) {
                    const currencyUpper = selectedRoom.currency.toUpperCase();
                    let currencyMatched = false;

                    // First, try to find by currency code in option values or text
                    for (let i = 0; i < currencySelect.options.length; i++) {
                        const optionText = currencySelect.options[i].text.toUpperCase();
                        if (optionText.includes(currencyUpper)) {
                            currencySelect.value = currencySelect.options[i].value;
                            console.log(`Set Currency to ${selectedRoom.currency} (matched option: ${currencySelect.options[i].text}, value: ${currencySelect.options[i].value}) based on selected room.`);
                            currencyMatched = true;
                            break;
                        }
                    }

                    if (!currencyMatched) {
                        console.warn(`Could not find a direct text match for currency '${currencyUpper}'. Attempting common currency mapping.`);
                        let currencyValueToSet = '300'; // Default to USD (Egetinnz value)
                        const currencyMappings = {
                            "USD": "300", "EUR": "100", "GBP": "200", "JPY": "480",
                            "CAD": "473", "AUD": "470", "CHF": "491", "SGD": "486"
                        };
                        if (currencyMappings[currencyUpper]) {
                            currencyValueToSet = currencyMappings[currencyUpper];
                        }

                        if (currencySelect.querySelector(`option[value="${currencyValueToSet}"]`)) {
                            currencySelect.value = currencyValueToSet;
                            console.log(`Set Currency to Egetinnz ID ${currencyValueToSet} (mapped from ${selectedRoom.currency}).`);
                            currencyMatched = true;
                        } else {
                            console.warn(`Could not set currency for ${selectedRoom.currency}. Mapped Egetinnz ID ${currencyValueToSet} not found in dropdown.`);
                        }
                    }

                    if (!currencyMatched) {
                        // Fallback to USD or first option
                        if (currencySelect.querySelector('option[value="300"]')) {
                            currencySelect.value = '300';
                            console.log("Fell back to USD (300) for Currency.");
                        } else if (currencySelect.options.length > 0) {
                            currencySelect.value = currencySelect.options[0].value;
                            console.log(`Fell back to first option for Currency: ${currencySelect.options[0].text}`);
                        }
                        await showAlertModal("Currency Setting Failed", `Could not automatically set Currency to ${selectedRoom.currency}. Please verify/set manually.`);
                    }
                } else if (currencySelect) {
                    console.warn("Could not set Currency: selectedRoom.currency is missing.");
                } else {
                    console.warn("Currency select field (id=\"Currency\") not found.");
                }                // 4. NightRate (id="NightRate") - Based on Total Price (selectedRoom.price)
                const nightRateInput = document.querySelector('#NightRate'); // Changed ID from NightlyRate
                if (nightRateInput && selectedRoom.price) {
                    const priceValue = parseFloat(selectedRoom.price);
                    if (!isNaN(priceValue)) {
                        nightRateInput.value = priceValue.toFixed(2);
                        console.log(`Set NightRate to ${priceValue.toFixed(2)} based on selected room.`);                    } else {
                        console.warn("Could not parse selectedRoom.price as a number:", selectedRoom.price);
                        await showAlertModal("NightRate Setting Failed", "Could not automatically set NightRate. Please verify/set manually.");
                    }                } else if (nightRateInput) {
                    console.warn("Could not set NightRate: selectedRoom.price is missing.");
                    await showAlertModal("NightRate Setting Failed", "Could not automatically set NightRate. Please verify/set manually.");
                } else {
                    console.warn("NightRate input field (id=\"NightRate\") not found.");
                }

                // 5. Room Name / Title (id="RoomName") - Remains as is
                const roomNameInput = document.querySelector('#RoomName');
                if (roomNameInput && selectedRoom.name) {
                    roomNameInput.value = selectedRoom.name;
                    console.log(`Set Room Name/Title to: ${selectedRoom.name}`);
                } else if (roomNameInput) {
                    console.warn("Could not set Room Name/Title: selectedRoom.name is missing.");
                } else {
                    console.warn("RoomName input field (id=\"RoomName\") not found.");
                }            }

            await showAlertModal("Step 2 Automation Complete", "Step 2 form automation attempted. Please review all fields carefully and complete any missing information.");        } catch (error) {
            console.error("Error during Step 2 automation:", error);
            await showAlertModal("Step 2 Automation Error", "An error occurred during Step 2 automation. Please check the console for details.");
            // Optionally clear selectedRoomDetails if an error occurs during filling
            // GM_deleteValue("selectedRoomDetails");
        }    }    // Function for Step 3 automation with enhanced Nominatim integration
    async function automateStep3Forms() {
        console.log("Attempting to automate Egetinnz Step 3 forms with address and location data...");

        const expediaHotelUrl = GM_getValue("expediaHotelUrl", null);
        const propertyId = GM_getValue("propertyId", null);
        const hotelName = GM_getValue("hotelName", null);        if (!expediaHotelUrl || !propertyId) {
            await showAlertModal("Missing Data", "Expedia hotel URL or Property ID not found. Please run Step 1 automation first (Fetch Hotel Details from Expedia) on the Egetinnz Step 1 page.");
            console.error("Missing expediaHotelUrl or propertyId for Step 3 automation.");
            return;
        }

        try {
            console.log("Starting Step 3 location form automation...");

            // 1. Get stored address components and enhance with fresh geocoding
            const storedAddressComponents = GM_getValue("addressComponents", null);
            let addressComps = null;
            let geocodeData = null;

            if (storedAddressComponents) {
                addressComps = JSON.parse(storedAddressComponents);
                console.log("Using stored address components for Step 3:", addressComps);

                // Create a complete address query for enhanced geocoding
                let addressQuery = [];
                if (addressComps.houseNumber && addressComps.houseNumber !== hotelName) {
                    addressQuery.push(addressComps.houseNumber);
                }
                if (addressComps.addressLine1) addressQuery.push(addressComps.addressLine1);
                if (addressComps.city) addressQuery.push(addressComps.city);
                if (addressComps.stateProvince) addressQuery.push(addressComps.stateProvince);
                if (addressComps.country) addressQuery.push(addressComps.country);

                // If we have hotel name but no house number, or house number is hotel name, use hotel name in query
                if (hotelName && (!addressComps.houseNumber || addressComps.houseNumber === hotelName)) {
                    addressQuery.unshift(hotelName);
                }

                const fullAddressQuery = addressQuery.join(', ');
                console.log(`Performing enhanced geocoding with query: "${fullAddressQuery}"`);

                try {
                    geocodeData = await fetchGeocodingData(fullAddressQuery);
                    if (geocodeData) {
                        console.log("Enhanced geocoding data received:", geocodeData);

                        // Update address components with more accurate data if available
                        if (geocodeData.address) {
                            const geo = geocodeData.address;

                            // Enhance country information
                            if (geo.country && (!addressComps.country || addressComps.country.trim() === '')) {
                                addressComps.country = geo.country.trim();
                                console.log(`Enhanced country to: ${addressComps.country}`);
                            }

                            // Enhance state/province information
                            if (geo.state && (!addressComps.stateProvince || addressComps.stateProvince.trim() === '')) {
                                addressComps.stateProvince = geo.state.trim();
                                console.log(`Enhanced state/province to: ${addressComps.stateProvince}`);
                            } else if (geo['ISO3166-2-lvl4'] && (!addressComps.stateProvince || addressComps.stateProvince.trim() === '')) {
                                addressComps.stateProvince = geo['ISO3166-2-lvl4'].trim();
                                console.log(`Enhanced state/province to: ${addressComps.stateProvince} (from ISO code)`);
                            }

                            // Enhance city information
                            const citySource = geo.city || geo.town || geo.village || geo.county || geo.city_district;
                            if (citySource && (!addressComps.city || addressComps.city.trim() === '')) {
                                addressComps.city = citySource.trim();
                                console.log(`Enhanced city to: ${addressComps.city}`);
                            }

                            // Enhance postal code
                            if (geo.postcode && (!addressComps.postalCode || addressComps.postalCode.trim() === '')) {
                                addressComps.postalCode = geo.postcode.trim();
                                console.log(`Enhanced postal code to: ${addressComps.postalCode}`);
                            }
                        }
                    } else {
                        console.warn("No enhanced geocoding data received for Step 3");
                    }
                } catch (error) {
                    console.warn("Enhanced geocoding failed for Step 3:", error.message);
                }
            } else {
                console.warn("No stored address components found. Address fields will need manual input.");
                // Try to geocode using just the hotel name if no stored components
                if (hotelName) {
                    try {
                        geocodeData = await fetchGeocodingData(hotelName);
                        if (geocodeData && geocodeData.address) {
                            const geo = geocodeData.address;
                            addressComps = {
                                houseNumber: hotelName,
                                addressLine1: geo.road || '',
                                addressLine2: '',
                                city: geo.city || geo.town || geo.village || '',
                                stateProvince: geo.state || geo['ISO3166-2-lvl4'] || '',
                                postalCode: geo.postcode || '',
                                country: geo.country || ''
                            };
                            console.log("Created address components from hotel name geocoding:", addressComps);
                        }
                    } catch (error) {
                        console.warn("Hotel name geocoding failed:", error.message);
                    }
                }
            }

            // 2. Fill all address fields with enhanced data
            if (addressComps) {
                // Property_HouseNumber
                const houseNumberField = document.querySelector('#Property_HouseNumber');
                if (houseNumberField && addressComps.houseNumber) {
                    houseNumberField.value = addressComps.houseNumber;
                    console.log(`Set Property_HouseNumber to: ${addressComps.houseNumber}`);
                }

                // Property_AddressLine1
                const addressLine1Field = document.querySelector('#Property_AddressLine1');
                if (addressLine1Field && addressComps.addressLine1) {
                    addressLine1Field.value = addressComps.addressLine1;
                    console.log(`Set Property_AddressLine1 to: ${addressComps.addressLine1}`);
                }

                // Property_AddressLine2
                const addressLine2Field = document.querySelector('#Property_AddressLine2');
                if (addressLine2Field && addressComps.addressLine2) {
                    addressLine2Field.value = addressComps.addressLine2;
                    console.log(`Set Property_AddressLine2 to: ${addressComps.addressLine2}`);
                }

                // Property_City
                const cityField = document.querySelector('#Property_City');
                if (cityField && addressComps.city) {
                    cityField.value = addressComps.city;
                    console.log(`Set Property_City to: ${addressComps.city}`);
                }

                // Property_StateProvince
                const stateField = document.querySelector('#Property_StateProvince');
                if (stateField && addressComps.stateProvince) {
                    stateField.value = addressComps.stateProvince;
                    console.log(`Set Property_StateProvince to: ${addressComps.stateProvince}`);
                }

                // Property_PostalCode
                const postalCodeField = document.querySelector('#Property_PostalCode');
                if (postalCodeField && addressComps.postalCode) {
                    postalCodeField.value = addressComps.postalCode;
                    console.log(`Set Property_PostalCode to: ${addressComps.postalCode}`);
                }

                // Property_CountryID - Enhanced country mapping
                const countrySelect = document.querySelector('#Property_CountryID');
                if (countrySelect && addressComps.country) {
                    let countryMatched = false;
                    const countryName = addressComps.country.toLowerCase();

                    // Enhanced country matching with common variations
                    const countryMappings = {
                        'usa': 'united states',
                        'us': 'united states',
                        'u.s.a.': 'united states',
                        'united states of america': 'united states',
                        'uk': 'united kingdom',
                        'u.k.': 'united kingdom',
                        'england': 'united kingdom',
                        'britain': 'united kingdom',
                        'uae': 'united arab emirates'
                    };

                    const mappedCountry = countryMappings[countryName] || countryName;

                    for (let i = 0; i < countrySelect.options.length; i++) {
                        const optionText = countrySelect.options[i].text.toLowerCase();

                        if (optionText.includes(mappedCountry) || optionText.includes(countryName)) {
                            countrySelect.value = countrySelect.options[i].value;
                            console.log(`Set Property_CountryID to: ${addressComps.country} (value: ${countrySelect.options[i].value})`);
                            countryMatched = true;
                            break;
                        }
                    }
                    if (!countryMatched) {
                        console.warn(`Could not find matching country option for: ${addressComps.country}`);
                    }
                }
            }

            // NOTE: Filling Property_ListingName is now handled by automateStep4Forms
            // This section has been removed to avoid conflicts.

            // 4. Fill latitude and longitude from geocoding data
            if (geocodeData && geocodeData.lat && geocodeData.lon) {
                const latField = document.querySelector('#Property_Latitude');
                const lonField = document.querySelector('#Property_Longitude');

                if (latField) {
                    latField.value = parseFloat(geocodeData.lat).toFixed(10);
                    console.log(`Set Property_Latitude to: ${latField.value}`);
                }

                if (lonField) {
                    lonField.value = parseFloat(geocodeData.lon).toFixed(10);
                    console.log(`Set Property_Longitude to: ${lonField.value}`);
                }            } else {
                console.warn("No latitude/longitude data available from geocoding");
            }            // 5. Enhanced intelligent place matching using form field labels and GraphQL data
            console.log("Implementing intelligent place matching with form field labels...");
            const rawResponse = JSON.parse(GM_getValue("rawResponse", "null"));
            const intelligentPlaces = await getIntelligentPlaceMatches(geocodeData, addressComps, rawResponse);
            
            // Fill places 0-9 with intelligent matching based on actual form labels
            for (let i = 0; i <= 9; i++) {
                const placeField = document.querySelector(`#Places_${i}__Place`);
                const distanceField = document.querySelector(`#Places_${i}__Distance`);
                const unitField = document.querySelector(`#Places_${i}__UnitOfMeasure`);
                const walkingTimeField = document.querySelector(`#Places_${i}__MinutesByWalking`);
                const drivingTimeField = document.querySelector(`#Places_${i}__MinutesByDriving`);

                if (placeField && intelligentPlaces[i]) {
                    const matchedPlace = intelligentPlaces[i];

                    placeField.value = matchedPlace.name;
                    if (distanceField && matchedPlace.distance) {
                        distanceField.value = matchedPlace.distance;
                    }
                    if (unitField && matchedPlace.unit) {
                        unitField.value = matchedPlace.unit;
                    }
                      // Only populate walk/drive fields based on transport mode from source data
                    if (matchedPlace.originalTransportMode) {
                        if (matchedPlace.originalTransportMode === 'walk' && walkingTimeField && matchedPlace.walkingTime) {
                            walkingTimeField.value = matchedPlace.walkingTime;
                            console.log(`  → Set walking time: ${matchedPlace.walkingTime} min (based on "${matchedPlace.originalTransportMode}" data)`);
                            // Clear driving field when we have walk data
                            if (drivingTimeField) {
                                drivingTimeField.value = '';
                            }
                        } else if (matchedPlace.originalTransportMode === 'drive' && drivingTimeField && matchedPlace.drivingTime) {
                            drivingTimeField.value = matchedPlace.drivingTime;
                            console.log(`  → Set driving time: ${matchedPlace.drivingTime} min (based on "${matchedPlace.originalTransportMode}" data)`);
                            // Clear walking field when we have drive data
                            if (walkingTimeField) {
                                walkingTimeField.value = '';
                            }
                        } else {
                            console.log(`  → Skipping time population - transport mode "${matchedPlace.originalTransportMode}" doesn't match field type`);
                        }
                    } else {
                        // Fallback: if no specific transport mode, populate both fields as before
                        if (walkingTimeField && matchedPlace.walkingTime) {
                            walkingTimeField.value = matchedPlace.walkingTime;
                        }
                        if (drivingTimeField && matchedPlace.drivingTime) {
                            drivingTimeField.value = matchedPlace.drivingTime;
                        }
                        console.log(`  → Populated both walk/drive times (no specific transport mode data)`);
                    }

                    console.log(`Set Places_${i} (${matchedPlace.expectedType}) to: ${matchedPlace.name} (${matchedPlace.distance}${matchedPlace.unit})${matchedPlace.source ? ' - ' + matchedPlace.source : ''}`);                } else if (placeField) {
                    console.log(`Places_${i} field left empty (no suitable match or score below 50% threshold)`);
                }
            }            // 6. LLM-powered attraction checkbox automation
            console.log("Implementing LLM-powered attraction detection for checkboxes...");
            const attractionResult = await automateAttractionCheckboxes(geocodeData, addressComps, hotelName, propertyId, expediaHotelUrl);              let attractionMessage = "";
            if (attractionResult.success) {
                if (attractionResult.method === 'Webpage-Content-LLM') {
                    attractionMessage = ` LLM-powered attraction detection checked ${attractionResult.checkedCount} relevant attractions using AI analysis of the actual Expedia TAAP webpage content.`;
                } else if (attractionResult.method === 'LLM') {
                    attractionMessage = ` LLM-powered attraction detection checked ${attractionResult.checkedCount} relevant attractions using AI analysis.`;
                } else {
                    attractionMessage = ` Attraction detection checked ${attractionResult.checkedCount} attractions using heuristic analysis (configure Together.ai API key for AI-powered detection).`;
                }
            } else {                if (attractionResult.error === "NO_API_KEY") {
                    attractionMessage = " Attraction detection used basic heuristics (configure Together.ai API key via Tampermonkey menu for AI-powered detection).";
                } else {
                    attractionMessage = " Attraction detection encountered an issue - please verify attraction checkboxes manually.";                }            }

            // 7. LLM-powered establishment checkbox automation
            console.log("Implementing LLM-powered business and local establishment detection for checkboxes...");
            const establishmentResult = await automateEstablishmentCheckboxes(geocodeData, addressComps, hotelName, propertyId, expediaHotelUrl);
            let establishmentMessage = "";
            if (establishmentResult.success) {
                if (establishmentResult.method === 'Webpage-Content-LLM') {
                    establishmentMessage = ` LLM-powered business establishment detection checked ${establishmentResult.checkedCount} relevant establishments using AI analysis of the actual Expedia TAAP webpage content.`;
                } else if (establishmentResult.method === 'LLM') {
                    establishmentMessage = ` LLM-powered business establishment detection checked ${establishmentResult.checkedCount} relevant establishments using AI analysis.`;
                } else {
                    establishmentMessage = ` Business establishment detection checked ${establishmentResult.checkedCount} establishments using heuristic analysis.`;
                }
            } else {
                if (establishmentResult.error === "NO_API_KEY") {
                    establishmentMessage = " Business establishment detection used basic heuristics.";
                } else {
                    establishmentMessage = " Business establishment detection encountered an issue - please verify establishment checkboxes manually.";
                }
            }

            // 8. LLM-powered surrounding type detection for Property_SurroundingTypeID
            console.log("Implementing LLM-powered surrounding type detection...");
            const surroundingResult = await automateSurroundingType(geocodeData, addressComps, hotelName, propertyId, expediaHotelUrl);
            let surroundingMessage = "";
            if (surroundingResult.success) {
                if (surroundingResult.selectedType) {
                    surroundingMessage = ` Surrounding Type set to "${surroundingResult.selectedType}" using ${surroundingResult.method} detection.`;
                } else {
                    surroundingMessage = " No appropriate Surrounding Type detected - please set manually.";
                }
            } else {
                surroundingMessage = " Surrounding Type detection encountered an issue - please set manually.";
            }            console.log("Step 3 form automation completed with address, location data, nearby places, LLM-powered attraction detection, business establishments, and surrounding type.");
            await showAlertModal("Step 3 Automation Complete", "Step 3 location form automation completed. Address, location, and nearby places fields have been filled using real Expedia data where available. Note: Places and Activities Nearby fields are only populated when matching confidence reaches 50% threshold - some fields may be intentionally left empty for manual review." + attractionMessage + establishmentMessage + surroundingMessage + " Please review all fields and submit the form.");        } catch (error) {
            console.error("Error during Step 3 automation:", error);
            await showAlertModal("Step 3 Automation Error", "An error occurred during Step 3 automation. Please check the console for details.");
        }
    }
      // *** NEW FUNCTION FOR STEP 4 ***
    async function automateStep4Forms() {
        console.log("Attempting to automate Egetinnz Step 4 forms (Listing Name & Property Description)...");

        // 1. Retrieve necessary data from GM_storage
        const hotelName = GM_getValue("hotelName", null);
        const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
        const expediaHotelUrl = GM_getValue("expediaHotelUrl", null);        if (!hotelName) {
            await showAlertModal("Missing Hotel Name", "Hotel Name not found. Please run Step 1 automation first.");
            console.error("Missing hotelName for Step 4 automation.");
            return;
        }        if (!selectedRoomJSON) {
            await showAlertModal("Missing Room Details", "Selected Room details not found. Please run Step 2 automation and select a room first.");
            console.error("Missing selectedRoomDetails for Step 4 automation.");
            return;
        }        if (!expediaHotelUrl) {
            await showAlertModal("Missing Expedia URL", "Expedia Hotel URL not found. Please run Step 1 automation first.");
            console.error("Missing expediaHotelUrl for Step 4 automation.");
            return;
        }

        const selectedRoom = JSON.parse(selectedRoomJSON);
        let roomName = selectedRoom.name;        if (!roomName) {
            await showAlertModal("Missing Room Name", "Room Name is missing from the stored details. Please re-run Step 2.");
            console.error("Room name is missing in selectedRoomDetails object.");
            return;
        }// Clean the room name by removing discount text like "(10% off)", "(20% off)", "(Member Price 40% off)", etc.
        roomName = roomName.replace(/\s*\([^)]*\d+%\s*off\)\s*/gi, '').trim();
        console.log(`Cleaned room name: "${roomName}"`);

        // 2. Construct the listing name string in the format: ${roomName} - ${hotelName}
        const listingName = `${roomName} - ${hotelName}`;
        console.log(`Constructed listing name: "${listingName}"`);

        // 3. Find the target input fields
        const listingNameInput = document.querySelector('#Property_ListingName');
        const propertyDescriptionInput = document.querySelector('#Property_Description');

        // 4. Fill the Property_ListingName field
        if (listingNameInput) {
            listingNameInput.value = listingName;
            console.log(`Successfully filled "Property_ListingName" with: ${listingName}`);        } else {
            console.error("Could not find the 'Property_ListingName' input field on the page.");
            await showAlertModal("Input Field Not Found", "Error: Could not find the Listing Name input field (id='Property_ListingName').");
            return;
        }// 5. Extract and fill Property_Description
        if (propertyDescriptionInput) {
            console.log("Extracting property description from Expedia content...");
            try {
                const propertyDescription = await extractPropertyDescription(expediaHotelUrl, hotelName, roomName);
                if (propertyDescription) {
                    propertyDescriptionInput.value = propertyDescription;
                    console.log(`Successfully filled "Property_Description" with extracted content (${propertyDescription.length} characters)`);
                } else {
                    console.warn("Could not extract property description from Expedia content.");
                }
            } catch (error) {
                console.error("Error extracting property description:", error);
            }
        } else {
            console.warn("Could not find the 'Property_Description' textarea field on the page.");
        }        // 6. LLM-powered SituatedIn type detection for Property_SituatedInID
        console.log("Implementing LLM-powered Situated In detection...");
        const situatedInResult = await automateSituatedInType(hotelName, roomName, expediaHotelUrl);
        let situatedInMessage = "";
        if (situatedInResult.success) {
            if (situatedInResult.selectedType) {
                situatedInMessage = ` Situated In set to "${situatedInResult.selectedType}" using ${situatedInResult.method} detection.`;
            } else {
                situatedInMessage = " No appropriate Situated In type detected - please set manually.";
            }
        } else {
            situatedInMessage = " Situated In detection encountered an issue - please set manually.";
        }        // 7. Automate Property_LivingArea and Property_LivingAreaID fields
        console.log("Implementing living area automation...");
        const livingAreaResult = await automateLivingAreaFields(selectedRoom, hotelName, roomName, expediaHotelUrl);
        let livingAreaMessage = "";
        if (livingAreaResult.success) {
            livingAreaMessage = ` Living Area set to "${livingAreaResult.area} ${livingAreaResult.unit}" using ${livingAreaResult.method} detection.`;
        } else {
            livingAreaMessage = " Living Area could not be determined automatically - please set manually.";
        }        // 8. Automatically check the Property_IsGovIdRequired checkbox
        const govIdRequiredCheckbox = document.querySelector('#Property_IsGovIdRequired');
        if (govIdRequiredCheckbox) {
            govIdRequiredCheckbox.checked = true;
            console.log("Successfully checked the 'Property_IsGovIdRequired' checkbox.");
        } else {
            console.warn("Could not find the 'Property_IsGovIdRequired' checkbox on the page.");
        }

        // 8.5. Automatically set Smoking, WheelChair, and Pets dropdowns
        console.log("Setting Smoking, WheelChair, and Pets dropdown selections...");

        // Set Smoking to "Non Smoking" (value="109")
        const smokingSelect = document.querySelector('#Smoking');
        if (smokingSelect) {
            smokingSelect.value = "109"; // 109 = "Non Smoking"
            console.log("✓ Set Smoking dropdown to 'Non Smoking' (value: 109)");
        } else {
            console.warn("Could not find the 'Smoking' dropdown on the page.");
        }

        // Set WheelChair to "Wheelchair Accessible" (value="110")
        const wheelchairSelect = document.querySelector('#WheelChair');
        if (wheelchairSelect) {
            wheelchairSelect.value = "110"; // 110 = "Wheelchair Accessible"
            console.log("✓ Set WheelChair dropdown to 'Wheelchair Accessible' (value: 110)");
        } else {
            console.warn("Could not find the 'WheelChair' dropdown on the page.");
        }

        // Set Pets to "Pets Allowed" (value="112")
        const petsSelect = document.querySelector('#Pets');
        if (petsSelect) {
            petsSelect.value = "112"; // 112 = "Pets Allowed"
            console.log("✓ Set Pets dropdown to 'Pets Allowed' (value: 112)");
        } else {
            console.warn("Could not find the 'Pets' dropdown on the page.");
        }        // 9. Set Property_Accommodates based on occupancy from selectedRoom
        console.log("Setting Property_Accommodates based on room occupancy...");
        const propertyAccommodatesSelect = document.querySelector('#Property_Accommodates');
        let accommodatesMessage = "";
        if (propertyAccommodatesSelect && selectedRoom.occupancy) {
            const occupancyValue = parseInt(selectedRoom.occupancy, 10);
            if (!isNaN(occupancyValue)) {
                let matchedAccommodates = false;
                for (let i = 0; i < propertyAccommodatesSelect.options.length; i++) {
                    if (parseInt(propertyAccommodatesSelect.options[i].value, 10) === occupancyValue) {
                        propertyAccommodatesSelect.value = propertyAccommodatesSelect.options[i].value;
                        console.log(`Set Property_Accommodates to ${occupancyValue} based on selected room occupancy.`);
                        accommodatesMessage = ` Property Accommodates set to ${occupancyValue} guests.`;
                        matchedAccommodates = true;
                        break;
                    }
                }
                if (!matchedAccommodates) {
                    console.warn(`Could not find an exact match for occupancy ${occupancyValue} in Property_Accommodates dropdown.`);
                    // Attempt to set a default or fallback
                    if (propertyAccommodatesSelect.querySelector('option[value="2"]')) {
                        propertyAccommodatesSelect.value = '2';
                        console.log("Set Property_Accommodates to default 2 (selected room occupancy not directly mappable).");
                        accommodatesMessage = ` Property Accommodates set to default 2 guests (original occupancy ${occupancyValue} not found in options).`;
                    } else if (propertyAccommodatesSelect.options.length > 0) {
                        propertyAccommodatesSelect.value = propertyAccommodatesSelect.options[0].value;
                        console.log(`Fell back to first option for Property_Accommodates: ${propertyAccommodatesSelect.options[0].text}`);
                        accommodatesMessage = ` Property Accommodates set to first available option (original occupancy ${occupancyValue} not found).`;
                    }
                }
            } else {
                console.warn("Could not parse selectedRoom.occupancy as a number:", selectedRoom.occupancy);
                accommodatesMessage = " Property Accommodates could not be set automatically - please set manually.";
            }
        } else if (propertyAccommodatesSelect) {
            console.warn("Could not set Property_Accommodates: selectedRoom.occupancy is missing.");
            accommodatesMessage = " Property Accommodates could not be set automatically - occupancy data missing.";
        } else {
            console.warn("Property_Accommodates select field not found on the page.");
            accommodatesMessage = " Property Accommodates field not found - may not be available on this step.";
        }        // 10. Set Property_CheckinTime and Property_CheckoutTime based on location response data
        console.log("Setting Property_CheckinTime and Property_CheckoutTime based on location response data...");
        const checkInTimeResult = await automateCheckInCheckOutTimes(expediaHotelUrl);
        let checkInOutMessage = "";
        if (checkInTimeResult.success) {
            checkInOutMessage = ` Check-in time set to ${checkInTimeResult.checkInTime}, Check-out time set to ${checkInTimeResult.checkOutTime}.`;
        } else {
            checkInOutMessage = " Check-in/Check-out times could not be set automatically - please set manually.";
        }        // 11. Configure bedroom modal automation
        console.log("Setting up bedroom modal automation...");
        const bedroomModalResult = await autoConfigureBedroomModal(selectedRoom, roomName, hotelName);
        let bedroomMessage = "";
        if (bedroomModalResult.success) {
            bedroomMessage = ` Bedroom modal prepared using ${bedroomModalResult.method} detection.`;
        } else {
            bedroomMessage = " Bedroom modal automation encountered an issue - manual configuration needed.";
        }        // 12. Configure bathroom modal automation
        console.log("Setting up bathroom modal automation...");
        const bathroomModalResult = await autoConfigureBathroomModal(selectedRoom, roomName, hotelName);
        let bathroomMessage = "";
        if (bathroomModalResult.success) {
            bathroomMessage = ` Bathroom modal prepared using ${bathroomModalResult.method} detection.`;
        } else {
            bathroomMessage = " Bathroom modal automation encountered an issue - manual configuration needed.";
        }        // 13. Automate outdoor activities checkboxes
        console.log("Setting up outdoor activities automation...");
        const outdoorActivitiesResult = await automateOutdoorActivitiesCheckboxes(hotelName, expediaHotelUrl);
        let outdoorMessage = "";
        if (outdoorActivitiesResult.success) {
            outdoorMessage = ` Outdoor activities automated: ${outdoorActivitiesResult.checkedCount} activities detected using ${outdoorActivitiesResult.method}.`;
        } else {
            outdoorMessage = " Outdoor activities automation encountered an issue - manual configuration needed.";
        }        // 14. Automate kitchen details checkboxes
        console.log("Setting up kitchen details automation...");
        const kitchenDetailsResult = await automateKitchenDetailsCheckboxes(hotelName, expediaHotelUrl);
        let kitchenMessage = "";
        if (kitchenDetailsResult.success) {
            kitchenMessage = ` Kitchen details automated: ${kitchenDetailsResult.checkedCount} amenities detected using ${kitchenDetailsResult.method}.`;
        } else {
            kitchenMessage = " Kitchen details automation encountered an issue - manual configuration needed.";
        }

        // 15. Automate common amenities checkboxes
        console.log("Setting up common amenities automation...");
        const commonAmenitiesResult = await automateCommonAmenitiesCheckboxes(hotelName, expediaHotelUrl);
        let commonAmenitiesMessage = "";
        if (commonAmenitiesResult.success) {
            commonAmenitiesMessage = ` Common amenities automated: ${commonAmenitiesResult.checkedCount} amenities detected using ${commonAmenitiesResult.method}.`;
        } else {
            commonAmenitiesMessage = " Common amenities automation encountered an issue - manual configuration needed.";
        }        // 16. Automate additional amenities checkboxes
        console.log("Setting up additional amenities automation...");
        const additionalAmenitiesResult = await automateAdditionalAmenitiesCheckboxes(hotelName, expediaHotelUrl);
        let additionalAmenitiesMessage = "";
        if (additionalAmenitiesResult.success) {
            additionalAmenitiesMessage = ` Additional amenities automated: ${additionalAmenitiesResult.checkedCount} amenities detected using ${additionalAmenitiesResult.method}.`;
        } else {
            additionalAmenitiesMessage = " Additional amenities automation encountered an issue - manual configuration needed.";
        }        // 17. Automate pool and spa facilities checkboxes
        console.log("Setting up pool and spa facilities automation...");
        const poolSpaResult = await automatePoolSpaFacilitiesCheckboxes(hotelName, expediaHotelUrl);
        let poolSpaMessage = "";
        if (poolSpaResult.success) {
            poolSpaMessage = ` Pool & Spa facilities automated: ${poolSpaResult.checkedCount} facilities detected using ${poolSpaResult.method}.`;
        } else {
            poolSpaMessage = " Pool & Spa facilities automation encountered an issue - manual configuration needed.";
        }        // 18. Automate safety checklist checkboxes
        console.log("Setting up safety checklist automation...");
        const safetyChecklistResult = await automateSafetyChecklistCheckboxes(hotelName, expediaHotelUrl);
        let safetyChecklistMessage = "";
        if (safetyChecklistResult.success) {
            safetyChecklistMessage = ` Safety checklist automated: ${safetyChecklistResult.checkedCount} safety features detected using ${safetyChecklistResult.method}.`;
        } else {
            safetyChecklistMessage = " Safety checklist automation encountered an issue - manual configuration needed.";
        }

        // 19. Automate other services checkboxes
        console.log("Setting up other services automation...");
        const otherServicesResult = await automateOtherServicesCheckboxes(hotelName, expediaHotelUrl);
        let otherServicesMessage = "";
        if (otherServicesResult.success) {
            otherServicesMessage = ` Other services automated: ${otherServicesResult.checkedCount} services detected using ${otherServicesResult.method}.`;
        } else {
            otherServicesMessage = " Other services automation encountered an issue - manual configuration needed.";
        }

        await showAlertModal("Step 4 Configuration Complete", `Step 4: Listing Name, Property Description, Situated In${situatedInMessage}, Living Area${livingAreaMessage}, Gov ID Required checkbox, Smoking/WheelChair/Pets dropdowns (set to Non Smoking, Wheelchair Accessible, Pets Allowed), Property Accommodates${accommodatesMessage}, Check-in/Check-out times${checkInOutMessage}, Bedroom modal${bedroomMessage}, Bathroom modal${bathroomMessage}, Outdoor Activities${outdoorMessage}, Kitchen Details${kitchenMessage}, Common Amenities${commonAmenitiesMessage}, Additional Amenities${additionalAmenitiesMessage}, Pool & Spa Facilities${poolSpaMessage}, Safety Checklist${safetyChecklistMessage}, and Other Services${otherServicesMessage} have been configured. Please review and complete the rest of the form.`);
    }

    // Helper function to get day name from day of week number
    function getDayName(dayOfWeek) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek];
    }    // Step 5: Dynamic Pricing Automation Function - Performance Optimized
    async function automateStep5PricingForms() {
        console.log("🎯 Starting Step 5: Dynamic Pricing Automation with concurrent batch processing...");

        try {
            // 1. Validate required data from previous steps
            const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
            if (!selectedRoomJSON) {
                await showAlertModal("Missing Room Data", "⚠️ No room data found from Step 2. Please complete Step 2 room selection first.");
                return;
            }

            let selectedRoom;
            try {
                selectedRoom = JSON.parse(selectedRoomJSON);
            } catch (error) {
                console.error("Error parsing selectedRoomDetails:", error);
                await showAlertModal("Invalid Room Data", "⚠️ Invalid room data from Step 2. Please re-run Step 2 room selection.");
                return;
            }

            const propertyId = GM_getValue("propertyId", null);
            if (!propertyId) {
                await showAlertModal("Missing Property ID", "⚠️ No property ID found. Please complete Step 1 first.");
                return;
            }

            console.log(`📊 Using room: ${selectedRoom.name} (originalUnitId: ${selectedRoom.originalUnitId})`);

            // 2. Get month selection from user using button-based modal
            const monthSelection = await showMonthSelectionModal();
            
            if (monthSelection.type === 'cancel') {
                console.log("User cancelled month selection");
                return;
            }

            const selectedMonth = monthSelection.monthNumber;
            const selectedMonthName = monthSelection.monthName;
            const targetYear = monthSelection.targetYear;

            console.log(`📅 User selected: ${selectedMonthName} ${targetYear} (month ${selectedMonth})`);
            console.log(`📅 Analyzing pricing for ${targetYear}-${String(selectedMonth).padStart(2, '0')}`);

            // 4. Get days in the selected month
            const daysInMonth = new Date(targetYear, selectedMonth, 0).getDate();
            console.log(`📊 Found ${daysInMonth} days in ${targetYear}-${String(selectedMonth).padStart(2, '0')}`);

            // 5. Initialize pricing analysis variables
            let highestPrice = 0;
            const weekdayPrices = [];
            const weekendPrices = [];
            let successfulRequests = 0;
            let failedRequests = 0;

            // 6. Pre-calculate all date information for performance
            const dayPairs = [];
            const weekendDaysSet = new Set([0, 6]); // Sunday and Saturday
            
            for (let day = 1; day < daysInMonth; day++) {
                const checkInDay = day;
                const checkOutDay = day + 1;
                
                // Pre-calculate day of week to avoid repeated Date object creation
                const checkInDayOfWeek = new Date(targetYear, selectedMonth - 1, checkInDay).getDay();
                const checkOutDayOfWeek = new Date(targetYear, selectedMonth - 1, checkOutDay).getDay();
                const isWeekendPair = weekendDaysSet.has(checkInDayOfWeek) || weekendDaysSet.has(checkOutDayOfWeek);
                
                dayPairs.push({
                    checkInDay,
                    checkOutDay,
                    checkInDayOfWeek,
                    checkOutDayOfWeek,
                    isWeekendPair,
                    checkInDateObj: { day: checkInDay, month: selectedMonth, year: targetYear },
                    checkOutDateObj: { day: checkOutDay, month: selectedMonth, year: targetYear }
                });
            }            // 7. Process ALL requests concurrently for maximum speed
            console.log(`🚀 Processing ALL ${dayPairs.length} day pairs concurrently (MAXIMUM SPEED MODE)`);
            console.log(`⚡ Warning: This will make ${dayPairs.length} simultaneous API requests`);

            // Create all promises at once
            const allPromises = dayPairs.map(async (dayPair) => {
                try {
                    const pricingResponse = await fetchExpediaRoomDataGraphQL(
                        propertyId, 
                        dayPair.checkInDateObj, 
                        dayPair.checkOutDateObj, 
                        2 // Default to 2 adults for pricing analysis
                    );

                    const roomsData = parseRoomDetailsFromGraphQLResponse(pricingResponse);
                    // Use the same matching logic as Step2 - match by unitId or originalUnitId
                    const matchingRoom = roomsData.find(room => 
                        room.unitId === selectedRoom.unitId || 
                        room.unitId === selectedRoom.originalUnitId ||
                        (room.originalUnitId && (room.originalUnitId === selectedRoom.unitId || room.originalUnitId === selectedRoom.originalUnitId))
                    );

                    if (matchingRoom && matchingRoom.price && !isNaN(parseFloat(matchingRoom.price))) {
                        const roomPrice = parseFloat(matchingRoom.price);
                        
                        return {
                            success: true,
                            dayPair,
                            roomPrice,
                            matchingRoom
                        };
                    } else {
                        return {
                            success: false,
                            dayPair,
                            error: 'No pricing data found'
                        };
                    }
                } catch (error) {
                    return {
                        success: false,
                        dayPair,
                        error: error.message
                    };
                }
            });

            // Wait for ALL requests to complete simultaneously
            console.log(`⏱️ Starting ${allPromises.length} concurrent API requests...`);
            const startTime = performance.now();
            
            const allResults = await Promise.all(allPromises);
            
            const endTime = performance.now();
            const totalTime = (endTime - startTime) / 1000;
            console.log(`🏁 All ${allPromises.length} requests completed in ${totalTime.toFixed(2)} seconds`);
            
            // Process all results
            allResults.forEach(result => {
                if (result.success) {
                    const { dayPair, roomPrice } = result;
                    console.log(`💰 Found price for day ${dayPair.checkInDay}/${dayPair.checkOutDay}: $${roomPrice}`);
                    
                    if (dayPair.isWeekendPair) {
                        weekendPrices.push(roomPrice);
                        console.log(`📅 Weekend price for day ${dayPair.checkInDay}/${dayPair.checkOutDay}: $${roomPrice} (${getDayName(dayPair.checkInDayOfWeek)}/${getDayName(dayPair.checkOutDayOfWeek)})`);
                    } else {
                        weekdayPrices.push(roomPrice);
                        console.log(`📅 Weekday price for day ${dayPair.checkInDay}/${dayPair.checkOutDay}: $${roomPrice} (${getDayName(dayPair.checkInDayOfWeek)}/${getDayName(dayPair.checkOutDayOfWeek)})`);
                    }

                    if (roomPrice > highestPrice) {
                        highestPrice = roomPrice;
                        console.log(`📈 New highest price: $${highestPrice} (day ${dayPair.checkInDay}/${dayPair.checkOutDay})`);
                    }

                    successfulRequests++;
                } else {
                    const { dayPair, error } = result;
                    console.warn(`⚠️ Failed to get pricing for day ${dayPair.checkInDay}/${dayPair.checkOutDay}: ${error}`);
                    failedRequests++;
                }
            });

            console.log(`📊 API Results: ${successfulRequests} successful, ${failedRequests} failed out of ${allPromises.length} total requests`);
            console.log(`🚀 Performance: ${(successfulRequests / totalTime).toFixed(1)} successful requests per second`);// 8. Handle case where no pricing data was found
            if (highestPrice === 0) {
                console.warn("⚠️ No pricing data found, using fallback pricing based on room occupancy");
                
                // Fallback pricing based on room occupancy and type
                const occupancy = parseInt(selectedRoom.occupancy) || 2;
                const basePrice = occupancy <= 2 ? 150 : occupancy <= 4 ? 200 : 250;
                
                // Add room type multipliers using more efficient string operations
                const roomNameLower = selectedRoom.name.toLowerCase();
                let multiplier = 1;
                if (roomNameLower.includes('suite') || roomNameLower.includes('penthouse')) {
                    multiplier = 1.5;
                } else if (roomNameLower.includes('premium') || roomNameLower.includes('deluxe')) {
                    multiplier = 1.2;
                }
                
                highestPrice = Math.round(basePrice * multiplier);
                console.log(`🔄 Using fallback pricing: $${highestPrice} (based on ${occupancy} occupancy, ${multiplier}x multiplier)`);
            }

            // 9. Calculate intelligent pricing structure with optimized array operations
            const nightlyRate = highestPrice;
            
            // Use more efficient max calculation to avoid spread operator on large arrays
            const highestWeekdayRate = weekdayPrices.length > 0 ? 
                weekdayPrices.reduce((max, price) => Math.max(max, price), 0) : 
                nightlyRate;
            
            const highestWeekendRate = weekendPrices.length > 0 ? 
                weekendPrices.reduce((max, price) => Math.max(max, price), 0) : 
                nightlyRate;

            // Monthly rate calculation (optimized)
            const monthlyRate = (22 * highestWeekdayRate) + (8 * highestWeekendRate);

            // Pre-calculate date strings once
            const startDate = `${selectedMonthName} 01, ${targetYear}`;
            const endDate = `${selectedMonthName} ${daysInMonth.toString().padStart(2, '0')}, ${targetYear}`;

            console.log(`📊 Calculated pricing strategy:
                Nightly Rate: $${nightlyRate} (unified rate)
                Highest Weekday Rate: $${highestWeekdayRate} (from ${weekdayPrices.length} samples)
                Highest Weekend Rate: $${highestWeekendRate} (from ${weekendPrices.length} samples)`);

            // 10. Optimized form field population with DOM caching
            const hasWeekendDifferential = (highestWeekdayRate !== highestWeekendRate) && 
                                         (weekdayPrices.length > 0 && weekendPrices.length > 0);
            
            // Create form mappings object once
            const formMappings = hasWeekendDifferential ? {
                'SeasonalRate_PriceName': `${selectedMonthName} Price`,
                'SeasonalRate_StartDate': startDate,
                'SeasonalRate_EndDate': endDate,
                'SeasonalRate_NightlyRate': highestWeekdayRate.toString(),
                'SeasonalRate_WeekendRate': highestWeekendRate.toString()
            } : {
                'SeasonalRate_PriceName': `${selectedMonthName} Price`,
                'SeasonalRate_StartDate': startDate,
                'SeasonalRate_EndDate': endDate,
                'SeasonalRate_NightlyRate': nightlyRate.toString()
            };

            console.log(`📊 Using ${hasWeekendDifferential ? 'differential' : 'unified'} pricing strategy`);

            // 11. Handle weekend differential pricing UI with optimized DOM operations
            if (hasWeekendDifferential) {
                console.log(`📊 Activating differential pricing - Weekday: $${highestWeekdayRate}, Weekend: $${highestWeekendRate}`);

                // Cache frequently used DOM elements
                const showMoreLink = document.querySelector('a[href="#ShowMore-Seasonal"]');
                
                if (showMoreLink) {
                    showMoreLink.click();
                    console.log('✓ Activated ShowMore-Seasonal section for weekend pricing');
                    
                    // Wait for section to expand
                    await new Promise(resolve => setTimeout(resolve, 300));
                    
                    // Handle checkbox activation
                    const moreOptionsSeasonalCheckbox = document.querySelector('#more-options-seasonal');
                    if (moreOptionsSeasonalCheckbox && !moreOptionsSeasonalCheckbox.checked) {
                        moreOptionsSeasonalCheckbox.checked = true;
                        
                        // Trigger events efficiently
                        ['change', 'click'].forEach(eventType => {
                            const event = new Event(eventType, { bubbles: true });
                            moreOptionsSeasonalCheckbox.dispatchEvent(event);
                        });
                        
                        console.log('✓ Activated more-options-seasonal checkbox for weekend rate options');
                        await new Promise(resolve => setTimeout(resolve, 200));
                    } else if (moreOptionsSeasonalCheckbox?.checked) {
                        console.log('ℹ️ more-options-seasonal checkbox already activated');
                    } else {
                        console.warn('⚠️ more-options-seasonal checkbox not found');
                    }
                    
                    // Efficiently handle weekend checkboxes
                    const weekendCheckboxIds = [
                        'SeasonalRate_IsFridayWeekend',
                        'SeasonalRate_IsSaturdayWeekend', 
                        'SeasonalRate_IsSundayWeekend'
                    ];
                    
                    // Query all checkboxes at once and process in batch
                    const weekendCheckboxes = weekendCheckboxIds
                        .map(id => ({ id, element: document.querySelector(`#${id}`) }))
                        .filter(item => item.element);
                    
                    weekendCheckboxes.forEach(({ id, element }) => {
                        element.checked = true;
                        const changeEvent = new Event('change', { bubbles: true });
                        element.dispatchEvent(changeEvent);
                        console.log(`✓ Checked ${id} for weekend differential pricing`);
                    });
                    
                    console.log(`✓ Automatically checked ${weekendCheckboxes.length}/3 weekend checkboxes`);
                } else {
                    console.warn('⚠️ ShowMore-Seasonal link not found');
                }
            }

            // 12. Optimized form field population with efficient DOM manipulation
            let populatedFields = 0;
            let skippedFields = 0;

            // Create a document fragment for better performance if needed
            const fieldEntries = Object.entries(formMappings);
            
            for (const [fieldName, value] of fieldEntries) {
                const field = document.querySelector(`#${fieldName}`);
                if (field) {
                    if (field.tagName.toLowerCase() === 'select') {
                        // Optimize dropdown handling
                        const options = Array.from(field.options);
                        const option = options.find(opt => opt.value === value || opt.text === value);
                        
                        if (option) {
                            field.value = option.value;
                            
                            // Trigger change event
                            const changeEvent = new Event('change', { bubbles: true });
                            field.dispatchEvent(changeEvent);
                            
                            console.log(`✓ Set ${fieldName} = ${value} (${option.text})`);
                            populatedFields++;
                        } else {
                            console.warn(`⚠️ Option "${value}" not found in ${fieldName} dropdown`);
                            skippedFields++;
                        }
                    } else {
                        // Handle input fields efficiently
                        field.value = value;
                        
                        // Trigger events in batch
                        ['input', 'change'].forEach(eventType => {
                            const event = new Event(eventType, { bubbles: true });
                            field.dispatchEvent(event);
                        });
                        
                        console.log(`✓ Set ${fieldName} = ${value}`);
                        populatedFields++;
                    }
                } else {
                    console.warn(`⚠️ Field ${fieldName} not found on page`);
                    skippedFields++;
                }
            }            // 13. Generate optimized success message with pre-calculated values
            const analysisDetails = successfulRequests > 0 ? 
                `Successfully analyzed ${successfulRequests} day pairs in ${targetYear}-${String(selectedMonth).padStart(2, '0')} (${failedRequests} failed requests)` :
                `Used intelligent fallback pricing (no API data available)`;

            // Pre-calculate pricing details string for better performance
            const pricingDetails = hasWeekendDifferential 
                ? `• Weekday Rate: $${highestWeekdayRate} (from ${weekdayPrices.length} samples)
                • Weekend Rate: $${highestWeekendRate} (from ${weekendPrices.length} samples)
                • ✨ Differential Pricing Activated (ShowMore-Seasonal section expanded)
                • ✅ Weekend Checkboxes Auto-Checked (Friday, Saturday, Sunday)`
                : `• Nightly Rate: $${nightlyRate} (unified rate)
                  - Based on ${weekdayPrices.length} weekday samples (highest: $${highestWeekdayRate}) + ${weekendPrices.length} weekend samples (highest: $${highestWeekendRate})`;

            // Construct final message using template literals for better performance
            const pricingBreakdown = `📊 PRICING ANALYSIS COMPLETE 📊
                
🎯 Target Room: ${selectedRoom.name}
📅 Analysis Period: ${targetYear}-${String(selectedMonth).padStart(2, '0')}
${analysisDetails}

💰 SEASONAL RATE PRICING STRATEGY:
• Price Name: ${selectedMonthName} Price
• Start Date: ${startDate}
• End Date: ${endDate}
${pricingDetails}

✅ Seasonal Rate Form Fields: ${populatedFields} populated, ${skippedFields} skipped
  Review and adjust pricing as needed before saving.`;

            await showAlertModal("Step 5 Pricing Analysis Complete", pricingBreakdown);
            console.log("🎉 Step 5 pricing automation completed successfully!");

        } catch (error) {
            console.error("❌ Error in Step 5 pricing automation:", error);
            await showAlertModal("Step 5 Pricing Automation Failed", `❌ Step 5 pricing automation failed: ${error.message}\n\nPlease check the console for details and try again.`);
        }
    }

    // Helper function to extract property description from Expedia content
    async function extractPropertyDescription(expediaHotelUrl, hotelName, roomName) {
        try {
            console.log("Fetching Expedia webpage content for property description extraction...");
            const webpageHtml = await fetchExpediaData(expediaHotelUrl);

            // Extract title, description, and content
            const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
            const webpageTitle = titleMatch ? titleMatch[1].trim() : '';

            const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
            const webpageDescription = descMatch ? descMatch[1].trim() : '';

            // Extract visible text content (remove HTML tags and script/style content)
            let textContent = webpageHtml
                .replace(/<script[^>]*>.*?<\/script>/gis, '')
                .replace(/<style[^>]*>.*?<\/style>/gis, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Focus on description-relevant sections
            let relevantContent = '';
            if (textContent.length > 3000) {
                // Look for sections that might contain property description information
                const keywordSections = textContent.match(/(?:description|about|overview|property|hotel|accommodation|features|amenities|services|facilities|location|area|room|stay|experience|welcome|discover)[^.!?]*[.!?]/gi);

                if (keywordSections && keywordSections.length > 0) {
                    relevantContent = keywordSections.join(' ').substring(0, 3000);
                } else {
                    relevantContent = textContent.substring(0, 3000);
                }
            } else {
                relevantContent = textContent;
            }

            console.log("Successfully extracted webpage content for property description analysis");
            console.log("Content length:", relevantContent.length, "characters");

            // Check if API key is configured for LLM processing
            const apiKey = GM_getValue('togetherApiKey', '');
            if (!apiKey) {
                console.warn("No Together.ai API key configured. Using fallback description extraction.");
                return extractFallbackDescription(webpageTitle, webpageDescription, relevantContent, hotelName, roomName);
            }            // Use LLM to generate a proper property description
            const descriptionPrompt = `Generate a comprehensive and professional property description for a vacation rental listing based on the following Expedia hotel information. Create a detailed description that follows this structure and style:

Hotel Information:
- Property Name: ${hotelName}
- Room Type: ${roomName}
- Expedia URL: ${expediaHotelUrl}

Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}

Webpage Content:
${relevantContent}

Create a property description that follows this EXACT format and structure:

1. Start with a compelling title line that mentions the hotel type and a key nearby landmark/attraction
2. Second paragraph: Location details mentioning specific nearby attractions, landmarks, or districts, then list key amenities like restaurants, facilities, and services
3. "You'll also enjoy perks such as:" section with 3 specific amenities/services
4. "Guest reviews say great things about..." section mentioning positive aspects
5. "Room features" section describing the rooms and their amenities
6. "Other conveniences in all rooms include:" section with specific in-room amenities

Example format to follow:
"[Hotel Type] near [Major Landmark]
Located close to [Attraction 1] and [Attraction 2], [Hotel Name] provides [amenity 1], [amenity 2], and [amenity 3]. The on-site [restaurant type], [Restaurant Name], offers [meal types]. [Additional facilities] are offered at the [facility]; the property also has [another amenity]. Guests can connect to [connectivity].
You'll also enjoy perks such as:
[Amenity 1], [amenity 2], and [amenity 3]
[Feature 1], [feature 2], and [feature 3]
[Aspect 1], [aspect 2], and [aspect 3]
Guest reviews say great things about the [positive aspect 1] and [positive aspect 2]
Room features
All [number] rooms have comforts such as [comfort 1] and [comfort 2], in addition to perks like [perk 1] and [perk 2]. Guest reviews highly rate the [room aspect] at the property.
Other conveniences in all rooms include:
[Category 1] with [specific features]
[Items 1], [items 2], and [items 3]"

IMPORTANT: The description MUST be under 1000 characters. Be concise but comprehensive. Extract specific details from the webpage content including restaurant names, nearby attractions, amenities, and room features.

Return only the property description text without any additional formatting or explanations.`;

            console.log("Sending property description request to Together.ai (Llama 3.3 70B Turbo)...");
            const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'meta-llama/Llama-3.3-70B-Instruct-Turbo-Free',
                    messages: [                        {
                            role: 'system',
                            content: 'You are a professional vacation rental copywriter specializing in detailed, structured property descriptions. Create comprehensive descriptions that follow a specific format with sections for location, amenities, perks, guest reviews, and room features. Focus on extracting specific details from the source content.'
                        },
                        {
                            role: 'user',
                            content: descriptionPrompt
                        }
                    ],                    max_tokens: 500,
                    temperature: 0.7
                })
            });            if (response.ok) {
                const result = await response.json();
                let generatedDescription = result.choices[0].message.content.trim();

                // Ensure description is under 1000 characters
                if (generatedDescription.length > 1000) {
                    generatedDescription = generatedDescription.substring(0, 997) + '...';
                }

                console.log("LLM-generated property description:", generatedDescription.substring(0, 100) + "...");
                console.log("Description length:", generatedDescription.length, "characters");
                return generatedDescription;
            } else {
                console.warn("LLM API request failed:", response.status, response.statusText);
                return extractFallbackDescription(webpageTitle, webpageDescription, relevantContent, hotelName, roomName);
            }

        } catch (error) {
            console.error("Error in property description extraction:", error);
            return extractFallbackDescription('', '', '', hotelName, roomName);
        }
    }    // Fallback function to create a basic property description when LLM is not available
    function extractFallbackDescription(webpageTitle, webpageDescription, relevantContent, hotelName, roomName) {
        console.log("Using fallback method to create property description...");

        let description = '';
        const content = relevantContent.toLowerCase();

        // 1. Start with compelling title line
        let hotelType = 'Luxury hotel';
        if (content.includes('boutique')) hotelType = 'Boutique hotel';
        else if (content.includes('business')) hotelType = 'Business hotel';
        else if (content.includes('resort')) hotelType = 'Resort hotel';

        // Extract nearby landmarks/attractions
        let nearbyLandmark = '';
        if (content.includes('shrine') || content.includes('temple')) nearbyLandmark = 'historic shrines';
        else if (content.includes('park') || content.includes('garden')) nearbyLandmark = 'beautiful parks';
        else if (content.includes('station') || content.includes('subway')) nearbyLandmark = 'transportation hub';
        else if (content.includes('shopping') || content.includes('mall')) nearbyLandmark = 'shopping district';
        else if (content.includes('downtown') || content.includes('center')) nearbyLandmark = 'city center';
        else nearbyLandmark = 'key attractions';

        description += `${hotelType} near ${nearbyLandmark}\n`;

        // 2. Location and amenities paragraph
        description += `Located in a prime area, ${hotelName} provides `;

        // Extract key amenities
        const amenities = [];
        if (content.includes('terrace') || content.includes('rooftop')) amenities.push('a terrace');
        if (content.includes('shop') || content.includes('shopping')) amenities.push('shopping on site');
        if (content.includes('coffee') || content.includes('cafe')) amenities.push('a coffee shop/cafe');
        if (content.includes('restaurant') || content.includes('dining')) amenities.push('on-site dining');
        if (content.includes('bar') || content.includes('lounge')) amenities.push('a bar');
        if (content.includes('gym') || content.includes('fitness')) amenities.push('fitness facilities');
        if (content.includes('wifi') || content.includes('internet')) amenities.push('free WiFi');

        if (amenities.length >= 3) {
            description += `${amenities.slice(0, 3).join(', ')}. `;
        } else {
            description += `modern amenities, exceptional service, and comfortable accommodations. `;
        }

        // Add restaurant info if available
        if (content.includes('restaurant') || content.includes('cafe')) {
            description += `The on-site restaurant offers breakfast, lunch, and dinner. `;
        }

        description += `Guests can connect to free in-room WiFi.\n`;

        // 3. Perks section
        description += `You'll also enjoy perks such as:\n`;
        const perks = [];
        if (content.includes('breakfast')) perks.push('breakfast options');
        if (content.includes('parking')) perks.push('parking facilities');
        if (content.includes('concierge')) perks.push('concierge services');
        if (content.includes('room service')) perks.push('room service');
        if (content.includes('business')) perks.push('business facilities');
        if (content.includes('meeting')) perks.push('meeting rooms');

        if (perks.length >= 3) {
            description += `${perks.slice(0, 3).join(', ')}\n`;
        } else {
            description += `Full service amenities, modern facilities, and exceptional hospitality\n`;
        }

        // 4. Guest reviews
        description += `Guest reviews say great things about the helpful staff and prime location\n`;

        // 5. Room features
        description += `Room features\n`;
        description += `All rooms have comforts such as `;

        const roomAmenities = [];
        if (content.includes('room service')) roomAmenities.push('24-hour room service');
        if (content.includes('bedding') || content.includes('bed')) roomAmenities.push('premium bedding');
        if (content.includes('air conditioning') || content.includes('climate')) roomAmenities.push('air conditioning');
        if (content.includes('minibar') || content.includes('mini bar')) roomAmenities.push('minibar');

        if (roomAmenities.length >= 2) {
            description += `${roomAmenities.slice(0, 2).join(' and ')}, `;
        } else {
            description += `modern amenities and comfortable furnishings, `;
        }

        description += `in addition to perks like premium linens and climate control.\n`;

        // 6. Other conveniences
        description += `Other conveniences in all rooms include:\n`;
        description += `Private bathrooms with designer toiletries\n`;
        description += `Coffee/tea makers, wardrobes, and heating`;

        // Ensure reasonable length - must be under 1000 characters
        if (description.length > 1000) {
            // Truncate while maintaining structure
            const lines = description.split('\n');
            let truncated = '';
            for (let line of lines) {
                if ((truncated + line + '\n').length > 997) break;
                truncated += line + '\n';
            }
            description = truncated.trim() + '...';
        }

        console.log("Generated fallback description:", description.substring(0, 100) + "...");
        console.log("Fallback description length:", description.length, "characters");
        return description;
    }


    // LLM-Powered Attraction Detection System for Step 3 Checkboxes
    async function automateAttractionCheckboxes(geocodeData, addressComps, hotelName, propertyId, expediaHotelUrl) {
        console.log("Starting LLM-powered attraction detection for checkbox automation...");
        console.log("Using Expedia TAAP webpage content analysis instead of location-based analysis...");

        // Available attraction checkboxes from the form (corrected mapping)
        const attractionMapping = {
            "Attractions_0__Checked": "Churches",
            "Attractions_1__Checked": "Cinemas",
            "Attractions_2__Checked": "Duty Free Shops",
            "Attractions_3__Checked": "Garden",
            "Attractions_4__Checked": "Healthy/Beauty Spa",
            "Attractions_5__Checked": "Library",
            "Attractions_6__Checked": "Marina",
            "Attractions_7__Checked": "Museums",
            "Attractions_8__Checked": "Parks",
            "Attractions_9__Checked": "Playground",
            "Attractions_10__Checked": "Recreation Center",
            "Attractions_11__Checked": "Recreational Park",
            "Attractions_12__Checked": "Shopping Malls",
            "Attractions_13__Checked": "Zoo"
        };

        // Fetch the actual Expedia TAAP webpage content for analysis
        let webpageContent = '';
        let webpageTitle = '';
        let webpageDescription = '';

        try {
            console.log("Fetching Expedia TAAP webpage content for attraction analysis...");
            const webpageHtml = await fetchExpediaData(expediaHotelUrl);

            // Extract title
            const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
            webpageTitle = titleMatch ? titleMatch[1].trim() : '';

            // Extract meta description
            const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
            webpageDescription = descMatch ? descMatch[1].trim() : '';

            // Extract visible text content (remove HTML tags and script/style content)
            let textContent = webpageHtml
                .replace(/<script[^>]*>.*?<\/script>/gis, '')
                .replace(/<style[^>]*>.*?<\/style>/gis, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Limit content length for LLM processing (keep most relevant parts)
            if (textContent.length > 2000) {
                // Look for sections that might contain attraction/amenity information
                const keywordSections = textContent.match(/(?:amenities?|facilities?|nearby|attractions?|area|location|activities?|recreation|entertainment|shopping|dining|spa|fitness|pool|beach|marina|park|museum|garden|church|cinema|mall|zoo|library)[^.!?]*[.!?]/gi);

                if (keywordSections && keywordSections.length > 0) {
                    webpageContent = keywordSections.join(' ').substring(0, 2000);
                } else {
                    webpageContent = textContent.substring(0, 2000);
                }
            } else {
                webpageContent = textContent;
            }

            console.log("Successfully extracted webpage content for analysis");
            console.log("Title:", webpageTitle);
            console.log("Description:", webpageDescription);
            console.log("Content preview:", webpageContent.substring(0, 200) + "...");

        } catch (error) {
            console.error("Failed to fetch Expedia webpage content:", error);
            webpageContent = 'Unable to fetch webpage content';
        }

        // Create prompt for LLM to analyze the actual webpage content
        const attractionPrompt = `Analyze the following Expedia hotel webpage content to determine which attractions/amenities are mentioned as being nearby, available, or accessible. Base your analysis ONLY on what is explicitly mentioned or implied in the webpage content.

Hotel Information:
- Name: ${hotelName || 'Unknown Hotel'}
- Expedia URL: ${expediaHotelUrl}

Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}

Webpage Content:
${webpageContent}

Available attraction categories to evaluate:
${Object.values(attractionMapping).join(', ')}

Please analyze this webpage content and return ONLY a JSON array of attraction names that are explicitly mentioned, described, or clearly implied as being nearby or accessible. Consider:

1. Churches: Look for mentions of churches, religious sites, worship places
2. Cinemas: Look for movie theaters, cinema complexes, entertainment venues
3. Duty Free Shops: Look for duty-free shopping, airport proximity, international shopping
4. Garden: Look for gardens, botanical areas, landscaped spaces, parks with gardens
5. Healthy/Beauty Spa: Look for spa facilities, wellness centers, beauty treatments, massage
6. Library: Look for libraries, cultural centers, educational facilities
7. Marina: Look for marinas, harbors, boat facilities, waterfront areas
8. Museums: Look for museums, cultural attractions, art galleries, exhibitions
9. Parks: Look for parks, green spaces, recreational areas, nature areas
10. Playground: Look for playgrounds, children's areas, family facilities
11. Recreation Center: Look for recreation centers, sports facilities, activity centers
12. Recreational Park: Look for recreational parks, leisure areas, outdoor activities
13. Shopping Malls: Look for shopping centers, malls, retail complexes
14. Zoo: Look for zoos, wildlife parks, animal attractions

Return only a valid JSON array based on what is actually mentioned in the webpage content like: ["Churches", "Library", "Parks", "Shopping Malls"]`;

        try {
            console.log("Starting LLM-powered attraction detection...");
              // Check if API key is configured
            const apiKey = GM_getValue('togetherApiKey', '');
            if (!apiKey) {
                console.warn("No Together.ai API key configured. Falling back to heuristic detection.");
                throw new Error("NO_API_KEY");
            }

            // Try to get LLM response for attraction analysis
            let attractionSuggestions = [];

            try {                console.log("Sending attraction analysis request to Together.ai (Llama 3.1 8B Turbo)...");
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a location analysis expert. Always respond with valid JSON arrays only.'
                            },
                            {
                                role: 'user',
                                content: attractionPrompt
                            }
                        ],                        max_tokens: 300,
                        temperature: 0.2
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    const llmResponse = result.choices[0].message.content.trim();
                    console.log("LLM response for attractions:", llmResponse);

                    // Parse the JSON response
                    try {
                        attractionSuggestions = JSON.parse(llmResponse);
                        console.log("Parsed attraction suggestions:", attractionSuggestions);
                    } catch (parseError) {
                        console.warn("Failed to parse LLM response as JSON, trying to extract array:", parseError);
                        // Try to extract array from response
                        const arrayMatch = llmResponse.match(/\[(.*?)\]/);
                        if (arrayMatch) {
                            attractionSuggestions = JSON.parse(arrayMatch[0]);
                        }
                    }
                } else {
                    console.warn("LLM API request failed:", response.status, response.statusText);
                }
            } catch (apiError) {
                console.warn("LLM API error:", apiError.message);
            }            // Fallback logic if LLM fails - use content-based heuristics when available
            if (!attractionSuggestions || attractionSuggestions.length === 0) {
                console.log("Using fallback heuristic-based attraction detection...");
                attractionSuggestions = [];

                // If we have webpage content, use it for better heuristics
                if (webpageContent && webpageContent !== 'Unable to fetch webpage content') {
                    const contentLower = webpageContent.toLowerCase();
                    const titleLower = webpageTitle.toLowerCase();
                    const descLower = webpageDescription.toLowerCase();
                    const allContent = (contentLower + ' ' + titleLower + ' ' + descLower).toLowerCase();

                    console.log("Using webpage content for enhanced heuristic detection...");

                    // Content-based detection
                    if (allContent.match(/\b(church|cathedral|temple|chapel|worship|religious|faith)\b/)) {
                        attractionSuggestions.push("Churches");
                    }
                    if (allContent.match(/\b(cinema|movie|theater|theatre|film|entertainment)\b/)) {
                        attractionSuggestions.push("Cinemas");
                    }
                    if (allContent.match(/\b(duty.?free|airport|international.?shopping|tax.?free)\b/)) {
                        attractionSuggestions.push("Duty Free Shops");
                    }
                    if (allContent.match(/\b(garden|botanical|landscap|flower|rose|herb)\b/)) {
                        attractionSuggestions.push("Garden");
                    }
                    if (allContent.match(/\b(spa|wellness|massage|beauty|relaxation|treatment|sauna)\b/)) {
                        attractionSuggestions.push("Healthy/Beauty Spa");
                    }
                    if (allContent.match(/\b(library|libraries|books|reading|cultural.?center)\b/)) {
                        attractionSuggestions.push("Library");
                    }
                    if (allContent.match(/\b(marina|harbor|harbour|boat|yacht|waterfront|pier|wharf)\b/)) {
                        attractionSuggestions.push("Marina");
                    }
                    if (allContent.match(/\b(museum|gallery|exhibit|cultural|art|history)\b/)) {
                        attractionSuggestions.push("Museums");
                    }
                    if (allContent.match(/\b(park|green.?space|nature|outdoor|recreation)\b/)) {
                        attractionSuggestions.push("Parks");
                    }
                    if (allContent.match(/\b(playground|children|kids|family|play.?area)\b/)) {
                        attractionSuggestions.push("Playground");
                    }
                    if (allContent.match(/\b(recreation.?center|sports|fitness|activity.?center|gym)\b/)) {
                        attractionSuggestions.push("Recreation Center");
                    }
                    if (allContent.match(/\b(recreational.?park|leisure|outdoor.?activities|adventure)\b/)) {
                        attractionSuggestions.push("Recreational Park");
                    }
                    if (allContent.match(/\b(shopping.?mall|retail|shopping.?center|mall|shops)\b/)) {
                        attractionSuggestions.push("Shopping Malls");
                    }
                    if (allContent.match(/\b(zoo|wildlife|animal|safari|aquarium)\b/)) {
                        attractionSuggestions.push("Zoo");
                    }

                } else {
                    // Basic heuristics based on location (fallback when no webpage content)
                    const countryLower = (addressComps?.country || '').toLowerCase();
                    const cityLower = (addressComps?.city || '').toLowerCase();
                    const addressLower = (addressComps ?
                        [addressComps.houseNumber, addressComps.addressLine1, addressComps.city, addressComps.stateProvince, addressComps.country]
                        .filter(x => x).join(', ') : '').toLowerCase();

                    console.log("Using basic location-based heuristics as final fallback...");

                    // Very common attractions in most populated areas
                    attractionSuggestions.push("Churches", "Library", "Parks", "Playground");

                    // Urban/suburban amenities
                    if (cityLower && !cityLower.includes('rural') && !cityLower.includes('village')) {
                        attractionSuggestions.push("Shopping Malls", "Cinemas", "Recreation Center", "Recreational Park");
                    }

                    // Museums in cities and tourist areas
                    if (cityLower && (cityLower.includes('city') || cityLower.includes('town') || addressLower.includes('tourist'))) {
                        attractionSuggestions.push("Museums");
                    }

                    // Gardens in populated areas
                    attractionSuggestions.push("Garden");

                    // Spa facilities in tourist/resort areas
                    if (addressLower.includes('resort') || addressLower.includes('hotel') || addressLower.includes('tourist') || addressLower.includes('spa')) {
                        attractionSuggestions.push("Healthy/Beauty Spa");
                    }

                    // Marina only near water
                    if (addressLower.includes('coast') || addressLower.includes('harbor') || addressLower.includes('port') ||
                        addressLower.includes('marina') || addressLower.includes('waterfront') || addressLower.includes('bay')) {
                        attractionSuggestions.push("Marina");
                    }

                    // Duty Free Shops only near airports
                    if (addressLower.includes('airport') || cityLower.includes('airport')) {
                        attractionSuggestions.push("Duty Free Shops");
                    }
                      // Zoo only in larger cities
                    if (cityLower && (cityLower.includes('city') || cityLower.length > 8)) {
                        attractionSuggestions.push("Zoo");
                    }
                }

                console.log("Fallback attraction suggestions:", attractionSuggestions);
            }

            // Apply the suggestions to checkboxes
            let checkedCount = 0;
            Object.entries(attractionMapping).forEach(([checkboxId, attractionName]) => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    if (attractionSuggestions.includes(attractionName)) {
                        checkbox.checked = true;
                        checkedCount++;
                        console.log(`✓ Checked attraction: ${attractionName} (${checkboxId})`);
                    } else {
                        checkbox.checked = false;
                        console.log(`✗ Unchecked attraction: ${attractionName} (${checkboxId})`);
                    }
                } else {
                    console.warn(`Attraction checkbox not found: ${checkboxId}`);
                }
            });

            console.log(`LLM-powered attraction detection completed. Checked ${checkedCount} out of ${Object.keys(attractionMapping).length} attractions.`);
              return {
                success: true,
                checkedAttractions: attractionSuggestions,
                checkedCount: checkedCount,
                method: attractionSuggestions.length > 0 ? (webpageContent && webpageContent !== 'Unable to fetch webpage content' ? 'Webpage-Content-LLM' : 'LLM') : 'heuristic'
            };

        } catch (error) {
            console.error("Error in attraction detection:", error);
            return {
                success: false,
                error: error.message,
                checkedCount: 0
            };
        }
    }

    // LLM-Powered Establishment Detection System for Step 3 Business and Local Establishments Checkboxes
    async function automateEstablishmentCheckboxes(geocodeData, addressComps, hotelName, propertyId, expediaHotelUrl) {
        console.log("Starting LLM-powered establishment detection for checkbox automation...");
        console.log("Using Expedia TAAP webpage content analysis for establishment detection...");

        // Available establishment checkboxes from the form
        const establishmentMapping = {
            "Establishments_0__Checked": "Banks or ATM",
            "Establishments_1__Checked": "Car Wash Shop",
            "Establishments_2__Checked": "Cleaning Services",
            "Establishments_3__Checked": "Fitness Center",
            "Establishments_4__Checked": "Groceries",
            "Establishments_5__Checked": "Hospital",
            "Establishments_6__Checked": "Laundry Shops",
            "Establishments_7__Checked": "Medicine Store",
            "Establishments_8__Checked": "Restaurant"
        };

        // Fetch the actual Expedia TAAP webpage content for analysis
        let webpageContent = '';
        let webpageTitle = '';
        let webpageDescription = '';

        try {
            console.log("Fetching Expedia TAAP webpage content for establishment analysis...");
            const webpageHtml = await fetchExpediaData(expediaHotelUrl);

            // Extract title
            const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
            webpageTitle = titleMatch ? titleMatch[1].trim() : '';

            // Extract meta description
            const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
            webpageDescription = descMatch ? descMatch[1].trim() : '';

            // Extract visible text content (remove HTML tags and script/style content)
            let textContent = webpageHtml
                .replace(/<script[^>]*>.*?<\/script>/gis, '')
                .replace(/<style[^>]*>.*?<\/style>/gis, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Limit content length for LLM processing (keep most relevant parts)
            if (textContent.length > 2000) {
                // Look for sections that might contain establishment/amenity information
                const keywordSections = textContent.match(/(?:amenities?|facilities?|nearby|services?|area|location|dining|shopping|medical|banking|fitness|gym|restaurants?|grocery|hospital|pharmacy|laundry|car.?wash|cleaning)[^.!?]*[.!?]/gi);

                if (keywordSections && keywordSections.length > 0) {
                    webpageContent = keywordSections.join(' ').substring(0, 2000);
                } else {
                    webpageContent = textContent.substring(0, 2000);
                }
            } else {
                webpageContent = textContent;
            }

            console.log("Successfully extracted webpage content for establishment analysis");
            console.log("Title:", webpageTitle);
            console.log("Description:", webpageDescription);
            console.log("Content preview:", webpageContent.substring(0, 200) + "...");

        } catch (error) {
            console.error("Failed to fetch Expedia webpage content:", error);
            webpageContent = 'Unable to fetch webpage content';
        }

        // Create prompt for LLM to analyze the actual webpage content for establishments
        const establishmentPrompt = `Analyze the following Expedia hotel webpage content to determine which business establishments and local services are mentioned as being nearby, available, or accessible. Base your analysis ONLY on what is explicitly mentioned or implied in the webpage content.

Hotel Information:
- Name: ${hotelName || 'Unknown Hotel'}
- Expedia URL: ${expediaHotelUrl}

Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}

Webpage Content:
${webpageContent}

Available establishment categories to evaluate:
${Object.values(establishmentMapping).join(', ')}

Please analyze this webpage content and return ONLY a JSON array of establishment names that are explicitly mentioned, described, or clearly implied as being nearby or accessible. Consider:

1. Banks or ATM: Look for mentions of banks, ATMs, financial services, banking facilities
2. Car Wash Shop: Look for car wash services, automotive services, vehicle cleaning
3. Cleaning Services: Look for cleaning services, housekeeping, laundry services
4. Fitness Center: Look for fitness centers, gyms, exercise facilities, health clubs
5. Groceries: Look for grocery stores, supermarkets, food shopping, convenience stores
6. Hospital: Look for hospitals, medical centers, emergency services, healthcare facilities
7. Laundry Shops: Look for laundromats, laundry services, dry cleaning
8. Medicine Store: Look for pharmacies, drug stores, medical supplies, chemists
9. Restaurant: Look for restaurants, dining options, food establishments, eateries

Return only a valid JSON array based on what is actually mentioned in the webpage content like: ["Restaurants", "Groceries", "Fitness Center", "Banks or ATM"]`;

        try {
            console.log("Starting LLM-powered establishment detection...");
              // Check if API key is configured
            const apiKey = GM_getValue('togetherApiKey', '');
            if (!apiKey) {
                console.warn("No Together.ai API key configured. Falling back to heuristic detection.");
                throw new Error("NO_API_KEY");
            }

            // Try to get LLM response for establishment analysis
            let establishmentSuggestions = [];

            try {                console.log("Sending establishment analysis request to Together.ai (Llama 3.1 8B Turbo)...");
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a location analysis expert. Always respond with valid JSON arrays only.'
                            },
                            {
                                role: 'user',
                                content: establishmentPrompt
                            }
                        ],                        max_tokens: 300,
                        temperature: 0.2
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    const llmResponse = result.choices[0].message.content.trim();
                    console.log("LLM response for establishments:", llmResponse);

                    // Parse the JSON response
                    try {
                        establishmentSuggestions = JSON.parse(llmResponse);
                        console.log("Parsed establishment suggestions:", establishmentSuggestions);
                    } catch (parseError) {
                        console.warn("Failed to parse LLM response as JSON, trying to extract array:", parseError);
                        // Try to extract array from response
                        const arrayMatch = llmResponse.match(/\[(.*?)\]/);
                        if (arrayMatch) {
                            establishmentSuggestions = JSON.parse(arrayMatch[0]);
                        }
                    }
                } else {
                    console.warn("LLM API request failed:", response.status, response.statusText);
                }

            } catch (apiError) {
                console.warn("LLM API error:", apiError.message);
            }            // Fallback logic if LLM fails - use content-based heuristics when available
            if (!establishmentSuggestions || establishmentSuggestions.length === 0) {
                console.log("Using fallback heuristic-based establishment detection...");
                establishmentSuggestions = [];

                // If we have webpage content, use it for better heuristics
                if (webpageContent && webpageContent !== 'Unable to fetch webpage content') {
                    const contentLower = webpageContent.toLowerCase();
                    const titleLower = webpageTitle.toLowerCase();
                    const descLower = webpageDescription.toLowerCase();
                    const allContent = (contentLower + ' ' + titleLower + ' ' + descLower).toLowerCase();

                    console.log("Using webpage content for enhanced heuristic establishment detection...");

                    // Content-based detection
                    if (allContent.match(/\b(bank|atm|financial|banking|credit|money|cash)\b/)) {
                        establishmentSuggestions.push("Banks or ATM");
                    }
                    if (allContent.match(/\b(car.?wash|auto.?wash|vehicle.?cleaning|automotive.?service)\b/)) {
                        establishmentSuggestions.push("Car Wash Shop");
                    }
                    if (allContent.match(/\b(cleaning.?service|housekeeping|maid.?service|professional.?cleaning)\b/)) {
                        establishmentSuggestions.push("Cleaning Services");
                    }
                    if (allContent.match(/\b(fitness|gym|exercise|health.?club|workout|sports.?center)\b/)) {
                        establishmentSuggestions.push("Fitness Center");
                    }
                    if (allContent.match(/\b(grocery|supermarket|food.?store|convenience.?store|market)\b/)) {
                        establishmentSuggestions.push("Groceries");
                    }
                    if (allContent.match(/\b(hospital|medical.?center|emergency|healthcare|clinic|doctor)\b/)) {
                        establishmentSuggestions.push("Hospital");
                    }
                    if (allContent.match(/\b(laundry|laundromat|dry.?clean|washing)\b/)) {
                        establishmentSuggestions.push("Laundry Shops");
                    }
                    if (allContent.match(/\b(pharmacy|drug.?store|medicine|chemist|pharmaceutical)\b/)) {
                        establishmentSuggestions.push("Medicine Store");
                    }
                    if (allContent.match(/\b(restaurant|dining|food|eatery|café|cafe|bistro|bar|grill)\b/)) {
                        establishmentSuggestions.push("Restaurant");
                    }

                } else {
                    // Basic heuristics based on location (fallback when no webpage content)
                    const countryLower = (addressComps?.country || '').toLowerCase();
                    const cityLower = (addressComps?.city || '').toLowerCase();
                    const addressLower = (addressComps ?
                        [addressComps.houseNumber, addressComps.addressLine1, addressComps.city, addressComps.stateProvince, addressComps.country]
                        .filter(x => x).join(', ') : '').toLowerCase();

                    console.log("Using basic location-based heuristics as final fallback...");

                    // Very common establishments in most populated areas
                    establishmentSuggestions.push("Restaurant", "Groceries");

                    // Urban/suburban amenities
                    if (cityLower && !cityLower.includes('rural') && !cityLower.includes('village')) {
                        establishmentSuggestions.push("Banks or ATM", "Fitness Center", "Medicine Store");
                    }

                    // Medical facilities in populated areas
                    if (cityLower && (cityLower.includes('city') || cityLower.includes('town'))) {
                        establishmentSuggestions.push("Hospital");
                    }

                    // Service establishments in urban areas
                    if (addressLower.includes('city') || addressLower.includes('urban') || addressLower.includes('downtown')) {
                        establishmentSuggestions.push("Laundry Shops", "Cleaning Services", "Car Wash Shop");
                    }
                }

                console.log("Fallback establishment suggestions:", establishmentSuggestions);
            }

            // Apply the suggestions to checkboxes
            let checkedCount = 0;
            Object.entries(establishmentMapping).forEach(([checkboxId, establishmentName]) => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    if (establishmentSuggestions.includes(establishmentName)) {
                        checkbox.checked = true;
                        checkedCount++;
                        console.log(`✓ Checked establishment: ${establishmentName} (${checkboxId})`);
                    } else {
                        checkbox.checked = false;
                        console.log(`✗ Unchecked establishment: ${establishmentName} (${checkboxId})`);
                    }
                } else {
                    console.warn(`Establishment checkbox not found: ${checkboxId}`);
                }
            });

            console.log(`LLM-powered establishment detection completed. Checked ${checkedCount} out of ${Object.keys(establishmentMapping).length} establishments.`);
              return {
                success: true,
                checkedEstablishments: establishmentSuggestions,
                checkedCount: checkedCount,
                method: establishmentSuggestions.length > 0 ? (webpageContent && webpageContent !== 'Unable to fetch webpage content' ? 'Webpage-Content-LLM' : 'LLM') : 'heuristic'
            };        } catch (error) {
            console.error("Error in establishment detection:", error);
            return {
                success: false,
                error: error.message,
                checkedCount: 0
            };
        }
    }        // LLM-Powered Outdoor Activities Detection System for Step 4 Checkboxes
        async function automateOutdoorActivitiesCheckboxes(hotelName, expediaHotelUrl) {
            console.log("Starting enhanced outdoor activities detection using property amenities GraphQL data...");


        // Available outdoor activities checkboxes from the form
        const outDoorMapping = {
            "Outdoor_0__Checked": "Balcony",
            "Outdoor_1__Checked": "Basketball",
            "Outdoor_2__Checked": "Beach",
            "Outdoor_3__Checked": "Bicycles",
            "Outdoor_4__Checked": "Boat",
            "Outdoor_5__Checked": "Camping",
            "Outdoor_6__Checked": "Cave",
            "Outdoor_7__Checked": "Cove",
            "Outdoor_8__Checked": "Deck",
            "Outdoor_9__Checked": "Deck / Patio",
            "Outdoor_10__Checked": "Fishing",
            "Outdoor_11__Checked": "Garden",
            "Outdoor_12__Checked": "Golf",
            "Outdoor_13__Checked": "Grill",
            "Outdoor_14__Checked": "Hiking",
            "Outdoor_15__Checked": "Hills",
            "Outdoor_16__Checked": "Horse Back Riding",
            "Outdoor_17__Checked": "Hunting",
            "Outdoor_18__Checked": "Ice Skating",
            "Outdoor_19__Checked": "Island Hopping",
            "Outdoor_20__Checked": "Kayak / Canoe",
            "Outdoor_21__Checked": "Lawn / Garden",
            "Outdoor_22__Checked": "Mountain",
            "Outdoor_23__Checked": "Ocean",
            "Outdoor_24__Checked": "Outdoor Grill",
            "Outdoor_25__Checked": "Park",
            "Outdoor_26__Checked": "Playground",
            "Outdoor_27__Checked": "Resort",
            "Outdoor_28__Checked": "River",
            "Outdoor_29__Checked": "Scuba Diving",
            "Outdoor_30__Checked": "Ski",
            "Outdoor_31__Checked": "Snowboard",
            "Outdoor_32__Checked": "Spa / Massage",
            "Outdoor_33__Checked": "Surfing",
            "Outdoor_34__Checked": "Swimming",
            "Outdoor_35__Checked": "Tennis",
            "Outdoor_36__Checked": "Trekking",
            "Outdoor_37__Checked": "Valley",
            "Outdoor_38__Checked": "Volleyball",
            "Outdoor_39__Checked": "Water Sports Gear",
            "Outdoor_40__Checked": "Waterfalls"
        };

        // Get property ID for fetching comprehensive amenities data
        const propertyId = GM_getValue("propertyId", null);

        // Fetch comprehensive property amenities data using the specific GraphQL query
        let propertyAmenitiesData = '';
        let amenitiesSummary = [];
        let outdoorAmenities = [];
        let nearbyPlaces = [];

        try {
            if (propertyId) {
                console.log("Fetching comprehensive property amenities data for enhanced outdoor activities analysis...");
                const amenitiesResponse = await fetchPropertyAmenitiesDataGraphQL(propertyId);

                // Extract amenities data from the response
                const propertyInfo = amenitiesResponse?.[0]?.data?.propertyInfo;
                if (propertyInfo) {
                    // Extract top amenities from summary
                    const topAmenities = propertyInfo?.summary?.amenities?.topAmenities?.infoItems || [];
                    amenitiesSummary = topAmenities.map(item => item.text || '').filter(text => text);

                    // Extract detailed amenities sections, especially "Outdoors" and "Spa"
                    const amenitiesSections = propertyInfo?.summary?.amenities?.amenities || [];
                    amenitiesSections.forEach(section => {
                        if (section.header?.text === "Outdoors" || section.header?.text === "Spa" ||
                            section.header?.text?.toLowerCase().includes('recreation') ||
                            section.header?.text?.toLowerCase().includes('activities')) {
                            const sectionItems = section.infoItems || [];
                            const sectionAmenities = sectionItems.map(item => item.text || '').filter(text => text);
                            outdoorAmenities.push(...sectionAmenities);
                        }
                    });

                    // Extract detailed amenities from property content sections
                    const contentSections = propertyInfo?.propertyContentSectionGroups?.amenities?.sections || [];
                    contentSections.forEach(section => {
                        const subSections = section.bodySubSections || [];
                        subSections.forEach(subSection => {
                            const elements = subSection.elementsV2 || [];
                            elements.forEach(elementGroup => {
                                const groupElements = elementGroup.elements || [];
                                groupElements.forEach(element => {
                                    if (element.header?.text === "Outdoors" ||
                                        element.header?.text === "Spa" ||
                                        element.header?.text?.toLowerCase().includes('recreation') ||
                                        element.header?.text?.toLowerCase().includes('activities')) {
                                        const items = element.items || [];
                                        items.forEach(item => {
                                            if (item.content?.primary?.value) {
                                                outdoorAmenities.push(item.content.primary.value);
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    });

                    // Extract location description and nearby places
                    const locationDescription = propertyInfo?.summary?.location?.locationDescription?.text || '';
                    const nearbyPOIs = propertyInfo?.summary?.location?.whatsAround?.nearbyPOIs || [];
                    nearbyPOIs.forEach(poiSection => {
                        const infoItems = poiSection.infoItems || [];
                        infoItems.forEach(item => {
                            if (item.text) {
                                nearbyPlaces.push({
                                    name: item.text,
                                    moreInfo: item.moreInfo || ''
                                });
                            }
                        });
                    });

                    // Create structured amenities data for LLM analysis
                    propertyAmenitiesData = JSON.stringify({
                        topAmenities: amenitiesSummary.slice(0, 15),
                        outdoorAmenities: [...new Set(outdoorAmenities)].slice(0, 20), // Remove duplicates
                        nearbyPlaces: nearbyPlaces.slice(0, 10),
                        locationDescription: locationDescription.substring(0, 500)
                    }, null, 2);

                    console.log(`Extracted ${amenitiesSummary.length} top amenities, ${outdoorAmenities.length} outdoor amenities, ${nearbyPlaces.length} nearby places`);
                } else {
                    console.warn("No property info found in amenities response");
                }
            } else {
                console.warn("No property ID available for amenities data");
            }
        } catch (error) {
            console.error("Failed to fetch property amenities data:", error);
            propertyAmenitiesData = 'Property amenities data unavailable';
        }

        // Fetch and analyze webpage content using existing pattern
        let webpageContent = '';
        let webpageTitle = '';
        let webpageDescription = '';

        try {
            const webpageHtml = await fetchExpediaData(expediaHotelUrl);

            const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
            webpageTitle = titleMatch ? titleMatch[1].trim() : '';

            const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
            webpageDescription = descMatch ? descMatch[1].trim() : '';

            let textContent = webpageHtml
                .replace(/<script[^>]*>.*?<\/script>/gis, '')
                .replace(/<style[^>]*>.*?<\/style>/gis, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            if (textContent.length > 2000) {
                const keywordSections = textContent.match(/(?:amenities?|facilities?|outdoor|activities?|recreation|entertainment|sports?|water|beach|pool|spa|fitness|tennis|golf|hiking|skiing|mountain|valley|river|ocean|garden|balcony|deck|patio|grill|bbq|fishing|diving|surfing|swimming|volleyball|basketball|playground|park)[^.!?]*[.!?]/gi);
                webpageContent = keywordSections && keywordSections.length > 0 ? keywordSections.join(' ').substring(0, 2000) : textContent.substring(0, 2000);
            } else {
                webpageContent = textContent;
            }

        } catch (error) {
            console.error("Failed to fetch Expedia webpage content:", error);
            webpageContent = 'Unable to fetch webpage content';
        }        // Create conservative, data-driven prompt for LLM analysis to prevent hallucination
        const outdoorPrompt = `You are a conservative data analyst. Analyze the provided hotel data and select ONLY outdoor activities that are explicitly mentioned or directly confirmed in the data. DO NOT make assumptions or infer activities that are not clearly stated.

Hotel Name: ${hotelName || 'Unknown Hotel'}
Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}
Webpage Content: ${webpageContent}

Property Amenities Data (from GraphQL - structured property data):
${propertyAmenitiesData}

VALID OUTDOOR ACTIVITY OPTIONS (you MUST use these EXACT names only):
1. "Balcony"
2. "Basketball"
3. "Beach"
4. "Bicycles"
5. "Boat"
6. "Camping"
7. "Cave"
8. "Cove"
9. "Deck"
10. "Deck / Patio"
11. "Fishing"
12. "Garden"
13. "Golf"
14. "Grill"
15. "Hiking"
16. "Hills"
17. "Horse Back Riding"
18. "Hunting"
19. "Ice Skating"
20. "Island Hopping"
21. "Kayak / Canoe"
22. "Lawn / Garden"
23. "Mountain"
24. "Ocean"
25. "Outdoor Grill"
26. "Park"
27. "Playground"
28. "Resort"
29. "River"
30. "Scuba Diving"
31. "Ski"
32. "Snowboard"
33. "Spa / Massage"
34. "Surfing"
35. "Swimming"
36. "Tennis"
37. "Trekking"
38. "Valley"
39. "Volleyball"
40. "Water Sports Gear"
41. "Waterfalls"

CRITICAL INSTRUCTIONS:
- You MUST only return activities using the EXACT names listed above (case-sensitive)
- DO NOT return "Rooftop terrace", "Outdoor seating area", "Patio", "Swimming pool", "Tennis court", "Bicycle rental" or any other names
- DO NOT return generic activity descriptions or made-up names
- DO NOT make up activity names
- If you find evidence for swimming, return "Swimming" (not "Swimming pool")
- If you find evidence for tennis, return "Tennis" (not "Tennis court")

STRICT VALIDATION RULES:
1. ONLY select activities that are explicitly mentioned by name in the provided data
2. ONLY select amenities that are directly listed in the Property Amenities Data
3. DO NOT infer or assume activities based on location or similar properties
4. DO NOT select activities that "might be nearby" without explicit mention
5. If an activity is mentioned as being "nearby" or "accessible", it must include specific confirmation of availability
6. When in doubt, DO NOT include the activity
7. NEVER return activity names that are not in the valid list above

EVIDENCE REQUIREMENTS:
- For "Swimming": Look for explicit mentions of "swimming pool", "pool access", "swimming facilities", or "swimming available"
- For "Beach": Look for explicit mentions of "beach", "beachfront", "beach access", or "oceanfront"
- For "Golf": Look for explicit mentions of "golf course", "golf", "golfing", or "golf facilities"
- For "Spa / Massage": Look for explicit mentions of "spa", "massage", "wellness center", or "spa services"
- For "Garden": Look for explicit mentions of "garden", "gardens", "landscaped grounds", or "botanical"
- For "Tennis": Look for explicit mentions of "tennis court", "tennis", or "tennis facilities"
- For "Balcony": Look for explicit mentions of "balcony", "private balcony", or "terrace"
- For "Deck / Patio": Look for explicit mentions of "deck", "patio", "outdoor deck", or "terrace"
- For all other activities: Require specific, explicit mentions in the provided data

Return ONLY a JSON array containing the EXACT activity names from the valid list above that meet the strict evidence requirements. If no activities meet the criteria, return an empty array [].

VALID example responses (use exact names from list):
- ["Swimming", "Garden", "Beach"] (only if explicitly mentioned)
- ["Tennis", "Spa / Massage", "Golf"] (only if explicitly mentioned)
- [] (if no activities are explicitly confirmed)

INVALID example responses (DO NOT use these):
- ["Rooftop terrace", "Swimming pool", "Tennis court", "Bicycle rental"] (not exact names from valid list)
- ["Outdoor seating area", "Patio", "Beach access"] (not exact names from valid list)

Be extremely conservative - it's better to miss an activity than to incorrectly include one that isn't explicitly confirmed in the data.`;

        try {
            // Check if API key is configured
            const apiKey = GM_getValue('togetherApiKey', '');
            if (!apiKey) {
                console.warn("No Together.ai API key configured. Using heuristic detection.");
                throw new Error("NO_API_KEY");
            }            // Try LLM analysis
            let outdoorSuggestions = [];
            const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                    messages: [{ role: 'user', content: outdoorPrompt }],
                    max_tokens: 500,
                    temperature: 0.1
                })
            });            if (response.ok) {
                const data = await response.json();
                const llmResponse = data.choices?.[0]?.message?.content?.trim();

                if (llmResponse) {
                    const jsonMatch = llmResponse.match(/\[[\s\S]*?\]/);
                    if (jsonMatch) {
                        const rawSuggestions = JSON.parse(jsonMatch[0]);
                        console.log("LLM raw outdoor suggestions:", rawSuggestions);

                        // Validate LLM response - only include valid outdoor activity names
                        const validOutdoorActivities = Object.values(outDoorMapping);
                        outdoorSuggestions = rawSuggestions.filter(suggestion => {
                            const isValid = validOutdoorActivities.includes(suggestion);
                            if (!isValid) {
                                console.warn(`LLM suggested invalid outdoor activity: "${suggestion}" - filtering out`);
                            }
                            return isValid;
                        });

                        console.log("LLM validated outdoor suggestions:", outdoorSuggestions);

                        // Log any invalid suggestions for debugging
                        const invalidSuggestions = rawSuggestions.filter(suggestion => !validOutdoorActivities.includes(suggestion));
                        if (invalidSuggestions.length > 0) {
                            console.warn("Invalid outdoor activity suggestions filtered out:", invalidSuggestions);
                        }
                    }
                }
            }

            // Apply suggestions to checkboxes
            let checkedCount = 0;
            Object.entries(outDoorMapping).forEach(([checkboxId, activityName]) => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    checkbox.checked = outdoorSuggestions.includes(activityName);
                    if (checkbox.checked) checkedCount++;
                }
            });

            return {
                success: true,
                method: "llm_analysis",
                checkedCount: checkedCount,
                checkedActivities: outdoorSuggestions
            };

        } catch (error) {
            console.warn("LLM failed, using enhanced heuristic detection with GraphQL data:", error);

            // Enhanced fallback heuristic detection with GraphQL data
            let outdoorSuggestions = [];
            const allContent = (webpageTitle + ' ' + webpageDescription + ' ' + webpageContent).toLowerCase();
              // Include property amenities data in heuristic analysis
            let amenitiesContent = '';
            if (nearbyPlaces.length > 0 || amenitiesSummary.length > 0 || outdoorAmenities.length > 0) {
                const nearbyPlacesText = nearbyPlaces.map(place => place.name || '').join(' ');
                const summaryText = amenitiesSummary.join(' ');
                const outdoorText = outdoorAmenities.join(' ');
                amenitiesContent = (nearbyPlacesText + ' ' + summaryText + ' ' + outdoorText).toLowerCase();
                console.log("Using property amenities data for enhanced heuristic detection");
            }

            const combinedContent = allContent + ' ' + amenitiesContent;

            // Heuristic matching patterns
            const patterns = {
                "Balcony": /\b(balcony|terrace|private.?outdoor)\b/,
                "Basketball": /\b(basketball|sports.?court)\b/,
                "Beach": /\b(beach|beachfront|sandy.?beach|coastline)\b/,
                "Bicycles": /\b(bicycles?|bike.?rental|cycling)\b/,
                "Boat": /\b(boat|boating|marina|water.?access)\b/,
                "Camping": /\b(camping|campground)\b/,
                "Cave": /\b(cave|cave.?exploration|underground)\b/,
                "Cove": /\b(cove|secluded.?bay)\b/,
                "Deck": /\b(deck|outdoor.?deck|outdoor.?space)\b/,
                "Deck / Patio": /\b(patio|outdoor.?dining|terrace)\b/,
                "Fishing": /\b(fishing|angling|fishing.?charter)\b/,
                "Garden": /\b(garden|landscaped|botanical|green.?space)\b/,
                "Golf": /\b(golf|golf.?course|golfing)\b/,
                "Grill": /\b(grill|bbq|barbecue|outdoor.?cooking)\b/,
                "Hiking": /\b(hiking|trekking|nature.?walk|trail)\b/,
                "Hills": /\b(hill|hilly|rolling.?hills)\b/,
                "Horse Back Riding": /\b(horseback|horse.?riding|equestrian)\b/,
                "Hunting": /\b(hunting|game.?hunting)\b/,
                "Ice Skating": /\b(ice.?skating|ice.?rink)\b/,
                "Island Hopping": /\b(island.?hopping|island.?tour)\b/,
                "Kayak / Canoe": /\b(kayak|canoe|kayaking|canoeing)\b/,
                "Lawn / Garden": /\b(lawn|grass.?area|garden.?space)\b/,
                "Mountain": /\b(mountain|mountainous|mountain.?view)\b/,
                "Ocean": /\b(ocean|oceanfront|ocean.?view|seaside)\b/,
                "Outdoor Grill": /\b(outdoor.?grill|outdoor.?bbq)\b/,
                "Park": /\b(park|recreational.?park)\b/,
                "Playground": /\b(playground|children.?play|kids.?area)\b/,
                "Resort": /\b(resort|resort.?facilities)\b/,
                "River": /\b(river|riverside|river.?view|waterway)\b/,
                "Scuba Diving": /\b(scuba.?diving|diving|underwater)\b/,
                "Ski": /\b(ski|skiing|ski.?slope)\b/,
                "Snowboard": /\b(snowboard|snowboarding|snow.?sports)\b/,
                "Spa / Massage": /\b(spa|massage|wellness|spa.?facilities)\b/,
                "Surfing": /\b(surfing|surf|wave.?riding)\b/,
                "Swimming": /\b(swimming|swim|pool|swimming.?pool)\b/,
                "Tennis": /\b(tennis|tennis.?court)\b/,
                "Trekking": /\b(trekking|long.?distance.?hiking)\b/,
                "Valley": /\b(valley|valley.?view)\b/,
                "Volleyball": /\b(volleyball|beach.?volleyball)\b/,
                "Water Sports Gear": /\b(water.?sports.?gear|equipment.?rental)\b/,
                "Waterfalls": /\b(waterfall|waterfall.?access|cascade)\b/
            };

            Object.entries(patterns).forEach(([activity, pattern]) => {
                if (pattern.test(combinedContent)) {
                    outdoorSuggestions.push(activity);
                }
            });            // Apply enhanced heuristic suggestions
            let checkedCount = 0;
            Object.entries(outDoorMapping).forEach(([checkboxId, activityName]) => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    checkbox.checked = outdoorSuggestions.includes(activityName);
                    if (checkbox.checked) checkedCount++;
                }
            });

            return {
                success: true,
                method: amenitiesContent ? "heuristic_with_amenities" : "heuristic_fallback",
                checkedCount: checkedCount,
                checkedActivities: outdoorSuggestions
            };
        }    }    // Function to automate safety checklist checkboxes with LLM analysis and heuristic fallback
    async function automateSafetyChecklistCheckboxes() {
        try {
            console.log('Starting safety checklist automation...');

            // Safety checklist mapping based on Step4 form structure - using ID-based selectors like other sections
            const safetyMapping = {
                "Safety_0__Checked": "Smoke detector",
                "Safety_1__Checked": "Carbon monoxide detector",
                "Safety_2__Checked": "First aid kit",
                "Safety_3__Checked": "Fire extinguisher",
                "Safety_4__Checked": "Emergency exit"
            };

            // Check for safety checkboxes using ID-based selector pattern like other sections
            let foundCheckboxes = 0;
            Object.keys(safetyMapping).forEach(checkboxId => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    foundCheckboxes++;
                }
            });

            console.log(`Found ${foundCheckboxes} safety checkboxes using ID-based selectors`);

            // Debug: Log which specific checkboxes were found
            Object.entries(safetyMapping).forEach(([checkboxId, safetyName]) => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    console.log(`✓ Found safety checkbox: ${checkboxId} (${safetyName})`);
                } else {
                    console.log(`✗ Missing safety checkbox: ${checkboxId} (${safetyName})`);
                }
            });

            if (foundCheckboxes === 0) {
                // Fallback to try name-based selectors
                const nameBasedCheckboxes = document.querySelectorAll('input[type="checkbox"][name*="safety" i]');
                console.log(`Fallback: Found ${nameBasedCheckboxes.length} safety checkboxes using name-based selectors`);

                if (nameBasedCheckboxes.length === 0) {
                    console.log('No safety checkboxes found with either ID or name-based selectors');
                    return { success: false, message: 'No safety checkboxes found' };
                }
            }            // Get property ID for fetching comprehensive amenities data
            const propertyId = GM_getValue("propertyId", null);

            // Fetch comprehensive property amenities data using the specific GraphQL query
            let propertyAmenitiesData = '';
            let amenitiesSummary = [];
            let safetyAmenities = [];

            try {
                if (propertyId) {
                    console.log("Fetching comprehensive property amenities data for enhanced safety analysis...");
                    const amenitiesResponse = await fetchPropertyAmenitiesDataGraphQL(propertyId);

                    // Extract amenities data from the response
                    const propertyInfo = amenitiesResponse?.[0]?.data?.propertyInfo;
                    if (propertyInfo) {
                        // Extract top amenities from summary
                        const topAmenities = propertyInfo?.summary?.amenities?.topAmenities?.infoItems || [];
                        amenitiesSummary = topAmenities.map(item => item.text || '').filter(text => text);

                        // Extract detailed amenities sections, especially safety-related
                        const amenitiesSections = propertyInfo?.summary?.amenities?.amenities || [];
                        amenitiesSections.forEach(section => {
                            const sectionHeader = section.header?.text?.toLowerCase() || '';
                            if (sectionHeader.includes('safety') || sectionHeader.includes('security') ||
                                sectionHeader.includes('health') || sectionHeader.includes('access')) {
                                const sectionItems = section.infoItems || [];
                                safetyAmenities.push(...sectionItems.map(item => item.text || '').filter(text => text));
                            }
                        });

                        // Combine all amenities for comprehensive analysis
                        propertyAmenitiesData = [...amenitiesSummary, ...safetyAmenities].join(' ');
                        console.log("Extracted safety-related amenities:", safetyAmenities);
                        console.log("Combined amenities data length:", propertyAmenitiesData.length);
                    }
                }
            } catch (error) {
                console.error("Error fetching property amenities data for safety analysis:", error);
            }

            let safetySuggestions = [];
            let checkedCount = 0;

            // Try LLM analysis first if amenities data is available
            if (propertyAmenitiesData && propertyAmenitiesData.length > 20) {
                console.log('Attempting LLM analysis for safety amenities...');

                try {
                    const prompt = `Based on this property amenities data, which safety amenities would be most appropriate? Choose from: ${Object.values(safetyMapping).join(', ')}.

Property Amenities: "${propertyAmenitiesData}"

Please respond with only the safety amenities that would be most relevant and appropriate for this type of property, separated by commas. Focus on essential safety items that would be expected for this property type.`;

                    const llmResponse = await callLLMAPI(prompt);
                    console.log('LLM response for safety:', llmResponse);

                    if (llmResponse && typeof llmResponse === 'string') {
                        const suggestions = llmResponse.toLowerCase().split(',').map(s => s.trim());

                        // Find matching safety amenities
                        Object.entries(safetyMapping).forEach(([key, value]) => {
                            const found = suggestions.some(suggestion =>
                                suggestion.includes(value.toLowerCase()) ||
                                value.toLowerCase().includes(suggestion)
                            );
                            if (found) {
                                safetySuggestions.push(key);
                            }
                        });

                        console.log('LLM safety suggestions:', safetySuggestions);
                    }
                } catch (error) {
                    console.log('LLM analysis failed for safety, using heuristic approach:', error);
                }
            }            // Heuristic fallback if LLM failed or no suggestions
            if (safetySuggestions.length === 0) {
                console.log('Using heuristic approach for safety amenities...');

                // Basic safety items that are commonly expected (using checkbox IDs)
                const basicSafetyItems = ['Safety_0__Checked', 'Safety_2__Checked']; // Smoke detector, First aid kit

                // Enhanced safety for certain property types
                if (propertyAmenitiesData) {
                    const amenitiesText = propertyAmenitiesData.toLowerCase();

                    // Add carbon monoxide detector for properties with heating/cooking
                    if (amenitiesText.includes('kitchen') || amenitiesText.includes('heating') ||
                        amenitiesText.includes('fireplace') || amenitiesText.includes('gas')) {
                        basicSafetyItems.push('Safety_1__Checked'); // Carbon monoxide detector
                    }

                    // Add fire extinguisher for kitchen properties
                    if (amenitiesText.includes('kitchen') || amenitiesText.includes('cooking')) {
                        basicSafetyItems.push('Safety_3__Checked'); // Fire extinguisher
                    }

                    // Add emergency exit for multi-story or apartment properties
                    if (amenitiesText.includes('apartment') || amenitiesText.includes('floor') ||
                        amenitiesText.includes('upstairs') || amenitiesText.includes('multi')) {
                        basicSafetyItems.push('Safety_4__Checked'); // Emergency exit
                    }
                }

                safetySuggestions = [...new Set(basicSafetyItems)]; // Remove duplicates
                console.log('Heuristic safety suggestions:', safetySuggestions);
            }// Apply suggestions to checkboxes using ID-based approach like other sections
            if (foundCheckboxes > 0) {
                // Use ID-based selectors
                Object.entries(safetyMapping).forEach(([checkboxId, safetyName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        const shouldCheck = safetySuggestions.includes(checkboxId);

                        if (shouldCheck && !checkbox.checked) {
                            checkbox.checked = true;
                            checkedCount++;

                            // Trigger change event
                            const event = new Event('change', { bubbles: true });
                            checkbox.dispatchEvent(event);

                            console.log(`Checked safety amenity: ${safetyName} (${checkboxId})`);
                        }
                    }
                });
            } else {
                // Fallback to name-based selectors
                const nameBasedCheckboxes = document.querySelectorAll('input[type="checkbox"][name*="safety" i]');
                nameBasedCheckboxes.forEach(checkbox => {
                    const checkboxName = checkbox.name.toLowerCase();
                    const shouldCheck = safetySuggestions.some(suggestion => {
                        // Convert ID-based suggestion to name pattern for matching
                        const safetyName = safetyMapping[suggestion];
                        if (safetyName) {
                            const namePattern = safetyName.toLowerCase().replace(/\s+/g, '_');
                            return checkboxName.includes(namePattern) ||
                                   checkboxName.includes('smoke') && safetyName.includes('Smoke') ||
                                   checkboxName.includes('carbon') && safetyName.includes('Carbon') ||
                                   checkboxName.includes('first_aid') && safetyName.includes('First aid') ||
                                   checkboxName.includes('fire_extinguisher') && safetyName.includes('Fire extinguisher') ||
                                   checkboxName.includes('emergency') && safetyName.includes('Emergency');
                        }
                        return false;
                    });

                    if (shouldCheck && !checkbox.checked) {
                        checkbox.checked = true;
                        checkedCount++;

                        // Trigger change event
                        const event = new Event('change', { bubbles: true });
                        checkbox.dispatchEvent(event);

                        console.log(`Checked safety amenity: ${checkbox.name}`);
                    }
                });
            }

            console.log(`Safety checklist automation completed. Checked ${checkedCount} items.`);

            return {
                success: true,
                message: `Successfully automated safety checklist. Checked ${checkedCount} safety amenities.`,
                checkedCount: checkedCount,
                checkedSafety: safetySuggestions
            };

        } catch (error) {
            console.error('Error in safety checklist automation:', error);
            return {
                success: false,
                message: 'Error during safety checklist automation: ' + error.message
            };
        }
        }        // Function to automate other services checkboxes using enhanced property amenities data
        async function automateOtherServicesCheckboxes(hotelName, expediaHotelUrl) {
            console.log("Starting enhanced other services detection using property amenities GraphQL data...");

            // Available other services checkboxes from the form
            const otherServicesMapping = {
                "OtherService_0__Checked": "Car / Service Vehicle",
                "OtherService_1__Checked": "Chauffeur",
                "OtherService_2__Checked": "Concierge",
                "OtherService_3__Checked": "Massage",
                "OtherService_4__Checked": "Private Chef",
                "OtherService_5__Checked": "Staff"
            };

            // Get property ID for fetching comprehensive amenities data
            const propertyId = GM_getValue("propertyId", null);

            // Get selectedRoom data for room-specific amenities
            const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
            let selectedRoom = null;
            if (selectedRoomJSON) {
                try {
                    selectedRoom = JSON.parse(selectedRoomJSON);
                } catch (error) {
                    console.warn("Could not parse selectedRoomDetails:", error);
                }
            }

            // Extract service amenities from GraphQL data
            let serviceAmenities = [];
            let amenitiesSummary = [];
            let roomServiceAmenities = [];
            let propertyAmenitiesData = '';            // Fetch property amenities data
            try {
                if (propertyId) {
                    const amenitiesResponse = await fetchPropertyAmenitiesDataGraphQL(propertyId);
                    const propertyInfo = amenitiesResponse?.[0]?.data?.propertyInfo;
                    if (propertyInfo) {
                        // Extract top amenities from summary
                        const topAmenities = propertyInfo?.summary?.amenities?.topAmenities?.infoItems || [];
                        amenitiesSummary = topAmenities.map(item => item.text || '').filter(text => text);

                        // Extract detailed amenities sections, especially "Service" and "Concierge"
                        const amenitiesSections = propertyInfo?.summary?.amenities?.amenities || [];
                        amenitiesSections.forEach(section => {
                            if (section.header?.text === "Services" || section.header?.text === "Service" ||
                                section.header?.text === "Concierge" || section.header?.text === "Staff" ||
                                section.header?.text?.toLowerCase().includes('service') ||
                                section.header?.text?.toLowerCase().includes('concierge') ||
                                section.header?.text?.toLowerCase().includes('staff') ||
                                section.header?.text?.toLowerCase().includes('massage') ||
                                section.header?.text?.toLowerCase().includes('chef') ||
                                section.header?.text?.toLowerCase().includes('transport')) {
                                const sectionItems = section.infoItems || [];
                                const sectionAmenities = sectionItems.map(item => item.text || '').filter(text => text);
                                serviceAmenities.push(...sectionAmenities);
                            }
                        });

                        // Extract detailed amenities from property content sections
                        const contentSections = propertyInfo?.propertyContentSectionGroups?.amenities?.sections || [];
                        contentSections.forEach(section => {
                            const subSections = section.bodySubSections || [];
                            subSections.forEach(subSection => {
                                const elements = subSection.elementsV2 || [];
                                elements.forEach(elementGroup => {
                                    const groupElements = elementGroup.elements || [];
                                    groupElements.forEach(element => {
                                        if (element.header?.text === "Services" ||
                                            element.header?.text === "Concierge" ||
                                            element.header?.text === "Transportation" ||
                                            element.header?.text === "Spa Services" ||
                                            element.header?.text === "Additional Services") {
                                            const elementItems = element.infoItems || [];
                                            const elementAmenities = elementItems.map(item => item.text || '').filter(text => text);
                                            serviceAmenities.push(...elementAmenities);
                                        }
                                    });
                                });
                            });
                        });

                        // Construct structured property data summary for LLM analysis
                        const serviceText = serviceAmenities.join(', ');
                        const summaryText = amenitiesSummary.join(', ');
                        propertyAmenitiesData = `Service Amenities: ${serviceText}\nTop Amenities: ${summaryText}`;

                        console.log("Extracted service amenities data:", { serviceAmenities, amenitiesSummary });
                    }
                } else {
                    console.warn("No property ID available for amenities data");
                }
            } catch (error) {
                console.error("Failed to fetch property amenities data:", error);
                propertyAmenitiesData = 'Property amenities data unavailable';
            }

            // Extract service amenities from selected room data
            try {
                if (selectedRoom && selectedRoom.roomAmenities) {
                    // Check for service amenities in room data
                    if (selectedRoom.roomAmenities.services && Array.isArray(selectedRoom.roomAmenities.services)) {
                        roomServiceAmenities = selectedRoom.roomAmenities.services;
                    } else if (selectedRoom.roomAmenities.general && Array.isArray(selectedRoom.roomAmenities.general)) {
                        // Look for service-related amenities in general section
                        roomServiceAmenities = selectedRoom.roomAmenities.general.filter(amenity => {
                            const amenityLower = amenity.toLowerCase();
                            return amenityLower.includes('service') || amenityLower.includes('concierge') ||
                                   amenityLower.includes('staff') || amenityLower.includes('massage') ||
                                   amenityLower.includes('chef') || amenityLower.includes('transport') ||
                                   amenityLower.includes('chauffeur');
                        });
                    }

                    console.log("Extracted room service amenities:", roomServiceAmenities);
                }
            } catch (error) {
                console.warn("Error extracting room service amenities:", error);
            }

            // Fetch webpage content for additional analysis
            let webpageTitle = '';
            let webpageDescription = '';
            let webpageContent = '';

            try {
                const response = await fetch(expediaHotelUrl);
                const webpageHtml = await response.text();

                const titleMatch = webpageHtml.match(/<title[^>]*>([^<]*)<\/title>/i);
                webpageTitle = titleMatch ? titleMatch[1].trim() : '';

                const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
                webpageDescription = descMatch ? descMatch[1].trim() : '';

                let textContent = webpageHtml
                    .replace(/<script[^>]*>.*?<\/script>/gis, '')
                    .replace(/<style[^>]*>.*?<\/style>/gis, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (textContent.length > 2000) {
                    webpageContent = textContent.substring(0, 2000) + '...';
                } else {
                    webpageContent = textContent;
                }

                console.log("Extracted webpage content for service analysis");
            } catch (error) {
                console.warn("Error fetching webpage content:", error);
                webpageContent = 'Unable to fetch webpage content';
            }

            // Create conservative, data-driven prompt for LLM analysis to prevent hallucination
            const servicesPrompt = `You are a conservative data analyst. Analyze the provided hotel data and select ONLY other services that are explicitly mentioned or directly confirmed in the data. DO NOT make assumptions or infer services that are not clearly stated.

Hotel Name: ${hotelName || 'Unknown Hotel'}
Room Type: ${selectedRoom?.name || 'Unknown Room'}
Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}
Webpage Content: ${webpageContent}

Property Amenities Data (from GraphQL - structured property data):
${propertyAmenitiesData}

VALID SERVICE OPTIONS (you MUST use these EXACT names only):
1. "Car / Service Vehicle"
2. "Chauffeur"
3. "Concierge"
4. "Massage"
5. "Private Chef"
6. "Staff"

STRICT VALIDATION RULES:
1. ONLY select services that are explicitly mentioned by name in the provided data
2. ONLY select services that are directly listed in the Property Amenities Data
3. DO NOT infer or assume services based on property type or similar accommodations
4. DO NOT select services that "might be available" without explicit mention
5. If a service is mentioned as being "available" or "provided", it must include specific confirmation
6. When in doubt, DO NOT include the service
7. NEVER return service names that are not in the valid list above

EVIDENCE REQUIREMENTS:
- For "Car / Service Vehicle": Look for explicit mentions of "car service", "vehicle service", "transportation service", "shuttle", "transfer service", or "transport"
- For "Chauffeur": Look for explicit mentions of "chauffeur", "driver service", "private driver", or "chauffeured service"
- For "Concierge": Look for explicit mentions of "concierge", "concierge service", "guest services", or "front desk assistance"
- For "Massage": Look for explicit mentions of "massage", "massage service", "spa massage", "therapeutic massage", or "massage therapy"
- For "Private Chef": Look for explicit mentions of "private chef", "chef service", "personal chef", "cooking service", or "culinary service"
- For "Staff": Look for explicit mentions of "staff", "housekeeping", "cleaning service", "maid service", or "service personnel"

Return ONLY a JSON array containing services that meet these strict evidence requirements. If no services meet the criteria, return an empty array [].

Example valid responses:
- ["Concierge", "Massage", "Staff"] (only if explicitly mentioned)
- ["Private Chef", "Chauffeur"] (only if explicitly mentioned)
- [] (if no services are explicitly confirmed)

Be extremely conservative - it's better to miss a service than to incorrectly include one that isn't explicitly confirmed in the data.`;

            try {
                // Check if API key is configured
                const apiKey = GM_getValue('togetherApiKey', '');
                if (!apiKey) {
                    console.warn("No Together.ai API key configured. Using heuristic detection.");
                    throw new Error("NO_API_KEY");
                }

                // Try LLM analysis
                let servicesSuggestions = [];
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [{ role: 'user', content: servicesPrompt }],
                        max_tokens: 600,
                        temperature: 0.1
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const llmResponse = data.choices?.[0]?.message?.content?.trim();

                    if (llmResponse) {
                        const jsonMatch = llmResponse.match(/\[[\s\S]*?\]/);
                        if (jsonMatch) {
                            const rawSuggestions = JSON.parse(jsonMatch[0]);
                            console.log("LLM raw other services suggestions:", rawSuggestions);

                            // Validate LLM response - only include valid service names
                            const validServices = Object.values(otherServicesMapping);
                            servicesSuggestions = rawSuggestions.filter(suggestion => {
                                const isValid = validServices.includes(suggestion);
                                if (!isValid) {
                                    console.warn(`LLM suggested invalid service: "${suggestion}" - filtering out`);
                                }
                                return isValid;
                            });

                            console.log("LLM validated other services suggestions:", servicesSuggestions);

                            // Log any invalid suggestions for debugging
                            const invalidSuggestions = rawSuggestions.filter(suggestion => !validServices.includes(suggestion));
                            if (invalidSuggestions.length > 0) {
                                console.warn("Invalid service suggestions filtered out:", invalidSuggestions);
                            }
                        }
                    }
                }

                // Apply suggestions to checkboxes
                let checkedCount = 0;
                Object.entries(otherServicesMapping).forEach(([checkboxId, serviceName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = servicesSuggestions.includes(serviceName);
                        if (checkbox.checked) checkedCount++;
                    }
                });

                return {
                    success: true,
                    method: "llm_analysis",
                    checkedCount: checkedCount,
                    checkedServices: servicesSuggestions
                };

            } catch (error) {
                console.warn("LLM failed, using enhanced heuristic detection with GraphQL data:", error);

                // Enhanced fallback heuristic detection with GraphQL data
                let servicesSuggestions = [];
                const allContent = (webpageTitle + ' ' + webpageDescription + ' ' + webpageContent).toLowerCase();

                // Include property amenities data in heuristic analysis
                let amenitiesContent = '';
                if (serviceAmenities.length > 0 || amenitiesSummary.length > 0 || roomServiceAmenities.length > 0) {
                    const serviceText = serviceAmenities.join(' ');
                    const summaryText = amenitiesSummary.join(' ');
                    const roomServiceText = roomServiceAmenities.join(' ');
                    amenitiesContent = (serviceText + ' ' + summaryText + ' ' + roomServiceText).toLowerCase();
                    console.log("Using property amenities data for enhanced service heuristic detection");
                }

                const combinedContent = allContent + ' ' + amenitiesContent;

                // Heuristic matching patterns
                const patterns = {
                    "Car / Service Vehicle": /\b(car.?service|vehicle.?service|transportation.?service|shuttle|transfer.?service|transport|airport.?transfer|car.?rental)\b/,
                    "Chauffeur": /\b(chauffeur|driver.?service|private.?driver|chauffeured.?service|personal.?driver)\b/,
                    "Concierge": /\b(concierge|concierge.?service|guest.?services|front.?desk.?assistance|reception.?service)\b/,
                    "Massage": /\b(massage|massage.?service|spa.?massage|therapeutic.?massage|massage.?therapy|body.?massage)\b/,
                    "Private Chef": /\b(private.?chef|chef.?service|personal.?chef|cooking.?service|culinary.?service|in.?house.?chef)\b/,
                    "Staff": /\b(staff|housekeeping|cleaning.?service|maid.?service|service.?personnel|domestic.?staff|room.?service)\b/
                };

                Object.entries(patterns).forEach(([serviceName, pattern]) => {
                    if (pattern.test(combinedContent)) {
                        servicesSuggestions.push(serviceName);
                    }
                });

                console.log("Heuristic other services suggestions:", servicesSuggestions);

                // Apply enhanced heuristic suggestions
                let checkedCount = 0;
                Object.entries(otherServicesMapping).forEach(([checkboxId, serviceName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = servicesSuggestions.includes(serviceName);
                        if (checkbox.checked) checkedCount++;
                    }
                });

                return {
                    success: true,
                    method: amenitiesContent ? "heuristic_with_amenities" : "heuristic_fallback",
                    checkedCount: checkedCount,
                    checkedServices: servicesSuggestions
                };
            }
        }

        // Helper function to find the best match for situated in type from LLM response
    function findBestSituatedInMatch(llmResponse, situatedInMapping) {
        const responseClean = llmResponse.trim().toLowerCase();
        const validOptions = Object.values(situatedInMapping);

        // First try exact match (case insensitive)
        for (const option of validOptions) {
            if (responseClean === option.toLowerCase()) {
                return option;
            }
        }

        // Then try partial match (response contains the option name)
        for (const option of validOptions) {
            if (responseClean.includes(option.toLowerCase())) {
                return option;
            }
        }

        // Then try reverse match (option name contains part of response)
        for (const option of validOptions) {
            const optionLower = option.toLowerCase();
            const responseWords = responseClean.split(/\s+/);
            for (const word of responseWords) {
                if (word.length > 3 && optionLower.includes(word)) {
                    return option;
                }
            }
        }

        // Fallback: try to match common synonyms/keywords
        const keywordMap = {
            'hotel': 'Building',
            'resort': 'Building',
            'apartment': 'Building',
            'condo': 'Building',
            'building': 'Building',
            'tower': 'Building',
            'complex': 'Building',
            'castle': 'Castle',
            'fort': 'Castle',
            'fortress': 'Castle',
            'palace': 'Castle',
            'chalet': 'Chalet',
            'ski': 'Chalet',
            'alpine': 'Chalet',
            'chateau': 'Chateau/Country House',
            'manor': 'Chateau/Country House',
            'estate': 'Chateau/Country House',
            'cottage': 'Cottage',
            'cabin': 'Cottage',
            'farmhouse': 'Farmhouse',
            'farm': 'Farmhouse',
            'barn': 'Farmhouse',
            'house': 'House',
            'home': 'House',
            'residential': 'House',
            'lodge': 'Lodge',
            'wilderness': 'Lodge',
            'hunting': 'Lodge',
            'mas': 'Mas',
            'provencal': 'Mas',
            'riad': 'Riad',
            'moroccan': 'Riad',
            'villa': 'Villa',
            'luxury': 'Villa',
            'private': 'Villa'
        };

        for (const [keyword, option] of Object.entries(keywordMap)) {
            if (responseClean.includes(keyword)) {
                return option;
            }
        }

        return null; // No match found
    }

    // LLM-Powered Situated In Type Detection System for Step 4 Property_SituatedInID
    async function automateSituatedInType(hotelName, roomName, expediaHotelUrl) {
        console.log("Starting LLM-powered situated in type detection for Property_SituatedInID dropdown...");

        // Available situated in options from the form
        const situatedInMapping = {
            "1": "Building",
            "2": "Castle",
            "3": "Chalet",
            "4": "Chateau/Country House",
            "5": "Cottage",
            "6": "Farmhouse",
            "7": "House",
            "8": "Lodge",
            "9": "Mas",
            "10": "Riad",
            "11": "Villa"
        };

        // Fetch the actual Expedia TAAP webpage content for analysis
        let webpageContent = '';
        let webpageTitle = '';
        let webpageDescription = '';

        try {
            console.log("Fetching Expedia TAAP webpage content for situated in analysis...");
            const webpageHtml = await fetchExpediaData(expediaHotelUrl);

            // Extract title
            const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
            webpageTitle = titleMatch ? titleMatch[1].trim() : '';

            // Extract meta description
            const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
            webpageDescription = descMatch ? descMatch[1].trim() : '';

            // Extract visible text content (remove HTML tags and script/style content)
            let textContent = webpageHtml
                .replace(/<script[^>]*>.*?<\/script>/gis, '')
                .replace(/<style[^>]*>.*?<\/style>/gis, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Limit content length for LLM processing (keep most relevant parts)
            if (textContent.length > 2000) {
                // Look for sections that might contain property type information
                const keywordSections = textContent.match(/(?:property|accommodation|building|house|villa|castle|chalet|cottage|farmhouse|lodge|hotel|resort|type|style|architecture)[^.!?]*[.!?]/gi);

                if (keywordSections && keywordSections.length > 0) {
                    webpageContent = keywordSections.join(' ').substring(0, 2000);
                } else {
                    webpageContent = textContent.substring(0, 2000);
                }
            } else {
                webpageContent = textContent;
            }

            console.log("Successfully extracted webpage content for situated in analysis");
            console.log("Title:", webpageTitle);
            console.log("Description:", webpageDescription);
            console.log("Content preview:", webpageContent.substring(0, 200) + "...");

        } catch (error) {
            console.error("Failed to fetch Expedia webpage content:", error);
            webpageContent = 'Unable to fetch webpage content';
        }

        // Create prompt for LLM to analyze the actual webpage content
        const situatedInPrompt = `Analyze the following Expedia hotel webpage content to determine what type of property/building this accommodation is situated in. Base your analysis ONLY on what is explicitly mentioned or implied in the webpage content.

Hotel Information:
- Name: ${hotelName || 'Unknown Hotel'}
- Room: ${roomName || 'Unknown Room'}
- Expedia URL: ${expediaHotelUrl}

Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}

Webpage Content:
${webpageContent}

Available property types to choose from:
${Object.entries(situatedInMapping).map(([id, name]) => `${id}. ${name}`).join('\n')}

Please analyze this webpage content and determine which single property type best describes what this accommodation is situated in. Consider:

1. Building: Generic multi-story buildings, apartments, condos, hotels, resorts
2. Castle: Historic castles, fortified structures, medieval buildings
3. Chalet: Mountain lodges, ski chalets, alpine-style buildings
4. Chateau/Country House: Elegant country estates, manor houses, chateaus
5. Cottage: Small rural houses, cozy cottages, quaint properties
6. Farmhouse: Rural farm properties, agricultural settings, barn conversions
7. House: Traditional houses, homes, residential properties
8. Lodge: Hunting lodges, wilderness lodges, rustic accommodations
9. Mas: Traditional Provençal farmhouses (mainly in France)
10. Riad: Traditional Moroccan houses with interior courtyards
11. Villa: Luxury villas, large private houses, upscale residences

IMPORTANT: You must respond with EXACTLY ONE of these property type names: Building, Castle, Chalet, Chateau/Country House, Cottage, Farmhouse, House, Lodge, Mas, Riad, Villa

Return only the single property type name that best matches the content (no explanation, no additional text).`;

        try {
            console.log("Starting LLM-powered situated in type detection...");

            // Check if API key is configured
            const apiKey = GM_getValue('togetherApiKey', '');
            if (!apiKey) {
                console.warn("No Together.ai API key configured. Falling back to heuristic detection.");
                throw new Error("NO_API_KEY");
            }

            // Try to get LLM response for situated in analysis
            let selectedType = '';
            let detectionMethod = '';

            try {
                console.log("Sending situated in analysis request to Together.ai (Llama 3.1 8B Turbo)...");
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a property type analysis expert. Always respond with only the property type name that best matches the content.'
                            },
                            {
                                role: 'user',
                                content: situatedInPrompt
                            }
                        ],
                        max_tokens: 50,
                        temperature: 0.2
                    })
                });                if (response.ok) {
                    const result = await response.json();
                    const llmResponse = result.choices[0].message.content.trim();
                    console.log("LLM response for situated in type:", llmResponse);

                    // Enhanced parsing to find the best match from valid options
                    selectedType = findBestSituatedInMatch(llmResponse, situatedInMapping);
                    if (selectedType) {
                        detectionMethod = webpageContent && webpageContent !== 'Unable to fetch webpage content' ? 'Webpage-Content-LLM' : 'LLM';
                        console.log(`LLM selected situated in type: ${selectedType}`);
                    } else {
                        console.warn("LLM response could not be matched to any available property types:", llmResponse);
                    }
                } else {
                    console.warn("LLM API request failed:", response.status, response.statusText);
                }
            } catch (apiError) {
                console.warn("LLM API error:", apiError.message);
            }

            // Fallback logic if LLM fails - use content-based heuristics when available
            if (!selectedType) {
                console.log("Using fallback heuristic-based situated in type detection...");

                // If we have webpage content, use it for better heuristics
                if (webpageContent && webpageContent !== 'Unable to fetch webpage content') {
                    const contentLower = webpageContent.toLowerCase();
                    const titleLower = webpageTitle.toLowerCase();
                    const descLower = webpageDescription.toLowerCase();
                    const allContent = (contentLower + ' ' + titleLower + ' ' + descLower).toLowerCase();

                    console.log("Using webpage content for enhanced heuristic situated in detection...");

                    // Content-based detection with priority order
                    if (allContent.match(/\b(castle|fort|fortress|medieval|historic castle|chateau|palace)\b/)) {
                        selectedType = "Castle";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(chalet|ski lodge|alpine|mountain lodge|ski chalet)\b/)) {
                        selectedType = "Chalet";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(villa|luxury villa|private villa|estate villa)\b/)) {
                        selectedType = "Villa";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(riad|moroccan|marrakech|fez|traditional riad)\b/)) {
                        selectedType = "Riad";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(mas|provencal|provence|traditional mas)\b/)) {
                        selectedType = "Mas";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(cottage|cozy cottage|rural cottage|country cottage)\b/)) {
                        selectedType = "Cottage";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(farmhouse|farm house|agricultural|barn|rural farm)\b/)) {
                        selectedType = "Farmhouse";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(lodge|hunting lodge|wilderness lodge|mountain lodge|safari lodge)\b/)) {
                        selectedType = "Lodge";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(chateau|country house|manor|estate|country estate)\b/)) {
                        selectedType = "Chateau/Country House";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(house|home|residential|private house|townhouse)\b/)) {
                        selectedType = "House";
                        detectionMethod = 'Content-Heuristic';
                    } else if (allContent.match(/\b(hotel|resort|apartment|condo|building|tower|complex)\b/)) {
                        selectedType = "Building";
                        detectionMethod = 'Content-Heuristic';
                    }
                } else {
                    // Basic heuristics based on hotel name when no webpage content
                    const hotelNameLower = (hotelName || '').toLowerCase();
                    const roomNameLower = (roomName || '').toLowerCase();
                    const combinedName = (hotelNameLower + ' ' + roomNameLower).toLowerCase();

                    console.log("Using basic name-based heuristics as final fallback...");

                    if (combinedName.match(/\b(villa|luxury villa|private villa)\b/)) {
                        selectedType = "Villa";
                        detectionMethod = 'Name-Heuristic';
                    } else if (combinedName.match(/\b(castle|chateau|palace)\b/)) {
                        selectedType = "Castle";
                        detectionMethod = 'Name-Heuristic';
                    } else if (combinedName.match(/\b(chalet|ski|alpine)\b/)) {
                        selectedType = "Chalet";
                        detectionMethod = 'Name-Heuristic';
                    } else if (combinedName.match(/\b(cottage|cozy)\b/)) {
                        selectedType = "Cottage";
                        detectionMethod = 'Name-Heuristic';
                    } else if (combinedName.match(/\b(lodge|wilderness|safari)\b/)) {
                        selectedType = "Lodge";
                        detectionMethod = 'Name-Heuristic';
                    } else if (combinedName.match(/\b(house|home)\b/)) {
                        selectedType = "House";
                        detectionMethod = 'Name-Heuristic';
                    } else {
                        // Default to Building for hotels, resorts, apartments
                        selectedType = "Building";
                        detectionMethod = 'Default-Heuristic';
                    }                }
            }

            // Final fallback: if still no type selected, use intelligent default based on context
            if (!selectedType) {
                console.log("No type detected through any method, applying intelligent default...");

                // Use intelligent defaults based on common accommodation patterns
                const hotelNameLower = (hotelName || '').toLowerCase();
                const roomNameLower = (roomName || '').toLowerCase();
                const combinedLower = (hotelNameLower + ' ' + roomNameLower).toLowerCase();

                if (combinedLower.includes('resort') || combinedLower.includes('hotel') ||
                    combinedLower.includes('spa') || combinedLower.includes('suites')) {
                    selectedType = "Building";
                    detectionMethod = 'Intelligent-Default';
                } else if (combinedLower.includes('villa')) {
                    selectedType = "Villa";
                    detectionMethod = 'Intelligent-Default';
                } else if (combinedLower.includes('house') || combinedLower.includes('home')) {
                    selectedType = "House";
                    detectionMethod = 'Intelligent-Default';
                } else {
                    // Ultimate fallback - Building is most common for hotels/accommodations
                    selectedType = "Building";
                    detectionMethod = 'Ultimate-Default';
                }

                console.log(`Applied intelligent default: ${selectedType} (${detectionMethod})`);
            }

            // Set the dropdown value - now guaranteed to have a selectedType
            const situatedInSelect = document.querySelector('#Property_SituatedInID');
            if (situatedInSelect) {
                // Find the option that matches the selected type
                for (const [optionValue, typeName] of Object.entries(situatedInMapping)) {
                    if (typeName === selectedType) {
                        situatedInSelect.value = optionValue;
                        console.log(`Set Property_SituatedInID to: ${selectedType} (value: ${optionValue})`);
                        break;
                    }
                }
            } else {
                console.warn("Property_SituatedInID dropdown not found on the page");
            }

            console.log(`LLM-powered situated in type detection completed. Selected: ${selectedType}`);

            return {
                success: true,
                selectedType: selectedType,
                method: detectionMethod
            };

        } catch (error) {
            console.error("Error in situated in type detection:", error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Intelligent Place Matching System - Enhanced Implementation
    async function getIntelligentPlaceMatches(geocodeData, addressComps, rawResponse) {
        console.log("Starting intelligent place matching with form field analysis...");
    
        const formFieldMapping = {
            0: { expectedType: "Nearest Airport", keywords: ["airport", "airfield", "international", "domestic", "terminal"] },
            1: { expectedType: "Nearest Beach", keywords: ["beach", "shore", "coast", "seaside", "waterfront"] },
            2: { expectedType: "Nearest Ferry", keywords: ["ferry", "pier", "dock", "harbour", "terminal", "boat"] },
            3: { expectedType: "Nearest Train", keywords: ["train", "railway", "station", "metro", "subway", "rail"] },
            4: { expectedType: "Nearest Motorway", keywords: ["highway", "motorway", "freeway", "expressway", "interstate"] },
            5: { expectedType: "Nearest Ski", keywords: ["ski", "slope", "resort", "mountain", "snow", "alpine"] },
            6: { expectedType: "Nearest Golf", keywords: ["golf", "course", "club", "green", "fairway"] },
            7: { expectedType: "Nearest Church", keywords: ["church", "cathedral", "temple", "mosque", "synagogue", "religious"] },
            8: { expectedType: "Nearest Hospital", keywords: ["hospital", "medical", "clinic", "healthcare", "emergency"] },
            9: { expectedType: "Nearest Bank", keywords: ["bank", "atm", "financial", "credit", "money"] }
        };
    
        let availablePlaces = [];
        if (rawResponse) {
            try {
                console.log("Parsing provided raw response for location data...");
                const locationResponse = rawResponse.find(r => r.data?.propertyInfo?.summary?.location);
    
                if (locationResponse) {
                    GM_setValue("locationResponseData", JSON.stringify(locationResponse));
                    console.log("✓ Stored location response data for Step 4 check-in/check-out automation");
    
                    const graphqlPlaces = parseNearbyPlacesFromLocationResponse(locationResponse);
    
                    if (graphqlPlaces && graphqlPlaces.length > 0) {
                        availablePlaces = graphqlPlaces;
                        console.log(`✓ Retrieved ${availablePlaces.length} places from raw response`);
                    } else {
                        console.warn("⚠ No places retrieved from raw response, using fallback");
                    }
                } else {
                    console.warn("⚠ No location data in raw response, using fallback");
                }
            } catch (error) {
                console.warn("⚠ Failed to parse raw response for location data:", error.message);
            }
        }
    
        // If no GraphQL data, use enhanced defaults
        if (availablePlaces.length === 0) {
            availablePlaces = await getEnhancedNearbyPlaces(geocodeData, addressComps);
            console.log(`Using ${availablePlaces.length} enhanced default places`);
        }
    
        const result = [];
    
        // For each form field (0-9), find the best matching place
        for (let i = 0; i <= 9; i++) {
            const fieldConfig = formFieldMapping[i];
            if (!fieldConfig) {
                console.warn(`No field configuration found for index ${i}`);
                result[i] = null;
                continue;
            }
    
            console.log(`Matching for ${fieldConfig.expectedType} (field ${i})...`);
    
            // Find best matching place using scoring algorithm with distance-based tiebreaking
            let bestMatch = null;
            let bestScore = 0;
            let bestDistance = Infinity;
    
            // First pass: collect all places with the same high score
            const candidatePlaces = [];
    
            for (const place of availablePlaces) {
                const score = calculatePlaceMatchScore(place, fieldConfig.keywords);
                console.log(`  ${place.type || 'Unknown'}: score ${score}`);
    
                if (score > bestScore) {
                    bestScore = score;
                    candidatePlaces.length = 0; // Clear previous candidates
                    candidatePlaces.push(place);
                } else if (score === bestScore && score > 0) {
                    candidatePlaces.push(place);
                }
            }
    
            // Second pass: if multiple candidates with same score, choose the closest one
            if (candidatePlaces.length > 0) {
                if (candidatePlaces.length === 1) {
                    bestMatch = candidatePlaces[0];
                } else {
                    console.log(`  Found ${candidatePlaces.length} places with same score ${bestScore}, selecting closest...`);
    
                    for (const candidate of candidatePlaces) {
                        const distance = parseFloat(candidate.distance || '999');
                        if (distance < bestDistance) {
                            bestDistance = distance;
                            bestMatch = candidate;
                        }
                    }
    
                    console.log(`  Selected ${bestMatch.type} (distance: ${bestDistance}km) as closest match`);
                }
            }
    
            // Apply 50% scoring threshold for PLACES AND ACTIVITIES NEARBY
            if (bestMatch && bestScore >= 50) {
                // Create place match object with enhanced data
                result[i] = createPlaceMatch(bestMatch, fieldConfig.expectedType, geocodeData, addressComps);
                console.log(`✓ Matched ${fieldConfig.expectedType}: ${result[i].name} (score: ${bestScore})`);
    
                // Remove matched place from available pool to avoid duplicates (unless it's a very good match)
                if (bestScore >= 80) {
                    const index = availablePlaces.indexOf(bestMatch);
                    if (index > -1) {
                        availablePlaces.splice(index, 1);
                    }
                }
            } else if (bestMatch && bestScore > 0) {
                console.log(`✗ Score too low for ${fieldConfig.expectedType}: ${bestMatch.type} (score: ${bestScore}) - requires 50% minimum`);
                result[i] = null; // Leave field empty due to low score
            } else {
                console.log(`✗ No match found for ${fieldConfig.expectedType} - leaving field empty`);
                result[i] = null; // Leave field empty
            }
        }
    
        console.log("Intelligent place matching completed");
        return result;
    }

    // Calculate match score between a place and expected keywords
    function calculatePlaceMatchScore(place, expectedKeywords) {
        if (!place || !place.type) return 0;

        const placeType = place.type.toLowerCase();
        let score = 0;

        // Direct keyword matching (highest score)
        for (const keyword of expectedKeywords) {
            if (placeType.includes(keyword.toLowerCase())) {
                score += 100; // High score for direct match
                break; // Only count one direct match per place
            }
        }

        // Fuzzy matching for partial matches
        if (score === 0) {
            for (const keyword of expectedKeywords) {
                // Check for partial word matches
                const words = placeType.split(/\s+/);
                for (const word of words) {
                    if (word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word)) {
                        score += 30; // Medium score for partial match
                        break;
                    }
                }
            }
        }

        // Contextual scoring based on common place types
        if (score === 0) {
            const contextualMatches = {
                'shopping': ['bank', 'atm'],
                'transport': ['train', 'ferry'],
                'medical': ['hospital'],
                'recreation': ['golf', 'ski'],
                'food': ['church'], // Sometimes restaurants are near religious sites
                'airport': ['airport'],
                'station': ['train'],
                'terminal': ['ferry', 'airport']
            };

            for (const [placeContext, keywords] of Object.entries(contextualMatches)) {
                if (placeType.includes(placeContext)) {
                    for (const keyword of expectedKeywords) {
                        if (keywords.includes(keyword)) {
                            score += 20; // Lower score for contextual match
                            break;
                        }
                    }
                }
            }
        }

        return score;
    }

    // Create a standardized place match object
    function createPlaceMatch(place, expectedType, geocodeData, addressComps) {
        // Extract base values from the place
        let distance = place.distance || '5';
        let walkingTime = null;
        let drivingTime = null;

        // Set time based on original transport mode
        if (place.transportMode === 'walk') {
            walkingTime = place.time || '10';
        } else if (place.transportMode === 'drive') {
            drivingTime = place.time || '10';
        } else {
            // For unknown or unspecified transport modes, set both (fallback behavior)
            walkingTime = place.time || '10';
            drivingTime = place.drivingTime || Math.max(1, Math.round(parseInt(walkingTime) / 3)).toString();
        }

        // Enhance based on location context
        if (geocodeData && geocodeData.address) {
            const citySize = getCitySize(geocodeData.address.city, geocodeData.address.country);
            const locationContext = getLocationContext(geocodeData, addressComps);

            // Adjust distances based on city size
            const sizeMultiplier = citySize === 'large' ? 1.5 : citySize === 'small' ? 0.7 : 1.0;
            distance = Math.round(parseFloat(distance) * sizeMultiplier).toString();

            if (walkingTime) {
                walkingTime = Math.round(parseFloat(walkingTime) * sizeMultiplier).toString();
            }
            if (drivingTime) {
                drivingTime = Math.round(parseFloat(drivingTime) * sizeMultiplier).toString();
            }

            // Adjust for specific place types based on context
            if (locationContext.isCoastal && expectedType.includes('Beach')) {
                distance = '2';
                if (walkingTime) walkingTime = '5';
                if (drivingTime) drivingTime = '2';
            } else if (locationContext.isMountainous && expectedType.includes('Ski')) {
                distance = '10';
                if (walkingTime) walkingTime = '20';
                if (drivingTime) drivingTime = '7';
            } else if (locationContext.isUrban && expectedType.includes('Bank')) {
                distance = '1';
                if (walkingTime) walkingTime = '3';
                if (drivingTime) drivingTime = '1';
            }
        }

        // Only calculate the missing time if we don't have a specific transport mode
        if (!place.transportMode || place.transportMode === 'unknown') {
            if (walkingTime && !drivingTime) {
                drivingTime = Math.max(1, Math.round(parseInt(walkingTime) / 3)).toString();
            } else if (drivingTime && !walkingTime) {
                walkingTime = Math.max(1, Math.round(parseInt(drivingTime) * 3)).toString();
            }
        }        // Handle unit conversion properly for dropdown compatibility
        let unit = place.unit || 'KM'; // Default to KM if not specified

        // Ensure unit is in the correct format for the dropdown options: 'm', 'KM', or 'mi'
        if (unit.toLowerCase() === 'km' || unit.toLowerCase() === 'kilometer' || unit.toLowerCase() === 'kilometers') {
            unit = 'KM';
        } else if (unit.toLowerCase() === 'meter' || unit.toLowerCase() === 'meters' || unit.toLowerCase() === 'm') {
            unit = 'm';
        } else if (unit.toLowerCase().includes('mile') || unit.toLowerCase() === 'mi') {
            unit = 'mi';
        }

        return {
            name: place.type || expectedType,
            distance: distance,
            unit: unit, // Standardized unit value that matches dropdown options
            walkingTime: walkingTime,
            drivingTime: drivingTime,
            expectedType: expectedType,
            source: place.source || 'intelligent matching',
            originalPlace: place,
            originalTransportMode: place.transportMode || null  // Preserve original transport mode
        };
    }

    // Helper function to determine city size
    function getCitySize(cityName, countryName) {
        if (!cityName) return 'medium';

        const cityLower = cityName.toLowerCase();
        const largeCities = [
            'tokyo', 'london', 'new york', 'paris', 'berlin', 'madrid', 'rome', 'sydney', 'beijing', 'shanghai',
            'mumbai', 'delhi', 'bangkok', 'singapore', 'hong kong', 'seoul', 'osaka', 'mexico city', 'cairo',
            'istanbul', 'moscow', 'st petersburg', 'barcelona', 'amsterdam', 'vienna', 'copenhagen', 'stockholm'
        ];

        if (largeCities.some(city => cityLower.includes(city) || city.includes(cityLower))) {
            return 'large';
        }

        // Simple heuristic: if it contains certain keywords, consider it medium
        const mediumCityKeywords = ['city', 'capital', 'metropolitan'];
        if (mediumCityKeywords.some(keyword => cityLower.includes(keyword))) {
            return 'medium';
        }

        return 'small';
    }

    // Helper function to get location context
    function getLocationContext(geocodeData, addressComps) {
        return {
            isUrban: isUrbanLocation(geocodeData?.address),
            isCoastal: isCoastalLocation(geocodeData?.address, addressComps),
            isMountainous: isMountainousLocation(geocodeData?.address, addressComps)
        };
    }

    // Helper functions for location classification
    function isUrbanLocation(geo) {
        if (!geo) return false;
        return !!(geo.city || geo.town) && !geo.village && !geo.hamlet;
    }

    function isCoastalLocation(geo, addressComps) {
        if (!geo && !addressComps) return false;

        const coastalKeywords = ['beach', 'coast', 'bay', 'harbor', 'harbour', 'port', 'seaside', 'shore'];
        const checkText = [
            geo?.city, geo?.town, geo?.suburb, geo?.neighbourhood,
            addressComps?.city, addressComps?.addressLine1
        ].filter(Boolean).join(' ').toLowerCase();

        return coastalKeywords.some(keyword => checkText.includes(keyword));
    }

    function isMountainousLocation(geo, addressComps) {
        if (!geo && !addressComps) return false;

        const mountainKeywords = ['mountain', 'ski', 'alpine', 'snow'];
        const checkText = [
            geo?.city, geo?.town, geo?.suburb, geo?.neighbourhood,
            addressComps?.city, addressComps?.addressLine1
        ].filter(Boolean).join(' ').toLowerCase();

        return mountainKeywords.some(keyword => checkText.includes(keyword));
    }    // NEW FUNCTION to fetch property amenities data using GraphQL - for outdoor activities detection
    async function fetchPropertyAmenitiesDataGraphQL() {
        console.log("Fetching comprehensive property amenities data from stored raw response...");
        const rawResponseJSON = GM_getValue("rawResponse", null);
        if (!rawResponseJSON) {
            console.warn("No stored raw response found for amenities data");
            return null;
        }
    
        try {
            const rawResponse = JSON.parse(rawResponseJSON);
            const propertyInfoResponse = rawResponse.find(r => r.data?.propertyInfo);
            return propertyInfoResponse ? [propertyInfoResponse] : null;
        } catch (error) {
            console.error("Error parsing stored raw response for amenities data:", error);
            return null;
        }
    }

    // NEW FUNCTION to fetch location data using GraphQL
    async function fetchExpediaLocationDataGraphQL(propertyId, geocodeData = null, addressComps = null) {
        const graphqlUrl = "https://www.expediataap.com/graphql";

        // Generate dynamic values
        const dynamicDuaid = generateUUIDv4();
        const dynamicSearchId = generateUUIDv4();

        // Get current date for search criteria (using tomorrow and day after as example dates)
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date();
        dayAfter.setDate(dayAfter.getDate() + 2);

        // Dynamic destination data based on available geocoding/address data
        let regionName = "Dynamic Location";
        let regionId = "3168"; // Default to Singapore
        let coordinates = { latitude: 1.29027, longitude: 103.85201 }; // Default coordinates

        // Use geocoding data if available
        if (geocodeData && geocodeData.lat && geocodeData.lon) {
            coordinates = {
                latitude: parseFloat(geocodeData.lat),
                longitude: parseFloat(geocodeData.lon)
            };
            console.log(`Using dynamic coordinates: ${coordinates.latitude}, ${coordinates.longitude}`);
        }

        // Build region name from address components
        if (addressComps) {
            const nameParts = [];
            if (addressComps.city) nameParts.push(addressComps.city);
            if (addressComps.stateProvince) nameParts.push(addressComps.stateProvince);
            if (addressComps.country) nameParts.push(addressComps.country);

            if (nameParts.length > 0) {
                regionName = nameParts.join(', ');
                console.log(`Using dynamic region name: ${regionName}`);
            }
        }

        const payload = [{
            operationName: "PropertyDetailsBasicQuery",
            variables: {
                context: {
                    siteId: 1070901,
                    locale: "en_US",
                    eapid: 70901,
                    tpid: 5090,
                    currency: "USD",
                    device: { type: "DESKTOP" },
                    identity: { duaid: dynamicDuaid, authState: "AUTHENTICATED" },
                    privacyTrackingState: "CAN_TRACK"
                },
                propertyId: propertyId,
                shoppingContext: { multiItem: null },
                searchCriteria: {
                    primary: {
                        dateRange: {
                            checkInDate: { day: tomorrow.getDate(), month: tomorrow.getMonth() + 1, year: tomorrow.getFullYear() },
                            checkOutDate: { day: dayAfter.getDate(), month: dayAfter.getMonth() + 1, year: dayAfter.getFullYear() }
                        },
                        destination: {
                            regionName: regionName,
                            regionId: regionId,
                            coordinates: coordinates,
                            pinnedPropertyId: null,
                            propertyIds: null,
                            mapBounds: null
                        },
                        rooms: [{ adults: 2, children: [] }]
                    },
                    secondary: {
                        counts: [],
                        booleans: [],
                        selections: [
                            { id: "privacyTrackingState", value: "CAN_TRACK" },
                            { id: "searchId", value: dynamicSearchId },
                            { id: "sort", value: "RECOMMENDED" },
                            { id: "useRewards", value: "SHOP_WITHOUT_POINTS" }
                        ],
                        ranges: []
                    }
                }
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: "385fd482b076ec4d1d7724aad4159452030342d610d720313e4f058f135eacfa"
                }
            }
        }];

        console.log(`Fetching location data for Property ID: ${propertyId} using PropertyDetailsBasicQuery`);
        console.log("Generated search criteria with dynamic dates, coordinates, and region data");

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: graphqlUrl,
                headers: {
                    "Content-Type": "application/json",
                    "x-hcom-origin-id": "page.Hotels.Infosite.Information,H,30",
                    "x-page-id": "page.Hotels.Infosite.Information,H,30",
                    "x-parent-brand-id": "taap",
                    "x-product-line": "lodging",
                    "x-shopping-product-line": "lodging",
                    "client-info": `{"clientName":"EgetinnzListerUserScript","clientVersion":"1.0"}`
                },
                data: JSON.stringify(payload),
                responseType: "json",
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300 && response.response) {
                        console.log("Location GraphQL raw response:", response.response);
                        resolve(response.response);
                    } else {
                        reject(new Error(`Location GraphQL request failed: ${response.status} ${response.statusText}. Response: ${JSON.stringify(response.response)}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error(`Error during location GraphQL GM_xmlhttpRequest: ${error.statusText || 'Unknown error'}`));
                }
            });
        });
    }

    // Function to parse nearby places from location GraphQL response
    function parseNearbyPlacesFromLocationResponse(locationResponse) {
        const places = [];

        try {
            // Updated to use the correct path: location.whatsAround.nearbyPOIs
            const nearbyPOIs = locationResponse?.[0]?.data?.propertyInfo?.summary?.location?.whatsAround?.nearbyPOIs;

            if (!nearbyPOIs || !Array.isArray(nearbyPOIs)) {
                console.warn("No nearbyPOIs found in location response, trying fallback to mapCards");

                // Fallback to original mapCards structure if nearbyPOIs not available
                const mapCards = locationResponse?.[0]?.data?.propertyInfo?.summary?.map?.mapCards;
                if (mapCards && Array.isArray(mapCards)) {
                    return parseMapCardsStructure(mapCards);
                }

                console.warn("No place data found in location response, returning empty array");
                return []; // Return empty array instead of defaults
            }

            let placeCount = 0;

            // Process each nearbyPOI section
            nearbyPOIs.forEach((poiSection, sectionIndex) => {
                const infoItems = poiSection.infoItems;

                if (!infoItems || !Array.isArray(infoItems)) {
                    console.warn(`No infoItems found in nearbyPOI section ${sectionIndex}`);
                    return;
                }

                // Process each place in infoItems
                infoItems.forEach((item, itemIndex) => {
                    if (placeCount >= 10) return; // Limit to 10 places as per form requirements

                    const placeName = item.text || `Place ${placeCount + 1}`;
                    const moreInfo = item.moreInfo || '';

                    // Parse time and transport mode from moreInfo (e.g., "12 min walk", "18 min walk", "4 min drive")
                    let distance = '';
                    let time = '';
                    let transportMode = '';

                    if (moreInfo) {
                        // Extract time (e.g., "12 min", "18 min", "4 min")
                        const timeMatch = moreInfo.match(/(\d+)\s*min/i);
                        if (timeMatch) {
                            time = timeMatch[1];
                        }

                        // Determine transport mode
                        const isWalk = moreInfo.toLowerCase().includes('walk');
                        const isDrive = moreInfo.toLowerCase().includes('drive');
                        const isTrain = moreInfo.toLowerCase().includes('train') || item.text?.toLowerCase().includes('station');

                        if (isWalk) transportMode = 'walk';
                        else if (isDrive) transportMode = 'drive';
                        else if (isTrain) transportMode = 'train';
                        else transportMode = 'unknown';

                        // Estimate distance based on time and mode of transport
                        if (timeMatch) {
                            const minutes = parseInt(timeMatch[1], 10);
                            if (isWalk) {
                                // Average walking speed: ~5 km/h = ~80m/min
                                distance = Math.round(minutes * 0.08 * 100) / 100; // Round to 2 decimal places
                                distance = distance.toString();
                            } else if (isDrive) {
                                // Average city driving speed: ~30 km/h = ~500m/min
                                distance = Math.round(minutes * 0.5 * 100) / 100;
                                distance = distance.toString();
                            } else if (isTrain) {
                                // Train/public transport: estimate based on walking to station + journey
                                distance = Math.round(minutes * 0.3 * 100) / 100;
                                distance = distance.toString();
                            } else {
                                // Generic estimate for other transport modes
                                distance = Math.round(minutes * 0.25 * 100) / 100;
                                distance = distance.toString();
                            }
                        }
                    } else if (item.text?.includes(' - ')) {
                        // Handle cases where time is embedded in the text (e.g., "Orchard Boulevard Station - 8 min walk")
                        const textTimeMatch = item.text.match(/(\d+)\s*min\s*(walk|drive)/i);
                        if (textTimeMatch) {
                            time = textTimeMatch[1];
                            transportMode = textTimeMatch[2].toLowerCase();

                            const minutes = parseInt(time, 10);
                            if (transportMode === 'walk') {
                                // Average walking speed: ~5 km/h = ~80m/min
                                distance = Math.round(minutes * 0.08 * 100) / 100;
                            } else if (transportMode === 'drive') {
                                // Average city driving speed: ~30 km/h = ~500m/min
                                distance = Math.round(minutes * 0.5 * 100) / 100;
                            } else {
                                distance = Math.round(minutes * 0.25 * 100) / 100;
                            }
                            distance = distance.toString();
                        }
                    }

                    // Only add places that have valid time/distance data
                    if (time && distance) {
                        // Clean up place name (remove embedded time info if present)
                        let cleanPlaceName = placeName.replace(/\s*-\s*\d+\s*min\s*(walk|drive)/i, '').trim();
                        if (!cleanPlaceName) cleanPlaceName = placeName;
                          places.push({
                            type: cleanPlaceName,
                            distance: distance,
                            time: time,
                            transportMode: transportMode,
                            source: 'GraphQL nearbyPOIs',
                            originalMoreInfo: moreInfo,
                            originalText: item.text,
                            sectionTitle: poiSection.title || 'Unknown Section'
                        });

                        console.log(`Parsed place: ${cleanPlaceName} - ${distance}km, ${time}min ${transportMode} (from: "${moreInfo || item.text}")`);
                        placeCount++;
                    } else {
                        console.log(`Skipped place with missing data: ${placeName} (no time/distance info)`);
                    }
                });
            });

            console.log(`Successfully parsed ${places.length} places from nearbyPOIs data`);
            return places;

        } catch (error) {
            console.error("Error parsing location response:", error);
            console.warn("Returning empty array due to parsing error");
            return []; // Return empty array instead of defaults
        }
    }

    // Helper function to parse the legacy mapCards structure (fallback)
    function parseMapCardsStructure(mapCards) {
        const places = [];

        mapCards.forEach((card, index) => {
            if (index >= 10) return; // Limit to 10 places as per form requirements

            const title = card.title || `Place ${index + 1}`;
            const subTitle = card.subTitle || '';
              // Parse distance and time from subTitle (e.g., "18 min walk", "4 min drive", "30 min drive")
            let distance = '';
            let time = '';
            let transportMode = '';

            if (subTitle) {
                // Extract time (e.g., "18 min", "4 min", "30 min")
                const timeMatch = subTitle.match(/(\d+)\s*min/i);
                if (timeMatch) {
                    time = timeMatch[1];
                }

                // Determine transport mode and estimate distance based on time and mode of transport
                const isWalk = subTitle.toLowerCase().includes('walk');
                const isDrive = subTitle.toLowerCase().includes('drive');
                const isTrain = subTitle.toLowerCase().includes('train') || subTitle.toLowerCase().includes('station');

                if (isWalk) transportMode = 'walk';
                else if (isDrive) transportMode = 'drive';
                else if (isTrain) transportMode = 'train';
                else transportMode = 'unknown';

                if (timeMatch) {
                    const minutes = parseInt(timeMatch[1], 10);
                    if (isWalk) {
                        // Average walking speed: ~5 km/h = ~80m/min
                        distance = Math.round(minutes * 0.08).toString();
                    } else if (isDrive) {
                        // Average city driving speed: ~30 km/h = ~500m/min
                        distance = Math.round(minutes * 0.5).toString();
                    } else if (isTrain) {
                        // Train/public transport: estimate based on walking to station + journey
                        distance = Math.round(minutes * 0.3).toString();
                    } else {
                        // Generic estimate for other transport modes
                        distance = Math.round(minutes * 0.25).toString();
                    }
                }
            }

            // Only add places with valid data (no default fallback values)
            if (time && distance) {
                places.push({
                    type: title,
                    distance: distance,
                    time: time,
                    transportMode: transportMode,
                    source: 'GraphQL mapCards (fallback)',
                    originalSubTitle: subTitle
                });

                console.log(`Parsed place (fallback): ${title} - ${distance}km, ${time}min ${transportMode} (from: "${subTitle}")`);
            } else {
                console.log(`Skipped place with missing data (fallback): ${title} (no time/distance info)`);
            }
        });

        console.log(`Successfully parsed ${places.length} places from mapCards fallback data`);
        return places;
    }

    // Enhanced function to get nearby places with GraphQL integration
    async function getEnhancedNearbyPlaces(geocodeData, addressComps, propertyId = null) {        // Try to fetch real data from GraphQL first
        if (propertyId) {
            try {
                console.log("Attempting to fetch real nearby places from Expedia GraphQL API...");
                const locationResponse = await fetchExpediaLocationDataGraphQL(propertyId, geocodeData, addressComps);

                if (locationResponse) {
                    // Store the location response data for Step 4 check-in/check-out time automation
                    GM_setValue("locationResponseData", JSON.stringify(locationResponse));
                    console.log("✓ Stored location response data for Step 4 check-in/check-out automation");
                }

                const graphqlPlaces = parseNearbyPlacesFromLocationResponse(locationResponse);

                if (graphqlPlaces && graphqlPlaces.length > 0) {
                    console.log("Successfully retrieved nearby places from GraphQL API");
                    return graphqlPlaces;
                }
            } catch (error) {
                console.warn("Failed to fetch location data from GraphQL, falling back to geocoding-enhanced defaults:", error.message);
            }
        }

        // Fallback to geocoding-enhanced defaults
        console.log("Using geocoding-enhanced default places as fallback");
        const placesDefaults = getDefaultNearbyPlaces();

        // Apply geocoding-based enhancements to defaults
        if (geocodeData && geocodeData.address) {
            const geo = geocodeData.address;

            // Adjust distances based on location type
            if (geo.city) {
                const citySize = await estimateCitySize(geo.city, geo.country);
                const multiplier = citySize === 'large' ? 1.5 : citySize === 'small' ? 0.7 : 1.0;

                placesDefaults.forEach(place => {
                    place.distance = Math.round(parseFloat(place.distance) * multiplier).toString();
                    place.time = Math.round(parseFloat(place.time) * multiplier).toString();
                    place.source = place.source + ' (geocoding-adjusted)';
                });

                console.log(`Adjusted place distances for ${citySize} city: ${geo.city}`);
            }

            // Adjust for coastal locations
            if (addressComps && addressComps.city) {
                const coastalKeywords = ['beach', 'coast', 'bay', 'harbor', 'port', 'seaside'];
                const cityLower = addressComps.city.toLowerCase();
                const isCoastal = coastalKeywords.some(keyword => cityLower.includes(keyword));

                if (isCoastal) {
                    const beachPlace = placesDefaults.find(p => p.type === 'Beach');
                    if (beachPlace) {
                        beachPlace.distance = '2';
                        beachPlace.time = '5';
                        beachPlace.source = 'coastal location detected';
                    }
                    console.log('Adjusted beach distance for coastal location');
                }
            }
        }

        return placesDefaults;
    }

    // Helper function to get default nearby places (fallback)
    function getDefaultNearbyPlaces() {
        return [
            { type: 'Airport', distance: '20', time: '30', source: 'default fallback' },
            { type: 'Train Station', distance: '5', time: '10', source: 'default fallback' },
            { type: 'Shopping Center', distance: '3', time: '5', source: 'default fallback' },
            { type: 'Restaurants', distance: '1', time: '2', source: 'default fallback' },
            { type: 'Hospital', distance: '7', time: '12', source: 'default fallback' },
            { type: 'Bank', distance: '2', time: '3', source: 'default fallback' },
            { type: 'Beach', distance: '15', time: '25', source: 'default fallback' },
            { type: 'Golf Course', distance: '25', time: '35', source: 'default fallback' },
            { type: 'Ferry Terminal', distance: '10', time: '15', source: 'default fallback' },
            { type: 'Highway', distance: '8', time: '12', source: 'default fallback' }
        ];
    }

    // Helper function to estimate city size for distance adjustments
    async function estimateCitySize(cityName, countryName) {
        // This is a simplified heuristic - in a full implementation, you might use population data
        const largeCities = [
            'tokyo', 'london', 'new york', 'paris', 'berlin', 'madrid', 'rome', 'sydney', 'beijing', 'shanghai',
            'mumbai', 'delhi', 'bangkok', 'singapore', 'hong kong', 'seoul', 'osaka', 'mexico city', 'cairo',
            'istanbul', 'moscow', 'st petersburg', 'barcelona', 'amsterdam', 'vienna', 'copenhagen', 'stockholm'
        ];

        const cityLower = cityName.toLowerCase();
        if (largeCities.some(city => cityLower.includes(city) || city.includes(cityLower))) {
            return 'large';
        }

        // Simple heuristic: if it's a capital or major city
        const majorCityKeywords = ['city', 'capital', 'metropolitan'];
        if (majorCityKeywords.some(keyword => cityLower.includes(keyword))) {
            return 'medium';
        }

        return 'small';
    }

    // LLM-Powered Surrounding Type Detection System for Property_SurroundingTypeID
    async function automateSurroundingType(geocodeData, addressComps, hotelName, propertyId, expediaHotelUrl) {
        console.log("Starting LLM-powered surrounding type detection...");
        console.log("Using Expedia TAAP webpage content analysis for surrounding type detection...");

        // Available surrounding type options from the dropdown
        const surroundingTypes = {
            "1": "Beachfront",
            "2": "Beach View",
            "3": "Oceanfront",
            "4": "Ocean View",
            "5": "Lakefront",
            "6": "Lake View",
            "7": "Waterfront",
            "8": "Water View",
            "9": "Golf Course Front",
            "10": "Golf Course View",
            "11": "Ski-In",
            "12": "Ski-Out",
            "13": "Rural",
            "14": "Mountain View",
            "15": "Monument View",
            "16": "Downtown",
            "17": "Village",
            "18": "Resort",
            "19": "Near The Ocean",
            "20": "Hotel and Casino"
        };

        // Fetch the actual Expedia TAAP webpage content for analysis
        let webpageContent = '';
        let webpageTitle = '';
        let webpageDescription = '';

        try {
            console.log("Fetching Expedia TAAP webpage content for surrounding type analysis...");
            const webpageHtml = await fetchExpediaData(expediaHotelUrl);

            // Extract title
            const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
            webpageTitle = titleMatch ? titleMatch[1].trim() : '';

            // Extract meta description
            const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
            webpageDescription = descMatch ? descMatch[1].trim() : '';

            // Extract visible text content (remove HTML tags and script/style content)
            let textContent = webpageHtml
                .replace(/<script[^>]*>.*?<\/script>/gis, '')
                .replace(/<style[^>]*>.*?<\/style>/gis, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            // Limit content length for LLM processing (keep most relevant parts)
            if (textContent.length > 2000) {
                // Look for sections that might contain location/view information
                const keywordSections = textContent.match(/(?:location|view|beachfront|oceanfront|lakefront|waterfront|mountain|golf|ski|downtown|village|resort|rural|casino)[^.!?]*[.!?]/gi);

                if (keywordSections && keywordSections.length > 0) {
                    webpageContent = keywordSections.join(' ').substring(0, 2000);
                } else {
                    webpageContent = textContent.substring(0, 2000);
                }
            } else {
                webpageContent = textContent;
            }

            console.log("Successfully extracted webpage content for surrounding type analysis");
            console.log("Title:", webpageTitle);
            console.log("Description:", webpageDescription);
            console.log("Content preview:", webpageContent.substring(0, 200) + "...");

        } catch (error) {
            console.error("Failed to fetch Expedia webpage content:", error);
            webpageContent = 'Unable to fetch webpage content';
        }

        // Create prompt for LLM to analyze the actual webpage content for surrounding type
        const surroundingPrompt = `Analyze the following Expedia hotel webpage content to determine the most appropriate surrounding type/location characteristic. Base your analysis ONLY on what is explicitly mentioned or implied in the webpage content.

Hotel Information:
- Name: ${hotelName || 'Unknown Hotel'}
- Expedia URL: ${expediaHotelUrl}

Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}

Webpage Content:
${webpageContent}

Available surrounding type options:
${Object.entries(surroundingTypes).map(([id, name]) => `${id}: ${name}`).join(', ')}

Please analyze this webpage content and return ONLY the ID number (1-20) of the SINGLE most appropriate surrounding type that best describes the location based on what is actually mentioned in the webpage content. Consider:

- Beachfront (1): Direct beach access, on the beach, beachfront location
- Beach View (2): Can see the beach, beach views from property
- Oceanfront (3): Direct ocean access, oceanfront location
- Ocean View (4): Can see the ocean, ocean views from property
- Lakefront (5): Direct lake access, on the lake, lakefront location
- Lake View (6): Can see the lake, lake views from property
- Waterfront (7): General waterfront location (any water body)
- Water View (8): General water views (any water body)
- Golf Course Front (9): Located on/adjacent to golf course
- Golf Course View (10): Can see golf course from property
- Ski-In (11): Direct ski slope access for skiing in
- Ski-Out (12): Direct ski slope access for skiing out
- Rural (13): Rural area, countryside, farm area, isolated location
- Mountain View (14): Can see mountains from property
- Monument View (15): Can see monuments/landmarks from property
- Downtown (16): City center, downtown area, urban core
- Village (17): Small town, village setting
- Resort (18): Resort area, resort community
- Near The Ocean (19): Close to ocean but not oceanfront
- Hotel and Casino (20): Casino area, gambling district

Return only a single number (1-20) representing the best match: 16`;

        try {
            console.log("Starting LLM-powered surrounding type detection...");
              // Check if API key is configured
            const apiKey = GM_getValue('togetherApiKey', '');
            if (!apiKey) {
                console.warn("No Together.ai API key configured. Falling back to heuristic detection.");
                throw new Error("NO_API_KEY");
            }

            // Try to get LLM response for surrounding type analysis
            let surroundingTypeId = null;

            try {                console.log("Sending surrounding type analysis request to Together.ai (Llama 3.1 8B Turbo)...");
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [
                            {
                                role: 'system',
                                content: 'You are a location analysis expert. Always respond with only a single number from 1-20.'
                            },
                            {
                                role: 'user',
                                content: surroundingPrompt
                            }
                        ],                        max_tokens: 10,
                        temperature: 0.1
                    })
                });

                if (response.ok) {
                    const result = await response.json();
                    const llmResponse = result.choices[0].message.content.trim();
                    console.log("LLM response for surrounding type:", llmResponse);

                    // Parse the numeric response
                    const responseNumber = parseInt(llmResponse.match(/\d+/)?.[0]);
                    if (responseNumber >= 1 && responseNumber <= 20) {
                        surroundingTypeId = responseNumber.toString();
                        console.log("Parsed surrounding type ID:", surroundingTypeId, "->", surroundingTypes[surroundingTypeId]);
                    } else {
                        console.warn("Invalid LLM response number:", responseNumber);
                    }
                } else {
                    console.warn("LLM API request failed:", response.status, response.statusText);
                }

            } catch (apiError) {
                console.warn("LLM API error:", apiError.message);
            }

            // Fallback logic if LLM fails - use content-based heuristics when available
            if (!surroundingTypeId) {
                console.log("Using fallback heuristic-based surrounding type detection...");

                // If we have webpage content, use it for better heuristics
                if (webpageContent && webpageContent !== 'Unable to fetch webpage content') {
                    const contentLower = webpageContent.toLowerCase();
                    const titleLower = webpageTitle.toLowerCase();
                    const descLower = webpageDescription.toLowerCase();
                    const allContent = (contentLower + ' ' + titleLower + ' ' + descLower).toLowerCase();

                    console.log("Using webpage content for enhanced heuristic surrounding type detection...");

                    // Priority order - check most specific first
                    if (allContent.match(/\b(beachfront|beach.?front|on.?the.?beach|direct.?beach)\b/)) {
                        surroundingTypeId = "1"; // Beachfront
                    } else if (allContent.match(/\b(oceanfront|ocean.?front|on.?the.?ocean|direct.?ocean)\b/)) {
                        surroundingTypeId = "3"; // Oceanfront
                    } else if (allContent.match(/\b(lakefront|lake.?front|on.?the.?lake|direct.?lake)\b/)) {
                        surroundingTypeId = "5"; // Lakefront
                    } else if (allContent.match(/\b(ski.?in|ski.?access|slope.?access|direct.?ski)\b/)) {
                        surroundingTypeId = "11"; // Ski-In
                    } else if (allContent.match(/\b(ski.?out|ski.?departure|ski.?exit)\b/)) {
                        surroundingTypeId = "12"; // Ski-Out
                    } else if (allContent.match(/\b(golf.?course.?front|on.?golf.?course|golf.?adjacent)\b/)) {
                        surroundingTypeId = "9"; // Golf Course Front
                    } else if (allContent.match(/\b(casino|gambling|gaming|hotel.?casino)\b/)) {
                        surroundingTypeId = "20"; // Hotel and Casino
                    } else if (allContent.match(/\b(resort|resort.?area|resort.?community)\b/)) {
                        surroundingTypeId = "18"; // Resort
                    } else if (allContent.match(/\b(downtown|city.?center|urban.?core|central.?business)\b/)) {
                        surroundingTypeId = "16"; // Downtown
                    } else if (allContent.match(/\b(waterfront|water.?front|riverside|harbourfront|harborfront)\b/)) {
                        surroundingTypeId = "7"; // Waterfront
                    } else if (allContent.match(/\b(beach.?view|view.?beach|overlook.?beach)\b/)) {
                        surroundingTypeId = "2"; // Beach View
                    } else if (allContent.match(/\b(ocean.?view|view.?ocean|overlook.?ocean|sea.?view)\b/)) {
                        surroundingTypeId = "4"; // Ocean View
                    } else if (allContent.match(/\b(lake.?view|view.?lake|overlook.?lake)\b/)) {
                        surroundingTypeId = "6"; // Lake View
                    } else if (allContent.match(/\b(mountain.?view|view.?mountain|overlook.?mountain)\b/)) {
                        surroundingTypeId = "14"; // Mountain View
                    } else if (allContent.match(/\b(golf.?view|view.?golf|overlook.?golf)\b/)) {
                        surroundingTypeId = "10"; // Golf Course View
                    } else if (allContent.match(/\b(water.?view|view.?water|overlook.?water)\b/)) {
                        surroundingTypeId = "8"; // Water View
                    } else if (allContent.match(/\b(monument.?view|view.?monument|landmark.?view)\b/)) {
                        surroundingTypeId = "15"; // Monument View
                    } else if (allContent.match(/\b(near.?ocean|close.?ocean|ocean.?nearby)\b/)) {
                        surroundingTypeId = "19"; // Near The Ocean
                    } else if (allContent.match(/\b(village|small.?town|hamlet)\b/)) {
                        surroundingTypeId = "17"; // Village
                    } else if (allContent.match(/\b(rural|countryside|farm|isolated|remote)\b/)) {
                        surroundingTypeId = "13"; // Rural
                    } else {
                        // Default based on location context
                        const cityLower = (addressComps?.city || '').toLowerCase();
                        if (cityLower.includes('village') || cityLower.includes('town')) {
                            surroundingTypeId = "17"; // Village
                        } else if (cityLower.includes('city') || cityLower.includes('downtown')) {
                            surroundingTypeId = "16"; // Downtown
                        } else {
                            surroundingTypeId = "17"; // Village (safe default)
                        }
                    }

                } else {
                    // Basic heuristics based on location (fallback when no webpage content)
                    const countryLower = (addressComps?.country || '').toLowerCase();
                    const cityLower = (addressComps?.city || '').toLowerCase();
                    const stateProvinceLower = (addressComps?.stateProvince || '').toLowerCase();

                    console.log("Using basic location-based heuristics for surrounding type as final fallback...");

                    if (cityLower.includes('village') || cityLower.includes('town')) {
                        surroundingTypeId = "17"; // Village
                    } else if (cityLower.includes('city') || cityLower.includes('downtown') || cityLower.includes('urban')) {
                        surroundingTypeId = "16"; // Downtown
                    } else if (stateProvinceLower.includes('rural') || cityLower.includes('rural')) {
                        surroundingTypeId = "13"; // Rural
                    } else {
                        surroundingTypeId = "17"; // Village (default)
                    }
                }

                console.log("Fallback surrounding type suggestion:", surroundingTypeId, "->", surroundingTypes[surroundingTypeId]);
            }

            // Apply the suggestion to the dropdown
            const surroundingSelect = document.querySelector('#Property_SurroundingTypeID');
            if (surroundingSelect && surroundingTypeId) {
                surroundingSelect.value = surroundingTypeId;
                console.log(`✓ Set Property_SurroundingTypeID to: ${surroundingTypes[surroundingTypeId]} (ID: ${surroundingTypeId})`);
            } else {
                console.warn("Property_SurroundingTypeID dropdown not found or no surrounding type determined");
            }

            console.log(`LLM-powered surrounding type detection completed.`);
              return {
                success: true,
                selectedType: surroundingTypes[surroundingTypeId],
                selectedId: surroundingTypeId,
                method: surroundingTypeId ? (webpageContent && webpageContent !== 'Unable to fetch webpage content' ? 'Webpage-Content-LLM' : 'LLM') : 'heuristic'
            };

        } catch (error) {
            console.error("Error in surrounding type detection:", error);
            return {
                success: false,
                error: error.message,
                selectedType: null
            };
        }    }    // Living Area Detection System for Property_LivingArea and Property_LivingAreaID
    async function automateLivingAreaFields(selectedRoom, hotelName, roomName, expediaHotelUrl) {
        console.log("Starting living area automation using room data analysis...");

        let estimatedArea = null;
        let unit = "sq. ft."; // Default to square feet
        let unitId = "1"; // 1 = sq. ft., 2 = m²
        let detectionMethod = "fallback";

        try {            // Strategy 1: Extract area directly from room data and description
            console.log("Strategy 1: Extracting area from room data, name and description...");

            // Include rawAreaText from parsed room features
            const roomText = `${roomName} ${selectedRoom.name || ''} ${selectedRoom.rawOccupancyText || ''} ${selectedRoom.rawAreaText || ''}`.toLowerCase();
            console.log("Analyzing room text for area information:", roomText);

            // If we have rawAreaText, prioritize it
            if (selectedRoom.rawAreaText && selectedRoom.rawAreaText !== 'N/A') {
                console.log("Found area information in parsed room features:", selectedRoom.rawAreaText);
            }

            // Regex patterns to match area information
            const areaPatterns = [
                // Square feet patterns
                /(\d+)\s*sq\.?\s*ft\.?/i,
                /(\d+)\s*sqft/i,
                /(\d+)\s*square\s*feet?/i,
                /(\d+)\s*sq\s*feet?/i,
                // Square meters patterns
                /(\d+)\s*m²/i,
                /(\d+)\s*sqm/i,
                /(\d+)\s*square\s*meters?/i,
                /(\d+)\s*square\s*metres?/i,
                // General area patterns
                /(\d+)\s*(sq|square)\s*(ft|feet|m|meters|metres)/i
            ];

            let areaMatch = null;
            let detectedUnit = "sq. ft.";

            for (const pattern of areaPatterns) {
                const match = roomText.match(pattern);
                if (match && match[1]) {
                    const area = parseInt(match[1], 10);
                    if (area > 50 && area < 5000) { // Reasonable room size range
                        estimatedArea = area;
                        areaMatch = match[0];

                        // Determine unit from the match
                        const matchText = match[0].toLowerCase();
                        if (matchText.includes('m²') || matchText.includes('sqm') ||
                            matchText.includes('meters') || matchText.includes('metres')) {
                            detectedUnit = "m²";
                            unitId = "2";
                        } else {
                            detectedUnit = "sq. ft.";
                            unitId = "1";
                        }

                        unit = detectedUnit;
                        detectionMethod = "room-text-extraction";
                        console.log(`Found area in room text: ${estimatedArea} ${unit} from "${areaMatch}"`);
                        break;
                    }
                }
            }

            // Strategy 2: Heuristic estimation based on occupancy and room type
            if (!estimatedArea && selectedRoom.occupancy) {
                console.log("Using heuristic estimation based on occupancy and room type...");

                const occupancy = parseInt(selectedRoom.occupancy, 10);
                if (!isNaN(occupancy)) {
                    const roomNameLower = roomName.toLowerCase();

                    // Base area estimation per person (in sq ft)
                    let baseAreaPerPerson = 200; // Default: ~200 sq ft per person

                    // Adjust based on room type
                    if (roomNameLower.includes('suite') || roomNameLower.includes('penthouse')) {
                        baseAreaPerPerson = 350; // Suites are typically larger
                    } else if (roomNameLower.includes('deluxe') || roomNameLower.includes('premium')) {
                        baseAreaPerPerson = 250;
                    } else if (roomNameLower.includes('standard') || roomNameLower.includes('basic')) {
                        baseAreaPerPerson = 150;
                    } else if (roomNameLower.includes('studio')) {
                        baseAreaPerPerson = 180; // Studios are typically smaller but efficient
                    }

                    estimatedArea = Math.round(occupancy * baseAreaPerPerson);
                    unit = "sq. ft.";
                    unitId = "1";
                    detectionMethod = "occupancy-heuristic";
                    console.log(`Heuristic estimation: ${estimatedArea} ${unit} (${occupancy} people × ${baseAreaPerPerson} sq ft/person)`);
                }
            }

            // Strategy 4: Default fallback based on typical hotel room sizes
            if (!estimatedArea) {
                console.log("Using default fallback area estimation...");
                estimatedArea = 300; // Default to 300 sq ft (typical hotel room)
                unit = "sq. ft.";
                unitId = "1";
                detectionMethod = "default-fallback";
                console.log(`Default fallback: ${estimatedArea} ${unit}`);
            }

            // Apply the values to the form fields
            const livingAreaInput = document.querySelector('#Property_LivingArea');
            const livingAreaUnitSelect = document.querySelector('#Property_LivingAreaID');

            if (livingAreaInput && estimatedArea) {
                livingAreaInput.value = estimatedArea.toString();
                console.log(`✓ Set Property_LivingArea to: ${estimatedArea}`);
            } else {
                console.warn("Could not find Property_LivingArea input field or no area determined");
            }

            if (livingAreaUnitSelect && unitId) {
                livingAreaUnitSelect.value = unitId;
                console.log(`✓ Set Property_LivingAreaID to: ${unit} (value: ${unitId})`);
            } else {
                console.warn("Could not find Property_LivingAreaID dropdown or no unit determined");
            }

            return {
                success: true,
                area: estimatedArea,
                unit: unit,
                method: detectionMethod
            };        } catch (error) {
            console.error("Error in living area automation:", error);
            return {
                success: false,
                error: error.message,
                area: null,
                unit: null
            };
        }
    }    // Check-in and Check-out Time Automation for Step 4
    async function automateCheckInCheckOutTimes() {
        console.log("Starting check-in and check-out time automation...");
    
        try {
            let checkInTime = null;
            let checkOutTime = null;
            let checkInSet = false;
            let checkOutSet = false;
    
            const locationResponseJSON = GM_getValue("locationResponseData", null);
    
            if (locationResponseJSON) {
                console.log("Using stored location response data from Step 3...");
                const locationData = JSON.parse(locationResponseJSON);
    
                const propertyInfo = locationData?.data?.propertyInfo;
                if (propertyInfo?.propertyContentSectionGroups?.policies) {
                    console.log("Found policies section in stored location data");
    
                    const policies = propertyInfo.propertyContentSectionGroups.policies;
                    if (policies.sections) {
                        policies.sections.forEach(section => {
                            if (section.bodySubSections) {
                                section.bodySubSections.forEach(subSection => {
                                    if (subSection.elementsV2) {
                                        subSection.elementsV2.forEach(elementGroup => {
                                            if (elementGroup.elements) {
                                                elementGroup.elements.forEach(element => {
                                                    if (element.header && element.header.text === "Check-in" && element.items) {
                                                        element.items.forEach(item => {
                                                            if (item.contents) {
                                                                item.contents.forEach(content => {
                                                                    if (content.primary && content.primary.value) {
                                                                        const value = content.primary.value;
                                                                        const timeMatch = value.match(/Check-in start time:\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
                                                                        if (timeMatch) {
                                                                            checkInTime = parseTimeStringToDropdownValue(timeMatch[1]);
                                                                            console.log(`Found check-in time in JSON: ${timeMatch[1]} -> ${checkInTime}`);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                    if (element.header && element.header.text === "Check-out" && element.items && !checkOutTime) {
                                                        element.items.forEach(item => {
                                                            if (item.contents && !checkOutTime) {
                                                                item.contents.forEach(content => {
                                                                    if (content.primary && content.primary.value && !checkOutTime) {
                                                                        const value = content.primary.value;
                                                                        let timeStr = value;
                                                                        let foundValidTime = false;
    
                                                                        if (value.toLowerCase().includes('noon')) {
                                                                            timeStr = '12:00 PM';
                                                                            foundValidTime = true;
                                                                        } else if (value.toLowerCase().includes('midnight')) {
                                                                            timeStr = '12:00 AM';
                                                                            foundValidTime = true;
                                                                        } else {
                                                                            const timeMatch = value.match(/(?:before|by|until)\s*(\d{1,2}(?::\d{2})?\s*(?:AM|PM))/i);
                                                                            if (timeMatch) {
                                                                                timeStr = timeMatch[1];
                                                                                if (!/:\d{2}/.test(timeStr)) {
                                                                                    timeStr = timeStr.replace(/(\d+)(\s*(?:AM|PM))/i, '$1:00$2');
                                                                                }
                                                                                foundValidTime = true;
                                                                            }
                                                                        }
    
                                                                        if (foundValidTime) {
                                                                            checkOutTime = parseTimeStringToDropdownValue(timeStr);
                                                                            console.log(`Found check-out time in JSON: ${value} -> extracted: ${timeStr} -> ${checkOutTime}`);
                                                                        } else {
                                                                            console.log(`Skipping check-out policy description: ${value}`);
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                } else {
                    console.warn("Location data found but no policies section available - falling back to webpage extraction");
                }
            } else {
                console.log("No stored location response data found, falling back to webpage content extraction...");
                const expediaHotelUrl = GM_getValue("expediaHotelUrl", "");
                if (expediaHotelUrl) {
                    const webpageHtml = await fetchExpediaData(expediaHotelUrl);
                    const checkInMatch = webpageHtml.match(/Check-in start time:\s*(\d{1,2}:\d{2}\s*(?:AM|PM))/i);
                    const checkOutMatch = webpageHtml.match(/Check-out\s+(?:before|by|until)\s+(\d{1,2}(?::\d{2})?\s*(?:AM|PM)|noon|midnight)/i);
    
                    if (checkInMatch) {
                        checkInTime = parseTimeStringToDropdownValue(checkInMatch[1]);
                        console.log(`Extracted check-in time from HTML: ${checkInMatch[1]} -> ${checkInTime}`);
                    }
    
                    if (checkOutMatch) {
                        let timeStr = checkOutMatch[1].trim();
                        if (timeStr.toLowerCase() === 'noon') {
                            timeStr = '12:00 PM';
                        } else if (timeStr.toLowerCase() === 'midnight') {
                            timeStr = '12:00 AM';
                        } else {
                            if (!/:\d{2}/.test(timeStr)) {
                                timeStr = timeStr.replace(/(\d+)(\s*(?:AM|PM))/i, '$1:00$2');
                            }
                        }
                        checkOutTime = parseTimeStringToDropdownValue(timeStr);
                        console.log(`Extracted check-out time from HTML: ${checkOutMatch[1]} -> formatted: ${timeStr} -> ${checkOutTime}`);
                    }
                }
            }
    
            const checkInSelect = document.querySelector('#Property_CheckinTime');
            if (checkInSelect && checkInTime) {
                for (let i = 0; i < checkInSelect.options.length; i++) {
                    if (checkInSelect.options[i].value === checkInTime) {
                        checkInSelect.value = checkInTime;
                        console.log(`Set Property_CheckinTime to: ${checkInTime} (${checkInSelect.options[i].text})`);
                        checkInSet = true;
                        break;
                    }
                }
                if (!checkInSet) {
                    console.warn(`Could not find matching option for check-in time: ${checkInTime}`);
                    if (checkInSelect.querySelector('option[value="15:00"]')) {
                        checkInSelect.value = '15:00';
                        console.log("Set Property_CheckinTime to default 3:00 PM (15:00)");
                        checkInTime = '15:00';
                        checkInSet = true;
                    }
                }
            } else if (checkInSelect) {
                console.warn("Check-in time not found, using default 3:00 PM");
                if (checkInSelect.querySelector('option[value="15:00"]')) {
                    checkInSelect.value = '15:00';
                    console.log("Set Property_CheckinTime to default 3:00 PM (15:00)");
                    checkInTime = '15:00';
                    checkInSet = true;
                }
            } else {
                console.warn("Property_CheckinTime select field not found on the page");
            }
    
            const checkOutSelect = document.querySelector('#Property_CheckoutTime');
            if (checkOutSelect && checkOutTime) {
                for (let i = 0; i < checkOutSelect.options.length; i++) {
                    if (checkOutSelect.options[i].value === checkOutTime) {
                        checkOutSelect.value = checkOutTime;
                        console.log(`Set Property_CheckoutTime to: ${checkOutTime} (${checkOutSelect.options[i].text})`);
                        checkOutSet = true;
                        break;
                    }
                }
                if (!checkOutSet) {
                    console.warn(`Could not find matching option for check-out time: ${checkOutTime}`);
                    if (checkOutSelect.querySelector('option[value="12:00"]')) {
                        checkOutSelect.value = '12:00';
                        console.log("Set Property_CheckoutTime to default 12:00 PM (noon)");
                        checkOutTime = '12:00';
                        checkOutSet = true;
                    }
                }
            } else if (checkOutSelect) {
                console.warn("Check-out time not found, using default 12:00 PM");
                if (checkOutSelect.querySelector('option[value="12:00"]')) {
                    checkOutSelect.value = '12:00';
                    console.log("Set Property_CheckoutTime to default 12:00 PM (noon)");
                    checkOutTime = '12:00';
                    checkOutSet = true;
                }
            } else {
                console.warn("Property_CheckoutTime select field not found on the page");
            }
    
            return {
                success: checkInSet || checkOutSet,
                checkInTime: checkInTime ? getTimeDisplayText(checkInTime) : 'not set',
                checkOutTime: checkOutTime ? getTimeDisplayText(checkOutTime) : 'not set',
                checkInSet: checkInSet,
                checkOutSet: checkOutSet
            };
        } catch (error) {
            console.error("Error in check-in/check-out time automation:", error);
            return {
                success: false,
                error: error.message,
                checkInTime: 'error',
                checkOutTime: 'error'
            };
        }
    }

    // Bedroom Modal Automation System
    async function autoConfigureBedroomModal(selectedRoom, roomName, hotelName) {
        console.log("Starting bedroom modal configuration automation...");

        try {
            let detectionMethod = 'none';
            let bedroomConfig = null;
              // Gather all available data for analysis
            const analysisData = {
                roomName: roomName || '',
                hotelName: hotelName || '',
                roomDetails: selectedRoom || {},
                expediaUrl: GM_getValue("expediaHotelUrl", "")
            };

            // Log if we found direct bed information in the selected room data
            if (selectedRoom && selectedRoom.rawBedText && selectedRoom.rawBedText !== 'N/A') {
                console.log("Direct bed information found in selected room:", selectedRoom.rawBedText);
            }

            console.log("Bedroom analysis data:", analysisData);

            // First try to extract bed information directly from Step 2 data
            console.log("Attempting to extract bed configuration from Step 2 data...");
            bedroomConfig = extractBedroomConfigurationFromStep2Data(analysisData);

            if (bedroomConfig && bedroomConfig.success) {
                detectionMethod = 'step2_data';
                console.log("Successfully extracted bedroom configuration from Step 2 data:", bedroomConfig);
            } else {
                console.log("Step 2 data extraction failed, falling back to heuristic detection...");
                bedroomConfig = detectBedroomConfigurationHeuristic(analysisData);
                detectionMethod = 'heuristic';
            }

            // Store bedroom configuration for manual function to use
            if (bedroomConfig && bedroomConfig.success) {
                GM_setValue("detectedBedroomConfig", JSON.stringify(bedroomConfig));
                console.log(`Bedroom configuration detected via ${detectionMethod}:`, bedroomConfig);

                return {
                    success: true,
                    method: detectionMethod,
                    configuration: bedroomConfig,
                    message: `Bedroom configuration prepared using ${detectionMethod} detection`
                };
            } else {
                console.warn("Bedroom configuration detection failed");
                return {
                    success: false,
                    method: detectionMethod,
                    error: "Could not determine bedroom configuration automatically",
                    message: "Bedroom configuration could not be determined automatically"
                };
            }

        } catch (error) {
            console.error("Error in bedroom modal automation:", error);
            return {
                success: false,
                error: error.message,
                method: 'error',
                message: "Error occurred during bedroom configuration detection"
            };
        }
    }    // Heuristic bedroom configuration detection
    function detectBedroomConfigurationHeuristic(analysisData) {
        console.log("Starting heuristic bedroom configuration detection...");

        try {
            const roomName = (analysisData.roomName || '').toLowerCase();
            const hotelName = (analysisData.hotelName || '').toLowerCase();
            const roomDetails = analysisData.roomDetails || {};

            // Extract text for analysis (include available room data)
            const allText = `${roomName} ${hotelName} ${JSON.stringify(roomDetails)} ${roomDetails.rawOccupancyText || ''} ${roomDetails.rawAreaText || ''}`.toLowerCase();

            console.log("Heuristic analysis text:", allText);

            // Default configuration
            let bedroomConfig = {
                success: true,
                bedrooms: [
                    {
                        number: 1,
                        beds: [{ type: "Queen", count: 1 }]
                    }
                ],
                livingAreaSleeping: {
                    hasSofaBed: false,
                    hasAirMattress: false,
                    other: ""
                },
                totalBedrooms: 1,
                confidence: "medium",
                reasoning: "Default single bedroom with queen bed"
            };

            // Enhanced bed type detection based on room names
            const bedTypeDetections = {
                king: /\b(king|royal)\b/i,
                queen: /\b(queen|double)\b/i,
                single: /\b(single|twin|hollywood\s*twin)\b/i,
                double: /\b(double|full)\b/i
            };

            let detectedBedType = "Queen"; // Default

            // Check room name for bed type indicators
            for (const [bedType, pattern] of Object.entries(bedTypeDetections)) {
                if (pattern.test(allText)) {
                    detectedBedType = bedType.charAt(0).toUpperCase() + bedType.slice(1);
                    if (bedType === 'single') detectedBedType = 'Single';
                    if (bedType === 'double') detectedBedType = 'Double';
                    console.log(`Detected bed type from room name: ${detectedBedType}`);
                    break;
                }
            }

            // Detect multiple bedrooms
            const bedroomNumbers = [];
            if (allText.match(/\b(one|1)\s*bedroom/)) bedroomNumbers.push(1);
            if (allText.match(/\b(two|2)\s*bedroom/)) bedroomNumbers.push(2);
            if (allText.match(/\b(three|3)\s*bedroom/)) bedroomNumbers.push(3);
            if (allText.match(/\b(four|4)\s*bedroom/)) bedroomNumbers.push(4);
            if (allText.match(/\b(five|5)\s*bedroom/)) bedroomNumbers.push(5);
            if (allText.match(/\b(six|6)\s*bedroom/)) bedroomNumbers.push(6);

            if (bedroomNumbers.length > 0) {
                const numBedrooms = Math.max(...bedroomNumbers);
                bedroomConfig.totalBedrooms = numBedrooms;
                bedroomConfig.bedrooms = [];

                for (let i = 1; i <= numBedrooms; i++) {
                    bedroomConfig.bedrooms.push({
                        number: i,
                        beds: [{ type: i === 1 ? detectedBedType : "Queen", count: 1 }]
                    });
                }
                bedroomConfig.reasoning = `Detected ${numBedrooms} bedroom(s) from room description with ${detectedBedType} bed in primary bedroom`;
                bedroomConfig.confidence = "high";
            } else {
                // Single bedroom, update with detected bed type
                bedroomConfig.bedrooms[0].beds[0].type = detectedBedType;
                bedroomConfig.reasoning = `Single bedroom configuration with ${detectedBedType} bed detected from room name`;
            }

            // Detect specific bed types and counts from room names
            const bedCountPatterns = [
                { pattern: /(\d+)\s*king\s*bed/gi, type: "King" },
                { pattern: /(\d+)\s*queen\s*bed/gi, type: "Queen" },
                { pattern: /(\d+)\s*double\s*bed/gi, type: "Double" },
                { pattern: /(\d+)\s*single\s*bed/gi, type: "Single" },
                { pattern: /(\d+)\s*twin\s*bed/gi, type: "Single" }
            ];

            const detectedBeds = [];
            for (const { pattern, type } of bedCountPatterns) {
                const matches = allText.match(pattern);
                if (matches) {
                    for (const match of matches) {
                        const countMatch = match.match(/(\d+)/);
                        if (countMatch) {
                            const count = parseInt(countMatch[1]);
                            detectedBeds.push({ type, count });
                            console.log(`Detected ${count} ${type} bed(s) from room description`);
                        }
                    }
                }
            }

            // If specific bed counts were detected, use them
            if (detectedBeds.length > 0) {
                bedroomConfig.bedrooms[0].beds = detectedBeds;
                bedroomConfig.reasoning = `Detected specific bed configuration: ${detectedBeds.map(b => `${b.count} ${b.type}`).join(', ')}`;
                bedroomConfig.confidence = "high";
            }

            // Detect living area sleeping arrangements
            if (allText.match(/\bsofa\s*bed|pull\s*out|sleeper\s*sofa/)) {
                bedroomConfig.livingAreaSleeping.hasSofaBed = true;
                bedroomConfig.reasoning += ". Detected sofa bed in living area";
            }

            if (allText.match(/\bair\s*mattress|inflatable\s*bed/)) {
                bedroomConfig.livingAreaSleeping.hasAirMattress = true;
                bedroomConfig.reasoning += ". Detected air mattress option";
            }

            // Handle suite/studio cases with occupancy-based estimation
            if (allText.match(/\bstudio|efficiency\b/)) {
                bedroomConfig.totalBedrooms = 1;
                bedroomConfig.bedrooms = [{
                    number: 1,
                    beds: [{ type: detectedBedType, count: 1 }]
                }];
                bedroomConfig.reasoning = "Studio/efficiency unit - single bedroom configuration";
                bedroomConfig.confidence = "high";
            } else if (allText.match(/\bsuite|penthouse|villa\b/)) {
                // For suites, try to estimate based on occupancy if available
                const occupancy = roomDetails.occupancy ? parseInt(roomDetails.occupancy) : 2;
                if (occupancy > 4) {
                    bedroomConfig.totalBedrooms = 2;
                    bedroomConfig.bedrooms = [
                        { number: 1, beds: [{ type: "King", count: 1 }] },
                        { number: 2, beds: [{ type: "Queen", count: 1 }] }
                    ];
                    bedroomConfig.reasoning = `Suite with ${occupancy} occupancy - estimated 2 bedrooms`;
                    bedroomConfig.confidence = "medium";
                }
            }

            console.log("Heuristic bedroom detection result:", bedroomConfig);
            return bedroomConfig;

        } catch (error) {
            console.error("Error in heuristic bedroom detection:", error);
            return {
                success: false,
                error: error.message,
                reasoning: "Error occurred during heuristic detection"
            };        }    }

    // Enhanced initialization function specifically for BedroomModal detection
    function initializeEnhancedBedroomModalDetection() {
        console.log("Initializing enhanced BedroomModal detection system...");

        // Check if BedroomModal element already exists
        const bedroomModalElement = document.querySelector('#BedroomModal');
        if (bedroomModalElement) {
            console.log("BedroomModal element found on page load - setting up immediate observers");

            // Set up a specific observer for this modal
            const bedroomModalObserver = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes' &&
                        (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {

                        const target = mutation.target;
                        const isVisible = target.style.display !== 'none' &&
                                        target.offsetParent !== null &&
                                        (target.classList.contains('show') || target.classList.contains('in'));

                        if (isVisible && !document.querySelector('#btn-auto-fill-bedroom')) {
                            console.log("BedroomModal became visible - adding Auto Fill button...");
                            setTimeout(() => {
                                addAutoFillButtonToModal();
                            }, 1800); // Longer delay for BedroomModal to fully load
                        }
                    }
                }
            });

            // Observe the BedroomModal element specifically
            bedroomModalObserver.observe(bedroomModalElement, {
                attributes: true,
                attributeFilter: ['class', 'style', 'aria-hidden']
            });

            console.log("✓ BedroomModal-specific observer established");
        } else {
            console.log("BedroomModal element not found on initial load - will detect when added to DOM");
        }

        // Set up a DOM observer to catch BedroomModal being added later
        const domObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === Node.ELEMENT_NODE && addedNode.id === 'BedroomModal') {
                            console.log("BedroomModal element added to DOM - setting up observers...");
                            domObserver.disconnect(); // Stop this observer
                            initializeEnhancedBedroomModalDetection(); // Reinitialize
                            break;
                        }
                    }
                }
            }
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Cleanup after 5 minutes to prevent memory leaks
        setTimeout(() => {
            domObserver.disconnect();
            console.log("BedroomModal DOM observer cleanup completed");
        }, 300000);
    }    // Function to connect bedroom modal automation to existing bedroom trigger button
    function connectToExistingBedroomButton() {
        console.log("Connecting bedroom modal automation to existing bedroom trigger button...");
          // Look for the trigger button that opens the BedroomModal
        const checkForButton = () => {
            console.log("🔍 Searching for bedroom trigger button...");

            // Test each selector individually for better debugging
            let button = document.querySelector('a[href="#BedroomModal"][data-toggle="modal"]');
            if (button) {
                console.log("✓ Found button with selector: a[href=\"#BedroomModal\"][data-toggle=\"modal\"]");
            } else {
                console.log("✗ No button found with selector: a[href=\"#BedroomModal\"][data-toggle=\"modal\"]");

                button = document.querySelector('button[data-target="#BedroomModal"][data-toggle="modal"]');
                if (button) {
                    console.log("✓ Found button with selector: button[data-target=\"#BedroomModal\"][data-toggle=\"modal\"]");
                } else {
                    console.log("✗ No button found with selector: button[data-target=\"#BedroomModal\"][data-toggle=\"modal\"]");

                    button = document.querySelector('a[href="#BedroomModal"]');
                    if (button) {
                        console.log("✓ Found button with selector: a[href=\"#BedroomModal\"]");
                    } else {
                        console.log("✗ No button found with selector: a[href=\"#BedroomModal\"]");

                        // Fallback: Look for any button with "Add Bedroom" text
                        button = Array.from(document.querySelectorAll('a, button')).find(btn =>
                            btn.textContent.trim().includes('Add Bedroom'));

                        if (button) {
                            console.log("✓ Found button via text search: 'Add Bedroom'");
                        } else {
                            console.log("✗ No button found via text search: 'Add Bedroom'");

                            // Additional debug: show all available buttons
                            const allButtons = document.querySelectorAll('a, button');
                            console.log(`Debug: Found ${allButtons.length} total buttons/links on page:`);
                            allButtons.forEach((btn, index) => {
                                if (index < 10) { // Limit to first 10 for readability
                                    console.log(`  ${index + 1}. ${btn.tagName} - href: "${btn.getAttribute('href')}" - text: "${btn.textContent.trim().substring(0, 50)}"`);
                                }
                            });
                        }
                    }
                }
            }

            if (button) {
                console.log("Found bedroom trigger button:", button);
                console.log("Button attributes:", {
                    href: button.getAttribute('href'),
                    dataToggle: button.getAttribute('data-toggle'),
                    dataTarget: button.getAttribute('data-target'),
                    textContent: button.textContent.trim()
                });
                  // Add click event listener to detect when modal opens and add Auto Fill button
                // We don't check for existing automation attachment because we want to ensure
                // the Auto Fill button is added every time the modal opens
                const handleBedroomButtonClick = async (e) => {
                    console.log("Bedroom button clicked - modal will open, preparing Auto Fill button...");
                          // Allow the modal to open first (don't prevent default)
                    // Wait for modal to load and then add Auto Fill button
                    setTimeout(async () => {
                        try {
                            console.log("Bedroom button clicked - waiting for modal to load...");

                            // Wait for modal form fields to be available with a longer timeout
                            await waitForBedroomModalToLoad();

                            // Add additional delay to ensure modal is fully rendered
                            await new Promise(resolve => setTimeout(resolve, 300));

                            // Add the Auto Fill button to the modal (it will check for duplicates internally)
                            addAutoFillButtonToModal();

                            console.log("✓ Auto Fill button setup completed for bedroom modal");
                        } catch (error) {
                            console.error("Error setting up Auto Fill button:", error);
                            // Fallback: Try adding button anyway after a longer delay
                            setTimeout(() => {
                                console.log("Fallback: Attempting to add Auto Fill button without waiting for modal load...");
                                addAutoFillButtonToModal();
                            }, 2000);
                        }
                    }, 1500); // Increased from 1000ms to 1500ms for modal to open
                };

                // Remove any existing event listeners to avoid duplicates
                if (button.hasAttribute('data-automation-attached')) {
                    const oldHandler = button._bedroomClickHandler;
                    if (oldHandler) {
                        button.removeEventListener('click', oldHandler);
                    }
                }

                // Add the new event listener
                button.addEventListener('click', handleBedroomButtonClick);

                // Store reference to handler and mark as attached
                button._bedroomClickHandler = handleBedroomButtonClick;
                button.setAttribute('data-automation-attached', 'true');

                console.log("✓ Successfully connected Auto Fill button automation to existing bedroom button");
                return true;
            }
            return false;
        };

        // Try to find the button immediately
        if (checkForButton()) {
            return;
        }
          // If not found immediately, set up a MutationObserver to wait for it
        console.log("Bedroom trigger button not found immediately, setting up observer...");

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    if (checkForButton()) {
                        observer.disconnect();
                        return;
                    }
                }
            }
        });
          // Start observing for modal/DOM changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
          // Disconnect observer after 10 seconds to avoid memory leaks
        setTimeout(() => {
            observer.disconnect();
            console.log("Stopped observing for bedroom trigger button after 10 seconds");
        }, 10000);// ADDITIONAL: Set up a general modal observer to catch bedroom modals opening
        // This ensures Auto Fill button is added even if the button click handler misses it
        setupBedroomModalObserver();
          // ADDITIONAL FALLBACK: Set up a periodic check for bedroom modals without Auto Fill button
        // This is a safety net in case all other detection methods fail
        const periodicCheck = setInterval(() => {
            // Check if there's an open bedroom modal without an Auto Fill button
            // Priority 1: Check for BedroomModal specifically
            const bedroomModalElement = document.querySelector('#BedroomModal');
            const hasBedroomModalVisible = bedroomModalElement &&
                                         bedroomModalElement.style.display !== 'none' &&
                                         bedroomModalElement.offsetParent !== null;

            // Priority 2: Check for bedroom form fields (fallback method)
            const hasBedroomModal = document.querySelector('#BedroomTypeID') &&
                                   document.querySelector('#King') &&
                                   document.querySelector('#Queen');

            const hasAutoFillButton = document.querySelector('#btn-auto-fill-bedroom');

            if ((hasBedroomModalVisible || hasBedroomModal) && !hasAutoFillButton) {
                const detectionMethod = hasBedroomModalVisible ? "BedroomModal ID" : "form fields";
                console.log(`Periodic check: Found bedroom modal (via ${detectionMethod}) without Auto Fill button - adding it now...`);
                addAutoFillButtonToModal();
            }
        }, 2000); // Check every 2 seconds

        // Stop the periodic check after 2 minutes to avoid memory leaks
        setTimeout(() => {
            clearInterval(periodicCheck);
            console.log("Stopped periodic Auto Fill button check after 2 minutes");
        }, 120000);
    }    // Function to set up an observer that watches for bedroom modal opening
    function setupBedroomModalObserver() {
        console.log("Setting up bedroom modal observer for Auto Fill button...");

        const modalObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    // Check if any added nodes contain bedroom form fields (indicating modal opened)
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            // PRIORITY 1: Check if this is the specific BedroomModal element
                            if (addedNode.id === 'BedroomModal' || addedNode.querySelector('#BedroomModal')) {
                                console.log("BedroomModal (ID) detected by observer - adding Auto Fill button...");
                                setTimeout(() => {
                                    addAutoFillButtonToModal();
                                }, 1500); // Longer delay for modal with ID to fully load
                                break;
                            }

                            // PRIORITY 2: Check if this node or its children contain bedroom form fields
                            const hasBedroomFields = addedNode.querySelector && (
                                addedNode.querySelector('#BedroomTypeID') ||
                                addedNode.querySelector('#King') ||
                                addedNode.querySelector('#Queen') ||
                                addedNode.id === 'BedroomTypeID' ||
                                addedNode.id === 'King' ||
                                addedNode.id === 'Queen'
                            );
                              if (hasBedroomFields) {
                                console.log("Bedroom modal detected by form fields - adding Auto Fill button...");
                                // Wait a moment for the modal to fully render
                                setTimeout(() => {
                                    addAutoFillButtonToModal();
                                }, 1200); // Increased delay for more reliable detection
                                break;
                            }
                        }
                    }

                    // Also check for modal containers becoming visible
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === Node.ELEMENT_NODE) {
                            const modals = addedNode.querySelectorAll ?
                                addedNode.querySelectorAll('.modal, [role="dialog"], .fade, #BedroomModal') : [];

                            for (const modal of modals) {                                if (modal.style.display !== 'none' && modal.offsetParent !== null) {
                                    // Check if this is the BedroomModal specifically
                                    if (modal.id === 'BedroomModal') {
                                        console.log("Visible BedroomModal (ID) detected - adding Auto Fill button...");
                                        setTimeout(() => {
                                            addAutoFillButtonToModal();
                                        }, 1500); // Longer delay for BedroomModal
                                        break;
                                    }
                                    // Modal is visible, check if it contains bedroom fields
                                    else if (modal.querySelector('#BedroomTypeID') || modal.querySelector('#King')) {
                                        console.log("Visible bedroom modal detected by fields - adding Auto Fill button...");
                                        setTimeout(() => {
                                            addAutoFillButtonToModal();
                                        }, 1200); // Increased delay for more reliable detection
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                // Also watch for attribute changes (like class changes that might show/hide modals)
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const target = mutation.target;
                    if (target.classList.contains('show') || target.classList.contains('in')) {
                        // Check if this is the BedroomModal specifically
                        if (target.id === 'BedroomModal') {
                            console.log("BedroomModal (ID) shown via class change - adding Auto Fill button...");
                            setTimeout(() => {
                                addAutoFillButtonToModal();
                            }, 1500); // Longer delay for BedroomModal
                        }
                        // Check if this is a bedroom modal that just became visible
                        else if (target.querySelector('#BedroomTypeID') || target.querySelector('#King')) {
                            console.log("Bedroom modal shown via class change - adding Auto Fill button...");
                            setTimeout(() => {
                                addAutoFillButtonToModal();
                            }, 1200); // Increased delay for more reliable detection
                        }
                    }
                }
            }
        });

        // Start observing the entire document for modal changes
        modalObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });

        // Store observer reference for potential cleanup
        window._bedroomModalObserver = modalObserver;

        console.log("✓ Bedroom modal observer set up successfully");
    }

    // Simplified bedroom form automation function
    async function manualBedroomModalAutomation() {
        console.log("Starting streamlined bedroom form automation...");

        try {
            // Check if we have stored bedroom configuration from automatic detection
            const storedConfigJSON = GM_getValue("detectedBedroomConfig", null);
            let detectedConfig = null;

            if (storedConfigJSON) {
                try {
                    detectedConfig = JSON.parse(storedConfigJSON);
                    console.log("Found stored bedroom configuration:", detectedConfig);
                } catch (error) {
                    console.warn("Could not parse stored bedroom configuration:", error);
                }
            }

            // If no detected config, create a default one
            if (!detectedConfig) {
                detectedConfig = {
                    success: true,
                    bedrooms: [{ number: 1, beds: [{ type: "Queen", count: 1 }] }],
                    totalBedrooms: 1,
                    livingAreaSleeping: { hasSofaBed: false, hasAirMattress: false, other: "" },
                    confidence: "default",
                    reasoning: "Using default single bedroom with Queen bed"
                };
                console.log("Using default bedroom configuration");
            }            // Wait for bedroom modal to load before populating form fields
            console.log("Waiting for bedroom modal to load...");
            try {
                await waitForBedroomModalToLoad();
            } catch (error) {
                console.warn("Bedroom modal loading detection failed, proceeding with fallback delay:", error.message);
                // Fallback: Use a fixed delay if modal detection fails
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Add a small additional delay to ensure all form elements are ready
            await new Promise(resolve => setTimeout(resolve, 500));            // Directly populate the Egetinnz bedroom form fields
            await populateBedroomForm(detectedConfig);        } catch (error) {
            console.error("Error in bedroom form automation:", error);
            await showAlertModal("Bedroom Configuration Error", `Error setting up bedroom configuration: ${error.message}`);        }
    }    // Helper function to wait for bedroom modal form fields to be available in the DOM
    async function waitForBedroomModalToLoad() {
        return new Promise((resolve, reject) => {
            const maxWaitTime = 15000; // Increased to 15 seconds maximum wait
            const checkInterval = 200; // Check every 200ms for more responsive detection
            let elapsedTime = 0;

            console.log("Waiting for bedroom modal form fields to load...");

            const checkForFormFields = () => {
                // Priority check: See if BedroomModal element exists and is visible
                const bedroomModalElement = document.querySelector('#BedroomModal');
                const isBedroomModalVisible = bedroomModalElement &&
                                            bedroomModalElement.style.display !== 'none' &&
                                            bedroomModalElement.offsetParent !== null;

                // Check for key bedroom form fields that must be present
                const bedroomTypeField = document.querySelector('#BedroomTypeID');
                const kingField = document.querySelector('#King');
                const queenField = document.querySelector('#Queen');
                  // Also check that the fields are actually visible and interactable
                const fieldsReady = bedroomTypeField && kingField && queenField &&
                                   bedroomTypeField.offsetParent !== null && // Field is visible
                                   !bedroomTypeField.disabled; // Field is enabled

                if (fieldsReady) {
                    const detectionMethod = isBedroomModalVisible ? "BedroomModal ID + fields" : "form fields only";
                    console.log(`✓ Bedroom modal form fields detected and ready (via ${detectionMethod})`);
                    resolve();
                    return;
                }

                // Log progress if BedroomModal is detected but fields aren't ready yet
                if (isBedroomModalVisible && elapsedTime % 1000 === 0) { // Log every second
                    console.log(`BedroomModal element visible, waiting for form fields... (${elapsedTime/1000}s elapsed)`);
                }

                elapsedTime += checkInterval;

                if (elapsedTime >= maxWaitTime) {
                    const modalInfo = isBedroomModalVisible ? " (BedroomModal element was visible)" : "";
                    console.warn(`Timeout waiting for bedroom modal form fields to load${modalInfo}`);
                    reject(new Error("Timeout waiting for bedroom modal to load"));
                    return;
                }

                // Continue checking
                setTimeout(checkForFormFields, checkInterval);
            };

            // Start checking immediately
            checkForFormFields();
        });
    }    // Function to add an "Auto Fill" button to the bedroom modal
    function addAutoFillButtonToModal(retryCount = 0) {
        console.log(`Adding Auto Fill button to bedroom modal... (attempt ${retryCount + 1})`);

        // First, check if the BedroomModal element exists and is visible
        const bedroomModalElement = document.querySelector('#BedroomModal');
        const isBedroomModalVisible = bedroomModalElement &&
                                    bedroomModalElement.style.display !== 'none' &&
                                    bedroomModalElement.offsetParent !== null;
          // Second, verify that the modal has the required form fields
        const criticalFields = ['#BedroomTypeID', '#King', '#Queen'];
        const missingFields = criticalFields.filter(selector => !document.querySelector(selector));

        // If BedroomModal element exists but fields are missing, wait longer for fields to load
        if (missingFields.length > 0) {
            if (isBedroomModalVisible) {
                console.warn(`BedroomModal is visible but critical fields missing: ${missingFields.join(', ')} - waiting for form to load...`);
            } else {
                console.warn(`Modal not ready yet - critical fields missing: ${missingFields.join(', ')}`);
            }

            // Retry up to 5 times with increasing delays, but use longer delays if BedroomModal is detected
            if (retryCount < 5) {
                const baseDelay = isBedroomModalVisible ? 800 : 500; // Longer delay for BedroomModal
                const delay = (retryCount + 1) * baseDelay;
                console.log(`Retrying in ${delay}ms... (retry ${retryCount + 1}/5) ${isBedroomModalVisible ? '[BedroomModal detected]' : ''}`);
                setTimeout(() => addAutoFillButtonToModal(retryCount + 1), delay);
                return;
            } else {
                const modalType = isBedroomModalVisible ? "BedroomModal element detected but" : "Modal";
                console.error(`Failed to add Auto Fill button after 5 attempts - ${modalType} fields not loading`);
                return;
            }
        }

        // Check if button already exists to avoid duplicates
        const existingButton = document.querySelector('#btn-auto-fill-bedroom');
        if (existingButton) {
            console.log("Auto Fill button already exists in modal - ensuring it's visible and functional");
            // Make sure the existing button is visible and functional
            existingButton.style.display = 'inline-block';
            return;
        }
          // Find the modal footer where we'll add our button - try multiple detection methods
        let modalFooter = null;

        // Method 1: If BedroomModal element exists, look for footer within it first
        if (isBedroomModalVisible) {
            modalFooter = bedroomModalElement.querySelector('.modal-footer, .footer, [class*="footer"]');
            if (modalFooter) {
                console.log("Found modal footer within BedroomModal element");
            }
        }

        // Method 2: Look for .modal-footer in document
        if (!modalFooter) {
            modalFooter = document.querySelector('.modal-footer');
        }

        // Method 3: Look for modal containers and find footer within them
        if (!modalFooter) {
            const modals = document.querySelectorAll('.modal, [role="dialog"], .fade.show, #BedroomModal');
            for (const modal of modals) {
                const footer = modal.querySelector('.modal-footer, .footer, [class*="footer"]');
                if (footer) {
                    modalFooter = footer;
                    console.log(`Found modal footer in ${modal.id || modal.className}`);
                    break;
                }
            }
        }

        // Method 4: Look for any element containing "Add Bedroom" button and find its parent container
        if (!modalFooter) {
            const addBedroomBtn = Array.from(document.querySelectorAll('button')).find(btn =>
                btn.textContent.includes('Add Bedroom'));
            if (addBedroomBtn) {
                modalFooter = addBedroomBtn.parentElement;                console.log("Found modal container via Add Bedroom button parent");
            }
        }

        // Method 5: Fallback to document body if modal structure isn't standard
        if (!modalFooter) {
            console.warn("Could not find standard modal footer, attempting to find suitable container...");
            // Look for any container that has form elements, prioritizing BedroomModal
            let formContainers = [];
            if (isBedroomModalVisible) {
                formContainers = bedroomModalElement.querySelectorAll('form, .form, [class*="form"]');
            }
            if (formContainers.length === 0) {
                formContainers = document.querySelectorAll('form, .form, [class*="form"]');
            }

            for (const container of formContainers) {
                if (container.querySelector('#BedroomTypeID') || container.querySelector('#King')) {
                    modalFooter = container;
                    console.log("Found form container for Auto Fill button placement");
                    break;
                }
            }
        }

        if (!modalFooter) {
            console.warn("Could not find suitable location to add Auto Fill button - modal structure may be non-standard");
            return;
        }

        // Create the Auto Fill button
        const autoFillButton = document.createElement('button');
        autoFillButton.id = 'btn-auto-fill-bedroom';
        autoFillButton.type = 'button';
        autoFillButton.className = 'btn btn-info';
        autoFillButton.innerHTML = '🛏️ Auto Fill';
        autoFillButton.style.marginRight = '10px';
        autoFillButton.style.marginBottom = '10px';

        // Add click event listener
        autoFillButton.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();

            console.log("Auto Fill button clicked - populating bedroom form...");

            try {
                // Get stored bedroom configuration
                const storedConfigJSON = GM_getValue("detectedBedroomConfig", null);
                let detectedConfig = null;

                if (storedConfigJSON) {
                    try {
                        detectedConfig = JSON.parse(storedConfigJSON);
                        console.log("Using stored bedroom configuration:", detectedConfig);
                    } catch (error) {
                        console.warn("Could not parse stored bedroom configuration:", error);
                    }
                }

                // If no detected config, create a default one
                if (!detectedConfig) {
                    detectedConfig = {
                        success: true,
                        bedrooms: [{ number: 1, beds: [{ type: "Queen", count: 1 }] }],
                        totalBedrooms: 1,
                        livingAreaSleeping: { hasSofaBed: false, hasAirMattress: false, other: "" },
                        confidence: "default",
                        reasoning: "Using default single bedroom with Queen bed"
                    };
                    console.log("Using default bedroom configuration");
                }

                // Populate the form fields directly (without the full automation flow)
                await populateBedroomFormFields(detectedConfig);            } catch (error) {
                console.error("Error in Auto Fill:", error);
                await showAlertModal("Auto Fill Error", `Error in Auto Fill: ${error.message}`);
            }
        });
          // Insert the button before the existing button(s) in the modal footer
        modalFooter.insertBefore(autoFillButton, modalFooter.firstChild);

        const detectionMethod = isBedroomModalVisible ? "BedroomModal ID" : "form fields";
        console.log(`✓ Auto Fill button added to bedroom modal (detected via ${detectionMethod})`);
    }

    // Debug function to manually force addition of Auto Fill button (for troubleshooting)
    function forceAddAutoFillButton() {
        console.log("DEBUG: Manually forcing Auto Fill button addition...");
        addAutoFillButtonToModal();
    }

    // Debug function to manually force addition of bathroom Auto Fill button (for troubleshooting)
    function forceAddBathroomAutoFillButton() {
        console.log("DEBUG: Manually forcing bathroom Auto Fill button addition...");
        addAutoFillButtonToBathroomModal(0);
    }
      // Debug function to check bathroom modal state
    function debugBathroomModalState() {
        console.log("=== BATHROOM MODAL DEBUG INFO ===");

        const bathroomModal = document.querySelector('#BathroomModal');
        const bedroomModal = document.querySelector('#BedroomModal');

        console.log("BathroomModal element:", bathroomModal);
        if (bathroomModal) {
            console.log("BathroomModal display:", bathroomModal.style.display);
            console.log("BathroomModal visible:", bathroomModal.offsetParent !== null);
            console.log("BathroomModal contains BathroomTypeID:", !!bathroomModal.querySelector('#BathroomTypeID'));
        }

        console.log("BedroomModal element:", bedroomModal);
        if (bedroomModal) {
            console.log("BedroomModal display:", bedroomModal.style.display);
            console.log("BedroomModal visible:", bedroomModal.offsetParent !== null);
            console.log("BedroomModal contains BathroomTypeID:", !!bedroomModal.querySelector('#BathroomTypeID'));
        }

        const bathroomTypeField = document.querySelector('#BathroomTypeID');
        console.log("BathroomTypeID field:", bathroomTypeField);
        if (bathroomTypeField) {
            const parentModal = bathroomTypeField.closest('[id*="Modal"]');
            console.log("BathroomTypeID is inside modal:", parentModal ? parentModal.id : 'none');
        }

        const existingButton = document.querySelector('#btn-auto-fill-bathroom');
        console.log("Existing auto-fill button:", existingButton);
        if (existingButton) {
            console.log("Button visible:", existingButton.offsetParent !== null);
            console.log("Button position:", existingButton.getBoundingClientRect());
            const buttonParentModal = existingButton.closest('[id*="Modal"]');
            console.log("Button is inside modal:", buttonParentModal ? buttonParentModal.id : 'none');
        }

        const modalFooters = document.querySelectorAll('.modal-footer');
        console.log("Modal footers found:", modalFooters.length);
        modalFooters.forEach((footer, index) => {
            const parentModal = footer.closest('[id*="Modal"]');
            console.log(`Footer ${index} parent modal:`, parentModal ? parentModal.id : 'none');
        });

        const addBathroomBtns = Array.from(document.querySelectorAll('button')).filter(btn =>
            btn.textContent.includes('Add Bathroom'));
        console.log("Add Bathroom buttons:", addBathroomBtns);

        console.log("=== END DEBUG INFO ===");
    }

    // Make debug functions available globally for console access
    window.forceAddAutoFillButton = forceAddAutoFillButton;
    window.forceAddBathroomAutoFillButton = forceAddBathroomAutoFillButton;
    window.debugBathroomModalState = debugBathroomModalState;

    // Simplified function to populate bedroom form fields (without submission logic)
    async function populateBedroomFormFields(config) {
        console.log("Populating bedroom form fields with configuration:", config);

        try {
            // Verify that critical form fields are available before proceeding
            const criticalFields = ['#BedroomTypeID', '#King', '#Queen'];
            const missingFields = criticalFields.filter(selector => !document.querySelector(selector));

            if (missingFields.length > 0) {
                throw new Error(`Critical bedroom form fields not found: ${missingFields.join(', ')}`);
            }

            console.log("✓ All critical bedroom form fields are available");

            // Set bedroom type to "Bedroom" (value = "1")
            const bedroomTypeSelect = document.querySelector('#BedroomTypeID');
            if (bedroomTypeSelect) {
                bedroomTypeSelect.value = "1"; // 1 = Bedroom, 2 = Studio, 3 = Other
                console.log("✓ Set BedroomTypeID to 'Bedroom'");
            }

            // Initialize all bed count fields to 0
            const bedFields = ['King', 'Queen', 'DoubleBed', 'TwinSingle', 'BunkBed', 'SofaFuton'];
            const additionalFields = ['ExtaMattress', 'ExtraFoam', 'RollOverBed'];

            // Reset all fields to 0
            [...bedFields, ...additionalFields].forEach(fieldId => {
                const field = document.querySelector(`#${fieldId}`);
                if (field) {
                    field.value = "0";
                }
            });

            let appliedBeds = [];
            let totalBedsSet = 0;

            // Process all beds from all bedrooms
            if (config.bedrooms && config.bedrooms.length > 0) {
                for (const bedroom of config.bedrooms) {
                    if (bedroom.beds && bedroom.beds.length > 0) {
                        for (const bed of bedroom.beds) {
                            const bedCount = parseInt(bed.count) || 1;
                            const bedType = bed.type;

                            // Map bed types to Egetinnz form field IDs
                            let targetFieldId = null;
                            let mappedType = bedType;

                            switch (bedType.toLowerCase()) {
                                case 'king':
                                    targetFieldId = 'King';
                                    break;
                                case 'queen':
                                    targetFieldId = 'Queen';
                                    break;
                                case 'double':
                                case 'double bed':
                                    targetFieldId = 'DoubleBed';
                                    mappedType = 'Double';
                                    break;
                                case 'single':
                                case 'twin':
                                case 'twin single':
                                    targetFieldId = 'TwinSingle';
                                    mappedType = 'Twin/Single';
                                    break;
                                case 'bunk':
                                case 'bunk bed':
                                    targetFieldId = 'BunkBed';
                                    mappedType = 'Bunk';
                                    break;
                                case 'sofa bed':
                                case 'sofa':
                                case 'futon':
                                    targetFieldId = 'SofaFuton';
                                    mappedType = 'Sofa/Futon';
                                    break;
                                default:
                                    // Default unknown bed types to Queen
                                    targetFieldId = 'Queen';
                                    mappedType = 'Queen (default)';
                                    console.warn(`Unknown bed type '${bedType}', defaulting to Queen`);
                            }

                            if (targetFieldId) {
                                const targetField = document.querySelector(`#${targetFieldId}`);
                                if (targetField) {
                                    const currentValue = parseInt(targetField.value) || 0;
                                    const newValue = currentValue + bedCount;
                                    targetField.value = newValue.toString();

                                    appliedBeds.push(`${bedCount} ${mappedType} bed${bedCount > 1 ? 's' : ''}`);
                                    totalBedsSet += bedCount;
                                    console.log(`✓ Set ${targetFieldId} to ${newValue} (added ${bedCount} ${mappedType})`);
                                } else {
                                    console.warn(`Target field ${targetFieldId} not found`);
                                }
                            }
                        }
                    }
                }
            }

            // Handle living area sleeping arrangements
            if (config.livingAreaSleeping) {
                if (config.livingAreaSleeping.hasSofaBed) {
                    const sofaField = document.querySelector('#SofaFuton');
                    if (sofaField) {
                        const currentValue = parseInt(sofaField.value) || 0;
                        sofaField.value = (currentValue + 1).toString();
                        appliedBeds.push("1 Sofa bed (living area)");
                        totalBedsSet += 1;
                        console.log("✓ Added sofa bed from living area sleeping");
                    }
                }

                if (config.livingAreaSleeping.hasAirMattress) {
                    const mattressField = document.querySelector('#ExtaMattress');
                    if (mattressField) {
                        const currentValue = parseInt(mattressField.value) || 0;
                        mattressField.value = (currentValue + 1).toString();
                        appliedBeds.push("1 Extra mattress (air mattress)");
                        console.log("✓ Added air mattress as extra mattress");
                    }
                }
            }

            // Create summary
            const summary = `Bedroom Configuration Applied:
• Bedroom Type: Bedroom
• Total beds configured: ${totalBedsSet}
• Beds: ${appliedBeds.join(', ')}
${config.reasoning ? `• Detection method: ${config.reasoning}` : ''}
${config.confidence ? `• Confidence: ${config.confidence}` : ''}`;            console.log("✓ Bedroom form fields populated successfully");
            await showAlertModal("Bedroom Form Auto-Fill Complete", `Bedroom form auto-filled successfully!\n\n${summary}\n\nYou can now click "Add Bedroom" to submit the form.`);

        } catch (error) {
            console.error("Error populating bedroom form fields:", error);
            throw error;
        }
    }// Streamlined function to directly populate Egetinnz bedroom form fields
    async function populateBedroomForm(config) {
        console.log("Directly populating Egetinnz bedroom form with configuration:", config);

        try {
            // Verify that critical form fields are available before proceeding
            const criticalFields = ['#BedroomTypeID', '#King', '#Queen'];
            const missingFields = criticalFields.filter(selector => !document.querySelector(selector));

            if (missingFields.length > 0) {
                throw new Error(`Critical bedroom form fields not found: ${missingFields.join(', ')}`);
            }

            console.log("✓ All critical bedroom form fields are available");

            // Set bedroom type to "Bedroom" (value = "1")
            const bedroomTypeSelect = document.querySelector('#BedroomTypeID');
            if (bedroomTypeSelect) {
                bedroomTypeSelect.value = "1"; // 1 = Bedroom, 2 = Studio, 3 = Other
                console.log("✓ Set BedroomTypeID to 'Bedroom'");
            } else {
                console.warn("BedroomTypeID field not found");
            }

            // Initialize all bed count fields to 0
            const bedFields = ['King', 'Queen', 'DoubleBed', 'TwinSingle', 'BunkBed', 'SofaFuton'];
            const additionalFields = ['ExtaMattress', 'ExtraFoam', 'RollOverBed'];

            // Reset all fields to 0
            [...bedFields, ...additionalFields].forEach(fieldId => {
                const field = document.querySelector(`#${fieldId}`);
                if (field) {
                    field.value = "0";
                }
            });

            let appliedBeds = [];
            let totalBedsSet = 0;

            // Process all beds from all bedrooms
            if (config.bedrooms && config.bedrooms.length > 0) {
                for (const bedroom of config.bedrooms) {
                    if (bedroom.beds && bedroom.beds.length > 0) {
                        for (const bed of bedroom.beds) {
                            const bedCount = parseInt(bed.count) || 1;
                            const bedType = bed.type;

                            // Map bed types to Egetinnz form field IDs
                            let targetFieldId = null;
                            let mappedType = bedType;

                            switch (bedType.toLowerCase()) {
                                case 'king':
                                    targetFieldId = 'King';
                                    break;
                                case 'queen':
                                    targetFieldId = 'Queen';
                                    break;
                                case 'double':
                                case 'double bed':
                                    targetFieldId = 'DoubleBed';
                                    mappedType = 'Double';
                                    break;
                                case 'single':
                                case 'twin':
                                case 'twin single':
                                    targetFieldId = 'TwinSingle';
                                    mappedType = 'Twin/Single';
                                    break;
                                case 'bunk':
                                case 'bunk bed':
                                    targetFieldId = 'BunkBed';
                                    mappedType = 'Bunk';
                                    break;
                                case 'sofa bed':
                                case 'sofa':
                                case 'futon':
                                    targetFieldId = 'SofaFuton';
                                    mappedType = 'Sofa/Futon';
                                    break;
                                default:
                                    // Default unknown bed types to Queen
                                    targetFieldId = 'Queen';
                                    mappedType = 'Queen (default)';
                                    console.warn(`Unknown bed type '${bedType}', defaulting to Queen`);
                            }

                            if (targetFieldId) {
                                const targetField = document.querySelector(`#${targetFieldId}`);
                                if (targetField) {
                                    const currentValue = parseInt(targetField.value) || 0;
                                    const newValue = currentValue + bedCount;
                                    targetField.value = newValue.toString();

                                    appliedBeds.push(`${bedCount} ${mappedType} bed${bedCount > 1 ? 's' : ''}`);
                                    totalBedsSet += bedCount;
                                    console.log(`✓ Set ${targetFieldId} to ${newValue} (added ${bedCount} ${mappedType})`);
                                } else {
                                    console.warn(`Target field ${targetFieldId} not found`);
                                }
                            }
                        }
                    }
                }
            }

            // Handle living area sleeping arrangements
            if (config.livingAreaSleeping) {
                if (config.livingAreaSleeping.hasSofaBed) {
                    const sofaField = document.querySelector('#SofaFuton');
                    if (sofaField) {
                        const currentValue = parseInt(sofaField.value) || 0;
                        sofaField.value = (currentValue + 1).toString();
                        appliedBeds.push("1 Sofa bed (living area)");
                        totalBedsSet += 1;
                        console.log("✓ Added sofa bed from living area sleeping");
                    }
                }

                if (config.livingAreaSleeping.hasAirMattress) {
                    const mattressField = document.querySelector('#ExtaMattress');
                    if (mattressField) {
                        const currentValue = parseInt(mattressField.value) || 0;
                        mattressField.value = (currentValue + 1).toString();
                        appliedBeds.push("1 Extra mattress (air mattress)");
                        console.log("✓ Added air mattress as extra mattress");
                    }
                }
            }

            // Create summary
            const summary = `Bedroom Configuration Applied:
• Bedroom Type: Bedroom
• Total beds configured: ${totalBedsSet}
• Beds: ${appliedBeds.join(', ')}
${config.reasoning ? `• Detection method: ${config.reasoning}` : ''}
${config.confidence ? `• Confidence: ${config.confidence}` : ''}`;            console.log("✓ Bedroom form populated successfully");
            await showAlertModal("Bedroom Configuration Applied", `Bedroom configuration applied successfully!\n\n${summary}\n\nYou can now click the "Add Bedroom" button to submit the form.`);

        } catch (error) {
            console.error("Error populating bedroom form:", error);
            throw error;
        }
    }

    // Helper function to parse time strings like "3:00 PM" to dropdown values like "15:00"
    function parseTimeStringToDropdownValue(timeStr) {
        try {
            // Handle various time formats
            const cleanTime = timeStr.trim().toUpperCase();

            // Handle special cases first
            if (cleanTime.includes('NOON')) {
                return '12:00';
            }
            if (cleanTime.includes('MIDNIGHT')) {
                return '24:00';
            }

            // Match patterns like "3:00 PM", "15:00", "11 AM", "3PM"
            const timeMatch = cleanTime.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?/i);

            if (!timeMatch) {
                console.warn(`Could not parse time string: ${timeStr}`);
                return null;
            }

            let hours = parseInt(timeMatch[1], 10);
            const minutes = timeMatch[2] || '00'; // Default to 00 if minutes not specified
            const period = timeMatch[3];

            // Convert to 24-hour format
            if (period) {
                if (period.toUpperCase() === 'PM' && hours !== 12) {
                    hours += 12;
                } else if (period.toUpperCase() === 'AM' && hours === 12) {
                    hours = 0;
                }
            }

            // Format as HH:MM or special cases for dropdown values
            if (hours === 12 && minutes === '00' && period && period.toUpperCase() === 'PM') {
                return '12:00'; // Noon - special case in dropdown
            } else if (hours === 0 || (hours === 24)) {
                return '24:00'; // Midnight - special case in dropdown
            } else {
                return `${hours}:00`; // Most dropdown options are on the hour
            }

        } catch (error) {
            console.error(`Error parsing time string "${timeStr}":`, error);
            return null;
        }
    }

    // Helper function to get display text for time values
    function getTimeDisplayText(timeValue) {
        const timeMapping = {
            '6:00': '6:00 AM',
            '7:00': '7:00 AM',
            '8:00': '8:00 AM',
            '9:00': '9:00 AM',
            '10:00': '10:00 AM',
            '11:00': '11:00 AM',
            '12:00': '12:00 PM (noon)',
            '13:00': '1:00 PM',
            '14:00': '2:00 PM',
            '15:00': '3:00 PM',
            '16:00': '4:00 PM',
            '17:00': '5:00 PM',
            '18:00': '6:00 PM',
            '19:00': '7:00 PM',
            '20:00': '8:00 PM',
            '21:00': '9:00 PM',
            '22:00': '10:00 PM',
            '23:00': '11:00 PM',
            '24:00': '12:00 AM (midnight)'
        };

        return timeMapping[timeValue] || timeValue;
    }    // === LOADING BAR UTILITY SYSTEM ===
    // ===================================
      class LoadingBarManager {
        constructor() {
            this.currentBar = null;
            this.isShowing = false;
            this.progressInterval = null;
            this.logs = [];
            this.progressTracker = null;
            this.stepConfig = null;
        }

        show(title, message = "") {
            // Remove any existing loading bar
            this.hide();

            // Reset logs
            this.logs = [];

            // Create loading bar container
            const loadingContainer = document.createElement('div');
            loadingContainer.id = 'egetinnz-loading-bar';
            loadingContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                width: 500px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                color: white;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideInRight 0.3s ease-out;
                max-height: 650px;
                overflow: hidden;
            `;

            // Add keyframe animations
            if (!document.querySelector('#egetinnz-loading-styles')) {
                const styles = document.createElement('style');
                styles.id = 'egetinnz-loading-styles';
                styles.textContent = `
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                    @keyframes slideOutRight {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.6; }
                    }
                    @keyframes progressFill {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                `;
                document.head.appendChild(styles);
            }

            // Create title
            const titleElement = document.createElement('div');            titleElement.style.cssText = `
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                gap: 8px;
                justify-content: space-between;
            `;

            // Add spinner icon
            const spinnerContainer = document.createElement('div');
            spinnerContainer.style.cssText = 'display: flex; align-items: center; gap: 8px;';

            const spinner = document.createElement('div');
            spinner.style.cssText = `
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            `;

            // Add spinner animation
            if (!document.querySelector('#spinner-animation')) {
                const spinnerStyle = document.createElement('style');
                spinnerStyle.id = 'spinner-animation';
                spinnerStyle.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(spinnerStyle);
            }

            spinnerContainer.appendChild(spinner);
            spinnerContainer.appendChild(document.createTextNode(title));
            titleElement.appendChild(spinnerContainer);

            // Create message
            const messageElement = document.createElement('div');            messageElement.style.cssText = `
                font-size: 15px;
                opacity: 0.9;
                margin-bottom: 16px;
                line-height: 1.4;
            `;
            messageElement.textContent = message;

            // Create progress bar background
            const progressBg = document.createElement('div');
            progressBg.style.cssText = `
                width: 100%;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 15px;
            `;

            // Create progress bar fill
            const progressFill = document.createElement('div');
            progressFill.style.cssText = `
                width: 0%;
                height: 100%;
                background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
                border-radius: 4px;
                transition: width 0.3s ease;
                animation: pulse 2s ease-in-out infinite;
            `;
            progressBg.appendChild(progressFill);

            // Create status text
            const statusElement = document.createElement('div');            statusElement.style.cssText = `
                font-size: 13px;
                opacity: 0.8;
                text-align: center;
                margin-bottom: 12px;
            `;
            statusElement.textContent = 'Initializing...';

            // Create logs container
            const logsContainer = document.createElement('div');            logsContainer.style.cssText = `
                background: rgba(0, 0, 0, 0.2);
                border-radius: 6px;
                padding: 12px;
                font-size: 12px;
                max-height: 220px;
                overflow-y: auto;
                margin-bottom: 10px;
                font-family: 'Courier New', monospace;
                border: 1px solid rgba(255, 255, 255, 0.1);
            `;

            // Assemble the loading bar
            loadingContainer.appendChild(titleElement);
            loadingContainer.appendChild(messageElement);
            loadingContainer.appendChild(progressBg);
            loadingContainer.appendChild(statusElement);
            loadingContainer.appendChild(logsContainer);

            // Add to document
            document.body.appendChild(loadingContainer);

            // Store references
            this.currentBar = {
                container: loadingContainer,
                progress: progressFill,
                status: statusElement,
                message: messageElement,
                logs: logsContainer,
                titleElement: titleElement,
                spinner: spinner
            };
            this.isShowing = true;

            // Add initial log
            this.addLog('🚀 Starting automation process...');

            return this.currentBar;
        }

        addLog(message) {
            if (!this.currentBar) return;

            const timestamp = new Date().toLocaleTimeString();
            const logEntry = `[${timestamp}] ${message}`;
            this.logs.push(logEntry);

            // Add to logs container
            const logElement = document.createElement('div');
            logElement.style.cssText = `
                margin-bottom: 2px;
                opacity: 0.9;
            `;
            logElement.textContent = logEntry;

            this.currentBar.logs.appendChild(logElement);

            // Auto-scroll to bottom
            this.currentBar.logs.scrollTop = this.currentBar.logs.scrollHeight;

            // Also log to console for debugging
            console.log(logEntry);
        }        updateProgress(percentage, statusText = "", logMessage = null) {
            if (!this.currentBar) return;

            // Allow full progress range from 0% to 100%
            const clampedPercentage = Math.min(100, Math.max(0, percentage));
            this.currentBar.progress.style.width = `${clampedPercentage}%`;

            if (statusText) {
                this.currentBar.status.textContent = statusText;
            }

            if (logMessage) {
                this.addLog(logMessage);
            }
        }

        // New method for step-specific progress tracking
        initializeStepProgress(stepConfig) {
            this.stepConfig = stepConfig;
            this.progressTracker = {
                currentStep: 0,
                totalSteps: stepConfig.milestones.length,
                currentProgress: 0,
                stepStartProgress: 0
            };
        }

        // Update progress for a specific milestone
        updateStepProgress(stepIndex, subProgress = 100, statusText = "", logMessage = null) {
            if (!this.progressTracker || !this.stepConfig) {
                // Fallback to regular progress update
                this.updateProgress(subProgress, statusText, logMessage);
                return;
            }

            const milestones = this.stepConfig.milestones;
            if (stepIndex >= milestones.length) return;

            // Calculate progress based on step completion
            let totalProgress = 0;
            
            // Add progress from completed steps
            for (let i = 0; i < stepIndex; i++) {
                totalProgress += milestones[i].weight;
            }
            
            // Add partial progress from current step
            if (stepIndex < milestones.length) {
                const currentStepWeight = milestones[stepIndex].weight;
                const stepProgress = Math.min(100, Math.max(0, subProgress));
                totalProgress += (currentStepWeight * stepProgress) / 100;            }

            this.progressTracker.currentStep = stepIndex;
            this.progressTracker.currentProgress = Math.min(100, totalProgress); // Allow full 100% completion

            // Update the visual progress
            this.updateProgress(this.progressTracker.currentProgress, 
                statusText || milestones[stepIndex]?.status || "Processing...",
                logMessage);
        }

        // Complete a specific step
        completeStep(stepIndex, logMessage = null) {
            if (!this.progressTracker || !this.stepConfig) return;

            const milestones = this.stepConfig.milestones;
            if (stepIndex >= milestones.length) return;

            const milestone = milestones[stepIndex];
            this.updateStepProgress(stepIndex, 100, milestone.completedStatus || "Completed", 
                logMessage || `✅ ${milestone.name} completed`);
        }        updateMessage(message) {
            if (!this.currentBar) return;
            this.currentBar.message.textContent = message;
        }

        // Method to manually set progress during long operations
        setProgress(percentage, statusText = "", logMessage = null) {
            if (!this.currentBar) return;
            
            // Clear any automatic progress interval
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }
            
            this.updateProgress(percentage, statusText, logMessage);
        }

        // Method to enable manual progress control
        enableManualProgress() {
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }
        }setSuccess(message = "Operation completed successfully!") {
            if (!this.currentBar) return;

            // Clear any running progress interval
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }

            // Stop spinner animation
            this.currentBar.spinner.style.animation = 'none';
            this.currentBar.spinner.style.border = '2px solid #56ab2f';

            // Ensure progress reaches 100% smoothly
            const currentWidth = parseInt(this.currentBar.progress.style.width) || 0;
            if (currentWidth < 100) {
                // Smooth transition to 100%
                this.currentBar.progress.style.transition = 'width 0.5s ease-out';
            }
            
            // Set progress to 100%
            this.currentBar.progress.style.width = '100%';
            this.currentBar.progress.style.background = 'linear-gradient(90deg, #56ab2f 0%, #a8e6cf 100%)';
            this.currentBar.progress.style.animation = 'none';
            this.currentBar.status.textContent = message;

            // Add success log
            this.addLog('✅ ' + message);

            // Add close button
            this.addCloseButton();
        }

        setError(message = "Operation failed!") {
            if (!this.currentBar) return;

            // Clear any running progress interval
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }

            // Stop spinner animation and make it red
            this.currentBar.spinner.style.animation = 'none';
            this.currentBar.spinner.style.border = '2px solid #ff416c';

            this.currentBar.progress.style.background = 'linear-gradient(90deg, #ff416c 0%, #ff4b2b 100%)';
            this.currentBar.progress.style.animation = 'none';
            this.currentBar.status.textContent = message;

            // Add error log
            this.addLog('❌ ' + message);

            // Add close button
            this.addCloseButton();
        }

        addCloseButton() {
            if (!this.currentBar || this.currentBar.container.querySelector('.close-button')) return;

            const closeButton = document.createElement('button');
            closeButton.className = 'close-button';
            closeButton.textContent = 'Close';
            closeButton.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 8px 16px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 10px;
                width: 100%;
                transition: background 0.2s ease;
            `;

            closeButton.addEventListener('mouseenter', () => {
                closeButton.style.background = 'rgba(255, 255, 255, 0.3)';
            });

            closeButton.addEventListener('mouseleave', () => {
                closeButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            closeButton.addEventListener('click', () => {
                this.hide();
            });

            this.currentBar.container.appendChild(closeButton);
        }

        hide() {
            if (!this.currentBar) return;

            // Clear any running progress interval
            if (this.progressInterval) {
                clearInterval(this.progressInterval);
                this.progressInterval = null;
            }

            this.currentBar.container.style.animation = 'slideOutRight 0.3s ease-out';

            setTimeout(() => {
                if (this.currentBar && this.currentBar.container.parentNode) {
                    this.currentBar.container.parentNode.removeChild(this.currentBar.container);
                }
                this.currentBar = null;
                this.isShowing = false;
            }, 300);
        }
    }    // Global loading bar manager instance
    const loadingBarManager = new LoadingBarManager();
    
    // Make loading bar manager globally accessible for progress reporting
    window.loadingBarManager = loadingBarManager;// Utility function to wrap menu command functions with loading bars
    function withLoadingBar(title, description, asyncFunction) {
        return async function(...args) {
            const bar = loadingBarManager.show(title, description);

            try {
                // Show initial progress
                loadingBarManager.updateProgress(5, "Initializing automation...", "📋 Preparing automation environment");

                // Add a small delay to show the loading bar
                await new Promise(resolve => setTimeout(resolve, 300));

                // Start dynamic progress tracking
                let currentProgress = 10;
                let progressIncrement = 2;
                let maxProgress = 90; // Leave room for completion
                
                loadingBarManager.progressInterval = setInterval(() => {
                    if (currentProgress < maxProgress) {
                        // Dynamic increment that slows down as we approach the end
                        progressIncrement = Math.max(0.5, progressIncrement * 0.98);
                        currentProgress += progressIncrement;
                        
                        // Ensure we don't exceed maxProgress
                        currentProgress = Math.min(maxProgress, currentProgress);
                        
                        loadingBarManager.updateProgress(currentProgress, "Processing...",
                            `⚙️ Processing automation step... (${Math.round(currentProgress)}%)`);
                    }
                }, 800);

                loadingBarManager.addLog(`🎯 Starting ${title} operation`);

                // Execute the actual function
                const result = await asyncFunction(...args);

                // Clear interval and show completion
                if (loadingBarManager.progressInterval) {
                    clearInterval(loadingBarManager.progressInterval);
                    loadingBarManager.progressInterval = null;
                }

                // Rapidly progress to 100%
                let finalProgress = Math.max(currentProgress, 90);
                const finalProgressInterval = setInterval(() => {
                    finalProgress += 2;
                    if (finalProgress >= 100) {
                        finalProgress = 100;
                        clearInterval(finalProgressInterval);
                        loadingBarManager.updateProgress(100, "Completed successfully!", "🎉 Automation completed successfully!");
                        loadingBarManager.setSuccess("Operation completed successfully!");
                    } else {
                        loadingBarManager.updateProgress(finalProgress, "Finalizing...", 
                            `🏁 Finalizing automation... (${Math.round(finalProgress)}%)`);
                    }
                }, 100);

                return result;

            } catch (error) {
                // Clear interval on error
                if (loadingBarManager.progressInterval) {
                    clearInterval(loadingBarManager.progressInterval);
                    loadingBarManager.progressInterval = null;
                }

                console.error(`Error in ${title}:`, error);
                loadingBarManager.addLog(`💥 Error occurred: ${error.message || 'Unknown error'}`);
                loadingBarManager.setError(`Error: ${error.message || 'Operation failed'}`);
                throw error;
            }
        };
    }

    // === END OF LOADING BAR UTILITY SYSTEM ===    // === CUSTOM MODAL SYSTEM ===
    // ===========================

    // Custom Alert Modal
    function showAlertModal(title, message) {
        return new Promise((resolve) => {
            // Remove any existing modal
            const existingModal = document.querySelector('#egetinnz-alert-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.id = 'egetinnz-alert-modal';
            modalContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease-out;
            `;

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                color: white;
                max-width: 500px;
                width: 90%;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideInScale 0.3s ease-out;
            `;

            // Create title
            const titleElement = document.createElement('div');
            titleElement.style.cssText = `
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            titleElement.textContent = title;

            // Create message
            const messageElement = document.createElement('div');
            messageElement.style.cssText = `
                font-size: 15px;
                line-height: 1.4;
                margin-bottom: 20px;
                white-space: pre-line;
            `;
            messageElement.textContent = message;

            // Create OK button
            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                width: 100%;
                transition: background 0.2s ease;
            `;

            okButton.addEventListener('mouseenter', () => {
                okButton.style.background = 'rgba(255, 255, 255, 0.3)';
            });

            okButton.addEventListener('mouseleave', () => {
                okButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            okButton.addEventListener('click', () => {
                modalContainer.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    modalContainer.remove();
                    resolve();
                }, 300);
            });

            // Assemble modal
            modalContent.appendChild(titleElement);
            modalContent.appendChild(messageElement);
            modalContent.appendChild(okButton);
            modalContainer.appendChild(modalContent);

            // Add animations
            if (!document.querySelector('#egetinnz-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'egetinnz-modal-styles';
                styles.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    @keyframes slideInScale {
                        from { transform: scale(0.7) translateY(-20px); opacity: 0; }
                        to { transform: scale(1) translateY(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(modalContainer);

            // Focus on OK button
            okButton.focus();

            // Handle ESC key
            const handleEsc = (e) => {
                if (e.key === 'Escape') {
                    okButton.click();
                    document.removeEventListener('keydown', handleEsc);
                }
            };
            document.addEventListener('keydown', handleEsc);
        });
    }    // Custom Button-based Room Selection Modal
    function showRoomSelectionModal(parsedRooms, currentPage = 1) {
        const ROOMS_PER_PAGE = 10;
        const totalRooms = parsedRooms.length;
        const totalPages = Math.ceil(totalRooms / ROOMS_PER_PAGE);
        
        return new Promise((resolve) => {
            // Remove any existing modal
            const existingModal = document.querySelector('#egetinnz-room-selection-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.id = 'egetinnz-room-selection-modal';
            modalContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease-out;
            `;

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                color: white;
                max-width: 700px;
                width: 90%;
                max-height: 85vh;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideInScale 0.3s ease-out;
            `;

            // Create title
            const titleElement = document.createElement('div');
            titleElement.style.cssText = `
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            titleElement.textContent = `📋 Room Selection - Page ${currentPage} of ${totalPages} (${totalRooms} total rooms)`;

            // Calculate room range for current page
            const startIndex = (currentPage - 1) * ROOMS_PER_PAGE;
            const endIndex = Math.min(startIndex + ROOMS_PER_PAGE, totalRooms);
            const roomsOnPage = parsedRooms.slice(startIndex, endIndex);

            // Create rooms container
            const roomsContainer = document.createElement('div');
            roomsContainer.style.cssText = `
                margin-bottom: 20px;
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: 8px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.05);
            `;

            // Add room buttons
            roomsOnPage.forEach((room, index) => {
                const globalIndex = startIndex + index + 1;
                const roomButton = document.createElement('button');
                roomButton.style.cssText = `
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 8px;
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                    text-align: left;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    display: block;
                `;
                roomButton.innerHTML = `<strong>${globalIndex}.</strong> ${room.name}`;
                
                roomButton.addEventListener('mouseenter', () => {
                    roomButton.style.background = 'rgba(255, 255, 255, 0.2)';
                    roomButton.style.transform = 'translateY(-1px)';
                });
                roomButton.addEventListener('mouseleave', () => {
                    roomButton.style.background = 'rgba(255, 255, 255, 0.1)';
                    roomButton.style.transform = 'translateY(0)';
                });
                
                roomButton.addEventListener('click', () => {
                    closeModal({ type: 'room', roomIndex: globalIndex - 1 });
                });
                
                roomsContainer.appendChild(roomButton);
            });

            // Create navigation section
            const navSection = document.createElement('div');
            navSection.style.cssText = `
                margin-bottom: 20px;
                border-top: 1px solid rgba(255, 255, 255, 0.2);
                padding-top: 15px;
            `;

            // Navigation title
            const navTitle = document.createElement('div');
            navTitle.style.cssText = `
                font-size: 16px;
                font-weight: 600;
                margin-bottom: 15px;
            `;
            navTitle.textContent = '📝 Navigation Options';

            // Navigation buttons container
            const navButtonsContainer = document.createElement('div');
            navButtonsContainer.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                margin-bottom: 15px;
            `;

            // Previous page button
            if (currentPage > 1) {
                const prevButton = createNavButton('← Previous', () => {
                    closeModal({ type: 'nav', action: 'prev' });
                });
                navButtonsContainer.appendChild(prevButton);
            }

            // Next page button
            if (currentPage < totalPages) {
                const nextButton = createNavButton('Next →', () => {
                    closeModal({ type: 'nav', action: 'next' });
                });
                navButtonsContainer.appendChild(nextButton);
            }

            // Page jump buttons (show a few pages around current page)
            if (totalPages > 1) {
                const pageJumpTitle = document.createElement('div');
                pageJumpTitle.style.cssText = `
                    font-size: 14px;
                    margin-bottom: 8px;
                    opacity: 0.9;
                `;
                pageJumpTitle.textContent = 'Jump to page:';
                navSection.appendChild(pageJumpTitle);

                const pageButtonsContainer = document.createElement('div');
                pageButtonsContainer.style.cssText = `
                    display: flex;
                    flex-wrap: wrap;
                    gap: 4px;
                    margin-bottom: 15px;
                `;

                // Show page buttons - display all pages if 10 or fewer, otherwise show range around current page
                let startPage = 1;
                let endPage = totalPages;
                
                if (totalPages > 10) {
                    startPage = Math.max(1, currentPage - 5);
                    endPage = Math.min(totalPages, currentPage + 4);
                    
                    // Adjust if we're near the beginning or end
                    if (endPage - startPage < 9) {
                        if (startPage === 1) {
                            endPage = Math.min(totalPages, startPage + 9);
                        } else {
                            startPage = Math.max(1, endPage - 9);
                        }
                    }
                }

                for (let page = startPage; page <= endPage; page++) {
                    const pageButton = document.createElement('button');
                    pageButton.style.cssText = `
                        padding: 8px 12px;
                        background: ${page === currentPage ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        border-radius: 4px;
                        color: white;
                        cursor: pointer;
                        font-size: 12px;
                        min-width: 40px;
                        transition: background 0.2s ease;
                        ${page === currentPage ? 'font-weight: bold;' : ''}
                    `;
                    pageButton.textContent = page;
                    
                    if (page !== currentPage) {
                        pageButton.addEventListener('mouseenter', () => {
                            pageButton.style.background = 'rgba(255, 255, 255, 0.2)';
                        });
                        pageButton.addEventListener('mouseleave', () => {
                            pageButton.style.background = 'rgba(255, 255, 255, 0.1)';
                        });
                        pageButton.addEventListener('click', () => {
                            closeModal({ type: 'nav', action: 'page', page: page });
                        });
                    }
                    
                    pageButtonsContainer.appendChild(pageButton);
                }
                navSection.appendChild(pageButtonsContainer);
            }

            // Action buttons container
            const actionButtonsContainer = document.createElement('div');
            actionButtonsContainer.style.cssText = `
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
            `;

            // Skip button
            const skipButton = createActionButton('⏭️ Skip Room Selection', 'rgba(255, 193, 7, 0.8)', () => {
                closeModal({ type: 'skip' });
            });

            // Cancel button
            const cancelButton = createActionButton('❌ Cancel', 'rgba(220, 53, 69, 0.8)', () => {
                closeModal({ type: 'cancel' });
            });

            actionButtonsContainer.appendChild(skipButton);
            actionButtonsContainer.appendChild(cancelButton);

            // Helper function to create navigation buttons
            function createNavButton(text, onClick) {
                const button = document.createElement('button');
                button.style.cssText = `
                    padding: 10px 16px;
                    background: rgba(255, 255, 255, 0.15);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    font-weight: 500;
                `;
                button.textContent = text;
                
                button.addEventListener('mouseenter', () => {
                    button.style.background = 'rgba(255, 255, 255, 0.25)';
                    button.style.transform = 'translateY(-1px)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.background = 'rgba(255, 255, 255, 0.15)';
                    button.style.transform = 'translateY(0)';
                });
                button.addEventListener('click', onClick);
                
                return button;
            }

            // Helper function to create action buttons
            function createActionButton(text, backgroundColor, onClick) {
                const button = document.createElement('button');
                button.style.cssText = `
                    padding: 12px 20px;
                    background: ${backgroundColor};
                    border: none;
                    border-radius: 6px;
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    flex: 1;
                    min-width: 140px;
                `;
                button.textContent = text;
                
                button.addEventListener('mouseenter', () => {
                    button.style.transform = 'translateY(-2px)';
                    button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                });
                button.addEventListener('mouseleave', () => {
                    button.style.transform = 'translateY(0)';
                    button.style.boxShadow = 'none';
                });
                button.addEventListener('click', onClick);
                
                return button;
            }

            // Close modal function
            const closeModal = (result) => {
                modalContainer.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    modalContainer.remove();
                    resolve(result);
                }, 300);
            };

            // Handle ESC key
            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    closeModal({ type: 'cancel' });
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);

            // Assemble modal
            navSection.appendChild(navTitle);
            navSection.appendChild(navButtonsContainer);
            
            modalContent.appendChild(titleElement);
            modalContent.appendChild(roomsContainer);
            modalContent.appendChild(navSection);
            modalContent.appendChild(actionButtonsContainer);
            modalContainer.appendChild(modalContent);

            document.body.appendChild(modalContainer);
        });
    }

    // Custom Prompt Modal
    function showPromptModal(title, message, defaultValue = '') {
        return new Promise((resolve) => {
            // Remove any existing modal
            const existingModal = document.querySelector('#egetinnz-prompt-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.id = 'egetinnz-prompt-modal';
            modalContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease-out;
            `;

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                color: white;
                max-width: 500px;
                width: 90%;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideInScale 0.3s ease-out;
            `;

            // Create title
            const titleElement = document.createElement('div');
            titleElement.style.cssText = `
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            titleElement.textContent = title;

            // Create message
            const messageElement = document.createElement('div');
            messageElement.style.cssText = `
                font-size: 15px;
                line-height: 1.4;
                margin-bottom: 15px;
                white-space: pre-line;
            `;
            messageElement.textContent = message;

            // Create input field
            const inputElement = document.createElement('input');
            inputElement.type = 'text';
            inputElement.value = defaultValue;
            inputElement.style.cssText = `
                width: 100%;
                padding: 10px;
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 6px;
                background: rgba(255, 255, 255, 0.1);
                color: white;
                font-size: 14px;
                margin-bottom: 20px;
                box-sizing: border-box;
            `;
            inputElement.placeholder = 'Enter value...';

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
            `;

            // Create Cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                flex: 1;
                transition: background 0.2s ease;
            `;

            // Create OK button
            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                flex: 1;
                transition: background 0.2s ease;
            `;

            // Button hover effects
            cancelButton.addEventListener('mouseenter', () => {
                cancelButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            cancelButton.addEventListener('mouseleave', () => {
                cancelButton.style.background = 'rgba(255, 255, 255, 0.1)';
            });

            okButton.addEventListener('mouseenter', () => {
                okButton.style.background = 'rgba(255, 255, 255, 0.3)';
            });
            okButton.addEventListener('mouseleave', () => {
                okButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            // Button click handlers
            const closeModal = (result) => {
                modalContainer.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    modalContainer.remove();
                    resolve(result);
                }, 300);
            };

            cancelButton.addEventListener('click', () => {
                closeModal(null);
            });

            okButton.addEventListener('click', () => {
                closeModal(inputElement.value);
            });

            // Handle Enter and ESC keys
            const handleKeydown = (e) => {
                if (e.key === 'Enter') {
                    okButton.click();
                    document.removeEventListener('keydown', handleKeydown);
                } else if (e.key === 'Escape') {
                    cancelButton.click();
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);

            // Assemble modal
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(okButton);
            modalContent.appendChild(titleElement);
            modalContent.appendChild(messageElement);
            modalContent.appendChild(inputElement);
            modalContent.appendChild(buttonContainer);
            modalContainer.appendChild(modalContent);

            document.body.appendChild(modalContainer);

            // Focus on input field
            inputElement.focus();
            inputElement.select();
        });
    }    // Function to detect existing pricing entries in the pricing table
    function detectExistingPricingEntries() {
        const existingMonths = new Set();
        const pricingTable = document.querySelector('#pricing-table');
        
        if (pricingTable) {
            const rows = pricingTable.querySelectorAll('tr');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td');
                if (cells.length > 0) {
                    const firstCell = cells[0];
                    const boldText = firstCell.querySelector('b');
                    
                    if (boldText) {
                        const priceName = boldText.textContent.trim();
                        
                        // Check for month-specific pricing entries (e.g., "July Price", "December Price")
                        const monthNames = [
                            'January', 'February', 'March', 'April', 'May', 'June',
                            'July', 'August', 'September', 'October', 'November', 'December'
                        ];
                        
                        monthNames.forEach((monthName, index) => {
                            if (priceName.toLowerCase().includes(monthName.toLowerCase())) {
                                existingMonths.add(monthName);
                            }
                        });
                    }
                }
            });
        }
        
        console.log(`🔍 Detected existing pricing entries for months: ${Array.from(existingMonths).join(', ')}`);
        return existingMonths;
    }

    // Custom Confirmation Modal with customizable buttons
    function showConfirmationModal(title, message, confirmText = 'Confirm', cancelText = 'Cancel') {
        return new Promise((resolve) => {
            // Remove any existing modal
            const existingModal = document.querySelector('#egetinnz-confirmation-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.id = 'egetinnz-confirmation-modal';
            modalContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease-out;
            `;

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                color: white;
                max-width: 500px;
                width: 90%;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideInScale 0.3s ease-out;
            `;

            // Create title
            const titleElement = document.createElement('div');
            titleElement.style.cssText = `
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            titleElement.textContent = title;

            // Create message
            const messageElement = document.createElement('div');
            messageElement.style.cssText = `
                font-size: 15px;
                line-height: 1.4;
                margin-bottom: 20px;
                white-space: pre-line;
            `;
            messageElement.textContent = message;

            // Create button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.cssText = `
                display: flex;
                gap: 10px;
            `;

            // Create Cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = cancelText;
            cancelButton.style.cssText = `
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                flex: 1;
                transition: background 0.2s ease;
            `;

            // Create Confirm button
            const confirmButton = document.createElement('button');
            confirmButton.textContent = confirmText;
            confirmButton.style.cssText = `
                background: rgba(255, 255, 255, 0.2);
                border: 1px solid rgba(255, 255, 255, 0.3);
                color: white;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                flex: 1;
                transition: background 0.2s ease;
            `;

            // Button hover effects
            cancelButton.addEventListener('mouseenter', () => {
                cancelButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            cancelButton.addEventListener('mouseleave', () => {
                cancelButton.style.background = 'rgba(255, 255, 255, 0.1)';
            });

            confirmButton.addEventListener('mouseenter', () => {
                confirmButton.style.background = 'rgba(255, 255, 255, 0.3)';
            });
            confirmButton.addEventListener('mouseleave', () => {
                confirmButton.style.background = 'rgba(255, 255, 255, 0.2)';
            });

            // Button click handlers
            const closeModal = (result) => {
                modalContainer.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    modalContainer.remove();
                    resolve(result);
                }, 300);
            };

            cancelButton.addEventListener('click', () => {
                closeModal({ type: 'cancel' });
            });

            confirmButton.addEventListener('click', () => {
                closeModal({ type: 'confirm' });
            });

            // Handle ESC key
            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    cancelButton.click();
                    document.removeEventListener('keydown', handleKeydown);
                } else if (e.key === 'Enter') {
                    confirmButton.click();
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);

            // Assemble modal
            buttonContainer.appendChild(cancelButton);
            buttonContainer.appendChild(confirmButton);
            modalContent.appendChild(titleElement);
            modalContent.appendChild(messageElement);
            modalContent.appendChild(buttonContainer);
            modalContainer.appendChild(modalContent);

            document.body.appendChild(modalContainer);

            // Focus on confirm button by default
            confirmButton.focus();
        });
    }

    // Month Selection Modal for Step 5 Pricing Automation
    function showMonthSelectionModal() {
        return new Promise((resolve) => {
            // Remove any existing modal
            const existingModal = document.querySelector('#egetinnz-month-selection-modal');
            if (existingModal) {
                existingModal.remove();
            }

            // Detect existing pricing entries
            const existingMonths = detectExistingPricingEntries();

            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.id = 'egetinnz-month-selection-modal';
            modalContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10001;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                backdrop-filter: blur(5px);
                animation: fadeIn 0.3s ease-out;
            `;

            // Create modal content
            const modalContent = document.createElement('div');
            modalContent.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                padding: 25px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                color: white;
                max-width: 600px;
                width: 90%;
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: slideInScale 0.3s ease-out;
            `;

            // Create title with status info
            const titleElement = document.createElement('div');
            titleElement.style.cssText = `
                font-size: 20px;
                font-weight: 600;
                margin-bottom: 15px;
                display: flex;
                align-items: center;
                gap: 8px;
            `;
            titleElement.textContent = '📅 Select Month for Pricing Analysis';

            // Create status info if existing months are detected
            let statusElement = null;
            if (existingMonths.size > 0) {
                statusElement = document.createElement('div');
                statusElement.style.cssText = `
                    background: rgba(40, 167, 69, 0.2);
                    border: 1px solid rgba(40, 167, 69, 0.4);
                    border-radius: 6px;
                    padding: 10px;
                    margin-bottom: 15px;
                    font-size: 13px;
                    line-height: 1.4;
                `;
                statusElement.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                        <span style="color: #28a745;">✅</span>
                        <strong>Existing Pricing Detected</strong>
                    </div>
                    <div>Already configured: ${Array.from(existingMonths).join(', ')}</div>
                `;
            }

            // Create month grid container
            const monthGrid = document.createElement('div');
            monthGrid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin-bottom: 20px;
            `;

            // Month names and current date info
            const monthNames = [
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
            ];
            
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // 1-based
            const currentYear = currentDate.getFullYear();

            // Create month buttons
            monthNames.forEach((monthName, index) => {
                const monthNumber = index + 1;
                const isCurrentOrFuture = monthNumber >= currentMonth;
                const targetYear = isCurrentOrFuture ? currentYear : currentYear + 1;
                const isCurrent = monthNumber === currentMonth;
                const hasExistingPricing = existingMonths.has(monthName);

                const monthButton = document.createElement('button');
                
                // Dynamic styling based on status
                let buttonBackground, buttonBorder, buttonOpacity;
                if (hasExistingPricing) {
                    buttonBackground = 'rgba(40, 167, 69, 0.3)'; // Green for existing
                    buttonBorder = 'rgba(40, 167, 69, 0.6)';
                    buttonOpacity = '1';
                } else if (isCurrent) {
                    buttonBackground = 'rgba(255, 193, 7, 0.3)'; // Yellow for current
                    buttonBorder = 'rgba(255, 193, 7, 0.6)';
                    buttonOpacity = '1';
                } else {
                    buttonBackground = 'rgba(255, 255, 255, 0.1)'; // Default
                    buttonBorder = 'rgba(255, 255, 255, 0.3)';
                    buttonOpacity = '1';
                }

                monthButton.style.cssText = `
                    padding: 15px 10px;
                    background: ${buttonBackground};
                    border: 1px solid ${buttonBorder};
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: ${(isCurrent || hasExistingPricing) ? '600' : '500'};
                    transition: all 0.2s ease;
                    text-align: center;
                    position: relative;
                    opacity: ${buttonOpacity};
                `;

                // Create month content with indicators
                const monthContent = document.createElement('div');
                let statusIndicator = '';
                
                if (hasExistingPricing) {
                    statusIndicator = '<div style="font-size: 10px; color: #28a745; margin-top: 2px;">✅ Configured</div>';
                } else if (isCurrent) {
                    statusIndicator = '<div style="font-size: 10px; color: #ffc107; margin-top: 2px;">• Current</div>';
                }

                monthContent.innerHTML = `
                    <div style="font-size: 16px; margin-bottom: 4px;">${monthName}</div>
                    <div style="font-size: 12px; opacity: 0.8;">${targetYear}</div>
                    ${statusIndicator}
                `;
                monthButton.appendChild(monthContent);

                // Enhanced hover effects
                monthButton.addEventListener('mouseenter', () => {
                    if (hasExistingPricing) {
                        monthButton.style.background = 'rgba(40, 167, 69, 0.4)';
                    } else {
                        monthButton.style.background = 'rgba(255, 255, 255, 0.25)';
                    }
                    monthButton.style.transform = 'translateY(-2px)';
                    monthButton.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
                });
                
                monthButton.addEventListener('mouseleave', () => {
                    monthButton.style.background = buttonBackground;
                    monthButton.style.transform = 'translateY(0)';
                    monthButton.style.boxShadow = 'none';
                });

                // Add click handler with confirmation for existing months
                monthButton.addEventListener('click', async () => {
                    if (hasExistingPricing) {
                        // Show confirmation for overwriting existing pricing
                        const confirmModal = await showConfirmationModal(
                            'Overwrite Existing Pricing?',
                            `${monthName} already has pricing configured. Analyzing this month will help you optimize the existing pricing.\n\nDo you want to proceed with pricing analysis for ${monthName} ${targetYear}?`,
                            'Proceed with Analysis',
                            'Choose Different Month'
                        );
                        
                        if (confirmModal.type === 'confirm') {
                            closeModal({
                                type: 'select',
                                monthNumber: monthNumber,
                                monthName: monthName,
                                targetYear: targetYear,
                                hasExisting: true
                            });
                        }
                        // If cancelled, do nothing (stay in modal)
                    } else {
                        closeModal({
                            type: 'select',
                            monthNumber: monthNumber,
                            monthName: monthName,
                            targetYear: targetYear,
                            hasExisting: false
                        });
                    }
                });

                monthGrid.appendChild(monthButton);
            });

            // Create cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = '❌ Cancel';
            cancelButton.style.cssText = `
                background: rgba(220, 53, 69, 0.8);
                border: none;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                width: 100%;
                transition: all 0.2s ease;
            `;

            cancelButton.addEventListener('mouseenter', () => {
                cancelButton.style.background = 'rgba(220, 53, 69, 0.9)';
                cancelButton.style.transform = 'translateY(-1px)';
            });

            cancelButton.addEventListener('mouseleave', () => {
                cancelButton.style.background = 'rgba(220, 53, 69, 0.8)';
                cancelButton.style.transform = 'translateY(0)';
            });

            cancelButton.addEventListener('click', () => {
                closeModal({ type: 'cancel' });
            });

            // Close modal function
            const closeModal = (result) => {
                modalContainer.style.animation = 'fadeOut 0.3s ease-out';
                setTimeout(() => {
                    modalContainer.remove();
                    resolve(result);
                }, 300);
            };

            // Handle ESC key
            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    closeModal({ type: 'cancel' });
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);

            // Assemble modal
            modalContent.appendChild(titleElement);
            modalContent.appendChild(monthGrid);
            modalContent.appendChild(cancelButton);
            modalContainer.appendChild(modalContent);

            // Add animations if not already present
            if (!document.querySelector('#egetinnz-modal-styles')) {
                const styles = document.createElement('style');
                styles.id = 'egetinnz-modal-styles';
                styles.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    @keyframes slideInScale {
                        from { transform: scale(0.7) translateY(-20px); opacity: 0; }
                        to { transform: scale(1) translateY(0); opacity: 1; }
                    }
                `;
                document.head.appendChild(styles);
            }

            document.body.appendChild(modalContainer);
        });
    }

    // --- Together.ai API Key Configuration ---
    async function configureTogetherAIKey() {
        const currentKey = GM_getValue('togetherApiKey', '');
        const message = currentKey ?
            `Current Together.ai API Key: ${currentKey.substring(0, 8)}...\n\nEnter a new API key to update, or leave blank to keep current:` :
            'No Together.ai API key configured.\n\nThis key is used for intelligent attraction detection in Step 3.\nEnter your Together.ai API key:';

        const newKey = await showPromptModal('Configure Together.ai API Key', message, '');

        if (newKey === null) {
            // User cancelled
            return;
        }

        if (newKey.trim() === '') {
            if (currentKey) {
                await showAlertModal('API Key Configuration', 'Keeping current API key.');
                return;
            } else {
                await showAlertModal('API Key Configuration', 'No API key entered. LLM-powered attraction detection will not work in Step 3.');
                return;
            }
        }

        // Basic validation for Together.ai API key
        if (newKey.length < 20) {
            await showAlertModal('Invalid API Key', 'Invalid API key format. Together.ai API keys should be at least 20 characters long.');
            return;
        }

        GM_setValue('togetherApiKey', newKey.trim());
        await showAlertModal('Success', 'Together.ai API key saved successfully! LLM-powered attraction detection is now enabled for Step 3.');
    }    // --- API Key Status Check ---
    async function checkAPIKeyStatus() {
        const apiKey = GM_getValue('togetherApiKey', '');
        if (!apiKey) {
            await showAlertModal('Together.ai API Key Status', '❌ No Together.ai API Key Configured\n\nLLM-powered attraction detection is disabled.\nUse "🔧 Configure Together.ai API Key" from the Tampermonkey menu to set up your API key.\n\nThe script will fall back to basic heuristic detection for Step 3.');
        } else {
            await showAlertModal('Together.ai API Key Status', `✅ Together.ai API Key Configured\n\nKey: ${apiKey.substring(0, 8)}...\nLLM-powered attraction detection is enabled for Step 3.\n\nYou can update your key using "🔧 Configure Together.ai API Key" from the menu.`);
        }
    }

    // --- Startup Notification ---
    function checkStartupConfiguration() {
        const apiKey = GM_getValue('togetherApiKey', '');
        if (!apiKey) {
            console.log("💡 Tip: Configure Together.ai API key via Tampermonkey menu for enhanced Step 3 attraction detection");
        } else {
            console.log("✅ Together.ai API key configured - LLM-powered attraction detection enabled");
        }
    }    // Check startup configuration
    checkStartupConfiguration();

        // === BATHROOM MODAL AUTOMATION SYSTEM ===
        // ========================================

        // LLM-Powered Kitchen Details Detection System for Step 4 Checkboxes
        async function automateKitchenDetailsCheckboxes(hotelName, expediaHotelUrl) {
            console.log("Starting enhanced kitchen details detection using property amenities GraphQL data...");

            // Available kitchen details checkboxes from the form
            const kitchenMapping = {
                "Kitchen_0__Checked": "Coffee Maker",
                "Kitchen_1__Checked": "Dishes and Utensils",
                "Kitchen_2__Checked": "Dishwasher",
                "Kitchen_3__Checked": "Microwave",
                "Kitchen_4__Checked": "Oven",
                "Kitchen_5__Checked": "Pots and Pans",
                "Kitchen_6__Checked": "Refrigerator",
                "Kitchen_7__Checked": "Stove",
                "Kitchen_8__Checked": "Toaster"
            };

            // Get property ID for fetching comprehensive amenities data
            const propertyId = GM_getValue("propertyId", null);

            // Get selectedRoom data for room-specific kitchen amenities
            const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
            let selectedRoom = null;
            if (selectedRoomJSON) {
                try {
                    selectedRoom = JSON.parse(selectedRoomJSON);
                } catch (error) {
                    console.warn("Could not parse selectedRoomDetails:", error);
                }
            }

            // Fetch comprehensive property amenities data using the specific GraphQL query
            let propertyAmenitiesData = '';
            let amenitiesSummary = [];
            let kitchenAmenities = [];
            let roomKitchenAmenities = [];

            try {
                if (propertyId) {
                    console.log("Fetching comprehensive property amenities data for enhanced kitchen details analysis...");
                    const amenitiesResponse = await fetchPropertyAmenitiesDataGraphQL(propertyId);

                    // Extract amenities data from the response
                    const propertyInfo = amenitiesResponse?.[0]?.data?.propertyInfo;
                    if (propertyInfo) {
                        // Extract top amenities from summary
                        const topAmenities = propertyInfo?.summary?.amenities?.topAmenities?.infoItems || [];
                        amenitiesSummary = topAmenities.map(item => item.text || '').filter(text => text);

                        // Extract detailed amenities sections, especially "Kitchen" and "Dining"
                        const amenitiesSections = propertyInfo?.summary?.amenities?.amenities || [];
                        amenitiesSections.forEach(section => {
                            if (section.header?.text === "Kitchen" || section.header?.text === "Dining" ||
                                section.header?.text === "Food & Drink" ||
                                section.header?.text?.toLowerCase().includes('kitchen') ||
                                section.header?.text?.toLowerCase().includes('cooking') ||
                                section.header?.text?.toLowerCase().includes('dining')) {
                                const sectionItems = section.infoItems || [];
                                const sectionAmenities = sectionItems.map(item => item.text || '').filter(text => text);
                                kitchenAmenities.push(...sectionAmenities);
                            }
                        });

                        // Extract detailed amenities from property content sections
                        const contentSections = propertyInfo?.propertyContentSectionGroups?.amenities?.sections || [];
                        contentSections.forEach(section => {
                            const subSections = section.bodySubSections || [];
                            subSections.forEach(subSection => {
                                const elements = subSection.elementsV2 || [];
                                elements.forEach(elementGroup => {
                                    const groupElements = elementGroup.elements || [];
                                    groupElements.forEach(element => {
                                        if (element.header?.text === "Kitchen" ||
                                            element.header?.text === "Dining" ||
                                            element.header?.text === "Food & Drink" ||
                                            element.header?.text?.toLowerCase().includes('kitchen') ||
                                            element.header?.text?.toLowerCase().includes('cooking') ||
                                            element.header?.text?.toLowerCase().includes('dining')) {
                                            const items = element.items || [];
                                            items.forEach(item => {
                                                if (item.content?.primary?.value) {
                                                    kitchenAmenities.push(item.content.primary.value);
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });

                        console.log(`Extracted ${amenitiesSummary.length} top amenities, ${kitchenAmenities.length} kitchen amenities`);
                    } else {
                        console.warn("No property info found in amenities response");
                    }
                } else {
                    console.warn("No property ID available for amenities data");
                }
            } catch (error) {
                console.error("Failed to fetch property amenities data:", error);
                propertyAmenitiesData = 'Property amenities data unavailable';
            }

            // Extract kitchen amenities from selected room data
            try {
                if (selectedRoom && selectedRoom.roomAmenities) {
                    // Check for kitchen amenities in room data
                    if (selectedRoom.roomAmenities.kitchen && Array.isArray(selectedRoom.roomAmenities.kitchen)) {
                        roomKitchenAmenities = selectedRoom.roomAmenities.kitchen;
                    } else if (selectedRoom.roomAmenities.general && Array.isArray(selectedRoom.roomAmenities.general)) {
                        // Look for kitchen-related amenities in general section
                        roomKitchenAmenities = selectedRoom.roomAmenities.general.filter(amenity => {
                            const amenityLower = amenity.toLowerCase();
                            return amenityLower.includes('kitchen') || amenityLower.includes('microwave') ||
                                   amenityLower.includes('refrigerator') || amenityLower.includes('coffee') ||
                                   amenityLower.includes('dishwasher') || amenityLower.includes('stove') ||
                                   amenityLower.includes('oven') || amenityLower.includes('cooking') ||
                                   amenityLower.includes('toaster') || amenityLower.includes('utensils');
                        });
                    }
                    console.log("Extracted kitchen amenities from selected room:", roomKitchenAmenities);
                }
            } catch (error) {
                console.error("Error extracting kitchen amenities from selected room:", error);
            }

            // Create structured kitchen amenities data for LLM analysis
            propertyAmenitiesData = JSON.stringify({
                topAmenities: amenitiesSummary.slice(0, 15),
                kitchenAmenities: [...new Set(kitchenAmenities)].slice(0, 20), // Remove duplicates
                roomKitchenAmenities: roomKitchenAmenities.slice(0, 10),
                hotelType: selectedRoom?.name || hotelName || 'Unknown'
            }, null, 2);

            // Fetch and analyze webpage content using existing pattern
            let webpageContent = '';
            let webpageTitle = '';
            let webpageDescription = '';

            try {
                const webpageHtml = await fetchExpediaData(expediaHotelUrl);

                const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
                webpageTitle = titleMatch ? titleMatch[1].trim() : '';

                const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
                webpageDescription = descMatch ? descMatch[1].trim() : '';

                let textContent = webpageHtml
                    .replace(/<script[^>]*>.*?<\/script>/gis, '')
                    .replace(/<style[^>]*>.*?<\/style>/gis, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (textContent.length > 2000) {
                    const keywordSections = textContent.match(/(?:kitchen|kitchenette|cooking|microwave|refrigerator|fridge|coffee|dishwasher|stove|oven|toaster|utensils|dishes|pots|pans|dining|food|beverage|appliances)[^.!?]*[.!?]/gi);
                    webpageContent = keywordSections && keywordSections.length > 0 ? keywordSections.join(' ').substring(0, 2000) : textContent.substring(0, 2000);
                } else {
                    webpageContent = textContent;
                }

            } catch (error) {
                console.error("Failed to fetch Expedia webpage content:", error);
                webpageContent = 'Unable to fetch webpage content';
            }

            // Create conservative, data-driven prompt for LLM analysis to prevent hallucination
            const kitchenPrompt = `You are a conservative data analyst. Analyze the provided hotel data and select ONLY kitchen amenities that are explicitly mentioned or directly confirmed in the data. DO NOT make assumptions or infer amenities that are not clearly stated.

    Hotel Name: ${hotelName || 'Unknown Hotel'}
    Room Type: ${selectedRoom?.name || 'Unknown Room'}
    Webpage Title: ${webpageTitle}
    Webpage Description: ${webpageDescription}
    Webpage Content: ${webpageContent}

    Property Amenities Data (from GraphQL - structured property data):
    ${propertyAmenitiesData}

    Available kitchen amenity options: ${Object.values(kitchenMapping).join(', ')}

    STRICT VALIDATION RULES:
    1. ONLY select amenities that are explicitly mentioned by name in the provided data
    2. ONLY select amenities that are directly listed in the Property Amenities Data
    3. DO NOT infer or assume amenities based on property type or similar accommodations
    4. DO NOT select amenities that "might be available" without explicit mention
    5. If an amenity is mentioned as being "available" or "provided", it must include specific confirmation
    6. When in doubt, DO NOT include the amenity

    EVIDENCE REQUIREMENTS:
    - For "Coffee Maker": Look for explicit mentions of "coffee maker", "coffee machine", "espresso machine", or "coffee facilities"
    - For "Dishes and Utensils": Look for explicit mentions of "dishes", "utensils", "cutlery", "plates", "bowls", or "dining ware"
    - For "Dishwasher": Look for explicit mentions of "dishwasher" or "dish washing machine"
    - For "Microwave": Look for explicit mentions of "microwave", "microwave oven", or "micro wave"
    - For "Oven": Look for explicit mentions of "oven", "baking oven", or "cooking oven"
    - For "Pots and Pans": Look for explicit mentions of "pots and pans", "cookware", "cooking pots", or "cooking pans"
    - For "Refrigerator": Look for explicit mentions of "refrigerator", "fridge", "mini fridge", "mini-fridge", or "cooling unit"
    - For "Stove": Look for explicit mentions of "stove", "cooktop", "hob", "cooking range", or "burner"
    - For "Toaster": Look for explicit mentions of "toaster", "bread toaster", or "toasting machine"

    Return ONLY a JSON array containing amenities that meet these strict evidence requirements. If no amenities meet the criteria, return an empty array [].

    Example valid responses:
    - ["Coffee Maker", "Microwave", "Refrigerator"] (only if explicitly mentioned)
    - ["Dishwasher", "Stove", "Oven"] (only if explicitly mentioned)
    - [] (if no amenities are explicitly confirmed)

    Be extremely conservative - it's better to miss an amenity than to incorrectly include one that isn't explicitly confirmed in the data.`;

            try {
                // Check if API key is configured
                const apiKey = GM_getValue('togetherApiKey', '');
                if (!apiKey) {
                    console.warn("No Together.ai API key configured. Using heuristic detection.");
                    throw new Error("NO_API_KEY");
                }

                // Try LLM analysis
                let kitchenSuggestions = [];
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [{ role: 'user', content: kitchenPrompt }],
                        max_tokens: 500,
                        temperature: 0.1
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const llmResponse = data.choices?.[0]?.message?.content?.trim();

                    if (llmResponse) {
                        const jsonMatch = llmResponse.match(/\[[\s\S]*?\]/);
                        if (jsonMatch) {
                            kitchenSuggestions = JSON.parse(jsonMatch[0]);
                            console.log("LLM kitchen suggestions:", kitchenSuggestions);
                        }
                    }
                }

                // Apply suggestions to checkboxes
                let checkedCount = 0;
                Object.entries(kitchenMapping).forEach(([checkboxId, amenityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = kitchenSuggestions.includes(amenityName);
                        if (checkbox.checked) checkedCount++;
                    }
                });

                return {
                    success: true,
                    method: "llm_analysis",
                    checkedCount: checkedCount,
                    checkedAmenities: kitchenSuggestions
                };

            } catch (error) {
                console.warn("LLM failed, using enhanced heuristic detection with GraphQL data:", error);

                // Enhanced fallback heuristic detection with GraphQL data
                let kitchenSuggestions = [];
                const allContent = (webpageTitle + ' ' + webpageDescription + ' ' + webpageContent).toLowerCase();

                // Include property amenities data in heuristic analysis
                let amenitiesContent = '';
                if (kitchenAmenities.length > 0 || amenitiesSummary.length > 0 || roomKitchenAmenities.length > 0) {
                    const kitchenText = kitchenAmenities.join(' ');
                    const summaryText = amenitiesSummary.join(' ');
                    const roomKitchenText = roomKitchenAmenities.join(' ');
                    amenitiesContent = (kitchenText + ' ' + summaryText + ' ' + roomKitchenText).toLowerCase();
                    console.log("Using property amenities data for enhanced kitchen heuristic detection");
                }

                const combinedContent = allContent + ' ' + amenitiesContent;

                // Heuristic matching patterns
                const patterns = {
                    "Coffee Maker": /\b(coffee.?maker|coffee.?machine|espresso.?machine|coffee.?facilities)\b/,
                    "Dishes and Utensils": /\b(dishes|utensils|cutlery|plates|bowls|dining.?ware|crockery|tableware)\b/,
                    "Dishwasher": /\b(dishwasher|dish.?washing.?machine)\b/,
                    "Microwave": /\b(microwave|microwave.?oven|micro.?wave)\b/,
                    "Oven": /\b(oven|baking.?oven|cooking.?oven|conventional.?oven)\b/,
                    "Pots and Pans": /\b(pots.?and.?pans|cookware|cooking.?pots|cooking.?pans|saucepans)\b/,
                    "Refrigerator": /\b(refrigerator|fridge|mini.?fridge|mini-fridge|cooling.?unit|icebox)\b/,
                    "Stove": /\b(stove|cooktop|hob|cooking.?range|burner|gas.?stove|electric.?stove)\b/,
                    "Toaster": /\b(toaster|bread.?toaster|toasting.?machine)\b/
                };

                // Apply pattern matching
                Object.entries(patterns).forEach(([amenityName, pattern]) => {
                    if (pattern.test(combinedContent)) {
                        kitchenSuggestions.push(amenityName);
                    }
                });

                console.log("Heuristic kitchen suggestions:", kitchenSuggestions);

                // Apply enhanced heuristic suggestions
                let checkedCount = 0;
                Object.entries(kitchenMapping).forEach(([checkboxId, amenityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = kitchenSuggestions.includes(amenityName);
                        if (checkbox.checked) checkedCount++;
                    }
                });

                return {
                    success: true,
                    method: amenitiesContent ? "heuristic_with_amenities" : "heuristic_fallback",
                    checkedCount: checkedCount,
                    checkedAmenities: kitchenSuggestions
                };
            }        }

        // Function to automate Common Amenities checkboxes using enhanced property amenities data
        async function automateCommonAmenitiesCheckboxes(hotelName, expediaHotelUrl) {
            console.log("Starting enhanced common amenities detection using property amenities GraphQL data...");

            // Available common amenities checkboxes from the form
            const amenitiesMapping = {
                "Amenities_0__Checked": "Air Conditioning",
                "Amenities_1__Checked": "Clothes Dryer",
                "Amenities_2__Checked": "Fan",
                "Amenities_3__Checked": "Fireplace",
                "Amenities_4__Checked": "Fitness Room / Equipment",
                "Amenities_5__Checked": "Garage",
                "Amenities_6__Checked": "Hair Dryer",
                "Amenities_7__Checked": "Heating",
                "Amenities_8__Checked": "Iron and Board",
                "Amenities_9__Checked": "Linens Provided",
                "Amenities_10__Checked": "Parking",
                "Amenities_11__Checked": "Telephone",
                "Amenities_12__Checked": "Towels Provided",
                "Amenities_13__Checked": "Washing Machine",
                "Amenities_14__Checked": "WiFi/Internet",
                "Amenities_15__Checked": "Wood Stove"            };

            // Get property ID for fetching comprehensive amenities data
            const propertyId = GM_getValue("propertyId", null);

            // Get selectedRoom data for room-specific amenities
            const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
            let selectedRoom = null;
            if (selectedRoomJSON) {
                try {
                    selectedRoom = JSON.parse(selectedRoomJSON);
                } catch (error) {
                    console.warn("Could not parse selectedRoomDetails:", error);
                }
            }

            // Fetch comprehensive property amenities data using the specific GraphQL query
            let propertyAmenitiesData = '';
            let amenitiesSummary = [];
            let generalAmenities = [];            let roomGeneralAmenities = [];

            try {
                if (propertyId) {
                    console.log("Fetching comprehensive property amenities data for enhanced common amenities analysis...");
                    const amenitiesResponse = await fetchPropertyAmenitiesDataGraphQL(propertyId);

                    // Extract amenities data from the response
                    const propertyInfo = amenitiesResponse?.[0]?.data?.propertyInfo;
                    if (propertyInfo) {
                        // Extract top amenities from summary
                        const topAmenities = propertyInfo?.summary?.amenities?.topAmenities?.infoItems || [];
                        amenitiesSummary = topAmenities.map(item => item.text || '').filter(text => text);

                        // Extract detailed amenities sections, especially common amenities categories
                        const amenitiesSections = propertyInfo?.summary?.amenities?.amenities || [];
                        amenitiesSections.forEach(section => {
                            const sectionHeader = section.header?.text?.toLowerCase() || '';
                            if (sectionHeader.includes('general') || sectionHeader.includes('comfort') ||
                                sectionHeader.includes('convenience') || sectionHeader.includes('laundry') ||
                                sectionHeader.includes('heating') || sectionHeader.includes('cooling') ||
                                sectionHeader.includes('internet') || sectionHeader.includes('parking') ||
                                sectionHeader.includes('entertainment') || sectionHeader.includes('safety') ||
                                sectionHeader.includes('accessibility') || !sectionHeader.includes('kitchen') &&
                                !sectionHeader.includes('dining') && !sectionHeader.includes('bathroom')) {
                                const sectionItems = section.infoItems || [];
                                const sectionAmenities = sectionItems.map(item => item.text || '').filter(text => text);
                                generalAmenities.push(...sectionAmenities);
                            }
                        });

                        // Extract detailed amenities from property content sections
                        const contentSections = propertyInfo?.propertyContentSectionGroups?.amenities?.sections || [];
                        contentSections.forEach(section => {
                            const subSections = section.bodySubSections || [];
                            subSections.forEach(subSection => {
                                const elements = subSection.elementsV2 || [];
                                elements.forEach(elementGroup => {
                                    const groupElements = elementGroup.elements || [];
                                    groupElements.forEach(element => {
                                        const elementHeader = element.header?.text?.toLowerCase() || '';
                                        if (elementHeader.includes('general') || elementHeader.includes('comfort') ||
                                            elementHeader.includes('convenience') || elementHeader.includes('laundry') ||
                                            elementHeader.includes('heating') || elementHeader.includes('cooling') ||
                                            elementHeader.includes('internet') || elementHeader.includes('parking') ||
                                            elementHeader.includes('entertainment') || elementHeader.includes('safety') ||
                                            elementHeader.includes('accessibility') || (!elementHeader.includes('kitchen') &&
                                            !elementHeader.includes('dining') && !elementHeader.includes('bathroom'))) {
                                            const items = element.items || [];
                                            items.forEach(item => {
                                                if (item.content?.primary?.value) {
                                                    generalAmenities.push(item.content.primary.value);
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });

                        console.log(`Extracted ${amenitiesSummary.length} top amenities, ${generalAmenities.length} general amenities`);
                    } else {
                        console.warn("No property info found in amenities response");
                    }
                } else {
                    console.warn("No property ID available for amenities data");
                }
            } catch (error) {
                console.error("Failed to fetch property amenities data:", error);
                propertyAmenitiesData = 'Property amenities data unavailable';            }

            // Extract general amenities from selected room data
            try {
                if (selectedRoom && selectedRoom.roomAmenities) {
                    // Check for general amenities in room data
                    if (selectedRoom.roomAmenities.general && Array.isArray(selectedRoom.roomAmenities.general)) {
                        roomGeneralAmenities = selectedRoom.roomAmenities.general.filter(amenity => {
                            const amenityLower = amenity.toLowerCase();
                            // Exclude kitchen-specific and bathroom-specific amenities
                            return !amenityLower.includes('kitchen') && !amenityLower.includes('microwave') &&
                                   !amenityLower.includes('refrigerator') && !amenityLower.includes('coffee') &&
                                   !amenityLower.includes('dishwasher') && !amenityLower.includes('stove') &&
                                   !amenityLower.includes('oven') && !amenityLower.includes('cooking') &&
                                   !amenityLower.includes('toaster') && !amenityLower.includes('utensils') &&
                                   !amenityLower.includes('bathroom') && !amenityLower.includes('shower') &&
                                   !amenityLower.includes('bathtub') && !amenityLower.includes('toilet');
                        });
                    }
                    console.log("Extracted general amenities from selected room:", roomGeneralAmenities);
                }
            } catch (error) {
                console.error("Error extracting general amenities from selected room:", error);
            }

            // Create structured amenities data for LLM analysis
            propertyAmenitiesData = JSON.stringify({
                topAmenities: amenitiesSummary.slice(0, 20),
                generalAmenities: [...new Set(generalAmenities)].slice(0, 25), // Remove duplicates
                roomGeneralAmenities: roomGeneralAmenities.slice(0, 15),
                hotelType: selectedRoom?.name || hotelName || 'Unknown'
            }, null, 2);

            // Fetch and analyze webpage content using existing pattern
            let webpageContent = '';
            let webpageTitle = '';
            let webpageDescription = '';

            try {
                const webpageHtml = await fetchExpediaData(expediaHotelUrl);

                const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
                webpageTitle = titleMatch ? titleMatch[1].trim() : '';

                const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
                webpageDescription = descMatch ? descMatch[1].trim() : '';

                let textContent = webpageHtml
                    .replace(/<script[^>]*>.*?<\/script>/gis, '')
                    .replace(/<style[^>]*>.*?<\/style>/gis, '')
                    .replace(/<[^>]+>/g, ' ')
                    .replace(/\s+/g, ' ')
                    .trim();

                if (textContent.length > 2000) {
                    const keywordSections = textContent.match(/(?:air.conditioning|dryer|fan|fireplace|fitness|gym|garage|hair.dryer|heating|iron|linens|parking|telephone|towels|washing.machine|wifi|internet|wood.stove|laundry|amenities)[^.!?]*[.!?]/gi);
                    webpageContent = keywordSections && keywordSections.length > 0 ? keywordSections.join(' ').substring(0, 2000) : textContent.substring(0, 2000);
                } else {
                    webpageContent = textContent;
                }

            } catch (error) {
                console.error("Failed to fetch Expedia webpage content:", error);
                webpageContent = 'Unable to fetch webpage content';            }            // Create conservative, data-driven prompt for LLM analysis to prevent hallucination
            const amenitiesPrompt = `You are a conservative data analyst. Analyze the provided hotel data and select ONLY common amenities that are explicitly mentioned or directly confirmed in the data. DO NOT make assumptions or infer amenities that are not clearly stated.

    Hotel Name: ${hotelName || 'Unknown Hotel'}
    Room Type: ${selectedRoom?.name || 'Unknown Room'}
    Webpage Title: ${webpageTitle}
    Webpage Description: ${webpageDescription}
    Webpage Content: ${webpageContent}

    Property Amenities Data (from GraphQL - structured property data):
    ${propertyAmenitiesData}

    VALID AMENITY OPTIONS (you MUST use these EXACT names only):
    1. "Air Conditioning"
    2. "Clothes Dryer"
    3. "Fan"
    4. "Fireplace"
    5. "Fitness Room / Equipment"
    6. "Garage"
    7. "Hair Dryer"
    8. "Heating"
    9. "Iron and Board"
    10. "Linens Provided"
    11. "Parking"
    12. "Telephone"
    13. "Towels Provided"
    14. "Washing Machine"
    15. "WiFi/Internet"
    16. "Wood Stove"

    CRITICAL INSTRUCTIONS:
    - You MUST only return amenities using the EXACT names listed above (case-sensitive)
    - DO NOT return "Free WiFi", "Breakfast available", "24/7 front desk" or any other names
    - DO NOT return generic amenity descriptions
    - DO NOT make up amenity names
    - If you find evidence for WiFi, return "WiFi/Internet" (not "Free WiFi" or "Internet")

    STRICT VALIDATION RULES:
    1. ONLY select amenities that are explicitly mentioned by name in the provided data
    2. ONLY select amenities that are directly listed in the Property Amenities Data
    3. DO NOT infer or assume amenities based on property type or similar accommodations
    4. DO NOT select amenities that "might be available" without explicit mention
    5. If an amenity is mentioned as being "available" or "provided", it must include specific confirmation
    6. When in doubt, DO NOT include the amenity
    7. NEVER return amenity names that are not in the valid list above

    EVIDENCE REQUIREMENTS:
    - For "Air Conditioning": Look for explicit mentions of "air conditioning", "AC", "climate control", or "cooling"
    - For "Clothes Dryer": Look for explicit mentions of "dryer", "clothes dryer", "laundry dryer", or "tumble dryer"
    - For "Fan": Look for explicit mentions of "fan", "ceiling fan", "portable fan", or "ventilation fan"
    - For "Fireplace": Look for explicit mentions of "fireplace", "wood burning fireplace", or "gas fireplace"
    - For "Fitness Room / Equipment": Look for explicit mentions of "fitness", "gym", "exercise equipment", "workout room", or "fitness center"
    - For "Garage": Look for explicit mentions of "garage", "covered parking", or "enclosed parking"
    - For "Hair Dryer": Look for explicit mentions of "hair dryer", "blow dryer", or "hairdryer"
    - For "Heating": Look for explicit mentions of "heating", "heater", "central heating", or "heat"
    - For "Iron and Board": Look for explicit mentions of "iron", "ironing board", "clothes iron", or "ironing facilities"
    - For "Linens Provided": Look for explicit mentions of "linens", "bed linens", "bedding", or "sheets provided"
    - For "Parking": Look for explicit mentions of "parking", "free parking", "on-site parking", or "parking space"
    - For "Telephone": Look for explicit mentions of "telephone", "phone", "landline", or "house phone"
    - For "Towels Provided": Look for explicit mentions of "towels", "bath towels", "towels provided", or "fresh towels"
    - For "Washing Machine": Look for explicit mentions of "washing machine", "washer", "laundry machine", or "clothes washer"
    - For "WiFi/Internet": Look for explicit mentions of "wifi", "wi-fi", "internet", "wireless internet", or "broadband"
    - For "Wood Stove": Look for explicit mentions of "wood stove", "wood burning stove", or "log burner"

    Return ONLY a JSON array containing the EXACT amenity names from the valid list above that meet the strict evidence requirements. If no amenities meet the criteria, return an empty array [].

    VALID example responses (use exact names from list):
    - ["Air Conditioning", "WiFi/Internet", "Parking"] (only if explicitly mentioned)
    - ["Heating", "Towels Provided", "Linens Provided"] (only if explicitly mentioned)
    - [] (if no amenities are explicitly confirmed)

    INVALID example responses (DO NOT use these):
    - ["Free WiFi", "Breakfast available", "24/7 front desk"] (not in valid list)
    - ["Internet", "AC", "Free Parking"] (not exact names from valid list)

    Be extremely conservative - it's better to miss an amenity than to incorrectly include one that isn't explicitly confirmed in the data.`;

            try {
                // Check if API key is configured
                const apiKey = GM_getValue('togetherApiKey', '');
                if (!apiKey) {
                    console.warn("No Together.ai API key configured. Using heuristic detection.");
                    throw new Error("NO_API_KEY");
                }

                // Try LLM analysis
                let amenitiesSuggestions = [];
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [{ role: 'user', content: amenitiesPrompt }],
                        max_tokens: 600,
                        temperature: 0.1
                    })
                });                if (response.ok) {
                    const data = await response.json();
                    const llmResponse = data.choices?.[0]?.message?.content?.trim();

                    if (llmResponse) {
                        const jsonMatch = llmResponse.match(/\[[\s\S]*?\]/);
                        if (jsonMatch) {
                            const rawSuggestions = JSON.parse(jsonMatch[0]);
                            console.log("Raw LLM common amenities suggestions:", rawSuggestions);

                            // Validate and filter suggestions to only include exact matches from valid list
                            const validAmenities = Object.values(amenitiesMapping);
                            amenitiesSuggestions = rawSuggestions.filter(suggestion => {
                                const isValid = validAmenities.includes(suggestion);
                                if (!isValid) {
                                    console.warn(`Filtered out invalid amenity suggestion: "${suggestion}" - not in valid list`);
                                }
                                return isValid;
                            });

                            console.log("Validated LLM common amenities suggestions:", amenitiesSuggestions);
                        }
                    }
                }

                // Apply suggestions to checkboxes
                let checkedCount = 0;
                Object.entries(amenitiesMapping).forEach(([checkboxId, amenityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = amenitiesSuggestions.includes(amenityName);
                        if (checkbox.checked) checkedCount++;
                    }
                });

                return {
                    success: true,
                    method: "llm_analysis",
                    checkedCount: checkedCount,
                    checkedAmenities: amenitiesSuggestions
                };

            } catch (error) {
                console.warn("LLM failed, using enhanced heuristic detection with GraphQL data:", error);

                // Enhanced fallback heuristic detection with GraphQL data
                let amenitiesSuggestions = [];
                const allContent = (webpageTitle + ' ' + webpageDescription + ' ' + webpageContent).toLowerCase();

                // Include property amenities data in heuristic analysis
                let amenitiesContent = '';
                if (generalAmenities.length > 0 || amenitiesSummary.length > 0 || roomGeneralAmenities.length > 0) {
                    const generalText = generalAmenities.join(' ');
                    const summaryText = amenitiesSummary.join(' ');
                    const roomGeneralText = roomGeneralAmenities.join(' ');
                    amenitiesContent = (generalText + ' ' + summaryText + ' ' + roomGeneralText).toLowerCase();
                    console.log("Using property amenities data for enhanced common amenities heuristic detection");
                }

                const combinedContent = allContent + ' ' + amenitiesContent;

                // Heuristic matching patterns for common amenities
                const patterns = {
                    "Air Conditioning": /\b(air.?conditioning|air.?conditioner|ac|climate.?control|cooling)\b/,
                    "Clothes Dryer": /\b(dryer|clothes.?dryer|laundry.?dryer|tumble.?dryer|drying.?machine)\b/,
                    "Fan": /\b(fan|ceiling.?fan|portable.?fan|ventilation.?fan|fans)\b/,
                    "Fireplace": /\b(fireplace|wood.?burning.?fireplace|gas.?fireplace|fire.?place)\b/,
                    "Fitness Room / Equipment": /\b(fitness|gym|exercise.?equipment|workout.?room|fitness.?center|exercise.?room)\b/,
                    "Garage": /\b(garage|covered.?parking|enclosed.?parking|private.?garage)\b/,
                    "Hair Dryer": /\b(hair.?dryer|blow.?dryer|hairdryer|hair.?blower)\b/,
                    "Heating": /\b(heating|heater|central.?heating|heat|radiator|warm)\b/,
                    "Iron and Board": /\b(iron|ironing.?board|clothes.?iron|ironing.?facilities|iron.?and.?board)\b/,
                    "Linens Provided": /\b(linens|bed.?linens|bedding|sheets.?provided|linen.?service|fresh.?linens)\b/,
                    "Parking": /\b(parking|free.?parking|on.?site.?parking|parking.?space|car.?park)\b/,
                    "Telephone": /\b(telephone|phone|landline|house.?phone|room.?phone)\b/,
                    "Towels Provided": /\b(towels|bath.?towels|towels.?provided|fresh.?towels|towel.?service)\b/,
                    "Washing Machine": /\b(washing.?machine|washer|laundry.?machine|clothes.?washer|wash.?machine)\b/,
                    "WiFi/Internet": /\b(wifi|wi.?fi|internet|wireless.?internet|broadband|web.?access)\b/,
                    "Wood Stove": /\b(wood.?stove|wood.?burning.?stove|log.?burner|wood.?fire)\b/
                };

                // Apply pattern matching
                Object.entries(patterns).forEach(([amenityName, pattern]) => {
                    if (pattern.test(combinedContent)) {
                        amenitiesSuggestions.push(amenityName);
                    }
                });

                console.log("Heuristic common amenities suggestions:", amenitiesSuggestions);

                // Apply enhanced heuristic suggestions
                let checkedCount = 0;
                Object.entries(amenitiesMapping).forEach(([checkboxId, amenityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = amenitiesSuggestions.includes(amenityName);
                        if (checkbox.checked) checkedCount++;
                    }                });                return {
                    success: true,
                    method: amenitiesContent ? "heuristic_with_amenities" : "heuristic_fallback",
                    checkedCount: checkedCount,
                    checkedAmenities: amenitiesSuggestions
                };
            }
        }

        // Function to automate Additional Amenities checkboxes using enhanced property amenities data
        async function automateAdditionalAmenitiesCheckboxes(hotelName, expediaHotelUrl) {
            console.log("Starting enhanced additional amenities detection using property amenities GraphQL data...");

            // Available additional amenities checkboxes from the form
            const additionalAmenitiesMapping = {
                "Additional_0__Checked": "Books",
                "Additional_1__Checked": "DVD Player",
                "Additional_2__Checked": "Game Room",
                "Additional_3__Checked": "Games",
                "Additional_4__Checked": "Mahjong Room",
                "Additional_5__Checked": "Music Library",
                "Additional_6__Checked": "Ping Pong Table",
                "Additional_7__Checked": "Pool Table",
                "Additional_8__Checked": "Satellite / Cable",
                "Additional_9__Checked": "Stereo",
                "Additional_10__Checked": "Television",
                "Additional_11__Checked": "Toys",
                "Additional_12__Checked": "Video Game",
                "Additional_13__Checked": "Video Library"
            };

            // Get property ID for fetching comprehensive amenities data
            const propertyId = GM_getValue("propertyId", null);

            // Get selectedRoom data for room-specific amenities
            const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
            let selectedRoom = null;
            if (selectedRoomJSON) {
                try {
                    selectedRoom = JSON.parse(selectedRoomJSON);
                } catch (error) {
                    console.warn("Could not parse selectedRoomDetails:", error);
                }            }

            // Fetch comprehensive property amenities data using the specific GraphQL query
            let propertyAmenitiesData = '';
            let amenitiesSummary = [];
            let additionalAmenities = [];

            try {
                if (propertyId) {
                    console.log("Fetching comprehensive property amenities data for enhanced additional amenities analysis...");
                    const amenitiesResponse = await fetchPropertyAmenitiesDataGraphQL(propertyId);

                    // Extract amenities data from the response
                    const propertyInfo = amenitiesResponse?.[0]?.data?.propertyInfo;
                    if (propertyInfo) {
                        // Extract top amenities from summary
                        const topAmenities = propertyInfo?.summary?.amenities?.topAmenities?.infoItems || [];
                        amenitiesSummary = topAmenities.map(item => item.text || '').filter(text => text);

                        // Extract detailed amenities sections, especially "Entertainment" and "Recreation"
                        const amenitiesSections = propertyInfo?.summary?.amenities?.amenities || [];
                        amenitiesSections.forEach(section => {
                            const sectionHeader = section.header?.text?.toLowerCase() || '';
                            if (sectionHeader.includes('entertainment') || sectionHeader.includes('recreation') ||
                                sectionHeader.includes('games') || sectionHeader.includes('media') ||
                                sectionHeader.includes('activities') || sectionHeader.includes('leisure')) {
                                const sectionItems = section.infoItems || [];
                                const sectionAmenities = sectionItems.map(item => item.text || '').filter(text => text);
                                additionalAmenities.push(...sectionAmenities);
                            }
                        });

                        // Extract detailed amenities from property content sections
                        const contentSections = propertyInfo?.propertyContentSectionGroups?.amenities?.sections || [];
                        contentSections.forEach(section => {
                            const subSections = section.bodySubSections || [];
                            subSections.forEach(subSection => {
                                const elements = subSection.elementsV2 || [];
                                elements.forEach(elementGroup => {
                                    const groupElements = elementGroup.elements || [];
                                    groupElements.forEach(element => {
                                        const elementHeader = element.header?.text?.toLowerCase() || '';
                                        if (elementHeader.includes('entertainment') || elementHeader.includes('recreation') ||
                                            elementHeader.includes('games') || elementHeader.includes('media') ||
                                            elementHeader.includes('activities') || elementHeader.includes('leisure')) {
                                            const items = element.items || [];
                                            items.forEach(item => {
                                                if (item.content?.primary?.value) {
                                                    additionalAmenities.push(item.content.primary.value);
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                        });

                        console.log(`Extracted ${amenitiesSummary.length} top amenities, ${additionalAmenities.length} additional amenities`);
                    } else {
                        console.warn("No property info found in amenities response");
                    }
                } else {
                    console.warn("No property ID available for amenities data");
                }
            } catch (error) {
                console.error("Failed to fetch property amenities data:", error);
                propertyAmenitiesData = 'Property amenities data unavailable';
            }

            // Create structured amenities data for LLM analysis
            propertyAmenitiesData = JSON.stringify({
                topAmenities: amenitiesSummary.slice(0, 20),
                additionalAmenities: [...new Set(additionalAmenities)].slice(0, 25), // Remove duplicates
                hotelType: selectedRoom?.name || 'Unknown'
            }, null, 2);

            // Fetch and analyze webpage content using existing pattern
            let webpageContent = '';
            let webpageTitle = '';
            let webpageDescription = '';

            try {
                const expediaHotelUrl = GM_getValue("expediaHotelUrl", null);
                if (expediaHotelUrl) {
                    const webpageHtml = await fetchExpediaData(expediaHotelUrl);

                    const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
                    webpageTitle = titleMatch ? titleMatch[1].trim() : '';

                    const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
                    webpageDescription = descMatch ? descMatch[1].trim() : '';

                    let textContent = webpageHtml
                        .replace(/<script[^>]*>.*?<\/script>/gis, '')
                        .replace(/<style[^>]*>.*?<\/style>/gis, '')
                        .replace(/<[^>]+>/g, ' ')
                        .replace(/\s+/g, ' ')
                        .trim();

                    if (textContent.length > 2000) {
                        const keywordSections = textContent.match(/(?:books|dvd|game|games|mahjong|music|ping.pong|pool.table|satellite|cable|stereo|television|tv|toys|video|entertainment|recreation)[^.!?]*[.!?]/gi);
                        webpageContent = keywordSections && keywordSections.length > 0 ? keywordSections.join(' ').substring(0, 2000) : textContent.substring(0, 2000);
                    } else {
                        webpageContent = textContent;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch Expedia webpage content:", error);
                webpageContent = 'Unable to fetch webpage content';
            }            // Create conservative, data-driven prompt for LLM analysis to prevent hallucination
            const amenitiesPrompt = `You are a conservative data analyst. Analyze the provided hotel data and select ONLY additional amenities that are explicitly mentioned or directly confirmed in the data. DO NOT make assumptions or infer amenities that are not clearly stated.

    Hotel Name: ${hotelName || 'Unknown Hotel'}
    Room Type: ${selectedRoom?.name || 'Unknown Room'}
    Webpage Title: ${webpageTitle}
    Webpage Description: ${webpageDescription}
    Webpage Content: ${webpageContent}

    Property Amenities Data (from GraphQL - structured property data):
    ${propertyAmenitiesData}

    VALID ADDITIONAL AMENITY OPTIONS (you MUST use these EXACT names only):
    1. "Books"
    2. "DVD Player"
    3. "Game Room"
    4. "Games"
    5. "Mahjong Room"
    6. "Music Library"
    7. "Ping Pong Table"
    8. "Pool Table"
    9. "Satellite / Cable"
    10. "Stereo"
    11. "Television"
    12. "Toys"
    13. "Video Game"
    14. "Video Library"

    CRITICAL INSTRUCTIONS:
    - You MUST only return amenities using the EXACT names listed above (case-sensitive)
    - DO NOT return "TV", "Board games", "Gaming console", "Book collection" or any other names
    - DO NOT return generic amenity descriptions or outdoor facility names
    - DO NOT make up amenity names
    - If you find evidence for television, return "Television" (not "TV" or "Smart TV")
    - If you find evidence for gaming, return "Games" or "Video Game" as appropriate

    STRICT VALIDATION RULES:
    1. ONLY select amenities that are explicitly mentioned by name in the provided data
    2. ONLY select amenities that are directly listed in the Property Amenities Data
    3. DO NOT infer or assume amenities based on property type or similar accommodations
    4. DO NOT select amenities that "might be available" without explicit mention
    5. If an amenity is mentioned as being "available" or "provided", it must include specific confirmation
    6. When in doubt, DO NOT include the amenity
    7. NEVER return amenity names that are not in the valid list above

    EVIDENCE REQUIREMENTS:
    - For "Books": Look for explicit mentions of "books", "library", "reading materials", or "book collection"
    - For "DVD Player": Look for explicit mentions of "DVD player", "DVD", "movie player", or "video player"
    - For "Game Room": Look for explicit mentions of "game room", "recreation room", or "playroom"
    - For "Games": Look for explicit mentions of "games", "board games", "card games", or "gaming equipment"
    - For "Mahjong Room": Look for explicit mentions of "mahjong", "mahjong room", or "mah jong"
    - For "Music Library": Look for explicit mentions of "music library", "music collection", or "stereo system"
    - For "Ping Pong Table": Look for explicit mentions of "ping pong", "table tennis", or "ping pong table"
    - For "Pool Table": Look for explicit mentions of "pool table", "billiards", or "snooker"
    - For "Satellite / Cable": Look for explicit mentions of "satellite", "cable TV", "cable", or "sat TV"
    - For "Stereo": Look for explicit mentions of "stereo", "sound system", "audio system", or "hi-fi"
    - For "Television": Look for explicit mentions of "television", "TV", "flat screen", or "smart TV"
    - For "Toys": Look for explicit mentions of "toys", "children toys", "kid toys", or "play items"
    - For "Video Game": Look for explicit mentions of "video games", "gaming console", "PlayStation", "Xbox", or "Nintendo"
    - For "Video Library": Look for explicit mentions of "video library", "movie collection", or "film collection"

    Return ONLY a JSON array containing the EXACT amenity names from the valid list above that meet the strict evidence requirements. If no amenities meet the criteria, return an empty array [].

    VALID example responses (use exact names from list):
    - ["Television", "Games", "Books"] (only if explicitly mentioned)
    - ["DVD Player", "Stereo", "Pool Table"] (only if explicitly mentioned)
    - [] (if no amenities are explicitly confirmed)

    INVALID example responses (DO NOT use these):
    - ["TV", "Board games", "Gaming console", "Book collection"] (not exact names from valid list)
    - ["Entertainment system", "Reading materials", "Children's area"] (not exact names from valid list)

    Be extremely conservative - it's better to miss an amenity than to incorrectly include one that isn't explicitly confirmed in the data.`;

            try {
                // Check if API key is configured
                const apiKey = GM_getValue('togetherApiKey', '');
                if (!apiKey) {
                    console.warn("No Together.ai API key configured. Using heuristic detection.");
                    throw new Error("NO_API_KEY");
                }

                // Try LLM analysis
                let amenitiesSuggestions = [];
                const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                        messages: [{ role: 'user', content: amenitiesPrompt }],
                        max_tokens: 600,
                        temperature: 0.1
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const llmResponse = data.choices?.[0]?.message?.content?.trim();

                    if (llmResponse) {
                        const jsonMatch = llmResponse.match(/\[[\s\S]*?\]/);
                        if (jsonMatch) {
                            const rawSuggestions = JSON.parse(jsonMatch[0]);
                            console.log("LLM raw additional amenities suggestions:", rawSuggestions);

                            // Validate LLM response - only include valid additional amenity names
                            const validAdditionalAmenities = Object.values(additionalAmenitiesMapping);
                            amenitiesSuggestions = rawSuggestions.filter(suggestion => {
                                const isValid = validAdditionalAmenities.includes(suggestion);
                                if (!isValid) {
                                    console.warn(`LLM suggested invalid additional amenity: "${suggestion}" - filtering out`);
                                }
                                return isValid;
                            });

                            console.log("LLM validated additional amenities suggestions:", amenitiesSuggestions);

                            // Log any invalid suggestions for debugging
                            const invalidSuggestions = rawSuggestions.filter(suggestion => !validAdditionalAmenities.includes(suggestion));
                            if (invalidSuggestions.length > 0) {
                                console.warn("Invalid additional amenity suggestions filtered out:", invalidSuggestions);
                            }
                        }
                    }
                }

                // Apply suggestions to checkboxes
                let checkedCount = 0;
                Object.entries(additionalAmenitiesMapping).forEach(([checkboxId, amenityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = amenitiesSuggestions.includes(amenityName);
                        if (checkbox.checked) checkedCount++;
                    }
                });

                return {
                    success: true,
                    method: "llm_analysis",
                    checkedCount: checkedCount,
                    checkedAmenities: amenitiesSuggestions
                };

            } catch (error) {
                console.warn("LLM failed, using enhanced heuristic detection with GraphQL data:", error);

                // Enhanced fallback heuristic detection with GraphQL data
                let amenitiesSuggestions = [];
                const allContent = (webpageTitle + ' ' + webpageDescription + ' ' + webpageContent).toLowerCase();

                // Include property amenities data in heuristic analysis
                let additionalAmenitiesContent = '';
                if (additionalAmenities.length > 0 || amenitiesSummary.length > 0) {
                    const additionalText = additionalAmenities.join(' ');
                    const summaryText = amenitiesSummary.join(' ');
                    additionalAmenitiesContent = (additionalText + ' ' + summaryText).toLowerCase();
                    console.log("Using property amenities data for enhanced additional amenities heuristic detection");
                }

                const combinedContent = allContent + ' ' + additionalAmenitiesContent;

                // Heuristic matching patterns for additional amenities
                const patterns = {
                    "Books": /\b(books?|library|reading.?materials?|novels?|magazines?|newspapers?)\b/,
                    "DVD Player": /\b(dvd.?player|dvd|movie.?player|video.?player|disc.?player|media.?player|blu.?ray)\b/,
                    "Game Room": /\b(game.?room|games?.?room|play.?room|playroom|recreation.?room|entertainment.?room)\b/,
                    "Games": /\b(games?|board.?games?|card.?games?|table.?games?|gaming|chess|checkers|monopoly|scrabble|puzzles?)\b/,
                    "Mahjong Room": /\b(mahjong|mah.?jong|mahjong.?room)\b/,
                    "Music Library": /\b(music.?library|music.?collection|cd.?collection|music.?system|vinyl.?collection)\b/,
                    "Ping Pong Table": /\b(ping.?pong|table.?tennis|ping.?pong.?table|tt.?table)\b/,
                    "Pool Table": /\b(pool.?table|billiards?|snooker|8.?ball|cue.?sports?)\b/,
                    "Satellite / Cable": /\b(satellite|cable.?tv|cable|sat.?tv|digital.?tv|premium.?channels?)\b/,
                    "Stereo": /\b(stereo|sound.?system|audio.?system|music.?system|hi.?fi|speakers?)\b/,
                    "Television": /\b(television|tv|flat.?screen|lcd.?tv|led.?tv|smart.?tv|hdtv)\b/,
                    "Toys": /\b(toys?|children.?toys?|kids?.?toys?|play.?things?|stuffed.?animals?|lego|dolls?)\b/,
                    "Video Game": /\b(video.?games?|gaming.?console|playstation|xbox|nintendo|wii|switch|game.?controller)\b/,
                    "Video Library": /\b(video.?library|movie.?library|movie.?collection|film.?collection|dvd.?collection)\b/
                };

                Object.entries(patterns).forEach(([amenityName, pattern]) => {
                    if (pattern.test(combinedContent)) {
                        amenitiesSuggestions.push(amenityName);
                    }
                });

                // Apply enhanced heuristic suggestions
                let checkedCount = 0;
                Object.entries(additionalAmenitiesMapping).forEach(([checkboxId, amenityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        checkbox.checked = amenitiesSuggestions.includes(amenityName);
                        if (checkbox.checked) checkedCount++;
                    }
                });            return {
                success: true,
                method: additionalAmenitiesContent ? "heuristic_with_amenities" : "heuristic_fallback",
                checkedCount: checkedCount,
                checkedAmenities: amenitiesSuggestions
            };
        }
    }

    // Test function to verify Additional Amenities automation
    window.testAdditionalAmenitiesAutomation = async function() {
        console.log("🧪 Testing Additional Amenities automation...");

        try {
            // Test data
            const testHotelName = "Test Hotel Tokyo";
            const testExpediaUrl = "https://www.expediataap.com/Test-Hotels.h12345.Hotel-Information";

            // Call the automation function
            const result = await automateAdditionalAmenitiesCheckboxes(testHotelName, testExpediaUrl);

            console.log("Additional Amenities automation test result:", result);

            // Validate result structure
            const isValid = result &&
                           typeof result.success === 'boolean' &&
                           typeof result.method === 'string' &&
                           typeof result.checkedCount === 'number' &&
                           Array.isArray(result.checkedAmenities);

            if (isValid) {
                console.log("✅ Test passed - Result structure is valid");
                console.log(`Method used: ${result.method}`);
                console.log(`Checked count: ${result.checkedCount}`);
                console.log(`Checked amenities: ${result.checkedAmenities.join(', ')}`);

                // Test checkbox mapping
                const additionalAmenitiesMapping = {
                    "Additional_0__Checked": "Books",
                    "Additional_1__Checked": "DVD Player",
                    "Additional_2__Checked": "Game Room",
                    "Additional_3__Checked": "Games",
                    "Additional_4__Checked": "Mahjong Room",
                    "Additional_5__Checked": "Music Library",
                    "Additional_6__Checked": "Ping Pong Table",
                    "Additional_7__Checked": "Pool Table",
                    "Additional_8__Checked": "Satellite / Cable",
                    "Additional_9__Checked": "Stereo",
                    "Additional_10__Checked": "Television",
                    "Additional_11__Checked": "Toys",
                    "Additional_12__Checked": "Video Game",
                    "Additional_13__Checked": "Video Library"
                };

                // Check if any checkboxes were found and set
                let foundCheckboxes = 0;
                Object.entries(additionalAmenitiesMapping).forEach(([checkboxId, amenityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        foundCheckboxes++;
                        console.log(`${checkboxId} (${amenityName}): ${checkbox.checked ? 'CHECKED' : 'UNCHECKED'}`);
                    }
                });

                console.log(`Found ${foundCheckboxes} additional amenity checkboxes on the page`);

                return {
                    success: true,
                    testResult: result,
                    checkboxesFound: foundCheckboxes,
                    message: "Additional Amenities automation test completed successfully"
                };
            } else {
                console.error("❌ Test failed - Invalid result structure");
                return { success: false, error: "Invalid result structure" };
            }
              } catch (error) {
            console.error("❌ Test failed with error:", error);
            return { success: false, error: error.message };
        }
    };

    // Function to automate Pool and Spa Facilities checkboxes using enhanced property amenities data
    async function automatePoolSpaFacilitiesCheckboxes(hotelName, expediaHotelUrl) {
        console.log("Starting enhanced pool and spa facilities detection using property amenities GraphQL data...");

        // Available pool and spa facilities checkboxes from the form
        const poolSpaMapping = {
            "Pool_0__Checked": "Communal Pool",      // PropertyAttributeID: 64
            "Pool_1__Checked": "Heated Pool",       // PropertyAttributeID: 63
            "Pool_2__Checked": "Hot Tub",           // PropertyAttributeID: 67
            "Pool_3__Checked": "Indoor Pool",       // PropertyAttributeID: 66
            "Pool_4__Checked": "Jacuzzi",           // PropertyAttributeID: 188
            "Pool_5__Checked": "Private Pool",      // PropertyAttributeID: 62
            "Pool_6__Checked": "Sauna"              // PropertyAttributeID: 65
        };

        // Get property ID for fetching comprehensive amenities data
        const propertyId = GM_getValue("propertyId", null);

        // Get selectedRoom data for room-specific amenities
        const selectedRoomJSON = GM_getValue("selectedRoomDetails", null);
        let selectedRoom = null;
        if (selectedRoomJSON) {
            try {
                selectedRoom = JSON.parse(selectedRoomJSON);
            } catch (error) {
                console.warn("Could not parse selectedRoomDetails:", error);
            }
        }

        // Fetch comprehensive property amenities data using the specific GraphQL query
        let propertyAmenitiesData = '';
        let amenitiesSummary = [];
        let poolSpaAmenities = [];

        try {
            if (propertyId) {
                console.log("Fetching comprehensive property amenities data for enhanced pool/spa analysis...");
                const amenitiesResponse = await fetchPropertyAmenitiesDataGraphQL(propertyId);

                // Extract amenities data from the response
                const propertyInfo = amenitiesResponse?.[0]?.data?.propertyInfo;
                if (propertyInfo) {
                    // Extract top amenities from summary
                    const topAmenities = propertyInfo?.summary?.amenities?.topAmenities?.infoItems || [];
                    amenitiesSummary = topAmenities.map(item => item.text || '').filter(text => text);

                    // Extract detailed amenities sections, especially "Pool", "Spa", "Recreation"
                    const amenitiesSections = propertyInfo?.summary?.amenities?.amenities || [];
                    amenitiesSections.forEach(section => {
                        const sectionHeader = section.header?.text?.toLowerCase() || '';
                        if (sectionHeader.includes('pool') || sectionHeader.includes('spa') ||
                            sectionHeader.includes('recreation') || sectionHeader.includes('wellness') ||
                            sectionHeader.includes('hot tub') || sectionHeader.includes('jacuzzi') ||
                            sectionHeader.includes('sauna')) {
                            const sectionItems = section.infoItems || [];
                            const sectionAmenities = sectionItems.map(item => item.text || '').filter(text => text);
                            poolSpaAmenities.push(...sectionAmenities);
                        }
                    });

                    // Extract detailed amenities from property content sections
                    const contentSections = propertyInfo?.propertyContentSectionGroups?.amenities?.sections || [];
                    contentSections.forEach(section => {
                        const subSections = section.bodySubSections || [];
                        subSections.forEach(subSection => {
                            const elements = subSection.elementsV2 || [];
                            elements.forEach(elementGroup => {
                                const groupElements = elementGroup.elements || [];
                                groupElements.forEach(element => {
                                    const elementHeader = element.header?.text?.toLowerCase() || '';
                                    if (elementHeader.includes('pool') || elementHeader.includes('spa') ||
                                        elementHeader.includes('recreation') || elementHeader.includes('wellness') ||
                                        elementHeader.includes('hot tub') || elementHeader.includes('jacuzzi') ||
                                        elementHeader.includes('sauna') || elementHeader.includes('outdoor')) {
                                        const items = element.items || [];
                                        items.forEach(item => {
                                            if (item.content?.primary?.value) {
                                                poolSpaAmenities.push(item.content.primary.value);
                                            }
                                        });
                                    }
                                });
                            });
                        });
                    });

                    console.log(`Extracted ${amenitiesSummary.length} top amenities, ${poolSpaAmenities.length} pool/spa amenities`);
                } else {
                    console.warn("No property info found in amenities response");
                }
            } else {
                console.warn("No property ID available for amenities data");
            }
        } catch (error) {
            console.error("Failed to fetch property amenities data:", error);
            propertyAmenitiesData = 'Property amenities data unavailable';
        }

        // Create structured amenities data for LLM analysis
        propertyAmenitiesData = JSON.stringify({
            topAmenities: amenitiesSummary.slice(0, 20),
            poolSpaAmenities: [...new Set(poolSpaAmenities)].slice(0, 25), // Remove duplicates
            hotelType: selectedRoom?.name || hotelName || 'Unknown'
        }, null, 2);

        // Fetch and analyze webpage content using existing pattern
        let webpageContent = '';
        let webpageTitle = '';
        let webpageDescription = '';

        try {
            const webpageHtml = await fetchExpediaData(expediaHotelUrl);

            const titleMatch = webpageHtml.match(/<title[^>]*>(.*?)<\/title>/i);
            webpageTitle = titleMatch ? titleMatch[1].trim() : '';

            const descMatch = webpageHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*?)["'][^>]*>/i);
            webpageDescription = descMatch ? descMatch[1].trim() : '';

            let textContent = webpageHtml
                .replace(/<script[^>]*>.*?<\/script>/gis, '')
                .replace(/<style[^>]*>.*?<\/style>/gis, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            if (textContent.length > 2000) {
                // Focus on pool/spa relevant sections
                const poolSpaKeywords = ['pool', 'spa', 'hot tub', 'jacuzzi', 'sauna', 'heated', 'indoor', 'outdoor', 'wellness', 'recreation'];
                const relevantSections = [];
                const sentences = textContent.split(/[.!?]+/);

                sentences.forEach(sentence => {
                    const sentenceLower = sentence.toLowerCase();
                    if (poolSpaKeywords.some(keyword => sentenceLower.includes(keyword))) {
                        relevantSections.push(sentence.trim());
                    }
                });

                webpageContent = relevantSections.slice(0, 10).join('. ');
            } else {
                webpageContent = textContent;
            }

            console.log("Pool/Spa webpage content analysis completed");
        } catch (error) {
            console.error("Error fetching webpage content:", error);
            webpageContent = 'Unable to fetch webpage content';
        }

        // Create LLM prompt for pool/spa facilities analysis
        const poolSpaPrompt = `You are a conservative data analyst. Analyze the provided hotel data and select ONLY pool and spa facilities that are explicitly mentioned or directly confirmed in the data. DO NOT make assumptions or infer facilities that are not clearly stated.

Hotel Name: ${hotelName || 'Unknown Hotel'}
Room Type: ${selectedRoom?.name || 'Unknown Room'}
Webpage Title: ${webpageTitle}
Webpage Description: ${webpageDescription}
Webpage Content: ${webpageContent}

Property Amenities Data (from GraphQL - structured property data):
${propertyAmenitiesData}

VALID POOL/SPA FACILITY OPTIONS (you MUST use these EXACT names only):
1. "Communal Pool"
2. "Heated Pool"
3. "Hot Tub"
4. "Indoor Pool"
5. "Jacuzzi"
6. "Private Pool"
7. "Sauna"

CRITICAL INSTRUCTIONS:
- You MUST only return facilities using the EXACT names listed above (case-sensitive)
- DO NOT return "Swimming Pool", "Outdoor Pool", "Spa", "Fitness Center" or any other names
- DO NOT return generic facility descriptions
- DO NOT make up facility names
- If you find evidence for a pool, determine if it's "Communal Pool", "Heated Pool", "Indoor Pool", or "Private Pool"

STRICT VALIDATION RULES:
1. ONLY select facilities that are explicitly mentioned by name in the provided data
2. ONLY select facilities that are directly listed in the Property Amenities Data
3. DO NOT infer or assume facilities based on property type or similar accommodations
4. DO NOT select facilities that "might be available" without explicit mention
5. If a facility is mentioned as being "available" or "provided", it must include specific confirmation
6. When in doubt, DO NOT include the facility
7. NEVER return facility names that are not in the valid list above

EVIDENCE REQUIREMENTS:
- For "Communal Pool": Look for explicit mentions of "pool", "swimming pool", "shared pool", or "common pool"
- For "Heated Pool": Look for explicit mentions of "heated pool", "warm pool", or "heated swimming pool"
- For "Hot Tub": Look for explicit mentions of "hot tub", "spa tub", or "whirlpool"
- For "Indoor Pool": Look for explicit mentions of "indoor pool", "covered pool", or "interior pool"
- For "Jacuzzi": Look for explicit mentions of "jacuzzi", "hot jacuzzi", or "jacuzzi tub"
- For "Private Pool": Look for explicit mentions of "private pool", "pool access", or "exclusive pool"
- For "Sauna": Look for explicit mentions of "sauna", "steam room", or "dry sauna"

Return ONLY a JSON array containing the EXACT facility names from the valid list above that meet the strict evidence requirements. If no facilities meet the criteria, return an empty array [].

VALID example responses (use exact names from list):
- ["Communal Pool", "Hot Tub", "Sauna"] (only if explicitly mentioned)
- ["Heated Pool", "Jacuzzi"] (only if explicitly mentioned)
- [] (if no facilities are explicitly confirmed)

INVALID example responses (DO NOT use these):
- ["Swimming Pool", "Outdoor Pool", "Spa"] (not exact names from valid list)
- ["Pool", "Fitness Center", "Wellness Center"] (not exact names from valid list)

Be extremely conservative - it's better to miss a facility than to incorrectly include one that isn't explicitly confirmed in the data.`;

        try {
            // Check if API key is configured
            const apiKey = GM_getValue('togetherApiKey', '');
            if (!apiKey) {
                console.warn("No Together.ai API key configured. Using heuristic detection.");
                throw new Error("NO_API_KEY");
            }

            // Try LLM analysis
            let poolSpaSuggestions = [];
            const response = await fetch('https://api.together.xyz/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                    messages: [{ role: 'user', content: poolSpaPrompt }],
                    max_tokens: 600,
                    temperature: 0.1
                })
            });

            if (response.ok) {
                const data = await response.json();
                const llmResponse = data.choices?.[0]?.message?.content?.trim();

                if (llmResponse) {
                    const jsonMatch = llmResponse.match(/\[[\s\S]*?\]/);
                    if (jsonMatch) {
                        const rawSuggestions = JSON.parse(jsonMatch[0]);
                        console.log("LLM raw pool/spa suggestions:", rawSuggestions);

                        // Validate LLM response - only include valid pool/spa facility names
                        const validPoolSpaFacilities = Object.values(poolSpaMapping);
                        poolSpaSuggestions = rawSuggestions.filter(suggestion => {
                            const isValid = validPoolSpaFacilities.includes(suggestion);
                            if (!isValid) {
                                console.warn(`LLM suggested invalid pool/spa facility: "${suggestion}" - filtering out`);
                            }
                            return isValid;
                        });

                        console.log("LLM validated pool/spa suggestions:", poolSpaSuggestions);

                        // Log any invalid suggestions for debugging
                        const invalidSuggestions = rawSuggestions.filter(suggestion => !validPoolSpaFacilities.includes(suggestion));
                        if (invalidSuggestions.length > 0) {
                            console.warn("Invalid pool/spa suggestions filtered out:", invalidSuggestions);
                        }
                    }
                }
            }

            // Apply suggestions to checkboxes
            let checkedCount = 0;
            Object.entries(poolSpaMapping).forEach(([checkboxId, facilityName]) => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    checkbox.checked = poolSpaSuggestions.includes(facilityName);
                    if (checkbox.checked) checkedCount++;
                }
            });

            return {
                success: true,
                method: "llm_analysis",
                checkedCount: checkedCount,
                checkedFacilities: poolSpaSuggestions
            };

        } catch (error) {
            console.warn("LLM failed, using enhanced heuristic detection with GraphQL data:", error);

            // Enhanced fallback heuristic detection with GraphQL data
            let poolSpaSuggestions = [];
            const allContent = (webpageTitle + ' ' + webpageDescription + ' ' + webpageContent).toLowerCase();

            // Include property amenities data in heuristic analysis
            let poolSpaContent = '';
            if (poolSpaAmenities.length > 0 || amenitiesSummary.length > 0) {
                const poolSpaText = poolSpaAmenities.join(' ');
                const summaryText = amenitiesSummary.join(' ');
                poolSpaContent = (poolSpaText + ' ' + summaryText).toLowerCase();
                console.log("Using property amenities data for enhanced pool/spa heuristic detection");
            }

            const combinedContent = allContent + ' ' + poolSpaContent;

            // Heuristic matching patterns for pool/spa facilities
            const patterns = {
                "Communal Pool": /\b(pool|swimming.?pool|shared.?pool|common.?pool|communal.?pool)\b/,
                "Heated Pool": /\b(heated.?pool|warm.?pool|heated.?swimming.?pool)\b/,
                "Hot Tub": /\b(hot.?tub|spa.?tub|whirlpool)\b/,
                "Indoor Pool": /\b(indoor.?pool|covered.?pool|interior.?pool|inside.?pool)\b/,
                "Jacuzzi": /\b(jacuzzi|hot.?jacuzzi|jacuzzi.?tub)\b/,
                "Private Pool": /\b(private.?pool|pool.?access|exclusive.?pool|own.?pool)\b/,
                "Sauna": /\b(sauna|steam.?room|dry.?sauna|finnish.?sauna)\b/
            };

            Object.entries(patterns).forEach(([facilityName, pattern]) => {
                if (pattern.test(combinedContent)) {
                    poolSpaSuggestions.push(facilityName);
                }
            });

            console.log("Heuristic pool/spa suggestions:", poolSpaSuggestions);

            // Apply enhanced heuristic suggestions
            let checkedCount = 0;
            Object.entries(poolSpaMapping).forEach(([checkboxId, facilityName]) => {
                const checkbox = document.querySelector(`#${checkboxId}`);
                if (checkbox) {
                    checkbox.checked = poolSpaSuggestions.includes(facilityName);
                    if (checkbox.checked) checkedCount++;
                }
            });

            return {
                success: true,
                method: poolSpaContent ? "heuristic_with_content" : "heuristic_fallback",
                checkedCount: checkedCount,
                checkedFacilities: poolSpaSuggestions
            };
        }
    }

    // Test function to verify Pool and Spa Facilities automation
    window.testPoolSpaFacilitiesAutomation = async function() {
        console.log("🧪 Testing Pool and Spa Facilities automation...");

        try {
            // Test data
            const testHotelName = "Test Resort Bali";
            const testExpediaUrl = "https://www.expediataap.com/Test-Resort.h12345.Hotel-Information";

            // Call the automation function
            const result = await automatePoolSpaFacilitiesCheckboxes(testHotelName, testExpediaUrl);

            console.log("Pool and Spa Facilities automation test result:", result);

            // Validate result structure
            const isValid = result &&
                           typeof result.success === 'boolean' &&
                           typeof result.method === 'string' &&
                           typeof result.checkedCount === 'number' &&
                           Array.isArray(result.checkedFacilities);

            if (isValid) {
                console.log("✅ Test passed - Result structure is valid");
                console.log(`Method used: ${result.method}`);
                console.log(`Checked count: ${result.checkedCount}`);
                console.log(`Checked facilities: ${result.checkedFacilities.join(', ')}`);

                // Test checkbox mapping
                const poolSpaMapping = {
                    "Pool_0__Checked": "Communal Pool",
                    "Pool_1__Checked": "Heated Pool",
                    "Pool_2__Checked": "Hot Tub",
                    "Pool_3__Checked": "Indoor Pool",
                    "Pool_4__Checked": "Jacuzzi",
                    "Pool_5__Checked": "Private Pool",
                    "Pool_6__Checked": "Sauna"
                };

                // Check if any checkboxes were found and set
                let foundCheckboxes = 0;
                Object.entries(poolSpaMapping).forEach(([checkboxId, facilityName]) => {
                    const checkbox = document.querySelector(`#${checkboxId}`);
                    if (checkbox) {
                        foundCheckboxes++;
                        console.log(`${checkboxId} (${facilityName}): ${checkbox.checked ? 'CHECKED' : 'UNCHECKED'}`);
                    }
                });

                console.log(`Found ${foundCheckboxes} pool/spa facility checkboxes on the page`);

                return {
                    success: true,
                    testResult: result,
                    checkboxesFound: foundCheckboxes,
                    message: "Pool and Spa Facilities automation test completed successfully"
                };
            } else {
                console.error("❌ Test failed - Invalid result structure");
                return { success: false, error: "Invalid result structure" };
            }

        } catch (error) {
            console.error("❌ Test failed with error:", error);
            return { success: false, error: error.message };
        }
    };

    // Test function to verify enhanced amenities extraction (for debugging)
    window.testBathroomAmenitiesExtraction = function() {
        console.log("🧪 Testing bathroom amenities extraction...");

        // Test with sample description text
        const sampleDescription = "<p><b>Bathroom</b> - Private bathroom, bathrobes, and a bathtub or shower with a rainfall showerhead</p>";
        const descriptionAmenities = extractAmenitiesFromDescription(sampleDescription);
        console.log("Description extraction result:", descriptionAmenities);

        // Test with sample room data to simulate the full parsing
        const sampleRoom = {
            id: "test-room",
            name: "Test Room",
            roomAmenities: { bathroom: ["Private bathroom", "Bathrobes", "Rainfall showerhead"] }
        };

        // Store test amenities
        storeDetectedAmenities([sampleRoom]);

        // Test the bathroom automation extraction
        const bathroomConfig = extractBathroomConfigurationFromRoomAmenities();
        console.log("Bathroom automation result:", bathroomConfig);

        return {
            descriptionExtraction: descriptionAmenities,
            bathroomConfig: bathroomConfig
        };
    };

    // Test function to verify roomAmenities extraction from bodySubSections structure
    window.testRoomAmenitiesExtraction = function() {
        console.log("🧪 Testing roomAmenities extraction from bodySubSections structure...");

        // Sample data matching the structure from raw_response.json
        const sampleRoomAmenities = {
            header: {
                text: "Room amenities",
                __typename: "LodgingHeader"
            },
            bodySubSections: [
                {
                    elementsV2: [
                        {
                            elements: [
                                {
                                    header: {
                                        text: "Bathroom",
                                        icon: {
                                            id: "bathroom",
                                            __typename: "Icon"
                                        },
                                        __typename: "LodgingHeader"
                                    },
                                    items: [
                                        {
                                            content: {
                                                text: "<ul><li>Bidet</li><li>Designer toiletries</li><li>Hair dryer</li><li>Private bathroom</li><li>Shower/tub combination</li><li>Slippers</li><li>Towels</li></ul>",
                                                __typename: "MarkupText"
                                            },
                                            __typename: "PropertyContentItemMarkup"
                                        }
                                    ],
                                    __typename: "PropertyContent"
                                },
                                {
                                    header: {
                                        text: "Bedroom",
                                        icon: {
                                            id: "bed",
                                            __typename: "Icon"
                                        },
                                        __typename: "LodgingHeader"
                                    },
                                    items: [
                                        {
                                            content: {
                                                text: "<ul><li>Bed sheets</li><li>Climate-controlled air conditioning</li><li>Down duvet</li><li>Premium bedding</li></ul>",
                                                __typename: "MarkupText"
                                            },
                                            __typename: "PropertyContentItemMarkup"
                                        }
                                    ],
                                    __typename: "PropertyContent"
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        // Test the extraction function
        const extractedAmenities = extractAmenitiesFromRoomAmenitiesStructure(sampleRoomAmenities);

        console.log("✓ Extracted amenities:", extractedAmenities);

        // Test the storage mechanism
        const testRooms = [
            {
                id: "test-room-1",
                name: "Test Room",
                roomAmenities: extractedAmenities
            }
        ];

        // Test storage
        storeDetectedAmenities(testRooms);

        // Verify storage
        const storedData = GM_getValue("step2DetectedAmenities", null);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log("✓ Stored amenities data:", parsedData);
        }

        // Test bathroom configuration extraction
        const bathroomConfig = extractBathroomConfigurationFromRoomAmenities();
        console.log("✓ Bathroom configuration from new structure:", bathroomConfig);

        return {
            extractedAmenities,
            bathroomConfig,
            success: extractedAmenities && extractedAmenities.bathroom && extractedAmenities.bathroom.length > 0
        };
    };

    // Test enhanced parsing with real GraphQL response data
    window.testWithRealData = async function() {
        console.log("🧪 Testing enhanced parsing with real GraphQL response data...");

        try {
            // Load the actual response files for testing
            const rawResponsePath = "jsons/raw_response.json";
            const locationResponsePath = "jsons/location_response.json";

            // This would normally be loaded from the actual responses
            // For now, let's simulate what the enhanced parser would extract

            // Simulate room description extraction
            const sampleDescriptions = [
                "<p><b>Bathroom</b> - Private bathroom, bathrobes, and a bathtub or shower with a rainfall showerhead</p>",
                "<p><b>Bathroom</b> - Private bathroom, deep soaking bathtub, and rainfall showerhead</p>",
                "<p><b>Bathroom</b> - Private bathroom, bathrobes, and a shower with a rainfall showerhead</p>"
            ];

            console.log("Testing description extraction:");
            sampleDescriptions.forEach((desc, i) => {
                const extracted = extractAmenitiesFromDescription(desc);
                console.log(`Room ${i + 1} extracted amenities:`, extracted);
            });

            // Simulate property info extraction with structured data
            const samplePropertyInfo = [
                {
                    data: {
                        propertyInfo: {
                            propertyContentSectionGroups: {
                                propertyContentSections: [
                                    {
                                        subSections: [
                                            {
                                                elementsV2: [
                                                    {
                                                        elements: [
                                                            {
                                                                header: { text: "Bathroom" },
                                                                items: [
                                                                    { content: { primary: { value: "Bathrobes" } } },
                                                                    { content: { primary: { value: "Designer toiletries" } } },
                                                                    { content: { primary: { value: "Hair dryer" } } },
                                                                    { content: { primary: { value: "Private bathroom" } } },
                                                                    { content: { primary: { value: "Rainfall showerhead" } } },
                                                                    { content: { primary: { value: "Shampoo" } } },
                                                                    { content: { primary: { value: "Slippers" } } }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                }
            ];

            console.log("Testing property info extraction:");
            const propertyAmenities = extractAmenitiesFromPropertyInfo(samplePropertyInfo);
            console.log("Property info extracted amenities:", propertyAmenities);

            // Test full workflow simulation
            const simulatedRooms = [
                {
                    id: "room1",
                    name: "Twin Room",
                    roomAmenities: extractAmenitiesFromDescription(sampleDescriptions[0])
                },
                {
                    id: "room2",
                    name: "King Room",
                    roomAmenities: propertyAmenities
                }
            ];

            console.log("Simulated rooms with extracted amenities:", simulatedRooms);

            // Store and test bathroom automation
            storeDetectedAmenities(simulatedRooms);
            const bathroomConfig = extractBathroomConfigurationFromRoomAmenities();

            console.log("✅ Final bathroom automation result:", bathroomConfig);

            return {
                simulatedRooms,
                bathroomConfig,
                success: bathroomConfig.success
            };

        } catch (error) {
            console.error("Test failed:", error);
            return { success: false, error: error.message };
        }
    };    // Add auto-fill button to bathroom modal
    function addAutoFillButtonToBathroomModal(retryCount = 0) {
        // Prevent concurrent executions
        if (addAutoFillButtonToBathroomModal.isRunning) {
            console.log("addAutoFillButtonToBathroomModal already running, skipping...");
            return;
        }

        addAutoFillButtonToBathroomModal.isRunning = true;

        console.log(`Adding Auto Fill button to bathroom modal... (attempt ${retryCount + 1})`);

        try {
            // Check if bathroom modal is visible
            const bathroomModalElement = document.querySelector('#BathroomModal');
            const isBathroomModalVisible = bathroomModalElement &&
                                        bathroomModalElement.style.display !== 'none' &&
                                        bathroomModalElement.offsetParent !== null;

            // Check for critical bathroom form fields
            const criticalFields = ['#BathroomTypeID'];
            const missingFields = criticalFields.filter(selector => !document.querySelector(selector));

            if (missingFields.length > 0) {
                if (isBathroomModalVisible) {
                    console.warn(`BathroomModal is visible but critical fields missing: ${missingFields.join(', ')} - waiting for form to load...`);
                } else {
                    console.warn(`Modal not ready yet - critical fields missing: ${missingFields.join(', ')}`);
                }

                if (retryCount < 5) {
                    const baseDelay = isBathroomModalVisible ? 800 : 500;
                    const delay = (retryCount + 1) * baseDelay;
                    console.log(`Retrying in ${delay}ms... (retry ${retryCount + 1}/5) ${isBathroomModalVisible ? '[BathroomModal detected]' : ''}`);
                    setTimeout(() => {
                        addAutoFillButtonToBathroomModal.isRunning = false;
                        addAutoFillButtonToBathroomModal(retryCount + 1);
                    }, delay);
                    return;
                } else {
                    const modalType = isBathroomModalVisible ? "BathroomModal element detected but" : "Modal";
                    console.error(`Failed to add Auto Fill button after 5 attempts - ${modalType} fields not loading`);
                    addAutoFillButtonToBathroomModal.isRunning = false;
                    return;
                }
            }
              // Check if button already exists
            const existingButton = document.querySelector('#btn-auto-fill-bathroom');
            if (existingButton) {
                console.log("Auto Fill button already exists in bathroom modal - removing and recreating to ensure proper visibility");
                existingButton.remove();
            }

            // Find modal footer using same logic as bedroom modal
            let modalFooter = null;
              // Method 1: Look within BathroomModal element
            if (isBathroomModalVisible) {
                modalFooter = bathroomModalElement.querySelector('.modal-footer, .footer, [class*="footer"]');
                if (modalFooter) {
                    console.log("Found modal footer within BathroomModal element");
                }
            }

            // Method 2: Look for .modal-footer specifically within visible bathroom-related modals
            if (!modalFooter) {
                const allModalFooters = document.querySelectorAll('.modal-footer');
                for (const footer of allModalFooters) {
                    // Check if this footer is within a bathroom modal or contains bathroom-related elements
                    const parentModal = footer.closest('.modal, [id*="Modal"]');
                    if (parentModal) {
                        // Check if parent modal is the bathroom modal specifically
                        if (parentModal.id === 'BathroomModal' ||
                            parentModal.querySelector('#BathroomTypeID') ||
                            footer.querySelector('button[onclick*="Bathroom"]') ||
                            footer.textContent.includes('Add Bathroom')) {
                            modalFooter = footer;
                            console.log("Found bathroom modal footer in document");
                            break;
                        }
                    }
                }
            }

            // Method 3: Look for "Add Bathroom" button and find its parent
            if (!modalFooter) {
                const addBathroomBtn = Array.from(document.querySelectorAll('button')).find(btn =>
                    btn.textContent.includes('Add Bathroom'));
                if (addBathroomBtn) {
                    modalFooter = addBathroomBtn.parentElement;
                    console.log("Found modal container via Add Bathroom button parent");
                }
            }
              // Method 4: Fallback to form container specifically for bathroom
            if (!modalFooter) {
                console.warn("Could not find standard modal footer, attempting to find suitable bathroom form container...");
                let formContainers = [];

                // First, prioritize searching within the BathroomModal if it exists
                if (isBathroomModalVisible) {
                    formContainers = bathroomModalElement.querySelectorAll('form, .form, [class*="form"]');
                    console.log(`Found ${formContainers.length} form containers within BathroomModal`);
                }

                // If no containers found in BathroomModal, search in document but filter for bathroom-related ones
                if (formContainers.length === 0) {
                    const allFormContainers = document.querySelectorAll('form, .form, [class*="form"]');
                    formContainers = Array.from(allFormContainers).filter(container => {
                        // Only include forms that contain bathroom-specific fields
                        return container.querySelector('#BathroomTypeID') !== null;
                    });
                    console.log(`Found ${formContainers.length} bathroom-related form containers in document`);
                }

                for (const container of formContainers) {
                    if (container.querySelector('#BathroomTypeID')) {
                        modalFooter = container;
                        console.log("Found bathroom form container for Auto Fill button placement");
                        break;
                    }
                }
            }

            if (!modalFooter) {
                console.warn("Could not find suitable location to add Auto Fill button - modal structure may be non-standard");
                return;
            }
              // Create the Auto Fill button
            const autoFillButton = document.createElement('button');
            autoFillButton.id = 'btn-auto-fill-bathroom';
            autoFillButton.type = 'button';
            autoFillButton.className = 'btn btn-info';
            autoFillButton.innerHTML = '🚿 Auto Fill';
            autoFillButton.style.cssText = `
                margin-right: 10px;
                margin-bottom: 10px;
                background-color: #17a2b8;
                color: white;
                border: 1px solid #17a2b8;
                padding: 6px 12px;
                font-size: 14px;
                border-radius: 4px;
                cursor: pointer;
                display: inline-block;
                visibility: visible;
                position: relative;
                z-index: 1000;
            `;

            // Add click event listener
            autoFillButton.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.log("Bathroom Auto Fill button clicked - populating bathroom form...");

                try {
                    // Get stored bathroom configuration
                    const storedConfigJSON = GM_getValue("detectedBathroomConfig", null);
                    let detectedConfig = null;

                    if (storedConfigJSON) {
                        try {
                            detectedConfig = JSON.parse(storedConfigJSON);
                            console.log("Using stored bathroom configuration:", detectedConfig);
                        } catch (error) {
                            console.warn("Could not parse stored bathroom configuration:", error);
                        }
                    }

                    // If no detected config, create a default one
                    if (!detectedConfig) {
                        detectedConfig = {
                            success: true,
                            bathrooms: [{ type: "Private Bathroom", features: ["Shower", "Toilet"] }],
                            totalBathrooms: 1,
                            confidence: "default",
                            reasoning: "Using default private bathroom configuration"
                        };
                        console.log("Using default bathroom configuration");
                    }

                    // Populate the form fields
                    await populateBathroomFormFields(detectedConfig);                } catch (error) {
                    console.error("Error in Bathroom Auto Fill:", error);
                    await showAlertModal("Bathroom Auto Fill Error", `Error in Bathroom Auto Fill: ${error.message}`);
                }
            });
              // Insert the button into the modal footer
            try {
                // Log modal footer details for debugging
                console.log("Modal footer element found:", modalFooter);
                console.log("Modal footer tag:", modalFooter.tagName);
                console.log("Modal footer class:", modalFooter.className);
                console.log("Modal footer children count:", modalFooter.children.length);

                // Try different insertion methods
                if (modalFooter.children.length > 0) {
                    modalFooter.insertBefore(autoFillButton, modalFooter.firstChild);
                    console.log("Inserted button as first child");
                } else {
                    modalFooter.appendChild(autoFillButton);
                    console.log("Appended button to modal footer");
                }

                // Verify button was inserted
                const verifyButton = document.querySelector('#btn-auto-fill-bathroom');
                if (verifyButton) {
                    console.log("✓ Button verification successful - button is in DOM");
                    console.log("Button position:", verifyButton.getBoundingClientRect());
                    console.log("Button visible:", verifyButton.offsetParent !== null);
                } else {
                    console.error("✗ Button verification failed - button not found in DOM");
                }

            } catch (insertError) {
                console.error("Error inserting button:", insertError);
                // Fallback: try to append to document body with absolute positioning
                try {
                    autoFillButton.style.cssText += `
                        position: fixed;
                        top: 50%;
                        right: 20px;
                        z-index: 10000;
                        transform: translateY(-50%);
                    `;
                    document.body.appendChild(autoFillButton);
                    console.log("Fallback: Added button to body with fixed positioning");
                } catch (fallbackError) {
                    console.error("Fallback insertion also failed:", fallbackError);
                }
            }
              const detectionMethod = isBathroomModalVisible ? "BathroomModal ID" : "form fields";
            console.log(`✓ Auto Fill button added to bathroom modal (detected via ${detectionMethod})`);

        } catch (error) {
            console.error("Error adding auto-fill button to bathroom modal:", error);
        } finally {
            // Always reset the running flag
            addAutoFillButtonToBathroomModal.isRunning = false;
        }
    }    // Main function to automatically configure bathroom modal
    async function autoConfigureBathroomModal(selectedRoom, roomName, hotelName) {
        console.log(`🚿 Starting bathroom modal automation for: ${roomName} at ${hotelName}`);

        try {
            // Try to extract bathroom configuration from the selected room's amenities data first
            let bathroomConfig = extractBathroomConfigurationFromSelectedRoom(selectedRoom);

            // If room amenities didn't provide enough data, try Step 2 detected amenities
            if (!bathroomConfig.success) {
                console.log("Could not detect bathroom configuration from selected room, trying Step 2 detected amenities...");
                bathroomConfig = extractBathroomConfigurationFromStep2Amenities();
            }

            // If Step 2 amenities didn't work, fall back to heuristic detection
            if (!bathroomConfig.success) {
                console.log("Could not detect bathroom configuration from Step 2 amenities, using heuristic detection...");
                const heuristicConfig = detectBathroomConfigurationHeuristic(roomName, hotelName);

                if (heuristicConfig.success) {
                    Object.assign(bathroomConfig, heuristicConfig);
                } else {
                    console.warn("All bathroom detection methods failed, using default configuration");
                    Object.assign(bathroomConfig, {
                        success: true,
                        bathrooms: [{ type: "Private Bathroom", features: ["Shower", "Toilet"] }],
                        totalBathrooms: 1,
                        confidence: "default",
                        reasoning: "Using default private bathroom with shower and toilet"
                    });
                }
            }

            // Store the detected configuration for later use
            GM_setValue("detectedBathroomConfig", JSON.stringify(bathroomConfig));
            console.log("✓ Bathroom configuration detected and stored:", bathroomConfig);

            return bathroomConfig;

        } catch (error) {
            console.error("Error in bathroom modal automation:", error);

            // Store default configuration as fallback
            const defaultConfig = {
                success: true,
                bathrooms: [{ type: "Private Bathroom", features: ["Shower"] }],
                totalBathrooms: 1,
                confidence: "error_fallback",
                reasoning: "Error occurred, using default bathroom configuration"
            };

            GM_setValue("detectedBathroomConfig", JSON.stringify(defaultConfig));
            return defaultConfig;
        }
    }    // Extract bathroom configuration from selected room's amenities data
    function extractBathroomConfigurationFromSelectedRoom(selectedRoom) {
        console.log("🔍 Analyzing selected room amenities for bathroom configuration...");

        try {
            // Check if the selected room has roomAmenities data
            if (!selectedRoom || !selectedRoom.roomAmenities) {
                console.log("No room amenities data found in selected room");
                return { success: false, reason: "No room amenities data in selected room" };
            }

            const roomAmenities = selectedRoom.roomAmenities;
            let amenities = [];

            // Extract amenities from different possible structures
            if (roomAmenities.bathroom && Array.isArray(roomAmenities.bathroom)) {
                amenities = roomAmenities.bathroom;
                console.log("Found bathroom amenities in selected room:", amenities);
            } else if (roomAmenities.general && Array.isArray(roomAmenities.general)) {
                // Sometimes bathroom amenities might be in general section
                amenities = roomAmenities.general.filter(amenity => {
                    const amenityLower = amenity.toLowerCase();
                    return amenityLower.includes('bathroom') || amenityLower.includes('shower') ||
                           amenityLower.includes('bath') || amenityLower.includes('toilet') ||
                           amenityLower.includes('bidet') || amenityLower.includes('hairdryer');
                });
                console.log("Found bathroom-related amenities in general section:", amenities);
            } else {
                console.log("No usable amenities structure found in selected room");
                return { success: false, reason: "No usable amenities structure in selected room" };
            }

            if (amenities.length === 0) {
                console.log("No bathroom amenities found in selected room");
                return { success: false, reason: "No bathroom amenities found in selected room" };
            }

            // Use the existing bathroom feature analysis logic
            return analyzeBathroomAmenities(amenities, "selected room amenities");

        } catch (error) {
            console.error("Error extracting bathroom configuration from selected room:", error);
            return { success: false, reason: "Error processing selected room amenities" };
        }
    }

    // Extract bathroom configuration from Step 2 detected amenities data
    function extractBathroomConfigurationFromStep2Amenities() {
        console.log("🔍 Analyzing Step 2 detected amenities for bathroom configuration...");

        try {
            // Get stored room amenities from Step 2
            const step2DataJSON = GM_getValue("step2DetectedAmenities", null);
            if (!step2DataJSON) {
                console.log("No Step 2 amenities data found");
                return { success: false, reason: "No Step 2 amenities data available" };
            }

            const amenitiesData = JSON.parse(step2DataJSON);
            const amenities = amenitiesData.amenities || [];

            console.log("Available amenities from Step 2 for bathroom analysis:", amenities);

            if (amenities.length === 0) {
                console.log("No amenities found in Step 2 data");
                return { success: false, reason: "No amenities found in Step 2 data" };
            }

            // Use the existing bathroom feature analysis logic
            return analyzeBathroomAmenities(amenities, "Step 2 detected amenities");

        } catch (error) {
            console.error("Error extracting bathroom configuration from Step 2 amenities:", error);
            return { success: false, reason: "Error processing Step 2 amenities data" };
        }
    }

    // Shared function to analyze bathroom amenities and generate configuration
    function analyzeBathroomAmenities(amenities, source) {
        console.log(`🔍 Analyzing bathroom amenities from ${source}:`, amenities);

        // Initialize bathroom configuration
        let bathroomConfig = {
            success: true,
            bathrooms: [],
            totalBathrooms: 0,
            confidence: "high",
            reasoning: `Detected from ${source}`
        };

        // Bathroom-related keywords and their mappings
        const bathroomFeatures = {
            // Bathroom types
            'private bathroom': 'Private Bathroom',
            'ensuite': 'Private Bathroom',
            'en-suite': 'Private Bathroom',
            'shared bathroom': 'Shared Bathroom',
            'communal bathroom': 'Shared Bathroom',

            // Specific features
            'shower': 'Shower',
            'bathtub': 'Bathtub',
            'bath tub': 'Bathtub',
            'bath': 'Bathtub',
            'bathtub/shower': 'Bathtub/Shower',
            'bathtub or shower': 'Bathtub/Shower',
            'bath or shower': 'Bathtub/Shower',
            'shower/tub combination': 'Bathtub/Shower',
            'shower tub combination': 'Bathtub/Shower',
            'shower/tub combo': 'Bathtub/Shower',
            'shower tub combo': 'Bathtub/Shower',
            'tub/shower combination': 'Bathtub/Shower',
            'tub shower combination': 'Bathtub/Shower',
            'jacuzzi': 'Jacuzzi',
            'hot tub': 'Jacuzzi',
            'spa bath': 'Jacuzzi',
            'toilet': 'Toilet',
            'wc': 'Toilet',
            'bidet': 'Bidet',
            'hairdryer': 'Hair Dryer',
            'hair dryer': 'Hair Dryer',
            'towels': 'Towels Provided',
            'free toiletries': 'Free Toiletries',
            'toiletries': 'Free Toiletries',
            'shampoo': 'Shampoo',
            'slippers': 'Slippers',
            'bathrobe': 'Bathrobe',
            'bathrobes': 'Bathrobe',
            'robe': 'Bathrobe',
            'rainfall showerhead': 'Rainfall Showerhead',
            'rain shower': 'Rainfall Showerhead',
            'rainfall shower': 'Rainfall Showerhead'
        };

        // Analyze amenities for bathroom features
        let detectedFeatures = [];
        let bathroomType = 'Private Bathroom'; // Default assumption
        let hasPrivateBathroom = false;
        let hasSharedBathroom = false;

        for (const amenity of amenities) {
            const amenityLower = amenity.toLowerCase();

            for (const [keyword, feature] of Object.entries(bathroomFeatures)) {
                if (amenityLower.includes(keyword)) {
                    if (keyword.includes('private') || keyword.includes('ensuite') || keyword.includes('en-suite')) {
                        hasPrivateBathroom = true;
                        bathroomType = 'Private Bathroom';
                    } else if (keyword.includes('shared') || keyword.includes('communal')) {
                        hasSharedBathroom = true;
                        if (!hasPrivateBathroom) {
                            bathroomType = 'Shared Bathroom';
                        }
                    } else {
                        // Regular bathroom feature
                        if (!detectedFeatures.includes(feature)) {
                            detectedFeatures.push(feature);
                        }
                    }
                }
            }
        }

        // If no specific features detected, add default ones
        if (detectedFeatures.length === 0) {
            detectedFeatures = ['Shower', 'Toilet'];
            bathroomConfig.confidence = "medium";
            bathroomConfig.reasoning = `Default features applied - no specific bathroom amenities found in ${source}`;
        }

        // Create bathroom configuration
        bathroomConfig.bathrooms = [{
            type: bathroomType,
            features: detectedFeatures
        }];
        bathroomConfig.totalBathrooms = 1;

        console.log(`✓ Bathroom configuration extracted from ${source}:`, bathroomConfig);
        return bathroomConfig;
    }    // Legacy function - renamed for clarity
    function extractBathroomConfigurationFromRoomAmenities() {
        console.log("⚠️ Using legacy bathroom amenities extraction function - redirecting to Step 2 amenities");
        return extractBathroomConfigurationFromStep2Amenities();
    }

    // Heuristic bathroom configuration detection based on room/hotel names
    function detectBathroomConfigurationHeuristic(roomName = "", hotelName = "") {
        console.log("🔍 Using heuristic bathroom detection...");

        try {
            const combinedText = `${roomName} ${hotelName}`.toLowerCase();

            let bathroomConfig = {
                success: true,
                bathrooms: [],
                totalBathrooms: 1,
                confidence: "medium",
                reasoning: "Heuristic detection based on room/hotel name"
            };

            let bathroomType = 'Private Bathroom';
            let features = ['Shower', 'Toilet']; // Default features

            // Analyze text for bathroom indicators
            if (combinedText.includes('suite') || combinedText.includes('deluxe') ||
                combinedText.includes('premium') || combinedText.includes('luxury')) {
                features = ['Shower', 'Bathtub', 'Toilet', 'Hair Dryer', 'Free Toiletries', 'Bathrobe'];
                bathroomConfig.confidence = "high";
                bathroomConfig.reasoning = "Luxury/suite accommodation - enhanced bathroom features";
            } else if (combinedText.includes('spa') || combinedText.includes('resort')) {
                features = ['Shower', 'Bathtub', 'Toilet', 'Hair Dryer', 'Free Toiletries'];
                bathroomConfig.reasoning = "Spa/resort accommodation - enhanced bathroom features";
            } else if (combinedText.includes('hostel') || combinedText.includes('dorm') ||
                      combinedText.includes('shared') || combinedText.includes('bunk')) {
                bathroomType = 'Shared Bathroom';
                features = ['Shower', 'Toilet'];
                bathroomConfig.reasoning = "Hostel/shared accommodation - shared bathroom assumed";
            } else if (combinedText.includes('studio') || combinedText.includes('apartment')) {
                features = ['Shower', 'Toilet', 'Hair Dryer'];
                bathroomConfig.reasoning = "Studio/apartment - standard private bathroom";
            }

            bathroomConfig.bathrooms = [{
                type: bathroomType,
                features: features
            }];

            console.log("✓ Heuristic bathroom configuration:", bathroomConfig);
            return bathroomConfig;

        } catch (error) {
            console.error("Error in heuristic bathroom detection:", error);
            return { success: false, reason: "Error in heuristic detection" };
        }
    }    // Initialize enhanced bathroom modal detection system
    function initializeEnhancedBathroomModalDetection() {
        console.log("🚿 Initializing enhanced bathroom modal detection...");

        try {
            // Set up bathroom modal observer
            setupBathroomModalObserver();

            // Connect to existing bathroom button if present
            connectToExistingBathroomButton();

            console.log("✓ Enhanced bathroom modal detection initialized");

        } catch (error) {
            console.error("Error initializing bathroom modal detection:", error);
        }
    }

    // Connect to existing bathroom button for automatic modal population
    function connectToExistingBathroomButton() {
        console.log("🔍 Looking for existing bathroom buttons to enhance...");

        try {
            // Look for bathroom-related buttons
            const buttonSelectors = [
                'button[onclick*="Bathroom"]',
                'button[onclick*="bathroom"]',
                'a[href*="Bathroom"]',
                'a[href*="bathroom"]',
                'input[value*="Bathroom"]',
                'input[value*="bathroom"]'
            ];

            let bathroomButtons = [];

            for (const selector of buttonSelectors) {
                const buttons = document.querySelectorAll(selector);
                bathroomButtons.push(...buttons);
            }

            // Also look for buttons with bathroom-related text
            const allButtons = document.querySelectorAll('button, a, input[type="button"], input[type="submit"]');
            for (const button of allButtons) {
                const buttonText = (button.textContent || button.value || '').toLowerCase();
                if (buttonText.includes('bathroom') || buttonText.includes('add bathroom')) {
                    bathroomButtons.push(button);
                }
            }

            if (bathroomButtons.length > 0) {
                console.log(`Found ${bathroomButtons.length} bathroom button(s), setting up automation...`);
                  bathroomButtons.forEach((button, index) => {
                    // Store original click handler if it exists
                    const originalOnClick = button.onclick;

                    // Track if this button has already been processed
                    if (button.dataset.bathroomAutomationAdded) {
                        console.log(`Bathroom button ${index + 1} already enhanced, skipping...`);
                        return;
                    }

                    // Add our enhanced click handler
                    button.addEventListener('click', async function(e) {
                        console.log(`Bathroom button ${index + 1} clicked - will auto-populate when modal opens`);

                        // Call original handler first if it exists
                        if (originalOnClick) {
                            originalOnClick.call(this, e);
                        }

                        // Wait for modal to open and then populate it (only if not already processing)
                        if (!addAutoFillButtonToBathroomModal.isRunning) {
                            setTimeout(async () => {
                                try {
                                    await addAutoFillButtonToBathroomModal();
                                } catch (error) {
                                    console.error("Error adding auto-fill to bathroom modal:", error);
                                }
                            }, 500);
                        }
                    });

                    // Mark button as processed
                    button.dataset.bathroomAutomationAdded = 'true';

                    console.log(`✓ Enhanced bathroom button ${index + 1}: ${button.textContent || button.value || 'Unnamed'}`);
                });

            } else {
                console.log("No bathroom buttons found on current page");
            }

        } catch (error) {
            console.error("Error connecting to bathroom buttons:", error);
        }
    }    // Set up observer to detect bathroom modal opening
    function setupBathroomModalObserver() {
        console.log("Setting up bathroom modal observer...");

        try {
            // Track processed modals to prevent duplicate processing
            let processedModals = new Set();
            let isProcessing = false;

            // Create observer to watch for bathroom modal
            const modalObserver = new MutationObserver(function(mutations) {
                // Prevent overlapping executions
                if (isProcessing) return;

                mutations.forEach(function(mutation) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check for bathroom modal by ID
                            if (node.id && node.id.toLowerCase().includes('bathroom')) {
                                const modalId = node.id;
                                if (!processedModals.has(modalId)) {
                                    console.log("🚿 Bathroom modal detected by ID:", modalId);
                                    processedModals.add(modalId);
                                    isProcessing = true;
                                    setTimeout(() => {
                                        addAutoFillButtonToBathroomModal();
                                        isProcessing = false;
                                    }, 1000);
                                }
                            }

                            // Check for modal with bathroom-related content
                            const modalElements = node.querySelectorAll ?
                                node.querySelectorAll('.modal, [role="dialog"], .fade.show') : [];

                            modalElements.forEach(modal => {
                                const modalId = modal.id || `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

                                if (!processedModals.has(modalId)) {
                                    const modalContent = modal.textContent || '';
                                    if (modalContent.toLowerCase().includes('bathroom') ||
                                        modalContent.toLowerCase().includes('bath type') ||
                                        modal.querySelector('#BathroomTypeID')) {
                                        console.log("🚿 Bathroom modal detected by content");
                                        processedModals.add(modalId);
                                        isProcessing = true;
                                        setTimeout(() => {
                                            addAutoFillButtonToBathroomModal();
                                            isProcessing = false;
                                        }, 1000);
                                    }
                                }
                            });
                        }
                    });
                });
            });

            // Start observing
            modalObserver.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Store observer reference for potential cleanup
            window._bathroomModalObserver = modalObserver;

            console.log("✓ Bathroom modal observer set up successfully");

        } catch (error) {
            console.error("Error setting up bathroom modal observer:", error);
        }
    }

    // Wait for bathroom modal to load
    async function waitForBathroomModalToLoad() {
        return new Promise((resolve, reject) => {
            const maxWaitTime = 15000; // 15 seconds maximum wait
            const checkInterval = 200; // Check every 200ms
            let elapsedTime = 0;

            console.log("Waiting for bathroom modal form fields to load...");

            const checkForFormFields = () => {
                // Check for bathroom modal element
                const bathroomModalElement = document.querySelector('#BathroomModal');
                const isBathroomModalVisible = bathroomModalElement &&
                                            bathroomModalElement.style.display !== 'none' &&
                                            bathroomModalElement.offsetParent !== null;

                // Check for key bathroom form fields
                const bathroomTypeField = document.querySelector('#BathroomTypeID');
                const privateField = document.querySelector('#Private');
                const sharedField = document.querySelector('#Shared');

                // Check that fields are ready and visible
                const fieldsReady = bathroomTypeField &&
                                   bathroomTypeField.offsetParent !== null &&
                                   !bathroomTypeField.disabled;

                if (fieldsReady) {
                    const detectionMethod = isBathroomModalVisible ? "BathroomModal ID + fields" : "form fields only";
                    console.log(`✓ Bathroom modal form fields detected and ready (via ${detectionMethod})`);
                    resolve();
                    return;
                }

                // Log progress if BathroomModal is detected but fields aren't ready yet
                if (isBathroomModalVisible && elapsedTime % 1000 === 0) {
                    console.log(`BathroomModal element visible, waiting for form fields... (${elapsedTime/1000}s elapsed)`);
                }

                elapsedTime += checkInterval;

                if (elapsedTime >= maxWaitTime) {
                    const modalInfo = isBathroomModalVisible ? " (BathroomModal element was visible)" : "";
                    console.warn(`Timeout waiting for bathroom modal form fields to load${modalInfo}`);
                    reject(new Error("Timeout waiting for bathroom modal to load"));
                    return;
                }

                // Continue checking
                setTimeout(checkForFormFields, checkInterval);
            };
                  // Start checking immediately
            checkForFormFields();
        });
        }        // Populate bathroom form fields
        async function populateBathroomFormFields(config) {
            console.log("Populating bathroom form fields with configuration:", config);

            try {
                // Verify that critical form fields are available
                const criticalFields = ['#BathroomTypeID'];
                const missingFields = criticalFields.filter(selector => !document.querySelector(selector));

                if (missingFields.length > 0) {
                    throw new Error(`Critical bathroom form fields not found: ${missingFields.join(', ')}`);
                }

                console.log("✓ All critical bathroom form fields are available");

                // Map features to actual form field IDs
                const featureMapping = {
                    'Shower': 'Shower',
                    'Bathtub': 'Tub',
                    'Bath': 'Tub',
                    'Tub': 'Tub',
                    'Bath Tub': 'Tub',
                    'Bathtub/Shower': 'TubShower',
                    'Tub/Shower': 'TubShower',
                    'Tub Shower': 'TubShower',
                    'Shower/Tub': 'TubShower',
                    'Shower Tub': 'TubShower',
                    'Bathtub/shower combination': 'TubShower', // For backwards compatibility
                    'Bathtub or shower': 'TubShower',
                    'Bath or shower': 'TubShower',
                    'Shower/tub combination': 'TubShower',
                    'Shower tub combination': 'TubShower',
                    'Shower/tub combo': 'TubShower',
                    'Shower tub combo': 'TubShower',
                    'Tub/shower combination': 'TubShower',
                    'Tub shower combination': 'TubShower',
                    'Toilet': 'Toilet',
                    'WC': 'Toilet',
                    'Sink': 'Sink',
                    'Bidet': 'Bidet',
                    'Shampoo': 'Shampoo',
                    'Free Toiletries': 'Shampoo', // Map toiletries to shampoo as closest match
                    'Toiletries': 'Shampoo',
                    'Soap': 'Soap',
                    'Hair Dryer': 'Heater', // Map hair dryer to heater as closest match
                    'Hairdryer': 'Heater',
                    'Heater': 'Heater',
                    'Bathroom Heater': 'Heater'
                };

                // First, uncheck all bathroom feature checkboxes
                const allBathroomFields = ['Toilet', 'TubShower', 'Tub', 'Sink', 'Shower', 'Bidet', 'Shampoo', 'Soap', 'Heater'];
                allBathroomFields.forEach(fieldId => {
                    const checkbox = document.querySelector(`#${fieldId}`);
                    if (checkbox && checkbox.type === 'checkbox') {
                        checkbox.checked = false;
                    }
                });

                // Handle bathroom features checkboxes
                let appliedFeatures = [];
                let hasShower = false;
                let hasTub = false;
                let hasToilet = false;
            if (config.bathrooms && config.bathrooms.length > 0 && config.bathrooms[0].features) {
                const features = config.bathrooms[0].features;

                // Check if we have a tub/shower combination
                const hasTubShowerCombination = features.some(feature => {
                    const fieldId = featureMapping[feature];
                    return fieldId === 'TubShower';
                });

                // If TubShower combination is present, ensure individual Tub and Shower are unchecked
                if (hasTubShowerCombination) {
                    const tubCheckbox = document.querySelector('#Tub');
                    const showerCheckbox = document.querySelector('#Shower');

                    if (tubCheckbox && tubCheckbox.type === 'checkbox' && tubCheckbox.checked) {
                        tubCheckbox.checked = false;
                        console.log('✓ Unchecked individual Tub because TubShower combination is enabled');
                    }

                    if (showerCheckbox && showerCheckbox.type === 'checkbox' && showerCheckbox.checked) {
                        showerCheckbox.checked = false;
                        console.log('✓ Unchecked individual Shower because TubShower combination is enabled');
                    }
                }

                // Process detected features
                features.forEach(feature => {
                    const fieldId = featureMapping[feature];
                    if (fieldId) {
                        // Skip individual Tub and Shower if TubShower combination is present
                        if (hasTubShowerCombination && (fieldId === 'Tub' || fieldId === 'Shower')) {
                            console.log(`✓ Skipping ${fieldId} (${feature}) because TubShower combination is enabled`);
                            return;
                        }

                        const checkbox = document.querySelector(`#${fieldId}`);
                        if (checkbox && checkbox.type === 'checkbox') {
                            checkbox.checked = true;
                            appliedFeatures.push(feature);

                            // Track key features for bathroom type determination
                            if (fieldId === 'Shower') hasShower = true;
                            if (fieldId === 'Tub' || fieldId === 'TubShower') hasTub = true;
                            if (fieldId === 'Toilet') hasToilet = true;

                            console.log(`✓ Enabled ${feature} (${fieldId})`);
                        } else {
                            console.warn(`Bathroom feature field ${fieldId} not found for ${feature}`);
                        }
                    } else {
                        console.warn(`No mapping found for bathroom feature: ${feature}`);
                    }
                });
            }

                // Set default features if none were detected
                if (appliedFeatures.length === 0) {
                    console.log("No specific features detected, applying default bathroom setup...");

                    // Default: Toilet + Shower + Sink
                    const defaultFeatures = ['Toilet', 'Shower', 'Sink'];
                    defaultFeatures.forEach(fieldId => {
                        const checkbox = document.querySelector(`#${fieldId}`);
                        if (checkbox && checkbox.type === 'checkbox') {
                            checkbox.checked = true;
                            appliedFeatures.push(fieldId);

                            if (fieldId === 'Shower') hasShower = true;
                            if (fieldId === 'Toilet') hasToilet = true;

                            console.log(`✓ Enabled default feature: ${fieldId}`);
                        }
                    });
                }

                // Determine bathroom type based on features (1=Full, 2=Half, 3=Shower)
                const bathroomTypeSelect = document.querySelector('#BathroomTypeID');
                if (bathroomTypeSelect) {
                    let typeValue = "1"; // Default to Full bathroom
                    let typeDescription = "Full bathroom";

                    if (hasToilet && (hasShower || hasTub)) {
                        // Full bathroom: has toilet + shower/tub
                        typeValue = "1";
                        typeDescription = "Full bathroom";
                    } else if (hasToilet && !hasShower && !hasTub) {
                        // Half bathroom: has toilet but no shower/tub
                        typeValue = "2";
                        typeDescription = "Half bathroom (toilet only)";
                    } else if ((hasShower || hasTub) && !hasToilet) {
                        // Shower only: has shower/tub but no toilet
                        typeValue = "3";
                        typeDescription = "Shower only";
                    } else if (!hasToilet && !hasShower && !hasTub) {
                        // Default to full bathroom if unclear
                        typeValue = "1";
                        typeDescription = "Full bathroom (default)";
                    }

                    bathroomTypeSelect.value = typeValue;
                    console.log(`✓ Set BathroomTypeID to ${typeDescription} (value: ${typeValue})`);
                }

                // Create summary
                const summary = `Bathroom Configuration Applied:
    • Bathroom Type: ${typeDescription || 'Full bathroom'}
    • Features: ${appliedFeatures.length > 0 ? appliedFeatures.join(', ') : 'Default features'}
    ${config.reasoning ? `• Detection method: ${config.reasoning}` : ''}
    ${config.confidence ? `• Confidence: ${config.confidence}` : ''}`;                console.log("✓ Bathroom form fields populated successfully");
                await showAlertModal("Bathroom Form Auto-Fill Complete", `Bathroom form auto-filled successfully!\n\n${summary}\n\nYou can now click "Add Bathroom" to submit the form.`);

            } catch (error) {
                console.error("Error populating bathroom form fields:", error);
                throw error;
            }
        }    // Streamlined function to directly populate bathroom form
    async function populateBathroomForm(config) {
        console.log("Directly populating Egetinnz bathroom form with configuration:", config);

        try {
            // Verify that critical form fields are available
            const criticalFields = ['#BathroomTypeID'];
            const missingFields = criticalFields.filter(selector => !document.querySelector(selector));

            if (missingFields.length > 0) {
                throw new Error(`Critical bathroom form fields not found: ${missingFields.join(', ')}`);
            }

            console.log("✓ All critical bathroom form fields are available");

            // Map features to actual form field IDs
            const featureMapping = {
                'Shower': 'Shower',
                'Bathtub': 'Tub',
                'Bath': 'Tub',
                'Tub': 'Tub',
                'Bath Tub': 'Tub',
                'Bathtub/Shower': 'TubShower',
                'Tub/Shower': 'TubShower',
                'Tub Shower': 'TubShower',
                'Shower/Tub': 'TubShower',
                'Shower Tub': 'TubShower',
                'Bathtub/shower combination': 'TubShower', // For backwards compatibility
                'Bathtub or shower': 'TubShower',
                'Bath or shower': 'TubShower',
                'Shower/tub combination': 'TubShower',
                'Shower tub combination': 'TubShower',
                'Shower/tub combo': 'TubShower',
                'Shower tub combo': 'TubShower',
                'Tub/shower combination': 'TubShower',
                'Tub shower combination': 'TubShower',
                'Toilet': 'Toilet',
                'WC': 'Toilet',
                'Sink': 'Sink',
                'Bidet': 'Bidet',
                'Shampoo': 'Shampoo',
                'Free Toiletries': 'Shampoo', // Map toiletries to shampoo as closest match
                'Toiletries': 'Shampoo',
                'Soap': 'Soap',
                'Hair Dryer': 'Heater', // Map hair dryer to heater as closest match
                'Hairdryer': 'Heater',
                'Heater': 'Heater',
                'Bathroom Heater': 'Heater'
            };

            // First, uncheck all bathroom feature checkboxes
            const allBathroomFields = ['Toilet', 'TubShower', 'Tub', 'Sink', 'Shower', 'Bidet', 'Shampoo', 'Soap', 'Heater'];
            allBathroomFields.forEach(fieldId => {
                const checkbox = document.querySelector(`#${fieldId}`);
                if (checkbox && checkbox.type === 'checkbox') {
                    checkbox.checked = false;
                }
            });

            // Handle bathroom features
            let appliedFeatures = [];
            let hasShower = false;
            let hasTub = false;
            let hasToilet = false;              if (config.bathrooms && config.bathrooms.length > 0 && config.bathrooms[0].features) {
                const features = config.bathrooms[0].features;

                // Check if we have a tub/shower combination
                const hasTubShowerCombination = features.some(feature => {
                    const fieldId = featureMapping[feature];
                    return fieldId === 'TubShower';
                });

                // If TubShower combination is present, ensure individual Tub and Shower are unchecked
                if (hasTubShowerCombination) {
                    const tubCheckbox = document.querySelector('#Tub');
                    const showerCheckbox = document.querySelector('#Shower');

                    if (tubCheckbox && tubCheckbox.type === 'checkbox' && tubCheckbox.checked) {
                        tubCheckbox.checked = false;
                        console.log('✓ Unchecked individual Tub because TubShower combination is enabled');
                    }

                    if (showerCheckbox && showerCheckbox.type === 'checkbox' && showerCheckbox.checked) {
                        showerCheckbox.checked = false;
                        console.log('✓ Unchecked individual Shower because TubShower combination is enabled');
                    }
                }

                // Process detected features
                features.forEach(feature => {
                    const fieldId = featureMapping[feature];
                    if (fieldId) {
                        // Skip individual Tub and Shower if TubShower combination is present
                        if (hasTubShowerCombination && (fieldId === 'Tub' || fieldId === 'Shower')) {
                            console.log(`✓ Skipping ${fieldId} (${feature}) because TubShower combination is enabled`);
                            return;
                        }

                        const checkbox = document.querySelector(`#${fieldId}`);
                        if (checkbox && checkbox.type === 'checkbox') {
                            checkbox.checked = true;
                            appliedFeatures.push(feature);

                            // Track key features for bathroom type determination
                            if (fieldId === 'Shower') hasShower = true;
                            if (fieldId === 'Tub' || fieldId === 'TubShower') hasTub = true;
                            if (fieldId === 'Toilet') hasToilet = true;

                            console.log(`✓ Set ${fieldId} for ${feature}`);
                        }
                    }
                });
            }

            // Set default features if none were detected
            if (appliedFeatures.length === 0) {
                console.log("No specific features detected, applying default bathroom setup...");

                // Default: Toilet + Shower + Sink
                const defaultFeatures = ['Toilet', 'Shower', 'Sink'];
                defaultFeatures.forEach(fieldId => {
                    const checkbox = document.querySelector(`#${fieldId}`);
                    if (checkbox && checkbox.type === 'checkbox') {
                        checkbox.checked = true;
                        appliedFeatures.push(fieldId);

                        if (fieldId === 'Shower') hasShower = true;
                        if (fieldId === 'Toilet') hasToilet = true;

                        console.log(`✓ Enabled default feature: ${fieldId}`);
                    }
                });
            }

            // Determine bathroom type based on features (1=Full, 2=Half, 3=Shower)
            const bathroomTypeSelect = document.querySelector('#BathroomTypeID');
            if (bathroomTypeSelect) {
                let typeValue = "1"; // Default to Full bathroom
                let typeDescription = "Full bathroom";

                if (hasToilet && (hasShower || hasTub)) {
                    // Full bathroom: has toilet + shower/tub
                    typeValue = "1";
                    typeDescription = "Full bathroom";
                } else if (hasToilet && !hasShower && !hasTub) {
                    // Half bathroom: has toilet but no shower/tub
                    typeValue = "2";
                    typeDescription = "Half bathroom (toilet only)";
                } else if ((hasShower || hasTub) && !hasToilet) {
                    // Shower only: has shower/tub but no toilet
                    typeValue = "3";
                    typeDescription = "Shower only";
                } else if (!hasToilet && !hasShower && !hasTub) {
                    // Default to full bathroom if unclear
                    typeValue = "1";
                    typeDescription = "Full bathroom (default)";
                }

                bathroomTypeSelect.value = typeValue;
                console.log(`✓ Set BathroomTypeID to ${typeDescription} (value: ${typeValue})`);
            } else {
                console.warn("BathroomTypeID field not found");
            }

            // Create summary
            const summary = `Bathroom Configuration Applied:
• Bathroom Type: ${typeDescription || 'Full bathroom'}
• Features: ${appliedFeatures.length > 0 ? appliedFeatures.join(', ') : 'Default features'}
${config.reasoning ? `• Detection method: ${config.reasoning}` : ''}
${config.confidence ? `• Confidence: ${config.confidence}` : ''}`;            console.log("✓ Bathroom form populated successfully");
            await showAlertModal("Bathroom Configuration Applied", `Bathroom configuration applied successfully!\n\n${summary}\n\nYou can now click the "Add Bathroom" button to submit the form.`);

        } catch (error) {
            console.error("Error populating bathroom form:", error);
            throw error;
        }
    }

    // Manual bathroom modal automation function for menu command
    async function manualBathroomModalAutomation() {
        console.log("Starting streamlined bathroom form automation...");

        try {
            // Check if we have stored bathroom configuration from automatic detection
            const storedConfigJSON = GM_getValue("detectedBathroomConfig", null);
            let detectedConfig = null;

            if (storedConfigJSON) {
                try {
                    detectedConfig = JSON.parse(storedConfigJSON);
                    console.log("Found stored bathroom configuration:", detectedConfig);
                } catch (error) {
                    console.warn("Could not parse stored bathroom configuration:", error);
                }
            }

            // If no detected config, create a default one
            if (!detectedConfig) {
                detectedConfig = {
                    success: true,
                    bathrooms: [{ type: "Private Bathroom", features: ["Shower", "Toilet"] }],
                    totalBathrooms: 1,
                    confidence: "default",
                    reasoning: "Using default private bathroom with shower and toilet"
                };
                console.log("Using default bathroom configuration");
            }

            // Wait for bathroom modal to load before populating form fields
            console.log("Waiting for bathroom modal to load...");
            try {
                await waitForBathroomModalToLoad();
            } catch (error) {
                console.warn("Bathroom modal loading detection failed, proceeding with fallback delay:", error.message);
                // Fallback: Use a fixed delay if modal detection fails
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            // Add a small additional delay to ensure all form elements are ready
            await new Promise(resolve => setTimeout(resolve, 500));

            // Directly populate the Egetinnz bathroom form fields
            await populateBathroomForm(detectedConfig);        } catch (error) {
            console.error("Error in bathroom form automation:", error);
            await showAlertModal("Bathroom Configuration Error", `Error setting up bathroom configuration: ${error.message}`);
        }
    }

    // === END OF BATHROOM MODAL AUTOMATION SYSTEM ===

    // Function to reset bathroom modal automation state (for debugging)
    function resetBathroomModalState() {
        console.log("Resetting bathroom modal automation state...");

        // Reset function state
        addAutoFillButtonToBathroomModal.isRunning = false;

        // Remove existing button
        const existingButton = document.querySelector('#btn-auto-fill-bathroom');
        if (existingButton) {
            existingButton.remove();
            console.log("Removed existing auto-fill button");
        }

        // Reset button processing flags
        const processedButtons = document.querySelectorAll('[data-bathroom-automation-added="true"]');
        processedButtons.forEach(button => {
            delete button.dataset.bathroomAutomationAdded;
        });

        console.log("✓ Bathroom modal automation state reset");
    }

    // Make reset function available globally
    window.resetBathroomModalState = resetBathroomModalState;

        // --- Page-specific UI Helper Functions ---
    function addButtonToEgetinnzPage(buttonText, onClickFunction, insertBeforeSelector = null) {
        // Check if button already exists to avoid duplicates
        if (document.querySelector(`button[data-egetinnz-automation="${buttonText}"]`)) {
            console.log(`Button "${buttonText}" already exists, skipping creation.`);
            return;
        }

        const button = document.createElement('button');
        button.textContent = buttonText;
        button.setAttribute('data-egetinnz-automation', buttonText);        button.style.cssText = `
            position: fixed;
            top: 80px;
            right: 10px;
            z-index: 9999;
            background-color: #007cba;
            color: white;
            border: none;
            padding: 8px 16px;
            margin: 5px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: background-color 0.3s;
        `;

        button.addEventListener('mouseover', () => {
            button.style.backgroundColor = '#005f8a';
        });
        button.addEventListener('mouseout', () => {
            button.style.backgroundColor = '#007cba';
        });
          button.addEventListener('click', onClickFunction);

        // For right-side positioning, append directly to body
        document.body.appendChild(button);

        console.log(`Added "${buttonText}" button to Egetinnz page (positioned on the right side).`);
        return button;
    }    function initializeEgetinnzPageLogic() {
        // Add page-specific automation buttons based on the current Egetinnz page
        const currentPath = window.location.pathname.toLowerCase();

        console.log(`Initializing Egetinnz page logic for path: ${currentPath}`);
          if (currentPath.includes('/listing/address') || currentPath.includes('/listing/step1')) {
            // Step 1: Address page - this is where Step 1 automation should be available
            addButtonToEgetinnzPage('🏨 Fetch Expedia Details (Step 1)',
                withLoadingBar("On-going Automation", "Fetching Expedia Details", automateListing), 'form');
            console.log('Added Step 1 automation button to Egetinnz address page.');

        } else if (currentPath.includes('/listing/accommodation') || currentPath.includes('/listing/step2')) {
            // Step 2: Accommodation details page
            addButtonToEgetinnzPage('🛏️ Auto-fill Room Details (Step 2)',
                withLoadingBar("On-going Automation", "Automating Room Details", automateStep2Forms), 'form');
            console.log('Added Step 2 automation button to Egetinnz accommodation page.');        } else if (currentPath.includes('/property/location') || currentPath.includes('/listing/step3')) {
            // Step 3: Location details page
            addButtonToEgetinnzPage('📍 Auto-fill Location Details (Step 3)',
                withLoadingBar("On-going Automation", "Automating Location Details", automateStep3Forms), 'form');
            console.log('Added Step 3 automation button to Egetinnz location page.');        } else if (currentPath.includes('/property/details') || currentPath.includes('/listing/step4')) {
            // Step 4: Details description page
            addButtonToEgetinnzPage('📝 Auto-fill Listing Name & Description (Step 4)',
                withLoadingBar("On-going Automation", "Automating Listing Description", automateStep4Forms), 'form');
              // Enhanced bedroom modal detection initialization
            initializeEnhancedBedroomModalDetection();
              // Connect bedroom modal automation to existing bedroom trigger button
            connectToExistingBedroomButton();

            // Enhanced bathroom modal detection initialization
            initializeEnhancedBathroomModalDetection();

            // Connect bathroom modal automation to existing bathroom trigger button
            connectToExistingBathroomButton();
            console.log('Added Step 4 automation buttons to Egetinnz details page.');

        } else if (currentPath.includes('/property/pricing') || currentPath.includes('/listing/step5') || currentPath.includes('/pricing') || 
                   document.querySelector('#StandardRate_NightlyRate') || document.querySelector('#StandardRate_WeeklyRate') || 
                   document.querySelector('#StandardRate_MonthlyRate')) {
            // Step 5: Pricing page - detect by URL patterns or presence of pricing form fields
            addButtonToEgetinnzPage('💰 Auto-fill Pricing (Step 5)',
                withLoadingBar("On-going Automation", "Automating Dynamic Pricing", automateStep5PricingForms), 'form');
            console.log('Added Step 5 pricing automation button to Egetinnz pricing page.');

        } else {
            console.log(`No specific automation logic defined for Egetinnz page: ${currentPath}`);
        }
    }
    // Register menu commands for manual triggering with loading bars
    GM_registerMenuCommand("🔧 Configure Together.ai API Key", withLoadingBar("API Configuration", "Configuring Together.ai API Key", configureTogetherAIKey));
    GM_registerMenuCommand("📊 Check Together.ai API Key Status", withLoadingBar("API Status Check", "Checking API Key Status", checkAPIKeyStatus));
    GM_registerMenuCommand("Fetch Expedia Details for Egetinnz (Step 1)", withLoadingBar("On-going Automation", "Fetching Expedia Details", automateListing));
    GM_registerMenuCommand("Automate Egetinnz Room Details (Step 2)", withLoadingBar("On-going Automation", "Automating Room Details", automateStep2Forms));
    GM_registerMenuCommand("Automate Egetinnz Location Details (Step 3)", withLoadingBar("On-going Automation", "Automating Location Details", automateStep3Forms));
    GM_registerMenuCommand("Automate Egetinnz Listing Name & Description (Step 4)", withLoadingBar("On-going Automation", "Automating Listing Description", automateStep4Forms));
    GM_registerMenuCommand("🛏️ Fill Bedroom Modal (Step 4)", withLoadingBar("On-going Automation", "Filling Bedroom Modal", manualBedroomModalAutomation));
    GM_registerMenuCommand("🚿 Fill Bathroom Modal (Step 4)", withLoadingBar("On-going Automation", "Filling Bathroom Modal", manualBathroomModalAutomation));
    GM_registerMenuCommand("💰 Automate Egetinnz Pricing (Step 5)", withLoadingBar("On-going Automation", "Automating Dynamic Pricing", automateStep5PricingForms));
    // Page-specific UI enhancements (buttons)
    if (window.location.host.includes("expediataap.com")) {
        // We are on an Expedia TAAP page
        // addButtonToPage(automateListing); // OBSOLETE: Step 1 now starts from Egetinnz
        console.log("On Expedia TAAP page. Button for starting Step 1 is now on Egetinnz /Listing/Address page.");
    } else if (window.location.host === "www.egetinnz.com") {
        // We are on an Egetinnz page
        initializeEgetinnzPageLogic(); // Add buttons/logic relevant to Egetinnz pages (e.g., Step 2 button)
    }

    console.log("Egetinnz Expedia Lister (v2.2) initialized. Menu commands registered. Page-specific UI (if any) added.");

})(); // End of UserScript main IIFE