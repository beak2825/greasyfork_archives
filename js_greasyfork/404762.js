// ==UserScript==
// @name        Remove munk-scripts
// @version     1
// @run-at      document-start
// @match       https://utopia-game.com/*
// @description Cleans utopia-game.com from munkbot
// @namespace https://greasyfork.org/users/581317
// @downloadURL https://update.greasyfork.org/scripts/404762/Remove%20munk-scripts.user.js
// @updateURL https://update.greasyfork.org/scripts/404762/Remove%20munk-scripts.meta.js
// ==/UserScript==

const createElementBackup = document.createElement
document.createElement = function(...args) {
    // If this is not a script tag, bypass
    if (args[0].toLowerCase() !== 'script') {
        // Binding to document is essential
        return createElementBackup.bind(document)(...args)
    }
    const scriptElt = createElementBackup.bind(document)(...args)

    const originalSetAttribute = scriptElt.setAttribute.bind(scriptElt)

    // Define getters / setters to ensure that the script type is properly set
    Object.defineProperties(scriptElt, {
        'src': {
            get() {
                return scriptElt.getAttribute('src')
            },
            set(value) {
                if (/\/stable\.js/.test(value)) {
                    originalSetAttribute('type', 'javascript/blocked')
                }
                originalSetAttribute('src', value)
                return true
            }
        },
        'type': {
            set(value) {
                const typeValue =
                      (/\/stable\.js/.test(scriptElt.src)) ?
                      'javascript/blocked' :
                value
                originalSetAttribute('type', typeValue)
                return true
            }
        }
    })

    // Monkey patch the setAttribute function so that the setter is called instead.
    // Otherwise, setAttribute('type', 'whatever') will bypass our custom descriptors!
    scriptElt.setAttribute = function(name, value) {
        if(name === 'type' || name === 'src') {
            scriptElt[name] = value
        } else {
            HTMLScriptElement.protytope.setAttribute.call(scriptElt, name, value)
        }
    }
    return scriptElt
}


const observer = new MutationObserver(mutations => {
    mutations.forEach(({ addedNodes }) => {
        addedNodes.forEach(node => {
            // For each added script tag
            if(node.nodeType === 1 && node.tagName === 'SCRIPT') {
                const src = node.src || ''
                const type = node.type
                if (/\/stable\.js/.test(src)) {
                    console.log('found munk, byebye');
                    // If the src is inside your blacklist
                    node.type = 'javascript/blocked'

                    // Unnecessary, but cleaner: remove the node from the DOM
                    node.parentElement.removeChild(node);
                }
            }
        })
    })
})

// Starts the monitoring
observer.observe(document.documentElement, {
    childList: true,
    subtree: true
})


// ==UserScript==
// @name        demo-scriptreplace
// @include     http://example.com/*
// @version     1
// @run-at      document-start
// ==/UserScript==

window.addEventListener('beforescriptexecute',
  function(event)
  {
    var originalScript = event.target;

    // debug output of full qualified script url
    console.log('script detected:', originalScript.src);

    // script ends with 'originalscript.js' ?
    // you can test as well: '<full qualified url>' === originalScript.src
    if(/\/originalscript\.js$/.test(originalScript.src))
    {
      var replacementScript = document.createElement('script');
      replacementScript.src = 'replacementscript.js';

      originalScript.parentNode.replaceChild(replacementScript, originalScript);

      // prevent execution of the original script
      event.preventDefault();
    }
  }
);