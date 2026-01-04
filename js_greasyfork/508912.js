// ==UserScript==
// @name        FMGF map
// @description FMGF webapp
// @match       https://static.mikage.app/map.html
// @grant       GM.log
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.xmlHttpRequest
// @version     1.3.0
// @license     MIT
// @author      neobrain
// @namespace   neobrain
// @downloadURL https://update.greasyfork.org/scripts/508912/FMGF%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/508912/FMGF%20map.meta.js
// ==/UserScript==

function fetchNonAnonymous(url) {
  GM.log(`Fetching data from ${url}`)
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
        method: "GET",
        anonymous: false,
        url: url,
        onload: async function(response) {
          let data;
          if (response.status == 200) {
            data = JSON.parse(response.response);
          } else {
            // Fall back to fetch API. Seems to be required for Greasemonkey
            data = await fetch(url);
            if (!data.ok) {
              reject(data.status);
            }
            // data = await data.json();
          }

          resolve(data);
        },
        onerror: (err) => { reject(err); }
    });
  });
}

let params = new Map(document.location.hash.length <= 1 ? [] : document.location.hash.substr(1).split('&').map(x => x.split('=')))

function update_url() {
  document.location.hash = '#' + Array.from(params.entries()).map(x => x.join('=')).join('&');
}

function update_loc(lat, lng) {
  params.set("lat", lat);
  params.set("lng", lng);
  update_url();
}

const cities = [
  ["Berlin", 52.51574, 13.40847],
  ["Montreal", 45.495227, -73.578591],
  ["Paris", 48.85825, 2.34747],
  ["Toronto", 43.6538, -79.3836],
  ["Montreal", 45.495227, -73.578591],
  ["New York", 40.69673862353155, -73.97918701171876],
];

let globlat = params.get("lat") ?? 45.495227;
let globlng = params.get("lng") ?? -73.578591;

const map = L.map('map', { zoomControl: false }).setView([globlat, globlng], params.get("zoom") ?? 15.2);

let restaurants = new Map();
let resto_cache = undefined;

function add_restaurant(result) {
  if (restaurants.has(result.id)) {
    return;
  }
  computeRating = (type, char, char2, name, div) => {
    const ratingEntry = result.ratings.find(r => r.type === type);
    const makeStarRating = (val) => "<span style='font-family: monospace'>" + char2.repeat(val) + char.repeat(5 - val) + "</span>";
    const score = ratingEntry?.rating * 5 / div;
    return [(!ratingEntry || !ratingEntry.label || ratingEntry.label === "0") ? `(no ${name})` : (makeStarRating(Math.round(score)) + " " + score.toFixed(2) + ` (${ratingEntry.label} ratings)`),
            score];
  }
  const [overallRating, _] = computeRating("overall", "☆", "★", "safety ratings", 5);
  const [safetyRating, safetyScore] = computeRating("safety", "♡", "♥", "ratings", 1);

  let label = `<a target="_blank" href="https://www.findmeglutenfree.com/biz/${result.id}"><b>${result.name}</b></a><br>`;
  label += `${result.categoriesLabel}<br><span style='color: #d23a4d'>${safetyRating}</span><br>${overallRating}<br>`;
  label += `<a target="_blank" href="geo:${result.address.lat},${result.address.lng}" style="text-decoration: none">geo link</a>`;

  if (safetyScore < 4) {
    return;
  }

  restaurants.set(result.id, result);

  const marker = L.marker([result.address.lat, result.address.lng], { autoPan: false }).addTo(map).bindPopup(label);
  if (result.showReportedDedicatedGlutenFree) {
    marker._icon.style.filter = "hue-rotate(120deg)";
  } else if (result.menuItems.includes("GF Menu")) {
    marker._icon.style.filter = "hue-rotate(60deg)";
  }
}

async function run(lat, lng) {
  if (!resto_cache) {
    resto_cache = new Set(JSON.parse( await GM.getValue("restos", "[]")));
    for (const result of resto_cache) {
      add_restaurant(result);
    }
  }
  globlat = lat
  globlng = lng

  // TODO: avoid query if results are already cached
  // const data = await fetchNonAnonymous(`https://api.findmeglutenfree.com/api/v3/businesses/nearby?lat=${lat}&lng=${lng}`)
  // TODO: This one is much better for the initial load, but yields fewer restaurants
  const data = await fetchNonAnonymous(`https://api.findmeglutenfree.com/api/v3/businesses/find?lat=${lat}&lng=${lng}`);

  for (const result of data.results) {
    console.log(result);
    add_restaurant(result);
    resto_cache.add(result)
  }

  GM.log(`${resto_cache.size} restaurants cached`);
  if (resto_cache.size > 10000) {
    GM.log("Clearing restaurant cache");
    resto_cache.clear();
  }
  GM.setValue("restos", JSON.stringify(Array.from(resto_cache)));
}

const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.control.scale().addTo(map);

L.Control.Search = L.Control.extend({
    onAdd: function(map) {
        var search = L.DomUtil.create('button');
        search.innerText = 'Search';
        search.style.width = '100px';
        search.onclick = () => run(map.getBounds().getCenter().lat, map.getBounds().getCenter().lng);
        return search;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.Control.Location = L.Control.extend({
    onAdd: function(map) {
        var search = L.DomUtil.create('button');
        search.innerText = 'Use GPS';
        let isUsingGPS = false;
        search.onclick = () => {
          isUsingGPS = !isUsingGPS;
          search.innerText = isUsingGPS ? 'Stop GPS' : 'Use GPS';
          if (isUsingGPS) {
            map.locate({setView: true});
          } else {
            map.stopLocate();
          }
        }
        return search;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.Control.Cities = L.Control.extend({
    onAdd: function(map) {
        var city = L.DomUtil.create('select');
        city.innerHTML = ('<option>-- Cities --</option>' + cities.map(([a, b, c]) => '<option>' + a + '</option>').join())
        city.onchange = () => {
          if (city.selectedIndex === 0) {
            return;
          }
          GM.log(city.selectedIndex);
          let [_, newlat, newlng] = cities[city.selectedIndex - 1];
          update_loc(newlat, newlng);
          // run(newlat, newlng)
          map.panTo(new L.LatLng(newlat, newlng));
        }
        return city;
    },

    onRemove: function(map) {
        // Nothing to do here
    }
});

L.control.cities = function(opts) {
    return new L.Control.Cities(opts);
}

L.control.cities({ position: 'topleft' }).addTo(map);

const search = new GeoSearch.GeoSearchControl({
  provider: new GeoSearch.OpenStreetMapProvider(),
  // style: 'bar',
});
map.addControl(search);

L.control.search = function(opts) {
    return new L.Control.Search(opts);
}
L.control.search({ position: 'bottomright' }).addTo(map);

L.control.location = function(opts) {
    return new L.Control.Location(opts);
}
L.control.location({ position: 'bottomright' }).addTo(map);

L.control.zoom().addTo(map);

// TODO: Don't make auto-fetching spam the servers
map.on('moveend', (e) => {
  const newlat = map.getBounds().getCenter().lat
  const newlng = map.getBounds().getCenter().lng
  const threshold = 1.0 // NOTE: Changed up from 0.01 so this only fires when changing cities
  if (Math.abs(newlat - globlat) > threshold ||
      Math.abs(newlng - globlng) > threshold) {
    run(newlat, newlng)
  }
  update_loc(newlat, newlng);
})

map.on('zoomend', () => {
  params.set("zoom", map.getZoom());
  update_url();
})

run(globlat, globlng);
