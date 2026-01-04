// ==UserScript==
// @name         Wait For Selector
// @namespace    http://tampermonkey.net/
// @description  Waits for elements
// @author       Kumirei
// @include      *community.wanikani.com*
// @grant        none
// ==/UserScript==

;(function (wfs) {
    let version = '1.0.1'

    // Create new observer on body to monitor all DOM changes
    let observer = new MutationObserver(mutationHandler)
    observer.observe(document.getElementsByTagName('html')[0], { childList: true, subtree: true })

    // Interface for interacting with the library
    let interface = {
        version,
        observer: observer,
        wait: waitForSelector,
        unwait: unwaitID,
        waits: {},
        waitsByID: {},
        nextID: 0,
    }

    // Start
    installInterface()

    // Creates a new entry to search for whenever a new element is added to the DOM
    function waitForSelector(selector, callback) {
        if (!interface.waits[selector]) interface.waits[selector] = {}
        interface.waits[selector][interface.nextID] = callback
        interface.waitsByID[interface.nextID] = selector
        search(selector, true)
        return interface.nextID++
    }

    // Deletes a previously registered selector
    function unwaitID(ID) {
        delete interface.waits[interface.waitsByID[ID]][ID]
        delete interface.waitsByID[ID]
    }

    // Makes sure that the public interface is the newest version and the same as the local one
    function installInterface() {
        if (!wfs) window.wfs = interface
        else if (wfs.version < interface.version) {
            wfs.version = interface.version
            wfs.observer.disconnect()
            wfs.observer = interface.observer
            wfs.wait = interface.wait
            wfs.unwait = interface.unwait
        }
        interface = wfs || interface
    }

    // Waits until there has been more than 300 ms between mutations and then checks for new elements
    let lastMutationDate = 0 // Epoch of last mutation event
    let timeoutID = 0
    function mutationHandler(mutations) {
        let duration = Date.now() - lastMutationDate
        lastMutationDate = Date.now()
        if (duration < 300) {
            clearTimeout(timeoutID)
            timeoutID = setTimeout(() => {
                for (let selector in interface.waits) search(selector)
            }, 300)
        }
    }

    // Searches for the selector and calls the callback on the found elements
    function search(selector, all = false) {
        document.querySelectorAll(selector).forEach((e, i) => {
            let callbacks = Object.values(interface.waits[selector])
            if (all || !e.WFSFound || e.WFSFound == lastMutationDate) {
                for (let callback of callbacks) callback(e)
                e.WFSFound = lastMutationDate
            }
        })
    }
})(window.wfs)
