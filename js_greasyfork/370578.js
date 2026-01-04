// ==UserScript==
// @name         OMG Beau Peep! Reader
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Read comics more easily with keyboard shortcuts and no distracting content
// @author       You
// @match        http://www.omgbeaupeep.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370578/OMG%20Beau%20Peep%21%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/370578/OMG%20Beau%20Peep%21%20Reader.meta.js
// ==/UserScript==

(function() {
    console.info('beautifying beau peep...')
    var state
    var img
    var imageStore = [] // [{prev, next, img}, {}, ...]

    // inject the scaffolding
    var fragment = document.createDocumentFragment()
    img = document.createElement('img')
    var classAttribute = document.createAttribute('class')
    classAttribute.value = 'Reader-image'
    img.setAttributeNode(classAttribute)
    fragment.appendChild(img)
    document.body.insertBefore(fragment, document.body.firstChild)

    // do the first run of injection
    state = docToObj(document, window.location.href)
    imageStore.push(state)
    updateImage(state.img)
    fetchPage(state.next)
    fetchPage(state.prev)

    window.setTimeout(function() {
        try {
            var toBeRemoved = [].filter.call(document.body.children, function(e) {return !e.classList.contains('Reader-image')})
            toBeRemoved.forEach(function(removeMe) {
                removeMe.remove()
            })
        } catch (e) {}

        setupHandlers()
    }, 500)

    function setupHandlers() {
        document.onkeydown = undefined
        document.addEventListener('keyup', handleKeyup)
    }

    function handleKeyup(e) {
        e.stopImmediatePropagation()

	    switch (e.key) {
		    case 'ArrowLeft':
		        getImage(state.prev)
	    	    return

    		case 'ArrowRight':
		        getImage(state.next)
	    	    return
    	}
    }

    function getImage(url) {
        // show the requested image, and prefetch the next and prev if not already cached

        var obj = imageStore.find(function(e) { return e.url === url })
        if (!obj) return
        state = obj
        updateImage(state.img)
        window.history.pushState({},"", state.url);

        var prev = imageStore.find(function(e) { return e.url === state.prev })
        var next = imageStore.find(function(e) { return e.url === state.next })

        if (!prev) {
           fetchPage(state.prev)
        }
        if (!next) {
           fetchPage(state.next)
        }
    }

    function fetchPage(url) {
        if (!url) return

        var xhr = new XMLHttpRequest()
        xhr.onreadystatechange = handleXHR
        xhr.open('GET', url, true)
        xhr.responseType = "document"
        xhr.send()

        function handleXHR() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    var obj = docToObj(xhr.responseXML, xhr.responseURL)
                    imageStore.push(obj)
                    // actually HTTP fetch the image
                    var imgxhr = new XMLHttpRequest()
                    imgxhr.open('GET', obj.img, true) // FIXME will this use the cache if possible?
                    imgxhr.send()
                } else {
                    img['src'] = 'something broke'
                    console.error('unsuccessful ajax attempt, could not load next image')
                }
            }
        }
    }


    function docToObj(doc, url) {
        var picElement = doc.querySelector('img.picture')
        var nextUrl = picElement.parentElement['href'] + '/'
        var previousUrl = doc.querySelector('select[name=page]').previousElementSibling['href']
        var imageUrl = picElement['src']

        previousUrl && (previousUrl += '/')

        return {url: url, next: nextUrl, prev: previousUrl, img: imageUrl}
    }

    function updateImage(url) {
        img['src'] = url
        window.scrollTo({top: 0})
    }

    var styles = '\
body {\
    margin: 0;\
}\
.Reader-image {\
    display: block;\
    margin: 0 auto;\
    cursor: pointer;\
';

    GM_addStyle(styles)

    console.info('done beautifying.')
})();