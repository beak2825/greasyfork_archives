// ==UserScript==
// @name        mukscript
// @namespace   Muk Scripts - Download Daftar Tabel
// @match       https://*.bps.go.id/id/statistics-table?subject=*
// @grant       none
// @version     1.1
// @author      ctrl_karom
// @license     MIT
// @description 03/06/2025, 08:09:11
// @downloadURL https://update.greasyfork.org/scripts/505730/mukscript.user.js
// @updateURL https://update.greasyfork.org/scripts/505730/mukscript.meta.js
// ==/UserScript==

(async () => {
    addCSS(`
      .rotate-infinite {
        animation: rotate-infinite 1s linear infinite;
      }

      @keyframes rotate-infinite {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `);

    let obOptions = {childList: true, subtree: true}
    var ob = new MutationObserver(muts => {
      muts.forEach(mut => {
          if (mut.type == 'childList') {
            let userscriptBtnEl = document.querySelector('.userscript-btn')
            if (!userscriptBtnEl) {
              console.log('not found, so rendering')
              renderButton()
            }
          }
      })
    })
    ob.observe(document.body, obOptions)

    // first time?
    renderButton()

})()


function addCSS(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}
window.addCSS = addCSS

function renderButton() {
    const button = document.createElement('btn');
    button.classList.add('userscript-btn', 'h-10', 'bg-main-light', 'rounded-md', 'px-4', 'transition-all', 'hover:bg-main-light-hover', 'inline-flex', 'gap-2', 'text-white', 'justify-between', 'items-center', 'max-sm:w-full', 'max-sm:justify-center');
    button.setAttribute('onclick', 'getAllTables()'); // Assuming you have an 'getAllTables' function

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('rotate-animation')

    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.setAttribute('data-prefix', 'fas');
    svg.setAttribute('data-icon', 'plus');
    svg.classList.add('svg-inline--fa', 'fa-plus');
    svg.setAttribute('role', 'img');
    svg.setAttribute('viewBox', '0 0 448 512');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('fill', 'currentColor');
    path.setAttribute('d', 'M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z');

    svg.appendChild(path);

    button.appendChild(svg);

    const textNode = document.createTextNode('Export Daftar Tabel');
    button.appendChild(textNode);

    window.d_createdinamis_btn = document.querySelector('a[href="/id/query-builder"')
    d_createdinamis_btn.insertAdjacentElement('afterend', button)
  }
window.renderButton = renderButton

async function getAllTables() {
  const svg = document.querySelector('.rotate-animation');
  svg.classList.toggle('rotate-infinite');


  window.subjects = []
  for( let kategori_el of document.querySelectorAll(".w-full.rounded-lg.bg-white")) {
    let kategori_txt = kategori_el.childNodes[0].textContent
    for( let element_a of kategori_el.querySelectorAll('a') ) {
      subjects.push({
        id: element_a.getAttribute("href").split("subject=")[1],
        kategori: kategori_txt,
        subjek: element_a.textContent
      })
    }
  }

  window.daftar_tables = []

  for (let [idx, subject] of window.subjects.entries() ) {
    console.log("do fetching", subject)
    let res = await fetchTableIds(subject.id)
    daftar_tables = [...daftar_tables, ...res.response.data[1]]
  }

  formatted_daftar_tables = daftar_tables.map(e => {
    let new_e = { ...e }
    new_e.link = `https://${window.location.host}/id/statistics-table/${new_e.tablesource}/${new_e.id}/${slugify(new_e.title)}.html`
    if (new_e.latest_period == null || new_e.oldest_period == null ) {
        new_e.type = "static"
    } else {
        new_e.type = "dynamic"
        new_e.title = `${new_e.title}, ${new_e.oldest_period}-${new_e.latest_period}`
    }
    return new_e
  })

  downloadJSONwDate(formatted_daftar_tables, 'hasil-crawling-daftar-tabel')

  svg.classList.toggle('rotate-infinite');

}
window.getAllTables = getAllTables


async function fetchTableIds(subject_id, page = 1, host_url = window.location.host ) {

  var res = await fetch(`https://${host_url}/id/statistics-table?subject=${subject_id}`, {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:129.0) Gecko/20100101 Firefox/129.0",
      "Accept": "text/x-component",
      "Accept-Language": "en-US,en;q=0.5",
      "Next-Action": "400baf157c33b7eb7ede66c0f85e6c436c57da6e24",
      "Next-Router-State-Tree": "%5B%22%22%2C%7B%22children%22%3A%5B%5B%22lang%22%2C%22id%22%2C%22d%22%5D%2C%7B%22children%22%3A%5B%22statistics-table%22%2C%7B%22children%22%3A%5B%22__PAGE__%3F%7B%5C%22subject%5C%22%3A%5C%22519%5C%22%7D%22%2C%7B%7D%2C%22%2Fid%2Fstatistics-table%3Fsubject%3D519%22%2C%22refresh%22%5D%7D%5D%7D%5D%7D%2Cnull%2Cnull%2Ctrue%5D",
      "Content-Type": "text/plain;charset=UTF-8",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1",
      "Priority": "u=4",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache"
    },
    "referrer": `https://${host_url}/id/statistics-table?subject=${subject_id}`,
    "body": `[{"locale":"id","keyword":"$undefined","subject":${subject_id},"page":${page},"perpage":100,"sortBy":"date","sortOrder":"desc"}]`,
    "method": "POST",
    "mode": "cors"
  });
  var res_txt = await res.text()
  var res_json = JSON.parse( res_txt.split("\n1:")[1] )

  if (res_json.response['data-availability'] !== "available") {
    return {response: { data:[ [],[] ] }}
  }

  if (res_json.response.data[0].page !== res_json.response.data[0].pages) {
    var new_res_json = await fetchTableIds(subject_id, page+1)
    // console.log("halaman", page+1, new_res_json)
    res_json.response.data[1] = [ ...res_json.response.data[1], ...new_res_json.response.data[1] ]
  } else {
    // console.log("halaman", page, res_json)
  }

  return res_json
}
window.fetchTableIds = fetchTableIds

function slugify(str) {
  str = str.replace(/[^a-zA-Z0-9 ]/g, '-');
  str = str.replace(/\s+/g, '-');
  str = str.toLowerCase();
  return str;
}
window.slugify = slugify

function downloadJSONwDate(data, filename) {
  const str_data = JSON.stringify(data)
  const str_date = (new Date).toISOString().slice(0,16).replace(/[-:]/g, "").replace(/T/g, "_")

  const blob = new Blob([str_data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${window.location.host}_${filename}_${str_date}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
window.downloadJSONwDate = downloadJSONwDate

