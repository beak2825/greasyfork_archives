// ==UserScript==
// @name         Licensed (in English)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Show if manga is licensed in English.
// @author       Santeri Hetekivi
// @match        https://mangadex.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mangadex.org
// @grant        GM.xmlHttpRequest
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/480807/Licensed%20%28in%20English%29.user.js
// @updateURL https://update.greasyfork.org/scripts/480807/Licensed%20%28in%20English%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // ID for result element.
    const ID_RESULT = "licensedInEnglishResult"

    // Colors for different results.
    const COLOR_ERROR = "yellow"
    const COLOR_LICENSED = "red"
    const COLOR_UNLICENSED = "green"

    // Milliseconds to sleep between tries.
    const MS_SLEEP = 1000

    // URL starts.
    // Start for Manga Updates series url.
    const URL_START_MANGAUPDATES = "https://www.mangaupdates.com/series"
    // Start for MangaDex title url.
    const URL_START_MANGADEX = "https://mangadex.org/title/"

    // Querys for elements.
    // Parent to store result element in.
    const QUERY_PARENT = ".title"
    // Query for getting link for Manga Updates.
    const QUERY_LINK_MANGAUPDATES = "a[href^='"+URL_START_MANGAUPDATES+"']"
    // Query for getting elements that can contain TEXT_LICENSED_IN_ENGLISH text.
    const QUERY_MANGAUPDATES_LICENSED_IN_ENGLISH = '[data-cy="info-box-licensed-header"] b'
    const QUERY_TRACK = ".font-bold.mb-2"

    // Texts.
    const TEXT_LICENSED_IN_ENGLISH = "Licensed (in English)"
    const TEXT_LICENSED_POSITIVE = "Yes"
    const TEXT_LICENSED_NEGATIVE = "No"
    const TEXT_TRACK = "Track"
    const TEXT_CONSOLE_START = "Licensed (in English):"

    // Log debug data.
    const logDebug = (...args) => {
        console.debug(TEXT_CONSOLE_START, ...args)
    }

    // Update result element.
    const updateLicensedInEnglishText = (_elementResult, _text, _color = "yellow") => {
        _elementResult.style.color = _color
        _elementResult.textContent = _text;
    }

    // Select node list with given _query.
    const selectNodeList = (_query, _document = document) => {
        const nodeList = _document.querySelectorAll(_query);
        if(!(nodeList instanceof NodeList))
        {
            throw "nodeList for query '"+_query+"' was not instance of NodeList!"
        }
        return nodeList
    }

    // Select single element.
    const selectElement = (_query) => {
        // Get node list.
        const nodeList = selectNodeList(_query);

        // Check that got only single result.
        const lengthNodeList = nodeList.length
        if(lengthNodeList !== 1)
        {
            throw "Found "+lengthNodeList+" nodes for '"+_query+"'!"
        }

        // Check that single element is instance of Element.
        const element = nodeList[0]
        if(!(element instanceof Element))
        {
            throw "Element for query "+_query+" was not instance of Element!"
        }

        // Return gotten element.
        return element
    }

    // Get element for result.
    const getElementResult = () => {
        return document.getElementById(ID_RESULT)
    }

    // Output given _error to console.
    const consoleError = (_error) => {
        console.error(TEXT_CONSOLE_START, _error)
    }

    // Handle given _error.
    const handleError = (_url, _error) => {
        // Output to console.
        consoleError(_error)

        // Get element for result.
        const elementResult = getElementResult()

        // If element result found.
        if(elementResult instanceof Element)
        {
            // Update error to result element.
            updateLicensedInEnglishText(
                elementResult,
                _error,
                COLOR_ERROR
            )
        }

        // If url given
        if(_url)
        {
            // remove url.
            urlLicensedStatus(_url, false, true, null)
        }
    }

    // Check that given _element is instance of Element.
    const checkIsElement = (_element, _name) => {
        if(!(_element instanceof Element))
        {
            throw _name+" was not instance of Element!"
        }
        return _element
    }


    // Get element with TEXT_LICENSED_IN_ENGLISH text.
    const getElementWithText = (
        _query,
        _text,
        _document = document
    ) => {
        // Loop node list.
        const nodeList = selectNodeList(_query, _document)
        let element = null
        for (let i = 0; i < nodeList.length; i++)
        {
            // Get element.
            element = checkIsElement(nodeList[i], "nodeList["+i+"]")
            // If text matches
            if (element.textContent == _text)
            {
                // return element.
                return element
            }
        }

        // No element found.
        return null
    }


    // Get element with TEXT_LICENSED_IN_ENGLISH text.
    const getElementLicensedInEnglish = (_document) => {
        // Get element for text.
        const element = getElementWithText(
            QUERY_MANGAUPDATES_LICENSED_IN_ENGLISH,
            TEXT_LICENSED_IN_ENGLISH,
            _document
        )
        // No element found.
        if (element === null)
        {
            throw "No element with text '"+TEXT_LICENSED_IN_ENGLISH+"' found!"
        }

        // Return element.
        return element
    }

    // Get text answer for licensed in english.
    const getTextLicensedInEnglish = (_document) => {
        // Get text.
        const text = checkIsElement(
            checkIsElement(
                getElementLicensedInEnglish(_document).parentElement ?? null,
                "getElementLicensedInEnglish.parentElement"
            ).nextElementSibling ?? null,
            "getElementLicensedInEnglish.parentElement.nextElementSibling"
        ).textContent.trim()

        // Check gotten text.
        if(
            text !== TEXT_LICENSED_POSITIVE
            &&
            text !== TEXT_LICENSED_NEGATIVE
        )
        {
            throw "Invalid text: "+text
        }

        // Return text.
        return text
    }

    // Handle response.
    const handleResponse = (_url, _response) => {
        // Log debug message.
        logDebug("Handling response...")
        // Get answer for licensed in english.
        logDebug("Getting licensedInEnglish text...")
        const licensedInEnglish = getTextLicensedInEnglish(
            (
                new DOMParser()
            ).parseFromString(
                _response.responseText,
                'text/html'
            )
        )

        // Get licensed.
        logDebug("Getting licensed from text "+licensedInEnglish+"...")
        let licensed = null
        if(licensedInEnglish === TEXT_LICENSED_NEGATIVE)
        {
            licensed = false
        }
        else if(licensedInEnglish === TEXT_LICENSED_POSITIVE)
        {
            licensed = true
        }
        else
        {
            throw "Invalid licensedInEnglish: "+licensedInEnglish
        }

        // Call on success.
        onSuccess(
             checkIsElement(
                getElementResult(),
                "getElementResult"
            ),
            _url,
            licensed
        )
    }

    // Handle success.
    const onSuccess = (_elementResult, _url, _licensed) => {
        // Write debug log.
        logDebug("onSuccess _url: "+_url+" _licensed: "+(_licensed ? "YES" : "NO"))
        // Update result element
        updateLicensedInEnglishText(
            _elementResult,
            (
                _licensed ?
                    TEXT_LICENSED_POSITIVE :
                    TEXT_LICENSED_NEGATIVE
            ),
            (
                _licensed ?
                    COLOR_LICENSED :
                    COLOR_UNLICENSED
            )
        )
        // Set curren url licensed status.
        urlLicensedStatus(_url, true, false, _licensed)
    }

    // Get url for Manga Updates.
    const getURLMangaUpdates = () => {
        // Init urls array
        const urls = []

        // Loop node list.
        const nodeList = selectNodeList(QUERY_LINK_MANGAUPDATES)
        for (let i = 0; i < nodeList.length; i++)
        {
            // Get href
            let href = checkIsElement(nodeList[i], "nodeList["+i+"]").href ?? null
            // If got href as string
            if (typeof href === "string")
            {
                // Trim href.
                href = href.trim()
                // If href not already in urls
                if(!urls.includes(href))
                {
                    // add href to urls.
                    urls.push(href)
                }
            }
        }

        // Check that has only one url.
        const lengthUrls = urls.length
        // If no urls found.
        if(lengthUrls === 0)
        {
            // throw error.
            throw "Manga Updates link not found!"
        }
        // If different amount than 1 links found
        if(lengthUrls !== 1)
        {
            // throw error.
            throw "Found "+lengthUrls+" Manga Updates urls: "+urls.join(",")
        }

        // Return url.
        return urls[0]
    }

    // Get current url.
    const currUrl = () => {
        const href = window.location.href ?? null
        if(
            typeof href !== "string"
            ||
            href.trim() === ""
        )
        {
            throw "Invalid url: "+href
        }
        return href
    }

    // Handle url licensed status.
    const urlLicensedStatus = (_url, _add = false, _remove = false, _licensed = null) => {
        // If _remove given
        if(_remove)
        {
            // and _add given
            if(_add)
            {
                // throw error.
                throw "Both _add and _remove given!"
            }

            // and _licensed given
            if(_licensed !== null)
            {
                // throw error.
                throw "Both _licensed and _remove given!"
            }
        }

        // If
        if(
            // is not MangaDex url
            !_url.startsWith(URL_START_MANGADEX)
            &&
            // and is not removing operation
            !_remove
        )
        {
            throw "Gotten _url was not MangaDex url: "+_url
        }


        // Init running urls.
        if(typeof urlLicensedStatus.data !== "object")
        {
            urlLicensedStatus.data = {}
        }

        // Was included already.
        const includedAlready = _url in urlLicensedStatus.data

        // Init included now to included already.
        let includedNow = includedAlready

        // If adding, not included and not wanted to remove
        if(_add && !includedNow && !_remove)
        {
            // add
            urlLicensedStatus.data[_url] = _licensed
            // and set included.
            includedNow = true
        }

        // If removing and included and does not have status
        if(_remove && includedNow && urlLicensedStatus.data[_url] === null)
        {
            // remove
            delete urlLicensedStatus.data[_url]
            // and update included now.
            includedNow = false
        }

        // If licensed given
        if(_licensed !== null)
        {
            // update status
            urlLicensedStatus.data[_url] = _licensed
            // and add to be included now.
            includedNow = true
        }

        // Debug log currently running urls.
        logDebug("urlLicensedStatus.data", urlLicensedStatus.data)

        // Return status.
        return (
            includedAlready ?
                urlLicensedStatus.data[_url] :
                undefined
        )
    }

    // Get element for track.
    const getElementTrack = () => {
        return getElementWithText(
            QUERY_TRACK,
            TEXT_TRACK
        )
    }

    // Return if needing to try again later.
    const tryAgain = (_licensedStatus) => {
        // If already running try again later.
        if(_licensedStatus === null)
        {
            return true;
        }

        // Get parent elements.
        const parentElementsLength = selectNodeList(QUERY_PARENT).length

        // If
        if(
            // no parent values found
            parentElementsLength === 0
        )
        {
            return true;
        }
        // Throw error if found other than 0 or 1 elements.
        else if(parentElementsLength !== 1)
        {
            throw "Found "+parentElementsLength+" nodes for '"+QUERY_PARENT+"'!"
        }

        // Return that track element is defined.
        return (
            getElementTrack() === null
        )
    }


    // Run logic.
    const run = (_url) => {
        // Log debug message.
        logDebug("Running "+_url+"...")

        // Get licensed status.
        const licensedStatus = urlLicensedStatus(_url, false, null)

        // Init data.
        if(typeof run.data !== "object")
        {
            run.data = {}
        }

        // Init data for given _url.
        if(!(_url in run.data))
        {
            run.data[_url] = {
                counter: 1,
                timeout: null
            }
        }

        // Debug data.
        logDebug("run.data", run.data)
        logDebug("Counter ", run.data[_url].counter)

        // If has active timeout
        if(run.data[_url].timeout !== null)
        {
            // throw error.
            throw "Already has active timeout!"
        }

        // Make sure that document is instance of HTMLDocument.
        if(!(document instanceof HTMLDocument))
        {
            throw "document was not instance of HTMLDocument!"
        }

        // If trying again.
        if(tryAgain(licensedStatus))
        {
            // Log debug message.
            logDebug("Trying again!")

            // Stop if counter is over 10.
            if(10 < run.data[_url].counter)
            {
                throw "Trying again, but counter is: "+run.data[_url].counter
            }

            // Call after timeout.
            run.data[_url].timeout = setTimeout(
                () => {
                    try
                    {
                        // Zero timeout.
                        delete run.data[_url].timeout
                        run.data[_url].timeout = null;
                        // Increment counter.
                        ++run.data[_url].counter
                        // Call run again.
                        run(_url)
                    }
                    catch(_error)
                    {
                        handleError(_url, _error)
                    }
                },
                MS_SLEEP
            );

            // Throw error.
            throw "Trying again in "+MS_SLEEP+" ms!"
        }

        // Get result element.
        let elementResult = getElementResult(ID_RESULT)

        // If no result element found.
        if(!(elementResult instanceof Element))
        {
            // Create result element.
            logDebug("Adding result element...")
            elementResult = document.createElement("p")
            elementResult.id = ID_RESULT
            selectElement(QUERY_PARENT).appendChild(elementResult);
            logDebug("Added result element.")
        }

        // If already has licensed status
        if(typeof licensedStatus === "boolean")
        {
            // just update element.
            onSuccess(
                elementResult,
                _url,
                licensedStatus
            )
            // and return.
            return
        }

        // Update result to loading.
        updateLicensedInEnglishText(
            elementResult,
            "Loading...",
            COLOR_ERROR
        )

        // Get Manga Updates page.
        logDebug("Making GET request...")
        GM.xmlHttpRequest(
            {
                method: "GET",
                url: getURLMangaUpdates(),
                headers: {
                    "Accept": "text/html"
                },
                onload: function(_response) {
                    // Handle response.
                    logDebug("onload")
                    try
                    {
                        handleResponse(_url, _response)
                    }
                    catch(_error)
                    {
                        handleError(_url, _error)
                    }
                },
                onerror: (_response) => {
                    logDebug("onerror")
                    consoleError(_response)
                    handleError(_url, _response.error ?? "Unknown error!")
                },
                ontimeout: (_response) => {
                    logDebug("ontimeout")
                    consoleError(_response)
                    handleError(_url, _response.error ?? "Unknown timeout!")
                },
                onabort: (_response) => {
                    logDebug("onabort")
                    consoleError(_response)
                    handleError(_url, _response.error ?? "Unknown timeout!")
                }
            }
        );
    }

    // After page has fully loaded.
    window.addEventListener(
        'load',
        function()
        {
            // Log debug message.
            logDebug("Page loaded!")
            // Init url.
            let url = null
            try
            {
                // Check that window.onurlchange feature is supported
                // https://www.tampermonkey.net/documentation.php#api:window.onurlchange
                if (window.onurlchange !== null)
                {
                    throw "window.onurlchange feature is not supported!"
                }

                // Add url change event.
                window.addEventListener(
                    'urlchange',
                    (_info) => {
                        // Handle urlchange.
                        logDebug("urlchange")
                        const url = _info.url
                        try
                        {
                            run(url)
                        }
                        catch(_error)
                        {
                            handleError(url, _error)
                        }
                    }
                );

                // Start running.
                logDebug("Start running!")
                url = currUrl();
                run(url)
            }
            catch(_error)
            {
                handleError(url, _error)
            }
        },
        false
    );
})();
