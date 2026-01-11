// ==UserScript==
// @name         Humpty-Dumpty's Property Manager
// @version      2.1.0
// @author       Humpty-Dumpty[2527857]
// @description  Property management tools for the Torn City game
// @license      MIT
// @include      https://www.torn.com/properties.php
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_getValues
// @namespace https://greasyfork.org/users/723212
// @downloadURL https://update.greasyfork.org/scripts/543004/Humpty-Dumpty%27s%20Property%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/543004/Humpty-Dumpty%27s%20Property%20Manager.meta.js
// ==/UserScript==

(function() {
    const State = {
        START_UP: 0,
        INIT_API_KEY_IN_PROGRESS: 1,
        INIT_API_KEY_COMPLETE: 2,
        INIT_KEY_OWNER_IN_PROGRESS: 3,
        INIT_KEY_OWNER_COMPLETE: 4,
        INIT_OWNED_PROPERTIES_IN_PROGRESS: 5,
        INIT_OWNED_PROPERTIES_COMPLETE: 6,
        INIT_URL_WATCHERS_IN_PROGRESS: 7,
        WAITING_FOR_URL_MATCH: 8,
        FOUND_URL_OFFER_EXTENTION_MATCH_TO_PROCESS: 9,
        PROCESSING_URL_MATCH: 10,
        HAS_PROCESSED_PROP_TITLE: 11,
        HAS_PROCESSED_PROP_COST: 12,
        HAS_PROCESSED_PROP_DAYS: 13,
        HAS_PROCESSED_PROP_COST_LABEL: 14,
        FOUND_URL_LEASE_NEW_PROPERTY_MATCH_TO_PROCESS: 15,
        PROCESSING_URL_LEASE_NEW_PROPERTY_MATCH: 16,
        HAS_FOUND_ADD_PROP_MARKET_DIV: 17,
        HAS_FETCHED_PROPERTY_INFO_ADD_MARKET: 18,
        HAS_PROCESSED_ADD_PROP_MARKET_COST: 19,
    };

    let CurrentState = State.START_UP;

    function decorateLogString(rawMessage) {
        return `HDPM: ` + rawMessage
    }

    function logInfo(rawMessage) {
        console.info(decorateLogString(rawMessage));
    }

    function logError(rawMessage) {
        console.error(decorateLogString(rawMessage));
    }

    function logStorageInfo() {
        const keys = GM_listValues();
        // logInfo(`GM_listValues(): ${JSON.stringify(keys)}`);
        const values = GM_getValues(keys);
        logInfo(`GM storage: ${JSON.stringify(values)}`);
    }

    function addCSS() {
        let css = document.createElement("style");
        css.innerHTML = `
        .centeredDivPropertyManangerUserScript {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            margin: 5px;
            padding: 5px;
            border: 5px solid red;
            background: rgba(128,128,128,1.0);
            z-index: 100000000;
        }
        .btnPropertyManangerUserScript {
            background-color: green;
            color: white;
            text-align: center;
            border-radius: 8px;
            margin: 5px;
        }
        `
        document.head.appendChild(css);
    }

    function handleSaveBtn() {
        const apiKeyContainer = document.querySelector('#getApiKeyContainer');
        const textInput = document.querySelector('#apiKeyInput');

        if (! textInput.value) {
            return;
        }

        if (textInput.value.length < 1) {
            return;
        }

        const api_key = textInput.value;
        GM_setValue('API_KEY', api_key);
        apiKeyContainer.parentNode.removeChild(apiKeyContainer);

        CurrentState = State.INIT_API_KEY_COMPLETE;
    }

    function initApiKey() {
        CurrentState = State.INIT_API_KEY_IN_PROGRESS;

        logStorageInfo();
        if (! GM_getValue('API_KEY', null)) {
            logInfo(`create input for api key`);
            addCSS();
            let newSideBarContainer = document.createElement('div');
            newSideBarContainer.id = 'getApiKeyContainer';
            newSideBarContainer.classList.add('centeredDivPropertyManangerUserScript');

            let titleContainer = document.createElement('div');
            let title = document.createTextNode('Humpty-Dumpty\'s Property Manager');
            titleContainer.appendChild(title);
            newSideBarContainer.appendChild(titleContainer);

            let apiInputContainer = document.createElement('div');
            let newInput = document.createElement('input');
            newInput.id = 'apiKeyInput';
            newInput.type = 'text';
            newInput.placeholder = 'FULL_ACCESS_API_KEY';

            let newButton = document.createElement('button');
            newButton.type = 'button';
            newButton.innerText = 'SAVE';
            newButton.classList.add('btnPropertyManangerUserScript');
            newButton.addEventListener('click', handleSaveBtn);

            apiInputContainer.appendChild(newInput);
            apiInputContainer.appendChild(newButton);
            newSideBarContainer.appendChild(apiInputContainer);

            document.body.appendChild(newSideBarContainer);
        } else {
            CurrentState = State.INIT_API_KEY_COMPLETE;
        }

        logStorageInfo();
    }

    async function fetchKeyOwnerInfo() {
        const api_key = GM_getValue('API_KEY', null);
        if (! api_key) {
            throw new Error(`No API_KEY`);
        }

        const url = `https://api.torn.com/v2/key/info?key=${api_key}`;

        let response = undefined;
        let errorMessage = undefined;
        
        try {
            response = await window.fetch(url);
        } catch (error) {
            errorMessage = `Other error: ${JSON.stringify(error)}`;
        } finally {
            if (errorMessage) {
                throw new Error(errorMessage);
            }

            if (! response) {
                throw new Error(`Unknown error`);
            }

            if (response.status !== 200) {
                throw new Error(`Non 200 response: status=${response.status} statusText=${response.statusText}`);
            }
        }

        let resBody = undefined;
        try {
            resBody = await response.json();
        } catch (error) {
            throw new Error(`Error trying to get json from response`);
        }

        if (resBody.error) {
            throw new Error(`Torn Error response: ${JSON.stringify(resBody)}`);
        }

        // {
        //     ...
        //     "info": {
        //         "access": {
        //             "level": 4,
        //             "type": "Full Access",
        //             "faction": true,
        //             "faction_id": 1234,
        //             "company": true,
        //             "company_id": 12345
        //         },
        //         "user": {
        //             "id": 123456,
        //             "faction_id": 1234,
        //             "company_id": 12345
        //         }
        //     }
        // }

        if (!resBody?.info?.user?.id) {
            throw new Error(`Torn API key info response missing information: ${JSON.stringify(resBody)}`);
        }

        return resBody;
    }

    async function initKeyOwnerInfo() {
        CurrentState = State.INIT_KEY_OWNER_IN_PROGRESS;

        const apiKeyOwnerId = GM_getValue('API_KEY_OWNER_ID', null);
        if (apiKeyOwnerId) {
            logInfo(`initKeyOwnerInfo(): apiKeyOwnerId=${apiKeyOwnerId}`);
            CurrentState = State.INIT_KEY_OWNER_COMPLETE;
            return;
        }

        const keyInfoResponseBody = await fetchKeyOwnerInfo();
        GM_setValue('API_KEY_OWNER_ID', keyInfoResponseBody.info.user.id);
        logStorageInfo();

        CurrentState = State.INIT_KEY_OWNER_COMPLETE;
    }

    function getTimestampNow() {
        return Math.floor(Date.now() / 1000);
    }

    async function fetchOwnedProperties(apiKey, offset, limit) {
        const url = `https://api.torn.com/v2/user/properties?offset=${offset}&limit=${limit}&key=${apiKey}`;

        let response = undefined;
        let errorMessage = undefined;
        
        try {
            response = await window.fetch(url);
        } catch (error) {
            errorMessage = `Other error: ${JSON.stringify(error)}`;
        } finally {
            if (errorMessage) {
                throw new Error(errorMessage);
            }

            if (! response) {
                throw new Error(`Unknown error`);
            }

            if (response.status !== 200) {
                throw new Error(`Non 200 response: status=${response.status} statusText=${response.statusText}`);
            }
        }

        let resBody = undefined;
        try {
            resBody = await response.json();
        } catch (error) {
            throw new Error(`Error trying to get json from response`);
        }

        if (resBody?.error) {
            throw new Error(`Torn Error response: ${JSON.stringify(resBody)}`);
        }

        // {
        //     "properties": [
        //         {
        //             ...
        //             "id": 123456,
        //             "owner": {
        //                 "id": 1073741824,
        //                 "name": "string"
        //             },
        //             "property": {
        //                 "id": 1073741824,
        //                 "name": "string"
        //             },
        //             "status": "rented",           // "none" | "rented" | "in_use" | "for_rent",
        //             "rental_period": 50,          // only when status === "rented"
        //             "rental_period_remaining": 28 // only when status === "rented"
        //             ...
        //         }
        //     ]
        // }

        if (!resBody?.properties) {
            throw new Error(`Torn owned properties response missing property: 'properties':  ${JSON.stringify(resBody)}`);
        }

        if (resBody.properties.length) {
            for (let i = 0; i < resBody.properties.length; i++) {
                const property = resBody.properties[i];
                if (!property.id || !property.owner?.id || !property.property?.id || !property.status) {
                    throw new Error(`Torn owned properties.property[${i}] response missing information: ${JSON.stringify(property)}`);
                }

                if (property.status === "rented") {
                    if (!property.rental_period || !property.rental_period_remaining) {
                        throw new Error(`Torn owned properties.property[${i}] response missing rented information: ${JSON.stringify(property)}`);
                    }
                }
            }
        }

        return resBody.properties;
    }

    async function getAllOwnedProperties(apiKey, apiKeyOwnerId) {
        const fetchLimit = 100;
        let queryOffset = 0;

        const ownedProperties = [];

        let finishedFetchingProperties = false;
        while (! finishedFetchingProperties) {
            const fetchedProperties = await fetchOwnedProperties(apiKey, queryOffset, fetchLimit);
            logInfo(`initOwnedProperties(): fetched ${fetchedProperties.length} more (potentially) owned properties`);

            for (const property of fetchedProperties) {
                if (property.owner.id !== apiKeyOwnerId) {
                    // API key owner does now own the property (their spouse might own it or they rent it)
                    continue;
                }

                const propertyStatusesExcludingInUse = ["none", "rented", "for_rent"];
                if (! propertyStatusesExcludingInUse.includes(property.status)) {
                    // The property is lived in by either the API key owner or their spouse
                    logInfo(`getAllOwnedProperties(): property not possible to rent: ${JSON.stringify(property)}`);
                    continue;
                }

                ownedProperties.push(property);
            }
            
            if (fetchedProperties.length < fetchLimit) {
                finishedFetchingProperties = true;
            }
        }

        return ownedProperties;
    }

    // propertiesWithLogs:
    //
    // {
    //     [property.id] = {
    //         property: property,
    //         rentMarketAcceptLog: undefined,
    //         lastRentExtensionAcceptLog: undefined
    //     }
    // }
    function getLongestDaysSinceRentalStart(propertiesWithLogs) {
        let currentLongest = 0;

        for (const propertyWithLogs of Object.values(propertiesWithLogs)) {
            const property = propertyWithLogs.property;
            if (property.status !== "rented") {
                // not rented out so has no days rented
                continue;
            }

            const daysSinceFirstRented = property.rental_period - property.rental_period_remaining;
            if (currentLongest < daysSinceFirstRented) {
                //logInfo(`getLongestDaysSinceRentalStart(): new longest: ${JSON.stringify(property)}`);
                currentLongest = daysSinceFirstRented;
            }
        }

        return currentLongest;
    }

    async function fetchRentOutLogs(apiKey, limit, timeStampTo = undefined) {
        const timeStampToQueryParam = timeStampTo ? `&to=${timeStampTo}` : '';
        const url = `https://api.torn.com/v2/user?selections=log&log=5937${timeStampToQueryParam}&limit=${limit}&key=${apiKey}`

        let response = undefined;
        let errorMessage = undefined;
        
        try {
            response = await window.fetch(url);
        } catch (error) {
            errorMessage = `Other error: ${JSON.stringify(error)}`;
        } finally {
            if (errorMessage) {
                throw new Error(errorMessage);
            }

            if (! response) {
                throw new Error(`Unknown error`);
            }

            if (response.status !== 200) {
                throw new Error(`Non 200 response: status=${response.status} statusText=${response.statusText}`);
            }
        }

        let resBody = undefined;
        try {
            resBody = await response.json();
        } catch (error) {
            throw new Error(`Error trying to get json from response`);
        }

        if (resBody?.error) {
            throw new Error(`Torn Error response: ${JSON.stringify(resBody)}`);
        }

    // {
    //     "log": [
    //         {
    //             "id":"DWxCqNKeXlhHK7OSUZIq",
    //             "log": 5937,
    //             "title": "Property rental market rent owner",
    //             "timestamp": 1752710120,
    //             "category": "Property",
    //             "data": {
    //                 "property": 13,
    //                 "property_id": 5527541,
    //                 "rent": 6500000,
    //                 "days": 10,
    //                 "happy": 3600,
    //                 "renter": 3797479
    //             },
    //             "params": {
    //                 "italic": 1,
    //                 "color": "green"
    //             }
    //         },
    //     ]
    // }

        if (!resBody?.log) {
            throw new Error(`Torn rent logs response missing property: 'log':  ${JSON.stringify(resBody)}`);
        }


        for (const log of resBody.log) {
            if (!log.id ||
                !log.timestamp ||
                !log.data?.property_id ||
                !log.data?.rent ||
                !log.data?.days ||
                !log.data?.renter) {
                throw new Error(`Torn rent log missing information: log=${JSON.stringify(log)}`);
            }
        }

        return resBody.log;
    }

    function logCompareFn(a, b) {
    if (a.timestamp > b.timestamp) {
        return -1;
    } else if (a.timestamp < b.timestamp) {
        return 1;
    }
    // a must be equal to b
    return 0;
    }

    // ownedPropertiesWithLogs:
    //
    // {
    //     [property.id] = {
    //         property: property,
    //         rentMarketAcceptLog: undefined,
    //         lastRentExtensionAcceptLog: undefined
    //     }
    // }
    async function annotatePropertiesWithInitialRentLog(apiKey, ownedPropertiesWithLogs, oldestLogTimestampToCheckUpto) {
        let finishedFetching = false;
        let nextLogsToTimestamp = undefined;
        let alreadyFetchedLogHashes = new Set();
        while (!finishedFetching) {
            const msg = `fetching more logs, nextLogsToTimestamp=${nextLogsToTimestamp}`;
            logInfo(`annotatePropertiesWithInitialRentLog(): ${msg}`);

            const fetchedLogs = await fetchRentOutLogs(apiKey, 100, nextLogsToTimestamp);
            fetchedLogs.sort(logCompareFn);

            // If no logs are fetched, assume there are no more to fetch.
            if (! fetchedLogs.length) {
                logInfo(`annotatePropertiesWithInitialRentLog(): no logs fetched, stopping`);
                finishedFetching = true;
                continue;
            }

            // If no new unique logs were fetched, assume there are no more to fetch.
            // This is to handle the edge case where the same logs are fetched with the
            // old timestamp - 1 .
            const fetchedLogsHashesSet = new Set(fetchedLogs.map(log => log.id));
            const newUniqueLogHashes = fetchedLogsHashesSet.difference(alreadyFetchedLogHashes);
            if (! newUniqueLogHashes.size) {
                logInfo(`annotatePropertiesWithInitialRentLog(): no new unique logs fetched, stopping`);
                finishedFetching = true;
                continue;
            }
            alreadyFetchedLogHashes = alreadyFetchedLogHashes.union(newUniqueLogHashes);

            // Add market rent accept log to owned properts
            for (const log of fetchedLogs) {
                const propertyId = log.data.property_id;

                if (! ownedPropertiesWithLogs[propertyId]) {
                    // Property from log seems to no longer be owned
                    logInfo(`annotatePropertiesWithInitialRentLog(): property for log no longer owned by player? log=${JSON.stringify(log)}`);
                    continue;
                }

                if (ownedPropertiesWithLogs[propertyId].rentMarketAcceptLog) {
                    // Property already has a market rent accept log.
                    // As fetchedLogs is newest first, the first log set should always
                    // be the newest. Assume this log is older and ignore it.
                    
                    //logInfo(`annotatePropertiesWithInitialRentLog(): older log found for property? log=${JSON.stringify(log)}`);
                    continue;
                }

                // If the property status is not "rented" then ignore it (no valid market rent accept log)
                if (ownedPropertiesWithLogs[propertyId].property.status !== "rented") {
                    logInfo(`annotatePropertiesWithInitialRentLog(): log found for property not rented? log=${JSON.stringify(log)}`);
                    continue;
                }

                ownedPropertiesWithLogs[propertyId].rentMarketAcceptLog = log;
            }

            // Update nextLogsToTimestamp with (oldestTimestamp - 1), so the next fetch
            // should include the last timestamp, just in case there are multiple logs with
            // the same timestamp spanning multiple fetches.
            const oldestLog = fetchedLogs[fetchedLogs.length - 1];
            const oldestLogTimestamp = oldestLog.timestamp;
            nextLogsToTimestamp = oldestLogTimestamp - 1;

            // If no properties with status === "rented" are missing the
            // rentMarketAcceptLog, then we can stop fetching.
            let anyMissingRentMarketAcceptLog = false;
            for (const propertyWithLogs of Object.values(ownedPropertiesWithLogs)) {
                // Not rented, so not having a rent accept log is fine
                if (propertyWithLogs.property.status !== "rented") {
                    continue;
                }

                if (! propertyWithLogs.rentMarketAcceptLog) {
                    anyMissingRentMarketAcceptLog = true;
                    break;
                }
            }

            if (!anyMissingRentMarketAcceptLog) {
                logInfo(`annotatePropertiesWithInitialRentLog(): all rented properties have a market rent accept log, stopping`);
                finishedFetching = true;
                continue;
            }

            // If the oldest fetched log is older than the <oldestLogTimestampToCheckUpto>
            // function argument then stop fetching.
            if (oldestLogTimestamp < oldestLogTimestampToCheckUpto) {
                const msg = ` property may never have been rented or is 'for rent'?`;
                logInfo(`annotatePropertiesWithInitialRentLog(): reached oldestLogTimestampToCheckUpto: ${msg}`);
                finishedFetching = true;
                continue;
            }
        }
    }

    async function fetchLastRentExtensionLogs(apiKey, limit, timeStampTo = undefined) {
        const timeStampToQueryParam = timeStampTo ? `&to=${timeStampTo}` : '';
        const url = `https://api.torn.com/v2/user?selections=log&log=5943${timeStampToQueryParam}&limit=${limit}&key=${apiKey}`

        let response = undefined;
        let errorMessage = undefined;
        
        try {
            response = await window.fetch(url);
        } catch (error) {
            errorMessage = `Other error: ${JSON.stringify(error)}`;
        } finally {
            if (errorMessage) {
                throw new Error(errorMessage);
            }

            if (! response) {
                throw new Error(`Unknown error`);
            }

            if (response.status !== 200) {
                throw new Error(`Non 200 response: status=${response.status} statusText=${response.statusText}`);
            }
        }

        let resBody = undefined;
        try {
            resBody = await response.json();
        } catch (error) {
            throw new Error(`Error trying to get json from response`);
        }

        if (resBody?.error) {
            throw new Error(`Torn Error response: ${JSON.stringify(resBody)}`);
        }

    // {
    //     "log": {
    //         {
    //             "id":"gtdRr0MKh1SICvEtyvgG"
    //             "log": 5943,
    //             "title": "Property rental market extension accept owner",
    //             "timestamp": 1753089720,
    //             "category": "Property",
    //             "data": {
    //                 "property": 13,
    //                 "property_id": 123633,
    //                 "rent": 9500000,
    //                 "days": 10,
    //                 "happy": 4275,
    //                 "renter": 12345
    //             },
    //             "params": {
    //                 "italic": 1,
    //                 "color": "green"
    //             }
    //         },
    //     }
    // }

        if (!resBody?.log) {
            throw new Error(`Torn rent extension logs response missing property: 'log':  ${JSON.stringify(resBody)}`);
        }


        for (const log of resBody.log) {
            if (!log.id ||
                !log.timestamp ||
                !log.data?.property_id ||
                !log.data?.rent ||
                !log.data?.days ||
                !log.data?.renter) {
                throw new Error(`Torn rent extension log missing information: logId=${logId} log=${JSON.stringify(log)}`);
            }
        }

        return resBody.log;
    }

    // ownedPropertiesWithLogs:
    //
    // {
    //     [property.id] = {
    //         property: property,
    //         rentMarketAcceptLog: undefined,
    //         lastRentExtensionAcceptLog: undefined
    //     }
    // }
    async function annotatePropertiesWithLastRentExtentionLog(apiKey, ownedPropertiesWithLogs, oldestLogTimestampToCheckUpto) {
        let finishedFetching = false;
        let nextLogsToTimestamp = undefined;
        let alreadyFetchedLogHashes = new Set();
        while (!finishedFetching) {
            const msg = `fetching more logs, nextLogsToTimestamp=${nextLogsToTimestamp}`;
            logInfo(`annotatePropertiesWithLastRentExtentionLog(): ${msg}`);

            const fetchedLogs = await fetchLastRentExtensionLogs(apiKey, 100, nextLogsToTimestamp);
            fetchedLogs.sort(logCompareFn);

            // If no logs are fetched, assume there are no more to fetch.
            if (! fetchedLogs.length) {
                logInfo(`annotatePropertiesWithLastRentExtentionLog(): no logs fetched, stopping`);
                finishedFetching = true;
                continue;
            }

            // If no new unique logs were fetched, assume there are no more to fetch.
            // This is to handle the edge case where the same logs are fetched with the
            // old timestamp - 1 .
            const fetchedLogsHashesSet = new Set(fetchedLogs.map(log => log.id));
            const newUniqueLogHashes = fetchedLogsHashesSet.difference(alreadyFetchedLogHashes);
            if (! newUniqueLogHashes.size) {
                logInfo(`annotatePropertiesWithLastRentExtentionLog(): no new unique logs fetched, stopping`);
                finishedFetching = true;
                continue;
            }
            alreadyFetchedLogHashes = alreadyFetchedLogHashes.union(newUniqueLogHashes);

            // Add rent extension log to owned properts
            for (const log of fetchedLogs) {
                const propertyId = log.data.property_id;

                if (! ownedPropertiesWithLogs[propertyId]) {
                    // Property from log seems to no longer be owned
                    logInfo(`annotatePropertiesWithLastRentExtentionLog(): property for log no longer owned by player? log=${JSON.stringify(log)}`);
                    continue;
                }

                if (ownedPropertiesWithLogs[propertyId].lastRentExtensionAcceptLog) {
                    // Property already has a rent extension accept log.
                    // As fetchedLogs is newest first, the first log set should always
                    // be the newest. Assume this log is older and ignore it.
                    
                    //logInfo(`annotatePropertiesWithLastRentExtentionLog(): older log found for property? log=${JSON.stringify(log)}`);
                    continue;
                }

                // If the property status is not "rented" then ignore it (no valid rent extension log)
                if (ownedPropertiesWithLogs[propertyId].property.status !== "rented") {
                    logInfo(`annotatePropertiesWithLastRentExtentionLog(): log found for property not rented? log=${JSON.stringify(log)}`);
                    continue;
                }

                // Ignore rent extension logs older than when the market rent offer was accepted.
                // These are probably for the previous tenant.
                console.dir(ownedPropertiesWithLogs[propertyId]);
                if (log.timestamp < ownedPropertiesWithLogs[propertyId].rentMarketAcceptLog.timestamp) {
                    logInfo(`annotatePropertiesWithLastRentExtentionLog(): log older than rent start? log=${JSON.stringify(log)}`);
                    continue;
                }

                ownedPropertiesWithLogs[propertyId].lastRentExtensionAcceptLog = log;
            }

            // Update nextLogsToTimestamp with (oldestTimestamp - 1), so the next fetch
            // should include the last timestamp, just in case there are multiple logs with
            // the same timestamp spanning multiple fetches.
            const oldestLog = fetchedLogs[fetchedLogs.length - 1];
            const oldestLogTimestamp = oldestLog.timestamp;
            nextLogsToTimestamp = oldestLogTimestamp - 1;

            // If no properties with status === "rented" are missing the
            // lastRentExtensionAcceptLog, then we can stop fetching.
            //
            // Also if oldestLogTimestamp is older than any remaining propertys last
            // lastRentExtensionAcceptLog we can assume it has not yet had a rent extension
            let anyMissingRentExtensionLog = false;
            for (const propertyWithLogs of Object.values(ownedPropertiesWithLogs)) {
                // Not rented, so not having a rent extension log is fine
                if (propertyWithLogs.property.status !== "rented") {
                    continue;
                }

                // Oldest rental extension log is older than when this property was
                // innitially rented, so can ignore it.
                if (propertyWithLogs.rentMarketAcceptLog) {
                    if (oldestLogTimestamp < propertyWithLogs.rentMarketAcceptLog.timestamp) {
                        continue;
                    }
                }

                if (! propertyWithLogs.lastRentExtensionAcceptLog) {
                    anyMissingRentExtensionLog = true;
                    break;
                }
            }

            if (!anyMissingRentExtensionLog) {
                logInfo(`annotatePropertiesWithLastRentExtentionLog(): all rented properties have a market rent accept log, stopping`);
                finishedFetching = true;
                continue;
            }

            // If the oldest fetched log is older than the <oldestLogTimestampToCheckUpto>
            // function argument then stop fetching.
            if (oldestLogTimestamp < oldestLogTimestampToCheckUpto) {
                const msg = ` property unexpectedly has no rent extension log`;
                logInfo(`annotatePropertiesWithLastRentExtentionLog(): reached oldestLogTimestampToCheckUpto: ${msg}`);
                finishedFetching = true;
                continue;
            }
        }
    }

    async function initOwnedProperties() {
        CurrentState = State.INIT_OWNED_PROPERTIES_IN_PROGRESS;

        const apiKey = GM_getValue('API_KEY', null);
        if (! apiKey) {
            logError(`initOwnedProperties(): No API_KEY`);
            return;
        }

        const apiKeyOwnerId = GM_getValue('API_KEY_OWNER_ID', null);
        if (! apiKeyOwnerId) {
            logError(`initOwnedProperties(): No API_KEY_OWNER_ID`);
            return;
        }

        const lastOwnedPropertiesUpdateTime = GM_getValue('LAST_OWNED_PROPERTIES_UPDATE_TIME', null);
        const currentTime = getTimestampNow();
        if (lastOwnedPropertiesUpdateTime) {
            const dayInSeconds = 60 * 60 * 24;
            const needUpdate = dayInSeconds < (currentTime - lastOwnedPropertiesUpdateTime);
            if (! needUpdate) {
                logInfo(`It's been less than a day since the last update of owned properties: not updating owned properties`);
                CurrentState = State.INIT_OWNED_PROPERTIES_COMPLETE;
                return;
            }
        }

        logInfo(`initOwnedProperties(): updating owned properties now...`);
        const ownedProperties = await getAllOwnedProperties(apiKey, apiKeyOwnerId);
        logInfo(`initOwnedProperties(): ownedProperties=${JSON.stringify(ownedProperties)}`);

        const ownedPropertiesWithLogs = {};
        for (const property of ownedProperties) {
            ownedPropertiesWithLogs[property.id] = {
                property: property,
                rentMarketAcceptLog: undefined,
                lastRentExtensionAcceptLog: undefined
            };
        }

        const longestDaysSinceRentalStart = getLongestDaysSinceRentalStart(ownedPropertiesWithLogs);
        logInfo(`initOwnedProperties(): longestDaysSinceRentalStart=${longestDaysSinceRentalStart}`);
        const oldestLogTimestampToCheckUpto = getTimestampNow() - ((longestDaysSinceRentalStart + 2) * 60 * 60 * 24);
        logInfo(`initOwnedProperties(): oldestLogTimestampToCheckUpto=${oldestLogTimestampToCheckUpto}`);

        await annotatePropertiesWithInitialRentLog(apiKey, ownedPropertiesWithLogs, oldestLogTimestampToCheckUpto);
        await annotatePropertiesWithLastRentExtentionLog(apiKey, ownedPropertiesWithLogs, oldestLogTimestampToCheckUpto);

        console.dir(ownedPropertiesWithLogs);

        GM_setValue('LAST_OWNED_PROPERTIES_UPDATE_TIME', currentTime);
        GM_setValue('OWNED_PROPERTIES_WITH_LOGS', ownedPropertiesWithLogs);

        CurrentState = State.INIT_OWNED_PROPERTIES_COMPLETE;
    }

    async function fetchPropertyInformation(propertyId, expectCurrentlyHasTenant) {
        const api_key = GM_getValue('API_KEY', null);
        if (! api_key) {
            throw new Error(`No API_KEY`);
        }

        const url = `https://api.torn.com/property/${propertyId}?key=${api_key}`;

        let response = undefined;
        let errorMessage = undefined;
        
        try {
            response = await window.fetch(url);
        } catch (error) {
            errorMessage = `Other error: ${JSON.stringify(error)}`;
        } finally {
            if (errorMessage) {
                throw new Error(errorMessage);
            }

            if (! response) {
                throw new Error(`Unknown error`);
            }

            if (response.status !== 200) {
                throw new Error(`Non 200 response: status=${response.status} statusText=${response.statusText}`);
            }
        }

        let resBody = undefined;
        try {
            resBody = await response.json();
        } catch (error) {
            throw new Error(`Error trying to get json from response`);
        }

        if (resBody.error) {
            throw new Error(`Torn Error response: ${JSON.stringify(resBody)}`);
        }

        // {
        //     "property": {
        //         "owner_id": 2527857,
        //         "property_type": 13,
        //         "happy": 5025,
        //         "upkeep": 100000,
        //         "upgrades": [
        //             "Airstrip",
        //         ],
        //         "staff": [
        //             "Pilot"
        //         ],
        //         "rented": {
        //             "user_id": 1234567,
        //             "days_left": 8,
        //             "total_cost": 142500000,
        //             "cost_per_day": 950000
        //         },
        //         "users_living": "1234567,1234568"
        //     }
        // }

        if ((expectCurrentlyHasTenant && !resBody?.property?.rented?.days_left) ||
            (expectCurrentlyHasTenant && !resBody?.property?.rented?.total_cost) ||
            !resBody?.property?.happy ||
            !resBody?.property?.upgrades ||
            !resBody?.property?.property_type) {
            throw new Error(`Torn property response missing information: ${JSON.stringify(resBody)}`);
        }

        return resBody;
    }

    async function setAddRentalMarketPropertyPrices() {
        CurrentState = State.PROCESSING_URL_LEASE_NEW_PROPERTY_MATCH;
        logInfo(`setAddRentalMarketPropertyPrices(): START`);

        const regEx = /#\/p=options&ID=(.+)&tab=lease$/;
        const matchArray = regEx.exec(location.hash);
        if (matchArray.length < 2) {
            logError(`could not find property Id in location hash (${location.hash})`);
            return;
        }

        const propertyId = matchArray[1];
        logInfo(`propertyId=${propertyId}`);

        let daysToLease = 10;
        let price = 999999999;

        if (CurrentState === State.PROCESSING_URL_LEASE_NEW_PROPERTY_MATCH) {
            const addToRentalMarketDiv = document.querySelector(`#market`);
            if (addToRentalMarketDiv && addToRentalMarketDiv.style.display === 'block') {
                CurrentState = State.HAS_FOUND_ADD_PROP_MARKET_DIV;
            } else {
                return; // early as have not navigated to 'add property to rental market' tab
            }
        }

        if (CurrentState === State.HAS_FOUND_ADD_PROP_MARKET_DIV) {
            const response = await fetchPropertyInformation(propertyId, false);
            const propertyGuide = getPropertyGuide(response.property);
            if (propertyGuide) {
                price = propertyGuide.suggestedDailyRent * 10;
            }

            CurrentState = State.HAS_FETCHED_PROPERTY_INFO_ADD_MARKET;
        }

        if (CurrentState === State.HAS_FETCHED_PROPERTY_INFO_ADD_MARKET) {
            const costInput = document.querySelector('#market .cost input[type="text"]:not([type=""]');
            costInput.value = getFormattedMoneyString(price);
            costInput.dispatchEvent(new Event('input', { bubbles: true }));
            costInput.dispatchEvent(new Event('change', { bubbles: true }));
            logInfo(`Set add property market lease cost to: ${getFormattedMoneyString(price)}`);

            CurrentState = State.HAS_PROCESSED_ADD_PROP_MARKET_COST;
        }

        if (CurrentState === State.HAS_PROCESSED_ADD_PROP_MARKET_COST) {
            const leaseDaysInput = document.querySelector(`#market .amount input[type="text"]:not([type=""]`);
            leaseDaysInput.value = daysToLease;
            leaseDaysInput.dispatchEvent(new Event('input', { bubbles: true }));
            leaseDaysInput.dispatchEvent(new Event('change', { bubbles: true }));
            logInfo(`Set lease days to: ${daysToLease}`);
        }

        CurrentState = State.WAITING_FOR_URL_MATCH;
    }

    function getPropertyGuide(property) {
        const propertyRentGuide = {
            13: [
                {
                    baseHappy: 2550,
                    suggestedDailyRent: 450000,
                    upgrades: [
                        "Standard interior",
                        "Large pool",
                        "Hottub",
                        "Sauna",
                        "Bar",
                        "Shooting range",
                        "Airstrip"
                    ]
                },
                {
                    baseHappy: 2725,
                    suggestedDailyRent: 600000,
                    upgrades: [
                        "Standard interior",
                        "Large pool",
                        "Extra large vault",
                        "Hottub",
                        "Sauna",
                        "Bar",
                        "Shooting range",
                        "Medical facility",
                        "Airstrip"
                    ]
                },
                {
                    baseHappy: 3600,
                    suggestedDailyRent: 650000,
                    upgrades: [
                        "Superior interior",
                        "Large pool",
                        "Hottub",
                        "Sauna",
                        "Bar",
                        "Shooting range",
                        "Medical facility",
                        "Airstrip"
                    ]
                },
                {
                    baseHappy: 3725,
                    suggestedDailyRent: 750000,
                    upgrades: [
                        "Superior interior",
                        "Large pool",
                        "Extra large vault",
                        "Hottub",
                        "Sauna",
                        "Bar",
                        "Shooting range",
                        "Medical facility",
                        "Airstrip"
                    ]
                },
                {
                    baseHappy: 4225,
                    suggestedDailyRent: 1000000,
                    upgrades: [
                        "Superior interior",
                        "Large pool",
                        "Extra large vault",
                        "Hottub",
                        "Sauna",
                        "Bar",
                        "Shooting range",
                        "Medical facility",
                        "Airstrip",
                        "Yacht"
                    ]
                }
            ]
        }

        let propertyGuide = undefined;

        if (propertyRentGuide[property.property_type]) {
            for (const info of propertyRentGuide[property.property_type]) {
                if (info.upgrades.length !== property.upgrades.length) {
                    continue;
                }

                let hasMissingUpgrade = false;
                for (const upgrade of info.upgrades) {
                    if (!property.upgrades.includes(upgrade)) {
                        hasMissingUpgrade = true;
                        break;
                    }
                }

                if (hasMissingUpgrade) {
                    continue;
                }

                propertyGuide = info;
                break;
            }
        }

        return propertyGuide;
    }

    function getFormattedMoneyString(number) {
        return number.toLocaleString("en-US");
    }

    async function setRentalExtensionPrices() {
        CurrentState = State.PROCESSING_URL_MATCH;
        logInfo(`setRentalExtensionPrices(): START`);

        const regEx = /#\/p=options&ID=(.+)&tab=offerExtension$/;
        const matchArray = regEx.exec(location.hash);
        if (matchArray.length < 2) {
            logError(`could not find property Id in location hash (${location.hash})`);
            return;
        }

        const propertyId = matchArray[1];
        logInfo(`propertyId=${propertyId}`);

        const response = await fetchPropertyInformation(propertyId, true);

        const propertyGuide = getPropertyGuide(response.property);

        let daysToExtend = 10;
        let price = 999999999;
        if (propertyGuide) {
            price = propertyGuide.suggestedDailyRent * 10;
        }

        if (response) {
            price = response.property.rented.cost_per_day * 10;
        }

        const allOwnedPropertiesWithLogs = GM_getValue("OWNED_PROPERTIES_WITH_LOGS", null);
        if (allOwnedPropertiesWithLogs) {
            console.dir(allOwnedPropertiesWithLogs[propertyId]);

            if (allOwnedPropertiesWithLogs[propertyId]?.rentMarketAcceptLog) {
                const marketRentAcceptLog = allOwnedPropertiesWithLogs[propertyId].rentMarketAcceptLog;

                daysToExtend = marketRentAcceptLog.data.days;
                price = marketRentAcceptLog.data.rent;
            }

            if (allOwnedPropertiesWithLogs[propertyId]?.lastRentExtensionAcceptLog) {
                const lastRentExtensionLog = allOwnedPropertiesWithLogs[propertyId]?.lastRentExtensionAcceptLog;
                daysToExtend = lastRentExtensionLog.data.days;
                price = lastRentExtensionLog.data.rent;
            }
        }

        if (CurrentState === State.PROCESSING_URL_MATCH) {
            const propertyTitleDiv = document.querySelector(`.property-info-cont div[role="heading"]`);
            const newSpan = document.createElement(`span`);
            newSpan.innerText = `(${propertyGuide.baseHappy}) Suggested: $${getFormattedMoneyString(propertyGuide.suggestedDailyRent)} / day`;
            newSpan.style.color = 'red';
            newSpan.style.marginLeft = '5px';
            newSpan.style.marginRight = '5px';
            propertyTitleDiv.appendChild(newSpan);

            CurrentState = State.HAS_PROCESSED_PROP_TITLE;
        }

        if (CurrentState === State.HAS_PROCESSED_PROP_TITLE) {
            const costInput = document.querySelector(`.offerExtension-input .cost input[type="text"]:not([type=""]`);
            costInput.value = getFormattedMoneyString(price);
            costInput.dispatchEvent(new Event('input', { bubbles: true }));
            costInput.dispatchEvent(new Event('change', { bubbles: true }));
            logInfo(`Set lease extension cost to: ${getFormattedMoneyString(price)}`);

            CurrentState = State.HAS_PROCESSED_PROP_COST;
        }

        if (CurrentState === State.HAS_PROCESSED_PROP_COST) {
            const extensionDaysInput = document.querySelector(`.offerExtension-input .amount input[type="text"]:not([type=""]`);
            extensionDaysInput.value = daysToExtend;
            extensionDaysInput.dispatchEvent(new Event('input', { bubbles: true }));
            extensionDaysInput.dispatchEvent(new Event('change', { bubbles: true }));
            logInfo(`Set lease extension dats to: ${daysToExtend}`);

            CurrentState = State.HAS_PROCESSED_PROP_DAYS;
        }

        if (CurrentState === State.HAS_PROCESSED_PROP_DAYS) {
            if ((price / daysToExtend) !== propertyGuide.suggestedDailyRent) {
                const costExtensionLabel = document.querySelector(`.offerExtension-input .cost label.title`);
                costExtensionLabel.style.color = 'red';
            }

            CurrentState = State.HAS_PROCESSED_PROP_COST_LABEL;
        }

        if (CurrentState === State.HAS_PROCESSED_PROP_COST_LABEL) {
            if ((price / daysToExtend) !== propertyGuide.suggestedDailyRent) {
                const costExtensionContainer = document.querySelector(`.offerExtension-input li.cost`);
                costExtensionContainer.style.border = "thin solid red";
            }
        }

        CurrentState = State.WAITING_FOR_URL_MATCH;
    }

    function isLocationUrlOfferExtension() {
        return /#\/p=options&ID=.+&tab=offerExtension$/.test(location.hash);
    }

    function isLocationUrlLeaseNewProperty() {
        return /#\/p=options&ID=.+&tab=lease$/.test(location.hash);
    }

    function initUrlWatchers() {
        CurrentState = State.INIT_URL_WATCHERS_IN_PROGRESS;

        window.addEventListener('hashchange', (info) => {
            if (isLocationUrlOfferExtension()) {
                logInfo(`Page changed hash, new page url matches (${location.hash})`);
                CurrentState = State.FOUND_URL_OFFER_EXTENTION_MATCH_TO_PROCESS;
            }

            if (isLocationUrlLeaseNewProperty()) {
                logInfo(`Page changed hash, new page url matches (${location.hash})`);
                CurrentState = State.FOUND_URL_LEASE_NEW_PROPERTY_MATCH_TO_PROCESS;
            }
        });

        if (isLocationUrlOfferExtension()) {
            logInfo(`Initial page url matches (${location.hash})`);
            CurrentState = State.FOUND_URL_OFFER_EXTENTION_MATCH_TO_PROCESS;
            return;
        }

        if (isLocationUrlLeaseNewProperty()) {
            logInfo(`Initial page url matches (${location.hash})`);
            CurrentState = State.FOUND_URL_LEASE_NEW_PROPERTY_MATCH_TO_PROCESS;
            return;
        }

        CurrentState = State.WAITING_FOR_URL_MATCH;
    }

    async function main() {
        logInfo(`main(): START`);

        const LOOP_INTERVAL_MS = 50;
        setInterval(() => {
            switch (CurrentState) {
                case State.START_UP:
                    initApiKey();
                    break;
                case State.INIT_API_KEY_IN_PROGRESS:
                    logInfo(`main(): nothing to do for state=INIT_API_KEY_IN_PROGRESS`);
                    break;
                case State.INIT_API_KEY_COMPLETE:
                    initKeyOwnerInfo();
                    break;
                case State.INIT_KEY_OWNER_IN_PROGRESS:
                    logInfo(`main(): nothing to do for state=INIT_KEY_OWNER_IN_PROGRESS`);
                    break;
                case State.INIT_KEY_OWNER_COMPLETE:
                    initOwnedProperties();
                    break;
                case State.INIT_OWNED_PROPERTIES_IN_PROGRESS:
                    logInfo(`main(): nothing to do for state=INIT_OWNED_PROPERTIES_IN_PROGRESS`);
                    break;
                case State.INIT_OWNED_PROPERTIES_COMPLETE:
                    initUrlWatchers();
                    break;
                case State.INIT_URL_WATCHERS_IN_PROGRESS:
                    logInfo(`main(): nothing to do for state=INIT_URL_WATCHERS_IN_PROGRESS`);
                    break;
                case State.WAITING_FOR_URL_MATCH:
                    logInfo(`main(): nothing to do for state=WAITING_FOR_URL_MATCH`);
                    break;
                case State.FOUND_URL_OFFER_EXTENTION_MATCH_TO_PROCESS:
                    setRentalExtensionPrices();
                    break;
                case State.PROCESSING_URL_MATCH:
                    setRentalExtensionPrices();
                    break;
                case State.FOUND_URL_LEASE_NEW_PROPERTY_MATCH_TO_PROCESS:
                case State.PROCESSING_URL_LEASE_NEW_PROPERTY_MATCH:
                case State.HAS_FOUND_ADD_PROP_MARKET_DIV:
                case State.HAS_FETCHED_PROPERTY_INFO_ADD_MARKET:
                case State.HAS_PROCESSED_ADD_PROP_MARKET_COST:
                    setAddRentalMarketPropertyPrices();
                    break;
                default:
                    logInfo(`main(): nothing to do for state=${CurrentState}`);
                    break;
            }
                
        }, LOOP_INTERVAL_MS);
    }

    main();
})();