// ==UserScript==
// @name         WDFW Overabundant Lakes & Trails KML Exporter
// @namespace    http://tampermonkey.net/
// @version      2025-05-09
// @description  Downloads all lakes and trails near overabundant lakes, with resume and KML export.
// @match        https://wdfw.wa.gov/fishing/locations/high-lakes/overabundant?name=&species=
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wa.gov
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/mapbox-polyline/1.1.1/polyline.min.js
// @connect      alltrails.com
// @connect      wdfw.wa.gov
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/534119/WDFW%20Overabundant%20Lakes%20%20Trails%20KML%20Exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/534119/WDFW%20Overabundant%20Lakes%20%20Trails%20KML%20Exporter.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let TRAIL_RADIUS_MILES = GM_getValue('trailRadius', 5);
  let style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
         #gmky_panel {
          position: fixed;
          top: 10px;
          right: 10px;
          z-index: 9999;
          background: #fff;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          width:12em;
          height: 12.5em;
          display: flex;
          flex-direction: column;
        }
        #gmky_panel > div {
          display: inline-block;
          vertical-align: bottom;
          height: 1.5em;
          margin-top: .5em;
        }
        #gmky_panel label {
          font-weight:bolder;
          display: inline-block;
        }
        #gmky_panel > div > label {
          width:6em;
        }

        #gmky_panel select {
          font-size:10pt;
          display: inline-block;
          width:2.25em;
          height:auto;
          text-align-last:center;
          padding: 0;

        }
        #status-bar {
          margin-top:0em;
          font-size = '14px';
          color = '#333';
        }
        #status-bar label{
          width: 3em;
        }
        #status-bar div span{
          display: inline-block;
          text-align: right;
        }
        #status-bar div b{
          display: inline-block;
          width: 1em;
          text-align:center;
        }
        #status-bar div a{
          font-size: 8pt;
          text-decoration:none;
        }
        #status-bar div a:hover{
          text-decoration: underline;
        }
        .gmky_button {
            padding: 10px 15px;
            background: #4CAF50;
            color: white;
            border: none;
            font-size: 16px;
            cursor: pointer;
            margin-bottom:.75em;
        }

    `;
    document.head.appendChild(style);



  // --- UI Setup ---
  function addButtons() {
    const panel = document.createElement('div');
    panel.id = 'gmky_panel';

    // Lake Button
    const lakeBtn = document.createElement('button');
    lakeBtn.textContent = (isLakesLoaded()) ? 'Lake KML' : 'Load Lakes';
    lakeBtn.id = 'gmky_lake_button';
    lakeBtn.classList.add("gmky_button");
    lakeBtn.onclick = handleLakeButton;
    panel.appendChild(lakeBtn);

    const trailRadiusDiv = document.createElement('div');
    trailRadiusDiv.innerHTML = `
     <span>
       <label for="trail-radius-select">Trail Radius:</label>
       <span>
         <select id="trail-radius-select" class="status-dropdown">
           <option value=".5">1/2</option>
           <option value=".75">3/4</option>
           <option value="1">1</option>
           <option value="2">2</option>
           <option value="3">3</option>
           <option value="4">4</option>
           <option value="5">5</option>
         </select>
         mile(s)
       </span>
     </span>
   `;

   panel.appendChild(trailRadiusDiv);
   const select = trailRadiusDiv.querySelector('#trail-radius-select');
     select.onchange = (e) =>{
            e.preventDefault();
            GM_deleteValue('trails');
            GM_deleteValue('trailState');
            GM_deleteValue('trailMaps');
            let trbtn = document.getElementById('gmky_trail_button');
            if (trbtn) trbtn.textContent = 'Load Trails';
            GM_setValue('trailRadius', e.target.value);
            TRAIL_RADIUS_MILES = e.target.value;
            updateStatusBar();
        };

    // Trail Button
    const trailBtn = document.createElement('button');
    trailBtn.textContent = (isTrailLoaded()) ? 'Trail KML' : 'Load Trails';
    trailBtn.id = 'gmky_trail_button';
    trailBtn.classList.add("gmky_button");
    trailBtn.onclick = handleTrailButton;
    panel.appendChild(trailBtn);

    document.body.appendChild(panel);

    // Status bar
    const statusDiv = document.createElement('div');
    statusDiv.id = 'status-bar';
    const lakeDiv = makeStatusDiv('lakes');
    const trailsDiv = makeStatusDiv('trails');
    statusDiv.appendChild(lakeDiv);
    statusDiv.appendChild(trailsDiv);
    panel.appendChild(statusDiv);

    updateStatusBar();
  }

    function makeStatusDiv(name) {
        const labelName = name.charAt(0).toUpperCase() + name.slice(1);
        const div = document.createElement('div');
        div.innerHTML = `
      <label>${labelName}:</label>
      <span id="${name}-loaded">0</span>
      <b>/</b>
      <span id="${name}-total">0</span>
      <span>
        <a href="#" class="status-clear">(clear)</a>
      </span>
    `;

        // Attach the onclick handler to the (clear) link
        const clearLink = div.querySelector('.status-clear');
        clearLink.addEventListener('click', function(e) {
            e.preventDefault(); // Prevents page jump
            switch (name) {
                case 'lakes':{
                    GM_deleteValue('lakes');
                    GM_deleteValue('lakeState');
                    let lkbtn = document.getElementById('gmky_lake_button');
                    if (lkbtn) lkbtn.textContent = 'Load Lakes';
                }
                case 'trails':{
                    GM_deleteValue('trails');
                    GM_deleteValue('trailState');
                    GM_deleteValue('trailMaps');
                    let trbtn = document.getElementById('gmky_trail_button');
                    if (trbtn) trbtn.textContent = 'Load Trails';
                    break;
                }
            }
            updateStatusBar();
        });

        return div;
    }

  // --- Status Bar ---
  function updateStatusBar() {
    const trailMaps = GM_getValue('trailMaps', []);
    const lakeState = GM_getValue('lakeState', { loaded: 0, total: 0, page: 0 });
    const trailState = GM_getValue('trailState', { loaded: 0, total: 0, lakeIndex: 0 });
    const trailRadius = GM_getValue('trailRadius', 5);
    document.getElementById('lakes-loaded').textContent = lakeState.loaded;
    document.getElementById('lakes-total').textContent = lakeState.total;
    document.getElementById('trails-loaded').textContent = trailMaps.length;
    document.getElementById('trails-total').textContent = trailState.total;
    document.getElementById('trail-radius-select').value = trailRadius;
  }

  function isLakesLoaded(){
    let lakes = GM_getValue('lakes', []);
    let { loaded, total, page } = GM_getValue('lakeState', { loaded: 0, total: 0, page: 0 });
    return (total === lakes.length && total !== 0)
  }

  // --- Lake Handling ---
  async function handleLakeButton(e) {
    const btn = e.target;
    if (btn.textContent === 'Lake KML') {
      const lakes = GM_getValue('lakes', []);
      downloadLakeKML(lakes);
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Loading Lakes...';

    let lakes = GM_getValue('lakes', []);
    let { loaded, total, page } = GM_getValue('lakeState', { loaded: 0, total: 0, page: 0 });

    try {
        const footer = document.querySelector('div.view-footer');
        total = (!footer) ? 0 : parseInt(footer.textContent.match(/of\s+(\d+)/i)[1]);
        GM_setValue('lakeState', { loaded, total, page });
        updateStatusBar();
    } catch(e){}

    const lastPageLink = document.querySelector('.pager__item--last a');
    const pages = lastPageLink ? parseInt(lastPageLink.href.match(/page=(\d+)/)[1]) + 1 : 1;

    for (let p = page; p < pages; p++) {
      const pageLakes = await fetchLakePage(p);
      let { loaded, total, page } = GM_getValue('lakeState', { loaded: 0, total: 0, page: 0 });
      GM_setValue('lakeState', { loaded, total, page: p + 1 });
    }

    btn.textContent = 'Lake KML';
    btn.disabled = false;
  }

  function fetchLakePage(page) {
    return new Promise((resolve, reject) => {
      const url = `https://wdfw.wa.gov/fishing/locations/high-lakes/overabundant?name=&species=&page=${page}`;
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        onload: async (response) => {
          let lakes = GM_getValue('lakes', []);
          let { loaded, total, page } = GM_getValue('lakeState', { loaded: 0, total: 0, page: 0 });
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.responseText, 'text/html');
          const rows = doc.querySelectorAll('table tbody tr');
          for (const row of rows) {
            const cells = row.querySelectorAll('td');
            const name = cells[0].textContent.trim();
            const href = cells[0].querySelector('a')?.href || '';
            const acres = cells[1].textContent.trim();
            const elevation = cells[2].textContent.trim();
            const county = cells[3].textContent.trim();
            const lat = cells[4].querySelectorAll('span')[0]?.textContent.trim() || '';
            const long = cells[4].querySelectorAll('span')[1]?.textContent.trim() || '';
            const species = await fetchFishSpecies(href);
            lakes.push({ name, href, acres, elevation, county, lat, long, species });
            loaded++;
            GM_setValue('lakes', lakes);
            GM_setValue('lakeState', { loaded, total, page });
            updateStatusBar();
          }
          resolve(lakes);
        },
        onerror: reject
      });
    });
  }

  function fetchFishSpecies(lake_url) {
    return new Promise((resolve, reject) => {
      if (!lake_url) return resolve('');
      GM_xmlhttpRequest({
        method: 'GET',
        url: lake_url,
        onload: function(response) {
          try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const speciesItems = doc.querySelectorAll('li.field-item');
            const speciesList = Array.from(speciesItems).map(item => item.innerText.trim());
            resolve(speciesList.join(', '));
          } catch (error) {
            resolve('');
          }
        },
        onerror: function() { resolve(''); }
      });
    });
  }

  function downloadLakeKML(lakes) {
    let kml = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n`;
    lakes.forEach(lake => {
      kml += `
        <Placemark>
          <name>${encodeXML(lake.name)}</name>
          <description><![CDATA[
            County: ${encodeXML(lake.county)}<br/>
            Elevation: ${encodeXML(lake.elevation)}<br/>
            Acres: ${encodeXML(lake.acres)}<br/>
            Species: ${encodeXML(lake.species)}
          ]]></description>
          <Point>
            <coordinates>${lake.long},${lake.lat},0</coordinates>
          </Point>
        </Placemark>
      `;
    });
    kml += `</Document>\n</kml>`;
    saveKML(kml, 'lakes.kml');
  }

  function isTrailLoaded(){
    let trails = GM_getValue('trails', []);
    let { loaded, total, lakeIndex } = GM_getValue('trailState', { loaded: 0, total: 0, lakeIndex: 0 });
    const trailMaps = GM_getValue('trailMaps', []);
    const lakes = GM_getValue('lakes', []);
    return (lakes.length === lakeIndex && trailMaps.length === total && total !== 0)
  }
  async function handleTrailButton(e) {
    const btn = e.target;
    if (btn.textContent === 'Trail KML') {
        const trailMaps = GM_getValue('trailMaps', []);
        ["Hard", "Moderate", "Easy"].forEach((difficulty)=>{downloadTrailKML(trailMaps.filter((t)=>{return t.details.difficulty===difficulty}),difficulty)});
        return;
    }
    btn.disabled = true;
    btn.textContent = 'Loading Trails...';

    let trails = GM_getValue('trails', []);
    let { loaded, total, lakeIndex } = GM_getValue('trailState', { loaded: 0, total: 0, lakeIndex: 0 });

    const lakes = GM_getValue('lakes', []);
    if (lakes.length === 0) {
        alert('Load lakes first!');
        btn.disabled = false;
        btn.textContent = 'Load Trails';
        return;
    }

    // Always start with a fresh Set for unique slugs
    let uniqueSlugs = new Set(trails.map(t => t.slug));
    // Set initial total for the status bar
    GM_setValue('trailState', { loaded, total: uniqueSlugs.size, lakeIndex });
    updateStatusBar();

    for (let i = lakeIndex; i < lakes.length; i++) {
        const lake = lakes[i];
        const location = getBoundingBox(parseFloat(lake.lat), parseFloat(lake.long), TRAIL_RADIUS_MILES);
        const foundTrails = await fetchSearchResults(location);

        // Track unique slugs in real-time
        let newThisLake = 0;
        for (const t of foundTrails) {
            if (!uniqueSlugs.has(t.slug)) {
                uniqueSlugs.add(t.slug);
                trails.push({ ...t, lakeName: lake.name });
                newThisLake++;
            }
        }
        total = uniqueSlugs.size;

        // Save progress and update status bar after each lake
        GM_setValue('trails', trails);
        GM_setValue('trailState', {
            loaded,
            total,
            lakeIndex: i + 1
        });
        updateStatusBar();
    }

    await fetchTrailData(trails);

    btn.textContent = 'Trail KML';
    btn.disabled = false;
    GM_setValue('trailState', { loaded, total, lakeIndex: lakes.length });
    updateStatusBar();
  }


  function getBoundingBox(lat, lng, miles) {
    const milesPerLatDegree = 69.0;
    const milesPerLngDegree = 69.0 * Math.cos(lat * Math.PI / 180);
    const halfSideMiles = miles / 2;
    return {
      topLeft: { lat: lat + halfSideMiles / milesPerLatDegree, lng: lng - halfSideMiles / milesPerLngDegree },
      bottomRight: { lat: lat - halfSideMiles / milesPerLatDegree, lng: lng + halfSideMiles / milesPerLngDegree }
    };
  }

  function fetchSearchResults(location) {
    return new Promise((resolve, reject) => {
      const body = {
        filters: {},
        location: { mapRotation: 0, ...location },
        recordTypesToReturn: ["trail"],
        sort: "best_match",
        recordAttributesToRetrieve: ["ID", "name", "slug"],
        resultsToInclude: ["searchResults"]
      };
      GM_xmlhttpRequest({
        method: "POST",
        url: "https://www.alltrails.com/api/alltrails/explore/v1/search?",
        data: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          "Referer": "https://www.alltrails.com/"
        },
        onload: function (response) {
          try {
            if(response.responseText.includes('captcha')){
                alert('Alltrails thinks you are a bot. Navigate to their page and do a captcha');
                reject('Alltrails thinks you are a bot. Navigate to their page and do a captcha');
            } else {
                const json = JSON.parse(response.responseText);
                resolve(json.searchResults || []);
            }
          } catch (e) {
            reject(e);
          }
        },
        onerror: reject
      });
    });
  }

  async function fetchTrailData(trails) {
    for (const trail of trails) {
      try {
        const trailMaps = GM_getValue('trailMaps', []);
        if(!trailMaps.some(obj => obj.slug === trail.slug)){
            let {loaded, total, lakeIndex} = GM_getValue('trailState', {});
            const [map, html] = await Promise.all([
                fetchTrailMapData(trail.slug),
                fetchTrailDetails(trail.slug)
            ]);
            const details = extractTrailDetails(html);
            trailMaps.push({ slug: trail.slug, map: map.data, details });
            GM_setValue('trailMaps', trailMaps);
            GM_setValue('trailState', { loaded: loaded+1, total, lakeIndex });
            updateStatusBar();
        }
      } catch (e) {}
    }
  }

  function fetchTrailDetails(slug) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.alltrails.com/${slug}`,
        onload: res => resolve(res.responseText),
        onerror: reject
      });
    });
  }

  function fetchTrailMapData(slug) {
    return new Promise((resolve, reject) => {
      const mapSlug = slug.replace('trail/', 'explore/trail/');
      GM_xmlhttpRequest({
        method: 'GET',
        url: `https://www.alltrails.com/${mapSlug}?mobileMap=false&initFlyover=true&flyoverReturnToTrail`,
        onload: response => {
          const match = response.responseText.match(/<div data-react-class="SearchApp" data-react-props="({.+?})"/);
          if (match && match[1]) {
            try {
              const props = JSON.parse(match[1].replace(/&quot;/g, '"'));
              resolve({ slug, data: props.initialExploreMap });
            } catch (e) {
              reject(e);
            }
          } else {
            reject(new Error("Map data not found"));
          }
        },
        onerror: reject
      });
    });
  }

  function extractTrailDetails(trailHTML) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(trailHTML, 'text/html');
    const details = { length: '', elevation: '', time: '', type: '', difficulty: '' };
    const statBlocks = doc.querySelectorAll('.TrailStats_stat__O2GvM');
    statBlocks.forEach(stat => {
      const labelEl = stat.querySelector('.TrailStats_statLabel__vKMLy');
      const valueEl = stat.querySelector('.TrailStats_statValueSm__HlKIU');
      if (!labelEl) return;
      const label = labelEl.textContent.trim().toLowerCase();
      if (label.includes('length')) details.length = valueEl?.textContent.trim() || '';
      else if (label.includes('elevation')) details.elevation = valueEl?.textContent.trim() || '';
      else if (label.includes('estimated time')) details.time = valueEl?.textContent.trim() || '';
      else if (label.match(/loop|out.*back|point.*point/i)) details.type = labelEl.textContent.trim();
    });
    if (!details.type) {
      statBlocks.forEach(stat => {
        const labelEl = stat.querySelector('.TrailStats_statLabel__vKMLy');
        if (labelEl && ['loop', 'out & back', 'point to point'].includes(labelEl.textContent.trim().toLowerCase())) {
          details.type = labelEl.textContent.trim();
        }
      });
    }
    const difficultyEl = doc.querySelector('[data-testid="trail-difficulty"]');
    if (difficultyEl) details.difficulty = difficultyEl.textContent.trim();
    return details;
  }

  function downloadTrailKML(trailMaps, difficulty) {
      const MAX_SIZE = 5 * 1024 * 1024; // 5 MB in bytes
      const FILE_PREFIX = `overabundant_lake_trails-${TRAIL_RADIUS_MILES}_miles-${difficulty}_`;
      const FILE_SUFFIX = '.kml';
      const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

      let fileIndex = 0;
      let placemarks = [];
      let kmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n<Document>\n`;
      let kmlFooter = `</Document>\n</kml>`;
      let currentSize = kmlHeader.length + kmlFooter.length;

      function saveKMLFile(placemarksArr, index) {
          let kmlContent = kmlHeader + placemarksArr.join('') + kmlFooter;
          let filename = `${FILE_PREFIX}${ALPHABET[index] || index}${FILE_SUFFIX}`;
          saveKML(kmlContent, filename);
      }

      for (const { slug, map, details } of trailMaps) {
          const name = map.name;
          const waypoints = map.waypoints || [];
          const routes = map.routes || [];
          const description = `
      Difficulty: ${details.difficulty || 'N/A'}<br/>
      Length: ${details.length || 'N/A'}<br/>
      Elevation Gain: ${details.elevation || 'N/A'}<br/>
      Estimated Time: ${details.time || 'N/A'}<br/>
      Type: ${details.type || 'N/A'}<br/><br/>
      https://alltrails.com/${slug}
    `.trim();
          const color = (details.difficulty === 'Hard') ? '#ff0000ff' : ((details.difficulty === 'Moderate') ? '#ff00a5ff': '#ff00ff00')
          // Add routes as placemarks
          for (const route of routes) {
              for (const segment of route.lineSegments) {
                  const points = segment.polyline.pointsData;
                  if (typeof points === 'string') {
                      const decoded = polyline.decode(points);
                      const coords = decoded.map(p => `${p[1]},${p[0]},0`).join(' ');
                      const placemark = `
            <Placemark>
              <name>${encodeXML(name)}</name>
              <Style>
                <IconStyle>
                  <scale>1</scale>
                  <Icon>
                    <href>https://maps.google.com/mapfiles/kml/paddle/grn-blank.png</href>
                  </Icon>
                </IconStyle>
                <LineStyle>
                 <color>${color}</color>
                </LineStyle>
              </Style>
              <description><![CDATA[${description}]]></description>
              <LineString><coordinates>${coords}</coordinates></LineString>
            </Placemark>
          `;
                      if (currentSize + placemark.length > MAX_SIZE) {
                          saveKMLFile(placemarks, fileIndex);
                          fileIndex++;
                          placemarks = [];
                          currentSize = kmlHeader.length + kmlFooter.length;
                      }
                      placemarks.push(placemark);
                      currentSize += placemark.length;
                  }
              }
          }

          // Add waypoints as placemarks
          for (const waypoint of waypoints) {
              const placemark = `
        <Placemark>
          <name>${encodeXML(waypoint.name)}</name>
          <Style>
            <IconStyle>
              <scale>1</scale>
              <Icon>
                <href>https://maps.google.com/mapfiles/kml/paddle/ylw-blank.png</href>
              </Icon>
            </IconStyle>
          </Style>
          <Point>
            <coordinates>${waypoint.location.longitude},${waypoint.location.latitude},0</coordinates>
          </Point>
          <description><![CDATA[${waypoint.description || ''}]]></description>
        </Placemark>
      `;
              if (currentSize + placemark.length > MAX_SIZE) {
                  saveKMLFile(placemarks, fileIndex);
                  fileIndex++;
                  placemarks = [];
                  currentSize = kmlHeader.length + kmlFooter.length;
              }
              placemarks.push(placemark);
              currentSize += placemark.length;
          }
      }

      // Save any remaining placemarks
      if (placemarks.length > 0) {
          saveKMLFile(placemarks, fileIndex);
      }
  }


  function saveKML(kml, filename) {
    const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function encodeXML(unsafe) {
    return (unsafe && unsafe.replace) ? unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;") : '';
  }

  // --- Init ---
  function waitForTableAndCreateButtons() {
    const table = document.querySelector('table tbody');
    if (!table) {
      setTimeout(waitForTableAndCreateButtons, 500);
      return;
    }
    addButtons();
  }

  waitForTableAndCreateButtons();
})();