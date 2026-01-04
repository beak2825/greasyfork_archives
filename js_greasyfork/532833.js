// ==UserScript==
// @name         OpenSnitch Pro
// @namespace    https://openguessr.com/
// @version      1.0.3
// @description  Enhanced location finder with timezone and regional information
// @author       Westagger
// @license      GNU GPLv3
// @match        https://openguessr.com/*
// @grant        GM_xmlhttpRequest
// @icon         https://raw.githubusercontent.com/Westagger/OpenSnitch-Pro/refs/heads/main/assets/osp-logo.png
// @supportURL   https://github.com/Westagger/OpenSnitch-Pro/issues
// @downloadURL https://update.greasyfork.org/scripts/532833/OpenSnitch%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/532833/OpenSnitch%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let popup = null;
    let lastLocation = null;
    let updateTimeout = null;
    let isMinimized = false;
    let lastUpdateTime = 0;
    let processingLocation = false;
    const COOLDOWN_TIME = 100;

        function createPopup() {
        if (popup && popup.parentNode) {
            document.body.removeChild(popup);
        }

        popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
            border-radius: 10px;
            z-index: 10000;
            font-family: 'Segoe UI', Arial, sans-serif;
            min-width: 250px;
            max-width: 350px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border: 1px solid #3d3d3d;
            transition: all 0.3s ease;
        `;

        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 15px;
            background: linear-gradient(135deg, #2d2d2d 0%, #1a1a1a 100%);
            border-bottom: 1px solid #3d3d3d;
            border-radius: 10px 10px 0 0;
        `;

        const titleText = document.createElement('span');
        titleText.textContent = '🌍 OpenSnitch Pro';
        titleText.style.cssText = `
            font-weight: bold;
            font-size: 14px;
            color: #fff;
        `;

        const minimizeBtn = document.createElement('button');
        minimizeBtn.innerHTML = isMinimized ? '+' : '−';
        minimizeBtn.style.cssText = `
            background: none;
            border: none;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            padding: 0 5px;
            line-height: 20px;
            transition: opacity 0.2s;
        `;
        minimizeBtn.onmouseover = () => minimizeBtn.style.opacity = '0.7';
        minimizeBtn.onmouseout = () => minimizeBtn.style.opacity = '1';
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            toggleMinimize();
        };

        titleBar.appendChild(titleText);
        titleBar.appendChild(minimizeBtn);
        popup.appendChild(titleBar);

        const contentContainer = document.createElement('div');
        contentContainer.id = 'opensnitch-content';
        contentContainer.style.cssText = `
            padding: 20px;
            transition: all 0.3s ease;
            ${isMinimized ? 'display: none;' : ''}
        `;
        popup.appendChild(contentContainer);

        document.body.appendChild(popup);
        return contentContainer;
    }

    function toggleMinimize() {
        const content = document.getElementById('opensnitch-content');
        const minimizeBtn = popup.querySelector('button');
        isMinimized = !isMinimized;

        if (isMinimized) {
            content.style.display = 'none';
            minimizeBtn.innerHTML = '+';
        } else {
            content.style.display = 'block';
            minimizeBtn.innerHTML = '−';
        }
    }

    function formatCountryName(countryName) {
        countryName = countryName
            .replace(/ \([^)]+\)/g, '')
            .replace(/(the|The)$/, '')
            .replace(/^(the|The) /, '')
            .trim();

        const nameMap = { //Shit, this took time
            'United States of America': 'United States',
            'Russian Federation': 'Russia',
            'The Netherlands': 'Netherlands',
            'Czech Republic': 'Czechia',
            'Republic of Korea': 'South Korea',
            'Democratic People\'s Republic of Korea': 'North Korea',
            'People\'s Republic of China': 'China',
            'Kingdom of Thailand': 'Thailand',
            'Republic of India': 'India',
            'Socialist Republic of Vietnam': 'Vietnam',
            'Kingdom of Cambodia': 'Cambodia',
            'Lao People\'s Democratic Republic': 'Laos',
            'Republic of the Philippines': 'Philippines',
            'Republic of Indonesia': 'Indonesia',
            'Republic of South Africa': 'South Africa',
            'United Kingdom of Great Britain and Northern Ireland': 'United Kingdom',
            'Federal Republic of Germany': 'Germany',
            'French Republic': 'France',
            'Kingdom of Spain': 'Spain',
            'Kingdom of Sweden': 'Sweden',
            'Kingdom of Norway': 'Norway',
            'Republic of Finland': 'Finland',
            'Republic of Poland': 'Poland',
            'Italian Republic': 'Italy',
            'Republic of Turkey': 'Turkey',
            'Hellenic Republic': 'Greece',
            'Portuguese Republic': 'Portugal',
            'Kingdom of Belgium': 'Belgium',
            'Swiss Confederation': 'Switzerland',
            'Republic of Austria': 'Austria',
            'Kingdom of Denmark': 'Denmark',
            'Republic of Hungary': 'Hungary',
            'Slovak Republic': 'Slovakia',
            'Republic of Bulgaria': 'Bulgaria',
            'Republic of Croatia': 'Croatia',
            'Republic of Estonia': 'Estonia',
            'Republic of Latvia': 'Latvia',
            'Republic of Lithuania': 'Lithuania',
            'Republic of Slovenia': 'Slovenia',
            'State of Israel': 'Israel',
            'Republic of Kazakhstan': 'Kazakhstan',
            'Republic of Belarus': 'Belarus',
            'Republic of Moldova': 'Moldova',
            'Republic of Azerbaijan': 'Azerbaijan',
            'Georgia': 'Georgia',
            'Republic of Armenia': 'Armenia',
            'Republic of Uzbekistan': 'Uzbekistan',
            'Kyrgyz Republic': 'Kyrgyzstan',
            'Republic of Tajikistan': 'Tajikistan',
            'Turkmenistan': 'Turkmenistan',
            'Islamic Republic of Pakistan': 'Pakistan',
            'People\'s Republic of Bangladesh': 'Bangladesh',
            'Democratic Socialist Republic of Sri Lanka': 'Sri Lanka',
            'Republic of the Union of Myanmar': 'Myanmar',
            'Kingdom of Saudi Arabia': 'Saudi Arabia',
            'United Arab Emirates': 'UAE',
            'Sultanate of Oman': 'Oman',
            'State of Qatar': 'Qatar',
            'State of Kuwait': 'Kuwait',
            'Kingdom of Bahrain': 'Bahrain',
            'Lebanese Republic': 'Lebanon',
            'Hashemite Kingdom of Jordan': 'Jordan',
            'Arab Republic of Egypt': 'Egypt',
            'Republic of Iraq': 'Iraq',
            'Islamic Republic of Iran': 'Iran',
            'Republic of Yemen': 'Yemen',
            'Syrian Arab Republic': 'Syria',
            'Islamic Republic of Afghanistan': 'Afghanistan',
            'Republic of Cyprus': 'Cyprus',
            'Mongolia': 'Mongolia',
            'Republic of Singapore': 'Singapore',
            'Republic of Albania': 'Albania',
            'Bosnia and Herzegovina': 'Bosnia',
            'Republic of Serbia': 'Serbia',
            'Republic of Kosovo': 'Kosovo',
            'Republic of North Macedonia': 'North Macedonia',
            'Republic of Montenegro': 'Montenegro',
            'Republic of Iceland': 'Iceland',
            'Grand Duchy of Luxembourg': 'Luxembourg',
            'Republic of Malta': 'Malta',
            'Republic of Paraguay': 'Paraguay',
            'Oriental Republic of Uruguay': 'Uruguay',
            'Republic of Chile': 'Chile',
            'Plurinational State of Bolivia': 'Bolivia',
            'Republic of Ecuador': 'Ecuador',
            'Republic of Colombia': 'Colombia',
            'Bolivarian Republic of Venezuela': 'Venezuela',
            'Republic of Panama': 'Panama',
            'Republic of Costa Rica': 'Costa Rica',
            'Republic of Nicaragua': 'Nicaragua',
            'Republic of Honduras': 'Honduras',
            'Republic of El Salvador': 'El Salvador',
            'Republic of Guatemala': 'Guatemala',
            'Dominican Republic': 'Dominican Republic',
            'Republic of Haiti': 'Haiti',
            'Jamaica': 'Jamaica',
            'Republic of Cuba': 'Cuba',
            'Republic of Tunisia': 'Tunisia',
            'People\'s Democratic Republic of Algeria': 'Algeria',
            'Kingdom of Morocco': 'Morocco',
            'Republic of Sudan': 'Sudan',
            'Federal Democratic Republic of Ethiopia': 'Ethiopia',
            'Republic of Kenya': 'Kenya',
            'United Republic of Tanzania': 'Tanzania',
            'Republic of Uganda': 'Uganda',
            'Republic of Rwanda': 'Rwanda',
            'Republic of Ghana': 'Ghana',
            'Federal Republic of Nigeria': 'Nigeria',
            'Republic of Senegal': 'Senegal',
            'Republic of Madagascar': 'Madagascar',
            'Republic of Mozambique': 'Mozambique',
            'Republic of Angola': 'Angola',
            'Republic of Namibia': 'Namibia',
            'Republic of Zimbabwe': 'Zimbabwe',
            'Republic of Botswana': 'Botswana',
            'Kingdom of Lesotho': 'Lesotho',
            'Kingdom of Eswatini': 'Eswatini',
            'Republic of Zambia': 'Zambia',
            'Republic of Malawi': 'Malawi',
            'Independent State of Papua New Guinea': 'Papua New Guinea',
            'Solomon Islands': 'Solomon Islands',
            'Republic of Fiji': 'Fiji',
            'Republic of Vanuatu': 'Vanuatu',
            'Independent State of Samoa': 'Samoa'
        };

        return nameMap[countryName] || countryName;
    }

    async function getTimeZoneInfo(lat, lng) {
        const timezoneApis = [
            // TimeDB API
            async () => {
                const response = await fetch(`https://timedb.io/api/TimeZone?lat=${lat}&lng=${lng}`);
                const data = await response.json();
                if (!data.timezone) throw new Error('No timezone data');
                return {
                    timeZone: data.timezone,
                    localTime: new Date().toLocaleString('en-US', {
                        timeZone: data.timezone,
                        hour12: false
                    })
                };
            },
            // TimeZoneDB API
            async () => {
                const response = await fetch(`https://api.timezonedb.com/v2.1/get-time-zone?key=YOUR_API_KEY&format=json&by=position&lat=${lat}&lng=${lng}`);
                const data = await response.json();
                if (data.status !== 'OK') throw new Error('Invalid timezone response');
                return {
                    timeZone: data.zoneName,
                    localTime: new Date(data.formatted).toLocaleString('en-US', {
                        timeZone: data.zoneName,
                        hour12: false
                    })
                };
            },
            // GeoNames API
            async () => {
                const response = await fetch(`http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lng}&username=YOUR_USERNAME`);
                const data = await response.json();
                if (!data.timezoneId) throw new Error('No timezone data');
                return {
                    timeZone: data.timezoneId,
                    localTime: new Date().toLocaleString('en-US', {
                        timeZone: data.timezoneId,
                        hour12: false
                    })
                };
            }
        ];

        let lastError = null;
        for (const api of timezoneApis) {
            try {
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), 3000)
                );

                const result = await Promise.race([
                    api(),
                    timeoutPromise
                ]);

                if (result && result.timeZone) {
                    return result;
                }
            } catch (error) {
                console.error('[OpenSnitch Pro] API attempt failed:', error);
                lastError = error;
                continue;
            }
        }

        // If APIs fail, use approximate calculation
        try {
            const tzOffset = -(new Date().getTimezoneOffset() / 60);
            const approximateOffset = Math.round(lng / 15);
            const hourOffset = approximateOffset;
            
            const timezone = `Etc/GMT${hourOffset >= 0 ? '-' : '+'}${Math.abs(hourOffset)}`;
            return {
                timeZone: timezone,
                localTime: new Date().toLocaleString('en-US', {
                    timeZone: timezone,
                    hour12: false
                })
            };
        } catch (error) {
            console.error('[OpenSnitch Pro] Timezone approximation failed:', error);
            return {
                timeZone: 'UTC',
                localTime: new Date().toLocaleString('en-US', {
                    timeZone: 'UTC',
                    hour12: false
                })
            };
        }
    }

    async function getLocationDetails(lat, lng) {
        const geocodingApis = [
            async () => {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
                const data = await response.json();
                const address = data.address;
                return {
                    country: formatCountryName(address.country || 'Unknown Country'),
                    state: address.state || address.region || '',
                    city: address.city || address.town || address.village || address.suburb || 'Unknown City',
                    location: determineLocation(lat, lng, {country: formatCountryName(address.country)})
                };
            },
            async () => {
                const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                const data = await response.json();
                return {
                    country: formatCountryName(data.countryName || 'Unknown Country'),
                    state: data.principalSubdivision || '',
                    city: data.locality || 'Unknown City',
                    location: determineLocation(lat, lng, {country: formatCountryName(data.countryName)})
                };
            },
            async () => {
                const response = await fetch(`https://geocode.xyz/${lat},${lng}?json=1`);
                const data = await response.json();
                return {
                    country: formatCountryName(data.country || 'Unknown Country'),
                    state: data.state || '',
                    city: data.city || 'Unknown City',
                    location: determineLocation(lat, lng, {country: formatCountryName(data.country)})
                };
            }
        ];

        try {
            const result = await Promise.race(geocodingApis.map(api => api()));
            return result;
        } catch (error) {
            console.error('[OpenSnitch Pro] All geocoding APIs failed:', error);
            return {
                country: 'Error fetching location',
                state: '',
                city: 'Try again later',
                location: ''
            };
        }
    }

    function createMapsButton(lat, lng) {
        const button = document.createElement('button');
        button.textContent = '📍 Open in Google Maps';
        button.style.cssText = `
            background: #4285f4;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            margin-top: 10px;
            transition: background-color 0.2s;
            width: 100%;
        `;
        button.onmouseover = () => button.style.background = '#5290f5';
        button.onmouseout = () => button.style.background = '#4285f4';
        button.onclick = () => window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
        return button;
    }

        function formatContent(locationDetails, timeZoneInfo, lat, lng) {
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';

        const sections = [
            { label: 'Country', value: locationDetails.country },
            { label: 'Region', value: locationDetails.location },
            { label: 'State', value: locationDetails.state },
            { label: 'City', value: locationDetails.city },
            { label: 'Time Zone (≈)', value: `${timeZoneInfo.timeZone}\n${timeZoneInfo.localTime}` }
        ];

        sections.forEach(section => {
            if (section.value) {
                const sectionDiv = document.createElement('div');
                sectionDiv.style.cssText = 'display: flex; flex-direction: column;';

                const label = document.createElement('span');
                label.style.cssText = 'color: #888; font-size: 12px; margin-bottom: 2px;';
                label.textContent = section.label;

                const value = document.createElement('span');
                value.style.cssText = 'color: #fff; font-size: 14px; white-space: pre-line;';
                value.textContent = section.value;

                sectionDiv.appendChild(label);
                sectionDiv.appendChild(value);
                contentDiv.appendChild(sectionDiv);
            }
        });

        contentDiv.appendChild(createMapsButton(lat, lng));
        return contentDiv;
    }

    function checkForLocationChanges() {
        const iframe = document.querySelector('#PanoramaIframe');
        if (!iframe) return;

        const src = iframe.getAttribute('src');
        if (!src) return;

        try {
            const url = new URL(src);
            const newLocation = url.searchParams.get('location');
            const currentTime = Date.now();

            if (processingLocation || currentTime - lastUpdateTime < COOLDOWN_TIME) {
                return;
            }

            if (newLocation && newLocation !== lastLocation) {
                console.log('[OpenSnitch Pro] Location change detected:', newLocation);
                lastUpdateTime = currentTime;
                showLocationInfo();
            }
        } catch (error) {
            console.error('[OpenSnitch Pro] Error checking location:', error);
        }
    }

    async function showLocationInfo() {
        if (updateTimeout) {
            clearTimeout(updateTimeout);
            updateTimeout = null;
        }

        if (processingLocation) {
            return;
        }

        processingLocation = true;

        let iframe = document.querySelector('#PanoramaIframe');
        if (!iframe) {
            createPopup().textContent = 'Waiting for map to load...';
            processingLocation = false;
            return;
        }

        try {
            let location;
            const currentUrl = new URL(window.location.href);
            location = currentUrl.searchParams.get('locationSearch') ||
                      currentUrl.searchParams.get('location');

            if (!location) {
                const src = iframe.getAttribute('src');
                if (src) {
                    const url = new URL(src);
                    location = url.searchParams.get('location');
                }
            }

            if (!location || location === lastLocation) {
                processingLocation = false;
                return;
            }

            console.log('[OpenSnitch Pro] Processing new location:', location);
            lastLocation = location;
            const [lat, lng] = location.split(',').map(Number);

            // Use Promise.all for parallel API calls
            const [locationDetails, timeZoneInfo] = await Promise.all([
                getLocationDetails(lat, lng),
                getTimeZoneInfo(lat, lng)
            ]);

            const popupContent = createPopup();
            const contentDiv = formatContent(locationDetails, timeZoneInfo, lat, lng);
            popupContent.appendChild(contentDiv);

        } catch (error) {
            console.error('[OpenSnitch Pro] Error:', error);
            createPopup().textContent = 'Error processing location';
        } finally {
            processingLocation = false;
        }
    }

        function determineLocation(lat, lng, address) {
        const countryBounds = getCountryBounds(address.country);
        if (!countryBounds) return '';

        let parts = [];

        const latPosition = (lat - countryBounds.south) / (countryBounds.north - countryBounds.south);
        if (latPosition < 0.33) parts.push('Southern');
        else if (latPosition > 0.66) parts.push('Northern');
        else parts.push('Central');

        const lngPosition = (lng - countryBounds.west) / (countryBounds.east - countryBounds.west);
        if (lngPosition < 0.33) parts.push('Western');
        else if (lngPosition > 0.66) parts.push('Eastern');
        else parts.push('Central');

        return `${parts.join(' ')} region`;
    }

    function getCountryBounds(country) { // I added almost every country
        const bounds = {
            'United States': { north: 49, south: 25, east: -66.93, west: -124.78 },
            'Russia': { north: 81.85, south: 41.18, east: 190.32, west: 19.25 },
            'Canada': { north: 83.11, south: 41.67, east: -52.62, west: -141.00 },
            'Brazil': { north: 5.27, south: -33.75, east: -34.79, west: -73.99 },
            'China': { north: 53.55, south: 18.15, east: 134.77, west: 73.55 },
            'Australia': { north: -10.06, south: -43.64, east: 153.61, west: 113.16 },
            'India': { north: 35.51, south: 6.75, east: 97.40, west: 68.10 },
            'Argentina': { north: -21.78, south: -55.06, east: -53.65, west: -73.56 },
            'Mexico': { north: 32.72, south: 14.53, east: -86.70, west: -118.40 },
            'Indonesia': { north: 5.90, south: -10.95, east: 141.02, west: 95.29 },
            'South Africa': { north: -22.13, south: -34.84, east: 32.89, west: 16.47 },
            'Ukraine': { north: 52.37, south: 44.39, east: 40.22, west: 22.13 },
            'France': { north: 51.09, south: 41.36, east: 9.56, west: -5.14 },
            'Germany': { north: 55.06, south: 47.27, east: 15.04, west: 5.87 },
            'Japan': { north: 45.52, south: 24.25, east: 145.82, west: 122.94 },
            'Spain': { north: 43.79, south: 36.00, east: 4.33, west: -9.30 },
            'Sweden': { north: 69.06, south: 55.34, east: 24.16, west: 11.11 },
            'Norway': { north: 71.18, south: 57.97, east: 31.17, west: 4.65 },
            'Finland': { north: 70.09, south: 59.81, east: 31.59, west: 20.55 },
            'Poland': { north: 54.84, south: 49.00, east: 24.15, west: 14.12 },
            'Italy': { north: 47.09, south: 36.65, east: 18.52, west: 6.63 },
            'United Kingdom': { north: 58.67, south: 49.96, east: 1.76, west: -8.65 },
            'Turkey': { north: 42.14, south: 35.82, east: 44.83, west: 25.66 },
            'Thailand': { north: 20.46, south: 5.61, east: 105.64, west: 97.34 },
            'Vietnam': { north: 23.39, south: 8.56, east: 109.47, west: 102.14 },
            'New Zealand': { north: -34.39, south: -47.29, east: 178.56, west: 166.42 },
            'South Korea': { north: 38.61, south: 33.11, east: 131.87, west: 125.07 },
            'Malaysia': { north: 7.36, south: 0.85, east: 119.27, west: 99.64 },
            'Philippines': { north: 21.12, south: 4.58, east: 126.60, west: 116.93 },
            'Chile': { north: -17.50, south: -55.98, east: -66.42, west: -75.64 },
            'Peru': { north: -0.03, south: -18.35, east: -68.68, west: -81.33 },
            'Colombia': { north: 13.38, south: -4.23, east: -66.87, west: -81.73 },
            'Greece': { north: 41.75, south: 34.80, east: 28.24, west: 19.37 },
            'Romania': { north: 48.27, south: 43.62, east: 29.67, west: 20.26 },
            'Portugal': { north: 42.15, south: 36.96, east: -6.19, west: -9.50 },
            'Netherlands': { north: 53.51, south: 50.75, east: 7.22, west: 3.36 },
            'Belgium': { north: 51.50, south: 49.49, east: 6.40, west: 2.54 },
            'Switzerland': { north: 47.81, south: 45.82, east: 10.49, west: 5.96 },
            'Austria': { north: 49.02, south: 46.37, east: 17.16, west: 9.53 },
            'Czechia': { north: 51.06, south: 48.55, east: 18.86, west: 12.09 },
            'Denmark': { north: 57.75, south: 54.56, east: 15.19, west: 8.07 },
            'Hungary': { north: 48.59, south: 45.74, east: 22.90, west: 16.11 },
            'Ireland': { north: 55.39, south: 51.42, east: -6.00, west: -10.48 },
            'Slovakia': { north: 49.61, south: 47.73, east: 22.57, west: 16.84 },
            'Bulgaria': { north: 44.22, south: 41.23, east: 28.61, west: 22.36 },
            'Croatia': { north: 46.55, south: 42.39, east: 19.45, west: 13.49 },
            'Estonia': { north: 59.68, south: 57.52, east: 28.21, west: 21.76 },
            'Latvia': { north: 58.08, south: 55.67, east: 28.24, west: 20.97 },
            'Lithuania': { north: 56.45, south: 53.89, east: 26.87, west: 20.93 },
            'Slovenia': { north: 46.87, south: 45.42, east: 16.61, west: 13.38 },
            'Israel': { north: 33.34, south: 29.49, east: 35.90, west: 34.27 },
            'Kazakhstan': { north: 55.45, south: 40.56, east: 87.31, west: 46.49 },
            'Belarus': { north: 56.17, south: 51.26, east: 32.77, west: 23.17 },
            'Moldova': { north: 48.49, south: 45.47, east: 30.13, west: 26.62 },
            'Azerbaijan': { north: 41.90, south: 38.40, east: 50.37, west: 44.77 },
            'Georgia': { north: 43.57, south: 41.05, east: 46.64, west: 40.00 },
            'Armenia': { north: 41.30, south: 38.84, east: 46.77, west: 43.45 },
            'Uzbekistan': { north: 45.59, south: 37.18, east: 73.14, west: 56.00 },
            'Kyrgyzstan': { north: 43.26, south: 39.17, east: 80.28, west: 69.27 },
            'Tajikistan': { north: 41.04, south: 36.67, east: 75.14, west: 67.34 },
            'Turkmenistan': { north: 42.79, south: 35.14, east: 66.68, west: 52.44 },
            'Pakistan': { north: 37.09, south: 23.69, east: 77.84, west: 60.87 },
            'Bangladesh': { north: 26.63, south: 20.74, east: 92.67, west: 88.03 },
            'Sri Lanka': { north: 9.83, south: 5.92, east: 81.88, west: 79.65 },
            'Myanmar': { north: 28.54, south: 9.78, east: 101.17, west: 92.19 },
            'Saudi Arabia': { north: 32.15, south: 16.38, east: 55.67, west: 34.49 },
            'UAE': { north: 26.08, south: 22.63, east: 56.38, west: 51.58 },
            'Oman': { north: 26.39, south: 16.65, east: 59.84, west: 51.88 },
            'Qatar': { north: 26.18, south: 24.48, east: 51.64, west: 50.75 },
            'Kuwait': { north: 30.10, south: 28.52, east: 48.43, west: 46.55 },
            'Bahrain': { north: 26.29, south: 25.79, east: 50.82, west: 50.45 },
            'Lebanon': { north: 34.69, south: 33.05, east: 36.63, west: 35.10 },
            'Jordan': { north: 33.37, south: 29.19, east: 39.30, west: 34.95 },
            'Egypt': { north: 31.67, south: 22.00, east: 36.90, west: 24.70 },
            'Iraq': { north: 37.38, south: 29.06, east: 48.57, west: 38.79 },
            'Iran': { north: 39.78, south: 25.06, east: 63.32, west: 44.03 },
            'Yemen': { north: 19.00, south: 12.11, east: 54.54, west: 41.81 },
            'Syria': { north: 37.32, south: 32.31, east: 42.37, west: 35.73 },
            'Afghanistan': { north: 38.49, south: 29.38, east: 74.89, west: 60.52 },
            'Cyprus': { north: 35.70, south: 34.63, east: 34.60, west: 32.27 },
            'Mongolia': { north: 52.15, south: 41.56, east: 119.94, west: 87.73 },
            'Singapore': { north: 1.47, south: 1.26, east: 104.01, west: 103.64 },
            'Cambodia': { north: 14.69, south: 10.41, east: 107.64, west: 102.33 },
            'Laos': { north: 22.50, south: 13.91, east: 107.70, west: 100.09 },
            'Nepal': { north: 30.45, south: 26.36, east: 88.20, west: 80.06 },
            'Albania': { north: 42.66, south: 39.65, east: 21.06, west: 19.27 },
            'Bosnia': { north: 45.27, south: 42.55, east: 19.62, west: 15.73 },
            'Serbia': { north: 46.19, south: 41.86, east: 23.01, west: 18.86 },
            'Kosovo': { north: 43.27, south: 41.86, east: 21.78, west: 20.01 },
            'North Macedonia': { north: 42.37, south: 40.86, east: 23.03, west: 20.46 },
            'Montenegro': { north: 43.57, south: 41.85, east: 20.36, west: 18.46 },
            'Iceland': { north: 66.53, south: 63.30, east: -13.49, west: -24.32 },
            'Luxembourg': { north: 50.18, south: 49.45, east: 6.53, west: 5.73 },
            'Malta': { north: 36.08, south: 35.79, east: 14.58, west: 14.18 },
            'Paraguay': { north: -19.29, south: -27.61, east: -54.25, west: -62.65 },
            'Uruguay': { north: -30.08, south: -34.98, east: -53.07, west: -58.44 },
            'Bolivia': { north: -9.68, south: -22.90, east: -57.45, west: -69.65 },
            'Ecuador': { north: 1.44, south: -5.00, east: -75.19, west: -81.01 },
            'Venezuela': { north: 12.20, south: 0.64, east: -59.80, west: -73.35 },
            'Panama': { north: 9.63, south: 7.20, east: -77.17, west: -83.05 },
            'Costa Rica': { north: 11.22, south: 8.03, east: -82.55, west: -85.95 },
            'Nicaragua': { north: 15.03, south: 10.71, east: -82.73, west: -87.69 },
            'Honduras': { north: 16.51, south: 12.98, east: -83.15, west: -89.35 },
            'El Salvador': { north: 14.45, south: 13.15, east: -87.68, west: -90.13 },
            'Guatemala': { north: 17.82, south: 13.74, east: -88.23, west: -92.23 },
            'Dominican Republic': { north: 19.93, south: 17.54, east: -68.32, west: -72.01 },
            'Haiti': { north: 20.09, south: 18.02, east: -71.62, west: -74.48 },
            'Jamaica': { north: 18.53, south: 17.70, east: -76.19, west: -78.37 },
            'Cuba': { north: 23.23, south: 19.82, east: -74.13, west: -84.95 },
            'Tunisia': { north: 37.35, south: 30.23, east: 11.60, west: 7.52 },
            'Algeria': { north: 37.09, south: 18.96, east: 12.00, west: -8.67 },
            'Morocco': { north: 35.92, south: 27.66, east: -1.12, west: -13.17 },
            'Sudan': { north: 22.23, south: 8.68, east: 38.58, west: 21.82 },
            'Ethiopia': { north: 14.89, south: 3.40, east: 47.98, west: 32.99 },
            'Kenya': { north: 5.02, south: -4.72, east: 41.91, west: 33.91 },
            'Tanzania': { north: -0.99, south: -11.75, east: 40.44, west: 29.33 },
            'Uganda': { north: 4.23, south: -1.48, east: 35.03, west: 29.57 },
            'Rwanda': { north: -1.05, south: -2.84, east: 30.90, west: 28.86 },
            'Ghana': { north: 11.17, south: 4.74, east: 1.19, west: -3.26 },
            'Nigeria': { north: 13.89, south: 4.27, east: 14.68, west: 2.67 },
            'Senegal': { north: 16.69, south: 12.31, east: -11.34, west: -17.54 },
            'Madagascar': { north: -11.95, south: -25.61, east: 50.48, west: 43.22 },
            'Mozambique': { north: -10.47, south: -26.87, east: 40.84, west: 30.21 },
            'Angola': { north: -4.37, south: -18.04, east: 24.08, west: 11.67 },
            'Namibia': { north: -16.96, south: -28.97, east: 25.26, west: 11.73 },
            'Zimbabwe': { north: -15.61, south: -22.42, east: 33.06, west: 25.24 },
            'Botswana': { north: -17.78, south: -26.91, east: 29.38, west: 20.00 },
            'Zambia': { north: -8.22, south: -18.08, east: 33.71, west: 21.99 },
            'Malawi': { north: -9.37, south: -17.13, east: 35.92, west: 32.67 },
            'Papua New Guinea': { north: -1.32, south: -11.65, east: 155.96, west: 140.84 },
            'Solomon Islands': { north: -6.59, south: -11.85, east: 166.98, west: 155.51 },
            'Fiji': { north: -16.02, south: -19.15, east: -178.42, west: 177.27 },
            'Vanuatu': { north: -13.07, south: -20.25, east: 170.23, west: 166.52 },
            'Samoa': { north: -13.43, south: -14.05, east: -171.41, west: -172.80 }
        };
        return bounds[country] || null;
    }

    function initialize() {
        console.log('[OpenSnitch Pro] Initializing with multi-API support...');
        showLocationInfo();

        // Primary location interval
        setInterval(checkForLocationChanges, 500);

        // Mutation observer for DOM changes
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'src' ||
                    mutation.target.id === 'PanoramaIframe') {
                    checkForLocationChanges();
                }
            }
        });

        observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: ['src'],
            childList: true
        });

        console.log('[OpenSnitch Pro] Initialization complete');
    }

    initialize();
})();