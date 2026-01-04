// ==UserScript==
// @name        NPM Package Size from BundlePhobia
// @namespace   Violentmonkey Scripts
// @match       https://www.npmjs.com/package/*
// @grant       GM_xmlhttpRequest
// @version     1.2
// @author      dutzi
// @license     MIT
// @description 12/12/2021, 12:45:13 PM
// @downloadURL https://update.greasyfork.org/scripts/436941/NPM%20Package%20Size%20from%20BundlePhobia.user.js
// @updateURL https://update.greasyfork.org/scripts/436941/NPM%20Package%20Size%20from%20BundlePhobia.meta.js
// ==/UserScript==

function prettyPrintSize(size) {
  if (size < 1000) {
    return size.toLocaleString('en') + ' bytes'
  } else {
    return (Math.floor(size / 100) / 10).toLocaleString('en') + ' kB'
  }
}

const interval = setInterval(async () => {
  const container = document.querySelector('[title="Copy Command to Clipboard"]').parentElement.parentElement
  
  if (!container) {
    return
  }
  
  const el = document.createElement('a')
  el.innerHTML = 'Fetching stats from BundlePhobia...'
  container.prepend(el)  

  clearInterval(interval)
  
  let prevLocation = '';
  
  setInterval(updateStats, 100)
  updateStats()
  
  function updateStats() {
    if (prevLocation === window.location.href) {
      return
    }
    
    prevLocation = window.location.href;
    
    const packageName = window.location.href.split('?')[0].split('/').slice(4).join('/')

    el.href = `https://bundlephobia.com/package/${packageName}`
    
    Object.assign(el.style, {
      textDecoration: 'none',
      display: 'block',
      border: '2px solid #65c3f8',
      color: '#65c3f8',
      padding: '0.75rem 1rem',
      borderRadius: '4px',
      transition: 'all 0.5s ease-out'
    })

    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://bundlephobia.com/api/size?package=${packageName}`,
      onload: ({response}) => {
        const data = JSON.parse(response);
        const { size, gzip } = data;
        el.innerHTML = `Size: <strong>${prettyPrintSize(size)}</strong>, Gzipped: <strong>${prettyPrintSize(gzip)}</strong>`  
      }
    })    
  }
  
}, 100)
