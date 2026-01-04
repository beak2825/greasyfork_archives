// ==UserScript==
// @name         nhentai-helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  helper for nhentai
// @author       miles
// @match        https://nhentai.net/*
// @license      MIT
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAJFBMVEVHcEwTFRZw4ABozwJfugRp0QIcKBRdtgVeugQeLBRozgJs2AEfML4gAAAAAXRSTlMAQObYZgAAAL9JREFUWMPtl9sOhDAIRDvUvf///24WuhQvXa3ErA/MgxlLOQFiTEhJhG4lK+ySM70iACfBCwCcBC8ATgUgAAEIwEEAop5cvt0FmITdgP4WWgASsXsUV07ZsL3IiV63LdRXE9j6SFqZAD7uqQ5Uw5omgeEHAMaRZoxmQJRXATqZWS2svK0CYAYot/PeFr6B1wrADnsBQGqbgCt3ep8AzHQWP+Wxhsb5Lf5IAQhAAE4K+P/OdIK90b/6+pdv1/r/Bme/ENKeu7LSAAAAAElFTkSuQmCC
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531247/nhentai-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/531247/nhentai-helper.meta.js
// ==/UserScript==
;(function () {
  'use strict'
  const items = document.querySelectorAll('.gallery')
  items.forEach((item) => {
    const a = item?.children?.[0]
    if(a?.tagName === 'A') {
      a.target = '_blank'
    }
  })
})()
