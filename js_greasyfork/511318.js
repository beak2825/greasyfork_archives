// ==UserScript==
// @name        quebps2
// @namespace   Violentmonkey Scripts
// @match       https://query.web.bps.go.id/*
// @grant       none
// @version     2.0
// @author      Karom
// @license     MIT
// @description 7/29/2024, 6:42:34 PM
// @run-at document-idle
// @require https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/511318/quebps2.user.js
// @updateURL https://update.greasyfork.org/scripts/511318/quebps2.meta.js
// ==/UserScript==


(async () => {
    window.userscript = {}
    window.kd_kab = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)').value

    const idb = await import('https://esm.sh/idb@8.0.0?bundle-deps')
    window.idb = idb

    const sheetjs = await import('https://esm.sh/xlsx@0.18.5?bundle-deps')
    window.sheetjs = sheetjs

    await run_prereqs()

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

    // document.addEventListener('click', () => {
    //   run_getData_allLOCALQuery()
    // });

  })()

  function renderButton() {
    // window.d_btn = document.createElement('button');
    // // Set attributes
    // d_btn.type = 'button';
    // d_btn.id = 'userscript-btn';
    // d_btn.classList.add('btn', 'btn-warning', 'mr-4', 'my-2');
    // d_btn.textContent = 'Rekap Semua Kueri';

    var d_ul = document.createElement('ul')
    d_ul.classList.add('c-header-nav', 'ml-4', 'mr-4', 'userscript-btn');

    var d_li = document.createElement('li')
    d_li.classList.add('c-header-nav-item', 'dropdown');

    var d_dropbtn = document.createElement('a')
    d_dropbtn.href = '#'
    d_dropbtn.setAttribute('data-toggle', 'dropdown')
    d_dropbtn.setAttribute('role', 'button')
    d_dropbtn.setAttribute('aria-haspopup', 'true')
    d_dropbtn.setAttribute('aria-expanded', 'false')
    d_dropbtn.classList.add('btn', 'btn-warning', 'text-dark', 'font-weight-bold', 'dropdown-toggle')
    d_dropbtn.style.minWidth = '180px'
    d_dropbtn.textContent = 'Rekap Kueri'

    var d_dropmenu = document.createElement('div');
    d_dropmenu.classList.add('dropdown-menu', 'dropdown-menu-right', 'pt-0');

    var d_dropitem1 = document.createElement('a')
    d_dropitem1.classList.add('dropdown-item');
    d_dropitem1.textContent = 'Semua LOCAL Query'
    d_dropitem1.onclick = async () => window.userscript.run_getData_allLOCALQuery('sep2024_utp')

    var d_dropitem2 = document.createElement('a')
    d_dropitem2.classList.add('dropdown-item');
    d_dropitem2.textContent = 'LOCAL Query Boxplot'
    d_dropitem2.onclick = async () => window.userscript.run_getData_BoxplotQuery('sep2024_utp')

    d_dropmenu.appendChild(d_dropitem1)
    d_dropmenu.appendChild(d_dropitem2)

    d_li.appendChild(d_dropbtn)
    d_li.appendChild(d_dropmenu)

    d_ul.appendChild(d_li)

    window.d_bf = document.querySelector('.c-header-nav')
    d_bf.insertAdjacentElement('afterend', d_ul)
  }
  window.renderButton = renderButton

  /**
   * Melakukan fetch query pusat sesuai dengan familinya menggunakan rawSQL
   * @param {String} queryfamily string query (sep2024_upb, sept2024_utp, sep2024_utl)
   * @param {Object} query_obj
   * @param {String} kd_kab kode kab 2 digit ("00")
   * @returns Object
   */
  async function fetchRawQuery(queryfamily = "sep2024_utp", query_obj, kd_kab = "00", page=1) {
    const response = await fetch("https://query.web.bps.go.id/resource/query/"+queryfamily+"/executeRaw", {
        "credentials": "include",
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,id;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua": "\"Not/A)Brand\";v=\"8\", \"Chromium\";v=\"126\", \"Google Chrome\";v=\"126\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-csrf-token": window.csrfToken,
          "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://st2023-query.bps.go.id/",
        "body": JSON.stringify(
            {
                "kd_prov":"18",
                "kd_kab": kd_kab,
                "raw": btoa(`${query_obj.raw}`),
                "limit": "5000",
                "page": page
            }
        ),
        "method": "POST",
        "mode": "cors"
    });
    const movies = await response.json();
    // console.log(movies.data.current_page != movies.data.last_page)
    try {
      if(movies.data.current_page != movies.data.last_page) {
        let next_page = page+1
        // console.log('data more than 5000, do next fetch', next_page)
        let next_response = await fetchRawQuery(queryfamily, query_obj, kd_kab, next_page)
        movies.data.data = [...movies.data.data, ...next_response.data.data]
        movies.data.done_page = page+1
      }
    } catch (e) {
      console.log(e)
    }
    // console.log('completed fetch', movies.data.done_page ?? 1)
    console.log( query_obj.createdDate ,"🤞 Querying:", query_obj.queryName, "🔎 Found:", movies.data?.total, movies.message ? "⛔"+movies.message : "🤘")
    return movies;
  }
  window.fetchRawQuery = fetchRawQuery


  /**
   * Melakukan unduh data object javascript ke bentuk json
   * @param {JSON} data
   * @param {String} namefile nama file yang akan disimpan (langung ditambah ekstensi .json)
   */
  function downloadJson(data, namefile) {
    var data = "text/json;charset=utf-8," + encodeURIComponent(
        JSON.stringify(data)
    );
    var a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = `${namefile}.json`;
    a.innerHTML = 'download JSON';

    var container = document.createElement('container');
    container.appendChild(a);
    a.click();
    a.remove();
  }
  window.downloadJson = downloadJson


  /**
   *  Generate Workbook
   */
  function generateWorkbookOf(data = [], res = {}) {
    // A1 Query Result of X.X {nama queri}
    // A2 Provinsi      B2 {kd_prov} {nm_prov}
    // A3 Kab/Kota      B3 {kd_kab} {nm_kab}
    // A4 Result        B4 {data.length}
    // A5 Exectime      B5 {exectime}
    // A6 [empty]
    // A7 Start Tabel

    ws2 = sheetjs.utils.json_to_sheet(data, {origin: "A7"})

    // untuk isi satu cell yakni A1
    ws2["A1"] = {t:'s', v:`Query Result of ${res.no} ${res.name}`}
    ws2["A2"] = {t:'s', v:`Provinsi`}
    ws2["B2"] = {t:'s', v:`${res.prov}`}
    ws2["A3"] = {t:'s', v:`Kab/Kota`}
    ws2["B3"] = {t:'s', v:`${res.kab}`}
    ws2["A4"] = {t:'s', v:`Result`}
    ws2["B4"] = {t:'s', v:`${data.length}`}
    ws2["A5"] = {t:'s', v:`Exectime`}
    ws2["B5"] = {t:'s', v:`${res.exectime}`}

    return ws2
  }


  /**
   *  Load queries from LOCAL Query
   */
  async function run_prereqs() {
    try {
      var db_utp = await idb.openDB("sep2024_utp_query")
      var lq_utp = await db_utp.getAll('query')
    } catch (error) {
      console.log("Kueri Local tidak ditemukan atau error", )
    } finally {
      window.queriesPatchLocal = {utp: lq_utp ?? []}
    }

    window.resultsRawPerQuery = {utp: []}
    console.log('done preparing')

  }
  window.run_prereqs = run_prereqs

  async function run_before_querying(qfamily) {
    window.kd_kab = await document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)').value
    var qf = qfamily.split("_")[1] // utp
    resultsRawPerQuery[qf] = [] // override local value
  }
  window.userscript.run_before_querying = run_before_querying


  function run_getData_allLOCALQuery(qfamily = 'sep2024_utp') {
    var qf = qfamily.split("_")[1] // utp
    run_before_querying(qfamily).then(async () => {

      console.log("getting data of", qfamily)

      // reset dlu hasil sebelumnya
      resultsRawPerQuery[qf] = []

      // tetep liat lagi di variabel ini, berubah gk nilainya
      window.kd_kab = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)').value

      // fetch semua yang combined (asumsi tidak melebihi 5000 untuk record nya)
      for (const kueri of queriesPatchLocal[qf]) {
        const res = await fetchRawQuery(qfamily, kueri, kd_kab);
        const newres = {
          ...res,
          query: { no: kueri.queryName.split(" ")[0] , query_name: kueri.queryName, updated_date: kueri.updated_date }
        };
        window.resultsRawPerQuery[qf] = [...window.resultsRawPerQuery[qf], newres];
      }

      var workbook
      workbook = sheetjs.utils.book_new()

      selectProvEl = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(1)')
      selectKabEl = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)')

      // Command untuk menambahkan sheet query
      resultsRawPerQuery[qf].filter(e => {
        // let total = e.data?.total ?? 0
        // let has_id = e.column?.findIndex(e => e.column_name == "id") != -1
        // return total > 0 && has_id
        return true
      }).forEach(vsel => {
        console.log("Append sheet query no ", vsel.query.query_name)
        let wsv_data = vsel.data.data
        let wsv_res = {
          sheetname: vsel.query.no,
          no: vsel.query.no,
          name: vsel.query.query_name,
          prov: selectProvEl.options[selectProvEl.selectedIndex].text,
          kab: selectKabEl.options[selectKabEl.selectedIndex].text ,
          exectime: resultsRawPerQuery[qf][0].exectime
        }
        let wsv = generateWorkbookOf(wsv_data, wsv_res)
         sheetjs.utils.book_append_sheet(workbook, wsv, wsv_res.sheetname)
      })

      console.log("Finishing and exporting hasil rekap", qfamily)
      sheetjs.writeFile(workbook, `${qfamily}_LOCALQuery.xlsx`)

    }).catch(err => {
      console.log('error on querying', err)

    }).finally(() => {
      console.log('success')
    })
  }
  window.userscript.run_getData_allLOCALQuery = run_getData_allLOCALQuery

  function run_getData_BoxplotQuery(qfamily = 'sep2024_utp') {
    var qf = qfamily.split("_")[1] // utp
    run_before_querying(qfamily).then(async () => {

      console.log("getting data of", qfamily)

      // reset dlu hasil sebelumnya
      resultsRawPerQuery[qf] = []

      // tetep liat lagi di variabel ini, berubah gk nilainya
      window.kd_kab = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)').value

      // fetch semua yang combined (asumsi tidak melebihi 5000 untuk record nya)
      for (const kueri of queriesPatchLocal[qf]) {
        const res = await fetchRawQuery(qfamily, kueri, kd_kab);
        const newres = {
          ...res,
          query: { no: kueri.queryName.split(" ")[0] , query_name: kueri.queryName, updated_date: kueri.updated_date }
        };
        window.resultsRawPerQuery[qf] = [...window.resultsRawPerQuery[qf], newres];
      }

      var workbook
      workbook = sheetjs.utils.book_new()

      selectProvEl = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(1)')
      selectKabEl = document.querySelector('form.form-inline:nth-child(3) > select:nth-child(2)')

      // Command untuk menambahkan sheet query
      resultsRawPerQuery[qf].forEach(vsel => {
        console.log("Append sheet query no ", vsel.query.query_name)
        let wsv_data = vsel.data.data

        // transform data first if possible
        try {
          // cek tipe data (_data or _quantil)
          if (vsel.query.query_name.endsWith('_data')) { // hanya ubah yang _data aja
            console.log(vsel.query.no, 'transforming ', vsel.query.query_name)
            wsv_data = [...vsel.data.data]
            let kode_rincian_komoditas = "b4r402" // b4r402
            let kode_rincian_terbanding = "b4r403" // b4r403
            let quantil_data = resultsRawPerQuery[qf].find(e => e.query.no == vsel.query.no.slice(0, -1)) // find 001 from string 001d
            kode_rincian_komoditas = quantil_data.column[0].column_name
            kode_rincian_terbanding = vsel.column[vsel.column.length - 1].column_name

            let new_wsv_data = wsv_data.map(e => {
              let quantil = quantil_data.data.data.find(f => f[kode_rincian_komoditas] == e[kode_rincian_komoditas])
              let new_e = {...e}
              quantil.batas_bawah = 1*quantil.q1 - 1.5 * (1*quantil.q3 - 1*quantil.q1)
              quantil.batas_atas = 1*quantil.q3 + 1.5 * (1*quantil.q3 - 1*quantil.q1)
              new_e.REMARK = (1*e[kode_rincian_terbanding] < quantil.batas_bawah)
                                             ? `outlier karena kurang dari batas bawah (${quantil.batas_bawah})`
                                             : (1*e[kode_rincian_terbanding] > quantil.batas_atas)
                                                 ? `outlier karena lebih dari batas atas (${quantil.batas_atas})`
                                                 : ""
                return new_e
            })

            wsv_data = new_wsv_data
          }
        } catch(e) {
          console.log('skip data transformation...')
        }

        let wsv_res = {
          sheetname: vsel.query.no,
          no: vsel.query.no,
          name: vsel.query.query_name,
          prov: selectProvEl.options[selectProvEl.selectedIndex].text,
          kab: selectKabEl.options[selectKabEl.selectedIndex].text ,
          exectime: resultsRawPerQuery[qf][0].exectime
        }
        let wsv = generateWorkbookOf(wsv_data, wsv_res)
         sheetjs.utils.book_append_sheet(workbook, wsv, wsv_res.sheetname)
      })

      console.log("Finishing and exporting hasil rekap", qfamily)
      sheetjs.writeFile(workbook, `${qfamily}_LOCALBoxplot.xlsx`)

    }).catch(err => {
      console.log('error on querying', err)

    }).finally(() => {
      console.log('success')
    })
  }
  window.userscript.run_getData_BoxplotQuery = run_getData_BoxplotQuery
