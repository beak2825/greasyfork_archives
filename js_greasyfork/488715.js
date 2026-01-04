// ==UserScript==
// @name            My Komoot Regions
// @name:de         Meine Komoot Regionen
// @description     Shows you all your already unlocked regions on the Komoot world map
// @description:de  Zeigt dir alle deine bereits freigeschalteten Regionen auf der Komoot Weltkarte an
// @namespace       https://github.com/tadwohlrapp
// @author          Tad Wohlrapp
// @version         0.1.2
// @license         MIT
// @homepageURL     https://github.com/tadwohlrapp/my-komoot-regions
// @supportURL      https://github.com/tadwohlrapp/my-komoot-regions/issues
// @icon            https://github.com/tadwohlrapp/my-komoot-regions/raw/main/icon.png
// @include         https://www.komoot.com/*product/regions*
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/488715/My%20Komoot%20Regions.user.js
// @updateURL https://update.greasyfork.org/scripts/488715/My%20Komoot%20Regions.meta.js
// ==/UserScript==

(function () {
  'use strict'

  unsafeWindow.komootMap = null
  let unlockedRegions = []
  let features = []
  let processedCount = 0
  let getMapTries = 0
  const lang = document.documentElement.lang

  function findObjects(object, maxTries, stopAtPrefix) {
    let tries = 0
    const visited = []
    const queue = [{
      object: object,
      path: [],
    }]

    while (queue.length > 0) {
      const next = queue.shift()

      if (!next.object || visited.includes(next.object)) {
        continue
      }

      if (next.object._mapId) {
        return next.object
      }

      visited.push(next.object)

      for (const property of Object.getOwnPropertyNames(next.object)) {
        if (stopAtPrefix && property.startsWith(stopAtPrefix)) {
          return next.object[property];
        }
        queue.push({
          object: next.object[property],
          path: [...next.path, property],
        })
      }
      if (tries++ > maxTries) {
        return null
      }
    }
    return null
  }

  function getMap() {
    if (unsafeWindow.komootMap) return
    const elements = document.getElementsByTagName('*')
    for (const el of elements) {
      if ((el.className && el.className.toString().toLowerCase().includes("map"))) {
        const react = findObjects(el, 5000, '__reactInternal')
        if (react) {
          const map = findObjects(react, 25000)
          if (map && map instanceof Object) {
            if (!unsafeWindow.komootMap) {
              console.log('Found map!')
              unsafeWindow.komootMap = map
              waitForGlobal()
            }
            break
          } else if (getMapTries < 10) {
            getMapTries++
            console.log(`Looking for map... (Attempt ${getMapTries}/10)`)
            setTimeout(() => getMap(), 500)
          }
        } else if (getMapTries < 10) {
          getMapTries++
          console.log(`Looking for map... (Attempt ${getMapTries}/10)`)
          setTimeout(() => getMap(), 500)
        }
      }
    }
  }

  function waitForGlobal() {
    unlockedRegions = [...new Map(unsafeWindow.kmtBoot.getProps().packages.models.map(region => [region.attributes.region.id, region])).values()]
    if (unlockedRegions) {
      displayHeaderText()
      processUnlockedRegions()
    } else {
      setTimeout(() => waitForGlobal(), 500)
    }
  }

  function displayHeaderText() {
    const unlockedText = () => {
      const count = unlockedRegions.length
      switch (lang) {
        case 'de':
          return count > 0
            ? `Du hast bereits ${count === 1 ? 'eine' : count} Region${count !== 1 ? 'en' : ''} freigeschaltet.`
            : `Du hast noch keine Regionen freigeschaltet.`
        default:
          return count > 0
            ? `You have unlocked ${count === 1 ? 'one' : count} region${count !== 1 ? 's' : ''} already.`
            : `You haven't unlocked any regions yet.`
      }
    }
    const availableText = () => {
      const count = unsafeWindow.kmtBoot.getProps().freeProducts.length
      switch (lang) {
        case 'de':
          return count > 0
            ? `Du kannst noch <strong>${count === 1 ? 'eine' : count}</strong> weitere Region${count !== 1 ? 'en' : ''} kostenlos freischalten! 🎉`
            : `Aktuell kannst du leider keine weiteren kostenlosen Regionen freischalten.`
        default:
          return count > 0
            ? `You can still unlock <strong>${count === 1 ? 'one' : count}</strong> more region${count !== 1 ? 's' : ''} for free! 🎉`
            : `Unfortunately, there are currently no more free regions to unlock.`
      }
    }
    document.querySelector('h2').innerHTML = unlockedText() + '<br>' + availableText()
  }

  function processUnlockedRegions() {
    const myRegionIds = unlockedRegions.map(region => region.attributes.region.id)
    const div = document.createElement('div')
    div.id = 'progress-container'
    div.classList.add('tw-text-xs', 'tw-px-3', 'tw-py-1', 'tw-overflow-y-auto', 'tw-bg-white-90')
    document.querySelector('.maplibregl-ctrl-top-left').append(div)

    switch (lang) {
      case 'de':
        div.append(`Verarbeite ${myRegionIds.length} freigeschaltete Regionen...`)
        break
      default:
        div.append(`Processing ${myRegionIds.length} unlocked regions...`)
    }

    myRegionIds.forEach(id => getGeometry(id, div))
  }

  function getGeometry(id, div) {
    const totalCount = unlockedRegions.length
    GM_xmlhttpRequest({
      method: 'GET',
      url: `https://www.komoot.com/product/regions?region=${id}`,
      data: false,
      headers: { "onlyprops": "true" },
      responseType: 'json',
      onload: resp => {

        if (resp.response) {
          const { id, name, groupId: type, geometry } = resp.response.regions[0]
          const children = Array.from(div.children)
          children.forEach(child => child.classList.remove('region--active'))

          const p = document.createElement('p')
          p.classList.add('region', 'region--active')
          div.append(p)
          p.textContent = `${processedCount + 1}/${totalCount}: ${name}`

          buildGeoObject({ id, name, type, geometry })
          processedCount++
          if (processedCount === totalCount) {
            p.classList.remove('region--active')
            drawOnMap(features)

            switch (lang) {
              case 'de':
                div.append('Fertig 👍')
                break
              default:
                div.append('Done 👍')
            }
            setTimeout(() => div.remove(), 2000)
          }
          div.scrollTo(0, div.scrollHeight)
        }
      },
    })
  }

  function buildGeoObject({ id, name, type, geometry }) {
    const geometryArr = geometry[0]
    const coordinates = []
    geometryArr.forEach(item => {
      const latLng = []
      latLng.push(item.lng)
      latLng.push(item.lat)
      coordinates.push(latLng)
    })

    const geoJson = {
      "type": "Feature",
      "properties": {
        "id": id,
        "name": name,
        "region": type === 1
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [coordinates]
      }
    }

    features.push(geoJson)
  }

  function drawOnMap(features) {
    if (!unsafeWindow.komootMap) return
    const geoJsonData = {
      "type": "FeatureCollection",
      "features": features
    }

    const source = unsafeWindow.komootMap.getSource('my_unlocked_regions')
    if (source) {
      source.setData(data)
    } else {
      unsafeWindow.komootMap.addSource('my_unlocked_regions', {
        type: 'geojson',
        data: geoJsonData
      })
    }

    unsafeWindow.komootMap.addLayer({
      'id': 'Tad-my-regions',
      'type': 'fill',
      'source': 'my_unlocked_regions',
      'layout': {},
      'paint': {
        'fill-color': [
          "case",
          ["boolean", ["get", "region"]],
          ["rgba", 16, 134, 232, 1],
          ["rgba", 245, 82, 94, 1]
        ],
        'fill-opacity': 0.333
      }
    }, "komoot-selected-marker")

  }

  function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0]
    if (!head) return
    const style = document.createElement('style')
    style.innerHTML = css
    head.append(style)
  }

  addGlobalStyle(`
  .maplibregl-ctrl-top-left {
    max-height: 100%;
    z-index: 110 !important;
  }

  #progress-container {
    line-height: 1.75;
    font-weight: bold;
  }

  #progress-container .region {
    margin: 0;
    font-weight: normal;
  }

  #progress-container .region.region--active {
    position: relative;
    display: flex;
    align-items: center;
  }

  #progress-container .region.region--active::after {
    content: '';
    box-sizing: border-box;
    display: inline-flex;
    width: 13px;
    height: 13px;
    margin-left: 8px;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: #4f850d;
    border-bottom-color: #4f850d;
    animation: spinner .6s linear infinite;
  }

  @keyframes spinner {
    to {transform: rotate(360deg);}
  }
  `)

  getMap()

})()
